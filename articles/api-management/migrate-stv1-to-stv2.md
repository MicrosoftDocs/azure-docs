---
title: Migrate Azure API Management instance to stv2 platform  | Microsoft Docs
description: Follow the steps in this article to migrate your Azure API Management instance automatically from the stv1 compute platform to the stv2 compute platform. Migration steps depend on whether the instance is deployed (injected) in a VNet.

author: dlepow
ms.service: api-management
ms.custom: 
ms.topic: how-to
ms.date: 01/20/2023
ms.author: danlep

---

# Migrate an API Management instance hosted on the stv1 platform to stv2

An API Management instance hosted on the `stv1` compute platform can be migrated to the `stv2` platform. Migration steps depend on whether or not your API Management is currently deployed (injected) in an [external](api-management-using-with-vnet.md) or [internal](api-management-using-with-internal-vnet.md) VNet.

* **Non-VNet-injected API Management instance** - Use the [Migrate to stv2](/rest/api/apimanagement/current-preview/api-management-service/migratetostv2) REST API

* **VNet-injected API Management instance** - Update the VNet connection, or enable zone redundancy

For more information about the `stv1` and `stv2` platforms, see [Compute platform for API Management](compute-infrastructure.md).

> [!IMPORTANT]
> * Migration is a long-running operation and could take several minutes to complete. Your instance will experience downtime during the migration.
> * Migration to `stv2` is not reversible.

[!INCLUDE [api-management-availability-premium-dev-standard-basic](../../includes/api-management-availability-premium-dev-standard-basic.md)]

## Prerequisites

* An API Management instance hosted on the `stv1` compute platform. To confirm that your instance is hosted on the `stv1` platform, see [How do I know which platform hosts my API Management instance?](compute-infrastructure.md#how-do-i-know-which-platform-hosts-my-api-management-instance).

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

## Scenario 1: Migrate API Management instance, not injected in a VNet

For an API Management instance that's not deployed in a VNet, run the following Azure CLI commands to invoke the Migrate to `stv2` REST API. Where indicated, set variables with the name of your API Management instance and the name of the resource group in which it was created.

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
az rest --method post --uri "$APIM_RESOURCE_ID/migrateToStv2?api-version=2022-04-01-preview"
```

## Scenario 2: Migrate a network-injected API Management instance

Trigger migration of a network-injected API Management instance to the `stv2` platform by updating the existing network configuration (see the following section), or enable [zone redundancy](../reliability/migrate-api-mgt.md).

### Update VNet configuration

#### Prerequisites

* A new or existing virtual network and subnet in the same region and subscription as your API Management instance. The subnet must be different from the one currently used for the instance hosted on the `stv1` platform, and a network security group must be attached.

* A new or existing Standard SKU [public IPv4 address](../virtual-network/ip-services/public-ip-addresses.md#sku) resource in the same region and subscription as your API Management instance.

For more information, see [Prerequisites for network connections](api-management-using-with-vnet.md#prerequisites).
#### Update VNet configuration

To update the existing external or internal VNet configuration:

1. In the [portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, select **Network** > **Virtual network**.
1. Select the network connection in the location you want to update.
1. Select the virtual network, subnet, and IP address resources you want to configure, and select **Apply**.
1. Continue configuring VNet settings for the remaining locations of your API Management instance.
1. In the top navigation bar, select **Save**, then select **Apply network configuration**.

The virtual network configuration is updated, and the instance is migrated to the `stv2` platform.

> [!NOTE]
> * Updating the VNet configuration takes from 15 to 45 minutes to complete.
> * The VIP address(es) of your API Management instance will change.


## Verify migration

To verify that the migration was successful, check the [`platformVersion` property](compute-infrastructure.md#how-do-i-know-which-platform-hosts-my-api-management-instance) of your API Management instance. After successful migration, the value is `stv2`.

## Next steps

* Learn about [stv1 platform retirement](breaking-changes/stv1-platform-retirement-august-2024.md).