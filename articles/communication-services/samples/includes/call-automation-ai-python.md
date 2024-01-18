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
Find the project for this sample on [GitHub](https://github.com/Azure-Samples/communication-services-python-quickstarts/tree/main/callautomation-openai-sample). You can download this code and run it locally to try it for yourself. 

## Overview 

This sample is a server-side application that helps you create a virtual assistant capable of handling calls using Call Automation. It also enables your assistant to respond to customers using Azure AI services, which provide AI capabilities such as Text-to-Speech and Speech-to-Text, as well as smart responses provided by Azure OpenAI.

This Azure Communication Services Call Automation AI sample demonstrates how to use the Call Automation SDK to answer an inbound call, recognizes user voice input using Call Automation recognize API with support for Speech-to-Text. When the system recognizes the input, it sends the information to OpenAI for an answer and uses the Call Automation play API with support for Text-to-Speech to play back the answer provided by OpenAI to the caller.

## Prerequisites

- Create an Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/).
- Create an Azure Communication Services resource. For details, see [Create an Azure Communication Resource](../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp). You need to record your resource **connection string** for this sample.
- A Calling-enabled telephone number. [Get a phone number](../../quickstarts/telephony/get-phone-number.md).
- Azure Dev Tunnels CLI. For details, see  [Enable dev tunnel](https://docs.tunnels.api.visualstudio.com/cli).
- Create an Azure AI Multi service resource. For details, see [Create an Azure AI services Resource](/azure/ai-services/multi-service-resource).
- An Azure OpenAI Resource and Deployed Model. See [instructions](/azure/ai-services/openai/how-to/create-resource?pivots=web-portal).
- Create and host an Azure Dev Tunnel. Instructions [here](/azure/ai-services/multi-service-resource).
- [Python](https://www.python.org/downloads/) 3.7 or above (please be aware that currently version 3.12 does not have support for OpenAI libraries).

## Setup instructions

Before running this sample, you need to set up the resources mentioned in the 'Prerequisites' section with the following configuration updates:

##### 1. Setup Python environment 

Create and activate python virtual environment and install required packages using following command 
```
pip install -r requirements.txt
```

##### 2. Setup and host your Azure DevTunnel

[Azure DevTunnels](/azure/developer/dev-tunnels/overview) is an Azure service that enables you to share local web services hosted on the internet. Use the commands provided to connect your local development environment to the public internet. This process creates a tunnel with a persistent endpoint URL and allows anonymous access. We'll use this endpoint to notify your application of calling events from the ACS Call Automation service.

```bash
devtunnel create --allow-anonymous
devtunnel port create -p 8080
devtunnel host
```

<a name='2-add-a-managed-identity-to-the-acs-resource-that-connects-to-the-cognitive-services-resource'></a>

##### 3. Add a Managed Identity to the Azure Communication Services Resource that connects to the Azure AI services resource
Follow the instructions in this [documentation](/azure/communication-services/concepts/call-automation/azure-communication-services-azure-cognitive-services-integration).

##### 4. Add the required API Keys and endpoints

Open `main.py` file to configure the following settings

1. - `CALLBACK_URI_HOST`: your dev tunnel endpoint
2. - `COGNITIVE_SERVICE_ENDPOINT`: The Azure AI Services endpoint
3. - `ACS_CONNECTION_STRING`: Azure Communication Service resource's connection string.
4. - `AZURE_OPENAI_SERVICE_KEY`: Open AI's Service Key
5. - `AZURE_OPENAI_SERVICE_ENDPOINT`: Open AI's Service Endpoint
6. - `AZURE_OPENAI_DEPLOYMENT_MODEL_NAME`: Open AI's Model name
6. - `AGENT_PHONE_NUMBER`: Agent Phone Number to transfer call


## Run the application

1. Navigate to `callautomation-openai-sample` folder and run `main.py` in debug mode or use command `python ./main.py` to run it from PowerShell, Command Prompt or Unix Terminal
2. Browser should pop up with the below page. If not, navigate it to `http://localhost:8080/` or your dev tunnel url.
3. Register an Event Grid Webhook for the IncomingCall Event that points to your DevTunnel URI. Instructions [here](/azure/communication-services/concepts/call-automation/incoming-call-notification).

Once you complete that, your application should be up and running. The best way to test this sample is to place a call to your Azure Communication Services phone number and talk to your intelligent agent.

## Next steps
- Learn more about [Call Automation](../../concepts/call-automation/call-automation.md).
- Learn more about [playing custom messages](../../how-tos/call-automation/play-action.md).
- Learn more about [recognizing user input](../../how-tos/call-automation/recognize-action.md).
