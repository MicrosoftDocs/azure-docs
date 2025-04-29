---
title: Create a User Managed Identity
titleSuffix: Azure Virtual Enclaves
description: Create a User Managed Identity.
author: aserfass-msft
ms.author: aserfass
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 04/08/2025
---

# Create a user-assigned managed identity
Create a User-assigned Managed Identity to grant least privledges to specific service for actions like encryption at rest.

## Create from the Service Catalog (quick)
1. Quickly deploy a `user` or `system` managed identity from the service catalog `Common Dependencies` template. You can also create a Key Vault from this template if you don't already have one.
2. [Assign Role to Managed Identity](#assign-role-to-managed-identity).

## Create from the portal
1. From the portal, type "Managed Identity" in the search bar at the top of the Portal.
2. Select `Managed Identities`.
3. Select `Create`.
4. Enter the Workload Resource Group (RG) or RG where you would like to store the Managed Identity resource.

  ![Screenshot that shows the Create User-assigned Managed Identity pane.](/entra/identity/managed-identities-azure-resources/media/how-manage-user-assigned-managed-identities/create-user-assigned-managed-identity-portal.png)

5. Confirm the Region and enter a name for the Managed Identity resource.
6. Select `Review + Create` and then select `Create`.
7. Finally, copy the Managed Identity name into the Service Catalog deployment parameter or temporarily paste into notepad for use during deployment.

## Assign role to Managed Identity
1. From the Portal, navigate to the Managed Identity you created.
2. Select the `Azure Role Assignments` on the left side.
3. Select `+Add Role Assignment`.
4. For `Scope` select `Key Vault`.
5. Confirm the subscription.
6. For `Resource` enter the name of your Key Vault. The enclave key vault is a good default KV to use and is located in the RG hosting the enclave resources which contain `...HostedResources...` in the RG name.
7. The Key Vault should be using Role Base Access Control (RBAC), then select the `Key Vault Crypto Service Encryption User` role.

## References
- [How to create a user assigned managed identity](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp)
- [Manage User-assigned Identity](../operator-service-manager/how-to-create-user-assigned-managed-identity.md)
