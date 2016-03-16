<properties
	pageTitle="How to: Configure firewall settings | Microsoft Azure"
	description="Learn how to configure the firewall for IP addresses that access Azure SQL databases."
	services="sql-database"
	documentationCenter=""
	authors="BYHAM"
	manager="jeffreyg"
	editor=""/>


<tags
	ms.service="sql-database"
	ms.workload="data-management"
	ms.tgt_pltfrm="na"
	ms.devlang="dotnet"
	ms.topic="article" 
	ms.date="03/16/2016"
	ms.author="rickbyh"/>


# How to: Configure firewall settings on SQL Database using the Azure Portal


> [AZURE.SELECTOR]
- [Azure Portal](sql-database-configure-firewall-settings.md)
- [TSQL](sql-database-configure-firewall-settings-tsql.md)
- [PowerShell](sql-database-configure-firewall-settings-powershell.md)
- [REST API](sql-database-configure-firewall-settings-rest.md)


Azure SQL server uses firewall rules to allow connections to your servers and databases. You can define server-level and database-level firewall settings for the master or a user database in your Azure SQL server logical server to selectively allow access to the database.

> [AZURE.IMPORTANT] To allow applications from Azure to connect to your Azure SQL server, Azure connections must be enabled. To understand how the firewall rules work, see [Azure SQL Database Firewall](sql-database-firewall-configure.md). You may have to open some additional TCP ports if you are making connections inside the Azure cloud boundary. For more information, see the **V12 of SQL Database: Outside vs inside** section of [Ports beyond 1433 for ADO.NET 4.5 and SQL Database V12](sql-database-develop-direct-route-ports-adonet-v12.md)


### Add a server-level firewall rule through the Azure portal


[AZURE.INCLUDE [sql-database-include-ip-address-22-v12portal](../../includes/sql-database-include-ip-address-22-v12portal.md)]


## Manage existing server-level firewall rules through the Azure portal

Repeat the steps to manage the server-level firewall rules.

- To add the current computer, click Add client IP.
- To add additional IP addresses, type in the Rule Name, Start IP Address, and End IP Address.
- To modify an existing rule, click any of the fields in the rule and modify.
- To delete an existing rule, hover over the rule until the X appears at the end of the row. Click X to remove the rule.

Click **Save** to save the changes.


## Next steps

A server firewall rule affects all SQL Databases on the Azure SQL Server. To configure a database level firewall rule that will affect only a single database instead, see [sp_set_firewall_rule (Azure SQL Database)](https://msdn.microsoft.com/library/dn270017.aspx").

For a tutorial on creating a database, see [Create your first Azure SQL Database](sql-database-get-started.md).
For help in connecting to an Azure SQL database from open source or third-party applications, see [Guidelines for Connecting to Azure SQL Database Programmatically](https://msdn.microsoft.com/library/azure/ee336282.aspx).
To understand how to navigate to databases see [Managing Databases and Logins in Azure SQL Database](https://msdn.microsoft.com/library/azure/ee336235.aspx).

<!--Image references-->
[1]: ./media/sql-database-configure-firewall-settings/AzurePortalBrowseForFirewall.png
[2]: ./media/sql-database-configure-firewall-settings/AzurePortalFirewallSettings.png
<!--anchors-->

 
