---
title: Create a dynamic Azure Blob storage persistent volume in Azure Kubernetes Service (AKS)
titleSuffix: Azure Kubernetes Service
description: Learn how to dynamically create a persistent volume with Azure Blob storage for use with multiple concurrent pods in Azure Kubernetes Service (AKS)
services: container-service
ms.topic: article
ms.date: 07/21/2022

---

# Dynamically create and use a persistent volume with Azure Blob storage in Azure Kubernetes Service (AKS)

Container-based applications often need to access and persist data in an external data volume. If multiple pods need concurrent access to the same storage volume, you can use Azure Blob storage to connect using [blobfuse][blobfuse-overview] or [Network File System][nfs-overview] (NFS).

This article shows you how to install the Container Storage Interface (CSI) driver and dynamically create an Azure Blob storage container to attach to a pod in AKS.

For more information on Kubernetes volumes, see [Storage options for applications in AKS][concepts-storage].

## Before you begin

 - This article assumes that you have an existing AKS cluster running version 1.21 or higher. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli], [using Azure PowerShell][aks-quickstart-powershell], or [using the Azure portal][aks-quickstart-portal].

- If you don't have a storage account that supports the NFS v3 protocol, review [NFS v3 support with Azure Blob storage][azure-blob-storage-nfs-support].

- [Enable the Blob storage CSI driver][enable-blob-csi-driver] (preview) on your AKS cluster.

## Dynamic provisioning parameters

|Name | Description | Example | Mandatory | Default value|
|--- | --- | --- | --- | --- |
|skuName | Specify an Azure storage account type (alias: `storageAccountType`). | `Standard_LRS`, `Premium_LRS`, `Standard_GRS`, `Standard_RAGRS` | No | `Standard_LRS`|
|location | Specify an Azure location. | `eastus` | No | If empty, driver will use the same location name as current cluster.|
|resourceGroup | Specify an Azure resource group name. | myResourceGroup | No | If empty, driver will use the same resource group name as current cluster.|
|storageAccount | Specify an Azure storage account name.| storageAccountName | - No for blobfuse mount </br> - Yes for NFSv3 mount. |  - For blobfuse mount: if empty, driver finds a suitable storage account that matches `skuName` in the same resource group. If a storage account name is provided, storage account must exist. </br>  - For NFSv3 mount, storage account name must be provided.|
|protocol | Specify blobfuse mount or NFSv3 mount. | `fuse`, `nfs` | No | `fuse`|
|containerName | Specify the existing container (directory) name. | container | No | If empty, driver creates a new container name, starting with `pvc-fuse` for blobfuse or `pvc-nfs` for NFS v3. |
|containerNamePrefix | Specify Azure storage directory prefix created by driver. | my |Can only contain lowercase letters, numbers, hyphens, and length should be fewer than 21 characters. | No |
|server | Specify Azure storage account domain name. | Existing storage account DNS domain name, for example `<storage-account>.privatelink.blob.core.windows.net`. | No | If empty, driver uses default `<storage-account>.blob.core.windows.net` or other sovereign cloud storage account DNS domain name.|
|allowBlobPublicAccess | Allow or disallow public access to all blobs or containers for storage account created by driver. | `true`,`false` | No | `false`|
|storageEndpointSuffix | Specify Azure storage endpoint suffix. | `core.windows.net` | No | If empty, driver will use default storage endpoint suffix according to cloud environment.|
|tags | [tags][az-tags] would be created in new storage account. | Tag format: 'foo=aaa,bar=bbb' | No | ""|
|matchTags | Match tags when driver tries to find a suitable storage account. | `true`,`false` | No | `false`|
|--- | **Following parameters are only for blobfuse** | --- | --- |--- |
|subscriptionID | Specify Azure subscription ID where blob storage directory will be created. | Azure subscription ID | No | If not empty, `resourceGroup` must be provided.|
|storeAccountKey | Specify store account key to Kubernetes secret. <br><br> Note:  <br> `false` means driver uses kubelet identity to get account key. | `true`,`false` | No | `true`|
|secretName | Specify secret name to store account key. | | No |
|secretNamespace | Specify the namespace of secret to store account key. | `default`,`kube-system`, etc. | No | pvc namespace |
|isHnsEnabled | Enable `Hierarchical namespace` for Azure DataLake storage account. | `true`,`false` | No | `false`|
|--- | **Following parameters are only for NFS protocol** | --- | --- |--- |
|mountPermissions | Specify mounted folder permissions. |The default is `0777`. If set to `0`, driver won't perform `chmod` after mount. | `0777` | No |

## Create a persistent volume claim using built-in storage class

A persistent volume claim (PVC) uses the storage class object to dynamically provision an Azure Blob storage container. The following YAML can be used to create a persistent volume claim 5 GB in size with *ReadWriteMany* access, using the built-in storage class. For more information on access modes, see the [Kubernetes persistent volume][kubernetes-volumes] documentation.

1. Create a file named `blob-nfs-pvc.yaml` and copy in the following YAML.

    ```yml
    apiVersion: v1
    kind: PersistentVolumeClaim
    metadata:
      name: azure-blob-storage
      annotations:
            volume.beta.kubernetes.io/storage-class: azureblob-nfs-premium
    spec:
      accessModes:
      - ReadWriteMany
      storageClassName: my-blobstorage
      resources:
        requests:
          storage: 5Gi
    ```

2. Create the persistent volume claim with the kubectl create command:

    ```bash
    kubectl create -f blob-nfs-pvc.yaml
    ```

Once completed, the Blob storage container will be created. You can use the [kubectl get][kubectl-get] command to view the status of the PVC:

```bash
kubectl get pvc azure-blob-storage
```

The output of the command resembles the following example:

```bash
NAME                 STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS                AGE
azure-blob-storage   Bound    pvc-b88e36c5-c518-4d38-a5ee-337a7dda0a68   5Gi        RWX            azureblob-nfs-premium       92m
```

## Use the persistent volume claim

The following YAML creates a pod that uses the persistent volume claim **azure-blob-storage** to mount the Azure Blob storage at the `/mnt/blob' path.

1. Create a file named `blob-nfs-pv`, and copy in the following YAML. Make sure that the **claimName** matches the PVC created in the previous step.

    ```yml
    kind: Pod
    apiVersion: v1
    metadata:
      name: mypod
    spec:
      containers:
      - name: mypod
        image: mcr.microsoft.com/oss/nginx/nginx:1.17.3-alpine
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 250m
            memory: 256Mi
        volumeMounts:
        - mountPath: "/mnt/blob"
          name: volume
      volumes:
        - name: volume
          persistentVolumeClaim:
            claimName: azure-blob-storage
    ```

2. Create the pod with the [kubectl apply][kubectl-apply] command:

   ```bash
   kubectl apply -f blob-nfs-pv.yaml
   ```

3. After the pod is in the running state, run the following command to create a new file called `test.txt`.

    ```bash
    kubectl exec mypod -- touch /mnt/blob/test.txt
    ```

4. To validate the disk is correctly mounted, run the following command, and verify you see the `test.txt` file in the output:

    ```bash
    kubectl exec mypod -- ls /mnt/blob
    ```

    The output of the command resembles the following example:

    ```bash
    test.txt
    ```

## Create a custom storage class

The default storage classes suit the most common scenarios, but not all. For some cases, you might want to have your own storage class customized with your own parameters. To demonstrate, two examples are shown. One based on using the NFS protocol, and the other using blobfuse.

### Storage class using NFS protocol

In this example, the following manifest configures mounting a Blob storage container using the NFS protocol. Use it to add the *tags* parameter.

1. Create a file named `blob-nfs-sc.yaml`, and paste the following example manifest:

    ```yml
    apiVersion: storage.k8s.io/v1
    kind: StorageClass
    metadata:
      name: azureblob-nfs-premium
    provisioner: blob.csi.azure.com
    parameters:
      protocol: nfs
      tags: environment=Development
    volumeBindingMode: Immediate
    ```

2. Create the storage class with the [kubectl apply][kubectl-apply] command:

    ```bash
    kubectl apply -f blob-nfs-sc.yaml
    ```

    The output of the command resembles the following example:

    ```bash
    storageclass.storage.k8s.io/blob-nfs-premium created
    ```

### Storage class using blobfuse

In this example, the following manifest configures using blobfuse and mount a Blob storage container. Use it to update the *skuName* parameter.

1. Create a file named `blobfuse-sc.yaml`, and paste the following example manifest:

    ```yml
    apiVersion: storage.k8s.io/v1
    kind: StorageClass
    metadata:
      name: azureblob-fuse-premium
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

2. Create the storage class with the [kubectl apply][kubectl-apply] command:

    ```bash
    kubectl apply -f blobfuse-sc.yaml
    ```

    The output of the command resembles the following example:

    ```bash
    storageclass.storage.k8s.io/blob-fuse-premium created
    ```

## Next steps

- To learn how to use CSI driver for Azure Blob storage, see [Use Azure Blob storage with CSI driver][azure-blob-storage-csi].
- To learn how to manually set up a static persistent volume, see [Create and use a volume with Azure Blob storage][azure-csi-blob-storage-static].
- For associated best practices, see [Best practices for storage and backups in AKS][operator-best-practices-storage].

<!-- LINKS - external -->
[kubectl-create]: https://kubernetes.io/docs/user-guide/kubectl/v1.8/#create
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubernetes-files]: https://github.com/kubernetes/examples/blob/master/staging/volumes/azure_file/README.md
[kubernetes-secret]: https://kubernetes.io/docs/concepts/configuration/secret/
[kubernetes-volumes]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes
[kubernetes-security-context]: https://kubernetes.io/docs/tasks/configure-pod-container/security-context/
[CSI driver parameters]: https://github.com/kubernetes-sigs/azurefile-csi-driver/blob/master/docs/driver-parameters.md#static-provisionbring-your-own-file-share
[blobfuse-overview]: https://github.com/Azure/azure-storage-fuse
[nfs-overview]: https://en.wikipedia.org/wiki/Network_File_System

<!-- LINKS - internal -->
[aks-quickstart-cli]: ./learn/quick-kubernetes-deploy-cli.md
[aks-quickstart-portal]: ./learn/quick-kubernetes-deploy-portal.md
[aks-quickstart-powershell]: ./learn/quick-kubernetes-deploy-powershell.md
[install-azure-cli]: /cli/azure/install-azure-cli
[operator-best-practices-storage]: operator-best-practices-storage.md
[concepts-storage]: concepts-storage.md
[persistent-volume-example]: #mount-file-share-as-a-persistent-volume
[use-tags]: use-tags.md
[use-managed-identity]: use-managed-identity.md
[kubernetes-secret]: https://kubernetes.io/docs/concepts/configuration/secret/
[sas-tokens]: ../storage/common/storage-sas-overview.md
[mount-blob-storage-nfs]: ../storage/blobs/network-file-system-protocol-support-how-to.md
[azure-csi-blob-storage-static]: azure-csi-blob-storage-static.md
[blob-storage-csi-driver]: azure-blob-csi.md
[azure-blob-storage-nfs-support]: ../storage/blobs/network-file-system-protocol-support.md
[enable-blob-csi-driver]: azure-blob-csi.md#before-you-begin
