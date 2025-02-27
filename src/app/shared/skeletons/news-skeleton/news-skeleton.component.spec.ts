import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsSkeletonComponent } from './news-skeleton.component';

describe('NewsSkeletonComponent', () => {
  let component: NewsSkeletonComponent;
  let fixture: ComponentFixture<NewsSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
