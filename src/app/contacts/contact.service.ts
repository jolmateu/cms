import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactListChangedEvent = new Subject<Contact[]>();
  contactSelectedEvent = new EventEmitter<Contact>();
  /* contactChangedEvent = new EventEmitter<Contact[]>(); */

  maxContactId: number;

  private contacts: Contact[] = [];

  constructor( private http: HttpClient ) {
    /* this.contacts = MOCKCONTACTS; */
  }

  getContacts(): Contact[] {
    this.http.get<Contact[]>('https://cmsproject-6c76a-default-rtdb.firebaseio.com/contacts.json')
      .subscribe(
        // success method
        (contacts: Contact[]) => {
          this.contacts = contacts
          this.maxContactId = this.getMaxId();
          contacts.sort();
          this.contactListChangedEvent.next(contacts.slice());
        },
        // error method
        (error: any) => {
          console.log(error.message);
        }
      )
    return this.contacts.slice();
  }

  getContact(id: string): Contact{
    for (let contact of this.contacts) {
      if (contact.id == id) {
        return contact;
      }
    }
    return null;
  }

  /* deleteContact(contact: Contact) {
    if (!document){
      return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }
    this.contacts.splice(pos, 1);
    this.contactChangedEvent.emit(this.contacts.slice());
  } */

  getMaxId(): number {
    let maxId = 0;
    for (let contact of this.contacts){
      let currentId = +contact.id;
      if (currentId > maxId){
        maxId = currentId;
      }
    }
    return maxId;
  }

  addContact(newContact: Contact) {
    if(!newContact){
      return;
    }
    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);
    let contactsListClone = this.contacts.slice();
    this.storeContacts();
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if(!originalContact || !newContact) {
      return;
    }

    let pos = this.contacts.indexOf(originalContact);
    if (pos < 0) {
      return;
    }
    
    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    let documentsListClone = this.contacts.slice();
    this.storeContacts();
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }

    let pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }

    this.contacts.splice(pos,1);
    let contactsListClone = this.contacts.slice();
    this.storeContacts();
  }

  storeContacts() {
    const dbcontacts = JSON.stringify(this.contacts);
    const header = new HttpHeaders().set('Content-Type', 'application/json');
    this.http
      .put(
        'https://cmsproject-6c76a-default-rtdb.firebaseio.com/contacts.json',
        dbcontacts, {headers: header}
      )
      .subscribe( () => {
        this.contactListChangedEvent.next(this.contacts.slice());
      });
  }

}
