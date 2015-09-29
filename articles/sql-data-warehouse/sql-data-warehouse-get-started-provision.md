<properties
	pageTitle="Create a SQL Data Warehouse database in the Azure preview portal | Microsoft Azure"
	description="Learn how to create an Azure SQL Data Warehouse in the Azure preview portal"
	services="sql-data-warehouse"
	documentationCenter="NA"
	authors="lodipalm"
	manager="barbkess"
	editor=""
	tags="azure-sql-data-warehouse"/>
<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="09/25/2015"
   ms.author="lodipalm;barbkess"/>

# Create a SQL Data Warehouse in the Azure preview portal#

> [AZURE.SELECTOR]
- [Azure preview portal](sql-data-warehouse-get-started-create-data-warehouse.md)
- [PowerShell](sql-data-warehouse-get-started-create-powershelll.md)
- [sqlcmd](sql-data-warehouse-get-started-create-sqlcmd.md)
- [SSDT](sql-data-warehouse-get-started-create-SSDT.md)

This tutorial shows you how easy it is to create an Azure SQL Data Warehouse in just a few minutes in the Azure preview portal. 

[AZURE.INCLUDE [free-trial-note](../../includes/free-trial-note.md)]


## Locate SQL Data Warehouse

1. Sign in to the [preview portal](https://portal.azure.com).

2. On the Hub menu, click **New** > **Data + Storage** > **SQL Data Warehouse**.

	![Create a data warehouse](./media/sql-data-warehouse-get-started-provision/new-data-warehouse.png)

## Enter configuration options

In Azure, a database does not exist all on its own. It always belongs to a logical grouping called a server. In this section, you will:


- Configure the name and performance level for your database.
- Configure a logical server for your database. 

In the **SQL Data Warehouse** pane, enter this information:

1. **Database name**: Enter a name for the database.

2. **Performance**: Move the slider to the left to choose 100 DWUs. 

    Since this walkthrough creates a small database, you only need a small number of DWUs. Save resources for the rest of your Azure trial.  

    ![Name and DWU](./media/sql-data-warehouse-get-started-provision/name-and-dwu.png)

    > [AZURE.NOTE] We measure performance in Data Warehouse Units (DWUs). As you increase DWUs, SQL Data Warehouse increases the computing resources available for your data warehouse database operations. 

	You can quickly and easily change the performance level after the database is created.  For example, if you are not using the database, move the slider to the left to reduce costs.  Or, increase performance when more resources are needed. This is the scalable power of SQL Data Warehouse.

3. **Server**: Click **Create a new server**. Or, if you already have a V12 server that you want to use, simply select your server name and skip the rest of this step.

    ![Create a new server](./media/sql-data-warehouse-get-started-provision/create-new-server.png)

    > [AZURE.NOTE] In SQL Data Warehouse and SQL Database, a server provides a logical and consistent way to manage and configure multiple databases. You might be accustomed to thinking of a server as physical hardware. In Azure, one physical server does not physically store multiple databases. This is why we call the Azure server a logical server. Both the Azure server and the on-premises physical server manage and configure multiple databases; one as a Cloud service and one as an on-premises server. 


    All the databases assigned to the same logical server are physically stored in the same Azure data center. Both SQL Database and SQL Data Warehouse can have databases that belong to the same logical server.

1. In the **New Server** window, enter these server configurtion settings. 

    ![Configure new server](./media/sql-data-warehouse-get-started-provision/configure-new-server.png)

	Be sure to store the server name, admin name, and password somewhere.  You will need this information to log on to the server.
	- **Server Name**. Enter a name for your logical server.
	- **Server Admin Name**. Enter a user name for the server administrator account.
	- **Password**. Enter the server admin password. 
	- **Location**. Choose a geographical location that is close to you. This will reduce network latency since all databases and resources that belong to your logical server will be physically located in the same location. 
	- **Allow Azure services to access server**. Keep this checked so other Azure services can integrate with your server.
	- **V12 server**. Choose YES. SQL Data Warehouse requires a V12 server.

    Click **OK** to save the configuration settings.

1. For **Source**, choose Sample to load AdventureWorksDW.
2. For **Resource group**, keep the default values.Resource groups are containers designed to help you manage a collection of Azure resources. Learn more about [resource groups](../azure-portal/resource-group-portal.md).
3. For **Subscription**. Select the subscription that will pay for the service.
1. Click **Create** to create your SQL Data Warehouse. 

    ![Create data warehouse](./media/sql-data-warehouse-get-started-provision/create-data-warehouse.png)

1. Now, all you have to do is wait for a few minutes.  When finished, you will see your sample database on your home page.

    ![SQL Data Warehouse portal view](./media/sql-data-warehouse-get-started-provision/database-portal-view.png)

## Next steps

Now the SQL Data Warehouse service has been successfully provisioned we can move on to learn how to use it.
Next steps:

1. [Connect and query][] the data warehouse.
2. Load [sample data].

	> [AZURE.NOTE] We want to make this article better. If you choose to answer "no" to the "Was this article helpful?" question, please include a brief suggestion about what is missing or how to improve the article. Thanks in advance!!

<!-- Articles -->
[Connect and query]: sql-data-warehouse-get-started-connect-query.md
[sample data]: ./sql-data-warehouse-get-started-load-samples.md  

