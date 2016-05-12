<properties
   pageTitle="Manage databases in Azure SQL Data Warehouse | Microsoft Azure"
   description="Overview of managing SQL Data Warehouse databases. Includes management tools, DWUs and scale-out performance, troubleshooting query performance, establishing good security policies, and restoring a database from data corruption or from a regional outage."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="barbkess"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="05/04/2016"
   ms.author="barbkess;sonyama;"/>

# Manage databases in Azure SQL Data Warehouse

SQL Data Warehouse automates many aspects of managing your databases. For example, to scale performance you only need to adjust and pay for the right level of compute resources, and then let SQL Data Warehouse do all the work of scaling out and scaling back. 

You will undoubtedly want to monitor your workload to identify your performance needs as well as troubleshoot long-running queries. You will also need to perform a few security tasks to manage permissions for users and logins.

This overview covers these aspects of managing SQL Data Warehouse.

- Management tools
- Scale Compute
- Pause and Resume
- Performance Best Practices
- Query Monitoring
- Security
- Backup and restore

## Management tools

You can use a variety of tools to manage databases in SQL Data Warehouse. As you manage databases, you will develop tool preferences for each type of task you need to perform.

### Azure portal
The [Azure portal][] is a web-based portal where you can create, update, and delete databases and monitor database resources. This tool is great is if you're just getting started with Azure, managing a small number of data warehouse databases, or need to quickly do something.

To get started with the Azure portal, see [Create a SQL Data Warehouse (Azure Portal)][].

### SQL Server Data Tools in Visual Studio
[SQL Server Data Tools][] (SSDT) in Visual Studio allows you to connect to, manage, and develop your databases. If you're an application developer familiar with Visual Studio or other integrated development environments (IDEs), try using SSDT in Visual Studio.

SSDT includes the SQL Server Object Explorer which enables you to visualize, connect, and execute scripts against SQL Data Warehouse databases. To quickly connect to SQL Data Warehouse, you can simply click the **Open in Visual Studio** button in the command bar when viewing the database details in the Azure Classic Portal.  

To get started with SSDT in Visual Studio, see [Connect to Azure SQL Data Warehouse with Visual Studio][].

### Command-line tools
Command line tools are ideal for automating your workloads.  PowerShell and sqlcmd are two great ways to automate your processes.  We recommend these tools for managing a large number of logical servers and deploying resource changes in a production environment as the tasks necessary can be scripted and then automated.

### Dynamic management views 

DMVs are the bread and butter of managing SQL Data Warehouse. Almost all information that surfaces in the portal relies on DMVs. To see a list of SQL Data Warehouse DMVs, see [SQL Data Warehouse system views][].

To get started, see [Connect and query with sqlcmd][], and [Create a database (PowerShell)][].

## Scale compute

In SQL Data Warehouse, you can quickly scale performance out or back by increasing or decreasing compute resources of CPU, memory, and I/O bandwidth. To scale performance, all you need to do is adjust the number of data warehouse units (DWUs) that SQL Data Warehouse allocates to your database. SQL Data Warehouse quickly makes the change and handles all the underlying changes to hardware or software.

To learn more about scaling DWUs, see [Scale performance][].

##  Pause and resume

To save costs, you can pause and resume compute resources on-demand. For example, if you won't be using the database during the night and on weekends, you can pause it during those times, and resume it during the day. You won't be charged for DWUs while the database is paused.

For more information, see [Pause compute][], and [Resume compute][].

## Performance Best Practices

When getting started with a new technology, discovering the tips and tricks that work best right from the start can save you lots of time.  You will find best practices throughout many of our topics.

To see many a summary of the most important considerations when developing your workload, see [SQL Data Warehouse Best Practices][].

## Query Monitoring

Sometimes a query is running too long, but you aren't sure of which one is the culprit. SQL Data Warehouse has dynamic management views (DMVs) that you can use to figure out which query is taking too long. 

To find long-running queries, see [Monitor your workload using DMVs][].

## Security

To maintain a secure system, you must be on the alert and guard against any type of unauthorized access. A security system needs to make sure firewall rules are in place so only authorized IP addresses can connect. It needs proper authentication of user credentials. After a user has connected to the database, the user should only have permissions to perform a minimal number of actions. To secure data, you can use encryption. It's also important to have auditing and tracking so you can retrace events if there is any suspicious activity.

To learn about managing security, head over to the [Security overview][].

## Backup and restore

There's two ways to recover a database. If you have corrupted some data in your database or made an error, you can restore a database snapshot.  If there is a regional outage or disaster that renders one of the regions unavailable, you can re-create your database in another region.

SQL Data Warehouse automatically backs up your database at regular intervals.For the data backup schedule and retention policy, see [High reliability][]. 

### Geo-redundant storage

Since SQL Data Warehouse separates compute and storage, all your data is directly written to geo-redundant Azure Storage (RA-GRS). Geo-redundant storage replicates your data to a secondary region that is hundreds of miles away from the primary region. In both primary and secondary regions, your data is replicated three times each, across separate fault domains and upgrade domains. This ensures that your data is durable even in the case of a complete regional outage or disaster that renders one of the regions unavailable. To learn more about Read-Access Geo-Redundant Storage, read [Azure storage redundancy options][].

### Database Restore

Database restore is designed to restore your database to an earlier point in time. SQL Data Warehouse service protects all databases with automatic storage snapshots at least every 8 hours and retains them for 7 days to provide you with a discrete set of restore points. These backups are stored on RA-GRS Azure Storage and are therefore geo-redundant by default. The automatic backup and restore features come with no additional charges and provide a zero-cost and zero-admin way to protect databases from accidental corruption or deletion. 

To learn more about database restore, head over to [Restore from snapshot][].

### Geo-Restore

Geo-Restore is designed to recover your database in case it becomes unavailable due to a disruptive event. You can contact support to restore a database from a geo-redundant backup to create a new database in any Azure region. Because the backup is geo-redundant it can be used to recover a database even if the database is inaccessible due to an outage. Geo-Restore feature comes with no additional charges.

To use geo-restore, head over to [Geo-restore from snapshot][].

## Next steps
Using good database design principles will make it easier to manage your databases in SQL Data Warehouse. To learn more, head over to the [Development overview][].

<!--Image references-->

<!--Article references-->
[Azure storage redundancy options]: ../storage/storage-redundancy.md#read-access-geo-redundant-storage
[Create a SQL Data Warehouse (Azure Portal)]: sql-data-warehouse-get-started-provision.md
[Create a database (PowerShell)]: sql-data-warehouse-get-started-provision-powershell
[connection]: sql-data-warehouse-develop-connections.md
[Connect to Azure SQL Data Warehouse with Visual Studio]: sql-data-warehouse-get-started-connect.md
[Connect and query with sqlcmd]: sql-data-warehouse-get-started-connect-sqlcmd.md
[Development overview]: sql-data-warehouse-overview-development.md
[Geo-restore from snapshot]: sql-data-warehouse-backup-and-geo-restore-from-snapshot.md
[High reliability]: sql-data-warehouse-overview-expectations.md#high-reliability
[Monitor your workload using DMVs]: sql-data-warehouse-manage-monitor.md
[Pause compute]: sql-data-warehouse-overview-scalability.md#pause-compute-bk
[Restore from snapshot]: sql-data-warehouse-backup-and-restore-from-snapshot.md
[Resume compute]: sql-data-warehouse-overview-scalability.md#resume-compute-performance-bk
[Scale performance]: sql-data-warehouse-overview-scalability.md#scale-performance-bk
[Security overview]: sql-data-warehouse-overview-security.md
[SQL Data Warehouse Best Practices]: sql-data-warehouse-best-practices.md
[SQL Data Warehouse system views]: sql-data-warehouse-reference-tsql-system-views.md

<!--MSDN references-->
[SQL Server Data Tools]: https://msdn.microsoft.com/library/mt204009.aspx

<!--Other web references-->
[Azure portal]: http://portal.azure.com/
