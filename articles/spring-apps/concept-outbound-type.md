---
title:  Customize Azure Spring Cloud egress with a User-Defined Route
description: Learn how to customize Azure Spring Cloud egress with a User-Defined Route.
author: KarlErickson
ms.author: yinglzh
ms.service: spring-apps
ms.topic: article
ms.date: 09/25/2021
ms.custom: devx-track-java, devx-track-azurecli
---

# Customize Azure Spring Cloud egress with a User-Defined Route

**This article applies to:** ✔️ Java ✔️ C#

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

Egress from an Azure Spring Apps application can be customized to fit specific scenarios. By default, Azure Spring Apps  provisions a Standard SKU Load Balancer to be set up and used for egress. However, the default setup may not meet the requirements of all scenarios; for example, if public IPs are disallowed, or additional hops are required for egress.

This article shows how to customize an instance's egress route to support custom network scenarios, such as those which disallow public IPs and require the instance to sit behind a network virtual appliance (NVA).

## Limitations

- OutboundType could only be defined when you create a new Azure Spring Apps service instance and cannot be updated afterwards. It only works with VNet instance.
- Setting `outboundType` to a value of `UserDefinedRouting` requires a user-defined route with valid outbound connectivity for your instance.
- Setting `outboundType` to a value of `UserDefinedRouting` implies the ingress source IP routed to the load-balancer may **not match** the instance's outgoing egress destination address.

## Prerequisites

- All prerequisites of [Azure Spring Apps VNet instance](how-to-deploy-in-azure-virtual-network.md)
- API version of `2022-09-01 preview` or greater
- CLI version extension of 1.1.7 or greater

## Overview of outbound types in Azure Spring Apps

An ASA instance can be customized with a unique `outboundType` of type `loadBalancer` or `userDefinedRouting`.

### Outbound type of loadBalancer

`loadBalancer` is the default value of outbound type. If `loadBalancer` is set, ASA completes the following configuration automatically. An outbound type of `loadBalancer` expects egress out of the load balancers created by the ASA resource provider. Two load balancers will be created. One for service runtime and another for user app. A public IP address is provisioned for each load balancer. The load balancer is used for egress traffic the generated public IP.

### Outbound type of userDefinedRouting

> [!NOTE]
> Using outbound type is an advanced networking scenario and requires proper network configuration.

If `userDefinedRouting` is set, Azure Spring Apps won't automatically configure egress paths. The egress setup must be done by yourself. (Customers could still find two load balancers in their resource group. They are only used for internal traffic and will not expose any public IP.) Customer must prepare two route tables associated with two subnets (One for service runtime and another for user app)

> [!IMPORTANT]
> Outbound type of UDR requires there is a route for 0.0.0.0/0 and next hop destination of NVA (Network Virtual Appliance) in the route table. Please carefully follow the rules in (vnet-customer-responsibilities.md).
