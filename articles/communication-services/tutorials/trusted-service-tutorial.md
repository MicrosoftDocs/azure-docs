---
title: Build an authentication service using Azure Functions
titleSuffix: An Azure Communication Services article
description: This article describes how to create a trusted user access service for Azure Communication Services using Azure Functions.
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

# Build an authentication service using Azure Functions

This article describes how to use Azure Functions to build a trusted user access service.

> [!IMPORTANT]
> The endpoint created in this tutorial isn't secure. Be sure to read about the security details in the [Azure Functions security](../../azure-functions/security-concepts.md) article. You need to add security to the endpoint to ensure that bad actors can't provision tokens.

This article describes how to:
> [!div class="checklist"]
> * Set up a function.
> * Generate access tokens.
> * Test the function.
> * Deploy and run the function.

[!INCLUDE [Trusted Service JavaScript](./includes/trusted-service-js.md)]

## Secure the endpoint

As part of setting up a trusted service to provide access tokens for users, you need to take into account the security of that endpoint to make sure that no bad actor can randomly create tokens for your service. Azure Functions provides built-in security features that you can use to secure the endpoint by using different types of authentication policies. For more information, see [Azure Functions security](../../azure-functions/security-concepts.md).

## Clean up resources

If you want to clean up and remove an Azure Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. You can find out more about how to [clean up Communication Service resources](../quickstarts/create-communication-resource.md#clean-up-resources) and [clean up Azure Functions resources](../../azure-functions/create-first-function-vs-code-csharp.md#clean-up-resources).

## Related content

- [Learn about Azure Functions security](../../azure-functions/security-concepts.md)
- [Add voice calling to your app](../quickstarts/voice-video-calling/getting-started-with-calling.md)
- [Add chat to your app](../quickstarts/chat/get-started.md)
- [Create user access tokens](../quickstarts/identity/access-tokens.md)
- [Learn about client and server architecture](../concepts/identity-model.md#client-server-architecture)
- [Learn about authentication](../concepts/authentication.md)
