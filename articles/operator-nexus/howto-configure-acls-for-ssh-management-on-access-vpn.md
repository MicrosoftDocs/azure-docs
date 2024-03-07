---
title: "Azure Operator Nexus: How to Configure Network Access Control Lists (ACLs) for SSH Access on Management VPN."
description: Instructions on setting up network access control lists (ACLs) to control SSH access on a management VPN.
ms.service: azure-operator-nexus
ms.custom: template-how-to, devx-track-azurecli
ms.topic: how-to
ms.date: 02/07/2024
author: sushantjrao
ms.author: sushrao
---

# How-To Guide: Creating ACLs on an NNI

ACLs (Permit & Deny) at an NNI Level are designed to protect SSH access on the Management VPN. Network Access Control Lists can be applied before provisioning the Network Fabric. It's important to note that this limitation is temporary and will be removed in future releases.

Ingress and Egress ACLs are created prior to the creation of NNI resources and are referenced into the NNI payload. When NNI resources are created, they also create referenced ingress and egress ACLs. This activity needs to be performed before provisioning the Network Fabric.

## Steps to Create an ACL on an NNI:

1. Create NNI Ingress and Egress ACLs
2. Update ARM Resource Reference in Management NNI
3. Create NNI and Provision Network Fabric

## Parameter Usage Guidance:

| Parameter            | Description                                                  | Example or Range                |
|----------------------|--------------------------------------------------------------|--------------------------------|
| defaultAction        | Defines default action to be taken. If not defined, traffic is permitted. | "defaultAction": "Permit"      |
| resource-group       | Resource group of the network fabric.                        | nfresourcegroup                 |
| resource-name        | Name of the ACL.                                             | example-ingressACL              |
| vlanGroups           | List of VLAN groups.                                         |                                |
| vlans                | List of VLANs that need to be matched.                       |                                |
| match-configurations | Name of match configuration.                                 | example_acl (spaces and special character "&" aren't supported) |
| matchConditions      | Conditions required to be matched.                           |                                |
| ttlValues            | TTL (Time To Live).                                          | 0-255                          |
| dscpMarking          | DSCP Markings that need to be matched.                       | 0-63                           |
| portCondition        | Port condition that needs to be matched.                     |                                |
| portType             | Port type that needs to be matched.                          | Example: SourcePort. Allowed values: DestinationPort, SourcePort |
| protocolTypes        | Protocols that need to be matched.                           | [tcp, udp, range[1-2, 1, 2]] (if protocol number, it should be in the range of 1-255) |
| vlanMatchCondition  | VLAN match condition that needs to be matched.                |                                |
| layer4Protocol       | Layer 4 Protocol.                                           | Should be either TCP or UDP    |
| ipCondition          | IP condition that needs to be matched.                       |                                |
| actions              | Action to be taken based on match condition.                 | Example: permit                |
| configuration-type   | Configuration type can be inline or by using a file. However, AON supports only inline today. | Example: inline                |


There are some further restrictions that you should be aware of:

- **Inline ports and inline VLANs** are a static way of defining the ports or VLANs using `azcli`.
- **PortGroupNames and VLANGroupNames** are dynamic ways of defining ports and VLANs.
- **Inline ports and the PortGroupNames** together aren't allowed.
- **Inline VLANs and the VLANGroupNames** together aren't allowed.
- **IpGroupNames and IpPrefixValues** together aren't allowed.
- **Egress ACLs** won’t support IP options, IP length, fragment, ether-type, DSCP marking, or TTL values.
- **Ingress ACLs** won't support following options: etherType.

## Creating Ingress ACL

To create an Ingress ACL, you can use the following Azure CLI command:

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

### Expected Output:

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

This command creates an Ingress ACL with the specified configurations and outputs the expected result. Adjust the parameters as needed for your use case.

## Creating Egress ACL

To create an Egress ACL, you can utilize the following Azure CLI command:

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

### Expected Output:

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

This command creates an Egress ACL with the specified configurations and outputs the expected result. Adjust the parameters as needed for your use case.

## Updating ARM Reference

This step enables the creation of ACLs (ingress and egress if reference is provided) during the creation of the NNI resource. Post creation of NNI and before fabric provisioning, re-put can be done on NNI.

- `ingressAclId`: Reference ID for ingress ACL
- `egressAclId`: Reference ID for egress ACL

To get ARM resource ID, navigate to the resource group of the subscription used.

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

This command updates the ARM reference for the NNI resource, associating it with the provided ingress and egress ACLs. Adjust the parameters as needed for your use case.

## Show ACL

To display the details of an Access Control List (ACL), use the following command:

```bash
az networkfabric acl show --resource-group "example-rg" --resource-name "example-acl"
```

This command will retrieve and display information about the specified ACL.

## List ACL

To list all Access Control Lists (ACLs) within a resource group, execute the following command:

```bash
az networkfabric acl list --resource-group "ResourceGroupName"
```

This command will list all ACLs present in the specified resource group.

## Create ACL on Isolation Domain External Network

Steps to be performed to create an ACL on an NNI:

1. Create an isolation domain external network ingress and egress ACLs.
2. Update Arm Resource Reference for External Network.

## Create ISD External Network Egress ACL

To create an Egress Access Control List (ACL) for an Isolation Domain External Network, use the following command:

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

This command creates an Egress ACL for the specified Isolation Domain External Network with the provided configuration.

### Expected Output

Upon successful execution, the command will return information about the created ACL in the following format:

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

This output provides details of the created ACL, including its configuration, state, and other relevant information. Adjust the parameters as required for your use case.

## Create ISD External Network Ingress ACL

To create an Ingress Access Control List (ACL) for an Isolation Domain External Network, use the following command:

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

This command creates an Ingress ACL for the specified Isolation Domain External Network with the provided configuration.

### Expected Output

Upon successful execution, the command will return information about the created ACL in the following format:

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

This output provides details of the created ACL, including its configuration, state, and other relevant information. Adjust the parameters as required for your use case.
