---
title: Prerequisites for Operator and Containerized Network Function (CNF)
description: Install the necessary prerequisites for Operator and Containerized Network Function (CNF).
author: sherrygonz
ms.author: sherryg
ms.date: 09/07/2023
ms.topic: quickstart
ms.service: azure-operator-service-manager
---

# Quickstart: Prerequisites for Operator and Containerized Network Function (CNF)

 This quickstart contains the prerequisite tasks for Operator and Containerized Network Function (CNF). While it's possible to automate these tasks within your NSD (Network Service Definition), in this quickstart, the actions are performed manually.

> [!NOTE]
> The tasks presented in this article may require some time to complete.

## Permissions

In order to complete these prerequisites for Operator and Containerized Network Function, you 
need an Azure subscription where you have the Contributor role (in order to create a Resource Group), or you need an existing Resource Group where you have the Contributor Role. 

## Set environment variables

Adapt the environment variable settings and references as needed for your particular environment. For example, in Windows PowerShell, you would set the environment variables as follows:

```powershell
$env:ARC_RG=<my rg>
``````

To use an environment variable, you would reference it as `$env:ARC_RG`.

```bash
export resourceGroup=<replace with resourcegroup name>
export location=<region>
export clusterName=<replace with clustername>
export customlocationId=${clusterName}-custom-location
export extensionId=${clusterName}-extension
```

## Create Resource Group

Create a Resource Group to host your Azure Kubernetes Service (AKS) cluster.

```azurecli
az account set --subscription <subscription>
az group create -n ${resourceGroup} -l ${location}
``````

## Provision Azure Kubernetes Service (AKS) cluster

Follow the instructions here [Quickstart: Deploy an Azure Kubernetes Service (AKS) cluster using Azure CLI](../aks/learn/quick-kubernetes-deploy-cli.md) to create the Azure Kubernetes Service (AKS) cluster within the previously created Resource Group.


> [!NOTE]
> Ensure that `agentCount` is set to 1. Only one node is required at this time.

```azurecli
az aks create -g ${resourceGroup} -n ${clusterName} --node-count 1 --generate-ssh-keys
``````

## Enable Azure Arc

Enable Azure Arc for the Azure Kubernetes Service (AKS) cluster. Follow the prerequisites outlined in 
[Create and manage custom locations on Azure Arc-enabled Kubernetes](../azure-arc/kubernetes/custom-locations.md).


```azurecli
az aks get-credentials --resource-group ${resourceGroup} --name ${clusterName}
``````

### Enable custom locations

Enable custom locations on the cluster:

```azurecli
az connectedk8s enable-features -n ${clusterName} -g ${resourceGroup} --features cluster-connect custom-locations
``````

### Connect cluster

Connect the cluster:

```azurecli
az connectedk8s connect --name ${clusterName} -g ${resourceGroup} --location $location
``````

### Create extension

Create an extension:

```azurecli
az k8s-extension create -g ${resourceGroup} --cluster-name ${clusterName} --cluster-type connectedClusters --name networkfunction-operator --extension-type microsoft.azure.hybridnetwork --release-train preview --scope cluster
export ConnectedClusterResourceId=`az connectedk8s show -g ${resourceGroup} -n ${clusterName} --query id -o tsv`
export ClusterExtensionResourceId=`az k8s-extension show -g ${resourceGroup} -c ${clusterName} --cluster-type connectedClusters --name ${extensionId} --query id -o tsv`
``````

### Create custom location

Create a custom location:

```azurecli
az customlocation create -g ${resourceGroup} -n ${customlocationId} --namespace "azurehybridnetwork" --host-resource-id $ConnectedClusterResourceId --cluster-extension-ids $ClusterExtensionResourceId
``````

## Retrieve custom location value

Retrieve the Custom location value. You need this information to fill in the Configuration Group values for your Site Network Service (SNS).

Search for the name of the Custom location (customLocationId) in the Azure portal, then select Properties. Locate the full Resource ID under the Essentials information area and look for field name ID. The following image provides an example of where the Resource ID information is located.

:::image type="content" source="media/retrieve-azure-arc-custom-location-value.png" alt-text="Screenshot showing the search field and Properties  information.":::


> [!TIP]
> The full Resource ID has a format of: /subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/microsoft.extendedlocation/customlocation/{customLocationName}


## Next steps

- [Quickstart: Create a Containerized Network Functions (CNF) Site with Nginx](quickstart-containerized-network-function-create-site.md)