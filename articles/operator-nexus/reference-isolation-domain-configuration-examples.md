---
title: Azure Operator Nexus Isolation Domain configuration examples
description: Isolation domain configuration examples.
author: joemarshallmsft
ms.author: joemarshall
ms.reviewer: jdasari
ms.date: 02/02/2024
ms.service: azure-operator-nexus
ms.custom: devx-track-azurecli
ms.topic: reference
---

# Configuration examples for creating an isolation domain

This article gives examples of how to configure isolation domains in various scenarios.

## Create an L2 isolation domain

In this example, we create a layer 2 isolation domain with the following properties:

- Name: `l2domain1`
- Resource group: `rg1`
- Location: `eastus`
- Network fabric ID: `nf1`
- VLAN ID: 600

**Command**:

```azurecli
az networkfabric l2domain create \
--resource-group rg1 \
--name l2domain1 \
--location eastus \
--network-fabric-id nf1 \
--vlan-id 600
```

**Expected output:**

```
{
"administrativeState": "Enabled",
"id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/rg1/providers/Microsoft.ManagedNetworkFabric/l2IsolationDomains/l2domain1",
"name": "l2domain1",
"networkFabricId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/NetworkFabrics/nf1",
"provisioningState": "Succeeded",
"resourceGroup": "rg1",
"systemData": {
"createdAt": "2023-XX-XXT12:34:56.789012+00:00",
"createdBy": "email@address.com",
"createdByType": "User",
"lastModifiedAt": "2023-XX-XXT12:34:56.789012+00:00",
"lastModifiedBy": "email@address.com",
"lastModifiedByType": "User"
},
"type": "microsoft.managednetworkfabric/l2isolationdomains",[^2^][2]
"vlanId": 600
}
```

## Create an L3 isolation domain.

To create an L3 isolation domain, you can follow these steps:

-   Use the `az networkfabric l3domain create` command to create an L3 isolation domain. You must specify the required parameters:

    - Resource group
    - Resource name
    - Location
    - Network fabric ID.

    You can also specify optional parameters, such as:
    - Redistribute connected subnets
    - Redistribute static routes
    - Aggregate route configuration
    - Connected subnet route policy.

-   Use the `az networkfabric internalnetwork create` command to create one or more internal networks for the L3 isolation domain. You need to provide:

    - The VLAN ID
    - Connected IPv4 or IPv6 subnets
    - BGP configuration for each internal network.

    You can also specify optional parameters, such as:

    - MTU
    - Static route configuration
    - Extension.

-   Use the `az networkfabric externalnetwork create` command to create an external network for the L3 isolation domain. You need to choose the peering option (Option A or Option B) and provide the corresponding properties, such as peer ASN, VLAN ID, primary and secondary IPv4 or IPv6 prefixes, and route targets.

-   Use the `az networkfabric l3domain update-admin-state` command to enable the L3 isolation domain. You must enable the isolation domain to push the configuration to the network fabric devices.

**Example** :

In this example, we create an L3 isolation domain with the following properties:

- Name: `example-l3domain`
- Network fabric ID `/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/NetworkFabrics/NFName`.

**Command:**

```azurecli
az networkfabric l3domain create \
--resource-group "ResourceGroupName" \
--resource-name "example-l3domain" \
--location "eastus" \
--nf-id "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/NetworkFabrics/NFName"
```

## Create an Internal Network

In this example, we create an internal network with the following properties:

- VLAN ID: 1001
- IPv4 subnet: 10.0.0.0/24
- L3 isolation domain name: `example-l3domain`

**Command:**

```azurecli
az networkfabric internalnetwork create \
--resource-group "ResourceGroupName" \
--l3-isolation-domain-name "example-l3domain" \
--resource-name "example-internalnetwork" \
--vlan-id 1001 \
--connected-ipv4-subnets '[{"prefix":"10.0.0.0/24"}]' \
--mtu 1500
```

This similar example uses an IPv6 address instead of IPv4:

```azurecli
az networkfabric internalnetwork create \
--resource-group "ResourceGroupName" \
--l3-isolation-domain-name "example-l3domain" \
--resource-name "example-internalnetwork" \
--vlan-id 1002 \
--connected-ipv6-subnets '[{"prefix":"10:101:1::0/64"}]' \
--mtu 1500
```

In this example, we add BGP configuration:

```azurecli
az networkfabric internalnetwork create \
--resource-group "ResourceGroupName" \
--l3-isolation-domain-name "example-l3domain" \
--resource-name "example-internalnetwork" \
--vlan-id 1003 \
--connected-ipv4-subnets '[{"prefix":"10.1.2.0/24"}]' \
--mtu 1500 \
--bgp-configuration '{"defaultRouteOriginate": "True", "allowAS": 2, "allowASOverride": "Enable", "PeerASN": 65535, "ipv4ListenRangePrefixes": ["10.1.2.0/28"]}'
```

## Creating External Networks

This example creates an external network using Option B with IPv4 and IPv6 route targets

**Command:**

```azurecli
az networkfabric externalnetwork create \
--resource-group "ResourceGroupName" \
--l3domain "example-l3domain" \
--resource-name "example-externalnetwork" \
--peering-option "OptionB" \
--option-b-properties "{routeTargets:{exportIpv4RouteTargets:['65045:2001'],importIpv4RouteTargets:['65045:2001'],exportIpv6RouteTargets:['65045:2002'],importIpv6RouteTargets:['65045:2002']}}"
```

**Expected output:**

```
{
"administrativeState": "Enabled",
"id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/l3IsolationDomains/example-l3domain/externalNetworks/example-externalnetwork",
"name": "example-externalnetwork",
"optionBProperties": {
"exportRouteTargets": [
"65045:2001",
"65045:2002"
],
"importRouteTargets": [
"65045:2001",
"65045:2002"
],
"routeTargets": {
"exportIpv4RouteTargets": [
"65045:2001"
],
"importIpv4RouteTargets": [
"65045:2001"
],
"exportIpv6RouteTargets": [
"65045:2002"
\,
"importIpv6RouteTargets": [
"65045:2002"
]
}
},
"peeringOption": "OptionB",
"provisioningState": "Succeeded",
"resourceGroup": "ResourceGroupName",
"systemData": {
"createdAt": "2023-XX-XXT15:45:31.938216+00:00",
"createdBy": "email@address.com",
"createdByType": "User",
"lastModifiedAt": "2023-XX-XXT15:45:31.938216+00:00",
"lastModifiedBy": "email@address.com",
"lastModifiedByType": "User"
},
"type": "microsoft.managednetworkfabric/l3isolationdomains/externalnetworks"
}
```

This example creates an external network using Option A with IPv4 and IPv6 prefixes:

```azurecli
az networkfabric externalnetwork create \
--resource-group "ResourceGroupName" \
--l3domain "example-l3domain" \
--resource-name "example-externalnetwork" \
--peering-option "OptionA" \
--option-a-properties '{"peerASN": 65026,"vlanId": 2423, "mtu": 1500, "primaryIpv4Prefix": "10.18.0.148/30", "secondaryIpv4Prefix": "10.18.0.152/30", "primaryIpv6Prefix": "fda0:d59c:da16::/127", "secondaryIpv6Prefix": "fda0:d59c:da17::/127"}'
```

**Expected output:**

```
{
"administrativeState": "Enabled",
"id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/ResourceGroupName/providers/Microsoft.ManagedNetworkFabric/l3IsolationDomains/example-l3domain/externalNetworks/example-externalnetwork",
"name": "example-externalnetwork",
"optionAProperties": {
"fabricASN": 65050,
"mtu": 1500,
"peerASN": 65026,
"primaryIpv4Prefix": "10.18.0.148/30",
"secondaryIpv4Prefix": "10.18.0.152/30",
"primaryIpv6Prefix": "fda0:d59c:da16::/127",
"secondaryIpv6Prefix": "fda0:d59c:da17::/127",
"vlanId": 2423
},
"peeringOption": "OptionA",
"provisioningState": "Succeeded",
"resourceGroup": "ResourceGroupName",
"systemData": {
"createdAt": "2023-XX-XXT09:54:00.4244793Z",
"createdAt": "2023-XX-XXT07:23:54.396679+00:00",
"createdBy": "email@address.com",
"lastModifiedAt": "2023-XX-XX1T07:23:54.396679+00:00",
"lastModifiedBy": "email@address.com",
"lastModifiedByType": "User"
},
"type": "microsoft.managednetworkfabric/l3isolationdomains/externalnetworks"
}
```
