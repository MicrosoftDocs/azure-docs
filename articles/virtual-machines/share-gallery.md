---
title: Share resources in an Azure Compute Gallery
description: Learn how to share resources explicitly or to all Azure users using role-based access control.
author: sandeepraichura
ms.service: virtual-machines
ms.subservice: gallery
ms.topic: how-to
ms.workload: infrastructure
ms.date: 02/14/2023
ms.author: saraic
ms.reviewer: cynthn
ms.custom: template-how-to , devx-track-azurecli 
ms.devlang: azurecli

---

# Share gallery resources across subscriptions and tenants with RBAC

As the Azure Compute Gallery, definition, and version are all resources, they can be shared using the built-in native Azure Roles-based Access Control (RBAC) roles. Using Azure RBAC roles you can share these resources to other users, service principals, and groups. You can even share access to individuals outside of the tenant they were created within. Once a user has access, they can use the gallery resources to deploy a VM or a Virtual Machine Scale Set.  Here's the sharing matrix that helps understand what the user gets access to:

| Shared with User     | Azure Compute Gallery | Image Definition | Image version |
|----------------------|----------------------|--------------|----------------------|
| Azure Compute Gallery | Yes                  | Yes          | Yes                  |
| Image Definition     | No                   | Yes          | Yes                  |

We recommend sharing at the Gallery level for the best experience. We don't recommend sharing individual image versions. For more information about Azure RBAC, see [Assign Azure roles](../role-based-access-control/role-assignments-portal.md).

There are three main ways to share images in an Azure Compute Gallery, depending on who you want to share with:

| Sharing with: | People | Groups | Service Principal | All users in a specific subscription (or) tenant | Publicly with all users in   Azure |
|---|---|---|---|---|---|
| RBAC Sharing | Yes | Yes | Yes | No | No |
| RBAC + [Direct shared gallery](./share-gallery-direct.md)  | Yes | Yes | Yes | Yes | No |
| RBAC + [Community gallery](./share-gallery-community.md) | Yes | Yes | Yes | No | Yes |


You can also create an [App registration](./share-using-app-registration.md) to share images between tenants.

## Share using RBAC

When you share a gallery using RBAC, you need to provide the `imageID` to anyone creating a VM or scale set from the image. There is no way for the person deploying the VM or scale set to list the images that were shared to them using RBAC.

If you share gallery resources to someone outside of your Azure tenant, they will need your `tenantID` to log in and have Azure verify they have access to the resource before they can use it within their own tenant. You will need to provide them with your `tenantID`, there is no way for someone outside your organization to query for your `tenantID`.

> [!IMPORTANT]
> RBAC sharing can be used to share resources with users within the organization (or) users outside the organization (cross-tenant). Here are the instructions to consume an image shared with RBAC and create VM/VMSS:
> 
> [RBAC - Shared within your organization](vm-generalized-image-version.md#rbac---shared-within-your-organization)
> 
> [RBAC - Shared from another tenant](vm-generalized-image-version.md#rbac---shared-from-another-tenant)
> 

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
- Create a VM from a [generalized](vm-generalized-image-version.md) or [specialized](vm-specialized-image-version.md) image in a gallery.


