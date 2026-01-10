---
title: Options for using Azure Elastic SAN with Azure Kubernetes Service
description: Learn about the deployment options you have for using Azure Elastic SAN as the backing storage for Azure Kubernetes Service.
author: roygara
ms.service: azure-elastic-san-storage
ms.topic: concept-article
ms.date: 01/08/2026
ms.author: rogarana
# Customer intent: As a Kubernetes administrator, I want to choose between Azure Container Storage and the iSCSI CSI driver for deploying Azure Elastic SAN with AKS, so that I can optimize storage management based on my workload requirements and support options.
---


# Overview - Options for using Azure Elastic SAN with Azure Kubernetes Service

Azure Elastic SAN provides backing storage for Azure Kubernetes Service (AKS) through two deployment options. You can either use [Azure Container Storage](../container-storage/container-storage-introduction.md#why-azure-container-storage-is-useful) Preview, or use the open source Kubernetes iSCSI CSI driver. This article covers the high level differences to help you select the right approach.

## Kubernetes iSCSI CSI driver

If you use the [Kubernetes iSCSI CSI driver](elastic-san-connect-aks.md), you can connect an existing AKS cluster to Elastic SAN over iSCSI. Since you're manually managing this Elastic SAN, you can also use it for other workloads alongside AKS. However, if you use this configuration, Microsoft doesn't provide support for any issues stemming from the driver itself, since it's open source. Dynamic provisioning isn't currently supported with this configuration, and only `ReadwriteOnce` access mode is supported.

## Azure Container Storage Preview

Azure Container Storage Preview is a cloud-based volume management, deployment, and orchestration service built natively for containers. For new or existing AKS clusters, you can install Azure Container Storage as an extension. After you install it as an extension, you can programmatically manage and deploy storage, including Elastic SANs, through the Kubernetes control plane. In this case, Azure Container Storage deploys a SAN exclusively for use with your AKS cluster. You can't use that SAN for any other workloads and volume snapshots of that SAN's volumes isn't currently supported with this configuration.

## Next steps

- [Connect Azure Elastic SAN volumes to an Azure Kubernetes Service cluster](elastic-san-connect-aks.md)
- [Use Azure Container Storage Preview with Azure Elastic SAN](../container-storage/use-container-storage-with-elastic-san.md)