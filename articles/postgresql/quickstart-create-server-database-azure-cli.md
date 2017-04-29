---
title: 'Azure CLI: Create an Azure Database for PostgreSQL server | Microsoft Docs'
description: 'Quick start guide to create and manage Azure Database for PostgreSQL server using Azure CLI (command line interface).'
services: postgresql
author: sanagama
ms.author: sanagama
manager: jhubbard
editor: jasonh
ms.assetid: 
ms.service: postgresql-database
ms.custom: quick start create
ms.tgt_pltfrm: portal
ms.devlang: azurecli
ms.topic: hero-article
Ms.date: 05/10/2017
---
# Create an Azure PostgreSQL server using the Azure CLI

The Azure CLI is used to create and manage Azure resources from the command line or in scripts. This quick start describes how to use the Azure CLI to create an Azure PostgreSQL server in an [Azure resource group](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview).

To complete this quick start, make sure you have installed the latest [Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli). 

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Log in to Azure

Log in to your Azure subscription with the [az login](/cli/azure/#login) command and follow the on-screen directions.
```azurecli
az login
```

## Create a resource group

Create an [Azure resource group](../azure-resource-manager/resource-group-overview.md) using the [az group create](/cli/azure/group#create) command. A resource group is a logical container into which Azure resources are deployed and managed as a group. The following example creates a resource group named `myresourcegroup` in the `westus` location.
```azurecli
az group create --name myresourcegroup --location westus
```

## Create a new PostgreSQL server

Create an [Azure PostgreSQL server](overview.md) using the **az postgres server create** command. A server contains a group of databases managed as a group. 

The following example creates a server called `mypgserver-20170401` in your resource group `myresourcegroup`  with an admin login named `mylogin` and a password `ChangeYourAdminPassword1`. Replace these pre-defined values as desired.

> [!IMPORTANT] 
> Name of a server maps to DNS name and is thus required to be globally unique.

```azurecli
az postgres server create --resource-group myresourcegroup --name mypgserver-20170401  --location westus --user mylogin --password ChangeYourAdminPassword1 --performance-tier Basic --compute-units 50 --version 9.6
```

> [!NOTE]
> By default, **postgres** database gets created under your server. The [postgres](https://www.postgresql.org/docs/9.6/static/app-initdb.html) database is a default database meant for use by users, utilities and third party applications. 

## Configure a server-level firewall rule

Create an Azure PostgreSQL server-level firewall rule with the **az postgres server firewall-rule create** command. A server-level firewall rule allows an external application, such as [psql](https://www.postgresql.org/docs/9.2/static/app-psql.html) or [PgAdmin](https://www.pgadmin.org/) to connect to your server through the Azure PostgreSQL service firewall. 

> [!NOTE] 
> You can set a firewall rule that covers an IP range to be able to connect from your network.

The following example uses **az postgres server firewall-rule create** to create a firewall rule `AllowAllIps` for an IP address range. To open all IP addresses, use 0.0.0.0 as the starting IP address and 255.255.255.255 as the ending address.
```azurecli
az postgres server firewall-rule create --resource-group myresourcegroup --server mypgserver-20170401 --name AllowAllIps --start-ip-address 0.0.0.0 --end-ip-address 255.255.255.255
```

> [!NOTE]
> Azure PostgreSQL server communicates over port 5432. If you are trying to connect from within a corporate network, outbound traffic over port 5432 may not be allowed by your network's firewall. If so, you will not be able to connect to your Azure SQL Database server unless your IT department opens port 5432.
>

## Get the connection information

To connect to your server, you need to provide host information and access credentials.
```azurecli
az postgres server show --resource-group myresourcegroup --name mypgserver-20170401
```

Make a note of the **fullyQualifiedDomainName** and **administratorLogin**.

## Connect to Azure Database for PostgreSQL using psql

Let's now use the [psql](https://www.postgresql.org/docs/9.6/static/app-psql.html) command line utility to connect to the Azure PostgreSQL server.

1. Run the following psql command to connect to an Azure Database for PostgreSQL server
```dos
psql --host=--host=<servername> --port=<port> --username=<user@servername> --password --dbname=<dbname>
```

    For example, the following command connects to the default database called `postgres` on your PostgreSQL server `mypgserver-20170401.postgres.database.azure.com` using the obtaind access credentials:        
    ```dos
    psql --host=mypgserver-20170401.postgres.database.azure.com --port=5432 --username=mylogin@mypgserver-20170401 --password --dbname=postgres
    ```

2.  Once you're connected to the server, create a blank database at the prompt.
```dos
CREATE DATABASE mypgsqldb;
```

3.  At the prompt, execute the following command to switch connection to the newly created database **mypgsqldb**:
```dos
\c mypgsqldb
```

## Connect to a PostgreSQL database using pgAdmin

To connect to Azure PostgreSQL server using the GUI tool _pgAdmin_
1.	Launch the _pgAdmin_ application on your client computer. You can install _pgAdmin_ from http://www.pgadmin.org/.
2.	Choose **Add New Server** from the **Quick Links** menu.
3.	In the **Create - Server** dialog box **General** tab, enter a unique friendly Name for the server. Say **Azure PostgreSQL Server**.
 ![pgAdmin tool - create - server](./media/quickstart-create-database-cli/1-pgadmin-create-server.png)
4.	In the **Create - Server** dialog box, **Connection** tab:
    - Enter the fully qualified server name (for example, **mypgserver-20170401.postgres.database.azure.com**) in the **Host Name/ Address** box. 
    - Enter port 5432 into the **Port** box. 
    - Enter the **Server admin login (user@mypgserver)** as obtained in the preceding step and password you entered when you created the server instance into the **Username** and **Password** boxes, respectively.
    - Select **SSL Mode** as **Require**. By default, all Azure PostgreSQL servers are created with SSL enforcing turned ON. To turn OFF SSL enforcing, see instructions for Configuring [Enforcing SSL](./placeholder.md).

    ![pgAdmin - Create - Server](./media/quickstart-create-database-cli/2-pgadmin-create-server.png)
5.	Click **Save**.
6.	In the Browser left pane, expand the **Server Groups**. Choose your server **Azure PostgreSQL Server**.
7.  Once you are connected to the server, create a blank database to work with.
8.  Choose the **Server** you connected to, and then choose **Databases** under it. 
9.	Right-click on **Databases** to Create a Database.
10.	Choose a database name **mypgsqldb** and the owner for it as server admin login **mylogin**.
11. Click **Save** to create the database.
12. In the Browser, expand the **Server Groups**. Choose the Server you created, and you should be able to see the database **mypgsqldb** under it.
![pgAdmin - Create - Database](./media/quickstart-create-database-cli/3-pgadmin-database.png)


## Clean up resources

Other quick starts in this collection build upon this quick start. 

> [!TIP]
> If you plan to continue on to work with subsequent quick starts, do not clean up the resources created in this quick start. If you do not plan to continue, use the following steps to delete all resources created by this quick start in the Azure CLI.

```azurecli
az group delete --name myresourcegroup
```

If you just would like to delete the newly created server
```azurecli
az postgres server delete --resource-group myresourcegroup --name mypgserver-20170401
```

## Next steps
- Migrate your database using [Export and Import]((./howto-migrate-using-export-and-import.md) or [Dump and Restore](./howto-migrate-using-dump-and-restore.md).
- To create PostgreSQL server via Azure CLI, see [Create PostgreSQL server - portal](./quickstart-create-server-database-portal.md).
- For a technical overview, see [About the Azure Database for PostgreSQL service](./overview.md).