---
title: 'Create an Azure Time Series Insights Gen2 environment using the Azure CLI - Azure Time Series Insights Gen2 | Microsoft Docs'
description: 'Learn how to set up an environment in Azure Time Series Insights Gen2 using the Azure CLI.'
author: deepakpalled
ms.author: dpalled
manager: diviso
ms.workload: big-data
ms.service: time-series-insights
services: time-series-insights
ms.topic: how-to
ms.date: 03/15/2021
ms.custom: seodec18, devx-track-azurecli
---

# Create an Azure Time Series Insights Gen2 environment using the Azure CLI

This document will guide you through creating a new Time Series Insights Gen2 Environment.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Prerequisites

* Create an Azure storage account for your environment's [cold store](./concepts-storage.md#cold-store). This account is designed for long-term retention and analytics for historical data.

> [!NOTE]
> In your code, replace `mytsicoldstore` with a unique name for your cold storage account.

First, create the storage account:

```azurecli-interactive
storage=mytsicoldstore
rg=-my-resource-group-name
az storage account create -g $rg -n $storage --https-only
key=$(az storage account keys list -g $rg -n $storage --query [0].value --output tsv
```

## Creating the environment

Now that the storage account is created and its name and management key are assigned to the variables, run the command below to create the Azure Time Series Insights Environment:

> [!NOTE]
> In your code, replace the following with unique names for your scenario:
>
> * `my-tsi-env` with your Environment name.
> * `my-ts-id-prop` with the name of your Time Series Id Property.

> [!IMPORTANT]
> Your environment's Time Series ID is like a database partition key. The Time Series ID also acts as the primary key for your Time Series Model.
>
> For more information, see [Best practices for choosing a Time Series ID.](./how-to-select-tsid.md)

```azurecli-interactive
az tsi environment gen2 create --name "my-tsi-env" --location eastus2 --resource-group $rg --sku name="L1" capacity=1 --time-series-id-properties name=my-ts-id-prop type=String --warm-store-configuration data-retention=P7D --storage-configuration account-name=$storage management-key=$key
```

## Remove an Azure Time Series Insights environment

You can use the Azure CLI to delete an individual resource, such as a Time Series Insights Environment, or delete a Resource Group and all its resources, including any Time Series Insights Environments.

To [delete a Time Series Insights Environments](/cli/azure/tsi/environment#az_tsi_environment_delete), run the following command:

```azurecli-interactive
az tsi environment delete --name "my-tsi-env" --resource-group $rg
```

To [delete the storage account](/cli/azure/storage/account#az_storage_account_delete), run the following command:

```azurecli-interactive
az storage account delete --name $storage --resource-group $rg
```

To [delete a resource group](/cli/azure/group#az_group_delete) and all its resources, run the following command:

```azurecli-interactive
az group delete --name $rg
```

## Next steps

* Learn about [streaming ingestion event sources](./concepts-streaming-ingestion-event-sources.md) for your Azure Time Series Insights Gen2 environment.
* Learn how to connect to an [IoT Hub](./how-to-ingest-data-iot-hub.md)
