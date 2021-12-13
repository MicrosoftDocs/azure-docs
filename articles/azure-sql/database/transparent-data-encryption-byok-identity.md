---
title: Customer-managed Transparent Data Encryption using user-assigned managed identity
description: "Bring Your Own Key (BYOK) support for Transparent Data Encryption (TDE) using user-assigned managed identity (UMI)"
ms.service: sql-db-mi
ms.subservice: security
ms.topic: conceptual
author: shohamMSFT
ms.author: shohamd
ms.reviewer: vanto
ms.date: 12/15/2021
---

# Managed Identities for Transparent Data Encryption with BYOK
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]

> [!NOTE]
> Assigning a user-assigned managed identity for Azure SQL logical servers and Managed Instances is in **public preview**.

Managed identities in Azure Active Directory (Azure AD) provide Azure services with an automatically managed identity in Azure AD. This identity can be used to authenticate to any service that supports Azure AD authentication, such as [Azure Key Vault](/azure/key-vault/general/overview), without any credentials in the code. For more information, see [Managed identity types](/azure/active-directory/managed-identities-azure-resources/overview#managed-identity-types) in Azure. 

Managed Identities can be of two types:

- **System-assigned**
- **User-assigned**

Enabling system-assigned managed identity for Azure SQL logical servers and Managed Instances are already supported today. Assigning user-assigned managed identity to the server is now in public preview.

For [TDE with customer-managed key (CMK)](transparent-data-encryption-byok-overview.md) in Azure SQL, a managed identity on the server is used for providing access rights to the server on the key vault. For instance, the system-assigned managed identity of the server should be provided with [key vault permissions](transparent-data-encryption-byok-overview.md#how-customer-managed-tde-works) prior to enabling TDE with CMK on the server. 

In addition to the system-assigned managed identity that is already supported for TDE with CMK, a user-assigned managed identity (UMI) that is assigned to the server can be used to allow the server to access the key vault. A prerequisite to enable key vault access is to ensure the user-assigned managed identity has been provided the *Get*, *wrapKey* and *unwrapKey* permissions on the key vault. Since the user-assigned managed identity is a standalone resource that can be created and granted access to the key vault, [TDE with a customer-managed key can now be enabled at creation time for the server or database](transparent-data-encryption-byok-create-server.md). 

> [!NOTE]
> For assigning a user-assigned managed identity to the logical server or managed instance, a user must have the [SQL Server Contributor](/azure/role-based-access-control/built-in-roles#sql-server-contributor) or [SQL Managed Instance Contributor](/azure/role-based-access-control/built-in-roles#sql-managed-instance-contributor) Azure RBAC role along with any other Azure RBAC role containing the **Microsoft.ManagedIdentity/userAssignedIdentities/*/assign/action** action. 

## Benefits of using UMI for customer-managed TDE

- Enables the ability to pre-authorize key vault access for Azure SQL logical servers or managed instances by creating a user assigned managed identity, and granting it access to key vault, even before the server or database has been created

- Allows creation of an Azure SQL logical server with TDE and CMK enabled

- Enables the same user-assigned managed identity to be assigned to multiple servers, eliminating the need to individually turn on system-assigned managed identity for each Azure SQL logical server or managed instance, and providing it access to key vault

- Provides the capability to enforce CMK at server or database creation time via available built-in Azure policy

## Considerations while using UMI for customer-managed TDE

- By default, TDE in Azure SQL uses the primary user-assigned managed identity set on the server for key vault access. If no user-assigned identities have been assigned to the server, then the system-assigned managed identity of the server is used for key vault access.
- When using the system-assigned managed identity for TDE with CMK, no user-assigned managed identities should be assigned to the server 
- When using a user-assigned managed identity for TDE with CMK, assign the identity to the server and set it as the primary identity for the server
 
## Current limitations in preview

- If the key vault is behind a VNet, user-assigned managed identity cannot be used with customer-managed TDE. System-assigned managed identity must be used in this case. A user-assigned managed identity can only be used when the key vault is not behind a VNet. 


## Next steps

> [!div class="nextstepaction"]
> [Create Azure SQL database configured with user-assigned managed identity and customer-managed TDE](transparent-data-encryption-byok-create-server.md)

