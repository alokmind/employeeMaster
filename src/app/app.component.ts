import { Component, ViewChild, OnInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from './services/data-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'theCocktailUI';
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['empCode', 'empName', 'mobile', 'dob', 'address', 'remark', 'action'];;
  dataSource: any = [];
  today = new Date();
  employeeForm: FormGroup;
  editFlg = '0';

  constructor(private formBuilder: FormBuilder, public _apiService: DataService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.employeeForm = this.formBuilder.group({
      empCode: ['', [Validators.required]],
      empName: ['', [Validators.required]],
      address: ['', [Validators.required]],
      mobile: ['', [Validators.required, Validators.minLength(10)]],
      dob: ['', [Validators.required]],
      remark: ['', [Validators.required]],
    });

    this.showTableData();
  }

  clear(){
    this.editFlg = '0';
  }


  onSubmit() {
    if (this.employeeForm.valid) {
      this.employeeForm.value.remark = this.employeeForm
        .get('remark')
        .value.replace(/\n/g, ' ');

      let data = this.getEmpData();
      let i = -1;
      if (data.length > 0) {
        i = data.findIndex(e => e.empCode === this.employeeForm.value.empCode)
        if (i === -1) {
          data.push(this.employeeForm.value);
        } else {
          let msg = "Employee with ID: " + this.employeeForm.value.empCode + " is already registered"
          this._snackBar.open(msg, "Close", {
            duration: 2000,
            panelClass: ['mat-toolbar', 'mat-warn']
          });
        }
      } else {
        data.push(this.employeeForm.value);
      }

      if (i === -1) {
        this.saveData(data, 'save');
      }

      console.log(this.employeeForm.value)
    }
  }

  getEmpData() {
    if (localStorage.getItem('data')) {
      return JSON.parse(localStorage.getItem('data'));
    } else {
      return [];
    }
  }

  saveData(data, action = null) {
    localStorage.setItem('data', JSON.stringify(data));
    let msg;
    if (action === 'save') {
      msg = "Employee Added";
    } else if(action === 'edit') {
      msg = "Employee Updated";
    } else {
      msg = "Employee Deleted";
    }
    this._snackBar.open(msg, "Close", {
      duration: 2000,
      panelClass: ['mat-toolbar', 'mat-primary']
    });
    this.showTableData();
  }

  showTableData() {
    let element_data = this.getEmpData();

    if (element_data.length > 0) {
      setTimeout(() => {
        this.dataSource = new MatTableDataSource(element_data);
        this.dataSource.sort = this.sort;
      }, 10);
    } else {
      this.dataSource = null;
    }
  }

  deleteEmployee(id) {
    let data = this.getEmpData();
    let i = data.findIndex(e => e.empCode === id)

    if (i > -1) {
      data.splice(i, 1);
    }
    this.saveData(data);
  }

  setFormValue(id){
    let data = this.getEmpData();
    this.editFlg = data.findIndex(e => e.empCode === id);

    console.log(data[this.editFlg]);
    this.employeeForm.patchValue({
      empCode: data[this.editFlg].empCode,
      empName: data[this.editFlg].empName,
      address: data[this.editFlg].address,
      mobile: data[this.editFlg].mobile,
      dob: new Date(data[this.editFlg].dob),
      remark: data[this.editFlg].remark,
    });
  }

  update(){
    let data = this.getEmpData();
    data[this.editFlg] = this.employeeForm.value;
    this.saveData(data, 'edit');
  }
}
