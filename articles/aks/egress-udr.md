---
title: Customize cluster egress with a user-defined routing table in Azure Kubernetes Service (AKS)
description: Learn how to define a custom egress route with a routing table in Azure Kubernetes Service (AKS).
ms.subservice: aks-networking
ms.topic: article
ms.date: 05/10/2023
ms.author: allensu
author: asudbring

#Customer intent: As a cluster operator, I want to define my own egress paths with user-defined routes. Since I define this upfront, I don't want AKS-provided load balancer configurations.
---

# Customize cluster egress with a user-defined routing table in Azure Kubernetes Service (AKS)

You can customize the egress for your Azure Kubernetes Service (AKS) clusters to fit specific scenarios. AKS provisions a `Standard` SKU load balancer for egress by default. However, the default setup may not meet the requirements of all scenarios if public IPs are disallowed or the scenario requires extra hops for egress.

This article walks through how to customize a cluster's egress route to support custom network scenarios. These scenarios include ones which disallow public IPs and require the cluster to sit behind a network virtual appliance (NVA).

## Prerequisites

* Azure CLI version 2.0.81 or greater. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).
* API version `2020-01-01` or greater.

## Requirements and limitations

Using outbound type is an advanced networking scenario and requires proper network configuration. The following requirements and limitations apply to using outbound type:

* Setting `outboundType` requires AKS clusters with a `vm-set-type` of `VirtualMachineScaleSets` and a `load-balancer-sku` of `Standard`.
* Setting `outboundType` to a value of `UDR` requires a user-defined route with valid outbound connectivity for the cluster.
* Setting `outboundType` to a value of `UDR` implies the ingress source IP routed to the load-balancer may **not match** the cluster's outgoing egress destination address.

## Overview of customizing egress with a user-defined routing table

AKS doesn't automatically configure egress paths if `userDefinedRouting` is set, which means you must configure the egress.

When you don't use standard load balancer (SLB) architecture, you must establish explicit egress. You must deploy your AKS cluster into an existing virtual network with a subnet that has been previously configured. This architecture requires explicitly sending egress traffic to an appliance like a firewall, gateway, or proxy, so a public IP assigned to the standard load balancer or appliance can handle the Network Address Translation (NAT).

### Load balancer creation with `userDefinedRouting`

AKS clusters with an outbound type of UDR get a standard load balancer only when the first Kubernetes service of type `loadBalancer` is deployed. The load balancer is configured with a public IP address for *inbound* requests and a backend pool for *inbound* requests. The Azure cloud provider configures inbound rules, but it **doesn't configure outbound public IP address or outbound rules**. Your UDR is the only source for egress traffic.

> [!NOTE]
> Azure load balancers [don't incur a charge until a rule is placed](https://azure.microsoft.com/pricing/details/load-balancer/).

## Deploy a cluster with outbound type of UDR and Azure Firewall

To see an application of a cluster with outbound type using a user-defined route, see this [restrict egress traffic with Azure firewall example](limit-egress-traffic.md).

> [!IMPORTANT]
> Outbound type of UDR requires a route for 0.0.0.0/0 and a next hop destination of NVA in the route table.
> The route table already has a default 0.0.0.0/0 to the Internet. Without a public IP address for Azure to use for Source Network Address Translation (SNAT), simply adding this route won't provide you outbound Internet connectivity. AKS validates that you don't create a 0.0.0.0/0 route pointing to the Internet but instead to a gateway, NVA, etc.
> When using an outbound type of UDR, a load balancer public IP address for **inbound requests** isn't created unless you configure a service of type *loadbalancer*. AKS never creates a public IP address for **outbound requests** if you set an outbound type of UDR.

## Next steps

For more information on user-defined routes and Azure networking, see:

* [Azure networking UDR overview](../virtual-network/virtual-networks-udr-overview.md)
* [How to create, change, or delete a route table](../virtual-network/manage-route-table.md).
