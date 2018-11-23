---
title: Quickstart - Create a Traffic Manager profile for high availability of applications using the Azure portal
description: This quickstart article describes how to create a Traffic Manager profile to build a highly available web applications.
services: traffic-manager
documentationcenter: ''
author: kumudd
Customer intent: As an IT admin, I want to direct user traffic to ensure high availability of web applications.
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

In this quickstart, you'll read about two instances of a web application. Each of them is running in a different Azure region. A Traffic Manager profile is created based on [endpoint priority](traffic-manager-routing-methods.md#priority). The profile directs user traffic to the primary site running the web application. Traffic Manager continuously monitors the web application. If the primary site is unavailable, it provides automatic failover to the backup site.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Prerequisites

For this quickstart, get two instances of a web application deployed in two different Azure regions (*East US* and *West Europe*). Each will serve as primary and backup endpoints for Traffic Manager.

1. On the upper left side of the screen, select **Create a resource** > **Web** > **Web App**.
2. In **Web App**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | App name | Enter a unique name for your web app.  |
    | Subscription | Select the subscription you want the web app applied to. |
    | Resource Group | Select **Create new**, and type *myResourceGroupTM1*. |
    | OS | Select **Windows** as your operating system. |
    | Publish | Select **Code** as the format you want to publish to. |

3. Select **App Service plan/Location**.
4. In **App Service plan**, select **Create new**.
5. In **New App Service Plan**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | App Service plan | Enter *myAppServicePlanEastUS*. |
    | Location | East US |
    | Pricing tier | SI Standard |

6. Select **OK**.

7. In **Web App**, select **Create**. A default website is created when the Web App is successfully deployed.

8. To create a second website in a different Azure region, repeat steps 1-7 with these settings:

    | Setting | Value |
    | --------| ----- |
    | Name | Enter a unique name for your web app. |
    | Subscription | Select the subscription you want the web app applied to. |
    | Resource group | Select **Create new**, and then type *myResourceGroupTM2*. |
    | OS | Select **Windows** as your operating system. |
    | Publish | Select **Code** as the format you want to publish to. |
    | App Service plan/Location | Enter *myAppServicePlanWestEurope*. |
    | Location | West Europe |

## Create a Traffic Manager profile

Create a Traffic Manager profile that directs user traffic based on endpoint priority.

1. On the upper left side of the screen, select **Create a resource** > **Networking** > **Traffic Manager profile**.
2. In the **Create Traffic Manager profile**, enter or select this information:

    | Setting | Value |
    | --------| ----- |
    | Name | Enter a unique name for your Traffic Manager profile.|
    | Routing method | Select **Priority**.|
    | Subscription | Select the subscription you want the traffic manager profile applied to. |
    | Resource group | Select *myResourceGroupTM1*.|
    | Location |This setting refers to the location of the resource group, and has no impact on the Traffic Manager profile that will be deployed globally.|

3. Select **Create**.

## Add Traffic Manager endpoints

Add the website in the *East US* as primary endpoint to route all the user traffic. Add the website in *West Europe* as a backup endpoint. When the primary endpoint is unavailable, traffic is automatically routed to the secondary endpoint.

1. In the portal's search bar, enter the Traffic Manager profile name that you created in the preceding section.
2. Select the profile from the search results.
3. In **Traffic Manager profile**, in the **Settings** section, click **Endpoints**, and then click **Add**.
4. Enter, or select, this information:

    | Setting | Value |
    | ------- | ------|
    | Type | Select **Azure endpoint**. |
    | Name | Enter *myPrimaryEndpoint*. |
    | Target resource type | App Service |
    | Target resource | Select **Choose an app service** > **East US**. |
    | Priority | Select **1**. This results in all traffic going to this endpoint if it is healthy. |

    ![Add a Traffic Manager endpoint](./media/quickstart-create-traffic-manager-profile/add-traffic-manager-endpoint.png)

5. Select **OK**.
6. To create a failover endpoint for your second Azure region, repeat steps 3 and 4 with these settings:

    | Setting | Value |
    | ------- | ------|
    | Type | Select Azure endpoint. |
    | Name | myFailoverEndpoint |
    | Target resource type | App Service |
    | Target resource | Select **Choose an app service** > **West Europe**. |
    | Priority | Select **2**. This results in all traffic going to this failover endpoint if the primary endpoint is unhealthy. |

7. Select **OK**.

When the addition of both endpoints is complete, they are displayed in **Traffic Manager profile** along with their monitoring status as **Online**.

## Test Traffic Manager profile

In this section, you'll first determine the domain name of your Traffic Manager profile and then view how the Traffic Manager fails over to the secondary endpoint when the primary endpoint is unavailable.

### Determine the DNS name

1. In the portal’s search bar, search for the **Traffic Manager profile** name that you created in the preceding section.
2. Select the traffic manager profile. The **Overview** appears.
3. The **Traffic Manager profile** displays the DNS name of your newly created Traffic Manager profile.
  
   ![Traffic Manager DNS name](./media/quickstart-create-traffic-manager-profile/traffic-manager-dns-name.png)

### View Traffic Manager in action

1. In a web browser, type the DNS name of your Traffic Manager profile to view your Web App's default website. In this quickstart scenario, all requests are routed to the primary endpoint that is set to **Priority 1**.

    ![Test Traffic Manager profile](./media/quickstart-create-traffic-manager-profile/traffic-manager-test.png)

1. To view Traffic Manager failover in action, disable your primary site as follows:
    1. In the Traffic Manager Profile page, select **Settings**>**Endpoints**>*MyPrimaryEndpoint*.
    2. In *MyPrimaryEndpoint*, select **Disabled**.
    3. The primary endpoint *MyPrimaryEndpoint* status now shows as **Disabled**.
1. Copy the DNS name of your Traffic Manager Profile from the preceding step to successfully view the website in a web browser. When the primary endpoint isn't available, the user traffic gets routed to the secondary endpoint.

## Clean up resources

When no longer needed, delete the resource groups, web applications, and all related resources. To do so, select the resource groups (*myResourceGroupTM1* and *myResourceGroupTM2*) and click **Delete**.

## Next steps

In this quickstart, you created a Traffic Manager profile that allows you to direct user traffic for highly availability web application. To learn more about routing traffic, continue to the tutorials for Traffic Manager.

> [!div class="nextstepaction"]
> [Traffic Manager tutorials](tutorial-traffic-manager-improve-website-response.md)