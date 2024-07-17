---
title: Add real-time transcription into your applications
titleSuffix: An Azure Communication Services how-to document
description: Provides a how-to guide for adding real-time transcription
author: kunaal
ms.service: azure-communication-services
ms.subservice: call-automation
ms.topic: include
ms.date: 07/16/2024
ms.author: kpunjabi
services: azure-communication-services
zone_pivot_groups: acs-js-csharp-java-python
---

# Add real-time transcription into your application

[!INCLUDE [Public Preview Disclaimer](../includes/public-preview-include-document.md)]

This guide will help you better understand the different ways you can use Azure Communication Services offering of real-time transcription through Call Automation SDKs.

### Prerequisites
- Azure account with an active subscription, for details see [Create an account for free.](https://azure.microsoft.com/free/)
- Azure Communication Services resource, see [Create an Azure Communication Services resource](https://learn.microsoft.com/azure/communication-services/quickstarts/create-communication-resource?tabs=windows&pivots=platform-azp)
- Create and connect [Azure AI services to your Azure Communication Services resource](https://learn.microsoft.com/azure/communication-services/concepts/call-automation/azure-communication-services-azure-cognitive-services-integration).
- Create a [custom subdomain](https://learn.microsoft.com/azure/ai-services/cognitive-services-custom-subdomains) for your Azure AI services resource.
- Create a new web service application using the [Call Automation SDK](https://learn.microsoft.com/azure/communication-services/quickstarts/call-automation/quickstart-make-an-outbound-call?tabs=visual-studio-code&pivots=programming-language-csharp).

## Setup a WebSocket Server 
Azure Communication Services requires your server application to set up a WebSocket server to stream transcription in real-time. WebSocket is a standardized protocol that provides a full-duplex communication channel over a single TCP connection. You can optionally use Azure services Azure WebApps that allows you to create an application to receive transcripts over a websocket connection. Follow this [quickstart](https://azure.microsoft.com/en-us/blog/introduction-to-websockets-on-windows-azure-web-sites/).

## Establish a call 
In this quickstart we assume that you're already familiar with starting calls. If you need to learn more about starting and establishing calls, you can follow our [quickstart](https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/call-automation/quickstart-make-an-outbound-call?tabs=visual-studio-code&pivots=programming-language-csharp). For the purposes of this quickstart, we'll be going through the process of starting transcription for both incoming calls and outbound calls. 

When working with real-time transcription, you have a couple of options on when and how to start transcription:
**Option 1 -** Starting at time of answering or creating a call
**Option 2 -** Starting transcription during an ongoing call 

In this tutorial we will be demonstrating option 2, starting transcription during an ongoing call. By default the 'startTranscription' is set to false at time of answering or creating a call.

::: zone pivot="programming-language-csharp"
[!INCLUDE [Play audio with .NET](./includes/real-time-transcription-csharp.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Play audio with Java](./includes/play-audio-quickstart-java.md)]
::: zone-end

::: zone pivot="programming-language-javascript"
[!INCLUDE [Play audio with Java](./includes/play-audio-how-to-js.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [Play audio with Java](./includes/play-audio-how-to-python.md)]
::: zone-end

## Event codes

| Event | code | subcode | Message |
| --- | --- | --- | --- |
| TranscriptionStarted | 200 | 0 | Action completed successfully. |
| TranscriptionStopped | 200 | 0 | Action completed successfully. |
| TranscriptionUpdated | 200 | 0 | Action completed successfully. |
| TranscriptionFailed | 500 | 8578 | Action failed, not able to establish WebsSocket connection. |
| TranscriptionFailed | 400 | 8581 | Action failed, StreamUrl is not valid. |
| TranscriptionFailed | 500 | 8580 | Action failed, transcription service was shutdown. |
| TranscriptionFailed | 500 | 8579 | Action failed, transcription was canceled. |
| TranscriptionFailed | 500 | 8579 | Action failed, transcription was canceled. |
| TranscriptionFailed | 401 | 8565 | Action failed due to a Cognitive Services authentication error. Please check your authorization input and ensure it is correct. |
| TranscriptionFailed | 403 | 8565 | Action failed due to a forbidden request to Cognitive Services. Please check your subscription status and ensure it is active. |
| TrasncriptionFailed | 400 | 8565 | Action failed due to a bad request to Cognitive Services. Please check your input parameters. |
| TranscriptionFailed | 429 | 8565 | Action failed, requests exceeded the number of allowed concurrent requests for the cognitive services subscription. |
| TranscriptionFailed | 400 | 8565 | Action failed due to a request to Cognitive Services timing out. Please try again later or check for any issues with the service. |
| TranscriptionFailed | 500 | 9999 | Unknown internal server error. |


## Known issues
* You may receive duplicate TranscriptionStarted events everytime there is a speech input after a long pause of silence or when a new person speaks.
* For 1:1 calls with ACS users using Client SDKs startTranscription = True is not currently supported. 
