---
title: Customize cluster egress with a user-defined routing table
description: Learn how to define a custom egress route in Azure Kubernetes Service (AKS) with a routing table.
ms.subservice: aks-networking
ms.topic: article
ms.date: 06/29/2020
ms.author: allensu
author: asudbring

#Customer intent: As a cluster operator, I want to define my own egress paths with user-defined routes. Since I define this up front I do not want AKS provided load balancer configurations.
---

# Customize cluster egress with a user-defined routing table

Egress from an AKS cluster can be customized to fit specific scenarios. By default, AKS will provision a Standard SKU Load Balancer to be set up and used for egress. However, the default setup may not meet the requirements of all scenarios if public IPs are disallowed or additional hops are required for egress.

This article walks through how to customize a cluster's egress route to support custom network scenarios, such as those which disallows public IPs and requires the cluster to sit behind a network virtual appliance (NVA).

## Prerequisites
* Azure CLI version 2.0.81 or greater
* API version of `2020-01-01` or greater

## Limitations
* Setting `outboundType` requires AKS clusters with a `vm-set-type` of `VirtualMachineScaleSets` and `load-balancer-sku` of `Standard`.
* Setting `outboundType` to a value of `UDR` requires a user-defined route with valid outbound connectivity for the cluster.
* Setting `outboundType` to a value of `UDR` implies the ingress source IP routed to the load-balancer may **not match** the cluster's outgoing egress destination address.

## Overview

> [!NOTE]
> Using outbound type is an advanced networking scenario and requires proper network configuration.

If `userDefinedRouting` is set, AKS won't automatically configure egress paths. The egress setup must be done by you.

The AKS cluster must be deployed into an existing virtual network with a subnet that has been previously configured because when not using standard load balancer (SLB) architecture, you must establish explicit egress. As such, this architecture requires explicitly sending egress traffic to an appliance like a firewall, gateway, proxy or to allow the Network Address Translation (NAT) to be done by a public IP assigned to the standard load balancer or appliance.

#### Load balancer creation with userDefinedRouting

AKS clusters with an outbound type of UDR receive a standard load balancer (SLB) only when the first Kubernetes service of type 'loadBalancer' is deployed. The load balancer is configured with a public IP address for *inbound* requests and a backend pool for *inbound* requests. Inbound rules are configured by the Azure cloud provider, but **no outbound public IP address or outbound rules** are configured as a result of having an outbound type of UDR. Your UDR will still be the only source for egress traffic.

Azure load balancers [don't incur a charge until a rule is placed](https://azure.microsoft.com/pricing/details/load-balancer/).

## Deploy a cluster with outbound type of UDR and Azure Firewall

To illustrate the application of a cluster with outbound type using a user-defined route, a cluster can be configured on a virtual network with an Azure Firewall on its own subnet. See this example on the [restrict egress traffic with Azure firewall example](limit-egress-traffic.md).

> [!IMPORTANT]
> Outbound type of UDR requires there is a route for 0.0.0.0/0 and next hop destination of NVA (Network Virtual Appliance) in the route table.
> The route table already has a default 0.0.0.0/0 to Internet, without a Public IP to SNAT just adding this route will not provide you egress. AKS will validate that you don't create a 0.0.0.0/0 route pointing to the Internet but instead to NVA or gateway, etc.
> When using an outbound type of UDR, a load balancer public IP address for **inbound requests** is not created unless a service of type *loadbalancer* is configured. A public IP address for **outbound requests** is never created by AKS if an outbound type of UDR is set.

## Next steps

See [Azure networking UDR overview](../virtual-network/virtual-networks-udr-overview.md).

See [how to create, change, or delete a route table](../virtual-network/manage-route-table.md).

<!-- LINKS - internal -->
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
[byo-route-table]: configure-kubenet.md#bring-your-own-subnet-and-route-table-with-kubenet
