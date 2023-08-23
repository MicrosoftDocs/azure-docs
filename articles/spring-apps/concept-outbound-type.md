---
title:  Customize Azure Spring Apps egress with a user-defined route
description: Learn how to customize Azure Spring Apps egress with a user-defined route.
author: KarlErickson
ms.author: karler
ms.service: spring-apps
ms.topic: article
ms.date: 10/20/2022
ms.custom: devx-track-java, engagement-fy23
---

# Customize Azure Spring Apps egress with a user-defined route

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java ✔️ C#

**This article applies to:** ✔️ Basic/Standard ✔️ Enterprise

This article describes how to customize an instance's egress route to support custom network scenarios. For example, you might want to customize an instance's egress route for networks that disallow public IPs and require the instance to sit behind a network virtual appliance (NVA).

By default, Azure Spring Apps provisions a Standard SKU Load Balancer that you can set up and use for egress. However, the default setup may not meet the requirements of all scenarios. For example, public IPs may not be allowed, or more hops may be required for egress. When you use this feature to customize egress, Azure Spring Apps doesn't create public IP resources.

## Prerequisites

- All prerequisites for deploying Azure Spring Apps in a virtual network. For more information, see [Deploy Azure Spring Apps in a virtual network](how-to-deploy-in-azure-virtual-network.md).
- An API version of `2022-09-01 preview` or greater.
- [Azure CLI version 1.1.7 or later](/cli/azure/install-azure-cli).

## Limitations

- You can only define `OutboundType` when you create a new Azure Spring Apps service instance, and you can't updated it afterwards. `OutboundType` works only with a virtual network.
- Setting `outboundType` to `UserDefinedRouting` requires a user-defined route with valid outbound connectivity for your instance.
- Setting `outboundType` to `UserDefinedRouting` implies that the ingress source IP routed to the load-balancer may not match the instance's outgoing egress destination address.

## Overview of outbound types in Azure Spring Apps

You can customize an Azure Spring Apps instance with a unique `outboundType` of type `loadBalancer` or `userDefinedRouting`.

### Outbound type loadBalancer

The default `outboundType` value is `loadBalancer`. If `outboundType` is set to `loadBalancer`, Azure Spring Apps automatically configures egress paths and expects egress from the load balancers created by the Azure Spring Apps resource provider. Two load balancers are recreated: one for the service runtime and another for the user app. A public IP address is provisioned for each load balancer. The load balancer is used for egress traffic for the generated public IP.

### Outbound type userDefinedRouting

> [!NOTE]
> Using an outbound type is an advanced networking scenario and requires proper network configuration.

If `outboundType` is set to `userDefinedRouting`, Azure Spring Apps doesn't automatically configure egress paths. You must set up egress paths yourself. You could still find two load balancers in your resource group. They're only used for internal traffic and don't expose any public IP. You must prepare two route tables associated with two subnets: one to service the runtime and another for the user app.

> [!IMPORTANT]
> An `outboundType` of `userDefinedRouting` requires a route for `0.0.0.0/0` and the next hop destination of a network virtual appliance in the route table. For more information, see [Customer responsibilities for running Azure Spring Apps in a virtual network](vnet-customer-responsibilities.md).

## See also

- [Control egress traffic for an Azure Spring Apps instance](how-to-create-user-defined-route-instance.md)
