---
title: include file
description: include file
services: azure-communication-services
author: Kunaal
manager: visho
ms.service: azure-communication-services
ms.date: 11/18/2022
ms.topic: include
ms.custom: include file
ms.author: kpunjabi
---

## Prerequisites
> Note:
> This application is a console-based application build on Java development kit(JDK) 11.

- Create an Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/)
- [Java Development Kit (JDK) version 11 or above](/azure/developer/java/fundamentals/java-jdk-install)
- [Apache Maven](https://maven.apache.org/download.cgi)
- Create an Azure Communication Services resource. For details, see [Create an Azure Communication Resource](../../quickstarts/create-communication-resource.md). You'll need to record your resource **connection string** for this sample.
- Get a phone number for your new Azure Communication Services resource. For details, see [Get a phone number](../../quickstarts/telephony/get-phone-number.md?tabs=windows&pivots=programming-language-csharp)
- Download and install [Ngrok](https://www.ngrok.com/download). As the sample is run locally, Ngrok will enable the receiving of all the events.
- (Optional) Create Azure Speech resource for generating custom message to be played by application. Follow [here](../../../cognitive-services/Speech-Service/overview.md) to create the resource.

> Note: This sample makes use of the Microsoft Cognitive Services Speech SDK. By downloading the Microsoft Cognitive Services Speech SDK, you acknowledge its license, see [Speech SDK license agreement](https://aka.ms/csspeech/license201809).

### Configure application

- Start ngrok in a terminal using the following command: `ngrok http 9007`, and copy the forwarding URL (`https://<ID>.grok.io`).
- Open the config.properties file to configure the following settings

    - `ConnectionString`: Azure Communication Service resource's connection string.
    - `SourcePhone`: Phone number associated with the Azure Communication Service resource.
    - `DestinationIdentity`: Target Phone number.
    - `Format`: "OutboundTarget(Phone Number)". For example, "+1425XXXAAAA"
    - `CallbackUrl`: Ngrok Forwarding URL.
    - `CognitiveServiceKey`: (Optional) Cognitive service key used for generating custom messages.
    - `CognitiveServiceRegion`: (Optional) Region associated with cognitive service.
    - `ReminderMessage`: (Optional) Text for the custom message to be converted to speech.
    - `ConfirmationMessage`: (Optional) Text for the custom message when callee presses 1.
    - `CancellationMessage`: (Optional) Text for the custom message when callee presses 2.
    - `NoInputMessage`: (Optional) Text for the custom message when DTMF recognition times out.
    - `InvalidInputMessage`: (Optional) Text for the custom message when callee presses invalid tone.

### Run the Application

- Navigate to the directory containing the pom.xml file and use the following mvn commands:
	- Compile the application: mvn compile
	- Build the package: mvn package
	- Execute the app: mvn exec:java
