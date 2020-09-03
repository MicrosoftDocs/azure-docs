---
title: Enable Container Storage Interface (CSI) drivers on Azure Kubernetes Service (AKS)
description: Learn how to enable the Container Storage Interface (CSI) drivers for Azure Disk and Azure Files in an Azure Kubernetes Service (AKS) cluster.
services: container-service
ms.topic: article
ms.date: 08/27/2020
author: palma21

---

# Enable Container Storage Interface (CSI) drivers for Azure Disks and Azure Files on Azure Kubernetes Service (AKS) (preview)

The Container Storage Interface (CSI) is a standard for exposing arbitrary block and file storage systems to containerized workloads on Kubernetes. By adopting and using CSI, Azure Kubernetes Service (AKS) can write, deploy, and iterate plugins exposing new or improving existing storage systems in Kubernetes without having to touch the core Kubernetes code and waiting for its release cycles.

The CSI storage driver support on AKS allows you to natively leverage:
- [*Azure Disks*](azure-disk-csi.md) -  can be used to create a Kubernetes *DataDisk* resource. Disks can use Azure Premium storage, backed by high-performance SSDs, or Azure Standard storage, backed by regular HDDs or standard SSDs. For most production and development workloads, use Premium storage. Azure Disks are mounted as *ReadWriteOnce*, so are only available to a single pod. For storage volumes that can be accessed by multiple pods simultaneously, use Azure Files.
- [*Azure Files*](azure-files-csi.md) can be used to mount an SMB 3.0 share backed by an Azure Storage account to pods. Files let you share data across multiple nodes and pods. Files can use Azure Standard storage backed by regular HDDs, or Azure Premium storage, backed by high-performance SSDs.

> [!IMPORTANT]
> Starting in Kubernetes version 1.21, Kubernetes will use CSI drivers only and by default. These are the future of storage support in Kubernetes.
>
> *"In-tree drivers"* refers to the current storage drivers that are part of the core kubernetes code vs. the new CSI drivers which are plugins.

## Limitations

- This feature can only be set at cluster creation time.
- The minimum kubernetes minor version that supports CSI drivers is v1.17.
- During Preview, the default storage class will still be the [same in-tree storage class](concepts-storage.md#storage-classes). After this feature is generally available, the default storage class will be the `managed-csi` storage class and in-tree storage classes will be removed.
- During the first preview phase, only Azure CLI is supported.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

### Register the `EnableAzureDiskFileCSIDriver` preview feature

To create an AKS cluster that can leverage CSI drivers for Azure Disks and Azure Files, you must enable the `EnableAzureDiskFileCSIDriver` feature flag on your subscription.

Register the `EnableAzureDiskFileCSIDriver` feature flag using the [az feature register][az-feature-register] command as shown in the following example:

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "EnableAzureDiskFileCSIDriver"
```

It takes a few minutes for the status to show *Registered*. Verify the registration status using the [az feature list][az-feature-list] command:

```azurecli-interactive
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/EnableAzureDiskFileCSIDriver')].{Name:name,State:properties.state}"
```

When ready, refresh the registration of the *Microsoft.ContainerService* resource provider using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

### Install aks-preview CLI extension

To create an AKS cluster or a node pool that can use the CSI storage drivers, you need the latest *aks-preview* CLI extension. Install the *aks-preview* Azure CLI extension using the [az extension add][az-extension-add] command, or install any available updates using the [az extension update][az-extension-update] command:

```azurecli-interactive
# Install the aks-preview extension
az extension add --name aks-preview

# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview
``` 


## Create a new cluster that can use CSI Storage Drivers

Create a new cluster that can leverage CSI Storage Drivers for Azure disks and Azure Files by using the following CLI commands. Use the `--aks-custom-headers` flag to set the `EnableAzureDiskFileCSIDriver` feature.

Create an Azure resource group:

```azurecli-interactive
# Create an Azure resource group
az group create --name myResourceGroup --location canadacentral
```

Create the AKS cluster with support for CSI Storage drivers.

```azurecli-interactive
# Create an AKS-managed Azure AD cluster
az aks create -g MyResourceGroup -n MyManagedCluster --network-plugin azure -k 1.17.9 --aks-custom-headers EnableAzureDiskFileCSIDriver=true
```

If you want to create clusters in-tree storage drivers instead of CSI storage drivers, you can do so by omitting the custom `--aks-custom-headers` parameter.


Check how many Azure disk-based volumes you can attach to this node by running:

```console
$ kubectl get nodes
aks-nodepool1-25371499-vmss000000
aks-nodepool1-25371499-vmss000001
aks-nodepool1-25371499-vmss000002

$ echo $(kubectl get CSINode <NODE NAME> -o jsonpath="{.spec.drivers[1].allocatable.count}")
8
```

## Next steps

- Use the CSI drive for Azure disks, see [Use Azure disk with CSI drivers](azure-disk-csi.md).
- Use the CSI drive for Azure files, see [Use Azure files with CSI drivers](azure-files-csi.md).
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