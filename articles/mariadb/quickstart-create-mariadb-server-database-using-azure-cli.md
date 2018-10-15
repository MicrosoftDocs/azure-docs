---
title: 'Quickstart: Create an Azure Database for MariaDB server - Azure CLI'
description: This quickstart describes how to use the Azure CLI to create an Azure Database for MariaDB server in an Azure resource group.
author: ajlam
ms.author: andrela
editor: jasonwhowell
services: mariadb
ms.service: mariadb
ms.devlang: azure-cli
ms.topic: quickstart
ms.date: 09/24/2018
ms.custom: mvc
---

# Create an Azure Database for MariaDB server using Azure CLI
This quickstart describes how to use the Azure CLI to create an Azure Database for MariaDB server in an Azure resource group in about five minutes. The Azure CLI is used to create and manage Azure resources from the command line or in scripts.

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

[!INCLUDE [cloud-shell-try-it](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

If you have multiple subscriptions, choose the appropriate subscription in which the resource exists or is billed for. Select a specific subscription ID under your account using [az account set](/cli/azure/account#az-account-set) command.
```azurecli-interactive
az account set --subscription 00000000-0000-0000-0000-000000000000
```

## Create a resource group
Create an [Azure resource group](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview) using the [az group create](/cli/azure/group#az-group-create) command. A resource group is a logical container into which Azure resources are deployed and managed as a group.

The following example creates a resource group named `myresourcegroup` in the `westus` location.

```azurecli-interactive
az group create --name myresourcegroup --location westus
```

## Create an Azure Database for MariaDB server
Create an Azure Database for MariaDB server with the **[az mariadb server create](/cli/azure/mariadb/server#az-mariadb-server-create)** command. A server can manage multiple databases. Typically, a separate database is used for each project or for each user.

**Setting** | **Sample value** | **Description**
---|---|---
name | mydemoserver | Choose a unique name that identifies your Azure Database for MariaDB server. The server name can contain only lowercase letters, numbers, and the hyphen (-) character. It must contain from 3 to 63 characters.
resource-group | myresourcegroup | Provide the name of the Azure resource group.
sku-name | GP_Gen5_2 | The name of the sku. Follows the convention {pricing tier}_{compute generation}_{vCores} in shorthand. See below this table for more information about the sku-name parameter.
backup-retention | 7 | How long a backup should be retained. Unit is days. Range is 7-35. 
geo-redundant-backup | Disabled | Whether geo-redundant backups should be enabled for this server or not. Allowed values: Enabled, Disabled.
location | westus | The Azure location for the server.
ssl-enforcement | Enabled | Whether ssl should be enabled or not for this server. Allowed values: Enabled, Disabled.
storage-size | 51200 | The storage capacity of the server (unit is megabytes). Valid storage-size is minimum 5120MB and increases in 1024MB increments. See the [pricing tiers](./concepts-pricing-tiers.md) document for more information about storage size limits. 
version | 10.2 | The MariaDB major engine version.
admin-user | myadmin | The username for the administrator login. It cannot be **azure_superuser**, **admin**, **administrator**, **root**, **guest**, or **public**.
admin-password | Password123 | The password of the administrator user. It must contain between 8 and 128 characters. Your password must contain characters from three of the following categories: English uppercase letters, English lowercase letters, numbers, and non-alphanumeric characters.

The sku-name parameter value follows the convention {pricing tier}\_{compute generation}\_{vCores} as in the examples below:
+ `--sku-name B_Gen5_4` maps to Basic, Gen 5, and 4 vCores.
+ `--sku-name GP_Gen5_32` maps to General Purpose, Gen 5, and 32 vCores.
+ `--sku-name MO_Gen5_2` maps to Memory Optimized, Gen 5, and 2 vCores.

Please see the [pricing tiers](./concepts-pricing-tiers.md) documentation to understand the valid values per region and per tier.

The following example creates a server in West US named `mydemoserver` in your resource group `myresourcegroup` with server admin login `myadmin`. This is a **Gen 5** **General Purpose** server with 2 **vCores**. The name of a server maps to DNS name and is thus required to be globally unique in Azure. Substitute the `<server_admin_password>` with your own value.
```azurecli-interactive
az mariadb server create --resource-group myresourcegroup --name mydemoserver  --location westus --admin-user myadmin --admin-password <server_admin_password> --sku-name GP_Gen5_2 --version 10.2
```

## Configure firewall rule
Create an Azure Database for MariaDB server-level firewall rule using the **[az mariadb server firewall-rule create](/cli/azure/mariadb/server/firewall-rule#az-mariadb-server-firewall-rule-create)** command. A server-level firewall rule allows an external application, such as the **mysql** command-line tool or MySQL Workbench to connect to your server through the Azure MariaDB service firewall. 

The following example creates a firewall rule called `AllowMyIP` that allows connections from a specific IP address, 192.168.0.1. Substitute in the IP address or range of IP addresses that correspond to where you'll be connecting from. 

```azurecli-interactive
az mariadb server firewall-rule create --resource-group myresourcegroup --server mydemoserver --name AllowMyIP --start-ip-address 192.168.0.1 --end-ip-address 192.168.0.1
```

> [!NOTE]
> Connections to Azure Database for MariaDB communicate over port 3306. If you try to connect from within a corporate network, outbound traffic over port 3306 might not be allowed. If this is the case, you can't connect to your server unless your IT department opens port 3306.
> 

## Configure SSL settings
By default, SSL connections between your server and client applications are enforced. This default ensures security of "in-motion" data by encrypting the data stream over the internet. To make this quick start easier, disable SSL connections for your server. Disabling SSL is not recommended for production servers. For more information, see [Configure SSL connectivity in your application to securely connect to Azure Database for MariaDB](./howto-configure-ssl.md).

The following example disables enforcing SSL on your MariaDB server.
 
 ```azurecli-interactive
 az mariadb server update --resource-group myresourcegroup --name mydemoserver --ssl-enforcement Disabled
 ```

## Get the connection information

To connect to your server, you need to provide host information and access credentials.

```azurecli-interactive
az mariadb server show --resource-group myresourcegroup --name mydemoserver
```

The result is in JSON format. Make a note of the **fullyQualifiedDomainName** and **administratorLogin**.
```json
{
  "administratorLogin": "myadmin",
  "earliestRestoreDate": null,
  "fullyQualifiedDomainName": "mydemoserver.mariadb.database.azure.com",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myresourcegroup/providers/Microsoft.DBforMariaDB/servers/mydemoserver",
  "location": "westus",
  "name": "mydemoserver",
  "resourceGroup": "myresourcegroup",
  "sku": {
    "capacity": 2,
    "family": "Gen5",
    "name": "GP_Gen5_2",
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
  "type": "Microsoft.DBforMariaDB/servers",
  "userVisibleState": "Ready",
  "version": "10.2"
}
```

## Connect to server using mysql command-line
Connect to your server using the **mysql** command-line tool. You can download the command-line tool from [here](https://dev.mysql.com/downloads/) and install it on your computer. Instead you may also click the **Try It** button on code samples, or the  `>_` button from the upper right toolbar in the Azure portal, and launch the **Azure Cloud Shell**.

Type the next commands: 

1. Connect to the server using **mysql** command-line tool:
```azurecli-interactive
 mysql -h mydemoserver.mariadb.database.azure.com -u myadmin@mydemoserver -p
```

2. View server status at the mysql> prompt:
```sql
status
```
If everything goes well, the command-line tool should output the following text:

```bash
C:\Users\>mysql -h mydemoserver.mariadb.database.azure.com -u myadmin@mydemoserver -p
Enter password: ***********
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 65512
Server version: 5.6.39.0 MariaDB Server

Copyright (c) 2000, 2016, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> status
--------------
mysql  Ver 14.14 Distrib 5.7.23, for Linux (x86_64)

Connection id:          64681
Current database:
Current user:           myadmin@40.118.201.21
SSL:                    Cipher in use is AES256-SHA
Current pager:          stdout
Using outfile:          ''
Using delimiter:        ;
Server version:         5.6.39.0 MariaDB Server
Protocol version:       10
Connection:             mydemoserver.mariadb.database.azure.com via TCP/IP
Server characterset:    latin1
Db     characterset:    latin1
Client characterset:    utf8
Conn.  characterset:    utf8
TCP port:               3306
Uptime:                 1 day 3 hours 28 min 50 sec

Threads: 10  Questions: 29002  Slow queries: 0  Opens: 33  Flush tables: 3  Open tables: 1  Queries per second avg: 0.293
--------------

mysql>
```

> [!TIP]
> For additional commands, see [MySQL 5.7 Reference Manual - Chapter 4.5.1](https://dev.mysql.com/doc/refman/5.7/en/mysql.html).

## Connect to server using MySQL Workbench
1.	Launch the MySQL Workbench application on your client computer. You can download and install MySQL Workbench from [here](https://dev.mysql.com/downloads/workbench/).

2.	In the **Setup New Connection** dialog box, enter the following information on **Parameters** tab:

   ![setup new connection](./media/quickstart-create-mariadb-server-database-using-azure-cli/setup-new-connection.png)

| **Setting** | **Suggested Value** | **Description** |
|---|---|---|
|	Connection Name | My Connection | Specify a label for this connection (this can be anything) |
| Connection Method | choose Standard (TCP/IP) | Use TCP/IP protocol to connect to Azure Database for MariaDB |
| Hostname | mydemoserver.mariadb.database.azure.com | Server name you previously noted. |
| Port | 3306 | The default port for MariaDB is used. |
| Username | myadmin@mydemoserver | The server admin login you previously noted. |
| Password | **** | Use the admin account password you configured earlier. |

Click **Test Connection** to test if all parameters are correctly configured.
Now, you can click the connection to successfully connect to the server.

## Clean up resources
If you don't need these resources for another quickstart/tutorial, you can delete them by doing the following command: 

```azurecli-interactive
az group delete --name myresourcegroup
```

If you would just like to delete the one newly created server, you can run **[az mariadb server delete](/cli/azure/mariadb/server#az-mariadb-server-delete)** command.
```azurecli-interactive
az mariadb server delete --resource-group myresourcegroup --name mydemoserver
```

<!--
## Next steps

> [!div class="nextstepaction"]
> [Design a MariaDB Database with Azure CLI](./tutorial-design-database-using-cli.md)
-->