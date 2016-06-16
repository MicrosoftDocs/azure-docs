<properties
	pageTitle="Configure an SQL Database server-level firewall rule | Microsoft Azure"
	description="Learn how to configure the firewall for IP addresses that access Azure SQL server."
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
	ms.date="06/10/2016"
	ms.author="rickbyh;carlrab"/>


# Configure an Azure SQL Database server-level firewall rule using the Azure Portal


> [AZURE.SELECTOR]
- [Overview](sql-database-firewall-configure.md)
- [Azure Portal](sql-database-configure-firewall-settings.md)
- [TSQL](sql-database-configure-firewall-settings-tsql.md)
- [PowerShell](sql-database-configure-firewall-settings-powershell.md)
- [REST API](sql-database-configure-firewall-settings-rest.md)

Azure SQL server uses firewall rules to allow connections to your servers and databases. You can define server-level and database-level firewall settings for the master or a user database in your Azure SQL server logical server to selectively allow access to the database. This topic discusses server-level firewall rules.

> [AZURE.IMPORTANT] To allow applications from Azure to connect to your Azure SQL server, Azure connections must be enabled. To understand how the firewall rules work, see [How to configure an Azure SQL server firewall \- overview](sql-database-firewall-configure.md). You may have to open some additional TCP ports if you are making connections inside the Azure cloud boundary. For more information, see the **V12 of SQL Database: Outside vs inside** section of [Ports beyond 1433 for ADO.NET 4.5 and SQL Database V12](sql-database-develop-direct-route-ports-adonet-v12.md)

**Recommendation:** Use server-level firewall rules for administrators and when you have many databases that have the same access requirements and you don't want to spend time configuring each database individually. Microsoft recommends using database-level firewall rules whenever possible to enhance security and to make your database more portable.

[AZURE.INCLUDE [Create SQL Database database](../../includes/sql-database-create-new-server-firewall-portal.md)]

## Manage existing server-level firewall rules through the Azure portal

Repeat the steps to manage the server-level firewall rules.

- To add the current computer, click Add client IP.
- To add additional IP addresses, type in the Rule Name, Start IP Address, and End IP Address.
- To modify an existing rule, click any of the fields in the rule and modify.
- To delete an existing rule, hover over the rule until the X appears at the end of the row. Click X to remove the rule.

Click **Save** to save the changes.

## Next steps

For a how to article on how to use Transact-SQL to create server-level and database-level firewall rules, see [Configure Azure SQL Database server-level and database-level firewall rules using T-SQL](sql-database-configure-firewall-settings-tsql.md). 

For how to articles on creating server-level firewall rules using other methods, see: 

- [Configure Azure SQL Database server-level firewall rules using PowerShell](sql-database-configure-firewall-settings-powershell.md)
- [Configure Azure SQL Database server-level firewall rules using the REST API](sql-database-configure-firewall-settings-rest.md)

For a tutorial on creating a database, see [Create a SQL database in minutes using the Azure portal](sql-database-get-started.md).
For help in connecting to an Azure SQL database from open source or third-party applications, see [Client quick-start code samples to SQL Database](https://msdn.microsoft.com/library/azure/ee336282.aspx).
To understand how to navigate to databases see [Manage database access and login security](https://msdn.microsoft.com/library/azure/ee336235.aspx).


## Additional resources

- [Securing your database](sql-database-security.md)
- [Security Center for SQL Server Database Engine and Azure SQL Database](https://msdn.microsoft.com/library/bb510589)


<!--Image references-->
[1]: ./media/sql-database-configure-firewall-settings/AzurePortalBrowseForFirewall.png
[2]: ./media/sql-database-configure-firewall-settings/AzurePortalFirewallSettings.png
<!--anchors-->

 
