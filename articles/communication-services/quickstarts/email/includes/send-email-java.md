---
title: include file
description: include file
author: yogeshmo
manager: koagbakp
services: azure-communication-services
ms.author: ymohanraj
ms.date: 09/09/2022
ms.topic: include
ms.service: azure-communication-services
ms.custom: private_preview, event-tier1-build-2022
---

Get started with Azure Communication Services by using the Communication Services Java Email SDK to send Email messages.

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Java Development Kit (JDK)](/java/azure/jdk/) version 8 or later.
- [Apache Maven](https://maven.apache.org/download.cgi).
- An active Azure Communication Services resource connected to an Email Domain and its connection string. [Get started by connecting an Email Communication Resource with a Azure Communication Resource](../connect-email-communication-resource.md).

### Prerequisite check
- In a terminal or command window, run `mvn -v` to check that Maven is installed.
- To view the domains verified with your Email Communication Services resource, sign in to the [Azure portal](https://portal.azure.com/). Locate your Email Communication Services resource and open the **Provision domains** tab from the left navigation pane.

## Set up the application environment

To set up an environment for sending emails, take the steps in the following sections.

### Create a new Java application
Open your terminal or command window and navigate to the directory where you would like to create your Java application. Run the following command to generate the Java project from the maven-archetype-quickstart template.

```console
mvn archetype:generate -DgroupId=com.communication.quickstart -DartifactId=communication-quickstart -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.4 -DinteractiveMode=false
```

The `generate` goal creates a directory with the same name as the `artifactId` value. Under this directory, the **src/main/java** directory contains the project source code, the **src/test/java directory** contains the test source, and the **pom.xml** file is the project's Project Object Model (POM).

### Install the package

Open the **pom.xml** file in your text editor. Add the following dependency element to the group of dependencies.

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-communication-email</artifactId>
    <version>1.0.0-beta.1</version>
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
| EmailAddress | This interface contains an email address and an option for a display name. |
| EmailAttachment | This interface creates an email attachment by accepting a unique ID, email attachment type, and a string of content bytes. |
| EmailClient | This class is needed for all email functionality. You instantiate it with your connection string and use it to send email messages. |
| EmailClientOptions | This interface can be added to the EmailClient instantiation to target a specific API version. |
| EmailContent | This interface contains the subject, plaintext, and html of the email message. |
| EmailCustomHeader | This interface allows for the addition of a name and value pair for a custom header. |
| EmailMessage | This interface combines the sender, content, and recipients. Custom headers, importance, attachments, and reply-to email addresses can optionally be added as well. |
| EmailRecipients | This interface holds lists of EmailAddress objects for recipients of the email message, including optional lists for CC & BCC recipients. |
| SendStatusResult | This interface holds the messageId and status of the email message delivery. |

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

To send an email message, you need to
- Construct the EmailContent
- Create an EmailAddress for the recipient
- Construct the EmailRecipients
- Construct the EmailMessage with the EmailContent, EmailAddress, and the sender information from the MailFrom address of your verified domain
- Call the send method

```java
EmailContent content = new EmailContent("Welcome to Azure Communication Services Email")
    .setPlainText("This email message is sent from Azure Communication Services Email using the Python SDK.");

EmailAddress emailAddress = new EmailAddress("<emailalias@emaildomain.com>");
ArrayList<EmailAddress> addressList = new ArrayList<>();
addressList.add(emailAddress);

EmailRecipients emailRecipients = new EmailRecipients(addressList);

EmailMessage emailMessage = new EmailMessage(
    "<donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net>",
    content,
    emailRecipients
);

SendEmailResult response = emailClient.send(emailMessage);
```

Make these replacements in the code:

- Replace `<emailalias@emaildomain.com>` with the email address you would like to send a message to.
- Replace `<donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net>` with the MailFrom address of your verified domain.

## Retrieve the Message ID of the email delivery

To track the status of the email delivery, you will need the `messageId` from the response.

```java
String message_id = response.getMessageId();
```

## Get the status of the email delivery

We can keep checking the email delivery status until the status is `OutForDelivery`.

```java
long waitTime = 120*1000;
boolean timeout = true;
while (waitTime > 0)
{
    SendStatusResult sendStatus = emailClient.getSendStatus(messageId);
    System.out.printf("Send mail status for MessageId : <{%s}>, Status: [{%s}]", messageId, sendStatus.getStatus());

    if (!sendStatus.getStatus().toString().toLowerCase().equals(SendStatus.QUEUED.toString()))
    {
        timeout = false;
        break;
    }
    Thread.sleep(10000);
    waitTime = waitTime-10000;
}

if(timeout)
{
    System.out.println("Looks like we timed out for email");
}
```

[!INCLUDE [Email Message Status](./email-message-status.md)]

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
   mvn exec:java -Dexec.mainClass="com.communication.quickstart.App" -Dexec.cleanupDaemonThreads=false
   ```

## Sample code

You can download the sample app from [GitHub](https://github.com/Azure-Samples/communication-services-java-quickstarts/tree/main/send-email)

## Advanced

### Send an email message to multiple recipients

We can define multiple recipients by adding additional EmailAddresses to the EmailRecipients object. These addresses can be added as `To`, `CC`, or `BCC` recipients.

```java
EmailAddress toEmailAddress1 = new EmailAddress("<emailalias1@emaildomain.com>");
EmailAddress toEmailAddress2 = new EmailAddress("<emailalias2@emaildomain.com>");

EmailAddress ccEmailAddress = new EmailAddress("<ccemailalias@emaildomain.com>");
EmailAddress bccEmailAddress = new EmailAddress("<bccemailalias@emaildomain.com>");

ArrayList<EmailAddress> toAddressList = new ArrayList<>();
toAddressList.add(toEmailAddress1);
toAddressList.add(toEmailAddress2);

ArrayList<EmailAddress> ccAddressList = new ArrayList<>();
ccAddressList.add(ccEmailAddress);

ArrayList<EmailAddress> bccAddressList = new ArrayList<>();
bccAddressList.add(bccEmailAddress);

EmailRecipients emailRecipients = new EmailRecipients(toAddressList)
    .setCc(ccAddressList)
    .setBcc(bccAddressList);
```

You can download the sample app demonstrating this from [GitHub](https://github.com/Azure-Samples/communication-services-java-quickstarts/tree/main/send-email)


### Send an email message with attachments

We can add an attachment by defining an EmailAttachment object and adding it to our EmailMessage object. Read the attachment file and encode it using Base64.

```java
File file = new File("<your-attachment-path>");

byte[] fileContent = null;
try {
    fileContent = Files.readAllBytes(file.toPath());
} catch (Exception e) {
    System.out.println(e);
}

String b64file = Base64.getEncoder().encodeToString(fileContent);

EmailAttachment attachment = new EmailAttachment("<your-attachment-name>", "<your-attachment-file-type>", b64file);

ArrayList<EmailAttachment> attachmentList = new ArrayList<>();
attachmentList.add(attachment);

EmailMessage emailMessage = new EmailMessage("<donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net>", content)
    .setRecipients(emailRecipients)
    .setAttachments(attachmentList);
```

You can download the sample app demonstrating this from [GitHub](https://github.com/Azure-Samples/communication-services-java-quickstarts/tree/main/send-email)
