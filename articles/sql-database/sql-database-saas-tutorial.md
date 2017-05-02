---
title: Deploy and Explore the WTP application  (a sample SaaS application using Azure SQL Database) | Microsoft Docs 
description: "Deploy and explore a sample SaaS application that uses Azure SQL Database"
keywords: sql database tutorial
services: sql-database
documentationcenter: ''
author: stevestein
manager: jhubbard
editor: ''

ms.assetid: 
ms.service: sql-database
ms.custom: tutorial
ms.workload: data-management
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: hero-article
ms.date: 04/28/2017
ms.author: billgib; sstein

---
# Deploy and explore a multi-tenant SaaS Application that uses Azure SQL Database

In this tutorial, you deploy and explore the Wingtip Tickets Platform (WTP) SaaS application. The application uses a database-per-tenant, SaaS application pattern, to service multiple tenants. The application is designed to showcase features of Azure SQL Database that enable SaaS scenarios, and SaaS design and management patterns.

Five minutes after clicking the _Deploy to Azure_ button below, you’ll have a multi-tenant SaaS application up and running in the cloud. The application is deployed with three sample tenants, each with its own database, all deployed into an elastic pool. The application allows new tenants to sign up for the WTP service, which automatically provisions new tenant databases into the pool.

In this tutorial, you learn how to:

* Deploy the WTP application. The app is deployed to your Azure subscription, giving you full access to inspect and work with the individual application components.
* Explore the application and application architecture. Browse the web apps, servers, pools, and databases that make up the app.
* Sign up and configure new customers (tenants).
* Delete the application and all resources created with it to stop billing in Azure.

To explore various SaaS design and management patterns, a [series of related tutorials](sql-database-wtp-overview.md) is available that build upon this initial WTP app deployment. While going through the tutorials, dive into the provided scripts, and examine how the different SaaS patterns are implemented. Step through the scripts in each tutorial to gain a deeper understanding how to implement the many SQL Database features that simplify developing SaaS applications.

## Deploy the Wingtip tickets (WTP) SaaS Application

Deploy the Wingtip tickets platform in less than 5 minutes

1. Click to deploy:

   [![Deploy to Azure](./media/sql-database-saas-tutorial/deploy.png)](https://aka.ms/deploywtpapp)

1. Enter required parameter values for the deployment:

    > [!IMPORTANT]
    > Some authentication, and server firewalls are intentionally wide-open for demonstration purposes. Do not use existing resource groups, servers, or pools, and do not use this application, or any resources it creates, for production. You should **create a new resource group**. Delete this resource group when you are finished with the application to delete all WTP application-related resources, and to stop billing.

    * **Resource group** - Select **Create new** and provide a **Name** and **Location**.
    * **User** - Because some resources require names that are unique across all Azure subscriptions, provide a value to differentiate resources you create from those created by other users deploying this application. It’s recommended to use a short User name, such as your initials plus a number (for example, bg1), and then use that in the resource group name (for example,wingtip-bg1). The **User** parameter can only contain letters, numbers, and hyphens, and the first and last character must be a letter or a number (all lowercase is recommended).

     ![template](./media/sql-database-saas-tutorial/template.png)

1. **Deploy the application**.

    * Click if you agree to the terms and conditions.
    * Select **Pin to dashboard**.
    * Click **Purchase**.

1. Monitor deployment status by clicking **Notifications** (the bell icon right of the search box). Deploying the WTP app takes approximately 4 minutes.


## Explore the application

The app showcases venues, such as concert halls, jazz clubs, sports clubs, that host events. Venues register as customers (or tenants) of the Wingtip Tickets Platform (WTP), for an easy way to list events and sell tickets. Each venue gets a personalized web app to manage and list their events and sell tickets - independent and isolated from other tenants. Under the covers, each tenant gets a SQL database deployed into a SQL Elastic pool.

A central **Events Hub** provides a list of tenant URLs specific to your deployment. All of the tenant URLs include your specific _User_ value and follow this format: http://events.wtp.&lt;USER&gt;.trafficmanager.net/*fabrikamjazzclub*. 

1. Open the _Events Hub_: http://events.wtp.&lt;USER&gt;.trafficmanager.net (replace with your User name):

    ![events hub](media/sql-database-saas-tutorial/events-hub.png)

1. Click **Fabrikam Jazz Club** in the *Events Hub*.

1. Click **Tickets** to purchase tickets to an event.

   ![Events](./media/sql-database-saas-tutorial/fabrikam.png)

The WTP application uses [*Azure Traffic Manager*](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-overview) to control the distribution of traffic. The events pages, which are tenant-specific, require that tenant names are included in the URLs. The events app parses the tenant name out of the URL path and uses it to create a key that is used to access a catalog implemented using [*shard map management*](https://docs.microsoft.com/azure/sql-database/sql-database-elastic-scale-shard-map-management). The catalog maps the key to the tenant’s database location. The **Events Hub** uses extended metadata in the catalog to retrieve the tenant’s name associated with each database.

Note that in a production environment, you would typically create a CNAME DNS record to [*point a company internet domain*](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-point-internet-domain) to the traffic manager profile.


## Provision a new tenant

The initial deployment creates 3 sample tenants, but we need more tenants for the best tutorial experience, so lets create a new tenant. A PowerShell script is provided that quickly provisions a new tenant. We'll dive deeper into the details of provisioning new tenants in the [Provision and catalog tutorial](sql-database-saas-tutorial-provision-and-catalog.md) where you can see how simple it is to implement a registration component into the application and automatically provision tenants as customers sign up.


### Initialize the user config file

Because this is the first script you are going to run after the initial WTP application deployment, you must update the user configuration file with the specific values from your deployment (you only need to do this once).

    1. Open ...\\Learning Modules\\_UserConfig.psm1_ in the **PowerShell ISE**
    1. Modify _$userConfig.ResourceGroupName_ to the _resource group_ you set when you deployed app.
    1. Modify _$userConfig.Name_ to the _User_ name you set when you deployed app.

### Provision the new tenant

1. Open _...\\Learning Modules\Provision and Catalog\_Demo-ProvisionAndCatalog.psm1__ in the PowerShell ISE.
1. Press **F5** to run the script (leave the script's default values for now).

The provisioning completes. A new tenant is registered into the catalog, their database is created and added to a SQL elastic pool. After successful provisioning, the new tenant's ticket selling site appears in your browser:

![New tenant](./media/sql-database-saas-tutorial/red-maple-racing.png)

* Refresh the Events Hub and verify the new tenant is in the list.

## Start generating load on the tenant databases

Now that we have several tenant databases, let’s put them to work! A PowerShell script is provided that simulates a workload running against all tenant databases. The load will run for 60 minutes by default. This is a SaaS app, and the real-world load on a SaaS app is typically sporadic and unpredictable. To simulate this the load generator produces a randomized load distributed across all tenants. A few minutes are needed for the pattern to emerge, so let the load generator run for about 5-10 minutes before attempting to monitor the load in the following sections.

1. Open ...\\Learning Modules\Utilities\_Demo-LoadGenerator.psm1_ in the **PowerShell ISE**
1. Press **F5** to run the script and start the load generator (leave the default parameter values for now).

> [!IMPORTANT]
> The load generator is running as a series of jobs in your local PowerShell session so keep the PowerShell session open! If you close PowerShell, or the tab the load generator was started in, or suspend your machine, the jobs will stop.



## Explore the servers, pools, and tenant databases

Now that you have explored the application, provisioned a new tenant, and started running a load against the collection of tenants, let’s look at some of the resources that were deployed.

1. In the [*Azure portal*](http://portal.azure.com), open the **catalog-&lt;USER&gt;** server. The catalog server contains 2 databases; the tenantscatalog, and the baseTenantDB (an empty _golden_ db that is copied to create new tenants).

   ![databases](./media/sql-database-saas-tutorial/databases.png)

1. Open the **tenants1-&lt;USER&gt;** server which holds the tenant databases. Note that each tenant database is an _Elastic Standard_ database in a 50 eDTU standard pool. Also notice there is a _Red Maple Racing_ database, the tenant that you provisioned previously.

   ![server](./media/sql-database-saas-tutorial/server.png)

## Monitor the pool

As long as the load generator has been running for several minutes, enough data should be available to start looking at some of the monitoring capabilities built into pools and databases.

1. Browse to server tenants1-&lt;USER&gt;, and click **Pool1** to view resource utilization for the pool:

   ![monitor pool](./media/sql-database-saas-tutorial/monitor-pool.png)

What these two charts nicely illustrate, is how well suited elastic pools and SQL Database are for SaaS application workloads. Four databases that are each bursting to as much as 40 eDTUs are easily being supported in a 50 eDTU pool. If each was provisioned as a standalone database, they would each need to be an S2 (50 DTU) to support the bursts, yet the cost of 4 standalone S2 databases would be nearly 3 times the price of the pool. And the pool still has plenty of headroom for many more databases. In real-world situations, customers are currently running up to 500 databases in 200 eDTU pools. For more information, see the [performance monitoring tutorial](sql-database-saas-tutorial-performance-monitoring.md).

## Want to learn more about SaaS applications?

A series of tutorials is provided that accompany the WTP app which each explores a different set of SaaS patterns through hand-on exercises that lead you through sample scripts and templates. Each exercise is quick to do and the tutorials can be followed in any order. To locate the tutorials look in the folders beneath …\\Learning Modules\\.

## Deleting the resources created with this tutorial

When you are finished exploring and working with the WTP app, browse to the application's resource group in the portal and delete it to stop all billing related to this deployment. If you have used any of the accompanying tutorials, any resources they created will also be deleted with the application.


## Next steps

Check out the [Provision and catalog tutorial](sql-database-saas-tutorial-provision-and-catalog.md) to learn about creating new tenants and successfully adding them into the catalog that maintains the mapping between tenants and their data. Complete the _Provision and catalog_ tutorial and provision the batch of tenants, resulting in more over 20 tenants that better illustrate the many SaaS patterns showcased throughout the tutorials.


## Additional resources

* To learn about elastic pools, see [*What is an Azure SQL elastic pool*](https://docs.microsoft.com/azure/sql-database/sql-database-elastic-pool)
* To learn about elastic jobs, see [*Managing scaled-out cloud databases*](https://docs.microsoft.com/azure/sql-database/sql-database-elastic-jobs-overview)
* To learn about multi-tenant SaaS applications, see [*Design patterns for multi-tenant SaaS applications*](https://docs.microsoft.com/azure/sql-database/sql-database-design-patterns-multi-tenancy-saas-applications)
