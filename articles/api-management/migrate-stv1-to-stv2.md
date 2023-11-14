---
title: Migrate Azure API Management instance to stv2 platform  | Microsoft Docs
description: Migrate your Azure API Management instance from the stv1 compute platform to the stv2 platform. Migration steps depend on whether the instance is injected in a VNet.

author: dlepow
ms.service: api-management
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 10/18/2023
ms.author: danlep
---

# Migrate an API Management instance hosted on the stv1 platform to stv2

You can migrate an API Management instance hosted on the `stv1` compute platform to the `stv2` platform. This article provides migration steps for two scenarios, depending on whether or not your API Management instance is currently deployed (injected) in an [external](api-management-using-with-vnet.md) or [internal](api-management-using-with-internal-vnet.md) VNet.

* [**Scenario 1: Non-VNet-injected API Management instance**](#scenario-1-migrate-api-management-instance-not-injected-in-a-vnet) - Migrate your instance using the portal or the [Migrate to stv2](/rest/api/apimanagement/current-ga/api-management-service/migratetostv2) REST API.   

* [**Scenario 2: VNet-injected API Management instance**](#scenario-2-migrate-a-network-injected-api-management-instance) - Migrate your instance by manually updating the VNet configuration settings

For more information about the `stv1` and `stv2` platforms and the benefits of using the `stv2` platform, see [Compute platform for API Management](compute-infrastructure.md).

> [!IMPORTANT]
> Support for API Management instances hosted on the `stv1` platform will be [retired by 31 August 2024](breaking-changes/stv1-platform-retirement-august-2024.md). To ensure continued support and operation of your API Management instance, you must migrate any instance hosted on the `stv1` platform to `stv2` before that date.

> [!CAUTION]
> * Migrating your API Management instance to new infrastructure is a long-running operation. Depending on your service configuration, you might have temporary downtime during migration, and you might need to update your network dependencies after migration to reach your API Management instance. Plan your migration accordingly.
> * Migration to `stv2` is not reversible.

[!INCLUDE [api-management-availability-premium-dev-standard-basic](../../includes/api-management-availability-premium-dev-standard-basic.md)]

## What happens during migration?

API Management platform migration from `stv1` to `stv2` involves updating the underlying compute alone and has no impact on the service/api configuration persisted in the storage layer.

* The upgrade process involves creating a new compute in parallel the old compute. Both instances coexist for 48 hours.
* The API Management status in the Portal will be "Updating".
* Azure manages the management endpoint DNS, and updates to the new compute immediately on successful migration. 
* The Gateway DNS still points to the old compute if custom domain is in use. 
* If custom DNS isn't in use, the Gateway and Portal DNS points to the new compute immediately.
* For an instance in internal VNet mode, customer manages the DNS, so the DNS entries continue to point to old compute until updated by the customer.
* It's the DNS that points to either the new or the old compute and hence no downtime to the APIs.
* Changes are required to your firewall rules, if any, to allow the new compute subnet reach the backends.

## Prerequisites

* An API Management instance hosted on the `stv1` compute platform. To confirm that your instance is hosted on the `stv1` platform, see [How do I know which platform hosts my API Management instance?](compute-infrastructure.md#how-do-i-know-which-platform-hosts-my-api-management-instance).

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

## Scenario 1: Migrate API Management instance, not injected in a VNet

For an API Management instance that's not deployed in a VNet, migrate your instance using the **Platform migration** blade in the Azure portal, or invoke the Migrate to `stv2` REST API. 

You can choose whether the virtual IP address of API Management will change, or whether the original VIP address is preserved.

* **New virtual IP address (recommended)** - If you choose this mode, API requests remain responsive during migration. Infrastructure configuration (such as custom domains, locations, and CA certificates) will be locked for 30 minutes. After migration, you'll need to update any network dependencies including DNS, firewall rules, and VNets to use the new VIP address. 

* **Preserve IP address** - If you preserve the VIP address, API requests will be unresponsive for approximately 15 minutes while the IP address is migrated to the new infrastructure. Infrastructure configuration (such as custom domains, locations, and CA certificates) will be locked for 45 minutes. No further configuration is required after migration.

#### [Portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, under **Settings**, select **Platform migration**.
1. On the **Platform migration** page, select one of the two migration options:

    * **New virtual IP address (recommended)**. The VIP address of your API Management instance will change automatically. Your service will have no downtime, but after migration you'll need to update any network dependencies including DNS, firewall rules, and VNets to use the new VIP address.

    * **Preserve IP address** - The VIP address of your API Management instance won't change. Your instance will have downtime for up to 15 minutes.

        :::image type="content" source="media/migrate-stv1-to-stv2/platform-migration-portal.png" alt-text="Screenshot of API Management platform migration in the portal.":::

1. Review guidance for the migration process, and prepare your environment. 

1. After you've completed preparation steps, select **I have read and understand the impact of the migration process.** Select **Migrate**.

#### [Azure CLI](#tab/cli)

Run the following Azure CLI commands, setting variables where indicated with the name of your API Management instance and the name of the resource group in which it was created.

> [!NOTE]
> The Migrate to `stv2` REST API is available starting in API Management REST API version `2022-04-01-preview`.


```azurecli
#!/bin/bash
# Verify currently selected subscription
az account show

# View other available subscriptions
az account list --output table

# Set correct subscription, if needed
az account set --subscription {your subscription ID}

# Update these variables with the name and resource group of your API Management instance
APIM_NAME={name of your API Management instance}
RG_NAME={name of your resource group}

# Get resource ID of API Management instance
APIM_RESOURCE_ID=$(az apim show --name $APIM_NAME --resource-group $RG_NAME --query id --output tsv)

# Call REST API to migrate to stv2 and change VIP address
az rest --method post --uri "$APIM_RESOURCE_ID/migrateToStv2?api-version=2023-03-01-preview" --body '{"mode": "NewIp"}'

# Alternate call to migrate to stv2 and preserve VIP address
# az rest --method post --uri "$APIM_RESOURCE_ID/migrateToStv2?api-version=2023-03-01-preview" --body '{"mode": "PreserveIp"}'
```
---

### Verify migration

To verify that the migration was successful, when the status changes to `Online`, check the [platform version](compute-infrastructure.md#how-do-i-know-which-platform-hosts-my-api-management-instance) of your API Management instance. After successful migration, the value is `stv2`.

### Update network dependencies

On successful migration, update any network dependencies including DNS, firewall rules, and VNets to use the new VIP address.

## Scenario 2: Migrate a network-injected API Management instance

Trigger migration of a network-injected API Management instance to the `stv2` platform by updating the existing network configuration to use new network settings (see the following section). After that update completes, as an optional step, you can migrate back to the original VNet and subnet you used.

You can also migrate to the `stv2` platform by enabling [zone redundancy](../reliability/migrate-api-mgt.md).

> [!IMPORTANT]
> The VIP address of your API Management instance will change. However, API requests remain responsive during migration. Infrastructure configuration (such as custom domains, locations, and CA certificates) will be locked for 30 minutes. After migration, you'll need to update any network dependencies including DNS, firewall rules, and VNets to use the new VIP address.


### Update VNet configuration

Update the configuration of the VNet in each location (region) where the API Management instance is deployed.

#### Prerequisites

* A new subnet in the current virtual network. (Alternatively, set up a subnet in a different virtual network in the same region and subscription as your API Management instance). A network security group must be attached to the subnet, and [NSG rules](api-management-using-with-vnet.md#configure-nsg-rules) for API Management must be configured.

* A Standard SKU [public IPv4 address](../virtual-network/ip-services/public-ip-addresses.md#sku) resource in the same region and subscription as your API Management instance.

> [!IMPORTANT]
> When you update the VNet configuration for migration to the `stv2` platform, you must provide a public IP address address resource, or migration won't succeed. In internal VNet mode, this public IP address is used only for management operations.

For details, see [Prerequisites for network connections](api-management-using-with-vnet.md#prerequisites).

#### Update VNet configuration

To update the existing external or internal VNet configuration:

1. In the [portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, select **Network** > **Virtual network**.
1. Select the network connection in the location you want to update.
1. Select the virtual network, subnet, and IP address resources you want to configure, and select **Apply**.
1. Continue configuring VNet settings for the remaining locations of your API Management instance.
1. In the top navigation bar, select **Save**, then select **Apply network configuration**.

The virtual network configuration is updated, and the instance is migrated to the `stv2` platform.

### (Optional) Migrate back to original VNet and subnet

You can optionally migrate back to the original VNet and subnet you used in each region before migration to the `stv2` platform. To do so, update the VNet configuration again, this time specifying the original VNet and subnet. As in the preceding migration, expect a long-running operation, and expect the VIP address to change.

#### Prerequisites

* The original subnet and VNet. A network security group must be attached to the subnet, and [NSG rules](api-management-using-with-vnet.md#configure-nsg-rules) for API Management must be configured.

* A new Standard SKU [public IPv4 address](../virtual-network/ip-services/public-ip-addresses.md#sku) resource in the same region and subscription as your API Management instance.


#### Update VNet configuration

1. In the [portal](https://portal.azure.com), navigate to your original VNet.
1. In the left menu, select **Subnets**, and then the original subnet. 
1. Verify that the original IP addresses were released by API Management. Under **Available IPs**, note the number of IP addresses available in the subnet. All addresses (except for Azure reserved addresses) should be available. If necessary, wait for IP addresses to be released. 
1. Repeat the migration steps in the preceding section. In each region, specify the original VNet and subnet, and a new IP address resource.

### Verify migration

* To verify that the migration was successful, when the status changes to `Online`, check the [platform version](compute-infrastructure.md#how-do-i-know-which-platform-hosts-my-api-management-instance) of your API Management instance. After successful migration, the value is `stv2`. 
* Additionally check the Network status to ensure connectivity of the instance to its dependencies. In the portal, in the left-hand menu, under **Deployment and infrastructure**, select **Network** > **Network status**.

### Update network dependencies

On successful migration, update any network dependencies including DNS, firewall rules, and VNets to use the new VIP address/subnet address space.
[!INCLUDE [api-management-migration-support](../../includes/api-management-migration-support.md)]

## Frequently asked questions

- **What information do we need to choose a migration path?**
    
   - What is the Network mode of the API Management instance?
   - Are custom domains configured?
   - Is a firewall involved?
   - Any known dependencies taken by upstream/downstream on the IPs involved?
   - Is it a multi-geo deployment?
   - Can we modify the existing instance or is a parallel setup required?
   - Can there be downtime?
   - Can the migration be done in nonbusiness hours?

- **What are the prerequisites for the migration?**

   ***VNet-injected instances:*** you'll need a new subnet and public IP address to migrate (either External or Internal modes). The subnet must have an NSG attached to it following the rules for `stv2` platform as described [here](./api-management-using-with-vnet.md?tabs=stv2#configure-nsg-rules).
  
   ***Non-VNet instances:*** no prerequisites are required. If you migrate preserving your public IP address, this will render your API Management instance unresponsive for approximately 15 minutes. If you can't afford any downtime, then choose the *"New IP"* option that makes API Management available on a new IP. Network dependencies need to be updated with the new public virtual IP address.

- **Will the migration cause a downtime?**

   ***VNet-injected instances:***  there's no downtime as the old and new managed gateways are available for 48 hours, to facilitate validation and DNS update. However, if the default domain names are in use, traffic is routed to the new managed gateway immediately. It's critical that all network dependencies are taken care of upfront, for the impacted APIs to be functional.
   
   ***Non-VNet instances:*** there's a downtime of approximately 15 minutes only if you choose to preserve the original IP address. However, there's no downtime if you migrate with a new IP address.

- **My traffic is force tunneled through a firewall. What changes are required?**

   - First of all, make sure that the new subnet you created for the migration retains the following configuration (they should be already configured in your current subnet):
      - Enable service endpoints as described [here](./api-management-using-with-vnet.md?tabs=stv2#force-tunnel-traffic-to-on-premises-firewall-using-expressroute-or-network-virtual-appliance)
      - The UDR (user-defined route) has the hop from **ApiManagement** service tag set to "Internet" and not only to your firewall address
   - The [requirements for NSG configuration for stv2](./api-management-using-with-vnet.md?tabs=stv2#configure-nsg-rules) remain the same whether you have firewall or not; make sure your new subnet has it
   - Firewall rules referring to the current IP address range of the API Management instance should be updated to use the IP address range of your new subnet.

- **Is it impossible that data or configuration losses can occur by/during the migration?**

   `stv1` to `stv2` migration involves updating the compute platform alone and the internal storage layer isn't changed. Hence all the configuration is safe during the migration process.

- **How to confirm that the migration is complete and successful?**

   The migration is considered complete and successful when the status in the overview page reads *"Online"* along with the platform version being either 2.0 or 2.1. Also verify that the network status in the network blade shows green for all required connectivity.

- **Can I do the migration using the portal?**

   - Yes, the [Platform migration](./migrate-stv1-to-stv2.md?tabs=portal#scenario-1-migrate-api-management-instance-not-injected-in-a-vnet) blade in Azure portal guides through the options for non-VNet injected instances.
   - VNet-injected instances can be migrated by changing the subnet in the **Network** blade.

- **Can I preserve the IP address of the instance?**

   **VNet-injected instances:** there's no way currently to preserve the IP address if your instance is injected into a VNet
   
   **Non-VNet instances:**  the IP address can be preserved, but there will be a downtime of approximately 15 minutes.

- **Is there a migration path without modifying the existing instance?**

   Yes, you need a side-by-side migration. That means you create a new API Management instance in parallel with your current instance and copy the configuration over to the new instance. 

- **What happens if the migration fails?**

   If your API Management instance doesn't show the platform version as `stv2` and status as *"Online"* after you initiated the migration, it probably failed. Your service is automatically rolled back to the old instance and no changes are made. If you have problems (such as if status is *"Updating"* for more than 2 hours), contact Azure support.

- **What functionality is not available during migration?**

   **VNet injected instances:** API requests remain responsive during migration. Infrastructure configuration (such as custom domains, locations, and CA certificates) is locked for 30 minutes. After migration, you'll need to update any network dependencies including DNS, firewall rules, and VNets to use the new VIP address.

   **Non-VNet-injected instances:** 
      - If you opted to preserve the original IP address: If you preserve the VIP address, API requests are unresponsive for approximately 15 minutes while the IP address is migrated to the new infrastructure. Infrastructure configuration (such as custom domains, locations, and CA certificates) is locked for 45 minutes.
      - If you opted to migrate to a new IP address: API requests remain responsive during migration. Infrastructure configuration (such as custom domains, locations, and CA certificates) is locked for 30 minutes. After migration, you'll need to update any network dependencies including DNS, firewall rules, and VNets to use the new VIP address.

- **How long will the migration take?**

   The expected duration for the whole migration is approximately 45 minutes. The indicator to check if the migration was already performed is to check if Status of your instance is back to *"Online"* and not *"Updating"*. If it says *"Updating"* for more than 2 hours, contact Azure support.

- **Is there a way to validate the VNet configuration before attempting migration?**

   You can optionally deploy a new API Management instance with the new VNet, subnet, and VIP that you use for the actual migration. Navigate to the **Network status** page after the deployment is completed, and verify if every endpoint connectivity status is green. If yes, you can remove this new API Management instance and proceed with the real migration with your original `stv1` service.

- **Can I roll back the migration if required?**

   Yes, you can. If there's a failure during the migration process, the instance will automatically roll back to the `stv1` platform. However, if you encounter any other issues post migration, you have 48 hours to request a rollback by contacting Azure support. You should contact support if the instance is stuck in an "Updating" status for more than 2 hours.

- **Is there any change required in custom domain/private DNS zones?**

   **VNet-injected instances:** you'll need to update the private DNS zones to the new VNet IP address acquired after the migration. Pay attention to update non-Azure DNS zones too (for example your on-premises DNS servers pointing to API Management private IP address). However, in external mode, the migration process will automatically update the default domains if in use.
   
   **Non-VNet injected instances:** No changes are required if the IP is preserved. If opted for a new IP, custom domains referring to the IP should be updated.

- **My stv1 instance is deployed to multiple Azure regions (multi-geo). How do I upgrade to stv2?**

   Multi-geo deployments include more managed gateways deployed in other locations. Each location should be migrated separately by providing a new subnet and a new public IP.  Navigate to the *Locations* blade and perform the changes on each listed location. The instance is considered migrated to the new platform only when all the locations are migrated. Both gateways continue to operate normally throughout the migration process.


- **Do we need a public IP even if the API Management instance is VNet injected in internal mode only?**

   API Management `stv1` uses an Azure managed public IP even in an internal mode for management traffic. However `stv2` requires a user managed public IP for the same purpose. This public IP is only used for Azure internal management operations and not to expose your instance to the internet. More details [here](./api-management-howto-ip-addresses.md#ip-addresses-of-api-management-service-in-vnet).

- **Can I upgrade my stv1 instance to the same subnet?**

   - You can't migrate the stv1 instance to the same subnet in a single pass without downtime. However, you can optionally move your migrated instance back to the original subnet. More details [here](#optional-migrate-back-to-original-vnet-and-subnet).
   - The old gateway takes up to 48 hours to vacate the subnet, so that you can initiate the move. However, you can request for a faster release of the subnet by submitting the subscription IDs and the desired release time through a support ticket.
   - Releasing the old subnet calls for a purge of the old gateway, which forfeits the rollback to the old gateway if desired.
   - A new public IP is required for each switch
   - Ensure that the old subnet networking for [NSG](./api-management-using-with-internal-vnet.md?tabs=stv2#configure-nsg-rules) and [firewall](./api-management-using-with-vnet.md?tabs=stv2#force-tunnel-traffic-to-on-premises-firewall-using-expressroute-or-network-virtual-appliance) is updated for `stv2` dependencies.

- **Can I test the new gateway before switching the live traffic?**

   - Post successful migration, the old and the new managed gateways are active to receive traffic. The old gateway remains active for 48 hours. 
   - The migration process automatically updates the default domain names, and if being used, the traffic routes to the new gateways immediately.
   - If custom domain names are in use, the corresponding DNS records might need to be updated with the new IP address if not using CNAME. Customers can update their host file to the new API Management IP and validate the instance before making the switch. During this validation process, the old gateway continues to serve the live traffic.

- **Are there any considerations when using default domain name?**

   Instances that are using the default DNS name in external mode have the DNS autoupdated by the migration process. Moreover, the management endpoint, which always uses the default domain name is automatically updated by the migration process. Since the switch happens immediately on a successful migration, the new instance starts receiving traffic immediately, and it's critical that any networking restrictions/dependencies are taken care of upfront to avoid impacted APIs being unavailable. 

- **What should we consider for self hosted gateways?**

   You don't need to do anything in your self-hosted gateways. You just need to migrate API Management instances running in Azure that are impacted by the `stv1` platform retirement. Note that there could be a new IP for the Configuration endpoint of the API Management instance, and any networking restrictions pinned to the IP should be updated.

- **How is the developer portal impacted by migration?**

   There's no impact on developer portal. If custom domains are used, the DNS record should be updated with the effective IP, post migration. However, if the default domains are in use, they're automatically updated on successful migration. There's no downtime for the developer portal during the migration.

- **Is there any impact on cost once we migrated to stv2?**

   The billing model remains the same for `stv2` and there won't be any more cost incurred after the migration.

- **How can we get help during migration?**

   Check details [here](#help-and-support).


## Related content

* Learn about [stv1 platform retirement](breaking-changes/stv1-platform-retirement-august-2024.md).
* Learn about [IP addresses of API Management](api-management-howto-ip-addresses.md)
* For instances deployed in a VNet, see the [Virtual network configuration reference](virtual-network-reference.md).

