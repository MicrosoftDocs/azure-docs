---
title: Design your first Azure Database for MySQL database - Azure Portal | Microsoft Docs
description: This tutorial explains how to create and manage Azure Database for MySQL server and database using Azure Portal.
services: mysql
author: v-chenyh
ms.author: v-chenyh
manager: jhubbard
editor: jasonwhowell
ms.service: mysql-database
ms.topic: article
ms.date: 06/06/2017
ms.custom: mvc
---

# Design your first Azure Database for MySQL database
Azure Database for MySQL is a managed service that enables you to run, manage, and scale highly available MySQL databases in the cloud. Using the Azure portal, you can easily manage your server and design a database.

In this tutorial, you use the Azure portal to learn how to:

> [!div class="checklist"]
> * Create an Azure Database for MySQL
> * Configure the server firewall
> * Use mysql command-line tool to create a database
> * Load sample data
> * Query data
> * Update data
> * Restore data

## Sign in to the Azure portal
Open your favorite web browser, and visit the [Microsoft Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal. The default view is your service dashboard.

## Create an Azure Database for MySQL server
An Azure Database for MySQL server is created with a defined set of [compute and storage resources](./concepts-compute-unit-and-storage.md). The server is created within an [Azure resource group](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-overview).

1. Navigate to **Databases** > **Azure Database for MySQL**. If you cannot find MySQL Server under **Databases** category, click **See all** to show all available database services. You can also type **Azure Database for MySQL** in the search box to quickly find the service.
![2-1 Navigate to MySQL](./media/tutorial-design-database-using-portal/2_1-Navigate-to-MySQL.png)

2. Click **Azure Database for MySQL** tile, and then click **Create**.

In our example, fill out the Azure Database for MySQL form with the following information:

| **Setting** | **Suggested value** | **Field Description** |
|---|---|---|
| *Server name* | myserver4demo  | Server name has to be globally unique. |
| *Subscription* | mysubscription | Select your subscription from the drop-down. |
| *Resource group* | myresourcegroup | Create a resource group or use an existing one. |
| *Server admin login* | myadmin | Setup admin account name. |
| *Password* |  | Set a strong admin account password. |
| *Confirm password* |  | Confirm the admin account password. |
| *Location* |  | Select an available region. |
| *Version* | 5.7 | Choose the latest version. |
| *Configure performance* | Basic, 50 compute units, 50 GB  | Choose **Pricing tier**, **Compute Units**, **Storage (GB)**, and then click **OK**. |
| *Pin to Dashboard* | Check | Recommended to check this box so you may find the server easily later on |
Then, click **Create**. In a minute or two, a new Azure Database for MySQL server is running in the cloud. You can click **Notifications** button on the toolbar to monitor the deployment process.

## Configure firewall
Azure Databases for MySQL are protected by a firewall. By default, all connections to the server and the databases inside the server are rejected. Before connecting to Azure Database for MySQL for the first time, configure the firewall to add the client machine's public network IP address (or IP address range).

1. Click your newly created server, and then click **Connection security**.
   ![3-1 Connection security](./media/tutorial-design-database-using-portal/3_1-Connection-security.png)
2. You can **Add My IP**, or configure firewall rules here. Remember to click **Save** after you have created the rules.
You can now connect to the server using mysql command-line tool or MySQL Workbench GUI tool.

> [!TIP]
> Azure Database for MySQL server communicates over port 3306. If you are trying to connect from within a corporate network, outbound traffic over port 3306 may not be allowed by your network's firewall. If so, you cannot connect to Azure MySQL server unless your IT department opens port 3306.

## Get connection information
Get the fully qualified **Server name** and **Server admin login name** for your Azure Database for MySQL server from the Azure portal. You use the fully qualified server name to connect to your server using mysql command-line tool. 

1. In [Azure portal](https://portal.azure.com/), click **All resources** from the left-hand menu, type the name, and search for your Azure Database for MySQL server. Select the server name to view the details.

2. Under the Settings heading, click **Properties**. Note down **SERVER NAME** and **SERVER ADMIN LOGIN NAME**. You may click the copy button next to each field to copy to the clipboard.
   ![4-2 server properties](./media/tutorial-design-database-using-portal/4_2-server-properties.png)

In this example, the server name is *myserver4demo.mysql.database.azure.com*, and the server admin login is *myadmin@myserver4demo*.

## Connect to the server using mysql
Use [mysql command-line tool](https://dev.mysql.com/doc/refman/5.7/en/mysql.html) to establish a connection to your Azure Database for MySQL server. You can run the mysql command-line tool from the Azure Cloud Shell in the browser or from your own machine using mysql tools installed locally. To launch the Azure Cloud Shell, click the `Try It` button on a code block in this article, or visit the Azure portal and click the `>_` icon in the top right toolbar. 

Type the command to connect:
```azurecli-interactive
mysql -h myserver4demo.mysql.database.azure.com -u myadmin@myserver4demo -p
```

## Create a blank database
Once you’re connected to the server, create a blank database to work with.
```sql
CREATE DATABASE mysampledb;
```

At the prompt, run the following command to switch connection to this newly created database:
```sql
USE mysampledb;
```

## Create tables in the database
Now that you know how to connect to the Azure Database for MySQL database, we can go over how to complete some basic tasks.

First, we can create a table and load it with some data. Let's create a table that stores inventory information.
```sql
CREATE TABLE inventory (
	id serial PRIMARY KEY, 
	name VARCHAR(50), 
	quantity INTEGER
);
```

## Load data into the tables
Now that we have a table, we can insert some data into it. At the open command prompt window, run the following query to insert some rows of data.
```sql
INSERT INTO inventory (id, name, quantity) VALUES (1, 'banana', 150); 
INSERT INTO inventory (id, name, quantity) VALUES (2, 'orange', 154);
```

Now you have two rows of sample data into the table you created earlier.

## Query and update the data in the tables
Execute the following query to retrieve information from the database table.
```sql
SELECT * FROM inventory;
```

You can also update the data in the tables.
```sql
UPDATE inventory SET quantity = 200 WHERE name = 'banana';
```

The row gets updated accordingly when you retrieve data.
```sql
SELECT * FROM inventory;
```

## Restore a database to a previous point in time
Imagine you have accidentally deleted an important database table, and cannot recover the data easily. Azure Database for MySQL allows you to restore the server to a point in time, creating a copy of the databases into new server. You can use this new server to recover your deleted data. The following steps restore the sample server to a point before the table was added.

1. In the Azure portal, locate your Azure Database for MySQL. On the **Overview** page, click **Restore** on the toolbar. The Restore page opens.

   ![10-1 restore a database](./media/tutorial-design-database-using-portal/10_1-restore-a-db.png)

2. Fill out the **Restore** form with the required information.
   
   ![10-2 restore form](./media/tutorial-design-database-using-portal/10_2-restore-form.png)
   
   - **Restore point**: Select a point-in-time that you want to restore to, within the timeframe listed. Make sure to convert your local timezone to UTC.
   - **Restore to new server**: Provide a new server name you want to restore to.
   - **Location**: The region is same as the source server, and cannot be changed.
   - **Pricing tier**: The pricing tier is the same as the source server, and cannot be changed.
   
3. Click **OK** to restore the server to [restore to a point in time](./howto-restore-server-portal.md) before the table was deleted. Restoring a server creates a new copy of the server, as of the point in time you specify. 

## Next steps
In this tutorial, you use the Azure portal to learned how to:

> [!div class="checklist"]
> * Create an Azure Database for MySQL
> * Configure the server firewall
> * Use mysql command-line tool to create a database
> * Load sample data
> * Query data
> * Update data
> * Restore data

> [!div class="nextstepaction"]
> [How to connect applications to Azure Database for MySQL](./howto-connection-string.md)
