---
title: 'Quickstart: Create server - Azure CLI - Azure Database for PostgreSQL - single server'
description: In this quickstart guide, you'll create an Azure Database for PostgreSQL server by using the Azure CLI.
ms.service: postgresql
ms.subservice: single-server
ms.topic: quickstart
ms.author: sunila
author: sunilagarwal
ms.devlang: azurecli
ms.custom: mvc, devx-track-azurecli, mode-api
ms.date: 06/24/2022
---

# Quickstart: Create an Azure Database for PostgreSQL server by using the Azure CLI

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

This quickstart shows how to use [Azure CLI](/cli/azure/get-started-with-azure-cli) commands in [Azure Cloud Shell](https://shell.azure.com) to create a single Azure Database for PostgreSQL server in five minutes.

> [!TIP]
> Consider using the simpler [az postgres up](/cli/azure/postgres#az-postgres-up) Azure CLI command. Try out the [quickstart](./quickstart-create-server-up-azure-cli.md).

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

## Set parameter values

The following values are used in subsequent commands to create the database and required resources. Server names need to be globally unique across all of Azure so the $RANDOM function is used to create the server name.

Change the location as appropriate for your environment. Replace `0.0.0.0` with the IP address range to match your specific environment. Use the public IP address of the computer you're using to restrict access to the server to only your IP address.

:::code language="azurecli" source="~/azure_cli_scripts/postgresql/create-postgresql-server-and-firewall-rule/create-postgresql-server-and-firewall-rule.sh" id="SetParameterValues":::

## Create a resource group

Create a resource group with the [az group create](/cli/azure/group) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. The following example creates a resource group named *myResourceGroup* in the *eastus* location:

:::code language="azurecli" source="~/azure_cli_scripts/postgresql/create-postgresql-server-and-firewall-rule/create-postgresql-server-and-firewall-rule.sh" id="CreateResourceGroup":::

## Create a server

Create a server with the [az postgres server create](/cli/azure/postgres/server#az-postgres-server-create) command.

:::code language="azurecli" source="~/azure_cli_scripts/postgresql/create-postgresql-server-and-firewall-rule/create-postgresql-server-and-firewall-rule.sh" id="CreateServer":::

> [!NOTE]
>
>- The server name can contain only lowercase letters, numbers, and the hyphen (-) character. It must contain 3 to 63 characters. For more information, see [Azure Database for PostgreSQL Naming Rules](../../azure-resource-manager/management/resource-name-rules.md#microsoftdbforpostgresql).
>- The user name for the admin user can't be **azure_superuser**, **admin**, **administrator**, **root**, **guest**, or **public**.
>- The password must contain 8 to 128 characters from three of the following categories: English uppercase letters, English lowercase letters, numbers, and non-alphanumeric characters.
>- For information about SKUs, see [Azure Database for PostgreSQL pricing](https://azure.microsoft.com/pricing/details/postgresql/server/).

>[!IMPORTANT]
>
>- The default PostgreSQL version on your server is 9.6. To see all the versions supported, see [Supported PostgreSQL major versions](./concepts-supported-versions.md).
>- SSL is enabled by default on your server. For more information on SSL, see [Configure SSL connectivity](./concepts-ssl-connection-security.md).

## Configure a server-based firewall rule

Create a firewall rule with the [az postgres server firewall-rule create](/cli/azure/postgres/server/firewall-rule) command to give your local environment access to connect to the server.

:::code language="azurecli" source="~/azure_cli_scripts/postgresql/create-postgresql-server-and-firewall-rule/create-postgresql-server-and-firewall-rule.sh" id="CreateFirewallRule":::

> [!TIP]
> If you don't know your IP address, go to [WhatIsMyIPAddress.com](https://whatismyipaddress.com/) to get it.

> [!NOTE]
> To avoid connectivity issues, make sure your network's firewall allows port 5432. Azure Database for PostgreSQL servers use that port.

## List server-based firewall rules

To list the existing server firewall rules, run the [az postgres server firewall-rule list](/cli/azure/postgres/server/firewall-rule) command.

:::code language="azurecli" source="~/azure_cli_scripts/postgresql/create-postgresql-server-and-firewall-rule/create-postgresql-server-and-firewall-rule.sh" id="ListFirewallRules":::

The output lists the firewall rules, if any, by default in JSON format. You may use the switch `--output table` for a more readable table format as the output.

## Get the connection information

To connect to your server, provide host information and access credentials.

```azurecli
az postgres server show --resource-group $resourceGroup --name $server
```

Make a note of the **administratorLogin** and **fullyQualifiedDomainName** values.

## Connect to the Azure Database for PostgreSQL server by using psql

The [psql](https://www.postgresql.org/docs/current/static/app-psql.html) client is a popular choice for connecting to PostgreSQL servers. You can connect to your server by using `psql` with [Azure Cloud Shell](../../cloud-shell/overview.md). You can also use `psql` on your local environment if you have it available. An empty database, **postgres**, is automatically created with a new PostgreSQL server. You can use that database to connect with `psql`, as shown in the following code.

```bash
psql --host=<server_name>.postgres.database.azure.com --port=5432 --username=<admin_user>@<server_name> --dbname=postgres
```

> [!TIP]
> If you prefer to use a URL path to connect to Postgres, URL encode the @ sign in the username with `%40`. For example, the connection string for psql would be:
>
> ```bash
> psql postgresql://<admin_user>%40<server_name>@<server_name>.postgres.database.azure.com:5432/postgres
> ```

## Clean up resources

Use the following command to remove the resource group and all resources associated with it using the [az group delete](/cli/azure/vm/extension#az-vm-extension-set) command - unless you have an ongoing need for these resources. Some of these resources may take a while to create, as well as to delete.

```azurecli
az group delete --name $resourceGroup
```

## Next steps

> [!div class="nextstepaction"]
> [Design your first Azure Database for PostgreSQL using the Azure CLI](tutorial-design-database-using-azure-cli.md)
