---
title: Troubleshoot problems with shared images in Azure 
description: Learn how to troubleshoot problems with shared image galleries.
author: olayemio
ms.service: virtual-machines
ms.subservice: shared-image-gallery
ms.topic: troubleshooting
ms.workload: infrastructure
ms.date: 10/27/2020
ms.author: olayemio
ms.reviewer: cynthn

---

# Troubleshoot shared image galleries in Azure

If you have problems performing any operations on shared image galleries, image definitions, and image versions, run the failing command again in debug mode. You activate debug mode by passing the `--debug` switch with the Azure CLI and the `-Debug` switch with PowerShell. After you've located the error, follow this article to troubleshoot it.


## Creating or modifying a gallery ##

**Message**: *Gallery name is invalid. Allowed characters are English alphanumeric characters, with underscores, and periods allowed in the middle, up to 80 characters total. All other special characters, including dashes, are disallowed.*  
**Cause**: The name for the gallery does not meet the naming requirements.  
**Workaround**: Choose a name that meets the following conditions: 
- Has an 80-character limit
- Contains only English letters, numbers, underscores, and periods
- Starts and ends with English letters or numbers

**Message**: *The entity name 'galleryName' is invalid according to its validation rule: ^[^\_\W][\w-.\_]{0,79}(?<![-.])$.*  
**Cause**: The gallery name does not meet the naming requirements.  
**Workaround**: Choose a name for the gallery that meets the following conditions: 
- Has an 80-character limit
- Contains only English letters, numbers, underscores, and periods
- Starts and ends with English letters or numbers

**Message**: *The provided resource name <galleryName\> has these invalid trailing characters: <character\>. The name can not end with characters: <character\>*  
**Cause**: The name for the gallery ends with a period or underscore.  
**Workaround**: Choose a name for the gallery that meets the following conditions: 
- Has an 80-character limit
- Contains only English letters, numbers, underscores, and periods
- Starts and ends with English letters or numbers

**Message**: *The provided location <region\> is not available for resource type 'Microsoft.Compute/galleries'. List of available regions for the resource type is …*  
**Cause**: The region specified for the gallery is incorrect or requires an access request.  
**Workaround**: Check that the region name is correct. If the region name is correct, submit [an access request](/troubleshoot/azure/general/region-access-request-process) for the region.

**Message**: *Can not delete resource before nested resources are deleted.*  
**Cause**: You've tried to delete a gallery that contains at least one existing image definition. A gallery must be empty before it can be deleted.  
**Workaround**: Delete all image definitions inside the gallery and then proceed to delete the gallery. If the image definition contains image versions, you must delete the image versions before you delete the image definitions.

**Message**: *The gallery name '<galleryName\>' is not unique within the subscription '<subscriptionID>'. Please pick another gallery name.*  
**Cause**: You have an existing gallery with the same name and have tried to create another gallery with the same name.  
**Workaround**: Choose a different name for the gallery.

**Message**: *The resource <galleryName\> already exists in location <region\_1\> in resource group <resourceGroup\>. A resource with the same name cannot be created in location <region\_2\>. Please select a new resource name.*  
**Cause**: You have an existing gallery with the same name and have tried to create another gallery with the same name.  
**Workaround**: Choose a different name for the gallery.

## Creating or modifying image definitions ##

**Message**: *Changing property 'galleryImage.properties.<property\>' is not allowed.*  
**Cause**: You tried to change the OS type, OS state, Hyper-V generation, offer, publisher, or SKU. Changing any of these properties is not permitted.  
**Workaround**: Create a new image definition instead.

**Message**: *The resource <galleryName/imageDefinitionName\> already exists in location <region\_1\> in resource group <resourceGroup\>. A resource with the same name cannot be created in location <region\_2\>. Please select a new resource name.*  
**Cause**: You have an existing image definition in the same gallery and resource group with the same name. You've tried to create another image definition with the same name and in the same gallery but in a different region.  
**Workaround**: Use a different name for the image definition, or put the image definition in a different gallery or resource group.

**Message**: *The provided resource name <galleryName\>/<imageDefinitionName\> has these invalid trailing characters: <character\>. The name can not end with characters: <character\>*  
**Cause**: The <imageDefinitionName\> name ends with a period or underscore.  
**Workaround**: Choose a name for the image definition that meets the following conditions: 
- Has an 80-character limit
- Contains only English letters, numbers, underscores, hyphens, and periods
- Starts and ends with English letters or numbers.

**Message**: *The entity name <imageDefinitionName\> is invalid according to its validation rule: ^[^\_\\W][\\w-.\_]{0,79}(?<![-.])$"*  
**Cause**: The <imageDefinitionName\> name ends with a period or underscore.  
**Workaround**: Choose a name for the image definition that meets the following conditions: 
- Has an 80-character limit
- Contains only English letters, numbers, underscores, hyphens, and periods
- Starts and ends with English letters or numbers

**Message**: *Asset name galleryImage.properties.identifier.<property\> is not valid. It cannot be empty. Allowed characters are uppercase or lowercase letters, digits, hyphen(-), period (.), underscore (\_). Names are not allowed to end with period(.). The length of the name cannot exceed <number\> characters.*  
**Cause**: The publisher, offer, or SKU value does not meet the naming requirements.  
**Workaround**: Choose a value that meets the following conditions: 
- Has a 128-character limit for publisher or 64-character limit for offer and SKU
- Contains only English letters, numbers, hyphens, underscores, and periods
- Does not end with a period

**Message**: *Can not perform requested operation on nested resource. Parent resource <galleryName\> not found.*  
**Cause**: There is no gallery with the name <galleryName\> in the current subscription and resource group.  
**Workaround**: Check that the names of the gallery, subscription, and resource group are correct. Otherwise, create a new gallery named <galleryName\>.

**Message**: *The provided location <region\> is not available for resource type 'Microsoft.Compute/galleries'. List of available regions for the resource type is …*  
**Cause**: The <region\> name is incorrect or requires an access request.  
**Workaround**: Check that the region name is spelled correctly. You can run this command to see what regions you have access to. If the region is not in the list, submit [an access request](/troubleshoot/azure/general/region-access-request-process).

**Message**: *Unable to serialize value: <value\> as type: 'iso-8601'., ISO8601Error: ISO 8601 time designator 'T' missing. Unable to parse datetime string <value\>*  
**Cause**: The value provided to the property is not properly formatted as a date.  
**Workaround**: Provide a date in the yyyy-MM-dd, yyyy-MM-dd'T'HH:mm:sszzz, or [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601)-valid format.

**Message**: *Could not convert string to DateTimeOffset: <value\>. Path 'properties.<property\>'*  
**Cause**: The value provided to the property is not properly formatted as a date.  
**Workaround**: Provide a date in the yyyy-MM-dd, yyyy-MM-dd'T'HH:mm:sszzz, or [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601)-valid format.

**Message**: *EndOfLifeDate must be set to a future date.*  
**Cause**: The end-of-life date property is not properly formatted as a date that's after today's date.  
**Workaround**: Provide a date in the yyyy-MM-dd, yyyy-MM-dd'T'HH:mm:sszzz, or [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601)-valid format.

**Message**: *argument --<property\>: invalid int value: <value\>*  
**Cause**: <property\> accepts only integer values, and <value\> is not an integer.  
**Workaround**: Choose an integer value.

**Message**: *The minimum value of <property\> must not be greater than the maximum value of <property\>.*  
**Cause**: The minimum value provided for <property\> is higher than the maximum value provided for <property\>.  
**Workaround**: Change the values so that the minimum is less than or equal to the maximum.

**Message**: *Gallery image: <imageDefinitionName\> identified by (publisher:<Publisher\>, offer:<Offer\>, sku:<SKU\>) already exists. Choose a different publisher, offer, sku combination.*  
**Cause**: You've tried to create a new image definition with the same publisher, offer, and SKU triplet as an existing image definition in the same gallery.  
**Workaround**: Within a gallery, all image definitions must have a unique combination of publisher, offer, and SKU. Choose a unique combination, or choose a new gallery and create the image definition again.

**Message**: *Can not delete resource before nested resources are deleted.*  
**Cause**: You've tried to delete an image definition that contains image versions. An image definition must be empty before it can be deleted.  
**Workaround**: Delete all image versions inside the image definition and then proceed to delete the image definition.

**Message**: *Cannot bind parameter <property\>. Cannot convert value <value\> to type <propertyType\>. Unable to match the identifier name <value\> to a valid enumerator name. Specify one of the following enumerator names and try again: <choice1\>, <choice2\>, …*  
**Cause**: The property has a restricted list of possible values, and <value\> is not one of them.  
**Workaround**: Choose one of the possible <choice\> values.

**Message**: *Cannot bind parameter <property\>. Cannot convert value <value\> to type &quot;System.DateTime&quot;*  
**Cause**: The value provided to the property is not properly formatted as a date.  
**Workaround**: Provide a date in the yyyy-MM-dd, yyyy-MM-dd'T'HH:mm:sszzz, or [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601)-valid format.

**Message**: *Cannot bind parameter <property\>. Cannot convert value <value\> to type &quot;System.Int32&quot;*  
**Cause**: <property\> accepts only integer values, and <value\> is not an integer.  
**Workaround**: Choose an integer value.

**Message**: *ZRS storage account type is not supported in this region.*  
**Cause**: You've chosen standard zone-redundant storage (ZRS) in a region that does not yet support it.  
**Workaround**: Change the storage account type to **Premium\_LRS** or **Standard\_LRS**. Check our documentation for the latest [list of regions](../storage/common/storage-redundancy.md#zone-redundant-storage) with ZRS preview enabled.

## Creating or updating image versions ##

**Message**: *The provided location <region\> is not available for resource type 'Microsoft.Compute/galleries'. List of available regions for the resource type is …*  
**Cause**: The <region\> name is incorrect or requires an access request.  
**Workaround**: Check that the region name is spelled correctly. You can run this command to see what regions you have access to. If the region is not in the list, submit [an access request](/troubleshoot/azure/general/region-access-request-process).

**Message**: *Can not perform requested operation on nested resource. Parent resource <galleryName/imageDefinitionName\> not found.*  
**Cause**: There is no gallery with the name <galleryName/imageDefinitionName\> in the current subscription and resource group.  
**Workaround**: Check that the names of the gallery, subscription, and resource group are correct. Otherwise, create a new gallery with the name <galleryName\> and/or an image definition named <imageDefinitionName\> in the indicated resource group.

**Message**: *Cannot bind parameter <property\>. Cannot convert value <value\> to type &quot;System.DateTime&quot;*  
**Cause**: The value provided to the property is not properly formatted as a date.  
**Workaround**: Provide a date in the yyyy-MM-dd, yyyy-MM-dd'T'HH:mm:sszzz, or [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601)-valid format.

**Message**: *Cannot bind parameter <property\>. Cannot convert value <value\> to type &quot;System.Int32&quot;*  
**Cause**: <property\> accepts only integer values, and <value\> is not an integer.  
**Workaround**: Choose an integer value.

**Message**: *Gallery image version publishing profile regions <publishingRegions\> must contain the location of image version <sourceRegion\>*  
**Cause**: The location of the source image (<sourceRegion\>) must be included in the <publishingRegions\> list.  
**Workaround**: Include <sourceRegion\> in the <publishingRegions\> list.

**Message**: *The value <value\> of parameter <property\> is out of range. The value must be between <minValue\> and <maxValue\>, inclusive.*  
**Cause**: <value\> is outside the range of possible values for <property\>.  
**Workaround**: Choose a value that's within the range of <minValue\> and <maxValue\>, inclusive.

**Message**: *Source <resourceID\> is not found. Please check source exists, and is in the same region as gallery image version being created.*  
**Cause**: There is no source located at <resourceID\>, or the source at <resourceID\> is not in the same region as the gallery image being created.  
**Workaround**: Check that the <resourceID\> value is correct and that the source region of the gallery image version is the same as the region of the <resourceID\> value.

**Message**: *Changing property 'galleryImageVersion.properties.storageProfile.<diskImage\>.source.id' is not allowed.*  
**Cause**: The source ID of a gallery image version can't be changed after creation.  
**Workaround**: Ensure that the source ID is the same as the existing source ID, change the version number of the image version, or delete the current image version and try again.

**Message**: *Duplicated lun numbers have been detected in the input data disks. Lun number must be unique for each data disk.*  
**Cause**: When you're creating an image version by using a list of disks and/or disk snapshots, two or more disks or disk snapshots have the same LUN.  
**Workaround**: Remove or change any duplicate LUNs.

**Message**: *Duplicated source ids are found in the input disks. Source id should be unique for each disk.*  
**Cause**: When you're creating an image version by using a list of disks and/or disk snapshots, two or more disks or disk snapshots have the same resource ID.  
**Workaround**: Remove or change any duplicate disk source IDs.

**Message**: *Property id <resourceID\> at path 'properties.storageProfile.<diskImages\>.source.id' is invalid. Expect fully qualified resource Id that start with '/subscriptions/{subscriptionID}' or '/providers/{resourceProviderNamespace}/'.*  
**Cause**: The <resourceID\> value is incorrectly formatted.  
**Workaround**: Check that the resource ID is correct.

**Message**: *The source id: <resourceID\> must either be a managed image, virtual machine or another gallery image version*  
**Cause**: The <resourceID\> value is incorrectly formatted.  
**Workaround**: If you're using a VM, managed image, or gallery image version as the source image, check that the resource ID of the VM, managed image, or gallery image version is correct.

**Message**: *The source id: <resourceID\> must be a managed disk or snapshot.*  
**Cause**: The <resourceID\> value is incorrectly formatted.  
**Workaround**: If you're using disks and/or disk snapshots as sources for the image version, check that the resource IDs of the disks and/or disk snapshots are correct.

**Message**: *Cannot create Gallery Image Version from: <resourceID\> since the OS State in the parent gallery image (<OsState\_1\>) is not <OsState\_2\>.*  
**Cause**: The operating system state (Generalized or Specialized) does not match the operating system state specified in the image definition.  
**Workaround**: Either choose a source based on a VM with the operating system state of <OsState\_1\> or create a new image definition for VMs based on <OsState\_2\>.

**Message**: *The resource with id '<resourceID\>' has a different Hypervisor generation ['<V#\_1\>'] than the parent gallery image Hypervisor generation ['<V#\_2\>']*  
**Cause**: The hypervisor generation of the image version does not match the hypervisor generation specified in the image definition. The image definition operating system is <V#\_1\>, and the image version operating system is <V#\_2\>.  
**Workaround**: Either choose a source with the same hypervisor generation as the image definition or create/choose a new image definition that has the same hypervisor generation as the image version.

**Message**: *The resource with id '<resourceID\>' has a different OS type ['<OsType\_1\>'] than the parent gallery image OS type generation ['<OsType \_2\>']*  
**Cause**: The hypervisor generation of the image version does not match the hypervisor generation specified in the image definition. The image definition operating system is <OsType\_1\>, and the image version operating system is <OsType\_2\>.  
**Workaround**: Either choose a source with the same operating system (Linux/Windows) as the image definition or create/choose a new image definition that has the same operating system generation as the image version.

**Message**: *Source virtual machine <resourceID\> cannot contain an ephemeral OS disk.*  
**Cause**: The source at <resourceID\> contains an ephemeral OS disk. The shared image gallery does not currently support ephemeral OS disks.  
**Workaround**: Choose a different source based on a VM that does not use an ephemeral OS disk.

**Message**: *Source virtual machine <resourceID\> cannot contain disk ['<diskID\>'] stored in an UltraSSD account type.*  
**Cause**: The disk <diskID\> is an Ultra SSD disk. The shared image gallery does not currently support Ultra SSD disks.  
**Workaround**: Use a source that contains only Premium SSD, Standard SSD, and/or Standard HDD managed disks.

**Message**: *Source virtual machine <resourceID\> must be created from Managed Disks.*  
**Cause**: The virtual machine in <resourceID\> uses unmanaged disks.  
**Workaround**: Use a source based on a VM that contains only Premium SSD, Standard SSD, and/or Standard HDD managed disks.

**Message**: *Too many requests on source '<resourceID\>'. Please reduce the number of requests on the source or wait some time before retrying.*  
**Cause**: The source for this image version is currently being throttled because of too many requests.  
**Workaround**: Try to create the image version later.

**Message**: *The disk encryption set '<diskEncryptionSetID\>' must be in the same subscription '<subscriptionID\>' as the gallery resource.*  
**Cause**: Disk encryption sets can be used only in the same subscription and region in which they were created.  
**Workaround**: Create or use an encryption set in the same subscription and region as the image version.

**Message**: *Encrypted source: '<resourceID\>' is in a different subscription ID than the current gallery image version subscription '<subscriptionID\_1\>'. Please retry with an unencrypted source(s) or use the source's subscription '<subcriptionID\_2\>' to create the gallery image version.*  
**Cause**: The shared image gallery does not currently support creating image versions in another subscription from another source image if the source image is encrypted.  
**Workaround**: Use an unencrypted source or create the image version in the same subscription as the source.

**Message**: *The disk encryption set <diskEncryptionSetID\> was not found.*  
**Cause**: The disk encryption might be incorrect.  
**Workaround**: Check that the resource ID of the disk encryption set is correct.

**Message**: *The image version name is invalid. The image version name should follow Major(int).Minor(int).Patch(int) format, for e.g: 1.0.0, 2018.12.1 etc.*  
**Cause**: The valid format for an image version is three integers separated by a period. The image version name did not meet the valid format.  
**Workaround**: Use an image version name that follows the format Major(int).Minor(int).Patch(int). For example: 1.0.0. or 2018.12.1.

**Message**: *The value of parameter galleryArtifactVersion.properties.publishingProfile.targetRegions.encryption.dataDiskImages.diskEncryptionSetId is invalid*  
**Cause**: The resource ID of the disk encryption set used on a data disk image uses an invalid format.  
**Workaround**: Ensure that the resource ID of the disk encryption set follows the format /subscriptions/<subscriptionID\>/resourceGroups/<resourceGroupName\>/providers/Microsoft.Compute/<diskEncryptionSetName\>.

**Message**: *The value of parameter galleryArtifactVersion.properties.publishingProfile.targetRegions.encryption.osDiskImage.diskEncryptionSetId is invalid.*  
**Cause**: The resource ID of the disk encryption set used on the OS disk image uses an invalid format.  
**Workaround**: Ensure that the resource ID of the disk encryption set follows the format /subscriptions/<subscriptionID\>/resourceGroups/<resourceGroupName\>/providers/Microsoft.Compute/<diskEncryptionSetName\>.

**Message**: *Cannot specify new data disk image encryption lun [<number\>] with a disk encryption set in region [<region\>] for update gallery image version request. To update this version, remove the new lun. If you need to change the data disk image encryption settings, you must create a new gallery image version with the correct settings.*  
**Cause**: You added encryption to the data disk of an existing image version. You can't add encryption to an existing image version.  
**Workaround**: Create a new gallery image version or remove the added encryption settings.

**Message**: *The gallery artifact version source can only be specified either directly under storageProfile or within individual OS or data disks. One and only one source type (user image, snapshot, disk, virtual machine) can be provided.*  
**Cause**: The source ID is missing.  
**Workaround**: Ensure that the source ID of the source is present.

**Message**: *Source was not found: <resourceID\>. Please make sure the source exists.*  
**Cause**: The resource ID of the source might be incorrect.  
**Workaround**: Ensure that the resource ID of the source is correct.

**Message**: *A disk encryption set is required for disk 'galleryArtifactVersion.properties.publishingProfile.targetRegions.encryption.osDiskImage.diskEncryptionSetId' in target region '<Region\_1\>' since disk encryption set '<diskEncryptionSetID\>' is used for the corresponding disk in region '<Region\_2\>'*  
**Cause**: Encryption has been used on the OS disk in <Region\_2\>, but not in <Region\_1\>.  
**Workaround**: If you're using encryption on the OS disk, use encryption in all regions.

**Message**: *A disk encryption set is required for disk 'LUN <number\>' in target region '<Region\_1\>' since disk encryption set '<diskEncryptionSetID\>' is used for the corresponding disk in region '<Region\_2\>'*  
**Cause**: Encryption has been used on the data disk at LUN <number\> in <Region\_2\>, but not in <Region\_1\>.  
**Workaround**: If you're using encryption on a data disk, use encryption in all regions.

**Message**: *An invalid lun [<number\>] was specified in encryption.dataDiskImages. The lun must be one of the following values ['0,9'].*  
**Cause**: The LUN specified for the encryption does not match any of the LUNs for disks attached to the VM.  
**Workaround**: Change the LUN in the encryption to the LUN of a data disk present in the VM.

**Message**: *Duplicate luns '<number\>' were specified in target region '<region\>' encryption.dataDiskImages.*  
**Cause**: The encryption settings used in <region\> specified a LUN at least twice.  
**Workaround**: Change the LUN in <region\> to make sure that all the LUNs are unique in <region\>.

**Message**: *OSDiskImage and DataDiskImage cannot point to same blob <sourceID\>*  
**Cause**: The sources for the OS disk and at least one data disk are not unique.  
**Workaround**: Change the source for the OS disk and/or data disks to ensure that the OS disk as well as each data disk is unique.

**Message**: *Duplicate regions are not allowed in target publishing regions.*  
**Cause**: A region is listed among the publishing regions more than once.  
**Workaround**: Remove the duplicate region.

**Message**: *Adding new Data Disks or changing the LUN of a Data Disk in an existing Image is not allowed.*  
**Cause**: An update call to the image version either contains a new data disk or has a new LUN for a disk.  
**Workaround**: Use the LUNs and data disks of the existing image version.

**Message**: *The disk encryption set <diskEncryptionSetID\> must be in the same subscription <subscriptionID\> as the gallery resource.*  
**Cause**: The shared image gallery does not currently support using a disk encryption set in a different subscription.  
**Workaround**: Create the image version and disk encryption set in the same subscription.

**Message**: *Replication failed in this region due to 'The GalleryImageVersion source resource size 2048 exceeds the max size 1024 supported.'*  
**Cause**: A data disk in the source is greater than 1TB.  
**Workaround**: Resize the data disk to under 1 TB.

## Creating or updating a VM or scale sets from an image version ##

**Message**: *There is no latest image version exists for "<imageDefinitionResourceID\>"*  
**Cause**: The image definition you used to deploy the virtual machine does not contain any image versions that are included in latest.  
**Workaround**: Ensure that there is at least one image version that has 'Exclude from latest' set to False. 

**Message**: *The client has permission to perform action 'Microsoft.Compute/galleries/images/versions/read' on scope <resourceID\>, however the current tenant <tenantID\> is not authorized to access linked subscription <subscriptionID\>.*  
**Cause**: The virtual machine or scale set was created through a SIG image in another tenant. You've tried to make a change to the virtual machine or scale set, but you don't have access to the subscription that owns the image.  
**Workaround**: Contact the owner of the subscription of the image version to grant read access to the image version.

**Message**: *The gallery image <resourceID\> is not available in <region\> region. Please contact image owner to replicate to this region, or change your requested region.*  
**Cause**: The VM is being created in a region that's not among the list of published regions for the gallery image.  
**Workaround**: Either replicate the image to the region or create a VM in one of the regions in the gallery image's publishing regions.

**Message**: *Parameter 'osProfile' is not allowed.*  
**Cause**: Admin username, password, or SSH keys were provided for a VM that was created from a specialized image version.  
**Workaround**: Don't include the admin username, password, or SSH keys if you intend to create a VM from that image. Otherwise, use a generalized image version and supply the admin username, password, or SSH keys.

**Message**: *Required parameter 'osProfile' is missing (null).*  
**Cause**: The VM is created from a generalized image, and it's missing the admin username, password, or SSH keys. Because generalized images don't retain the admin username, password, or SSH keys, these fields must be specified during creation of a VM or scale set.  
**Workaround**: Specify the admin username, password, or SSH keys, or use a specialized image version.

**Message**: *Cannot create Gallery Image Version from: <resourceID\> since the OS State in the parent gallery image ('Specialized') is not 'Generalized'.*  
**Cause**: The image version is created from a generalized source, but its parent definition is specialized.  
**Workaround**: Either create the image version by using a specialized source or use a parent definition that's generalized.

**Message**: *Cannot update Virtual Machine Scale Set <vmssName\> as the current OS state of the VM Scale Set is Generalized which is different from the updated gallery image OS state which is Specialized.*  
**Cause**: The current source image for the scale set is a generalized source image, but it's being updated with a source image that is specialized. The current source image and the new source image for a scale set must be of the same state.  
**Workaround**: To update the scale set, use a generalized image version.

**Message**: *Disk encryption set <diskEncryptionSetID\> in shared image gallery <versionID\> belongs to subscription <subscriptionID1\> and cannot be used with resource '' in subscription <subscriptionID2\>*  
**Cause**: The disk encryption set used to encrypt the image version resides in a different subscription than the subscription to host the image version.  
**Workaround**: Use the same subscription for the image version and disk encryption set.

**Message**: *The VM or virtual machine scale set creation takes a long time.*  
**Workaround**: Verify that the **OSType** of the image version that you're trying to create the VM or virtual machine scale set from has the same **OSType** of the source that you used to create the image version. 

**Message**: *The resource with id <vmID\> has a different plan ['{\"name\":\"<name>\",\"publisher\":\"<publisher>\",\"product\":\"<product>\",\"promotionCode\":\"<promotionCode>\"}'] than the parent gallery image plan ['null'].*  
**Cause**: The parent image definition for the image version being deployed does not have a purchase plan information. 
**Workaround**: Create an image definition with the same purchase plan details from the error message and create the image version within the image definition.


## Creating a disk from an image version ##

**Message**: *The value of parameter imageReference is invalid.*  
**Cause**: You've tried to export from a SIG Image version to a disk but used a LUN position that does not exist on the image.    
**Workaround**: Check the image version to see what LUN positions are in use.

## Sharing resources

The sharing of image gallery, image definition, and image version resources across subscriptions is enabled using [Azure role-based access control (Azure RBAC)](../role-based-access-control/rbac-and-directory-admin-roles.md). 

## Replication speed

Use the **--expand ReplicationStatus** flag to check if the replication to all the specified target regions has finished. If not, wait for up to six hours for the job to finish. If it fails, trigger the command again to create and replicate the image version. If there are many target regions that the image version is being replicated to, consider doing the replication in phases.

## Azure limits and quotas 

[Azure limits and quotas](../azure-resource-manager/management/azure-subscription-service-limits.md) apply to all shared image gallery, image definition, and image version resources. Make sure you're within the limits for your subscriptions. 


## Next steps

Learn more about [shared image galleries](./shared-image-galleries.md).