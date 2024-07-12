---
title: Local RBAC built-in roles for Azure Key Vault Managed HSM
description: Get an overview of Azure Key Vault Managed HSM built-in roles that can be assigned to users, service principals, groups, and managed identities.
services: key-vault
author: mbaldwin

ms.service: key-vault
ms.subservice: managed-hsm
ms.topic: reference
ms.date: 01/25/2024
ms.author: mbaldwin

---
# Local RBAC built-in roles for Managed HSM

Azure Key Vault Managed HSM local role-based access control (RBAC) has several built-in roles. You can assign these roles to users, service principals, groups, and managed identities.

To allow a principal to perform an operation, you must assign them a role that grants them permissions to perform that operations. All these roles and operations allow you to manage permissions only for *data plane* operations. For *management plane* operations, see [Azure built-in roles](../../role-based-access-control/built-in-roles.md) and [Secure access to your managed HSMs](secure-your-managed-hsm.md).

To manage control plane permissions for the Managed HSM resource, you must use [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md). Some examples of control plane operations are to create a new managed HSM, or to update, move, or delete a managed HSM.

## Built-in roles

|Role name|Description|ID|
|---|---|---|
|Managed HSM Administrator| Grants permissions to perform all operations related to the security domain, full backup and restore, and role management. Not permitted to perform any key management operations.|a290e904-7015-4bba-90c8-60543313cdb4|
|Managed HSM Crypto Officer|Grants permissions to perform all role management, purge or recover deleted keys, and export keys. Not permitted to perform any other key management operations.|515eb02d-2335-4d2d-92f2-b1cbdf9c3778|
|Managed HSM Crypto User|Grants permissions to perform all key management operations except purge or recover deleted keys and export keys.|21dbd100-6940-42c2-9190-5d6cb909625b|
|Managed HSM Policy Administrator| Grants permissions to create and delete role assignments.|4bd23610-cdcf-4971-bdee-bdc562cc28e4|
|Managed HSM Crypto Auditor|Grants read permissions to read (but not use) key attributes.|2c18b078-7c48-4d3a-af88-5a3a1b3f82b3|
|Managed HSM Crypto Service Encryption User| Grants permissions to use a key for service encryption. |33413926-3206-4cdd-b39a-83574fe37a17|
|Managed HSM Crypto Service Release User| Grants permissions to release a key to a trusted execution environment. |21dbd100-6940-42c2-9190-5d6cb909625c|
|Managed HSM Backup| Grants permissions to perform single-key or whole-HSM backup.|7b127d3c-77bd-4e3e-bbe0-dbb8971fa7f8|
|Managed HSM Restore| Grants permissions to perform single-key or whole-HSM restore. |6efe6056-5259-49d2-8b3d-d3d73544b20b|

## Permitted operations

> [!NOTE]  
> - In the following table, an **X** indicates that a role is allowed to perform the data action. An empty cell indicates that the role does not have pemissions to perform that data action.
> - All the data action names have the prefix **Microsoft.KeyVault/managedHsm**, which is omitted in the table for brevity.
> - All role names have the prefix **Managed HSM**, which is omitted in the following table for brevity.

|Data action | Administrator | Crypto Officer | Crypto User | Policy Administrator | Crypto Service Encryption User | Backup | Crypto Auditor | Crypto Service Release User | Restore|
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
|**Security domain management**||||||||||
|/securitydomain/download/action|X|||||||||
|/securitydomain/upload/action|X|||||||||
|/securitydomain/upload/read|X|||||||||
|/securitydomain/transferkey/read|X|||||||||
|**Key management**||||||||||
|/keys/read/action|||X||X||X|||
|/keys/write/action|||X|||||||
|/keys/rotate/action|||X|||||||
|/keys/create|||X|||||||
|/keys/delete|||X|||||||
|/keys/deletedKeys/read/action||X||||||||
|/keys/deletedKeys/recover/action||X||||||||
|/keys/deletedKeys/delete||X|||||X|||
|/keys/backup/action|||X|||X||||
|/keys/restore/action|||X||||||X|
|/keys/release/action|||X|||||X||
|/keys/import/action|||X|||||||
|**Key cryptographic operations**||||||||||
|/keys/encrypt/action|||X|||||||
|/keys/decrypt/action|||X|||||||
|/keys/wrap/action|||X||X|||||
|/keys/unwrap/action|||X||X|||||
|/keys/sign/action|||X|||||||
|/keys/verify/action|||X|||||||
|**Role management**||||||||||
|/roleAssignments/read/action|X|X|X|X|||X|||
|/roleAssignments/write/action|X|X||X||||||
|/roleAssignments/delete/action|X|X||X||||||
|/roleDefinitions/read/action|X|X|X|X|||X|||
|/roleDefinitions/write/action|X|X||X||||||
|/roleDefinitions/delete/action|X|X||X||||||
|**Backup and restore management**||||||||||
|/backup/start/action|X|||||X||||
|/backup/status/action|X|||||X||||
|/restore/start/action|X||||||||X|
|/restore/status/action|X||||||||X|

## Next steps

- See an overview of [Azure RBAC](../../role-based-access-control/overview.md).
- See a tutorial on [Managed HSM role management](role-management.md).
