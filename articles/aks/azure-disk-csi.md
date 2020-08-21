---
title: Use Container Storage Interface (CSI) drivers for Azure Disks on Azure Kubernetes Service (AKS)
description: Learn how to use the Container Storage Interface (CSI) drivers for Azure Disks in an Azure Kubernetes Service (AKS) cluster.
services: container-service
ms.topic: article
ms.date: 08/17/2020

---

# Use the Azure disk Container Storage Interface drivers in Azure Kubernetes Service (AKS) (preview)
The Azure Disk CSI Driver is a [CSI Specification](https://github.com/container-storage-interface/spec/blob/master/spec.md) compliant driver used by AKS to manage the lifecycle of Azure Disks. 

To create an AKS cluster with CSI driver support, please see [Enable CSI drivers for Azure disks and Azure files on AKS](csi-storage-drivers.md).

## Dynamically create and use CSI persistent volumes with Azure disks 

A persistent volume represents a piece of storage that has been provisioned for use with Kubernetes pods. A persistent volume can be used by one or many pods, and can be dynamically or statically provisioned. This article shows you how to dynamically create persistent volumes with Azure disks for use by a single pod in an Azure Kubernetes Service (AKS) cluster.

### Leverage the built in storage classes

A storage class is used to define how a unit of storage is dynamically created with a persistent volume. For more information on Kubernetes storage classes, see [Kubernetes Storage Classes][kubernetes-storage-classes]. 
In AKS, 4 initial built-in `StorageClasses` that leverage the CSI storage drivers are created with the cluster.

- *managed-csi* - This is the *default* storage class, it uses Azure StandardSSD storage to create a Managed Disk. The reclaim policy indicates that the underlying Azure Disk is deleted when the persistent volume that used it is deleted. It also allows for volume expansion.
- *managed-premium* - Uses Azure Premium storage to create Managed Disk. The reclaim policy again indicates that the underlying Azure Disk is deleted when the persistent volume that used it is deleted.
- *azurefile* - Uses Azure Standard storage to create an Azure File Share. The reclaim policy indicates that the underlying Azure File Share is deleted when the persistent volume that used it is deleted.
- *azurefile-premium* - Uses Azure Premium storage to create an Azure File Share. The reclaim policy indicates that the underlying Azure File Share is deleted when the persistent volume that used it is deleted.

To leverage these you just need to create a Persistent Volume Claim (PVC) and respective pod that references and leverages them. A persistent volume claim (PVC) is used to automatically provision storage based on a storage class. A PVC can use one of the pre-created storage classes or a user defined storage class to create an Azure managed disk for the desired SKU and size. When you create a pod definition, the persistent volume claim is specified to request the desired storage.

Create the pod and respective persistent volume claim with the [kubectl apply][kubectl-apply] command:

```console
$ kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/azuredisk-csi-driver/master/deploy/example/pvc-azuredisk-csi.yaml
$ kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/azuredisk-csi-driver/master/deploy/example/nginx-pod-azuredisk.yaml

persistentvolumeclaim/pvc-azuredisk created
pod/nginx-azuredisk created
```

You can easily validate the disk is mounted by running: 

```console
$ kubectl exec nginx-azuredisk -- ls /mnt/azuredisk

lost+found
outfile
```


### Create a custom Storage class


### Create a volume snapshot

### Clone Volumes


### Resize a Persistent Volume (PV)

### Windows Containers

Let's add a windows pool to the cluster we created previously


## Manually create and use a volume with Azure disks in Azure Kubernetes Service (AKS)




Now let's deploy a pod 

## Next steps

- To know how to use CSI driver for Azure disks, see [Use Azure disk with CSI drivers](azure-disk-csi.md).
- To know how to use CSI driver for Azure files, see [Use Azure files with CSI drivers](azure-files-csi.md).
- For more about storage best practices, see [Best practices for storage and backups in Azure Kubernetes Service (AKS)][operator-best-practices-storage]


<!-- LINKS - external -->
[access-modes]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubernetes-storage-classes]: https://kubernetes.io/docs/concepts/storage/storage-classes/
[kubernetes-volumes]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/
[managed-disk-pricing-performance]: https://azure.microsoft.com/pricing/details/managed-disks/

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