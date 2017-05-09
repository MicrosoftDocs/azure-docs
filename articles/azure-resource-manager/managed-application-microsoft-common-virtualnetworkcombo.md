---
title: Azure Managed Application VirtualNetworkCombo UI element | Microsoft Docs
description: Describes the Microsoft.Network.VirtualNetworkCombo UI element for Azure Managed Applications
services: azure-resource-manager
documentationcenter: na
author: tabrezm
manager: timlt
editor: tysonn

ms.service: azure-resource-manager
ms.devlang: na
ms.topic: reference
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/09/2017
ms.author: tabrezm;tomfitz

---
# Microsoft.Network.VirtualNetworkCombo UI element
A group of controls for selecting a new or existing virtual network.

## UI sample
![Microsoft.Network.VirtualNetworkCombo](./media/managed-application-elements/microsoft.network.virtualnetworkcombo.png)

- In the top wireframe, the user has picked a new virtual network, so they will
have the ability to customize each subnet's name and address prefix. Configuring
subnets in this case is optional.
- In the bottom wireframe, the user has picked an existing virtual network, so
they will have to map each subnet the deployment template requires to an
existing subnet. Configuring subnets in this case is required.

## Schema
```json
{
  "name": "element1",
  "type": "Microsoft.Network.VirtualNetworkCombo",
  "label": {
    "virtualNetwork": "Virtual network",
    "subnets": "Subnets"
  },
  "toolTip": {
    "virtualNetwork": "",
    "subnets": ""
  },
  "defaultValue": {
    "name": "vnet01",
    "addressPrefixSize": "/16"
  },
  "constraints": {
    "minAddressPrefixSize": "/16"
  },
  "options": {
    "hideExisting": false
  },
  "subnets": {
    "subnet1": {
      "label": "First subnet",
      "defaultValue": {
        "name": "subnet-1",
        "addressPrefixSize": "/24"
      },
      "constraints": {
        "minAddressPrefixSize": "/24",
        "minAddressCount": 12,
        "requireContiguousAddresses": true
      }
    },
    "subnet2": {
      "label": "Second subnet",
      "defaultValue": {
        "name": "subnet-2",
        "addressPrefixSize": "/26"
      },
      "constraints": {
        "minAddressPrefixSize": "/26",
        "minAddressCount": 8,
        "requireContiguousAddresses": true
      }
    }
  },
  "visible": true
}
```

## Remarks
- If specified, the first non-overlapping address prefix of size
`defaultValue.addressPrefixSize` will be determined automatically based on the
existing virtual networks in the user's subscription.
- The default value for `defaultValue.name` and `defaultValue.addressPrefixSize`
is `null`.
- `constraints.minAddressPrefixSize` must be specified, and any existing virtual
networks with an address space smaller than `constraints.minAddressPrefixSize`
will be made unavailable for selection.
- `subnets` must be specified, and `constraints.minAddressPrefixSize` must be
specified for each subnet.
- When creating a new virtual network, each subnet's address prefix is
calculated automatically based on the virtual network's address prefix and the
respective `addressPrefixSize`.
- When using an existing virtual network, any subnets smaller than the
respective `constraints.minAddressPrefixSize` will be made unavailable for
selection. Additionally, if specified, subnets that do not contain at least
`minAddressCount` available addresses will be made unavailable for selection;
the default value is `0`. To ensure that the available addresses are contiguous,
specify `true` for `requireContiguousAddresses`; the default value is `true`.
- Creating new subnets in an existing virtual network is not supported.
- If `options.hideExisting` is true, then the user won't be able to choose an
existing virtual network. The default value is `false`.

## Output
```json
{
  "name": "vnet01",
  "resourceGroup": "rg01",
  "addressPrefixes": ["10.0.0.0/16"],
  "newOrExisting": "new",
  "subnets": {
    "subnet1": {
      "name": "subnet-1",
      "addressPrefix": "10.0.0.0/24",
      "startAddress": "10.0.0.1"
    },
    "subnet2": {
      "name": "subnet-2",
      "addressPrefix": "10.0.1.0/26",
      "startAddress": "10.0.1.1"
    }
  }
}
```

## Next Steps
* For an introduction to Azure Resource Manager, see [Azure Resource Manager overview](resource-group-overview.md).
