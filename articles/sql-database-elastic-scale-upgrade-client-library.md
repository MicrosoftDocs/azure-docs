<properties 
	title="Upgrade to the latest elastic database client library" 
	pageTitle="Upgrade to the latest elastic database client library" 
	description="Upgrade instructions using PowerShell and C#" 
	metaKeywords="sharding,elastic scale, Azure SQL DB sharding" 
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
	ms.date="05/17/2015" 
	ms.author="sidneyh" />

# Upgrade to the latest elastic database client library

New versions of the elastic database client library are  available through [NuGet](https://www.nuget.org/packages/Microsoft.Azure.SqlDatabase.ElasticScale.Client/) and the NuGetPackage Manager interface in Visual Studio. Upgrades contain bug fixes and support for new capabilities of the client library.

## Upgrade steps

Upgrading requires you to rebuild your application with the new library, as well as change your existing Shard Map Manager metadata stored in your Azure SQL Databases to support new features.

Follow the sequence below to upgrade your applications, the Shard Map Manager database, and the local Shard Map Manager metadata on each shard.  Performing upgrade steps in this order ensures that old versions of the client library are no longer present in your environment when metadata objects are updated, which means that old-version metadata objects won’t be created after upgrade.   

**1. Upgrade your applications.** In Visual Studio, download and reference the latest client library version into all of your development projects that use the library; then rebuild and deploy. 

 * In your Visual Studio solution, select **Tools** --> **NuGet Package Manager** -->  **Manage NuGet Packages for Solution**. 
 * In the left panel, select **Updates**, and then select the **Update** button on the package **Azure SQL Database Elastic Scale Client Library** that appears in the window.
	![Upgrade Nuget Pacakges][1]
 
 * Build and Deploy. 

**2. Upgrade your scripts.** If you are using **PowerShell** scripts to manage shards, [download the new library version](https://www.nuget.org/packages/Microsoft.Azure.SqlDatabase.ElasticScale.Client/) and copy it into the directory from which you execute scripts. 

**3. Upgrade your split-merge service.** If you use the elastic database split-merge tool to reorganize sharded data, [download and deploy the latest version of the tool](https://www.nuget.org/packages/Microsoft.Azure.SqlDatabase.ElasticScale.Service.SplitMerge/). Detailed upgrade steps for the Service can be found [here](sql-database-elastic-scale-overview-split-and-merge.md). 

**4. Upgrade your Shard Map Manager DBs**. Upgrade the metadata supporting your Shard Maps in Azure SQL Database.  There are two ways you can accomplish this, using PowerShell or C#. Both options are shown below.

***Option 1: Upgrade metadata using PowerShell***

1. Download the latest command-line utility for NuGet from [here](http://nuget.org/nuget.exe) and save to a folder. 

2. Open a Command Prompt, navigate to the same folder, and issue the command:
`nuget install Microsoft.Azure.SqlDatabase.ElasticScale.Client`

3. Navigate to the subfolder containing the new client DLL version you have just downloaded, for example:
`cd .\Microsoft.Azure.SqlDatabase.ElasticScale.Client.1.0.0\lib\net45`

4. Download the elastic database client upgrade scriptlet from the [Script Center](https://gallery.technet.microsoft.com/scriptcenter/Azure-SQL-Database-Elastic-6442e6a9), and save it into the same folder containing the DLL.

5. From that folder, run “PowerShell .\upgrade.ps1” from the command prompt and follow the prompts.
 
***Option 2: Upgrade metadata using C#***

Alternatively, create a Visual Studio application that opens your ShardMapManager, iterates over all shards, and performs the metadata upgrade by calling the methods [UpgradeLocalStore](https://msdn.microsoft.com/library/azure/microsoft.azure.sqldatabase.elasticscale.shardmanagement.shardmapmanager.upgradelocalstore.aspx) and [UpgradeGlobalStore](https://msdn.microsoft.com/library/azure/microsoft.azure.sqldatabase.elasticscale.shardmanagement.shardmapmanager.upgradeglobalstore.aspx) as in this example: 

	ShardMapManager smm =
	   ShardMapManagerFactory.GetSqlShardMapManager
	   (connStr, ShardMapManagerLoadPolicy.Lazy); 
	smm.UpgradeGlobalStore(); 
	
	foreach (ShardLocation loc in
	 smm.GetDistinctShardLocations()) 
	{   
	   smm.UpgradeLocalStore(loc); 
	} 

These techniques for metadata upgrades can be applied multiple times without harm. For example, if an older client version inadvertently creates a shard after you have already updated, you can run upgrade again across all shards to ensure that the latest metadata version is present throughout your infrastructure. 

**Note:**  New versions of the client library published to-date continue to work with prior versions of the Shard Map Manager metadata on Azure SQL DB, and vice-versa.   However to take advantage of some of the new features in the latest client, metadata needs to be upgraded.   Note that metadata upgrades will not affect any user-data or application-specific data, only objects created and used by the Shard Map Manager.  And applications continue to operate through the upgrade sequence described above. 

## Elastic database client version history 

**Version 1.0 -- April 2015**

* General availability release
* Added support for Datetime types as sharding keys

**Version 0.8 – March 2015**

* Async support added for data-dependent routing with the new ShardMap.OpenConnectionForKeyAsync methods. 
* Public KeyType property added to ShardMap 
* Added improvements supporting database restore and disaster recovery scenarios for shards 

**Version 0.7 – October 2014** 

Initial Preview version 


[AZURE.INCLUDE [elastic-scale-include](../includes/elastic-scale-include.md)]  


<!--Image references-->
[1]:./media/sql-database-elastic-scale-upgrade-client-library/nuget-upgrade.png
