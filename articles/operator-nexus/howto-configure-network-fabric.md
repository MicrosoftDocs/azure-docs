---
title: "Azure Operator Nexus: Configure the network fabric"
description: Learn commands to create, view, list, update, and delete network fabrics.
author: jdasari
ms.author: jdasari
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 03/26/2023
ms.custom: template-how-to, devx-track-azurecli
---

# Create and provision a network fabric by using the Azure CLI

This article describes how to create a network fabric for Azure Operator Nexus by using the Azure CLI. This article also shows you how to check the status of, update, and delete a network fabric.

## Prerequisites

* An Azure account with an active subscription.
* The latest version of the Azure CLI commands (2.0 or later). For more information, see [Install the Azure CLI](./howto-install-cli-extensions.md).
* A network fabric controller (NFC) that manages multiple network fabrics in the same Azure region.
* A physical Azure Operator Nexus instance with cabling, as described in the bill of materials (BoM).
* Azure ExpressRoute connectivity between NFC and Azure Operator Nexus instances.
* A terminal server [installed and configured](./howto-platform-prerequisites.md#set-up-terminal-server) with a username and password.
* Provider edge (PE) devices preconfigured with necessary VLANs, route targets, and IP addresses.

Supported SKUs for network fabric instances are:

* M4-A400-A100-C16-aa for up to four compute racks
* M8-A400-A100-C16-aa for up to eight compute racks

## Steps to provision a fabric and racks

1. Create a network fabric by providing racks, server count, SKU, and network configuration.
1. Create a network-to-network interconnect (NNI) by providing Layer 2 and Layer 3 parameters.
1. Update the serial number in the network device resource with the actual serial number on the device. The device sends the serial number as part of a DHCP request.
1. Configure the terminal server (which also hosts the DHCP server) with the serial numbers of all the devices.
1. Provision the network devices via zero-touch provisioning mode. Based on the serial number in the DHCP request, the DHCP server responds with the boot configuration file for the corresponding device.

## Configure a network fabric

The following table specifies parameters that you use to create a network fabric. In the table, `$prefix` is `/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkFabricControllers`.

| Parameter | Description | Example | Required | Type |
|-----------|-------------|---------|----------|------|
| `resource-group` | Name of the resource group. |  `NFResourceGroup` |True ||
| `location` | Azure Operator Nexus region. | `eastus` |True | 
| `resource-name` | Name of the fabric resource. | `NF-ResourceName` |True ||
|  `nf-sku`  |Fabric SKU ID, which is the SKU of the ordered BoM. The two supported SKUs are M4-A400-A100-C16-aa and M8-A400-A100-C16-aa. | `M4-A400-A100-C16-aa` |True | String|
|`nfc-id`|Azure Resource Manager resource ID for the network fabric controller.|`$prefix/NFCName`|True ||
|`rackcount`|Number of compute racks per fabric. Possible values are `2` to `8`.|`8`|True ||
|`serverCountPerRack`|Number of compute servers per rack. Possible values are `4`, `8`, `12`, and `16`.|`16`|True ||
|`ipv4Prefix`|IPv4 prefix of the management network. This prefix should be unique across all network fabrics in a network fabric controller. Prefix length should be at least 19 (/20 isn't allowed, but /18 and lower are allowed). | `10.246.0.0/19`|True ||
|`ipv6Prefix`|IPv6 prefix of the management network. This prefix should be unique across all network fabrics in a network fabric controller. | `10:5:0:0::/59`|True ||
|`management-network-config`| Details of the management network. ||True ||
|`infrastructureVpnConfiguration`| Details of the management VPN connection between the network fabric and infrastructure services in the network fabric controller.||True||
|`optionBProperties`| Details of MPLS Option 10B, which is used for connectivity between the network fabric and the network fabric controller.||True||
|`importRouteTargets`|Values of import route targets to be configured on customer edges (CEs) for exchanging routes between a CE and provider edge (PE) via MPLS Option 10B.|`65048:10039`|True (if Option B is enabled)||
|`exportRouteTargets`|Values of export route targets to be configured on CEs for exchanging routes between a CE and a PE via MPLS Option 10B.| `65048:10039`|True (if Option B is enabled)||
|`workloadVpnConfiguration`| Details of the workload VPN connection between the network fabric and workload services in the network fabric controller.||||
|`optionBProperties`| Details of MPLS Option 10B, which is used for connectivity between the network fabric and the network fabric controller.||||
|`importRouteTargets`|Values of import route targets to be configured on CEs for exchanging routes between a CE and a PE via MPLS Option 10B.|`65048:10050`|True (if Option B is enabled)||
|`exportRouteTargets`|Values of export route targets to be configured on CEs for exchanging routes between a CE and a PE via MPLS Option 10B.|`65048:10050`|True (if Option B is enabled)||
|`ts-config`| Terminal server configuration details.||True||
|`primaryIpv4Prefix`| IPv4 prefix for connectivity between the terminal server and the primary PE. The terminal server interface for the primary network is assigned the first usable IP from the prefix. The corresponding interface on the PE is assigned the second usable address.|`20.0.10.0/30`; the terminal server interface for the primary network is assigned `20.0.10.1`, and the PE interface is assigned `20.0.10.2`.|True||
|`secondaryIpv4Prefix`|IPv4 prefix for connectivity between the terminal server and the secondary PE. The terminal server interface for the secondary network is assigned the first usable IP from the prefix. The corresponding interface on the PE is assigned the second usable address.|`20.0.0.4/30`; the terminal server interface for the secondary network is assigned `20.0.10.5`, and the PE interface is assigned `20.0.10.6`.|True||
|`username`| Username that the services use to configure the terminal server.||True||
|`password`| Password that the services use to configure the terminal server.||True||
|`serialNumber`| Serial number of the terminal server.||||

### Create a network fabric

You must create a resource group before you create a network fabric. We recommend that you create a separate resource group for each network fabric. You can create a resource group by using the following command:

```azurecli
az group create -n NFResourceGroup -l "East US"
```

Run the following command to create the network fabric. The rack count is either `4` or `8`, depending on your setup.

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
--managed-network-config '{"infrastructureVpnConfiguration":{"peeringOption":"OptionB","optionBProperties":{"importRouteTargets":["65048:10039"],"exportRouteTargets":["65048:10039"]}}, "workloadVpnConfiguration":{"peeringOption": "OptionB", "optionBProperties": {"importRouteTargets": ["65048:10050"], "exportRouteTargets": ["65048:10050"]}}}'

```

Expected output:

```output
{
  "annotation": null,
  "fabricAsn": 65048,
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkFabrics/NFName",
  "ipv4Prefix": "10.2.0.0/19",
  "ipv6Prefix": "fda0:d59c:da02::/59",
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
          "65048:10039"
        ],
        "importRouteTargets": [
          "65048:10039"
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
          "65048:10050"
        ],
        "importRouteTargets": [
          "65048:10050"
        ]
      },
      "peeringOption": "OptionB"
    }
  },
  "name": "NFName",
  "networkFabricControllerId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFCResourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkFabricControllers/NFCName",
  "networkFabricSku": "NFSKU",
  "operationalState": null,
  "provisioningState": "Accepted",
  "rackCount": 4,
  "racks": null,
  "resourceGroup": "NFResourceGroupName",
  "routerId": null,
  "serverCountPerRack": 8,
  "systemData": {
    "createdAt": "2023-XX-X-6T12:52:11.769525+00:00",
    "createdBy": "email@address.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-XX-XX-6T12:52:11.769525+00:00",
    "lastModifiedBy": "email@address.com",
    "lastModifiedByType": "User"
  },
  "tags": null,
  "terminalServerConfiguration": {
    "networkDeviceId": null,
    "password": null,
    "primaryIpv4Prefix": "20.0.1.0/30",
    "primaryIpv6Prefix": null,
    "secondaryIpv4Prefix": "20.0.0.0/30",
    "secondaryIpv6Prefix": null,
    "serialNumber": "TerminalServerSerialNumber",
    "username": "****"
  },
  "type": "microsoft.managednetworkfabric/networkfabrics"
}
```

### Show network fabrics

```azurecli
az networkfabric fabric show --resource-group "NFResourceGroupName" --resource-name "NFName"
```

Expected output:

```output

{
  "annotation": null,
  "fabricAsn": 65048,
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkFabrics/NFName",
  "ipv4Prefix": "10.2.0.0/19",
  "ipv6Prefix": "fda0:d59c:da02::/59",
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
          "65048:10039"
        ],
        "importRouteTargets": [
          "65048:10039"
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
          "65048:10050"
        ],
        "importRouteTargets": [
          "65048:10050"
        ]
      },
      "peeringOption": "OptionB"
    }
  },
  "name": "nffab1031623",
  "networkFabricControllerId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFCResourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkFabricControllers/NFCName",
  "networkFabricSku": "NFSKU",
  "operationalState": null,
  "provisioningState": "Succeeded",
  "rackCount": 4,
  "racks": [
    "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourcegroups/NFResourceGroup/providers/microsoft.managednetworkfabric/networkracks/NFName-aggrack",
    "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourcegroups/NFResourceGroup/providers/microsoft.managednetworkfabric/networkracks/NFName-comprack1",
    "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourcegroups/NFResourceGroup/providers/microsoft.managednetworkfabric/networkracks/NFName-comprack2"
  ],
  "resourceGroup": "NFResourceGroup",
  "routerId": null,
  "serverCountPerRack": 8,
  "systemData": {
    "createdAt": "2023-XX-XXT12:52:11.769525+00:00",
    "createdBy": "email@address.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-XX-XXT12:53:02.504974+00:00",
    "lastModifiedBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
    "lastModifiedByType": "Application"
  },
  "tags": null,
  "terminalServerConfiguration": {
    "networkDeviceId": null,
    "password": null,
    "primaryIpv4Prefix": "20.0.1.0/30",
    "primaryIpv6Prefix": null,
    "secondaryIpv4Prefix": "20.0.0.0/30",
    "secondaryIpv6Prefix": null,
    "serialNumber": "TerminalServerSerialNumber",
    "username": "****"
  },
  "type": "microsoft.managednetworkfabric/networkfabrics"
}

```

### List all network fabrics in a resource group

```azurecli
az networkfabric fabric list --resource-group "NFResourceGroup"  
```

Expected output:

```output
{
    "annotation": null,
    "fabricAsn": 65048,
    "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkFabrics/NFName",
    "ipv4Prefix": "10.2.0.0/19",
    "ipv6Prefix": "fda0:d59c:da02::/59",
    "l2IsolationDomains": [Null],   
    "l3IsolationDomains": [Null],
    "location": "eastus",
    "managementNetworkConfiguration": {
      "infrastructureVpnConfiguration": {
        "administrativeState": "Enabled",
        "networkToNetworkInterconnectId": null,
        "optionAProperties": null,
        "optionBProperties": {
          "exportRouteTargets": [
            "65048:10039"
          ],
          "importRouteTargets": [
            "65048:10039"
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
            "65048:10050"
          ],
          "importRouteTargets": [
            "65048:10050"
          ]
        },
        "peeringOption": "OptionB"
      }
    },
    "name": "NFName",
    "networkFabricControllerId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFCResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkFabricControllers/NFCName",
    "networkFabricSku": "NFSKU",
    "operationalState": "Provisioned",
    "provisioningState": "Succeeded",
    "rackCount": 4,
    "racks": [
      "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourcegroups/NFResourceGroup/providers/microsoft.managednetworkfabric/networkracks/NFName-aggrack",
      "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourcegroups/NFResourceGroup/providers/microsoft.managednetworkfabric/networkracks/NFName-comprack1",
      "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourcegroups/NFResourceGroup/providers/microsoft.managednetworkfabric/networkracks/NFName-comprack2"
    ],
    "resourceGroup": "NFResourceGroup",
    "routerId": null,
    "serverCountPerRack": 8,
    "systemData": {
      "createdAt": "2023-XX-XXT12:52:11.769525+00:00",
      "createdBy": "email@address.com",
      "createdByType": "User",
      "lastModifiedAt": "2023-XX-XXT02:05:44.043591+00:00",
      "lastModifiedBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
      "lastModifiedByType": "Application"
    },
    "tags": null,
    "terminalServerConfiguration": {
      "networkDeviceId": null,
      "password": null,
      "primaryIpv4Prefix": "20.0.1.0/30",
      "primaryIpv6Prefix": null,
      "secondaryIpv4Prefix": "20.0.0.0/30",
      "secondaryIpv6Prefix": null,
      "serialNumber": "TerminalServerSerialNumber",
      "username": "****"
    },
    "type": "microsoft.managednetworkfabric/networkfabrics"
  }  
```

## Configure an NNI

The following table specifies the parameters that you use to create a network-to-network interconnect.

| Parameter | Description | Example | Required | Type |
|-----------|-------------|---------|----------|------|
|`isMangementType`| Configuration to use an NNI for management of the fabric. Possible values are `True` and `False`. The default value is `True`.  |`True`|True||
|`useOptionB`| Configuration to enable Option B. Possible values are `True` and `False`. |`True`|True||
|`layer2Configuration`| Layer 2 configuration. ||||
|`portCount`| Number of ports that are part of the port channel. The maximum value is based on the fabric SKU.|`3`|||
|`mtu`| Maximum transmission unit between CEs and PEs. |`1500`|||
|`layer3Configuration`| Layer 3 configuration between CEs and PEs.||True||
|`primaryIpv4Prefix`|IPv4 prefix for connectivity between the primary CE and the primary PE. The port-channel interface for the primary CE is assigned the first usable IP from the prefix. The corresponding interface on the primary PE is assigned the second usable address.|`10.246.0.124/31`; the port-channel interface for the primary CE is assigned `10.246.0.125`, and the port-channel interface for the primary PE is assigned `10.246.0.126`.||String|
|`secondaryIpv4Prefix`|IPv4 prefix for connectivity between the secondary CE and the secondary PE. The port-channel interface for the secondary CE is assigned the first usable IP from the prefix. The corresponding interface on the secondary PE is assigned the second usable address.|`10.246.0.128/31`; the port-channel interface for the secondary CE is assigned `10.246.0.129`, and the port-channel interface for the secondary PE is assigned `10.246.0.130`.||String|
|`primaryIpv6Prefix`|IPv6 prefix for connectivity between the primary CE and the primary PE. The port-channel interface for the primary CE is assigned the first usable IP from the prefix. The corresponding interface on the primary PE is assigned the second usable address.|`3FFE:FFFF:0:CD30::a1` is assigned to the primary CE, and `3FFE:FFFF:0:CD30::a2` is assigned to the primary PE. Default value is `3FFE:FFFF:0:CD30::a0/126`.||String|
|`secondaryIpv6Prefix`|IPv6 prefix for connectivity between the secondary CE and the secondary PE. The port-channel interface for the secondary CE is assigned the first usable IP from the prefix. The corresponding interface on the secondary PE is assigned the second usable address.|`3FFE:FFFF:0:CD30::a5` is assigned to the secondary CE, and `3FFE:FFFF:0:CD30::a6` is assigned to the secondary PE. Default value is `3FFE:FFFF:0:CD30::a4/126`.||String|
|`fabricAsn`|ASN assigned on the CE for BGP peering with the PE.|`65048`|||
|`peerAsn`|ASN assigned on the PE for BGP peering with the CE. For internal BGP between the PE and the CE, the value should be the same as `fabricAsn`. For external BGP, the value should be different from `fabricAsn`. |`65048`|True||
|`fabricAsn`|ASN assigned on the CE for BGP peering with the PE.|`65048`|||
|`vlan-Id`|VLAN for the NNI. The range is 501 to 4095. |`501`|||
|`importRoutePolicy`|Details to import a route policy.||||
|`exportRoutePolicy`|Details to export a route policy.||||

### Create an NNI

You must create the resource group and network fabric before you create a network-to-network interconnect.

Run the following command to create the NNI:

```azurecli

az networkfabric nni create \
--resource-group "NFResourceGroup" \
--location "eastus" \
--resource-name "NFNNIName" \
--fabric "NFFabric" \
--is-management-type "True" \
--use-option-b "True" \
--layer2-configuration '{"portCount": 3, "mtu": 1500}' \
--layer3-configuration '{"peerASN": 65048, "vlanId": 501, "primaryIpv4Prefix": "10.2.0.124/30", "secondaryIpv4Prefix": "10.2.0.128/30", "primaryIpv6Prefix": "10:2:0:124::400/127", "secondaryIpv6Prefix": "10:2:0:124::402/127"}'

```

Expected output:

```output
{
  "administrativeState": null,
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkFabrics/nffab1031623/networkToNetworkInterconnects/NFNNIName",
  "isManagementType": "True",
  "layer2Configuration": {
    "interfaces": null,
    "mtu": 1500,
    "portCount": 3
  },
  "layer3Configuration": {
    "exportRoutePolicyId": null,
    "fabricAsn": null,
    "importRoutePolicyId": null,
    "peerAsn": 65048,
    "primaryIpv4Prefix": "10.2.0.124/30",
    "primaryIpv6Prefix": "10:2:0:124::400/127",
    "secondaryIpv4Prefix": "10.2.0.128/30",
    "secondaryIpv6Prefix": "10:2:0:124::402/127",
    "vlanId": 501
  },
  "name": "NFNNIName",
  "provisioningState": "Succeeded",
  "resourceGroup": "NFResourceGroup",
  "systemData": {
    "createdAt": "2023-XX-XXT13:13:22.514644+00:00",
    "createdBy": "email@address.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-XX-XXT13:13:22.514644+00:00",
    "lastModifiedBy": "email@address.com",
    "lastModifiedByType": "User"
  },
  "type": "microsoft.managednetworkfabric/networkfabrics/networktonetworkinterconnects",
  "useOptionB": "True"

```

### Show network fabric NNIs

```azurecli
az networkfabric nni show -g "NFResourceGroup" --resource-name "NFNNIName" --fabric "NFFabric"

```

Expected output:

```output
{
  "administrativeState": null,
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkFabrics/NFFabric/networkToNetworkInterconnects/NFNNIName",
  "isManagementType": "True",
  "layer2Configuration": {
    "interfaces": null,
    "mtu": 1500,
    "portCount": 3
  },
  "layer3Configuration": {
    "exportRoutePolicyId": null,
    "fabricAsn": null,
    "importRoutePolicyId": null,
    "peerAsn": 65048,
    "primaryIpv4Prefix": "10.2.0.124/30",
    "primaryIpv6Prefix": "10:2:0:124::400/127",
    "secondaryIpv4Prefix": "10.2.0.128/30",
    "secondaryIpv6Prefix": "10:2:0:124::402/127",
    "vlanId": 501
  },
  "name": "NFNNIName",
  "provisioningState": "Succeeded",
  "resourceGroup": "NFResourceGroup",
  "systemData": {
    "createdAt": "2023-XX-XXT13:13:22.514644+00:00",
    "createdBy": "email@address.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-XX-XX13:13:22.514644+00:00",
    "lastModifiedBy": "email@address.com",
    "lastModifiedByType": "User"
  },
  "type": "microsoft.managednetworkfabric/networkfabrics/networktonetworkinterconnects",
  "useOptionB": "True"
```

### List or get network fabric NNIs

```azurecli
az networkfabric nni list -g NFResourceGroup --fabric NFFabric
```

Expected output:

```output
{
    "administrativeState": null,
    "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkFabrics/NFFabric/networkToNetworkInterconnects/NFNNIName",
    "isManagementType": "True",
    "layer2Configuration": {
      "interfaces": null,
      "mtu": 1500,
      "portCount": 3
    },
    "layer3Configuration": {
      "exportRoutePolicyId": null,
      "fabricAsn": null,
      "importRoutePolicyId": null,
      "peerAsn": 65048,
      "primaryIpv4Prefix": "10.2.0.124/30",
      "primaryIpv6Prefix": "10:2:0:124::400/127",
      "secondaryIpv4Prefix": "10.2.0.128/30",
      "secondaryIpv6Prefix": "10:2:0:124::402/127",
      "vlanId": 501
    },
    "name": "NFNNIName",
    "provisioningState": "Succeeded",
    "resourceGroup": "NFResourceGroup",
    "systemData": {
      "createdAt": "2023-XX-XXT13:13:22.514644+00:00",
      "createdBy": "email@address.com.com",
      "createdByType": "User",
      "lastModifiedAt": "2023-XX-XXT13:13:22.514644+00:00",
      "lastModifiedBy": "email@address.com.com",
      "lastModifiedByType": "User"
    },
    "type": "microsoft.managednetworkfabric/networkfabrics/networktonetworkinterconnects",
    "useOptionB": "True"
  }
```

## Update network fabric devices

Run the following command to update network fabric devices:

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
  "annotation": null,
  "hostName": "AggrRack-CE01",
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkDevices/Network-Device-Name",
  "location": "eastus2euap",
  "name": "Network-Device-Name",
  "networkDeviceRole": "CE1",
  "networkDeviceSku": "DefaultSku",
  "networkRackId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkRacks/Network-Device-Name",
  "provisioningState": "Succeeded",
  "resourceGroup": "NFResourceGroup",
  "serialNumber": "AXXXX;DCS-XXXXX-24;XX.XX;JXXXXXXX",
  "systemData": {
    "createdAt": "2023-XX-XXT12:52:42.270551+00:00",
    "createdBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
    "createdByType": "Application",
    "lastModifiedAt": "2023-XX-XXT13:30:24.098335+00:00",
    "lastModifiedBy": "email@address.com",
    "lastModifiedByType": "User"
  },
  "tags": null,
  "type": "microsoft.managednetworkfabric/networkdevices",
  "version": null
}
```

The preceding code serves only as an example. You should update all the devices that are part of both `AggrRack` and `computeRacks`.

For example, `AggrRack` consists of:

* `CE01`
* `CE02`
* `TOR17`
* `TOR18`
* `MgmtSwitch01`
* `MgmtSwitch02` (and so on, for other switches)

## List or get network fabric devices

Run the following command to list network fabric devices in a resource group:

```azurecli
az networkfabric device list --resource-group "NFResourceGroup"
```

Expected output:

```output
{
    "annotation": null,
    "hostName": "AggrRack-CE01",
    "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkDevices/NFName-AggrRack-CE1",
    "location": "eastus",
    "name": "Network-Device-Name",
    "networkDeviceRole": "CE1",
    "networkDeviceSku": "DefaultSku",
    "networkRackId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkRacks/Network-Device-Name",
    "provisioningState": "Succeeded",
    "resourceGroup": "NFResourceGroup",
    "serialNumber": "ArXXX;DCS-7XXXXXX-24;12.05;JPXXXXXXXX",
    "systemData": {
      "createdAt": "2023-XX-XXT12:52:42.270551+00:00",
      "createdBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
      "createdByType": "Application",
      "lastModifiedAt": "2023-XX-XXT13:30:24.098335+00:00",
      "lastModifiedBy": "email@address.com",
      "lastModifiedByType": "User"
    },
    "tags": null,
    "type": "microsoft.managednetworkfabric/networkdevices",
    "version": null
  },
  {
    "annotation": null,
    "hostName": "AggrRack-CE02",
    "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkDevices/NFName-AggrRack-CE2",
    "location": "eastus",
    "name": "Network-Device-Name",
    "networkDeviceRole": "CE2",
    "networkDeviceSku": "DefaultSku",
    "networkRackId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkRacks/Network-Device-Name",
    "provisioningState": "Succeeded",
    "resourceGroup": "NFResourceGroup",
    "serialNumber": "ArXXX;DCS-7XXXXXX-24;12.05;JPXXXXXXXX",
    "systemData": {
      "createdAt": "2023-XX-XXT12:52:43.489256+00:00",
      "createdBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
      "createdByType": "Application",
      "lastModifiedAt": "2023-XX-XXT13:30:40.923567+00:00",
      "lastModifiedBy": "email@address.com",
      "lastModifiedByType": "User"
    },
    "tags": null,
    "type": "microsoft.managednetworkfabric/networkdevices",
    "version": null
  },
  {
    "annotation": null,
    "hostName": "AggRack-TOR17",
    "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkDevices/NFName-AggrRack-TOR17",
    "location": "eastus2euap",
    "name": "Network-Device-Name",
    "networkDeviceRole": "TOR17",
    "networkDeviceSku": "DefaultSku",
    "networkRackId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkRacks/Network-Device-Name",
    "provisioningState": "Succeeded",
    "resourceGroup": "NFResourceGroup",
    "serialNumber": "ArXXX;DCS-7XXXXXX-24;12.05;JPXXXXXXXX",
    "systemData": {
      "createdAt": "2023-XX-XXT12:52:44.676759+00:00",
      "createdBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
      "createdByType": "Application",
      "lastModifiedAt": "2023-XX-XXT13:31:59.650758+00:00",
      "lastModifiedBy": "email@address.com",
      "lastModifiedByType": "User"
    },
    "tags": null,
    "type": "microsoft.managednetworkfabric/networkdevices",
    "version": null
  },
  {
    "annotation": null,
    "hostName": "AggRack-TOR18",
    "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkDevices/NFName-AggrRack-TOR18",
    "location": "eastus",
    "name": "Network-Device-Name",
    "networkDeviceRole": "TOR18",
    "networkDeviceSku": "DefaultSku",
    "networkRackId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkRacks/Network-Device-Name",
    "provisioningState": "Succeeded",
    "resourceGroup": "NFResourceGroup",
    "serialNumber": "ArXXX;DCS-7XXXXXX-24;12.05;JPXXXXXXXX",
    "systemData": {
      "createdAt": "2023-03-16T12:52:45.801778+00:00",
      "createdBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
      "createdByType": "Application",
      "lastModifiedAt": "2023-XX-XXT13:32:13.369591+00:00",
      "lastModifiedBy": "email@address.com",
      "lastModifiedByType": "User"
    },
    "tags": null,
    "type": "microsoft.managednetworkfabric/networkdevices",
    "version": null
  },
  {
    "annotation": null,
    "hostName": "AggRack-MGMT1",
    "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkDevices/NFName-AggrRack-MgmtSwitch1",
    "location": "eastus",
    "name": "Network-Device-Name",
    "networkDeviceRole": "MgmtSwitch1",
    "networkDeviceSku": "DefaultSku",
    "networkRackId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkRacks/Network-Device-Name",
    "provisioningState": "Succeeded",
    "resourceGroup": "NFResourceGroup",
    "serialNumber": "ArXXX;DCS-7XXXXXX-24;12.05;JPXXXXXXXX",
    "systemData": {
      "createdAt": "2023-XX-XXT12:52:46.911202+00:00",
      "createdBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
      "createdByType": "Application",
      "lastModifiedAt": "2023-XX-XXT13:31:00.836730+00:00",
      "lastModifiedBy": "email@address.com",
      "lastModifiedByType": "User"
    },
    "tags": null,
    "type": "microsoft.managednetworkfabric/networkdevices",
    "version": null
  },
  {
    "annotation": null,
    "hostName": "AggRack-MGMT2",
    "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkDevices/NFName-AggrRack-MgmtSwitch2",
    "location": "eastus",
    "name": "Network-Device-Name",
    "networkDeviceRole": "MgmtSwitch2",
    "networkDeviceSku": "DefaultSku",
    "networkRackId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkRacks/Network-Device-Name",
    "provisioningState": "Succeeded",
    "resourceGroup": "NFResourceGroup",
    "serialNumber": "ArXXX;DCS-7XXXXXX-24;12.05;JPXXXXXXXX",
    "systemData": {
      "createdAt": "2023-XX-XXT12:52:48.020528+00:00",
      "createdBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
      "createdByType": "Application",
      "lastModifiedAt": "2023-XX-XXT13:31:42.173645+00:00",
      "lastModifiedBy": "email@address.com",
      "lastModifiedByType": "User"
    },
    "tags": null,
    "type": "microsoft.managednetworkfabric/networkdevices",
    "version": null
  }
```

Run the following command to get or show details of a network fabric device:

```azurecli
az networkfabric device show --resource-group "NFResourceGroup" --resource-name "Network-Device-Name"
```

Expected output:

```output
{
  "annotation": null,
  "hostName": "AggrRack-CE01",
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkDevices/NFName-AggrRack-CE1",
  "location": "eastus",
  "name": "Network-Device-Name",
  "networkDeviceRole": "CE1",
  "networkDeviceSku": "DefaultSku",
  "networkRackId": "/subscriptions/61065ccc-9543-4b91-b2d1-0ce42a914507/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkRacks/Network-Device-Name",
  "provisioningState": "Succeeded",
  "resourceGroup": "NFResourceGroup",
  "serialNumber": "AXXXX;DCS-XXXXX-24;XX.XX;JXXXXXXX",
  "systemData": {
    "createdAt": "2023-XX-XXT12:52:42.270551+00:00",
    "createdBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
    "createdByType": "Application",
    "lastModifiedAt": "2023-XX-XXT13:30:24.098335+00:00",
    "lastModifiedBy": "email@address.com",
    "lastModifiedByType": "User"
  },
  "tags": null,
  "type": "microsoft.managednetworkfabric/networkdevices",
  "version": null
}
```

## Provision a network fabric

After you update the device serial number, provision and show the fabric by running the following commands:

```azurecli
az networkfabric fabric provision --resource-group "NFResourceGroup"  --resource-name "NFName"
```

```azurecli
az networkfabric fabric show --resource-group "NFResourceGroup"    --resource-name "NFName"
```

Expected output:

```output
{
  "annotation": null,
  "fabricAsn": 65048,
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkFabrics/NFName",
  "ipv4Prefix": "10.2.0.0/19",
  "ipv6Prefix": "fda0:d59c:da02::/59",
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
          "65048:10039"
        ],
        "importRouteTargets": [
          "65048:10039"
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
          "65048:10050"
        ],
        "importRouteTargets": [
          "65048:10050"
        ]
      },
      "peeringOption": "OptionB"
    }
  },
  "name": "NFName",
  "networkFabricControllerId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFCResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkFabricControllers/NFCName",
  "networkFabricSku": "NFSKU",
  "operationalState": "Provisioning",
  "provisioningState": "Succeeded",
  "rackCount": 3,
  "racks": [
    "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourcegroups/NFResourceGroup/providers/microsoft.managednetworkfabric/networkracks/NFName-aggrack",
    "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourcegroups/NFResourceGroup/providers/microsoft.managednetworkfabric/networkracks/NFName-comprack1",
    "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourcegroups/NFResourceGroup/providers/microsoft.managednetworkfabric/networkracks/NFName-comprack2"
  ],
  "resourceGroup": "NFResourceGroup",
  "routerId": null,
  "serverCountPerRack": 7,
  "systemData": {
    "createdAt": "2023-XX-XXT12:52:11.769525+00:00",
    "createdBy": "email@address.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-XX-XXT14:47:59.424826+00:00",
    "lastModifiedBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
    "lastModifiedByType": "Application"
  },
  "tags": null,
  "terminalServerConfiguration": {
    "networkDeviceId": null,
    "password": null,
    "primaryIpv4Prefix": "20.0.1.0/30",
    "primaryIpv6Prefix": null,
    "secondaryIpv4Prefix": "20.0.0.0/30",
    "secondaryIpv6Prefix": null,
    "serialNumber": "XXXXXXXXXXXX",
    "username": "XXXX"
  },
  "type": "microsoft.managednetworkfabric/networkfabrics"
}
```

## Deprovision a network fabric

To deprovision a fabric, ensure that the fabric is in a provisioned operational state and then run this command:

```azurecli
az networkfabric fabric deprovision --resource-group "NFResourceGroup" --resource-name "NFName"

```

Expected output:

```output
{
  "annotation": null,
  "fabricAsn": 65046,
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkFabrics/NFName",
  "ipv4Prefix": "10.18.0.0/19",
  "ipv6Prefix": null,
  "l2IsolationDomains": [],
  "l3IsolationDomains": null,
  "location": "eastus",
  "managementNetworkConfiguration": {
    "infrastructureVpnConfiguration": {
      "administrativeState": "Enabled",
      "networkToNetworkInterconnectId": null,
      "optionAProperties": null,
      "optionBProperties": {
        "exportRouteTargets": [
          "65048:10039"
        ],
        "importRouteTargets": [
          "65048:10039"
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
          "65048:10050"
        ],
        "importRouteTargets": [
          "65048:10050"
        ]
      },
      "peeringOption": "OptionB"
    }
  },
  "name": "NFName",
  "networkFabricControllerId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFCResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkFabricControllers/NFCName",
  "networkFabricSku": "M4-A400-A100-C16-aa",
  "operationalState": "Deprovisioned",
  "provisioningState": "Succeeded",
  "rackCount": 3,
  "racks": [
    "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourcegroups/NFResourceGroup/providers/microsoft.managednetworkfabric/networkracks/NFName-aggrack",
    "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourcegroups/NFResourceGroup/providers/microsoft.managednetworkfabric/networkracks/NFName-comprack1",
    "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourcegroups/NFResourceGroup/providers/microsoft.managednetworkfabric/networkracks/NFName-comprack2"
  ],
  "resourceGroup": "NFResourceGroup",
  "routerId": null,
  "serverCountPerRack": 8,
  "systemData": {
    "createdAt": "2023-XX-XXT19:30:23.319643+00:00",
    "createdBy": "email@address.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-XX-XXT06:47:36.130713+00:00",
    "lastModifiedBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
    "lastModifiedByType": "Application"
  },
  "tags": null,
  "terminalServerConfiguration": {
    "networkDeviceId": null,
    "password": null,
    "primaryIpv4Prefix": "20.0.1.12/30",
    "primaryIpv6Prefix": null,
    "secondaryIpv4Prefix": "20.0.0.12/30",
    "secondaryIpv6Prefix": null,
    "serialNumber": "XXXXXXXXXXXXX",
    "username": "XXXX"
  },
  "type": "microsoft.managednetworkfabric/networkfabrics"
}

```

## Delete a network fabric

To delete a fabric, run the following command. Before you do, make sure that:

* The fabric is in a deprovisioned operational state. If it's in a provisioned state, run the `deprovision` command.
* No racks are associated with the fabric.

```azurecli
az networkfabric fabric delete --resource-group "NFResourceGroup" --resource-name "NFName"

```

Expected output:

```output
{
  "annotation": null,
  "fabricAsn": 65044,
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkFabrics/NFName",
  "ipv4Prefix": "10.21.0.0/16",
  "ipv6Prefix": "10:15:0:0::/59",
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
          "65044:10039"
        ],
        "importRouteTargets": [
          "65044:10039"
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
          "65044:10050"
        ],
        "importRouteTargets": [
          "65044:10050"
        ]
      },
      "peeringOption": "OptionB"
    }
  },
  "name": "nffab2030823",
  "networkFabricControllerId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFCResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkFabricControllers/NFCName",
  "networkFabricSku": "SKU-Name",
  "operationalState": "Deprovisioned",
  "provisioningState": "Deleting",
  "rackCount": 3,
  "racks": [
    "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourcegroups/NFResourceGroup/providers/microsoft.managednetworkfabric/networkracks/NFName-aggrack",
    "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourcegroups/NFResourceGroup/providers/microsoft.managednetworkfabric/networkracks/NFName-comprack1",
    "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourcegroups/NFResourceGroup/providers/microsoft.managednetworkfabric/networkracks/NFName-comprack2"
  ],
  "resourceGroup": "NFResourceGroup",
  "routerId": null,
  "serverCountPerRack": 7,
  "systemData": {
    "createdAt": "2023-XX-XXT10:31:22.423399+00:00",
    "createdBy": "email@address.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-XX-XXT06:31:41.675991+00:00",
    "lastModifiedBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
    "lastModifiedByType": "Application"
  },
  "tags": null,
  "terminalServerConfiguration": {
    "networkDeviceId": null,
    "password": null,
    "primaryIpv4Prefix": "20.0.1.68/30",
    "primaryIpv6Prefix": null,
    "secondaryIpv4Prefix": "20.0.0.68/30",
    "secondaryIpv6Prefix": null,
    "serialNumber": "XXXXXXXXXXXXX",
    "username": "XXXX"
  },
  "type": "microsoft.managednetworkfabric/networkfabrics"
}
```

After you successfully delete the network fabric, when you run the command to show the fabric, you won't find any resources available:

```azurecli
az networkfabric fabric show --resource-group "NFResourceGroup" --resource-name "NFName"
```

Expected output:

```output
The Resource 'Microsoft.ManagedNetworkFabric/NetworkFabrics/NFName' under resource group 'NFResourceGroup' was not found. For more details please go to https://aka.ms/ARMResourceNotFoundFix
Code: ResourceNotFound
```
