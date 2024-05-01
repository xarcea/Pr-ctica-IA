import { TestBed } from '@angular/core/testing';

import { SharedStringService } from './shared-string.service';

describe('SharedStringService', () => {
  let service: SharedStringService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedStringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
