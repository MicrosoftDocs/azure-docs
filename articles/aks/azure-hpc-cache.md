---
title: Integrate Azure HPC Cache with Azure Kubernetes Service (AKS)
description: Learn how to integrate HPC Cache with Azure Kubernetes Service (AKS).
author: jbut
ms.author: jebutl
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 06/22/2023
#Customer intent: As a cluster operator or developer, I want to learn how to integrate HPC Cache with AKS
---

# Integrate Azure HPC Cache with Azure Kubernetes Service (AKS)

[Azure HPC Cache][hpc-cache] speeds access to your data for high-performance computing (HPC) tasks. By caching files in Azure, Azure HPC Cache brings the scalability of cloud computing to your existing workflow. This article shows you how to integrate Azure HPC Cache with Azure Kubernetes Service (AKS).

## Before you begin

* This article assumes you have an existing AKS cluster. If you need an AKS cluster, you can create one using [Azure CLI][aks-quickstart-cli], [Azure PowerShell][aks-quickstart-powershell], or [Azure portal][aks-quickstart-portal].
    > [!IMPORTANT]
    > Your AKS cluster must be [in a region that supports Azure HPC Cache][hpc-cache-regions].

* You need Azure CLI version 2.7 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli]. For more information on using HPC Cache with Azure CLI, see the [HPC Cache CLI prerequisites][hpc-cache-cli-prerequisites].
* Install the `hpc-cache` Azure CLI extension using the [`az extension add --upgrade -n hpc-cache][az-extension-add]` command.
* Review the [HPC Cache prerequisites][hpc-cache-prereqs]. You need to satisfy these prerequisites before you can run an HPC Cache. Important prerequisites include the following:
  * The cache requires a *dedicated* subnet with at least 64 IP addresses available.
  * The subnet must not host other VMs or containers.
  * The subnet must be accessible from the AKS nodes.

## Create the Azure HPC Cache

1. Get the node resource group using the [`az aks show`][az-aks-show] command with the `--query nodeResourceGroup` query parameter.

    ```azurecli-interactive
    az aks show --resource-group myResourceGroup --name myAKSCluster --query nodeResourceGroup -o tsv
    ```

    Your output should look similar to the following example output:

    ```output
    MC_myResourceGroup_myAKSCluster_eastus
    ```

2. Create the dedicated HPC Cache subnet using the [`az network vnet subnet create`][az-network-vnet-subnet-create] command.

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

3. Register the *Microsoft.StorageCache* resource provider using the [`az provider register`][az-provider-register] command.

    ```azurecli
    az provider register --namespace Microsoft.StorageCache --wait
    ```

    > [!NOTE]
    > The resource provider registration can take some time to complete.

4. Create an HPC Cache in the same node resource group and region using the [`az hpc-cache create`][az-hpc-cache-create].

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

## Create and configure Azure storage

> [!IMPORTANT]
> You need to select a unique storage account name. Replace `uniquestorageaccount` with something unique for you. Storage account names must be *between 3 and 24 characters in length* and *can contain only numbers and lowercase letters*.

1. Create a storage account using the [`az storage account create`][az-storage-account-create] command.

    ```azurecli
    RESOURCE_GROUP=MC_myResourceGroup_myAKSCluster_eastus
    STORAGE_ACCOUNT_NAME=uniquestorageaccount

    az storage account create \
      -n $STORAGE_ACCOUNT_NAME \
      -g $RESOURCE_GROUP \
      -l eastus \
      --sku Standard_LRS
    ```

2. Assign the "Storage Blob Data Contributor Role" on your subscription using the [`az role assignment create`][az-role-assignment-create] command.

    ```azurecli
    STORAGE_ACCOUNT_NAME=uniquestorageaccount
    STORAGE_ACCOUNT_ID=$(az storage account show --name $STORAGE_ACCOUNT_NAME --query "id" -o tsv)
    AD_USER=$(az ad signed-in-user show --query objectId -o tsv)
    CONTAINER_NAME=mystoragecontainer

    az role assignment create --role "Storage Blob Data Contributor" --assignee $AD_USER --scope $STORAGE_ACCOUNT_ID
    ```

3. Create the Blob container within the storage account using the [`az storage container create`][az-storage-container-create] command.

    ```azurecli
    az storage container create --name $CONTAINER_NAME --account-name $STORAGE_ACCOUNT_NAME --auth-mode login
    ```

4. Provide permissions to the Azure HPC Cache service account to access your storage account and Blob container using the following [`az role assignment`][az-role-assignment-create] commands.

    ```azurecli
    HPC_CACHE_USER="StorageCache Resource Provider"
    HPC_CACHE_ID=$(az ad sp list --display-name "${HPC_CACHE_USER}" --query "[].objectId" -o tsv)

    az role assignment create --role "Storage Account Contributor" --assignee $HPC_CACHE_ID --scope $STORAGE_ACCOUNT_ID

    az role assignment create --role "Storage Blob Data Contributor" --assignee $HPC_CACHE_ID --scope $STORAGE_ACCOUNT_ID
    ```

5. Add the blob container to your HPC Cache as a storage target using the [`az hpc-cache blob-storage-target add`][az-hpc-cache-blob-storage-target-add] command.

    ```azurecli
    CONTAINER_NAME=mystoragecontainer

    az hpc-cache blob-storage-target add \
      --resource-group $RESOURCE_GROUP \
      --cache-name MyHpcCache \
      --name MyStorageTarget \
      --storage-account $STORAGE_ACCOUNT_ID \
      --container-name $CONTAINER_NAME \
      --virtual-namespace-path "/myfilepath"
    ```

## Set up client load balancing

1. Create an Azure Private DNS Zone for the client-facing IP addresses using the [`az network private-dns zone create`][az-network-private-dns-zone-create] command.

    ```azurecli
    PRIVATE_DNS_ZONE="myhpccache.local"

    az network private-dns zone create \
      -g $RESOURCE_GROUP \
      -n $PRIVATE_DNS_ZONE
    ```

2. Create a DNS link between the Azure Private DNS Zone and the VNet using the [`az network private-dns link vnet create`][az-network-private-dns-link-vnet-create] command.

    ```azurecli
    az network private-dns link vnet create \
      -g $RESOURCE_GROUP \
      -n MyDNSLink \
      -z $PRIVATE_DNS_ZONE \
      -v $VNET_NAME \
      -e true
    ```

3. Create the round-robin DNS name for the client-facing IP addresses using the [`az network private-dns record-set a create`][az-network-private-dns-record-set-a-create] command.

    ```azurecli
    DNS_NAME="server"
    HPC_MOUNTS0=$(az hpc-cache show --name "MyHpcCache" --resource-group $RESOURCE_GROUP --query "mountAddresses[0]" -o tsv | tr --delete '\r')
    HPC_MOUNTS1=$(az hpc-cache show --name "MyHpcCache" --resource-group $RESOURCE_GROUP --query "mountAddresses[1]" -o tsv | tr --delete '\r')
    HPC_MOUNTS2=$(az hpc-cache show --name "MyHpcCache" --resource-group $RESOURCE_GROUP --query "mountAddresses[2]" -o tsv | tr --delete '\r')

    az network private-dns record-set a add-record -g $RESOURCE_GROUP -z $PRIVATE_DNS_ZONE -n $DNS_NAME -a $HPC_MOUNTS0

    az network private-dns record-set a add-record -g $RESOURCE_GROUP -z $PRIVATE_DNS_ZONE -n $DNS_NAME -a $HPC_MOUNTS1

    az network private-dns record-set a add-record -g $RESOURCE_GROUP -z $PRIVATE_DNS_ZONE -n $DNS_NAME -a $HPC_MOUNTS2
    ```

## Create a persistent volume

1. Create a `pv-nfs.yaml` file to define a [persistent volume][persistent-volume].

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

2. Get the credentials for your Kubernetes cluster using the [`az aks get-credentials`][az-aks-get-credentials] command.

    ```azurecli-interactive
    az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
    ```

3. Update the *server* and *path* to the values of your NFS (Network File System) volume you created in the previous step.
4. Create the persistent volume using the [`kubectl apply`][kubectl-apply] command.

    ```console
    kubectl apply -f pv-nfs.yaml
    ```

5. Verify the status of the persistent volume is **Available** using the [`kubectl describe`][kubectl-describe] command.

    ```console
    kubectl describe pv pv-nfs
    ```

## Create the persistent volume claim

1. Create a `pvc-nfs.yaml` to define a [persistent volume claim][persistent-volume-claim].

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

2. Create the persistent volume claim using the [`kubectl apply`][kubectl-apply] command.

    ```console
    kubectl apply -f pvc-nfs.yaml
    ```

3. Verify the status of the persistent volume claim is **Bound** using the [`kubectl describe`][kubectl-describe] command.

    ```console
    kubectl describe pvc pvc-nfs
    ```

## Mount the HPC Cache with a pod

1. Create a `nginx-nfs.yaml` file to define a pod that uses the persistent volume claim.

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

2. Create the pod using the [`kubectl apply`][kubectl-apply] command.

    ```console
    kubectl apply -f nginx-nfs.yaml
    ```

3. Verify the pod is running using the [`kubectl describe`][kubectl-describe] command.

    ```console
    kubectl describe pod nginx-nfs
    ```

4. Verify your volume is mounted in the pod using the [`kubectl exec`][kubectl-exec] command to connect to the pod, then `df -h` to check if the volume is mounted.

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

If you need to run an application as a non-root user, you may need to disable root squashing to chown a directory to another user. The non-root user needs to own a directory to access the file system. For the user to own a directory, the root user must chown a directory to that user, but if the HPC Cache is squashing root, this operation is denied because the root user (UID 0) is being mapped to the anonymous user. For more information about root squashing and client access policies, see [HPC Cache access policies][hpc-cache-access-policies].

## Next steps

* For more information on Azure HPC Cache, see [HPC Cache overview][hpc-cache].
* For more information on using NFS with AKS, see [Manually create and use a Network File System (NFS) Linux Server volume with AKS][aks-nfs].

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

[az-network-vnet-subnet-create]: /cli/azure/network/vnet/subnet#az_network_vnet_subnet_create

[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials

[az-provider-register]: /cli/azure/provider#az_provider_register

[az-storage-account-create]: /cli/azure/storage/account#az_storage_account_create

[az-role-assignment-create]: /cli/azure/role/assignment#az_role_assignment_create

[az-storage-container-create]: /cli/azure/storage/container#az_storage_container_create

[az-hpc-cache-blob-storage-target-add]: /cli/azure/hpc-cache/blob-storage-target#az_hpc_cache_blob_storage_target_add

[az-network-private-dns-zone-create]: /cli/azure/network/private-dns/zone#az_network_private_dns_zone_create

[az-network-private-dns-link-vnet-create]: /cli/azure/network/private-dns/link/vnet#az_network_private_dns_link_vnet_create

[az-network-private-dns-record-set-a-create]: /cli/azure/network/private-dns/record-set/a#az_network_private_dns_record_set_a_create


