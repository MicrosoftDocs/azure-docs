---
title: Create a persistent volume with Azure Files in Azure Kubernetes Service (AKS)
titleSuffix: Azure Kubernetes Service
description: Learn how to create a static or dynamic persistent volume with Azure Files for use with multiple concurrent pods in Azure Kubernetes Service (AKS)
ms.topic: article
ms.custom: devx-track-azurecli, devx-track-linux
ms.date: 10/05/2023
---

# Create and use a volume with Azure Files in Azure Kubernetes Service (AKS)

A persistent volume represents a piece of storage that has been provisioned for use with Kubernetes pods. You can use a persistent volume with one or many pods, and it can be dynamically or statically provisioned. If multiple pods need concurrent access to the same storage volume, you can use Azure Files to connect using the [Server Message Block (SMB) protocol][smb-overview]. This article shows you how to dynamically create an Azure file share for use by multiple pods in an Azure Kubernetes Service (AKS) cluster.

This article shows you how to:

* Work with a dynamic persistent volume (PV) by installing the Container Storage Interface (CSI) driver and dynamically creating one or more Azure file shares to attach to a pod.
* Work with a static PV by creating one or more Azure file shares, or use an existing one and attach it to a pod.

For more information on Kubernetes volumes, see [Storage options for applications in AKS][concepts-storage].

## Before you begin

* You need an Azure [storage account][azure-storage-account].
* Make sure you have Azure CLI version 2.0.59 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].
* When choosing between standard and premium file shares, it's important you understand the provisioning model and requirements of the expected usage pattern you plan to run on Azure Files. For more information, see [Choosing an Azure Files performance tier based on usage patterns][azure-files-usage].

## Dynamically provision a volume

This section provides guidance for cluster administrators who want to provision one or more persistent volumes that include details of one or more shares on Azure Files. A persistent volume claim (PVC) uses the storage class object to dynamically provision an Azure Files file share.

### Dynamic provisioning parameters

|Name | Meaning | Available Value | Mandatory | Default value
|--- | --- | --- | --- | ---
|accountAccessTier | [Access tier for storage account][access-tiers-overview] | Standard account can choose `Hot` or `Cool`, and Premium account can only choose `Premium`. | No | Empty. Use default setting for different storage account types. |
|accountQuota | Limits the quota for an account. You can specify a maximum quota in GB (102400GB by default). If the account exceeds the specified quota, the driver skips selecting the account. ||No |`102400` |
|allowBlobPublicAccess | Allow or disallow public access to all blobs or containers for storage account created by driver. | `true` or `false` | No | `false` |
|disableDeleteRetentionPolicy | Specify whether disable DeleteRetentionPolicy for storage account created by driver. | `true` or `false` | No | `false` |
|enableLargeFileShares |Specify whether to use a storage account with large file shares enabled or not. If this flag is set to `true` and a storage account with large file shares enabled doesn't exist, a new storage account with large file shares enabled is created. This flag should be used with the Standard sku as the storage accounts created with Premium sku have `largeFileShares` option enabled by default. |`true` or `false` |No |false |
|folderName | Specify folder name in Azure file share. | Existing folder name in Azure file share. | No | If folder name doesn't exist in file share, the mount fails. |
|getLatestAccount |Determins whether to get the latest account key based on the creation time. This driver gets the first key by default. |`true` or `false` |No |`false` |
|location | Specify the Azure region of the Azure storage account.| For example, `eastus`. | No | If empty, driver uses the same location name as current AKS cluster.|
|matchTags | Match tags when driver tries to find a suitable storage account. | `true` or `false` | No | `false` |
|networkEndpointType | Specify network endpoint type for the storage account created by driver. If `privateEndpoint` is specified, a private endpoint is created for the storage account. For other cases, a service endpoint is created by default. | "",`privateEndpoint`| No | "" |
|protocol | Specify file share protocol. | `smb`, `nfs` | No | `smb` |
|requireInfraEncryption | Specify whether or not the service applies a secondary layer of encryption with platform managed keys for data at rest for storage account created by driver. | `true` or `false` | No | `false` |
|resourceGroup | Specify the resource group for the Azure Disks.| Existing resource group name | No | If empty, driver uses the same resource group name as current AKS cluster.|
|selectRandomMatchingAccount | Determines whether to randomly select a matching account. By default, the driver always selects the first matching account in alphabetical order (Note: This driver uses account search cache, which results in uneven distribution of file creation across multiple accounts). | `true` or `false` |No | `false` |
|server | Specify Azure storage account server address. | Existing server address, for example `accountname.privatelink.file.core.windows.net`. | No | If empty, driver uses default `accountname.file.core.windows.net` or other sovereign cloud account address. |
|shareAccessTier | [Access tier for file share][storage-tiers] | General purpose v2 account can choose between `TransactionOptimized` (default), `Hot`, and `Cool`. Premium storage account type for file shares only. | No | Empty. Use default setting for different storage account types.|
|shareName | Specify Azure file share name. | Existing or new Azure file share name. | No | If empty, driver generates an Azure file share name. |
|shareNamePrefix | Specify Azure file share name prefix created by driver. | Share name can only contain lowercase letters, numbers, hyphens, and length should be fewer than 21 characters. | No |
|skuName | Azure Files storage account type (alias: `storageAccountType`)| `Standard_LRS`, `Standard_ZRS`, `Standard_GRS`, `Standard_RAGRS`, `Standard_RAGZRS`,`Premium_LRS`, `Premium_ZRS` | No | `StandardSSD_LRS`<br> Minimum file share size for Premium account type is 100 GB.<br> ZRS account type is supported in limited regions.<br> NFS file share only supports Premium account type.|
|storageEndpointSuffix | Specify Azure storage endpoint suffix. | `core.windows.net`, `core.chinacloudapi.cn`, etc. | No | If empty, driver uses default storage endpoint suffix according to cloud environment. For example, `core.windows.net`. |
|tags | [Tags][tag-resources] are created in new storage account. | Tag format: 'foo=aaa,bar=bbb' | No | "" |
|--- | **Following parameters are only for SMB protocol** | --- | --- |
|subscriptionID | Specify Azure subscription ID where Azure file share is created. | Azure subscription ID | No | If not empty, `resourceGroup` must be provided. |
|storeAccountKey | Specify whether to store account key to Kubernetes secret. | `true` or `false`<br>`false` means driver uses kubelet identity to get account key. | No | `true` |
|secretName | Specify secret name to store account key. | | No |
|secretNamespace | Specify the namespace of secret to store account key. <br><br> **Note:** <br> If `secretNamespace` isn't specified, the secret is created in the same namespace as the pod. | `default`,`kube-system`, etc. | No | PVC namespace, for example `csi.storage.k8s.io/pvc/namespace` |
|useDataPlaneAPI | Specify whether to use [data plane API][data-plane-api] for file share create/delete/resize, which could solve the SRP API throttling issue because the data plane API has almost no limit, while it would fail when there's firewall or Vnet settings on storage account. | `true` or `false` | No | `false` |
|--- | **Following parameters are only for NFS protocol** | --- | --- |
|mountPermissions | Mounted folder permissions. The default is `0777`. If set to `0`, driver doesn't perform `chmod` after mount | `0777` | No |
|rootSquashType | Specify root squashing behavior on the share. The default is `NoRootSquash` | `AllSquash`, `NoRootSquash`, `RootSquash` | No |
|--- | **Following parameters are only for VNet setting. For example, NFS, private end point** | --- | --- |
|fsGroupChangePolicy | Indicates how the driver changes volume's ownership. Pod `securityContext.fsGroupChangePolicy` is ignored. | `OnRootMismatch` (default), `Always`, `None` | No | `OnRootMismatch`|
|subnetName | Subnet name | Existing subnet name of the agent node. | No | If empty, driver uses the `subnetName` value in Azure cloud config file. |
|vnetName | Virtual network name | Existing virtual network name. | No | If empty, driver uses the `vnetName` value in Azure cloud config file. |
|vnetResourceGroup | Specify VNet resource group where virtual network is defined. | Existing resource group name. | No | If empty, driver uses the `vnetResourceGroup` value in Azure cloud config file. |

### Create a storage class

Storage classes define how to create an Azure file share. A storage account is automatically created in the [node resource group][node-resource-group] for use with the storage class to hold the Azure Files file share. Choose of the following [Azure storage redundancy SKUs][storage-skus] for `skuName`:

* `Standard_LRS`: Standard locally redundant storage (LRS)
* `Standard_GRS`: Standard geo-redundant storage (GRS)
* `Standard_ZRS`: Standard zone redundant storage (ZRS)
* `Standard_RAGRS`: Standard read-access geo-redundant storage (RA-GRS)
* `Premium_LRS`: Premium locally redundant storage (LRS)
* `Premium_ZRS`: pPremium zone redundant storage (ZRS)

> [!NOTE]
> Minimum premium file share is 100GB.

For more information on Kubernetes storage classes for Azure Files, see [Kubernetes Storage Classes][kubernetes-storage-classes].

1. Create a file named `azure-file-sc.yaml` and copy in the following example manifest. For more information on `mountOptions`, see the [Mount options][mount-options] section.

    ```yaml
    kind: StorageClass
    apiVersion: storage.k8s.io/v1
    metadata:
      name: my-azurefile
    provisioner: file.csi.azure.com # replace with "kubernetes.io/azure-file" if aks version is less than 1.21
    allowVolumeExpansion: true
    mountOptions:
     - dir_mode=0777
     - file_mode=0777
     - uid=0
     - gid=0
     - mfsymlinks
     - cache=strict
     - actimeo=30
    parameters:
      skuName: Premium_LRS
    ```

2. Create the storage class using the [`kubectl apply`][kubectl-apply] command.

    ```bash
    kubectl apply -f azure-file-sc.yaml
    ```

### Create a persistent volume claim

A persistent volume claim (PVC) uses the storage class object to dynamically provision an Azure file share. You can use the following YAML to create a persistent volume claim *100 GB* in size with *ReadWriteMany* access. For more information on access modes, see [Kubernetes persistent volume][access-modes].

1. Create a file named `azure-file-pvc.yaml` and copy in the following YAML. Make sure the `storageClassName` matches the storage class you created in the previous step.

    ```yaml
    apiVersion: v1
    kind: PersistentVolumeClaim
    metadata:
      name: my-azurefile
    spec:
      accessModes:
        - ReadWriteMany
      storageClassName: my-azurefile
      resources:
        requests:
          storage: 100Gi
    ```

    > [!NOTE]
    > If using the `Premium_LRS` SKU for your storage class, the minimum value for `storage` must be `100Gi`.

2. Create the persistent volume claim using the [`kubectl apply`][kubectl-apply] command.

    ```bash
    kubectl apply -f azure-file-pvc.yaml
    ```

    Once completed, the file share is created. A Kubernetes secret is also created that includes connection information and credentials. You can use the [`kubectl get`][kubectl-get] command to view the status of the PVC:

    ```bash
    kubectl get pvc my-azurefile
    ```

    The output of the command resembles the following example:

    ```output
    NAME           STATUS    VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS      AGE
    my-azurefile   Bound     pvc-8436e62e-a0d9-11e5-8521-5a8664dc0477   10Gi       RWX            my-azurefile      5m
    ```

### Use the persistent volume

The following YAML creates a pod that uses the persistent volume claim *my-azurefile* to mount the Azure Files file share at the */mnt/azure* path. For Windows Server containers, specify a `mountPath` using the Windows path convention, such as *'D:'*.

1. Create a file named `azure-pvc-files.yaml`, and copy in the following YAML. Make sure the `claimName` matches the PVC you created in the previous step.

    ```yaml
    kind: Pod
apiVersion: v1
metadata:
  name: mypod
spec:
  containers:
    - name: mypod
      image: mcr.microsoft.com/oss/nginx/nginx:1.15.5-alpine
      resources:
        requests:
          cpu: 100m
          memory: 128Mi
        limits:
          cpu: 250m
          memory: 256Mi
      volumeMounts:
        - mountPath: /mnt/azure
          name: volume
  volumes:
   - name: volume
     persistentVolumeClaim:
       claimName: my-azurefile
    ```

2. Create the pod using the [`kubectl apply`][kubectl-apply] command.

    ```bash
    kubectl apply -f azure-pvc-files.yaml
    ```

    You now have a running pod with your Azure Files file share mounted in the */mnt/azure* directory. This configuration can be seen when inspecting your pod using the [`kubectl describe`][kubectl-describe] command. The following condensed example output shows the volume mounted in the container.

    ```output
    Containers:
      mypod:
        Container ID:   docker://053bc9c0df72232d755aa040bfba8b533fa696b123876108dec400e364d2523e
        Image:          mcr.microsoft.com/oss/nginx/nginx:1.15.5-alpine
        Image ID:       docker-pullable://nginx@sha256:d85914d547a6c92faa39ce7058bd7529baacab7e0cd4255442b04577c4d1f424
        State:          Running
          Started:      Fri, 01 Mar 2019 23:56:16 +0000
        Ready:          True
        Mounts:
          /mnt/azure from volume (rw)
          /var/run/secrets/kubernetes.io/serviceaccount from default-token-8rv4z (ro)
    [...]
    Volumes:
      volume:
        Type:       PersistentVolumeClaim (a reference to a PersistentVolumeClaim in the same namespace)
        ClaimName:  my-azurefile
        ReadOnly:   false
    [...]
    ```

### Mount options

The default value for `fileMode` and `dirMode` is *0777* for Kubernetes versions 1.13.0 and above. If you're dynamically creating the persistent volume with a storage class, you can specify mount options on the storage class object. For more information, see [Mount options](https://kubernetes.io/docs/concepts/storage/storage-classes/#mount-options). The following example sets *0777*:

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: my-azurefile
provisioner: file.csi.azure.com # replace with "kubernetes.io/azure-file" if aks version is less than 1.21
allowVolumeExpansion: true
mountOptions:
  - dir_mode=0777
  - file_mode=0777
  - uid=0
  - gid=0
  - mfsymlinks
  - cache=strict
  - actimeo=30
parameters:
  skuName: Premium_LRS
```

### Using Azure tags

For more information on using Azure tags, see [Use Azure tags in Azure Kubernetes Service (AKS)][use-tags].

## Statically provision a volume

This section provides guidance for cluster administrators who want to create one or more persistent volumes that include details of an existing Azure Files share to use with a workload.

### Static provisioning parameters

|Name | Meaning | Available Value | Mandatory | Default value |
|--- | --- | --- | --- | --- |
|volumeAttributes.resourceGroup | Specify an Azure resource group name. | myResourceGroup | No | If empty, driver uses the same resource group name as current cluster. |
|volumeAttributes.storageAccount | Specify an existing Azure storage account name. | storageAccountName | Yes ||
|volumeAttributes.shareName | Specify an Azure file share name. | fileShareName | Yes ||
|volumeAttributes.folderName | Specify a folder name in Azure file share. | folderName | No | If folder name doesn't exist in file share, mount would fail. |
|volumeAttributes.protocol | Specify file share protocol. | `smb`, `nfs` | No | `smb` |
|volumeAttributes.server | Specify Azure storage account server address | Existing server address, for example `accountname.privatelink.file.core.windows.net`. | No | If empty, driver uses default `accountname.file.core.windows.net` or other sovereign cloud account address. |
|--- | **Following parameters are only for SMB protocol** | --- | --- | --- |
|volumeAttributes.secretName | Specify a secret name that stores storage account name and key. | | No |
|volumeAttributes.secretNamespace | Specify a secret namespace. | `default`,`kube-system`, etc. | No | PVC namespace (`csi.storage.k8s.io/pvc/namespace`) |
|nodeStageSecretRef.name | Specify a secret name that stores storage account name and key. | Existing secret name |  Yes  ||
|nodeStageSecretRef.namespace | Specify a secret namespace. | Kubernetes namespace  |  Yes  ||
|--- | **Following parameters are only for NFS protocol** | --- | --- | --- |
|volumeAttributes.fsGroupChangePolicy | Indicates how the driver changes a volume's ownership. Pod `securityContext.fsGroupChangePolicy` is ignored.  | `OnRootMismatch` (default), `Always`, `None` | No | `OnRootMismatch` |
|volumeAttributes.mountPermissions | Specify mounted folder permissions. The default is `0777` | | No ||

### Create an Azure file share

Before you can use an Azure Files file share as a Kubernetes volume, you must create an Azure Storage account and the file share.

1. Get the resource group name using the [`az aks show`][az-aks-show] command with the `--query nodeResourceGroup` parameter.

    ```azurecli-interactive
    az aks show --resource-group myResourceGroup --name myAKSCluster --query nodeResourceGroup -o tsv
    ```

    The output of the command resembles the following example:

    ```azurecli-interactive
    MC_myResourceGroup_myAKSCluster_eastus
    ```

2. Create a storage account using the [`az storage account create`][az-storage-account-create] command with the `--sku` parameter. The following command creates a storage account using the `Standard_LRS` SKU. Make sure to replace the following placeholders:

   * `myAKSStorageAccount` with the name of the storage account
   * `nodeResourceGroupName` with the name of the resource group that the AKS cluster nodes are hosted in
   * `location` with the name of the region to create the resource in. It should be the same region as the AKS cluster nodes.

    ```azurecli-interactive
    az storage account create -n myAKSStorageAccount -g nodeResourceGroupName -l location --sku Standard_LRS
    ```

3. Export the connection string as an environment variable using the following command, which you use to create the file share.

    ```azurecli-interactive
    export AZURE_STORAGE_CONNECTION_STRING=$(az storage account show-connection-string -n storageAccountName -g resourceGroupName -o tsv)
    ```

4. Create the file share using the [`az storage share create`][az-storage-share-create] command. Make sure to replace `shareName` with your share name.

    ```azurecli-interactive
    az storage share create -n shareName --connection-string $AZURE_STORAGE_CONNECTION_STRING
    ```

5. Export the storage account key as an environment variable using the following command.

    ```azurecli-interactive
    STORAGE_KEY=$(az storage account keys list --resource-group nodeResourceGroupName --account-name myAKSStorageAccount --query "[0].value" -o tsv)
    ```

6. Echo the storage account name and key using the following command. Copy this information, as you need these values when creating the Kubernetes volume.

    ```azurecli-interactive
    echo Storage account key: $STORAGE_KEY
    ```

### Create a Kubernetes secret

Kubernetes needs credentials to access the file share created in the previous step. These credentials are stored in a [Kubernetes secret][kubernetes-secret], which is referenced when you create a Kubernetes pod.

1. Create the secret using the `kubectl create secret` command. The following example creates a secret named *azure-secret* and populates the *azurestorageaccountname* and *azurestorageaccountkey* from the previous step. To use an existing Azure storage account, provide the account name and key.

    ```bash
    kubectl create secret generic azure-secret --from-literal=azurestorageaccountname=myAKSStorageAccount --from-literal=azurestorageaccountkey=$STORAGE_KEY
    ```

### Mount file share as a persistent volume

1. Create a new file named `azurefiles-pv.yaml` and copy in the following contents. Under `csi`, update `resourceGroup`, `volumeHandle`, and `shareName`. For mount options, the default value for `fileMode` and `dirMode` is *0777*.

    ```yaml
    apiVersion: v1
    kind: PersistentVolume
    metadata:
      annotations:
        pv.kubernetes.io/provisioned-by: file.csi.azure.com
      name: azurefile
    spec:
      capacity:
        storage: 5Gi
      accessModes:
        - ReadWriteMany
      persistentVolumeReclaimPolicy: Retain
      storageClassName: azurefile-csi
      csi:
        driver: file.csi.azure.com
        readOnly: false
        volumeHandle: unique-volumeid  # make sure this volumeid is unique for every identical share in the cluster
        volumeAttributes:
          resourceGroup: resourceGroupName  # optional, only set this when storage account is not in the same resource group as node
          shareName: aksshare
        nodeStageSecretRef:
          name: azure-secret
          namespace: default
      mountOptions:
        - dir_mode=0777
        - file_mode=0777
        - uid=0
        - gid=0
        - mfsymlinks
        - cache=strict
        - nosharesock
        - nobrl
    ```

2. Create the persistent volume using the [`kubectl create`][kubectl-create] command.

    ```bash
    kubectl create -f azurefiles-pv.yaml
    ```

3. Create a new file named *azurefiles-mount-options-pvc.yaml* and copy the following contents.

    ```yaml
    apiVersion: v1
    kind: PersistentVolumeClaim
    metadata:
      name: azurefile
    spec:
      accessModes:
        - ReadWriteMany
      storageClassName: azurefile-csi
      volumeName: azurefile
      resources:
        requests:
          storage: 5Gi
    ```

4. Create the PersistentVolumeClaim using the [`kubectl apply`][kubectl-apply] command.

    ```bash
    kubectl apply -f azurefiles-mount-options-pvc.yaml
    ```

5. Verify your PersistentVolumeClaim is created and bound to the PersistentVolume using the [`kubectl get`][kubectl-get] command.

    ```bash
    kubectl get pvc azurefile
    ```

    The output from the command resembles the following example:

    ```console
    NAME        STATUS   VOLUME      CAPACITY   ACCESS MODES   STORAGECLASS   AGE
    azurefile   Bound    azurefile   5Gi        RWX            azurefile      5s
    ```

6. Update your container spec to reference your *PersistentVolumeClaim* and your pod in the YAML file. For example:

    ```yaml
    ...
      volumes:
      - name: azure
        persistentVolumeClaim:
          claimName: azurefile
    ```

7. A pod spec can't be updated in place, so delete the pod using the [`kubectl delete`][kubectl-delete] command and recreate it using the [`kubectl apply`][kubectl-apply] command.

    ```bash
    kubectl delete pod mypod
    
    kubectl apply -f azure-files-pod.yaml
    ```

### Mount file share as an inline volume

> [!NOTE]
> To avoid performance issue, we recommend you use a persistent volume instead of an inline volume when numerous pods are accessing the same file share.
> Inline volume can only access secrets in the same namespace as the pod. To specify a different secret namespace, use a [persistent volume][persistent-volume].

To mount the Azure Files file share into your pod, you configure the volume in the container spec.

1. Create a new file named `azure-files-pod.yaml` and copy in the following contents. If you changed the name of the file share or secret name, update the `shareName` and `secretName`. You can also update the `mountPath`, which is the path where the Files share is mounted in the pod. For Windows Server containers, specify a `mountPath` using the Windows path convention, such as *'D:'*.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  nodeSelector:
    kubernetes.io/os: linux
  containers:
    - image: 'mcr.microsoft.com/oss/nginx/nginx:1.15.5-alpine'
      name: mypod
      resources:
        requests:
          cpu: 100m
          memory: 128Mi
        limits:
          cpu: 250m
          memory: 256Mi
      volumeMounts:
        - name: azure
          mountPath: /mnt/azure
  volumes:
    - name: azure
      csi: 
        driver: file.csi.azure.com
        readOnly: false
        volumeAttributes:
          secretName: azure-secret  # required
          shareName: aksshare  # required
          mountOptions: 'dir_mode=0777,file_mode=0777,cache=strict,actimeo=30,nosharesock'  # optional
```

2. Create the pod using the [`kubectl apply`][kubectl-apply] command.

    ```bash
    kubectl apply -f azure-files-pod.yaml
    ```

    You now have a running pod with an Azure Files file share mounted at */mnt/azure*. You can verify the share is mounted successfully using the [`kubectl describe`][kubectl-describe] command.

    ```bash
    kubectl describe pod mypod
    ```

## Next steps

For Azure Files CSI driver parameters, see [CSI driver parameters][CSI driver parameters].

For associated best practices, see [Best practices for storage and backups in AKS][operator-best-practices-storage].

<!-- LINKS - external -->
[kubernetes-secret]: https://kubernetes.io/docs/concepts/configuration/secret/
[smb-overview]: /windows/desktop/FileIO/microsoft-smb-protocol-and-cifs-protocol-overview
[CSI driver parameters]: https://github.com/kubernetes-sigs/azurefile-csi-driver/blob/master/docs/driver-parameters.md#static-provisionbring-your-own-file-share
[kubernetes-storage-classes]: https://kubernetes.io/docs/concepts/storage/storage-classes/#azure-file
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-create]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#create
[data-plane-api]: https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob
[kubectl-describe]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe
[kubectl-delete]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#delete
[access-modes]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes

<!-- LINKS - internal -->
[azure-storage-account]: ../storage/common/storage-introduction.md
[install-azure-cli]: /cli/azure/install-azure-cli
[operator-best-practices-storage]: operator-best-practices-storage.md
[concepts-storage]: concepts-storage.md
[persistent-volume]: #mount-file-share-as-a-persistent-volume
[use-tags]: use-tags.md
[node-resource-group]: faq.md#why-are-two-resource-groups-created-with-aks
[storage-skus]: ../storage/common/storage-redundancy.md
[mount-options]: #mount-options
[az-aks-show]: /cli/azure/aks#az-aks-show
[az-storage-share-create]: /cli/azure/storage/share#az-storage-share-create
[storage-tiers]: ../storage/files/storage-files-planning.md#storage-tiers
[access-tiers-overview]: ../storage/blobs/access-tiers-overview.md
[tag-resources]: ../azure-resource-manager/management/tag-resources.md
[azure-files-usage]: ../storage/files/understand-performance.md#choosing-a-performance-tier-based-on-usage-patterns
[az-storage-account-create]: /cli/azure/storage/account#az-storage-account-create
