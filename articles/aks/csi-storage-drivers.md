---
title: Container Storage Interface (CSI) drivers in Azure Kubernetes Service (AKS)
description: Learn how to enable the Container Storage Interface (CSI) drivers for Azure disks and Azure Files in an Azure Kubernetes Service (AKS) cluster.
services: container-service
ms.topic: article
ms.date: 05/23/2022
author: palma21

---

# Container Storage Interface (CSI) drivers in Azure Kubernetes Service (AKS)

The Container Storage Interface (CSI) is a standard for exposing arbitrary block and file storage systems to containerized workloads on Kubernetes. By adopting and using CSI, Azure Kubernetes Service (AKS) can write, deploy, and iterate plug-ins to expose new or improve existing storage systems in Kubernetes without having to touch the core Kubernetes code and wait for its release cycles.

The CSI storage driver support on AKS allows you to natively use:

- [**Azure disks**](azure-disk-csi.md) can be used to create a Kubernetes *DataDisk* resource. Disks can use Azure Premium Storage, backed by high-performance SSDs, or Azure Standard Storage, backed by regular HDDs or Standard SSDs. For most production and development workloads, use Premium Storage. Azure disks are mounted as *ReadWriteOnce* and are only available to a single pod. For storage volumes that can be accessed by multiple pods simultaneously, use Azure Files.
- [**Azure Files**](azure-files-csi.md) can be used to mount an SMB 3.0/3.1 share backed by an Azure storage account to pods. With Azure Files, you can share data across multiple nodes and pods. Azure Files can use Azure Standard storage backed by regular HDDs or Azure Premium storage backed by high-performance SSDs.

> [!IMPORTANT]
> Starting with Kubernetes version 1.21, AKS only uses CSI drivers by default and CSI migration is enabled. Existing in-tree persistent volumes will continue to function. However, internally Kubernetes hands control of all storage management operations (previously targeting in-tree drivers) to CSI drivers.
>
> *In-tree drivers* refers to the current storage drivers that are part of the core Kubernetes code opposed to the new CSI drivers, which are plug-ins.

> [!NOTE]
> Azure disk CSI driver v2 (preview) improves scalability and reduces pod failover latency. It uses shared disks to provision attachment replicas on multiple cluster nodes and integrates with the pod scheduler to ensure a node with an attachment replica is chosen on pod failover. Azure disk CSI driver v2 (preview) also provides the ability to fine tune performance. If you're interested in participating in the preview, submit a request: [https://aka.ms/DiskCSIv2Preview](https://aka.ms/DiskCSIv2Preview).

## Migrate custom in-tree storage classes to CSI

If you created in-tree driver storage classes, those storage classes continue to work since CSI migration is turned on after upgrading your cluster to 1.21.x. If you want to use CSI features you'll need to perform the migration.

Migrating these storage classes involves deleting the existing ones, and re-creating them with the provisioner set to **disk.csi.azure.com** if using Azure disk storage, and **files.csi.azure.com** if using Azure Files.  

### Migrate storage class provisioner

The following example YAML manifest shows the difference between the in-tree storage class definition configured to use Azure disks, and the equivalent using a CSI storage class definition. The CSI storage system supports the same features as the in-tree drivers, so the only change needed would be the value for `provisioner`.

#### Original in-tree storage class definition

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: custom-managed-premium
provisioner: kubernetes.io/azure-disk
reclaimPolicy: Delete
parameters:
  storageAccountType: Premium_LRS
```

#### CSI storage class definition

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: custom-managed-premium
provisioner: disk.csi.azure.com
reclaimPolicy: Delete
parameters:
  storageAccountType: Premium_LRS
```

## Migrate in-tree persistent volumes

> [!IMPORTANT]
> If your in-tree persistent volume `reclaimPolicy` is set to **Delete**, you need to change its policy to **Retain** to persist your data. This can be achieved using a [patch operation on the PV](https://kubernetes.io/docs/tasks/administer-cluster/change-pv-reclaim-policy/). For example:
>
> ```console
> $ kubectl patch pv pv-azuredisk --type merge --patch '{"spec": {"persistentVolumeReclaimPolicy": "Retain"}}'
> ```

### Migrate in-tree Azure disk persistent volumes

If you have in-tree Azure disk persistent volumes, get `diskURI` from in-tree persistent volumes and then follow this [guide][azure-disk-static-mount] to set up CSI driver persistent volumes.

### Migrate in-tree Azure File persistent volumes

If you have in-tree Azure File persistent volumes, get `secretName`, `shareName` from in-tree persistent volumes and then follow this [guide][azure-file-static-mount] to set up CSI driver persistent volumes.

## Next steps

- To use the CSI driver for Azure disks, see [Use Azure disks with CSI drivers](azure-disk-csi.md).
- To use the CSI driver for Azure Files, see [Use Azure Files with CSI drivers](azure-files-csi.md).
- For more about storage best practices, see [Best practices for storage and backups in Azure Kubernetes Service][operator-best-practices-storage].
- For more information on CSI migration, see [Kubernetes In-Tree to CSI Volume Migration][csi-migration-community].

<!-- LINKS - external -->
[access-modes]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes
[csi-migration-community]: https://kubernetes.io/blog/2019/12/09/kubernetes-1-17-feature-csi-migration-beta
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubernetes-storage-classes]: https://kubernetes.io/docs/concepts/storage/storage-classes/
[kubernetes-volumes]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/
[managed-disk-pricing-performance]: https://azure.microsoft.com/pricing/details/managed-disks/

<!-- LINKS - internal -->
[azure-disk-volume]: azure-disk-volume.md
[azure-disk-static-mount]: azure-disk-volume.md#mount-disk-as-a-volume
[azure-file-static-mount]: azure-files-volume.md#mount-file-share-as-a-persistent-volume
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
