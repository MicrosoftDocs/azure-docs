---
title: Azure Application Gateway frontend IP address configuration
description: This article describes how to configure the Azure Application Gateway frontend IP address.
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: conceptual
ms.date: 02/26/2023
ms.author: greglin
---

# Application Gateway frontend IP address configuration

You can configure the application gateway to have a public IP address, a private IP address, or both. A public IP address is required when you host a back end that clients must access over the Internet via an Internet-facing virtual IP (VIP).

## Public and private IP address support

Application Gateway V2 currently supports the following combinations:

* Private IP address and public IP address
* Public IP address only
* [Private IP address only (preview)](application-gateway-private-deployment.md)

For more information, see [Frequently asked questions about Application Gateway](application-gateway-faq.yml#how-do-i-use-application-gateway-v2-with-only-private-frontend-ip-address).


A public IP address isn't required for an internal endpoint that's not exposed to the Internet. A private frontend configuration is useful for internal line-of-business applications that aren't exposed to the Internet. It's also useful for services and tiers in a multi-tier application within a security boundary that aren't exposed to the Internet but that require round-robin load distribution, session stickiness, or TLS termination.

Only one public IP address and one private IP address is supported. You choose the frontend IP when you create the application gateway.

- For a public IP address, you can create a new public IP address or use an existing public IP in the same location as the application gateway. For more information, see [static vs. dynamic public IP address](./application-gateway-components.md#static-versus-dynamic-public-ip-address).

- For a private IP address, you can specify a private IP address from the subnet where the application gateway is created. For Application Gateway v2 sku deployments, a static IP address must be defined when adding a private IP address to the gateway.  For Application Gateway v1 sku deployments, if you don't specify an IP address, an available IP address is automatically selected from the subnet. The IP address type that you select (static or dynamic) can't be changed later. For more information, see [Create an application gateway with an internal load balancer](./application-gateway-ilb-arm.md).

A frontend IP address is associated to a *listener*, which checks for incoming requests on the frontend IP.

>[!NOTE] 
> You can create private and public listeners with the same port number (Preview feature). However, be aware of any Network Security Group (NSG) associated with the application gateway subnet. Depending on your NSG's configuration, you may need an inbound rule with **Destination IP addresses** as your application gateway's public and private frontend IPs.
> 
> **Inbound Rule**:
> - Source: (as per your requirement)
> - Destination IP addresses: Public and Private frontend IPs of your application gateway.
> - Destination Port: (as per listener configuration)
> - Protocol: TCP
> 
> **Outbound Rule**: (no specific requirement)

## Next steps

- [Learn about listener configuration](configuration-listeners.md)
