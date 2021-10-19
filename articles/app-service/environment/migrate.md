---
title: Migration to App Service Environment v3 Overview
description: Overview of the migration process to an App Service Environment v3
author: seligj95
ms.topic: article
ms.date: 10/31/2021
ms.author: jordanselig
---
# Migration to App Service Environment v3 Overview

> [!IMPORTANT]
> This article describes a feature that is currently in preview. Please provide any feedback related to this article or the feature using the buttons at the bottom of the page.
> 

App Service can now migrate your App Service Environment v2 to an [App Service Environment v3](overview.md). App Service Environment v3 provides [advantages and feature differences](overview.md#feature-differences) over earlier versions. Make sure to review the [supported features](overview.md#feature-differences) of App Service Environment v3 before migrating to reduce the risk of an unexpected application issue.

## Supported scenarios

At this time, App Service Environment migrations to v3 support the following scenarios:

- App Service Environment v2
    - You can find the version of your App Service Environment by navigating to your App Service Environment in the [Azure portal](https://portal.azure.com) and selecting **Configuration** under **Settings** on the left-hand side. You can also use [Azure Resource Explorer](https://resources.azure.com/) and review the value of the `kind` property for your App Service Environment.
    - Both [Internal Load Balancer (ILB)](create-ilb-ase.md) and [external (internet facing with public IP)](create-external-ase.md) configurations are supported
- App Service Environment v3 must be available in the region you're using. Review this [list](overview.md#regions) to confirm availability.

The following scenarios are currently not supported in this version of the preview. Future updates to the migration functionality will add support for these areas.

- App Service Environment v1
- Zone redundant App Service Environment
- ILB App Service Environment with a custom domain suffix
- Internet facing App Service Environment with IP SSL addresses
- [Zone pinned](zone-redundancy.md) App Service Environment

The App Service platform will review your App Service Environment to confirm migration availability. If your scenario doesn't pass all validation checks, you'll receive feedback with details for why you can't migrate at this time.

> [!NOTE]
> This article will be updated as additional scenarios become supported.
> 

## Overview of migration process

The migration consists of two steps. For this version of the preview, your new App Service Environment will be placed in the existing subnet that was used for your old environment. Note that internet facing App Service Environment cannot be migrated to an ILB App Service Environment v3 and vice versa.

### Step 1 of migration

During this step, the platform creates the [new inbound IP (if you're migrating an internet facing App Service Environment) and the new outbound IP](networking.md#addresses). This step doesn't interrupt activity with your existing App Service Environment and will take about 15 minutes to complete. During this time, you won't be able to scale or make changes to the existing App Service Environment. 

When complete, you'll have the new default outbound to the internet public addresses so you can adjust any external firewalls, DNS routing, network security groups, and so on, in preparation for the migration. For public internet facing App Service Environments, you'll also have the new inbound IP address that you can use to set up new endpoints with services like [Traffic Manager](../../traffic-manager/traffic-manager-overview.md) or [Azure Front Door](../../frontdoor/front-door-overview.md) for example. Scaling or modifying you existing App Service Environment will also be available again if needed.

### Step 2 of migration

After Step 1 completes, you should continue with Step 2 as soon as possible. It's recommended that you move on within one week. Step 2 shuts down the existing App Service Environment and replaces it with the new App Service Environment v3. All App Service plans in the App Service Environment are converted from Isolated to Isolated v2. 

During this step, **the old App Service Environment is removed and all of the apps that are on it are temporarily down**. You should expect about two hours of downtime. Also, during this step, the public addresses that are used by the App Service Environment will change to the IPs identified during Step 1. As in Step 1, during this process, you won't be able to scale or modify you App Service Environment or deploy apps to it. When the migration is complete, the apps that were on the old App Service Environment will be running on the new environment.

> [!NOTE]
> Due to the conversion of App Service Plans from Isolated to Isolated v2, your apps may be over-provisioned after the migration since the Isolated v2 tier has more memory and cores per corresponding instance size. You'll have the opportunity to [scale your environment](../manage-scale-up.md) as needed once the migration is complete. For more information, review the [SKU details](https://azure.microsoft.com/pricing/details/app-service/windows/).
> 

## Pricing

There's no cost to migrate your App Service Environment. You'll stop being charged for your previous App Service Environment as soon as it shuts down during [Step 2](#step-2-of-migration) of the migration process, and you'll begin getting charged for your new App Service Environment v3 as soon as it's deployed. For more information about App Service Environment v3 pricing, see the [pricing details](overview.md#pricing).

## Frequently asked questions

- **What if migrating my App Service Environment is not currently supported?**  
  Support for other scenarios will roll out over the next few months in future versions of the preview. Check back for updates on this page and look for announcements on the [App Service Blog](https://azure.github.io/AppService/).
- **Will I experience downtime during the migration?**  
  Yes, you should expect about two hours of downtime during [Step 2](#step-2-of-migration) of the migration so plan accordingly.
- **Will I need to do anything to my apps after the migration to get them running on the new App Service Environment?**  
  No, all of your apps running on the old environment will be automatically migrated to the new environment and run like before. No input is needed.
- **What if my App Service Environment has a custom domain suffix?**  
  While App Service Environment v1 and v2 support [custom domain suffixes](using-an-ase.md#dns-configuration), App Service Environment v3 currently doesn't. You won't be able to migrate at this time. Support for migrating App Service Environments with custom domain suffixes will be available in a future version. Check back here for updates.
- **What properties of my App Service Environment will change?**  
  You'll now be on App Service Environment v3 so be sure to review the [features and feature differences](overview.md#feature-differences) compared to previous versions. For ILB App Service Environments, when they migrate, they'll keep the same ILB IP address. For internet facing App Service Environments, the public IP address and the outbound IP address will change. Note for internet facing App Service Environments, previously there was a single IP for both inbound and outbound. For App Service Environment v3, they're separate. For more information, see [App Service Environment v3 networking](networking.md#addresses).