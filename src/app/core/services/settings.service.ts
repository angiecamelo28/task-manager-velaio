import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';


const BASE_URL: string = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private apiUrl = 'https://tinyurl.com/api-create.php';

  constructor(private http: HttpClient) {

  }

  /**
   * Obtiene los usuarios autorizadores
   */
  public getUsersAuthorizer() {

    return this.http.get(`${BASE_URL}/usersAuthorizer`).pipe(
      map(resp => resp)
    )
  }


  /**
   * Obtiene información sobre los tipos de documentos.
   * @returns Un listado de tipos de documentos.
   */
  public getTypeOfDocuments(tipoBeneficiarie?: any) {

    return this.http.get(`${BASE_URL}/TypeOfDocuments?beneficiaryType=${tipoBeneficiarie}`).pipe(
      map(resp => resp)
    )
  }

  /**
   * Obtiene información sobre los departamentos
   * @returns Un listado con los departamentos y sus respectivos códigos.
   */
  public getDepartments() {

    return this.http.get(`${BASE_URL}/Departments`).pipe(
      map(resp => resp)
    )
  }

  /**
   * Obtiene información sobre los paises
   * @returns Un listado con los paises y sus respectivos códigos.
   */
  public getCountries() {
    return this.http.get(`${BASE_URL}/countryList`).pipe(
      map(resp => resp)
    )
  }

  /**
   * Obtiene información sobre los municipios asociados a un departamento.
   * @param department Código de departamento para realizar el filtro.
   * @returns Un listado con los municipios y sus respectivos códigos.
   */
  public getMunicipalities(department: any) {

    return this.http.get(`${BASE_URL}/MunicipalitiesByDepartments?code=` + department).pipe(
      map(resp => resp)
    )
  }

  /**
   * Obtiene información sobre los tipos de parentescos.
   * @returns Un listado con los tipos de parentescos con sus respectivos códigos.
   */
  public getRelationship() {

    return this.http.get(`${BASE_URL}/Relationship`).pipe(
      map(resp => resp)
    )
  }

  /**
   * Obtiene información sobre los tipos de géneros.
   * @returns Un listado con los tipos de géneros con sus respectivos códigos.
   */
  public getGenders() {

    return this.http.get(`${BASE_URL}/Genders`).pipe(
      map(resp => resp)
    )
  }

  /**
   * Obtiene la informacion de las sucursales segun la ciudad
   * @param city ciudad indicada en url del login
   * @returns Observable con la informacion de las sucursales
   */
  public getBranches(sede: string, bd?: string): Observable<any> {
    let url = `${BASE_URL}/Branches?sede=${sede}`;
    if (bd) {
      url += `&contractURI=${bd}`;
    }
    return this.http.get(url);
  }


  getDataBases(city: string): Observable<any> {
    return this.http.get(`${BASE_URL}/CompanyByKeyGroup?keyGroup=${city}`)
  }

  getTaxRegime(): Observable<any> {
    return this.http.get(`${BASE_URL}/RegimeType`);
  }


  public getOccupation() {

    return this.http.get(`${BASE_URL}/Occupation`).pipe(
      map(resp => resp)
    )
  }

  public getMaritalStatus() {

    return this.http.get(`${BASE_URL}/MaritalStatus`).pipe(
      map(resp => resp)
    )
  }

  public getEmployees() {

    return this.http.get(`${BASE_URL}/Employees`).pipe(
      map(resp => resp)
    )
  }

  public getUsersSap() {

    return this.http.get(`${BASE_URL}/UsersSap`).pipe(
      map(resp => resp)
    )
  }


  public getGroup() {
    return this.http.get(`${BASE_URL}/GroupByKeyGroup?keyGroup=${localStorage.getItem('location')}`).pipe(
      map(resp => resp)
    )
  }

  public updateGroup(data: any, idGroup: any, validateClinton?: any, mandatoryAttachments?: any) {
    const json = {
      "idGroup": idGroup,
      "validateClinton": validateClinton,
      "mandatoryAttachments": mandatoryAttachments,
      "jsonData": data
    }
    return this.http.patch(`${BASE_URL}/Group`, json).pipe(
      map(resp => resp)
    )
  }

  //Servicio para recortart una url
  shortenUrl(longUrl: string): Observable<string> {
    return this.http.post(this.apiUrl, { url: longUrl }, { responseType: 'text' });
  }

  public getAshDelivery(document?: any, type?: any) {
    return this.http.get(`${BASE_URL}/AshDelivery?document=${document}&type=${type}`).pipe(
      map(resp => resp)
    )
  }
}

