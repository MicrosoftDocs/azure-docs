---
title: Azure permissions for Quantum - Azure RBAC
description: Lists the permissions for the Azure resource providers in the Quantum category.
ms.service: role-based-access-control
ms.topic: reference
author: bradben
manager: tedhudek
ms.author: brbenefield
ms.date: 01/07/2025
ms.custom: generated
---

# Azure permissions for Quantum

This article lists the permissions for the Azure resource providers in the Quantum category. You can use these permissions in your own [Azure custom roles](/azure/role-based-access-control/custom-roles) to provide granular access control to resources in Azure. Permission strings have the following format: `{Company}.{ProviderName}/{resourceType}/{action}`


## Microsoft.Quantum

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Quantum/locations/register/action | Registers the subscription for the quantum resource provider and enables the creation of quantum workspaces. |
> | Microsoft.Quantum/Workspaces/read | Read workspace properties. |
> | Microsoft.Quantum/Workspaces/write | Writes Workspace. |
> | Microsoft.Quantum/Workspaces/delete | Deletes Workspace. |
> | Microsoft.Quantum/Workspaces/regenerateKey/action | Regenerate workspace api key. |
> | Microsoft.Quantum/Workspaces/listKeys/action | List workspace api keys. |
> | Microsoft.Quantum/locations/offerings/read | Read providers supported. |
> | **DataAction** | **Description** |
> | Microsoft.Quantum/Workspaces/jobs/read | Read jobs and other data |
> | Microsoft.Quantum/Workspaces/jobs/write | Write jobs and other data |

## Next steps

- [Azure resource providers and types](/azure/azure-resource-manager/management/resource-providers-and-types)