<properties 
	title="How to add a users to an elastic database pool" 
	pageTitle="How to add a users to an elastic database pool" 
	description="You must add a user with privileges to each db in the pool" 
	metaKeywords="azure sql database elastic databases credentials" 
	services="sql-database" documentationCenter=""  
	manager="jeffreyg" 
	authors="sidneyh"/>

<tags 
	ms.service="sql-database" 
	ms.workload="sql-database" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/20/2015" 
	ms.author="sidneyh" />

# How to add a users to an elastic database pool

The elastic database job allows you to run the same script against every database in an [elastic database pool](sql-database-elastic-pool.md). To run the script, a user with the appropriate permissions must be added to every database in the pool. This is done with a combination of PowerShell and TSQL. First, a SQL Server login is created on the "master" database known as the control database. The login is needed to create a user on each database. Then a PowerShell script logs into each database in the pool and runs the CREATE USER statement. For more information, see [Managing Databases and Logins in Azure SQL Database](https://msdn.microsoft.com/library/azure/ee336235.aspx?f=255&MSPPError=-2147217396) or [Adding Users to Your SQL Azure Database](http://azure.microsoft.com/blog/2010/06/21/adding-users-to-your-sql-azure-database/)

## Prerequisites
* Create an elastic database pool. See [Azure SQL Database elastic pool (preview)](sql-database-elastic-pool.md)
* Install the [elastic job components](sql-database-elastic-jobs-service-installation.md). 
* Download the Azure PowerShell and the Azure Resource Manager module. See [Create an Azure SQL Database elastic pool using Azure PowerShell](sql-database-elastic-pool-powershell.md#prepare-your-environment).


## How to add the users to the databases

1.	Log into the **control** database using the user name and password that was created when installing the elastic job tool.  
2.	Run the following script to create a new login using the same name as the administrator. The statement must be run alone:

		CREATE LOGIN login1 WITH password='password';
		
4. Then create a user from the login:

		CREATE USER admin1 FROM LOGIN login1; 
4. Use a scripting tool such as PowerShell to run the following T-SQL script (or the equivalent) on every database in the pool. The tool must be able to log in to each database using an appropriate login and password, and must have sufficient permissions to execute the creation of the user.

		Code To be determined
5. Run the PowerShell script.

		Code To be determined

## Next steps

Run a job against the database pool. See [Creating and managing elastic database jobs](sql-database-elastic-jobs-create-and-manage.md).

[AZURE.INCLUDE [elastic-scale-include](../includes/elastic-scale-include.md)]

<!--Image references-->
[1]: ./media/sql-database-elastic-jobs-overview/elastic-jobs.png
<!--anchors-->

