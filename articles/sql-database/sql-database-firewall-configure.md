<properties
   pageTitle="Configure a SQL server firewall overview | Microsoft Azure"
   description="Learn how to configure a SQL database firewall with server-level and database-level firewall rules to manage access."
   keywords="database firewall"
   services="sql-database"
   documentationCenter=""
   authors="BYHAM"
   manager="jhubbard"
   editor="cgronlun"
   tags=""/>

<tags
   ms.service="sql-database"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="data-management"
   ms.date="06/22/2016"
   ms.author="rickbyh"/>

# Configure Azure SQL Database firewall rules \- overview


> [AZURE.SELECTOR]
- [Overview](sql-database-firewall-configure.md)
- [Azure Portal](sql-database-configure-firewall-settings.md)
- [TSQL](sql-database-configure-firewall-settings-tsql.md)
- [PowerShell](sql-database-configure-firewall-settings-powershell.md)
- [REST API](sql-database-configure-firewall-settings-rest.md)


Microsoft Azure SQL Database provides a relational database service for Azure and other Internet-based applications. To help protect your data, firewalls prevent all access to your database server until you specify which computers have permission. The firewall grants access to databases based on the originating IP address of each request.

To configure your firewall, you create firewall rules that specify ranges of acceptable IP addresses. You can create firewall rules at the server and database levels.

- **Server-level firewall rules:** These rules enable clients to access your entire Azure SQL server, that is, all the databases within the same logical server. These rules are stored in the **master** database. Server-level firewall rules can be configured by using the portal or by using Transact-SQL statements.
- **Database-level firewall rules:** These rules enable clients to access individual databases within your Azure SQL Database server. These rules are created per database and are stored in the individual databases (including **master**). These rules can be helpful in restricting access to certain (secure) databases within the same logical server. Database-level firewall rules can only be configured by using Transact-SQL statements.

**Recommendation:** Microsoft recommends using database-level firewall rules whenever possible to enhance security and to make your database more portable. Use server-level firewall rules for administrators and when you have many databases that have the same access requirements and you don't want to spend time configuring each database individually.


## Firewall overview

Initially, all Transact-SQL access to your Azure SQL server is blocked by the firewall. In order to begin using your Azure SQL server, you must go to the Azure Portal and specify one or more server-level firewall rules that enable access to your Azure SQL server. Use the firewall rules to specify which IP address ranges from the Internet are allowed, and whether or not Azure applications can attempt to connect to your Azure SQL server.

However, if you want to selectively grant access to just one of the databases in your Azure SQL server, you must create a database-level rule for the required database with an IP address range that is beyond the IP address range specified in the server-level firewall rule, and ensure that the IP address of the client falls in the range specified in the database-level rule.

Connection attempts from the Internet and Azure must first pass through the firewall before they can reach your Azure SQL server or SQL Database, as shown in the following diagram.

   ![Diagram describing firewall configuration.][1]

## Connecting from the Internet

When a computer attempts to connect to your database server from the Internet, the firewall checks the originating IP address of the request against the full set of server-level and (if required) database-level firewall rules:

- If the IP address of the request is within one of the ranges specified in the server-level firewall rules, the connection is granted to your Azure SQL Database server.

- If the IP address of the request is not within one of the ranges specified in the server-level firewall rule, the database-level firewall rules are checked. If the IP address of the request is within one of the ranges specified in the database-level firewall rules, the connection is granted only to the database that has a matching database-level rule.

- If the IP address of the request is not within the ranges specified in any of the server-level or database-level firewall rules, the connection request fails.

> [AZURE.NOTE] To access Azure SQL Database from your local computer, ensure the firewall on your network and local computer allows outgoing communication on TCP port 1433.


## Connecting from Azure

When an application from Azure attempts to connect to your database server, the firewall verifies that Azure connections are allowed. A firewall setting with starting and ending address equal to 0.0.0.0 indicates these connections are allowed. If the connection attempt is not allowed, the request does not reach the Azure SQL Database server.

> [AZURE.IMPORTANT] This option configures the firewall to will allow all connections from Azure including connections from the subscriptions of other customers. When selecting this option, make sure your login and user permissions limit access to only authorized users.

You can enable connections from Azure in two ways:

- In the [Microsoft Azure Portal](https://portal.azure.com/), select the checkbox **Allow azure services to access server** when creating a new server.

- In the [Classic Portal](http://go.microsoft.com/fwlink/p/?LinkID=161793), from the **Configure** tab on a server, under the **Allowed Services** section, click **Yes** for **Microsoft Azure Services**.

## Creating the first server-level firewall rule

The first server-level firewall setting can be created using the [Azure Portal](https://portal.azure.com/) or programmatically using the REST API or Azure PowerShell. Subsequent server-level firewall rules can be created and managed using these methods, as well as through Transact-SQL. For more information on server-level firewall rules, see [How to: Configure an Azure SQL server firewall using the Azure Portal](sql-database-configure-firewall-settings.md).

## Creating database-level firewall rules

After you have configured the first server-level firewall, you may want to restrict access to certain databases. If you specify an IP address range in the database-level firewall rule that is outside the range specified in the server-level firewall rule, only those clients that have IP addresses in the database-level range can access the database. You can have a maximum of 128 database-level firewall rules for a database. Database-level firewall rules for master and user databases can be created and managed through Transact-SQL. For more information on configuring database-level firewall rules, see [sp_set_database_firewall_rule (Azure SQL Databases)](https://msdn.microsoft.com/library/dn270010.aspx).

## Programmatically managing firewall rules

In addition to the Azure Portal, firewall rules can be managed programmatically using Transact-SQL, REST API, and Azure PowerShell. The tables below describe the set of commands available for each method.


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

## Troubleshooting the database firewall

Consider the following points when access to the Microsoft Azure SQL Database service does not behave as you expect:

- **Local firewall configuration:** Before your computer can access Azure SQL Database, you may need to create a firewall exception on your computer for TCP port 1433. You may have to open additional ports if you are making connections inside the Azure cloud boundary. For more information, see the **V12 of SQL Database: Outside vs inside** section of [Ports beyond 1433 for ADO.NET 4.5 and SQL Database V12](sql-database-develop-direct-route-ports-adonet-v12.md).

- **Network address translation (NAT):** Due to NAT, the IP address used by your computer to connect to Azure SQL Database may be different then the IP address shown in your computer IP configuration settings. To view the IP address your computer is using to connect to Azure, log in to the Portal and navigate to the **Configure** tab on the server that hosts your database. Under the **Allowed IP Addresses** section, the **Current Client IP Address** is displayed. Click **Add** to the **Allowed IP Addresses **to allow this computer to access the server.

- **Changes to the allow list have not taken effect yet:** There may as much as a five minute delay for changes to the Azure SQL Database firewall configuration to take effect.

- **The login is not authorized or an incorrect password was used:** If a login does not have permissions on the Azure SQL Database server or the password used is incorrect, the connection to the Azure SQL Database server will be denied. Creating a firewall setting only provides clients with an opportunity to attempt connecting to your server; each client must provide the necessary security credentials. For more information about preparing logins, see Managing Databases, Logins, and Users in Azure SQL Database.

- **Dynamic IP address:** If you have an Internet connection with dynamic IP addressing and you are having trouble getting through the firewall, you could try one of the following solutions:

 - Ask your Internet Service Provider (ISP) for the IP address range assigned to your client computers that will access the Azure SQL Database server, and then add the IP address range as a firewall rule.

 - Get static IP addressing instead for your client computers, and then add the IP addresses as firewall rules.

## Next steps

For how to articles on creating server-level and database-level firewall rules, see:

- [Configure Azure SQL Database server-level firewall rules using the Azure Portal](sql-database-configure-firewall-settings.md)
- [Configure Azure SQL Database server-level and database-level firewall rules using T-SQL](sql-database-configure-firewall-settings-tsql.md)
- [Configure Azure SQL Database server-level firewall rules using PowerShell](sql-database-configure-firewall-settings-powershell.md)
- [Configure Azure SQL Database server-level firewall rules using the REST API](sql-database-configure-firewall-settings-rest.md)

For a tutorial on creating a database, see [Create a SQL database in minutes using the Azure portal](sql-database-get-started.md).
For help in connecting to an Azure SQL database from open source or third-party applications, see [Client quick-start code samples to SQL Database](https://msdn.microsoft.com/library/azure/ee336282.aspx).
To understand how to navigate to databases see [Manage database access and login security](https://msdn.microsoft.com/library/azure/ee336235.aspx).



## Additional resources

- [Securing your database](sql-database-security.md)
- [Security Center for SQL Server Database Engine and Azure SQL Database](https://msdn.microsoft.com/library/bb510589)

<!--Image references-->
[1]: ./media/sql-database-firewall-configure/sqldb-firewall-1.png
