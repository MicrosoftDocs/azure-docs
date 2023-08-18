---
title: 'Quickstart: Create an Azure Front Door profile - Azure portal'
description: This quickstart shows how to use Azure Front Door service for your highly available and high-performance global web application by using the Azure portal.
services: frontdoor
author: duongau
manager: KumudD
ms.service: frontdoor
ms.topic: quickstart
ms.workload: infrastructure-services
ms.date: 08/15/2022
ms.author: duau
ms.custom: mode-ui
#Customer intent: As an IT admin, I want to direct user traffic to ensure high availability of web applications.
---

# Quickstart: Create an Azure Front Door profile - Azure portal

In this quickstart, you'll learn how to create an Azure Front Door profile using the Azure portal. You can create an Azure Front Door profile through *Quick create* with basic configurations or through the *Custom create* which allows a more advanced configuration. 

With *Custom create*, you deploy two App services. Then, you create the Azure Front Door profile using the two App services as your origin. Lastly, you'll verify connectivity to your App services using the Azure Front Door frontend hostname.

:::image type="content" source="media/quickstart-create-front-door/environment-diagram.png" alt-text="Diagram of Front Door deployment environment using the Azure portal." border="false":::

[!INCLUDE [ddos-waf-recommendation](../../includes/ddos-waf-recommendation.md)]

## Prerequisites

An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create Front Door profile - Quick Create

1. Sign in to the [Azure portal](https://portal.azure.com).

1. From the home page or the Azure menu, select **+ Create a resource**. Search for *Front Door and CDN profiles*. Then select **Create**.

1. On the **Compare offerings** page, select **Quick create**. Then select **Continue to create a Front Door**.

   :::image type="content" source="./media/create-front-door-portal/front-door-quick-create.png" alt-text="Screenshot of compare offerings.":::

1. On the **Create a Front Door profile** page, enter, or select the following settings.

    :::image type="content" source="./media/create-front-door-portal/front-door-quick-create-2.png" alt-text="Screenshot of Front Door quick create page.":::    

    | Settings | Description |
    | --- | --- |
    | **Subscription**  | Select your subscription. |
    | **Resource group**  | Select **Create new** and enter *myAFDResourceGroup* in the text box.|
    | **Name** | Give your profile a name. This example uses **myAzureFrontDoor**. |
    | **Tier** | Select either Standard or Premium tier. Standard tier is content delivery optimized. Premium tier builds on Standard tier and is focused on security. See [Tier Comparison](standard-premium/tier-comparison.md).  |
    | **Endpoint name** | Enter a globally unique name for your endpoint. |
    | **Origin type** | Select the type of resource for your origin. In this example, we select an App service as the origin that has Private Link enabled. |
    | **Origin host name** | Enter the hostname for your origin. |
    | **Private link** | Enable private link service if you want to have a private connection between your Azure Front Door and your origin. Only internal load balancers, Storage Blobs and App services are supported. For more information, see [Private Link service with Azure Front Door](private-link.md).
    | **Caching** | Select the check box if you want to cache contents closer to your users globally using Azure Front Door's edge POPs and the Microsoft network. |
    | **WAF policy** | Select **Create new** or select an existing WAF policy from the dropdown if you want to enable this feature. |

    > [!NOTE]
    > When creating an Azure Front Door profile, you must select an origin from the same subscription the Front Door is created in.
    >

1. Select **Review + Create** and then select **Create** to deploy your Azure Front Door profile.

    > [!NOTE]
    > * It may take a few minutes for the Azure Front Door configuration to be propagated to all edge POPs.
    > * If you enabled Private Link, go to the origin's resource page. Select **Networking** > **Configure Private Link**. Then select the pending request from Azure Front Door, and select **Approve**. After a few seconds, your origin will be accessible through Azure Front Door in a secured manner.

## Create Front Door profile - Custom Create

In the previous tutorial, you created an Azure Front Door profile through *Quick create*, which created your profile with basic configurations.

You'll now create an Azure Front Door profile using *Custom create* and deploy two App services that your Azure Front Door profile will use as your origin.

### Create two Web App instances

If you already have services to use as an origin, skip to [create a Front Door for your application](#create-a-front-door-for-your-application).

In this example, we create two Web App instances that are deployed in two different Azure regions. Both web application instances will run in *Active/Active* mode, so either one can service incoming traffic. This configuration differs from an *Active/Stand-By* configuration, where one acts as a failover.

Use the following steps to create two Web Apps used in this example.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. On the top left-hand side of the portal, select **+ Create a resource**. Then search for **Web App**. Select **Create** to begin configuring the first Web App.

1. On the **Basics** tab of **Create Web App** page, enter, or select the following information.

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

1. Select **Review + create**, review the summary, and then select **Create**. Deployment of the Web App can take up to a minute.

1. After you create the first Web App, create a second Web App. Use the same settings as above, except for the following settings:

    | Setting | Description |
    |--|--|
    | **Resource group** | Select **Create new** and enter *myAppResourceGroup2*. |
    | **Name** | Enter a unique name for your Web App, in this example, *webapp-contoso-002*. |
    | **Region** | A different region, in this example, *South Central US* |
    | **App Service plan** > **Windows Plan** | Select **New** and enter *myAppServicePlanSouthCentralUS*, and then select **OK**. |

### Create a Front Door for your application

Configure Azure Front Door to direct user traffic based on lowest latency between the two Web Apps origins. You'll also secure your Azure Front Door with a Web Application Firewall (WAF) policy. 

1. Sign in to the [Azure portal](https://portal.azure.com).
 
1. From the home page or the Azure menu, select **+ Create a resource**. Search for *Front Door and CDN profiles*. Then select **Create**.

1. On the **Compare offerings** page, select **Custom create**. Then select **Continue to create a Front Door**.

1. On the **Basics** tab, enter or select the following information, and then select **Next: Secret**. 

    :::image type="content" source="./media/create-front-door-portal/front-door-custom-create-2.png" alt-text="Create Front Door profile":::

    | Setting | Value |
    | --- | --- |
    | **Subscription** | Select your subscription. |
    | **Resource group** | Select **Create new** and enter *myAFDResourceGroup* into the text box. |
    | **Resource group location** | Select **East US** |
    | **Name** | Enter a unique name in this subscription **Webapp-Contoso-AFD** |
    | **Tier** | Select **Premium**. |

1. *Optional*: **Secrets**. If you plan to use managed certificates, this step is optional. If you have an existing Key Vault in Azure that you plan to use to Bring Your Own Certificate for a custom domain, then select **Add a certificate**. You can also add a certificate in the management experience after creation.

    > [!NOTE]
    > You need to have the right permission to add the certificate from Azure Key Vault as a user. 

    :::image type="content" source="./media/create-front-door-portal/front-door-custom-create-secret.png" alt-text="Screenshot of add a secret in custom create.":::

1. In the **Endpoint** tab, select **Add an endpoint** and give your endpoint a globally unique name. You can create more endpoints in your Azure Front Door profile after you complete the deployment. This example uses *contoso-frontend*. Select **Add** to add the endpoint.
    
    :::image type="content" source="./media/create-front-door-portal/front-door-custom-create-add-endpoint.png" alt-text="Screenshot of add an endpoint.":::

1. Next, select **+ Add a route** to configure routing to your Web App origin.

    :::image type="content" source="./media/create-front-door-portal/add-route.png" alt-text="Screenshot of add a route from the endpoint page." lightbox="./media/create-front-door-portal/add-route-expanded.png":::

1. On the **Add a route** page, enter, or select the following information, select **Add** to add the route to the endpoint configuration.

    :::image type="content" source="./media/create-front-door-portal/add-route-page.png" alt-text="Screenshot of add a route configuration page." lightbox="./media/create-front-door-portal/add-route-page-expanded.png":::

    | Setting | Description |
    |--|--|
    | Name | Enter a name to identify the mapping between domains and origin group. |
    | Domains | A domain name has been auto-generated for you to use. If you want to add a custom domain, select **Add a new domain**. This example will use the default. |
    | Patterns to match | Set all the URLs this route will accept. This example will use the default, and accept all URL paths. |
    | Accepted protocols | Select the protocol the route will accept. This example will accept both HTTP and HTTPS requests. |
    | Redirect | Enable this setting to redirect all HTTP traffic to the HTTPS endpoint. |
    | Origin group | Select **Add a new origin group**. For the origin group name, enter **myOriginGroup**. Then select **+ Add an origin**. For the first origin, enter **WebApp1** for the *Name* and then for the *Origin Type* select **App services**. In the *Host name*, select **webapp-contoso-001.azurewebsites.net**. Select **Add** to add the origin to the origin group. Repeat the steps to add the second Web App as an origin. For the origin *Name*, enter **WebApp2**. The *Host name* is **webapp-contoso-002.azurewebsites.net**. Choose a priority, the lowest number has the highest priority, a priority of 1 if both origins are needed to be served by Azure Front Door. Choose a weight appropriately for traffic routing, equal weights of 1000 if the traffic needs to be routed to both origins equally. Once both Web App origins have been added, select **Add** to save the origin group configuration. |
    | Origin path | Leave blank. |
    | Forwarding protocol | Select the protocol that will be forwarded to the origin group. This example will match the incoming requests to origins. |
    | Caching | Select the check box if you want to cache contents closer to your users globally using Azure Front Door's edge POPs and the Microsoft network. |
    | Rules | Once you've deployed the Azure Front Door profile, you can configure Rules to apply to your route. |

1. Select **+ Add a policy** to apply a Web Application Firewall (WAF) policy to one or more domains in the Azure Front Door profile.

    :::image type="content" source="./media/create-front-door-portal/add-policy.png" alt-text="Screenshot of add a policy from endpoint page." lightbox="./media/create-front-door-portal/add-policy-expanded.png":::

1. On the **Add security policy** page, enter a name to identify this security policy. Then select domains you want to associate the policy with. For *WAF Policy*, you can select a previously created policy or select **Create New** to create a new policy. Select **Save** to add the security policy to the endpoint configuration.

    :::image type="content" source="./media/create-front-door-portal/add-security-policy.png" alt-text="Screenshot of add security policy page.":::

1. Select **Review + Create**, and then **Create** to deploy the Azure Front Door profile. It will take a few minutes for configurations to be propagated to all edge locations.

## Verify Azure Front Door

When you create the Azure Front Door profile, it takes a few minutes for the configuration to be deployed globally. Once completed, you can access the frontend host you created. In a browser, enter the endpoint hostname. For example `contoso-frontend.z01.azurefd.net`. Your request will automatically get routed to the nearest server from the specified servers in the origin group.

If you created these apps in this quickstart, you'll see an information page.

To test instant global failover, do the following steps:

1. Open a browser, as described above, and go to the frontend address: `contoso-frontend.z01.azurefd.net`.

1. In the Azure portal, search and select *App services*. Scroll down to find one of your Web Apps, **WebApp-Contoso-001** in this example.

1. Select your web app, and then select **Stop**, and **Yes** to verify.

1. Refresh your browser. You should see the same information page.

   > [!TIP]
   > There is a delay between when the traffic will be directed to the second Web app. You may need to refresh again.

1. Go to the second Web app, and stop that one as well.

1. Refresh your browser. This time, you should see an error message.

    :::image type="content" source="./media/create-front-door-portal/web-app-stopped-message.png" alt-text="Both instances of the web app stopped":::

## Clean up resources

After you're done, you can remove all the items you created. Deleting a resource group also deletes its contents. If you don't intend to use this Azure Front Door, you should remove these resources to avoid unnecessary charges.

1. In the Azure portal, search for and select **Resource groups**, or select **Resource groups** from the Azure portal menu.

1. Filter or scroll down to find a resource group, such as **myAFDResourceGroup**, **myAppResourceGroup** or **myAppResourceGroup2**.

1. Select the resource group, then select **Delete resource group**.

   > [!WARNING]
   > Once a resource group has been deleted, there is no way to recover the resources.

1. Type the resource group name to verify, and then select **Delete**.

1. Repeat the procedure for the other two resource groups.

## Next steps

Advance to the next article to learn how to add a custom domain to your Front Door.

> [!div class="nextstepaction"]
> [Add a custom domain](standard-premium/how-to-add-custom-domain.md)
