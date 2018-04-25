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

Advanced networking places your pods in an Azure Virtual Network providing them automatic connectivity to VNet resources and integration with the rich set of capabilities that VNets offer. It uses the [Azure CNI Networking][cni-networking] plugin for Kubernetes, running on all cluster nodes.

![Diagram showing two nodes with bridges connecting each to a single Azure VNet][advanced-networking-diagram-01]

## Advanced networking features

Advanced networking provides the following benefits:

1. You can create a separate VNet and subnet for your AKS cluster or deploy your cluster in an existing VNet.
1. Every pod in the cluster receives an IP address on the VNet and can directly communicate with other pods in the cluster and any VM in the VNet.
1. A pod can connect to other services in a peered VNet and to on-premises networks over ExpressRoute and S2S VPN connections. pods are also reachable from on-premises.
1. A Kubernetes service can be exposed externally or internally through the Azure Load Balancer.
1. Pods in a subnet that have service endpoints enabled can securely connect to Azure services, for example Azure Storage and SQL.
1. You can use user-defined routes to route traffic from pods to a Network Virtual Appliance.
1. Pods can access public resources on the Internet.

## Configure advanced networking

The following parameters are configurable for advanced networking:

1. **Virtual Network**: Specify the VNet in which you want to deploy the cluster. If you want to create a new VNet for your cluster select Create New and follow the steps in the Create new virtual network blade.
1. **Subnet**: Specify a subnet in the VNet that you selected above where you want to deploy the cluster. If you want to create a new subnet in the VNet for your cluster select Create New and follow the steps in the Create new subnet blade.
1. **SVC CIDR address range**: Specify an IP address range for the Kubernetes cluster Service IPs. This range should be outside the subnet range of your cluster.
1. **DNS SVC IP address**:  Pick an IP address for the Kubernetes cluster DNS service from the service CIDR address range.
1. **Docker Bridge address range**: Specify an IP address range for use inside the docker bridge interfaces. This range should be outside the subnet range of your cluster.

## Plan IP addressing for your cluster

When planning the size of your VNet and the subnet, consider the number of pods you plan to run simultaneously in the cluster, as well as your scaling requirements.

IP addresses for the pods and the cluster's nodes are assigned from the specified subnet within the VNet. Each node is configured with a primary IP, which is the IP of the node itself, and 30 additional IP addresses pre-configured by Azure CNI and assigned to any pods scheduled on the node.

By default, each node can host a maximum of 30 pods. When you scale out your cluster, each added node is similarly configured with IP addresses from the subnet. You can adjust the maximum allowable pod count by configuring the **maxPods** setting.

## Frequently asked questions

1. Can I deploy VMs in my cluster subnet?

   Yes, you can. But make sure there are extra IP addresses in the subnet for these VMs.

1. Are there any scenarios in which NSGs, UDRs and other network policies will not work for pods?

   Per-pod network policies are not supported today. You will be allowed to configure the policies, but they will either not work or their behavior is not always predictable. So, their usage is discouraged.

1. Is the max. no. of pods deployed on every node configurable?

   Every node can host a maximum of 30 pods and this cannot be configured today.

1. How do I configure additional properties for the subnet that I created during AKS cluster creation, e.g. service endpoints?

   The complete list of properties for the VNet and subnets that you create during AKS cluster creation can be configured through the traditional VNet blade in the Azure portal.

## Next steps

Learn more about networking in AKS in the following articles:

[Use a static IP address with the Azure Kubernetes Service (AKS) load balancer](static-ip.md)

[HTTPS ingress on Azure Container Service (AKS)](ingress.md)

[Use an internal load balancer with Azure Container Service (AKS)](internal-lb.md)

<!-- IMAGES -->
[advanced-networking-diagram-01]: ./media/vnet/advanced-networking-diagram-01.png

<!-- LINKS - External -->
[cni-networking]: https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md

<!-- LINKS - Internal -->
[aks-ssh]: aks-ssh.md
