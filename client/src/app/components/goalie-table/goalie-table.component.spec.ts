import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalieTableComponent } from './goalie-table.component';

describe('GoalieTableComponent', () => {
  let component: GoalieTableComponent;
  let fixture: ComponentFixture<GoalieTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalieTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoalieTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
