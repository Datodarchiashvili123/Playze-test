import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesSkeletonComponent } from './games-skeleton.component';

describe('GamesSkeletonComponent', () => {
  let component: GamesSkeletonComponent;
  let fixture: ComponentFixture<GamesSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamesSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamesSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
