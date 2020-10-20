---
title: Manage server - Azure CLI - Azure Database for PostgreSQL - Flexible Server
description: Learn how to manage an Azure Database for PostgreSQL - Flexible Server from the Azure CLI.
author: mksuni
ms.author: sumuth
ms.service: postgresql
ms.topic: how-to
ms.date: 09/22/2020
---

# Manage an Azure Database for PostgreSQL - Flexible Server using the Azure CLI

> [!IMPORTANT]
> Azure Database for PostgreSQL - Flexible Server is in preview

This article shows you how to manage your Flexible Server deployed in Azure. Management tasks include compute and storage scaling, admin password reset, and viewing server details.

## Prerequisites
If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin. This article requires that you're running the Azure CLI version 2.0 or later locally. To see the version installed, run the `az --version` command. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

You'll need to log in to your account using the [az login](https://docs.microsoft.com/cli/azure/reference-index#az-login) command. Note the **id** property, which refers to **Subscription ID** for your Azure account.

```azurecli-interactive
az login
```

Select the specific subscription under your account using [az account set](/cli/azure/account) command. Make a note of the **id** value from the **az login** output to use as the value for **subscription** argument in the command. If you have multiple subscriptions, choose the appropriate subscription in which the resource should be billed. To get all your subscription, use [az account list](https://docs.microsoft.com/cli/azure/account#az-account-list).

```azurecli
az account set --subscription <subscription id>
```

> [!Important]
> If you have not already created a flexible server yet, please create one to get started with this how to guide.

## Scale compute and storage

You can scale up your compute tier, vCores, and storage easily using the following command. You can see all the server operation you can run [az postgres flexible-server server overview](https://azure.microsoft.com/services/postgresql/)

```azurecli-interactive
az postgres flexible-server update --resource-group myresourcegroup --name mydemoserver --sku-name Standard_D4ds_v3 --storage-size 6144
```

Here are the details for arguments above :

**Setting** | **Sample value** | **Description**
---|---|---
name | mydemoserver | Enter a unique name for your server. The server name can contain only lowercase letters, numbers, and the hyphen (-) character. It must contain from 3 to 63 characters.
resource-group | myresourcegroup | Provide the name of the Azure resource group.
sku-name|Standard_D4ds_v3|Enter the name of the compute tier and size. Follows the convention Standard_{VM size} in shorthand. See the [pricing tiers](../concepts-pricing-tiers.md) for more information.
storage-size | 6144 | The storage capacity of the server (unit is megabytes). Minimum 5120 and increases in 1024 increments.

> [!IMPORTANT]
> Storage can cannot be scaled down. 

## Manage PostgreSQL databases on a server

There are a number of applications you can use to connect to your Azure Database for PostgreSQL server. If your client computer has PostgreSQL installed, you can use a local instance of [psql](https://www.postgresql.org/docs/current/static/app-psql.html) to connect to an Azure PostgreSQL server. Let's now use the psql command-line utility to connect to the Azure PostgreSQL server.

1. Run the following psql command to connect to an Azure Database for PostgreSQL server

   ```bash
   psql --host=<servername> --port=<port> --username=<user> --dbname=<dbname>
   ```

   For example, the following command connects to the default database called **postgres** on your PostgreSQL server **mydemoserver.postgres.database.azure.com** using access credentials. Enter the `<server_admin_password>` you chose when prompted for password.
  
   ```bash
   psql --host=mydemoserver.postgres.database.azure.com --port=5432 --username=myadmin --dbname=postgres
   ```

   After you connect, the psql utility displays a postgres prompt where you type sql commands. In the initial connection output, a warning may appear because the psql you're using might be a different version than the Azure Database for PostgreSQL server version.

   Example psql output:

   ```bash
   psql (11.3, server 12.1)
   WARNING: psql major version 11, server major version 12.
            Some psql features might not work.
   SSL connection (protocol: TLSv1.2, cipher: ECDHE-RSA-AES256-GCM-SHA384, bits: 256, compression: off)
   Type "help" for help.

   postgres=>
   ```

   > [!TIP]
   > If the firewall is not configured to allow the IP address of your client, the following error occurs:
   >
   > "psql: FATAL:  no pg_hba.conf entry for host `<IP address>`, user "myadmin", database "postgres", SSL on FATAL: SSL connection is required. Specify SSL options and retry.
   >
   > Confirm your client's IP is allowed in the firewall rules step above.

2. Create a blank database called "postgresdb" at the prompt by typing the following command:

    ```bash
    CREATE DATABASE postgresdb;
    ```

3. At the prompt, execute the following command to switch connections to the newly created database **postgresdb**:

    ```bash
    \c postgresdb
    ```

4. Type  `\q`, and then select the Enter key to quit psql.

You connected to the Azure Database for PostgreSQL server via psql, and you created a blank user database.

## Reset admin password
You can change the administrator role's password with this command
```azurecli-interactive
az postgres flexible-server update --resource-group myresourcegroup --name mydemoserver --admin-password <new-password>
```

> [!IMPORTANT]
> Make sure password is minimum 8 characters and maximum 128 characters.
> Password must contain characters from three of the following categories: English uppercase letters, English lowercase letters, numbers, and non-alphanumeric characters.

## Delete a server

If you would just like to delete the PostgreSQL Flexible server, you can run [az postgres flexible-server delete](/cli/azure/PostgreSQL/server#az-PostgreSQL-flexible-server-delete) command.

```azurecli-interactive
az postgres flexible-server delete --resource-group myresourcegroup --name mydemoserver
```

## Next steps

- [Understand backup and restore concepts](concepts-backup-restore.md)
- [Tune and monitor the server](concepts-monitoring.md)
