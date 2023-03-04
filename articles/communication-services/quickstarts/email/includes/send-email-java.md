---
title: include file
description: include file
author: natekimball-msft
manager: koagbakp
services: azure-communication-services
ms.author: natekimball
ms.date: 03/03/2023
ms.topic: include
ms.service: azure-communication-services
ms.custom: mode-other
---

Get started with Azure Communication Services by using the Communication Services Java Email SDK to send Email messages.

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Java Development Kit (JDK)](https://docs.microsoft.com/azure/developer/java/fundamentals/java-jdk-install) version 8 or above.
- [Apache Maven](https://maven.apache.org/download.cgi).
- A deployed Communication Services resource and connection string. For details, see [Create a Communication Services resource](https://docs.microsoft.com/azure/communication-services/quickstarts/create-communication-resource).
- Create an [Azure Email Communication Services resource](https://docs.microsoft.com/en-us/azure/communication-services/quickstarts/email/create-email-communication-resource) to start sending emails.
- A setup managed identity for a development environment, [see Authorize access with managed identity](https://docs.microsoft.com/azure/communication-services/quickstarts/managed-identity-from-cli).

> Note: We can also send an email from our own verified domain [Add custom verified domains to Email Communication Service](https://docs.microsoft.com/en-us/azure/communication-services/quickstarts/email/add-custom-verified-domains).

### Prerequisite check
- In a terminal or command window, run `mvn -v` to check that Maven is installed.
- To view the domains verified with your Email Communication Services resource, sign in to the [Azure portal](https://portal.azure.com/). Locate your Email Communication Services resource and open the **Provision domains** tab from the left navigation pane.

## Set up the application environment

To set up an environment for sending emails, take the steps in the following sections.

### Create a new Java application
Open your terminal or command window and navigate to the directory where you would like to create your Java application. Run the following command to generate the Java project from the maven-archetype-quickstart template.

```console
mvn archetype:generate -DarchetypeArtifactId="maven-archetype-quickstart" -DarchetypeGroupId="org.apache.maven.archetypes" -DarchetypeVersion="1.4" -DgroupId="com.communication.quickstart" -DartifactId="communication-quickstart"
```

The `generate` goal creates a directory with the same name as the `artifactId` value. Under this directory, the **src/main/java** directory contains the project source code, the **src/test/java directory** contains the test source, and the **pom.xml** file is the project's Project Object Model (POM).

### Install the package

Open the **pom.xml** file in your text editor. Add the following dependency element to the group of dependencies.

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-communication-email</artifactId>
    <version>1.0.0-beta.2</version>
</dependency>
```

### Set up the app framework

Open **/src/main/java/com/communication/quickstart/App.java** in a text editor, add import directives, and remove the `System.out.println("Hello world!");` statement:

```java
package com.communication.quickstart;

import com.azure.communication.email.models.*;
import com.azure.communication.email.*;
import java.util.ArrayList;

public class App
{
    public static void main( String[] args )
    {
        // Quickstart code goes here.
    }
}
```

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Email SDK for Python.

| Name | Description |
| ---- |-------------|
| EmailAddress | This class contains an email address and an option for a display name. |
| EmailAttachment | This interface creates an email attachment by accepting a unique ID, email attachment type, and a string of content bytes. |
| EmailClient | This class is needed for all email functionality. You instantiate it with your connection string and use it to send email messages. |
| EmailMessage | This class combines the sender, content, and recipients. Custom headers, attachments, and reply-to email addresses can optionally be added, as well. |
| EmailSendResult | This class holds the results of the email send operation. It has an operation ID, operation status and error object (when applicable). |
| EmailSendStatus | This class represents the set of statuses of an email send operation. |

## Authenticate the client

To authenticate a client, you instantiate an `EmailClient` with your connection string. Learn how to [manage your resource's connection string](../../create-communication-resource.md#store-your-connection-string). You can also initialize the client with any custom HTTP client that implements the `com.azure.core.http.HttpClient` interface.

To instantiate a client, add the following code to the `main` method:

```java
// You can get your connection string from your resource in the Azure portal.
String connectionString = "endpoint=https://<resource-name>.communication.azure.com/;accesskey=<access-key>";

EmailClient emailClient = new EmailClientBuilder()
    .connectionString(connectionString)
    .buildClient();
```

For simplicity, this quickstart uses connection strings, but in production environments, we recommend using [service principals](../../../quickstarts/identity/service-principal.md).

## Send an email message

To send an email message, call the `beginSend` function from the `EmailClient`. This method returns a poller, which can be used to check on the status of the operation and retrieve the result once it's finished.

```java
EmailMessage message = new EmailMessage()
    .setSenderAddress("<donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net>")
    .setToRecipients("<emailalias@emaildomain.com>")
    .setSubject("Welcome to Azure Communication Services Email")
    .setBodyPlainText("This email message is sent from Azure Communication Services Email using the Java SDK.");

SyncPoller<EmailSendResult, EmailSendResult> poller = emailClient.beginSend(message, null);
PollResponse<EmailSendResult> response = poller.waitForCompletion();

System.out.println("Operation Id: " + response.getValue().getId());
```

Make these replacements in the code:

- Replace `<emailalias@emaildomain.com>` with the email address you would like to send a message to.
- Replace `<donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net>` with the MailFrom address of your verified domain.

[!INCLUDE [Email Message Status](./email-operation-status.md)]

## Run the code

1. Navigate to the directory that contains the **pom.xml** file and compile the project by using the `mvn` command.

   ```console
   mvn compile
   ```

1. Build the package.

   ```console
   mvn package
   ```

1. Run the following `mvn` command to execute the app.

   ```console
   mvn exec:java -D"exec.mainClass"="com.communication.quickstart.App" -D"exec.cleanupDaemonThreads"="false"
   ```

## Sample code

You can download the sample app from [GitHub](https://github.com/Azure-Samples/communication-services-java-quickstarts/tree/main/send-email)

## Advanced

### Send an email message to multiple recipients

To send an email message to multiple recipients, add the new addresses in the appropriate `EmailMessage` setter. These addresses can be added as `To`, `CC`, or `BCC` recipients.

```java
EmailMessage message = new EmailMessage()
    .setSenderAddress("<donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net>")
    .setSubject("Welcome to Azure Communication Services Email")
    .setBodyPlainText("This email message is sent from Azure Communication Services Email using the Java SDK.")
    .setToRecipients("<recipient1@emaildomain.com>", "<recipient2@emaildomain.com>")
    .setCcRecipients("<recipient3@emaildomain.com>")
    .setBccRecipients("<recipient4@emaildomain.com>");

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
    .setToRecipients(toAddress1, toAddress2);

SyncPoller<EmailSendResult, EmailSendResult> poller = emailClient.beginSend(message, null);
PollResponse<EmailSendResult> response = poller.waitForCompletion();

System.out.println("Operation Id: " + response.getValue().getId());
```

You can download the sample app demonstrating this action from [GitHub](https://github.com/Azure-Samples/communication-services-java-quickstarts/tree/main/send-email)

### Send an email message with attachments

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

You can download the sample app demonstrating this action from [GitHub](https://github.com/Azure-Samples/communication-services-java-quickstarts/tree/main/send-email)
