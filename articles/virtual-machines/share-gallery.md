---
title: Share a gallery using RBAC
description: Learn how to share a gallery using role-based access control (RBAC).
author: cynthn
ms.service: virtual-machines
ms.subservice: shared-image-gallery
ms.topic: how-to
ms.workload: infrastructure
ms.date: 08/02/2021
ms.author: cynthn
ms.reviewer: akjosh
ms.custom: template-how-to 

---

# Use RBAC to share image gallery resources

As the Shared Image Gallery, image Definition, and image version are all resources, they can be shared using the built-in native Azure RBAC controls. Using Azure RBAC you can share these resources to other users, service principals, and groups. You can even share access to individuals outside of the tenant they were created within. Once a user has access to the Shared Image version, they can deploy a VM or a Virtual Machine Scale Set.  

We recommend sharing at the Gallery level for the best experience. We do not recommend sharing individual image versions. For more information about Azure RBAC, see [Assign Azure roles](../role-based-access-control/role-assignments-portal.md).

If the user is outside of your organization, they will get an email invitation to join the organization. The user needs to accept the invitation, then they will be able to see the gallery and all of the image definitions and versions in their list of resources.

## Share a gallery

### [Portal](#tab/portal)

If the user is outside of your organization, they will get an email invitation to join the organization. The user needs to accept the invitation, then they will be able to see the gallery and all of the image definitions and versions in their list of resources.

1. On the page for your image gallery, in the menu on the left, select **Access control (IAM)**. 
1. Under **Add a role assignment**, select **Add**. The **Add a role assignment** pane will open. 
1. Under **Role**, select **Reader**.
1. Under **assign access to**, leave the default of **Azure AD user, group, or service principal**.
1. Under **Select**, type in the email address of the person that you would like to invite.
1. If the user is outside of your organization, you will see the message **This user will be sent an email that enables them to collaborate with Microsoft.** Select the user with the email address and then click **Save**.


### [CLI](#tab/cli)

To get the object ID of your gallery, use [az sig show](/cli/azure/sig#az_sig_show).

```azurecli-interactive
az sig show \
   --resource-group myGalleryRG \
   --gallery-name myGallery \
   --query id
```

Use the object ID as a scope, along with an email address and [az role assignment create](/cli/azure/role/assignment#az_role_assignment_create) to give a user access to the shared image gallery. Replace `<email-address>` and `<gallery iD>` with your own information.

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

Create an [image definition and an image version](image-version.md).

[Azure Image Builder (preview)](./image-builder-overview.md) can help automate image version creation, you can even use it to update and [create a new image version from an existing image version](./windows/image-builder-gallery-update-image-version.md). 

You can also create Shared Image Gallery resource using templates. There are several Azure Quickstart Templates available: 

- [Create a Shared Image Gallery](https://azure.microsoft.com/resources/templates/sig-create/)
- [Create an Image Definition in a Shared Image Gallery](https://azure.microsoft.com/resources/templates/sig-image-definition-create/)
- [Create an Image Version in a Shared Image Gallery](https://azure.microsoft.com/resources/templates/sig-image-version-create/)
