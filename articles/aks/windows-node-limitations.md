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
> AKS preview features are self-service, opt-in. They are provided to gather feedback and bugs from our community. In preview, these features aren't meant for production use. Features in public preview fall under 'best effort' support. Assistance from the AKS technical support teams is available during business hours Pacific timezone (PST) only. For additional information, please see the following support articles:
>
> * [AKS Support Policies][aks-support-policies]
> * [Azure Support FAQ][aks-faq]

## Limitations for Windows Server in Kubernetes

Windows Server containers must run on a Windows-based container host. To run Windows Server containers in AKS, you can [create a node pool that runs Windows Server][windows-node-cli] as the guest OS. Window Server node pool support includes some limitations that are part of the upstream Windows Server in Kubernetes project. These limitations are not specific to AKS. For more information on this upstream support for Windows Server in Kubernetes, see [Windows Server containers in Kubernetes limitations](https://docs.microsoft.com/azure/aks/windows-node-limitations).

The following upstream limitations for Windows Server containers in Kubernetes are relevant to AKS:

- Windows Server containers can only use Windows Server 2019, which matches the underlying Windows Server node OS.
    - Container images built using Windows Server 2016 as the base OS aren't supported.
- Privileged containers can't be used.
- Linux-specific features such as RunAsUser, SELinux, AppArmor, or POSIX capabilities aren't available in Windows Server containers.
    - File system limitations that are Linux-specific such as UUI/GUID, per user permissions also aren't available in Windows Server containers.
- Azure Disks and Azure Files are the supported volume types, accessed as NTFS volumes in the Windows Server container.
    - NFS-based storage / volumes aren't supported.

## AKS limitations for Windows Server node pools

The following additional limitations apply to Windows Server node pool support in AKS:

- An AKS cluster always contains a Linux node pool as the first node pool. This first Linux-based node pool can't be deleted unless the AKS cluster itself is deleted.
- AKS clusters must use the Azure CNI (advanced) networking model.
    - Kubenet (basic) networking is not supported. You can't create an AKS cluster that uses kubenet. For more information on the differences in network models, see [Network concepts for applications in AKS][azure-network-models].
    - The Azure CNI network model requires additional planning and considerations for IP address management. For more information on how to plan and implement Azure CNI, see [Configure Azure CNI networking in AKS][configure-azure-cni].
- Windows Server nodes in AKS must be *upgraded* to a latest Windows Server 2019 release to maintain the latest patch fixes and updates. Windows Updates are not enabled in the base node image in AKS. On a regular schedule around the Windows Update release cycle and your own validation process, you should perform an upgrade on the Windows Server node pool(s) in your AKS cluster. For more information on upgrading a Windows Server node pool, see [Upgrade a node pool in AKS][nodepool-upgrade].
    - These Windows Server node upgrades temporarily consume additional IP addresses in the virtual network subnet as a new node is deployed, before the old node is removed.
    - vCPU quotas are also temporarily consumed in the subscription as a new node is deployed, then the old node removed.
    - You can't automatically update and manage reboots using `kured` as with Linux nodes in AKS.
- The AKS cluster can have a maximum of eight node pools.
    - You can have a maximum of 400 nodes across those eight node pools.
- The Windows Server node pool name has a limit of 6 characters.
- Preview features in AKS such as Network Policy and cluster autoscaler, aren't endorsed for Windows Server nodes.
- Ingress controllers should only be scheduled on Linux nodes using a NodeSelector.
- Azure Dev Spaces is currently only available for Linux-based node pools.
- Group managed service accounts (gMSA) support when the Windows Server nodes aren't joined to an Active Directory domain is not currently available in AKS.
    - The open-source, upstream [aks-engine][aks-engine] project does currently provide gMSA support if you need to use this feature.

## OS concepts that are different

Kubernetes is historically Linux-focused. Many examples used in the upstream [Kubernetes.io][kubernetes] website are intended for use on Linux nodes. When you create deployments that use Windows Server containers, the following considerations at the OS-level apply:

- **Identity** - Linux uses userID (UID) and groupID (GID), represented as integer types. User and group names are not canonical - they are just an alias in */etc/groups* or */etc/passwd* back to UID+GID.
    - Windows Server uses a larger binary security identifier (SID) which is stored in the Windows Security Access Manager (SAM) database. This database is not shared between the host and containers, or between containers.
- **File permissions** - Windows Server uses an access control list based on SIDs, rather than a bitmask of permissions and UID+GID
- **File paths** - convention on Windows Server is to use \ instead of /.
    - In pod specs that mount volumes, specify the path correctly for Windows Server containers. For example, rather than a mount point of */mnt/volume* in a Linux container, specify a drive letter and location such as */K/Volume* to mount as the *K:* drive.

## Next steps

To get started with Windows Server containers in AKS, [create a node pool that runs Windows Server in AKS][windows-node-cli].

<!-- LINKS - external -->
[upstream-limitations]: https://kubernetes.io/docs/setup/windows/#limitations
[kubernetes]: https://kubernetes.io
[aks-engine]: https://github.com/azure/aks-engine

<!-- LINKS - internal -->
[azure-network-models]: concepts-network.md#azure-virtual-networks
[configure-azure-cni]: configure-azure-cni.md
[nodepool-upgrade]: use-multiple-node-pools.md#upgrade-a-node-pool
[windows-node-cli]: windows-container-cli.md
[aks-support-policies]: support-policies.md
[aks-faq]: faq.md
[azure-outbound-traffic]: ../load-balancer/load-balancer-outbound-connections.md#defaultsnat
