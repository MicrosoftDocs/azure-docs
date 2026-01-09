---
title: Use Azure Container Storage with Local NVMe
description: Configure Azure Container Storage for use with local NVMe on the Azure Kubernetes Service (AKS) cluster nodes. Create a storage class and deploy a pod using standard Kubernetes patterns.
author: khdownie
ms.service: azure-container-storage
ms.topic: how-to
ms.date: 09/10/2025
ms.author: kendownie
ms.custom: references_regions
# Customer intent: "As a Kubernetes administrator, I want to configure Azure Container Storage to use local NVMe for ephemeral volumes, so that I can optimize storage performance for my applications requiring low latency that don't require data durability using standard Kubernetes patterns."
---

# Use Azure Container Storage with local NVMe

[Azure Container Storage](container-storage-introduction.md) is a cloud-based volume management, deployment, and orchestration service built natively for containers. This article shows you how to configure Azure Container Storage to use local NVMe disk as back-end storage for your Kubernetes workloads. NVMe is designed for high-speed data transfer between storage and CPU, providing high IOPS and throughput.

> [!IMPORTANT]
> This article applies to [Azure Container Storage (version 2.x.x)](container-storage-introduction.md), which currently only supports local NVMe disk for backing storage. For details about earlier versions, see [Azure Container Storage (version 1.x.x) documentation](container-storage-introduction-version-1.md).

## What is local NVMe?

When your application needs sub-millisecond storage latency and high throughput, you can use local NVMe disks with Azure Container Storage to meet your performance requirements. Ephemeral means that the disks are deployed on the local virtual machine (VM) hosting the AKS cluster and not saved to an Azure storage service. Data is lost on these disks if you stop/deallocate your VM. Local NVMe disks are offered on select Azure VM families such as [storage-optimized](/azure/virtual-machines/sizes/overview#storage-optimized) VMs.

By default, Azure Container Storage creates *generic ephemeral volumes* when using local NVMe disks. For use cases that require *persistent volume claims*, you can add the annotation `localdisk.csi.acstor.io/accept-ephemeral-storage: "true"` in your persistent volume claim template.

### Data striping

To maximize performance, Azure Container Storage automatically stripes data across all available local NVMe disks on a per-VM basis. Striping is a technique where data is divided into small chunks and evenly written across multiple disks simultaneously, which increases throughput and improves overall I/O performance. This behavior is enabled by default and cannot be disabled.

Because performance aggregates across those striped devices, larger VM sizes that expose more NVMe drives can unlock substantially higher IOPS and bandwidth. Selecting a larger VM family lets your workloads benefit from the extra aggregate throughput without additional configuration.

For example, the [Lsv3 series](/azure/virtual-machines/sizes/storage-optimized/lsv3-series?tabs=sizestoragelocal) scales from a single 1.92-TB NVMe drive on Standard_L8s_v3 (around 400,000 IOPS and 2,000 MB/s) up to 10 NVMe drives on Standard_L80s_v3 (about 3.8 million IOPS and 20,000 MB/s). 

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.

- This article requires the latest version (2.77.0 or later) of the Azure CLI. See [How to install the Azure CLI](/cli/azure/install-azure-cli). Avoid Azure Cloud Shell, because `az upgrade` isn't available in Cloud Shell. Be sure to run the commands in this article with administrative privileges.

- [Review the installation instructions](install-container-storage-aks.md) and ensure Azure Container Storage is properly installed.

- You need the Kubernetes command-line client, `kubectl`. You can install it locally by running the `az aks install-cli` command.

- Check if your target region is supported in [Azure Container Storage regions](container-storage-introduction.md#regional-availability).

## Choose a VM type that supports local NVMe

Local NVMe disks are only available in certain types of VMs, for example, [storage-optimized VMs](/azure/virtual-machines/sizes/overview#storage-optimized) or [GPU accelerated VMs](/azure/virtual-machines/sizes/overview#gpu-accelerated). If you plan to use local NVMe capacity, choose one of these VM sizes.

Run the following command to get the VM type that's used with your node pool. Replace `<resource group>` and `<cluster name>` with your own values. You don't need to supply values for `PoolName` or `VmSize`, so keep the query as shown here.

```azurecli
az aks nodepool list --resource-group <resource group> --cluster-name <cluster name> --query "[].{PoolName:name, VmSize:vmSize}" -o table
```

The following output is an example.

```output
PoolName    VmSize
----------  ---------------
nodepool1   standard_l8s_v3
```

> [!NOTE]
> In Azure Container Storage (version 2.x.x), you can now use clusters with fewer than three nodes.

## Create a storage class for local NVMe

If you haven't already done so, [install Azure Container Storage.](install-container-storage-aks.md) 

Azure Container Storage (version 2.x.x) presents local NVMe as a standard Kubernetes storage class. Create the `local` storage class once per cluster and reuse it for both generic ephemeral volumes and persistent volume claims.

1. Use your favorite text editor to create a YAML manifest file such as `storageclass.yaml`, then paste in the following specification.

    ```yaml
    apiVersion: storage.k8s.io/v1
    kind: StorageClass
    metadata:
      name: local
    provisioner: localdisk.csi.acstor.io
    reclaimPolicy: Delete
    volumeBindingMode: WaitForFirstConsumer
    allowVolumeExpansion: true
    ```

1. Apply the manifest to create the storage class.

    ```azurecli
    kubectl apply -f storageclass.yaml
    ```

Alternatively, you can create the storage class using Terraform.

1. Use Terraform to manage the storage class by creating a configuration like the following `main.tf`. Update the provider version or kubeconfig path as needed for your environment.

    ```tf
    terraform {
      required_version = ">= 1.5.0"
      required_providers {
        kubernetes = {
          source  = "hashicorp/kubernetes"
          version = "~> 3.x"
        }
      }
    }

    provider "kubernetes" {
      config_path = "~/.kube/config"
    }

    resource "kubernetes_storage_class_v1" "local" {
      metadata {
        name = "local"
      }

      storage_provisioner    = "localdisk.csi.acstor.io"
      reclaim_policy         = "Delete"
      volume_binding_mode    = "WaitForFirstConsumer"
      allow_volume_expansion = true
    }
    ```

1. Initialize, review, and apply the configuration to create the storage class.

    ```bash
    terraform init
    terraform plan
    terraform apply
    ```

## Verify the storage class

Run the following command to verify that the storage class is created:

```azurecli
kubectl get storageclass local
```

You should see output similar to:

```output
NAME    PROVISIONER                RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
local   localdisk.csi.acstor.io    Delete          WaitForFirstConsumer   true                   10s
```

## Create and attach generic ephemeral volumes

Follow these steps to create and attach a generic ephemeral volume using Azure Container Storage. Make sure Azure Container Storage is [installed](install-container-storage-aks.md) and the `local` storage class exists before you continue.

### Deploy a pod with generic ephemeral volume

Create a pod using [Fio](https://github.com/axboe/fio) (Flexible I/O Tester) for benchmarking and workload simulation that uses a generic ephemeral volume.

1. Use your favorite text editor to create a YAML manifest file such as `code fiopod.yaml`.

1. Paste in the following code and save the file.

   ```yml
   kind: Pod
   apiVersion: v1
   metadata:
     name: fiopod
   spec:
     nodeSelector:
       "kubernetes.io/os": linux
     containers:
       - name: fio
         image: mayadata/fio
         args: ["sleep", "1000000"]
         volumeMounts:
           - mountPath: "/volume"
             name: ephemeralvolume
     volumes:
       - name: ephemeralvolume
         ephemeral:
           volumeClaimTemplate:
             spec:
               volumeMode: Filesystem
               accessModes: ["ReadWriteOnce"]
               storageClassName: local
               resources:
                 requests:
                   storage: 10Gi
   ```

1. Apply the YAML manifest file to deploy the pod.
   
   ```azurecli
   kubectl apply -f fiopod.yaml
   ```

### Verify the deployment and run benchmarks

Check that the pod is running:

```azurecli
kubectl get pod fiopod
```

You should see the pod in the Running state. Once running, you can execute a Fio benchmark test:

```azurecli
kubectl exec -it fiopod -- fio --name=benchtest --size=800m --filename=/volume/test --direct=1 --rw=randrw --ioengine=libaio --bs=4k --iodepth=16 --numjobs=8 --time_based --runtime=60
```

## Create and attach persistent volumes with ephemeral storage annotation

While generic ephemeral volumes are recommended for ephemeral storage, Azure Container Storage also supports persistent volumes with ephemeral storage when needed for compatibility with existing workloads.

> [!NOTE]
> Azure Container Storage (version 2.x.x) uses the new annotation `localdisk.csi.acstor.io/accept-ephemeral-storage: "true"` instead of the previous `acstor.azure.com/accept-ephemeral-storage: "true"`.

Make sure Azure Container Storage is [installed](install-container-storage-aks.md) and the `local` storage class you created earlier is available before deploying workloads that use it.

### Deploy a stateful set with persistent volumes

If you need to use persistent volume claims that aren't tied to the pod lifecycle, you must add the `localdisk.csi.acstor.io/accept-ephemeral-storage: "true"` annotation. The data on the volume is local to the node and is lost if the node is deleted or the pod is moved to another node.

Here's an example stateful set using persistent volumes with the ephemeral storage annotation:

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: statefulset-lcd-lvm-annotation
  labels:
    app: busybox
spec:
  podManagementPolicy: Parallel
  serviceName: statefulset-lcd
  replicas: 10
  template:
    metadata:
      labels:
        app: busybox
    spec:
      nodeSelector:
        "kubernetes.io/os": linux
      containers:
        - name: statefulset-lcd
          image: mcr.microsoft.com/azurelinux/busybox:1.36
          command:
            - "/bin/sh"
            - "-c"
            - set -euo pipefail; trap exit TERM; while true; do date -u +"%Y-%m-%dT%H:%M:%SZ" >> /mnt/lcd/outfile; sleep 1; done
          volumeMounts:
            - name: persistent-storage
              mountPath: /mnt/lcd
  updateStrategy:
    type: RollingUpdate
  selector:
    matchLabels:
      app: busybox
  volumeClaimTemplates:
    - metadata:
        name: persistent-storage
        annotations:
          localdisk.csi.acstor.io/accept-ephemeral-storage: "true"
      spec:
        accessModes: ["ReadWriteOnce"]
        storageClassName: local
        resources:
          requests:
            storage: 10Gi
```

Save and apply this YAML to create the stateful set with persistent volumes:

```azurecli
kubectl apply -f statefulset-pvc.yaml
```

## Manage storage

In this section, you learn how to check node ephemeral disk capacity, expand storage capacity, and delete storage resources.

### Check node ephemeral disk capacity

An ephemeral volume is allocated on a single node. When you configure the size of your ephemeral volumes, the size should be less than the available capacity of the single node's ephemeral disk.

Make sure a StorageClass for **localdisk.csi.acstor.io** exists. Run the following command to check the available capacity of ephemeral disk for each node.

```azurecli
kubectl get csistoragecapacities.storage.k8s.io -n kube-system -o custom-columns=NAME:.metadata.name,STORAGE_CLASS:.storageClassName,CAPACITY:.capacity,NODE:.nodeTopology.matchLabels."topology\.localdisk\.csi\.acstor\.io/node"
```

You should see output similar to the following example:

```output
NAME          STORAGE_CLASS   CAPACITY    NODE
csisc-2pkx4   local           1373172Mi   aks-storagepool-31410930-vmss000001
csisc-gnmm9   local           1373172Mi   aks-storagepool-31410930-vmss000000
```

If you encounter empty capacity output, confirm that a StorageClass for **localdisk.csi.acstor.io** exists. The **csistoragecapacities.storage.k8s.io** resource is only generated after a StorageClass for **localdisk.csi.acstor.io** exists.

### Expand storage capacity

Because ephemeral disk storage uses local resources on the AKS cluster nodes, expanding storage capacity requires adding nodes to the cluster.

To add a node to your cluster, run the following command. Replace `<cluster-name>`, `<nodepool-name>`, `<resource-group>`, and `<new-count>` with your values.

```azurecli
az aks nodepool scale --cluster-name <cluster-name> --name <nodepool-name> --resource-group <resource-group> --node-count <new-count>
```

### Delete storage resources

To clean up storage resources, you must first delete all PersistentVolumeClaims and/or PersistentVolumes. Deleting the Azure Container Storage StorageClass doesn't automatically remove your existing PersistentVolumes/PersistentVolumeClaims.

To delete a storage class named **local**, run the following command:

```azurecli
kubectl delete storageclass local
```

## See also

- [What is Azure Container Storage?](container-storage-introduction.md)
- [Install Azure Container Storage with AKS](install-container-storage-aks.md)
- [Use Azure Container Storage (version 1.x.x) with local NVMe](use-container-storage-with-local-disk-version-1.md)
- [Overview of deploying a highly available PostgreSQL database on Azure Kubernetes Service (AKS)](/azure/aks/postgresql-ha-overview#storage-considerations)
- [Best practices for ephemeral NVMe data disks in Azure Kubernetes Service (AKS)](/azure/aks/best-practices-storage-nvme)
