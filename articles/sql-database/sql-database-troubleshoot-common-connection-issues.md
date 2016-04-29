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
	ms.date="05/03/2016"
	ms.author="daleche"/>

# Troubleshoot common connection issues to Azure SQL Database
Connection issues to Azure SQL Database can be broadly classified as any of the following:

- [Transient errors (short-lived or intermittent)](#troubleshoot-the-transient-errors)
- [Persistent or non-transient errors (errors that regularly recur)](#troubleshoot-the-persistent-errors-non-transient-errors)

If you encounter the connection issues, try the troubleshoot steps that are described in this article. [AZURE.INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

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
