---
title: Regions
description: Lists the available regions for Azure Remote Rendering
author: FlorianBorn71
ms.author: flborn
ms.date: 02/11/2020
ms.topic: reference
ms.custom: references_regions
---

# Regions

This page lists the currently available regions for use with Azure Remote Rendering.

## Region table

| Name | Region | URL |
|-----------|:-----------|:-----------|
| Australia East | australiaeast | `https://remoterendering.australiaeast.mixedreality.azure.com` |
| East US | eastus | `https://remoterendering.eastus.mixedreality.azure.com` |
| East US 2 | eastus2 | `https://remoterendering.eastus2.mixedreality.azure.com` |
| Japan East | japaneast | `https://remoterendering.japaneast.mixedreality.azure.com` |
| North Europe | northeurope | `https://remoterendering.northeurope.mixedreality.azure.com` |
| South Central US | southcentralus | `https://remoterendering.southcentralus.mixedreality.azure.com` |
| Southeast Asia | southeastasia | `https://remoterendering.southeastasia.mixedreality.azure.com` |
| UK South | uksouth | `https://remoterendering.uksouth.mixedreality.azure.com` |
| West Europe | westeurope | `https://remoterendering.westeurope.mixedreality.azure.com` |
| West US 2 | westus2 | `https://remoterendering.westus2.mixedreality.azure.com` |

## Region connection best practice

For best results, a client application should always use the region that is closest to your physical location. The [network requirements](./network-requirements.md) chapter mentions strategies how to measure latencies for individual regions.
The session creation API doesn't implicitly fall back to a different region when creation fails. To make client applications resilient to potential outages in specific regions, it's recommended to add one or more fallback regions to the session creation logic. So if a session can't be allocated and the API returns with a timeout, the client could try the next closest region.

## Next steps

* [Network requirements](./network-requirements.md)