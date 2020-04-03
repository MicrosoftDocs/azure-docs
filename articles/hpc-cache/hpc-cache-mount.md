---
title: Mount an Azure HPC Cache
description: How to connect clients to an Azure HPC Cache service
author: ekpgh
ms.service: hpc-cache
ms.topic: conceptual
ms.date: 04/03/2020
ms.author: rohogue
---

# Mount the Azure HPC Cache

After the cache is created, NFS clients can access it with a simple `mount` command. The command connects a specific storage target path on the Azure HPC Cache to a local directory on the client machine.

The mount command is made up of these elements:

* One of the cache's mount addresses (listed on the cache overview page)
* The virtual namespace path that you set when you created the storage target
* The local path to use on the client
* Command parameters that optimize the success of this kind of NFS mount

The **Mount instructions** page for your cache collects the information and the recommended options for you, and creates a prototype mount command that you can copy. Read [Use the mount instructions utility](#use-the-mount-instructions-utility) for details.

## Prepare clients

Make sure your clients are able to mount the Azure HPC Cache by following the guidelines in this section.

### Provide network access

The client machines must have network access to the cache's virtual network and private subnet.

For example, create client VMs within the same virtual network, or use an endpoint, gateway, or other solution in the virtual network for access from outside. (Remember that nothing other than the cache itself should be hosted inside the cache's subnet.)

### Install utilities

Install the appropriate Linux utility software to support the NFS mount command:

* For Red Hat Enterprise Linux or SuSE: `sudo yum install -y nfs-utils`
* For Ubuntu or Debian: `sudo apt-get install nfs-common`

### Create a local path

Create a local directory path on each client to connect to the cache. Create a path for each storage target that you want to mount.

Example: `sudo mkdir -p /mnt/hpc-cache-1/target3`

## Use the mount instructions utility

Open the **Mount instructions** page from the **Configure** section of the cache view in the Azure portal.

![screenshot of an Azure HPC Cache instance in the portal, with the Configure > Mount instructions page loaded](media/mount-instructions.png)

The mount command page includes information about the client mount process and prerequisites, plus fields you can use to create a copyable mount command.

To use this page, follow this procedure:

<!--1.  In step one of **Mounting your file system**, enter the path that the client will use to access the Azure HPC Cache storage target.

   * This path is local to the client.
   * After you provide the directory name, the field populates with a command you can copy. Use this command on the client directly or in a setup script to create the directory path on the client VM. -->

1. Review the client prerequisites and install the utilities needed to use the NFS `mount` command as described above in [Prepare clients](#prepare-clients).

1. Step one of **Mounting your file system**<!-- label will change --> gives an example command for creating the local path on the client. This is the path that the client will use to access the content from the Azure HPC Cache.

   Note the path name so that you can modify it in the command if needed.

1. In step two, select one of the available IP addresses. All of the cache's [client mount points](#find-mount-command-components) are listed here. Make sure that you have a system to balance load among all IP addresses.

1. The field in step three automatically populates with a prototype mount command. Click the copy symbol at the right side of the field to automatically copy it to your clipboard.

   > [!NOTE]
   > Check the copy command before using it. You might need to customize the client mount path and the storage target virtual namespace path, which are not yet selectable in this interface. You also should update the mount command options to reflect the [recommended options](#mount-command-options) below. Read [Understand mount command syntax](#understand-mount-command-syntax) for help.

1. Use the copied mount command (with edits, if needed) on the client machine to connect it to the storage target on the Azure HPC Cache. You can issue the command directly from the client command line, or include the mount command in a client setup script or template.

## Understand mount command syntax

The mount command has the following form:

> sudo mount *cache_mount_address*:/*namespace_path* *local_path* {*options*}

Example:

```bash
root@test-client:/tmp# mkdir hpccache
root@test-client:/tmp# sudo mount 10.0.0.28:/blob-demo-0722 ./hpccache/ -o hard,proto=tcp,mountproto=tcp,retry=30
root@test-client:/tmp#
```

After this command succeeds, the contents of the storage export will be visible in the ``hpccache`` directory on the client.

### Mount command options

For a robust client mount, pass these settings and arguments in your mount command:

> mount -o hard,proto=tcp,mountproto=tcp,retry=30 ${CACHE_IP_ADDRESS}:/${NAMESPACE_PATH} ${LOCAL_FILESYSTEM_MOUNT_POINT}

| Recommended mount command settings | |
--- | ---
``hard`` | Soft mounts to Azure HPC Cache are associated with application failures and possible data loss.
``proto=tcp`` | This option supports appropriate handling of NFS network errors.
``mountproto=tcp`` | This option supports appropriate handling of network errors for mount operations.
``retry=<value>`` | Set ``retry=30`` to avoid transient mount failures. (A different value is recommended in foreground mounts.)

### Find mount command components

If you want to create a mount command without using the **Mount instructions** page, you can find the mount addresses on the cache **Overview** page and the virtual namespace paths on the **Storage targets** page.

![screenshot of Azure HPC Cache instance's Overview page, with a highlight box around the mount addresses list on the lower right](media/hpc-cache-mount-addresses.png)

> [!NOTE]
> The cache mount addresses correspond to network interfaces inside the cache's subnet. In a resource group, these NICs are listed with names ending in `-cluster-nic-` and a number. Do not alter or delete these interfaces, or the cache will become unavailable.

The virtual namespace paths are shown in the **Storage targets** page. Click an individual storage target name to see its details, including aggregated namespace paths associated with it.

![screenshot of the cache's Storage target panel, with a highlight box around an entry in the Path column of the table](media/hpc-cache-view-namespace-paths.png)

## Next steps

* To move data to the cache's storage targets, read [Populate new Azure Blob storage](hpc-cache-ingest.md).
