---
title: Bicep functions - CIDR
description: Describes the functions to use in a Bicep file to manipulate IP addresses and create IP address ranges.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 06/07/2023
---

# CIDR functions for Bicep

Classless Inter-Domain Routing (CIDR) is a method of allocating IP addresses and routing Internet Protocol (IP) packets. This article describes the Bicep functions for working with CIDR.

## parseCidr

`parseCidr(network)`

Parses an IP address range in CIDR notation to get various properties of the address range.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:-|:-|:-|:-|
| network | Yes | string | String in CIDR notation containing an IP address range to be converted. |

### Return value

An object that contains various properties of the address range.

### Examples

The following example parses an IPv4 CIDR string:

```bicep
output v4info object = parseCidr('10.144.0.0/20')
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

```bicep
output v6info object = parseCidr('fdad:3236:5555::/48')
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

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

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

```bicep
output v4subnets array = [for i in range(0, 5): cidrSubnet('10.144.0.0/20', 24, i)]
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

```bicep
output v6subnets array = [for i in range(0, 5): cidrSubnet('fdad:3236:5555::/48', 52, i)]
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

Calculates the usable IP address of the host with the specified index on the specified IP address range in CIDR notation. For example, in the case of `192.168.1.0/24`, there are reserved IP addresses:

- `192.168.1.0` : Network address.
- `192.168.1.1` : Reserved by Azure for the default gateway.
- `192.168.1.2`, `192.168.1.3` : Reserved by Azure to map the Azure DNS IPs to the VNet space.
- `192.168.1.255` : Network broadcast address.

Only IP addresses ranging from `192.168.1.4` to `192.168.1.254` can be assigned to hosts, which we refer to as "usable" IP addresses. So, when the function is passed a hostIndex of `0`, `192.168.1.4` is returned.

> [!NOTE]
> The function currently returns "192.168.1.1" as the first usable IP address for the preceding example. Until the function is fixed, you can use the following alternative: "cidrHost('192.168.1.0/24', 0+3)" to obtain the desired result.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:-|:-|:-|:-|
| network | Yes | string | String containing an ip network to convert (must be correct networking format). |
| hostIndex | Yes | int |  The index of the host IP address to return. |

### Return value

A string of the IP address.

### Examples

The following example calculates the first five usable host IP addresses from the specified /24:

```bicep
output v4hosts array = [for i in range(0+3, 5): cidrHost('10.144.3.0/24', i)]
```

The preceding example returns the following array:

```json
[
  "10.144.3.4"
  "10.144.3.5"
  "10.144.3.6"
  "10.144.3.7"
  "10.144.3.8"
]
```

The following example calculates the first five usable host IP addresses from the specified /52:

```bicep
output v6hosts array = [for i in range(0+3, 5): cidrHost('fdad:3236:5555:3000::/52', i)]
```

The preceding example returns the following array:

```json
[
  "fdad:3236:5555:3000::4"
  "fdad:3236:5555:3000::5"
  "fdad:3236:5555:3000::6"
  "fdad:3236:5555:3000::7"
  "fdad:3236:5555:3000::8"
]
```

## Next steps

* For a description of the sections in a Bicep file, see [Understand the structure and syntax of Bicep files](./file.md).
