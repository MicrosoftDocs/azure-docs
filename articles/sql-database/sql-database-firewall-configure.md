<properties
   pageTitle="Azure SQL Database firewall | Microsoft Azure"
   description="How to configure your Microsoft Azure SQL Database firewall."
   services="sql-database"
   documentationCenter=""
   authors="BYHAM"
   manager="jeffreyg"
   editor=""
   tags=""/>

<tags
   ms.service="sql-database"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="data-management"
   ms.date="08/04/2015"
   ms.author="rickbyh"/>

# Azure SQL Database firewall

Microsoft Azure SQL Database provides a relational database service for Azure and other Internet-based applications. To help protect your data, the Azure SQL Database firewall prevents all access to your Azure SQL Database server until you specify which computers have permission. The firewall grants access based on the originating IP address of each request. 

To configure your firewall, you create firewall rules that specify ranges of acceptable IP addresses. You can create firewall rules at the server and database levels.

- **Server-level firewall rules:** These rules enable clients to access your entire Azure SQL Database server, that is, all the databases within the same logical server. These rules are stored in the **master** database.
- **Database-level firewall rules:** These rules enable clients to access individual databases within your Azure SQL Database server. These rules are created per database and are stored in the individual databases (including **master**). These rules can be helpful in restricting access to certain (secure) databases within the same logical server.

**Recommendation:** Microsoft recommends using database-level firewall rules whenever possible to make your database more portable. Use server-level firewall rules when you have many databases that have the same access requirements, and you don't want to spend time configuring each database individually.

**About Federations:** The current implementation of Federations will be retired with Web and Business service tiers. Consider deploying custom sharding solutions to maximize scalability, flexibility, and performance. For more information about custom sharding, see [Scaling Out Azure SQL Databases](https://msdn.microsoft.com/library/dn495641.aspx).

> [AZURE.NOTE] If you create a database federation in Azure SQL Database where the root database contains database-level firewall rules, the rules are not copied to the federation member databases. If you need database-level firewall rules for the federation members, you will have to recreate the rules for the federation members. However, if you split a federation member containing a database-level firewall rule into new federation members using the ALTER FEDERATION … SPLIT statement, the new destination members will have the same database-level firewall rules as the source federation member. For more information about federations, see [Federations in Azure SQL Database](https://msdn.microsoft.com/library/hh597452.aspx).

## Overview

Initially, all access to your Azure SQL Database server is blocked by the firewall. In order to begin using your Azure SQL Database server, you must go to the Management Portal and specify one or more server-level firewall rules that enable access to your Azure SQL Database server. Use the firewall rules to specify which IP address ranges from the Internet are allowed, and whether or not Azure applications can attempt to connect to your Azure SQL Database server.

However, if you want to selectively grant access to just one of the databases in your Azure SQL Database server, you must create a database-level rule for the required database with an IP address range that is beyond the IP address range specified in the server-level firewall rule, and ensure that the IP address of the client falls in the range specified in the database-level rule.

Connection attempts from the Internet and Azure must first pass through the firewall before they can reach your Azure SQL Database server or database, as shown in the following diagram.

   ![sqldb-firewall][1]

## Connecting from the Internet

When a computer attempts to connect to your database server from the Internet, the firewall checks the originating IP address of the request against the full set of server-level and (if required) database-level firewall rules:

- If the IP address of the request is within one of the ranges specified in the server-level firewall rules, the connection is granted to your Azure SQL Database server.

- If the IP address of the request is not within one of the ranges specified in the server-level firewall rule, the database-level firewall rules are checked. If the IP address of the request is within one of the ranges specified in the database-level firewall rules, the connection is granted only to the database that has a matching database-level rule.

- If the IP address of the request is not within the ranges specified in any of the server-level or database-level firewall rules, the connection request fails.

> [AZURE.NOTE] To access Azure SQL Database from your local computer, ensure the firewall on your network and local computer allows outgoing communication on TCP port 1433.
 

## Connecting from Azure

When an application from Azure attempts to connect to your database server, the firewall verifies that Azure connections are allowed. A firewall setting with starting and ending address equal to 0.0.0.0 indicates these connections are allowed. If the connection attempt is not allowed, the request does not reach the Azure SQL Database server.

You can enable connections from Azure in the [Management Portal](http://go.microsoft.com/fwlink/p/?LinkID=161793) in two ways:

- Select the checkbox **Allow Microsoft Azure Services to Access the Server** when creating a new server.

- From the **Configure** tab on a server, under the **Allowed Services** section, click **Yes** for **Microsoft Azure Services**. 

## Creating the first server-level firewall rule

The first server-level firewall setting can be created using the [Management Portal](http://go.microsoft.com/fwlink/p/?LinkID=161793) or programmatically using the REST API or Azure PowerShell. Subsequent server-level firewall rules can be created and managed using these methods, as well as through Transact-SQL. For more information on server-level firewall rules, see [How to: Configure Firewall Settings (Azure SQL Database)](sql-database-configure-firewall-settings.md).

## Creating database-level firewall rules

After you have configured the first server-level firewall, you may want to restrict access to certain databases. If you specify an IP address range in the database-level firewall rule that is outside the range specified in the server-level firewall rule, only those clients that have IP addresses in the database-level range can access the database. You can have a maximum of 128 database-level firewall rules for a database. Database-level firewall rules for master and user databases can be created and managed through Transact-SQL. For more information, see [How to: Configure Firewall Settings (Azure SQL Database)](sql-database-configure-firewall-settings.md).

## Programmatically managing firewall rules

In addition to the Azure Management Portal, firewall rules can be managed programmatically using Transact-SQL, REST API, and Azure PowerShell. The tables below describe the set of commands available for each method. 


### Transact-SQL

| Catalog View or Stored Procedure                                                           | Level     | Description                                          |
|--------------------------------------------------------------------------------------------|-----------|------------------------------------------------------|
| [sys.firewall_rules](https://msdn.microsoft.com/library/dn269980.aspx)                   | Server    | Displays the current server-level firewall rules     |
| [sp_set_firewall_rule](https://msdn.microsoft.com/library/dn270017.aspx)             | Server    | Creates or updates server-level firewall rules       |
| [sp_delete_firewall_rule](https://msdn.microsoft.com/library/dn270024.aspx)          | Server    | Removes server-level firewall rules                  |
| [sys.database_firewall_rules](https://msdn.microsoft.com/library/dn269982.aspx)        | Database  | Displays the current database-level firewall rules   |
| [sp_set_database_firewall_rule](https://msdn.microsoft.com/library/dn270010.aspx)    | Database  | Creates or updates the database-level firewall rules |
| [sp_delete_database_firewall_rule](https://msdn.microsoft.com/library/dn270030.aspx) | Databases | Removes database-level firewall rules                |

### REST API

| API                  | Level  | Description                                                      |
|----------------------|--------|------------------------------------------------------------------|
| [List Firewall Rules](https://msdn.microsoft.com/library/azure/dn505715.aspx)  | Server | Displays the current server-level firewall rules                 |
| [Create Firewall Rule](https://msdn.microsoft.com/library/azure/dn505712.aspx) | Server | Creates or updates server-level firewall rules                   |
| [Set Firewall Rule](https://msdn.microsoft.com/library/azure/dn505707.aspx)    | Server | Updates the properties of an existing server-level firewall rule |
| [Delete Firewall Rule](https://msdn.microsoft.com/library/azure/dn505706.aspx) | Server | Removes server-level firewall rules                              |


### Azure PowerShell

| Cmdlet                                                                                              | Level  | Description                                                      |
|-----------------------------------------------------------------------------------------------------|--------|------------------------------------------------------------------|
| [Get-AzureSqlDatabaseServerFirewallRule](https://msdn.microsoft.com/library/azure/dn546731.aspx)    | Server | Returns the current server-level firewall rules                  |
| [New-AzureSqlDatabaseServerFirewallRule](https://msdn.microsoft.com/library/azure/dn546724.aspx)    | Server | Creates a new server-level firewall rule                         |
| [Set-AzureSqlDatabaseServerFirewallRule](https://msdn.microsoft.com/library/azure/dn546739.aspx)    | Server | Updates the properties of an existing server-level firewall rule |
| [Remove-AzureSqlDatabaseServerFirewallRule](https://msdn.microsoft.com/library/azure/dn546727.aspx) | Server | Removes server-level firewall rules                              |

> [AZURE.NOTE] There can be up as much as a five-minute delay for changes to the firewall settings to take effect.

## Troubleshooting the firewall

Consider the following points when access to the Microsoft Azure SQL Database service does not behave as you expect:

- **Local firewall configuration:** Before your computer can access Azure SQL Database, you may need to create a firewall exception on your computer for TCP port 1433. 

- **Network address translation (NAT):** Due to NAT, the IP address used by your computer to connect to Azure SQL Database may be different then the IP address shown in your computer IP configuration settings. To view the IP address your computer is using to connect to Azure, log in to the Management Portal and navigate to the **Configure** tab on the server that hosts your database. Under the **Allowed IP Addresses** section, the **Current Client IP Address** is displayed. Click **Add** to the **Allowed IP Addresses **to allow this computer to access the server.

- **Changes to the allow list have not taken effect yet:** There may as much as a five minute delay for changes to the Azure SQL Database firewall configuration to take effect.

- **The login is not authorized or an incorrect password was used:** If a login does not have permissions on the Azure SQL Database server or the password used is incorrect, the connection to the Azure SQL Database server will be denied. Creating a firewall setting only provides clients with an opportunity to attempt connecting to your server; each client must provide the necessary security credentials. For more information about preparing logins, see Managing Databases, Logins, and Users in Azure SQL Database.

- **Dynamic IP address:** If you have an Internet connection with dynamic IP addressing and you are having trouble getting through the firewall, you could try one of the following solutions:

 - Ask your Internet Service Provider (ISP) for the IP address range assigned to your client computers that will access the Azure SQL Database server, and then add the IP address range as a firewall rule. 

 - Get static IP addressing instead for your client computers, and then add the IP addresses as firewall rules.

## See also

[How to: Configure Firewall Settings (Azure SQL Database)](sql-database-configure-firewall-settings.md)

<!--Image references-->
[1]: ./media/sql-database-firewall-configure/sqldb-firewall-1.png
