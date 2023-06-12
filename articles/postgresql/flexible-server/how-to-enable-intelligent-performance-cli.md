---
title: Configure intelligent performance - Azure Database for PostgreSQL - Flexible Server
description: This article describes how to configure intelligent performance in Azure Database for PostgreSQL - Flexible Server using the Azure CLI.
ms.author: alkuchar
author: AwdotiaRomanowna
ms.service: postgresql
ms.subservice: flexible-server
ms.devlang: azurecli
ms.topic: how-to
ms.date: 06/02/2023
ms.custom: devx-track-azurecli
---

# Configure intelligent performance for Azure Database for PostgreSQL - Flexible Server using Azure CLI

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

You can verify and update intelligent performance configuration for an Azure PostgreSQL server using the Command Line Interface (Azure CLI). 

To learn more about intelligent tuning, see the [overview](concepts-intelligent-tuning.md).

## Prerequisites
- If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.
- Install or upgrade Azure CLI to the latest version. See [Install Azure CLI](/cli/azure/install-azure-cli).
-  Log in to Azure account using [az login](/cli/azure/reference-index#az-login) command. Note the **id** property, which refers to **Subscription ID** for your Azure account.

    ```azurecli
    az login
    ````

- If you have multiple subscriptions, choose the appropriate subscription in which you want to create the server using the ```az account set``` command.

    ```azurecli-interactive
    az account set --subscription <subscription id>
    ```

- Create a PostgreQL Flexible Server if you haven't already created one using the ```az postgres flexible-server create``` command.

    ```azurecli-interactive
    az postgres flexible-server create --resource-group myresourcegroup --name myservername
    ```

## Verify current settings

Use the [az postgres flexible-server parameter show](/cli/azure/postgres/flexible-server/parameter#az-postgres-flexible-server-parameter-show) to confirm the current settings of the intelligent performance feature.

You can verify if this feature is activated for the server **mydemoserver.postgres.database.azure.com** under the resource group **myresourcegroup** by using the command below.

```azurecli-interactive
az postgres flexible-server parameter show --resource-group myresourcegroup --server-name mydemoserver --name intelligent_tuning --query value
```

Also, you can inspect the current setting of the **intelligent_tuning.metric_targets** server parameter using:

```azurecli-interactive
az postgres flexible-server parameter show --resource-group myresourcegroup --server-name mydemoserver --name intelligent_tuning.metric_targets --query value
```

## Enable intelligent tuning

For enabling or disabling the intelligent tuning, and choosing among the following tuning targets: `none`, `Storage-checkpoint_completion_target`, `Storage-min_wal_size`,`Storage-max_wal_size`, `Storage-bgwriter_delay`, `tuning-autovacuum`, `all`, you should use the [az postgres flexible-server parameter set](/cli/azure/postgres/flexible-server/parameter#az-postgres-flexible-server-parameter-set) command. 

> [!IMPORTANT]
> Autovacuum tuning is currently supported for the General Purpose and Memory Optimized server compute tiers that have four or more vCores, Burstable server compute tier is not supported.

To begin with, activate the intelligent tuning feature with the following command.

```azurecli-interactive
az postgres flexible-server parameter set --resource-group myresourcegroup --server-name mydemoserver --name intelligent_tuning --value ON
```

Next, select the tuning targets you wish to activate.
For activating all tuning targets, use:

```azurecli-interactive
az postgres flexible-server parameter set --resource-group myresourcegroup --server-name mydemoserver --name intelligent_tuning.metric_targets --value all
```

For enabling autovacuum tuning only:

```azurecli-interactive
az postgres flexible-server parameter set --resource-group myresourcegroup --server-name mydemoserver --name intelligent_tuning.metric_targets --value tuning-autovacuum
```

For activating two tuning targets:

```azurecli-interactive
az postgres flexible-server parameter set --resource-group myresourcegroup --server-name mydemoserver --name intelligent_tuning.metric_targets --value tuning-autovacuum,Storage-bgwriter_delay
```


In case you wish to reset a parameter's value to default, simply exclude the optional `--value` parameter. The service then applies the default value. In the above example, it would look like the following and would set `intelligent_tuning.metric_targets` to `none`:

```azurecli-interactive
az postgres flexible-server parameter set --resource-group myresourcegroup --server-name mydemoserver --name intelligent_tuning.metric_targets
```

> [!NOTE]
> Both `intelligent_tuning` and `intelligent_tuning.metric_targets` server parameters are dynamic, meaning no server restart is required when their values are changed.

### Considerations for selecting `intelligent_tuning.metric_targets` values

When choosing values from the `intelligent_tuning.metric_targets` server parameter take the following considerations into account:

* The `NONE` value takes precedence over all other values. If `NONE` is chosen alongside any combination of other values, the parameter will be perceived as set to `NONE`. This is equivalent to `intelligent_tuning = OFF`, implying that no tuning will occur.

* The `ALL` value takes precedence over all other values, with the exception of `NONE` as detailed above. If `ALL` is chosen with any combination, barring `NONE`, all the listed parameters will undergo tuning. 
> [!NOTE]
> The `ALL` value encompasses all existing metric targets. Moreover, this value will also automatically apply to any new metric targets that might be added in the future. This allows for comprehensive and future-proof tuning of your PostgreSQL server.

* If you wish to include an additional tuning target, you will need to specify both the existing and new tuning targets. For example, if `bgwriter_delay` is already enabled, and you want to add autovacuum tuning, your command would look like this:
```azurecli-interactive
az postgres flexible-server parameter set --resource-group myresourcegroup --server-name mydemoserver --name intelligent_tuning.metric_targets --value tuning-autovacuum,Storage-bgwriter_delay
```
Please note that specifying only a new value would overwrite the current settings. So, when adding a new tuning target, always ensure that you include the existing tuning targets in your command.


## Next steps

- [Perform intelligent tuning in Azure Database for PostgreSQL - Flexible Server
](concepts-intelligent-tuning.md)
