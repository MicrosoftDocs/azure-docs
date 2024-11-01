---
title: 'Variant feature flags in Azure App Configuration'
titleSuffix: Azure App configuration
description: In this tutorial, you learn how to set up and use variant feature flags in an App Configuration
#customerintent: As a user of Azure App Configuration, I want to learn how I can use variants and variant feature flags in my application.
author: rossgrambo
ms.author: rossgrambo
ms.service: azure-app-configuration
ms.devlang: csharp
ms.topic: tutorial
ms.date: 10/10/2024
---

# Variant feature flags in Azure App Configuration

Variant feature flags enable your application to support multiple variants of a feature. The variants of your feature can be assigned to specific users, groups, or percentile buckets. These can be particularly useful for feature rollouts, configuration rollouts, and feature experimentation (also known as A/B testing).

## What is a variant feature flag?

A variant feature flag uses variants and allocation to assign values to users. Variants are defined with a **Name** and a **Configuration Value**. Name is simply an identifier to help tell variants apart. The configuration value on a variant can be any valid json or json value. Using json allows variants to contain as much or as little data as needed to control a feature. The following is an example of two variants using json for the configuration value.

### Variants Example

| Variant Name | Variant Configuration Value |
|---|---|
| Minimal | { "maxitems": 10, "showAds": false } |
| Standard | { "maxitems": 30, "showAds": true } |

Allocation controls which users will get each variant. This can be done with percentages or overrides. 

### Allocation Example

| Variant | Allocation |
|---|---|
| Minimal | 10% |
| Standard | 90% |

#### Overrides

| Group Name | Variant |
|---|---|
| Beta Tester | Minimal |

This example will allocate 10% of users to get the minimal variant and 90% to get the standard variant. Because of the override, if the user is a beta tester, they will always get the minimal variant. 

## Next Steps

To try out feature flags, continue to the following tutorials.

> [!div class="nextstepaction"]
> [Tutorial: Use variant feature flags from Azure App Configuration in an ASP.NET application](./use-variant-feature-flags-aspnet-core.md)

For the full feature rundown of the .NET feature management library, refer to the following document.

> [!div class="nextstepaction"]
> [.NET Feature Management](./feature-management-dotnet-reference.md)
