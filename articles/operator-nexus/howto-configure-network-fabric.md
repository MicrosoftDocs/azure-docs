---
title: "Azure Operator Nexus: How to configure the Network Fabric"
description: Learn to create, view, list, update, delete commands for Network Fabric
author: surajmb #Required
ms.author: surmb #Required
ms.service: azure  #Required
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 03/26/2023 #Required; mm/dd/yyyy format.
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Create and provision a Network Fabric using Azure CLI

This article describes how to create a Network Fabric by using the Azure Command Line Interface (AzCLI). This document also shows you how to check the status, update, or delete a Network Fabric.

## Prerequisites

* A Network Fabric Controller is successfully provisioned.
  * A Network Fabric Controller instance in Azure manages multiple Network Fabric Resources.
  * You can reuse a pre-existing Network Fabric Controller.
* Physical infrastructure installed and cabled as per BOM.
* ExpressRoute connectivity established between the Azure region and your WAN (your networking).
* The needed VLANs, Route-Targets and IP addresses configured in your network.
* Terminal Server [installed and configured](./howto-platform-prerequisites.md#set-up-terminal-server)

## Parameters needed to create Network Fabric

| Parameter | Description  |  Example |  Required|  Type|
|-----------------------------------------------|---| ---|----|------------|
| resource-group | Name of the resource group |  "NFResourceGroup" |True | String |
| location | Location of Azure region | "eastus" |True | String |
| resource-name | Name of the FabricResource | NF-Lab1 |True | String |
| nf-sku  |Fabric SKU ID, based on the ordered SKU of the BoM. Contact AFO team for specific SKU value for the BoM | M8-A400-A100-C16-aa |True | String|
| nfc-id |Network Fabric Controller ARM resource ID| |True | String |
| rack-count |Total number of compute racks | 8 |True | Integer |
| server-count-per-rack |Total number of worker nodes per rack| 16 |True | Integer |
||
|**managed-network-config**| Details of management network ||True ||
|ipv4Prefix|IPv4 Prefix of the management network. This Prefix should be unique across all Network Fabrics in a Network Fabric Controller. Prefix length should be at least 19 (/20 not allowed, /18 and lower allowed) | 10.246.0.0/19|True | String |
|ipv6Prefix|IPv6 Prefix of the management network. This Prefix should be unique across all Network Fabrics in a Network Fabric Controller. Prefix length should be at least 59 (/60 not allowed, /58 and lower allowed) | fd01:0:1234:00e0::/59|True | String |
||
|**managementVpnConfiguration**| Details of management VPN connection between Network Fabric and infrastructure services in Network Fabric Controller||True ||
|*optionBProperties*| Details of MPLS option 10B used for connectivity between Network Fabric and Network Fabric Controller||True ||
|importRouteTargets|Values of import route targets to be configured on CEs for exchanging routes between CE & PE via MPLS option 10B| 65048:10039|True(If OptionB enabled)|Integer |
|exportRouteTargets|Values of export route targets to be configured on CEs for exchanging routes between CE & PE via MPLS option 10B| 65048:10039|True(If OptionB enabled)|Integer |
||
|**workloadVpnConfiguration**| Details of workload VPN connection between Network Fabric and workload services in Network Fabric Controller||||
|*optionBProperties*| Details of MPLS option 10B used for connectivity between Network Fabric and Network Fabric Controller||||
|importRouteTargets|Values of import route targets to be configured on CEs for exchanging routes between CE & PE via MPLS option 10B|for example, 65048:10050|True(If OptionB enabled)|Integer |
|exportRouteTargets|Values of export route targets to be configured on CEs for exchanging routes between CE & PE via MPLS option 10B|for example, 65048:10050|True(If OptionB enabled)|Integer |
||
|**ts-config**| Terminal Server Configuration Details||True ||
|primaryIpv4Prefix| The terminal server Net1 interface should be assigned the first usable IP from the prefix and the corresponding interface on PE should be assigned the second usable address|20.0.10.0/30, TS Net1 interface should be assigned 20.0.10.1 and PE interface 20.0.10.2|True|String |
|secondaryIpv4Prefix|IPv4 Prefix for connectivity between TS and PE2. The terminal server Net2 interface should be assigned the first usable IP from the prefix and the corresponding interface on PE should be assigned the second usable address|20.0.0.4/30, TS Net2 interface should be assigned 20.0.10.5 and PE interface 20.0.10.6|True|String |
|primaryIpv6Prefix| The terminal server Net1 interface should be assigned the first usable IP from the prefix and the corresponding interface on PE should be assigned the second usable address| TS Net1 interface should be assigned the next IP and PE interface the next IP |True|String |
|secondaryIpv6Prefix|IPv6 Prefix for connectivity between TS and PE2. The terminal server Net2 interface should be assigned the first usable IP from the prefix and the corresponding interface on PE should be assigned the second usable address| TS Net2 interface should be assigned next IP and PE interface the next IP |True|String |
|username| Username configured on the terminal server that the services use to configure TS||True|String|
|password| Password configured on the terminal server that the services use to configure TS||True|String|
||
|**nni-config**| Network to Network Inter-connectivity configuration between CEs and PEs||True||
|*layer2Configuration*| Layer 2 configuration ||||
|portCount| Number of ports that are part of the port-channel. Maximum value is based on Fabric SKU|2||Integer|
|mtu| Maximum transmission unit between CE and PE. |1500||Integer|
|*layer3Configuration*| Layer 3 configuration between CEs and PEs||True||
|primaryIpv4Prefix|IPv4 Prefix for connectivity between CE1 and PE1. CE1 port-channel interface is assigned the first usable IP from the prefix and the corresponding interface on PE1 should be assigned the second usable address|10.246.0.124/31, CE1 port-channel interface is assigned 10.246.0.125 and PE1 port-channel interface should be assigned 10.246.0.126||String|
|secondaryIpv4Prefix|IPv4 Prefix for connectivity between CE2 and PE2. CE2 port-channel interface is assigned the first usable IP from the prefix and the corresponding interface on PE2 should be assigned the second usable address|10.246.0.128/31, CE2 port-channel interface should be assigned 10.246.0.129 and PE2 port-channel interface 10.246.0.130||String|
|primaryIpv6Prefix|IPv6 Prefix for connectivity between CE1 and PE1. CE1 port-channel interface is assigned the first usable IP from the prefix and the corresponding interface on PE1 should be assigned the second usable address|10.246.0.124/31, CE1 port-channel interface is assigned 10.246.0.125 and PE1 port-channel interface should be assigned 10.246.0.126||String|
|secondaryIpv6Prefix|IPv6 Prefix for connectivity between CE2 and PE2. CE2 port-channel interface is assigned the first usable IP from the prefix and the corresponding interface on PE2 should be assigned the second usable address|10.246.0.128/31, CE2 port-channel interface should be assigned 10.246.0.129 and PE2 port-channel interface 10.246.0.130||String|
|FabricAsn|ASN number assigned on CE for BGP peering with PE|65048||Integer|
|peerAsn|ASN number assigned on PE for BGP peering with CE. For iBGP between PE/CE, the value should be same as FabricAsn, for eBGP the value should be different from FabricAsn |65048|True|Integer|
|vlan-id| VLAN identifier used for connectivity between PE/CE. The value should be between 10 to 20| 10-20||Integer|
||

## Create a Network Fabric

Resource group must be created before Network Fabric creation. It's recommended to create a separate resource group for each Network Fabric. Resource group is created with the following command:

```azurecli
az group create -n NFResourceGroup -l "East US"
```

Run the following command to create the Network Fabric:

```azurecli
az nf fabric create \
--resource-group "NFResourceGroupName" \
--location "eastus" \
--resource-name "NFName" \
--nf-sku "NFSKU" \
--nfc-id ""/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkfabric/networkfabricControllers/NFCName" \" \
--fabric-asn 65014 \
--ipv4-prefix 10.x.0.0/19 \
--ipv6-prefix fda0:d59c:da05::/59 \
--rack-count 8 \
--server-count-per-rack 16 \
--ts-config '{"primaryIpv4Prefix":"20.x.0.5/30","secondaryIpv4Prefix": "20.x.1.6/30","username":"*****", "password": "************", "serialNumber":"************"}' \
--managed-network-config '{"infrastructureVpnConfiguration":{"peeringOption":"OptionB","optionBProperties":{"importRouteTargets":["65014:10039"],"exportRouteTargets":["65014:10039"]}}, "workloadVpnConfiguration":{"peeringOption": "OptionB", "optionBProperties": {"importRouteTargets": ["65014:10050"], "exportRouteTargets": ["65014:10050"]}}}'     
```

Expected output:

```json
{
  "annotation": null,
  "fabricAsn": 65014,
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkfabric/networkfabrics/NFName",
  "ipv4Prefix": "10.x.0.0/19",
  "ipv6Prefix": "fda0:d59c:da05::/59",
  "l2IsolationDomains": null,
  "l3IsolationDomains": null,
  "location": "eastus",
  "managementNetworkConfiguration": {
    "infrastructureVpnConfiguration": {
      "administrativeState": "Enabled",
      "networkToNetworkInterconnectId": null,
      "optionAProperties": null,
      "optionBProperties": {
        "exportRouteTargets": [
          "65014:10039"
        ],
        "importRouteTargets": [
          "65014:10039"
        ]
      },
      "peeringOption": "OptionB"
    },
    "workloadVpnConfiguration": {
      "administrativeState": "Enabled",
      "networkToNetworkInterconnectId": null,
      "optionAProperties": null,
      "optionBProperties": {
        "exportRouteTargets": [
          "65014:10050"
        ],
        "importRouteTargets": [
          "65014:10050"
        ]
      },
      "peeringOption": "OptionB"
    }
  },
  "name": "NFName",
  "networkFabricControllerId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFCResourceGroupName/providers/Microsoft.ManagedNetworkfabric/networkfabricControllers/NFCName",
  "networkFabricSku": "NFSKU",
  "operationalState": null,
  "provisioningState": "Accepted",
  "rackCount": 8,
  "racks": null,
  "resourceGroup": "NFResourceGroup",
  "routerId": null,
  "serverCountPerRack": 16,
  "systemData": {
    "createdAt": "2023-03-10T11:06:33.818069+00:00",
    "createdBy": "email@address.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-03-10T11:06:33.818069+00:00",
    "lastModifiedBy": "email@address.com",
    "lastModifiedByType": "User"
  },
  "tags": null,
  "terminalServerConfiguration": {
    "networkDeviceId": null,
    "password": null,
    "primaryIpv4Prefix": "20.x.0.5/30",
    "primaryIpv6Prefix": null,
    "secondaryIpv4Prefix": "20.x.1.6/30",
    "secondaryIpv6Prefix": null,
    "serialNumber": "xxxxxxxx",
    "username": "xxxxxxxx"
  },
  "type": "microsoft.managednetworkfabric/networkfabrics"
}
```

## List Network Fabric

```azurecli
az nf fabric list --resource-group "NFResourceGroup"  
```

Expected output:

```json
[
  {
    "annotation": null,
    "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkfabric/networkfabrics/NFName",
  "ipv4Prefix": "10.x.0.0/19",
  "ipv6Prefix": "fda0:d59c:da05::/59",
  "l2IsolationDomains": null,
  "l3IsolationDomains": null,
  "location": "eastus",
  "managementNetworkConfiguration": {
    "infrastructureVpnConfiguration": {
      "administrativeState": "Enabled",
      "networkToNetworkInterconnectId": null,
      "optionAProperties": null,
      "optionBProperties": {
        "exportRouteTargets": [
          "65014:10039"
        ],
        "importRouteTargets": [
          "65014:10039"
        ]
      },
      "peeringOption": "OptionB"
    },
    "workloadVpnConfiguration": {
      "administrativeState": "Enabled",
      "networkToNetworkInterconnectId": null,
      "optionAProperties": null,
      "optionBProperties": {
        "exportRouteTargets": [
          "65014:10050"
        ],
        "importRouteTargets": [
          "65014:10050"
        ]
      },
      "peeringOption": "OptionB"
    }
  },
    "name": "NFName",
    "networkfabricControllerId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFCResourceGroupName/providers/Microsoft.ManagedNetworkfabric/networkfabricControllers/NFCName",
  "networkFabricSku": "NFSKU",
  "operationalState": null,
  "provisioningState": "Succeeded",
  "rackCount": 8,
  "racks": null,
  "resourceGroup": "NFResourceGroup",
  "routerId": null,
  "serverCountPerRack": 16,
  "systemData": {
    "createdAt": "2023-03-10T11:06:33.818069+00:00",
    "createdBy": "email@address.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-03-10T11:06:33.818069+00:00",
    "lastModifiedBy": "email@address.com",
    "lastModifiedByType": "User"
  },
  "tags": null,
  "terminalServerConfiguration": {
    "networkDeviceId": null,
    "password": null,
    "primaryIpv4Prefix": "20.x.0.5/30",
    "primaryIpv6Prefix": null,
    "secondaryIpv4Prefix": "20.x.1.6/30",
    "secondaryIpv6Prefix": null,
    "serialNumber": "xxxxxxxx",
    "username": "xxxxxxxx"
  },
  "type": "microsoft.managednetworkfabric/networkfabrics"
}
]
```

## Create NNI

Upon creating Network Fabric, the next action is to create NNI. 
Run the following command to create the NNI:

```azurecl
az nf nni create --resource-group "NFResourceGroup" \
--location "eastus" \
--resource-name "NNIResourceName" \
--fabric "NFName" \
--is-management-type "True" \
--use-option-b "True" \
--layer2-configuration '{"portCount": 1, "mtu": 1500}' \
--layer3-configuration '{"peerASN": 65014, "vlanId": 683, "primaryIpv4Prefix": "10.x.0.124/30", "secondaryIpv4Prefix": "10.x.0.128/30", "primaryIpv6Prefix": "fda0:d59c:da0a:500::7c/127", "secondaryIpv6Prefix": "fda0:d59c:da0a:500::80/127"}'
```

Expected output:

```json
{
  "administrativeState": null,
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkFabrics/NFName/networkToNetworkInterconnects/NNIResourceName",
  "isManagementType": "True",
  "layer2Configuration": {
    "interfaces": null,
    "mtu": 1500,
    "portCount": 1
  },
  "layer3Configuration": {
    "exportRoutePolicyId": null,
    "fabricAsn": null,
    "importRoutePolicyId": null,
    "peerAsn": 65014,
    "primaryIpv4Prefix": "10.x.0.124/30",
    "primaryIpv6Prefix": "fda0:d59c:da0a:500::7c/127",
    "secondaryIpv4Prefix": "10.x.0.128/30",
    "secondaryIpv6Prefix": "fda0:d59c:da0a:500::80/127",
    "vlanId": 683
  },
  "name": "NNIResourceName",
  "provisioningState": "Succeeded",
  "resourceGroup": "NFResourceGroup",
  "systemData": {
    "createdAt": "2023-03-10T13:35:45.952324+00:00",
    "createdBy": "email@address.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-03-10T13:35:45.952324+00:00",
    "lastModifiedBy": "email@address.com",
    "lastModifiedByType": "User"
  },
  "type": "microsoft.managednetworkfabric/networkfabrics/networktonetworkinterconnects",
  "useOptionB": "True"
}
```

Once NNI created, NFA creates the corresponding Device resources.

## Next steps

* Update the serial number in the Device resource with the actual serial number on the device. The device sends the serial number as part of DHCP request.
* Configure the terminal server with the serial numbers of all the Devices (which also hosts DHCP server)
* Provision the Device via zero-touch provisioning mode. Based on the serial number in the DHCP request, the DHCP server responds with the boot configuration file for the corresponding Device

## Update Network Fabric Device

Run the following command to update Device with required details:

```azurecli
az nf device update  \
--resource-group "NFResourceGroup"  \
--location "eastus"  \
--resource-name "network-device-name" \
--host-name "NFName-CR2-TOR1" \
--serial-number "12345"
```

Expected output:

```json
{
  "annotation": null,
  "hostName": "NFName-CR2-TOR1",
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/rgName/providers/Microsoft.ManagedNetworkfabric/networkDevices/NFName-CR2-TOR1",
  "location": "eastus",
  "name": "networkDevice1",
  "networkRackId": null,
  "provisioningState": "Succeeded",
  "resourceGroup": "NFResourceGroupName",
  "serialNumber": "Arista;DCS-7010TX-48;12.00;JPE12345678",
  "systemData": {
    "createdAt": "2022-10-26T09:30:14.424546+00:00",
    "createdBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
    "createdByType": "Application",
    "lastModifiedAt": "2022-10-31T15:45:24.320290+00:00",
    "lastModifiedBy": "email@address.com",
    "lastModifiedByType": "User"
  },
  "tags": null,
  "type": "microsoft.managednetworkfabric/networkdevices",
  "version": null
}
```

## List Network Fabric Device

Run the following command to list Device:

```azurecli
az nf device list --resource-group "NFResourceGroup"
```

Expected output:

```json
{
    "annotation": null,
    "hostName": "NFName-CR1-TOR1",
    "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/rgName/providers/Microsoft.ManagedNetworkfabric/networkDevices/NFName-CR1-TOR1",
    "location": "eastus",
    "name": "networkDevice1",
    "networkRackId": null,
    "provisioningState": "Succeeded",
    "resourceGroup": "NFResourceGroupName",
    "serialNumber": "Arista;DCS-7280DR3-24;12.05;JPE12345678",
    "systemData": {
      "createdAt": "2022-10-20T17:23:49.203745+00:00",
      "createdBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
      "createdByType": "Application",
      "lastModifiedAt": "2022-10-27T17:38:57.438007+00:00",
      "lastModifiedBy": "email@address.com",
      "lastModifiedByType": "User"
    },
    "tags": null,
    "type": "microsoft.managednetworkfabric/networkdevices",
    "version": null
  },
  {
    "annotation": null,
    "hostName": "NFName-CR1-MgmtSwitch",
    "id": "subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/rgName/providers/Microsoft.ManagedNetworkfabric/networkDevices/NFName-CR1-MgmtSwitch",
    "location": "eastus",
    "name": "Network device",
    "networkRackId": null,
    "provisioningState": "Succeeded",
    "resourceGroup": "NFResourceGroupName",
    "serialNumber": "Arista;DCS-7010TX-48;12.02;JPE12345678",
    "systemData": {
      "createdAt": "2022-10-27T17:23:53.581927+00:00",
      "createdBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
      "createdByType": "Application",
      "lastModifiedAt": "2022-10-27T17:38:59.922499+00:00",
      "lastModifiedBy": "email@address.com",
      "lastModifiedByType": "User"
    },
    "tags": null,
    "type": "microsoft.managednetworkfabric/networkdevices",
    "version": null
  }
```

Run the following command to show details of a Device:

```azurecli
az nf device show --resource-group "example-rg" --resource-name "example-device"
```

Expected output:

```json
{
  "annotation": null,
  "hostName": "NFName-CR1-TOR1",
  "id": "subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/rgName/providers/Microsoft.ManagedNetworkfabric/networkDevices/networkDevice1",
  "location": "eastus",
  "name": "networkDevice1",
  "networkRackId": null,
  "provisioningState": "Succeeded",
  "resourceGroup": "NFResourceGroupName",
  "serialNumber": "Arista;DCS-7280DR3-24;12.05;JPE12345678",
  "systemData": {
    "createdAt": "2022-10-27T17:23:49.203745+00:00",
    "createdBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
    "createdByType": "Application",
    "lastModifiedAt": "2022-10-27T17:38:57.438007+00:00",
    "lastModifiedBy": "email@address.com",
    "lastModifiedByType": "User"
  },
  "tags": null,
  "type": "microsoft.managednetworkfabric/networkdevices",
  "version": null
}
```

## Provision Fabric

Once the Device serial number is updated, the Network Fabric needs to be provisioned by executing the following command

```azurecli
az nf fabric provision --resource-group "NFResourceGroup" --resource-name "NFName"
```

```azurecli
az nf fabric show --resource-group "NFResourceGroup" --resource-name "NFName"
```

Expected output:

```json
{
  "annotation": null,
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkfabric/networkfabrics/NFName",
  "l2IsolationDomains": null,
  "l3IsolationDomains": null,
  "location": "eastus",
  "managementNetworkConfiguration": {
    "ipv4Prefix": "10.x.0.0/19",
    "ipv6Prefix": null,
    "managementVpnConfiguration": {
      "optionAProperties": null,
      "optionBProperties": {
        "exportRouteTargets": [
          "65048:10039"
        ],
        "importRouteTargets": [
          "65048:10039"
        ]
      },
      "peeringOption": "OptionA",
      "state": "Enabled"
    },
    "workloadVpnConfiguration": {
      "optionAProperties": null,
      "optionBProperties": {
        "exportRouteTargets": [
          "65048:10050"
        ],
        "importRouteTargets": [
          "65048:10050"
        ]
      },
      "peeringOption": "OptionA",
      "state": "Enabled"
    }
  },
  "name": "NFName",
  "networkfabricControllerId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFCResourceGroupName/providers/Microsoft.ManagedNetworkfabric/networkfabricControllers/NFCName",
  "networkfabricSku": "NFSKU",
  "networkToNetworkInterconnect": {
    "layer2Configuration": null,
    "layer3Configuration": {
      "fabricAsn": 65048,
      "peerAsn": 65048,
      "primaryIpv4Prefix": "10.x.0.124/30",
      "primaryIpv6Prefix": null,
      "routerId": null,
      "secondaryIpv4Prefix": "10.x.0.128/30",
      "secondaryIpv6Prefix": null,
      "vlanId": 20
    }
  },
  "operationalState": "Provisioned",
  "provisioningState": "Succeeded",
  "racks": [
    "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkfabric/networkRacks/AggRack"
  ],
  "resourceGroup": "NFResourceGroup",
  "systemData": {
    "createdAt": "2022-11-02T06:56:05.019873+00:00",
    "createdBy": "email@adddress.com",
    "createdByType": "User",
    "lastModifiedAt": "2022-11-02T09:12:58.889552+00:00",
    "lastModifiedBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
    "lastModifiedByType": "Application"
  },
  "tags": null,
  "terminalServerConfiguration": {
    "networkDeviceId": null,
    "password": null,
    "primaryIpv4Prefix": "20.x.10.0/30",
    "primaryIpv6Prefix": null,
    "secondaryIpv4Prefix": "20.x.10.4/30",
    "secondaryIpv6Prefix": null,
    "****": "****"
  },
  "type": "microsoft.managednetworkfabric/networkfabrics"
}
```

## Deleting Network Fabric

To delete the Network Fabric, the operational state of shouldn't be `Provisioned`. To change the operational state from `Provisioned`, run the `deprovision` command.

```azurecli
az nf fabric deprovision --resource-group "NFResourceGroup"  --resource-name "NFName"
```

Expected output:

```json
{
  "annotation": null,
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkfabric/networkfabrics/NFName",
  "l2IsolationDomains": null,
  "l3IsolationDomains": null,
  "location": "eastus",
  "managementNetworkConfiguration": {
    "ipv4Prefix": "10.x.0.0/19",
    "ipv6Prefix": null,
    "managementVpnConfiguration": {
      "optionAProperties": null,
      "optionBProperties": {
        "exportRouteTargets": [
          "65048:10039"
        ],
        "importRouteTargets": [
          "65048:10039"
        ]
      },
      "peeringOption": "OptionA",
      "state": "Enabled"
    },
    "workloadVpnConfiguration": {
      "optionAProperties": null,
      "optionBProperties": {
        "exportRouteTargets": [
          "65048:10050"
        ],
        "importRouteTargets": [
          "65048:10050"
        ]
      },
      "peeringOption": "OptionA",
      "state": "Enabled"
    }
  },
  "name": "NFName",
  "networkfabricControllerId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFCResourceGroupName/providers/Microsoft.ManagedNetworkfabric/networkfabricControllers/NFCName",
  "networkfabricSku": "NFSKU",
  "networkToNetworkInterconnect": {
    "layer2Configuration": null,
    "layer3Configuration": {
      "fabricAsn": 65048,
      "peerAsn": 65048,
      "primaryIpv4Prefix": "10.x.0.124/30",
      "primaryIpv6Prefix": null,
      "routerId": null,
      "secondaryIpv4Prefix": "10.x.0.128/30",
      "secondaryIpv6Prefix": null,
      "vlanId": 20
    }
  },
  "operationalState": null,
  "provisioningState": "deprovisioned",
  "racks":["/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkfabric/networkRacks/AggRack".
  "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkfabric/networkRacks/CompRack1,
  "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkfabric/networkRacks/CompRack2]
  "resourceGroup": "NFResourceGroup",
  "systemData": {
    "createdAt": "2022-11-02T06:56:05.019873+00:00",
    "createdBy": "email@adddress.com",
    "createdByType": "User",
    "lastModifiedAt": "2022-11-02T06:56:05.019873+00:00",
    "lastModifiedBy": "email@adddress.com",
    "lastModifiedByType": "User"
  },
  "tags": null,
  "terminalServerConfiguration": {
    "networkDeviceId": null,
    "password": null,
    "primaryIpv4Prefix": "20.x.10.0/30",
    "primaryIpv6Prefix": null,
    "secondaryIpv4Prefix": "20.x.10.4/30",
    "secondaryIpv6Prefix": null,
    "****": "root"
  },
  "type": "microsoft.managednetworkfabric/networkfabrics"
}
```

After the operationalState is no longer `Provisioned`, delete the Network Fabric

```azurecli
az nf fabric delete --resource-group "NFResourceGroup"  --resource-name "NFName" 
```
