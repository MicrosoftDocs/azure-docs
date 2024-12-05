---
title: Troubleshoot Azure Container Storage
description: Troubleshoot common problems with Azure Container Storage, including installation and storage pool issues.
author: khdownie
ms.service: azure-container-storage
ms.date: 10/15/2024
ms.author: kendownie
ms.topic: how-to
---

# Troubleshoot Azure Container Storage

[Azure Container Storage](container-storage-introduction.md) is a cloud-based volume management, deployment, and orchestration service built natively for containers. Use this article to troubleshoot common issues with Azure Container Storage and find resolutions to problems.

## Troubleshoot installation issues

### Azure Container Storage fails to install due to missing configuration

After running `az aks create`, you might see the message *Azure Container Storage failed to install. AKS cluster is created. Run `az aks update` along with `--enable-azure-container-storage` to enable Azure Container Storage*.

This message means that Azure Container Storage wasn't installed, but your AKS (Azure Kubernetes Service) cluster was created properly.

To install Azure Container Storage on the cluster and create a storage pool, run the following command. Replace `<cluster-name>` and `<resource-group>` with your own values. Replace `<storage-pool-type>` with `azureDisk`, `ephemeraldisk`, or `elasticSan`.

```azurecli-interactive
az aks update -n <cluster-name> -g <resource-group> --enable-azure-container-storage <storage-pool-type>
```

### Azure Container Storage fails to install due to Azure Policy restrictions

Azure Container Storage might fail to install if Azure Policy restrictions are in place. Specifically, Azure Container Storage relies on privileged containers. You may  configure Azure Policy to block privileged containers. When they're blocked, the installation of Azure Container Storage might time out or fail, and you might see errors in the `gatekeeper-controller` logs such as:

```output
$ kubectl logs -n gatekeeper-system deployment/gatekeeper-controller
... 
{"level":"info","ts":1722622443.9484184,"logger":"webhook","msg":"denied admission: Privileged container is not allowed: prereq, securityContext: {\"privileged\": true, \"runAsUser\": 0}","hookType":"validation","process":"admission","details":{},"event_type":"violation","constraint_name":"azurepolicy-k8sazurev2noprivilege-686dd8b209a774ba977c","constraint_group":"constraints.gatekeeper.sh","constraint_api_version":"v1beta1","constraint_kind":"K8sAzureV2NoPrivilege","constraint_action":"deny","resource_group":"","resource_api_version":"v1","resource_kind":"Pod","resource_namespace":"acstor","resource_name":"azurecontainerstorage-prereq-gt58x","request_username":"system:serviceaccount:kube-system:daemon-set-controller"}
{"level":"info","ts":1722622443.9839077,"logger":"webhook","msg":"denied admission: Privileged container is not allowed: metrics-exporter, securityContext: {\"privileged\": true}","hookType":"validation","process":"admission","details":{},"event_type":"violation","constraint_name":"azurepolicy-k8sazurev2noprivilege-686dd8b209a774ba977c","constraint_group":"constraints.gatekeeper.sh","constraint_api_version":"v1beta1","constraint_kind":"K8sAzureV2NoPrivilege","constraint_action":"deny","resource_group":"","resource_api_version":"v1","resource_kind":"Pod","resource_namespace":"acstor","resource_name":"azurecontainerstorage-metrics-exporter-286np","request_username":"system:serviceaccount:kube-system:daemon-set-controller"}
{"level":"info","ts":1722622444.0515249,"logger":"webhook","msg":"denied admission: Privileged container is not allowed: csi-node, securityContext: {\"privileged\": true}","hookType":"validation","process":"admission","details":{},"event_type":"violation","constraint_name":"azurepolicy-k8sazurev2noprivilege-686dd8b209a774ba977c","constraint_group":"constraints.gatekeeper.sh","constraint_api_version":"v1beta1","constraint_kind":"K8sAzureV2NoPrivilege","constraint_action":"deny","resource_group":"","resource_api_version":"v1","resource_kind":"Pod","resource_namespace":"acstor","resource_name":"azurecontainerstorage-csi-node-7hcd7","request_username":"system:serviceaccount:kube-system:daemon-set-controller"}
{"level":"info","ts":1722622444.0729053,"logger":"webhook","msg":"denied admission: Privileged container is not allowed: io-engine, securityContext: {\"privileged\": true}","hookType":"validation","process":"admission","details":{},"event_type":"violation","constraint_name":"azurepolicy-k8sazurev2noprivilege-686dd8b209a774ba977c","constraint_group":"constraints.gatekeeper.sh","constraint_api_version":"v1beta1","constraint_kind":"K8sAzureV2NoPrivilege","constraint_action":"deny","resource_group":"","resource_api_version":"v1","resource_kind":"Pod","resource_namespace":"acstor","resource_name":"azurecontainerstorage-io-engine-84hwx","request_username":"system:serviceaccount:kube-system:daemon-set-controller"}
{"level":"info","ts":1722622444.0742755,"logger":"webhook","msg":"denied admission: Privileged container is not allowed: ndm, securityContext: {\"privileged\": true}","hookType":"validation","process":"admission","details":{},"event_type":"violation","constraint_name":"azurepolicy-k8sazurev2noprivilege-686dd8b209a774ba977c","constraint_group":"constraints.gatekeeper.sh","constraint_api_version":"v1beta1","constraint_kind":"K8sAzureV2NoPrivilege","constraint_action":"deny","resource_group":"","resource_api_version":"v1","resource_kind":"Pod","resource_namespace":"acstor","resource_name":"azurecontainerstorage-ndm-x6q5n","request_username":"system:serviceaccount:kube-system:daemon-set-controller"}
{"level":"info","ts":1722622449.2412128,"logger":"webhook","msg":"denied admission: Privileged container is not allowed: ndm, securityContext: {\"privileged\": true}","hookType":"validation","process":"admission","details":{},"event_type":"violation","constraint_name":"azurepolicy-k8sazurev2noprivilege-686dd8b209a774ba977c","constraint_group":"constraints.gatekeeper.sh","constraint_api_version":"v1beta1","constraint_kind":"K8sAzureV2NoPrivilege","constraint_action":"deny","resource_group":"","resource_api_version":"v1","resource_kind":"Pod","resource_namespace":"acstor","resource_name":"azurecontainerstorage-ndm-b5nfg","request_username":"system:serviceaccount:kube-system:daemon-set-controller"}
```

To resolve the blocking, you need to add the `acstor` namespace to the exclusion list of your Azure Policy. Azure Policy is used to create and enforce rules for managing resources within Azure, including AKS clusters. In some cases, policies might block the creation of Azure Container Storage pods and components. You can find more details on working with Azure Policy for Kubernetes by consulting [Azure Policy for Kubernetes](/azure/governance/policy/concepts/policy-for-kubernetes).

To add the `acstor` namespace to the exclusion list, follow these steps:

1. [Create your Azure Kubernetes cluster](install-container-storage-aks.md).
1. Enable Azure Policy for AKS.
1. Create a policy that you suspect is blocking the installation of Azure Container Storage.
1. Attempt to install Azure Container Storage in the AKS cluster.
1. Check the logs for the gatekeeper-controller pod to confirm any policy violations.
1. Add the `acstor` namespace and `azure-extensions-usage-system` namespace to the exclusion list of the policy.
1. Attempt to install Azure Container Storage in the AKS cluster again.

### Can't install and enable Azure Container Storage in node pools with taints

You might configure [node taints](/azure/aks/use-node-taints) on the node pools to restrict pods from being scheduled on these node pools. Installing and enabling Azure Container Storage on these node pools may be blocked because the required pods can't be created in these node pools. The behavior applies to both the system node pool when installing and the user node pools when enabling.

You can check the node taints with the following example:

```bash
$ az aks nodepool list -g $resourceGroup --cluster-name $clusterName --query "[].{PoolName:name, nodeTaints:nodeTaints}"
[
...
  {
    "PoolName": "nodepoolx",
    "nodeTaints": [
      "sku=gpu:NoSchedule"
    ]
  }
]

```

You can remove these taints temporarily to unblock and configure them back after you install and enable successfully. You can go to Azure Portal > AKS cluster > Node pools, click your node pool, remove the taints in "Taints and labels
" section. Or you can use the following command to remove taints and confirm the change.

```bash
$ az aks nodepool update -g $resourceGroup --cluster-name $clusterName --name $nodePoolName --node-taints ""
$ az aks nodepool list -g $resourceGroup --cluster-name $clusterName --query "[].{PoolName:name, nodeTaints:nodeTaints}"
[
...
  {
    "PoolName": "nodepoolx",
    "nodeTaints": null
  }
]

```

Retry the installing or enabling after you remove node taints successfully. After it completes successfully, you can configure node taints back to resume the pod scheduling restraints.

### Can't set storage pool type to NVMe

If you try to install Azure Container Storage with Ephemeral Disk, specifically with local NVMe on a cluster where the virtual machine (VM) SKU doesn't have NVMe drives, you get the following error message: *Cannot set --storage-pool-option as NVMe as none of the node pools can support ephemeral NVMe disk*.

To remediate, create a node pool with a VM SKU that has NVMe drives and try again. See [storage optimized VMs](/azure/virtual-machines/sizes-storage).

## Troubleshoot storage pool issues

To check the status of your storage pools, run `kubectl describe sp <storage-pool-name> -n acstor`. Here are some issues you might encounter.

### Ephemeral storage pool doesn’t claim the capacity when the ephemeral disks are used by other daemonsets

Enabling an ephemeral storage pool on a node pool with temp SSD or local NVMe disks might not claim capacity from these disks if other daemonsets are using them.

Run the following steps to enable Azure Container Storage to manage these local disks exclusively:

1. Run the following command to see the claimed capacity by ephemeral storage pool:

   ```bash
   $ kubectl get sp -A
   NAMESPACE   NAME                 CAPACITY   AVAILABLE   USED   RESERVED   READY   AGE
   acstor      ephemeraldisk-nvme   0          0           0      0          False   82s
   ```
   This example shows zero capacity claimed by `ephemeraldisk-nvme` storage pool.

1. Run the following command to confirm unclaimed state of these local block devices and check existing file system on the disks:
   ```bash
   $ kubectl get bd -A
   NAMESPACE   NAME                                           NODENAME                               SIZE            CLAIMSTATE   STATUS   AGE
   acstor      blockdevice-1f7ad8fa32a448eb9768ad8e261312ff   aks-nodepoolnvme-38618677-vmss000001   1920383410176   Unclaimed    Active   22m
   acstor      blockdevice-9c8096fc47cc2b41a2ed07ec17a83527   aks-nodepoolnvme-38618677-vmss000000   1920383410176   Unclaimed    Active   23m
   $ kubectl describe bd -n acstor blockdevice-1f7ad8fa32a448eb9768ad8e261312ff
   Name:         blockdevice-1f7ad8fa32a448eb9768ad8e261312ff
   …
     Filesystem:
       Fs Type:  ext4
   …
   ```
   This example shows that the block devices are `Unclaimed` status and there's an existing file system on the disk.

1. Confirm that you want to use Azure Container Storage to manage the local data disks exclusively before proceeding.

1. Stop and remove the daemonsets or components that manage local data disks.

1. Log in to each node that has local data disks.

1. Remove existing file systems from all local data disks.

1. Restart ndm daemonset to discover unused local data disks.
   ```bash
   $ kubectl rollout restart daemonset -l app=ndm -n acstor
   daemonset.apps/azurecontainerstorage-ndm restarted
   $ kubectl rollout status daemonset -l app=ndm -n acstor --watch
   …
   daemon set "azurecontainerstorage-ndm" successfully rolled out
   ```

1. Wait a few seconds and check if the ephemeral storage pool claims the capacity from local data disks.

   ```bash
   $ kubectl wait -n acstor sp --all --for condition=ready
   storagepool.containerstorage.azure.com/ephemeraldisk-nvme condition met
   $ kubectl get bd -A
   NAMESPACE   NAME                                           NODENAME                               SIZE            CLAIMSTATE   STATUS   AGE
   acstor      blockdevice-1f7ad8fa32a448eb9768ad8e261312ff   aks-nodepoolnvme-38618677-vmss000001   1920383410176   Claimed      Active   4d16h
   acstor      blockdevice-9c8096fc47cc2b41a2ed07ec17a83527   aks-nodepoolnvme-38618677-vmss000000   1920383410176   Claimed      Active   4d16h
   $ kubectl get sp -A
   NAMESPACE   NAME                 CAPACITY        AVAILABLE       USED          RESERVED      READY   AGE
   acstor      ephemeraldisk-nvme   3840766820352   3812058578944   28708241408   26832871424   True    4d16h
   ```
   This example shows `ephemeraldisk-nvme` storage pool successfully claims the capacity from local NVMe disks on the nodes.

### Error when trying to expand an Azure Disks storage pool

If your existing storage pool is less than 4 TiB (4,096 GiB), you can only expand it up to 4,095 GiB. If you try to expand beyond the limit, the internal PVC shows an error message about disk size or caching type limitations. Stop your VM or detach the disk and retry the operation."

To avoid errors, don't attempt to expand your current storage pool beyond 4,095 GiB if it's initially smaller than 4 TiB (4,096 GiB). Storage pools larger than 4 TiB can be expanded up to the maximum storage capacity available.

This limitation only applies when using `Premium_LRS`, `Standard_LRS`, `StandardSSD_LRS`, `Premium_ZRS`, and `StandardSSD_ZRS` Disk SKUs.

### Elastic SAN creation fails

If you're trying to create an Elastic SAN storage pool, you might see the message *Azure Elastic SAN creation failed: Maximum possible number of Elastic SAN for the Subscription created already*. This means that you reach the limit on the number of Elastic SAN resources that can be deployed in a region per subscription. You can check the limit here: [Elastic SAN scalability and performance targets](../elastic-san/elastic-san-scale-targets.md#elastic-san-scale-targets). Consider deleting any existing Elastic SAN resources on the subscription that are no longer being used, or try creating the storage pool in a different region.

### No block devices found

If you see this message, you're likely trying to create an Ephemeral Disk storage pool on a cluster where the VM SKU doesn't have NVMe drives.

To remediate, create a node pool with a VM SKU that has NVMe drives and try again. See [storage optimized VMs](/azure/virtual-machines/sizes-storage).

### Storage pool type already enabled

If you try to enable a storage pool type that exists, you get the following message: *Invalid `--enable-azure-container-storage` value. Azure Container Storage is already enabled for storage pool type `<storage-pool-type>` in the cluster*. You can check if you have any existing storage pools created by running `kubectl get sp -n acstor`.

### Disabling a storage pool type

When disabling a storage pool type via `az aks update --disable-azure-container-storage <storage-pool-type>` or uninstalling Azure Container Storage via `az aks update --disable-azure-container-storage all`, if there's an existing storage pool of that type, you get the following message:

*Disabling Azure Container Storage for storage pool type `<storage-pool-type>` forcefully deletes all the storage pools of the same type and it affects the applications using these storage pools. Forceful deletion of storage pools can also lead to leaking of storage resources which are being consumed. Do you want to validate whether any of the storage pools of type `<storage-pool-type>` are being used before disabling Azure Container Storage? (Y/n)*

If you select Y, an automatic validation runs to ensure that there are no persistent volumes created from the storage pool. Selecting n bypasses this validation and disables the storage pool type, deleting any existing storage pools and potentially affecting your application.

## Troubleshoot volume issues

### Pod pending creation due to ephemeral volume size beyond available capacity

An ephemeral volume is allocated on a single node. When you configure the size of ephemeral volumes for your pods, the size should be less than the available capacity of a single node's ephemeral disk. Otherwise, the pod creation is in pending status.

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

Adjust the volume storage size less than available capacity and redeploy your pod. See [Deploy a pod with a generic ephemeral volume](use-container-storage-with-temp-ssd.md#3-deploy-a-pod-with-a-generic-ephemeral-volume).

### Volume fails to attach due to metadata store offline

Azure Container Storage uses `etcd`, a distributed, reliable key-value store, to store and manage metadata of volumes to support volume orchestration operations. For high availability and resiliency, `etcd` runs in three pods. When there are less than two `etcd` instances running, Azure Container Storage halts volume orchestration operations while still allowing data access to the volumes. Azure Container Storage automatically detects when an `etcd` instance is offline and recovers it. However, if you notice volume orchestration errors after restarting an AKS cluster, it's possible that an `etcd` instance failed to autorecover. Follow the instructions in this section to determine the health status of the `etcd` instances.

Run the following command to get a list of pods.

```azurecli-interactive
kubectl get pods
```

You may see output similar to the following.

```output
NAME     READY   STATUS              RESTARTS   AGE 
fiopod   0/1     ContainerCreating   0          25m 
```

Describe the pod:

```azurecli-interactive
kubectl describe pod fiopod
```

Typically, you see volume failure messages if the metadata store is offline. In this example, **fiopod** is in **ContainerCreating** status, and the **FailedAttachVolume** warning indicates that the creation is pending due to volume attach failure.

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

If fewer than two instances are running, the volume isn't attaching because the metadata store is offline, and automated recovery failed. If so, file a support ticket with [Azure Support]( https://azure.microsoft.com/support/).

## See also

- [Azure Container Storage FAQ](container-storage-faq.md)
