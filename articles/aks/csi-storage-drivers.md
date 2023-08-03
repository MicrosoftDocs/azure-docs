---
title: Container Storage Interface (CSI) drivers on Azure Kubernetes Service (AKS)
description: Learn about and deploy the Container Storage Interface (CSI) drivers for Azure Disks and Azure Files in an Azure Kubernetes Service (AKS) cluster
ms.topic: article
ms.date: 05/31/2023

---

# Container Storage Interface (CSI) drivers on Azure Kubernetes Service (AKS)

The Container Storage Interface (CSI) is a standard for exposing arbitrary block and file storage systems to containerized workloads on Kubernetes. By adopting and using CSI, Azure Kubernetes Service (AKS) can write, deploy, and iterate plug-ins to expose new or improve existing storage systems in Kubernetes without having to touch the core Kubernetes code and wait for its release cycles.

The CSI storage driver support on AKS allows you to natively use:

- [**Azure Disks**](azure-disk-csi.md) can be used to create a Kubernetes *DataDisk* resource. Disks can use Azure Premium Storage, backed by high-performance SSDs, or Azure Standard Storage, backed by regular HDDs or Standard SSDs. For most production and development workloads, use Premium Storage. Azure Disks are mounted as *ReadWriteOnce* and are only available to one node in AKS. For storage volumes that can be accessed by multiple nodes simultaneously, use Azure Files.
- [**Azure Files**](azure-files-csi.md) can be used to mount an SMB 3.0/3.1 share backed by an Azure storage account to pods. With Azure Files, you can share data across multiple nodes and pods. Azure Files can use Azure Standard storage backed by regular HDDs or Azure Premium storage backed by high-performance SSDs.
- [**Azure Blob storage**](azure-blob-csi.md) can be used to mount Blob storage (or object storage) as a file system into a container or pod. Using Blob storage enables your cluster to support  applications that work with large unstructured datasets like log file data, images or documents, HPC, and others. Additionally, if you ingest data into [Azure Data Lake storage](../storage/blobs/data-lake-storage-introduction.md), you can directly mount and use it in AKS without configuring another interim filesystem.

> [!IMPORTANT]
> Starting with Kubernetes version 1.26, in-tree persistent volume types *kubernetes.io/azure-disk* and *kubernetes.io/azure-file* are deprecated and will no longer be supported. Removing these drivers following their deprecation is not planned, however you should migrate to the corresponding CSI drivers *disks.csi.azure.com* and *file.csi.azure.com*. To review the migration options for your storage classes and upgrade your cluster to use Azure Disks and Azure Files CSI drivers, see [Migrate from in-tree to CSI drivers][migrate-from-in-tree-csi-drivers].
>
> *In-tree drivers* refers to the storage drivers that are part of the core Kubernetes code opposed to the CSI drivers, which are plug-ins.

> [!NOTE]
> It is recommended to delete the corresponding PersistentVolumeClaim object instead of the PersistentVolume object when deleting a CSI volume. The external provisioner in the CSI driver will react to the deletion of the PersistentVolumeClaim and based on its reclamation policy, it issues the DeleteVolume call against the CSI volume driver commands to delete the volume. The PersistentVolume object is then deleted.
>
> Azure Disks CSI driver v2 (preview) improves scalability and reduces pod failover latency. It uses shared disks to provision attachment replicas on multiple cluster nodes and integrates with the pod scheduler to ensure a node with an attachment replica is chosen on pod failover. Azure Disks CSI driver v2 (preview) also provides the ability to fine tune performance. If you're interested in participating in the preview, submit a request: [https://aka.ms/DiskCSIv2Preview](https://aka.ms/DiskCSIv2Preview). This preview version is provided without a service level agreement, and you can occasionally expect breaking changes while in preview. The preview version isn't recommended for production workloads. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- You need the Azure CLI version 2.42 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].
- If the open-source CSI Blob storage driver is installed on your cluster, uninstall it before enabling the Azure Blob storage driver.
- To enforce the Azure Policy for AKS [policy definition][azure-policy-aks-definition] **Kubernetes clusters should use Container Storage Interface(CSI) driver StorageClass**, the Azure Policy add-on needs to be enabled on new and existing clusters. For an existing cluster, review the [Learn Azure Policy for Kubernetes][learn-azure-policy-kubernetes] to enable it.

## Disk encryption supported scenarios

CSI storage drivers support the following scenarios:

* [Encrypted managed disks with customer-managed keys][encrypt-managed-disks-customer-managed-keys] using Azure Key Vaults stored in a different Azure Active Directory (Azure AD) tenant.
* Encrypt your Azure Storage disks hosting AKS OS and application data with [customer-managed keys][azure-disk-customer-managed-keys].

## Enable CSI storage drivers on an existing cluster

To enable CSI storage drivers on a new cluster, include one of the following parameters depending on the storage system:

* `--enable-disk-driver` allows you to enable the [Azure Disks CSI driver][azure-disk-csi].
* `--enable-file-driver` allows you to enable the [Azure Files CSI driver][azure-files-csi].
* `--enable-blob-driver` allows you to enable the [Azure Blob storage CSI driver][azure-blob-csi].
* `--enable-snapshot-controller` allows you to enable the [snapshot controller][snapshot-controller].

```azurecli
az aks update -n myAKSCluster -g myResourceGroup --enable-disk-driver --enable-file-driver --enable-blob-driver --enable-snapshot-controller
```

It may take several minutes to complete this action. Once it's complete, you should see in the output the status of enabling the driver on your cluster. The following example resembles the section indicating the results when enabling the Blob storage CSI driver:

```output
"storageProfile": {
    "blobCsiDriver": {
      "enabled": true
    },
```

## Disable CSI storage drivers on a new or existing cluster

To disable CSI storage drivers on a new cluster, include one of the following parameters depending on the storage system:

* `--disable-disk-driver` allows you to disable the [Azure Disks CSI driver][azure-disk-csi].
* `--disable-file-driver` allows you to disable the [Azure Files CSI driver][azure-files-csi].
* `--disable-blob-driver` allows you to disable the [Azure Blob storage CSI driver][azure-blob-csi].
* `--disable-snapshot-controller` allows you to disable the [snapshot controller][snapshot-controller].

```azurecli
az aks create -n myAKSCluster -g myResourceGroup --disable-disk-driver --disable-file-driver --disable-blob-driver --disable-snapshot-controller 
```

To disable CSI storage drivers on an existing cluster, use one of the parameters listed earlier depending on the storage system:

```azurecli
az aks update -n myAKSCluster -g myResourceGroup --disable-disk-driver --disable-file-driver --disable-blob-driver --disable-snapshot-controller 
```

## Migrate custom in-tree storage classes to CSI

If you've created in-tree driver storage classes, those storage classes continue to work since CSI migration is turned on after upgrading your cluster to 1.21.x. If you want to use CSI features you'll need to perform the migration.

To review the migration options for your storage classes and upgrade your cluster to use Azure Disks and Azure Files CSI drivers, see [Migrate from in-tree to CSI drivers][migrate-from-in-tree-csi-drivers].

## Next steps

- To use the CSI driver for Azure Disks, see [Use Azure Disks with CSI drivers][azure-disk-csi].
- To use the CSI driver for Azure Files, see [Use Azure Files with CSI drivers][azure-files-csi].
- To use the CSI driver for Azure Blob storage, see [Use Azure Blob storage with CSI drivers][azure-blob-csi]
- For more about storage best practices, see [Best practices for storage and backups in Azure Kubernetes Service][operator-best-practices-storage].
- For more information on CSI migration, see [Kubernetes in-tree to CSI Volume Migration][csi-migration-community].

<!-- LINKS - external -->
[csi-migration-community]: https://kubernetes.io/blog/2019/12/09/kubernetes-1-17-feature-csi-migration-beta
[snapshot-controller]: https://kubernetes-csi.github.io/docs/snapshot-controller.html

<!-- LINKS - internal -->
[azure-disk-static-mount]: azure-csi-disk-storage-provision.md#mount-disk-as-a-volume
[azure-file-static-mount]: azure-csi-files-storage-provision.md#mount-file-share-as-a-persistent-volume
[install-azure-cli]: /cli/azure/install-azure-cli
[operator-best-practices-storage]: operator-best-practices-storage.md
[azure-blob-csi]: azure-blob-csi.md
[azure-disk-csi]: azure-disk-csi.md
[azure-files-csi]: azure-files-csi.md
[migrate-from-in-tree-csi-drivers]: csi-migrate-in-tree-volumes.md
[learn-azure-policy-kubernetes]: ../governance/policy/concepts/policy-for-kubernetes.md
[azure-policy-aks-definition]: ../governance/policy/samples/built-in-policies.md#kubernetes
[encrypt-managed-disks-customer-managed-keys]: ../virtual-machines/disks-cross-tenant-customer-managed-keys.md
[azure-disk-customer-managed-keys]: azure-disk-customer-managed-keys.md
