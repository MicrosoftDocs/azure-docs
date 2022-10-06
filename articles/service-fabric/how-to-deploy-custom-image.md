---
title: Custom Image
description: Learn how to deploy a custom image on Azure Service Fabric clusters (SFMC).
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 09/15/2022
---

# Deploy a custom Windows virtual machine scale set image on new node types within a Service Fabric Managed Cluster (preview)

Custom windows images are like marketplace images, but you create them yourself for each new node type within a cluster. Custom images can be used to bootstrap configurations such as preloading applications, application configurations, and other OS configurations.  Once you create a custom windows image, you can then deploy to one or more new node types within a Service Fabric Managed Cluster.  

## Before you begin
Ensure that you've [created a custom image](../virtual-machines/linux/tutorial-custom-images.md).
Custom image is enabled with Service Fabric Managed Cluster (SFMC) API version 2022-08-01-preview and forward. To use custom images, you must grant SFMC First Party Azure Active Directory (AAD) App read access to the virtual machine (VM) Managed Image or Shared Gallery image so that SFMC has permission to read and create VM with the image.

Check [Add a managed identity to a Service Fabric Managed Cluster node type](how-to-managed-identity-managed-cluster-virtual-machine-scale-sets.md#prerequisites) as reference on how to obtain information about SFMC First Party AAD App and grant it access to the resources. Reader access is sufficient.
 
`Role definition name: Reader`

`Role definition ID:  acdd72a7-3385-48ef-bd42-f606fba81ae7`

```powershell 
New-AzRoleAssignment -PrincipalId "<SFMC SPID>" -RoleDefinitionName "Reader" -Scope "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Compute/galleries/<galleryName>"
