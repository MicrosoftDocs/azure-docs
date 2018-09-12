---
title: Use Azure Disks with AKS
description: Use Azure Disks with AKS
services: container-service
author: iainfoulds
manager: jeconnoc

ms.service: container-service
ms.topic: article
ms.date: 05/21/2018
ms.author: iainfou
ms.custom: mvc
---

# Volumes with Azure disks

Container-based applications often need to access and persist data in an external data volume. Azure disks can be used as this external data store. This article details using an Azure disk as a Kubernetes volume in an Azure Kubernetes Service (AKS) cluster.

For more information on Kubernetes volumes, see [Kubernetes volumes][kubernetes-volumes].

## Create an Azure disk

Before mounting an Azure-managed disk as a Kubernetes volume, the disk must exist in the AKS **node** resource group. Get the resource group name with the [az resource show][az-resource-show] command.

```azurecli-interactive
$ az resource show --resource-group myResourceGroup --name myAKSCluster --resource-type Microsoft.ContainerService/managedClusters --query properties.nodeResourceGroup -o tsv

MC_myResourceGroup_myAKSCluster_eastus
```

Use the [az disk create][az-disk-create] command to create the Azure disk.

Update `--resource-group` with the name of the resource group gathered in the last step, and `--name` to a name of your choice.

```azurecli-interactive
az disk create \
  --resource-group MC_myResourceGroup_myAKSCluster_eastus \
  --name myAKSDisk  \
  --size-gb 20 \
  --query id --output tsv
```

Once the disk has been created, you should see output similar to the following. This value is the disk ID, which is used when mounting the disk.

```console
/subscriptions/<subscriptionID>/resourceGroups/MC_myAKSCluster_myAKSCluster_eastus/providers/Microsoft.Compute/disks/myAKSDisk
```
> [!NOTE]
> Azure managed disks are billed by SKU for a specific size. These SKUs range from 32GiB for S4 or P4 disks to 4TiB for S50 or P50 disks. Furthermore, the throughput and IOPS performance of a Premium managed disk depends on both the SKU and the instance size of the nodes in the AKS cluster. See [Pricing and Performance of Managed Disks][managed-disk-pricing-performance].

> [!NOTE]
> If you need to create the disk in a separate resource group, you also need to add the Azure Kubernetes Service (AKS) service principal for your cluster to the resource group holding the disk with the `Contributor` role. 
>

## Mount disk as volume

Mount the Azure disk into your pod by configuring the volume in the container spec.

Create a new file named `azure-disk-pod.yaml` with the following contents. Update `diskName` with the name of the newly created disk and `diskURI` with the disk ID. Also, take note of the `mountPath`, which is the path where the Azure disk is mounted in the pod.

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
[managed-disk-pricing-performance]: https://azure.microsoft.com/pricing/details/managed-disks/

<!-- LINKS - internal -->
[az-disk-list]: /cli/azure/disk#az-disk-list
[az-disk-create]: /cli/azure/disk#az-disk-create
[az-group-list]: /cli/azure/group#az-group-list
[az-resource-show]: /cli/azure/resource#az-resource-show
