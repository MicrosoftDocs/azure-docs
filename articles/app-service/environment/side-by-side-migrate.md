---
title: Migrate to App Service Environment v3 by using the side by side migration feature
description: Overview of the side by side migration feature for migration to App Service Environment v3
author: seligj95
ms.topic: article
ms.date: 12/7/2023
ms.author: jordanselig
ms.custom: references_regions
---
# Migration to App Service Environment v3 using the side by side migration feature

> [!NOTE]
> The migration feature described in this article is used for side by side (different subnet) automated migration of App Service Environment v1 and v2 to App Service Environment v3. If you're looking for information on the in-place migration feature, see [Migrate to App Service Environment v3 by using the in-place migration feature](migrate.md). If you're looking for information on manual migration options, see [Manual migration options](migration-alternatives.md). For help deciding which migration option is right for you, see [Migration path decision tree](upgrade-to-asev3.md#migration-path-decision-tree). For more information on App Service Environment v3, see [App Service Environment v3 overview](overview.md).
>

App Service can automate migration of your App Service Environment v1 and v2 to an [App Service Environment v3](overview.md). There are different migration options. Review the [migration path decision tree](upgrade-to-asev3.md#migration-path-decision-tree) to decide which option is best for your use case. App Service Environment v3 provides [advantages and feature differences](overview.md#feature-differences) over earlier versions. Make sure to review the [supported features](overview.md#feature-differences) of App Service Environment v3 before migrating to reduce the risk of an unexpected application issue. 

The side by side migration feature automates your migration to App Service Environment v3 by creating a new App Service Environment v3 with all of your apps in a different subnet. Your existing App Service Environment isn't deleted until you initiate its deletion at the end of the migration process. Because of this process, there is a rollback option if you need to cancel your migration. This migration option is best for customers who want to migrate to App Service Environment v3 with zero downtime and can support using a different subnet for their new environment. If you need to use the same subnet and can support about one hour of application downtime, see the [in-place migration feature](migrate.md). For manual migration options that allow you to migrate at your own pace, see [manual migration options](migration-alternatives.md).

> [!IMPORTANT]
> It is recommended to use this feature for dev environments first before migrating any production environments to ensure there are no unexpected issues. Please provide any feedback related to this article or the feature using the buttons at the bottom of the page.
>

## Supported scenarios

At this time, the side by side migration feature doesn't support migrations to App Service Environment v3 in the following regions:

### Azure Public

- Jio India West

### Microsoft Azure operated by 21Vianet

- China East 2
- China North 2

The following App Service Environment configurations can be migrated using the side by side migration feature. The table gives the App Service Environment v3 configuration when using the side by side migration feature based on your existing App Service Environment.

|Configuration                                                                                      |App Service Environment v3 Configuration                   |
|---------------------------------------------------------------------------------------------------|-----------------------------------------------------------|
|[Internal Load Balancer (ILB)](create-ilb-ase.md) App Service Environment v2                       |ILB App Service Environment v3                             |
|[External (ELB/internet facing with public IP)](create-external-ase.md) App Service Environment v2 |ELB App Service Environment v3                             |
|ILB App Service Environment v2 with a custom domain suffix                                         |ILB App Service Environment v3 (custom domain suffix is optional) |
|ILB/ELB zone pinned App Service Environment v2                                                     |ILB/ELB App Service Environment v3                         |

App Service Environment v3 can deployed as [zone redundant](../../availability-zones/migrate-app-service-environment.md). Zone redundancy can be enabled as long as your App Service Environment v3 is [in a region that supports zone redundancy](./overview.md#regions).

If you want your new App Service Environment v3 to use a custom domain suffix and you aren't using one currently, custom domain suffix can be configured during the migration set-up or at any time once migration is complete. For more information, see [Configure custom domain suffix for App Service Environment](./how-to-custom-domain-suffix.md). If your existing environment has a custom domain suffix and you no longer want to use it, don't configure a custom domain suffix during the migration set-up.

## Side by side migration feature limitations

The following are limitations when using the side by side migration feature:

- Your new App Service Environment v3 is in a different subnet but the same virtual network as your existing environment.
- You can't change the region your App Service Environment is located in.
- ELB App Service Environment can’t be migrated to ILB App Service Environment v3 and vice versa.

App Service Environment v3 doesn't support the following features that you may be using with your current App Service Environment v2.

- Configuring an IP-based TLS/SSL binding with your apps.
- App Service Environment v3 doesn't fall back to Azure DNS if your configured custom DNS servers in the virtual network aren't able to resolve a given name. If this behavior is required, ensure that you have a forwarder to a public DNS or include Azure DNS in the list of custom DNS servers.

The side by side migration feature doesn't support the following scenarios. See the [manual migration options](migration-alternatives.md) if your App Service Environment falls into one of these categories.

- App Service Environment v1
  - You can find the version of your App Service Environment by navigating to your App Service Environment in the [Azure portal](https://portal.azure.com) and selecting **Configuration** under **Settings** on the left-hand side. You can also use [Azure Resource Explorer](https://resources.azure.com/) and review the value of the `kind` property for your App Service Environment.
  - If you have an App Service Environment v1, you can migrate using the [in-place migration feature](migrate.md) or one of the [manual migration options](migration-alternatives.md).
- ELB App Service Environment v2 with IP SSL addresses
- App Service Environment in a region not listed in the supported regions

The App Service platform reviews your App Service Environment to confirm side by side migration support. If your scenario doesn't pass all validation checks, you can't migrate at this time using the side by side migration feature. If your environment is in an unhealthy or suspended state, you can't migrate until you make the needed updates.

> [!NOTE]
> App Service Environment v3 doesn't support IP SSL. If you use IP SSL, you must remove all IP SSL bindings before migrating to App Service Environment v3. The migration feature will support your environment once all IP SSL bindings are removed.
>

### Troubleshooting

If your App Service Environment doesn't pass the validation checks or you try to perform a migration step in the incorrect order, you may see one of the following error messages:

<!-- TODO: replace with new error messages when available from Bhumika -->
|Error message      |Description  |Recommendation  |
|---------|---------|----------|
|Migrate can only be called on an ASE in ARM VNET and this ASE is in Classic VNET.     |App Service Environments in Classic VNets can't migrate using the side migration feature.       |Migrate using one of the [manual migration options](migration-alternatives.md).  |
|ASEv3 Migration is not yet ready.     |The underlying infrastructure isn't ready to support App Service Environment v3.         |Migrate using one of the [manual migration options](migration-alternatives.md) if you want to migrate immediately. Otherwise, wait for the side by side migration feature to be available in your region.  |
|Migration cannot be called on this ASE, please contact support for help migrating.     |Support needs to be engaged for migrating this App Service Environment. This issue is potentially due to custom settings used by this environment.         |Engage support to resolve your issue.  |
|Migrate cannot be called on Zone Pinned ASEs.     |App Service Environment v2 that is zone pinned can't be migrated using the side by side migration feature at this time.         |Migrate using one of the [manual migration options](migration-alternatives.md) if you want to migrate immediately.  |
|Migrate cannot be called if IP SSL is enabled on any of the sites.|App Service Environments that have sites with IP SSL enabled can't be migrated using the side by side migration feature at this time. |Migrate using one of the [manual migration options](migration-alternatives.md) if you want to migrate immediately.  |
|Full migration cannot be called before IP addresses are generated. |This error appears if you attempt to migrate before finishing the pre-migration steps. |Ensure you've completed all pre-migration steps before you attempt to migrate. See the [step-by-step guide for migrating](how-to-side-by-side-migrate.md).  |
|Migration to ASEv3 is not allowed for this ASE. |You can't migrate using the side by side migration feature. |Migrate using one of the [manual migration options](migration-alternatives.md).  |
|Subscription has too many App Service Environments. Please remove some before trying to create more.|The App Service Environment [quota for your subscription](../../azure-resource-manager/management/azure-subscription-service-limits.md#app-service-limits) has been met. |Remove unneeded environments or contact support to review your options.  |
|`<ZoneRedundant><DedicatedHosts><ASEv3/ASE>` is not available in this location. |This error appears if you're trying to migrate an App Service Environment in a region that doesn't support one of your requested features. |Migrate using one of the [manual migration options](migration-alternatives.md) if you want to migrate immediately. Otherwise, wait for the side by side migration feature to support this App Service Environment configuration.  |
|Migrate cannot be called on this ASE until the active upgrade has finished.    |App Service Environments can't be migrated during platform upgrades. You can set your [upgrade preference](how-to-upgrade-preference.md) from the Azure portal. In some cases, an upgrade is initiated when visiting the migration page if your App Service Environment isn't on the current build.  |Wait until the upgrade finishes and then migrate.   |
|App Service Environment management operation in progress.    |Your App Service Environment is undergoing a management operation. These operations can include activities such as deployments or upgrades. Migration is blocked until these operations are complete.   |You can migrate once these operations are complete.  |
|Migrate is not available for this subscription.|Support needs to be engaged for migrating this App Service Environment.|Open a support case to engage support to resolve your issue.|
|Your InternalLoadBalancingMode is not currently supported.|App Service Environments that have InternalLoadBalancingMode set to certain values can't be migrated using the side by side migration feature at this time. |Migrate using one of the [manual migration options](migration-alternatives.md) if you want to migrate immediately. |
|Migration is invalid. Your ASE needs to be upgraded to the latest build to ensure successful migration. We will upgrade your ASE now. Please try migrating again in few hours once platform upgrade has finished. |Your App Service Environment isn't on the minimum build required for migration. An upgrade is started. Your App Service Environment won't be impacted, but you won't be able to scale or make changes to your App Service Environment while the upgrade is in progress. You won't be able to migrate until the upgrade finishes. |Wait until the upgrade finishes and then migrate. |

## Overview of the migration process using the side by side migration feature

Side by side migration consists of a series of steps that must be followed in order. Key points are given for a subset of the steps. It's important to understand what happens during these steps and how your environment and apps are impacted. After reviewing the following information and when you're ready to migrate, follow the [step-by-step guide](how-to-side-by-side-migrate.md).

### Select and prepare the subnet for your new App Service Environment v3

The platform creates your new App Service Environment v3 in a different subnet than your existing App Service Environment. You need to select a subnet that meets the following requirements:

- The subnet must be in the same virtual network, and therefore region, as your existing App Service Environment.
  - If your virtual network doesn't have an available subnet, you need to create one. You may need to increase the address space of your virtual network to create a new subnet. For more information, see [Create a virtual network](../../virtual-network/quick-create-portal.md).
- The subnet must be able to communicate with the subnet your existing App Service Environment is in. Ensure there are no network security groups or other network configurations that would prevent communication between the subnets.
- The subnet must have a single delegation of `Microsoft.Web/hostingEnvironments`.
- The subnet must have enough available IP addresses to support your new App Service Environment v3. The number of IP addresses needed depends on the number of instances you want to use for your new App Service Environment v3. For more information, see [App Service Environment v3 networking](networking.md#addresses).
- The subnet must not have any locks applied to it. If there are locks, they must be removed before migration. The locks can be readded if needed once migration is complete. For more information on locks and lock inheritance, see [Lock your resources to protect your infrastructure](../../azure-resource-manager/management/lock-resources.md).

### Generate IP addresses for your new App Service Environment v3

The platform creates the [the new outbound IP addresses](networking.md#addresses). While these IPs are getting created, activity with your existing App Service Environment isn't interrupted, however, you can't scale or make changes to your existing environment. This process takes about 15 minutes to complete.

When completed, you'll be given the new outbound IPs that your future App Service Environment v3 uses. These new IPs have no effect on your existing environment. The IPs used by your existing environment continue to be used up until you redirect customer traffic and complete the migration in the final step.

You receive the new inbound IP address once migration is complete but before you make the [DNS change to redirect customer traffic to your new App Service Environment v3](#redirect-customer-traffic-and-complete-migration). You don't get the inbound IP at this point in the process because the inbound IP is dependent on the subnet you select for the new environment. You have a chance to update any resources that are dependent on the new inbound IP before you redirect traffic to your new App Service Environment v3.

This step is also where you decide if you want to enable zone redundancy for your new App Service Environment v3. Zone redundancy can be enabled as long as your App Service Environment v3 is [in a region that supports zone redundancy](./overview.md#regions).

### Update dependent resources with new IPs

The new outbound IPs will be created and given to you before you start the actual migration. The new default outbound to the internet public addresses are given so you can adjust any external firewalls, DNS routing, network security groups, and any other resources that rely on these IPs before completing the migration. **It's your responsibility to update any and all resources that will be impacted by the IP address change associated with the new App Service Environment v3. Don't move on to the next step until you've made all required updates.** This step is also a good time to review the [inbound and outbound network](networking.md#ports-and-network-restrictions) dependency changes when moving to App Service Environment v3 including the port change for the Azure Load Balancer, which now uses port 80.

### Delegate your App Service Environment subnet

App Service Environment v3 requires the subnet it's in to have a single delegation of `Microsoft.Web/hostingEnvironments`. Migration can't succeed if the App Service Environment's subnet isn't delegated or it's delegated to a different resource. Ensure that the subnet you've selected for your new App Service Environment v3 has a single delegation of `Microsoft.Web/hostingEnvironments`.

### Acknowledge instance size changes

Your App Service plans are created with the corresponding Isolated v2 SKU as part of the migration. For example, I2 plans correspond with I2v2. Your apps may be over-provisioned after the migration since the Isolated v2 tier has more memory and CPU per corresponding instance size. You have the opportunity to scale your environment as needed once migration is complete. For more information, review the [SKU details](https://azure.microsoft.com/pricing/details/app-service/windows/).

### Ensure there are no locks on your resources

Virtual network locks block platform operations during migration. If your virtual network has locks, you need to remove them before migrating. The locks can be readded if needed once migration is complete. Locks can exist at three different scopes: subscription, resource group, and resource. When you apply a lock at a parent scope, all resources within that scope inherit the same lock. If you have locks applied at the subscription, resource group, or resource scope, they need to be removed before the migration. For more information on locks and lock inheritance, see [Lock your resources to protect your infrastructure](../../azure-resource-manager/management/lock-resources.md).

### Ensure there are no Azure Policies blocking migration

Azure Policy can be used to deny resource creation and modification to certain principals. If you have a policy that blocks the creation of App Service Environments or the modification of subnets, you need to remove it before migrating. The policy can be readded if needed once migration is complete. For more information on Azure Policy, see [Azure Policy overview](../../governance/policy/overview.md).

### Add a custom domain suffix

If your existing App Service Environment uses a custom domain suffix, you can configure a custom domain suffix for your new App Service Environment v3. Custom domain suffix on App Service Environment v3 is implemented differently than on App Service Environment v2. You need to provide the custom domain name, managed identity, and certificate, which must be stored in Azure Key Vault. For more information on App Service Environment v3 custom domain suffix including requirements, step-by-step instructions, and best practices, see [Configure custom domain suffix for App Service Environment](./how-to-custom-domain-suffix.md). Configuring a custom domain suffix is optional. If your App Service Environment v2 has a custom domain suffix and you don't want to use it on your new App Service Environment v3, don't configure a custom domain suffix during the migration set-up. 

### Migrate to App Service Environment v3

After completing the previous steps, you should continue with migration as soon as possible.

There is no application downtime during the migration, but as in the IP generation step, you can't scale, modify your existing App Service Environment, or deploy apps to it during this process.

> [!IMPORTANT]
> Since scaling is blocked during the migration, you should scale your environment to the desired size before starting the migration. If you need to scale your environment after the migration, you can do so once the migration is complete.
>

Side by side migration requires a three to six hour service window for App Service Environment v2 to v3 migrations. During migration, scaling and environment configurations are blocked and the following events occur:

- The new App Service Environment v3 is created in the subnet you selected.
- Your new App Service plans are created in the new App Service Environment v3 with the corresponding Isolated v2 SKU.
- Your apps are created in the new App Service Environment v3.

When this step completes, your application traffic is still going to your old App Service Environment and the IPs that were assigned to it. However, you also now have a functioning App Service Environment v3 with all of your apps.

### Get the inbound IP address for your new App Service Environment v3 and update dependent resources

You get the new inbound IP address that you can use to set up new endpoints with services like [Traffic Manager](../../traffic-manager/traffic-manager-overview.md) or [Azure Front Door](../../frontdoor/front-door-overview.md). Don't move on to the next step until you account for this change. There will be downtime if you don't update dependent resources with the new inbound IP. **It's your responsibility to update any and all resources that will be impacted by the IP address change associated with the new App Service Environment v3. Don't move on to the next step until you've made all required updates.**

### Redirect customer traffic and complete migration

You need to redirect traffic to your new App Service Environment v3 and complete the migration. Before you do this, you should review your new App Service Environment v3 and perform any needed testing to validate that it's functioning as intended. You have the IPs associated with your App Service Environment v3 from the [IP generation step](#generate-ip-addresses-for-your-new-app-service-environment-v3). Once you're ready to redirect traffic, you can complete the final step of the migration. This step will update your DNS records to point to the new inbound IP address of your App Service Environment v3. Changes are effective immediately. This step shuts down your old App Service Environment and deletes it. Your new App Service Environment v3 is now your production environment.

> [!NOTE]
> Due to the conversion of App Service plans from Isolated to Isolated v2, your apps may be over-provisioned after the migration since the Isolated v2 tier has more memory and CPU per corresponding instance size. You'll have the opportunity to [scale your environment](../manage-scale-up.md) as needed once migration is complete. For more information, review the [SKU details](https://azure.microsoft.com/pricing/details/app-service/windows/).
>

If you discover any issues with your new App Service Environment v3, you have the option to revert all changes and return to your old App Service Environment v2. The revert process takes 3 to 6 hours to complete. There is no downtime associated with this process. Once the revert process completes, your old App Service Environment is back online and your new App Service Environment v3 is deleted. You can then attempt the migration again once you've resolved any issues.

## Pricing

There's no cost to migrate your App Service Environment. However, you'll be billed for both your App Service Environment v2 and your new App Service Environment v3 once you start the migration process. You stop being charged for your old App Service Environment v2 when you complete the final migration step where your DNS is updated and the old environment gets deleted. You should complete your validation as quickly as possible to prevent excess charges from accumulating. For more information about App Service Environment v3 pricing, see the [pricing details](overview.md#pricing).

When you migrate to App Service Environment v3 from previous versions, there are scenarios that you should consider that can potentially reduce your monthly cost. Consider [reservations](../../cost-management-billing/reservations/reservation-discount-app-service.md#how-reservation-discounts-apply-to-isolated-v2-instances) and [savings plans](../../cost-management-billing/savings-plan/savings-plan-compute-overview.md) to further reduce your costs. For information on cost saving opportunities, see [Cost saving opportunities after upgrading to App Service Environment v3](upgrade-to-asev3.md#cost-saving-opportunities-after-upgrading-to-app-service-environment-v3).

### Scale down your App Service plans

The App Service plan SKUs available for App Service Environment v3 run on the Isolated v2 (Iv2) tier. The number of cores and amount of RAM are effectively doubled per corresponding tier compared the Isolated tier. When you migrate, your App Service plans are converted to the corresponding tier. For example, your I2 instances are converted to I2v2. While I2 has two cores and 7-GB RAM, I2v2 has four cores and 16-GB RAM. If you expect your capacity requirements to stay the same, you're over-provisioned and paying for compute and memory you're not using. For this scenario, you can scale down your I2v2 instance to I1v2 and end up with a similar number of cores and RAM that you had previously.

## Frequently asked questions

- **What if migrating my App Service Environment is not currently supported?**  
  You can't migrate using the side by side migration feature at this time. If you have an unsupported environment and want to migrate immediately, see the [manual migration options](migration-alternatives.md).
- **How do I choose which migration option is right for me?**  
  Review the [migration path decision tree](upgrade-to-asev3.md#migration-path-decision-tree) to decide which option is best for your use case.
- **How do I know if I should use the side by side migration feature?**  
  The side by side migration feature is best for customers who want to migrate to App Service Environment v3 but can't support application downtime. Since a new subnet is used for your new environment, there are networking considerations to be aware of, including new IPs. If you can support downtime, see the [in-place migration feature](migrate.md), which will result in minimal configuration changes, or the [manual migration options](migration-alternatives.md). The in-place migration feature creates your App Service Environment v3 in the same subnet as your existing environment and uses the same networking infrastructure. You may have to account for the inbound and outbound IP address changes if you have any dependencies on these specific IPs.
- **Will I experience downtime during the migration?**  
  No, there's no downtime during the side by side migration process. Your apps continue to run on your existing App Service Environment until you complete the final step of the migration where DNS changes are effected immediately. Once you complete the final step, your old App Service Environment is shut down and deleted. Your new App Service Environment v3 is now your production environment.
- **Will I need to do anything to my apps after the migration to get them running on the new App Service Environment?**  
  No, all of your apps running on the old environment are automatically migrated to the new environment and run like before. No user input is needed.
- **What if my App Service Environment has a custom domain suffix?**  
  The side by side migration feature supports this [migration scenario](#supported-scenarios).
- **What if my App Service Environment is zone pinned?**  
  The side by side migration feature supports this [migration scenario](#supported-scenarios). Zone pinning is not a feature on App Service Environment v3. You can enable zone redundancy once migration completes.
- **What if my App Service Environment has IP SSL addresses?**
  IP SSL isn't supported on App Service Environment v3. You must remove all IP SSL bindings before migrating using the migration feature or one of the manual options. If you intend to use the side by side migration feature, once you remove all IP SSL bindings, you'll pass that validation check and can proceed with the automated migration.  
- **What properties of my App Service Environment will change?**  
  You're on App Service Environment v3 so be sure to review the [features and feature differences](overview.md#feature-differences) compared to previous versions. Both your inbound and outbound IPs change when using the side by side migration feature. Note for ELB App Service Environment, previously there was a single IP for both inbound and outbound. For App Service Environment v3, they're separate. For more information, see [App Service Environment v3 networking](networking.md#addresses). For a full comparison of the App Service Environment versions, see [App Service Environment version comparison](version-comparison.md).
- **What happens if migration fails or there is an unexpected issue during the migration?**  
  If there's an unexpected issue, support teams are on hand. It's recommended to migrate dev environments before touching any production environments to learn about the migration process and see how it impacts your workloads. With the side by side migration feature, you have the option to revert all changes if there's any issues.
- **What happens to my old App Service Environment?**  
  If you decide to migrate an App Service Environment using the side by side migration feature, your old environment is used up until the final step in the migration process. Once you complete the final step, the old environment as well as all of the apps hosted on it get shut down and deleted. Your old environment is no longer accessible. A rollback to the old environment at this point isn't possible.
- **What will happen to my App Service Environment v1/v2 resources after 31 August 2024?**  
  After 31 August 2024, if you haven't migrated to App Service Environment v3, your App Service Environment v1/v2s and the apps deployed in them will no longer be available. App Service Environment v1/v2 is hosted on App Service scale units running on [Cloud Services (classic)](../../cloud-services/cloud-services-choose-me.md) architecture that will be [retired on 31 August 2024](https://azure.microsoft.com/updates/cloud-services-retirement-announcement/). Because of this, [App Service Environment v1/v2 will no longer be available after that date](https://azure.microsoft.com/updates/app-service-environment-v1-and-v2-retirement-announcement/). Migrate to App Service Environment v3 to keep your apps running or save or back up any resources or data that you need to maintain.

## Next steps

> [!div class="nextstepaction"]
> [Migrate your App Service Environment to App Service Environment v3 using the side by side migration feature](how-to-side-by-side-migrate.md)

> [!div class="nextstepaction"]
> [App Service Environment v3 Networking](networking.md)

> [!div class="nextstepaction"]
> [Using an App Service Environment v3](using.md)

> [!div class="nextstepaction"]
> [Custom domain suffix](./how-to-custom-domain-suffix.md)

<!-- TODO: add migration statuses

The following statuses are available during the migration process:

|Status      |Description  |
|------------|-------------|
|Validating and preparing the migration.     |The platform is validating migration support and performing necessary checks.     |
|Deploying App Service Environment v3 infrastructure.    |Your new App Service Environment v3 infrastructure is provisioning.          |
|Waiting for infrastructure to complete.  |The platform is validating your new infrastructure and performing necessary checks.         |
|Setting up networking. Migration downtime period has started. Applications are not accessible.  |The platform is deleting your old infrastructure and moving all of your apps to your new App Service Environment v3. Your apps are down and aren't accepting traffic.         |
|Running post migration validations.  |The platform is performing necessary checks to ensure the migration succeeded.         |
|Finalizing migration.  |The platform is finalizing the migration.         | -->