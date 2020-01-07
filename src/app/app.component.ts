import { Component, OnDestroy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnDestroy {
  pageUrl = '';

  mobileQuery: MediaQueryList;

  fillerNav = [
    { link: 'home', label: 'Acceuil' },
    { link: 'map', label: 'Recherche' }
  ];

  private mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private router: Router) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);

    router.events.subscribe((val) => {
      // tslint:disable-next-line:no-string-literal
      const newUrl = val['url'];
      if (!!newUrl) {
        this.pageUrl = newUrl;
      }
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }
}
