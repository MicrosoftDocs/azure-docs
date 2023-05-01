---
title: include file
description: Attachments Java SDK include file
author: natekimball-msft
manager: koagbakp
services: azure-communication-services
ms.author: natekimball
ms.date: 04/07/2023
ms.topic: include
ms.service: azure-communication-services
---

## Send an email message with attachments

We can add an attachment by defining an EmailAttachment object and adding it to our EmailMessage object. Read the attachment file and encode it using Base64.

```java
BinaryData attachmentContent = BinaryData.fromFile(new File("C:/attachment.txt").toPath());
EmailAttachment attachment = new EmailAttachment(
    "attachment.txt",
    "text/plain",
    attachmentContent
);

EmailMessage message = new EmailMessage()
    .setSenderAddress("<donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net>")
    .setToRecipients("<emailalias@emaildomain.com>")
    .setSubject("Welcome to Azure Communication Services Email")
    .setBodyPlainText("This email message is sent from Azure Communication Services Email using the Java SDK.");
    .setAttachments(attachment);

SyncPoller<EmailSendResult, EmailSendResult> poller = emailClient.beginSend(message, null);
PollResponse<EmailSendResult> response = poller.waitForCompletion();

System.out.println("Operation Id: " + response.getValue().getId());
```

### Allowed MIME types

For more information on acceptable MIME types for email attachments, see the [allowed MIME types](../../../../concepts/email/email-attachment-allowed-mime-types.md) documentation.

### Sample code

You can download the sample app demonstrating this action from [GitHub](https://github.com/Azure-Samples/communication-services-java-quickstarts/tree/main/send-email-advanced)

