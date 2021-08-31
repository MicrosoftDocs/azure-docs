---
title: Overview of application packages (preview)
description: Learn application packages in an Azure Compute Gallery.
author: cynthn
ms.service: virtual-machines
ms.subservice: shared-image-gallery
ms.topic: conceptual
ms.workload: infrastructure
ms.date: 07/22/2021
ms.author: cynthn
ms.reviewer: akjosh 
ms.custom: 

---

# Application packages Overview (preview)

The application packages use multiple resource types:

| Resource | Description|
|----------|------------|
| **Gallery** | A gallery is a repository for managing and sharing application packages. Users can share the gallery resource and all the child
resources will be shared automatically. The gallery name must be unique
per subscription. For example, you may have one gallery to store all
your Linux applications and another gallery to store all your Windows
applications.|
| **Application definition** | This is the gallery application resource, which represents an application object, which can be versioned independent of other resources in the gallery. This is a *logical* resource that stores the common metadata for all the versions under it. For example, you may have an application definition for Apache Tomcat and have multiple versions within it. |
| **Application version** | This is the deployable version of the VM Application Definition. This is a multi-regional, independently scalable resource. Users may choose to globally replicate their application versions to target regions closer to their VM infrastructure. The VM Application Version must be replicated to a region before it may be deployed on a VM in that region. |

## Benefits

Application packages provide benefits over other deployment and packaging methods:

- Grouping and versioning your packages

- Global replication

- Share packages with other users using Azure Role Based Access Control (RBAC)

- Support for virtual machines, and both flexible and uniform scale sets

## Limitations

- **PageBlob only support**: When supplying the source blobs for both the application package and the default configuration, only page blobs are supported. Block blobs are not supported today, but will be supported in the near future.

- **No more than 3 replicas per VM Application version**: When creating a VM Application version, the maximum number of supported replicas per region is three. There are no current plans to increase it.

- **Retrying failed installations**: Currently, the only way to retry a failed installation is to remove the application from the profile, then add it back. 

- **Only 5 applications supported per VM**: No more than 5 applications may be deployed to a VM at any point.

- **1GB application size**: The maximum file size of an application version is 1GB. 

- **No guarantees on reboots in your script**: If your script requires a reboot, the recommendation is to place that application last during deployment. While the code attempts to handle reboots, it may fail.

- **Requires a VM Agent**: The VM agent must exist on the VM and be able to receive goal states.

- **Multiple versions of same application on the same VM**: You can't have multiple versions of the same application on a VM.

- **Deploying VM Applications to Virtual Machine Scales Sets**: Due to a bug with how VMApp extension is handled by Virtual Machine Scale Sets. It is required to always pass a non-empty virtual machine application profile in the same request which updates the application profile for a VMSS. 

- **Must include all existing extensions when updating applicationProfiles for a VM or VMSS**. Due to a bug, when updating the applicationProfiles on a VM or VMSS, all extensions must be present. If any extensions are missing, then they will be uninstalled.

## Application packages vs custom image

Using application packages that are separate from a customer images have some unique benefits:

- VM Applications help decouple the VM image, application, and code lifecycle. 

- With VM Applications, there’s no need to publish a new image for every line of code change.

## How are VM Applications better than other repositories or storage accounts?**

- We globally replicate the application packages closer to your infrastructure, so you don’t need to use AzCopy or other storage copy mechanisms to copy the bits across Azure regions.

- If you have Network Security Group (NSG) rules applied on your machine, downloading the packages from an internet repository wouldn’t be possible.

- With storage accounts, downloading packages onto NSG locked-down VMs would require setting up private links.
- 
## Cost

There is no extra charge for using VM Application Packages. You will be charged for the following resources:
- Storage costs of storing each package and any replicas. 
- Network egress charges for replication of the first image version from the source region to the replicated regions. Subsequent replicas are handled within the region, so there are no additional charges. 

For more information on network egress, see [Bandwidth pricing](https://azure.microsoft.com/pricing/details/bandwidth/).


## Policies

<!-- are there any built-in policies to control this feature? https://docs.microsoft.com/en-us/azure/virtual-machines/policy-reference#microsoftcompute -->


## Next steps
<!-- Add a context sentence for the following links. Link to the How-to if there is one for your feature! You can also link to any quickstart templates you have for the feature https://github.com/Azure/azure-quickstart-templates/blob/master/1-CONTRIBUTION-GUIDE/README.md#contribution-guide -->
- [How to ....](preview-howto.md)
































































---------------------------------


VM Applications are a new resource type in Azure Compute Gallery (currently known as Shared Image Gallery) that simplifies management,sharing and global distribution of application packages.





**What are the key benefits of using VM Applications?**



**What type of workloads are suitable for VM Applications?**

If your workload requires downloading and installing any of the following, then your workload will benefit from using VM Applications:

- Web Applications (for example, .war files, Apache Tomcat), Agents (Daemon Agents, Launch Agents, User Agents etc.)

- Desktop Applications (for example: .exe, .msi, .rpm packages)

- Datasets for your AI/ML workloads

- Security, audit, and update packages for compliance purposes

Now, these are just examples that we derived from customer research, but you can use it for any type of file as long as you tell us how to install it and uninstall it (more details below).


**What other features are on the roadmap?**

- CLI/PowerShell/Portal support


- Auto-update applications

- Azure Arc support

- Share applications directly with subscriptions and tenants

- Block blob support

- Azure Policy enforcement support

- Custom actions to interact better with your applications

- Integration with Azure DevOps

## Enabling preview access

To access the preview, every subscription intended to be used must be
onboarded to the preview. Sign up on [this
form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR6sYmAk0_OFMu5wrymMx7wNURVZYWjdTN1E3WkdMWU9RMkRCRkpEMEI0MC4u)
to get access to the preview. If you have any questions/feedback
regarding the preview or the service, reach out to Akshay Joshi
(<akjosh@microsoft.com>).

## Concepts


The application packages use multiple resource types:

| Resource | Description|
|----------|------------|
| **Gallery** | A gallery is a repository for managing and sharing application packages. Users can share the gallery resource and all the child
resources will be shared automatically. The gallery name must be unique
per subscription. For example, you may have one gallery to store all
your Linux applications and another gallery to store all your Windows
applications.|
| **Application definition** | This is the gallery application resource, which represents an application object, which can be versioned independent of other resources in the gallery. This is a *logical* resource that stores the common metadata for all the versions under it. For example, you may have an application definition for Apache Tomcat and have multiple versions within it. |
| **Application version** | This is the deployable version of the VM Application Definition. This is a multi-regional, independently scalable resource. Users may choose to globally replicate their application versions to target regions closer to their VM infrastructure. The VM Application Version must be replicated to a region before it may be deployed on a VM in that region. |


## Current VM Applications Limitations

- **PageBlob only support**: When supplying the source blobs for both the application package and the default configuration, only page blobs are supported. Block blobs are not supported today, but will be supported in the near future.

- **No more than 3 replicas per VM Application version**: When creating a VM Application version, the maximum number of supported replicas per region is three. There are no current plans to increase it.

- **Retrying failed installations**: Currently, the only way to retry a failed installation is to remove the application from the profile, then add it back. We are seeking feedback on how practical this is for our customers.

- **Only 5 applications supported per VM**: No more than 5 applications may be deployed to a VM at any point.

- **1GB Application size**: The maximum file size of an application version is 1GB. 

- **No guarantees on reboots in your script**: If your script requires a reboot, the recommendation is to place that application last during deployment. While the code attempts to handle reboots, it may fail.

- **Requires a VM Agent**: The VM agent must exist on the VM and be able to receive goal states.

- **Currently supports only API**: There is currently no PS, CLI and Portal support.

- **Not available in Azure Gov and sovereign clouds yet.**

- **Multiple versions of same application on the same VM**: This is currently a bug, and multiple versions of the same application
will be prevented in the future. For now, the behavior is undefined.

- **Deploying VM Applications to Virtual Machine Scales Sets**: Due to a bug with how VMApp extension is handled by Virtual Machine Scale Sets. It is required to always pass a non-empty virtual machine application profile in the same request which updates the application profile for a VMSS. 

- **Must include all existing extensions when updating applicationProfiles for a VM or VMSS**. Due to a bug, when updating the applicationProfiles on a VM or VMSS, all extensions must be present. If any extensions are missing, then they will be uninstalled.

