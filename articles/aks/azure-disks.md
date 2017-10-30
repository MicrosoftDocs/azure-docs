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
az disk create --name myDisk --resource-group myResourceGroup --size-gb 10 --sku Standard_LRS
```

Get the `diskURI` for the created disk.

```azurecli-interactive
az disk show --name myDisk --resource-group myResourceGroup --query 'id' -o tsv
```

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
      diskURI: <disURI>
      diskName: <diskName>
      kind: Managed
```

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

Learn more about persisten volument using Azure Disks.

> [!div class="nextstepaction"]
> [Kubernetes plugin for Azure Disks](./tutorial-kubernetes-upgrade-cluster.md)
