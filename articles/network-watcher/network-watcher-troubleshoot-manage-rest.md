---
title: Troubleshoot Virtual Network Gateway and connections using Azure Network Watcher Troubleshoot REST API | Microsoft Docs
description: This page explains how to use the Azure Network Watcher troubleshoot REST API
services: network-watcher
documentationcenter: na
author: georgewallace
manager: timlt
editor: 

ms.assetid: e4d5f195-b839-4394-94ef-a04192766e55
ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 01/30/2017
ms.author: gwallace

---

# Troubleshoot Virtual Network Gateway and connections using Azure Network Watcher Troubleshoot REST API

Network Watcher troubleshoot API provides the ability to troubleshoot Virtual Network Gateway and connection issues.

This article takes you through the different management tasks that are currently available for packet capture.

- [**Troubleshoot a Virtual Network Gateway**](#troubleshoot-a-virtual-network-gateway)
- [**Troubleshoot a connection**](#troubleshoot-connections)

## Before you begin

To provide the examples **PowerShell** is used with ARMclient, which is found on chocolatey at [ARMClient on Chocolatey](https://chocolatey.org/packages/ARMClient)

This scenario assumes you have already followed the steps in [Create a Network Watcher](network-watcher-create.md) to create a Network Watcher.

## Overview

The Network Watcher troubleshoot API provides the ability troubleshoot issues that arise with Virtual Network Gateways and connections. When a request is made to the troubleshoot API, logs are querying and inspected. When inspection is complete the results are returned. The troubleshoot API requests are long running requests which could take multiple minutes to return a result. Logs are stored in a container on a storage account.


## Log in with ARMClient

```PowerShell
armclient login
```

## Troubleshoot a Virtual Network Gateway


### POST the troubleshoot request

The following example queries the status of a Virtual Network Gateway.

```powershell

$subscriptionId = "00000000-0000-0000-0000-000000000000"
$resourceGroupName = "ContosoRG"
$NWresourceGroupName = "NetworkWatcherRG"
$networkWatcherName = "NetworkWatcher_westcentralus"
$vnetGatewayName = "ContosoVNETGateway"
$storageAccountName = "contososa"
$containerName = "gwlogs"
$requestBody = @"
{
'TargetResourceId': '/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.Network/virtualNetworkGateways/${vnetGatewayName}',
'Properties': {
'StorageId': '/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.Storage/storageAccounts/${storageAccountName}',
'StoragePath': 'https://${storageAccountName}.blob.core.windows.net/${containerName}'
}
}
"@

}
armclient post "https://management.azure.com/subscriptions/${subscriptionId}/ResourceGroups/${NWresourceGroupName}/providers/Microsoft.Network/networkWatchers/${networkWatcherName}/troubleshoot?api-version=2016-03-30 "
```

Since this is a long running transaction, in the response header, the URI for querying the operation and the URI for the result is returned as shown in the following response.

**Important Values**

* **Azure-AsyncOperation** - This property contains the URI to query the Async troubleshoot operation
* **Location** - This property contains the URI where the results are when the operation is complete

```
HTTP/1.1 202 Accepted
Pragma: no-cache
Retry-After: 10
x-ms-request-id: 8a1167b7-6768-4ac1-85dc-703c9c9b9247
Azure-AsyncOperation: https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Network/locations/westcentralus/operations/8a1167b7-6768-4ac1-85dc-703c9c9b9247?api-version=2016-03-30
Strict-Transport-Security: max-age=31536000; includeSubDomains
Cache-Control: no-cache
Location: https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Network/locations/westcentralus/operationResults/8a1167b7-6768-4ac1-85dc-703c9c9b9247?api-version=2016-03-30
Server: Microsoft-HTTPAPI/2.0; Microsoft-HTTPAPI/2.0
x-ms-ratelimit-remaining-subscription-writes: 1199
x-ms-correlation-request-id: 4364d88a-bd08-422c-a716-dbb0cdc99f7b
x-ms-routing-request-id: NORTHCENTRALUS:20170112T183202Z:4364d88a-bd08-422c-a716-dbb0cdc99f7b
Date: Thu, 12 Jan 2017 18:32:01 GMT

null
```

### Query the Async Operation for completion

Use the operations URI to query for the progress of the operation as seen in the following example:

```powershell
armclient get "https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Network/locations/westcentralus/operations/8a1167b7-6768-4ac1-85dc-703c9c9b9247?api-version=2016-03-30"
```

While the operation is in progress, the response will show **InProgress** as seen in the following example:

```json
{
  "status": "InProgress"
}
```

When the operation is complete the status will change to **Succeeded**.

```json
{
  "status": "Succeeded"
}
```

### Retrieve the results

Once the status returned is **Succeeded**, call a GET Method on the operationResult URI to retrieve the results.

```powershell
armclient get "https://management.azure.com/subscriptions/147a22e9-2356-4e56-b3de-1f5842ae4a3b/providers/Microsoft.Network/locations/westcentralus/operationResults/8a1167b7-6768-4ac1-85dc-703c9c9b9247?api-version=2016-03-30"
```

The following responses are examples of a typical degraded response returned when querying the results of troubleshooting a gateway. See [Understanding the results](#understanding-the-results) to get clarification on what the properties in the response mean.

```json
{
  "startTime": "2017-01-12T10:31:41.562646-08:00",
  "endTime": "2017-01-12T18:31:48.677Z",
  "code": "Degraded",
  "results": [
    {
      "id": "PlatformInActive",
      "summary": "We are sorry, your VPN gateway is in standby mode",
      "detail": "During this time the gateway will not initiate or accept VPN connections with on premises VPN devices or other Azure VPN Gateways. This is a transient state while the Azure platform is being updated.",
      "recommendedActions": [
        {
          "actionText": "If the condition persists, please try resetting your Azure VPN Gateway",
          "actionUri": "https://azure.microsoft.com/en-us/documentation/articles/vpn-gateway-resetgw-classic/",
          "actionUriText": "resetting the VPN Gateway"
        },
        {
          "actionText": "If your VPN gateway isn't up and running by the expected resolution time, contact support",
          "actionUri": "http://azure.microsoft.com/support",
          "actionUriText": "contact support"
        }
      ]
    },
    {
      "id": "NoFault",
      "summary": "This VPN gateway is running normally",
      "detail": "There aren't any known Azure platform problems affecting this VPN Connection",
      "recommendedActions": [
        {
          "actionText": "If you are still experience problems with the VPN gateway, please try resetting the VPN gateway.",
          "actionUri": "https://azure.microsoft.com/en-us/documentation/articles/vpn-gateway-resetgw-classic/",
          "actionUriText": "resetting VPN gateway"
        },
        {
          "actionText": "If you are experiencing problems you believe are caused by Azure, contact support",
          "actionUri": "http://azure.microsoft.com/support",
          "actionUriText": "contact support"
        }
      ]
    }
  ]
}
```


## Troubleshoot connections

The following example queries the status of a connection.

```powershell

$subscriptionId = "00000000-0000-0000-0000-000000000000"
$resourceGroupName = "ContosoRG"
$NWresourceGroupName = "NetworkWatcherRG"
$networkWatcherName = "NetworkWatcher_westcentralus"
$connectionName = "VNET2toVNET1Connection"
$storageAccountName = "contososa"
$containerName = "gwlogs"
$requestBody = @{
"TargetResourceId": "/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.Network/connections/${connectionName}",
"Properties": {
"StorageId": "/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.Storage/storageAccounts/${storageAccountName}",
"StoragePath": "https://${storageAccountName}.blob.core.windows.net/${containerName}"
}

}
armclient post "https://management.azure.com/subscriptions/${subscriptionId}/ResourceGroups/${NWresourceGroupName}/providers/Microsoft.Network/networkWatchers/${networkWatcherName}/troubleshoot?api-version=2016-03-30 "
```

Since this is a long running transaction, in the response header, the URI for querying the operation and the URI for the result is returned as shown in the following response.

**Important Values**

* **Azure-AsyncOperation** - This property contains the URI to query the Async troubleshoot operation
* **Location** - This property contains the URI where the results are when the operation is complete

```
HTTP/1.1 202 Accepted
Pragma: no-cache
Retry-After: 10
x-ms-request-id: 8a1167b7-6768-4ac1-85dc-703c9c9b9247
Azure-AsyncOperation: https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Network/locations/westcentralus/operations/8a1167b7-6768-4ac1-85dc-703c9c9b9247?api-version=2016-03-30
Strict-Transport-Security: max-age=31536000; includeSubDomains
Cache-Control: no-cache
Location: https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Network/locations/westcentralus/operationResults/8a1167b7-6768-4ac1-85dc-703c9c9b9247?api-version=2016-03-30
Server: Microsoft-HTTPAPI/2.0; Microsoft-HTTPAPI/2.0
x-ms-ratelimit-remaining-subscription-writes: 1199
x-ms-correlation-request-id: 4364d88a-bd08-422c-a716-dbb0cdc99f7b
x-ms-routing-request-id: NORTHCENTRALUS:20170112T183202Z:4364d88a-bd08-422c-a716-dbb0cdc99f7b
Date: Thu, 12 Jan 2017 18:32:01 GMT

null
```

### Query the Async Operation for completion

Use the operations URI to query for the progress of the operation as seen in the following example:

```powershell
armclient get "https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Network/locations/westcentralus/operations/843b1c31-4717-4fdd-b7a6-4c786ca9c501?api-version=2016-03-30"
```

While the operation is in progress, the response will show **InProgress** as seen in the following example:

```json
{
  "status": "InProgress"
}
```

When the operation is complete the status will change to **Succeeded**.

```json
{
  "status": "Succeeded"
}
```

The following responses are examples of a typical response returned when querying the results of troubleshooting a connection.

### Retrieve the results

Once the status returned is **Succeeded**, call a GET Method on the operationResult URI to retrieve the results.

```powershell
armclient get "https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Network/locations/westcentralus/operationResults/843b1c31-4717-4fdd-b7a6-4c786ca9c501?api-version=2016-03-30"
```

The following responses are examples of a typical response returned when querying the results of troubleshooting a connection. See [Understanding the results](#understanding-the-results) to get clarification on what the properties in the response mean.

```json
{
  "startTime": "2017-01-12T14:09:19.1215346-08:00",
  "endTime": "2017-01-12T22:09:23.747Z",
  "code": "UnHealthy",
  "results": [
    {
      "id": "PlatformInActive",
      "summary": "We are sorry, your VPN gateway is in standby mode",
      "detail": "During this time the gateway will not initiate or accept VPN connections with on premises VPN devices or other Azure VPN Gateways. This 
is a transient state while the Azure platform is being updated.",
      "recommendedActions": [
        {
          "actionText": "If the condition persists, please try resetting your Azure VPN Gateway",
          "actionUri": "https://azure.microsoft.com/en-us/documentation/articles/vpn-gateway-resetgw-classic/",
          "actionUriText": "resetting the VPN Gateway"
        },
        {
          "actionText": "If your VPN Connection isn't up and running by the expected resolution time, contact support",
          "actionUri": "http://azure.microsoft.com/support",
          "actionUriText": "contact support"
        }
      ]
    },
    {
      "id": "NoFault",
      "summary": "This VPN Connection is running normally",
      "detail": "There aren't any known Azure platform problems affecting this VPN Connection",
      "recommendedActions": [
        {
          "actionText": "If you are still experience problems with the VPN gateway, please try resetting the VPN gateway.",
          "actionUri": "https://azure.microsoft.com/en-us/documentation/articles/vpn-gateway-resetgw-classic/",
          "actionUriText": "resetting VPN gateway"
        },
        {
          "actionText": "If you are experiencing problems you believe are caused by Azure, contact support",
          "actionUri": "http://azure.microsoft.com/support",
          "actionUriText": "contact support"
        }
      ]
    }
  ]
}
```

## Understanding the results

The following is a list of the values returned with the troubleshoot API:

* **startTime** - This value is the time the troubleshoot API call started.
* **endTime** - This value is the time that the troubleshoot API call ended. 
* **code** - This value is a role up of the **results** collection.  If one item is not healthy it will return **UnHealty**.
* **results** - Results is a collection of results returned on the connection or the virtual network gateway.
    * **id** - This value is the fault Type.
    * **summary** - This value is a summary of the fault.
    * **detailed** - This value provides a detailed description of the fault.
    * **recommendedActions** - This is a collection of recommended actions to take.
      * **actionText** - This value contains the text describing what action to take.
      * **actionUri** - This value provides the URI to documentation on how to act.
      * **actionUriText** - This value is a short description of the action text.

The following table shows the different fault types (id under results from the preceding list) that are available.

|Fault Type | Gateway | Connection |
|--|--|--|
|NoFault| Yes | Yes|
|GatewayNotFound | Yes | Yes |
|PlannedMaitenance | Yes | Yes |
|UserDrivenUpdate| Yes | Yes|
|VipUnResponsive| Yes | Yes|
|PlatformInActive|Yes | No|
|ServiceNotRunning | Yes | No|
|NoConnectionsFoundForGateway|Yes| No|
|ConnectionsNotConnected| Yes | No|
|GatewayGPUUsageExceeded| Yes | No|
|ConnectionEntityNotFound|No|Yes|
|ConnectionIsMarkedDisconnected|No|Yes|
|ConnectionMarkedStandy|No|Yes|
|Authentication|No|Yes|
|PeerReachability|No|Yes|
|IkePolicyMismatch|No|Yes|
|WfpParse Error|No|Yes|

## Next Steps

If settings have been changed that stop VPN connectivity, see [Manage Network Security Groups](../virtual-network/virtual-network-manage-nsg-arm-portal.md) to track down the network security group and security rules that may be in question.