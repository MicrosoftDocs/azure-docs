---
title: Enable multi-zone storage redundancy in Azure Container Storage Preview to improve stateful application availability
description: Enable storage redundancy across multiple availability zones in Azure Container Storage to improve stateful application availability. Use multi-zone storage pools and zone-redundant storage (ZRS) disks.
author: khdownie
ms.service: azure-container-storage
ms.topic: how-to
ms.date: 03/12/2024
ms.author: kendownie
---

# Enable multi-zone storage redundancy in Azure Container Storage Preview

You can improve stateful application availability by using multi-zone storage pools and zone-redundant storage (ZRS) disks when using [Azure Container Storage](container-storage-introduction.md) in a multi-zone Azure Kubernetes Service (AKS) cluster. To create an AKS cluster that uses availability zones, see [Use availability zones in Azure Kubernetes Service](../../aks/availability-zones.md).

## Prerequisites

- This article requires version 2.0.64 or later of the Azure CLI. See [How to install the Azure CLI](/cli/azure/install-azure-cli). If you're using Azure Cloud Shell, the latest version is already installed. If you plan to run the commands locally instead of in Azure Cloud Shell, be sure to run them with administrative privileges.
- You'll need an AKS cluster with a node pool of at least three virtual machines (VMs) for the cluster nodes, each with a minimum of four virtual CPUs (vCPUs).
- This article assumes you've already [installed Azure Container Storage](container-storage-aks-quickstart.md) on your AKS cluster.
- You'll need the Kubernetes command-line client, `kubectl`. It's already installed if you're using Azure Cloud Shell, or you can install it locally by running the `az aks install-cli` command.

## Create a multi-zone storage pool

In your storage pool definition, you can specify the zones where you want your storage capacity to be distributed across. The total storage pool capacity will be distributed evenly across the number of zones specified. For example, if two zones are specified, each zone gets half of the storage pool capacity; if three zones are specified, each zone gets one-third of the total capacity. Corresponding storage will be provisioned in each of the zones. This is useful when running workloads that offer application-level replication such as Cassandra.

If there are no nodes available in a specified zone, the capacity will be provisioned once a node is available in that zone. Persistent volumes (PVs) can only be created from storage pool capacity from one zone.

Valid values for `zones` are:

- [""]
- ["1"]
- ["2"]
- ["3"]
- ["1", "2"]
- ["1", "3"]
- ["2", "3"]
- ["1", "2", "3"]

Follow these steps to create a multi-zone storage pool that uses Azure Disks. For `zones`, choose a valid value.

1. Use your favorite text editor to create a YAML manifest file such as `code acstor-multizone-storagepool.yaml`.

1. Paste in the following code and save the file. The storage pool **name** value can be whatever you want. For **storage**, specify the amount of storage capacity for the pool in Gi or Ti.

   ```yml
   apiVersion: containerstorage.azure.com/v1beta1
   kind: StoragePool
   metadata:
     name: azuredisk
     namespace: acstor
   spec:
     zones: ["1", "2", "3"]
     poolType:
       azureDisk: {}
     resources:
       requests:
         storage: 1Ti
   ```

1. Apply the YAML manifest file to create the multi-zone storage pool.
   
   ```azurecli-interactive
   kubectl apply -f acstor-multizone-storagepool.yaml 
   ```

## Use zone-redundant storage (ZRS) disks

If your workload requires storage redundancy, you can leverage disks that use [zone-redundant storage](../../virtual-machines/disks-deploy-zrs.md), which copies your data synchronously across three Azure availability zones in the primary region.

You can specify the disk `skuName` as either `StandardSSD_ZRS` or `Premium_ZRS` in your storage pool definition, as in the following example.

   ```yml
   apiVersion: containerstorage.azure.com/v1beta1
   kind: StoragePool
   metadata:
     name: azuredisk
     namespace: acstor
   spec:
     poolType:
       azureDisk:
         skuName: Premium_ZRS
     resources:
       requests:
         storage: 1Ti
   ```

## See also

- [What is Azure Container Storage?](container-storage-introduction.md)
