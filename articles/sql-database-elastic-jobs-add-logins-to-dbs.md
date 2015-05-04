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

# How to add users to an elastic database pool

Elastic database jobs allows you to run the same script against every database in an [elastic database pool](sql-database-elastic-pool.md). To run the script, a user with the appropriate permissions must be added to every database in the pool. This user can be the same server-level principal created when **elastic databse jobs** was installed and is the **job credentials** provided to manage the metadata in the **control** database. For more information, see [Managing Databases and Logins in Azure SQL Database](https://msdn.microsoft.com/library/azure/ee336235.aspx?f=255&MSPPError=-2147217396) or [Adding Users to Your SQL Azure Database](http://azure.microsoft.com/blog/2010/06/21/adding-users-to-your-sql-azure-database/)

## Prerequisites
* [Create an elastic database pool (preview)](sql-database-elastic-pool-portal.md)
* Install the [elastic job components](sql-database-elastic-jobs-service-installation.md). 

## How to add the users to the databases

1.	First connect to **master** of the Azure SQL Database server where the databases in your elastic database pool reside and create a new login using the same credentials provided when installing **elastic database jobs**.

		CREATE LOGIN login1 WITH password='<ProvidePassword>';

2. Log into each database in the pool and create a user using the same name and password. The user must have sufficient permissions to execute the job. This code must be run on each database.

		CREATE USER admin1 FROM LOGIN login1;
		
3. The user must have permissions as well, sufficient to execute the script specified for the job. Use the **sp_addrolemember** procedure to provide the user with the minimum required permissions for the script to execute succesfully. 

## Next steps

Run a job against the database pool. See [Creating and managing elastic database jobs](sql-database-elastic-jobs-create-and-manage.md).

[AZURE.INCLUDE [elastic-scale-include](../includes/elastic-scale-include.md)]

<!--Image references-->
[1]: ./media/sql-database-elastic-jobs-overview/elastic-jobs.png
<!--anchors-->

