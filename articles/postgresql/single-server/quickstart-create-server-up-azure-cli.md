---
title: 'Quickstart: Create server - az postgres up - Azure Database for PostgreSQL - Single Server'
description: Quickstart guide to create Azure Database for PostgreSQL - Single Server using Azure CLI (command-line interface) up command.
ms.service: postgresql
ms.subservice: single-server
ms.topic: quickstart
ms.author: sunila
author: sunilagarwal
ms.devlang: azurecli
ms.custom: devx-track-azurecli, mode-api
ms.date: 06/24/2022
---

# Quickstart: Use the az postgres up command to create an Azure Database for PostgreSQL - Single Server

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

Azure Database for PostgreSQL is a managed service that enables you to run, manage, and scale highly available PostgreSQL databases in the cloud. The Azure CLI is used to create and manage Azure resources from the command line or in scripts. This quickstart shows you how to use the [az postgres up](/cli/azure/postgres#az-postgres-up) command to create an Azure Database for PostgreSQL server using the Azure CLI. In addition to creating the server, the `az postgres up` command creates a sample database, a root user in the database, opens the firewall for Azure services, and creates default firewall rules for the client computer. These defaults help to expedite the development process.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Create an Azure Database for PostgreSQL server

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

Install the [db-up](/cli/azure/mysql) extension. If an error is returned, ensure you have installed the latest version of the Azure CLI. See [Install Azure CLI](/cli/azure/install-azure-cli).

```azurecli
az extension add --name db-up
```

Create an Azure Database for PostgreSQL server using the following command:

```azurecli
az postgres up
```

The server is created with the following default values (unless you manually override them):

**Setting** | **Default value** | **Description**
---|---|---
server-name | System generated | A unique name that identifies your Azure Database for PostgreSQL server.
resource-group | System generated | A new Azure resource group.
sku-name | GP_Gen5_2 | The name of the sku. Follows the convention {pricing tier}\_{compute generation}\_{vCores} in shorthand. The default is a General Purpose Gen5 server with 2 vCores. See our [pricing page](https://azure.microsoft.com/pricing/details/postgresql/) for more information about the tiers.
backup-retention | 7 | How long a backup is retained. Unit is days.
geo-redundant-backup | Disabled | Whether geo-redundant backups should be enabled for this server or not.
location | westus2 | The Azure location for the server.
ssl-enforcement | Disabled | Whether TLS/SSL should be enabled or not for this server.
storage-size | 5120 | The storage capacity of the server (unit is megabytes).
version | 10 | The PostgreSQL major version.
admin-user | System generated | The username for the administrator.
admin-password | System generated | The password of the administrator user.

> [!NOTE]
> For more information about the `az postgres up` command and its additional parameters, see the [Azure CLI documentation](/cli/azure/postgres#az-postgres-up).

Once your server is created, it comes with the following settings:

- A firewall rule called "devbox" is created. The Azure CLI attempts to detect the IP address of the machine the `az postgres up` command is run from and allows that IP address.
- "Allow access to Azure services" is set to ON. This setting configures the server's firewall to accept connections from all Azure resources, including resources not in your subscription.
- An empty database named "sampledb" is created
- A new user named "root" with privileges to "sampledb" is created

> [!NOTE]
> Azure Database for PostgreSQL communicates over port 5432. When connecting from within a corporate network, outbound traffic over port 5432 may not be allowed by your network's firewall. Have your IT department open port 5432 to connect to your server.

## Get the connection information

After the `az postgres up` command is completed, a list of connection strings for popular programming languages is returned to you. These connection strings are pre-configured with the specific attributes of your newly created Azure Database for PostgreSQL server.

You can use the [az postgres show-connection-string](/cli/azure/postgres#az-postgres-show-connection-string) command to list these connection strings again.

## Clean up resources

Clean up all resources you created in the quickstart using the following command. This command deletes the Azure Database for PostgreSQL server and the resource group.

```azurecli
az postgres down --delete-group
```

If you would just like to delete the newly created server, you can run [az postgres down](/cli/azure/postgres#az-postgres-down) command.

```azurecli
az postgres down
```

## Next steps

> [!div class="nextstepaction"]
> [Migrate your database using Export and Import](./how-to-migrate-using-export-and-import.md)
