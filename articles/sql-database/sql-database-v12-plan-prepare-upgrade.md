<properties
	pageTitle="Plan your upgrade to SQL Database V12 | Microsoft Azure"
	description="Describes the preparations and limitations involved in upgrading to version V12 of Azure SQL Database."
	services="sql-database"
	documentationCenter=""
	authors="MightyPen"
	manager="jhubbard"
	editor=""/>


<tags
	ms.service="sql-database"
	ms.workload="data-management"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/25/2016"
	ms.author="genemi"/>


# Plan and prepare to upgrade to SQL Database V12


This topic describes the planning and preparations you must perform to upgrade your Azure SQL databases from version V11 to V12.


A new [Azure Portal](https://portal.azure.com/) is available to support your upgrade to V12.


The following table lists other Help topics for V12.


| Title and link | Description of content |
| :--- | :--- |
| [What's new in SQL Database V12](sql-database-v12-whats-new.md) | Describes the details of how V12 brings Azure SQL Database closer to full parity with Microsoft SQL Server. |
| [Create a database in SQL Database V12](sql-database-get-started.md) | Describes how you can create a new Azure SQL database at version V12. It describes various options beyond just an empty database. |


## Plan ahead


The following subsections describe the learning and decision making you must address before you take an actions toward upgrading your Azure SQL database to V12.

### Version clarification


This document concerns the upgrade of Microsoft Azure SQL Database from version V11 to V12. More formally the version numbers are close to the following two values, as reported by the Transact-SQL statement **SELECT @@version;** :


- 12.0.2000.8 *(or a bit higher, V12)*
- 11.0.9228.18 *(V11)*
 - Sometimes V11 was also referred to as SAWA v2.

### Service tier planning


Starting with V12, Azure SQL Database will support only the service tiers named Basic, Standard, and Premium. The Web and Business service tier is not supported on V12. Therefore, if you plan to upgrade your Azure SQL database that is currently at the Web or Business service tier, you must decide what its new service tier should be.


For detailed information about the Basic, Standard, and Premium service tiers, see:

- [SQL Database service tiers](sql-database-service-tiers.md)
- [Upgrade SQL Database Web/Business Databases to New Service Tiers](sql-database-upgrade-server-portal.md)



### Review the Geo-Replication configuration


If your Azure SQL database is configured for Geo-Replication, you should document its current configuration, and stop Geo-Replication, before you start the upgrade preparation actions. After upgrade completes you must reconfigure your database for Geo-Replication.


The strategy is to leave the source intact and test on a copy of the database.


## Preparation actions


After you have completed your planning, you can perform the action steps described in the following subsections to prepare for the final upgrade phase.


Detailed descriptions of the final upgrade phase are available in the Help topics that are linked to at the top of this Help topic.


### Service tier actions


The Web and Business service pricing tier is not supported on V12.


If your V11 Azure SQL database is a Web or Business database, the upgrade process offers to switch your database to a supported tier. The upgrade recommends a tier that fits the workload history of your database. However, you can choose any supported tier you like.


You can reduce the steps necessary during upgrade by switching your V11 database away from the Web-and-Business tier before you start the upgrade. You can do this by using the new [Azure Portal](https://portal.azure.com/).


If you are unsure which service tier to switch to, the S2 level of the Standard tier might be a sensible initial choice. Any lesser tier will have fewer resources than the Web and Business tier had.


### Suspend Geo-Replication during upgrade


The upgrade to V12 cannot run if Geo-Replication is active on your database. You must first reconfigure your database to stop using Geo-Replication.


After the upgrade completes you can configure your database to again use Geo-Replication.


### Client on an Azure VM


If your client program connects to SQL Database V12 while your client runs on an Azure virtual machine (VM), you must open the following port ranges on the VM:

- 11000-11999
- 14000-14999


Click [here](sql-database-develop-direct-route-ports-adonet-v12.md) for details about the ports for SQL Database V12. The ports are needed by performance enhancements in SQL Database V12.


##<a id="limitations"></a>Limitations during and after upgrade to V12


### Portals for V12


There are three portals for Azure, and each has different abilities regarding SQL Database V12.


- [http://portal.azure.com/](https://portal.azure.com/)<br/>This Azure Portal is new and is still at preview status. This portal is not quite yet at full General Availability (GA). This portal:
 - Can manage your V12 server and database.
 - Can upgrade your V11 database to V12.


- [http://manage.windowsazure.com/](http://manage.windowsazure.com/)<br/>This Azure Classic Portal might eventually be phased out. This portal:
 - Can manage your V12 server and database.
 - Can *not* upgrade your V11 database to V12.


- (http://*yourservername*.database.windows.net)<br/>
Azure SQL Database Classic Portal:
 - Can*not* manage V12 servers.


We encourage you to connect to your Azure SQL databases with Visual Studio 2013 (VS2013). VS2013 can be used for tasks such as the following:


- To run a Transact-SQL statement.
- To design a schema.
- To develop a database, either online or offline.


You can instead connect with [Visual Studio Community 2013](https://www.visualstudio.com/en-us/news/vs2013-community-vs.aspx/), which is a free and full-featured version of VS2013.


In the older Azure Classic Portal, on the database page, you can click **Open in Visual Studio** to launch VS2013 on your computer for connection to your Azure SQL Database.


For another alternative, you can use SQL Server Management Studio (SSMS) 2014 with [CU6](http://support.microsoft.com/kb/3031047/) to connect to Azure SQL Database. More details are on this blog post:<br/>[Client tooling updates for Azure SQL Database](https://azure.microsoft.com/blog/2014/12/22/client-tooling-updates-for-azure-sql-database/).


> [AZURE.IMPORTANT] It is recommended that you always use the latest version of Management Studio to remain synchronized with updates to Microsoft Azure and SQL Database. [Update SQL Server Management Studio](https://msdn.microsoft.com/library/mt238290.aspx).


### Limitation *during* upgrade to V12


The V11 database remains available for data access during the upgrade to V12. Yet there are a couple limitations to consider.


| Limitation | Description |
| :--- | :--- |
| Duration of upgrade | The duration of upgrade depends on the size, edition and number of databases in the server. The upgrade process can run for hours to days for servers especially for servers that has databases:<br/><br/>* Larger than 50 GB, or<br/>* At a non-premium service tier<br/><br/>Creation of new databases on the server during the upgrade can also increase the upgrade duration. |
| No Geo-Replication | Geo-Replication is not supported on a V12 server that is currently involved in an upgrade from V11. |
| Database is briefly unavailable in final phase of upgrade to V12 | The databases belonging to your V11 server remain available during the upgrade process. However, the connection to the server and databases is briefly unavailable in the final phase, when the switch over begins from V11 to the ready V12.<br/><br/>The switch over period can range from 40 seconds to 5 minutes. For most servers, switch over is expected to complete within 90 seconds. Switch over time increases for servers that have a large number of databases, or when the databases have heavy write workloads. |


### Limitation *after* upgrade to V12


| Limitation | Description |
| :--- | :--- |
| Cannot revert to V11 | After an upgrade in-place, the result cannot be reverted or undone. |
| Web or Business tier | Once the upgrade starts, the server for the new V12 database can no longer recognize or accept the Web or Business service tier. |



### Export and import *after* upgrade to V12


You can export or import a V12 database by using the [Azure Portal](https://portal.azure.com/). Or you can export or import by using any of the following tools:


- SQL Server Management Studio (SSMS)
- Visual Studio 2013
- Data-Tier Application Framework (DacFx)


However, to use the tools, you must first install their latest updates to ensure they support the new V12 features:


- [Cumulative Update 6 for SQL Server Management Studio 2014](http://support2.microsoft.com/kb/3031047)
- [February 2015 Update for SQL Server Database Tooling in Visual Studio 2013](https://msdn.microsoft.com/data/hh297027)
- [February 2015 Data-Tier Application Framework (DacFx) for Azure SQL Database V12](http://www.microsoft.com/download/details.aspx?id=45886)


> [AZURE.NOTE] The preceding tool links were updated on or after March 2, 2015. We recommend that you use these newer updates of these tools.


#### Automated Export


Automated Export continues to be available as preview.  No client tool updates are required when using Automated Export.  If you choose to take the resulting file and import to an on-premise server, the tooling updates listed above are needed to import successfully.


### Restore to V12 of a deleted V11 database

The following scenario explains that a deleted V11 Azure SQL database can be restored onto a V12 Azure SQL Database server.

1. Suppose you have a V11 Azure SQL Database server. <br/> On the server you have a database at the obsolete Web-and-Business service tier.
2. You delete the database.
3. You upgrade the server to V12.
4. Next you restore the database to the server. <br/> The database is thereby upgraded to V12, at the S0 level of the Standard service tier.
5. You can switch the database to any supported service tier, if S0 is not your preference.


### PowerShell cmdlets


PowerShell cmdlets are available to start, stop, or monitor an upgrade to Azure SQL Database V12 from V11 or any other pre-V12 version.

- [Upgrade to SQL Database V12 using PowerShell](sql-database-upgrade-server-powershell.md)

For reference documentation about these PowerShell cmdlets, see:


- [Get-AzureRMSqlServerUpgrade](https://msdn.microsoft.com/library/azure/mt603582.aspx)
- [Start-AzureRMSqlServerUpgrade](https://msdn.microsoft.com/library/azure/mt619403.aspx)
- [Stop-AzureRMSqlServerUpgrade](https://msdn.microsoft.com/library/azure/mt603589.aspx)


The Stop- cmdlet means cancel, not pause. There is no way to resume an upgrade, other than starting again from the beginning. The Stop- cmdlet cleans up and releases all appropriate resources.


## Failure resolution


If the upgrade fails for any odd reason, your V11 database remains active and available as normal.


## Related links


- Microsoft Azure [Preview features](https://azure.microsoft.com/services/preview/)


<!--Anchors-->
[Subheading 1]: #subheading-1
