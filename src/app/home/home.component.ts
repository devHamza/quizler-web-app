import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { MatStepper } from '@angular/material/stepper';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAnalytics} from '@angular/fire/analytics';

interface Answer {
  answer: string;
  answerId: number;
  factors: {
    id: string,
    weight: number
  }[];
}

interface QuestionAnswer {
  question: string;
  questionId: number;
  answers?: Answer[];
}
interface FireData {
  beginAt?: Date;
  endAt?: Date;
  answers?: QuestionAnswer[];
  results?: {
    name: string,
    value: number,
    percent: string
  }[];
}

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
  typeJoueur = '';
  img = '';
  back = '';
  shape = '';
  finalInt = '';
  finalDet = '';
  hauteur = '';
  marge = '';
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
  fireData: FireData = {};
  constructor(private firestore: AngularFirestore, private fireAnalytics: AngularFireAnalytics) {
    this.questionsData = require(`../../assets/data/questions_data.json`);
  }

  ngOnInit() {
    this.fireData = {
      beginAt: new Date(),
      answers: [],
      results: []
    };
    // this.fireAnalytics.logEvent('start_quiz', {at: new Date()})
    // .then(res => console.log('SUCCESS:', res), err => console.log('NO: ', err));
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

  goForward(stepper: MatStepper, ev: any, index: number) {
    if (ev.source.checked) {
      if (index === this.questionsData.questions.length - 1) {
        this.fireData.endAt = new Date();
        setTimeout(() => {
          this.calculateResults();
        }, 300);
      } else {
        setTimeout(() => {
          stepper.next();
        }, 300);
      }

    }
  }

  stepperChange(ev) {
    this.progressPercent = ev.selectedIndex * 100 / (this.questionsData.questions.length - 1);
    this.currentQuestionIndex = ev.selectedIndex < this.questionsData.questions.length ?
      ev.selectedIndex + 1 : this.questionsData.questions.length;
  }

  calculateResults() {
    let selectedFactors = [];
    let index = 0;
    for (const question of this.questionsData.questions) {
      const questionAnswer: QuestionAnswer = {
        question: question.question,
        questionId: index++,
        answers: []
      };
      if (!!question.selectedAnswer) {
        selectedFactors = selectedFactors.concat(question.selectedAnswer.factors);
        questionAnswer.answers.push({
          answer: question.selectedAnswer.label,
          answerId: question.answers.findIndex(an => an.label === question.selectedAnswer.label),
          factors: question.selectedAnswer.factors
        });
      } else {
        const userAnswers = question.answers.filter(elem => elem.selected);
        for (const answer of userAnswers) {
          selectedFactors = selectedFactors.concat(answer.factors);
          questionAnswer.answers.push({
            answer: answer.label,
            answerId: question.answers.findIndex(an => an.label === answer.label),
            factors: answer.factors
          });
        }
      }

      this.fireData.answers.push(questionAnswer);
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
    this.typeJoueur = '';
    this.img = '';
    this.shape = '';
    this.back = '';
    this.finalDet = '';
    this.finalInt = '';
    this.pourcentage = 0;
    this.hauteur = '';
    this.marge = '';
    // const resAnalytics = {};
    for (const key of resultKeys) {
      this.data.push({
        name: this.questionsData.factors[key].label,
        value: !!result[key] && result[key] > 0 ? result[key] : 0,
        techId: key,
        sentence: this.questionsData.factors[key].final_sentence,
        joueur: this.questionsData.factors[key].label,
        image: this.questionsData.factors[key].image_finale,
        pourcent: Math.round((!!result[key] && result[key] > 0 ? result[key] : 0) / 16 * 100),
        background: this.questionsData.factors[key].background_image,
        result_shape: this.questionsData.factors[key].shape,
        finalIntro: this.questionsData.factors[key].finalIntro,
        finalDetails: this.questionsData.factors[key].finalDetails,
        marge: ((Math.round((!!result[key] && result[key] > 0 ? result[key] : 0) / 16)) * 85) - 85,
        hauteur: (Math.round((!!result[key] && result[key] > 0 ? result[key] : 0) / 16)) * 85
      });
      // resAnalytics[`result_${key}`] = Math.round((!!result[key] && result[key] > 0 ? result[key] : 0) / 16 * 100) + '%';
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

      this.fireData.results = this.data.map(datum => ({
        name: datum.name,
        value: datum.value,
        percent: `${datum.pourcent}%`
      }));
    }


    this.firestore.collection('users').add(this.fireData).then(res => {
      console.log('Result added successfuly to firestore: ', res);
    }, err => {
      console.log('Error adding to firestore: ', err);
    });


    // this.fireAnalytics.logEvent('end_quiz', {
    //   beginAt: this.fireData.beginAt,
    //   endAt: this.fireData.endAt,
    //   ...resAnalytics
    // }).then(res => console.log('Success!!: ', res), err => console.log('Error!! ', err));

    this.showResults = true;
  }

  reset() {
    window.location.reload();
  }

  // Just to ignore tsLint errors...
  _window(): any {
    return window;
  }

  fbShare() {
    if (!!this._window().FB) {
      this._window().FB.ui({
        method: 'share',
        href: 'https://typologie-joueurs.firebaseapp.com',
        quote: `Moi je suis ${this.data[0].joueur} à ${this.data[0].pourcent}% et vous ?`
        // quote: `Moi je suis XXXX à XX%, et vous ?`
      }, (response) => {
        console.log('FACEBOOK RESPONSE: ', response);
      });
    } else {
      alert('FB not initialized yet!');
    }


    // using feed dialog...
    // FB.ui({
    //   method: 'feed',
    //   link: 'https://typologie-joueurs.firebaseapp.com',
    //   caption: `Moi je suis Socializer a 38%`,
    //   description: 'Description here',
    //   actions: [
    //     {
    //       name: 'Try it',
    //       link: 'https://typologie-joueurs.firebaseapp.com'
    //     }
    //   ]
    // }, (response) => {
    //   console.log('FACEBOOK RESPONSE: ', response);
    // });
  }
}
