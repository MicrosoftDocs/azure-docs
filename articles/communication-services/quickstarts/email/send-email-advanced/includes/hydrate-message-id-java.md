---
title: include file
description: Hydrate messageId using using EmailClient for Java
author: fanruisun-msft
manager: koagbakp
services: azure-communication-services
ms.author: fanruisun
ms.date: 08/04/2025
ms.topic: include
ms.service: azure-communication-services
---

## Hydrate messageId using using EmailClient for Java

Use the Azure Communication Services Email SDK for Java. Add the following dependency to your `pom.xml` file:

```xml
### Install the package

Open the `pom.xml` file in your text editor. Add the following dependency element to the group of dependencies.


<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-communication-email</artifactId>
    <version>1.0.0-beta.2</version>
</dependency>
```

```java
package com.communication.email;
import java.time.Duration;

import com.azure.communication.email.EmailClientBuilder;
import com.azure.communication.email.EmailClient;
import com.azure.communication.email.models.EmailSendResult;
import com.azure.communication.email.models.EmailSendStatus;
import com.azure.communication.email.models.EmailMessage;
import com.azure.core.util.polling.SyncPoller;
import com.azure.core.util.polling.LongRunningOperationStatus;
import com.azure.core.util.polling.PollResponse;


public class App
{
    public static final Duration POLLER_WAIT_TIME = Duration.ofSeconds(10);

    public static void main( String[] args )
    {
        // Replace these placeholders with your actual values
        String connectionString = "<ACS_CONNECTION_STRING>";
        String senderAddress = "<SENDER_EMAIL_ADDRESS>";
        String recipientAddress = "<RECIPIENT_EMAIL_ADDRESS>";

        // Create the EmailClient using the connection string
        EmailClient client = new EmailClientBuilder()
                .connectionString(connectionString)
                .buildClient();

        // Create an email message with both plain text and HTML content
        EmailMessage message = new EmailMessage()
                .setSenderAddress(senderAddress)
                .setToRecipients(recipientAddress)
                .setSubject("Test email from Java Sample")
                .setBodyPlainText("This is plaintext body of test email.")
                .setBodyHtml("<html><h1>This is the html body of test email.</h1></html>");

        // STEP 1: Send the email and get the initial poller
        // This starts the email send operation and returns a poller to monitor progress
        SyncPoller<EmailSendResult, EmailSendResult> poller = client.beginSend(message);
        
        // Poll once to get the initial response and extract the operation ID
        PollResponse<EmailSendResult> response = poller.poll();
        String operationId = response.getValue().getId();
        System.out.printf("Sent email send request from first poller (operation id: %s)\n", operationId);

        // STEP 2: Demonstrate rehydration using the operation ID
        // In a real scenario, you might store this operationId in a database
        // and retrieve it later to continue monitoring the operation
        System.out.print("Started polling from second poller\n");
        
        // REHYDRATION: Create a new poller using the existing operationId
        // This is the key concept - you can recreate a poller from just the operationId
        SyncPoller<EmailSendResult, EmailSendResult> poller2 = client.beginSend(operationId);
        
        // Wait for the email operation to complete using the rehydrated poller
        PollResponse<EmailSendResult> response2 = poller2.waitForCompletion();

        // Display the final result
        System.out.printf("Successfully sent the email (operation id: %s)\n", poller2.getFinalResult().getId());
    }
}
```

### Sample code

You can download the sample app demonstrating this action from GitHub Azure Samples [Send Email Rehydrate Poller for Java](https://github.com/Azure-Samples/communication-services-java-quickstarts/tree/main/send-email-advanced/send-email-rehydrate-poller).