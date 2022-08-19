---
title: Migrate to App Service Environment v3 by using the migration feature
description: Overview of the migration feature for migration to App Service Environment v3
author: seligj95
ms.topic: article
ms.date: 7/29/2022
ms.author: jordanselig
ms.custom: references_regions
---
# Migration to App Service Environment v3 using the migration feature

App Service can now automate migration of your App Service Environment v2 to an [App Service Environment v3](overview.md). If you want to migrate an App Service Environment v1 to an App Service Environment v3, see the [manual migration options documentation](migration-alternatives.md). App Service Environment v3 provides [advantages and feature differences](overview.md#feature-differences) over earlier versions. Make sure to review the [supported features](overview.md#feature-differences) of App Service Environment v3 before migrating to reduce the risk of an unexpected application issue.

> [!IMPORTANT]
> It is recommended to use this feature for dev environments first before migrating any production environments to ensure there are no unexpected issues. Please provide any feedback related to this article or the feature using the buttons at the bottom of the page.
>

## Supported scenarios

At this time, App Service Environment migrations to v3 using the migration feature support both [Internal Load Balancer (ILB)](create-ilb-ase.md) and [external (internet facing with public IP)](create-external-ase.md) App Service Environment v2 in the following regions:

- Australia East
- Australia Central
- Australia Southeast
- Brazil South
- Canada Central
- Canada East
- Central India
- Central US
- East Asia
- East US
- East US 2
- France Central
- Germany West Central
- Japan East
- Korea Central
- North Central US
- North Europe
- Norway East
- South Central US
- Switzerland North
- UAE North
- UK South
- UK West
- West Central US
- West Europe
- West US
- West US 3

You can find the version of your App Service Environment by navigating to your App Service Environment in the [Azure portal](https://portal.azure.com) and selecting **Configuration** under **Settings** on the left-hand side. You can also use [Azure Resource Explorer](https://resources.azure.com/) and review the value of the `kind` property for your App Service Environment.

## Migration feature limitations

With the current version of the migration feature, your new App Service Environment will be placed in the existing subnet that was used for your old environment. Internet facing App Service Environment can’t be migrated to ILB App Service Environment v3 and vice versa.

Note that App Service Environment v3 doesn't currently support the following features that you may be using with your current App Service Environment. If you require any of these features, don't migrate until they're supported.

- Sending SMTP traffic. You can still have email triggered alerts but your app can't send outbound traffic on port 25.
- Monitoring your traffic with Network Watcher or NSG Flow.
- Configuring an IP-based TLS/SSL binding with your apps.

The following scenarios aren't supported in this version of the feature:

- App Service Environment v2 -> Zone Redundant App Service Environment v3
- App Service Environment v1
- App Service Environment v1 -> Zone Redundant App Service Environment v3
- ILB App Service Environment v2 with a custom domain suffix
- ILB App Service Environment v1 with a custom domain suffix
- Internet facing App Service Environment v2 with IP SSL addresses
- Internet facing App Service Environment v1 with IP SSL addresses
- [Zone pinned](zone-redundancy.md) App Service Environment v2
- App Service Environment in a region not listed in the supported regions

The migration feature doesn't plan on supporting App Service Environment v1 within a Classic VNet. See the [manual migration options](migration-alternatives.md) if your App Service Environment falls into this category.

The App Service platform will review your App Service Environment to confirm migration support. If your scenario doesn't pass all validation checks, you won't be able to migrate at this time using the migration feature. If your environment is in an unhealthy or suspended state, you won't be able to migrate until you make the needed updates.

### Troubleshooting

If your App Service Environment doesn't pass the validation checks or you try to perform a migration step in the incorrect order, you may see one of the following error messages:

|Error message      |Description  |Recommendation  |
|---------|---------|----------|
|Migrate can only be called on an ASE in ARM VNET and this ASE is in Classic VNET.     |App Service Environments in Classic VNets can't migrate using the migration feature.       |Migrate using one of the [manual migration options](migration-alternatives.md).  |
|ASEv3 Migration is not yet ready.     |The underlying infrastructure isn't ready to support App Service Environment v3.         |Migrate using one of the [manual migration options](migration-alternatives.md) if you want to migrate immediately. Otherwise, wait for the migration feature to be available in your region.  |
|Migration cannot be called on this ASE, please contact support for help migrating.     |Support will need to be engaged for migrating this App Service Environment. This is potentially due to custom settings used by this environment.         |Engage support to resolve your issue.  |
|Migrate cannot be called on Zone Pinned ASEs.     |App Service Environment v2s that are zone pinned can't be migrated using the migration feature at this time.         |Migrate using one of the [manual migration options](migration-alternatives.md) if you want to migrate immediately. Otherwise, wait for the migration feature to support this App Service Environment configuration.  |
|Migrate cannot be called if IP SSL is enabled on any of the sites|App Service Environments that have sites with IP SSL enabled can't be migrated using the migration feature at this time. |Migrate using one of the [manual migration options](migration-alternatives.md) if you want to migrate immediately. Otherwise, wait for the migration feature to support this App Service Environment configuration.  |
|Migrate is not available for this kind|App Service Environment v1 can't be migrated using the migration feature at this time. |Migrate using one of the [manual migration options](migration-alternatives.md) if you want to migrate immediately. Otherwise, wait for the migration feature to support this App Service Environment configuration.  |
|Full migration cannot be called before IP addresses are generated|You'll see this error if you attempt to migrate before finishing the pre-migration steps. |Ensure you've completed all pre-migration steps before you attempt to migrate. See the [step-by-step guide for migrating](how-to-migrate.md).  |
|Migration to ASEv3 is not allowed for this ASE|You won't be able to migrate using the migration feature. |Migrate using one of the [manual migration options](migration-alternatives.md).  |
|Subscription has too many App Service Environments. Please remove some before trying to create more.|The App Service Environment [quota for your subscription](../../azure-resource-manager/management/azure-subscription-service-limits.md#app-service-limits) has been met. |Remove unneeded environments or contact support to review your options.  |
|`<ZoneRedundant><DedicatedHosts><ASEv3/ASE>` is not available in this location|You'll see this error if you're trying to migrate an App Service Environment in a region that doesn't support one of your requested features. |Migrate using one of the [manual migration options](migration-alternatives.md) if you want to migrate immediately. Otherwise, wait for the migration feature to support this App Service Environment configuration.  |
|Migrate cannot be called on this ASE until the active upgrade has finished.    |App Service Environments can't be migrated during platform upgrades. You can set your [upgrade preference](using-an-ase.md#upgrade-preference) from the Azure portal.   |Wait until the upgrade finishes and then migrate.   |

## Overview of the migration process using the migration feature

Migration consists of a series of steps that must be followed in order. Key points are given for a subset of the steps. It's important to understand what will happen during these steps and how your environment and apps will be impacted. After reviewing the following information and when you're ready to migrate, follow the [step-by-step guide](how-to-migrate.md).

### Generate IP addresses for your new App Service Environment v3

The platform will create the [new inbound IP (if you're migrating an internet facing App Service Environment) and the new outbound IP](networking.md#addresses) addresses. While these IPs are getting created, activity with your existing App Service Environment won't be interrupted, however, you won't be able to scale or make changes to your existing environment. This process will take about 15 minutes to complete.

When completed, you'll be given the new IPs that will be used by your future App Service Environment v3. These new IPs have no effect on your existing environment. The IPs used by your existing environment will continue to be used up until your existing environment is shut down during the migration step.

### Update dependent resources with new IPs

Once the new IPs are created, you'll have the new default outbound to the internet public addresses so you can adjust any external firewalls, DNS routing, network security groups, and so on, in preparation for the migration. For public internet facing App Service Environment, you'll also have the new inbound IP address that you can use to set up new endpoints with services like [Traffic Manager](../../traffic-manager/traffic-manager-overview.md) or [Azure Front Door](../../frontdoor/front-door-overview.md). **It's your responsibility to update any and all resources that will be impacted by the IP address change associated with the new App Service Environment v3. Don't move on to the next step until you've made all required updates.**

### Delegate your App Service Environment subnet

App Service Environment v3 requires the subnet it's in to have a single delegation of `Microsoft.Web/hostingEnvironments`. Migration won't succeed if the App Service Environment's subnet isn't delegated or it's delegated to a different resource.

### Migrate to App Service Environment v3

After updating all dependent resources with your new IPs and properly delegating your subnet, you should continue with migration as soon as possible.

During migration, which requires up to a three hour service window, the following events will occur:

- The existing App Service Environment is shut down and replaced by the new App Service Environment v3.
- All App Service plans in the App Service Environment are converted from Isolated to Isolated v2.
- All of the apps that are on your App Service Environment are temporarily down. You should expect about one hour of downtime during this period.
  - If you can't support downtime, see [migration-alternatives](migration-alternatives.md#guidance-for-manual-migration).
- The public addresses that are used by the App Service Environment will change to the IPs identified during the previous step.

As in the IP generation step, you won't be able to scale or modify your App Service Environment or deploy apps to it during this process. When migration is complete, the apps that were on the old App Service Environment will be running on the new App Service Environment v3.

> [!NOTE]
> Due to the conversion of App Service plans from Isolated to Isolated v2, your apps may be over-provisioned after the migration since the Isolated v2 tier has more memory and CPU per corresponding instance size. You'll have the opportunity to [scale your environment](../manage-scale-up.md) as needed once migration is complete. For more information, review the [SKU details](https://azure.microsoft.com/pricing/details/app-service/windows/).
>

## Pricing

There's no cost to migrate your App Service Environment. You'll stop being charged for your previous App Service Environment as soon as it shuts down during the migration process, and you'll begin getting charged for your new App Service Environment v3 as soon as it's deployed. For more information about App Service Environment v3 pricing, see the [pricing details](overview.md#pricing).

## Frequently asked questions

- **What if migrating my App Service Environment is not currently supported?**  
  You won't be able migrate using the migration feature at this time. If you have an unsupported environment and want to migrate immediately, see the [manual migration options](migration-alternatives.md). This doc will be updated as additional regions and supported scenarios become available.
- **Will I experience downtime during the migration?**  
  Yes, you should expect about one hour of downtime during the three hour service window during the migration step so plan accordingly. If downtime isn't an option for you, see the [manual migration options](migration-alternatives.md).
- **Will I need to do anything to my apps after the migration to get them running on the new App Service Environment?**  
  No, all of your apps running on the old environment will be automatically migrated to the new environment and run like before. No user input is needed.
- **What if my App Service Environment has a custom domain suffix?**  
  You won't be able migrate using the migration feature at this time. If you have an unsupported environment and want to migrate immediately, see the [manual migration options](migration-alternatives.md).
- **What if my App Service Environment is zone pinned?**  
  Zone pinned App Service Environment is currently not a supported scenario for migration using the migration feature. When supported, zone pinned App Service Environments will be migrated to zone redundant App Service Environment v3.
- **What properties of my App Service Environment will change?**  
  You'll now be on App Service Environment v3 so be sure to review the [features and feature differences](overview.md#feature-differences) compared to previous versions. For ILB App Service Environment, you'll keep the same ILB IP address. For internet facing App Service Environment, the public IP address and the outbound IP address will change. Note for internet facing App Service Environment, previously there was a single IP for both inbound and outbound. For App Service Environment v3, they're separate. For more information, see [App Service Environment v3 networking](networking.md#addresses).
- **What happens if migration fails or there is an unexpected issue during the migration?**  
  If there's an unexpected issue, support teams will be on hand. It's recommended to migrate dev environments before touching any production environments.
- **What happens to my old App Service Environment?**  
  If you decide to migrate an App Service Environment, the old environment gets shut down and deleted and all of your apps are migrated to a new environment. Your old environment will no longer be accessible. A rollback to the old environment will not be possible.
- **What will happen to my App Service Environment v1/v2 resources after 31 August 2024?**  
  After 31 August 2024, if you haven't migrated to App Service Environment v3, your App Service Environment v1/v2s and the apps deployed in them will no longer be available. App Service Environment v1/v2 is hosted on App Service scale units running on [Cloud Services (classic)](../../cloud-services/cloud-services-choose-me.md) architecture that will be [retired on 31 August 2024](https://azure.microsoft.com/updates/cloud-services-retirement-announcement/). Because of this, [App Service Environment v1/v2 will no longer be available after that date](https://azure.microsoft.com/updates/app-service-environment-v1-and-v2-retirement-announcement/). Migrate to App Service Environment v3 to keep your apps running or save or back up any resources or data that you need to maintain.

## Next steps

> [!div class="nextstepaction"]
> [Migrate App Service Environment v2 to App Service Environment v3](how-to-migrate.md)

> [!div class="nextstepaction"]
> [Manually migrate to App Service Environment v3](migration-alternatives.md)

> [!div class="nextstepaction"]
> [App Service Environment v3 Networking](networking.md)

> [!div class="nextstepaction"]
> [Using an App Service Environment v3](using.md)
