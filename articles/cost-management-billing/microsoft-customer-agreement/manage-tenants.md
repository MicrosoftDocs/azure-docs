---
title: Manage tenants in your Microsoft Customer Agreement billing account - Azure
description: The article helps you understand and manage tenants associated with your Microsoft Customer Agreement billing account.
author: bandersmsft
tags: billing
ms.service: cost-management-billing
ms.subservice: microsoft-customer-agreement
ms.topic: conceptual
ms.date: 04/05/2023
ms.author: banders
ms.reviewer: baolcsva
---

# Manage tenants in your Microsoft Customer Agreement billing account

The article helps you understand and manage tenants associated with your Microsoft Customer Agreement billing account. Use the information to manage tenants, transfer subscriptions, and administer billing ownership while you ensure secure access to your billing environment.

## What's a tenant?

A tenant is a digital representation of your organization and is primarily associated with a domain, like Microsoft.com. It's an environment managed through Azure Active Directory that enables you to assign users permissions to manage Azure resources and billing.

Each tenant is distinct and separate from other tenants. You can allow users from other tenants to access your billing account by using one of the following methods:
-	Creating guest users in your tenants and assigning the appropriate billing role.
-	Associating the other tenant to your tenant and assigning the appropriate billing role.

## What's an associated tenant? 
An associated tenant is a tenant that is linked to your primary billing tenant’s billing account. You can move Microsoft 365 subscriptions to these tenants. You can also assign billing account roles to users in associated billing tenants. Read more about associated tenants [Manage billing across multiple tenants using associated billing tenants](../manage/manage-billing-across-tenants.md). 

## How tenants and subscriptions relate to billing account

You use your Microsoft Customer Agreement (billing account) to track costs and manage billing. Each billing account has at least one billing profile. The billing profile allows you to manage your invoice and payment method. Each billing profile includes one invoice section, by default. You can create more invoice sections to group, track, and manage costs at a more granular level if needed.

- Your billing account is associated with a single, primary tenant. Users who are part of the primary tenant or who are part of associated tenants can access your billing account if they have the appropriate billing role assigned. 
- When you create a new Azure subscription for your billing account, it's created in your tenant or one of the other tenants you have access to. You can choose the tenant while creating the subscription.  
- You can move subscriptions to other tenants. You can also link existing subscriptions from other tenants to your billing account. This flexibility allows you to centrally manage billing through one tenant while keeping resources and subscriptions in other tenants based on your needs. 

The following diagram shows how billing account and subscriptions are linked to tenants. Let's assume Contoso would like to streamline their billing management through an MCA. The Contoso MCA billing account is in Tenant 1 while Contoso PAYG account is in Tenant 2. They can use a billing ownership transfer to link the subscription to their MCA billing account. The subscription and its resources will still be associated with Tenant 2, but they're paid for using the MCA billing account.

:::image type="content" source="./media/manage-tenants/billing-hierarchy-example.png" alt-text="Diagram showing an example billing hierarchy." border="false" lightbox="./media/manage-tenants/billing-hierarchy-example.png":::

## Manage subscriptions under multiple tenants in a single Microsoft Customer Agreement

Billing owners can create subscriptions when they have the [appropriate permissions](../manage/understand-mca-roles.md#subscription-billing-roles-and-tasks) to the billing account. By default, any new subscriptions created under the Microsoft Customer Agreement are in the current user’s tenant. Different tenants can be selected from the list of tenants to which the user has access to create subscriptions. 

- You can link subscriptions from other tenants to your Microsoft Customer Agreement billing account. Taking billing ownership of a subscription only changes the invoicing arrangement. It doesn't affect the service tenant or Azure RBAC roles.

### Billing ownership transfer

A billing ownership transfer only changes the invoice arrangement for a single subscription. User and resource management for the subscription do not change.

A billing ownership transfer does two things:

- The subscription’s original billing ownership is removed.
- The subscription billing ownership is *linked* to the target billing account, which could be in a different tenant/directory.

Billing ownership transfer doesn’t affect:

- Users
- Resources
- Azure RBAC permissions

## Assign roles to users to your Microsoft Customer Agreement 

There are three ways users with billing owner access can assign roles to users to MCA 

- Assign billing roles to users in the primary tenant 
- Assign billing roles to external users (outside of your primary tenant) if they are part of an associated tenant 
- If tenants are not associated, [create guest users in primary tenant and assign roles](#add-guest-users-to-your-microsoft-customer-agreement-tenant). 

## Add guest users to your Microsoft Customer Agreement tenant

Users that are added to your Microsoft Customer Agreement billing tenant, to manage billing responsibilities from a different tenant, must be invited as a guest.

To invite someone as a guest, the user must have an existing email address with a domain that's different from your Azure Active Directory (AD) domain. Azure AD sends the guest user an email with a link for authentication.

:::image type="content" source="./media/manage-tenants/guest-invitation-email.png" alt-text="Screenshot showing an example email invitation." lightbox="./media/manage-tenants/guest-invitation-email.png" :::

When a user is added to the Microsoft Customer Agreement tenant, they must [accept the invitation](../../active-directory/external-identities/b2b-quickstart-add-guest-users-portal.md#accept-the-invitation).

When they select the **Accept invitation** link, they're prompted to authenticate with Azure.

:::image type="content" source="./media/manage-tenants/authenticate.png" alt-text="Screenshot showing a prompt to authenticate with Azure." lightbox="./media/manage-tenants/authenticate.png" :::

Then they select **Accept**.

:::image type="content" source="./media/manage-tenants/accept-invitation.png" alt-text="Screenshot showing a prompt to accept the invitation." lightbox="./media/manage-tenants/accept-invitation.png" :::

After they accept, they can [view the Microsoft Customer Agreement billing account under Cost Management + Billing](../understand/mca-overview.md#check-access-to-a-microsoft-customer-agreement).

:::image type="content" source="./media/manage-tenants/billing-microsoft-customer-agreement-in-list.png" alt-text="Screenshot showing the Microsoft Customer Agreement in the list of billing accounts." lightbox="./media/manage-tenants/billing-microsoft-customer-agreement-in-list.png" :::

Authorization to invite guest users is controlled by your Azure AD settings. The value of the settings is shown under **Settings** on the **Organizational relationships** page. Ensure that the setting is selected, otherwise the invitation fails. For more information, see [Restrict guest user access permissions](../../active-directory/enterprise-users/users-restrict-guest-permissions.md).

:::image type="content" source="./media/manage-tenants/external-collaboration-settings.png" alt-text="Screenshot showing External collaboration settings." lightbox="./media/manage-tenants/external-collaboration-settings.png" :::

> [!IMPORTANT]
> Guest users get access to the Microsoft Customer Agreement tenant, which can potentially pose a security concern. For more information, see [Learn how to restrict guest users' default permissions](../../active-directory/fundamentals/users-default-permissions.md#restrict-member-users-default-permissions).

## Manage multiple Microsoft cloud services under an Azure AD tenant

You can manage multiple cloud services for your organization under a single Azure AD tenant. User accounts for all of Microsoft's cloud offerings are stored in the Azure AD tenant, which contains user accounts and groups. The following diagram shows an example of an organization with multiple services using a common Azure AD tenant containing accounts. Each service has its own portal, in blue text, where users manage their services.

:::image type="content" source="./media/manage-tenants/diagram-multiple-services-common-azure-ad-tenant-accounts.png" alt-text="Diagram showing an example of an organization with multiple services using a common Azure AD tenant containing accounts." border="false" lightbox="./media/manage-tenants/diagram-multiple-services-common-azure-ad-tenant-accounts.png":::

## Next steps

Read the following articles to learn how to administer flexible billing ownership and ensure secure access to your Microsoft Customer Agreement.

- [How to set up a tenant](../../active-directory/develop/quickstart-create-new-tenant.md)
- [Azure built-in roles](../../role-based-access-control/built-in-roles.md)
- [Transfer an Azure subscription to a different Azure AD directory](../../role-based-access-control/transfer-subscription.md)
- [Restrict guest access permissions (preview) in Azure Active Directory](../../active-directory/enterprise-users/users-restrict-guest-permissions.md)
- [Add guest users to your directory in the Azure portal](../../active-directory/external-identities/b2b-quickstart-add-guest-users-portal.md#accept-the-invitation)
- [What are the default user permissions in Azure Active Directory?](../../active-directory/external-identities/b2b-quickstart-add-guest-users-portal.md#accept-the-invitation)
- [What is Azure Active Directory?](../../active-directory/fundamentals/active-directory-whatis.md)
