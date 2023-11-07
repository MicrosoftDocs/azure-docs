---
title: "Azure Operator Nexus: How to create route policy in Network Fabric"
description: Learn to create, view, list, update, delete commands for Network Fabric.
author: jdasari
ms.author: jdasari
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 05/20/2023
ms.custom: template-how-to, devx-track-azurecli
---

# Route Policy in Network Fabric

Route policies provide Operators the capability to allow or deny routes in regards to Layer 3 isolation domains in Network Fabric.

With route policies, routes are tagged with certain attributes via community values
and extended community values when they're distributed via Border Gateway Patrol (BGP).
Similarly, on the BGP listener side, route policies can be authored to discard/allow
routes based on community values and extended community value attributes.

Route policies enable operators to control routes learnt/distributed via BGP.
Each route policy is modeled as a separate top level Azure Resource Manager (ARM) resource under
`Microsoft.managednetworkfabric`.
Operators can create, read, and delete route policy resources.
The operator creates a route policy ARM resource and then sets the ID in the L3 isolation
domain at the required enforcement point.
A route policy can only be applied at a single enforcement point.
A route policy can't be applied at multiple enforcement points.

In a network fabric, route policies can be enforced at the following endpoints of a
layer 3 isolation domain:

**External networks** (option **A** and option **B**):

For egress, set the `exportRoutePolicyId` property of the external network resource
to the route policy resource ID created for egress direction.
Set the `importRoutePolicyId` property of the external network resource to the
route policy resource ID created for ingress direction.

**Internal networks:**

For egress, set the `exportRoutePolicyId` property of the internal network resource to the
route policy resource ID created for egress direction.
Set the `importRoutePolicyId` property of the internal network resource to the
route policy resource ID created for ingress direction.

**Connected subnets across all internal networks:**

For egress, set the `connectedSubnetRoutePolicy` property of the L3 isolation domain
to the route policy resource ID created for egress direction.

## Conditions and actions of a route policy

The following combinations of conditions can be specified:

* _IP Prefix_
* _IP community_
* _Extended community list_

### Actions

The following actions can be specified when there's a match of conditions:

* _Discard the route_
* _Permit the route and apply one of the following specific actions_
* _Add/Remove specified community values and extended community values_
* _Overwrite specified community values and extended community values_

## IP prefix

IP prefixes are used in specifying match conditions for route policies.
An IP prefix resource allows operators to manipulate routes based on the IP prefix (IPv4 and IPv6).
The IP prefixes enable operators to drop certain prefixes from being propagated up-stream/down-stream or tag them with specific community or extended community values.
The operator must create an ARM resource of the type IP-Prefix by providing a list of prefixes with sequence numbers and action.

The prefixes in the list are processed in ascending order and the matching process stops after the first match. If the first match condition is "deny", the route is dropped and isn't propagated further. If the first match condition is "allow", further matching is aborted and the route is handled based on the action part of the route policies.


IP prefixes specify only the match conditions of route policies. They don't specify the action part of route policies.

### Parameters for IP prefix

| Parameter | Description | Example | Required |
|-----------|-------------|---------|----------|
| resource-group | Use an appropriate resource group name specifically for the IP prefix  of your choice |  ResourceGroupName |True |
| resource-name | Resource Name of the IP prefix |  ipprefixv4-1204-cn1 |True |
| location | Azure region used during NFC creation |  eastus |True |
| action | Action to be taken for the prefix – Permit | Deny or  Permit |True |
| sequenceNumber | Sequence in which the prefixes are processed. Prefix lists are evaluated starting with the lowest sequence number and continue down the list until a match is made. Once a match is made, the permit or deny statement is applied to that network and the rest of the list is ignored |  100 |True |
| networkPrefix | Network Prefix specifying IPv4/IPv6 packets to be permitted or denied. |  1.1.1.0/24 |True |
| condition | Specified prefix list bounds- EqualTo \|  GreaterThanOrEqualTo \|  LesserThanOrEqualTo |  EqualTo | |

| subnetMaskLength | SubnetMaskLength specifies the minimum networkPrefix length to be matched. Required when condition is specified.  |  32| |

### Create IP Prefix

This command creates an IP prefix resource with IPv4 prefix rules:

```azurecli
az networkfabric ipprefix create \
--resource-group "ResourceGroupName" \
--resource-name "ipprefixv4-1204-cn1" \
--location "eastus" \
--ip-prefix-rules '[{"action": "Permit", "sequenceNumber": 10, "networkPrefix": "10.10.10.0/28", "condition": "EqualTo", "subnetMaskLength": 28}, {"action": "Permit", "sequenceNumber": 12, "networkPrefix": "20.20.20.0/24", "condition": "EqualTo", "subnetMaskLength": 24}]'
```

Expected output:

```output
{
  "annotation": null,
  "id": "/subscriptions/xxxx-xxxx/resourceGroups/ResourceGroupName/providers/Microsoft.ManagedNetworkFabric/ipPrefixes/ipprefixv4-1204-cn1",
  "ipPrefixRules": [
    {
      "action": "Permit",
      "condition": "GreaterThanOrEqualTo",
      "networkPrefix": "10.10.10.0/28",
      "sequenceNumber": 10,
      "subnetMaskLength": 28
    }
  ],
  "location": "eastus",
  "name": " ipprefixv4-1204-cn1",
  "provisioningState": "Succeeded",
  "resourceGroup": "ResourceGroupName",
  "systemData": {
    "createdAt": "2023-XX-XXT09:34:19.095543+00:00",
    "createdBy": "user@address.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-XX-XXT09:34:19.095543+00:00",
    "lastModifiedBy": "user@address.com",
    "lastModifiedByType": "User"
  },
  "tags": null,
  "type": "microsoft.managednetworkfabric/ipprefixes"
}
```

This command creates an IP prefix resource with IPv6 prefix rules,

```azurecli
az networkfabric ipprefix create \
--resource-group "ResourceGroupName" \
--resource-name "ipprefixv6-2701-cn1" \
--location "eastus" \
--ip-prefix-rules '[{"action": "Permit", "sequenceNumber": 10, "networkPrefix": "fda0:d59c:da12:20::/64", "condition": "GreaterThanOrEqualTo", "subnetMaskLength": 68}]'
```

Expected Output

```output
{
  "annotation": null,
  "id": "/subscriptions/xxxx-xxxx/resourceGroups/ResourceGroupName/providers/Microsoft.ManagedNetworkFabric/ipPrefixes/ipprefixv6-2701-cn1",
  "ipPrefixRules": [
    {
      "action": "Permit",
      "condition": "GreaterThanOrEqualTo",
      "networkPrefix": "fda0:d59c:da12:20::/64",
      "sequenceNumber": 10,
      "subnetMaskLength": 68
    }
  ],
  "location": "eastus",
  "name": "ipprefixv6-2701-cn1",
  "provisioningState": "Succeeded",
  "resourceGroup": "ResourceGroupName",
  "systemData": {
    "createdAt": "2023-XX-XXT09:34:19.095543+00:00",
    "createdBy": "user@address.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-XX-XXT09:34:19.095543+00:00",
    "lastModifiedBy": "user@address.com",
    "lastModifiedByType": "User"
  },
  "tags": null,
  "type": "microsoft.managednetworkfabric/ipprefixes"
}
```

## IP Community

IP community resource allows operators to manipulate routes based on Community values tagged to routes. This community resource enables operators to specify conditions and actions for adding/removing routes as they're propagated up-stream/down-stream or tag them with specific community values. The operator must create an ARM resource of the type IP-Community. The operator specifies conditions and actions for adding/removing routes as they're propagated up-stream/down-stream or tags them with specific community values.

### Parameters for IP community

| Parameter | Description | Example | Required |
|-----------|-------------|---------|----------|
| resource-group | Use an appropriate resource group name specifically for your IP prefix |  ResourceGroupName |True |
| resource-name | Resource Name of the IP-Prefix |  ipprefixv4-1204-cn1 |True |
| location | AzON Azure Region used during NFC Creation |  eastus |True |
| action | Action to be taken for the IP  community – Permit | Deny or Permit |True |
| wellKnownCommunities | Supported well known community list.`Internet` - Advertise routes to internet community. `LocalAS` - Advertise routes to only localAS peers. `NoAdvertise` - Don't advertise routes to any peer. `NoExport` - Don't export to next AS. `GShut` - Graceful Shutdown (GSHUT) withdraw routes before terminating BGP connection|  LocalAS |True |
| communityMembers | List the communityMembers of the IP community. The expected formats are "AA:nn" >> example "65535:65535", \<integer32> >> example 4294967040. The possible values of "AA:nn" is 0-65535, and of \<integer32>  1-4294967040. |  65535:65535 |True |


> [!NOTE]
> Either `wellKnownCommunities` or `communityMembers` parameter has to be passed for creating an IP community resource.

### Create IP community

This command creates an IP community resource:

```azurecli
az networkfabric ipcommunity create \
--resource-group "ResourceGroupName" \
--resource-name "ipcommunity-2701" \
--location "eastus" \
--action "Permit" \
--well-known-communities "Internet" "LocalAS" "GShut" \
--community-members "65500:12701"
```

Expected output:

```output
{
  "action": "Permit",
  "annotation": null,
  "communityMembers": [
    "65500:12701"
  ],
  "id": "/subscriptions/9531faa8-8c39-4165-b033-48697fe943db/resourceGroups/ResourceGroupName/providers/Microsoft.ManagedNetworkFabric/ipCommunities/ipcommunity-2701",
  "location": "eastus",
  "name": "ipcommunity-2701",
  "provisioningState": "Succeeded",
  "resourceGroup": "ResourceGroupName",
  "systemData": {
    "createdAt": "2023-XX-XXT09:48:15.472935+00:00",
    "createdBy": "user@address.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-XX-XXT09:48:15.472935+00:00",
    "lastModifiedBy": "user@address.com",
    "lastModifiedByType": "User"
  },
  "tags": null,
  "type": "microsoft.managednetworkfabric/ipcommunities",
  "wellKnownCommunities": [
    "Internet",
    "LocalAS",
    "GShut"
  ]
}
```

### Show IP community

This command displays an IP community resource:

```azurecli
az networkfabric ipcommunity show --resource-group "ResourceGroupName" --resource-name "ipcommunity-2701"

```

Expected output:

```output
{
  "action": "Permit",
  "annotation": null,
  "communityMembers": [
    "65500:12701"
  ],
  "id": "/subscriptions/9531faa8-8c39-4165-b033-48697fe943db/resourceGroups/ResourceGroupName/providers/Microsoft.ManagedNetworkFabric/ipCommunities/ipcommunity-2701",
  "location": "eastus",
  "name": "ipcommunity-2701",
  "provisioningState": "Succeeded",
  "resourceGroup": "ResourceGroupName",
  "systemData": {
    "createdAt": "2023-XX-XXT09:48:15.472935+00:00",
    "createdBy": "user@address.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-XX-XXT09:48:15.472935+00:00",
    "lastModifiedBy": "user@address.com",
    "lastModifiedByType": "User"
  },
  "tags": null,
  "type": "microsoft.managednetworkfabric/ipcommunities",
  "wellKnownCommunities": [
    "Internet",
    "LocalAS",
    "GShut"
  ]
}
```

## IP extended community

The `IPExtendedCommunity`resource allows operators to manipulate routes  based on  route targets. Operators use it to specify conditions and actions for adding/removing routes as they're propagated up-stream/down-stream or tag them with specific extended community values. The operator must create an ARM resource of the type `IPExtendedCommunityList` by providing a list of community values and specific properties. ExtendedCommunityLists are used in specifying match conditions and the action properties for route policies.

### Parameters for IP extended community

| Parameter | Description | Example | Required |
|-----------|-------------|---------|----------|
| resource-group | Use an appropriate resource group name specifically for your IP prefix |  ResourceGroupName |True |
| resource-name | Resource Name of the ipPrefix |  ipprefixv4-1204-cn1 |True |
| location | AzON Azure Region used during NFC Creation |  eastus |True |
| action | Action to be taken for the IP extended community – Permit | Deny or Permit |True |
| routeTargets | Route Target List. The expected formats are "ASN(plain):nn" >> example "4294967294:50", "ASN.ASN:nn" >> example "65533.65333:40", "IP-address:nn" >> example "10.10.10.10:65535". The possible values of "nn" are within "0-65535" range, and "ASN(plain)" within "0-4294967295" range. | "1234:5678" |True |

### Create IP extended community

This command creates an IP extended community resource:

```azurecli
az networkfabric ipextendedcommunity create \
--resource-group "ResourceGroupName" \
--resource-name "ipextcommunity-2701" \
--location "eastus"  \
--action "Permit" \
--route-targets "65046:45678"
```

Expected output:

```output
{
  "action": "Permit",
  "annotation": null,
  "id": "/subscriptions/9531faa8-8c39-4165-b033-48697fe943db/resourceGroups/ResourceGroupName/providers/Microsoft.ManagedNetworkFabric/ipExtendedCommunities/ipextcommunity-2701",
  "location": "eastus",
  "name": "ipextcommunity-2701",
  "provisioningState": "Succeeded",
  "resourceGroup": "ResourceGroupName",
  "routeTargets": [
    "65046:45678"
  ],
  "systemData": {
    "createdAt": "2023-XX-XXT09:52:30.385929+00:00",
    "createdBy": "user@address.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-XX-XXT09:52:30.385929+00:00",
    "lastModifiedBy": "user@address.com",
    "lastModifiedByType": "User"
  },
  "tags": null,
  "type": "microsoft.managednetworkfabric/ipextendedcommunities"
}
```

### Show IP extended community

This command displays an IP extended community resource:

```azurecli
az networkfabric ipextendedcommunity show --resource-group "ResourceGroupName" --resource-name "ipextcommunity-2701"
```

Expected output:

```output
{
  "action": "Permit",
  "annotation": null,
  "id": "/subscriptions/9531faa8-8c39-4165-b033-48697fe943db/resourceGroups/ResourceGroupName/providers/Microsoft.ManagedNetworkFabric/ipExtendedCommunities/ipextcommunity-2701",
  "location": "eastus",
  "name": "ipextcommunity-2701",
  "provisioningState": "Succeeded",
  "resourceGroup": "ResourceGroupName",
  "routeTargets": [
    "65046:45678"
  ],
  "systemData": {
    "createdAt": "2023-XX-XXT09:52:30.385929+00:00",
    "createdBy": "user@address.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-XX-XXT09:52:30.385929+00:00",
    "lastModifiedBy": "user@address.com",
    "lastModifiedByType": "User"
  },
  "tags": null,
  "type": "microsoft.managednetworkfabric/ipextendedcommunities"
}
```

## Route policy

Route policy resource enables an operator to specify conditions and actions based on IP prefixes, IP community list and  IP extended community lists. Each route policy consists of multiple statements. Each statement consists of  a sequence number,  conditions, and actions. The conditions can be combinations of IP prefixes, IP communities, and IP extended communities and are applied in ascending order of sequence numbers. The action corresponding to the first matched condition is executed.   If the conditions that matched has deny  as action, the route is discarded and no further processing takes place. If the action in the Route policy corresponding to the matched condition is "Permit", the following combinations  of actions are allowed:

* Updating local preference
* Add/delete or Set of IpCommunityLists
* Add/delete or Set of IpExtendedCommunityLists

### Parameters for Route policy

| Parameter | Description | Example | Required |
|-----------|-------------|---------|----------|
| resource-group | Use an appropriate resource group name specifically for your IP prefix |  ResourceGroupName |True |
| resource-name | Resource Name of the IP-Prefix |  ipprefixv4-1204-cn1 |True |
| location | AzON Azure Region used during NFC Creation | eastus |True |
| statements | List of one or more route Policy statements |   |True |
| sequenceNumber | Sequence in which route policy statements are processed. Statements  are evaluated starting with the lowest sequence number and continue down the list until a match condition is met. Once a match is made, the action is applied and the rest of the list is ignored |  1 |True |
| condition | Route policy condition properties. That contains a list of IP community ARM IDs or ipExtendedCommmunicty ARM IDs or ipPrefix ARM ID. One of the three(ipCommunityIds, ipCommunityIds, ipPrefixId) is required in a condition.  If more than one is specified,  the condition is matched if any one of the resources has a match. |  1234:5678 |True |
| ipCommunityIds | List of IP community resource IDs |  |False|
| ipExtendedCommunityIds | List of IPExtendedCommunity resource IDs |   |False|
| ipPrefixId | Arm Resource ID of IpPrefix |   |False|
| action | Route policy action properties. This property describes the action to be performed if there's a match of the condition in the statement. At least one of localPreference, ipCommunityProperties, or ipExtendedCommunityProperties needs to be enabled | Permit  |True |
| localPreference | Local preference to be set as part of action |  10 |False |
| ipCommunityProperties | Details of IP communities that need to be added, removed, or set as part of action |   |False|
| add | Applicable when the action is to add IP communities or IP extended communities |   ||
| delete | Applicable when the action is to delete IP communities or IP extended communities |   ||
| set | Applicable when the action is to set IP communities or IP extended communities |   ||
| ipCommunityIds | IP community ARM resource Ids that need to be added or deleted or set |   ||
| ipExtendedCommunityProperties | Details of IP Extended communities that need to be added, removed, or set as part of action |   ||
| ipExtendedCommunityIDs | IP extended community ARM resource Ids that need to be added or deleted or set |   ||

### Create route policy

This command creates  route policies:

```azurecli
az networkfabric routepolicy create \
--resource-group "ResourceGroupName"  \
--resource-name "rcf-Fab3-l3domain-v6-connsubnet-ext-policy" \
--location "eastus" \
--statements '[ \{"sequenceNumber": 10, "condition":{"ipPrefixId": "/subscriptions/<subscription-id>/resourceGroups/ResourceGroupName/providers/Microsoft.ManagedNetworkFabric/ipPrefixes/ipprefixv6-2701-staticsubnet"}, \
 "action": {"actionType": "Permit", "ipCommunityProperties": {"set": \
   {"ipCommunityIds": ["/subscriptions/<subscription-id>/resourceGroups/ResourceGroupName/providers/Microsoft.ManagedNetworkFabric/ipCommunities/ipcommunity-2701-staticsubnet"]}}}}, \
 {"sequenceNumber": 30, "condition":{"ipPrefixId": "/subscriptions/<subscription-id>/resourceGroups/ResourceGroupName/providers/Microsoft.ManagedNetworkFabric/ipPrefixes/ipprefixv6-2701-connsubnet"},  \
 "action": {"actionType": "Permit", "ipCommunityProperties": {"set":  \
 {"ipCommunityIds": ["/subscriptions/<subscription-id>/resourceGroups/ResourceGroupName/providers/Microsoft.ManagedNetworkFabric/ipCommunities/ipcommunity-connsubnet-2701"]}}}},\
]' 
```

Expected output:

```output
{
  "annotation": null,
  "id": "/subscriptions/9531faa8-8c39-4165-b033-48697fe943db/resourceGroups/ResourceGroupName/providers/Microsoft.ManagedNetworkFabric/routePolicies/rcf-Fab3-l3domain-v6-connsubnet-ext-policy",
  "location": "eastus",
  "name": "rcf-Fab3-l3domain-v6-connsubnet-ext-policy",
  "provisioningState": "Accepted",
  "resourceGroup": "ResourceGroupName",
  "statements": [
    {
      "action": {
        "actionType": "Permit",
        "ipCommunityProperties": {
          "add": null,
          "delete": null,
          "set": {
            "ipCommunityIds": [
              "/subscriptions/<subscription-id>/resourceGroups/ResourceGroupName/providers/Microsoft.ManagedNetworkFabric/ipCommunities/ipcommunity-2701-staticsubnet"
            ]
          }
        },
        "ipExtendedCommunityProperties": null,
        "localPreference": null
      },
      "annotation": null,
      "condition": {
        "ipCommunityIds": null,
        "ipExtendedCommunityIds": null,
        "ipPrefixId": "/subscriptions/<subscription-id>/resourceGroups/ResourceGroupName/providers/Microsoft.ManagedNetworkFabric/ipPrefixes/ipprefixv6-2701-staticsubnet"
      },
      "sequenceNumber": 10
    },
    {
      "action": {
        "actionType": "Permit",
        "ipCommunityProperties": {
          "add": null,
          "delete": null,
          "set": {
            "ipCommunityIds": [
              "/subscriptions/<subscription-id>/resourceGroups/ResourceGroupName/providers/Microsoft.ManagedNetworkFabric/ipCommunities/ipcommunity-connsubnet-2701"
            ]
          }
        },
        "ipExtendedCommunityProperties": null,
        "localPreference": null
      },
      "annotation": null,
      "condition": {
        "ipCommunityIds": null,
        "ipExtendedCommunityIds": null,
        "ipPrefixId": "/subscriptions/<subscription-id>/resourceGroups/ResourceGroupName/providers/Microsoft.ManagedNetworkFabric/ipPrefixes/ipprefixv6-2701-connsubnet"
      },
      "sequenceNumber": 30
    }
  ],
  "systemData": {
    "createdAt": "2023-XX-XXT10:10:21.123560+00:00",
    "createdBy": "user@address.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-XX-XXT10:10:21.123560+00:00",
    "lastModifiedBy": "user@address.com",
    "lastModifiedByType": "User"
  },
  "tags": null,
  "type": "microsoft.managednetworkfabric/routepolicies"
} 
```

### Show route policy

This command displays route policies:

```Azurecli
az networkfabric routepolicy show --resource-group "ResourceGroupName" --resource-name "rcf-Fab3-l3domain-v6-connsubnet-ext-policy"
```

Expected output:

```Output
{
  "annotation": null,
  "id": "/subscriptions/9531faa8-8c39-4165-b033-48697fe943db/resourceGroups/ResourceGroupName/providers/Microsoft.ManagedNetworkFabric/routePolicies/rcf-Fab3-l3domain-v6-connsubnet-ext-policy",
  "location": "eastus",
  "name": "rcf-Fab3-l3domain-v6-connsubnet-ext-policy",
  "provisioningState": "Succeeded",
  "resourceGroup": "ResourceGroupName",
  "statements": [
    {
      "action": {
        "actionType": "Permit",
        "ipCommunityProperties": {
          "add": null,
          "delete": null,
          "set": {
            "ipCommunityIds": [
              "/subscriptions/<subscription-id>/resourceGroups/ResourceGroupName/providers/Microsoft.ManagedNetworkFabric/ipCommunities/ipcommunity-2701-staticsubnet"
            ]
          }
        },
        "ipExtendedCommunityProperties": null,
        "localPreference": null
      },
      "annotation": null,
      "condition": {
        "ipCommunityIds": null,
        "ipExtendedCommunityIds": null,
        "ipPrefixId": "/subscriptions/<subscription-id>/resourceGroups/ResourceGroupName/providers/Microsoft.ManagedNetworkFabric/ipPrefixes/ipprefixv6-2701-staticsubnet"
      },
      "sequenceNumber": 10
    },
    {
      "action": {
        "actionType": "Permit",
        "ipCommunityProperties": {
          "add": null,
          "delete": null,
          "set": {
            "ipCommunityIds": [
              "/subscriptions/<subscription-id>/resourceGroups/ResourceGroupName/providers/Microsoft.ManagedNetworkFabric/ipCommunities/ipcommunity-connsubnet-2701"
            ]
          }
        },
        "ipExtendedCommunityProperties": null,
        "localPreference": null
      },
      "annotation": null,
      "condition": {
        "ipCommunityIds": null,
        "ipExtendedCommunityIds": null,
        "ipPrefixId": "/subscriptions/<subscription-id>/resourceGroups/ResourceGroupName/providers/Microsoft.ManagedNetworkFabric/ipPrefixes/ipprefixv6-2701-connsubnet"
      },
      "sequenceNumber": 30
    }
  ],
  "systemData": {
    "createdAt": "2023-XX-XXT10:10:21.123560+00:00",
    "createdBy": "user@address.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-XX-XXT10:10:21.123560+00:00",
    "lastModifiedBy": "user@addresscom",
    "lastModifiedByType": "User"
  },
  "tags": null,
  "type": "microsoft.managednetworkfabric/routepolicies"
}
```
