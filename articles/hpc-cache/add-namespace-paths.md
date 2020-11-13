---
title: Configure the Azure HPC Cache aggregated namespace
description: How to create client-facing paths for back-end storage with Azure HPC Cache
author: ekpgh
ms.service: hpc-cache
ms.topic: how-to
ms.date: 09/30/2020
ms.author: v-erkel
---

# Set up the aggregated namespace

After you create storage targets, you must also create namespace paths for them. Client machines use these virtual paths to access files through the cache instead of connecting to the back-end storage directly. This system lets cache administrators change back-end storage systems without having to rewrite client instructions.

Read [Plan the aggregated namespace](hpc-cache-namespace.md) to learn more about this feature.

The **Namespace** page in the Azure portal shows the paths that clients use to access your data through the cache. Use this page to create, remove, or change namespace paths. You also can configure namespace paths by using the Azure CLI.

All of the existing client-facing paths are listed on the **Namespace** page. If a storage target does not have any paths, it does not appear in the table.

You can sort the table columns by clicking the arrows and better understand your cache's aggregated namespace.

![screenshot of portal namespace page with two paths in a table. Column headers: Namespace path, Storage target, Export path, and Export subdirectory. The items in the first column are clickable links. Top buttons: Add namespace path, refresh, delete](media/namespace-page.png)

## Add or edit client-facing namespace paths

You must create at least one namespace path before clients can access the storage target. (Read [Mount the Azure HPC Cache](hpc-cache-mount.md) for more about client access.)

### Blob namespace paths

An Azure Blob storage target can have only one namespace path.

Follow the instructions below to set or change the path with the Azure portal or Azure CLI.

### [Portal](#tab/azure-portal)

From the Azure portal, load the **Namespace** settings page. You can add, change, or delete namespace paths from this page.

* **Add a new path:** Click the **+ Add** button at the top and fill in information in the edit panel.

  * Select the storage target from the drop-down list. (In this screenshot, the blob storage target can't be selected because it already has a namespace path.)

    ![Screenshot of the new namespace edit fields with the storage target selector exposed](media/namespace-select-storage-target.png)

  * For an Azure Blob storage target, the export and subdirectory paths are automatically set to ``/``.

* **Change an existing path:** Click the namespace path. The edit panel opens and you can modify the path.

  ![Screenshot of the namespace page after clicking on a Blob namespace path - the edit fields appear on a pane to the right](media/edit-namespace-blob.png)

* **Delete a namespace path:** Select the checkbox to the left of the path and click the **Delete** button.

### [Azure CLI](#tab/azure-cli)

[!INCLUDE [cli-reminder.md](includes/cli-reminder.md)]

When using the Azure CLI, you must add a namespace path when you create the storage target. Read [Add a new Azure Blob storage target](hpc-cache-add-storage.md?tabs=azure-cli#add-a-new-azure-blob-storage-target) for details.

To update the target's namespace path, use the [az hpc-cache blob-storage-target update](/cli/azure/ext/hpc-cache/hpc-cache/blob-storage-target#ext-hpc-cache-az-hpc-cache-blob-storage-target-update) command. The arguments for the update command are similar to the arguments in the create command, except that you do not pass the container name or storage account.

You cannot delete a namespace path from a blob storage target with the Azure CLI, but you can overwrite the path with a different value.

---

### NFS namespace paths

An NFS storage target can have multiple virtual paths, as long as each path represents a different export or subdirectory on the same storage system.

When planning your namespace for an NFS storage target, keep in mind that each path must be unique, and can't be a subdirectory of another namespace path. For example, if you have a namespace path that is called ``/parent-a``, you can't also create namespace paths like ``/parent-a/user1`` and ``/parent-a/user2``. Those directory paths are already accessible in the namespace as subdirectories of ``/parent-a``.

All of the namespace paths for an NFS storage system are created on one storage target. Most cache configurations can support up to ten namespace paths per storage target, but larger configurations can support up to 20.

This list shows the maximum number of namespace paths per configuration.

* Up to 2 GB/s throughput:

  * 3 TB cache - 10 namespace paths
  * 6 TB cache - 10 namespace paths
  * 23 TB cache - 20 namespace paths

* Up to 5 GB/s throughput:

  * 6 TB cache - 10 namespace paths
  * 12 TB cache - 10 namespace paths
  * 24 TB cache -20 namespace paths

* Up to 8 GB/s throughput:

  * 12 TB cache - 10 namespace paths
  * 24 TB cache - 10 namespace paths
  * 48 TB cache - 20 namespace paths

For each NFS namespace path, provide the client-facing path, the storage system export, and optionally an export subdirectory.

### [Portal](#tab/azure-portal)

From the Azure portal, load the **Namespace** settings page. You can add, edit, or delete namespace paths from this page.

* **To add a new path:** Click the **+ Add** button at the top and fill in information in the edit panel.
* **To change an existing path:** Click the namespace path. The edit panel opens and you can modify the path.
* **To delete a namespace path:** Select the checkbox to the left of the path and click the **Delete** button.

Fill in these values for each namespace path:

* **Namespace path** - The client-facing file path.

* **Storage target** - If creating a new namespace path, select a storage target from the drop-down menu.

* **Export path** - Enter the path to the NFS export. Make sure to type the export name correctly - the portal validates the syntax for this field but does not check the export until you submit the change.

* **Export subdirectory** - If you want this path to mount a specific subdirectory of the export, enter it here. If not, leave this field blank.

![screenshot of the portal namespace page with the update page open at the right](media/update-namespace-nfs.png)

### [Azure CLI](#tab/azure-cli)

[!INCLUDE [cli-reminder.md](includes/cli-reminder.md)]

When using the Azure CLI, you must add at least one namespace path when you create the storage target. Read [Add a new NFS storage target](hpc-cache-add-storage.md?tabs=azure-cli#add-a-new-nfs-storage-target) for details.

To update the target's namespace path or to add additional paths, use the [az hpc-cache nfs-storage-target update](/cli/azure/ext/hpc-cache/hpc-cache/nfs-storage-target#ext-hpc-cache-az-hpc-cache-nfs-storage-target-update) command. Use the ``--junction`` option to specify all of the namespace paths you want.

The options used for the update command are similar to the "create" command, except that you do not pass the storage system information (IP address or hostname), and the usage model is optional. Read [Add a new NFS storage target](hpc-cache-add-storage.md?tabs=azure-cli#add-a-new-nfs-storage-target) for more details about the syntax of the ``--junction`` option.

---

## Next steps

After creating the aggregated namespace for your storage targets, you can mount clients on the cache. Read these articles to learn more.

* [Mount the Azure HPC Cache](hpc-cache-mount.md)
* [Move data to Azure Blob storage](hpc-cache-ingest.md)
