---
title: Overview of VM application packages (preview)
description: Learn more about VM application packages in an Azure Compute Gallery.
author: cynthn
ms.service: virtual-machines
ms.subservice: gallery
ms.topic: conceptual
ms.workload: infrastructure
ms.date: 10/04/2021
ms.author: cynthn
ms.reviewer: amjads
ms.custom: 

---

# VM applications overview (preview)

VM Applications are a new resource type in Azure Compute Gallery (formerly known as Shared Image Gallery) that simplifies management,sharing and global distribution of applications for your virtual machines.


While you can create an image of a VM with apps pre-installed, you would need to update your image each time you have application changes. Separating your application installation from your VM images has several benefits:

- VM Applications help decouple the VM image, application, and code lifecycle. 

- With VM Applications, there’s no need to publish a new image for every line of code change.


Application packages provide benefits over other deployment and packaging methods:

- Grouping and versioning your packages

- Global replication

- Share packages with other users using Azure Role Based Access Control (RBAC)

- Support for virtual machines, and both flexible and uniform scale sets



## What are VM app packages?

The VM application packages use multiple resource types:

| Resource | Description|
|----------|------------|
| **Azure compute gallery** | A gallery is a repository for managing and sharing application packages. Users can share the gallery resource and all the child resources will be shared automatically. The gallery name must be unique per subscription. For example, you may have one gallery to store all your OS images and another gallery to store all your VM applications.|
| **VM application** | This is the definition of your VM application resource. This is a *logical* resource that stores the common metadata for all the versions under it. For example, you may have an application definition for Apache Tomcat and have multiple versions within it. |
| **VM Application version** | This is the 1`qp0oi This is a multi-regional, independently scalable resource. Users may choose to globally replicate their VM application versions to target regions closer to their VM infrastructure. The VM Application Version must be replicated to a region before it may be deployed on a VM in that region. |


## Limitations

- **Only supports PageBlobs**: When supplying the source for both the application package and the default configuration, only page blobs are supported.

- **No more than 3 replicas per region**: When creating a VM Application version, the maximum number of replicas per region is three. 

- **Retrying failed installations**: Currently, the only way to retry a failed installation is to remove the application from the profile, then add it back.

- **Only 5 applications per VM**: No more than 5 applications may be deployed to a VM at any point.

- **1GB application size**: The maximum file size of an application version is 1GB. 

- **No guarantees on reboots in your script**: If your script requires a reboot, the recommendation is to place that application last during deployment. While the code attempts to handle reboots, it may fail.

- **Requires a VM Agent**: The VM agent must exist on the VM and be able to receive goal states.

- **Multiple versions of same application on the same VM**: You can't have multiple versions of the same application on a VM.

- **Deploying VM Applications to Virtual Machine Scales Sets**: You need to always pass a non-empty virtual machine application profile in the same request which updates the application profile for a VMSS.

- **Must include all existing extensions when updating applicationProfiles for a VM or VMSS**. When updating the applicationProfiles on a VM or VMSS, all extensions must be present. If any extensions are missing, then they will be uninstalled.


## Why is an Azure Compute Gallery better than other repositories?**

- We globally replicate the application packages closer to your infrastructure, so you don’t need to use AzCopy or other storage copy mechanisms to copy the bits across Azure regions.

- If you have Network Security Group (NSG) rules applied on your machine, downloading the packages from an internet repository wouldn’t be possible.

- With storage accounts, downloading packages onto NSG locked-down VMs would require setting up private links.

## Cost

There is no extra charge for using VM Application Packages. You will be charged for the following resources:
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
- Version
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


## Next steps
<!-- Add a context sentence for the following links. Link to the How-to if there is one for your feature! You can also link to any quickstart templates you have for the feature https://github.com/Azure/azure-quickstart-templates/blob/master/1-CONTRIBUTION-GUIDE/README.md#contribution-guide -->
- Learn how to [create and deploy VM application packages]](app-packages-how-to.md).


