---
title: Custom Image
description: Learn how to deploy a custom image on Azure Service Fabric clusters (SFMC).
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
ms.custom: devx-track-arm-template
services: service-fabric
ms.date: 09/12/2023
---

# Deploy a custom Windows or Azure Marketplace virtual machine scale set image on new node types within a Service Fabric Managed Cluster (preview)

Custom windows images are like marketplace images, but you create them yourself for each new node type within a cluster. Custom images can be used to bootstrap configurations such as preloading applications, application configurations, and other OS configurations. Once you create a custom windows image, you can then deploy to one or more new node types within a Service Fabric Managed Cluster. Customers can also use a marketplace image. Azure Marketplace images are clones of entire computer systems including operating system, application, and state information. Service Fabric managed clusters allow you to utilize these images for your node types within your Service Fabric managed cluster.

## Before you begin
Ensure that you've [created a custom image](../virtual-machines/linux/tutorial-custom-images.md).
Custom image is enabled with Service Fabric Managed Cluster (SFMC) API version 2022-08-01-preview and forward. To use custom images, you must grant SFMC First Party Azure Active Directory (Azure AD) App read access to the virtual machine (VM) Managed Image or Shared Gallery image so that SFMC has permission to read and create VM with the image.

If you have chosen to use an Azure Marketplace image, you need to [find and use the appropriate marketplace purchase plan information](../virtual-machines/windows/cli-ps-findimage.md). You can then specify a marketplace image and plan information when you create a VM. You can also browse available images and offers using the [Azure Marketplace](https://azuremarketplace.microsoft.com) or the [Azure CLI](../virtual-machines/linux/cli-ps-findimage.md).

Check [Add a managed identity to a Service Fabric Managed Cluster node type](how-to-managed-identity-managed-cluster-virtual-machine-scale-sets.md#prerequisites) as reference on how to obtain information about SFMC First Party Azure AD App and grant it access to the resources. Reader access is sufficient.
 
`Role definition name: Reader`

`Role definition ID:  acdd72a7-3385-48ef-bd42-f606fba81ae7`

```powershell 
New-AzRoleAssignment -PrincipalId "<SFMC SPID>" -RoleDefinitionName "Reader" -Scope "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Compute/galleries/<galleryName>"
```

## Use the ARM template

When you create a new node type, you'll need to modify your ARM template with the new property: VmImageResourceId: <Image name>.  The following is an example:

 ```JSON 
 {
  "name": "SF",
  "properties": {
    "isPrimary" : true,
    "vmImageResourceId": "/subscriptions/<SubscriptionID>/resourceGroups/<myRG>/providers/Microsoft.Compute/images/<MyCustomImage>",
    "vmSize": "Standard_D2",
    "vmInstanceCount": 5,
    "dataDiskSizeGB": 100
    }
}
```
 
The vmImageResourceId will be passed along to the virtual machine scale set as an image reference ID, currently we support 3 types of resources:

- Managed Image (Microsoft.Compute/images)
- Shared Gallery Image (Microsoft.Compute/galleries/images)
- Shared Gallery Image Version (Microsoft.Compute/galleries/images/versions)

Service Fabric managed clusters also support marketplaces images that can be used on your virtual machine. Customers who would like to use a specific image from the marketplace can use the below configuration.

 ```JSON 
 { 
  "name": "SF", 
  "apiVersion": "2023-08-01-preview", 
  "properties": { 
    "isPrimary" : true, 
    "vmSize": "Standard_D2", 
    "vmImagePlan": { 
      "name": "< image >", 
      "publisher": "<publisher name>", 
      "product": "<product name>" 
    }, 
    "vmInstanceCount": 5, 
    "dataDiskSizeGB": 100 
  }
 } 
 ```

## Auto OS upgrade

Auto OS upgrade is also supported for custom image. To enable auto OS upgrade, the node type must not be pinned to a specific image version, i.e. must use a gallery image (Microsoft.Compute/galleries/images), for example:

`/subscriptions/<subscriptionID>/resourceGroups/<myRG>/providers/Microsoft.Compute/galleries/<CustomImageGallery>/images/<CustomImageDef>`

When node type is created with this as vmImageResourceId and the cluster has [auto OS upgrade](how-to-managed-cluster-upgrades.md) enabled, SFMC will monitor the published versions for this image definition and if any new version is published, start to reimage the virtual machine scale sets created with this image definition which will bring them to the latest version.
 
