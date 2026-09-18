---
title: Create a User Managed Identity
titleSuffix: Azure Enclave
description: Create a User Managed Identity.
author: aserfass-msft
ms.author: aserfass
ms.topic: overview
ms.date: 9/30/2025
---

# Create a user-assigned managed identity
Create a user-assigned managed identity to grant least privileges to specific service for actions like encryption at rest.

## Create from the service catalog (quick)
1. Quickly deploy a `user` or `system` managed identity from the service catalog `Common Dependencies` template. You can also create a Key Vault from this template if you don't already have one.
1. [Assign Role to Managed Identity](#assign-role-to-managed-identity).

## Create from the portal
1. From the portal, type "Managed Identity" in the search bar at the top of the Portal.
1. Select `Managed Identities`.
1. Select `Create`.
1. Enter the workload resource group (RG) where you would like to store the Managed Identity resource.

  ![Screenshot that shows the Create User-assigned Managed Identity pane.](/entra/identity/managed-identities-azure-resources/media/how-manage-user-assigned-managed-identities/create-user-assigned-managed-identity-portal.png)

1. Confirm the Region and enter a name for the managed identity resource.
1. Select `Review + Create` and then select `Create`.
1. Finally, copy the Managed Identity name into the service catalog deployment parameter or temporarily paste into notepad for use during deployment.

## Assign role to Managed Identity
1. From the Portal, navigate to the Managed Identity you created.
1. Select the `Azure Role Assignments` on the left side.
1. Select `+Add Role Assignment`.
1. For `Scope` select `Key Vault`.
1. Confirm the subscription.
1. For `Resource` enter the name of your Key Vault. The [Common Dependencies](./deploy-common-dependencies-service-catalog.md) template is a good quickstart for creating a key vault. You can also use the [Key Vault](./deploy-key-vault-service-catalog.md) template for more customizations. 
1. The Key Vault should be using Role Base Access Control (RBAC), then select the `Key Vault Crypto Service Encryption User` role.

## References
- [How to create a user-assigned managed identity](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp)
- [Manage user-assigned identity](/azure/operator-service-manager/how-to-create-user-assigned-managed-identity)
