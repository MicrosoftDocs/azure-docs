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
Find the project for this sample on [GitHub](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/CallAutomation_AzOpenAI_Voice). You can download this code and run it locally to try it for yourself. 

## Overview 

This server-side application helps create a virtual assistant that can handle phone calls and respond to customers using Azure OpenAI services, providing quick and real-time answers.

## Prerequisites

- Create an Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/)
- Create an Azure Communication Services resource. For details, see [Create an Azure Communication Resource](../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp). You need to record your resource **connection string** for this sample.
- A Calling-enabled telephone number. [Get a phone number](../../quickstarts/telephony/get-phone-number.md).
- Azure Dev Tunnels CLI. For details, see  [Enable dev tunnel](https://docs.tunnels.api.visualstudio.com/cli)
- An Azure OpenAI Resource and Deployed Model. See [instructions](/azure/ai-services/openai/how-to/create-resource?pivots=web-portal).

## Set up instructions

Before running this sample, you need to set up the resources with the following configuration updates:

##### 1. Set up and host your Azure DevTunnel

[Azure DevTunnels](/azure/developer/dev-tunnels/overview) is an Azure service that enables you to share local web services hosted on the internet. Use the commands to connect your local development environment to the public internet. This creates a tunnel with a persistent endpoint URL and which allows anonymous access. We use this endpoint to notify your application of calling events from the ACS Call Automation service.

```bash
devtunnel create --allow-anonymous
devtunnel port create -p 5165
devtunnel host
```

##### 2. Add the required API Keys and endpoints
Open the appsettings.json file to configure the following settings:
```code
    - DevTunnelUri: your dev tunnel endpoint
    - AcsConnectionString: Azure Communication Service resource's connection string.
    - AzureOpenAIServiceKey: Open AI's Service Key
    - AzureOpenAIServiceEndpoint: Open AI's Service Endpoint
    - AzureOpenAIDeploymentModelName: Open AI's Model name
```
## Running the application

1. Azure DevTunnel: Ensure your AzureDevTunnel URI is active and points to the correct port of your localhost application
2. Run `dotnet run` to build and run the sample application
3. Register an Event Grid Webhook for the IncomingCall Event that points to your DevTunnel URI. Instructions [here](/azure/communication-services/concepts/call-automation/incoming-call-notification). For example:

``` code
 https://<devtunelurl>/api/incomingCall
```

Once that's completed, you should have a running application. The best way to test this is to place a call to your ACS phone number and talk to your intelligent agent.

## Next steps
- Learn more about [Call Automation](../../concepts/call-automation/call-automation.md).
- Learn more about [Bidirectional streaming](../../concepts/call-automation/audio-streaming-concept.md)
