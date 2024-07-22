---
title: Azure Kubernetes Services (AKS) core concepts
description: Learn about the core concepts of Azure Kubernetes Service (AKS).
ms.topic: conceptual
ms.date: 07/10/2024
author: schaffererin
ms.author: schaffererin
---

# Core concepts for Azure Kubernetes Service (AKS)

This article describes core concepts of Azure Kubernetes Service (AKS), a managed Kubernetes service that you can use to deploy and operate containerized applications at scale on Azure.

## What is Kubernetes?

Kubernetes is an open-source container orchestration platform for automating the deployment, scaling, and management of containerized applications. For more information, see the official [Kubernetes documentation][kubernetes-docs].

## What is AKS?

AKS is a managed Kubernetes service that simplifies deploying, managing, and scaling containerized applications using Kubernetes. For more information, see [What is Azure Kubernetes Service (AKS)?][aks-overview]

## Cluster components

An AKS cluster is divided into two main components:

* **Control plane**: The control plane provides the core Kubernetes services and orchestration of application workloads.
* **Nodes**: Nodes are the underlying virtual machines (VMs) that run your applications.

![Screenshot of Kubernetes control plane and node components](media/concepts-clusters-workloads/control-plane-and-nodes.png)

### Control plane

The Azure managed control plane is comprised of several components that help manage the cluster:

| Component | Description |  
| --------- | ----------- |  
| *kube-apiserver* | The API server ([kube-apiserver][kube-apiserver]) exposes the Kubernetes API to enable requests to the cluster from inside and outside of the cluster. |  
| *etcd* | [etcd][etcd] is a highly available key-value store that helps maintain the state of your Kubernetes cluster and configuration. |  
| *kube-scheduler* | The scheduler ([kube-scheduler][kube-scheduler]) helps make scheduling decisions, watching for new pods with no assigned node and selecting a node for them to run on. |  
| *kube-controller-manager* | The controller manager ([kube-controller-manager][kube-controller-manager]) runs controller processes, such as noticing and responding when nodes go down. |
| *cloud-controller-manager* | The cloud controller manager ([cloud-controller-manager][cloud-controller-manager]) embeds cloud-specific control logic to run controllers specific to the cloud provider. |

### Nodes

Each AKS cluster has at least one node, which is an Azure virtual machine (VM) that runs Kubernetes node components. The following components run on each node:

| Component | Description |
| --------- | ----------- |
| *kubelet* | The [kubelet][kubelet] ensures that containers are running in a pod. |
| *kube-proxy* | The [kube-proxy][kube-proxy] is a network proxy that maintains network rules on nodes. |
| *container runtime* | The [container runtime][container-runtime] manages the execution and lifecycle of containers. |

![Screenshot of Azure virtual machine and supporting resources for a Kubernetes node](media/concepts-clusters-workloads/aks-node-resource-interactions.png)

## Node configuration

### VM size and image

The **Azure VM size** for your nodes defines CPUs, memory, size, and the storage type available, such as high-performance SSD or regular HDD. The VM size you choose depends on the workload requirements and the number of pods you plan to run on each node. For more information, see [Supported VM sizes in Azure Kubernetes Service (AKS)][aks-vm-sizes].

In AKS, the **VM image** for your cluster's nodes is based on Ubuntu Linux, [Azure Linux](use-azure-linux.md), or Windows Server 2022. When you create an AKS cluster or scale out the number of nodes, the Azure platform automatically creates and configures the requested number of VMs. Agent nodes are billed as standard VMs, so any VM size discounts, including [Azure reservations][reservation-discounts], are automatically applied.

### OS disks

Default OS disk sizing is only used on new clusters or node pools when Ephemeral OS disks aren't supported and a default OS disk size isn't specified. For more information, see [Default OS disk sizing][default-os-disk] and [Ephemeral OS disks][ephemeral-os-disks].

### Resource reservations

AKS uses node resources to help the nodes function as part of the cluster. This usage can cause a discrepancy between the node's total resources and the allocatable resources in AKS. To maintain node performance and functionality, AKS reserves two types of resources, **CPU** and **memory**, on each node. For more information, see [Resource reservations in AKS][resource-reservations].

### OS

AKS supports Ubuntu 22.04 and Azure Linux 2.0 as the node OS for Linux node pools. For Windows node pools, AKS supports Windows Server 2022 as the default OS. Windows Server 2019 is being retired after Kubernetes version 1.32 reaches end of life and isn't supported in future releases. If you need to upgrade your Windows OS version, see [Upgrade from Windows Server 2019 to Windows Server 2022][upgrade-2019-2022]. For more information on using Windows Server on AKS, see [Windows container considerations in Azure Kubernetes Service (AKS)][windows-considerations].

### Container runtime

A container runtime is software that executes containers and manages container images on a node. The runtime helps abstract away sys-calls or OS-specific functionality to run containers on Linux or Windows. For Linux node pools, [`containerd`][containerd] is used on Kubernetes version 1.19 and higher. For Windows Server 2019 and 2022 node pools, [`containerd`][containerd] is generally available and is the only runtime option on Kubernetes version 1.23 and higher.

## Pods

A *pod* is a group of one or more containers that share the same network and storage resources and a specification for how to run the containers. Pods typically have a 1:1 mapping with a container, but you can run multiple containers in a pod.

## Node pools

In AKS, nodes of the same configuration are grouped together into *node pools*. These node pools contain the underlying virtual machine scale sets and virtual machines (VMs) that run your applications. When you create an AKS cluster, you define the initial number of nodes and their size (SKU), which creates a [*system node pool*][use-system-pool]. System node pools serve the primary purpose of hosting critical system pods, such as CoreDNS and `konnectivity`. To support applications that have different compute or storage demands, you can create *user node pools*. User node pools serve the primary purpose of hosting your application pods.

For more information, see [Create node pools in AKS][create-node-pools] and [Manage node pools in AKS][manage-node-pools].

## Node resource group

When you create an AKS cluster in an Azure resource group, the AKS resource provider automatically creates a second resource group called the *node resource group*. This resource group contains all the infrastructure resources associated with the cluster, including virtual machines (VMs), virtual machine scale sets, and storage.

For more information, see the following resources:

* [Why are two resource groups created with AKS?][node-resource-group]
* [Can I provide my own name for the AKS node resource group?][custom-nrg]
* [Can I modify tags and other properties of the resources in the AKS node resource group?][modify-nrg-resources]

## Namespaces

Kubernetes resources, such as pods and deployments, are logically grouped into *namespaces* to divide an AKS cluster and create, view, or manage access to resources.

The following namespaces are created by default in an AKS cluster:

| Namespace | Description |  
| --------- | ----------- |  
| *default* | The [default][kubernetes-namespaces] namespace allows you to start using cluster resources without creating a new namespace. |
| *kube-node-lease* | The [kube-node-lease][kubernetes-namespaces] namespace enables nodes to communicate their availability to the control plane. |
| *kube-public* | The [kube-public][kubernetes-namespaces] namespace isn't typically used, but can be used for resources to be visible across the whole cluster by any user. |
| *kube-system* | The [kube-system][kubernetes-namespaces] namespace is used by Kubernetes to manage cluster resources, such as `coredns`, `konnectivity-agent`, and `metrics-server`. |

![Screenshot of Kubernetes namespaces to logically divide resources and applications](media/concepts-clusters-workloads/namespaces.png)

## Cluster modes

In AKS, you can create a cluster with the **Automatic (preview)** or **Standard** mode. AKS Automatic provides a more fully managed experience, managing cluster configuration, including nodes, scaling, security, and other preconfigured settings. AKS Standard provides more control over the cluster configuration, including the ability to manage node pools, scaling, and other settings.

For more information, see [AKS Automatic and Standard feature comparison][automatic-standard].

## Pricing tiers

AKS offers three pricing tiers for cluster management: **Free**, **Standard**, and **Premium**. The pricing tier you choose determines the features available for managing your cluster.

For more information, see [Pricing tiers for AKS cluster management][pricing-tiers].

## Supported Kubernetes versions

For more information, see [Supported Kubernetes versions in AKS][supported-kubernetes-versions].

## Next steps

For information on more core concepts for AKS, see the following resources:

* [AKS access and identity][access-identity]
* [AKS security][security]
* [AKS networking][networking]
* [AKS storage][storage]
* [AKS scaling][scaling]
* [AKS monitoring][monitoring]
* [AKS backup and recovery][backup-recovery]

<!---LINKS--->
[kube-apiserver]: https://kubernetes.io/docs/concepts/overview/components/#kube-apiserver
[etcd]: https://kubernetes.io/docs/concepts/overview/components/#etcd
[kube-scheduler]: https://kubernetes.io/docs/concepts/overview/components/#kube-scheduler
[kube-controller-manager]: https://kubernetes.io/docs/concepts/overview/components/#kube-controller-manager
[cloud-controller-manager]: https://kubernetes.io/docs/concepts/overview/components/#cloud-controller-manager
[kubelet]: https://kubernetes.io/docs/concepts/overview/components/#kubelet
[kube-proxy]: https://kubernetes.io/docs/concepts/overview/components/#kube-proxy
[container-runtime]: https://kubernetes.io/docs/concepts/overview/components/#container-runtime
[create-node-pools]: ./create-node-pools.md
[manage-node-pools]: ./manage-node-pools.md
[node-resource-group]: ./faq.md#why-are-two-resource-groups-created-with-aks
[custom-nrg]: ./faq.md#can-i-provide-my-own-name-for-the-aks-node-resource-group
[modify-nrg-resources]: ./faq.md#can-i-modify-tags-and-other-properties-of-the-aks-resources-in-the-node-resource-group
[kubernetes-namespaces]: https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/#initial-namespaces
[use-system-pool]: ./use-system-pools.md
[automatic-standard]: ./intro-aks-automatic.md#aks-automatic-and-standard-feature-comparison
[pricing-tiers]: ./free-standard-pricing-tiers.md
[access-identity]: ./concepts-identity.md
[security]: ./concepts-security.md
[networking]: ./concepts-network.md
[storage]: ./concepts-storage.md
[scaling]: ./concepts-scale.md
[monitoring]: ./monitor-aks.md
[backup-recovery]: ../backup/azure-kubernetes-service-backup-overview.md
[kubernetes-docs]: https://kubernetes.io/docs/home/
[resource-reservations]: ./node-resource-reservations.md
[reservation-discounts]: ../cost-management-billing/reservations/save-compute-costs-reservations.md
[supported-kubernetes-versions]: ./supported-kubernetes-versions.md
[default-os-disk]: ./concepts-storage.md#default-os-disk-sizing
[ephemeral-os-disks]: ./concepts-storage.md#ephemeral-os-disk
[aks-overview]: ./what-is-aks.md
[containerd]: https://containerd.io/
[aks-vm-sizes]: ./quotas-skus-regions.md#supported-vm-sizes
[windows-considerations]: ./windows-vs-linux-containers.md
[upgrade-2019-2022]: ./upgrade-windows-os.md
