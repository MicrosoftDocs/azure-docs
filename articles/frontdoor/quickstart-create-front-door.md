---
title: Azure Quickstart - Create a Front Door profile for high availability of applications using the Azure portal
description: This quickstart article describes how to create a Front Door for your highly available and high performance global web application.
services: front-door
documentationcenter: ''
author: sharad4u
editor: ''
ms.assetid:
ms.service: frontdoor
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 08/31/2018
ms.author: sharadag
# Customer intent: As an IT admin, I want to direct user traffic to ensure high availability of web applications.
---

# Quickstart: Create a Front Door for a highly available global web application

This quickstart describes how to create a Front Door profile that delivers high availability and high performance for your global web application. 

The scenario described in this quickstart includes two instances of a web application running in different Azure regions. A Front Door configuration based on equal [weighted and same priority backends](front-door-routing-methods.md) is created that helps direct user traffic to the nearest set of site backends running the application. Front Door continuously monitors the web application and provides automatic failover to the next available backend when the nearest site is unavailable.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Sign in to Azure 
Sign in to the Azure portal at https://portal.azure.com.

## Prerequisites
This quickstart requires that you have deployed two instances of a web application running in different Azure regions (*East US* and *West Europe*). Both the web application instances run in Active/Active mode, that is, either of them can take traffic at any time unlike a Active/Stand-By configuration where one acts as a failover.

1. On the top left-hand side of the screen, select **Create a resource** > **Web** > **Web App** > **Create**.
2. In **Web App**, enter or select the following information and enter default settings where none are specified:

     | Setting         | Value     |
     | ---              | ---  |
     | Name           | Enter a unique name for your web app  |
     | Resource group          | Select **New**, and then type *myResourceGroupFD1* |
     | App Service plan/Location         | Select **New**.  In the App Service plan, enter  *myAppServicePlanEastUS*, and then select **OK**. 
     |      Location  |   East US        |
    |||

3. Select **Create**.
4. A default website is created when the Web App is successfully deployed.
5. Repeat steps 1-3 to create a second website in a different Azure region with the following settings:

     | Setting         | Value     |
     | ---              | ---  |
     | Name           | Enter a unique name for your Web App  |
     | Resource group          | Select **New**, and then type *myResourceGroupFD2* |
     | App Service plan/Location         | Select **New**.  In the App Service plan, enter  *myAppServicePlanWestEurope*, and then select **OK**. 
     |      Location  |   West Europe      |
    |||


## Create a Front Door for your application
### A. Add a frontend host for Front Door
Create a Front Door configuration that directs user traffic based on lowest latency between the two backends.

1. On the top left-hand side of the screen, select **Create a resource** > **Networking** > **Front Door** > **Create**.
2. In the **Create a Front Door**, you start with adding the basic info and provide a subscription where you want the Front Door to be configured. Similarly, like any other Azure resource you also need to provide a ResourceGroup and a Resource Group region if you are creating a new one. Lastly, you need to  provide a name for your Front Door.
3. Once the basic info is filled in, the first step you need to define is the **frontend host** for the configuration. The result should be a valid domain name like `myappfrontend.azurefd.net`. This hostname needs to be globally unique but Front Door will take care of that validation. 

### B. Add application backend and backend pools

Next, you need to configure your application backend(s) in a backend pool for Front Door to know where your application resides. 

1. Click the '+' icon to add a backend pool and then specify a **name** for your backend pool, say `myBackendPool`.
2. Next, click on Add Backends to add your websites created earlier.
3. Select **Target host type** as 'App Service', select the subscription in which you created the web site and then choose the first web site from the **Target host name**, that is, *myAppServicePlanEastUS.azurewebsites.net*.
4. Leave the remaining fields as is for now and click **Add'**.
5. Repeat steps 2 to 4 to add the other website, that is, *myAppServicePlanWestEurope.azurewebsites.net*
6. You can optionally choose to update the Health Probes and Load Balancing settings for the backend pool, but the default values should also work. Click **Add**.


### C. Add a routing rule
Lastly, click the '+' icon on Routing rules to configure a routing rule. This is needed to map your frontend host to the backend pool, which basically is configuring that if a request comes to `myappfrontend.azurefd.net`, then forward it to the backend pool `myBackendPool`. 
Click **Add** to add the routing rule for your Front Door. You should now be good to creating the Front Door and so click on **Review and Create**.

>[!WARNING]
> You **must** ensure that each of the frontend hosts in your Front Door has a routing rule with a default path ('/\*') associated with it. That is, across all of your routing rules there must be at least one routing rule for each of your frontend hosts defined at the default path ('/\*'). Failing to do so, may result in your end-user traffic not getting routed correctly.

## View Front Door in action
Once you create a Front Door, it will take a few minutes for the configuration to be deployed globally everywhere. Once complete, access the frontend host you created, that is, go to a web browser and hit the URL `myappfrontend.azurefd.net`. Your request will automatically get routed to the nearest backend to you from the specified backends in the backend pool. 

### View Front Door handle application failover
If you want to test Front Door's instant global failover in action, you can go to one of the web sites you created and stop it. Based on the Health Probe setting defined for the backend pool, we will instantly fail over the traffic to the other web site deployment. 
You can also test  behavior, by disabling the backend in the backend pool configuration for your Front Door. 

## Clean up resources
When no longer needed, delete the resource groups, web applications, and all related resources.

## Next steps
In this quickstart, you created a Front Door that allows you to direct user traffic for web applications that require high availability and maximum performance. To learn more about routing traffic, read the [Routing Methods](front-door-routing-methods.md) used by Front Door.