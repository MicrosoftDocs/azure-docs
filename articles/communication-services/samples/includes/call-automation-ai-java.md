---
title: Include file
description: Include file
services: azure-communication-services
manager: visho
ms.service: azure-communication-services
ms.subservice: call-automation
ms.date: 08/18/2023
ms.topic: include
ms.author: kpunjabi
ms.custom:
  - include file
  - sfi-ropc-nochange
---

## Download code

Find the project for this sample on [GitHub](https://github.com/Azure-Samples/communication-services-java-quickstarts/tree/main/CallAutomation_OpenAI_Sample). You can download this code and run it locally to try it for yourself.

## Overview

This sample is a server-side application that helps you create a virtual assistant that can handle calls by using Call Automation. The virtual assistant responds to customers by using the newly announced integration with Azure AI services to provide AI capabilities such as text to speech and speech to text, along with smart responses provided by Azure OpenAI.

This Azure Communication Services Call Automation AI sample demonstrates how to use the Call Automation SDK to answer an inbound call. It recognizes user voice input by using Call Automation to recognize the API with support for speech to text. When the system recognizes the input, it sends that information to OpenAI for an answer. It uses the Call Automation Play API with support for text to speech to play back the answer provided by OpenAI to the caller.

## Prerequisites

- An Azure account with an active subscription. For more information, see [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- A deployed Azure Communication Services resource. For more information, see [Create an Azure Communication Services resource](../../quickstarts/create-communication-resource.md).
- A [phone number](../../quickstarts/telephony/get-phone-number.md) in your Azure Communication Services resource that can make outbound calls. Phone numbers aren't available in free subscriptions.
- [Java Development Kit (JDK) Microsoft.OpenJDK.17](/java/openjdk/download).
- [Apache Maven](https://maven.apache.org/download.cgi).
- An Azure dev tunnel. For more information, see [Enable dev tunnels](/azure/developer/dev-tunnels/get-started).
- An Azure AI services resource. For more information, see [Create an Azure AI services resource](/azure/ai-services/multi-service-resource).
- An Azure OpenAI resource and deployed model. For more information, see [Create an Azure OpenAI resource and deploy a model](/azure/ai-services/openai/how-to/create-resource?pivots=web-portal).

## Before you run the sample for the first time

Open the application.yml file in the resources folder to configure the following settings:

- `connectionstring`: Azure Communication Services resource connection string.
- `basecallbackuri`: Base URL of the app. For local development, use the dev tunnel URL.
- `cognitiveServicesUrl`: Azure AI services endpoint.
- `azureOpenAiServiceKey`: Azure OpenAI service key.
- `azureOpenAiServiceEndpoint`: Azure OpenAI service endpoint.
- `openAiModelName`: Azure OpenAI model name.

### Set up and host your Azure dev tunnel

With [dev tunnels](/azure/developer/dev-tunnels/overview), you can share local web services that are hosted on the internet. Use the following commands to connect your local development environment to the public internet. This process creates a tunnel with a persistent endpoint URL and allows anonymous access. We use this endpoint to notify your application of calling events from Call Automation.

```bash
devtunnel create --allow-anonymous
devtunnel port create -p 8080
devtunnel host
```

### Run the application

- Go to the directory that contains the pom.xml file and use the following mvn commands:

    - **Compile the application:** `mvn compile`
    - **Build the package:** `mvn package`
    - **Execute the app:** `mvn exec:java`
- Access the Swagger UI at `http://localhost:8080/swagger-ui.html`.
    - Try the `GET /outboundCall` to run the sample application.

Now you have a running application. The best way to test this sample is to place a call to your Azure Communication Services phone number and talk to your intelligent agent.

## Related content

- Learn more about [Call Automation](../../concepts/call-automation/call-automation.md).
- Learn more about [playing custom messages](../../how-tos/call-automation/play-action.md).
- Learn more about [recognizing user input](../../how-tos/call-automation/recognize-action.md).
