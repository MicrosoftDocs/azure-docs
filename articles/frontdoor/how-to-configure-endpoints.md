---
title: 'Configure an endpoint with Front Door manager - Azure Front Door'
description: This article shows you how to configure an endpoint for an existing Azure Front Door profile with Front Door manager.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: how-to
ms.date: 03/16/2022
ms.author: duau
---

# Configure an endpoint with Front Door manager

This article shows you how to create an endpoint for an existing Azure Front Door profile with Front Door manager.

## Prerequisites

Before you can create an Azure Front Door endpoint with Front Door manager, you must have an Azure Front Door profile created. The profile must have at least one or more endpoints. To organize your Azure Front Door endpoints by internet domains, web applications, or other criteria, you can use multiple profiles. 

To create an Azure Front Door profile, see [create a Azure Front Door](create-front-door-portal.md).

## Create a new Azure Front Door endpoint

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Azure Front Door profile.

1. Select **Front Door manager**. Then select **+ Add an endpoint** to create a new endpoint.
   
    :::image type="content" source="./media/how-to-configure-endpoints/select-create-endpoint.png" alt-text="Screenshot of add an endpoint through Front Door manager." lightbox="./media/how-to-configure-endpoints/select-create-endpoint-expanded.png":::

1. On the **Add an endpoint** page, enter a unique name for the endpoint.
    
    :::image type="content" source="./media/how-to-configure-endpoints/create-endpoint-page.png" alt-text="Screenshot of add an endpoint page.":::

    | Setting | Description |
    |--|--|
    | Name | Enter a unique name for the new Azure Front Door Standard/Premium endpoint. Azure Front Door will generate a unique Endpoint hostname based on the endpoint name in the form of `<endpointname>-hash.z01.azurefd.net`. The Endpoint hostname is a deterministic DNS name that helps prevent subdomain takeover. This name is used to access your cached resources at the domain `<endpointname>-hash.z01.azurefd.net`.  |
    | Status | Select the checkbox to enable this endpoint. |

### Add a route

1. To add a **Route**, first expand an endpoint from the list of endpoints in the Front Door manager.

    :::image type="content" source="./media/how-to-configure-endpoints/select-endpoint.png" alt-text="Screenshot of list of endpoints in Front Door manager." lightbox="./media/how-to-configure-endpoints/select-endpoint-expanded.png":::

1. In the endpoint configuration pane, select **+ Add a route** to configure the mapping of your domains and matching URL path patterns to an origin group.

    :::image type="content" source="./media/how-to-configure-endpoints/add-route.png" alt-text="Screenshot of add a route button from endpoint configuration pane." lightbox="./media/how-to-configure-endpoints/add-route-expanded.png":::

1. On the **Add a route** page, enter, or select the following information:
   
    :::image type="content" source="./media/how-to-configure-endpoints/create-route.png" alt-text="Screenshot of the add a route page.":::

    | Setting | Description |
    |--|--|
    | Name | Enter a unique name for the new route. |
    | **Domains** | |
    | Domains | Select one or more domains that have been validated and isn't associated to another Route. To add a new Domain or a Custom Domain, see [Add a Custom Domain](standard-premium/how-to-add-custom-domain.md) |
    | Patterns to match | Configure all URL path patterns that this route will accept. For example, you can set the pattern to match to `/images/*` to accept all requests on the URL `www.contoso.com/images/*`. Azure Front Door will try to determine the traffic based on Exact Match first, if no exact match Paths, then look for a wildcard Path that matches. If no routing rules are found with a matching Path, then reject the request and return a 400: Bad Request error HTTP response. Patterns to match paths are case insensitive, meaning paths with different casings are treated as duplicates. For example, you have the same host using the same protocol with paths /FOO and /foo. These paths are considered duplicates, which isn't allowed in the *Patterns to match* setting. |
    | Accepted protocols | Specify the protocols you want Azure Front Door to accept when the client is making the request. |
    | **Redirect** | |
    | Redirect all traffic to use HTTPS | Specify whether HTTPS is enforced for the incoming request with HTTP request |
    | **Origin group** | |
    | Origin group | Select which origin group should be forwarded to when the back to origin request occurs. To add a new Origin Group, see [Configure an origin group](standard-premium/how-to-create-origin.md). |
    | Origin path | This path is used to rewrite the URL that Azure Front Door will use when constructing the request forwarded to the origin. By default, this path isn't provided. As such, Azure Front Door will use the incoming URL path in the request to the origin. You can also specify a wildcard path, which will copy any matching part of the incoming path to the request path to the origin. Origin path is case sensitive. <br><br/> Pattern to match: /foo/* <br/> Origin path: /fwd/ <br><br/> Incoming URL path: /foo/a/b/c/ <br/> URL from Azure Front Door to origin: fwd/a/b/c. |
    | Forwarding protocol | Select the protocol used for forwarding request. |
    | Caching | Select this option to enable caching of static content with Azure Front Door. |
    | Rules | Select Rule Sets that will be applied to this Route. For more information about how to configure Rules, see [Configure a Rule Set for Azure Front Door](standard-premium/how-to-configure-rule-set.md). |

1. Select **Add** to create the new route. The route will appear in the list of Routes for the endpoints.

    :::image type="content" source="./media/how-to-configure-endpoints/endpoint-route.png" alt-text="Screenshot of new created route in an endpoint.":::

### Add security policy

1. Select **+ Add a policy**, in the *Security policy* pane to apply or create a new web application firewall policy to your domains.

    :::image type="content" source="./media/how-to-configure-endpoints/add-policy.png" alt-text="Screenshot of add a policy button from endpoint configuration pane." lightbox="./media/how-to-configure-endpoints/add-policy.png":::

1. On the **Add security policy** page, enter, or select the following information:

    :::image type="content" source="./media/how-to-configure-endpoints/add-security-policy.png" alt-text="Screenshot of add security policy page." :::

    | Setting | Description |
    |--|--|
    | Name | Enter a unique name within this Front Door profile for the security policy. |
    | **Web application firewall policy** | | 
    | Domains | Select one or more domains you wish to apply this web application firewall (WAF) policy to. |
    | WAF Policy | Select or create a new WAF policy. When you select an existing WAF policy, it must be the same tier as the Azure Front Door profile. For more information about how to create a WAF policy to use with Azure Front Door, see [Configure WAF policy](../web-application-firewall/afds/waf-front-door-create-portal.md). |

1. Select **Save** to create the security policy and associate it with the endpoint.

    :::image type="content" source="./media/how-to-configure-endpoints/associated-security-policy.png" alt-text="Screenshot of security policy associated with an endpoint." lightbox="./media/how-to-configure-endpoints/associated-security-policy-expanded.png":::

## Configure origin timeout

Origin timeout is the amount of time Azure Front Door will wait until it considers the connection to origin has timed out. You can set this value on the overview page of the Azure Front Door profile. This value will be applied to all endpoints in the profile.

:::image type="content" source="./media/how-to-configure-endpoints/origin-timeout.png" alt-text="Screenshot of the origin timeout settings on the overview page of the Azure Front Door profile.":::

## Clean up resources

In order to remove an endpoint, you first have to remove any security policies associated with the endpoint. Then select **Delete endpoint** to remove the endpoint from the Azure Front Door profile.

:::image type="content" source="./media/how-to-configure-endpoints/delete-endpoint.png" alt-text="Screenshot of the delete endpoint button from inside an endpoint." lightbox="./media/how-to-configure-endpoints/delete-endpoint-expanded.png":::

## Next steps

* Learn about the use of [origins and origin groups](origin.md) in an Azure Front Door configuration.
* Learn about [rules match conditions](rules-match-conditions.md) in an Azure Front Door rule set.
* Learn more about [policy settings](../web-application-firewall/afds/waf-front-door-policy-settings.md) for WAF with Azure Front Door.
* Learn how to create [custom rules](../web-application-firewall/afds/waf-front-door-custom-rules.md) to protect your Azure Front Door profile.
