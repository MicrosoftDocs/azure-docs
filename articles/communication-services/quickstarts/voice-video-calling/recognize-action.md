---
title: Recognize Action
titleSuffix: An Azure Communication Services quickstart document
description: Provides a quick start for recognizing user input from participants on a call.
author: kunaal
ms.service: azure-communication-services
ms.topic: include
ms.date: 09/16/2022
ms.author: kpunjabi
ms.custom: private_preview
services: azure-communication-services
zone_pivot_groups: acs-csharp-java
---

# Quickstart: Recognize action

> [!IMPORTANT]
> Functionality described on this document is currently in private preview. Private preview includes access to SDKs and documentation for testing purposes that are not yet available publicly.
> Apply to become an early adopter by filling out the form for [preview access to Azure Communication Services](https://aka.ms/ACS-EarlyAdopter).

This quickstart will help you get started with recognizing DTMF input provided by participants through Azure Communication Services Call Automation SDK. 

::: zone pivot="programming-language-csharp"
[!INCLUDE [Recognize action with .NET](./includes/call-automation-media/recognize-action-quickstart-csharp.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Recognize action with Java](./includes/call-automation-media/recognize-action-quickstart-java.md)]
::: zone-end

## Event codes

|Status|Code|Subcode|Message|
|----|--|-----|-----|
|RecognizeCompleted|200|8531|Action completed, max digits received.|
|RecognizeCompleted|200|8514|Action completed as stop tone was detected.|
|RecognizeCompleted|400|8508|Action failed, the operation was canceled.|
|RecognizeFailed|400|8510|Action failed, initial silence timeout reached|
|RecognizeFailed|400|8532|Action failed, inter-digit silence timeout reached.|
|RecognizeFailed|500|8511|Action failed, encountered failure while trying to play the prompt.|
|RecognizeFailed|500|8512|Unknown internal server error.|


## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../create-communication-resource.md#clean-up-resources).

## Next Steps

- Learn more about [Recognize action](../../concepts/voice-video-calling/recognize-action.md)
- Learn more about [Play action](../../concepts/voice-video-calling/play-action.md)
- Learn more about [Call Automation](../../concepts/voice-video-calling/call-automation.md)
