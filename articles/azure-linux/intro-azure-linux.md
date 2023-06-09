---
title: Introduction to the Azure Linux Container Host for AKS
description: Learn about the Azure Linux Container Host to use the container-optimized OS in your AKS clusters.
author: htaubenfeld
ms.author: htaubenfeld
ms.service: microsoft-linux
ms.topic: overview
ms.date: 06/01/2023
---

# What is the Azure Linux Container Host for AKS?

The Azure Linux Container Host is an operating system image that's optimized for running container workloads on [Azure Kubernetes Service (AKS)](../../articles/aks/intro-kubernetes.md). It's maintained by Microsoft and based on Microsoft Azure Linux, an open-source Linux distribution created by Microsoft.

The Azure Linux Container Host is lightweight, containing only the packages needed to run container workloads. It's hardened based on significant validation tests and internal usage and is compatible with Azure agents. It provides reliability and consistency from cloud to edge across AKS, AKS for Azure Stack HCI, and Azure Arc. You can deploy Azure Linux node pools in a new cluster, add Azure Linux node pools to your existing clusters, or migrate your existing nodes to Azure Linux nodes.

To learn more about Azure Linux, see the [Azure Linux GitHub repository](https://github.com/microsoft/CBL-Mariner).

## Azure Linux Container Host key benefits

The Azure Linux Container Host offers the following key benefits:

- **Secure supply chain**: Microsoft builds, signs, and validates the Azure Linux Container Host packages from source, and hosts its packages and sources in Microsoft-owned and secured platforms.
- **Small and lightweight**: The Azure Linux Container Host only includes the necessary set of packages needed to run container workloads. As a result, it consumes limited disk and memory resources.
- **Secure by default**: The Azure Linux Container Host has an emphasis on security and follows the secure-by-default principles, including using a hardened Linux kernel with Azure cloud optimizations and flags tuned for Azure. It also provides a reduced attack surface and eliminates patching and maintenance of unnecessary packages. For more information on Azure Linux Container Host security principles, see the [AKS security concepts](../../articles/aks/concepts-security.md).
- **Extensively validated**: The AKS and Azure Linux teams run a suite of functional and performance regression tests with the Azure Linux Container Host before releasing to customers, which enables earlier issue detection and mitigation.​

> [!NOTE]
>
> For GPU workloads, Azure Linux doesn't support NC A100 v4 series. All other VM SKUs that are available on AKS are available with Azure Linux.
>
> If there are any areas you would like to have priority, please file an issue in the [AKS GitHub repository](https://github.com/Azure/AKS/issues).

## Next steps

- Learn more about [Azure Linux Container Host core concepts](./concepts-core.md).
- Follow our tutorial to [Deploy, manage, and update applications](./tutorial-azure-linux-create-cluster.md).
- Get started by [Creating an Azure Linux Container Host for AKS cluster using Azure CLI](./quickstart-azure-cli.md).
