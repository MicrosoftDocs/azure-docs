<properties title="Get Started with  Azure SQL Database Elastic Scale" pageTitle="Get Started with  Azure SQL Database Elastic Scale" description="Scale Azure SQL Database shards with elastic scale APIs, Azure elastic scale Getting Started" metaKeywords="sharding scaling, Azure SQL DB sharding, elastic scale" services="sql-database" documentationCenter="sql-database" authors="sidneyh@microsoft.com"/>

<tags ms.service="sql-database" ms.workload="sql-database" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/02/2014" ms.author="sidneyh" />

#Get Started with  Azure SQL Database Elastic Scale 

<p>Growing and shrinking capacity on demand is one of the promises of cloud computing. However, delivering on this promise for the database tier of cloud applications is not easy. At present, the industry has converged on well-established design patterns known as **sharding**. But while sharding addresses the challenge, building and managing applications that employ sharding is difficult.  

Azure SQL Database elastic scale (in preview) enables the data-tier of an application to scale out and in via industry-standard sharding practices, while significantly streamlining the development and management of your sharded cloud applications. Elastic scale delivers both developer and management functionality which are provided through a set of .Net libraries and through Azure service templates that you can host in your own Azure subscription to manage your highly scalable applications.

##In this topic

+ [The Elastic Scale Sample Application]
+ [Download and Run the Sample App]
+ [Cost]
+ [Next Steps]


For more information about how elastic scale works, see Sharding Overview.
## The Elastic Scale Sample Application

###Prerequisites
To run the sample app, you must use Visual Studio, and you must have access to an Azure SQL Database running on Azure. If you do not already have a subscription to Azure, sign up for a [trial subscription](http://azure.microsoft.com/en-us/pricing/free-trial/).
####Visual Studio and Nuget

1. Download a version of Visual Studio 2013 from [Visual Studio Downloads](http://www.visualstudio.com/en-us/downloads/download-visual-studio-vs.aspx).
2. If you are using Visual Studio 2010, install the latest version of Nuget from [Installing Nuget](http://docs.nuget.org/docs/start-here/installing-nuget). 

####Create an Azure SQL database

1. Log into the [Azure Management portal](https://manage.windowsazure.com).
2. In the bottom left corner, click **New**. Then click **Data services>SQL database>Quick Create**. 
   ![][1]

3. Fill in the **database name**, and select a **subscription** from the dropdown list. 
4. In the **Server** box, select **New SQL Database Server** from the dropdown list; then create a new login name and password.
5.  Copy and save the login name and password for later use when configuring the sample app.
6.  In the left panel of the portal, click **SQL Databases**. 
	![][2]
7. Click the name of the your database.
8. Click **Dashboard** to see more details about the database.

	![][3]
9. Under **quick glance**, find the **server name**, then copy and save the entire name, including—"database.windows.net"—for later use when configuring the sample.

	![][4]

10. Set the allowed IP address for the machine being used to access the database.
	1. Under **quick glance**, click **Manage allowed IP addresses**.
	2.  Click **Add to the allowed IP addresses**.

		![][6]
	3. If the address is not added, Visual Studio will display the **System.Data.SqlClient.SQLException** shown below. If this occurs, note the IP address in the dialog and set it as an allowed IP address.
		![][7]

You can also set allowed IP address range using the [Set-AzureSqlDatabaseServerFirewallRule](http://msdn.microsoft.com/en-us/library/azure/dn546739.aspx) cmdlet.

##Download and Run the Sample App
The **Hello World sample application** illustrates the most important aspects of the development experience for sharded applications using Azure SQL DB elastic scale. It focuses on key use cases for Shard Map Management, Data Dependent Routing and Multi-Shard Querying. (To understand these capabilities, see TBD.) 

1. Open Visual Studio and select **File -> New -> Project**.
2. In the dialog box, expand the **Online Samples** node, and select the **Visual C#** node.
	![][5]
3. In the search box, type **Elastic Scale** to search for the sample. The title **Elastic Scale with Azure SQL Database-Getting Started** appears. 
6. Select the sample, choose a name and a location for the new project and press **OK **to create the project.
7. Open the **app.config** file in the solution for the sample project and follow the instructions in the file to add your Azure SQL Database server name and your login information (user name and password).
8. Build and run the application. When asked, please allow Visual Studio to restore the NuGet packages of the solution. This will download the latest version of the elastic scale client libraries from NuGet.
9. Follow the progress of the sample in the console window and note the elastic scale steps it takes in the output.

	![][8]

Congratulations – you have successfully built and run your first elastic scale application on Azure SQL DB. Take a quick look at the shards that the sample created by connecting with SQL Server Management Studio to your Azure DB Server. You will notice  two new sample shard databases and a shard map manager database that the sample has created: 

Now, let’s quickly explore  some key aspects of the usage of the elastic scale libraries in the code sample:

1.    The code illustrates how to create and register new shards in your elastic scale shard map using the **ShardMapManager** and **ShardMap** classes of the elastic scale libraries. In particular, see the function **CreateShards** in the file named  *ShardMapManagementSample.cs*.  
2.    Creating mappings of sharding key ranges to shards is demonstrated in the function **CreateMappings** in the *ShardMapManagementSample.cs* file. Notice the use of the **RangeMapping** class from the elastic scale libraries.
3.    You can explore how elastic scale helps you route your transactions to the appropriate shards given a sharding key in file *DataDependentRoutingSample.cs*. Notice the use of the **OpenConnectionForKey** function. 
4.    Querying across shards and the use of the **MultiShardConnection**, **MultiShardCommand**, and **MultiShardDataReader** classes are illustrated in file *MultiShardQuerySample.cs*. 

To find out more about the architecture of the elastic scale, see TBD. 

## Cost

The elastic scale libraries and service templates are free. Elastic scale does not impose additional charges on top of the cost for your Azure usage. 

For example, the sample application creates three databases (2 shard databases and 1 shard map manager database). The cost depends on the Azure SQL DB database edition you choose and the Azure usage of your application. There is no additional cost for the elastic scale libraries.  

For pricing information see [SQL Database Pricing Details](http://azure.microsoft.com/en-us/pricing/details/sql-database/).

## Next Steps
For more information about the elastic scale feature, see:
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


