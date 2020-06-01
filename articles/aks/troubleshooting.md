---
title: Troubleshoot common Azure Kubernetes Service problems
description: Learn how to troubleshoot and resolve common problems when using Azure Kubernetes Service (AKS)
services: container-service
ms.topic: troubleshooting
ms.date: 05/16/2020
---

# AKS troubleshooting

When you create or manage Azure Kubernetes Service (AKS) clusters, you might occasionally come across problems. This article details some common problems and troubleshooting steps.

## In general, where do I find information about debugging Kubernetes problems?

Try the [official guide to troubleshooting Kubernetes clusters](https://kubernetes.io/docs/tasks/debug-application-cluster/troubleshooting/).
There's also a [troubleshooting guide](https://github.com/feiskyer/kubernetes-handbook/blob/master/en/troubleshooting/index.md), published by a Microsoft engineer for troubleshooting pods, nodes, clusters, and other features.

## I'm getting a "quota exceeded" error during creation or upgrade. What should I do? 

 [Request more cores](https://docs.microsoft.com/azure/azure-portal/supportability/resource-manager-core-quotas-request).

## What is the maximum pods-per-node setting for AKS?

The maximum pods-per-node setting is 30 by default if you deploy an AKS cluster in the Azure portal.
The maximum pods-per-node setting is 110 by default if you deploy an AKS cluster in the Azure CLI. (Make sure you're using the latest version of the Azure CLI). This setting can be changed by using the `–-max-pods` flag in the `az aks create` command.

## I'm getting an insufficientSubnetSize error while deploying an AKS cluster with advanced networking. What should I do?

When using Azure CNI network plugin, AKS allocates IP addresses based on the "--max-pods" per node parameter. The subnet size must be greater than number of nodes times the max pods per node setting. The following equation outlines it:

Subnet size > number of nodes in the cluster (taking into consideration the future scaling requirements) * max pods per node set.

For more information, see [Plan IP addressing for your cluster](configure-azure-cni.md#plan-ip-addressing-for-your-cluster).

## My pod is stuck in CrashLoopBackOff mode. What should I do?

There might be various reasons for the pod being stuck in that mode. You might look into:

* The pod itself, by using `kubectl describe pod <pod-name>`.
* The logs, by using `kubectl logs <pod-name>`.

For more information on how to troubleshoot pod problems, see [Debug applications](https://kubernetes.io/docs/tasks/debug-application-cluster/debug-application/#debugging-pods).

## I'm trying to enable Role-Based Access Control (RBAC) on an existing cluster. How can I do that?

Enabling role-based access control (RBAC) on existing clusters isn't supported at this time, it must be set when creating new clusters. RBAC is enabled by default when using CLI, Portal, or an API version later than `2020-03-01`.

## I created a cluster with RBAC enabled and now I see many warnings on the Kubernetes dashboard. The dashboard used to work without any warnings. What should I do?

The reason for the warnings is the cluster has RBAC enabled and access to the dashboard is now restricted by default. In general, this approach is good practice because the default exposure of the dashboard to all users of the cluster can lead to security threats. If you still want to enable the dashboard, follow the steps in [this blog post](https://pascalnaber.wordpress.com/2018/06/17/access-dashboard-on-aks-with-rbac-enabled/).

## I can't connect to the dashboard. What should I do?

The easiest way to access your service outside the cluster is to run `kubectl proxy`, which proxies requests sent to your localhost port 8001 to the Kubernetes API server. From there, the API server can proxy to your service: `http://localhost:8001/api/v1/namespaces/kube-system/services/kubernetes-dashboard/proxy/`.

If you don't see the Kubernetes dashboard, check whether the `kube-proxy` pod is running in the `kube-system` namespace. If it isn't in a running state, delete the pod and it will restart.

## I can't get logs by using kubectl logs or I can't connect to the API server. I'm getting "Error from server: error dialing backend: dial tcp…". What should I do?

Ensure ports 22, 9000 and 1194 are open to connect to the API server. Check whether the `tunnelfront` or `aks-link` pod is running in the *kube-system* namespace using the `kubectl get pods --namespace kube-system` command. If it isn't, force deletion of the pod and it will restart.

## I'm trying to upgrade or scale and am getting a `"Changing property 'imageReference' is not allowed"` error. How do I fix this problem?

You might be getting this error because you've modified the tags in the agent nodes inside the AKS cluster. Modify or delete tags and other properties of resources in the MC_* resource group can lead to unexpected results. Altering the resources under the MC_* group in the AKS cluster breaks the service-level objective (SLO).

## I'm receiving errors that my cluster is in failed state and upgrading or scaling will not work until it is fixed

*This troubleshooting assistance is directed from https://aka.ms/aks-cluster-failed*

This error occurs when clusters enter a failed state for multiple reasons. Follow the steps below to resolve your cluster failed state before retrying the previously failed operation:

1. Until the cluster is out of `failed` state, `upgrade` and `scale` operations won't succeed. Common root issues and resolutions include:
    * Scaling with **insufficient compute (CRP) quota**. To resolve, first scale your cluster back to a stable goal state within quota. Then follow these [steps to request a compute quota increase](../azure-portal/supportability/resource-manager-core-quotas-request.md) before trying to scale up again beyond initial quota limits.
    * Scaling a cluster with advanced networking and **insufficient subnet (networking) resources**. To resolve, first scale your cluster back to a stable goal state within quota. Then follow [these steps to request a resource quota increase](../azure-resource-manager/templates/error-resource-quota.md#solution) before trying to scale up again beyond initial quota limits.
2. Once the underlying cause for upgrade failure is resolved, your cluster should be in a succeeded state. Once a succeeded state is verified, retry the original operation.

## I'm receiving errors when trying to upgrade or scale that state my cluster is being upgraded or has failed upgrade

*This troubleshooting assistance is directed from https://aka.ms/aks-pending-upgrade*

 You can't have a cluster or node pool simultaneously upgrade and scale. Instead, each operation type must complete on the target resource before the next request on that same resource. As a result, operations are limited when active upgrade or scale operations are occurring or attempted. 

To help diagnose the issue run `az aks show -g myResourceGroup -n myAKSCluster -o table` to retrieve detailed status on your cluster. Based on the result:

* If cluster is actively upgrading, wait until the operation finishes. If it succeeded, retry the previously failed operation again.
* If cluster has failed upgrade, follow steps outlined in previous section.

## Can I move my cluster to a different subscription or my subscription with my cluster to a new tenant?

If you've moved your AKS cluster to a different subscription or the cluster's subscription to a new tenant, the cluster won't function because of missing cluster identity permissions. **AKS doesn't support moving clusters across subscriptions or tenants** because of this constraint.

## I'm receiving errors trying to use features that require virtual machine scale sets

*This troubleshooting assistance is directed from aka.ms/aks-vmss-enablement*

You may receive errors that indicate your AKS cluster isn't on a virtual machine scale set, such as the following example:

**AgentPool `<agentpoolname>` has set auto scaling as enabled but isn't on Virtual Machine Scale Sets**

Features such as the cluster autoscaler or multiple node pools require virtual machine scale sets as the `vm-set-type`.

Follow the *Before you begin* steps in the appropriate doc to correctly create an AKS cluster:

* [Use the cluster autoscaler](cluster-autoscaler.md)
* [Create and use multiple node pools](use-multiple-node-pools.md)
 
## What naming restrictions are enforced for AKS resources and parameters?

*This troubleshooting assistance is directed from aka.ms/aks-naming-rules*

Naming restrictions are implemented by both the Azure platform and AKS. If a resource name or parameter breaks one of these restrictions, an error is returned that asks you provide a different input. The following common naming guidelines apply:

* Cluster names must be 1-63 characters. The only allowed characters are letters, numbers, dashes, and underscore. The first and last character must be a letter or a number.
* The AKS Node/*MC_* resource group name combines resource group name and resource name. The autogenerated syntax of `MC_resourceGroupName_resourceName_AzureRegion` must be no greater than 80 chars. If needed, reduce the length of your resource group name or AKS cluster name. You may also [customize your node resource group name](cluster-configuration.md#custom-resource-group-name)
* The *dnsPrefix* must start and end with alphanumeric values and must be between 1-54 characters. Valid characters include alphanumeric values and hyphens (-). The *dnsPrefix* can't include special characters such as a period (.).
* AKS Node Pool names must be all lowercase and be 1-11 characters for linux node pools and 1-6 characters for windows node pools. The name must start with a letter and the only allowed characters are letters and numbers.

## I'm receiving errors when trying to create, update, scale, delete or upgrade cluster, that operation is not allowed as another operation is in progress.

*This troubleshooting assistance is directed from aka.ms/aks-pending-operation*

Cluster operations are limited when a previous operation is still in progress. To retrieve a detailed status of your cluster, use the `az aks show -g myResourceGroup -n myAKSCluster -o table` command. Use your own resource group and AKS cluster name as needed.

Based on the output of the cluster status:

* If the cluster is in any provisioning state other than *Succeeded* or *Failed*, wait until the operation (*Upgrading / Updating / Creating / Scaling / Deleting / Migrating*) finishes. When the previous operation has completed, retry your latest cluster operation.

* If the cluster has a failed upgrade, follow the steps outlined [I'm receiving errors that my cluster is in failed state and upgrading or scaling will not work until it is fixed](#im-receiving-errors-that-my-cluster-is-in-failed-state-and-upgrading-or-scaling-will-not-work-until-it-is-fixed).

## Received an error saying my service principal wasn't found or is invalid when I try to create a new cluster.

When creating an AKS cluster, it requires a service principal or managed identity to create resources on your behalf. AKS can automatically create a new service principal at cluster creation time or receive an existing one. When using an automatically created one, Azure Active Directory needs to propagate it to every region so the creation succeeds. When the propagation takes too long, the cluster will fail validation to create as it can't find an available service principal to do so. 

Use the following workarounds for this issue:
* Use an existing service principal, which has already propagated across regions and exists to pass into AKS at cluster create time.
* If using automation scripts, add time delays between service principal creation and AKS cluster creation.
* If using Azure portal, return to the cluster settings during create and retry the validation page after a few minutes.





## I'm receiving errors after restricting egress traffic

When restricting egress traffic from an AKS cluster, there are [required and optional recommended](limit-egress-traffic.md) outbound ports / network rules and FQDN / application rules for AKS. If your settings are in conflict with any of these rules, certain `kubectl` commands won't work correctly. You may also see errors when creating an AKS cluster.

Verify that your settings aren't conflicting with any of the required or optional recommended outbound ports / network rules and FQDN / application rules.

## Azure Storage and AKS Troubleshooting

### What are the recommended stable versions of Kubernetes for Azure disk? 

| Kubernetes version | Recommended version |
|--|:--:|
| 1.12 | 1.12.9 or later |
| 1.13 | 1.13.6 or later |
| 1.14 | 1.14.2 or later |


### WaitForAttach failed for Azure Disk: parsing "/dev/disk/azure/scsi1/lun1": invalid syntax

In Kubernetes version 1.10, MountVolume.WaitForAttach may fail with an Azure Disk remount.

On Linux, you may see an incorrect DevicePath format error. For example:

```console
MountVolume.WaitForAttach failed for volume "pvc-f1562ecb-3e5f-11e8-ab6b-000d3af9f967" : azureDisk - Wait for attach expect device path as a lun number, instead got: /dev/disk/azure/scsi1/lun1 (strconv.Atoi: parsing "/dev/disk/azure/scsi1/lun1": invalid syntax)
  Warning  FailedMount             1m (x10 over 21m)   kubelet, k8s-agentpool-66825246-0  Unable to mount volumes for pod
```

On Windows, you may see a wrong DevicePath(LUN) number error. For example:

```console
Warning  FailedMount             1m    kubelet, 15282k8s9010    MountVolume.WaitForAttach failed for volume "disk01" : azureDisk - WaitForAttach failed within timeout node (15282k8s9010) diskId:(andy-mghyb
1102-dynamic-pvc-6c526c51-4a18-11e8-ab5c-000d3af7b38e) lun:(4)
```

This issue has been fixed in the following versions of Kubernetes:

| Kubernetes version | Fixed version |
|--|:--:|
| 1.10 | 1.10.2 or later |
| 1.11 | 1.11.0 or later |
| 1.12 and later | N/A |


### Failure when setting uid and gid in mountOptions for Azure Disk

Azure Disk uses the ext4,xfs filesystem by default and mountOptions such as uid=x,gid=x can't be set at mount time. For example if you tried to set mountOptions uid=999,gid=999, would see an error like:

```console
Warning  FailedMount             63s                  kubelet, aks-nodepool1-29460110-0  MountVolume.MountDevice failed for volume "pvc-d783d0e4-85a1-11e9-8a90-369885447933" : azureDisk - mountDevice:FormatAndMount failed with mount failed: exit status 32
Mounting command: systemd-run
Mounting arguments: --description=Kubernetes transient mount for /var/lib/kubelet/plugins/kubernetes.io/azure-disk/mounts/m436970985 --scope -- mount -t xfs -o dir_mode=0777,file_mode=0777,uid=1000,gid=1000,defaults /dev/disk/azure/scsi1/lun2 /var/lib/kubelet/plugins/kubernetes.io/azure-disk/mounts/m436970985
Output: Running scope as unit run-rb21966413ab449b3a242ae9b0fbc9398.scope.
mount: wrong fs type, bad option, bad superblock on /dev/sde,
       missing codepage or helper program, or other error
```

You can mitigate the issue by doing one the  options:

* [Configure the security context for a pod](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/) by setting uid in runAsUser and gid in fsGroup. For example, the following setting will set pod run as root, make it accessible to any file:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: security-context-demo
spec:
  securityContext:
    runAsUser: 0
    fsGroup: 0
```

  >[!NOTE]
  > Since gid and uid are mounted as root or 0 by default. If gid or uid are set as non-root, for example 1000, Kubernetes will use `chown` to change all directories and files under that disk. This operation can be time consuming and may make mounting the disk very slow.

* Use `chown` in initContainers to set gid and uid. For example:

```yaml
initContainers:
- name: volume-mount
  image: busybox
  command: ["sh", "-c", "chown -R 100:100 /data"]
  volumeMounts:
  - name: <your data volume>
    mountPath: /data
```

### Azure Disk detach failure leading to potential race condition issue and invalid data disk list

When an Azure Disk fails to detach, it will retry up to six times to detach the disk using exponential back off. It will also hold a node-level lock on the data disk list for about 3 minutes. If the disk list is updated manually during that time, it will cause the disk list held by the node-level lock to be obsolete and cause instability on the node.

This issue has been fixed in the following versions of Kubernetes:

| Kubernetes version | Fixed version |
|--|:--:|
| 1.12 | 1.12.9 or later |
| 1.13 | 1.13.6 or later |
| 1.14 | 1.14.2 or later |
| 1.15 and later | N/A |

If you're using a version of Kubernetes that doesn't have the fix for this issue and your node has an obsolete disk list, you can mitigate by detaching all non-existing disks from the VM as a bulk operation. **Individually detaching non-existing disks may fail.**

### Large number of Azure Disks causes slow attach/detach

When the numbers of Azure Disk attach/detach operations targeting a single node VM is larger than 10, or larger than 3 when targeting single virtual machine scale set pool they may be slower than expected as they are done sequentially. This issue is a known limitation and there are no workarounds at this time. [User voice item to support parallel attach/detach beyond  number.](https://feedback.azure.com/forums/216843-virtual-machines/suggestions/40444528-vmss-support-for-parallel-disk-attach-detach-for).

### Azure Disk detach failure leading to potential node VM in failed state

In some edge cases, an Azure Disk detach may partially fail and leave the node VM in a failed state.

This issue has been fixed in the following versions of Kubernetes:

| Kubernetes version | Fixed version |
|--|:--:|
| 1.12 | 1.12.10 or later |
| 1.13 | 1.13.8 or later |
| 1.14 | 1.14.4 or later |
| 1.15 and later | N/A |

If you're using a version of Kubernetes that doesn't have the fix for this issue and your node is in a failed state, you can mitigate by manually updating the VM status using one of the below:

* For an availability set-based cluster:
    ```azurecli
    az vm update -n <VM_NAME> -g <RESOURCE_GROUP_NAME>
    ```

* For a VMSS-based cluster:
    ```azurecli
    az vmss update-instances -g <RESOURCE_GROUP_NAME> --name <VMSS_NAME> --instance-id <ID>
    ```

## Azure Files and AKS Troubleshooting

### What are the recommended stable versions of Kubernetes for Azure files?
 
| Kubernetes version | Recommended version |
|--|:--:|
| 1.12 | 1.12.6 or later |
| 1.13 | 1.13.4 or later |
| 1.14 | 1.14.0 or later |

### What are the default mountOptions when using Azure Files?

Recommended settings:

| Kubernetes version | fileMode and dirMode value|
|--|:--:|
| 1.12.0 - 1.12.1 | 0755 |
| 1.12.2 and later | 0777 |

Mount options can be specified on the storage class object. The following example sets *0777*:

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: azurefile
provisioner: kubernetes.io/azure-file
mountOptions:
  - dir_mode=0777
  - file_mode=0777
  - uid=1000
  - gid=1000
  - mfsymlinks
  - nobrl
  - cache=none
parameters:
  skuName: Standard_LRS
```

Some additional useful *mountOptions* settings:

* *mfsymlinks* will make Azure Files mount  (cifs) support symbolic links
* *nobrl* will prevent sending byte range lock requests to the server. This setting is necessary for certain applications that break with cifs style mandatory byte range locks. Most cifs servers don't yet support requesting advisory byte range locks. If not using *nobrl*, applications that break with cifs style mandatory byte range locks may cause error messages similar to:
    ```console
    Error: SQLITE_BUSY: database is locked
    ```

### Error "could not change permissions" when using Azure Files

When running PostgreSQL on the Azure Files plugin, you may see an error similar to:

```console
initdb: could not change permissions of directory "/var/lib/postgresql/data": Operation not permitted
fixing permissions on existing directory /var/lib/postgresql/data
```

This error is caused by the Azure Files plugin using the cifs/SMB protocol. When using the cifs/SMB protocol, the file and directory permissions couldn't be changed after mounting.

To resolve this issue, use *subPath* together with the Azure Disk plugin. 

> [!NOTE] 
> For ext3/4 disk type, there is a lost+found directory after the disk is formatted.

### Azure Files has high latency compared to Azure Disk when handling many small files

In some case, such as handling many small files, you may experience high latency when using Azure Files when compared to Azure Disk.

### Error when enabling "Allow access allow access from selected network" setting on storage account

If you enable *allow access from selected network* on a storage account that's used for dynamic provisioning in AKS, you'll get an error when AKS creates a file share:

```console
persistentvolume-controller (combined from similar events): Failed to provision volume with StorageClass "azurefile": failed to create share kubernetes-dynamic-pvc-xxx in account xxx: failed to create file share, err: storage: service returned error: StatusCode=403, ErrorCode=AuthorizationFailure, ErrorMessage=This request is not authorized to perform this operation.
```

This error is because of the Kubernetes *persistentvolume-controller* not being on the network chosen when setting *allow access from selected network*.

You can mitigate the issue by using [static provisioning with Azure Files](azure-files-volume.md).

### Azure Files fails to remount in Windows pod

If a Windows pod with an Azure Files mount is deleted and then scheduled to be recreated on the same node, the mount will fail. This failure is because of the `New-SmbGlobalMapping` command failing since the Azure Files mount is already mounted on the node.

For example, you may see an error similar to:

```console
E0118 08:15:52.041014    2112 nestedpendingoperations.go:267] Operation for "\"kubernetes.io/azure-file/42c0ea39-1af9-11e9-8941-000d3af95268-pvc-d7e1b5f9-1af3-11e9-8941-000d3af95268\" (\"42c0ea39-1af9-11e9-8941-000d3af95268\")" failed. No retries permitted until 2019-01-18 08:15:53.0410149 +0000 GMT m=+732.446642701 (durationBeforeRetry 1s). Error: "MountVolume.SetUp failed for volume \"pvc-d7e1b5f9-1af3-11e9-8941-000d3af95268\" (UniqueName: \"kubernetes.io/azure-file/42c0ea39-1af9-11e9-8941-000d3af95268-pvc-d7e1b5f9-1af3-11e9-8941-000d3af95268\") pod \"deployment-azurefile-697f98d559-6zrlf\" (UID: \"42c0ea39-1af9-11e9-8941-000d3af95268\") : azureMount: SmbGlobalMapping failed: exit status 1, only SMB mount is supported now, output: \"New-SmbGlobalMapping : Generic failure \\r\\nAt line:1 char:190\\r\\n+ ... ser, $PWord;New-SmbGlobalMapping -RemotePath $Env:smbremotepath -Cred ...\\r\\n+                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\\r\\n    + CategoryInfo          : NotSpecified: (MSFT_SmbGlobalMapping:ROOT/Microsoft/...mbGlobalMapping) [New-SmbGlobalMa \\r\\n   pping], CimException\\r\\n    + FullyQualifiedErrorId : HRESULT 0x80041001,New-SmbGlobalMapping\\r\\n \\r\\n\""
```

This issue has been fixed in the following versions of Kubernetes:

| Kubernetes version | Fixed version |
|--|:--:|
| 1.12 | 1.12.6 or later |
| 1.13 | 1.13.4 or later |
| 1.14 and later | N/A |

### Azure Files mount fails because of storage account key changed

If your storage account key has changed, you may see Azure Files mount failures.

You can mitigate by manually updating the `azurestorageaccountkey` field manually in an Azure file secret with your base64-encoded storage account key.

To encode your storage account key in base64, you can use `base64`. For example:

```console
echo X+ALAAUgMhWHL7QmQ87E1kSfIqLKfgC03Guy7/xk9MyIg2w4Jzqeu60CVw2r/dm6v6E0DWHTnJUEJGVQAoPaBc== | base64
```

To update your Azure secret file, use `kubectl edit secret`. For example:

```console
kubectl edit secret azure-storage-account-{storage-account-name}-secret
```

After a few minutes, the agent node will retry the Azure File mount with the updated storage key.


### Cluster autoscaler fails to scale with error failed to fix node group sizes

If your cluster autoscaler isn't scaling up/down and you see an error like the below on the [cluster autoscaler logs][view-master-logs].

```console
E1114 09:58:55.367731 1 static_autoscaler.go:239] Failed to fix node group sizes: failed to decrease aks-default-35246781-vmss: attempt to delete existing nodes
```

This error is because of an upstream cluster autoscaler race condition. In such a case, cluster autoscaler ends with a different value than the one that is actually in the cluster. To get out of this state, disable and re-enable the [cluster autoscaler][cluster-autoscaler].

### Slow disk attachment, GetAzureDiskLun takes 10 to 15 minutes and you receive an error

On Kubernetes versions **older than 1.15.0**, you may receive an error such as **Error WaitForAttach Cannot find Lun for disk**.  The workaround for this issue is to wait approximately 15 minutes and retry.

<!-- LINKS - internal -->
[view-master-logs]: view-master-logs.md
[cluster-autoscaler]: cluster-autoscaler.md
