---
title: Limitations for Windows Server node pools in Azure Kubernetes Service (AKS)
description: Learn about the known limitations when you run Windows Server node pools and application workloads in Azure Kubernetes Service (AKS)
services: container-service
author: mlearned

ms.service: container-service
ms.topic: article
ms.date: 05/31/2019
ms.author: mlearned

#Customer intent: As a cluster operator, I want to understand the current limitations when running Windows node pools and application workloads.
---

# Current limitations for Windows Server node pools and application workloads in Azure Kubernetes Service (AKS)

In Azure Kubernetes Service (AKS), you can create a node pool that runs Windows Server as the guest OS on the nodes. These nodes can run native Windows container applications, such as those built on the .NET Framework. As there are major differences in how the Linux and Windows OS provides container support, some common Kubernetes and pod-related features are not currently available for Windows node pools.

This article outlines some of the limitations and OS concepts for Windows Server nodes in AKS. Node pools for Windows Server are currently in preview.

> [!IMPORTANT]
> AKS preview features are self-service opt-in. Previews are provided "as-is" and "as available" and are excluded from the service level agreements and limited warranty. AKS Previews are partially covered by customer support on best effort basis. As such, these features are not meant for production use. For additional information, please see the following support articles:
>
> * [AKS Support Policies][aks-support-policies]
> * [Azure Support FAQ][aks-faq]

Windows Server containers must run on a Windows-based container host. To run Windows Server containers in AKS, you can [create a node pool that runs Windows Server][windows-node-cli] as the guest OS.

## Which Windows operating systems are supported?

Windows Server containers can only use Windows Server 2019, which matches the underlying Windows Server node OS. Container images built using Windows Server 2016 as the base OS aren't supported.

## Is Kubernetes on Windows any different than on Linux?

Window Server node pool support includes some limitations that are part of the upstream Windows Server in Kubernetes project. These limitations are not specific to AKS. For more information on this upstream support for Windows Server in Kubernetes, see the [Supported Functionality and Limitations][upstream-limitations] section of the [Intro to Windows support in Kubernetes][intro-windows] document, from the Kubernetes project.

## What kind of disks are supported for Windows Server containers?

Azure Disks and Azure Files are the supported volume types, accessed as NTFS volumes in the Windows Server container.

## Can I run Windows only clusters in AKS?

An AKS cluster always master nodes (the control plane) are hosted by AKS the service, you will not be exposed to the operating system of the nodes hosting the master components. All AKS cluster are created with a default first node pool, which is Linux based. This node pool contains vital system services, which are needed for the cluster to function. It's recommended to run at least three nodes in the first node pool to ensure reliability of your cluster and the ability to do cluster operations. The first Linux-based node pool can't be deleted unless the AKS cluster itself is deleted.

## What network plug-ins are supported?

AKS clusters with Windows node pools must use the Azure CNI (advanced) networking model. Kubenet (basic) networking is not supported. You can't create an AKS cluster that uses kubenet. For more information on the differences in network models, see [Network concepts for applications in AKS][azure-network-models]. - The Azure CNI network model requires additional planning and considerations for IP address management. For more information on how to plan and implement Azure CNI, see [Configure Azure CNI networking in AKS][configure-azure-cni].

## Can I change the minimum number of pods per node below 30?

No, the minimum value in the table above is strictly enforced by the AKS service.

## How do I keep my Windows nodes up to date with patches?

Windows Server nodes in AKS must be *upgraded* to a latest Windows Server 2019 release to maintain the latest patch fixes and updates. Windows Updates are not enabled in the base node image in AKS. On a regular schedule around the Windows Update release cycle and your own validation process, you should perform an upgrade on the Windows Server node pool(s) in your AKS cluster. For more information on upgrading a Windows Server node pool, see [Upgrade a node pool in AKS][nodepool-upgrade]. These Windows Server node upgrades temporarily consume additional IP addresses in the virtual network subnet as a new node is deployed, before the old node is removed. vCPU quotas are also temporarily consumed in the subscription as a new node is deployed, then the old node removed. You can't automatically update and manage reboots using `kured` as with Linux nodes in AKS.

> [!NOTE]
> The updated Windows Server image will only be used if a cluster upgrade (control plane upgrade) has been performed prior to upgrading the node pool
>

## How many node pools can I create?

The AKS cluster can have a maximum of eight node pools. You can have a maximum of 400 nodes across those eight node pools. [Node pool limitations][nodepool-limitations].

## Can't I use more than 6 (six) characters in a Windows node pool name?

No, this is a current limitation of AKS.

## Are all AKS preview features support with Windows nodes?

In general, don't expect preview features to work with Windows nodes, which in itself is a preview feature. For support policies around preview features, please see the [AKS preview support policy][preview-support].
Network Policy and cluster autoscaler are currently not support with Windows nodes.

## Can I run ingress controllers on Windows nodes?

Pods running on Windows nodes can use the Load Balancer service type as well as pods running on Linux. For ingress controllers, you can build your own and use as proxy on Windows nodes. Most eco-system supported ingress controllers, however only support Linux and have to be run on any Linux based node pool in the cluster.

## Can I use Azure Dev Spaces with Windows nodes?

Azure Dev Spaces is currently only available for Linux-based node pools.

## Can my Windows Server containers use gMSA?

Group managed service accounts (gMSA) support when the Windows Server nodes aren't joined to an Active Directory domain is not currently available in AKS.

## What if I need a Windows Server container feature which is not support by AKS?

We work hard to bring all the features you need to Windows in AKS, but if you do encounter gaps, the open-source, upstream [aks-engine][aks-engine] project provides an easy and fully customizable way of running Kubernetes in Azure, including Windows support. Please make sure to check out our roadmap of features coming [AKS roadmap][aks-roadmap].

## Are there specific OS concepts that are different between Linux and Windows, in relationship to AKS?

Kubernetes is historically Linux-focused. Many examples used in the upstream [Kubernetes.io][kubernetes] website are intended for use on Linux nodes. When you create deployments that use Windows Server containers, the following considerations at the OS-level apply:

- **Identity** - Linux uses userID (UID) and groupID (GID), represented as integer types. User and group names are not canonical - they are just an alias in */etc/groups* or */etc/passwd* back to UID+GID.
    - Windows Server uses a larger binary security identifier (SID) which is stored in the Windows Security Access Manager (SAM) database. This database is not shared between the host and containers, or between containers.
- **File permissions** - Windows Server uses an access control list based on SIDs, rather than a bitmask of permissions and UID+GID
- **File paths** - convention on Windows Server is to use \ instead of /.
    - In pod specs that mount volumes, specify the path correctly for Windows Server containers. For example, rather than a mount point of */mnt/volume* in a Linux container, specify a drive letter and location such as */K/Volume* to mount as the *K:* drive.

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
[azure-outbound-traffic]: ../load-balancer/load-balancer-outbound-connections.md#defaultsnat
[nodepool-limitations]: use-multiple-node-pools.md#limitations
[preview-support]: support-policies.md#preview-features-or-feature-flags