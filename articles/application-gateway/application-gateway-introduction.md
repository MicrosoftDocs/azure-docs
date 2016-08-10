<properties
   pageTitle="Introduction to Application Gateway | Microsoft Azure"
   description="This page provides an overview of the Application Gateway service for layer-7 load balancing, including gateway sizes, HTTP load balancing, cookie-based session affinity, and SSL offload."
   documentationCenter="na"
   services="application-gateway"
   authors="georgewallace"
   manager="carmonm"
   editor="tysonn"/>
<tags
   ms.service="application-gateway"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="08/10/2016"
   ms.author="gwallace"/>

# Application Gateway overview

Microsoft Azure Application Gateway provides an Azure-managed HTTP load-balancing solution based on layer-7 load balancing.

Application load balancing enables IT administrators and developers to create routing rules for network traffic based on HTTP.  The Application Gateway service is highly available and metered. For the SLA and pricing, refer to the [SLA](https://azure.microsoft.com/support/legal/sla/) and [Pricing](https://azure.microsoft.com/pricing/details/application-gateway/) pages.

Application Gateway currently supports layer-7 application delivery for the following:

- HTTP load balancing
- Cookie-based session affinity
- [Secure Sockets Layer (SSL) offload](application-gateway-ssl-arm.md)
- [URL-based content routing](application-gateway-url-route-overview.md) 
- [Multi-site routing](application-gateway-multi-site-overview.md)

## HTTP layer 7 load balancing

Azure provides layer 4 load balancing via Azure load balancer working at the transport level (TCP/UDP) and having all incoming network traffic being load balanced to the Application Gateway service. The Application Gateway applies the routing rules to HTTP traffic, providing layer 7 (HTTP) load balancing. When you create an application gateway, an endpoint (VIP) is associated and used as public IP for ingress network traffic.

The Application Gateway routes the HTTP traffic based on its configuration whether it's a virtual machine, cloud service, web app or an external IP address.

HTTP layer 7 load balancing is useful for:

- Applications that require requests from the same user/client session to reach the same back-end virtual machine. Examples of this would be shopping cart apps and web mail servers.
- Applications that want to free web server farms from SSL termination overhead.
- Applications, such as a content delivery network, that requires multiple HTTP requests on the same long-running TCP connection to be routed or load balanced to different back-end servers.

[AZURE.INCLUDE [load-balancer-compare-tm-ag-lb-include.md](../../includes/load-balancer-compare-tm-ag-lb-include.md)]


## Gateway sizes and instances

Application Gateway is currently offered in three sizes: Small, Medium, and Large. Small instance sizes are intended for development and testing scenarios.

You can create up to 50 application gateways per subscription, and each application gateway can have up to 10 instances each. Application Gateway load balancing as an Azure-managed service allows the provisioning of a layer-7 load balancer behind the Azure software load balancer.

The following table shows an average performance throughput for each application gateway instance:


| Back-end page response | Small | Medium | Large|
|---|---|---|---|
| 6 K | 7.5 Mbps | 13 Mbps | 50 Mbps |
|100 K | 35 Mbps | 100 Mbps| 200 Mbps |


>[AZURE.NOTE] These are approximate values for an application gateway throughput. The actual throughput depends on various environment details, such as average page size, location of back-end instances, and processing time to serve a page.


## Health monitoring

Azure Application Gateway automatically monitors the health of the back-end instances. For more information, see [Application Gateway health monitoring overview](application-gateway-probe-overview.md).





## Configuring and managing

You can create and manage an application gateway by using REST APIs and by using PowerShell cmdlets.


## Next steps

After learning about Application gateway, you can [create an application gateway](application-gateway-create-gateway-portal.md) or you can [create an application gateway SSL offload](application-gateway-ssl-arm.md) to load-balance HTTPS connections.

To learn how to create an application gateway using URL-based content routing, go to [Create an application gateway using URL-based routing](application-gateway-create-url-route-arm-ps.md) for more information.

