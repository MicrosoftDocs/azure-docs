---
title: Use Container Storage Interface (CSI) driver for Azure NetApp Files on Azure Kubernetes Service (AKS)
description: Learn how to use the Container Storage Interface (CSI) drivers for Azure NetApp Files in an Azure Kubernetes Service (AKS) cluster.
services: container-service
ms.topic: article
ms.date: 05/13/2021
author: balaramesh

---

# Use Azure NetApp Files Container Storage Interface (CSI) driver in Azure Kubernetes Service (AKS) with Astra Trident

A production-ready CSI driver for Kubernetes users to directly consume Azure NetApp Files volumes through AKS is highly recommended. This is achieved using [Astra Trident](https://netapp.io/persistent-storage-provisioner-for-kubernetes/), an open-source dynamic storage orchestrator for Kubernetes. It is an enterprise-grade storage orchestrator purpose-built for Kubernetes, **fully supported** by NetApp. It simplifies access to storage across Kubernetes environments by automating storage provisioning. Consumers can take advantage of Astra Trident's CSI driver for Azure NetApp Files to abstract underlying details and create/expand/snapshot volumes on-demand.

To understand how you can install Astra Trident and provision Azure NetApp Files volumes using the CSI driver, please refer to [Dynamically create and use a persistent volume with Azure NetApp Files in Azure Kubernetes Service (AKS)][azure-netapp-files-dynamic]. The article walks you through all the steps involved in deploying Astra Trident and provisioning Azure NetApp Files volumes using the `azure-netapp-files` CSI storage driver.

## Next steps

- For more information on Azure NetApp Files, see [What is Azure NetApp Files][anf].
- You can also learn more about Astra Trident and how Azure NetApp Files can be configured to work with it from the detailed [Backend Configuration Guide](https://netapp-trident.readthedocs.io/en/latest/kubernetes/operations/tasks/backends/anf.html).
- If you would rather like to create Azure NetApp Files volumes statically, see [Manually create and use a volume with Azure NetApp Files in Azure Kubernetes Service (AKS)][azure-netapp-files]

<!-- LINKS - external -->
[access-modes]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubernetes-storage-classes]: https://kubernetes.io/docs/concepts/storage/storage-classes/
[kubernetes-volumes]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/
[managed-disk-pricing-performance]: https://azure.microsoft.com/pricing/details/managed-disks/
[smb-overview]: /windows/desktop/FileIO/microsoft-smb-protocol-and-cifs-protocol-overview

<!-- LINKS - internal -->
[anf]: ../azure-netapp-files/azure-netapp-files-introduction.md
[azure-disk-volume]: azure-disk-volume.md
[azure-netapp-files]: azure-netapp-files.md
[azure-netapp-files-dynamic]: azure-netapp-files-dynamic.md
[azure-files-pvc]: azure-files-dynamic-pv.md
[premium-storage]: ../virtual-machines/disks-types.md
[az-disk-list]: /cli/azure/disk#az_disk_list
[az-snapshot-create]: /cli/azure/snapshot#az_snapshot_create
[az-disk-create]: /cli/azure/disk#az_disk_create
[az-disk-show]: /cli/azure/disk#az_disk_show
[aks-quickstart-cli]: kubernetes-walkthrough.md
[aks-quickstart-portal]: kubernetes-walkthrough-portal.md
[install-azure-cli]: /cli/azure/install-azure-cli
[operator-best-practices-storage]: operator-best-practices-storage.md
[concepts-storage]: concepts-storage.md
[storage-class-concepts]: concepts-storage.md#storage-classes
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-feature-list]: /cli/azure/feature#az_feature_list
[az-provider-register]: /cli/azure/provider#az_provider_register
[node-resource-group]: faq.md#why-are-two-resource-groups-created-with-aks
[storage-skus]: ../storage/common/storage-redundancy.md
