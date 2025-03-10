---
title: Azure permissions for Security - Azure RBAC
description: Lists the permissions for the Azure resource providers in the Security category.
ms.service: role-based-access-control
ms.topic: reference
author: rolyon
manager: amycolannino
ms.author: rolyon
ms.date: 01/25/2025
ms.custom: generated
---

# Azure permissions for Security

This article lists the permissions for the Azure resource providers in the Security category. You can use these permissions in your own [Azure custom roles](/azure/role-based-access-control/custom-roles) to provide granular access control to resources in Azure. Permission strings have the following format: `{Company}.{ProviderName}/{resourceType}/{action}`


## Microsoft.AppComplianceAutomation

Azure service: [App Compliance Automation Tool for Microsoft 365](/microsoft-365-app-certification/docs/acat-overview)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.AppComplianceAutomation/onboard/action | Onboard given subscriptions to Microsoft.AppComplianceAutomation provider. |
> | Microsoft.AppComplianceAutomation/triggerEvaluation/action | Trigger quick evaluation for the given subscriptions. |
> | Microsoft.AppComplianceAutomation/listInUseStorageAccounts/action | List the storage accounts which are in use by related reports |
> | Microsoft.AppComplianceAutomation/checkNameAvailability/action | action checkNameAvailability |
> | Microsoft.AppComplianceAutomation/getCollectionCount/action | Get the count of reports. |
> | Microsoft.AppComplianceAutomation/getOverviewStatus/action | Get the resource overview status. |
> | Microsoft.AppComplianceAutomation/register/action | Register the subscription for Microsoft.AppComplianceAutomation |
> | Microsoft.AppComplianceAutomation/unregister/action | Unregister the subscription for Microsoft.AppComplianceAutomation |
> | Microsoft.AppComplianceAutomation/locations/operationStatuses/read | read operationStatuses |
> | Microsoft.AppComplianceAutomation/locations/operationStatuses/write | write operationStatuses |
> | Microsoft.AppComplianceAutomation/operations/read | read operations |
> | Microsoft.AppComplianceAutomation/reports/read | Get the AppComplianceAutomation report list for the tenant. |
> | Microsoft.AppComplianceAutomation/reports/read | Get the AppComplianceAutomation report and its properties. |
> | Microsoft.AppComplianceAutomation/reports/write | Create a new AppComplianceAutomation report or update an exiting AppComplianceAutomation report. |
> | Microsoft.AppComplianceAutomation/reports/delete | Delete an AppComplianceAutomation report. |
> | Microsoft.AppComplianceAutomation/reports/write | Update an exiting AppComplianceAutomation report. |
> | Microsoft.AppComplianceAutomation/reports/checkNameAvailability/action | Checks the report's nested resource name availability, e.g: Webhooks, Evidences, Snapshots. |
> | Microsoft.AppComplianceAutomation/reports/fix/action | Fix the AppComplianceAutomation report error. e.g: App Compliance Automation Tool service unregistered, automation removed. |
> | Microsoft.AppComplianceAutomation/reports/getScopingQuestions/action | Fix the AppComplianceAutomation report error. e.g: App Compliance Automation Tool service unregistered, automation removed. |
> | Microsoft.AppComplianceAutomation/reports/syncCertRecord/action | Synchronize attestation record from app compliance. |
> | Microsoft.AppComplianceAutomation/reports/verify/action | Verify the AppComplianceAutomation report health status. |
> | Microsoft.AppComplianceAutomation/reports/evidences/read | Returns a paginated list of evidences for a specified report. |
> | Microsoft.AppComplianceAutomation/reports/evidences/read | Get the evidence metadata |
> | Microsoft.AppComplianceAutomation/reports/evidences/write | Create or Update an evidence a specified report |
> | Microsoft.AppComplianceAutomation/reports/evidences/delete | Delete an existent evidence from a specified report |
> | Microsoft.AppComplianceAutomation/reports/evidences/download/action | Download evidence file. |
> | Microsoft.AppComplianceAutomation/reports/scopingConfigurations/read | Returns a list format of the singleton scopingConfiguration for a specified report. |
> | Microsoft.AppComplianceAutomation/reports/scopingConfigurations/read | Get the AppComplianceAutomation scoping configuration of the specific report. |
> | Microsoft.AppComplianceAutomation/reports/scopingConfigurations/write | Get the AppComplianceAutomation scoping configuration of the specific report. |
> | Microsoft.AppComplianceAutomation/reports/scopingConfigurations/delete | Clean the AppComplianceAutomation scoping configuration of the specific report. |
> | Microsoft.AppComplianceAutomation/reports/snapshots/read | Get the AppComplianceAutomation snapshot list. |
> | Microsoft.AppComplianceAutomation/reports/snapshots/read | Get the AppComplianceAutomation snapshot and its properties. |
> | Microsoft.AppComplianceAutomation/reports/snapshots/download/action | Download compliance needs from snapshot, like: Compliance Report, Resource List. |
> | Microsoft.AppComplianceAutomation/reports/snapshots/controls/read | Get the AppComplianceAutomation control list. |
> | Microsoft.AppComplianceAutomation/reports/snapshots/controls/read | Get the AppComplianceAutomation control and its properties. |
> | Microsoft.AppComplianceAutomation/reports/webhooks/read | Get the AppComplianceAutomation webhook list. |
> | Microsoft.AppComplianceAutomation/reports/webhooks/read | Get the AppComplianceAutomation webhook and its properties. |
> | Microsoft.AppComplianceAutomation/reports/webhooks/write | Create a new AppComplianceAutomation webhook or update an exiting AppComplianceAutomation webhook. |
> | Microsoft.AppComplianceAutomation/reports/webhooks/delete | Delete an AppComplianceAutomation webhook. |
> | Microsoft.AppComplianceAutomation/reports/webhooks/write | Update an exiting AppComplianceAutomation webhook. |

## Microsoft.DataProtection

Azure service: Data Protection

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.DataProtection/register/action | Registers subscription for given Resource Provider |
> | Microsoft.DataProtection/unregister/action | Unregisters subscription for given Resource Provider |
> | Microsoft.DataProtection/backupVaults/write | Create BackupVault operation creates an Azure resource of type 'Backup Vault' |
> | Microsoft.DataProtection/backupVaults/write | Update BackupVault operation updates an Azure resource of type 'Backup Vault' |
> | Microsoft.DataProtection/backupVaults/read | The Get Backup Vault operation gets an object representing the Azure resource of type 'Backup Vault' |
> | Microsoft.DataProtection/backupVaults/read | Gets list of Backup Vaults in a Subscription |
> | Microsoft.DataProtection/backupVaults/read | Gets list of Backup Vaults in a Resource Group |
> | Microsoft.DataProtection/backupVaults/delete | The Delete Vault operation deletes the specified Azure resource of type 'Backup Vault' |
> | Microsoft.DataProtection/backupVaults/validateForBackup/action | Validates for backup of Backup Instance |
> | Microsoft.DataProtection/backupVaults/backupInstances/write | Creates a Backup Instance |
> | Microsoft.DataProtection/backupVaults/backupInstances/validateForModifyBackup/action | Validates for modification of Backup Instance |
> | Microsoft.DataProtection/backupVaults/backupInstances/delete | Deletes the Backup Instance |
> | Microsoft.DataProtection/backupVaults/backupInstances/read | Returns details of the Backup Instance |
> | Microsoft.DataProtection/backupVaults/backupInstances/read | Returns all Backup Instances |
> | Microsoft.DataProtection/backupVaults/backupInstances/backup/action | Performs Backup on the Backup Instance |
> | Microsoft.DataProtection/backupVaults/backupInstances/sync/action | Sync operation retries last failed operation on backup instance to bring it to a valid state. |
> | Microsoft.DataProtection/backupVaults/backupInstances/restore/action | Triggers restore on the Backup Instance |
> | Microsoft.DataProtection/backupVaults/backupInstances/validateRestore/action | Validates for Restore of the Backup Instance |
> | Microsoft.DataProtection/backupVaults/backupInstances/stopProtection/action | Stop Protection operation stops both backup and retention schedules of backup instance. Existing data will be retained forever. |
> | Microsoft.DataProtection/backupVaults/backupInstances/suspendBackups/action | Suspend Backups operation stops only backups of backup instance. Retention activities will continue and hence data will be ratained as per policy. |
> | Microsoft.DataProtection/backupVaults/backupInstances/resumeProtection/action | Resume protection of a ProtectionStopped BI. |
> | Microsoft.DataProtection/backupVaults/backupInstances/resumeBackups/action | Resume Backups for a BackupsSuspended BI. |
> | Microsoft.DataProtection/backupVaults/backupInstances/findRestorableTimeRanges/action | Finds Restorable Time Ranges |
> | Microsoft.DataProtection/backupVaults/backupInstances/operationResults/read | Returns Backup Operation Result for Backup Vault. |
> | Microsoft.DataProtection/backupVaults/backupInstances/recoveryPoints/read | Returns details of the Recovery Point |
> | Microsoft.DataProtection/backupVaults/backupInstances/recoveryPoints/read | Returns all Recovery Points |
> | Microsoft.DataProtection/backupVaults/backupJobs/read | Get Jobs list |
> | Microsoft.DataProtection/backupVaults/backupJobs/enableProgress/action | Get Job details |
> | Microsoft.DataProtection/backupVaults/backupPolicies/write | Creates Backup Policy |
> | Microsoft.DataProtection/backupVaults/backupPolicies/delete | Deletes the Backup Policy |
> | Microsoft.DataProtection/backupVaults/backupPolicies/read | Returns details of the Backup Policy |
> | Microsoft.DataProtection/backupVaults/backupPolicies/read | Returns all Backup Policies |
> | Microsoft.DataProtection/backupVaults/backupResourceGuardProxies/read | Get the list of ResourceGuard proxies for a resource |
> | Microsoft.DataProtection/backupVaults/backupResourceGuardProxies/read | Get ResourceGuard proxy operation gets an object representing the Azure resource of type 'ResourceGuard proxy' |
> | Microsoft.DataProtection/backupVaults/backupResourceGuardProxies/write | Create ResourceGuard proxy operation creates an Azure resource of type 'ResourceGuard Proxy' |
> | Microsoft.DataProtection/backupVaults/backupResourceGuardProxies/delete | The Delete ResourceGuard proxy operation deletes the specified Azure resource of type 'ResourceGuard proxy' |
> | Microsoft.DataProtection/backupVaults/backupResourceGuardProxies/unlockDelete/action | Unlock delete ResourceGuard proxy operation unlocks the next delete critical operation |
> | Microsoft.DataProtection/backupVaults/deletedBackupInstances/undelete/action | Perform undelete of soft-deleted Backup Instance. Backup Instance moves from SoftDeleted to ProtectionStopped state. |
> | Microsoft.DataProtection/backupVaults/deletedBackupInstances/read | Get soft-deleted Backup Instance in a Backup Vault by name |
> | Microsoft.DataProtection/backupVaults/deletedBackupInstances/read | List soft-deleted Backup Instances in a Backup Vault. |
> | Microsoft.DataProtection/backupVaults/operationResults/read | Gets Operation Result of a Patch Operation for a Backup Vault |
> | Microsoft.DataProtection/backupVaults/operationStatus/read | Returns Backup Operation Status for Backup Vault. |
> | Microsoft.DataProtection/locations/checkNameAvailability/action | Checks if the requested BackupVault Name is Available |
> | Microsoft.DataProtection/locations/getBackupStatus/action | Check Backup Status for Recovery Services Vaults |
> | Microsoft.DataProtection/locations/checkFeatureSupport/action | Validates if a feature is supported |
> | Microsoft.DataProtection/locations/operationResults/read | Returns Backup Operation Result for Backup Vault. |
> | Microsoft.DataProtection/locations/operationStatus/read | Returns Backup Operation Status for Backup Vault. |
> | Microsoft.DataProtection/operations/read | Operation returns the list of Operations for a Resource Provider |
> | Microsoft.DataProtection/subscriptions/providers/resourceGuards/read | Gets list of ResourceGuards in a Subscription |
> | Microsoft.DataProtection/subscriptions/resourceGroups/providers/locations/fetchSecondaryRecoveryPoints/action | Returns recovery points from secondary region for cross region restore enabled Backup Vaults. |
> | Microsoft.DataProtection/subscriptions/resourceGroups/providers/locations/crossRegionRestore/action | Triggers cross region restore operation on given backup instance. |
> | Microsoft.DataProtection/subscriptions/resourceGroups/providers/locations/validateCrossRegionRestore/action | Performs validations for cross region restore operation. |
> | Microsoft.DataProtection/subscriptions/resourceGroups/providers/locations/fetchCrossRegionRestoreJobs/action | List cross region restore jobs of backup instance from secondary region. |
> | Microsoft.DataProtection/subscriptions/resourceGroups/providers/locations/fetchCrossRegionRestoreJob/action | Get cross region restore job details from secondary region. |
> | Microsoft.DataProtection/subscriptions/resourceGroups/providers/locations/operationStatus/read | Returns Backup Operation Status for Backup Vault. |
> | Microsoft.DataProtection/subscriptions/resourceGroups/providers/resourceGuards/write | Create ResourceGuard operation creates an Azure resource of type 'ResourceGuard' |
> | Microsoft.DataProtection/subscriptions/resourceGroups/providers/resourceGuards/read | The Get ResourceGuard operation gets an object representing the Azure resource of type 'ResourceGuard' |
> | Microsoft.DataProtection/subscriptions/resourceGroups/providers/resourceGuards/delete | The Delete ResourceGuard operation deletes the specified Azure resource of type 'ResourceGuard' |
> | Microsoft.DataProtection/subscriptions/resourceGroups/providers/resourceGuards/read | Gets list of ResourceGuards in a Resource Group |
> | Microsoft.DataProtection/subscriptions/resourceGroups/providers/resourceGuards/write | Update ResourceGuard operation updates an Azure resource of type 'ResourceGuard' |
> | Microsoft.DataProtection/subscriptions/resourceGroups/providers/resourceGuards/{operationName}/read | Gets ResourceGuard operation request info |
> | Microsoft.DataProtection/subscriptions/resourceGroups/providers/resourceGuards/{operationName}/read | Gets ResourceGuard default operation request info |

## Microsoft.KeyVault

Safeguard and maintain control of keys and other secrets.

Azure service: [Key Vault](/azure/key-vault/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.KeyVault/register/action | Registers a subscription |
> | Microsoft.KeyVault/unregister/action | Unregisters a subscription |
> | Microsoft.KeyVault/checkNameAvailability/read | Checks that a key vault name is valid and is not in use |
> | Microsoft.KeyVault/deletedManagedHsms/read | View the properties of a deleted managed hsm |
> | Microsoft.KeyVault/deletedVaults/read | View the properties of soft deleted key vaults |
> | Microsoft.KeyVault/hsmPools/read | View the properties of an HSM pool |
> | Microsoft.KeyVault/hsmPools/write | Create a new HSM pool of update the properties of an existing HSM pool |
> | Microsoft.KeyVault/hsmPools/delete | Delete an HSM pool |
> | Microsoft.KeyVault/hsmPools/joinVault/action | Join a key vault to an HSM pool |
> | Microsoft.KeyVault/locations/deleteVirtualNetworkOrSubnets/action | Notifies Microsoft.KeyVault that a virtual network or subnet is being deleted |
> | Microsoft.KeyVault/locations/notifyNetworkSecurityPerimeterUpdatesAvailable/action | Check if the configuration of the Network Security Perimeter needs updating. |
> | Microsoft.KeyVault/locations/deletedManagedHsms/read | View the properties of a deleted managed hsm |
> | Microsoft.KeyVault/locations/deletedManagedHsms/purge/action | Purge a soft deleted managed hsm |
> | Microsoft.KeyVault/locations/deletedManagedHsms/delete | Purge a soft deleted managed hsm |
> | Microsoft.KeyVault/locations/deletedVaults/read | View the properties of a soft deleted key vault |
> | Microsoft.KeyVault/locations/deletedVaults/purge/action | Purge a soft deleted key vault |
> | Microsoft.KeyVault/locations/managedHsmOperationResults/read | Check the result of a long run operation |
> | Microsoft.KeyVault/locations/operationResults/read | Check the result of a long run operation |
> | Microsoft.KeyVault/managedHSMs/read | View the properties of a Managed HSM |
> | Microsoft.KeyVault/managedHSMs/write | Create a new Managed HSM or update the properties of an existing Managed HSM |
> | Microsoft.KeyVault/managedHSMs/delete | Delete a Managed HSM |
> | Microsoft.KeyVault/managedHSMs/PrivateEndpointConnectionsApproval/action | Approve or reject a connection to a Private Endpoint resource of Microsoft.Network provider |
> | Microsoft.KeyVault/managedHSMs/keys/read | List the keys in a specified managed hsm, or read the current version of a specified key. |
> | Microsoft.KeyVault/managedHSMs/keys/write | Creates the first version of a new key if it does not exist. If it already exists, then the existing key is returned without any modification. This API does not create subsequent versions, and does not update existing keys. |
> | Microsoft.KeyVault/managedHSMs/keys/versions/read | List the versions of a specified key, or read the specified version of a key. |
> | Microsoft.KeyVault/managedHSMs/privateEndpointConnectionProxies/read | View the state of a connection proxy to a Private Endpoint resource of Microsoft.Network provider |
> | Microsoft.KeyVault/managedHSMs/privateEndpointConnectionProxies/write | Change the state of a connection proxy to a Private Endpoint resource of Microsoft.Network provider |
> | Microsoft.KeyVault/managedHSMs/privateEndpointConnectionProxies/delete | Delete a connection proxy to a Private Endpoint resource of Microsoft.Network provider |
> | Microsoft.KeyVault/managedHSMs/privateEndpointConnectionProxies/validate/action | Validate a connection proxy to a Private Endpoint resource of Microsoft.Network provider |
> | Microsoft.KeyVault/managedHSMs/privateEndpointConnections/read | View the state of a connection to a Private Endpoint resource of Microsoft.Network provider |
> | Microsoft.KeyVault/managedHSMs/privateEndpointConnections/write | Change the state of a connection to a Private Endpoint resource of Microsoft.Network provider |
> | Microsoft.KeyVault/managedHSMs/privateEndpointConnections/delete | Delete a connection to a Private Endpoint resource of Microsoft.Network provider |
> | Microsoft.KeyVault/managedHSMs/privateLinkResources/read | Get the available private link resources for the specified instance of Managed HSM. |
> | Microsoft.KeyVault/managedHSMs/providers/Microsoft.Insights/diagnosticSettings/Read | Gets the diagnostic setting for the resource |
> | Microsoft.KeyVault/managedHSMs/providers/Microsoft.Insights/diagnosticSettings/Write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.KeyVault/managedHSMs/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for a Managed HSM |
> | Microsoft.KeyVault/managedHSMs/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for a key vault |
> | Microsoft.KeyVault/operations/read | Lists operations available on Microsoft.KeyVault resource provider |
> | Microsoft.KeyVault/vaults/read | View the properties of a key vault |
> | Microsoft.KeyVault/vaults/write | Creates a new key vault or updates the properties of an existing key vault. Certain properties may require more permissions. |
> | Microsoft.KeyVault/vaults/delete | Deletes a key vault |
> | Microsoft.KeyVault/vaults/deploy/action | Enables access to secrets in a key vault when deploying Azure resources |
> | Microsoft.KeyVault/vaults/PrivateEndpointConnectionsApproval/action | Approve or reject a connection to a Private Endpoint resource of Microsoft.Network provider |
> | Microsoft.KeyVault/vaults/joinPerimeter/action | Action to join the Network Security Perimeter, used by linked access checks by NRP. |
> | Microsoft.KeyVault/vaults/accessPolicies/write | Updates an existing access policy by merging or replacing, or adds a new access policy to the key vault. |
> | Microsoft.KeyVault/vaults/eventGridFilters/read | Notifies Microsoft.KeyVault that an EventGrid Subscription for Key Vault is being viewed |
> | Microsoft.KeyVault/vaults/eventGridFilters/write | Notifies Microsoft.KeyVault that a new EventGrid Subscription for Key Vault is being created |
> | Microsoft.KeyVault/vaults/eventGridFilters/delete | Notifies Microsoft.KeyVault that an EventGrid Subscription for Key Vault is being deleted |
> | Microsoft.KeyVault/vaults/keys/read | List the keys in a specified vault, or read the current version of a specified key. |
> | Microsoft.KeyVault/vaults/keys/write | Creates the first version of a new key if it does not exist. If it already exists, then the existing key is returned without any modification. This API does not create subsequent versions, and does not update existing keys. |
> | Microsoft.KeyVault/vaults/keys/versions/read | List the versions of a specified key, or read the specified version of a key. |
> | Microsoft.KeyVault/vaults/networkSecurityPerimeterAssociationProxies/delete | Delete an association proxy to a Network Security Perimeter resource of Microsoft.Network provider. |
> | Microsoft.KeyVault/vaults/networkSecurityPerimeterAssociationProxies/read | Delete an association proxy to a Network Security Perimeter resource of Microsoft.Network provider. |
> | Microsoft.KeyVault/vaults/networkSecurityPerimeterAssociationProxies/write | Change the state of an association to a Network Security Perimeter resource of Microsoft.Network provider |
> | Microsoft.KeyVault/vaults/networkSecurityPerimeterConfigurations/read | Read the Network Security Perimeter configuration stored in a vault. |
> | Microsoft.KeyVault/vaults/networkSecurityPerimeterConfigurations/reconcile/action | Reconcile the Network Security Perimeter configuration stored in a vault with NRP's (Microsoft.Network Resource Provider) copy. |
> | Microsoft.KeyVault/vaults/privateEndpointConnectionProxies/read | View the state of a connection proxy to a Private Endpoint resource of Microsoft.Network provider |
> | Microsoft.KeyVault/vaults/privateEndpointConnectionProxies/write | Change the state of a connection proxy to a Private Endpoint resource of Microsoft.Network provider |
> | Microsoft.KeyVault/vaults/privateEndpointConnectionProxies/delete | Delete a connection proxy to a Private Endpoint resource of Microsoft.Network provider |
> | Microsoft.KeyVault/vaults/privateEndpointConnectionProxies/validate/action | Validate a connection proxy to a Private Endpoint resource of Microsoft.Network provider |
> | Microsoft.KeyVault/vaults/privateEndpointConnections/read | View the state of a connection to a Private Endpoint resource of Microsoft.Network provider |
> | Microsoft.KeyVault/vaults/privateEndpointConnections/write | Change the state of a connection to a Private Endpoint resource of Microsoft.Network provider |
> | Microsoft.KeyVault/vaults/privateEndpointConnections/delete | Delete a connection to a Private Endpoint resource of Microsoft.Network provider |
> | Microsoft.KeyVault/vaults/privateLinkResources/read | Get the available private link resources for the specified instance of Key Vault |
> | Microsoft.KeyVault/vaults/providers/Microsoft.Insights/diagnosticSettings/Read | Gets the diagnostic setting for the resource |
> | Microsoft.KeyVault/vaults/providers/Microsoft.Insights/diagnosticSettings/Write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.KeyVault/vaults/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for a key vault |
> | Microsoft.KeyVault/vaults/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for a key vault |
> | Microsoft.KeyVault/vaults/secrets/read | View the properties of a secret, but not its value. |
> | Microsoft.KeyVault/vaults/secrets/write | Creates a new secret or updates the value of an existing secret. |
> | **DataAction** | **Description** |
> | Microsoft.KeyVault/vaults/certificatecas/delete | Delete Certificate Issuer |
> | Microsoft.KeyVault/vaults/certificatecas/read | Read Certificate Issuer |
> | Microsoft.KeyVault/vaults/certificatecas/write | Write Certificate Issuer |
> | Microsoft.KeyVault/vaults/certificatecontacts/write | Manage Certificate Contact |
> | Microsoft.KeyVault/vaults/certificates/delete | Deletes a certificate. All versions are deleted. |
> | Microsoft.KeyVault/vaults/certificates/read | List certificates in a specified key vault, or get information about a certificate. |
> | Microsoft.KeyVault/vaults/certificates/backup/action | Creates the backup file of a certificate. The file can used to restore the certificate in a Key Vault of same subscription. Restrictions may apply. |
> | Microsoft.KeyVault/vaults/certificates/purge/action | Purges a certificate, making it unrecoverable. |
> | Microsoft.KeyVault/vaults/certificates/update/action | Updates the specified attributes associated with the given certificate. |
> | Microsoft.KeyVault/vaults/certificates/create/action | Creates a new certificate. If the certificate does not exist, the first version is created. Otherwise, a new version is created. |
> | Microsoft.KeyVault/vaults/certificates/import/action | Imports an existing valid certificate containing a private key.<br>The certificate to be imported can be in either PFX or PEM format.<br>If the certificate does not exist in Key Vault, the first version is created with specified content.<br>Otherwise, a new version is created with specified content. |
> | Microsoft.KeyVault/vaults/certificates/recover/action | Recovers the deleted certificate. The operation performs the reversal of the Delete operation. The operation is applicable in vaults enabled for soft-delete, and must be issued during the retention interval. |
> | Microsoft.KeyVault/vaults/certificates/restore/action | Restores a certificate and all its versions from a backup file generated by Key Vault. |
> | Microsoft.KeyVault/vaults/keyrotationpolicies/read | Retrieves the rotation policy of a given key. |
> | Microsoft.KeyVault/vaults/keyrotationpolicies/write | Updates the rotation policy of a given key. |
> | Microsoft.KeyVault/vaults/keys/read | List keys in the specified vault, or read properties and public material of a key.<br>For asymmetric keys, this operation exposes public key and includes ability to perform public key algorithms such as encrypt and verify signature.<br>Private keys and symmetric keys are never exposed. |
> | Microsoft.KeyVault/vaults/keys/update/action | Updates the specified attributes associated with the given key. |
> | Microsoft.KeyVault/vaults/keys/create/action | Creates a new key. If the key does not exist, the first version is created. Otherwise, a new version is created with the specified value. |
> | Microsoft.KeyVault/vaults/keys/import/action | Imports an externally created key. If the key does not exist, the first version is created with the imported material. Otherwise, a new version is created with the imported material. |
> | Microsoft.KeyVault/vaults/keys/recover/action | Recovers the deleted key. The operation performs the reversal of the Delete operation. The operation is applicable in vaults enabled for soft-delete, and must be issued during the retention interval. |
> | Microsoft.KeyVault/vaults/keys/restore/action | Restores a key and all its versions from a backup file generated by Key Vault. |
> | Microsoft.KeyVault/vaults/keys/delete | Deletes a key. All versions are deleted. |
> | Microsoft.KeyVault/vaults/keys/backup/action | Creates the backup file of a key. The file can used to restore the key in a Key Vault of same subscription. Restrictions may apply. |
> | Microsoft.KeyVault/vaults/keys/purge/action | Purges a key, making it unrecoverable. |
> | Microsoft.KeyVault/vaults/keys/encrypt/action | Encrypts plaintext with a key. Note that if the key is asymmetric, this operation can be performed by principals with read access. |
> | Microsoft.KeyVault/vaults/keys/decrypt/action | Decrypts ciphertext with a key. |
> | Microsoft.KeyVault/vaults/keys/wrap/action | Wraps a symmetric key with a Key Vault key. Note that if the Key Vault key is asymmetric, this operation can be performed by principals with read access. |
> | Microsoft.KeyVault/vaults/keys/unwrap/action | Unwraps a symmetric key with a Key Vault key. |
> | Microsoft.KeyVault/vaults/keys/sign/action | Signs a message digest (hash) with a key. |
> | Microsoft.KeyVault/vaults/keys/verify/action | Verifies the signature of a message digest (hash) with a key. Note that if the key is asymmetric, this operation can be performed by principals with read access. |
> | Microsoft.KeyVault/vaults/keys/release/action | Release a key using public part of KEK from attestation token. |
> | Microsoft.KeyVault/vaults/keys/rotate/action | Creates a new version of an existing key (with the same parameters). |
> | Microsoft.KeyVault/vaults/secrets/delete | Deletes a secret. All versions are deleted. |
> | Microsoft.KeyVault/vaults/secrets/backup/action | Creates the backup file of a secret. The file can used to restore the secret in a Key Vault of same subscription. Restrictions may apply. |
> | Microsoft.KeyVault/vaults/secrets/purge/action | Purges a secret, making it unrecoverable. |
> | Microsoft.KeyVault/vaults/secrets/update/action | Updates the specified attributes associated with the given secret. |
> | Microsoft.KeyVault/vaults/secrets/recover/action | Recovers the deleted secret. The operation performs the reversal of the Delete operation. The operation is applicable in vaults enabled for soft-delete, and must be issued during the retention interval. |
> | Microsoft.KeyVault/vaults/secrets/restore/action | Restores a secret and all its versions from a backup file generated by Key Vault. |
> | Microsoft.KeyVault/vaults/secrets/readMetadata/action | List or view the properties of a secret, but not its value. |
> | Microsoft.KeyVault/vaults/secrets/getSecret/action | Gets the value of a secret. |
> | Microsoft.KeyVault/vaults/secrets/setSecret/action | Sets the value of a secret. If the secret does not exist, the first version is created. Otherwise, a new version is created with the specified value. |
> | Microsoft.KeyVault/vaults/storageaccounts/read | Read definition of managed storage accounts. |
> | Microsoft.KeyVault/vaults/storageaccounts/set/action | Creates or updates the definition of a managed storage account. |
> | Microsoft.KeyVault/vaults/storageaccounts/delete | Delete the definition of a managed storage account. |
> | Microsoft.KeyVault/vaults/storageaccounts/backup/action | Creates a backup file of the definition of a managed storage account and its SAS (Shared Access Signature). |
> | Microsoft.KeyVault/vaults/storageaccounts/purge/action | Purge the soft-deleted definition of a managed storage account or SAS (Shared Access Signature). |
> | Microsoft.KeyVault/vaults/storageaccounts/regeneratekey/action | Regenerate the access key of a managed storage account. |
> | Microsoft.KeyVault/vaults/storageaccounts/recover/action | Recover the soft-deleted definition of a managed storage account or SAS (Shared Access Signature). |
> | Microsoft.KeyVault/vaults/storageaccounts/restore/action | Restores the definition of a managed storage account and its SAS (Shared Access Signature) from a backup file generated by Key Vault. |
> | Microsoft.KeyVault/vaults/storageaccounts/sas/set/action | Creates or updates the SAS (Shared Access Signature) definition for a managed storage account. |
> | Microsoft.KeyVault/vaults/storageaccounts/sas/delete | Delete the SAS (Shared Access Signature) definition for a managed storage account. |
> | Microsoft.KeyVault/vaults/storageaccounts/sas/read | Read the SAS (Shared Access Signature) definition for a managed storage account. |

## Microsoft.Security

Protect your enterprise from advanced threats across hybrid cloud workloads.

Azure service: [Security Center](/azure/security-center/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Security/register/action | Registers the subscription for Azure Security Center |
> | Microsoft.Security/unregister/action | Unregisters the subscription from Azure Security Center |
> | Microsoft.Security/aggregations/action | Gets aggregations |
> | Microsoft.Security/adaptiveNetworkHardenings/read | Gets Adaptive Network Hardening recommendations of an Azure protected resource |
> | Microsoft.Security/adaptiveNetworkHardenings/enforce/action | Enforces the given traffic hardening rules by creating matching security rules on the given Network Security Group(s) |
> | Microsoft.Security/advancedThreatProtectionSettings/read | Gets the Advanced Threat Protection Settings for the resource |
> | Microsoft.Security/advancedThreatProtectionSettings/write | Updates the Advanced Threat Protection Settings for the resource |
> | Microsoft.Security/aggregations/read | Gets aggregations |
> | Microsoft.Security/alerts/read | Gets all available security alerts |
> | Microsoft.Security/alertsSuppressionRules/read | Gets all available security alert suppression rule |
> | Microsoft.Security/alertsSuppressionRules/write | Creates a new security alert suppression rule or update an existing rule |
> | Microsoft.Security/alertsSuppressionRules/delete | Delete a security alert suppression rule |
> | Microsoft.Security/apiCollections/read | Get Api Collections |
> | Microsoft.Security/apiCollections/write | Create Api Collections |
> | Microsoft.Security/apiCollections/delete | Delete Api Collections |
> | Microsoft.Security/applicationWhitelistings/read | Gets the application allowlistings |
> | Microsoft.Security/applicationWhitelistings/write | Creates a new application allowlisting or updates an existing one |
> | Microsoft.Security/assessmentMetadata/read | Get available security assessment metadata on your subscription |
> | Microsoft.Security/assessmentMetadata/write | Create or update a security assessment metadata |
> | Microsoft.Security/assessments/read | Get security assessments on your subscription |
> | Microsoft.Security/assessments/write | Create or update security assessments on your subscription |
> | Microsoft.Security/assessments/governanceAssignments/read | Get governance assignments for security assessments |
> | Microsoft.Security/assessments/governanceAssignments/write | Create or update governance assignments for security assessments |
> | Microsoft.Security/assessments/subAssessments/read | Get security sub assessments on your subscription |
> | Microsoft.Security/assessments/subAssessments/write | Create or update security sub assessments on your subscription |
> | Microsoft.Security/assignments/read | Get the security assignment |
> | Microsoft.Security/assignments/write | Create or update the security assignment |
> | Microsoft.Security/assignments/delete | Deletes the security assignment |
> | Microsoft.Security/automations/read | Gets the automations for the scope |
> | Microsoft.Security/automations/write | Creates or updates the automation for the scope |
> | Microsoft.Security/automations/delete | Deletes the automation for the scope |
> | Microsoft.Security/automations/validate/action | Validates the automation model for the scope |
> | Microsoft.Security/autoProvisioningSettings/read | Get security auto provisioning setting for the subscription |
> | Microsoft.Security/autoProvisioningSettings/write | Create or update security auto provisioning setting for the subscription |
> | Microsoft.Security/complianceResults/read | Gets the compliance results for the resource |
> | Microsoft.Security/customRecommendations/read | Get the custom recommendations |
> | Microsoft.Security/customRecommendations/write | Create or update the custom recommendation |
> | Microsoft.Security/customRecommendations/delete | Deletes the custom recommendation |
> | Microsoft.Security/datascanners/read | Gets the datascanners for the scope |
> | Microsoft.Security/datascanners/write | Creates or updates the datascanners for the scope |
> | Microsoft.Security/datascanners/delete | Deletes the datascanners for the scope |
> | Microsoft.Security/defenderforstoragesettings/read | Gets the defenderforstoragesettings for the scope |
> | Microsoft.Security/defenderforstoragesettings/write | Creates or updates the defenderforstoragesettings for the scope |
> | Microsoft.Security/defenderforstoragesettings/delete | Deletes the defenderforstoragesettings for the scope |
> | Microsoft.Security/deviceSecurityGroups/write | Creates or updates IoT device security groups |
> | Microsoft.Security/deviceSecurityGroups/delete | Deletes IoT device security groups |
> | Microsoft.Security/deviceSecurityGroups/read | Gets IoT device security groups |
> | Microsoft.Security/externalSecuritySolutions/read | Gets the external security solutions |
> | Microsoft.Security/governanceRules/read | Get governance rules for managing security posture |
> | Microsoft.Security/governanceRules/write | Create or update governance rules for managing security posture |
> | Microsoft.Security/informationProtectionPolicies/read | Gets the information protection policies for the resource |
> | Microsoft.Security/informationProtectionPolicies/write | Updates the information protection policies for the resource |
> | Microsoft.Security/integration/read | Get integration on your scope |
> | Microsoft.Security/integration/write | Create or update integration on your scope |
> | Microsoft.Security/integration/delete | Deleate or update integration on your scope |
> | Microsoft.Security/iotDefenderSettings/read | Gets IoT Defender Settings |
> | Microsoft.Security/iotDefenderSettings/write | Create or updates IoT Defender Settings |
> | Microsoft.Security/iotDefenderSettings/delete | Deletes IoT Defender Settings |
> | Microsoft.Security/iotDefenderSettings/PackageDownloads/action | Gets downloadable IoT Defender packages information |
> | Microsoft.Security/iotDefenderSettings/DownloadManagerActivation/action | Download manager activation file with subscription quota data |
> | Microsoft.Security/iotSecuritySolutions/write | Creates or updates IoT security solutions |
> | Microsoft.Security/iotSecuritySolutions/delete | Deletes IoT security solutions |
> | Microsoft.Security/iotSecuritySolutions/read | Gets IoT security solutions |
> | Microsoft.Security/iotSecuritySolutions/analyticsModels/read | Gets IoT security analytics model |
> | Microsoft.Security/iotSecuritySolutions/analyticsModels/read | Gets IoT alert types |
> | Microsoft.Security/iotSecuritySolutions/analyticsModels/read | Gets IoT alerts |
> | Microsoft.Security/iotSecuritySolutions/analyticsModels/read | Gets IoT recommendation types |
> | Microsoft.Security/iotSecuritySolutions/analyticsModels/read | Gets IoT recommendations |
> | Microsoft.Security/iotSecuritySolutions/analyticsModels/read | Gets devices |
> | Microsoft.Security/iotSecuritySolutions/analyticsModels/aggregatedAlerts/read | Gets IoT aggregated alerts |
> | Microsoft.Security/iotSecuritySolutions/analyticsModels/aggregatedAlerts/dismiss/action | Dismisses IoT aggregated alerts |
> | Microsoft.Security/iotSecuritySolutions/analyticsModels/aggregatedRecommendations/read | Gets IoT aggregated recommendations |
> | Microsoft.Security/iotSensors/read | Gets IoT Sensors |
> | Microsoft.Security/iotSensors/write | Create or updates IoT Sensors |
> | Microsoft.Security/iotSensors/delete | Deletes IoT Sensors |
> | Microsoft.Security/iotSensors/DownloadActivation/action | Downloads activation file for IoT Sensors |
> | Microsoft.Security/iotSensors/TriggerTiPackageUpdate/action | Triggers threat intelligence package update |
> | Microsoft.Security/iotSensors/DownloadResetPassword/action | Downloads reset password file for IoT Sensors |
> | Microsoft.Security/iotSite/read | Gets IoT site |
> | Microsoft.Security/iotSite/write | Creates or updates IoT site |
> | Microsoft.Security/iotSite/delete | Deletes IoT site |
> | Microsoft.Security/jitNetworkAccessPolicies/read | Gets the just-in-time network access policies |
> | Microsoft.Security/locations/read | Gets the security data location |
> | Microsoft.Security/locations/alerts/read | Gets all available security alerts |
> | Microsoft.Security/locations/alerts/dismiss/action | Dismiss a security alert |
> | Microsoft.Security/locations/alerts/activate/action | Activate a security alert |
> | Microsoft.Security/locations/alerts/resolve/action | Resolve a security alert |
> | Microsoft.Security/locations/alerts/simulate/action | Simulate a security alert |
> | Microsoft.Security/locations/externalSecuritySolutions/read | Gets the external security solutions |
> | Microsoft.Security/locations/jitNetworkAccessPolicies/read | Gets the just-in-time network access policies |
> | Microsoft.Security/locations/jitNetworkAccessPolicies/write | Creates a new just-in-time network access policy or updates an existing one |
> | Microsoft.Security/locations/jitNetworkAccessPolicies/delete | Deletes the just-in-time network access policy |
> | Microsoft.Security/locations/jitNetworkAccessPolicies/initiate/action | Initiates a just-in-time network access policy request |
> | Microsoft.Security/locations/securitySolutions/read | Gets the security solutions |
> | Microsoft.Security/locations/securitySolutions/write | Creates a new security solution or updates an existing one |
> | Microsoft.Security/locations/securitySolutions/delete | Deletes a security solution |
> | Microsoft.Security/locations/tasks/read | Gets all available security recommendations |
> | Microsoft.Security/locations/tasks/start/action | Start a security recommendation |
> | Microsoft.Security/locations/tasks/resolve/action | Resolve a security recommendation |
> | Microsoft.Security/locations/tasks/activate/action | Activate a security recommendation |
> | Microsoft.Security/locations/tasks/dismiss/action | Dismiss a security recommendation |
> | Microsoft.Security/mdeOnboardings/read | Get Microsoft Defender for Endpoint onboarding script |
> | Microsoft.Security/policies/read | Gets the security policy |
> | Microsoft.Security/policies/write | Updates the security policy |
> | Microsoft.Security/pricings/read | Gets the pricing settings for the scope |
> | Microsoft.Security/pricings/write | Updates the pricing settings for the scope |
> | Microsoft.Security/pricings/delete | Deletes the pricing settings for the scope |
> | Microsoft.Security/pricings/securityoperators/read | Gets the security operators for the scope |
> | Microsoft.Security/pricings/securityoperators/write | Updates the security operators for the scope |
> | Microsoft.Security/pricings/securityoperators/delete | Deletes the security operators for the scope |
> | Microsoft.Security/secureScoreControlDefinitions/read | Get secure score control definition |
> | Microsoft.Security/secureScoreControls/read | Get calculated secure score control for your subscription |
> | Microsoft.Security/secureScores/read | Get calculated secure score for your subscription |
> | Microsoft.Security/secureScores/secureScoreControls/read | Get calculated secure score control for your secure score calculation |
> | Microsoft.Security/securityConnectors/read | Gets the security connector |
> | Microsoft.Security/securityConnectors/write | Updates the security connector |
> | Microsoft.Security/securityConnectors/delete | Deletes the security connector |
> | Microsoft.Security/securityConnectors/devops/listAvailableAzureDevOpsOrgs/action | Returns a list of all Azure DevOps organizations accessible by the user token consumed by the connector. |
> | Microsoft.Security/securityConnectors/devops/write | Creates or updates a DevOps Configuration. |
> | Microsoft.Security/securityConnectors/devops/delete | Deletes a DevOps Connector. |
> | Microsoft.Security/securityConnectors/devops/read | Gets a DevOps Configuration. |
> | Microsoft.Security/securityConnectors/devops/read | List DevOps Configurations. |
> | Microsoft.Security/securityConnectors/devops/write | Updates a DevOps Configuration. |
> | Microsoft.Security/securityConnectors/devops/listAvailableGitHubOwners/action | Returns a list of all GitHub owners accessible by the user token consumed by the connector. |
> | Microsoft.Security/securityConnectors/devops/listAvailableGitLabGroups/action | Returns a list of all GitLab groups accessible by the user token consumed by the connector. |
> | Microsoft.Security/securityConnectors/devops/azureDevOpsOrgs/write | Creates or updates monitored Azure DevOps organization details. |
> | Microsoft.Security/securityConnectors/devops/azureDevOpsOrgs/delete | Deletes a monitored Azure DevOps organization. |
> | Microsoft.Security/securityConnectors/devops/azureDevOpsOrgs/read | Returns a monitored Azure DevOps organization resource. |
> | Microsoft.Security/securityConnectors/devops/azureDevOpsOrgs/read | Returns a list of Azure DevOps organizations onboarded to the connector. |
> | Microsoft.Security/securityConnectors/devops/azureDevOpsOrgs/write | Updates monitored Azure DevOps organization details. |
> | Microsoft.Security/securityConnectors/devops/azureDevOpsOrgs/listAvailableProjects/action | Returns a list of all Azure DevOps projects accessible by the user token consumed by the connector. |
> | Microsoft.Security/securityConnectors/devops/azureDevOpsOrgs/projects/write | Creates or updates a monitored Azure DevOps project resource. |
> | Microsoft.Security/securityConnectors/devops/azureDevOpsOrgs/projects/delete | Deletes a monitored Azure DevOps project resource. |
> | Microsoft.Security/securityConnectors/devops/azureDevOpsOrgs/projects/read | Returns a monitored Azure DevOps project resource. |
> | Microsoft.Security/securityConnectors/devops/azureDevOpsOrgs/projects/read | Returns a list of Azure DevOps projects onboarded to the connector. |
> | Microsoft.Security/securityConnectors/devops/azureDevOpsOrgs/projects/write | Updates a monitored Azure DevOps project resource. |
> | Microsoft.Security/securityConnectors/devops/azureDevOpsOrgs/projects/listAvailableRepos/action | Returns a list of all Azure DevOps repositories accessible by the user token consumed by the connector. |
> | Microsoft.Security/securityConnectors/devops/azureDevOpsOrgs/projects/repos/write | Creates or updates a monitored Azure DevOps repository resource. |
> | Microsoft.Security/securityConnectors/devops/azureDevOpsOrgs/projects/repos/delete | Deletes a monitored Azure DevOps repository resource. |
> | Microsoft.Security/securityConnectors/devops/azureDevOpsOrgs/projects/repos/read | Returns a monitored Azure DevOps repository resource. |
> | Microsoft.Security/securityConnectors/devops/azureDevOpsOrgs/projects/repos/read | Returns a list of Azure DevOps repositories onboarded to the connector. |
> | Microsoft.Security/securityConnectors/devops/azureDevOpsOrgs/projects/repos/write | Updates a monitored Azure DevOps repository resource. |
> | Microsoft.Security/securityConnectors/devops/gitHubOwners/write | Creates or updates a monitored GitHub owner. |
> | Microsoft.Security/securityConnectors/devops/gitHubOwners/delete | Deletes a monitored GitHub owner. |
> | Microsoft.Security/securityConnectors/devops/gitHubOwners/read | Returns a monitored GitHub owner. |
> | Microsoft.Security/securityConnectors/devops/gitHubOwners/read | Returns a list of GitHub owners onboarded to the connector. |
> | Microsoft.Security/securityConnectors/devops/gitHubOwners/write | Updates a monitored GitHub owner. |
> | Microsoft.Security/securityConnectors/devops/gitHubOwners/listAvailableRepos/action | Returns a list of all GitHub repositories accessible by the user token and app installation used by the connector. |
> | Microsoft.Security/securityConnectors/devops/gitHubOwners/repos/write | Creates or updates a monitored GitHub repository. |
> | Microsoft.Security/securityConnectors/devops/gitHubOwners/repos/delete | Deletes a monitored GitHub repository. |
> | Microsoft.Security/securityConnectors/devops/gitHubOwners/repos/read | Returns a monitored GitHub repository. |
> | Microsoft.Security/securityConnectors/devops/gitHubOwners/repos/read | Returns a list of GitHub repositories onboarded to the connector. |
> | Microsoft.Security/securityConnectors/devops/gitHubOwners/repos/write | Updates a monitored GitHub repository. |
> | Microsoft.Security/securityConnectors/devops/gitLabGroups/write | Creates or updates monitored GitLab Group details. |
> | Microsoft.Security/securityConnectors/devops/gitLabGroups/delete | Deletes a monitored GitLab Group. |
> | Microsoft.Security/securityConnectors/devops/gitLabGroups/read | Returns a monitored GitLab Group resource for a given fully-qualified name. |
> | Microsoft.Security/securityConnectors/devops/gitLabGroups/read | Returns a list of GitLab groups onboarded to the connector. |
> | Microsoft.Security/securityConnectors/devops/gitLabGroups/write | Updates monitored GitLab Group details. |
> | Microsoft.Security/securityConnectors/devops/gitLabGroups/listAvailableProjects/action | Gets a list of all GitLab projects that are directly owned by given group and accessible by the user token consumed by the connector. |
> | Microsoft.Security/securityConnectors/devops/gitLabGroups/listSubgroups/action | Gets nested subgroups of given GitLab Group which are onboarded to the connector. |
> | Microsoft.Security/securityConnectors/devops/gitLabGroups/listAvailableSubgroups/action | Gets all nested subgroups of given GitLab Group which are accessible by the user token consumed by the connector. |
> | Microsoft.Security/securityConnectors/devops/gitLabGroups/projects/write | Creates or updates monitored GitLab Project details. |
> | Microsoft.Security/securityConnectors/devops/gitLabGroups/projects/delete | Deletes a monitored GitLab Project. |
> | Microsoft.Security/securityConnectors/devops/gitLabGroups/projects/read | Returns a monitored GitLab Project resource for a given fully-qualified group name and project name. |
> | Microsoft.Security/securityConnectors/devops/gitLabGroups/projects/read | Gets a list of GitLab projects that are directly owned by given group and onboarded to the connector. |
> | Microsoft.Security/securityConnectors/devops/gitLabGroups/projects/write | Updates monitored GitLab Project details. |
> | Microsoft.Security/securityConnectors/devops/operationResults/read | Get devops long running operation result. |
> | Microsoft.Security/securityContacts/read | Gets the security contact |
> | Microsoft.Security/securityContacts/write | Updates the security contact |
> | Microsoft.Security/securityContacts/delete | Deletes the security contact |
> | Microsoft.Security/securitySolutions/read | Gets the security solutions |
> | Microsoft.Security/securitySolutions/write | Creates a new security solution or updates an existing one |
> | Microsoft.Security/securitySolutions/delete | Deletes a security solution |
> | Microsoft.Security/securitySolutionsReferenceData/read | Gets the security solutions reference data |
> | Microsoft.Security/securityStandards/read | Get the security standards |
> | Microsoft.Security/securityStandards/write | Create or update the security standard |
> | Microsoft.Security/securityStandards/delete | Deletes the security standard |
> | Microsoft.Security/securityStatuses/read | Gets the security health statuses for Azure resources |
> | Microsoft.Security/securityStatusesSummaries/read | Gets the security statuses summaries for the scope |
> | Microsoft.Security/sensitivitySettings/read | Gets tenant level sensitivity settings |
> | Microsoft.Security/sensitivitySettings/write | Updates tenant level sensitivity settings |
> | Microsoft.Security/serverVulnerabilityAssessments/read | Get server vulnerability assessments onboarding status on a given resource |
> | Microsoft.Security/serverVulnerabilityAssessments/write | Create or update a server vulnerability assessments solution on resource |
> | Microsoft.Security/serverVulnerabilityAssessments/delete | Remove a server vulnerability assessments solution from a resource |
> | Microsoft.Security/serverVulnerabilityAssessmentsSettings/read | Get server vulnerability assessments settings onboarding status for a given subscription |
> | Microsoft.Security/serverVulnerabilityAssessmentsSettings/write | Create or update server vulnerability assessments settings on a given subscription |
> | Microsoft.Security/serverVulnerabilityAssessmentsSettings/delete | Remove server vulnerability assessments settings from a given subscription |
> | Microsoft.Security/settings/read | Gets the settings for the scope |
> | Microsoft.Security/settings/write | Updates the settings for the scope |
> | Microsoft.Security/sqlVulnerabilityAssessments/baselineRules/action | Add a list of rules result to the baseline. |
> | Microsoft.Security/sqlVulnerabilityAssessments/baselineRules/read | Return the databases' baseline (all rules that were added to the baseline) or get a rule baseline results for the specified rule ID. |
> | Microsoft.Security/sqlVulnerabilityAssessments/baselineRules/write | Change the rule baseline result. |
> | Microsoft.Security/sqlVulnerabilityAssessments/baselineRules/delete | Remove the rule result from the baseline. |
> | Microsoft.Security/sqlVulnerabilityAssessments/scans/read | Return the list of vulnerability assessment scan records or get the scan record for the specified scan ID. |
> | Microsoft.Security/sqlVulnerabilityAssessments/scans/scanResults/read | Return the list of vulnerability assessment rule results or get the rule result for the specified rule ID. |
> | Microsoft.Security/standardAssignments/read | Get the standard assignments |
> | Microsoft.Security/standardAssignments/write | Create or update the standard assignment |
> | Microsoft.Security/standardAssignments/delete | Deletes the standard assignment |
> | Microsoft.Security/standards/read | Get the security standard |
> | Microsoft.Security/standards/write | Create or update the security standard |
> | Microsoft.Security/standards/delete | Deletes the security standard |
> | Microsoft.Security/tasks/read | Gets all available security recommendations |
> | Microsoft.Security/webApplicationFirewalls/read | Gets the web application firewalls |
> | Microsoft.Security/webApplicationFirewalls/write | Creates a new web application firewall or updates an existing one |
> | Microsoft.Security/webApplicationFirewalls/delete | Deletes a web application firewall |
> | Microsoft.Security/workspaceSettings/read | Gets the workspace settings |
> | Microsoft.Security/workspaceSettings/write | Updates the workspace settings |
> | Microsoft.Security/workspaceSettings/delete | Deletes the workspace settings |
> | Microsoft.Security/workspaceSettings/connect/action | Change workspace settings reconnection settings |

## Microsoft.SecurityGraph

Azure service: Microsoft Monitoring Insights

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.SecurityGraph/diagnosticsettings/write | Writing a diagnostic setting |
> | Microsoft.SecurityGraph/diagnosticsettings/read | Reading a diagnostic setting |
> | Microsoft.SecurityGraph/diagnosticsettings/delete | Deleting a diagnostic setting |
> | Microsoft.SecurityGraph/diagnosticsettingscategories/read | Reading a diagnostic setting categories |

## Microsoft.SecurityInsights

Azure service: [Microsoft Sentinel](/azure/sentinel/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.SecurityInsights/register/action | Registers the subscription to Azure Sentinel |
> | Microsoft.SecurityInsights/unregister/action | Unregisters the subscription from Azure Sentinel |
> | Microsoft.SecurityInsights/dataConnectorsCheckRequirements/action | Check user authorization and license |
> | Microsoft.SecurityInsights/contentTranslators/action | Check a translation of content |
> | Microsoft.SecurityInsights/Aggregations/read | Gets aggregated information |
> | Microsoft.SecurityInsights/alertRules/read | Gets the alert rules |
> | Microsoft.SecurityInsights/alertRules/write | Updates alert rules |
> | Microsoft.SecurityInsights/alertRules/delete | Deletes alert rules |
> | Microsoft.SecurityInsights/alertRules/triggerRuleRun/action | Trigger on-demand rule run execution |
> | Microsoft.SecurityInsights/alertRules/actions/read | Gets the response actions of an alert rule |
> | Microsoft.SecurityInsights/alertRules/actions/write | Updates the response actions of an alert rule |
> | Microsoft.SecurityInsights/alertRules/actions/delete | Deletes the response actions of an alert rule |
> | Microsoft.SecurityInsights/automationRules/read | Gets an automation rule |
> | Microsoft.SecurityInsights/automationRules/write | Updates an automation rule |
> | Microsoft.SecurityInsights/automationRules/delete | Deletes an automation rule |
> | Microsoft.SecurityInsights/BillingStatistics/read | Read BillingStatistics |
> | Microsoft.SecurityInsights/Bookmarks/read | Gets bookmarks |
> | Microsoft.SecurityInsights/Bookmarks/write | Updates bookmarks |
> | Microsoft.SecurityInsights/Bookmarks/delete | Deletes bookmarks |
> | Microsoft.SecurityInsights/Bookmarks/expand/action | Gets related entities of an entity by a specific expansion |
> | Microsoft.SecurityInsights/bookmarks/relations/read | Gets a bookmark relation |
> | Microsoft.SecurityInsights/bookmarks/relations/write | Updates a bookmark relation |
> | Microsoft.SecurityInsights/bookmarks/relations/delete | Deletes a bookmark relation |
> | Microsoft.SecurityInsights/businessApplicationAgents/read | Gets a Business Application Agent |
> | Microsoft.SecurityInsights/businessApplicationAgents/write | Create or Updates a Business Application Agent |
> | Microsoft.SecurityInsights/businessApplicationAgents/delete | Deletes a Business Application Agent |
> | Microsoft.SecurityInsights/businessApplicationAgents/systems/read | Gets a System of a Business Application Agent |
> | Microsoft.SecurityInsights/businessApplicationAgents/systems/write | Create or Updates a System of a Business Application Agent |
> | Microsoft.SecurityInsights/businessApplicationAgents/systems/delete | Deletes a System of a Business Application Agent |
> | Microsoft.SecurityInsights/businessApplicationAgents/systems/listActions/action | Lists the actions of a system |
> | Microsoft.SecurityInsights/businessApplicationAgents/systems/reportActionStatus/action | Reports the status of an action |
> | Microsoft.SecurityInsights/businessApplicationAgents/systems/undoAction/action | Undoes an action |
> | Microsoft.SecurityInsights/cases/read | Gets a case |
> | Microsoft.SecurityInsights/cases/write | Updates a case |
> | Microsoft.SecurityInsights/cases/delete | Deletes a case |
> | Microsoft.SecurityInsights/cases/comments/read | Gets the case comments |
> | Microsoft.SecurityInsights/cases/comments/write | Creates the case comments |
> | Microsoft.SecurityInsights/cases/investigations/read | Gets the case investigations |
> | Microsoft.SecurityInsights/cases/investigations/write | Updates the metadata of a case |
> | Microsoft.SecurityInsights/ConfidentialWatchlists/read | Gets Confidential Watchlists |
> | Microsoft.SecurityInsights/ConfidentialWatchlists/write | Creates Confidential Watchlists |
> | Microsoft.SecurityInsights/ConfidentialWatchlists/delete | Deletes Confidential Watchlists |
> | Microsoft.SecurityInsights/ContentPackages/read | Read Installed Content Packages. |
> | Microsoft.SecurityInsights/ContentPackages/write | Install Content Packages. |
> | Microsoft.SecurityInsights/ContentPackages/delete | Delete Installed Content Packages. |
> | Microsoft.SecurityInsights/ContentProductPackages/read | Read Available Product Packages |
> | Microsoft.SecurityInsights/ContentProductTemplates/read | Read Available Product Templates |
> | Microsoft.SecurityInsights/ContentTemplates/write | Install Content Templates. |
> | Microsoft.SecurityInsights/ContentTemplates/read | Read installed Content Templates. |
> | Microsoft.SecurityInsights/ContentTemplates/delete | Delete Installed Content Templates. |
> | Microsoft.SecurityInsights/dataConnectors/read | Gets the data connectors |
> | Microsoft.SecurityInsights/dataConnectors/write | Updates a data connector |
> | Microsoft.SecurityInsights/dataConnectors/delete | Deletes a data connector |
> | Microsoft.SecurityInsights/enrichment/domain/whois/read | Get whois enrichment for a domain |
> | Microsoft.SecurityInsights/enrichment/ip/geodata/read | Get geodata enrichment for an IP |
> | Microsoft.SecurityInsights/entities/read | Gets the sentinel entities graph |
> | Microsoft.SecurityInsights/entities/gettimeline/action | Gets entity timeline for a specific range |
> | Microsoft.SecurityInsights/entities/getInsights/action | Gets entity Insights for a specific range |
> | Microsoft.SecurityInsights/entities/runPlaybook/action | Run playbook on entity |
> | Microsoft.SecurityInsights/entities/relations/read | Gets a relation between the entity and related resources |
> | Microsoft.SecurityInsights/entities/relations/write | Updates a relation between the entity and related resources |
> | Microsoft.SecurityInsights/entities/relations/delete | Deletes a relation between the entity and related resources |
> | Microsoft.SecurityInsights/entityQueries/read | Gets the investigation expansions for entities |
> | Microsoft.SecurityInsights/ExportConnections/read | Read ExportConnections |
> | Microsoft.SecurityInsights/ExportConnections/write | write ExportConnections |
> | Microsoft.SecurityInsights/ExportConnections/delete | Delete ExportConnections |
> | Microsoft.SecurityInsights/ExportConnections/ExportJobs/read | Read ExportJobs |
> | Microsoft.SecurityInsights/ExportConnections/ExportJobs/write | write ExportJobs |
> | Microsoft.SecurityInsights/ExportConnections/ExportJobs/delete | Delete ExportJobs |
> | Microsoft.SecurityInsights/fileimports/read | Reads File Import objects |
> | Microsoft.SecurityInsights/fileimports/write | Creates or updates a File Import |
> | Microsoft.SecurityInsights/fileimports/delete | Deletes a File Import |
> | Microsoft.SecurityInsights/hunts/read | Get Hunts |
> | Microsoft.SecurityInsights/hunts/write | Create Hunts |
> | Microsoft.SecurityInsights/hunts/delete | Deletes Hunts |
> | Microsoft.SecurityInsights/hunts/comments/read | Get Hunt Comments |
> | Microsoft.SecurityInsights/hunts/comments/write | Create Hunt Comments |
> | Microsoft.SecurityInsights/hunts/comments/delete | Deletes Hunt Comments |
> | Microsoft.SecurityInsights/hunts/relations/read | Get Hunt Relations |
> | Microsoft.SecurityInsights/hunts/relations/write | Create Hunt Relations |
> | Microsoft.SecurityInsights/hunts/relations/delete | Deletes Hunt Relations |
> | Microsoft.SecurityInsights/incidents/read | Gets an incident |
> | Microsoft.SecurityInsights/incidents/write | Updates an incident |
> | Microsoft.SecurityInsights/incidents/delete | Deletes an incident |
> | Microsoft.SecurityInsights/incidents/createTeam/action | Creates a Microsoft team to investigate the incident by sharing information and insights between participants |
> | Microsoft.SecurityInsights/incidents/runPlaybook/action | Run playbook on incident |
> | Microsoft.SecurityInsights/incidents/comments/read | Gets the incident comments |
> | Microsoft.SecurityInsights/incidents/comments/write | Creates a comment on the incident |
> | Microsoft.SecurityInsights/incidents/comments/delete | Deletes a comment on the incident |
> | Microsoft.SecurityInsights/incidents/relations/read | Gets a relation between the incident and related resources |
> | Microsoft.SecurityInsights/incidents/relations/write | Updates a relation between the incident and related resources |
> | Microsoft.SecurityInsights/incidents/relations/delete | Deletes a relation between the incident and related resources |
> | Microsoft.SecurityInsights/incidents/tasks/read | Gets a task on the incident |
> | Microsoft.SecurityInsights/incidents/tasks/write | Updates a task on the incident |
> | Microsoft.SecurityInsights/incidents/tasks/delete | Deletes a task on the incident |
> | Microsoft.SecurityInsights/Metadata/read | Read Metadata for Sentinel content. |
> | Microsoft.SecurityInsights/Metadata/write | Write Metadata for Sentinel content. |
> | Microsoft.SecurityInsights/Metadata/delete | Delete Metadata for Sentinel content. |
> | Microsoft.SecurityInsights/officeConsents/read | Gets consents from Microsoft Office |
> | Microsoft.SecurityInsights/officeConsents/delete | Deletes consents from Microsoft Office |
> | Microsoft.SecurityInsights/onboardingStates/read | Gets an onboarding state |
> | Microsoft.SecurityInsights/onboardingStates/write | Updates an onboarding state |
> | Microsoft.SecurityInsights/onboardingStates/delete | Deletes an onboarding state |
> | Microsoft.SecurityInsights/operations/read | Gets operations |
> | Microsoft.SecurityInsights/securityMLAnalyticsSettings/read | Gets the analytics settings |
> | Microsoft.SecurityInsights/securityMLAnalyticsSettings/write | Update the analytics settings |
> | Microsoft.SecurityInsights/securityMLAnalyticsSettings/delete | Delete an analytics setting |
> | Microsoft.SecurityInsights/settings/read | Gets settings |
> | Microsoft.SecurityInsights/settings/write | Updates settings |
> | Microsoft.SecurityInsights/settings/delete | Deletes setting |
> | Microsoft.SecurityInsights/SourceControls/read | Read SourceControls |
> | Microsoft.SecurityInsights/SourceControls/write | write SourceControls |
> | Microsoft.SecurityInsights/SourceControls/delete | Delete SourceControls |
> | Microsoft.SecurityInsights/threatintelligence/read | Gets Threat Intelligence |
> | Microsoft.SecurityInsights/threatintelligence/write | Updates Threat Intelligence |
> | Microsoft.SecurityInsights/threatintelligence/delete | Deletes Threat Intelligence |
> | Microsoft.SecurityInsights/threatintelligence/query/action | Query Threat Intelligence |
> | Microsoft.SecurityInsights/threatintelligence/metrics/action | Collect Threat Intelligence Metrics |
> | Microsoft.SecurityInsights/threatintelligence/bulkDelete/action | Bulk Delete Threat Intelligence |
> | Microsoft.SecurityInsights/threatintelligence/bulkTag/action | Bulk Tags Threat Intelligence |
> | Microsoft.SecurityInsights/threatintelligence/createIndicator/action | Create Threat Intelligence Indicator |
> | Microsoft.SecurityInsights/threatintelligence/queryIndicators/action | Query Threat Intelligence Indicators |
> | Microsoft.SecurityInsights/threatintelligence/bulkactions/read | Reads TI Bulk Action objects |
> | Microsoft.SecurityInsights/threatintelligence/bulkactions/write | Creates or updates a TI Bulk Action |
> | Microsoft.SecurityInsights/threatintelligence/bulkactions/delete | Deletes a TI Bulk Action |
> | Microsoft.SecurityInsights/threatintelligence/bulkactions/query/action | Query Threat Intelligence STIX objects |
> | Microsoft.SecurityInsights/threatintelligence/bulkactions/count/action | Query Threat Intelligence STIX object count |
> | Microsoft.SecurityInsights/threatintelligence/indicators/write | Updates Threat Intelligence Indicators |
> | Microsoft.SecurityInsights/threatintelligence/indicators/delete | Deletes Threat Intelligence Indicators |
> | Microsoft.SecurityInsights/threatintelligence/indicators/query/action | Query Threat Intelligence Indicators |
> | Microsoft.SecurityInsights/threatintelligence/indicators/metrics/action | Get Threat Intelligence Indicator Metrics |
> | Microsoft.SecurityInsights/threatintelligence/indicators/bulkDelete/action | Bulk Delete Threat Intelligence Indicators |
> | Microsoft.SecurityInsights/threatintelligence/indicators/bulkTag/action | Bulk Tags Threat Intelligence Indicators |
> | Microsoft.SecurityInsights/threatintelligence/indicators/read | Gets Threat Intelligence Indicators |
> | Microsoft.SecurityInsights/threatintelligence/indicators/appendTags/action | Append tags to Threat Intelligence Indicator |
> | Microsoft.SecurityInsights/threatintelligence/indicators/replaceTags/action | Replace Tags of Threat Intelligence Indicator |
> | Microsoft.SecurityInsights/threatintelligence/ingestionrulelist/read | Reads the set of TI Ingestion Rule objects |
> | Microsoft.SecurityInsights/threatintelligence/ingestionrulelist/write | Creates or updates a set of TI Ingestion Rules |
> | Microsoft.SecurityInsights/threatintelligence/metrics/read | Collect Threat Intelligence Metrics |
> | Microsoft.SecurityInsights/threatintelligence/threatactors/read | Reads TI Threat Actor objects |
> | Microsoft.SecurityInsights/threatintelligence/threatactors/write | Creates or updates a TI Threat Actor |
> | Microsoft.SecurityInsights/threatintelligence/threatactors/delete | Deletes a TI Threat Actor |
> | Microsoft.SecurityInsights/triggeredAnalyticsRuleRuns/read | Gets the triggered analytics rule runs |
> | Microsoft.SecurityInsights/Watchlists/read | Gets Watchlists |
> | Microsoft.SecurityInsights/Watchlists/write | Create Watchlists |
> | Microsoft.SecurityInsights/Watchlists/delete | Deletes Watchlists |
> | Microsoft.SecurityInsights/WorkspaceManagerAssignments/read | Gets WorkspaceManager Assignments |
> | Microsoft.SecurityInsights/WorkspaceManagerAssignments/write | Creates WorkspaceManager Assignments |
> | Microsoft.SecurityInsights/WorkspaceManagerAssignments/delete | Deletes WorkspaceManager Assignments |
> | Microsoft.SecurityInsights/workspaceManagerAssignments/jobs/read | Gets WorkspaceManagerAssignments jobs |
> | Microsoft.SecurityInsights/workspaceManagerAssignments/jobs/write | Creates WorkspaceManagerAssignments jobs |
> | Microsoft.SecurityInsights/workspaceManagerAssignments/jobs/delete | Deletes WorkspaceManagerAssignments jobs |
> | Microsoft.SecurityInsights/WorkspaceManagerConfigurations/read | Gets WorkspaceManager Configurations |
> | Microsoft.SecurityInsights/WorkspaceManagerConfigurations/write | Creates WorkspaceManager Configurations |
> | Microsoft.SecurityInsights/WorkspaceManagerConfigurations/delete | Deletes WorkspaceManager Configurations |
> | Microsoft.SecurityInsights/WorkspaceManagerGroups/read | Gets WorkspaceManager Groups |
> | Microsoft.SecurityInsights/WorkspaceManagerGroups/write | Creates WorkspaceManager Groups |
> | Microsoft.SecurityInsights/WorkspaceManagerGroups/delete | Deletes WorkspaceManager Groups |
> | Microsoft.SecurityInsights/WorkspaceManagerMembers/read | Gets WorkspaceManager Members |
> | Microsoft.SecurityInsights/WorkspaceManagerMembers/write | Creates WorkspaceManager Members |
> | Microsoft.SecurityInsights/WorkspaceManagerMembers/delete | Deletes WorkspaceManager Members |

## Next steps

- [Azure resource providers and types](/azure/azure-resource-manager/management/resource-providers-and-types)