---
title: Migrate to App Service Environment v3 by using the in-place migration feature
description: Overview of the in-place migration feature for migration to App Service Environment v3.
author: seligj95
ms.topic: article
ms.date: 03/26/2024
ms.author: jordanselig
ms.custom: references_regions
---
# Migration to App Service Environment v3 using the in-place migration feature

> [!NOTE]
> The migration feature described in this article is used for in-place (same subnet) automated migration of App Service Environment v1 and v2 to App Service Environment v3. If you're looking for information on the side-by-side migration feature, see [Migrate to App Service Environment v3 by using the side-by-side migration feature](side-by-side-migrate.md). If you're looking for information on manual migration options, see [Manual migration options](migration-alternatives.md). For help deciding which migration option is right for you, see [Migration path decision tree](upgrade-to-asev3.md#migration-path-decision-tree). For more information on App Service Environment v3, see [App Service Environment v3 overview](overview.md).
>

App Service can automate migration of your App Service Environment v1 and v2 to an [App Service Environment v3](overview.md). There are different migration options. Review the [migration path decision tree](upgrade-to-asev3.md#migration-path-decision-tree) to decide which option is best for your use case. App Service Environment v3 provides [advantages and feature differences](overview.md#feature-differences) over earlier versions. Make sure to review the [supported features](overview.md#feature-differences) of App Service Environment v3 before migrating to reduce the risk of an unexpected application issue. 

The in-place migration feature automates your migration to App Service Environment v3 by upgrading your existing App Service Environment in the same subnet. This migration option is best for customers who want to migrate to App Service Environment v3 with minimal changes to their networking configurations. You must also be able to support about one hour of application downtime. If you can't support downtime, see the [side migration feature](side-by-side-migrate.md) or the [manual migration options](migration-alternatives.md).

> [!IMPORTANT]
> It is recommended to use this feature for dev environments first before migrating any production environments to ensure there are no unexpected issues. Please provide any feedback related to this article or the feature using the buttons at the bottom of the page.
>

## Supported scenarios

At this time, the in-place migration feature doesn't support migrations to App Service Environment v3 in the following regions:

### Microsoft Azure operated by 21Vianet

- China East 2
- China North 2

The following App Service Environment configurations can be migrated using the in-place migration feature. The table gives the App Service Environment v3 configuration when using the in-place migration feature based on your existing App Service Environment. All supported App Service Environments can be migrated to a [zone redundant App Service Environment v3](../../availability-zones/migrate-app-service-environment.md) using the in-place migration feature as long as the environment is [in a region that supports zone redundancy](./overview.md#regions). You can [configure zone redundancy](#choose-your-app-service-environment-v3-configurations) during the migration process.

|Configuration                                                                                      |App Service Environment v3 Configuration                   |
|---------------------------------------------------------------------------------------------------|-----------------------------------------------------------|
|[Internal Load Balancer (ILB)](create-ilb-ase.md) App Service Environment v2                       |ILB App Service Environment v3                             |
|[External (ELB/internet facing with public IP)](create-external-ase.md) App Service Environment v2 |ELB App Service Environment v3                             |
|ILB App Service Environment v2 with a custom domain suffix                                         |ILB App Service Environment v3 with a custom domain suffix |
|ILB App Service Environment v1                                                                     |ILB App Service Environment v3                             |
|ELB App Service Environment v1                                                                     |ELB App Service Environment v3                             |
|ILB App Service Environment v1 with a custom domain suffix                                         |ILB App Service Environment v3 with a custom domain suffix |
|[Zone pinned](zone-redundancy.md) App Service Environment v2                                       |App Service Environment v3 with optional zone redundancy configuration |

If you want your new App Service Environment v3 to use a custom domain suffix and you aren't using one currently, custom domain suffix can be configured at any time once migration is complete. For more information, see [Configure custom domain suffix for App Service Environment](./how-to-custom-domain-suffix.md).

You can find the version of your App Service Environment by navigating to your App Service Environment in the [Azure portal](https://portal.azure.com) and selecting **Configuration** under **Settings** on the left-hand side. You can also use [Azure Resource Explorer](https://resources.azure.com/) and review the value of the `kind` property for your App Service Environment.

## In-place migration feature limitations

The following are limitations when using the in-place migration feature:

- Your new App Service Environment v3 is in the existing subnet that was used for your old environment.
- You can't change the region your App Service Environment is located in.
- ELB App Service Environment can't be migrated to ILB App Service Environment v3 and vice versa.
- If your existing App Service Environment uses a custom domain suffix, you have to configure custom domain suffix for your App Service Environment v3 during the migration process.
  - If you no longer want to use a custom domain suffix, you can remove it once the migration is complete.

App Service Environment v3 doesn't support the following features that you can be used with your current App Service Environment v1 or v2.

- Configuring an IP-based TLS/SSL binding with your apps.
- App Service Environment v3 doesn't fall back to Azure DNS if your configured custom DNS servers in the virtual network aren't able to resolve a given name. If this behavior is required, ensure that you have a forwarder to a public DNS or include Azure DNS in the list of custom DNS servers.

The in-place migration feature doesn't support the following scenarios. See the [manual migration options](migration-alternatives.md) if your App Service Environment falls into one of these categories.

- App Service Environment v1 in a [Classic virtual network](/previous-versions/azure/virtual-network/create-virtual-network-classic)
- ELB App Service Environment v2 with IP SSL addresses
- ELB App Service Environment v1 with IP SSL addresses

The App Service platform reviews your App Service Environment to confirm in-place migration support. If your scenario doesn't pass all validation checks, you can't migrate at this time using the in-place migration feature. If your environment is in an unhealthy or suspended state, you can't migrate until you make the needed updates.

> [!NOTE]
> App Service Environment v3 doesn't support IP SSL. If you use IP SSL, you must remove all IP SSL bindings before migrating to App Service Environment v3. The migration feature will support your environment once all IP SSL bindings are removed.
>

### Troubleshooting

If your App Service Environment doesn't pass the validation checks or you try to perform a migration step in the incorrect order, you can see one of the following error messages:

|Error message      |Description  |Recommendation  |
|---------|---------|----------|
|Migrate can only be called on an ASE in ARM VNET and this ASE is in Classic VNET.     |App Service Environments in Classic VNets can't migrate using the in-place migration feature.       |Migrate using one of the [manual migration options](migration-alternatives.md).  |
|ASEv3 Migration is not yet ready.     |The underlying infrastructure isn't ready to support App Service Environment v3.         |Migrate using one of the [manual migration options](migration-alternatives.md) if you want to migrate immediately. Otherwise, wait for the in-place migration feature to be available in your region.  |
|Migration cannot be called on this ASE, please contact support for help migrating.     |Support needs to be engaged for migrating this App Service Environment. This issue is potentially due to custom settings used by this environment.         |Open a support case to engage support to resolve your issue.  |
|Migrate cannot be called if IP SSL is enabled on any of the sites.|App Service Environments that have sites with IP SSL enabled can't be migrated using the migration feature.  |Remove the IP SSL from all of your apps in the App Service Environment to enable the migration feature. |
|Full migration cannot be called before IP addresses are generated. |This error appears if you attempt to migrate before finishing the premigration steps. |Ensure you complete all premigration steps before you attempt to migrate. See the [step-by-step guide for migrating](how-to-migrate.md).  |
|Migration to ASEv3 is not allowed for this ASE. |You can't migrate using the migration feature. |Migrate using one of the [manual migration options](migration-alternatives.md).  |
|Subscription has too many App Service Environments. Please remove some before trying to create more.|The App Service Environment [quota for your subscription](../../azure-resource-manager/management/azure-subscription-service-limits.md#app-service-limits) is met. |Remove unneeded environments or contact support to review your options.  |
|`<ZoneRedundant><DedicatedHosts><ASEv3/ASE>` is not available in this location. |This error appears if you're trying to migrate an App Service Environment in a region that doesn't support one of your requested features. |Migrate using one of the [manual migration options](migration-alternatives.md) if you want to migrate immediately. Otherwise, wait for the migration feature to support this App Service Environment configuration.  |
|Migrate cannot be called on this ASE until the active upgrade has finished.    |App Service Environments can't be migrated during platform upgrades. You can set your [upgrade preference](how-to-upgrade-preference.md) from the Azure portal. In some cases, an upgrade is initiated when visiting the migration page if your App Service Environment isn't on the current build.  |Wait until the upgrade finishes and then migrate.   |
|App Service Environment management operation in progress.    |Your App Service Environment is undergoing a management operation. These operations can include activities such as deployments or upgrades. Migration is blocked until these operations are complete.   |You can migrate once these operations are complete.  |
|Migrate is not available for this subscription.|Support needs to be engaged for migrating this App Service Environment.|Open a support case to engage support to resolve your issue.|
|Your InteralLoadBalancingMode is not currently supported.|App Service Environments that have InternalLoadBalancingMode set to certain values can't be migrated using the migration feature at this time. The InternalLoadBalancingMode must be manually changed by the Microsoft team. |Open a support case to engage support to resolve your issue. Request an update to the InternalLoadBalancingMode to allow migration. |
|Migration is invalid. Your ASE needs to be upgraded to the latest build to ensure successful migration. We will upgrade your ASE now. Please try migrating again in few hours once platform upgrade has finished. |Your App Service Environment isn't on the minimum build required for migration. An upgrade is started. Your App Service Environment won't be impacted, but you won't be able to scale or make changes to your App Service Environment while the upgrade is in progress. You won't be able to migrate until the upgrade finishes. |Wait until the upgrade finishes and then migrate. |

## Overview of the migration process using the in-place migration feature

In-place migration consists of a series of steps that must be followed in order. Key points are given for a subset of the steps. It's important to understand what happens during these steps and how your environment and apps are impacted. After reviewing the following information and when you're ready to migrate, follow the [step-by-step guide](how-to-migrate.md).

### Validate that migration is supported using the in-place migration feature for your App Service Environment

The platform validates that your App Service Environment can be migrated using the in-place migration feature. If your App Service Environment doesn't pass all validation checks, you can't migrate at this time using the in-place migration feature. See the [troubleshooting](#troubleshooting) section for details of the possible causes of validation failure. If your environment is in an unhealthy or suspended state, you can't migrate until you make the needed updates. If you can't migrate using the in-place migration feature, see the [manual migration options](migration-alternatives.md).

The validation also checks if your App Service Environment is on the minimum build required for migration. The minimum build is updated periodically to ensure the latest bug fixes and improvements are available. If your App Service Environment isn't on the minimum build, an upgrade is automatically started. Your App Service Environment won't be impacted, but you won't be able to scale or make changes to your App Service Environment while the upgrade is in progress. You won't be able to migrate until the upgrade finishes. Upgrades can take 8-12 hours to complete or longer depending on the size of your environment. If you plan a specific time window for your migration, you should run the validation check 24-48 hours before your planned migration time to ensure you have time for an upgrade if one is needed.

### Generate IP addresses for your new App Service Environment v3

The platform creates the [new inbound IP (if you're migrating an ELB App Service Environment) and the new outbound IP](networking.md#addresses) addresses. While these IPs are getting created, activity with your existing App Service Environment isn't interrupted, however, you can't scale or make changes to your existing environment. This process takes about 15 minutes to complete.

When completed, you'll be given the new IPs that your future App Service Environment v3 uses. These new IPs have no effect on your existing environment. The IPs used by your existing environment continue to be used up until your existing environment is shut down during the migration step.

### Update dependent resources with new IPs

Once the new IPs are created, you have the new default outbound to the internet public addresses. In preparation for the migration, you can adjust any external firewalls, DNS routing, network security groups, and any other resources that rely on these IPs. For ELB App Service Environment, you also have the new inbound IP address that you can use to set up new endpoints with services like [Traffic Manager](../../traffic-manager/traffic-manager-overview.md) or [Azure Front Door](../../frontdoor/front-door-overview.md). **It's your responsibility to update any and all resources that will be impacted by the IP address change associated with the new App Service Environment v3. Don't move on to the next step until you've made all required updates.** This step is also a good time to review the [inbound and outbound network](networking.md#ports-and-network-restrictions) dependency changes when moving to App Service Environment v3 including the port change for the Azure Load Balancer health probe, which now uses port 80.

### Delegate your App Service Environment subnet

App Service Environment v3 requires the subnet it's in to have a single delegation of `Microsoft.Web/hostingEnvironments`. Migration can't succeed if the App Service Environment's subnet isn't delegated or you delegate it to a different resource.

### Acknowledge instance size changes

Your App Service plans are converted from Isolated to the corresponding Isolated v2 tier as part of the migration. For example, I2 is converted to I2v2. Your apps might be over-provisioned after the migration since the Isolated v2 tier has more memory and CPU per corresponding instance size. You have the opportunity to scale your environment as needed once migration is complete. For more information, review the [SKU details](https://azure.microsoft.com/pricing/details/app-service/windows/).

### Ensure there are no locks on your resources

Virtual network locks block platform operations during migration. If your virtual network has locks, you need to remove them before migrating. The locks can be readded if needed once migration is complete. Locks can exist at three different scopes: subscription, resource group, and resource. When you apply a lock at a parent scope, all resources within that scope inherit the same lock. If you have locks applied at the subscription, resource group, or resource scope, they need to be removed before the migration. For more information on locks and lock inheritance, see [Lock your resources to protect your infrastructure](../../azure-resource-manager/management/lock-resources.md).

### Ensure there are no Azure Policies blocking migration

Azure Policy can be used to deny resource creation and modification to certain principals. If you have a policy that blocks the creation of App Service Environments or the modification of subnets, you need to remove it before migrating. The policy can be readded if needed once migration is complete. For more information on Azure Policy, see [Azure Policy overview](../../governance/policy/overview.md).

### Choose your App Service Environment v3 configurations

Your App Service Environment v3 can be deployed across availability zones in the regions that support it. This architecture is known as [zone redundancy](../../availability-zones/migrate-app-service-environment.md). Zone redundancy can only be configured during App Service Environment creation. If you want your new App Service Environment v3 to be zone redundant, enable the configuration during the migration process. Any App Service Environment that is using the in-place migration feature to migrate can be configured as zone redundant as long as you're using a [region that supports zone redundancy for App Service Environment v3](./overview.md#regions). If you're existing environment is in a region that doesn't support zone redundancy, the configuration option is disabled and you can't configure it. The in-place migration feature doesn't support changing regions. If you'd like to use a different region, use one of the [manual migration options](migration-alternatives.md).

> [!NOTE]
> Enabling zone redundancy can lead to additional charges. Review the [zone redundancy pricing model](../../availability-zones/migrate-app-service-environment.md#pricing) for more information.
>

If your existing App Service Environment uses a custom domain suffix, you're prompted to configure a custom domain suffix for your new App Service Environment v3. You need to provide the custom domain name, managed identity, and certificate. For more information on App Service Environment v3 custom domain suffix including requirements, step-by-step instructions, and best practices, see [Configure custom domain suffix for App Service Environment](./how-to-custom-domain-suffix.md). You must configure a custom domain suffix for your new environment even if you no longer want to use it. Once migration is complete, you can remove the custom domain suffix configuration if needed.

If your migration includes a custom domain suffix, for App Service Environment v3, the custom domain isn't displayed in the **Essentials** section of the **Overview** page of the portal as it is for App Service Environment v1/v2. Instead, for App Service Environment v3, go to the **Custom domain suffix** page where you can confirm your custom domain suffix is configured correctly.  

### Migrate to App Service Environment v3

After completing the previous steps, you should continue with migration as soon as possible.

> [!IMPORTANT]
> Since scaling is blocked during the migration, you should scale your environment to the desired size before starting the migration.
>

Migration requires a three to six hour service window for App Service Environment v2 to v3 migrations. Up to a six hour service window is required depending on environment size for v1 to v3 migrations. The service window might be extended in rare cases where manual intervention by the service team is required. During migration, scaling and environment configurations are blocked and the following events occur:

- The existing App Service Environment is shut down and replaced by the new App Service Environment v3.
- All App Service plans in the App Service Environment are converted from the Isolated to Isolated v2 tier.
- All of the apps that are on your App Service Environment are temporarily down. **You should expect about one hour of downtime during this period**.
  - If you can't support downtime, see the [side-by-side migration feature](side-by-side-migrate.md) or the [migration-alternatives](migration-alternatives.md#migrate-manually).
- The public addresses that are used by the App Service Environment change to the IPs generated during the IP generation step.

The following statuses are available during the migration process:

|Status      |Description  |
|------------|-------------|
|Validating and preparing the migration.     |The platform is validating migration support and performing necessary checks.     |
|Deploying App Service Environment v3 infrastructure.    |Your new App Service Environment v3 infrastructure is provisioning.          |
|Waiting for infrastructure to complete.  |The platform is validating your new infrastructure and performing necessary checks.         |
|Setting up networking. Migration downtime period has started. Applications are not accessible.  |The platform is deleting your old infrastructure and moving all of your apps to your new App Service Environment v3. Your apps are down and aren't accepting traffic.         |
|Running post migration validations.  |The platform is performing necessary checks to ensure the migration succeeded.         |
|Finalizing migration.  |The platform is finalizing the migration.         |

As in the IP generation step, you can't scale, modify your App Service Environment, or deploy apps to it during this process. When migration is complete, the apps that were on the old App Service Environment are running on the new App Service Environment v3.

## Pricing

There's no cost to migrate your App Service Environment. When you use the in-place migration feature, you stop being charged for your previous App Service Environment as soon as it shuts down during the migration process. You begin getting charged for your new App Service Environment v3 as soon as it gets deployed. For more information about App Service Environment v3 pricing, see the [pricing details](overview.md#pricing).

When you migrate to App Service Environment v3 from previous versions, there are scenarios that you should consider that can potentially reduce your monthly cost. Consider [reservations](../../cost-management-billing/reservations/reservation-discount-app-service.md#how-reservation-discounts-apply-to-isolated-v2-instances) and [savings plans](../../cost-management-billing/savings-plan/savings-plan-compute-overview.md) to further reduce your costs. For information on cost saving opportunities, see [Cost saving opportunities after upgrading to App Service Environment v3](upgrade-to-asev3.md#cost-saving-opportunities-after-upgrading-to-app-service-environment-v3).

> [!NOTE]
> Due to the conversion of App Service plans from Isolated to Isolated v2, your apps may be over-provisioned after the migration since the Isolated v2 tier has more memory and CPU per corresponding instance size. You'll have the opportunity to [scale your environment](../manage-scale-up.md) as needed once migration is complete. For more information, review the [SKU details](https://azure.microsoft.com/pricing/details/app-service/windows/).
>

### Scale down your App Service plans

The App Service plan SKUs available for App Service Environment v3 run on the Isolated v2 (Iv2) tier. The number of cores and amount of RAM are effectively doubled per corresponding tier compared the Isolated tier. When you migrate, your App Service plans are converted to the corresponding tier. For example, your I2 instances are converted to I2v2. While I2 has two cores and 7-GB RAM, I2v2 has four cores and 16-GB RAM. If you expect your capacity requirements to stay the same, you're over-provisioned and paying for compute and memory you're not using. For this scenario, you can scale down your I2v2 instance to I1v2 and end up with a similar number of cores and RAM that you had previously.

## Frequently asked questions

- **What if migrating my App Service Environment is not currently supported?**  
  You can't migrate using the in-place migration feature at this time. If you have an unsupported environment and want to migrate immediately, see the [manual migration options](migration-alternatives.md).
- **How do I choose which migration option is right for me?**  
  Review the [migration path decision tree](upgrade-to-asev3.md#migration-path-decision-tree) to decide which option is best for your use case.
- **How do I know if I should use the in-place migration feature?**  
  The in-place migration feature is best for customers who want to migrate to App Service Environment v3 with minimal changes to their networking configurations and can support about one hour of application downtime. If you can't support downtime, see the [side migration feature](side-by-side-migrate.md) or the [manual migration options](migration-alternatives.md). The in-place migration feature creates your App Service Environment v3 in the same subnet as your existing environment and uses the same networking infrastructure. You might have to account for the inbound and outbound IP address changes if you have any dependencies on these specific IPs.
- **Will I experience downtime during the migration?**  
  Yes, you should expect about one hour of downtime during the three to six hour service window during the migration step, so plan accordingly. If you have a different App Service Environment that you can point traffic to while you migrate using the in-place migration feature, you can eliminate application downtime. If you don't have another App Service Environment and you can't support downtime, see the side by [side migration feature](side-by-side-migrate.md) or the [manual migration options](migration-alternatives.md).
- **Will I need to do anything to my apps after the migration to get them running on the new App Service Environment?**  
  No, all of your apps running on the old environment are automatically migrated to the new environment and run like before. No user input is needed.
- **What if my App Service Environment has a custom domain suffix?**  
  The in-place migration feature supports this [migration scenario](#supported-scenarios).
- **What if my App Service Environment is zone pinned?**  
  Zone pinned App Service Environment v2 is now a supported scenario for migration using the migration feature. App Service Environment v3 doesn't support zone pinning. When migrating to App Service Environment v3, you can choose to configure zone redundancy or not.
- **What if my App Service Environment has IP SSL addresses?**
  IP SSL isn't supported on App Service Environment v3. You must remove all IP SSL bindings before migrating using the migration feature or one of the manual options. If you intend to use the in-place migration feature, once you remove all IP SSL bindings, you pass that validation check and can proceed with the automated migration.  
- **What properties of my App Service Environment will change?**  
  You're on App Service Environment v3 so be sure to review the [features and feature differences](overview.md#feature-differences) compared to previous versions. For ILB App Service Environment, you keep the same ILB IP address. For internet facing App Service Environment, the public IP address and the outbound IP address change. Note for ELB App Service Environment, previously there was a single IP for both inbound and outbound. For App Service Environment v3, they're separate. For more information, see [App Service Environment v3 networking](networking.md#addresses). For a full comparison of the App Service Environment versions, see [App Service Environment version comparison](version-comparison.md).
- **What happens if migration fails or there is an unexpected issue during the migration?**  
  If there's an unexpected issue, support teams are on hand. You should migrate dev environments before touching any production environments to learn about the migration process and see how it impacts your workloads.
- **What happens to my old App Service Environment?**  
  If you decide to migrate an App Service Environment using the in-place migration feature, the old environment gets shutdown, deleted, and all of your apps are migrated to a new environment. Your old environment is no longer accessible. A rollback to the old environment isn't possible.
- **What will happen to my App Service Environment v1/v2 resources after 31 August 2024?**  
  After 31 August 2024, if you don't to App Service Environment v3, your App Service Environment v1/v2s and the apps deployed in them will no longer be available. App Service Environment v1/v2 is hosted on App Service scale units running on [Cloud Services (classic)](../../cloud-services/cloud-services-choose-me.md) architecture that will be [retired on 31 August 2024](https://azure.microsoft.com/updates/cloud-services-retirement-announcement/). Because of this, [App Service Environment v1/v2 will no longer be available after that date](https://azure.microsoft.com/updates/app-service-environment-v1-and-v2-retirement-announcement/). Migrate to App Service Environment v3 to keep your apps running or save or back up any resources or data that you need to maintain.

## Next steps

> [!div class="nextstepaction"]
> [Migrate your App Service Environment to App Service Environment v3 using the in-place migration feature](how-to-migrate.md)

> [!div class="nextstepaction"]
> [App Service Environment v3 Networking](networking.md)

> [!div class="nextstepaction"]
> [Using an App Service Environment v3](using.md)

> [!div class="nextstepaction"]
> [Custom domain suffix](./how-to-custom-domain-suffix.md)
