---
title: include file
description: include file
services: azure-communication-services
author: chrwhit
manager: nimag

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 08/20/2020
ms.topic: include
ms.custom: include file
ms.author: chrwhit
---

Get started with Azure Communication Services by using the Communication Services Java SMS client library to send SMS messages.

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

<!--**TODO: update all these reference links as the resources go live**

[API reference documentation](../../../references/overview.md) | [Library source code](https://github.com/Azure/azure-sdk-for-net-pr/tree/feature/communication/sdk/communication/Azure.Communication.Sms#todo-update-to-public) | [Artifact (Maven)](#todo-nuget) | [Samples](#todo-samples)-->

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Java Development Kit (JDK)](https://docs.microsoft.com/java/azure/jdk/?view=azure-java-stable&preserve-view=true) version 8 or above.
- [Apache Maven](https://maven.apache.org/download.cgi).
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md).
- An SMS enabled telephone number. [Get a phone number](../get-phone-number.md).

### Prerequisite check

- In a terminal or command window, run `mvn -v` to check that maven is installed.
- To view the phone numbers associated with your Communication Services resource, sign in to the [Azure portal](https://portal.azure.com/), locate your Communication Services resource and open the **phone numbers** tab from the left navigation pane.

## Setting up

### Create a new Java application

Open your terminal or command window and navigate to the directory where you would like to create your Java application. Run the command below to generate the Java project from the maven-archetype-quickstart template.

```console
mvn archetype:generate -DgroupId=com.communication.quickstart -DartifactId=communication-quickstart -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.4 -DinteractiveMode=false
```

The 'generate' goal will create a directory with the same name as the artifactId. Under this directory, the **src/main/java** directory contains the project source code, the **src/test/java directory** contains the test source, and the **pom.xml** file is the project's Project Object Model, or POM.

### Install the package

Open the **pom.xml** file in your text editor. Add the following dependency element to the group of dependencies.

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-communication-sms</artifactId>
    <version>1.0.0-beta.2</version>
</dependency>
```

### Set up the app framework

Add the `azure-core-http-netty` dependency to your **pom.xml** file.

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-core-http-netty</artifactId>
    <version>1.3.0</version>
</dependency>
```

Open **/src/main/java/com/communication/quickstart/App.java** in a text editor, add import directives and remove the `System.out.println("Hello world!");` statement:

```java
package com.communication.quickstart;

import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;

import com.azure.communication.common.CommunicationClientCredential;
import com.azure.communication.common.PhoneNumber;
import com.azure.communication.sms.SmsClient;
import com.azure.communication.sms.SmsClientBuilder;
import com.azure.communication.sms.models.SendSmsOptions;
import com.azure.communication.sms.models.SendSmsResponse;
import com.azure.core.http.HttpClient;
import com.azure.core.http.netty.NettyAsyncHttpClientBuilder;

public class App
{
    public static void main( String[] args ) throws IOException, NoSuchAlgorithmException, InvalidKeyException
    {
        // Quickstart code goes here
    }
}

```

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services SMS client library for Java.

| Name                                                             | Description                                                                                     |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| SmsClientBuilder              | This class creates the SmsClient. You provide it with endpoint, credential, and an http client. |
| SmsClient                    | This class is needed for all SMS functionality. You use it to send SMS messages.                |
| SendSmsResponse               | This class contains the response from the SMS service.                                          |
| CommunicationClientCredential | This class handles signing requests.                                                            |
| PhoneNumber                   | This class holds phone number information

## Authenticate the client

Instantiate an `SmsClient` with your connection string. The code below retrieves the endpoint and credential strings for the resource from environment variables named `COMMUNICATION_SERVICES_ENDPOINT_STRING` and `COMMUNICATION_SERVICES_CREDENTIAL_STRING` (Credential is the `Key` from the Azure portal. Learn how to [manage you resource's connection string](../../create-communication-resource.md#store-your-connection-string).

Add the following code to the `main` method:

```java
// Create an HttpClient builder of your choice and customize it
HttpClient httpClient = new NettyAsyncHttpClientBuilder().build();

CommunicationClientCredential credential = new CommunicationClientCredential(accessKey);

// Configure and build a new SmsClient
SmsClient client = new SmsClientBuilder()
    .endpoint(endpoint)
    .credential(credential)
    .httpClient(httpClient)
    .buildClient();
```

You can initialize the client with any custom HTTP client the implements the `com.azure.core.http.HttpClient` interface. The above code demonstrates use of the [Azure Core Netty HTTP client](https://docs.microsoft.com/java/api/overview/azure/core-http-netty-readme?view=azure-java-stable&preserve-view=true) that is provided by `azure-core`.

## Send an SMS message

Send an SMS message by calling the sendMessage method. Add this code to the end of `main` method:

```java
List<PhoneNumber> to = new ArrayList<PhoneNumber>();
to.add(new PhoneNumber("<to-phone-number>"));

// SendSmsOptions is an optional field. It can be used
// to enable a delivery report to the Azure Event Grid
SendSmsOptions options = new SendSmsOptions();
options.setEnableDeliveryReport(true);

// Send the message and check the response for a message id
SendSmsResponse response = client.sendMessage(
    new PhoneNumber("<leased-phone-number>"),
    to,
    "<message-text>",
    options);

System.out.println("MessageId: " + response.getMessageId());
```

You should replace `<leased-phone-number>` with an SMS enabled phone number associated with your Communication Services resource and `<to-phone-number>` with the phone number you wish to send a message to.

The `enableDeliveryReport` parameter is an optional parameter that you can use to configure Delivery Reporting. This is useful for scenarios where you want to emit events when SMS messages are delivered. See the [Handle SMS Events](../handle-sms-events.md) quickstart to configure Delivery Reporting for your SMS messages.

<!--todo: the signature of the `sendMessage` method changes when configuring delivery reporting. Need to confirm that this is how our client library is to be used.-->

## Run the code

Navigate to the directory containing the **pom.xml** file and compile the project using the `mvn` command.

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
