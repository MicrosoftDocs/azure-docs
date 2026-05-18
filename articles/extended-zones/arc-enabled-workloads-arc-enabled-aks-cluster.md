---
title: "Create an Arc-enabled AKS cluster in an Extended Zone"
description: Learn how to creat an Arc-enabled AKS cluster in an Extended Zone.
author: svaldesgzz
ms.author: svaldes
ms.service: azure-extended-zones
ms.topic: how-to
ms.date: 04/30/2026

# Customer intent: As a cloud administrator and Azure Extended Zones user, I want a quick method to deploy PaaS services via Arc in an Azure Extended Zone. 
---
  
# Create an Arc-enabled AKS cluster in an Extended Zone
 
In this article, you learn how to create an Arc-enabled AKS cluster in an Extended Zone. This cluster helps you deploy PaaS services through Azure Arc. For currently supported PaaS workloads, see [Service offerings for Azure Extended Zones](overview.md#service-offerings-for-azure-extended-zones).

## Prerequisites

- [An Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) with an active subscription.
- Access to an Extended Zone. For more information, see [Request access to an Azure Extended Zone](request-access.md).
- Install the [Azure CLI](/cli/azure/install-azure-cli).
- Access to a public or private container registry, such as the [Azure Container Registry](/azure/container-registry/).

## Getting started	
If you're already familiar with the subject, you can skip this paragraph. Here are important topics you might want to read before you proceed with creation:
-	[Requirements and limitations](/azure/container-apps/azure-arc-overview) of the public preview. Of particular importance are the cluster requirements.
-	[Overview of Azure Arc-enabled data services](/azure/azure-arc/data/overview)
-	[Connectivity modes and requirements](/azure/azure-arc/data/connectivity)
-	[Storage configuration and Kubernetes storage concepts](/azure/azure-arc/data/storage-configuration)
-	[Kubernetes resource model](https://github.com/kubernetes/design-proposals-archive/blob/main/scheduling/resources.md#resource-quantities)

### Setup
Install the following Azure CLI extensions.
```powershell
az extension add --name connectedk8s  --upgrade --yes
az extension add --name k8s-extension --upgrade --yes
az extension add --name customlocation --upgrade --yes
```

Register the required namespaces.
```powershell
az provider register --namespace Microsoft.ExtendedLocation --wait
az provider register --namespace Microsoft.KubernetesConfiguration --wait
az provider register --namespace Microsoft.App --wait
az provider register --namespace Microsoft.OperationalInsights --wait
```

### Create an Arc-enabled AKS cluster in Extended Zones

Before you deploy PaaS workloads in Extended Zones, create an Arc-enabled AKS cluster in the target Extended Zone. The following script helps you create the cluster and eases the deployment of supported PaaS services. To learn more about these services, see the [related content](#related-content) at the end of this article.  

> [!NOTE] 
> Make sure to keep parameters consistent and transfer them correctly from this script to any following scripts.
 
```powershell
# Create an Arc-enabled AKS cluster on an edge zone
function createArcEnabledAksOnEz {
    param(
        [string] $SubscriptionId,
        [string] $AKSClusterResourceGroupName,
        [string] $location = "westus",
        [string] $AKSName,
        [string] $edgeZone,
        [int] $nodeCount = 2,
        [string] $vmSize = "standard_nv12ads_a10_v5",
        [string] $ArcResourceGroupName,
        [switch] $Debug
    )
    # Set the subscription
    az account set --subscription $SubscriptionId
    
    # Login to Azure
    az provider register --namespace Microsoft.AzureArcData
    
    # Create new resource group
    az group create --name $AKSClusterResourceGroupName --location $location

    # Create new cluster and deploy in edge zone
    Write-Output "Creating AKS cluster in edge zone..." 
    az aks create -g $AKSClusterResourceGroupName -n $AKSName --location $location --edge-zone $edgeZone --node-count $nodeCount -s $vmSize --generate-ssh-keys 
    
    # Create new resource group for Arc
    az group create --name $ArcResourceGroupName --location eastus

    # Download cluster credentials and get AKS cluster context
    az aks get-credentials --resource-group $AKSClusterResourceGroupName --name $AKSName --overwrite-existing

    # Connect the AKS cluster to Arc
    $CLUSTER_NAME = "$ArcResourceGroupName-cluster" # Name of the connected cluster resource
    Write-Output "Connecting AKS cluster to Azure Arc..."
    az connectedk8s connect --resource-group $ArcResourceGroupName --name $CLUSTER_NAME

    # DEBUG: Test connection to Arc
    if ($Debug) {
        Write-Debug az connectedk8s show --resource-group $ArcResourceGroupName --name $CLUSTER_NAME
    }
}


createArcEnabledAksOnEz -SubscriptionId "ffc37441-49e9-4291-a520-0b2d4972bb99" `
                        -AKSClusterResourceGroupName "t1" `
                        -location "westus" `
                        -AKSName "my-aks-cluster" `
                        -edgeZone "losangeles" `
                        -nodeCount 2 `
                        -vmSize "standard_nv12ads_a10_v5" `
                        -ArcResourceGroupName "t2"
```


## Clean up resources

When you no longer need the resources, delete the **my-aks-cluster** resource group and all of the resources it contains by using the [az group delete](/cli/azure/group#az-group-delete) command.

```powershell
az group delete --name my-aks-cluster
```

## Related content

- [Deploy Arc-enabled workloads in an Extended Zone: ContainerApps](/azure/extended-zones/arc-enabled-workloads-container-apps)
- [Deploy Arc-enabled workloads in an Extended Zone: ManagedSQL](/azure/extended-zones/arc-enabled-workloads-managed-sql)
- [Deploy an AKS cluster in an Extended Zone](deploy-aks-cluster.md)
- [Deploy a storage account in an Extended Zone](create-storage-account.md)
- [Frequently asked questions](faq.md)
