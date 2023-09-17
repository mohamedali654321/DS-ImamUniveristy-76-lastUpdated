import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ds-kware-video-player',
  templateUrl: './kware-video-player.component.html',
  styleUrls: ['./kware-video-player.component.scss']
})
export class KwareVideoPlayerComponent implements OnInit {
  @Input() docURL = '';
  @Input() locale = 'en';
  @Input() closeViewer: () => void;
  @Input() isMobile: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
