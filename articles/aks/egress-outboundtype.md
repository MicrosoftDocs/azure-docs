---
title: Customize user defined routes (UDR) in Azure Kubernetes Service (AKS)
description: Learn how to define a custom egress route in Azure Kubernetes Service (AKS)
services: container-service
author: mlearned

ms.service: container-service
ms.topic: article
ms.date: 01/31/2020
ms.author: mlearned

#Customer intent: As a cluster operator, I want to define my own egress paths with user defined routes. Since I define this up front I do not want AKS provided load balancer configurations.
---

# Using user-defined-routes in Azure Kubernetes Service (AKS)

Egress for an AKS cluster can be defined in multiple ways. By default, AKS will provision a Standard SKU Load Balancer. Configuration for egress and ingress is automatically setup through the created load balancer. In this setup, a public IP is created as a frontend for load balancer egress.

This is automated due to the following requirements.
1. A public IP address is required for the Standard SKU load balancer for egress, so AKS automatically assigns a public IP to the load balancer as egress setup is not provided by default. This behavior changes between the Basic SKU load balancers. 
1. AKS [requires outbound connectivity](limit-egress-traffic.md) to function properly and issue common operations such as pulling system-pod images or security patches. To learn more about why clusters require external connectivity and the required endpoints that clusters must be able to access, read about [controlling egress traffic for cluster nodes](limit-egress-traffic.md).

AKS defines a cluster's egress with the`networkProfile`'s `outboundType`. An alternative egress path may be required due to disallowing public IP addresses on a cluster. To satisfy this requirement and use a custom egress route, users can set `outboundType` to different values.

This article explains how to deploy an AKS cluster into an existing Virtual Network with a custom user defined route tables (UDRs) setup instead of the default load balancer setup. This article also assumes familiarity with networking concepts such as UDRs, route tables, and Kubernetes networking such as Azure CNI.

## Before you begin

Ensure you have the Azure CLI preview extension installed with at least version `0.4.28`.

## Limitations
* `outboundType` can only be defined at cluster create time and cannot be updated afterwards.
* Setting `outboundType` requires AKS clusters to use Azure CNI. There is no support for Kubenet.
* Setting `outboundType` requires AKS clusters created with a `vm-set-type` of `VirtualMachineScaleSets`.
* Setting `outboundType` to a value of `UDR` requires AKS clusters created with a `load-balancer-sku` of `Standard`.
* Setting `outboundType` to a value of `UDR` requires a valid user created path of outbound connectivity for a cluster.
* Setting `outboundType` to a value of `UDR` implies the ingress source IP routed to the load-balancer will *not match* the outgoing egress destination.

## Create a user defined route (UDR) for an Azure subnet

Azure automatically routes traffic between Azure subnets, virtual networks, and on-premises networks. If you want to change any of Azure's default routing, you do so by creating a route table. You can create [custom, or user-defined, routes](https://docs.microsoft.com/azure/virtual-network/virtual-networks-udr-overview#user-defined) in Azure to override Azure's default system routes, or to add additional routes to a subnet's route table. In Azure, you create a route table, then associate the route table to zero or more virtual network subnets. Each subnet can have zero or one route table associated to it. To learn about the maximum number of routes you can add to a route table and the maximum number of user-defined route tables you can create per Azure subscription, see Azure limits. If you create a route table and associate it to a subnet, the routes within it are combined with, or override, the default routes Azure adds to a subnet by default.

To learn more about virtual network traffic routing, visit the [Azure networking UDR overview](https://docs.microsoft.com/azure/virtual-network/virtual-networks-udr-overview.)

To learn more read about managing a route table, visit [how to create, change, or delete a route table](https://docs.microsoft.com/azure/virtual-network/manage-route-table).

## Connect a UDR to an existing virtual network's subnet

An appliance may be used such as Azure Firewall, which handles the hop to the external internet.

TODO

## Create an AKS cluster with outboundType set to user-defined-route

An AKS cluster can define it's `outboundType` as either `loadBalancer` or `UDR`. This impacts only the egress traffic of your cluster, to learn about ingress read documentation on setting up [ingress controllers](ingress-basic.md).

* If `loadBalancer` is set, a public IP address is provisioned when using Standard SKU Load Balancers and automatically assigned to the load balancer resource. Backend pools are also setup for nodes in the cluster and the load balancer is used for egress through that load balancer's assigned public IP. This is built for services of type loadBalancer in Kubernetes which expect to egress out of the cloud provider load balancer.
* If `UDR` is set, AKS requires a custom user defined route table. This must exist on the subnet the cluster is being deployed into. If this is set, it is critical to double check the UDR has valid outbound connectivity for your cluster to function. In this configuration,  AKS will not automatically provision or configure the load balancer on your behalf.

```azure-cli
az aks create -g myresourcegroup -n myakscluster -l westus --outbound-type userdefinedrouting --vnet-id <vnet-id>
```

## Validate outbound connectivity

TODO

## Next steps

Learn more about Kubernetes services at the [Kubernetes services documentation][kubernetes-services].