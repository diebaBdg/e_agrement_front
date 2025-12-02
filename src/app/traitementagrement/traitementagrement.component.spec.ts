import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraitementagrementComponent } from './traitementagrement.component';

describe('TraitementagrementComponent', () => {
  let component: TraitementagrementComponent;
  let fixture: ComponentFixture<TraitementagrementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TraitementagrementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraitementagrementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
