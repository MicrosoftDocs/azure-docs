---
title: Manage Azure HPC Cache storage targets
description: How to suspend, remove, force delete, and flush Azure HPC Cache storage targets
author: ekpgh
ms.service: hpc-cache
ms.topic: how-to
ms.date: 07/12/2021
ms.author: v-erkel
---

# Manage storage targets

You can perform management actions on individual storage targets. These actions supplement the cache-level options discussed in [Manage your cache](hpc-cache-manage.md).

These controls can help you recover from an unexpected situation (like an unresponsive storage target), and also give you the ability to override some automatic cache actions (like writing changed files back to the long-term storage system).

Open the **Storage targets** page in the Azure portal. Click the **...** text on the far right of the storage target list to open the list of tasks.

![Screenshot of the storage targets page in the Azure portal, with the cursor over the menu exposed by clicking on the three dots (...) symbol to the far right of the storage target's row in the list.](media/storage-target-manage-options.png)

These options are available:

* **Flush** - Write all cached changes to the back-end storage
* **Suspend** - Temporarily stop the storage target from serving requests
* **Resume** - Put a suspended storage target back into service
* **Force remove** - Delete a storage target, skipping some safety steps (**Force remove can cause data loss**)
* **Delete** - Permanently remove a storage target

Some storage targets also have a **Refresh DNS** option on this menu, which updates the storage target IP address from a custom DNS server. This configuration is uncommon.

Read the rest of this article for more detail about these options.

## Write cached files to the storage target

The **Flush** option tells the cache to immediately copy any changed files stored in the cache to the back-end storage system. For example, if your client machines are updating a particular file repeatedly, it is held in the cache for quicker access and not written to the long-term storage system for a period ranging from several minutes to more than an hour.

The **Flush** action tells the cache to write all files to the storage system.

The cache won't accept requests from clients for files on this storage target until after the flush is complete.

You could use this option to make sure that the back-end storage is populated before doing a backup, or for any situation where you want to make sure the back-end storage has recent updates.

This option mainly applies to usage models that include write caching. Read [Understand cache usage models](cache-usage-models.md) to learn more about read and write caching.

## Suspend a storage target

The suspend feature disables client access to a storage target, but doesn't permanently remove the storage target from your cache. You can use this option if you need to disable a back-end storage system for maintenance, repair, or replacement.

## Put a suspended storage target back in service

Use **Resume** to un-suspend a storage target.

## Force remove a storage target

> [!NOTE]
> This option can cause data loss for the affected storage target.

If a storage target can't be removed with a normal delete action, you can use the **Force remove** option to delete it from the Azure HPC Cache.

This action skips the step that synchronizes files in the cache with the files in the back-end storage system. There is no guarantee that any changes written to the HPC Cache will be written to the back-end storage system, so changes can be lost if you use this option.

There also is no guarantee that the back-end storage system will be accessible after it is removed from the cache.

Usually, force remove is used only when a storage target has become unresponsive or otherwise is in a bad state. This option lets you remove the bad storage target instead of having to take more drastic action.
<!-- https://msazure.visualstudio.com/One/_workitems/edit/8267141 -->

## Delete a storage target

You can use the Azure portal or the AZ CLI to delete a storage target.

The regular delete option permanently removes the storage target from the HPC Cache, but first it synchronizes the cache contents with the back-end storage system. It's different from the force delete option, which does not synchronize data.

Deleting a storage target removes the storage system's association with this Azure HPC Cache, but it does not change the back-end storage system. For example, if you used an Azure Blob storage container, the container and its contents still exist after you delete it from the cache. You can add the container to a different Azure HPC Cache, re-add it to this cache, or delete it with the Azure portal.

If there is a large amount of changed data stored in the cache, deleting a storage target can take several minutes to complete. Wait for the action to finish to be sure that the data is safely stored in your long-term storage system.

### [Portal](#tab/azure-portal)

To remove a storage target, open the **Storage targets** page. Click the '...' next to the storage target and choose **Delete** from the menu.

### [Azure CLI](#tab/azure-cli)

[Set up Azure CLI for Azure HPC Cache](./az-cli-prerequisites.md).

Use [az hpc-cache storage-target remove](/cli/azure/hpc-cache/storage-target#az_hpc_cache_storage_target_remove) to delete a storage target from the cache.

```azurecli
$ az hpc-cache storage-target remove --resource-group cache-rg --cache-name doc-cache0629 --name blob1

{- Finished ..
  "endTime": "2020-07-09T21:45:06.1631571+00:00",
  "name": "2f95eac1-aded-4860-b19c-3f089531a7ec",
  "startTime": "2020-07-09T21:43:38.5461495+00:00",
  "status": "Succeeded"
}
```

---

## Update IP address (custom DNS configurations only)

If your cache uses a non-default DNS configuration, it's possible for your NFS storage target's IP address to change because of back-end DNS changes. If your DNS server changes the back-end storage system's IP address, Azure HPC Cache can lose access to the storage system.

Ideally, you should work with the manager of your cache's custom DNS system to plan for any updates, because these changes make storage unavailable.

If you need to update a storage target's DNS-provided IP address, use the **Storage targets** page. Click the **...** symbol in the right column to open the context menu. Choose **Refresh DNS** to query the custom DNS server for a new IP address.

![Screenshot of storage target list. For one storage target, the "..." menu in the far right column is open and two options appear: Delete, and Refresh DNS.](media/refresh-dns.png) <!-- update screenshot if possible -->

If successful, the update should take less than two minutes. You can only refresh one storage target at a time; wait for the previous operation to complete before trying another.

## Next steps

* Learn about [cache-level management actions](hpc-cache-manage.md)
* [Edit a storage target](hpc-cache-edit-storage.md)
