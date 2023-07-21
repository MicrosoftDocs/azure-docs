---
title: "Azure Operator Nexus: Configure a network fabric controller"
description: Learn commands to create and modify a network fabric controller in Azure Operator Nexus instances.
author: surajmb
ms.author: surmb
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 02/06/2023
ms.custom: template-how-to, devx-track-azurecli
---
# Create and modify a network fabric controller by using the Azure CLI

This article describes how to create a network fabric controller (NFC) for Azure Operator Nexus by using the Azure CLI. This article also shows you how to check the status of and delete an NFC.

## Prerequisites

* Validate Azure ExpressRoute circuits for correct connectivity (`CircuitId` and `AuthId`). NFC provisioning will fail if connectivity is incorrect.
* Make sure that names, such as for resources, don't contain the underscore (\_) character.

## Parameters for NFC creation

| Parameter | Description | Values | Example | Required     | Type   |
|---------|------------------------------|----------------------------|----------------------------|------------|------|
| `Resource-Group` | A resource group is a container that holds related resources for an Azure solution. | `NFCResourceGroupName` | `XYZNFCResourceGroupName` | True | String |
| `Location` | The Azure region is mandatory to provision your deployment. | `eastus`, `westus3` | `eastus` | True         | String |
| `Resource-Name` | The resource name is the name of the fabric. | `nfcname` | `XYZnfcname` | True         | String |
| `NFC IP Block` | This block is the NFC IP subnet. The default subnet block is 10.0.0.0/19, and it shouldn't overlap with any of the ExpressRoute IPs. | `10.0.0.0/19` | `10.0.0.0/19` | Not required | String |
| `Express Route Circuits` | The ExpressRoute circuit is a dedicated 10G link that connects Azure and on-premises. You need to know the ExpressRoute circuit ID and authentication key to successfully provision an NFC. There are two ExpressRoute circuits: one for the infrastructure services and one for workload (tenant) services. | `--workload-er-connections '[{"expressRouteCircuitId": "xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx", "expressRouteAuthorizationKey": "xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx"}]'` <br /><br /> `--infra-er-connections '[{"expressRouteCircuitId": "xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx", "expressRouteAuthorizationKey": "xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx"}]'` | `subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/ER-Dedicated-WUS2-AFO-Circuits/providers/Microsoft.Network/expressRouteCircuits/MSFT-ER-Dedicated-PvtPeering-WestUS2-AFO-Ckt-01", "expressRouteAuthorizationKey": "xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx"}]` | True         | String |

## Create a network fabric controller

You must create a resource group before you create your NFC. Create a separate resource group for each NFC.

You create a resource group by running the following command:

```azurecli
az group create -n NFCResourceGroupName -l "East US"
```

Here's an example of how you can create an NFC by using the Azure CLI:

```azurecli
az networkfabric controller create \
  --resource-group "NFCResourceGroupName" \
  --location "eastus"  \
  --resource-name "nfcname" \
  --ipv4-address-space "10.0.0.0/19" \
  --infra-er-connections '[{"expressRouteCircuitId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/ER-Dedicated-WUS2-AFO-Circuits/providers/Microsoft.Network/expressRouteCircuits/MSFT-ER-Dedicated-PvtPeering-WestUS2-AFO-Ckt-01", "expressRouteAuthorizationKey": "<auth-key>"}]'
  --workload-er-connections '[{"expressRouteCircuitId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/ER-Dedicated-WUS2-AFO-Circuits/providers/Microsoft.Network/expressRouteCircuits/MSFT-ER-Dedicated-PvtPeering-WestUS2-AFO-Ckt-01"", "expressRouteAuthorizationKey": "<auth-key>"}]'
```

Expected output:

```json
 "annotation": null,
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFCResourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkFabricControllers/nfcname",
  "infrastructureExpressRouteConnections": [
    {
      "expressRouteAuthorizationKey": null,
      "expressRouteCircuitId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/ER-Dedicated-WUS2-AFO-Circuits/providers/Microsoft.Network/expressRouteCircuits/MSFT-ER-Dedicated-PvtPeering-WestUS2-AFO-Ckt-01"
    }
  ],
  "infrastructureServices": null,
  "ipv4AddressSpace": "10.0.0.0/19",
  "ipv6AddressSpace": null,
  "location": "eastus",
  "managedResourceGroupConfiguration": {
    "location": "eastus2euap",
    "name": "nfcname-HostedResources-7DE8EEC1"
  },
  "name": "nfcname",
  "networkFabricIds": null,
  "operationalState": null,
  "provisioningState": "Accepted",
  "resourceGroup": "NFCresourcegroupname",
  "systemData": {
    "createdAt": "2022-10-31T10:47:08.072025+00:00",
    "createdBy": "email@address.com",
    "createdByType": "User",
    "lastModifiedAt": "2022-10-31T10:47:08.072025+00:00",
    "lastModifiedBy": "email@address.com",
```

NFC creation takes 30 to 45 minutes. Use the `show` command to monitor the progress. Provisioning states include `Accepted`, `Updating`, `Succeeded`, and `Failed`. Delete and re-create the NFC if the creation fails (`Failed`).

## Get a network fabric controller

```azurecli
  az networkfabric controller show --resource-group "NFCResourceGroupName" --resource-name "nfcname"
```

Expected output:

```json
{
  "annotation": null,
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/NFCResourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkFabricControllers/nfcname",
  "infrastructureExpressRouteConnections": [
    {
      "expressRouteAuthorizationKey": null,
      "expressRouteCircuitId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/ER-Dedicated-WUS2-AFO-Circuits/providers/Microsoft.Network/expressRouteCircuits/MSFT-ER-Dedicated-PvtPeering-WestUS2-AFO-Ckt-02"
    }
  ],
  "infrastructureServices": {
    "ipv4AddressSpaces": ["10.0.0.0/21"],
    "ipv6AddressSpaces": []
  },
  "ipv4AddressSpace": "10.0.0.0/19",
  "ipv6AddressSpace": null,
  "location": "eastus",
  "managedResourceGroupConfiguration": {
    "location": "eastus",
    "name": "nfcname-HostedResources-XXXXXXXX"
  },
  "name": "nfcname",
  "networkFabricIds": [],
  "operationalState": null,
  "provisioningState": "Succeeded",
  "resourceGroup": "NFCResourceGroupName",
  "systemData": {
    "createdAt": "2022-10-27T16:02:13.618823+00:00",
    "createdBy": "email@address.com",
    "createdByType": "User",
    "lastModifiedAt": "2022-10-27T17:13:18.278423+00:00",
    "lastModifiedBy": "d1bd24c7-b27f-477e-86dd-939e107873d7",
    "lastModifiedByType": "Application"
  },
  "tags": null,
  "type": "microsoft.managednetworkfabric/networkfabriccontrollers",
  "workloadExpressRouteConnections": [
    {
      "expressRouteAuthorizationKey": null,
      "expressRouteCircuitId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/ER-Dedicated-WUS2-AFO-Circuits/providers/Microsoft.Network/expressRouteCircuits/MSFT-ER-Dedicated-PvtPeering-WestUS2-AFO-Ckt-03"
    }
  ],
  "workloadManagementNetwork": true,
  "workloadServices": {
    "ipv4AddressSpaces": ["10.0.28.0/22"],
    "ipv6AddressSpaces": []
  }
}
```

## Delete a network fabric controller

You should delete an NFC only after deleting all associated network fabrics. Use this command to delete an NFC:

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

It takes 30 minutes for the deletion to finish. In the Azure portal, verify that the hosted resources are deleted.

## Next steps

After you successfully create an NFC, the next step is to create a [cluster manager](./howto-cluster-manager.md).
