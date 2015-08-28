<properties
	title="Getting started with elastic database query"
	pageTitle="Getting started with elastic database query"
	description="how to use elastic database query"
	metaKeywords="azure sql database elastic queries"
	services="sql-database"
	documentationCenter=""  
	manager="jeffreyg"
	authors="sidneyh"/>

<tags
	ms.service="sql-database"
	ms.workload="sql-database"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/23/2015"
	ms.author="sidneyh" />

# Getting started with Elastic Database query

Elastic Database query (preview) for Azure SQL Database allows you to run T-SQL queries that span multiple databases using a single connection point. For more information about the Elastic Database query feature, please see the [feature overview page](sql-database-elastic-query-overview.md).

This topic extends the sample found in [Getting started with Elastic Database tools](sql-database-elastic-scale-get-started.md). When completed, you will: learn how to configure and use an Azure SQL Database to perform queries that span many related databases.
## Prerequisites

Download and run the [Getting started with Elastic Database tools sample](sql-database-elastic-scale-get-started.md).

## Create a shard map manager using the sample app

Here you will create a shard map manager along with several shards, followed by insertion of data into the shards. If you happen to already have shards setup with sharded data in them, you can skip the following steps and move to the next section.

1. Build and run the **Getting started with Elastic Database tools** sample application. Follow the steps until step 7 in the section [Download and run the sample app](sql-database-elastic-scale-get-started.md#Getting-started-with-elastic-database-tools). At the end of Step 7, you will see the following command prompt:

	![command prompt][1]

2.  In the command window, type "1" and press **Enter**. This creates the shard map manager, and adds two shards to the server. Then type "3" and press **Enter**; repeat the action four times. This inserts sample data rows in your shards.
3.  The [Azure preview portal](https://portal.azure.com) should show three new databases in your v12 server:

	![Visual Studio confirmation][2]

	At this point, cross-database queries are supported through the Elastic Database client libraries. For example, use option 4 in the command window. The results from a multi-shard query are always a **UNION ALL** of the results from all shards.

	In the next section, we create a sample database endpoint that supports richer querying of the data across shards.

## Create an elastic query database

1. Open the [Azure preview portal](https://portal.azure.com) and log in.
2. Create a new Azure SQL database in the same server as your shard setup. Name the database "ElasticDBQuery." For a pricing tier, you must select one of the premium offers. The Elastic Database query is currently available only on the premium tier.

	![Azure portal and pricing tier][3]

	Note: you can use an existing premium database. If you can do so, it must not be one of the shards that you would like to execute your queries on. This database will be used for creating the metadata objects for an elastic database query.


## Create database objects

### Database-scoped master key and credentials

These are used to connect to the shard map manager and the shards:

1. Open SQL Server Management Studio or SQL Server Data Tools in Visual Studio.
2. Connect to ElasticDBQuery database and execute the following T-SQL commands:

		CREATE MASTER KEY ENCRYPTION BY PASSWORD = '<password>';

		CREATE DATABASE SCOPED CREDENTIAL ElasticDBQueryCred
		WITH IDENTITY = '<username>',
		SECRET = '<password>';

	"username" and "password" should be the same as login information used in step 6 of [Download and run the sample app](sql-database-elastic-scale-get-started.md#Getting-started-with-elastic-database-tools) in [Getting started with elastic database tools](sql-database-elastic-scale-get-started.md).

### External data sources

To create an external data source, execute the following command on the ElasticDBQuery database:

	CREATE EXTERNAL DATA SOURCE MyElasticDBQueryDataSrc WITH
      (TYPE = SHARD_MAP_MANAGER,
      LOCATION = '<server_name>.database.windows.net',
      DATABASE_NAME = 'ElasticScaleStarterKit_ShardMapManagerDb',
	  CREDENTIAL = ElasticDBQueryCred,
 	  SHARD_MAP_NAME = 'CustomerIDShardMap'
    ) ;

 "CustomerIDShardMap" is the name of the shard map, if you created the shard map and shard map manager using the elastic database tools sample. However, if you used your custom setup for this sample, then it should be the shard map name you chose in your application.

### External tables

Create an external table that matches the Customers table on the shards by executing the following command on ElasticDBQuery database:

	CREATE EXTERNAL TABLE [dbo].[Customers]
	( [CustomerId] [int] NOT NULL,
	  [Name] [nvarchar](256) NOT NULL,
	  [RegionId] [int] NOT NULL)
	WITH
	( DATA_SOURCE = MyElasticDBQueryDataSrc,
      DISTRIBUTION = SHARDED([CustomerId])
	) ;

## Execute a sample elastic database T-SQL query

Once you have defined your external data source and your external tables you can now use full T-SQL over your external tables.

Execute this query on the ElasticDBQuery database:

	select count(CustomerId) from [dbo].[Customers]

You will notice that the query aggregates results from all the shards and gives the following output:

![Output details][4]

## Import elastic database query results to Excel

 You can import the results from of a query to an Excel file.

1. Launch Excel 2013.
2. 	Navigate to the **Data** ribbon.
3. 	Click **From Other Sources** and click **From SQL Server**.

	![Excel import from other sources][5]
4. 	In the **Data Connection Wizard** type the server name and login credentials. Then click **Next**.
5. 	In the dialog box **Select the database that contains the data you want**, select the **ElasticDBQuery** database.
6. 	Select the **Customers** table in the list view and click **Next**. Then click **Finish**.
7. 	In the **Import Data** form, under **Select how you want to view this data in your workbook**, select **Table** and click **OK**.

All the rows from **Customers** table, stored in different shards populate the Excel sheet.

## Next steps
You can now use Excel’s powerful data functions. You can use the connection string with your server name, database name and credentials to connect your BI and data integration tools to the elastic query database. Make sure that SQL Server is supported as a data source for your tool. You can refer to the elastic query database and external tables just like any other SQL Server database and SQL Server tables that you would connect to with your tool.

### Cost
There is no additional charge for using the Elastic Database Query feature. However, at this time this feature is available only on premium databases as an end point, but the shards can be of any service tier.

For pricing information see [SQL Database Pricing Details](http://azure.microsoft.com/pricing/details/sql-database/).


[AZURE.INCLUDE [elastic-scale-include](../../includes/elastic-scale-include.md)]

<!--Image references-->
[1]: ./media/sql-database-elastic-query-getting-started/cmd-prompt.png
[2]: ./media/sql-database-elastic-query-getting-started/portal.png
[3]: ./media/sql-database-elastic-query-getting-started/tiers.png
[4]: ./media/sql-database-elastic-query-getting-started/details.png
[5]: ./media/sql-database-elastic-query-getting-started/exel-sources.png
<!--anchors-->
