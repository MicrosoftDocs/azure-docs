---
title: Migration from Azure Germany storage resources to global Azure
description: This article provides help for migrating storage resources from Azure Germany to global Azure
author: gitralf
services: germany
cloud: Azure Germany
ms.author: ralfwi 
ms.service: germany
ms.date: 8/15/2018
ms.topic: article
ms.custom: bfmigrate
---

# Migration from Azure Germany storage resources to global Azure

This article will provide you some help for the migration of Azure Storage resources from Azure Germany to global Azure.

## Blobs

AzCopy is a free tool to help you copy blobs, files, and tables. AzCopy works from Azure to Azure, from on-premise to Azure and from Azure to on-premise. Use AzCopy for your migration to copy blobs directly between Azure Germany to global Azure.

If you have non-managed disks for your source VM, use AzCopy to copy the `.vhd` files to the target environment. Otherwise, you need some steps in advance, see [recommendations for Managed Disks](#managed-disks) further down.

Here's a short example how AzCopy works, for a complete reference look at the [AzCopy documentation](../storage/common/storage-use-azcopy.md).

AzCopy uses the terms *Source* and *Dest*, expressed as URIs. URIs for Azure Germany always have this format:

```http
https://<storageaccountname>.blob.core.cloudapi.de/<containername>/<blobname>
```

and for global Azure:

```http
https://<storageaccountname>.blob.core.windows.net/<containername>/<blobname>
```

You get the three parts (*storageaccountname*, *containername*, *blobname*) for the URI from the portal, with PowerShell, or with CLI. The name of the blob can be part of the URI or given as a pattern, like *vm121314.vhd*.

You also need the storage account keys to access the storage account. Get them from the portal, PowerShell, or CLI. For example:

```powershell
Get-AzureRmStorageAccountKey -Name <saname> -ResourceGroupName <rgname>
```

As always, you need only one of the two keys available for each storage account.

Example:
URI part | example value
-------- | --------------
Source storageAccount | `migratetest`
Source container | `vhds`
Source blob | `vm-121314.vhd`
Target storageAccount | `migratetarget`
Target container | `targetcontainer`

This command copies a virtual hard disk from Azure Germany to global Azure (keys are shortened for better readability):

```cmd
azcopy -v /source:https://migratetest.blob.core.cloudapi.de/vhds /sourcekey:"0LN...w==" /dest:https://migratetarget.blob.core.windows.net/targetcontainer /DestKey:"o//ucDi5TN...w==" /Pattern:vm-121314.vhd
```

To get a consistent copy of the VHD, shutdown the VM before copying and plan some downtime. When copied, [follow these instructions](../backup/backup-azure-vms-automation.md#create-a-vm-from-restored-disks) to rebuild your VM in the target environment.

### Links

- [AzCopy Documentation](../storage/common/storage-use-azcopy.md)
- [Create VM from restored disks](../backup/backup-azure-vms-automation.md#create-a-vm-from-restored-disks)















## Disks

Azure Managed Disks simplifies disk management for Azure IaaS VMs by managing the storage accounts associated with the VM disk. Since you don't have direct access to the `.vhd`, you can't directly use tools like AzCopy (see [Storage Migration](#blobs) to copy your files. The workaround is to first export the managed disk by getting a temporary SAS URI and to download or copy it with this information. Here's a short example how to get the SAS URI and what to do with it:

### Step 1: Get SAS URI

- Go to the portal, search for your managed disk (in the same resource group as your VM, the resource type is "Disk").
- In the `Overview`, look for the `Export` button in the top ribbon, and click it (you have to shut down and deallocate your VM first, or unattach it).
- Define a time when the URI expires (default is 3600 seconds)
- Generate URL (should only take a few seconds)
- Copy the URL (displayed only once)

### Step 2: AzCopy

Examples on how to use AzCopy are provided further up this article at [Blob Migration](#blobs). Use it (or an other tool) to copy the disk directly from your source environment to the target environment. For AzCopy, you have to split the URI into the base URI and the SAS part starting with the character "?". If this is the SAS URI the portal provides:

```http
https://md-kp4qvrzhj4j5.blob.core.cloudapi.de/r0pmw4z3vk1g/abcd?sv=2017-04-17&sr=b&si=22970153-4c56-47c0-8cbb-156a24b6e4b5&sig=5Hfu0qMw9rkZf6mCjuCE4VMV6W3IR8FXQSY1viji9bg%3D>
```

The source parameters for AzCopy would be:

```cmd
/source:"https://md-kp4qvrzhj4j5.blob.core.cloudapi.de/r0pmw4z3vk1g/abcd"
```

and

```cmd
/sourceSAS:" ?sv=2017-04-17&sr=b&si=22970153-4c56-47c0-8cbb-156a24b6e4b5&sig=5Hfu0qMw9rkZf6mCjuCE4VMV6W3IR8FXQSY1viji9bg%3D"
```

And the complete command line:

```cmd
azcopy -v /source:"https://md-kp4qvrzhj4j5.blob.core.cloudapi.de/r0pmw4z3vk1g/abcd" /sourceSAS:"?sv=2017-04-17&sr=b&si=22970153-4c56-47c0-8cbb-156a24b6e4b5&sig=5Hfu0qMw9rkZf6mCjuCE4VMV6W3IR8FXQSY1viji9bg%3D" /dest:"https://migratetarget.blob.core.windows.net/targetcontainer/newdisk.vhd" /DestKey:"o//ucD... Kdpw=="
```

### Step 3: Create a new managed disk in the target environment

There are several options to create a new managed disk, for example via portal:

- In the portal, select `New` > `Managed Disk` > `Create`.
- Give the new disk a name
- select a resource group as usual
- Under `Source type`, select *Storage blob* and either copy the destination URI from the AzCopy command, or browse to select.
- If you copied an OS disk, choose the OS type, otherwise click `Create`.

### Step 4: create the VM

Again, there are various ways to create a VM with this new managed disk.

In the portal, select the disk and click `Create VM` at the top ribbon. Define the other parameters of your VM as usual.

For PowerShell follow [this article](../backup/backup-azure-vms-automation.md#create-a-vm-from-restored-disks) to create a VM from a restored disk.

### Links

- Export to disk [via API](/rest/api/compute/disks/grantaccess.md) by getting a SAS URI 
- Create a managed disk [via API](/rest/api/compute/disks/createorupdate.md#create_a_managed_disk_by_importing_an_unmanaged_blob_from_a_different_subscription) from an unmanaged blob
