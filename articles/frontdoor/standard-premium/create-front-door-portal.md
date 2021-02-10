---
title: 'Quickstart: Create an Azure Front Door Standard/Premium profile - Azure portal'
description: This quickstart shows how to use Azure Front Door Standard/Premium Service for your highly available and high-performance global web application by using the Azure portal.
services: frontdoor
author: duongau
manager: KumudD
Customer intent: As an IT admin, I want to direct user traffic to ensure high availability of web applications.
ms.service: frontdoor
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/18/2021
ms.author: duau
---

# Quickstart: Create an Azure Front Door Standard/Premium profile - Azure portal

> [!Note]
> This documentation is for Azure Front Door Standard/Premium (Preview). Looking for information on Azure Front Door? View [here](../front-door-overview.md).

> [!IMPORTANT]
> Azure Front Door Standard/Premium (Preview) is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Get started with Azure Front Door by using the Azure portal to configure a secure and high availability web application. When you can create an Azure Front Door profile, you can select either the *Quick Create* or *Custom Create* experience.

* With *Quick Create*, you can quickly create a Front Door endpoint with basic configurations. You can add an origin, enable caching, and add a WAF policy. If you choose Azure Front Door Premium SKU, you can also enable private link for private connectivity from AFD to your origin. Origin group and route will be enabled by default with default values. Once you complete the quick create, you can explore more advanced configurations to secure and accelerate your app globally in the management experience.

* With *Custom Create*, you can create an endpoint with advanced settings- add one origin with multiple origins and load-balancing rules among origins. Then you can add a Route to connect endpoint with origin group and define the routing via Route. You can also add certificates from Azure Key Vault if you want to use BYOC (Bring your own certificate) certificate for custom domains. In the last step, you can also add or create a WAF policy for this endpoint.

You can also *Choose SKU by scenario* and *Explore other offerings* to help you find the best solution that fits your scenario.

**Choose SKU by scenario:** Select your content delivery scenario, Static webpage, Dynamic/API caching, Media streaming, and File download.

**Explore other offerings:** Continue to use existing Azure CDN offerings and Azure Front Door service.

## Prerequisites

An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create Front Door profile - Quick Create

1. Sign in to the Azure portal at https://portal.azure.com.

1. From the home page or the Azure menu, select **Create a resource**. Search for **Front Door Standard/Premium (Preview)**. On the **Compare offerings** page, select **Quick Create**.

   :::image type="content" source="../media/create-front-door-portal/front-door-quick-create.png" alt-text="Create a web app in the Azure portal":::

1. On the **Create a front door profile** page, enter or select the following settings.

    :::image type="content" source="../media/create-front-door-portal/front-door-quick-create-2.png" alt-text="Quick create front door premium SKU in the Azure portal":::    

    | Settings | Value |
    | --- | --- |
    | **Subscription**  | Select your subscription. |
    | **Resource group**  | Select **Create new** and enter *contoso-appservice* in the text box.|
    | **Name** | Give your profile a name. This example uses **contoso-afd-quickcreate**. |
    | **Tier** | Select either Standard or Premium SKU. Standard SKU is content delivery optimized. Premium SKU builds on Standard SKU and is focused on security. Please refer to [Tier Comparison](overview-tier-comparison.md) for details |
    | **Endpoint name** | Enter a globally unique name for your endpoint. |
    | **Origin type** | Select the type of resource for your origin. In this example, we select an App service as the origin that has Private Link enabled. |
    | **Origin host name** | Enter the hostname for your origin. |
    | **Enable Private Link** | If you want to have a private connection between your Azure Front Door and your origin. If you select Azure PaaS service App service or Storage as the origin type, all resources are pre-populated. If you're using ILB service as your origin, you'll need to input Resource ID manually. For more details, please refer to [Private link guidance](../../private-link/private-link-overview.md).
    | **Caching** | Select the check box if you want to cache contents closer to users globally using Azure Front Door's edge POPs and Microsoft network. |
    | **WAF policy** | Select **Create new** or select an existing WAF policy from the dropdown if you want to enable this feature. |

    > [!NOTE]
    > When creating a Front Door profile, you must select an origin from the same subscription the Front Door is created in.

1. Select **Review + Create** to get your Front Door profile up and running.

   > [!NOTE]
    It may take a few mins for the configurations to be propagated to all edge POPs.

1. Then click **Create** to get your Front Door profile deployed and running.

1. If you enabled Private Link, go to your origin (App service in this example). Select **Networking** > **Configure Private Link**. Then select the pending request from Azure Front Door, and click Approve. After a few seconds, your application will be accessible through Azure Front Door in a secure manner.

## Create Front Door profile - Custom Create

### Create a web app with two instances as the origin

If you already have an origin or an origin group, go to Create a Front Door Standard/Premium (Preview) for your application.

In this example, we create a web application with two instances that run in different Azure regions. Both the web application instances run in *Active/Active* mode, so either one can take traffic. This configuration differs from an *Active/Stand-By* configuration, where one acts as a failover.

If you don't already have a web app, use the following steps to set up an example web app.

1. Sign in to the Azure portal at https://portal.azure.com.

1. On the top left-hand side of the screen, select **Create a resource** > **WebApp**.

1. On the **Basics** tab of **Create Web App** page, enter, or select the following information.

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | **Subscription**               | Select your subscription. |
    | **Resource group**       | Select **Create new** and enter *FrontDoorQS_rg1* in the text box.|
    | **Name**                   | Enter a unique **Name** for your web app. This example uses *WebAppContoso-001*. |
    | **Publish** | Select **Code**. |
    | **Runtime stack**         | Select **.NET Core 2.1 (LTS)**. |
    | **Operating System**          | Select **Windows**. |
    | **Region**           | Select **Central US**. |
    | **Windows Plan** | Select **Create new** and enter *myAppServicePlanCentralUS* in the text box. |
    | **Sku and size** | Select **Standard S1 100 total ACU, 1.75-GB memory**. |

     :::image type="content" source="../media/create-front-door-portal/create-web-app.png" alt-text="Quick create front door premium SKU in the Azure portal":::

1. Select **Review + create**, review the summary, and then select **Create**. It might take several minutes to deploy to a

After your deployment is complete, create a second web app. Use the same procedure with the same values, except for the following values:

| Setting          | Value     |
| ---              | ---  |
| **Resource group**   | Select **Create new** and enter *FrontDoorQS_rg2*. |
| **Name**             | Enter a unique name for your Web App, in this example, *WebAppContoso-002*.  |
| **Region**           | A different region, in this example, *South Central US* |
| **App Service plan** > **Windows Plan**         | Select **New** and enter *myAppServicePlanSouthCentralUS*, and then select **OK**. |

## Create a Front Door Standard/Premium (Preview) for your application

Configure Azure Front Door Standard/Premium (Preview) to direct user traffic based on lowest latency between the two web apps servers. Also secure your Front Door with Web Application Firewall. 

1. Sign in to the Azure portal at https://portal.azure.com.

1. From the home page or the Azure menu, select **Create a resource**. Search for **Front Door Standard/Premium (Preview)** > **Add** > **Comparing Offerings** > **Custom Create**.

1. On the **Basics** tab, enter or select the following information, and then select **Next: Secret**. 

    | Setting | Value |
    | --- | --- |
    | **Subscription** | Select your subscription. |
    | **Resource group** | Select **Create new** and enter *FrontDoorQS_rg0* in the text box. |
    | **Resource group location** | Select **East US** |
    | **Profile Name** | Enter a unique name in this subscription **Webapp-Contoso-AFD** |
    | **Tier** | Select **Premium**. For more information, see, [Tier Comparison](overview-tier-comparison.md). |
    
    :::image type="content" source="../media/create-front-door-portal/front-door-custom-create-2.png" alt-text="Create Front Door profile":::

1. *Optional*: **Secrets**. If you plan to use managed certificates, this step is optional. If you have an existing Key Vault in Azure that you plan to use to Bring Your Own Certificate for custom domain, then select **Add a certificate**. You can also add certificate in the management experience after creation.

    >[!NOTE]
    >You need to have the right permission to add the certificate from Azure Key Vault as a user. Please refer to [Configure HTTPS on a custom domain](custom-domain-ssl).
    > 

    :::image type="content" source="../media/create-front-door-portal/front-door-custom-create-secret.png" alt-text="Add a secret in custom create":::

1. In **Endpoint** tab, click **Add an Endpoint** and give your endpoint a globally unique name. You can create multiple endpoints in your Front Door profile after you finish the create experience. This example uses *contoso-frontend*. Leave Origin response timeout (in seconds) and Status to default values. Select **Add**.
    
    :::image type="content" source="../media/create-front-door-portal/front-door-custom-create-add-endpoint.png" alt-text="Add an endpoint":::

1. Add a custom domain in  management experience.

1. Next, add an Origin Group that contains your two web apps. Select **+** to open **Add an origin group**. For Name, enter *myOrignGroup*, then select **Add an origin**.
 
     :::image type="content" source="../media/create-front-door-portal/front-door-custom-create-add-origin-group.png" alt-text="Add an origin group":::

1. In the **Add an origin** page, follow information below.

    | Setting | Value |
    | --- | --- |
    | **Name** | Enter **webapp1** |
    | **Origin type** | Select **App services** |
    | **Host name** | Select `WebAppContoso-001.azurewebsites.net` |
    | **Origin host header** | Select `WebAppContoso-001.azurewebsites.net` |
    | **Other fields** | Leave all other fields as default. |

   Select **Add**.

    > [!NOTE]
    > When creating a Front Door profile, you must select an origin from the same subscription the Front Door is created in.
   
   :::image type="content" source="../media/create-front-door-portal/front-door-custom-create-add-origin-1.png" alt-text="Add another origin":::

1. Repeat step 8 to add the second origin webapp002 by selecting `webappcontoso-002.azurewebsite.net` as the **Origin host name** and **Origin host header**.

1. On the **Add an origin group** page, you will see two origins added, leave all other fields default.
  
   :::image type="content" source="../media/create-front-door-portal/front-door-custom-create-add-origin-group-2.png" alt-text="Add an origin group":::

1. Next, add a Route to map your frontend endpoint to the Origin group. This route forwards requests from the endpoint to myOriginGroup. Select **+ Add** on Route to configure a Route.  

1. In Add a route, follow steps below.
  
      | Setting | Value |
    | --- | --- |
    | **Name** | Enter **MyRoute** |    
    | **Domain** | Select `contoso-frontend.z01.azurefd.net` | 
    | **Host name** | Select `WebAppContoso-001.azurewebsites.net` |
    | **Patterns to match** | Leave as default. |
    | **Accepted protocols** | Leave as default. | 
    | **Redirect** | Leave it default for **Redirect all traffic to use HTTPS**. | 
    | **Origin group** | Select **MyOriginGroup**. | 
    | **Origin path** | Leave as default. | 
    | **Forwarding protocol** | Select **Match incoming request**. | 
    | **Caching** | Leave unchecked in this quickstart. If you want to have your contents cached on edges, click the check box for **Enable caching**. |
    | **Rules** | Leave as default. After you create your front door profile, you can create custom rules and apply them to routes. |  
       

    >[!WARNING]
    > You **must** ensure that there is a route for each endpoint. Failing to do so may result in endpoint not work.

    Select **Add**.

    :::image type="content" source="../media/create-front-door-portal/front-door-custom-create-add-route-without-caching.png" alt-text="Add route without caching":::

1. Next, select **+ Add** on Security to add a WAF policy. Select **Add** New and give your policy a unique name. Select the check box for **Add bot protection**. Select the endpoint in **Domains**, then select **Add**.

   :::image type="content" source="../media/create-front-door-portal/front-door-custom-create-add-waf-policy-2.png" alt-text="add WAF policy":::

1. Select **Review + Create**, and then **Create**. It takes a few mins for the configurations to be propagated to all edge POPs. Now you have your first Front Door profile and endpoint.

   :::image type="content" source="../media/create-front-door-portal/front-door-custom-create-review.png" alt-text="Review custom create":::

## Verify Azure Front Door

Once you create a Front Door, it takes a few minutes for the configuration to be deployed globally. Once complete, access the frontend host you created. In a browser, go to `contoso-frontend.z01.azurefd.net`. Your request will automatically get routed to the nearest server to you from the specified servers in the origin group.

If you created these apps in this quickstart, you'll see an information page.

To test instant global failover, we'll use the following steps:

1. Open a browser, as described above, and go to the frontend address: `contoso-frontend.azurefd.net`.

1. In the Azure portal, search for and select *App services*. Scroll down to find one of your web apps, **WebAppContoso-001** in this example.

1. Select your web app, and then select **Stop**, and **Yes** to verify.

1. Refresh your browser. You should see the same information page.

   >[!TIP]
   >There is a little bit of delay for these actions. You might need to refresh again.

1. Find the other web app, and stop it as well.

1. Refresh your browser. This time, you should see an error message.

    :::image type="content" source="../media/create-front-door-portal/web-app-stopped-message.png" alt-text="Both instances of the web app stopped":::

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
> [Add a custom domain](how-to-add-custom-domain.md)
