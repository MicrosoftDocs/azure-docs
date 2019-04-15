---
title: Limitations and issues for Windows node pools in Azure Kubernetes Service (AKS)
description: Learn about the known limitations and issues when you run Windows node pools and application workloads in Azure Kubernetes Service (AKS)
services: container-service
author: iainfoulds

ms.service: container-service
ms.topic: article
ms.date: 05/06/2019
ms.author: iainfou

#Customer intent: As a cluster operator, I want to understand the current limitations and known issues when running Windows node pools and application workloads.
---

# Current limitations and known issues for Windows node pools and application workloads in Azure Kubernetes Service (AKS)

In Azure Kubernetes Service (AKS), you can create a node pool that runs Windows as the guest OS on the nodes. These nodes can run native Windows applications, such as those built on the .NET Framework. As there are major differences in how the Linux and Windows OS provides container support, some common Kubernetes and pod-related features are not currently available Windows node pools. This article outlines some of the limitations and OS concepts for Windows nodes in AKS. Node pools for Windows are currently in preview.

> [!IMPORTANT]
> AKS preview features are self-service and opt-in. Previews are provided to gather feedback and bugs from our community. However, they are not supported by Azure technical support. If you create a cluster, or add these features to existing clusters, that cluster is unsupported until the feature is no longer in preview and graduates to general availability (GA).
>
> If you encounter issues with preview features, [open an issue on the AKS GitHub repo][aks-github] with the name of the preview feature in the bug title.

## Limitations for Windows in Kubernetes

To run applications workloads that require a Windows OS, AKS lets you create node pools that contain Windows nodes. Window node pool support includes some limitations that are part of the upstream Windows in Kubernetes project, not limitations specific to AKS. For more information on this upstream support for Windows in Kubernetes, see [Windows containers in Kubernetes limitations][upstream-limitations].

The following limitations are relevant to AKS:

- Windows is only supported as worker node. AKS manages the master components, though these continue to run on Linux.
    - An AKS cluster also contains a Linux node pool as the first node pool. This first Linux-based node pool can't be deleted.
- Windows containers can only use Windows Server 2019, which matches the underlying Windows node OS.
    - Container images built using Windows Server 2016 as the base OS aren't supported.
- Privileged containers can't be used.
- RunAsUser isn't currently supported.
- Linux-specific pod security context privileges such as SELinux, AppArmor, Seccomp, Capabilities (POSIX Capabilities), and others aren't supported.
- File system limitations that are Linux-specific such as UUI/GUID, per user permissions aren't supported.
- NFS-based storage / volume support aren't supported.
    - Azure Disks and Azure Files are the supported volume types, accessed as NTFS volumes in the Windows container.

## AKS limitations for Windows node pools

The following additional limitations apply to Windows node pool support in AKS:

- AKS clusters must use the Azure CNI (advanced) networking model.
    - Kubenet (basic) networking isn't endorsed. For more information on the differences in network models, see [Network concepts for applications in AKS][azure-network-models].
    - The Azure CNI network model requires additional planning and considerations for IP address management. For more information on how to plan and implement Azure CNI, see [Configure Azure CNI networking in AKS][configure-azure-cni].
- Windows nodes must be *upgraded* to a latest Windows Server 2019 release to maintain the latest patch fixes and updates. Windows Updates are not used in the base node image.
    - These upgrades temporarily consume additional IP addresses in the virtual network subnet as a new node is deployed, then the old node removed.
    - In the same way, vCPU quotas are temporarily consumed in the subscription as a new is deployed, then the old node removed.
    - You can't automatically update and manage reboots using `kured` as with Linux nodes in AKS.
- Ingress controllers should only be scheduled on Linux nodes using a NodeSelector.
- Network policy, currently in preview for AKS, isn't endorsed for Windows nodes.
- Cluster autoscaler, currently in preview for AKS, isn't endorsed for Windows nodes.
- Azure Dev Spaces isn't endorsed for Windows nodes.

## OS concepts that are different

Kubernetes is historically Linux-focused. Many examples used in the upstream [Kubernetes.io][kubernetes] website are intended for use on Linux nodes. Best practices information such as around container security with the use of AppArmor and avoiding the use of privilege escalation aren't available for Windows. When you create deployments that use Windows pods, the following considerations at the OS-level apply:

- **Identity** - Linux uses userID (UID) and groupID (GID), represented as integer types. User and group names are not canonical - they are just an alias in */etc/groups* or */etc/passwd* back to UID+GID.
    - Windows uses a larger binary security identifier (SID) which is stored in the Windows Security Access Manager (SAM) database. This database is not shared between the host and containers, or between containers.
- **File permissions** - Windows uses an access control list based on SIDs, rather than a bitmask of permissions and UID+GID
- **File paths** - convention on Windows is to use \ instead of /.
    - In pod specs that mount volumes, specify the path correctly for Windows containers.

## Next steps

<!-- LINKS - external -->
[upstream-limitations]: https://kubernetes.io/docs/setup/windows/#limitations
[aks-github]: https://github.com/azure/aks/issues]
[kubernetes]: https://kubernetes.io

<!-- LINKS - internal -->
[azure-network-models]: concepts-network.md#azure-virtual-networks
[configure-azure-cni]: configure-azure-cni.md