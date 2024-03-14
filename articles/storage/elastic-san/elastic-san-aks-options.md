---
title: Use Azure Elastic SAN with Azure Kubernetes Service
description: Learn about the deployment options you have for using Azure Elastic SAN as the backing storage for Azure Kubernetes Service.
author: roygara
ms.service: azure-elastic-san-storage
ms.topic: conceptual
ms.date: 03/14/2024
ms.author: rogarana
---


# Use Azure Elastic SAN with Azure Kubernetes Service

There are two ways to use an Azure Elastic SAN as the backing storage for Azure Kubernetes Service (AKS). You can either use [Azure Container Storage](../container-storage/container-storage-introduction.md#why-azure-container-storage-is-useful) Preview, or use the open source Kubernetes iSCSI CSI driver.

## Kubernetes iSCSI CSI driver

If you use the [Kubernetes iSCSI CSI driver](elastic-san-connect-aks.md), you can connect an existing AKS cluster to Elastic SAN over iSCSI. Since you're manually managing this Elastic SAN, it can also be used for other workloads alongside AKS. However, if you use this configuration, Microsoft won't provide support for any issues stemming from the driver itself, since it's open source. Dynamic provisioning isn't currently supported with this configuration, and only `ReadwriteOnce` access mode is supported.

## Azure Container Storage Preview

Azure Container Storage Preview is an Azure native solution that allows you to use Elastic SAN with AKS. When using Azure Container Storage, you programmatically manage and deploy storage. When you use Azure Container Storage like this, the system deploys a SAN exclusively for use AKS. That SAN can't be used for any other workloads and snapshots of the SAN is not currently supported with this configuration.

## Next steps

- [Use Azure Container Storage Preview with Azure Elastic SAN](../container-storage/use-container-storage-with-elastic-san.md)
- [Connect Azure Elastic SAN volumes to an Azure Kubernetes Service cluster](elastic-san-connect-aks.md)