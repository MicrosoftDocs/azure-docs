---
title: Azure Application Gateway front-end IP address configuration
description: This article describes how to configure the Azure Application Gateway front-end IP address.
services: application-gateway
author: vhorne
ms.service: application-gateway
ms.topic: conceptual
ms.date: 09/09/2020
ms.author: surmb
---

# Application Gateway front-end IP address configuration

You can configure the application gateway to have a public IP address, a private IP address, or both. A public IP address is required when you host a back end that clients must access over the Internet via an Internet-facing virtual IP (VIP).

## Public and private IP address support

Application Gateway V2 currently does not support only private IP mode. It supports the following combinations:

* Private IP address and public IP address
* Public IP address only

For more information, see [Frequently asked questions about Application Gateway](application-gateway-faq.md#how-do-i-use-application-gateway-v2-with-only-private-frontend-ip-address).


A public IP address isn't required for an internal endpoint that's not exposed to the Internet. That's known as an *internal load-balancer* (ILB) endpoint or private frontend IP. An application gateway ILB is useful for internal line-of-business applications that aren't exposed to the Internet. It's also useful for services and tiers in a multi-tier application within a security boundary that aren't exposed to the Internet but that require round-robin load distribution, session stickiness, or TLS termination.

Only one public IP address or one private IP address is supported. You choose the front-end IP when you create the application gateway.

- For a public IP address, you can create a new public IP address or use an existing public IP in the same location as the application gateway. For more information, see [static vs. dynamic public IP address](./application-gateway-components.md#static-versus-dynamic-public-ip-address).

- For a private IP address, you can specify a private IP address from the subnet where the application gateway is created. If you don't specify one, an arbitrary IP address is automatically selected from the subnet. The IP address type that you select (static or dynamic) can't be changed later. For more information, see [Create an application gateway with an internal load balancer](./application-gateway-ilb-arm.md).

A front-end IP address is associated to a *listener*, which checks for incoming requests on the front-end IP.

## Next steps

- [Learn about listener configuration](configuration-listeners.md)