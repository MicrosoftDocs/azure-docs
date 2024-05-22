---
title: .NET Feature Management
description: Overview of .NET Feature Management library
author: zhiyuanliang-ms
ms.author: zhiyuanliang
ms.service: azure-app-configuration
ms.topic: tutorial
ms.date: 05/22/2024
zone_pivot_groups: feature-management
---

# .NET Feature Management

.NET feature management library provides a way to develop and expose application functionality based on features. Many applications have special requirements when a new feature is developed such as when the feature should be enabled and under what conditions. This library provides a way to define these relationships, and also integrates into common .NET code patterns to make exposing these features possible.

:::zone target="docs" pivot="stable-version"

[![Microsoft.FeatureManagement](https://img.shields.io/nuget/v/Microsoft.FeatureManagement?label=Microsoft.FeatureManagement)](https://www.nuget.org/packages/Microsoft.FeatureManagement)
[![Microsoft.FeatureManagement.AspNetCore](https://img.shields.io/nuget/v/Microsoft.FeatureManagement.AspNetCore?label=Microsoft.FeatureManagement.AspNetCore)](https://www.nuget.org/packages/Microsoft.FeatureManagement.AspNetCore)

:::zone-end

:::zone target="docs" pivot="preview-version"

[![Microsoft.FeatureManagement](https://img.shields.io/nuget/vpre/Microsoft.FeatureManagement?label=Microsoft.FeatureManagement)](https://www.nuget.org/packages/Microsoft.FeatureManagement/4.0.0-preview3)
[![Microsoft.FeatureManagement.AspNetCore](https://img.shields.io/nuget/vpre/Microsoft.FeatureManagement.AspNetCore?label=Microsoft.FeatureManagement.AspNetCore)](https://www.nuget.org/packages/Microsoft.FeatureManagement.AspNetCore/4.0.0-preview3)
[![Microsoft.FeatureManagement.Telemetry.ApplicationInsights](https://img.shields.io/nuget/v/Microsoft.FeatureManagement.Telemetry.ApplicationInsights?label=Microsoft.FeatureManagement.Telemetry.ApplicationInsights)](https://www.nuget.org/packages/Microsoft.FeatureManagement.Telemetry.ApplicationInsights/4.0.0-preview3)
[![Microsoft.FeatureManagement.Telemetry.ApplicationInsights.AspNetCore](https://img.shields.io/nuget/v/Microsoft.FeatureManagement.Telemetry.ApplicationInsights.AspNetCore?label=Microsoft.FeatureManagement.Telemetry.ApplicationInsights.AspNetCore)](https://www.nuget.org/packages/Microsoft.FeatureManagement.Telemetry.ApplicationInsights.AspNetCore/4.0.0-preview3)

:::zone-end

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

  The .NET feature management library is open source. For more information, visit the [GitHub repo](https://github.com/microsoft/FeatureManagement-Dotnet).