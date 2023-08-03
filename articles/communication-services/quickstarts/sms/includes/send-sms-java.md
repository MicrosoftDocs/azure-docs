---
title: include file
description: include file
services: azure-communication-services
author: pvicencio
manager: ankita

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 05/25/2022
ms.topic: include
ms.custom: include file
ms.author: pvicencio
---

Get started with Azure Communication Services by using the Communication Services Java SMS SDK to send SMS messages.

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

> [!NOTE]
> Find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-java-quickstarts/tree/main/send-sms-quickstart).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Java Development Kit (JDK)](/java/azure/jdk/) version 8 or later.
- [Apache Maven](https://maven.apache.org/download.cgi).
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md).
- An SMS-enabled telephone number. [Get a phone number](../../telephony/get-phone-number.md).

### Prerequisite check

- In a terminal or command window, run `mvn -v` to check that Maven is installed.
- To view the phone numbers that are associated with your Communication Services resource, sign in to the [Azure portal](https://portal.azure.com/) and locate your Communication Services resource. In the navigation pane on the left, select **Phone numbers**.

## Set up the application environment

To set up an environment for sending messages, take the steps in the following sections.

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
    <artifactId>azure-communication-sms</artifactId>
    <version>1.0.1</version>
</dependency>
```

### Set up the app framework

Open **/src/main/java/com/communication/quickstart/App.java** in a text editor, add import directives, and remove the `System.out.println("Hello world!");` statement:

```java
package com.communication.quickstart;

import com.azure.communication.sms.models.*;
import com.azure.core.credential.AzureKeyCredential;
import com.azure.communication.sms.*;
import com.azure.core.util.Context;
import java.util.Arrays;

public class App
{
    public static void main( String[] args )
    {
        // Quickstart code goes here.
    }
}

```

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services SMS SDK for Java.

| Name                                                             | Description                                                                                     |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| SmsClientBuilder              | This class creates the SmsClient. You provide it with an endpoint, a credential, and an HTTP client. |
| SmsClient                    | This class is needed for all SMS functionality. You use it to send SMS messages.                |
| SmsSendOptions               | This class provides options to add custom tags and configure delivery reporting. If deliveryReportEnabled is set to true, an event is emitted when delivery is successful. |        
| SmsSendResult                | This class contains the result from the SMS service.                                          |

## Authenticate the client

To authenticate a client, you instantiate an `SmsClient` with your connection string. For the credential, use the `Key` from the Azure portal. Learn how to [manage your resource's connection string](../../create-communication-resource.md#store-your-connection-string). You can also initialize the client with any custom HTTP client that implements the `com.azure.core.http.HttpClient` interface.

To instantiate a client, add the following code to the `main` method:

```java
// You can get your endpoint and access key from your resource in the Azure portal.
String endpoint = "https://<resource-name>.communication.azure.com/";
AzureKeyCredential azureKeyCredential = new AzureKeyCredential("<access-key-credential>");

SmsClient smsClient = new SmsClientBuilder()
                .endpoint(endpoint)
                .credential(azureKeyCredential)
                .buildClient();
```

You can also provide the entire connection string by using the `connectionString` function instead of providing the endpoint and access key.
```java
// You can get your connection string from your resource in the Azure portal.
String connectionString = "endpoint=https://<resource-name>.communication.azure.com/;accesskey=<access-key>";

SmsClient smsClient = new SmsClientBuilder()
            .connectionString(connectionString)
            .buildClient();
```

## Send a 1:1 SMS message

To send an SMS message to a single recipient, call the `send` method from the SmsClient with a single recipient phone number. You can also provide optional parameters to specify whether the delivery report should be enabled and to set custom tags.

```java
SmsSendResult sendResult = smsClient.send(
                "<from-phone-number>",
                "<to-phone-number>",
                "Weekly Promotion");

System.out.println("Message Id: " + sendResult.getMessageId());
System.out.println("Recipient Number: " + sendResult.getTo());
System.out.println("Send Result Successful:" + sendResult.isSuccessful());
```

Make these replacements in the code:

- Replace `<from-phone-number>` with an SMS-enabled phone number that's associated with your Communication Services resource.
- Replace `<to-phone-number>` with a phone number that you'd like to send a message to.

> [!WARNING]
> Provide phone numbers in E.164 international standard format, for example, +14255550123. The value for `<from-phone-number>` can also be a short code, for example, 23456 or an alphanumeric sender ID, for example, CONTOSO.

## Send a 1:N SMS message with options

To send an SMS message to a list of recipients, call the `send` method with a list of recipient phone numbers. You can also provide optional parameters to specify whether the delivery report should be enabled and to set custom tags.
```java
SmsSendOptions options = new SmsSendOptions();
options.setDeliveryReportEnabled(true);
options.setTag("Marketing");

Iterable<SmsSendResult> sendResults = smsClient.sendWithResponse(
    "<from-phone-number>",
    Arrays.asList("<to-phone-number1>", "<to-phone-number2>"),
    "Weekly Promotion",
    options /* Optional */,
    Context.NONE).getValue();

for (SmsSendResult result : sendResults) {
    System.out.println("Message Id: " + result.getMessageId());
    System.out.println("Recipient Number: " + result.getTo());
    System.out.println("Send Result Successful:" + result.isSuccessful());
}
```

Make these replacements in the code:

- Replace `<from-phone-number>` with an SMS-enabled phone number that's associated with your Communication Services resource
- Replace `<to-phone-number-1>` and `<to-phone-number-2>` with phone numbers that you'd like to send a message to.

> [!WARNING]
> Provide phone numbers in E.164 international standard format, for example, +14255550123. The value for `<from-phone-number>` can also be a short code, for example, 23456 or an alphanumeric sender ID, for example, CONTOSO.

The `setDeliveryReportEnabled` method is used to configure delivery reporting. This functionality is useful when you want to emit events when SMS messages are delivered. See the [Handle SMS Events](../handle-sms-events.md) quickstart to configure delivery reporting for your SMS messages.

You can use the `setTag` method to apply a tag to the delivery report.

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
