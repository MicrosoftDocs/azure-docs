---
title: Include file 
description: Include file for Call Automation and Azure OpenAI sample
services: azure-communication-services
ms.service: azure-communication-services
ms.subservice: call-automation
ms.date: 11/27/2024
ms.topic: include
ms.custom: include file
ms.author: kpunjabi
---

## Download code 
Find the project for this sample on [GitHub](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/callautomation-az-openai-voice). You can download this code and run it locally to try it for yourself. 

## Overview 

This server-side application helps create a virtual assistant that can handle phone calls and respond to customers using Azure OpenAI services, providing quick and real-time answers.

## Prerequisites

- Create an Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/)
- [Visual Studio Code](https://code.visualstudio.com/download) installed
- [Node.js](https://nodejs.org/en/download) installed
- Create an Azure Communication Services resource. For details, see [Create an Azure Communication Resource](../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp). You need to record your resource **connection string** for this sample.
- Get a phone number for your new Azure Communication Services resource. For details, see [Get a phone number](../../quickstarts/telephony/get-phone-number.md).
- Azure Dev Tunnels CLI. For details, see  [Enable dev tunnel](https://docs.tunnels.api.visualstudio.com/cli)
- An Azure OpenAI Resource and Deployed Model. See [instructions](/azure/ai-services/openai/how-to/create-resource?pivots=web-portal).


## Before running the sample for the first time

1. Open an instance of PowerShell, Windows Terminal, Command Prompt, or equivalent and navigate to the directory that you would like to clone the sample to.
2. git clone `https://github.com/Azure-Samples/communication-services-javascript-quickstarts.git`.
3. cd into the `callautomation-az-openai-voice` folder.
4. From the root of the folder, and with node installed, run `npm install`

##### 1. Set up and host your Azure DevTunnel

[Azure DevTunnels](/azure/developer/dev-tunnels/overview) is an Azure service that enables you to share local web services hosted on the internet. Use the commands to connect your local development environment to the public internet. This creates a tunnel with a persistent endpoint URL and which allows anonymous access. We use this endpoint to notify your application of calling events from the ACS Call Automation service.

```bash
devtunnel create --allow-anonymous
devtunnel port create -p 8080
devtunnel host
```

##### 2. Add the required API Keys and endpoints
Open the `.env` file to configure the following settings

1. `CONNECTION_STRING`: Azure Communication Service resource's connection string.
2. `CALLBACK_URI`: Base url of the app. (For local developments replace the dev tunnel url)
3. `AZURE_OPENAI_SERVICE_KEY`: Azure OpenAI service key
4. `AZURE_OPENAI_SERVICE_ENDPOINT`: Azure OpenAI endpoint
5. `AZURE_OPENAI_DEPLOYMENT_MODEL_NAME`: Azure OpenAI deployment name

## Running the application

### Run app locally

1. Open a new PowerShell window, cd into the `callautomation-az-openai-voice` folder and run `npm run dev`
2. Browser should pop up with a page. If not, navigate it to `http://localhost:8080/`
3. Register an Event Grid Webhook for the IncomingCall Event that points to your 8080 port URI. Instructions [here](/azure/communication-services/concepts/call-automation/incoming-call-notification). For example:

``` code
 https://<devtunelurl>/api/incomingCall
```

Once that's completed, you have a running application. The best way to test this is to place a call to your ACS phone number and talk to your intelligent agent.

## Next steps
- Learn more about [Call Automation](../../concepts/call-automation/call-automation.md).
- Learn more about [Bidirectional streaming](../../concepts/call-automation/audio-streaming-concept.md)
