---
title: "Azure Operator Nexus: Configure a network fabric controller"
description: Learn commands to create and modify a network fabric controller in Azure Operator Nexus instances.
author: jdasari
ms.author: jdasari
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 07/20/2023
ms.custom: template-how-to, devx-track-azurecli
---
# Create and modify a Network Fabric Controller using Azure CLI

This article describes how to create a Network Fabric Controller (NFC) by using the Azure Command Line Interface (AzureCLI).
This document also shows you how to check the status, or delete a Network Fabric Controller.

## Prerequisites

You must implement all the prerequisites prior to creating an NFC.

Names, such as for resources, shouldn't contain the underscore (\_) character.

### Validate ExpressRoute circuit

Validate the ExpressRoute circuit(s) for correct connectivity (CircuitID)(AuthID);  NFC provisioning would fail if connectivity is incorrect.


## Create a Network Fabric Controller

You must create a resource group before you create your NFC.

**Note**: You should create a separate Resource Group for each NFC.

You create resource groups by running the following commands:

```azurecli
az group create -n NFCResourceGroupName -l "East US"
```

## Attributes for NFC creation

| Parameter | Description | values | Example | Required     | Type   |
|---------|------------------------------|----------------------------|----------------------------|------------|------|
| Resource-Group | A resource group is a container that holds related resources for an Azure solution. | NFCResourceGroupName | XYZNFCResourceGroupName | True | String |
| Location | The Azure Region is mandatory to provision your deployment. | eastus, westus3, southcentralus, eus2euap | eastus | True         | String |
| Resource-Name | The Resource-name will be the name of the Fabric | nfcname | XYZnfcname | True         | String |
| NFC IP Block | This Block is the NFC IP subnet, the default subnet block is 10.0.0.0/19, and it also shouldn't overlap with any of the ExpressRoute IPs | 10.0.0.0/19 | 10.0.0.0/19 | Not Required | String |
| Express Route Circuits | The ExpressRoute circuit is a dedicated 10G link that connects Azure and on-premises. You need to know the ExpressRoute Circuit ID and Auth key for an NFC to successfully provision. There are two Express Route Circuits, one for the Infrastructure services and other one for Workload (Tenant) services | --workload-er-connections '[{"expressRouteCircuitId": "xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx", "expressRouteAuthorizationKey": "xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx"}]' <br /><br /> --infra-er-connections '[{"expressRouteCircuitId": "xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx", "expressRouteAuthorizationKey": "xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx"}]' | subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/ER-Dedicated-WUS2-AFO-Circuits/providers/Microsoft.Network/expressRouteCircuits/MSFT-ER-Dedicated-PvtPeering-WestUS2-AFO-Ckt-01", "expressRouteAuthorizationKey": "xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx"}] | True         | string |

Here's an example of how you can create an NFC using the Azure CLI.
For more information, see [attributes section](#attributes-for-nfc-creation).

```azurecli
az networkfabric controller create \
  --resource-group "NFCResourceGroupName" \
  --location "eastus"  \
  --resource-name "nfcname" \
  --ipv4-address-space "10.0.0.0/19" \
  --infra-er-connections '[{"expressRouteCircuitId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/ER-Dedicated-WUS2-AFO-Circuits/providers/Microsoft.Network/expressRouteCircuits/MSFT-ER-Dedicated-PvtPeering-WestUS2-AFO-Ckt-01", "expressRouteAuthorizationKey": "<auth-key>"}]'
  --workload-er-connections '[{"expressRouteCircuitId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/ER-Dedicated-WUS2-AFO-Circuits/providers/Microsoft.Network/expressRouteCircuits/MSFT-ER-Dedicated-PvtPeering-WestUS2-AFO-Ckt-01"", "expressRouteAuthorizationKey": "<auth-key>"}]'
```

**Note:** The NFC creation takes between 30-45 mins.
Use the `show` command to monitor NFC creation progress.
You'll see different provisioning states such as, Accepted, updating and Succeeded/Failed.
Delete and recreate the NFC if the creation fails (`Failed`).
The expected output only shows running as soon as you execute via AzureCLI

Expected output:

```json
 {
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFCResourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkFabricControllers/nfcname",
  "infrastructureExpressRouteConnections": [
    {
      "expressRouteCircuitId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/ER-Dedicated-WUS2-AFO-Circuits/providers/Microsoft.Network/expressRouteCircuits/MSFT-ER-Dedicated-PvtPeering-WestUS2-AFO-Ckt-02"
    }
  ],
  "infrastructureServices": {
    "ipv4AddressSpaces": [
      "10.0.0.0/21"
    ],
    "ipv6AddressSpaces": []
  },
  "ipv4AddressSpace": "10.0.0.0/19",
  "ipv6AddressSpace": "FC00::/59",
  "isWorkloadManagementNetworkEnabled": "True",
  "location": "eastus",
  "managedResourceGroupConfiguration": {},
  "name": "NFCName",
  "nfcSku": "Standard",
  "provisioningState": "Succeeded",
  "resourceGroup": "NFCResourceGroupName",
  "systemData": {
    "createdAt": "2023XX-XXT18:59:41.7805324Z",
    "createdBy": "email@address.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-XX-XXT09:50:27.4598499Z",
    "lastModifiedBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
    "lastModifiedByType": "Application"
  },
  "type": "microsoft.managednetworkfabric/networkfabriccontrollers",
  "workloadExpressRouteConnections": [
    {
      "expressRouteCircuitId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx//resourceGroups/ER-Dedicated-WUS2-AFO-Circuits/providers/Microsoft.Network/expressRouteCircuits/MSFT-ER-Dedicated-PvtPeering-WestUS2-AFO-Ckt-03"
    }
  ],
  "workloadManagementNetwork": true,
  "workloadServices": {
    "ipv4AddressSpaces": [
      "10.0.28.0/22"
    ],
    "ipv6AddressSpaces": []
  }
}
```

## Get Network Fabric Controller

```azurecli
  az networkfabric controller show --resource-group "NFCResourceGroupName" --resource-name "nfcname"
```

Expected output:

```json
{
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFCResourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkFabricControllers/nfcname",
  "infrastructureExpressRouteConnections": [
    {
      "expressRouteCircuitId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/ER-Dedicated-WUS2-AFO-Circuits/providers/Microsoft.Network/expressRouteCircuits/MSFT-ER-Dedicated-PvtPeering-WestUS2-AFO-Ckt-02"
    }
  ],
  "infrastructureServices": {
    "ipv4AddressSpaces": [
      "10.0.0.0/21"
    ],
    "ipv6AddressSpaces": []
  },
  "ipv4AddressSpace": "10.0.0.0/19",
  "ipv6AddressSpace": "FC00::/59",
  "isWorkloadManagementNetworkEnabled": "True",
  "location": "eastus",
  "managedResourceGroupConfiguration": {},
  "name": "NFCName",
  "nfcSku": "Standard",
  "provisioningState": "Succeeded",
  "resourceGroup": "NFCResourceGroupName",
  "systemData": {
    "createdAt": "2023XX-XXT18:59:41.7805324Z",
    "createdBy": "email@address.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-XX-XXT09:50:27.4598499Z",
    "lastModifiedBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
    "lastModifiedByType": "Application"
  },
  "type": "microsoft.managednetworkfabric/networkfabriccontrollers",
  "workloadExpressRouteConnections": [
    {
      "expressRouteCircuitId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx//resourceGroups/ER-Dedicated-WUS2-AFO-Circuits/providers/Microsoft.Network/expressRouteCircuits/MSFT-ER-Dedicated-PvtPeering-WestUS2-AFO-Ckt-03"
    }
  ],
  "workloadManagementNetwork": true,
  "workloadServices": {
    "ipv4AddressSpaces": [
      "10.0.28.0/22"
    ],
    "ipv6AddressSpaces": []
  }
}
```

## Delete Network Fabric Controller

You should delete an NFC only after deleting all associated network fabrics.

```azurecli
  az networkfabric controller delete --resource-group "NFCResourceGroupName" --resource-name "nfcname"
```

Expected output:

```json
"name": "nfcname",
    "networkFabricIds": [],
    "operationalState": null,
    "provisioningState": "succeeded",
    "resourceGroup": "NFCResourceGroupName",
    "systemData": {
      "createdAt": "2022-10-31T10:47:08.072025+00:00",
```

> [!NOTE]
> It takes 30 mins to delete the NFC. In the Azure portal, verify that the hosted resources have been deleted.

## Next steps

After you successfully create an NFC, the next step is to create a [cluster manager](./howto-cluster-manager.md).
