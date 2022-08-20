---
title: Deploy Azure Front Door in front of Azure API Management
description: Learn how to front your API Management instance with an instance of Azure Front Door.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: how-to
ms.date: 08/19/2022
ms.author: danlep
---
# Create Front Door in front of Azure API Management

Ref: https://techcommunity.microsoft.com/t5/azure-paas-blog/integrate-azure-front-door-with-azure-api-management/ba-p/2654925

Azure Front Door is a modern application delivery network platform providing a secure, scalable CDN, dynamic site acceleration, and global HTTP(s) load balancing for your global web applications.


Azure Front Door supports ... and offers always-on availability, low latency, SSL offload, health probes, etc. etc. For a full list of supported features, see [What is Azure Front Door?](../frontdoor/front-door-overview.md). 

This article provides detailed steps to set up Azure Front Door Standard/Premium in front of an Azure API Management instance. It also shows the steps to restrict API Management to accept traffic only from Azure Front Door.
 
In this scenario, Azure Front Door requires a publicly accessibly origin, so that API Management must be non-networked, or injected in an [external virtual network](api-management-using-with-vnet.md). This article shows steps to use Front Door with a VNet-injected API Management instance, which supports the following scenario:
...
...
...

[!INCLUDE [premium-dev.md](../../includes/api-management-availability-premium-dev.md)]


## Prerequisites

* API Management instance deployed in an external VNet
* Import one or more APIs to your API Management instance to confirm routing through Front Door.
* You can also use the custom domain of APIM instance in the Front Door origin host name. But please note if you are going to route traffic using HTTPS via port 443, only certificates from valid Certificate Authorities can be used at the backend (origin) with Front Door. Certificates from internal CAs or self-signed certificates aren't allowed. 

## Deploy Azure Front profile 

For detailed steps to deploy an Azure Front Door Standard/Premium profile, see [Quickstart: Create an Azure Front Door profile - Azure portal](../frontdoor/create-front-door-portal.md). 

* Backend pool - API Management service
* Health probe settings to gatway: - Path `/status-0123456789abcdef`, HTTPS, GET method, 30 sec interval
* Health probe settings to developer portal ?
* Routing rules 
    * Gateway

    * Developer portal


### Quick create Front Door profile

### Update default origin group

### Associate route

* Update default route that is configured. Set **Forwarding protocol** to **Match incoming request**. [Might be OK to accept default value of **HTTPS only**?]
* Select **Enable caching** to enable Front Door to [cache static content](../frontdoor/front-door-caching.md?pivots=front-door-standard-premium). In **Query string caching behavior** select  **Use query string** (or another value if that works better for your scenario?)

## Test

Use Postman


## (Optional) Configure Front Door for developer portal

## Restrict traffic to API Management instance

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





## Next steps

To automate deployments, see the following Quickstart Templates:

* [Front Door Standard/Premium with API Management origin](https://azure.microsoft.com/resources/templates/front-door-standard-premium-api-management-external/)
* [Create Azure Front Door in front of Azure API Management](https://docs.microsoft.com/samples/azure/azure-quickstart-templates/front-door-api-management/)

