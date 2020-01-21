---
title: Customize user defined routes (UDR) in Azure Kubernetes Service (AKS)
description: Learn how to define a custom egress route in Azure Kubernetes Service (AKS)
services: container-service
author: mlearned

ms.service: container-service
ms.topic: article
ms.date: 12/12/2019
ms.author: mlearned

#Customer intent: As a cluster operator, I want to define my own egress paths with user defined routes. Since I define this up front I do not want AKS provided load balancer configurations.
---

# Customize user defined routes (UDR) in Azure Kubernetes Service (AKS)

AKS clusters require external connectivity for regular cluster operations like pulling images for system pods or pulling critical Kubernetes security patches. To learn more about why clusters require external connectivity and the required endpoints that clusters must be able to access, read about [controlling egress traffic for cluster nodes](limit-egress-traffic.md).

AKS clusters rely on Standard SKU Load Balancers by default. Standard SKU Load Balancers require manually connecting a public IP address due to the Standard SKU not providing egress setup by default. Due to the requirement for outbound connectivity, AKS by default configures egress through load balancers on behalf of users. This behavior is defined as setting the cluster `outboundType` to `load-balancer`. To learn more [read documentation about Standard Load Balancers on AKS](load-balancer-standard.md).

An alternative method of outbound connectivity may be utilized which does not require egress via the load balancer. A common scenario may be disallowing any public IP address on the cluster. Due to the above requirements by Standard SKU load balancers, AKS enables alternative setup of egress to skip public IP assignment and setup for Standard SKU Load Balancers.

This article explains how to deploy an AKS cluster into an existing Virtual Network with a custom user defined route tables (UDRs) setup instead of the default load balancer setup.

## Before you begin

You need to opt-in for access to canary regions for AKS. To do this register the following feature flags and refresh the corresponding providers.
```
az feature register -n ACS-EUAP --namespace Microsoft.ContainerService
az feature register -n EUAPParticipation --namespace Microsoft.Resources
az feature register -n outboundtype --namespace Microsoft.ContainerService

az provider register -n Microsoft.ContainerService
az provider register -n Microsoft.Resources
```

While in preview, setting outboundType is only available through ARM templates or REST API calls. Azure CLI preview support is coming in the future.

## Limitations
* Setting `outboundType` requires AKS clusters to use Azure CNI, there is no support for Kubenet.
* Setting `outboundType` requires AKS clusters created with a `vm-set-type` of `VirtualMachineScaleSets`.
* Setting `outboundType` to a value of `UDR` requires AKS clusters created with a `load-balancer-sku` of `Standard`.
* Setting `outboundType` to a value of `UDR` requires a user created method of outbound connectivity for a cluster.
* Setting `outboundType` to a value of `UDR` does not guarantee the ingress source IP into the load-balancer to match the outgoing egress destination.
* During preview, `outboundType` to a value of `UDR` does not work with the [Private Cluster feature](private-clusters.md).

## Create a user defined route (UDR) for an Azure subnet

Azure automatically routes traffic between Azure subnets, virtual networks, and on-premises networks. If you want to change any of Azure's default routing, you do so by creating a route table. You can create [custom, or user-defined, routes](https://docs.microsoft.com/azure/virtual-network/virtual-networks-udr-overview#user-defined) in Azure to override Azure's default system routes, or to add additional routes to a subnet's route table. In Azure, you create a route table, then associate the route table to zero or more virtual network subnets. Each subnet can have zero or one route table associated to it. To learn about the maximum number of routes you can add to a route table and the maximum number of user-defined route tables you can create per Azure subscription, see Azure limits. If you create a route table and associate it to a subnet, the routes within it are combined with, or override, the default routes Azure adds to a subnet by default.

To learn more about virtual network traffic routing, visit the [Azure networking UDR overview](https://docs.microsoft.com/azure/virtual-network/virtual-networks-udr-overview.)

To learn more read about managing a route table, visit [how to create, change, or delete a route table](https://docs.microsoft.com/azure/virtual-network/manage-route-table).

## Customize an AKS cluster to use a user defined route (UDR)

An AKS cluster can define it's `outboundType` as either `loadBalancer` or `UDR`. This impacts only the egress traffic of your cluster, to learn about ingress read documentation on setting up [ingress controllers](ingress-basic.md).

* If `loadBalancer` is set, a public IP address is provisioned when using Standard SKU Load Balancers and automatically assigned to the load balancer resource. Backend pools are also setup for nodes in the cluster and the load balancer is used for egress through that load balancer's assigned public IP. This is built for services of type loadBalancer in Kubernetes which expect to egress out of the cloud provider load balancer.
* If `UDR` is set, AKS requires a custom user defined route table. This must exist on the subnet the cluster is being deployed into. If this is set, it is critical to double check the UDR has valid outbound connectivity for your cluster to function. In this configuration,  AKS will not automatically provision or configure the load balancer on your behalf.

The following limitations apply.
* `outboundType` can only be defined at cluster create time and cannot be updated
* Clusters must use Azure CNI networking, this does not work with Kubenet

```azure-cli
az aks create -g myresourcegroup -n myakscluster -l westus --outbound-type udr --vnet-id <vnet-id>
```