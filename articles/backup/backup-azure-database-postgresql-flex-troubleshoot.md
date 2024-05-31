---
title: Troubleshoot Azure Database for PostgreSQL - Flexible server backup
description: Troubleshooting information for backing up Azure Database for PostgreSQL - Flexible server.
ms.topic: troubleshooting
ms.date: 03/26/2024
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Troubleshoot Azure Database for PostgreSQL - Flexible server backup (preview)

This article provides the recommended actions to troubleshoot the issues you might encounter during the backup or restore of Azure Database for PostgreSQL - Flexible server.

## Common errors for the backup and restore operations

### PostgreSQLFlexOperationFailedUserError 

**Error code**: PostgreSQLFlexOperationFailedUserError 

**Inner error code**: `ServerNotReadyForLongTermBackup`

**Cause**: Resource isn't in a valid state to perform the backup operation. 

**Recommended action**: Validate if the PostgreSQL - Flexible server has the following properties in its resource JSON script: `"state": "Ready"`. If not present, wait for the state to change or fix the PostgreSQL - Flexible server properties to make it ready for backup. 

### PostgreSQLFlexOperationFailedUserError 

**Error code**: PostgreSQLFlexOperationFailedUserError 

**Inner error code**: `ResourceGroupNotFound`

**Cause**: Resource group isn't found.

**Recommended action**: Stop protection for the backup instance to avoid failures. 

### PostgreSQLFlexOperationFailedUserError 

**Error code**: PostgreSQLFlexOperationFailedUserError 

**Inner error code**: `ResourceNotFound`

**Cause**: Resource isn't found.

**Recommended action**: Stop protection for the backup instance to avoid failures. 

### PostgreSQLFlexOperationFailedUserError 

**Error code**: PostgreSQLFlexOperationFailedUserError 

**Inner error code**: `AuthorizationFailed`

**Cause**: Required permissions aren't present to perform the backup operation. 

**Recommended action**: Assign the [appropriate permissions](backup-azure-database-postgresql-flex-overview.md#permissions-for-backup) and retrigger the backup operation. 

### UserErrorMaxConcurrentOperationLimitReached 

**Error code**: UserErrorMaxConcurrentOperationLimitReached 

**Inner error code**: `UserErrorMaxConcurrentOperationLimitReached`

**Cause**: Limit to the number of backups that can be performed on a backup instance has reached to maximum.

**Recommended action**: Try to trigger a backup operation once the current backup job is complete. 

### UserErrorMSIMissingPermissions 

**Error code**: UserErrorMSIMissingPermissions 

**Inner error code**: `UserErrorMSIMissingPermissions`

**Cause**: The required set of permissions aren't present to perform the restore operation.

**Recommended action**: Assign the [appropriate permissions](backup-azure-database-postgresql-flex-overview.md#permissions-for-backup) and retrigger the backup operation. 

## Next steps

- [About Azure Database for PostgreSQL - Flexible server backup (preview)](backup-azure-database-postgresql-flex-overview.md). 

 

 

 

  




