---
title: Build a trusted user access service using Azure Functions in Azure Communication Services
titleSuffix: An Azure Communication Services tutorial
description: Learn how to create a trusted user access service for Communication Services with Azure Functions
author: tophpalmer
manager: chpalm
services: azure-communication-services
ms.author: chpalm
ms.date: 06/30/2021
ms.topic: tutorial
ms.service: azure-communication-services
ms.subservice: identity
ms.custom: devx-track-js
---

# Build a trusted user access service using Azure Functions

This article describes how to use Azure Functions to build a trusted user access service.

> [!IMPORTANT]
> The endpoint created at the end of this tutorial isn't secure. Be sure to read about the security details in the [Azure Function Security](../../azure-functions/security-concepts.md) article. You need to add security to the endpoint to ensure bad actors can't provision tokens.

[!INCLUDE [Trusted Service JavaScript](./includes/trusted-service-js.md)]

## Securing Azure Function

As part of setting up an trusted service to provision access tokens for users, we need to take into account the security of that endpoint to make sure no bad actor can randomly create tokens for your service. Azure Functions provide built-in security features that you can use to secure the endpoint using different types of authentication policies. Read more about [Azure Function Security](../../azure-functions/security-concepts.md)

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. You can find out more about [cleaning up Azure Communication Service resources](../quickstarts/create-communication-resource.md#clean-up-resources) and [cleaning Azure Function Resources](../../azure-functions/create-first-function-vs-code-csharp.md#clean-up-resources).

## Next steps

> [!div class="nextstepaction"]
> [Learn about Azure Function Security](../../azure-functions/security-concepts.md)

> [!div class="nextstepaction"]
> [Add voice calling to your app](../quickstarts/voice-video-calling/getting-started-with-calling.md)

You may also want to:

- [Add chat to your app](../quickstarts/chat/get-started.md)
- [Creating user access tokens](../quickstarts/identity/access-tokens.md)
- [Learn about client and server architecture](../concepts/client-and-server-architecture.md)
- [Learn about authentication](../concepts/authentication.md)
