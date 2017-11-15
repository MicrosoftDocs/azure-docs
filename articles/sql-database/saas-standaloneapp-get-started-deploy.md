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
ms.date: 11/14/2017
ms.author: sstein
---


# Deploy and explore a standalone single-tenant application that uses Azure SQL Database

In this tutorial, you deploy and explore the Wingtip Tickets SaaS Standlone Application. The application is designed to showcase features of Azure SQL Database that simplify enabling SaaS scenarios.

The Standalone Application pattern deploys an Azure resource group containing a single-tenant application and a single-tenant database for each tenant.  Multiple instances of the application can be provisioned to provide a multi-tenant solution.

While in this tutorial you will deploy resource groups for several tenants into your Azure subscription, this pattern allows the resource groups to be deployed into a tenant’s Azure subscription.  Azure has partner programs that allow these resource groups to be managed by a service provider on the tenant’s behalf as an admin in the tenant’s subscription.

In the deployment section below there are three Deploy to Azure buttons, each of which deploys a different instance of the application customized for a specific tenant. When each button is pressed the corresponding application is fully deployed five minutes later.  The apps are deployed in your Azure subscription.  You have full access to explore and work with the individual application components.

The application source code and management scripts are available in the [WingtipTicketsSaaS-StandaloneApp](https://github.com/Microsoft/WingtipTicketsSaaS-StandaloneApp) GitHub repo.


In this tutorial you learn:

> [!div class="checklist"]

> * How to deploy the Wingtip Tickets SaaS Standalone Application
> * Where to get the application source code, and management scripts
> * About the servers and databases that make up the app

Additional tutorials will be released in due course that will allow you to explore a range of management scenarios based on this application pattern.   

## Deploy the Wingtip Tickets SaaS Standalone Application

Deploy the app for the three provided tenants:

1. Click each **Deploy to Azure** button to open the deployment template in the Azure portal. Each template requires two parameter values; a name for a new resource group, and a user name that distinguishes this deployment from other deployments of the app. The next step provides details for setting these values.<br><br>
    <a href="http://aka.ms/deploywingtipsa-contoso" target="_blank"><img style="vertical-align:middle" src="media/saas-standaloneapp-get-started-deploy/deploy.png"/></a>     &nbsp;&nbsp;**Contoso Concert Hall**
<br><br>
    <a href="http://aka.ms/deploywingtipsa-dogwood" target="_blank"><img style="vertical-align:middle" src="media/saas-standaloneapp-get-started-deploy/deploy.png"/></a> &nbsp;&nbsp;**Dogwood Dojo**
<br><br>
    <a href="http://aka.ms/deploywingtipsa-fabrikam" target="_blank"><img style="vertical-align:middle" src="media/saas-standaloneapp-get-started-deploy/deploy.png"/></a>    &nbsp;&nbsp;**Fabrikam Jazz Club**

2. Enter required parameter values for each deployment.

    > [!IMPORTANT]
    > Some authentication, and server firewalls are intentionally unsecured for demonstration purposes. **Create a new resource group** for each application deployment.  Do not use an existing resource group. Do not use this application, or any resources it creates, for production. Delete all the resource groups when you are finished with the applications to stop related billing.

    It is best to use only lowercase letters, numbers, and hyphens in your resource names.
    * For **Resource group** - Select Create new, and then provide a Name for the resource group (case sensitive).
        * We recommend that all letters in your resource group name be lowercase.
        * We recommend that you append a dash, followed by your initials, followed by a digit: for example, _wingtip-sa-af1_.
        * Select a Location from the drop-down list.

    * For **User** - We recommend that you choose a short User value, such as your initials plus a digit: for example, _af1_.


1. **Deploy the application**.

    * Click to agree to the terms and conditions.
    * Click **Purchase**.

1. Monitor deployment status of all three deployments by clicking **Notifications** (the bell icon right of the search box). Deploying the app takes approximately five minutes.


## Run the application

The app showcases venues, such as concert halls, jazz clubs, and sports clubs, that host events. Venues register as customers (or tenants) of Wingtip Tickets , for an easy way to list events and sell tickets. Each venue gets a personalized web site to manage and list their events and sell tickets, independent and isolated from other tenants. Under the covers, each tenant gets a separate application instance and standalone SQL database.

1. Open the events page for each of the three tenants in separate browser tabs:

    http://events.contosoconcerthall.&lt;USER&gt;.trafficmanager.net <br>
    http://events.dogwooddojo.&lt;USER&gt;.trafficmanager.net<br>
    http://events.fabrikamjazzclub.&lt;USER&gt;.trafficmanager.net

    (replace &lt;USER&gt; with your deployment's User value).

   ![Events](./media/saas-standaloneapp-get-started-deploy/fabrikam.png)


To control the distribution of incoming requests, the app uses [*Azure Traffic Manager*](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-overview). Each tenant-specific app includes the tenant name as part of the domain name in the URL. All the tenant URLs include your specific *User* value and follow this format: http://events.&lt;venuename&gt;.&lt;USER&gt;.trafficmanager.net. Each tenant's database location is included in the app settings of the corresponding deployed app.

In a production environment, you would typically create a CNAME DNS record to [*point a company internet domain*](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-point-internet-domain) to the URL of the traffic manager profile.


## Explore the servers and tenant databases

Let’s look at some of the resources that were deployed:

1. In the [Azure portal](http://portal.azure.com), browse to the list of resource groups.  You should see the **wingtip-sa-catalog-&lt;USER&gt;** resource group in which **catalog-sa-&lt;USER&gt;** server is deployed with the **tenantcatalog** database. You should also see the three tenant resource groups.

1. Open the **wingtip-sa-fabrikam-&lt;USER&gt;** resource group, which contains the resources for the Fabrikam Jazz Club deployment.  The **fabrikamjazzclub-&lt;USER&gt;** server contains the **fabrikamjazzclub** database.


Each tenant database is a 50 DTU _Standalone_ database.

## Next steps

In this tutorial you learned:

> [!div class="checklist"]

> * How to deploy the Wingtip Tickets SaaS Standalone Application
> * About the servers and databases that make up the app
> * How to delete sample resources to stop related billing


## Additional resources

<!--* Additional [tutorials that build on the Wingtip SaaS application](sql-database-wtp-overview.md#sql-database-wingtip-saas-tutorials)
* To learn about elastic pools, see [*What is an Azure SQL elastic pool*](https://docs.microsoft.com/azure/sql-database/sql-database-elastic-pool)
* To learn about elastic jobs, see [*Managing scaled-out cloud databases*](https://docs.microsoft.com/azure/sql-database/sql-database-elastic-jobs-overview) -->
* To learn about multi-tenant SaaS applications, see [*Design patterns for multi-tenant SaaS applications*](saas-tenancy-app-design-patterns.md)
