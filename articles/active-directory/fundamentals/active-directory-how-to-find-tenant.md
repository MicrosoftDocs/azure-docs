---
title: How to find your tenant ID - Azure Active Directory
description: Instructions about how to find and Azure Active Directory tenant ID to an existing Azure subscription.
services: active-directory
author: ajburnle
manager: daveba

ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: how-to
ms.date: 10/30/2020
ms.author: ajburnle
ms.reviewer: jeffsta
ms.custom: "it-pro, devx-track-azurepowershell"
ms.collection: M365-identity-device-management
---

# How to find your Azure Active Directory tenant ID

Azure subscriptions have a trust relationship with Azure Active Directory (Azure AD). Azure AD is trusted to authenticate users, services, and devices for the subscription. Each subscription has a tenant ID associated with it, and there are a few ways you can find the tenant ID for your subscription.

## Find tenant ID through the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).
 
1. Select **Azure Active Directory**.

1. Select **Properties**.

1. Then, scroll down to the **Tenant ID** field. Your tenant ID will be in the box.

:::image type="content" source="media/active-directory-how-to-find-tenant/portal-tenant-id.png" alt-text="Azure Active Directory - Properties - Tenant ID - Tenant ID field":::

## Find tenant ID with PowerShell

You can also find the tenant programmatically. To find the tenant ID with Azure PowerShell, use the cmdlet `Get-AzTenant`.

```azurepowershell-interactive
Connect-AzAccount
Get-AzTenant
```
   
For more information, see this Azure PowerShell cmdlet reference for [Get-AzTenant](/powershell/module/az.accounts/get-aztenant).


## Find tenant ID with CLI
If you want to use a command-line interface to find the tenant ID, you can do so with [Azure CLI](/cli/azure/install-azure-cli) or [Microsoft 365 CLI](https://pnp.github.io/cli-microsoft365/). 

For Azure CLI, use one of the commands **az login**, **az account list**, or **az account tenant list** as shown in the following example. Notice the **tenantId** property for each of your subscriptions in the output from each command.

```azurecli-interactive
az login
az account list
az account tenant list
```

For more information, see [az login](/cli/azure/reference-index#az_login) command reference, [az account](/cli/azure/ext/account/account) command reference, or [az account tenant](/cli/azure/ext/account/account/tenant) command reference.


For Microsoft 365 CLI, use the cmdlet **tenant id** as shown in the following example:
 
```cli
m365 tenant id get
```

For more information, see the Microsoft 365 [tenant id get](https://pnp.github.io/cli-microsoft365/cmd/tenant/id/id-get/) command reference.


## Next steps

- To create a new Azure AD tenant, see [Quickstart: Create a new tenant in Azure Active Directory](active-directory-access-create-new-tenant.md).

- To learn how to associate or add a subscription to a tenant, see [Associate or add an Azure subscription to your Azure Active Directory tenant](active-directory-how-subscriptions-associated-directory.md).

- To learn how to find the object ID, see [Find the user object ID](/partner-center/find-ids-and-domain-names#find-the-user-object-id).
