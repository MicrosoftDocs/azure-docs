---
title: Understand asynchronous directory deletion in Azure NetApp Files
description: Learn how asynchronous directory deletion in Azure NetApp Files efficiently removes large directory trees by moving them to a trash bin directory for background deletion.
services: azure-netapp-files
author: netapp-manishc
ms.service: azure-netapp-files
ms.topic: concept-article
ms.date: 10/05/2026
ms.author: anfdocs
# Customer intent: As a storage administrator managing volumes with high file counts, I want to understand asynchronous directory deletion, so that I can clean up large directory trees efficiently without client-side file enumeration.
---

# Understand asynchronous directory deletion in Azure NetApp Files (preview)

Asynchronous directory deletion in Azure NetApp Files provides an efficient way to remove large directory trees without requiring a client to enumerate every file and send an individual delete request for each entry. Instead, the client moves the directory into a configured trash bin directory, and Azure NetApp Files reclaims the files and capacity asynchronously in the background.

This capability is designed for environments with high file counts and frequent cleanup requirements, including workloads that generate large amounts of temporary data. It's supported for volumes accessed by Linux clients over NFS and Windows clients over SMB.

## Why use asynchronous directory deletion

Deleting a directory with a large number of files through a client can be resource intensive. A traditional synchronous deletion requires the client to enumerate the directory tree and issue a delete operation for each file and subdirectory across the network.

Asynchronous directory deletion moves this cleanup work to Azure NetApp Files and provides the following benefits:

* Efficient deletion of large directories without client-side file enumeration or an individual `UNLINK` operation for every entry.
* Reduced latency and performance impact on the client during large directory cleanup operations.
* Background space reclamation after the directory is moved into the configured trash bin directory.
* A consistent workflow for both NFS and SMB clients.

> [!NOTE]
> If you need more space, you can trigger a volume resize operation at any time.

## How asynchronous directory deletion works

Asynchronous directory deletion uses a user-defined trash bin name configured on an Azure NetApp Files volume. The trash bin is a directory at the root of the volume that stages directory trees for background deletion.

| Step | Action | What happens |
| - | - | - |
| 1 | Enable the capability | An administrator enables asynchronous directory deletion on the volume and specifies a unique trash bin name. |
| 2 | Move the directory | A client renames or moves the directory to delete into the configured trash bin path on the same volume. |
| 3 | Delete in the background | Azure NetApp Files deletes the contents and reclaims space asynchronously. The client doesn't need to enumerate or delete individual entries. |

> [!IMPORTANT]
> Moving a directory into the trash bin directory initiates deletion. Azure NetApp Files removes the files and directories under the moved path automatically. Treat this action as destructive and ensure that the target directory is no longer needed before moving it.

## Supported configurations

During preview, asynchronous directory deletion supports the following configurations and Azure NetApp Files capabilities:

* Regular volumes and large volumes
* Volumes accessed through NFS or SMB
* Cross-region replication
* Cross-zone replication
* Cool access
* Azure NetApp Files backup
* Restore to a new volume from a snapshot
* Short-term clones

> [!NOTE]
> You can't enable asynchronous directory deletion on a data protection volume. Support with cross-region replication or cross-zone replication doesn't mean that you can enable the feature directly on the destination data protection volume.

## Considerations

* Enable the feature at the individual volume level.
* Provide a trash bin name when you enable the feature. The user-defined name must be unique at the root of the volume and must not match an existing file or directory.
* The trash bin name can contain 1 through 255 characters. Supported characters are letters, numbers, period (`.`), underscore (`_`), and hyphen (`-`).
* You can't change the trash bin name while asynchronous directory deletion is enabled. To use a different name, disable the feature and then re-enable it with the new name.
* Space is reclaimed in the background. The time required to complete deletion depends on the number of objects and the directory-tree characteristics.
* The feature reduces client-side work for deleting large directory trees, but it doesn't change the maxfiles or maximum directory-size limits of an Azure NetApp Files volume.
* Preview access is controlled at the subscription level. Configuration and management requirements can change before general availability.
* Simultaneous asynchronous delete operations on a single volume aren't supported. Triggering simultaneous operations results in folders being stuck in deleting state.
* Don't enable this feature on a replication destination volume until the replication is deleted.


### Relationship to high file counts

Azure NetApp Files volumes can contain large numbers of files and directories. High-file-count environments can make recursive client-side deletion expensive because the client must traverse the namespace and submit many metadata operations. Asynchronous directory deletion complements maxfiles and directory-size planning by making cleanup of large directory trees more efficient. It doesn't increase the number of files that a volume or a single directory can contain.

## Next steps

* [Understand maxfiles limits in Azure NetApp Files](maxfiles-concept.md).
* [Understand directory sizes in Azure NetApp Files](directory-sizes-concept.md).
* [Configure and use asynchronous directory deletion in Azure NetApp Files](configure-asynchronous-directory-deletion.md).
* [Troubleshoot asynchronous directory deletion in Azure NetApp Files](troubleshoot-asynchronous-directory-deletion.md).
