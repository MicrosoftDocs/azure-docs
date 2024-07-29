---
title: Azure permissions for Mixed reality - Azure RBAC
description: Lists the permissions for the Azure resource providers in the Mixed reality category.
ms.service: role-based-access-control
ms.topic: reference
author: rolyon
manager: amycolannino
ms.author: rolyon
ms.date: 04/25/2024
ms.custom: generated
---

# Azure permissions for Mixed reality

This article lists the permissions for the Azure resource providers in the Mixed reality category. You can use these permissions in your own [Azure custom roles](/azure/role-based-access-control/custom-roles) to provide granular access control to resources in Azure. Permission strings have the following format: `{Company}.{ProviderName}/{resourceType}/{action}`


## Microsoft.MixedReality

Blend your physical and digital worlds to create immersive, collaborative experiences.

Azure service: [Azure Spatial Anchors](/azure/spatial-anchors/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.MixedReality/register/action | Registers a subscription for the Mixed Reality resource provider. |
> | Microsoft.MixedReality/unregister/action | Unregisters a subscription for the Mixed Reality resource provider. |
> | Microsoft.MixedReality/register/action | Register the subscription for Microsoft.MixedReality |
> | Microsoft.MixedReality/unregister/action | Unregister the subscription for Microsoft.MixedReality |
> | Microsoft.MixedReality/locations/checknameavailability/read | Checks for name availability |
> | Microsoft.MixedReality/ObjectAnchorsAccounts/delete | Delete an Object Anchors account |
> | Microsoft.MixedReality/ObjectAnchorsAccounts/listkeys/action | List the keys an Object Anchors account |
> | Microsoft.MixedReality/ObjectAnchorsAccounts/read | Read the properties an Object Anchors account |
> | Microsoft.MixedReality/ObjectAnchorsAccounts/regeneratekeys/action | Regenerate the keys of an Object Anchors account |
> | Microsoft.MixedReality/ObjectAnchorsAccounts/write | Update the properties an Object Anchors account |
> | Microsoft.MixedReality/ObjectUnderstandingAccounts/delete | Delete an Object Understanding account |
> | Microsoft.MixedReality/ObjectUnderstandingAccounts/listkeys/action | List the keys an Object Understanding account |
> | Microsoft.MixedReality/ObjectUnderstandingAccounts/read | Read the properties an Object Understanding account |
> | Microsoft.MixedReality/ObjectUnderstandingAccounts/regeneratekeys/action | Regenerate the keys of an Object Understanding account |
> | Microsoft.MixedReality/ObjectUnderstandingAccounts/write | Update the properties an Object Understanding account |
> | Microsoft.MixedReality/operations/read | List available operations for Microsoft Mixed Reality |
> | Microsoft.MixedReality/RemoteRenderingAccounts/delete | Delete a remote rendering account |
> | Microsoft.MixedReality/RemoteRenderingAccounts/listkeys/action | List keys of a remote rendering account |
> | Microsoft.MixedReality/RemoteRenderingAccounts/read | Read the properties of a remote rendering account |
> | Microsoft.MixedReality/RemoteRenderingAccounts/regeneratekeys/action | Regenerate the keys of a remote rendering account |
> | Microsoft.MixedReality/RemoteRenderingAccounts/write | Update the properties of a remote rendering account |
> | Microsoft.MixedReality/RemoteRenderingAccounts/keys/read | Read keys of a remote rendering account |
> | Microsoft.MixedReality/remoteRenderingAccounts/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for Microsoft.MixedReality/remoteRenderingAccounts |
> | Microsoft.MixedReality/SpatialAnchorsAccounts/listkeys/action | List keys of a Spatial Anchors account |
> | Microsoft.MixedReality/SpatialAnchorsAccounts/read | Read the properties of a Spatial Anchors account |
> | Microsoft.MixedReality/SpatialAnchorsAccounts/regeneratekeys/action | Regenerate the keys of a Spatial Anchors account |
> | Microsoft.MixedReality/SpatialAnchorsAccounts/keys/read | Read keys of a Spatial Anchors account |
> | Microsoft.MixedReality/spatialAnchorsAccounts/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for Microsoft.MixedReality/spatialAnchorsAccounts |
> | Microsoft.MixedReality/spatialAnchorsAccounts/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for Microsoft.MixedReality/spatialAnchorsAccounts |
> | Microsoft.MixedReality/spatialAnchorsAccounts/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for Microsoft.MixedReality/spatialAnchorsAccounts |
> | Microsoft.MixedReality/spatialMapsAccounts/read | List Spatial Anchors Accounts by Subscription |
> | Microsoft.MixedReality/spatialMapsAccounts/read | Returns list of spatialMapsAccounts. |
> | Microsoft.MixedReality/spatialMapsAccounts/read | Returns spatialMapsAccounts resource for a given name. |
> | Microsoft.MixedReality/spatialMapsAccounts/write | Create or update spatialMapsAccounts resource. |
> | Microsoft.MixedReality/spatialMapsAccounts/delete | Deletes a spatialMapsAccounts resource for a given name. |
> | Microsoft.MixedReality/spatialMapsAccounts/write | Update spatialMapsAccounts details. |
> | **DataAction** | **Description** |
> | Microsoft.MixedReality/ObjectAnchorsAccounts/ingest/action | Create model Ingestion Job |
> | Microsoft.MixedReality/ObjectAnchorsAccounts/ingest/read | Get model Ingestion Job Status |
> | Microsoft.MixedReality/ObjectUnderstandingAccounts/ingest/action | Create Model Ingestion Job |
> | Microsoft.MixedReality/ObjectUnderstandingAccounts/ingest/read | Get model Ingestion Job Status |
> | Microsoft.MixedReality/RemoteRenderingAccounts/convert/action | Start asset conversion |
> | Microsoft.MixedReality/RemoteRenderingAccounts/managesessions/action | Start sessions |
> | Microsoft.MixedReality/RemoteRenderingAccounts/convert/read | Get asset conversion properties |
> | Microsoft.MixedReality/RemoteRenderingAccounts/convert/delete | Stop asset conversion |
> | Microsoft.MixedReality/RemoteRenderingAccounts/diagnostic/read | Connect to the Remote Rendering inspector |
> | Microsoft.MixedReality/RemoteRenderingAccounts/managesessions/read | Get session properties |
> | Microsoft.MixedReality/RemoteRenderingAccounts/managesessions/delete | Stop sessions |
> | Microsoft.MixedReality/RemoteRenderingAccounts/render/read | Connect to a session |
> | Microsoft.MixedReality/SpatialAnchorsAccounts/create/action | Create spatial anchors |
> | Microsoft.MixedReality/SpatialAnchorsAccounts/delete | Delete spatial anchors |
> | Microsoft.MixedReality/SpatialAnchorsAccounts/write | Update spatial anchors properties |
> | Microsoft.MixedReality/SpatialAnchorsAccounts/discovery/read | Discover nearby spatial anchors |
> | Microsoft.MixedReality/SpatialAnchorsAccounts/maps/read | Get list of existing maps and allow localizing into a map. |
> | Microsoft.MixedReality/SpatialAnchorsAccounts/maps/write | Contribute mapping data to a map. |
> | Microsoft.MixedReality/SpatialAnchorsAccounts/maps/delete | Delete maps for Spatial Anchors |
> | Microsoft.MixedReality/SpatialAnchorsAccounts/properties/read | Get properties of spatial anchors |
> | Microsoft.MixedReality/SpatialAnchorsAccounts/query/read | Locate spatial anchors |
> | Microsoft.MixedReality/SpatialAnchorsAccounts/submitdiag/read | Submit diagnostics data to help improve the quality of the Azure Spatial Anchors service |
> | Microsoft.MixedReality/spatialMapsAccounts/read | Returns spatialMapsAccounts data for a given name. |
> | Microsoft.MixedReality/spatialMapsAccounts/write | Create or update spatialMapsAccounts data. |
> | Microsoft.MixedReality/spatialMapsAccounts/delete | Deletes a spatialMapsAccounts data for a given name. |

## Next steps

- [Azure resource providers and types](/azure/azure-resource-manager/management/resource-providers-and-types)