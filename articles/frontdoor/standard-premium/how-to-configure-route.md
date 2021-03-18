---
title: Configure Azure Front Door Route
description: This article shows how to configure a Route between your domains and origin groups.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: how-to
ms.date: 02/18/2021
ms.author: qixwang
---

# Configure an Azure Front Door Standard/Premium Route

> [!Note]
> This documentation is for Azure Front Door Standard/Premium (Preview). Looking for information on Azure Front Door? View [here](../front-door-overview.md).

This article explains each of the settings used in creating an Azure Front Door (AFD) Route for an existing endpoint. After you've added a custom domain and origin to your existing Azure Front Door endpoint, you need to configure route to define the association between domains and origins to route the traffic between them.

> [!IMPORTANT]
> Azure Front Door Standard/Premium (Preview) is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

Before you can configure an Azure Front Door Route, you must have created at least one origin group and one custom domain within the current endpoint. 

To set up an origin group, see [Create a new Azure Front Door Standard/Premium origin group](how-to-create-origin.md). 

## Create a new Azure Front Door Standard/Premium Route

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Azure Front Door Standard/Premium profile.

1. Select **Endpoint Manager** under **Settings**.
   
    :::image type="content" source="../media/how-to-configure-route/select-endpoint-manager.png" alt-text="Screenshot of Front Door Endpoint Manager settings." lightbox="../media/how-to-configure-route/select-endpoint-manager-expanded.png":::

1. Then select **Edit Endpoint** for the endpoint you want to configure the Route.
   
    :::image type="content" source="../media/how-to-configure-route/select-edit-endpoint.png" alt-text="Screenshot of selecting edit endpoint.":::

1. The **Edit Endpoint** page will appears. Select **+ Add** for Routes.
    
    :::image type="content" source="../media/how-to-configure-route/select-add-route.png" alt-text="Screenshot of add a route on edit endpoint page.":::    
    
1. On the **Add Route** page, enter, or select the following information.

    :::image type="content" source="../media/how-to-configure-route/add-route-page.png" alt-text="Screenshot of add a route page." lightbox="../media/how-to-configure-route/add-route-page-expanded.png"::: 

    | Setting | Value |
    | --- | --- |
    | Name | Enter a unique name for the new Route. |   
    | Domain| Select one or more domains that have been validated and isn't associated to another Route |
    | Patterns to Match  | Configure all URL path patterns that this route will accept. For example, you can set this to `/images/*` to accept all requests on the URL `www.contoso.com/images/*`. AFD will try to determine the traffic based on Exact Match first, if no exact match Paths, then look for a wildcard Path that matches. If no routing rules are found with a matching Path, then reject the request and return a 400: Bad Request error HTTP response. |
    | Accepted protocols | Specify the protocols you want Azure Front Door to accept when the client is making the request. |
    | Redirect | Specify whether HTTPS is enforced for the incoming request with HTTP request |
    | Origin group | Select which origin group should be forwarded to when the back to origin request occurs. |
    | Origin Path | Enter the path to the resources that you want to cache. To allow caching of any resource at the domain, leave this setting blank. |
    | Forwarding protocol | Select the protocol used for forwarding request. |
    | Caching | Select this option to enable caching of static content with Azure Front Door. |
    | Rule | Select Rule Sets that will be applied to this Route. For more information about how to configure Rules, see [Configure a Rule Set for Azure Front Door](how-to-configure-rule-set.md) | 

1. Select **Add** to create the new Route. The Route will appear in the list of Routes for the endpoint.
    
    :::image type="content" source="../media/how-to-configure-route/route-list-page.png" alt-text="Screenshot of routes list.":::  
    
## Clean up resources

To delete a route when you no longer need it, select the Route and then select **Delete**. 

:::image type="content" source="../media/how-to-configure-route/route-delete-page.png" alt-text="Screenshot of how to delete a route.":::  

## Next steps
To learn about custom domains, continue to the tutorial for adding a custom domain to your Azure Front Door endpoint.

> [!div class="nextstepaction"]
> [Add a custom domain]()
