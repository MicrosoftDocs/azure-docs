<properties 
   pageTitle="Changing Database Service Tiers and Performance Levels" 
   description="Learn to dynamically scale a cloud database up and down using Azure SQL Database’s service tiers, which you can use to dial performance up and down based on business and cost requirements without application downtime." 
   services="sql-database" 
   documentationCenter="" 
   authors="stevestein" 
   manager="jeffreyg" 
   editor=""/>

<tags
   ms.service="sql-database"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services" 
   ms.date="04/02/2015"
   ms.author="sstein"/>


# Changing Database Service Tiers and Performance Levels 

This topic describes the steps involved in moving an Azure SQL Database between service tiers and performance levels.

## Changing Service Tiers 

Use the information in [Upgrade SQL Database Web/Business Databases to New Service Tiers](sql-database-upgrade-new-service-tiers.md) and [Azure SQL Database Service Tiers and Performance Levels](https://msdn.microsoft.com/library/azure/dn741336.aspx) to determine the appropriate service tier and performance level for your Azure SQL Database.

You can easily move between any of the service tiers using Azure Management Portal, [PowerShell](https://msdn.microsoft.com/library/azure/dn546726.aspx), or [REST API](https://msdn.microsoft.com/library/dn505719.aspx).

When moving between service tiers, consider the following:
- Before upgrading between service tiers or performance levels, make sure you have available quota on the server. If you need additional quota, call customer support.
- Federated databases cannot be upgraded to Basic, Standard or Premium service tiers.

- To downgrade a database, the database should be smaller than the maximum allowed size of the target service tier. For more information on the allowed sized for each service tier, see the service tier and database size table later in this section.

- When downgrading from a Premium service tier, you must first terminate all Geo-Replication relationships. You can follow the steps described in the [Terminate a Continuous Copy Relationship](https://msdn.microsoft.com/library/azure/dn741323.aspx) topic to stop the replication process between the primary and the active secondary databases.

- The restore service offerings are different for the various service tiers. If you are downgrading you may lose the ability to restore to a point in time, or have a lower backup retention period. For more information, see [Azure SQL Database Backup and Restore](https://msdn.microsoft.com/library/azure/jj650016.aspx).

- You can make up to four individual database changes (service tier or performance levels) within a 24 hour period.

- The new properties for the database are not applied until the changes are complete.

Please note the following:
- Business and Web service tiers will be retired September 2015. For more information, see [Web and Business Edition Sunset FAQ](https://msdn.microsoft.com/library/azure/dn741330.aspx).

<note included>
- It is important to note that the current implementation of [Federations will be retired with Web and Business](https://msdn.microsoft.com/library/azure/dn741330.aspx) service tiers. It is recommended that you use [Elastic Scale for Azure SQL Database](sql-database-elastic-scale-get-started.md) to build a sharded, scale-out solution on Azure SQL Database. To try it, see Get Started with Azure SQL Database Elastic Scale Preview.

## Upgrade to a Higher Service Tier
Use one of the following methods to upgrade a database. The steps are specific to upgrading to a Premium service tier, but apply to all upgrades.

###Using Azure Management Portal
1. Use your Microsoft account to sign in to the Azure Management Portal.
2. Navigate to the **SQL DATABASES** tab.
3. Select a database from the **Databases** list. This opens the database on the **Database Dashboard** or the **Quick Start** page.
4. Select the **Scale** tab for the database.
5. Under the **General** section, select **PREMIUM** for the service tier.
6. For **Performance Level**, select **P1**, **P2**, or **P3**. The resources powering each performance level is represented in DTUs. For more information on performance levels and DTUs, see Azure SQL Database Service Tiers and Performance Levels
8. In the command bar at the bottom of the screen, click the **Save** button.
9. You will be presented with a **Confirmation**. Read the information provided and select the checkbox to confirm.


## #Using Azure PowerShell
1. Use Set-AzureSqlDatabase to specify the performance level, maximum database size and the service tier for the database. For a list of database sizes supported by the different service tiers, see Azure SQL Database Service Tiers (Editions).
2. Set the server context with the New-AzureSqlDatabaseServerContext cmdlet. The sample syntax is provided in the Using Azure PowerShell Commands section.
3. Get a handle to the database, and target performance level. Specify the performance level by using Set-AzureSqlDatabase –ServiceObjective

**Usage Example**
In this example:
- This example demonstrates upgrading to a Premium Service Tier.
- The $db handle is created which points to the database name "somedb".
- The $P1 handle is created which points to the Premium performance level 1.
- The performance level for the database $db is set to $P1.

		Windows PowerShell:

		$db = Get-AzureSqlDatabase $serverContext –DatabaseName "somedb"

		$P1= Get-AzureSqlDatabaseServiceObjective $serverContext -ServiceObjectiveName "P1"

		Set-AzureSqlDatabase $serverContext –Database $db –ServiceObjective $P1 –Edition Premium



## Downgrade to a Lower Service Tier
Use one of the following methods to downgrade a database to a lower service tier:

### Using Azure Management Portal
1. Use your Microsoft account to sign in to the Azure Management Portal.
2. Navigate to the **SQL DATABASES** tab.
3. Select the **SCALE** tab for the desired database.
4. Under the **General** section, select the service tier you want to downgrade to.
5. In the command bar at the bottom of the screen, click the **Save** button.
6. If applicable, from the **Confirmation** page, read the information provided and select the checkbox to confirm the change.

### Using Azure PowerShell
1. Use Set-AzureSqlDatabase to specify the service tier, the performance level, and the Max Size for the database.
2. Set the server context by using New-AzureSqlDatabaseServerContext from the sample syntax provided in the Using Azure PowerShell Commands section.
3. Do the following:
 - Get a handle to the database.
 - Get a handle to the performance level.
 - Specify the service tier, the performance level, and the maximum size for the database by using Set-AzureSqlDatabase –ServiceObjective.

**Usage Example**

This example demonstrates how to downgrade from a Premium service tier database to a Standard service tier database:

- The $db handle is created which points to the database name "somedb".

- The variable $S2 is created which points to the Standard performance level S2.

- The performance level for the database $db is set to $S2.

- Specify the database service tier, and the maximum size for the database using the –Edition and –MaxSizeGB parameters. The value specified for the –MaxSizeGB parameter must be valid for the target service tier. A table with the MaxSize values for each service tier is available earlier in this topic.

		Windows PowerShell:

		$db = Get-AzureSqlDatabase $serverContext –DatabaseName “somedb”

		$S2 = Get-AzureSqlDatabaseServiceObjective $serverContext -ServiceObjectiveName "S2"

		Set-AzureSqlDatabase $serverContext –Database $db –ServiceObjective $S2 –Edition Standard –MaxSizeGB 40

##Changing Performance Levels
You can raise or lower performance levels of a Standard or Premium database by using one of the following methods. It may take time to change the performance level of the database. For more information, see the section [Impact of Premium Database Changes](https://msdn.microsoft.com/library/azure/dn369872.aspx#Impact) that follows.

If you are changing the performance level of a Premium Database that has Active Geo-Replication relationships configured, use the following order for primary and active secondary databases:

This is because the active secondary databases must be of equal or greater performance level than the primary.
- If you are changing from a higher performance level to a lower performance level, start with the primary database first followed by one or more active secondary databases.

- If you are changing from a lower performance level to a higher performance level, start with the active secondary databases, and finally the primary.

###Using Azure Management Portal
1. Use your Microsoft account to sign in to the Azure Management Portal.
2. Navigate to the **SQL DATABASES** tab.
3. Select a database from the **Databases** list, either for the account or for a specific server. This opens the database on the **Database Dashboard** or the **Quick Start** page.
5. Select the **Scale** tab for the database.
6. For the **performance level** option, select a performance level.
7. In the command bar at the bottom of the screen, click the **Save** button

###Using Azure PowerShell
1. Use Set-AzureSqlDatabase to specify the performance level for the database.
2. Set the server context by using New-AzureSqlDatabaseServerContext cmdlet. The sample syntax is provided in the Using Azure PowerShell Commands section.
3. Do the following:
- Get a handle to the database.
- Get a handle to the performance level.
- Specify the performance level by using Set-AzureSqlDatabase –ServiceObjective.

**Usage Example**

In this example:

- The $db handle is created which points to the database name "somedb".

- The $P2 handle is created which points to the Premium performance level 2.

- The performance level for the database $db is set to $P2.

		Windows PowerShell
		$db = Get-AzureSqlDatabase $serverContext –DatabaseName “somedb”

		$P2 = Get-AzureSqlDatabaseServiceObjective $serverContext -ServiceObjectiveName "P2"

		Set-AzureSqlDatabase $serverContext –Database $db –ServiceObjective $P2

##Impact of Database Changes
This section provides information about the effects of upgrading to a Standard or Premium service tier or making performance level changes to your database.

###Handling Application Connections during Database Changes
Connections to the database may be temporarily dropped when a performance level change or upgrade/downgrade completes, and a few seconds may elapse before connections can be re-established. SQL Database applications should be coded to be resilient to dropped connections as this can occur anytime in SQL Database when a computer fails in the data center and the SQL Database service fails over the database. There is no implementation change required by the application to use a Premium database or to make changes to a Premium database performance level.

###Understanding and Estimating Latency in Database Changes
A SLO change for a database often involves data movement and therefore many hours may elapse before the change request completes and the associated billing change becomes effective. Data movement occurs for changes when upgrading downgrading a database and may also occur when changing performance level of the database.

**Latency for SLO changes involving data movement**

After determining the storage size of the database, the latency of a SLO change request can be estimated by the following heuristic:

3 x (5 minutes + database size / 150 MB/minute)

For example, if the database size is 50 GB, then the latency of the SLO change request is estimated by the following heuristic:

3 x (5 minutes + 50 GB x 1024 MB/GB / 150 MB/minute) ≈17 hours

Lower and upper bound estimates using this heuristic vary between 15 minutes for an empty database and approximately 2 days for a 150 GB database. Estimates can further vary depending on conditions in the data center.

**Latency for changing from a higher performance level to a smaller performance level**

Generally, there is no data movement if the database performance level is changed from a higher performance level to a smaller size. In such cases, the latency of the SLO change is much faster and typically completes in the order of seconds.

Warning, the above statement only applies to downgrades between Premium and Standard service tiers. Downgrading to a Web, Business, or Basic service tier involves data movement.

###Checking the Status of Database Change
You can check the status of your database during an upgrade or downgrade between service tiers, or when changing the performance level using one of the following methods.

####Using Azure Management Portal
1. Use your Microsoft account to sign in to the Azure Management Portal.
2. Select a database from the **Databases** list. This opens the database on the **Database Dashboard** or the **Quick Start** page.
3. On the **Database Dashboard**, see the **Quick Glance** area for status information in the **Edition** section.
4. Service Level Objective (SLO) represents the performance level within a service tier.


##Using Azure PowerShell Commands
This section provides the prerequisites for using Azure PowerShell commands.

**Prerequisites**

To use the Azure PowerShell cmdlets described in this topic, you must have the following software installed on the computer where PowerShell is run.
1. Download a Windows PowerShell version that’s at least 3.0 at http://www.microsoft.com/en-us/download/details.aspx?id=34595.

2. Download Azure PowerShell from the Command-line tool section at [Azure SDK and Tool Downloads](http://azure.microsoft.com/downloads/).

Do the following:
From your **Start** screen or **Start** menu, navigate to and start Azure PowerShell.

Type in the user name and password for the server.

Create server context by using **New-AzureSqlDatabaseServerContext**.

**Example**

		Windows PowerShell
		$subId = <Subscription ID>
		$thumbprint = <Certificate Thumbprint>
		$myCert = Get-Item Cert:\CurrentUser\My\$thumbprint
		Set-AzureSubscription -SubscriptionName "mySubscription" -SubscriptionId $subId -Certificate $myCert
		Select-AzureSubscription -SubscriptionName "mySubscription"
		$serverContext = New-AzureSqlDatabaseServerContext -ServerName "myserver" -UseSubscription


**Azure PowerShell Reference**
To see detailed information about the Azure PowerShell cmdlets used in this topic, see [Azure SQL Database Cmdlets](https://msdn.microsoft.com/library/dn546726.aspx).

[New-AzureSqlDatabaseServerContext](http://go.microsoft.com/fwlink/?LinkId=391026)

[New-AzureSqlDatabase](http://go.microsoft.com/fwlink/?LinkId=391027)

[Set-AzureSqlDatabase](http://go.microsoft.com/fwlink/?LinkId=391412)
