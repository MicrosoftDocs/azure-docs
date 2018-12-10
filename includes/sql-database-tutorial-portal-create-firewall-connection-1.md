---
author: MightyPen
ms.service: sql-database
ms.topic: include
ms.date: 12/10/2018	
ms.author: genemi
---
## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).

## Create a blank SQL database

An Azure SQL database is created with a defined set of [compute and storage resources](../articles/sql-database/sql-database-service-tiers-dtu.md). The database is created within an [Azure resource group](../articles/azure-resource-manager/resource-group-overview.md) and in an [Azure SQL Database logical server](../articles/sql-database/sql-database-features.md). 

Follow these steps to create a blank SQL database. 

1. Click **Create a resource** in the upper left-hand corner of the Azure portal.

1. Select **Databases** from the **New** page, and select **Create** under **SQL Database** on the **New** page.

   ![create empty-database](../articles/sql-database/media/sql-database-design-first-database/create-empty-database.png)

1. Fill out the SQL Database form with the following information, as shown on the preceding image:

   | Setting       | Suggested value | Description | 
   | ------------ | ------------------ | ------------------------------------------------- |
   | **Database name** | mySampleDatabase | For valid database names, see [Database Identifiers](/sql/relational-databases/databases/database-identifiers). |
   | **Subscription** | Your subscription  | For details about your subscriptions, see [Subscriptions](https://account.windowsazure.com/Subscriptions). |
   | **Resource group** | myResourceGroup | For valid resource group names, see [Naming rules and restrictions](/azure/architecture/best-practices/naming-conventions). |
   | **Select source** | Blank database | Specifies that a blank database should be created. |

1. Click **Server** to create and configure a new server for your new database. Fill out the **New server form** with the following information: 

   | Setting       | Suggested value | Description |
   | ------------ | ------------------ | ------------------------------------------------- |
   | **Server name** | Any globally unique name | For valid server names, see [Naming rules and restrictions](/azure/architecture/best-practices/naming-conventions). |
   | **Server admin login** | Any valid name | For valid login names, see [Database Identifiers](/sql/relational-databases/databases/database-identifiers).|
   | **Password** | Any valid password | Your password must have at least 8 characters and must contain characters from three of the following categories: upper case characters, lower case characters, numbers, and non-alphanumeric characters. |
   | **Location** | Any valid location | For information about regions, see [Azure Regions](https://azure.microsoft.com/regions/). |

   ![create database-server](../articles/sql-database/media/sql-database-design-first-database/create-database-server.png)

1. Click **Select**.

1. Click **Pricing tier** to specify the service tier, the number of DTUs, and the amount of storage. Explore the options for the amount of DTUs and storage that is available to you for each service tier.

1. For this tutorial, select the **Standard** service tier and then use the slider to select **100 DTUs (S3)** and **400** GB of storage.

   ![create database-s1](../articles/sql-database/media/sql-database-design-first-database/create-empty-database-pricing-tier.png)

1. After selecting the server tier, the number of DTUs, and the amount of storage, click **Apply**.  

1. Select a **collation** for the blank database (for this tutorial, use the default value). For more information about collations, see [Collations](/sql/t-sql/statements/collations)

1. Click **Create** to provision the database. Provisioning takes about a minute and a half to complete. 

1. On the toolbar, click **Notifications** to monitor the deployment process.

     ![notification](../articles/sql-database/media/sql-database-get-started-portal/notification.png)

## Create a server-level firewall rule

The SQL Database service creates a firewall at the server-level that prevents external applications and tools from connecting to the server or any databases on the server unless a firewall rule is created to open the firewall for specific IP addresses. Follow these steps to create a [SQL Database server-level firewall rule](../articles/sql-database/sql-database-firewall-configure.md) for your client's IP address and enable external connectivity through the SQL Database firewall for your IP address only.

> [!NOTE]
> SQL Database communicates over port 1433. If you are trying to connect from within a corporate network, outbound traffic over port 1433 may not be allowed by your network's firewall. If so, you cannot connect to your Azure SQL Database server unless your IT department opens port 1433.
>

1. After the deployment completes, click **SQL databases** from the left-hand menu and then click **mySampleDatabase** on the **SQL databases** page. The overview page for your database opens, showing you the fully qualified server name (such as *myserver.database.windows.net*) and provides options for further configuration.

1. Copy this fully qualified server name for use to connect to your server and its databases in subsequent quick starts.

   ![server name](../articles/sql-database/media/sql-database-get-started-portal/server-name.png)

1. Click **Set server firewall** on the toolbar. The **Firewall settings** page for the SQL Database server opens.

   ![server firewall rule](../articles/sql-database/media/sql-database-get-started-portal/server-firewall-rule.png)

1. Click **Add client IP** on the toolbar to add your current IP address to a new firewall rule. A firewall rule can open port 1433 for a single IP address or a range of IP addresses.

1. Click **Save**. A server-level firewall rule is created for your current IP address opening port 1433 on the logical server.

1. Click **OK** and then close the **Firewall settings** page.

You can now connect to the SQL Database server and its databases using SQL Server Management Studio or another tool of your choice from this IP address using the server admin account created previously.

> [!IMPORTANT]
> By default, access through the SQL Database firewall is enabled for all Azure services. Click **OFF** on this page to disable for all Azure services.
