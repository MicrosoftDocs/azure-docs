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
ms.date: 10/18/2024
---

# Use variant feature flags

Variant feature flags enable your application to support multiple variants of a feature. The variants of your feature can be assigned to specific users, groups, or percentile buckets. These flags can be useful for feature rollouts, configuration rollouts, and feature experimentation (also known as A/B testing).

## What is a variant feature flag?

A variant feature flag is an enhanced feature flag that supports multiple states or variations. While it can still be toggled on or off, it also allows for different variants with configurations. A variant is defined with a *Name* and an optional *Configuration Value*. The name is an identifier to tell variants apart. The configuration value can range from simple JSON primitives to complex JSON objects. You can use variants to differentiate functionalities or user experiences and optionally configure these functionalities or user experiences with variant configuration values. Additionally, a variant feature flag includes allocation rules, which define the target audience for each variant.

### Variants

The following example shows two variants using JSON objects for the configuration value.

| Variant Name | Variant Configuration Value |
|---|---|
| Minimal | { "maxitems": 10, "showAds": false } |
| Standard | { "maxitems": 30, "showAds": true } |

### Allocation

Allocation controls which segment of users get each variant. The following example allocates 10% of users to get the *Minimal* variant and 90% to get the *Standard* variant.

| Variant | Allocation | Remarks |
|---|---|---|
| Minimal | 10% | Assign the variant to users in the 0th to 10th percentile. |
| Standard | 90% | Assign the variant to users in the 10th to 100th percentile. |

### Overrides

You can assign variants to specific groups or users irrespective of the percentage allocation. The following example assigns users in the *Beta Tester* group the *Minimal* variant.

| Group Name | Variant |
|---|---|
| Beta Tester | Minimal |

### Default variants and kill switch

Variant feature flags have two variant defaults, **DefaultWhenEnabled** and **DefaultWhenDisabled**. 
- The **DefaultWhenEnabled** variant takes effect if the flag is enabled but the allocation doesn't assign all percentiles. Any user placed in an unassigned percentile receives the **DefaultWhenEnabled** variant.
- The **DefaultWhenDisabled** variant takes effect if the flag is disabled, done by setting the **Enabled** field to false, also known as using the "kill switch". 

The **kill switch** is used to stop users from allocating. Used when one or more of the variants have a problem- whether it's a bug, regression, or bad performance. To use the kill switch, set the **Enabled** field of the variant flag to false. All users now are given the **DefaultWhenDisabled** variant, regardless of which percentiles or overridden users/groups they were a part of.

## Build an app with a variant feature flag

In this tutorial, you create a web app named _Quote of the Day_. When the app is loaded, it displays a quote. Users can interact with the heart button to like it. To improve user engagement, you want to explore whether a personalized greeting message increases the number of users who like the quote. Users who receive the _None_ variant see no greeting. Users who receive the _Simple_ variant get a simple greeting message. Users who receive the _Long_ variant get a slightly longer greeting.

## Prerequisites

* An Azure subscription. If you don’t have one, [create one for free](https://azure.microsoft.com/free/).
* An [App Configuration store](./quickstart-azure-app-configuration-create.md).

## Create a variant feature flag

1. Create a variant feature flag called *Greeting* with no label in your App Configuration store. It includes three variants: *None*, *Simple*, and *Long*, each corresponding to different greeting messages. Refer to the following table for their configuration values and allocation settings. For more information on how to add a variant feature flag, see [Create a variant feature flag](./manage-feature-flags.md#create-a-variant-feature-flag).

    | Variant Name | Variant Configuration Value | Allocation| 
    |---|---|---|
    | None *(Default)* | null | 50% |
    | Simple | "Hello!" | 25% |
    | Long | "I hope this makes your day!" | 25% | 

2. Continue to the following instructions to use the variant feature flag in your application for the language or platform you're using.
    * [ASP.NET Core](./howto-variant-feature-flags-aspnet-core.md)
