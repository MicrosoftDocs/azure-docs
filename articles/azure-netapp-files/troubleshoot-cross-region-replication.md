---
title: Troubleshoot cross-region replication errors for Azure NetApp Files | Microsoft Docs
description: Describes error messages and resolutions that can help you troubleshoot cross-region replication issues for Azure NetApp Files.
services: azure-netapp-files
author: b-hchen
ms.service: azure-netapp-files
ms.topic: troubleshooting
ms.date: 04/28/2025
ms.author: anfdocs
---
# Troubleshoot cross-region replication errors

This article describes error messages and resolutions that can help you troubleshoot cross-region replication issues for Azure NetApp Files. 

## Errors creating replication  

|     Error message    |     Resolution    |
|-|-|
| `Volume {0} cannot be used as source because it is already in replication` | You cab't   create a replication with a source volume that is already in a data replication relationship.    |
| `Peered region '{0}' is not accepted` | You can't create replication between unpaired regions. Review [supported regional pairs](cross-region-replication-introduction.md#supported-region-pairs). |
| `RemoteVolumeResource '{0}' of wrong type '{1}'` | Validate that the remote resource ID is a volume resource ID.    |

## Errors authorizing volume  

|     Error message    |     Resolution    |
|-|-|
| `Missing value for 'AuthorizeSourceReplication'` | The `RemoteResourceID` is missing or invalid from the UI or API request (fix error message).   |
| `Missing value for 'RemoteVolumeResourceId'` | The `RemoteResourceID` is missing or invalid from the UI or API request.   |
| `Data Protection volume not found for RemoteVolumeResourceId: {remoteResourceId}` |   Validate if `RemoteResourceID` is correct or exists for the user.   |
| `Remote volume '{ }' is not configured for replication`   | Destination volume isn't a data protection volume.   |
| `Remote volume '{0}' does not have source volume '{1}' as RemoteVolumeResourceId` | Data protection volume doesn't have this source volume in its remote resource ID (wrong source ID was entered). |
| `The destination volume replication creation failed (message: {0})` | This error indicates a server error. Contact Support. |

## Error reinitializing replication 

| Error message | Resolution |
|-|-|
| `Replication reinitialization is not possible as it is currently being initialized. The initialization time depends on the amount of data being replicated. If you believe the process is stuck or taking too long, please contact support for assistance.` | Replication is being reinitialized and the initial transfer is in process. Learn more about the [health status](cross-region-replication-display-health-status.md) of the replication relationship. |


## Error breaking replication 

| Error message | Resolution |
|-|-|
| `‘Not able to break a volume replication in an uninitialized state.` | Reinitialize the endpoint to return replication to an initialized state or delete the replication and try again. |

## Errors deleting replication

|     Error message    |     Resolution    |
|-|-|
|     `Replication cannot be deleted, mirror state needs to be in status: Broken before deleting`    |     Validate that   either replication has been broken or it's uninitialized and idle (failed   initialization).    |
|     `Cannot delete source replication`    |     Deleting the   replication from the source side is not allowed. Make sure that you're deleting the replication from the destination side.    |
| Deleting replication in uninitialized state and transferring relationship status: <br> `Replication cannot be deleted while relationship status is transferring.` | Wait until replication is idle and try again. |
| `Replication cannot be deleted while in Mirrored state` | Break the replication relationship before proceeding. See [Delete volume replications or volumes](cross-region-replication-delete.md). |

## Errors deleting volume

|     Error message    |     Resolution    |
|-|-|
| `Volume is a member of an active volume replication relationship`  |  Delete replication before deleting the volume. See [Delete replications](cross-region-replication-delete.md). This operation requires that you break the peering before deleting the replication for the volume. |
| `Volume with replication cannot be deleted`  |  Delete replication before deleting the volume. See [Delete replications](cross-region-replication-delete.md). This operation requires that you break the peering before deleting the replication for the volume. 

## Error resyncing volume

|     Error message    |     Resolution    |
|-|-|
| `Volume replication is in invalid status: (Mirrored|Uninitialized) for operation: 'ResyncReplication'` | Confirm the volume's replication state is "broken." |

## Errors deleting snapshot 

| Error message | Resolution |
|-|-|
| `Snapshot cannot be deleted, parent volume is a data protection volume with a replication object` | Validate that you've broken the volume's replication if you want to delete this snapshot. |
| `Cannot delete volume replication generated snapshot` | Deleting replication baseline snapshots isn't allowed. |

## Errors resizing volumes

| Error message | Resolution |
|-|-|
|   Attempt to resize a source volume is failing with the error `"PoolSizeTooSmall","message":"Pool size too small for total volume size."`  |  Ensure you have enough space available in the capacity pools for both the source and the destination volumes of cross-region replication. When you resize the source volume, the destination volume is automatically resized. If the capacity pool hosting the destination volume doesn’t have enough available space, resizing both the source and the destination volumes will fail. See [Resize a cross-region replication destination volume](azure-netapp-files-resize-capacity-pools-or-volumes.md#resize-a-cross-region-replication-destination-volume) for details.   |

## Next steps  

* [Cross-region replication](cross-region-replication-introduction.md)
* [Requirements and considerations for using cross-region replication](cross-region-replication-requirements-considerations.md)
* [Create volume replication](cross-region-replication-create-peering.md)
* [Display health status of replication relationship](cross-region-replication-display-health-status.md)
* [Manage disaster recovery](cross-region-replication-manage-disaster-recovery.md)
* [Resize a cross-region replication destination volume](azure-netapp-files-resize-capacity-pools-or-volumes.md#resize-a-cross-region-replication-destination-volume)
* [Test disaster recovery for Azure NetApp Files](test-disaster-recovery.md)
