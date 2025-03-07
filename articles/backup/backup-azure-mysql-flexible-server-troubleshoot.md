---
title: Troubleshoot Azure Database for MySQL - Flexible Server Backup by Using Azure Backup
description: Get troubleshooting information for backing up Azure Database for MySQL - Flexible Server.
ms.topic: troubleshooting
ms.date: 11/21/2024
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
---

# Troubleshoot Azure Database for MySQL - Flexible Server backup (preview)

[!INCLUDE [Azure Database for MySQL - Flexible Server backup advisory](../../includes/backup-mysql-flexible-server-advisory.md)]

This article provides recommended actions to troubleshoot issues that you might encounter during the backup or restore of Azure Database for MySQL - Flexible Server.

## Common errors for backup and restore operations

### MySQLFlexOperationFailedUserError

**Error code**: `MySQLFlexOperationFailedUserError`

**Inner error code**: `ResourceGroupNotFound`

**Recommended action**: Check if the resource group of the backed-up server is deleted. We recommend that you stop protection for the backup instance to avoid failures.

### MySQLFlexOperationFailedUserError

**Error code**: `MySQLFlexOperationFailedUserError`

**Inner error code**: `ResourceNotFound`

**Recommended action**: Check if the resource that you're backing up is deleted. We recommend that you stop protection for the backup instance to avoid failures.

### MySQLFlexOperationFailedUserError

**Error code**: `MySQLFlexOperationFailedUserError`

**Inner error code**: `AuthorizationFailed`

**Cause**: Required permissions aren't present to perform the backup operation.

**Recommended action**: Assign the [appropriate permissions](backup-azure-mysql-flexible-server-about.md#permissions-for-an-azure-database-for-mysql---flexible-server-backup).

### MySQLFlexClientError

**Error code**: `MySQLFlexClientError`

**Inner error code**: `BackupAlreadyRunningForServer`

**Cause**: A backup operation is already running on the server.

**Recommended action**: Wait for the previous operation to finish before you trigger the next backup operation.

### UserErrorMaxConcurrentOperationLimitReached

**Error code**: `UserErrorMaxConcurrentOperationLimitReached`

**Inner error code**: `UserErrorMaxConcurrentOperationLimitReached`

**Cause**: The count to perform backups on the server reached the limit.

**Recommended action**: Try to trigger a backup after the currently running backup job finishes.

### UserErrorMSIMissingPermissions

**Error code**: `UserErrorMSIMissingPermissions`

**Inner error code**: `UserErrorMSIMissingPermissions`

**Cause**: The required set of permissions isn't present to perform the restore operation.

**Recommended action**: Assign the [appropriate permissions](backup-azure-mysql-flexible-server-about.md#permissions-for-an-azure-database-for-mysql---flexible-server-backup) and retrigger the backup operation.

## Related content

- [Long-term retention for Azure Database for MySQL - Flexible Server by using Azure Backup (preview)](backup-azure-mysql-flexible-server-about.md)
