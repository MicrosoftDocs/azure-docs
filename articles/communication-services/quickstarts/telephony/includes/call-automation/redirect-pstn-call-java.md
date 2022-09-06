---
title: include file
description: Java Call Automation quickstart for PSTN calls
services: azure-communication-services
author: ashwinder
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 09/06/2022
ms.topic: include
ms.custom: include file
ms.author: askaur
---

## Prerequisites

- Azure account with an active subscription.
- Azure Communication Services resource. See [Create an Azure Communication Services resource](../../../create-communication-resource.md?tabs=windows&pivots=platform-azp).
- A [web service application](https://docs.microsoft.com/aspnet/core/web-api) to handle web hook callback events.
- Optional: [NGROK application](https://ngrok.com/) to proxy HTTP/S requests to a local development machine.
- The [ARMClient application](https://github.com/projectkudu/ARMClient), used to configure the Event Grid subscription.
- [Java Development Kit (JDK)](https://docs.microsoft.com/azure/developer/java/fundamentals/java-jdk-install) version 8 or above.
- [Apache Maven](https://maven.apache.org/download.cgi).

## Create a new Java application

Open your terminal or command window and navigate to the directory where you would like to create your Java application. Run the command below to generate the Java project from the maven-archetype-quickstart template.

[Pastebin code reference](https://paste.microsoft.com/a89caeb8-bd42-49ad-a501-729dcdd04a0a)

The command above creates a directory with the same name as `artifactId` argument. Under this directory, `src/main/java` directory contains the project source code, `src/test/java` directory contains the test source.

You'll notice that the 'generate' step created a directory with the same name as the artifactId. Under this directory, `src/main/java` directory contains source code, `src/test/java` directory contains tests, and `pom.xml` file is the project's Project Object Model, or POM.

Update your application's POM file to use Java 8 or higher.

[Pastebin code reference](https://paste.microsoft.com/326bfdf8-3a96-480c-af47-afe59d018508)  

## Configure Azure SDK Dev Feed

Since the Call Automation SDK version used in this quick start is not yet available in Maven Central Repository, we need to add an Azure Artifacts development feed which contains the latest version of the Call Automation SDK.  

Please add the [azure-sdk-for-java feed](https://dev.azure.com/azure-sdk/public/_artifacts/feed/azure-sdk-for-java) to your `pom.xml`. Follow the instructions after clicking the “Connect to Feed” button.

## Add package references

In your POM file, add the following dependencies for the project.

**azure-communication-callingserver**

Azure Communication Services Call Automation SDK package is retrieved from the Azure SDK Dev Feed configured above.

[Pastebin code reference](https://paste.microsoft.com/76a2d324-af9a-4b5c-ad68-33aaa22f06a9)  

**azure-messaging-eventgrid**

Azure Event Grid SDK package: [com.azure : azure-messaging-eventgrid](https://search.maven.org/artifact/com.azure/azure-messaging-eventgrid). Data types from this package are used to handle Call Automation IncomingCall event received from the Event Grid.

[Pastebin code reference](https://paste.microsoft.com/9df51366-7ffc-4c79-9821-8881ab0b1333)

**spark-core**

Spark framework: com.sparkjava : spark-core. We’ll use this micro-framework to create a webhook (web api endpoint) to handle Event Grid events. Please note that you can use any framework to create a web api.

[Pastebin code reference](https://paste.microsoft.com/c29c5178-9c4a-406c-9a05-155730e7092a)  

**gson**

Google Gson package: [com.google.code.gson : gson](https://search.maven.org/artifact/com.sparkjava/spark-core). A serialization/deserialization library to handle conversion between Java Objects and JSON.

[Pastebin code reference](https://paste.microsoft.com/0fb449bb-a3ba-4311-aa14-4bf77a349900)  

## Redirect incoming call

In your editor of choice, open App.java file and update it with the following code to create an endpoint to receive IncomingCall events and redirect calls to another user.

[Pastebin code reference](https://paste.microsoft.com/0ae328ee-5662-4418-a9e2-c94790c7a2f1)

## Run the code

To run your Java application, run maven compile, package, and execute commands. By default, SparkJava runs on port 4567, so the endpoint will be available at `http://localhost:4567/api/incomingCall`.

[Pastebin code reference](https://paste.microsoft.com/1a94a067-907f-4fc2-9df7-a429fc2a723d)

## Subscribe to EventGrid IncomingCall event using a webhook

Azure COmmunication Services use Event Grid to deliver the `IncomingCall` event. In this guide, we will configure a webhook to receive events from the Event Grid. Ngrok utility will help make our localhost endpoint reachable to the internet through a public URI.

1. Find the following identifiers used in the next steps: Azure subscription ID, resource group name, Communication Services resource name.
2. Determine the URI of the local incomingCall endpoint. By default, it should be `http://localhost:4567/api/incomingCall` where the port is 4567.
3. Install and start ngrok with the following command.

    ```console
    ngrok http <port>
    ```

    This will create a public URI like `https://ff2f-75-155-253-232.ngrok.io/`.
4. Since the IncomingCall event is not yet published in the Azure portal, you need run the following Azure CLI command to configure an event subscription (please replace with your identifiers and ngrok URI).

    [Pastebin code reference](https://paste.microsoft.com/5747e80e-50ff-4b9a-9969-5303704b7daf)  
