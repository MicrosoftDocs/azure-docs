---
title: Configure a dev box by using Azure VM Image Builder (Portal Integration)
titleSuffix: Microsoft Dev Box
description: Learn how to use Azure VM Image Builder's Portal Integration to easily and more intuitively build a custom image for configuring dev boxes with Microsoft Dev Box.
services: dev-box
ms.service: dev-box
author: kgangulyvibe
ms.author: kganguly
ms.date: 04/07/2024
ms.topic: how-to
---

# Creating Custom VM Images with Azure VM Image Builder (Portal Integration)

In this tutorial, we will explore the process of creating custom virtual machine (VM) images using Azure VM Image Builder through the Azure Portal. However, first let's look into some of the core concepts.

# Core Concepts

## **Azure VM Image Builder for Microsoft Dev Boxes**

**Azure VM Image Builder** is a powerful tool designed to streamline the process of creating custom virtual machine (VM) images, specifically optimized for development environments. Here's how it benefits Microsoft Dev Boxes:

1. **Consistency and Standardization**:
   - **Standardized Dev Environments**: Ensure that all your Microsoft Dev Boxes have consistent configurations, software, and security settings.
   - **Effortless Deployment**: Set up a repeatable image-building pipeline without manual steps or complex infrastructure management.

2. **Infrastructure as Code (IaC)**:
   - **Simplified Infrastructure Management**: VM Image Builder abstracts away the complexities of managing infrastructure.
   - **Compute Gallery Integration**: Distribute, replicate, version, and scale Dev Box images globally with ease.

3. **Integration with Core Development Tools**:
   - **Customize Dev Box Images**: Seamlessly integrate development tools, SDKs, and frameworks directly into VM images.
   - **Optimized for Microsoft Dev Boxes**: Fine-tune the image for Visual Studio, .NET, Azure SDKs, and other essential tools.

4. **Automation and Efficiency**:
   - **Managed Service**: VM Image Builder handles Azure-specific requirements (such as image generalization) behind the scenes.
   - **Azure DevOps Integration**: Seamlessly incorporate VM image building into your existing DevOps pipelines.
   - **Fetch Customization Data**: Easily retrieve configuration data from various sources.

## **Azure Image Templates: Enhancing the Experience**

When combined with **Azure Image Templates**, VM Image Builder becomes even more potent for Microsoft Dev Boxes:

1. **Portal Integration**:
   - **New Portal Functionality**: Access Azure Image Builder directly from the Azure portal.
   - **Create and Validate Images**: Build and validate custom images within the portal itself.

2. **Tailored Image Templates**:
   - **Dev Box-Specific Templates**: Craft image templates optimized for Microsoft Dev Boxes.
   - **Accelerate Development**: Quickly spin up Dev Boxes with pre-configured tools and settings.

In summary, Azure VM Image Builder simplifies image creation, ensures consistency, and seamlessly integrates with Azure Image Templates, making it an ideal choice for building efficient and standardized Microsoft Dev Boxes.


## **Image Source**
- An **image source** is a resource used to create an **image version** within an Azure Compute Gallery.
- It can be:
  - An existing **Azure VM** (either generalized or specialized).
  - A **managed image**.
  - A **snapshot**.
  - An **image version** from another gallery.

## **Compute Gallery**
- The **Azure Compute Gallery**, formerly known as the **Shared Image Gallery**, simplifies sharing custom images across your organization.
- Key features:
  - **Global Replication**: Images can be replicated to multiple regions for quicker scaling of deployments.
  - **Versioning and Grouping**: Organize resources for easier management.
  - **High Availability**: Supports Zone Redundant Storage (ZRS) accounts in regions with Availability Zones.
  - **Sharing Options**: Share resources within your organization, across regions, or publicly using a community gallery.

## **Image Definition**
- **Image definitions** are created within a gallery.
- They carry information about the image requirements for internal use.
- Includes details like whether the image is for Windows or Linux, release notes, and minimum/maximum memory requirements.

## **Image Version**
- An **image version** is used to create a VM when using a gallery.
- You can have multiple versions of an image as needed for your environment.
- When creating a VM using an image version, it's used to create new disks for the VM.
- Image versions can be reused.


----

# Step-by-Step guide

This guide will walk you through how to create custom VM images using Azure VM Image Builder through the Azure Portal. Another way to do this is via ARM templates as described [here](https://learn.microsoft.com/en-us/azure/dev-box/how-to-customize-devbox-azure-image-builder).

## Step 0 - Create a new RG & Dev Center

* Create a new Resource Group
  * Create a new Dev Center

## Step 1 - Check your provider registrations

To use VM Image Builder, you need to register the features.

Check your provider registrations. Make sure each command returns Registered for the specified feature.


    Get-AzResourceProvider -ProviderNamespace Microsoft.VirtualMachineImages | Format-table -Property ResourceTypes,RegistrationState 
    Get-AzResourceProvider -ProviderNamespace Microsoft.Storage | Format-table -Property ResourceTypes,RegistrationState  
    Get-AzResourceProvider -ProviderNamespace Microsoft.Compute | Format-table -Property ResourceTypes,RegistrationState 
    Get-AzResourceProvider -ProviderNamespace Microsoft.KeyVault | Format-table -Property ResourceTypes,RegistrationState 
    Get-AzResourceProvider -ProviderNamespace Microsoft.Network | Format-table -Property ResourceTypes,RegistrationState

If the provider registrations don't return `Registered`, register the providers by running the following commands:

    Register-AzResourceProvider -ProviderNamespace Microsoft.VirtualMachineImages  
    Register-AzResourceProvider -ProviderNamespace Microsoft.Storage  
    Register-AzResourceProvider -ProviderNamespace Microsoft.Compute  
    Register-AzResourceProvider -ProviderNamespace Microsoft.KeyVault  
    Register-AzResourceProvider -ProviderNamespace Microsoft.Network

## Step 2 - Create a Managed Identity

This step creates a user-assigned identity with a custom role definition and set permissions on the resource group.

* Firstly, update the contents in [base.ps1](base.ps1) with the appropriate values for Resource Group, Location and identityName.
* Open the `Cloud Shell` on the Azure Portal
* Select `PowerShell`
* Create a new file in the current (or desired) directory. You can use `nano base.ps1`
* Copy and paste the code in [base.ps1](base.ps1)
* Click on `{}` (*Open Editor*) to see the created file with the code in it.
* Run the PowerShell script `./base.ps1`
* Note the name of the managed identity you just created which will be shown in the output.

> VM Image Builder uses the provided user identity to inject the image into Azure Compute Gallery. The included script creates an Azure role definition with specific actions for distributing the image. The role definition is then assigned to the user identity.

```
You may need to add Additional permissions on the managed identity. If you get a "LinkedAuthorizationFailed" error, then it could be because your service principal does not have the required permissions to assign a user-assigned identity to a virtual machine. To fix this issue, you need to grant the service principal the role of Managed Identity Operator on the user-assigned identity resource. You can do this by following these steps:
* Navigate to the Azure portal and sign in with your account.
* Search for User-assigned identities in the search box and select the service from the results.
* Select the user-assigned identity that is mentioned in the error message.
* Click on Access control (IAM) from the left menu.
* Click on Add and select Add role assignment from the drop-down menu.
* In the Add role assignment pane, select Managed Identity Operator as the role, and search for the service principal that is mentioned in the error message (the Managed Identity).
* Select the service principal from the results and click Save.
```

## Step 3 - Create Image Template

On the Azure Portal > Create an `Image Templates` resource, keeping the following in mind:
* Source image - Choose a **Marketplace** base image
* Image - Choose a Dev Box compatible base image (search for example **Visual Studio 2022 Enterprise on Windows 11 Enterprise (x64) + Microsoft 365 Apps (Microsoft Dev Box compatible)**
* Distribution targets - VM Image Version (we will distribute to the Compute Gallery)
* VM image version details > Target Azure compute gallery - Create a new one if not already created
* VM image version details > Target VM image definition - Create a new one if not already created
* Select the Managed Identity created in the previous step
> Note - If you face issues seeing the managed identity from the Image Template resource, try to create the Image Template resource on `preview.portal.azure.com`
* Go to the Customizations page next and under **Customize with scripts** > ADD > `PowerShell Command`
 * Add the desired commands from [imageCustomizations.md](imageCustomizations.md)
 * Give Permissions = Elevated
* Select **Review + Create** and then create the resource
* After the Image Template gets created, go to the next step **Start Build**

### Compute Gallery Image Requirements

[Source](https://learn.microsoft.com/en-us/azure/dev-box/how-to-configure-azure-compute-gallery#compute-gallery-image-requirements)

A gallery used to configure dev box definitions must have at least one image definition and one image version.

When you create a virtual machine (VM) image, select an image from the Azure Marketplace that's compatible with Microsoft Dev Box. The following are examples of compatible images:

[Visual Studio 2019](https://azuremarketplace.microsoft.com/en/marketplace/apps/microsoftvisualstudio.visualstudio2019plustools?tab=Overview)
[Visual Studio 2022](https://azuremarketplace.microsoft.com/en/marketplace/apps/microsoftvisualstudio.visualstudioplustools?tab=Overview)

The image version must meet the following requirements:
* Generation 2
* Hyper-V v2
* Windows OS
  * Windows 10 Enterprise version 20H2 or later
  * Windows 11 Enterprise 21H2 or later
* Generalized VM image
* Single-session VM images (Multiple-session VM images aren't supported)
* No recovery partition For information about how to remove a recovery partition, see the [Windows Server command: delete partition](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/delete-partition).
* Default 64-GB OS disk size The OS disk size is automatically adjusted to the size specified in the SKU description of the Windows 365 license.
* The image definition must have [trusted launch enabled](https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch) as the security type

## Step 4 - Start build

In the created Image Template, click on `Start Build`.

You can `Refresh` the status and wait until the `Build run state` shows complete. This step will take some time to complete as it builds a version of the image from the template.

Wait for the build to complete before moving to the next steps.

## Step 5 - Add the Compute Gallery to the Dev Center

[Source](https://learn.microsoft.com/en-us/azure/dev-box/how-to-configure-azure-compute-gallery#provide-permissions-for-services-to-access-a-gallery)

Galleries cannot be added until an identity has been assigned to the Dev Center.

> When you use an Azure Compute Gallery image to create a dev box definition, the Windows 365 service validates the image to ensure that it meets the requirements to be provisioned for a dev box. Microsoft Dev Box replicates the image to the regions specified in the attached network connections, so the images are present in the region required for dev box creation.
> To allow the services to perform these actions, you must provide permissions to your gallery as follows.

* Create a new User Managed Identity
* Add a User Managed Identity to the Dev Center
  * In the Settings blader of the Dev Center resource, go to `Identity`> `User assigned` and add a user assigned managed identity.
* Attach the gallery to the dev center


> Microsoft Dev Box behaves differently depending how you attach your gallery:
> * When you use the Azure portal to attach the gallery to your dev center, the Dev Box service creates the necessary role assignments automatically after you attach the gallery. This is the option chosen for this tutorial.
> * When you use the Azure CLI to attach the gallery to your dev center, you must manually create the Windows 365 service principal and the dev center's managed identity role assignments before you attach the gallery. More details [here](https://learn.microsoft.com/en-us/azure/dev-box/how-to-configure-azure-compute-gallery#assign-roles).

## Step 6 - Create the Dev Box Definition & Project

* Create a Dev Box definition with the new Image from the Compute Gallery
* Create a new Project
* Create a new Dev Box Pool
* Assign the project to the developer persona

Refer to the [Dev Box Quickstarts](https://learn.microsoft.com/en-us/azure/dev-box/quickstart-configure-dev-box-service) in case of any doubt regarding this step.

## Step 7

The Developer can now log into the Developer Portal and test creating the dev box and logging in to it.

Refer to [Quickstart: Create and connect to a dev box by using the Microsoft Dev Box developer portal](https://learn.microsoft.com/en-us/azure/dev-box/quickstart-create-dev-box) in case of any doubt regarding this step.