---
title: Create ACLs on an NNI in Azure Operator Nexus
description: Get instructions on setting up network access control lists (ACLs) to control SSH access on a management VPN.
ms.service: azure-operator-nexus
ms.custom: template-how-to, devx-track-azurecli
ms.topic: how-to
ms.date: 02/07/2024
author: sushantjrao
ms.author: sushrao
---

# Create ACLs on an NNI in Azure Operator Nexus

In Azure Operator Nexus, access control lists (ACLs) for `Permit` and `Deny` actions at a network-to-network interconnect (NNI) level help protect Secure Shell (SSH) access on the management virtual private network (VPN). You create ingress and egress ACLs before the creation of NNI resources and then reference those ACLs in the NNI payload. You need to create referenced ingress and egress ACLs before you provision the network fabric.

These are the high-level steps for creating an ACL on an NNI:

1. Create NNI ingress and egress ACLs.
2. Update the Azure Resource Manager resource reference in a management NNI.
3. Create an NNI and provision the network fabric.

## Parameter usage guidance

| Parameter            | Description                                                  | Example or range                |
|----------------------|--------------------------------------------------------------|--------------------------------|
| `defaultAction`        | Default action to be taken. If you don't define it, traffic is permitted. | `"defaultAction": "Permit"`      |
| `resource-group`       | Resource group of the network fabric.                        | `nfresourcegroup`                 |
| `resource-name`        | Name of the ACL.                                             | `example-ingressACL`              |
| `vlanGroups`           | List of virtual local area network (VLAN) groups.                                         |                                |
| `vlans`                | List of VLANs that need to be matched.                       |                                |
| `match-configurations` | Name of the match configuration.                                 | `example_acl`. Spaces and the ampersand character (&) aren't supported. |
| `matchConditions`      | Conditions required to be matched.                           |                                |
| `ttlValues`            | Time to live (TTL).                                          | `0`-`255`                          |
| `dscpMarking`          | Differentiated Services Code Point (DSCP) markings that need to be matched.                       | `0`-`63`                           |
| `portCondition`        | Port condition that needs to be matched.                     |                                |
| `portType`             | Port type that needs to be matched.                          | Example: `SourcePort`. Allowed values: `DestinationPort`, `SourcePort`. |
| `protocolTypes`        | Protocols that need to be matched.                           | `[tcp, udp, range[1-2, 1, 2]]`. If it's a protocol number, it should be in the range of `1`-`255`. |
| `vlanMatchCondition`  | VLAN match condition that needs to be matched.                |                                |
| `layer4Protocol`       | Layer 4 protocol.                                           | Should be either `TCP` or `UDP`.    |
| `ipCondition`          | IP condition that needs to be matched.                       |                                |
| `actions`              | Action to be taken based on a match condition.                 | Example: `permit`.                |
| `configuration-type`   | Configuration type, which can be inline or file. At this time, Azure Operator Nexus supports only inline. | Example: `inline`.                |

You should also be aware of these restrictions:

- Inline ports and inline VLANs are a static way of defining the ports or VLANs by using `azcli`.
- `portGroupNames` and `vlanGroupNames` are dynamic ways of defining ports and VLANs.
- Inline ports and `portGroupNames` together aren't allowed.
- Inline VLANs and `vlanGroupNames` together aren't allowed.
- `ipGroupNames` and `ipPrefixValues` together aren't allowed.
- Egress ACLs don't support IP options, IP length, fragment, EtherType, DSCP marking, or TTL values.
- Ingress ACLs don't support EtherType options.

## Create an ingress ACL

To create an ingress ACL, you can use the following Azure CLI command. This command creates an ingress ACL with the specified configurations and provides the expected result as output. Adjust the parameters as needed for your use case.

```bash
az networkfabric acl create
--resource-group "example-rg"
--location "eastus2euap"
--resource-name "example-Ipv4ingressACL"
--configuration-type "Inline"
--default-action "Permit"
--dynamic-match-configurations "[{ipGroups:[{name:'example-ipGroup',ipAddressType:IPv4,ipPrefixes:['10.20.3.1/20']}],vlanGroups:[{name:'example-vlanGroup',vlans:['20-30']}],portGroups:[{name:'example-portGroup',ports:['100-200']}]}]"
--match-configurations "[{matchConfigurationName:'example-match',sequenceNumber:123,ipAddressType:IPv4,matchConditions:[{etherTypes:['0x1'],fragments:['0xff00-0xffff'],ipLengths:['4094-9214'],ttlValues:[23],dscpMarkings:[32],portCondition:{flags:[established],portType:SourcePort,layer4Protocol:TCP,ports:['1-20']},protocolTypes:[TCP],vlanMatchCondition:{vlans:['20-30'],innerVlans:[30]},ipCondition:{type:SourceIP,prefixType:Prefix,ipPrefixValues:['10.20.20.20/12']}}],actions:[{type:Count,counterName:'example-counter'}]}]"

```

#### Expected output

```json
{
    "properties": {
        "lastSyncedTime": "2023-06-17T08:56:23.203Z",
        "configurationState": "Succeeded",
        "provisioningState": "Accepted",
        "administrativeState": "Enabled",
        "annotation": "annotation",
        "configurationType": "File",
        "aclsUrl": "https://ACL-Storage-URL",
        "matchConfigurations": [{
            "matchConfigurationName": "example-match",
            "sequenceNumber": 123,
            "ipAddressType": "IPv4",
            "matchConditions": [{
                "etherTypes": ["0x1"],
                "fragments": ["0xff00-0xffff"],
                "ipLengths": ["4094-9214"],
                "ttlValues": [23],
                "dscpMarkings": [32],
                "portCondition": {
                    "flags": ["established"],
                    "portType": "SourcePort",
                    "l4Protocol": "TCP",
                    "ports": ["1-20"],
                    "portGroupNames": ["example-portGroup"]
                },
                "protocolTypes": ["TCP"],
                "vlanMatchCondition": {
                    "vlans": ["20-30"],
                    "innerVlans": [30],
                    "vlanGroupNames": ["example-vlanGroup"]
                },
                "ipCondition": {
                    "type": "SourceIP",
                    "prefixType": "Prefix",
                    "ipPrefixValues": ["10.20.20.20/12"],
                    "ipGroupNames": ["example-ipGroup"]
                }
            }]
        }],
        "actions": [{
            "type": "Count",
            "counterName": "example-counter"
        }]
    },
    "tags": {
        "keyID": "KeyValue"
    },
    "location": "eastUs",
    "id": "/subscriptions/xxxxxx/resourceGroups/resourcegroupname/providers/Microsoft.ManagedNetworkFabric/accessControlLists/acl",
    "name": "example-Ipv4ingressACL",
    "type": "microsoft.managednetworkfabric/accessControlLists",
    "systemData": {
        "createdBy": "email@address.com",
        "createdByType": "User",
        "createdAt": "2023-06-09T04:51:41.251Z",
        "lastModifiedBy": "UserId",
        "lastModifiedByType": "User",
        "lastModifiedAt": "2023-06-09T04:51:41.251Z"
    }
}
```

## Create an egress ACL

To create an egress ACL, you can use the following Azure CLI command. This command creates an egress ACL with the specified configurations and provides the expected result as output. Adjust the parameters as needed for your use case.

```bash
az networkfabric acl create
--resource-group "example-rg"
--location "eastus2euap"
--resource-name "example-Ipv4egressACL"
--configuration-type "File"
--acls-url "https://ACL-Storage-URL"
--default-action "Permit"
--dynamic-match-configurations "[{ipGroups:[{name:'example-ipGroup',ipAddressType:IPv4,ipPrefixes:['10.20.3.1/20']}],vlanGroups:[{name:'example-vlanGroup',vlans:['20-30']}],portGroups:[{name:'example-portGroup',ports:['100-200']}]}]"

```

#### Expected output

```json
{
    "properties": {
        "lastSyncedTime": "2023-06-17T08:56:23.203Z",
        "configurationState": "Succeeded",
        "provisioningState": "Accepted",
        "administrativeState": "Enabled",
        "annotation": "annotation",
        "configurationType": "File",
        "aclsUrl": "https://ACL-Storage-URL",
        "dynamicMatchConfigurations": [{
            "ipGroups": [{
                "name": "example-ipGroup",
                "ipAddressType": "IPv4",
                "ipPrefixes": ["10.20.3.1/20"]
            }],
            "vlanGroups": [{
                "name": "example-vlanGroup",
                "vlans": ["20-30"]
            }],
            "portGroups": [{
                "name": "example-portGroup",
                "ports": ["100-200"]
            }]
        }]
    },
    "tags": {
        "keyID": "KeyValue"
    },
    "location": "eastUs",
    "id": "/subscriptions/xxxxxx/resourceGroups/resourcegroupname/providers/Microsoft.ManagedNetworkFabric/accessControlLists/acl",
    "name": "example-Ipv4egressACL",
    "type": "microsoft.managednetworkfabric/accessControlLists",
    "systemData": {
        "createdBy": "email@address.com",
        "createdByType": "User",
        "createdAt": "2023-06-09T04:51:41.251Z",
        "lastModifiedBy": "UserId",
        "lastModifiedByType": "User",
        "lastModifiedAt": "2023-06-09T04:51:41.251Z"
    }
}
```

## Update the Resource Manager reference

This step enables the creation of ACLs (ingress and egress if a reference is provided) during the creation of the NNI resource. After you create the NNI and before you provision the network fabric, you can perform re-put on the NNI.

- `ingressAclId`: Reference ID for the ingress ACL.
- `egressAclId`: Reference ID for the egress ACL.

To get the Resource Manager resource ID, go to the resource group of the subscription that you're using.

The following command updates the Resource Manager reference for the NNI resource by associating it with the provided ingress and egress ACLs. Adjust the parameters as needed for your use case.

```bash
az networkfabric nni create
--resource-group "example-rg"
--fabric "example-fabric"
--resource-name "example-nniwithACL"
--nni-type "CE"
--is-management-type "True"
--use-option-b "True"
--layer2-configuration "{interfaces:['/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/Microsoft.ManagedNetworkFabric/networkDevices/example-networkDevice/networkInterfaces/example-interface'],mtu:1500}"
--option-b-layer3-configuration "{peerASN:28,vlanId:501,primaryIpv4Prefix:'10.18.0.124/30',secondaryIpv4Prefix:'10.18.0.128/30',primaryIpv6Prefix:'10:2:0:124::400/127',secondaryIpv6Prefix:'10:2:0:124::402/127'}"
--ingress-acl-id "/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/Microsoft.ManagedNetworkFabric/accesscontrollists/example-Ipv4ingressACL"
--egress-acl-id "/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/Microsoft.ManagedNetworkFabric/accesscontrollists/example-Ipv4egressACL"
```

## Show ACL details

To display the details of a specified ACL, use the following command:

```bash
az networkfabric acl show --resource-group "example-rg" --resource-name "example-acl"
```

## List ACLs

To list all ACLs within a specified resource group, use the following command:

```bash
az networkfabric acl list --resource-group "ResourceGroupName"
```

## Create ACLs on the ISD external network

Use the following information to create ingress and egress ACLs for the isolation domain (ISD) external network. Then, update the Resource Manager resource reference for the external network.

### Create an egress ACL for the ISD external network

To create an egress ACL for the specified ISD external network with the provided configuration, use the following command. Adjust the parameters as needed for your use case.

```bash
az networkfabric acl create
--resource-group "example-rg"
--location "eastus2euap"
--resource-name "example-Ipv4egressACL"
--annotation "annotation"
--configuration-type "Inline"
--default-action "Deny"
--match-configurations "[{matchConfigurationName:'L3ISD_EXT_OPTA_EGRESS_ACL_IPV4_CE_PE',sequenceNumber:1110,ipAddressType:IPv4,matchConditions:[{ipCondition:{type:SourceIP,prefixType:Prefix,ipPrefixValues:['10.18.0.124/30','10.18.0.128/30','10.18.30.16/30','10.18.30.20/30']}},{ipCondition:{type:DestinationIP,prefixType:Prefix,ipPrefixValues:['10.18.0.124/30','10.18.0.128/30','10.18.30.16/30','10.18.30.20/30']}}],actions:[{type:Count}]}]"
```

#### Expected output

Upon successful execution, the command returns information about the created ACL in the following format. This output includes details about the configuration and state.

```json
{
    "administrativeState": "Disabled",
    "annotation": "annotation",
    "configurationState": "Succeeded",
    "configurationType": "Inline",
    "defaultAction": "Deny",
    "id": "/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/Microsoft.ManagedNetworkFabric/accessControlLists/example-Ipv4egressACL",
    "location": "eastus2euap",
    "matchConfigurations": [
        {
            "actions": [
                {
                    "type": "Count"
                }
            ],
            "ipAddressType": "IPv4",
            "matchConditions": [
                {
                    "ipCondition": {
                        "ipPrefixValues": [
                            "10.18.0.124/30",
                            "10.18.0.128/30",
                            "10.18.30.16/30",
                            "10.18.30.20/30"
                        ],
                        "prefixType": "Prefix",
                        "type": "SourceIP"
                    }
                },
                {
                    "ipCondition": {
                        "ipPrefixValues": [
                            "10.18.0.124/30",
                            "10.18.0.128/30",
                            "10.18.30.16/30",
                            "10.18.30.20/30"
                        ],
                        "prefixType": "Prefix",
                        "type": "DestinationIP"
                    }
                }
            ],
            "matchConfigurationName": "L3ISD_EXT_OPTA_EGRESS_ACL_IPV4_CE_PE",
            "sequenceNumber": 1110
        }
    ],
    "name": "example-Ipv4egressACL",
    "provisioningState": "Succeeded",
    "resourceGroup": "example-rg",
    "systemData": {
        "createdAt": "2023-09-11T10:20:20.2617941Z",
        "createdBy": "email@address.com",
        "createdByType": "User",
        "lastModifiedAt": "2023-09-11T10:20:20.2617941Z",
        "lastModifiedBy": "email@address.com",
        "lastModifiedByType": "User"
    },
    "type": "microsoft.managednetworkfabric/accesscontrollists"
}
```

### Create an ingress ACL for the ISD external network

To create an ingress ACL for the specified ISD external network with the provided configuration, use the following command. Adjust the parameters as needed for your use case.

```bash
az networkfabric acl create
--resource-group "example-rg"
--location "eastus2euap"
--resource-name "example-Ipv4ingressACL"
--annotation "annotation"
--configuration-type "Inline"
--default-action "Deny"
--match-configurations "[{matchConfigurationName:'L3ISD_EXT_OPTA_INGRESS_ACL_IPV4_CE_PE',sequenceNumber:1110,ipAddressType:IPv4,matchConditions:[{ipCondition:{type:SourceIP,prefixType:Prefix,ipPrefixValues:['10.18.0.124/30','10.18.0.128/30','10.18.30.16/30','10.18.30.20/30']}},{ipCondition:{type:DestinationIP,prefixType:Prefix,ipPrefixValues:['10.18.0.124/30','10.18.0.128/30','10.18.30.16/30','10.18.30.20/30']}}],actions:[{type:Count}]}]"
```

#### Expected output

Upon successful execution, the command returns information about the created ACL in the following format. This output includes details about the configuration and state.

```json
{
    "administrativeState": "Disabled",
    "annotation": "annotation",
    "configurationState": "Succeeded",
    "configurationType": "Inline",
    "defaultAction": "Deny",
    "id": "/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/Microsoft.ManagedNetworkFabric/accessControlLists/example-Ipv4ingressACL",
    "location": "eastus2euap",
    "matchConfigurations": [
        {
            "actions": [
                {
                    "type": "Count"
                }
            ],
            "ipAddressType": "IPv4",
            "matchConditions": [
                {
                    "ipCondition": {
                        "ipPrefixValues": [
                            "10.18.0.124/30",
                            "10.18.0.128/30",
                            "10.18.30.16/30",
                            "10.18.30.20/30"
                        ],
                        "prefixType": "Prefix",
                        "type": "SourceIP"
                    }
                },
                {
                    "ipCondition": {
                        "ipPrefixValues": [
                            "10.18.0.124/30",
                            "10.18.0.128/30",
                            "10.18.30.16/30",
                            "10.18.30.20/30"
                        ],
                        "prefixType": "Prefix",
                        "type": "DestinationIP"
                    }
                }
            ],
            "matchConfigurationName": "L3ISD_EXT_OPTA_INGRESS_ACL_IPV4_CE_PE",
            "sequenceNumber": 1110
        }
    ],
    "name": "example-Ipv4ingressACL",
    "provisioningState": "Succeeded",
    "resourceGroup": "example-rg",
    "systemData": {
        "createdAt": "2023-09-11T10:20:20.2617941Z",
        "createdBy": "email@address.com",
        "createdByType": "User",
        "lastModifiedAt": "2023-09-11T10:27:27.2317467Z",
        "lastModifiedBy": "email@address.com",
        "lastModifiedByType": "User"
    },
    "type": "microsoft.managednetworkfabric/accesscontrollists"
}
```
