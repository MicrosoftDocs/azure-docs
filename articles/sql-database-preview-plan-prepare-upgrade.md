<properties 
	pageTitle="Plan and prepare to upgrade to the Latest SQL Database Update V12 (preview)" 
	description="Describes the preparations and limitations involved in upgrading to the Azure SQL Database update for V12." 
	services="sql-database" 
	documentationCenter="" 
	authors="MightyPen" 
	manager="jeffreyg" 
	editor=""/>

<tags 
	ms.service="sql-database" 
	ms.workload="sql-database" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/03/2015" 
	ms.author="genemi"/>


# Plan and prepare to upgrade to the Latest SQL Database Update V12 (preview)

<!--
GeneMi , 2015-March-03 Tuesday 15:43pm
New C.1 section added about portals, per email from Sanjay.Nag 2015-March-03 08:49am.

C.3.1 bacpac fix section is now C.4.1, of course.
-->

This topic describes the planning and preparations you must perform to upgrade your Azure SQL databases from version V11 to V12 preview.

A new [Azure portal](http://portal.azure.com/) is available to support your upgrade to the latest preview.

> [AZURE.NOTE]
> Test databases, database copies, or new databases, are good candidates for upgrading to the preview. Production databases that your business depends on should wait until after the preview period.<br/><br/>
> For version family V12, you can determine whether your geographic region is at preview status or at GA status by examining the regions table in [What's new in Azure SQL Database](http://azure.microsoft.com/documentation/articles/sql-database-preview-whats-new/#V12AzureSqlDbPreviewGaTable).


The following table lists and describes other Help topics for this latest preview.

| Title and link | Description of content |
| :--- | :--- |
| [What's new in the Latest SQL Database Update V12 (preview)](http://azure.microsoft.com/documentation/articles/sql-database-preview-whats-new/) | Describes the details of how the V12 preview brings Azure SQL Database closer to full parity with Microsoft SQL Server 2014. |
| [Walkthrough: sign up for the Latest SQL Database Update V12 (preview)](http://azure.microsoft.com/documentation/articles/sql-database-preview-sign-up/) | Describes the steps you must perform if you want to upgrade your Azure SQL databases to the latest preview. |
| [Create a database in the Latest SQL Database Update V12 (preview)](http://azure.microsoft.com/documentation/articles/sql-database-preview-create/) | Describes how you can create a new Azure SQL database that includes the new features of the latest preview. It describes various options beyond just an empty database. |
| [Upgrade to the Latest SQL Database Update V12 (preview)](http://azure.microsoft.com/documentation/articles/sql-database-preview-upgrade/) | Describes how you can upgrade your Azure SQL databases to the latest preview. It mentions that you should make a backup of your database first, because the upgrade is permanent and cannot be undone. |




## A. Plan ahead

The following subsections describe the learning and decision making you must address before you take an actions toward upgrading your Azure SQL database to the latest preview.

### A.1 Version clarification

This document concerns the upgrade of Microsoft Azure SQL Database from version V11 to V12. More formally the version numbers are close to the following two values, as reported by the T-SQL statement **SELECT @@version;** :

- 11.0.9228.18 *(V11)*
- 12.0.2000.8 *(or a bit higher, V12)*


### A.2 Service tier planning

Starting with this latest preview, Azure SQL Database will support only the service tiers named Basic, Standard, and Premium. The Web and Business service tier is not supported on this preview version. Therefore, if you plan to upgrade your Azure SQL database that is currently at the Web or Business service tier, you must decide what its new service tier should be.

For detailed information about the Basic, Standard, and Premium service tiers, see:

- [Upgrade SQL Database Web/Business Databases to New Service Tiers](http://azure.microsoft.com/documentation/articles/sql-database-upgrade-new-service-tiers/)
- [Azure SQL Database Pricing](http://azure.microsoft.com/pricing/details/sql-database/)


### A.3 Review the geo-replication configuration

If your Azure SQL database is configured for geo-replication, you should document its current configuration, and stop the geo-replication, before you start the upgrade preparation actions. After upgrade completes you must reconfigure your database for geo-replication.

The strategy is to leave the source intact and test on a copy of the database.

### A.4 Upgrade in-place vs. Copy database to new server

Before the V12 preview period is completed, you will have two techniques to choose from for upgrading your Azure SQL database from V11 to V12:

- Upgrade in-place: When this process is completed, your V11 database no longer exists. The SQL Database server is at V12.
- Copy database to V12 server: This process leaves your V11 database undisturbed, and creates an upgraded copy of your V11 database on a V12 Azure SQL Database server. <br/> Note that the DNS information that is used by your client code to access the database will no longer access the V11, and edits to the DNS information would be necessary to access the V11 database.



## B. Preparation actions

After you have completed your planning, you can perform the action steps described in the following subsections to prepare for the final upgrade phase.

Detailed descriptions of the final upgrade phase are available in the Help topics that are linked to at the top of this Help topic.

### B.1 Service tier actions


The Web and Business service pricing tier is not supported on this preview version.

If your V11 Azure SQL database is a Web or Business database, the upgrade process offers to switch your database to a supported tier. The upgrade recommends a tier that fits the workload history of your database. However, you can choose any supported tier you like.

You can reduce the steps necessary during upgrade by switching your V11 database away from the Web-and-Business tier before you start the upgrade. You can do this by using the Azure portal.

If you unsure which service tier to switch to, the S0 level of the Standard tier might be a sensible initial choice.


### B.2 Suspend geo-replication during upgrade

The upgrade to the latest preview cannot run if geo-replication is active on your database. You must first reconfigure your database to stop using geo-replication.

After the upgrade completes you can configure your database to again use geo-replication.

##<a id="limitations"></a>C. Limitations during and after upgrade to V12


This section describes the limitations that are associated with the upgrade to Azure SQL Database V12.


## C.1 Preview portal for V12


Only the first of the following two Azure management portals supports V12 databases:


- [http://portal.azure.com/](http://portal.azure.com/)
 - This newer portal is at preview status and is not yet at General Availability (GA).<br/><br/>
- [http://manage.windowsazure.com/](http://manage.windowsazure.com/)
 - This older portal will not be updated to support V12.


We encourage customers to connect to their Azure SQL databases with Visual Studio 2013 (VS2013). VS2013 can be used for tasks such as the following:


- To run a T-SQL statement.
- To design a schema.
- To develop a database, either online or offline.


You can instead connect with [Visual Studio Community 2013](https://www.visualstudio.com/en-us/news/vs2013-community-vs.aspx/), which is a free and full-featured version of VS2013.


In the older Azure management portal, on the database page, you can click **Open in Visual Studio** to launch VS2013 on your computer for connection to your Azure SQL Database.


For another alternative, you can use SQL Server Management Studio (SSMS) 2014 with [CU6](http://support.microsoft.com/kb/3031047/) to connect to Azure SQL Database. More details are on this blog post:<br/>[Client tooling updates for Azure SQL Database](http://azure.microsoft.com/blog/2014/12/22/client-tooling-updates-for-azure-sql-database/).


### C.2 Limitation *during* upgrade to V12

The following table describes the limitations that are in effect during the upgrade process.


| Limitation | Description |
| :--- | :--- |
| Duration of upgrade | For a very large database of perhaps greater than 50 GB in size, the upgrade process can take up to 24 hours. |
| DNS entry update delay | After the upgrade completes, it takes several minutes for the system to update the DNS entry for your V12 database, for connectivity from your client application. |
| No creating a database | While the upgrade is in progress the following actions for creating a database are unavailable on the destination V12 Azure SQL Database server: <p></p> * Creating a new database <br/> * Copying a database to the server <br/> * Restoring a deleted database <br/> * Restoring a database to a point-in-time <br/><br/> However, support for point-in-time restore during upgrade is a feature that might be supported before the end of the V12 preview period. |
| No geo-replication | Geo-replication is not supported on a V12 server that is currently involved in an upgrade from V11. |
| Alert rules | Alert rules cannot be added to a V12 database. |


### C.3 Limitation *after* upgrade to V12

The following table describes the limitations that are in place after the upgrade process.


| Limitation | Description |
| :--- | :--- |
| DNS to V11 database | After the completion of an upgrade by the technique of copying your V11 database to a new V12 server, the DNS information that your client code uses to connect refers to the V12 database. <p> </p> Your client code would need to use edited DNS information to refer back to the V11 database. |
| Cannot revert to V11 | After an upgrade in-place, the result cannot be reverted or undone. |
| Web or Business tier | Once the upgrade starts, the server for the new V12 database can no longer recognize or accept the Web or Business service tier. |
| 50% discount not reflected in the pricing tier cards in the Azure portal | During the preview period, there is a 50% preview discount* on databases enrolled in the latest Azure SQL database preview update (V12). Even if the discount is not shown in the preview portal on the service pricing tier blade, the discount is in force.<br/><br/> The 50% discount remains in effect in all geographic regions until 2015-March-31, when it expires for all regions. The discount is effect even in regions that have been announced at general availability (GA) status.<br/><br/> (* Use of latest Azure SQL Database Update V12 feature is subject to the preview terms in your license agreement (e.g., the Enterprise Agreement, Microsoft Azure Agreement, or Microsoft Online Subscription Agreement), as well as any applicable [Supplemental Terms of Use for Microsoft Azure Previews](http://azure.microsoft.com/support/legal/preview-supplemental-terms/).  For the duration of the preview, Microsoft will bill you (or your reseller, as applicable) for all databases enrolled in this preview at half the general availability (GA) rate to achieve a 50% preview discount. Microsoft will provide 30 days notice via email prior to the expiration of the preview period and the discounted preview rate.) |


### C.4 Export and import *after* upgrade to V12


You can export or import a V12 database by using the [Azure web portal](http://portal.azure.com/). Or you can export or import by using any of the following tools:


- SQL Server Management Studio (SSMS)
- Visual Studio 2013
- Data-Tier Application Framework (DacFx)


However, to use the tools, you must first install their latest updates to ensure they support the new V12 features:


- [Cumulative Update 6 for SQL Server Management Studio 2014](http://support2.microsoft.com/kb/3031047)
- [February 2015 Update for SQL Server Database Tooling in Visual Studio 2013](https://msdn.microsoft.com/data/hh297027)
- [February 2015 Data-Tier Application Framework (DacFx) for Azure SQL Database V12](http://www.microsoft.com/download/details.aspx?id=45886)


> [AZURE.NOTE] The preceding tool links were updated on or after March 2, 2015. We recommend that you use these newer updates of these tools.


#### C.4.1 Import has temporary issue with bacpac files


 (As of Wednesday, February 18, 2015)


There is a known issue with the export of bacpac files from a Azure SQL Database server that has been upgraded to V12. Exported bacpac files will contain an errant object named script_deployment_databases. Bacpac files that contain this errant object cannot be imported by using the tools SQL Server Management Studio (SSMS), SqlPackage.exe, or the Data-Tier Application Framework (DacFx) API.


However, the Azure web portal can be used to import an affected bacpac file to Azure SQL Database. We expect to release a permanent fix for this issue around Friday Feb 27 2015, including an update for the affected tools. In the interim, contact Microsoft Support if you need further assistance to recover an already exported file that has .bacpac as its file name extension.


In addition to the export issue, a limited number of servers and customers who recently upgraded to version V12 might experience a different error when attempting to import a bacpac file. This permissions-related error is transient and is normally resolved on an affected server within one day. We expect that this issue will also be permanently fixed during the week of Monday February 23 2015. In the interim, retrying your import operation might succeed. Contact Microsoft Support if you need further assistance importing a bacpac file to Azure SQL Database.


If necessary, you can follow these steps to contact Microsoft Support:


1. Browse to the Azure portal.
2. Right-click on the account name, found in the upper-right corner.
3. In the context menu that is displayed, click the item for support.
 - The item is probably labeled either **Contact Microsoft Support** or **Help + support**.


> [AZURE.NOTE] (Monday, March 2, 2015)
> 
> The issue described in this section C.4.1 has been resolved. No special knowledge or action is necessary for customers to proceed as they like.
> 
> Automated import/export works normally regardless of how old your bacpac file is.
> 
> Customers who process their bacpac files by using DacFx should download the updated tools. The download links are available in section C.4.


### C.5 Restore to V12 of a deleted V11 database

The following scenario explains that a deleted V11 Azure SQL database can be restored onto a V12 Azure SQL Database server.

1. Suppose you have a V11 Azure SQL Database server. <br/> On the server you have a database at the obsolete Web-and-Business service tier.
2. You delete the database.
3. You upgrade the server to V12.
4. Next you restore the database to the server. <br/> The database is thereby upgraded to V12, at the S0 level of the Standard service tier.
5. You can switch the database to any supported service tier, if S0 is not your preference.



## D. Failure resolution

If the upgrade fails for any odd reason, your V11 database remains active and available as normal.


## Related links

- Microsoft Azure [Preview features](http://azure.microsoft.com/services/preview/)


<!--Anchors-->
[Subheading 1]: #subheading-1