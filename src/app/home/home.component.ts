import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  questionsData: any;

  view: any[] = [];
  finalSentence = '';
  progressPercent = 0;
  currentQuestionIndex = 1;
  // options
  showLegend = true;
  showLabels = true;
  showResults = false;
  data = [];
  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };
  constructor() {
    this.questionsData = require(`../../assets/data/questions_data.json`);
  }

  ngOnInit() {
  }

  stepperChange(ev) {
    this.progressPercent = ev.selectedIndex * 100 / this.questionsData.questions.length;
    this.currentQuestionIndex = ev.selectedIndex < this.questionsData.questions.length ?
      ev.selectedIndex + 1 : this.questionsData.questions.length;
  }

  calculateResults() {
    let selectedFactors = [];
    for (const question of this.questionsData.questions) {
      if (!!question.selectedAnswer) {
        selectedFactors = selectedFactors.concat(question.selectedAnswer.factors);
      } else {
        const userAnswers = question.answers.filter(elem => elem.selected);
        for (const answer of userAnswers) {
          selectedFactors = selectedFactors.concat(answer.factors);
        }
      }
    }
    const result = {};
    for (const factor of selectedFactors) {
      if (!!result[factor.id]) {
        result[factor.id] += factor.weigth;
      } else {
        result[factor.id] = factor.weigth;
      }
    }

    // draw charts
    const resultKeys = _.keys(this.questionsData.factors);
    this.data = [];
    this.finalSentence = '';
    for (const key of resultKeys) {
      this.data.push({
        name: this.questionsData.factors[key].label,
        value: !!result[key] && result[key] > 0 ? result[key] : 0,
        techId: key,
        sentence: this.questionsData.factors[key].final_sentence
      });
    }

    this.data = _.orderBy(this.data, ['value'], ['desc']);
    if (!!this.data[0]) {
      this.finalSentence = this.data[0].sentence;
    }

    this.showResults = true;
  }

  reset() {
    window.location.reload();
  }
}
