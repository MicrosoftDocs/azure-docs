---
title: Windows container limitations in Kubernetes
titleSuffix: Azure Kubernetes Service
description: See the Windows container limitations in Kubernetes.
ms.topic: article
ms.date: 05/18/2023
ms.author: schaffererin
author: schaffererin

---

# Windows container limitations in Kubernetes

Windows Server node pool support includes some limitations that are part of the upstream Windows Server in Kubernetes. These limitations aren't specific to Azure Kubernetes Service (AKS). For more information on the upstream support from Kubernetes, see [Supported functionality and limitations][upstream-limitations].

Historically, Kubernetes is Linux-focused. Many examples used in the upstream [Kubernetes.io][kubernetes] website are intended for use on Linux nodes. When you create deployments that use Windows Server containers in AKS, you must use a Windows Server host operating system (OS) version with process isolation.

> [!NOTE]
> For Kubernetes versions 1.25 and higher, Windows Server 2022 is the default OS. Windows Server 2019 is being retired after Kubernetes version 1.32 reaches end-of-life (EOL) and won't be supported in future releases. For more information, see the [AKS release notes][aks-release-notes].

This article covers the limitations to keep in mind when using Windows containers instead of Linux containers in Kubernetes. For an in-depth comparison of Windows and Linux containers, see [Comparison with Linux][comparison-with-linux].

## Limitations

| Feature | Windows container limitations |
|-----------|:-----------|
| [Cluster creation][cluster-configuration] | • The first system node pool *must* be Linux.<br/> • The AKS cluster can have a maximum of 10 node pools.<br/> • The AKS cluster can have a maximum of 100 nodes in each node pool.<br/> • The Windows Server node pool name has a limit of six characters. |
| [Privileged containers][privileged-containers] | Not supported. The equivalent is **HPC containers**. |
| [HPC containers][hpc-containers] | • [HostProcess is GA for Kubernetes 1.26 or higher][aks-release-notes].<br/> • HostProcess containers require `containerd` 1.6 or higher container runtime.<br/> • HostProcess pods can only contain HostProcess containers. This is a current limitation of the Windows OS. Nonprivileged Windows containers can't share a vNIC with the host IP namespace.<br/> • HostProcess containers run as a process on the host. The only isolation those containers have from the host is the resource constraints imposed on the HostProcess user account.<br/> • Filesystem isolation and Hyper-V isolation aren't supported for HostProcess containers.<br/> • Volume mounts are supported and are mounted under the container volume. See [Volume mounts][volume-mounts].<br/> • A limited set of host user accounts are available for Host Process containers by default. See [Choosing a user account][choose-user-account].<br/> • Resource limits such as disk, memory, and CPU count, work the same way as fashion as processes on the host.<br/> • Named pipe mounts and Unix domain sockets aren't directly supported, but can be accessed on their host path, for example `\\.\pipe\*`. |
| [Azure Network Policy Manager (Azure NPM)][azure-network-policy] | Azure NPM doesn't support:<br/> • Named ports<br/> • SCTP protocol<br/> • Negative match labels or namespace selectors (all labels except "debug=true")<br/> • "except" CIDR blocks (a CIDR with exceptions)<br/> • Windows Server 2019<br/> |
| [Kubenet][kubenet] | Not supported. |
| [Kubenet dual-stack][kubenet-dual-stack] | Not supported. |
| [Node upgrade][node-upgrade] | Windows Server nodes in AKS don't automatically apply Windows updates. Instead, you perform a node pool upgrade or [node image upgrade][node-image-upgrade]. These upgrade deploy new nodes with the latest Window Server 2019 and Windows Server 2022 base node image and security patches. |
| [CNI Overlay][cni-overlay] | Supported on Windows Server 2022 (preview). |
| [CNI by Cilium][cni-by-cilium] | Not supported. |
| [HTTP-proxy][http-proxy] | Not supported. |
| [TerminationGracePeriod][termination-grace-period] | Supported only with `containerd`. |
| [Huge Pages][huge-pages] | Not supported. |
| [OOMKill][oomkill] | • Not available. Kubelet doesn't take OOM eviction actions.<br/> • Windows always treats all user-mode memory allocations as virtual, and pagefiles are mandatory.<br/> • Windows nodes don't over-commit memory for processes. The net effect is that Windows don't reach out of memory conditions the same way Linux does, and processes page to disk instead of being subject to out of memory (OOM) termination. |
| [CPU management][cpu-management] | Windows can limit the amount of CPU time allocated for different processes but can't guarantee a minimum amount of CPU time. |
| [DNS][dns] | • `ClusterFirstWithHostNet` isn't supported for pods that run on Windows nodes. Windows treats all names with a `.` as an FQDN and skips FQDN resolution.<br/> • On Windows, there are multiple DNS resolvers that can be used. The resolvers come with slightly different behaviors, so we recommend using the `Resolve-DNSName` PowerShell cmdlet for name query resolutions.<br/> • On Linux, you have a DNS suffix list, which is used after resolution of a name as fully qualified has failed.<br/> • On Windows, you can only have one DNS suffix, which is the DNS suffix associated with that pod's namespace (example: `mydns.svc.cluster.local`).<br/> • Windows can resolve FQDNs, services, or network names, which can be resolved with this single suffix. For example, a pod spawned in the default namespace has the DNS suffix `default.svc.cluster.local`. Inside a Windows pod, you can resolve both `kubernetes.default.svc.cluster.local` and `kubernetes`, but not the partially qualified names (`kubernetes.default` or `kubernetes.default.svc`). |
| [AKS Image Cleaner][aks-image-cleaner] | Not supported. |
| [BYOCNI][byo-cni] | Not supported. |
| [Open Service Mesh][open-service-mesh] | Not supported. |
| [GPU][gpu] | Not supported. |
| [Multi-instance GPU][multi-instance-gpu] | Not supported. |
| [Generation 2 VMs][gen-2-vms] | Not supported. |
| [Custom node config][custom-node-config] | Not supported. |
| [Custom kubelet parameters][custom-kubelet-parameters] | Not supported. |

## Next steps

For more information on Windows containers, see the [Windows Server containers FAQ][windows-server-containers-faq].

<!-- LINKS - external -->
[kubernetes]: https://kubernetes.io
[upstream-limitations]: https://kubernetes.io/docs/setup/production-environment/windows/intro-windows-in-kubernetes/#supported-functionality-and-limitations
[aks-release-notes]: https://github.com/Azure/AKS/releases
[comparison-with-linux]: https://kubernetes.io/docs/concepts/windows/intro/#compatibility-linux-similarities
[volume-mounts]: https://kubernetes.io/docs/tasks/configure-pod-container/create-hostprocess-pod/#volume-mounts
[choose-user-account]: https://kubernetes.io/docs/tasks/configure-pod-container/create-hostprocess-pod/#choosing-a-user-account
[termination-grace-period]: https://kubernetes.io/docs/concepts/windows/intro/#limitations
[huge-pages]: https://kubernetes.io/docs/tasks/manage-hugepages/scheduling-hugepages/
[oomkill]: https://kubernetes.io/docs/concepts/configuration/windows-resource-management/#resource-management-memory
[cpu-management]: https://kubernetes.io/docs/concepts/configuration/windows-resource-management/#resource-management-cpu
[dns]: https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/#dns-windows

<!-- LINKS - internal -->
[cluster-configuration]: ../aks/learn/quick-windows-container-deploy-cli.md#limitations
[privileged-containers]: use-windows-hpc.md#limitations
[hpc-containers]: use-windows-hpc.md#limitations
[calico]: use-network-policies.md#limitations
[kubenet]: configure-kubenet.md#limitations--considerations-for-kubenet
[kubenet-dual-stack]: configure-kubenet-dual-stack.md#limitations
[node-upgrade]: configure-azure-cni.md#plan-ip-addressing-for-your-cluster
[cni-overlay]: azure-cni-overlay.md#limitations-with-azure-cni-overlay
[cni-by-cilium]: azure-cni-powered-by-cilium.md#limitations
[http-proxy]: http-proxy.md#limitations-and-other-details
[aks-image-cleaner]: image-cleaner.md#limitations
[windows-server-containers-faq]: windows-faq.md
[azure-network-policy]: use-network-policies.md#overview-of-network-policy
[node-image-upgrade]: architecture/operator-guides/aks/aks-upgrade-practices#node-image-upgrades
[byo-cni]: use-byo-cni.md
[open-service-mesh]: open-service-mesh-about.md
[gpu]: gpu-cluster.md
[multi-instance-gpu]: gpu-multi-instance.md
[gen-2-vms]: cluster-configuration.md#generation-2-virtual-machines
[custom-node-config]: custom-node-configuration.md
[custom-kubelet-parameters]: custom-node-configuration.md#kubelet-custom-configuration
