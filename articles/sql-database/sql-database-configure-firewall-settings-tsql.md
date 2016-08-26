<properties
	pageTitle="Azure SQL Database server-level and database-level firewall rules using T-SQL | Microsoft Azure"
	description="Learn how to configure the firewall for IP addresses that access Azure SQL databases."
	services="sql-database"
	documentationCenter=""
	authors="BYHAM"
	manager="jhubbard"
	editor=""/>


<tags
	ms.service="sql-database"
	ms.workload="data-management"
	ms.tgt_pltfrm="na"
	ms.devlang="dotnet"
	ms.topic="article" 
	ms.date="06/15/2016"
	ms.author="rickbyh"/>


# Configure Azure SQL Database server-level and database-level firewall rules using T-SQL


> [AZURE.SELECTOR]
- [Overview](sql-database-firewall-configure.md)
- [Azure Portal](sql-database-configure-firewall-settings.md)
- [TSQL](sql-database-configure-firewall-settings-tsql.md)
- [PowerShell](sql-database-configure-firewall-settings-powershell.md)
- [REST API](sql-database-configure-firewall-settings-rest.md)


Microsoft Azure SQL Database uses firewall rules to allow connections to your servers and databases. You can define server-level and database-level firewall settings for the master or a user database in your Azure SQL Database server to selectively allow access to the database.

> [AZURE.IMPORTANT] To allow applications from Azure to connect to your database server, Azure connections must be enabled. For more information about firewall rules and enabling connections from Azure, see [Azure SQL Database Firewall](sql-database-firewall-configure.md). You may have to open some additional TCP ports if you are making connections inside the Azure cloud boundary. For more information, see the **V12 of SQL Database: Outside vs inside** section of [Ports beyond 1433 for ADO.NET 4.5 and SQL Database V12](sql-database-develop-direct-route-ports-adonet-v12.md)


## Manage server-level firewall rules through Transact-SQL

Only the server-level principal login or Azure Active Directory administrator can create a server-level firewall rule by using Transact-SQL.

1. Launch a query window and connect to the virtual master database by using SQL Server Management Studio.
2. Server-level firewall rules can be selected, created, updated, or deleted from within the query window.
3. To create or update server-level firewall rules, execute the sp_set_firewall rule stored procedure. The following example enables a range of IP addresses on the server Contoso.<br/>Start by seeing what rules already exist.

		SELECT * FROM sys.firewall_rules ORDER BY name;

	Next, add a firewall rule.

		EXECUTE sp_set_firewall_rule @name = N'ContosoFirewallRule',
			@start_ip_address = '192.168.1.1', @end_ip_address = '192.168.1.10'

	To delete a server-level firewall rule, execute the sp_delete_firewall_rule stored procedure. The following example deletes the rule named ContosoFirewallRule.
 
		EXECUTE sp_delete_firewall_rule @name = N'ContosoFirewallRule'
 
 For more information on these stored procedures, see [sp_set_firewall_rule](https://msdn.microsoft.com/library/dn270017.aspx) and [sp_delete_firewall_rule](https://msdn.microsoft.com/library/dn270024.aspx).

## Database-level firewall rules

Only a database user with the **CONTROL** permission on the database (such as the database owner) can create a database-level firewall rule.

1. After creating a server-level firewall for your IP address, launch a query window through the Classic Portal or through SQL Server Management Studio.
2. Connect to the database for which you want to create a database-level firewall rule.

	To create a new or update an existing database-level firewall rule, execute the sp_set_database_firewall_rule stored procedure. The following example creates a new firewall rule named ContosoFirewallRule.
 
		EXEC sp_set_database_firewall_rule @name = N'ContosoFirewallRule', 
		    @start_ip_address = '192.168.1.11', @end_ip_address = '192.168.1.11'
 
	To delete an existing database-level firewall rule, execute the sp_delete_database_firewall_rule stored procedure. The following example deletes the rule named ContosoFirewallRule.
 
		EXEC sp_delete_database_firewall_rule @name = N'ContosoFirewallRule'

For more information on these stored procedures, see [sp_set_database_firewall_rule](https://msdn.microsoft.com/library/dn270010.aspx) and [sp_delete_database_firewall_rule](https://msdn.microsoft.com/library/dn270030.aspx).

## Next steps

For how to articles on creating server-level firewall rules using other methods, see: 

- [Configure Azure SQL Database server-level firewall rules using the Azure Portal](sql-database-configure-firewall-settings.md)
- [Configure Azure SQL Database server-level firewall rules using PowerShell](sql-database-configure-firewall-settings-powershell.md)
- [Configure Azure SQL Database server-level firewall rules using the REST API](sql-database-configure-firewall-settings-rest.md)

For a tutorial on creating a database, see [Create a SQL database in minutes using the Azure portal](sql-database-get-started.md).
For help in connecting to an Azure SQL database from open source or third-party applications, see [Client quick-start code samples to SQL Database](https://msdn.microsoft.com/library/azure/ee336282.aspx).
To understand how to navigate to databases see [Manage database access and login security](https://msdn.microsoft.com/library/azure/ee336235.aspx).


## Additional resources

- [Securing your database](sql-database-security.md)
- [Security Center for SQL Server Database Engine and Azure SQL Database](https://msdn.microsoft.com/library/bb510589)