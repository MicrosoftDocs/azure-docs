---
title: Add a new endpoint with Front Door manager
titleSuffix: Azure Front Door
description: This article shows you how to configure a new endpoint for an existing Azure Front Door profile with Front Door manager.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: how-to
ms.date: 06/02/2023
ms.author: duau
---

# Add a new endpoint with Front Door manager

This article shows you how to add a new endpoint to an existing Azure Front Door profile in the Front Door manager.

## Prerequisites

Before you can create a new endpoint with Front Door manager, you must have an Azure Front Door profile created. To create an Azure Front Door profile, see [create a Azure Front Door](create-front-door-portal.md). The profile must have at least one endpoint.

## Create a new Front Door endpoint

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Azure Front Door profile.

1. Select **Front Door manager** from under *Settings* from the left side menu pane. Then select **+ Add an endpoint** to create a new endpoint.
   
    :::image type="content" source="./media/how-to-configure-endpoints/select-create-endpoint.png" alt-text="Screenshot of add an endpoint through Front Door manager." lightbox="./media/how-to-configure-endpoints/select-create-endpoint-expanded.png":::

1. On the **Add an endpoint** page, enter a unique name for the endpoint.
    
    :::image type="content" source="./media/how-to-configure-endpoints/create-endpoint-page.png" alt-text="Screenshot of add an endpoint page.":::

   
    * **Name** - Enter a unique name for the new Front Door endpoint. Azure Front Door generates a unique endpoint hostname based on the endpoint name in the form of `<endpointname>-hash.z01.azurefd.net`.
    * **Endpoint hostname** - A deterministic DNS name that helps prevent subdomain takeover. This name is used to access your resources through your Azure Front Door at the domain `<endpointname>-hash.z01.azurefd.net`.
    * **Status** - Set as checked to enable this endpoint.

### Add a route

1. To add a new **route**, first expand an endpoint from the list of endpoints in the Front Door manager.

    :::image type="content" source="./media/how-to-configure-endpoints/select-endpoint.png" alt-text="Screenshot of list of endpoints in Front Door manager." lightbox="./media/how-to-configure-endpoints/select-endpoint-expanded.png":::

1. In the endpoint configuration pane, select **+ Add a route** to configure the mapping of your domains and routing configuration to your origin group.

    :::image type="content" source="./media/how-to-configure-endpoints/add-route.png" alt-text="Screenshot of add a route button from endpoint configuration pane." lightbox="./media/how-to-configure-endpoints/add-route-expanded.png":::

1. On the **Add a route** page, enter, or select the following information:
   
    :::image type="content" source="./media/how-to-configure-endpoints/create-route.png" alt-text="Screenshot of the route configuration page.":::

   
    * **Name** - Enter a unique name for the new route
    * **Enable route** - Set as checked to enable this route.
    * **Domains** - Select one or more domains that have been validated and isn't associated to another route. For more information, see [add a custom domain](standard-premium/how-to-add-custom-domain.md).
    * **Patterns to match** - Configure all URL path patterns that this route accepts. For example, you can set the pattern to match to `/images/*` to accept all requests on the URL `www.contoso.com/images/*`. Azure Front Door determines the traffic based on exact match first. If no paths match exactly, then Front Door looks for a wildcard path that matches. If no routing rules are found with a matching path, then the request get rejected and returns a 400: Bad Request error HTTP response. Patterns to match paths are not case sensitive, meaning paths with different casing are treated as duplicates. For example, you have a host using the same protocol with paths `/FOO` and `/foo`. These paths are considered duplicates, and aren't allowed in the *Patterns to match* field.
    * **Accepted protocols** - Specify the protocols you want Azure Front Door to accept when the client is making the request. You can specify HTTP, HTTPS, or both.
    * **Redirect** - Specify whether HTTPS is enforced for the incoming HTTP requests.
    * **Origin group** - Select the origin group to forward traffic to when requests are made to the origin. For more information, see [configure an origin group](standard-premium/how-to-create-origin.md).
    * **Origin path** - This path is used to rewrite the URL that Front Door uses when constructing the request forwarded to the origin. By default, this path isn't provided. Therefore, Front Door uses the incoming URL path in the request to the origin. You can also specify a wildcard path, which copies any matching part of the incoming path to the request path to the origin. The origin path is case sensitive.

        Pattern to match: `/foo/*`
        Origin path: `/fwd/` 

        Incoming URL path: `/foo/a/b/c/`
        URL from Front Door to origin: `fwd/a/b/c`
    
    * **Forwarding protocol** - Select the protocol used for forwarding request. You can specify HTTP only, HTTPS only, or match incoming request.
    * **Caching** - Select this option to enable caching of static content with Azure Front Door. For more information, see [caching with Front Door](front-door-caching.md). 
    * **Rules** - Select rule sets that get applied to this route. For more information, see [rule sets for Front Door](front-door-rules-engine.md).

1. Select **Add** to create the new route. The route appears in the list of routes for the endpoints.

    :::image type="content" source="./media/how-to-configure-endpoints/endpoint-route.png" alt-text="Screenshot of new created route in an endpoint.":::

### Add security policy

1. Select **+ Add a policy**, in the *Security policy* pane to apply or create a new web application firewall policy to associate to your domains.

    :::image type="content" source="./media/how-to-configure-endpoints/add-policy.png" alt-text="Screenshot of add a policy button from endpoint configuration pane." lightbox="./media/how-to-configure-endpoints/add-policy.png":::

1. On the **Add security policy** page, enter, or select the following information:

    :::image type="content" source="./media/how-to-configure-endpoints/add-security-policy.png" alt-text="Screenshot of add security policy page." :::

    * **Name** - Enter a unique name within this Front Door profile for the security policy.
    * **Domains** - Select one or more domains you want to apply this security policy to.
    * **WAF Policy** - Select an existing or create a new WAF policy. When you select an existing WAF policy, it must be the same tier as the Front Door profile. For more information, see [configure WAF policy for Front Door](../web-application-firewall/afds/waf-front-door-create-portal.md).

1. Select **Save** to create the security policy and associate it with the endpoint.

    :::image type="content" source="./media/how-to-configure-endpoints/associated-security-policy.png" alt-text="Screenshot of security policy associated with an endpoint." lightbox="./media/how-to-configure-endpoints/associated-security-policy-expanded.png":::

## Configure origin timeout

Origin timeout is the amount of time Azure Front Door waits until it considers the connection to origin has timed out. You can set this value on the overview page of the Azure Front Door profile. This value is applied to all endpoints in the profile.

:::image type="content" source="./media/how-to-configure-endpoints/origin-timeout.png" alt-text="Screenshot of the origin timeout settings on the overview page of the Azure Front Door profile.":::

## Clean up resources

In order to remove an endpoint, you first have to remove any security policies associated with the endpoint. Then select **Delete endpoint** to remove the endpoint from the Azure Front Door profile.

:::image type="content" source="./media/how-to-configure-endpoints/delete-endpoint.png" alt-text="Screenshot of the delete endpoint button from inside an endpoint." lightbox="./media/how-to-configure-endpoints/delete-endpoint-expanded.png":::

## Next steps

* Learn about the use of [origins and origin groups](origin.md) in an Azure Front Door configuration.
* Learn about [rules match conditions](rules-match-conditions.md) in an Azure Front Door rule set.
* Learn more about [policy settings](../web-application-firewall/afds/waf-front-door-policy-settings.md) for WAF with Azure Front Door.
* Learn how to create [custom rules](../web-application-firewall/afds/waf-front-door-custom-rules.md) to protect your Azure Front Door profile.
