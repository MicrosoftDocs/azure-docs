---
title: include file
description: Inline Attachments Java SDK include file
author: natekimball-msft
manager: koagbakp
services: azure-communication-services
ms.author: natekimball
ms.date: 04/07/2023
ms.topic: include
ms.service: azure-communication-services
---

## Send an email message with inline attachments

We can add an inline attachment by defining one or more EmailAttachment objects, defining a unique `ContentId` for each, and adding them to our EmailMessage object. Read the attachment file and encode it using Base64.

```java
byte[] jpgContent = Files.readAllBytes(new File("./inline-attachment.jpg").toPath());
byte[] jpgEncodedContent = Base64.getEncoder().encodeToString(jpgContent).getBytes();
EmailAttachment jpgInlineAttachment = new EmailAttachment(
    "inline-attachment.jpg",
    "image/jpeg",
    BinaryData.fromBytes(jpgEncodedContent)
).setContentId("my-inline-attachment-1");

byte[] pngContent = Files.readAllBytes(new File("./inline-attachment.png").toPath());
byte[] pngEncodedContent = Base64.getEncoder().encodeToString(pngContent).getBytes();
EmailAttachment pngInlineAttachment = new EmailAttachment(
    "inline-attachment.png",
    "image/png",
    BinaryData.fromBytes(pngEncodedContent)
).setContentId("my-inline-attachment-2");
```

Within the HTML body of the message, we can then embed an image by referencing its `ContentId` within the source of an `<img>` tag.

```java
EmailMessage message = new EmailMessage()
    .setSenderAddress(senderAddress)
    .setToRecipients(recipientAddress)
    .setSubject("Welcome to Azure Communication Services Email")
    .setBodyPlainText("This email message is sent from Azure Communication Services Email using the Java SDK.");
    .setBodyHtml("<html><h1>HTML body inline images:</h1><img src=\"cid:my-inline-attachment-1\" /><img src=\"cid:my-inline-attachment-2\" /></html>")
    .setAttachments(jpgInlineAttachmentContent, pngInlineAttachmentContent);

SyncPoller<EmailSendResult, EmailSendResult> poller = emailClient.beginSend(message, null);
PollResponse<EmailSendResult> response = poller.waitForCompletion();

System.out.println("Operation Id: " + response.getValue().getId());
```

> [!NOTE]
> Regular attachments can be combined with inline attachments, as well. Defining a `ContentId` will treat an attachment as inline, while an attachment without a `ContentId` will be treated as a regular attachment.

### Allowed MIME types

Although most modern clients support inline attachments, the rendering behavior of an inline attachment is largely dependent on the recipient's email client. For this reason, it is suggested to use more common image formats inline whenever possible, such as .png, .jpg, or .gif. For more information on acceptable MIME types for email attachments, see the [allowed MIME types](../../../../concepts/email/email-attachment-allowed-mime-types.md) documentation.

### Sample code

You can download the sample app demonstrating this action from [GitHub](https://github.com/Azure-Samples/communication-services-java-quickstarts/tree/main/send-email-advanced/send-email-inline-attachments)

