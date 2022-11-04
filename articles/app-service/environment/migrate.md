---
title: Migrate to App Service Environment v3 by using the migration feature
description: Overview of the migration feature for migration to App Service Environment v3
author: seligj95
ms.topic: article
ms.date: 10/26/2022
ms.author: jordanselig
ms.custom: references_regions
---
# Migration to App Service Environment v3 using the migration feature

App Service can now automate migration of your App Service Environment v1 and v2 to an [App Service Environment v3](overview.md). App Service Environment v3 provides [advantages and feature differences](overview.md#feature-differences) over earlier versions. Make sure to review the [supported features](overview.md#feature-differences) of App Service Environment v3 before migrating to reduce the risk of an unexpected application issue.

> [!IMPORTANT]
> It is recommended to use this feature for dev environments first before migrating any production environments to ensure there are no unexpected issues. Please provide any feedback related to this article or the feature using the buttons at the bottom of the page.
>

## Supported scenarios

At this time, App Service Environment migrations to v3 using the migration feature are supported in the following regions:

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

The following App Service Environment configurations can be migrated using the migration feature. The table gives the App Service Environment v3 configuration you'll end up with when using the migration feature based on your existing App Service Environment. All supported App Service Environments can be migrated to a [zone redundant App Service Environment v3](../../availability-zones/migrate-app-service-environment.md) using the migration feature as long as the environment is [in a region that supports zone redundancy](./overview.md#regions). You can [configure zone redundancy](#choose-your-app-service-environment-v3-configurations) during the migration process.

|Configuration                                                                                      |App Service Environment v3 Configuration                   |
|---------------------------------------------------------------------------------------------------|-----------------------------------------------------------|
|[Internal Load Balancer (ILB)](create-ilb-ase.md) App Service Environment v2                       |ILB App Service Environment v3                             |
|[External (ELB/internet facing with public IP)](create-external-ase.md) App Service Environment v2 |ELB App Service Environment v3                             |
|ILB App Service Environment v2 with a custom domain suffix                                         |ILB App Service Environment v3 with a custom domain suffix |
|ILB App Service Environment v1                                                                     |ILB App Service Environment v3                             |
|ELB App Service Environment v1                                                                     |ELB App Service Environment v3                             |
|ILB App Service Environment v1 with a custom domain suffix                                         |ILB App Service Environment v3 with a custom domain suffix |

If you want your new App Service Environment v3 to use a custom domain suffix and you aren't using one currently, custom domain suffix can be configured at any time once migration is complete. For more information, see [Configure custom domain suffix for App Service Environment](./how-to-custom-domain-suffix.md). 

You can find the version of your App Service Environment by navigating to your App Service Environment in the [Azure portal](https://portal.azure.com) and selecting **Configuration** under **Settings** on the left-hand side. You can also use [Azure Resource Explorer](https://resources.azure.com/) and review the value of the `kind` property for your App Service Environment.

## Migration feature limitations

The following are limitations when using the migration feature:

- Your new App Service Environment v3 will be placed in the existing subnet that was used for your old environment.
- You can't change the region your App Service Environment is located in.
- ELB App Service Environment can’t be migrated to ILB App Service Environment v3 and vice versa.
- If your existing App Service Environment uses a custom domain suffix, you'll have to configure custom domain suffix for your App Service Environment v3 during the migration process. 
  - If you no longer want to use a custom domain suffix, you can remove it once the migration is complete.

App Service Environment v3 doesn't currently support the following features that you may be using with your current App Service Environment. If you require any of these features, don't migrate until they're supported.

- Monitoring your traffic with Network Watcher or NSG Flow.
- Configuring an IP-based TLS/SSL binding with your apps.

The following scenarios aren't supported by the migration feature. See the [manual migration options](migration-alternatives.md) if your App Service Environment falls into one of these categories.

- App Service Environment v1 in a [Classic VNet](/previous-versions/azure/virtual-network/create-virtual-network-classic)
- ELB App Service Environment v2 with IP SSL addresses
- ELB App Service Environment v1 with IP SSL addresses
- [Zone pinned](zone-redundancy.md) App Service Environment v2
- App Service Environment in a region not listed in the supported regions

The App Service platform will review your App Service Environment to confirm migration support. If your scenario doesn't pass all validation checks, you won't be able to migrate at this time using the migration feature. If your environment is in an unhealthy or suspended state, you won't be able to migrate until you make the needed updates.

### Troubleshooting

If your App Service Environment doesn't pass the validation checks or you try to perform a migration step in the incorrect order, you may see one of the following error messages:

|Error message      |Description  |Recommendation  |
|---------|---------|----------|
|Migrate can only be called on an ASE in ARM VNET and this ASE is in Classic VNET.     |App Service Environments in Classic VNets can't migrate using the migration feature.       |Migrate using one of the [manual migration options](migration-alternatives.md).  |
|ASEv3 Migration is not yet ready.     |The underlying infrastructure isn't ready to support App Service Environment v3.         |Migrate using one of the [manual migration options](migration-alternatives.md) if you want to migrate immediately. Otherwise, wait for the migration feature to be available in your region.  |
|Migration cannot be called on this ASE, please contact support for help migrating.     |Support will need to be engaged for migrating this App Service Environment. This is potentially due to custom settings used by this environment.         |Engage support to resolve your issue.  |
|Migrate cannot be called on Zone Pinned ASEs.     |App Service Environment v2 that is zone pinned can't be migrated using the migration feature at this time.         |Migrate using one of the [manual migration options](migration-alternatives.md) if you want to migrate immediately.  |
|Migrate cannot be called if IP SSL is enabled on any of the sites.|App Service Environments that have sites with IP SSL enabled can't be migrated using the migration feature at this time. |Migrate using one of the [manual migration options](migration-alternatives.md) if you want to migrate immediately.  |
|Full migration cannot be called before IP addresses are generated. |You'll see this error if you attempt to migrate before finishing the pre-migration steps. |Ensure you've completed all pre-migration steps before you attempt to migrate. See the [step-by-step guide for migrating](how-to-migrate.md).  |
|Migration to ASEv3 is not allowed for this ASE. |You won't be able to migrate using the migration feature. |Migrate using one of the [manual migration options](migration-alternatives.md).  |
|Subscription has too many App Service Environments. Please remove some before trying to create more.|The App Service Environment [quota for your subscription](../../azure-resource-manager/management/azure-subscription-service-limits.md#app-service-limits) has been met. |Remove unneeded environments or contact support to review your options.  |
|`<ZoneRedundant><DedicatedHosts><ASEv3/ASE>` is not available in this location. |You'll see this error if you're trying to migrate an App Service Environment in a region that doesn't support one of your requested features. |Migrate using one of the [manual migration options](migration-alternatives.md) if you want to migrate immediately. Otherwise, wait for the migration feature to support this App Service Environment configuration.  |
|Migrate cannot be called on this ASE until the active upgrade has finished.    |App Service Environments can't be migrated during platform upgrades. You can set your [upgrade preference](how-to-upgrade-preference.md) from the Azure portal. In some cases, an upgrade will be initiated when visiting the migration page if your App Service Environment isn't on the current build.  |Wait until the upgrade finishes and then migrate.   |
|App Service Environment management operation in progress.    |Your App Service Environment is undergoing a management operation. These operations can include activities such as deployments or upgrades. Migration is blocked until these operations are complete.   |You'll be able to migrate once these operations are complete.  |

## Overview of the migration process using the migration feature

Migration consists of a series of steps that must be followed in order. Key points are given for a subset of the steps. It's important to understand what will happen during these steps and how your environment and apps will be impacted. After reviewing the following information and when you're ready to migrate, follow the [step-by-step guide](how-to-migrate.md).

### Generate IP addresses for your new App Service Environment v3

The platform will create the [new inbound IP (if you're migrating an ELB App Service Environment) and the new outbound IP](networking.md#addresses) addresses. While these IPs are getting created, activity with your existing App Service Environment won't be interrupted, however, you won't be able to scale or make changes to your existing environment. This process will take about 15 minutes to complete.

When completed, you'll be given the new IPs that will be used by your future App Service Environment v3. These new IPs have no effect on your existing environment. The IPs used by your existing environment will continue to be used up until your existing environment is shut down during the migration step.

### Update dependent resources with new IPs

Once the new IPs are created, you'll have the new default outbound to the internet public addresses so you can adjust any external firewalls, DNS routing, network security groups, and any other resources that rely on these IPs, in preparation for the migration. For ELB App Service Environment, you'll also have the new inbound IP address that you can use to set up new endpoints with services like [Traffic Manager](../../traffic-manager/traffic-manager-overview.md) or [Azure Front Door](../../frontdoor/front-door-overview.md). **It's your responsibility to update any and all resources that will be impacted by the IP address change associated with the new App Service Environment v3. Don't move on to the next step until you've made all required updates.**

### Delegate your App Service Environment subnet

App Service Environment v3 requires the subnet it's in to have a single delegation of `Microsoft.Web/hostingEnvironments`. Migration won't succeed if the App Service Environment's subnet isn't delegated or it's delegated to a different resource.

### Ensure there are no locks on your resources

Virtual network locks will block platform operations during migration. If your virtual network has locks, you'll need to remove them before migrating. The locks can be readded if needed once migration is complete. Locks can exist at three different scopes: subscription, resource group, and resource. When you apply a lock at a parent scope, all resources within that scope inherit the same lock. If you have locks applied at the subscription or resource group scope, they'll need to be removed during the migration. For more information on locks and lock inheritance, see [Lock your resources to protect your infrastructure](../../azure-resource-manager/management/lock-resources.md).

### Choose your App Service Environment v3 configurations

Your App Service Environment v3 can be deployed across availability zones in the regions that support it. This architecture is known as [zone redundancy](../../availability-zones/migrate-app-service-environment.md). Zone redundancy can only be configured during App Service Environment creation. If you want your new App Service Environment v3 to be zone redundant, enable the configuration during the migration process. Any App Service Environment that is using the migration feature to migrate can be configured as zone redundant as long as you're using a [region that supports zone redundancy for App Service Environment v3](./overview.md#regions). If you're existing environment is using a region that doesn't support zone redundancy, the configuration option will be disabled and you won't be able to configure it. The migration feature doesn't support changing regions. If you'd like to use a different region, use one of the [manual migration options](migration-alternatives.md).

> [!NOTE]
> Enabling zone redundancy can lead to additional charges. Review the [zone redundancy pricing model](../../availability-zones/migrate-app-service-environment.md#pricing) for more information.
>

If your existing App Service Environment uses a custom domain suffix, you'll be prompted to configure a custom domain suffix for your new App Service Environment v3. You'll need to provide the custom domain name, managed identity, and certificate. For more information on App Service Environment v3 custom domain suffix including requirements, step-by-step instructions, and best practices, see [Configure custom domain suffix for App Service Environment](./how-to-custom-domain-suffix.md). You must configure a custom domain suffix for your new environment even if you no longer want to use it. Once migration is complete, you can remove the custom domain suffix configuration if needed. 

If your migration includes a custom domain suffix, for App Service Environment v3, the custom domain will no longer be shown in the **Essentials** section of the **Overview** page of the portal as it is for App Service Environment v1/v2. Instead, for App Service Environment v3, go to the **Custom domain suffix** page where you can confirm your custom domain suffix is configured correctly.  

### Migrate to App Service Environment v3

After completing the previous steps, you should continue with migration as soon as possible.

During migration, which requires up to a three hour service window for App Service Environment v2 to v3 migrations and up to a six hour service window depending on environment size for v1 to v3 migrations, scaling and environment configurations are blocked and the following events will occur:

- The existing App Service Environment is shut down and replaced by the new App Service Environment v3.
- All App Service plans in the App Service Environment are converted from the Isolated to Isolated v2 SKU.
- All of the apps that are on your App Service Environment are temporarily down. **You should expect about one hour of downtime during this period**.
  - If you can't support downtime, see [migration-alternatives](migration-alternatives.md#guidance-for-manual-migration).
- The public addresses that are used by the App Service Environment will change to the IPs generated during the IP generation step.

As in the IP generation step, you won't be able to scale, modify your App Service Environment, or deploy apps to it during this process. When migration is complete, the apps that were on the old App Service Environment will be running on the new App Service Environment v3.

> [!NOTE]
> Due to the conversion of App Service plans from Isolated to Isolated v2, your apps may be over-provisioned after the migration since the Isolated v2 tier has more memory and CPU per corresponding instance size. You'll have the opportunity to [scale your environment](../manage-scale-up.md) as needed once migration is complete. For more information, review the [SKU details](https://azure.microsoft.com/pricing/details/app-service/windows/).
>

## Pricing

There's no cost to migrate your App Service Environment. You'll stop being charged for your previous App Service Environment as soon as it shuts down during the migration process, and you'll begin getting charged for your new App Service Environment v3 as soon as it's deployed. For more information about App Service Environment v3 pricing, see the [pricing details](overview.md#pricing).

## Frequently asked questions

- **What if migrating my App Service Environment is not currently supported?**  
  You won't be able migrate using the migration feature at this time. If you have an unsupported environment and want to migrate immediately, see the [manual migration options](migration-alternatives.md). This doc will be updated as additional regions and supported scenarios become available.
- **Will I experience downtime during the migration?**  
  Yes, you should expect about one hour of downtime during the three to six hour service window during the migration step, so plan accordingly. If downtime isn't an option for you, see the [manual migration options](migration-alternatives.md).
- **Will I need to do anything to my apps after the migration to get them running on the new App Service Environment?**  
  No, all of your apps running on the old environment will be automatically migrated to the new environment and run like before. No user input is needed.
- **What if my App Service Environment has a custom domain suffix?**  
  The migration feature supports this [migration scenario](#supported-scenarios). You can migrate using a manual method if you don't want to use the migration feature. You can configure your [custom domain suffix](./how-to-custom-domain-suffix.md) when creating your App Service Environment v3 or any time after. 
- **What if my App Service Environment is zone pinned?**  
  Zone pinned App Service Environment is currently not a supported scenario for migration using the migration feature. App Service Environment v3 doesn't support zone pinning. To migrate to App Service Environment v3, see the [manual migration options](migration-alternatives.md).
- **What properties of my App Service Environment will change?**  
  You'll now be on App Service Environment v3 so be sure to review the [features and feature differences](overview.md#feature-differences) compared to previous versions. For ILB App Service Environment, you'll keep the same ILB IP address. For internet facing App Service Environment, the public IP address and the outbound IP address will change. Note for ELB App Service Environment, previously there was a single IP for both inbound and outbound. For App Service Environment v3, they're separate. For more information, see [App Service Environment v3 networking](networking.md#addresses).
- **What happens if migration fails or there is an unexpected issue during the migration?**  
  If there's an unexpected issue, support teams will be on hand. It's recommended to migrate dev environments before touching any production environments.
- **What happens to my old App Service Environment?**  
  If you decide to migrate an App Service Environment using the migration feature, the old environment gets shut down, deleted, and all of your apps are migrated to a new environment. Your old environment will no longer be accessible. A rollback to the old environment won't be possible.
- **What will happen to my App Service Environment v1/v2 resources after 31 August 2024?**  
  After 31 August 2024, if you haven't migrated to App Service Environment v3, your App Service Environment v1/v2s and the apps deployed in them will no longer be available. App Service Environment v1/v2 is hosted on App Service scale units running on [Cloud Services (classic)](../../cloud-services/cloud-services-choose-me.md) architecture that will be [retired on 31 August 2024](https://azure.microsoft.com/updates/cloud-services-retirement-announcement/). Because of this, [App Service Environment v1/v2 will no longer be available after that date](https://azure.microsoft.com/updates/app-service-environment-v1-and-v2-retirement-announcement/). Migrate to App Service Environment v3 to keep your apps running or save or back up any resources or data that you need to maintain.

## Next steps

> [!div class="nextstepaction"]
> [Migrate your App Service Environment to App Service Environment v3](how-to-migrate.md)

> [!div class="nextstepaction"]
> [Manually migrate to App Service Environment v3](migration-alternatives.md)

> [!div class="nextstepaction"]
> [App Service Environment v3 Networking](networking.md)

> [!div class="nextstepaction"]
> [Using an App Service Environment v3](using.md)

> [!div class="nextstepaction"]
> [Custom domain suffix](./how-to-custom-domain-suffix.md)
