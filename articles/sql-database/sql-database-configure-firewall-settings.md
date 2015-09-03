<properties
	pageTitle="How to: Configure Firewall Settings | Microsoft Azure"
	description="Configure the firewall for IP addresses that access Azure SQL databases."
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
	ms.date="09/02/2015"
	ms.author="rickbyh"/>


# How to: Configure firewall settings on SQL Database

 Microsoft Azure SQL Database uses firewall rules to allow connections to your servers and databases. You can define server-level and database-level firewall settings for the master or a user database in your Azure SQL Database server to selectively allow access to the database.

**Important**  To allow applications from Azure to connect to your database server, Azure connections must be enabled. For more information about firewall rules and enabling connections from Azure, see [Azure SQL Database Firewall](sql-database-firewall-configure.md)


## Server-Level Firewall Rules

Server-level firewall rules can be created and managed through the Microsoft Azure Management Portal, Transact-SQL, Azure PowerShell, or REST API.

### Manage Server-Level Firewall Rules through the New Azure Portal
1. Visit the Azure Portal at https://portal.azure.com and sign-in with your Azure Administrator or Contributor account.
2. On the left banner, click BROWSE ALL, scroll down, and then click SQL servers.
3. Click the server that you want to configure firewall rules for in the list of SQL Server displayed.

	![firewall][1]

4. In the server blade, click Settings at the top of the blade, and then click Firewall to open the Firewall Settings blade for the server.
5. Add or change a firewall rule.

	* To add the IP address of the current computer, click **Add Client IP** at the top of the blade.
	* To add additional IP addresses, type in the **RULE NAME**, **START IP** address, and **END IP** address.
	* To modify an existing rule, click and change any of the fields in the rule.
	* To delete an existing rule, click the rule, click the ellipsis (…) at the end of the row, and then click **Delete**.
6. Click Save at the top of the Firewall Settings blade to save the changes.
	![firewall blade][2] 

## Manage Server-Level Firewall Rules through Management Portal 

1. From the Management Portal, click **SQL Databases**. All databases and their corresponding servers are listed here.
2. Click **Servers** at the top of the page.
3. Click the arrow beside the server for which you want to manage firewall rules.
4. Click **Configure** at the top of the page.

	*  To add the current computer, click Add to the Allowed IP Addresses.
	*  To add additional IP addresses, type in the Rule Name, Start IP Address, and End IP Address.
	*  To modify an existing rule, click any of the fields in the rule and modify.
	*  To delete an existing rule, hover over the rule until the X appears at the end of the row. Click X to remove the rule.
5. Click **Save** at the bottom of the page to save the changes.

## Manage Server-Level Firewall Rules through Transact-SQL

1. Launch a query window through the Management Portal or through SQL Server Management Studio.
2. Verify you are connected to the master database.
3. Server-level firewall rules can be selected, created, updated, or deleted from within the query window.
4. To create or update server-level firewall rules, execute the sp_set_firewall rule stored procedure. The following example enables a range of IP addresses on the server Contoso.<br/>Start by seeing what rules already exist.

		SELECT * FROM sys.database_firewall_rules ORDER BY name;

	Next, add a firewall rule.

		EXECUTE sp_set_firewall_rule @name = N'ContosoFirewallRule',
			@start_ip_address = '192.168.1.1', @end_ip_address = '192.168.1.10'

	To delete a server-level firewall rule, execute the sp_delete_firewall_rule stored procedure. The following example deletes the rule named ContosoFirewallRule.
 
		EXECUTE sp_delete_firewall_rule @name = N'ContosoFirewallRule'
 
## Manage Server-Level Firewall Rules through Azure PowerShell
1. Launch Azure PowerShell.
2. Server-level firewall rules can be created, updated, and deleted using Azure PowerShell. 

	To create a new server-level firewall rule, execute the New-AzureSqlDatabaseServerFirewallRule cmdlet. The following example enables a range of IP addresses on the server Contoso.
 
		New-AzureSqlDatabaseServerFirewallRule –StartIPAddress 192.168.1.1 –EndIPAddress 192.168.1.10 –RuleName ContosoFirewallRule –ServerName Contoso
 
	To modify an existing server-level firewall rule, execute the Set-AzureSqlDatabaseServerFirewallRule cmdlet. The following example changes the range of acceptable IP addresses for the rule named ContosoFirewallRule.
 
		Set-AzureSqlDatabaseServerFirewallRule –StartIPAddress 192.168.1.4 –EndIPAddress 192.168.1.10 –RuleName ContosoFirewallRule –ServerName Contoso

	To delete an existing server-level firewall rule, execute the Remove-AzureSqlDatabaseServerFirewallRule cmdlet. The following example deletes the rule named ContosoFirewallRule.

		Remove-AzureSqlDatabaseServerFirewallRule –RuleName ContosoFirewallRule –ServerName Contoso
 
## Manage Server-Level Firewall Rules through REST API
1. Managing firewall rules through REST API must be authenticated. For information, see Authenticating Service Management Requests.
2. Server-level rules can be created, updated, or deleted using REST API

	To create or update a server-level firewall rule, execute the POST method using the following:
 
		https://management.core.windows.net:8443/{subscriptionId}/services/sqlservers/servers/Contoso/firewallrules
	
	Request Body

		<ServiceResource xmlns="http://schemas.microsoft.com/windowsazure">
		  <Name>ContosoFirewallRule</Name>
		  <StartIPAddress>192.168.1.4</StartIPAddress>
		  <EndIPAddress>192.168.1.10</EndIPAddress>
		</ServiceResource>
 

	To remove an existing server-level firewall rule, execute the DELETE method using the following:
	 
		https://management.core.windows.net:8443/{subscriptionId}/services/sqlservers/servers/Contoso/firewallrules/ContosoFirewallRule
 
## Database-Level Firewall Rules

1. After creating a server-level firewall for your IP address, launch a query window through the Management Portal or through SQL Server Management Studio.
2. Connect to the database for which you want to create a database-level firewall rule.

	To create a new or update an existing database-level firewall rule, execute the sp_set_database_firewall_rule stored procedure. The following example creates a new firewall rule named ContosoFirewallRule.
 
		EXEC sp_set_database_firewall_rule @name = N'ContosoFirewallRule', @start_ip_address = '192.168.1.11', @end_ip_address = '192.168.1.11'
 
	To delete an existing database-level firewall rule, execute the sp_delete_database_firewall_rule stored procedure. The following example deletes the rule named ContosoFirewallRule.
 
		EXEC sp_delete_database_firewall_rule @name = N'ContosoFirewallRule'


## Manage firewall rules using the Service Management REST API

* [Create Firewall Rule](https://msdn.microsoft.com/library/azure/dn505712.aspx)
* [Delete Firewall Rule](https://msdn.microsoft.com/library/azure/dn505706.aspx)
* [Get Firewall Rule](https://msdn.microsoft.com/library/azure/dn505698.aspx)
* [List Firewall Rules](https://msdn.microsoft.com/library/azure/dn505715.aspx)

## Manage firewall rules using PowerShell

* [New-AzureSqlDatabaseServerFirewallRule](https://msdn.microsoft.com/library/azure/dn546724.aspx)
* [Remove-AzureSqlDatabaseServerFirewallRule](https://msdn.microsoft.com/library/azure/dn546727.aspx)
* [Set-AzureSqlDatabaseServerFirewallRule](https://msdn.microsoft.com/library/azure/dn546739.aspx)
* [Get-AzureSqlDatabaseServerFirewallRule](https://msdn.microsoft.com/library/azure/dn546731.aspx)
 
## Next steps

For a tutorial on creating a database, see [Create your first Azure SQL Database](sql-database-get-started.md).
For help in connecting to an Azure SQL database from open source or third-party applications, see [Guidelines for Connecting to Azure SQL Database Programmatically](https://msdn.microsoft.com/library/azure/ee336282.aspx).
To understand how to navigate to databases see [Managing Databases and Logins in Azure SQL Database](https://msdn.microsoft.com/library/azure/ee336235.aspx).

<!--Image references-->
[1]: ./media/sql-database-configure-firewall-settings/AzurePortalBrowseForFirewall.png
[2]: ./media/sql-database-configure-firewall-settings/AzurePortalFirewallSettings.png
<!--anchors-->

 
