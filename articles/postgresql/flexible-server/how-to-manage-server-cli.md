---
title: Manage server - Azure CLI - Azure Database for PostgreSQL - Flexible Server
description: Learn how to manage an Azure Database for PostgreSQL - Flexible Server from the Azure CLI.
ms.service: postgresql
ms.subservice: flexible-server
ms.custom: devx-track-azurecli
ms.author: sunila
author: sunilagarwal
ms.reviewer: ""
ms.topic: how-to
ms.date: 11/30/2021
---

# Manage an Azure Database for PostgreSQL - Flexible Server by using the Azure CLI

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

This article shows you how to manage your flexible server deployed in Azure. Management tasks include compute and storage scaling, admin password reset, and viewing server details.

## Prerequisites

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin. 

You'll need to be running the Azure CLI version 2.0, or later, locally. To see the version installed, run the `az --version` command. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli).

Sign in to your account by using the [az login](/cli/azure/reference-index#az-login) command. 

```azurecli-interactive
az login
```

Select your subscription by using the [az account set](/cli/azure/account) command. Make a note of the **id** value from the **az login** output to use as the value for the **subscription** argument in the following command. If you have multiple subscriptions, choose the subscription to which the resource should be billed. To identify all your subscriptions, use the [az account list](/cli/azure/account#az-account-list) command.

```azurecli
az account set --subscription <subscription id>
```

> [!Important]
> If you haven't created a flexible server yet, you'll need to do so to follow this how-to guide.

## Scale compute and storage

> [!IMPORTANT]
> To scale the storage or compute, you must have at minimum READ permission on the owning resource group. 

You can easily scale up your compute tier, vCores, and storage by using the following command. For a list of all the server operations you can run, see the [az postgres flexible-server](/cli/azure/postgres/flexible-server) overview.

```azurecli-interactive
az postgres flexible-server update --resource-group myresourcegroup --name mydemoserver --sku-name Standard_D4ds_v3 --storage-size 6144
```

Following are the details for the arguments in the preceding code:

**Setting** | **Sample value** | **Description**
---|---|---
name | mydemoserver | Enter a unique name for your server. The server name can contain only lowercase letters, numbers, and the hyphen (-) character. It must contain 3 to 63 characters.
resource-group | myresourcegroup | Provide the name of the Azure resource group.
sku-name|Standard_D4ds_v3|Enter the name of the compute tier and size. The value follows the convention *Standard_{VM size}* in shorthand. See the [pricing tiers](../concepts-pricing-tiers.md) for more information.
storage-size | 6144 | Enter the storage capacity of the server in megabytes. The minimum is 5120, increasing in increments of 1024.

> [!IMPORTANT]
> You cannot scale down storage. 

## Manage PostgreSQL databases on a server

There are a number of applications you can use to connect to your Azure Database for PostgreSQL server. If your client computer has PostgreSQL installed, you can use a local instance of [psql](https://www.postgresql.org/docs/current/static/app-psql.html). Let's now use the psql command-line tool to connect to the Azure Database for PostgreSQL server.

1. Run the following **psql** command:

   ```bash
   psql --host=<servername> --port=<port> --username=<user> --dbname=<dbname>
   ```

   For example, the following command connects to the default database called **postgres** on your PostgreSQL server **mydemoserver.postgres.database.azure.com** through your access credentials. When you're prompted, enter the `<server_admin_password>` that you chose.
  
   ```bash
   psql --host=mydemoserver.postgres.database.azure.com --port=5432 --username=myadmin --dbname=postgres
   ```

   After you connect, the psql tool displays a **postgres** prompt where you can enter SQL commands. A warning will appear in the initial connection output if the version of psql you're using is different from the version on the Azure Database for PostgreSQL server.

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
   > "psql: FATAL:  no pg_hba.conf entry for host `<IP address>`, user "myadmin", database "postgres", SSL on FATAL: SSL connection is required. Specify SSL options and retry."
   >
   > Confirm your client's IP address is allowed in the firewall rules.

2. Create a blank database called **postgresdb** by typing the following command at the prompt:

    ```bash
    CREATE DATABASE postgresdb;
    ```

3. At the prompt, run the following command to switch connections to the newly created database **postgresdb**:

    ```bash
    \c postgresdb
    ```

4. Type  `\q` and select Enter to quit psql.

In this section, you connected to the Azure Database for PostgreSQL server via psql and created a blank user database.

## Reset the admin password

You can change the administrator role's password with the following command:

```azurecli-interactive
az postgres flexible-server update --resource-group myresourcegroup --name mydemoserver --admin-password <new-password>
```

> [!IMPORTANT]
> Choose a password that has a minimum of 8 characters and a maximum of 128 characters. The password must contain characters from three of the following categories: 
> - English uppercase letters
> - English lowercase letters
> - Numbers
> - Non-alphanumeric characters

## Delete a server

To delete the Azure Database for PostgreSQL flexible server, run the [az postgres flexible-server delete](/cli/azure/postgres/flexible-server#az-postgresql-flexible-server-delete) command.

```azurecli-interactive
az postgres flexible-server delete --resource-group myresourcegroup --name mydemoserver
```

## Next steps

- [Understand backup and restore concepts](concepts-backup-restore.md)
- [Tune and monitor the server](concepts-monitoring.md)
