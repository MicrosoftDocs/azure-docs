---
title: "Deploy Arc-enabled workloads in an Extended Zone: Managed SQL Instance"
description: Learn how to deploy Arc-enabled Managed SQL Instance in an Extended Zone.
author: svaldes
ms.author: svaldes
ms.service: azure-extended-zones
ms.topic: how-to
ms.date: 05/02/2025

# Customer intent: As a cloud administrator and Azure Extended Zones user, I want a quick method to deploy PaaS services via Arc in an Azure Extended Zone. 
---
  
# Deploy Arc-enabled workloads in an Extended Zone: Managed SQL Instance
 
In this article, you'll learn how to deploy an Arc-enabled Managed SQL Instance in an Extended Zone. Refer to [What is Azure Extended Zones? | Services](/azure/extended-zones/overview#services) for currently supported PaaS workloads.

## Prerequisites

- [An Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) with an active subscription.
- Access to an Extended Zone. For more information, see [Request access to an Azure Extended Zone](request-access.md).
- Install the [Azure CLI](/cli/azure/install-azure-cli).
- Access to a public or private container registry, such as the [Azure Container Registry](/azure/container-registry/).
- Azure Data Studio
- Azure Arc extension for Azure Data Studio
- arcdata extension for Azure CLI
- kubectl
- An [Azure Arc data controller](/azure/azure-arc/data/plan-azure-arc-data-services), in addition to the required tools. 
- Other client tools depending on your environment. For a more comprehensive list, see [Client tools](/azure/azure-arc/data/install-client-tools).
- [An Azure Arc-enabled Kubernetes cluster set up in Extended Zones](/azure/extended-zones/arc-enabled-workloads-arc-enabled-aks-cluster). 
> [!NOTE] 
> Use the intended Extended Location as your location variable. 

## Getting started	
If you're already familiar with the subject, you may skip this paragraph. Here are important topics you may want read before you proceed with creation:
-	[Requirements and limitations](/azure/container-apps/azure-arc-overview) of the public preview. Of particular importance are the cluster requirements.
-	[Overview of Azure Arc-enabled data services](/azure/azure-arc/data/overview)
-	[Connectivity modes and requirements](/azure/azure-arc/data/connectivity)
-	[Storage configuration and Kubernetes storage concepts](/azure/azure-arc/data/storage-configuration)
-	[Kubernetes resource model](https://github.com/kubernetes/design-proposals-archive/blob/main/scheduling/resources.md#resource-quantities)

### Create an Azure Arc-enabled ManagedSQL Instance in Extended Zones

Now that the Arc-enabled AKS cluster is created, we can proceed to using the following PowerShell script to create our ManagedSQL Instance on an AKS cluster in an Extended Zone and connect it to the Azure Arc-enabled Kubernetes. 

> [!NOTE] 
> Make sure to transfer the parameters from the Arc-enabled AKS steps correctly into the script.
 
```powershell
. "./CreateArcEnabledAksOnEZ"

function CreateManagedSqlOnArcEnabledAksEz {
    param(
        [string] $ManagedInstanceName,
        [string] $dbname,
        [string] $SubscriptionId,
        [string] $AKSClusterResourceGroupName,
        [string] $location = "westus",
        [string] $AKSName,
        [string] $edgeZone,
        [int] $nodeCount = 2,
        [string] $vmSize = "standard_nv12ads_a10_v5",
        [string] $ArcResourceGroupName,
        [string] $DataControllerName,
        [string] $CustomLocationName,
        [string] $Namespace,
        [string] $DataControllerConfigProfile,
        [string] $KeyVaultName,
        [string] $VaultSecretUser,
        [string] $VaultSecretPass,
        [switch] $Debug
    )

    try {
        # Set the subscription
        az account set --subscription $SubscriptionId

        # Create the ARC-enabled EZ AKS cluster
        createArcEnabledAksOnEz -SubscriptionId $SubscriptionId -AKSClusterResourceGroupName $AKSClusterResourceGroupName -location $location -AKSName $AKSName -edgeZone $edgeZone -nodeCount $nodeCount -vmSize $vmSize -ArcResourceGroupName $ArcResourceGroupName -Debug:$Debug
        
        # Define name of the connected cluster resource
        $CLUSTER_NAME = "$ArcResourceGroupName-cluster"

        # Create a key vault and store login
        $AZDATA_USERNAME = az keyvault secret show --vault-name $KeyVaultName --name $VaultSecretUser --query value -o tsv
        $AZDATA_PASSWORD = az keyvault secret show --vault-name $KeyVaultName --name $VaultSecretPass --query value -o tsv
        
        # Define login for data controller and metrics
        $ENV:AZDATA_LOGSUI_USERNAME = $AZDATA_USERNAME
        $ENV:AZDATA_LOGSUI_PASSWORD = $AZDATA_PASSWORD
        $ENV:AZDATA_METRICSUI_USERNAME = $AZDATA_USERNAME
        $ENV:AZDATA_METRICSUI_PASSWORD = $AZDATA_PASSWORD

        # Define the connected cluster and extension for the custom location
        $CONNECTED_CLUSTER_ID=$(az connectedk8s show --resource-group $ArcResourceGroupName --name $CLUSTER_NAME --query id --output tsv)
        $EXTENSION_ID=$(az k8s-extension show `
        --cluster-type connectedClusters `
        --name 'my-data-controller-custom-location-ext' `
        --cluster-name $CLUSTER_NAME `
        --resource-group $ArcResourceGroupName `
        --query id `
        --output tsv)

        # Create a custom location for the data controller
        Write-Output "Creating data controller custom location..."
        az customlocation create `
        --resource-group $ArcResourceGroupName `
        --name $CustomLocationName `
        --host-resource-id $CONNECTED_CLUSTER_ID `
        --namespace $Namespace `
        --cluster-extension-ids $EXTENSION_ID

        # Create data controller on Arc-enabled AKS cluster
        Write-Output "Creating Arc Data Controller..."
        az arcdata dc create --name $DataControllerName --subscription $SubscriptionId --cluster-name $CLUSTER_NAME --resource-group $ArcResourceGroupName --connectivity-mode direct --custom-location $CustomLocationName --profile-name $DataControllerConfigProfile

        # Create a managed instance in the custom location
        Write-Output "Creating managed instance..."
        az sql mi-arc create --name $ManagedInstanceName --resource-group $ArcResourceGroupName --custom-location $CustomLocationName 
    }
    catch {
        # Catch any error
        Write-Error "An error occurred"
        Write-Error $Error[0]
    }

}

CreateManagedSqlOnArcEnabledAksEz -ManagedInstanceName "my-managed-instance" `
                        -dbname "myDB" `
                        -SubscriptionId "<your subscription>" `
                        -AKSClusterResourceGroupName "my-aks-cluster-group" `
                        -location "westus" `
                        -AKSName "my-aks-cluster" `
                        -edgeZone "losangeles" `
                        -nodeCount 2 `
                        -vmSize "standard_nv12ad-DataControllerConfigProfiles_a10_v5" `
                        -ArcResourceGroupName "myArcResourceGroup" `
                        -DataControllerName "myDataController" `
                        -CustomLocationName "dc-custom-location" `
                        -Namespace "my-data-controller-custom-location" `
                        -DataControllerConfigProfile "azure-arc-aks-premium-storage" `
                        -KeyVaultName "ezDataControllerConfig" `
                        -VaultSecretUser "AZDATA-USERNAME" `
                        -VaultSecretPass "AZDATA-PASSWORD"

```

## View instance on Azure Arc
To view the instance, use the following command:

```powershell
az sql mi-arc list --k8s-namespace <namespace> --use-k8s
```

You can copy the external IP and port number from here and connect to SQL Managed Instance enabled by Azure Arc. At this time, use the insiders build of [Azure Data Studio](https://github.com/microsoft/azuredatastudio#try-out-the-latest-insiders-build-from-main).


## Clean up resources

When no longer needed, delete **my-aks-cluster-group** resource group and all of the resources it contains using the [az group delete](/cli/azure/group#az-group-delete) command.

```powershell
az group delete --name my-aks-cluster-group
```

## Related content

- [Create an Arc-enabled AKS cluster in an Extended Zone](/azure/extended-zones/arc-enabled-workloads-arc-enabled-aks-cluster)
- [Deploy Arc-enabled workloads in an Extended Zone: ContainerApps](/azure/extended-zones/arc-enabled-workloads-container-apps)
- [Deploy Arc-enabled workloads in an Extended Zone: PostgreSQL](/azure/extended-zones/arc-enabled-workloads-postgre-sql)
- [Deploy an AKS cluster in an Extended Zone](deploy-aks-cluster.md)
- [Deploy a storage account in an Extended Zone](create-storage-account.md)
- [Frequently asked questions](faq.md)
