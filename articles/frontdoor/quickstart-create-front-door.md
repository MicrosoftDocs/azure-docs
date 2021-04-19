---
title: 'Quickstart: Set up high availability with Azure Front Door Service - Azure portal'
description: This quickstart shows how to use Azure Front Door Service for your highly available and high-performance global web application by using the Azure portal.
services: front-door
documentationcenter: na
author: duongau
ms.author: duau
manager: KumudD
ms.date: 09/16/2020
ms.topic: quickstart
ms.service: frontdoor
ms.workload: infrastructure-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.custom:
  - mode-portal
# Customer intent: As an IT admin, I want to direct user traffic to ensure high availability of web applications.
---

# Quickstart: Create a Front Door for a highly available global web application

Get started with Azure Front Door by using the Azure portal to set up high availability for a web application.

In this quickstart, Azure Front Door pools two instances of a web application that run in different Azure regions. You create a Front Door configuration based on equal weighted and same priority backends. This configuration directs traffic to the nearest site that runs the application. Azure Front Door continuously monitors the web application. The service provides automatic failover to the next available site when the nearest site is unavailable.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create two instances of a web app

This quickstart requires two instances of a web application that run in different Azure regions. Both the web application instances run in *Active/Active* mode, so either one can take traffic. This configuration differs from an *Active/Stand-By* configuration, where one acts as a failover.

If you don't already have a web app, use the following steps to set up example web apps.

1. Sign in to the Azure portal at https://portal.azure.com.

1. On the top left-hand side of the screen, select **Create a resource** >  **WebApp**.

    :::image type="content" source="media/quickstart-create-front-door/front-door-create-web-app.png" alt-text="Create a web app in the Azure portal":::

1. In the **Basics** tab of **Create Web App** page, enter or select the following information.

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | **Subscription**               | Select your subscription. |    
    | **Resource group**       | Select **Create new** and enter *FrontDoorQS_rg1* in the text box.|
    | **Name**                   | Enter a unique **Name** for your web app. This example uses *WebAppContoso-1*. |
    | **Publish** | Select **Code**. |
    | **Runtime stack**         | Select **.NET Core 2.1 (LTS)**. |
    | **Operating System**          | Select **Windows**. |
    | **Region**           | Select **Central US**. |
    | **Windows Plan** | Select **Create new** and enter *myAppServicePlanCentralUS* in the text box. |
    | **Sku and size** | Select **Standard S1 100 total ACU, 1.75 GB memory**. |

1. Select **Review + create**, review the **Summary**, and then select **Create**. It might take several minutes for the deployment to complete.

    :::image type="content" source="media/quickstart-create-front-door/create-web-app.png" alt-text="Review summary for web app":::

After your deployment is complete, create a second web app. Use the same procedure with the same values, except for the following values:

| Setting          | Value     |
| ---              | ---  |
| **Resource group**   | Select **Create new** and enter *FrontDoorQS_rg2* |
| **Name**             | Enter a unique name for your Web App, in this example, *WebAppContoso-2*  |
| **Region**           | A different region, in this example, *South Central US* |
| **App Service plan** > **Windows Plan**         | Select **New** and enter *myAppServicePlanSouthCentralUS*, and then select **OK** |

## Create a Front Door for your application

Configure Azure Front Door to direct user traffic based on lowest latency between the two web apps servers. To begin, add a frontend host for Azure Front Door.

1. From the home page or the Azure menu, select **Create a resource**. Select **Networking** > **See All** > **Front Door**.

1. In the **Basics** tab of **Create a Front Door** page, enter or select the following information, and then select **Next: Configuration**.

    | Setting | Value |
    | --- | --- |
    | **Subscription** | Select your subscription. |    
    | **Resource group** | Select **Create new** and enter *FrontDoorQS_rg0* in the text box.|
    | **Resource group location** | Select **Central US**. |

1. In **Frontends/domains**, select **+** to open **Add a frontend host**.

1. For **Host name**, enter a globally unique hostname. This example uses *contoso-frontend*. Select **Add**.

    :::image type="content" source="media/quickstart-create-front-door/add-frontend-host-azure-front-door.png" alt-text="Add a frontend host for Azure Front Door":::

Next, create a backend pool that contains your two web apps.

1. Still in **Create a Front Door**, in **Backend pools**, select **+** to open **Add a backend pool**.

1. For **Name**, enter *myBackendPool*, then select **Add a backend**.

    :::image type="content" source="media/quickstart-create-front-door/front-door-add-backend-pool.png" alt-text="Add a backend pool":::

1. In the **Add a backend** blade, select the following information and select **Add**.

    | Setting | Value |
    | --- | --- |
    | **Backend host type** | Select **App service**. |   
    | **Subscription** | Select your subscription. |    
    | **Backend host name** | Select the first web app you created. In this example, the web app was *WebAppContoso-1*. |

    **Leave all other fields default.*

    :::image type="content" source="media/quickstart-create-front-door/front-door-add-a-backend.png" alt-text="Add a backend host to your Front Door":::

1. Select **Add a backend** again. select the following information and select **Add**.

    | Setting | Value |
    | --- | --- |
    | **Backend host type** | Select **App service**. |   
    | **Subscription** | Select your subscription. |    
    | **Backend host name** | Select the second web app you created. In this example, the web app was *WebAppContoso-2*. |

    **Leave all other fields default.*

1. Select **Add** on the **Add a backend pool** blade to complete the configuration of the backend pool.

    :::image type="content" source="media/quickstart-create-front-door/front-door-add-backend-pool-complete.png" alt-text="Add a backend pool for Azure Front Door":::

Finally, add a routing rule. A routing rule maps your frontend host to the backend pool. The rule forwards a request for `contoso-frontend.azurefd.net` to **myBackendPool**.

1. Still in **Create a Front Door**, in **Routing rules**, select **+** to configure a routing rule.

1. In **Add a rule**, for **Name**, enter *LocationRule*. Accept all the default values, then select **Add** to add the routing rule.

    :::image type="content" source="media/quickstart-create-front-door/front-door-add-a-rule.png" alt-text="Add a rule to your Front Door":::

   >[!WARNING]
   > You **must** ensure that each of the frontend hosts in your Front Door has a routing rule with a default path (`\*`) associated with it. That is, across all of your routing rules there must be at least one routing rule for each of your frontend hosts defined at the default path (`\*`). Failing to do so may result in your end-user traffic not getting routed correctly.

1. Select **Review + Create**, and then **Create**.

    :::image type="content" source="media/quickstart-create-front-door/configuration-azure-front-door.png" alt-text="Configured Azure Front Door":::

## View Azure Front Door in action

Once you create a Front Door, it takes a few minutes for the configuration to be deployed globally. Once complete, access the frontend host you created. In a browser, go to `contoso-frontend.azurefd.net`. Your request will automatically get routed to the nearest server to you from the specified servers in the backend pool.

If you created these apps in this quickstart, you'll see an information page.

To test instant global failover in action, try the following steps:

1. Open a browser, as described above, and go to the frontend address: `contoso-frontend.azurefd.net`.

1. In the Azure portal, search for and select *App services*. Scroll down to find one of your web apps, **WebAppContoso-1** in this example.

1. Select your web app, and then select **Stop**, and **Yes** to verify.

1. Refresh your browser. You should see the same information page.

   >[!TIP]
   >There is a little bit of delay for these actions. You might need to refresh again.

1. Find the other web app, and stop it as well.

1. Refresh your browser. This time, you should see an error message.

   :::image type="content" source="media/quickstart-create-front-door/web-app-stopped-message.png" alt-text="Both instances of the web app stopped":::

## Clean up resources

After you're done, you can remove all the items you created. Deleting a resource group also deletes its contents. If you don't intend to use this Front Door, you should remove resources to avoid unnecessary charges.

1. In the Azure portal, search for and select **Resource groups**, or select **Resource groups** from the Azure portal menu.

1. Filter or scroll down to find a resource group, such as **FrontDoorQS_rg0**.

1. Select the resource group, then select **Delete resource group**.

   >[!WARNING]
   >This action is irreversable.

1. Type the resource group name to verify, and then select **Delete**.

Repeat the procedure for the other two groups.

## Next steps

Advance to the next article to learn how to add a custom domain to your Front Door.
> [!div class="nextstepaction"]
> [Add a custom domain](front-door-custom-domain.md)
