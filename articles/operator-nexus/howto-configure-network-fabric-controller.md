---
title: "Azure Operator Nexus : How to configure Network Fabric Controller"
description: How to configure Network Fabric Controller
author: surajmb #Required
ms.author: surmb #Required
ms.service: azure  #Required
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 02/06/2023 #Required; mm/dd/yyyy format.
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---
# Create and modify a Network Fabric Controller using Azure CLI

This article describes how to create a Network Fabric Controller by using the Azure Command Line Interface (AzureCLI).
This document also shows you how to check the status, or delete a Network Fabric Controller.

## Prerequisites

- The User must make sure all the Pre-Requisites are met prior moving on to the next steps
- Before the User starts with NFC deployment, the ExpressRoute circuit has to be validated with the right connectivity (CircuitID)(AuthID), otherwise the NFC provisioning would fail.

### Install CLI extensions

Install latest version of the
[necessary CLI extensions](./howto-install-cli-extensions.md).

### Sign in to your Azure account and select your subscription

To begin your configuration, sign in to your Azure account. You can use the following examples to connect:

```azurecli
az login
```

Check the subscriptions for the account.

```azurecli
az account list
```

Select the subscription for which you want to create a Network Fabric Controller. This subscription will be used across all Operator Nexus resources.

```azurecli
az account set --subscription "<subscription ID>"
```

## Register providers for Managed Network Fabric

You can skip this step if your subscription is already registered with the Microsoft.ManagedNetworkFabric Resource Provider. Otherwise, proceed with the following steps:

In Azure CLI, enter the following commands:

```azurecli
az provider register --namespace Microsoft.ManagedNetworkFabric
```

Monitor the registration process. Registration may take up to 10 minutes.

```azurecli
az provider show -n Microsoft.ManagedNetworkFabric -o table
```

Once registered, you should see the RegistrationState state for the namespace change to Registered.

If you've already registered, you can verify using the `show` command.

## Create a Network Fabric Controller

If you don't have a resource group created already, you must create a resource group before you create your Network Fabric Controller.

> [!NOTE]
> You should create a separate Resource Group for Network Fabric Controller (NFC) and a separate one for Network fabric (NF). The value (\_) underscore is not supported for any of the naming conventions, for example (Resource Name or Resource Group.

You can create a resource group by running the following command:

```azurecli
az group create -n NFCResourceGroupName -l "East US"
```

```azurecli
az group create -n NFResourceGroupName -l "East US"
```

## Attributes for NFC creation

| Parameter              | Description                                                                                                                                                                                                                                                                                             | values                                                                                                                                                                                                                                                                                                                            | Example                                                                                                                                                                                                                                                          | Required     | Type   |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ------ |
| Resource-Group         | A resource group is a container that holds related resources for an Azure solution.                                                                                                                                                                                                                     | NFCResourceGroupName                                                                                                                                                                                                                                                                                                              | ATTNFCResourceGroupName                                                                                                                                                                                                                                          | True         | String |
| Location               | The Azure Region is mandatory to provision your deployment.                                                                                                                                                                                                                                             | eastus, westus3                                                                                                                                                                                                                                                                                                                    | eastus                                                                                                                                                                                                                                                           | True         | String |
| Resource-Name          | The Resource-name will be the name of the Fabric                                                                                                                                                                                                                                                        | nfcname                                                                                                                                                                                                                                                                                                                           | ATTnfcname                                                                                                                                                                                                                                                       | True         | String |
| NFC IP Block           | This Block is the NFC IP subnet, the default subnet block is 10.0.0.0/19, and it also shouldn't overlap with any of the Express Route Circuits.                                                                                                                                                         | 10.0.0.0/19                                                                                                                                                                                                                                                                                                                       | 10.0.0.0/19                                                                                                                                                                                                                                                      | Not Required | String |
| Express Route Circuits | The ExpressRoute circuit is a dedicated 10G link that connects Azure and on-premises. You need to know the ExpressRoute Circuit ID and Auth key for an NFC to successfully provision. There are two Express Route Circuits, one for the Infrastructure services and other one for Workload (Tenant) services | --workload-er-connections '[{"expressRouteCircuitId": "xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx", "expressRouteAuthorizationKey": "xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx"}]' <br /><br /> --infra-er-connections '[{"expressRouteCircuitId": "xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx", "expressRouteAuthorizationKey": "xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx"}]' | subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/ER-Dedicated-WUS2-AFO-Circuits/providers/Microsoft.Network/expressRouteCircuits/MSFT-ER-Dedicated-PvtPeering-WestUS2-AFO-Ckt-01", "expressRouteAuthorizationKey": "xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx"}] | True         | string |

Here is an example of how you can create a Network Fabric Controller using the Azure CLI.
For more information, see [attributes section](#attributes-for-nfc-creation).

```azurecli

az nf controller create \
--resource-group "NFCResourceGroupName" \
--location "eastus"  \
--resource-name "nfcname" \
--ipv4-address-space "10.0.0.0/19" \
--infra-er-connections '[{"expressRouteCircuitId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/ER-Dedicated-WUS2-AFO-Circuits/providers/Microsoft.Network/expressRouteCircuits/MSFT-ER-Dedicated-PvtPeering-WestUS2-AFO-Ckt-01", "expressRouteAuthorizationKey": "<auth-key>"}]'
--workload-er-connections '[{"expressRouteCircuitId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/ER-Dedicated-WUS2-AFO-Circuits/providers/Microsoft.Network/expressRouteCircuits/MSFT-ER-Dedicated-PvtPeering-WestUS2-AFO-Ckt-01"", "expressRouteAuthorizationKey": "<auth-key>"}]'
```

> [!NOTE]
> The NFC creation takes between 30-45 mins. Start using the show commands to monitor the progress of the NFC creation. You'll start to see different provisioning states while monitoring the progress of NFC creation such as, Accepted, updating and Succeeded/Failed.

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

## Get Network Fabric Controller

```azurecli
nfacliuser:~$ az nf controller show --resource-group "NFCResourceGroupName" --resource-name "nfcname"
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

## Delete Network Fabric Controller

```azurecli
az nf controller delete --resource-group "NFCResourceGroupName" --resource-name "nfcname"
```

> [!NOTE]
> If NF is created, then make sure the NF is deleted first before you delete the NFC.

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
> It will take 30 mins to delete the NFC. Verify the hosted resources in Azure portal whether or not it's deleted. Delete and recreate NFC if you run into NFC provisioning issue (Failed).

### Next steps

Once you've successfully created a Network Fabric Controller, the next step is to create a [Cluster Manager](./howto-cluster-manager.md).
