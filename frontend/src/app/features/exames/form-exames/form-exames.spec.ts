import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormExames } from './form-exames';

describe('FormExames', () => {
  let component: FormExames;
  let fixture: ComponentFixture<FormExames>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormExames],
    }).compileComponents();

    fixture = TestBed.createComponent(FormExames);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
