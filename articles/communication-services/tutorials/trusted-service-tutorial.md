---
title: Build a trusted user access service using Azure Functions in Azure Communication Services
titleSuffix: An Azure Communication Services tutorial
description: Learn how to create a trusted user access service for  Communication services with Azure Functions
author: ddematheu2
manager: chpalm
services: azure-communication-services

ms.author: dademath
ms.date: 03/10/2021
ms.topic: overview
ms.service: azure-communication-services
---

# Build a trusted user access service using Azure Functions

[!IMPORTANT] The endpoint created at the end of this tutorial is not secure. Make sure to read more on [Azure Function Security](https://docs.microsoft.com/azure/azure-functions/security-concepts). You will want to add security to the endpoint to make sure no bad actor can just provision tokens.

[!INCLUDE [Trusted Service JavaScript](./includes/trusted-service-js.md)]

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. You can find out more about [cleaning up Azure Communication Service resources](../quickstarts/create-communication-resource.md#clean-up-resources) and [cleaning Azure Function Resources](../../azure-functions/create-first-function-vs-code-csharp.md#clean-up-resources).

## Next steps

> [!div class="nextstepaction"]
> [Learn about Azure Function Security](https://docs.microsoft.com/azure/azure-functions/security-concepts)

> [!div class="nextstepaction"]
> [Add voice calling to your app](../quickstarts/voice-video-calling/getting-started-with-calling.md)

You may also want to:

- [Add chat to your app](../quickstarts/chat/get-started.md)
- [Creating user access tokens](../quickstarts/access-tokens.md)
- [Learn about client and server architecture](../concepts/client-and-server-architecture.md)
- [Learn about authentication](../concepts/authentication.md)
