---
title: Configure Azure NetApp Files for Azure Kubernetes Service
description: Learn how to configure Azure NetApp Files for an Azure Kubernetes Service cluster.
ms.topic: article
ms.custom: devx-track-azurecli, devx-track-linux
ms.date: 05/08/2023
---

# Configure Azure NetApp Files for Azure Kubernetes Service

A persistent volume represents a piece of storage that has been provisioned for use with Kubernetes pods. A persistent volume can be used by one or many pods, and it can be statically or dynamically provisioned. This article shows you how to configure [Azure NetApp Files][anf] to be used by pods on an Azure Kubernetes Service (AKS) cluster.

[Azure NetApp Files][anf] is an enterprise-class, high-performance, metered file storage service running on Azure and supports volumes using [NFS](azure-netapp-files-nfs.md) (NFSv3 or NFSv4.1), [SMB](azure-netapp-files-smb.md), and [dual-protocol](azure-netapp-files-dual-protocol.md) (NFSv3 and SMB, or NFSv4.1 and SMB). Kubernetes users have two options for using Azure NetApp Files volumes for Kubernetes workloads:

* Create Azure NetApp Files volumes **statically**. In this scenario, the creation of volumes is external to AKS. Volumes are created using the Azure CLI or from the Azure portal, and are then exposed to Kubernetes by the creation of a `PersistentVolume`. Statically created Azure NetApp Files volumes have many limitations (for example, inability to be expanded, needing to be over-provisioned, and so on). Statically created volumes aren't recommended for most use cases.
* Create Azure NetApp Files volumes **dynamically**, orchestrating through Kubernetes. This method is the **preferred** way to create multiple volumes directly through Kubernetes, and is achieved using [Astra Trident][astra-trident]. Astra Trident is a CSI-compliant dynamic storage orchestrator that helps provision volumes natively through Kubernetes.

> [!NOTE]
> Dual-protocol volumes can only be created **statically**. For more information on using dual-protocol volumes with Azure Kubernetes Service, see [Provision Azure NetApp Files dual-protocol volumes for Azure Kubernetes Service](azure-netapp-files-dual-protocol.md).

Using a CSI driver to directly consume Azure NetApp Files volumes from AKS workloads is the recommended configuration for most use cases. This requirement is accomplished using Astra Trident, an open-source dynamic storage orchestrator for Kubernetes. Astra Trident is an enterprise-grade storage orchestrator purpose-built for Kubernetes, and fully supported by NetApp. It simplifies access to storage from Kubernetes clusters by automating storage provisioning.

You can take advantage of Astra Trident's Container Storage Interface (CSI) driver for Azure NetApp Files to abstract underlying details and create, expand, and snapshot volumes on-demand. Also, using Astra Trident enables you to use [Astra Control Service][astra-control-service] built on top of Astra Trident. Using the Astra Control Service, you can backup, recover, move, and manage the application-data lifecycle of your AKS workloads across clusters within and across Azure regions to meet your business and service continuity needs.

## Before you begin

The following considerations apply when you use Azure NetApp Files:

* Your AKS cluster must be [in a region that supports Azure NetApp Files][anf-regions].
* The Azure CLI version 2.0.59 or higher installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].
* After the initial deployment of an AKS cluster, you can choose to provision Azure NetApp Files volumes statically or dynamically.
* To use dynamic provisioning with Azure NetApp Files with Network File System (NFS), install and configure [Astra Trident][astra-trident] version 19.07 or higher. To use dynamic provisioning with Azure NetApp Files with Secure Message Block (SMB), install and configure Astra Trident version 22.10 or higher. Dynamic provisioning for SMB shares is only supported on windows worker nodes.
* Before you deploy Azure NetApp Files SMB volumes, you must identify the AD DS integration requirements for Azure NetApp Files to ensure that Azure NetApp Files is well connected to AD DS. For more information, see [Understand guidelines for Active Directory Domain Services site design and planning](../azure-netapp-files/understand-guidelines-active-directory-domain-service-site.md). Both the AKS cluster and Azure NetApp Files must have connectivity to the same AD. 

## Configure Azure NetApp Files for AKS workloads

This section describes how to set up Azure NetApp Files for AKS workloads. It's applicable for all scenarios within this article. 

1. Define variables for later usage. Replace *myresourcegroup*, *mylocation*, *myaccountname*, *mypool1*, *poolsize*, *premium*, *myvnet*, *myANFSubnet*, and *myprefix* with appropriate values for your environment.

    ```azurecli-interactive
    RESOURCE_GROUP="myresourcegroup"
    LOCATION="mylocation"
    ANF_ACCOUNT_NAME="myaccountname"
    POOL_NAME="mypool1"
    SIZE="poolsize" # size in TiB
    SERVICE_LEVEL="Premium" # valid values are Standard, Premium and Ultra
    VNET_NAME="myvnet"
    SUBNET_NAME="myANFSubnet"
    ADDRESS_PREFIX="myprefix"
    ```
    
2. Register the *Microsoft.NetApp* resource provider by running the following command:

    ```azurecli-interactive
    az provider register --namespace Microsoft.NetApp --wait
    ```

    > [!NOTE]
    > This operation can take several minutes to complete.

3. Create a new account by using the command [`az netappfiles account create`](/cli/azure/netappfiles/account#az-netappfiles-account-create). When you create an Azure NetApp account for use with AKS, you can create the account in an existing resource group or create a new one in the same region as the AKS cluster.

    ```azurecli-interactive
    az netappfiles account create \
        --resource-group $RESOURCE_GROUP \
        --location $LOCATION \
        --account-name $ANF_ACCOUNT_NAME
    ```

4. Create a new capacity pool by using the command [`az netappfiles pool create`][az-netappfiles-pool-create]. Replace the variables shown in the command with your Azure NetApp Files information. The `account_name` should be the same as created in Step 3.

    ```azurecli-interactive
    az netappfiles pool create \
        --resource-group $RESOURCE_GROUP \
        --location $LOCATION \
        --account-name $ANF_ACCOUNT_NAME \
        --pool-name $POOL_NAME \
        --size $SIZE \
        --service-level $SERVICE_LEVEL
    ```

5. Create a subnet to [delegate to Azure NetApp Files][anf-delegate-subnet] using the command [`az network vnet subnet create`][az-network-vnet-subnet-create]. Specify the resource group hosting the existing virtual network for your AKS cluster. Replace the variables shown in the command with your Azure NetApp Files information. 

    > [!NOTE]
    > This subnet must be in the same virtual network as your AKS cluster.

    ```azurecli-interactive
    az network vnet subnet create \
        --resource-group $RESOURCE_GROUP \
        --vnet-name $VNET_NAME \
        --name $SUBNET_NAME \
        --delegations "Microsoft.NetApp/volumes" \
        --address-prefixes $ADDRESS_PREFIX
    ```

## Statically or dynamically provision Azure NetApp Files volumes for NFS or SMB

After you [configure Azure NetApp Files for AKS workloads](#configure-azure-netapp-files-for-aks-workloads), you can statically or dynamically provision Azure NetApp Files using NFS, SMB, or dual-protocol volumes within the capacity pool. Follow instructions in:
* [Provision Azure NetApp Files NFS volumes for Azure Kubernetes Service](azure-netapp-files-nfs.md) 
* [Provision Azure NetApp Files SMB volumes for Azure Kubernetes Service](azure-netapp-files-smb.md)
* [Provision Azure NetApp Files dual-protocol volumes for Azure Kubernetes Service](azure-netapp-files-dual-protocol.md)

## Next steps

Astra Trident supports many features with Azure NetApp Files. For more information, see:

* [Expanding volumes][expand-trident-volumes]
* [On-demand volume snapshots][on-demand-trident-volume-snapshots]
* [Importing volumes][importing-trident-volumes]

<!-- EXTERNAL LINKS -->
[astra-trident]: https://docs.netapp.com/us-en/trident/index.html
[kubectl-create]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#create
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-describe]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe
[kubectl-exec]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#exec
[astra-control-service]: https://cloud.netapp.com/astra-control
[kubernetes-csi-driver]: https://kubernetes-csi.github.io/docs/
[trident-install-guide]: https://docs.netapp.com/us-en/trident/trident-get-started/kubernetes-deploy.html
[trident-helm-chart]: https://docs.netapp.com/us-en/trident/trident-get-started/kubernetes-deploy-operator.html
[tridentctl]: https://docs.netapp.com/us-en/trident/trident-get-started/kubernetes-deploy-tridentctl.html
[trident-backend-install-guide]: https://docs.netapp.com/us-en/trident/trident-use/backends.html
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[expand-trident-volumes]: https://docs.netapp.com/us-en/trident/trident-use/vol-expansion.html
[on-demand-trident-volume-snapshots]: https://docs.netapp.com/us-en/trident/trident-use/vol-snapshots.html
[importing-trident-volumes]: https://docs.netapp.com/us-en/trident/trident-use/vol-import.html
[backend-anf.yaml]: https://raw.githubusercontent.com/NetApp/trident/v23.01.1/trident-installer/sample-input/backends-samples/azure-netapp-files/backend-anf.yaml

<!-- INTERNAL LINKS -->
[aks-quickstart-cli]: ./learn/quick-kubernetes-deploy-cli.md
[aks-quickstart-portal]: ./learn/quick-kubernetes-deploy-portal.md
[aks-quickstart-powershell]: ./learn/quick-kubernetes-deploy-powershell.md
[anf]: ../azure-netapp-files/azure-netapp-files-introduction.md
[anf-delegate-subnet]: ../azure-netapp-files/azure-netapp-files-delegate-subnet.md
[anf-regions]: https://azure.microsoft.com/global-infrastructure/services/?products=netapp&regions=all
[az-aks-show]: /cli/azure/aks#az_aks_show
[az-netappfiles-account-create]: /cli/azure/netappfiles/account#az_netappfiles_account_create
[az-netapp-files-dynamic]: azure-netapp-files-dynamic.md
[az-netappfiles-pool-create]: /cli/azure/netappfiles/pool#az_netappfiles_pool_create
[az-netappfiles-volume-create]: /cli/azure/netappfiles/volume#az_netappfiles_volume_create
[az-netappfiles-volume-show]: /cli/azure/netappfiles/volume#az_netappfiles_volume_show
[az-network-vnet-subnet-create]: /cli/azure/network/vnet/subnet#az_network_vnet_subnet_create
[install-azure-cli]: /cli/azure/install-azure-cli
[use-tags]: use-tags.md
[azure-ad-app-registration]: ../active-directory/develop/howto-create-service-principal-portal.md
