---
title: Migration to App Service Environment v3
description: Overview of the migration process to an App Service Environment v3
author: seligj95
ms.topic: article
ms.date: 12/20/2021
ms.author: jordanselig
---
# Migration to App Service Environment v3

> [!IMPORTANT]
> This article describes a feature that is currently in preview. You should use this feature for dev environments first before migrating any production environments to ensure there are no unexpected issues. Please provide any feedback related to this article or the feature using the buttons at the bottom of the page.
>

App Service can now migrate your App Service Environment (ASE) v2 to an [App Service Environment v3](overview.md). App Service Environment v3 provides [advantages and feature differences](overview.md#feature-differences) over earlier versions. Make sure to review the [supported features](overview.md#feature-differences) of App Service Environment v3 before migrating to reduce the risk of an unexpected application issue.

## Supported scenarios

At this time, ASE migrations to v3 are supported for both [Internal Load Balancer (ILB)](create-ilb-ase.md) and [external (internet facing with public IP)](create-external-ase.md) ASEv2 in the following regions:

- region1
- region2
- region3

You can find the version of your ASE by navigating to your ASE in the [Azure portal](https://portal.azure.com) and selecting **Configuration** under **Settings** on the left-hand side. You can also use [Azure Resource Explorer](https://resources.azure.com/) and review the value of the `kind` property for your ASE.

### Preview limitations

For this version of the preview, your new ASE will be placed in the existing subnet that was used for your old environment. Internet facing App Service Environment cannot be migrated to ILB ASEv3 and vice versa.

Note that ASEv3 doesn't currently support the following features that you may be using with your current ASE. If you require any of these features, don't migrate until they're supported. Expectations for support dates are given.

- Sending SMTP traffic. You can still have email triggered alerts but your app can't send outbound traffic on port 25. (MONTH, YEAR)
- Deploying your apps with FTP (MONTH, YEAR)
- Using remote debug with your apps (MONTH, YEAR)
- Monitoring your traffic with Network Watcher or NSG Flow (MONTH, YEAR)
- Configuring an IP-based TLS/SSL binding with your apps (MONTH, YEAR)

The following scenarios aren't supported in this version of the preview. Future updates to the migration functionality will add support for these areas. Expectations for support dates are given.

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

The App Service platform will review your ASE to confirm migration support. If your scenario doesn't pass all validation checks, you won't be able to migrate at this time.

## Overview of the migration process

Migration consists of a series of steps that must be followed in order. Key points are given below for a subset of the steps. It's important to understand what will happen during these steps and how your environment and apps will be impacted. After reviewing the following information and when you're ready to migrate, follow the [step-by-step guide](how-to-migrate.md).

### Delegate your App Service Environment subnet

ASEv3 requires the subnet it's in to have a single delegation of `Microsoft.Web/hostingEnvironments`. If the ASE's subnet isn't delegated or it's delegated to a different resource, migration will fail.

### Generate IP addresses for your new App Service Environment v3

The platform will create the [new inbound IP (if you're migrating an internet facing ASE) and the new outbound IP](networking.md#addresses). While these IPs are getting created, activity with your existing ASE won't be interrupted, however, you won't be able to scale or make changes to your existing environment. This process will take about 15 minutes to complete.

When completed, you'll be given the new IPs that will be used by your future ASEv3. These new IPs have no effect on your existing environment. The IPs used by your existing environment will continue to be used up until your existing environment is shut down during the full migration step.

### Update dependent resources with new IPs

Once the new IPs are created, you'll have the new default outbound to the internet public addresses so you can adjust any external firewalls, DNS routing, network security groups, and so on, in preparation for the migration. For public internet facing ASE, you'll also have the new inbound IP address that you can use to set up new endpoints with services like [Traffic Manager](../../traffic-manager/traffic-manager-overview.md) or [Azure Front Door](../../frontdoor/front-door-overview.md). **It's your responsibility to update any and all resources that will be impacted by the IP address change associated with the new ASEv3. Don't move on to the next step until you've made all required updates.**

### Full migration

After updating all dependent resources with your new IPs, you should continue with full migration as soon as possible. It's recommended that you move on within one week.

During full migration, the following events will occur:

- The existing ASE is shut down and replaced by the new ASEv3
- All App Service plans in the ASE are converted from Isolated to Isolated v2
- All of the apps that are on your ASE are temporarily down. You should expect about one hour of downtime.
  - If you can't support downtime, see [migration-alternatives](migration-alternatives.md#guidance-for-manual-migration)
- The public addresses that are used by the ASE will change to the IPs identified previously

As in the IP generation step, you won't be able to scale or modify your ASE or deploy apps to it during this process. When migration is complete, the apps that were on the old ASE will be running on the new ASEv3.

> [!NOTE]
> Due to the conversion of App Service plans from Isolated to Isolated v2, your apps may be over-provisioned after the migration since the Isolated v2 tier has more memory and CPU per corresponding instance size. You'll have the opportunity to [scale your environment](../manage-scale-up.md) as needed once migration is complete. For more information, review the [SKU details](https://azure.microsoft.com/pricing/details/app-service/windows/).
>

## Pricing

There's no cost to migrate your ASE. You'll stop being charged for your previous ASE as soon as it shuts down during the full migration process, and you'll begin getting charged for your new ASEv3 as soon as it's deployed. For more information about ASEv3 pricing, see the [pricing details](overview.md#pricing).

## Migration tool limitations

The following scenarios aren't planned for support using the migration tool. If your environment falls into one of these categories, see [migration alternatives](migration-alternatives.md).

- ASEv1 with classic VNet

## Frequently asked questions

- **What if migrating my App Service Environment is not currently supported?**  
  Support for other scenarios will roll out over the next few months in future versions of the preview. Check back for updates on this page and look for announcements on the [App Service Blog](https://azure.github.io/AppService/). If you have an unsupported environment and want to migrate sooner, see [migration alternatives](migration-alternatives.md).
- **Will I experience downtime during the migration?**  
  Yes, you should expect about one hour of downtime during the full migration step so plan accordingly. If downtime isn't an option for you, see [migration alternatives](migration-alternatives.md).
- **Will I need to do anything to my apps after the migration to get them running on the new App Service Environment?**  
  No, all of your apps running on the old environment will be automatically migrated to the new environment and run like before. No user input is needed.
- **What if my App Service Environment has a custom domain suffix?**  
  While ASEv1 and ASEv2 support [custom domain suffixes](using-an-ase.md#dns-configuration), ASEv3 currently doesn't. You won't be able to migrate at this time. Support for migrating an ASE with a custom domain suffix will be available in a future version. Check back here for updates.
- **What if my App Service Environment is zone pinned?**  
  Zone pinned ASE is currently not a supported scenario for migration. When supported, zone pinned ASE will be migrated to zone redundant ASEv3.
- **What properties of my App Service Environment will change?**  
  You'll now be on ASEv3 so be sure to review the [features and feature differences](overview.md#feature-differences) compared to previous versions. For ILB ASE, you'll keep the same ILB IP address. For internet facing ASE, the public IP address and the outbound IP address will change. Note for internet facing ASE, previously there was a single IP for both inbound and outbound. For ASEv3, they're separate. For more information, see [ASEv3 networking](networking.md#addresses).
- **What happens if migration fails or there is an unexpected issue during the migration?**  
  If there's an unexpected issue, support teams will be on hand. It's recommended to migrate dev environments before touching any production environments.
- **What happens to my old App Service Environment?**  
  If you decide to migrate an ASE, the old environment gets shut down and deleted and all of your apps are migrated to a new environment. Your old environment will no longer be accessible.

## Next steps

> [!div class="nextstepaction"]
> [Migrate App Service Environment v2 to App Service Environment v3](how-to-migrate.md)

> [!div class="nextstepaction"]
> [Migration Alternatives](migration-alternatives.md)

> [!div class="nextstepaction"]
> [App Service Environment v3 Networking](networking.md)

> [!div class="nextstepaction"]
> [Using an App Service Environment v3](using.md)
