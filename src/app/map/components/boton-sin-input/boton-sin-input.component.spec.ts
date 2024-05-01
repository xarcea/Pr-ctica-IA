import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonSinInputComponent } from './boton-sin-input.component';

describe('BotonSinInputComponent', () => {
  let component: BotonSinInputComponent;
  let fixture: ComponentFixture<BotonSinInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BotonSinInputComponent]
    });
    fixture = TestBed.createComponent(BotonSinInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
