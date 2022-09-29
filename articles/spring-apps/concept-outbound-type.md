---
title:  Customize Azure Spring Cloud egress with a User-Defined Route
description: Learn how to customize Azure Spring Cloud egress with a User-Defined Route.
author: karlerickson
ms.author: yinglzh
ms.service: spring-apps
ms.topic: article
ms.date: 09/25/2021
ms.custom: devx-track-java, devx-track-azurecli
---

# Customize Azure Spring Cloud egress with a user-defined route

**This article applies to:** ✔️ Java ✔️ C#

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

Egress from an Azure Spring Apps application can be customized to fit specific scenarios. By default, Azure Spring Apps  provisions a Standard SKU Load Balancer that you can set up and use for egress. However, the default setup may not meet the requirements of all scenarios. For example, public IPs may not be allowed, or more hops may be required for egress.

This article describes how to customize an instance's egress route to support custom network scenarios. For example, you might want to customize an instance's egress route for networks that disallow public IPs and require the instance to sit behind a network virtual appliance (NVA).

## Limitations

- `OutboundType` could only be defined when you create a new Azure Spring Apps service instance and can't be updated afterwards. It only works with a VNet instance.
- Setting `outboundType` to `UserDefinedRouting` requires a user-defined route with valid outbound connectivity for your instance.
- Setting `outboundType` to `UserDefinedRouting` implies the ingress source IP routed to the load-balancer may not match the instance's outgoing egress destination address.

## Prerequisites

- All prerequisites for deploying Azure Spring Apps in a virtual network. For more information, see [Deploy Azure Spring Apps in a virtual network](how-to-deploy-in-azure-virtual-network.md).
- An API version of *2022-09-01 preview* or greater.
- A CLI  extension version of 1.1.7 or greater.

## Overview of outbound types in Azure Spring Apps

An Azure Spring Apps instance can be customized with a unique `outboundType` of type `loadBalancer` or `userDefinedRouting`.

### loadBalancer outbound type

The default `outboundType` value is `loadBalancer`. If `outboundType` is set to `loadBalancer`, Azure Spring Apps automatically configures egress paths and expects egress from the load balancers created by the Azure Spring Apps resource provider. Two load balancers re created--one for the service runtime and another for the user app. A public IP address is provisioned for each load balancer. The load balancer is used for egress traffic for the generated public IP.

### userDefinedRouting outbound type

> [!NOTE]
> Using an outbound type is an advanced networking scenario and requires proper network configuration.

If `outboundType` is set to `userDefinedRouting`, Azure Spring Apps won't automatically configure egress paths. You must set up egress paths yourself. You could still find two load balancers in your resource group. They're only used for internal traffic and won't expose any public IP. You must prepare two route tables associated with two subnets--one to service the runtime and another for the user app.

> [!IMPORTANT]
> An `outboundType` of `userDefinedRouting` requires that there is a route for 0.0.0.0/0 and the next hop destination of a network virtual appliance in the route table. For more information, see [Customer responsibilities for running Azure Spring Apps in VNET](vnet-customer-responsibilities.md).
