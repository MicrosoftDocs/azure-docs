---
title: Troubleshoot issues with shared images in Azure 
description: Learn how to troubleshoot issues with shared image galleries.
author: cynthn
ms.service: virtual-machines
ms.subservice: imaging
ms.topic: troubleshooting
ms.workload: infrastructure
ms.date: 10/27/2020
ms.author: cynthn
ms.reviewer: cynthn

---

# Troubleshooting shared image galleries in Azure

If you run into issues while performing any operations on shared image galleries, image definitions, and image versions, run the failing command again in debug mode. Debug mode is activated by passing the `--debug` switch with CLI and the `-Debug` switch with PowerShell. Once you’ve located the error, follow this document to troubleshoot the errors.


**Issues with creating or modifying a gallery**

*Gallery name is invalid. Allowed characters are English alphanumeric characters, with underscores and periods allowed in the middle, up to 80 characters total. All other special characters, including dashes, are disallowed.*  
<u>Cause</u>: The given name for the gallery does not meet the naming requirements.  
<u>Workaround</u>: Choose a name that meets the following conditions: 1) 80-character limit, 2) contains only English letters, numbers, underscores and periods, 3) starts and ends with English letters or numbers.

*The entity name 'galleryName' is invalid according to its validation rule: ^[^\_\W][\w-.\_]{0,79}(?<![-.])$.*  
<u>Cause</u>: The gallery name does not meet the naming requirements.  
<u>Workaround</u>: Choose a name for the gallery that meets the following conditions: 1) 80-character limit, 2) contains only English letters, numbers, underscores and periods, 3) starts and ends with English letters or numbers.

*The provided resource name <galleryName\> has these invalid trailing characters: <character\>. The name can not end with characters: <character\>*  
<u>Cause</u>: The name for the gallery ends with a period or underscore.  
<u>Workaround</u>: Choose a name for the gallery that meets the following conditions: 1) 80-character limit, 2) contains only English letters, numbers, underscores and periods, 3) starts and ends with English letters or numbers.

*The provided location <region\> is not available for resource type 'Microsoft.Compute/galleries'. List of available regions for the resource type is …*  
<u>Cause</u>: The region specified for the gallery is incorrect or requires an access request.  
<u>Workaround</u>: Check that the region name is spelled correctly. You can run this command to see what regions you have access to. If the region is not listed in the list, submit [an access request](troubleshoot/azure/general/region-access-request-process).

*Can not delete resource before nested resources are deleted.*  
<u>Cause</u>: You have attempted to delete a gallery that contains at least one existing image definition. A gallery must be empty before it can be deleted.  
<u>Workaround</u>: Delete all image definitions inside the gallery and then proceed to delete the gallery. If the image definition contains image versions, the image versions must be deleted before deleting the image definitions.

*The resource <galleryName\> already exists in location <region\_1\> in resource group <resourceGroup\>. A resource with the same name cannot be created in location <region\_2\>. Please select a new resource name.*  
<u>Cause</u>: You already have an existing gallery in the resource group with the same name and have tried to create another gallery with the same name but in a different region.  
<u>Workaround</u>: Either use a different gallery or a different resource group.

**Issues with creating or modifying image definitions**

*Changing property 'galleryImage.properties.<property\>' is not allowed.*  
<u>Cause</u>: You attempted to change the OS type, OS state, hyper V generation, offer, publisher, SKU. Changing any of these properties is not permitted.  
<u>Workaround</u>: Create a new image definition instead.

*The resource <galleryName/imageDefinitionName\> already exists in location <region\_1\> in resource group <resourceGroup\>. A resource with the same name cannot be created in location <region\_2\>. Please select a new resource name.*  
<u>Cause</u>: You already have an existing image definition in the same gallery and resource group with the same name and have tried to create another image definition with the same name and in the same gallery but in a different region.  
<u>Workaround</u>: Use a different name for the image definition or put the image definition in a different gallery or resource group

*The provided resource name <galleryName\>/<imageDefinitionName\> has these invalid trailing characters: <character\>. The name can not end with characters: <character\>*  
<u>Cause</u>: The given <imageDefinitionName\> ends with a period or underscore.  
<u>Workaround</u>: Choose a name for the image definition that meets the following conditions: 1) 80-character limit, 2) contains only English letters, numbers, hyphens, underscores and periods, 3) starts and ends with English letters or numbers.

*The entity name <imageDefinitionName\> is invalid according to its validation rule: ^[^\_\\W][\\w-.\_]{0,79}(?<![-.])$"*  
<u>Cause</u>: The given <imageDefinitionName\> ends with a period or underscore.  
<u>Workaround</u>: Choose a name for the image definition that meets the following conditions: 1) 80-character limit, 2) contains only English letters, numbers, hyphens, underscores and periods, 3) starts and ends with English letters or numbers.

*Asset name galleryImage.properties.identifier.<property\> is not valid. It cannot be empty. Allowed characters are uppercase or lowercase letters, digits, hyphen(-), period (.), underscore (\_). Names are not allowed to end with period(.). The length of the name cannot exceed <number\> characters.*  
<u>Cause</u>: The given publisher, offer or SKU value does not meet the naming requirements.  
<u>Workaround</u>: Choose a value that meets the following conditions: 1) 128-character limit for publisher or 64-character limit for offer and SKU, 2) contains only English letters, numbers, hyphens, underscores and periods and 3) does not end with a period.

*Can not perform requested operation on nested resource. Parent resource <galleryName\> not found.*  
<u>Cause</u>: There is no gallery with the name <galleryName\> in the current subscription and resource group.  
<u>Workaround</u>: Check that the name of the gallery, the subscription and resource group are correct. Otherwise, create a new gallery named <galleryName\>.

*The provided location <region\> is not available for resource type 'Microsoft.Compute/galleries'. List of available regions for the resource type is …*  
<u>Cause</u>: The <region\> is incorrect or requires an access request  
<u>Workaround</u>: Check that the region name is spelled correctly. You can run this command to see what regions you have access to. If the region is not listed in the list, submit [an access request](troubleshoot/azure/general/region-access-request-process).

*Unable to serialize value: <value\> as type: 'iso-8601'., ISO8601Error: ISO 8601 time designator 'T' missing. Unable to parse datetime string <value\>*  
<u>Cause</u>: The value provided to property is not properly formatted as a date.  
<u>Workaround</u>: Provide a date in the yyyy-MM-dd, yyyy-MM-dd'T'HH:mm:sszzz or [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601)-valid format.

*Could not convert string to DateTimeOffset: <value\>. Path 'properties.<property\>'*  
<u>Cause</u>: The value provided to property is not properly formatted as a date.  
<u>Workaround</u>: Provide a date in the yyyy-MM-dd, yyyy-MM-dd'T'HH:mm:sszzz or [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601)-valid format.

*EndOfLifeDate must be set to a future date.*  
<u>Cause</u>: The end-of-life date property is not properly formatted as a date that is after today's date.  
<u>Workaround</u>: Provide a date in the yyyy-MM-dd, yyyy-MM-dd'T'HH:mm:sszzz or [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601)-valid format.

*argument --<property\>: invalid int value: <value\>*  
<u>Cause</u>: <property\> accepts only integer values and <value\> is not an integer.  
<u>Workaround</u>: Choose an integer value.

*The minimum value of <property\> must not be greater than the maximum value of <property\>.*  
<u>Cause</u>: The minimum value provided for <property\> is higher than the maximum value provided for <property\>.  
<u>Workaround</u>: Change the values so that the minimum is less than or equal to maximum.

*Gallery image: <imageDefinitionName\> identified by (publisher:<Publisher\>, offer:<Offer\>, sku:<SKU\>) already exists. Choose a different publisher, offer, sku combination.*  
<u>Cause</u>: You have tried to create a new image definition with the same publisher, offer, SKU triplet as an existing image definition in the same gallery.  
<u>Workaround</u>: Within a given gallery, all image definitions must have a unique combination of publisher, offer, SKU. Choose a unique combination or choose a new gallery and create the image definition again.

*Can not delete resource before nested resources are deleted.*  
<u>Cause</u>: You have attempted to delete an image definition that contains image versions. An image definition must be empty before it can be deleted.  
<u>Workaround</u>: Delete all image versions inside the image definition and then proceed to delete the image definition.

*Cannot bind parameter <property\>. Cannot convert value <value\> to type <propertyType\>*  
<u>Cause</u>: <property\> has a restricted list of possible values and <value\> is not one of them.  
<u>Workaround</u>: Check that you are using one of the allowed values from this table. (Link to table of allowed values)

*Cannot bind parameter <property\>. Cannot convert value <value\> to type <propertyType\>. Unable to match the identifier name <value\> to a valid enumerator name. Specify one of the following enumerator names and try again: <choice1\>, <choice2\>, …*  
<u>Cause</u>: The property has a restricted list of possible values and <value\> is not one of them.  
<u>Workaround</u>: Choose one of the possible <choice\> values.

*Cannot bind parameter <property\>. Cannot convert value <value\> to type &quot;System.DateTime&quot;*  
<u>Cause</u>: The value provided to property is not properly formatted as a date.  
<u>Workaround</u>: Provide a date in the yyyy-MM-dd, yyyy-MM-dd'T'HH:mm:sszzz or [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601)-valid format.

*Cannot bind parameter <property\>. Cannot convert value <value\> to type &quot;System.Int32&quot;*  
<u>Cause</u>: <property\> accepts only integer values and <value\> is not an integer.  
<u>Workaround</u>: Choose an integer value.

*ZRS storage account type is not supported in this region.*  
<u>Cause</u>: ZRS storage account type is used in a region that does not yet support this.  
<u>Workaround</u>: Change the storage account type to 'Premium\_LRS' or 'Standard\_LRS'. Please check our documentation for the latest [list of regions](azure/storage/common/storage-redundancy#zone-redundant-storage) with ZRS preview enabled.

**Issues with creating or updating image versions**

*The provided location <region\> is not available for resource type 'Microsoft.Compute/galleries'. List of available regions for the resource type is …*  
<u>Cause</u>: The <region\> is incorrect or requires an access request  
<u>Workaround</u>: Check that the region name is spelled correctly. You can run this command to see what regions you have access to. If the region is not listed in the list, submit [an access request](troubleshoot/azure/general/region-access-request-process).

*Can not perform requested operation on nested resource. Parent resource <galleryName/imageDefinitionName\> not found.*  
<u>Cause</u>: There is no gallery with the name <galleryName/imageDefinitionName\> in the current subscription and resource group.  
<u>Workaround</u>: Check that the name of the gallery, the subscription and resource group are correct. Otherwise, create a new gallery with the name <galleryName\> and/or image definition named <imageDefinitionName\> in the indicated resource group.

*Cannot bind parameter <property\>. Cannot convert value <value\> to type &quot;System.DateTime&quot;*  
<u>Cause</u>: The value provided to property is not properly formatted as a date.  
<u>Workaround</u>: Provide a date in the yyyy-MM-dd, yyyy-MM-dd'T'HH:mm:sszzz or [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601)-valid format.

*Cannot bind parameter <property\>. Cannot convert value <value\> to type &quot;System.Int32&quot;*  
<u>Cause</u>: <property\> accepts only integer values and <value\> is not an integer.  
<u>Workaround</u>: Choose an integer value.

*Gallery image version publishing profile regions <publishingRegions\> must contain the location of image version <sourceRegion\>*  
<u>Cause</u>: The location of the source image (<sourceRegion\>) must be included in the <publishingRegions\> list  
<u>Workaround</u>: Include < sourceRegion\> in the <publishingRegions\> list.

*The value <value\> of parameter <property\> is out of range. The value must be between <minValue\> and <maxValue\>, inclusive.*  
<u>Cause</u>: <value\> is outside the range of possible values for <property\>.  
<u>Workaround</u>: Choose a value that is within the range of <minValue\> and <maxValue\> inclusive.

*Source <resourceID\> is not found. Please check source exists, and is in the same region as gallery image version being created.*  
<u>Cause</u>: There is no source located at <resourceID\> or the source at <resourceID\> is not in the same region as the gallery image being created.  
<u>Workaround</u>: Check that the <resourceID\> is correct and that the source region of the gallery image version is the same as the region of the <resourceID\>

*Changing property 'galleryImageVersion.properties.storageProfile.<diskImage\>.source.id' is not allowed.*  
<u>Cause</u>: The source id of a gallery image version cannot be changed after creation.  
<u>Workaround</u>: Ensure that the source id is the same as the already existing source id or change the version number of the image version.

*Duplicated lun numbers have been detected in the input data disks. Lun number must be unique for each data disk.*  
<u>Cause</u>: When creating an image version using a list of disks and/or disk snapshots, two or more disks or disk snapshots have the same lun numbers.  
<u>Workaround</u>: Remove or change any duplicate lun numbers.

*Duplicated source ids are found in the input disks. Source id should be unique for each disk.*  
<u>Cause</u>: When creating an image version using a list of disks and/or disk snapshots, two or more disks or disk snapshots have the same resource ID.  
<u>Workaround</u>: Remove or change any duplicate disk source ids.

*Property id <resourceID\> at path 'properties.storageProfile.<diskImages\>.source.id' is invalid. Expect fully qualified resource Id that start with '/subscriptions/{subscriptionId}' or '/providers/{resourceProviderNamespace}/'.*  
<u>Cause</u>: The <resourceID\> is incorrectly formatted.  
<u>Workaround</u>: Check that the resourceID is correct.

*The source id: <resourceID\> must either be a managed image, virtual machine or another gallery image version*  
<u>Cause</u>: The <resourceID\> is incorrectly formatted.  
<u>Workaround</u>: If using a VM, managed image or gallery image version as the source image, check that the resource ID of the VM, managed image, or gallery image version is correct.

*The source id: <resourceID\> must be a managed disk or snapshot.*  
<u>Cause</u>: The <resourceID\> is incorrectly formatted.  
<u>Workaround</u>: If using disks and/or disk snapshots as sources for the image version, check that the resource IDs of the disks and/or disk snapshots is correct.

*Cannot create Gallery Image Version from: <resourceID\> since the OS State in the parent gallery image (<OsState\_1\>) is not <OsState\_2\>.*  
<u>Cause</u>: The operating system state (Generalized or Specialized) does not match the operating system state specified in the image definition.  
<u>Workaround</u>: Either choose a source based on a VM with the operating system state of <OsState\_1\> or create a new image definition for VMs based on <OsState\_2\>.

*The resource with id '<resourceID\>' has a different Hypervisor generation ['<V#\_1\>'] than the parent gallery image Hypervisor generation ['<V#\_2\>']*  
<u>Cause</u>: The Hypervisor generation of the image version does not match the Hypervisor generation specified in the image definition. The image definition operating system is <V#\_1\> and the image version operating system is <V#\_2\>.  
<u>Workaround</u>: Either choose a source with the same Hypervisor generation as the image definition or create/choose a new image definition that has the same Hypervisor generation as the image version.

*The resource with id '<resourceID\>' has a different OS type ['<OsType\_1\>'] than the parent gallery image OS type generation ['<OsType \_2\>']*  
<u>Cause</u>: The Hypervisor generation of the image version does not match the Hypervisor generation specified in the image definition. The image definition operating system is <OsType\_1\> and the image version operating system is <OsType\_2\>.  
<u>Workaround</u>: Either choose a source with the same operating system (Linux/Windows) as the image definition or create/choose a new image definition that has the same operating system generation as the image version.

*Source virtual machine <resourceID\> cannot contain an ephemeral OS disk.*  
<u>Cause</u>: The source at '<resourceID\>' contains an ephemeral OS disk. Shared Image Gallery does not currently support ephemeral OS disk.  
<u>Workaround</u>: Choose a different source based on a VM that does not use an ephemeral OS disk.

*Source virtual machine <resourceID\> cannot contain disk ['<diskID\>'] stored in an UltraSSD account type.*  
<u>Cause</u>: The disk '<diskID\> is an UltraSSD disk. Shared Image Gallery does not currently support Ultra SSD disks.  
<u>Workaround</u>: Use a source that contains only Premium SSD, Standard SSD and/or Standard HDD managed disks.

*Source virtual machine <resourceID\> must be created from Managed Disks.*  
<u>Cause</u>: The virtual machine in <resourceID\> uses unmanaged disks.  
<u>Workaround</u>: Use a source based on a VM that contains only Premium SSD, Standard SSD and/or Standard HDD managed disks.

*Too many requests on source '<resourceID\>'. Please reduce the number of requests on the source or wait some time before retrying.*
<u>Cause</u>:  The source for this image version is currently being throttled due to too many requests.
<u>Workaround</u>: Try the image version creation later.

*The disk encryption set '<diskEncryptionSetID\>' must be in the same subscription '<subscriptionID\>' as the gallery resource.*  
<u>Cause</u>: Disk encryption sets can only be used in in the same subscription and region in which they were created.  
<u>Workaround</u>: Create or use an encryption set in the same subscription and region as the image version

*Encrypted source: '<resourceID\>' is in a different subscription ID than the current gallery image version subscription '<subscriptionID\_1\>'. Please retry with an unencrypted source(s) or use the source's subscription '<subcriptionID\_2\>' to create the gallery image version.*  
<u>Cause</u>: Shared Image Gallery does not currently support creating image versions in another subscription from another source image if the source image is encrypted.  
<u>Workaround</u>: Use an unencrypted source or create the image version in the same subscription as the source.

*The disk encryption set <diskEncryptionSetID\> was not found.*  
<u>Cause</u>: The disk encryption may be incorrect.  
<u>Workaround</u>: Check that the resource ID of the disk encryption set is correct.

*The image version name is invalid. The image version name should follow Major(int).Minor(int).Patch(int) format, for e.g: 1.0.0, 2018.12.1 etc.*  
<u>Cause</u>: The valid format for an image version is 3 integers separated by a period. The image version name did not meet the valid format.  
<u>Workaround</u>: Use an image version name that follows the format Major(int).Minor(int).Patch(int), for e.g.: 1.0.0. or 2018.12.1.

*The value of parameter galleryArtifactVersion.properties.publishingProfile.targetRegions.encryption.dataDiskImages.diskEncryptionSetId is invalid*  
<u>Cause</u>: The resource ID of the disk encryption set used on a data disk image uses an invalid format.  
<u>Workaround</u>: Ensure that the resource ID of the disk encryption set follows the format /subscriptions/<subscriptionID\>/resourceGroups/<resourceGroupName\>/providers/Microsoft.Compute/<diskEncryptionSetName\>.

*The value of parameter galleryArtifactVersion.properties.publishingProfile.targetRegions.encryption.osDiskImage.diskEncryptionSetId is invalid_.

<u>Cause</u>: The resource ID of the disk encryption set used on the OS disk image uses an invalid format  
<u>Workaround</u>: Ensure that the resource ID of the disk encryption set follows the format /subscriptions/<subscriptionID\>/resourceGroups/<resourceGroupName\>/providers/Microsoft.Compute/<diskEncryptionSetName\>.

*Cannot specify new data disk image encryption lun [<number\>] with a disk encryption set in region [<region\>] for update gallery image version request. To update this version, remove the new lun. If you need to change the data disk image encryption settings, you must create a new gallery image version with the correct settings.*  
<u>Cause</u>: Added encryption to the data disk of an existing image version. Cannot add encryption to an existing image version.  
<u>Workaround</u>: Create a new gallery image version or remove the added encryption settings.

*The gallery artifact version source can only be specified either directly under storageProfile or within individual OS or data disks. One and only one source type (user image, snapshot, disk, virtual machine) can be provided.*  
<u>Cause</u>: The source ID is missing.  
<u>Workaround</u>: Ensure that the source ID of the source is present.

*Source was not found: <resourceID\>. Please make sure the source exists.*  
<u>Cause</u>: The resourceID of the source may be incorrect.  
<u>Workaround</u>: Ensure that the resourceID of the source is correct.

*A disk encryption set is required for disk 'galleryArtifactVersion.properties.publishingProfile.targetRegions.encryption.osDiskImage.diskEncryptionSetId' in target region '<Region\_1\>' since disk encryption set '<diskEncryptionSetID\>' is used for the corresponding disk in region '<Region\_2\>'*  
<u>Cause</u>: Encryption has been used on the OS disk in <Region\_2\>, but not in <Region\_1\>.  
<u>Workaround</u>: If using encryption on the OS disk, use encryption in all regions.

*A disk encryption set is required for disk 'LUN <number\>' in target region '<Region\_1\>' since disk encryption set '<diskEncryptionSetID\>' is used for the corresponding disk in region '<Region\_2\>'*  
<u>Cause</u>: Encryption has been used on the data disk at LUN <number\> in <Region\_2\>, but not in <Region\_1\>.  
<u>Workaround</u>: If using encryption on a data disk, use encryption in all regions.

*An invalid lun [<number\>] was specified in encryption.dataDiskImages. The lun must be one of the following values ['0,9'].*  
<u>Cause</u>: The lun number specified for the encryption does not match any of the lun numbers for disks attached to the VM.  
<u>Workaround</u>: Change the lun number in the encryption to the lun number of a data disk present in the VM.

*Duplicate luns '<number\>' were specified in target region '<region\>' encryption.dataDiskImages.*  
<u>Cause</u>: The encryption settings used in <region\> specified a lun number at least twice.  
<u>Workaround</u>: Change the lun number in <region\> to make sure that all the lun numbers are unique in <region\>.

*OSDiskImage and DataDiskImage cannot point to same blob <sourceID\>*  
<u>Cause</u>: The source for the OS disk and at least one data disk are not unique.  
<u>Workaround</u>: Change the source for the OS disk and/or data disks to ensure that the OS disk as well as each data disk is unique.

*Duplicate regions are not allowed in target publishing regions.*  
<u>Cause</u>: A region is listed among the publishing regions more than once.  
<u>Workaround</u>: Remove the duplicate region.

*Adding new Data Disks or changing the LUN of a Data Disk in an existing Image is not allowed.*  
<u>Cause</u>: An update call to the image version either contains a new data disk or has a new LUN number for a disk.  
<u>Workaround</u>: Use the LUN numbers and data disks of the existing image version.

*The disk encryption set <diskEncryptionSetID\> must be in the same subscription <subscriptionID\> as the gallery resource.*  
<u>Cause</u>: Shared Image Gallery does not currently support using a disk encryption set in a different subscription.  
<u>Workaround</u>: Create the image version and disk encryption set in the same subscription.

**Create virtual machines and scalesets from image version**

*The client has permission to perform action 'Microsoft.Compute/galleries/images/versions/read' on scope <resourceID\>, however the current tenant <tenantId1\> is not authorized to access linked subscription <subscriptionId2\>.*  
<u>Cause</u>: The virtual machine or scaleset was created using a SIG image in another tenant. You have attempted to add a disk to the virtual machine or in the case of a scaleset, make a change to the scaleset model. The logged-in user account or app registration does not have access to the subscription  
<u>Workaround</u>: Contact the owner of the subscription of the image version to grant read access to the image version.

*The gallery image <resourceID\> is not available in <region\> region. Please contact image owner to replicate to this region, or change your requested region.*  
<u>Cause</u>: The VM is being created in a region that is not among the list of published regions for the gallery image.  
<u>Workaround</u>: Either replicate the image to the region or create a VM in one of the regions in the gallery image's publishing regions.

*Parameter 'osProfile' is not allowed.*  
<u>Cause</u>: Admin username, password or ssh keys were provided for a VM that was created from a specialized image version.  
<u>Workaround</u>: Do not include the admin username, password, or ssh keys if you intend to create a VM from that image. Otherwise, use a generalized image version and supply the admin username, password or ssh keys.

*Required parameter 'osProfile' is missing (null).*  
<u>Cause</u>: VM is created from a generalized image and it is missing admin username, password, or ssh keys. Since generalized images do not retain admin username, password, or ssh keys, these fields must be specified during creation of a VM or scaleset.  
<u>Workaround</u>: Specify the admin username, password or ssh keys or use a specialized image version.

*Cannot create Gallery Image Version from: <resourceID\> since the OS State in the parent gallery image ('Specialized') is not 'Generalized'.*  
<u>Cause</u>: The image version is created from a generalized source but its parent definition is specialized.  
<u>Workaround</u>: Either create the image version using a specialized source or use a parent definition that is generalized.

*Cannot update Virtual Machine Scale Set <vmssName\> as the current OS state of the VM Scale Set is Generalized which is different from the updated gallery image OS state which is Specialized.*  
<u>Cause</u>: The current source image for the scaleset is a generalized source image, but it is being updated with a source image that is specialized. The current source image and the new source image for a scaleset must be of the same state.  
<u>Workaround</u>: To update the scaleset, use a generalized image version.

*Disk encryption set <diskEncryptionSetId\> in shared image gallery <versionId\> belongs to subscription <subscriptionId1\> and cannot be used with resource '' in subscription <subscriptionId2\>*
<u>Cause</u>: The disk encryption set used to encrypt the image version resides in a different subscription than the subscription to host the image version.  
<u>Workaround</u>: Use the same subscription for the image version and disk encryption set.

*The VM or virtual machine scale set creation takes a long time.*  
<u>Workaround</u>: Verify that the **OSType** of the image version that you are trying to create the VM or virtual machine scale set from has the same **OSType** of the source that you used to create the image version. 

## Unable to share resources

The sharing of shared image gallery, image definition, and image version resources across subscriptions is enabled using [Azure role-based access control (Azure RBAC)](../role-based-access-control/rbac-and-directory-admin-roles.md). 

## Replication is slow

Use the **--expand ReplicationStatus** flag to check if the replication to all the specified target regions has been completed. If not, wait for up to 6 hours for the job to complete. If it fails, trigger the command again to create and replicate the image version. If there are a lot of target regions the image version is being replicated to, consider doing the replication in phases.

## Azure limits and quotas 

[Azure limits and quotas](../azure-resource-manager/management/azure-subscription-service-limits.md) apply to all shared image gallery, image definition, and image version resources. Make sure you are within the limits for your subscriptions. 


## Next steps

Learn more about [shared image galleries](./linux/shared-image-galleries.md).