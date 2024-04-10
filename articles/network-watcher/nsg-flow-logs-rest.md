---
title: Manage NSG flow logs - Azure REST API
titleSuffix: Azure Network Watcher
description: Learn how to create, change, or disable Azure Network Watcher NSG flow logs using REST API.
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: how-to
ms.date: 06/01/2023
---

# Manage NSG flow logs using REST API

Network security group flow logging is a feature of Azure Network Watcher that allows you to log information about IP traffic flowing through a network security group. For more information about network security group flow logging, see [NSG flow logs overview](nsg-flow-logs-overview.md).

This article shows you how to use the REST API to enable, disable, and query flow logs using the REST API. You can learn how to manage an NSG flow log using the [Azure portal](nsg-flow-logs-portal.md), [PowerShell](nsg-flow-logs-powershell.md), [Azure CLI](nsg-flow-logs-cli.md), or [ARM template](nsg-flow-logs-azure-resource-manager.md).

In this article, uou learn how to:

> [!div class="checklist"]
> * Enable flow logs (Version 2)
> * Disable flow logs
> * Query flow logs status

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- ARMClient. ARMClient is a simple command line tool to invoke the Azure Resource Manager API. To install the tool, see [ARMClient](https://github.com/projectkudu/ARMClient). For detailed specifications of NSG flow logs REST API, see [Flow Logs - REST API](/rest/api/network-watcher/flowlogs) 

> [!IMPORTANT]
> When you make REST API calls to Network Watcher, the resource group name in the request URI refers to the resource group that contains the Network Watcher, not the resources you are performing the diagnostic actions on.

## Sign in with ARMClient

Sign in to armclient with your Azure credentials.

```powershell
armclient login
```

## Register Insights provider

*Microsoft.Insights* provider must be registered to successfully log traffic flowing through a network security group. If you aren't sure if the *Microsoft.Insights* provider is registered, use [Providers - Register](/rest/api/resources/providers/register) REST API to register it.

```powershell
$subscriptionId = "00000000-0000-0000-0000-000000000000"
armclient post "https://management.azure.com//subscriptions/${subscriptionId}/providers/Microsoft.Insights/register?api-version=2021-04-01"
```

## Enable NSG flow logs

The command to enable flow logs version 2 is shown in the following example. For version 1, replace the 'version' field with '1':

```powershell
$subscriptionId = "00000000-0000-0000-0000-000000000000"
$targetUri = "" # example /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/{resourceGroupName/providers/Microsoft.Network/networkSecurityGroups/{nsgName}"
$storageId = "/subscriptions/00000000-0000-0000-0000-000000000000/{resourceGroupName/providers/Microsoft.Storage/storageAccounts/{saName}"
$resourceGroupName = "NetworkWatcherRG"
$networkWatcherName = "NetworkWatcher_westcentralus"
$requestBody = @"
{
    'targetResourceId': '${targetUri}',
    'properties': {
    'storageId': '${storageId}',
    'enabled': 'true',
    'retentionPolicy' : {
			days: 5,
			enabled: true
		},
    'format': {
        'type': 'JSON',
        'version': 2
    }
	}
}
"@

armclient post "https://management.azure.com/subscriptions/${subscriptionId}/ResourceGroups/${resourceGroupName}/providers/Microsoft.Network/networkWatchers/${networkWatcherName}/configureFlowLog?api-version=2022-11-01" $requestBody
```

The response returned from the preceding example is as follows:

```json
{
  "targetResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/networkSecurityGroups/{nsgName}",
  "properties": {
    "storageId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{saName}",
    "enabled": true,
    "retentionPolicy": {
      "days": 5,
      "enabled": true
    },
    "format": {
    "type": "JSON",
    "version": 2
    }
  }
}
```

> [!NOTE]
> - The [Network Watchers - Set Flow Log Configuration](/rest/api/network-watcher/network-watchers/set-flow-log-configuration) REST API used in the previous example, is old and may soon be deprecated.
> - It is recommended to use the new [Flow Logs - Create Or Update](/rest/api/network-watcher/flow-logs/create-or-update) REST API to create or update flow logs.

## Disable NSG flow logs

Use the following example to disable flow logs. The call is the same as enabling flow logs, except **false** is set for the enabled property.

```powershell
$subscriptionId = "00000000-0000-0000-0000-000000000000"
$targetUri = "" # example /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/{resourceGroupName/providers/Microsoft.Network/networkSecurityGroups/{nsgName}"
$storageId = "/subscriptions/00000000-0000-0000-0000-000000000000/{resourceGroupName/providers/Microsoft.Storage/storageAccounts/{saName}"
$resourceGroupName = "NetworkWatcherRG"
$networkWatcherName = "NetworkWatcher_westcentralus"
$requestBody = @"
{
    'targetResourceId': '${targetUri}',
    'properties': {
    'storageId': '${storageId}',
    'enabled': 'false',
    'retentionPolicy' : {
			days: 5,
			enabled: true
		},
    'format': {
        'type': 'JSON',
        'version': 2
    }
	}
}
"@

armclient post "https://management.azure.com/subscriptions/${subscriptionId}/ResourceGroups/${resourceGroupName}/providers/Microsoft.Network/networkWatchers/${networkWatcherName}/configureFlowLog?api-version=2022-11-01" $requestBody
```

The response returned from the preceding example is as follows:

```json
{
  "targetResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/networkSecurityGroups/{nsgName}",
  "properties": {
    "storageId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{saName}",
    "enabled": false,
    "retentionPolicy": {
      "days": 5,
      "enabled": true
    },
    "format": {
    "type": "JSON",
    "version": 2
    }
  }
}
```

> [!NOTE]
> - The [Network Watchers - Set Flow Log Configuration](/rest/api/network-watcher/network-watchers/set-flow-log-configuration) REST API used in the previous example, is old and may soon be deprecated.
> - It is recommended to use the new [Flow Logs - Create Or Update](/rest/api/network-watcher/flow-logs/create-or-update) REST API to disable flow logs and the [Flow Logs - Delete](/rest/api/network-watcher/flow-logs/delete) REST API to delete flow logs resource.

## Query flow logs

The following REST call queries the status of flow logs on a network security group.

```powershell
$subscriptionId = "00000000-0000-0000-0000-000000000000"
$targetUri = "" # example /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/{resourceGroupName/providers/Microsoft.Network/networkSecurityGroups/{nsgName}"
$resourceGroupName = "NetworkWatcherRG"
$networkWatcherName = "NetworkWatcher_westcentralus"
$requestBody = @"
{
    'targetResourceId': '${targetUri}',
}
"@

armclient post "https://management.azure.com/subscriptions/${subscriptionId}/ResourceGroups/${resourceGroupName}/providers/Microsoft.Network/networkWatchers/${networkWatcherName}/queryFlowLogStatus?api-version=2022-11-01" $requestBody
```

The following example shows the response returned:

```json
{
  "targetResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/networkSecurityGroups/{nsgName}",
  "properties": {
    "storageId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{saName}",
    "enabled": true,
   "retentionPolicy": {
      "days": 5,
      "enabled": true
    },
    "format": {
    "type": "JSON",
    "version": 2
    }
  }
}
```

> [!NOTE]
> - The [Network Watchers - Get Flow Log Status](/rest/api/network-watcher/network-watchers/get-flow-log-status) REST API used in the previous example, requires an additional *reader* permission in the resource group of the network watcher. Additionally, this API is old and may soon be deprecated.
> - It is recommended to use the new [Flow Logs - Get](/rest/api/network-watcher/flow-logs/get) REST API to query flow logs.

## Download a flow log

The storage location of a flow log is defined at creation. A convenient tool to access flow logs saved to a storage account is Microsoft Azure Storage Explorer. Fore more information, see [Get started with Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md).

If a storage account is specified, packet capture files are saved to a storage account at the following location:

```
https://{storageAccountName}.blob.core.windows.net/insights-logs-networksecuritygroupflowevent/resourceId=/SUBSCRIPTIONS/{subscriptionID}/RESOURCEGROUPS/{resourceGroupName}/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/{nsgName}/y={year}/m={month}/d={day}/h={hour}/m=00/macAddress={macAddress}/PT1H.json
```

## Next steps

- To learn how to use Azure built-in policies to audit or deploy NSG flow logs, see [Manage NSG flow logs using Azure Policy](nsg-flow-logs-policy-portal.md).
- To learn about traffic analytics, see [Traffic analytics](traffic-analytics.md).