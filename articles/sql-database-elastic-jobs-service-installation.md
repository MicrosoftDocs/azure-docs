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

# Installing the elastic database job service

The Elastic database pool service provides a predictable model for deploying large numbers of databases. You can set minimum the Data Throughput Units (DTUs) for each database at a set cost. Managing these databases can most easily accomplished using the elastic database job service. The service allows you to run scripts against each database elastic database pool. For example, you can set the policy on each database to allow only a person with the right credentials to view sensitive data. Here's how to install the service.

**Estimated time to complete:** 10 minutes.

## Prerequisites
* An Azure subscription. For a free trial, see [Free one-month trial](http://azure.microsoft.com/pricing/free-trial/).
* An elastic database pool. See [About Elastic database pools](sql-database-elastic-pool.md)


## Install the service components
First go to the [Azure preview portal](https://ms.portal.azure.com/#).


1. From the dashboard view of the elastic database pool, click either **Create job**.
2. If you are creating a job for the first time you must install the service components by clicking on the text, **Click here to install the services**.
3. The **Install services** view appears.
	
	![Installing the services][1]

4. Click **Preview terms** to review your actions.  
5. The terms stipulate that an instance of an Azure Cloud Service, SQL Database, Service Bus, and Storage will be installed. The costs for each are calculated separately using the standard pricing for each service. 
6. Check the box to acknowledge the terms, and click **OK**.
	![Preview terms][2]

7. On the Install services view, click **Job credentials**.
8. Type a login name for the administrator. The name is used to log in to the **master** database of the SQL Server Database instance. It is also used to manage the other services.
9. Type a password for the administrator (twice), then click **OK**.
	![Create credentials for the services][3]

10. On the Install services view, click **Create** to start the deployment. If the deployment fails, see "troubleshooting the elastic database job installation."

	![Click create to begin the deployment][4]

## Next steps

To understand the job creation, see [Creating and managing an elastic database job](https://ms.portal.azure.com/#.md).

<!--Image references-->
[1]: ./media/sql-database-elastic-jobs-service-installation/screen-1.png
[2]: ./media/sql-database-elastic-jobs-service-installation/screen-2.png
[3]: ./media/sql-database-elastic-jobs-service-installation/screen-3.png
[4]: ./media/sql-database-elastic-jobs-service-installation/screen-4.png