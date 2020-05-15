---
title: Migrate Azure storage resource from Azure Germany to global Azure
description: This article provides information about migrating your Azure storage resources from Azure Germany to global Azure.
author: gitralf
services: germany
cloud: Azure Germany
ms.author: ralfwi 
ms.service: germany
ms.date: 12/12/2018
ms.topic: article
ms.custom: bfmigrate
---

# Migrate storage resources to global Azure

> [!IMPORTANT]
> Since [August 2018](https://news.microsoft.com/europe/2018/08/31/microsoft-to-deliver-cloud-services-from-new-datacentres-in-germany-in-2019-to-meet-evolving-customer-needs/), we have not been accepting new customers or deploying any new features and services into the original Microsoft Cloud Germany locations.
>
> Based on the evolution in customers’ needs, we recently [launched](https://azure.microsoft.com/blog/microsoft-azure-available-from-new-cloud-regions-in-germany/) two new datacenter regions in Germany, offering customer data residency, full connectivity to Microsoft’s global cloud network, as well as market competitive pricing. 
>
> Take advantage of the breadth of functionality, enterprise-grade security, and comprehensive features available in our new German datacenter regions by [migrating](germany-migration-main.md) today.

This article has information that can help you migrate Azure storage resources from Azure Germany to global Azure.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Blobs

AzCopy is a free tool you can use to copy blobs, files, and tables. AzCopy works for Azure-to-Azure, on-premises-to-Azure, and Azure-to-on-premises migrations. Use AzCopy for your migration to copy blobs directly from Azure Germany to global Azure.

If you don't use managed disks for your source VM, use AzCopy to copy the .vhd files to the target environment. Otherwise, you must complete some steps in advance. For more information, see [Recommendations for managed disks](#managed-disks).

The following example shows how AzCopy works. For a complete reference, see the [AzCopy documentation](../storage/common/storage-use-azcopy.md).

AzCopy uses the terms **Source** and **Dest**, expressed as URIs. URIs for Azure Germany always have this format:

```http
https://<storageaccountname>.blob.core.cloudapi.de/<containername>/<blobname>
```

URIs for global Azure always have this format:

```http
https://<storageaccountname>.blob.core.windows.net/<containername>/<blobname>
```

You get the three parts of the URI (*storageaccountname*, *containername*, *blobname*) from the portal, by using PowerShell, or by using the Azure CLI. The name of the blob can be part of the URI or it can be given as a pattern, like *vm121314.vhd*.

You also need the storage account keys to access the Azure Storage account. Get them from the portal, by using PowerShell, or by using the CLI. For example:

```powershell
Get-AzStorageAccountKey -Name <saname> -ResourceGroupName <rgname>
```

As always, you need only one of the two keys for each storage account.

Example:

URI part | example value
-------- | --------------
Source storageAccount | `migratetest`
Source container | `vhds`
Source blob | `vm-121314.vhd`
Target storageAccount | `migratetarget`
Target container | `targetcontainer`

This command copies a virtual hard disk from Azure Germany to global Azure (keys are shortened to improve readability):

```cmd
azcopy -v /source:https://migratetest.blob.core.cloudapi.de/vhds /sourcekey:"0LN...w==" /dest:https://migratetarget.blob.core.windows.net/targetcontainer /DestKey:"o//ucDi5TN...w==" /Pattern:vm-121314.vhd
```

To get a consistent copy of the VHD, shut down the VM before you copy the VHD. Plan some downtime for the copy activity. When the VHD is copied, [rebuild your VM in the target environment](../backup/backup-azure-vms-automation.md#create-a-vm-from-restored-disks).

For more information:

- Review the [AzCopy documentation](../storage/common/storage-use-azcopy.md).
- Learn how to [create a VM from restored disks](../backup/backup-azure-vms-automation.md#create-a-vm-from-restored-disks).

## Managed Disks

Azure Managed Disks simplifies disk management for Azure infrastructure as a service (IaaS) VMs by managing the storage accounts that are associated with the VM disk. 

Because you don't have direct access to the .vhd file, you can't directly use tools like AzCopy to copy your files (see [Blobs](#blobs)). The workaround is to first export the managed disk by getting a temporary shared access signature URI, and then download it or copy it by using this information. The following sections show an example of how to get the shared access signature URI and what to do with it.

### Step 1: Get the shared access signature URI

1. In the portal, search for your managed disk. (It's in the same resource group as your VM. The resource type is **Disk**.)
1. On the **Overview** page, select the **Export** button in the top menu (you have to shut down and deallocate your VM first, or unattach the VM).
1. Define a time for the URI to expire (the default is 3,600 seconds).
1. Generate a URL (this step should take only a few seconds).
1. Copy the URL (it appears only once).

### Step 2: AzCopy

For examples of how to use AzCopy, see [Blobs](#blobs). Use AzCopy (or a similar tool) to copy the disk directly from your source environment to the target environment. In AzCopy, you have to split the URI into the base URI and the shared access signature part. The shared access signature part of the URI begins with the character "**?**". The portal provides this URI for the shared access signature URI:

```http
https://md-kp4qvrzhj4j5.blob.core.cloudapi.de/r0pmw4z3vk1g/abcd?sv=2017-04-17&sr=b&si=22970153-4c56-47c0-8cbb-156a24b6e4b5&sig=5Hfu0qMw9rkZf6mCjuCE4VMV6W3IR8FXQSY1viji9bg%3D>
```

The following commands show the source parameters for AzCopy:

```cmd
/source:"https://md-kp4qvrzhj4j5.blob.core.cloudapi.de/r0pmw4z3vk1g/abcd"
```

```cmd
/sourceSAS:" ?sv=2017-04-17&sr=b&si=22970153-4c56-47c0-8cbb-156a24b6e4b5&sig=5Hfu0qMw9rkZf6mCjuCE4VMV6W3IR8FXQSY1viji9bg%3D"
```

Here's the complete command:

```cmd
azcopy -v /source:"https://md-kp4qvrzhj4j5.blob.core.cloudapi.de/r0pmw4z3vk1g/abcd" /sourceSAS:"?sv=2017-04-17&sr=b&si=22970153-4c56-47c0-8cbb-156a24b6e4b5&sig=5Hfu0qMw9rkZf6mCjuCE4VMV6W3IR8FXQSY1viji9bg%3D" /dest:"https://migratetarget.blob.core.windows.net/targetcontainer/newdisk.vhd" /DestKey:"o//ucD... Kdpw=="
```

### Step 3: Create a new managed disk in the target environment

You have several options for creating a new managed disk. Here's how to do it in the Azure portal:

1. In the portal, select **New** > **Managed Disk** > **Create**.
1. Enter a name for the new disk.
1. Select a resource group.
1. Under **Source type**, select **Storage blob**. Then, either copy the destination URI from the AzCopy command or browse to select the destination URI.
1. If you copied an OS disk, select the **OS** type. For other disk types, select **Create**.

### Step 4: Create the VM

As noted earlier, there are multiple ways to create a VM by using this new managed disk. Here are two options:

- In the portal, select the disk, and then select **Create VM**. Define the other parameters of your VM as usual.
- For PowerShell, see [Create a VM from restored disks](../backup/backup-azure-vms-automation.md#create-a-vm-from-restored-disks).

For more information:

- Learn how to export to disk [via API](/rest/api/compute/disks/grantaccess) by getting a shared access signature URI. 
- Learn how to create a managed disk [via API](/rest/api/compute/disks/createorupdate#create-a-managed-disk-by-importing-an-unmanaged-blob-from-a-different-subscription.) from an unmanaged blob.


## Next steps

Learn about tools, techniques, and recommendations for migrating resources in the following service categories:

- [Compute](./germany-migration-compute.md)
- [Networking](./germany-migration-networking.md)
- [Web](./germany-migration-web.md)
- [Databases](./germany-migration-databases.md)
- [Analytics](./germany-migration-analytics.md)
- [IoT](./germany-migration-iot.md)
- [Integration](./germany-migration-integration.md)
- [Identity](./germany-migration-identity.md)
- [Security](./germany-migration-security.md)
- [Management tools](./germany-migration-management-tools.md)
- [Media](./germany-migration-media.md)

