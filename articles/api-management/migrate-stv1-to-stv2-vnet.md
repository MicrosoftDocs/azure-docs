---
title: Migrate to stv2 platform - Azure API Management - VNet injected
description: Migrate Azure API Management in-place from stv1 to stv2 platform. Follow these migration steps for instances injected in an external or internal VNet.

author: dlepow
ms.service: azure-api-management
ms.custom:
ms.topic: how-to
ms.date: 11/04/2024
ms.author: danlep
---

# Migrate a VNet-injected API Management instance hosted on the stv1 platform to stv2

[!INCLUDE [api-management-availability-premium-dev](../../includes/api-management-availability-premium-dev.md)]

This article provides steps to migrate an API Management instance hosted on the `stv1` compute platform in-place to the `stv2` platform when the instance is injected (deployed) in an [external](api-management-using-with-vnet.md) or [internal](api-management-using-with-internal-vnet.md) VNet. [Find out if you need to do this](compute-infrastructure.md#how-do-i-know-which-platform-hosts-my-api-management-instance).

> [!NOTE]
> **New in August 2024**: To help you migrate your VNet-injected instance, we've improved the migration options in the portal! You can now migrate your instance in-place and keep the same subnet and IP address.

For a VNet-inject instance, you have the following migration options:

* [**Option 1: Keep the same subnet**](#option-1-migrate-and-keep-same-subnet) - Migrate the instance in-place and keep the instances's existing subnet configuration. You can choose whether the API Management instance's original VIP address is preserved (recommended) or whether a new VIP address will be generated.    

* [**Option 2: Change to a new subnet**](#option-2-migrate-and-change-to-new-subnet) - Migrate your instance by specifying a different subnet in the same or a different VNet. After migration, optionally migrate back to the instance's original subnet. The migration process changes the VIP address(es) of the instance. After migration, you need to update any network dependencies including DNS, firewall rules, and VNets to use the new VIP address(es). 

Under certain, less frequent conditions, migration in the same subnet may not be possible or behaves differently. For more information, see [Special conditions and scenarios](#special-conditions-and-scenarios).

If you need to migrate a *non-VNet-injected* API Management hosted on the `stv1` platform, see [Migrate a non-VNet-injected API Management instance to the stv2 platform](migrate-stv1-to-stv2-no-vnet.md).

[!INCLUDE [api-management-migration-alert](../../includes/api-management-migration-alert.md)]


> [!CAUTION]
> * Migrating your API Management instance to the `stv2` platform is a long-running operation. 
> * Migration to `stv2` is not reversible.


## What happens during migration?

API Management platform migration from `stv1` to `stv2` involves updating the underlying compute alone and has no impact on the service/API configuration persisted in the storage layer.

* The upgrade process involves creating a new compute in parallel to the old compute, which can take up to 45 minutes. Plan longer times for multi-region deployments and in scenarios that involve changing the subnet more than once.
* The API Management status in the Azure portal will be **Updating**.
* For certain migration options, you can choose to preserve the VIP address or a new public VIP will be generated. 
* For migration scenarios when a new VIP address is generated:
    * Azure manages the migration. 
    * The gateway DNS still points to the old compute if a custom domain is in use. 
    * If custom DNS isn't in use, the gateway and portal DNS points to the new compute immediately.
    * For an instance in internal VNet mode, customer manages the DNS, so the DNS entries continue to point to old compute until updated by the customer.
    * It's the DNS that points to either the new or the old compute and hence no downtime to the APIs.
    * Changes are required to your firewall rules, if any, to allow the new compute subnet to reach the backends.
    * After successful migration, the old compute is automatically decommissioned after a short period. When changing to a new subnet using the **Platform migration** blade in the portal, you can enable a migration setting to retain the old gateway for 48 hours. *The 48 hour delay option is only available for VNet-injected services.* 

## Prerequisites

* An API Management instance hosted on the `stv1` compute platform. To confirm that your instance is hosted on the `stv1` platform, see [How do I know which platform hosts my API Management instance?](compute-infrastructure.md#how-do-i-know-which-platform-hosts-my-api-management-instance)
* The instance must currently be deployed in an external or internal VNet. 

Other prerequisites are specific to the migration options in the following sections.

## Option 1: Migrate and keep same subnet

You can migrate your API Management instance to the `stv2` platform keeping the existing subnet configuration, which simplifies your migration. You can migrate using the **Platform migration** blade in the Azure portal or the Migrate to Stv2 REST API.

### Prerequisites

* A network security group must be attached to each subnet, and [NSG rules](virtual-network-reference.md#required-ports) for API Management on the `stv2` platform must be configured. The following are minimum connectivity settings:

   * Outbound to Azure Storage over port 443
   * Outbound to Azure SQL over port 1433
   * Outbound to Azure Key Vault over port 443
   * Inbound from Azure Load Balancer over port 6390
   * Inbound from ApiManagement service tag over port 3443
   * Inbound over port 80/443 for clients calling API Management service
   * The subnet must have service endpoints enabled for Azure Storage, Azure SQL, and Azure Key Vault
* The address space of each existing subnet must be large enough to host a copy of your existing service side-by side with your existing service during migration. 
* Other network considerations:
    * Turn off any autoscale rules configured for API Management instances deployed in the subnet. Autoscale rules can interfere with the migration process.
    * If you have multiple API Management instances in the same subnet, migrate each instance in sequence. We recommend that you promptly migrate all instances in the subnet to avoid any potential issues with instances hosted on different platforms in the same subnet.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

### Public IP address options - same-subnet migration

You can choose whether the API Management instance's original VIP address is preserved (recommended) or whether a new VIP address will be generated. 

* **Preserve virtual IP address** - If you preserve the VIP address in a VNet in external mode, API requests can remain responsive during migration (see [Expected downtime](#expected-downtime-and-compute-retention)); for a VNet in internal mode, temporary downtime is expected. Infrastructure configuration (such as custom domains, locations, and CA certificates) will be locked for 45 minutes. No further configuration is required after migration. 

    With this option, the `stv1` compute is deleted permanently after the migration is complete. There is no option to retain it temporarily.

    The following image shows a high level overview of what happens when the IP address is preserved.

    :::image type="content" source="media/migrate-stv1-to-stv2-vnet/apim-preserve-ip.gif" alt-text="Diagram of in-place migration to same subnet and preserving IP address.":::  

* **New virtual IP address** - If you choose this option, API Management generates a new VIP address for your instance. API requests remain responsive during migration. Infrastructure configuration (such as custom domains, locations, and CA certificates) will be locked for 30 minutes. After migration, you'll need to update any network dependencies including DNS, firewall rules, and VNets to use the new VIP address.

    With this option, the `stv1` compute is retained for a short period by default after migration is complete so that you can validate the migrated instance and confirm the network and DNS configuration.  

    The following image shows a high level overview of what happens when a new IP address is generated.

    :::image type="content" source="media/migrate-stv1-to-stv2-vnet/apim-new-ip.gif" alt-text="Diagram of in-place migration to same subnet and generating new IP address.":::


[!INCLUDE [api-management-migration-precreated-ip](../../includes/api-management-migration-precreated-ip.md)]

### Expected downtime and compute retention

When migrating a VNet-injected instance and keeping the same subnet configuration, minimal or no downtime for the API gateway is expected. The following table summarizes the expected downtime and `stv1` compute retention for each migration scenario when keeping the same subnet:

|VNet mode  |Public IP option  |Expected downtime  | `stv1` compute retention  |
|---------|---------|---------|-----------|
|External     |   Preserve VIP      |   No downtime; traffic is served on a temporary IP address for up to 20 minutes during migration to the new `stv2` deployment     | No retention |
|External     |  New VIP       |  No downtime | Retained by default for 15 minutes to allow you to update network dependencies      |
|Internal     |    Preserve VIP     |  Downtime for approximately 20 minutes during migration while the existing IP address is assigned to the new `stv2` deployment.       | No retention |
|Internal     |  New VIP       |   No downtime | Retained by default for 15 minutes to allow you to update network dependencies; can be extended to 48 hours when using the portal   |


### Migration steps - keep the same subnet

#### [Portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, under **Settings**, select **Platform migration**.
1. Under **Select a migration option**, select **Keep the same subnet**.
1. Under **Choose an IP address option**, select one of the two IP address options.
    > [!NOTE]
    > If your VNet is in external mode, take note of the precreated public IP address for the migration process. Use this address to configure network connectivity for your migrated instance.
1. (For instances injected in internal mode and migrating to a new VIP) Under **Choose the scenario that aligns with your requirements**, choose one of the two options, depending on whether you want to maintain the original `stv1` compute for a period after migration.
1. Select **Verify** to run automated checks on the subnet. If problems are detected, adjust your subnet configuration and run checks again. For other network dependencies, such as DNS and firewall rules, check manually.
1. Confirm that you want to migrate, and select **Start migration**. 
    The status of your API Management instance changes to **Updating**. The migration process takes approximately 45 minutes to complete. When the status changes to **Online**, migration is complete.

#### [Azure CLI](#tab/cli)

### Migration script

[!INCLUDE [api-management-migration-cli-steps](../../includes/api-management-migration-cli-steps.md)]

> [!NOTE]
> If your API Management instance is deployed in multiple regions, the REST API migrates the VNet settings for all locations of your instance using a single call.

---

## Option 2: Migrate and change to new subnet

Using the Azure portal, you can migrate your instance by specifying a different subnet in the same or a different VNet. After migration, optionally migrate back to the instance's original subnet.

The following image shows a high level overview of what happens during migration to a new subnet.

:::image type="content" source="media/migrate-stv1-to-stv2-vnet/inplace-new-subnet.gif" alt-text="Diagram of in-place migration to a new subnet.":::

### Prerequisites

* A new subnet in the current virtual network, in each region where the API Management instance is deployed. (Alternatively, set up a subnet in a different virtual network in the same regions and subscription as your API Management instance). A network security group must be attached to each subnet, and [NSG rules](virtual-network-reference.md#required-ports) for API Management on the `stv2` platform must be configured.

* (Optional) A new Standard SKU [public IPv4 address](../virtual-network/ip-services/public-ip-addresses.md#sku) resource in the same region(s) and subscription as your API Management instance. For details, see [Prerequisites for network connections](virtual-network-injection-resources.md).

[!INCLUDE [api-management-publicip-internal-vnet](../../includes/api-management-publicip-internal-vnet.md)]

### Migration steps - change to a new subnet

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, under **Settings**, select **Platform migration**.
1. Under **Select a migration option**, select **Change to a new subnet**.
1. Under **Choose the scenario that aligns with your requirements**, choose one of the two options, depending on whether you want to maintain the original `stv1` compute for a period after migration.

      :::image type="content" source="media/migrate-stv1-to-stv2-vnet/enable-retain-gateway.png" alt-text="Screenshot of options to retain stv1 compute in the portal.":::
1. Under **Define migration settings for each location**:
    1. Select a location to migrate. 
    1. Select the **Virtual network**, **Subnet**, and optional **Public IP address** you want to migrate to. 
    
      :::image type="content" source="media/migrate-stv1-to-stv2-vnet/select-location.png" alt-text="Screenshot of selecting network migration settings in the portal." lightbox="media/migrate-stv1-to-stv2-vnet/select-location.png":::
1. Under **Verify that your subnet meets migration requirements**, select **Verify** to run automated checks on the subnet. If problems are detected, adjust your subnet configuration and run checks again. For other network dependencies, such as DNS and firewall rules, check manually.
1. Confirm that you want to migrate, and select **Migrate**. 
    The status of your API Management instance changes to **Updating**. The migration process takes approximately 45 minutes to complete. When the status changes to **Online**, migration is complete.

If your API Management instance is deployed in multiple regions, repeat the preceding steps to continue migrating VNet settings for the remaining locations of your instance.


### (Optional) Migrate back to original subnet

If you migrated and changed to a new subnet, optionally migrate back to the original subnet you used in each region. To do so, update the VNet configuration again, this time specifying the original VNet and subnet in each region. As in the preceding migration, expect a long-running operation, and expect the VIP address to change.

The following image shows a high level overview of what happens during migration back to the original subnet.

:::image type="content" source="media/migrate-stv1-to-stv2-vnet/inplace-old-subnet.gif" alt-text="Diagram of in-place migration back to original subnet.":::

> [!IMPORTANT]
> If the VNet and subnet are locked (because other `stv1` platform-based API Management instances are deployed there) or the resource group where the original VNet is deployed has a [resource lock](../azure-resource-manager/management/lock-resources.md), make sure to remove the lock before migrating back to the original subnet. Wait for lock removal to complete before attempting the migration to the original subnet. [Learn more](api-management-using-with-internal-vnet.md#challenges-encountered-in-reassigning-api-management-instance-to-previous-subnet).


#### Additional prerequisites

* The unlocked original subnet, in each region where the API Management instance is deployed. A network security group must be attached to the subnet, and [NSG rules](virtual-network-reference.md#required-ports) for API Management must be configured.

* (Optional) A new Standard SKU [public IPv4 address](../virtual-network/ip-services/public-ip-addresses.md#sku) resource in the same region(s) and subscription as your API Management instance.

    [!INCLUDE [api-management-publicip-internal-vnet](../../includes/api-management-publicip-internal-vnet.md)]

#### Update VNet configuration

1. In the [portal](https://portal.azure.com), navigate to your original VNet.
1. In the left menu, select **Subnets**, and then the original subnet. 
1. Verify that the original IP addresses were released by API Management. Under **Available IPs**, note the number of IP addresses available in the subnet. All addresses (except for Azure reserved addresses) should be available. If necessary, wait for IP addresses to be released. 
1. Navigate to your API Management instance.
1. In the left menu, under **Network**, select **Virtual network**.
1. Select the network connection in the location you want to update.
1. Select the original VNet network and subnet. Optionally select a new public IP. Select **Apply**. 
1. If your API Management instance is deployed in multiple regions, continue configuring VNet settings for the remaining locations of your instance.
1. In the top navigation bar, select **Save**.

After you update the VNet configuration, the status of your API Management instance changes to **Updating**. The migration process takes approximately 45 minutes to complete. When the status changes to **Online**, migration is complete.

[!INCLUDE [api-management-validate-migration-to-stv2](../../includes/api-management-validate-migration-to-stv2.md)]

[!INCLUDE [api-management-migration-compute-coexist](../../includes/api-management-migration-compute-coexist.md)]

[!INCLUDE [api-management-migration-rollback](../../includes/api-management-migration-rollback.md)]

## Special conditions and scenarios

Under certain conditions, [Option 1: Migrate and keep same subnet](#option-1-migrate-and-keep-same-subnet) may not be available or behaves differently. The portal detects these conditions and recommends the migration option(s). If you aren't able to use Option 1, or multiple conditions are present, use [Option 2: Change to a new subnet](#option-2-migrate-and-change-to-new-subnet).

* **VNet with special internal conditions** - If your API Management instance is currently deployed in a VNet with special internal conditions (unrelated to customer configuration), you are notified in the portal that Option 1 for same-subnet migration in the portal includes additional downtime (approximately 1 hour). Using the portal for migration is recommended. You can also use the following modified Azure CLI script for same-subnet migration with approximately 1 hour of downtime:

   ```azurecli
   APIM_NAME={name of your API Management instance}
   # In PowerShell, use the following syntax: $APIM_NAME={name of your API Management instance}
   RG_NAME={name of your resource group} 
   # Get resource ID of API Management instance
   APIM_RESOURCE_ID=$(az apim show --name $APIM_NAME --resource-group $RG_NAME --query id --output tsv)
   # Call REST API to migrate to stv2 and preserve VIP address for special condition
   az rest --method post --uri "$APIM_RESOURCE_ID/migrateToStv2?api-version=2024-06-01-preview&migrateWithDowntime=true" --body '{"mode": "PreserveIP"}' 
   ```

* **Multiple stv1 instances in subnet** - Sufficient free IP addresses may not be available for a same-subnet migration if you attempt to migrate the instances simultaneously. You may be able to migrate instances sequentially using Option 1.

* **Subnet delegation** - If the subnet where API Management is deployed is currently delegated to other Azure services, you must migrate using Option 2. 

* **Azure Key Vault blocked** - If access to Azure Key Vault is currently blocked, you must migrate using Option 2, including setting up NSG rules in the new subnet for access to Azure Key Vault.

[!INCLUDE [api-management-migration-support](../../includes/api-management-migration-support.md)]

## Frequently asked questions

- **What information do we need to choose a migration path?**
    
   - What is the network mode of the API Management instance?
   - Are custom domains configured?
   - Is a firewall involved?
   - Any known dependencies taken by upstream/downstream on the IPs involved?
   - Is it a multi-region deployment?
   - Can we modify the existing instance or is a parallel setup required?
   - Can there be downtime?
   - Can the migration be done in nonbusiness hours?

- **What are the prerequisites for the migration?**

   For VNet-injected instances, see the prerequisites for the options to [migrate and keep the same subnet](#option-1-migrate-and-keep-same-subnet) or to [migrate and change to a new subnet](#option-2-migrate-and-change-to-new-subnet).
  
- **Will the migration cause downtime?**

   When migrating a VNet-injected instance and keeping the same subnet configuration, minimal or no downtime for the API gateway is expected. See the summary table in [Expected downtime](#expected-downtime-and-compute-retention).

   When migrating and changing to a new VIP address, there shouldn't be any downtime if default hostnames are in use. It's critical that all network dependencies are taken care of upfront, for the impacted APIs to be functional. However, if custom domains are in use, they'll be pointing to the purged compute until they're updated which may cause a downtime. Alternatively, for certain migration options, enable a migration setting to retain the old gateway for 48 hours. Having the old and the new compute coexist will facilitate validation, and then you can update the custom DNS entries at will.
   

- **My traffic is force tunneled through a firewall. What changes are required?**

   - First of all, make sure that the subnet(s) you use for the migration retain the following configuration (they should be already configured if you are migrating and keeping your current subnet):
      - Enable service endpoints as described [here](./api-management-using-with-vnet.md?tabs=stv2#force-tunnel-traffic-to-on-premises-firewall-using-expressroute-or-network-virtual-appliance)
      - The UDR (user-defined route) has the hop from **ApiManagement** service tag set to "Internet" and not only to your firewall address
   - The [requirements for NSG configuration for stv2](virtual-network-reference.md#required-ports) remain the same whether you have firewall or not; make sure your new subnet has it
   - Firewall rules referring to the current IP address range of the API Management instance should be updated to use the IP address range of your new subnet.

- **Can data or configuration losses occur by/during the migration?**

   `stv1` to `stv2` migration involves updating the compute platform alone and the internal storage layer isn't changed. Hence all the configuration is safe during the migration process. This includes the system-assigned managed identity, which if enabled is preserved.

- **How to confirm that the migration is complete and successful**

   The migration is considered complete and successful when the status in the **Overview** page reads **Online** along with the platform version being either `stv2` or `stv2.1`. Also verify that the network status in the **Network** blade shows green for all required connectivity.

- **Can I do the migration using the portal?**

   Yes, VNet-injected instances can be migrated by using the **Platform migration** blade.

- **Can I preserve the IP address of the instance?**

   Yes, the **Platform migration** blade in the portal and the REST API have options to preserve the IP address. 

     
- **Is there a migration path without modifying the existing instance?**
 
   Yes, you need a [side-by-side migration](migrate-stv1-to-stv2.md#alternative-side-by-side-deployment). That means you create a new API Management instance in parallel with your current instance and copy the configuration over to the new instance. 

- **What happens if the migration fails?**

   If your API Management instance doesn't show the platform version as `stv2` or `stv2.1` and status as **Online** after you initiated the migration, it probably failed. Your service is automatically rolled back to the old instance and no changes are made. 

- **What functionality is not available during migration?**

   API requests remain responsive during migration. Infrastructure configuration (such as custom domains, locations, and CA certificates) is locked for 30 minutes. 

- **How long will the migration take?**

   The expected duration for a migration to a new VNet configuration is approximately 45 minutes. The indicator to check if the migration was already performed is to check if Status of your instance is back to **Online** and not **Updating**. Plan longer times for multi-region deployments and in scenarios that involve changing the subnet more than once.

- **Is there a way to validate the VNet configuration before attempting migration?**

   If you plan to change subnet during migration, you can deploy a new API Management instance with the VNet, subnet, and (optional) IP address resource that you will use for the actual migration. Navigate to the **Network status** page after the deployment is completed, and verify if every endpoint connectivity status is green. If yes, you can remove this new API Management instance and proceed with the real migration with your original `stv1`-hosted service.

- **Can I roll back the migration if required?**

  If there's a failure during the migration process, the instance will automatically roll back to the `stv1` platform. However, after the service migrates successfully, you can't roll back to the `stv1` platform. 

- **Is there any change required in custom domain/private DNS zones?**

   With VNet-injected instances in internal mode and changing to a new VIP, you'll need to update the private DNS zones to the new VNet IP address acquired after the migration. Pay attention to update non-Azure DNS zones, too (for example, your on-premises DNS servers pointing to API Management private IP address). However, in external mode, the migration process will automatically update the default domains if in use.

- **My stv1 instance is deployed to multiple Azure regions (multi-region). How do I upgrade to stv2?**

   Multi-region deployments include more managed gateways deployed in other locations. When you migrate using the **Platform migration** blade in the portal, you migrate each location separately. The Migrate to Stv2 REST API migrates all locations in one call. The instance is considered migrated to the new platform only when all the locations are migrated. All regional gateways continue to operate normally throughout the migration process.


- **Can I upgrade my stv1 instance to the same subnet?**

   Yes, use the **Platform migration** blade in the portal, or use the [Migrate to stv2 REST API](#option-1-migrate-and-keep-same-subnet). 
    
- **Can I test the new gateway in a new subnet before switching the live traffic?**

   - When you migrate to a new subnet, by default the old and the new managed gateways coexist for 15 minutes, which is a small window of time to validate the deployment. You can enable a migration setting to retain the old gateway for 48 hours. This change keeps the old and the new managed gateways active to receive traffic and facilitate validation.
   - The migration process automatically updates the default domain names, and if being used, the traffic routes to the new gateways immediately.
   - If custom domain names are in use, the corresponding DNS records might need to be updated with the new IP address if not using CNAME. Customers can update their hosts file to the new API Management IP and validate the instance before making the switch. During this validation process, the old gateway continues to serve the live traffic.

- **Are there any considerations when using default domain name in a new subnet?**

   Instances that are using the default DNS name in external mode have the DNS autoupdated by the migration process. Moreover, the management endpoint, which always uses the default domain name, is automatically updated by the migration process. Since the switch happens immediately on a successful migration, the new instance starts receiving traffic immediately, and it's critical that any networking restrictions/dependencies are taken care of in advance to avoid impacted APIs being unavailable. 

- **What should we consider for self-hosted gateways?**

   You don't need to do anything in your self-hosted gateways. You just need to migrate API Management instances running in Azure that are impacted by the `stv1` platform retirement. Note that there could be a new IP for the Configuration endpoint of the API Management instance, and any networking restrictions pinned to the IP should be updated.

- **How is the developer portal impacted by migration?**

   There's no impact on developer portal. If custom domains are used, the DNS record should be updated with the effective IP, post migration. However, if the default domains are in use, they're automatically updated on successful migration. There's no downtime for the developer portal during the migration.

- **Is there any impact on cost once we migrated to stv2?**

   The billing model remains the same for `stv2` and there won't be any more cost incurred during and after the migration.

- **What RBAC permissions are required for the stv1 to stv2 migration?**

   The user/process undertaking the migration would need [write access to the API Management instance](./api-management-role-based-access-control.md).
   In addition, the following two permissions are required:
   - Microsoft.Network/virtualNetworks/subnets/join/action
   - Microsoft.Network/publicIPAddresses/join/action

[!INCLUDE [api-management-migration-related-content](../../includes/api-management-migration-related-content.md)]
