---
title: include file
description: include file
services: azure-communication-services
author: Kunaal Punjabi
manager: visho
ms.service: azure-communication-services
ms.subservice: call-automation
ms.date: 08/11/2023
ms.topic: include
ms.custom: include file
ms.author: kpunjabi
---

## Download code 
Find the project for this sample on [Github](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/callautomation-openai-sample-csharp/callautomation-openai-sample-csharp). You can download this code and run it locally to try it for yourself. 

## Overview 

This sample is a server-side application that will help you create a virtual assistant capable of handling calls using Call Automation and responding to customers using the newly announced integration with Azure Cognitive Services to provide AI capabilities such as Text-to-Speech and Speech-to-Text along with smart reponses provided by Azure OpenAI. 

This Azure Communication Services Call Automation AI sample demonstrates how to use the Call Automation SDK to answer an inbound call, recognizes user voice input using Call Automation recognize API with support for Speech-to-Text. Once input is recognized it sends that information to OpenAI for an answer and plays the answer provided back by OpenAI to the caller using Call Automation play API with support for Text-to-Speech.

## Prerequisites

- Create an Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/)
- Create an Azure Communication Services resource. For details, see [Create an Azure Communication Resource](https://docs.microsoft.com/azure/communication-services/quickstarts/create-communication-resource). You'll need to record your resource **connection string** for this sample.
- An Calling-enabled telephone number. [Get a phone number](https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/telephony/get-phone-number?tabs=windows&pivots=platform-azp).
- Azure Dev Tunnels CLI. For details, see  [Enable dev tunnel](https://docs.tunnels.api.visualstudio.com/cli)
- Create an Azure Cognitive Services resource. For details, see [Create an Azure Cognitive Services Resource](https://learn.microsoft.com/en-us/azure/cognitive-services/cognitive-services-apis-create-account)
- An Azure OpenAI Resource and Deployed Model. See [instructions](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/how-to/create-resource?pivots=web-portal).


## Setup Instructions

Before running this sample, you'll need to setup the resources mentioned in the 'Prerequisites' section with the following configuration updates:

##### 1. Setup and host your Azure DevTunnel

[Azure DevTunnels](https://learn.microsoft.com/en-us/azure/developer/dev-tunnels/overview) is an Azure service that enables you to share local web services hosted on the internet. Use the commands below to connect your local development environment to the public internet. This creates a tunnel with a persistent endpoint URL and which allows anonymous access. We will then use this endpoint to notify your application of calling events from the Azure Communication Services Call Automation service.

```bash
devtunnel create --allow-anonymous
devtunnel port create -p 5165
devtunnel host
```

##### 2. Add a Managed Identity to the ACS Resource that connects to the Cognitive Services resource
Follow the instructions in this [documentation](https://learn.microsoft.com/en-us/azure/communication-services/concepts/call-automation/azure-communication-services-azure-cognitive-services-integration).

##### 3. Add the required API Keys and endpoints
Open the appsettings.json file to configure the following settings:

    - `DevTunnelUri`: your dev tunnel endpoint
    - `CognitiveServiceEndpoint`: The Cognitive Services endpoint
    - `AcsConnectionString`: Azure Communication Service resource's connection string.
    - `AzureOpenAIServiceKey`: Open AI's Service Key
    - `AzureOpenAIServiceEndpoint`: Open AI's Service Endpoint
    - `AzureOpenAIDeploymentModelName`: Open AI's Model name


## Running the application

1. Azure DevTunnel: Ensure your AzureDevTunnel URI is active and points to the correct port of your localhost application
2. Run `dotnet run` to build and run the sample application
3. Register an EventGrid Webhook for the IncomingCall Event that points to your DevTunnel URI. Instructions [here](https://learn.microsoft.com/en-us/azure/communication-services/concepts/call-automation/incoming-call-notification).


Once that's completed you should have a running application. The best way to test this is to place a call to your ACS phone number and talk to your intelligent agent.
