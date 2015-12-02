<properties 
   pageTitle="Introduction to Application Gateway | Microsoft Azure"
   description="This page provides an overview of the Application Gateway service for layer 7 load balancing, including gateway sizes, HTTP load balancing, cookie based session affinity, and SSL offload."
   documentationCenter="na"
   services="application-gateway"
   authors="joaoma"
   manager="carmonm"
   editor="tysonn"/>
<tags 
   ms.service="application-gateway"
   ms.devlang="na"
   ms.topic="article" 
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services" 
   ms.date="11/09/2015"
   ms.author="joaoma"/>

# What is Application Gateway?


Microsoft Azure Application Gateway provides an Azure-managed HTTP load balancing solution based on layer 7 load balancing. 

Application load balancing  enables IT administrators and developers to create routing rules for network traffic based on HTTP.  The Application Gateway service is highly available and metered. For the SLA and Pricing, please refer to the [SLA](http://azure.microsoft.com/support/legal/sla/) and [Pricing](https://azure.microsoft.com/pricing/details/application-gateway/) pages.

Application Gateway currently supports layer 7 application delivery for the following:

- HTTP load balancing
- Cookie based session affinity
- SSL offload

![Application Gateway](./media/application-gateway-introduction/appgateway1.png)

## HTTP layer 7 load balancing

Azure provides layer 4 load balancing via Azure load balancer working at the transport level (TCP/UDP) and having all incoming network traffic being load balanced to the Application Gateway service. The Application Gateway then will apply the routing rules to HTTP traffic, providing level 7 (HTTP) load balancing. When you create an application gateway, an endpoint (VIP) will be associated and used as public IP for ingress network traffic.

The Application Gateway will route the HTTP traffic based on its configuration whether it's a virtual machine, cloud service, web app or an external IP address.

The diagram below explains how traffic flows for Application Gateway:

 
![Application Gateway2](./media/application-gateway-introduction/appgateway2.png)

HTTP layer 7 load balancing is useful for:


- Applications that require requests from the same user/client session to reach the same back-end VM. Examples of this would be shopping cart apps and web mail servers.
- Applications that want to free web server farms from SSL termination overhead.
- Applications, such as CDN, that require multiple HTTP requests on the same long-running TCP connection to be routed/load balanced to different backend servers.

## Gateway sizes and instances

Application Gateway is currently offered in 3 sizes: Small, Medium and Large. Small instance sizes are intended for development and testing scenarios. 

You can create up to 50 application gateways per subscription and each application gateway can have up to 10 instances each. Application Gateway load balancing as an Azure-managed service allows the provisioning of a layer 7 load balancer behind the Azure software load balancer.

The table below shows an average performance throughput for each application gateway instance:


| Back end page response | Small | Medium | Large|
|---|---|---|---|
| 6K | 7.5 mbps | 13 mbps | 50 mbps |
|100k | 35 mbps | 100mbps| 200 mbps |


>[AZURE.NOTE] This is an approximate guidance for an application gateway throughput. The actual throughput is dependent on various environment details such as average page size,  location of backend instances,  processing time to server a page to name a few.

## Health monitoring
 

Azure Application Gateway monitors the health of the back end instances every 30 seconds. It sends a HTTP health probe request to each instance at the port configured in *BackendHttpSettings* elements of the configuration. The health probe expects a successful HTTP response with response status code in range of 200-399.

When a successful HTTP response is received, the back end server is marked as healthy and continues to receives traffic from Azure Application Gateway. If the probe fails, the back end instance is removed from the healthy pool, and traffic stops flowing to this server. The health probe still continues every 30 seconds to the failed back end instance to check its current health status. When the back end instance responds successfully to the health probe, it is added back as healthy to the back end pool, and traffic starts flowing to the instance again.

## Configuring and managing

You can create and manage an application gateway by using REST APIs and by using PowerShell cmdlets.



## Next Steps

Create an Application Gateway. See [Create an Application Gateway](application-gateway-create-gateway.md).

Configure SSL offload. See [Configure SSL Offload with Application Gateway](application-gateway-ssl.md).


