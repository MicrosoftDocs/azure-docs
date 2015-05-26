<properties 
	pageTitle="SQL Database Auditing and Dynamic Data Masking Power Shell | Azure" 
	description="SQL Database Auditing and Dynamic Data Masking Power Shell" 
	services="sql-database" 
	documentationCenter="" 
	authors="jeffgoll" 
	manager="jeffreyg" 
	editor=""/>

<tags 
	ms.service="sql-database" 
	ms.workload="data-management" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/23/2015" 
	ms.author="jeffreyg"/>
 
# SQL Database Auditing and Dynamic Data Masking Power Shell 


###Getting Started

1. If not already installed, download and run the [Power Shell install configuration](http://azure.microsoft.com/en-us/documentation/articles/powershell-install-configure/).
2. Run Power Shell by typing AzurePowerShell in the windows start page.
3. Enter the command: Add-AzureAccount that will pop-up an login window, enter your username / password.
4. Enter the command: Select-AzureSubscription and then enter your subscription that you want to use (if you have several)

Now you can start working with the auditing or the Dynamic Data Masking cmdlets


###Names for examples in this article 
You have the following setup:
1.	Resource group name: Group-95
2.	Server name: mainserver
3.	Database name: mainDB
4.	A table called myTable, in which a column called myColumn
5.	Storage account name: mymainstorage


###Auditing policy life-cycle:

Set-AzureSqlDatabaseAuditingPolicy -ResourceGroupName "Group-95" -ServerName mainserver -DatabaseName mainDB -StorageAccountName mymainstorage
You can see the results of it by calling:
Get-AzureSqlDatabaseAuditingPolicy -ResourceGroupName "Group-95" -ServerName mainserver -DatabaseName mainDB
See here:

![][1]

Setup server policy:
At some point, you’d like to setup a server policy, for all the DBs under that server, you can call Set-AzureSqlDatabaseServerAuditingPolicy (note the PassThru switch that emits the output of the cmdlet)
Set-AzureSqlDatabaseServerAuditingPolicy -ResourceGroupName "Group-95" -ServerName mainserver -StorageAccountName mymainstorage -EventType DataAccess -PassThru
See here:
  
![][2]

Use-server:
Once you’re happy from the server policy, you can wire the database to use its server’s policy, just call Use-AzureSqlDatabaseServerAuditingPolicy:

![][3]

Now you have an Azure SQL database server for which a default auditing policy is defined, and a database that uses that policy

###Data masking life-cycle:
In order to use the dynamic data masking in a specific database feature, you first need to define a dynamic data masking policy for that database, this is done using the call Set-AzureSqlDatabaseDataMaskingPolicy, as can be seen here:
 
![][4]

Once a policy is defined, you can manage the lifecycle of data masking rules. Let’s start with defining one, using the call to New-AzureSqlDatabaseDataMaskingRule, and after that view its properties using the call to Get-AzureSqlDatabaseDataMaskingRule, as can be seen below:

![][5]

We can modify the rule, it is done by calling Set-AzureSqlDatabaseDataMaskingRule

![][6]

Last, but not least, you can also delete a rule – just call Remove-AzureSqlDatabaseDataMaskingRule (which will prompt for approval), see here:

![][7]

<!--Image references-->
[1]: ./media/sql-database-auditing-and-dynamic-data-masking-PowerShell/Get-AzureSqlDatabaseAuditingPolicy-Example.png
[2]: ./media/sql-database-auditing-and-dynamic-data-masking-PowerShell/Set-AzureSqlDatabaseAuditingPolicy-Example.png
[3]: ./media/sql-database-auditing-and-dynamic-data-masking-PowerShell/Use-AzureSqlDatabaseServerAuditingPolicy-Example.png
[4]: ./media/sql-database-auditing-and-dynamic-data-masking-PowerShell/SetAzureSqlDatabaseDataMaskingPolicy-Example.png
[5]: ./media/sql-database-auditing-and-dynamic-data-masking-PowerShell/New-AzureSqlDatabaseDataMaskingRule-Example.png
[6]: ./media/sql-database-auditing-and-dynamic-data-masking-PowerShell/Set-AzureSqlDatabaseDataMaskingRule-Example.png
[7]: ./media/sql-database-auditing-and-dynamic-data-masking-PowerShell/Remove-AzureSqlDatabaseDataMaskingRule-Example.png

