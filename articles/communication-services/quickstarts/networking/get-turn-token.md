---
title: Quickstart - Get a network relay token
description: Learn how to retrieve a STUN/TURN token using Azure Communication Services.
author: mikben
manager: jken
services: azure-communication-services

ms.author: mikben
ms.date: 03/10/2020
ms.topic: overview
ms.service: azure-communication-services
ms.custom: tracking-python, devx-track-javascript
zone_pivot_groups: acs-js-csharp
---
# Quickstart: Get a network relay token

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]

> [!WARNING]
> This document is under construction and needs the following items to be addressed: 
> - Contextualization (Shawn)

Get started with Azure Communication Services by retrieving STUN and TURN tokens using Azure Communication Services. More information about STUN and TURN can be found in the [STUN and TURN conceptual documentation](../../concepts/networking/ice-stun-nat-turn-sdp.md)

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

::: zone pivot="programming-language-csharp"
[!INCLUDE [Get a network relay token with .NET](./includes/get-token-net.md)]
::: zone-end

::: zone pivot="programming-language-javascript"
[!INCLUDE [Get a network relay token with JavaScript](./includes/get-token-js.md)]
::: zone-end

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. You can find out more about cleaning up resources [here](../create-a-communication-resource.md#clean-up-resources).

## Next Steps

In this quickstart, you learned how to convert a user access token to a TURN relay token.

> [!div class="nextstepaction"] 
> [Learn more about STUN/TURN](../../concepts/networking/ice-stun-nat-turn-sdp.md)
