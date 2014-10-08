<properties title="Get Started with  Azure SQL Database Elastic Scale" pageTitle="Get Started with  Azure SQL Database Elastic Scale" description="Basic explanation of Elastic Scale feature of Azure SQL Database, including easy to run sample app." metaKeywords="sharding scaling, Azure SQL DB sharding, elastic scale" services="sql-database" documentationCenter="" manager="jhubbard" authors="sidneyh@microsoft.com"/>

<tags ms.service="sql-database" ms.workload="sql-database" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/02/2014" ms.author="sidneyh" />

#Get Started with  Azure SQL Database Elastic Scale Preview

Growing and shrinking capacity on demand is one of the key cloud computing promises. Delivering on this promise has historically been tedious and complex for the database tier of cloud applications. Over the last few years, the industry has converged on well-established design patterns commonly known as sharding. While the general sharding pattern addresses the challenge, building and managing applications using sharding requires significant infrastructure investments independent of the application’s business logic. 

Azure SQL Database Elastic Scale (in preview) enables the data-tier of an application to scale out and in via industry-standard sharding practices, while significantly streamlining the development and management of your sharded cloud applications. Elastic Scale delivers both developer and management functionality which are provided through a set of .Net libraries and through Azure service templates that you can host in your own Azure subscription to manage your highly scalable applications. Azure DB Elastic Scale implements the infrastructure aspects of sharding and thus allows you to focus on the business logic of your application instead. 

This document introduces you to the developer experience for Azure SQL DB Elastic Scale. 

For more information about how Elastic Scale works, see [Elastic Scale Overview](http://go.microsoft.com/?linkid=9862592).

For a list of all topics on Elastic Scale, see [Elastic Scale Documentation Map](./sql-database-elastic-scale-documentation-map.md)

## The Elastic Scale Sample Application

The sample creates a simple sharded application and explores key capabilities of Elastic Scale. To download and run the application, follow the steps shown below or in the video [Elastic Scale - Get Started](http://go.microsoft.com/?linkid=9862983). 

###Prerequisites
To run the sample app, you must use Visual Studio, and you must have access to an Azure SQL Database running on Azure. If you do not already have a subscription to Azure, sign up for a [trial subscription](http://azure.microsoft.com/en-us/pricing/free-trial/).
####Visual Studio and Nuget

1. Visual Studio 2012 or higher with C# is required. Download a free version at [Visual Studio Downloads](http://www.visualstudio.com/en-us/downloads/download-visual-studio-vs.aspx).
2. Nuget 2.7 or higher. To get the latest version, see [Installing NuGet](http://docs.nuget.org/docs/start-here/installing-nuget)
####Create an Azure SQL database

* See [Getting Started with Microsoft Azure SQL Database](http://azure.microsoft.com/en-us/documentation/articles/sql-database-get-started/).

##Download and Run the Sample App
The **Elastic Scale with Azure SQL Database - Getting Started** sample application illustrates the most important aspects of the development experience for sharded applications using Azure SQL DB Elastic Scale. It focuses on key use cases for [Shard Map Management](http://go.microsoft.com/?linkid=9862595), [Data Dependent Routing](http://go.microsoft.com/?linkid=9862596) and [Multi-Shard Querying](http://go.microsoft.com/?linkid=9862597). To download and run the sample, follow these steps: 

1. Open Visual Studio and select **File -> New -> Project**.
2. In the dialog, click **Online**.

    ![New Project>Online][2]
3. Then click **Visual C#** under **Samples**.

    ![Click Visual C#][3]
4. In the search box, type **Elastic Scale** to search for the sample.The title **Elastic Scale with Azure SQL Database-Getting Started** appears.

    ![Search Box][1]
 
5. Select the sample, choose a name and a location for the new project and press **OK** to create the project.
6. Open the **app.config** file in the solution for the sample project and follow the instructions in the file to add your Azure SQL database server name and your login information (user name and password).
7. Build and run the application. When asked, please allow Visual Studio to restore the NuGet packages of the solution. This will download the latest version of the Elastic Scale client libraries from NuGet.
8. Play with the different options to learn more about the Elastic Scale capabilities. Note the steps the application takes in the console output and feel free to explore the code behind the scenes.

    ![progress][4]

Congratulations – you have successfully built and run your first Elastic Scale application on Azure SQL DB. Take a quick look at the shards that the sample created by connecting with SQL Server Management Studio to your Azure DB Server. You will notice new sample shard databases and a shard map manager database that the sample has created.

**Note**   If you do not have SQL Server Management Studio, see [Managing Azure SQL Database using SQL Server Management Studio](http://azure.microsoft.com/en-us/documentation/articles/sql-database-manage-azure-ssms/), which includes instructions for getting the tool.  

### Key pieces of the code sample

1. **Managing Shards and Shard Maps**: The code illustrates how to work with shards, ranges, and mappings in file **ShardMapManagerSample.cs**. You can find more information about this topic here: [Shard Map Management](http://go.microsoft.com/?linkid=9862595).  
2. **Data Dependent Routing**: Routing of transactions to the right shard is shown in **DataDependentRoutingSample.cs**. For more details, see [Data Dependent Routing](http://go.microsoft.com/?linkid=9862596). 
3. **Querying over Multiple Shards**: Querying across shards is illustrated in the file **MultiShardQuerySample.cs**. For more details, see [Multi-Shard Querying](http://go.microsoft.com/?linkid=9862597).
4. **Adding empty shards**: The iterative adding of new empty shards is performed by the code in
file **AddNewShardsSample.cs**. Details of this topic are covered here: [Shard Map Management](http://go.microsoft.com/?linkid=9862595).

### Other Elastic Scale Operations

1. **Splitting an existing shard**: The capability to split shards is provided through the **Split/Merge service**. You can find more information on this service here: [Split/Merge Service](http://go.microsoft.com/?linkid=9862795).
2. **Merging existing shards**: Shard merges are also performed using the **Split/Merge service**. For more information, refer to: [Split/Merge Service](http://go.microsoft.com/?linkid=9862795).   


## Cost

The Elastic Scale libraries and service templates are free. Elastic scale does not impose additional charges on top of the cost for your Azure usage. 

For example, the sample application creates new databases. The cost depends on the Azure SQL DB database edition you choose and the Azure usage of your application.

For pricing information see [SQL Database Pricing Details](http://azure.microsoft.com/en-us/pricing/details/sql-database/).

## Next Steps
For more information about the Elastic Scale feature, see:

* [Elastic Scale Learning Page](./sql-database-elastic-scale-documentation-map.md) 
-    Code Samples: 
    -    [Elastic Scale with Azure SQL Database - Getting Started](http://code.msdn.microsoft.com/Elastic-Scale-with-Azure-a80d8dc6?SRC=VSIDE)
    -    [Elastic Scale with Azure SQL Database - Integrating with Entity Framework](http://code.msdn.microsoft.com/Elastic-Scale-with-Azure-bae904ba?SRC=VSIDE)
    -    [Shard Elasticity on Script Center](http://go.microsoft.com/?linkid=9862617)
-    Blog: [Elastic Scale Announcement](http://go.microsoft.com/?linkid=9862608)
-    Channel 9: [Elastic Scale Overview](http://go.microsoft.com/?linkid=9862609)
-    Discussion Forum: [Azure SQL Database forum](http://social.msdn.microsoft.com/forums/azure/en-US/home?forum=ssdsgetstarted)


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
