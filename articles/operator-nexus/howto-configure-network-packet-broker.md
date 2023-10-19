# Network Packet Broker
Network Packet Broker allows operators to efficiently capture, aggregate, filter, and monitor traffic in an Azure Operator Nexus instance. 
The solution helps operators to monitor large complex networks and provide network-level visibility to aid with service planning and troubleshooting of service problems. 
It also plays a vital role in enhancing troubleshooting capabilities and enabling organizations to maintain the optimal performance and security of their networks.
NPB is modelled as a separate top level ARM resource under Microsoft.managednetworkfabric. 
Operators can Create, Read, Update and Delete functions. Each NPB will have multiple resources such as Network TAP, Neighbor Group, & Network TAP Rules to manage, filter and forward designated traffic. 

## Steps to Enable Network Packet Broker
**Prequisties**
1. NPB device is racked and stacked and Network fabric is provisoned
2. Respective vProbes are setup with dedicated IPs
3. For internal vProbes Layer 3 Isolation domains with internal networks are created, configuring required connected subnets and extension flag set to NPB (in internal networks)
4. For NNI use case NNI is created of type NPB and required Layer2 and Layer 3 properties are defined 
**Steps**
1. Create a Network TAP rule providing the match configuration (currently only inline input method is supported)
2. Create a Neigbor Group resource defining destinations. 
3. Create a Network TAP resource refrencing the Tap rules and Neigbor Groups.
4. Enable the Network TAP resource.
###  NPB
This resource is auto-created by NNF during bootstrap
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
| match-configurations/matchconditions|List of dynamic match conditions based on port,protocol,Vlan & Ip conditions. |  | |
| match-configurations/action|Provide action details.Actions can be Drop,Count,Log,Goto,Redirect,Mirror|  | |
| dynamic-match-configurations|List of dynamic match configurations based Port,Vlan & IP |  | |
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
Neighbor Group resource provides the ability to group destinations for forwarding the filtered traffic
### Parameters for Neigbor Group
| Parameter | Description | Example | Required |
|-----------|-------------|---------|----------|
| resource-group | Use an appropriate resource group name specifically for your NeighborGroup |  ResourceGroupName |True |
| resource-name | Resource Name of the NeighborGroup |  example-Neighbor |True |
| location | AzON Azure Region used during NFC Creation |  eastus |True |
| destination |List of Ipv4 or Ipv6 destinations to forward traffic | 10.10.10.10|True |
### Create Neighbor group
This command creates an Neighbor Group resource:
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
### Show Neigbor group resource
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
Network TAP allows Operators to provide define destinations and encapsulation mechanisms to forward filtered traffic based on Network tap Rules
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
| destination/IsolationDomainProperties| Details of Isolation domain.Encapsulation,Neighbor group IDs | ARM ID of internal network or NNI  |False|
| destinationTapRuleId| ARMID of the Tap rule which need to be applied | |True |
### Create Network TAP
This command creates  network Tap resource:
```azurecli
az networkfabric tap create --resource-group "example-rg" --location "westus3" \
--resource-name "example-networktap" \
--network-packet-broker-id "/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourcegroups/example-rg/providers/Microsoft.ManagedNetworkFabric/networkPacketBrokers/example-networkPacketBroker" \
--polling-type "Pull"\
--destinations "[{name:'example-destinationName',destinationType:IsolationDomain,destinationId:'/subscriptions/xxxxx/resourcegroups/example-rg/providers/Microsoft.ManagedNetworkFabric/l3IsloationDomains/example-l3Domain/internalNetworks/example-internalNetwork',\
isolationDomainProperties:{encapsulation:None,neighborGroupIds:['/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourcegroups/example-rg/providers/Microsoft.ManagedNetworkFabric/neighborGroups/example-neighborGroup']},\
