---
title: Quickstart:Create a Traffic Manager profile in Azure| Microsoft Docs
description: This quickstart article describes how to create a Traffic Manager profile to build a highly available web application.
services: traffic-manager
documentationcenter: ''
author: kumudd
manager: jeconnoc
editor: ''
Customer intent: I want to create a Traffic Manager profile so that I can route traffic for high availability.
ms.assetid:
ms.service: traffic-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 07/10/2018
ms.author: kumud
---

# Quickstart: Create a Traffic Manager profile for high availability of a web application

 Azure Traffic Manager allows you to control the distribution of user traffic across the different Azure regions. This quickstart describes how to create a Traffic Manager profile that delivers high availability of your web application. Traffic Manager accomplishes this by monitoring your endpoints and providing automatic failover when an endpoint goes down. All traffic is routed to the primary endpoint while the secondary endpoint is kept as a backup. When the primary endpoint is unavailable, traffic is automatically routed to the secondary endpoint.

## Pre-requisites
This quickstart requires that you have already created two Azure Web Apps in two different Azure regions. The two Web Apps are used as endpoints for the Traffic Manager profile. To learn how to create an Azure Web App, use one of the quickstart guides in the [Azure Web Apps documentation page](https://docs.microsoft.com/azure/app-service/). 

### Create a Traffic Manager profile
Create a Traffic manager profile that directs user traffic based on endpoint [priority](traffic-manager-routing-methods.md#priority).
1. From a browser, sign in to the [Azure portal](http://portal.azure.com). If you don’t already have an account, you can sign-up for a [free one-month trial](https://azure.microsoft.com/free/). 
2. Select **Create a resource** > **Networking** > **Traffic Manager profile** > **Create**.
3. In the **Create Traffic Manager profile**, enter or select, the following information, accept the defaults for the remaining settings:
    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | Name                   | This name needs to be unique within the trafficmanager.net zone and results in the DNS name <name>, trafficmanager.net which is used to access your Traffic Manager profile.                                   |
    | Routing method          | Select the **Priority** routing method.                                       |
    | Subscription            | Select your subscription.                          |
    | Resource group          | Select **Create new** and enter *myResourceGroupTM*. |
    | Location                | Select **East US**.  This setting refers to the location of the resource group, and has no impact on the Traffic Manager profile that will be deployed globally.                              |
    |
  6. Click **Create**.
  7. When the global deployment of your Traffic Manager profile is complete, it is listed in respective resource group as one of the resources.

   ![Create a Traffic Manager profile](./media/traffic-manager-create-profile/traffic-manager-profile2.png)

## Add Traffic Manager endpoints

Add primary and secondary endpoints to your Traffic manager profile.

1. In the portal’s search bar, search for the Traffic Manager profile name that you created in the preceding section and select the profile in the results that the displayed.
2. In **Traffic Manager profile**, in the **Settings** section, click **Endpoints**, and then click **Add**.
3. Enter, or select, the following information, accept the defaults for the remaining settings, and then select **OK**:

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | Type                    | Azure endpoint                                   |
    | Name           | myPrimaryEndpoint                                        |
    | Target resource type           | App Service                          |
    | Target resource          | **Choose an app service** to show the listing of the Web Apps under the same subscription. In **Resource**, pick the App service that you want to add as the first endpoint. |
    | Priority               | Select **1**. This results in all traffic going to this endpoint if it is healthy.    |
    |        |           |

4. Click **OK**
     ![Add a Traffic Manager endpoint](./media/traffic-manager-create-profile/add-traffic-manager-endpoint2.png)
6. Repeat steps 3 and 4 for the next Azure Web Apps endpoint. Make sure to add it with its **Priority** value set at **2**.
6.	When the addition of both endpoints is complete, they are displayed in **Traffic Manager profile** along with their monitoring status as **Online**.
  

## Test Traffic Manager profile
Test how Traffic manager fails over to the secondary endpoint when the primary endpoint is unavailable.

1.	In the portal’s search bar, search for the **Traffic Manager profile** name that you created in the preceding section. In the results that are displayed, click the traffic manager profile.
1. Click **Overview**.
2. The **Traffic Manager profile** displays the DNS name of your newly created Traffic Manager profile.
    ![Add a Traffic Manager endpoint](./media/traffic-manager-create-profile/traffic-manager-dns-name.png)
3. In a web browser, type the DNS name of your Traffic Manager profile to view your web application. In this quickstart scenario, all requests are routed to the primary endpoint that is set to **Priority 1**.
4. To view Traffic Manager failover in action, you can disable your primary endpoint. To do so, under **Settings**, select **Endpoints**, select *MyPrimaryEndpoint*, and then select **Disabled**. You can still successfully access your web app in a web browser. This is because the user traffic now gets routed to the secondary endpoint since the primary endpoint is unavailable.

## Delete the Traffic Manager profile
When no longer needed, delete the resource group and the Traffic Manager profile that you have created. To do so, select the resource group from the **Traffic Manager profile** and click **Delete**.

## Next steps

- Learn how to [direct traffic to improve your app performance](traffic-manager-configure-performance-routing-method.md).




