---
title: "Azure Operator Nexus: Configure the network packet broker"
description: Learn commands to create, view network packet broker's TAPRule.
author: jdasari
ms.author: jdasari
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 10/20/2023
ms.custom: template-how-to, devx-track-azurecli
---

# Network Packet Broker
Azure Operator Nexus's Network Packet Broker is a specialized offering from Microsoft Azure tailored for telecommunication service providers. With Azure Operator Nexus's Network Packet Broker, telecom operators can efficiently capture, aggregate, filter, and monitor traffic across their infrastructure (AON), allowing for deep packet inspection, traffic analysis, and enhanced network monitoring. This is particularly crucial in the telecommunications industry, where maintaining high-quality service, ensuring security, and complying with regulatory requirements are paramount. By leveraging this solution, operators can achieve better visibility into their network traffic, troubleshoot issues more effectively, and ultimately deliver improved services to their customers while maintaining the highest standards of network security and performance. 

The NPB has been designed and modeled as a separate top level Azure Resource Manager (ARM) resource under Microsoft.managednetworkfabric. Operators can Create, Read, Update and Delete Network TAP, Network TAP rule and Neighbor Group functions. Each network packet broker will have multiple resources such as Network TAP, Neighbor Group, & Network TAP Rules to manage, filter and forward designated traffic. 

## Steps to Enable Network Packet Broker

**Prerequisites**

- NPB devices are correctly racked, stacked, and provisioned. For Procedure on how to provision the network fabric, see [Network Fabric Provisioning](./howto-configure-network-fabric.md).
- Respective vProbes should be set up with dedicated IPs
- For internal vProbes, Layer 3 Isolation domains with internal networks should be created. Required connected subnets should be configured, in addition to it, the extension flag should be set to NPB (in internal networks). For Procedure on how to create internal and external networks on an Isolation Domain and set extension flag for NPB, see [Isolation Domains](./howto-configure-isolation-domain.md).
- For the Network to Network Inter-connect (NNI) use case, NNI should be created as type `NPB`. Appropriate layer 2 and layer 3 properties should be defined during the creation of NNI. For Procedure on how to create the network to network interconnect (NNI), see [Network Fabric Provisioning](./howto-configure-network-fabric.md).

**Steps**
1. Create a Network TAP rule providing the match configuration (only inline input method is supported)
1. Create a Neighbor Group resource defining destinations. 
1. Create a Network TAP resource referencing the Tap rules and Neighbor Groups.
1. Enable the Network TAP resource.
###  NPB
This resource would be auto-created by NNF during bootstrap.
### Show NPB
This command shows the details of NPB logical resource.
```azurecli
 az networkfabric npb show --resource-group "example-rg" --resource-name "NPB1"
```
Expected Output
```azurecli
{
  "properties": {
    "networkFabricId": "/subscriptions/1234ABCD-0A1B-1234-5678-123456ABCDEF/resourcegroups/example-rg/providers/Microsoft.ManagedNetworkFabric/networkFabrics/example-networkFabric",
    "networkDeviceIds": [
      "/subscriptions/1234ABCD-0A1B-1234-5678-123456ABCDEF/resourcegroups/example-rg/providers/Microsoft.ManagedNetworkFabric/networkDevices/example-networkDevice"
    ],
    "sourceInterfaceIds": [
      "/subscriptions/1234ABCD-0A1B-1234-5678-123456ABCDEF/resourcegroups/example-rg/providers/Microsoft.ManagedNetworkFabric/networkDevices/example-networkDevice/networkInterfaces/example-networkInterface"
    ],
    "networkTapIds": [
      "/subscriptions/1234ABCD-0A1B-1234-5678-123456ABCDEF/resourcegroups/example-rg/providers/Microsoft.ManagedNetworkFabric/networkTaps/example-networkTap"
    ],
    "neighborGroupIds": [
      "/subscriptions/1234ABCD-0A1B-1234-5678-123456ABCDEF/resourcegroups/example-rg/providers/Microsoft.ManagedNetworkFabric/neighborGroups/example-neighborGroup"
    ],
    "provisioningState": "Succeeded"
  },
  "tags": {
    "key2806": "key"
  },
  "location": "eastuseuap",
  "id": "/subscriptions/1234ABCD-0A1B-1234-5678-123456ABCDEF/resourcegroups/example-rg/providers/Microsoft.ManagedNetworkFabric/networkPacketBrokers/example-networkPacketBroker",
  "name": "example-networkPacketBroker",
  "type": "microsoft.managednetworkfabric/networkPacketBrokers",
  "systemData": {
    "createdBy": "email@address.com",
    "createdByType": "User",
    "createdAt": "2023-05-17T11:56:12.100Z",
    "lastModifiedBy": "email@address.com",
    "lastModifiedByType": "User",
    "lastModifiedAt": "2023-05-17T11:56:12.100Z"
  }
}
```
## Network TAP Rules
NetworkTapRule resource provides ability for providing filtering and forwarding combinations of conditions and actions. 
### Parameters for Network TAP Rules
| Parameter | Description | Example | Required |
|-----------|-------------|---------|----------|
| resource-group | Use an appropriate resource group name specifically for your NetworkTapRule |  ResourceGroupName |True |
| resource-name | Resource Name of the Network Tap |  InternetTAPrule1 |True |
| location | AzON Azure Region used during NFC Creation |  eastus |True |
| configuration-type | Input method to configure Network Tap Rule. | Inline or File|True |
| match-configurations |List of match configurations.|  ||
| match-configurations/matchconfigurationName|Name of Match configuration block |  | |
| match-configurations/sequenceNumber|Sequence number of Match configuration |  | |
| match-configurations/ipAddressType|Ip address family |  | |
| match-configurations/matchconditions|List of dynamic match conditions based on port, protocol, Vlan & Ip conditions. |  | |
| match-configurations/action|Provide action details. Actions can be Drop, Count, Log,Goto,Redirect,Mirror|  | |
| dynamic-match-configurations|List of dynamic match configurations based Port, Vlan & IP |  | |
> [!NOTE]
> Network Tap rules and Neighbor Groups must be created prior to refrencing them in Network Tap 
### Create Network Tap Rule
This command creates a Network Tap rule:
```azurecli
az networkfabric taprule create --resource-group "example-rg" --location "westus3"--resource-name "example-networktaprule"\
 --configuration-type "Inline" \
 --match-configurations "[{matchConfigurationName:config1,sequenceNumber:10,ipAddressType:IPv4,matchConditions:[{encapsulationType:None,portCondition:{portType:SourcePort,layer4Protocol:TCP,ports:[100],portGroupNames:['example-portGroup1']},protocolTypes:[TCP],vlanMatchCondition:{vlans:['10'],innerVlans:['11-20']},ipCondition:{type:SourceIP,prefixType:Prefix,ipPrefixValues:['10.10.10.10/20']}}],\
 actions:[{type:Drop,truncate:100,isTimestampEnabled:True,destinationId:'/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourcegroups/example-rg/providers/Microsoft.ManagedNetworkFabric/neighborGroups/example-neighborGroup',matchConfigurationName:match1}]}]"\
 --dynamic-match-configurations"[{ipGroups:[{name:'example-ipGroup1',ipAddressType:IPv4,ipPrefixes:['10.10.10.10/30']}],vlanGroups:[{name:'exmaple-vlanGroup',vlans:['10']}],portGroups:[{name:'example-portGroup1',ports:['100-200']}]}]"
```
Expected output:
```output
{
  "properties": {
    "networkTapId": "/subscriptions/1234ABCD-0A1B-1234-5678-123456ABCDEF/resourcegroups/example-rg/providers/Microsoft.ManagedNetworkFabric/networkTaps/example-taprule",
    "pollingIntervalInSeconds": 30,
    "lastSyncedTime": "2023-06-12T07:11:22.485Z",
    "configurationState": "Succeeded",
    "provisioningState": "Accepted",
    "administrativeState": "Enabled",
    "annotation": "annotation",
    "configurationType": "Inline",
    "tapRulesUrl": "",
    "matchConfigurations": [
      {
        "matchConfigurationName": "config1",
        "sequenceNumber": 10,
        "ipAddressType": "IPv4",
        "matchConditions": [
          {
            "encapsulationType": "None",
            "portCondition": {
              "portType": "SourcePort",
              "l4Protocol": "TCP",
              "ports": [
                "100"
              ],
              "portGroupNames": [
                "example-portGroup1"
              ]
            },
            "protocolTypes": [
              "TCP"
            ],
            "vlanMatchCondition": {
              "vlans": [
                "10"
              ],
              "innerVlans": [
                "11-20"
              ],
              "vlanGroupNames": [
                "exmaple-vlanGroup"
              ]
            },
            "ipCondition": {
              "type": "SourceIP",
              "prefixType": "Prefix",
              "ipPrefixValues": [
                "10.10.10.10/20"
              ],
              "ipGroupNames": [
                "example-ipGroup"
              ]
            }
          }
        ],
        "actions": [
          {
            "type": "Drop",
            "truncate": "100",
            "isTimestampEnabled": "True",
            "destinationId": "/subscriptions/1234ABCD-0A1B-1234-5678-123456ABCDEF/resourcegroups/example-rg/providers/Microsoft.ManagedNetworkFabric/neighborGroups/example-neighborGroup",
            "matchConfigurationName": "match1"
          }
        ]
      }
    ],
    "dynamicMatchConfigurations": [
      {
        "ipGroups": [
          {
            "name": "example-ipGroup1",
            "ipPrefixes": [
              "10.10.10.10/30"
            ]
          }
        ],
        "vlanGroups": [
          {
            "name": "exmaple-vlanGroup",
            "vlans": [
              "10",
              "100-200"
            ]
          }
        ],
        "portGroups": [
          {
            "name": "example-portGroup1",
            "ports": [
              "100-200"
            ]
          },
          {
            "name": "example-portGroup2",
            "ports": [
              "900",
              "1000-2000"
            ]
          }
        ]
      }
    ]
  },
  "tags": {
    "keyID": "keyValue"
  },
  "location": "eastuseuap",
  "id": "/subscriptions/1234ABCD-0A1B-1234-5678-123456ABCDEF/resourcegroups/example-rg/providers/Microsoft.ManagedNetworkFabric/networkTapRules/example-tapRule",
  "name": "example-tapRule",
  "type": "microsoft.managednetworkfabric/networkTapRules",
  "systemData": {
    "createdBy": "email@address.com",
    "createdByType": "User",
    "createdAt": "2023-06-12T07:11:22.488Z",
    "lastModifiedBy": "user@mail.com",
    "lastModifiedByType": "User",
    "lastModifiedAt": "2023-06-12T07:11:22.488Z"
  }
}
```
### Show Network Tap Rule
This command displays an IP community resource:
```azurecli
az networkfabric taprule show --resource-group "example-rg" --resource-name "example-networktaprule"
```
Expected output:
```output
{
  "properties": {
    "networkTapId": "/subscriptions/1234ABCD-0A1B-1234-5678-123456ABCDEF/resourcegroups/example-rg/providers/Microsoft.ManagedNetworkFabric/networkTaps/example-taprule",
    "pollingIntervalInSeconds": 30,
    "lastSyncedTime": "2023-06-12T07:11:22.485Z",
    "configurationState": "Succeeded",
    "provisioningState": "Accepted",
    "administrativeState": "Enabled",
    "annotation": "annotation",
    "configurationType": "Inline",
    "tapRulesUrl": "",
    "matchConfigurations": [
      {
        "matchConfigurationName": "config1",
        "sequenceNumber": 10,
        "ipAddressType": "IPv4",
        "matchConditions": [
          {
            "encapsulationType": "None",
            "portCondition": {
              "portType": "SourcePort",
              "l4Protocol": "TCP",
              "ports": [
                "100"
              ],
              "portGroupNames": [
                "example-portGroup1"
              ]
            },
            "protocolTypes": [
              "TCP"
            ],
            "vlanMatchCondition": {
              "vlans": [
                "10"
              ],
              "innerVlans": [
                "11-20"
              ],
              "vlanGroupNames": [
                "exmaple-vlanGroup"
              ]
            },
            "ipCondition": {
              "type": "SourceIP",
              "prefixType": "Prefix",
              "ipPrefixValues": [
                "10.10.10.10/20"
              ],
              "ipGroupNames": [
                "example-ipGroup"
              ]
            }
          }
        ],
        "actions": [
          {
            "type": "Drop",
            "truncate": "100",
            "isTimestampEnabled": "True",
            "destinationId": "/subscriptions/1234ABCD-0A1B-1234-5678-123456ABCDEF/resourcegroups/example-rg/providers/Microsoft.ManagedNetworkFabric/neighborGroups/example-neighborGroup",
            "matchConfigurationName": "match1"
          }
        ]
      }
    ],
    "dynamicMatchConfigurations": [
      {
        "ipGroups": [
          {
            "name": "example-ipGroup1",
            "ipPrefixes": [
              "10.10.10.10/30"
            ]
          }
        ],
        "vlanGroups": [
          {
            "name": "exmaple-vlanGroup",
            "vlans": [
              "10",
              "100-200"
            ]
          }
        ],
        "portGroups": [
          {
            "name": "example-portGroup1",
            "ports": [
              "100-200"
            ]
          },
          {
            "name": "example-portGroup2",
            "ports": [
              "900",
              "1000-2000"
            ]
          }
        ]
      }
    ]
  },
  "tags": {
    "keyID": "keyValue"
  },
  "location": "eastuseuap",
  "id": "/subscriptions/1234ABCD-0A1B-1234-5678-123456ABCDEF/resourcegroups/example-rg/providers/Microsoft.ManagedNetworkFabric/networkTapRules/example-tapRule",
  "name": "example-tapRule",
  "type": "microsoft.managednetworkfabric/networkTapRules",
  "systemData": {
    "createdBy": "email@address.com",
    "createdByType": "User",
    "createdAt": "2023-06-12T07:11:22.488Z",
    "lastModifiedBy": "user@mail.com",
    "lastModifiedByType": "User",
    "lastModifiedAt": "2023-06-12T07:11:22.488Z"
  }
}
```
## Neighbor group
Neighbor Group resource has the ability to group destinations for forwarding the filtered traffic
### Parameters for Neighbor Group
| Parameter | Description | Example | Required |
|-----------|-------------|---------|----------|
| resource-group | Use an appropriate resource group name specifically for your NeighborGroup |  ResourceGroupName |True |
| resource-name | Resource Name of the NeighborGroup |  example-Neighbor |True |
| location | AzON Azure Region used during NFC Creation |  eastus |True |
| destination |List of Ipv4 or Ipv6 destinations to forward traffic | 10.10.10.10|True |
### Create Neighbor group
This command creates a Neighbor Group resource:
```azurecli
 az networkfabric neighborgroup create --resource-group "example-rg" --location "westus3"
--resource-name "example-neighborgroup" --destination "{ipv4Addresses:['10.10.10.10']}"
```
Expected output:
```output
{
  "properties": {
    "networkTapIds": [
    ],
    "networkTapRuleIds": [
    ],
    "destination": {
      "ipv4Addresses": [
        "10.10.10.10",
      ]
    },
    "provisioningState": "Succeeded",
    "annotation": "annotation"
  },
  "tags": {
    "keyID": "KeyValue"
  },
  "location": "eastus",
  "id": "/subscriptions/subscriptionId/resourceGroups/example-rg/providers/Microsoft.ManagedNetworkFabric/neighborGroups/example-neighborGroup",
  "name": "example-neighborGroup",
  "type": "microsoft.managednetworkfabric/neighborGroups",
  "systemData": {
    "createdBy": "user@mail.com",
    "createdByType": "User",
    "createdAt": "2023-05-23T05:49:59.193Z",
    "lastModifiedBy": "email@address.com",
    "lastModifiedByType": "User",
    "lastModifiedAt": "2023-05-23T05:49:59.194Z"
  }
}
```
### Show Neighbor group resource
This command displays an IP extended community resource:
```azurecli
 az networkfabric neighborgroup show --resource-group "example-rg" --resource-name "example-neighborgroup"
```
Expected output:
```output
{
  "properties": {
    "networkTapIds": [
    ],
    "networkTapRuleIds": [
    ],
    "destination": {
      "ipv4Addresses": [
        "10.10.10.10",
      ]
    },
    "provisioningState": "Succeeded",
    "annotation": "annotation"
  },
  "tags": {
    "keyID": "KeyValue"
  },
  "location": "eastus",
  "id": "/subscriptions/subscriptionId/resourceGroups/example-rg/providers/Microsoft.ManagedNetworkFabric/neighborGroups/example-neighborGroup",
  "name": "example-neighborGroup",
  "type": "microsoft.managednetworkfabric/neighborGroups",
  "systemData": {
    "createdBy": "user@mail.com",
    "createdByType": "User",
    "createdAt": "2023-05-23T05:49:59.193Z",
    "lastModifiedBy": "email@address.com",
    "lastModifiedByType": "User",
    "lastModifiedAt": "2023-05-23T05:49:59.194Z"
  }
}
```
## Network TAP
Network TAP allows Operators to define destinations and encapsulation mechanism to forward filtered traffic based on the Network TAP Rules
### Parameters for Network TAP
| Parameter | Description | Example | Required |
|-----------|-------------|---------|----------|
| resource-group | Use an appropriate resource group name specifically for your Network Tap |  ResourceGroupName |True |
| resource-name | Resource Name of the Network Tap |  NetworkTAP-Austin |True |
| location | AzON Azure Region used during NFC Creation | eastus |True |
| network-packet-broker-id  | ARMID of Network Packet Broker resource |   |True |
| polling-type | Polling method for Network Tap rules (Push or Pull)|  Pull|True |
| destination |Destination definitions|  |True |
| destination/name | name of destination |  ||
| destination/type| type of destination.IsolationDomain or NNI |   ||
| destination/IsolationDomainProperties| Details of Isolation domain. Encapsulation, Neighbor group IDs | Azure Resource Manager (ARM) ID of internal network or NNI  |False|
| destinationTapRuleId| ARMID of the Tap rule, which needs to be applied | |True |
### Create Network TAP
This command creates  network Tap resource:
```azurecli
az networkfabric tap create --resource-group "example-rg" --location "westus3" \
--resource-name "example-networktap" \
--network-packet-broker-id "/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourcegroups/example-rg/providers/Microsoft.ManagedNetworkFabric/networkPacketBrokers/example-networkPacketBroker" \
--polling-type "Pull"\
--destinations "[{name:'example-destinationName',destinationType:IsolationDomain,destinationId:'/subscriptions/xxxxx/resourcegroups/example-rg/providers/Microsoft.ManagedNetworkFabric/l3IsloationDomains/example-l3Domain/internalNetworks/example-internalNetwork',\
isolationDomainProperties:{encapsulation:None,neighborGroupIds:['/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourcegroups/example-rg/providers/Microsoft.ManagedNetworkFabric/neighborGroups/example-neighborGroup']},\
```
