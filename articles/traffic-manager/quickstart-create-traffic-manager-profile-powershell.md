---
title: Quickstart - Create a Traffic Manager profile for high availability of applications using Azure PowerShell
description: This quickstart article describes how to create a Traffic Manager profile to build a highly available web applications.
services: traffic-manager
author: KumudD
Customer intent: As an IT admin, I want to direct user traffic to ensure high availability of web applications.
ms.service: traffic-manager
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/20/2019
ms.author: kumud
---

# Quickstart: Create a Traffic Manager profile for a highly available web application using Azure PowerShell

This quickstart describes how to create a Traffic Manager profile that delivers high availability for your web application.

In this quickstart, you'll create two instances of a web application. Each of them is running in a different Azure region. You'll create a Traffic Manager profile based on [endpoint priority](traffic-manager-routing-methods.md#priority). The profile directs user traffic to the primary site running the web application. Traffic Manager continuously monitors the web application. If the primary site is unavailable, it provides automatic failover to the backup site.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) now.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Prerequisites

For this quickstart, you'll need two instances of a web application deployed in two different Azure regions (*East US* and *West Europe*). Each will serve as primary and failover endpoints for Traffic Manager.

### Create a Resource Group
Create resource groups in the two different Azure regions using `New-AzResourceGroup` command.

```azurepowershell-interactive
New-AzResourceGroup -Name myResourceGroupTM1 -Location EastUS
New-AzResourceGroup -Name MyResourceGroupTM2 -Location westeurope
```

## Create a Traffic Manager profile

Using the 'New-AzTrafficManagerProfile`, create a Traffic Manager profile that directs user traffic based on endpoint priority. In the below example, replace the "MyTrafficManagerProfile" with a unique name.

```azurepowershell-interactive
New-AzTrafficManagerProfile `
-Name MyTrafficManagerProfile `
-ResourceGroupName MyResourceGroupTM1 `
-TrafficRoutingMethod Priority `
-MonitorPath '/' `
-MonitorProtocol "HTTP" `
-RelativeDnsName MyTrafficManagerProfile `
-Ttl 30 -MonitorPort 80
```

### Create an App Service Plan
Create an App Service plan for the two instances of a web application that you will deploy in two different Azure regions. In the below example, replace the App Service plan names (WebAppEastUS-Plan, WebAppWestEurope-Plan) with unique names. 

```azurepowershell-interactive
New-AzAppservicePlan `
-Name WebAppEastUS-Plan `
-ResourceGroupName MyResourceGroupTM1 `
-Location eastus 
-Tier Standard

New-AzAppservicePlan `
-Name WebAppWestEurope-Plan `
-ResourceGroupName MyResourceGroupTM2 `
-Location westeurope
-Tier Standard
```

## Add Traffic Manager endpoints

Add the website in the *East US* as primary endpoint to route all the user traffic. Add the website in *West Europe* as a failover endpoint. When the primary endpoint is unavailable, traffic automatically routes to the failover endpoint.



## Test Traffic Manager profile

In this section, you'll check the domain name of your Traffic Manager profile. You'll also configure the primary endpoint to be unavailable. Finally, you get to see that the web app is still available. It's because Traffic Manager sends the traffic to the failover endpoint.

### Check the DNS name


### View Traffic Manager in action



## Clean up resources

When you're done, delete the resource groups, web applications, and all related resources. To do so, select each individual item from your dashboard and select **Delete** at the top of each page.

## Next steps

In this quickstart, you created a Traffic Manager profile. It allows you to direct user traffic for high-availability web applications. To learn more about routing traffic, continue to the Traffic Manager tutorials.

> [!div class="nextstepaction"]
> [Traffic Manager tutorials](tutorial-traffic-manager-improve-website-response.md)