---
title: Blue/Green deployments using Azure Front Door
description: Learn how to use Azure Front Door to implement a blue/green deployment strategy for your web applications.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: how-to
ms.date: 01/29/2024
---

# Blue/Green deployments using Azure Front Door

*Blue/Green deployment* is a software release methodology that gradually introduces application enhancements to a small subset of end users. If the enhancements are successful, the number of users on the new deployment is slowly increased until all users are on the new deployment. In case of any issues, requests are routed to the old backend with the previous application version. This is a much safer way to introduce code changes than suddenly pointing all users to the new enhancements. 

Azure Front Door is Microsoft’s modern cloud Content Delivery Network (CDN) that provides fast, reliable, and secure access between your users and your applications’ static and dynamic web content across the globe. This article explains how to use Front Door’s global load balancing capabilities to set up a blue/green deployment model for your backends.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create an Azure Front Door profile

1. Sign in to the [Azure portal](https://portal.azure.com/?WT.mc_id=A261C142F).

1. Select **Create a resource** from the home page, search for *Front Door and CDN profiles*, and select **Create**.

1. Select **Custom create** on the *Compare offerings* page, and then select **Continue to create a Front Door**.
1. On the **Basics** tab, enter or select the following information:

    | Settings | Values |
    | Subscriptions | Select your subscription. |
    | Resource group | Select **Create new** and enter myAFDResourceGroup into the text box. |
    | Resource group location | Select **East US**. |
    | Name | Enter a unique name for your Front Door profile. |
    | Tier | Select **Standard**. |

1. Select the **Endpoints** tab, and then select **Add endpoint**. Enter a globally unique name for your endpoint, and then select **Add**. You can create more endpoints after the deployment.

1. Select **+ Add a route** to configure routing to your Web App origin.

1. Provide a name for the route and configure the route settings based on the needs of your application. For more information, see [Create a Front Door for your application](create-front-door-portal.md#create-a-front-door-for-your-application).

1. To create a new origin group, select **Add a new origin group** and enter *myOriginGroup* as the name.

1. Select **+ Add** to add an origin to the origin group. Enter the following information for the existing version of the application:

    | Settings | Values |
    | Name | Enter **CurrentWebApp** for the name. |
    | Origin type | Select *App Service* from the dropdown. |
    | Hostname | Enter the hostname of your Web App. This example uses *webapp-current.azurewebsites.net*. |
    | Priority | Enter **1**. |
    | Weight | Enter **75**. |

1. Select **+ Add** to add another origin to the origin group. Enter the following information for the new version of the application:

    | Settings | Values |
    | Name | Enter **NewWebApp** for the name. |
    | Origin type | Select *App Service* from the dropdown. |
    | Hostname | Enter the hostname of your Web App. This example uses *webapp-new.azurewebsites.net*. |
    | Priority | Enter **1**. |
    | Weight | Enter **25**. |

    > [!NOTE]
    > Initially you want to set the weight of the current origin higher than the new origin. This ensures that most of the traffic is routed to the current origin. As you test the new origin, you can gradually increase the weight of the new origin and decrease the weight of the current origin. The total weight doesn't have to add up to be 100, although it will help you visualize the traffic distribution. The example sets the existing origin to receive three times as much traffic as the new origin.

1.