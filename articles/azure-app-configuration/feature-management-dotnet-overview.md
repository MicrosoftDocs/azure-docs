---
title: .NET Feature Management
description: Overview of .NET Feature Management library
author: zhiyuanliang-ms
ms.author: zhiyuanliang
ms.service: azure-app-configuration
ms.topic: tutorial
ms.date: 05/22/2024
---

# .NET Feature Management

[![Microsoft.FeatureManagement](https://img.shields.io/nuget/v/Microsoft.FeatureManagement?label=Microsoft.FeatureManagement)](https://www.nuget.org/packages/Microsoft.FeatureManagement)
[![Microsoft.FeatureManagement.AspNetCore](https://img.shields.io/nuget/v/Microsoft.FeatureManagement.AspNetCore?label=Microsoft.FeatureManagement.AspNetCore)](https://www.nuget.org/packages/Microsoft.FeatureManagement.AspNetCore)

Feature flags provide a way for .NET and ASP.NET Core applications to turn features on or off dynamically. Developers can use feature flags in simple use cases like conditional statements to more advanced scenarios like conditionally adding routes or MVC filters. Feature flags are built on top of the .NET Core configuration system. Any .NET Core configuration provider is capable of acting as the backbone for feature flags.

Here are some of the benefits of using .NET feature management library:

* A common convention for feature management
* Low barrier-to-entry
  * Built on `IConfiguration`
  * Supports JSON file feature flag setup
* Feature Flag lifetime management
  * Configuration values can change in real-time; feature flags can be consistent across the entire request
* Simple to Complex Scenarios Covered
  * Toggle on/off features through declarative configuration file
  * Dynamically evaluate state of feature based on call to server
* API extensions for ASP.NET Core and MVC framework
  * Routing
  * Filters
  * Action Attributes

The latest stable version of .NET feature management library is [v3.1.1](./feature-management-dotnet-reference-v3.md). Version 4.0.0 is currently in preview. [.NET feature management v4](./feature-management-dotnet-reference-v4.md) includes new features such as variants and telemetry, which enable running experiments with variant feature flags. For more information, see [Run experiments with variant feature flags](./run-experiments-aspnet-core.md)

The .NET feature management library is open source. For more information, visit the [GitHub repo](https://github.com/microsoft/FeatureManagement-Dotnet).
