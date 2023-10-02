---
title: Concepts - Storage in Azure Kubernetes Services (AKS)
description: Learn about storage in Azure Kubernetes Service (AKS), including volumes, persistent volumes, storage classes, and claims.
ms.topic: conceptual
ms.date: 08/30/2023

---

# Storage options for applications in Azure Kubernetes Service (AKS)

Applications running in Azure Kubernetes Service (AKS) may need to store and retrieve data. While some application workloads can use local, fast storage on unneeded, emptied nodes, others require storage that persists on more regular data volumes within the Azure platform.

Multiple pods may need to:

* Share the same data volumes.
* Reattach data volumes if the pod is rescheduled on a different node.

You also might need to collect and store sensitive data or application configuration information into pods.

This article introduces the core concepts that provide storage to your applications in AKS:

* [Volumes](#volumes)
* [Persistent volumes](#persistent-volumes)
* [Storage classes](#storage-classes)
* [Persistent volume claims](#persistent-volume-claims)

![Storage options for applications in an Azure Kubernetes Services (AKS) cluster](media/concepts-storage/aks-storage-options.png)

## Ephemeral OS disk

By default, Azure automatically replicates the operating system disk for a virtual machine to Azure storage to avoid data loss when the VM is relocated to another host. However, since containers aren't designed to have local state persisted, this behavior offers limited value while providing some drawbacks. These drawbacks include, but aren't limited to, slower node provisioning and higher read/write latency.

By contrast, ephemeral OS disks are stored only on the host machine, just like a temporary disk. With this configuration, you get lower read/write latency, together with faster node scaling and cluster upgrades.

> [!NOTE]
> When you don't explicitly request [Azure managed disks][azure-managed-disks] for the OS, AKS defaults to ephemeral OS if possible for a given node pool configuration.

Size requirements and recommendations for ephemeral OS disks are available in the [Azure VM documentation][azure-vm-ephemeral-os-disks]. The following are some general sizing considerations:

* If you chose to use the AKS default VM size [Standard_DS2_v2](../virtual-machines/dv2-dsv2-series.md#dsv2-series) SKU with the default OS disk size of 100 GiB, the default VM size supports ephemeral OS, but only has 86 GiB of cache size. This configuration would default to managed disks if you don't explicitly specify it. If you do request an ephemeral OS, you receive a validation error.

* If you request the same [Standard_DS2_v2](../virtual-machines/dv2-dsv2-series.md#dsv2-series) SKU with a 60-GiB OS disk, this configuration would default to ephemeral OS. The requested size of 60 GiB is smaller than the maximum cache size of 86 GiB.

* If you select the [Standard_D8s_v3](../virtual-machines/dv3-dsv3-series.md#dsv3-series) SKU with 100-GB OS disk, this VM size supports ephemeral OS and has 200 GiB of cache space. If you don't specify the OS disk type, the node pool would receive ephemeral OS by default.

The latest generation of VM series doesn't have a dedicated cache, but only temporary storage. For example, if you selected the [Standard_E2bds_v5](../virtual-machines/ebdsv5-ebsv5-series.md#ebdsv5-series) VM size with the default OS disk size of 100 GiB, it supports ephemeral OS disks, but only has 75 GB of temporary storage. This configuration would default to managed OS disks if you don't explicitly specify it. If you do request an ephemeral OS disk, you receive a validation error.

* If you request the same [Standard_E2bds_v5](../virtual-machines/ebdsv5-ebsv5-series.md#ebdsv5-series) VM size with a 60-GiB OS disk, this configuration defaults to ephemeral OS disks. The requested size of 60 GiB is smaller than the maximum temporary storage of 75 GiB.

* If you select [Standard_E4bds_v5](../virtual-machines/ebdsv5-ebsv5-series.md#ebdsv5-series) SKU with 100-GiB OS disk, this VM size supports ephemeral OS
and has 150 GiB of temporary storage. If you don't specify the OS disk type, by default Azure provisions an ephemeral OS disk to the node pool.

### Customer-managed keys

You can manage encryption for your ephemeral OS disk with your own keys on an AKS cluster. For more information, see [Use Customer Managed key with Azure disk on AKS][azure-disk-customer-managed-key].

## Volumes

Kubernetes typically treats individual pods as ephemeral, disposable resources. Applications have different approaches available to them for using and persisting data. A *volume* represents a way to store, retrieve, and persist data across pods and through the application lifecycle.

Traditional volumes are created as Kubernetes resources backed by Azure Storage. You can manually create data volumes to be assigned to pods directly or have Kubernetes automatically create them. Data volumes can use: [Azure Disk][disks-types], [Azure Files][storage-files-planning], [Azure NetApp Files][azure-netapp-files-service-levels], or [Azure Blobs][storage-account-overview].

> [!NOTE]
> Depending on the VM SKU you're using, the Azure Disk CSI driver might have a per-node volume limit. For some high performance VMs (for example, 16 cores), the limit is 64 volumes per node. To identify the limit per VM SKU, review the **Max data disks** column for each VM SKU offered. For a list of VM SKUs offered and their corresponding detailed capacity limits, see [General purpose virtual machine sizes][general-purpose-machine-sizes].

To help determine best fit for your workload between Azure Files and Azure NetApp Files, review the information provided in the article [Azure Files and Azure NetApp Files comparison][azure-files-azure-netapp-comparison].

### Azure Disk

Use [Azure Disk][azure-disk-csi] to create a Kubernetes *DataDisk* resource. Disks types include:

* Ultra Disks
* Premium SSDs
* Standard SSDs
* Standard HDDs

> [!TIP]
> For most production and development workloads, use Premium SSD.

Because Azure Disk is mounted as *ReadWriteOnce*, they're only available to a single node. For storage volumes accessible by pods on multiple nodes simultaneously, use Azure Files.

### Azure Files

Use [Azure Files][azure-files-csi] to mount a Server Message Block (SMB) version 3.1.1 share or Network File System (NFS) version 4.1 share backed by an Azure storage account to pods. Azure Files let you share data across multiple nodes and pods and can use:

* Azure Premium storage backed by high-performance SSDs
* Azure Standard storage backed by regular HDDs

### Azure NetApp Files

* Ultra Storage
* Premium Storage
* Standard Storage

### Azure Blob Storage

Use [Azure Blob Storage][azure-blob-csi] to create a blob storage container and mount it using the NFS v3.0 protocol or BlobFuse.

* Block Blobs

### Volume types

Kubernetes volumes represent more than just a traditional disk for storing and retrieving information. Kubernetes volumes can also be used as a way to inject data into a pod for use by the containers.

Common volume types in Kubernetes include:

#### emptyDir

Commonly used as temporary space for a pod. All containers within a pod can access the data on the volume. Data written to this volume type persists only for the lifespan of the pod. Once you delete the pod, the volume is deleted. This volume typically uses the underlying local node disk storage, though it can also exist only in the node's memory.

#### secret

You can use *secret* volumes to inject sensitive data into pods, such as passwords.

1. Create a Secret using the Kubernetes API.
1. Define your pod or deployment and request a specific Secret.
    * Secrets are only provided to nodes with a scheduled pod that requires them.
    * The Secret is stored in *tmpfs*, not written to disk.
1. When you delete the last pod on a node requiring a Secret, the Secret is deleted from the node's tmpfs.
   * Secrets are stored within a given namespace and are only accessed by pods within the same namespace.

#### configMap

You can use *configMap* to inject key-value pair properties into pods, such as application configuration information. Define application configuration information as a Kubernetes resource, easily updated and applied to new instances of pods as they're deployed.

Like using a secret:

1. Create a ConfigMap using the Kubernetes API.
1. Request the ConfigMap when you define a pod or deployment.
   * ConfigMaps are stored within a given namespace and are only accessed by pods within the same namespace.

## Persistent volumes

Volumes defined and created as part of the pod lifecycle only exist until you delete the pod. Pods often expect their storage to remain if a pod is rescheduled on a different host during a maintenance event, especially in StatefulSets. A *persistent volume* (PV) is a storage resource created and managed by the Kubernetes API that can exist beyond the lifetime of an individual pod.

You can use [Azure Disk](azure-csi-disk-storage-provision.md) or [Azure Files](azure-csi-files-storage-provision.md) to provide the PersistentVolume. As noted in the [Volumes](#volumes) section, the choice of Disks or Files is often determined by the need for concurrent access to the data or the performance tier.

![Persistent volumes in an Azure Kubernetes Services (AKS) cluster](media/concepts-storage/persistent-volumes.png)

A cluster administrator can *statically* create a PersistentVolume, or the volume is created *dynamically* by the Kubernetes API server. If a pod is scheduled and requests currently unavailable storage, Kubernetes can create the underlying Azure Disk or File storage and attach it to the pod. Dynamic provisioning uses a *StorageClass* to identify what type of Azure storage needs to be created.

> [!IMPORTANT]
> Persistent volumes can't be shared by Windows and Linux pods due to differences in file system support between the two operating systems.

## Storage classes

To define different tiers of storage, such as Premium and Standard, you can create a *StorageClass*.

The StorageClass also defines the *reclaimPolicy*. When you delete the persistent volume, the reclaimPolicy controls the behavior of the underlying Azure storage resource. The underlying storage resource can either be deleted or kept for use with a future pod.

For clusters using the [Container Storage Interface (CSI) drivers][csi-storage-drivers] the following extra `StorageClasses` are created:

| Permission | Reason |
|---|---|
| `managed-csi` | Uses Azure StandardSSD locally redundant storage (LRS) to create a Managed Disk. The reclaim policy ensures that the underlying Azure Disk is deleted when the persistent volume that used it's deleted. The storage class also configures the persistent volumes to be expandable, you just need to edit the persistent volume claim with the new size. |
| `managed-csi-premium` | Uses Azure Premium locally redundant storage (LRS) to create a Managed Disk. The reclaim policy again ensures that the underlying Azure Disk is deleted when the persistent volume that used it's deleted. Similarly, this storage class allows for persistent volumes to be expanded. |
| `azurefile-csi` | Uses Azure Standard storage to create an Azure file share. The reclaim policy ensures that the underlying Azure file share is deleted when the persistent volume that used it is deleted. |
| `azurefile-csi-premium` | Uses Azure Premium storage to create an Azure file share. The reclaim policy ensures that the underlying Azure file share is deleted when the persistent volume that used it's deleted.|
| `azureblob-nfs-premium` | Uses Azure Premium storage to create an Azure Blob storage container and connect using the NFS v3 protocol. The reclaim policy ensures that the underlying Azure Blob storage container is deleted when the persistent volume that used it's deleted. |
| `azureblob-fuse-premium` | Uses Azure Premium storage to create an Azure Blob storage container and connect using BlobFuse. The reclaim policy ensures that the underlying Azure Blob storage container is deleted when the persistent volume that used it's deleted. |

Unless you specify a StorageClass for a persistent volume, the default StorageClass is used. Ensure volumes use the appropriate storage you need when requesting persistent volumes.

> [!IMPORTANT]
> Starting with Kubernetes version 1.21, AKS only uses CSI drivers by default and CSI migration is enabled. While existing in-tree persistent volumes continue to function, starting with version 1.26, AKS will no longer support volumes created using in-tree driver and storage provisioned for files and disk.
>
> The `default` class will be the same as `managed-csi`.

You can create a StorageClass for other needs using `kubectl`. The following example uses Premium Managed Disks and specifies that the underlying Azure Disk should be *retained* when you delete the pod:

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: managed-premium-retain
provisioner: disk.csi.azure.com
parameters:
  skuName: Premium_ZRS
reclaimPolicy: Retain
volumeBindingMode: WaitForFirstConsumer
allowVolumeExpansion: true
```

> [!NOTE]
> AKS reconciles the default storage classes and will overwrite any changes you make to those storage classes.

For more information about storage classes, see [StorageClass in Kubernetes](https://kubernetes.io/docs/concepts/storage/storage-classes/).

## Persistent volume claims

A PersistentVolumeClaim requests storage of a particular StorageClass, access mode, and size. The Kubernetes API server can dynamically provision the underlying Azure storage resource if no existing resource can fulfill the claim based on the defined StorageClass.

The pod definition includes the volume mount once the volume has been connected to the pod.

![Persistent volume claims in an Azure Kubernetes Services (AKS) cluster](media/concepts-storage/persistent-volume-claims.png)

Once an available storage resource has been assigned to the pod requesting storage, PersistentVolume is *bound* to a PersistentVolumeClaim. Persistent volumes are 1:1 mapped to claims.

The following example YAML manifest shows a persistent volume claim that uses the *managed-premium* StorageClass and requests a Disk *5Gi* in size:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: azure-managed-disk
spec:
  accessModes:
  - ReadWriteOnce
  storageClassName: managed-premium-retain
  resources:
    requests:
      storage: 5Gi
```

When you create a pod definition, you also specify:

* The persistent volume claim to request the desired storage.
* The *volumeMount* for your applications to read and write data.

The following example YAML manifest shows how the previous persistent volume claim can be used to mount a volume at */mnt/azure*:

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: nginx
spec:
  containers:
    - name: myfrontend
      image: mcr.microsoft.com/oss/nginx/nginx:1.15.5-alpine
      volumeMounts:
      - mountPath: "/mnt/azure"
        name: volume
  volumes:
    - name: volume
      persistentVolumeClaim:
        claimName: azure-managed-disk
```

For mounting a volume in a Windows container, specify the drive letter and path. For example:

```yaml
...      
       volumeMounts:
        - mountPath: "d:"
          name: volume
        - mountPath: "c:\k"
          name: k-dir
...
```

## Next steps

For associated best practices, see [Best practices for storage and backups in AKS][operator-best-practices-storage] and [AKS Storage Considerations][azure-aks-storage-considerations].

To see how to use CSI drivers, see the following how-to articles:

- [Container Storage Interface (CSI) drivers for Azure Disk, Azure Files, and Azure Blob storage on Azure Kubernetes Service][csi-storage-drivers]
- [Use Azure Disk CSI driver in Azure Kubernetes Service][azure-disk-csi]
- [Use Azure Files CSI driver in Azure Kubernetes Service][azure-files-csi]
- [Use Azure Blob storage CSI driver in Azure Kubernetes Service][azure-blob-csi]
- [Configure Azure NetApp Files with Azure Kubernetes Service][azure-netapp-files]

For more information on core Kubernetes and AKS concepts, see the following articles:

- [Kubernetes / AKS clusters and workloads][aks-concepts-clusters-workloads]
- [Kubernetes / AKS identity][aks-concepts-identity]
- [Kubernetes / AKS security][aks-concepts-security]
- [Kubernetes / AKS virtual networks][aks-concepts-network]
- [Kubernetes / AKS scale][aks-concepts-scale]

<!-- EXTERNAL LINKS -->

<!-- INTERNAL LINKS -->
[disks-types]: ../virtual-machines/disks-types.md
[azure-managed-disks]: ../virtual-machines/managed-disks-overview.md
[azure-vm-ephemeral-os-disks]: ../virtual-machines/ephemeral-os-disks.md
[storage-files-planning]: ../storage/files/storage-files-planning.md
[azure-netapp-files-service-levels]: ../azure-netapp-files/azure-netapp-files-service-levels.md
[storage-account-overview]: ../storage/common/storage-account-overview.md
[csi-storage-drivers]: csi-storage-drivers.md
[azure-disk-csi]: azure-disk-csi.md
[azure-netapp-files]: azure-netapp-files.md
[azure-files-csi]: azure-files-csi.md
[aks-concepts-clusters-workloads]: concepts-clusters-workloads.md
[aks-concepts-identity]: concepts-identity.md
[aks-concepts-scale]: concepts-scale.md
[aks-concepts-security]: concepts-security.md
[aks-concepts-network]: concepts-network.md
[operator-best-practices-storage]: operator-best-practices-storage.md
[azure-blob-csi]: azure-blob-csi.md
[general-purpose-machine-sizes]: ../virtual-machines/sizes-general.md
[azure-files-azure-netapp-comparison]: ../storage/files/storage-files-netapp-comparison.md
[azure-disk-customer-managed-key]: azure-disk-customer-managed-keys.md
[azure-aks-storage-considerations]: /azure/cloud-adoption-framework/scenarios/app-platform/aks/storage