<properties 
	pageTitle="Get started with elastic database tools" 
	description="Basic explanation of elastic database tools feature of Azure SQL Database, including easy to run sample app." 
	services="sql-database" 
	documentationCenter="" 
	manager="jhubbard" 
	authors="ddove" 
	editor="CarlRabeler"/>

<tags 
	ms.service="sql-database" 
	ms.workload="sql-database" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/27/2016" 
	ms.author="ddove"/>

# Get started with Elastic Database tools

This document introduces you to the developer experience by running the sample app. The sample creates a simple sharded application and explores key capabilities of elastic database tools. The sample demonstrates functions of the [elastic database client library](sql-database-elastic-database-client-library.md)

To install the library, go to [Microsoft.Azure.SqlDatabase.ElasticScale.Client](https://www.nuget.org/packages/Microsoft.Azure.SqlDatabase.ElasticScale.Client/). Note that the library is installed with the sample app described below.

## Prerequisites

1. Visual Studio 2012 or higher with C# is required. Download a free version at [Visual Studio Downloads](http://www.visualstudio.com/downloads/download-visual-studio-vs.aspx).
2. Nuget 2.7 or higher. To get the latest version, see [Installing NuGet](http://docs.nuget.org/docs/start-here/installing-nuget)

## Download and run the sample app

The **Elastic Database with Azure SQL— Getting Started** sample application illustrates the most important aspects of the development experience for sharded applications using Azure SQL elastic database tools. It focuses on key use cases for [shard map management](sql-database-elastic-scale-shard-map-management.md), [data dependent routing](sql-database-elastic-scale-data-dependent-routing.md) and [multi-shard querying](sql-database-elastic-scale-multishard-querying.md). To download and run the sample, follow these steps: 

1. Open Visual Studio and select **File -> New -> Project**.
2. In the dialog, click **Online**.

    ![New Project>Online][2]
3. Then click **Visual C#** under **Samples**.

    ![Click Visual C#][3]
4. In the search box, type **elastic db** to search for the sample.The title **Elastic DB Tools for Azure SQL - Getting Started** appears.

    ![Search Box][1]
 
5. Select the sample, choose a name and a location for the new project and press **OK** to create the project.
6. Open the **app.config** file in the solution for the sample project and follow the instructions in the file to add your Azure SQL database server name and your login information (user name and password).
7. Build and run the application. When asked, please allow Visual Studio to restore the NuGet packages of the solution. This will download the latest version of the elastic database client library from NuGet.
8. Play with the different options to learn more about the client library capabilities. Note the steps the application takes in the console output and feel free to explore the code behind the scenes.

    ![progress][4]

Congratulations – you have successfully built and run your first sharded application using elastic database tools on Azure SQL Database. Take a quick look at the shards that the sample created by connecting with Visual Studio or SQL Server Management Studio to your Azure DB Server. You will notice new sample shard databases and a shard map manager database that the sample has created.

> [AZURE.IMPORTANT] It is recommended that you always use the latest version of Management Studio to remain synchronized with updates to Microsoft Azure and SQL Database. [Update SQL Server Management Studio](https://msdn.microsoft.com/library/mt238290.aspx).


### Key pieces of the code sample

1. **Managing Shards and Shard Maps**: The code illustrates how to work with shards, ranges, and mappings in file **ShardMapManagerSample.cs**. You can find more information about this topic here: [Shard Map Management](http://go.microsoft.com/?linkid=9862595).  
2. **Data Dependent Routing**: Routing of transactions to the right shard is shown in **DataDependentRoutingSample.cs**. For more details, see [Data Dependent Routing](http://go.microsoft.com/?linkid=9862596). 
3. **Querying over Multiple Shards**: Querying across shards is illustrated in the file **MultiShardQuerySample.cs**. For more details, see [Multi-Shard Querying](http://go.microsoft.com/?linkid=9862597).
4. **Adding empty shards**: The iterative adding of new empty shards is performed by the code in
file **AddNewShardsSample.cs**. Details of this topic are covered here: [Shard Map Management](http://go.microsoft.com/?linkid=9862595).

### Other elastic scale operations

1. **Splitting an existing shard**: The capability to split shards is provided through the **split-merge tool**. You can find more information on this tool here: [split-merge tool overview](sql-database-elastic-scale-overview-split-and-merge.md).
2. **Merging existing shards**: Shard merges are also performed using the **split-merge tool**. For more information, refer to: [split-merge tool overview](sql-database-elastic-scale-overview-split-and-merge.md).   


## Cost

The elastic database tools are free of charge. Elastic database tools does not impose additional charges on top of the cost for your Azure usage. 

For example, the sample application creates new databases. The cost depends on the Azure SQL DB database edition you choose and the Azure usage of your application.

For pricing information see [SQL Database Pricing Details](https://azure.microsoft.com/pricing/details/sql-database/).

## Next steps
For more information about the elastic database tools, see:

* [Elastic database tools documentation map](https://azure.microsoft.com/documentation/learning-paths/sql-database-elastic-scale/) 
-    Code Samples: 
    -    [Elastic DB with Azure SQL - Getting Started](http://code.msdn.microsoft.com/Elastic-Scale-with-Azure-a80d8dc6?SRC=VSIDE)
    -    [Elastic DB with Azure SQL - Integrating with Entity Framework](http://code.msdn.microsoft.com/Elastic-Scale-with-Azure-bae904ba?SRC=VSIDE)
    -    [Shard Elasticity on Script Center](https://gallery.technet.microsoft.com/scriptcenter/Elastic-Scale-Shard-c9530cbe)
-    Blog: [Elastic Scale Announcement](https://azure.microsoft.com/blog/2014/10/02/introducing-elastic-scale-preview-for-azure-sql-database/)
-    Channel 9: [Elastic Scale Overview Video](http://channel9.msdn.com/Shows/Data-Exposed/Azure-SQL-Database-Elastic-Scale)
-    Discussion Forum: [Azure SQL Database forum](http://social.msdn.microsoft.com/forums/azure/home?forum=ssdsgetstarted)
-    To measure performance: [Performance counters for shard map manager](sql-database-elastic-database-client-library.md)


<!--Anchors-->
[The Elastic Scale Sample Application]: #The-Elastic-Scale-Sample-Application
[Download and Run the Sample App]: #Download-and-Run-the-Sample-App
[Cost]: #Cost
[Next steps]: #next-steps

<!--Image references-->
[1]: ./media/sql-database-elastic-scale-get-started/newProject.png
[2]: ./media/sql-database-elastic-scale-get-started/click-online.png
[3]: ./media/sql-database-elastic-scale-get-started/click-CSharp.png
[4]: ./media/sql-database-elastic-scale-get-started/output2.png
 
