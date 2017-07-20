---
title: Log Analytics data model for Azure Backup
description: This article talks about Log Analytics data model details for Azure Backup data.
services: backup
documentationcenter: ''
author: JPallavi
manager: vijayts
editor: ''

ms.assetid: dfd5c73d-0d34-4d48-959e-1936986f9fc0
ms.service: backup
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 07/20/2017
ms.author: pajosh
ms.custom: H1Hack27Feb2017

---
# Log Analytics data model for Azure Backup data
This article describes the data model used for pushing reporting data to Log Analytics. Using this data model, you can create custom queries, dashboards and utilize it in OMS. 

## Using Azure Backup data model
You can use the following fields provided as part of the data model to create visuals, custom queries and dashboard as per your requirements.

### Alert
This table provides details about alert related fields.

| Field | Data Type | Description |
| --- | --- | --- |
| AlertUniqueId_s |Text |Unique Id of the generated alert |
| AlertType_s |Text |Type of the generated alert for example, Backup |
| AlertStatus_s |Text |Status of the alert for example, Active |
| AlertOccurenceDateTime_s |Date/Time |Date and time when alert was created |
| AlertSeverity_s |Text |Severity of the alert for example, Critical |
| EventName_s |Text |This is the name of this event, it is always AzureBackupCentralReport |
| BackupItemUniqueId_s |Text |Unique Id of the backup item to which this alert belongs to |
| SchemaVersion_s |Text |This denotes current version of the schema, it is V1 |
| State_s |Text |Current state of the alert object for example, Active, Deleted |
| BackupManagementType_s |Text |Provider type for performing backup for example, IaaSVM, FileFolder to which this alert belongs to |
| OperationName |Text |This is the name of the current operation - Alert |
| Category |Text |This is the category of diagnostics data pushed to Log Analytics, it is AzureBackupReport |
| Resource |Text |This is the resource for which data is being collected, it shows Recovery Services vault name |
| ProtectedServerUniqueId_s |Text |Unique Id of the protected to which this alert belongs to |
| VaultUniqueId_s |Text |Unique Id of the protected to which this alert belongs to |
| SourceSystem |Text |Source system of the current data - Azure |
| ResourceId |Text |This is the resource id for which data is being collected, it shows Recovery Services vault resource id |
| SubscriptionId |Text |This is the subscription id of the resource (RS vault) for which data is being collected |
| ResourceGroup |Text |This is the resource group of the resource (RS vault) for which data is being collected |
| ResourceProvider |Text |This denotes the resource provider for which data is being collected - Microsoft.RecoveryServices |
| ResourceType |Text |This is the type of the resource for which data is being collected - Vaults |

### BackupItem
This table provides details about backup item related fields.

| Field | Data Type | Description |
| --- | --- | --- |
| EventName_s |Text |This is the name of this event, it is always AzureBackupCentralReport |  
| BackupItemUniqueId_s |Text |Unique Id of the backup item |
| BackupItemId_s |Text |Id of backup item |
| BackupItemName_s |Text |Name of backup item |
| BackupItemFriendlyName_s |Text |Friendly name of backup item |
| BackupItemType_s |Text |Type of backup item for example, VM, FileFolder |
| ProtectedServerName_s |Text |Name of protected server to which backup item belongs to |
| ProtectionState_s |Text |Current protection state of the backup item for example, Protected, ProtectionStopped |
| SchemaVersion_s |Text |This denotes current version of the schema, it is V1 |
| State_s |Text |Current state of the backup item object for example, Active, Deleted |
| BackupManagementType_s |Text |Provider type for performing backup for example, IaaSVM, FileFolder to which this backup item belongs to |
| OperationName |Text |This is the name of the current operation - BackupItem |
| Category |Text |This is the category of diagnostics data pushed to Log Analytics, it is AzureBackupReport |
| Resource |Text |This is the resource for which data is being collected, it shows Recovery Services vault name |
| SourceSystem |Text |Source system of the current data - Azure |
| ResourceId |Text |This is the resource id for which data is being collected, it shows Recovery Services vault resource id |
| SubscriptionId |Text |This is the subscription id of the resource (RS vault) for which data is being collected |
| ResourceGroup |Text |This is the resource group of the resource (RS vault) for which data is being collected |
| ResourceProvider |Text |This denotes the resource provider for which data is being collected - Microsoft.RecoveryServices |
| ResourceType |Text |This is the type of the resource for which data is being collected - Vaults |

### BackupItemAssociation
This table provides details about backup item associations with various entities.

| Field | Data Type | Description |
| --- | --- | --- |
| EventName_s |Text |This is the name of this event, it is always AzureBackupCentralReport |  
| BackupItemUniqueId_s |Text |Unique Id of the backup item |
| SchemaVersion_s |Text |This denotes current version of the schema, it is V1 |
| State_s |Text |Current state of the backup item object for example, Active, Deleted |
| BackupManagementType_s |Text |Provider type for performing backup for example, IaaSVM, FileFolder to which this backup item belongs to |
| OperationName |Text |This is the name of the current operation - BackupItemAssociation |
| Category |Text |This is the category of diagnostics data pushed to Log Analytics, it is AzureBackupReport |
| Resource |Text |This is the resource for which data is being collected, it shows Recovery Services vault name |
| PolicyUniqueId_g |Text |Unique Id to identify the policy which backup item is associated to |
| ProtectedServerUniqueId_s |Text |Unique Id of the protected to which this backup item belongs to |
| VaultUniqueId_s |Text |Unique Id of the protected to which this backup item belongs to |
| SourceSystem |Text |Source system of the current data - Azure |
| ResourceId |Text |This is the resource id for which data is being collected, it shows Recovery Services vault resource id |
| SubscriptionId |Text |This is the subscription id of the resource (RS vault) for which data is being collected |
| ResourceGroup |Text |This is the resource group of the resource (RS vault) for which data is being collected |
| ResourceProvider |Text |This denotes the resource provider for which data is being collected - Microsoft.RecoveryServices |
| ResourceType |Text |This is the type of the resource for which data is being collected - Vaults |
