---
title: 'Quickstart: Create an Azure Front Door (classic) using the Azure portal'
description: In this quickstart, you learn how to use the Azure portal to set up Azure Front Door (classic) for your web application that requires high availability and high performance across the globe.
services: front-door
author: duongau
ms.author: duau
manager: KumudD
ms.date: 11/13/2024
ms.topic: quickstart
ms.service: azure-frontdoor
ms.custom: template-tutorial, mode-ui, engagement-fy23
#Customer intent: As an IT admin, I want to manage user traffic to ensure high availability of web applications.
---

# Quickstart: Create an Azure Front Door (classic) using the Azure portal

[!INCLUDE [Azure Front Door (classic) retirement notice](../../includes/front-door-classic-retirement.md)]

This quickstart guides you through setting up high availability for a web application using Azure Front Door (classic) via the Azure portal. You configure Azure Front Door to distribute traffic across two web application instances in different Azure regions. The setup uses equal weighted and same priority backends, directing traffic to the nearest available site. Azure Front Door also monitors the health of the web applications and automatically fails over to the next nearest site if the closest one is down.

:::image type="content" source="media/quickstart-create-front-door/environment-diagram.png" alt-text="Diagram of Front Door deployment environment using the Azure portal." border="false":::

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create two instances of a web app

To complete this quickstart, you need two instances of a web application running in different Azure regions. These instances operate in *Active/Active* mode, meaning they can handle traffic simultaneously. This setup differs from *Active/Stand-By* mode, where one instance serves as a backup.

If you don't have the web apps already, follow these steps to create them:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **+ Create a resource** from the top left corner and search for **Web App**.

    :::image type="content" source="media/quickstart-create-front-door/front-door-create-web-app.png" alt-text="Create a web app in the Azure portal." lightbox="./media/quickstart-create-front-door/front-door-create-web-app.png":::

1. On the Basics tab of the Create Web App page, provide, or select the following details:

    | Setting | Value |
    |--|--|
    | **Subscription** | Choose your subscription. |
    | **Resource group** | Select **Create new** and type *FrontDoorQS_rg1*. |
    | **Name** | Type a unique name for your web app, for example, *WebAppContoso-1*. |
    | **Publish** | Select **Code**. |
    | **Runtime stack** | Select **.NET Core 3.1 (LTS)**. |
    | **Operating System** | Select **Windows**. |
    | **Region** | Select **Central US**. |
    | **Windows Plan** | Select **Create new** and type *myAppServicePlanCentralUS*. |
    | **Sku and size** | Select **Standard S1 100 total ACU, 1.75 GB memory**. |

1. Select **Review + create**, verify the summary details, and then select **Create** to initiate the deployment. The deployment may take several minutes.

    :::image type="content" source="media/quickstart-create-front-door/create-web-app.png" alt-text="Screenshot showing Create Web App page." lightbox="./media/quickstart-create-front-door/create-web-app.png":::

1. After deploying the first web app, create another one with the same steps but with the following changes:

    | Setting | Value |
    |--|--|
    | **Resource group** | Select **Create new** and type *FrontDoorQS_rg2*. |
    | **Name** | Type a unique name for your web app, for example, *WebAppContoso-2*. |
    | **Region** | Select a different region, for example, *East US*. |
    | **App Service plan** > **Windows Plan** | Select **New** and type *myAppServicePlanEastUS*, then select **OK**. |

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
Once you create a Front Door, it takes a few minutes for the configuration to be deployed globally. After deployment, access the frontend host you created by navigating to its address in your browser. Your requests automatically get routed to the nearest server from the specified servers in the backend pool.

If you followed this quickstart to create the web apps, you should see an information page.

To test the instant global failover feature, follow these steps:

1. Navigate to the resource group **FrontDoorQS_rg0** and select the Front Door service.

    :::image type="content" source="./media/quickstart-create-front-door/front-door-view-frontend-service.png" alt-text="Screenshot of frontend service." lightbox="./media/quickstart-create-front-door/front-door-view-frontend-service.png":::

1. From the **Overview** page, copy the **Frontend host** address.

    :::image type="content" source="./media/quickstart-create-front-door/front-door-view-frontend-host-address.png" alt-text="Screenshot of frontend host address." lightbox="./media/quickstart-create-front-door/front-door-view-frontend-host-address.png":::

1. Open your browser and go to the frontend address.

1. In the Azure portal, search for and select **App services**. Scroll down to find one of your web apps, for example, *WebAppContoso-1*.

1. Select your web app, then select **Stop**, and confirm by selecting **Yes**.

1. Refresh your browser. You should still see the information page.

    > [!TIP]
    > These actions may take some time to take effect. You may need to refresh the browser again.

1. Locate the other web app and stop it as well.

1. Refresh your browser. This time, you should see an error message.

    :::image type="content" source="media/quickstart-create-front-door/web-app-stopped-message.png" alt-text="Both instances of the web app stopped." lightbox="./media/quickstart-create-front-door/web-app-stopped-message.png":::

## Clean up resources

After completing the quickstart, you can delete the resources, you created to avoid unnecessary charges. Deleting a resource group also deletes all its contents.

1. In the Azure portal, search for and select **Resource groups** from the menu.

1. Locate the resource group you want to delete, such as *FrontDoorQS_rg0*.

1. Select the resource group, then select **Delete resource group**.

    > [!WARNING]
    > This action is irreversible.

1. Enter the name of the resource group to confirm deletion, then select **Delete**.

1. Repeat these steps for the other resource groups.

## Next steps

Proceed to the next article to learn how to configure a custom domain for your Front Door.

> [!div class="nextstepaction"]
> [Add a custom domain](front-door-custom-domain.md)
