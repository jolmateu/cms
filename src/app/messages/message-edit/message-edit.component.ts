import { Component, ElementRef, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

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

  constructor(private messageService: MessageService) { }

  ngOnInit(){
  }

  onSendMessage() {
    const msgSubject: string = this.subjectRef.nativeElement.value;
    const msgMsgText: string = this.msgTextRef.nativeElement.value;
    const newMessage = new Message('22', msgSubject, msgMsgText, this.currentSender);
    this.messageService.addMessage(newMessage);
  }

  onClear() {
    this.subjectRef.nativeElement.value = "";
    this.msgTextRef.nativeElement.value = "";
  }


}
