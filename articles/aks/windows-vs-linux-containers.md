---
title: Windows container considerations in Kubernetes
titleSuffix: Azure Kubernetes Service
description: See the Windows container considerations in Kubernetes.
ms.topic: article
ms.date: 10/05/2023
ms.author: schaffererin
author: schaffererin

---

# Windows container considerations in Kubernetes

When you create deployments that use Windows Server containers on Azure Kubernetes Service (AKS), there are a few differences relative to Linux deployments you should keep in mind. For a detailed comparison of the differences between Windows and Linux in upstream Kubernetes, please see [Windows containers in Kubernetes](https://kubernetes.io/docs/concepts/windows/intro/).

Some of the major differences include:

- **Identity**: Windows Server uses a larger binary security identifier (SID) that's stored in the Windows Security Access Manager (SAM) database. This database isn't shared between the host and containers or between containers.
- **File permissions**: Windows Server uses an access control list based on SIDs rather than a bitmask of permissions and UID+GID.
- **File paths**: The convention on Windows Server is to use \ instead of /. In pod specs that mount volumes, specify the path correctly for Windows Server containers. For example, rather than a mount point of */mnt/volume* in a Linux container, specify a drive letter and location such as */K/Volume* to mount as the *K:* drive.

> [!NOTE]
> For Kubernetes versions 1.25 and higher, Windows Server 2022 is the default OS. Windows Server 2019 is being retired after Kubernetes version 1.32 reaches end-of-life (EOL) and won't be supported in future releases. For more information, see the [AKS release notes][aks-release-notes].

This article covers important considerations to keep in mind when using Windows containers instead of Linux containers in Kubernetes. For an in-depth comparison of Windows and Linux containers, see [Comparison with Linux][comparison-with-linux].

## Considerations

| Feature | Windows considerations |
|-----------|:-----------|
| [Cluster creation][cluster-configuration] | • The first system node pool *must* be Linux.<br/> • AKS Windows clusters have a maximum limit of 10 node pools.<br/> • AKS Windows clusters have a maximum limit of 100 nodes in each node pool.<br/> • The Windows Server node pool name has a limit of six characters. |
| [Privileged containers][privileged-containers] | Not supported. The equivalent is **HostProcess Containers (HPC) containers**. |
| [HPC containers][hpc-containers] | • HostProcess containers are the Windows alternative to Linux privileged containers. For more information, see [Create a Windows HostProcess pod](https://kubernetes.io/docs/tasks/configure-pod-container/create-hostprocess-pod/). |
| [Azure Network Policy Manager (Azure NPM)][azure-network-policy] | Azure NPM doesn't support:<br/> • Named ports<br/> • SCTP protocol<br/> • Negative match labels or namespace selectors (all labels except "debug=true")<br/> • "except" CIDR blocks (a CIDR with exceptions)<br/> • Windows Server 2019<br/> |
| [Node upgrade][node-upgrade] | Windows Server nodes on AKS don't automatically apply Windows updates. Instead, you perform a node pool upgrade or [node image upgrade][node-image-upgrade]. These upgrade deploy new nodes with the latest Window Server 2019 and Windows Server 2022 base node image and security patches. |
| [AKS Image Cleaner][aks-image-cleaner] | Not supported. |
| [BYOCNI][byo-cni] | Not supported. |
| [Open Service Mesh][open-service-mesh] | Not supported. |
| [GPU][gpu] | Not supported. |
| [Multi-instance GPU][multi-instance-gpu] | Not supported. |
| [Generation 2 VMs (preview)][gen-2-vms] | Supported in preview. |
| [Custom node config][custom-node-config] | • Custom node config has two configurations:<br/> • [kubelet][custom-kubelet-parameters]: Supported in preview.<br/> • OS config: Not supported. |

## Next steps

For more information on Windows containers, see the [Windows Server containers FAQ][windows-server-containers-faq].

<!-- LINKS - external -->
[aks-release-notes]: https://github.com/Azure/AKS/releases
[comparison-with-linux]: https://kubernetes.io/docs/concepts/windows/intro/#compatibility-linux-similarities

<!-- LINKS - internal -->
[cluster-configuration]: ../aks/learn/quick-windows-container-deploy-cli.md#limitations
[privileged-containers]: use-windows-hpc.md#limitations
[hpc-containers]: use-windows-hpc.md#limitations
[node-upgrade]: ./manage-node-pools.md#upgrade-a-single-node-pool
[aks-image-cleaner]: image-cleaner.md#limitations
[windows-server-containers-faq]: windows-faq.md
[azure-network-policy]: use-network-policies.md#overview-of-network-policy
[node-image-upgrade]: node-image-upgrade.md
[byo-cni]: use-byo-cni.md
[open-service-mesh]: open-service-mesh-about.md
[gpu]: gpu-cluster.md
[multi-instance-gpu]: gpu-multi-instance.md
[gen-2-vms]: cluster-configuration.md#generation-2-virtual-machines
[custom-node-config]: custom-node-configuration.md
[custom-kubelet-parameters]: custom-node-configuration.md#kubelet-custom-configuration
