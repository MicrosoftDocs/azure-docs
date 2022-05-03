---
title: Enable Container Storage Interface (CSI) drivers on Azure Kubernetes Service (AKS)
description: Learn how to enable the Container Storage Interface (CSI) drivers for Azure disks and Azure Files in an Azure Kubernetes Service (AKS) cluster.
services: container-service
ms.topic: article
ms.date: 03/11/2022
author: palma21

---

# Enable Container Storage Interface (CSI) drivers for Azure disks and Azure Files on Azure Kubernetes Service (AKS)

The Container Storage Interface (CSI) is a standard for exposing arbitrary block and file storage systems to containerized workloads on Kubernetes. By adopting and using CSI, Azure Kubernetes Service (AKS) can write, deploy, and iterate plug-ins to expose new or improve existing storage systems in Kubernetes without having to touch the core Kubernetes code and wait for its release cycles.

The CSI storage driver support on AKS allows you to natively use:
- [*Azure disks*](azure-disk-csi.md), which can be used to create a Kubernetes *DataDisk* resource. Disks can use Azure Premium Storage, backed by high-performance SSDs, or Azure Standard Storage, backed by regular HDDs or Standard SSDs. For most production and development workloads, use Premium Storage. Azure disks are mounted as *ReadWriteOnce*, so are only available to a single pod. For storage volumes that can be accessed by multiple pods simultaneously, use Azure Files.
- [*Azure Files*](azure-files-csi.md), which can be used to mount an SMB 3.0/3.1 share backed by an Azure Storage account to pods. With Azure Files, you can share data across multiple nodes and pods. Azure Files can use Azure Standard Storage backed by regular HDDs or Azure Premium Storage backed by high-performance SSDs.

> [!IMPORTANT]
> Starting in Kubernetes version 1.21, AKS will use CSI drivers only and by default. CSI migration is also turned on starting from AKS 1.21, existing in-tree persistent volumes continue to function as they always have; however, behind the scenes Kubernetes hands control of all storage management operations (previously targeting in-tree drivers) to CSI drivers.
> 
> Please remove manual installed open source Azure Disk and Azure File CSI drivers before upgrading to AKS 1.21.
> 
> *In-tree drivers* refers to the current storage drivers that are part of the core Kubernetes code versus the new CSI drivers, which are plug-ins.

## Install CSI storage drivers on a new cluster with version < 1.21

Create a new cluster that can use CSI storage drivers for Azure disks and Azure Files by using the following CLI commands. Use the `--aks-custom-headers` flag to set the `EnableAzureDiskFileCSIDriver` feature.

Create an Azure resource group:

```azurecli-interactive
# Create an Azure resource group
az group create --name myResourceGroup --location canadacentral
```

Create the AKS cluster with support for CSI storage drivers:

```azurecli-interactive
# Create an AKS-managed Azure AD cluster
az aks create -g MyResourceGroup -n MyManagedCluster --network-plugin azure  --aks-custom-headers EnableAzureDiskFileCSIDriver=true
```

If you want to create clusters in tree storage drivers instead of CSI storage drivers, you can do so by omitting the custom `--aks-custom-headers` parameter. Starting in Kubernetes version 1.21, Kubernetes will use CSI drivers only and by default.


Check how many Azure disk-based volumes you can attach to this node by running:

```console
$ kubectl get nodes
aks-nodepool1-25371499-vmss000000
aks-nodepool1-25371499-vmss000001
aks-nodepool1-25371499-vmss000002

$ echo $(kubectl get CSINode <NODE NAME> -o jsonpath="{.spec.drivers[1].allocatable.count}")
8
```

## Install CSI storage drivers on an existing cluster with version < 1.21
 - [Set up Azure Disk CSI driver on AKS cluster](https://github.com/kubernetes-sigs/azuredisk-csi-driver/blob/master/docs/install-driver-on-aks.md)
 - [Set up Azure File CSI driver on AKS cluster](https://github.com/kubernetes-sigs/azurefile-csi-driver/blob/master/docs/install-driver-on-aks.md)

## Migrating custom in-tree storage classes to CSI
If you have created in-tree driver storage classes, those storage classes will continue to work since CSI migration is turned on after upgrading your cluster to 1.21.x, while if you want to use CSI features (snapshotting etc.) you will need to carry out the migration.

Migration of these storage classes will involve deleting the existing storage classes, and re-creating them with the provisioner set to **disk.csi.azure.com** if using Azure Disks, and **files.csi.azure.com** if using Azure Files.  

### Migrating Storage Class provisioner

As an example for Azure disks:

#### Original In-tree storage class definition

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

## Migrating in-tree persistent volumes

> [!IMPORTANT]
> If your in-tree Persistent Volume reclaimPolicy is set to Delete you will need to change the Persistent Volume to Retain to persist your data.  This can be achieved via a [patch operation on the PV](https://kubernetes.io/docs/tasks/administer-cluster/change-pv-reclaim-policy/). For example:
> ```console
> $ kubectl patch pv pv-azuredisk --type merge --patch '{"spec": {"persistentVolumeReclaimPolicy": "Retain"}}'
> ```

### Migrating in-tree Azure Disk persistent volumes

If you have in-tree Azure Disk persistent volumes, get `diskURI` from in-tree persistent volumes and then follow this [guide][azure-disk-static-mount] to set up CSI driver persistent volumes

### Migrating in-tree Azure File persistent volumes

If you have in-tree Azure File persistent volumes, get `secretName`, `shareName` from in-tree persistent volumes and then follow this [guide][azure-file-static-mount] to set up CSI driver persistent volumes

## Next steps

- To use the CSI drive for Azure disks, see [Use Azure disks with CSI drivers](azure-disk-csi.md).
- To use the CSI drive for Azure Files, see [Use Azure Files with CSI drivers](azure-files-csi.md).
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
[azure-disk-static-mount]: azure-disk-volume.md#mount-disk-as-volume
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
