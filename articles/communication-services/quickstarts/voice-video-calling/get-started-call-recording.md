---
ms.author: dbasantes
title: Azure Communication Services Call Recording refreshed API quickstart 
titleSuffix: An Azure Communication Services document
description: Public Preview quickstart for Call Recording APIs
author: dbasantes
services: azure-communication-services
ms.date: 10/14/2022
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling
zone_pivot_groups: acs-csharp-java
ms.custom: mode-api
---
# Call Recording Quickstart

[!INCLUDE [Public Preview](../../includes/public-preview-include-document.md)]

This quickstart gets you started with Call Recording for voice and video calls. To start using the Call Recording APIs, you must have a call in place. Make sure you're familiar with [Calling client SDK](get-started-with-video-calling.md) and/or [Call Automation](https://learn.microsoft.com/azure/communication-services/quickstarts/voice-video-calling/callflows-for-customer-interactions?pivots=programming-language-csharp#configure-programcs-to-answer-the-call) to build the end-user calling experience. 

::: zone pivot="programming-language-csharp"
[!INCLUDE [Test Call Recording with C#](./includes/call-recording-samples/call-recording-csharp.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Test Call Recording with Java](./includes/call-recording-samples/call-recording-java.md)]
::: zone-end

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../create-communication-resource.md#clean-up-resources).

## Next steps

For more information, see the following articles:

- Learn more about [Call Recording](../../concepts/voice-video-calling/call-recording.md)
- Learn more about [Call Automation](https://learn.microsoft.com/azure/communication-services/concepts/voice-video-calling/call-automation)
- Check out our [calling hero sample](../../samples/calling-hero-sample.md)
- Learn about [Calling SDK capabilities](./getting-started-with-calling.md)
- Learn more about [how calling works](../../concepts/voice-video-calling/about-call-types.md)
