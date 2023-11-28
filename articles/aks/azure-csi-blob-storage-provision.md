---
title: Create a persistent volume with Azure Blob storage in Azure Kubernetes Service (AKS)
titleSuffix: Azure Kubernetes Service
description: Learn how to create a static or dynamic persistent volume with Azure Blob storage for use with multiple concurrent pods in Azure Kubernetes Service (AKS)
ms.topic: article
ms.custom: devx-track-linux
ms.date: 11/28/2023
---

# Create and use a volume with Azure Blob storage in Azure Kubernetes Service (AKS)

Container-based applications often need to access and persist data in an external data volume. If multiple pods need concurrent access to the same storage volume, you can use Azure Blob storage to connect using [blobfuse][blobfuse-overview] or [Network File System][nfs-overview] (NFS).

This article shows you how to:

* Work with a dynamic persistent volume (PV) by installing the Container Storage Interface (CSI) driver and dynamically creating an Azure Blob storage container to attach to a pod.
* Work with a static PV by creating an Azure Blob storage container, or use an existing one and attach it to a pod.

For more information on Kubernetes volumes, see [Storage options for applications in AKS][concepts-storage].

## Before you begin

- If you don't have a storage account that supports the NFS v3 protocol, review [NFS v3 support with Azure Blob storage][azure-blob-storage-nfs-support].

- [Enable the Blob storage CSI driver][enable-blob-csi-driver] on your AKS cluster.

- To support an [Azure DataLake Gen2 storage account][azure-datalake-storage-account] when using blobfuse mount, you'll need to do the following:

   - To create an ADLS account using the driver in dynamic provisioning, specify `isHnsEnabled: "true"` in the storage class parameters.
   - To enable blobfuse access to an ADLS account in static provisioning, specify the mount option `--use-adls=true` in the persistent volume.
   - If you are going to enable a storage account with Hierarchical Namespace, existing persistent volumes should be remounted with `--use-adls=true` mount option.

## Dynamically provision a volume

This section provides guidance for cluster administrators who want to provision one or more persistent volumes that include details of Blob storage for use by a workload. A persistent volume claim (PVC) uses the storage class object to dynamically provision an Azure Blob storage container.

### Dynamic provisioning parameters

|Name | Description | Example | Mandatory | Default value|
|--- | --- | --- | --- | --- |
|skuName | Specify an Azure storage account type (alias: `storageAccountType`). | `Standard_LRS`, `Premium_LRS`, `Standard_GRS`, `Standard_RAGRS` | No | `Standard_LRS`|
|location | Specify an Azure location. | `eastus` | No | If empty, driver will use the same location name as current cluster.|
|resourceGroup | Specify an Azure resource group name. | myResourceGroup | No | If empty, driver will use the same resource group name as current cluster.|
|storageAccount | Specify an Azure storage account name.| storageAccountName | - No for blobfuse mount </br> - Yes for NFSv3 mount. |  - For blobfuse mount: if empty, driver finds a suitable storage account that matches `skuName` in the same resource group. If a storage account name is provided, storage account must exist. </br>  - For NFSv3 mount, storage account name must be provided.|
|networkEndpointType| Specify network endpoint type for the storage account created by driver. If privateEndpoint is specified, a [private endpoint][storage-account-private-endpoint] is created for the storage account. For other cases, a service endpoint will be created for NFS protocol.<sup>1</sup> | `privateEndpoint` | No | For an AKS cluster, add the AKS cluster name to the Contributor role in the resource group hosting the VNET.|
|protocol | Specify blobfuse mount or NFSv3 mount. | `fuse`, `nfs` | No | `fuse`|
|containerName | Specify the existing container (directory) name. | container | No | If empty, driver creates a new container name, starting with `pvc-fuse` for blobfuse or `pvc-nfs` for NFS v3. |
|containerNamePrefix | Specify Azure storage directory prefix created by driver. | my |Can only contain lowercase letters, numbers, hyphens, and length should be fewer than 21 characters. | No |
|server | Specify Azure storage account domain name. | Existing storage account DNS domain name, for example `<storage-account>.privatelink.blob.core.windows.net`. | No | If empty, driver uses default `<storage-account>.blob.core.windows.net` or other sovereign cloud storage account DNS domain name.|
|allowBlobPublicAccess | Allow or disallow public access to all blobs or containers for storage account created by driver. | `true`,`false` | No | `false`|
|storageEndpointSuffix | Specify Azure storage endpoint suffix. | `core.windows.net` | No | If empty, driver will use default storage endpoint suffix according to cloud environment.|
|tags | [Tags][az-tags] would be created in new storage account. | Tag format: 'foo=aaa,bar=bbb' | No | ""|
|matchTags | Match tags when driver tries to find a suitable storage account. | `true`,`false` | No | `false`|
|--- | **Following parameters are only for blobfuse** | --- | --- |--- |
|subscriptionID | Specify Azure subscription ID where blob storage directory will be created. | Azure subscription ID | No | If not empty, `resourceGroup` must be provided.|
|storeAccountKey | Specify store account key to Kubernetes secret. <br><br> Note:  <br> `false` means driver uses kubelet identity to get account key. | `true`,`false` | No | `true`|
|secretName | Specify secret name to store account key. | | No |
|secretNamespace | Specify the namespace of secret to store account key. | `default`,`kube-system`, etc. | No | pvc namespace |
|isHnsEnabled | Enable `Hierarchical namespace` for Azure Data Lake storage account. | `true`,`false` | No | `false`|
|--- | **Following parameters are only for NFS protocol** | --- | --- |--- |
|mountPermissions | Specify mounted folder permissions. |The default is `0777`. If set to `0`, driver won't perform `chmod` after mount. | `0777` | No |

<sup>1</sup> If the storage account is created by the driver, then you only need to specify `networkEndpointType: privateEndpoint` parameter in storage class. The CSI driver creates the private endpoint together with the account. If you bring your own storage account, then you need to [create the private endpoint][storage-account-private-endpoint] for the storage account.

### Create a persistent volume claim using built-in storage class

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

2. Create the persistent volume claim with the [kubectl create][kubectl-create] command:

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

#### Use the persistent volume claim

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

    ```output
    test.txt
    ```

### Create a custom storage class

The default storage classes suit the most common scenarios, but not all. For some cases, you might want to have your own storage class customized with your own parameters. To demonstrate, two examples are shown. One based on using the NFS protocol, and the other using blobfuse.

#### Storage class using NFS protocol

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
    allowVolumeExpansion: true
    mountOptions:
      - nconnect=4
    ```

2. Create the storage class with the [kubectl apply][kubectl-apply] command:

    ```bash
    kubectl apply -f blob-nfs-sc.yaml
    ```

    The output of the command resembles the following example:

    ```output
    storageclass.storage.k8s.io/blob-nfs-premium created
    ```

#### Storage class using blobfuse

In this example, the following manifest configures using blobfuse and mounts a Blob storage container. Use it to update the *skuName* parameter.

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

    ```output
    storageclass.storage.k8s.io/blob-fuse-premium created
    ```

## Statically provision a volume

This section provides guidance for cluster administrators who want to create one or more persistent volumes that include details of Blob storage for use by a workload.

### Static provisioning parameters

|Name | Description | Example | Mandatory | Default value|
|--- | --- | --- | --- | ---|
|volumeHandle | Specify a value the driver can use to uniquely identify the storage blob container in the cluster. | A recommended way to produce a unique value is to combine the globally unique storage account name and container name: `{account-name}_{container-name}`.<br> Note: The `#`, `/` character are reserved for internal use and can't be used in a volume handle. | Yes ||
|volumeAttributes.resourceGroup | Specify Azure resource group name. | myResourceGroup | No | If empty, driver uses the same resource group name as current cluster.|
|volumeAttributes.storageAccount | Specify an existing Azure storage account name. | storageAccountName | Yes ||
|volumeAttributes.containerName | Specify existing container name. | container | Yes ||
|volumeAttributes.protocol | Specify blobfuse mount or NFS v3 mount. | `fuse`, `nfs` | No | `fuse`|
|--- | **Following parameters are only for blobfuse** | --- | --- | --- |
|volumeAttributes.secretName | Secret name that stores storage account name and key (only applies for SMB).| | No ||
|volumeAttributes.secretNamespace | Specify namespace of secret to store account key. | `default` | No | Pvc namespace|
|nodeStageSecretRef.name | Specify secret name that stores one of the following:<br> `azurestorageaccountkey`<br>`azurestorageaccountsastoken`<br>`msisecret`<br>`azurestoragespnclientsecret`. | |  No  |Existing Kubernetes secret name |
|nodeStageSecretRef.namespace | Specify the namespace of secret. | Kubernetes namespace | Yes ||
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
|volumeAttributes.AzureStorageAADEndpoint | Specify the Microsoft Entra endpoint. |  | No ||
|--- | **Following parameters are only for feature: blobfuse read account key or SAS token from key vault** | --- | --- | --- |
|volumeAttributes.keyVaultURL | Specify Azure Key Vault DNS name. | {vault-name}.vault.azure.net | No ||
|volumeAttributes.keyVaultSecretName | Specify Azure Key Vault secret name. | Existing Azure Key Vault secret name. | No ||
|volumeAttributes.keyVaultSecretVersion | Azure Key Vault secret version. | Existing version | No |If empty, driver uses current version.|

### Create a Blob storage container

When you create an Azure Blob storage resource for use with AKS, you can create the resource in the node resource group. This approach allows the AKS cluster to access and manage the blob storage resource.

For this article, create the container in the node resource group. First, get the resource group name with the [az aks show][az-aks-show] command and add the `--query nodeResourceGroup` query parameter. The following example gets the node resource group for the AKS cluster named **myAKSCluster** in the resource group named **myResourceGroup**:

```azurecli-interactive
az aks show --resource-group myResourceGroup --name myAKSCluster --query nodeResourceGroup -o tsv
```

The output of the command resembles the following example:

```azurecli-interactive
MC_myResourceGroup_myAKSCluster_eastus
```

Next, create a container for storing blobs following the steps in the [Manage blob storage][manage-blob-storage] to authorize access and then create the container.

### Mount volume

In this section, you mount the persistent volume using the NFS protocol or Blobfuse.

#### [Mount volume using NFS protocol](#tab/mount-nfs)

Mounting Blob storage using the NFS v3 protocol doesn't authenticate using an account key. Your AKS cluster needs to reside in the same or peered virtual network as the agent node. The only way to secure the data in your storage account is by using a virtual network and other network security settings. For more information on how to set up NFS access to your storage account, see [Mount Blob Storage by using the Network File System (NFS) 3.0 protocol](../storage/blobs/network-file-system-protocol-support-how-to.md).

The following example demonstrates how to mount a Blob storage container as a persistent volume using the NFS protocol.

1. Create a file named `pv-blob-nfs.yaml` and copy in the following YAML. Under `storageClass`, update `resourceGroup`, `storageAccount`, and `containerName`.

   > [!NOTE]
   > `volumeHandle` value should be a unique volumeID for every identical storage blob container in the cluster.
   > The character `#` and `/` are reserved for internal use and cannot be used.

    ```yml
    apiVersion: v1
    kind: PersistentVolume
    metadata:
      annotations:
        pv.kubernetes.io/provisioned-by: blob.csi.azure.com
      name: pv-blob
    spec:
      capacity:
        storage: 1Pi
      accessModes:
        - ReadWriteMany
      persistentVolumeReclaimPolicy: Retain  # If set as "Delete" container would be removed after pvc deletion
      storageClassName: azureblob-nfs-premium
      mountOptions:
        - nconnect=4
      csi:
        driver: blob.csi.azure.com
        # make sure volumeid is unique for every identical storage blob container in the cluster
        # character `#` and `/` are reserved for internal use and cannot be used in volumehandle
        volumeHandle: account-name_container-name
        volumeAttributes:
          resourceGroup: resourceGroupName
          storageAccount: storageAccountName
          containerName: containerName
          protocol: nfs
    ```

   > [!NOTE]
   > While the [Kubernetes API](https://github.com/kubernetes/kubernetes/blob/release-1.26/pkg/apis/core/types.go#L303-L306) **capacity** attribute is mandatory, this value isn't used by the Azure Blob storage CSI driver because you can flexibly write data until you reach your storage account's capacity limit. The value of the `capacity` attribute is used only for size matching between *PersistentVolumes* and *PersistenVolumeClaims*. We recommend using a fictitious high value. The pod sees a mounted volume with a fictitious size of 5 Petabytes.

2. Run the following command to create the persistent volume using the [kubectl create][kubectl-create] command referencing the YAML file created earlier:

    ```bash
    kubectl create -f pv-blob-nfs.yaml
    ```

3. Create a `pvc-blob-nfs.yaml` file with a *PersistentVolumeClaim*. For example:

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

4. Run the following command to create the persistent volume claim using the [kubectl create][kubectl-create] command referencing the YAML file created earlier:

    ```bash
    kubectl create -f pvc-blob-nfs.yaml
    ```

#### [Mount volume using Blobfuse](#tab/mount-blobfuse)

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

   > [!NOTE]
   > `volumeHandle` value should be a unique volumeID for every identical storage blob container in the cluster.
   > The character `#` and `/` are reserved for internal use and cannot be used.

    ```yml
    apiVersion: v1
    kind: PersistentVolume
    metadata:
      annotations:
        pv.kubernetes.io/provisioned-by: blob.csi.azure.com
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
        # volumeid has to be unique for every identical storage blob container in the cluster
        # character `#`and `/` are reserved for internal use and cannot be used in volumehandle
        volumeHandle: account-name_container-name
        volumeAttributes:
          containerName: containerName
        nodeStageSecretRef:
          name: azure-secret
          namespace: default
    ```

3. Run the following command to create the persistent volume using the [kubectl create][kubectl-create] command referencing the YAML file created earlier:

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

5. Run the following command to create the persistent volume claim using the [kubectl create][kubectl-create] command referencing the YAML file created earlier:

    ```bash
    kubectl create -f pvc-blobfuse.yaml
    ```

---

### Use the persistent volume

The following YAML creates a pod that uses the persistent volume or persistent volume claim named **pvc-blob** created earlier, to mount the Azure Blob storage at the `/mnt/blob` path.

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

2. Run the following command to create the pod and mount the PVC using the [kubectl create][kubectl-create] command referencing the YAML file created earlier:

    ```bash
    kubectl create -f nginx-pod-blob.yaml
    ```

3. Run the following command to create an interactive shell session with the pod to verify the Blob storage mounted:

    ```bash
    kubectl exec -it nginx-blob -- df -h
    ```

    The output from the command resembles the following example:

    ```output
    Filesystem      Size  Used Avail Use% Mounted on
    ...
    blobfuse         14G   41M   13G   1% /mnt/blob
    ...
    ```

## Next steps

- To learn how to use CSI driver for Azure Blob storage, see [Use Azure Blob storage with CSI driver][azure-blob-storage-csi].
- For associated best practices, see [Best practices for storage and backups in AKS][operator-best-practices-storage].

<!-- LINKS - external -->
[kubernetes-volumes]: https://kubernetes.io/docs/concepts/storage/volumes/
[blobfuse-overview]: https://github.com/Azure/azure-storage-fuse
[nfs-overview]: https://en.wikipedia.org/wiki/Network_File_System
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubernetes-secret]: https://kubernetes.io/docs/concepts/configuration/secret/
[kubectl-create]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#create
[kubernets-secret]: https://kubernetes.io/docs/concepts/configuration/secret

<!-- LINKS - internal -->
[operator-best-practices-storage]: operator-best-practices-storage.md
[concepts-storage]: concepts-storage.md
[azure-blob-storage-csi]: azure-blob-csi.md
[azure-blob-storage-nfs-support]: ../storage/blobs/network-file-system-protocol-support.md
[enable-blob-csi-driver]: azure-blob-csi.md#before-you-begin
[az-tags]: ../azure-resource-manager/management/tag-resources.md
[sas-tokens]: ../storage/common/storage-sas-overview.md
[azure-datalake-storage-account]: ../storage/blobs/upgrade-to-data-lake-storage-gen2-how-to.md
[storage-account-private-endpoint]: ../storage/common/storage-private-endpoints.md
[manage-blob-storage]: ../storage/blobs/blob-containers-cli.md
