---
title: Use feature filters to enable conditional feature flags
titleSuffix: Azure App Configuration
description: Learn how to use feature filters in Azure App Configuration to enable conditional feature flags for your app.
ms.service: azure-app-configuration
ms.devlang: csharp
ms.custom: devx-track-csharp
author: zhiyuanliang
ms.author: zhiyuanliang
ms.topic: how-to
ms.date: 03/21/2024
#Customerintent: As a developer, I want to create a feature filter to activate a feature flag depending on a specific scenario.
---

# Use feature filters to enable conditional feature flags

Feature flags allow you to activate or deactivate functionality in your application. A simple feature flag is either on or off. The application always behaves the same way. For example, you could roll out a new feature behind a feature flag. When the feature flag is enabled, all users see the new feature. Disabling the feature flag hides the new feature.

In contrast, a _conditional feature flag_ allows the feature flag to be enabled or disabled dynamically. The application may behave differently, depending on the feature flag criteria. Suppose you want to show your new feature to a small subset of users at first. A conditional feature flag allows you to enable the feature flag for some users while disabling it for others. _Feature filters_ are rules for determining the state of the feature flag each time it's evaluated. Potential feature filters include user groups, device or browser types, geographic locations, and time windows.

The Microsoft `FeatureManagement` libraries include the following built-in feature filters accessible from the Azure App Configuration portal.

- **Time window filter** enables the feature flag during a specified window of time.
- **Targeting filter** enables the feature flag for specified users and groups.

You can also create your own custom feature filters.

