---
title: Azure Virtual Network for containers | Microsoft Docs
description: Learn about the CNI plug-in for Kubernetes clusters, which enables containers to communicate with each other, and other resources, in a virtual network.
services: virtual-network
documentationcenter: na
author: jimdial
manager: jeconnoc
editor: ''

ms.assetid: 
ms.service: virtual-network
ms.devlang: NA
ms.topic: 
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 12/18/2017
ms.author: jdial

---
# Container networking

Azure provides a [Container Networking Interface (CNI) plugin](https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md) that allows you to deploy and manage your own Kubernetes cluster, with native Azure networking capability. The plugin is enabled, by default, when deploying Kubernetes clusters with the [Azure Container Service Engine](https://github.com/Azure/acs-engine) (or ACS engine).

## Networking capabilities

Containers can utilize the rich set of capabilities that a virtual network offers, such as:
-	You can create a separate virtual network for your cluster, or deploy your cluster in an existing virtual network. 
-	Every pod in the cluster receives an IP address from within the virtual network and can directly communicate with other pods in the cluster and any virtual machine in the virtual network. 
-	A pod can connect to other pods and virtual machines in peered virtual networks and to on-premises networks, over ExpressRoute and site-to-site VPN connections. On-premises resources can communicate to pods. 
-	You can expose a Kubernetes service to the Internet through the Azure Load Balancer.  
-	Pods in a subnet that has service endpoints enabled can securely connect to Azure services (Storage and SQL Database, for example).
-	You can use user-defined routes to route traffic from pods to a network virtual appliance. 
-	Pods can access public resources on the Internet.
-	You can assign a pod a public IP address, which can be associated with a DNS name.
 
## Limits
You can deploy up to 4,000 nodes in a Kubernetes cluster, and up to 250 pods per node, with an overall limit of 16,000 pods per cluster, when using the plugin.

## Constraints
- The plugin is not enabled when deploying a Kubernetes cluster with the [Azure Container Service (AKS)](../aks/intro-kubernetes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [ACS](../container-service/kubernetes/container-service-intro-kubernetes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) cluster with Kubernetes.
- There is no native support for Kubernetes network policies, including DNS or access policies.
- The plugin doesn't support per-pod network policies.

## Pricing
There is no charge for using the CNI plugin.

## Next steps

Learn how to [deploy a Kubernetes cluster](https://github.com/Azure/acs-engine/blob/master/docs/kubernetes/deploy.md) in your [own virtual network](https://github.com/Azure/acs-engine/blob/master/docs/kubernetes/features.md#using-azure-integrated-networking-cni).
