---
title: Relocation guidance for managed identities for Azure resources
description: Learn how to relocate managed identities for Azure resources to a new region.
author: anaharris-ms
ms.author: barclayn
ms.date: 03/14/2024
ms.service: entra-id
ms.subservice: managed-identities
ms.topic: concept
ms.custom:
  - subject-relocation
#CustomerIntent: As a cloud architect/engineer, I want to learn how to relocate managed identities for Azure resources to another region.
---

# Relocate managed identities for Azure resources to another region

There are situations in which you'd want to move your existing user-assigned managed identities from one region to another. For example, you may need to move a solution that uses user-assigned managed identities to another region. You may also want to move an existing identity to another region as part of disaster recovery planning, and testing.

Moving user-assigned managed identities across Azure regions isn't supported.  You can however, recreate a user-assigned managed identity in the target region.

## Prerequisites

Managed identities for Azure resources is a feature of Azure Entra ID. Each of the Azure services that support managed identities for Azure resources is subject to its own timeline. 

- Make sure that you review the [availability status of managed identities for your resource](/entra/identity/managed-identities-azure-resources/managed-identities-status)
- Understand [known issues with managed identities for Azure resources](/entra/identity/managed-identities-azure-resources/known-issues).
- Create a dependency map with the Azure services that are used by the managed identity you wish to move. For the services that are in scope of a relocation, you must [select the appropriate relocation strategy](overview-relocation.md).

- Permissions to list permissions granted to existing user-assigned managed identity.
- Permissions to grant a new user-assigned managed identity the required permissions.
- Permissions to assign a new user-assigned identity to the Azure resources.
- Permissions to edit Group membership, if your user-assigned managed identity is a member of one or more groups.

## Prepare and move

1. Copy user-assigned managed identity assigned permissions. You can list [Azure role assignments](/azure/role-based-access-control/role-assignments-list-powershell) but that may not be enough depending on how permissions were granted to the user-assigned managed identity. You should confirm that your solution doesn't depend on permissions granted using a service specific option.
1. Create a [new user-assigned managed identity](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-powershell#create-a-user-assigned-managed-identity-2) at the target region.
1. Grant the managed identity the same permissions as the original identity that it's replacing, including Group membership. You can review [Assign Azure roles to a managed identity](/azure/role-based-access-control/role-assignments-portal-managed-identity), and [Group membership](/entra/fundamentals/groups-view-azure-portal).
1. Specify the new identity in the properties of the resource instance that uses the newly created user assigned managed identity.

## Verify

After reconfiguring your service to use your new managed identities in the target region, you must confirm that all operations have been restored.

## Clean up

Once that you confirm your service is back online, you can proceed to delete any resources in the source region that you no longer use.

## Next steps


- [Manage user-assigned managed identities](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-powershell#delete-a-user-assigned-managed-identity-2)