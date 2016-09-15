<properties
	pageTitle="Azure SQL Database server-level firewall rules using the REST API | Microsoft Azure"
	description="Learn how to configure the firewall for IP addresses that access Azure SQL databases."
	services="sql-database"
	documentationCenter=""
	authors="stevestein"
	manager="jhubbard"
	editor=""/>


<tags
	ms.service="sql-database"
	ms.workload="data-management"
	ms.tgt_pltfrm="na"
	ms.devlang="dotnet"
	ms.topic="article" 
	ms.date="08/09/2016"
	ms.author="sstein"/>


#  Configure Azure SQL Database server-level firewall rules using the REST API


> [AZURE.SELECTOR]
- [Overview](sql-database-firewall-configure.md)
- [Azure portal](sql-database-configure-firewall-settings.md)
- [TSQL](sql-database-configure-firewall-settings-tsql.md)
- [PowerShell](sql-database-configure-firewall-settings-powershell.md)
- [REST API](sql-database-configure-firewall-settings-rest.md)


Microsoft Azure SQL Database uses firewall rules to allow connections to your servers and databases. You can define server-level and database-level firewall settings for the master or a user database in your Azure SQL Database server to selectively allow access to the database.

> [AZURE.IMPORTANT] To allow applications from Azure to connect to your database server, Azure connections must be enabled. For more information about firewall rules and enabling connections from Azure, see [Azure SQL Database Firewall](sql-database-firewall-configure.md). If you are making connections inside the Azure cloud boundary, you may have to open some additional TCP ports. For more information, see the **V12 of SQL Database: Outside vs inside** section of [Ports beyond 1433 for ADO.NET 4.5 and SQL Database V12](sql-database-develop-direct-route-ports-adonet-v12.md)


## Manage server-level firewall rules through REST API
1. Managing firewall rules through REST API must be authenticated. For information, see [Developer's guide to authorization with the Azure Resource Manager API](../resource-manager-api-authentication.md).
2. Server-level rules can be created, updated, or deleted using REST API

	To create or update a server-level firewall rule, execute the PUT method using the following:
 
		https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Sql/servers/{server-name}/firewallRules/{rule-name}?api-version={api-version}
	
	Request Body

		{
         "properties": { 
            "startIpAddress": "{start-ip-address}", 
            "endIpAddress": "{end-ip-address}
            }
        } 
 

	To remove an existing server-level firewall rule, execute the DELETE method using the following:
	 
		https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Sql/servers/{server-name}/firewallRules/{rule-name}?api-version={api-version}


## Manage firewall rules using the REST API

* [Create or Update Firewall Rule](https://msdn.microsoft.com/library/azure/mt445501.aspx)
* [Delete Firewall Rule](https://msdn.microsoft.com/library/azure/mt445502.aspx)
* [Get Firewall Rule](https://msdn.microsoft.com/library/azure/mt445503.aspx)
* [List All Firewall Rules](https://msdn.microsoft.com/library/azure/mt604478.aspx)
 
## Next steps

For a how to article on how to use Transact-SQL to create server-level and database-level firewall rules, see [Configure Azure SQL Database server-level and database-level firewall rules using T-SQL](sql-database-configure-firewall-settings-tsql.md). 

For how to articles on creating server-level firewall rules using other methods, see: 

- [Configure Azure SQL Database server-level firewall rules using the Azure portal](sql-database-configure-firewall-settings.md)
- [Configure Azure SQL Database server-level firewall rules using PowerShell](sql-database-configure-firewall-settings-powershell.md)

For a tutorial on creating a database, see [Create a SQL database in minutes using the Azure portal](sql-database-get-started.md).
For help in connecting to an Azure SQL database from open source or third-party applications, see [Client quick-start code samples to SQL Database](https://msdn.microsoft.com/library/azure/ee336282.aspx).
To understand how to navigate to databases, see [Manage database access and login security](https://msdn.microsoft.com/library/azure/ee336235.aspx).


## Additional resources

- [Securing your database](sql-database-security.md)
- [Security Center for SQL Server Database Engine and Azure SQL Database](https://msdn.microsoft.com/library/bb510589)

<!--Image references-->
[1]: ./media/sql-database-configure-firewall-settings/AzurePortalBrowseForFirewall.png
[2]: ./media/sql-database-configure-firewall-settings/AzurePortalFirewallSettings.png
<!--anchors-->

 
