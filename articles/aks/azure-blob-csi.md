---
title: Use Container Storage Interface (CSI) driver for Azure Blob storage on Azure Kubernetes Service (AKS)
description: Learn how to use the Container Storage Interface (CSI) driver for Azure Blob storage (preview) in an Azure Kubernetes Service (AKS) cluster.
services: container-service
ms.topic: article
ms.date: 05/23/2021
author: mgoedtel

---

# Use Azure Blob storage Container Storage Interface (CSI) driver (preview)

The Azure Blob storage Container Storage Interface (CSI) driver (preview) is a [CSI specification](https://github.com/container-storage-interface/spec/blob/master/spec.md)-compliant driver used by Azure Kubernetes Service (AKS) to manage the lifecycle of Azure Blob storage.

The CSI is a standard for exposing arbitrary block and file storage systems to containerized workloads on Kubernetes. By adopting and using CSI, AKS now can write, deploy, and iterate plug-ins to expose new or improve existing storage systems in Kubernetes without having to touch the core Kubernetes code and wait for its release cycles.

To create an AKS cluster with CSI driver support, see [Enable CSI drivers on AKS](csi-storage-drivers.md).

> [!NOTE]
> *In-tree driver* refers to the current storage driver that are part of the core Kubernetes code versus the new CSI driver, which is a plug-in.

## Azure Blob storage CSI driver (preview) new features

In addition to the in-tree driver features, Azure Blob storage CSI driver (preview) supports the following new features:

- BlobFuse and Network File System (NFS) version 3.0 protocol

Use a persistent volume with Azure Blob storage

A persistent volume (PV) represents a piece of storage that's provisioned for use with Kubernetes pods. A PV can be used by one or many pods and can be dynamically or statically provisioned. If multiple pods need concurrent access to the same storage volume, you can use Azure Blob storage to connect by using the NFS protocol. This article shows you how to dynamically create an Azure Blob storage container for use by multiple pods in an AKS cluster.

For more information on Kubernetes volumes, see [Storage options for applications](concepts-storage.md) in AKS.

## Storage class driver dynamic disk parameters

|Name | Description | Example | Mandatory | Default value|
|--- | --- | --- | --- | ---
|skuName | Specify an Azure storage account type (alias: `storageAccountType`) | `Standard_LRS`, `Premium_LRS`, `Standard_GRS`, `Standard_RAGRS` | No | `Standard_LRS`|
|location | Specify an Azure location | `eastus` | No | If empty, driver will use the same location name as current cluster.|
|resourceGroup | Specify an Azure resource group name | myResourceGroup | No | If empty, driver will use the same resource group name as current cluster.|
|storageAccount | Specify an Azure storage account name| STORAGE_ACCOUNT_NAME | - No for blobfuse mount </br> - Yes for NFSv3 mount |  - For blobfuse mount: if empty, driver will find a suitable storage account that matches `skuName` in the same resource group; if a storage account name is provided, storage account must exist. </br>  - For NFSv3 mount, storage account name must be provided.|
|protocol | Specify blobfuse mount or NFSv3 mount | `fuse`, `nfs` | No | `fuse`|
|containerName | Specify the existing container (directory) name | container | No | if empty, driver will create a new container name, starting with `pvc-fuse` for blobfuse or `pvc-nfs` for NFSv3
|containerNamePrefix | Specify Azure storage directory prefix created by driver | my |Can only contain lowercase letters, numbers, hyphens, and length should be less than 21 characters. | No |
|server | Specify Azure storage account server address | Existing server address, for example `accountname.privatelink.blob.core.windows.net`. | No | If empty, driver will use default `accountname.blob.core.windows.net` or other sovereign cloud account address.|
|allowBlobPublicAccess | Allow or disallow public access to all blobs or containers for storage account created by driver. | `true`,`false` | No | `false`|
|storageEndpointSuffix | Specify Azure storage endpoint suffix | `core.windows.net` | No | If empty, driver will use default storage endpoint suffix according to cloud environment.|
|tags | [tags](../azure-resource-manager/management/tag-resources.md) would be created in newly created storage account | Tag format: 'foo=aaa,bar=bbb' | No | ""|
|matchTags | Whether matching tags when driver tries to find a suitable storage account | `true`,`false` | No | `false`|
|--- | **Following parameters are only for blobfuse** | --- | --- |
|subscriptionID | Specify Azure subscription ID where blob storage directory will be created. | Azure subscription ID | No | If not empty, `resourceGroup` must be provided.|
|storeAccountKey | Specify store account key to Kubernetes secret <br><br> Note:  <br> `false` means driver leverages kubelet identity to get account key. | `true`,`false` | No | `true`|
|secretName | Specify secret name to store account key | | No |
|secretNamespace | Specify the namespace of secret to store account key | `default`,`kube-system`, etc | No | pvc namespace |
|isHnsEnabled | Enable `Hierarchical namespace` for Azure DataLake storage account | `true`,`false` | No | `false`|
|--- | **Following parameters are only for NFS protocol** | --- | --- |
|mountPermissions | Specify mounted folder permissions. The default is `0777`. If set to `0`, driver will not perform `chmod` after mount. | `0777` | No |

## Storage class for static disk parameters

|Name | Description | Example | Mandatory | Default value|
|--- | --- | --- | --- | ---|
|volumeAttributes.resourceGroup | Specify Azure resource group name | myResourceGroup | No | If empty, driver will use the same resource group name as current cluster.|
|volumeAttributes.storageAccount | Specify existing Azure storage account name | STORAGE_ACCOUNT_NAME | Yes |
|volumeAttributes.containerName | Specify existing container name | container | Yes ||
|volumeAttributes.protocol | Specify blobfuse mount or NFSv3 mount | `fuse`, `nfs` | No | `fuse`|
|--- | **Following parameters are only for blobfuse** | --- | --- |
|volumeAttributes.secretName | Secret name that stores storage account name and key (only applies for SMB) | No ||
|volumeAttributes.secretNamespace | Specify namespace of secret to store account key | `default` | No | Pvc namespace|
|nodeStageSecretRef.name | Specify secret name that stores (see examples below):<br>`azurestorageaccountkey`<br>`azurestorageaccountsastoken`<br>`msisecret`<br>`azurestoragespnclientsecret` | |Existing Kubernetes secret name |  No  ||
|nodeStageSecretRef.namespace | Specify the namespace of secret | k8s namespace  |  Yes  ||
|--- | **Following parameters are only for NFS protocol** | --- | --- |
|volumeAttributes.mountPermissions | Specify mounted folder permissions | `0777` | No ||
|--- | **Following parameters are only for NFS vnet setting** | --- | --- |
|vnetResourceGroup | Specify vnet resource group where virtual network is | myResourceGroup | No | If empty, driver will use the `vnetResourceGroup` value specified in the Azure cloud config file.|
|vnetName | Specify the virtual network name | aksVNet | No | If empty, driver will use the `vnetName` value specified in the Azure cloud config file.|
|subnetName | Specify the existing subnet name of the agent node | aksSubnet | No | Ef empty, driver will use the `subnetName` value in azure cloud config file
|--- | **Following parameters are only for feature: blobfuse [Managed Identity and Service Principal Name auth](https://github.com/Azure/azure-storage-fuse#environment-variables)** | --- | --- |
|volumeAttributes.AzureStorageAuthType | Specify the authentication type | `Key`, `SAS`, `MSI`, `SPN` | No | `Key`
|volumeAttributes.AzureStorageIdentityClientID | Specify the Identity Client ID |  | No ||
|volumeAttributes.AzureStorageIdentityObjectID | Specify the Identity Object ID |  | No ||
|volumeAttributes.AzureStorageIdentityResourceID | Specify the Identity Resource ID |  | No ||
|volumeAttributes.MSIEndpoint | Specify the MSI endpoint |  | No ||
|volumeAttributes.AzureStorageSPNClientID | Specify the Azure Service Principal Name (SPN) Client ID |  | No ||
|volumeAttributes.AzureStorageSPNTenantID | Specify the Azure SPN Tenant ID |  | No ||
|volumeAttributes.AzureStorageAADEndpoint | Specify the Azure Active Directory (AAD) Endpoint |  | No ||
|--- | **Following parameters are only for feature: blobfuse read account key or SAS token from key vault** | --- | --- |
|volumeAttributes.keyVaultURL | Specify Azure Key Vault DNS name | {vault-name}.vault.azure.net | No ||
|volumeAttributes.keyVaultSecretName | Specify Azure Key Vault secret name | Existing Azure Key Vault secret name | No ||
|volumeAttributes.keyVaultSecretVersion | Azure Key Vault secret version | existing version | No |If empty, driver will use "current version"|

## Dynamically create Azure Blob storage PVs by using the built-in storage classes

A storage class is used to define how an Azure Blob storage container is created. A storage account is automatically created in the node resource group for use with the storage class to hold the Azure Blob storage container. Choose one of the following Azure storage redundancy SKUs for skuName:

* **Standard_LRS**: Standard locally redundant storage
* **Premium_LRS**: Premium locally redundant storage
* **Standard_GRS**: Standard geo-redundant storage
* **Standard_RAGRS**: Standard read-access geo-redundant storage

To use these storage classes, create a PVC and respective pod that references and uses them. A PVC is used to automatically provision storage based on a storage class. A PVC can use one of the pre-created storage classes or a user-defined storage class to create an Azure Blob storage container for the desired SKU, size, and protocol to communicate with it. When you create a pod definition, the PVC is specified to request the desired storage.

The following example creates a PVC that uses the NFS protocol to mount a Blob storage container using the [kubectl create](kubectl-create) command:

```bash
kubectl create -f https://raw.githubusercontent.com/kubernetes-sigs/blob-csi-driver/master/deploy/example/storageclass-blob-nfs.yaml

storageclass.storage.k8s.io/blob-nfs created
```

The following example creates a PVC that uses blobfuse to mount a Blob storage container using the [kubectl create](kubectl-create) command:

```bash
kubectl create -f https://raw.githubusercontent.com/kubernetes-sigs/blob-csi-driver/master/deploy/example/storageclass-blobfuse.yaml

storageclass.storage.k8s.io/blobfuse created
```

## Create a custom storage class

The default storage classes suit the most common scenarios, but not all. For some cases, you might want to have your own storage class customized with your own parameters. For example, the following manifest configures mounting a Blob storage container using the NFS protocol. Use it to configure the *tags* parameter.

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

storageclass.storage.k8s.io/blob-nfs created
```

In the next example, the following manifest configures using blobfuse and mounts a Blob storage container. Use it to configure the *skuName* parameter.

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

storageclass.storage.k8s.io/blob-fuse created
```

## Resize a persistent volume

You can request a larger volume for a PVC. Edit the PVC object, and specify a larger size. This change triggers the expansion of the underlying volume that backs the PV.

This hasn't been tested yet by Vybava and team. THey will get back to me

## Next steps

- To learn how to use CSI driver for Azure disks, see [Use Azure disks with CSI driver](azure-disk-csi.md).
- To learn how to use CSI driver for Azure Files, see [Use Azure Files with CSI driver](azure-files-csi.md).
- For more about storage best practices, see [Best practices for storage and backups in Azure Kubernetes Service][operator-best-practices-storage].

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
[premium-storage]: ../virtual-machines/disks-types.md
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
[storage-class-concepts]: concepts-storage.md#storage-classes
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-feature-list]: /cli/azure/feature#az_feature_list
[az-provider-register]: /cli/azure/provider#az_provider_register
[node-resource-group]: faq.md#why-are-two-resource-groups-created-with-aks
[storage-skus]: ../storage/common/storage-redundancy.md
[use-tags]: use-tags.md
