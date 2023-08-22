---
title: include file
description: include file
services: azure-communication-services
manager: visho
ms.service: azure-communication-services
ms.subservice: call-automation
ms.date: 08/18/2023
ms.topic: include
ms.custom: include file
ms.author: kpunjabi
---

## Download code 
Find the project for this sample on [GitHub](https://github.com/Azure-Samples/communication-services-java-quickstarts/tree/main/CallAutomation_OpenAI_Sample). You can download this code and run it locally to try it for yourself. 

## Overview 

This sample is a server-side application that helps you create a virtual assistant capable of handling calls using Call Automation and responding to customers using the newly announced integration with Azure Cognitive Services to provide AI capabilities such as Text-to-Speech and Speech-to-Text along with smart responses provided by Azure OpenAI. 

This Azure Communication Services Call Automation AI sample demonstrates how to use the Call Automation SDK to answer an inbound call, recognizes user voice input using Call Automation recognize API with support for Speech-to-Text. Once input is recognized, it sends that information to OpenAI for an answer and plays the answer provided back by OpenAI to the caller using Call Automation play API with support for Text-to-Speech.


## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A [phone number](../../quickstarts/telephony/get-phone-number.md) in your Azure Communication Services resource that can make outbound calls. NB: phone numbers aren't available in free subscriptions.
- [Java Development Kit (JDK) Microsoft.OpenJDK.17](https://learn.microsoft.com/java/openjdk/download)
- [Apache Maven](https://maven.apache.org/download.cgi)
- Create and host an Azure Dev Tunnel. Instructions [here](https://learn.microsoft.com/azure/developer/dev-tunnels/get-started)
- Create an Azure Cognitive Services resource. For details, see Create an Azure Cognitive Services Resource.
- An Azure OpenAI Resource and Deployed Model. See [instructions](https://learn.microsoft.com/azure/ai-services/openai/how-to/create-resource?pivots=web-portal).

## Before running the sample for the first time

- Open the application.yml file in the resources folder to configure the following settings

    - `connectionstring`: Azure Communication Service resource's connection string.
    - `basecallbackuri`: Base url of the app. For local development use dev tunnel url.
    - `cognitiveServicesUrl`: The Cognitive Services endpoint
    - `azureOpenAiServiceKey`: Open AI's Service Key
    - `azureOpenAiServiceEndpoint`: Open AI's Service Endpoint
    - `openAiModelName`: Open AI's Model name


### Setup and host your Azure DevTunnel

[Azure DevTunnels](https://learn.microsoft.com/azure/developer/dev-tunnels/overview) is an Azure service that enables you to share local web services hosted on the internet. Use the commands provided to connect your local development environment to the public internet. This creates a tunnel with a persistent endpoint URL and which allows anonymous access. We'll then use this endpoint to notify your application of calling events from the ACS Call Automation service.

```bash
devtunnel create --allow-anonymous
devtunnel port create -p 8080
devtunnel host
```

### Run the application

- Navigate to the directory containing the pom.xml file and use the following mvn commands:
    - Compile the application: mvn compile
    - Build the package: mvn package
    - Execute the app: mvn exec:java
- Access the Swagger UI at http://localhost:8080/swagger-ui.html
    - Try the GET /outboundCall to run the Sample Application


Once that's completed, you should have a running application. The best way to test this sample is to place a call to your ACS phone number and talk to your intelligent agent.

## Next steps
- Learn more about [Call Automation](../../concepts/call-automation/call-automation.md).
- Learn more about [playing custom messages](../../how-tos/call-automation/play-action.md).
- Learn more about [recognizing user input](../../how-tos/call-automation/recognize-action.md).
