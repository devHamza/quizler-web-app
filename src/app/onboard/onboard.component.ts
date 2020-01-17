import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-onboard',
    templateUrl: './onboard.component.html',
    styleUrls: ['./onboard.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class OnboardComponent implements OnInit {

    questionsData: any;

    constructor() {
        this.questionsData = require(`../../assets/data/questions_data.json`);
    }

    ngOnInit() {
    }

}
