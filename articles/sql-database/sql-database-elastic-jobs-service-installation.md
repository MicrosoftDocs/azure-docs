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
	ms.date="08/03/2015" 
	ms.author="ddove; sidneyh"/>

# Installing Elastic Database jobs overview
**Elastic Database jobs** can be installed via PowerShell or through the Azure portal, although you will only gain access to create and manage jobs using the PowerShell API only if you install the PowerShell package. Additionally, the PowerShell APIs provide significantly more functionality over the portal at this point in time. For more information about **Elastic Database jobs**, see [Elastic Database jobs overview](sql-database-elastic-jobs-overview.md).

If you have already installed **Elastic Database jobs** through the Portal from an existing **Elastic Database pool**, the latest Powershell preview includes scripts to upgrade your existing installation. It is highly recommended to upgrade your installation to the latest **Elastic Database jobs** components in order to take advantage of new functionality exposed via the PowerShell APIs.

## Prerequisites
* An Azure subscription. For a free trial, see [Free trial](http://azure.microsoft.com/pricing/free-trial/).
* Azure PowerShell version >= 0.8.16. Install the latest version (0.9.5) through the [Web Platform Installer](http://go.microsoft.com/fwlink/p/?linkid=320376). For detailed information, see [How to install and configure Azure PowerShell](powershell-install-configure.md).
* [NuGet Command-line Utility](https://nuget.org/nuget.exe) is used to install the Elastic Database jobs package. For more information, see http://docs.nuget.org/docs/start-here/installing-nuget.

## Download and import the Elastic Database jobs PowerShell package
1. Launch Microsoft Azure PowerShell command window and navigate to the directory where you downloaded NuGet Command-line Utility (nuget.exe).

2. Download and import **Elastic Database jobs** package into the current directory with the following command:

		PS C:\>.\nuget install Microsoft.Azure.SqlDatabase.Jobs -prerelease

    The **Elastic Database jobs** files are placed in the local directory in a folder named **Microsoft.Azure.SqlDatabase.Jobs.x.x.xxxx.x** where *x.x.xxxx.x* reflects the version number. The PowerShell cmdlets (including required client .dlls) are located in the **tools\ElasticDatabaseJobs** sub-directory and the PowerShell scripts to install, upgrade and uninstall also reside in the **tools** sub-directory.

3. Navigate to the tools sub-directory under the Microsoft.Azure.SqlDatabase.Jobs.x.x.xxx.x folder by typing cd tools, for example:

		PS C:\*Microsoft.Azure.SqlDatabase.Jobs.x.x.xxxx.x*>cd tools

4.	Execute the .\InstallElasticDatabaseJobsCmdlets.ps1 script to copy the ElasticDatabaseJobs directory into $home\Documents\WindowsPowerShell\Modules. This will also automatically import the module for use, for example:

		PS C:\*Microsoft.Azure.SqlDatabase.Jobs.x.x.xxxx.x*\tools>Unblock-File .\InstallElasticDatabaseJobsCmdlets.ps1 
		PS C:\*Microsoft.Azure.SqlDatabase.Jobs.x.x.xxxx.x*\tools>.\InstallElasticDatabaseJobsCmdlets.ps1

## Install the Elastic Database jobs components using PowerShell
1.	Launch a Microsoft Azure PowerShell command window and navigate to the \tools sub-directory under the Microsoft.Azure.SqlDatabase.Jobs.x.x.xxx.x folder: Type cd \tools

		PS C:\*Microsoft.Azure.SqlDatabase.Jobs.x.x.xxxx.x*>cd tools

2.	Execute the .\InstallElasticDatabaseJobs.ps1 PowerShell script and supply values for its requested variables. This script will create the components described in [Elastic Database jobs components and pricing](sql-database-elastic-jobs-overview/#components-and-pricing) along with configuring the Azure Cloud Service to appropriately use the dependent components.

		PS C:\*Microsoft.Azure.SqlDatabase.Jobs.x.x.xxxx.x*\tools>Unblock-File .\InstallElasticDatabaseJobs.ps1 
		PS C:\*Microsoft.Azure.SqlDatabase.Jobs.x.x.xxxx.x*\tools>.\InstallElasticDatabaseJobs.ps1

When you run this command a window opens asking for a **user name** and **password**. This is not your Azure credentials, enter the user name and password that will be the administrator credentials you want to create for the new server. 

The parameters provided on this sample invocation can be modified for your desired settings. The following provides more information on the behavior of each parameter:

<table style="width:100%">
  <tr>
    <th>Parameter</th>
    <th>Description</th>
  </tr>

<tr>
	<td>ResourceGroupName</td>
	<td>Provides the Azure resource group name created to contain the newly created Azure components. This parameter defaults to “__ElasticDatabaseJob”. It is not recommended to change this value.</td>
	</tr>

</tr>

	<tr>
	<td>ResourceGroupLocation</td>
	<td>Provides the Azure location to be used for the newly created Azure components. This parameter defaults to the Central US location.</td>
</tr>

<tr>
	<td>ServiceWorkerCount</td>
	<td>Provides the number of service workers to install. This parameter defaults to 1. A higher number of workers can be used to scale out the service and to provide high availability. It is recommended to use “2” for deployments that require high availability of the service.</td>
	</tr>

</tr>
	<tr>
	<td>ServiceVmSize</td>
	<td>Provides the VM size for usage within the Cloud Service. This parameter defaults to A0. Parameters values of A0/A1/A2/A3 are accepted which cause the worker role to use an ExtraSmall/Small/Medium/Large size, respectively. Fo more information on worker role sizes, see [Elastic Database jobs components and pricing](sql-database-elastic-jobs-overview/#components-and-pricing).</td>
</tr>

</tr>
	<tr>
	<td>SqlServerDatabaseSlo</td>
	<td>Provides the service level objective for a Standard edition. This parameter defaults to S0. Parameter values of S0/S1/S2/S3 are accepted which cause the Azure SQL Database to use the respective SLO. For more information on SQL Database SLOs, see [Elastic Database jobs components and pricing](sql-database-elastic-jobs-overview/#components-and-pricing).</td>
</tr>

</tr>
	<tr>
	<td>SqlServerAdministratorUserName</td>
	<td>Provides the admin user name for the newly created Azure SQL Database server. When not specified, a PowerShell credentials window will open to prompt for the credentials.</td>
</tr>

</tr>
	<tr>
	<td>SqlServerAdministratorPassword</td>
	<td>Provides the admin password for the newly created Azure SQL Database server. When not provided, a PowerShell credentials window will open to prompt for the credentials.</td>
</tr>
</table>

For systems that target having large numbers of jobs running in parallel against a large number of databases, it is recommended to specify parameters such as: -ServiceWorkerCount 2 -ServiceVmSize A2 -SqlServerDatabaseSlo S2.

    PS C:\*Microsoft.Azure.SqlDatabase.Jobs.dll.x.x.xxx.x*\tools>Unblock-File .\InstallElasticDatabaseJobs.ps1
    PS C:\*Microsoft.Azure.SqlDatabase.Jobs.dll.x.x.xxx.x*\tools>.\InstallElasticDatabaseJobs.ps1 -ServiceWorkerCount 2 -ServiceVmSize A2 -SqlServerDatabaseSlo S2

## Update an existing Elastic Database jobs components installation using PowerShell

**Elastic Database jobs** can be updated within an existing installation for scale and high-availability. This process allows for future upgrades of service code without having to drop and recreate the control database. This process can also be used within the same version to modify the service VM size or the server worker count.

To update the VM size of an installation, run the following script with parameters updated to the values of your choice.

    PS C:\*Microsoft.Azure.SqlDatabase.Jobs.dll.x.x.xxx.x*\tools>Unblock-File .\UpdateElasticDatabaseJobs.ps1
    PS C:\*Microsoft.Azure.SqlDatabase.Jobs.dll.x.x.xxx.x*\tools>.\UpdateElasticDatabaseJobs.ps1 -ServiceVmSize A1 -ServiceWorkerCount 2

<table style="width:100%">
  <tr>
  <th>Parameter</th>
  <th>Description</th>
</tr>

  <tr>
	<td>ResourceGroupName</td>
	<td>Identifies the Azure resource group name used when the Elastic Database job components were initially installed. This parameter defaults to “__ElasticDatabaseJob”. Since it is not recommended to change this value, you shouldn't have to specify this parameter.</td>
	</tr>
</tr>

</tr>

  <tr>
	<td>ServiceWorkerCount</td>
	<td>Provides the number of service workers to install.  This parameter defaults to 1.  A higher number of workers can be used to scale out the service and to provide high availability.  It is recommended to use “2” for deployments that require high availability of the service.</td>
</tr>

</tr>

	<tr>
	<td>ServiceVmSize</td>
	<td>Provides the VM size for usage within the Cloud Service. This parameter defaults to A0. Parameters values of A0/A1/A2/A3 are accepted which cause the worker role to use an ExtraSmall/Small/Medium/Large size, respectively. Fo more information on worker role sizes, see [Elastic Database jobs components and pricing](sql-database-elastic-jobs-overview/#components-and-pricing).</td>
</tr>

</table>

## Install the Elastic Database jobs components using the Portal

Once you have [created an Elastic Database pool](sql-database-elastic-pool-portal.md), you can install **Elastic Database jobs** components to enable execution of administrative tasks against each database in the Elastic Database pool. Unlike when using the **Elastic Database jobs** PowerShell APIs, the portal interface is currently restricted to only executing against an existing pool.


**Estimated time to complete:** 10 minutes.

1. From the dashboard view of the elastic database pool via the [Azure preview portal](https://ms.portal.azure.com/#) , click **Create job**.
2. If you are creating a job for the first time, you must install **Elastic Database jobs** by clicking **PREVIEW TERMS**. 
3. Accept the terms by clicking the checkbox.
4. In the "Install services" view, click **JOB CREDENTIALS**.

	![Installing the services][1]

5. Type a user name and password for a database admin. As part of the installation, a new Azure SQL Database server is created. Within this new server, a new database, known as the control database, is created and used to contain the meta data for Elastic Database jobs. The user name and password created here are used for the purpose of logging in to the control database. A separate credential is used for script execution against the databases within the pool.

	![Create username and password][2]

6. Click the OK button. The components are created for you in a few minutes in a new [Resource group](../resource-group-portal.md). The new resource group is pinned to the start board, as shown below. Once created, elastic database jobs (Cloud Service, SQL Database, Service Bus, and Storage) are all created in the group.

	![resource group in start board][3]

7. If you attempt to create or manage a job while elastic database jobs is installing, when providing **Credentials** you will see the following message. 

	![Deployment still in progress][4]

If uninstallation is required, delete the resource group. See [How to uninstall the Elastic Database job components](sql-database-elastic-jobs-uninstall.md).

## Next steps

Ensure a credential with the appropriate rights for script execution is created on each database in the group, for more information see [How to add users to all database in my group of databases](sql-database-elastic-jobs-add-logins-to-dbs.md). 
See [Creating and managing an Elastic Database jobs](sql-database-elastic-jobs-create-and-manage.md) to get started.

<!--Image references-->
[1]: ./media/sql-database-elastic-jobs-service-installation/screen-1.png
[2]: ./media/sql-database-elastic-jobs-service-installation/credentials.png
[3]: ./media/sql-database-elastic-jobs-service-installation/start-board.png
[4]: ./media/sql-database-elastic-jobs-service-installation/incomplete.png
 