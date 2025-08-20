---
title: Support of Extension resource types in Azure Resource Mover
description: Supported Extension resource types in Azure Resource Mover.
author: jasminemehndir
ms.author: v-jasmineme
ms.date: 07/31/2025
ms.service: azure-resource-mover
ms.topic: concept-article
ms.update-cycle: 180-days
ms.custom: UpdateFrequency.5

# Customer intent: "As a cloud architect, I want to understand which extension resource types are supported during region migrations, so that I can plan and execute effective resource relocations without encountering unsupported configurations."
---

# Support for moving extension resource types between Azure regions

This article summarizes all the [Extension resource types](../azure-resource-manager/management/extension-resource-types.md)that are currently supported while moving Azure resources across regions using Azure resource mover.

## Extension resource types supported

Below table lists the extension resource types supported.

**Extension resource type** | **Support** |**Details**
--- | --- | --- |
Microsoft.Resources/tags | Supported | Source resource types tags can be moved as is or modified in the [destination configuration section](modify-target-settings.md) of Azure resource mover. Please [disable](../governance/policy/concepts/effects.md#disabled) any tag level policies on the destination region before starting the prepare process. 
Microsoft.Resources/links | Not Supported
Microsoft.ManagedIdentities/Identities |System-assigned managed identities are Not supported  
Microsoft.ManagedIdentities/Identities |User-assigned managed Identities assignment is Supported | The user-assigned managed identity of the source resource would be assigned on the destination resource. The movement of user assigned identity as a resource itself is Not Supported.


## Next steps

Try [modifying the supported extension resource type for a VM](modify-target-settings.md).
