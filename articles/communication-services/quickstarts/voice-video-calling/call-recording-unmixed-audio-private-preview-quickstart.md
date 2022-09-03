---
title: Azure Communication Services Unmixed Audio Recording API quickstart 
titleSuffix: An Azure Communication Services quickstart document
description: Private Preview quickstart for Unmixed Audio Call Recording APIs.
author: dbasantes
services: azure-communication-services
ms.author: bharat
ms.date: 09/07/2022
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling
zone_pivot_groups: acs-csharp-java
ms.custom: mode-api
---
# Unmixed Audio Call Recording Quickstart

[!INCLUDE [Private Preview](../../includes/private-preview-include-section.md)]

This quickstart gets you started recording voice and video calls. This quickstart assumes you've already used the [Calling client SDK](get-started-with-video-calling.md) to build the end-user calling experience. Using the **Calling Server APIs and SDKs** you can enable and manage recordings. 

::: zone pivot="programming-language-csharp"
[!INCLUDE [Test Unmixed Audio Recording with C#](./includes/call-recording-samples/private-preview-unmixed-audio-recording-server-csharp.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Test Unmixed Audio Recording with Java](./includes/call-recording-samples/private-preview-unmixed-audio-recording-server-java.md)]
::: zone-end

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../create-communication-resource.md#clean-up-resources).

## Next steps

For more information, see the following articles:

- Learn more about [Call Recording](../../concepts/voice-video-calling/call-recording.md)
- Check out our [calling hero sample](../../samples/calling-hero-sample.md)
- Learn about [Calling SDK capabilities](./getting-started-with-calling.md)
- Learn more about [how calling works](../../concepts/voice-video-calling/about-call-types.md)
