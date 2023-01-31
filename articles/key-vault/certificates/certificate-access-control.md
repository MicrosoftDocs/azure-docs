---
title: About Azure Key Vault Certificates access control
description: Overview of Azure Key Vault certificates access control
services: key-vault
author: sebansal
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: certificates
ms.topic: overview
ms.date: 01/20/2023
ms.author: sebansal
---

# Certificate Access Control

 Access control for certificates is managed by Key Vault, and is provided by the Key Vault that contains those certificates. The access control policy for certificates is distinct from the access control policies for keys and secrets in the same Key Vault. Users may create one or more vaults to hold certificates, to maintain scenario appropriate segmentation and management of certificates.  

 The following permissions can be used, on a per-principal basis, in the secrets access control entry on a key vault, and closely mirrors the operations allowed on a secret object:  

- Permissions for certificate management operations
  - **get**: Get the current certificate version, or any version of a certificate
  - **list**: List the current certificates, or versions of a certificate  
  - **update**: Update a certificate
  - **create**: Create a Key Vault certificate
  - **import**: Import certificate material into a Key Vault certificate
  - **delete**: Delete a certificate, its policy, and all of its versions  
  - **recover**: Recover a deleted certificate
  - **backup**: Back up a certificate in a key vault
  - **restore**: Restore a backed-up certificate to a key vault
  - **managecontacts**: Manage Key Vault certificate contacts  
  - **manageissuers**: Manage Key Vault certificate authorities/issuers
  - **getissuers**: Get a certificate's authorities/issuers
  - **listissuers**: List a certificate's authorities/issuers  
  - **setissuers**: Create or update a Key Vault certificate's authorities/issuers  
  - **deleteissuers**: Delete a Key Vault certificate's authorities/issuers  
 
- Permissions for privileged operations
  - **purge**: Purge (permanently delete) a deleted certificate

For more information, see the [Certificate operations in the Key Vault REST API reference](/rest/api/keyvault). For information on establishing permissions, see [Vaults - Update Access Policy](/rest/api/keyvault/keyvault/vaults/update-access-policy).

## Troubleshoot
You may see error due to missing access policy. For example ```Error type : Access denied or user is unauthorized to create certificate```
To resolve this error, you would need to add certificates/create permission.

## Next steps

- [About Key Vault](../general/overview.md)
- [About keys, secrets, and certificates](../general/about-keys-secrets-certificates.md)
- [Authentication, requests, and responses](../general/authentication-requests-and-responses.md)
- [Key Vault Developer's Guide](../general/developers-guide.md)
