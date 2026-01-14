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

Find the project for this sample on [GitHub](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/callautomation-az-openai-voice). You can download this code and run it locally to try it for yourself.

## Overview

This server-side application helps you create a virtual assistant that can handle phone calls and respond to customers by using Azure OpenAI. The virtual assistant quickly provides real-time answers.

## Prerequisites

- An Azure account with an active subscription. For more information, see [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- [Visual Studio Code](https://code.visualstudio.com/download) installed.
- [Node.js](https://nodejs.org/en/download) installed.
- An Azure Communication Services resource. For more information, see [Create an Azure Communication Services resource](../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp). You need to record your resource *connection string* for this sample.
- A phone number for your new Azure Communication Services resource. For more information, see [Get a phone number](../../quickstarts/telephony/get-phone-number.md).
- An Azure dev tunnel. For more information, see [Enable dev tunnels](/azure/developer/dev-tunnels/get-started).
- An Azure OpenAI resource and deployed model. For more information, see [Create an Azure OpenAI resource and deploy a model](/azure/ai-services/openai/how-to/create-resource?pivots=web-portal).

> [!NOTE]
> Bidirectional streaming in Azure Communication Services is generally available, but the Azure OpenAI real-time API has its own release schedule. For up-to-date information on the API's availability, see [Azure OpenAI in Azure AI Foundry models](/azure/ai-services/openai/concepts/models?tabs=global-standard%2Cstandard-chat-completions#audio-models).

## Before you run the sample for the first time

1. Open an instance of PowerShell, a Windows terminal, a command prompt, or the equivalent, and go to the directory where you want to clone the sample.
1. Use the command `git clone https://github.com/Azure-Samples/communication-services-javascript-quickstarts.git`.
1. Use the command `cd` to access the `callautomation-az-openai-voice` folder.
1. From the root of the folder, and with a node installed, run `npm install`.

#### Step 1: Set up and host your dev tunnel

With [dev tunnels](/azure/developer/dev-tunnels/overview), you can share local web services that are hosted on the internet. Use the commands to connect your local development environment to the public internet. This process creates a tunnel with a persistent endpoint URL and allows anonymous access. We use this endpoint to notify your application of calling events from Call Automation.

```bash
devtunnel create --allow-anonymous
devtunnel port create -p 8080
devtunnel host
```

#### Step 2: Add the required API keys and endpoints

Open the `.env` file to configure the following settings:

- `CONNECTION_STRING`: Azure Communication Services resource connection string.
- `CALLBACK_URI`: Base URL of the app. For local developments, replace the dev tunnel URL.
- `AZURE_OPENAI_SERVICE_KEY`: Azure OpenAI service key.
- `AZURE_OPENAI_SERVICE_ENDPOINT`: Azure OpenAI endpoint.
- `AZURE_OPENAI_DEPLOYMENT_MODEL_NAME`: Azure OpenAI deployment name.

## Run the application

### Run the app locally

1. Open a new PowerShell window, use the `cd` command to open the `callautomation-az-openai-voice` folder, and run `npm run dev`.
1. The browser opens with a page. If it doesn't, go to `http://localhost:8080/`.
1. Register an Azure Event Grid webhook for the `IncomingCall` event that points to your 8080 port URI. For more information, see [Incoming call concepts](/azure/communication-services/concepts/call-automation/incoming-call-notification). For example:

   ``` code
    https://<devtunelurl>/api/incomingCall
   ```

Now you have a running application. The best way to test this sample is to place a call to your Azure Communication Services phone number and talk to your intelligent agent.

## Related content

- Learn more about [Call Automation](../../concepts/call-automation/call-automation.md).
- Learn more about [bidirectional streaming](../../concepts/call-automation/audio-streaming-concept.md).
