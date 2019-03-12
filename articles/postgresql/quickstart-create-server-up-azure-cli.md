---
title: Quickstart - Create an Azure Database for PostgreSQL using the Azure CLI up command (preview)
description: Quickstart guide to create Azure Database for PostgreSQL server using Azure CLI (command line interface) up command.
author: rachel-msft
ms.author: raagyema
ms.service: postgresql
ms.devlang: azurecli
ms.topic: quickstart
ms.date: 3/11/2019
ms.custom: mvc
---
# Quickstart: Create an Azure Database for PostgreSQL using the Azure CLI up command (preview)

> [!IMPORTANT]
> The [az postgres up](/cli/azure/ext/db-up/postgres#ext-db-up-az-postgres-up) Azure CLI command is in preview.

Azure Database for PostgreSQL is a managed service that enables you to run, manage, and scale highly available PostgreSQL databases in the cloud. The Azure CLI is used to create and manage Azure resources from the command line or in scripts. This quickstart shows you how to use the [az postgres up](/cli/azure/ext/db-up/postgres#ext-db-up-az-postgres-up) command to create an Azure Database for PostgreSQL server in an [Azure resource group](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview) using the Azure CLI.


## Prerequisites
If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

This article requires that you're running the Azure CLI version 2.0 or later locally. To see the version installed, run the `az --version` command. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).

You'll need to login to your account using the [az login](/cli/azure/authenticate-azure-cli?view=interactive-log-in) command. Note the **id** property from the command output for the corresponding subscription name.
```azurecli
az login
```

If you have multiple subscriptions, choose the appropriate subscription in which the resource should be billed. Select the specific subscription ID under your account using [az account set](/cli/azure/account) command. Substitute the **subscription id** property from the **az login** output for your subscription into the subscription id placeholder.
```azurecli
az account set --subscription <subscription id>
```

## Create an Azure Database for PostgreSQL server
To use the commands, install the [db-up](/cli/azure/ext/db-up) extension. If an error is returned, ensure you have installed the latest version of the Azure CLI. See [Install Azure CLI]( /cli/azure/install-azure-cli).  

```azurecli
az extension add --name db-up
```

Create an Azure Database for PostgreSQL server using the command below:

```azurecli
az postgres up
```

The server is created with the following default values (unless you manually override them):

**Setting** | **Default value** | **Description**
---|---|---|
server-name | System generated |A unique name that identifies your Azure Database for PostgreSQL server. The server name can contain only lowercase letters, numbers, and the hyphen (-) character. It must contain from 3 to 63 characters.
resource-group | System generated | Provide the name of the Azure resource group.
sku-name | GP_Gen5_4 | The name of the sku. Follows the convention {pricing tier}_{compute generation}_{vCores} in shorthand.
backup-retention | 7 | How long a backup should be retained. Unit is days. Range is 7-35.
geo-redundant-backup | Disabled |  Whether geo-redundant backups should be enabled for this server or not. Allowed values: Enabled, Disabled.
location | westus2 | The Azure location for the server. You can configure the default location using `az configure --defaults location=<location>`
ssl-enforcement | Disabled | Whether ssl should be enabled or not for this server.
storage-size | 5120 |The storage capacity of the server (unit is megabytes). Valid storage-size is minimum 5120 MB and increases in 1024 MB increments. See the [pricing tiers](./concepts-pricing-tiers.md) document for more information about storage size limits.
version | 10 |  The PostgreSQL major version.
admin-user | System generated | The username for the administrator login. It cannot be **azure_superuser**, **admin**, **administrator**, **root**, **guest**, or **public**.
admin-password | System generated |  The password of the administrator user. It must contain between 8 and 128 characters. Your password must contain characters from three of the following categories: English uppercase letters, English lowercase letters, numbers, and non-alphanumeric characters.

The following are also automatically configured:
- Firewall rule called "devbox" is created. This Azure CLI attempts to detect the IP address of the machine the `az postgres up` command is run from and whitelists this IP address.
- Sets "Allow access to Azure services" to ON. This setting configures the server's firewall to accept connections from all Azure resources, including resources not in your subscription.
- Set `idle_in_transaction_session_timeout` parameter to 8 hours
- Creates an empty database named "sampledb"
- Creates a new user named "root" with privileges to "sampledb"

> [!NOTE]
> Azure PostgreSQL server communicates over port 5432. When connecting from within a corporate network, outbound traffic over port 5432 may not be allowed by your network's firewall. Have your IT department open port 5432 to connect to your Azure PostgreSQL server.

## Get the connection information
After the `az postgres up` command is completed, a list of connection strings for popular programming languages are returned to you. These connection strings are pre-configured with the specific attributes of your newly created Azure Database for PostgreSQL server.

In the future, you can use the [az postgres show-connection string](/cli/azure/ext/db-up/postgres#ext-db-up-az-postgres-show-connection-string) command to list these connection strings again.

## Clean up resources

Clean up all resources you created in the quickstart using the following command. This command deletes the Azure Database for PostgreSQL server and the resource group.

```azurecli
az postgres down --delete-group
```

If you would just like to delete the one newly created server, you can run [az postgres down](/cli/azure/ext/db-up/postgres#ext-db-up-az-postgres-down) command.
```azurecli
az postgres down
```

## Next steps
> [!div class="nextstepaction"]
> [Migrate your database using Export and Import](./howto-migrate-using-export-and-import.md)