---
title: Move managed identities to another region - Azure AD
description: Steps involved in getting a managed identity recreated in another region
services: active-directory
documentationcenter: 
author: barclayn
manager: karenhoran
editor: 

ms.service: active-directory
ms.subservice: msi
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 03/21/2022
ms.author: barclayn

---

# Move a user-assigned managed identity for Azure resources across regions

There are situations in which you'd want to move your existing user-assigned managed identities from one region to another. For example, You may need to move a solution that uses user-assigned managed identities to another region. You may also want to move an existing identity to another region as part of disaster recovery planning, and testing.

Moving User-assigned managed identities across Azure regions is not supported.  You can however, recreate a user-assigned managed identity in the target region.

## Prerequisites

- There are no pre-requisites

## Prepare and move

- Copy the relevant user-assigned managed identity information such as assigned permissions. You need this information so you can create replacement resources in the target region. You can list [Azure role assignments](../../role-based-access-control/role-assignments-list-powershell.md) but that may not be enough depending on how permissions were granted to the user-assigned managed identity. You should confirm that your solution doesn't depend on permissions granted using a service specific option
- Create a [new user-assigned managed identity](how-manage-user-assigned-managed-identities.md?pivots=identity-mi-methods-powershell#create-a-user-assigned-managed-identity-2) at the target region.
- Grant the managed identity the same permissions as the original identity that it's replacing. You can review [Assign Azure roles to a managed identity](../../role-based-access-control/role-assignments-portal-managed-identity.md)  
- Specify the new identity in the properties of the resource instance that uses the newly created user assigned managed identity.

## Verify

- After reconfiguring your service to use your new managed identities in the target region, you need to confirm that all operations have been restored.

## Clean up

Once that you confirm your service is back online, you can proceed to delete any resources in the source region that you no longer use.

## Next steps

In this tutorial, you took the steps needed to recreate a user-assigned managed identity in a new region.

- [Manage user-assigned managed identities](how-manage-user-assigned-managed-identities.md?pivots=identity-mi-methods-powershell#delete-a-user-assigned-managed-identity-2)
