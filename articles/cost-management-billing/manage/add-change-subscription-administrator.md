---
title: Add or change Azure subscription administrators
description: Describes how to add or change an Azure subscription administrator using Azure role-based access control (Azure RBAC).
author: bandersmsft
ms.reviewer: amberb
tags: billing
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 04/10/2023
ms.author: banders

---
# Add or change Azure subscription administrators

To manage access to Azure resources, you must have the appropriate administrator role. Azure has an authorization system called [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) with several built-in roles you can choose from. You can assign these roles at different scopes, such as management group, subscription, or resource group. By default, the person who creates a new Azure subscription can assign other users administrative access to a subscription.

This article describes how to add or change the administrator role for a user using Azure RBAC at the subscription scope. 

This article applies to a Microsoft Online Service Program (pay-as-you-go) account or a Visual Studio account. If you have a Microsoft Customer Agreement (Azure plan) account, see [Understand Microsoft Customer Agreement administrative roles in Azure](understand-mca-roles.md). If you have an Azure Enterprise Agreement, see [Manage Azure Enterprise Agreement roles](understand-ea-roles.md).

Microsoft recommends that you manage access to resources using Azure RBAC. However, if you are still using the classic deployment model and managing the classic resources by using [Azure Service Management PowerShell Module](/powershell/azure/servicemanagement/install-azure-ps), you'll need to use a classic administrator.

> [!TIP]
> If you only use the Azure portal to manage the classic resources, you don't need to use the classic administrator.

For more information, see [Azure Resource Manager vs. classic deployment](../../azure-resource-manager/management/deployment-models.md) and [Azure classic subscription administrators](../../role-based-access-control/classic-administrators.md).

## Determine account billing administrator

<a name="whoisaa"></a>

The billing administrator is the person who has permission to manage billing for an account. They're authorized to access billing on the [Azure portal](https://portal.azure.com) and do various billing tasks like create subscriptions, view and pay invoices, or update payment methods.

To identify accounts for which you're a billing administrator, visit the [Cost Management + Billing page in Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Billing/ModernBillingMenuBlade/Overview). Then select **All billing scopes** from the left-hand pane. The subscriptions page shows all the subscriptions where you're a billing administrator.

If you're not sure who the account administrator is for a subscription, visit the [Subscriptions page in Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade). Then select the subscription you want to check, and then look under **Settings**. Select **Properties** and the account administrator of the subscription is shown in the **Account Admin** box. 

If you don't see **Account Admin**, you might have a Microsoft Customer Agreement or Enterprise Agreement account. Instead, [check your access to a Microsoft Customer Agreement](understand-mca-roles.md#check-access-to-a-microsoft-customer-agreement) or see [Manage Azure Enterprise Agreement roles](understand-ea-roles.md).

## Assign a subscription administrator

<a name="add-an-admin-for-a-subscription"></a>

To make a user an administrator of an Azure subscription, an existing billing administrator assigns them the [Owner](../../role-based-access-control/built-in-roles.md#owner) role (an Azure role) at the subscription scope. The Owner role gives the user full access to all resources in the subscription, including the right to delegate access to others. These steps are the same as any other role assignment.

If you're not sure who the account billing administrator is for a subscription, use the following steps to find out.

1. Open the [Subscriptions page in the Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade).
1. Select the subscription you want to check, and then look under **Settings**.
1. Select **Properties**. The account billing administrator of the subscription is displayed in the **Account Admin** box.

### To assign a user as an administrator

- Assign the Owner role to a user at the subscription scope.  
     For detailed steps, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md).

## Need help? Contact support

If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.

## Next steps

* [What is Azure role-based access control (Azure RBAC)?](../../role-based-access-control/overview.md)
* [Understand the different roles in Azure](../../role-based-access-control/rbac-and-directory-admin-roles.md)
* [Associate or add an Azure subscription to your Azure Active Directory tenant](../../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md)
* [Administrator role permissions in Azure Active Directory](../../active-directory/roles/permissions-reference.md)
