---
title: 'Quickstart: How to use Azure Front Door Service to enable high availability - Azure portal'
description: In this quickstart, you learn how to use the Azure portal to set up Azure Front Door Service for your web application that requires high availability and high performance across the globe.
services: front-door
author: duongau
ms.author: duau
manager: KumudD
ms.date: 10/02/2023
ms.topic: quickstart
ms.service: frontdoor
ms.workload: infrastructure-services
ms.custom: template-tutorial, mode-ui, engagement-fy23
#Customer intent: As an IT admin, I want to manage user traffic to ensure high availability of web applications.
---

# Quickstart: Create a Front Door for a highly available global web application

This quickstart shows you how to use the Azure portal to set up high availability for a web application with Azure Front Door. You create a Front Door configuration that distributes traffic across two instances of a web application running in different Azure regions. The configuration uses equal weighted and same priority backends, which means that Azure Front Door directs traffic to the closest available site that hosts the application. Azure Front Door also monitors the health of the web application and performs automatic failover to the next nearest site if the closest site is down.

:::image type="content" source="media/quickstart-create-front-door/environment-diagram.png" alt-text="Diagram of Front Door deployment environment using the Azure portal." border="false":::

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create two instances of a web app

To complete this quickstart, you need two instances of a web application running in different Azure regions. The web application instances operate in *Active/Active* mode, which means that they can both handle traffic simultaneously. This setup is different from *Active/Stand-By* mode, where one instance serves as a backup for the other.

To follow this quickstart, you need two web apps that run in different Azure regions. If you don't have them already, you can use these steps to create example web apps.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. On the top left corner of the screen, select **+ Create a resource** and then search for **Web App**.

    :::image type="content" source="media/quickstart-create-front-door/front-door-create-web-app.png" alt-text="Create a web app in the Azure portal." lightbox="./media/quickstart-create-front-door/front-door-create-web-app.png":::

1. On the Basics tab of the Create Web App page, provide or select the following details.

    | Setting | Value |
    |--|--|
    | **Subscription** | Choose your subscription. |
    | **Resource group** | Select **Create new** and type *FrontDoorQS_rg1* in the text box. |
    | **Name** | 	Type a unique **Name** for your web app. For example, *WebAppContoso-1*. |
    | **Publish** | Select **Code**. |
    | **Runtime stack** | Select **.NET Core 3.1 (LTS)**. |
    | **Operating System** | Select **Windows**. |
    | **Region** | Select **Central US**. |
    | **Windows Plan** | Select **Create new** and type *myAppServicePlanCentralUS* in the text box. |
    | **Sku and size** | Select **Standard S1 100 total ACU, 1.75 GB memory**. |

1. Select **Review + create** and verify the summary details. Then, select **Create** to initiate the deployment process. The deployment may take several minutes to complete.

    :::image type="content" source="media/quickstart-create-front-door/create-web-app.png" alt-text="Screenshot showing Create Web App page." lightbox="./media/quickstart-create-front-door/create-web-app.png":::

Once you have successfully deployed your first web app, proceed to create another one. Follow the same steps and enter the same values as before, except for the ones listed:

| Setting | Value |
|--|--|
| **Resource group** | Select **Create new** and type *FrontDoorQS_rg2* |
| **Name** | Type a unique name for your Web App, for example, *WebAppContoso-2* |
| **Region** | Select a different region than the first Web App, for example, *East US* |
| **App Service plan** > **Windows Plan** | Select **New** and type *myAppServicePlanEastUS*, and then select **OK** |

## Create a Front Door for your application

Set up Azure Front Door to route user traffic based on the lowest latency between the two web app servers. Start by adding a frontend host for Azure Front Door.

1. From the home page or the Azure menu, select **+ Create a resource**. Select **Networking** > **Front Door and CDN profiles**.

1. On the *Compare offerings* page, select **Explore other offerings**. Then select **Azure Front Door (classic)**. Then select **Continue**.

1. In the Basics tab of *Create a Front Door* page, provide or select the following information, and then select **Next: Configuration**.

    | Setting | Value |
    | --- | --- |
    | **Subscription** | Select your subscription. |    
    | **Resource group** | Select **Create new** and type *FrontDoorQS_rg0* in the text box.|
    | **Resource group location** | Select **Central US**. |

1. In **Frontends/domains**, select **+** to open **Add a frontend host** page.

1. For **Host name**, type a globally unique hostname. For example, *contoso-frontend*. Select **Add**.

    :::image type="content" source="media/quickstart-create-front-door/add-frontend-host-azure-front-door.png" alt-text="Add a frontend host for Azure Front Door." lightbox="./media/quickstart-create-front-door/add-frontend-host-azure-front-door.png":::

Next, set up a backend pool that includes your two web apps.

1. Still in **Create a Front Door**, in **Backend pools**, select **+** to open the **Add a backend pool** page.

1. For **Name**, type *myBackendPool*, then select **Add a backend**.

    :::image type="content" source="media/quickstart-create-front-door/front-door-add-backend-pool.png" alt-text="Add a backend pool." lightbox="./media/quickstart-create-front-door/front-door-add-backend-pool.png":::

1. Provide or select the following information in the *Add a backend* pane and select **Add**.

    | Setting | Value |
    | --- | --- |
    | **Backend host type** | Select **App service**. |   
    | **Subscription** | Select your subscription. |    
    | **Backend host name** | Select the first web app you created. For example, *WebAppContoso-1*. |

    **Keep all other fields default.**

    :::image type="content" source="media/quickstart-create-front-door/front-door-add-a-backend.png" alt-text="Add a backend host to your Front Door." lightbox="./media/quickstart-create-front-door/front-door-add-a-backend.png":::

1. “Select **Add a backend** again. Provide or select the following information and select **Add**.

    | Setting | Value |
    | --- | --- |
    | **Backend host type** | Select **App service**. |   
    | **Subscription** | Select your subscription. |    
    | **Backend host name** | Select the second web app you created. For example, *WebAppContoso-2*. |

    **Keep all other fields default.**

1. Select **Add** on the *Add a backend pool* page to finish the configuration of the backend pool.

    :::image type="content" source="media/quickstart-create-front-door/front-door-add-backend-pool-complete.png" alt-text="Add a backend pool for Azure Front Door." lightbox="./media/quickstart-create-front-door/front-door-add-backend-pool-complete.png":::

Lastly, create a routing rule. A routing rule links your frontend host to the backend pool. The rule routes a request for `contoso-frontend.azurefd.net` to **myBackendPool**.

1. Still in *Create a Front Door*, in *Routing rules*, select **+** to set up a routing rule.

1. In *Add a rule*, for **Name**, type LocationRule. Keep all the default values, then select Add to create the routing rule.”

    :::image type="content" source="media/quickstart-create-front-door/front-door-add-a-rule.png" alt-text="Screenshot showing Add a rule when creating Front Door." lightbox="./media/quickstart-create-front-door/front-door-add-a-rule.png":::

    > [!WARNING]
    > It's essential that you associate each of the frontend hosts in your Azure Front Door with a routing rule that has a default path `/*`. This means that you need to have at least one routing rule for each of your frontend hosts at the default path `/*` among all of your routing rules. Otherwise, your end-user traffic may not be routed properly. 

1. Select **Review + create** and verify the details. Then, select **Create** to start the deployment.

    :::image type="content" source="media/quickstart-create-front-door/configuration-azure-front-door.png" alt-text="Configured Azure Front Door." lightbox="./media/quickstart-create-front-door/configuration-azure-front-door.png":::


## View Azure Front Door in action

Once you create a Front Door, it takes a few minutes for the configuration to be deployed globally; once completed, access the frontend host you created. In the browser, go to your frontend host address. Your requests automatically get routed to your nearest server from the specified servers in the backend pool.

If you followed this quickstart to create these apps, you see an information page.

To test the instant global failover feature, try the following steps:

1. Navigate to the resource group **FrontDoorQS_rg0** and select the Front Door service.”

    :::image type="content" source="./media/quickstart-create-front-door/front-door-view-frontend-service.png" alt-text="Screenshot of frontend service." lightbox="./media/quickstart-create-front-door/front-door-view-frontend-service.png":::

1. From the **Overview** page, copy the **Frontend host** address.

    :::image type="content" source="./media/quickstart-create-front-door/front-door-view-frontend-host-address.png" alt-text="Screenshot of frontend host address." lightbox="./media/quickstart-create-front-door/front-door-view-frontend-host-address.png":::

1. Open the browser, as described previously, and go to your frontend address.

1. In the Azure portal, search for and select App services. Scroll down to find one of your web apps, for example, *WebAppContoso-1*.

1. Select your web app, and then select **Stop**, and **Yes** to confirm.

1. Refresh your browser. You should see the same information page.

    > [!TIP]
    > These actions may take some time to take effect. You may need to refresh the browser again.”

1. Locate the other web app, and stop it as well.

1. Refresh your browser. This time, you should see an error message.

   :::image type="content" source="media/quickstart-create-front-door/web-app-stopped-message.png" alt-text="Both instances of the web app stopped." lightbox="./media/quickstart-create-front-door/web-app-stopped-message.png":::

## Clean up resources

After you're done, you can delete all the items you created. Deleting the resource group also deletes its contents. If you don't intend to use this Front Door, you should delete the resources to avoid incurring unnecessary charges.

1. In the Azure portal, search for and select **Resource groups**, or choose **Resource groups** from the Azure portal menu.

1. Filter or scroll down to find a resource group, for example, *FrontDoorQS_rg0*.

1. Choose the resource group, then select **Delete** resource group.

    > [!WARNING]
    > This action can't be undone.

1. Enter the name of the resource group that you want to delete, and then select **Delete**.

1. Repeat these steps for the remaining two groups.

## Next steps

Proceed to the next article to learn how to configure a custom domain for your Front Door.

> [!div class="nextstepaction"]
> [Add a custom domain](front-door-custom-domain.md)
