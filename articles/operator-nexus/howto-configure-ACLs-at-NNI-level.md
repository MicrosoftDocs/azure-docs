---
title: "Azure Operator Nexus: Configure the ACLs at Network to Network Interconnect (NNI) Level"
description: Learn commands to create, view, list, update the ACLs at NNI level.
author: jdasari
ms.author: jdasari
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 10/23/2023
ms.custom: template-how-to, devx-track-azurecli
---

## Access list at Network to Network Interconnect (NNI)
Access Lists (Permit & Deny) at an NNI Level protect SSH access on Management VPN. The user should apply the Network Access control lists before provisioning the Network Fabric.
The user must create an `Ingress` and `Egress` access lists before creating the NNI resources. The Conforming `Ingress` and or `Egress` access lists must be defined on the Network to Network Interconnect (NNI) payload while the user creates an NNI. This procedure should be carried out by the user before the Network Fabric is provisioned.
## Steps to Create an ACL on an NNI
1. Create Network to Network Interconnect (NNI) ingress and egress ACLs
1. Update Azure Resource Manager (ARM) Resource Reference in Mgmt Network to Network Interconnect (NNI)
1. Create Network to Network Interconnect (NNI) and use the ACL references to provision the Network Fabric	

### Ingress and Egress Access List Parameters
The following Table provides guidance on how to use the parameters,

|Parameter| Description|Example/Range|
|--|--|--|
|defaultAction  | If the user doesn't define a default action, then the traffic is always permitted. Otherwise, the user should define the default action. |"defaultAction": "Permit", |
| resource-group |Resource group of network fabric  |NFResourcegroup  |
| resource-name |Name of ACL  | example-ingressACL |
| vlanGroups |List of vlan groups  |  |
| vlans|List of the matched vlans |  |
| match-configurations| name of the match configuration  | example_acl (space and special character "&" isn't supported)  |
| matchConditions | Match the Conditions |  |
| ttlValues | TTL [Time To Live] | 0-255 |
| dscpMarking |Match the DSCP Markings | 0-63 |
| portCondition |Match the Port condition |  |
| portType |Match the Port type | Example: SourcePort. Allowed values: DestinationPort, SourcePort |
|protocolTypes  |Match the Protocols type|[tcp, udp, range[1-2, 1, 2]] <if protocol number it should be in range of 1 -255>  |
| vlanMatchCondition |Match the Vlan condition|  |
| layer4Protocol |layer4Protocol |should be either of TCP or UDP  |
| ipCondition |Match the IP condition |  |
|actions |Take actions based on the match condition  |Example: permit  |
|configuration-type |configuration type can be inline or by using file as options, however AON supports only inline today  |Example: inline  |

**Note:**

- inline ports and inline vlans are a static way of defining the ports or vlans using azcli.
- The ports and vlans can be dynamically defined as portGroupNames and vlanGroupNames.
- There's no support available for Inline ports and the portGroupNames combination.
- there's no support available for Inline vlans and the vlanGroupNames combination.
- There's no support available for the IpGroupNames and ipPrefixValues combination.

### Create ingress ACL	

```AZURECLI

az networkfabric acl create \
--resource-group "example-resource-group"
--location "eastus"
--resource-name "example-Ipv4ingressACL"
--configuration-type "Inline" 
--default-action "Permit"--dynamic-match-configurations "[{ipGroups:[{name:'example-ipGroup', ipAddressType:IPv4, ipPrefixes:['10.20.3.1/20']}], vlanGroups:[{name:'example-vlanGroup',vlans:['20-30']}],portGroups:[{name:'example-portGroup', ports:['100-200']}]}]"--match-configurations "[{matchConfigurationName:'example-match',sequenceNumber:123,ipAddressType:IPv4,matchConditions:[{etherTypes:['0x1'],fragments:['0xff00-0xffff'],ipLengths:['4094-9214'],ttlValues:[23],dscpMarkings:[32],portCondition:{flags:[established],portType:SourcePort,layer4Protocol:TCP,ports:['1-20']},protocolTypes:[TCP],vlanMatchCondition:{vlans:['20-30'],innerVlans:[30]},ipCondition:{type:SourceIP,prefixType:Prefix,ipPrefixValues:['10.20.20.20/12']}}], actions:[{type: Count,counterName:'example-counter'}]}]"

```
### Expected Output

```AZURECLI
{
  "properties": {
    "lastSyncedTime": "2023-XX-XXT08:56:23.203Z",
    "configurationState": "Succeeded",
    "provisioningState": "Accepted",
    "administrativeState": "Enabled",
    "annotation": "annotation",
    "configurationType": "File",
    "aclsUrl": "https://ACL-Storage-URL",
    "matchConfigurations": [
      {
        "matchConfigurationName": "example-match",
        "sequenceNumber": 123,
        "ipAddressType": "IPv4",
        "matchConditions": [
          {
            "etherTypes": [
              "0x1"
            ],
            "fragments": [
              "0xff00-0xffff"
            ],
            "ipLengths": [
              "4094-9214"
            ],
            "ttlValues": [
              "23"
            ],
            "dscpMarkings": [
              "32"
            ],
            "portCondition": {
              "flags": [
                "established"
              ],
              "portType": "SourcePort",
              "l4Protocol": "TCP",
              "ports": [
                "1-20"
              ],
              "portGroupNames": [
                "example-portGroup"
              ]
            },
            "protocolTypes": [
              "TCP"
            ],
            "vlanMatchCondition": {
              "vlans": [
                "20-30"
              ],
              "innerVlans": [
                "30"
              ],
              "vlanGroupNames": [
                "example-vlanGroup"
              ]
            },
            "ipCondition": {
              "type": "SourceIP",
              "prefixType": "Prefix",
              "ipPrefixValues": [
                "10.20.20.20/12"
              ],
              "ipGroupNames": [
                "example-ipGroup"
              ]
            }
          }
        ],
        "actions": [
          {
            "type": "Count",
            "counterName": "example-counter"
          }
        ]
      }
    ],
  "tags": {
    "keyID": "KeyValue"
  },
  "location": "eastUs",
  "id": "/subscriptions/xxxxxx/resourceGroups/resourcegroupname/providers/Microsoft.ManagedNetworkFabric/accessControlLists/acl,
  "name": "example-Ipv4ingressACL",
  "type": "microsoft.managednetworkfabric/accessControlLists",
  "systemData": {
    "createdBy": "email@address.com",
    "createdByType": "User",
    "createdAt": "20XX-XX-XXT04:51:41.251Z",
    "lastModifiedBy": "UserId",
    "lastModifiedByType": "User",
    "lastModifiedAt": "20XX-XX-XXT04:51:41.251Z"
  }
}
```
### Create Egress ACL	
------------
```
az networkfabric acl create \
--resource-group "example-resource-group"
--location "eastus"
--resource-name "example-Ipv4egressACL"
--configuration-type "File"
--acls-url "https://ACL-Storage-URL"--default-action "Permit"
--dynamic-match-configurations "[{ipGroups:[{name:'example-ipGroup', ipAddressType:IPv4, ipPrefixes:['10.20.3.1/20']}], vlanGroups:[{name:'example-vlanGroup',vlans:['20-30']}],portGroups:[{name:'example-portGroup', ports:['100-200']}]}]"
```
### Expected Output
```
{
  "properties": {
    "lastSyncedTime": "20XX-XX-XXT08:56:23.203Z",
    "configurationState": "Succeeded",
    "provisioningState": "Accepted",
    "administrativeState": "Enabled",
    "annotation": "annotation",
    "configurationType": "File",
    "aclsUrl": "https://ACL-Storage-URL",
    "dynamicMatchConfigurations": [
      {
        "ipGroups": [
          {
            "name": "example-ipGroup",
            "ipAddressType": "IPv4",
            "ipPrefixes": [
              "10.20.3.1/20"
            ]
          }
        ],
        "vlanGroups": [
          {
            "name": "example-vlanGroup",
            "vlans": [
              "20-30"
            ]
          }
        ],
        "portGroups": [
          {
            "name": "example-portGroup",
            "ports": [
              "100-200"
            ]
          }
        ]
      }
    ]
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
    "createdAt": "20XX-XX-XXT04:51:41.251Z",
    "lastModifiedBy": "UserId",
    "lastModifiedByType": "User",
    "lastModifiedAt": "20XX-XX-XXT04:51:41.251Z"
  }
}
```
### Update Azure Resource Manager (ARM) Reference:
The user should reference the `ingress` and `egress` ACLs as part of Network to Network Interconnect (NNI) creation. Prior Provisioning the Network Fabric, the user can perform a re-put on the NNI resource to modify the `ingress` and `egress` ACLs.
- ingressAclId: Reference ID for ingress ACL 
- egressAclId: Reference id for egress ACL
To get Azure Resource Manager (ARM) resource ID navigate to resource group of subscription used on the portal.

```
az networkfabric nni create \
--resource-group "example-rg"
--fabric "example-fabric"
--resource-name "example-nniwithACL"
--nni-type "CE"--is-management-type "True"
--use-option-b "True"
--layer2-configuration "{interfaces:['/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/Microsoft.ManagedNetworkFabric/networkDevices/example-networkDevice/networkInterfaces/example-interface'],mtu:1500}"--option-b-layer3-configuration "{peerASN:28,vlanId:501,primaryIpv4Prefix:'10.18.0.124/30', secondaryIpv4Prefix:'10.18.0.128/30', primaryIpv6Prefix:'10:2:0:124::400/127', secondaryIpv6Prefix:'10:2:0:124::402/127'}"--ingress-acl-id "/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/Microsoft.ManagedNetworkFabric/accesscontrollists/example-Ipv4ingressACL"--egress-acl-id "/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/Microsoft.ManagedNetworkFabric/accesscontrollists/example-Ipv4egressACL"
```
### Show ACL
 ```
az networkfabric acl show --resource-group "example-rg"--resource-name "example-acl"
```
### List ACL
```
az networkfabric acl list--resource-group "ResourceGroupName"
```
## Create ACL on Isolation Domain External Network
Steps to be performed to create an ACL on NNI
1. Create an isolation domain external network ingress and egress ACLs
1. Update Arm Resource Reference for External Network
   
### Create ISD External Network Egress ACL 
```
az networkfabric acl create \
--resource-group "example-rg"
--location "eastus"
--resource-name "example-Ipv4egressACL"
--annotation "annotation"--configuration-type "Inline"
--default-action "Deny"
--match-configurations "[{matchConfigurationName:'L3ISD_EXT_OPTA_EGRESS_ACL_IPV4_CE_PE',sequenceNumber:1110,ipAddressType:IPv4,matchConditions:[{ipCondition:{type:SourceIP,prefixType:Prefix,ipPrefixValues:['10.18.0.124/30','10.18.0.128/30','10.18.30.16/30','10.18.30.20/30']}},{ipCondition:{type:DestinationIP,prefixType:Prefix,ipPrefixValues:['10.18.0.124/30','10.18.0.128/30','10.18.30.16/30','10.18.30.20/30']}}],actions:[{type:Count}]}]"
```
### Expected Output
```
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
    }],
  "name": "example-Ipv4egressACL",
  "provisioningState": "Succeeded",
  "resourceGroup": "example-rg",
  "systemData": {
    "createdAt": "20XX-XX-XXT10:20:20.2617941Z",
    "createdBy": "email@address.com",
    "createdByType": "User",
    "lastModifiedAt": "20XX-XX-XXT10:20:20.2617941Z",
    "lastModifiedBy": "email@address.com",
    "lastModifiedByType": "User"
  },
  "type": "microsoft.managednetworkfabric/accesscontrollists"
}
```
### Create ISD External Network Ingress ACL
```
az networkfabric acl create \
--resource-group "example-rg"
--location "eastus"
--resource-name "example-Ipv4ingressACL"
--annotation "annotation"
--configuration-type "Inline"
--default-action "Deny"
--match-configurations "[{matchConfigurationName:'L3ISD_EXT_OPTA_INGRESS_ACL_IPV4_CE_PE',sequenceNumber:1110,ipAddressType:IPv4,matchConditions:[{ipCondition:{type:SourceIP,prefixType:Prefix,ipPrefixValues:['10.18.0.124/30','10.18.0.128/30','10.18.30.16/30','10.18.30.20/30']}},{ipCondition:{type:DestinationIP,prefixType:Prefix,ipPrefixValues:['10.18.0.124/30','10.18.0.128/30','10.18.30.16/30','10.18.30.20/30']}}],actions:[{type:Count}]}]"
```
### Expected Output
```{
  "administrativeState": "Disabled",
  "annotation": "annotation",
  "configurationState": "Succeeded",
  "configurationType": "Inline",
  "defaultAction": "Deny",
  "id": "/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/Microsoft.ManagedNetworkFabric/accessControlLists/example-Ipv4ingressACL",
  "location": "eastus",
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
    }],
  "name": "example-Ipv4ingressACL",
  "provisioningState": "Succeeded",
  "resourceGroup": "example-rg",
  "systemData": {
    "createdAt": "20XX-XX-XXT10:20:20.2617941Z",
    "createdBy": "email@address.com",
    "createdByType": "User",
    "lastModifiedAt": "20XX-XX-XXT10:27:27.2317467Z",
    "lastModifiedBy": "email@address.com",
    "lastModifiedByType": "User"
  },
  "type": "microsoft.managednetworkfabric/accesscontrollists"
```
### Update Azure Resource Manager (ARM) Reference 
- ingressAclId: Reference id for ingress ACL
- egressAclId: Reference id for egress ACL
```
az networkfabric externalnetwork create 
--resource-group "example-rg"
--l3domain "example-l3domain"
--resource-name "example-externalNetwork"
--peering-option "OptionA"
--option-a-properties "{peerASN:65234,vlanId:501,mtu:1500,primaryIpv4Prefix:'172.23.1.0/31', secondaryIpv4Prefix:'172.23.1.2/31',bfdConfiguration:{multiplier:5,intervalInMilliSeconds:300},ingressAclId:"/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/Microsoft.ManagedNetworkFabric/accesscontrollists/example-Ipv4ingressACL",egressAclId:"/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/Microsoft.ManagedNetworkFabric/accesscontrollists/example-Ipv4egressACL"}"--import-route-policy "{importIpv4RoutePolicyId:'/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/microsoft.managednetworkfabric/routePolicies/example-routepolicy', importIpv6RoutePolicyId:'/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/microsoft.managednetworkfabric/routePolicies/example-routepolicy'}"--export-route-policy "{exportIpv4RoutePolicyId:'/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/microsoft.managednetworkfabric/routePolicies/example-routepolicy', exportIpv6RoutePolicyId:'/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/microsoft.managednetworkfabric/routePolicies/example-routepolicy'}"
```
### Create ACL with IPv6
This section specifically covers the procedure to create ACLs using IPv6 stack,
### Create Isolation Domain Egress ACL with Ipv6

```azureCLI
az networkfabric acl create \
--resource-group "example-rg"
--location "eastus2euap"
--resource-name "example-Ipv6egressACL"
--annotation "annotation"
--configuration-type "Inline"
--default-action "Deny"
--match-configurations "[{matchConfigurationName:'L3ISD_EXT_OPTA_EGRESS_ACL_IPV6_BG_ICMP',sequenceNumber:1160,ipAddressType:IPv6,matchConditions:[{ipCondition:{type:DestinationIP,prefixType:Prefix,ipPrefixValues:['fda0:d59c:db00:1::5/128']}},{protocolTypes:['58']}],actions:[{type:Count}]}]"
```
### Create Isolation Domain Ingress ACL with IPv6

```azureCLI
az networkfabric acl create
--resource-group "example-rg"
--location "eastus2euap"
--resource-name "example-Ipv6ingressACL"
--annotation "annotation"
--configuration-type "Inline"
--default-action "Deny" --match-configurations "[{matchConfigurationName:'L3ISD_EXT_OPTA_INGRESS_ACL_IPV6_BG_ICMP',sequenceNumber:1160,ipAddressType:IPv6,matchConditions:[{ipCondition:{type:SourceIP,prefixType:Prefix,ipPrefixValues:['fda0:d59c:db00:1::5/128']}},{protocolTypes:['58']}],actions:[{type:Count}]}]"
```
### Create NNI Ingress ACL using IPv6

```azureCLI
az networkfabric acl create \
--resource-group "example-rg"
--location "eastus2euap"
--resource-name "example-Ipv6ingressACL"
--configuration-type "Inline"
--default-action "Permit"
--dynamic-match-configurations "[{ipGroups:[{name:'example-ipGroup', ipAddressType:IPv6, ipPrefixes:['fda0:d59c:da02:10::/62']}], vlanGroups:[{name:'example-vlanGroup',vlans:['20-30']}],portGroups:[{name:'example-portGroup', ports:['100-200']}]}]" --match-configurations "[{matchConfigurationName:'example-match',sequenceNumber:123,ipAddressType:IPv6,matchConditions:[{etherTypes:['0x1'],fragments:['0xff00-0xffff'],ipLengths:['4094-9214'],ttlValues:[23],dscpMarkings:[32],portCondition:{flags:[established],portType:SourcePort,layer4Protocol:TCP,ports:['1-20']},protocolTypes:[TCP],vlanMatchCondition:{vlans:['20-30'],innerVlans:[30]},ipCondition:{type:SourceIP,prefixType:Prefix,ipPrefixValues:['fda0:d59c:db02:20::/62']}}], actions:[{type: Count,counterName:'example-counter'}]}]"
```
### Create NNI Ingress ACL using Ipv6

```azureCLI
az networkfabric acl create \
--resource-group "example-rg"
--location "eastus2euap"
--resource-name "example-Ipv6egressACL"
--configuration-type "File"
--acls-url "https://ACL-Storage-URL"
--default-action "Permit"
--dynamic-match-configurations "[{ipGroups:[{name:'example-ipGroup', ipAddressType:IPv6, ipPrefixes:['fda0:c59c:da02:20::/62']}], vlanGroups:[{name:'example-vlanGroup',vlans:['20-30']}],portGroups:[{name:'example-portGroup', ports:['100-200']}]}]"
```
