---
title: Get started with Azure Operator Service Manager Private Link
description: Secure backhaul connectivity of on-premise artifact store hosted on Azure Operator Nexus
author: msftadam
ms.author: adamdor
ms.date: 09/04/2024
ms.topic: get-started
ms.service: azure-operator-service-manager
---

# Get started with private link

## Overview
Document Version: 0.1 - Privatelink feature for edge artifact store

## Introduction
The purpose of this document is to provide a quick start guide to enable ATT ADO  development using AOSM Publisher APIs to enable private link feature for AOSM artifact store. The contents of this document will be updated into the azure public docs for AOSM service. We will notify ATT when the public documentation is ready for this feature. 

## Permissions for linking AOSM Artifact Store resource to NFC
In addition to the appropriate permissions on the AOSM resourcs, the role that is linking the AOSM artifact store to NFC should have the below permission. 

```
Microsoft.ManagedNetworkFabric/networkFabricControllers/write
```

> [!NOTE]
> A more fine-grained permission for NFC is in the works and will be rolled out in the next two weeks that replaces the privileged permission above

## AOSM APIs for setting up privatelink to artifact store
Below is the sequence of operations to be done for Private Link enablement when uploading artifacts.

### Create Publisher and AS with Public Access disabled. 
* The publisher resource must be created with identity type set to 'SystemAssigned'. If the publisher was created without this property, the publisher can be updated by performing a reput on the publisher. 
* To disable the public access on the ACR backed by the artifact store, the new property “backingResourcePublicNetworkAcccess” is used. The property is added in the 2024-04-15 version. 2024-04-15 API version is backwards compatible. Existing ArtifactResource can be used by doing a reput with the new property and API version.

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

### Manual endpoint operations 
The APIs below allow the user to upload the images to artifact store using a private link. In  the upload workflow, the vnet is managed by the customer. When the user creates the private endpoint to connect the ACR managed by Artifact Store to the vnet, the private endpoint will be in the pending state as the user doesn’t have permissions to the ACR. The APIs below expose a way by which the user can approve/reject and list these 
connections.

```
Sample JSON body:
{
 "manualPrivateEndPointConnections": [
 {
 "id":"/subscriptions/<subscriptionId>/resourceGroups/<ResourceGroup>/providers/Microsoft.Network/privateEndpoints/peName"
 }
 ]
 }
```

Sample command using az rest:

```
# approve private endpoints
az rest --method post --url https://management.azure.com/subscriptions/<Subscription>/resourceGroups/<ResourceGroup>/providers/Microsoft.HybridNetwork/publishers/<Publisher>/artifactStores/<ArtifactStore>/approveprivateendpoints?api-version=2024-04-15 --body '{ \"manualPrivateEndPointConnections\" : [ { \"id\" : \"/subscriptions/<Subscription>/resourceGroups/<ResourceGroup>/providers/Microsoft.Network/privateEndpoints/peName\" } ] }'

# remove private endpoints
az rest --method post --url https://management.azure.com/subscriptions/<Subscription>/resourceGroups/<ResourceGroup>/providers/Microsoft.HybridNetwork/publishers/<Publisher>/artifactStores/<ArtifactStore>/removeprivateendpoints?api-version=2024-04-15 --body '{ \"manualPrivateEndPointConnections\" : [ { \"id\" : \"/subscriptions/<Subscription>/resourceGroups/<ReourceGroup>/providers/Microsoft.Network/privateEndpoints/peName\" } ] }'

# list private endpoints
az rest --method post --url https://management.azure.com/subscriptions/<Subscription>resourceGroups/<ResourceGroup>/providers/Microsoft.HybridNetwork/publishers/<Publisher>/artifactStores/<artifactStore>/listPrivateEndPoints?api-version=2024-04-15 --body '{}'
```

### Add Private Link to NFC
The APIs below allow the user to create/remove/list the private endpoint to ACR to the appropriate Nexus managed vnets. Depending on the NC version (provided offline at the subscription scope), the API will perform the actions on the correct Nexus vnet.

```
# add nfc private endpoints
az rest --method post --url https://management.azure.com/subscriptions/<Subscription>/resourceGroups/<ResourceGroup>/providers/Microsoft.HybridNetwork/publishers/<Publisher>/artifactStores/<artifactStore>/addnetworkfabriccontrollerendpoints?apiversion=2024-04-15 --body '{ \"networkFabricControllerIds\":[{\"id\": \"/subscriptions/<Subscription>/resourceGroups/op2lab-nfc-useop1/providers/Microsoft.ManagedNetworkFabric/networkFabricControllers/op2labnfc01\"}] }'

# list nfc private endpoints
az rest --method post --url https://management.azure.com/subscriptions/<Subscription>/resourceGroups/<ResourceGroup>/providers/Microsoft.HybridNetwork/publishers/<Publisher>/artifactStores/<artifactStore>/listnetworkfabriccontrollerprivateendpoints?apiversion=2024-04-15 --body '{}'

# delete nfc private endpoints
az rest --method post --url https://management.azure.com/subscriptions/<Subscription>/resourceGroups/<ResourceGroup>/providers/Microsoft.HybridNetwork/publishers/<publisher>/artifactStores/<artifactStore>/deletenetworkfabriccontrollerendpoints?api-version=2024-04-15 --body '{ \"networkFabricControllerIds\":[{\"id\": \"/subscriptions/<Subscription>/resourceGroups/op2lab-nfc-useop1/providers/Microsoft.ManagedNetworkFabric/networkFabricControllers/op2labnfc01\"}] }'
```
