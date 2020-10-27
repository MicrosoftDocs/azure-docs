---
title: Managed HSM local RBAC built-in roles - Azure Key Vault | Microsoft Docs
description: An overview of Managed HSM built-in roles that can be assigned to users, service principals, groups, and managed identities
services: key-vault
author: amitbapat

ms.service: key-vault
ms.subservice: managed-hsm
ms.topic: tutorial
ms.date: 09/15/2020
ms.author: ambapat

---
# Managed HSM local RBAC built-in roles

Managed HSM local RBAC has several built-in roles that you can assign to users, service principals, groups, and managed identities. To allow a principal to perform an operation you must assign them a role that grants them permission to perform that operations. All these roles and operations only allow you to manage permission for data plane operations. To manage control plane permissions for the Managed HSM resource (such as create a new managed HSM or update, move, delete an existing one), you must use [Azure role-based access control (RBAC)](../../role-based-access-control/overview.md).

## Built-in roles

|Role Name|Description|ID|
|---|---|---|
|Managed HSM Administrator| Grants full access to all data actions.|a290e904-7015-4bba-90c8-60543313cdb4|
|Managed HSM Crypto Officer| Grants full access to all key management and key cryptographic operations|515eb02d-2335-4d2d-92f2-b1cbdf9c3778|
|Managed HSM Crypto User|Grants access to create and use keys for cryptographic operations. Cannot permanently delete keys.|21dbd100-6940-42c2-9190-5d6cb909625b|
|Managed HSM Policy Administrator| Grants permission to create and delete role assignments|4bd23610-cdcf-4971-bdee-bdc562cc28e4|
|Managed HSM Crypto Auditor|Grants read permission to read (but not use) keys|2c18b078-7c48-4d3a-af88-5a3a1b3f82b3|
|Managed HSM Crypto Service Encryption| Grants permission to use a key for service encryption. |33413926-3206-4cdd-b39a-83574fe37a17|
|Managed HSM Backup| Grants permission to perform single key or whole HSM backup. |7b127d3c-77bd-4e3e-bbe0-dbb8971fa7f8|

## Permitted operations
> [!NOTE]  
> - An 'X' indicates that a role is allowed to perform the data action. Empty cell indicates the role does not have pemission to perform that data action.
> - All the data action names have a 'Microsoft.KeyVault/managedHsm' prefix, which is omitted in the tables below for brevity.
> - All role names have a prefix "Managed HSM" which is omitted in the below table for brevity.

|Data Action | Administrator | Crypto Officer | Crypto User | Policy Administrator | Crypto Service Encryption | Backup | Crypto Auditor|
|---|---|---|---|---|---|---|---|
|**Security Domain management**|
/securitydomain/download/action|<center>X</center>||||||
/securitydomain/upload/action|<center>X</center>||||||
/securitydomain/upload/read|<center>X</center>||||||
/securitydomain/transferkey/read|<center>X</center>||||||
|**Key management**|
|/keys/read/action|<center>X</center>|<center>X</center>|<center>X</center>||<center>X</center>||<center>X</center>|
|/keys/write/action|<center>X</center>|<center>X</center>|<center>X</center>||||
|/keys/create|<center>X</center>|<center>X</center>|<center>X</center>||||
|/keys/delete|<center>X</center>|<center>X</center>|||||
|/keys/deletedKeys/read/action|<center>X</center>|<center>X</center>|||||
|/keys/deletedKeys/recover/action|<center>X</center>|<center>X</center>|||||
|/keys/deletedKeys/delete|<center>X</center>|<center>X</center>|||||<center>X</center>|
|/keys/backup/action|<center>X</center>|<center>X</center>|<center>X</center>|||<center>X</center>|
|/keys/restore/action|<center>X</center>|<center>X</center>|||||
|/keys/export/action|<center>X</center>|<center>X</center>|||||
|/keys/import/action|<center>X</center>|<center>X</center>|||||
|**Key cryptographic operations**|
|/keys/encrypt/action|<center>X</center>|<center>X</center>|<center>X</center>||||
|/keys/decrypt/action|<center>X</center>|<center>X</center>|<center>X</center>||||
|/keys/wrap/action|<center>X</center>|<center>X</center>|<center>X</center>||<center>X</center>||
|/keys/unwrap/action|<center>X</center>|<center>X</center>|<center>X</center>||<center>X</center>||
|/keys/sign/action|<center>X</center>|<center>X</center>|<center>X</center>||||
|/keys/verify/action|<center>X</center>|<center>X</center>|<center>X</center>||||
|**Role management**|
|/roleAssignments/delete/action|<center>X</center>|||<center>X</center>|||
|/roleAssignments/read/action|<center>X</center>|||<center>X</center>|||
|/roleAssignments/write/action|<center>X</center>|||<center>X</center>|||
|/roleDefinitions/read/action|<center>X</center>|||<center>X</center>|||
|**Backup/Restore management**|
|/backup/start/action|<center>X</center>|||||<center>X</center>|
|/backup/status/action|<center>X</center>|||||<center>X</center>|
|/restore/start/action|<center>X</center>||||||
|/restore/status/action|<center>X</center>||||||
||||||||

## Next steps

- See an overview of [Azure role-based access control (RBAC)](../../role-based-access-control/overview.md).
- See a tutorial on [Managed HSM role management](role-management.md)
