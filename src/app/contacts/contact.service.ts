import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';
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
    this.http.get<Contact[]>('http://localhost:3000/contacts')
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

  
addContact(contact: Contact) {
  if (!contact) {
    return;
  }

  // make sure id of the new Document is empty
  contact.id = '';

  const headers = new HttpHeaders({'Content-Type': 'application/json'});

  // add to database
  this.http.post<{ message: string, contact: Contact }>('http://localhost:3000/contacts',
    contact,
    { headers: headers })
    .subscribe(
      (responseData) => {
        // add new document to documents
        this.contacts.push(responseData.contact);
        this.contacts.sort();
        this.contactListChangedEvent.next(this.contacts.slice())
      }
    );
}

updateContact(originalContact: Contact, newContact: Contact) {
  if (!originalContact || !newContact) {
    return;
  }

  const pos = this.contacts.findIndex(d => d.id === originalContact.id);

  if (pos < 0) {
    return;
  }

  // set the id of the new Document to the id of the old Document
  newContact.id = originalContact.id;
  //newContact._id = originalContact._id;

  const headers = new HttpHeaders({'Content-Type': 'application/json'});

  // update database
  this.http.put('http://localhost:3000/contacts/' + originalContact.id,
    newContact, { headers: headers })
    .subscribe(
      (response: Response) => {
        this.contacts[pos] = newContact;
        this.contacts.sort();
        this.contactListChangedEvent.next(this.contacts.slice())
      }
    );
}

deleteContact(contact: Contact) {

  if (!contact) {
    return;
  }

  const pos = this.contacts.findIndex(d => d.id === contact.id);

  if (pos < 0) {
    return;
  }

  // delete from database
  this.http.delete('http://localhost:3000/contacts/' + contact.id)
    .subscribe(
      (response: Response) => {
        this.contacts.splice(pos, 1);
        this.contacts.sort();
        this.contactListChangedEvent.next(this.contacts.slice())
      }
    );
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
