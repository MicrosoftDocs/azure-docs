<properties
	pageTitle="Plan and prepare to upgrade to SQL Database V12"
	description="Describes the preparations and limitations involved in upgrading to version V12 of Azure SQL Database."
	services="sql-database"
	documentationCenter=""
	authors="MightyPen"
	manager="jeffreyg"
	editor=""/>


<tags
	ms.service="sql-database"
	ms.workload="data-management" 
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/22/2015"
	ms.author="genemi"/>


# Plan and prepare to upgrade to SQL Database V12


<!-- What is being changed this time?:
GeneMi , 2015-April-22 16:40pm
Name of this new copy is 'sql-database-v12-plan-prepare-upgrade.md'. Retiring old copy named 'sql-database-preview-plan-prepare-upgrade.md'.
-->


This topic describes the planning and preparations you must perform to upgrade your Azure SQL databases from version V11 to V12 ([at preview in some regions](sql-database-v12-whats-new.md#V12AzureSqlDbPreviewGaTable)).


A new [Azure preview portal](http://portal.azure.com/) is available to support your upgrade to V12.


The following table lists other Help topics for V12.


| Title and link | Description of content |
| :--- | :--- |
| [What's new in SQL Database V12](sql-database-v12-whats-new.md) | Describes the details of how V12 brings Azure SQL Database closer to full parity with Microsoft SQL Server. |
| [Walkthrough: sign up for the Latest SQL Database Update V12](sql-database-v12-sign-up.md) | Describes the steps you must perform if you want to upgrade your Azure SQL databases to V12. |
| [Create a database in SQL Database Update V12](sql-database-create.md) | Describes how you can create a new Azure SQL database at version V12. It describes various options beyond just an empty database. |


## Plan ahead


The following subsections describe the learning and decision making you must address before you take an actions toward upgrading your Azure SQL database to V12.

### Version clarification


This document concerns the upgrade of Microsoft Azure SQL Database from version V11 to V12. More formally the version numbers are close to the following two values, as reported by the Transact-SQL statement **SELECT @@version;** :


- 11.0.9228.18 *(V11)*
- 12.0.2000.8 *(or a bit higher, V12)*


### Service tier planning


Starting with V12, Azure SQL Database will support only the service tiers named Basic, Standard, and Premium. The Web and Business service tier is not supported on V12. Therefore, if you plan to upgrade your Azure SQL database that is currently at the Web or Business service tier, you must decide what its new service tier should be.


For detailed information about the Basic, Standard, and Premium service tiers, see:


- [Upgrade SQL Database Web/Business Databases to New Service Tiers](sql-database-upgrade-new-service-tiers.md)
- [Azure SQL Database Pricing](http://azure.microsoft.com/pricing/details/sql-database/)


### Review the geo-replication configuration


If your Azure SQL database is configured for geo-replication, you should document its current configuration, and stop the geo-replication, before you start the upgrade preparation actions. After upgrade completes you must reconfigure your database for geo-replication.


The strategy is to leave the source intact and test on a copy of the database.


## Preparation actions


After you have completed your planning, you can perform the action steps described in the following subsections to prepare for the final upgrade phase.


Detailed descriptions of the final upgrade phase are available in the Help topics that are linked to at the top of this Help topic.


### Service tier actions


The Web and Business service pricing tier is not supported on V12.


If your V11 Azure SQL database is a Web or Business database, the upgrade process offers to switch your database to a supported tier. The upgrade recommends a tier that fits the workload history of your database. However, you can choose any supported tier you like.


You can reduce the steps necessary during upgrade by switching your V11 database away from the Web-and-Business tier before you start the upgrade. You can do this by using the new [Azure preview portal](http://portal.azure.com/).


If you are unsure which service tier to switch to, the S2 level of the Standard tier might be a sensible initial choice. Any lesser tier will have fewer resources than the Web and Business tier had.


### Suspend geo-replication during upgrade


The upgrade to V12 cannot run if geo-replication is active on your database. You must first reconfigure your database to stop using geo-replication.


After the upgrade completes you can configure your database to again use geo-replication.


##<a id="limitations"></a>Limitations during and after upgrade to V12


### Portals for V12


There are three portals for Azure, and each has different abilities regarding SQL Database V12.


- [http://portal.azure.com/](http://portal.azure.com/)<br/>This Azure preview portal is new and is still at preview status. This portal is not quite yet at full General Availability (GA). This portal:
 - Can manage your V12 server and database.
 - Can upgrade your V11 database to V12.


- [http://manage.windowsazure.com/](http://manage.windowsazure.com/)<br/>This Azure portal might eventually be phased out. This portal:
 - Can manage your V12 server and database.
 - Can *not* upgrade your V12 database to V12.


- (http://*yourservername*.database.windows.net)<br/>
Azure SQL Database Management portal:
 - Can*not* manage V12 servers.


We encourage you to connect to your Azure SQL databases with Visual Studio 2013 (VS2013). VS2013 can be used for tasks such as the following:


- To run a Transact-SQL statement.
- To design a schema.
- To develop a database, either online or offline.


You can instead connect with [Visual Studio Community 2013](https://www.visualstudio.com/en-us/news/vs2013-community-vs.aspx/), which is a free and full-featured version of VS2013.


In the older Azure portal, on the database page, you can click **Open in Visual Studio** to launch VS2013 on your computer for connection to your Azure SQL Database.


For another alternative, you can use SQL Server Management Studio (SSMS) 2014 with [CU6](http://support.microsoft.com/kb/3031047/) to connect to Azure SQL Database. More details are on this blog post:<br/>[Client tooling updates for Azure SQL Database](http://azure.microsoft.com/blog/2014/12/22/client-tooling-updates-for-azure-sql-database/).


### Limitation *during* upgrade to V12


| Limitation | Description |
| :--- | :--- |
| Duration of upgrade | The duration of upgrade depends on the number, size, and edition of databases in the server. The upgrade process can run for 1 to 4 days for servers with databases that are both:<br/><br/>* Larger than 50 GB<br/>* At a non-premium service tier<br/><br/>Creation of new databases on the server during the upgrade can also increase the upgrade duration. |
| DNS entry update delay | After the upgrade completes, it takes several minutes for the system to update the DNS entry for your V12 database, for connectivity from your client application. |
| No geo-replication | Geo-replication is not supported on a V12 server that is currently involved in an upgrade from V11. |


### Limitation *after* upgrade to V12


| Limitation | Description |
| :--- | :--- |
| Cannot revert to V11 | After an upgrade in-place, the result cannot be reverted or undone. |
| Web or Business tier | Once the upgrade starts, the server for the new V12 database can no longer recognize or accept the Web or Business service tier. |
| 50% discount not reflected in the pricing tier cards in the Azure portal | During the preview period, there is a 50% preview discount* on databases enrolled in the latest Azure SQL database preview update (V12). Even if the discount is not shown in the preview portal on the service pricing tier blade, the discount is in force.<br/><br/> The 50% discount remains in effect in all geographic regions until **2015-March-31**, when it expires for all regions. The discount is effect even in regions that have been announced at general availability (GA) status.<br/><br/> (* Use of latest Azure SQL Database Update V12 feature is subject to the preview terms in your license agreement (e.g., the Enterprise Agreement, Microsoft Azure Agreement, or Microsoft Online Subscription Agreement), as well as any applicable [Supplemental Terms of Use for Microsoft Azure Previews](http://azure.microsoft.com/support/legal/preview-supplemental-terms/).  For the duration of the preview, Microsoft will bill you (or your reseller, as applicable) for all databases enrolled in this preview at half the general availability (GA) rate to achieve a 50% preview discount. Microsoft will provide 30 days notice via email prior to the expiration of the preview period and the discounted preview rate.) |


### Export and import *after* upgrade to V12


You can export or import a V12 database by using the [Azure preview portal](http://portal.azure.com/). Or you can export or import by using any of the following tools:


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


## Failure resolution


If the upgrade fails for any odd reason, your V11 database remains active and available as normal.


> [AZURE.NOTE]
> The pre-V12 database *remains available* for data access during the upgrade to V12.


## Related links


- Microsoft Azure [Preview features](http://azure.microsoft.com/services/preview/)


<!--Anchors-->
[Subheading 1]: #subheading-1
