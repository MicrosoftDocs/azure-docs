---
title: Learn how to sign an HTTP request with HMAC
titleSuffix: An Azure Communication Services tutorial
description: Learn how to sign an HTTP request for Azure Communication Services using HMAC.
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

# Sign an HTTP request

In this tutorial, you'll learn how to sign an HTTP request with an HMAC signature.

>[!NOTE]
>We strongly encourage to use [Azure SDKs](https://github.com/Azure/azure-sdk). Approach described here is a fallback option for cases when Azure SDKs can't be used for any reason.

::: zone pivot="programming-language-csharp"
[!INCLUDE [Sign an HTTP request with C#](./includes/hmac-header-csharp.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [Sign an HTTP request with Python](./includes/hmac-header-python.md)]
::: zone-end

## Clean up resources

To clean up and remove a Communication Services subscription, delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. You can find out more about [cleaning up Azure Communication Services resources](../quickstarts/create-communication-resource.md#clean-up-resources) and [cleaning Azure Functions resources](../../azure-functions/create-first-function-vs-code-csharp.md#clean-up-resources).

## Next steps

> [!div class="nextstepaction"]
> [Add voice calling to your app](../quickstarts/voice-video-calling/getting-started-with-calling.md)

You might also want to:

- [Add chat to your app](../quickstarts/chat/get-started.md)
- [Create user access tokens](../quickstarts/identity/access-tokens.md)
- [Learn about client and server architecture](../concepts/client-and-server-architecture.md)
- [Learn about authentication](../concepts/authentication.md)
