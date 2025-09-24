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

Find the project for this sample on [GitHub](https://github.com/Azure-Samples/communication-services-python-quickstarts/tree/main/callautomation-openai-sample). You can download this code and run it locally to try it for yourself.

## Overview

This sample is a server-side application that helps you create a virtual assistant that can handle calls by using Call Automation. It also enables your assistant to respond to customers by using Azure AI services, which provide AI capabilities such as text to speech and speech to text, along with smart responses provided by Azure OpenAI.

This Azure Communication Services Call Automation AI sample demonstrates how to use the Call Automation SDK to answer an inbound call. It recognizes user voice input by using Call Automation to recognize the API with support for speech to text. When the system recognizes the input, it sends the information to OpenAI for an answer. It uses the Call Automation Play API with support for text to speech to play back the answer provided by OpenAI to the caller.

## Prerequisites

- An Azure account with an active subscription. For more information, see [Create an account for free](https://azure.microsoft.com/free/).
- An Azure Communication Services resource. For more information, see [Create an Azure Communication Services resource](../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp). You need to record your resource *connection string* for this sample.
- A calling-enabled telephone number. For more information, see [Get a phone number](../../quickstarts/telephony/get-phone-number.md).
- An Azure dev tunnel. For more information, see [Enable dev tunnels](/azure/developer/dev-tunnels/get-started).
- An Azure AI multiservice resource. For more information, see [Create an Azure AI services resource](/azure/ai-services/multi-service-resource).
- An Azure OpenAI resource and deployed model. For more information, see [Create an Azure OpenAI resource and deploy a model](/azure/ai-services/openai/how-to/create-resource?pivots=web-portal).
- [Python](https://www.python.org/downloads/) 3.7 or later. Currently, version 3.12 doesn't have support for OpenAI libraries.

## Setup instructions

Before you run this sample, you need to set up the resources mentioned in the preceding section with the following configuration updates.

#### Step 1: Set up a Python environment 

Create and activate a Python virtual environment and install the required packages by using the following command:

```
pip install -r requirements.txt
```

#### Step 2: Set up and host your Azure dev tunnel

With [dev tunnels](/azure/developer/dev-tunnels/overview), you can share local web services that are hosted on the internet. Use the following commands to connect your local development environment to the public internet. This process creates a tunnel with a persistent endpoint URL and allows anonymous access. We use this endpoint to notify your application of calling events from Call Automation.

```bash
devtunnel create --allow-anonymous
devtunnel port create -p 8080
devtunnel host
```

<a name='2-add-a-managed-identity-to-the-acs-resource-that-connects-to-the-cognitive-services-resource'></a>

#### Step 3: Add a managed identity to the Azure Communication Services resource that connects to the Azure AI services resource

Follow the instructions in [Connect Azure Communication Services with Azure AI services](/azure/communication-services/concepts/call-automation/azure-communication-services-azure-cognitive-services-integration).

#### Step 4: Add the required API keys and endpoints

Open the `main.py` file to configure the following settings:

- `CALLBACK_URI_HOST`: Your dev tunnel endpoint.
- `COGNITIVE_SERVICE_ENDPOINT`: The Azure AI services endpoint.
- `ACS_CONNECTION_STRING`: Azure Communication Services resource connection string.
- `AZURE_OPENAI_SERVICE_KEY`: Azure OpenAI service key.
- `AZURE_OPENAI_SERVICE_ENDPOINT`: Azure OpenAI service endpoint.
- `AZURE_OPENAI_DEPLOYMENT_MODEL_NAME`: Azure OpenAI model name.
- `AGENT_PHONE_NUMBER`: Agent phone number to transfer call.

## Run the application

1. Go to the `callautomation-openai-sample` folder and run `main.py` in debug mode. You can also use the command `python ./main.py` to run it from PowerShell, a command prompt, or a Unix terminal.
1. The browser opens with a page. If it doesn't, go to `http://localhost:8080/` or your dev tunnel URL.
1. Register an Azure Event Grid webhook for the `IncomingCall` event that points to your `DevTunnel` URI. For more information, see [Incoming call concepts](/azure/communication-services/concepts/call-automation/incoming-call-notification).

Now you have a running application. The best way to test this sample is to place a call to your Azure Communication Services phone number and talk to your intelligent agent.

## Related content

- Learn more about [Call Automation](../../concepts/call-automation/call-automation.md).
- Learn more about [playing custom messages](../../how-tos/call-automation/play-action.md).
- Learn more about [recognizing user input](../../how-tos/call-automation/recognize-action.md).
