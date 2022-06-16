---
title: Use Container Storage Interface (CSI) driver for Azure Blob storage on Azure Kubernetes Service (AKS)
description: Learn how to use the Container Storage Interface (CSI) driver for Azure Blob storage (preview) in an Azure Kubernetes Service (AKS) cluster.
services: container-service
ms.topic: article
ms.date: 06/16/2021
author: mgoedtel

---

# Use Azure Blob storage Container Storage Interface (CSI) driver (preview)

The Azure Blob storage Container Storage Interface (CSI) driver (preview) is a [CSI specification][csi-specification]-compliant driver used by Azure Kubernetes Service (AKS) to manage the lifecycle of Azure Blob storage. The CSI is a standard for exposing arbitrary block and file storage systems to containerized workloads on Kubernetes.

By adopting and using CSI, AKS now can write, deploy, and iterate plug-ins to expose new or improve existing storage systems in Kubernetes. Using CSI drivers in AKS avoids having to touch the core Kubernetes code and wait for its release cycles.

Mounting Azure Blob storage as a file system into a container or pod, enables you to use blob storage with a number of applications that work massive amounts of unstructured data. For example:

* Log file data
* Images, documents, and streaming video or audio
* Disaster recovery data

Additionally, if your AKS cluster ingests data into Azure Data Lake Storage, it can directly mount it and use it in an AKS cluster without configuring another interim filesystem. The data on the object storage can be accessed by applications using BlobFuse or Network File System (NFS) 3.0 protocol. Before the introduction of the Azure Blob storage CSI driver, the only option was to manually install an unsupported open-source driver to access Blob storage from your application running on AKS.

To create an AKS cluster with CSI drivers support, see [CSI drivers on AKS][csi-drivers-aks]. To learn more about the differences in access between each of the Azure storage types using the NFS protocol, see [Compare access to Azure Files, Blob Storage, and Azure NetApp Files with NFS][compare-access-with-nfs].

## Azure Blob storage CSI driver (preview) features

Azure Blob storage CSI driver (preview) supports the following features:

- BlobFuse and Network File System (NFS) version 3.0 protocol

## Use a persistent volume with Azure Blob storage

A [persistent volume][persistent-volume] (PV) represents a piece of storage that's provisioned for use with Kubernetes pods. A PV can be used by one or many pods and can be dynamically or statically provisioned. If multiple pods need concurrent access to the same storage volume, you can use Azure Blob storage to connect by using the Network File System (NFS) or blobfuse. This article shows you how to dynamically create an Azure Blob storage container for use by multiple pods in an AKS cluster.

For more information on Kubernetes volumes, see [Storage options for applications in AKS][concepts-storage].

## Dynamically create Azure Blob storage PVs by using the built-in storage classes

A storage class is used to define how an Azure Blob storage container is created. A storage account is automatically created in the node resource group for use with the storage class to hold the Azure Blob storage container. Choose one of the following Azure storage redundancy SKUs for skuName:

* **Standard_LRS**: Standard locally redundant storage
* **Premium_LRS**: Premium locally redundant storage
* **Standard_GRS**: Standard geo-redundant storage
* **Standard_RAGRS**: Standard read-access geo-redundant storage

When you use storage CSI drivers on AKS, there are two additional built-in StorageClasses that use the Azure Blob CSI storage driver (preview).

The reclaim policy on both storage classes ensures that the underlying Azure Blob storage is deleted when the respective PV is deleted. The storage classes also configure the container to be expandable, you just need to edit the persistent volume claim (PVC) with the new size.

To use these storage classes, create a PVC and respective pod that references and uses them. A PVC is used to automatically provision storage based on a storage class. A PVC can use one of the pre-created storage classes or a user-defined storage class to create an Azure Blob storage container for the desired SKU, size, and protocol to communicate with it. When you create a pod definition, the PVC is specified to request the desired storage.

The following example creates a PVC that uses the NFS protocol to mount a Blob storage container using the [kubectl create][kubectl-create] command:

```bash
kubectl create -f https://raw.githubusercontent.com/kubernetes-sigs/blob-csi-driver/master/deploy/example/storageclass-blob-nfs.yaml
```

The output of the command resembles the following example:

```bash
storageclass.storage.k8s.io/blob-nfs created
```

The following example creates a PVC that uses blobfuse to mount a Blob storage container using the [kubectl create][kubectl-create] command:

```bash
kubectl create -f https://raw.githubusercontent.com/kubernetes-sigs/blob-csi-driver/master/deploy/example/storageclass-blobfuse.yaml
```

The output of the command resembles the following example:

```bash
storageclass.storage.k8s.io/blobfuse created
```

## Create a custom storage class

The default storage classes suit the most common scenarios, but not all. For some cases, you might want to have your own storage class customized with your own parameters. To demonstrate two examples are shown, one based on using the NFS protocol, and the other using blobfuse.

In this example, the following manifest configures mounting a Blob storage container using the NFS protocol. Use it to add the *tags* parameter.

Create a file named azure-blob-nfs-sc.yaml, and paste the following example manifest:

```yml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: blob-nfs
provisioner: blob.csi.azure.com
parameters:
  protocol: nfs
  tags: environment=Development
volumeBindingMode: Immediate
mountOptions:
  - nconnect=8  # only supported on linux kernel version >= 5.3
```

Create the storage class with the [kubectl apply][kubectl-apply] command:

```bash
kubectl apply -f azure-blob-nfs-sc.yaml
```

The output of the command resembles the following example:

```bash
storageclass.storage.k8s.io/blob-nfs created
```

In this example, the following manifest configures using blobfuse and mount a Blob storage container. Use it to update the *skuName* parameter.

Create a file named azure-blobfuse-sc.yaml, and paste the following example manifest:

```yml
---
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: blob-fuse
provisioner: blob.csi.azure.com
parameters:
  skuName: Standard_GRS  # available values: Standard_LRS, Premium_LRS, Standard_GRS, Standard_RAGRS
reclaimPolicy: Delete
volumeBindingMode: Immediate
allowVolumeExpansion: true
mountOptions:
  - -o allow_other
  - --file-cache-timeout-in-seconds=120
  - --use-attr-cache=true
  - --cancel-list-on-mount-seconds=10  # prevent billing charges on mounting
  - -o attr_timeout=120
  - -o entry_timeout=120
  - -o negative_timeout=120
  - --log-level=LOG_WARNING  # LOG_WARNING, LOG_INFO, LOG_DEBUG
  - --cache-size-mb=1000  # Default will be 80% of available memory, eviction will happen beyond that.
```

Create the storage class with the [kubectl apply][kubectl-apply] command:

```bash
kubectl apply -f azure-blobfuse-sc.yaml
```

The output of the command resembles the following example:

```bash
storageclass.storage.k8s.io/blob-fuse created
```

## Next steps

- To learn how to manually setup a static persistent volume, see [Create and use a volume with Azure Blob storage][azure-csi-blob-storage-static].
- To learn how to dynamically setup a persistent volume, see [Create and use a dynamic persistent volume with Azure Blob storage][azure-csi-blob-storage-dynamic].
- To learn how to use CSI driver for Azure Disks, see [Use Azure Disks with CSI driver](azure-disk-csi.md).
- To learn how to use CSI driver for Azure Files, see [Use Azure Files with CSI driver](azure-files-csi.md).
- For more about storage best practices, see [Best practices for storage and backups in Azure Kubernetes Service][operator-best-practices-storage].

<!-- LINKS - external -->
[access-modes]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-create]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#create
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubernetes-storage-classes]: https://kubernetes.io/docs/concepts/storage/storage-classes/
[kubernetes-volumes]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/
[managed-disk-pricing-performance]: https://azure.microsoft.com/pricing/details/managed-disks/
[csi-specification]: https://github.com/container-storage-interface/spec/blob/master/spec.md

<!-- LINKS - internal -->
[azure-disk-volume]: azure-disk-volume.md
[azure-files-pvc]: azure-files-dynamic-pv.md
[premium-storage]: ../virtual-machines/disks-types.md
[compare-access-with-nfs]: ../storage/common/nfs-comparison.md
[az-disk-list]: /cli/azure/disk#az_disk_list
[az-snapshot-create]: /cli/azure/snapshot#az_snapshot_create
[az-disk-create]: /cli/azure/disk#az_disk_create
[az-disk-show]: /cli/azure/disk#az_disk_show
[aks-quickstart-cli]: ./learn/quick-kubernetes-deploy-cli.md
[aks-quickstart-portal]: ./learn/quick-kubernetes-deploy-portal.md
[aks-quickstart-powershell]: ./learn/quick-kubernetes-deploy-powershell.md
[install-azure-cli]: /cli/azure/install-azure-cli
[operator-best-practices-storage]: operator-best-practices-storage.md
[concepts-storage]: concepts-storage.md
[persistent-volume]: concepts-storage.md#persistent-volumes
[csi-drivers-aks]: csi-storage-drivers.md
[storage-class-concepts]: concepts-storage.md#storage-classes
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-feature-list]: /cli/azure/feature#az_feature_list
[az-provider-register]: /cli/azure/provider#az_provider_register
[node-resource-group]: faq.md#why-are-two-resource-groups-created-with-aks
[storage-skus]: ../storage/common/storage-redundancy.md
[use-tags]: use-tags.md
[az-tags]: ../azure-resource-manager/management/tag-resources.md
[azure-csi-blob-storage-dynamic]: azure-csi-blob-storage-dynamic.md
[azure-csi-blob-storage-static]: azure-csi-blob-storage-manual.md
