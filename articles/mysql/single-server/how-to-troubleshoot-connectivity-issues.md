---
title: Troubleshoot connectivity issues in Azure Database for MySQL 
description: Learn how to troubleshoot connectivity issues in Azure Database for MySQL.
ms.service: mysql
ms.subservice: single-server
author: SudheeshGH
ms.author: sunaray
ms.topic: troubleshooting
ms.date: 07/22/2022
---

# Troubleshoot connectivity issues in Azure Database for MySQL

[!INCLUDE[applies-to-mysql-single-flexible-server](../includes/applies-to-mysql-single-flexible-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

The MySQL Community Edition manages connections using one thread per connection. As a result, each user connection gets a dedicated operating system thread in the mysqld process.

There are potential issues associated with this type of connection handling. For example, memory use is relatively high if there's a large number of user connections, even if they're idle connections. In addition, there’s a higher level of internal server contention and context switching overhead when working with thousands of user connections.

## Diagnosing common connectivity errors

Whenever your instance of Azure Database for MySQL is experiencing connectivity issues, remember that problems can exist in any of the three layers involved: the client device, the network, or your Azure Database for MySQL server.

As a result, whenever you’re diagnosing connectivity errors, be sure to consider full details of the:

* Client, including the:
  * Configuration (on-premises, Azure VM, etc. or a DBA machine).
  * Operating system.
  * Software and versions.
* Connection string and any included parameters.
* Network topology (same region? same AZ? firewall rules? routing).
* Connection pool (parameters and configuration), if one is in use.

It’s also important to determine whether the database connectivity issue is affecting a single client device or several client devices. If the errors are affecting only one of several clients, then it’s likely that the problem is with that client. However, if all clients are experiencing the same error, it’s more likely that the problem is on the database server side or with the networking in between.

Be sure to consider the potential of workload overload as well, especially if an application opens a surge of connections in a very short amount of time. You can use metrics such as “Total Connections”, “Active Connections”, and “Aborted Connections” to investigate this.

When you establish connectivity from a client device or application, the first important call in mysql is to getaddrinfo, which performs the DNS translation from the endpoint provided to an IP address. If getting the address fails, MySQL shows an error message such as "ERROR 2005 (HY000): Unknown MySQL server host 'mysql-example.mysql.database.azure.com' (11)" and the number in the end (11, 110, etc.).

### Client-side error 2005 codes

Quick reference notes for some client-side error 2005 codes appear in the following table.

| **ERROR 2005 code** | **Notes** |
|----------|----------|
| **(11) "EAI_SYSTEM - system error"** | There's an error on the DNS resolution on the client side. Not an Azure MySQL issue. Use dig/nslookup on the client to troubleshoot. |
| **(110) "ETIMEDOUT - Connection timed out"** | There was a timeout connecting to the client's DNS server. Not an Azure MySQL issue. Use dig/nslookup on the client to troubleshoot. |
| **(0) "name unknown"** | The name specified wasn't resolvable by DNS. Check the input on the client. This is very likely not an issue with Azure Database for MySQL. |

The second call in mysql is with socket connectivity and when looking at an error message like "ERROR 2003 (HY000): Can't connect to MySQL server on 'mysql-example.mysql.database.azure.com' (111)", the number in the end (99, 110, 111, 113, etc.).

### Client-side error 2003 codes

Quick reference notes for some client-side error 2003 codes appear in the following table.

| **ERROR 2003 code** | **Notes** |
|----------|----------|
| **(99) "EADDRNOTAVAIL - Cannot assign requested address"** | This error isn’t caused by Azure Database for MySQL., rather it is on the client side. |
| **(110) "ETIMEDOUT - Connection timed out"** | TThere was a timeout connecting to the IP address provided. Likely a security (firewall rules) or networking (routing) issue. Usually, this isn’t an issue with Azure Database for MySQL. Use `nc/telnet/TCPtraceroute` on the client device to troubleshoot. |
| **(111) "ECONNREFUSED - Connection refused"** | While the packets reached the target server, the server rejected the connection. This might be an attempt to connect to the wrong server or the wrong port. This also might relate to the target service (Azure Database for MySQL) being down, recovering from failover, or going through crash recovery, and not yet accepting connections. This issue could be on either the client side or the server side. Use `nc/telnet/TCPtraceroute` on the client device to troubleshoot. |
| **(113) "EHOSTUNREACH - Host unreachable"** | The client device’s routing table doesn’t include a path to the network on which the database server is located. Check the client device's networking configuration. |

### Other error codes

Quick reference notes for some other error codes related to issues that occur after the network connection with the database server is successfully established appear in the following table.

| **ERROR code** | **Notes** |
|----------|----------|
| **ERROR 2013 "Lost connection to MySQL server"** | The connection was established, but it was lost afterwards. This can happen if a connection is attempted against something that isn't MySQL (like using a MySQL client to connect to SSH on port 22 for example). It can also happen if the super user kills the session. It can also happen if the database times out the session. Or it can refer to issues in the database server, after the connection is established. This can happen at any time during the lifetime of the client connection. It can indicate that the database had a serious issue. |
| **ERROR 1040 "Too many connections"** | The number of connected database clients is already at the configured maximum number. Need to evaluate why so many connections are established against the database. |
| **ERROR 1045 "Access denied for user"** | The client provided an incorrect username or password, so the database has denied access. |
| **ERROR 2006 "MySQL server has gone away"** | Similar to the **ERROR 2013 "Lost connection to MySQL server"** entry in the previous table. |
| **ERROR 1317 "Query execution was interrupted"** | Error that the client receives when the primary user stops the query, not the connection. |
| **ERROR 1129 "Host '1.2.3.4' is blocked because of many connection errors”** | Unblock with 'mysqladmin flush-hosts'" - all clients in a single machine will be blocked if one client of that machine attempts several times to use the wrong protocol to connect with MySQL (telnetting to the MySQL port is one example). As the error message says, the database’s admin user has to run `FLUSH HOSTS;` to clear the issue. |

> [!NOTE]
> For more information about connectivity errors, see the blog post [Investigating connection issues with Azure Database for MySQL](https://techcommunity.microsoft.com/t5/azure-database-for-mysql-blog/investigating-connection-issues-with-azure-database-for-mysql/ba-p/2121204).

## Next steps

To find peer answers to your most important questions or to post or answer a question, visit [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-database-mysql).
