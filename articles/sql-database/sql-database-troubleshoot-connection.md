<properties
	pageTitle="Troubleshoot Database on server is not currently available for Azure SQL Database"
	description="Steps to identify and resolve connection errors for Azure SQL Database."
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
	ms.date="02/12/2016"
	ms.author="daleche"/>

# Troubleshoot "Database on server is not currently available. Please retry the connection later." and other connection errors
“Database <dbname> on server <servername> is not currently available...” is the most common transient connection error for Azure SQL Database. Transient connection errors are typically that occurs because of a planned event (for example, a software upgrade) or an unplanned event (for example, a process crash). These are generally short-lived, ranging from a few seconds to one minute at most. If you receive a different error, evaluate the [error message](sql-database-develop-error-messages.md) for clues about the cause, determine if the issue is transient or persistent, and use the guidance in this topic.

## Steps to resolve transient connectivity issues
1.	Check the [Microsoft Azure Service Dashboard](https://azure.microsoft.com/status) for any known outages.
2.	Make sure your app uses retry logic. See the [connectivity issues](sql-database-connectivity-issues.md) and the [best practices and design guidelines](sql-database-connect-central-recommendations.md) for general retry strategies. Then see [code samples](sql-database-develop-quick-start-client-code-samples.md) for specifics.
3.	As a database approaches its resource limits, it can look like a transient connectivity issue. See [Troubleshooting Performance Issues](sql-database-troubleshoot-performance.md).
4.	If connectivity problems continue, file an Azure support request by selecting **Get Support** on the [Azure Support](https://azure.microsoft.com/support/options) site.

## Steps to resolve persistent connectivity issues
If the app can’t connect at all, it’s usually the IP and firewall configuration. This can include network reconfiguration on the client side (for example, a new IP address or proxy). Mistyped connection parameters, such as the connection string, are also common.

1.	Set up [firewall rules](sql-database-configure-firewall-settings.md) to allow the client IP address.
2.	On all firewalls between the client and the Internet, make sure that port 1433 is open for outbound connections.
3.	Verify your connection string and other connection settings. See the Connection String section in the [connectivity issues topic](sql-database-connectivity-issues.md).
4.	Check service health in the dashboard. If you think there’s a regional outage, see [Recover from an outage](sql-database-disaster-recovery.md) for steps to recover to a new region.
5.	If connectivity problems continue, file an Azure support request by selecting **Get Support** on the [Azure Support](https://azure.microsoft.com/support/options) site.
