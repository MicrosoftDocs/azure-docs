---
title: Azure Cosmos DB for Table resource lock operations
description: Use Azure CLI to create, list, show properties for, and delete resource locks for an Azure Cosmos DB for Table table.
author: seesharprun
ms.author: sidandrews
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.subservice: table
ms.topic: sample
ms.date: 06/16/2022
ms.custom: kr2b-contr-experiment, devx-track-azurecli
---

# Use Azure CLI for resource lock operations on Azure Cosmos DB for Table tables

[!INCLUDE[Table](../../../includes/appliesto-table.md)]

The script in this article demonstrates performing resource lock operations for a API for Table table.

> [!IMPORTANT]
> To enable resource locking, the Azure Cosmos DB account must have the `disableKeyBasedMetadataWriteAccess` property enabled. This property prevents any changes to resources from clients that connect via account keys, such as the Azure Cosmos DB Table SDK, Azure Storage Table SDK, or Azure portal. For more information, see [Preventing changes from SDKs](../../../role-based-access-control.md#prevent-sdk-changes).

## Prerequisites

- You need an [Azure Cosmos DB for Table account, database, and table created](create.md). [!INCLUDE [quickstarts-free-trial-note](../../../../../includes/quickstarts-free-trial-note.md)]

  > [!IMPORTANT]
  > To create or delete resource locks, you must have the **Owner** role in your Azure subscription.

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

The following script uses Azure CLI [az lock](/cli/azure/lock) commands to manipulate resource locks on your Azure Cosmos DB for Table table. The script needs the `resourceGroup`, `account` name, and `table` name for the Azure Cosmos DB account and table you created.

- [az lock create](/cli/azure/lock#az-lock-create) creates a `CanNotDelete` resource lock on the table.
- [az lock list](/cli/azure/lock#az-lock-list) lists all the lock information for your Azure Cosmos DB Table account.
- [az lock delete](/cli/azure/lock#az-lock-delete) uses [az lock show](/cli/azure/lock#az-lock-show) to get the `id` of the lock on your table, and then uses the `lockid` property to delete the lock.

:::code language="azurecli" source="~/azure_cli_scripts/cosmosdb/table/lock.sh" id="FullScript":::

## Clean up resources

If you no longer need the resources you created, use the [az group delete](/cli/azure/group#az-group-delete) command to delete the resource group and all resources it contains. These resources include the Azure Cosmos DB account and table. The resources might take a while to delete.

```azurecli
az group delete --name $resourceGroup
```

## Next steps

- [Prevent Azure Cosmos DB resources from being deleted or changed](../../../resource-locks.md)
- [Lock resources to prevent unexpected changes](../../../../azure-resource-manager/management/lock-resources.md)
- [How to audit Azure Cosmos DB control plane operations](../../../audit-control-plane-logs.md)
- [Azure Cosmos DB CLI documentation](/cli/azure/cosmosdb)
- [Azure Cosmos DB CLI GitHub repository](https://github.com/Azure-Samples/azure-cli-samples/tree/master/cosmosdb)
