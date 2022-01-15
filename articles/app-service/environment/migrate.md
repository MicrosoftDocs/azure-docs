---
title: Migration to App Service Environment v3
description: Overview of the migration process to App Service Environment v3
author: seligj95
ms.topic: article
ms.date: 1/17/2022
ms.author: jordanselig
ms.custom: references_regions
---
# Migration to App Service Environment v3

> [!IMPORTANT]
> This article describes a feature that is currently in preview. You should use this feature for dev environments first before migrating any production environments to ensure there are no unexpected issues. Please provide any feedback related to this article or the feature using the buttons at the bottom of the page.
>

App Service can now migrate your App Service Environment (ASE) v2 to an [App Service Environment v3](overview.md). App Service Environment v3 provides [advantages and feature differences](overview.md#feature-differences) over earlier versions. Make sure to review the [supported features](overview.md#feature-differences) of App Service Environment v3 before migrating to reduce the risk of an unexpected application issue.

## Supported scenarios

At this time, App Service Environment migrations to v3 support both [Internal Load Balancer (ILB)](create-ilb-ase.md) and [external (internet facing with public IP)](create-external-ase.md) App Service Environment v2 in the following regions:

- West Central US
- Canada Central
- Canada East
- UK South
- Germany West Central
- East Asia
- Australia East
- Australia Southeast

You can find the version of your App Service Environment by navigating to your App Service Environment in the [Azure portal](https://portal.azure.com) and selecting **Configuration** under **Settings** on the left-hand side. You can also use [Azure Resource Explorer](https://resources.azure.com/) and review the value of the `kind` property for your App Service Environment.

### Preview limitations

For this version of the preview, your new App Service Environment will be placed in the existing subnet that was used for your old environment. Internet facing App Service Environment cannot be migrated to ILB App Service Environment v3 and vice versa.

Note that App Service Environment v3 doesn't currently support the following features that you may be using with your current App Service Environment. If you require any of these features, don't migrate until they're supported.

- Sending SMTP traffic. You can still have email triggered alerts but your app can't send outbound traffic on port 25.
- Deploying your apps with FTP
- Using remote debug with your apps
- Monitoring your traffic with Network Watcher or NSG Flow
- Configuring an IP-based TLS/SSL binding with your apps

The following scenarios aren't supported in this version of the preview.

- App Service Environment v2 -> Zone Redundant App Service Environment v3
- App Service Environment v1
- App Service Environment v1 -> Zone Redundant App Service Environment v3
- |ILB App Service Environment v2 with a custom domain suffix
- ILB App Service Environment v1 with a custom domain suffix
- Internet facing App Service Environment v2 with IP SSL addresses
- Internet facing App Service Environment v1 with IP SSL addresses
- [Zone pinned](zone-redundancy.md) App Service Environment v2
- App Service Environment in a region not listed above

The App Service platform will review your App Service Environment to confirm migration support. If your scenario doesn't pass all validation checks, you won't be able to migrate at this time.

## Overview of the migration process

Migration consists of a series of steps that must be followed in order. Key points are given below for a subset of the steps. It's important to understand what will happen during these steps and how your environment and apps will be impacted. After reviewing the following information and when you're ready to migrate, follow the [step-by-step guide](how-to-migrate.md).

> [!NOTE]
> For this version of the preview, migration must be carried out using Azure REST API calls.
>

### Delegate your App Service Environment subnet

App Service Environment v3 requires the subnet it's in to have a single delegation of `Microsoft.Web/hostingEnvironments`. If the App Service Environment's subnet isn't delegated or it's delegated to a different resource, migration will fail.

### Generate IP addresses for your new App Service Environment v3

The platform will create the [new inbound IP (if you're migrating an internet facing App Service Environment) and the new outbound IP](networking.md#addresses). While these IPs are getting created, activity with your existing App Service Environment won't be interrupted, however, you won't be able to scale or make changes to your existing environment. This process will take about 5 minutes to complete.

When completed, you'll be given the new IPs that will be used by your future App Service Environment v3. These new IPs have no effect on your existing environment. The IPs used by your existing environment will continue to be used up until your existing environment is shut down during the full migration step.

### Update dependent resources with new IPs

Once the new IPs are created, you'll have the new default outbound to the internet public addresses so you can adjust any external firewalls, DNS routing, network security groups, and so on, in preparation for the migration. For public internet facing App Service Environment, you'll also have the new inbound IP address that you can use to set up new endpoints with services like [Traffic Manager](../../traffic-manager/traffic-manager-overview.md) or [Azure Front Door](../../frontdoor/front-door-overview.md). **It's your responsibility to update any and all resources that will be impacted by the IP address change associated with the new App Service Environment v3. Don't move on to the next step until you've made all required updates.**

### Full migration

After updating all dependent resources with your new IPs, you should continue with full migration as soon as possible. It's recommended that you move on within one week.

During full migration, the following events will occur:

- The existing App Service Environment is shut down and replaced by the new App Service Environment v3
- All App Service plans in the App Service Environment are converted from Isolated to Isolated v2
- All of the apps that are on your App Service Environment are temporarily down. You should expect about one hour of downtime.
  - If you can't support downtime, see [migration-alternatives](migration-alternatives.md#guidance-for-manual-migration)
- The public addresses that are used by the App Service Environment will change to the IPs identified previously

As in the IP generation step, you won't be able to scale or modify your App Service Environment or deploy apps to it during this process. When migration is complete, the apps that were on the old App Service Environment will be running on the new App Service Environment v3.

> [!NOTE]
> Due to the conversion of App Service plans from Isolated to Isolated v2, your apps may be over-provisioned after the migration since the Isolated v2 tier has more memory and CPU per corresponding instance size. You'll have the opportunity to [scale your environment](../manage-scale-up.md) as needed once migration is complete. For more information, review the [SKU details](https://azure.microsoft.com/pricing/details/app-service/windows/).
>

## Pricing

There's no cost to migrate your App Service Environment. You'll stop being charged for your previous App Service Environment as soon as it shuts down during the full migration process, and you'll begin getting charged for your new App Service Environment v3 as soon as it's deployed. For more information about App Service Environment v3 pricing, see the [pricing details](overview.md#pricing).

## Migration feature limitations

The migration feature doesn't plan on supporting App Service Environment v1 within a classic VNet. See [migration alternatives](migration-alternatives.md) if your App Service Environment falls into this category. Also, you won't be able to migrate if your App Service Environment is in an unhealthy or suspended state.

## Frequently asked questions

- **What if migrating my App Service Environment is not currently supported?**  
  You won't be able migrate using the migration feature at this time. If you have an unsupported environment and want to migrate immediately, see [migration alternatives](migration-alternatives.md).
- **Will I experience downtime during the migration?**  
  Yes, you should expect about one hour of downtime during the full migration step so plan accordingly. If downtime isn't an option for you, see [migration alternatives](migration-alternatives.md).
- **Will I need to do anything to my apps after the migration to get them running on the new App Service Environment?**  
  No, all of your apps running on the old environment will be automatically migrated to the new environment and run like before. No user input is needed.
- **What if my App Service Environment has a custom domain suffix?**  
  You won't be able migrate using the migration feature at this time. If you have an unsupported environment and want to migrate immediately, see [migration alternatives](migration-alternatives.md).
- **What if my App Service Environment is zone pinned?**  
  Zone pinned App Service Environment is currently not a supported scenario for migration. When supported, zone pinned App Service Environments will be migrated to zone redundant App Service Environment v3.
- **What properties of my App Service Environment will change?**  
  You'll now be on App Service Environment v3 so be sure to review the [features and feature differences](overview.md#feature-differences) compared to previous versions. For ILB App Service Environment, you'll keep the same ILB IP address. For internet facing App Service Environment, the public IP address and the outbound IP address will change. Note for internet facing App Service Environment, previously there was a single IP for both inbound and outbound. For App Service Environment v3, they're separate. For more information, see [App Service Environment v3 networking](networking.md#addresses).
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
