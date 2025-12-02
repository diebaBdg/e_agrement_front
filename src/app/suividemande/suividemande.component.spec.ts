import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuividemandeComponent } from './suividemande.component';

describe('SuividemandeComponent', () => {
  let component: SuividemandeComponent;
  let fixture: ComponentFixture<SuividemandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuividemandeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuividemandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
