---
title: Configure intelligent tuning - Azure Database for PostgreSQL - Flexible Server - CLI
description: This article describes how to configure intelligent tuning in Azure Database for PostgreSQL - Flexible Server by using the Azure CLI.
ms.author: alkuchar
author: AwdotiaRomanowna
ms.service: postgresql
ms.subservice: flexible-server
ms.devlang: azurecli
ms.topic: how-to
ms.date: 06/02/2023
ms.custom: devx-track-azurecli
---

# Configure intelligent tuning for Azure Database for PostgreSQL - Flexible Server by using the Azure CLI

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

You can verify and update the intelligent tuning configuration for an Azure Database for PostgreSQL server by using the Azure CLI.

To learn more about intelligent tuning, see the [overview](concepts-intelligent-tuning.md).

## Prerequisites

- If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.
- Install or upgrade the Azure CLI to the latest version. See [Install the Azure CLI](/cli/azure/install-azure-cli).
- Sign in to your Azure account by using the [az login](/cli/azure/reference-index#az-login) command. Note the `id` property, which refers to the subscription ID for your Azure account.

    ```azurecli
    az login
    ````

- If you have multiple subscriptions, choose the appropriate subscription in which you want to create the server by using the ```az account set``` command:

    ```azurecli-interactive
    az account set --subscription <subscription id>
    ```

- If you haven't already created a PostgreSQL flexible server, create one by using the ```az postgres flexible-server create``` command:

    ```azurecli-interactive
    az postgres flexible-server create --resource-group myresourcegroup --name myservername
    ```

## Verify current settings

Use the [az postgres flexible-server parameter show](/cli/azure/postgres/flexible-server/parameter#az-postgres-flexible-server-parameter-show) command to confirm the current settings of the intelligent tuning feature.

You can verify if this feature is activated for the server `mydemoserver.postgres.database.azure.com` under the resource group `myresourcegroup` by using the following command:

```azurecli-interactive
az postgres flexible-server parameter show --resource-group myresourcegroup --server-name mydemoserver --name intelligent_tuning --query value
```

You can inspect the current setting of the `intelligent_tuning.metric_targets` server parameter by using the following command:

```azurecli-interactive
az postgres flexible-server parameter show --resource-group myresourcegroup --server-name mydemoserver --name intelligent_tuning.metric_targets --query value
```

## Enable intelligent tuning

To enable or disable intelligent tuning, use the [az postgres flexible-server parameter set](/cli/azure/postgres/flexible-server/parameter#az-postgres-flexible-server-parameter-set) command. You can choose among the following tuning targets: `none`, `Storage-checkpoint_completion_target`, `Storage-min_wal_size`,`Storage-max_wal_size`, `Storage-bgwriter_delay`, `tuning-autovacuum`, and `all`.

> [!IMPORTANT]
> Autovacuum tuning is currently supported for the General Purpose and Memory Optimized server compute tiers that have four or more vCores. The Burstable server compute tier is not supported.

1. Activate the intelligent tuning feature by using the following command:

   ```azurecli-interactive
   az postgres flexible-server parameter set --resource-group myresourcegroup --server-name mydemoserver --name intelligent_tuning --value ON
   ```

1. Select the tuning targets that you want to activate.

   - To activate all tuning targets, use the following command:

      ```azurecli-interactive
      az postgres flexible-server parameter set --resource-group myresourcegroup --server-name mydemoserver --name intelligent_tuning.metric_targets --value all
      ```

   - To enable autovacuum tuning only, use the following command:

      ```azurecli-interactive
      az postgres flexible-server parameter set --resource-group myresourcegroup --server-name mydemoserver --name intelligent_tuning.metric_targets --value tuning-autovacuum
      ```

   - To activate two tuning targets, use the following command:

     ```azurecli-interactive
     az postgres flexible-server parameter set --resource-group myresourcegroup --server-name mydemoserver --name intelligent_tuning.metric_targets --value tuning-autovacuum,Storage-bgwriter_delay
     ```

   If you want to reset a parameter's value to the default, simply exclude the optional `--value` parameter. The service then applies the default value. In the preceding example, the command would look like the following and would set `intelligent_tuning.metric_targets` to `none`:

   ```azurecli-interactive
   az postgres flexible-server parameter set --resource-group myresourcegroup --server-name mydemoserver --name intelligent_tuning.metric_targets
   ```

> [!NOTE]
> Both `intelligent_tuning` and `intelligent_tuning.metric_targets` server parameters are dynamic, meaning no server restart is required when their values are changed.

### Considerations for selecting values for tuning targets

When you're choosing values from the `intelligent_tuning.metric_targets` server parameter, take the following considerations into account:

* The `NONE` value takes precedence over all other values. If you choose `NONE` alongside any combination of other values, the parameter will be perceived as set to `NONE`. This is equivalent to `intelligent_tuning = OFF`, so no tuning will occur.

* The `ALL` value takes precedence over all other values, with the exception of `NONE`. If you choose `ALL` with any combination, barring `NONE`, all the listed parameters will undergo tuning.

* The `ALL` value encompasses all existing metric targets. This value will also automatically apply to any new metric targets that you might add in the future. This allows for comprehensive and future-proof tuning of your PostgreSQL server.

* If you want to include an additional tuning target, you need to specify both the existing and new tuning targets. For example, if `bgwriter_delay` is already enabled and you want to add autovacuum tuning, your command should look like this:

  ```azurecli-interactive
  az postgres flexible-server parameter set --resource-group myresourcegroup --server-name mydemoserver --name intelligent_tuning.metric_targets --value tuning-autovacuum,Storage-bgwriter_delay
  ```

  Specifying only a new value would overwrite the current settings. When you're adding a new tuning target, always ensure that you include the existing tuning targets in your command.

## Next steps

- [Perform intelligent tuning in Azure Database for PostgreSQL - Flexible Server](concepts-intelligent-tuning.md)
