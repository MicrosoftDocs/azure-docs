---
title: Migrate Azure API Management instance to stv2 platform  | Microsoft Docs
description: Follow the steps in this article to migrate your Azure API Management instance automatically from the stv1 compute platform to the stv2 compute platform.

author: dlepow
ms.service: api-management
ms.custom: 
ms.topic: how-to
ms.date: 01/09/2023
ms.author: danlep

---

# Migrate an API Management hosted on the stv1 platform to stv2

An API Management instance hosted on the `stv1` platform can be automatically migrated to the `stv2` platform using the [Migrate to stv2](/rest/api/apimanagement/current-preview/api-management-service/migratetostv2?tabs=HTTP) REST API. For more information about the `stv1` and `stv2` platforms, see [Compute platform for API Management](compute-infrastructure.md).

> [!NOTE]
> The Migrate to `stv2` REST API requires API Management REST API version `2022-04-01-preview` or later.

> [!IMPORTANT]
> * Migration to `stv2` is not reversible.
> * Migration is a log-running operation and could take several minutes to complete.

[!INCLUDE [api-management-availability-premium-dev-standard-basic](../../includes/api-management-availability-premium-dev-standard-basic.md)]

## Prerequisites

* An API Management instance hosted on the `stv1` compute platform. To confirm that your instance is hosted on the `stv` platform, see [How do I know which platform hosts my API Management instance?](compute-infrastructure.md#how-do-i-know-which-platform-hosts-my-api-management-instance).

[!INCLUDE [azure-cli-prepare-your-environment-no-header](../../includes/azure-cli-prepare-your-environment-no-header.md)]

## Limitations
 
[Are there any, such as regions or networking?]

* Regions
* Networking


## Pre-migration actions

[Are there any? Any special considerations for APIM in VNet?]


## Migrate to stv2 using the Azure CLI

Run the following Azure CLI commands. Where indicated, set variables with the name of your API Management instance and the name of the resource group in which it was created.

```azurecli
# Update these variables with the name and resource group of your API Management instance
APIM_NAME="myAPIM"
RG_NAME="myResourceGroup"

# Get resource ID of API Management instance
APIM_RESOURCE_ID=$(az apim show --name $APIM_NAME --resource-group $RG_NAME --query id --output tsv)

# Call REST API to migrate to stv2
az rest --method post --uri "$APIM_RESOURCE_ID/migrateToStv2?api-version=2022-04-01-preview"
```

## Verify migration

To verify that the migration was successful, check the [`platformVersion` property](compute-infrastructure.md#how-do-i-know-which-platform-hosts-my-api-management-instance) of your API Management instance. After successful migration, the value is `stv2`.

## Next steps

* Learn about [stv1 platform retirement](breaking-changes/stv1-platform-retirement-august-2024.md).