---
title: 'Set up a Gen2 environment using Azure CLI- Azure Time Series Insights Gen2| Microsoft Docs'
description: 'Learn how to set up an environment in Azure Time Series Insights Gen2 using Azure CLI.'
author: deepakpalled
ms.author: dpalled
manager: diviso
ms.workload: big-data
ms.service: time-series-insights
services: time-series-insights
ms.topic: how-to
ms.date: 02/25/2021
ms.custom: seodec18
---

# Create a Gen2 environment using Azure CLI- Azure Time Series Insights Gen2

This document will guide you through creating a new Time Series Insights Gen2 Environment.

## Prerequisites

* Create an Azure storage account for your environment's [cold store](concepts-storage.md#cold-store). This account is designed for long-term retention and analytics for historical data.

> :warning: **Note**: In your code, replace `mytsicoldstore` with a unique name for your cold storage account.

First, create the Storage Account:

```azurecli-interactive
storage=mytsicoldstore
rg=-my-resource-group-name
az storage account create -g $rg -n $storage --https-only
key=$(az storage account keys list -g $rg -n $storage --query [0].value --output tsv
```

## Creating the Environment

Now that the Storage Account is created and its name and Management Key are assigned to the variables, run the command below to create the Time Series Insights Environment:

> :warning: **Note**: In your code, replace the following with unique names for your scenario:
> 
> - `my-tsi-env` with your Environment name.
> - `my-ts-id-prop` with the name of your Time Series Id Property.> 

```azurecli-interactive
az tsi environment gen2 create --name "my-tsi-env" --location eastus2 --resource-group $rg --sku name="L1" capacity=1 --time-series-id-properties name=my-ts-id-prop type=String --warm-store-configuration data-retention=P7D --storage-configuration account-name=$storage management-key=$key
```
