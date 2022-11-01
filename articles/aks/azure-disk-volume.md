---
title: Create a static volume for pods in Azure Kubernetes Service (AKS)
description: Learn how to manually create a volume with Azure disks for use with a pod in Azure Kubernetes Service (AKS)
services: container-service
ms.topic: article
ms.date: 05/17/2022


#Customer intent: As a developer, I want to learn how to manually create and attach storage to a specific pod in AKS.
---

# Create a static volume with Azure disks in Azure Kubernetes Service (AKS)

Container-based applications often need to access and persist data in an external data volume. If a single pod needs access to storage, you can use Azure disks to present a native volume for application use. This article shows you how to manually create an Azure disk and attach it to a pod in AKS.

> [!NOTE]
> An Azure disk can only be mounted to a single pod at a time. If you need to share a persistent volume across multiple pods, use [Azure Files][azure-files-volume].

For more information on Kubernetes volumes, see [Storage options for applications in AKS][concepts-storage].

## Before you begin

This article assumes that you have an existing AKS cluster with 1.21 or later version. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli], [using Azure PowerShell][aks-quickstart-powershell], or [using the Azure portal][aks-quickstart-portal].

If you want to interact with Azure disks on an AKS cluster with 1.20 or previous version, see the [Kubernetes plugin for Azure disks][kubernetes-disks].

## Storage class static provisioning

The following table describes the Storage Class parameters for the Azure disk CSI driver static provisioning:

|Name | Meaning | Available Value | Mandatory | Default value|
|--- | --- | --- | --- | ---|
|volumeHandle| Azure disk URI | `/subscriptions/{sub-id}/resourcegroups/{group-name}/providers/microsoft.compute/disks/{disk-id}` | Yes | N/A|
|volumeAttributes.fsType | File system type | `ext4`, `ext3`, `ext2`, `xfs`, `btrfs` for Linux, `ntfs` for Windows | No | `ext4` for Linux, `ntfs` for Windows |
|volumeAttributes.partition | Partition number of the existing disk (only supported on Linux) | `1`, `2`, `3` | No | Empty (no partition) </br>- Make sure partition format is like `-part1` |
|volumeAttributes.cachingMode | [Disk host cache setting](../virtual-machines/windows/premium-storage-performance.md#disk-caching)| `None`, `ReadOnly`, `ReadWrite` | No  | `ReadOnly`|

## Create an Azure disk

When you create an Azure disk for use with AKS, you can create the disk resource in the **node** resource group. This approach allows the AKS cluster to access and manage the disk resource. If instead you created the disk in a separate resource group, you must grant the Azure Kubernetes Service (AKS) managed identity for your cluster the `Contributor` role to the disk's resource group. In this exercise, you're going to create the disk in the same resource group as your cluster.

1. Identify the resource group name using the [az aks show][az-aks-show] command and add the `--query nodeResourceGroup` parameter. The following example gets the node resource group for the AKS cluster name *myAKSCluster* in the resource group name *myResourceGroup*:

    ```azurecli-interactive
    $ az aks show --resource-group myResourceGroup --name myAKSCluster --query nodeResourceGroup -o tsv
    
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
    > Azure disks are billed by SKU for a specific size. These SKUs range from 32GiB for S4 or P4 disks to 32TiB for S80 or P80 disks (in preview). The throughput and IOPS performance of a Premium managed disk depends on both the SKU and the instance size of the nodes in the AKS cluster. See [Pricing and Performance of Managed Disks][managed-disk-pricing-performance].

    The disk resource ID is displayed once the command has successfully completed, as shown in the following example output. This disk ID is used to mount the disk in the next section.

    ```console
    /subscriptions/<subscriptionID>/resourceGroups/MC_myAKSCluster_myAKSCluster_eastus/providers/Microsoft.Compute/disks/myAKSDisk
    ```

## Mount disk as a volume

1. Create a *pv-azuredisk.yaml* file with a *PersistentVolume*. Update `volumeHandle` with disk resource ID from the previous step. For example:

    ```yaml
    apiVersion: v1
    kind: PersistentVolume
    metadata:
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

3. Use the `kubectl` commands to create the *PersistentVolume* and *PersistentVolumeClaim*, referencing the two YAML files created earlier:

    ```console
    kubectl apply -f pv-azuredisk.yaml
    kubectl apply -f pvc-azuredisk.yaml
    ```

4. To verify your *PersistentVolumeClaim* is created and bound to the *PersistentVolume*, run the
following command:

    ```console
    $ kubectl get pvc pvc-azuredisk
    
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

6. Run the following command to apply the configuration and mount the volume, referencing the YAML
configuration file created in the previous steps:

    ```console
    kubectl apply -f azure-disk-pod.yaml
    ```

## Next steps

To learn about our recommended storage and backup practices, see [Best practices for storage and backups in AKS][operator-best-practices-storage].

<!-- LINKS - external -->
[kubernetes-disks]: https://github.com/kubernetes/examples/blob/master/staging/volumes/azure_disk/README.md
[kubernetes-volumes]: https://kubernetes.io/docs/concepts/storage/volumes/
[managed-disk-pricing-performance]: https://azure.microsoft.com/pricing/details/managed-disks/

<!-- LINKS - internal -->
[az-disk-list]: /cli/azure/disk#az_disk_list
[az-disk-create]: /cli/azure/disk#az_disk_create
[az-group-list]: /cli/azure/group#az_group_list
[az-resource-show]: /cli/azure/resource#az_resource_show
[aks-quickstart-cli]: ./learn/quick-kubernetes-deploy-cli.md
[aks-quickstart-portal]: ./learn/quick-kubernetes-deploy-portal.md
[aks-quickstart-powershell]: ./learn/quick-kubernetes-deploy-powershell.md
[az-aks-show]: /cli/azure/aks#az_aks_show
[install-azure-cli]: /cli/azure/install-azure-cli
[azure-files-volume]: azure-files-volume.md
[operator-best-practices-storage]: operator-best-practices-storage.md
[concepts-storage]: concepts-storage.md
