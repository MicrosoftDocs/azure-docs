---
title: Deploy Azure Front Door in front of Azure API Management
description: Learn how to front your API Management instance with an instance of Azure Front Door.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: how-to
ms.date: 08/22/2022
ms.author: danlep
---
# Create Front Door in front of Azure API Management

Ref: https://techcommunity.microsoft.com/t5/azure-paas-blog/integrate-azure-front-door-with-azure-api-management/ba-p/2654925

Azure Front Door is a modern application delivery network platform providing a secure, scalable content delivery network (CDN), dynamic site acceleration, and global HTTP(s) load balancing for your global web applications.

Azure Front Door supports ... and offers always-on availability, low latency, SSL offload, health probes, etc. etc. For a full list of supported features, see [What is Azure Front Door?](../frontdoor/front-door-overview.md). 

This article provides detailed steps to set up Azure Front Door Standard/Premium in front of the API gateway of a publicly accessible Azure API Management instance. It also shows the steps to restrict API Management to accept API traffic only from Azure Front Door. You can configure Front Door in this scenario with either:

- A non-networked API Management instance
- An API Management instance injected in a virtual network in [external mode](api-management-using-with.vnet.md) (currently supported only in the Developer and Premium service tiers)

## Prerequisites

* An API Management instance. The instance must be in the same subscription you use for your Azure Front Door profile. If you choose to use a network-injected instance, it must be deployed in an external VNet. 
* The instance's gateway endpoint can be configured with a [custom domain](). However,if you are going to route traffic using HTTPS via port 443, only certificates from valid certificate authorities can be used at the backend (origin) with Front Door. Certificates from internal CAs or self-signed certificates aren't allowed.
* Import one or more APIs to your API Management instance to confirm routing through Front Door.

## Configure Azure Front Door 

### Create profile

For steps to create an Azure Front Door Standard/Premium profile, see [Quickstart: Create an Azure Front Door profile - Azure portal](../frontdoor/create-front-door-portal.md). For this article, you may choose a Front Door Standard profile. For a comparison of Front Door Standard and Front Door Premium, see [Tier comparison](../frontdoor/standard-premium/tier-comparison.md).

Configure the following settings that are specific to using your API Management instance as a Front Door origin. For an explanation of other settings, see the Front Door quickstart. 

|Setting     |Value  |
|---------|---------|
| **Origin type**       | Select **API Management**        |
| **Origin hostname**     | Enter the hostname of your API Management instance, for example, *myapim*.azure-api.net       |
| **Caching**    | Select **Enable caching** for Front Door to [cache static content](../frontdoor/front-door-caching.md?pivots=front-door-standard-premium)      |
| **Query string caching behavior**     | Select **Use Query String**        |

:::image type="content" source="media/front-door-api-management/quick-create-front-door-profile.png" alt-text="Screenshot of creating a Front Door profile in the portal.":::

### Update default origin group

After the profile is created, update the default origin group that was created to include an API Management health probe.

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


### Update default route [is this needed?]

Update the default route that is configured in the profile.

1. In the [portal](https://portal.azure.com), go to your Front Door profile.
1. In the left menu, under **Settings** select **Origin groups**.
1. Expand **default-origin-group**.
1. In the context menu (**...**) of **default-rout**, select **Configure route**.
1. Set **Forwarding protocol** to **Match incoming request** and then select **Update**.


### Test the configuration

Test the Front Door profile configuration by calling an API hosted by API Management. First call the API directly through the API Management gateway to ensure that that the API is reachable. Then, call the API through Front Door. To test, you can use a command line client such as `curl` for the calls, or a tool such as [Postman](https://www.getpostman.com).

### Call an API directly through API Management

In the following example, an operation in the Demo Conference API hosted by an API Management instance is called directly using Postman. The instance's hostname is in the `azure-api.net` domain. In this example, a valid subscription key is passed using a request header. A successful response shows `200 OK` and returns the expected data:

:::image type="content" source="media/front-door-api-management/test-api-management-gateway.png" alt-text="Screenshot showing calling API Management endpoint directly using Postman.":::

### Call an API directly through Front Door


In the following example, the same operation in the Demo Conference API is called using the Front Door endpoint configured for your instance. You can find the Front Door endpoint's hostname on the **Properties** page of your Front Door profile in the portal. The hostname is the `azurefd.net` domain. Again, a successful response shows `200 OK` and returns the expected data:

:::image type="content" source="media/front-door-api-management/test-front-door-gateway.png" alt-text="Screenshot showing calling Front Door endpoint using Postman.":::


## Restrict incoming traffic to API Management instance


You can configure API Management policies so that the API Management accepts traffic only from Azure Front Door. You can accomplish this restriction using one or both of the [following methods](../frontdoor/front-door-faq.md#how-do-i-lock-down-the-access-to-my-backend-to-only-azure-front-door-):

1. Restrict incoming IP addresses to your API Management instances
1. Restrict traffic based on value of the `X-Azure-FDID` header
d

### Restrict incoming IP addresses

You can configure the [ip-filter](/api-management-access-restriction-policies.md#CheckHTTPHeader) policy to filter incoming requests based on the following Azure infrastructure IP addresses:
    *
    *



### Check Front Door header

You can configure the [check-header](/api-management-access-restriction-policies.md#CheckHTTPHeader) policy to filter incoming requests based on the `X-Azure-FDID` HTTP request header. Azure Front Door sends this header to API Management with its unique Front Door ID. You can find the **Front Door ID** value on the **Overview** page of the Front Door profile in the portal.

In the following policy example, the Front Door ID is specified using a [named value](api-management-howto-properties.md) named `FrontDoorId`. 

```xml
<check-header name="X-Azure-FDID" failed-check-httpcode="403" failed-check-error-message="Invalid request." ignore-case="false">
        <value>{{FrontDoorId}}</value>
</check-header>
```

Requests that are not accompanied by a valid `X-Azure-FDID` header return a `403 Forbidden` response.

Restrict Inbound IP

Restrict Inbound IP to accept traffic from Azure Front Door's backend IP address space and Azure's infrastructure services only.

 

External Virtual Network Type APIM

For APIM instance deployed as external VNet mode, we can simply restrict the incoming IP using inbound rule in the network security groups of your APIM subnet.

* Allow service tag **AzureFrontDoor.Backend** in inbound rule for port 443. (Is it also needed for port 80?)
* Also allow incoming traffic from Azure's basic infrastructure services through virtualized host IP addresses: 168.63.129.16 and 169.254.169.254
* If your APIM service isn’t deployed into Vnet (None for the Virtual Network type), then there’s nowhere you can put the inbound rule in. But you can still leverage APIM IP restriction policy to achieve this goal. See policy doc here: https://docs.microsoft.com/en-us/azure/api-management/api-management-access-restriction-policies#Res.... 

Allow Azure Front Door Backend Ips. Refer AzureFrontDoor.Backend section in Azure IP Ranges and Service Tags for Front Door's IPv4 backend IP address range.

### Check Front Door header

```xml
<check-header name="X-Azure-FDID" failed-check-httpcode="403" failed-check-error-message="Invalid request." ignore-case="false">
            <value>{{FrontDoorId}}</value>
        </check-header>
```



## (Optional) Configure Front Door for developer portal
\\


## Next steps

To automate deployments, see the following Quickstart Templates:

* [Front Door Standard/Premium with API Management origin](https://azure.microsoft.com/resources/templates/front-door-standard-premium-api-management-external/)



============



* Backend pool - API Management service
* Health probe settings to gatway: - Path `/status-0123456789abcdef`, HTTPS, GET method, 30 sec interval
* Health probe settings to developer portal ?
* Routing rules 
    * Gateway - HTTPS only? Match incoming requests?

    * Developer portal

* Considerations for multi-region - regional origins?


