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
ms.date: 12/07/2017
ms.author: genemi
---
# Deploy and explore a multi-tenant SaaS application that uses the database per tenant pattern with Azure SQL Database

In this tutorial, you deploy and explore the Wingtip Tickets SaaS *database per tenant* application (Wingtip). The app uses a database per tenant pattern, to store the data of multiple tenants. The app is designed to showcase features of Azure SQL Database that simplify enabling SaaS scenarios.

Five minutes after you click the blue button labeled **Deploy to Azure**, you have a multi-tenant SaaS application. The app includes an Azure SQL Database running in the Microsoft Azure cloud. The app is deployed with three sample tenants, each with its own database. All the databases are deployed into a SQL *elastic pool*. The app is deployed to your Azure subscription. You have full access to explore and work with the individual components of the app. The application C# source code, and the management scripts, are available in the [WingtipTicketsSaaS-DbPerTenant GitHub repo][github-wingtip-dpt].

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

#### Plan the names

In the steps of this section, you provide a *user* value that is used to ensure resource names are globally unique, and a name for the *resource group* which contains all the resources created by a deployment of the app. For a person named *Ann Finley*, we suggest:
- *User:* **af1**  *(Her initials, plus a digit. Use a different value (e.g. af2) if you deploy the app a second time.)*
- *Resource group:* **wingtip-dpt-af1** *(wingtip-dpt indicates this is the database-per-tenant app. Appending the user name af1 correlates the resource group name with the names of the resources it contains.)*

Choose your names now, and write them down. 

#### Steps

1. Open the Wingtip Tickets SaaS Database per Tenant deployment template in the Azure portal, by clicking the blue **Deploy to Azure** button.

   <a href="https://aka.ms/deploywingtipdpt" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a>

1. Into the template, enter values for the required parameters:

    > [!IMPORTANT]
    > Some authentication, and server firewalls are intentionally unsecured for demonstration purposes. We recommend that you *create a new resource group*. Do not use existing resource groups, servers, or pools. Do not use this application, scripts, or any deployed resources for production. Delete this resource group when you are finished with the application to stop related billing.

    - **Resource group** - Select **Create new** and provide the unique **Name** you chose earlier for the resource group. 
    - **Location** - Select a **Location** from the drop-down list.
    - **User** - Use the User name value you chose earlier.

1. Deploy the application.

    - Click to agree to the terms and conditions.
    - Click **Purchase**.

1. Monitor deployment status by clicking **Notifications**, which is the bell icon right of the search box. Deploying the Wingtip Tickets SaaS app takes approximately five minutes.

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

Before running any scripts, update the *resource group* and *user* values in the *User Config* file. Set these variables to the values you used during deployment.

1. In the **PowerShell ISE**, open ...\\Learning Modules\\**UserConfig.psm1** 
2. Update **ResourceGroupName** and **Name** with the specific values for your deployment (on lines 10 and 11 only).
3. Save the changes!

These values are referenced in nearly every script.

## Run the application

The app showcases venues that host events. Venue types include concert halls, jazz clubs, and sports clubs. In Wingtip Tickets, venues are registered as tenants. Being a tenant gives a venue an easy way to list events and to sell tickets to their customers. Each venue gets a personalized web site to list their events and to sell tickets.

Internally in the app, each tenant gets a SQL database deployed into an SQL elastic pool.

A central **Events Hub** page provides a list of links to the tenants in your deployment.

1. Open the *Events Hub* in your web browser: http://events.wingtip-dpt.&lt;user&gt;.trafficmanager.net (substitute &lt;user&gt; with your deployment's user value):

    ![events hub](media/saas-dbpertenant-get-started-deploy/events-hub.png)

2. Click **Fabrikam Jazz Club** in the *Events Hub*.

    ![Events](./media/saas-dbpertenant-get-started-deploy/fabrikam.png)

#### Azure Traffic Manager

The Wingtip application uses [*Azure Traffic Manager*](../traffic-manager/traffic-manager-overview.md) to control the distribution of incoming requests. The URL to access the events page for a specific tenant uses the following format:

- http://events.wingtip-dpt.&lt;user&gt;.trafficmanager.net/fabrikamjazzclub

The parts of the preceding format are explained in the following table.

| URL part        | Description       |
| :-------------- | :---------------- |
| http://events.wingtip-dpt | The events parts of the Wingtip app.<br /><br /> *-dpt* distinguishes the *database per tenant* implementation of Wingtip Tickets from other implementations. For example, the *standalone* app-per-tenant (*-sa*), or *multi-tenant database* (*-mt*) implementations. |
| .*&lt;user&gt;* | *af1* in our example. |
| .trafficmanager.net/ | Azure Traffic Manager, base URL. |
| fabrikamjazzclub | Identifies the tenant named *Fabrikam Jazz Club*. |
| &nbsp; | &nbsp; |

1. The tenant name is parsed from the URL by the events app.
2. The tenant name is used to create a key.
3. The key is used to access the catalog, to obtain the location of the tenant's database.
    - The catalog is implemented using *shard map management*.
4. The *Events Hub* uses extended metadata in the catalog to construct the list of events page URLs for each tenant.

In a production environment, typically you create a CNAME DNS record to [*point a company internet domain*](../traffic-manager/traffic-manager-point-internet-domain.md) to the traffic manager DNS name.

## Start generating load on the tenant databases

Now that the app is deployed, let’s put it to work!
The *Demo-LoadGenerator* PowerShell script starts a workload running against all tenant databases.
The real-world load on many SaaS apps is sporadic and unpredictable.
To simulate this type of load, the generator produces a load with randomized spikes or bursts of activity on each tenant.
The bursts occur at randomized intervals.
It takes several minutes for the load pattern to emerge. So it is best to let the generator run for at least three or four minutes before monitoring the load.

1. In the *PowerShell ISE*, open the ...\\Learning Modules\\Utilities\\*Demo-LoadGenerator.ps1* script.
1. Press **F5** to run the script and start the load generator. (Leave the default parameter values for now.)
1. You will be prompted to log in to your Azure account and, if necessary, to select the subscription you want to use.

The load generator script starts a background job for each database in the catalog and then stops.  If you rerun the load generator script, it will first stop any background jobs that are running before starting new ones.

#### Monitor the background jobs

If you want to control and monitor the background jobs, you can use the following cmdlets:

- `Get-Job`
- `Receive-Job`
- `Stop-Job`

#### Demo-LoadGenerator.ps1 actions

*Demo-LoadGenerator.ps1* mimics an active workload of customer transactions. The following steps describe the sequence of actions that *Demo-LoadGenerator.ps1* initiates:

1. *Demo-LoadGenerator.ps1* starts *LoadGenerator.ps1* in the foreground.
    - Both of these .ps1 files are stored under the folders *Learning Modules\\Utilities\\*.

1. *LoadGenerator.ps1* loops through all tenant databases in the catalog.

1. *LoadGenerator.ps1* starts a background PowerShell job for each tenant database: 
    - By default the background jobs run for 120 minutes.
    - Each job causes a CPU-based load on one tenant database by executing *sp_CpuLoadGenerator*.  The intensity and duration of the load varies depending on `$DemoScenario`. 
    - *sp_CpuLoadGenerator* loops around a SQL SELECT statement that causes a high CPU load. The time interval between issues of the SELECT varies according to parameter values to create a controllable CPU load. Load levels and intervals are randomized to simulate more realistic loads.
    - This .sql file is stored under *WingtipTenantDB\\dbo\\StoredProcedures\\*.

1. If `$OneTime = $false`, the load generator starts the background jobs and then continues to run, monitoring every 10 seconds for any new tenants that are provisioned. If you set `$OneTime = $true`, the LoadGenerator will start the background jobs and then stop running in the foreground. For this tutorial, leave `$OneTime = $false`.

  Use Ctrl-C or Stop Operation Ctrl-Break if you want to stop  or restart the load generator. 

  If you leave the load generator running in the foreground, use another PowerShell ISE instance to run other PowerShell scripts.

&nbsp;

Before proceeding to the next section, leave the load generator running in the job-invoking state.

## Provision a new tenant

The initial deployment creates three sample tenants. Now you create another tenant to see the impact on the deployed application. In the Wingtip app, the workflow to provision new tenants is explained in the [Provision and catalog tutorial](saas-dbpertenant-provision-and-catalog.md). In this phase, you create a new tenant, which takes less than one minute.

1. Open a new *PowerShell ISE*.
1. Open ...\\Learning Modules\Provision and Catalog\\*Demo-ProvisionAndCatalog.ps1* .
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
    - The catalog server contains two databases, **tenantcatalog** and  **basetenantdb** (a template database that is copied to create new tenants).

   ![databases](./media/saas-dbpertenant-get-started-deploy/databases.png)

2. Go back to your list of SQL servers.

3. Open the **tenants1-dpt-&lt;USER&gt;** server that holds the tenant databases.

4. See the following items:
    - Each tenant database is an *Elastic Standard* database in a 50 eDTU standard pool.
    - The *Red Maple Racing* database, which is the tenant database you provisioned previously.

   ![server](./media/saas-dbpertenant-get-started-deploy/server.png)

## Monitor the pool

After *LoadGenerator.ps1* runs for several minutes, enough data should be available to start looking at some monitoring capabilities. These capabilities are built into pools and databases.

Browse to the server **tenants1-dpt-&lt;user&gt;**, and click **Pool1** to view resource utilization for the pool. In the following charts, the load generator ran for one hour.

   ![monitor pool](./media/saas-dbpertenant-get-started-deploy/monitor-pool.png)

- The first chart, labeled **Resource utilization**, shows pool eDTU utilization.
- The second chart shows eDTU utilization of the five most active databases in the pool.

The two charts illustrate that elastic pools and SQL Database are well suited to unpredictable SaaS application workloads.
The charts show that 4 databases are each bursting to as much as 40 eDTUs, and yet all the databases are comfortably supported by a 50 eDTU pool. The 50 eDTU pool can support even heavier workloads.
If they were provisioned as standalone databases, each database would need to be an S2 (50 DTU) to support the bursts.
The cost of 4 standalone S2 databases would be nearly 3 times the price of the pool.
In real-world situations, SQL Database customers run up to 500 databases in 200 eDTU pools.
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

