---
title: Quickstart - Configure voice routing using SDK
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you learn how to configure Azure Communication Services direct routing programmatically.
author: nikuklic
ms.author: nikuklic
ms.date: 03/11/2023
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: pstn
zone_pivot_groups: acs-azp-java-python-csharp-js
ms.custom: mode-other, devx-track-extended-java, devx-track-js, devx-track-python
---

# Quickstart: Configure voice routing programmatically

Configure outbound voice routing rules for Azure Communication Services direct routing.

::: zone pivot="platform-azp"
[!INCLUDE [Azure portal](./includes/voice-routing-sdk-portal.md)]
::: zone-end

::: zone pivot="programming-language-csharp"
[!INCLUDE [C#](./includes/voice-routing-sdk-csharp.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Java](./includes/voice-routing-sdk-java.md)]
::: zone-end

::: zone pivot="programming-language-javascript"
[!INCLUDE [JavaScript](./includes/voice-routing-sdk-jscript.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [Python](./includes/voice-routing-sdk-python.md)]
::: zone-end

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. [Learn more about cleaning up resources](../create-communication-resource.md#clean-up-resources).

## Next steps

For more information, see the following articles:

- Learn about [call automation](../../concepts/call-automation/call-automation.md) to build workflows that [route and manage calls](../../how-tos/call-automation/actions-for-call-control.md) to Communication Services.  
- Learn about [Calling SDK capabilities](../voice-video-calling/getting-started-with-calling.md).
- Learn more about [how calling works](../../concepts/voice-video-calling/about-call-types.md).
- Call to a telephone number by [following a quickstart](./pstn-call.md).
