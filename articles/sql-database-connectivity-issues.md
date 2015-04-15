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
	ms.date="04/14/2015" 
	ms.author="sstein"/>


# SQL Database Connection Failures

This article provides an overview on how to use various troubleshooters when you cannot connect to Azure SQL Database.


1. Determine if the connectivity issue is specific to an application or all application(s) connecting to the database
	- Use SQL Server Management Studio or SQLCMD.EXE to verify connectivity to the database from a different application   
2. Is the application running in Azure (Cloud Services or Web Role or Web Site)?
	- Ensure that firewall rule to allow all Azure services is enabled for the server/database 
3. Is the application running outside of Azure (accessing SQL Database from a private network)?
	- Ensure that firewall rule to allow access from specific network(s) is enabled for the server/database
4. If the firewall configuration is accurate then proceed with the [Connectivity Troubleshooter](https://support2.microsoft.com/common/survey.aspx?scid=sw;en;3844&showpage=1)

Guidelines on how to connect to SQL Database using various libraries and performing retry logic can be found [here](https://msdn.microsoft.com/library/azure/ee336282.aspx).   

 
