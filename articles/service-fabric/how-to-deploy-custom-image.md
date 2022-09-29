---
title: Custom Image
description: Learn how to deploy a custom image on Azure Service Fabric clusterss (SFMC).
ms.topic: conceptual
ms.author: abhayshah
author: abhayshah
ms.service: service-fabric
services: service-fabric
ms.date: 09/15/2022
---

# Deploy a custom Windows VMSS image on new node types within a SFMC cluster (preview)

Custom windows images are like marketplace images, but you create them yourself for each new node type within a cluster. Custom images can be used to bootstrap configurations such as preloading applications, application configurations, and other OS configurations.  Once you create a custom windows image, you can then deploy to one or more new node types within a Service Fabric Managed Cluster.  

## Before you begin
Ensure that you have [created a custom image](../virtual-machines/linux/tutorial-custom-images.md).
Custom image is enabled with Service Fabric Managed Cluster (SFMC) API version 2022-08-01-preview and forward. To use custom images, customer must grant SFMC First Party AAD App read access to the VM image (Managed Image or Shared Gallery) so that SFMC has permission to read and create VM with the image.  Please check [Add a managed identity to a Service Fabric Managed Cluster node type](how-to-managed-identity-managed-cluster-virtual-machine-scale-sets.md#prerequisites) as reference on how to obtain information about SFMC First Party AAD App and grant it access to the resources.  Reader access is sufficient:
 
Role definition name: Reader
Role definition ID:  acdd72a7-3385-48ef-bd42-f606fba81ae7 

```powershell 
     New-AzRoleAssignment -PrincipalId "<SFMC SPID>" -RoleDefinitionName "Reader" -Scope "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Compute/galleries/<galleryName>"
```
    

Example:
 
`$SFMCSpid = "fbc587f2-66f5-4459-a027-bcd908b9d278"`
$galleryResourceId = "/subscriptions/<subscriptionID> /resourceGroups/<RG>/providers/Microsoft.Compute/galleries/<ImageGalleryName>"
 
New-AzRoleAssignment -PrincipalId $SFMCSpid -RoleDefinitionName "Reader" -Scope $galleryResourceId
 
## Use the ARM template
When you create a new node type, you will need to modify your ARM template with the new property: VmImageResourceId: <Image name>.  The following is an example:
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

The vmImageResourceId will be passed along to the VM ScaleSet as image reference Id, currently we support 3 types of resources:
 
•	Managed Image (Microsoft.Compute/images)
•	Shared Gallery Image (Microsoft.Compute/galleries/images)
•	Shared Gallery Image Version (Microsoft.Compute/galleries/images/versions)

## Auto OS upgrade
 
Auto OS upgrade is also supported for custom image. To enable auto OS upgrade, the node type must not be pinned to a specific image version, i.e. must use a gallery image (Microsoft.Compute/galleries/images), for example:
 
/subscriptions/<subscriptionID>/resourceGroups/<myRG>/providers/Microsoft.Compute/galleries/<CustomImageGallery>/images/<CustomImageDef>
 
When node type is created with this as vmImageResourceId and the cluster has [auto OS upgrade](how-to-managed-cluster-upgrades.md) enabled, SFMC will monitor the published versions for this image definition and if any new version is published, start to reimage the VM ScaleSets created with this image definition which will bring them to the latest version.

Note:  Please make note that custom image will be supported soon for migrating an existing node type from non-custom image to custom image.
