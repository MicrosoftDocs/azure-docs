<properties title="Get Started with  Azure SQL Database Elastic Scale" pageTitle="Get Started with  Azure SQL Database Elastic Scale" description="Scale Azure SQL Database shards with elastic scale APIs, Azure elastic scale Getting Started" metaKeywords="sharding scaling, Azure SQL DB sharding, elastic scale" services="sql-database" documentationCenter="sql-database" authors="sidneyh@microsoft.com"/>

<tags ms.service="sql-database" ms.workload="sql-database" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/02/2014" ms.author="sidneyh" />

#Get Started with  Azure SQL Database Elastic Scale 

Growing and shrinking capacity on demand is one of the key cloud computing promises. Delivering on this promise has historically been tedious and complex for the database tier of cloud applications. Over the last few years, the industry has converged on well-established design patterns commonly known as sharding. While the general sharding pattern addresses the challenge, building and managing applications using sharding requires significant infrastructure investments independent of the application’s business logic. 

Azure SQL Database Elastic Scale (in preview) enables the data-tier of an application to scale out and in via industry-standard sharding practices, while significantly streamlining the development and management of your sharded cloud applications. Elastic Scale delivers both developer and management functionality which are provided through a set of .Net libraries and through Azure service templates that you can host in your own Azure subscription to manage your highly scalable applications. Azure DB Elastic Scale implements the infrastructure aspects of sharding and thus allows you to focus on the business logic of your application instead. 

This document introduces you to the developer experience for Azure SQL DB Elastic Scale. The sample creates a simple sharded application and explores key capabilities of Elastic Scale.

For more information about how Elastic Scale works, see [Elastic Scale Overview](./elastic-scale-intro.md).
## The Elastic Scale Sample Application

###Prerequisites
To run the sample app, you must use Visual Studio, and you must have access to an Azure SQL Database running on Azure. If you do not already have a subscription to Azure, sign up for a [trial subscription](http://azure.microsoft.com/en-us/pricing/free-trial/).
####Visual Studio and Nuget

Download a version of Visual Studio 2013 from [Visual Studio Downloads](http://www.visualstudio.com/en-us/downloads/download-visual-studio-vs.aspx).
####Create an Azure SQL database

1. Log into the [Azure Management portal](https://manage.windowsazure.com).
2. In the bottom left corner, click **New**. Then click **Data services>SQL database>Quick Create**. 
   ![Click New>Data services>SQL database>Quick Create][1]

3. Fill in the **database name**, and select a **subscription** from the dropdown list.
4. In the **Server** box, select **New SQL Database Server** from the dropdown list; then create a new login name and password.
5.  Copy and save the login name and password for later use when configuring the sample app.
6.  In the left panel of the portal, click **SQL Databases**. 
    ![Clcik SQL Databases][2]
7. Click the name of the your database.
8. Click **Dashboard** to see more details about the database.

    ![Click Dashboard][3]
9. Under **quick glance**, find the **server name**, then copy and save the entire name, including—"database.windows.net"—for later use when configuring the sample.

    ![Find Server Name][4]

10. Set the allowed IP address for the machine being used to access the database.
    1. Under **quick glance**, click **Manage allowed IP addresses**.
    2.  Click **Add to the allowed IP addresses**.

        ![Click Add to the allowed IP addresses][6]
    3. If the address is not added, Visual Studio will display the **System.Data.SqlClient.SQLException** shown below. If this occurs, note the IP address in the dialog and set it as an allowed IP address.
    
        ![SQL Exception][7]

You can also set allowed IP address range using the [Set-AzureSqlDatabaseServerFirewallRule](http://msdn.microsoft.com/en-us/library/azure/dn546739.aspx) cmdlet.

##Download and Run the Sample App
The **Elastic Scale with Azure SQL Database - Getting Started** sample application illustrates the most important aspects of the development experience for sharded applications using Azure SQL DB Elastic Scale. It focuses on key use cases for Shard Map Management, Data Dependent Routing and Multi-Shard Querying. (To understand these capabilities, see TBD.) 

1. Open Visual Studio and select **File -> New -> Project**.
2. In the dialog, click **Online**.

    ![New Project>Online][9]
3. Then click **Visual C#** under **Samples**.

    ![Click Visual C#][10]
4. In the search box, type **Elastic Scale** to search for the sample.The title **Elastic Scale with Azure SQL Database-Getting Started** appears.

    ![Search Box][5]
 
5. Select the sample, choose a name and a location for the new project and press **OK** to create the project.
6. Open the **app.config** file in the solution for the sample project and follow the instructions in the file to add your Azure SQL database server name and your login information (user name and password).
7. Build and run the application. When asked, please allow Visual Studio to restore the NuGet packages of the solution. This will download the latest version of the Elastic Scale client libraries from NuGet.
8. Follow the progress of the sample in the console window and note the Elastic Scale steps it takes in the output.

    ![progress][8]

Congratulations – you have successfully built and run your first Elastic Scale application on Azure SQL DB. Take a quick look at the shards that the sample created by connecting with SQL Server Management Studio to your Azure DB Server. You will notice  two new sample shard databases and a shard map manager database that the sample has created.

**Note**   If you do not have SQL Server Management Studio, see [Managing Azure SQL Database using SQL Server Management Studio](http://azure.microsoft.com/en-us/documentation/articles/sql-database-manage-azure-ssms/), which includes instructions for getting the tool.  

### Key pieces of the code sample

1. **Managing Shards and Shard Maps**: The code illustrates how to create and register new shards in your shard map using the **ShardMapManager** and **ShardMap** classes of the Elastic Scale libraries. In particular, see the function **CreateShards** in file **ShardMapManagerSample.cs**. Creation of mappings of sharding key ranges to shards is demonstrated in the function **CreateMappings** in file **ShardMapManagementSample.cs**. Also note the use of the **RangeMapping** class. You can find more information about shards, shard maps, ranges, and mappings here: http://go.microsoft.com/?linkid=9862595.  
2. **Data Dependent Routing**: Explore how Elastic Scale helps you route your transactions to the appropriate shards given a sharding key in file **DataDependentRoutingSample.cs**. Notice the use of the **OpenConnectionForKey** function. Refer to http://go.microsoft.com/?linkid=9862596 for more details on data dependent routing.
3. **Querying over Multiple Shards**: Querying across shards and the use of the **MultiShardConnection**, **MultiShardCommand**, and **MultiShardDataReader** classes are illustrated in the file **MultiShardQuerySample.cs**. Multi-Shard querying is explained in more detail here: http://go.microsoft.com/?linkid=9862597. 
4.    **Adding empty shards**: The iterative adding of new empty shards relies on the capabilities of the shard map. Take a look at the file **AddNewShardsSample.cs** and the **ExecuteShardAdditions** method to learn more about adding empty shards to your existing application. For more information about shards, shard maps, ranges, and mappings, see: http://go.microsoft.com/?linkid=9862595.
5.    **Splitting an existing shard**: The capability to split shards is provided through the **Split/Merge service**. These services need to be hosted in your Windows Azure subscription. You can find more information on how to download, deploy and configure this service here: http://go.microsoft.com/?linkid=9862795.  
6.    **Merging existing shards**: Shard merges are also performed using the **Split/Merge service**, which needs to be hosted in your Windows Azure subscription. For more information on how to download, deploy and configure this service, refer to: http://go.microsoft.com/?linkid=9862795.  

To find out more about the architecture of the Elastic Scale, see TBD. 

## Cost

The Elastic Scale libraries and service templates are free. Elastic scale does not impose additional charges on top of the cost for your Azure usage. 

For example, the sample application creates three databases (2 shard databases and 1 shard map manager database). The cost depends on the Azure SQL DB database edition you choose and the Azure usage of your application. There is no additional cost for the Elastic Scale libraries.  

For pricing information see [SQL Database Pricing Details](http://azure.microsoft.com/en-us/pricing/details/sql-database/).

## Next Steps
For more information about the Elastic Scale feature, see:
-    Technical Documentation: [Link to Elastic Scale MSDN landing page]
-    Code Samples: [Link to Elastic Scale samples]
-    Blog: [Link to Elastic Scale blog – or do we use the normal SQL Blog?]
-    Channel 9: [Link to Elastic Scale Channel 9 content]
-    Discussion Forum: [Link to Azure SQL Database forum]

[api-management-create-instance-menu]: ./media/api-management-get-started/api-management-create-instance-menu.png

<!--Anchors-->
[The Elastic Scale Sample Application]: #The-Elastic-Scale-Sample-Application
[Download and Run the Sample App]: #Download-and-Run-the-Sample-App
[Cost]: #Cost
[Next steps]: #next-steps

<!--Image references-->
[1]: ./media/elastic-scale-get-started/CreateDb.png
[2]: ./media/elastic-scale-get-started/FindDbName.png
[3]: ./media/elastic-scale-get-started/dashboard.png
[4]: ./media/elastic-scale-get-started/servername.png
[5]: ./media/elastic-scale-get-started/newProject.png
[6]: ./media/elastic-scale-get-started/allowedIp.png
[7]: ./media/elastic-scale-get-started/IPException.png
[8]: ./media/elastic-scale-get-started/output.png
[9]: ./media/elastic-scale-get-started/click-online.png
[10]: ./media/elastic-scale-get-started/click-CSharp.png
