---
title: Create a persistent volume with Azure Disks in Azure Kubernetes Service (AKS)
titleSuffix: Azure Kubernetes Service
description: Learn how to create a static or dynamic persistent volume with Azure Disks for use with multiple concurrent pods in Azure Kubernetes Service (AKS)
ms.topic: article
ms.custom: devx-track-azurecli, devx-track-linux
ms.date: 04/11/2023
---

# Create and use a volume with Azure Disks in Azure Kubernetes Service (AKS)

A persistent volume represents a piece of storage provisioned for use with Kubernetes pods. You can use a persistent volume with one or many pods, and you can provision it dynamically or statically. This article shows you how to dynamically create persistent volumes with Azure Disks in an Azure Kubernetes Service (AKS) cluster.

> [!NOTE]
> An Azure disk can only be mounted with *Access mode* type *ReadWriteOnce*, which makes it available to one node in AKS. This access mode still allows multiple pods to access the volume when the pods run on the same node. For more information, see [Kubernetes PersistentVolume access modes][access-modes].

This article shows you how to:

* Work with a dynamic persistent volume (PV) by installing the Container Storage Interface (CSI) driver and dynamically creating one or more Azure managed disks to attach to a pod.
* Work with a static PV by creating one or more Azure managed disks or use an existing one and attach it to a pod.

For more information on Kubernetes volumes, see [Storage options for applications in AKS][concepts-storage].

## Before you begin

* You need an Azure [storage account][azure-storage-account].
* Make sure you have Azure CLI version 2.0.59 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].
* The Azure Disk CSI driver has a per-node volume limit. The volume count changes based on the size of the node/node pool. Run the [kubectl get][kubectl-get] command to determine the number of volumes that can be allocated per node:

    ```bash
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
|resourceGroup | Specify the resource group for the Azure Disks | Existing resource group name | No | If empty, driver uses the same resource group name as current AKS cluster|
|DiskIOPSReadWrite | [UltraSSD disk][ultra-ssd-disks] IOPS Capability (minimum: 2 IOPS/GiB) | 100~160000 | No | `500`|
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
|subscriptionID | Specify Azure subscription ID where the Azure Disks is created.  | Azure subscription ID | No | If not empty, `resourceGroup` must be provided.|
|--- | **Following parameters are only for v2** | --- | --- | --- |
| maxShares | The total number of shared disk mounts allowed for the disk. Setting the value to 2 or more enables attachment replicas. | Supported values depend on the disk size. See [Share an Azure managed disk][share-azure-managed-disk] for supported values. | No | 1 |
| maxMountReplicaCount | The number of replicas attachments to maintain. | This value must be in the range `[0..(maxShares - 1)]` | No | If `accessMode` is `ReadWriteMany`, the default is `0`. Otherwise, the default is `maxShares - 1` |

### Built-in storage classes

Storage classes define how a unit of storage is dynamically created with a persistent volume. For more information on Kubernetes storage classes, see [Kubernetes storage classes][kubernetes-storage-classes].

Each AKS cluster includes four precreated storage classes, two of them configured to work with Azure Disks:

1. The *default* storage class provisions a standard SSD Azure Disk.
    * Standard SSDs backs Standard storage and delivers cost-effective storage while still delivering reliable performance.
2. The *managed-csi-premium* storage class provisions a premium Azure Disk.
    * SSD-based high-performance, low-latency disks back Premium disks. They're ideal for VMs running production workloads. When you use the Azure Disk CSI driver on AKS, you can also use the `managed-csi` storage class, which is backed by Standard SSD locally redundant storage (LRS).

It's not supported to reduce the size of a PVC (to prevent data loss). You can edit an existing storage class using the `kubectl edit sc` command, or you can create your own custom storage class. For example, if you want to use a disk of size 4 TiB, you must create a storage class that defines `cachingmode: None` because [disk caching isn't supported for disks 4 TiB and larger][disk-host-cache-setting]. For more information about storage classes and creating your own storage class, see [Storage options for applications in AKS][storage-class-concepts].

You can see the precreated storage classes using the [`kubectl get sc`][kubectl-get] command. The following example shows the precreated storage classes available within an AKS cluster:

```bash
kubectl get sc
```

The output of the command resembles the following example:

```output
NAME                PROVISIONER                AGE
default (default)   disk.csi.azure.com         1h
managed-csi         disk.csi.azure.com         1h
```

> [!NOTE]
> Persistent volume claims are specified in GiB but Azure managed disks are billed by SKU for a specific size. These SKUs range from 32GiB for S4 or P4 disks to 32TiB for S80 or P80 disks (in preview). The throughput and IOPS performance of a Premium managed disk depends on the both the SKU and the instance size of the nodes in the AKS cluster. For more information, see [Pricing and performance of managed disks][managed-disk-pricing-performance].

### Create a persistent volume claim

A persistent volume claim (PVC) automatically provisions storage based on a storage class. In this case, a PVC can use one of the precreated storage classes to create a standard or premium Azure managed disk.

1. Create a file named `azure-pvc.yaml` and copy in the following manifest. The claim requests a disk named `azure-managed-disk` that's *5 GB* in size with *ReadWriteOnce* access. The *managed-csi* storage class is specified as the storage class.

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

2. Create the persistent volume claim using the [`kubectl apply`][kubectl-apply] command and specify your *azure-pvc.yaml* file.

      ```bash
      kubectl apply -f azure-pvc.yaml
      ```

      The output of the command resembles the following example:

      ```output
      persistentvolumeclaim/azure-managed-disk created
      ```

### Use the persistent volume

After you create the persistent volume claim, you must verify it has a status of `Pending`. The `Pending` status indicates it's ready to be used by a pod.

1. Verify the status of the PVC using the `kubectl describe pvc` command.

    ```bash
    kubectl describe pvc azure-managed-disk
    ```

    The output of the command resembles the following condensed example:

    ```output
    Name:            azure-managed-disk
    Namespace:       default
    StorageClass:    managed-csi
    Status:          Pending
    [...]
    ```

2. Create a file named `azure-pvc-disk.yaml` and copy in the following manifest. This manifest creates a basic NGINX pod that uses the persistent volume claim named *azure-managed-disk* to mount the Azure Disk at the path `/mnt/azure`. For Windows Server containers, specify a *mountPath* using the Windows path convention, such as *'D:'*.

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

3. Create the pod using the [`kubectl apply`][kubectl-apply] command.

      ```bash
       kubectl apply -f azure-pvc-disk.yaml
      ```

      The output of the command resembles the following example:

      ```output
      pod/mypod created
      ```

4. You now have a running pod with your Azure Disk mounted in the `/mnt/azure` directory. Check the pod configuration using the [`kubectl describe`][kubectl-describe] command.

      ```bash
       kubectl describe pod mypod
      ```

      The output of the command resembles the following example:

      ```output
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

When you create an Azure disk for use with AKS, you can create the disk resource in the **node** resource group. This approach allows the AKS cluster to access and manage the disk resource. If you instead create the disk in a separate resource group, you must grant the Azure Kubernetes Service (AKS) managed identity for your cluster the `Contributor` role to the disk's resource group.

1. Identify the resource group name using the [`az aks show`][az-aks-show] command and add the `--query nodeResourceGroup` parameter.

    ```azurecli-interactive
    az aks show --resource-group myResourceGroup --name myAKSCluster --query nodeResourceGroup -o tsv
    
    # Output
    MC_myResourceGroup_myAKSCluster_eastus
    ```

2. Create a disk using the [`az disk create`][az-disk-create] command. Specify the node resource group name and a name for the disk resource, such as *myAKSDisk*. The following example creates a *20*GiB disk, and outputs the ID of the disk after it's created. If you need to create a disk for use with Windows Server containers, add the `--os-type windows` parameter to correctly format the disk.

    ```azurecli-interactive
    az disk create \
      --resource-group MC_myResourceGroup_myAKSCluster_eastus \
      --name myAKSDisk \
      --size-gb 20 \
      --query id --output tsv
    ```

    > [!NOTE]
    > Azure Disks are billed by SKU for a specific size. These SKUs range from 32GiB for S4 or P4 disks to 32TiB for S80 or P80 disks (in preview). The throughput and IOPS performance of a Premium managed disk depends on both the SKU and the instance size of the nodes in the AKS cluster. See [Pricing and Performance of Managed Disks][managed-disk-pricing-performance].

    The disk resource ID is displayed once the command has successfully completed, as shown in the following example output. You use the disk ID to mount the disk in the next section.

    ```output
    /subscriptions/<subscriptionID>/resourceGroups/MC_myAKSCluster_myAKSCluster_eastus/providers/Microsoft.Compute/disks/myAKSDisk
    ```

### Mount disk as a volume

1. Create a *pv-azuredisk.yaml* file with a *PersistentVolume*. Update `volumeHandle` with disk resource ID from the previous step.

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

2. Create a *pvc-azuredisk.yaml* file with a *PersistentVolumeClaim* that uses the *PersistentVolume*.

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

3. Create the *PersistentVolume* and *PersistentVolumeClaim* using the [`kubectl apply`][kubectl-apply] command and reference the two YAML files you created.

    ```bash
    kubectl apply -f pv-azuredisk.yaml
    kubectl apply -f pvc-azuredisk.yaml
    ```

4. Verify your *PersistentVolumeClaim* is created and bound to the *PersistentVolume* using the `kubectl get pvc` command.

    ```bash
    kubectl get pvc pvc-azuredisk
    ```

    The output of the command resembles the following example:

    ```output
    NAME            STATUS   VOLUME         CAPACITY    ACCESS MODES   STORAGECLASS   AGE
    pvc-azuredisk   Bound    pv-azuredisk   20Gi        RWO                           5s
    ```

5. Create a *azure-disk-pod.yaml* file to reference your *PersistentVolumeClaim*.

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

6. Apply the configuration and mount the volume using the [`kubectl apply`][kubectl-apply] command.

    ```bash
    kubectl apply -f azure-disk-pod.yaml
    ```

## Clean up resources

When you're done with the resources created in this article, you can remove them using the `kubectl delete` command.

```bash
# Remove the pod
kubectl delete -f azure-pvc-disk.yaml

# Remove the persistent volume claim
kubectl delete -f azure-pvc.yaml
```

## Next steps

* To learn how to use CSI driver for Azure Disks storage, see [Use Azure Disks storage with CSI driver][azure-disks-storage-csi].
* For associated best practices, see [Best practices for storage and backups in AKS][operator-best-practices-storage].

<!-- LINKS - external -->
[access-modes]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubernetes-storage-classes]: https://kubernetes.io/docs/concepts/storage/storage-classes/
[managed-disk-pricing-performance]: https://azure.microsoft.com/pricing/details/managed-disks/
[kubectl-describe]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe

<!-- LINKS - internal -->
[azure-storage-account]: ../storage/common/storage-introduction.md
[azure-disks-storage-csi]: azure-disk-csi.md
[az-disk-create]: /cli/azure/disk#az_disk_create
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
