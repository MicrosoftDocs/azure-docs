---
title: include file
description: Multiple recipients Java SDK include file
author: natekimball-msft
manager: koagbakp
services: azure-communication-services
ms.author: natekimball
ms.date: 04/07/2023
ms.topic: include
ms.service: azure-communication-services
---

## Send an email message to multiple recipients

To send an email message to multiple recipients, add the new addresses in the appropriate `EmailMessage` setter. These addresses can be added as `To`, `CC`, or `BCC` recipients. Optionally, add an email address to the `replyTo` property if you want to receive any replies.

```java
EmailMessage message = new EmailMessage()
    .setSenderAddress("<donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net>")
    .setSubject("Welcome to Azure Communication Services Email")
    .setBodyPlainText("This email message is sent from Azure Communication Services Email using the Java SDK.")
    .setToRecipients("<recipient1@emaildomain.com>", "<recipient2@emaildomain.com>")
    .setCcRecipients("<recipient3@emaildomain.com>")
    .setBccRecipients("<recipient4@emaildomain.com>")
    .setReplyTo("<replytoemail@emaildomain.com>");

SyncPoller<EmailSendResult, EmailSendResult> poller = emailClient.beginSend(message, null);
PollResponse<EmailSendResult> response = poller.waitForCompletion();

System.out.println("Operation Id: " + response.getValue().getId());
```

To customize the email message recipients further, you can instantiate the `EmailAddress` objects and pass that them to the appropriate `EmailMessage` setters.

```java
EmailAddress toAddress1 = new EmailAddress("<recipient1@emaildomain.com>")
    .setDisplayName("Recipient");

EmailAddress toAddress2 = new EmailAddress("<recipient2@emaildomain.com>")
    .setDisplayName("Recipient 2");

EmailMessage message = new EmailMessage()
    .setSenderAddress("<donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net>")
    .setSubject("Welcome to Azure Communication Services Email")
    .setBodyPlainText("This email message is sent from Azure Communication Services Email using the Java SDK.")
    .setToRecipients(toAddress1, toAddress2)
    .setCcRecipients(toAddress1, toAddress2)
    .setBccRecipients(toAddress1, toAddress2)

SyncPoller<EmailSendResult, EmailSendResult> poller = emailClient.beginSend(message, null);
PollResponse<EmailSendResult> response = poller.waitForCompletion();

System.out.println("Operation Id: " + response.getValue().getId());
```

### Sample code

You can download the sample app demonstrating this action from [GitHub](https://github.com/Azure-Samples/communication-services-java-quickstarts/tree/main/send-email-advanced)

