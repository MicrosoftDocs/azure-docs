---
title: 'Quickstart: Create a Synapse SQL pool with Azure CLI'
description: Quickly create a Synapse SQL pool with a server-level firewall rule using the Azure CLI.
author: WilliamDAssafMSFT
ms.service: synapse-analytics
ms.topic: quickstart
ms.subservice: sql-dw
ms.date: 11/20/2020
ms.author: wiassaf
ms.tool: azure-cli
ms.custom: azure-synapse, mode-api, devx-track-azurecli
---
# Quickstart: Create a Synapse SQL pool with Azure CLI

Create a Synapse SQL pool (data warehouse) in Azure Synapse Analytics using the Azure CLI.

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Getting started

Use these commands to sign on to Azure and set up a resource group.

1. If you are using a local install, run the [az login](/cli/azure/reference-index#az-login) command to sign into Azure:

   ```azurecli
   az login
   ```

1. If needed, use the [az account set](/cli/azure/account#az-account-set) command to select your subscription:

   ```azurecli
   az account set --subscription 00000000-0000-0000-0000-000000000000
   ```

1. Run the [az group create](/cli/azure/group#az-group-create) command to create a resource group:

   ```azurecli
   az group create --name myResourceGroup --location WestEurope
   ```

1. Create a [logical SQL server](/azure/azure-sql/database/logical-servers?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) by using the [az sql server create](/cli/azure/sql/server#az-sql-server-create) command:

   ```azurecli
   az sql server create --resource-group myResourceGroup --name mysqlserver \
      --admin-user ServerAdmin --admin-password ChangeYourAdminPassword1
   ```

   A server contains a group of databases managed as a group.

## Configure a server-level firewall rule

Create a [server-level firewall rule](/azure/azure-sql/database/firewall-configure?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json). A server-level firewall rule allows an external application, such as SQL Server Management Studio or the SQLCMD utility, to connect to a SQL pool through the SQL pool service firewall.

Run the [az sql server firewall-rule create](/cli/azure/sql/server/firewall-rule#az-sql-server-firewall-rule-create) command to create a firewall rule:

```azurecli
az sql server firewall-rule create --resource-group myResourceGroup --name AllowSome \
   --server mysqlserver --start-ip-address 0.0.0.0 --end-ip-address 0.0.0.0
```

In this example, the firewall is only opened for other Azure resources. To enable external connectivity, change the IP address to an appropriate address for your environment. To open all IP addresses, use 0.0.0.0 as the starting IP address and 255.255.255.255 as the ending address.

> [!NOTE]
> SQL endpoints communicate over port 1433. If you're trying to connect from within a corporate network, outbound traffic over port 1433 may not be allowed by your network's firewall. If so, you won't be able to connect to your server unless your IT department opens port 1433.
>

## Create and manage your SQL pool

Create the SQL pool. This example uses DW100c as the service objective, which is a lower-cost starting point for your SQL pool.

> [!NOTE]
> You need a previously created workspace. For more information, see [Quickstart: Create an Azure synapse workspace with Azure CLI](../quickstart-create-workspace-cli.md).

Use the [az synapse sql pool create](/cli/azure/synapse/sql/pool#az-synapse-sql-pool-create) command to create the SQL pool:

```azurecli
az synapse sql pool create --resource-group myResourceGroup --name mySampleDataWarehouse \
   --performance-level "DW1000c" --workspace-name testsynapseworkspace
```

For more information on the parameter options, see [az synapse sql pool](/cli/azure/synapse/sql/pool).

You can see your SQL pools by using the [az synapse sql pool list](/cli/azure/synapse/sql/pool#az-synapse-sql-pool-list) command:

```azurecli
az synapse sql pool list --resource-group myResourceGroup --workspace-name testsynapseworkspace
```

Use the [az synapse sql pool update](/cli/azure/synapse/sql/pool#az-synapse-sql-pool-update) command to update an existing pool:

```azurecli
az synapse sql pool update --resource-group myResourceGroup --name mySampleDataWarehouse \
   --workspace-name testsynapseworkspace
```

Use the [az synapse sql pool pause](/cli/azure/synapse/sql/pool#az-synapse-sql-pool-pause) command to pause your pool:

```azurecli
az synapse sql pool pause --resource-group myResourceGroup --name mySampleDataWarehouse \
   --workspace-name testsynapseworkspace
```

Use the [az synapse sql pool resume](/cli/azure/synapse/sql/pool#az-synapse-sql-pool-resume) command to start a paused pool:

```azurecli
az synapse sql pool resume --resource-group myResourceGroup --name mySampleDataWarehouse \
   --workspace-name testsynapseworkspace
```

To remove an existing SQL pool, use the [az synapse sql pool delete](/cli/azure/synapse/sql/pool#az-synapse-sql-pool-delete) command:

```azurecli
az synapse sql pool delete --resource-group myResourceGroup --name mySampleDataWarehouse \
   --workspace-name testsynapseworkspace
```

## Clean up resources

Other quickstart tutorials in this collection build upon this quickstart.

> [!TIP]
> If you plan to continue on to work with later quickstart tutorials, don't clean up the resources created in this quickstart. If you don't plan to continue, use the [az group delete](/cli/azure/group#az-group-delete) command to delete all resources created by this quickstart.
>

```azurecli
az group delete --ResourceGroupName MyResourceGroup
```

## Next steps

You've now created a SQL pool, created a firewall rule, and connected to your SQL pool. To learn more, continue to the [Load data into SQL pool](./load-data-from-azure-blob-storage-using-copy.md) article.
