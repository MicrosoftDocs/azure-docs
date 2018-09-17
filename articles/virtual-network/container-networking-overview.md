---
title: Container networking with Azure Virtual Network | Microsoft Docs
description: Learn about how to enable containers to use an Azure Virtual Network.
services: virtual-network
documentationcenter: na
author: aanandr
manager: NarayanAnnamalai
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-network
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 9/14/2018
ms.author: aanandr
ms.custom: 

---

# Enable containers to use Azure Virtual Network capabilities

Bring the rich set of Azure network capabilities to containers, by utilizing the same software defined networking stack that powers virtual machines. The Azure Virtual Network container network interface (CNI) plug-in installs in an Azure Virtual Machine. The plug-in assigns IP addresses from a virtual network to containers brought up in the virtual machine, attaching them to the virtual network, and connecting them directly to other containers and virtual network resources. The plug-in doesn’t rely on overlay networks, or routes, for connectivity, and provides the same performance as virtual machines. At a high level, the plug-in provides the following capabilities:

- A virtual network IP address is assigned to every Pod, which could consist of one or more containers.
- Pods can connect to peered virtual networks and to on-premises over ExpressRoute or a site-to-site VPN. Pods are also reachable from peered and on-premises networks.
- Pods can access services such as Azure Storage and Azure SQL Database, that are protected by virtual network service endpoints.
- Network security groups and routes can be applied directly to Pods.
- Pods can be placed directly behind an Azure internal or public Load Balancer, just like virtual machines
- Pods can be assigned a public IP address, which makes them directly accessible from the internet. Pods can also access the internet themselves.
- Works seamlessly with Kubernetes resources such as Services, Ingress controllers, and Kube DNS. A Kubernetes Service can also be exposed internally or externally through the Azure Load Balancer.

The following picture shows how the plug-in provides Azure Virtual Network capabilities to Pods:

![](./media/container-networking/container-networking.png)

The plug-in supports both Linux and Windows platforms.

## Connecting Pods to a virtual network

Pods are brought up in a virtual machine that is part of a virtual network. A pool of IP addresses for the Pods is configured as secondary addresses on a virtual machine's network interface. Azure CNI sets up the basic Network connectivity for Pods and manages the utilization of the IP addresses in the pool. When a Pod comes up in the virtual machine, Azure CNI assigns an available IP address from the pool and connects the Pod to a software bridge in the virtual machine. When the Pod terminates, the IP address is added back to the pool.

## Internet access

To enable Pods to access the internet, the plug-in configures *iptables* rules to network address translate (NAT) the internet bound traffic from Pods. The source IP address of the packet is translated to the primary IP address on the virtual machine's network interface. Windows virtual machines automatically source NAT (SNAT) traffic destined to IP addresses outside the subnet the virtual machine is in. Typically, all traffic destined to an IP address outside of the IP range of the virtual network is translated.

## Limits

The plug-in supports up to 250 Pods per virtual machine and up to 16,000 Pods in a virtual network. These limits are different for the [Azure Kubernetes Service](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#kubernetes-service-limits).

## Using the plug-in

The plug-in can be used in the following ways, to provide basic virtual network attach for Pods:

- **Azure Kubernetes Service**: The plug-in is integrated into the Azure Kubernetes Service (AKS), and can be used by choosing the *Advanced Networking* option. Advanced Networking lets you deploy a Kubernetes cluster in an existing, or a new, virtual network. To learn more about Advanced Networking and the steps to set it up, see [Network configuration in AKS](../aks/networking-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json).
- **ACS-Engine**: ACS-Engine is a tool that generates an Azure Resource Manager template for the deployment of a Kubernetes cluster in Azure. The cluster configuration is specified in a JSON file that is passed to the tool when generating the template. To learn more about the entire list of supported cluster settings and their descriptions, see [Microsoft Azure Container Service Engine - Cluster Definition](https://github.com/Azure/acs-engine/blob/master/docs/clusterdefinition.md). The plug-in is the default networking plug-in for clusters created using the ACS-Engine. The following network configuration settings are important when configuring the plug-in

  | Setting                              | Description                                                                                                           |
  |--------------------------------------|------------------------------------------------------------------------------------------------------                 |
  | clusterSubnet under kubernetesConfig | CIDR of the virtual network subnet where the cluster is deployed, and from which IP addresses are allocated to Pods   |
  | vnetSubnetId under masterProfile     | Specifies the Azure Resource Manager resource ID of the subnet where the cluster is to be deployed                    |
  | vnetCidr                             | CIDR of the virtual network where the cluster is deployed                                                             |
  | max-Pods under kubeletConfig         | Maximum number of Pods on every agent virtual machine. For the plug-in, the default is 30. You can specify up to 250  |

- **Creating your own Kubernetes cluster in Azure**: The plug-in can be used to provide basic networking for Pods in Kubernetes clusters that you deploy yourself, without relying on AKS, or tools like the ACS-Engine. In this case, the plug-in is installed and enabled on every virtual machine in a cluster. For detailed instructions, see [Deploy the Azure Virtual Network CNI plug-in](#deploy-plug-in-for-a-kubernetes-cluster).
- **Virtual network attach for Docker containers in Azure**: The plug-in can be used in cases where you don’t want to create a Kubernetes cluster, and would like to create Docker containers with virtual network attach, in virtual machines. For detailed instructions, see [Deploy the Azure Virtual Network CNI plug-in](deploy-container-networking.md#deploy-plug-in-for-docker-containers).

## Next steps

[Deploy the Azure Virtual Network CNI plug-in](deploy-container-networking.md) for Kubernetes clusters or Docker containers