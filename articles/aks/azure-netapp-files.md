---
title: Integrate Azure NetApp Files with Azure Kubernetes Service
description: Learn how to integrate Azure NetApp Files with Azure Kubernetes Service
services: container-service
ms.topic: article
ms.date: 10/23/2020

#Customer intent: As a cluster operator or developer, I want to learn how to integrate ANF with AKS
---

# Integrate Azure NetApp Files with Azure Kubernetes Service

[Azure NetApp Files][anf] is an enterprise-class, high-performance, metered file storage service running on Azure. This article shows you how to integrate Azure NetApp Files with Azure Kubernetes Service (AKS).

## Before you begin
This article assumes that you have an existing AKS cluster. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli] or [using the Azure portal][aks-quickstart-portal].

> [!IMPORTANT]
> Your AKS cluster must also be [in a region that supports Azure NetApp Files][anf-regions].

You also need the Azure CLI version 2.0.59 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

### Limitations

The following limitations apply when you use Azure NetApp Files:

* Azure NetApp Files is only available [in selected Azure regions][anf-regions].
* Before you can use Azure NetApp Files, you must be granted access to the Azure NetApp Files service. To apply for access, you can use the [Azure NetApp Files waitlist submission form][anf-waitlist] or go to https://azure.microsoft.com/services/netapp/#getting-started. You can't access the Azure NetApp Files service until you receive the official confirmation email from the Azure NetApp Files team.
* After the initial deployment of an AKS cluster, only static provisioning for Azure NetApp Files is supported.
* To use dynamic provisioning with Azure NetApp Files, install and configure [NetApp Trident](https://netapp-trident.readthedocs.io/) version 19.07 or later.

## Configure Azure NetApp Files

> [!IMPORTANT]
> Before you can register the  *Microsoft.NetApp* resource provider, you must complete the [Azure NetApp Files waitlist submission form][anf-waitlist] or go to https://azure.microsoft.com/services/netapp/#getting-started for your subscription. You can't register the resource provide until you receive the official confirmation email from the Azure NetApp Files team.

Register the *Microsoft.NetApp* resource provider:

```azurecli
az provider register --namespace Microsoft.NetApp --wait
```

> [!NOTE]
> This can take some time to complete.

When you create an Azure NetApp account for use with AKS, you need to create the account in the **node** resource group. First, get the resource group name with the [az aks show][az-aks-show] command and add the `--query nodeResourceGroup` query parameter. The following example gets the node resource group for the AKS cluster named *myAKSCluster* in the resource group name *myResourceGroup*:

```azurecli-interactive
az aks show --resource-group myResourceGroup --name myAKSCluster --query nodeResourceGroup -o tsv
```

```output
MC_myResourceGroup_myAKSCluster_eastus
```

Create an Azure NetApp Files account in the **node** resource group and same region as your AKS cluster using [az netappfiles account create][az-netappfiles-account-create]. The following example creates an account named *myaccount1* in the *MC_myResourceGroup_myAKSCluster_eastus* resource group and *eastus* region:

```azurecli
az netappfiles account create \
    --resource-group MC_myResourceGroup_myAKSCluster_eastus \
    --location eastus \
    --account-name myaccount1
```

Create a new capacity pool by using [az netappfiles pool create][az-netappfiles-pool-create]. The following example creates a new capacity pool named *mypool1* with 4 TB in size and *Premium* service level:

```azurecli
az netappfiles pool create \
    --resource-group MC_myResourceGroup_myAKSCluster_eastus \
    --location eastus \
    --account-name myaccount1 \
    --pool-name mypool1 \
    --size 4 \
    --service-level Premium
```

Create a subnet to [delegate to Azure NetApp Files][anf-delegate-subnet] using [az network vnet subnet create][az-network-vnet-subnet-create]. *This subnet must be in the same virtual network as your AKS cluster.*

```azurecli
RESOURCE_GROUP=MC_myResourceGroup_myAKSCluster_eastus
VNET_NAME=$(az network vnet list --resource-group $RESOURCE_GROUP --query [].name -o tsv)
VNET_ID=$(az network vnet show --resource-group $RESOURCE_GROUP --name $VNET_NAME --query "id" -o tsv)
SUBNET_NAME=MyNetAppSubnet
az network vnet subnet create \
    --resource-group $RESOURCE_GROUP \
    --vnet-name $VNET_NAME \
    --name $SUBNET_NAME \
    --delegations "Microsoft.NetApp/volumes" \
    --address-prefixes 10.0.0.0/28
```

Create a volume by using [az netappfiles volume create][az-netappfiles-volume-create].

```azurecli
RESOURCE_GROUP=MC_myResourceGroup_myAKSCluster_eastus
LOCATION=eastus
ANF_ACCOUNT_NAME=myaccount1
POOL_NAME=mypool1
SERVICE_LEVEL=Premium
VNET_NAME=$(az network vnet list --resource-group $RESOURCE_GROUP --query [].name -o tsv)
VNET_ID=$(az network vnet show --resource-group $RESOURCE_GROUP --name $VNET_NAME --query "id" -o tsv)
SUBNET_NAME=MyNetAppSubnet
SUBNET_ID=$(az network vnet subnet show --resource-group $RESOURCE_GROUP --vnet-name $VNET_NAME --name $SUBNET_NAME --query "id" -o tsv)
VOLUME_SIZE_GiB=100 # 100 GiB
UNIQUE_FILE_PATH="myfilepath2" # Please note that file path needs to be unique within all ANF Accounts

az netappfiles volume create \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION \
    --account-name $ANF_ACCOUNT_NAME \
    --pool-name $POOL_NAME \
    --name "myvol1" \
    --service-level $SERVICE_LEVEL \
    --vnet $VNET_ID \
    --subnet $SUBNET_ID \
    --usage-threshold $VOLUME_SIZE_GiB \
    --file-path $UNIQUE_FILE_PATH \
    --protocol-types "NFSv3"
```

## Create the PersistentVolume

List the details of your volume using [az netappfiles volume show][az-netappfiles-volume-show]

```azurecli
az netappfiles volume show --resource-group $RESOURCE_GROUP --account-name $ANF_ACCOUNT_NAME --pool-name $POOL_NAME --volume-name "myvol1"
```

```output
{
  ...
  "creationToken": "myfilepath2",
  ...
  "mountTargets": [
    {
      ...
      "ipAddress": "10.0.0.4",
      ...
    }
  ],
  ...
}
```

Create a `pv-nfs.yaml` defining a PersistentVolume. Replace `path` with the *creationToken* and `server` with *ipAddress* from the previous command. For example:

```yaml
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-nfs
spec:
  capacity:
    storage: 100Gi
  accessModes:
    - ReadWriteMany
  mountOptions:
    - vers=3
  nfs:
    server: 10.0.0.4
    path: /myfilepath2
```

Update the *server* and *path* to the values of your NFS (Network File System) volume you created in the previous step. Create the PersistentVolume with the [kubectl apply][kubectl-apply] command:

```console
kubectl apply -f pv-nfs.yaml
```

Verify the *Status* of the PersistentVolume is *Available* using the [kubectl describe][kubectl-describe] command:

```console
kubectl describe pv pv-nfs
```

## Create the PersistentVolumeClaim

Create a `pvc-nfs.yaml` defining a PersistentVolume. For example:

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
      storage: 1Gi
```

Create the PersistentVolumeClaim with the [kubectl apply][kubectl-apply] command:

```console
kubectl apply -f pvc-nfs.yaml
```

Verify the *Status* of the PersistentVolumeClaim is *Bound* using the [kubectl describe][kubectl-describe] command:

```console
kubectl describe pvc pvc-nfs
```

## Mount with a pod

Create a `nginx-nfs.yaml` defining a pod that uses the PersistentVolumeClaim. For example:

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
    - while true; do echo $(date) >> /mnt/azure/outfile; sleep 1; done
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

Verify the pod is *Running* using the [kubectl describe][kubectl-describe] command:

```console
kubectl describe pod nginx-nfs
```

Verify your volume has been mounted in the pod by using [kubectl exec][kubectl-exec] to connect to the pod then `df -h` to check if the volume is mounted.

```console
$ kubectl exec -it nginx-nfs -- sh
```

```output
/ # df -h
Filesystem             Size  Used Avail Use% Mounted on
...
10.0.0.4:/myfilepath2  100T  384K  100T   1% /mnt/azure
...
```

## Next steps

For more information on Azure NetApp Files, see [What is Azure NetApp Files][anf]. For more information on using NFS with AKS, see [Manually create and use an NFS (Network File System) Linux Server volume with Azure Kubernetes Service (AKS)][aks-nfs].


[aks-quickstart-cli]: kubernetes-walkthrough.md
[aks-quickstart-portal]: kubernetes-walkthrough-portal.md
[aks-nfs]: azure-nfs-volume.md
[anf]: ../azure-netapp-files/azure-netapp-files-introduction.md
[anf-delegate-subnet]: ../azure-netapp-files/azure-netapp-files-delegate-subnet.md
[anf-quickstart]: ../azure-netapp-files/
[anf-regions]: https://azure.microsoft.com/global-infrastructure/services/?products=netapp&regions=all
[anf-waitlist]: https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR8cq17Xv9yVBtRCSlcD_gdVUNUpUWEpLNERIM1NOVzA5MzczQ0dQR1ZTSS4u
[az-aks-show]: /cli/azure/aks#az_aks_show
[az-netappfiles-account-create]: /cli/azure/netappfiles/account#az_netappfiles_account_create
[az-netappfiles-pool-create]: /cli/azure/netappfiles/pool#az_netappfiles_pool_create
[az-netappfiles-volume-create]: /cli/azure/netappfiles/volume#az_netappfiles_volume_create
[az-netappfiles-volume-show]: /cli/azure/netappfiles/volume#az_netappfiles_volume_show
[az-network-vnet-subnet-create]: /cli/azure/network/vnet/subnet#az_network_vnet_subnet_create
[install-azure-cli]: /cli/azure/install-azure-cli
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-describe]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe
[kubectl-exec]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#exec
