import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {SlickCarouselModule} from "ngx-slick-carousel";
import {ItemSliderComponent} from "../../shared/item-slider/item-slider.component";
import {DealsCardsComponent} from "../../shared/blocks/deals-cards/deals-cards.component";
import {HomeService} from "./home.service";
import {RouterLink} from "@angular/router";
import {Meta, Title} from "@angular/platform-browser";
import {NewsCardComponent} from "../../shared/news-card/news-card.component";
import {SeoService} from "../../services/seo.service";

@Component({
    selector: 'app-home',
    imports: [
        NgOptimizedImage,
        SlickCarouselModule,
        ItemSliderComponent,
        DealsCardsComponent,
        RouterLink,
        NewsCardComponent
    ],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

    gamesData: any;
    sliderData: any;
    newDeals = [];
    bestDeals = [];
    newDealsFirstPart = [];
    newDealsSecondPart = [];
    bestDealsFirstPart = [];
    bestDealsSecondPart = [];
    newsCards = [];

    constructor(
        private homeService: HomeService,
        private titleService: Title,
        private metaService: Meta,
        private seoService: SeoService,
    ) {
        console.log("component");
    }

    ngOnInit() {
        this.titleService.setTitle('Game Deals - Best Discount and Offers on Top Games');
        this.updateMetaTags();
        this.homeService.getTopGameCards().subscribe((x: any) => {
            this.gamesData = x.popularGames;
            this.sliderData = x.popularGames.map((game: any) => ({
                title: game.name,
                img: game.headerImageUrl,
                price: game.lowestPriceText,
                hasPrice: game.hasPrice,
                gameId: game.gameId,
                urlName: game.urlName
            }));

            const keywords = x.popularGames.map((game: any) => game.name).join(', ');

            this.updateMetaTags(keywords);
        });
        this.homeService.getDealCards(1).subscribe((x: any) => {
            this.newDeals = x.dealCards;
            this.newDealsFirstPart = this.newDeals.slice(0, 5);  // Items from index 0 to 3
            this.newDealsSecondPart = this.newDeals.slice(5, 10); // Items from index 4 to 8
        });
        this.homeService.getDealCards(2).subscribe((x: any) => {
            this.bestDeals = x.dealCards;
            this.bestDealsFirstPart = this.bestDeals.slice(0, 5);
            this.bestDealsSecondPart = this.bestDeals.slice(5, 10);
        });
        this.homeService.getNewsCards().subscribe((x: any) => {
            this.newsCards = x.announcementCards
            console.log(this.newsCards, 'news cards');
        });
        const schemaMarkup = {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Playze Game Deals",
            "url": "https://playze.io",
            "description": "Find the best game deals and discounts for PC, PlayStation, Xbox, and more."
        };

        this.seoService.addSchemaMarkup(schemaMarkup);

    }

    updateMetaTags(keywords = '') {
        this.titleService.setTitle('Game Deals - Best Discount and Offers on Top Games');
        const description = `Find the best game deals on top titles with huge discounts! Explore daily offers and save big on the latest video games for all platforms. Don't miss out!`;
        const imageUrl = `${window.location.origin}/assets/img.png`;

        this.removeExistingMetaTags();

        this.metaService.addTags([
            {name: 'description', content: description},
            {
                name: 'keywords',
                content: `${keywords}, popular games, video game deals, new game releases, game discounts, best game deals, cheap video games, top-rated games, gaming offers, latest game discounts, game sales, PC games, console games, Xbox deals, PlayStation deals, Steam deals, game bundles, playze.io`
            },
            { property: 'og:title', content: 'Game Deals - Best Discounts and Offers on Top Games' },
            { property: 'og:description', content: description },
            { property: 'og:image', content: imageUrl },
            { property: 'og:url', content: 'https://playze.io' },
            { property: 'og:type', content: 'website' }
        ]);
    }

    removeExistingMetaTags() {
        const descriptionTag = this.metaService.getTag('name="description"');
        if (descriptionTag) {
            this.metaService.removeTag('name="description"');
        }

        const keywordsTag = this.metaService.getTag('name="keywords"');
        if (keywordsTag) {
            this.metaService.removeTag('name="keywords"');
        }

        const breadcrumbScript = document.createElement('script');
        breadcrumbScript.type = 'application/ld+json';
        breadcrumbScript.text = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://playze.io"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Games",
                    "item": "https://playze.io/games"
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": "News",
                    "item": "https://playze.io/news"
                },
            ]
        });

        document.head.appendChild(breadcrumbScript);
    }



}
