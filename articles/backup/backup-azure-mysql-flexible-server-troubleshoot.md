---
title: Troubleshoot Azure Database for MySQL - Flexible Server backup using Azure Backup
description: Troubleshooting information for backing up Azure Database for MySQL - Flexible server.
ms.topic: troubleshooting
ms.date: 03/29/2024
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Troubleshoot Azure Database for MySQL - Flexible Server backup (preview)

This article provides the recommended actions to troubleshoot the issues you might encounter during the backup or restore of Azure Database for MySQL - Flexible server.

## Common errors for the backup and restore operations


### MySQLFlexOperationFailedUserError

**Error code**: MySQLFlexOperationFailedUserError

**Inner error code**: ResourceGroupNotFound

**Recommended action**: Check if the resource group of the backed-up server is deleted. We recommend you to stop protection for the backup instance to avoid failures.

### MySQLFlexOperationFailedUserError

**Error code**: MySQLFlexOperationFailedUserError

**Inner error code**: ResourceNotFound

**Recommended action**: Check if the resource being backed up is deleted. We recommend you to stop protection for the backup instance to avoid failures.

### MySQLFlexOperationFailedUserError

**Error code**: MySQLFlexOperationFailedUserError

**Inner error code**: AuthorizationFailed

**Cause**: Required permissions aren't present to perform the backup operation.

**Recommended action**: Assign the [appropriate permissions](backup-azure-mysql-flexible-server-about.md#permissions-for-an-azure-database-for-mysql---flexible-server-backup).

### MySQLFlexClientError

**Error code**: MySQLFlexClientError

**Inner error code**: BackupAlreadyRunningForServer

**Cause**: A backup operation is already running on the server.

**Recommended action**: Wait for the previous operation to finish before triggering the next backup operation.

### UserErrorMaxConcurrentOperationLimitReached

**Error code**: UserErrorMaxConcurrentOperationLimitReached

**Inner error code**: UserErrorMaxConcurrentOperationLimitReached

**Cause**: The count to perform backups on the server reached the maximum limit.

**Recommended action**: Try to trigger a backup once the current running backup job finishes.

### UserErrorMSIMissingPermissions

**Error code**: UserErrorMSIMissingPermissions

**Inner error code**: UserErrorMSIMissingPermissions

**Cause**: The required set of permissions isn't present to perform the restore operation.

**Recommended action**: Assign the [appropriate permissions](backup-azure-mysql-flexible-server-about.md#permissions-for-an-azure-database-for-mysql---flexible-server-backup) and retrigger backup operation.

## Next steps

- [About long-term retention for Azure Database for MySQL - Flexible Server by using Azure Backup (preview)](backup-azure-mysql-flexible-server-about.md). 
