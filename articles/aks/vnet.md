---
title: Advanced networking with VNets in Azure Kubernetes Service (AKS)
description: Learn about placing your pods in an Azure VNet using the advanced network features of Azure Kubernetes Service (AKS).
services: container-service
author: neilpeterson
manager: jeconnoc

ms.service: container-service
ms.topic: article
ms.date: 05/07/2018
ms.author: nepeters
---

# Advanced networking with VNets in Azure Kubernetes Service (AKS)

Advanced networking places your pods in an Azure Virtual Network (VNet), providing them automatic connectivity to VNet resources and integration with the rich set of capabilities that VNets offer. The [Azure Container Networking Interface (CNI)][cni-networking] plugin for Kubernetes provides this advanced networking support, and is installed on all AKS cluster nodes.

![Diagram showing two nodes with bridges connecting each to a single Azure VNet][advanced-networking-diagram-01]

## Advanced networking features

Advanced networking provides the following benefits:

* You can deploy your AKS cluster into an existing VNet, or create a new VNet and subnet for your cluster.
* Every pod in the cluster is assigned an IP address in the VNet, and can directly communicate with other pods in the cluster, and other VMs in the VNet.
* A pod can connect to other services in a peered VNet, and to on-premises networks over ExpressRoute and site-to-site (S2S) VPN connections. Pods are also reachable from on-premises.
* A Kubernetes service can be exposed externally or internally through the Azure Load Balancer.
* Pods in a subnet that have service endpoints enabled can securely connect to Azure services, for example Azure Storage and SQL.
* You can use user-defined routes (UDR) to route traffic from pods to a Network Virtual Appliance.
* Pods can access resources on the public Internet.

## Configure advanced networking

When you [create an AKS cluster](kubernetes-walkthrough-portal.md) in the Azure portal, the following parameters are configurable for advanced networking:

**Virtual network**: The VNet into which you want to deploy the cluster. If you want to create a new VNet for your cluster, select **Create New** and follow the steps in the **Create new virtual network** page.

**Subnet**: The subnet within the VNet where you want to deploy the cluster. If you want to create a new subnet in the VNet for your cluster, select **Create new** and follow the steps in the **Create new subnet** page.

**Service CIDR address range**: The IP address range for the Kubernetes cluster Service IPs. This range should be *outside* the subnet IP address range of your cluster.

**DNS service IP address**:  The IP address for the Kubernetes cluster DNS service. This address must be from within the *Service CIDR address range*.

**Docker Bridge IP address**: The IP address and netmask to assign to the Docker bridge. This address must not be in any subnet IP range, or in the range of Service CIDR.

The following screenshot from the Azure portal shows an example of configuring these settings during AKS cluster creation:

![Advanced networking configuration in the Azure portal][portal-03-networking-advanced]

## Plan IP addressing for your cluster

When planning the size of your VNet and the subnet, consider the number of pods you plan to run simultaneously in the cluster, as well as your scaling requirements.

Each VNet provisioned for use with the Azure CNI plugin is limited to 4096 IP addresses.

IP addresses for the pods and the cluster's nodes are assigned from the specified subnet within the VNet. Each node is configured with a primary IP, which is the IP of the node itself, and 30 additional IP addresses pre-configured by Azure CNI, and assigned to pods that are scheduled to a node.

Each node can host a maximum of 30 pods. When you scale out your cluster, each node is similarly configured with IP addresses from the subnet.

## Frequently asked questions

1. Can I deploy VMs in my cluster subnet?

   Yes, you can. However, ensure you have a sufficient number of IP addresses in the subnet for the VMs.

1. Are there any scenarios in which Network Security Groups, user-defined routes, and other network policies will not work for pods?

   Per-pod network policies are currently unsupported. You can configure the policies, but their behavior may be unpredictiable, and they may not be functional. As such, their usage is discouraged.

1. Is the maximum number of pods deployable to a node configurable?

   Each node can host a maximum of 30 pods. This number is not currently configurable.

1. How do I configure additional properties for the subnet that I created during AKS cluster creation? For example, service endpoints.

   The complete list of properties for the VNet and subnets that you create during AKS cluster creation can be configured in the standard VNet configuration page in the Azure portal.

## Next steps

Learn more about networking in AKS in the following articles:

[Use a static IP address with the Azure Kubernetes Service (AKS) load balancer](static-ip.md)

[HTTPS ingress on Azure Container Service (AKS)](ingress.md)

[Use an internal load balancer with Azure Container Service (AKS)](internal-lb.md)

<!-- IMAGES -->
[advanced-networking-diagram-01]: ./media/vnet/advanced-networking-diagram-01.png
[portal-01-create]: ./media/vnet/portal-01-create.png
[portal-02-networking]: ./media/vnet/portal-02-networking.png
[portal-03-networking-advanced]: ./media/vnet/portal-03-networking-advanced.png
[portal-04-create-vnet]: ./media/vnet/portal-04-create-vnet.png
[portal-05-create-subnet]: ./media/vnet/portal-05-create-subnet.png

<!-- LINKS - External -->
[cni-networking]: https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md

<!-- LINKS - Internal -->
[aks-ssh]: aks-ssh.md
