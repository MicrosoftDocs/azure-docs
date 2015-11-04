<properties 
   pageTitle="Introduction to Application Gateway | Microsoft Azure"
   description="This page provides an overview of the Application Gateway service for layer 7 load balancing, including gateway sizes, HTTP load balancing, cookie based session affinity, and SSL offload."
   documentationCenter="na"
   services="application-gateway"
   authors="joaoma"
   manager="jdial"
   editor="tysonn"/>
<tags 
   ms.service="application-gateway"
   ms.devlang="na"
   ms.topic="article" 
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services" 
   ms.date="08/23/2015"
   ms.author="joaoma"/>

# What is Application Gateway?


Microsoft Azure Application Gateway provides an Azure-managed HTTP load balancing solution based on layer 7 load balancing. 

Application load balancing  enables IT administrators and developers to create routing rules for network traffic based on HTTP.  The application gateway service is highly available and metered. For the SLA and Pricing, please refer to the [SLA](http://azure.microsoft.com/support/legal/sla/) and [Pricing](https://azure.microsoft.com/pricing/details/application-gateway/) pages.

Application Gateway currently supports layer 7 application delivery for the following:

- HTTP load balancing
- Cookie based session affinity
- SSL offload

![Application Gateway](./media/application-gateway-introduction/appgateway1.png)

## HTTP layer 7 load balancing

Azure provides layer 4 load balancing via Azure load balancer working at the transport level (TCP/UDP) and having all incoming network traffic being load balanced to the App Gateway service. The Application Gateway then will apply the routing rules to HTTP traffic, providing level 7 (HTTP) load balancing. When you create an Application Gateway, an endpoint (VIP) will be associated and used as public IP for ingress network traffic.

The Application Gateway will route the HTTP traffic based on its configuration whether it's a virtual machine, cloud service, web app or an external IP address.

The diagram below explains how traffic flows for Application Gateway:

 
![Application Gateway2](./media/application-gateway-introduction/appgateway2.png)

HTTP layer 7 load balancing is useful for:


- Applications that require requests from the same user/client session to reach the same back-end VM. Examples of this would be shopping cart apps and web mail servers.
- Applications that want to free web server farms from SSL termination overhead.
- Applications, such as CDN, that require multiple HTTP requests on the same long-running TCP connection to be routed/load balanced to different backend servers.

## Gateway sizes and instances

Application Gateway is currently offered in 3 sizes: Small, Medium and Large. Small instance sizes are intended for development and testing scenarios. 

You can create up to 10 application gateways per subscription and each application gateway can have up to 10 instances each. Application Gateway load balancing as an Azure-managed service allows the provisioning of a layer 7 load balancer behind the Azure software load balancer.

## Configuring and managing

You can create and manage the application gateway by using REST APIs and by using PowerShell cmdlets.

## Next Steps

Create an Application Gateway. See [Create an Application Gateway](application-gateway-create-gateway.md).

Configure SSL offload. See [Configure SSL Offload with Application Gateway](application-gateway-ssl.md).


