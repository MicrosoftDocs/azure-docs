---
title: Manage billing across multiple tenants
titleSuffix: Microsoft Cost Management
description: Describes how to use associated billing tenants to manage billing across tenants and move subscriptions in different tenants.
author: bandersmsft
ms.reviewer: amberb
tags: billing
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 08/15/2022
ms.author: banders
---

# Manage billing across multiple tenants using associated billing tenants

You can simplify billing management for your organization by creating multi-tenant billing relationships using associated billing tenants. A multi-tenant billing relationship lets you securely share your organization’s billing account with other tenants, while maintaining control over your billing data. You can move subscriptions in different tenants and provide users in those tenants with access to your organization’s billing account. This relationship lets users on those tenants do billing activities like viewing and downloading invoices or managing licenses.

## Understand tenant types

Primary billing tenant: The primary billing tenant is the tenant used when the billing account is set up. By default, all subscriptions are created in this tenant and only users from this tenant can get access to the billing account.

Associated billing tenants: An associated billing tenant is a tenant that is linked to your primary billing tenant’s billing account. You can move Microsoft 365 subscriptions to these tenants. You can also assign billing account roles to users in associated billing tenants.

> [!IMPORTANT]
> Adding associated billing tenants, moving subscriptions and assigning roles to users in associated billing tenants are only available for billing accounts of type Microsoft Customer Agreement that are created by working with a Microsoft sales representative. To learn more about types of billing accounts, see [Billing accounts and scopes in the Azure portal](view-all-accounts.md).

## Access settings for associated billing tenants

When you add an associated billing tenant, you can enable one or both of the following access settings:

- **Billing management**: Billing management lets billing account owners assign roles to users in an associated billing tenant, giving them permission to access billing information and make purchasing decisions.
- **Provisioning**: Provisioning allows you to move Microsoft 365 subscriptions to the associated billing tenants.

## Add an associated billing tenant

Before you begin, make sure you have either the tenant ID, or the primary domain name for the tenant you want to add. For more information, see [Find a tenant ID or domain name](find-tenant-id-domain.md).

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for **Cost Management + Billing**.  
    :::image type="content" source="./media/manage-billing-across-tenants/billing-search-cost-management-billing.png" alt-text="Screenshot showing Search in the Azure portal for Cost Management + Billing." lightbox="./media/manage-billing-across-tenants/billing-search-cost-management-billing.png" :::
1. Select **Access control (IAM)** on the left side of the page.
1. On the Access control (IAM) page, select **Associated billing tenants** at the top of the page.  
    :::image type="content" source="./media/manage-billing-across-tenants/access-management-associated-tenants.png" alt-text="Screenshot showing the Access control page while adding an associated tenant." lightbox="./media/manage-billing-across-tenants/access-management-associated-tenants.png" :::
1. On the Associated billing tenants page, select **Add** at the top of the page.
    :::image type="content" source="./media/manage-billing-across-tenants/associated-tenants-list-add.png" alt-text="Screenshot showing the Add option for Associated billing tenants." lightbox="./media/manage-billing-across-tenants/associated-tenants-list-add.png" :::
1. On the Add tenant page, enter a tenant ID or domain name, provide a friendly name and then select one or both options for access settings. For more information about access settings, see [Access settings for associated billing tenant](#access-settings-for-associated-billing-tenants).  
    :::image type="content" source="./media/manage-billing-across-tenants/associated-tenants-add.png" alt-text="Screenshot showing associated billing tenants form." lightbox="./media/manage-billing-across-tenants/associated-tenants-add.png" :::
    > [!NOTE]
    > The friendly name of an associated billing tenant is used to easily identify the tenant in the Cost management + Billing section. The name is different from the display name of the tenant in Microsoft Entra ID.
1. Select **Save**.

If the Provisioning access setting is turned on, a unique link is created for you to send to the global administrator of the associated billing tenant. They must accept the request before you can move subscriptions to their tenant.

:::image type="content" source="./media/manage-billing-across-tenants/associated-tenants-list-added.png" alt-text="Screenshot showing provisioning request URL." lightbox="./media/manage-billing-across-tenants/associated-tenants-list-added.png" :::

## Assign roles to users from the associated billing tenant

Before assigning roles, make sure you [add a tenant as an associated billing tenant and enable billing management access setting](#add-an-associated-billing-tenant).

> [!IMPORTANT]
> Any user with a role in the billing account can see all users from all tenants who have access to that billing account. For example, Contoso.com is the primary billing tenant. A billing account owner adds Fabrikam.com as an associated billing tenant. Then, the billing account owner adds User1 as a billing account owner. As a result, User1 can see all users who have access to the billing account on both Contoso.com and Fabrikam.com.

### To assign roles and send an email invitation

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for **Cost Management + Billing**.  
    :::image type="content" source="./media/manage-billing-across-tenants/billing-search-cost-management-billing.png" alt-text="Screenshot showing Search in the Azure portal for cost management + billing" lightbox="./media/manage-billing-across-tenants/billing-search-cost-management-billing.png" :::
1. Select **Access control (IAM)** on the left side of the page.
1. On the Access control (IAM) page, select **Add** at the top of the page.  
    :::image type="content" source="./media/manage-billing-across-tenants/access-management-add-role-assignment-button.png" alt-text="Screenshot showing access control page while assigning roles." lightbox="./media/manage-billing-across-tenants/access-management-add-role-assignment-button.png" :::
1. In the Add role assignment pane, select a role, select the associated billing tenant from the tenant dropdown, then enter the email address of the users, groups or apps to whom you want to assign roles.
1. Select **Add**.  
    :::image type="content" source="./media/manage-billing-across-tenants/associated-tenants-add-role-assignment.png" alt-text="Screenshot showing saving a role assignment." lightbox="./media/manage-billing-across-tenants/associated-tenants-add-role-assignment.png" :::
1. The users receive an email with a link to review the role assignment request. After they accept the role, they have access to your billing account.

### To manually share the invitation link

If the users can't receive emails, you can copy the review link and share it with them. Follow the steps in the preceding section then:

1. Select **Manage requests** at the top of the **Access control (IAM)** page.  
    :::image type="content" source="./media/manage-billing-across-tenants/access-management-manage-requests.png" alt-text="Screenshot showing the Manage requests option." lightbox="./media/manage-billing-across-tenants/access-management-manage-requests.png" :::
1. Select the role assignment request.  
    :::image type="content" source="./media/manage-billing-across-tenants/access-management-requests-list.png" alt-text="Screenshot showing billing access requests list." lightbox="./media/manage-billing-across-tenants/access-management-requests-list.png" :::
1. Copy the request URL.  
    :::image type="content" source="./media/manage-billing-across-tenants/role-assignment-request-details.png" alt-text="Screenshot showing the invitation URL for role assignment request." lightbox="./media/manage-billing-across-tenants/role-assignment-request-details.png" :::
1. Manually share the link with the user.

### Role assignments through associated billing tenants vs Azure B2B 

Choosing to assign roles to users from associated billing tenants might be the right approach, depending on the needs of your organization. The following illustrations and table compare using associated billing tenants and Azure B2B to help you decide which approach is right for your organization. To learn more about Azure B2B, see [B2B collaboration overview](../../active-directory/external-identities/what-is-b2b.md)

:::image type="content" source="./media/manage-billing-across-tenants/associated-tenants-role-assignment.png" alt-text="Illustration showing associated billing tenant role assignment." border="false" lightbox="./media/manage-billing-across-tenants/associated-tenants-role-assignment.png" :::

:::image type="content" source="./media/manage-billing-across-tenants/b2b-role-assignment.png" alt-text="Illustration showing B2B role assignment." border="false" lightbox="./media/manage-billing-across-tenants/b2b-role-assignment.png" :::

| Consideration |Associated billing tenants  |Azure B2B  |
|---------|---------|---------|
|Security     |  The users that you invite to share your billing account will follow their tenant's security policies.      |  The users that you invite to share your billing account will follow your tenant's security policies.       |
|Access    | The users get access to your billing account in their own tenant and can manage billing and make purchases without switching tenants.        |  External guest identities are created for users in your tenant and these identities get access to your billing account. Users would have to switch tenant to manage billing and make purchases.     |

## Move Microsoft 365 subscriptions to a billing tenant

Before moving subscriptions, make sure you [add a tenant as an associated billing tenant and enable provisioning access setting](#add-an-associated-billing-tenant). Also the global administrator of the associated billing tenant must accept the provisioning request from your billing account.

> [!IMPORTANT]
> You can only move a subscription to an associated billing tenant if all licenses in the subscription are available. If any licenses are assigned, you can’t move the subscription.

1. Go to the [Microsoft admin center](https://admin.microsoft.com).
1. In the admin center, go to the **Billing > Your products page**.
1. Select the name of the product that you want to move to the associated billing tenant.
1. On the product details page, in the **Licenses assigned from all subscriptions** section, select **Move to another tenant**.
1. In the **Move subscription to a different tenant** pane, search for a tenant name or select a tenant from the list, then select **Move subscription**.

## Move Azure subscriptions to an associated billing tenant

The provisioning setting that you enable for an associated billing tenant doesn't apply for Azure subscriptions. To move Azure subscriptions to an associated billing tenant, see [Associate or add an Azure subscription to your Microsoft Entra tenant](../../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md).

## Need help? Contact support

If you need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.

## Next steps

- [Billing administrative roles](understand-mca-roles.md)
- [Associate or add an Azure subscription to your Microsoft Entra tenant](../../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md)
