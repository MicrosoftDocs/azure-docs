---
title: Create a static persistent volume with Azure Blob storage in Azure Kubernetes Service (AKS)
titleSuffix: Azure Kubernetes Service
description: Learn how to manually create a persistent volume with Azure Blob storage for use with multiple concurrent pods in Azure Kubernetes Service (AKS)
services: container-service
ms.topic: article
ms.date: 06/02/2022

---

# Create and use a static volume with Azure Blob storage in Azure Kubernetes Service (AKS)

Container-based applications often need to access and persist data in an external data volume. If multiple pods need concurrent access to the same storage volume, you can use Azure Blob storage to connect using [blobfuse][blobfuse-overview] or [Network File System][nfs-overview] (NFS). This article shows you how to manually create an Azure Blob storage container and attach it to a pod in AKS.

For more information on Kubernetes volumes, see [Storage options for applications in AKS][concepts-storage].

## Before you begin

This article assumes that you have an existing AKS cluster running version 1.21 or higher. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli], [using Azure PowerShell][aks-quickstart-powershell], or [using the Azure portal][aks-quickstart-portal].

## Storage class for static parameters

|Name | Description | Example | Mandatory | Default value|
|--- | --- | --- | --- | ---|
|volumeAttributes.resourceGroup | Specify Azure resource group name | myResourceGroup | No | If empty, driver will use the same resource group name as current cluster.|
|volumeAttributes.storageAccount | Specify existing Azure storage account name | STORAGE_ACCOUNT_NAME | Yes ||
|volumeAttributes.containerName | Specify existing container name | container | Yes ||
|volumeAttributes.protocol | Specify blobfuse mount or NFSv3 mount | `fuse`, `nfs` | No | `fuse`|
|--- | **Following parameters are only for blobfuse** | --- | --- | --- |
|volumeAttributes.secretName | Secret name that stores storage account name and key (only applies for SMB)| | No ||
|volumeAttributes.secretNamespace | Specify namespace of secret to store account key | `default` | No | Pvc namespace|
|nodeStageSecretRef.name | Specify secret name that stores (see examples below):<br>`azurestorageaccountkey`<br>`azurestorageaccountsastoken`<br>`msisecret`<br>`azurestoragespnclientsecret` | |Existing Kubernetes secret name |  No  |
|nodeStageSecretRef.namespace | Specify the namespace of secret | k8s namespace | Yes ||
|--- | **Following parameters are only for NFS protocol** | --- | --- | --- |
|volumeAttributes.mountPermissions | Specify mounted folder permissions | `0777` | No ||
|--- | **Following parameters are only for NFS vnet setting** | --- | --- | --- |
|vnetResourceGroup | Specify vnet resource group where virtual network is | myResourceGroup | No | If empty, driver will use the `vnetResourceGroup` value specified in the Azure cloud config file.|
|vnetName | Specify the virtual network name | aksVNet | No | If empty, driver will use the `vnetName` value specified in the Azure cloud config file.|
|subnetName | Specify the existing subnet name of the agent node | aksSubnet | No | If empty, driver will use the `subnetName` value in azure cloud config file. |
|--- | **Following parameters are only for feature: blobfuse [Managed Identity and Service Principal Name auth](https://github.com/Azure/azure-storage-fuse#environment-variables)** | --- | --- |--- |
|volumeAttributes.AzureStorageAuthType | Specify the authentication type | `Key`, `SAS`, `MSI`, `SPN` | No | `Key`|
|volumeAttributes.AzureStorageIdentityClientID | Specify the Identity Client ID |  | No ||
|volumeAttributes.AzureStorageIdentityObjectID | Specify the Identity Object ID |  | No ||
|volumeAttributes.AzureStorageIdentityResourceID | Specify the Identity Resource ID |  | No ||
|volumeAttributes.MSIEndpoint | Specify the MSI endpoint |  | No ||
|volumeAttributes.AzureStorageSPNClientID | Specify the Azure Service Principal Name (SPN) Client ID |  | No ||
|volumeAttributes.AzureStorageSPNTenantID | Specify the Azure SPN Tenant ID |  | No ||
|volumeAttributes.AzureStorageAADEndpoint | Specify the Azure Active Directory (AAD) Endpoint |  | No ||
|--- | **Following parameters are only for feature: blobfuse read account key or SAS token from key vault** | --- | --- | --- |
|volumeAttributes.keyVaultURL | Specify Azure Key Vault DNS name | {vault-name}.vault.azure.net | No ||
|volumeAttributes.keyVaultSecretName | Specify Azure Key Vault secret name | Existing Azure Key Vault secret name | No ||
|volumeAttributes.keyVaultSecretVersion | Azure Key Vault secret version | existing version | No |If empty, driver will use "current version"|

## Create a Blob storage container

When you create an Azure Blob storage resource for use with AKS, you can create the resource in the node resource group. This approach allows the AKS cluster to access and manage the blob storage resource. If you instead create the blob storage resource in a separate resource group, you must grant the Azure Kubernetes Service managed identity for your cluster the [Contributor][rbac-contributor-role] role to the blob storage resource group.

For this article, create the container in the node resource group. First, get the resource group name with the [az aks show][az-aks-show] command and add the `--query nodeResourceGroup` query parameter. The following example gets the node resource group for the AKS cluster named **myAKSCluster** in the resource group named **myResourceGroup**:

```bash
$ az aks show --resource-group myResourceGroup --name myAKSCluster --query nodeResourceGroup -o tsv

MC_myResourceGroup_myAKSCluster_eastus
```

Now create a container for storing blobs following the steps in the [Manage blob storage][manage-blob-storage] to authorize access and then create the container.

## Mount Blob storage as a volume using Blobfuse

### Authenticate using a managed identity

The following example demonstrates how to mount a Blob storage container using Blobfuse and authenticate against the storage account using the cluster's system-assigned managed identity. For more information about using managed identities, see [Use managed identities in Azure Kubernetes Service][use-managed-identity].

1. Create a `storageclass-blobfuse-existing-container.yaml` file. Under `storageClass`, update `resourceGroup`, `storageAccount`, and `containerName`. For example:

    ```yml
    apiVersion: storage.k8s.io/v1
    kind: StorageClass
    metadata:
      name: blob-fuse
    provisioner: blob.csi.azure.com
    parameters:
      resourceGroup: EXISTING_RESOURCE_GROUP_NAME
      storageAccount: EXISTING_STORAGE_ACCOUNT_NAME
      containerName: EXISTING_CONTAINER_NAME
      server: SERVER_ADDRESS  # optional, provide a new address to replace default "accountname.blob.core.windows.net"
    reclaimPolicy: Retain  # if set as "Delete" container would be removed after pvc deletion
    volumeBindingMode: Immediate
    allowVolumeExpansion: true
    mountOptions:
      - -o allow_other
      - --file-cache-timeout-in-seconds=120
      - --use-attr-cache=true
      - --cancel-list-on-mount-seconds=60  # prevent billing charges on mounting
      - -o attr_timeout=120
      - -o entry_timeout=120
      - -o negative_timeout=120
      - --cache-size-mb=1000  # Default will be 80% of available memory, eviction will happen beyond that.
    ```

2. Run the following command to create the storage class using the `kubectl create` command referencing the YAML file created earlier:

   ```bash
   kubectl create -f storageclass-blobfuse-existing-container.yaml
   ```

3. Create a `pv-blobfuse-existing-container.yaml` file with a *PersistentVolume*. For example:

   ```yml
   ---
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
      storageClassName: blob-fuse
   ```

4. Run the following command to create the persistent volume using the `kubectl create` command referencing the YAML file created earlier:

   ```yml
   kubectl create -f pvc-blob-existing-container.yaml
   ```

### Authenticate using an Azure secret or SAS tokens

Kubernetes needs credentials to access the Blob storage container created earlier. These credentials are stored in a Kubernetes secret, which is referenced when you create a Kubernetes pod.

Use the `kubectl create secret command` to create the secret. You can authenticate using a [Kubernetes secret][kubernetes-secret] or [shared access signature][sas-tokens] (SAS) tokens. 

# [Secret](#tab/secret)

The following example creates a secret named *azure-secret* and populates the *azurestorageaccountname* and *azurestorageaccountkey*. You need to provide the account name and key from an existing Azure storage account.

```bash
kubectl create secret generic azure-secret --from-literal azurestorageaccountname=NAME --from-literal azurestorageaccountkey="KEY" --type=Opaque
```

# [SAStokens](#tab/sastokens)

The following example creates secret named *azure-secret* and populates the *azurestorageaccountname* and *azurestorageaccountsastoken*. You need to provide the account name and shared access signature from an existing Azure storage account.

```bash
kubectl create secret generic azure-secret --from-literal azurestorageaccountname=NAME --from-literal azurestorageaccountsastoken
="sastoken" --type=Opaque
```

---
## Next steps

- For Azure File CSI driver parameters, see [CSI driver parameters][CSI driver parameters].
- For associated best practices, see [Best practices for storage and backups in AKS][operator-best-practices-storage].

<!-- LINKS - external -->
[kubectl-create]: https://kubernetes.io/docs/user-guide/kubectl/v1.8/#create
[kubernetes-files]: https://github.com/kubernetes/examples/blob/master/staging/volumes/azure_file/README.md
[kubernetes-secret]: https://kubernetes.io/docs/concepts/configuration/secret/
[kubernetes-volumes]: https://kubernetes.io/docs/concepts/storage/volumes/
[smb-overview]: /windows/desktop/FileIO/microsoft-smb-protocol-and-cifs-protocol-overview
[kubernetes-security-context]: https://kubernetes.io/docs/tasks/configure-pod-container/security-context/
[CSI driver parameters]: https://github.com/kubernetes-sigs/azurefile-csi-driver/blob/master/docs/driver-parameters.md#static-provisionbring-your-own-file-share

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
