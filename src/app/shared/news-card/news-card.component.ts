import {Component, Input} from '@angular/core';
import {RouterLink} from "@angular/router";
import {NgStyle} from "@angular/common";

@Component({
    selector: 'app-news-card',
    imports: [
        RouterLink,
        NgStyle
    ],
    templateUrl: './news-card.component.html',
    styleUrl: './news-card.component.scss'
})
export class NewsCardComponent {

    @Input() newsCards: any;
    @Input() title: string | undefined;

    getBorderColorWithOpacity(color: string, opacity: number): string {
        // Assuming `color` is a valid hex code like "#3498db"
        if (color.startsWith("#")) {
            const hex = color.replace("#", "");
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
        return color; // Fallback for named colors or invalid input
    }

}
