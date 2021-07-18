import { Component } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import * as XLSX from 'xlsx';
import { environment } from "../../environments/environment";
import { EmailsService } from './email.service';

type AOA = any[][];
const BACKEND_URL = environment.apiUrl; //change this in the environment folder

@Component({
  selector: 'app-sheet',
   templateUrl: './sheet.component.html',
})

export class SheetJSComponent {
  data: AOA = [["Header1", "Header1"], ["Content", "Content"]];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'SheetJS.xlsx';

  constructor(public emailsService: EmailsService) {}

  onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      console.log(this.data);
    };
    reader.readAsBinaryString(target.files[0]);
  }


  export(): void {
    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }

  sendConfirmationEmails() {
    //console.log(this.data);

    this.emailsService.sendConfirmationEmail(this.data);

  }

}
