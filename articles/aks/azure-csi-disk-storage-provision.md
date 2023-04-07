---
title: Create a persistent volume with Azure Disks in Azure Kubernetes Service (AKS)
titleSuffix: Azure Kubernetes Service
description: Learn how to create a static or dynamic persistent volume with Azure Disks for use with multiple concurrent pods in Azure Kubernetes Service (AKS)
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 03/23/2023
---

# Create and use a volume with Azure Disks in Azure Kubernetes Service (AKS)

A persistent volume represents a piece of storage that has been provisioned for use with Kubernetes pods. A persistent volume can be used by one or many pods, and can be dynamically or statically provisioned. This article shows you how to dynamically create persistent volumes with Azure Disks for use by a single pod in an Azure Kubernetes Service (AKS) cluster.

> [!NOTE]
> An Azure disk can only be mounted with *Access mode* type *ReadWriteOnce*, which makes it available to one pod in AKS. If you need to share a persistent volume across multiple pods, use [Azure Files][azure-files-pvc].

This article shows you how to:

* Work with a dynamic persistent volume (PV) by installing the Container Storage Interface (CSI) driver and dynamically creating one or more Azure managed disks to attach to a pod.
* Work with a static PV by creating one or more Azure managed disks, or use an existing one and attach it to a pod.

For more information on Kubernetes volumes, see [Storage options for applications in AKS][concepts-storage].

## Before you begin

* You need an Azure [storage account][azure-storage-account].
* Make sure you have Azure CLI version 2.0.59 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].
* The Azure Disks CSI driver has a limit of 32 volumes per node. The volume count changes based on the size of the node/node pool. Run the [kubectl get][kubectl-get] command to determine the number of volumes that can be allocated per node:

    ```console
    kubectl get CSINode <nodename> -o yaml
    ```

## Dynamically provision a volume

This section provides guidance for cluster administrators who want to provision one or more persistent volumes that include details of Azure Disk storage for use by a workload. A persistent volume claim (PVC) uses the storage class object to dynamically provision an Azure Disk storage container.

### Dynamic provisioning parameters

|Name | Meaning | Available Value | Mandatory | Default value
|--- | --- | --- | --- | ---
|skuName | Azure Disks storage account type (alias: `storageAccountType`)| `Standard_LRS`, `Premium_LRS`, `StandardSSD_LRS`, `PremiumV2_LRS`, `UltraSSD_LRS`, `Premium_ZRS`, `StandardSSD_ZRS` | No | `StandardSSD_LRS`|
|fsType | File System Type | `ext4`, `ext3`, `ext2`, `xfs`, `btrfs` for Linux, `ntfs` for Windows | No | `ext4` for Linux, `ntfs` for Windows|
|cachingMode | [Azure Data Disk Host Cache Setting][disk-host-cache-setting] | `None`, `ReadOnly`, `ReadWrite` | No | `ReadOnly`|
|location | Specify Azure region where Azure Disks will be created | `eastus`, `westus`, etc. | No | If empty, driver will use the same location name as current AKS cluster|
|resourceGroup | Specify the resource group where the Azure Disks will be created | Existing resource group name | No | If empty, driver will use the same resource group name as current AKS cluster|
|DiskIOPSReadWrite | [UltraSSD disk][ultra-ssd-disks] IOPS Capability (minimum: 2 IOPS/GiB ) | 100~160000 | No | `500`|
|DiskMBpsReadWrite | [UltraSSD disk][ultra-ssd-disks] Throughput Capability(minimum: 0.032/GiB) | 1~2000 | No | `100`|
|LogicalSectorSize | Logical sector size in bytes for ultra disk. Supported values are 512 ad 4096. 4096 is the default. | `512`, `4096` | No | `4096`|
|tags | Azure Disk [tags][azure-tags] | Tag format: `key1=val1,key2=val2` | No | ""|
|diskEncryptionSetID | ResourceId of the disk encryption set to use for [enabling encryption at rest][disk-encryption] | format: `/subscriptions/{subs-id}/resourceGroups/{rg-name}/providers/Microsoft.Compute/diskEncryptionSets/{diskEncryptionSet-name}` | No | ""|
|diskEncryptionType | Encryption type of the disk encryption set. | `EncryptionAtRestWithCustomerKey`(by default), `EncryptionAtRestWithPlatformAndCustomerKeys` | No | ""|
|writeAcceleratorEnabled | [Write Accelerator on Azure Disks][azure-disk-write-accelerator] | `true`, `false` | No | ""|
|networkAccessPolicy | NetworkAccessPolicy property to prevent generation of the SAS URI for a disk or a snapshot | `AllowAll`, `DenyAll`, `AllowPrivate` | No | `AllowAll`|
|diskAccessID | Azure Resource ID of the DiskAccess resource to use private endpoints on disks | | No  | ``|
|enableBursting | [Enable on-demand bursting][on-demand-bursting] beyond the provisioned performance target of the disk. On-demand bursting should only be applied to Premium disk and when the disk size > 512 GB. Ultra and shared disk isn't supported. Bursting is disabled by default. | `true`, `false` | No | `false`|
|useragent | User agent used for [customer usage attribution][customer-usage-attribution] | | No  | Generated Useragent formatted `driverName/driverVersion compiler/version (OS-ARCH)`|
|enableAsyncAttach | Allow multiple disk attach operations (in batch) on one node in parallel.<br> While this parameter can speed up disk attachment, you may encounter Azure API throttling limit when there are large number of volume attachments. | `true`, `false` | No | `false`|
|subscriptionID | Specify Azure subscription ID where the Azure Disks is created.  | Azure subscription ID | No | If not empty, `resourceGroup` must be provided.|
|--- | **Following parameters are only for v2** | --- | --- | --- |
| enableAsyncAttach | The v2 driver uses a different strategy to manage Azure API throttling and ignores this parameter. | | No | |
| maxShares | The total number of shared disk mounts allowed for the disk. Setting the value to 2 or more enables attachment replicas. | Supported values depend on the disk size. See [Share an Azure managed disk][share-azure-managed-disk] for supported values. | No | 1 |
| maxMountReplicaCount | The number of replicas attachments to maintain. | This value must be in the range `[0..(maxShares - 1)]` | No | If `accessMode` is `ReadWriteMany`, the default is `0`. Otherwise, the default is `maxShares - 1` |

### Built-in storage classes

A storage class is used to define how a unit of storage is dynamically created with a persistent volume. For more information on Kubernetes storage classes, see [Kubernetes storage classes][kubernetes-storage-classes].

Each AKS cluster includes four pre-created storage classes, two of them configured to work with Azure Disks:

1. The *default* storage class provisions a standard SSD Azure Disk.
    * Standard storage is backed by Standard SSDs and delivers cost-effective storage while still delivering reliable performance.
1. The *managed-csi-premium* storage class provisions a premium Azure Disk.
    * Premium disks are backed by SSD-based high-performance, low-latency disks. They're ideal for VMs running production workloads. When you use the Azure Disks CSI driver on AKS, you can also use the `managed-csi` storage class, which is backed by Standard SSD locally redundant storage (LRS).

It's not supported to reduce the size of a PVC (to prevent data loss). You can edit an existing storage class using the `kubectl edit sc` command, or you can create your own custom storage class. For example, if you want to use a disk of size 4 TiB, you must create a storage class that defines `cachingmode: None` because [disk caching isn't supported for disks 4 TiB and larger][disk-host-cache-setting]. For more information about storage classes and creating your own storage class, see [Storage options for applications in AKS][storage-class-concepts].

Use the [kubectl get sc][kubectl-get] command to see the pre-created storage classes. The following example shows the pre-create storage classes available within an AKS cluster:

```bash
kubectl get sc
```

The output of the command resembles the following example:

```console
NAME                PROVISIONER                AGE
default (default)   disk.csi.azure.com         1h
managed-csi         disk.csi.azure.com         1h
```

> [!NOTE]
> Persistent volume claims are specified in GiB but Azure managed disks are billed by SKU for a specific size. These SKUs range from 32GiB for S4 or P4 disks to 32TiB for S80 or P80 disks (in preview). The throughput and IOPS performance of a Premium managed disk depends on the both the SKU and the instance size of the nodes in the AKS cluster. For more information, see [Pricing and performance of managed disks][managed-disk-pricing-performance].

### Create a persistent volume claim

A persistent volume claim (PVC) is used to automatically provision storage based on a storage class. In this case, a PVC can use one of the pre-created storage classes to create a standard or premium Azure managed disk.

1. Create a file named `azure-pvc.yaml`, and copy in the following manifest. The claim requests a disk named `azure-managed-disk` that is *5 GB* in size with *ReadWriteOnce* access. The *managed-csi* storage class is specified as the storage class.

      ```yaml
      apiVersion: v1
      kind: PersistentVolumeClaim
      metadata:
          name: azure-managed-disk
      spec:
        accessModes:
        - ReadWriteOnce
        storageClassName: managed-csi
        resources:
          requests:
            storage: 5Gi
      ```

  > [!TIP]
  > To create a disk that uses premium storage, use `storageClassName: managed-csi-premium` rather than *managed-csi*.

2. Create the persistent volume claim with the [kubectl apply][kubectl-apply] command and specify your *azure-pvc.yaml* file:

      ```bash
      kubectl apply -f azure-pvc.yaml
      ```

      The output of the command resembles the following example:

      ```console
      persistentvolumeclaim/azure-managed-disk created
      ```

### Use the persistent volume

Once the persistent volume claim has been created and the disk successfully provisioned, a pod can be created with access to the disk. The following manifest creates a basic NGINX pod that uses the persistent volume claim named *azure-managed-disk* to mount the Azure Disk at the path `/mnt/azure`. For Windows Server containers, specify a *mountPath* using the Windows path convention, such as *'D:'*.

1. Create a file named `azure-pvc-disk.yaml`, and copy in the following manifest: 

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
         - mountPath: "/mnt/azure"
            name: volume
        volumes:
         - name: volume
            persistentVolumeClaim:
              claimName: azure-managed-disk
       ```

2. Create the pod with the [kubectl apply][kubectl-apply] command, as shown in the following example:

      ```console
       kubectl apply -f azure-pvc-disk.yaml
      ```

      The output of the command resembles the following example:

      ```console
      pod/mypod created
      ```

3. You now have a running pod with your Azure Disk mounted in the `/mnt/azure` directory. This configuration can be seen when inspecting your pod using the [kubectl describe][kubectl-describe] command, as shown in the following condensed example:

      ```bash
       kubectl describe pod mypod
      ```

      The output of the command resembles the following example:

      ```console
      [...]
      Volumes:
        volume:
          Type:       PersistentVolumeClaim (a reference to a PersistentVolumeClaim in the same namespace)
          ClaimName:  azure-managed-disk
          ReadOnly:   false
         default-token-smm2n:
          Type:        Secret (a volume populated by a Secret)
          SecretName:  default-token-smm2n
          Optional:    false
      [...]
       Events:
        Type    Reason                 Age   From                               Message
        ----    ------                 ----  ----                               -------
        Normal  Scheduled              2m    default-scheduler                  Successfully assigned mypod to aks-nodepool1-79590246-0
        Normal  SuccessfulMountVolume  2m    kubelet, aks-nodepool1-79590246-0  MountVolume.SetUp succeeded for volume "default-token-smm2n"
        Normal  SuccessfulMountVolume  1m    kubelet, aks-nodepool1-79590246-0  MountVolume.SetUp succeeded for volume "pvc-faf0f176-8b8d-11e8-923b-deb28c58d242"
      [...]
      ```

### Use Azure ultra disks

To use Azure ultra disk, see [Use ultra disks on Azure Kubernetes Service (AKS)][use-ultra-disks].

### Back up a persistent volume

To back up the data in your persistent volume, take a snapshot of the managed disk for the volume. You can then use this snapshot to create a restored disk and attach to pods as a means of restoring the data.

1. Get the volume name with the [kubectl get][kubectl-get] command, such as for the PVC named *azure-managed-disk*:

      ```bash
      kubectl get pvc azure-managed-disk
      ```

      The output of the command resembles the following example:

      ```console
      NAME                 STATUS    VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS      AGE
      azure-managed-disk   Bound     pvc-faf0f176-8b8d-11e8-923b-deb28c58d242   5Gi        RWO            managed-premium   3m
      ```

2. This volume name forms the underlying Azure disk name. Query for the disk ID with [az disk list][az-disk-list] and provide your PVC volume name, as shown in the following example:

      ```azurecli
      az disk list --query '[].id | [?contains(@,`pvc-faf0f176-8b8d-11e8-923b-deb28c58d242`)]' -o tsv

      /subscriptions/<guid>/resourceGroups/MC_MYRESOURCEGROUP_MYAKSCLUSTER_EASTUS/providers/MicrosoftCompute/disks/kubernetes-dynamic-pvc-faf0f176-8b8d-11e8-923b-deb28c58d242
      ```

3. Use the disk ID to create a snapshot disk with [az snapshot create][az-snapshot-create]. The following example creates a snapshot named *pvcSnapshot* in the same resource group as the AKS cluster *MC_myResourceGroup_myAKSCluster_eastus*. You may encounter permission issues if you create snapshots and restore disks in resource groups that the AKS cluster doesn't have access to. Depending on the amount of data on your disk, it may take a few minutes to create the snapshot.

      ```azurecli
      az snapshot create \
        --resource-group MC_myResourceGroup_myAKSCluster_eastus \
        --name pvcSnapshot \
        --source /subscriptions/<guid>/resourceGroups/MC_myResourceGroup_myAKSCluster_eastus/providers/MicrosoftCompute/disks/kubernetes-dynamic-pvc-faf0f176-8b8d-11e8-923b-deb28c58d242
      ```

### Restore and use a snapshot

1. To restore the disk and use it with a Kubernetes pod, use the snapshot as a source when you create a disk with [az disk create][az-disk-create]. This operation preserves the original resource if you then need to access the original data snapshot. The following example creates a disk named *pvcRestored* from the snapshot named *pvcSnapshot*:

      ```azurecli
      az disk create --resource-group MC_myResourceGroup_myAKSCluster_eastus --name pvcRestored --source pvcSnapshot
      ```

2. To use the restored disk with a pod, specify the ID of the disk in the manifest. Get the disk ID with the [az disk show][az-disk-show] command. The following example gets the disk ID for *pvcRestored* created in the previous step:

      ```azurecli
      az disk show --resource-group MC_myResourceGroup_myAKSCluster_eastus --name pvcRestored --query id -o tsv
      ```

3. Create a pod manifest named `azure-restored.yaml` and specify the disk URI obtained in the previous step. The following example creates a basic NGINX web server, with the restored disk mounted as a volume at */mnt/azure*:

      ```yaml
       kind: Pod
       apiVersion: v1
       metadata:
        name: mypodrestored
      spec:
         containers:
      - name: mypodrestored
          image: mcr.microsoft.com/oss/nginx/nginx:1.15.5-alpine
          resources:
             requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 250m
              memory: 256Mi
          volumeMounts:
        - mountPath: "/mnt/azure"
            name: volume
        volumes:
        - name: volume
             azureDisk:
              kind: Managed
              diskName: pvcRestored
              diskURI: /subscriptions/<guid>/resourceGroups/MC_myResourceGroupAKS_myAKSCluster_eastus/providers/Microsoft.Compute/disks/pvcRestored
      ```

4. Create the pod with the [kubectl apply][kubectl-apply] command, as shown in the following example:

      ```bash
       kubectl apply -f azure-restored.yaml
      ```

      The output of the command resembles the following example:

      ```console
      pod/mypodrestored created
      ```

5. You can use `kubectl describe pod mypodrestored` to view details of the pod, such as the following condensed example that shows the volume information:

      ```bash
      kubectl describe pod mypodrestored
      ```

      The output of the command resembles the following example:

      ```console
      [...]
      Volumes:
        volume:
          Type:         AzureDisk (an Azure Data Disk mount on the host and bind mount to the pod)
          DiskName:     pvcRestored
          DiskURI:      /subscriptions/19da35d3-9a1a-4f3b-9b9c-3c56ef409565/resourceGroups/MC_myResourceGroupAKS_myAKSCluster_eastus/providers/Microsoft.Compute/disks/pvcRestored
          Kind:         Managed
      FSType:       ext4
          CachingMode:  ReadWrite
           ReadOnly:     false
      [...]
      ```

### Using Azure tags

For more information on using Azure tags, see [Use Azure tags in Azure Kubernetes Service (AKS)][use-tags].

## Statically provision a volume

This section provides guidance for cluster administrators who want to create one or more persistent volumes that include details of Azure Disks storage for use by a workload.

### Static provisioning parameters

|Name | Meaning | Available Value | Mandatory | Default value|
|--- | --- | --- | --- | ---|
|volumeHandle| Azure disk URI | `/subscriptions/{sub-id}/resourcegroups/{group-name}/providers/microsoft.compute/disks/{disk-id}` | Yes | N/A|
|volumeAttributes.fsType | File system type | `ext4`, `ext3`, `ext2`, `xfs`, `btrfs` for Linux, `ntfs` for Windows | No | `ext4` for Linux, `ntfs` for Windows |
|volumeAttributes.partition | Partition number of the existing disk (only supported on Linux) | `1`, `2`, `3` | No | Empty (no partition) </br>- Make sure partition format is like `-part1` |
|volumeAttributes.cachingMode | [Disk host cache setting][disk-host-cache-setting] | `None`, `ReadOnly`, `ReadWrite` | No  | `ReadOnly`|

### Create an Azure disk

When you create an Azure disk for use with AKS, you can create the disk resource in the **node** resource group. This approach allows the AKS cluster to access and manage the disk resource. If instead you created the disk in a separate resource group, you must grant the Azure Kubernetes Service (AKS) managed identity for your cluster the `Contributor` role to the disk's resource group. In this exercise, you're going to create the disk in the same resource group as your cluster.

1. Identify the resource group name using the [az aks show][az-aks-show] command and add the `--query nodeResourceGroup` parameter. The following example gets the node resource group for the AKS cluster name *myAKSCluster* in the resource group name *myResourceGroup*:

    ```azurecli-interactive
    az aks show --resource-group myResourceGroup --name myAKSCluster --query nodeResourceGroup -o tsv
    
    MC_myResourceGroup_myAKSCluster_eastus
    ```

2. Create a disk using the [az disk create][az-disk-create] command. Specify the node resource group name obtained in the previous command, and then a name for the disk resource, such as *myAKSDisk*. The following example creates a *20*GiB disk, and outputs the ID of the disk after it's created. If you need to create a disk for use with Windows Server containers, add the `--os-type windows` parameter to correctly format the disk.

    ```azurecli-interactive
    az disk create \
      --resource-group MC_myResourceGroup_myAKSCluster_eastus \
      --name myAKSDisk \
      --size-gb 20 \
      --query id --output tsv
    ```

    > [!NOTE]
    > Azure Disks are billed by SKU for a specific size. These SKUs range from 32GiB for S4 or P4 disks to 32TiB for S80 or P80 disks (in preview). The throughput and IOPS performance of a Premium managed disk depends on both the SKU and the instance size of the nodes in the AKS cluster. See [Pricing and Performance of Managed Disks][managed-disk-pricing-performance].

    The disk resource ID is displayed once the command has successfully completed, as shown in the following example output. This disk ID is used to mount the disk in the next section.

    ```console
    /subscriptions/<subscriptionID>/resourceGroups/MC_myAKSCluster_myAKSCluster_eastus/providers/Microsoft.Compute/disks/myAKSDisk
    ```

### Mount disk as a volume

1. Create a *pv-azuredisk.yaml* file with a *PersistentVolume*. Update `volumeHandle` with disk resource ID from the previous step. For example:

    ```yaml
    apiVersion: v1
    kind: PersistentVolume
    metadata:
      annotations:
        pv.kubernetes.io/provisioned-by: disk.csi.azure.com
      name: pv-azuredisk
    spec:
      capacity:
        storage: 20Gi
      accessModes:
        - ReadWriteOnce
      persistentVolumeReclaimPolicy: Retain
      storageClassName: managed-csi
      csi:
        driver: disk.csi.azure.com
        readOnly: false
        volumeHandle: /subscriptions/<subscriptionID>/resourceGroups/MC_myAKSCluster_myAKSCluster_eastus/providers/Microsoft.Compute/disks/myAKSDisk
        volumeAttributes:
          fsType: ext4
    ```

2. Create a *pvc-azuredisk.yaml* file with a *PersistentVolumeClaim* that uses the *PersistentVolume*. For example:

    ```yaml
    apiVersion: v1
    kind: PersistentVolumeClaim
    metadata:
      name: pvc-azuredisk
    spec:
      accessModes:
        - ReadWriteOnce
      resources:
        requests:
          storage: 20Gi
      volumeName: pv-azuredisk
      storageClassName: managed-csi
    ```

3. Use the [kubectl apply][kubectl-apply] commands to create the *PersistentVolume* and *PersistentVolumeClaim*, referencing the two YAML files created earlier:

    ```bash
    kubectl apply -f pv-azuredisk.yaml
    kubectl apply -f pvc-azuredisk.yaml
    ```

4. To verify your *PersistentVolumeClaim* is created and bound to the *PersistentVolume*, run the
following command:

    ```bash
    kubectl get pvc pvc-azuredisk
    ```

    The output of the command resembles the following example:

    ```console
    NAME            STATUS   VOLUME         CAPACITY    ACCESS MODES   STORAGECLASS   AGE
    pvc-azuredisk   Bound    pv-azuredisk   20Gi        RWO                           5s
    ```

5. Create a *azure-disk-pod.yaml* file to reference your *PersistentVolumeClaim*. For example:

    ```yaml
    apiVersion: v1
    kind: Pod
    metadata:
      name: mypod
    spec:
      nodeSelector:
        kubernetes.io/os: linux
      containers:
      - image: mcr.microsoft.com/oss/nginx/nginx:1.15.5-alpine
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
          persistentVolumeClaim:
            claimName: pvc-azuredisk
    ```

6. Run the [kubectl apply][kubectl-apply] command to apply the configuration and mount the volume, referencing the YAML
configuration file created in the previous steps:

    ```bash
    kubectl apply -f azure-disk-pod.yaml
    ```

## Next steps

- To learn how to use CSI driver for Azure Disks storage, see [Use Azure Disks storage with CSI driver][azure-disks-storage-csi].
- For associated best practices, see [Best practices for storage and backups in AKS][operator-best-practices-storage].

<!-- LINKS - external -->
[access-modes]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubernetes-storage-classes]: https://kubernetes.io/docs/concepts/storage/storage-classes/
[kubernetes-volumes]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/
[managed-disk-pricing-performance]: https://azure.microsoft.com/pricing/details/managed-disks/
[kubectl-describe]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe

<!-- LINKS - internal -->
[azure-storage-account]: ../storage/common/storage-introduction.md
[azure-disks-storage-csi]: azure-disk-csi.md
[azure-files-pvc]: azure-files-dynamic-pv.md
[az-disk-list]: /cli/azure/disk#az_disk_list
[az-snapshot-create]: /cli/azure/snapshot#az_snapshot_create
[az-disk-create]: /cli/azure/disk#az_disk_create
[az-disk-show]: /cli/azure/disk#az_disk_show
[az-aks-show]: /cli/azure/aks#az-aks-show
[install-azure-cli]: /cli/azure/install-azure-cli
[operator-best-practices-storage]: operator-best-practices-storage.md
[concepts-storage]: concepts-storage.md
[storage-class-concepts]: concepts-storage.md#storage-classes
[use-tags]: use-tags.md
[share-azure-managed-disk]: ../virtual-machines/disks-shared.md
[disk-host-cache-setting]: ../virtual-machines/windows/premium-storage-performance.md#disk-caching
[use-ultra-disks]: use-ultra-disks.md
[ultra-ssd-disks]: ../virtual-machines/linux/disks-ultra-ssd.md
[azure-tags]: ../azure-resource-manager/management/tag-resources.md
[disk-encryption]: ../virtual-machines/windows/disk-encryption.md
[azure-disk-write-accelerator]: ../virtual-machines/windows/how-to-enable-write-accelerator.md
[on-demand-bursting]: ../virtual-machines/disk-bursting.md
[customer-usage-attribution]: ../marketplace/azure-partner-customer-usage-attribution.md
