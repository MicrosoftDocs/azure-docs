---
title: Get started with elastic database tools | Microsoft Docs
description: Basic explanation of the elastic database tools feature of Azure SQL Database, including an easy-to-run sample app.
services: sql-database
documentationcenter: ''
manager: jstrauss
author: anumjs
editor: CarlRabeler
ms.assetid: b6911f8d-2bae-4d04-9fa8-f79a3db7129d
ms.service: sql-database
ms.custom: scale out apps
ms.workload: "On Demand"
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/16/2017
ms.author: anjangsh

---
# Get started with elastic database tools
This document introduces you to the developer experience for [elastic database client library](sql-database-elastic-database-client-library.md) by helping you run a sample app. The sample app creates a simple sharded application and explores key capabilities of elastic database tools. It focuses on use cases for [shard map management](sql-database-elastic-scale-shard-map-management.md), [data-dependent routing](sql-database-elastic-scale-data-dependent-routing.md), and [multi-shard querying](sql-database-elastic-scale-multishard-querying.md). The client library is available for .Net as well as Java. 

## Elastic database tools for Java
### Prerequisites
* A Java Developer Kit (JDK), v 1.8 or later
* [Maven](http://maven.apache.org/download.cgi)
* A logical server in Azure or local SQL Server

### Download and run the sample app
Follow the steps below to build the JAR files and get started with the sample project: 
1. Clone the [GitHub repository](https://github.com/Microsoft/elastic-db-tools-for-java) containing the client library along with the sample app. 
2. Edit the _./sample/src/main/resources/resource.properties_ file to set the following.
    * TEST_CONN_USER
    * TEST_CONN_PASSWORD
    * TEST_CONN_SERVER_NAME
3. From the _./sample_ directory, run the following command to build the sample project.<br>

    ```
    mvn install
    ```
    
4. From the _./sample_ directory, run the following command to start the sample project. 
    
    ```
    mvn -q exec:java "-Dexec.mainClass=com.microsoft.azure.elasticdb.samples.elasticscalestarterkit.Program"
    ```
    
5. Experiment with the different options to learn more about the client library capabilities. Feel free to explore the code to learn about the sample app implementation.

    ![Progress-java][5]
    
Congratulations! You have successfully built and run your first sharded application by using elastic database tools on SQL Database. Use Visual Studio or SQL Server Management Studio to connect to your SQL database and take a quick look at the shards that the sample created. You will notice new sample shard databases and a shard map manager database that the sample has created. 
To add the client library to your own Maven project, add the following dependency in your POM file.<br>

```xml
<dependency> 
    <groupId>com.microsoft.azure</groupId> 
    <artifactId>elastic-db-tools</artifactId> 
    <version>1.0.0</version> 
</dependency> 
```

## Elastic database tools for .Net 
### Prerequisites
* Visual Studio 2012 or later with C#. Download a free version at [Visual Studio Downloads](http://www.visualstudio.com/downloads/download-visual-studio-vs.aspx).
* NuGet 2.7 or later. To get the latest version, see [Installing NuGet](http://docs.nuget.org/docs/start-here/installing-nuget).

### Download and run the sample app
To install the library, go to [Microsoft.Azure.SqlDatabase.ElasticScale.Client](https://www.nuget.org/packages/Microsoft.Azure.SqlDatabase.ElasticScale.Client/). The library is installed with the sample app that's described in the following section.

To download and run the sample, follow these steps: 

1. Download the [Elastic DB Tools for Azure SQL - Getting Started sample](https://code.msdn.microsoft.com/windowsapps/Elastic-Scale-with-Azure-a80d8dc6) from MSDN. Unzip the sample to a location that you choose.

2. To create a project, open the **ElasticScaleStarterKit.sln** solution from the **C#** directory.

3. In the solution for the sample project, open the **app.config** file. Then follow the instructions in the file to add your Azure SQL Database server name and your sign-in information (user name and password).

4. Build and run the application. When prompted, enable Visual Studio to restore the NuGet packages of the solution. This downloads the latest version of the elastic database client library from NuGet.

5. Experiment with the different options to learn more about the client library capabilities. Note the steps the application takes in the console output and feel free to explore the code behind the scenes.
   
    ![Progress][4]

Congratulations--you have successfully built and run your first sharded application by using elastic database tools on SQL Database. Use Visual Studio or SQL Server Management Studio to connect to your SQL database and take a quick look at the shards that the sample created. You will notice new sample shard databases and a shard map manager database that the sample has created.

> [!IMPORTANT]
> We recommend that you always use the latest version of Management Studio so that you stay synchronized with updates to Azure and SQL Database. [Update SQL Server Management Studio](https://msdn.microsoft.com/library/mt238290.aspx).
> 
> 

## Key pieces of the code sample
* **Managing shards and shard maps**: The code illustrates how to work with shards, ranges, and mappings in the file **ShardManagementUtils.cs**. For more information, see [Scale out databases with the shard map manager](http://go.microsoft.com/?linkid=9862595).  

* **Data-dependent routing**: Routing of transactions to the right shard is shown in **DataDependentRoutingSample.cs**. For more information, see [Data-dependent routing](http://go.microsoft.com/?linkid=9862596). 

* **Querying over multiple shards**: Querying across shards is illustrated in the file **MultiShardQuerySample.cs**. For more information, see [Multi-shard querying](http://go.microsoft.com/?linkid=9862597).

* **Adding empty shards**: The iterative adding of new empty shards is performed by the code in the file **CreateShardSample.cs**. For more information, see [Scale out databases with the shard map manager](http://go.microsoft.com/?linkid=9862595).

## Other elastic scale operations
* **Splitting an existing shard**: The capability to split shards is provided by the **split-merge tool**. For more information, see [Moving data between scaled-out cloud databases](sql-database-elastic-scale-overview-split-and-merge.md).

* **Merging existing shards**: Shard merges are also performed by using the **split-merge tool**. For more information, see [Moving data between scaled-out cloud databases](sql-database-elastic-scale-overview-split-and-merge.md).   

## Cost
The elastic database tools are free. When you use elastic database tools, you don't receive any additional charges on top of the cost of your Azure usage. 

For example, the sample application creates new databases. The cost for this depends on the SQL Database edition you choose and the Azure usage of your application.

For pricing information, see [SQL Database pricing details](https://azure.microsoft.com/pricing/details/sql-database/).

## Next steps
For more information about elastic database tools, see the following pages:

* Code samples: 
  * Elastic Database Tools ([.NET](http://code.msdn.microsoft.com/Elastic-Scale-with-Azure-a80d8dc6?SRC=VSIDE), [Java](https://search.maven.org/#search%7Cga%7C1%7Ca%3A%22azure-elasticdb-tools%22))
  * [Elastic DB Tools for Azure SQL - Entity Framework Integration](http://code.msdn.microsoft.com/Elastic-Scale-with-Azure-bae904ba?SRC=VSIDE)
  * [Shard Elasticity on Script Center](https://gallery.technet.microsoft.com/scriptcenter/Elastic-Scale-Shard-c9530cbe)
* Blog: [Elastic Scale announcement](https://azure.microsoft.com/blog/2014/10/02/introducing-elastic-scale-preview-for-azure-sql-database/)
* Microsoft Virtual Academy: [Implementing Scale-Out Using Sharding with the Elastic Database Client Library Video](https://mva.microsoft.com/training-courses/elastic-database-capabilities-with-azure-sql-db-16554?l=lWyQhF1fC_6306218965) 
* Channel 9: [Elastic Scale overview video](http://channel9.msdn.com/Shows/Data-Exposed/Azure-SQL-Database-Elastic-Scale)
* Discussion forum: [Azure SQL Database forum](http://social.msdn.microsoft.com/forums/azure/home?forum=ssdsgetstarted)
* To measure performance: [Performance counters for shard map manager](sql-database-elastic-database-client-library.md)

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
[5]: ./media/sql-database-elastic-scale-get-started/java-client-library.PNG

