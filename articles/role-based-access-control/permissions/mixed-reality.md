---
title: Azure permissions for Mixed reality - Azure RBAC
description: Lists the permissions for the Azure resource providers in the Mixed reality category.
ms.service: role-based-access-control
ms.topic: reference
author: rolyon
manager: amycolannino
ms.author: rolyon
ms.date: 12/12/2024
ms.custom: generated
---

# Azure permissions for Mixed reality

This article lists the permissions for the Azure resource providers in the Mixed reality category. You can use these permissions in your own [Azure custom roles](/azure/role-based-access-control/custom-roles) to provide granular access control to resources in Azure. Permission strings have the following format: `{Company}.{ProviderName}/{resourceType}/{action}`


## Microsoft.MixedReality

Blend your physical and digital worlds to create immersive, collaborative experiences.


> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.MixedReality/register/action | Registers a subscription for the Mixed Reality resource provider. |
> | Microsoft.MixedReality/unregister/action | Unregisters a subscription for the Mixed Reality resource provider. |
> | Microsoft.MixedReality/register/action | Register the subscription for Microsoft.MixedReality |
> | Microsoft.MixedReality/unregister/action | Unregister the subscription for Microsoft.MixedReality |
> | Microsoft.MixedReality/locations/checknameavailability/read | Checks for name availability |
> | Microsoft.MixedReality/operations/read | List available operations for Microsoft Mixed Reality |
> | Microsoft.MixedReality/RemoteRenderingAccounts/delete | Delete a remote rendering account |
> | Microsoft.MixedReality/RemoteRenderingAccounts/listkeys/action | List keys of a remote rendering account |
> | Microsoft.MixedReality/RemoteRenderingAccounts/read | Read the properties of a remote rendering account |
> | Microsoft.MixedReality/RemoteRenderingAccounts/regeneratekeys/action | Regenerate the keys of a remote rendering account |
> | Microsoft.MixedReality/RemoteRenderingAccounts/write | Update the properties of a remote rendering account |
> | Microsoft.MixedReality/RemoteRenderingAccounts/keys/read | Read keys of a remote rendering account |
> | Microsoft.MixedReality/remoteRenderingAccounts/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for Microsoft.MixedReality/remoteRenderingAccounts |
> | **DataAction** | **Description** |
> | Microsoft.MixedReality/RemoteRenderingAccounts/convert/action | Start asset conversion |
> | Microsoft.MixedReality/RemoteRenderingAccounts/managesessions/action | Start sessions |
> | Microsoft.MixedReality/RemoteRenderingAccounts/convert/read | Get asset conversion properties |
> | Microsoft.MixedReality/RemoteRenderingAccounts/convert/delete | Stop asset conversion |
> | Microsoft.MixedReality/RemoteRenderingAccounts/diagnostic/read | Connect to the Remote Rendering inspector |
> | Microsoft.MixedReality/RemoteRenderingAccounts/managesessions/read | Get session properties |
> | Microsoft.MixedReality/RemoteRenderingAccounts/managesessions/delete | Stop sessions |
> | Microsoft.MixedReality/RemoteRenderingAccounts/render/read | Connect to a session |

## Next steps

- [Azure resource providers and types](/azure/azure-resource-manager/management/resource-providers-and-types)