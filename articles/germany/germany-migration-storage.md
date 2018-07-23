---
title: Migration from Azure Germany compute resources to public Azure
description: Provides help for migrating storage resources
author: gitralf
ms.author: ralfwi 
ms.date: 7/20/2018
ms.topic: article
ms.custom: bfmigrate
---

# Storage

## Blob

AzCopy is a free tool to help you copy blobs, files and tables from Azure to Azure (and blobs or files from on-premise to Azure and vice versa). AzCopy can copy blobs directly from Azure Germany to public Azure, without first downloading and then uploading it. AzCopy can copy the vhd files from your VM, but only if you are using non-managed disks. For managed disks, please look at the [recommendations](#managed-disks). Here is a short example how it works, don't forget to look at the [AzCopy documentation](../storage/common/storage-use-azcopy.md) for complete reference.

AzCopy uses the terms **Source** and **Dest**, the meaning should be obvious. Those are expressed as URIs, and the URIs always look like this for Azure Germany:

    https://<storageaccountname>.blob.core.cloudapi.de/<containername>/<blobname>

and for public Azure:

    https://<storageaccountname>.blob.core.windows.net/<containername>/<blobname>

All we need are the 3 parts to form the URI. You can get the parts from the portal or PowerShell or CLI and put them together. The blob name can be given in the URI or as a pattern, like "vm121314.vhd"

For access to the stograe account, we need the storage keys. Those can be obtained also from portal, PowerShell and CLI. For example in PowerShell:

    Get-AzureRmStorageAccountKey -Name <saname> -ResourceGroupName <rgname>

You need only one of the two keys available for each storage account.

To copy a virtual hard disk (.vhd) from Azure Germany to public Azure, your AzCopy commandline looks something like this (I shortened the keys here):

    azcopy -v /source:https://migratetest.blob.core.cloudapi.de/vhds /sourcekey:"0LN...BB9w==" /dest:https://migratetarget.blob.core.windows.net/targetcontainer /DestKey:"o//ucDi5TN...Kdpw==" /Pattern:vm-121314.vhd

To get a consistent copy of the VHD, shutdown the VM before copying and plan some downtime. When copied, here xxx is a short example how to re-build your VM in the target environment.

### Links

- [AzCopy Documentation](../storage/common/storage-use-azcopy.md)
- [Restore VM from vhd](xxx)


## Disks

"Managed Disks" is a service available in Azure that takes away the need from you to deal with storage accounts for VMs by managing this in the background. Since you don't have direct access to the storage where the managed disks are kept, you can't use tools like AzCopy (see [Storage Migration documentation](#blob) to copy your .vhd files directly. The workaround is to export the managed disk first by getting a temporary, specifically created SAS URI and to download/copy it with this information. Here is a short example how to get the SAS URI and what to do with it:

### Step 1: Get SAS URI

- Go to the portal, search for your managed disk (in the same resource group as your VM, the resource type is "Disk").
- In the "Overview", look for the "Export" button in the top ribbon, and click it (you have to shutdown and deallocate your VM first, or unattach it).
- Define a time when the URI expires (default is 3600 seconds as said above)
- Generate URL (should only take a few seconds)
- Copy the URL (displayed only once)

### Step 2: AzCopy

AzCopy is also described at [Blob Migration](#blob). Use it (or any other tool) to copy the disk directly from your source environment to the target environment. For AzCopy you have to split the URI into the base URI and the SAS part starting with the character "?". Let's say your SAS URI looks like this:

    <https://md-kp4qvrzhj4j5.blob.core.cloudapi.de/r0pmw4z3vk1g/abcd?sv=2017-04-17&sr=b&si=22970153-4c56-47c0-8cbb-156a24b6e4b5&sig=5Hfu0qMw9rkZf6mCjuCE4VMV6W3IR8FXQSY1viji9bg%3D>

The source parameters for AzCopy are

    /source:" <https://md-kp4qvrzhj4j5.blob.core.cloudapi.de/r0pmw4z3vk1g/abcd>"

    /sourceSAS:" ?sv=2017-04-17&sr=b&si=22970153-4c56-47c0-8cbb-156a24b6e4b5&sig=5Hfu0qMw9rkZf6mCjuCE4VMV6W3IR8FXQSY1viji9bg%3D"

And the complete commandline looks like this:

    azcopy -v /source:\"https://md-kp4qvrzhj4j5.blob.core.cloudapi.de/r0pmw4z3vk1g/abcd\" /sourceSAS:\"?sv=2017-04-17&sr=b&si=22970153-4c56-47c0-8cbb-156a24b6e4b5&sig=5Hfu0qMw9rkZf6mCjuCE4VMV6W3IR8FXQSY1viji9bg%3D\" /dest:\"https://migratetarget.blob.core.windows.net/targetcontainer/newdisk.vhd\" /DestKey:\"o//ucD... Kdpw==\"

### Step 3: Create a new managed disk in the target environment

For creating a new managed disk there are several options. We are looking for the portal option:

- In the portal, select New, Managed Disk, and Create.
- Give the new disk a name
- select a resource group as usual
- Under *Source type*, select *Storage blob* and either copy the URI from the AzCopy command (the destination URI of course), or browse and select.
- If you copied a OS disk, choose the OS type, otherwise click create.

### Step 4: create the VM

Again, there are various ways to create a VM with this new managed disk.

In the portal, select the disk, click the button *Create VM* at the top ribbon, and go on defining the other parameters of your VM as usual.

Using PowerShell, this can be done as [described in his article.](../backup/backup-azure-vms-automation\#create-a-vm-from-restored-disks.md)

### Links

- Export by getting a SAS URI to a disk and then downloading/copying [via API](https://docs.microsoft.com/en-us/rest/api/compute/disks/grantaccess)
- Import (or Create) from unmanaged account [via API]( https://docs.microsoft.com/en-us/rest/api/compute/disks/createorupdate\#create\_a\_managed\_disk\_by\_importing\_an\_unmanaged\_blob\_from\_a\_different\_subscription)
