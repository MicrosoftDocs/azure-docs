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

This guide will help you get started with recognizing DTMF input provided by participants through Azure Communication Services Call Automation SDK. 

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

|Status|Code|Subcode|Message|
|----|--|-----|-----|
|RecognizeCompleted|200|8531|Action completed, max digits received.|
|RecognizeCompleted|200|8514|Action completed as stop tone was detected.|
|RecognizeCompleted|400|8508|Action failed, the operation was canceled.|
|RecognizeCompleted|400|8532|Action failed, inter-digit silence timeout reached.|
|RecognizeFailed|400|8510|Action failed, initial silence timeout reached.|
|RecognizeFailed|500|8511|Action failed, encountered failure while trying to play the prompt.|
|RecognizeFailed|500|8512|Unknown internal server error.|
|RecognizeCanceled|400|8508|Action failed, the operation was canceled.|



## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../../quickstarts/create-communication-resource.md#clean-up-resources).

## Next Steps

- Learn more about [Gathering user input](../../concepts/call-automation/recognize-action.md)
- Learn more about [Playing audio in call](../../concepts/call-automation/play-action.md)
- Learn more about [Call Automation](../../concepts/call-automation/call-automation.md)
