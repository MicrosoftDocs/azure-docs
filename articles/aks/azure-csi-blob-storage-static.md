---
title: Create a static persistent volume with Azure Blob storage in Azure Kubernetes Service (AKS)
titleSuffix: Azure Kubernetes Service
description: Learn how to create a static persistent volume with Azure Blob storage for use with multiple concurrent pods in Azure Kubernetes Service (AKS)
services: container-service
ms.topic: article
ms.date: 07/21/2022

---

# Create and use a static volume with Azure Blob storage in Azure Kubernetes Service (AKS)

Container-based applications often need to access and persist data in an external data volume. If multiple pods need concurrent access to the same storage volume, you can use Azure Blob storage to connect using [blobfuse][blobfuse-overview] or [Network File System][nfs-overview] (NFS).

This article shows you how to create an Azure Blob storage container or use an existing one and attach it to a pod in AKS.

For more information on Kubernetes volumes, see [Storage options for applications in AKS][concepts-storage].

## Before you begin

 - This article assumes that you have an existing AKS cluster running version 1.21 or higher. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli], [using Azure PowerShell][aks-quickstart-powershell], or [using the Azure portal][aks-quickstart-portal].

- If you don't have a storage account that supports the NFS v3 protocol, review [NFS v3 support with Azure Blob storage][azure-blob-storage-nfs-support].

- [Enable the Blob storage CSI driver][enable-blob-csi-driver] (preview) on your AKS cluster.

## Static provisioning parameters

|Name | Description | Example | Mandatory | Default value|
|--- | --- | --- | --- | ---|
|volumeAttributes.resourceGroup | Specify Azure resource group name. | myResourceGroup | No | If empty, driver will use the same resource group name as current cluster.|
|volumeAttributes.storageAccount | Specify existing Azure storage account name. | storageAccountName | Yes ||
|volumeAttributes.containerName | Specify existing container name. | container | Yes ||
|volumeAttributes.protocol | Specify blobfuse mount or NFS v3 mount. | `fuse`, `nfs` | No | `fuse`|
|--- | **Following parameters are only for blobfuse** | --- | --- | --- |
|volumeAttributes.secretName | Secret name that stores storage account name and key (only applies for SMB).| | No ||
|volumeAttributes.secretNamespace | Specify namespace of secret to store account key. | `default` | No | Pvc namespace|
|nodeStageSecretRef.name | Specify secret name that stores (see examples below):<br>`azurestorageaccountkey`<br>`azurestorageaccountsastoken`<br>`msisecret`<br>`azurestoragespnclientsecret`. | |Existing Kubernetes secret name |  No  |
|nodeStageSecretRef.namespace | Specify the namespace of secret. | k8s namespace | Yes ||
|--- | **Following parameters are only for NFS protocol** | --- | --- | --- |
|volumeAttributes.mountPermissions | Specify mounted folder permissions. | `0777` | No ||
|--- | **Following parameters are only for NFS VNet setting** | --- | --- | --- |
|vnetResourceGroup | Specify VNet resource group hosting virtual network. | myResourceGroup | No | If empty, driver uses the `vnetResourceGroup` value specified in the Azure cloud config file.|
|vnetName | Specify the virtual network name. | aksVNet | No | If empty, driver uses the `vnetName` value specified in the Azure cloud config file.|
|subnetName | Specify the existing subnet name of the agent node. | aksSubnet | No | If empty, driver uses the `subnetName` value in Azure cloud config file. |
|--- | **Following parameters are only for feature: blobfuse<br> [Managed Identity and Service Principal Name authentication](https://github.com/Azure/azure-storage-fuse#environment-variables)** | --- | --- |--- |
|volumeAttributes.AzureStorageAuthType | Specify the authentication type. | `Key`, `SAS`, `MSI`, `SPN` | No | `Key`|
|volumeAttributes.AzureStorageIdentityClientID | Specify the Identity Client ID. |  | No ||
|volumeAttributes.AzureStorageIdentityObjectID | Specify the Identity Object ID. |  | No ||
|volumeAttributes.AzureStorageIdentityResourceID | Specify the Identity Resource ID. |  | No ||
|volumeAttributes.MSIEndpoint | Specify the MSI endpoint. |  | No ||
|volumeAttributes.AzureStorageSPNClientID | Specify the Azure Service Principal Name (SPN) Client ID. |  | No ||
|volumeAttributes.AzureStorageSPNTenantID | Specify the Azure SPN Tenant ID. |  | No ||
|volumeAttributes.AzureStorageAADEndpoint | Specify the Azure Active Directory (Azure AD) endpoint. |  | No ||
|--- | **Following parameters are only for feature: blobfuse read account key or SAS token from key vault** | --- | --- | --- |
|volumeAttributes.keyVaultURL | Specify Azure Key Vault DNS name. | {vault-name}.vault.azure.net | No ||
|volumeAttributes.keyVaultSecretName | Specify Azure Key Vault secret name. | Existing Azure Key Vault secret name. | No ||
|volumeAttributes.keyVaultSecretVersion | Azure Key Vault secret version. | Existing version | No |If empty, driver uses current version.|

## Create a Blob storage container

When you create an Azure Blob storage resource for use with AKS, you can create the resource in the node resource group. This approach allows the AKS cluster to access and manage the blob storage resource. If instead you create the blob storage resource in a separate resource group, you must grant the Azure Kubernetes Service managed identity for your cluster the [Contributor][rbac-contributor-role] role to the blob storage resource group.

For this article, create the container in the node resource group. First, get the resource group name with the [az aks show][az-aks-show] command and add the `--query nodeResourceGroup` query parameter. The following example gets the node resource group for the AKS cluster named **myAKSCluster** in the resource group named **myResourceGroup**:

```azurecli
az aks show --resource-group myResourceGroup --name myAKSCluster --query nodeResourceGroup -o tsv
```

The output of the command resembles the following example:

```azurecli
MC_myResourceGroup_myAKSCluster_eastus
```

Next, create a container for storing blobs following the steps in the [Manage blob storage][manage-blob-storage] to authorize access and then create the container.

## Mount Blob storage as a volume using NFS

Mounting Blob storage using the NFS v3 protocol doesn't authenticate using an account key. Your AKS cluster needs to reside in the same or peered virtual network as the agent node. The only way to secure the data in your storage account is by using a virtual network and other network security settings. For more information on how to set up NFS access to your storage account, see [Mount Blob Storage by using the Network File System (NFS) 3.0 protocol](../storage/blobs/network-file-system-protocol-support-how-to.md).

The following example demonstrates how to mount a Blob storage container as a persistent volume using the NFS protocol.

1. Create a file named `pv-blob-nfs.yaml` and copy in the following YAML. Under `storageClass`, update `resourceGroup`, `storageAccount`, and `containerName`.

    ```yml
    apiVersion: v1
    kind: PersistentVolume
    metadata:
      name: pv-blob
    spec:
      capacity:
        storage: 10Gi
      accessModes:
        - ReadWriteMany
      persistentVolumeReclaimPolicy: Retain  # If set as "Delete" container would be removed after pvc deletion
      storageClassName: azureblob-nfs-premium
      csi:
        driver: blob.csi.azure.com
        readOnly: false
        # make sure this volumeid is unique in the cluster
        # `#` is not allowed in self defined volumeHandle
        volumeHandle: unique-volumeid
        volumeAttributes:
          resourceGroup: resourceGroupName
          storageAccount: storageAccountName
          containerName: containerName
          protocol: nfs
    ```

2. Run the following command to create the persistent volume using the `kubectl create` command referencing the YAML file created earlier:

    ```bash
    kubectl create -f pv-blob-nfs.yaml
    ```

3. Create a `pvc-blob-nfs.yaml` file with a *PersistentVolume*. For example:

    ```yml
    kind: PersistentVolumeClaim
    apiVersion: v1
    metadata:
      name: pvc-blob
    spec:
      accessModes:
        - ReadWriteMany
      resources:
        requests:
          storage: 10Gi
      volumeName: pv-blob
      storageClassName: azureblob-nfs-premium
    ```

4. Run the following command to create the persistent volume claim using the `kubectl create` command referencing the YAML file created earlier:

    ```bash
    kubectl create -f pvc-blob-nfs.yaml
    ```

## Mount Blob storage as a volume using Blobfuse

Kubernetes needs credentials to access the Blob storage container created earlier, which is either an Azure access key or SAS tokens. These credentials are stored in a Kubernetes secret, which is referenced when you create a Kubernetes pod.

1. Use the `kubectl create secret command` to create the secret. You can authenticate using a [Kubernetes secret][kubernetes-secret] or [shared access signature][sas-tokens] (SAS) tokens.

    # [Secret](#tab/secret)

    The following example creates a [Secret object][kubernetes-secret] named *azure-secret* and populates the *azurestorageaccountname* and *azurestorageaccountkey*. You need to provide the account name and key from an existing Azure storage account.

    ```bash
    kubectl create secret generic azure-secret --from-literal azurestorageaccountname=NAME --from-literal azurestorageaccountkey="KEY" --type=Opaque
    ```

    # [SAS tokens](#tab/sas-tokens)

    The following example creates a [Secret object][kubernets-secret] named *azure-sas-token* and populates the *azurestorageaccountname* and *azurestorageaccountsastoken*. You need to provide the account name and shared access signature from an existing Azure storage account.

    ```bash
    kubectl create secret generic azure-sas-token --from-literal azurestorageaccountname=NAME --from-literal azurestorageaccountsastoken
    ="sastoken" --type=Opaque
    ```

    ---

2. Create a `pv-blobfuse.yaml` file. Under `volumeAttributes`, update `containerName`. Under `nodeStateSecretRef`, update `name` with the name of the Secret object created earlier. For example:

    ```yml
    apiVersion: v1
    kind: PersistentVolume
    metadata:
      name: pv-blob
    spec:
      capacity:
        storage: 10Gi
      accessModes:
        - ReadWriteMany
      persistentVolumeReclaimPolicy: Retain  # If set as "Delete" container would be removed after pvc deletion
      storageClassName: azureblob-fuse-premium
      mountOptions:
        - -o allow_other
        - --file-cache-timeout-in-seconds=120
      csi:
        driver: blob.csi.azure.com
        readOnly: false
        # make sure this volumeid is unique in the cluster
        # `#` is not allowed in self defined volumeHandle
        volumeHandle: unique-volumeid
        volumeAttributes:
          containerName: containerName
        nodeStageSecretRef:
          name: azure-secret
          namespace: default
    ```

3. Run the following command to create the persistent volume using the `kubectl create` command referencing the YAML file created earlier:

    ```bash
    kubectl create -f pv-blobfuse.yaml
    ```

4. Create a `pvc-blobfuse.yaml` file with a *PersistentVolume*. For example:

    ```yml
    apiVersion: v1
    kind: PersistentVolumeClaim
    metadata:
      name: pvc-blob
    spec:
      accessModes:
        - ReadWriteMany
      resources:
        requests:
          storage: 10Gi
      volumeName: pv-blob
      storageClassName: azureblob-fuse-premium
    ```

5. Run the following command to create the persistent volume claim using the `kubectl create` command referencing the YAML file created earlier:

    ```bash
    kubectl create -f pvc-blobfuse.yaml
    ```

## Use the persistence volume

The following YAML creates a pod that uses the persistent volume or persistent volume claim named **pvc-blob** created earlier, to mount the Azure Blob storage at the `/mnt/blob' path.

1. Create a file named `nginx-pod-blob.yaml`, and copy in the following YAML. Make sure that the **claimName** matches the PVC created in the previous step when creating a persistent volume for NFS or Blobfuse.

    ```yml
    kind: Pod
    apiVersion: v1
    metadata:
      name: nginx-blob
    spec:
      nodeSelector:
        "kubernetes.io/os": linux
      containers:
        - image: mcr.microsoft.com/oss/nginx/nginx:1.17.3-alpine
          name: nginx-blob
          volumeMounts:
            - name: blob01
              mountPath: "/mnt/blob"
      volumes:
        - name: blob01
          persistentVolumeClaim:
            claimName: pvc-blob
    ```

2. Run the following command to create the pod and mount the PVC using the `kubectl create` command referencing the YAML file created earlier:

    ```bash
    kubectl create -f nginx-pod-blob.yaml
    ```

3. Run the following command to create an interactive shell session with the pod to verify the Blob storage mounted:

    ```bash
    kubectl exec -it nginx-blob -- df -h
    ```

    The output from the command resembles the following example:

    ```bash
    Filesystem      Size  Used Avail Use% Mounted on
    ...
    blobfuse         14G   41M   13G   1% /mnt/blob
    ...
    ```

## Next steps

- To learn how to use CSI driver for Azure Blob storage, see [Use Azure Blob storage with CSI driver][azure-blob-storage-csi].
- To learn how to manually set up a dynamic persistent volume, see [Create and use a dynamic volume with Azure Blob storage][azure-csi-blob-storage-dynamic].
- For associated best practices, see [Best practices for storage and backups in AKS][operator-best-practices-storage].

<!-- LINKS - external -->
[kubectl-create]: https://kubernetes.io/docs/user-guide/kubectl/v1.8/#create
[kubernetes-files]: https://github.com/kubernetes/examples/blob/master/staging/volumes/azure_file/README.md
[kubernetes-secret]: https://kubernetes.io/docs/concepts/configuration/secret/
[kubernetes-volumes]: https://kubernetes.io/docs/concepts/storage/volumes/
[kubernetes-security-context]: https://kubernetes.io/docs/tasks/configure-pod-container/security-context/
[blobfuse-overview]: https://github.com/Azure/azure-storage-fuse
[nfs-overview]: https://en.wikipedia.org/wiki/Network_File_System
[kubernetes-secret]: https://kubernetes.io/docs/concepts/configuration/secret/

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
[azure-csi-blob-storage-dynamic]: azure-csi-blob-storage-dynamic.md
[azure-blob-storage-csi]: azure-blob-csi.md
[rbac-contributor-role]: ../role-based-access-control/built-in-roles.md#contributor
[az-aks-show]: /cli/azure/aks#az-aks-show
[manage-blob-storage]: ../storage/blobs/blob-containers-cli.md
[azure-blob-storage-nfs-support]: ../storage/blobs/network-file-system-protocol-support.md
[enable-blob-csi-driver]: azure-blob-csi.md#before-you-begin
