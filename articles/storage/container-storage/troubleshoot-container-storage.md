---
title: Troubleshoot Azure Container Storage
description: Troubleshoot common problems with Azure Container Storage, including installation and storage pool issues.
author: khdownie
ms.service: azure-container-storage
ms.date: 07/24/2024
ms.author: kendownie
ms.topic: how-to
---

# Troubleshoot Azure Container Storage

[Azure Container Storage](container-storage-introduction.md) is a cloud-based volume management, deployment, and orchestration service built natively for containers. Use this article to troubleshoot common issues with Azure Container Storage and find resolutions to problems.

## Troubleshoot installation issues

### Azure Container Storage fails to install

After running `az aks create`, you might see the message *Azure Container Storage failed to install. AKS cluster is created. Please run `az aks update` along with `--enable-azure-container-storage` to enable Azure Container Storage*.

This message means that Azure Container Storage wasn't installed, but your AKS cluster was created properly.

To install Azure Container Storage on the cluster and create a storage pool, run the following command. Replace `<cluster-name>` and `<resource-group>` with your own values. Replace `<storage-pool-type>` with `azureDisk`, `ephemeraldisk`, or `elasticSan`.

```azurecli-interactive
az aks update -n <cluster-name> -g <resource-group> --enable-azure-container-storage <storage-pool-type>
```

### Can't set storage pool type to NVMe

If you try to install Azure Container Storage with Ephemeral Disk, specifically with local NVMe on a cluster where the virtual machine (VM) SKU doesn't have NVMe drives, you get the following error message: *Cannot set --storage-pool-option as NVMe as none of the node pools can support ephemeral NVMe disk*.

To remediate, create a node pool with a VM SKU that has NVMe drives and try again. See [storage optimized VMs](/azure/virtual-machines/sizes-storage).

## Troubleshoot storage pool issues

To check the status of your storage pools, run `kubectl describe sp <storage-pool-name> -n acstor`. Here are some issues you might encounter.

### Error when trying to expand an Azure Disks storage pool

If your existing storage pool is less than 4 TiB (4,096 GiB), you can only expand it up to 4,095 GiB. If you try to expand beyond that, the internal PVC will get an error message like "Only Disk CachingType 'None' is supported for disk with size greater than 4095 GB" or ""Disk 'xxx' of size 4096 GB (<=4096 GB) cannot be resized to 16384 GB (>4096 GB) while it is attached to a running VM. Please stop your VM or detach the disk and retry the operation."

To avoid errors, don't attempt to expand your current storage pool beyond 4,095 GiB if it is initially smaller than 4 TiB (4,096 GiB). Storage pools larger than 4 TiB can be expanded up to the maximum storage capacity available.

This limitation only applies when using `Premium_LRS`, `Standard_LRS`, `StandardSSD_LRS`, `Premium_ZRS`, and `StandardSSD_ZRS` Disk SKUs.

### Elastic SAN creation fails

If you're trying to create an Elastic SAN storage pool, you might see the message *Azure Elastic SAN creation failed: Maximum possible number of Elastic SAN for the Subscription created already*. This means that you've reached the limit on the number of Elastic SAN resources that can be deployed in a region per subscription. You can check the limit here: [Elastic SAN scalability and performance targets](../elastic-san/elastic-san-scale-targets.md#elastic-san-scale-targets). Consider deleting any existing Elastic SAN resources on the subscription that are no longer being used, or try creating the storage pool in a different region.

### No block devices found

If you see this message, you're likely trying to create an Ephemeral Disk storage pool on a cluster where the VM SKU doesn't have NVMe drives.

To remediate, create a node pool with a VM SKU that has NVMe drives and try again. See [storage optimized VMs](/azure/virtual-machines/sizes-storage).

### Storage pool type already enabled

If you try to enable a storage pool type that's already enabled, you get the following message: *Invalid `--enable-azure-container-storage` value. Azure Container Storage is already enabled for storage pool type `<storage-pool-type>` in the cluster*. You can check if you have any existing storage pools created by running `kubectl get sp -n acstor`.

### Disabling a storage pool type

When disabling a storage pool type via `az aks update --disable-azure-container-storage <storage-pool-type>` or uninstalling Azure Container Storage via `az aks update --disable-azure-container-storage all`, if there's an existing storage pool of that type, you get the following message:

*Disabling Azure Container Storage for storage pool type `<storage-pool-type>` will forcefully delete all the storage pools of the same type and affect the applications using these storage pools. Forceful deletion of storage pools can also lead to leaking of storage resources which are being consumed. Do you want to validate whether any of the storage pools of type `<storage-pool-type>` are being used before disabling Azure Container Storage? (Y/n)*

If you select Y, an automatic validation runs to ensure that there are no persistent volumes created from the storage pool. Selecting n bypasses this validation and disables the storage pool type, deleting any existing storage pools and potentially affecting your application.

### Can't delete resource group containing AKS cluster

If you created an Elastic SAN storage pool, you might not be able to delete the resource group in which your AKS cluster is located.

To resolve this, sign in to the [Azure portal](https://portal.azure.com?azure-portal=true) and select **Resource groups**. Locate the resource group that AKS created (the resource group name starts with **MC_**). Select the SAN resource object within that resource group. Manually remove all volumes and volume groups. Then retry deleting the resource group that includes your AKS cluster.

## Troubleshoot volume issues

### Pod pending creation due to ephemeral volume size above available capacity

An ephemeral volume is allocated on a single node. When you configure the size of ephemeral volumes for your pods, the size should be less than the available capacity of a single node's ephemeral disk. Otherwise, the pod creation will be in pending status.

Use the following command to check if your pod creation is in pending status.

```output
$ kubectl get pods
NAME     READY   STATUS    RESTARTS   AGE
fiopod   0/1     Pending   0          17s
```

In this example, the pod `fiopod` is in `Pending` status.

Use the following command to check if the pod has the warning event for persistentvolumeclaim creation.

```output
$ kubectl describe pod fiopod
...
Events:
  Type     Reason            Age   From               Message
  ----     ------            ----  ----               -------
  Warning  FailedScheduling  40s   default-scheduler  0/3 nodes are available: waiting for ephemeral volume controller to create the persistentvolumeclaim "fiopod-ephemeralvolume". preemption: 0/3 nodes are available: 3 Preemption is not helpful for scheduling..
```

In this example, the pod shows the warning event on creating persistent volume claim `fiopod-ephemeralvolume`.

Use the following command to check if the persistent volume claim fails to provision due to insufficient capacity.

```output
$ kubectl describe pvc fiopod-ephemeralvolume
...
  Warning  ProvisioningFailed    107s (x13 over 20m)  containerstorage.csi.azure.com_aks-nodepool1-29463073-vmss000000_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  failed to provision volume with StorageClass "acstor-ephemeraldisk-temp": rpc error: code = Internal desc = Operation failed: GenericOperation("error in response: status code '507 Insufficient Storage', content: 'RestJsonError { details: \"Operation failed due to insufficient resources: Not enough suitable pools available, 0/1\", message: \"SvcError :: NotEnoughResources\", kind: ResourceExhausted }'")
```

In this example, `Insufficient Storage` is shown as the reason for volume provisioning failure.

Run the following command to check the available capacity of a single node's ephemeral disk.

```output
$ kubectl get diskpool -n acstor
NAME                                CAPACITY      AVAILABLE     USED        RESERVED    READY   AGE
ephemeraldisk-temp-diskpool-jaxwb   75660001280   75031990272   628011008   560902144   True    21h
ephemeraldisk-temp-diskpool-wzixx   75660001280   75031990272   628011008   560902144   True    21h
ephemeraldisk-temp-diskpool-xbtlj   75660001280   75031990272   628011008   560902144   True    21h
```

In this example, the available capacity of temp disk for a single node is `75031990272` bytes or 69 GiB.

Adjust the volume storage size below available capacity and re-deploy your pod. See [Deploy a pod with a generic ephemeral volume](use-container-storage-with-temp-ssd.md#3-deploy-a-pod-with-a-generic-ephemeral-volume).

### Volume fails to attach due to metadata store offline

Azure Container Storage uses `etcd`, a distributed, reliable key-value store, to store and manage metadata of volumes to support volume orchestration operations. For high availability and resiliency, `etcd` runs in three pods. When there are less than two `etcd` instances running, Azure Container Storage will halt volume orchestration operations while still allowing data access to the volumes. Azure Container Storage automatically detects when an `etcd` instance is offline and recovers it. However, if you notice volume orchestration errors after restarting an AKS cluster, it's possible that an `etcd` instance failed to auto-recover. Follow the instructions in this section to determine the health status of the `etcd` instances.

Run the following command to get a list of pods.

```azurecli-interactive
kubectl get pods
```

You'll see output similar to the following.

```output
NAME     READY   STATUS              RESTARTS   AGE 
fiopod   0/1     ContainerCreating   0          25m 
```

Describe the pod:

```azurecli-interactive
kubectl describe pod fiopod
```

Typically, you'll see volume failure messages if the metadata store is offline. In this example, **fiopod** is in **ContainerCreating** status, and the **FailedAttachVolume** warning indicates that the creation is pending due to volume attach failure.

```output
Name:             fiopod 

Events: 

Type     Reason              Age                 From                     Message 

----     ------              ----                ----                     ------- 

Normal   Scheduled           25m                 default-scheduler        Successfully assigned default/fiopod to aks-nodepool1-xxxxxxxx-vmss000009

Warning  FailedAttachVolume  3m8s (x6 over 23m)  attachdetach-controller  AttachVolume.Attach failed for volume "pvc-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" : timed out waiting for external-attacher of containerstorage.csi.azure.com CSI driver to attach volume xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

You can also run the following command to check the status of `etcd` instances:

```azurecli-interactive
kubectl get pods -n acstor | grep "^etcd"
```

You should see output similar to the following, with all instances in the Running state:

```output
etcd-azurecontainerstorage-bn89qvzvzv                            1/1     Running   0               4d19h
etcd-azurecontainerstorage-phf92lmqml                            1/1     Running   0               4d19h
etcd-azurecontainerstorage-xznvwcgq4p                            1/1     Running   0               4d19h
```

If fewer than two instances are shown in the Running state, you can conclude that the volume is failing to attach due to the metadata store being offline, and the automated recovery wasn't successful. If this is the case, file a support ticket with [Azure Support]( https://azure.microsoft.com/support/).

## See also

- [Azure Container Storage FAQ](container-storage-faq.md)
