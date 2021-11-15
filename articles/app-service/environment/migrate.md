---
title: Migrate to App Service Environment v3
description: Overview of the migration process to an App Service Environment v3
author: seligj95
ms.topic: article
ms.date: 11/19/2021
ms.author: jordanselig
---
# Migration to App Service Environment v3 Overview

> [!IMPORTANT]
> This article describes a feature that is currently in preview. You should use this feature for dev environments first before migrating any production environments to ensure there are no unexpected issues. Please provide any feedback related to this article or the feature using the buttons at the bottom of the page.
>

App Service can now migrate your App Service Environment v2 to an [App Service Environment v3](overview.md). App Service Environment v3 provides [advantages and feature differences](overview.md#feature-differences) over earlier versions. Make sure to review the [supported features](overview.md#feature-differences) of App Service Environment v3 before migrating to reduce the risk of an unexpected application issue.

> [!IMPORTANT]
> App Service Environment v3 doesn't currently support the following features that you may be using with your current App Service Environment. If you require any of these features, don't migrate until they are supported. Expectations for support dates are given.
>
> - Sending SMTP traffic. You can still have email triggered alerts but your app can't send outbound traffic on port 25. (MONTH, YEAR)
> - Deploying your apps with FTP (MONTH, YEAR)
> - Using remote debug with your apps (MONTH, YEAR)
> - Monitoring your traffic with Network Watcher or NSG Flow (MONTH, YEAR)
> - Configuring an IP-based TLS/SSL binding with your apps (MONTH, YEAR)
>

## Supported scenarios

At this time, App Service Environment migrations to v3 support the following scenarios:

- App Service Environment v2 (not [zone redundant](zone-redundancy.md))
  - You can find the version of your App Service Environment by navigating to your App Service Environment in the [Azure portal](https://portal.azure.com) and selecting **Configuration** under **Settings** on the left-hand side. You can also use [Azure Resource Explorer](https://resources.azure.com/) and review the value of the `kind` property for your App Service Environment.
  - Both [Internal Load Balancer (ILB)](create-ilb-ase.md) and [external (internet facing with public IP)](create-external-ase.md) configurations are supported
- Existing App Service Environment v2 must be in one of the following regions:
  - region1
  - region2
  - region3
<!-- - App Service Environment v3 must be available in the region you're using. Review this [list](overview.md#regions) to confirm availability. -->

### Preview limitations

The following scenarios are not supported in this version of the preview. Future updates to the migration functionality will add support for these areas. Expectations for support dates are given.

|Scenario          |Estimated Support Date  |
|-------------------------------------------------------------------------------------------------|---------|
|Zone redundant App Service Environment v2                                                        |TBD      |
|App Service Environment v1 (not zone redundant)                                                  |TBD      |
|Zone redundant App Service Environment v1                                                        |TBD      |
|ILB App Service Environment v2 with a custom domain suffix                                       |TBD      |
|ILB App Service Environment v1 with a custom domain suffix                                       |TBD      |
|Internet facing App Service Environment v2 with IP SSL addresses                                 |TBD      |
|Internet facing App Service Environment v1 with IP SSL addresses                                 |TBD      |
|[Zone pinned](zone-redundancy.md) App Service Environment (new App Service Environment v3 would be a zone redundant environment instead since zone pinning isn't a feature of App Service Environment v3) |TBD      |
|App Service Environment in a region not listed above                                             |TBD      |

The App Service platform will review your App Service Environment to confirm migration support. If your scenario doesn't pass all validation checks, you won't be able to migrate at this time.

## Overview of migration process

Migration consists of two steps. For this version of the preview, your new App Service Environment will be placed in the existing subnet that was used for your old environment. Internet facing App Service Environment cannot be migrated to an ILB App Service Environment v3 and vice versa.

### Step 1 of migration (pre-migration)

During this step, the platform creates the [new inbound IP (if you're migrating an internet facing App Service Environment) and the new outbound IP](networking.md#addresses). This step doesn't interrupt activity with your existing App Service Environment and will take about 15 minutes to complete. During this time, you won't be able to scale or make changes to your existing App Service Environment.

When complete, you'll have the new default outbound to the internet public addresses so you can adjust any external firewalls, DNS routing, network security groups, and so on, in preparation for the migration. For public internet facing App Service Environments, you'll also have the new inbound IP address that you can use to set up new endpoints with services like [Traffic Manager](../../traffic-manager/traffic-manager-overview.md) or [Azure Front Door](../../frontdoor/front-door-overview.md). Scaling or modifying you existing App Service Environment will also be available again if needed.

### Step 2 of migration (full migration)

After Step 1 completes, you should continue with Step 2 as soon as possible after updating your resources with the new IPs. It's recommended that you move on within one week. Step 2 shuts down the existing App Service Environment and replaces it with the new App Service Environment v3. All App Service plans in the App Service Environment are converted from Isolated to Isolated v2.

During this step, **the old App Service Environment is removed and all of the apps that are on it are temporarily down**. You should expect about one hour of downtime. If you can't support downtime, see [migration-alternatives](migration-alternatives.md#guidance-for-manual-migration). Also, during this step, the public addresses that are used by the App Service Environment will change to the IPs identified during Step 1. As in Step 1, you won't be able to scale or modify you App Service Environment or deploy apps to it during this process. When the migration is complete, the apps that were on the old App Service Environment will be running on the new environment.

> [!NOTE]
> Due to the conversion of App Service Plans from Isolated to Isolated v2, your apps may be over-provisioned after the migration since the Isolated v2 tier has more memory and cores per corresponding instance size. You'll have the opportunity to [scale your environment](../manage-scale-up.md) as needed once the migration is complete. For more information, review the [SKU details](https://azure.microsoft.com/pricing/details/app-service/windows/).
>

### How to migrate

When you're ready to migrate, follow the [step-by-step guide](how-to-migrate.md).

## Pricing

There's no cost to migrate your App Service Environment. You'll stop being charged for your previous App Service Environment as soon as it shuts down during Step 2 of the migration process, and you'll begin getting charged for your new App Service Environment v3 as soon as it's deployed. For more information about App Service Environment v3 pricing, see the [pricing details](overview.md#pricing).

## Migration Tool Limitations

The following scenarios aren't planned for support using the migration tool. If your environment falls into one of these categories, see [migration alternatives](migration-alternatives.md).

- App Service Environment v1 with classic VNet
- App Service Environment with customized large workers

## Frequently asked questions

- **What if migrating my App Service Environment is not currently supported?**  
  Support for other scenarios will roll out over the next few months in future versions of the preview. Check back for updates on this page and look for announcements on the [App Service Blog](https://azure.github.io/AppService/). If you have an unsupported environment and want to migrate sooner, see [migration alternatives](migration-alternatives.md).
- **Will I experience downtime during the migration?**  
  Yes, you should expect about one hour of downtime during Step 2 of the migration so plan accordingly. If downtime isn't an option for you, see [migration alternatives](migration-alternatives.md)
- **Will I need to do anything to my apps after the migration to get them running on the new App Service Environment?**  
  No, all of your apps running on the old environment will be automatically migrated to the new environment and run like before. No user input is needed.
- **What if my App Service Environment has a custom domain suffix?**  
  While App Service Environment v1 and v2 support [custom domain suffixes](using-an-ase.md#dns-configuration), App Service Environment v3 currently doesn't. You won't be able to migrate at this time. Support for migrating App Service Environments with custom domain suffixes will be available in a future version. Check back here for updates.
- **What if my App Service Environment is zone pinned?**  
  Zone pinned App Service Environment is currently not a supported scenario for migration. When supported, zone pinned App Service Environment will be migrated to zone redundant App Service Environment v3.
- **What properties of my App Service Environment will change?**  
  You'll now be on App Service Environment v3 so be sure to review the [features and feature differences](overview.md#feature-differences) compared to previous versions. For ILB App Service Environments, they'll keep the same ILB IP address. For internet facing App Service Environments, the public IP address and the outbound IP address will change. Note for internet facing App Service Environments, previously there was a single IP for both inbound and outbound. For App Service Environment v3, they're separate. For more information, see [App Service Environment v3 networking](networking.md#addresses).
- **What happens if migration fails or there is an unexpected issue during the migration?**  
  If there's an unexpected issue, support teams will be on hand. It's recommended to migrate dev environments before touching any production environments.
- **What happens to my old App Service Environment?**  
  If you decide to migrate an App Service Environment, the old environment gets shut down and deleted and all of your apps are migrated to a new environment. Your old environment will no longer be accessible.

## Next steps

> [!div class="nextstepaction"]
> [Migrate App Service Environment v2 to App Service Environment v3](how-to-migrate.md)

> [!div class="nextstepaction"]
> [Migration Alternatives](migration-alternatives.md)

> [!div class="nextstepaction"]
> [App Service Environment v3 Networking](networking.md)

> [!div class="nextstepaction"]
> [Using an App Service Environment v3](using.md)
