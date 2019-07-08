---
title: Get started with Elastic Database Tools - Azure | Microsoft Docs
description: Basic explanation of the Elastic Database Tools feature of Azure SQL Database, including an easy-to-run sample app.
services: sql-database
ms.service: sql-database
ms.subservice: scale-out
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: anumjs
ms.author: anjangsh
ms.reviewer: sstein
manager: craigg
ms.date: 01/25/2019
---
# Get started with Elastic Database Tools

This document introduces you to the developer experience for the [elastic database client library](sql-database-elastic-database-client-library.md) by helping you run a sample app. The sample app creates a simple sharded application and explores key capabilities of the Elastic Database Tools feature of Azure SQL Database. It focuses on use cases for [shard map management](sql-database-elastic-scale-shard-map-management.md), [data-dependent routing](sql-database-elastic-scale-data-dependent-routing.md), and [multi-shard querying](sql-database-elastic-scale-multishard-querying.md). The client library is available for .NET as well as Java. 

## Elastic Database Tools for Java

### Prerequisites

* A Java Developer Kit (JDK), version 1.8 or later
* [Maven](https://maven.apache.org/download.cgi)
* A SQL Database server in Azure or a local SQL Server instance

### Download and run the sample app

To build the JAR files and get started with the sample project, do the following: 
1. Clone the [GitHub repository](https://github.com/Microsoft/elastic-db-tools-for-java) containing the client library, along with the sample app. 

2. Edit the _./sample/src/main/resources/resource.properties_ file to set the following:
    * TEST_CONN_USER
    * TEST_CONN_PASSWORD
    * TEST_CONN_SERVER_NAME

3. To build the sample project, in the _./sample_ directory, run the following command:

    ```
    mvn install
    ```
    
4. To start the sample project, in the _./sample_ directory, run the following command: 
    
    ```
    mvn -q exec:java "-Dexec.mainClass=com.microsoft.azure.elasticdb.samples.elasticscalestarterkit.Program"
    ```
    
5. To learn more about the client library capabilities, experiment with the various options. Feel free to explore the code to learn about the sample app implementation.

    ![Progress-java][5]
    
Congratulations! You have successfully built and run your first sharded application by using Elastic Database Tools on Azure SQL Database. Use Visual Studio or SQL Server Management Studio to connect to your SQL database and take a quick look at the shards that the sample created. You will notice new sample shard databases and a shard map manager database that the sample has created. 

To add the client library to your own Maven project, add the following dependency in your POM file:

```xml
<dependency> 
    <groupId>com.microsoft.azure</groupId> 
    <artifactId>elastic-db-tools</artifactId> 
    <version>1.0.0</version> 
</dependency> 
```

## Elastic Database Tools for .NET

### Prerequisites

* Visual Studio 2012 or later with C#. Download a free version at [Visual Studio Downloads](https://www.visualstudio.com/downloads/download-visual-studio-vs.aspx).
* NuGet 2.7 or later. To get the latest version, see [Installing NuGet](https://docs.nuget.org/docs/start-here/installing-nuget).

### Download and run the sample app

To install the library, go to [Microsoft.Azure.SqlDatabase.ElasticScale.Client](https://www.nuget.org/packages/Microsoft.Azure.SqlDatabase.ElasticScale.Client/). The library is installed with the sample app that's described in the following section.

To download and run the sample, follow these steps: 

1. Download the [Elastic DB Tools for Azure SQL - Getting Started sample](https://code.msdn.microsoft.com/windowsapps/Elastic-Scale-with-Azure-a80d8dc6) from MSDN. Unzip the sample to a location that you choose.

2. To create a project, open the *ElasticScaleStarterKit.sln* solution from the *C#* directory.

3. In the solution for the sample project, open the *app.config* file. Then follow the instructions in the file to add your Azure SQL Database server name and your sign-in information (username and password).

4. Build and run the application. When you are prompted, enable Visual Studio to restore the NuGet packages of the solution. This action downloads the latest version of the elastic database client library from NuGet.

5. To learn more about the client library capabilities, experiment with the various options. Note the steps that the application takes in the console output, and feel free to explore the code behind the scenes.
   
    ![Progress][4]

Congratulations! You have successfully built and run your first sharded application by using Elastic Database Tools on SQL Database. Use Visual Studio or SQL Server Management Studio to connect to your SQL database and take a quick look at the shards that the sample created. You will notice new sample shard databases and a shard map manager database that the sample has created.

> [!IMPORTANT]
> We recommend that you always use the latest version of Management Studio so that you stay synchronized with updates to Azure and SQL Database. [Update SQL Server Management Studio](https://msdn.microsoft.com/library/mt238290.aspx).

## Key pieces of the code sample

* **Managing shards and shard maps**: The code illustrates how to work with shards, ranges, and mappings in the *ShardManagementUtils.cs* file. For more information, see [Scale out databases with the shard map manager](https://go.microsoft.com/?linkid=9862595).  

* **Data-dependent routing**: Routing of transactions to the right shard is shown in the *DataDependentRoutingSample.cs* file. For more information, see [Data-dependent routing](https://go.microsoft.com/?linkid=9862596). 

* **Querying over multiple shards**: Querying across shards is illustrated in the *MultiShardQuerySample.cs* file. For more information, see [Multi-shard querying](https://go.microsoft.com/?linkid=9862597).

* **Adding empty shards**: The iterative adding of new empty shards is performed by the code in the *CreateShardSample.cs* file. For more information, see [Scale out databases with the shard map manager](https://go.microsoft.com/?linkid=9862595).

## Other elastic scale operations

* **Splitting an existing shard**: The capability to split shards is provided by the split-merge tool. For more information, see [Moving data between scaled-out cloud databases](sql-database-elastic-scale-overview-split-and-merge.md).

* **Merging existing shards**: Shard merges are also performed by using the split-merge tool. For more information, see [Moving data between scaled-out cloud databases](sql-database-elastic-scale-overview-split-and-merge.md).   

## Cost

The Elastic Database Tools library is free. When you use Elastic Database Tools, you incur no additional charges beyond the cost of your Azure usage. 

For example, the sample application creates new databases. The cost of this capability depends on the SQL Database edition you choose and the Azure usage of your application.

For pricing information, see [SQL Database pricing details](https://azure.microsoft.com/pricing/details/sql-database/).

## Next steps

For more information about Elastic Database Tools, see the following articles:

* Code samples: 
  * Elastic Database Tools ([.NET](https://code.msdn.microsoft.com/Elastic-Scale-with-Azure-a80d8dc6?SRC=VSIDE), [Java](https://search.maven.org/#search%7Cga%7C1%7Ca%3A%22azure-elasticdb-tools%22))
  * [Elastic Database Tools for Azure SQL - Entity Framework Integration](https://code.msdn.microsoft.com/Elastic-Scale-with-Azure-bae904ba?SRC=VSIDE)
  * [Shard Elasticity on Script Center](https://gallery.technet.microsoft.com/scriptcenter/Elastic-Scale-Shard-c9530cbe)
* Blog: [Elastic Scale announcement](https://azure.microsoft.com/blog/20../../introducing-elastic-scale-preview-for-azure-sql-database/)
* Channel 9: [Elastic Scale overview video](https://channel9.msdn.com/Shows/Data-Exposed/Azure-SQL-Database-Elastic-Scale)
* Discussion forum: [Azure SQL Database forum](https://social.msdn.microsoft.com/forums/azure/home?forum=ssdsgetstarted)
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

