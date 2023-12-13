---
title: Introduction to the Azure Linux Container Host for AKS
description: Learn about the Azure Linux Container Host to use the container-optimized OS in your AKS clusters.
author: htaubenfeld
ms.author: htaubenfeld
ms.service: microsoft-linux
ms.topic: overview
ms.date: 09/05/2023
---

# What is the Azure Linux Container Host for AKS?

The Azure Linux Container Host is an operating system image that's optimized for running container workloads on [Azure Kubernetes Service (AKS)](../../articles/aks/intro-kubernetes.md). Microsoft maintains the Azure Linux Container Host and based it on [CBL-Mariner][cbl-mariner], an open-source Linux distribution created by Microsoft.

The Azure Linux Container Host is lightweight, containing only the packages needed to run container workloads. It's hardened based on significant validation tests and internal usage and is compatible with Azure agents. It provides reliability and consistency from cloud to edge across AKS, AKS for Azure Stack HCI, and Azure Arc. You can deploy Azure Linux node pools in a new cluster, add Azure Linux node pools to your existing clusters, or migrate your existing nodes to Azure Linux nodes.

To learn more about Azure Linux, see the [Azure Linux GitHub repository](https://github.com/microsoft/CBL-Mariner).

## Azure Linux Container Host key benefits

The Azure Linux Container Host offers the following key benefits:

- **Small and lightweight**
  - The Azure Linux Container Host only includes the necessary set of packages needed to run container workloads. As a result, it consumes limited disk and memory resources.
  - Azure Linux has only 500 packages, and as a result takes up the least disk space by up to *5 GB* on AKS.
- **Secure supply chain**
  - The Linux and AKS teams at Microsoft build, sign, and validate the [Azure Linux Container Host packages][azure-linux-packages] from source, and host packages and sources in Microsoft-owned and secured platforms.
  - Each package update runs through a full set of unit tests and end-to-end testing on the existing image to prevent regressions. The extensive testing, in combination with the smaller package count, reduces the chances of disruptive updates to applications.
- **Secure by default**
  - The Azure Linux Container Host has an emphasis on security. It follows the secure-by-default principles, including using a hardened Linux kernel with Azure cloud optimizations and flags tuned for Azure. It also provides a reduced attack surface and eliminates patching and maintenance of unnecessary packages.
  - Microsoft monitors the CVE database and releases security patches monthly and critical updates within days if necessary.
  - Azure Linux passes all the [CIS Level 1 benchmarks][cis-benchmarks], making it the only Linux distribution on AKS that does so.
  - For more information on Azure Linux Container Host security principles, see the [AKS security concepts](../../articles/aks/concepts-security.md).
- **Maintains compatibility with existing workloads**
  - All existing and future AKS extensions, add-ons, and open-source projects on AKS support both Ubuntu and Azure Linux. This includes support for runtime components like Dapr, IaC tools like Terraform, and monitoring solutions like Dynatrace.
  - Azure Linux ships with containerd as its container runtime and the upstream Linux kernel, which enables existing containers based on Linux images (like Alpine) to work seamlessly on Azure Linux.

## Azure Linux Container Host supported GPU SKUs

The Azure Linux Container Host supports the following GPU SKUs:

- [NVIDIA V100][nvidia-v100]
- [NVIDIA T4][nvidia-t4]

> [!NOTE]
> Azure Linux doesn't support the NC A100 v4 series. All other VM SKUs that are available on AKS are available with Azure Linux.
>
> If there are any areas you would like to have priority, please file an issue in the [AKS GitHub repository](https://github.com/Azure/AKS/issues).

## Next steps

- Learn more about [Azure Linux Container Host core concepts](./concepts-core.md).
- Follow our tutorial to [Deploy, manage, and update applications](./tutorial-azure-linux-create-cluster.md).
- Get started by [Creating an Azure Linux Container Host for AKS cluster using Azure CLI](./quickstart-azure-cli.md).

<!-- LINKS - internal -->
[nvidia-v100]: ../virtual-machines/ncv3-series.md
[nvidia-t4]: ../virtual-machines/nct4-v3-series.md
[cis-benchmarks]: ../aks/cis-azure-linux.md

<!-- LINKS - external -->
[cbl-mariner]: https://github.com/microsoft/CBL-Mariner
[azure-linux-packages]: https://packages.microsoft.com/cbl-mariner/2.0/prod/
