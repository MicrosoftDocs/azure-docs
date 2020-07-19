---
title: Upgrade to the latest elastic database client library
description: Use NuGet to upgrade elastic database client library.
services: sql-database
ms.service: sql-database
ms.subservice: scale-out
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: conceptual
author: stevestein
ms.author: sstein
ms.reviewer:
ms.date: 01/03/2019
---
# Upgrade an app to use the latest elastic database client library
[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

New versions of the [Elastic Database client library](elastic-database-client-library.md) are available through NuGet and the NuGet Package Manager interface in Visual Studio. Upgrades contain bug fixes and support for new capabilities of the client library.

**For the latest version:** Go to [Microsoft.Azure.SqlDatabase.ElasticScale.Client](https://www.nuget.org/packages/Microsoft.Azure.SqlDatabase.ElasticScale.Client/).

Rebuild your application with the new library, as well as change your existing Shard Map Manager metadata stored in your databases in Azure SQL Database to support new features.

Performing these steps in order ensures that old versions of the client library are no longer present in your environment when metadata objects are updated, which means that old-version metadata objects won’t be created after upgrade.

## Upgrade steps

**1. Upgrade your applications.** In Visual Studio, download and reference the latest client library version into all of your development projects that use the library; then rebuild and deploy.

* In your Visual Studio solution, select **Tools** --> **NuGet Package Manager** -->  **Manage NuGet Packages for Solution**.
* (Visual Studio 2013) In the left panel, select **Updates**, and then select the **Update** button on the package **Azure SQL Database Elastic Scale Client Library** that appears in the window.
* (Visual Studio 2015) Set the Filter box to **Upgrade available**. Select the package to update, and click the **Update** button.
* (Visual Studio 2017) At the top of the dialog, select **Updates**. Select the package to update, and click the **Update** button.
* Build and Deploy.

**2. Upgrade your scripts.** If you are using **PowerShell** scripts to manage shards, [download the new library version](https://www.nuget.org/packages/Microsoft.Azure.SqlDatabase.ElasticScale.Client/) and copy it into the directory from which you execute scripts.

**3. Upgrade your split-merge service.** If you use the elastic database split-merge tool to reorganize sharded data, [download and deploy the latest version of the tool](https://www.nuget.org/packages/Microsoft.Azure.SqlDatabase.ElasticScale.Service.SplitMerge/). Detailed upgrade steps for the Service can be found [here](elastic-scale-overview-split-and-merge.md).

**4. Upgrade your Shard Map Manager databases**. Upgrade the metadata supporting your Shard Maps in Azure SQL Database.  There are two ways you can accomplish this, using PowerShell or C#. Both options are shown below.

***Option 1: Upgrade metadata using PowerShell***

1. Download the latest command-line utility for NuGet from [here](https://nuget.org/nuget.exe) and save to a folder.
2. Open a Command Prompt, navigate to the same folder, and issue the command:
   `nuget install Microsoft.Azure.SqlDatabase.ElasticScale.Client`
3. Navigate to the subfolder containing the new client DLL version you have just downloaded, for example:
   `cd .\Microsoft.Azure.SqlDatabase.ElasticScale.Client.1.0.0\lib\net45`
4. Download the elastic database client upgrade script from the [Script Center](https://gallery.technet.microsoft.com/scriptcenter/Azure-SQL-Database-Elastic-6442e6a9), and save it into the same folder containing the DLL.
5. From that folder, run “PowerShell .\upgrade.ps1” from the command prompt and follow the prompts.

***Option 2: Upgrade metadata using C#***

Alternatively, create a Visual Studio application that opens your ShardMapManager, iterates over all shards, and performs the metadata upgrade by calling the methods [UpgradeLocalStore](https://docs.microsoft.com/dotnet/api/microsoft.azure.sqldatabase.elasticscale.shardmanagement.shardmapmanager.upgradelocalstore) and [UpgradeGlobalStore](https://docs.microsoft.com/dotnet/api/microsoft.azure.sqldatabase.elasticscale.shardmanagement.shardmapmanager.upgradeglobalstore) as in this example:

```csharp
    ShardMapManager smm =
       ShardMapManagerFactory.GetSqlShardMapManager
       (connStr, ShardMapManagerLoadPolicy.Lazy);
    smm.UpgradeGlobalStore();

    foreach (ShardLocation loc in
     smm.GetDistinctShardLocations())
    {
       smm.UpgradeLocalStore(loc);
    }
```

These techniques for metadata upgrades can be applied multiple times without harm. For example, if an older client version inadvertently creates a shard after you have already updated, you can run upgrade again across all shards to ensure that the latest metadata version is present throughout your infrastructure.

**Note:**  New versions of the client library published to-date continue to work with prior versions of the Shard Map Manager metadata on Azure SQL Database, and vice-versa.   However to take advantage of some of the new features in the latest client, metadata needs to be upgraded.   Note that metadata upgrades will not affect any user-data or application-specific data, only objects created and used by the Shard Map Manager.  And applications continue to operate through the upgrade sequence described above.

## Elastic database client version history

For version history, go to [Microsoft.Azure.SqlDatabase.ElasticScale.Client](https://www.nuget.org/packages/Microsoft.Azure.SqlDatabase.ElasticScale.Client/)

[!INCLUDE [elastic-scale-include](../../../includes/elastic-scale-include.md)]

<!--Image references-->
[1]:./media/sql-database-elastic-scale-upgrade-client-library/nuget-upgrade.png
