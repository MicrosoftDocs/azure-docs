---
title: Migrate to App Service Environment v3 by using the migration feature
description: Overview of the migration feature for migration to App Service Environment v3
author: seligj95
ms.topic: article
ms.date: 08/07/2023
ms.author: jordanselig
ms.custom: references_regions
---
# Migration to App Service Environment v3 using the migration feature

App Service can now automate migration of your App Service Environment v1 and v2 to an [App Service Environment v3](overview.md). App Service Environment v3 provides [advantages and feature differences](overview.md#feature-differences) over earlier versions. Make sure to review the [supported features](overview.md#feature-differences) of App Service Environment v3 before migrating to reduce the risk of an unexpected application issue.

> [!IMPORTANT]
> It is recommended to use this feature for dev environments first before migrating any production environments to ensure there are no unexpected issues. Please provide any feedback related to this article or the feature using the buttons at the bottom of the page.
>

## Supported scenarios

At this time, the migration feature doesn't support migrations to App Service Environment v3 in the following regions:

### Azure Public

- Jio India West
- UAE Central

### Microsoft Azure operated by 21Vianet

- China East 2
- China North 2

The following App Service Environment configurations can be migrated using the migration feature. The table gives the App Service Environment v3 configuration when using the migration feature based on your existing App Service Environment. All supported App Service Environments can be migrated to a [zone redundant App Service Environment v3](../../availability-zones/migrate-app-service-environment.md) using the migration feature as long as the environment is [in a region that supports zone redundancy](./overview.md#regions). You can [configure zone redundancy](#choose-your-app-service-environment-v3-configurations) during the migration process.

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

- Your new App Service Environment v3 is in the existing subnet that was used for your old environment.
- You can't change the region your App Service Environment is located in.
- ELB App Service Environment can’t be migrated to ILB App Service Environment v3 and vice versa.
- If your existing App Service Environment uses a custom domain suffix, you have to configure custom domain suffix for your App Service Environment v3 during the migration process.
  - If you no longer want to use a custom domain suffix, you can remove it once the migration is complete.

App Service Environment v3 doesn't support the following features that you may be using with your current App Service Environment v1 or v2.

- Configuring an IP-based TLS/SSL binding with your apps.
- App Service Environment v3 doesn't fall back to Azure DNS if your configured custom DNS servers in the virtual network aren't able to resolve a given name. If this behavior is required, ensure that you have a forwarder to a public DNS or include Azure DNS in the list of custom DNS servers.

The migration feature doesn't support the following scenarios. See the [manual migration options](migration-alternatives.md) if your App Service Environment falls into one of these categories.

- App Service Environment v1 in a [Classic VNet](/previous-versions/azure/virtual-network/create-virtual-network-classic)
- ELB App Service Environment v2 with IP SSL addresses
- ELB App Service Environment v1 with IP SSL addresses
- [Zone pinned](zone-redundancy.md) App Service Environment v2
- App Service Environment in a region not listed in the supported regions

The App Service platform reviews your App Service Environment to confirm migration support. If your scenario doesn't pass all validation checks, you can't migrate at this time using the migration feature. If your environment is in an unhealthy or suspended state, you can't migrate until you make the needed updates.

> [!NOTE]
> App Service Environment v3 doesn't support IP SSL. If you use IP SSL, you must remove all IP SSL bindings before migrating to App Service Environment v3. The migration feature will support your environment once all IP SSL bindings are removed.
>

### Troubleshooting

If your App Service Environment doesn't pass the validation checks or you try to perform a migration step in the incorrect order, you may see one of the following error messages:

|Error message      |Description  |Recommendation  |
|---------|---------|----------|
|Migrate can only be called on an ASE in ARM VNET and this ASE is in Classic VNET.     |App Service Environments in Classic VNets can't migrate using the migration feature.       |Migrate using one of the [manual migration options](migration-alternatives.md).  |
|ASEv3 Migration is not yet ready.     |The underlying infrastructure isn't ready to support App Service Environment v3.         |Migrate using one of the [manual migration options](migration-alternatives.md) if you want to migrate immediately. Otherwise, wait for the migration feature to be available in your region.  |
|Migration cannot be called on this ASE, please contact support for help migrating.     |Support needs to be engaged for migrating this App Service Environment. This issue is potentially due to custom settings used by this environment.         |Engage support to resolve your issue.  |
|Migrate cannot be called on Zone Pinned ASEs.     |App Service Environment v2 that is zone pinned can't be migrated using the migration feature at this time.         |Migrate using one of the [manual migration options](migration-alternatives.md) if you want to migrate immediately.  |
|Migrate cannot be called if IP SSL is enabled on any of the sites.|App Service Environments that have sites with IP SSL enabled can't be migrated using the migration feature at this time. |Migrate using one of the [manual migration options](migration-alternatives.md) if you want to migrate immediately.  |
|Full migration cannot be called before IP addresses are generated. |This error appears if you attempt to migrate before finishing the pre-migration steps. |Ensure you've completed all pre-migration steps before you attempt to migrate. See the [step-by-step guide for migrating](how-to-migrate.md).  |
|Migration to ASEv3 is not allowed for this ASE. |You can't migrate using the migration feature. |Migrate using one of the [manual migration options](migration-alternatives.md).  |
|Subscription has too many App Service Environments. Please remove some before trying to create more.|The App Service Environment [quota for your subscription](../../azure-resource-manager/management/azure-subscription-service-limits.md#app-service-limits) has been met. |Remove unneeded environments or contact support to review your options.  |
|`<ZoneRedundant><DedicatedHosts><ASEv3/ASE>` is not available in this location. |This error appears if you're trying to migrate an App Service Environment in a region that doesn't support one of your requested features. |Migrate using one of the [manual migration options](migration-alternatives.md) if you want to migrate immediately. Otherwise, wait for the migration feature to support this App Service Environment configuration.  |
|Migrate cannot be called on this ASE until the active upgrade has finished.    |App Service Environments can't be migrated during platform upgrades. You can set your [upgrade preference](how-to-upgrade-preference.md) from the Azure portal. In some cases, an upgrade is initiated when visiting the migration page if your App Service Environment isn't on the current build.  |Wait until the upgrade finishes and then migrate.   |
|App Service Environment management operation in progress.    |Your App Service Environment is undergoing a management operation. These operations can include activities such as deployments or upgrades. Migration is blocked until these operations are complete.   |You can migrate once these operations are complete.  |
|Migrate is not available for this subscription.|Support needs to be engaged for migrating this App Service Environment.|Open a support case to engage support to resolve your issue.|
|Your InteralLoadBalancingMode is not currently supported.|App Service Environments that have InternalLoadBalancingMode set to certain values can't be migrated using the migration feature at this time. |Migrate using one of the [manual migration options](migration-alternatives.md) if you want to migrate immediately. |
|Migration is invalid. Your ASE needs to be upgraded to the latest build to ensure successful migration. We will upgrade your ASE now. Please try migrating again in few hours once platform upgrade has finished. |Your App Service Environment isn't on the minimum build required for migration. An upgrade is started. Your App Service Environment won't be impacted, but you won't be able to scale or make changes to your App Service Environment while the upgrade is in progress. You won't be able to migrate until the upgrade finishes. |Wait until the upgrade finishes and then migrate. |

## Overview of the migration process using the migration feature

Migration consists of a series of steps that must be followed in order. Key points are given for a subset of the steps. It's important to understand what happens during these steps and how your environment and apps are impacted. After reviewing the following information and when you're ready to migrate, follow the [step-by-step guide](how-to-migrate.md).

### Generate IP addresses for your new App Service Environment v3

The platform creates the [new inbound IP (if you're migrating an ELB App Service Environment) and the new outbound IP](networking.md#addresses) addresses. While these IPs are getting created, activity with your existing App Service Environment isn't interrupted, however, you can't scale or make changes to your existing environment. This process takes about 15 minutes to complete.

When completed, you'll be given the new IPs that your future App Service Environment v3 uses. These new IPs have no effect on your existing environment. The IPs used by your existing environment continue to be used up until your existing environment is shut down during the migration step.

### Update dependent resources with new IPs

Once the new IPs are created, you have the new default outbound to the internet public addresses. In preparation for the migration, you can adjust any external firewalls, DNS routing, network security groups, and any other resources that rely on these IPs. For ELB App Service Environment, you also have the new inbound IP address that you can use to set up new endpoints with services like [Traffic Manager](../../traffic-manager/traffic-manager-overview.md) or [Azure Front Door](../../frontdoor/front-door-overview.md). **It's your responsibility to update any and all resources that will be impacted by the IP address change associated with the new App Service Environment v3. Don't move on to the next step until you've made all required updates.** This step is also a good time to review the [inbound and outbound network](networking.md#ports-and-network-restrictions) dependency changes when moving to App Service Environment v3 including the port change for the Azure Load Balancer, which now uses port 80.

### Delegate your App Service Environment subnet

App Service Environment v3 requires the subnet it's in to have a single delegation of `Microsoft.Web/hostingEnvironments`. Migration can't succeed if the App Service Environment's subnet isn't delegated or it's delegated to a different resource.

### Acknowledge instance size changes

Your App Service plans are converted from Isolated to the corresponding Isolated v2 SKU as part of the migration. For example, I2 is converted to I2v2. Your apps may be over-provisioned after the migration since the Isolated v2 tier has more memory and CPU per corresponding instance size. You have the opportunity to scale your environment as needed once migration is complete. For more information, review the [SKU details](https://azure.microsoft.com/pricing/details/app-service/windows/).

### Ensure there are no locks on your resources

Virtual network locks block platform operations during migration. If your virtual network has locks, you need to remove them before migrating. The locks can be readded if needed once migration is complete. Locks can exist at three different scopes: subscription, resource group, and resource. When you apply a lock at a parent scope, all resources within that scope inherit the same lock. If you have locks applied at the subscription, resource group, or resource scope, they need to be removed before the migration. For more information on locks and lock inheritance, see [Lock your resources to protect your infrastructure](../../azure-resource-manager/management/lock-resources.md).

### Choose your App Service Environment v3 configurations

Your App Service Environment v3 can be deployed across availability zones in the regions that support it. This architecture is known as [zone redundancy](../../availability-zones/migrate-app-service-environment.md). Zone redundancy can only be configured during App Service Environment creation. If you want your new App Service Environment v3 to be zone redundant, enable the configuration during the migration process. Any App Service Environment that is using the migration feature to migrate can be configured as zone redundant as long as you're using a [region that supports zone redundancy for App Service Environment v3](./overview.md#regions). If you're existing environment is using a region that doesn't support zone redundancy, the configuration option is disabled and you can't configure it. The migration feature doesn't support changing regions. If you'd like to use a different region, use one of the [manual migration options](migration-alternatives.md).

> [!NOTE]
> Enabling zone redundancy can lead to additional charges. Review the [zone redundancy pricing model](../../availability-zones/migrate-app-service-environment.md#pricing) for more information.
>

If your existing App Service Environment uses a custom domain suffix, you're prompted to configure a custom domain suffix for your new App Service Environment v3. You need to provide the custom domain name, managed identity, and certificate. For more information on App Service Environment v3 custom domain suffix including requirements, step-by-step instructions, and best practices, see [Configure custom domain suffix for App Service Environment](./how-to-custom-domain-suffix.md). You must configure a custom domain suffix for your new environment even if you no longer want to use it. Once migration is complete, you can remove the custom domain suffix configuration if needed.

If your migration includes a custom domain suffix, for App Service Environment v3, the custom domain isn't displayed in the **Essentials** section of the **Overview** page of the portal as it is for App Service Environment v1/v2. Instead, for App Service Environment v3, go to the **Custom domain suffix** page where you can confirm your custom domain suffix is configured correctly.  

### Migrate to App Service Environment v3

After completing the previous steps, you should continue with migration as soon as possible.

Migration requires a three to six hour service window for App Service Environment v2 to v3 migrations. Up to a six hour service window is required depending on environment size for v1 to v3 migrations. During migration, scaling and environment configurations are blocked and the following events occur:

- The existing App Service Environment is shut down and replaced by the new App Service Environment v3.
- All App Service plans in the App Service Environment are converted from the Isolated to Isolated v2 SKU.
- All of the apps that are on your App Service Environment are temporarily down. **You should expect about one hour of downtime during this period**.
  - If you can't support downtime, see [migration-alternatives](migration-alternatives.md#guidance-for-manual-migration).
- The public addresses that are used by the App Service Environment change to the IPs generated during the IP generation step.

As in the IP generation step, you can't scale, modify your App Service Environment, or deploy apps to it during this process. When migration is complete, the apps that were on the old App Service Environment are running on the new App Service Environment v3.

> [!NOTE]
> Due to the conversion of App Service plans from Isolated to Isolated v2, your apps may be over-provisioned after the migration since the Isolated v2 tier has more memory and CPU per corresponding instance size. You'll have the opportunity to [scale your environment](../manage-scale-up.md) as needed once migration is complete. For more information, review the [SKU details](https://azure.microsoft.com/pricing/details/app-service/windows/).
>

## Pricing

There's no cost to migrate your App Service Environment. You stop being charged for your previous App Service Environment as soon as it shuts down during the migration process, and you begin getting charged for your new App Service Environment v3 as soon as it's deployed. For more information about App Service Environment v3 pricing, see the [pricing details](overview.md#pricing).

When you migrate to App Service Environment v3 from previous versions, there are scenarios that you should consider that can potentially reduce your monthly cost.

### Scale down your App Service plans

The App Service plan SKUs available for App Service Environment v3 run on the Isolated v2 (Iv2) tier. The number of cores and amount of RAM are effectively doubled per corresponding tier compared the Isolated tier. When you migrate, your App Service plans are converted to the corresponding tier. For example, your I2 instances are converted to I2v2. While I2 has two cores and 7-GB RAM, I2v2 has four cores and 16-GB RAM. If you expect your capacity requirements to stay the same, you're over-provisioned and paying for compute and memory you're not using. For this scenario, you can scale down your I2v2 instance to I1v2 and end up with a similar number of cores and RAM that you had previously.

> [!NOTE]
> All scenarios are calculated using costs based on Linux $USD pricing in East US. The payment option is set to monthly.  Estimates are based on the prices applicable on the day the estimate was created. Actual total estimates may vary. For the most up-to-date estimates, see the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/).
>

To demonstrate the cost saving opportunity for this scenario, use the [pricing calculator](https://azure.microsoft.com/pricing/calculator/) to estimate the monthly savings as a result of scaling down your App Service plans. For this example, your App Service Environment v2 has 1 I2 instance. You require two cores and 7-GB RAM. You're using pay-as-you-go pricing. On App Service Environment v2, your monthly payment is the following.

[Stamp fee + 1(I2) = $991.34 + $416.10 = $1,407.44](https://azure.com/e/014bf22b3e88439dba350866a472a41a)

When you migrate this App Service Environment using the migration feature, your new App Service Environment v3 has 1 I2v2 instance, which means you have four cores and 16-GB RAM. If you don't change anything, your monthly payment is the following.

[1(I2v2) = $563.56](https://azure.com/e/17946ea2c4db483d882526ba515a6771)

Your monthly cost is reduced, but you don't need that much compute and capacity. You scale down your instance to I1v2 and your monthly cost is reduced even further.

[1(I1v2) = $281.78](https://azure.com/e/9d481c3af3cd407d975017c2b8158bbd)

### Break even point

In most cases, migrating to App Service Environment v3 allows for cost saving opportunities. However, cost savings may not always be possible, especially if you're required to maintain a large number of small instances.

To demonstrate this scenario, you have an App Service Environment v2 with a single I1 instance. Your monthly cost is:

[Stamp fee + 1(I1) = $991.34 + $208.05 = **$1,199.39**](https://azure.com/e/ac89a70062a240e1b990304052d49fad)

If you migrate this environment to App Service Environment v3, your monthly cost is:

[1(I1v2) = **$281.78**](https://azure.com/e/9d481c3af3cd407d975017c2b8158bbd)

This change is a significant cost reduction, but you're over-provisioned since you have double the cores and RAM, which you may not need. This excess isn't an issue for this scenario since the new environment is cheaper. However, when you increase your I1 instances in a single App Service Environment, you see how migrating to App Service Environment v3 can increase your monthly cost.

For this scenario, your App Service Environment v2 has 14 I1 instances. Your monthly cost is:

[Stamp fee + 14(I1) = $991.34 + $2,912.70 = **$3,904.04**](https://azure.com/e/bd1dce4b5c8f4d6d807ed3c4ae78fcae)

When you migrate this environment to App Service Environment v3, your monthly cost is:

[14(I1v2) = **$3,944.92**](https://azure.com/e/e0f1ebacf937479ba073a9c32cb2452f)

Your App Service Environment v3 is now more expensive than your App Service Environment v2. As you start add more I1 instances, and therefore need more I1v2 instances when you migrate, the difference in price becomes more significant. If this scenario is a requirement for your environment, you may need to plan for an increase in your monthly cost. The following graph visually depicts the point where App Service Environment v3 becomes more expensive than App Service Environment v2 for this specific scenario.

> [!NOTE]
> This calculation was done with Linux $USD prices in East US. Break even points will vary due to price variances in the different regions. For an estimate that reflects your situation, see [the Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/).
>

:::image type="content" source="./media/migration/pricing-break-even-point.png" alt-text="Graph that shows the point where App Service Environment v3 becomes more expensive than v2 for the scenario where you only have small instances.":::

For more scenarios on cost changes and savings opportunities with App Service Environment v3, see [Estimate your cost savings by migrating to App Service Environment v3](https://azure.github.io/AppService/2023/03/02/App-service-environment-v3-pricing.html).

## Frequently asked questions

- **What if migrating my App Service Environment is not currently supported?**  
  You can't migrate using the migration feature at this time. If you have an unsupported environment and want to migrate immediately, see the [manual migration options](migration-alternatives.md).
- **Will I experience downtime during the migration?**  
  Yes, you should expect about one hour of downtime during the three to six hour service window during the migration step, so plan accordingly. If downtime isn't an option for you, see the [manual migration options](migration-alternatives.md).
- **Will I need to do anything to my apps after the migration to get them running on the new App Service Environment?**  
  No, all of your apps running on the old environment are automatically migrated to the new environment and run like before. No user input is needed.
- **What if my App Service Environment has a custom domain suffix?**  
  The migration feature supports this [migration scenario](#supported-scenarios). You can migrate using a manual method if you don't want to use the migration feature. You can configure your [custom domain suffix](./how-to-custom-domain-suffix.md) when creating your App Service Environment v3 or any time after.
- **What if my App Service Environment is zone pinned?**  
  Zone pinned App Service Environment is currently not a supported scenario for migration using the migration feature. App Service Environment v3 doesn't support zone pinning. To migrate to App Service Environment v3, see the [manual migration options](migration-alternatives.md).
- **What if my App Service Environment has IP SSL addresses?**
  IP SSL isn't supported on App Service Environment v3. You must remove all IP SSL bindings before migrating using the migration feature or one of the manual options. If you intend to use the migration feature, once you remove all IP SSL bindings, you'll pass that validation check and can proceed with the automated migration.  
- **What properties of my App Service Environment will change?**  
  You're on App Service Environment v3 so be sure to review the [features and feature differences](overview.md#feature-differences) compared to previous versions. For ILB App Service Environment, you keep the same ILB IP address. For internet facing App Service Environment, the public IP address and the outbound IP address change. Note for ELB App Service Environment, previously there was a single IP for both inbound and outbound. For App Service Environment v3, they're separate. For more information, see [App Service Environment v3 networking](networking.md#addresses). For a full comparison of the App Service Environment versions, see [App Service Environment version comparison](version-comparison.md).
- **What happens if migration fails or there is an unexpected issue during the migration?**  
  If there's an unexpected issue, support teams are on hand. It's recommended to migrate dev environments before touching any production environments.
- **What happens to my old App Service Environment?**  
  If you decide to migrate an App Service Environment using the migration feature, the old environment gets shut down, deleted, and all of your apps are migrated to a new environment. Your old environment is no longer accessible. A rollback to the old environment isn't possible.
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
