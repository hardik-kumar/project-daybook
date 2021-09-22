import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideAccountComponent } from './side-account.component';

describe('SideAccountComponent', () => {
  let component: SideAccountComponent;
  let fixture: ComponentFixture<SideAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SideAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SideAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
