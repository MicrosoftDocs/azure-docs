---
title: Azure Communication Services Call Recording API quickstart
titleSuffix: An Azure Communication Services quickstart document
description: Provides a quickstart sample for the Call Recording APIs.
author: ravithanneeru
manager: jken
services: azure-communication-services

ms.author: jken
ms.date: 06/30/2021
ms.topic: overview
ms.service: azure-communication-services
zone_pivot_groups: acs-csharp-java
---
# Call Recording API Quickstart

[!INCLUDE [Public Preview](../../includes/public-preview-include-document.md)]

This quickstart gets you started recording voice and video calls. This quickstart assumes you've already used the [Calling client SDK](get-started-with-video-calling.md) to build the end-user calling experience. Using the **Calling Server APIs and SDKs** you can enable and manage recordings. 

::: zone pivot="programming-language-csharp"
[!INCLUDE [Build Call Recording server sample with C#](./includes/call-recording-samples/recording-server-csharp.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Build Call Recording server sample with Java](./includes/call-recording-samples/recording-server-java.md)]
::: zone-end

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../create-communication-resource.md#clean-up-resources).

## Next steps

For more information, see the following articles:

- Check out our [calling hero sample](../../samples/calling-hero-sample.md)
- Learn about [Calling SDK capabilities](./calling-client-samples.md)
- Learn more about [how calling works](../../concepts/voice-video-calling/about-call-types.md)
