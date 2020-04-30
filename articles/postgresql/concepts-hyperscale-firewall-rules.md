---
title: Firewall rules - Hyperscale (Citus) - Azure Database for PostgreSQL
description: This article describes firewall rules for Azure Database for PostgreSQL - Hyperscale (Citus).
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: conceptual
ms.date: 9/12/2019
---
# Firewall rules in Azure Database for PostgreSQL - Hyperscale (Citus)
Azure Database for PostgreSQL server firewall prevents all access to your Hyperscale (Citus) coordinator node until you specify which computers have permission. The firewall grants access to the server based on the originating IP address of each request.
To configure your firewall, you create firewall rules that specify ranges of acceptable IP addresses. You can create firewall rules at the server level.

**Firewall rules:** These rules enable clients to access your Hyperscale (Citus) coordinator node, that is, all the databases within the same logical server. Server-level firewall rules can be configured by using the Azure portal. To create server-level firewall rules, you must be the subscription owner or a subscription contributor.

## Firewall overview
All database access to your coordinator node is blocked by the firewall by default. To begin using your server from another computer, you need to specify one or more server-level firewall rules to enable access to your server. Use the firewall rules to specify which IP address ranges from the Internet to allow. Access to the Azure portal website itself is not impacted by the firewall rules.
Connection attempts from the Internet and Azure must first pass through the firewall before they can reach your PostgreSQL Database, as shown in the following diagram:

![Example flow of how the firewall works](media/concepts-hyperscale-firewall-rules/1-firewall-concept.png)

## Connecting from the Internet and from Azure

A Hyperscale (Citus) server group firewall controls who can connect to the group's coordinator node. The firewall determines access by consulting a configurable list of rules. Each rule is an IP address, or range of addresses, that are allowed in.

When the firewall blocks connections, it can cause application errors. Using the PostgreSQL JDBC driver, for instance, raises an error like this:

> java.util.concurrent.ExecutionException: java.lang.RuntimeException:
> org.postgresql.util.PSQLException: FATAL: no pg\_hba.conf entry for host "123.45.67.890", user "citus", database "citus", SSL

See [Create and manage firewall rules](howto-hyperscale-manage-firewall-using-portal.md) to learn how the rules are defined.

## Troubleshooting the database server firewall
When access to the Microsoft Azure Database for PostgreSQL - Hyperscale (Citus) service doesn't behave as you expect, consider these points:

* **Changes to the allow list have not taken effect yet:** There may be as much as a five-minute delay for changes to the Hyperscale (Citus) firewall configuration to take effect.

* **The user is not authorized or an incorrect password was used:** If a user does not have permissions on the server or the password used is incorrect, the connection to the server is denied. Creating a firewall setting only provides clients with an opportunity to attempt connecting to your server; each client must still provide the necessary security credentials.

For example, using a JDBC client, the following error may appear.
> java.util.concurrent.ExecutionException: java.lang.RuntimeException: org.postgresql.util.PSQLException: FATAL: password authentication failed for user "yourusername"

* **Dynamic IP address:** If you have an Internet connection with dynamic IP addressing and you are having trouble getting through the firewall, you could try one of the following solutions:

* Ask your Internet Service Provider (ISP) for the IP address range assigned to your client computers that access the Hyperscale (Citus) coordinator node, and then add the IP address range as a firewall rule.

* Get static IP addressing instead for your client computers, and then add the static IP address as a firewall rule.

## Next steps
For articles on creating server-level and database-level firewall rules, see:
* [Create and manage Azure Database for PostgreSQL firewall rules using the Azure portal](howto-hyperscale-manage-firewall-using-portal.md)
