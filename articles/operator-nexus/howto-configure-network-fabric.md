---
title: "Azure Operator Nexus: How to configure the Network fabric"
description: Learn to create, view, list, update, delete commands for Network fabric
author: surajmb #Required
ms.author: surmb #Required
ms.service: azure  #Required
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 02/06/2023 #Required; mm/dd/yyyy format.
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Create and provision a network fabric using Azure CLI

This article describes how to create a Network fabric by using the Azure Command Line Interface (AzCLI). This document also shows you how to check the status, update, or delete a Network fabric.

## Prerequisites

* A Network fabric Controller has been created--add link in your Azure account.
  * A Network fabric Controller instance in Azure can be used for multiple Network-fabrics.
  * You can reuse a pre-existing Network fabric Controller.
* Install the latest version of the [CLI commands](#install-cli-extensions)
* Physical infrastructure has been installed and cabled as per BoM.
* ExpressRoute connectivity has been established between the Azure region and your WAN (your networking).
* The needed VLANs, Route-Targets and IP addresses have been configured in your network.
* Terminal server has been [installed and configured](./quickstarts-platform-prerequisites.md#set-up-terminal-server)

### Install CLI extensions

Install latest version of the [necessary CLI extensions](./howto-install-cli-extensions.md).

## Parameters needed to create network fabric

| Parameter | Description  |  Example |  Required|  Type|
|-----------------------------------------------|---| ---|----|------------|
| resource-group | Name of the resource group |  "NFResourceGroup" |True | String |
| location | Location of Azure region | "eastus" |True | String |
| resource-name | Name of the FabricResource | Austin-Fabric |True | String |
| nf-sku  |Fabric SKU ID, should be based on the SKU of the BoM that was ordered. Contact AFO team for specific SKU value for the BoM | att |True | String|
| nfc-id |Network fabric Controller ARM resource ID| |True | String |
||
|**managed-network-config**| Details of management network ||True ||
|ipv4Prefix|IPv4 Prefix of the management network. This Prefix should be unique across all Network-fabrics in a Network fabric Controller. Prefix length should be at least 19 (/20 isn't allowed, /18 and lower are allowed) | 10.246.0.0/19|True | String |
||
|**managementVpnConfiguration**| Details of management VPN connection between Network fabric and infrastructure services in Network fabric Controller||True ||
|*optionBProperties*| Details of MPLS option 10B that is used for connectivity between Network fabric and Network fabric Controller||True ||
|importRouteTargets|Values of import route targets to be configured on CEs for exchanging routes between CE & PE via MPLS option 10B| 65048:10039|True(If OptionB enabled)|Integer |
|exportRouteTargets|Values of export route targets to be configured on CEs for exchanging routes between CE & PE via MPLS option 10B| 65048:10039|True(If OptionB enabled)|Integer |
||
|**workloadVpnConfiguration**| Details of workload VPN connection between Network fabric and workload services in Network fabric Controller||||
|*optionBProperties*| Details of MPLS option 10B that is used for connectivity between Network fabric and Network fabric Controller||||
|importRouteTargets|Values of import route targets to be configured on CEs for exchanging routes between CE & PE via MPLS option 10B|for example, 65048:10050|True(If OptionB enabled)|Integer |
|exportRouteTargets|Values of export route targets to be configured on CEs for exchanging routes between CE & PE via MPLS option 10B|for example, 65048:10050|True(If OptionB enabled)|Integer |
||
|**ts-config**| Terminal Server Configuration Details||True ||
|primaryIpv4Prefix| The terminal server Net1 interface should be assigned the first usable IP from the prefix and the corresponding interface on PE should be assigned the second usable address|20.0.10.0/30, TS Net1 interface should be assigned 20.0.10.1 and PE interface 20.0.10.2|True|String |
|secondaryIpv4Prefix|IPv4 Prefix for connectivity between TS and PE2. The terminal server Net2 interface should be assigned the first usable IP from the prefix and the corresponding interface on PE should be assigned the second usable address|20.0.0.4/30, TS Net2 interface should be assigned 20.0.10.5 and PE interface 20.0.10.6|True|String |
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
|fabricAsn|ASN number assigned on CE for BGP peering with PE|65048||Integer|
|peerAsn|ASN number assigned on PE for BGP peering with CE. For iBGP between PE/CE, the value should be same as fabricAsn, for eBGP the value should be different from fabricAsn |65048|True|Integer|
|vlan-id| VLAN identifier used for connectivity between PE/CE. The value should be between 10 to 20| 10-20||Integer|
||

## Create a network fabric

Resource group must be created before Network fabric creation. It's recommended to create a separate resource group for each Network fabric. Resource group can be created by the following command:

```azurecli
az group create -n NFResourceGroup -l "East US"
```

Run the following command to create the Network fabric:

```azurecli


az nf fabric create \
--resource-group "NFResourceGroupName" \
--location "eastus" \
--resource-name "NFName" \
--nf-sku "NFSKU" \
--nfc-id ""/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkFabricControllers/NFCName" \" \
  --nni-config '{"layer3Configuration":{"primaryIpv4Prefix":"10.246.0.124/30", "secondaryIpv4Prefix": "10.246.0.128/30", "fabricAsn":65048, "peerAsn":65048, "vlanId": 20}}' \
  --ts-config '{"primaryIpv4Prefix":"20.0.10.0/30", "secondaryIpv4Prefix": "20.0.10.4/30","username":"****", "password": "*****"}' \
  --managed-network-config '{"ipv4Prefix":"10.246.0.0/19", \
     "managementVpnConfiguration":{"optionBProperties":{"importRouteTargets":["65048:10039"], "exportRouteTargets":["65048:10039"]}}, \
     "workloadVpnConfiguration":{"optionBProperties":{"importRouteTargets":["65048:10050"], "exportRouteTargets":["65048:10050"]}}}' 

```

Expected output:

```json
{
  "annotation": null,
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkFabrics/NFName",
  "l2IsolationDomains": null,
  "l3IsolationDomains": null,
  "location": "eastus",
  "managementNetworkConfiguration": {
    "ipv4Prefix": "10.246.0.0/19",
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
  "networkFabricControllerId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFCResourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkFabricControllers/NFCName",
  "networkFabricSku": "NFSKU",
  "networkToNetworkInterconnect": {
    "layer2Configuration": null,
    "layer3Configuration": {
      "fabricAsn": 65048,
      "peerAsn": 65048,
      "primaryIpv4Prefix": "10.246.0.124/30",
      "primaryIpv6Prefix": null,
      "routerId": null,
      "secondaryIpv4Prefix": "10.246.0.128/30",
      "secondaryIpv6Prefix": null,
      "vlanId": 20
    }
  },
  "operationalState": null,
  "provisioningState": "Accepted",
  "racks": null,
  "resourceGroup": "NFResourceGroup",
  "systemData": {
    "createdAt": "2022-11-02T06:56:05.019873+00:00",
    "createdBy": "email@address.com",
    "createdByType": "User",
    "lastModifiedAt": "2022-11-02T06:56:05.019873+00:00",
    "lastModifiedBy": "email@address.com",
    "lastModifiedByType": "User"
  },
  "tags": null,
  "terminalServerConfiguration": {
    "networkDeviceId": null,
    "password": null,
    "primaryIpv4Prefix": "20.0.10.0/30",
    "primaryIpv6Prefix": null,
    "secondaryIpv4Prefix": "20.0.10.4/30",
    "secondaryIpv6Prefix": null,
    "****": "root"
  },
  "type": "microsoft.managednetworkfabric/networkfabrics"
}
```

## List or get network fabric

```azurecli
az nf fabric list --resource-group "NFResourceGroup"  
```

Expected output:

```json
[
  {
    "annotation": null,
    "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkFabrics/NFName",
    "l2IsolationDomains": null,
    "l3IsolationDomains": null,
    "location": "eastus",
    "managementNetworkConfiguration": {
      "ipv4Prefix": "10.246.0.0/19",
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
    "networkFabricControllerId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFCResourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkFabricControllers/NFCName",
    "networkFabricSku": "NFSKU",
    "networkToNetworkInterconnect": {
      "layer2Configuration": null,
      "layer3Configuration": {
        "fabricAsn": 65048,
        "peerAsn": 65048,
        "primaryIpv4Prefix": "10.246.0.124/30",
        "primaryIpv6Prefix": null,
        "routerId": null,
        "secondaryIpv4Prefix": "10.246.0.128/30",
        "secondaryIpv6Prefix": null,
        "vlanId": 20
      }
    },
    "operationalState": null,
    "provisioningState": "Failed",
    "racks": null,
    "resourceGroup": "NFResourceGroup",
    "systemData": {
      "createdAt": "2022-11-02T06:56:05.019873+00:00",
      "createdBy": "email@address.com",
      "createdByType": "User",
      "lastModifiedAt": "2022-11-02T06:56:05.019873+00:00",
      "lastModifiedBy": "email@address.com",
      "lastModifiedByType": "User"
    },
    "tags": null,
    "terminalServerConfiguration": {
      "networkDeviceId": null,
      "password": null,
      "primaryIpv4Prefix": "20.0.10.0/30",
      "primaryIpv6Prefix": null,
      "secondaryIpv4Prefix": "20.0.10.4/30",
      "secondaryIpv6Prefix": null,
      "****": "****"
    },
    "type": "microsoft.managednetworkfabric/networkfabrics"
  }
]
```

## Add racks

On creating NetworkFabric, one aggregate rack and two or more compute racks should be added to the Network fabric. The number of racks should match the physical racks in the Operator Nexus instance

### Add aggregate rack

```azurecli
az nf rack create  \
--resource-group "NFResourceGroup"  \
--location "eastus"  \
--network-rack-sku "att"  \
--nf-id "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkFabrics/NFName" \
--resource-name "AR1" 
```

Expected output:

```json
{
  "annotation": null,
  "id": "/subscriptions/8a0c9a74-a831-4363-8590-49bbdd2ea39e/resourceGroups/OP1lab2-fabric/providers/Microsoft.ManagedNetworkFabric/networkRacks/AR1",
  "location": "eastus",
  "name": "AR1",
  "networkDevices": [
    "/subscriptions/8a0c9a74-a831-4363-8590-49bbdd2ea39e/resourceGroups/OP1lab2-fabric/providers/Microsoft.ManagedNetworkFabric/networkDevices/NFName-AR1-CE1",
    "/subscriptions/8a0c9a74-a831-4363-8590-49bbdd2ea39e/resourceGroups/OP1lab2-fabric/providers/Microsoft.ManagedNetworkFabric/networkDevices/NFName-AR1-CE2",
    "/subscriptions/8a0c9a74-a831-4363-8590-49bbdd2ea39e/resourceGroups/OP1lab2-fabric/providers/Microsoft.ManagedNetworkFabric/networkDevices/NFName-AR1-TOR17",
    "/subscriptions/8a0c9a74-a831-4363-8590-49bbdd2ea39e/resourceGroups/OP1lab2-fabric/providers/Microsoft.ManagedNetworkFabric/networkDevices/NFName-AR1-TOR18",
    "/subscriptions/8a0c9a74-a831-4363-8590-49bbdd2ea39e/resourceGroups/OP1lab2-fabric/providers/Microsoft.ManagedNetworkFabric/networkDevices/NFName-AR1-MgmtSwitch1",
    "/subscriptions/8a0c9a74-a831-4363-8590-49bbdd2ea39e/resourceGroups/OP1lab2-fabric/providers/Microsoft.ManagedNetworkFabric/networkDevices/NFName-AR1-MgmtSwitch2",
    "/subscriptions/8a0c9a74-a831-4363-8590-49bbdd2ea39e/resourceGroups/OP1lab2-fabric/providers/Microsoft.ManagedNetworkFabric/networkDevices/NFName-AR1-NPB1",
    "/subscriptions/8a0c9a74-a831-4363-8590-49bbdd2ea39e/resourceGroups/OP1lab2-fabric/providers/Microsoft.ManagedNetworkFabric/networkDevices/NFName-AR1-NPB2"
  ],
  "networkFabricId": "/subscriptions/8a0c9a74-a831-4363-8590-49bbdd2ea39e/resourceGroups/OP1lab2-fabric/providers/Microsoft.ManagedNetworkFabric/networkFabrics/NFName",
  "networkRackSku": "att",
  "provisioningState": "Succeeded",
  "resourceGroup": "NFResourceGroupName",
  "systemData": {
    "createdAt": "2022-11-01T17:04:18.908946+00:00",
    "createdBy": "email@adress.com",
    "createdByType": "User",
    "lastModifiedAt": "2022-11-01T17:04:18.908946+00:00",
    "lastModifiedBy": "email@address.com",
    "lastModifiedByType": "User"
  },
  "tags": null,
  "type": "microsoft.managednetworkfabric/networkracks"
}
```

### Add compute rack 1

```azurecli
az nf rack create  \
--resource-group "NFResourceGroup"  \
--location "eastus"  \
--network-rack-sku "att"  \
--nf-id "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkFabrics/NFName" \
--resource-name "CR1" 
```

Expected output:

```json
{
  "annotation": null,
  "id": "/subscriptions/8a0c9a74-a831-4363-8590-49bbdd2ea39e/resourceGroups/OP1lab2-fabric/providers/Microsoft.ManagedNetworkFabric/networkRacks/CR1",
  "location": "eastus",
  "name": "CR1",
  "networkDevices": [
    "/subscriptions/8a0c9a74-a831-4363-8590-49bbdd2ea39e/resourceGroups/OP1lab2-fabric/providers/Microsoft.ManagedNetworkFabric/networkDevices/NFName-CR1-TOR1",
    "/subscriptions/8a0c9a74-a831-4363-8590-49bbdd2ea39e/resourceGroups/OP1lab2-fabric/providers/Microsoft.ManagedNetworkFabric/networkDevices/NFName-CR1-TOR2",
    "/subscriptions/8a0c9a74-a831-4363-8590-49bbdd2ea39e/resourceGroups/OP1lab2-fabric/providers/Microsoft.ManagedNetworkFabric/networkDevices/NFName-CR1-MgmtSwitch"
  ],
  "networkFabricId": "/subscriptions/8a0c9a74-a831-4363-8590-49bbdd2ea39e/resourceGroups/OP1lab2-fabric/providers/Microsoft.ManagedNetworkFabric/networkFabrics/NFName",
  "networkRackSku": "att",
  "provisioningState": "Succeeded",
  "resourceGroup": "NFResourceGroupName",
  "systemData": {
    "createdAt": "2022-11-01T17:05:21.219619+00:00",
    "createdBy": "email@address.com",
    "createdByType": "User",
    "lastModifiedAt": "2022-11-01T17:05:21.219619+00:00",
    "lastModifiedBy": "email@address.com",
    "lastModifiedByType": "User"
  },
  "tags": null,
  "type": "microsoft.managednetworkfabric/networkracks"
}
```

### Add compute rack 2

```azurecli
az nf rack create  \
--resource-group "NFResourceGroup"  \
--location "eastus"  \
--network-rack-sku "att"  \
--nf-id "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkFabrics/NFName" \
--resource-name "CR2" 
```

Once all the racks are added, NFA creates the corresponding networkDevice resources.

## Next Steps

* Update the serial number in the networkDevice resource with the actual serial number on the device. The device sends the serial number as part of DHCP request.
* Configure the terminal server with the serial numbers of all the devices (which also hosts DHCP server)
* Provision the network devices via zero-touch provisioning mode. Based on the serial number in the DHCP request, the DHCP server responds with the boot configuration file for the corresponding device

## Update network fabric devices

Run the following command to update Network fabric Devices:

```azurecli
az nf device update  \
--resource-group "NFResourceGroup"  \
--location "eastus"  \
--resource-name "network-device-name" \
--network-device-sku "DeviceSku" \
--network-device-role "CE" \
--device-name "NFName-CR2-TOR1" \
--serial-number "12345"
```

Expected output:

```json
{
  "annotation": null,
  "deviceName": "NFName-CR2-TOR1",
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/rgName/providers/Microsoft.ManagedNetworkFabric/networkDevices/NFName-CR2-TOR1",
  "location": "eastus",
  "name": "networkDevice1",
  "networkDeviceRole": "TOR1",
  "networkDeviceSku": "DeviceSku",
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

## List or get network fabric devices

Run the following command to List Network fabric Devices:

```azurecli
az nf device list --resource-group "NFResourceGroup"
```

Expected output:

```json
{
    "annotation": null,
    "deviceName": "NFName-CR1-TOR1",
    "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/rgName/providers/Microsoft.ManagedNetworkFabric/networkDevices/NFName-CR1-TOR1",
    "location": "eastus",
    "name": "networkDevice1",
    "networkDeviceRole": "TOR1",
    "networkDeviceSku": "DeviceSku",
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
    "deviceName": "NFName-CR1-MgmtSwitch",
    "id": "subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/rgName/providers/Microsoft.ManagedNetworkFabric/networkDevices/NFName-CR1-MgmtSwitch",
    "location": "eastus",
    "name": "Network device",
    "networkDeviceRole": "MgmtSwitch",
    "networkDeviceSku": "DeviceSku",
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

Run the following command to Get or Show details of a Network fabric Device:

```azurecli
az nf device show --resource-group "example-rg" --resource-name "example-device"
```

Expected output:

```json
{
  "annotation": null,
  "deviceName": "NFName-CR1-TOR1",
  "id": "subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/rgName/providers/Microsoft.ManagedNetworkFabric/networkDevices/networkDevice1",
  "location": "eastus",
  "name": "networkDevice1",
  "networkDeviceRole": "TOR1",
  "networkDeviceSku": "DeviceSku",
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

## Provision fabric

Once the device serial number is updated, the fabric needs to be provisioned by executing the following command

```azurecli
az nf fabric provision --resource-group "NFResourceGroup"  --resource-name "NFName"
```

```azurecli
az nf fabric show --resource-group "NFResourceGroup"    --resource-name "NFName"
```

Expected output:

```json
{
  "annotation": null,
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkFabrics/NFName",
  "l2IsolationDomains": null,
  "l3IsolationDomains": null,
  "location": "eastus",
  "managementNetworkConfiguration": {
    "ipv4Prefix": "10.246.0.0/19",
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
  "networkFabricControllerId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFCResourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkFabricControllers/NFCName",
  "networkFabricSku": "NFSKU",
  "networkToNetworkInterconnect": {
    "layer2Configuration": null,
    "layer3Configuration": {
      "fabricAsn": 65048,
      "peerAsn": 65048,
      "primaryIpv4Prefix": "10.246.0.124/30",
      "primaryIpv6Prefix": null,
      "routerId": null,
      "secondaryIpv4Prefix": "10.246.0.128/30",
      "secondaryIpv6Prefix": null,
      "vlanId": 20
    }
  },
  "operationalState": "Provisioned",
  "provisioningState": "Succeeded",
  "racks": [
    "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkRacks/AttAggRack"
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
    "primaryIpv4Prefix": "20.0.10.0/30",
    "primaryIpv6Prefix": null,
    "secondaryIpv4Prefix": "20.0.10.4/30",
    "secondaryIpv6Prefix": null,
    "****": "****"
  },
  "type": "microsoft.managednetworkfabric/networkfabrics"
}
```

## Deleting fabric

To delete the fabric, the operational state of Fabric shouldn't be "Provisioned". To change the operational state from Provisioned, run the same command to create the fabric. Ensure there are no racks associated before deleting fabric.

```azurecli
az nf fabric create \
--resource-group "NFResourceGroup" \
--location "eastus" \
--resource-name "NFName" \
--nf-sku "NFSKU" \
--nfc-id ""/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/ResourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkFabricControllers/NFCName" \" \
  --nni-config '{"layer3Configuration":{"primaryIpv4Prefix":"10.246.0.124/30", "secondaryIpv4Prefix": "10.246.0.128/30", "fabricAsn":65048, "peerAsn":65048, "vlanId": 20}}' \
  --ts-config '{"primaryIpv4Prefix":"20.0.10.0/30", "secondaryIpv4Prefix": "20.0.10.4/30","****":"****", "password": "*****"}' \
  --managed-network-config '{"ipv4Prefix":"10.246.0.0/19", \
     "managementVpnConfiguration":{"optionBProperties":{"importRouteTargets":["65048:10039"], "exportRouteTargets":["65048:10039"]}}, \
     "workloadVpnConfiguration":{"optionBProperties":{"importRouteTargets":["65048:10050"], "exportRouteTargets":["65048:10050"]}}}' 

```

Expected output:

```json
{
  "annotation": null,
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkFabrics/NFName",
  "l2IsolationDomains": null,
  "l3IsolationDomains": null,
  "location": "eastus",
  "managementNetworkConfiguration": {
    "ipv4Prefix": "10.246.0.0/19",
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
  "networkFabricControllerId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFCResourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkFabricControllers/NFCName",
  "networkFabricSku": "NFSKU",
  "networkToNetworkInterconnect": {
    "layer2Configuration": null,
    "layer3Configuration": {
      "fabricAsn": 65048,
      "peerAsn": 65048,
      "primaryIpv4Prefix": "10.246.0.124/30",
      "primaryIpv6Prefix": null,
      "routerId": null,
      "secondaryIpv4Prefix": "10.246.0.128/30",
      "secondaryIpv6Prefix": null,
      "vlanId": 20
    }
  },
  "operationalState": null,
  "provisioningState": "Accepted",
  "racks":["/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkRacks/AttAggRack".
  "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkRacks/AttCompRack1,
  "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkRacks/AttCompRack2]
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
    "primaryIpv4Prefix": "20.0.10.0/30",
    "primaryIpv6Prefix": null,
    "secondaryIpv4Prefix": "20.0.10.4/30",
    "secondaryIpv6Prefix": null,
    "****": "root"
  },
  "type": "microsoft.managednetworkfabric/networkfabrics"
}
```

After the operationalState is no longer "Provisioned", delete all the racks one by one

```azurecli
az nf rack delete --resource-group "NFResourceGroup"  --resource-name "RackName" 
```

```azurecli
az nf fabric show --resource-group "NFResourceGroup"    --resource-name "NFName"
```
