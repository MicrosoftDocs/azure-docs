---
title: include file
description: include file
services: Communication Services
author: chrwhit
manager: nimag
ms.service: Communication Services
ms.subservice: Communication Services
ms.date: 08/20/2020
ms.topic: include
ms.custom: include file
ms.author: chrwhit
---

Get started with Azure Communication Services by using the Communication Services Java SMS SDK to send SMS messages.

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

<!--**TODO: update all these reference links as the resources go live**

[API reference documentation](../../../references/overview.md) | [Library source code](https://github.com/Azure/azure-sdk-for-net-pr/tree/feature/communication/sdk/communication/Azure.Communication.Sms#todo-update-to-public) | [Artifact (Maven)](#todo-nuget) | [Samples](#todo-samples)-->

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Java Development Kit (JDK)](https://docs.microsoft.com/java/azure/jdk/?view=azure-java-stable) version 8 or above.
- [Apache Maven](https://maven.apache.org/download.cgi).
- A deployed Communication Services resource. [Create a Communication Services resource](../../create-a-communication-resource.md).

### Prerequisite check

- To view the phone numbers associated with your Communication Services resource, sign in to the [Azure portal](https://portal.azure.com/), locate your Communication Services resource and open the **phone numbers** tab from the left navigation pane.

## Setting Up

### Create a new Java application

Open your terminal or command window and navigate to the directory where you would like to create your Java application. Run the command below to generate the Java project from the maven-archetype-quickstart template.

```console
mvn archetype:generate -DgroupId=com.communication.quickstart -DartifactId=communication-quickstart -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.4 -DinteractiveMode=false
```

You'll notice that the 'generate' goal created a directory with the same name as the artifactId. Under this directory, the src/main/java directory contains the project source code, the src/test/java directory contains the test source, and the pom.xml file is the project's Project Object Model, or POM.

### Add the package references for the SMS SDK

Open the **pom.xml** file in your text editor. Add the following dependency element to the group of dependencies.

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-communication-sms</artifactId>
    <version>1.0.0-beta.1</version> 
</dependency>
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-core-http-netty</artifactId>
    <version>1.3.0</version>
</dependency>
```
### Set up the app framework

From the project directory:

1. Navigate to the */src/main/java/com/communication/quickstart* directory
1. Open the *App.java* file in your editor
1. Replace the `System.out.println("Hello world!");` statement
1. Add `import` directives

Here's the code:

```java

import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;

import com.azure.communication.common.CommunicationClientCredential;
import com.azure.communication.sms.SmsClient;
import com.azure.communication.sms.SmsClientBuilder;
import com.azure.communication.sms.models.SendSmsOptions;
import com.azure.communication.sms.models.SendSmsResponse;
import com.azure.core.http.HttpClient;
import com.azure.core.http.netty.NettyAsyncHttpClientBuilder;

public class App
{
    public static void main( String[] args ) throws IOException
    {
        System.out.println("Azure Communication Services - Sms Quickstart");
        // Quickstart code goes here
    }
}

```

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services SMS SDK for Java.

| Name                                        | Description                                                  |
| ------------------------------------------- | ------------------------------------------------------------ |
| [SmsClientBuilder](../../../references/overview.md)| This class creates the SmsClient. You provide it with endpoint, credential, and an http client.
| [SmsClient](../../../references/overview.md)       | This class is needed for all SMS functionality. You use it to send SMS messages. 
| [SendSmsResponse](../../../references/overview.md) | This class contains the response from the SMS service.
| [CommunicationClientCredential](../../../references/overview.md)| This class handles signing requests.

## Get access key and endpoint

```java

// This code demonstrates how to fetch your service endpoint
// from an environment variable.
String endpoint = System.getenv("COMMUNICATION_SERVICES_ENDPOINT");

// This code demonstrates how to fetch your access key
// from an environment variable.
String accessKey = System.getenv("COMMUNICATION_SERVICES_ACCESS_KEY");

// Instantiate the user token client
CustomHttpClientBuilder yourHttpClientBuilder = new CustomHttpClientBuilder();
HttpClient httpClient = yourHttpClientBuilder.build();

```

## Send an SMS message

```java

CommunicationClientCredential credential = null;
try {
    credential = new CommunicationClientCredential(accessKey);
} catch (NoSuchAlgorithmException e) {
    System.out.println(e.getMessage());
} catch (InvalidKeyException e) {
    System.out.println(e.getMessage());
}

// Create a new SmsClientBuilder to instantiate an SmsClient
SmsClientBuilder smsClientBuilder = new SmsClientBuilder();

// Set the endpoint, access key, and the HttpClient
smsClientBuilder.endpoint(endpoint)
    .credential(credential)
    .httpClient(httpClient);

// Build a new SmsClient
SmsClient smsClient = smsClientBuilder.buildClient();

// Currently, the SMS SDK only supports one phone number
List<String> to = new ArrayList<String>();
to.add("<to-phone-number>");

// SendSmsOptions is an optional field. It can be used
// to enable a delivery report to the Azure Event Grid
SendSmsOptions options = new SendSmsOptions();
options.setEnableDeliveryReport(true);

// Send the message and check the response for a message id
SendSmsResponse response = smsClient.sendMessage(
    "<leased-phone-number>", 
    to, 
    "your message",
    options /* Optional */);

System.out.println("MessageId: " + response.getMessageId());

```

You should replace `<leased-phone-number>` with an SMS enabled phone number associated with your Communication Services resource and `<to-phone-number>` with the phone number you wish to send a message to. All phone number parameters should adhere to the [E.164 standard](../../../concepts/telephony-and-sms/plan-your-telephony-and-sms-solution.md#optional-reading-international-public-telecommunication-numbering-plan-e164).

The `enableDeliveryReport` parameter is an optional parameter that you can use to configure Delivery Reporting. This is useful for scenarios where you want to emit events when SMS messages are delivered. See the [Handle SMS Events](../handle-sms-events.md) quickstart to configure Delivery Reporting for your SMS messages.

> [!WARNING]
> the signature of the `sendMessage` method changes when configuring delivery reporting. Need to confirm that this is how our SDK is to be used.

## Run the code

Navigate to the directory containing the *pom.xml* file and compile the project by using the following `mvn` command.

```console
mvn compile
```

Then, build the package.

```console
mvn package
```

Run the following `mvn` command to execute the app.

```console
mvn exec:java -Dexec.mainClass="com.communication.quickstart.App" -Dexec.cleanupDaemonThreads=false
```
