---
title: Enable multi-zone redundancy in Azure Container Storage (version 2.x.x) with Azure Elastic SAN
description: Enable storage redundancy across multiple availability zones in Azure Container Storage to improve stateful application availability. Use locally redundant storage (LRS) or zone-redundant storage (ZRS) on Azure Elastic SAN.
author: saurabh0501
ms.service: azure-container-storage
ms.topic: how-to
ms.date: 01/29/2026
ms.author: saurabsharma
# Customer intent: As a cloud engineer, I want to enable multi-zone storage redundancy in Azure Container Storage (version 2.x.x), so that I can enhance the availability of my stateful applications running in a multi-zone Kubernetes environment.
---

# Enable multi-zone storage redundancy in Azure Container Storage

With Azure Container Storage, you can improve stateful application availability by using zone-redundant storage (ZRS) or locally redundant storage (LRS). Choose LRS with explicit zonal placement or ZRS for synchronous replication across three availability zones, based on your resiliency and performance needs.

## Choose a redundancy model

**Locally redundant storage (LRS)**: With LRS, Azure stores three copies of each Elastic SAN in a single datacenter. This redundancy protects against hardware faults such as a failed disk. If a disaster occurs in that datacenter, all replicas can be lost or unavailable.

**Zone-redundant storage (ZRS)**: With ZRS, Azure stores three copies of each Elastic SAN across three distinct availability zones in the same region. Writes are synchronous. The write completes only after all three replicas update.

## Prerequisites

[!INCLUDE [container-storage-prerequisites](../../../includes/container-storage-prerequisites.md)]

- If you use Elastic SAN for the first time in the subscription, run this one-time registration command:

```azurecli-interactive
az provider register --namespace Microsoft.ElasticSan
```

- When ZRS is newly enabled in a region, you might need to register a subscription-level feature flag so Azure Container Storage can deploy SAN targets:

```azurecli
Register-AzProviderFeature -FeatureName EnableElasticSANTargetDeployment -ProviderNamespace Microsoft.ElasticSan
```

- Verify that the region supports your chosen redundancy option. See the current [Elastic SAN region availability](../elastic-san/elastic-san-create.md#).

## Create a StorageClass with locally redundant storage

### Use an LRS SKU without specifying a zone

If a region supports zones and you don't specify a zone in the StorageClass, Azure Container Storage defaults to zone 1.

Create a YAML manifest file such as `storageclass.yaml`, then use the following specification.

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: esan-lrs-default
provisioner: san.csi.azure.com
parameters:
  skuName: Premium_LRS
reclaimPolicy: Delete
allowVolumeExpansion: true
volumeBindingMode: WaitForFirstConsumer
```

### Use an LRS SKU and specify a zone

Use a single zone when you create an LRS Elastic SAN in regions that support availability zones. In regions without zones, omit the `zones` parameter to avoid validation failures.

For LRS with zone pinning, the scheduler places the pod on a node in the specified zone, and the persistent volume (PV) binds to the corresponding zone's SAN. LRS volumes are accessible from any zone, so Azure Container Storage doesn't restrict cross-zone attachment. The `allowedTopologies` section ensures the PV binds to a node in the same zone as the LRS SAN.

Create a YAML manifest file such as `storageclass.yaml`, then use the following specification.

```yaml
# LRS with a zone (2)
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: esan-lrs-zone2
provisioner: san.csi.azure.com
parameters:
  skuName: Premium_LRS
  zones: "2"
reclaimPolicy: Delete
allowVolumeExpansion: true
volumeBindingMode: WaitForFirstConsumer
# Optional:
allowedTopologies:
  - matchLabelExpressions:
      - key: topology.kubernetes.io/zone
        values:
          - canadacentral-2
```

## Create a StorageClass with zone-redundant storage

You don't need to specify zones because Azure Container Storage defaults to all three zones. If you set the `zones` field, list all three zones as "1,2,3".

Create a YAML manifest file such as `storageclass.yaml`, then use the following specification.

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: esan-zrs-zones
provisioner: san.csi.azure.com
parameters:
  skuName: Premium_ZRS
  zones: "1,2,3" # optional
reclaimPolicy: Delete
allowVolumeExpansion: true
volumeBindingMode: WaitForFirstConsumer
```

## Create the StorageClass

```azurecli
kubectl apply -f storageclass.yaml
```

Verify that the StorageClass is created:

```azurecli
kubectl get storageclass <storage-class-name>
```

You should see output similar to:

```output
NAME             PROVISIONER          RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
esan-zrs-zones   san.csi.azure.com    Delete          WaitForFirstConsumer   true                   10s
```

## Create a persistent volume claim

Create a YAML manifest file such as `acstor-pvc.yaml`. The PVC `name` value can be any value. Use the StorageClass name that you created in the previous steps.

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
  storageClassName: esan-zrs-zones # or esan-lrs-zone2, esan-lrs-default
```

Apply the manifest to create the PVC.

```azurecli
kubectl apply -f acstor-pvc.yaml
```

You should see output similar to:

```output
persistentvolumeclaim/managedpvc created
```

## Deploy a pod and attach a persistent volume

Create a YAML manifest file such as `acstor-pod.yaml`.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: esan-app
spec:
  containers:
    - name: app
      image: mcr.microsoft.com/oss/nginx/nginx:1.25.2
      volumeMounts:
        - name: data
          mountPath: /data
  volumes:
    - name: data
      persistentVolumeClaim:
        claimName: managedpvc
```

Apply the manifest to create the pod.

```azurecli
kubectl apply -f acstor-pod.yaml
```

You should see output similar to:

```output
pod/esan-app created
```

Verify the PV and StorageClass:

```azurecli
kubectl get pv
kubectl describe sc esan-zrs-zones
kubectl describe sc esan-lrs-zone2
```

Confirm regional support and redundancy model for the volumes with the [Elastic SAN region list](../elastic-san/elastic-san-create.md#).

## See also

- [What is Azure Elastic SAN?](../elastic-san/elastic-san-introduction.md)
