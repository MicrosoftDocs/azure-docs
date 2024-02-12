---
title: Customize voice prompts to users with Play action
titleSuffix: An Azure Communication Services how-to document
description: Provides a quick start for playing audio to participants as part of a call.
author: kunaal
ms.service: azure-communication-services
ms.topic: how-to
ms.date: 09/06/2022
ms.author: kpunjabi
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
services: azure-communication-services
zone_pivot_groups: acs-js-csharp-java-python
---

# Customize voice prompts to users with Play action

This guide will help you get started with playing audio files to participants by using the play action provided through Azure Communication Services Call Automation SDK.

::: zone pivot="programming-language-csharp"
[!INCLUDE [Play audio with .NET](./includes/play-audio-quickstart-csharp.md)]
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
|Status|Code|Subcode|Message|
|----|--|-----|-----|
|PlayCompleted|200|0|Action completed successfully.|
|PlayCanceled|400|8508|Action failed, the operation was canceled.|
|PlayFailed|400|8535|Action failed, file format is invalid.|
|PlayFailed|400|8536|Action failed, file could not be downloaded.|
|PlayFailed|400|8565 | Action failed, bad request to Azure AI services. Check input parameters. | 
|PlayFailed | 401 | 8565 | Action failed, Azure AI services authentication error. | 
|PlayFailed | 403 | 8565 | Action failed, forbidden request to Azure AI services, free subscription used by the request ran out of quota. | 
|PlayFailed | 429 | 8565 | Action failed, requests exceeded the number of allowed concurrent requests for the Azure AI services subscription. | 
|PlayFailed | 408 | 8565 | Action failed, request to Azure AI services timed out. | 
|PlayFailed | 500 | 9999 | Unknown internal server error | 
|PlayFailed | 500 | 8572 | Action failed due to play service shutdown. |


## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../../quickstarts/create-communication-resource.md#clean-up-resources).

## Next steps

- Learn more about [Call Automation](../../concepts/call-automation/call-automation.md)
- Learn more about [Gathering user input in a call](../../concepts/call-automation/recognize-action.md)
