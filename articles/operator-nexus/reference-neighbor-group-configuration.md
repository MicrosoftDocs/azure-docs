---
title: Azure Operator Nexus neighbor group configuration
description: Configuration details and examples for Azure Operator Nexus neighbor groups.
author: joemarshallmsft
ms.author: joemarshall
ms.service: azure-operator-nexus
ms.topic: reference
ms.date: 02/19/2024
ms.custom: template-reference
---

# Neighbor Group Configuration Overview

A neighbor group allows you to group endpoints (either IPv4 or IPv6) under a single logical resource. A neighbor group can be used to send load-balanced filtered traffic across different probe endpoints. You can use the same Neighbor group across different Network TAPs & Network Tap rules.

## Parameters for a Neighbor Group

| Parameter  | Description | Example | Required |
|--|--|--|--|
| resource-group | The resource group that contains the neighbor group. | ResourceGroupName | True         |
| resource-name  | The name of the neighbor group. | example-Neighbor  | True         |
| location       | The Azure region that contains the neighbor group.                          | eastus            | True         |
| destination    | List of Ipv4 or Ipv6 destinations to forward traffic.                       | 10.10.10.10       | True         |

## Creating a Neighbor Group

The following command creates a neighbor group:

```azurecli
az networkfabric neighborgroup create \
    --resource-group "example-rg" \
    --location "westus3" \
    --resource-name "example-neighborgroup" \
    --destination "{ipv4Addresses:['10.10.10.10']}"
```

Expected output:

```
{
  "properties": {
    "networkTapIds": [
    ],
    "networkTapRuleIds": [
    ],
    "destination": {
      "ipv4Addresses": [
        "10.10.10.10",
      ]
    },
    "provisioningState": "Succeeded",
    "annotation": "annotation"
  },
  "tags": {
    "keyID": "KeyValue"
  },
  "location": "eastus",
  "id": "/subscriptions/subscriptionId/resourceGroups/example-rg/providers/Microsoft.ManagedNetworkFabric/neighborGroups/example-neighborGroup",
  "name": "example-neighborGroup",
  "type": "microsoft.managednetworkfabric/neighborGroups",
  "systemData": {
    "createdBy": "user@mail.com",
    "createdByType": "User",
    "createdAt": "2023-05-23T05:49:59.193Z",
    "lastModifiedBy": "email@address.com",
    "lastModifiedByType": "User",
    "lastModifiedAt": "2023-05-23T05:49:59.194Z"
  }
}
```


## Show a Neighbor Group

This command displays an IP extended community resource:

```azcli
az networkfabric neighborgroup show \
    --resource-group "example-rg" \
    --resource-name "example-neighborgroup"
```

Expected output:

```
{
  "properties": {
    "networkTapIds": [
    ],
    "networkTapRuleIds": [
    ],
    "destination": {
      "ipv4Addresses": [
        "10.10.10.10",
      ]
    },
    "provisioningState": "Succeeded",
    "annotation": "annotation"
  },
  "tags": {
    "keyID": "KeyValue"
  },
  "location": "eastus",
  "id": "/subscriptions/subscriptionId/resourceGroups/example-rg/providers/Microsoft.ManagedNetworkFabric/neighborGroups/example-neighborGroup",
  "name": "example-neighborGroup",
  "type": "microsoft.managednetworkfabric/neighborGroups",
  "systemData": {
    "createdBy": "user@mail.com",
    "createdByType": "User",
    "createdAt": "2023-05-23T05:49:59.193Z",
    "lastModifiedBy": "email@address.com",
    "lastModifiedByType": "User",
    "lastModifiedAt": "2023-05-23T05:49:59.194Z"
  }
}
```
