---
title: Azure permissions for Storage - Azure RBAC
description: Lists the permissions for the Azure resource providers in the Storage category.
ms.service: role-based-access-control
ms.topic: reference
author: rolyon
manager: amycolannino
ms.author: rolyon
ms.date: 04/25/2024
ms.custom: generated
---

# Azure permissions for Storage

This article lists the permissions for the Azure resource providers in the Storage category. You can use these permissions in your own [Azure custom roles](/azure/role-based-access-control/custom-roles) to provide granular access control to resources in Azure. Permission strings have the following format: `{Company}.{ProviderName}/{resourceType}/{action}`


## Microsoft.ClassicStorage

Azure service: Classic deployment model storage

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.ClassicStorage/register/action | Register to Classic Storage |
> | Microsoft.ClassicStorage/checkStorageAccountAvailability/action | Checks for the availability of a storage account. |
> | Microsoft.ClassicStorage/capabilities/read | Shows the capabilities |
> | Microsoft.ClassicStorage/checkStorageAccountAvailability/read | Get the availability of a storage account. |
> | Microsoft.ClassicStorage/disks/read | Returns the storage account disk. |
> | Microsoft.ClassicStorage/images/read | Returns the image. |
> | Microsoft.ClassicStorage/images/operationstatuses/read | Gets Image Operation Status. |
> | Microsoft.ClassicStorage/operations/read | Gets classic storage operations |
> | Microsoft.ClassicStorage/osImages/read | Returns the operating system image. |
> | Microsoft.ClassicStorage/osPlatformImages/read | Gets the operating system platform image. |
> | Microsoft.ClassicStorage/publicImages/read | Gets the public virtual machine image. |
> | Microsoft.ClassicStorage/quotas/read | Get the quota for the subscription. |
> | Microsoft.ClassicStorage/storageAccounts/read | Return the storage account with the given account. |
> | Microsoft.ClassicStorage/storageAccounts/write | Adds a new storage account. |
> | Microsoft.ClassicStorage/storageAccounts/delete | Delete the storage account. |
> | Microsoft.ClassicStorage/storageAccounts/listKeys/action | Lists the access keys for the storage accounts. |
> | Microsoft.ClassicStorage/storageAccounts/regenerateKey/action | Regenerates the existing access keys for the storage account. |
> | Microsoft.ClassicStorage/storageAccounts/validateMigration/action | Validates migration of a storage account. |
> | Microsoft.ClassicStorage/storageAccounts/prepareMigration/action | Prepares migration of a storage account. |
> | Microsoft.ClassicStorage/storageAccounts/commitMigration/action | Commits migration of a storage account. |
> | Microsoft.ClassicStorage/storageAccounts/abortMigration/action | Aborts migration of a storage account. |
> | Microsoft.ClassicStorage/storageAccounts/blobServices/providers/Microsoft.Insights/diagnosticSettings/read | Get the diagnostics settings. |
> | Microsoft.ClassicStorage/storageAccounts/blobServices/providers/Microsoft.Insights/diagnosticSettings/write | Add or modify diagnostics settings. |
> | Microsoft.ClassicStorage/storageAccounts/blobServices/providers/Microsoft.Insights/metricDefinitions/read | Gets the metrics definitions. |
> | Microsoft.ClassicStorage/storageAccounts/disks/read | Returns the storage account disk. |
> | Microsoft.ClassicStorage/storageAccounts/disks/write | Adds a storage account disk. |
> | Microsoft.ClassicStorage/storageAccounts/disks/delete | Deletes a given storage account  disk. |
> | Microsoft.ClassicStorage/storageAccounts/disks/operationStatuses/read | Reads the operation status for the resource. |
> | Microsoft.ClassicStorage/storageAccounts/fileServices/providers/Microsoft.Insights/diagnosticSettings/read | Get the diagnostics settings. |
> | Microsoft.ClassicStorage/storageAccounts/fileServices/providers/Microsoft.Insights/diagnosticSettings/write | Add or modify diagnostics settings. |
> | Microsoft.ClassicStorage/storageAccounts/fileServices/providers/Microsoft.Insights/metricDefinitions/read | Gets the metrics definitions. |
> | Microsoft.ClassicStorage/storageAccounts/images/read | Returns the storage account image. (Deprecated. Use 'Microsoft.ClassicStorage/storageAccounts/vmImages') |
> | Microsoft.ClassicStorage/storageAccounts/images/delete | Deletes a given storage account image. (Deprecated. Use 'Microsoft.ClassicStorage/storageAccounts/vmImages') |
> | Microsoft.ClassicStorage/storageAccounts/images/operationstatuses/read | Returns the storage account image operation status. |
> | Microsoft.ClassicStorage/storageAccounts/operationStatuses/read | Reads the operation status for the resource. |
> | Microsoft.ClassicStorage/storageAccounts/osImages/read | Returns the storage account operating system image. |
> | Microsoft.ClassicStorage/storageAccounts/osImages/write | Adds a given storage account operating system image. |
> | Microsoft.ClassicStorage/storageAccounts/osImages/delete | Deletes a given storage account operating system image. |
> | Microsoft.ClassicStorage/storageAccounts/providers/Microsoft.Insights/diagnosticSettings/read | Get the diagnostics settings. |
> | Microsoft.ClassicStorage/storageAccounts/providers/Microsoft.Insights/diagnosticSettings/write | Add or modify diagnostics settings. |
> | Microsoft.ClassicStorage/storageAccounts/providers/Microsoft.Insights/metricDefinitions/read | Gets the metrics definitions. |
> | Microsoft.ClassicStorage/storageAccounts/queueServices/providers/Microsoft.Insights/diagnosticSettings/read | Get the diagnostics settings. |
> | Microsoft.ClassicStorage/storageAccounts/queueServices/providers/Microsoft.Insights/diagnosticSettings/write | Add or modify diagnostics settings. |
> | Microsoft.ClassicStorage/storageAccounts/queueServices/providers/Microsoft.Insights/metricDefinitions/read | Gets the metrics definitions. |
> | Microsoft.ClassicStorage/storageAccounts/services/read | Get the available services. |
> | Microsoft.ClassicStorage/storageAccounts/services/diagnosticSettings/read | Get the diagnostics settings. |
> | Microsoft.ClassicStorage/storageAccounts/services/diagnosticSettings/write | Add or modify diagnostics settings. |
> | Microsoft.ClassicStorage/storageAccounts/services/metricDefinitions/read | Gets the metrics definitions. |
> | Microsoft.ClassicStorage/storageAccounts/services/metrics/read | Gets the metrics. |
> | Microsoft.ClassicStorage/storageAccounts/tableServices/providers/Microsoft.Insights/diagnosticSettings/read | Get the diagnostics settings. |
> | Microsoft.ClassicStorage/storageAccounts/tableServices/providers/Microsoft.Insights/diagnosticSettings/write | Add or modify diagnostics settings. |
> | Microsoft.ClassicStorage/storageAccounts/tableServices/providers/Microsoft.Insights/metricDefinitions/read | Gets the metrics definitions. |
> | Microsoft.ClassicStorage/storageAccounts/vmImages/read | Returns the virtual machine image. |
> | Microsoft.ClassicStorage/storageAccounts/vmImages/write | Adds a given virtual machine image. |
> | Microsoft.ClassicStorage/storageAccounts/vmImages/delete | Deletes a given virtual machine image. |
> | Microsoft.ClassicStorage/storageAccounts/vmImages/operationstatuses/read | Gets a given virtual machine image operation status. |
> | Microsoft.ClassicStorage/vmImages/read | Lists virtual machine images. |

## Microsoft.DataShare

A simple and safe service for sharing big data with external organizations.

Azure service: [Azure Data Share](/azure/data-share/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.DataShare/register/action | Register the subscription for the Data Share Resource Provider. |
> | Microsoft.DataShare/unregister/action | Unregister the subscription for the Data Share Resource Provider. |
> | Microsoft.DataShare/accounts/read | Reads a Data Share Account. |
> | Microsoft.DataShare/accounts/write | Writes a Data Share Account. |
> | Microsoft.DataShare/accounts/delete | Deletes a Data Share Account. |
> | Microsoft.DataShare/accounts/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource. |
> | Microsoft.DataShare/accounts/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource. |
> | Microsoft.DataShare/accounts/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for account. |
> | Microsoft.DataShare/accounts/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for account. |
> | Microsoft.DataShare/accounts/shares/read | Reads a Data Share Share. |
> | Microsoft.DataShare/accounts/shares/write | Writes a Data Share Share. |
> | Microsoft.DataShare/accounts/shares/delete | Deletes a Data Share Share. |
> | Microsoft.DataShare/accounts/shares/listSynchronizations/action | Action For Data Share ListSynchronization. |
> | Microsoft.DataShare/accounts/shares/listSynchronizationDetails/action | Action For Data Share ListSynchronization details. |
> | Microsoft.DataShare/accounts/shares/dataSets/read | Reads a DataSet. |
> | Microsoft.DataShare/accounts/shares/dataSets/write | Create a Data Share DataSet. |
> | Microsoft.DataShare/accounts/shares/dataSets/delete | Deletes a Data Share DataSet. |
> | Microsoft.DataShare/accounts/shares/invitations/read | Reads a Data Share Invitation. |
> | Microsoft.DataShare/accounts/shares/invitations/write | Writes a Data Share Invitation. |
> | Microsoft.DataShare/accounts/shares/invitations/delete | Deletes a Data Share Invitation. |
> | Microsoft.DataShare/accounts/shares/operationResults/read | Reads a Data Share Share. |
> | Microsoft.DataShare/accounts/shares/providerShareSubscriptions/read | Reads a Data Share Provider ShareSubscription. |
> | Microsoft.DataShare/accounts/shares/providerShareSubscriptions/revoke/action | Revokes a Data Share Subscription. |
> | Microsoft.DataShare/accounts/shares/providerShareSubscriptions/reinstate/action | Reinstates a Data Share Subscription. |
> | Microsoft.DataShare/accounts/shares/synchronizationSettings/read | Reads a Data Share Synchronization Setting. |
> | Microsoft.DataShare/accounts/shares/synchronizationSettings/write | Writes a Data Share Synchronization Setting. |
> | Microsoft.DataShare/accounts/shares/synchronizationSettings/delete | Delete a Data Share Synchronization Setting. |
> | Microsoft.DataShare/accounts/shareSubscriptions/cancelSynchronization/action | Cancels a Data Share Synchronization. |
> | Microsoft.DataShare/accounts/shareSubscriptions/delete | Deletes a Data Share Share Subscription. |
> | Microsoft.DataShare/accounts/shareSubscriptions/listSourceShareSynchronizationSettings/action | List Data Share Source Share SynchronizationSettings. |
> | Microsoft.DataShare/accounts/shareSubscriptions/listSynchronizationDetails/action | List Data Share Synchronization Details. |
> | Microsoft.DataShare/accounts/shareSubscriptions/listSynchronizations/action | List Data Share Synchronizations. |
> | Microsoft.DataShare/accounts/shareSubscriptions/read | Reads a Data Share ShareSubscription. |
> | Microsoft.DataShare/accounts/shareSubscriptions/synchronize/action | Initialize a Data Share Synchronize operation. |
> | Microsoft.DataShare/accounts/shareSubscriptions/write | Writes a Data Share ShareSubscription. |
> | Microsoft.DataShare/accounts/shareSubscriptions/consumerSourceDataSets/read | Reads a Data Share Consumer Source DataSet. |
> | Microsoft.DataShare/accounts/shareSubscriptions/dataSetMappings/delete | Deletes a Data Share DataSetMapping. |
> | Microsoft.DataShare/accounts/shareSubscriptions/dataSetMappings/write | Write a Data Share DataSetMapping. |
> | Microsoft.DataShare/accounts/shareSubscriptions/dataSetMappings/read | Read a Data Share DataSetMapping. |
> | Microsoft.DataShare/accounts/shareSubscriptions/operationResults/read | Reads a Data Share ShareSubscription long running operation status. |
> | Microsoft.DataShare/accounts/shareSubscriptions/shareSubscriptionSynchronizations/read | Reads a Data Share Share Subscription Synchronization. |
> | Microsoft.DataShare/accounts/shareSubscriptions/synchronizationOperationResults/read | Reads a Data Share Synchronization Operation Result. |
> | Microsoft.DataShare/accounts/shareSubscriptions/triggers/read | Reads a Data Share Trigger. |
> | Microsoft.DataShare/accounts/shareSubscriptions/triggers/write | Write a Data Share Trigger. |
> | Microsoft.DataShare/accounts/shareSubscriptions/triggers/delete | Delete a Data Share Trigger. |
> | Microsoft.DataShare/listInvitations/read | Reads Invitations at a tenant level. |
> | Microsoft.DataShare/locations/rejectInvitation/action | Rejects a Data Share Invitation. |
> | Microsoft.DataShare/locations/consumerInvitations/read | Gets a Data Share Consumer Invitation. |
> | Microsoft.DataShare/locations/operationResults/read | Reads the locations Data Share is supported in. |
> | Microsoft.DataShare/operations/read | Reads all available operations in Data Share Resource Provider. |

## Microsoft.ElasticSan

Azure service: [Azure Elastic SAN](/azure/storage/elastic-san/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.ElasticSan/register/action | Registers the subscription for the ElasticSan resource provider and enables the creation of san accounts. |
> | Microsoft.ElasticSan/elasticSans/PrivateEndpointConnectionsApproval/action |  |
> | Microsoft.ElasticSan/elasticSans/read | List ElasticSans by Resource Group |
> | Microsoft.ElasticSan/elasticSans/read | List ElasticSans by Subscription |
> | Microsoft.ElasticSan/elasticSans/delete | Delete ElasticSan |
> | Microsoft.ElasticSan/elasticSans/read | Get Elastic San |
> | Microsoft.ElasticSan/elasticSans/write | Create/Update Elastic San |
> | Microsoft.ElasticSan/elasticSans/privateEndpointConnectionProxies/write |  |
> | Microsoft.ElasticSan/elasticSans/privateEndpointConnectionProxies/validate/action |  |
> | Microsoft.ElasticSan/elasticSans/privateEndpointConnectionProxies/delete |  |
> | Microsoft.ElasticSan/elasticSans/privateEndpointConnectionProxies/read |  |
> | Microsoft.ElasticSan/elasticSans/privateEndpointConnections/write |  |
> | Microsoft.ElasticSan/elasticSans/privateEndpointConnections/delete |  |
> | Microsoft.ElasticSan/elasticSans/privateEndpoints/move/action |  |
> | Microsoft.ElasticSan/elasticSans/privateLinkResources/read |  |
> | Microsoft.ElasticSan/elasticSans/volumeGroups/read | List VolumeGroups by ElasticSan |
> | Microsoft.ElasticSan/elasticSans/volumeGroups/delete | Delete Volume Group |
> | Microsoft.ElasticSan/elasticSans/volumeGroups/read | Get Volume Group |
> | Microsoft.ElasticSan/elasticSans/volumeGroups/write | Create/Update Volume Group |
> | Microsoft.ElasticSan/elasticSans/volumeGroups/snapshots/beginGetAccess/action |  |
> | Microsoft.ElasticSan/elasticSans/volumeGroups/snapshots/read |  |
> | Microsoft.ElasticSan/elasticSans/volumeGroups/snapshots/delete | Delete Volume Snapshot |
> | Microsoft.ElasticSan/elasticSans/volumeGroups/snapshots/write |  |
> | Microsoft.ElasticSan/elasticSans/volumeGroups/snapshots/read | Get Volume Snapshot |
> | Microsoft.ElasticSan/elasticSans/volumeGroups/volumes/delete | Delete Volume |
> | Microsoft.ElasticSan/elasticSans/volumeGroups/volumes/read | List Volumes by Volume Group |
> | Microsoft.ElasticSan/elasticSans/volumeGroups/volumes/write | Create/Update Volume |
> | Microsoft.ElasticSan/elasticSans/volumeGroups/volumes/read | Get Volume |
> | Microsoft.ElasticSan/locations/asyncoperations/read | Polls the status of an asynchronous operation. |
> | Microsoft.ElasticSan/operations/read | List the operations supported by Microsoft.ElasticSan |
> | Microsoft.ElasticSan/skus/read | Get Sku |

## Microsoft.NetApp

Enterprise-grade Azure file shares, powered by NetApp.

Azure service: [Azure NetApp Files](/azure/azure-netapp-files/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.NetApp/register/action | Subscription Registration Action |
> | Microsoft.NetApp/unregister/action | Unregisters Subscription with Microsoft.NetApp resource provider |
> | Microsoft.NetApp/locations/read | Reads a location wide operation. |
> | Microsoft.NetApp/locations/checknameavailability/action | Check if resource name is available |
> | Microsoft.NetApp/locations/checkfilepathavailability/action | Check if file path is available |
> | Microsoft.NetApp/locations/checkquotaavailability/action | Check if a quota is available. |
> | Microsoft.NetApp/locations/queryNetworkSiblingSet/action | Query Network sibling set. |
> | Microsoft.NetApp/locations/updateNetworkSiblingSet/action | Query Network sibling set. |
> | Microsoft.NetApp/locations/operationresults/read | Reads an operation result resource. |
> | Microsoft.NetApp/locations/quotaLimits/read | Reads a Quotalimit resource type. |
> | Microsoft.NetApp/locations/regionInfo/read | Reads a regionInfo resource. |
> | Microsoft.NetApp/locations/regionInfos/read | Reads a arm compliant regionInfos resource |
> | Microsoft.NetApp/netAppAccounts/read | Reads an account resource. |
> | Microsoft.NetApp/netAppAccounts/write | Writes an account resource. |
> | Microsoft.NetApp/netAppAccounts/delete | Deletes an account resource. |
> | Microsoft.NetApp/netAppAccounts/renewCredentials/action | Renews MSI credentials of account, if account has MSI credentials that are due for renewal. |
> | Microsoft.NetApp/netAppAccounts/migrateBackups/action | Migrate Account Backups to BackupVault. |
> | Microsoft.NetApp/netAppAccounts/changeKeyVault/action | Change an account's existing AKV/HSM encryption with another instance of either AKV/HSM. |
> | Microsoft.NetApp/netAppAccounts/getKeyVaultStatus/action | Get an account's key vault information, including subnet and private endpoint encryption pairs that have access to the key vault. |
> | Microsoft.NetApp/netAppAccounts/migrateEncryption/action | Migrate volumes under an encryption sibling set from Microsoft-managed key to Customer-managed key or vice versa. |
> | Microsoft.NetApp/netAppAccounts/accountBackups/read | Reads an account backup resource. |
> | Microsoft.NetApp/netAppAccounts/accountBackups/write | Writes an account backup resource. |
> | Microsoft.NetApp/netAppAccounts/accountBackups/delete | Deletes an account backup resource. |
> | Microsoft.NetApp/netAppAccounts/backupPolicies/read | Reads a backup policy resource. |
> | Microsoft.NetApp/netAppAccounts/backupPolicies/write | Writes a backup policy resource. |
> | Microsoft.NetApp/netAppAccounts/backupPolicies/delete | Deletes a backup policy resource. |
> | Microsoft.NetApp/netAppAccounts/backupVaults/read | Reads a Backup Vault resource. |
> | Microsoft.NetApp/netAppAccounts/backupVaults/write | Writes a Backup Vault resource. |
> | Microsoft.NetApp/netAppAccounts/backupVaults/delete | Deletes a Backup Vault Resource. |
> | Microsoft.NetApp/netAppAccounts/backupVaults/backups/read | Reads a backup resource. |
> | Microsoft.NetApp/netAppAccounts/backupVaults/backups/write | Writes a backup resource. |
> | Microsoft.NetApp/netAppAccounts/backupVaults/backups/delete | Deletes a backup resource. |
> | Microsoft.NetApp/netAppAccounts/backupVaults/backups/restoreFiles/action | Restores files from a backup resource |
> | Microsoft.NetApp/netAppAccounts/capacityPools/read | Reads a pool resource. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/write | Writes a pool resource. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/delete | Deletes a pool resource. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/providers/Microsoft.Insights/logDefinitions/read | Gets the log definitions for the resource. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for Volume resource. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/read | Reads a volume resource. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/write | Writes a volume resource. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/delete | Deletes a volume resource. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/revert/action | Revert volume to specific snapshot |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/resetCifsPassword/action | Reset cifs password from specific volume. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/breakReplication/action | Break volume replication relations |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/listReplications/action | A list of replications |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/reInitializeReplication/action | Attempts to re-initialize an uninitialized replication |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/authorizeReplication/action | Authorize the source volume replication |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/resyncReplication/action | Resync the replication on the destination volume |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/deleteReplication/action | Delete the replication on the destination volume |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/poolChange/action | Moves volume to another pool. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/relocate/action | Relocate volume to a new stamp. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/finalizeRelocation/action | Finalize relocation by cleaning up the old volume. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/revertRelocation/action | Revert the relocation and revert back to the old volume. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/breakFileLocks/action | Breaks file locks on a volume |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/migrateBackups/action | Migrate Volume Backups to BackupVault. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/populateAvailabilityZone/action | Populates logical availability zone for a volume in a zone aware region and storage. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/getGroupIdListForLdapUser/action | Get group Id list for a given user for an Ldap enabled volume |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/splitCloneFromParent/action | Split clone from parent volume to make it a standalone volume |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/reestablishReplication/action | Re-establish a previously deleted replication between 2 volumes that have a common ad-hoc or policy-based snapshots |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/peerClusterForOnPremMigration/action | Peers ANF cluster to OnPrem cluster for migration |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/createOnPremMigrationReplication/action | Starts a SVM peering and returns a command to be run on the external ontap to accept it. Once the SVMs have been peered a SnapMirror will be created. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/performReplicationTransfer/action | Starts a data transfer on the volume replication. Updating the data on the destination side. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/finalizeOnPremMigration/action | Finalize OnPrem migration by doing a final sync on the replication, break and release the replication and break cluster peering if no other migration is active. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/backups/read | Reads a backup resource. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/backups/write | Writes a backup resource. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/backups/delete | Deletes a backup resource. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/backups/restoreFiles/action | Restores files from a backup resource |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/backupStatus/read | Get the status of the backup for a volume |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/latestBackupStatus/current/read | Get the status of the backup for a volume |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/latestRestoreStatus/current/read | Get the status of the restore for a volume |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/mountTargets/read | Reads a mount target resource. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for Volume resource. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/replicationStatus/read | Reads the statuses of the Volume Replication. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/restoreStatus/read | Get the status of the restore for a volume |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/snapshots/read | Reads a snapshot resource. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/snapshots/write | Writes a snapshot resource. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/snapshots/delete | Deletes a snapshot resource. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/snapshots/restoreFiles/action | Restores files from a snapshot resource |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/subvolumes/read | Read a sub volume resource. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/subvolumes/write | Write a sub volume resource. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/subvolumes/delete | Delete a sub volume resource. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/subvolumes/getMetadata/action | Read sub volume metadata resource. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/volumeQuotaRules/read | Reads a Volume quota rule resource. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/volumeQuotaRules/write | Writes Volume quota rule resource. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/volumeQuotaRules/delete | Deletes a Volume quota rule resource. |
> | Microsoft.NetApp/netAppAccounts/snapshotPolicies/read | Reads a snapshot policy resource. |
> | Microsoft.NetApp/netAppAccounts/snapshotPolicies/write | Writes a snapshot policy resource. |
> | Microsoft.NetApp/netAppAccounts/snapshotPolicies/delete | Deletes a snapshot policy resource. |
> | Microsoft.NetApp/netAppAccounts/snapshotPolicies/listVolumes/read | List volumes connected to snapshot policy |
> | Microsoft.NetApp/netAppAccounts/snapshotPolicies/volumes/read | List volumes connected to snapshot policy |
> | Microsoft.NetApp/netAppAccounts/vaults/read | Reads a vault resource. |
> | Microsoft.NetApp/netAppAccounts/volumeGroups/read | Reads a volume group resource. |
> | Microsoft.NetApp/netAppAccounts/volumeGroups/write | Writes a volume group resource. |
> | Microsoft.NetApp/netAppAccounts/volumeGroups/delete | Deletes a volume group resource. |
> | Microsoft.NetApp/Operations/read | Reads an operation resources. |

## Microsoft.Storage

Get secure, massively scalable cloud storage for your data, apps, and workloads.

Azure service: [Storage](/azure/storage/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Storage/register/action | Registers the subscription for the storage resource provider and enables the creation of storage accounts. |
> | Microsoft.Storage/register/action |  |
> | Microsoft.Storage/checknameavailability/read | Checks that account name is valid and is not in use. |
> | Microsoft.Storage/deletedAccounts/read |  |
> | Microsoft.Storage/locations/deleteVirtualNetworkOrSubnets/action | Notifies Microsoft.Storage that virtual network or subnet is being deleted |
> | Microsoft.Storage/locations/notifyNetworkSecurityPerimeterUpdatesAvailable/action |  |
> | Microsoft.Storage/locations/previewActions/action |  |
> | Microsoft.Storage/locations/checknameavailability/read | Checks that account name is valid and is not in use. |
> | Microsoft.Storage/locations/usages/read | Returns the limit and the current usage count for resources in the specified subscription |
> | Microsoft.Storage/operations/read |  |
> | Microsoft.Storage/operations/read | Polls the status of an asynchronous operation. |
> | Microsoft.Storage/resilienciesProgressions/read |  |
> | Microsoft.Storage/skus/read | Lists the Skus supported by Microsoft.Storage. |
> | Microsoft.Storage/storageAccounts/updateAccountContainerHoldingPeriod/action |  |
> | Microsoft.Storage/storageAccounts/updateInternalProperties/action |  |
> | Microsoft.Storage/storageAccounts/consumerDataShare/action |  |
> | Microsoft.Storage/storageAccounts/hnsonmigration/action | Customer is able to abort an ongoing Hns migration on the storage account |
> | Microsoft.Storage/storageAccounts/hnsonmigration/action | Customer is able to migrate to hns account type |
> | Microsoft.Storage/storageAccounts/networkSecurityPerimeterConfigurations/action |  |
> | Microsoft.Storage/storageAccounts/restoreBlobRanges/action | Restore blob ranges to the state of the specified time |
> | Microsoft.Storage/storageAccounts/PrivateEndpointConnectionsApproval/action | Approve Private Endpoint Connections |
> | Microsoft.Storage/storageAccounts/failover/action | Customer is able to control the failover in case of availability issues |
> | Microsoft.Storage/storageAccounts/listkeys/action | Returns the access keys for the specified storage account. |
> | Microsoft.Storage/storageAccounts/regeneratekey/action | Regenerates the access keys for the specified storage account. |
> | Microsoft.Storage/storageAccounts/rotateKey/action |  |
> | Microsoft.Storage/storageAccounts/revokeUserDelegationKeys/action | Revokes all the user delegation keys for the specified storage account. |
> | Microsoft.Storage/storageAccounts/joinPerimeter/action | Access check for joining Network Security Perimeter |
> | Microsoft.Storage/storageAccounts/delete | Deletes an existing storage account. |
> | Microsoft.Storage/storageAccounts/read | Returns the list of storage accounts or gets the properties for the specified storage account. |
> | Microsoft.Storage/storageAccounts/listAccountSas/action | Returns the Account SAS token for the specified storage account. |
> | Microsoft.Storage/storageAccounts/listServiceSas/action | Returns the Service SAS token for the specified storage account. |
> | Microsoft.Storage/storageAccounts/write | Creates a storage account with the specified parameters or update the properties or tags or adds custom domain for the specified storage account. |
> | Microsoft.Storage/storageAccounts/accountLocks/deleteLock/action |  |
> | Microsoft.Storage/storageAccounts/accountLocks/read |  |
> | Microsoft.Storage/storageAccounts/accountLocks/write |  |
> | Microsoft.Storage/storageAccounts/accountLocks/delete |  |
> | Microsoft.Storage/storageAccounts/accountMigrations/read |  |
> | Microsoft.Storage/storageAccounts/accountMigrations/write | Customer is able to update their storage account redundancy for increased resiliency |
> | Microsoft.Storage/storageAccounts/blobServices/read | List blob services |
> | Microsoft.Storage/storageAccounts/blobServices/generateUserDelegationKey/action | Returns a user delegation key for the blob service |
> | Microsoft.Storage/storageAccounts/blobServices/write | Returns the result of put blob service properties |
> | Microsoft.Storage/storageAccounts/blobServices/read | Returns blob service properties or statistics |
> | Microsoft.Storage/storageAccounts/blobServices/containers/migrate/action |  |
> | Microsoft.Storage/storageAccounts/blobServices/containers/write | Returns the result of patch blob container |
> | Microsoft.Storage/storageAccounts/blobServices/containers/delete | Returns the result of deleting a container |
> | Microsoft.Storage/storageAccounts/blobServices/containers/read | Returns a container |
> | Microsoft.Storage/storageAccounts/blobServices/containers/read | Returns list of containers |
> | Microsoft.Storage/storageAccounts/blobServices/containers/lease/action | Returns the result of leasing blob container |
> | Microsoft.Storage/storageAccounts/blobServices/containers/write | Returns the result of put blob container |
> | Microsoft.Storage/storageAccounts/blobServices/containers/clearLegalHold/action | Clear blob container legal hold |
> | Microsoft.Storage/storageAccounts/blobServices/containers/setLegalHold/action | Set blob container legal hold |
> | Microsoft.Storage/storageAccounts/blobServices/containers/immutabilityPolicies/extend/action | Extend blob container immutability policy |
> | Microsoft.Storage/storageAccounts/blobServices/containers/immutabilityPolicies/delete | Delete blob container immutability policy |
> | Microsoft.Storage/storageAccounts/blobServices/containers/immutabilityPolicies/write | Put blob container immutability policy |
> | Microsoft.Storage/storageAccounts/blobServices/containers/immutabilityPolicies/lock/action | Lock blob container immutability policy |
> | Microsoft.Storage/storageAccounts/blobServices/containers/immutabilityPolicies/read | Get blob container immutability policy |
> | Microsoft.Storage/storageAccounts/blobServices/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource. |
> | Microsoft.Storage/storageAccounts/blobServices/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource. |
> | Microsoft.Storage/storageAccounts/blobServices/providers/Microsoft.Insights/logDefinitions/read | Gets the log definition for Blob |
> | Microsoft.Storage/storageAccounts/blobServices/providers/Microsoft.Insights/metricDefinitions/read | Get list of Microsoft Storage Metrics definitions. |
> | Microsoft.Storage/storageAccounts/consumerDataSharePolicies/read |  |
> | Microsoft.Storage/storageAccounts/consumerDataSharePolicies/write |  |
> | Microsoft.Storage/storageAccounts/dataSharePolicies/delete |  |
> | Microsoft.Storage/storageAccounts/dataSharePolicies/read |  |
> | Microsoft.Storage/storageAccounts/dataSharePolicies/write |  |
> | Microsoft.Storage/storageAccounts/encryptionScopes/read |  |
> | Microsoft.Storage/storageAccounts/encryptionScopes/write |  |
> | Microsoft.Storage/storageAccounts/encryptionScopes/hoboConfigurations/read |  |
> | Microsoft.Storage/storageAccounts/encryptionScopes/hoboConfigurations/write |  |
> | Microsoft.Storage/storageAccounts/fileServices/read | List file services |
> | Microsoft.Storage/storageAccounts/fileServices/write | Put file service properties |
> | Microsoft.Storage/storageAccounts/fileServices/read | Get file service properties |
> | Microsoft.Storage/storageAccounts/fileServices/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource. |
> | Microsoft.Storage/storageAccounts/fileServices/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource. |
> | Microsoft.Storage/storageAccounts/fileServices/providers/Microsoft.Insights/logDefinitions/read | Gets the log definition for File |
> | Microsoft.Storage/storageAccounts/fileServices/providers/Microsoft.Insights/metricDefinitions/read | Get list of Microsoft Storage Metrics definitions. |
> | Microsoft.Storage/storageAccounts/fileServices/shares/delete | Delete file share |
> | Microsoft.Storage/storageAccounts/fileServices/shares/read | Get file share |
> | Microsoft.Storage/storageAccounts/fileServices/shares/lease/action |  |
> | Microsoft.Storage/storageAccounts/fileServices/shares/read | List file shares |
> | Microsoft.Storage/storageAccounts/fileServices/shares/write | Create or update file share |
> | Microsoft.Storage/storageAccounts/fileServices/shares/restore/action | Restore file share |
> | Microsoft.Storage/storageAccounts/hoboConfigurations/read |  |
> | Microsoft.Storage/storageAccounts/hoboConfigurations/write |  |
> | Microsoft.Storage/storageAccounts/inventoryPolicies/delete |  |
> | Microsoft.Storage/storageAccounts/inventoryPolicies/read |  |
> | Microsoft.Storage/storageAccounts/inventoryPolicies/write |  |
> | Microsoft.Storage/storageAccounts/localUsers/delete | Delete local user |
> | Microsoft.Storage/storageAccounts/localusers/regeneratePassword/action |  |
> | Microsoft.Storage/storageAccounts/localusers/listKeys/action | List local user keys |
> | Microsoft.Storage/storageAccounts/localusers/read | List local users |
> | Microsoft.Storage/storageAccounts/localusers/read | Get local user |
> | Microsoft.Storage/storageAccounts/localusers/write | Create or update local user |
> | Microsoft.Storage/storageAccounts/managementPolicies/delete | Delete storage account management policies |
> | Microsoft.Storage/storageAccounts/managementPolicies/read | Get storage management account policies |
> | Microsoft.Storage/storageAccounts/managementPolicies/write | Put storage account management policies |
> | Microsoft.Storage/storageAccounts/networkSecurityPerimeterAssociationProxies/delete |  |
> | Microsoft.Storage/storageAccounts/networkSecurityPerimeterAssociationProxies/read |  |
> | Microsoft.Storage/storageAccounts/networkSecurityPerimeterAssociationProxies/write |  |
> | Microsoft.Storage/storageAccounts/networkSecurityPerimeterConfigurations/read |  |
> | Microsoft.Storage/storageAccounts/objectReplicationPolicies/delete | Delete object replication policy |
> | Microsoft.Storage/storageAccounts/objectReplicationPolicies/read | Get object replication policy |
> | Microsoft.Storage/storageAccounts/objectReplicationPolicies/read | List object replication policies |
> | Microsoft.Storage/storageAccounts/objectReplicationPolicies/write | Create or update object replication policy |
> | Microsoft.Storage/storageAccounts/objectReplicationPolicies/restorePointMarkers/write | Create object replication restore point marker |
> | Microsoft.Storage/storageAccounts/privateEndpointConnectionProxies/read | Get Private Endpoint Connection Proxy |
> | Microsoft.Storage/storageAccounts/privateEndpointConnectionProxies/updatePrivateEndpointProperties/action | Update storage account private endpoint properties |
> | Microsoft.Storage/storageAccounts/privateEndpointConnectionProxies/delete | Delete Private Endpoint Connection Proxies |
> | Microsoft.Storage/storageAccounts/privateEndpointConnectionProxies/write | Put Private Endpoint Connection Proxies |
> | Microsoft.Storage/storageAccounts/privateEndpointConnections/read | List Private Endpoint Connections |
> | Microsoft.Storage/storageAccounts/privateEndpointConnections/delete | Delete Private Endpoint Connection |
> | Microsoft.Storage/storageAccounts/privateEndpointConnections/read | Get Private Endpoint Connection |
> | Microsoft.Storage/storageAccounts/privateEndpointConnections/write | Put Private Endpoint Connection |
> | Microsoft.Storage/storageAccounts/privateEndpoints/move/action |  |
> | Microsoft.Storage/storageAccounts/privateLinkResources/read | Get StorageAccount groupids |
> | Microsoft.Storage/storageAccounts/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource. |
> | Microsoft.Storage/storageAccounts/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource. |
> | Microsoft.Storage/storageAccounts/providers/Microsoft.Insights/metricDefinitions/read | Get list of Microsoft Storage Metrics definitions. |
> | Microsoft.Storage/storageAccounts/queueServices/read |  |
> | Microsoft.Storage/storageAccounts/queueServices/write |  |
> | Microsoft.Storage/storageAccounts/queueServices/read | Get Queue service properties |
> | Microsoft.Storage/storageAccounts/queueServices/read | Returns queue service properties or statistics. |
> | Microsoft.Storage/storageAccounts/queueServices/write | Returns the result of setting queue service properties |
> | Microsoft.Storage/storageAccounts/queueServices/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource. |
> | Microsoft.Storage/storageAccounts/queueServices/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource. |
> | Microsoft.Storage/storageAccounts/queueServices/providers/Microsoft.Insights/logDefinitions/read | Gets the log definition for Queue |
> | Microsoft.Storage/storageAccounts/queueServices/providers/Microsoft.Insights/metricDefinitions/read | Get list of Microsoft Storage Metrics definitions. |
> | Microsoft.Storage/storageAccounts/queueServices/queues/delete |  |
> | Microsoft.Storage/storageAccounts/queueServices/queues/read |  |
> | Microsoft.Storage/storageAccounts/queueServices/queues/write |  |
> | Microsoft.Storage/storageAccounts/queueServices/queues/read | Returns a queue or a list of queues. |
> | Microsoft.Storage/storageAccounts/queueServices/queues/write | Returns the result of writing a queue |
> | Microsoft.Storage/storageAccounts/queueServices/queues/delete | Returns the result of deleting a queue |
> | Microsoft.Storage/storageAccounts/reports/read |  |
> | Microsoft.Storage/storageAccounts/restorePoints/delete | Delete object replication restore point |
> | Microsoft.Storage/storageAccounts/restorePoints/read | Get object replication restore point |
> | Microsoft.Storage/storageAccounts/restorePoints/read | List object replication restore points |
> | Microsoft.Storage/storageAccounts/services/diagnosticSettings/write | Create/Update storage account diagnostic settings. |
> | Microsoft.Storage/storageAccounts/storageTaskAssignments/delete |  |
> | Microsoft.Storage/storageAccounts/storageTaskAssignments/read |  |
> | Microsoft.Storage/storageAccounts/storageTaskAssignments/write |  |
> | Microsoft.Storage/storageAccounts/storageTaskAssignments/reports/read |  |
> | Microsoft.Storage/storageAccounts/tableServices/read |  |
> | Microsoft.Storage/storageAccounts/tableServices/read | Get Table service properties |
> | Microsoft.Storage/storageAccounts/tableServices/write |  |
> | Microsoft.Storage/storageAccounts/tableServices/read | Get table service properties or statistics |
> | Microsoft.Storage/storageAccounts/tableServices/write | Set table service properties |
> | Microsoft.Storage/storageAccounts/tableServices/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource. |
> | Microsoft.Storage/storageAccounts/tableServices/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource. |
> | Microsoft.Storage/storageAccounts/tableServices/providers/Microsoft.Insights/logDefinitions/read | Gets the log definition for Table |
> | Microsoft.Storage/storageAccounts/tableServices/providers/Microsoft.Insights/metricDefinitions/read | Get list of Microsoft Storage Metrics definitions. |
> | Microsoft.Storage/storageAccounts/tableServices/tables/delete |  |
> | Microsoft.Storage/storageAccounts/tableServices/tables/read |  |
> | Microsoft.Storage/storageAccounts/tableServices/tables/write |  |
> | Microsoft.Storage/storageAccounts/tableServices/tables/read | Query tables |
> | Microsoft.Storage/storageAccounts/tableServices/tables/write | Create tables |
> | Microsoft.Storage/storageAccounts/tableServices/tables/delete | Delete tables |
> | Microsoft.Storage/storageTasks/delete | Deletes an existing storage task |
> | Microsoft.Storage/storageTasks/read | Gets the properties for the specified storage task |
> | Microsoft.Storage/storageTasks/promote/action | Promote specific version of storage task to current version |
> | Microsoft.Storage/storageTasks/write | Creates or updates storage task |
> | Microsoft.Storage/storageTasks/reports/read | List run statuses of a storage task |
> | Microsoft.Storage/storageTasks/storageTaskAssignments/read | List all storage task assignments of a storage task |
> | Microsoft.Storage/storageTasks/versions/read | List all versions of a storage task |
> | Microsoft.Storage/usages/read | Returns the limit and the current usage count for resources in the specified subscription |
> | **DataAction** | **Description** |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read | Returns a blob or a list of blobs |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write | Returns the result of writing a blob |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete | Returns the result of deleting a blob |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/deleteBlobVersion/action | Returns the result of deleting a blob version |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/permanentDelete/action |  |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/add/action | Returns the result of adding blob content |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/filter/action | Returns the list of blobs under an account with matching tags filter |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/move/action | Moves the blob from one path to another |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/manageOwnership/action | Changes ownership of the blob |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/modifyPermissions/action | Modifies permissions of the blob |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/runAsSuperUser/action | Returns the result of the blob command |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/immutableStorage/runAsSuperUser/action |  |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/read | Returns the result of reading blob tags |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write | Returns the result of writing blob tags |
> | Microsoft.Storage/storageAccounts/fileServices/readFileBackupSemantics/action | Read File Backup Sematics Privilege |
> | Microsoft.Storage/storageAccounts/fileServices/writeFileBackupSemantics/action | Write File Backup Sematics Privilege |
> | Microsoft.Storage/storageAccounts/fileServices/takeOwnership/action | File Take Ownership Privilege |
> | Microsoft.Storage/storageAccounts/fileServices/fileshares/files/read | Returns a file/folder or a list of files/folders |
> | Microsoft.Storage/storageAccounts/fileServices/fileshares/files/write | Returns the result of writing a file or creating a folder |
> | Microsoft.Storage/storageAccounts/fileServices/fileshares/files/delete | Returns the result of deleting a file/folder |
> | Microsoft.Storage/storageAccounts/fileServices/fileshares/files/modifypermissions/action | Returns the result of modifying permission on a file/folder |
> | Microsoft.Storage/storageAccounts/fileServices/fileshares/files/actassuperuser/action | Get File Admin Privileges |
> | Microsoft.Storage/storageAccounts/queueServices/queues/messages/read | Returns a message |
> | Microsoft.Storage/storageAccounts/queueServices/queues/messages/write | Returns the result of writing a message |
> | Microsoft.Storage/storageAccounts/queueServices/queues/messages/delete | Returns the result of deleting a message |
> | Microsoft.Storage/storageAccounts/queueServices/queues/messages/add/action | Returns the result of adding a message |
> | Microsoft.Storage/storageAccounts/queueServices/queues/messages/process/action | Returns the result of processing a message |
> | Microsoft.Storage/storageAccounts/tableServices/tables/entities/read | Query table entities |
> | Microsoft.Storage/storageAccounts/tableServices/tables/entities/write | Insert, merge, or replace table entities |
> | Microsoft.Storage/storageAccounts/tableServices/tables/entities/delete | Delete table entities |
> | Microsoft.Storage/storageAccounts/tableServices/tables/entities/add/action | Insert table entities |
> | Microsoft.Storage/storageAccounts/tableServices/tables/entities/update/action | Merge or update table entities |

## Microsoft.StorageCache

File caching for high-performance computing (HPC).

Azure service: [Azure HPC Cache](/azure/hpc-cache/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.StorageCache/register/action | Registers the subscription for the storage cache resource provider and enables creation of Azure HPC Cache resources |
> | Microsoft.StorageCache/preflight/action |  |
> | Microsoft.StorageCache/checkAmlFSSubnets/action | Validates the subnets for Amlfilesystem |
> | Microsoft.StorageCache/getRequiredAmlFSSubnetsSize/action | Calculate the number of ips needed |
> | Microsoft.StorageCache/unregister/action | Azure HPC Cache resource provider |
> | Microsoft.StorageCache/amlFilesystems/read | Gets the properties of an amlfilesystem |
> | Microsoft.StorageCache/amlFilesystems/write | Creates a new amlfilesystem, or updates an existing one |
> | Microsoft.StorageCache/amlFilesystems/delete | Deletes the amlfilesystem instance |
> | Microsoft.StorageCache/amlFilesystems/Archive/action | Archive the data in the amlfilesystem |
> | Microsoft.StorageCache/amlFilesystems/CancelArchive/action | Cancel archiving the amlfilesystem |
> | Microsoft.StorageCache/amlFilesystems/importJobs/read |  |
> | Microsoft.StorageCache/amlFilesystems/importJobs/write |  |
> | Microsoft.StorageCache/amlFilesystems/importJobs/delete |  |
> | Microsoft.StorageCache/caches/write | Creates a new cache, or updates an existing one |
> | Microsoft.StorageCache/caches/read | Gets the properties of a cache |
> | Microsoft.StorageCache/caches/delete | Deletes the cache instance |
> | Microsoft.StorageCache/caches/Upgrade/action | Upgrades OS software for the cache |
> | Microsoft.StorageCache/caches/Start/action | Starts the cache |
> | Microsoft.StorageCache/caches/Stop/action | Stops the cache |
> | Microsoft.StorageCache/caches/debugInfo/action | Creates support information (GSI) or debug information for a cache. |
> | Microsoft.StorageCache/caches/spaceAllocation/action |  |
> | Microsoft.StorageCache/caches/addPrimingJob/action | Adds a priming job to the cache |
> | Microsoft.StorageCache/caches/startPrimingJob/action |  |
> | Microsoft.StorageCache/caches/removePrimingJob/action | Removes a primining job from the cache |
> | Microsoft.StorageCache/caches/stopPrimingJob/action |  |
> | Microsoft.StorageCache/caches/pausePrimingJob/action | Pauses a running priming job in the cache |
> | Microsoft.StorageCache/caches/resumePrimingJob/action | Resumes a paused priming job in the cache |
> | Microsoft.StorageCache/caches/Flush/action | Flushes cached data to storage targets |
> | Microsoft.StorageCache/caches/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the Cache. |
> | Microsoft.StorageCache/caches/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the Cache. |
> | Microsoft.StorageCache/caches/providers/Microsoft.Insights/logDefinitions/read | Gets the log definitions for the StorageCache |
> | Microsoft.StorageCache/caches/providers/Microsoft.Insights/metricDefinitions/read | Reads Cache Metric Definitions. |
> | Microsoft.StorageCache/caches/storageTargets/write | Creates a new storage target in the cache, or updates an existing one |
> | Microsoft.StorageCache/caches/storageTargets/read | Gets properties of a storage target in the cache |
> | Microsoft.StorageCache/caches/storageTargets/delete | Deletes a cache storage target |
> | Microsoft.StorageCache/caches/storageTargets/dnsRefersh/action | Updates the storage target IP address from a custom DNS server or from an Azure Storage private endpoint |
> | Microsoft.StorageCache/caches/storageTargets/flush/action |  |
> | Microsoft.StorageCache/caches/storageTargets/suspend/action | Disables client access to a cache's storage target. But doesn't permanently remove the storage target from the cache. |
> | Microsoft.StorageCache/caches/storageTargets/resume/action | Puts a suspended storage target back into service |
> | Microsoft.StorageCache/caches/storageTargets/invalidate/action | Marks all cached files from the cache's storage target as out of date. The next time a client requests these files, they will be fetched from the back-end storage system. |
> | Microsoft.StorageCache/caches/storageTargets/restoreDefaults/action | Restores the Cache's storage target's settings to their default values |
> | Microsoft.StorageCache/caches/storageTargetsLists/read | Lists the cache's storage targets |
> | Microsoft.StorageCache/locations/ascOperations/read | Gets the status of an asynchronous operation for the Azure HPC cache |
> | Microsoft.StorageCache/operations/read | Lists operations available for the Azure HPC Cache |
> | Microsoft.StorageCache/ResourceGroup/amlFilesystems/read | Lists existing amlfilesystem instances in the resource group |
> | Microsoft.StorageCache/ResourceGroup/caches/read | Lists existing cache instances in the resource group |
> | Microsoft.StorageCache/skus/read | Lists all valid SKUs for the cache |
> | Microsoft.StorageCache/Subscription/amlFilesystems/read | Lists existing amlfilesystems in the subscription |
> | Microsoft.StorageCache/Subscription/caches/read | Lists existing caches in the subscription |
> | Microsoft.StorageCache/usageModels/read | Lists available usage models for NFS storage targets in this cache |
> | Microsoft.StorageCache/usages/read | Lists the usage quota for cache or Amlfilesystem |

## Microsoft.StorageSync

Azure service: [Storage](/azure/storage/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.StorageSync/register/action | Registers the subscription for the Storage Sync Provider |
> | Microsoft.StorageSync/unregister/action | Unregisters the subscription for the Storage Sync Provider |
> | Microsoft.StorageSync/locations/checkNameAvailability/action | Checks that storage sync service name is valid and is not in use. |
> | Microsoft.StorageSync/locations/operationresults/read | Gets the result for an asynchronous operation |
> | Microsoft.StorageSync/locations/operations/read | Gets the status for an azure asynchronous operation |
> | Microsoft.StorageSync/locations/workflows/operations/read | Gets the status of an asynchronous operation |
> | Microsoft.StorageSync/operations/read | Gets a list of the Supported Operations |
> | Microsoft.StorageSync/storageSyncServices/read | Read any Storage Sync Services |
> | Microsoft.StorageSync/storageSyncServices/write | Create or Update any Storage Sync Services |
> | Microsoft.StorageSync/storageSyncServices/delete | Delete any Storage Sync Services |
> | Microsoft.StorageSync/storageSyncServices/privateEndpointConnectionProxies/validate/action | Validate any Private Endpoint ConnectionProxies |
> | Microsoft.StorageSync/storageSyncServices/privateEndpointConnectionProxies/read | Read any Private Endpoint ConnectionProxies |
> | Microsoft.StorageSync/storageSyncServices/privateEndpointConnectionProxies/write | Create or Update any Private Endpoint ConnectionProxies |
> | Microsoft.StorageSync/storageSyncServices/privateEndpointConnectionProxies/delete | Delete any Private Endpoint ConnectionProxies |
> | Microsoft.StorageSync/storageSyncServices/privateEndpointConnections/read | Read any Private Endpoint Connections |
> | Microsoft.StorageSync/storageSyncServices/privateEndpointConnections/write | Create or Update any Private Endpoint Connections |
> | Microsoft.StorageSync/storageSyncServices/privateEndpointConnections/delete | Delete any Private Endpoint Connections |
> | Microsoft.StorageSync/storageSyncServices/privateLinkResources/read | Read any Private Link Resources |
> | Microsoft.StorageSync/storageSyncServices/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for Storage Sync Services |
> | Microsoft.StorageSync/storageSyncServices/registeredServers/read | Read any Registered Server |
> | Microsoft.StorageSync/storageSyncServices/registeredServers/write | Create or Update any Registered Server |
> | Microsoft.StorageSync/storageSyncServices/registeredServers/delete | Delete any Registered Server |
> | Microsoft.StorageSync/storageSyncServices/syncGroups/read | Read any Sync Groups |
> | Microsoft.StorageSync/storageSyncServices/syncGroups/write | Create or Update any Sync Groups |
> | Microsoft.StorageSync/storageSyncServices/syncGroups/delete | Delete any Sync Groups |
> | Microsoft.StorageSync/storageSyncServices/syncGroups/cloudEndpoints/read | Read any Cloud Endpoints |
> | Microsoft.StorageSync/storageSyncServices/syncGroups/cloudEndpoints/write | Create or Update any Cloud Endpoints |
> | Microsoft.StorageSync/storageSyncServices/syncGroups/cloudEndpoints/delete | Delete any Cloud Endpoints |
> | Microsoft.StorageSync/storageSyncServices/syncGroups/cloudEndpoints/prebackup/action | Call this action before backup |
> | Microsoft.StorageSync/storageSyncServices/syncGroups/cloudEndpoints/postbackup/action | Call this action after backup |
> | Microsoft.StorageSync/storageSyncServices/syncGroups/cloudEndpoints/prerestore/action | Call this action before restore |
> | Microsoft.StorageSync/storageSyncServices/syncGroups/cloudEndpoints/postrestore/action | Call this action after restore |
> | Microsoft.StorageSync/storageSyncServices/syncGroups/cloudEndpoints/restoreheartbeat/action | Restore heartbeat |
> | Microsoft.StorageSync/storageSyncServices/syncGroups/cloudEndpoints/triggerChangeDetection/action | Call this action to trigger detection of changes on a cloud endpoint's file share |
> | Microsoft.StorageSync/storageSyncServices/syncGroups/cloudEndpoints/afssharemetadatacertificatepublickeys/read | Gets the public keys info for AfsShareMetadata certificate |
> | Microsoft.StorageSync/storageSyncServices/syncGroups/cloudEndpoints/operationresults/read | Gets the status of an asynchronous backup/restore operation |
> | Microsoft.StorageSync/storageSyncServices/syncGroups/serverEndpoints/read | Read any Server Endpoints |
> | Microsoft.StorageSync/storageSyncServices/syncGroups/serverEndpoints/write | Create or Update any Server Endpoints |
> | Microsoft.StorageSync/storageSyncServices/syncGroups/serverEndpoints/delete | Delete any Server Endpoints |
> | Microsoft.StorageSync/storageSyncServices/syncGroups/serverEndpoints/recallAction/action | Call this action to recall files to a server |
> | Microsoft.StorageSync/storageSyncServices/workflows/read | Read Workflows |
> | Microsoft.StorageSync/storageSyncServices/workflows/operationresults/read | Gets the status of an asynchronous operation |
> | Microsoft.StorageSync/storageSyncServices/workflows/operations/read | Gets the status of an asynchronous operation |

## Next steps

- [Azure resource providers and types](/azure/azure-resource-manager/management/resource-providers-and-types)