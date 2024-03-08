---
title: Troubleshoot Azure Database for PostgreSQL - Flexible server backup
description: Troubleshooting information for backing up Azure Database for PostgreSQL - Flexible server.
ms.topic: troubleshooting
ms.date: 03/11/2024
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Troubleshoot Azure Database for PostgreSQL - Flexible server backup (preview)

This article provides the recommended actions to troubleshoot the issues you might encounter during the backup or restore of Azure Database for PostgreSQL - Flexible server.




## Backup and Restore Errors 

ServerNotReadyForLongTermBackup 

Error Code: PostgreSQLFlexOperationFailedUserError 

Possible causes: Resource is not in a valid state to perform the backup operation. 

Recommended Action: Please validate that the PgFlex server has the following properties in its resource json:- "state": "Ready". If not the case, wait for the state to change or fix the PgFlex server properties to make it ready for backup. 

 

ResourceGroupNotFound 

Error Code: PostgreSQLFlexOperationFailedUserError 
Possible causes: Resource group not found. Might have been deleted by the user. 
Recommended Action: Stop Protection for the backup instance to avoid failures. 

ResourceNotFound 

Error Code: PostgreSQLFlexOperationFailedUserError 
Possible causes: Resource not found. Might have been deleted by the user. 
Recommended Action: Stop Protection for the backup instance to avoid failures. 

AuthorizationFailed 

Error Code: PostgreSQLFlexOperationFailedUserError 
Possible causes: Required permissions not present to perform the backup operation. 
Recommended Action: Please assign the appropriate permissions mentioned here and retrigger backup operation. 

UserErrorMaxConcurrentOperationLimitReached 

Error Code: UserErrorMaxConcurrentOperationLimitReached 

Possible causes: 
Recommended Action: Limit reached on the number of backups that can be performed on a backup instance. Try to trigger a backup once the current running backup job finishes. 

Restore Errors 

UserErrorMSIMissingPermissions 

Error Code: UserErrorMSIMissingPermissions 

Possible causes: Required set of permissions not present to perform the restore operation 

Recommended Action: Please assign the appropriate permissions mentioned here and retrigger backup operation. 

 

 

 

 

  




