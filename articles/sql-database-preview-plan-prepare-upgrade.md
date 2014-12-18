<properties title="Plan and prepare to upgrade to the Latest SQL Database Update V12 (preview)" pageTitle="Plan and prepare to upgrade to the Latest SQL Database Update V12 (preview)" description="Describes the planning, preparations, and limitations involving an upgrade to the Latest Azure SQL Database Update (preview)." metaKeywords="Azure, SQL DB, Update, Preview, Plan" services="sql-database" documentationCenter="" authors="GeneMi" manager="jeffreyg" videoId="" scriptId=""/>

<tags ms.service="sql-database" ms.workload="sql-database" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="12/11/2014" ms.author="genemi"/>

# Plan and prepare to upgrade to the Latest SQL Database Update V12 (preview)

<!--
Latest Edit Datetime:  GM,  2014-12-15  Monday  16:52pm.
sql-database-preview-plan-prepare-upgrade.md
sql-database- , -preview- :  Set of topics using -preview- as their group identifier node.
-->

This topic describes the planning and preparations you must perform to upgrade your Azure SQL databases from version V11 to V12 preview.

A new [Azure portal](http://portal.azure.com/) is available to support your upgrade to the latest preview.

> [AZURE.NOTE]
> Test databases, database copies, or new databases, are good candidates for upgrading to the preview. Production databases that your business depends on should wait until after the preview period.

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


## C. Limitations during and after upgrade

Be aware of the following limitations of the latest preview:


| Limitation | Description |
| :--- | :--- |
| Duration of upgrade | For a very large database of perhaps greater than 50 GB in size, the upgrade process can take up to 24 hours. |
| DNS entry update delay | After the upgrade completes, it takes several minutes for the system to update the DNS entry for your V12 database, for connectivity from your client application. |
| DNS to V11 database | After the completion of an upgrade by the technique of copying your V11 database to a new V12 server, the DNS information that your client code uses to connect refers to the V12 database. <p> </p> Your client code would need to use edited DNS information to refer back to the V11 database. |
| Cannot revert to V11 | After an upgrade in-place, the result cannot be reverted or undone. |
| Web or Business tier | Once the upgrade starts, the server for the new V12 database can no longer recognize or accept the Web or Business service tier. |
| No creating a database | While the upgrade is in progress the following actions for creating a database are unavailable on the destination V12 Azure SQL Database server: <p></p> * Creating a new database <br/> * Copying a database to the server <br/> * Restoring a deleted database <br/> * Restoring a database to a point-in-time <br/><br/> However, support for point-in-time restore during upgrade is a feature that might be supported before the end of the V12 preview period. |
| No geo-replication | Geo-replication is not supported on a V12 server that is currently involved in an upgrade from V11. |
| 50% discount semi-hidden | During the preview period, there is a 50% discount on databases with the latest Azure SQL database preview update (V12). Even if the discount is not shown in the preview portal on the service pricing tier blade, the discount is in force. |
| 50% discount not reflected in the pricing tier cards in the preview portal | During the preview period, there is a 50% preview discount* on databases enrolled in the latest Azure SQL database preview update (V12). Even if the discount is not shown in the preview portal on the service pricing tier blade, the discount is in force. <br/><br/> (* Use of latest Azure SQL Database Update V12 feature is subject to the preview terms in your license agreement (e.g., the Enterprise Agreement, Microsoft Azure Agreement, or Microsoft Online Subscription Agreement), as well as any applicable [Supplemental Terms of Use for Microsoft Azure Previews](http://azure.microsoft.com/support/legal/preview-supplemental-terms/).  For the duration of the preview, Microsoft will bill you (or your reseller, as applicable) for all databases enrolled in this preview at half the General Availability rate to achieve a 50% preview discount. Microsoft will provide 30 days notice via email prior to the expiration of the preview period and the discounted preview rate.) |


### Restore to V12 of a deleted V11 database

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
