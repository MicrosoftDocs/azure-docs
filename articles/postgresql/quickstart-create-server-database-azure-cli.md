---
title: Quickstart - Create an Azure Database for PostgreSQL using the Azure CLI
description: Quickstart guide to create and manage Azure Database for PostgreSQL server using Azure CLI (command line interface).
services: postgresql
author: rachel-msft
ms.author: raagyema
manager: kfile
editor: jasonwhowell
ms.service: postgresql
ms.devlang: azure-cli
ms.topic: quickstart
ms.date: 04/01/2018
ms.custom: mvc
---
# Quickstart: Create an Azure Database for PostgreSQL using the Azure CLI
Azure Database for PostgreSQL is a managed service that enables you to run, manage, and scale highly available PostgreSQL databases in the cloud. The Azure CLI is used to create and manage Azure resources from the command line or in scripts. This quickstart shows you how to create an Azure Database for PostgreSQL server in an [Azure resource group](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview) using the Azure CLI.

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

[!INCLUDE [cloud-shell-try-it](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0 or later. To see the version installed, run the `az --version` command. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli). 

If you are running the CLI locally, you need to log in to your account using the [az login](/cli/azure/authenticate-azure-cli?view=interactive-log-in) command. Note the **id** property from the command output for the corresponding subscription name.
```azurecli-interactive
az login
```

If you have multiple subscriptions, choose the appropriate subscription in which the resource should be billed. Select the specific subscription ID under your account using [az account set](/cli/azure/account#az_account_set) command. Substitute the **id** property from the **az login** output for your subscription into the subscription id placeholder.
```azurecli-interactive
az account set --subscription <subscription id>
```

## Create a resource group

Create an [Azure resource group](../azure-resource-manager/resource-group-overview.md) using the [az group create](/cli/azure/group#az_group_create) command. A resource group is a logical container into which Azure resources are deployed and managed as a group. You should provide a unique name. The following example creates a resource group named `myresourcegroup` in the `westus` location.
```azurecli-interactive
az group create --name myresourcegroup --location westus
```

## Create an Azure Database for PostgreSQL server

Create an [Azure Database for PostgreSQL server](overview.md) using the [az postgres server create](/cli/azure/postgres/server#az_postgres_server_create) command. A server can contain multiple databases.


**Setting** | **Sample value** | **Description**
---|---|---
name | mydemoserver | Choose a unique name that identifies your Azure Database for PostgreSQL server. The server name can contain only lowercase letters, numbers, and the hyphen (-) character. It must contain from 3 to 63 characters.
resource-group | myresourcegroup | Provide the name of the Azure resource group.
sku-name | GP_Gen4_2 | The name of the sku. Follows the convention {pricing tier}_{compute generation}_{vCores} in shorthand. See below this table for more information about the sku-name parameter.
backup-retention | 7 | How long a backup should be retained. Unit is days. Range is 7-35. 
geo-redundant-backup | Disabled | Whether geo-redundant backups should be enabled for this server or not. Allowed values: Enabled, Disabled.
location | westus | The Azure location for the server.
ssl-enforcement | Enabled | Whether ssl should be enabled or not for this server. Allowed values: Enabled, Disabled.
storage-size | 51200 | The storage capacity of the server (unit is megabytes). Valid storage-size is minimum 5120MB and increases in 1024MB increments. See the [pricing tiers](./concepts-pricing-tiers.md) document for more information about storage size limits. 
version | 9.6 | The PostgreSQL major version.
admin-user | myadmin | The username for the administrator login. It cannot be **azure_superuser**, **admin**, **administrator**, **root**, **guest**, or **public**.
admin-password | *secure password* | The password of the administrator user. It must contain between 8 and 128 characters. Your password must contain characters from three of the following categories: English uppercase letters, English lowercase letters, numbers, and non-alphanumeric characters.


The sku-name parameter value follows the convention {pricing tier}\_{compute generation}\_{vCores} as in the examples below:
+ `--sku-name B_Gen4_4` maps to Basic, Gen 4, and 4 vCores.
+ `--sku-name GP_Gen5_32` maps to General Purpose, Gen 5, and 32 vCores.
+ `--sku-name MO_Gen5_2` maps to Memory Optimized, Gen 5, and 2 vCores.

Please see the [pricing tiers](./concepts-pricing-tiers.md) documentation to understand the valid values per region and per tier.

The following example creates a PostgreSQL 9.6 server in West US named `mydemoserver` in your resource group `myresourcegroup` with server admin login `myadmin`. This is a **Gen 4** **General Purpose** server with **2 vCores**. Substitute the `<server_admin_password>` with your own value.
```azurecli-interactive
az postgres server create --resource-group myresourcegroup --name mydemoserver  --location westus --admin-user myadmin --admin-password <server_admin_password> --sku-name GP_Gen4_2 --version 9.6
```


> [!IMPORTANT]
> The server admin login and password that you specify here are required to log in to the server later in this quickstart. Remember or record this information for later use.


## Configure a server-level firewall rule

Create an Azure PostgreSQL server-level firewall rule with the [az postgres server firewall-rule create](/cli/azure/postgres/server/firewall-rule#az_postgres_server_firewall_rule_create) command. A server-level firewall rule allows an external application, such as [psql](https://www.postgresql.org/docs/9.2/static/app-psql.html) or [PgAdmin](https://www.pgadmin.org/) to connect to your server through the Azure PostgreSQL service firewall. 

You can set a firewall rule that covers an IP range to be able to connect from your network. The following example uses [az postgres server firewall-rule create](/cli/azure/postgres/server/firewall-rule#az_postgres_server_firewall_rule_create) to create a firewall rule `AllowMyIP` for a single IP address.
```azurecli-interactive
az postgres server firewall-rule create --resource-group myresourcegroup --server mydemoserver --name AllowMyIP --start-ip-address 192.168.0.1 --end-ip-address 192.168.0.1
```

> [!NOTE]
> Azure PostgreSQL server communicates over port 5432. When connecting from within a corporate network, outbound traffic over port 5432 may not be allowed by your network's firewall. Have your IT department open port 5432 to connect to your Azure PostgreSQL server.

## Get the connection information

To connect to your server, you need to provide host information and access credentials.
```azurecli-interactive
az postgres server show --resource-group myresourcegroup --name mydemoserver
```

The result is in JSON format. Make a note of the **administratorLogin** and **fullyQualifiedDomainName**.
```json
{
  "administratorLogin": "myadmin",
  "earliestRestoreDate": null,
  "fullyQualifiedDomainName": "mydemoserver.postgres.database.azure.com",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myresourcegroup/providers/Microsoft.DBforPostgreSQL/servers/mydemoserver",
  "location": "westus",
  "name": "mydemoserver",
  "resourceGroup": "myresourcegroup",
  "sku": {
    "capacity": 2,
    "family": "Gen4",
    "name": "GP_Gen4_2",
    "size": null,
    "tier": "GeneralPurpose"
  },
  "sslEnforcement": "Enabled",
  "storageProfile": {
    "backupRetentionDays": 7,
    "geoRedundantBackup": "Disabled",
    "storageMb": 5120
  },
  "tags": null,
  "type": "Microsoft.DBforPostgreSQL/servers",
  "userVisibleState": "Ready",
  "version": "9.6"
}
```

## Connect to PostgreSQL database using psql

If your client computer has PostgreSQL installed, you can use a local instance of [psql](https://www.postgresql.org/docs/9.6/static/app-psql.html) to connect to an Azure PostgreSQL server. Let's now use the psql command-line utility to connect to the Azure PostgreSQL server.

1. Run the following psql command to connect to an Azure Database for PostgreSQL server
```azurecli-interactive
psql --host=<servername> --port=<port> --username=<user@servername> --dbname=<dbname>
```

  For example, the following command connects to the default database called **postgres** on your PostgreSQL server **mydemoserver.postgres.database.azure.com** using access credentials. Enter the `<server_admin_password>` you chose when prompted for password.
  
  ```azurecli-interactive
psql --host=mydemoserver.postgres.database.azure.com --port=5432 --username=myadmin@mydemoserver --dbname=postgres
```

2.  Once you are connected to the server, create a blank database at the prompt.
```sql
CREATE DATABASE mypgsqldb;
```

3.  At the prompt, execute the following command to switch connection to the newly created database **mypgsqldb**:
```sql
\c mypgsqldb
```

## Connect to the PostgreSQL Server using pgAdmin

pgAdmin is an open-source tool used with PostgreSQL. You can install pgAdmin from the [pgAdmin website](http://www.pgadmin.org/). The pgAdmin version you're using may be different from what is used in this Quickstart. Read the pgAdmin documentation if you need additional guidance.

1. Open the pgAdmin application on your client computer.

2. From the toolbar go to **Object**, hover over **Create**, and select **Server**.

3. In the **Create - Server** dialog box, on the **General** tab, enter a unique friendly name for the server, such as **mydemoserver**.

   ![The "General" tab](./media/quickstart-create-server-database-azure-cli/9-pgadmin-create-server.png)

4. In the **Create - Server** dialog box, on the **Connection** tab, fill in the settings table.

   ![The "Connection" tab](./media/quickstart-create-server-database-azure-cli/10-pgadmin-create-server.png)

    pgAdmin parameter |Value|Description
    ---|---|---
    Host name/address | Server name | The server name value that you used when you created the Azure Database for PostgreSQL server earlier. Our example server is **mydemoserver.postgres.database.azure.com.** Use the fully qualified domain name (**\*.postgres.database.azure.com**) as shown in the example. If you don't remember your server name, follow the steps in the previous section to get the connection information. 
    Port | 5432 | The port to use when you connect to the Azure Database for PostgreSQL server. 
    Maintenance database | *postgres* | The default system-generated database name.
    Username | Server admin login name | The server admin login username that you supplied when you created the Azure Database for PostgreSQL server earlier. If you don't remember the username, follow the steps in the previous section to get the connection information. The format is *username@servername*.
    Password | Your admin password | The password you chose when you created the server earlier in this Quickstart.
    Role | Leave blank | There's no need to provide a role name at this point. Leave the field blank.
    SSL mode | *Require* | You can set the SSL mode in pgAdmin's SSL tab. By default, all Azure Database for PostgreSQL servers are created with SSL enforcing turned on. To turn off SSL enforcing, see [SSL Enforcing](./concepts-ssl-connection-security.md).
    
5. Select **Save**.

6. In the **Browser** pane on the left, expand the **Servers** node. Select your server, for example, **mydemoserver**. Click to connect to it.

7. Expand the server node, and then expand **Databases** under it. The list should include your existing *postgres* database and any other databases you've created. You can create multiple databases per server with Azure Database for PostgreSQL.

8. Right-click **Databases**, choose the **Create** menu, and then select **Database**.

9. Type a database name of your choice in the **Database** field, such as **mypgsqldb2**.

10. Select the **Owner** for the database from the list box. Choose your server admin login name, such as the example, **my admin**.

   ![Create a database in pgadmin](./media/quickstart-create-server-database-azure-cli/11-pgadmin-database.png)

11. Select **Save** to create a new blank database.

12. In the **Browser** pane, you can see the database that you created in the list of databases under your server name.




## Clean up resources

Clean up all resources you created in the quickstart by deleting the [Azure resource group](../azure-resource-manager/resource-group-overview.md).

> [!TIP]
> Other quickstarts in this collection build upon this quickstart. If you plan to continue to work with subsequent quickstarts, do not clean up the resources created in this quickstart. If you do not plan to continue, use the following steps to delete all resources created by this quickstart in the Azure CLI.

```azurecli-interactive
az group delete --name myresourcegroup
```

If you would just like to delete the one newly created server, you can run [az postgres server delete](/cli/azure/postgres/server#az_postgres_server_delete) command.
```azurecli-interactive
az postgres server delete --resource-group myresourcegroup --name mydemoserver
```

## Next steps
> [!div class="nextstepaction"]
> [Migrate your database using Export and Import](./howto-migrate-using-export-and-import.md)

