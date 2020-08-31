---
title: Use Container Storage Interface (CSI) drivers for Azure Files on Azure Kubernetes Service (AKS)
description: Learn how to use the Container Storage Interface (CSI) drivers for Azure Files in an Azure Kubernetes Service (AKS) cluster.
services: container-service
ms.topic: article
ms.date: 08/27/2020
author: palma21

---

# Use the Azure Files Container Storage Interface drivers (CSI) in Azure Kubernetes Service (AKS) (preview)
The Azure Files CSI Driver is a [CSI Specification](https://github.com/container-storage-interface/spec/blob/master/spec.md) compliant driver used by AKS to manage the lifecycle of Azure Files Shares. 

To create an AKS cluster with CSI driver support, please see [Enable CSI drivers for Azure Disks and Azure Files on AKS](csi-storage-drivers.md).

## Create and use a persistent volume (PV) with Azure Files

A persistent volume represents a piece of storage that has been provisioned for use with Kubernetes pods. A persistent volume can be used by one or many pods, and can be dynamically or statically provisioned. If multiple pods need concurrent access to the same storage volume, you can use Azure Files to connect using the [Server Message Block (SMB) protocol][smb-overview]. This article shows you how to dynamically create an Azure Files share for use by multiple pods in an Azure Kubernetes Service (AKS) cluster. For static provisioning, please see [Manually create and use a volume with Azure Files share](azure-files-volume.md).

For more information on Kubernetes volumes, see [Storage options for applications in AKS][concepts-storage].

## Dynamically create Azure Files PVs using the built in storage classes



## Next steps

- To know how to use CSI driver for Azure files, see [Use Azure files with CSI drivers](azure-files-csi.md).
- For more about storage best practices, see [Best practices for storage and backups in Azure Kubernetes Service (AKS)][operator-best-practices-storage]


<!-- LINKS - external -->
[access-modes]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubernetes-storage-classes]: https://kubernetes.io/docs/concepts/storage/storage-classes/
[kubernetes-volumes]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/
[managed-disk-pricing-performance]: https://azure.microsoft.com/pricing/details/managed-disks/
[smb-overview]: /windows/desktop/FileIO/microsoft-smb-protocol-and-cifs-protocol-overview


<!-- LINKS - internal -->
[azure-disk-volume]: azure-disk-volume.md
[azure-files-pvc]: azure-files-dynamic-pv.md
[premium-storage]: ../virtual-machines/windows/disks-types.md
[az-disk-list]: /cli/azure/disk#az-disk-list
[az-snapshot-create]: /cli/azure/snapshot#az-snapshot-create
[az-disk-create]: /cli/azure/disk#az-disk-create
[az-disk-show]: /cli/azure/disk#az-disk-show
[aks-quickstart-cli]: kubernetes-walkthrough.md
[aks-quickstart-portal]: kubernetes-walkthrough-portal.md
[install-azure-cli]: /cli/azure/install-azure-cli
[operator-best-practices-storage]: operator-best-practices-storage.md
[concepts-storage]: concepts-storage.md
[storage-class-concepts]: concepts-storage.md#storage-classes
[az-extension-add]: /cli/azure/extension?view=azure-cli-latest#az-extension-add
[az-extension-update]: /cli/azure/extension?view=azure-cli-latest#az-extension-update
[az-feature-register]: /cli/azure/feature?view=azure-cli-latest#az-feature-register
[az-feature-list]: /cli/azure/feature?view=azure-cli-latest#az-feature-list
[az-provider-register]: /cli/azure/provider?view=azure-cli-latest#az-provider-register