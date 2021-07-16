---
title: Share a gallery
description: Learn how to share a gallery.
author: cynthn
ms.service: virtual-machines
ms.subservice: shared-image-gallery
ms.topic: how-to
ms.workload: infrastructure
ms.date: 07/15/2021
ms.author: cynthn
ms.reviewer: akjosh
ms.custom: template-how-to 

---

# Share a gallery 

We recommend that you share access at the gallery level.




### [Portal](#tab/portal)

<!-- Introduction paragraph if needed. The numbering is automatically controlled, so you can put 1. for each step and the rendering engine will fix the numbers in the live content. -->

1. Open the [portal](https://portal.azure.com).
1. In the search bar, type **<name_of_feature>**.
1. Select **<name_of_feature>**.
1. In the left menu under **Settings**, select **<something>**.
1. In the **<something>** page, select **<something>**.

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

For more information about how to share resources using RBAC, see [Manage access using RBAC and Azure CLI](../articles/role-based-access-control/role-assignments-cli.md).

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



### [REST](#tab/rest)

<!-- Introduction paragraph if needed -->

```rest

```

---


## Next steps

Create an image from a [VM](image-version-vm-powershell.md), a [managed image](image-version-managed-image-powershell.md), or an [image in another gallery](image-version-another-gallery-powershell.md).

[Azure Image Builder (preview)](./image-builder-overview.md) can help automate image version creation, you can even use it to update and [create a new image version from an existing image version](./windows/image-builder-gallery-update-image-version.md). 

You can also create Shared Image Gallery resource using templates. There are several Azure Quickstart Templates available: 

- [Create a Shared Image Gallery](https://azure.microsoft.com/resources/templates/sig-create/)
- [Create an Image Definition in a Shared Image Gallery](https://azure.microsoft.com/resources/templates/sig-image-definition-create/)
- [Create an Image Version in a Shared Image Gallery](https://azure.microsoft.com/resources/templates/sig-image-version-create/)
