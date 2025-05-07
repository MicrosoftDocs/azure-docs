---
title: Gather user input
titleSuffix: An Azure Communication Services how-to document
description: Provides a how-to guide for gathering user input from participants on a call.
author: kunaal
ms.service: azure-communication-services
ms.topic: how-to
ms.date: 09/16/2022
ms.author: kpunjabi
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
services: azure-communication-services
zone_pivot_groups: acs-js-csharp-java-python
---

# Gather user input with Recognize action

This guide helps you get started recognizing DTMF input provided by participants through Azure Communication Services Call Automation SDK. 

::: zone pivot="programming-language-csharp"
[!INCLUDE [Recognize action with .NET](./includes/recognize-action-quickstart-csharp.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Recognize action with Java](./includes/recognize-action-quickstart-java.md)]
::: zone-end

::: zone pivot="programming-language-javascript"
[!INCLUDE [Recognize action with Java](./includes/recognize-how-to-js.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [Recognize action with Java](./includes/recognize-how-to-python.md)]
::: zone-end

## Event codes

| Status | Code | Subcode | Message |
| ---- | ---| ----- | ----- |
| `RecognizeCompleted` | 200 | 8531 | Action completed, max digits received. |
| `RecognizeCompleted` | 200 | 8514 | Action completed as stop tone was detected. |
| `RecognizeCompleted` | 400 | 8508 | Action failed, the operation was canceled. |
| `RecognizeCompleted` | 400 | 8532 | Action failed, inter-digit silence timeout reached. |
| `RecognizeCanceled` | 400 | 8508 | Action failed, the operation was canceled. |
| `RecognizeFailed` | 400 | 8510 | Action failed, initial silence timeout reached. |
| `RecognizeFailed` | 500 | 8511 | Action failed, encountered failure while trying to play the prompt. |
| `RecognizeFailed` | 500 | 8512 | Unknown internal server error. |
| `RecognizeFailed` | 400 | 8510 | Action failed, initial silence timeout reached | 
| `RecognizeFailed` | 400 | 8532 | Action failed, inter-digit silence timeout reached. | 
| `RecognizeFailed` | 400 | 8565 | Action failed, bad request to Azure AI services. Check input parameters. | 
| `RecognizeFailed` | 400 | 8565 | Action failed, bad request to Azure AI services. Unable to process payload provided, check the play source input. | 
| `RecognizeFailed` | 401 | 8565 | Action failed, Azure AI services authentication error. |
| `RecognizeFailed` | 403 | 8565 | Action failed, forbidden request to Azure AI services, free subscription used by the request ran out of quota. | 
| `RecognizeFailed` | 429 | 8565 | Action failed, requests exceeded the number of allowed concurrent requests for the Azure AI services subscription. | 
| `RecognizeFailed` | 408 | 8565 | Action failed, request to Azure AI services timed out. | 
| `RecognizeFailed` | 500	| 8511	| Action failed, encountered failure while trying to play the prompt. | 
| `RecognizeFailed` | 500	| 8512	| Unknown internal server error. | 

## Known limitations
- In-band DTMF isn't supported. Use RFC 2833 DTMF instead.
- Text-to-Speech text prompts support a maximum of 400 characters, if your prompt is longer than this we suggest using SSML for Text-to-Speech based play actions.
- For scenarios where you exceed your Speech service quota limit, you can request to increase this limit by following the steps outlined in [Speech services quotas and limits](/azure/ai-services/speech-service/speech-services-quotas-and-limits).

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../../quickstarts/create-communication-resource.md#clean-up-resources).

## Next Steps

- Learn more about [Gathering user input](../../concepts/call-automation/recognize-action.md)
- Learn more about [Playing audio in call](../../concepts/call-automation/play-action.md)
- Learn more about [Call Automation](../../concepts/call-automation/call-automation.md)
