---
title: Template functions - CIDR
description: Describes the functions to use in an Azure Resource Manager template (ARM template) to manipulate IP addresses and create IP address ranges.
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 07/14/2023
---

# CIDR functions for ARM templates

This article describes the functions for working with CIDR in your Azure Resource Manager template (ARM template).

> [!TIP]
> We recommend [Bicep](../bicep/overview.md) because it offers the same capabilities as ARM templates and the syntax is easier to use. To learn more, see [cidr](../bicep/bicep-functions-cidr.md) functions.

## parseCidr

`parseCidr(network)`

Parses an IP address range in CIDR notation to get various properties of the address range.

In Bicep, use the [parseCidr](../bicep/bicep-functions-cidr.md#parsecidr) function.

### Parameters

| Parameter | Required | Type | Description |
|:-|:-|:-|:-|
| network | Yes | string | String in CIDR notation containing an IP address range to be converted. |

### Return value

An object that contains various properties of the address range.

### Examples

The following example parses an IPv4 CIDR string:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [],
  "outputs": {
    "v4info": {
      "type": "object",
      "value": "[parseCidr('10.144.0.0/20')]"
    }
  }
}
```

The preceding example returns the following object:

```json
{
  "network":"10.144.0.0",
  "netmask":"255.255.240.0",
  "broadcast":"10.144.15.255",
  "firstUsable":"10.144.0.1",
  "lastUsable":"10.144.15.254",
  "cidr":20
}
```

The following example parses an IPv6 CIDR string:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [],
  "outputs": {
    "v6info": {
      "type": "object",
      "value": "[parseCidr('fdad:3236:5555::/48')]"
    }
  }
}
```

The preceding example returns the following object:

```json
{
  "network":"fdad:3236:5555::",
  "netmask":"ffff:ffff:ffff::",
  "firstUsable":"fdad:3236:5555::",
  "lastUsable":"fdad:3236:5555:ffff:ffff:ffff:ffff:ffff",
  "cidr":48
}
```

## cidrSubnet

`cidrSubnet(network, newCIDR, subnetIndex)`

Splits the specified IP address range in CIDR notation into subnets with a new CIDR value and returns the IP address range of the subnet with the specified index.

In Bicep, use the [cidrSubnet](../bicep/bicep-functions-cidr.md#cidrsubnet) function.

### Parameters

| Parameter | Required | Type | Description |
|:-|:-|:-|:-|
| network | Yes | string | String containing an IP address range to convert in CIDR notation. |
| newCIDR | Yes | int | An integer representing the CIDR to be used to subnet. This value should be equal or larger than the CIDR value in the `network` parameter. |
| subnetIndex | Yes | int | Index of the desired subnet IP address range to return. |

### Return value

A string of the IP address range of the subnet with the specified index.

### Examples

The following example calculates the first five /24 subnet ranges from the specified /20:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [],
  "outputs": {
    "v4subnets": {
      "type": "array",
      "copy": {
        "count": "[length(range(0, 5))]",
        "input": "[cidrSubnet('10.144.0.0/20', 24, range(0, 5)[copyIndex()])]"
      }
    }
  }
}
```

The preceding example returns the following array:

```json
[
  "10.144.0.0/24",
  "10.144.1.0/24",
  "10.144.2.0/24",
  "10.144.3.0/24",
  "10.144.4.0/24"
]
```

The following example calculates the first five /52 subnet ranges from the specified /48:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [],
  "outputs": {
    "v6subnets": {
      "type": "array",
      "copy": {
        "count": "[length(range(0, 5))]",
        "input": "[cidrSubnet('fdad:3236:5555::/48', 52, range(0, 5)[copyIndex()])]"
      }
    }
  }
}
```

The preceding example returns the following array:

```json
[
  "fdad:3236:5555::/52"
  "fdad:3236:5555:1000::/52"
  "fdad:3236:5555:2000::/52"
  "fdad:3236:5555:3000::/52"
  "fdad:3236:5555:4000::/52"
]
```

## cidrHost

`cidrHost(network, hostIndex)`

Calculates the usable IP address of the host with the specified index on the specified IP address range in CIDR notation. For example, in the case of `192.168.1.0/24`, there are reserved IP addresses: `192.168.1.0` serves as the network identifier address, while `192.168.1.255` functions as the broadcast address. Only IP addresses ranging from `192.168.1.1` to `192.168.1.254` can be assigned to hosts, which are referred to as "usable" IP addresses. So, when the function is passed a hostIndex of `0`, `192.168.1.1` is returned.

In Bicep, use the [cidrHost](../bicep/bicep-functions-cidr.md#cidrhost) function.

### Parameters

| Parameter | Required | Type | Description |
|:-|:-|:-|:-|
| network | Yes | string | String containing an ip network to convert (must be correct networking format). |
| hostIndex | Yes | int |  The index of the host IP address to return. |

### Return value

A string of the IP address.

### Examples

The following example calculates the first five usable host IP addresses from the specified /24:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [],
  "outputs": {
    "v4hosts": {
      "type": "array",
      "copy": {
        "count": "[length(range(0, 5))]",
        "input": "[cidrHost('10.144.3.0/24', range(0, 5)[copyIndex()])]"
      }
    }
  }
}
```

The preceding example returns the following array:

```json
[
  "10.144.3.1"
  "10.144.3.2"
  "10.144.3.3"
  "10.144.3.4"
  "10.144.3.5"
]
```

The following example calculates the first five usable host IP addresses from the specified /52:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [],
  "outputs": {
    "v6hosts": {
      "type": "array",
      "copy": {
        "count": "[length(range(0, 5))]",
        "input": "[cidrHost('fdad:3236:5555:3000::/52', range(0, 5)[copyIndex()])]"
      }
    }
  }
}
```

The preceding example returns the following array:

```json
[
  "fdad:3236:5555:3000::1"
  "fdad:3236:5555:3000::2"
  "fdad:3236:5555:3000::3"
  "fdad:3236:5555:3000::4"
  "fdad:3236:5555:3000::5"
]
```

## Next steps

* For a description of the sections in an ARM template, see [Understand the structure and syntax of ARM templates](./syntax.md).
