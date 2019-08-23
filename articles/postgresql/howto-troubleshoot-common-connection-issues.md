---
title: Troubleshoot connection issues to Azure Database for PostgreSQL - Single Server
description: Learn how to troubleshoot connection issues to Azure Database for PostgreSQL - Single Server.
keywords: postgresql connection,connection string,connectivity issues,transient error,connection error
author: jan-eng
ms.author: janeng
ms.service: postgresql
ms.topic: conceptual
ms.date: 5/6/2019
---

# Troubleshoot connection issues to Azure Database for PostgreSQL - Single Server

Connection problems may be caused by a variety of things, including:

* Firewall settings
* Connection time-out
* Incorrect login information
* Maximum limit reached on some Azure Database for PostgreSQL resources
* Issues with the infrastructure of the service
* Maintenance being performed in the service
* The compute allocation of the server is changed by scaling the number of vCores or moving to a different service tier

Generally, connection issues to Azure Database for PostgreSQL can be classified as follows:

* Transient errors (short-lived or intermittent)
* Persistent or non-transient errors (errors that regularly recur)

## Troubleshoot transient errors

Transient errors occur when maintenance is performed, the system encounters an error with the hardware or software, or you change the vCores or service tier of your server. The Azure Database for PostgreSQL service has built-in high availability and is designed to mitigate these types of problems automatically. However, your application loses its connection to the server for a short period of time of typically less than 60 seconds at most. Some events can occasionally take longer to mitigate, such as when a large transaction causes a long-running recovery.

### Steps to resolve transient connectivity issues

1. Check the [Microsoft Azure Service Dashboard](https://azure.microsoft.com/status) for any known outages that occurred during the time in which the errors were reported by the application.
2. Applications that connect to a cloud service such as Azure Database for PostgreSQL should expect transient errors and implement retry logic to handle these errors instead of surfacing these as application errors to users. Review [Handling of transient connectivity errors for Azure Database for PostgreSQL](concepts-connectivity.md) for best practices and design guidelines for handling transient errors.
3. As a server approaches its resource limits, errors can seem to be transient connectivity issue. See [Limitations in Azure Database for PostgreSQL](concepts-limits.md).
4. If connectivity problems continue, or if the duration for which your application encounters the error exceeds 60 seconds or if you see multiple occurrences of the error in a given day, file an Azure support request by selecting **Get Support** on the [Azure Support](https://azure.microsoft.com/support/options) site.

## Troubleshoot persistent errors

If the application persistently fails to connect to Azure Database for PostgreSQL, it usually indicates an issue with one of the following:

* Server firewall configuration: Make sure that the Azure Database for PostgreSQL server firewall is configured to allow connections from your client, including proxy servers and gateways.
* Client firewall configuration: The firewall on your client must allow connections to your database server. IP addresses and ports of the server that you cannot to must be allowed as well as application names such as PostgreSQL in some firewalls.
* User error: You might have mistyped connection parameters, such as the server name in the connection string or a missing *\@servername* suffix in the user name.

### Steps to resolve persistent connectivity issues

1. Set up [firewall rules](howto-manage-firewall-using-portal.md) to allow the client IP address. For temporary testing purposes only, set up a firewall rule using 0.0.0.0 as the starting IP address and using 255.255.255.255 as the ending IP address. This will open the server to all IP addresses. If this resolves your connectivity issue, remove this rule and create a firewall rule for an appropriately limited IP address or address range.
2. On all firewalls between the client and the internet, make sure that port 5432 is open for outbound connections.
3. Verify your connection string and other connection settings.
4. Check the service health in the dashboard. If you think there’s a regional outage, see [Overview of business continuity with Azure Database for PostgreSQL](concepts-business-continuity.md) for steps to recover to a new region.

## Next steps

* [Handling of transient connectivity errors for Azure Database for PostgreSQL](concepts-connectivity.md)
