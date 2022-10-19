---
title: Container Storage Interface (CSI) drivers on Azure Kubernetes Service (AKS)
description: Learn about and deploy the Container Storage Interface (CSI) drivers for Azure Disks and Azure Files in an Azure Kubernetes Service (AKS) cluster
services: container-service
ms.topic: article
ms.date: 09/18/2022
author: palma21

---

# Container Storage Interface (CSI) drivers on Azure Kubernetes Service (AKS)

The Container Storage Interface (CSI) is a standard for exposing arbitrary block and file storage systems to containerized workloads on Kubernetes. By adopting and using CSI, Azure Kubernetes Service (AKS) can write, deploy, and iterate plug-ins to expose new or improve existing storage systems in Kubernetes without having to touch the core Kubernetes code and wait for its release cycles.

The CSI storage driver support on AKS allows you to natively use:

- [**Azure Disks**](azure-disk-csi.md) can be used to create a Kubernetes *DataDisk* resource. Disks can use Azure Premium Storage, backed by high-performance SSDs, or Azure Standard Storage, backed by regular HDDs or Standard SSDs. For most production and development workloads, use Premium Storage. Azure Disks are mounted as *ReadWriteOnce* and are only available to one node in AKS. For storage volumes that can be accessed by multiple pods simultaneously, use Azure Files.
- [**Azure Files**](azure-files-csi.md) can be used to mount an SMB 3.0/3.1 share backed by an Azure storage account to pods. With Azure Files, you can share data across multiple nodes and pods. Azure Files can use Azure Standard storage backed by regular HDDs or Azure Premium storage backed by high-performance SSDs.
- [**Azure Blob storage**](azure-blob-csi.md) can be used to mount Blob storage (or object storage) as a file system into a container or pod. Using Blob storage enables your cluster to support  applications that work with large unstructured datasets like log file data, images or documents, HPC, and others. Additionally, if you ingest data into [Azure Data Lake storage](../storage/blobs/data-lake-storage-introduction.md), you can directly mount and use it in AKS without configuring another interim filesystem.

> [!IMPORTANT]
> Starting with Kubernetes version 1.21, AKS only uses CSI drivers by default and CSI migration is enabled. Existing in-tree persistent volumes will continue to function. However, internally Kubernetes hands control of all storage management operations (previously targeting in-tree drivers) to CSI drivers.
>
> *In-tree drivers* refers to the storage drivers that are part of the core Kubernetes code opposed to the CSI drivers, which are plug-ins.

> [!NOTE]
> Azure Disks CSI driver v2 (preview) improves scalability and reduces pod failover latency. It uses shared disks to provision attachment replicas on multiple cluster nodes and integrates with the pod scheduler to ensure a node with an attachment replica is chosen on pod failover. Azure Disks CSI driver v2 (preview) also provides the ability to fine tune performance. If you're interested in participating in the preview, submit a request: [https://aka.ms/DiskCSIv2Preview](https://aka.ms/DiskCSIv2Preview). This preview version is provided without a service level agreement, and you can occasionally expect breaking changes while in preview. The preview version isn't recommended for production workloads. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

You need the Azure CLI version 2.40 installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

## Disable CSI storage drivers on a new cluster

`--disable-disk-driver` allows you to disable the [Azure Disks CSI driver][azure-disk-csi]. `--disable-file-driver` allows you to disable the [Azure Files CSI driver][azure-files-csi]. `--disable-snapshot-controller` allows you to disable the [snapshot controller][snapshot-controller ].

To disable CSI storage drivers on a new cluster, use `--disable-disk-driver`, `--disable-file-driver`, and `--disable-snapshot-controller`.

```azurecli
az aks create -n myAKSCluster -g myResourceGroup --disable-disk-driver --disable-file-driver --disable-snapshot-controller 
```

## Disable CSI storage drivers on an existing cluster

To disable CSI storage drivers on an existing cluster, use `--disable-disk-driver`, `--disable-file-driver`, and `--disable-snapshot-controller`.

```azurecli
az aks update -n myAKSCluster -g myResourceGroup --disable-disk-driver --disable-file-driver --disable-snapshot-controller 
```

## Enable CSI storage drivers on an existing cluster

`--enable-disk-driver` allows you enable the [Azure Disks CSI driver][azure-disk-csi]. `--enable-file-driver` allows you to enable the [Azure Files CSI driver][azure-files-csi]. `--enable-snapshot-controller` allows you to enable the [snapshot controller][snapshot-controller].

To enable CSI storage drivers on an existing cluster with CSI storage drivers disabled, use `--enable-disk-driver`, `--enable-file-driver`, and `--enable-snapshot-controller`.

```azurecli
az aks update -n myAKSCluster -g myResourceGroup --enable-disk-driver --enable-file-driver --enable-snapshot-controller
```

## Migrate custom in-tree storage classes to CSI

If you've created in-tree driver storage classes, those storage classes continue to work since CSI migration is turned on after upgrading your cluster to 1.21.x. If you want to use CSI features you'll need to perform the migration.

Migrating these storage classes involves deleting the existing ones, and re-creating them with the provisioner set to **disk.csi.azure.com** if using Azure Disks, and **files.csi.azure.com** if using Azure Files.

### Migrate storage class provisioner

The following example YAML manifest shows the difference between the in-tree storage class definition configured to use Azure Disks, and the equivalent using a CSI storage class definition. The CSI storage system supports the same features as the in-tree drivers, so the only change needed would be the value for `provisioner`.

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

The CSI storage system supports the same features as the In-tree drivers, so the only change needed would be the provisioner.

## Migrate in-tree persistent volumes

> [!IMPORTANT]
> If your in-tree persistent volume `reclaimPolicy` is set to **Delete**, you need to change its policy to **Retain** to persist your data. This can be achieved using a [patch operation on the PV](https://kubernetes.io/docs/tasks/administer-cluster/change-pv-reclaim-policy/). For example:
>
> ```bash
> kubectl patch pv pv-azuredisk --type merge --patch '{"spec": {"persistentVolumeReclaimPolicy": "Retain"}}'
> ```

### Migrate in-tree Azure Disks persistent volumes

If you have in-tree Azure Disks persistent volumes, get `diskURI` from in-tree persistent volumes and then follow this [guide][azure-disk-static-mount] to set up CSI driver persistent volumes.

### Migrate in-tree Azure File persistent volumes

If you have in-tree Azure File persistent volumes, get `secretName`, `shareName` from in-tree persistent volumes and then follow this [guide][azure-file-static-mount] to set up CSI driver persistent volumes

## Next steps

- To use the CSI driver for Azure Disks, see [Use Azure Disks with CSI drivers](azure-disk-csi.md).
- To use the CSI driver for Azure Files, see [Use Azure Files with CSI drivers](azure-files-csi.md).
- To use the CSI driver for Azure Blob storage, see [Use Azure Blob  storage with CSI drivers](azure-blob-csi.md)
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
[azure-disk-csi]: https://github.com/kubernetes-sigs/azuredisk-csi-driver
[azure-files-csi]: https://github.com/kubernetes-sigs/azurefile-csi-driver
[snapshot-controller]: https://kubernetes-csi.github.io/docs/snapshot-controller.html

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
[install-azure-cli]: ../cli/azure/install-azure-cli
