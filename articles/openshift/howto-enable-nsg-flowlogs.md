---
title: Enabling Network Security Group flow logs for Azure Red Hat OpenShift
description: In this how-to article, learn how to create and use a service principal with an Azure Red Hat OpenShift cluster using Azure CLI or the Azure portal.
author: johnmarc
ms.service: azure-redhat-openshift
ms.topic: how-to
ms.author: johnmarco
ms.date: 08/09/2022
topic: how-to
keywords: azure, openshift, aro, red hat, azure CLI
#Customer intent: I need to create and use an Azure service principal to restrict permissions to my Azure Red Hat OpenShift cluster.
zone_pivot_groups: azure-red-hat-openshift-service-principal
---




# Enabling NSG flow logs

## prerequisites
- have an ARO cluster

## steps
- Make sure a network watcher exists in that region or use the one existing by convention, such as
```
"subscriptions/{subscriptionID}/resourceGroups/NetworkWatcherRG/providers/Microsoft.Network/networkWatchers/NetworkWatcher_eastus"
```
for eastus region.

- create a storage account for storing the actual flow logs. It must be in the same region as where the flow logs are going to be created. It cannot be in the same resource group as the cluster's resources.

- The service principle used by the cluster needs the permissions as outlined here: https://docs.microsoft.com/en-us/azure/network-watcher/required-rbac-permissions in order to create necessary resources for the flow logs and to access the storage account.
The easiest way to achieve that is by assigning it the network administrator and storage account contributor role on subscription level. Alternatively, you can create a custom role containing the required actions from the page linked above and assign it to the service principle.

To get the service principle ID, run
```
az aro show -g {ResourceGroupName} -n {ClusterName} --query servicePrincipalProfile.clientId -o tsv 
```
and use the output to get the object ID.
```
az ad sp show --id XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX --query id --out tsv
```
To assign network admin:
```
az role assignment create --assignee "{servicePrincipleObjectID}" --role "4d97b98b-1d4f-4787-a291-c67834d212e7" --subscription "{subscriptionID}" --resource-group "{networkWatcherResourceGroup}"
```
To assign storage account contributor:
```
az role assignment create --role "17d1049b-9a84-46fb-8f53-869881c3d3ab" --assignee-object-id "{servicePrincipleObjectID}"
```
See this page for IDs of built-in roles: https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles

- Create a spec like this or update the existing one to contain spec.nsgFlowLogs in case you are already using another preview feature:
```
apiVersion: "preview.aro.openshift.io/v1alpha1"
kind: PreviewFeature
metadata:
  name: cluster
spec:
  azEnvironment: "AzurePublicCloud"
  resourceId: "subscriptions/{subscriptionID}/resourceGroups/{resourceGroupName}/providers/Microsoft.RedHatOpenShift/openShiftClusters/{clusterID}"
  nsgFlowLogs:
    enabled: true
    networkWatcherID: "subscriptions/{subscriptionID}/resourceGroups/{networkWatcherRG}/providers/Microsoft.Network/networkWatchers/{networkWatcherName}"
    flowLogName: "{flowlogName}"
    retentionDays: {retentionDays}
    storageAccountResourceId: "subscriptions/{subscriptionID}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{storageAccountName}"
    version: {version}  
```
See https://docs.microsoft.com/en-us/azure/network-watcher/network-watcher-nsg-flow-logging-portal for possible values for version and retentionDays.    
The cluster will create flowLogs for each network security group in the cluster resource group.











# Create and use a service principal to deploy an Azure Red Hat OpenShift cluster

To interact with Azure APIs, an Azure Red Hat OpenShift cluster requires an Azure Active Directory (AD) service principal. This service principal is used to dynamically create, manage, or access other Azure resources, such as an Azure load balancer or an Azure Container Registry (ACR). For more information, see [Application and service principal objects in Azure Active Directory](../active-directory/develop/app-objects-and-service-principals.md).

This article explains how to create and use a service principal to deploy your Azure Red Hat OpenShift clusters using the Azure command-line interface (Azure CLI) or the Azure portal.  

> [!NOTE]
> Service principals expire in one year unless configured for longer periods. For information on extending your service principal expiration period, see [Rotate service principal credentials for your Azure Red Hat OpenShift (ARO) Cluster](howto-service-principal-credential-rotation.md).

::: zone pivot="aro-azurecli"

## Create and use a service principal

The following sections explain how to create and use a service principal to deploy an Azure Red Hat OpenShift cluster. 

## Prerequisites - Azure CLI

If you’re using the Azure CLI, you’ll need Azure CLI version 2.0.59 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

## Create a resource group - Azure CLI

Run the following Azure CLI command to create a resource group in which your Azure Red Hat OpenShift cluster will reside.

```azurecli-interactive
AZ_RG=$(az group create -n test-aro-rg -l eastus2 --query name -o tsv)
```

## Create a service principal and assign role-based access control (RBAC) - Azure CLI

 To assign the contributor role and scope the service principal to the Azure Red Hat OpenShift resource group, run the following command.

```azurecli-interactive
# Get Azure subscription ID
AZ_SUB_ID=$(az account show --query id -o tsv) 
# Create a service principal with contributor role and scoped to the Azure Red Hat OpenShift resource group 
az ad sp create-for-rbac -n "test-aro-SP" --role contributor --scopes "/subscriptions/${AZ_SUB_ID}/resourceGroups/${AZ_RG}"
```

The output is similar to the following example.

```
{ 

  "appId": "", 

  "displayName": "myAROClusterServicePrincipal", 

  "name": "http://myAROClusterServicePrincipal", 

  "password": "yourpassword", 

  "tenant": "yourtenantname"

}
``` 
 
> [!IMPORTANT]
> This service principal only allows a contributor over the resource group the Azure Red Hat OpenShift cluster is located in. If your VNet is in another resource group, you need to assign the service principal contributor role to that resource group as well. You also need to create your Azure Red Hat OpenShift cluster in the resource group you created above.

To grant permissions to an existing service principal with the Azure portal, see [Create an Azure AD app and service principal in the portal](../active-directory/develop/howto-create-service-principal-portal.md#configure-access-policies-on-resources).

::: zone-end

::: zone pivot="aro-azureportal"

## Create a service principal with the Azure portal

This section explains how to use the Azure portal to create a service principal for your Azure Red Hat OpenShift cluster. 

To create a service principal, see [Use the portal to create an Azure AD application and service principal that can access resources](../active-directory/develop/howto-create-service-principal-portal.md). **Be sure to save the client ID and the appID.**



::: zone-end