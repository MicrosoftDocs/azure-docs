---
title: postgresql-concepts-firewall-rules | Microsoft Docs
description: Describes filewall rules for your database.
keywords: azure cloud postgresql postgres
services: postgresql
author:
ms.author:
manager: jhubbard
editor: jasonh

ms.assetid:
ms.service: postgresql - database
ms.tgt_pltfrm: portal
ms.topic: hero - article
ms.date: 04/30/2017
---
# Overview of Azure Database for PostgreSQL Server Firewall Rules
Microsoft Azure Database for PostgreSQL Server provides a relational database service for Azure and ~~other Internet-based applications~~. Firewalls prevent all access to your database server until you specify which computers have permission. The firewall grants access to databases based on the originating IP address of each request.
To configure your firewall, you create firewall rules that specify ranges of acceptable IP addresses. You can create firewall rules at the server level.

* **Firewall rules:** These rules enable clients to access your entire Azure Database for PostgreSQL Server, that is, all the databases within the same logical server. Server-level firewall rules can be configured by using the Azure portal or using Azure CLI commands. To create server-level firewall rules, you must be the subscription owner or a subscription contributor.

## Firewall overview
All database access to your Azure Database for PostgreSQL server is blocked by the firewall by default. To begin using your server from another computer, you need to specify one or more server-level firewall rules to enable access to your server. Use the firewall rules to specify which IP address ranges from the Internet to allow. Access to the Azure portal website itself is not impacted by the firewall rules.
Connection attempts from the Internet and Azure must first pass through the firewall before they can reach your PostgreSQL Database, as shown in the following diagram:

![](./media/postgresql-concepts-firewall-rules/1_firewall-configrations.png)

## Connecting from the Internet
Server-level firewall rules apply to all databases on the Azure Database for PostgreSQL server. 
If the IP address of the request is within one of the ranges specified in the server-level firewall rules, the connection is granted.
If the IP address of the request is not within the ranges specified in any of the database-level or server-level firewall rules, the connection request fails.
For example, if your application connects with JDBC driver for PostgreSQL, you may encounter this error attempting to connect when the firewall is blocking the connection.

java.util.concurrent.ExecutionException: java.lang.RuntimeException:
org.postgresql.util.PSQLException: FATAL: no pg\_hba.conf entry for host "123.45.67.890", user "adminuser", database "postgresql", SSL

## Connecting from Azure
Currently, there is no option to switch to allow access from other Azure services to the Azure Database for PostgreSQL server.
One manual approach to configure the firewall rules is to download the list of IP addresses for the Azure Services, and review that list to know which data center is connecting, and create firewall rules for those IP ranges. See the list of Microsoft Azure Datacenter IP Ranges
Another approach is to deploy the Azure Database for PostgreSQL Server using an ARM Template, which includes many firewall rules for Azure IP ranges to open the server to other Azure services.
If the connection attempt coming in from another Azure application or service is not allowed, the request is blocked and does not reach the Azure Database for PostgreSQL Server.

[!IMPORTANT]
Configuring the firewall to allow all connections from other Azure services includes connections from the subscriptions of other customers.

## Programmatically managing firewall rules
In addition to the Azure portal, firewall rules can be managed programmatically using Azure CLI.

[How to Manage PostgreSQL Firewall via CLI]

>[!NOTE]
>There can be up as much as a five-minute delay for changes to the firewall settings to take effect.

## Troubleshooting the database firewall
Consider the following points when access to the Microsoft Azure Database for PostgreSQL Server service does not behave as you expect:

* **Changes to the allow list have not taken effect yet:** There may be as much as a five-minute delay for changes to the Azure Database for PostgreSQL Server firewall configuration to take effect.

* **The login is not authorized or an incorrect password was used:** If a login does not have permissions on the Azure Database for PostgreSQL Server or the password used is incorrect, the connection to the Azure Database for PostgreSQL Server is denied. Creating a firewall setting only provides clients with an opportunity to attempt connecting to your server; each client must provide the necessary security credentials.

For example, using a JDBC client, the following error may appear.

java.util.concurrent.ExecutionException: java.lang.RuntimeException: org.postgresql.util.PSQLException: FATAL: password authentication failed for user "yourusername"

* **Dynamic IP address:** If you have an Internet connection with dynamic IP addressing and you are having trouble getting through the firewall, you could try one of the following solutions:

* Ask your Internet Service Provider (ISP) for the IP address range assigned to your client computers that access the Azure Database for PostgreSQL Server, and then add the IP address range as a firewall rule.

* Get static IP addressing instead for your client computers, and then add the IP addresses as firewall rules.

## Next steps
For articles on creating server-level and database-level firewall rules, see:
* [Configure Azure Database for PostgreSQL Server firewall rules using the Azure portal]
* [Configure Azure Database for PostgreSQL Server firewall rules using CLI]

For a tutorial on creating a database, see []

## Additional resources

