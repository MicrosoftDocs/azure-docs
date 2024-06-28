---
title: Move Azure Disk persistent volumes to another AKS cluster in the same or a different subscription
titleSuffix: Azure Kubernetes Service
description: Learn how to move a persistent volume between Azure Kubernetes Service clusters in the same subscription or a different subscription. 
author: tamram

ms.author: tamram
ms.topic: article
ms.date: 04/08/2024
---

# Move Azure Disk persistent volumes to another AKS cluster in the same or a different subscription

This article describes how to safely move Azure Disk persistent volumes from one Azure Kubernetes Service (AKS) cluster to another in the same subscription or in a different subscription. The target subscription must be in the same region.

The sequence of steps to complete this move are:

* To avoid data loss, confirm that the Azure Disk resource state on the source AKS cluster isn't in an **Attached** state.
* Move the Azure Disk resource to the target resource group in the same subscription or a different subscription.
* Validate that the Azure Disk resource move succeeded.
* Create the persistent volume (PV) and the persistent volume claim (PVC) and then mount the moved disk as a volume on a pod on the target cluster.  

## Before you begin

* Make sure you have Azure CLI version 2.0.59 or later installed and configured. To find the version, run `az --version`. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].
* Review details and requirements about moving resources between different regions in [Move resources to a new resource group or subscription][move-resources-new-subscription-resource-group]. Be sure to review the [checklist before moving resources][move-resources-checklist] in that article.
* The source cluster must have one or more persistent volumes with an Azure Disk attached.
* You must have an AKS cluster in the target subscription.

## Validate disk volume state

It's important to avoid risk of data corruption, inconsistencies, or data loss while working with persistent volumes. To mitigate these risks during the migration or move process, you must first verify that the disk volume is unattached by performing the following steps.

1. Identify the node resource group hosting the Azure managed disks using the [`az aks show`][az-aks-show] command and add the `--query nodeResourceGroup` parameter.

    ```azurecli-interactive
    az aks show --resource-group myResourceGroup --name myAKSCluster --query nodeResourceGroup -o tsv
    ```

   The output of the command resembles the following example:

    ```output
    MC_myResourceGroup_myAKSCluster_eastus
    ```

1. List the managed disks using the [`az disk list`][az-disk-list] command. Reference the resource group returned in the previous step.

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

    > [!NOTE]
    > Note the value of the `resourceGroup` field for each disk that you want to move from the output above. This resource group is the node resource group, not the cluster resource group. You'll need the name of this resource group in order to move the disks.

1. If `diskState` shows `Attached`, first determine whether any workloads are still accessing the volume and stop them. After a period of time, disk state returns state `Unattached` and can then be moved.

## Move the persistent volume

To move the persistent volume or volumes to another AKS cluster, follow the steps described in [Move Azure resources to a new resource group or subscription][move-resources-new-subscription-resource-group]. You can use the [Azure portal][move-resources-using-porta], [Azure PowerShell][move-resources-using-azure-powershell], or use the [Azure CLI][move-resources-using-azure-cli] to perform the migration.

During this process, you reference:

* The name or resource ID of the source node resource group hosting the Azure managed disks. You can find the name of the node resource group by navigating to the **Disks** dashboard in the Azure portal and noting the associated resource group for your disk.
* The name or resource ID of the destination resource group to move the managed disks to.
* The name or resource ID of the managed disks resources.

> [!NOTE]
> Because of the dependencies between resource providers, this operation can take up to four hours to complete.

## Verify that the disk volume has been moved

After moving the disk volume to the target cluster resource group, validate the resource in the resource group list using the [`az disk list`][az-disk-list] command. Reference the destination resource group where the resources were moved. In this example, the disks were moved to a resource group named *MC_myResourceGroup_myAKSCluster_eastus*.

  ```azurecli-interactive
    az disk list --resource-group MC_myResourceGroup_myAKSCluster_eastus
  ```

## Mount the moved disk as a volume

To mount the moved disk volume, create a static persistent volume with the resource ID copied in the previous steps, the persistent volume claim, and in this example, a simple pod.

1. Create a *pv-azuredisk.yaml* file with a persistent volume. Update the *volumeHandle* field with the disk resource ID from the previous step.

    ```yaml
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
          storage: 10Gi
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

* For more information about disk-based storage solutions, see [Disk-based solutions in AKS][disk-based-solutions].
* For more information about storage best practices, see [Best practices for storage and backups in Azure Kubernetes Service][operator-best-practices-storage].

<!-- LINKS - external -->
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-exec]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#exec

<!-- LINKS - internal -->
[disk-based-solutions]: /azure/cloud-adoption-framework/scenarios/app-platform/aks/storage#disk-based-solutions
[install-azure-cli]: /cli/azure/install-azure-cli
[move-resources-new-subscription-resource-group]: ../azure-resource-manager/management/move-resource-group-and-subscription.md
[az-aks-show]: /cli/azure/disk#az-disk-show
[az-disk-list]: /cli/azure/disk#az-disk-list
[move-resources-checklist]: ../azure-resource-manager/management/move-resource-group-and-subscription.md#checklist-before-moving-resources
[move-resources-using-porta]: ../azure-resource-manager/management/move-resource-group-and-subscription.md#use-the-portal
[move-resources-using-azure-powershell]: ../azure-resource-manager/management/move-resource-group-and-subscription.md#use-azure-powershell
[move-resources-using-azure-cli]: ../azure-resource-manager/management/move-resource-group-and-subscription.md#use-azure-cli
[operator-best-practices-storage]: operator-best-practices-storage.md
