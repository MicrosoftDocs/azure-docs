---
title: Share resources in an Azure Compute Gallery
description: Learn how to share resources explicitly or to all Azure users using role-based access control or community galleries.
author: sandeepraichura
ms.service: virtual-machines
ms.subservice: gallery
ms.topic: how-to
ms.workload: infrastructure
ms.date: 04/24/2022
ms.author: saraic
ms.reviewer: cynthn
ms.custom: template-how-to , devx-track-azurecli 
ms.devlang: azurecli

---

# Share gallery resources

There are two main ways to share images in an Azure Compute Gallery:

- Role-based access control (RBAC) lets you share resources to specific people, groups, or service principals on a granular level.
- Community gallery lets you share your entire gallery publicly, to all Azure users.

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
