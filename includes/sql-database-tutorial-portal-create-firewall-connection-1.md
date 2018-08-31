## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).

## Create a blank SQL database

An Azure SQL database is created with a defined set of [compute and storage resources](../articles/sql-database/sql-database-service-tiers-dtu.md). The database is created within an [Azure resource group](../articles/azure-resource-manager/resource-group-overview.md) and in an [Azure SQL Database logical server](../articles/sql-database/sql-database-features.md). 

Follow these steps to create a blank SQL database. 

1. Click **Create a resource** in the upper left-hand corner of the Azure portal.

2. Select **Databases** from the **New** page, and select **Create** under **SQL Database** on the **New** page.

   ![create empty-database](../articles/sql-database/media/sql-database-design-first-database/create-empty-database.png)

3. Fill out the SQL Database form with the following information, as shown on the preceding image:   

   | Setting       | Suggested value | Description | 
   | ------------ | ------------------ | ------------------------------------------------- | 
   | **Database name** | mySampleDatabase | For valid database names, see [Database Identifiers](https://docs.microsoft.com/sql/relational-databases/databases/database-identifiers). | 
   | **Subscription** | Your subscription  | For details about your subscriptions, see [Subscriptions](https://account.windowsazure.com/Subscriptions). |
   | **Resource group** | myResourceGroup | For valid resource group names, see [Naming rules and restrictions](https://docs.microsoft.com/azure/architecture/best-practices/naming-conventions). |
   | **Select source** | Blank database | Specifies that a blank database should be created. |

4. Click **Server** to create and configure a new server for your new database. Fill out the **New server form** with the following information: 

   | Setting       | Suggested value | Description | 
   | ------------ | ------------------ | ------------------------------------------------- | 
   | **Server name** | Any globally unique name | For valid server names, see [Naming rules and restrictions](https://docs.microsoft.com/azure/architecture/best-practices/naming-conventions). | 
   | **Server admin login** | Any valid name | For valid login names, see [Database Identifiers](https://docs.microsoft.com/sql/relational-databases/databases/database-identifiers).|
   | **Password** | Any valid password | Your password must have at least 8 characters and must contain characters from three of the following categories: upper case characters, lower case characters, numbers, and non-alphanumeric characters. |
   | **Location** | Any valid location | For information about regions, see [Azure Regions](https://azure.microsoft.com/regions/). |

   ![create database-server](../articles/sql-database/media/sql-database-design-first-database/create-database-server.png)

5. Click **Select**.

6. Click **Pricing tier** to specify the service tier, the number of DTUs, and the amount of storage. Explore the options for the amount of DTUs and storage that is available to you for each service tier. 

7. For this tutorial, select the **Standard** service tier and then use the slider to select **100 DTUs (S3)** and **400** GB of storage.

   ![create database-s1](../articles/sql-database/media/sql-database-design-first-database/create-empty-database-pricing-tier.png)

8. Accept the preview terms to use the **Add-on Storage** option. 

   > [!IMPORTANT]
   > \* Storage sizes greater than the amount of included storage are in preview and extra costs apply. For details, see [SQL Database pricing](https://azure.microsoft.com/pricing/details/sql-database/). 
   >
   >\* In the Premium tier, more than 1 TB of storage is currently available in the following regions: Canada Central, Canada East, France Central, Germany Central, Japan East, Korea Central, South Central US, South East Asia, US East2, West US, US Gov Virginia, and West Europe. See [P11-P15 Current Limitations](../articles/sql-database/sql-database-dtu-resource-limits-single-databases.md#single-database-limitations-of-p11-and-p15-when-the-maximum-size-greater-than-1-tb).  
   > 

9. After selecting the server tier, the number of DTUs, and the amount of storage, click **Apply**.  

10. Select a **collation** for the blank database (for this tutorial, use the default value). For more information about collations, see [Collations](https://docs.microsoft.com/sql/t-sql/statements/collations)

11. Click **Create** to provision the database. Provisioning takes about a minute and a half to complete. 

12. On the toolbar, click **Notifications** to monitor the deployment process.
    
     ![notification](../articles/sql-database/media/sql-database-get-started-portal/notification.png)

## Create a server-level firewall rule

The SQL Database service creates a firewall at the server-level that prevents external applications and tools from connecting to the server or any databases on the server unless a firewall rule is created to open the firewall for specific IP addresses. Follow these steps to create a [SQL Database server-level firewall rule](../articles/sql-database/sql-database-firewall-configure.md) for your client's IP address and enable external connectivity through the SQL Database firewall for your IP address only. 

> [!NOTE]
> SQL Database communicates over port 1433. If you are trying to connect from within a corporate network, outbound traffic over port 1433 may not be allowed by your network's firewall. If so, you cannot connect to your Azure SQL Database server unless your IT department opens port 1433.
>

1. After the deployment completes, click **SQL databases** from the left-hand menu and then click **mySampleDatabase** on the **SQL databases** page. The overview page for your database opens, showing you the fully qualified server name (such as **mynewserver20170824.database.windows.net**) and provides options for further configuration. 

2. Copy this fully qualified server name for use to connect to your server and its databases in subsequent quick starts. 

   ![server name](../articles/sql-database/media/sql-database-get-started-portal/server-name.png) 

3. Click **Set server firewall** on the toolbar. The **Firewall settings** page for the SQL Database server opens. 

   ![server firewall rule](../articles/sql-database/media/sql-database-get-started-portal/server-firewall-rule.png) 

4. Click **Add client IP** on the toolbar to add your current IP address to a new firewall rule. A firewall rule can open port 1433 for a single IP address or a range of IP addresses.

5. Click **Save**. A server-level firewall rule is created for your current IP address opening port 1433 on the logical server.

6. Click **OK** and then close the **Firewall settings** page.

You can now connect to the SQL Database server and its databases using SQL Server Management Studio or another tool of your choice from this IP address using the server admin account created previously.


> [!IMPORTANT]
> By default, access through the SQL Database firewall is enabled for all Azure services. Click **OFF** on this page to disable for all Azure services.

## SQL server connection information

Get the fully qualified server name for your Azure SQL Database server in the Azure portal. You use the fully qualified server name to connect to your server using SQL Server Management Studio.

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select **SQL Databases** from the left-hand menu, and click your database on the **SQL databases** page. 
3. In the **Essentials** pane in the Azure portal page for your database, locate and then copy the **Server name**.

   ![connection information](../articles/sql-database/media/sql-database-get-started-portal/server-name.png)
