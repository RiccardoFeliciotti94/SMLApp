import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BidRoomPage } from './bid-room.page';

describe('BidRoomPage', () => {
  let component: BidRoomPage;
  let fixture: ComponentFixture<BidRoomPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BidRoomPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BidRoomPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
