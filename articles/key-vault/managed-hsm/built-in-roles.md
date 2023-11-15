---
title: Local RBAC built-in roles for Azure Key Vault Managed HSM
description: Get an overview of Azure Key Vault Managed HSM built-in roles that can be assigned to users, service principals, groups, and managed identities.
services: key-vault
author: mbaldwin

ms.service: key-vault
ms.subservice: managed-hsm
ms.topic: reference
ms.date: 11/06/2023
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
|Managed HSM Backup| Grants permissions to perform single-key or whole-HSM backup.|7b127d3c-77bd-4e3e-bbe0-dbb8971fa7f8|

## Permitted operations

> [!NOTE]  
> - In the following table, an **X** indicates that a role is allowed to perform the data action. An empty cell indicates that the role does not have pemissions to perform that data action.
> - All the data action names have the prefix **Microsoft.KeyVault/managedHsm**, which is omitted in the table for brevity.
> - All role names have the prefix **Managed HSM**, which is omitted in the following table for brevity.

|Data action | Administrator | Crypto Officer | Crypto User | Policy Administrator | Crypto Service Encryption User | Backup | Crypto Auditor|
|---|---|---|---|---|---|---|---|
|**Security domain management**|
/securitydomain/download/action|<center>X</center>||||||
/securitydomain/upload/action|<center>X</center>||||||
/securitydomain/upload/read|<center>X</center>||||||
/securitydomain/transferkey/read|<center>X</center>||||||
|**Key management**|
|/keys/read/action|||<center>X</center>||<center>X</center>||<center>X</center>|
|/keys/write/action|||<center>X</center>||||
|/keys/rotate/action|||<center>X</center>||||
|/keys/create|||<center>X</center>||||
|/keys/delete|||<center>X</center>||||
|/keys/deletedKeys/read/action||<center>X</center>|||||
|/keys/deletedKeys/recover/action||<center>X</center>|||||
|/keys/deletedKeys/delete||<center>X</center>|||||<center>X</center>|
|/keys/backup/action|||<center>X</center>|||<center>X</center>|
|/keys/restore/action|||<center>X</center>||||
|/keys/release/action|||<center>X</center>||||
|/keys/import/action|||<center>X</center>||||
|**Key cryptographic operations**|
|/keys/encrypt/action|||<center>X</center>||||
|/keys/decrypt/action|||<center>X</center>||||
|/keys/wrap/action|||<center>X</center>||<center>X</center>||
|/keys/unwrap/action|||<center>X</center>||<center>X</center>||
|/keys/sign/action|||<center>X</center>||||
|/keys/verify/action|||<center>X</center>||||
|**Role management**|
|/roleAssignments/read/action|<center>X</center>|<center>X</center>|<center>X</center>|<center>X</center>|||<center>X</center>
|/roleAssignments/write/action|<center>X</center>|<center>X</center>||<center>X</center>|||
|/roleAssignments/delete/action|<center>X</center>|<center>X</center>||<center>X</center>|||
|/roleDefinitions/read/action|<center>X</center>|<center>X</center>|<center>X</center>|<center>X</center>|||<center>X</center>
|/roleDefinitions/write/action|<center>X</center>|<center>X</center>||<center>X</center>|||
|/roleDefinitions/delete/action|<center>X</center>|<center>X</center>||<center>X</center>|||
|**Backup and restore management**|
|/backup/start/action|<center>X</center>|||||<center>X</center>|
|/backup/status/action|<center>X</center>|||||<center>X</center>|
|/restore/start/action|<center>X</center>||||||
|/restore/status/action|<center>X</center>||||||
||||||||

## Next steps

- See an overview of [Azure RBAC](../../role-based-access-control/overview.md).
- See a tutorial on [Managed HSM role management](role-management.md).
