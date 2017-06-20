
## Create an Azure SQL Database

Azure SQL Database is a relational database-as-a-service that runs in the cloud. SQL Database uses the Microsoft SQL Server engine. The next several sections explain the following tasks:

> [!div class="checklist"]
> * Create and design a database
> * Set up a server-level firewall rule
> * Connect to the database with [SQL Server Management Studio (SSMS)](https://msdn.microsoft.com/library/ms174173.aspx)

To complete the next several sections, you must first have the following items:

- An Azure account. If you do not yet have an Azure account, you can obtain a [temporary free account](https://azure.microsoft.com/free/).
- An install of a recent monthly release of [SQL Server Management Studio (SSMS)](https://msdn.microsoft.com/library/ms174173.aspx).


## Log in to the Azure portal

Log in to the [Azure portal](https://portal.azure.com/).

If you do not yet have an Azure account, you can obtain a [temporary free account](https://azure.microsoft.com/free/).

## Create a blank SQL database

An Azure SQL database is created with a defined set of [compute and storage resources](../articles/sql-database/sql-database-service-tiers.md). The database is created within an [Azure resource group](../articles/azure-resource-manager/resource-group-overview.md) and in an [Azure SQL Database logical server](../articles/sql-database/sql-database-features.md). 

Follow these steps to create a blank SQL database. 

1. Click the **New** button found on the upper left-hand corner of the Azure portal.

2. Select **Databases** from the **New** page, and select **SQL Database** from the **Databases** page. 

   ![create empty-database](../articles/sql-database/media/sql-database-design-first-database/create-empty-database.png)

3. Fill out the SQL Database form with the following information, as shown on the preceding image:   

   | Setting | Suggested value | Description |
   | --------| --------------- | ----------- | 
   | **Database name** | mySampleDatabase | For valid database names, see [Database Identifiers](https://docs.microsoft.com/sql/relational-databases/databases/database-identifiers). | 
   | **Subscription** | Your subscription  | For details about your subscriptions, see [Subscriptions](https://account.windowsazure.com/Subscriptions). |
   | **Resource group** | myResourceGroup | For valid resource group names, see [Naming rules and restrictions](https://docs.microsoft.com/azure/architecture/best-practices/naming-conventions). |
   | **Select source** | Blank database | Specifies that a blank database should be created. |
   ||||

4. Click **Server** to create and configure a new server for your new database. Fill out the **New server form** with the following information: 

   | Setting | Suggested value | Description |
   | --------| --------------- | ----------- | 
   | **Server name** | Any globally unique name. | For valid server names, see [Naming rules and restrictions](https://docs.microsoft.com/azure/architecture/best-practices/naming-conventions). | 
   | **Server admin login** | Any valid name. | For valid login names, see [Database Identifiers](https://docs.microsoft.com/sql/relational-databases/databases/database-identifiers).|
   | **Password** | Any valid password. | Your password must have at least eight characters and must contain characters from three of the following categories: upper case characters, lower case characters, numbers, and non-alphanumeric characters. |
   | **Location** | Any valid location. | For information about regions, see [Azure Regions](https://azure.microsoft.com/regions/). |
   ||||

   ![create database-server](../articles/sql-database/media/sql-database-design-first-database/create-database-server.png)

5. Click **Select**.

6. Click **Pricing tier** to specify the service tier and performance level for your new database. For this tutorial, select **20 DTUs** and **250** GB of storage.

   ![create database-s1](../articles/sql-database/media/sql-database-design-first-database/create-empty-database-pricing-tier.png)

7. Click **Apply**.  

8. Select a **collation** for the blank database (for this tutorial, use the default value). For more information about collations, see [Collations](https://docs.microsoft.com/sql/t-sql/statements/collations)

9. Click **Create** to provision the database. Provisioning takes about a minute and a half to complete. 

10. On the toolbar, click **Notifications** to monitor the deployment process.

   ![notification](../articles/sql-database/media/sql-database-get-started-portal/notification.png)

## Create a server-level firewall rule

The SQL Database service creates a firewall at the server-level. Initially the firewall prevents external tools and applications from connecting to the server, or to any databases on the server. Connections are allowed after a firewall rule is created to open specific IP addresses. Follow these steps to create a [SQL Database server-level firewall rule](../articles/sql-database/sql-database-firewall-configure.md) for your client's IP address, and to enable external connectivity through the SQL Database firewall for your IP address only. 


> [!NOTE]
> Azure SQL Database communicates over port 1433. You can connect to SQL Database only after the firewall of your network allows outbound traffic through port 1433.


1. After the deployment completes, click **SQL databases** from the left-hand menu and then click **mySampleDatabase** on the **SQL databases** page. The overview page for your database opens, showing you the fully qualified server name (such as **mynewserver20170313.database.windows.net**) and provides options for further configuration. Copy this fully qualified server name for use later.

   > [!IMPORTANT]
   > You need this fully qualified server name to connect to your server and its databases in subsequent quick starts.
   > 

   ![server name](../articles/sql-database/media/sql-database-get-started-portal/server-name.png) 

2. Click **Set server firewall** on the toolbar as shown in the previous image. The **Firewall settings** page for the SQL Database server opens. 

   ![server firewall rule](../articles/sql-database/media/sql-database-get-started-portal/server-firewall-rule.png) 


3. Click **Add client IP** on the toolbar to add your current IP address to a new firewall rule. A firewall rule can open port 1433 for a single IP address or a range of IP addresses.

4. Click **Save**. A server-level firewall rule is created for your current IP address opening port 1433 on the logical server.

   ![set server firewall rule](../articles/sql-database/media/sql-database-get-started-portal/server-firewall-rule-set.png) 

4. Click **OK** and then close the **Firewall settings** page.

You can now connect to the Azure SQL Database server and its databases by using a tool such as SQL Server Management Studio (SSMS). The connection is from this IP address, and it uses the server admin account created previously.


> [!IMPORTANT]
> By default, access through the SQL Database firewall is enabled for all Azure services. Click **OFF** on this page to disable for all Azure services.


## Get connection string values

Get the fully qualified server name for your Azure SQL Database server in the Azure portal. You use the fully qualified server name to connect to your server using SQL Server Management Studio.

1. Log in to the [Azure portal](https://portal.azure.com/).

2. Select **SQL Databases** from the left-hand menu, and click your database on the **SQL databases** page. 

3. In the **Essentials** pane in the Azure portal page for your database, locate and then copy the **Server name**.

   ![connection information](../articles/sql-database/media/sql-database-get-started-portal/server-name.png) 
