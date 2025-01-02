---
title: Container networking with Azure Virtual Network
description: Learn about the Azure Virtual Network container network interface (CNI) plug-in and how to enable containers to use an Azure virtual network.
author: asudbring
ms.service: azure-virtual-network
ms.topic: concept-article
ms.date: 03/25/2023
ms.author: allensu
---

# Enable containers to use Azure Virtual Network capabilities

To bring the rich set of Azure network capabilities to containers, you can use the same software-defined networking stack that powers virtual machines. The Azure Virtual Network container network interface (CNI) plug-in installs in an Azure virtual machine. The plug-in assigns IP addresses from a virtual network to containers brought up in the virtual machine. It attaches them to the virtual network and connects them directly to other containers and virtual network resources.

The plug-in doesn't rely on overlay networks, or routes, for connectivity, and provides the same performance as virtual machines. At a high level, the plug-in provides the following capabilities so that you can:

- Assign a virtual network IP address to every pod, which could consist of one or more containers.
- Connect pods to peered virtual networks and to on-premises over Azure ExpressRoute or a site-to-site virtual private network. Pods are also reachable from peered and on-premises networks.
- Access services with pods. For example, Azure Storage and Azure SQL Database are protected by virtual network service endpoints.
- Apply network security groups and routes directly to pods.
- Place pods directly behind an Azure internal or public load balancer, just like virtual machines.
- Assign pods a public IP address to make them directly accessible from the internet. Pods can also access the internet themselves.
- Use pods to work seamlessly with Kubernetes resources such as services, ingress controllers, and Kube DNS. A Kubernetes service can also be exposed internally or externally through Azure Load Balancer.

The following diagram shows how the plug-in provides Azure Virtual Network capabilities to pods.

:::image type="content" source="./media/container-networking/container-networking-overview.png" alt-text="Diagram that shows a container networking overview.":::

The plug-in supports both Linux and Windows platforms.

## Connect pods to a virtual network

Pods are brought up in a virtual machine that's part of a virtual network. A pool of IP addresses for the pods is configured as secondary addresses on a virtual machine's network interface. The Azure CNI sets up the basic network connectivity for pods and manages the utilization of the IP addresses in the pool. When a pod comes up in the virtual machine, the Azure CNI assigns an available IP address from the pool and connects the pod to a software bridge in the virtual machine. When the pod terminates, the IP address is added back to the pool. The following diagram shows how pods connect to a virtual network.

:::image type="content" source="./media/container-networking/container-networking-detail.png" alt-text="Diagram that shows container networking detail.":::

## Internet access

To enable pods to access the internet, the plug-in configures *iptables* rules to network address translation (NAT) to translate the internet-bound traffic from pods. The source IP address of the packet is translated to the primary IP address on the virtual machine's network interface. Windows virtual machines automatically source NAT traffic destined to IP addresses outside of the subnet where the virtual machine is located. Typically, all traffic destined to an IP address outside of the IP range of the virtual network is translated.

## Limits

The plug-in supports up to 250 pods per virtual machine and up to 16,000 pods in a virtual network. These limits are different for [Azure Kubernetes Service](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-kubernetes-service-limits) (AKS).

## Use the plug-in

You can use the plug-in in the following ways to provide basic virtual network attachment for pods or Docker containers:

- **Azure Kubernetes Service**: Use the plug-in to integrate into AKS by selecting the **Advanced Networking** option. With advanced networking, you can deploy a Kubernetes cluster in an existing or new virtual network. To learn more about advanced networking and the steps to set it up, see [Network configuration in AKS](/azure/aks/configure-azure-cni?toc=%2fazure%2fvirtual-network%2ftoc.json).
- **AKS engine**: Use the AKS engine to generate an Azure Resource Manager template for the deployment of a Kubernetes cluster in Azure. For detailed instructions, see [Deploy the plug-in for AKS engine Kubernetes clusters](deploy-container-networking.md#deploy-the-azure-virtual-network-container-network-interface-plug-in).
- **Create your own Kubernetes cluster in Azure**: Use the plug-in to provide basic networking for pods in Kubernetes clusters that you deploy yourself, without relying on AKS or tools like the AKS engine. In this case, the plug-in is installed and enabled on every virtual machine in a cluster. For detailed instructions, see [Deploy the plug-in for a Kubernetes cluster that you deploy yourself](deploy-container-networking.md#deploy-plug-in-for-a-kubernetes-cluster).
- **Virtual network attachment for Docker containers in Azure**: Use the plug-in when you don't want to create a Kubernetes cluster and want to create Docker containers with virtual network attachment in virtual machines. For detailed instructions, see [Deploy the plug-in for Docker](deploy-container-networking.md#deploy-plug-in-for-docker-containers).

## Related content

* [Deploy container networking for a stand-alone Linux Docker host](/azure/virtual-network/deploy-container-networking-docker-linux).
* [Deploy container networking for a stand-alone Windows Docker host](/azure/virtual-network/deploy-container-networking-docker-windows).
* [Deploy the plug-in](deploy-container-networking.md) for Kubernetes clusters or Docker containers.