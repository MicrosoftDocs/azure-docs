---
title: Azure Virtual Network for containers | Microsoft Docs
description: Learn how to deploy a CNI plug-in in Kubernetes clusters to enable containers to communicate with each other, and other resources, in a virtual network.
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

Azure provides a Container Networking Interface (CNI) plugin that allows you to deploy and manage your own Kubernetes cluster with native Azure networking capability. The plugin is enabled, by default, when deploying Kuberenetes clusters with the [Azure Container Service Engine](https://github.com/Azure/acs-engine) (or ACS engine).

## Networking capabilities

The plugin allows your containers to be part of a virtual network. Containers can utilize the rich set of capabilities that a virtual network offers, such as:
1.	You can create a separate virtual network for your cluster, or deploy your cluster in an existing virtual network. 
2.	Every pod in the cluster receives an IP address from within the virtual network and can directly communicate with other pods in the cluster and any virtual machine in the virtual network. 
3.	A pod can connect to other pods and virtual machines in peered virtual networks and to on-premises networks, over ExpressRoute and site-to-site VPN connections. On-premises resources can communicate to pods. 
4.	You can expose a Kubernetes service to the Internet through the Azure Load Balancer.  
5.	Pods in a subnet that has service endpoints enabled can securely connect to service-endpoint enable Azure services, such as Azure Storage and Azure SQL Database.
6.	You can use user-defined routes to route traffic from pods to a network virtual appliance. 
7.	Pods can access public resources on the Internet.
8.	You can assign a pod a public IP address, which can be associated with a DNS name.
 
## Constraints
- You can deploy up to 4,000 nodes in a Kubernetes cluster, and up to 250 pods per node, with an overall limit of 16,000 pods per cluster, when using the plugin.
- The plugin is not enabled when deploying a Kubernetes cluster with the [Azure Container Service (AKS)](../aks/intro-kubernetes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [ACS](../container-service/kubernetes/container-service-intro-kubernetes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) cluster with Kubernetes.
- Outbound traffic from a pod is network address translated to the private IP address of the primary IP configuration of the primary network interface in each node of the Kubernetes cluster, resulting in the following behavior:
    - You cannot specify the IP addresses of pods in outbound rules within a network security group, since the pod IP addresses are never sent to the network.
    - All outbound communication to the Internet is network address translated to the public IP address assigned to the primary IP configuration of the primary network interface. 

## Next steps

Learn how to deploy a Kubernetes cluster in your own virtual network. @@@ Aaanand to provide link @@@