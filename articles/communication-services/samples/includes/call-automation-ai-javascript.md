---
title: include file
description: include file
services: azure-communication-services
manager: visho
ms.service: azure-communication-services
ms.subservice: call-automation
ms.date: 12/08/2023
ms.topic: include
ms.custom: include file
ms.author: kpunjabi
---

## Download code  
Find the project for this sample on [GitHub](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/callautomation-openai-sample). You can download this code and run it locally to try it for yourself. 

## Overview 

This sample is a server-side application that helps you create a virtual assistant capable of handling calls using Call Automation and responding to customers using the newly announced integration with Azure AI services to provide AI capabilities such as Text-to-Speech and Speech-to-Text along with smart responses provided by Azure OpenAI. 

This Azure Communication Services Call Automation AI sample demonstrates how to use the Call Automation SDK to answer an inbound call, recognizes user voice input using Call Automation recognize API with support for Speech-to-Text. Once input is recognized, it sends that information to OpenAI for an answer and plays the answer that is provided back by OpenAI to the caller using Call Automation play API with support for Text-to-Speech.

## Prerequisites

- Create an Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/)
- Create an Azure Communication Services resource. For details, see [Create an Azure Communication Resource](../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp). You need to record your resource **connection string** for this sample.
- A Calling-enabled telephone number. [Get a phone number](../../quickstarts/telephony/get-phone-number.md).
-- [Node.js](https://nodejs.org/en/download) installed
- Azure Dev Tunnels CLI. For details, see  [Enable dev tunnel](https://docs.tunnels.api.visualstudio.com/cli)
- Create an Azure AI Multi service resource. For details, see [Create an Azure AI services Resource](/azure/ai-services/multi-service-resource)
- An Azure OpenAI Resource and Deployed Model. See [instructions](/azure/ai-services/openai/how-to/create-resource?pivots=web-portal).


## Setup instructions

Before running this sample, you need to set up the resources mentioned in the 'Prerequisites' section with the following configuration updates:

##### 1. Setup and host your Azure DevTunnel

[Azure DevTunnels](/azure/developer/dev-tunnels/overview) is an Azure service that enables you to share local web services hosted on the internet. Use the commands provided in this document to connect your local development environment to the public internet. This creates a tunnel with a persistent endpoint URL and which allows anonymous access. We'll use this endpoint to notify your application of calling events from the ACS Call Automation service.

```bash
devtunnel create --allow-anonymous
devtunnel port create -p 8080
devtunnel host
```

<a name='2-add-a-managed-identity-to-the-acs-resource-that-connects-to-the-cognitive-services-resource'></a>

##### 2. Add a Managed Identity to the Azure Communication Services Resource that connects to the Azure AI services resource
Follow the instructions in this [documentation](/azure/communication-services/concepts/call-automation/azure-communication-services-azure-cognitive-services-integration).

##### 3. Add the required API Keys and endpoints
Open the `.env` file to configure the following settings

1. `CONNECTION_STRING`: Azure Communication Service resource's connection string.
2. `CALLBACK_URI`: Base url of the app. (For local development replace the dev tunnel url)
3. `COGNITIVE_SERVICE_ENDPOINT`: Azure AI Service endpoint
4. `AZURE_OPENAI_SERVICE_KEY`: Azure OpenAI service key
5. `AZURE_OPENAI_SERVICE_ENDPOINT`: Azure OpenAI endpoint
6. `AZURE_OPENAI_DEPLOYMENT_MODEL_NAME`: Azure OpenAI deployment name
6. `AGENT_PHONE_NUMBER`: Agent phone number to transfer the call to resolve queries


## Run the application

1. Open a new PowerShell window, cd into the `callautomation-openai-sample` folder and run `npm run dev`
2. Browser should pop up with the below page. If not, navigate it to `http://localhost:8080/`
3. Register an Event Grid Webhook for the IncomingCall Event that points to your DevTunnel URI. Instructions [here](/azure/communication-services/concepts/call-automation/incoming-call-notification).

Once that's completed, you should have a running application. The best way to test this sample is to place a call to your Azure Communication Services phone number and talk to your intelligent agent.

## Next steps
- Learn more about [Call Automation](../../concepts/call-automation/call-automation.md).
- Learn more about [playing custom messages](../../how-tos/call-automation/play-action.md).
- Learn more about [recognizing user input](../../how-tos/call-automation/recognize-action.md).
