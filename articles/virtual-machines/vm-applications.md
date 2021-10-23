---
title: Overview of VM application packages (preview)
description: Learn more about VM application packages in an Azure Compute Gallery.
author: cynthn
ms.service: virtual-machines
ms.subservice: gallery
ms.topic: conceptual
ms.workload: infrastructure
ms.date: 10/20/2021
ms.author: cynthn
ms.reviewer: amjads
ms.custom: 

---

# VM applications overview (preview)

VM Applications are a new resource type in Azure Compute Gallery (formerly known as Shared Image Gallery) that simplifies management,sharing and global distribution of applications for your virtual machines.

> [!IMPORTANT]
> **VM applications in Azure Compute Gallery** are currently in public preview.
> This preview version is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


While you can create an image of a VM with apps pre-installed, you would need to update your image each time you have application changes. Separating your application installation from your VM images means there’s no need to publish a new image for every line of code change.

Application packages provide benefits over other deployment and packaging methods:

- Grouping and versioning of your packages

- VM applications can be globally replicated to be closer to your infrastructure, so you don’t need to use AzCopy or other storage copy mechanisms to copy the bits across Azure regions.

- Sharing with other users through Azure Role Based Access Control (RBAC)

- Support for virtual machines, and both flexible and uniform scale sets

- If you have Network Security Group (NSG) rules applied on your VM or scale set, downloading the packages from an internet repository might not be possible. And  with storage accounts, downloading packages onto locked-down VMs would require setting up private links.


## What are VM app packages?

The VM application packages use multiple resource types:

| Resource | Description|
|----------|------------|
| **Azure compute gallery** | A gallery is a repository for managing and sharing application packages. Users can share the gallery resource and all the child resources will be shared automatically. The gallery name must be unique per subscription. For example, you may have one gallery to store all your OS images and another gallery to store all your VM applications.|
| **VM application** | This is the definition of your VM application. This is a *logical* resource that stores the common metadata for all the versions under it. For example, you may have an application definition for Apache Tomcat and have multiple versions within it. |
| **VM Application version** | This is the deployable resource. You can globally replicate your VM application versions to target regions closer to your VM infrastructure. The VM Application Version must be replicated to a region before it may be deployed on a VM in that region. |


## Limitations

- **No more than 3 replicas per region**: When creating a VM Application version, the maximum number of replicas per region is three. 

- **Retrying failed installations**: Currently, the only way to retry a failed installation is to remove the application from the profile, then add it back.

- **Only 5 applications per VM**: No more than 5 applications may be deployed to a VM at any point.

- **1GB application size**: The maximum file size of an application version is 1GB. 

- **No guarantees on reboots in your script**: If your script requires a reboot, the recommendation is to place that application last during deployment. While the code attempts to handle reboots, it may fail.

- **Requires a VM Agent**: The VM agent must exist on the VM and be able to receive goal states.

- **Multiple versions of same application on the same VM**: You can't have multiple versions of the same application on a VM.



## Cost

There is no extra charge for using VM Application Packages, but you will be charged for the following resources:

- Storage costs of storing each package and any replicas. 
- Network egress charges for replication of the first image version from the source region to the replicated regions. Subsequent replicas are handled within the region, so there are no additional charges. 

For more information on network egress, see [Bandwidth pricing](https://azure.microsoft.com/pricing/details/bandwidth/).


## VM applications

The VM application resource defines the following about your VM application:

- Azure Compute Gallery where the VM application is stored
- Name of the application
- Supported OS type like Linux or Windows
- A description of the VM application

## Versions

Versions are defined with the following properties:
- Version number
- Link to the package file
- Install string for installing the application
- Remove string to show how to properly remove the app
- Package file name 
- Config file name 
- A link to the config file for the app
- -Update string for how to update the app
- End-of-life date. End-of-life dates are informational; you will still be able to deploy a VM application versions past the end-of-life date.
- Exclude from latest. You can keep a version from being used as the latest version of the application. 
- Target regions for replication
- Replica count per region

## Error messages

| Message | Description |
|--|--|
| Current VM Application Version {name} was deprecated at {date}. | You tried to deploy a VM Application version that has already been deprecated. Try using `latest` instead of specifying a specific version. |
| Current VM Application Version {name} supports OS {OS}, while current OSDisk's OS is {OS}. | You tried to deploy a Linux application to Windows instance or vice versa. |
| The maximum number of VM applications (max=5, current={count}) has been exceeded. Use fewer applications and retry the request. | We currently only support five VM applications per VM or VMSS. |
| More than one VMApplication was specified with the same packageReferenceId. | The same application was specified more than once. |
| Subscription not authorized to access this image. | The subscription does not have access to this application version. |
| Storage account in the arguments does not exist. | There are no applications for this subscription. |
| The platform image {image} is not available. Verify that all fields in the storage profile are correct. For more details about storage profile information, please refer to https://aka.ms/storageprofile. | The application does not exist. |
| The gallery image {image} is not available in {region} region. Please contact image owner to replicate to this region, or change your requested region. | The gallery application version exists, but it was not replicated to this region. |
| The SAS is not valid for source uri {uri}. | A `Forbidden` error was received from storage when attempting to retrieve information about the url (either mediaLink or defaultConfigurationLink). |
| The blob referenced by source uri {uri} does not exist. | The blob provided for the mediaLink or defaultConfigurationLink properties does not exist. |
| The gallery application version url {url} cannot be accessed due to the following error: remote name not found. Ensure that the blob exists and that it's either publicly accessible or is a SAS url with read privileges. | The most likely case is that a SAS uri with read privileges was not provided. |
| The gallery application version url {url} cannot be accessed due to the following error: {error description}. Ensure that the blob exists and that it's either publicly accessible or is a SAS url with read privileges. | There was an issue with the storage blob provided. The error description will provide more information. |
| Operation {operationName} is not allowed on {application} since it is marked for deletion. You can only retry the Delete operation (or wait for an ongoing one to complete). | Attempt to update an application that’s currently being deleted. |
| The value {value} of parameter 'galleryApplicationVersion.properties.publishingProfile.replicaCount' is out of range. The value must be between 1 and 3, inclusive. | Only between 1 and 3 replicas are allowed for VMApplication versions. |
| Changing property 'galleryApplicationVersion.properties.publishingProfile.manageActions.install' is not allowed. (or update, delete) | It is not possible to change any of the manage actions on an existing VmApplication. A new VmApplication version must be created. |
| Changing property ' galleryApplicationVersion.properties.publishingProfile.settings.packageFileName ' is not allowed. (or configFileName) | It is not possible to change any of the settings, such as the package file name or config file name. A new VmApplication version must be created. |
| The blob referenced by source uri {uri} is too big: size = {size}. The maximum blob size allowed is '1 GB'. | The maximum size for a blob referred to by mediaLink or defaultConfigurationLink is currently 1 GB. |
| The blob referenced by source uri {uri} is empty. | An empty blob was referenced. |
| {type} blob type is not supported for {operation} operation. Only page blobs and block blobs are supported. | VmApplications only supports page blobs and block blobs. |
| The SAS is not valid for source uri {uri}. | The SAS uri supplied for mediaLink or defaultConfigurationLink is not a valid SAS uri. |
| Cannot specify {region} in target regions because the subscription is missing required feature {featureName}. Either register your subscription with the required feature or remove the region from the target region list. | To use VmApplications in certain restricted regions, one must have the feature flag registered for that subscription. |
| Gallery image version publishing profile regions {regions} must contain the location of image version {location}. | The list of regions for replication must contain the location where the application version is. |
| Duplicate regions are not allowed in target publishing regions. | The publishing regions may not have duplicates. |
| Gallery application version resources currently do not support encryption. | The encryption property for target regions is not supported for VM Applications |
| Entity name does not match the name in the request URL. | The gallery application version specified in the request url does not match the one specified in the request body. |
| The gallery application version name is invalid. The application version name should follow Major(int32).Minor(int32).Patch(int32) format, where int is between 0 and 2,147,483,647 (inclusive). e.g. 1.0.0, 2018.12.1 etc. | The gallery application version must follow the format specified. |



## Next steps

- Learn how to [create and deploy VM application packages](vm-appications-how-to.md).


