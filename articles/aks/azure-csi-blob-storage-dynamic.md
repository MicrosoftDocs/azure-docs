---
title: Create a dynamic Azure Blob storage persistent volume in Azure Kubernetes Service (AKS)
titleSuffix: Azure Kubernetes Service
description: Learn how to dynamically create a persistent volume with Azure Blob storage for use with multiple concurrent pods in Azure Kubernetes Service (AKS)
services: container-service
ms.topic: article
ms.date: 06/16/2022

---

# Dynamically create and use a persistent volume with Azure Blob storage in Azure Kubernetes Service (AKS)

Container-based applications often need to access and persist data in an external data volume. If multiple pods need concurrent access to the same storage volume, you can use Azure Blob storage to connect using [blobfuse][blobfuse-overview] or [Network File System][nfs-overview] (NFS).

This article shows you how to install the Container Storage Interface (CSI) driver and dynamically create an Azure Blob storage container to attach to a pod in AKS.

For more information on Kubernetes volumes, see [Storage options for applications in AKS][concepts-storage].

## Before you begin

This article assumes that you have an existing AKS cluster running version 1.21 or higher. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli], [using Azure PowerShell][aks-quickstart-powershell], or [using the Azure portal][aks-quickstart-portal].

If you don't have a storage account that supports the NFS v3 protocol, see [Use Azure Blob storage Container Storage Interface (CSI) driver][blob-storage-csi-driver] (preview) to create one for your AKS cluster.

## Storage class driver dynamic parameters

|Name | Description | Example | Mandatory | Default value|
|--- | --- | --- | --- | --- |
|skuName | Specify an Azure storage account type (alias: `storageAccountType`) | `Standard_LRS`, `Premium_LRS`, `Standard_GRS`, `Standard_RAGRS` | No | `Standard_LRS`|
|location | Specify an Azure location | `eastus` | No | If empty, driver will use the same location name as current cluster.|
|resourceGroup | Specify an Azure resource group name | myResourceGroup | No | If empty, driver will use the same resource group name as current cluster.|
|storageAccount | Specify an Azure storage account name| STORAGE_ACCOUNT_NAME | - No for blobfuse mount </br> - Yes for NFSv3 mount |  - For blobfuse mount: if empty, driver will find a suitable storage account that matches `skuName` in the same resource group; if a storage account name is provided, storage account must exist. </br>  - For NFSv3 mount, storage account name must be provided.|
|protocol | Specify blobfuse mount or NFSv3 mount | `fuse`, `nfs` | No | `fuse`|
|containerName | Specify the existing container (directory) name | container | No | if empty, driver will create a new container name, starting with `pvc-fuse` for blobfuse or `pvc-nfs` for NFSv3 |
|containerNamePrefix | Specify Azure storage directory prefix created by driver | my |Can only contain lowercase letters, numbers, hyphens, and length should be less than 21 characters. | No |
|server | Specify Azure storage account server address | Existing server address, for example `accountname.privatelink.blob.core.windows.net`. | No | If empty, driver will use default `accountname.blob.core.windows.net` or other sovereign cloud account address.|
|allowBlobPublicAccess | Allow or disallow public access to all blobs or containers for storage account created by driver. | `true`,`false` | No | `false`|
|storageEndpointSuffix | Specify Azure storage endpoint suffix | `core.windows.net` | No | If empty, driver will use default storage endpoint suffix according to cloud environment.|
|tags | [tags][az-tags] would be created in newly created storage account | Tag format: 'foo=aaa,bar=bbb' | No | ""|
|matchTags | Whether matching tags when driver tries to find a suitable storage account | `true`,`false` | No | `false`|
|--- | **Following parameters are only for blobfuse** | --- | --- |--- |
|subscriptionID | Specify Azure subscription ID where blob storage directory will be created. | Azure subscription ID | No | If not empty, `resourceGroup` must be provided.|
|storeAccountKey | Specify store account key to Kubernetes secret <br><br> Note:  <br> `false` means driver leverages kubelet identity to get account key. | `true`,`false` | No | `true`|
|secretName | Specify secret name to store account key | | No |
|secretNamespace | Specify the namespace of secret to store account key | `default`,`kube-system`, etc | No | pvc namespace |
|isHnsEnabled | Enable `Hierarchical namespace` for Azure DataLake storage account | `true`,`false` | No | `false`|
|--- | **Following parameters are only for NFS protocol** | --- | --- |--- |
|mountPermissions | Specify mounted folder permissions |The default is `0777`. If set to `0`, driver will not perform `chmod` after mount. | `0777` | No |

## Create a storage class

A storage class is used to define how an Azure Blob storage container is created. A storage account is automatically created in the node resource group for use with the storage class to hold the Azure Blob storage container.

1. Create a file named azure-blob-nfs-sc.yaml and copy in the following example manifest:

    ```yml
    apiVersion: storage.k8s.io/v1
    kind: StorageClass
    metadata:
      name: blob-nfs
    provisioner: blob.csi.azure.com
    parameters:
      protocol: nfs
    mountOptions:
        - nconnect=8  # only supported on linux kernel version >= 5.3
    ```

2. Create the storage class with the [kubectl create][kubectl-create] command:

    ```bash
    kubectl create -f azure-blob--nfs-sc.yaml
    ```

## Create a persistent volume claim

A persistent volume claim (PVC) uses the storage class object to dynamically provision an Azure Blob storage container. The following YAML can be used to create a persistent volume claim 100 GB in size with ReadWriteMany access. For more information on access modes, see the [Kubernetes persistent volume][kubernetes-volumes] documentation.

1. Create a file named azure-blob-nfs-pvc.yaml and copy in the following YAML. Make sure that the *storageClassName* matches the storage class created in the last step:

    ```yml
    apiVersion: apps/v1
    apiVersion: v1
    kind: PersistentVolumeClaim
    - metadata:
        name: persistent-storage
        annotations:
          volume.beta.kubernetes.io/storage-class: blob-nfs
      spec:
        accessModes: ["ReadWriteMany"]
        storageClassName: my-blobstorage
        resources:
          requests:
            storage: 100Gi
    ```

2. Create the persistent volume claim with the kubectl create command:

    ```bash
    kubectl create -f azure-blob-nfs-pvc.yaml
    ```

Once completed, the Blob storage container will be created. You can use the [kubectl exec][kubectl-exec] command to view the status of the PVC:

```bash
kubectl exec -it statefulset-blob-0 -- df -h
```

## Use the persistent volume

The following YAML creates a pod that uses the persistent volume claim my-blobstorage to mount the Azure Blob storage at the `*`/mnt/blob' path.

1. Create a file named azure-pvc-blob.yaml, and copy in the following YAML. Make sure that the claimName matches the PVC created in the previous step.

    ```yml
    kind: Pod
    apiVersion: v1
    metadata:
      name: mypod
    spec:
      containers:
      - name: persistent-storage
        image: mcr.microsoft.com/oss/nginx/nginx:1.17.3-alpine
        command:
            - "/bin/sh"
            - "-c"
            - while true; do echo $(date) >> /mnt/blob/outfile; sleep 1; done
        volumeMounts:
        - mountPath: "/mnt/blob"
          name: persistent-storage
      volumes:
        - name: volume
          persistentVolumeClaim:
            claimName: my-blobstorage
    ```

2. Create the pod with the [kubectl apply][kubectl-apply] command:

   ```bash
   kubectl apply -f azure-pvc-blob.yaml
   ```

## Next steps

- To learn how to use CSI driver for Azure Blob storage, see [Use Azure Blob storage with CSI driver][azure-blob-storage-csi].
- To learn how to manually setup a static persistent volume, see [Create and use a volume with Azure Blob storage][azure-csi-blob-storage-static].
- For associated best practices, see [Best practices for storage and backups in AKS][operator-best-practices-storage].

<!-- LINKS - external -->
[kubectl-create]: https://kubernetes.io/docs/user-guide/kubectl/v1.8/#create
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubernetes-files]: https://github.com/kubernetes/examples/blob/master/staging/volumes/azure_file/README.md
[kubernetes-secret]: https://kubernetes.io/docs/concepts/configuration/secret/
[kubernetes-volumes]: https://kubernetes.io/docs/concepts/storage/volumes/
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
[azure-csi-blob-storage-static]: azure-csi-blob-storage-manual.md
[blob-storage-csi-driver]: azure-blob-csi.md
