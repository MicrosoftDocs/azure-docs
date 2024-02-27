---
title: Move Azure Disk Persistent Volumes in Azure Kubernetes Service (AKS)
titleSuffix: Azure Kubernetes Service
description: Learn how to move a persistent volume between Azure Kubernetes Service clusters in the same or different subscription and in the same region. 
ms.topic: article
ms.date: 02/26/2024
---

# Move Azure Disk persistent volumes to same or different subscription

This article describes how to safely move Azure Disk persistent volumes from an Azure Kubernetes Service (AKS) cluster to another cluster in the same subscription or in a different subscription that are in the same region.

The sequence of steps to complete this move are:

* Confirm the Azure Disk resource state on the source AKS cluster isn't in an **Attached** state to avoid data loss.
* Move the Azure Disk resource to the target resource group in the same or different subscription.
* Validate the Azure Disk resource move succeeded.
* Create the persistent volume (PV), persistent volume claim (PVC) and mount the moved disk as a volume on a pod on the target cluster  

## Before you begin

* You need an Azure [storage account][azure-storage-account].
* Make sure you have Azure CLI version 2.0.59 or later installed and configured. To find the version, run `az --version`. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].
* Review details and requirements about moving resources between different regions in [Move resources to a new resource group or subsription][move-resources-new-subscription-resource-group]. Be sure to review the [checklist before moving resources][move-resources-checklist] in that article.
* You have an AKS cluster in the target subscription and the source cluster has persistent volumes with Azure Disks attached.

## Validate disk volume state

Preserving data is important while working with persistent volumes to avoid risk of data corruption, inconsistencies, or data loss. To prevent loss during the migration or move process, you first verify the disk volume is unattached by performing the following steps.

1. Identify the node resource group hosting the Azure managed disks using the [`az aks show`][az-aks-show] command and add the `--query nodeResourceGroup` parameter.

    ```azurecli-interactive
    az aks show --resource-group myResourceGroup --name myAKSCluster --query nodeResourceGroup -o tsv
    ```

   The output of the command resembles the following example:

    ```output
    MC_myResourceGroup_myAKSCluster_eastus
    ```

1. List the managed disks using the [`az disk list`][az-disk-list] command referencing the resource group returned in the previous step.

    ```azurecli-interactive
    az disk list --resource-group MC_myResourceGroup_myAKSCluster_eastus
    ```

    Review the list and note which disk volumes you plan to move to the other cluster. Also validate the disk state by looking for the `diskState` property. The output of the command is a condensed example.

    ```output
    {
    "LastOwnershipUpdateTime": "2023-04-25T15:09:19.5439836+00:00",
    "creationData": {
      "createOption": "Empty",
      "logicalSectorSize": 4096
    },
    "diskIOPSReadOnly": 3000,
    "diskIOPSReadWrite": 4000,
    "diskMBpsReadOnly": 125,
    "diskMBpsReadWrite": 1000,
    "diskSizeBytes": 1073741824000,
    "diskSizeGB": 1000,
    "diskState": "Unattached",
    ```

1. If `diskState` shows `Attached`, first verify if any workloads are still accessing the volume and stop them first. After a period of time, disk state returns state `Unattached` and can then be moved.

## Move persistent volume

To move the persistent volume or volumes to another AKS cluster, follow the steps described in [Move Azure resources to a new resource group or subscription][move-resources-new-subscription-resource-group] using the [Azure portal][move-resources-using-porta], [Azure PowerShell][move-resources-using-azure-powershell], or using the [Azure CLI][move-resources-using-azure-cli].

During this process, you'll reference:

* The name or resource ID of the source node resource group hosting the Azure managed disks
* The name or resource ID of the destination resource group to move the managed disks to
* The name or resource ID of the managed disks resources.

> [!NOTE]
> Because of the dependencies between resource providers, this operation can take up to four hours to complete.

## Verify the resources moved

After moving the disk volume to the target cluster resource group, validate the resource in the resource group list using the [`az disk list`][az-disk-list] command referencing the destination resource group the resources were moved to. In this example, the disks were moved to a resource group named *MC_myResourceGroup_myAKSCluster_westus*.

  ```azurecli-interactive
    az disk list --resource-group MC_myResourceGroup_myAKSCluster_westus
  ```

Identify the resource ID of the disk resource using the [`az resource list`][az-resource-list] command and add the `--resource-group` and `--name` parameters to specify the target resource group and the name of the disk resource.

The output of the command is a condensed example.

```output
[
  {
    "changedTime": "2023-04-25T12:54:27.429375+00:00",
    "createdTime": "2023-04-25T12:44:21.812795+00:00",
    "extendedLocation": null,
    "id": "/subscriptions/0ee07caa-76ad-4537-8667-4a5beae1d91c/resourceGroups/mc_myResourceGroup_myakscluster_westus/providers/Microsoft.Compute/disks/pvc-9583b9de-5b3a-4b86-aa2d-2b2c79102b71",
    "identity": null,
    "kind": null,
    "location": "eastus",
    "managedBy": null,
    "name": "pvc-9583b9de-5b3a-4b86-aa2d-2b2c79102b71",
```

## Mount the moved disk as a volume

To mount the moved disk volume, you'll create a static persistent volume with the resource ID copied in the previous steps, the persistent volume claim, and in this example a simple pod.

1. Create a *pv-azuredisk.yaml* file with a persistent volume. Update *volumeHandle* with disk resource ID from the previous step.

    ```yml
    ---
    apiVersion: v1
    kind: PersistentVolume
    metadata:
      name: pv-azuredisk
    spec:
      capacity:
        storage: 10Gi
      accessModes:
        - ReadWriteOnce
      persistentVolumeReclaimPolicy: Retain
      storageClassName: managed-csi
      csi:
        driver: disk.csi.azure.com
        readOnly: false
        volumeHandle: /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MC_rg_azure_aks-pvc-target_eastus/providers/Microsoft.Compute/disks/pvc-501cb814-dbf7-4f01-b4a2-dc0d5b6c7e7a
        volumeAttributes:
          fsType: ext4
    ```

1. Create a *pvc-azuredisk.yaml* file with a *PersistentVolumeClaim* that uses the *PersistentVolume*.

    ```yml
    ---
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

1. Create the *PersistentVolume* and *PersistentVolumeClaim* using the [`kubectl apply`][kubectl-apply] command and reference the two YAML files you created.

    ```bash
    kubectl apply -f pv-azuredisk.yaml
    kubectl apply -f pvc-azuredisk.yaml
    ```

1. Verify your *PersistentVolumeClaim* is created and bound to the *PersistentVolume* using the [`kubectl get`][kubectl-get] command.

    ```bash
    kubectl get pvc pvc-azuredisk
    ```

   The output of the command resembles the following example:

    ```output
    NAME            STATUS   VOLUME         CAPACITY    ACCESS MODES   STORAGECLASS   AGE
    pvc-azuredisk   Bound    pv-azuredisk   20Gi        RWO                           5s
    ```

1. To reference your *PersistentVolumeClaim*, create a *azure-disk-pod.yaml* file. In the example manifest, the name of the pod is *mypod*.

    ```yml
    ---
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

1. Apply the configuration and mount the volume using the [kubectl apply][kubectl-apply] command.

    ```bash
    kubectl apply -f azure-disk-pod.yaml
    ```

1. Check the pod status and the data migrated with the volume mounted inside the pod filesystem on `/mnt/azure`. First, get the pod status using the [`kubectl get`][kubectl-get] command.

    ```bash
    kubectl get pods
    ```

   The output of the command resembles the following example:

    ```output
    NAME    READY   STATUS    RESTARTS   AGE
    mypod   1/1     Running   0          4m1s
    ```

   Verify the data inside the mounted volume `/mnt/azure` using the [`kubectl exec`][kubectl-exec] command.

    ```bash
    kubectl exec -it mypod -- ls -l /mnt/azure/
    ```

   The output of the command resembles the following example:

    ```output
    total 28
    -rw-r--r--    1 root     root       0 Jan 11 10:09 file-created-in-source-aks
    ```

## Next steps

<!-- LINKS - external -->
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-exec]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#exec

<!-- LINKS - internal -->
[azure-storage-account]: ../storage/common/storage-account-overview.md
[install-azure-cli]: /cli/azure/install-azure-cli
[move-resources-new-subscription-resource-group]: ../azure-resource-manager/management/move-resource-group-and-subscription.md
[az-aks-show]: /cli/azure/disk#az-disk-show
[az-disk-list]: /cli/azure/disk#az-disk-list
[az-resource-list]: cli/azure/resource#az-resource-list
[move-resources-checklist]: ../azure-resource-manager/management/move-resource-group-and-subscription.md#checklist-before-moving-resources
[move-resources-using-porta]: ../azure-resource-manager/management/move-resource-group-and-subscription.md#use-the-portal
[move-resources-using-azure-powershell]: ../azure-resource-manager/management/move-resource-group-and-subscription.md#use-azure-powershell
[move-resources-using-azure-cli]: ../azure-resource-manager/management/move-resource-group-and-subscription.md#use-azure-cli