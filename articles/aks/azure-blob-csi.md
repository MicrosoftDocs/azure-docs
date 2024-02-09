---
title: Use Container Storage Interface (CSI) driver for Azure Blob storage on Azure Kubernetes Service (AKS)
description: Learn how to use the Container Storage Interface (CSI) driver for Azure Blob storage in an Azure Kubernetes Service (AKS) cluster.
ms.topic: article
ms.custom: devx-track-linux
ms.date: 11/24/2023
---

# Use Azure Blob storage Container Storage Interface (CSI) driver

The Azure Blob storage Container Storage Interface (CSI) driver is a [CSI specification][csi-specification]-compliant driver used by Azure Kubernetes Service (AKS) to manage the lifecycle of Azure Blob storage. The CSI is a standard for exposing arbitrary block and file storage systems to containerized workloads on Kubernetes.

By adopting and using CSI, AKS now can write, deploy, and iterate plug-ins to expose new or improve existing storage systems in Kubernetes. Using CSI drivers in AKS avoids having to touch the core Kubernetes code and wait for its release cycles.

When you mount Azure Blob storage as a file system into a container or pod, it enables you to use blob storage with a number of applications that work massive amounts of unstructured data. For example:

* Log file data
* Images, documents, and streaming video or audio
* Disaster recovery data

The data on the object storage can be accessed by applications using BlobFuse or Network File System (NFS) 3.0 protocol. Before the introduction of the Azure Blob storage CSI driver, the only option was to manually install an unsupported driver to access Blob storage from your application running on AKS. When the Azure Blob storage CSI driver is enabled on AKS, there are two built-in storage classes: *azureblob-fuse-premium* and *azureblob-nfs-premium*.

To create an AKS cluster with CSI drivers support, see [CSI drivers on AKS][csi-drivers-aks]. To learn more about the differences in access between each of the Azure storage types using the NFS protocol, see [Compare access to Azure Files, Blob Storage, and Azure NetApp Files with NFS][compare-access-with-nfs].

## Azure Blob storage CSI driver features

Azure Blob storage CSI driver supports the following features:

- BlobFuse and Network File System (NFS) version 3.0 protocol

## Before you begin

- You need the Azure CLI version 2.42 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

- Perform the steps in this [link][csi-blob-storage-open-source-driver-uninstall-steps] if you previously installed the [CSI Blob Storage open-source driver][csi-blob-storage-open-source-driver] to access Azure Blob storage from your cluster.
> [!NOTE]
> If the blobfuse-proxy is not enabled during the installation of the open source driver, the uninstallation of the open source driver will disrupt existing blobfuse mounts. However, NFS mounts will remain unaffected.

## Enable CSI driver on a new or existing AKS cluster

Using the Azure CLI, you can enable the Blob storage CSI driver on a new or existing AKS cluster before you configure a persistent volume for use by pods in the cluster.

To enable the driver on a new cluster, include the `--enable-blob-driver` parameter with the `az aks create` command as shown in the following example:

```azurecli
az aks create --enable-blob-driver -n myAKSCluster -g myResourceGroup
```

To enable the driver on an existing cluster, include the `--enable-blob-driver` parameter with the `az aks update` command as shown in the following example:

```azurecli
az aks update --enable-blob-driver -n myAKSCluster -g myResourceGroup
```

You're prompted to confirm there isn't an open-source Blob CSI driver installed. After you confirm, it may take several minutes to complete this action. Once it's complete, you should see in the output the status of enabling the driver on your cluster. The following example resembles the section indicating the results of the previous command:

```output
"storageProfile": {
    "blobCsiDriver": {
      "enabled": true
    },
```

## Disable CSI driver on an existing AKS cluster

Using the Azure CLI, you can disable the Blob storage CSI driver on an existing AKS cluster after you remove the persistent volume from the cluster.

To disable the driver on an existing cluster, include the `--disable-blob-driver` parameter with the `az aks update` command as shown in the following example:

```azurecli
az aks update --disable-blob-driver -n myAKSCluster -g myResourceGroup
```

## Use a persistent volume with Azure Blob storage

A [persistent volume][persistent-volume] (PV) represents a piece of storage that's provisioned for use with Kubernetes pods. A PV can be used by one or many pods and can be dynamically or statically provisioned. If multiple pods need concurrent access to the same storage volume, you can use Azure Blob storage to connect by using the Network File System (NFS) or blobfuse. This article shows you how to dynamically create an Azure Blob storage container for use by multiple pods in an AKS cluster.

For more information on Kubernetes volumes, see [Storage options for applications in AKS][concepts-storage].

## Dynamically create Azure Blob storage PVs by using the built-in storage classes

A storage class is used to define how an Azure Blob storage container is created. A storage account is automatically created in the node resource group for use with the storage class to hold the Azure Blob storage container. Choose one of the following Azure storage redundancy SKUs for skuName:

* **Standard_LRS**: Standard locally redundant storage
* **Premium_LRS**: Premium locally redundant storage
* **Standard_ZRS**: Standard zone redundant storage
* **Premium_ZRS**: Premium zone redundant storage
* **Standard_GRS**: Standard geo-redundant storage
* **Standard_RAGRS**: Standard read-access geo-redundant storage

When you use storage CSI drivers on AKS, there are two additional built-in StorageClasses that use the Azure Blob CSI storage driver.

The reclaim policy on both storage classes ensures that the underlying Azure Blob storage is deleted when the respective PV is deleted. The storage classes also configure the container to be expandable by default, as the `set allowVolumeExpansion` parameter is set to **true**.

Use the [kubectl get sc][kubectl-get] command to see the storage classes. The following example shows the `azureblob-fuse-premium` and `azureblob-nfs-premium` storage classes available within an AKS cluster:

```output
NAME                                  PROVISIONER       RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION     AGE
azureblob-fuse-premium               blob.csi.azure.com   Delete          Immediate              true                   23h
azureblob-nfs-premium                blob.csi.azure.com   Delete          Immediate              true                   23h
```

To use these storage classes, create a PVC and respective pod that references and uses them. A PVC is used to automatically provision storage based on a storage class. A PVC can use one of the pre-created storage classes or a user-defined storage class to create an Azure Blob storage container for the desired SKU, size, and protocol to communicate with it. When you create a pod definition, the PVC is specified to request the desired storage.

## Using a StatefulSet

To have a storage volume persist for your workload, you can use a StatefulSet. This makes it easier to match existing volumes to new Pods that replace any that have failed. The following examples demonstrate how to set up a StatefulSet for Blob storage using either Blobfuse or the NFS protocol.

# [NFS](#tab/NFS)

### Prerequisites

- Your AKS cluster *Control plane* identity (that is, your AKS cluster name) is added to the [Contributor](../role-based-access-control/built-in-roles.md#contributor) role on the VNet and network security group.

1. Create a file named `azure-blob-nfs-ss.yaml` and copy in the following YAML.

    ```yml
    apiVersion: apps/v1
    kind: StatefulSet
    metadata:
      name: statefulset-blob-nfs
      labels:
        app: nginx
    spec:
      serviceName: statefulset-blob-nfs
      replicas: 1
      template:
        metadata:
          labels:
            app: nginx
        spec:
          nodeSelector:
            "kubernetes.io/os": linux
          containers:
            - name: statefulset-blob-nfs
              image: mcr.microsoft.com/oss/nginx/nginx:1.19.5
              volumeMounts:
                - name: persistent-storage
                  mountPath: /mnt/blob
      updateStrategy:
        type: RollingUpdate
      selector:
        matchLabels:
          app: nginx
      volumeClaimTemplates:
        - metadata:
            name: persistent-storage
          spec:
            storageClassName: azureblob-nfs-premium
            accessModes: ["ReadWriteMany"]
            resources:
              requests:
                storage: 100Gi
    ```

2. Create the StatefulSet with the kubectl create command:

    ```bash
    kubectl create -f azure-blob-nfs-ss.yaml
    ```

# [Blobfuse](#tab/Blobfuse)

1. Create a file named `azure-blobfuse-ss.yaml` and copy in the following YAML.

    ```yml
    apiVersion: apps/v1
    kind: StatefulSet
    metadata:
      name: statefulset-blob
      labels:
        app: nginx
    spec:
      serviceName: statefulset-blob
      replicas: 1
      template:
        metadata:
          labels:
            app: nginx
        spec:
          nodeSelector:
            "kubernetes.io/os": linux
          containers:
            - name: statefulset-blob
              image: mcr.microsoft.com/oss/nginx/nginx:1.19.5
              volumeMounts:
                - name: persistent-storage
                  mountPath: /mnt/blob
      updateStrategy:
        type: RollingUpdate
      selector:
        matchLabels:
          app: nginx
      volumeClaimTemplates:
        - metadata:
            name: persistent-storage
          spec:
            storageClassName: azureblob-fuse-premium
            accessModes: ["ReadWriteMany"]
            resources:
              requests:
                storage: 100Gi
    ```

2. Create the StatefulSet with the kubectl create command:

    ```bash
    kubectl create -f azure-blobfuse-ss.yaml
    ```

---

## Next steps

- To learn how to set up a static or dynamic persistent volume, see [Create and use a volume with Azure Blob storage][azure-csi-blob-storage-provision].
- To learn how to use CSI driver for Azure Disks, see [Use Azure Disks with CSI driver][azure-disk-csi-driver]
- To learn how to use CSI driver for Azure Files, see [Use Azure Files with CSI driver][azure-files-csi-driver]
- For more about storage best practices, see [Best practices for storage and backups in Azure Kubernetes Service][operator-best-practices-storage].

<!-- LINKS - external -->
[csi-specification]: https://github.com/container-storage-interface/spec/blob/master/spec.md
[csi-blob-storage-open-source-driver]: https://github.com/kubernetes-sigs/blob-csi-driver
[csi-blob-storage-open-source-driver-uninstall-steps]: https://github.com/kubernetes-sigs/blob-csi-driver/blob/master/docs/install-csi-driver-master.md#clean-up-blob-csi-driver
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get

<!-- LINKS - internal -->
[compare-access-with-nfs]: ../storage/common/nfs-comparison.md
[operator-best-practices-storage]: operator-best-practices-storage.md
[concepts-storage]: concepts-storage.md
[persistent-volume]: concepts-storage.md#persistent-volumes
[csi-drivers-aks]: csi-storage-drivers.md
[azure-csi-blob-storage-provision]: azure-csi-blob-storage-provision.md
[azure-disk-csi-driver]: azure-disk-csi.md
[azure-files-csi-driver]: azure-files-csi.md
[install-azure-cli]: /cli/azure/install-azure-cli
