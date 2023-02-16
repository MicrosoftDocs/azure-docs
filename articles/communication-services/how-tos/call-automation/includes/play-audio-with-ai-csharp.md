---
title: include file
description: CSharp play ai action how-to
services: azure-communication-services
author: Kunaal
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 03/16/2023
ms.topic: include
ms.topic: include file
ms.author: kpunjabi
---

## Prerequisites

- Azure account with an active subscription, for details see [Create an account for free.](https://azure.microsoft.com/free/)
- Azure Communication Services resource. See [Create an Azure Communication Services resource](../../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp). Save the connection string for this resource. 
- Create a new web service application using the [Call Automation SDK](../../../quickstarts/call-automation/callflows-for-customer-interactions.md).
- The latest [.NET library](https://dotnet.microsoft.com/download/dotnet-core) for your operating system.
- Obtain the [NuGet](https://www.nuget.org/packages/Azure.Communication.CallAutomation/1.0.0-beta.1) package.
- Create and connect Azure Cognitive Services to your Azure Communication Services resource.
- Create a [custom subdomain](../../../../cognitive-services/cognitive-services-custom-subdomains.md) for your Azure Cognitive Services resource. 

## Create a new C# application

In the console window of your operating system, use the `dotnet` command to create a new web application.

```console
dotnet new web -n MyApplication
```

## Install the NuGet package

During the preview phase, the NuGet package can be obtained by configuring your package manager to use the Azure SDK Dev Feed from [here](https://github.com/Azure/azure-sdk-for-net/blob/main/CONTRIBUTING.md#nuget-package-dev-feed).

## (Optional) Prepare your audio file if you wish to use audio files for playing prompts

Create an audio file, if you don't already have one, to use for playing prompts and messages to participants. The audio file must be hosted in a location that is accessible to ACS with support for authentication. Keep a copy of the URL available for you to use when requesting to play the audio file. The audio file that ACS supports needs to be **WAV, mono and 16 KHz sample rate**. 

You can test creating your own audio file using our [Speech synthesis with Audio Content Creation tool](../../../../cognitive-services/Speech-Service/how-to-audio-content-creation.md).

## (Optional) Connect your Azure Cognitive Service to your Azure Communication Service
If you would like to use Text-To-Speech Capabilities then it is required for you to connect your Azure Cognitive Service to your Azure Communication Service.
``` code
az communication bind-cognitive-service --name “{Azure Communication resource name}” --resource-group “{Azure Communication resource group}” --resource-id “{Cognitive service resource id}” --subscription{subscription Name of Cognitive service} –identity{Cognitive Services Identity}

```
## Establish a call

By this point you should be familiar with starting calls, if you need to learn more about making a call, follow our [quickstart](../../../quickstarts/call-automation/callflows-for-customer-interactions.md). In this quickstart, we'll answer an incoming call.

``` csharp
// add cognitiveServices step in answer call. 
```

## Play Audio
Once the call has been established, there are multiple options for how you may wish to play the audio. You can play audio to the participant that has just joined the call or play audio to all the participants in the call.




