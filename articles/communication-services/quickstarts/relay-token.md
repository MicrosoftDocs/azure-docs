---
title: Quickstart - Access TURN relays
description: Learn how to retrieve a STUN/TURN token using Azure Communication Services
author: shahen
manager: anvalent
services: azure-communication-services
ms.author: shahen
ms.date: 09/28/2021
ms.topic: quickstart
ms.service: azure-communication-services
zone_pivot_groups: acs-js-csharp-java-python
ms.custom: mode-other, devx-track-extended-java, devx-track-js, devx-track-python
---
# Quickstart: Access TURN relays

This quickstart shows how to retrieve a network relay token to access Azure Communication Services TURN servers.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free)
- An active Azure Communication Services resource, see [create a Communication Services resource](./create-communication-resource.md) if you do not have one.

::: zone pivot="programming-language-csharp"
[!INCLUDE [Get a network relay token with .NET](./includes/relay-token-net.md)]
::: zone-end

::: zone pivot="programming-language-javascript"
[!INCLUDE [Get a network relay token with JavaScript](./includes/relay-token-js.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [Get a network relay token with Python](./includes/relay-token-python.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Get a network relay token with Java](./includes/relay-token-java.md)]
::: zone-end

## Clean up resources

If you want to clean up and remove a Communication Services resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](./create-communication-resource.md#clean-up-resources).
