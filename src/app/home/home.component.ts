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
  typeJoueur ='';
  img='';
  back='';
  shape='';
  finalInt='';
  finalDet='';
  hauteur='';
  marge='';
  pourcentage = 0;
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

  isNextStepDisabled(index) {
    const question = this.questionsData.questions[index];
    if (!!question) {
      if (!question.multiple_answers) {
        return !!!question.selectedAnswer;
      } else {
        return question.answers.findIndex(elem => !!elem.selected) === -1;
      }
    }
    return true;
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
    this.typeJoueur ='';
    this.img='';
    this.shape='';
    this.back='';
    this.finalDet='';
    this.finalInt='';  
    this.pourcentage = 0;
    this.hauteur = '';
    this.marge='';
    for (const key of resultKeys) {
      this.data.push({
        name: this.questionsData.factors[key].label,
        value: !!result[key] && result[key] > 0 ? result[key] : 0,
        techId: key,
        sentence: this.questionsData.factors[key].final_sentence,
        joueur: this.questionsData.factors[key].label,
        image: this.questionsData.factors[key].image_finale,
        pourcent: Math.round((!!result[key] && result[key] > 0 ? result[key] : 0)/16*100),
        background: this.questionsData.factors[key].background_image,
        result_shape: this.questionsData.factors[key].shape,
        finalIntro: this.questionsData.factors[key].finalIntro,
        finalDetails: this.questionsData.factors[key].finalDetails,
        marge: (Math.round((!!result[key] && result[key] > 0 ? result[key] : 0)/16*100)-85),
        hauteur: Math.round((!!result[key] && result[key] > 0 ? result[key] : 0)/16*100)
      });
    }

    this.data = _.orderBy(this.data, ['value'], ['desc']);
    if (!!this.data[0]) {
      this.finalSentence = this.data[0].sentence;
      this.typeJoueur = this.data[0].joueur;
      this.img = this.data[0].image;
      this.back = this.data[0].background;
      this.shape = this.data[0].result_shape;
      this.finalDet = this.data[0].finalDetails;
      this.finalInt = this.data[0].finalIntro;
    }

    this.showResults = true;
  }

  reset() {
    window.location.reload();
  }
}
