---
title: Use Azure Disks with AKS
description: Use Azure Disks with AKS
services: container-service
author: neilpeterson
manager: timlt

ms.service: container-service
ms.topic: article
ms.date: 03/08/2018
ms.author: nepeters
ms.custom: mvc
---

# Volumes with Azure disks

Container-based applications often need to access and persist data in an external data volume. Azure disks can be used as this external data store. This article details using an Azure disk as a Kubernetes volume in an Azure Container Service (AKS) cluster.

For more information on Kubernetes volumes, see [Kubernetes volumes][kubernetes-volumes].

## Create an Azure disk

Before mounting an Azure managed disk as a Kubernetes volume, the disk must exist in the same resource group as the AKS cluster resources. To find this resource group, use the [az group list][az-group-list] command.

```azurecli-interactive
az group list --output table
```

You are looking for a resource group with a name similar to `MC_clustername_clustername_locaton`, where clustername is the name of your AKS cluster, and location is the Azure region where the cluster has been deployed.

```console
Name                                 Location    Status
-----------------------------------  ----------  ---------
MC_myAKSCluster_myAKSCluster_eastus  eastus      Succeeded
myAKSCluster                         eastus      Succeeded
```

Use the [az disk create][az-disk-create] command to create the Azure disk. 

Using this example, update `--resource-group` with the name of the resource group, and `--name` to a name of your choice.

```azurecli-interactive
az disk create \
  --resource-group MC_myAKSCluster_myAKSCluster_eastus \
  --name myAKSDisk  \
  --size-gb 20 \
  --query id --output tsv
```

Once the disk has been created, you should see output similar to the following. This value is the disk ID, which is used when mounting the disk to a Kubernetes pod.

```console
/subscriptions/<subscriptionID>/resourceGroups/MC_myAKSCluster_myAKSCluster_eastus/providers/Microsoft.Compute/disks/myAKSDisk
```

## Mount disk as volume

Mount the Azure disk into your pod by configuring the volume in the container spec. 

Create a new file named `azure-disk-pod.yaml` with the following contents. Update `diskName` with the name of the newly created disk and `diskURI` with the disk ID. Also, take note of the `mountPath`, this is the path at which the Azure disk is mounted in the pod.

```yaml
apiVersion: v1
kind: Pod
metadata:
 name: azure-disk-pod
spec:
 containers:
  - image: microsoft/sample-aks-helloworld
    name: azure
    volumeMounts:
      - name: azure
        mountPath: /mnt/azure
 volumes:
      - name: azure
        azureDisk:
          kind: Managed
          diskName: myAKSDisk
          diskURI: /subscriptions/<subscriptionID>/resourceGroups/MC_myAKSCluster_myAKSCluster_eastus/providers/Microsoft.Compute/disks/myAKSDisk
```

Use kubectl to create the pod.

```azurecli-interactive
kubectl apply -f azure-disk-pod.yaml
```

You now have a running pod with an Azure disk mounted at the `/mnt/azure`.

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
