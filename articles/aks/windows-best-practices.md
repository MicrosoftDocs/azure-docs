---
title: Best practices for Windows containers on Azure Kubernetes Service (AKS)
description: Learn about best practices for running Windows containers in Azure Kubernetes Service (AKS).
ms.service: azure-kubernetes-service
ms.author: schaffererin
ms.topic: article
ms.date: 10/10/2023
---

# Best practices for Windows containers on Azure Kubernetes Service (AKS)

In AKS, you can create node pools that run Linux or Windows Server as the operating system (OS) on the nodes. Windows Server nodes can run native Windows container applications, such as .NET Framework. The Linux OS and Windows OS have different container support and configuration considerations. For more information, see [Windows container considerations in Kubernetes][windows-vs-linux].

This article outlines best practices for running Windows containers on AKS.

## Create an AKS cluster with Linux and Windows node pools

When you create a new AKS cluster, the Azure platform creates a Linux node pool by default. This node pool contains system services needed for the cluster to function. Azure also creates and manages a control plane abstracted from the user, which means you aren't exposed to the underlying OS of the nodes hosting the main control plane components. We recommend that you run at least *two nodes* on the default Linux node pool to ensure the reliability and performance of your cluster. You can't delete the default Linux node pool unless you delete the entire cluster.

There are some cases where you should consider deploying a Linux node pool when planning to run Windows-based workloads on your AKS cluster, such as:

* If you want to run Linux and Windows workloads, you can deploy a Linux node pool and a Windows node pool in the same cluster.
* If you want to deploy infrastructure-related components based on Linux, such as NGINX, you need a Linux node pool alongside your Windows node pool. You can use control plane nodes for development and testing scenarios. For production workloads, we recommend that you deploy separate Linux node pools to ensure reliability and performance.

## Modernize existing applications with Windows on AKS

You may want to containerize existing applications and run them using Windows on AKS. Before starting the containerization process, it's important to understand the application architecture and dependencies. For more information, see [Containerize existing applications using Windows containers](/virtualization/windowscontainers/quick-start/lift-shift-to-containers).

## Windows OS version

> **Best practice guidance**
>
> Windows Server 2022 provides the latest security and performance improvements and is the recommended OS for Windows node pools on AKS.

AKS uses Windows Server 2019 and Windows Server 2022 as the host OS versions and only supports process isolation. AKS doesn't support container images built by other versions of Windows Server. For more information, see [Windows container version compatibility](/virtualization/windowscontainers/deploy-containers/version-compatibility).

Windows Server 2022 is the default OS for Kubernetes version 1.25 and later. Windows Server 2019 will retire after Kubernetes version 1.32 reaches end of life (EOL) and won't be supported in future releases. For more information, see the [AKS release notes][aks-release-notes].

## Networking

### Networking modes

> **Best practice guidance**
>
> AKS clusters with Windows node pools only support Azure Container Networking Interface (Azure CNI) and use it by default.

Windows doesn't support kubenet networking. AKS clusters with Windows node pools must use Azure CNI. For more information, see [Network concepts for applications in AKS][network-concepts-for-aks-applications].

Azure CNI offers two networking modes based on your workload requirements:

* [**Azure CNI Overlay**][azure-cni-overlay] is an overlay network similar to kubenet. The overlay network allows you to use virtual network (VNet) IPs for nodes and private address spaces for pods within those nodes that you can reuse across the cluster. Azure CNI Overlay is the **recommended networking mode**. It provides simplified network configuration and management and the best scalability in AKS networking.
* [**Azure CNI with Dynamic IP Allocation**][azure-cni-dynamic-ip-allocation] requires extra planning and consideration for IP address management. This mode provides VNet IPs for nodes *and* pods. This configuration allows you direct access to pod IPs. However, it comes with increased complexity and reduced scalability.

To help you decide which networking mode to use, see [Choosing a network model][azure-cni-choose-network-model].

### Network policies

> **Best practice guidance**
>
> Use network policies to secure traffic between pods. Windows supports Azure Network Policy Manager and Calico Network Policy. For more information, see [Differences between Azure Network Policy Manager and Calico Network Policy][azurenpm-vs-calico].

When managing traffic between pods, you should apply the principle of least privilege. The Network Policy feature in Kubernetes allows you to define and enforce ingress and egress traffic rules between the pods in your cluster. For more information, see [Secure traffic between pods using network policies in AKS][network-policies-aks].

Windows pods on AKS clusters that use the Calico Network Policy enable [Floating IP][dsr] by default.

## Upgrades and updates

It's important to keep your Windows environment up-to-date to ensure your systems have the latest security updates, feature sets, and compliance requirements. In a Kubernetes environment like AKS, you need to maintain the Kubernetes version, Windows nodes, and Windows container images and pods.

### Kubernetes version upgrades

As a managed Kubernetes service, AKS provides the necessary tools to upgrade your cluster to the latest Kubernetes version. For more information, see [Upgrade an AKS cluster][upgrade-aks-cluster].

### Windows node monthly updates

Windows nodes on AKS follow a monthly update schedule. Every month, AKS creates a new VHD with the latest available updates for Windows node pools. The VHD includes the host image, latest Nano Server image, latest Server Core image, and containerd. We recommend performing monthly updates to your Windows node pools to ensure your nodes have the latest security patches. For more information, see [Upgrade AKS node images][upgrade-aks-node-images].

> [!NOTE]
> Upgrades on Windows systems include both OS version upgrades and monthly node OS updates.

You can stay up to date with the availability of new monthly releases using the [AKS release tracker][aks-release-tracker] and [AKS release notes][aks-release-notes].

### Windows node OS version upgrades

Windows has a release cadence for new versions of the OS, including Windows Server 2019 and Windows Server 2022. When upgrading your Windows node OS version, ensure the Windows container image version matches the Windows container host version and the node pools have only one version of Windows Server.

To upgrade the Windows node OS version, you need to complete the following steps:

1. Create a new node pool with the new Windows Server version.
2. Deploy your workloads with the new Windows container images to the new node pool.
3. Decommission the old node pool.

For more information, see [Upgrade Windows Server workloads on AKS][upgrade-windows-workloads-aks].

> [!NOTE]
> Windows announced a new [Windows Server Annual Channel for Containers](https://techcommunity.microsoft.com/t5/windows-server-news-and-best/windows-server-annual-channel-for-containers/ba-p/3866248) that supports portability and mixed versions of Windows nodes and containers. This feature isn't yet supported in AKS.

## Next steps

To learn more about Windows containers on AKS, see the following resources:

* [Learn how to deploy, manage, and monitor Windows containers on AKS](/training/paths/deploy-manage-monitor-wincontainers-aks).
* Open an issue or provide feedback in the [Windows containers GitHub repository](https://github.com/microsoft/Windows-Containers/issues).
* Review the [third-party partner solutions for Windows on AKS][windows-on-aks-partner-solutions].

<!-- LINKS - internal -->
[azure-cni-overlay]: ./azure-cni-overlay.md
[azure-cni-dynamic-ip-allocation]: ./configure-azure-cni-dynamic-ip-allocation.md
[azure-cni-choose-network-model]: ./azure-cni-overlay.md#choosing-a-network-model-to-use
[network-concepts-for-aks-applications]: ./concepts-network.md
[windows-vs-linux]: ./windows-vs-linux-containers.md
[azurenpm-vs-calico]: ./use-network-policies.md#differences-between-azure-network-policy-manager-and-calico-network-policy-and-their-capabilities
[network-policies-aks]: ./use-network-policies.md
[dsr]: ../load-balancer/load-balancer-multivip-overview.md#rule-type-2-backend-port-reuse-by-using-floating-ip
[upgrade-aks-cluster]: ./upgrade-cluster.md
[upgrade-aks-node-images]: ./node-image-upgrade.md
[upgrade-windows-workloads-aks]: ./upgrade-windows-2019-2022.md
[windows-on-aks-partner-solutions]: ./windows-aks-partner-solutions.md

<!-- LINKS - external -->
[aks-release-notes]: https://github.com/Azure/AKS/releases
[aks-release-tracker]: https://releases.aks.azure.com/
