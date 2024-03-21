---
title: Migrate to stv2 platform - Azure API Management - VNet injected
description: Migrate your Azure API Management instance in-place from the stv1 compute platform to the stv2 platform. Follow these migration steps if your API Management instance is deployed (injected) in an external or internal VNet.

author: dlepow
ms.service: api-management
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 03/14/2024
ms.author: danlep
---

# Migrate a VNet-injected API Management instance hosted on the stv1 platform to stv2

This article provides steps to migrate an API Management instance hosted on the `stv1` compute platform in-place to the `stv2` platform when the instance is injected (deployed) in an [external](api-management-using-with-vnet.md) or [internal](api-management-using-with-internal-vnet.md) VNet. For this scenario, migrate your instance by updating the VNet configuration settings. [Find out if you need to do this](compute-infrastructure.md#how-do-i-know-which-platform-hosts-my-api-management-instance).

If you need to migrate a *non-VNnet-injected* API Management hosted on the `stv1` platform, see [Migrate a non-VNet-injected API Management instance to the stv2 platform](migrate-stv1-to-stv2-no-vnet.md).

[!INCLUDE [api-management-migration-alert](../../includes/api-management-migration-alert.md)]

> [!CAUTION]
> * Migrating your API Management instance to the `stv2` platform is a long-running operation. 
> * The VIP address of your instance will change. After migration, you'll need to update any network dependencies including DNS, firewall rules, and VNets to use the new VIP address. Plan your migration accordingly.
> * Migration to `stv2` is not reversible.

[!INCLUDE [api-management-availability-premium-dev-standard-basic-no-v2](../../includes/api-management-availability-premium-dev-standard-basic-no-v2.md)]

## What happens during migration?

API Management platform migration from `stv1` to `stv2` involves updating the underlying compute alone and has no impact on the service/API configuration persisted in the storage layer.

* The upgrade process involves creating a new compute in parallel to the old compute, which can take up to 45 minutes.
* The API Management status in the Azure portal will be **Updating**.
* The VIP address (or addresses, for a multi-region deployment) of the instance will change. 
* Azure manages the management endpoint DNS, and updates to the new compute immediately on successful migration. 
* The gateway DNS still points to the old compute if a custom domain is in use. 
* If custom DNS isn't in use, the gateway and portal DNS points to the new compute immediately.
* For an instance in internal VNet mode, customer manages the DNS, so the DNS entries continue to point to old compute until updated by the customer.
* It's the DNS that points to either the new or the old compute and hence no downtime to the APIs.
* Changes are required to your firewall rules, if any, to allow the new compute subnet to reach the backends.
* After successful migration, the old compute is automatically decommissioned after approximately 15 minutes by default, with an option to delay it for up to 48 hours. *The 48 hour delay option is only available for VNet-injected services.* 

## Prerequisites

* An API Management instance hosted on the `stv1` compute platform. To confirm that your instance is hosted on the `stv1` platform, see [How do I know which platform hosts my API Management instance?](compute-infrastructure.md#how-do-i-know-which-platform-hosts-my-api-management-instance) The instance must be injected in a virtual network.

* A new subnet in the current virtual network, in each region where the API Management instance is deployed. (Alternatively, set up a subnet in a different virtual network in the same regions and subscription as your API Management instance). A network security group must be attached to the subnet, and [NSG rules](api-management-using-with-vnet.md#configure-nsg-rules) for API Management must be configured.

* A Standard SKU [public IPv4 address](../virtual-network/ip-services/public-ip-addresses.md#sku) resource in the same region(s) and subscription as your API Management instance. For details, see [Prerequisites for network connections](api-management-using-with-vnet.md#prerequisites).

   > [!IMPORTANT]
   > When you update the VNet configuration for migration to the `stv2` platform, you must provide a public IP address resource (or resources, if your API Management is deployed to multiple Azure regions), or migration won't succeed. In internal VNet mode, this public IP address is used only for Azure internal management operations and doesn't expose your gateway to the internet. Public backends may see the instance's public VIP as the caller IP.

* (Optional) Contact Azure support to request that the original service infrastructure is maintained in parallel for up to 48 hours after successful migration. This option extends the period when the old infrastructure is available after migration beyond the default of 15 minutes before it is purged. This option is available only for VNet-injected services to allow service owners to update network settings and test applications to use the new infrastructure. This extension request applies to all API Management instances in a subscription. 

   > [!NOTE]
   > If you plan to migrate your VNet-injected API Management instance back to the original subnet after migration, we recommend that you don't request the 48-hour extension. 
    

## Trigger migration of a network-injected API Management instance

Trigger migration of a network-injected API Management instance to the `stv2` platform by updating the existing network configuration to use new network settings in each region where the instance is deployed. After that update completes, as an optional step, you can migrate back to the original VNets and subnets you used.

You can also migrate to the `stv2` platform by enabling [zone redundancy](../reliability/migrate-api-mgt.md), available in the **Premium** tier.

> [!IMPORTANT]
> The VIP address(es) of your API Management instance will change. However, API requests remain responsive during migration. Infrastructure configuration (such as custom domains, locations, and CA certificates) will be locked for 30 minutes. After migration, you'll need to update any network dependencies including DNS, firewall rules, and peered VNets to use the new VIP address(es).

### Update network configuration

You can use the Azure portal or other Azure tools such to migrate to a new subnet in the same or a different VNet. The following image shows a high level overview of what happens during migration to a new subnet.

:::image type="content" source="media/migrate-stv1-to-stv2-vnet/inplace-new-subnet.gif" alt-text="Diagram of in-place migration to a new subnet.":::

For example, to use the portal:

1. In the [portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, select **Network** > **Virtual network**.
1. Select the network connection in the location you want to update.
1. Select the virtual network, subnet, and IP address resources you want to configure, and select **Apply**.
1. Continue configuring VNet settings for the remaining locations of your API Management instance.
1. In the top navigation bar, select **Save**, then select **Apply network configuration**.

After you update the VNet configuration, the status of your API Management instance changes to **Updating**. The migration process takes approximately 45 minutes to complete. When the status changes to **Online**, migration is complete.

## (Optional) Migrate back to original subnet

You can optionally migrate back to the original subnet you used in each region before migration to the `stv2` platform. To do so, update the VNet configuration again, this time specifying the original VNet and subnet in each region. As in the preceding migration, expect a long-running operation, and expect the VIP address to change.

The following image shows a high level overview of what happens during migration back to the original subnet.

:::image type="content" source="media/migrate-stv1-to-stv2-vnet/inplace-old-subnet.gif" alt-text="Diagram of in-place migration back to original subnet.":::

> [!IMPORTANT]
> If the VNet and subnet are locked (because other `stv1` platform-based API Management instances are deployed there) or the resource group where the original VNet is deployed has a [resource lock](../azure-resource-manager/management/lock-resources.md), make sure to remove the lock before migrating back to the original subnet. Wait for lock removal to complete before attempting the migration to the original subnet. [Learn more](api-management-using-with-internal-vnet.md#challenges-encountered-in-reassigning-api-management-instance-to-previous-subnet).

> [!NOTE]
> If you plan to migrate back to the original subnet, we recommend that you don't request the 48-hour extension on your subscription for maintaining the old infrastructure; otherwise, your migration will be delayed. If you need to cancel an extension, contact Azure support.

### Additional prerequisites

* The unlocked original subnet, in each region where the API Management instance is deployed. A network security group must be attached to the subnet, and [NSG rules](api-management-using-with-vnet.md#configure-nsg-rules) for API Management must be configured.

* A new Standard SKU [public IPv4 address](../virtual-network/ip-services/public-ip-addresses.md#sku) resource in the same region(s) and subscription as your API Management instance.


### Update VNet configuration

1. In the [portal](https://portal.azure.com), navigate to your original VNet.
1. In the left menu, select **Subnets**, and then the original subnet. 
1. Verify that the original IP addresses were released by API Management. Under **Available IPs**, note the number of IP addresses available in the subnet. All addresses (except for Azure reserved addresses) should be available. If necessary, wait for IP addresses to be released. 
1. Repeat the migration steps in the [preceding section](#trigger-migration-of-a-network-injected-api-management-instance). In each region, specify the original VNet and subnet, and a new IP address resource.
1. In the top navigation bar, select **Save**, then select **Apply network configuration**.

After you update the VNet configuration, the status of your API Management instance changes to **Updating**. The migration process takes approximately 45 minutes to complete. When the status changes to **Online**, migration is complete.

[!INCLUDE [api-management-validate-migration-to-stv2](../../includes/api-management-validate-migration-to-stv2.md)]

[!INCLUDE [api-management-migration-compute-coexist](../../includes/api-management-migration-compute-coexist.md)]

[!INCLUDE [api-management-migration-rollback](../../includes/api-management-migration-rollback.md)]

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

   For VNet-injected instances, you'll need a new subnet and public IP address to migrate in each VNet (either external or internal mode). The subnet must have an NSG attached to it following the rules for `stv2` platform as described [here](./api-management-using-with-vnet.md?tabs=stv2#configure-nsg-rules).
  
- **Will the migration cause a downtime?**

   Since the old gateway is purged only after the new compute is healthy and online, there shouldn't be any downtime if default hostnames are in use. It's critical that all network dependencies are taken care of upfront, for the impacted APIs to be functional. However, if custom domains are in use, they'll be pointing to the purged compute until they're updated which may cause a downtime. Alternatively, you can request for the old gateway to be retained for up to 48 hours by creating an Azure support ticket in advance. Having the old and the new compute coexist will facilitate validation, and then you can update the custom DNS entries at will.
   

- **My traffic is force tunneled through a firewall. What changes are required?**

   - First of all, make sure that the new subnet(s) you created for the migration retains the following configuration (they should be already configured in your current subnet):
      - Enable service endpoints as described [here](./api-management-using-with-vnet.md?tabs=stv2#force-tunnel-traffic-to-on-premises-firewall-using-expressroute-or-network-virtual-appliance)
      - The UDR (user-defined route) has the hop from **ApiManagement** service tag set to "Internet" and not only to your firewall address
   - The [requirements for NSG configuration for stv2](./api-management-using-with-vnet.md?tabs=stv2#configure-nsg-rules) remain the same whether you have firewall or not; make sure your new subnet has it
   - Firewall rules referring to the current IP address range of the API Management instance should be updated to use the IP address range of your new subnet.

- **Can data or configuration losses occur by/during the migration?**

   `stv1` to `stv2` migration involves updating the compute platform alone and the internal storage layer isn't changed. Hence all the configuration is safe during the migration process. This includes the system-assigned managed identity, which if enabled is preserved.

- **How to confirm that the migration is complete and successful?**

   The migration is considered complete and successful when the status in the overview page reads **Online** along with the platform version being either `stv2` or `stv2.1`. Also verify that the network status in the network blade shows green for all required connectivity.

- **Can I do the migration using the portal?**

   Yes, VNet-injected instances can be migrated by changing the subnet configuration(s) in the **Network** blade.

- **Can I preserve the IP address of the instance?**

   There's no way currently to preserve the IP address if your instance is injected into a VNet.
   
- **Is there a migration path without modifying the existing instance?**

   Yes, you need a [side-by-side migration](migrate-stv1-to-stv2.md#alternative-side-by-side-deployment). That means you create a new API Management instance in parallel with your current instance and copy the configuration over to the new instance. 

- **What happens if the migration fails?**

   If your API Management instance doesn't show the platform version as `stv2` or `stv2.1` and status as **Online** after you initiated the migration, it probably failed. Your service is automatically rolled back to the old instance and no changes are made. If you have problems (such as if status is **Updating** for more than 2 hours), contact Azure support.

- **What functionality is not available during migration?**

   API requests remain responsive during migration. Infrastructure configuration (such as custom domains, locations, and CA certificates) is locked for 30 minutes. After migration, you'll need to update any network dependencies including DNS, firewall rules, and VNets to use the new VIP address.


- **How long will the migration take?**

   The expected duration for a migration to a new VNet configuration is approximately 45 minutes. The indicator to check if the migration was already performed is to check if Status of your instance is back to **Online** and not **Updating**. If it says **Updating** for more than 2 hours, contact Azure support.

- **Is there a way to validate the VNet configuration before attempting migration?**

   You can optionally deploy a new API Management instance with the new VNet, subnet, and IP address resources that you use for the actual migration. Navigate to the **Network status** page after the deployment is completed, and verify if every endpoint connectivity status is green. If yes, you can remove this new API Management instance and proceed with the real migration with your original `stv1`-hosted service.

- **Can I roll back the migration if required?**

  If there's a failure during the migration process, the instance will automatically roll back to the `stv1` platform. However, after the service migrates successfully, you can't roll back to the `stv1` platform. 

   After a VNet-injected service migrates successfully, there is a short window if time during which the old gateway continues to serve traffic and you can confirm your network settings. See [Confirm settings before old gateway is purged](#confirm-settings-before-old-gateway-is-purged)

- **Is there any change required in custom domain/private DNS zones?**

   With VNet-injected instances in internal mode, you'll need to update the private DNS zones to the new VNet IP address acquired after the migration. Pay attention to update non-Azure DNS zones, too (for example, your on-premises DNS servers pointing to API Management private IP address). However, in external mode, the migration process will automatically update the default domains if in use.

- **My stv1 instance is deployed to multiple Azure regions (multi-region). How do I upgrade to stv2?**

   Multi-region deployments include more managed gateways deployed in other locations. Each location should be migrated separately by providing a new subnet and a new public IP.  Navigate to the **Locations** blade and perform the changes on each listed location. The instance is considered migrated to the new platform only when all the locations are migrated. All regional gateways continue to operate normally throughout the migration process.


- **Do we need a public IP even if the API Management instance is VNet injected in internal mode only?**

   API Management `stv1` uses an Azure managed public IP even in an internal mode for management traffic. However, `stv2` requires a user-managed public IP for the same purpose. This public IP is only used for Azure internal management operations and doesn't expose your instance to the internet. Public(internet-facing) backends may see the instance's public IP as the origin of the request. More details [here](./api-management-howto-ip-addresses.md#ip-addresses-of-api-management-service-in-vnet).

- **Can I upgrade my stv1 instance to the same subnet?**

   - You can't migrate the `stv1` instance to the same subnet in a single pass without downtime. However, you can optionally move your migrated instance back to the original subnet. More details [here](#optional-migrate-back-to-original-subnet).
   - The old gateway takes between 15 mins to 45 mins to vacate the subnet, so that you can initiate the move. However, you can request to increase this time to up to 48 hours by a support ticket.
   - A new public IP is required for each switch.
   - Ensure that the old subnet's networking for [NSG](./api-management-using-with-internal-vnet.md?tabs=stv2#configure-nsg-rules) and [firewall](./api-management-using-with-vnet.md?tabs=stv2#force-tunnel-traffic-to-on-premises-firewall-using-expressroute-or-network-virtual-appliance) is updated for `stv2` dependencies.
   - Subnet IP address allocation is nondeterministic, therefore the original ILB (ingress) IP for "internal mode" deployments may change when you move back to the original subnet. This would require a DNS change if you're using A records.

- **Can I test the new gateway before switching the live traffic?**

   - By default, the old and the new managed gateways coexist for 15 mins, which is a small window of time to validate the deployment. You can request to increase this time to up to 48 hours through an Azure support ticket. This change keeps the old and the new managed gateways active to receive traffic and facilitate validation.
   - The migration process automatically updates the default domain names, and if being used, the traffic routes to the new gateways immediately.
   - If custom domain names are in use, the corresponding DNS records might need to be updated with the new IP address if not using CNAME. Customers can update their hosts file to the new API Management IP and validate the instance before making the switch. During this validation process, the old gateway continues to serve the live traffic.

- **Are there any considerations when using default domain name?**

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

