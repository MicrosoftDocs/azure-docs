---
title: Integrate Azure HPC Cache with Azure Kubernetes Service
description: Learn how to integrate HPC Cache with Azure Kubernetes Service
services: container-service
author: jbut
ms.author: jebutl
ms.topic: article
ms.date: 09/08/2021

#Customer intent: As a cluster operator or developer, I want to learn how to integrate HPC Cache with AKS
---

# Integrate Azure HPC Cache with Azure Kubernetes Service

[Azure HPC Cache][hpc-cache] speeds access to your data for high-performance computing (HPC) tasks. By caching files in Azure, Azure HPC Cache brings the scalability of cloud computing to your existing workflow. This article shows you how to integrate Azure HPC Cache with Azure Kubernetes Service (AKS).

## Before you begin

This article assumes that you have an existing AKS cluster. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli], [using Azure PowerShell][aks-quickstart-powershell], or [using the Azure portal][aks-quickstart-portal].

> [!IMPORTANT]
> Your AKS cluster must be [in a region that supports Azure HPC Cache][hpc-cache-regions].

You also need to install and configure Azure CLI version 2.7 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].  See [hpc-cache-cli-prerequisites] for more information about using Azure CLI with HPC Cache.

You will also need to install the hpc-cache Azure CLI extension.  Please do the following:

```azurecli
az extension add --upgrade -n hpc-cache
```

## Set up Azure HPC Cache

This section explains the steps to create and configure your HPC Cache.

### 1. Find the AKS node resource group

First, get the resource group name with the [az aks show][az-aks-show] command and add the `--query nodeResourceGroup` query parameter. You will create your HPC Cache in the same resource group.

The following example gets the node resource group name for the AKS cluster named *myAKSCluster* in the resource group name *myResourceGroup*:

```azurecli-interactive
az aks show --resource-group myResourceGroup --name myAKSCluster --query nodeResourceGroup -o tsv
```

```output
MC_myResourceGroup_myAKSCluster_eastus
```

### 2. Create the cache subnet

There are a number of [prerequisites][hpc-cache-prereqs] that must be satisfied before running an HPC Cache.  Most importantly, the cache requires a *dedicated* subnet with at least 64 IP addresses available. This subnet must not host other VMs or containers.  This subnet must be accessible from the AKS nodes.

Create the dedicated HPC Cache subnet:

```azurecli
RESOURCE_GROUP=MC_myResourceGroup_myAKSCluster_eastus
VNET_NAME=$(az network vnet list --resource-group $RESOURCE_GROUP --query [].name -o tsv)
VNET_ID=$(az network vnet show --resource-group $RESOURCE_GROUP --name $VNET_NAME --query "id" -o tsv)
SUBNET_NAME=MyHpcCacheSubnet
az network vnet subnet create \
    --resource-group $RESOURCE_GROUP \
    --vnet-name $VNET_NAME \
    --name $SUBNET_NAME \
    --address-prefixes 10.0.0.0/26
```

Register the *Microsoft.StorageCache* resource provider:

```azurecli
az provider register --namespace Microsoft.StorageCache --wait
```

> [!NOTE]
> The resource provider registration can take some time to complete.

### 3. Create the HPC Cache

Create an HPC Cache in the node resource group from step 1 and in the same region as your AKS cluster. Use  [az hpc-cache create][az-hpc-cache-create].

> [!NOTE]
> The HPC Cache takes approximately 20 minutes to be created.

```azurecli
RESOURCE_GROUP=MC_myResourceGroup_myAKSCluster_eastus
VNET_NAME=$(az network vnet list --resource-group $RESOURCE_GROUP --query [].name -o tsv)
VNET_ID=$(az network vnet show --resource-group $RESOURCE_GROUP --name $VNET_NAME --query "id" -o tsv)
SUBNET_NAME=MyHpcCacheSubnet
SUBNET_ID=$(az network vnet subnet show --resource-group $RESOURCE_GROUP --vnet-name $VNET_NAME --name $SUBNET_NAME --query "id" -o tsv)
az hpc-cache create \
  --resource-group $RESOURCE_GROUP \
  --cache-size-gb "3072" \
  --location eastus \
  --subnet $SUBNET_ID \
  --sku-name "Standard_2G" \
  --name MyHpcCache
```

### 4. Create a storage account and new container

Create the Azure Storage account for the Blob storage container.  The HPC Cache will cache content that is stored in this Blob storage container.

> [!IMPORTANT]
> You need to select a unique storage account name.  Replace 'uniquestorageaccount' with something that will be unique for you.

Check that the storage account name that you have selected is available.

```azurecli
STORAGE_ACCOUNT_NAME=uniquestorageaccount
az storage account check-name --name $STORAGE_ACCOUNT_NAME
```

```azurecli
RESOURCE_GROUP=MC_myResourceGroup_myAKSCluster_eastus
STORAGE_ACCOUNT_NAME=uniquestorageaccount
az storage account create \
  -n $STORAGE_ACCOUNT_NAME \
  -g $RESOURCE_GROUP \
  -l eastus \
  --sku Standard_LRS
```

Create the Blob container within the storage account.

```azurecli
STORAGE_ACCOUNT_NAME=uniquestorageaccount
STORAGE_ACCOUNT_ID=$(az storage account show --name $STORAGE_ACCOUNT_NAME --query "id" -o tsv)
AD_USER=$(az ad signed-in-user show --query objectId -o tsv)
CONTAINER_NAME=mystoragecontainer
az role assignment create --role "Storage Blob Data Contributor" --assignee $AD_USER --scope $STORAGE_ACCOUNT_ID
az storage container create --name $CONTAINER_NAME --account-name $STORAGE_ACCOUNT_NAME --auth-mode login
```

Provide permissions to the Azure HPC Cache service account to access your storage account and Blob container.

```azurecli
HPC_CACHE_USER="StorageCache Resource Provider"
STORAGE_ACCOUNT_NAME=uniquestorageaccount
STORAGE_ACCOUNT_ID=$(az storage account show --name $STORAGE_ACCOUNT_NAME --query "id" -o tsv)
$HPC_CACHE_ID=$(az ad sp list --display-name "${HPC_CACHE_USER}" --query "[].objectId" -o tsv)
az role assignment create --role "Storage Account Contributor" --assignee $HPC_CACHE_ID --scope $STORAGE_ACCOUNT_ID
az role assignment create --role "Storage Blob Data Contributor" --assignee $HPC_CACHE_ID --scope $STORAGE_ACCOUNT_ID
```

### 5. Configure the storage target

Add the blob container to your HPC Cache as a storage target.

```azurecli
RESOURCE_GROUP=MC_myResourceGroup_myAKSCluster_eastus
STORAGE_ACCOUNT_NAME=uniquestorageaccount
STORAGE_ACCOUNT_ID=$(az storage account show --name $STORAGE_ACCOUNT_NAME --query "id" -o tsv)
CONTAINER_NAME=mystoragecontainer
az hpc-cache blob-storage-target add \
  --resource-group $RESOURCE_GROUP \
  --cache-name MyHpcCache \
  --name MyStorageTarget \
  --storage-account $STORAGE_ACCOUNT_ID \
  --container-name $CONTAINER_NAME \
  --virtual-namespace-path "/myfilepath"
```

### 6. Set up client load balancing

Create a Azure Private DNS Zone for the client-facing IP addresses.

```azurecli
RESOURCE_GROUP=MC_myResourceGroup_myAKSCluster_eastus
VNET_NAME=$(az network vnet list --resource-group $RESOURCE_GROUP --query [].name -o tsv)
VNET_ID=$(az network vnet show --resource-group $RESOURCE_GROUP --name $VNET_NAME --query "id" -o tsv)
PRIVATE_DNS_ZONE="myhpccache.local"
az network private-dns zone create \
  -g $RESOURCE_GROUP \
  -n $PRIVATE_DNS_ZONE
az network private-dns link vnet create \
  -g $RESOURCE_GROUP \
  -n MyDNSLink \
  -z $PRIVATE_DNS_ZONE \
  -v $VNET_NAME \
  -e true
```

Create the round-robin DNS name.

```azurecli
DNS_NAME="server"
PRIVATE_DNS_ZONE="myhpccache.local"
RESOURCE_GROUP=MC_myResourceGroup_myAKSCluster_eastus
HPC_MOUNTS0=$(az hpc-cache show --name "MyHpcCache" --resource-group $RESOURCE_GROUP --query "mountAddresses[0]" -o tsv | tr --delete '\r')
HPC_MOUNTS1=$(az hpc-cache show --name "MyHpcCache" --resource-group $RESOURCE_GROUP --query "mountAddresses[1]" -o tsv | tr --delete '\r')
HPC_MOUNTS2=$(az hpc-cache show --name "MyHpcCache" --resource-group $RESOURCE_GROUP --query "mountAddresses[2]" -o tsv | tr --delete '\r')
az network private-dns record-set a add-record -g $RESOURCE_GROUP -z $PRIVATE_DNS_ZONE -n $DNS_NAME -a $HPC_MOUNTS0
az network private-dns record-set a add-record -g $RESOURCE_GROUP -z $PRIVATE_DNS_ZONE -n $DNS_NAME -a $HPC_MOUNTS1
az network private-dns record-set a add-record -g $RESOURCE_GROUP -z $PRIVATE_DNS_ZONE -n $DNS_NAME -a $HPC_MOUNTS2
```

## Create the AKS persistent volume

Create a `pv-nfs.yaml` file to define a [persistent volume][persistent-volume].

```yaml
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-nfs
spec:
  capacity:
    storage: 10000Gi
  accessModes:
    - ReadWriteMany
  mountOptions:
    - vers=3
  nfs:
    server: server.myhpccache.local
    path: /
```

First, ensure that you have credentials for your Kubernetes cluster.

```azurecli-interactive
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
```

Update the *server* and *path* to the values of your NFS (Network File System) volume you created in the previous step. Create the persistent volume with the [kubectl apply][kubectl-apply] command:

```console
kubectl apply -f pv-nfs.yaml
```

Verify that status of the persistent volume is **Available** using the [kubectl describe][kubectl-describe] command:

```console
kubectl describe pv pv-nfs
```

## Create the persistent volume claim

Create a `pvc-nfs.yaml` defining a [persistent volume claim][persistent-volume-claim]. For example:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc-nfs
spec:
  accessModes:
    - ReadWriteMany
  storageClassName: ""
  resources:
    requests:
      storage: 100Gi
```

Use the [kubectl apply][kubectl-apply] command to create the persistent volume claim:

```console
kubectl apply -f pvc-nfs.yaml
```

Verify that the status of the persistent volume claim is **Bound** using the [kubectl describe][kubectl-describe] command:

```console
kubectl describe pvc pvc-nfs
```

## Mount the HPC Cache with a pod

Create a `nginx-nfs.yaml` file to define a pod that uses the persistent volume claim. For example:

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: nginx-nfs
spec:
  containers:
  - image: mcr.microsoft.com/oss/nginx/nginx:1.15.5-alpine
    name: nginx-nfs
    command:
    - "/bin/sh"
    - "-c"
    - while true; do echo $(date) >> /mnt/azure/myfilepath/outfile; sleep 1; done
    volumeMounts:
    - name: disk01
      mountPath: /mnt/azure
  volumes:
  - name: disk01
    persistentVolumeClaim:
      claimName: pvc-nfs
```

Create the pod with the [kubectl apply][kubectl-apply] command:

```console
kubectl apply -f nginx-nfs.yaml
```

Verify that the pod is running by using the [kubectl describe][kubectl-describe] command:

```console
kubectl describe pod nginx-nfs
```

Verify your volume has been mounted in the pod by using [kubectl exec][kubectl-exec] to connect to the pod then `df -h` to check if the volume is mounted.

```console
kubectl exec -it nginx-nfs -- sh
```

```output
/ # df -h
Filesystem             Size  Used Avail Use% Mounted on
...
server.myhpccache.local:/myfilepath 8.0E         0      8.0E   0% /mnt/azure/myfilepath
...
```

## Frequently asked questions (FAQ)

### Running applications as non-root

If you need to run an application as a non-root user, you may need to disable root squashing to chown a directory to another user.  The non-root user will need to own a directory to access the file system.  For the user to own a directory, the root user must chown a directory to that user, but if the HPC Cache is squashing root, this operation will be denied because the root user (UID 0) is being mapped to the anonymous user.  More information about root squashing and client access policies is found [here][hpc-cache-access-policies].

### Sending feedback

We'd love to hear from you!  Please send any feedback or questions to <aks-hpccache-feed@microsoft.com>.

## Next steps

* For more information on Azure HPC Cache, see [HPC Cache Overview][hpc-cache].
* For more information on using NFS with AKS, see [Manually create and use an NFS (Network File System) Linux Server volume with Azure Kubernetes Service (AKS)][aks-nfs].

[aks-quickstart-cli]: ./learn/quick-kubernetes-deploy-cli.md
[aks-quickstart-portal]: ./learn/quick-kubernetes-deploy-portal.md
[aks-quickstart-powershell]: ./learn/quick-kubernetes-deploy-powershell.md
[aks-nfs]: azure-nfs-volume.md
[hpc-cache]: ../hpc-cache/hpc-cache-overview.md
[hpc-cache-access-policies]: ../hpc-cache/access-policies.md
[hpc-cache-regions]: https://azure.microsoft.com/global-infrastructure/services/?products=hpc-cache&regions=all
[hpc-cache-cli-prerequisites]: ../hpc-cache/az-cli-prerequisites.md
[hpc-cache-prereqs]: ../hpc-cache/hpc-cache-prerequisites.md
[az-hpc-cache-create]: /cli/azure/hpc-cache#az_hpc_cache_create
[az-aks-show]: /cli/azure/aks#az_aks_show
[install-azure-cli]: /cli/azure/install-azure-cli
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-describe]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe
[kubectl-exec]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#exec
[persistent-volume]: concepts-storage.md#persistent-volumes
[persistent-volume-claim]: concepts-storage.md#persistent-volume-claims
