
#Access list at Network to Network Interconnect
Access Lists (Permit & Deny) at an NNI Level protect SSH access on Management VPN. Network Access control lists should be applied before provisioning the Network Fabric. This limitation is short term.
The user must create an `Ingress` and `Egress` access lists before creating the NNI resources. When the Network to Network Interconnect (NNI) is created, the corresponding Ingress ACL and Egress ACL references should be defined on the NNI payload, so that `ingress ACL` and `egress ACL` would be created. This procedure should be followed before the network fabric is provisioned.
## Steps to Create an ACL on an NNI
1. Create NNI ingress and egress ACLs
1. Update Arm Resource Reference in Mgmt NNI
1. Create NNI and provision the Network Fabric	
### Ingress and Egress Access List Parameters
The following Table provides guidance on how to use the parameters
|Parameter| Description|Example or Range  |
|--|--|--|
|defaultAction  | Defines default action to be taken, if no default action is defined traffic would be permitted |    "defaultAction": "Permit", |
| resource-group |Resource group of network fabric  |NFResourcegroup  |
| resource-name |Name of ACL  | example-ingressACL |
| vlanGroups |List of vlan groups  |  |
|  vlans|List of vlans that needs to be matched  |  |
|  match-configurations| name of match configuration  | example_acl (space and special character "&" isn't supported)  |
| matchConditions | Conditions required to be matched |  |
| ttlValues | TTL [Time To Live] | 0-255 |
| dscpMarking |DSCP Markings that needs to be matched  | 0-63 |
| portCondition |Port condition that needs to be matched |  |
| portType |Port type that needs to be matched | Example: SourcePort. Allowed values: DestinationPort, SourcePort |
|protocolTypes  |Protocols that need to be matched|[tcp, udp, range[1-2, 1, 2]] <if protocol number it should be in range of 1 -255>  |
| vlanMatchCondition |Vlan match condition that needs to be matched |  |
| layer4Protocol |layer4Protocol |should be either of TCP or UDP  |
| ipCondition |IP condition that needs to be matched |  |
|actions |Action to be taken based on match condition  |Example: permit  |
|configuration-type |configuration type can be inline or by using file as options, however AON supports only inline today  |Example: inline  |
Note: 
- inline ports and inline vlans are static way of defining the ports or vlans using azcli.
- portGroupNames and vlanGroupNames are dynamic way of defining ports and vlans.
- Inline ports and the portGroupNames together aren't allowed.
- Inline vlans and the vlanGroupNames together aren't allowed
- IpGroupNames and ipPrefixValues together aren't allowed.
###Create ingress ACL	
-------------
```
az networkfabric acl create 
--resource-group "example-rg"
--location "eastus2euap" 
--resource-name "example-Ipv4ingressACL" 
--configuration-type "Inline" 
--default-action "Permit" 
--dynamic-match-configurations "[{ipGroups:[{name:'example-ipGroup',ipAddressType:IPv4,ipPrefixes:['10.20.3.1/20']}],vlanGroups:[{name:'example-vlanGroup',vlans:['20-30']}],portGroups:[{name:'example-portGroup',ports:['100-200']}]}]" 
--match-configurations "[{matchConfigurationName:'example-match',sequenceNumber:123,ipAddressType:IPv4,matchConditions:[{etherTypes:['0x1'],fragments:['0xff00-0xffff'],ipLengths:['4094-9214'],ttlValues:[23],dscpMarkings:[32],portCondition:{flags:[established],portType:SourcePort,layer4Protocol:TCP,ports:['1-20']},protocolTypes:[TCP],vlanMatchCondition:{vlans:['20-30'],innerVlans:[30]},ipCondition:{type:SourceIP,prefixType:Prefix,ipPrefixValues:['10.20.20.20/12']}}],actions:[{type:Count,counterName:'example-counter'}]}]"
```
###Expected Output
```
{
  "properties": {
    "lastSyncedTime": "2023-06-17T08:56:23.203Z",
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
    "createdAt": "2023-06-09T04:51:41.251Z",
    "lastModifiedBy": "UserId",
    "lastModifiedByType": "User",
    "lastModifiedAt": "2023-06-09T04:51:41.251Z"
  }
}
```
###Create Egress ACL	
------------
```
az networkfabric acl create 
--resource-group "example-rg" 
--location "eastus2euap" 
--resource-name "example-Ipv4egressACL" 
--configuration-type "File" 
--acls-url "https://ACL-Storage-URL" --default-action "Permit" 
--dynamic-match-configurations "[{ipGroups:[{name:'example-ipGroup',ipAddressType:IPv4,ipPrefixes:['10.20.3.1/20']}],vlanGroups:[{name:'example-vlanGroup',vlans:['20-30']}],portGroups:[{name:'example-portGroup',ports:['100-200']}]}]"
```
Expected Output
```
{
  "properties": {
    "lastSyncedTime": "2023-06-17T08:56:23.203Z",
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
    "createdAt": "2023-06-09T04:51:41.251Z",
    "lastModifiedBy": "UserId",
    "lastModifiedByType": "User",
    "lastModifiedAt": "2023-06-09T04:51:41.251Z"
  }
}
```
###Update Azure Resource Manager (ARM) Reference 
This step enables creation of ACLs (ingress and egress if reference is provided) during creation of NNI resource. Post creation of NNI and before fabric provisioning re-put can be done on NNI.
- ingressAclId: Reference ID for ingress ACL 
- egressAclId: Reference id for egress ACL
To get ARM resource ID navigate to resource group of subscription used
```
az networkfabric nni create 
--resource-group "example-rg" 
--fabric "example-fabric" 
--resource-name "example-nniwithACL" 
--nni-type "CE" --is-management-type "True" 
--use-option-b "True" 
--layer2-configuration "{interfaces:['/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/Microsoft.ManagedNetworkFabric/networkDevices/example-networkDevice/networkInterfaces/example-interface'],mtu:1500}" --option-b-layer3-configuration "{peerASN:28,vlanId:501,primaryIpv4Prefix:'10.18.0.124/30',secondaryIpv4Prefix:'10.18.0.128/30',primaryIpv6Prefix:'10:2:0:124::400/127',secondaryIpv6Prefix:'10:2:0:124::402/127'}" --ingress-acl-id "/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/Microsoft.ManagedNetworkFabric/accesscontrollists/example-Ipv4ingressACL" --egress-acl-id "/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/Microsoft.ManagedNetworkFabric/accesscontrollists/example-Ipv4egressACL"
```
###Show ACL
 ```
az networkfabric acl show --resource-group "example-rg" --resource-name "example-acl"
```
### List ACL
```
az networkfabric acl list --resource-group "ResourceGroupName"
```
## Create ACL on Isolation Domain External Network
Steps to performed to create an ACL on NNI
1. Create an isolation domain external network ingress and egress ACLs
1. Update Arm Resource Reference for External Network
###Create ISD External Network Egress ACL 
```
az networkfabric acl create 
--resource-group "example-rg" 
--location "eastus2euap" 
--resource-name "example-Ipv4egressACL" 
--annotation "annotation" --configuration-type "Inline" 
--default-action "Deny" 
--match-configurations "[{matchConfigurationName:'L3ISD_EXT_OPTA_EGRESS_ACL_IPV4_CE_PE',sequenceNumber:1110,ipAddressType:IPv4,matchConditions:[{ipCondition:{type:SourceIP,prefixType:Prefix,ipPrefixValues:['10.18.0.124/30','10.18.0.128/30','10.18.30.16/30','10.18.30.20/30']}},{ipCondition:{type:DestinationIP,prefixType:Prefix,ipPrefixValues:['10.18.0.124/30','10.18.0.128/30','10.18.30.16/30','10.18.30.20/30']}}],actions:[{type:Count}]}]"
```
###Expected Output
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
###Create ISD External Network Ingress ACL
```
az networkfabric acl create 
--resource-group "example-rg" 
--location "eastus2euap" 
--resource-name "example-Ipv4ingressACL" 
--annotation "annotation" 
--configuration-type "Inline" 
--default-action "Deny" 
--match-configurations "[{matchConfigurationName:'L3ISD_EXT_OPTA_INGRESS_ACL_IPV4_CE_PE',sequenceNumber:1110,ipAddressType:IPv4,matchConditions:[{ipCondition:{type:SourceIP,prefixType:Prefix,ipPrefixValues:['10.18.0.124/30','10.18.0.128/30','10.18.30.16/30','10.18.30.20/30']}},{ipCondition:{type:DestinationIP,prefixType:Prefix,ipPrefixValues:['10.18.0.124/30','10.18.0.128/30','10.18.30.16/30','10.18.30.20/30']}}],actions:[{type:Count}]}]"
```
###Expected Output
```{
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
```
###Update Arm reference 
- ingressAclId: Reference id for ingress ACL
- egressAclId: Reference id for egress ACL
```
az networkfabric externalnetwork create 
--resource-group "example-rg" 
--l3domain "example-l3domain" 
--resource-name "example-externalNetwork" 
--peering-option "OptionA" 
--option-a-properties "{peerASN:65234,vlanId:501,mtu:1500,primaryIpv4Prefix:'172.23.1.0/31',secondaryIpv4Prefix:'172.23.1.2/31',bfdConfiguration:{multiplier:5,intervalInMilliSeconds:300},ingressAclId:"/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/Microsoft.ManagedNetworkFabric/accesscontrollists/example-Ipv4ingressACL",egressAclId:"/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/Microsoft.ManagedNetworkFabric/accesscontrollists/example-Ipv4egressACL"}" --import-route-policy "{importIpv4RoutePolicyId:'/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/microsoft.managednetworkfabric/routePolicies/example-routepolicy',importIpv6RoutePolicyId:'/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/microsoft.managednetworkfabric/routePolicies/example-routepolicy'}" --export-route-policy "{exportIpv4RoutePolicyId:'/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/microsoft.managednetworkfabric/routePolicies/example-routepolicy',exportIpv6RoutePolicyId:'/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/microsoft.managednetworkfabric/routePolicies/example-routepolicy'}"
```
###Create ACL with IPv6
This section provides guidance on creating ACL's using IPv6 addressing. Please note that all examples shared in sections above support dual stack IP addressing as well. This section covers Ipv6 only examples
###Create Isolation Domain Egress ACL with Ipv6

```az cli
az networkfabric acl create 
--resource-group "example-rg" 
--location "eastus2euap" 
--resource-name "example-Ipv6egressACL" 
--annotation "annotation" 
--configuration-type "Inline" 
--default-action "Deny" 
--match-configurations "[{matchConfigurationName:'L3ISD_EXT_OPTA_EGRESS_ACL_IPV6_BG_ICMP',sequenceNumber:1160,ipAddressType:IPv6,matchConditions:[{ipCondition:{type:DestinationIP,prefixType:Prefix,ipPrefixValues:['fda0:d59c:db00:1::5/128']}},{protocolTypes:['58']}],actions:[{type:Count}]}]"
```
###Create Isolation Domain Ingress ACL with IPv6

```az cli
az networkfabric acl create 
--resource-group "example-rg" 
--location "eastus2euap" 
--resource-name "example-Ipv6ingressACL" 
--annotation "annotation" 
--configuration-type "Inline" 
--default-action "Deny" --match-configurations "[{matchConfigurationName:'L3ISD_EXT_OPTA_INGRESS_ACL_IPV6_BG_ICMP',sequenceNumber:1160,ipAddressType:IPv6,matchConditions:[{ipCondition:{type:SourceIP,prefixType:Prefix,ipPrefixValues:['fda0:d59c:db00:1::5/128']}},{protocolTypes:['58']}],actions:[{type:Count}]}]"
```
###Create NNI Ingress ACL using IPv6

```az cli
az networkfabric acl create 
--resource-group "example-rg" 
--location "eastus2euap" 
--resource-name "example-Ipv6ingressACL" 
--configuration-type "Inline" 
--default-action "Permit" 
--dynamic-match-configurations "[{ipGroups:[{name:'example-ipGroup',ipAddressType:IPv6,ipPrefixes:['fda0:d59c:da02:10::/62']}],vlanGroups:[{name:'example-vlanGroup',vlans:['20-30']}],portGroups:[{name:'example-portGroup',ports:['100-200']}]}]" --match-configurations "[{matchConfigurationName:'example-match',sequenceNumber:123,ipAddressType:IPv6,matchConditions:[{etherTypes:['0x1'],fragments:['0xff00-0xffff'],ipLengths:['4094-9214'],ttlValues:[23],dscpMarkings:[32],portCondition:{flags:[established],portType:SourcePort,layer4Protocol:TCP,ports:['1-20']},protocolTypes:[TCP],vlanMatchCondition:{vlans:['20-30'],innerVlans:[30]},ipCondition:{type:SourceIP,prefixType:Prefix,ipPrefixValues:['fda0:d59c:db02:20::/62']}}],actions:[{type:Count,counterName:'example-counter'}]}]"
```
###Create NNI Ingress ACL using Ipv6

```az cli
az networkfabric acl create 
--resource-group "example-rg" 
--location "eastus2euap" 
--resource-name "example-Ipv6egressACL" 
--configuration-type "File" 
--acls-url "https://ACL-Storage-URL" 
--default-action "Permit" 
--dynamic-match-configurations "[{ipGroups:[{name:'example-ipGroup',ipAddressType:IPv6,ipPrefixes:['fda0:c59c:da02:20::/62']}],vlanGroups:[{name:'example-vlanGroup',vlans:['20-30']}],portGroups:[{name:'example-portGroup',ports:['100-200']}]}]"
```
###Note :Update ARM Reference in NNI and External Network step is required in similar way as it's done for Ipv4. To get Azure Resource Manager (ARM) resource ID navigate to resource group of subscription used