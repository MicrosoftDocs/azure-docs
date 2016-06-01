<properties
	pageTitle="Troubleshoot common connection issues to Azure SQL Database"
	description="Steps to identify and resolve common connection errors for Azure SQL Database."
	services="sql-database"
	documentationCenter=""
	authors="dalechen"
	manager="felixwu"
	editor=""/>

<tags
	ms.service="sql-database"
	ms.workload="data-management"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/02/2016"
	ms.author="daleche"/>

# Troubleshoot connection issues to Azure SQL Database

You receive [error messages](sql-database-develop-error-messages.md) when the connection to Azure SQL Database fails. This article is a centralized topic which helps you to troubleshooting the Azure SQL Database connectivity issues. It introduces [the common causes](#cause) of the connection issues, recommends [a troubleshooting tool](#Try-the-troubleshooter-for-Azure-SQL-Database-connectivity-issues) helps you to identity the problem, provides the troubleshoot steps to solve [the transient errors](#Troubleshoot-the-transient-errors) and [persistent or non-transient errors](#troubleshoot-the-persistent-errors). Finally, this article lists [all of Azure SQL Database connectivity issues relevant articles that are recommended by Microsoft](#All-topics-for-Azure-SQL-Database-connection-problems).

## Cause
The connection problems can be caused by any of the following problems:
- Didn’t apply [the best practices and design guidelines](sql-database-connect-central-recommendations.md) when designing the applications.
- SQL Azure database reconfiguration
- Firewall settings
- Connection time-out
- Incorrect login information
- The maximum limit on some Azure SQL Database resources is reached

Generally, connection issues to Azure SQL Database can be broadly classified as any of the following:

- [Transient errors (short-lived or intermittent)](#troubleshoot-the-transient-errors)
- [Persistent or non-transient errors (errors that regularly recur)](#troubleshoot-the-persistent-errors-non-transient-errors)

If you encounter the connection issues, try the troubleshoot steps that are described in this article.
[AZURE.INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## Try the troubleshooter for Azure SQL Database connectivity issues
If you receive a specific connection error, try [this tool](https://support.microsoft.com/help/10085/troubleshooting-connectivity-issues-with-microsoft-azure-sql-database) which help you to identity your problem quickly, and guides you to solve the connect errors.

## Troubleshoot the transient errors
If your application is experiencing transient errors, review the following topics for tips about how to troubleshoot and reduce the frequency of these errors:

- [Troubleshooting Database &lt;x&gt; on Server &lt;y&gt; is unavailable (Error: 40613)](sql-database-troubleshoot-connection.md)
- [Troubleshoot, diagnose, and prevent SQL connection errors and transient errors for SQL Database](sql-database-connectivity-issues.md)

<a id="troubleshoot-the-persistent-errors" name="troubleshoot-the-persistent-errors"></a>
## Troubleshoot the persistent errors (non-transient errors)
If the application persistently fails to connect to SQL Azure Database, it usually indicates an issue with one of the following:

- Firewall configuration. The Azure SQL database or client-side firewall is blocking connections to Azure SQL Database.
- Network reconfiguration on the client side: for example, a new IP address or a proxy server.
- User error: for example, mistyped connection parameters, such as the server name in the connection string.

### Steps to resolve persistent connectivity issues
1.	Set up [firewall rules](sql-database-configure-firewall-settings.md) to allow the client IP address.
2.	On all firewalls between the client and the Internet, make sure that port 1433 is open for outbound connections. Review [Configure the Windows Firewall to Allow SQL Server Access](https://msdn.microsoft.com/library/cc646023.aspx) for additional pointers.
3.	Verify your connection string and other connection settings. See the Connection String section in the [connectivity issues topic](sql-database-connectivity-issues.md#connections-to-azure-sql-database).
4.	Check service health in the dashboard. If you think there’s a regional outage, see [Recover from an outage](sql-database-disaster-recovery.md) for steps to recover to a new region.

## All topics for Azure SQL Database connection problems

The following table lists every topic of connection problems that applies directly to the SQL Database service of Azure.


| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 1 | [Troubleshoot connection issues to Azure SQL Database](sql-database-troubleshoot-common-connection-issues.md) | This is the landing page for troubleshooting the connectivity issues in Azure SQL Database. It provides the steps to identify and resolve transient errors and persistent or non-transient errors in Azure SQL Database. |
| 2 | [Troubleshoot, diagnose, and prevent SQL connection errors and transient errors for SQL Database](sql-database-connectivity-issues.md) | Learn how to troubleshoot, diagnose, and prevent a SQL connection error or transient error in Azure SQL Database. |
| 3 | [Retry general guidance](best-practices-retry-general.md) | Learn the general guidance for transient fault handling when connecting to Azure SQL Database. |
| 4 | [Troubleshooting connectivity issues with Microsoft Azure SQL Database](https://support.microsoft.com/help/10085/troubleshooting-connectivity-issues-with-microsoft-azure-sql-database) | This is a tool which help to identity your problem, and guides you to solve the connect errors. |
| 5 | [Troubleshoot "Database &lt;x&gt; on server &lt;y&gt; is not currently available. Please retry the connection later" error](sql-database-troubleshoot-connection.md) | Steps to identify and resolve 40613 error "Database &lt;x&gt; on server &lt;y&gt; is not currently available. Please retry the connection later" in Azure SQL Database. |
| 6 | [SQL error codes for SQL Database client applications: Database connection error and other issues](sql-database-develop-error-messages.md) | Learn about SQL error codes for SQL Database client applications, such as common database connection errors, database copy issues, and general errors. |
| 7 | [Azure SQL Database performance guidance for single databases](sql-database-performance-guidance.md) | This topic provides guidance to help you determine which service tier is right for your application and provides recommendations for tuning your application to get the most out of your Azure SQL Database. |
| 8 | [Connecting to SQL Database: Best Practices and Design Guidelines](sql-database-connect-central-recommendations.md) | This topic provides links to code samples for various technologies that you can use to connect to and interact with Azure SQL Database. |
| 9 | Upgrade to Azure SQL Database v12 page ([Azure portal](sql-database-upgrade-server-portal.md), [PowerShell](sql-database-upgrade-server-powershell.md)) | The articles provide directions for upgrading existing Azure SQL Database V11 servers and databases to Azure SQL Database V12 by using Azure portal or by using PowerShell. |


## Next steps

- [Troubleshoot Azure SQL Database performance issues](sql-database-troubleshoot-performance.md)
- [Troubleshoot Azure SQL Database permission issues](sql-database-troubleshoot-permissions.md)
- [View all topics for Azure SQL Database service](sql-database-index-all-articles.md)
- [Search the documentation of Microsoft Azure](http://azure.microsoft.com/search/documentation/)
- [View the latest updates to the sql-database service](http://azure.microsoft.com/updates/?service=sql-database)


## Learn more
- [Connecting to SQL Database: Best Practices and Design Guidelines](sql-database-connect-central-recommendations.md)
- [Retry general guidance](../best-practices-retry-general.md)
- [Connection libraries for SQL Database and SQL Server](sql-database-libraries.md)
- [The learning path of using Azure SQL Database](https://azure.microsoft.com/documentation/learning-paths/sql-database-training-learn-sql-database.md)
- [The learning path of using elastic database features and tools](https://azure.microsoft.com/documentation/learning-paths/sql-database-elastic-scale) 
