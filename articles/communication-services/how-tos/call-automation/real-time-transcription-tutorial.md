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

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]

This guide helps you better understand the different ways you can use Azure Communication Services offering of real-time transcription through Call Automation SDKs.

### Prerequisites
- Azure account with an active subscription, for details see [Create an account for free.](https://azure.microsoft.com/free/)
- Azure Communication Services resource, see [Create an Azure Communication Services resource](../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp)
- Create and connect [Azure AI services to your Azure Communication Services resource](../../concepts/call-automation/azure-communication-services-azure-cognitive-services-integration.md).
- Create a [custom subdomain](../../../ai-services/cognitive-services-custom-subdomains.md) for your Azure AI services resource.
- Create a new web service application using the [Call Automation SDK](../../quickstarts/call-automation/quickstart-make-an-outbound-call.md).

## Setup a WebSocket Server 
Azure Communication Services requires your server application to set up a WebSocket server to stream transcription in real-time. WebSocket is a standardized protocol that provides a full-duplex communication channel over a single TCP connection. You can optionally use Azure services Azure WebApps that allows you to create an application to receive transcripts over a websocket connection. Follow this [quickstart](https://azure.microsoft.com/blog/introduction-to-websockets-on-windows-azure-web-sites/).

## Establish a call 
In this quickstart, we assume that you're already familiar with starting calls. If you need to learn more about starting and establishing calls, you can follow our [quickstart](../../quickstarts/call-automation/quickstart-make-an-outbound-call.md). For the purposes of this quickstart, we're going through the process of starting transcription for both incoming calls and outbound calls. 

When working with real-time transcription, you have a couple of options on when and how to start transcription:

**Option 1 -** Starting at time of answering or creating a call

**Option 2 -** Starting transcription during an ongoing call 

In this tutorial, we're demonstrating option 2, starting transcription during an ongoing call. By default the 'startTranscription' is set to false at time of answering or creating a call.

::: zone pivot="programming-language-csharp"
[!INCLUDE [Real-time transcription with .NET](./includes/real-time-transcription-csharp.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Real-time transcription with Java](./includes/real-time-transcription-java.md)]
::: zone-end

::: zone pivot="programming-language-javascript"
[!INCLUDE [Real-time transcription with JavaScript](./includes/real-time-transcription-js.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [Real-time transcription with Python](./includes/real-time-transcription-python.md)]
::: zone-end

## Event codes

| Event | code | subcode | Message |
| --- | --- | --- | --- |
| TranscriptionStarted | 200 | 0 | Action completed successfully. |
| TranscriptionStopped | 200 | 0 | Action completed successfully. |
| TranscriptionUpdated | 200 | 0 | Action completed successfully. |
| TranscriptionFailed | 400 | 8581 | Action failed, StreamUrl isn't valid. |
| TrasncriptionFailed | 400 | 8565 | Action failed due to a bad request to Cognitive Services. Check your input parameters. |
| TranscriptionFailed | 400 | 8565 | Action failed due to a request to Cognitive Services timing out. Try again later or check for any issues with the service. |
| TranscriptionFailed | 400 | 8605 | Custom speech recognition model for Transcription is not supported. |
| TranscriptionFailed | 400 | 8523 | Invalid Request, locale is missing. |
| TranscriptionFailed | 400 | 8523 | Invalid Request, only locale that contain region information are supported. |
| TranscriptionFailed | 405 | 8520 | Transcription functionality is not supported at this time. |
| TranscriptionFailed | 405 | 8520 | UpdateTranscription is not supported for connection created with Connect interface. |
| TranscriptionFailed | 400 | 8528 | Action is invalid, call already terminated. |
| TranscriptionFailed | 405 | 8520 | Update transcription functionality is not supported at this time. |
| TranscriptionFailed | 405 | 8522 | Request not allowed when Transcription url not set during call setup. |
| TranscriptionFailed | 405 | 8522 | Request not allowed when Cognitive Service Configuration not set during call setup. |
| TranscriptionFailed | 400 | 8501 | Action is invalid when call is not in Established state. |
| TranscriptionFailed | 401 | 8565 | Action failed due to a Cognitive Services authentication error. Check your authorization input and ensure it's correct. |
| TranscriptionFailed | 403 | 8565 | Action failed due to a forbidden request to Cognitive Services. Check your subscription status and ensure it's active. |
| TranscriptionFailed | 429 | 8565 | Action failed, requests exceeded the number of allowed concurrent requests for the cognitive services subscription. |
| TranscriptionFailed | 500 | 8578 | Action failed, not able to establish WebSocket connection. |
| TranscriptionFailed | 500 | 8580 | Action failed, transcription service was shut down. |
| TranscriptionFailed | 500 | 8579 | Action failed, transcription was canceled. |
| TranscriptionFailed | 500 | 9999 | Unknown internal server error. |


## Known issues
* For 1:1 calls with ACS users using Client SDKs startTranscription = True isn't currently supported. 
