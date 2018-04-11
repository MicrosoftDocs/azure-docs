---
title: Multi-tenant SaaS tutorial - Azure SQL Database | Microsoft Docs
description: "Deploy and explore a standalone single-tenant SaaS application, that uses Azure SQL Database."
keywords: sql database tutorial
services: sql-database
documentationcenter: ''
author: stevestein
manager: craigg
editor: ''
ms.assetid:
ms.service: sql-database
ms.custom: scale out apps
ms.workload: "Inactive"
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/30/2017
ms.author: genemi
---
# Deploy and explore a standalone single-tenant application that uses Azure SQL Database

In this tutorial, you deploy and explore the Wingtip Tickets SaaS Standalone Application. The application is designed to showcase features of Azure SQL Database that simplify enabling SaaS scenarios.

The Standalone Application pattern deploys an Azure resource group containing a single-tenant application and a single-tenant database for each tenant.  Multiple instances of the application can be provisioned to provide a multi-tenant solution.

In this tutorial, you deploy resource groups for several tenants into your Azure subscription.  This pattern allows the resource groups to be deployed into a tenant’s Azure subscription. Azure has partner programs that allow these resource groups to be managed by a service provider on the tenant’s behalf. The service provider is an admin in the tenant’s subscription.

In the later deployment section, there are three blue **Deploy to Azure** buttons. Each button deploys a different instance of the application. Each instance is customized for a specific tenant. When each button is pressed, the corresponding application is fully deployed within five minutes.  The apps are deployed in your Azure subscription.  You have full access to explore and work with the individual application components.

The application source code and management scripts are available in the [WingtipTicketsSaaS-StandaloneApp](https://github.com/Microsoft/WingtipTicketsSaaS-StandaloneApp) GitHub repo.


In this tutorial you learn:

> [!div class="checklist"]
> * How to deploy the Wingtip Tickets SaaS Standalone Application.
> * Where to get the application source code, and management scripts.
> * About the servers and databases that make up the app.

Additional tutorials will be released. They will allow you to explore a range of management scenarios based on this application pattern.   

## Deploy the Wingtip Tickets SaaS Standalone Application

Deploy the app for the three provided tenants:

1. Click each blue **Deploy to Azure** button to open the deployment template in the [Azure portal](https://portal.azure.com). Each template requires two parameter values; a name for a new resource group, and a user name that distinguishes this deployment from other deployments of the app. The next step provides details for setting these values.<br><br>
    <a href="http://aka.ms/deploywingtipsa-contoso" target="_blank"><img style="vertical-align:middle" src="media/saas-standaloneapp-get-started-deploy/deploy.png"/></a> &nbsp; **Contoso Concert Hall**
<br><br>
    <a href="http://aka.ms/deploywingtipsa-dogwood" target="_blank"><img style="vertical-align:middle" src="media/saas-standaloneapp-get-started-deploy/deploy.png"/></a> &nbsp; **Dogwood Dojo**
<br><br>
    <a href="http://aka.ms/deploywingtipsa-fabrikam" target="_blank"><img style="vertical-align:middle" src="media/saas-standaloneapp-get-started-deploy/deploy.png"/></a> &nbsp; **Fabrikam Jazz Club**

2. Enter required parameter values for each deployment.

    > [!IMPORTANT]
    > Some authentication and server firewalls are intentionally unsecured for demonstration purposes. **Create a new resource group** for each application deployment.  Do not use an existing resource group. Do not use this application, or any resources it creates, for production. Delete all the resource groups when you are finished with the applications to stop related billing.

    It is best to use only lowercase letters, numbers, and hyphens in your resource names.
    * For **Resource group** - Select **Create new**, and then provide a lowercase **Name** for the resource group.
        * We recommend that you append a dash, followed by your initials, followed by a digit: for example, *wingtip-sa-af1*.
        * Select a **Location** from the drop-down list.

    * For **User** - We recommend that you choose a short user value, such as your initials plus a digit: for example, *af1*.


3. **Deploy the application**.

    * Click to agree to the terms and conditions.
    * Click **Purchase**.

4. Monitor deployment status of all three deployments by clicking **Notifications** (the bell icon to the right of the search box). Deploying the app takes five minutes.


## Run the application

The app showcases venues that host events. Venue types include concert halls, jazz clubs, and sports clubs. Venues are the customers of the Wingtip Tickets app. In Wingtip Tickets, venues are registered as *tenants*. Being a tenant gives a venue an easy way to list events and to sell tickets to their customers. Each venue gets a personalized web site to list their events and to sell tickets. Each tenant is isolated from other tenants, and is independent from them. Under the covers, each tenant gets a separate application instance with its own standalone SQL database.

1. Open the events page for each of the three tenants in separate browser tabs:

    - http://events.contosoconcerthall.&lt;USER&gt;.trafficmanager.net
    - http://events.dogwooddojo.&lt;USER&gt;.trafficmanager.net
    - http://events.fabrikamjazzclub.&lt;USER&gt;.trafficmanager.net

    (In each URL, replace &lt;USER&gt; with your deployment's user value.)

   ![Events](./media/saas-standaloneapp-get-started-deploy/fabrikam.png)

To control the distribution of incoming requests, the app uses [*Azure Traffic Manager*](../traffic-manager/traffic-manager-overview.md). Each tenant-specific app instance includes the tenant name as part of the domain name in the URL. All the tenant URLs include your specific **User** value. The URLs follow the following format:
- http://events.&lt;venuename&gt;.&lt;USER&gt;.trafficmanager.net

Each tenant's database **Location** is included in the app settings of the corresponding deployed app.

In a production environment, typically you create a CNAME DNS record to [*point a company internet domain*](../traffic-manager/traffic-manager-point-internet-domain.md) to the URL of the traffic manager profile.


## Explore the servers and tenant databases

Let’s look at some of the resources that were deployed:

1. In the [Azure portal](http://portal.azure.com), browse to the list of resource groups.
2. See the **wingtip-sa-catalog-&lt;USER&gt;** resource group.
    - In this resource group, the **catalog-sa-&lt;USER&gt;** server is deployed. The server contains the **tenantcatalog** database.
    - You should also see the three tenant resource groups.
3. Open the **wingtip-sa-fabrikam-&lt;USER&gt;** resource group, which contains the resources for the Fabrikam Jazz Club deployment.  The **fabrikamjazzclub-&lt;USER&gt;** server contains the **fabrikamjazzclub** database.

Each tenant database is a 50 DTU *Standalone* database.

## Additional resources

<!--
* Additional [tutorials that build on the Wingtip SaaS application](sql-database-wtp-overview.md#sql-database-wingtip-saas-tutorials)
* To learn about elastic pools, see [*What is an Azure SQL elastic pool*](https://docs.microsoft.com/azure/sql-database/sql-database-elastic-pool)
* To learn about elastic jobs, see [*Managing scaled-out cloud databases*](https://docs.microsoft.com/azure/sql-database/sql-database-elastic-jobs-overview)
-->

- To learn about multi-tenant SaaS applications, see [Design patterns for multi-tenant SaaS applications](saas-tenancy-app-design-patterns.md).


## Next steps

In this tutorial you learned:

> [!div class="checklist"]
> * How to deploy the Wingtip Tickets SaaS Standalone Application.
> * About the servers and databases that make up the app.
> * How to delete sample resources to stop related billing.

