---
title: "Azure Operator Nexus: Configure the network fabric"
description: Learn commands to create, view, list, update, and delete network fabrics.
author: jdasari
ms.author: jdasari
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 07/20/2023
ms.custom: template-how-to, devx-track-azurecli
---

# Create and Provision a Network Fabric using Azure CLI

This article describes how to create a Network Fabric by using the Azure Command Line Interface (AzCLI). This document also shows you how to check the status, update, or delete a Network Fabric.


## Prerequisites

* An Azure account with an active subscription.
* Install the latest version of the CLI commands (2.0 or later). For information about installing the CLI commands, see [Install Azure CLI](./howto-install-cli-extensions.md)
* A Network Fabric controller manages multiple Network Fabrics on the same Azure region.
* Physical Operator-Nexus instance with cabling as per BoM.
* Express Route connectivity between NFC and Operator-Nexus instances.
* Terminal server pre-configured with username and password [installed and configured](./howto-platform-prerequisites.md#set-up-terminal-server)
* PE devices pre-configured with necessary VLANs, Route-Targets and IP addresses.
* Supported SKUs from NFA Release 2.4 and beyond for Fabric are **M4-A400-A100-C16-ab**, **M8-A400-A100-C16-ab**, **M4-A400-A100-C16-aa** and **M8-A400-A100-C16-aa**.
    * M4-A400-A100-C16-aa - up to four compute racks (BOM 1.6.2)
    * M8-A400-A100-C16-aa - up to eight compute racks (BOM 1.6.2)
    * M4-A400-A100-C16-ab - Up to four Compute Racks (BOM 1.7.3)
    * M8-A400-A100-C16-ab - Up to eight Compute Racks (BOM 1.7.3)

## Steps to Provision a Fabric & Racks

* Create a Network Fabric by providing racks, server count, SKU & network configuration.
* Create a Network to Network Interconnect by providing Layer2 & Layer 3 Parameters
* Update the serial number in the networkDevice resource with the actual serial number on the device.
* Configure the terminal server with the serial numbers of all the devices.
* Provision the Network Fabric.


## Fabric Configuration

The following table specifies parameters used to create Network Fabric,

**$prefix:** /subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkFabricControllers

| Parameter | Description | Example | Required | Type|
|-----------|-------------|---------|----------|----------|
| resource-group | Name of the resource group |  "NFResourceGroup" |True |
| location | Operator-Nexus Azure region | "eastus" |True | 
| resource-name | Name of the FabricResource | NF-ResourceName |True |
|  nf-sku  |Fabric SKU ID is the SKU of the ordered BoM. Four SKUs are supported (**M4-A400-A100-C16-aa**, **M8-A400-A100-C16-aa**, **M4-A400-A100-C16-ab** and **M8-A400-A100-C16-ab**). | M4-A400-A100-C16-ab |True | String|
|nfc-id|Network Fabric Controller "ARM resource ID"|**$prefix**/NFCName|True | |
|rackcount|Number of compute racks per fabric. Possible values are 2-8|8|True | 
|serverCountPerRack|Number of compute servers per rack. Possible values are 4, 8, 12 or 16|16|True | 
|ipv4Prefix|IPv4 Prefix of the management network. This Prefix should be unique across all Network Fabrics in a Network Fabric Controller. Prefix length should be at least 19 (/20 isn't allowed, /18 and lower are allowed) | 10.246.0.0/19|True |
|ipv6Prefix|IPv6 Prefix of the management network. This Prefix should be unique across all Network Fabrics in a Network Fabric Controller. | 10:5:0:0::/59|True |
|**management-network-config**| Details of management network ||True |
|**infrastructureVpnConfiguration**| Details of management VPN connection between Network Fabric and infrastructure services in Network Fabric Controller||True
|*optionBProperties*| Details of MPLS option 10B is used for connectivity between Network Fabric and Network Fabric Controller||True|
|importRouteTargets|Route targets are now defined for specific IP subnet class, such as IPv4 and IPv6. Values of import route targets to be configured on CEs for exchanging routes between CE & PE via MPLS option 10B, |e.g.,  65048:10039|True(If OptionB enabled)|
|exportRouteTargets|Route targets are now defined for specific IP subnet class, such as IPv4 and IPv6. Values of export route targets to be configured on CEs for exchanging routes between CE & PE via MPLS option 10B|e.g.,  65048:10039|True(If OptionB enabled)|
|**workloadVpnConfiguration**| Details of workload VPN connection between Network Fabric and workload services in Network Fabric Controller||
|*optionBProperties*| Details of MPLS option 10B is used for connectivity between Network Fabric and Network Fabric Controller||
|importRouteTargets|Route targets are now defined for specific IP subnet class, such as IPv4 and IPv6. Values of import route targets to be configured on CEs for exchanging routes between CE & PE via MPLS option 10B|e.g., 65048:10050|True(If OptionB enabled)|
|exportRouteTargets|Route targets are now defined for specific IP subnet class, such as IPv4 and IPv6. Values of export route targets to be configured on CEs for exchanging routes between CE & PE via MPLS option 10B|e.g., 65048:10050|True(If OptionB enabled)|
|**ts-config**| Terminal Server Configuration Details||True
|primaryIpv4Prefix| The terminal server Net1 interface should be assigned the first usable IP from the prefix and the corresponding interface on PE should be assigned the second usable address|20.0.10.0/30, TS Net1 interface should be assigned 20.0.10.1 and PE interface 20.0.10.2|True|
|secondaryIpv4Prefix|IPv4 Prefix for connectivity between TS and PE2. The terminal server Net2 interface should be assigned the first usable IP from the prefix and the corresponding interface on PE should be assigned the second usable address|20.0.0.4/30, TS Net2 interface should be assigned 20.0.10.5 and PE interface 20.0.10.6|True|
|username| Username configured on the terminal server that the services use to configure TS|username|True|
|password| Password configured on the terminal server that the services use to configure TS|password|True|
|serialNumber| Serial number of Terminal Server|SN of the Terminal Server||


## Create a Network Fabric 

Resource group must be created before Network Fabric creation. It's recommended to create a separate resource group for each Network Fabric. Resource group can be created by the following command:

```azurecli
az group create -n NFResourceGroup -l "East US"
```
Run the following command to create the Network Fabric:

```azurecli

az networkfabric fabric create \ 
--resource-group "NFResourceGroupName" 
--location "eastus" \
--resource-name "NFName" \
--nf-sku "NFSKU" \
--nfc-id "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkFabricControllers/NFCName" 
--fabric-asn 65048 
--ipv4-prefix 10.2.0.0/19 
--ipv6-prefix fda0:d59c:da02::/59 
--rack-count 4
--server-count-per-rack 8
--ts-config '{"primaryIpv4Prefix":"20.0.1.0/30", "secondaryIpv4Prefix":"20.0.0.0/30", "username":"****", "password": "****", "serialNumber":"TerminalServerSerialNumber"}' 
--managed-network-config '{"infrastructureVpnConfiguration":{"peeringOption":"OptionB","optionBProperties":{"routeTargets": {"importIpv4RouteTargets":["65048:10039"], "importIpv6RouteTargets":["65048:10039"], "exportIpv4RouteTargets":["65048:10039"], "exportIpv6RouteTargets":["65048:10039"]}}},"workloadVpnConfiguration":{"peeringOption":"OptionB","optionBProperties":{"routeTargets": {"importIpv4RouteTargets":["65048:10050"], "importIpv6RouteTargets":["65048:10039"], "exportIpv4RouteTargets":["65048:10039"], "exportIpv6RouteTargets":["65048:10039"]}}}}
```
> [!Note]
> * if it's a four racks set up then the rack count would be 4 
> * if it's an eight rack set up then the rack count would be 8

Expected output:

```output
{
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/microsoft.managednetworkfabric/networkfabrics/NFName",
  "name": "NFName",
  "type": "microsoft.managednetworkfabric/networkfabrics",
  "location": "eastus",
  "systemData": {
    "createdBy": "97fdd529-68de-4ba5-aa3c-adf86bd564bf",
    "createdByType": "Application",
    "createdAt": "2023-XX-XXT18:29:58.3785568Z",
    "lastModifiedBy": "97fdd529-68de-4ba5-aa3c-adf86bd564bf",
    "lastModifiedByType": "Application",
    "lastModifiedAt": "2023-XX-XXT18:29:58.3785568Z"
  },
  "properties": {
    "fabricVersion": "1.0.0",
    "networkFabricSku": "NFSKU",
    "networkFabricControllerId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFCResourceGroup/providers/microsoft.managednetworkfabric/networkfabriccontrollers/NFCName",
    "terminalServerConfiguration": {
      "username": "XXXX",
      "serialNumber": "TerminalServerSerialNumber",
      "primaryIpv4Prefix": "20.0.1.0/30",
      "secondaryIpv4Prefix": "20.0.0.0/30"
    },
    "managementNetworkConfiguration": {
      "infrastructureVpnConfiguration": {
        "administrativeState": "Enabled",
        "peeringOption": "OptionB",
        "optionBProperties": {
            "routeTargets": {
            "importIpv4RouteTargets": [
              "65048:10039"
            ],
            "importIpv6RouteTargets": [
              "65048:10039"
            ],
            "exportIpv4RouteTargets": [
              "65048:10039"
            ],
            "exportIpv6RouteTargets": [
              "65048:10039"
            ]
          }
        }
      },
      "workloadVpnConfiguration": {
        "administrativeState": "Enabled",
        "peeringOption": "OptionB",
        "optionBProperties": {
            "routeTargets": {
            "importIpv4RouteTargets": [
              "65048:10039"
            ],
            "importIpv6RouteTargets": [
              "65048:10039"
            ],
            "exportIpv4RouteTargets": [
              "65048:10039"
            ],
            "exportIpv6RouteTargets": [
              "65048:10039"
            ]
          }
        }
      }
    },
    "provisioningState": "Updating",
    "rackCount": 4,
    "serverCountPerRack": 8,
    "ipv4Prefix": "10.30.0.0/19",
    "ipv6Prefix": "fda0:d59c:df02::/59",
    "fabricASN": 65048
  }
}


```
## show network fabric 

```azurecli
az networkfarbic fabric show --resource-group "NFResourceGroupName" --resource-name "NFName"
```
Expected output:

```output

{
  "configurationState": "Provisioned",
  "fabricASN": 65048,
  "fabricVersion": "1.0.0",
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/microsoft.managednetworkfabric/networkfabrics/NFName",
  "ipv4Prefix": "10.2.0.0/19",
  "ipv6Prefix": "fda0:d59c:df02::/59",
  "l2IsolationDomains": [],
  "l3IsolationDomains": [],
  "location": "eastus",
  "managementNetworkConfiguration": {
    "infrastructureVpnConfiguration": {
      "administrativeState": "Enabled",
      "optionBProperties": {
          "routeTargets": {
          "exportIpv4RouteTargets": [
            "65048:10039"
          ],
          "exportIpv6RouteTargets": [
            "65048:10039"
          ],
          "importIpv4RouteTargets": [
            "65048:10039"
          ],
          "importIpv6RouteTargets": [
            "65048:10039"
          ]
        }
      },
      "peeringOption": "OptionB"
    },
    "workloadVpnConfiguration": {
      "administrativeState": "Enabled",
      "optionBProperties": {
          "routeTargets": {
          "exportIpv4RouteTargets": [
            "65048:10039"
          ],
          "exportIpv6RouteTargets": [
            "65048:10039"
          ],
          "importIpv4RouteTargets": [
            "65048:10039"
          ],
          "importIpv6RouteTargets": [
            "65048:10039"
          ]
        }
      },
      "peeringOption": "OptionB"
    }
  },
  "name": "NFName",
  "networkFabricControllerId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFCResourceGroupName/providers/microsoft.managednetworkfabric/networkfabriccontrollers/NFCName",
  "networkFabricSku": "NFSKU",
  "provisioningState": "Succeeded",
  "rackCount": 4,
  "racks": [
    "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourcegroups/NFResourceGroup/providers/microsoft.managednetworkfabric/networkracks/NFName-aggrack",
    "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourcegroups/NFResourceGroup/providers/microsoft.managednetworkfabric/networkracks/NFName-comprack1",
    "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourcegroups/NFResourceGroup/providers/microsoft.managednetworkfabric/networkracks/NFName-comprack2",
    "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourcegroups/NFResourceGroup/providers/microsoft.managednetworkfabric/networkracks/NFName-comprack3",
    "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourcegroups/NFResourceGroup/providers/microsoft.managednetworkfabric/networkracks/NFName-comprack4"
  ],
  "resourceGroup": "NFResourceGroup",
  "serverCountPerRack": 8,
  "systemData": {
    "createdAt": "2023-XX-XXT18:29:58.3785568Z",
    "createdBy": "97fdd529-68de-4ba5-aa3c-adf86bd564bf",
    "createdByType": "Application",
    "lastModifiedAt": "2023-XX-XXT04:32:02.7129198Z",
    "lastModifiedBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
    "lastModifiedByType": "Application"
  },
  "terminalServerConfiguration": {
    "primaryIpv4Prefix": "20.0.1.0/30",
    "secondaryIpv4Prefix": "20.0.0.0/30",
    "serialNumber": "TerminalServerSerialNumber",
    "username": "XXXX"
  },
  "type": "microsoft.managednetworkfabric/networkfabrics"
}
```

## List all network fabrics in a resource group

```azurecli
az networkfabric fabric list --resource-group "NFResourceGroup"  
```

Expected output:

```output
{
  "configurationState": "Provisioned",
  "fabricASN": 65048,
  "fabricVersion": "1.0.0",
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/microsoft.managednetworkfabric/networkfabrics/NFName",
  "ipv4Prefix": "10.2.0.0/19",
  "ipv6Prefix": "fda0:d59c:df02::/59",
  "l2IsolationDomains": [],
  "l3IsolationDomains": [],
  "location": "eastus",
  "managementNetworkConfiguration": {
    "infrastructureVpnConfiguration": {
      "administrativeState": "Enabled",
      "optionBProperties": {
          "routeTargets": {
          "exportIpv4RouteTargets": [
            "65048:10039"
          ],
          "exportIpv6RouteTargets": [
            "65048:10039"
          ],
          "importIpv4RouteTargets": [
            "65048:10039"
          ],
          "importIpv6RouteTargets": [
            "65048:10039"
          ]
        }
      },
      "peeringOption": "OptionB"
    },
    "workloadVpnConfiguration": {
      "administrativeState": "Enabled",
      "optionBProperties": {
          "routeTargets": {
          "exportIpv4RouteTargets": [
            "65048:10039"
          ],
          "exportIpv6RouteTargets": [
            "65048:10039"
          ],
          "importIpv4RouteTargets": [
            "65048:10039"
          ],
          "importIpv6RouteTargets": [
            "65048:10039"
          ]
        }
      },
      "peeringOption": "OptionB"
    }
  },
  "name": "NFName",
  "networkFabricControllerId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFCResourceGroupName/providers/microsoft.managednetworkfabric/networkfabriccontrollers/NFCName",
  "networkFabricSku": "NFSKU",
  "provisioningState": "Succeeded",
  "rackCount": 4,
  "racks": [
    "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourcegroups/NFResourceGroup/providers/microsoft.managednetworkfabric/networkracks/NFName-aggrack",
    "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourcegroups/NFResourceGroup/providers/microsoft.managednetworkfabric/networkracks/NFName-comprack1",
    "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourcegroups/NFResourceGroup/providers/microsoft.managednetworkfabric/networkracks/NFName-comprack2",
    "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourcegroups/NFResourceGroup/providers/microsoft.managednetworkfabric/networkracks/NFName-comprack3",
    "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourcegroups/NFResourceGroup/providers/microsoft.managednetworkfabric/networkracks/NFName-comprack4"
  ],
  "resourceGroup": "NFResourceGroup",
  "serverCountPerRack": 8,
  "systemData": {
    "createdAt": "2023-XX-XXT18:29:58.3785568Z",
    "createdBy": "97fdd529-68de-4ba5-aa3c-adf86bd564bf",
    "createdByType": "Application",
    "lastModifiedAt": "2023-XX-XXT04:32:02.7129198Z",
    "lastModifiedBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
    "lastModifiedByType": "Application"
  },
  "terminalServerConfiguration": {
    "primaryIpv4Prefix": "20.0.1.0/30",
    "secondaryIpv4Prefix": "20.0.0.0/30",
    "serialNumber": "TerminalServerSerialNumber",
    "username": "XXXX"
  },
  "type": "microsoft.managednetworkfabric/networkfabrics"
}  
```

## Configure an NNI

The following table specifies parameters used to create Network-to-Network Interconnect.


| Parameter | Description | Example | Required | Type|
|-----------|-------------|---------|----------|-----------|
|isMangementType| Configuration to make NNI to be used for management of Fabric. Default value is true. Possible values are True/False |True|True
|useOptionB| Configuration to enable optionB. Possible values are True/False |True|True
||
|*layer2Configuration*| Layer 2 configuration ||
||
|portCount| Number of ports that are part of the port-channel. Maximum value is based on Fabric SKU|3||
|mtu| Maximum transmission unit between CE and PE. |1500||
||
|*layer3Configuration*| Layer 3 configuration between CEs and PEs||True
||
|primaryIpv4Prefix|IPv4 Prefix for connectivity between CE1 and PE1. CE1 port-channel interface is assigned the first usable IP from the prefix and the corresponding interface on PE1 should be assigned the second usable address|10.246.0.124/31, CE1 port-channel interface is assigned 10.246.0.125 and PE1 port-channel interface should be assigned 10.246.0.126||String|
|secondaryIpv4Prefix|IPv4 Prefix for connectivity between CE2 and PE2. CE2 port-channel interface is assigned the first usable IP from the prefix and the corresponding interface on PE2 should be assigned the second usable address|10.246.0.128/31, CE2 port-channel interface should be assigned 10.246.0.129 and PE2 port-channel interface 10.246.0.130||String|
|primaryIpv6Prefix|IPv6 Prefix for connectivity between CE1 and PE1. CE1 port-channel interface is assigned the first usable IP from the prefix and the corresponding interface on PE1 should be assigned the second usable address|3FFE:FFFF:0:CD30::a1 is assigned to CE1 and 3FFE:FFFF:0:CD30::a2 is assigned to PE1. Default value is 3FFE:FFFF:0:CD30::a0/126||String|
|secondaryIpv6Prefix|IPv6 Prefix for connectivity between CE2 and PE2. CE2 port-channel interface is assigned the first usable IP from the prefix and the corresponding interface on PE2 should be assigned the second usable address|3FFE:FFFF:0:CD30::a5 is assigned to CE2 and 3FFE:FFFF:0:CD30::a6 is assigned to PE2. Default value is 3FFE:FFFF:0:CD30::a4/126.||String|
|fabricAsn|ASN number assigned on CE for BGP peering with PE|65048||
|peerAsn|ASN number assigned on PE for BGP peering with CE. For iBGP between PE/CE, the value should be same as fabricAsn, for eBGP the value should be different from fabricAsn |65048|True|
|fabricAsn|ASN number assigned on CE for BGP peering with PE|65048||
|vlan-Id|Vlan for NNI.Range is between 501-4095 |501||
|importRoutePolicy|Details to import route policy.|||
|exportRoutePolicy|Details to export route policy.|||
|nni-type|The default value is CE. CE and NPB are the options|CE, PE||

## Create a Network to Network Interconnect (NNI)

Resource group & Network Fabric must be created before Network to Network Interconnect creation. 

Run the following command to create the Network to Network Interconnect (Default nni type is CE):
 

```azurecli

az networkfabric nni create \
--resource-group "NFResourceGroup" \
--location "eastus" \
--resource-name "NFNNIName" \
--fabric "NFFabric" \
--is-management-type "True" \
--use-option-b "False" \
--layer2-configuration '{"portCount": 3, "mtu": 1500}' \
--layer3-configuration '{"peerASN": 65048, "vlanId": 501, "primaryIpv4Prefix": "10.2.0.124/30", "secondaryIpv4Prefix": "10.2.0.128/30", "primaryIpv6Prefix": "10:2:0:124::400/127", "secondaryIpv6Prefix": "10:2:0:124::402/127"}'

```

Expected output:

```output
{
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/microsoft.managednetworkfabric/networkfabrics/NFName/networkToNetworkInterconnects/NFNNIName",
  "name": "NFNNIName",
  "type": "microsoft.managednetworkfabric/networkfabrics/networktonetworkinterconnects",
  "systemData": {
    "createdBy": "97fdd529-68de-4ba5-aa3c-adf86bd564bf",
    "createdByType": "Application",
    "createdAt": "2023-XX-XXT18:30:14.613498Z",
    "lastModifiedBy": "97fdd529-68de-4ba5-aa3c-adf86bd564bf",
    "lastModifiedByType": "Application",
    "lastModifiedAt": "2023-XX-XXT18:30:14.613498Z"
  },
  "properties": {
    "administrativeState": "Enabled",
    "nniType": "CE",
    "isManagementType": "True",
    "useOptionB": "False",
    "layer2Configuration": {
      "mtu": 1500
    },
    "optionBLayer3Configuration": {
      "peerASN": 65050,
      "vlanId": 501,
      "fabricASN": 0,
      "primaryIpv4Prefix": "10.2.0.124/30",
      "primaryIpv6Prefix": "10:2:0:124::400/127"
      "secondaryIpv4Prefix": "10.2.0.128/30"
      "secondaryIpv6Prefix": "10:2:0:124::402/127"
    },
    "provisioningState": "Accepted",
    "configurationState": "Succeeded"
  }
}

```

## Show Network Fabric NNIs (Network to Network Interface)

```azurecli
az networkfabric nni show -g "NFResourceGroup" --resource-name "NFNNIName" --fabric "NFFabric"

```

Expected output:

```output
{
  "administrativeState": "Enabled",
  "configurationState": "Succeeded",
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/microsoft.managednetworkfabric/networkfabrics/NFName/networkToNetworkInterconnects/NFNNIName",
  "isManagementType": "True",
  "layer2Configuration": {
    "mtu": 1500
  },
  "name": "nffab2lab180723-nni",
  "nniType": "CE",
  "optionBLayer3Configuration": {
    "fabricASN": 0,
    "peerASN": 65050,
    "primaryIpv4Prefix": "10.2.0.124/30",
    "primaryIpv6Prefix": "10:2:0:124::400/127"
    "secondaryIpv4Prefix": "10.2.0.128/30"
    "secondaryIpv6Prefix": "10:2:0:124::402/127"
    "vlanId": 501
  },
  "provisioningState": "Succeeded",
  "resourceGroup": "NFResourceGroupName",
  "systemData": {
    "createdAt": "2023-XX-XXT18:30:14.613498Z",
    "createdBy": "97fdd529-68de-4ba5-aa3c-adf86bd564bf",
    "createdByType": "Application",
    "lastModifiedAt": "2023-XX-XXT18:30:14.613498Z",
    "lastModifiedBy": "97fdd529-68de-4ba5-aa3c-adf86bd564bf",
    "lastModifiedByType": "Application"
  },
  "type": "microsoft.managednetworkfabric/networkfabrics/networktonetworkinterconnects",
  "useOptionB": "False"
}
```



## List or Get Network Fabric NNI (Network to Network Interface)

```azurecli
az networkfabric nni list -g NFResourceGroup --fabric NFFabric
```

Expected output:

```output
{
  "administrativeState": "Enabled",
  "configurationState": "Succeeded",
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/microsoft.managednetworkfabric/networkfabrics/NFName/networkToNetworkInterconnects/NFNNIName",
  "isManagementType": "True",
  "layer2Configuration": {
    "mtu": 1500
  },
  "name": "nffab2lab180723-nni",
  "nniType": "CE",
  "optionBLayer3Configuration": {
    "fabricASN": 0,
    "peerASN": 65050,
    "primaryIpv4Prefix": "10.2.0.124/30",
    "primaryIpv6Prefix": "10:2:0:124::400/127"
    "secondaryIpv4Prefix": "10.2.0.128/30"
    "secondaryIpv6Prefix": "10:2:0:124::402/127"
    "vlanId": 501
  },
  "provisioningState": "Succeeded",
  "resourceGroup": "NFResourceGroupName",
  "systemData": {
    "createdAt": "2023-XX-XXT18:30:14.613498Z",
    "createdBy": "97fdd529-68de-4ba5-aa3c-adf86bd564bf",
    "createdByType": "Application",
    "lastModifiedAt": "2023-XX-XXT18:30:14.613498Z",
    "lastModifiedBy": "97fdd529-68de-4ba5-aa3c-adf86bd564bf",
    "lastModifiedByType": "Application"
  },
  "type": "microsoft.managednetworkfabric/networkfabrics/networktonetworkinterconnects",
  "useOptionB": "False"
}
```




## Next Steps

* Update the serial number in the networkDevice resource with the actual serial number on the device. The device sends the serial number as part of DHCP request.    
* Configure the terminal server with the serial numbers of all the devices (which also hosts DHCP server)
* Provision the network devices via zero-touch provisioning mode, Based on the serial number in the DHCP request, the DHCP server responds with the boot configuration file for the corresponding device


## Update Network Fabric Devices

Run the following command to update Network Fabric Devices:

```azurecli

az networkfabric device update \
--resource-group "NFResourceGroup" \
--resource-name "Network-Device-Name" \
--location "eastus" \
--serial-number "xxxx"

```

Expected output:

```output
{
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkDevices/Network-Device-Name",
  "name": "Network-Device-Name",
  "type": "microsoft.managednetworkfabric/networkdevices",
  "location": "eastus",
  "systemData": {
    "createdBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
    "createdByType": "Application",
    "createdAt": "2023-XX-XXT18:30:03.11544Z",
    "lastModifiedBy": "97fdd529-68de-4ba5-aa3c-adf86bd564bf",
    "lastModifiedByType": "Application",
    "lastModifiedAt": "2023-XX-XXT18:30:29.1296291Z"
  },
  "properties": {
    "networkRackId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkRacks/Network-Device-Name",
    "networkDeviceSku": "DefaultSku",
    "networkDeviceRole": "XX",
    "hostName": "example-hostname",
    "serialNumber": "AXXXX;DCS-XXXXX-24;XX.XX;JXXXXXXX",
    "version": "",
    "configurationState": "Succeeded",
    "administrativeState": "Enabled",
    "provisioningState": "Succeeded"
  }
```
> [!Note]
> The The preceding code serves only as an example. You should update all the devices that are part of both `AggrRack` and `computeRacks`     

For example, `AggrRack` consists of:
* `CE01`
* `CE02`
* `TOR17`
* `TOR18`
* `MgmtSwitch01`
* `MgmtSwitch02` (and so on, for other switches)

## List or Get Network Fabric Devices

Run the following command to list network fabric devices in a resource group:

```azurecli
az networkfabric device list --resource-group "NFResourceGroup"
```

Expected output:

```output
[
  {
    "administrativeState": "Enabled",
    "configurationState": "Succeeded",
    "hostName": "example-hostname",
    "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkDevices/Network-Device-Name",
    "location": "eastus",
    "name": "Network-Device-Name",
    "networkDeviceRole": "CE",
    "networkDeviceSku": "DefaultSku",
    "networkRackId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkRacks/Network-Device-Name-aggrack",
    "provisioningState": "Succeeded",
    "resourceGroup": "NFResourceGroup",
    "serialNumber": "AXXXX;DCS-XXXXX-24;XX.XX;JXXXXXXX",
    "systemData": {
      "createdAt": "2023-XX-XXT18:30:00.5266816Z",
      "createdBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
      "createdByType": "Application",
      "lastModifiedAt": "2023-XX-XXT18:30:23.2231751Z",
      "lastModifiedBy": "97fdd529-68de-4ba5-aa3c-adf86bd564bf",
      "lastModifiedByType": "Application"
    },
    "type": "microsoft.managednetworkfabric/networkdevices",
    "version": ""
  },
  {
    "administrativeState": "Enabled",
    "configurationState": "Succeeded",
    "hostName": "AR-MGMT2",
    "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkDevices/Network-Device-Name",
    "location": "eastus",
    "name": "Network-Device-Name",
    "networkDeviceRole": "TS",
    "networkDeviceSku": "DefaultSku",
    "networkRackId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkRacks/Network-Device-Name-aggrack",
    "provisioningState": "Succeeded",
    "resourceGroup": "NFResourceGroup",
    "serialNumber": "AXXXX;DCS-XXXXX-24;XX.XX;JXXXXXXX",
    "systemData": {
      "createdAt": "2023-XX-XXT18:30:00.727495Z",
      "createdBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
      "createdByType": "Application",
      "lastModifiedAt": "2023-XX-XXT18:30:33.7864881Z",
      "lastModifiedBy": "97fdd529-68de-4ba5-aa3c-adf86bd564bf",
      "lastModifiedByType": "Application"
    },
    "type": "microsoft.managednetworkfabric/networkdevices",
    "version": ""
  },
  {
    "administrativeState": "Enabled",
    "configurationState": "Succeeded",
    "hostName": "example-hostname",
    "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkDevices/Network-Device-Name",
    "location": "eastus",
    "name": "Network-Device-Name",
    "networkDeviceRole": "NPB",
    "networkDeviceSku": "DefaultSku",
    "networkRackId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkRacks/Network-Device-Name-aggrack",
    "provisioningState": "Succeeded",
    "resourceGroup": "NFResourceGroup",
    "serialNumber": "AXXXX;DCS-XXXXX-24;XX.XX;JXXXXXXX",
    "systemData": {
      "createdAt": "2023-XX-XXT18:30:00.7582997Z",
      "createdBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
      "createdByType": "Application",
      "lastModifiedAt": "2023-XX-XXT18:30:34.9110792Z",
      "lastModifiedBy": "97fdd529-68de-4ba5-aa3c-adf86bd564bf",
      "lastModifiedByType": "Application"
    },
    "type": "microsoft.managednetworkfabric/networkdevices",
    "version": ""
  },
  {
    "administrativeState": "Enabled",
    "configurationState": "Succeeded",
    "hostName": "example-hostname",
    "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkDevices/Network-Device-Name",
    "location": "eastus",
    "name": "Network-Device-Name",
    "networkDeviceRole": "CE",
    "networkDeviceSku": "DefaultSku",
    "networkRackId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkRacks/Network-Device-Name-aggrack",
    "provisioningState": "Succeeded",
    "resourceGroup": "NFResourceGroup",
    "serialNumber": "AXXXX;DCS-XXXXX-24;XX.XX;JXXXXXXX",
    "systemData": {
      "createdAt": "2023-XX-XXT18:30:00.7210136Z",
      "createdBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
      "createdByType": "Application",
      "lastModifiedAt": "2023-XX-XXT18:30:24.426339Z",
      "lastModifiedBy": "97fdd529-68de-4ba5-aa3c-adf86bd564bf",
      "lastModifiedByType": "Application"
    },
    "type": "microsoft.managednetworkfabric/networkdevices",
    "version": ""
  },
  {
    "administrativeState": "Enabled",
    "configurationState": "Succeeded",
    "hostName": "example-hostname",
    "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkDevices/Network-Device-Name",
    "location": "eastus",
    "name": "Network-Device-Name",
    "networkDeviceRole": "TS",
    "networkDeviceSku": "DefaultSku",
    "networkRackId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkRacks/Network-Device-Name-aggrack",
    "provisioningState": "Succeeded",
    "resourceGroup": "NFResourceGroup",
    "serialNumber": "AXXXX;DCS-XXXXX-24;XX.XX;JXXXXXXX",
    "systemData": {
      "createdAt": "2023-XX-XXT18:30:00.7722959Z",
      "createdBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
      "createdByType": "Application",
      "lastModifiedAt": "2023-XX-XXT18:30:25.7076346Z",
      "lastModifiedBy": "97fdd529-68de-4ba5-aa3c-adf86bd564bf",
      "lastModifiedByType": "Application"
    },
    "type": "microsoft.managednetworkfabric/networkdevices",
    "version": ""
  },
  {
    "administrativeState": "Enabled",
    "configurationState": "Succeeded",
    "hostName": "example-hostname",
    "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkDevices/Network-Device-Name",
    "location": "eastus",
    "name": "Network-Device-Name",
    "networkDeviceRole": "ToR",
    "networkDeviceSku": "DefaultSku",
    "networkRackId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkRacks/nffab2lab180723-comprack1",
    "provisioningState": "Succeeded",
    "resourceGroup": "NFResourceGroup",
    "serialNumber": "AXXXX;DCS-XXXXX-24;XX.XX;JXXXXXXX",
    "systemData": {
      "createdAt": "2023-XX-XXT18:30:03.0049164Z",
      "createdBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
      "createdByType": "Application",
      "lastModifiedAt": "2023-XX-XXT18:30:28.0046231Z",
      "lastModifiedBy": "97fdd529-68de-4ba5-aa3c-adf86bd564bf",
      "lastModifiedByType": "Application"
    },
    "type": "microsoft.managednetworkfabric/networkdevices",
    "version": ""
  },
  {
    "administrativeState": "Enabled",
    "configurationState": "Succeeded",
    "hostName": "example-hostname",
    "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkDevices/Network-Device-Name",
    "location": "eastus",
    "name": "Network-Device-Name",
    "networkDeviceRole": "TS",
    "networkDeviceSku": "DefaultSku",
    "networkRackId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkRacks/nffab2lab180723-comprack1",
    "provisioningState": "Succeeded",
    "resourceGroup": "NFResourceGroup",
    "serialNumber": "AXXXX;DCS-XXXXX-24;XX.XX;JXXXXXXX",
    "systemData": {
      "createdAt": "2023-XX-XXT18:30:03.11544Z",
      "createdBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
      "createdByType": "Application",
      "lastModifiedAt": "2023-XX-XXT18:30:29.1296291Z",
      "lastModifiedBy": "97fdd529-68de-4ba5-aa3c-adf86bd564bf",
      "lastModifiedByType": "Application"
    },
    "type": "microsoft.managednetworkfabric/networkdevices",
    "version": ""
  },
  {
    "administrativeState": "Enabled",
    "configurationState": "Succeeded",
    "hostName": "example-hostname",
    "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkDevices/Network-Device-Name",
    "location": "eastus",
    "name": "Network-Device-Name",
    "networkDeviceRole": "ToR",
    "networkDeviceSku": "DefaultSku",
    "networkRackId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkRacks/nffab2lab180723-comprack1",
    "provisioningState": "Succeeded",
    "resourceGroup": "NFResourceGroup",
    "serialNumber": "AXXXX;DCS-XXXXX-24;XX.XX;JXXXXXXX",
    "systemData": {
      "createdAt": "2023-XX-XXT18:30:03.1893834Z",
      "createdBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
      "createdByType": "Application",
      "lastModifiedAt": "2023-XX-XXT18:30:26.7545474Z",
      "lastModifiedBy": "97fdd529-68de-4ba5-aa3c-adf86bd564bf",
      "lastModifiedByType": "Application"
    },
    "type": "microsoft.managednetworkfabric/networkdevices",
    "version": ""
  },
  {
    "administrativeState": "Enabled",
    "configurationState": "Succeeded",
    "hostName": "example-hostname",
    "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkDevices/Network-Device-Name",
    "location": "eastus",
    "name": "Network-Device-Name",
    "networkDeviceRole": "ToR",
    "networkDeviceSku": "DefaultSku",
    "networkRackId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkRacks/nffab2lab180723-comprack2",
    "provisioningState": "Succeeded",
    "resourceGroup": "NFResourceGroup",
    "serialNumber": "AXXXX;DCS-XXXXX-24;XX.XX;JXXXXXXX",
    "systemData": {
      "createdAt": "2023-XX-XXT18:30:05.4237868Z",
      "createdBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
      "createdByType": "Application",
      "lastModifiedAt": "2023-XX-XXT18:30:31.5047457Z",
      "lastModifiedBy": "97fdd529-68de-4ba5-aa3c-adf86bd564bf",
      "lastModifiedByType": "Application"
    },
    "type": "microsoft.managednetworkfabric/networkdevices",
    "version": ""
  },
  {
    "administrativeState": "Enabled",
    "configurationState": "Succeeded",
    "hostName": "example-hostname",
    "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkDevices/Network-Device-Name",
    "location": "eastus",
    "name": "Network-Device-Name",
    "networkDeviceRole": "TS",
    "networkDeviceSku": "DefaultSku",
    "networkRackId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkRacks/nffab2lab180723-comprack2",
    "provisioningState": "Succeeded",
    "resourceGroup": "NFResourceGroup",
    "serialNumber": "AXXXX;DCS-XXXXX-24;XX.XX;JXXXXXXX",
    "systemData": {
      "createdAt": "2023-XX-XXT18:30:05.4580643Z",
      "createdBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
      "createdByType": "Application",
      "lastModifiedAt": "2023-XX-XXT18:30:32.6766268Z",
      "lastModifiedBy": "97fdd529-68de-4ba5-aa3c-adf86bd564bf",
      "lastModifiedByType": "Application"
    },
    "type": "microsoft.managednetworkfabric/networkdevices",
    "version": ""
  },
  {
    "administrativeState": "Enabled",
    "configurationState": "Succeeded",
    "hostName": "example-hostname",
    "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkDevices/Network-Device-Name",
    "location": "eastus",
    "name": "Network-Device-Name",
    "networkDeviceRole": "ToR",
    "networkDeviceSku": "DefaultSku",
    "networkRackId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkRacks/nffab2lab180723-comprack2",
    "provisioningState": "Succeeded",
    "resourceGroup": "NFResourceGroup",
    "serialNumber": "AXXXX;DCS-XXXXX-24;XX.XX;JXXXXXXX",
    "systemData": {
      "createdAt": "2023-XX-XXT18:30:05.4906233Z",
      "createdBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
      "createdByType": "Application",
      "lastModifiedAt": "2023-XX-XXT18:30:30.4265486Z",
      "lastModifiedBy": "97fdd529-68de-4ba5-aa3c-adf86bd564bf",
      "lastModifiedByType": "Application"
    },
    "type": "microsoft.managednetworkfabric/networkdevices",
    "version": ""
  }
]
```
Run the following command to Get or Show details of a Network Fabric Device:

```azurecli
az networkfabric device show --resource-group "NFResourceGroup" --resource-name "Network-Device-Name"
```

Expected output:

```output
{
  "administrativeState": "Enabled",
  "configurationState": "Succeeded",
  "hostName": "example-hostname",
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkDevices/Network-Device-Name",
  "location": "eastus",
  "name": "Network-Device-Name",
  "networkDeviceRole": "ToR",
  "networkDeviceSku": "DefaultSku",
  "networkRackId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkRacks/nffab2lab180723-comprack2",
  "provisioningState": "Succeeded",
  "resourceGroup": "NFResourceGroup",
  "serialNumber": "AXXXX;DCS-XXXXX-24;XX.XX;JXXXXXXX",
  "systemData": {
    "createdAt": "2023-XX-XXT18:30:05.4906233Z",
    "createdBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
    "createdByType": "Application",
    "lastModifiedAt": "2023-XX-XXT18:30:30.4265486Z",
    "lastModifiedBy": "97fdd529-68de-4ba5-aa3c-adf86bd564bf",
    "lastModifiedByType": "Application"
  },
  "type": "microsoft.managednetworkfabric/networkdevices",
  "version": ""
}
```


## Provision a network fabric

After you update the device serial number, provision and show the fabric by running the following commands:

```azurecli
az networkfabric fabric provision --resource-group "NFResourceGroup"  --resource-name "NFName"
```

```azurecli
az networkfabric fabric show --resource-group "NFResourceGroup"  --resource-name "NFName"
```

Expected output:

```output
{
  "configurationState": "Provisioned",
  "fabricASN": 65048,
  "fabricVersion": "1.0.0",
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/microsoft.managednetworkfabric/networkfabrics/NFName",
  "ipv4Prefix": "10.2.0.0/19",
  "ipv6Prefix": "fda0:d59c:df02::/59",
  "l2IsolationDomains": [],
  "l3IsolationDomains": [],
  "location": "eastus",
  "managementNetworkConfiguration": {
    "infrastructureVpnConfiguration": {
      "administrativeState": "Enabled",
          "routeTargets": {
          "exportIpv4RouteTargets": [
            "65048:10039"
          ],
          "exportIpv6RouteTargets": [
            "65048:10039"
          ],
          "importIpv4RouteTargets": [
            "65048:10039"
          ],
          "importIpv6RouteTargets": [
            "65048:10039"
          ]
        }
      },
      "peeringOption": "OptionB"
    },
    "workloadVpnConfiguration": {
      "administrativeState": "Enabled",
      "optionBProperties": {
          "routeTargets": {
          "exportIpv4RouteTargets": [
            "65048:10050"
          ],
          "exportIpv6RouteTargets": [
            "65048:10050"
          ],
          "importIpv4RouteTargets": [
            "65048:10050"
          ],
          "importIpv6RouteTargets": [
            "65048:10050"
          ]
        }
      },
      "peeringOption": "OptionB"
    }
  },
  "name": "NFName",
  "networkFabricControllerId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFCResourceGroup/providers/microsoft.managednetworkfabric/networkfabriccontrollers/NFCName",
  "networkFabricSku": "NFSKU",
  "provisioningState": "Succeeded",
  "rackCount": 4,
  "racks": [
    "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFCResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkRacks/NFName-aggrack",
    "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFCResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkRacks/NFName-comprack1",
    "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFCResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkRacks/NFName-comprack2",
    "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFCResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkRacks/NFName-comprack3",
    "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFCResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkRacks/NFName-comprack4"
  ],
  "resourceGroup": "NFResourceGroup",
  "serverCountPerRack": 8,
  "systemData": {
    "createdAt": "2023-XX-XXT18:29:58.3785568Z",
    "createdBy": "97fdd529-68de-4ba5-aa3c-adf86bd564bf",
    "createdByType": "Application",
    "lastModifiedAt": "2023-XX-XXT04:32:02.7129198Z",
    "lastModifiedBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
    "lastModifiedByType": "Application"
  },
  "terminalServerConfiguration": {
    "primaryIpv4Prefix": "20.0.1.0/30",
    "secondaryIpv4Prefix": "20.0.0.0/30",
    "serialNumber": "XXXXXXXXXXXXXX",
    "username": "XXXX"
  },
  "type": "microsoft.managednetworkfabric/networkfabrics"
}
```

## Deprovision a Fabric 
To deprovision a fabric, ensure that the fabric is in a provisioned operational state and then run this command:

```azurecli
az networkfabric fabric deprovision --resource-group "NFResourceGroup" --resource-name "NFName"

```

Expected output:

```output
{
  "configurationState": "Deprovisioned",
  "fabricASN": 65048,
  "fabricVersion": "1.0.0",
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/microsoft.managednetworkfabric/networkfabrics/NFName",
  "ipv4Prefix": "10.2.0.0/19",
  "ipv6Prefix": "fda0:d59c:df02::/59",
  "l2IsolationDomains": [],
  "l3IsolationDomains": [],
  "location": "eastus",
  "managementNetworkConfiguration": {
    "infrastructureVpnConfiguration": {
      "administrativeState": "Enabled",
      "optionBProperties": {
          "routeTargets": {
          "exportIpv4RouteTargets": [
            "65048:10039"
          ],
          "exportIpv6RouteTargets": [
            "65048:10039"
          ],
          "importIpv4RouteTargets": [
            "65048:10039"
          ],
          "importIpv6RouteTargets": [
            "65048:10039"
          ]
        }
      },
      "peeringOption": "OptionB"
    },
    "workloadVpnConfiguration": {
      "administrativeState": "Enabled",
      "optionBProperties": {
          "routeTargets": {
          "exportIpv4RouteTargets": [
            "65048:10050"
          ],
          "exportIpv6RouteTargets": [
            "65048:10050"
          ],
          "importIpv4RouteTargets": [
            "65048:10050"
          ],
          "importIpv6RouteTargets": [
            "65048:10050"
          ]
        }
      },
      "peeringOption": "OptionB"
    }
  },
  "name": "NFName",
  "networkFabricControllerId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFCResourceGroup/providers/microsoft.managednetworkfabric/networkfabriccontrollers/NFCName",
  "networkFabricSku": "NFSKU",
  "provisioningState": "Succeeded",
  "rackCount": 4,
  "racks": [
    "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFCResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkRacks/NFName-aggrack",
    "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFCResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkRacks/NFName-comprack1",
    "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFCResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkRacks/NFName-comprack2",
    "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFCResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkRacks/NFName-comprack3",
    "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFCResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkRacks/NFName-comprack4"
  ],
  "resourceGroup": "NFResourceGroup",
  "serverCountPerRack": 8,
  "systemData": {
    "createdAt": "2023-XX-XXT18:29:58.3785568Z",
    "createdBy": "97fdd529-68de-4ba5-aa3c-adf86bd564bf",
    "createdByType": "Application",
    "lastModifiedAt": "2023-XX-XXT04:32:02.7129198Z",
    "lastModifiedBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
    "lastModifiedByType": "Application"
  },
  "terminalServerConfiguration": {
    "primaryIpv4Prefix": "20.0.1.0/30",
    "secondaryIpv4Prefix": "20.0.0.0/30",
    "serialNumber": "XXXXXXXXXXXXXX",
    "username": "XXXX"
  },
  "type": "microsoft.managednetworkfabric/networkfabrics"
}

```

## Deleting Fabric

To delete a fabric, run the following command. Before you do, make sure that:

* The fabric is in a deprovisioned operational state. If it's in a provisioned state, run the `deprovision` command.
* No racks are associated with the fabric.


```azurecli
az networkfabric fabric delete --resource-group "NFResourceGroup" --resource-name "NFName"

```

Sample output:

```output
{
  "configurationState": "Deleting",
  "fabricASN": 65048,
  "fabricVersion": "1.0.0",
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/microsoft.managednetworkfabric/networkfabrics/NFName",
  "ipv4Prefix": "10.2.0.0/19",
  "ipv6Prefix": "fda0:d59c:df02::/59",
  "l2IsolationDomains": [],
  "l3IsolationDomains": [],
  "location": "eastus",
  "managementNetworkConfiguration": {
    "infrastructureVpnConfiguration": {
      "administrativeState": "Enabled",
      "optionBProperties": {
          "routeTargets": {
          "exportIpv4RouteTargets": [
            "65048:10039"
          ],
          "exportIpv6RouteTargets": [
            "65048:10039"
          ],
          "importIpv4RouteTargets": [
            "65048:10039"
          ],
          "importIpv6RouteTargets": [
            "65048:10039"
          ]
        }
      },
      "peeringOption": "OptionB"
    },
    "workloadVpnConfiguration": {
      "administrativeState": "Enabled",
      "optionBProperties": {
          "routeTargets": {
          "exportIpv4RouteTargets": [
            "65048:10050"
          ],
          "exportIpv6RouteTargets": [
            "65048:10050"
          ],
          "importIpv4RouteTargets": [
            "65048:10050"
          ],
          "importIpv6RouteTargets": [
            "65048:10050"
          ]
        }
      },
      "peeringOption": "OptionB"
    }
  },
  "name": "NFName",
  "networkFabricControllerId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFCResourceGroup/providers/microsoft.managednetworkfabric/networkfabriccontrollers/NFCName",
  "networkFabricSku": "NFSKU",
  "provisioningState": "Deleting",
  "rackCount": 4,
  "racks": [
    "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFCResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkRacks/NFName-aggrack",
    "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFCResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkRacks/NFName-comprack1",
    "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFCResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkRacks/NFName-comprack2",
    "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFCResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkRacks/NFName-comprack3",
    "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFCResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkRacks/NFName-comprack4"
  ],
  "resourceGroup": "NFResourceGroup",
  "serverCountPerRack": 7,
  "systemData": {
    "createdAt": "2023-XX-XXT18:29:58.3785568Z",
    "createdBy": "97fdd529-68de-4ba5-aa3c-adf86bd564bf",
    "createdByType": "Application",
    "lastModifiedAt": "2023-XX-XXT04:32:02.7129198Z",
    "lastModifiedBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
    "lastModifiedByType": "Application"
  },
  "terminalServerConfiguration": {
    "primaryIpv4Prefix": "20.0.1.0/30",
    "secondaryIpv4Prefix": "20.0.0.0/30",
    "serialNumber": "XXXXXXXXXXXXXX",
    "username": "XXXX"
  },
  "type": "microsoft.managednetworkfabric/networkfabrics"
}
```
After successfully deleting the Network Fabric, when you run a show of the same fabric, you won't find any resources available.

```azurecli
az networkfabric fabric show --resource-group "NFResourceGroup" --resource-name "NFName"
```

Expected output:
```output
(ResourceNotFound) The Resource 'Microsoft.ManagedNetworkFabric/NetworkFabrics/NFName' under resource group 'NFResourceGroup' was not found. For more details please go to https://aka.ms/ARMResourceNotFoundFix
Code: ResourceNotFound
```
