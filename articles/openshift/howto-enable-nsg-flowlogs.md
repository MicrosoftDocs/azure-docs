---
title: Enabling Network Security Group flow logs for Azure Red Hat OpenShift
description: In this article, learn how to enable flow logs to analyze traffic for Network Security Groups.
author: johnmarc
ms.service: azure-redhat-openshift
ms.topic: how-to
ms.author: johnmarc
ms.date: 08/30/2022
topic: how-to
recommendations: true
keywords: azure, openshift, aro, red hat, azure CLI
#Customer intent: I need to create and use an Azure service principal to restrict permissions to my Azure Red Hat OpenShift cluster.
---

# Enable Network Security Group flow logs

Flow logs allow you to analyze traffic for Network Security Groups in specific regions that have Azure Network Watcher configured.

## Prerequisites

You must have an existing Azure Red Hat OpenShift cluster. Follow [this guide](tutorial-create-cluster.md) to create a private Azure Red Hat OpenShift cluster.

## Configure Azure Network Watcher

Make sure an Azure Network Watcher exists in the applicable region or use the one existing by convention. For example, for the eastus region:
```
"subscriptions/{subscriptionID}/resourceGroups/NetworkWatcherRG/providers/Microsoft.Network/networkWatchers/NetworkWatcher_eastus"
```
See [Enable Azure Network Watcher](../network-watcher/enable-network-watcher-flow-log-settings.md)for more information.

## Create storage account

[Create a storage account](../storage/common/storage-account-create.md) (or use an existing storage account) for storing the actual flow logs. It must be in the same region as where the flow logs are going to be created. It cannot be in the same resource group as the cluster's resources.

## Configure service principal

The service principal used by the cluster needs the [proper permissions](../network-watcher/required-rbac-permissions.md) in order to create the necessary resources for the flow logs, and to access the storage account. The easiest way to achieve that is by assigning it the network administrator and storage account contributor roles at the subscription level. Alternatively, you can create a custom role containing the required actions from the page linked above and assign it to the service principal.

To get the service principal ID, run the following command:
```
az aro show -g {ResourceGroupName} -n {ClusterName} --query servicePrincipalProfile.clientId -o tsv 
```
Use the output of the above command to get the object ID:
```
az ad sp show --id XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX --query id --out tsv
```
To assign network admin, run the following command:
```
az role assignment create --assignee "{servicePrincipalObjectID}" --role "4d97b98b-1d4f-4787-a291-c67834d212e7" --subscription "{subscriptionID}" --resource-group "{networkWatcherResourceGroup}"
```
To assign storage account contributor, run the following command:
```
az role assignment create --role "17d1049b-9a84-46fb-8f53-869881c3d3ab" --assignee-object-id "{servicePrincipalObjectID}"
```
See [Azure built-in roles](../role-based-access-control/built-in-roles.md) for IDs of built-in roles.

Create a manifest as in the following example, or update the existing object to contain `spec.nsgFlowLogs` in case you are already using another preview feature:
```
apiVersion: "preview.aro.openshift.io/v1alpha1"
kind: PreviewFeature
metadata:
  name: cluster
spec:
  azEnvironment: "AzurePublicCloud"
  resourceId: "/subscriptions/{subscriptionID}/resourceGroups/{resourceGroupName}/providers/Microsoft.RedHatOpenShift/openShiftClusters/{clusterID}"
  nsgFlowLogs:
    enabled: true
    networkWatcherID: "/subscriptions/{subscriptionID}/resourceGroups/{networkWatcherRG}/providers/Microsoft.Network/networkWatchers/{networkWatcherName}"
    flowLogName: "{flowlogName}"
    retentionDays: {retentionDays}
    storageAccountResourceId: "/subscriptions/{subscriptionID}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{storageAccountName}"
    version: {version}  
```
See [Tutorial: Log network traffic to and from a virtual machine using the Azure portal](../network-watcher/network-watcher-nsg-flow-logging-portal.md) for possible values for `version` and `retentionDays`.
    
The cluster will create flow logs for each Network Security Group in the cluster resource group.
