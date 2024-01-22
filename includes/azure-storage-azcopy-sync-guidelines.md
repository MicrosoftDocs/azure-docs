---
 author: normesta
 ms.service: storage
 ms.topic: include
 ms.date: 02/09/2023
 ms.author: normesta
---

 By default, the [sync](../articles/storage/common/storage-ref-azcopy-sync.md) command compares file names and last modified timestamps. You can override that behavior to use MD5 hashes instead of last modified timestamps by using the `--compare-hash` flag. Set the `--delete-destination` optional flag to a value of `true` or `prompt` to delete files in the destination directory if those files no longer exist in the source directory.

- If you set the `--delete-destination` flag to `true`, AzCopy deletes files without providing a prompt. If you want a prompt to appear before AzCopy deletes a file, set the `--delete-destination` flag to `prompt`.

- If you plan to set the `--delete-destination` flag to `prompt` or `false`, consider using the [copy](../articles/storage/common/storage-ref-azcopy-copy.md) command instead of the 
[sync](../articles/storage/common/storage-ref-azcopy-sync.md) command and set the `--overwrite` parameter to `ifSourceNewer`. The [copy](../articles/storage/common/storage-ref-azcopy-copy.md) command consumes less memory and incurs less billing costs because a copy operation doesn't have to index the source or destination prior to moving files.

- If you don't plan to use the `--compare-hash` flag, then the machine on which you run the sync command should have an accurate system clock because the last modified times are critical in determining whether a file should be transferred. If your system has significant clock skew, avoid modifying files at the destination too close to the time that you plan to run a sync command.

- AzCopy uses server-to-server APIs to synchronize data between storage accounts. That means that data is copied directly between storage servers. However, AzCopy does set up and monitor each transfer, and for larger storage accounts (For example, accounts that contain millions of blobs), AzCopy might require a substantial amount of compute resources to accomplish these tasks. Therefore, if you are running AzCopy from Virtual Machine (VM), make sure that the VM has enough cores/memory to handle the load.
