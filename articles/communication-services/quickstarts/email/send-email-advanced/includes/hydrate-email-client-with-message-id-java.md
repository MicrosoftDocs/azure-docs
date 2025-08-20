---
title: include file
description: Hydrate messageId using EmailClient for Java
author: fanruisun
manager: koagbakp
services: azure-communication-services
ms.author: fanruisun
ms.date: 08/04/2025
ms.topic: include
ms.service: azure-communication-services
---

## Hydrate messageId using EmailClient for Java

Use the Azure Communication Services Email SDK for Java. Add the following dependency to your `pom.xml` file:


### Create an email message

```java
// Create an email message with both plain text and HTML content
EmailMessage message = new EmailMessage()
        .setSenderAddress(senderAddress)
        .setToRecipients(recipientAddress)
        .setSubject("Test email from Java Sample")
        .setBodyPlainText("This is plaintext body of test email.")
        .setBodyHtml("<html><h1>This is the html body of test email.</h1></html>");
```

### Send email and capture operation ID

```java
// STEP 1: Send the email and get the initial poller
// This starts the email send operation and returns a poller to monitor progress
SyncPoller<EmailSendResult, EmailSendResult> poller = client.beginSend(message);

// Poll once to get the initial response and extract the operation ID
PollResponse<EmailSendResult> response = poller.poll();
String operationId = response.getValue().getId();
System.out.printf("Sent email send request from first poller (operation id: %s)\n", operationId);
```

The `operationId` is the key identifier that allows you to rehydrate the poller later. In real applications, you would typically store this ID in a database for future reference.

### Rehydrate the poller using operation ID

```java
// STEP 2: Demonstrate rehydration using the operation ID
// In a real scenario, you might store this operationId in a database
// and retrieve it later to continue monitoring the operation
System.out.print("Started polling from second poller\n");

// REHYDRATION: Create a new poller using the existing operationId
// This is the key concept - you can recreate a poller from just the operationId
SyncPoller<EmailSendResult, EmailSendResult> poller2 = client.beginSend(operationId);
```

### Poll for completion and get results

```java
// Wait for the email operation to complete using the rehydrated poller
PollResponse<EmailSendResult> response2 = poller2.waitForCompletion();

// Display the final result
System.out.printf("Successfully sent the email (operation id: %s)\n", poller2.getFinalResult().getId());
```

### Sample code

You can download the sample app demonstrating this action from GitHub Azure Samples [Send Email Rehydrate Poller for Java](https://github.com/Azure-Samples/communication-services-java-quickstarts/tree/main/send-email-advanced/send-email-rehydrate-poller).