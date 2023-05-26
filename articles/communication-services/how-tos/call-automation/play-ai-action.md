---
title: Customize voice prompts to users with Play action using Text-to-Speech
titleSuffix: An Azure Communication Services how-to document
description: Provides a how-to guide for playing audio to participants as part of a call.
author: kunaal
ms.service: azure-communication-services
ms.subservice: call-automation
ms.topic: include
ms.date: 02/15/2023
ms.author: kpunjabi
ms.custom: private_preview, devx-track-extended-java
services: azure-communication-services
zone_pivot_groups: acs-csharp-java
---

# Customize voice prompts to users with Play action using Text-to-Speech

>[!IMPORTANT]
>Functionality described on this document is currently in private preview. Private preview includes access to SDKs and documentation for testing purposes that are not yet available publicly.
>Apply to become an early adopter by filling out the form for [preview access to Azure Communication Services](https://aka.ms/acs-tap-invite).

This guide will help you get started with playing audio to participants by using the play action provided through Azure Communication Services Call Automation SDK. 

::: zone pivot="programming-language-csharp"
[!INCLUDE [Play audio with .NET](./includes/play-audio-with-ai-csharp.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Play audio with Java](./includes/play-audio-with-ai-java.md)]
::: zone-end

## Event codes
|Status|Code|Subcode|Message|
|----|--|-----|-----|
|PlayCompleted|200|0|Action completed successfully.|
|PlayFailed|400|8535|Action failed, file format is invalid.|
|PlayFailed|400|8536|Action failed, file could not be downloaded.|
|PlayCanceled|400|8508|Action failed, the operation was canceled.|

## Clean up resources
If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../../quickstarts/create-communication-resource.md#clean-up-resources).

## Next steps
- Learn more about [Call Automation](../../concepts/call-automation/call-automation.md)
- Learn more about [Gathering user input in a call](../../concepts/call-automation/recognize-ai-action.md)
- Learn more about [Playing audio in calls](../../concepts/call-automation/play-ai-action.md)
