---
title: Include file
description: Include file
services: azure-communication-services
manager: visho
ms.service: azure-communication-services
ms.subservice: call-automation
ms.date: 12/08/2023
ms.topic: include
ms.author: kpunjabi
ms.custom:
  - include file
  - sfi-ropc-nochange
---

## Download code

Find the project for this sample on [GitHub](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/callautomation-openai-sample). You can download this code and run it locally to try it for yourself.

## Overview

This sample is a server-side application that helps you create a virtual assistant that can handle calls by using Call Automation. The virtual assistant responds to customers by using the newly announced integration with Azure AI services to provide AI capabilities such as text to speech and speech to text, along with smart responses provided by Azure OpenAI.

This Azure Communication Services Call Automation AI sample demonstrates how to use the Call Automation SDK to answer an inbound call. It recognizes user voice input by using Call Automation to recognize the API with support for speech to text. When the system recognizes the input, it sends that information to OpenAI for an answer. It uses the Call Automation Play API with support for text to speech to play back the answer provided by OpenAI to the caller.

## Prerequisites

- An Azure account with an active subscription. For more information, see [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An Azure Communication Services resource. For more information, see [Create an Azure Communication Services resource](../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp). You need to record your resource *connection string* for this sample.
- A calling-enabled telephone number. For more information, see [Get a phone number](../../quickstarts/telephony/get-phone-number.md).
- [Node.js](https://nodejs.org/en/download) installed.
- An Azure dev tunnel. For more information, see [Enable dev tunnels](/azure/developer/dev-tunnels/get-started).
- An Azure AI multiservice resource. For more information, see [Create an Azure AI services resource](/azure/ai-services/multi-service-resource).
- An Azure OpenAI resource and deployed model. For more information, see [Create an Azure OpenAI resource and deploy a model](/azure/ai-services/openai/how-to/create-resource?pivots=web-portal).

## Setup instructions

Before you run this sample, you need to set up the resources mentioned in the preceding section with the following configuration updates.

#### Step 1: Set up and host your Azure dev tunnel

With [dev tunnels](/azure/developer/dev-tunnels/overview), you can share local web services that are hosted on the internet. Use the following commands to connect your local development environment to the public internet. This process creates a tunnel with a persistent endpoint URL and allows anonymous access. We use this endpoint to notify your application of calling events from Call Automation.

```bash
devtunnel create --allow-anonymous
devtunnel port create -p 8080
devtunnel host
```

<a name='2-add-a-managed-identity-to-the-acs-resource-that-connects-to-the-cognitive-services-resource'></a>

#### Step 2: Add a managed identity to the Azure Communication Services resource that connects to the Azure AI services resource

Follow the instructions in [Connect Azure Communication Services with Azure AI services](/azure/communication-services/concepts/call-automation/azure-communication-services-azure-cognitive-services-integration).

#### Step 3: Add the required API keys and endpoints

Open the `.env` file to configure the following settings:

- `CONNECTION_STRING`: Azure Communication Services resource connection string.
- `CALLBACK_URI`: Base URL of the app. For local development, replace the dev tunnel URL.
- `COGNITIVE_SERVICE_ENDPOINT`: Azure AI service endpoint.
- `AZURE_OPENAI_SERVICE_KEY`: Azure OpenAI service key.
- `AZURE_OPENAI_SERVICE_ENDPOINT`: Azure OpenAI endpoint.
- `AZURE_OPENAI_DEPLOYMENT_MODEL_NAME`: Azure OpenAI deployment name.
- `AGENT_PHONE_NUMBER`: Agent phone number to transfer the call to resolve queries.

## Run the application

1. Open a new PowerShell window, use the `cd` command to open the `callautomation-openai-sample` folder, and run `npm run dev`.
1. The browser opens with a page. If it doesn't, go to `http://localhost:8080/`.
1. Register an Azure Event Grid webhook for the `IncomingCall` event that points to your `DevTunnel` URI. For more information, see [Incoming call concepts](/azure/communication-services/concepts/call-automation/incoming-call-notification).

Now you have a running application. The best way to test this sample is to place a call to your Azure Communication Services phone number and talk to your intelligent agent.

## Related content

- Learn more about [Call Automation](../../concepts/call-automation/call-automation.md).
- Learn more about [playing custom messages](../../how-tos/call-automation/play-action.md).
- Learn more about [recognizing user input](../../how-tos/call-automation/recognize-action.md).
