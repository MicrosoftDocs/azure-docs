---
title: Use Azure Container Storage with Azure managed disks
description: Configure Azure Container Storage for use with Azure managed disks. Create a storage pool, select a storage class, create a persistent volume claim, and attach the persistent volume to a pod.
author: khdownie
ms.service: azure-container-storage
ms.topic: how-to
ms.date: 07/23/2024
ms.author: kendownie
ms.custom: references_regions
---

# Use Azure Container Storage with Azure managed disks

[Azure Container Storage](container-storage-introduction.md) is a cloud-based volume management, deployment, and orchestration service built natively for containers. This article shows you how to configure Azure Container Storage to use Azure managed disks as back-end storage for your Kubernetes workloads. At the end, you'll have a pod that's using Azure managed disks as its storage.

## Prerequisites

[!INCLUDE [container-storage-prerequisites](../../../includes/container-storage-prerequisites.md)]

- To use Azure Container Storage with Azure managed disks, your AKS cluster must have a node pool of at least three [general purpose VMs](/azure/virtual-machines/sizes-general) such as **standard_d4s_v5** for the cluster nodes, each with a minimum of four virtual CPUs (vCPUs).

## Create and attach persistent volumes

Follow these steps to create and attach a persistent volume.

### 1. Create a storage pool

First, create a storage pool, which is a logical grouping of storage for your Kubernetes cluster, by defining it in a YAML manifest file.

You have the following options for creating a storage pool:

- [Create a dynamic storage pool](#create-a-dynamic-storage-pool)
- [Create a pre-provisioned storage pool](#create-a-pre-provisioned-storage-pool) using pre-provisioned Azure managed disks
- [Create a dynamic storage pool using your own encryption key (optional)](#create-a-dynamic-storage-pool-using-your-own-encryption-key-optional)

If you enabled Azure Container Storage using `az aks create` or `az aks update` commands, you might already have a storage pool. Use `kubectl get sp -n acstor` to get the list of storage pools. If you have a storage pool already available that you want to use, you can skip this step and proceed to [Display the available storage classes](#2-display-the-available-storage-classes).

#### Create a dynamic storage pool

Follow these steps to create a dynamic storage pool for Azure Disks.

1. Use your favorite text editor to create a YAML manifest file such as `code acstor-storagepool.yaml`.

1. Paste in the following code. The storage pool **name** value can be whatever you want. For **skuName**, specify the level of performance and redundancy. Acceptable values are Premium_LRS, Standard_LRS, StandardSSD_LRS, UltraSSD_LRS, Premium_ZRS, PremiumV2_LRS, and StandardSSD_ZRS. For **storage**, specify the amount of storage capacity for the pool in Gi or Ti.

   ```yml
   apiVersion: containerstorage.azure.com/v1
   kind: StoragePool
   metadata:
     name: azuredisk
     namespace: acstor
   spec:
     poolType:
       azureDisk:
         skuName: Premium_LRS
     resources:
       requests:
         storage: 1Ti
   ```

   If you're using UltraSSD_LRS or PremiumV2_LRS disks, you can set IOPS and throughput using the `IOPSReadWrite` and `MBpsReadWrite` parameters in your storage pool definition.

   `IOPSReadWrite` refers to the number of IOPS allowed for Ultra SSD and Premium v2 LRS disks. For more information, see [Ultra Disk IOPS](/azure/virtual-machines/disks-types#ultra-disk-iops) and [Premium SSD v2 IOPS](/azure/virtual-machines/disks-types#premium-ssd-v2-iops).

   `MBpsReadWrite` refers to the bandwidth allowed for Ultra SSD and Premium v2 LRS disks. MBps refers to millions of bytes per second (MB/s = 10^6 Bytes per second). For more information, see [Ultra Disk throughput](/azure/virtual-machines/disks-types#ultra-disk-throughput) and [Premium SSD v2 throughput](/azure/virtual-machines/disks-types#premium-ssd-v2-throughput).

   ```yml
   apiVersion: containerstorage.azure.com/v1
   kind: StoragePool
   metadata:
     name: azuredisk
     namespace: acstor
   spec:
     poolType:
       azureDisk:
         skuName: PremiumV2_LRS
         iopsReadWrite: 5000
         mbpsReadWrite: 200
     resources:
       requests:
         storage: 1Ti
   ```

1. Save the YAML manifest file, and then apply it to create the storage pool.
   
   ```azurecli-interactive
   kubectl apply -f acstor-storagepool.yaml 
   ```
   
   When storage pool creation is complete, you'll see a message like:
   
   ```output
   storagepool.containerstorage.azure.com/azuredisk created
   ```
   
   You can also run this command to check the status of the storage pool. Replace `<storage-pool-name>` with your storage pool **name** value. For this example, the value would be **azuredisk**.
   
   ```azurecli-interactive
   kubectl describe sp <storage-pool-name> -n acstor
   ```

When the storage pool is created, Azure Container Storage will create a storage class on your behalf, using the naming convention `acstor-<storage-pool-name>`. Now you can [display the available storage classes](#2-display-the-available-storage-classes) and [create a persistent volume claim](#3-create-a-persistent-volume-claim).

#### Create a pre-provisioned storage pool

If you have Azure managed disks that are already provisioned, you can create a pre-provisioned storage pool using those disks. Because the disks are already provisioned, you don't need to specify the skuName or storage capacity when creating the storage pool.

Follow these steps to create a pre-provisioned storage pool for Azure Disks.

1. Sign in to the Azure portal.

1. For each disk that you want to use, navigate to the Azure managed disk and select **Settings** > **Properties**. Copy the entire string under **Resource ID** and put it in a text file.

1. Use your favorite text editor to create a YAML manifest file such as `code acstor-storagepool.yaml`.

1. Paste in the following code. The storage pool **name** value can be whatever you want. Replace `<resource-id>` with the resource ID of each managed disk. Save the file.

   ```yml
   apiVersion: containerstorage.azure.com/v1
   kind: StoragePool
   metadata:
     name: sp-preprovisioned
     namespace: acstor
   spec:
     poolType:
       azureDisk:
         disks:
           - reference <resource-id1>
           - reference <resource-id2>
   ```

1. Apply the YAML manifest file to create the storage pool.
   
   ```azurecli-interactive
   kubectl apply -f acstor-storagepool.yaml 
   ```
   
   When storage pool creation is complete, you'll see a message like:
   
   ```output
   storagepool.containerstorage.azure.com/sp-preprovisioned created
   ```
   
   You can also run this command to check the status of the storage pool. Replace `<storage-pool-name>` with your storage pool **name** value. For this example, the value would be **sp-preprovisioned**.
   
   ```azurecli-interactive
   kubectl describe sp <storage-pool-name> -n acstor
   ```

When the storage pool is created, Azure Container Storage will create a storage class on your behalf, using the naming convention `acstor-<storage-pool-name>`. Now you can [display the available storage classes](#2-display-the-available-storage-classes) and [create a persistent volume claim](#3-create-a-persistent-volume-claim).

#### Create a dynamic storage pool using your own encryption key (optional)

All data in an Azure storage account is encrypted at rest. By default, data is encrypted with Microsoft-managed keys. For more control over encryption keys, you can supply customer-managed keys (CMK) when you create your storage pool to encrypt the persistent volumes that you'll create.

To use your own key for server-side encryption, you must have an [Azure Key Vault](/azure/key-vault/general/overview) with a key. The Key Vault should have purge protection enabled, and it must use the Azure RBAC permission model. Learn more about [customer-managed keys on Linux](/azure/virtual-machines/disk-encryption#customer-managed-keys).

When creating your storage pool, you must define the CMK parameters. The required CMK encryption parameters are:

- **keyVersion** specifies the version of the key to use
- **keyName** is the name of your key
- **keyVaultUri** is the uniform resource identifier of the Azure Key Vault, for example `https://user.vault.azure.net`
- **Identity** specifies a managed identity with access to the vault, for example `/subscriptions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourcegroups/MC_user-acstor-westus2-rg_user-acstor-westus2_westus2/providers/Microsoft.ManagedIdentity/userAssignedIdentities/user-acstor-westus2-agentpool`

Follow these steps to create a storage pool using your own encryption key. All persistent volumes created from this storage pool will be encrypted using the same key.

1. Use your favorite text editor to create a YAML manifest file such as `code acstor-storagepool-cmk.yaml`.

1. Paste in the following code, supply the required parameters, and save the file. The storage pool **name** value can be whatever you want. For **skuName**, specify the level of performance and redundancy. Acceptable values are Premium_LRS, Standard_LRS, StandardSSD_LRS, UltraSSD_LRS, Premium_ZRS, PremiumV2_LRS, and StandardSSD_ZRS. For **storage**, specify the amount of storage capacity for the pool in Gi or Ti. Be sure to supply the CMK encryption parameters.

   ```yml
   apiVersion: containerstorage.azure.com/v1
   kind: StoragePool
   metadata:
     name: azuredisk
     namespace: acstor
   spec:
     poolType:
       azureDisk:
         skuName: Premium_LRS
         encryption: {
           keyVersion: "<key-version>",
           keyName: "<key-name>",
           keyVaultUri: "<key-vault-uri>",
           identity: "<identity>"
         }
     resources:
       requests:
         storage: 1Ti
   ```

1. Apply the YAML manifest file to create the storage pool.
   
   ```azurecli-interactive
   kubectl apply -f acstor-storagepool-cmk.yaml 
   ```
   
   When storage pool creation is complete, you'll see a message like:
   
   ```output
   storagepool.containerstorage.azure.com/azuredisk created
   ```
   
   You can also run this command to check the status of the storage pool. Replace `<storage-pool-name>` with your storage pool **name** value. For this example, the value would be **azuredisk**.
   
   ```azurecli-interactive
   kubectl describe sp <storage-pool-name> -n acstor
   ```

When the storage pool is created, Azure Container Storage will create a storage class on your behalf, using the naming convention `acstor-<storage-pool-name>`.

### 2. Display the available storage classes

When the storage pool is ready to use, you must select a storage class to define how storage is dynamically created when creating persistent volume claims and deploying persistent volumes.

Run `kubectl get sc` to display the available storage classes. You should see a storage class called `acstor-<storage-pool-name>`.

> [!IMPORTANT]
> Don't use the storage class that's marked **internal**. It's an internal storage class that's needed for Azure Container Storage to work.

### 3. Create a persistent volume claim

A persistent volume claim (PVC) is used to automatically provision storage based on a storage class. Follow these steps to create a PVC using the new storage class. 

1. Use your favorite text editor to create a YAML manifest file such as `code acstor-pvc.yaml`.

1. Paste in the following code and save the file. The PVC `name` value can be whatever you want.

   ```yml
   apiVersion: v1
   kind: PersistentVolumeClaim
   metadata:
     name: azurediskpvc
   spec:
     accessModes:
       - ReadWriteOnce
     storageClassName: acstor-azuredisk # replace with the name of your storage class if different
     resources:
       requests:
         storage: 100Gi
   ```

1. Apply the YAML manifest file to create the PVC.

   ```azurecli-interactive
   kubectl apply -f acstor-pvc.yaml
   ```

   You should see output similar to:

   ```output
   persistentvolumeclaim/azurediskpvc created
   ```

   You can verify the status of the PVC by running the following command:

   ```azurecli-interactive
   kubectl describe pvc azurediskpvc
   ```

Once the PVC is created, it's ready for use by a pod.

### 4. Deploy a pod and attach a persistent volume

Create a pod using [Fio](https://github.com/axboe/fio) (Flexible I/O Tester) for benchmarking and workload simulation, and specify a mount path for the persistent volume. For **claimName**, use the **name** value that you used when creating the persistent volume claim.

1. Use your favorite text editor to create a YAML manifest file such as `code acstor-pod.yaml`.

1. Paste in the following code and save the file.

   ```yml
   kind: Pod
   apiVersion: v1
   metadata:
     name: fiopod
   spec:
     nodeSelector:
       acstor.azure.com/io-engine: acstor
     volumes:
       - name: azurediskpv
         persistentVolumeClaim:
           claimName: azurediskpvc
     containers:
       - name: fio
         image: nixery.dev/shell/fio
         args:
           - sleep
           - "1000000"
         volumeMounts:
           - mountPath: "/volume"
             name: azurediskpv
   ```

1. Apply the YAML manifest file to deploy the pod.

   ```azurecli-interactive
   kubectl apply -f acstor-pod.yaml
   ```

   You should see output similar to the following:

   ```output
   pod/fiopod created
   ```

1. Check that the pod is running and that the persistent volume claim has been bound successfully to the pod:

   ```azurecli-interactive
   kubectl describe pod fiopod
   kubectl describe pvc azurediskpvc
   ```

1. Check fio testing to see its current status:

   ```azurecli-interactive
   kubectl exec -it fiopod -- fio --name=benchtest --size=800m --filename=/volume/test --direct=1 --rw=randrw --ioengine=libaio --bs=4k --iodepth=16 --numjobs=8 --time_based --runtime=60
   ```

You've now deployed a pod that's using Azure Disks as its storage, and you can use it for your Kubernetes workloads.

## Manage persistent volumes and storage pools

Now that you've created a persistent volume, you can detach and reattach it as needed. You can also expand or delete a storage pool.

### Detach and reattach a persistent volume

To detach a persistent volume, delete the pod that the persistent volume is attached to. Replace `<pod-name>` with the name of the pod, for example **fiopod**.

```azurecli-interactive
kubectl delete pods <pod-name>
```

To reattach a persistent volume, simply reference the persistent volume claim name in the YAML manifest file as described in [Deploy a pod and attach a persistent volume](#4-deploy-a-pod-and-attach-a-persistent-volume).

To check which persistent volume a persistent volume claim is bound to, run `kubectl get pvc <persistent-volume-claim-name>`.

### Expand a storage pool

You can expand storage pools backed by Azure Disks to scale up quickly and without downtime. Shrinking storage pools isn't currently supported. Storage pool expansion isn't supported for Ultra Disks or Premium SSD v2.

> [!NOTE]
> Expanding a storage pool can increase your costs for Azure Container Storage and Azure Disks. See the [Azure Container Storage pricing page](https://aka.ms/AzureContainerStoragePricingPage) and [Understand Azure Container Storage billing](container-storage-billing.md).

Currently, storage pool expansion has the following limitation when using `Premium_LRS`, `Standard_LRS`, `StandardSSD_LRS`, `Premium_ZRS`, and `StandardSSD_ZRS` SKUs:

- If your existing storage pool is less than 4 TiB (4,096 GiB), you can only expand it up to 4,095 GiB. To avoid errors, don't attempt to expand your current storage pool beyond 4,095 GiB if it is initially smaller than 4 TiB (4,096 GiB). Storage pools > 4 TiB can be expanded up to the maximum storage capacity available.

Follow these instructions to expand an existing storage pool for Azure Disks.

1. Using a text editor, open the YAML manifest file that you used to create the storage pool, for example `code acstor-storagepool.yaml`.

1. Replace the specified *storage* entry in the YAML manifest file with the desired value. This value must be greater than the current capacity of the storage pool. For example, if the spec is set to `storage: 1Ti`, change it to `storage: 2Ti`. If you created a pre-provisioned storage pool, there won't be a *storage* entry because the storage pool inherited the capacity size from the pre-provisioned Azure Disks. If you don't see a *storage* entry in the YAML, add the following code specifying the desired storage capacity and then save the manifest file:

   ```yml
   spec:
     resources:
       requests:
         storage: 2Ti
   ```

  > [!NOTE]
  > If you have two disks in a storage pool with a capacity of 1 TiB each, and you edit the YAML manifest file to read `storage: 4Ti`, both disks will be expanded to 2 TiB when the YAML is applied, giving you a new total capacity of 4 TiB.

1. Apply the YAML manifest file to expand the storage pool.
   
   ```azurecli-interactive
   kubectl apply -f acstor-storagepool.yaml 
   ```

1. Run this command to check the status of the storage pool. Replace `<storage-pool-name>` with your storage pool **name** value.
   
   ```azurecli-interactive
   kubectl describe sp <storage-pool-name> -n acstor
   ```

   You should see a message like "the storage pool is expanding." Run the command again after a few minutes and the message should be gone.

1. Run `kubectl get sp -A` and the storage pool should reflect the new size.

### Delete a storage pool

If you want to delete a storage pool, run the following command. Replace `<storage-pool-name>` with the storage pool name.

```azurecli-interactive
kubectl delete sp -n acstor <storage-pool-name>
```

## See also

- [What is Azure Container Storage?](container-storage-introduction.md)
