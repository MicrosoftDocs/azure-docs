---
title: Use virtual nodes
titleSuffix: Azure Kubernetes Service
description: Overview of how using virtual node with Azure Kubernetes Services (AKS)
services: container-service
ms.topic: conceptual
ms.date: 02/17/2021
ms.custom: references_regions
---

# Create and configure an Azure Kubernetes Services (AKS) cluster to use virtual nodes

To rapidly scale application workloads in an AKS cluster, you can use virtual nodes. With virtual nodes, you have quick provisioning of pods, and only pay per second for their execution time. You don't need to wait for Kubernetes cluster autoscaler to deploy VM compute nodes to run the additional pods. Virtual nodes are only supported with Linux pods and nodes.

The virtual nodes add-on for AKS, is based on the open source project [Virtual Kubelet][virtual-kubelet-repo].

This article gives you an overview of the region availability and networking requirements for using virtual nodes, as well as the known limitations.

## Regional availability

All regions, where ACI supports VNET SKUs, are supported for virtual nodes deployments. For more details, see [Resource availability for Azure Container Instances in Azure regions](../container-instances/container-instances-region-availability.md).

For available CPU and Memory SKUs in each region, please check the [Azure Container Instances Resource availability for Azure Container Instances in Azure regions - Linux container groups](../container-instances/container-instances-region-availability.md#linux-container-groups)

## Network requirements

Virtual nodes enable network communication between pods that run in Azure Container Instances (ACI) and the AKS cluster. To provide this communication, a virtual network subnet is created and delegated permissions are assigned. Virtual nodes only work with AKS clusters created using *advanced* networking (Azure CNI). By default, AKS clusters are created with *basic* networking (kubenet).

Pods running in Azure Container Instances (ACI) need access to the AKS API server endpoint, in order to configure networking.

## Known limitations

Virtual Nodes functionality is heavily dependent on ACI's feature set. In addition to the [quotas and limits for Azure Container Instances](../container-instances/container-instances-quotas.md), the following scenarios are not yet supported with Virtual nodes:

* Using service principal to pull ACR images. [Workaround](https://github.com/virtual-kubelet/azure-aci/blob/master/README.md#private-registry) is to use [Kubernetes secrets](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/#create-a-secret-by-providing-credentials-on-the-command-line)
* [Virtual Network Limitations](../container-instances/container-instances-vnet.md) including VNet peering, Kubernetes network policies, and outbound traffic to the internet with network security groups.
* Init containers
* [Host aliases](https://kubernetes.io/docs/concepts/services-networking/add-entries-to-pod-etc-hosts-with-host-aliases/)
* [Arguments](../container-instances/container-instances-exec.md#restrictions) for exec in ACI
* [DaemonSets](concepts-clusters-workloads.md#statefulsets-and-daemonsets) will not deploy pods to the virtual nodes
* Virtual nodes support scheduling Linux pods. You can manually install the open source [Virtual Kubelet ACI](https://github.com/virtual-kubelet/azure-aci) provider to schedule Windows Server containers to ACI.
* Virtual nodes require AKS clusters with Azure CNI networking.
* Using api server authorized ip ranges for AKS.
* Volume mounting Azure Files share support [General-purpose V1](../storage/common/storage-account-overview.md#types-of-storage-accounts). Follow the instructions for mounting [a volume with Azure Files share](azure-files-volume.md)
* Using IPv6 is not supported.

## Next steps

Configure virtual nodes for your clusters:

- [Create virtual nodes using Azure CLI](virtual-nodes-cli.md)
- [Create virtual nodes using the portal in Azure Kubernetes Services (AKS)](virtual-nodes-portal.md)

Virtual nodes are often one component of a scaling solution in AKS. For more information on scaling solutions, see the following articles:

- [Use the Kubernetes horizontal pod autoscaler][aks-hpa]
- [Use the Kubernetes cluster autoscaler][aks-cluster-autoscaler]
- [Check out the Autoscale sample for Virtual Nodes][virtual-node-autoscale]
- [Read more about the Virtual Kubelet open source library][virtual-kubelet-repo]

<!-- LINKS - external -->
[aks-hpa]: tutorial-kubernetes-scale.md
[aks-cluster-autoscaler]: ./cluster-autoscaler.md
[virtual-node-autoscale]: https://github.com/Azure-Samples/virtual-node-autoscale
[virtual-kubelet-repo]: https://github.com/virtual-kubelet/virtual-kubelet
