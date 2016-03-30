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
	ms.date="03/29/2016"
	ms.author="daleche"/>

# Troubleshoot "Database &lt;x&gt; on server &lt;y&gt; is not currently available. Please retry the connection later" error
[AZURE.INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

When an application connects to an Azure SQL database, you receive the following error message:

```
Error code 40613: "Database <x> on server <y> is not currently available. Please retry the connection later. If the problem persists, contact customer support, and provide them the session tracing ID of <z>"
```

> [AZURE.NOTE] This error message is typically transient (short-lived).

This error occurs when the Azure database is being moved (or reconfigured) and your application loses its connection to the SQL database. SQL database reconfiguration events occurs because of a planned event (for example, a software upgrade) or an unplanned event (for example, a process crash, or load balancing). Most reconfiguration events are generally short-lived and should be completed in less than 60 seconds at most. However, these events can occasionally take longer to finish, such as when a large transaction causes a long-running recovery.

## Steps to resolve transient connectivity issues
1.	Check the [Microsoft Azure Service Dashboard](https://azure.microsoft.com/status) for any known outages that occurred during the time during which the errors were reported by the application.
2. Applications that connect to a cloud service such as Azure SQL Database should expect periodic reconfiguration events and implement retry logic to handle these errors instead of surfacing these as application errors to users. Review the [Transient errors](sql-database-connectivity-issues.md) section and the [best practices and design guidelines](sql-database-connect-central-recommendations.md) for more information and general retry strategies. Then, see [code samples](sql-database-develop-quick-start-client-code-samples.md) for specifics.
3.	As a database approaches its resource limits, it can seem to be a transient connectivity issue. See [Troubleshooting Performance Issues](sql-database-troubleshoot-performance.md).
4.	If connectivity problems continue, or if the duration for which your application encounters the error exceeds 60 seconds or if you see multiple occurrences of the error in a given day, file an Azure support request by selecting **Get Support** on the [Azure Support](https://azure.microsoft.com/support/options) site.

## Next steps
- If you receive a different error, evaluate the [error message](sql-database-develop-error-messages.md) for clues about the cause.
- If the issue is persistent, visit the guidance in [Troubleshoot common connection issues to SQL Azure Database](sql-database-troubleshoot-common-connection-issues.md).
