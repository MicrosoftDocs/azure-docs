---
title: Troubleshoot connections - Hyperscale (Citus) - Azure Database for PostgreSQL
description: Learn how to troubleshoot connection issues to Azure Database for PostgreSQL - Hyperscale (Citus)
keywords: postgresql connection,connection string,connectivity issues,transient error,connection error
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: conceptual
ms.date: 10/8/2019
---

# Troubleshoot connection issues to Azure Database for PostgreSQL - Hyperscale (Citus)

Connection problems may be caused by several things, such as:

* Firewall settings
* Connection time-out
* Incorrect sign in information
* Connection limit reached for server group
* Issues with the infrastructure of the service
* Service maintenance
* The coordinator node failing over to new hardware

Generally, connection issues to Hyperscale can be classified as follows:

* Transient errors (short-lived or intermittent)
* Persistent or non-transient errors (errors that regularly recur)

## Troubleshoot transient errors

Transient errors occur for a number of reasons. The most common include system
Maintenance, error with hardware or software, and coordinator node vCore
upgrades.

Enabling high availability for Hyperscale server group nodes can mitigate these
types of problems automatically. However, your application should still be
prepared to lose its connection briefly. Also other events can take longer to
mitigate, such as when a large transaction causes a long-running recovery.

### Steps to resolve transient connectivity issues

1. Check the [Microsoft Azure Service
   Dashboard](https://azure.microsoft.com/status) for any known outages that
   occurred during the time in which the application was reporting errors.
2. Applications that connect to a cloud service such as Hyperscale (Citus)
   should expect transient errors and react gracefully. For instance,
   applications should implement retry logic to handle these errors instead of
   surfacing them as application errors to users.
3. As the server group approaches its resource limits, errors can seem like
   transient connectivity issues. Increasing node RAM, or adding worker nodes
   and rebalancing data may help.
4. If connectivity problems continue, or last longer than 60 seconds, or happen
   more than once per day, file an Azure support request by
   selecting **Get Support** on the [Azure
   Support](https://azure.microsoft.com/support/options) site.

## Troubleshoot persistent errors

If the application persistently fails to connect to Hyperscale (Citus), the
most common causes are firewall misconfiguration or user error.

* Coordinator node firewall configuration: Make sure that the Hyperscale server
  firewall is configured to allow connections from your client, including proxy
  servers and gateways.
* Client firewall configuration: The firewall on your client must allow
  connections to your database server. Some firewalls require allowing not only
  application by name, but allowing the IP addresses and ports of the server.
* User error: Double-check the connection string. You might have mistyped
  parameters like the server name. You can find connection strings for various
  language frameworks and psql in the Azure portal. Go to the **Connection
  strings** page in your Hyperscale (Citus) server group. Also keep in mind that
  Hyperscale (Citus) clusters have only one database and its predefined name is
  **citus**.

### Steps to resolve persistent connectivity issues

1. Set up [firewall rules](howto-hyperscale-manage-firewall-using-portal.md) to
   allow the client IP address. For temporary testing purposes only, set up a
   firewall rule using 0.0.0.0 as the starting IP address and using
   255.255.255.255 as the ending IP address. That rule opens the server to all IP
   addresses. If the rule resolves your connectivity issue, remove it and
   create a firewall rule for an appropriately limited IP address or address
   range.
2. On all firewalls between the client and the internet, make sure that port
   5432 is open for outbound connections.
3. Verify your connection string and other connection settings.
4. Check the service health in the dashboard.

## Next steps

* Learn the concepts of [Firewall rules in Azure Database for PostgreSQL - Hyperscale (Citus)](concepts-hyperscale-firewall-rules.md)
* See how to [Manage firewall rules for Azure Database for PostgreSQL - Hyperscale (Citus)](howto-hyperscale-manage-firewall-using-portal.md)
