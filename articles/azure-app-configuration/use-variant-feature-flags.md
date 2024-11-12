---
title: 'Use variant feature flags'
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

# Use variant feature flags

Variant feature flags enable your application to support multiple variants of a feature. The variants of your feature can be assigned to specific users, groups, or percentile buckets. These can be particularly useful for feature rollouts, configuration rollouts, and feature experimentation (also known as A/B testing).

## What is a variant feature flag?

A variant feature flag uses variants and allocation to assign values to users. Variants are defined with a **Name** and a **Configuration Value**. Name is simply an identifier to help tell variants apart. The configuration value on a variant can be any valid JSON or JSON value. Using JSON allows variants to contain as much or as little data as needed to control a feature.

### Variants

The following is an example of two variants using JSON objects for the configuration value.

| Variant Name | Variant Configuration Value |
|---|---|
| Minimal | { "maxitems": 10, "showAds": false } |
| Standard | { "maxitems": 30, "showAds": true } |

### Allocation

Allocation controls which segment of users will get each variant. The following example allocates 10% of users to get the *Minimal* variant and 90% to get the *Standard* variant.

| Variant | Allocation | Remarks |
|---|---|---|
| Minimal | 10% | Assign the variant to users in the 0 to 10th percentile. |
| Standard | 90% | Assign the variant to users in the 10th to 100th percentile. |

### Overrides

You can assign variants to specific groups or users irrespective of the percentage allocation. The following example assigns users in the *Beta Tester* group the *Minimal* variant.

| Group Name | Variant |
|---|---|
| Beta Tester | Minimal |

### Default variants and kill switch

Variant feature flags have two variant defaults, **DefaultWhenEnabled** and **DefaultWhenDisabled**. 
1. The **DefaultWhenEnabled** variant will take effect if the flag is enabled but the allocation does assign all percentiles. Any user placed in an unassigned percentile will receive the **DefaultWhenEnabled** variant.
1. The **DefaultWhenDisabled** variant will take effect if the flag is disabled, usually done by setting the **Enabled** field to false, also known as using the "kill switch". 

The **kill switch** is used to stop users from allocating. Usually it is used when one or more of the variants have a problem- whether it's a bug, regression, or bad performance. To use the kill switch, set the **Enabled** field of the variant flag to false. Regardless of which percentiles users were a part of, all users will now be given the **DefaultWhenDisabled** variant.

## Create a variant feature flag

Create a variant feature flag called *Greeting* with no label and three variants, *None*, *Simple*, and *Long*. Creating variant flags is described in the [Feature Flag quickstart](./manage-feature-flags.md#create-a-variant-feature-flag).

| Variant Name | Variant Configuration Value | Allocation| 
|---|---|---|
| None *(Default)* | null | 50% |
| Simple | "Hello!" | 25% |
| Long | "I hope this makes your day!" | 25% | 

## Set up an app to use the variants

In this tutorial, you will create a web app named _Quote of the Day_. When the app is loaded, it displays a quote. Users can interact with the heart button to like it. To improve user engagement, you want to explore whether a personalized greeting message will increase the number of users who like the quote. Users who receive the _None_ variant will see no greeting. Users who receive the _Simple_ variant will get a simple greeting message. Users who receive the _Long_ variant will get a slightly longer greeting. 

## Next steps

To build the example app, continue to one the following tutorials.

> [!div class="nextstepaction"]
> [Tutorial: Use variant feature flags from Azure App Configuration in an ASP.NET application](./use-variant-feature-flags-aspnet-core.md)

For the full feature rundown of the .NET feature management library, refer to the following document.

> [!div class="nextstepaction"]
> [.NET Feature Management](./feature-management-dotnet-reference.md)
