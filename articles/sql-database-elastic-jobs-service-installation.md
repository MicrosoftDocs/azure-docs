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

The [elastic database pool (preview)](sql-database-elastic-pool-portal.md) provides a predictable model for deploying large numbers of databases. Once you have installed an elastic pool, you can use the **elastic database job** to manage it. For example, you can set the policy on each database to allow only a person with the right credentials to view sensitive data. Here's how to install the service.

**Estimated time to complete:** 10 minutes.

## Prerequisites
* An Azure subscription. For a free trial, see [Free one-month trial](http://azure.microsoft.com/pricing/free-trial/).
* An elastic database pool. See [Create an Azure SQL Database elastic pool (preview)](sql-database-elastic-pool-portal.md).

## Install the service components
First go to the [Azure preview portal](https://ms.portal.azure.com/#).


1. From the dashboard view of the elastic database pool, click **Create job**.
2. If you are creating a job for the first time you must install the service components by clicking **PREVIEW TERMS**. 
3. Accept the terms by clicking the checkbox.
4.  In the "Install services" view, click **JOB CREDENTIALS**.

	![Installing the services][1]

5. Type a user name and password for a database admin. As part of the installation, a new Azure SQL Database server is created. That database is used to contain the metadata for the elastic database pool. The user name and password created here are used for two purposes: (1) to log in to the "master" database, and (2) as the identity used to log in to each database in the elastic pool whenever a you execute a job.
 
	![Create username and password][2]
6. Click the OK button. The components are created for you in a few minutes in a new [Resource group](resource-group-portal.md). The new group is pinned to the start board, as shown below. Once created, the job services (Cloud Service, SQL Database, Service Bus, and Storage) are all created in the group.

	![resource group in start board][3]


7. If you attempt to return to the **Credentials** view while the deployment is incomplete, you will see this. 

	![Deployment still in progress][4]

8. If the installation fails for some reason, delete the resource group. See [How to uninstall the elastic database job components](sql-database-elastic-jobs-uninstall.md).


## Next steps

In order to log in to each database, a log in must be created on each DB. See [How to add users to an elastic database pool](sql-database-elastic-jobs-add-logins-to-dbs.md). 
To understand the job creation, see [Creating and managing an elastic database job](sql-database-elastic-jobs-create-and-manage.md).

<!--Image references-->
[1]: ./media/sql-database-elastic-jobs-service-installation/screen-1.png
[2]: ./media/sql-database-elastic-jobs-service-installation/credentials.png
[3]: ./media/sql-database-elastic-jobs-service-installation/start-board.png
[4]: ./media/sql-database-elastic-jobs-service-installation/incomplete.png
