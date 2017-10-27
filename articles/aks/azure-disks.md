---
title: Use Azure Disks with AKS | Microsoft Docs
description: Use Azure Disks with AKS
services: container-service
documentationcenter: ''
author: neilpeterson
manager: timlt
editor: ''
tags: aks, azure-container-service
keywords: ''

ms.service: container-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/30/2017
ms.author: nepeters
ms.custom: mvc

---

# Using Azure Disks with Kubernetes

Applications often need to access or persist external state that lives beyond the lifetime of a given pod. Kubernetes supports mounting [Volumes](https://kubernetes.io/docs/concepts/storage/volumes/) into your container from Azure Disks. Azure Disks, particularly premium disks, are well suited to applications that have a high target for disk throughput. 

The [Azure Files and Azure Disks comparison](/azure/storage/common/storage-decide-blobs-files-disks#comparison-files-and-disks) can help you choose the appropriate storage technology for your application

## Creating a Managed Disk

Create a new storage disk by using the Azure CLI and get the details needed to configure a Kubernetes volume.

```azurecli-interactive
# Create a new standard disk with a 10GB capacity
az disk create -n myDisk -g myResourceGroup --size-gb 10 --sku Standard_LRS

# Get the diskURI for the created disk
az disk show -n mydisk -g trash2 --query 'id' -o tsv
```

> [!NOTE]
> All VM types can use standard disks, but premium disk support is limited to [specific VM types](/azure/storage/common/storage-premium-storage#supported-vms).

## Mounting an Azure Disk as a volume

Create a file named `azure-disks-pod.yml` with the following contents, inserting your own values for `diskURI` and `diskName`.

```yaml
apiVersion: v1
kind: Pod
metadata:
 name: azure-disks-pod
spec:
 containers:
  - image: kubernetes/pause
    name: azure
    volumeMounts:
      - name: azure
        mountPath: /mnt/azure
 volumes:
  - name: azure
    azureDisk:
      # Replace with the values for your Azure Disk
      diskURI: /subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/providers/Microsoft.Compute/disks/<diskName>
      diskName: <diskName>
      kind: Managed
```

> [!NOTE]
> Your agent VM size determines how many data disks can be mounted at the same time. Be sure to [check the max data disks for your VM size](/azure/virtual-machines/linux/sizes-general).

Use kubectl to create a pod

```azurecli-interactive
kubectl apply -f azure-disks-pod.yml
```

Output:

```bash
pod "azure-disks-pod" created
```

You now have a running container with your Azure Disk mounted in the `/mnt/azure` directory. You can see your volume mounts when inspecting your pod via `kubectl describe pod azure-files-pod`.

## Next steps

* Learn more about [Kubernetes volumes](https://kubernetes.io/docs/concepts/storage/volumes)
* Get more details about [persistent volumes using Azure Disks](https://github.com/kubernetes/examples/tree/master/staging/volumes/azure_disk/claim)