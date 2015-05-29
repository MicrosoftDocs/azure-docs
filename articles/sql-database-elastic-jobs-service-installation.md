<properties 
	pageTitle="Installing elastic database jobs" 
	description="Walk through installation of the elastic job feature." 
	services="sql-database" 
	documentationCenter="" 
	manager="jhubbard" 
	authors="sidneyh" 
	editor=""/>

<tags 
	ms.service="sql-database" 
	ms.workload="sql-database" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/29/2015" 
	ms.author="sidneyh"/>

# Installing the elastic database job components

The [elastic database pool (preview)](sql-database-elastic-pool-portal.md) provides a predictable model for deploying large numbers of databases. Once you have created an elastic database pool, you can use **elastic database jobs** to execute administrative tasks across each database in the elastic database pool. For example, you can deploy new schema such as setting an RLS policy on each database to restrict data only to the person with the right credentials to view sensitive data. Here's how to install **elastic database jobs**.

**Estimated time to complete:** 10 minutes.

## Prerequisites
* An Azure subscription. For a free trial, see [Free one-month trial](http://azure.microsoft.com/pricing/free-trial/).
* An elastic database pool. See [Create an Azure SQL Database elastic pool (preview)](sql-database-elastic-pool-portal.md).

## Install the service components
First go to the [Azure preview portal](https://ms.portal.azure.com/#).


1. From the dashboard view of the elastic database pool, click **Create job**.
2. If you are creating a job for the first time you must install **elastic database jobs** by clicking **PREVIEW TERMS**. 
3. Accept the terms by clicking the checkbox.
4. In the "Install services" view, click **JOB CREDENTIALS**.

	![Installing the services][1]

5. Type a user name and password for a database admin. If a common user for script execution already exists across every database in the elastic database pool, consider using this same user to eliminate the requirement to add a new user to each database for script execution. As part of the installation, a new Azure SQL Database server is created. Within this new server, a new database, known  as the conrtol database, is created that is used to contain the metadata for elastic database jobs. The user name and password created here are used for two purposes: (1) to log in to the control database, and (2) as the credential used to log in to each database in the elastic pool whenever a you run a job for script exeution.
 
	![Create username and password][2]
6. Click the OK button. The components are created for you in a few minutes in a new [Resource group](resource-group-portal.md). The new resource group is pinned to the start board, as shown below. Once created, elastic database jobs (Cloud Service, SQL Database, Service Bus, and Storage) are all created in the group.

	![resource group in start board][3]


7. If you attempt to create or manage a job while elastic database jobs is installing, when providing **Credentials** you will see the following message. 

	![Deployment still in progress][4]

8. If the installation fails for some reason, delete the resource group. See [How to uninstall the elastic database job components](sql-database-elastic-jobs-uninstall.md).


## Next steps

If a new credential was provided when installing elastic databse jobs which doesn't already exist in each database in the elastic database pool with the appropriate rights for script execution, the credential must be created on each database. See [How to add users to an elastic database pool](sql-database-elastic-jobs-add-logins-to-dbs.md). 
To understand the job creation, see [Creating and managing an elastic database job](sql-database-elastic-jobs-create-and-manage.md).

<!--Image references-->
[1]: ./media/sql-database-elastic-jobs-service-installation/screen-1.png
[2]: ./media/sql-database-elastic-jobs-service-installation/credentials.png
[3]: ./media/sql-database-elastic-jobs-service-installation/start-board.png
[4]: ./media/sql-database-elastic-jobs-service-installation/incomplete.png
