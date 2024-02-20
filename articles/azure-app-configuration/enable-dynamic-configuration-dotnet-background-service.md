---
title: "Tutorial: Use dynamic configuration in a .NET background service"
titleSuffix: Azure App Configuration
description: In this tutorial, you learn how to dynamically update the configuration data for .NET background services.
services: azure-app-configuration
author: zhiyuanliang
manager: zhenlan
ms.service: azure-app-configuration
ms.devlang: csharp
ms.custom: devx-track-csharp, devx-track-dotnet
ms.topic: tutorial
ms.date: 02/20/2024
ms.author: zhiyuanliang
#Customer intent: I want to dynamically update my .NET background service to use the latest configuration data in App Configuration.
---
# Tutorial: Use dynamic configuration in a .NET background service

Data from App Configuration can be loaded as App Settings in a .NET application. For more information, see the [quickstart](./quickstart-dotnet-core-app.md). However, as is designed by the .NET, the App Settings can only refresh upon application restart. The App Configuration .NET provider is a .NET Standard library. It supports caching and refreshing configuration dynamically without application restart. This tutorial shows how you can implement dynamic configuration updates in a .NET background service.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up your .NET background service to update its configuration in response to changes in an App Configuration store.
> * Consume the latest configuration in your background service.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
- An App Configuration store. [Create a store](./quickstart-azure-app-configuration-create.md#create-an-app-configuration-store).
- [.NET SDK](https://dotnet.microsoft.com/download) - also available in the [Azure Cloud Shell](https://shell.azure.com).