---
title: 'Quickstart: Create an Azure Front Door using the Azure portal'
description: This quickstart shows how to use Azure Front Door service for your highly available and high-performance global web application by using the Azure portal.
services: frontdoor
author: duongau
manager: KumudD
ms.service: azure-frontdoor
ms.topic: quickstart
ms.date: 11/12/2024
ms.author: duau
ms.custom: mode-ui
#Customer intent: As an IT admin, I want to direct user traffic to ensure high availability of web applications.
---

# Quickstart: Create an Azure Front Door using Azure portal

This quickstart guides you through the process of creating an Azure Front Door profile using the Azure portal. You have two options to create an Azure Front Door profile: Quick create and Custom create. The Quick create option allows you to configure the basic settings of your profile, while the Custom create option enables you to customize your profile with more advanced settings.

In this quickstart, you use the Custom create option to create an Azure Front Door profile. You first deploy two App services as your origin servers. Then, you configure the Azure Front Door profile to route traffic to your App services based on certain rules. Finally, you test the connectivity to your App services by accessing the Azure Front Door frontend hostname.

:::image type="content" source="media/quickstart-create-front-door/environment-diagram.png" alt-text="Diagram of Front Door deployment environment using the Azure portal." border="false":::

[!INCLUDE [ddos-waf-recommendation](../../includes/ddos-waf-recommendation.md)]

## Prerequisites

An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create an Azure Front Door profile

#### [Quick create](#tab/quick)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to the home page or the Azure menu and select **+ Create a resource**. Enter *Front Door and CDN profiles* in the search box and select **Create**.

1. On the **Compare offerings** page, select **Quick create**, and then select **Continue to create a Front Door**.

    :::image type="content" source="./media/create-front-door-portal/front-door-quick-create.png" alt-text="Screenshot of compare offerings.":::

1. On the **Create a Front Door profile** page, provide the following information:

     :::image type="content" source="./media/create-front-door-portal/front-door-quick-create-2.png" alt-text="Screenshot of Front Door quick create page.":::    

     | Setting | Description |
     | --- | --- |
     | **Subscription**  | Select your subscription. |
     | **Resource group**  | Select **Create new** and enter *myAFDResourceGroup*.|
     | **Name** | Enter a name for your profile, such as **myAzureFrontDoor**. |
     | **Tier** | Select either Standard or Premium. Standard is optimized for content delivery, while Premium focuses on security. See [Tier Comparison](standard-premium/tier-comparison.md). |
     | **Endpoint name** | Enter a globally unique name for your endpoint. |
     | **Origin type** | Select the type of resource for your origin. For this example, select an App service with Private Link enabled. |
     | **Origin host name** | Enter the hostname for your origin. |
     | **Private link** (Premium only) | Enable private link service for a private connection between Azure Front Door and your origin. Supported origins include internal load balancers, Azure Storage Blobs, Azure App services, and Azure Storage Static Website. See [Private Link service with Azure Front Door](private-link.md). |
     | **Caching** | Select the check box to cache content closer to users globally using Azure Front Door's edge POPs and the Microsoft network. |
     | **WAF policy** | Select **Create new** or choose an existing WAF policy from the dropdown to enable this feature. |

     > [!NOTE]
     > When creating a new Azure Front Door profile, you can only select an origin from the same subscription the Front Door is created in.

1. Select **Review + Create** and then **Create** to deploy your Azure Front Door profile.

     > [!NOTE]
     > * It may take a few minutes for the Azure Front Door configuration to propagate to all edge POPs.
     > * If you enabled Private Link, go to the origin's resource page, select **Networking** > **Configure Private Link**, select the pending request from Azure Front Door, and then select **Approve**. After a few seconds, your origin will be accessible through Azure Front Door securely.

#### [Custom create](#tab/custom)

You create an Azure Front Door profile using *Custom create* and deploy two App services that your Azure Front Door profile uses as your origins.

### Create two Web App instances

If you already have services to use as an origin, skip to [create a Front Door for your application](#create-a-front-door-for-your-application).

This example demonstrates how to create two Web App instances deployed in different Azure regions. Both web application instances operate in an active/active mode, meaning they can both handle incoming traffic. This configuration differs from an active/standby configuration, where one instance serves as a backup for the other.

To create the two Web Apps for this example, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. To start creating the first Web App, select the **+ Create a resource** button on the top left corner of the portal. Then, type *Web App* in the search box and select **Create** to proceed with the configuration.

1. On the **Create Web App** page, fill in the required information on the **Basics** tab.

    :::image type="content" source="./media/create-front-door-portal/create-web-app.png" alt-text="Quick create Azure Front Door premium tier in the Azure portal.":::

    | Setting | Description |
    |--|--|
    | **Subscription** | Select your subscription. |
    | **Resource group** | Select **Create new** and enter *myAppResourceGroup* in the text box. |
    | **Name** | Enter a unique **Name** for your web app. This example uses *webapp-contoso-001*. |
    | **Publish** | Select **Code**. |
    | **Runtime stack** | Select **.NET Core 3.1 (LTS)**. |
    | **Operating System** | Select **Windows**. |
    | **Region** | Select **Central US**. |
    | **Windows Plan** | Select **Create new** and enter *myAppServicePlanCentralUS* in the text box. |
    | **Sku and size** | Select **Standard S1 100 total ACU, 1.75-GB memory**. |

1. To complete the creation of the Web App, select **Review + create** button and verify the summary of the settings. Then, select the **Create** button to start the deployment process, which can take up to a minute.

1. To create a second Web App, follow the same steps as for the first Web App, but make the following changes in the settings:

    | Setting | Description |
    |--|--|
    | **Resource group** | Select **Create new** and enter *myAppResourceGroup2*. |
    | **Name** | Enter a unique name for your Web App, in this example, *webapp-contoso-002*. |
    | **Region** | A different region, in this example, *South Central US* |
    | **App Service plan** > **Windows Plan** | Select **New** and enter *myAppServicePlanSouthCentralUS*, and then select **OK**. |

### Create a Front Door for your application

In this step, you configure Azure Front Door to route user traffic to the nearest Web App origin based on latency. Additionally, you apply a Web Application Firewall (WAF) policy to protect your Azure Front Door from malicious attacks.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. From the home page or the Azure menu, select **+ Create a resource**, search for *Front Door and CDN profiles*, and select **Create**.

    :::image type="content" source="./media/create-front-door-portal/front-door-custom-create-secret.png" alt-text="Screenshot of add a secret in custom create.":::

1. In the *Endpoint* tab, select **Add an endpoint**, enter a globally unique name (for example, contoso-frontend), and select **Add**. You can create more endpoints after the initial deployment.

    :::image type="content" source="./media/create-front-door-portal/front-door-custom-create-add-endpoint.png" alt-text="Screenshot of add an endpoint.":::

1. To configure routing to your Web App origin, select **+ Add a route**.

    :::image type="content" source="./media/create-front-door-portal/add-route.png" alt-text="Screenshot of add a route from the endpoint page." lightbox="./media/create-front-door-portal/add-route-expanded.png":::

1. On the **Add a route** page, enter or select the following information and then select **Add** to add the route to the endpoint configuration.

    :::image type="content" source="./media/create-front-door-portal/add-route-page.png" alt-text="Screenshot of add a route configuration page." lightbox="./media/create-front-door-portal/add-route-page-expanded.png":::

    | Setting | Description |
    |--|--|
    | **Name** | Provide a name that identifies the mapping between domains and origin group. |
    | **Domains** | The system generates a domain name for you to use. To add a custom domain, select **Add a new domain**. This example uses the default domain name. |
    | **Patterns to match** | Specify the URLs that this route accepts. This example uses the default setting, which accepts all URL paths. |
    | **Accepted protocols** | Choose the protocol that the route accepts. This example accepts both HTTP and HTTPS requests. |
    | **Redirect** | Turn on this setting to redirect all HTTP requests to the HTTPS endpoint. |
    | **Origin group** | To create a new origin group, select **Add a new origin group** and enter *myOriginGroup* as the origin group name. Then select **+ Add an origin** and enter *WebApp1* for the **Name** and *App services* for the **Origin Type**. In the **Host name**, select *webapp-contoso-001.azurewebsites.net* and select **Add** to add the origin to the origin group. Repeat the steps to add the second Web App as an origin with *WebApp2* as the **Name** and *webapp-contoso-002.azurewebsites.net* as the **Host name**. Choose a **priority** for each origin, with the lowest number having the highest priority. If you need Azure Front Door to serve both origins, use a priority of 1. Choose a weight for each origin, with the weight determining how traffic is routed to the origins. Use equal weights of 1000 if the traffic needs to be routed to both origins equally. Once both Web App origins are added, select **Add** to save the origin group configuration. |
    | **Origin path** | Leave this field empty. |
    | **Forwarding protocol** | Choose the protocol that the origin group receives. This example uses the same protocol as the incoming requests. |
    | **Caching** | Select the check box if you want to use Azure Front Door’s edge POPs and the Microsoft network to cache contents closer to your users globally. |
    | **Rules** | After deploying the Azure Front Door profile, you can use Rules to customize your route. |

1. Select **+ Add a policy** to apply a Web Application Firewall (WAF) policy to one or more domains in the Azure Front Door profile.

    :::image type="content" source="./media/create-front-door-portal/add-policy.png" alt-text="Screenshot of add a policy from endpoint page." lightbox="./media/create-front-door-portal/add-policy-expanded.png":::

1. To create a security policy, provide a name that uniquely identifies it. Next, choose the domains that you want to apply the policy to. You can also select an existing WAF policy or create a new one. To finish, select **Save** to add the security policy to the endpoint configuration.

    :::image type="content" source="./media/create-front-door-portal/add-security-policy.png" alt-text="Screenshot of add security policy page.":::

1. To deploy the Azure Front Door profile, select **Review + Create** and then **Create**. The configuration propagates to all edge locations within a few minutes.

---

## Verify Azure Front Door

The global deployment of the Azure Front Door profile takes a few minutes to complete. After that, you can access the frontend host by entering its endpoint hostname in a browser. For example, `contoso-frontend.z01.azurefd.net`. The request is automatically routed to the closest server among the specified servers in the origin group.

To test the instant global failover feature, follow these steps if you created the apps in this quickstart. You see an information page with the app details.

1. Enter the endpoint hostname in a browser, for example, `contoso-frontend.z01.azurefd.net`.

1. In the Azure portal, search for and select **App services**. Locate one of your Web Apps, such as **WebApp-Contoso-001**.

1. Select the Web App from the list and then select **Stop**. Confirm your action by selecting **Yes**.

1. Reload the browser to see the information page again.

    > [!TIP]
    > Traffic may take some time to switch to the second Web App. You may need to reload the browser again.

1. To stop the second Web App, select it from the list and then choose **Stop**. Confirm your action by selecting **Yes**.

1. Reload the web page. You should encounter an error message after the refresh.

     :::image type="content" source="./media/create-front-door-portal/web-app-stopped-message.png" alt-text="Both instances of the web app stopped":::

## Clean up resources

If you no longer need the environment, you can delete all the resources you created. Deleting a resource group also removes all its contents. To avoid incurring unnecessary charges, we recommend deleting these resources if you don't plan to use this Azure Front Door.

1. In the Azure portal, search for and select **Resource groups**, or navigate to **Resource groups** from the Azure portal menu.

1. Use the filter option or scroll down the list to locate the resource groups, such as **myAFDResourceGroup**, **myAppResourceGroup**, or **myAppResourceGroup2**.

1. Select the resource group you want to delete, then choose the **Delete** option.

    > [!WARNING]
    > Deleting a resource group is irreversible. The resources within the resource group cannot be recovered once deleted.

1. Enter the name of the resource group to confirm, and then select the **Delete** button.

1. Repeat these steps for the remaining resource groups.

## Next steps

Proceed to the next article to learn how to configure a custom domain for your Azure Front Door.

> [!div class="nextstepaction"]
> [Add a custom domain](standard-premium/how-to-add-custom-domain.md)
