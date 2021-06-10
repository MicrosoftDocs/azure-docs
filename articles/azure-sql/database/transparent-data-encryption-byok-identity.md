---
title: Customer-managed transparent data encryption using user-assigned managed identity
description: "Bring Your Own Key (BYOK) support for transparent data encryption (TDE) using user-assigned managed identity (UMI)"
ms.service: sql-db-mi
ms.subservice: security
ms.topic: conceptual
author: shohamMSFT
ms.author: shohamd
ms.reviewer: vanto
ms.date: 06/30/2021
---

# Managed Identities for transparent data encryption with BYOK
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]

[Transparent data encryption (TDE)](/sql/relational-databases/security/encryption/transparent-data-encryption) 

Managed identities in Azure Active Directory (Azure AD) provides Azure services with an automatically managed identity in Azure AD. This identity can be used to authenticate to any service that supports Azure AD authentication, such as Azure Key Vault, without any credentials in the code. For more information, see [Managed identity types](/azure/active-directory/managed-identities-azure-resources/overview#managed-identity-types) in Azure. 

Managed Identities can be of two types:

- **System-assigned**
- **User-assigned**

Enabling system-assigned managed identity for Azure SQL logical servers and Managed Instances are already supported today. Assigning user-assigned managed identity to the server is also available now.

For TDE with Customer-Managed Key (CMK) in Azure SQL, a managed identity on the server is used for providing access rights to the server on the key vault. For instance, the system-assigned managed identity of the server should be provided key vault permissions prior to enabling TDE with CMK on the server. 

In addition to system-assigned managed identity that is already supported for TDE with CMK, a User-Assigned managed identity that is assigned to the server can be used to allow the server to access key vault. A prerequisite to enable key vault access here is to ensure the user-assigned managed identity has been provided Get, wrapKey and unwrapKey permissions on the key vault. Since user-assigned managed identity is a standalone resource that can be created and granted access to key vault, TDE with Customer Managed Key  can now be enabled at creation time for the server or database. 

> [!NOTE]
> For assigning a user-assigned managed identity to the server or managed instance, a user must have the SQL Server Contributor RBAC role along with any other RBAC role containing the "Microsoft.ManagedIdentity/userAssignedIdentities/*/assign/action" action. 

## Benefits of using user-assigned managed identities for customer-managed TDE 
- Enables the ability to pre-authorize key vault access for Azure SQL servers by creating a user assigned managed identity and granting it access to key vault even before server/database has been created 

- Allows creation of server with TDE with CMK enabled

- Enables the same user-assigned managed identity to be assigned to multiple servers, eliminating the need to individually turn on system assigned managed identity for each Azure SQL  server and providing it access to key vault

- Provides the capability to enforce CMK at server or database creation via available built-in Azure policy

## Considerations while using user-assigned managed identity for customer-managed TDE
- By default, TDE in Azure SQL uses the primary user-assigned managed identity set on the server for key vault access. If no user-assigned identities have been assigned to the server then the system-assigned managed identity of the server is used for key vault access.
- For using the system-assigned managed identity for TDE with CMK, no user-assigned managed identities should be assigned to the server 
- For using a user-assigned managed identity for TDE with CMK, assign the identity to the server and set it as the primary identity for the server
 

## Current limitations in preview
- If the key vault is behind a Vnet, user-assigned managed identity cannot be used with customer-managed TDE. System-assigned managed identity must be used in this case. User-assigned managed identity can only be used when the key vault is not behind a Vnet. 


## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Create Azure SQL database configured with user-assigned managed identity and customer-managed TDE](transparent-data-encryption-byok-create-server.md)

