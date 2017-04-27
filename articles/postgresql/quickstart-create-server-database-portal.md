---
title: 'Azure portal: Create an Azure Database for PostgreSQL | Microsoft Docs'
description: Quick start guide to create and manage Azure Database for PostgreSQL server using Azure portal user interface.
services: postgresql
author: SaloniSonpal
ms.author: salonis
manager: jhubbard
editor: jasonh
ms.assetid: 
ms.service: postgresql-database
ms.custom: quick start create
ms.tgt_pltfrm: portal
ms.devlang: na
ms.topic: hero-article
ms.date: 05/10/2017
---

# Create an Azure Database for PostgreSQL in the Azure portal
This quick start guide walks through how to create a PostgreSQL server in Azure. Azure Database for PostgreSQL is a managed service that enables you to run, manage, and scale highly-available PostgreSQL databases in the cloud. This quick start shows you how to get started by creating a new PostgreSQL server using the Azure portal.

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Log in to the Azure portal
Log in to the [Azure portal](https://portal.azure.com).

## Create an Azure PostgreSQL server
An Azure PostgreSQL server is created with a defined set of [compute and storage resources](placeholder.md). The server is created within an [Azure resource group](../azure-resource-manager/resource-group-overview.md).

Follow these steps to create an Azure Database for PostgreSQL server with default database ‘postgres’.
1.	Click the **New** button found on the upper left-hand corner of the Azure portal.
2.	Select **Databases** from the **New** page, and select **Azure Database for PostgreSQL** from the **Databases** page.
![Azure Database for PostgreSQL - Create the database](./media/postgresql-quickstart-create-database-portal/1-create-database.png)

3.	Fill out the Azure Database for PostgreSQL form with the following information, as shown on the preceding image:
- Server name: **mypgserver-20170401** (a globally unique server name)
- Resource group: **myresourcegroup**
- Server admin login and password of your choice
- Location
- PostgreSQL Version

4.	Click **Service tier** to specify the service tier and performance level for your new database. For this quick start, select **200 Compute Units** and **125** GB of included storage.
![Azure Database for PostgreSQL - pick the service tier](./media/postgresql-quickstart-create-database-portal/2-service-tier.png)

5.	Click **Ok**.
6.	Click **Create** to provision the server. Provisioning takes a few minutes.
    > [!NOTE]
    > Check the **Pin to dashboard** option to allow easy tracking of your deployments.

7.	On the toolbar, click **Notifications** to monitor the deployment process.
![Azure Database for PostgreSQL - See notifications](./media/postgresql-quickstart-create-database-portal/3-notifications.png)
 

## Create a server-level firewall rule
The Azure Database for PostgreSQL service creates a firewall at the server-level. This prevents external applications and tools from connecting to the server or any databases on the server unless a firewall rule is created to open the firewall for specific IP addresses. 

1.	After the deployment completes, click **Azure Database for PostgreSQL** from the left-hand menu and click your newly created server, **mypgserver-20170401**. The **Overview** page for your server opens and provides options for further configuration.
![Azure Database for PostgreSQL - Server Properties ](./media/postgresql-quickstart-create-database-portal/4-firewall-1.png)

2.	Navigate to the Settings blade of the server. In the Settings blade, select **Connection Security**. 

3.	Click in the text box under **Rule Name,** and add a new firewall rule to whitelist the IP range for connectivity. For this quick start, let’s allow all IPs by typing in **Rule Name = AllowAllIps**, **Start IP = 0.0.0.0** and **End IP = 255.255.255.255** and then click **Save**. A server-level firewall rule is created for your specified IP address range.
![Azure Database for PostgreSQL - Create Firewall Rule](./media/postgresql-quickstart-create-database-portal/5-firewall-2.png)
 
4.	Click **OK** and then click the **X** to close the **Connections Security** page.

> [!NOTE]
> You can set a firewall rule that covers an IP range to be able to connect from your network.

## Connect to Azure Database for PostgreSQL using psql in Cloud Console
When we created our PostgreSQL server, the default ‘postgres’ database also gets created. Let’s now use the psql command line utility to connect to the Azure Database for PostgreSQL server. To connect to your database server, you need to provide host information and access credentials.

1.	Select your server’s **Properties** page. Make a note of the **Server name** and **Server Admin Login**.
![Azure Database for PostgreSQL - Server Admin Login](./media/postgresql-quickstart-create-database-portal/6-server-name.png)

2.	Launch the Azure Cloud Console via the terminal icon on the top navigation pane. 
![Azure Database for PostgreSQL - Azure Console terminal icon](./media/postgresql-quickstart-create-database-portal/7-cloud-console.png)

3.	This enables a bash shell experience in your browser.
![Azure Database for PostgreSQL - Azure Console Bash Prompt](./media/postgresql-quickstart-create-database-portal/8-bash.png)
 
4.	At the Cloud Console prompt, connect to your Azure Database for PostgreSQL server using the psql commands. The following format is used to connect to an Azure Database for PostgreSQL server with the [psql](https://www.postgresql.org/docs/9.6/static/app-psql.html) utility:

```dos
psql --host=<myserver> --port=<port> --username=<server admin login> --password ******* --dbname=<database name>
```

For example, the following command connects to the default database called **postgres** on your PostgreSQL server **mypgserver-20170401.postgres.database.azure.com** using access credentials:

```dos
psql --host=mypgserver-20170401.postgres.database.azure.com --port=5432 
--username=mylogin@mypgserver-20170401 --password ****** –dbname postgres
```

## Clean up resources
Other quick starts in this collection build upon this quick start. If you plan to continue working with subsequent quick starts or with the tutorials, do not clean up the resources created in this quick start. If you do not plan to continue, use the following steps to delete all resources created by this quick start in the Azure portal.

1.	From the left-hand menu in the Azure portal, click **Resource groups** and then click **myresourcegroup**.
2.	On your resource group page, click **Delete**, type **myresourcegroup** in the text box, and then click Delete.

If you just would like to delete the newly created server:
1.	From the left-hand menu in Azure portal, click PostgreSQL servers and then search for the server you just created
2.	On the Overview page, click the Delete button on the top pane
![Azure Database for PostgreSQL - Delete server](./media/postgresql-quickstart-create-database-portal/9-delete.png)

3.	Confirm the server name you want to delete, and show the databases under it that is affected. Type **mypgserver-20170401** in the text box, and then click Delete.

## Next steps
- To create PostgreSQL server via Azure CLI, see [Create PostgreSQL server – CLI](./quickstart-create-server-database-azure-cli.md).
- To connect and query using pgAdmin GUI tool, see [Connect and query with pgAdmin](./quickstart-connect-query-using-pgadmin.md).
- To connect and query using psql command line utility, see [Connect and query with psql](./quickstart-connect-query-using-psql.md).
- For a technical overview, see [About the Azure Database for PostgreSQL service](./overview.md).