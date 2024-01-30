---
title: Enable Premium SSD v2 Disk support on Azure Kubernetes Service (AKS)
description: Learn how to enable and configure Premium SSD v2 Disks in an Azure Kubernetes Service (AKS) cluster.
ms.topic: article
ms.date: 04/25/2023

---

# Use Azure Premium SSD v2 disks on Azure Kubernetes Service

[Azure Premium SSD v2 disks][azure-premium-v2-disk-overview] offer IO-intense enterprise workloads, a consistent submillisecond disk latency, and high IOPS and throughput. The performance (capacity, throughput, and IOPS) of Premium SSD v2 disks can be independently configured at any time, making it easier for more scenarios to be cost efficient while meeting performance needs.

This article describes how to configure a new or existing AKS cluster to use Azure Premium SSD v2 disks.

## Before you begin

Before creating or upgrading an AKS cluster that is able to use Azure Premium SSD v2 disks, you need to create an AKS cluster in the same region and availability zone that supports Premium Storage and attach the disks following the steps below.

For an existing AKS cluster, you can enable Premium SSD v2 disks by adding a new node pool to your cluster, and then attach the disks following the steps below.

> [!IMPORTANT]
> Azure Premium SSD v2 disks require node pools deployed in regions that support these disks. For a list of supported regions, see [Premium SSD v2 disk supported regions][premium-v2-regions].

### Limitations

- Azure Premium SSD v2 disks have certain limitations that you need to be aware of. For a complete list, see [Premium SSD v2 limitations][premium-v2-limitations].

## Use Premium SSD v2 disks dynamically with a storage class

To use Premium SSD v2 disks in a deployment or stateful set, you can use a [storage class for dynamic provisioning][azure-disk-volume].

### Create the storage class

A storage class is used to define how a unit of storage is dynamically created with a persistent volume. For more information on Kubernetes storage classes, see [Kubernetes Storage Classes][kubernetes-storage-classes].

In this example, you create a storage class that references Premium SSD v2 disks. Create a file named `azure-pv2-disk-sc.yaml`, and copy in the following manifest.

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
   name: premium2-disk-sc
parameters:
   cachingMode: None
   skuName: PremiumV2_LRS
   DiskIOPSReadWrite: "4000"
   DiskMBpsReadWrite: "1000"
provisioner: disk.csi.azure.com
reclaimPolicy: Delete
volumeBindingMode: Immediate
allowVolumeExpansion: true
```

Create the storage class with the [kubectl apply][kubectl-apply] command and specify your *azure-pv2-disk-sc.yaml* file:

```bash
kubectl apply -f azure-pv2-disk-sc.yaml
```

The output from the command resembles the following example:

```console
storageclass.storage.k8s.io/premium2-disk-sc created
```

## Create a persistent volume claim

A persistent volume claim (PVC) is used to automatically provision storage based on a storage class. In this case, a PVC can use the previously created storage class to create an ultra disk.

Create a file named `azure-pv2-disk-pvc.yaml`, and copy in the following manifest. The claim requests a disk named `premium2-disk` that is *1000 GB* in size with *ReadWriteOnce* access. The *premium2-disk-sc* storage class is specified as the storage class.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: premium2-disk
spec:
  accessModes:
  - ReadWriteOnce
  storageClassName: premium2-disk-sc
  resources:
    requests:
      storage: 1000Gi
```

Create the persistent volume claim with the [kubectl apply][kubectl-apply] command and specify your *azure-pv2-disk-pvc.yaml* file:

```bash
kubectl apply -f azure-pv2-disk-pvc.yaml
```

The output from the command resembles the following example:

```console
persistentvolumeclaim/premium2-disk created
```

## Use the persistent volume

Once the persistent volume claim has been created and the disk successfully provisioned, a pod can be created with access to the disk. The following manifest creates a basic NGINX pod that uses the persistent volume claim named *premium2-disk* to mount the Azure disk at the path `/mnt/azure`.

Create a file named `nginx-premium2.yaml`, and copy in the following manifest.

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: nginx-premium2
spec:
  containers:
  - name: nginx-premium2
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
        claimName: premium2-disk
```

Create the pod with the [kubectl apply][kubectl-apply] command, as shown in the following example:

```bash
kubectl apply -f nginx-premium2.yaml
```

The output from the command resembles the following example:

```bash
pod/nginx-premium2 created
```

You now have a running pod with your Azure disk mounted in the `/mnt/azure` directory. This configuration can be seen when inspecting your pod via `kubectl describe pod nginx-premium2`, as shown in the following condensed example:

```bash
kubectl describe pod nginx-premium2

[...]
Volumes:
  volume:
    Type:       PersistentVolumeClaim (a reference to a PersistentVolumeClaim in the same namespace)
    ClaimName:  premium2-disk
    ReadOnly:   false
  kube-api-access-sh59b:
    Type:                    Projected (a volume that contains injected data from multiple sources)
    TokenExpirationSeconds:  3607
    ConfigMapName:           kube-root-ca.crt
    ConfigMapOptional:       <nil>
    DownwardAPI:             true
QoS Class:                   Burstable
Node-Selectors:              <none>
Tolerations:                 node.kubernetes.io/memory-pressure:NoSchedule op=Exists
                             node.kubernetes.io/not-ready:NoExecute op=Exists for 300s
                             node.kubernetes.io/unreachable:NoExecute op=Exists for 300s
Events:
  Type    Reason                  Age    From                     Message
  ----    ------                  ----   ----                     -------
  Normal  Scheduled               7m58s  default-scheduler        Successfully assigned default/nginx-premium2 to aks-agentpool-12254644-vmss000006
  Normal  SuccessfulAttachVolume  7m46s  attachdetach-controller  AttachVolume.Attach succeeded for volume "pvc-ff39fb64-1189-4c52-9a24-e065b855b886"
  Normal  Pulling                 7m39s  kubelet                  Pulling image "mcr.microsoft.com/oss/nginx/nginx:1.15.5-alpine"
  Normal  Pulled                  7m38s  kubelet                  Successfully pulled image "mcr.microsoft.com/oss/nginx/nginx:1.15.5-alpine" in 1.192915667s
  Normal  Created                 7m38s  kubelet                  Created container nginx-premium2
  Normal  Started                 7m38s  kubelet                  Started container nginx-premium2
[...]
```

## Set IOPS and throughput limits

Input/Output Operations Per Second (IOPS) and throughput limits for Azure Premium v2 SSD disk is currently not supported through AKS. To adjust performance, you can use the Azure CLI command [az disk update][az-disk-update] and including the `--disk-iops-read-write` and `--disk-mbps-read-write` parameters.

The following example updates the disk IOPS read/write to **5000** and Mbps to **200**. For `--resource-group`, the value must be the second resource group automatically created to store the AKS worker nodes with the naming convention *MC_resourcegroupname_clustername_location*. For more information, see [Why are two resource groups created with AKS?][aks-two-resource-groups].

The value for the `--name` parameter is the name of the volume created using the StorageClass, and it starts with `pvc-`. To identify the disk name, you can run `kubectl get pvc` or navigate to the secondary resource group in the portal to find it. See [manage resources from the Azure portal][manage-resources-azure-portal] to learn more.

```azurecli
az disk update --subscription subscriptionName --resource-group myResourceGroup --name diskName --disk-iops-read-write=5000 --disk-mbps-read-write=200  
```

## Next steps

- For more about Premium SSD v2 disks, see [Using Azure Premium SSD v2 disks](../virtual-machines/disks-deploy-premium-v2.md).
- For more about storage best practices, see [Best practices for storage and backups in Azure Kubernetes Service (AKS)][operator-best-practices-storage].

<!-- LINKS - external -->
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubernetes-storage-classes]: https://kubernetes.io/docs/concepts/storage/storage-classes/

<!-- LINKS - internal -->
[azure-premium-v2-disk-overview]: ../virtual-machines/disks-types.md#premium-ssd-v2
[premium-v2-regions]: ../virtual-machines/disks-types.md#regional-availability
[premium-v2-limitations]: ../virtual-machines/disks-types.md#premium-ssd-v2-limitations
[azure-disk-volume]: azure-disk-csi.md
[use-tags]: use-tags.md
[operator-best-practices-storage]: operator-best-practices-storage.md
[az-disk-update]: /cli/azure/disk#az-disk-update
[manage-resources-azure-portal]: ../azure-resource-manager/management/manage-resources-portal.md#open-resources
[aks-two-resource-groups]: faq.md#why-are-two-resource-groups-created-with-aks