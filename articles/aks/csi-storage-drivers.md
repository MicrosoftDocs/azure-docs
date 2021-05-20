---
title: Enable Container Storage Interface (CSI) drivers on Azure Kubernetes Service (AKS)
description: Learn how to enable the Container Storage Interface (CSI) drivers for Azure disks and Azure Files in an Azure Kubernetes Service (AKS) cluster.
services: container-service
ms.topic: article
ms.date: 08/27/2020
author: palma21

---

# Enable Container Storage Interface (CSI) drivers for Azure disks and Azure Files on Azure Kubernetes Service (AKS) (preview)

The Container Storage Interface (CSI) is a standard for exposing arbitrary block and file storage systems to containerized workloads on Kubernetes. By adopting and using CSI, Azure Kubernetes Service (AKS) can write, deploy, and iterate plug-ins to expose new or improve existing storage systems in Kubernetes without having to touch the core Kubernetes code and wait for its release cycles.

The CSI storage driver support on AKS allows you to natively use:
- [*Azure disks*](azure-disk-csi.md), which can be used to create a Kubernetes *DataDisk* resource. Disks can use Azure Premium Storage, backed by high-performance SSDs, or Azure Standard Storage, backed by regular HDDs or Standard SSDs. For most production and development workloads, use Premium Storage. Azure disks are mounted as *ReadWriteOnce*, so are only available to a single pod. For storage volumes that can be accessed by multiple pods simultaneously, use Azure Files.
- [*Azure Files*](azure-files-csi.md), which can be used to mount an SMB 3.0 share backed by an Azure Storage account to pods. With Azure Files, you can share data across multiple nodes and pods. Azure Files can use Azure Standard Storage backed by regular HDDs or Azure Premium Storage backed by high-performance SSDs.

> [!IMPORTANT]
> Starting in Kubernetes version 1.21, Kubernetes will use CSI drivers only and by default. These drivers are the future of storage support in Kubernetes.
>
> *In-tree drivers* refers to the current storage drivers that are part of the core Kubernetes code versus the new CSI drivers, which are plug-ins.

## Limitations

- This feature can only be set at cluster creation time.
- The minimum Kubernetes minor version that supports CSI drivers is v1.17.
- During the preview, the default storage class will still be the [same in-tree storage class](concepts-storage.md#storage-classes). After this feature is generally available, the default storage class will be the `managed-csi` storage class and in-tree storage classes will be removed.
- During the first preview phase, only Azure CLI is supported.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

### Register the `EnableAzureDiskFileCSIDriver` preview feature

To create an AKS cluster that can use CSI drivers for Azure disks and Azure Files, you must enable the `EnableAzureDiskFileCSIDriver` feature flag on your subscription.

Register the `EnableAzureDiskFileCSIDriver` feature flag by using the [az feature register][az-feature-register] command, as shown in the following example:

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "EnableAzureDiskFileCSIDriver"
```

It takes a few minutes for the status to show *Registered*. Verify the registration status by using the [az feature list][az-feature-list] command:

```azurecli-interactive
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/EnableAzureDiskFileCSIDriver')].{Name:name,State:properties.state}"
```

When ready, refresh the registration of the *Microsoft.ContainerService* resource provider by using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

### Install aks-preview CLI extension

To create an AKS cluster or a node pool that can use the CSI storage drivers, you need the latest *aks-preview* Azure CLI extension. Install the *aks-preview* Azure CLI extension by using the [az extension add][az-extension-add] command. Or install any available updates by using the [az extension update][az-extension-update] command.

```azurecli-interactive
# Install the aks-preview extension
az extension add --name aks-preview

# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview
``` 


## Create a new cluster that can use CSI storage drivers

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

If you want to create clusters in tree storage drivers instead of CSI storage drivers, you can do so by omitting the custom `--aks-custom-headers` parameter.


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

- To use the CSI drive for Azure disks, see [Use Azure disks with CSI drivers](azure-disk-csi.md).
- To use the CSI drive for Azure Files, see [Use Azure Files with CSI drivers](azure-files-csi.md).
- For more about storage best practices, see [Best practices for storage and backups in Azure Kubernetes Service][operator-best-practices-storage].

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