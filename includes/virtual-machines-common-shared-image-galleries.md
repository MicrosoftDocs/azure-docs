---
 title: include file
 description: include file
 services: virtual-machines
 author: axayjo
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 09/20/2018
 ms.author: akjosh; cynthn
 ms.custom: include file
---

Shared Image Gallery is a service that helps you build structure and organization around your custom VM images. Shared Image Gallery provides three main value propositions
- Simple management
- Scale your customer images
- Share your images - share your images to different users, service principals, or AD groups within your organization as well as different regions using the multi-region replication

A managed image is a copy of either a full VM (including any attached data disks) or just the OS disk, depending on how you create the image. When you create a VM  from the image, the copy of the VHDs in the image are used to create the disks for the new VM. The managed image remains in storage and can be used over and over again to create new VMs.

If you have a large number of managed images that you need to maintain and would like to make them available throughout your company, you can use a shared image gallery as a repository that makes it easy to update and share your images. The charges for using a shared image gallery are just the costs for the storage used by the images, plus any network egress costs for replicating images from the source region to the published regions.

The Shared Image Gallery feature has multiple resource types:

| Resource | Description|
|----------|------------|
| **Managed image** | This is a baseline image that can be used alone or used to create multiple **shared image versions** in an image gallery.|
| **Image gallery** | Like the Azure Marketplace, an **image gallery** is a repository for managing and sharing images, but you control who has access. |
| **Gallery image** | Images are defined within a gallery and carry information about the image and requirements for using it internally. This includes whether the image is Windows or Linux, release notes, and minimum and maximum memory requirements. This type of image is a resource within the Resource Manager deployment model, but it isn't used directly for creating VMs. It is a definition of a type of image. |
| **Shared image version** | An **image version** is what you use to create a VM when using a gallery. You can have multiple versions of an image as needed for your environment. Like a managed image, when you use an **image version** to create a VM, the image version is used to create new disks for the VM. Image versions can be used multiple times. |

<br>


![Graphic showing how you can have multiple versions of an image in your gallery](./media/shared-image-galleries/shared-image-gallery.png)

### Regional Support

Regional support for shared image galleries is limited, but will expand over time. For preview, here are the lists of where you can create galleries and regions where can replicate any gallery: 

| Create Gallery In  | Replicate Version To |
|--------------------|----------------------|
| West Central US    |South Central US|
| East US 2          |East US|
| South Central US   |East US 2|
| Southeast Asia     |West US|
| West Europe        |West US 2|
|                    |Central US|
|                    |North Central US|
|                    |Canada Central|
|                    |Canada East|
|                    |North Europe|
|                    |West Europe|
|                    |South India|
|                    |Southeast Asia|



## Scaling
Shared Image Gallery allows you to specify the number of replicas you want Azure to keep for the images. This helps in multi-VM deployment scenarios as the VM deployments can be spread to different replicas reducing the chance of instance creation process being throttled due to overloading of a single replica.

![Graphic showing how you can scale images](./media/shared-image-galleries/scaling.png)


## Replication
Shared Image Gallery also allows you to replicate your images to other Azure regions automatically. Each Shared image version can be replicated to different regions depending on what makes sense for your organization. One example is to always replicate the latest image in multi-regions while all older versions are only available in 1 region. This can help save on storage costs for Shared image versions. 
The regions a Shared image version is replicated to can be updated after creation time. The time it takes to replicate to different regions depends on the amount of data being copied and the number of regions the version is replicate to. This can take few hours in some cases. While the replication is happening, you can view the status of replication per region. Once the image replication is complete in a region, you can then deploy a VM or VMSS using that version in the region.

![Graphic showing how you can replicate images](./media/shared-image-galleries/replication.png)


## Access
As the shared image gallery, shared image and shared image version are all resources, they can be shared using the built-in native Azure RBAC controls. Using RBAC you can share these resources to other users, service principals, and groups in your organization. The scope of sharing these resources is within the same AD tenant. Once a user has access to the Shared image version, they can deploy a VM or a virtual machine scale set in any of the subscriptions they have access to within the same AD tenant as the Shared image version.  Here is the sharing matrix that helps understand what the user gets access to:

| Shared with User     | Shared Image Gallery | Shared Image | Shared image version |
|----------------------|----------------------|--------------|----------------------|
| Shared Image Gallery | Yes                  | Yes          | Yes                  |
| Shared Image         | No                   | Yes          | Yes                  |
| Shared image version | No                   | No           | Yes                  |



## Billing
There is no extra charge for using the Shared Image Gallery service. You will be charged for the following resources:
- Storage costs of storing the Shared image versions. This depends on the number of replicas of the version and the number of regions the version is replicated to.
- Network egress charges for replication from source region of the version to the replicated regions.

## Frequently asked questions 

**Q.** How do I sign up for the Shared Image Gallery Public Preview?
 
 A. In order to sign up for the Shared Image Gallery public preview, you need to register for the feature by running the following commands from each of the subscriptions in which you intend to create a shared image gallery, image definition, or image version resources, and also where you intend to deploy Virtual Machines using the image versions.

**CLI**: 

```bash 
az feature register --namespace Microsoft.Compute --name GalleryPreview
az provider register -n Microsoft.Compute
```

**PowerShell**: 

```powershell
Register-AzureRmProviderFeature -FeatureName GalleryPreview -ProviderNamespace Microsoft.Compute
Register-AzureRmResourceProvider -ProviderNamespace Microsoft.Compute
```

**Q.** How can I list all the Shared Image Gallery resources across subscriptions? 
 
 A. In order to list all the Shared Image Gallery resources across subscriptions that you have access to on the Azure portal, follow the steps below:

 1.	Open the [Azure portal](https://portal.azure.com).
 1.	Go to **All Resources**.
 1.	Select all the subscriptions under which you’d like to list all the resources.
 1.	Look for resources of type **Private gallery**.
 
 To see the image definitions and image versions, you should also select **Show hidden types**.
 
 To list all the shared image gallery resources across subscriptions that you have permissions to, use the following command in the Azure CLI:

 ```bash
 az account list -otsv --query "[].id" | xargs -n 1 az sig list --subscription
 ```


**Q.** How do I share my images across subscriptions?
 
 A. You can share images across subscriptions using Role Based Access Control (RBAC). Any user that has read permissions to an image version, even across subscriptions, will be able to deploy a Virtual Machine using the image version.


**Q.** Can I move my existing image to the shared image gallery?
 
 A. Yes. There are 3 scenarios based on the types of images you may have.

 Scenario 1: If you have a managed image, then you can create an image definition and image version from it.

 Scenario 2: If you have an unmanaged generalized image, you can create a managed image from it, and then create an image definition and image version from it. 

 Scenario 3: If you have a VHD in your local file system, then you need to upload the VHD, create a managed image, then you can create and image definition and image version from it. 
	- If the VHD is of a Windows VM, see [Upload a generalized VHD](https://docs.microsoft.com/azure/virtual-machines/windows/upload-generalized-managed).
	- If the VHD is for a Linux VM, see [Upload a VHD](https://docs.microsoft.com/azure/virtual-machines/linux/upload-vhd#option-1-upload-a-vhd)


**Q.** Can I create an image version from a specialized disk?

 A. No, we do not currently support specialized disks as images. If you have a specialized disk, you need to [create a VM from the VHD](https://docs.microsoft.com/azure/virtual-machines/windows/create-vm-specialized-portal#create-a-vm-from-a-disk) by attaching the specializeddisk to a new VM. Once you have a running VM, you need to follow the instructions to create a managed image from the [Windows VM] (https://docs.microsoft.com/en-us/azure/virtual-machines/windows/tutorial-custom-images) or [Linux VM](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/tutorial-custom-images). Once you have a generalized managed image, you can start the process to create a shared image description and image version.


**Q.** Can I create a shared image gallery, image definition, and image version through the Azure portal?

 A. No, currently we do not support the creation of any of the Shared Image Gallery resources through Azure portal. However, we do support the creation of the Shared Image Gallery resources through CLI, Templates, and SDKs. PowerShell will also be release soon.

 
**Q.** Once created, can I update the image definition or the image version? What kind of details can I modify?

 A. The details that can be updated on each of the resources are mentioned below:
 
Shared image gallery:
- Description

image definition:
- Recommended vCPUs
- Memory
- Description
- End of life date

Image version:
- Regional replica count
- Target regions
- Exclusion from latest
- End of life date


**Q.** Once created, can I move the Shared Image Gallery resource to a different subscription?

 A. No, you cannot move the shared image gallery resource to a different subscription. However, you will be able to replicate the image versions in the gallery to other regions as required.

**Q.** Can I replicate my image versions across clouds – Azure China 21Vianet, Azure Germany and Azure Government Cloud? 

 A. No, you cannot replicate image versions across clouds.

**Q.** Can I replicate my image versions across subscriptions? 

 A. No, you may replicate the image versions across regions in a subscription and use it in other subscriptions through RBAC.

**Q.** Can I share image versions across AD tenants? 

 A. No, currently shared image gallery does not support the sharing of image versions across AD tenants. However, you may use the Private Offers feature on Azure Marketplace to achieve this.


**Q.** How long does it take to replicate image versions across the target regions?

 A. The image version replication time is entirely dependent on the size of the image and the number of regions it is being replicated to. However, as a best practice, it is recommended that you keep the image small, and the source and target regions close for best results. You can check the status of the replication using the -ReplicationStatus flag.


**Q.** How many shared image galleries can I create in a subscription?

 A. The default quota is 
- 10 shared image galleries, per subscription, per region
- 200 image definitions, per subscription, per region
- 2000 image versions, per subscription, per region


**Q.** What is the difference between source region and target region?

 A. Source region is the region in which your image version will be created, and target regions are the regions in which a copy of your image version will be stored. For each image version, you can only have one source region. Also, make sure that you pass the source region location as one of the target regions when you create an image version.  


**Q.** How do I specify the source region while creating the image version?

 A. While creating an image version, you can use the **--location** tag in CLI and the **-Location** tag in PowerShell to specify the source region. Please ensure the managed image that you are using as the base image to create the image version is in the same location as the location in which you intend to create the image version. Also, make sure that you pass the source region location as one of the target regions when you create an image version.  


**Q.** How do I specify the number of image version replicas to be created in each region?

 A. There are two ways you can specify the number of image version replicas to be created in each region:
 
1. The regional replica count which specifies the number of replicas you want to create per region. 
2. The common replica count which is the default per region count in case regional replica count is not specified. 

To specify the regional replica count, pass the location along with the number of replicas you want to create in that region like this: “South Central US=2”. 

If regional replica count is not specified with each location, then the default number of replicas will be the common replica count that you specified. 

To specify the common replica count in CLI, use the **--replica-count** argument in the `az sig image-version create` command.


**Q.** Can I create the shared image gallery in a different location than the one where I want to create the image definition and image version?

 A. Yes, this is possible. But as a best practice, we encourage you to keep the resource group, shared image gallery, image definition and image version in the same location.


**Q.** What are the charges for using the Shared Image Gallery?

 A. There are no charges for using the Shared Image Gallery service, except the storage charges for storing the image versions and network egress charges for replicating the image versions from source region to target regions.

**Q.** What API version should I use to create Shared Image Gallery, Image Definition, Image Version, and VM/VMSS out of the Image Version?

 A. For VM and virtual machine scale set deployments using an image version, we recommend you use API version 2018-04-01 or higher. To work with shared image galleries, image definitions, and image versions, we recommend you use API version 2018-06-01. 