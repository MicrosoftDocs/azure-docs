---
title: Include file 
description: Include file for Call Automation and Azure OpenAI sample
services: azure-communication-services
ms.service: azure-communication-services
ms.subservice: call-automation
ms.date: 11/27/2024
ms.topic: include
ms.author: kpunjabi
ms.custom:
  - include file
  - sfi-ropc-nochange
---

## Download code

Find the project for this sample on [GitHub](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/CallAutomation_AzOpenAI_Voice). You can download this code and run it locally to try it for yourself.

## Overview

This server-side application helps you create a virtual assistant that can handle phone calls and respond to customers by using Azure OpenAI. The virtual assistant quickly provides real-time answers.

## Prerequisites

- An Azure account with an active subscription. For more information, see [Create an account for free](https://azure.microsoft.com/free/).
- An Azure Communication Services resource. For more information, see [Create an Azure Communication Services resource](../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp). You need to record your resource *connection string* for this sample.
- A calling-enabled telephone number. For more information, see [Get a phone number](../../quickstarts/telephony/get-phone-number.md).
- An Azure dev tunnel. For more information, see [Enable dev tunnels](/azure/developer/dev-tunnels/get-started).
- An Azure OpenAI resource and deployed model. For more information, see [Create an Azure OpenAI resource and deploy a model](/azure/ai-services/openai/how-to/create-resource?pivots=web-portal).

> [!NOTE]
> Bidirectional streaming in Azure Communication Services is generally available, but the Azure OpenAI real-time API has its own release schedule. For up-to-date information on the API's availability, see [Azure OpenAI in Azure AI Foundry models](/azure/ai-services/openai/concepts/models?tabs=global-standard%2Cstandard-chat-completions#audio-models).

## Setup instructions

Before you run this sample, you need to set up the resources with the following configuration updates.

#### Step 1: Set up and host your dev tunnel

With [dev tunnels](/azure/developer/dev-tunnels/overview), you can share local web services that are hosted on the internet. Use the commands to connect your local development environment to the public internet. This process creates a tunnel with a persistent endpoint URL and allows anonymous access. We use this endpoint to notify your application of calling events from Call Automation.

```bash
devtunnel create --allow-anonymous
devtunnel port create -p 5165
devtunnel host
```

#### Step 2: Add the required API keys and endpoints

Open the appsettings.json file to configure the following settings:

```code
    - DevTunnelUri: your dev tunnel endpoint
    - AcsConnectionString: Azure Communication Service resource's connection string.
    - AzureOpenAIServiceKey: Open AI's Service Key
    - AzureOpenAIServiceEndpoint: Open AI's Service Endpoint
    - AzureOpenAIDeploymentModelName: Open AI's Model name
```

## Run the application

1. Ensure that your `AzureDevTunnel` URI is active and points to the correct port of your local host application.
1. Run `dotnet run` to build and run the sample application.
1. Register an Azure Event Grid webhook for the `IncomingCall` event that points to your `DevTunnel` URI. For more information, see [Incoming call concepts](/azure/communication-services/concepts/call-automation/incoming-call-notification). For example:

``` code
 https://<devtunelurl>/api/incomingCall
```

Now you have a running application. The best way to test this sample is to place a call to your Azure Communication Services phone number and talk to your intelligent agent.

## Related content

- Learn more about [Call Automation](../../concepts/call-automation/call-automation.md).
- Learn more about [bidirectional streaming](../../concepts/call-automation/audio-streaming-concept.md).
