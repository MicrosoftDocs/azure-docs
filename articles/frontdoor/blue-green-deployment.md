---
title: Blue/Green deployments using Azure Front Door
description: Learn how to use Azure Front Door to implement a blue/green deployment strategy for your web applications.
services: frontdoor
author: duongau
ms.author: duau
ms.service: azure-frontdoor
ms.reviewer: gamullen, hmb
ms.topic: how-to
ms.date: 11/18/2024
---

# Blue/Green Deployments Using Azure Front Door

*Blue/Green deployment* is a software release strategy that gradually introduces application updates to a small group of users. If the updates are successful, the number of users accessing the new deployment is gradually increased until all users are on the new version. If issues arise, traffic can be redirected to the old version, ensuring minimal disruption. This approach is safer than deploying updates to all users at once.

Azure Front Door is Microsoft's modern cloud Content Delivery Network (CDN) that offers fast, reliable, and secure access to your application's static and dynamic web content globally. This article explains how to use Azure Front Door's global load balancing capabilities to implement a blue/green deployment model for your backends.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create an Azure Front Door profile

1. Sign in to the [Azure portal](https://portal.azure.com/?WT.mc_id=A261C142F).

1. Select **Create a resource** from the home page, search for *Front Door and CDN profiles*, and select **Create**.

1. Select **Custom create** on the *Compare offerings* page, and then select **Continue to create a Front Door**.

1. On the **Basics** tab, enter or select the following information:

    | Settings | Values |
    |--|--|
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new** and enter `myAFDResourceGroup`. |
    | Resource group location | Select **East US**. |
    | Name | Enter a unique name for your Front Door profile. |
    | Tier | Select **Standard**. |

1. Select the **Endpoints** tab, and then select **Add endpoint**. Enter a globally unique name for your endpoint, and then select **Add**. You can create more endpoints after the deployment.

1. Select **+ Add a route** to configure routing to your Web App origin.

    :::image type="content" source="./media/blue-green-deployment/endpoint.png" alt-text="Screenshot of adding a new endpoint for a new Azure Front Door profile.":::

1. Provide a name for the route and configure the route settings based on the needs of your application. For more information, see [Create a Front Door for your application](create-front-door-portal.md#create-a-front-door-for-your-application).

    :::image type="content" source="./media/blue-green-deployment/add-a-route.png" alt-text="Screenshot of the added route page for a new Azure Front Door profile.":::

1. To create a new origin group, select **Add a new origin group** and enter `myOriginGroup` as the name.

1. Select **+ Add** to add an origin to the origin group. Enter the following information for the existing version of the application:

    :::image type="content" source="./media/blue-green-deployment/add-current-origin.png" alt-text="Screenshot of adding the first origin in an origin group for a new Azure Front Door profile.":::

    | Settings | Values |
    |--|--|
    | Name | Enter `CurrentWebApp`. |
    | Origin type | Select *App Service* from the dropdown. |
    | Hostname | Enter the hostname of your Web App, for example, `webapp-current.azurewebsites.net`. |
    | Priority | Enter `1`. |
    | Weight | Enter `75`. |
    | Status | Select the check box for **Enable this origin**. |

1. Select **+ Add** to add another origin to the origin group. Enter the following information for the new version of the application:

    :::image type="content" source="./media/blue-green-deployment/add-new-origin.png" alt-text="Screenshot of adding the second origin in an origin group for a new Azure Front Door profile.":::

    | Settings | Values |
    |--|--|
    | Name | Enter `NewWebApp`. |
    | Origin type | Select *App Service* from the dropdown. |
    | Hostname | Enter the hostname of your Web App, for example, `webapp-new.azurewebsites.net`. |
    | Priority | Enter `1`. |
    | Weight | Enter `25`. |
    | Status | Leave **Enable this origin** unchecked. |

    > [!NOTE]
    > Initially, set the weight of the current origin higher than the new origin to ensure most traffic is routed to the current origin. Gradually increase the weight of the new origin and decrease the weight of the current origin as you test. The total weight doesn't need to be 100, but it helps visualize traffic distribution. The example sets the existing origin to receive three times as much traffic as the new origin.

1. Enable session affinity if your application requires it. For more information, see [Session affinity](routing-methods.md). 

    > [!NOTE]
    > *Session affinity* ensures the end user is routed to the same origin after the first request. Enable this feature based on your application and the type of enhancements being rolled out. For major revisions, enable session affinity to keep users on the new codebase. For minor enhancements, you can leave session affinity disabled. When in doubt, enable session affinity.

1. Health probe settings can be left at the default values. Adjust the probe settings based on your application's needs. For more information, see [Health probes](health-probes.md).

1. Under **Load balancing settings**, enter the following information:

     :::image type="content" source="./media/blue-green-deployment/configure-origin-group-settings.png" alt-text="Screenshot of configuring the origin group settings.":::

    | Settings | Values |
    |--|--|
    | Sample size | Enter `4`. |
    | Successful samples required | Enter `3`. |
    | Latency sensitivity (in milliseconds) | Enter `500`. |

    > [!NOTE]
    > Set the latency sensitivity to 500 milliseconds (half a second) or higher to ensure both origins are used, as one origin might be faster than the other.

1. Select **Add** to add the origin group. Then select **Review + create** to review the settings of your Front Door profile. Select **Create** to create the profile.

## Start Blue/Green Deployment

To begin the blue/green deployment, enable the new origin to start routing traffic to it while retaining the option to revert to the old origin if necessary.

1. Once the Front Door profile is created, navigate to the origin group you set up earlier. Select the new origin and check **Enable this origin** to start routing traffic to it.

    :::image type="content" source="./media/blue-green-deployment/enable-new-origin.png" alt-text="Screenshot of enabling the new origin to receive traffic.":::

1. Monitor the new origin to ensure it functions correctly. Gradually increase the weight of the new origin while decreasing the weight of the old origin as you gain confidence in the new origin's performance. Continue adjusting the weights until all traffic is routed to the new origin.

1. If any issues arise with the new origin, disable it to route all traffic back to the old origin. This allows you to address and resolve issues without affecting users.

## Next steps

[Secure traffic to your Azure Front Door origins](origin-security.md)