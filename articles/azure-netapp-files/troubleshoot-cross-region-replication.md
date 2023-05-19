---
title: Troubleshoot cross-region replication errors for Azure NetApp Files | Microsoft Docs
description: Describes error messages and resolutions that can help you troubleshoot cross-region replication issues for Azure NetApp Files. 
services: azure-netapp-files
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: troubleshooting
ms.date: 08/02/2022
ms.author: anfdocs
---
# Troubleshoot cross-region replication errors

This article describes error messages and resolutions that can help you troubleshoot cross-region replication issues for Azure NetApp Files. 

## Errors creating replication  

|     Error Message    |     Resolution    |
|-|-|
|     `Volume {0} cannot   be used as source because it is already in replication`    |     You cannot   create a replication with a source volume that is already in a data   replication relationship.    |
|     `Peered region   '{0}' is not accepted`    |     You are   attempting to create a replication between un-peered regions.    |
|     `RemoteVolumeResource   '{0}' of wrong type '{1}'`    |     Validate that   the remote resource ID is a volume resource ID.    |

## Errors authorizing volume  

|     Error Message    |     Resolution    |
|-|-|
|     `Missing value   for 'AuthorizeSourceReplication'`    |     The   `RemoteResourceID` is missing or invalid from the UI or API request (fix error   message).    |
|     `Missing value   for 'RemoteVolumeResourceId'`    |     The   `RemoteResourceID` is missing or invalid from the UI or API request.    |
|     `Data   Protection volume not found for RemoteVolumeResourceId: {remoteResourceId}`    |     Validate if   `RemoteResourceID` is correct or exists for the user.    |
|     `Remote volume   '{0}' is not configured for replication`    |     Destination   volume is not a data protection volume.    |
|     `Remote volume   '{0}' does not have source volume '{1}' as RemoteVolumeResourceId`    |     Data   protection volume does not have this source volume in its remote resource ID   (wrong source ID was entered).    |
|     `The   destination volume replication creation failed (message: {0})`    |     This error   indicates a server error. Contact Support.    |

## Error breaking replication 

| Error Message | Resolution |
|-|-|
| `‘Not able to break a volume replication in an uninitialized state.` | Use re-initialize endpoint to get replication in initialized state or delete the replication and try again. |

## Errors deleting replication

|     Error Message    |     Resolution    |
|-|-|
|     `Replication   cannot be deleted, mirror state needs to be in status: Broken before deleting`    |     Validate that   either replication has been broken or it is uninitialized and idle (failed   initialization).    |
|     `Cannot delete   source replication`    |     Deleting the   replication from the source side is not allowed. Make sure that you are   deleting the replication from the destination side.    |
| Deleting replication in uninitialized state and transferring relationship status: <br> `Replication cannot be deleted while relationship status is transferring.` | Wait until replication is idle and try again. |
| `Replication cannot be deleted while in Mirrored state` | Break the replication relationship  before proceeding. See [Delete volume replications or volumes](cross-region-replication-delete.md). |

## Errors deleting volume

|     Error Message    |     Resolution    |
|-|-|
| `Volume is a member of an active volume replication relationship`  |  Delete replication before deleting the volume. See [Delete replications](cross-region-replication-delete.md). This operation requires that you break the peering before deleting the replication for the volume. |
| `Volume with replication cannot be deleted`  |  Delete replication before deleting the volume. See [Delete replications](cross-region-replication-delete.md). This operation requires that you break the peering before deleting the replication for the volume. 

## Errors resyncing volume

|     Error Message    |     Resolution    |
|-|-|
|     `Volume Replication is in invalid status: (Mirrored|Uninitialized) for operation: 'ResyncReplication'`     |     Validate that   volume replication is in state "broken”.    |

## Errors deleting snapshot 

|     Error Message    |     Resolution    |
|-|-|
|     `Snapshot   cannot be deleted, parent volume is a Data Protection volume with a   replication object`    |     Validate that   you have broken the volume's replication if you want to delete this   snapshot.    |
|     `Cannot delete   volume replication generated snapshot`    |     Deletion of   replication baseline snapshots is not allowed.    |

## Errors resizing volumes

|     Error Message    |     Resolution    |
|-|-|
|   Attempt to resize a source volume is failing with the error `"PoolSizeTooSmall","message":"Pool size too small for total volume size."`  |  Ensure that you have enough headroom in the capacity pools for both the source and the destination volumes of cross-region replication. When you resize the source volume, the destination volume is automatically resized. But if the capacity pool hosting the destination volume doesn’t have enough headroom, the resizing of both the source and the destination volumes will fail. See [Resize a cross-region replication destination volume](azure-netapp-files-resize-capacity-pools-or-volumes.md#resize-a-cross-region-replication-destination-volume) for details.   |

## Next steps  

* [Cross-region replication](cross-region-replication-introduction.md)
* [Requirements and considerations for using cross-region replication](cross-region-replication-requirements-considerations.md)
* [Create volume replication](cross-region-replication-create-peering.md)
* [Display health status of replication relationship](cross-region-replication-display-health-status.md)
* [Manage disaster recovery](cross-region-replication-manage-disaster-recovery.md)
* [Resize a cross-region replication destination volume](azure-netapp-files-resize-capacity-pools-or-volumes.md#resize-a-cross-region-replication-destination-volume)
* [Test disaster recovery for Azure NetApp Files](test-disaster-recovery.md)
