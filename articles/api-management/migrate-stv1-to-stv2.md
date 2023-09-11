---
title: Migrate Azure API Management instance to stv2 platform  | Microsoft Docs
description: Follow these steps to migrate your Azure API Management instance from the stv1 compute platform to the stv2 compute platform. Migration steps depend on whether the instance is deployed (injected) in a VNet.

author: dlepow
ms.service: api-management
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 07/31/2023
ms.author: danlep
---

# Migrate an API Management instance hosted on the stv1 platform to stv2

You can migrate an API Management instance hosted on the `stv1` compute platform to the `stv2` platform. This article provides migration steps for two scenarios, depending on whether or not your API Management instance is currently deployed (injected) in an [external](api-management-using-with-vnet.md) or [internal](api-management-using-with-internal-vnet.md) VNet.

* **Non-VNet-injected API Management instance** - Use the [Migrate to stv2](/rest/api/apimanagement/current-ga/api-management-service/migratetostv2) REST API

* **VNet-injected API Management instance** - Manually update the VNet configuration settings

For more information about the `stv1` and `stv2` platforms and the benefits of using the `stv2` platform, see [Compute platform for API Management](compute-infrastructure.md).

> [!IMPORTANT]
> * Migration is a long-running operation. Your instance will experience downtime during the last 10-15 minutes of migration. Plan your migration accordingly.
> * The VIP address(es) of your API Management will change if you're using scenario 2 mentioned below (service injected in a VNet). For scenario 1 (not injected in a VNet), the VIP will temporarily change during migration for up to 15 minutes, but the original VIP of the service will be restored at the end of the migration operation. 
> * Migration to `stv2` is not reversible.

> [!IMPORTANT]
> Support for API Management instances hosted on the `stv1` platform will be [retired by 31 August 2024](breaking-changes/stv1-platform-retirement-august-2024.md). To ensure proper operation of your API Management instance, you should migrate any instance hosted on the `stv1` platform to `stv2` before that date.

[!INCLUDE [api-management-availability-premium-dev-standard-basic](../../includes/api-management-availability-premium-dev-standard-basic.md)]

## Prerequisites

* An API Management instance hosted on the `stv1` compute platform. To confirm that your instance is hosted on the `stv1` platform, see [How do I know which platform hosts my API Management instance?](compute-infrastructure.md#how-do-i-know-which-platform-hosts-my-api-management-instance).

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

## Scenario 1: Migrate API Management instance, not injected in a VNet

For an API Management instance that's not deployed in a VNet, invoke the Migrate to `stv2` REST API. For example, run the following Azure CLI commands, setting variables where indicated with the name of your API Management instance and the name of the resource group in which it was created.

> [!NOTE]
> The Migrate to `stv2` REST API is available starting in API Management REST API version `2022-04-01-preview`.


```azurecli
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

# Call REST API to migrate to stv2
az rest --method post --uri "$APIM_RESOURCE_ID/migrateToStv2?api-version=2022-08-01"
```

## Scenario 2: Migrate a network-injected API Management instance

Trigger migration of a network-injected API Management instance to the `stv2` platform by updating the existing network configuration to use new network settings (see the following section). After that update completes, as an optional step, you may migrate back to the original VNet and subnet you used.

You can also migrate to the `stv2` platform by enabling [zone redundancy](../reliability/migrate-api-mgt.md).

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

You may optionally migrate back to the original VNet and subnet you used in each region before migration to the `stv2` platform. To do so, update the VNet configuration again, this time specifying the original VNet and subnet. As in the preceding migration, expect a long-running operation, and expect the VIP address to change.

#### Prerequisites

* The original subnet and VNet. A network security group must be attached to the subnet, and [NSG rules](api-management-using-with-vnet.md#configure-nsg-rules) for API Management must be configured.

* A new Standard SKU [public IPv4 address](../virtual-network/ip-services/public-ip-addresses.md#sku) resource in the same region and subscription as your API Management instance.


#### Update VNet configuration

1. In the [portal](https://portal.azure.com), navigate to your original VNet.
1. In the left menu, select **Subnets**, and then the original subnet. 
1. Verify that the original IP addresses were released by API Management. Under **Available IPs**, note the number of IP addresses available in the subnet. All addresses (except for Azure reserved addresses) should be available. If necessary, wait for IP addresses to be released. 
1. Repeat the migration steps in the preceding section. In each region, specify the original VNet and subnet, and a new IP address resource.

## Verify migration

To verify that the migration was successful, check the [platform version](compute-infrastructure.md#how-do-i-know-which-platform-hosts-my-api-management-instance) of your API Management instance. After successful migration, the value is `stv2`.

## Next steps

* Learn about [stv1 platform retirement](breaking-changes/stv1-platform-retirement-august-2024.md).
* For instances deployed in a VNet, see the [Virtual network configuration reference](virtual-network-reference.md).
