---
title: Troubleshoot cross-region-replication for Azure NetApp Files | Microsoft Docs
description: Describes error messages and resolutions that can help you troubleshoot cross-region replication issues for Azure NetApp Files. 
services: azure-netapp-files
documentationcenter: ''
author: b-juche
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: troubleshooting
ms.date: 09/16/2020
ms.author: b-juche
---
# Troubleshoot cross-region replication

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

## Errors deleting replication

|     Error Message    |     Resolution    |
|-|-|
|     `Replication   cannot be deleted, mirror state needs to be in status: Broken before deleting`    |     Validate that   either replication has been broken or it is uninitialized and idle (failed   initialization).    |
|     `Cannot delete   source replication`    |     Deleting the   replication from the source side is not allowed. Make sure that you are   deleting the replication from the destination side.    |

## Errors resyncing volume

|     Error Message    |     Resolution    |
|-|-|
|     `Volume Replication is in invalid status: (Mirrored|Uninitialized) for operation: 'ResyncReplication'`     |     Validate that   volume replication is in state "broken”.    |

## Errors deleting snapshot 

|     Error Message    |     Resolution    |
|-|-|
|     `Snapshot   cannot be deleted, parent volume is a Data Protection volume with a   replication object`    |     Validate that   you have broken the volume's replication if you want to delete this   snapshot.    |
|     `Cannot delete   volume replication generated snapshot`    |     Deletion of   replication baseline snapshots is not allowed.    |

## Next steps  

* [Cross-region replication](cross-region-replication-introduction.md)
* [Requirements and considerations for using cross-region replication](cross-region-replication-requirements-considerations.md)
* [Create replication peering](cross-region-replication-create-peering.md)
* [Display health status of replication relationship](cross-region-replication-display-health-status.md)
* [Manage disaster recovery](cross-region-replication-manage-disaster-recovery.md)
* [Troubleshoot cross-region replication](troubleshoot-cross-region-replication.md)
