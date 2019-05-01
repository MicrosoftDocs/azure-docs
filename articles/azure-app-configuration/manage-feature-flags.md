---
title: Tutorial for using Azure App Configuration to manage feature flags | Microsoft Docs
description: In this tutorial, you learn how to manage feature flags separately from your application using Azure App Configuration
services: azure-app-configuration
documentationcenter: ''
author: yegu-ms
manager: maiye
editor: ''

ms.assetid: 
ms.service: azure-app-configuration
ms.workload: tbd
ms.devlang: csharp
ms.topic: tutorial
ms.date: 04/19/2019
ms.author: yegu
ms.custom: mvc

#Customer intent: I want to control feature availability in my app using App Configuration.
---
# Tutorial: Manage feature flags in Azure App Configuration

You can store all feature flags in Azure App Configuration and administer them from a single place. It has a portal UI, called **Feature Manager**, that is designed specifically for feature flags. Furthermore, App Configuration supports .NET Core feature flag data schema natively.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Define and manage feature flags in App Configuration.
> * Access feature flags from your application.

## Create feature flags

The **Feature Manager** in the Azure portal for App Configuration provides a UI for creating and managing feature flags that you use in your application. Follow the following steps to add a new feature flag.

1. Select **Feature Manager** > **+ Create** to add a feature flag.

2. Enter a unique key name for the feature flag. You will use this name to reference the flag in your code.

3. Optionally give the feature flag a more human-friendly description.

4. Set the initial state of the feature flag. In many cases, it is either *Off* or *On*.

5. When the state is *On*, optionally specify any additional condition to qualify it with **Add filter**. Enter a built-in or custom filter key and associate parameter(s). Built-in filters include:

## Update feature flag states

Follow the following steps to change a feature flag's state value.

1. Select **Feature Manager**.

2. Click on **...** > **Edit** to the right of a feature flag you want to modify.

3. Set a new state for the feature flag.

## Access feature flags

Feature flags created by the **Feature Manager** are stored as normal keys, though under a special namespace prefix *.appconfig.featureflag*. You can view the actual keys using the *Configuration Explorer*. Feature flags can be retrieved from App Configuration just like any key using its configuration providers, SDKs, command-line extensions, and REST APIs.

## Next steps

In this tutorial, you learned how to manage feature flags and their states using App Configuration. Refer to the following resources for more information on feature management support in App Configuration and ASP.NET Core.

* [Use feature flags in an ASP.NET Core app](./use-feature-flags-dotnet-core.md)
