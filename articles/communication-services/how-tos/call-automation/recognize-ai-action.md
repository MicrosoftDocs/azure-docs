---
title: Gather user voice input
titleSuffix: An Azure Communication Services how-to document
description: Provides a how-to guide for gathering user voice input from participants on a call.
author: kunaal
ms.service: azure-communication-services
ms.topic: include
ms.date: 02/15/2023
ms.author: kpunjabi
ms.custom: private_preview, devx-track-extended-java
services: azure-communication-services
zone_pivot_groups: acs-csharp-java
---

# Gather user input with Recognize action and voice input

This guide helps you get started recognizing user input in the forms of DTMF or voice input provided by participants through Azure Communication Services Call Automation SDK.

::: zone pivot="programming-language-csharp"
[!INCLUDE [Recognize action using AI with .NET](./includes/recognize-ai-action-how-to-csharp.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Recognize action using AI with Java](./includes/recognize-ai-action-how-to-java.md)]
::: zone-end

## Event codes
|Status|Code|Subcode|Message|
|----|--|-----|-----|
|RecognizeCompleted|200|8531|Action completed, max digits received.|
|RecognizeCompleted|200|8533|Action completed, DTMF option matched.|
|RecognizeCompleted|200|8545|Action completed, speech option matched.|
|RecognizeCompleted|200|8514|Action completed as stop tone was detected.|
|RecognizeCompleted|200|8569|Action completed, speech was recognized.|
|RecognizeCompleted|400|8532|Action failed, inter-digit silence time out reached.|
|RecognizeFailed|400|8563|Action failed, speech could not be recognized.|
|RecognizeFailed|408|8570|Action failed, speech recognition timed out.|
|RecognizeFailed|400|8510|Action failed, initial silence time out reached.|
|RecognizeFailed|500|8511|Action failed, encountered failure while trying to play the prompt.|
|RecognizeFailed|400|8547|Action failed, recognized phrase does not match a valid option.|
|RecognizeFailed|500|8534|Action failed, incorrect tone entered.|
|RecognizeFailed|500|9999|Unspecified error.|
|RecognizeCanceled|400|8508|Action failed, the operation was canceled.|

## Limitations

- You must either pass a tone for every single choice if you want to enable callers to use tones or voice inputs, otherwise no tone should be sent if you're expecting only voice input from callers. 

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../../quickstarts/create-communication-resource.md#clean-up-resources).

## Next Steps
- Learn more about [Gathering user input](../../concepts/call-automation/recognize-ai-action.md)
- Learn more about [Playing audio in call](../../concepts/call-automation/play-ai-action.md)
- Learn more about [Call Automation](../../concepts/call-automation/call-automation.md)
