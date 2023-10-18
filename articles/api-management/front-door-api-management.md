---
title: Configure Azure Front Door in front of Azure API Management
description: Learn how to front your API Management instance with Azure Front Door Standard/Premium to provide global HTTPS load balancing, TLS offloading, dynamic request acceleration, and other capabilities.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: how-to
ms.date: 09/27/2022
ms.author: danlep
---
# Configure Front Door Standard/Premium in front of Azure API Management

Azure Front Door is a modern application delivery network platform providing a secure, scalable content delivery network (CDN), dynamic site acceleration, and global HTTP(s) load balancing for your global web applications. When used in front of API Management, Front Door can provide TLS offloading, end-to-end TLS, load balancing, response caching of GET requests, and a web application firewall, among other capabilities. For a full list of supported features, see [What is Azure Front Door?](../frontdoor/front-door-overview.md) 

[!INCLUDE [ddos-waf-recommendation](../../includes/ddos-waf-recommendation.md)]

This article shows how to:

* Set up an Azure Front Door Standard/Premium profile in front of a publicly accessible Azure API Management instance: either non-networked, or injected in a virtual network in [external mode](api-management-using-with-vnet.md). 
* Restrict API Management to accept API traffic only from Azure Front Door. 

## Prerequisites

* An API Management instance. 
    * If you choose to use a network-injected instance, it must be deployed in an external VNet. (Virtual network injection is supported in the Developer and Premium service tiers.) 
* Import one or more APIs to your API Management instance to confirm routing through Front Door.

## Configure Azure Front Door 

### Create profile

For steps to create an Azure Front Door Standard/Premium profile, see [Quickstart: Create an Azure Front Door profile - Azure portal](../frontdoor/create-front-door-portal.md). For this article, you may choose a Front Door Standard profile. For a comparison of Front Door Standard and Front Door Premium, see [Tier comparison](../frontdoor/standard-premium/tier-comparison.md).

Configure the following Front Door settings that are specific to using the gateway endpoint of your API Management instance as a Front Door origin. For an explanation of other settings, see the Front Door quickstart. 

|Setting     |Value  |
|---------|---------|
| **Origin type**       | Select **API Management**        |
| **Origin hostname**     | Select the hostname of your API Management instance, for example, *myapim*.azure-api.net       |
| **Caching**    | Select **Enable caching** for Front Door to [cache static content](../frontdoor/front-door-caching.md?pivots=front-door-standard-premium)      |
| **Query string caching behavior**     | Select **Use Query String**        |

:::image type="content" source="media/front-door-api-management/quick-create-front-door-profile.png" alt-text="Screenshot of creating a Front Door profile in the portal.":::

### Update default origin group

After the profile is created, update the default origin group to include an API Management health probe.

1. In the [portal](https://portal.azure.com), go to your Front Door profile.
1. In the left menu, under **Settings** select **Origin groups** > **default-origin-group**.
1. In the **Update origin group** window, configure the following **Health probe** settings and select **Update**:

    
    |Setting  |Value  |
    |---------|---------|
    |**Status**     | Select **Enable health probes**         |
    |**Path**     |  Enter `/status-0123456789abcdef`       |
    |**Protocol**     |     Select **HTTPS**    |
    |**Method**     |    Select **GET**     |
    |**Interval (in seconds)**     |   Enter **30**      |
    
    :::image type="content" source="media/front-door-api-management/update-origin-group.png" alt-text="Screenshot of updating the default origin group in the portal.":::

### Update default route 

We recommend updating the default route that's associated with the API Management origin group to use HTTPS as the forwarding protocol.

1. In the [portal](https://portal.azure.com), go to your Front Door profile.
1. In the left menu, under **Settings** select **Origin groups**.
1. Expand **default-origin-group**.
1. In the context menu (**...**) of **default-route**, select **Configure route**.
1. Set **Accepted protocols** to **HTTP and HTTPS**.
1. Enable **Redirect all traffic to use HTTPS**.
1. Set **Forwarding protocol** to **HTTPS only** and then select **Update**.

### Test the configuration

Test the Front Door profile configuration by calling an API hosted by API Management. First, call the API directly through the API Management gateway to ensure that the API is reachable. Then, call the API through Front Door. To test, you can use a command line client such as `curl` for the calls, or a tool such as [Postman](https://www.getpostman.com).

### Call an API directly through API Management

In the following example, an operation in the Demo Conference API hosted by the API Management instance is called directly using Postman. In this example, the instance's hostname is in the default `azure-api.net` domain, and a valid subscription key is passed using a request header. A successful response shows `200 OK` and returns the expected data:

:::image type="content" source="media/front-door-api-management/test-api-management-gateway.png" alt-text="Screenshot showing calling API Management endpoint directly using Postman.":::

### Call an API directly through Front Door

In the following example, the same operation in the Demo Conference API is called using the Front Door endpoint configured for your instance. The endpoint's hostname in the `azurefd.net` domain is shown in the portal on the **Overview** page of your Front Door profile. A successful response shows `200 OK` and returns the same data as in the previous example:

:::image type="content" source="media/front-door-api-management/test-front-door-gateway.png" alt-text="Screenshot showing calling Front Door endpoint using Postman.":::

## Restrict incoming traffic to API Management instance

Use API Management policies to ensure that your API Management instance accepts traffic only from Azure Front Door. You can accomplish this restriction using one or both of the [following methods](../frontdoor/front-door-faq.yml#what-are-the-steps-to-restrict-the-access-to-my-backend-to-only-azure-front-door-):

1. Restrict incoming IP addresses to your API Management instances
1. Restrict traffic based on the value of the `X-Azure-FDID` header

### Restrict incoming IP addresses

You can configure an inbound [ip-filter](ip-filter-policy.md) policy in API Management to allow only Front Door-related traffic, which includes:

* **Front Door's backend IP address space** - Allow IP addresses corresponding to the *AzureFrontDoor.Backend* section in [Azure IP Ranges and Service Tags](https://www.microsoft.com/download/details.aspx?id=56519).

    > [!NOTE]
    > If your API Management instance is deployed in an external virtual network, accomplish the same restriction by adding an inbound network security group rule in the subnet used for your API Management instance. Configure the rule to allow HTTPS traffic from source service tag *AzureFrontDoor.Backend* on port 443. 

* **Azure infrastructure services** - Allow IP addresses 168.63.129.16 and 169.254.169.254. 

### Check Front Door header

Requests routed through Front Door include headers specific to your Front Door configuration. You can configure the [check-header](check-header-policy.md) policy to filter incoming requests based on the unique value of the `X-Azure-FDID` HTTP request header that is sent to API Management. This header value is the **Front Door ID**, which is shown in the portal on the **Overview** page of the Front Door profile.

In the following policy example, the Front Door ID is specified using a [named value](api-management-howto-properties.md) named `FrontDoorId`. 

```xml
<check-header name="X-Azure-FDID" failed-check-httpcode="403" failed-check-error-message="Invalid request." ignore-case="false">
        <value>{{FrontDoorId}}</value>
</check-header>
```

Requests that aren't accompanied by a valid `X-Azure-FDID` header return a `403 Forbidden` response.

## (Optional) Configure Front Door for developer portal

Optionally, configure the API Management instance's developer portal as an endpoint in the Front Door profile. While the managed developer portal is already fronted by an Azure-managed CDN, you might want to take advantage of Front Door features such as a WAF. 

The following are high level steps to add an endpoint for the developer portal to your profile:

* To add an endpoint and configure a route, see [Configure and endpoint with Front Door manager](../frontdoor/how-to-configure-endpoints.md).

* When adding the route, add an origin group and origin settings to represent the developer portal:

  * **Origin type** - Select **Custom**
  * **Host name** - Enter the developer portal's hostname, for example, *myapim*.developer.azure-api.net 

For more information and details about settings, see [How to configure an origin for Azure Front Door](../frontdoor/how-to-configure-origin.md#create-a-new-origin-group).

> [!NOTE]
> If you've configured an [Microsoft Entra ID](api-management-howto-aad.md) or [Azure AD B2C](api-management-howto-aad-b2c.md) identity provider for the developer portal, you need to update the corresponding app registration with an additional redirect URL to Front Door. In the app registration, add the URL for the developer portal endpoint configured in your Front Door profile.

## Next steps

* To automate deployments of Front Door with API Management, see the template [Front Door Standard/Premium with API Management origin](https://azure.microsoft.com/resources/templates/front-door-standard-premium-api-management-external/)

* Learn how to deploy [Web Application Firewall (WAF)](../web-application-firewall/afds/afds-overview.md) on Azure Front Door to protect the API Management instance from malicious attacks.
