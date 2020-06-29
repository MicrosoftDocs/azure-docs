---
title: Update Azure HPC Cache storage targets
description: How to edit Azure HPC Cache storage targets
author: ekpgh
ms.service: hpc-cache
ms.topic: how-to
ms.date: 06/25/2020
ms.author: v-erkel
---

# Edit storage targets

You can remove or modify a storage target from the cache's **Storage targets** portal page or by using the Azure CLI.

> [!TIP]
> The [Managing Azure HPC Cache video](https://azure.microsoft.com/resources/videos/managing-hpc-cache/) shows how to edit a storage target in the Azure portal.

## Remove a storage target

### [Portal](#tab/azure-portal)

To remove a storage target, select it in the list and click the **Delete** button.

### [Azure CLI](#tab/azure-cli)

Use [az hpc-cache storage-target remove](/cli/azure/ext/hpc-cache/hpc-cache/storage-target#ext-hpc-cache-az-hpc-cache-storage-target-remove) to delete a storage target from the cache.

---

This action removes the storage target association with this Azure HPC Cache system, but it does not change the back-end storage system. For example, if you used an Azure Blob storage container, the container and its contents still exist after you delete it from the cache. You can add the container to a different Azure HPC Cache, re-add it to this cache, or delete it with the Azure portal.

Any file changes stored in the cache are written to the back-end storage system before the storage target is removed. This process can take an hour or more if a lot of changed data is in the cache.

## Update storage targets

You can edit storage targets to modify some of their properties. Different properties are editable for different types of storage:

* For Blob storage targets, you can change the namespace path.

* For NFS storage targets, you can change these properties:

  * Namespace path
  * Usage model
  * Export
  * Export subdirectory

You can't edit a storage target's name, type, or back-end storage system (Blob container or NFS hostname/IP address). If you need to change these properties, delete the storage target and create a replacement with the new value.

To modify a storage target, click the storage target name to open its details page. Some fields in the page are editable. You also can modify storage targets by using the Azure CLI.

![screenshot of the edit page for an NFS storage target](media/hpc-cache-edit-storage-nfs.png)

## Update an NFS storage target

For an NFS storage target, you can update several properties. (Refer to the screenshot above for an example edit page.)

* **Usage model** - The usage model influences how the cache retains data. Read [Choose a usage model](hpc-cache-add-storage.md#choose-a-usage-model) to learn more.
* **Virtual namespace path** - The path that clients use to mount this storage target. Read [Plan the aggregated namespace](hpc-cache-namespace.md) for details.
* **NFS export path** - The storage system export to use for this namespace path.
* **Subdirectory path** - The subdirectory (under the export) to associate with this namespace path. Leave this field blank if you don't need to specify a subdirectory.

Each namespace path needs a unique combination of export and subdirectory. That is, you can't make two different client-facing paths to the exact same directory on the back-end storage system.

### [Portal](#tab/azure-portal)

After making changes, click **OK** to update the storage target, or click **Cancel** to discard changes.

### [Azure CLI](#tab/azure-cli)

Use the [az nfs-storage-target](/cli/azure/ext/hpc-cache/hpc-cache/nfs-storage-target) command to change the <!--IP address, -->usage model, virtual namespace path, and NFS export or subdirectory values for a storage target.

<!-- test if you can actually do this??? -->
<!-- * To change the storage IP or hostname, use the ``--nfs3-target`` option. Example: ``--nfs3-target 10.0.44.44``-->

* To change the usage model, use the ``--nfs3-usage-model`` option. Example: ``--nfs3-usage-model WRITE_WORKLOAD_15``

* To change the namespace path, export, or export subdirectory, use the ``--junction`` option. 

  The ``--junction`` parameter uses these values:

  * ``namespace-path`` - The client-facing virtual file path
  * ``nfs-export`` - The storage system export to associate with the client-facing path
  * ``target-path`` (optional) - A subdirectory of the export, if needed

  Example: ``--junction namespace-path="/nas-1" nfs-export="/datadisk1" target-path="/test"``

The cache name, storage target name, and resource group are required in all update commands.

Example:

```azurecli
az hpc-cache nfs-storage-target update --cache-name mycache \
    --name rivernfs0 --resource-group doc-rg0619 \
    --junction namespace-path="/nfs1/data2" nfs-export="/datadisk2" target-path=""
```

If the cache is stopped or not in a healthy state, the update applies after the cache is healthy.

---

## Update an Azure Blob storage target

For a blob storage target, you can modify the virtual namespace path.

### [Portal](#tab/azure-portal)

The details page for a Blob storage target lets you modify the virtual namespace path.

![screenshot of the edit page for a blob storage target](media/hpc-cache-edit-storage-blob.png)

When finished, click **OK** to update the storage target, or click **Cancel** to discard changes.

### [Azure CLI](#tab/azure-cli)

Use [az hpc-cache blob-storage-target update](/cli/azure/ext/hpc-cache/hpc-cache/blob-storage-target#ext-hpc-cache-az-hpc-cache-blob-storage-target-update) to update a target's namepace path.

```azurecli
az hpc-cache blob-storage-target update --cache-name name --name target-name \
   --resource-group rg --virtual-namespace-path "/new/path"
```

If the cache is stopped or not in a healthy state, the update will apply after the cache is healthy.

---

## Next steps

* Read [Add storage targets](hpc-cache-add-storage.md) to learn more about these options.
* Read [Plan the aggregated namespace](hpc-cache-namespace.md) for more tips about using virtual paths.
