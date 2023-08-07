---
title: Get subscription and tenant IDs in the Azure portal
description: To get them
ms.date: 04/11/2023
ms.topic: conceptual
---

# Get subscription and tenant IDs in the Azure portal

A tenant is an [Azure Active Directory (Azure AD)](../active-directory/fundamentals/active-directory-whatis.md) entity that typically encompasses an organization. Tenants can have one or more subscriptions, which are agreements with Microsoft to use cloud services, including Azure. Every Azure resource is associated with a subscription.

Each subscription has an ID associated with it, as does the tenant to which a subscription belongs. As you perform different tasks, you may need the ID for a subscription or tenant. You can find these values in the Azure portal.

## Find your Azure subscription

Follow these steps to retrieve the ID for a subscription in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Under the Azure services heading, select **Subscriptions**. If you don't see **Subscriptions** here, use the search box to find it.
1. Find the subscription in the list, and note the **Subscription ID** shown in the second column. If no subscriptions appear, or you don't see the right one, you may need to [switch directories](set-preferences.md#switch-and-manage-directories) to show the subscriptions from a different Azure AD tenant.
1. To easily copy the **Subscription ID**, select the subscription name to display more details. Select the **Copy to clipboard** icon shown next to the **Subscription ID** in the **Essentials** section. You can paste this value into a text document or other location.

> [!TIP]
> You can also list your subscriptions and view their IDs programmatically by using [Get-AzSubscription](/powershell/module/az.accounts/get-azsubscription) (Azure PowerShell) or [az account list](/cli/azure/account#az-account-list) (Azure CLI).

## Find your Azure AD tenant

Follow these steps to retrieve the ID for an Azure AD tenant in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Confirm that you are signed into the tenant for which you want to retrieve the ID. If not, [switch directories](set-preferences.md#switch-and-manage-directories) so that you're working in the right tenant.
1. Under the Azure services heading, select **Azure Active Directory**. If you don't see **Azure Active Directory** here, use the search box to find it.
1. Find the **Tenant ID** in the **Basic information** section of the **Overview** screen.
1. Copy the **Tenant ID** by selecting the **Copy to clipboard** icon shown next to it. You can paste this value into a text document or other location.

> [!TIP]
> You can also find your tenant programmatically by using [Azure Powershell](/azure/active-directory/fundamentals/how-to-find-tenant#find-tenant-id-with-powershell) or [Azure CLI](/azure/active-directory/fundamentals/how-to-find-tenant#find-tenant-id-with-cli).

## Next steps

- Learn more about [Azure Active Directory](../active-directory/fundamentals/active-directory-whatis.md).
- Learn how to manage Azure subscriptions [with Azure CLI](/cli/azure/manage-azure-subscriptions-azure-cli) or [with Azure PowerShell](/powershell/azure/manage-subscriptions-azureps).
- Learn how to [manage Azure portal settings and preferences](set-preferences.md).
