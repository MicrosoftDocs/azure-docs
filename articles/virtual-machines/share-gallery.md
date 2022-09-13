---
title: Share resources in an Azure Compute Gallery
description: Learn how to share resources explicitly or to all Azure users using role-based access control or community galleries.
author: sandeepraichura
ms.service: virtual-machines
ms.subservice: gallery
ms.topic: how-to
ms.workload: infrastructure
ms.date: 06/14/2022
ms.author: saraic
ms.reviewer: cynthn
ms.custom: template-how-to , devx-track-azurecli 
ms.devlang: azurecli

---

# Share gallery resources

As the Azure Compute Gallery, definition, and version are all resources, they can be shared using the built-in native Azure Roles-based Access Control (RBAC) roles. Using Azure RBAC roles you can share these resources to other users, service principals, and groups. You can even share access to individuals outside of the tenant they were created within. Once a user has access, they can use the gallery resources to deploy a VM or a Virtual Machine Scale Set.  Here's the sharing matrix that helps understand what the user gets access to:

| Shared with User     | Azure Compute Gallery | Image Definition | Image version |
|----------------------|----------------------|--------------|----------------------|
| Azure Compute Gallery | Yes                  | Yes          | Yes                  |
| Image Definition     | No                   | Yes          | Yes                  |

We recommend sharing at the Gallery level for the best experience. We don't recommend sharing individual image versions. For more information about Azure RBAC, see [Assign Azure roles](../role-based-access-control/role-assignments-portal.md).

There are three main ways to share images in an Azure Compute Gallery, depending on who you want to share with:

| Share with\: | Option |
|----|----|
| Specific people, groups, or service principals (described in this article) | Role-based access control (RBAC) lets you share resources to specific people, groups, or service principals on a granular level. |
| [Subscriptions or tenants](./share-gallery-direct.md) | A direct shared gallery lets you share to everyone in a subscription or tenant. |
| [Everyone](./share-gallery-community.md) | Community gallery lets you share your entire gallery publicly, to all Azure users. |


## Share using RBAC

### [Portal](#tab/portal)

1. On the page for your gallery, in the menu on the left, select **Access control (IAM)**. 
1. Under **Add a role assignment**, select **Add**. The **Add a role assignment** pane will open. 
1. Under **Role**, select **Reader**.
1. Under **assign access to**, leave the default of **Azure AD user, group, or service principal**.
1. Under **Select**, type in the email address of the person that you would like to invite.
1. If the user is outside of your organization, you'll see the message **This user will be sent an email that enables them to collaborate with Microsoft.** Select the user with the email address and then click **Save**.


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


## Next steps

- Create an [image definition and an image version](image-version.md).
- Create a VM from a [generalized](vm-generalized-image-version.md#create-a-vm-from-your-gallery) or [specialized](vm-specialized-image-version.md#create-a-vm-from-your-gallery) private gallery.


