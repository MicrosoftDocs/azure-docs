---
title: Get started with Azure Operator Service Manager Private Link
description: Secure backhaul connectivity of on-premises artifact store hosted on Azure Operator Nexus
author: msftadam
ms.author: adamdor
ms.date: 09/04/2024
ms.topic: get-started
ms.service: azure-operator-service-manager
---

# Get started with private link

## Overview
This guide describes the Azure Operator Service Manager (AOSM) private link (PL) feature for artifact stores hosted on Azure Operator Nexus. As part of the AOSM edge registry initiative, PL uses Azure private endpoints, and Azure private link service, to securely backhaul Nexus on-premises artifact store traffic. This traffic is never exposed to the internet, instead exclusively traversing Microsoft's private network.

## Introduction
This document provides a quick start guide to enable private link feature for AOSM artifact store using AOSM Publisher APIs. 

### Required permissions 
The operations required to link and manage a private endpoint with a Nexus fabric controller (NFC) requires the following nondefault role privileges. 

#### Permissions for linking and managing manual private endpoint
Remove private endpoint
```
"Microsoft.HybridNetwork/publishers/artifactStores/removePrivateEndPoints/action"
```
Approve private endpoint
```
"Microsoft.HybridNetwork/publishers/artifactStores/approvePrivateEndPoints/action"
```
#### Permissions for linking and managing a private endpoint with NFC
Add NFC private endpoints
```
"Microsoft.HybridNetwork/publishers/artifactStores/addNetworkFabricControllerEndPoints/action"
"Microsoft.ManagedNetworkFabric/networkFabricControllers/joinartifactstore/action"
```
List NFC private endpoints
```
"Microsoft.HybridNetwork/publishers/artifactStores/listNetworkFabricControllerPrivateEndPoints/action"
```
Delete NFC private endpoints
```
"Microsoft.HybridNetwork/publishers/artifactStores/deleteNetworkFabricControllerEndPoints/action"
"Microsoft.ManagedNetworkFabric/networkFabricControllers/disjoinartifactstore/action"
```

> [!NOTE]
> As new NFC permissions are introduced, the recommended role privileges will be updated.

## Use AOSM APIs to set up private link 
Before resources can be uploaded securely, the following sequence of operations establishes a PL connection to the artifact store.

### Create publisher and artifact store
* Create a new publisher resource with identity type set to 'SystemAssigned.'
  - If the publisher was already created without this property, use a reput operation to update.
* Use the new property 'backingResourcePublicNetworkAcccess' to disable artifact store public access.
  - The property is first added in the 2024-04-15 version.
  - If the ArtifactResource was already created without this property, use a reput operation to update.

#### Sample publisher bicep script

```
param location string = resourceGroup().location
param publisherName string
param acrArtifactStoreName string

/* AOSM publisher resource creation
*/
var publisherNameWithLocation = concat(publisherName, uniqueString(resourceGroup().id))
resource publisher 'Microsoft.HybridNetwork/publishers@2023-09-01' = {
 name: publisherNameWithLocation
 location: location
identity: {
 type: 'SystemAssigned' 
 }
 properties: {
 scope: 'Private'
 }
}

/* AOSM artifact store resource creation
*/
resource acrArtifactStore 'Microsoft.HybridNetwork/publishers/artifactStores@2024-04-15' = {
 parent: publisher
 name: acrArtifactStoreName
 location: location
 properties: {
 storeType: 'AzureContainerRegistry'
 backingResourcePublicNetworkAccess: 'Disabled'
 }
 
}
```

## Manual endpoint operations 
The following operations enable manual management of an artifact store once the PL is established. 

### Manage private endpoint access
By default, when the artifact store is connected to the vnet, the user doesn't have permissions to the ACR, so the private endpoint winds up in a pending state. The following Azure rest commands and payload enable a user to approve, reject and/or list these endpoints.

> [!NOTE]
> In this workflow, the vnet is managed by the customer.
> 

#### Sample JSON payload:
```
{
 "manualPrivateEndPointConnections": [
 {
 "id":"/subscriptions/<subscriptionId>/resourceGroups/<ResourceGroup>/providers/Microsoft.Network/privateEndpoints/peName"
 }
 ]
 }
```

#### Sample private endpoint commands
```
# approve private endpoints
az rest --method post --url https://management.azure.com/subscriptions/<Subscription>/resourceGroups/<ResourceGroup>/providers/Microsoft.HybridNetwork/publishers/<Publisher>/artifactStores/<ArtifactStore>/approveprivateendpoints?api-version=2024-04-15 --body '{ \"manualPrivateEndPointConnections\" : [ { \"id\" : \"/subscriptions/<Subscription>/resourceGroups/<ResourceGroup>/providers/Microsoft.Network/privateEndpoints/peName\" } ] }'
```
```
# remove private endpoints
az rest --method post --url https://management.azure.com/subscriptions/<Subscription>/resourceGroups/<ResourceGroup>/providers/Microsoft.HybridNetwork/publishers/<Publisher>/artifactStores/<ArtifactStore>/removeprivateendpoints?api-version=2024-04-15 --body '{ \"manualPrivateEndPointConnections\" : [ { \"id\" : \"/subscriptions/<Subscription>/resourceGroups/<ReourceGroup>/providers/Microsoft.Network/privateEndpoints/peName\" } ] }'
```
```
# list private endpoints
az rest --method post --url https://management.azure.com/subscriptions/<Subscription>resourceGroups/<ResourceGroup>/providers/Microsoft.HybridNetwork/publishers/<Publisher>/artifactStores/<artifactStore>/listPrivateEndPoints?api-version=2024-04-15 --body '{}'
```

### Add private endpoints to NFC
The following Azure rest commands enable a user to create, remove, and/or list the association between private endpoint, ACR, and the Nexus managed vnets.

#### Sample private endpoint commands
```
# add nfc private endpoints
az rest --method post --url https://management.azure.com/subscriptions/<Subscription>/resourceGroups/<ResourceGroup>/providers/Microsoft.HybridNetwork/publishers/<Publisher>/artifactStores/<artifactStore>/addnetworkfabriccontrollerendpoints?apiversion=2024-04-15 --body '{ \"networkFabricControllerIds\":[{\"id\": \"/subscriptions/<Subscription>/resourceGroups/op2lab-nfc-useop1/providers/Microsoft.ManagedNetworkFabric/networkFabricControllers/op2labnfc01\"}] }'
```
```
# list nfc private endpoints
az rest --method post --url https://management.azure.com/subscriptions/<Subscription>/resourceGroups/<ResourceGroup>/providers/Microsoft.HybridNetwork/publishers/<Publisher>/artifactStores/<artifactStore>/listnetworkfabriccontrollerprivateendpoints?apiversion=2024-04-15 --body '{}'
```
```
# delete nfc private endpoints
az rest --method post --url https://management.azure.com/subscriptions/<Subscription>/resourceGroups/<ResourceGroup>/providers/Microsoft.HybridNetwork/publishers/<publisher>/artifactStores/<artifactStore>/deletenetworkfabriccontrollerendpoints?api-version=2024-04-15 --body '{ \"networkFabricControllerIds\":[{\"id\": \"/subscriptions/<Subscription>/resourceGroups/op2lab-nfc-useop1/providers/Microsoft.ManagedNetworkFabric/networkFabricControllers/op2labnfc01\"}] }'
```
