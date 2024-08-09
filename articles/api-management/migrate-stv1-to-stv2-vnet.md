---
title: Migrate to stv2 platform - Azure API Management - VNet injected
description: Migrate your Azure API Management instance in-place from stv1 to stv2 compute platform. Follow these migration steps if your instance is deployed (injected) in an external or internal VNet.

author: dlepow
ms.service: azure-api-management
ms.custom:
ms.topic: how-to
ms.date: 08/09/2024
ms.author: danlep
---

# Migrate a VNet-injected API Management instance hosted on the stv1 platform to stv2

[!INCLUDE [api-management-availability-premium-dev](../../includes/api-management-availability-premium-dev.md)]

This article provides steps to migrate an API Management instance hosted on the `stv1` compute platform in-place to the `stv2` platform when the instance is injected (deployed) in an [external](api-management-using-with-vnet.md) or [internal](api-management-using-with-internal-vnet.md) VNet. For this scenario, migrate your instance by updating the VNet configuration settings. [Find out if you need to do this](compute-infrastructure.md#how-do-i-know-which-platform-hosts-my-api-management-instance).

If you need to migrate a *non-VNnet-injected* API Management hosted on the `stv1` platform, see [Migrate a non-VNet-injected API Management instance to the stv2 platform](migrate-stv1-to-stv2-no-vnet.md).

[!INCLUDE [api-management-migration-alert](../../includes/api-management-migration-alert.md)]

> [!CAUTION]
> * Migrating your API Management instance to the `stv2` platform is a long-running operation. 
> * For certain migration options, the VIP address(es) of your API Management instance will change. After migration, you'll need to update any network dependencies including DNS, firewall rules, and VNets to use the new VIP address(es). Plan your migration accordingly.
> * Migration to `stv2` is not reversible.

## Migration options

The following are the migration options that are currently available for VNet-injected API Management instances. The migration options vary based on the network mode (external or internal) of the API Management instance. Review this article for the latest updates.

> [!NOTE]
> For API Management instances deployed in multiple regions, you must repeat the migration steps for each region where the instance is deployed.

| Network mode | Option | Description | Notes |
| -------- | ------- | ----- |
| External VNet | [Migrate using portal](#migrate-using-portal)| Choose either a new IP address or to preserve IP address| |
| External VNet | [Migrate using REST API](#migrate-using-rest-api) | | |
| External VNet | [Update network configuration](#update-network-configuration) - Migrate to a new subnet in the same or a different VNet. Optionally migrate back to the original subnet. |
| Internal VNet | [Migrate using portal](#migrate-using-portal) | | |
| Internal VNet | [Migrating using REST API](#migrate-using-rest-api) | | |
| Internal VNet | [Update network configuration](#update-network-configuration) - Migrate to a new subnet in the same or a different VNet. Optionally migrate back to the original subnet. | | |

<!-- Delete or edit this section
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
* After successful migration, the old compute is automatically decommissioned after approximately 15 minutes by default. You can enable a migration setting to retain the old gateway for 48 hours. *The 48 hour delay option is only available for VNet-injected services.* 

 -->

## Prerequisites

* An API Management instance hosted on the `stv1` compute platform. To confirm that your instance is hosted on the `stv1` platform, see [How do I know which platform hosts my API Management instance?](compute-infrastructure.md#how-do-i-know-which-platform-hosts-my-api-management-instance) The instance must be injected in a virtual network.

* A new subnet in the current virtual network, in each region where the API Management instance is deployed. (Alternatively, set up a subnet in a different virtual network in the same regions and subscription as your API Management instance). A network security group must be attached to the subnet, and [NSG rules](api-management-using-with-vnet.md#configure-nsg-rules) for API Management must be configured.

* (Optional) A new Standard SKU [public IPv4 address](../virtual-network/ip-services/public-ip-addresses.md#sku) resource in the same region(s) and subscription as your API Management instance. For details, see [Prerequisites for network connections](api-management-using-with-vnet.md#prerequisites).

    [!INCLUDE [api-management-publicip-internal-vnet](../../includes/api-management-publicip-internal-vnet.md)]

## Migrate using Azure CLI

[!INCLUDE [api-management-migration-cli-steps](../../includes/api-management-migration-cli-steps.md)]


## Trigger migration of a network-injected API Management instance using the portal

Trigger migration of a network-injected API Management instance to the `stv2` platform by updating the existing network configuration to use new network settings in each region where the instance is deployed. After that update completes, as an optional step, you can migrate back to the original VNets and subnets you used.

You can also migrate to the `stv2` platform by enabling [zone redundancy](../reliability/migrate-api-mgt.md), available in the **Premium** tier.

> [!IMPORTANT]
> The VIP address(es) of your API Management instance will change. However, API requests remain responsive during migration. Infrastructure configuration (such as custom domains, locations, and CA certificates) will be locked for 30 minutes. After migration, you'll need to update any network dependencies including DNS, firewall rules, and peered VNets to use the new VIP address(es).

### Update network configuration

You can use the Azure portal to migrate to a new subnet in the same or a different VNet. The following image shows a high level overview of what happens during migration to a new subnet.

:::image type="content" source="media/migrate-stv1-to-stv2-vnet/inplace-new-subnet.gif" alt-text="Diagram of in-place migration to a new subnet.":::

#### [Portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, under **Settings**, select **Platform migration**.
1. On the **Platform migration** page, in **Step 1**, review migration requirements and prerequisites.
1. In **Step 2**, choose migration settings:
    * Select a location to migrate. 
    * Select the **Virtual network**, **Subnet**, and optional **Public IP address** you want to migrate to. 
    
        :::image type="content" source="media/migrate-stv1-to-stv2-vnet/select-location.png" alt-text="Screenshot of selecting network migration settings in the portal." lightbox="media/migrate-stv1-to-stv2-vnet/select-location.png":::

    * Select either **Return to original subnet as soon as possible** or **Stay in the new subnet and keep stv1 compute around for 48 hours** after migration. If you choose the former, the `stv1` compute will be deleted approximately 15 minutes after migration, allowing you to proceed directly with migration back to the original subnet if desired. If you choose the latter, the `stv1` compute is retained for 48 hours. You can use this period to validate your network settings and connectivity.

        :::image type="content" source="media/migrate-stv1-to-stv2-vnet/enable-retain-gateway-small.png" alt-text="Screenshot of options to retain stv1 compute in the portal." lightbox="media/migrate-stv1-to-stv2-vnet/enable-retain-gateway.png":::

1. In **Step 3**, confirm you want to migrate, and select **Migrate**. 
    The status of your API Management instance changes to **Updating**. The migration process takes approximately 45 minutes to complete. When the status changes to **Online**, migration is complete.

If your API Management instance is deployed in multiple regions, repeat the preceding steps to continue migrating VNet settings for the remaining locations of your instance.

---

## (Optional) Migrate back to original subnet

You can optionally migrate back to the original subnet you used in each region after migration to the `stv2` platform. To do so, update the VNet configuration again, this time specifying the original VNet and subnet in each region. As in the preceding migration, expect a long-running operation, and expect the VIP address to change.

The following image shows a high level overview of what happens during migration back to the original subnet.

:::image type="content" source="media/migrate-stv1-to-stv2-vnet/inplace-old-subnet.gif" alt-text="Diagram of in-place migration back to original subnet.":::

> [!IMPORTANT]
> If the VNet and subnet are locked (because other `stv1` platform-based API Management instances are deployed there) or the resource group where the original VNet is deployed has a [resource lock](../azure-resource-manager/management/lock-resources.md), make sure to remove the lock before migrating back to the original subnet. Wait for lock removal to complete before attempting the migration to the original subnet. [Learn more](api-management-using-with-internal-vnet.md#challenges-encountered-in-reassigning-api-management-instance-to-previous-subnet).


### Additional prerequisites

* The unlocked original subnet, in each region where the API Management instance is deployed. A network security group must be attached to the subnet, and [NSG rules](api-management-using-with-vnet.md#configure-nsg-rules) for API Management must be configured.

* (Optional) A new Standard SKU [public IPv4 address](../virtual-network/ip-services/public-ip-addresses.md#sku) resource in the same region(s) and subscription as your API Management instance.

    [!INCLUDE [api-management-publicip-internal-vnet](../../includes/api-management-publicip-internal-vnet.md)]

### Update VNet configuration

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

   For VNet-injected instances, you'll need a new subnet to migrate in each VNet (either external or internal mode). In external mode, optionally supply a public IP address resource. The subnet must have an NSG attached to it following the rules for `stv2` platform as described [here](./api-management-using-with-vnet.md?tabs=stv2#configure-nsg-rules).
  
- **Will the migration cause a downtime?**

   Since the old gateway is purged only after the new compute is healthy and online, there shouldn't be any downtime if default hostnames are in use. It's critical that all network dependencies are taken care of upfront, for the impacted APIs to be functional. However, if custom domains are in use, they'll be pointing to the purged compute until they're updated which may cause a downtime. Alternatively, enable a migration setting to retain the old gateway for 48 hours. Having the old and the new compute coexist will facilitate validation, and then you can update the custom DNS entries at will.
   

- **My traffic is force tunneled through a firewall. What changes are required?**

   - First of all, make sure that the new subnet(s) you created for the migration retains the following configuration (they should be already configured in your current subnet):
      - Enable service endpoints as described [here](./api-management-using-with-vnet.md?tabs=stv2#force-tunnel-traffic-to-on-premises-firewall-using-expressroute-or-network-virtual-appliance)
      - The UDR (user-defined route) has the hop from **ApiManagement** service tag set to "Internet" and not only to your firewall address
   - The [requirements for NSG configuration for stv2](./api-management-using-with-vnet.md?tabs=stv2#configure-nsg-rules) remain the same whether you have firewall or not; make sure your new subnet has it
   - Firewall rules referring to the current IP address range of the API Management instance should be updated to use the IP address range of your new subnet.

- **Can data or configuration losses occur by/during the migration?**

   `stv1` to `stv2` migration involves updating the compute platform alone and the internal storage layer isn't changed. Hence all the configuration is safe during the migration process. This includes the system-assigned managed identity, which if enabled is preserved.

- **How to confirm that the migration is complete and successful?**

   The migration is considered complete and successful when the status in the **Overview** page reads **Online** along with the platform version being either `stv2` or `stv2.1`. Also verify that the network status in the **Network** blade shows green for all required connectivity.

- **Can I do the migration using the portal?**

   Yes, VNet-injected instances can be migrated by changing the subnet configuration(s) in the **Platform migration** blade.

- **Can I preserve the IP address of the instance?**

   There's no way currently to preserve the IP address if your instance is injected into a VNet.
   
- **Is there a migration path without modifying the existing instance?**

   Yes, you need a [side-by-side migration](migrate-stv1-to-stv2.md#alternative-side-by-side-deployment). That means you create a new API Management instance in parallel with your current instance and copy the configuration over to the new instance. 

- **What happens if the migration fails?**

   If your API Management instance doesn't show the platform version as `stv2` or `stv2.1` and status as **Online** after you initiated the migration, it probably failed. Your service is automatically rolled back to the old instance and no changes are made. 

- **What functionality is not available during migration?**

   API requests remain responsive during migration. Infrastructure configuration (such as custom domains, locations, and CA certificates) is locked for 30 minutes. After migration, you'll need to update any network dependencies including DNS, firewall rules, and VNets to use the new VIP address.


- **How long will the migration take?**

   The expected duration for a migration to a new VNet configuration is approximately 45 minutes. The indicator to check if the migration was already performed is to check if Status of your instance is back to **Online** and not **Updating**. 

- **Is there a way to validate the VNet configuration before attempting migration?**

   You can deploy a new API Management instance with the new VNet, subnet, and (optional) IP address resource that you use for the actual migration. Navigate to the **Network status** page after the deployment is completed, and verify if every endpoint connectivity status is green. If yes, you can remove this new API Management instance and proceed with the real migration with your original `stv1`-hosted service.

- **Can I roll back the migration if required?**

  If there's a failure during the migration process, the instance will automatically roll back to the `stv1` platform. However, after the service migrates successfully, you can't roll back to the `stv1` platform. 

   After a VNet-injected service migrates successfully, there is a short window if time during which the old gateway continues to serve traffic and you can confirm your network settings. See [Confirm settings before old gateway is purged](#confirm-settings-before-old-gateway-is-purged)

- **Is there any change required in custom domain/private DNS zones?**

   With VNet-injected instances in internal mode, you'll need to update the private DNS zones to the new VNet IP address acquired after the migration. Pay attention to update non-Azure DNS zones, too (for example, your on-premises DNS servers pointing to API Management private IP address). However, in external mode, the migration process will automatically update the default domains if in use.

- **My stv1 instance is deployed to multiple Azure regions (multi-region). How do I upgrade to stv2?**

   Multi-region deployments include more managed gateways deployed in other locations. Migrate each location separately by updating the corresponding network settings - for example, using the **Platform migration** blade. The instance is considered migrated to the new platform only when all the locations are migrated. All regional gateways continue to operate normally throughout the migration process.


- **Can I upgrade my stv1 instance to the same subnet?**

   - You can't migrate the `stv1` instance to the same subnet in a single pass without downtime. However, you can optionally move your migrated instance back to the original subnet. More details [here](#optional-migrate-back-to-original-subnet).
   - The old gateway takes between 15 mins to 45 mins to vacate the subnet, so that you can initiate the move. However, you can enable a migration setting to retain the old gateway for 48 hours.
   - Ensure that the old subnet's networking for [NSG](./api-management-using-with-internal-vnet.md?tabs=stv2#configure-nsg-rules) and [firewall](./api-management-using-with-vnet.md?tabs=stv2#force-tunnel-traffic-to-on-premises-firewall-using-expressroute-or-network-virtual-appliance) is updated for `stv2` dependencies.
   - Subnet IP address allocation is nondeterministic, therefore the original ILB (ingress) IP for "internal mode" deployments may change when you move back to the original subnet. This would require a DNS change if you're using A records.

- **Can I test the new gateway before switching the live traffic?**

   - By default, the old and the new managed gateways coexist for 15 mins, which is a small window of time to validate the deployment. You can enable a migration setting to retain the old gateway for 48 hours. This change keeps the old and the new managed gateways active to receive traffic and facilitate validation.
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
