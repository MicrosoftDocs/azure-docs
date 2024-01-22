---
title: EA billing administration for partners in the Azure portal
description: This article explains the common tasks that a partner administrator accomplishes in the Azure portal to manage indirect enterprise agreements.
author: bandersmsft
ms.author: banders
ms.date: 04/26/2023
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: enterprise
ms.reviewer: sapnakeshari
---

# EA billing administration for partners in the Azure portal

This article explains the common tasks that a partner administrator accomplishes in the Azure portal https://portal.azure.com to manage indirect EAs. An indirect EA is one where a customer signs an agreement with a Microsoft partner. The partner administrator manages their indirect EAs on behalf of their customers.

You can watch the [EA Billing administration in the Azure portal for Partners](https://www.youtube.com/playlist?list=PLeZrVF6SXmso87z4YJ5KKrCCYMuiK47d0) series of videos on YouTube.

## Access the Azure portal

The partner organization is referred to as the **billing account** in the Azure portal. Partner administrators can sign in to the Azure portal to view and manage their partner organization. The partner organization contains their customer's enrollments. However, the partner doesn't have an enrollment of their own. A customer's enrollment is shown in the Azure portal as a **billing profile**.

A partner administrator user can have access to multiple partner organizations (billing account scopes). All the information and activity in the Azure portal are in the context of a billing account _scope_. It's important that the partner administrator first selects a billing scope and then does administrative tasks in the context of the selected scope.

### Select a billing scope

1. Sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade/AllBillingScopes).
1. Search for **Cost Management + Billing** and select it.  
    :::image type="content" source="./media/ea-billing-administration-partners/search-cost-management-billing.png" alt-text="Screenshot showing search for Cost Management + Billing." lightbox="./media/ea-billing-administration-partners/search-cost-management-billing.png" :::
1. In the left navigation menu, select **Billing scopes** and then select the billing account that you want to work with.  
    :::image type="content" source="./media/ea-billing-administration-partners/billing-scopes.png" alt-text="Screenshot showing select a billing scope." lightbox="./media/ea-billing-administration-partners/billing-scopes.png" :::

## Manage a partner organization

Partner administrator users can view and manage the partner organization. After a partner administrator selects a partner organization billing scope from Cost management + Billing, they see the Partner management overview page where they can view the following information:

- Partner organization details such as name, ID, and authentication setting
- List of active and extended enrollments and the option to download details
- List of enrollments expiring in the next 180 days, so that partner admin can act to renew
- List of enrollments with other status

The partner administrator uses the left navigation menu items to perform the following tasks:

- **Access control (IAM)** – To add, edit, and delete partner administrator users.
- **Billing profiles** – To view a list of enrollments.
- **Billing scopes** – To view a list of all billing scopes that they have access to.
- **New support request** – To create new support request.

## Manage partner administrators

Every partner administrator in the Azure portal can add or remove other partner administrators. Partner administrators are associated with partner organizations billing account. They aren't associated _directly_ with the enrollments.

Partners can view all the details of the billing account and billing profiles for indirect enrollments. The partner administrator can perform the following write operations.

- Update the billing account authentication type
- Add, edit, and delete another partner administrator user
- Set the markup of the billing profile for indirect enrollments
- Update the PO number of the billing profile for indirect enrollments
- Generate API the key of billing profile for indirect enrollments

A partner administrator with read-only access can view all billing account and billing profiles details. However, they can't perform any write operations.

### Add a partner administrator

You can add a new partner administrator with the following steps:

1. In the Azure portal, sign in as a partner administrator.
1. Search for **Cost Management + Billing** and select it.
1. In the left navigation menu, select **Billing scopes** and then select the billing account that you want to work with.
1. In the left navigation menu, select **Access control (IAM)**.  
    :::image type="content" source="./media/ea-billing-administration-partners/access-control.png" alt-text="Screenshot showing select Access Control (IAM)." lightbox="./media/ea-billing-administration-partners/access-control.png" :::
1. At the top of the page, select **Add Partner Admin**.  
    :::image type="content" source="./media/ea-billing-administration-partners/add-partner-admin.png" alt-text="Screenshot showing select Add Partner Admin." lightbox="./media/ea-billing-administration-partners/add-partner-admin.png" :::
1. In the Add Role Assignment window, enter the email address of the user to whom you want to give access.
1. Select the authentication type.
1. Select **Provide read-only access** if you want to provide read-only (reader) access.
1. Enter a notification contact if you want to inform someone about the role assignment.
1. Select the notification frequency.
1. Select **Add**.  
    :::image type="content" source="./media/ea-billing-administration-partners/add-role-assignment.png" alt-text="Screenshot showing Add role assignment window." lightbox="./media/ea-billing-administration-partners/add-role-assignment.png" :::

### Edit a partner administrator

You can edit a partner administrator user role using the following steps.

1. In the Azure portal, sign in as a partner administrator.
1. Search for **Cost Management + Billing** and select it.
1. In the left navigation menu, select **Billing scopes** and then select the billing account that you want to work with.
1. In the left navigation menu, select **Access control (IAM)**.
1. In the list of administrators, in the row for the user that you want to edit, select the ellipsis (**…**) symbol, and then select **Edit**.  
    :::image type="content" source="./media/ea-billing-administration-partners/edit-role-assignment.png" alt-text="Screenshot showing Edit partner admin." lightbox="./media/ea-billing-administration-partners/edit-role-assignment.png" :::
1. In the Edit role assignment window, select **Provide read-only access**.
1. Select the **Notification frequency** option and choose the frequency.
1. **Apply** the changes.

### Remove a partner administrator

To revoke access of a partner administrator/reader, you delete the user from the billing account. After access is revoked, the user can't view or manage the billing account.

1. In the Azure portal, sign in as a partner administrator.
1. Search for **Cost Management + Billing** and select it.
1. In the left navigation menu, select **Billing scopes** and then select the billing account that you want to work with.
1. In the left navigation menu, select **Access control (IAM)**.
1. In the list of administrators, in the row for the user that you want to delete, select the ellipsis (**…**) symbol, and then select **Delete**.
1. In the Delete role assignment window, select **Yes, I want to delete this partner administrator** to confirm that you want to delete the partner administrator.
1. At the bottom of the window, select **Delete**.

## Manage partner notifications

Partner administrators can manage the frequency that they receive usage notifications for their enrollments. They automatically receive weekly notifications of their unbilled balance. They can change the notification frequency to daily, weekly, monthly, or disable them completely.

If a user doesn't receive a notification, verify that the user's notification settings are correct with the following steps.

1. In the Azure portal, sign in as a partner administrator.
1. Search for **Cost Management + Billing** and select it.
1. In the left navigation menu, select **Billing scopes** and then select the billing account that you want to work with.
1. In the left navigation menu, select **Access control (IAM)**.
1. In the list of administrators, in the row for the user that you want to edit, select the ellipsis (**…**) symbol, and then select **Edit**.
1. In the Edit role assignment window, in the **Notification frequency** list, select a frequency.
1. **Apply** the changes.

## View and manage enrollments

Partner administrators can view a list of their customer enrollments (billing profiles) in the Azure portal. Each customer's EA enrollment is represented as a billing profile to the partner.

### View the enrollment list

1. In the Azure portal, sign in as a partner administrator.
1. Search for **Cost Management + Billing** and select it.
1. In the left navigation menu, select **Billing scopes** and then select the billing account that you want to work with.
1. In the left navigation menu, select **Billing profiles**.  
    :::image type="content" source="./media/ea-billing-administration-partners/billing-profiles.png" alt-text="Screenshot showing the Billing profiles enrollment list." lightbox="./media/ea-billing-administration-partners/billing-profiles.png" :::

By default, all active enrollments are shown. You can change the status filter to view the entire list of enrollments associated with the partner organization. Then you can select an enrollment to manage.

## Next steps

- To view usage and charges for a specific enrollment, see the [View your usage summary details and download reports for EA enrollments](direct-ea-azure-usage-charges-invoices.md) article.