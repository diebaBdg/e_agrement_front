import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspacedemandeurComponent } from './espacedemandeur.component';

describe('EspacedemandeurComponent', () => {
  let component: EspacedemandeurComponent;
  let fixture: ComponentFixture<EspacedemandeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EspacedemandeurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EspacedemandeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
