---
title: Sign an HTTP Request using hash-based message authentication code (HMAC)
titleSuffix: An Azure Communication Services article
description: This article describes how to sign an HTTP request for Azure Communication Services by using HMAC.
author: alexandra142
manager: soricos
services: azure-communication-services

ms.author: apistrak
ms.date: 06/30/2021
ms.topic: tutorial
ms.service: azure-communication-services
ms.subservice: identity
ms.custom: devx-track-python
zone_pivot_groups: acs-programming-languages-csharp-python
---

# Sign an HTTP request using hash-based message authentication code (HMAC)

This article describes how to sign an HTTP request with a hash-based message authentication code (HMAC) signature.

> [!NOTE]
> We recommend using the [Azure SDKs](https://github.com/Azure/azure-sdk) to sign an HTTP request. The approach described in this article is a fallback option if Azure SDKs can't be used for any reason.

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Create a request message.
> * Create a content hash.
> * Compute a signature.
> * Create an authorization header string.
> * Add headers.

::: zone pivot="programming-language-csharp"
[!INCLUDE [Sign an HTTP request with C#](./includes/hmac-header-csharp.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [Sign an HTTP request with Python](./includes/hmac-header-python.md)]
::: zone-end

## Clean up resources

To clean up and remove a Communication Services subscription, delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. You can find out more about how to [clean up Azure Communication Services resources](../quickstarts/create-communication-resource.md#clean-up-resources) and [clean up Azure Functions resources](../../azure-functions/create-first-function-vs-code-csharp.md#clean-up-resources).

## Related content

- [Add voice calling to your app](../quickstarts/voice-video-calling/getting-started-with-calling.md)
- [Add chat to your app](../quickstarts/chat/get-started.md)
- [Create user access tokens](../quickstarts/identity/access-tokens.md)
- [Learn about client and server architecture](../concepts/identity-model.md#client-server-architecture)
- [Learn about authentication](../concepts/authentication.md)
