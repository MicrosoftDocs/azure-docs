---
title: Share resources in an Azure Compute Gallery
description: Learn how to share resources explicitly or to all Azure users using role-based access control or community galleries.
author: sandeepraichura
ms.service: virtual-machines
ms.subservice: gallery
ms.topic: how-to
ms.workload: infrastructure
ms.date: 05/11/2022
ms.author: saraic
ms.reviewer: cynthn
ms.custom: template-how-to , devx-track-azurecli 
ms.devlang: azurecli

---

# Share gallery resources

There are three main ways to share images in an Azure Compute Gallery, depending on who you want to share with:

| Who? | Option |
|----|----|
| [Specific people, groups, or service principals](#rbac) | Role-based access control (RBAC) lets you share resources to specific people, groups, or service principals on a granular level. |
| [Subscriptions or tenants](#direct_sharing) | Direct sharing lets you share to everyone in a subscription or tenant. |
| [Everyone](#community) | Community gallery lets you share your entire gallery publicly, to all Azure users. |


## RBAC

The Azure Compute Gallery, definitions, and versions are all resources, they can be shared using the built-in native Azure RBAC controls. Using Azure RBAC you can share these resources to other users, service principals, and groups. You can even share access to individuals outside of the tenant they were created within. Once a user has access to the image or application version, they can deploy a VM or a Virtual Machine Scale Set.  

We recommend sharing at the gallery level for the best experience and prevent management overhead. We do not recommend sharing individual image or application versions. For more information about Azure RBAC, see [Assign Azure roles](../role-based-access-control/role-assignments-portal.md).

If the user is outside of your organization, they will get an email invitation to join the organization. The user needs to accept the invitation, then they will be able to see the gallery and all of the image definitions and versions in their list of resources.

### [Portal](#tab/portal)

If the user is outside of your organization, they will get an email invitation to join the organization. The user needs to accept the invitation, then they will be able to see the gallery and all of the definitions and versions in their list of resources.

1. On the page for your gallery, in the menu on the left, select **Access control (IAM)**. 
1. Under **Add a role assignment**, select **Add**. The **Add a role assignment** pane will open. 
1. Under **Role**, select **Reader**.
1. Under **assign access to**, leave the default of **Azure AD user, group, or service principal**.
1. Under **Select**, type in the email address of the person that you would like to invite.
1. If the user is outside of your organization, you will see the message **This user will be sent an email that enables them to collaborate with Microsoft.** Select the user with the email address and then click **Save**.


### [CLI](#tab/cli)

To get the object ID of your gallery, use [az sig show](/cli/azure/sig#az-sig-show).

```azurecli-interactive
az sig show \
   --resource-group myGalleryRG \
   --gallery-name myGallery \
   --query id
```

Use the object ID as a scope, along with an email address and [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) to give a user access to the Azure Compute Gallery. Replace `<email-address>` and `<gallery iD>` with your own information.

```azurecli-interactive
az role assignment create \
   --role "Reader" \
   --assignee <email address> \
   --scope <gallery ID>
```

For more information about how to share resources using RBAC, see [Manage access using RBAC and Azure CLI](../role-based-access-control/role-assignments-cli.md).

### [PowerShell](#tab/powershell)

Use an email address and the [Get-AzADUser](/powershell/module/az.resources/get-azaduser) cmdlet to get the object ID for the user, then use [New-AzRoleAssignment](/powershell/module/Az.Resources/New-AzRoleAssignment) to give them access to the gallery. Replace the example email, alinne_montes@contoso.com in this example, with your own information.

```azurepowershell-interactive
# Get the object ID for the user
$user = Get-AzADUser -StartsWith alinne_montes@contoso.com
# Grant access to the user for our gallery
New-AzRoleAssignment `
   -ObjectId $user.Id `
   -RoleDefinitionName Reader `
   -ResourceName $gallery.Name `
   -ResourceType Microsoft.Compute/galleries `
   -ResourceGroupName $resourceGroup.ResourceGroupName

```

---

## Direct sharing

Share with a subscription or tenant using direct sharing.

> [!IMPORTANT]
> Azure Compute Gallery – direct sharing is currently in PREVIEW and subject to the [Preview Terms for Azure Compute Gallery](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
> 
> To use direct sharing, you need to register for the preview at [https://aka.ms/communitygallery-preview](https://aka.ms/communitygallery-preview). In addition, all of the subscriptions that you want to share with need to also be part of the preview.
> 
> During the preview, you need to create a new gallery, with the property `sharingProfile.permissions` set to `Groups`. When using the CLI to create a gallery, use the `--permissions groups` parameter. You can't use an existing gallery, the property can't currently be updated.


### [Portal](#tab/portaldirect)

1. Sign in to the Azure portal at https://portal.azure.com.
1. Type **Azure Compute Gallery** in the search box and select **Azure Compute Gallery** in the results.
1. In the **Azure Compute Gallery** page, click **Add**.
1. On the **Create Azure Compute Gallery** page, select the correct subscription.
1. Complete all of the details on the page.
1. At the bottom of the page, select **Next: Sharing method**.
    :::image type="content" source="media/create-gallery/create-gallery.png" alt-text="Screenshot showing where to select to go on to sharing methods.":::
1. On the **Sharing** tab, select **xxxxxxxxx**.

   :::image type="content" source="media/create-gallery/sharing-type.png" alt-text="Screenshot showing the option to share using both role-based access control and a community gallery.":::

1. xxx
1. After validation passes, select **Create**.
1. When the deployment is finished, select **Go to resource**.


### [CLI](#tab/clidirect)

To create a gallery that can be shared to a subscription or tenant using direct sharing, you need to create the gallery with the `--permissions` parameter set to `groups`.

```azurecli-interactive
az sig create \
   --gallery-name myGallery \
   --permissions groups \
   --resource-group myResourceGroup  
```
 

To shared the to a subscription or tenant, use [az sig share add](/cli/azure/sig#az-sig-share-add) 

```azurecli-interactive
sub=<subscription-id>
tenant=<tenant-id>
gallery=<gallery-name>
rg=<resource-group-name>
az sig share add \
   --subscription-ids $sub \
   --tenant-ids $tenant \
   --gallery-name $gallery \
   --resource-group $rg
```
 

Remove access for a subscription or tenant using [az sig share remove](/cli/azure/sig#az-sig-share-remove).

```azurecli-interactive
sub=<subscription-id>
tenant=<tenant-id>
gallery=<gallery-name>
rg=<resource-group-name>

az sig share remove \
   --subscription-ids $sub \
   --tenant-ids $tenant \
   --gallery-name $gallery \
   --resource-group $rg
```
 

Use [az sig share reset](/cli/azure/sig#az-sig-share-reset) to clear everything in sharingProfile.

```azurecli-interactive
gallery=<gallery-name>
rg=<resource-group-name>
az sig share reset --gallery-name $gallery -g $rg
```
 

List Galleries shared with your subscription.

```azurecli-interactive
az sig list-shared --location $region 
```
 

List Galleries shared with a tenant.

```azurecli-interactive
region=<location>
az sig list-shared --location $region --shared-to tenant 
```

 

List image definitions of a parent Gallery shared with subscription 

az sig image-definition list-shared --gallery-unique-name $galleryUniqueName --location $region 

 

List image definitions of a parent Gallery shared with tenant 

az sig image-definition list-shared --gallery-unique-name $galleryUniqueName --location $region --shared-to tenant 

 

Get uniqueName of an image definition within a shared gallery  

az sig image-definition show-shared --gallery-unique-name $galleryUniqueName --location $region --gallery-image-definition $galleryDefinitionName 

 

List image versions of a parent Gallery shared with subscription 

az sig image-version list-shared --gallery-unique-name $galleryUniqueName --gallery-image-definition $galleryDefinitionName --location $region 

 

List image versions of a parent Gallery shared with tenant 

az sig image-version list-shared --gallery-unique-name $galleryUniqueName --gallery-image-definition $galleryDefinitionName --location $region --shared-to tenant 

 

Get the sharedGalleryImageId of an image version 

az sig image-version show-shared --gallery-unique-name $galleryUniqueName --gallery-image-definition $galleryDefinitionName --location $region --gallery-image-version $galleryImageVersionName 

 

Deploy a VM from an image version in a subscription or tenant-shared gallery  

az vm create --name $vmName --resource-group $resourceGroup --image /SharedGalleries/$galleryUniqueName/images/$imageName/versions/latest 

 

Deploy a VMSS from an image version in a subscription or tenant-shared gallery  

 

az vmss create --name $vmssName --resource-group $resourceGroup --image /SharedGalleries/$galleryUniqueName/images/$imageName/versions/latest 
### [PowerShell](#tab/powershelldirect)

Enable a gallery for subscription / tenant-level sharing 

Update-AzGallery -ResourceGroupName $rgSource -Name $galleryName -Permission "groups" 

 

Share gallery to subscription and/or tenant 

Update-AzGallery -ResourceGroupName $rgSource -Name $galleryName -Share -Subscription $subscriptionSource,$subscriptionTarget -Tenant $tenantSource,$tenantTarget 

 

Remove access for a subscription / tenant 

Update-AzGallery -ResourceGroupName $rgSource -Name $galleryName -Share -RemoveSubscription $subscription 

 

Reset (clear everything in sharingProfile)  

Update-AzGallery -ResourceGroupName $rgSource -Name $galleryName -Share -Reset 

 

List Galleries shared with subscription

Get-AzGallery -Location $region

 

List Galleries shared with tenant 

Get-AzGallery -Scope "tenant" -Location $region 

 

Get uniqueId, permissions, and permitted groups for a Gallery (available only to image owner) 

To be filled in later 

 

List image definitions of a parent Gallery shared with subscription 

Get-AzGalleryImageDefinition -GalleryUniqueName $galleryUniqueName -Location $region 

 

List image definitions of a parent Gallery shared with tenant 

Get-AzGalleryImageDefinition -GalleryUniqueName $galleryUniqueName -Location $region -Scope "tenant" 

 

Get uniqueName of an image definition within a shared gallery  

Get-AzGalleryImageDefinition -GalleryUniqueName $galleryUniqueName -Name $galleryDefinitionName -Location $region 

 

List image versions of a parent Gallery shared with subscription 

Get-AzGalleryImageVersion -GalleryUniqueName $galleryUniqueName -GalleryImageDefinitionName $galleryDefinitionName -Location $region 

 

List image versions of a parent Gallery shared with tenant 

Get-AzGalleryImageVersion -GalleryUniqueName $galleryUniqueName -GalleryImageDefinitionName $galleryDefinitionName -Location $region -Scope "tenant" 

 

Get the sharedGalleryImageId of an image version 

Get-AzGalleryImageVersion -GalleryUniqueName $galleryUniqueName -GalleryImageDefinitionName $galleryDefinitionName -Name $galleryImageVersionName -Location $region 

 

Deploy a VM from an image version in a subscription or tenant-shared gallery  

 

To be filled in later 

Deploy a VMSS from an image version in a subscription or tenant-shared gallery  

 

To be filled in later 

 
### [REST](#tab/restdirect)

Create a gallery for subscription / tenant-level sharing 

PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{rgName}/providers/Microsoft.Compute/galleries/{gallery-name}?api-version=2020-09-30 

 

{ 

"properties": { 

"sharingProfile": { 

"permissions": "Groups" 

} 

}, 

"location": "{location}" 

} 

 

Share gallery to subscription and/or tenant 

POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{rgName}/providers/Microsoft.Compute/galleries/{galleryName}/share?api-version=2020-09-30 

 

{ 

"operationType": "Add", 

"groups":[  

{ 

"type": "Subscriptions", 

"ids": [ 

"{subscriptionId1}", 

"{subscriptionId2}" 

], 

"type": "AADTenants", 

"ids": [ 

"{tenantId1}", 

"{tenantId2}" 

] 

} 

] 

} 

 

Remove access for a subscription / tenant 

POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{rgName}/providers/Microsoft.Compute/galleries/{galleryName}/share?api-version=2020-09-30 

 

{ 

"operationType": "Remove", 

"groups":[  

{ 

"type": "Subscriptions", 

"ids": [ 

"{subscriptionId1}", 

"{subscriptionId2}" 

], 

"type": "AADTenants", 

"ids": [ 

"{tenantId1}", 

"{tenantId2}" 

] 

} 

] 

} 

 

Reset (clear everything in sharingProfile)  

POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{rgName}/providers/Microsoft.Compute/galleries/{galleryName}/share?api-version=2020-09-30 

 

{ 

 "operationType" : "Reset", 

} 

 

List Galleries shared with subscription 

GET 

https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{rgName}/providers/Microsoft.Compute/Locations/{location}/SharedGalleries?api-version=2020-09-30 

 

Response 

{	 

"value": [ 

{ 

"identifier": { 

"uniqueId": "/SharedGalleries/{SharedGalleryUniqueName}"         

}, 

"name": "galleryuniquename1", 

   		"type": "Microsoft. Compute/sharedGalleries", 

   		"location": "location" 

  	}, 

  	{ 

"identifier": { 

"uniqueName": "/SharedGalleries/{SharedGalleryUniqueName}"       

}, 

"name": "galleryuniquename2", 

"type": "Microsoft. Compute/sharedGalleries", 

"location": "location" 

  	} 

], 

} 

 

List Galleries shared with tenant 

GET 

https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Compute/Locations/{location}/SharedGalleries?api-version=2020-09-30&sharedTo=tenant 

 

Response 

{	 

"value": [ 

{ 

"identifier": { 

"uniqueName": "/SharedGalleries/{SharedGalleryUniqueName}"         

}, 

"name": "galleryuniquename1", 

   		"type": "Microsoft. Compute/sharedGalleries", 

   		"location": "location" 

  	}, 

  	{ 

"identifier": { 

"uniqueName": "/SharedGalleries/{SharedGalleryUniqueName}"       

}, 

"name": "galleryuniquename2", 

"type": "Microsoft. Compute/sharedGalleries", 

"location": "location" 

  	} 

], 

} 

 

Get uniqueId, permissions, and permitted groups for a Shared Gallery (available only to image owner) 

GET  

https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{rgName}/providers/Microsoft.Compute/galleries/{galleryName}?api-version=2020-09-30&$expand=sharingProfile/Groups 

Response 

"name": "{galleryName}", 

 	"id": "/subscriptions/{subscriptionId}/resourceGroups/{rgName}/providers/Microsoft.Compute/galleries/{galleryName}", 

"type": "Microsoft.Compute/galleries", 

"location": "{location}", 

"properties": { 

"description": "gallery test", 

"identifier": { 

"uniqueId": "00000000-0000-0000-0000-000000000000-GALLERYNAME" 

}, 

"sharingProfile": { 

   		"permissions": "Groups", 

   		"groups": [ 

{ 

"type": "Subscriptions", 

"ids": [ 

"{subscriptionId1}", 

"{subscriptionId2}" 

] 

}, 

{ 

"type": "AADTenants", 

"ids": [ 

"{tenantId1}", 

"{tenantId2}" 

] 

} 

] 

  	}, 

"provisioningState": "Succeeded" 

} 

} 

 

List image definitions of a parent Gallery shared with subscription 

GET https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Compute/locations/{location}/sharedGalleries/{sharedGalleryUniqueName}/images?api-version=2020-09-30 

 

Response 

{ 

"value": [ 

{ 

"name": "galleryuniquename2", 

"type": "Microsoft. Compute/sharedGalleries", 

"identifier": {  

"uniqueName": "/SharedGalleries/{SharedGalleryUniqueName}/Images/{galleryImageName}" 

}, 

"location": "location" 

} 

] 

} 

 

 

List image definitions of a parent Gallery shared with tenant 

GET https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Compute/locations/{location}/sharedGalleries/{sharedGalleryUniqueName}/images?api-version=2020-09-30&sharedTo=tenant 

 

{ 

"value": [ 

{ 

"name": "galleryuniquename2", 

"type": "Microsoft. Compute/sharedGalleries", 

"identifier": {  

"uniqueName": "/SharedGalleries/{SharedGalleryUniqueName}/Images/{galleryImageName}" 

}, 

"location": "location" 

} 

] 

} 

 

Get uniqueName of an image definition within a shared gallery 

GET https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Compute/Locations/{location}/SharedGalleries/{sharedGalleryUniqueName}/Images/{galleryImageName}?api-version=2020-09-30 

 

{ 

"name": "galleryuniquename2", 

"type": "Microsoft. Compute/sharedGalleries", 

"identifier": {  

"uniqueName": "/SharedGalleries/{SharedGalleryUniqueName}/Images/{galleryImageName}" 

} 

"location": "location" 

} 

 

List image versions of a parent Gallery shared with subscription 

GET https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Compute/locations/{location}/sharedGalleries/{sharedGalleryUniqueName}/images/{galleryImageName}/versions?api-version=2020-09-30 

 

Response 

{  

"value": [ 

{ 

"location": "{location}", 

"id": "/subscriptions/{subscriptionId}/resourceGroups/{rgName}/providers/Microsoft.Compute/sharedGalleries/galleryuniquename1/images/myImage1/versions/1.0.0", 

"name": "1.0.0", 

"properties": {} 

}, 

{ 

"location": "{location}", 

"id": "/subscriptions/{subscriptionId}/resourceGroups/{rgName}/providers/Microsoft.Compute/sharedGalleries/galleryuniquename1/images/myImage1/versions/2.0.0", 

"name": "2.0.0", 

"properties": {} 

} 

] 

} 

 

 

List image versions of a parent Gallery shared with tenant 

GET https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Compute/locations/{location}/sharedGalleries/{sharedGalleryUniqueName}/images/{galleryImageName}/versions?api-version=2020-09-30&sharedTo=tenant 

 

Response 

{  

"value": [ 

{ 

"location": "{location}", 

"id": "/subscriptions/{subscriptionId}/resourceGroups/{rgName}/providers/Microsoft.Compute/sharedGalleries/galleryuniquename1/images/myImage1/versions/1.0.0", 

"name": "1.0.0", 

"properties": {} 

}, 

{ 

"location": "{location}", 

"id": "/subscriptions/{subscriptionId}/resourceGroups/{rgName}/providers/Microsoft.Compute/sharedGalleries/galleryuniquename1/images/myImage1/versions/2.0.0", 

"name": "2.0.0", 

"properties": {} 

} 

] 

} 

 

 

Get the sharedGalleryImageId of an image version 

GET https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Compute/Locations/{location}/SharedGalleries/{sharedGalleryUniqueName}/Images/{galleryImageName}/Versions/{1.0.0}?api-version=2020-09-30 

 

Response 

{ 

"name": "galleryuniquename2", 

"type": "Microsoft.Compute/sharedGalleries", 

"identifier": {  

"uniqueName": "/sharedGalleries/{SharedGalleryUniqueName}/images/{galleryImageName}/versions/1.0.0"     

}, 

"location": "location" 

} 

} 

 

Deploy a VM from an image version in a subscription or tenant-shared gallery  

PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{rg}/providers/Microsoft.Compute/virtualMachines/{VMName}?api-version=2021-03-01  
 

{ 

... 

"properties": { 

... 

"storageProfile": { 

"imageReference": { 

"sharedGalleryImageId":"/sharedGalleries/11111111-1111-1111-1111-111111111111-{galleryName}/images/{galleryImageName}/versions/1.0.0" 

}, 

... 

  	}, 
		... 

} 

} 

 

Deploy a VMSS from an image version in a subscription or tenant-shared gallery  

PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{rg}/providers/Microsoft.Compute/virtualMachineScaleSets/{vmssName}?api-version=2021-03-01 
 

{ 

  ... 

  "properties": { 

    ... 

    "virtualMachineProfile": { 

      "storageProfile": { 

        "imageReference": { 

          "sharedGalleryImageId":"/sharedGalleries/11111111-1111-1111-1111-111111111111-{galleryName}/images/{galleryImageName}/versions/1.0.0"}, 

        ... 

      }, 

      ... 

    }, 

    ... 

  } 

} 
---

<a name=community></a>
## Community gallery (preview)

To share a gallery with all Azure users, you can [create a community gallery (preview)](create-gallery.md#community). Community galleries can be used by anyone with an Azure subscription. Someone creating a VM can browse images shared with the community using the portal, REST, or the Azure CLI.

> [!IMPORTANT]
> Azure Compute Gallery – community galleries is currently in PREVIEW and subject to the [Preview Terms for Azure Compute Gallery - community gallery](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
> 
> To publish a community gallery, you need to register for the preview at [https://aka.ms/communitygallery-preview](https://aka.ms/communitygallery-preview). Creating VMs from the community gallery is open to all Azure users.
> 
> During the preview, the gallery must be created as a community gallery (for CLI, this means using the `--permissions community` parameter) you currently can't migrate a regular gallery to a community gallery.

To learn more, see [Community gallery (preview) overview](azure-compute-gallery.md#community) and [Create a community gallery](create-gallery.md#community).



## Next steps

Create an [image definition and an image version](image-version.md).

You can also create Azure Compute Gallery resources using templates. There are several quickstart templates available:

- [Create an Azure Compute Gallery](https://azure.microsoft.com/resources/templates/sig-create/)
- [Create an Image Definition in an Azure Compute Gallery](https://azure.microsoft.com/resources/templates/sig-image-definition-create/)
- [Create an Image Version in an Azure Compute Gallery](https://azure.microsoft.com/resources/templates/sig-image-version-create/)
