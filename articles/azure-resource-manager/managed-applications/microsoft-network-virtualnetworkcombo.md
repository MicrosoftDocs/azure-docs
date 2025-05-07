---
title: VirtualNetworkCombo UI element
description: Describes the Microsoft.Network.VirtualNetworkCombo UI element for Azure portal.
ms.topic: reference
ms.date: 06/21/2024
---

# Microsoft.Network.VirtualNetworkCombo UI element

A group of controls for selecting a new or existing virtual network.

## UI sample

When the user picks a new virtual network, the user can customize each subnet's name and address prefix. Configuring subnets is optional.

![Microsoft.Network.VirtualNetworkCombo new](./media/managed-application-elements/microsoft-network-virtualnetworkcombo-new.png)

When the user picks an existing virtual network, the user must map each subnet the deployment template requires to an existing subnet. Configuring subnets in this case is required.

![Microsoft.Network.VirtualNetworkCombo existing](./media/managed-application-elements/microsoft-network-virtualnetworkcombo-existing.png)

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

## Sample output

```json
{
  "name": "vnet01",
  "resourceGroup": "demoRG",
  "addressPrefixes": [
    "10.0.0.0/16"
  ],
  "addressPrefix": "10.0.0.0/16",
  "newOrExisting": "new",
  "subnets": {
    "subnet1": {
      "name": "subnet-1",
      "addressPrefix": "10.0.0.0/24",
      "startAddress": "10.0.0.4"
    },
    "subnet2": {
      "name": "subnet-2",
      "addressPrefix": "10.0.1.0/26",
      "startAddress": "10.0.1.4"
    }
  }
}
```

## Remarks

- If specified, the first nonoverlapping address prefix of size `defaultValue.addressPrefixSize` is determined automatically based on the existing virtual networks in the user's subscription.
- The default value for `defaultValue.name` and `defaultValue.addressPrefixSize` is `null`.
- `constraints.minAddressPrefixSize` must be specified. Any existing virtual networks with an address space smaller than the specified value are unavailable for selection.
- `subnets` must be specified, and `constraints.minAddressPrefixSize` must be specified for each subnet.
- When you create a new virtual network, each subnet's address prefix is calculated automatically based on the virtual network's address prefix and the respective `addressPrefixSize`.
- When you use an existing virtual network, any subnets smaller than the respective `constraints.minAddressPrefixSize` are unavailable for selection. Additionally, if specified, subnets that don't have at least `minAddressCount` available addresses are unavailable for selection. The default value is **0**. To ensure that the available addresses are contiguous, specify `true` for `requireContiguousAddresses`. The default value is `true`.
- Creating subnets in an existing virtual network isn't supported.
- If `options.hideExisting` is `true`, the user can't choose an existing virtual network. The default value is `false`.

## Next steps

- For an introduction to creating UI definitions, see [Getting started with CreateUiDefinition](create-uidefinition-overview.md).
- For a description of common properties in UI elements, see [CreateUiDefinition elements](create-uidefinition-elements.md).
