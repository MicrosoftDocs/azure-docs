---
title: Database-per-tenant SaaS tutorial - Azure SQL Database | Microsoft Docs 
description: "Deploy and explore the Wingtip Tickets SaaS multi-tenant application, that demonstrates the Database per Tenant and other SaaS patterns using Azure SQL Database."
keywords: sql database tutorial
services: sql-database
documentationcenter: ''
author: MightyPen
manager: craigg
editor: ''

ms.assetid: 
ms.service: sql-database
ms.custom: scale out apps
ms.workload: "Inactive"
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/01/2017
ms.author: genemi
---
# Deploy and explore a multi-tenant SaaS application that uses the database per tenant pattern with Azure SQL Database

In this tutorial, you deploy and explore the Wingtip Tickets SaaS *database per tenant* application. The app uses a database per tenant pattern, to store the data of multiple tenants. The app is designed to showcase features of Azure SQL Database that simplify enabling SaaS scenarios.

Later in this article there is a blue button labeled **Deploy to Azure**. Five minutes after you click the button, you have a multi-tenant SaaS application. The app includes an Azure SQL Database running in the Microsoft cloud. The app is deployed with three sample tenants, each with its own database. All the databases are deployed into a SQL *elastic pool*. The app is deployed to your Azure subscription. You have full access to explore and work with the individual components of the app. The application C# source code, and the management scripts, are available in the [WingtipTicketsSaaS-DbPerTenant GitHub repo][github-wingtip-dpt].

In this tutorial you learn:

> [!div class="checklist"]
> - How to deploy the Wingtip SaaS application.
> - Where to get the application source code, and management scripts.
> - About the servers, pools, and databases that make up the app.
> - How tenants are mapped to their data with the *catalog*.
> - How to provision a new tenant.
> - How to monitor tenant activity in the app.

A [series of related tutorials](saas-dbpertenant-wingtip-app-overview.md#sql-database-wingtip-saas-tutorials) offers to explore various SaaS design and management patterns. The tutorials build beyond this initial deployment.
When you use the tutorials, you can see how the different SaaS patterns are implemented by examining the provided scripts.
The scripts demonstrate how features of SQL Database simplify the development of SaaS applications.

## Prerequisites

To complete this tutorial, make sure the following prerequisites are completed:

* Azure PowerShell is installed. For details, see [Getting started with Azure PowerShell](https://docs.microsoft.com/powershell/azure/get-started-azureps).

## Deploy the Wingtip Tickets SaaS application

Deploy the app:

1. Choose and remember values you will need for the following parameters:

    - **User**: Choose a short value, such as your initials followed by a digit. For example, *af1*. The User parameter can contain only letters, digits, and hyphens (no spaces). The first and last character must be a letter or a digit. We recommend that all letters be lowercase.
    - **Resource group**: Each time you deploy the Wingtip application, you must choose a different unique name for the new resource group. We recommend that you append the User name to a base name for the resource group. An example resource group name could be *wingtip-af1*. Again, we recommend that all letters be lowercase.

2. Open the Wingtip Tickets SaaS Database per Tenant deployment template in the Azure portal, by clicking the blue **Deploy to Azure** button.

   <a href="https://aka.ms/deploywingtipdpt" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a>

3. Into the template, enter values for the required parameters:

    - **Resource group** - Select **Create new** and provide the unique **Name** you chose earlier for the resource group. 
    - **Location** - Select a **Location** from the drop-down list.
    - **User** - Use the User name value you chose earlier.

    > [!IMPORTANT]
    > Some authentication, and server firewalls are intentionally unsecured for demonstration purposes. **Create a new resource group**. Do not use existing resource groups, servers, or pools. Do not use this application, scripts, or any deployed resources for production. Delete this resource group when you are finished with the application to stop related billing.

<!--
Edit the Above??:
Unclear why the above IMPORTANT alert has the full sentence of the following??:
**Create a new resource group**.
-->

4. Deploy the application.

    - Click to agree to the terms and conditions.
    - Click **Purchase**.

5. Monitor deployment status by clicking **Notifications**, which is the bell icon right of the search box. Deploying the Wingtip Tickets SaaS app takes approximately five minutes.

   ![deployment succeeded](media/saas-dbpertenant-get-started-deploy/succeeded.png)

## Download and unblock the Wingtip Tickets management scripts

While the application is deploying, download the source code and management scripts.

> [!IMPORTANT]
> Executable contents (scripts, DLLs) may be blocked by Windows when .zip files are downloaded from an external source and extracted. When extracting the scripts from a zip file, use the following steps to unblock the .zip file before extracting. The unblocking ensures the scripts are allowed to run.

1. Browse to the [WingtipTicketsSaaS-DbPerTenant GitHub repo][github-wingtip-dpt].
2. Click **Clone or download**.
3. Click **Download ZIP**, and then save the file.
4. Right-click the **WingtipTicketsSaaS-DbPerTenant-master.zip** file, and then select **Properties**.
5. On the **General** tab, select **Unblock**, and then click **Apply**.
6. Click **OK**.
7. Extract the files.

Scripts are located in the *..\\WingtipTicketsSaaS-DbPerTenant-master\\Learning Modules* folder.

## Update the user configuration file for this deployment

Before running any scripts, update the *resource group* and *user* values in **UserConfig.psm1**. Set these variables to the values you used during deployment.

1. In the *PowerShell ISE*, open ...\\Learning Modules\\*UserConfig.psm1* 
2. Update *ResourceGroupName* and *Name* with the specific values for your deployment (on lines 10 and 11 only).
3. Save the changes!

These values are referenced in nearly every script.

## Run the application

The app showcases venues that host events. Venue types include concert halls, jazz clubs, and sports clubs. In Wingtip Tickets, venues are registered as tenants. Being a tenant gives a venue an easy way to list events and to sell tickets to their customers. Each venue gets a personalized web site to list their events and to sell tickets.

Internally in the app, each tenant gets a SQL database deployed into an SQL elastic pool.

A central **Events Hub** page provides a list of links to the tenants in your deployment.

1. Open the *Events Hub* in your web browser: http://events.wingtip-dpt.&lt;USER&gt;.trafficmanager.net (substitute &lt;USER&gt; with your deployment's user value):

    ![events hub](media/saas-dbpertenant-get-started-deploy/events-hub.png)

2. Click **Fabrikam Jazz Club** in the *Events Hub*.

    ![Events](./media/saas-dbpertenant-get-started-deploy/fabrikam.png)

The application uses [*Azure Traffic Manager*](../traffic-manager/traffic-manager-overview.md) to control the distribution of incoming requests.
Each tenant has its own events webpage. The app design requires that the tenant name must be part of the URL.
All the tenant URLs include your specific *User* value and follow this format:
Also, the events webpage URL includes your specific *User* value. For each tenant, the events page URL matches the following format:

- http://events.wingtipp-dpt.&lt;USER&gt;.trafficmanager.net/*fabrikamjazzclub*

The events app parses the tenant name from the URL. The app uses the tenant name to create a key to access a catalog.
The catalog maps the key to the tenant's database location.
The catalog is implemented by using [*shard map management*](sql-database-elastic-scale-shard-map-management.md).
The **Events Hub** webpage lists the events webpage URLs for all tenants.
The hub uses extended metadata in the catalog to retrieve the tenant’s name associated with each database.

<!--
Edit the Above??:
Unclear how the preceding final sentence ("The hub uses extended...") explains the purpose of the earlier first sentence ("The application uses Azure Traffic Manager to...")?
-->

In a production environment, typically you create a CNAME DNS record to [*point a company internet domain*](../traffic-manager/traffic-manager-point-internet-domain.md) to the traffic manager profile.

## Start generating load on the tenant databases

Now that the app is deployed, let’s put it to work!
The *Demo-LoadGenerator* PowerShell script starts a workload running against all tenant databases.
The real-world load on many SaaS apps is sporadic and unpredictable.
To simulate this type of load, the generator produces a load with randomized spikes or bursts of activity on each tenant.
The bursts occur at randomized intervals.
It takes several minutes for the load pattern to emerge. So it is best to let the generator run for at least three or four minutes before monitoring the load.

1. In the *PowerShell ISE*, open the ...\\Learning Modules\\Utilities\\*Demo-LoadGenerator.ps1* script.
2. Press **F5** to run the script and start the load generator. (Leave the default parameter values for now.)

Do not reuse the same PowerShell ISE instance for anything, other than perhaps a rerun of *Demo-LoadGenerator.ps1*. If you need to run other PowerShell scripts, start a separate PowerShell ISE.

#### Rerun with different parameters

Follow these steps if you want to rerun the workload test with different parameters:

1. Stop *LoadGenerator.ps1*.
    - Either use **Ctrl+C**, or click the **Stop** button.
    - This stoppage does not stop or affect any incomplete background jobs that are still running.

2. Rerun *Demo-LoadGenerator.ps1*.
    - This rerun first stops any of the background jobs that might still be running *sp_CpuLoadGenerator*.

Or you can terminate the PowerShell ISE instance, which stops any background jobs. Then start a new instance of PowerShell ISE, and rerun *Demo-LoadGenerator.ps1*.

#### Monitor the background jobs

If you want to control and monitor the background jobs, you can use the following cmdlets:

- Get-Job
- Receive-Job
- Stop-Job

#### Demo-LoadGenerator.ps1 actions

*Demo-LoadGenerator.ps1* mimics an active workload of customer transactions. The following steps describe the sequence of actions that *Demo-LoadGenerator.ps1* initiates:

1. *Demo-LoadGenerator.ps1* starts *LoadGenerator.ps1* in the foreground.
    - Both of these .ps1 files are stored under the folders *Learning Modules\\Utilities\\*.

2. *LoadGenerator.ps1* loops through all tenant databases that are registered in the catalog.

3. For each tenant database, *LoadGenerator.ps1* starts an execution of the Transact-SQL stored procedure named *sp_CpuLoadGenerator*.
    - The executions are started in the background, by calling the *Invoke-SqlAzureWithRetry* cmdlet.
    - *sp_CpuLoadGenerator* loops around an SQL SELECT statement for a default duration of 60 seconds. The time interval between issues of the SELECT varies according to parameter values.
    - This .sql file is stored under *WingtipTenantDB\\dbo\\StoredProcedures\\*.

4. For each tenant database, *LoadGenerator.ps1* also starts the *Start-Job* cmdlet.
    - *Start-Job* mimics a workload of ticket sales.

5. *LoadGenerator.ps1* continues to run, monitoring for any new tenants that are provisioned.

&nbsp;

Before proceeding to the next section, leave the load generator running in the job-invoking state.

## Provision a new tenant

The initial deployment creates three sample tenants. Now you create another tenant to see the impact on the deployed application. In the Wingtip app, the workflow to provision new tenants is explained in the [Provision and catalog tutorial](saas-dbpertenant-provision-and-catalog.md). In this phase, you create a new tenant, which takes less than one minute.

1. In the *PowerShell ISE*, open ...\\Learning Modules\Provision and Catalog\\*Demo-ProvisionAndCatalog.ps1* .
2. Press **F5** to run the script. (Leave the default values for now.)

   > [!NOTE]
   > Many Wingtip SaaS scripts use *$PSScriptRoot* to navigate folders to call functions in other scripts. This variable is only evaluated when the full script is executed by pressing **F5**.  Highlighting and running a selection with **F8** can result in errors. So run the scripts by pressing **F5**.

The new tenant database is:

- Created in an SQL elastic pool.
- Initialized.
- Registered in the catalog.

After successful provisioning, the *Events* site of the new tenant appears in your browser:

![New tenant](./media/saas-dbpertenant-get-started-deploy/red-maple-racing.png)

Refresh the *Events Hub* to make the new tenant appear in the list.

## Explore the servers, pools, and tenant databases

Now that you've started running a load against the collection of tenants, let’s look at some of the resources that were deployed:

1. In the [Azure portal](http://portal.azure.com), browse to your list of SQL servers, and then open the **catalog-dpt-&lt;USER&gt;** server.
    - The catalog server contains two databases, the **tenantcatalog** and the **basetenantdb** (a template database that is copied to create new tenants).

   ![databases](./media/saas-dbpertenant-get-started-deploy/databases.png)

2. Go back to your list of SQL servers.

3. Open the **tenants1-dpt-&lt;USER&gt;** server that holds the tenant databases.

4. See the following items:
    - Each tenant database is an *Elastic Standard* database in a 50 eDTU standard pool.
    - The *Red Maple Racing* database, which is the tenant database you provisioned previously.

   ![server](./media/saas-dbpertenant-get-started-deploy/server.png)

## Monitor the pool

After *LoadGenerator.ps1* runs for several minutes, enough data should be available to start looking at some monitoring capabilities. These capabilities are built into pools and databases.

Browse to the server **tenants1-dpt-&lt;USER&gt;**, and click **Pool1** to view resource utilization for the pool. In the following charts, the load generator ran for one hour.

   ![monitor pool](./media/saas-dbpertenant-get-started-deploy/monitor-pool.png)

- The first chart, labeled **Resource utilization**, shows pool eDTU utilization.
- The second chart shows eDTU utilization of the top five databases in the pool.

The two charts illustrate that elastic pools and SQL Database are well suited to SaaS application workloads.
The charts show that 4 databases are each bursting to as much as 40 eDTUs, and yet all the databases are comfortably supported by a 50 eDTU pool. The 50 eDTU pool can support even heavier workloads.
If they were provisioned as standalone databases, they would each need to be an S2 (50 DTU) to support the bursts.
The cost of 4 standalone S2 databases would be nearly 3 times the price of the pool.
In real-world situations, SQL Database customers are currently running up to 500 databases in 200 eDTU pools.
For more information, see the [performance monitoring tutorial](saas-dbpertenant-performance-monitoring.md).

## Additional resources

- Additional [tutorials that build on the Wingtip Tickets SaaS Database per Tenant application](saas-dbpertenant-wingtip-app-overview.md#sql-database-wingtip-saas-tutorials)
- To learn about elastic pools, see [*What is an Azure SQL elastic pool*](sql-database-elastic-pool.md)
- To learn about elastic jobs, see [*Managing scaled-out cloud databases*](sql-database-elastic-jobs-overview.md)
- To learn about multi-tenant SaaS applications, see [*Design patterns for multi-tenant SaaS applications*](saas-tenancy-app-design-patterns.md)


## Next steps

In this tutorial you learned:

> [!div class="checklist"]
> - How to deploy the Wingtip Tickets SaaS application
> - About the servers, pools, and databases that make up the app
> - Tenants are mapped to their data with the *catalog*
> - How to provision new tenants
> - How to view pool utilization to monitor tenant activity
> - How to delete sample resources to stop related billing

Next, try the [Provision and catalog tutorial](saas-dbpertenant-provision-and-catalog.md).



<!-- Link references. -->

[github-wingtip-dpt]: https://github.com/Microsoft/WingtipTicketsSaaS-DbPerTenant 

