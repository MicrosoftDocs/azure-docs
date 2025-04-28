---
title: "Deploy arc-enabled workloads in an Extended Zone: ContainerApps"
description: Learn how to deploy arc-enabled ContainerApps in an Extended Zone.
author: svaldes
ms.author: svaldes
ms.service: azure-extended-zones
ms.topic: quickstart-arm
ms.date: 30/04/2025
ms.custom: subject-armqs, devx-track-azurecli

# Customer intent: As a cloud administrator and Azure Extended Zones user, I want a quick method to deploy PaaS services via Arc in an Azure Extended Zone. 
---
  
# Deploy arc-enabled workloads in an Extended Zone: ContainerApps
 
In this article, you will learn how to deploy arc-enabled workloads in an Extended Zone. The current supported workloads are ContainerApps, ManagedSQL, and PostgreSQL.
Feel free to explore Container Apps on Azure Arc Overview | Microsoft Learn to become more familiar with Container Apps on Azure Arc.

## Prerequisites

- [An Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) with an active subscription.
- Access to an Extended Zone. For more information, see [Request access to an Azure Extended Zone](request-access.md).
- Azure Cloud Shell or Azure CLI. Install the [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli).
- Access to a public or private container registry, such as the [Azure Container Registry](https://learn.microsoft.com/en-us/azure/container-registry/).
- Review the [requirements and limitations](https://learn.microsoft.com/en-us/azure/container-apps/azure-arc-overview0) of the public preview. Of particular importance are the cluster requirements.
- Before you proceed to create a container app, you first need to set up an [Azure Arc-enabled Kubernetes cluster to run Azure Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/azure-arc-enable-cluster). You will need to follow the steps in *Setup*, *Create a Connected Cluster*, and (optionally) *Create a Log Analytics Workspace* before addressing the following steps in this article. 
> [!NOTE] 
> Use the intended Extended Location as your location variable. 

## Getting Started	
If you are already familiar with the topics below, you may skip this paragraph. There are important topics you may want read before you proceed with creation:
•	[Overview of Azure Arc-enabled data services](https://learn.microsoft.com/en-us/azure/azure-arc/data/overview)
•	[Connectivity modes and requirements](https://learn.microsoft.com/en-us/azure/azure-arc/data/connectivity)
•	[Storage configuration and Kubernetes storage concepts](https://learn.microsoft.com/en-us/azure/azure-arc/data/storage-configuration)
•	[Kubernetes resource model](https://github.com/kubernetes/design-proposals-archive/blob/main/scheduling/resources.md#resource-quantities)

### Create Container Apps on Arc-enabled AKS in Extended Zones

Now that the Arc-enabled AKS has been created, we can proceed to using the following PowerShell script to create our Container App on an AKS cluster in an Extended Zone and connect it to the Azure Arc-enabled Kubernetes. 

> [!NOTE] 
> Please make sure to transfer the parameters from the Arc-enabled AKS steps correctly into the script.
 
```powershell
# . "./CreateArcEnabledAksOnEZ.ps1"

# Create a container app on an AKS cluster in an edge zone and connect it to Azure Arc-enabled Kubernetes
function CreateContainerAppOnArcEnabledAksEz {
    param(
        [string] $AKSClusterResourceGroupName,
        [string] $location = "westus",
        [string] $AKSName,
        [string] $edgeZone,
        [int] $nodeCount = 2,
        [string] $vmSize = "standard_nv12ads_a10_v5",
        [string] $ARCResourceGroupName,
        [string] $CONNECTED_ENVIRONMENT_NAME,
        [string] $CUSTOM_LOCATION_NAME,
        [string] $SubscriptionId,
        [string] $ACRName,
        [string] $imageName,
        [switch] $Debug
    )

    try {
        # Set the subscription
        az account set --subscription $SubscriptionId

        # Create the ARC-enabled EZ AKS cluster
        createArcEnabledAksOnEz -SubscriptionId $SubscriptionId -AKSClusterResourceGroupName $AKSClusterResourceGroupName -location $location -AKSName $AKSName -edgeZone $edgeZone -nodeCount $nodeCount -vmSize $vmSize -ARCResourceGroupName $ARCResourceGroupName -Debug:$Debug

        # Install container apps extension
        $CLUSTER_NAME = "$ARCResourceGroupName-cluster" # Name of the connected cluster resource
        $EXTENSION_NAME="appenv-ext"
        $NAMESPACE="app-ns"
        az k8s-extension create `
        --resource-group $ARCResourceGroupName `
        --name $EXTENSION_NAME `
        --cluster-type connectedClusters `
        --cluster-name $CLUSTER_NAME `
        --extension-type 'Microsoft.App.Environment' `
        --release-train stable `
        --auto-upgrade-minor-version true `
        --scope cluster `
        --release-namespace $NAMESPACE `
        --configuration-settings "Microsoft.CustomLocation.ServiceAccount=default" `
        --configuration-settings "appsNamespace=${NAMESPACE}" `
        --configuration-settings "clusterName=${CONNECTED_ENVIRONMENT_NAME}" `
        --configuration-settings "envoy.annotations.service.beta.kubernetes.io/azure-load-balancer-resource-group=${AKSClusterResourceGroupName}"
  
        # Save id property of the Container Apps extension for later
        $EXTENSION_ID=$(az k8s-extension show `
        --cluster-type connectedClusters `
        --cluster-name $CLUSTER_NAME `
        --resource-group $ARCResourceGroupName `
        --name $EXTENSION_NAME `
        --query id `
        --output tsv)

        # Wait for extension to fully install before proceeding
        az resource wait --ids $EXTENSION_ID --custom "properties.provisioningState!='Pending'" --api-version "2020-07-01-preview"
        
        $CONNECTED_CLUSTER_ID=$(az connectedk8s show --resource-group $ARCResourceGroupName --name $CLUSTER_NAME --query id --output tsv)
        az customlocation create `
        --resource-group $ARCResourceGroupName `
        --name $CUSTOM_LOCATION_NAME `
        --host-resource-id $CONNECTED_CLUSTER_ID `
        --namespace $NAMESPACE `
        --cluster-extension-ids $EXTENSION_ID    

        # DEBUG: Test custom location creation
        if ($Debug) {
            Write-Debug az customlocation show --resource-group $ARCResourceGroupName --name $CUSTOM_LOCATION_NAME
        }

        # Save id property of the custom location for later
        $CUSTOM_LOCATION_ID=$(az customlocation show `
        --resource-group $ARCResourceGroupName `
        --name $CUSTOM_LOCATION_NAME `
        --query id `
        --output tsv)

        # Create container Apps connected environment
        az containerapp connected-env create `
        --resource-group $ARCResourceGroupName `
        --name $CONNECTED_ENVIRONMENT_NAME `
        --custom-location $CUSTOM_LOCATION_ID `
        --location eastus

        # DEBUG: validate that the connected environment is successfully created
        if ($Debug) {
            Write-Debug az containerapp connected-env show --resource-group $ARCResourceGroupName --name $CONNECTED_ENVIRONMENT_NAME
        }

        # Create a new resource group for the container app
        $myResourceGroup="${imageName}-resource-group"
        az group create --name $myResourceGroup --location eastus

        # Get the custom location id
        $customLocationId=$(az customlocation show --resource-group $ARCResourceGroupName --name $CUSTOM_LOCATION_NAME --query id --output tsv)
        
        # Get info about the connected environment
        $myContainerApp="${imageName}-container-app"
        $myConnectedEnvironment=$(az containerapp connected-env list --custom-location $customLocationId -o tsv --query '[].id')

        # create acr and group
        az group create --name $ARCResourceGroupName --location eastus
        az acr create --resource-group $ARCResourceGroupName --name $ACRName --sku Basic

        # Wait for the ACR to be created
        Start-Sleep -Seconds 10   

        # login to acr and get login server
        az acr login --name $ACRName
        $ACRLoginServer = $(az acr show --name $ACRName --query loginServer --output tsv)

        # DEBUG: Test ACR login
        if ($Debug) {
            Write-Debug az acr show --name $ACRName
            Write-Debug az acr repository list --name $ACRName --output table
        }

        # Build and push docker image
        cd .\DemoApp
        docker build -t ${imageName} .
        docker tag ${imageName} ${ACRLoginServer}/${imageName}:latest
        docker push ${ACRLoginServer}/${imageName}:latest
        cd ..

        # Enable admin user in ACR and get password
        az acr update -n $ACRName --admin-enabled true
        $password = $(az acr credential show --name ${ACRName} --query passwords[0].value --output tsv)

        # Create container app
        az containerapp create `
        --resource-group $myResourceGroup `
        --name $myContainerApp `
        --environment $myConnectedEnvironment `
        --environment-type connected `
        --registry-server ${ACRLoginServer} `
        --registry-username ${ACRName} `
        --registry-password $password `
        --image "${ACRLoginServer}/${imageName}:latest" `
        --target-port 80 `
        --ingress 'external' `
        
        # Open the container app in a browser
        az containerapp browse --resource-group $myResourceGroup --name $myContainerApp
    }
    catch {
        # Catch any error
        Write-Error "An error occurred"
        Write-Error $Error[0]
    }  
}

CreateContainerAppOnArcEnabledAksEz -AKSClusterResourceGroupName "my-aks-cluster-group" `
                                    -location "westus" `
                                    -AKSName "my-aks-cluster"`
                                    -edgeZone "losangeles" `
                                    -nodeCount 2 `
                                    -vmSize "standard_nv12ads_a10_v5" `
                                    -ARCResourceGroupName "myARCResourceGroup" `
                                    -CONNECTED_ENVIRONMENT_NAME "myConnectedEnvironment" `
                                    -CUSTOM_LOCATION_NAME "myCustomLocation" `
                                    -SubscriptionId "<your subscription>"`
                                    -ACRName "containerappezacr" `
                                    -imageName "myimage"
```


## Clean up resources

When no longer needed, delete **my-aks-cluster-group** resource group and all of the resources it contains using the [az group delete](/cli/azure/group#az-group-delete) command.

```azurecli-interactive
az group delete --name my-aks-cluster-group
```

## Related content

- [Deploy an AKS cluster in an Extended Zone](deploy-aks-cluster.md)
- [Deploy a storage account in an Extended Zone](create-storage-account.md)
- [Frequently asked questions](faq.md)
