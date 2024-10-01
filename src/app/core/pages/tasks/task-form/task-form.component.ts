import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent {
  @Input() taskForm!: FormGroup;
  @Input() isEditing = false;
  @Input() users: Array<any> = [];
  @Output() saveTaskEvent = new EventEmitter<void>();

  constructor(private fb: FormBuilder) { }

  /**
   * Obtener el arreglo de usuarios del formulario
   */
  people(): FormArray {
    return this.taskForm.get('users') as FormArray;
  }

  /**
   * Añadir una persona asignada a la tarea
   */
  addPerson() {
    this.people().push(this.newPerson());
  }

  newPerson(user?: any): FormGroup {
    return this.fb.group({
      userId: [user ? user.userId : 0],
      name: [user ? user.name : '', [Validators.required, Validators.minLength(5), this.uniqueNameValidator()]],
      age: [user ? user.age : '', [Validators.required, Validators.min(18)]],
      skills: this.fb.array(user ? user.skills.map((skill: string) => this.fb.control(skill, Validators.required)) : [this.fb.control('', Validators.required)])
    });
  }


  /**
   * Validación personalizada para asegurar que los nombres de las personas sean únicos
   */
  uniqueNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formArray = control?.parent?.parent as FormArray;
      if (!formArray) return null;
      const currentName = control.value;
      const allNames = formArray.controls.map(group => group.get('name')?.value);
      const duplicateCount = allNames.filter(name => name === currentName).length;
      return duplicateCount > 1 ? { duplicateName: true } : null;
    };
  }


  /**
   * Eliminar una persona asignada a la tarea
   */
  removePerson(index: number) {
    this.people().removeAt(index);
  }

  /**
   * Añadir una habilidad a una persona
   */
  addSkill(personIndex: number) {
    const skills = this.people().at(personIndex).get('skills') as FormArray;
    skills.push(this.fb.control('', Validators.required));
  }

  /**
   * Eliminar una habilidad de una persona
   */
  removeSkill(personIndex: number, skillIndex: number) {
    const skills = this.people().at(personIndex).get('skills') as FormArray;
    skills.removeAt(skillIndex);
  }

  /**
   * Obtiene las habilidades de una persona
   * @param personIndex Indice de la persona
   */
  getSkills(personIndex: number): FormArray {
    return this.people().at(personIndex).get('skills') as FormArray;
  }

  /**
   * Verifica si un campo específico del formulario de la tarea es inválido.
   * @param field campo a validar
   * @param index indice del campo
   * @returns 
   */
  isFieldInvalid(field: string, index: number): boolean {
    const users = this.taskForm.get('users') as FormArray;
    if (!users || users.length <= index) {
      return false;  // Evita el error si no hay suficientes controles en el array
    }
    const control = users.at(index).get(field);
    return !!(control?.touched && control?.invalid);
  }


  /**
     * Verifica si un campo específico del formulario de la tarea es inválido.
     * @param field El nombre del campo a verificar.
     * @returns  `true` si el campo está vacío o es nulo y el formulario ha sido enviado, de lo contrario `false`.
     */
  public invalidField = (field: string): boolean => {
    const control = this.taskForm.get(field);
    return control !== null && control.invalid && (control.dirty || control.touched);
  }

  /**
   * Emitir el evento de guardar tarea
   */
  saveTask() {
    this.saveTaskEvent.emit();
  }

  // Buscar el usuario por nombre
  searchUser(index: number) {
    const nameControl = this.people().at(index).get('name')?.value;
    const foundUser = this.users.find(user => user.name.toLowerCase() === nameControl.toLowerCase());

    if (foundUser) {
      this.people().at(index).patchValue({
        userId: foundUser.userId,
        name: foundUser.name,
        age: foundUser.age
      });
      const skillsFormArray = this.getSkills(index);
      skillsFormArray.clear();
      foundUser.skills.forEach((skill: string) => {
        skillsFormArray.push(this.fb.control(skill, Validators.required));
      });
    }
  }
}
