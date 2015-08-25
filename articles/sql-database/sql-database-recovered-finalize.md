<properties
   pageTitle="Finalize your recovered Azure SQL Database"
   description="Point in Time Restore, Microsoft Azure SQL Database, restore database, recover database, Azure Management Portal, Azure portal"
   services="sql-database"
   documentationCenter=""
   authors="elfisher"
   manager="jeffreyg"
   editor=""/>

<tags
   ms.service="sql-database"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="storage-backup-recovery"
   ms.date="07/30/2015"
   ms.author="elfish"/>

# Finalize your recovered Azure SQL Database

## Overview

This article provides a checklist of tasks that you need to go through before putting a newly recovered Azure SQL Database back into production. This checklist applies to databases recovered from Geo-Replication failover, Deleted Database Restore, Point-in-Time Restore, or Geo-Restore.

## Update Connection Strings

Verify connection strings of your application are pointing to the newly recovered database. Update your connection strings if one of the below situations applies:

  + The recovered database uses a different name from the source database name
  + The recovered database is on a different server from the source server

For more information about changing connection strings, see [Guidelines for Connecting to Azure SQL Database Programmatically](https://msdn.microsoft.com/library/azure/ee336282.aspx) and [Connections to Azure SQL Database: Central Recommendations ](sql-database-connect-central-recommendations.md).
 
## Modify Firewall Rules
Verify the firewall rules at server-level and database-level, and make sure connections from your client computers or Azure to the server and the newly recovered database are enabled. For more information, see [Azure SQL Database Firewall](https://msdn.microsoft.com/library/azure/ee621782.aspx) and [How to: Configure Firewall Settings (Azure SQL Database)](https://msdn.microsoft.com/library/azure/jj553530.aspx).

## Verify Server Logins and Database Users

Verify if all the logins used by your application exist on the server which is hosting your recovered database. Re-create the missing logins and grant them appropriate permissions on the recovered database. For more information, see [Managing Databases and Logins in Azure SQL Database](https://msdn.microsoft.com/library/azure/ee336235.aspx).

Verify if each database users in the recovered database is associated with a valid server login. Use ALTER USER statement to map user to valid server login. For more information, see [ALTER USER](http://go.microsoft.com/fwlink/?LinkId=397486). 


## Setup Telemetry Alerts

Verify if your existing alert rule settings are map to your recovered database. Update the setting if one of below situations applies:

  + The recovered database uses a different name from the source database name
  + The recovered database is on a different server from the source server

For more information about database alert rules, see [How to: Receive Alert Notifications and Manage Alert Rules in Azure](https://msdn.microsoft.com/library/azure/dn306638.aspx).


## Enable Auditing

If auditing is required to access your database, you need to enable Auditing after the database recovery. A good indicator of auditing is required is that client applications use secure connection strings in a pattern of *.database.secure.windows.net. For more information, see [Get started with SQL database auditing](sql-database-auditing-get-started.md). 
 
