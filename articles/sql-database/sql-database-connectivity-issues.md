<properties 
	pageTitle="Azure SQL Database connectivity issues" 
	description="Identifying and determining SQL Database connection failures." 
	services="sql-database" 
	documentationCenter="" 
	authors="stevestein" 
	manager="jeffreyg" 
	editor=""/>

<tags 
	ms.service="sql-database" 
	ms.devlang="NA" 
	ms.workload="data-management" 
	ms.topic="article" 
	ms.tgt_pltfrm="NA" 
	ms.date="07/24/2015" 
	ms.author="sstein"/>


# SQL Database Connection Issues

This article provides an overview on how to use various troubleshooters when you cannot connect to Azure SQL Database.


## Determine if the connectivity issue is specific to an individual application, or if you  simply cannot connect to the database?

Use SQL Server Management Studio or SQLCMD.EXE to verify that you can connect to the database.

- For directions on connecting to SQL Database with SQL Server Management Studio (SSMS), see [How to connect to an Azure SQL Database with SSMS](sql-database-connect-to-database.md).
- For directions on connecting to SQL Database with SQLCMD, see [How to: Connect to Azure SQL Database Using sqlcmd](https://msdn.microsoft.com/library/azure/ee336280.aspx).



## Is the application trying to connect to SQL Database running in Azure (for example, is the application that is failing to connect to the database a Cloud Service or Web App)?

Ensure that firewall rule to allow all Azure services is enabled for the server/database.

- For information about firewall rules and enabling connections from Azure, see [Azure SQL Database Firewall](https://msdn.microsoft.com/library/azure/ee621782.aspx#ConnectingFromAzure).



## Is the application trying to connect to SQL Database from a private network?

Ensure that firewall rules to allow access from specific network(s) is enabled for the server/database.

- For general information about firewall rules, see [Azure SQL Database Firewall](https://msdn.microsoft.com/library/azure/ee621782.aspx).
- For directions on setting up firewall rules, see [How to: Configure Firewall Settings (Azure SQL Database)](https://msdn.microsoft.com/library/azure/jj553530.aspx).


## If the firewall rules are configured correctly, then try the [Troubleshoot Microsoft Azure SQL Database connectivity](https://support2.microsoft.com/common/survey.aspx?scid=sw;en;3844&showpage=1) guided walkthrough.

The above support article provides help for the following SQL Database connectivity issues:

- Cannot open server connection due to firewall settings 
- The server was not found or was not accessible 
- Unable to login to the server 
- Connection timeout errors 
- Transient errors 
- Connection Terminated due to hitting some system-defined limit 
- Connections failing from SQL Server Management Studio (SSMS) 


## Additional Information

- For additional information about connecting to SQL Database, see [Guidelines for Connecting to Azure SQL Database Programmatically](https://msdn.microsoft.com/library/azure/ee336282.aspx).   

- Details about specific connection errors can be found in the **Transient faults, Connection-loss errors** section in [Error messages for SQL Database client programs](sql-database-develop-error-messages.md#bkmk_connection_errors).

- Connection event data can be accessed by querying for connectivity events using the [**sys.event_log (Azure SQL Database)**](https://msdn.microsoft.com/library/dn270018.aspx) view.

- Metrics of database connectivity events can be accessed by querying the [**sys.database_connection_stats (Azure SQL Database)**](https://msdn.microsoft.com/library/dn269986.aspx) view.

 