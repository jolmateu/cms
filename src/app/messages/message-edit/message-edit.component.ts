import { Component, ElementRef, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'app-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
  @ViewChild('subject')
  subjectRef!: ElementRef;
  @ViewChild('msgText')
  msgTextRef!: ElementRef;

  @Output() addMessageEvent = new EventEmitter<Message>();

  currentSender: string = "Jose Mateus";

  constructor() { }

  ngOnInit(){
  }

  onSendMessage() {
    const msgSubject: string = this.subjectRef.nativeElement.value;
    const msgMsgText: string = this.msgTextRef.nativeElement.value;
    const newMessage = new Message(1001, msgSubject, msgMsgText, this.currentSender);
    this.addMessageEvent.emit(newMessage);
  }

  onClear() {
    this.subjectRef.nativeElement.value = "";
    this.msgTextRef.nativeElement.value = "";
  }


}
