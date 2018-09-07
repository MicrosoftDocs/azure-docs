---
title: Quickstart - Create a Traffic Manager profile for high availability of applications using the Azure portal
description: This quickstart article describes how to create a Traffic Manager profile to build a highly available web applications.
services: traffic-manager
documentationcenter: ''
author: kumudd
manager: jeconnoc
editor: ''
Customer intent: As an IT admin, I want to direct user traffic to ensure high availability of web applications.
ms.assetid:
ms.service: traffic-manager
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 07/18/2018
ms.author: kumud
---

# Quickstart: Create a Traffic Manager profile for a highly available web application

This quickstart describes how to create a Traffic Manager profile that delivers high availability of your web application. 

The scenario described in this quickstart includes two instances of a web application running in different Azure regions. A Traffic Manager profile based on [endpoint priority](traffic-manager-routing-methods.md#priority) is created that helps direct user traffic to the primary site running the application. Traffic Manager continuously monitors the web application and provides automatic failover to the backup site when the primary site is unavailable.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Sign in to Azure 
Sign in to the Azure portal at https://portal.azure.com.

## Prerequisites
This quickstart requires that you have deploy two instances of a web application running in different Azure regions (*East US* and *West Europe*). The two web application instances serve as primary and backup endpoints for Traffic Manager.

1. On the top left-hand side of the screen, select **Create a resource** > **Web** > **Web App** > **Create**.
2. In **Web App**, enter or select the following information and enter default settings where none are specified:

     | Setting         | Value     |
     | ---              | ---  |
     | Name           | Enter a unique name for your web app  |
     | Resource group          | Select **New**, and then type *myResourceGroupTM1* |
     | App Service plan/Location         | Select **New**.  In the App Service plan, enter  *myAppServicePlanEastUS*, and then select **OK**. 
     |      Location  |   East US        |
    |||

3. Select **Create**.
4. A default website is created when the Web App is successfully deployed.
5. Repeat steps 1-3 to create a second website in a different Azure region with the following settings:

     | Setting         | Value     |
     | ---              | ---  |
     | Name           | Enter a unique name for your Web App  |
     | Resource group          | Select **New**, and then type *myResourceGroupTM2* |
     | App Service plan/Location         | Select **New**.  In the App Service plan, enter  *myAppServicePlanWestEurope*, and then select **OK**. 
     |      Location  |   West Europe      |
    |||


## Create a Traffic Manager profile
Create a Traffic manager profile that directs user traffic based on endpoint priority.

1. On the top left-hand side of the screen, select **Create a resource** > **Networking** > **Traffic Manager profile** > **Create**.
2. In the **Create Traffic Manager profile**, enter or select, the following information, accept the defaults for the remaining settings, and then select **Create**:
    
    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | Name                   | This name needs to be unique within the trafficmanager.net zone and results in the DNS name, **trafficmanager.net** which is used to access your Traffic Manager profile.|
    | Routing method          | Select the **Priority** routing method.|
    | Subscription            | Select your subscription.|
    | Resource group          | Select **Existing** and then select *myResourceGroupTM1*.|
    |Location |This setting refers to the location of the resource group, and has no impact on the Traffic Manager profile that will be deployed globally.|
    |||
    
    
   ![Create a Traffic Manager profile](./media/quickstart-create-traffic-manager-profile/traffic-manager-profile.png)


## Add Traffic Manager endpoints

Add the website in the *East US* as primary endpoint to route all the user traffic. Add the website in *West Europe* as a backup endpoint. When the primary endpoint is unavailable, traffic is automatically routed to the secondary endpoint.

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
    
4. Repeat steps 2 and 3 for the next Web Apps endpoint. Make sure to add it with its **Priority** value set at **2**.
5.	When the addition of both endpoints is complete, they are displayed in **Traffic Manager profile** along with their monitoring status as **Online**.

    ![Add a Traffic Manager endpoint](./media/quickstart-create-traffic-manager-profile/add-traffic-manager-endpoint2.png)

## Test Traffic Manager profile
In this section, you first determine the domain name of your Traffic Manager profile and then view how the Traffic Manager fails over to the secondary endpoint when the primary endpoint is unavailable.
### Determine the DNS name
1.	In the portal’s search bar, search for the **Traffic Manager profile** name that you created in the preceding section. In the results that are displayed, click the traffic manager profile.
2. Click **Overview**.
3. The **Traffic Manager profile** displays the DNS name of your newly created Traffic Manager profile.
  
   ![Traffic Manager DNS name](./media/quickstart-create-traffic-manager-profile/traffic-manager-dns-name.png)

### View Traffic Manager in action

1. In a web browser, type the DNS name of your Traffic Manager profile to view your Web App's default website. In this quickstart scenario, all requests are routed to the primary endpoint that is set to **Priority 1**.

![Test Traffic Manager profile](./media/quickstart-create-traffic-manager-profile/traffic-manager-test.png)

2. To view Traffic Manager failover in action, disable your primary site as follows:
    1. In the Traffic Manager Profile page, select **Settings**>**Endpoints**>*MyPrimaryEndpoint*.
    2. In *MyPrimaryEndpoint*, select **Disabled**. 
    3. The primary endpoint *MyPrimaryEndpoint* status now shows as **Disabled**.
3. Copy the DNS name of your Traffic Manager Profile from the preceding step to successfully view the website in a web browser. When the primary endpoint is disabled, the user traffic gets routed to the secondary endpoint.

## Clean up resources
When no longer needed, delete the resource groups, web applications, and all related resources. To do so, select the resource groups (*myResourceGroupTM1* and *myResourceGroupTM2*) and click **Delete**.

## Next steps
In this quickstart, you created a Traffic Manager profile that allows you to direct user traffic for highly availability web application. To learn more about routing traffic, continue to the tutorials for Traffic Manager.

> [!div class="nextstepaction"]
> [Traffic Manager tutorials](tutorial-traffic-manager-improve-website-response.md)






