---
title: Create an Azure Cosmos DB for Table account and table with autoscale
description: Use Azure CLI to create a API for Table account and table with autoscale for Azure Cosmos DB.
author: seesharprun
ms.author: sidandrews
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.subservice: table
ms.topic: sample
ms.date: 06/22/2022
ms.custom: kr2b-contr-experiment, devx-track-azurecli
---

# Use Azure CLI to create an Azure Cosmos DB for Table account and table with autoscale

[!INCLUDE[Table](../../../includes/appliesto-table.md)]

The script in this article creates an Azure Cosmos DB for Table account and table with autoscale.

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](../../../../../includes/quickstarts-free-trial-note.md)]

- This script requires Azure CLI version 2.12.1 or later.

  - You can run the script in the Bash environment in [Azure Cloud Shell](../../../../cloud-shell/get-started.md). When Cloud Shell opens, make sure **Bash** appears in the environment field at the upper left of the shell window. Cloud Shell always has the latest version of Azure CLI.

    :::image type="icon" source="~/reusable-content/ce-skilling/azure/media/cloud-shell/launch-cloud-shell-button.png" alt-text="Button to launch the Azure Cloud Shell." border="false" link="https://shell.azure.com":::

    Cloud Shell is automatically authenticated under the account you used to sign in to the Azure portal. You can use [az account set](/cli/azure/account#az-account-set) to sign in with a different subscription, replacing `<subscriptionId>` with your Azure subscription ID.

    ```azurecli
    subscription="<subscriptionId>" # add subscription here

    az account set -s $subscription # ...or use 'az login'
    ```

  - If you prefer, you can [install Azure CLI](/cli/azure/install-azure-cli) to run the script locally. Run [az version](/cli/azure/reference-index?#az-version) to find the Azure CLI version and dependent libraries that are installed, and run [az upgrade](/cli/azure/reference-index?#az-upgrade) if you need to upgrade. If prompted, [install Azure CLI extensions](/cli/azure/azure-cli-extensions-overview). If you're running Windows or macOS, consider [running Azure CLI in a Docker container](/cli/azure/run-azure-cli-docker).

    If you're using a local installation, sign in to Azure by running [az login](/cli/azure/reference-index#az-login) and following the prompts. For other sign-in options, see [Sign in with the Azure CLI](/cli/azure/authenticate-azure-cli).

## Sample script

Run the following script to create an Azure resource group, an Azure Cosmos DB for Table account, and API for Table table with autoscale capability. The resources might take a while to create.

 :::code language="azurecli" source="~/azure_cli_scripts/cosmosdb/table/autoscale.sh" id="FullScript":::

This script uses the following commands:

- [az group create](/cli/azure/group#az-group-create) creates a resource group to store all resources.
- [az cosmosdb create](/cli/azure/cosmosdb#az-cosmosdb-create) with `--capabilities EnableTable` creates an Azure Cosmos DB account for API for Table.
- [az cosmosdb table create](/cli/azure/cosmosdb/table#az-cosmosdb-table-create) with `--max-throughput 1000` creates an Azure Cosmos DB for Table table with autoscale capabilities.

## Clean up resources

If you no longer need the resources you created, use the [az group delete](/cli/azure/group#az-group-delete) command to delete the resource group and all resources it contains. These resources include the Azure Cosmos DB account and table. The resources might take a while to delete.

```azurecli
az group delete --name $resourceGroup
```

## Next steps

- [Azure Cosmos DB CLI documentation](/cli/azure/cosmosdb)
- [Throughput (RU/s) operations with Azure CLI for a table for Azure Cosmos DB for Table](throughput.md)
