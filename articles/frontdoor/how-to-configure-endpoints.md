---
title: Add a new endpoint with Front Door manager
titleSuffix: Azure Front Door
description: This article shows you how to configure a new endpoint for an existing Azure Front Door profile with Front Door manager.
services: frontdoor
author: duongau
ms.service: azure-frontdoor
ms.topic: how-to
ms.date: 02/18/2025
ms.author: duau
---

# Add a new endpoint with Front Door manager

This article shows you how to add a new endpoint to an existing Azure Front Door profile in the Front Door manager.

## Prerequisites

Before you can create a new endpoint with Front Door manager, you must have an Azure Front Door profile created. To create an Azure Front Door profile, see [create an Azure Front Door](create-front-door-portal.md). The profile must have at least one endpoint.

## Create a new Front Door endpoint

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Azure Front Door profile.

1. Select **Front Door manager** from under *Settings* from the left side menu pane. Then select **+ Add an endpoint** to create a new endpoint.

1. On the **Add an endpoint** page, enter a unique name for the endpoint.

    | Field                | Description                                                                                                                |
    |----------------------|----------------------------------------------------------------------------------------------------------------------------|
    | **Name**             | Enter a unique name for the new Front Door endpoint. Azure Front Door generates a unique endpoint hostname based on the endpoint name in the form of `<endpointname>-*.z01.azurefd.net`. |
    | **Endpoint hostname**| A deterministic DNS (domain name system) name that helps prevent subdomain takeover. This name is used to access your resources through your Azure Front Door at the domain `<endpointname>-*.z01.azurefd.net`. |
    | **Status**           | Set as checked to enable this endpoint.                                                                                    |

### Add a route

1. To add a new **route**, first expand an endpoint from the list of endpoints in the Front Door manager.

1. In the endpoint configuration pane, select **+ Add a route** to configure the mapping of your domains and routing configuration to your origin group.

    :::image type="content" source="./media/how-to-configure-endpoints/add-route.png" alt-text="Screenshot of add a route button from endpoint configuration pane." lightbox="./media/how-to-configure-endpoints/add-route-expanded.png":::

1. On the **Add a route** page, enter, or select the following information:


   
    | Field | Description |
    |--|--|
    | **Name** | Enter a unique name for the new route |
    | **Enable route** | Set as checked to enable this route. |
    | **Domains** | Select one or more validated domains that aren't associated to another route. For more information, see [add a custom domain](standard-premium/how-to-add-custom-domain.md). |
    | **Patterns to match** | Configure all URL path patterns that this route accepts. For example, you can set the pattern to match to `/images/*` to accept all requests on the URL `www.contoso.com/images/*`. Azure Front Door determines the traffic based on exact match first. If no paths match exactly, then Front Door looks for a wildcard path that matches. If no routing rules are found with a matching path, then the request gets rejected and returns a 400: Bad Request error HTTP response. Patterns to match paths aren't case sensitive, meaning paths with different casing are treated as duplicates. For example, you have a host using the same protocol with paths `/FOO` and `/foo`. These paths are considered duplicates, and aren't allowed in the *Patterns to match* field. |
    | **Accepted protocols** | Specify the protocols you want Azure Front Door to accept when the client is making the request. You can specify HTTP, HTTPS, or both. |
    | **Redirect** | Specify whether HTTPS is enforced for the incoming HTTP requests. |
    | **Origin group** | Select the origin group to forward traffic to when requests are made to the origin. For more information, see [configure an origin group](standard-premium/how-to-create-origin.md). |
    | **Origin path** | This path is used to rewrite the URL that Front Door uses when forwarding the request to the origin. By default, this path isn't provided, so Front Door uses the incoming URL path in the request to the origin. You can also specify a wildcard path, which copies any matching part of the incoming path to the request path to the origin. The origin path is case sensitive. |
    | **Forwarding protocol** | Select the protocol used for forwarding request. You can specify HTTP only, HTTPS only, or match incoming request. |
    | **Caching** | Select this option to enable caching of static content with Azure Front Door. For more information, see [caching with Front Door](front-door-caching.md). |
    | **Rules** | Select rule sets that get applied to this route. For more information, see [rule sets for Front Door](front-door-rules-engine.md). |

1. Here's an example of how the *Origin path* field works:

    | Field                | Description                |
    |----------------------|----------------------------|
    | **Pattern to match**     | `/foo/*`                     |
    | **Origin path**          | `/fwd/`                     |
    | **Incoming URL path**    | `/foo/a/b/c/`                |
    | **URL from Front Door to origin** | `fwd/a/b/c`         |
    
1. Select **Add** to create the new route. The route appears in the list of routes for the endpoints.

    :::image type="content" source="./media/how-to-configure-endpoints/endpoint-route.png" alt-text="Screenshot of new created route in an endpoint.":::

### Add security policy

1. Select **+ Add a policy**, in the *Security policy* pane to apply or create a new web application firewall policy to associate to your domains.

1. On the **Add security policy** page, enter, or select the following information:

    :::image type="content" source="./media/how-to-configure-endpoints/add-security-policy.png" alt-text="Screenshot of add security policy page for FrontDoor." :::

    | Field                       | Description                                                                                                      |
    |-----------------------------|------------------------------------------------------------------------------------------------------------------|
    | **Name**                    | Enter a unique name within this Front Door profile for the security policy.                                       |
    | **Domains**                 | Select one or more domains you want to apply this security policy to.                                             |
    | **WAF (Web Application Firewall) Policy** | Select an existing or create a new WAF policy. When you select an existing WAF policy, it must be the same tier as the Front Door profile. For more information, see [configure WAF policy for Front Door](../web-application-firewall/afds/waf-front-door-create-portal.md). |

1. Select **Save** to create the security policy and associate it with the endpoint.

    :::image type="content" source="./media/how-to-configure-endpoints/associated-security-policy.png" alt-text="Screenshot of security policy associated with an endpoint." lightbox="./media/how-to-configure-endpoints/associated-security-policy-expanded.png":::

## Configure origin timeout

Origin timeout is the amount of time Azure Front Door waits until it considers the connection to origin valid. You can set this value on the overview page of the Azure Front Door profile. This value is applied to all endpoints in the profile.

:::image type="content" source="./media/how-to-configure-endpoints/origin-timeout.png" alt-text="Screenshot of the origin timeout settings on the overview page of the Azure Front Door profile.":::

## Clean up resources

In order to remove an endpoint, you first have to remove any security policies associated with the endpoint. Then select **Delete endpoint** to remove the endpoint from the Azure Front Door profile.

## Next steps

* Learn about the use of [origins and origin groups](origin.md) in an Azure Front Door configuration.
* Learn about [rules match conditions](rules-match-conditions.md) in an Azure Front Door rule set.
* Learn more about [policy settings](../web-application-firewall/afds/waf-front-door-policy-settings.md) for WAF with Azure Front Door.
* Learn how to create [custom rules](../web-application-firewall/afds/waf-front-door-custom-rules.md) to protect your Azure Front Door profile.
