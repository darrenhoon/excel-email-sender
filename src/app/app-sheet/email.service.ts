import { DatePipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl; //change this in the environment folder

@Injectable({providedIn: 'root'})
export class EmailsService {

  constructor(private http: HttpClient) {}


  sendConfirmationEmail(data: any[][]) {

    //let dataToSend = JSON.stringify(data);

    this.http
    .post(BACKEND_URL + 'api/emails/sendConfirmation', data)
    .subscribe(response => {
      console.log("Finished sending confirmation?");
      console.log(response);
    });
  }

  requestPayment(data: any[][]) {

    //console.log("Requesting Payment now!");
    //let dataToSend = JSON.stringify(data);

    this.http
    .post(BACKEND_URL + 'api/emails/requestPayment', data)
    .subscribe(response => {
      console.log("Finished requesting payment?");
      console.log(response);
    });
  }


}
