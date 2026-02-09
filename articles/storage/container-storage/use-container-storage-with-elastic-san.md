---
title: Use Azure Container Storage with Azure Elastic SAN
description: Learn how to configure Azure Container Storage to use Azure Elastic SAN as backing storage.
author: saurabh0501
ms.service: azure-container-storage
ms.topic: how-to
ms.date: 01/28/2026
ms.author: saurabsharma
ms.custom:
  - references_regions

# Customer intent: "As a Kubernetes administrator, I want to configure Azure Container Storage to use Azure Elastic SAN as backing storage so that I can efficiently manage persistent storage for my containerized applications."
---

# Use Azure Container Storage with Azure Elastic SAN

[Azure Container Storage](container-storage-introduction.md) is a cloud-based volume management, deployment, and orchestration service built natively for containers. This article shows you how to configure Azure Container Storage to use Azure Elastic SAN as back-end storage for your Kubernetes workloads. 

> [!IMPORTANT]
> This article applies to [Azure Container Storage (version 2.x.x)](container-storage-introduction.md), which supports local NVMe disk and Azure Elastic SAN as backing storage types. For details about earlier versions, see [Azure Container Storage (version 1.x.x) documentation](container-storage-introduction-version-1.md).

## What is Azure Elastic SAN?

Azure Elastic SAN is a managed, shared block-storage service that provides a central pool of capacity and performance (IOPS and throughput) from which multiple volumes are created and attached to many compute resources. Instead of provisioning and tuning individual disks per workload, Elastic SAN lets you allocate storage from a single capacity pool and consume performance elastically across all attached volumes. This model is well suited to environments with many dynamic workloads—such as container platforms like Azure Kubernetes Service—where demand varies over time and unused performance on one volume can be used by another. Elastic SAN is typically used when you need shared, scalable block storage across many volumes or nodes, faster volume attach/detach for orchestrated workloads, support for higher volume density per node, and a single place to provision and manage storage capacity and performance.

## Prerequisites

[!INCLUDE [container-storage-prerequisites](../../../includes/container-storage-prerequisites.md)]
- [Review the installation instructions](install-container-storage-aks.md) and ensure Azure Container Storage is properly installed.

## Limitations

The following features aren't supported when you use Azure Container Storage to deploy and orchestrate an Elastic SAN:

- Elastic SAN capacity expansion through Azure Container Storage. You can [resize Elastic SAN](../elastic-san/elastic-san-expand.md) directly from the Azure portal or by using Azure CLI.

## Choose a provisioning model

Azure Container Storage supports three ways to use Elastic SAN with Azure Kubernetes Service (AKS):

- **Dynamic provisioning**: Azure Container Storage creates the Elastic SAN volume groups and volumes on demand.
- **Pre-provisioned Elastic SAN and volume group**: You create the Elastic SAN and volume group first, then Azure Container Storage provisions volumes within those existing resources.
- **Static provisioning**: You pre-create the Elastic SAN, volume group, and volume, then surface the volume to Kubernetes as a statically defined persistent volume (PV).

The following sections show how to configure a storage class for each model.

## Dynamic provisioning of Elastic SAN

### Create a default storage class

Create a YAML manifest file such as `storageclass.yaml`, then use the following specification.

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: azuresan
provisioner: san.csi.azure.com
reclaimPolicy: Delete
volumeBindingMode: Immediate
allowVolumeExpansion: true
```

The default Elastic SAN capacity provisioned with this storage class is 1 TiB.

Alternatively, you can create the storage class using Terraform.

1. Use Terraform to manage the storage class by creating a configuration like the following `main.tf`. Update the provider version or kubeconfig path as needed for your environment.

    ```tf
    terraform {
      required_version = ">= 1.5.0"
      required_providers {
        kubernetes = {
          source  = "hashicorp/kubernetes"
          version = "~> 3.0"
        }
      }
    }

    provider "kubernetes" {
      config_path = "~/.kube/config"
    }

    resource "kubernetes_storage_class_v1" "azuresan" {
      metadata {
        name = "azuresan"
      }

      storage_provisioner    = "san.csi.azure.com"
      reclaim_policy         = "Delete"
      volume_binding_mode    = "Immediate"
      allow_volume_expansion = true
    }
    ```

1. Initialize and apply the configuration.

    ```bash
    terraform init
    terraform apply
    ```

### Create a storage class with custom Elastic SAN capacity

If you need a different initial capacity than the default 1 TiB, set the `initialStorageTiB` parameter in the storage class.

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: azuresan
provisioner: san.csi.azure.com
reclaimPolicy: Delete
volumeBindingMode: Immediate
allowVolumeExpansion: true
parameters:
  initialStorageTiB: "10"
```

## Pre-provisioned Elastic SAN and volume groups

You can pre-create an Elastic SAN or an Elastic SAN and volume group, then reference those resources in the storage class.

### Create a storage class for a pre-provisioned Elastic SAN

If you haven't already done so, [install Azure Container Storage.](install-container-storage-aks.md) 

1. Identify the managed resource group of the AKS cluster.

   ```azurecli
   kubectl get node -o jsonpath={range .items[*]}{.spec.providerID}{"\n"}{end}
   ```

   The node resource group appears after `/resourceGroup/` in the provider ID.

1. Create an Elastic SAN in the managed resource group.

   ```azurecli
   az elastic-san create --resource-group <node-resource-group> --name <san-name> --location <node-region> --sku "{name:Premium_LRS,tier:Premium}" --base-size-tib 1 --extended-capacity-size-tib 1
   ```

1. Create a storage class that references the Elastic SAN:

   ```yaml
   apiVersion: storage.k8s.io/v1
   kind: StorageClass
   metadata:
     name: azuresan
   provisioner: san.csi.azure.com
   reclaimPolicy: Delete
   volumeBindingMode: Immediate
   allowVolumeExpansion: true
   parameters:
     san: <san-name> # replace with the name of your pre-created Elastic SAN
   ```

### Create a storage class for a pre-provisioned Elastic SAN and volume group

1. Repeat the steps above to create an Elastic SAN in the managed resource group.

1. Create a volume group.

1. Get virtual network (VNet) information.

   ```azurecli
   az network vnet list -g <node-resource-group> --query [].name -o tsv
   ```

1. Get subnet information.

   ```azurecli
   az network vnet subnet list -g <node-resource-group> --vnet-name <vnet-name> --query [].name -o tsv
   ```

1. Update the service endpoint.

   ```azurecli
   az network vnet subnet update -g <node-resource-group> --vnet-name <vnet-name> --name <subnet-name> --service-endpoints "Microsoft.Storage"
   ```

1. Create the volume group.

   ```azurecli
   az elastic-san volume-group create --resource-group <node-resource-group> --elastic-san-name <san-name> --name <volume-group-name> --network-acls '{"virtual-network-rules":[{"id":"<subnet-id>","action":"Allow"}]}'
   ```

1. Create a storage class that references the Elastic SAN and volume group:

   ```yaml
   apiVersion: storage.k8s.io/v1
   kind: StorageClass
   metadata:
     name: azuresan
   provisioner: san.csi.azure.com
   reclaimPolicy: Delete
   volumeBindingMode: Immediate
   allowVolumeExpansion: true
   parameters:
     san: <san-name> # replace with the name of your pre-created Elastic SAN
     volumegroup: <volume-group-name> # replace with the name of your pre-created volume group
   ```

## Apply the manifest and verify storage class creation

Apply the manifest:

```azurecli
kubectl apply -f storageclass.yaml
```

Verify that the storage class is created:

```azurecli
kubectl get storageclass azuresan
```

You should see output similar to:

```output
NAME       PROVISIONER          RECLAIMPOLICY   VOLUMEBINDINGMODE   ALLOWVOLUMEEXPANSION   AGE
azuresan   san.csi.azure.com    Delete          Immediate           true                   10s
```

## Create a persistent volume claim

A persistent volume claim (PVC) automatically provisions storage based on a storage class. Follow these steps to create a PVC using the new storage class.

1. Create a YAML manifest file such as `acstor-pvc.yaml`.

   ```yaml
   apiVersion: v1
   kind: PersistentVolumeClaim
   metadata:
     name: managedpvc
   spec:
     accessModes:
       - ReadWriteOnce
     resources:
       requests:
         storage: 1Gi
     storageClassName: azuresan
   ```

1. Apply the manifest to create the PVC.

   ```azurecli
   kubectl apply -f acstor-pvc.yaml
   ```

   You should see output similar to:

   ```output
   persistentvolumeclaim/managedpvc created
   ```

You can verify the status of the PVC by running the following command:

```azurecli
kubectl describe pvc managedpvc
```

When the PVC is created, it is ready for use by a pod.

## Deploy a pod and attach a persistent volume

Create a pod using Flexible I/O Tester (fio) for benchmarking and workload simulation, and specify a mount path for the persistent volume. For `claimName`, use the name value you used when creating the PVC.

1. Create a YAML manifest file such as `acstor-pod.yaml`.

   ```yaml
   apiVersion: v1
   kind: Pod
   metadata:
     name: fiopod
   spec:
     containers:
       - image: nixery.dev/shell/fio
         name: fio
         ports:
           - containerPort: 80
             protocol: TCP
         volumeMounts:
           - mountPath: /volume
             name: iscsi-volume
     volumes:
       - name: iscsi-volume
         persistentVolumeClaim:
           claimName: managedpvc
   ```

1. Apply the manifest to deploy the pod.

   ```azurecli
   kubectl apply -f acstor-pod.yaml
   ```

   You should see output similar to the following:

   ```output
   pod/fiopod created
   ```

1. Check that the pod is running and the PVC is bound:

   ```azurecli-interactive
   kubectl describe pod fiopod
   kubectl describe pvc managedpvc
   ```

1. Check fio testing to see its current status:

   ```azurecli-interactive
   kubectl exec -it fiopod -- fio --name=benchtest --size=800m --filename=/volume/test --direct=1 --rw=randrw --ioengine=libaio --bs=4k --iodepth=16 --numjobs=8 --time_based --runtime=60
   ```

You now have a pod that uses Elastic SAN for storage.

## Static provisioning of an Elastic SAN volume

You can pre-create the volume in Elastic SAN and surface it to Kubernetes as a static PV. Use the steps above to create the Elastic SAN and volume group. You can also perform these steps in the Azure portal by using the [Elastic SAN service blade](../elastic-san/elastic-san-create.md).

### Create a default Elastic SAN storage class

Use the following YAML manifest to create a default Elastic SAN storage class:

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: azuresan
provisioner: san.csi.azure.com
reclaimPolicy: Delete
volumeBindingMode: Immediate
allowVolumeExpansion: true
```

Apply the manifest to create the storage class:

```azurecli
kubectl apply -f storageclass.yaml
```

Verify the storage class:

```azurecli
kubectl get storageclass azuresan
```

### Create an Elastic SAN volume

```azurecli
az elastic-san volume create -g <node-resource-group> -e <san-name> -v <volume-group-name> -n <volume-name> --size-gib 5
```

Note the Azure Resource Manager (ARM) ID of the Elastic SAN volume. Use it for the `volumeHandle` value in the persistent volume YAML.

Retrieve the iSCSI Qualified Name (IQN) and `targetPortal` values for your Elastic SAN volume:

```azurecli
az elastic-san volume show --name <volume-name> --resource-group <rg-name> --elastic-san-name <san-name>
```

### Create a persistent volume

Create a YAML manifest file such as `pv_static.yaml`.

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-san
  annotations:
    pv.kubernetes.io/provisioned-by: san.csi.azure.com
spec:
  capacity:
    storage: 5Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: azuresan
  csi:
    driver: san.csi.azure.com
    volumeHandle: #{rg}#{san}#{vg}#{vol}
    volumeAttributes:
      # iqn: "<retrieved from pre-provisioned volume>"
      # targetPortal: "<retrieved from pre-provisioned volume>"
      numsessions: "8"
```

Apply the manifest to create the persistent volume.

```azurecli
kubectl apply -f pv_static.yaml
```

### Create a static persistent volume claim

Create a YAML manifest file such as `pvc_static.yaml`.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc-san
spec:
  volumeMode: Filesystem
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
  volumeName: pv-san
  storageClassName: azuresan
```

Apply the manifest to create the PVC.

```azurecli
kubectl apply -f pvc_static.yaml
```

### Create a pod that uses the static volume

Create a YAML manifest file such as `pod.yaml`.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-san-static
spec:
  nodeSelector:
    kubernetes.io/os: linux
  containers:
    - image: mcr.microsoft.com/oss/nginx/nginx:1.19.5
      name: nginx
      ports:
        - containerPort: 80
          protocol: TCP
      volumeMounts:
        - mountPath: /var/www
          name: iscsi-volume
  volumes:
    - name: iscsi-volume
      persistentVolumeClaim:
        claimName: pvc-san
```

Apply the manifest to create the pod.

```azurecli
kubectl apply -f pod.yaml
```

## See also

- [What is Azure Container Storage?](./container-storage-introduction.md)
- [What is Azure Elastic SAN?](../elastic-san/elastic-san-introduction.md)
- [Install Azure Container Storage with AKS](./install-container-storage-aks.md)
- [Enable zone-redundant storage with Azure Container Storage](./enable-multi-zone-redundancy.md)
- [Configure encryption for Azure Elastic SAN volumes](./configure-encryption-for-elastic-san.md)
- [Resize persistent volumes](./resize-volume.md)
- [Volume snapshots with Azure Elastic SAN volumes](./volume-snapshot-restore.md)
- [Frequently asked questions about Azure Container Storage](./container-storage-faq.md)
