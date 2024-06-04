---
title: Migrate to App Service Environment v3 by using the side-by-side migration feature
description: Learn how to migrate your App Service Environment v2 to App Service Environment v3 by using the side-by-side migration feature.
author: seligj95
ms.topic: tutorial
ms.custom: devx-track-azurecli, references_regions
ms.date: 5/23/2024
ms.author: jordanselig
---
# Migration to App Service Environment v3 using the side-by-side migration feature

> [!NOTE]
> The migration feature described in this article is used for side-by-side (different subnet) automated migration of App Service Environment v2 to App Service Environment v3. 
>
> If you're looking for information on the in-place migration feature, see [Migrate to App Service Environment v3 by using the in-place migration feature](migrate.md). If you're looking for information on manual migration options, see [Manual migration options](migration-alternatives.md). For help deciding which migration option is right for you, see [Migration path decision tree](upgrade-to-asev3.md#migration-path-decision-tree). For more information on App Service Environment v3, see [App Service Environment v3 overview](overview.md).
>

App Service can automate migration of your App Service Environment v1 and v2 to an [App Service Environment v3](overview.md). There are different migration options. Review the [migration path decision tree](upgrade-to-asev3.md#migration-path-decision-tree) to decide which option is best for your use case. App Service Environment v3 provides [advantages and feature differences](overview.md#feature-differences) over earlier versions. Make sure to review the [supported features](overview.md#feature-differences) of App Service Environment v3 before migrating to reduce the risk of an unexpected application issue. 

The side-by-side migration feature automates your migration to App Service Environment v3. The side-by-side migration feature creates a new App Service Environment v3 with all of your apps in a different subnet. Your existing App Service Environment isn't deleted until you initiate its deletion at the end of the migration process. Because of this process, there's a rollback option if you need to cancel your migration. This migration option is best for customers who want to migrate to App Service Environment v3 with zero downtime and can support using a different subnet for their new environment. If you need to use the same subnet and can support about one hour of application downtime, see the [in-place migration feature](migrate.md). For manual migration options that allow you to migrate at your own pace, see [manual migration options](migration-alternatives.md).

> [!IMPORTANT]
> It is recommended to use this feature for dev environments first before migrating any production environments to ensure there are no unexpected issues. Please provide any feedback related to this article or the feature using the buttons at the bottom of the page.
>

## Supported scenarios

At this time, the side-by-side migration feature doesn't support migrations to App Service Environment v3 in the following regions:

### Azure Public

- UAE Central

### Azure Government

- US DoD Central
- US DoD East
- US Gov Arizona
- US Gov Texas
- US Gov Virginia

### Microsoft Azure operated by 21Vianet

- China East 2
- China North 2

The following App Service Environment configurations can be migrated using the side-by-side migration feature. The table gives the App Service Environment v3 configuration when using the side-by-side migration feature based on your existing App Service Environment.

|Configuration                                                                                      |App Service Environment v3 Configuration                   |
|---------------------------------------------------------------------------------------------------|-----------------------------------------------------------|
|[Internal Load Balancer (ILB)](create-ilb-ase.md) App Service Environment v2                       |ILB App Service Environment v3                             |
|[External (ELB/internet facing with public IP)](create-external-ase.md) App Service Environment v2 |ELB App Service Environment v3                             |
|ILB App Service Environment v2 with a custom domain suffix                                         |ILB App Service Environment v3 with a custom domain suffix |

App Service Environment v3 can be deployed as [zone redundant](../../availability-zones/migrate-app-service-environment.md). Zone redundancy can be enabled as long as your App Service Environment v3 is [in a region that supports zone redundancy](./overview.md#regions).

If you want your new App Service Environment v3 to use a custom domain suffix and you aren't using one currently, custom domain suffix can be configured at any time once migration is complete. For more information, see [Configure custom domain suffix for App Service Environment](./how-to-custom-domain-suffix.md). If your existing environment has a custom domain suffix and you no longer want to use it, you must configure a custom domain suffix for the migration. You can remove the custom domain suffix after migration is complete.

## Side-by-side migration feature limitations

The following are limitations when using the side-by-side migration feature:

- Your new App Service Environment v3 is in a different subnet but the same virtual network as your existing environment.
- You can't change the region your App Service Environment is located in.
- ELB App Service Environment can’t be migrated to ILB App Service Environment v3 and vice versa.
- If your existing App Service Environment uses a custom domain suffix, you have to configure custom domain suffix for your App Service Environment v3 during the migration process.
  - If you no longer want to use a custom domain suffix, you can remove it once the migration is complete.
- The side-by-side migration feature is only available using the CLI or via REST API. The feature isn't available in the Azure portal.

App Service Environment v3 doesn't support the following features that you might be using with your current App Service Environment v2.

- Configuring an IP-based TLS/SSL binding with your apps.
- App Service Environment v3 doesn't fall back to Azure DNS if your configured custom DNS servers in the virtual network aren't able to resolve a given name. If this behavior is required, ensure that you have a forwarder to a public DNS or include Azure DNS in the list of custom DNS servers.

The side-by-side migration feature doesn't support the following scenarios. See the [manual migration options](migration-alternatives.md) if your App Service Environment falls into one of these categories.

- App Service Environment v1
  - You can find the version of your App Service Environment by navigating to your App Service Environment in the [Azure portal](https://portal.azure.com) and selecting **Configuration** under **Settings** on the left-hand side. You can also use [Azure Resource Explorer](https://resources.azure.com/) and review the value of the `kind` property for your App Service Environment.
  - If you have an App Service Environment v1, you can migrate using the [in-place migration feature](migrate.md) or one of the [manual migration options](migration-alternatives.md).
- ELB App Service Environment v2 with IP SSL addresses
- [Zone pinned](zone-redundancy.md) App Service Environment v2
 
The App Service platform reviews your App Service Environment to confirm side-by-side migration support. If your scenario doesn't pass all validation checks, you can't migrate at this time using the side-by-side migration feature. If your environment is in an unhealthy or suspended state, you can't migrate until you make the needed updates.

> [!NOTE]
> App Service Environment v3 doesn't support IP SSL. If you use IP SSL, you must remove all IP SSL bindings before migrating to App Service Environment v3. The migration feature will support your environment once all IP SSL bindings are removed.
>

### Troubleshooting

If your App Service Environment doesn't pass the validation checks or you try to perform a migration step in the incorrect order, you see one of the following error messages:

|Error message      |Description  |Recommendation  |
|---------|---------|----------|
|Migrate can only be called on an ASE in ARM VNET and this ASE is in Classic VNET.     |App Service Environments in Classic virtual networks can't migrate using the side-by-side migration feature.       |Migrate using one of the [manual migration options](migration-alternatives.md).  |
|ASEv3 Migration is not yet ready.     |The underlying infrastructure isn't ready to support App Service Environment v3.    |Migrate using one of the [manual migration options](migration-alternatives.md) if you want to migrate immediately. Otherwise, wait for the side-by-side migration feature to be available in your region.  |
|Cannot enable zone redundancy for this ASE.   |The region the App Service Environment is in doesn't support zone redundancy.   |If you need to enable zone redundancy, use one of the manual migration options to migrate to a [region that supports zone redundancy](overview.md#regions).   |
|Migrate cannot be called on this custom DNS suffix ASE at this time.     |Custom domain suffix migration is blocked.   |Open a support case to engage support to resolve your issue.     |
|Zone redundant ASE migration cannot be called at this time.   |Zone redundant App Service Environment migration is blocked.    |Open a support case to engage support to resolve your issue.    |
|Migrate cannot be called on ASEv2 that is zone-pinned.    |App Service Environment v2 that's zone pinned can't be migrated using the side-by-side migration feature at this time.    |Migrate using one of the [manual migration options](migration-alternatives.md) if you want to migrate immediately.  |
|Existing revert migration operation ongoing, please try again later.    |A previous migration attempt is being reverted.    |Wait until the revert that's in progress completes before attempting to start migration again.     |
|Properties.VirtualNetwork.Id should contain the subnet resource ID.    |The error appears if you attempt to migrate without providing a new subnet for the placement of your App Service Environment v3.    |Ensure you follow the guidance and complete the step to identify the subnet you'll use for your App Service Environment v3.     |
|Unable to move to `<requested phase>` from the current phase `<previous phase>` of No Downtime Migration.    |This error appears if you attempt to do a migration step in the incorrect order.    |Ensure you follow the migration steps in order.     |
|Failed to start revert operation on ASE in hybrid state, please try again later.    |This error appears if you try to revert the migration but something goes wrong. This error doesn't affect either your old or your new environment.     |Open a support case to engage support to resolve your issue.     |
|This ASE cannot be migrated without downtime.    |This error appears if you try to use the side-by-side migration feature on an App Service Environment v1.   |The side-by-side migration feature doesn't support App Service Environment v1. Migrate using the [in-place migration feature](migrate.md) or one of the [manual migration options](migration-alternatives.md).     |
|Migrate is not available for this subscription.    |Support needs to be engaged for migrating this App Service Environment.|Open a support case to engage support to resolve your issue.|
|Zone redundant migration cannot be called since the IP addresses created during pre-migrate are not zone redundant.    |This error appears if you attempt a zone redundant migration but didn't create zone redundant IPs during the IP generation step.    |Open a support case to engage support if you need to enable zone redundancy. Otherwise, you can migrate without enabling zone redundancy.     |
|Migrate cannot be called if IP SSL is enabled on any of the sites.    |App Service Environments that have sites with IP SSL enabled can't be migrated using the side-by-side migration feature. |Remove the IP SSL from all of your apps in the App Service Environment to enable the migration feature. |
|Cannot migrate within the same subnet.  |The error appears if you specify the same subnet that your current environment is in for placement of your App Service Environment v3.     |You must specify a different subnet for your App Service Environment v3. If you need to use the same subnet, migrate using the [in-place migration feature](migrate.md).     |
|Subscription has too many App Service Environments. Please remove some before trying to create more.|The App Service Environment [quota for your subscription](../../azure-resource-manager/management/azure-subscription-service-limits.md#app-service-limits) is met. |Remove unneeded environments or contact support to review your options.  |
|Migrate cannot be called on this ASE until the active upgrade has finished.    |App Service Environments can't be migrated during platform upgrades. You can set your [upgrade preference](how-to-upgrade-preference.md) from the Azure portal. In some cases, an upgrade is initiated when visiting the migration page if your App Service Environment isn't on the current build.  |Wait until the upgrade finishes and then migrate.   |
|App Service Environment management operation in progress.    |Your App Service Environment is undergoing a management operation. These operations can include activities such as deployments or upgrades. Migration is blocked until these operations are complete.   |You can migrate once these operations are complete.  |
|Your InteralLoadBalancingMode is not currently supported.|App Service Environments that have InternalLoadBalancingMode set to certain values can't be migrated using the migration feature at this time. The Microsoft team must manually change the InternalLoadBalancingMode. |Open a support case to engage support to resolve your issue. Request an update to the InternalLoadBalancingMode. |
|Migration is invalid. Your ASE needs to be upgraded to the latest build to ensure successful migration. We will upgrade your ASE now. Please try migrating again in few hours once platform upgrade has finished. |Your App Service Environment isn't on the minimum build required for migration. An upgrade is started. Your App Service Environment isn't impacted, but you can't scale or make changes to your App Service Environment while the upgrade is in progress. You can't migrate until the upgrade finishes. |Wait until the upgrade finishes and then migrate. |
|Full migration cannot be called before IP addresses are generated. |This error appears if you attempt to migrate before finishing the premigration steps. |Ensure you complete all premigration steps before you attempt to migrate. See the [step-by-step guide for migrating](#use-the-side-by-side-migration-feature).  |
|Full migration cannot be called on Ase with custom dns suffix set but without an AseV3 Custom Dns Suffix Configuration configured. |Your existing App Service Environment uses a custom domain suffix. You have to configure custom domain suffix for your App Service Environment v3 during the migration process. |Configure a [custom domain suffix](./how-to-custom-domain-suffix.md). If you no longer want to use a custom domain suffix, you can remove it once the migration is complete. |

## Overview of the migration process using the side-by-side migration feature

Side-by-side migration consists of a series of steps that must be followed in order. Key points are given for a subset of the steps. It's important to understand what happens during these steps and how your environment and apps are impacted. After reviewing the following information and when you're ready to migrate, follow the [step-by-step guide](#use-the-side-by-side-migration-feature).

### Validate that migration is supported using the side-by-side migration feature for your App Service Environment

The platform validates that your App Service Environment can be migrated using the side-by-side migration feature. If your App Service Environment doesn't pass all validation checks, you can't migrate at this time using the side-by-side migration feature. See the [troubleshooting](#troubleshooting) section for details of the possible causes of validation failure. If your environment is in an unhealthy or suspended state, you can't migrate until you make the needed updates. If you can't migrate using the side-by-side migration feature, see the [manual migration options](migration-alternatives.md).

The validation also checks if your App Service Environment is on the minimum build required for migration. This build might be newer than the standard build that is deployed with the [routine platform upgrade/maintenance cycle](how-to-upgrade-preference.md). The minimum build is updated periodically to ensure the latest bug fixes and improvements are available. If your App Service Environment isn't on the minimum build, you need to start the upgrade yourself. This upgrade is a standard process where your App Service Environment isn't impacted, but you can't scale or make changes to your App Service Environment while the upgrade is in progress. You can't migrate until the upgrade finishes. Upgrades can take 8-12 hours to complete or longer depending on the size of your environment. If you plan a specific time window for your migration, you should run the validation check 24-48 hours before your planned migration time to ensure you have time for an upgrade if one is needed.

### Select and prepare the subnet for your new App Service Environment v3

The platform creates your new App Service Environment v3 in a different subnet than your existing App Service Environment. You need to select a subnet that meets the following requirements:

- The subnet must be in the same virtual network, and therefore region, as your existing App Service Environment.
  - If your virtual network doesn't have an available subnet, you need to create one. You might need to increase the address space of your virtual network to create a new subnet. For more information, see [Create a virtual network](../../virtual-network/quick-create-portal.md).
- The subnet must be able to communicate with the subnet your existing App Service Environment is in. Ensure there aren't network security groups or other network configurations that would prevent communication between the subnets.
- The subnet must have a single delegation of `Microsoft.Web/hostingEnvironments`.
- The subnet must have enough available IP addresses to support your new App Service Environment v3. The number of IP addresses needed depends on the number of instances you want to use for your new App Service Environment v3. For more information, see [App Service Environment v3 networking](networking.md#addresses).
- The subnet must not have any locks applied to it. If there are locks, they must be removed before migration. The locks can be readded if needed once migration is complete. For more information on locks and lock inheritance, see [Lock your resources to protect your infrastructure](../../azure-resource-manager/management/lock-resources.md).
- There must not be any Azure Policies blocking migration or related actions. If there are policies that block the creation of App Service Environments or the modification of subnets, they must be removed before migration. The policies can be readded if needed once migration is complete. For more information on Azure Policy, see [Azure Policy overview](../../governance/policy/overview.md).

### Generate outbound IP addresses for your new App Service Environment v3

The platform creates the [the new outbound IP addresses](networking.md#addresses). While these IPs are getting created, activity with your existing App Service Environment isn't interrupted, however, you can't scale or make changes to your existing environment. This process takes about 15 minutes to complete.

When completed, the new outbound IPs that your future App Service Environment v3 uses are created. These new IPs have no effect on your existing environment.

You receive the new inbound IP address once migration is complete but before you make the [DNS change to redirect customer traffic to your new App Service Environment v3](#redirect-customer-traffic-validate-your-app-service-environment-v3-and-complete-migration). You don't get the inbound IP at this point in the process because there are dependencies on App Service Environment v3 resources that get created during the migration step. You have a chance to update any resources that are dependent on the new inbound IP before you redirect traffic to your new App Service Environment v3.

This step is also where you decide if you want to enable zone redundancy for your new App Service Environment v3. Zone redundancy can be enabled as long as your App Service Environment v3 is [in a region that supports zone redundancy](./overview.md#regions).

### Update dependent resources with new outbound IPs

The new outbound IPs are created and given to you before you start the actual migration. The new default outbound to the internet public addresses are given so you can adjust any external firewalls, DNS routing, network security groups, and any other resources that rely on these IPs before completing the migration. **It's your responsibility to update any and all resources that will be impacted by the IP address change associated with the new App Service Environment v3. Don't move on to the next step until you've made all required updates.** You might experience downtime during and after the migration step if you have dependencies on the outbound IPs and fail to make all necessary updates. This is because once the migration starts, even though traffic still goes to your App Service Environment v2 front ends, your underlying compute is your new App Service Environment v3 in the new subnet. 

This step is also a good time to review the [inbound and outbound network](networking.md#ports-and-network-restrictions) dependency changes when moving to App Service Environment v3 including the port change for the Azure Load Balancer health probe, which now uses port 80.

### Delegate your App Service Environment subnet

App Service Environment v3 requires the subnet it's in to have a single delegation of `Microsoft.Web/hostingEnvironments`. Migration can't succeed if the App Service Environment's subnet isn't delegated or you delegate it to a different resource. Ensure that the subnet you select for your new App Service Environment v3 has a single delegation of `Microsoft.Web/hostingEnvironments`.

### Acknowledge instance size changes

Your App Service plans are created with the corresponding Isolated v2 SKU as part of the migration. For example, I2 plans correspond with I2v2. Your apps might be over-provisioned after the migration since the Isolated v2 tier has more memory and CPU per corresponding instance size. You have the opportunity to scale your environment as needed once migration is complete. For more information, review the [SKU details](https://azure.microsoft.com/pricing/details/app-service/windows/).

### Ensure there are no locks on your resources

Virtual network locks block platform operations during migration. If your virtual network has locks, you need to remove them before migrating. The locks can be readded if needed once migration is complete. Locks can exist at three different scopes: subscription, resource group, and resource. When you apply a lock at a parent scope, all resources within that scope inherit the same lock. If you have locks applied at the subscription, resource group, or resource scope, they need to be removed before the migration. For more information on locks and lock inheritance, see [Lock your resources to protect your infrastructure](../../azure-resource-manager/management/lock-resources.md).

### Ensure there are no Azure Policies blocking migration

Azure Policy can be used to deny resource creation and modification to certain principals. If you have a policy that blocks the creation of App Service Environments or the modification of subnets, you need to remove it before migrating. The policy can be readded if needed once migration is complete. For more information on Azure Policy, see [Azure Policy overview](../../governance/policy/overview.md).

### Add a custom domain suffix (optional)

If your existing App Service Environment uses a custom domain suffix, you must configure a custom domain suffix for your new App Service Environment v3. Custom domain suffix on App Service Environment v3 is implemented differently than on App Service Environment v2. You need to provide the custom domain name, managed identity, and certificate, which must be stored in Azure Key Vault. For more information on App Service Environment v3 custom domain suffix including requirements, step-by-step instructions, and best practices, see [Configure custom domain suffix for App Service Environment](./how-to-custom-domain-suffix.md). If your App Service Environment v2 has a custom domain suffix, you must configure a custom domain suffix for your new environment even if you no longer want to use it. Once migration is complete, you can remove the custom domain suffix configuration if needed.

If your migration includes a custom domain suffix, for App Service Environment v3, the custom domain isn't displayed in the **Essentials** section of the **Overview** page of the portal as it is for App Service Environment v1/v2. Instead, for App Service Environment v3, go to the **Custom domain suffix** page where you can confirm your custom domain suffix is configured correctly. Also, on App Service Environment v2, if you have a custom domain suffix, the default host name includes your custom domain suffix and is in the form *APP-NAME.internal.contoso.com*. On App Service Environment v3, the default host name always uses the default domain suffix and is in the form *APP-NAME.ASE-NAME.appserviceenvironment.net*. This difference is because App Service Environment v3 keeps the default domain suffix when you add a custom domain suffix. With App Service Environment v2, there's only a single domain suffix.

### Migrate to App Service Environment v3

After completing the previous steps, you should continue with migration as soon as possible.

There's no application downtime during the migration, but as in the IP generation step, you can't scale, modify your existing App Service Environment, or deploy apps to it during this process.

> [!IMPORTANT]
> Since scaling is blocked during the migration, you should scale your environment to the desired size before starting the migration.
>

Side-by-side migration requires a three to six hour service window for App Service Environment v2 to v3 migrations. During migration, scaling and environment configurations are blocked and the following events occur:

- The new App Service Environment v3 is created in the subnet you selected.
- Your new App Service plans are created in the new App Service Environment v3 with the corresponding Isolated v2 tier.
- Your apps are created in the new App Service Environment v3.
- The underlying compute/workers for your apps is moved to the new App Service Environment v3, which means your apps are now running on your App Service Environment v3. However, your App Service Environment v2 front ends are by default still running and serving traffic. Your old inbound IP address remains in use, but your new outbound IPs are in use. In addition, your new App Service Environment v3 front ends are created and ready to serve traffic.
    - For ILB App Service Environments, your App Service Environment v3 front ends aren't used until you update your private DNS zones with the new inbound IP address. 
    - For ELB App Service Environments, the migration process doesn't redirect traffic to the App Service Environment v3 front ends until you complete the final step of the migration.

When this step completes, your application traffic is still going to your old App Service Environment v2 front ends and the inbound IP that was assigned to it. However, your apps are actually running on workers in your new App Service Environment v3.

### Get the inbound IP address for your new App Service Environment v3 and update dependent resources

The new inbound IP address is given so that you can set up new endpoints with services like [Traffic Manager](../../traffic-manager/traffic-manager-overview.md) or [Azure Front Door](../../frontdoor/front-door-overview.md) and update any of your private DNS zones. Don't move on to the next step until you make these changes. There's downtime if you don't update dependent resources with the new inbound IP. **It's your responsibility to update any and all resources that are impacted by the IP address change associated with the new App Service Environment v3. Don't move on to the next step until you've made all required updates.**

### Redirect customer traffic, validate your App Service Environment v3, and complete migration

The final step is to redirect traffic to your new App Service Environment v3 front ends and complete the migration. Before you do this step, you should review your new App Service Environment v3 and perform any needed testing to validate that it's functioning as intended. By default, traffic goes to your App Service Environment v2 front ends. If you're using an ILB App Service Environment v3, you can test your App Service Environment v3 front ends by updating your private DNS zone with the new inbound IP address. If you're using an ELB App Service Environment v3, the process for testing is dependent on your specific network configuration. One simple method to test for ELB environments is to update your hosts file to use your new App Service Environment v3 inbound IP address. If you have custom domains assigned to your individual apps, you can alternatively update their DNS to point to the new inbound IP. Testing this change allows you to fully validate your App Service Environment v3 before initiating the final step of the migration where your old App Service Environment is deleted.

Once you're ready to redirect traffic, you can complete the final step of the migration. This step updates internal/platform DNS records to point to the load balancer IP address of your new App Service Environment v3 and the front ends that were created during the migration. Changes are effective within a couple minutes. It is your responsibility to update your DNS records to point to the new inbound IP address. If you run into issues or application downtime, check your cache and TTL settings. This step also shuts down your old App Service Environment and deletes it. Your new App Service Environment v3 is now your production environment.

> [!IMPORTANT]
> The platform guarantees a zero-downtime migration experience. However, your DNS settings might cause downtime during the DNS change step. This can be due to issues related to TTL and cache settings as traffic might still be directed to your old App Service Environment after the DNS change. You should review your DNS settings and ensure that you have a low TTL and that your DNS provider supports fast propagation. If you have a high TTL, you might experience downtime during the DNS change step.
>

> [!NOTE]
> You have 14 days to complete this step. If you don't complete this step in 14 days, your migration is automatically reverted back to an App Service Environment v2. If you need more than 14 days to complete this step, contact support.
>

If you discover any issues with your new App Service Environment v3, don't run the command to redirect customer traffic. This command also initiates the deletion of your App Service Environment v2. If you find an issue, you can revert all changes and return to your old App Service Environment v2. The revert process takes 3 to 6 hours to complete. Once the revert process completes, your old App Service Environment is back online and your new App Service Environment v3 is deleted. You can then attempt the migration again once you resolve any issues.

## Use the side-by-side migration feature

### Prerequisites

Ensure that you understand how migrating to App Service Environment v3 affects your applications. Review the [migration process](#overview-of-the-migration-process-using-the-side-by-side-migration-feature) in its entirety to understand the process timeline and where and when you need to get involved. Also review the [FAQs](#frequently-asked-questions), which can answer some of your questions.

Ensure that there are no locks on your virtual network, resource groups, resources, or subscription. Locks block platform operations during migration.

Ensure that no Azure policies are blocking actions that are required for the migration, including subnet modifications and Azure App Service resource creations. Policies that block resource modifications and creations can cause migration to get stuck or fail.

Since your App Service Environment v3 is in a different subnet in your virtual network, you need to ensure that you have an available subnet in your virtual network that meets the [subnet requirements for App Service Environment v3](./networking.md#subnet-requirements). The subnet you select must also be able to communicate with the subnet that your existing App Service Environment is in. Ensure there's nothing blocking communication between the two subnets. If you don't have an available subnet, you need to create one before migrating. Creating a new subnet might involve increasing your virtual network address space. For more information, see [Create a virtual network and subnet](../../virtual-network/manage-virtual-network.yml).

Since scaling is blocked during the migration, you should scale your environment to the desired size before starting the migration. If you need to scale your environment after the migration, you can do so once the migration is complete.

Follow the steps described here in order and as written, because you're making Azure REST API calls. We recommend that you use the Azure CLI to make these API calls. For information about other methods, see [Azure REST API reference](/rest/api/azure/).

For this guide, [install the Azure CLI](/cli/azure/install-azure-cli) or use [Azure Cloud Shell](https://shell.azure.com/) and use a Bash shell. 

> [!NOTE]
> We recommend that you use a Bash shell to run the commands given in this guide. The commands might not be compatible with PowerShell conventions and escape characters.
>

> [!IMPORTANT]
> During the migration, the Azure portal might show incorrect information about your App Service Environment and your apps. Don't go to the Migration experience in the Azure portal since the side-by-side migration feature isn't available there. We recommend that you use the Azure CLI to check the status of your migration. If you have any questions about the status of your migration or your apps, contact support.
> 

### 1. Select the subnet for your new App Service Environment v3

Select a subnet in your App Service Environment v3 that meets the [subnet requirements for App Service Environment v3](./networking.md#subnet-requirements). Note the name of the subnet you select. This subnet must be different than the subnet your existing App Service Environment is in.

### 2. Get your App Service Environment ID

Run the following commands to get your App Service Environment ID and store it as an environment variable. Replace the placeholders for the name and resource groups with your values for the App Service Environment that you want to migrate. `ASE_RG` and `VNET_RG` are the same if your virtual network and App Service Environment are in the same resource group.

```azurecli
ASE_NAME=<Your-App-Service-Environment-name>
ASE_RG=<Your-ASE-Resource-Group>
VNET_RG=<Your-VNet-Resource-Group>
ASE_ID=$(az appservice ase show --name $ASE_NAME --resource-group $ASE_RG --query id --output tsv)
```

### 3. Validate migration is supported

The following command checks whether your App Service Environment is supported for migration. This command also validates that your App Service Environment is on the supported build version for migration. If your App Service Environment isn't on the supported build version, you need to start the upgrade yourself. For more information on the premigration upgrade, see [Validate that migration is supported using the side-by-side migration feature for your App Service Environment](#validate-that-migration-is-supported-using-the-side-by-side-migration-feature-for-your-app-service-environment).

```azurecli
az rest --method post --uri "${ASE_ID}/NoDowntimeMigrate?phase=Validation&api-version=2022-03-01"
```

If there are no errors, your migration is supported, and you can continue to the next step.

If you need to start an upgrade to upgrade your App Service Environment to the supported build version, which could take 8-12 hours or longer depending on the size of your environment, run the following command. Only run this command if you fail the validation step and you're instructed to upgrade your App Service Environment.

```azurecli
az rest --method post --uri "${ASE_ID}/NoDowntimeMigrate?phase=PreMigrationUpgrade&api-version=2022-03-01"
```

### 4. Generate outbound IP addresses for your new App Service Environment v3

Create a file called *zoneredundancy.json* with the following details for your region and zone redundancy selection.

```json
{
    "location":"<region>",    
    "Properties": {
        "zoneRedundant": "<true/false>"
    }
}
```

You can make your new App Service Environment v3 zone redundant if your existing environment is in a [region that supports zone redundancy](./overview.md#regions). Zone redundancy can be configured by setting the `zoneRedundant` property to `true`. Zone redundancy is an optional configuration. This configuration can only be set during the creation of your new App Service Environment v3 and can't be removed at a later time.

Run the following command to create new outbound IP addresses. This step takes about 15 minutes to complete. Don't scale or make changes to your existing App Service Environment during this time.

```azurecli
az rest --method post --uri "${ASE_ID}/NoDowntimeMigrate?phase=PreMigration&api-version=2022-03-01" --body @zoneredundancy.json
```

Run the following command to check the status of this step:

```azurecli
az rest --method get --uri "${ASE_ID}?api-version=2022-03-01" --query properties.status
```

If the step is in progress, you get a status of `Migrating`. After you get a status of `Ready`, run the following command to view your new outbound IPs. If you don't see the new IPs immediately, wait a few minutes and try again.

```azurecli
az rest --method get --uri "${ASE_ID}/configurations/networking?api-version=2022-03-01" --query properties.windowsOutboundIpAddresses
```

### 5. Update dependent resources with new outbound IPs

By using the new outbound IPs, update any of your resources or networking components to ensure that your new environment functions as intended after migration is started. It's your responsibility to make any necessary updates. The new outbound IPs are used once the App Service Environment v3 is created during the migration step.

### 6. Delegate your App Service Environment subnet

App Service Environment v3 requires the subnet it's in to have a single delegation of `Microsoft.Web/hostingEnvironments`. Previous versions didn't require this delegation. You need to confirm that your subnet is delegated properly and update the delegation (if necessary) before migrating. You can update the delegation either by running the following command or by going to the subnet in the [Azure portal](https://portal.azure.com).

```azurecli
az network vnet subnet update --resource-group $VNET_RG --name <subnet-name> --vnet-name <vnet-name> --delegations Microsoft.Web/hostingEnvironments
```

### 7. Confirm there are no locks on the virtual network

Virtual network locks block platform operations during migration. If your virtual network has locks, you need to remove them before migrating. If necessary, you can add back the locks after migration is complete.

Use the following command to check if your virtual network has any locks:

```azurecli
az lock list --resource-group $VNET_RG --resource <vnet-name> --resource-type Microsoft.Network/virtualNetworks
```

Delete any existing locks by using the following command:

```azurecli
az lock delete --resource-group $VNET_RG --name <lock-name> --resource <vnet-name> --resource-type Microsoft.Network/virtualNetworks
```

For related commands to check if your subscription or resource group has locks, see the [Azure CLI reference for locks](../../azure-resource-manager/management/lock-resources.md#azure-cli).

### 8. Prepare your configurations

If your existing App Service Environment uses a custom domain suffix, you need to [configure one for your new App Service Environment v3 resource during the migration process](#add-a-custom-domain-suffix-optional). Migration fails if you don't configure a custom domain suffix and are using one currently. For more information on App Service Environment v3 custom domain suffixes, including requirements, step-by-step instructions, and best practices, see [Custom domain suffix for App Service Environments](./how-to-custom-domain-suffix.md).

> [!NOTE]
> If you're configuring a custom domain suffix, when you're adding the network permissions on your Azure key vault, be sure that your key vault allows access from your App Service Environment v3's new subnet. If you're accessing your key vault using a private endpoint, ensure you've configured private access correctly with the new subnet.
>

To set these configurations, including identifying the subnet you selected earlier, create another file called *parameters.json* with the following details based on your scenario. Be sure to use the new subnet that you selected for your new App Service Environment v3. Don't include the properties for a custom domain suffix if this feature doesn't apply to your migration. Pay attention to the value of the `zoneRedundant` property and set it to the same value you used in the outbound IP generation step. **You must use the same value for zone redundancy that you used in the outbound IP generation step.**

If you're migrating without a custom domain suffix, use this code:

```json
{
    "Properties": {
        "VirtualNetwork": {
            "Id": "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Network/virtualNetworks/<virtual-network-name>/subnets/<subnet-name>"
        },
        "zoneRedundant": "<true/false>"
    }
}
```

If you're using a user assigned managed identity for your custom domain suffix configuration, use this code:

```json
{
    "Properties": {
        "VirtualNetwork": {
            "Id": "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Network/virtualNetworks/<virtual-network-name>/subnets/<subnet-name>"
        },
        "zoneRedundant": "<true/false>",
        "customDnsSuffixConfiguration": {
            "dnsSuffix": "internal.contoso.com",
            "certificateUrl": "https://contoso.vault.azure.net/secrets/myCertificate",
            "keyVaultReferenceIdentity": "/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/asev3-migration/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ase-managed-identity"
        }
    }
}
```

If you're using a system assigned managed identity for your custom domain suffix configuration, use this code:

```json
{
    "properties": {
        "VirtualNetwork": {
            "Id": "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Network/virtualNetworks/<virtual-network-name>/subnets/<subnet-name>"
        },
        "zoneRedundant": "<true/false>",
        "customDnsSuffixConfiguration": {
            "dnsSuffix": "internal.contoso.com",
            "certificateUrl": "https://contoso.vault.azure.net/secrets/myCertificate",
            "keyVaultReferenceIdentity": "SystemAssigned"
        }
    }
}
```

### 9. Migrate to App Service Environment v3 and check status

After you complete all of the preceding steps, you can start the migration. Make sure that you understand the [implications of migration](#migrate-to-app-service-environment-v3).

This step takes three to six hours complete. During that time, there's no application downtime. Scaling, deployments, and modifications to your existing App Service Environment are blocked during this step.

Run the following command to start the migration:

```azurecli
az rest --method post --uri "${ASE_ID}/NoDowntimeMigrate?phase=HybridDeployment&api-version=2022-03-01" --body @parameters.json
```

Run the following command to check the status of your migration:

```azurecli
az rest --method get --uri "${ASE_ID}?api-version=2022-03-01" --query properties.subStatus
```

After you get a status of `MigrationPendingDnsChange`, migration is done, and you have an App Service Environment v3 resource. Your apps are now running in your new environment and in your old environment.

Get the details of your new environment by running the following command:

```azurecli
az appservice ase show --name $ASE_NAME --resource-group $ASE_RG
```

> [!IMPORTANT]
> During the migration as well as during the `MigrationPendingDnsChange` step, the Azure portal shows incorrect information about your App Service Environment and your apps. Use the Azure CLI to check the status of your migration. If you have any questions about the status of your migration or your apps, contact support.
> 

> [!NOTE]
> If your migration includes a custom domain suffix, your custom domain suffix configuration might show as degraded once the migration is complete due to a known bug. Your App Service Environment should still function as expected. The degraded status should resolve itself within 6-8 hours. If the configuration is degraded after 8 hours or if your custom domain suffix isn't functioning, contact support.
>
:::image type="content" source="./media/custom-domain-suffix/custom-domain-suffix-error.png" alt-text="Screenshot of a sample degraded custom domain suffix configuration.":::
>

### 10. Get the inbound IP addresses for your new App Service Environment v3 and update dependent resources

You have two sets of App Service Environment front ends at this stage in the migration process and both sets are capable of serving application traffic. Your DNS isn't changed, so by default, traffic is sent to the old App Service Environment front ends. You need to update any dependent resources to use the new IP inbound address for your new App Service Environment v3. For internal facing (ILB) App Service Environments, you need to update your private DNS zones to point to the new inbound IP address.

You can get the new inbound IP address for your new App Service Environment v3 by running the following command that corresponds to your App Service Environment load balancer type. It's your responsibility to make any necessary updates. 

For ILB App Service Environments, get the private inbound IP address by running the following command:

```azurecli
az rest --method get --uri "${ASE_ID}?api-version=2022-03-01" --query properties.networkingConfiguration.internalInboundIpAddresses
```

For ELB App Service Environments, get the public inbound IP address by running the following command:

```azurecli
az rest --method get --uri "${ASE_ID}?api-version=2022-03-01" --query properties.networkingConfiguration.externalInboundIpAddresses
```

### 11. Redirect customer traffic, validate your App Service Environment v3, and complete migration

This step is your opportunity to test and validate your new App Service Environment v3.

Once you confirm your apps are working as expected, you can finalize the migration by running the following command. This command also deletes your old environment. You have 14 days to complete this step. If you don't complete this step in 14 days, your migration is automatically reverted back to an App Service Environment v2. If you need more than 14 days to complete this step, contact support.

If you find any issues or decide at this point that you no longer want to proceed with the migration, contact support to revert the migration. Don't run the DNS change command if you need to revert the migration. For more information, see [Revert migration](#redirect-customer-traffic-validate-your-app-service-environment-v3-and-complete-migration).

```azurecli
az rest --method post --uri "${ASE_ID}/NoDowntimeMigrate?phase=DnsChange&api-version=2022-03-01"
```

Run the following command to check the status of this step:

```azurecli
az rest --method get --uri "${ASE_ID}?api-version=2022-03-01" --query properties.subStatus
```

During this step, you get a status of `CompletingMigration`. When you get a status of `MigrationCompleted`, the traffic redirection step is done and your migration is complete.

## Pricing

There's no cost to migrate your App Service Environment. However, you're billed for both your App Service Environment v2 and your new App Service Environment v3 once you start the migration process. You stop being charged for your old App Service Environment v2 when you complete the final migration step where the old environment gets deleted. You should complete your validation as quickly as possible to prevent excess charges from accumulating. For more information about App Service Environment v3 pricing, see the [pricing details](overview.md#pricing).

When you migrate to App Service Environment v3 from previous versions, there are scenarios that you should consider that can potentially reduce your monthly cost. Consider [reservations](../../cost-management-billing/reservations/reservation-discount-app-service.md#how-reservation-discounts-apply-to-isolated-v2-instances) and [savings plans](../../cost-management-billing/savings-plan/savings-plan-compute-overview.md) to further reduce your costs. For information on cost saving opportunities, see [Cost saving opportunities after upgrading to App Service Environment v3](upgrade-to-asev3.md#cost-saving-opportunities-after-upgrading-to-app-service-environment-v3).

> [!NOTE]
> Due to the differences between the Isolated to Isolated v2 pricing tiers, your apps may be over-provisioned after the migration since the Isolated v2 tier has more memory and CPU per corresponding instance size. You'll have the opportunity to [scale your environment](../manage-scale-up.md) as needed once migration is complete. For more information, review the [SKU details](https://azure.microsoft.com/pricing/details/app-service/windows/).
>

### Scale down your App Service plans

The App Service plan SKUs available for App Service Environment v3 run on the Isolated v2 (Iv2) tier. The number of cores and amount of RAM are effectively doubled per corresponding tier compared the Isolated tier. When you migrate, your App Service plans are converted to the corresponding tier. For example, your I2 instances are converted to I2v2. While I2 has two cores and 7-GB RAM, I2v2 has four cores and 16-GB RAM. If you expect your capacity requirements to stay the same, you're over-provisioned and paying for compute and memory you're not using. For this scenario, you can scale down your I2v2 instance to I1v2 and end up with a similar number of cores and RAM that you had previously.

## Frequently asked questions

- **What if migrating my App Service Environment is not currently supported?**  
  You can't migrate using the side-by-side migration feature at this time. If you have an unsupported environment and want to migrate immediately, see the [manual migration options](migration-alternatives.md).
- **How do I choose which migration option is right for me?**  
  Review the [migration path decision tree](upgrade-to-asev3.md#migration-path-decision-tree) to decide which option is best for your use case.
- **How do I know if I should use the side-by-side migration feature?**  
  The side-by-side migration feature is best for customers who want to migrate to App Service Environment v3 but can't support application downtime. Since a new subnet is used for your new environment, there are networking considerations to be aware of, including new IPs. If you can support downtime, see the [in-place migration feature](migrate.md), which results in minimal configuration changes, or the [manual migration options](migration-alternatives.md). The in-place migration feature creates your App Service Environment v3 in the same subnet as your existing environment and uses the same networking infrastructure.
- **Will I experience downtime during the migration?**  
  The platform guarantees that there's no downtime during the side-by-side migration process. However, your DNS settings might cause downtime during the DNS change step. This can be due to issues related to TTL and cache settings as traffic might still be directed to your old App Service Environment after the DNS change. You should review your DNS settings and ensure that you have a low TTL and that your DNS provider supports fast propagation.
- **Will I need to do anything to my apps after the migration to get them running on the new App Service Environment?**  
  No, all of your apps running on the old environment are automatically migrated to the new environment and run like before. No user input is needed.
- **What if my App Service Environment has a custom domain suffix?**  
  The side-by-side migration feature supports this [migration scenario](#supported-scenarios).
- **What if my App Service Environment is zone pinned?**  
  The side-by-side migration feature doesn't support this [migration scenario](#supported-scenarios) at this time. If you have a zone pinned App Service Environment and want to migrate immediately, see the [manual migration options](migration-alternatives.md).
- **What if my App Service Environment has IP SSL addresses?**  
  IP SSL isn't supported on App Service Environment v3. You must remove all IP SSL bindings before migrating using the migration feature or one of the manual options. If you intend to use the side-by-side migration feature, once you remove all IP SSL bindings, you pass that validation check and can proceed with the automated migration.  
- **What properties of my App Service Environment will change?**  
  You're on App Service Environment v3 so be sure to review the [features and feature differences](overview.md#feature-differences) compared to previous versions. Both your inbound and outbound IPs change when using the side-by-side migration feature. Note for ELB App Service Environment, previously there was a single IP for both inbound and outbound. For App Service Environment v3, they're separate. For more information, see [App Service Environment v3 networking](networking.md#addresses). For a full comparison of the App Service Environment versions, see [App Service Environment version comparison](version-comparison.md).
- **What happens if migration fails or there is an unexpected issue during the migration?**  
  If there's an unexpected issue, support teams are on hand. We recommend that you migrate dev environments before touching any production environments to learn about the migration process and see how it impacts your workloads. With the side-by-side migration feature, you can revert all changes if there's any issues.
- **What happens to my old App Service Environment?**  
  If you decide to migrate an App Service Environment using the side-by-side migration feature, your old environment is used up until the final step in the migration process. Once you complete the final step, the old environment and all of the apps hosted on it get shutdown and deleted. Your old environment is no longer accessible. A revert to the old environment at this point isn't possible.
- **What will happen to my App Service Environment v1/v2 resources after 31 August 2024?**  
  After 31 August 2024, if you don't migrate to App Service Environment v3, your App Service Environment v1/v2s and the apps deployed in them will no longer be available. App Service Environment v1/v2 is hosted on App Service scale units running on [Cloud Services (classic)](../../cloud-services/cloud-services-choose-me.md) architecture that will be [retired on 31 August 2024](https://azure.microsoft.com/updates/cloud-services-retirement-announcement/). Because of this, [App Service Environment v1/v2 will no longer be available after that date](https://azure.microsoft.com/updates/app-service-environment-v1-and-v2-retirement-announcement/). Migrate to App Service Environment v3 to keep your apps running or save or back up any resources or data that you need to maintain.

## Next steps

> [!div class="nextstepaction"]
> [App Service Environment v3 Networking](networking.md)

> [!div class="nextstepaction"]
> [Using an App Service Environment v3](using.md)

> [!div class="nextstepaction"]
> [Custom domain suffix](./how-to-custom-domain-suffix.md)
