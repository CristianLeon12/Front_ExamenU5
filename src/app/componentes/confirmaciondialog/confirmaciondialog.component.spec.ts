import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmaciondialogComponent } from './confirmaciondialog.component';

describe('ConfirmaciondialogComponent', () => {
  let component: ConfirmaciondialogComponent;
  let fixture: ComponentFixture<ConfirmaciondialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmaciondialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmaciondialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
