---
title: Configure Azure Front Door Standard/Premium endpoint with Endpoint Manager
description: This article shows how to configure an endpoint with Endpoint Manager.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: how-to
ms.date: 02/18/2021
ms.author: qixwang
---

# Configure an Azure Front Door Standard/Premium (Preview) endpoint with Endpoint Manager

> [!NOTE]
> This documentation is for Azure Front Door Standard/Premium (Preview). Looking for information on Azure Front Door? View **[Azure Front Door Docs](../front-door-overview.md)**.

This article shows you how to create an endpoint for an existing Azure Front Door Standard/Premium profile with Endpoint Manager.

> [!IMPORTANT]
> Azure Front Door Standard/Premium (Preview) is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

Before you can create an Azure Front Door Standard/Premium endpoint with Endpoint Manager, you must have created at least one Azure Front Door profile created. The profile has to have at least one or more Azure Front Door Standard/Premium endpoints. To organize your Azure Front Door Standard/Premium endpoints by internet domain, web application, or  other criteria, you can use multiple profiles. 

To create an Azure Front Door profile, see [Create a new Azure Front Door Standard/Premium profile](create-front-door-portal.md).

## Create a new Azure Front Door Standard/Premium Endpoint

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Azure Front Door Standard/Premium profile.

1. Select **Endpoint Manager**. Then select **Add an Endpoint** to create a new Endpoint.
   
    :::image type="content" source="../media/how-to-configure-endpoint-manager/select-create-endpoint.png" alt-text="Screenshot of add an endpoint through Endpoint Manager.":::

1. On the **Add an endpoint** page, enter, and select the following settings.
    
    :::image type="content" source="../media/how-to-configure-endpoint-manager/create-endpoint-page.png" alt-text="Screenshot of add an endpoint page.":::

    | Settings | Value |
    | -------- | ----- |
    | Name | Enter a unique name for the new Azure Front Door Standard/Premium endpoint. This name is used to access your cached resources at the domain `<endpointname>.az01.azurefd.net` |
    | Origin Response timeout (secs) | Enter a timeout value in seconds that Azure Front Door will wait before considering the connection with origin has timeout. |
    | Status | Select the checkbox to enable this endpoint. |

## Add Domains, Origin Group, Routes, and Security

1. Select **Edit Endpoint** at the endpoint to configure the route.

1. On the **Edit Endpoint** page, select **+ Add** under Domains.
   
    :::image type="content" source="../media/how-to-configure-endpoint-manager/select-add-domain.png" alt-text="Screenshot of select domain on Edit Endpoint page.":::

### Add Domain

1. On the **Add Domain** page, choose to associate a domain *from your Azure Front Door profile* or *add a new domain*. For information about how to create a brand new domain, see [Create a new Azure Front Door Standard/Premium custom domain](how-to-add-custom-domain.md).

    :::image type="content" source="../media/how-to-configure-endpoint-manager/add-domain-page.png" alt-text="Screenshot of Add a domain page.":::

1. Select **Add** to add the domain to current endpoint. The selected domain should appear within the Domain panel.

    :::image type="content" source="../media/how-to-configure-endpoint-manager/domain-in-domainview.png" alt-text="Screenshot of domains in domain view.":::

### Add Origin Group

1. Select **Add** at the Origin groups view. The **Add an origin group** page appears 

    :::image type="content" source="../media/how-to-configure-endpoint-manager/add-origin-group-view.png" alt-text="Screenshot of add an origin group page":::

1. For **Name**, enter a unique name for the new origin group

1. Select **Add an Origin** to add a new origin to current group.
 
#### Health Probes
Front Door sends periodic HTTP/HTTPS probe requests to each of your origin. Probe requests determine the proximity and health of each origin to load balance your end-user requests. Health probe settings for an origin group define how we poll the health status of app origin. The following settings are available for load-balancing configuration:

> [!WARNING]
> Since Front Door has many edge environments globally, health probe volume for your origin can be quite high - ranging from 25 requests every minute to as high as 1200 requests per minute, depending on the health probe frequency configured. With the default probe frequency of 30 seconds, the probe volume on your origin should be about 200 requests per minute.

* **Status**: Specify whether to turn on the health probing. If you have a single origin in your origin group, you can choose to disable the health probes reducing the load on your application backend. Even if you have multiple origins in the group but only one of them is in enabled state, you can disable health probes.
   
* **Path**: The URL used for probe requests for all the origin in this origin group. For example, if one of your origins is contoso-westus.azurewebsites.net and the path is set to /probe/test.aspx, then Front Door environments, assuming the protocol is set to HTTP, will send health probe requests to `http://contoso-westus.azurewebsites.net/probe/test.aspx`. 
   
* **Protocol**: Defines whether to send the health probe requests from Front Door to your origin with HTTP or HTTPS protocol.
   
* **Probe Method**: The HTTP method to be used for sending health probes. Options include GET or HEAD (default).

    > [!NOTE]
    > For lower load and cost on your origin, Front Door recommends using HEAD requests for health probes.

* **Interval(in seconds)**: Defines the frequency of health probes to your origin, or the intervals in which each of the Front Door environments sends a probe.
   
    >[!NOTE]
    >For faster failovers, set the interval to a lower value. The lower the value, the higher the health probe volume your origin receive. For example, if the interval is set to 30 seconds with say, 100 Front Door POPs globally, each backend will receive about 200 probe requests per minute.

#### Load balancing
Load-balancing settings for the origin group define how we evaluate health probes. These settings determine if the backend is healthy or unhealthy. They also check how to load-balance traffic between different origins in the origin group. The following settings are available for load-balancing configuration:

- **Sample size**. Identifies how many samples of health probes we need to consider for origin health evaluation.

- **Successful sample size**. Defines the sample size as previously mentioned, the number of successful samples needed to call the origin healthy. For example, assume a Front Door health probe interval is 30 seconds, sample size is 5, and successful sample size is 3. Each time we evaluate the health probes for your origin, we look at the last five samples over 150 seconds (5 x 30). At least three successful probes are required to declare the backend as healthy.

- **Latency sensitivity (extra latency)**. Defines whether you want Front Door to send the request to origin within the latency measurement sensitivity range or forward the request to the closest backend.

Select **Add** to add the origin group to current endpoint. The origin group should appear within the Origin group panel

:::image type="content" source="../media/how-to-configure-endpoint-manager/origin-in-origin-group.png" alt-text="Screenshot of origins in origin group.":::

### Add Route

Select **Add** at the Routes view, the **Add a route** page appears. For information how to associate the domain and origin group, see [Create a new Azure Front Door route](how-to-configure-route.md)

### Add Security

1. Select **Add** at the Security view, The **Add a WAF policy** page appears
 
    :::image type="content" source="../media/how-to-configure-endpoint-manager/add-waf-policy-page.png" alt-text="Screenshot of add a WAF policy page.":::

1. **WAF Policy**: select a WAF policy you like apply for the selected domain within this endpoint. 
  
   Select **Create New** to create a brand new WAF policy.

    :::image type="content" source="../media/how-to-configure-endpoint-manager/create-new-waf-policy.png" alt-text="Screenshot of create a new WAF policy.":::
   
    **Name**: enter a unique name for the new WAF policy. You could edit this policy with more configuration from the Web Application Firewall page.

    **Domains**: select the domain to apply the WAF policy.

1. Select **Add** button. The WAF policy should appear within the Security panel

    :::image type="content" source="../media/how-to-configure-endpoint-manager/waf-in-security-view.png" alt-text="Screenshot of WAF policy in security view.":::

## Clean up resources

To delete an endpoint when it's no longer needed, select **Delete Endpoint** at the end of the endpoint row 

:::image type="content" source="../media/how-to-configure-endpoint-manager/delete-endpoint.png" alt-text="Screenshot of how to delete an endpoint.":::

## Next steps

To learn about custom domains, continue to [Adding a custom domain](how-to-add-custom-domain.md).
