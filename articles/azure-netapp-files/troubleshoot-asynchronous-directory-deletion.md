---
title: Troubleshoot asynchronous directory deletion in Azure NetApp Files
description: Learn how to diagnose and resolve configuration and directory-deletion issues for asynchronous directory deletion in Azure NetApp Files.
services: azure-netapp-files
author: netapp-manishc
ms.service: azure-netapp-files
ms.topic: troubleshooting
ms.date: 10/05/2026
ms.author: anfdocs
# Customer intent: As a storage administrator, I want to troubleshoot asynchronous directory deletion issues in Azure NetApp Files, so that I can resolve configuration errors and ensure large directories are deleted as expected.
---

# Troubleshoot asynchronous directory deletion in Azure NetApp Files (preview)

This article helps you diagnose and resolve common configuration and directory-deletion issues for [asynchronous directory deletion](asynchronous-directory-deletion-concept.md) in Azure NetApp Files. Use the symptoms and error messages to identify the likely cause and corrective action.

## Configuration errors

### Error: This property is available in Api-Version 2026-08-15-preview and later

**Symptom:** A volume `GET` or `PATCH` request returns HTTP 400 and indicates that the property requires API version `2026-08-15-preview` or later.

**Cause:** The request uses an API version that doesn't contain the asynchronous directory deletion schema.

**Resolution:** Use API version `2026-08-15-preview` or later in the request URI.

```
?api-version=2026-08-15-preview
```

### Error: Cannot enable asynchronous deletion on a Data Protection volume

**Symptom:** A request to enable asynchronous directory deletion returns HTTP 400 for a data protection volume.

**Cause:** You can't enable asynchronous directory deletion directly on a data protection volume.

**Resolution:** Enable the feature on an eligible regular or large source volume. Don't enable it on the destination data protection volume.

### Error: The trash bin name can't be specified unless asynchronous directory deletion is enabled

**Symptom:** A `PATCH` request returns HTTP 400 when you include `trashBinName`.

**Cause:** The request includes `trashBinName` but doesn't set `status` to `Enabled`.

**Resolution:** Include both `status` and `trashBinName` in the `asyncDirectoryDelete` object.

```
{
  "properties": {
    "asyncDirectoryDelete": {
      "status": "Enabled",
      "trashBinName": "myTrashBin"
    }
  }
}
```

### Error: Directory already exists on the volume

**Symptom:** A request returns HTTP 400 and reports that the selected trash bin name already exists as a directory on the volume.

**Cause:** A file or directory with the requested trash bin name already exists at the root of the volume.

**Resolution:** Choose a different trash bin name, or remove or rename the conflicting root-level object before enabling the feature.

## Directory deletion issues

### Moving the directory doesn't initiate asynchronous deletion

**Symptom:** You move a directory, but asynchronous directory deletion doesn't start.

**Cause:** The feature might not be enabled, the destination might not match the configured trash bin path, or the move might cross volume boundaries.

**Resolution:**

1. Retrieve the volume with API version `2026-08-15-preview` or later.
1. Confirm that the `asyncDirectoryDelete` status is `Enabled`.
1. Confirm that the configured `trashBinName` exactly matches the destination directory at the root of the volume.
1. Confirm that the source directory and trash bin path are on the same Azure NetApp Files volume.
1. Move the target directory into the configured trash bin path.

The volume response should include a fragment similar to the following example:

```
{
  "properties": {
    "asyncDirectoryDelete": {
      "status": "Enabled",
      "trashBinName": "myTrashBin"
    }
  }
}
```

### Capacity isn't reclaimed immediately

**Symptom:** Used capacity doesn't decrease immediately after you move a directory into the configured trash bin path.

**Cause:** Azure NetApp Files deletes the directory contents and reclaims capacity asynchronously in the background. Completion time depends on the number of objects and the directory-tree characteristics.

**Resolution:** No client-side deletion is required after the move. Allow the background operation to continue and monitor the volume capacity.

> [!IMPORTANT]
> Don't treat the configured trash bin path as a recovery location. Moving a directory into the trash bin path initiates deletion, and no more client action is required.

### Directories are stuck in a deleting state

**Symptom:** Directories you move into the trash bin path remain in a deleting state and capacity isn't reclaimed.

**Cause:** The system doesn't support simultaneous asynchronous delete operations on a single volume. Triggering simultaneous operations can cause folders to be stuck in a deleting state.

**Resolution:** Avoid running multiple asynchronous delete operations at the same time on a single volume. If directories remain stuck, [collect the information listed in this article](#collect-information-before-contacting-support) and contact support.

## Trash bin configuration issues

### The trash bin name is rejected

**Symptom:** The request to enable asynchronous directory deletion fails validation for `trashBinName`.

**Cause:** The name is empty, exceeds the supported length, contains unsupported characters, or conflicts with an existing root-level file or directory.

**Resolution:** Use a unique name that is 1 through 255 characters and contains only letters, numbers, period (`.`), underscore (`_`), and hyphen (`-`).

### The trash bin name can't be changed

**Symptom:** A request to update `trashBinName` fails while asynchronous directory deletion is enabled.

**Cause:** You can't edit the trash bin name in place while the feature is enabled.

**Resolution:**

1. Disable asynchronous directory deletion on the volume.
1. Re-enable the feature and provide the new trash bin name.
1. Retrieve the volume and verify the updated configuration before using the new path.

### Disabling the feature doesn't clear the stored trash bin name

**Symptom:** The previous trash bin name remains in the volume configuration after the feature is disabled.

**Cause:** Setting only `status` to `Disabled` preserves the stored trash bin name.

**Resolution:** To clear the name, disable the feature and set `trashBinName` to an empty string.

```
{
  "properties": {
    "asyncDirectoryDelete": {
      "status": "Disabled",
      "trashBinName": ""
    }
  }
}
```

## Frequently asked questions

### Is asynchronous directory deletion supported for NFS and SMB volumes?

Yes. The feature supports volumes accessed from Linux clients over NFS and Windows clients over SMB.

### Is the feature supported on regular and large volumes?

Yes. The preview supports regular volumes and large volumes.

### Is the feature supported with replication, cool access, backup, and clones?

During preview, the feature supports cross-region replication, cross-zone replication, cool access, Azure NetApp Files backup, restore to a new volume from a snapshot, and short-term clones. You can't enable it directly on a data protection volume.

### Does the feature increase maxfiles or maximum directory-size limits?

No. Asynchronous directory deletion makes cleanup of large directory trees more efficient, but it doesn't change maxfiles or maximum directory-size limits.

### Does the feature incur an extra charge?

No extra feature charge applies. Standard Azure NetApp Files capacity and data-management charges continue to apply.

## Collect information before contacting support

If the issue continues, collect the following information before opening a support request:

* Azure subscription ID
* Azure region
* Full volume resource ID
* Volume type and whether the volume is a data protection volume
* API version used
* Request URI and request payload with credentials and access tokens removed
* Complete HTTP status code and error message
* Current `asyncDirectoryDelete` `status` and `trashBinName` values
* Client protocol, NFS or SMB
* Source and destination paths used for the move operation
* Approximate number of files and directory depth involved

> [!IMPORTANT]
> Remove authorization headers, bearer tokens, passwords, and other secrets before sharing request details or logs with support.

## Next steps

* [Understand asynchronous directory deletion in Azure NetApp Files](asynchronous-directory-deletion-concept.md).
* [Configure and use asynchronous directory deletion in Azure NetApp Files](configure-asynchronous-directory-deletion.md).
* [Understand maxfiles limits in Azure NetApp Files](maxfiles-concept.md).
* [Understand directory sizes in Azure NetApp Files](directory-sizes-concept.md).
