---
title: Use Azure Disks with AKS
description: Use Azure Disks with AKS
services: container-service
author: neilpeterson
manager: timlt

ms.service: container-service
ms.topic: article
ms.date: 03/06/2018
ms.author: nepeters
ms.custom: mvc
---

# Volumes with Azure disks

Container-based applications often need to access and persist data in an external data volume. Azure disks can be used as this external data store. This article details using Azure files as a Kubernetes volume in Azure Container Service.

For more information on Kubernetes volumes, see [Kubernetes volumes][kubernetes-volumes].

## Create an Azure disk

Before using an Azure disk as a Kubernetes volume, create the disk. The disk must be created in the same resource group as the AKS nodes. 

Return a list of resource groups using the [az group list][az-group-list] command.

```azurecli-interactiv
az group list --output table
```

You are looking for a resource group with a name similar to `MC_clustername_clustername_locaton`, where cluster name is the name of your AKS cluster.

```console
Name                                 Location    Status
-----------------------------------  ----------  ---------
MC_myAKSCluster_myAKSCluster_eastus  eastus      Succeeded
myAKSCluster                         eastus      Succeeded
```

Use the [az disk create][az-disk-create] command to create the Azure managed disk. Update the resource group name to the name of your AKS clusters resource group and the name to a disk name of your choice.

```azurecli-interactive
az disk create \
  --resource-group MC_myAKSCluster_myAKSCluster_eastus \
  --name myAKSDisk3  \
  --size-gb 20 \
  --query id --output tsv
```

Once the disk has been created, you should see output similar to the following. This value is needed when referencing the disk.

```console
/subscriptions/<subscriptionID>/resourceGroups/MC_myAKSCluster_myAKSCluster_eastus/providers/Microsoft.Compute/disks/myAKSDisk3
```

## Mount file share as volume

Mount the Azure disk into your pod by configuring the volume in the container spec. 

Create a new file named `azure-disk-pod.yaml` with the following contents. 

Update `diskName` with the name of the newly created disk and `diskURI` with the disk ID. Also, take note of the `mountPath`, this is the path at which the Azure disk is mounted in the pod.

```yaml
apiVersion: v1
kind: Pod
metadata:
 name: azure-disk-pod
spec:
 containers:
  - image: neilpeterson/aks-helloworld
    name: azure
    volumeMounts:
      - name: azure
        mountPath: /mnt/azure
 volumes:
      - name: azure
        azureDisk:
          kind: Managed
          diskName: myAKSDisk
          diskURI: /subscriptions/3762d87c-ddb8-425f-b2fc-29e5e859edaf/resourceGroups/test007/providers/Microsoft.Compute/disks/myAKSDisk
```

Use kubectl to create a pod.

```azurecli-interactive
kubectl apply -f azure-disk-pod.yaml
```

You now have a running container with your Azure file share mounted in the `/mnt/azure` directory. You can see the volume mount when inspecting your pod via `kubectl describe pod azure-files-pod`.

## Next steps

Learn more about Kubernetes volumes using Azure disks.

> [!div class="nextstepaction"]
> [Kubernetes plugin for Azure Disks][kubernetes-disks]

<!-- LINKS - external -->
[kubernetes-disks]: https://github.com/kubernetes/examples/blob/master/staging/volumes/azure_disk/README.md
[kubernetes-volumes]: https://kubernetes.io/docs/concepts/storage/volumes/

<!-- LINKS - internal -->
[az-disk-list]: /cli/azure/disk#az_disk_list
[az-disk-create]: /cli/azure/disk#az_disk_create
[az-group-list]: /cli/azure/group#az_group_list
