---
title: Azure Application Gateway frontend IP address configuration
description: This article describes how to configure the Azure Application Gateway frontend IP address.
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: conceptual
ms.date: 09/14/2023
ms.author: greglin
---

# Application Gateway frontend IP address configuration

You can configure the application gateway to have a public IP address, a private IP address, or both. A public IP address is required when you host a backend that clients must access over the internet via an internet-facing virtual IP.

## Public and private IP address support

Application Gateway v2 currently supports the following combinations:

* Private IP address and public IP address
* Public IP address only
* [Private IP address only (preview)](application-gateway-private-deployment.md)

For more information, see [Frequently asked questions about Application Gateway](application-gateway-faq.yml#how-do-i-use-application-gateway-v2-with-only-a-private-frontend-ip-address).

A public IP address isn't required for an internal endpoint that's not exposed to the internet. A private frontend configuration is useful for internal line-of-business applications that aren't exposed to the internet. It's also useful for services and tiers in a multitier application within a security boundary that aren't exposed to the internet but that require round-robin load distribution, session stickiness, or TLS termination.

Only one public IP address and one private IP address are supported per IP protocol (IPv4/IPv6). You choose the frontend IP when you create the application gateway.

> [!NOTE]
> The Application Gateway front end supports dual-stack IP addresses. You can create up to four frontend IPs. Two are IPv4 addresses (public and private) and two are IPv6 addresses (public and private).

- For a public IP address, you can create a new public IP address or use an existing public IP in the same location as the application gateway. For more information, see [Static versus dynamic public IP address](./application-gateway-components.md#static-versus-dynamic-public-ip-address).

- For a private IP address, you can specify a private IP address from the subnet where the application gateway is created. For Application Gateway v2 SKU deployments, a static IP address must be defined when you add a private IP address to the gateway. For Application Gateway v1 SKU deployments, if you don't specify an IP address, an available IP address is automatically selected from the subnet. The IP address type that you select (static or dynamic) can't be changed later. For more information, see [Create an application gateway with an internal load balancer](./application-gateway-ilb-arm.md).

A frontend IP address is associated to a *listener*, which checks for incoming requests on the frontend IP.

You can create private and public listeners with the same port number. However, be aware of any network security group (NSG) associated with the Application Gateway subnet. Depending on your NSG's configuration, you might need an allow-inbound rule with **Destination IP addresses** as your application gateway's public and private frontend IPs. When you use the same port, your application gateway changes the **Destination** of the inbound flow to the frontend IPs of your gateway.

 **Inbound rule**:

- **Source**: According to your requirement
- **Destination**: Public and private frontend IPs of your application gateway.
- **Destination port**: According to configured listeners
- **Protocol**: TCP

**Outbound rule**:

- No specific requirement

> [!IMPORTANT]
> The default domain name behavior for v1 SKU:
>
> - Deployments before May 1, 2023: These deployments will continue to have the default domain names like \<label>.cloudapp.net mapped to the application gateway's public IP address.
> - Deployments after May 1, 2023: For deployments after this date, there will *not* be any default domain name mapped to the gateway's public IP address. You must manually configure using your domain name by mapping its DNS record to the gateway's IP address.

## Next steps

- [Learn about listener configuration](configuration-listeners.md)
