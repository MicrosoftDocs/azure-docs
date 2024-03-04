---
title: "Azure Operator Nexus: Configure L2 and L3 isolation domains"
description: Learn commands to create, view, list, update, and delete Layer 2 and Layer 3 isolation domains in Azure Operator Nexus instances.
author: jdasari
ms.author: jdasari
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 04/02/2023
ms.custom: template-how-to, devx-track-azurecli
---

# Configure L2 and L3 isolation domains by using a managed network fabric

For Azure Operator Nexus instances, isolation domains enable communication between workloads hosted on the same rack (intra-rack communication) or different racks (inter-rack communication). This article describes how you can manage Layer 2 (L2) and Layer 3 (L3) isolation domains by using the Azure CLI. You can use the commands in this article to create, update, delete, and check the status of L2 and L3 isolation domains.

## Prerequisites

1. Ensure that a network fabric controller (NFC) and a network fabric have been created.
1. Install the latest version of the
[Azure CLI extension for managed network fabric](./howto-install-cli-extensions.md).
1. Use the following command to sign in to your Azure account and set the subscription to your Azure subscription ID. This should be the same subscription ID that you use for all the resources in an Azure Operator Nexus instance.

   ```azurecli
       az login
       az account set --subscription ********-****-****-****-*********
   ```

1. Register providers for a managed network fabric:
   1. In the Azure CLI, enter the command `az provider register --namespace Microsoft.ManagedNetworkFabric`.

   1. Monitor the registration process by using the command `az provider show -n Microsoft.ManagedNetworkFabric -o table`.

      Registration can take up to 10 minutes. When it's finished, `RegistrationState` in the output changes to `Registered`.

Isolation domains are used to enable Layer 2 or Layer 3 connectivity between workloads hosted across the Azure Operator Nexus instance and external networks.

> [!NOTE]
> Azure Operator Nexus reserves VLANs up to 500 for platform use. You can't use VLANs in this range for your (tenant) workload networks. You should use VLAN values from 501 through 4095.

## Configure L2 isolation domains

You use an L2 isolation domain to establish Layer 2 connectivity between workloads running on Azure Operator Nexus compute nodes.

The following parameters are available for configuring isolation domains.

| Parameter|Description|Example|Required|
|---|---|---|---|
|`resource-group`	|Resource group name specifically for the isolation domain of your choice.|`ResourceGroupName`|True
|`resource-name`	|Resource name of the L2 isolation domain.|`example-l2domain`| True
|`location`|Azure Operator Nexus region used during NFC creation.|`eastus`| True
|`nf-Id`	|Network fabric ID.|`/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFresourcegroupname/providers/Microsoft.ManagedNetworkFabric/NetworkFabrics/NFname`| True
|`Vlan-id` | VLAN identifier value. VLANs 1 to 500 are reserved and can't be used. The VLAN identifier value can't be changed after you specify it. You must delete and re-create the isolation domain if you need to modify the VLAN identifier value. The range is `501` to `4095`.|`501`| True
|`mtu` | Maximum transmission unit. If you don't specify a value, the default is `1500`.|`1500`|
|`administrativeState`|	Administrative state of the isolation domain, which you can enable or disable.|`Enable`|
| `subscriptionId`      | Azure subscription ID for your Azure Operator Nexus instance. |
| `provisioningState`   | Provisioning state. |

### Create an L2 isolation domain

Use the following commands to create an L2 isolation domain:

```azurecli
az networkfabric l2domain create \
--resource-group "ResourceGroupName" \
--resource-name "example-l2domain" \
--location "eastus" \
--nf-id "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/NetworkFabrics/NFname" \
--vlan-id  750\
--mtu 1501
```

Expected output:

```output
{
  "administrativeState": "Disabled",
  "annotation": null,user
  "disabledOnResources": null,
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/ResourceGroupName/providers/Microsoft.ManagedNetworkFabric/l2IsolationDomains/example-l2domain",
  "location": "eastus",
  "mtu": 1501,
  "name": "example-l2domain",
  "networkFabricId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/NFresourceGroups/resourcegroupname/providers/Microsoft.ManagedNetworkFabric/networkFabrics/NFName",
  "provisioningState": "Succeeded",
  "resourceGroup": "ResourceGroupName",
  "systemData": {
    "createdAt": "2023-XX-XXT14:57:59.167177+00:00",
    "createdBy": "email@address.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-XX-XXT14:57:59.167177+00:00",
    "lastModifiedBy": "email@address.com",
    "lastModifiedByType": "User"
  },
  "tags": null,
  "type": "microsoft.managednetworkfabric/l2isolationdomains",
  "vlanId": 750
}
```

### Show L2 isolation domains

This command shows details about L2 isolation domains, including their administrative states:

```azurecli
az networkfabric l2domain show --resource-group "ResourceGroupName" --resource-name "example-l2domain"
```

Expected output:

```output
{
  "administrativeState": "Disabled",
  "annotation": null,
  "disabledOnResources": null,
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/ResourceGroupName/providers/Microsoft.ManagedNetworkFabric/l2IsolationDomains/example-l2domain",
  "location": "eastus",
  "mtu": 1501,
  "name": "example-l2domain",
  "networkFabricId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkFabrics/NFName",
  "provisioningState": "Succeeded",
  "resourceGroup": "ResourceGroupName",
  "systemData": {
    "createdAt": "2023-XX-XXT14:57:59.167177+00:00",
    "createdBy": "email@address.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-XX-XXT14:57:59.167177+00:00",
    "lastModifiedBy": "email@address.com",
    "lastModifiedByType": "User"
  },
  "tags": null,
  "type": "microsoft.managednetworkfabric/l2isolationdomains",
  "vlanId": 750
}
```

### List all L2 isolation domains

This command lists all L2 isolation domains available in a resource group:

```azurecli
az networkfabric l2domain list --resource-group "ResourceGroupName"
```

Expected output:

```output
 {
    "administrativeState": "Enabled",
    "annotation": null,
    "disabledOnResources": null,
    "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/ResourceGroupName/providers/Microsoft.ManagedNetworkFabric/l2IsolationDomains/example-l2domain",
    "location": "eastus",
    "mtu": 1501,
    "name": "example-l2domain",
    "networkFabricId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxxxxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkFabrics/NFName",
    "provisioningState": "Succeeded",
    "resourceGroup": "ResourceGroupName",
    "systemData": {
      "createdAt": "2022-XX-XXT22:26:33.065672+00:00",
      "createdBy": "email@address.com",
      "createdByType": "User",
      "lastModifiedAt": "2022-XX-XXT14:46:45.753165+00:00",
      "lastModifiedBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
      "lastModifiedByType": "Application"
    },
    "tags": null,
    "type": "microsoft.managednetworkfabric/l2isolationdomains",
    "vlanId": 750
  }
```

### Change the administrative state of an L2 isolation domain

You must enable an isolation domain to push the configuration to the network fabric devices. Use the following command to change the administrative state of an isolation domain:

```azurecli
az networkfabric l2domain update-admin-state --resource-group "ResourceGroupName" --resource-name "example-l2domain" --state Enable/Disable
```

Expected output:

```output
{
  "administrativeState": "Enabled",
  "annotation": null,
  "disabledOnResources": null,
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/ResourceGroupName/providers/Microsoft.ManagedNetworkFabric/l2IsolationDomains/example-l2domain",
  "location": "eastus",
  "mtu": 1501,
  "name": "example-l2domain",
  "networkFabricId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkFabrics/NFName",
  "provisioningState": "Succeeded",
  "resourceGroup": "ResourceGroupName",
  "systemData": {
    "createdAt": "2023-XX-XXT14:57:59.167177+00:00",
    "createdBy": "email@address.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-XX-XXT14:57:59.167177+00:00",
    "lastModifiedBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
    "lastModifiedByType": "Application"
  },
  "tags": null,
  "type": "microsoft.managednetworkfabric/l2isolationdomains",
  "vlanId": 501
}
```

### Delete an L2 isolation domain

Use this command to delete an L2 isolation domain:

```azurecli
az networkfabric l2domain delete --resource-group "ResourceGroupName" --resource-name "example-l2domain"
```

Expected output:

```output
Please use show or list command to validate that the isolation domain is deleted. Deleted resources will not appear in the output
```

## Configure L3 isolation domains

A Layer 3 isolation domain enables L3 connectivity between workloads running on Azure Operator Nexus compute nodes. The L3 isolation domain enables the workloads to exchange L3 information with network fabric devices.

A Layer 3 isolation domain has two components:

- An *internal network* defines Layer 3 connectivity between network fabrics running on Azure Operator Nexus compute nodes and an optional external network. You must create at least one internal network.
- An *external network* provides connectivity between the internet and internal networks via your private endpoints.

An L3 isolation domain enables deploying workloads that advertise service IPs to the fabric via BGP.

An L3 isolation domain has two ASNs:

- The *fabric ASN* is the ASN of the network devices on the fabric. It's specified while you're creating the network fabric.
- The *peer ASN* is the ASN of the network functions in Azure Operator Nexus. It can't be the same as the fabric ASN.

The workflow for a successful provisioning of an L3 isolation domain is as follows:

1. Create an L3 isolation domain.
1. Create one or more internal networks.
1. Enable an L3 isolation domain.

To make changes to the L3 isolation domain, first disable it (administrative state). Re-enable the L3 isolation domain (administrative state) after you finish the changes.

The procedure to show, enable/disable, and delete IPv6-based isolation domains is the same as the one that you use for IPv4. The VLAN range for creating an isolation domain is 501 to 4095.

The following parameters are available for configuring L3 isolation domains.

| Parameter|Description|Example|Required|
|---|---|---|---|
|`resource-group`	|Resource group name specifically for the isolation domain of your choice|`ResourceGroupName`|True|
|`resource-name`	|Resource name of the L3 isolation domain|`example-l3domain`|True|
|`location`|Azure Operator Nexus region used during NFC creation|`eastus`|True|
|`nf-Id`	|Azure subscription ID used during NFC creation|`/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/NetworkFabrics/NFName`| True|

The following parameters for isolation domains are optional.

| Parameter|Description|Example|Required|
|---|---|---|---|
| `redistributeConnectedSubnet` | Advertised connected subnets, which can have a value of `True` or `False`. The default value is `True`. |`True` |      |
| `redistributeStaticRoutes`  |Advertised static routes, which can have a value of `True` or `False`. The default value is `False`. | `False`       | |
| `aggregateRouteConfiguration`|List of IPv4 and IPv6 route configurations.  |     |   | 

### Create an L3 isolation domain

Use this command to create an L3 isolation domain:

```azurecli
az networkfabric l3domain create 
--resource-group "ResourceGroupName" 
--resource-name "example-l3domain"
--location "eastus" 
--nf-id "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/NetworkFabrics/NFName"
```

> [!NOTE]
> For MPLS Option B connectivity to external networks via private endpoint devices, you can specify Option B parameters while creating an isolation domain.

Expected output:

```output
{
  "administrativeState": "Disabled",
  "aggregateRouteConfiguration": null,
  "annotation": null,
  "connectedSubnetRoutePolicy": null,
  "description": null,
  "disabledOnResources": null,
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/ResourceGroupName/providers/Microsoft.ManagedNetworkFabric/l3IsolationDomains/example-l3domain",
  "location": "eastus",
  "name": "example-l3domain",
  "networkFabricId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/NFresourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkFabrics/NFName",
  "optionBDisabledOnResources": null,
  "provisioningState": "Accepted",
  "redistributeConnectedSubnets": "True",
  "redistributeStaticRoutes": "False",
  "resourceGroup": "ResourceGroupName",
  "systemData": {
    "createdAt": "2022-XX-XXT06:23:43.372461+00:00",
    "createdBy": "email@example.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-XX-XXT09:40:38.815959+00:00",
    "lastModifiedBy": "email@example.com",
    "lastModifiedByType": "User"
  },
  "tags": null,
  "type": "microsoft.managednetworkfabric/l3isolationdomains"
}
```

#### Create an untrusted L3 isolation domain

```azurecli
az networkfabric l3domain create --resource-group "ResourceGroupName" --resource-name "l3untrust" --location "eastus" --nf-id "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkFabrics/NFName" 
```

#### Create a trusted L3 isolation domain

```azurecli
az networkfabric l3domain create --resource-group "ResourceGroupName" --resource-name "l3trust" --location "eastus" --nf-id "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkFabrics/NFName"
```

#### Create a management L3 isolation domain

```azurecli
az networkfabric l3domain create --resource-group "ResourceGroupName" --resource-name "l3mgmt" --location "eastus" --nf-id "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkFabrics/NFName"
```

### Show L3 isolation domains

This command shows details about L3 isolation domains, including their administrative states:

```azurecli
az networkfabric l3domain show --resource-group "ResourceGroupName" --resource-name "example-l3domain"
```

Expected output:

```output
{
  "administrativeState": "Disabled",
  "aggregateRouteConfiguration": null,
  "annotation": null,
  "connectedSubnetRoutePolicy": null,
  "description": null,
  "disabledOnResources": null,
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/ResourceGroupName/providers/Microsoft.ManagedNetworkFabric/l3IsolationDomains/example-l3domain",
  "location": "eastus",
  "name": "example-l3domain",
  "networkFabricId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/NFresourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkFabrics/NFName",
  "optionBDisabledOnResources": null,
  "provisioningState": "Succeeded",
  "redistributeConnectedSubnets": "True",
  "redistributeStaticRoutes": "False",
  "resourceGroup": "ResourceGroupName",
  "systemData": {
    "createdAt": "2023-XX-XXT09:40:38.815959+00:00",
    "createdBy": "email@example.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-XX-XXT09:40:46.923037+00:00",
    "lastModifiedBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
    "lastModifiedByType": "Application"
  },
  "tags": null,
  "type": "microsoft.managednetworkfabric/l3isolationdomains"
}
```

### List all L3 isolation domains

Use this command to get a list of all L3 isolation domains available in a resource group:

```azurecli
az networkfabric l3domain list --resource-group "ResourceGroupName"
```

Expected output:

```output
{
  "administrativeState": "Disabled",
  "aggregateRouteConfiguration": null,
  "annotation": null,
  "connectedSubnetRoutePolicy": null,
  "description": null,
  "disabledOnResources": null,
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/ResourceGroupName/providers/Microsoft.ManagedNetworkFabric/l3IsolationDomains/example-l3domain",
  "location": "eastus",
  "name": "example-l3domain",
  "networkFabricId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/NFresourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkFabrics/NFName",
  "optionBDisabledOnResources": null,
  "provisioningState": "Succeeded",
  "redistributeConnectedSubnets": "True",
  "redistributeStaticRoutes": "False",
  "resourceGroup": "ResourceGroupName",
  "systemData": {
    "createdAt": "2023-XX-XXT09:40:38.815959+00:00",
    "createdBy": "email@example.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-XX-XXT09:40:46.923037+00:00",
    "lastModifiedBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
    "lastModifiedByType": "Application"
  },
  "tags": null,
  "type": "microsoft.managednetworkfabric/l3isolationdomains"
}
```

### Change the administrative state of an L3 isolation domain

Use the following command to change the administrative state of an L3 isolation domain to enabled or disabled:

```azurecli
az networkfabric l3domain update-admin-state --resource-group "ResourceGroupName" --resource-name "example-l3domain" --state Enable/Disable
```

Expected output:

```output
{
    "administrativeState": "Enabled",
    "annotation": null,
    "description": null,
    "disabledOnResources": null,
    "external": null,
    "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/ResourceGroupName/providers/Microsoft.ManagedNetworkFabric/l3IsolationDomains/example-l3domain",
    "internal": null,
    "location": "eastus",
    "name": "example-l3domain",
    "networkFabricId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/NFresourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkFabrics/NFName",
    "optionBDisabledOnResources": null,
    "provisioningState": "Succeeded",
    "resourceGroup": "NFResourceGroupName",
    "systemData": {
      "createdAt": "2022-XX-XXT06:23:43.372461+00:00",
      "createdBy": "email@address.com",
      "createdByType": "User",
      "lastModifiedAt": "2022-XX-XXT06:25:53.240975+00:00",
      "lastModifiedBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
      "lastModifiedByType": "Application"
    },
    "tags": null,
    "type": "microsoft.managednetworkfabric/l3isolationdomains"
  }
```

Use the `az show` command to verify whether the administrative state has changed to `Enabled`.

### Delete an L3 isolation domain

Use this command to delete an L3 isolation domain:

```azurecli
 az networkfabric l3domain delete --resource-group "ResourceGroupName" --resource-name "example-l3domain"
```

Use the `show` or `list` command to validate that the isolation domain has been deleted.

## Create internal networks

After you successfully create an L3 isolation domain, the next step is to create an internal network. Internal networks enable Layer 3 inter-rack and intra-rack communication between workloads by exchanging routes with the fabric. An L3 isolation domain can support multiple internal networks, each on a separate VLAN.

The following diagram represents an example network function with three internal networks: trusted, untrusted, and management. Each of the internal networks is created in its own L3 isolation domain.

:::image type="content" source="media/network-function-networking.png" alt-text="Diagram of a network function with three internal networks.":::

The IPv4 prefixes for these networks are:

- Trusted network: 10.151.1.11/24
- Management network: 10.151.2.11/24
- Untrusted network: 10.151.3.11/24

The following parameters are available for creating internal networks.

| Parameter|Description|Example|Required|
|---|---|---|---|
|`vlan-Id` |VLAN identifier with a range from 501 to 4095|`1001`|True|
|`resource-group`|Corresponding NFC resource group name| `NFCresourcegroupname` | True
|`l3-isolation-domain-name`|Resource name of the L3 isolation domain|`example-l3domain` | True
|`location`|Azure Operator Nexus region used during NFC creation|`eastus` | True

The following parameters are optional for creating internal networks.

|Parameter|Description|Example|Required|
|---|---|---|---|
|`connectedIPv4Subnets` |IPv4 subnet that the Azure Kubernetes Service hybrid (HAKS) cluster's workloads use.|`10.0.0.0/24`||
|`connectedIPv6Subnets`	|IPv6 subnet that the HAKS cluster's workloads use.|`df8:f53b:82e4::53/127`||
|`staticRouteConfiguration`	|IPv4 prefix of the static route.|`10.0.0.0/24`|
|`bgpConfiguration`|IPv4 next-hop address.|`10.0.0.0/24`| |
|`defaultRouteOriginate`	| `True`/`False` parameter that enables the default route to be originated when you're advertising routes via BGP. | `True` | |
|`peerASN`	|Peer ASN of a network function.|`65047`||
|`allowAS`	|Allows for routes to be received and processed even if the router detects its own ASN in the AS path. Input `0` to disable. Otherwise, possible values are `1` to `10`. The default is `2`.|`2`||
|`allowASOverride`	|Enables or disables `allowAS`.|`Enable`||
|`ipv4ListenRangePrefixes`| BGP IPv4 listen range; maximum range allowed in /28.| `10.1.0.0/26` | |
|`ipv6ListenRangePrefixes`| BGP IPv6 listen range; maximum range allowed in /127.| `3FFE:FFFF:0:CD30::/126`| |
|`ipv4NeighborAddress`| IPv4 neighbor address.|`10.0.0.11`| |
|`ipv6NeighborAddress`| IPv6 neighbor address.|`df8:f53b:82e4::53/127`| |

You need to create an internal network before you enable an L3 isolation domain. This command creates an internal network with BGP configuration and a specified peering address:

```azurecli
az networkfabric internalnetwork create 
--resource-group "ResourceGroupName" 
--l3-isolation-domain-name "example-l3domain" 
--resource-name "example-internalnetwork" 
--location "eastus"
--vlan-id 805 
--connected-ipv4-subnets '[{"prefix":"10.1.2.0/24"}]' 
--mtu 1500 
--bgp-configuration  '{"defaultRouteOriginate": "True", "allowAS": 2, "allowASOverride": "Enable", "PeerASN": 65535, "ipv4ListenRangePrefixes": ["10.1.2.0/28"]}'

```

Expected output:

```output
{ 
  "administrativeState": "Enabled", 
  "annotation": null, 
  "bfdDisabledOnResources": null, 
  "bfdForStaticRoutesDisabledOnResources": null, 
  "bgpConfiguration": { 
    "allowAs": 2, 
    "allowAsOverride": "Enable", 
    "annotation": null, 
    "bfdConfiguration": null, 
    "defaultRouteOriginate": "True", 
    "fabricAsn": 65046, 
    "ipv4ListenRangePrefixes": [ 
      "10.1.2.0/28" 
    ], 
    "ipv4NeighborAddress": null, 
    "ipv6ListenRangePrefixes": null, 
    "ipv6NeighborAddress": null, 
    "peerAsn": 65535 
  }, 
  "bgpDisabledOnResources": null, 
  "connectedIPv4Subnets": [ 
    { 
      "annotation": null, 
      "prefix": "10.1.2.0/24" 
    } 
  ], 
  "connectedIPv6Subnets": null, 
  "disabledOnResources": null, 
  "exportRoutePolicyId": null, 
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/ResourceGroupName/providers/Microsoft.ManagedNetworkFabric/l3IsolationDomains/example-l3domain", 
  "importRoutePolicyId": null, 
  "mtu": 1500, 
  "name": "internalnetwork805", 
  "provisioningState": "Accepted", 
  "resourceGroup": "ResourceGroupName", 
  "staticRouteConfiguration": null, 
  "systemData": { 
    "createdAt": "2023-XX-XXT05:26:33.547816+00:00", 
    "createdBy": "email@example.com", 
    "createdByType": "User", 
    "lastModifiedAt": "2023-XX-XXT05:26:33.547816+00:00", 
    "lastModifiedBy": "email@example.com", 
    "lastModifiedByType": "User" 
  }, 
  "type": "microsoft.managednetworkfabric/l3isolationdomains/internalnetworks", 
  "vlanId": 805 
}
```

### Create an untrusted internal network for an L3 isolation domain

```azurecli
az networkfabric internalnetwork create --resource-group "ResourceGroupName" --l3-isolation-domain-name l3untrust --resource-name untrustnetwork --location "eastus" --vlan-id 502 --fabric-asn 65048 --peer-asn 65047--connected-i-pv4-subnets prefix="10.151.3.11/24" --mtu 1500
```

### Create a trusted internal network for an L3 isolation domain

```azurecli
az networkfabric internalnetwork create --resource-group "ResourceGroupName" --l3-isolation-domain-name l3trust --resource-name trustnetwork --location "eastus" --vlan-id 503 --fabric-asn 65048 --peer-asn 65047--connected-i-pv4-subnets prefix="10.151.1.11/24" --mtu 1500
```

### Create an internal management network for an L3 isolation domain

```azurecli
az networkfabric internalnetwork create --resource-group "ResourceGroupName" --l3-isolation-domain-name l3mgmt --resource-name mgmtnetwork --location "eastus" --vlan-id 504 --fabric-asn 65048 --peer-asn 65047--connected-i-pv4-subnets prefix="10.151.2.11/24" --mtu 1500
```

### Create multiple static routes with a single next hop

```azurecli
az networkfabric internalnetwork create 
--resource-name "example-internalnetwork" 
--l3domain "example-l3domain" 
--resource-group "ResourceGroupName" 
--location "eastus" 
--vlan-id "2028" 
--mtu "1500" 
--connected-ipv4-subnets '[{"prefix":"10.18.34.0/24","gateway":"10.18.34.2"}]' --bgp-configuration '{"defaultRouteOriginate":true,"peerASN":65510,"ipv4Prefix":"10.18.34.0/24"}'
--static-route-configuration '{"ipv4Routes":[{"prefix":"10.23.0.0/19","nextHop":["10.20.0.1"]},{"prefix":"10.24.0.0/19","nextHop":["10.20.0.1"]}]}'

```

Expected output:

```output
{ 

  "administrativeState": "Enabled", 
  "annotation": null, 
  "bfdDisabledOnResources": null, 
  "bfdForStaticRoutesDisabledOnResources": null, 
  "bgpConfiguration": { 
    "allowAs": 2, 
    "allowAsOverride": "Enable", 
    "annotation": null, 
    "bfdConfiguration": null, 
    "defaultRouteOriginate": "True", 
    "fabricAsn": 65046, 
    "ipv4ListenRangePrefixes": null, 
    "ipv4NeighborAddress": null, 
    "ipv6ListenRangePrefixes": null, 
    "ipv6NeighborAddress": null, 
    "peerAsn": 65510 
  }, 

  "bgpDisabledOnResources": null, 
  "connectedIPv4Subnets": [ 
   { 
      "annotation": null, 
      "prefix": "10.18.34.0/24" 
    } 
  ], 
  "connectedIPv6Subnets": null, 
  "disabledOnResources": null, 
  "exportRoutePolicyId": null, 
  "id": "/subscriptions//xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx7/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/l3IsolationDomains/example-l3domain/internalNetworks/example-internalnetwor", 
  "importRoutePolicyId": null, 
  "mtu": 1500, 
  "name": "example-internalnetwork", 
  "provisioningState": "Accepted", 
  "resourceGroup": "ResourceGroupName", 
  "staticRouteConfiguration": { 
    "bfdConfiguration": null, 
    "ipv4Routes": [ 
      { 
        "nextHop": [ 
          "10.20.0.1" 
        ], 
        "prefix": "10.23.0.0/19" 
      }, 
      { 
        "nextHop": [ 
          "10.20.0.1" 
        ], 
        "prefix": "10.24.0.0/19" 
      } 
    ], 
    "ipv6Routes": null 
  }, 
  "systemData": { 
    "createdAt": "2023-XX-XXT13:46:26.394343+00:00", 
    "createdBy": "email@example.com", 
    "createdByType": "User", 
    "lastModifiedAt": "2023-XX-XXT13:46:26.394343+00:00", 
    "lastModifiedBy": "email@example.com", 
    "lastModifiedByType": "User" 
  }, 
  "type": "microsoft.managednetworkfabric/l3isolationdomains/internalnetworks", 
  "vlanId": 2028 
} 
```

### Create an internal network by using IPv6

```azurecli
az networkfabric internalnetwork create 
--resource-group "ResourceGroupName" 
--l3-isolation-domain-name "example-l3domain" 
--resource-name "example-internalipv6network" 
--location "eastus" 
--vlan-id 1090 
--connected-ipv6-subnets '[{"prefix":"10:101:1::0/64", "gateway":"10:101:1::1"}]' 
--mtu 1500 --bgp-configuration '{"defaultRouteOriginate":true,"peerASN": 65020,"ipv6NeighborAddress":[{"address": "df8:f53b:82e4::53/127"}]}'
```

Expected output:

```output
{ 
  "administrativeState": "Enabled", 
  "annotation": null, 
  "bfdDisabledOnResources": null, 
  "bfdForStaticRoutesDisabledOnResources": null, 
  "bgpConfiguration": { 
    "allowAs": 2, 
    "allowAsOverride": "Enable", 
    "annotation": null, 
    "bfdConfiguration": null, 
    "defaultRouteOriginate": "True", 
    "fabricAsn": 65046, 
    "ipv4ListenRangePrefixes": null, 
    "ipv4NeighborAddress": null, 
    "ipv6ListenRangePrefixes": null, 
    "ipv6NeighborAddress": [ 
      { 
        "address": "df8:f53b:82e4::53/127", 
        "operationalState": "Disabled" 
      } 
    ], 
    "peerAsn": 65020 
  }, 
  "bgpDisabledOnResources": null, 
  "connectedIPv4Subnets": null, 
  "connectedIPv6Subnets": [ 
    { 
      "annotation": null, 
      "prefix": "10:101:1::0/64" 
    } 
  ], 
  "disabledOnResources": null, 
  "exportRoutePolicyId": null, 
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/l3IsolationDomains/l3domain2/internalNetworks/internalipv6network", 
  "importRoutePolicyId": null, 
  "mtu": 1500, 
  "name": "internalipv6network", 
  "provisioningState": "Succeeded", 
  "resourceGroup": "ResourceGroupName", 
  "staticRouteConfiguration": null, 
  "systemData": { 
    "createdAt": "2023-XX-XXT10:34:33.933814+00:00", 
    "createdBy": "email@example.com", 
    "createdByType": "User", 
    "lastModifiedAt": "2023-XX-XXT10:34:33.933814+00:00", 
    "lastModifiedBy": "email@example.com", 
    "lastModifiedByType": "User" 
  }, 
  "type": "microsoft.managednetworkfabric/l3isolationdomains/internalnetworks", 
  "vlanId": 1090 
}
```

## Create external networks

External networks enable workloads to have Layer 3 connectivity with your provider edge. They also allow for workloads to interact with external services like firewalls and DNS. You need the fabric ASN (created during network fabric creation) to create external networks.

The commands for creating an external network by using Azure CLI include the following parameters.

|Parameter|Description|Example|Required|
|---|---|---|---|
|`peeringOption` |Peering that uses either Option A or Option B. Possible values are `OptionA` and `OptionB`. |`OptionB`| True|
|`optionBProperties` | Configuration of Option B properties. To specify, use `exportRouteTargets` or `importRouteTargets`.|`"exportRouteTargets": ["1234:1234"]}}`||
|`optionAProperties` | Configuration of Option A properties. |||
|`external`|Optional parameter to input MPLS Option B connectivity to external networks via private endpoint devices. By using this option, you can input import and export route targets as shown in the example.| || 

For Option A, you need to create an external network before you enable the L3 isolation domain. An external network is dependent on an internal network, so an external network can't be enabled without an internal network. The `vlan-id` value should be from `501` to `4095`.

### Create an external network by using Option B

```azurecli
az networkfabric externalnetwork create 
--resource-group "ResourceGroupName" 
--l3domain "examplel3domain" 
--resource-name "examplel3-externalnetwork" 
--location "eastus" 
--peering-option "OptionB" --option-b-properties '{"importRouteTargets": ["65541:2001"], "exportRouteTargets": ["65531:2001"]}'
```

Expected output:

```output
{
  "administrativeState": "Enabled",
  "annotation": null,
  "disabledOnResources": null,
  "exportRoutePolicyId": null,
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxxX/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/l3IsolationDomains/examplel3isolationdomain/externalNetworks/example-externalnetwork",
  "importRoutePolicyId": null,
  "name": "examplel3-externalnetwork",
  "networkToNetworkInterconnectId": null,
  "optionAProperties": null,
  "optionBProperties": {
    "exportRouteTargets": [
      "65531:2001"
    ],
    "importRouteTargets": [
      "65541:2001"
    ]
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

### Create an external network by using Option A

```azurecli
az networkfabric externalnetwork create
--resource-group "ResourceGroupName" 
--l3domain "example-l3domain" 
--resource-name "example-externalipv4network" 
--location "eastus" --peering-option "OptionA" 
--option-a-properties '{"peerASN": 65026,"vlanId": 2423, "mtu": 1500, "primaryIpv4Prefix": "10.18.0.148/30", "secondaryIpv4Prefix": "10.18.0.152/30"}'
```

Expected output:

```output
{ 
  "administrativeState": "Enabled", 
  "annotation": null, 
  "disabledOnResources": null, 
  "exportRoutePolicyId": null, 
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxxX/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/l3IsolationDomains/examplel3isolationdomain/externalNetworks/example-externalnetwork", 
  "importRoutePolicyId": null, 
  "name": "example-externalipv4network", 
  "networkToNetworkInterconnectId": null, 
  "optionAProperties": { 
    "bfdConfiguration": null, 
    "fabricAsn": 65026, 
    "mtu": 1500, 
    "peerAsn": 65026, 
    "primaryIpv4Prefix": "10.18.0.148/30", 
    "primaryIpv6Prefix": null, 
    "secondaryIpv4Prefix": "10.18.0.152/30", 
    "secondaryIpv6Prefix": null, 
    "vlanId": 2423 
  }, 

  "optionBProperties": null, 
  "peeringOption": "OptionA", 
  "provisioningState": "Accepted", 
  "resourceGroup": "ResourceGroupName", 
  "systemData": { 
    "createdAt": "2023-XX-XXT07:23:54.396679+00:00", 
    "createdBy": "email@address.com", 
    "createdByType": "User", 
    "lastModifiedAt": "2023-XX-XX1T07:23:54.396679+00:00", 
    "lastModifiedBy": "email@address.com", 
    "lastModifiedByType": "User" 
  }, 
  "type": "microsoft.managednetworkfabric/l3isolationdomains/externalnetworks" 
}

```

### Create an external network by using IPv6

```azurecli
az networkfabric externalnetwork create 
--resource-group "ResourceGroupName"
--l3-isolation-domain-name "example-l3domain"
--resource-name "example-externalipv6network"
--location "eastus"
--vlan-id 506
--peer-asn 65022
--primary-ipv6-prefix "10:101:2::0/127"
--secondary-ipv6-prefix "10:101:3::0/127"
```

The supported primary and secondary IPv6 prefix size is /127.

Expected output:

```output
{
  "administrativeState": null,
  "annotation": null,
  "bfdConfiguration": null,
  "bfdDisabledOnResources": null,
  "bgpDisabledOnResources": null,
  "disabledOnResources": null,
  "exportRoutePolicyId": null,
  "fabricAsn": 65026,
  "id": "/subscriptions//xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/l3IsolationDomains/example-l3domain/externalNetworks/example-externalipv6network",
  "importRoutePolicyId": null,
  "mtu": 1500,
  "name": "example-externalipv6network",
  "peerAsn": 65022,
  "primaryIpv4Prefix": "10:101:2::0/127",
  "primaryIpv6Prefix": null,
  "provisioningState": "Succeeded",
  "resourceGroup": "ResourceGroupName",
  "secondaryIpv4Prefix": null,
  "secondaryIpv6Prefix": "10:101:3::0/127",
  "systemData": {
    "createdAt": "2022-XX-XXT07:52:26.366069+00:00",
    "createdBy": "email@address.com",
    "createdByType": "User",
    "lastModifiedAt": "2022-XX-XXT07:52:26.366069+00:00",
    "lastModifiedBy": "",
    "lastModifiedByType": "User"
  },
  "type": "microsoft.managednetworkfabric/l3isolationdomains/externalnetworks",
  "vlanId": 506
}
```

## Enable an L2 isolation domain

```azurecli
az networkfabric l2domain update-administrative-state --resource-group "ResourceGroupName" --resource-name "l2HAnetwork" --state Enable 
```

## Enable an L3 isolation domain

Use this command to enable an untrusted L3 isolation domain:

```azurecli
az networkfabric l3domain update-admin-state --resource-group "ResourceGroupName" --resource-name "l3untrust" --state Enable 
```

Use this command to enable a trusted L3 isolation domain:

```azurecli
az networkfabric l3domain update-admin-state --resource-group "ResourceGroupName" --resource-name "l3trust" --state Enable 
```

Use this command to enable a management L3 isolation domain:

```azurecli
az networkfabric l3domain update-admin-state --resource-group "ResourceGroupName" --resource-name "l3mgmt" --state Enable
```
