---
title: Get usage data with the Azure CLI
description: This article explains how you get usage data with the Azure CLI.
author: bandersmsft
ms.author: banders
ms.date: 05/18/2022
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: adwise
---

# Get usage data with the Azure CLI

This article explains how you get cost and usage data with the Azure CLI. If you want to get usage data using the Azure portal, see [View and download your Azure usage and charges](../understand/download-azure-daily-usage.md).

## Set up the Azure CLI

Start by preparing your environment for the Azure CLI.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](../../../includes/azure-cli-prepare-your-environment-no-header.md)]

## Configure an export job to export cost data to Azure storage

After you sign in, use the [export](/cli/azure/costmanagement/export) commands to export usage data to an Azure storage account. You can download the data from there.

1. Create a resource group or use an existing resource group. To create a resource group, run the [group create](/cli/azure/group#az_group_create) command:

    ```azurecli
    az group create --name TreyNetwork --location "East US"
    ```
1. Create a storage account to receive the exports or use an existing storage account. To create an account, use the [storage account create](/cli/azure/storage/account#az_storage_account_create) command:

    ```azurecli
    az storage account create --resource-group TreyNetwork --name cmdemo
    ```

1. Run the [export create](/cli/azure/costmanagement/export#az_costmanagement_export_create) command to create the export:

    ```azurecli
    az costmanagement export create --name DemoExport --type Usage \--scope "subscriptions/00000000-0000-0000-0000-000000000000" --storage-account-id cmdemo \--storage-container democontainer --timeframe MonthToDate --storage-directory demodirectory
    ```

## Get cost summaries for a scope

You can also use the [query](/cli/azure/costmanagement#az_costmanagement_query) command to query month-to-date usage information for your subscription. It gives you summarized cost data instead of the raw usage data. To learn more about querying your cost data, see [Query API](/rest/api/cost-management/query/usage).

```azurecli
az costmanagement query --timeframe MonthToDate --type Usage \   --scope "subscriptions/00000000-0000-0000-0000-000000000000"
```

You can also narrow the query by using the `--dataset-filter` parameter or other parameters:

```azurecli
az costmanagement query --timeframe MonthToDate --type Usage \   --scope "subscriptions/00000000-0000-0000-0000-000000000000" \   --dataset-filter "{\"and\":[{\"or\":[{\"dimension\":{\"name\":\"ResourceLocation\",\"operator\":\"In\",\"values\":[\"East US\",\"West Europe\"]}},{\"tag\":{\"name\":\"Environment\",\"operator\":\"In\",\"values\":[\"UAT\",\"Prod\"]}}]},{\"dimension\":{\"name\":\"ResourceGroup\",\"operator\":\"In\",\"values\":[\"API\"]}}]}"
```

The `--dataset-filter` parameter takes a JSON string or @json-file.

## Next steps

- Read the [Ingest usage details data](automation-ingest-usage-details-overview.md) article.
- Learn how to [Get small cost datasets on demand](get-small-usage-datasets-on-demand.md).
- [Understand usage details fields](understand-usage-details-fields.md).
- [Create and manage exported data](../costs/tutorial-export-acm-data.md) in the Azure portal with exports.
- [Automate Export creation](../costs/ingest-azure-usage-at-scale.md) and ingestion at scale using the API.