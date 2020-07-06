---
title: Windows Server node pools limitations
titleSuffix: Azure Kubernetes Service
description: Learn about the known limitations when you run Windows Server node pools and application workloads in Azure Kubernetes Service (AKS)
services: container-service
ms.topic: article
ms.date: 05/28/2020

#Customer intent: As a cluster operator, I want to understand the current limitations when running Windows node pools and application workloads.
---

# Current limitations for Windows Server node pools and application workloads in Azure Kubernetes Service (AKS)

In Azure Kubernetes Service (AKS), you can create a node pool that runs Windows Server as the guest OS on the nodes. These nodes can run native Windows container applications, such as those built on the .NET Framework. As there are major differences in how the Linux and Windows OS provides container support, some common Kubernetes and pod-related features are not currently available for Windows node pools.

This article outlines some of the limitations and OS concepts for Windows Server nodes in AKS.

## Which Windows operating systems are supported?

AKS uses Windows Server 2019 as the host OS version and only supports process isolation. Container images built using other Windows Server versions are not supported. [Windows container version compatibility][windows-container-compat]

## Is Kubernetes different on Windows and Linux?

Window Server node pool support includes some limitations that are part of the upstream Windows Server in Kubernetes project. These limitations are not specific to AKS. For more information on this upstream support for Windows Server in Kubernetes, see the [Supported Functionality and Limitations][upstream-limitations] section of the [Intro to Windows support in Kubernetes][intro-windows] document, from the Kubernetes project.

Kubernetes is historically Linux-focused. Many examples used in the upstream [Kubernetes.io][kubernetes] website are intended for use on Linux nodes. When you create deployments that use Windows Server containers, the following considerations at the OS-level apply:

- **Identity** - Linux identifies a user by an integer user identifier (UID). A user also has an alphanumeric user name for logging on, which Linux translates to the user's UID. Similarly Linux identifies a user group by an integer group identifier (GID) and translates a group name to its corresponding GID.
    - Windows Server uses a larger binary security identifier (SID) which is stored in the Windows Security Access Manager (SAM) database. This database is not shared between the host and containers, or between containers.
- **File permissions** - Windows Server uses an access control list based on SIDs, rather than a bitmask of permissions and UID+GID
- **File paths** - convention on Windows Server is to use \ instead of /.
    - In pod specs that mount volumes, specify the path correctly for Windows Server containers. For example, rather than a mount point of */mnt/volume* in a Linux container, specify a drive letter and location such as */K/Volume* to mount as the *K:* drive.

## What kind of disks are supported for Windows?

Azure Disks and Azure Files are the supported volume types, accessed as NTFS volumes in the Windows Server container.

## Can I run Windows only clusters in AKS?

The master nodes (the control plane) in an AKS cluster are hosted by AKS the service, you will not be exposed to the operating system of the nodes hosting the master components. All AKS cluster are created with a default first node pool, which is Linux based. This node pool contains system services, which are needed for the cluster to function. It's recommended to run at least two nodes in the first node pool to ensure reliability of your cluster and the ability to do cluster operations. The first Linux-based node pool can't be deleted unless the AKS cluster itself is deleted.

## What network plug-ins are supported?

AKS clusters with Windows node pools must use the Azure CNI (advanced) networking model. Kubenet (basic) networking is not supported. For more information on the differences in network models, see [Network concepts for applications in AKS][azure-network-models]. - The Azure CNI network model requires additional planning and considerations for IP address management. For more information on how to plan and implement Azure CNI, see [Configure Azure CNI networking in AKS][configure-azure-cni].

## Can I change the max. # of pods per node?

Yes. For the implications and options that are available, see [Maximum number of pods][maximum-number-of-pods].

## How do patch my Windows nodes?

Windows Server nodes in AKS must be *upgraded* to get the latest patch fixes and updates. Windows Updates are not enabled on nodes in AKS. AKS releases new node pool images as soon as patches are available, it is the customers responsibility to upgrade node pools to stay current on patches and hotfix. This is also true for the Kubernetes version being used. AKS release notes will indicate when new versions are available. For more information on upgrading a Windows Server node pool, see [Upgrade a node pool in AKS][nodepool-upgrade].

> [!NOTE]
> The updated Windows Server image will only be used if a cluster upgrade (control plane upgrade) has been performed prior to upgrading the node pool
>

## Why am I seeing an error when I try to create a new Windows agent pool?

If you created your cluster before February 2020 and have never did any cluster upgrade operations, the cluster still uses an old Windows image. You may have seen an error that resembles:

"The following list of images referenced from the deployment template are not found: Publisher: MicrosoftWindowsServer, Offer: WindowsServer, Sku: 2019-datacenter-core-smalldisk-2004, Version: latest. Please refer to https://docs.microsoft.com/azure/virtual-machines/windows/cli-ps-findimage for instructions on finding available images."

To fix this:

1. Upgrade the [cluster control plane][upgrade-cluster-cp]. This will update the image offer and publisher.
1. Create new Windows agent pools.
1. Move Windows pods from existing Windows agent pools to new Windows agent pools.
1. Delete old Windows agent pools.

## How do I rotate the service principal for my Windows node pool?

Windows node pools do not support service principal rotation. In order to update the service principal, create a new Windows node pool and migrate your pods from the older pool to the new one. Once this is complete, delete the older node pool.

## How many node pools can I create?

The AKS cluster can have a maximum of 10 node pools. You can have a maximum of 1000 nodes across those node pools. [Node pool limitations][nodepool-limitations].

## What can I name my Windows node pools?

You have to keep the name to a maximum of 6 (six) characters. This is a current limitation of AKS.

## Are all features supported with Windows nodes?

Network policies and kubenet are currently not supported with Windows nodes.

## Can I run ingress controllers on Windows nodes?

Yes, an ingress-controller which supports Windows Server containers can run on Windows nodes in AKS.

## Can I use Azure Dev Spaces with Windows nodes?

Azure Dev Spaces is currently only available for Linux-based node pools.

## Can my Windows Server containers use gMSA?

Group managed service accounts (gMSA) support is not currently available in AKS.

## Can I use Azure Monitor for containers with Windows nodes and containers?

Yes you can, however Azure Monitor is in public preview for gathering logs (stdout, stderr) and metrics from Windows containers. You can also attach to the live stream of stdout logs from a Windows container.

## What if I need a feature which is not supported?

We work hard to bring all the features you need to Windows in AKS, but if you do encounter gaps, the open-source, upstream [aks-engine][aks-engine] project provides an easy and fully customizable way of running Kubernetes in Azure, including Windows support. Please make sure to check out our roadmap of features coming [AKS roadmap][aks-roadmap].

## Next steps

To get started with Windows Server containers in AKS, [create a node pool that runs Windows Server in AKS][windows-node-cli].

<!-- LINKS - external -->
[kubernetes]: https://kubernetes.io
[aks-engine]: https://github.com/azure/aks-engine
[upstream-limitations]: https://kubernetes.io/docs/setup/production-environment/windows/intro-windows-in-kubernetes/#supported-functionality-and-limitations
[intro-windows]: https://kubernetes.io/docs/setup/production-environment/windows/intro-windows-in-kubernetes/
[aks-roadmap]: https://github.com/Azure/AKS/projects/1

<!-- LINKS - internal -->
[azure-network-models]: concepts-network.md#azure-virtual-networks
[configure-azure-cni]: configure-azure-cni.md
[nodepool-upgrade]: use-multiple-node-pools.md#upgrade-a-node-pool
[windows-node-cli]: windows-container-cli.md
[aks-support-policies]: support-policies.md
[aks-faq]: faq.md
[upgrade-cluster]: upgrade-cluster.md
[upgrade-cluster-cp]: use-multiple-node-pools.md#upgrade-a-cluster-control-plane-with-multiple-node-pools
[azure-outbound-traffic]: ../load-balancer/load-balancer-outbound-connections.md#defaultsnat
[nodepool-limitations]: use-multiple-node-pools.md#limitations
[windows-container-compat]: /virtualization/windowscontainers/deploy-containers/version-compatibility?tabs=windows-server-2019%2Cwindows-10-1909
[maximum-number-of-pods]: configure-azure-cni.md#maximum-pods-per-node
[azure-monitor]: ../azure-monitor/insights/container-insights-overview.md#what-does-azure-monitor-for-containers-provide
