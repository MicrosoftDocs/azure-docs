---
title: Customer Lockbox for Microsoft Azure alternate email notifications
description: Learn how Customer Lockbox for Microsoft Azure alternate email notifications help approvers receive notifications for access requests.
author: msmbaldwin
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.author: mbaldwin
ms.date: 07/21/2026
ai-usage: ai-assisted
ms.custom:
  - build-2025
---

# Customer Lockbox for Microsoft Azure alternate email notifications

> [!NOTE]
> To use this feature, your organization must have an [Azure support plan](https://azure.microsoft.com/support/plans) with a minimum level of **Developer**.

The alternate email notification feature allows you to use alternate email addresses to receive Customer Lockbox notifications. This feature helps your organization receive Customer Lockbox for Microsoft Azure notifications when an Azure account isn't email-enabled or when a service principal is defined as the tenant admin or subscription owner.

> [!IMPORTANT]
> This feature sends Customer Lockbox notifications only to alternate email IDs. It doesn't allow alternate users to act as approvers for Customer Lockbox requests.
>
> For example, Alice has the subscription owner role for subscription X, and she adds Bob's email address as an alternate email in her user profile. Bob has a reader role. When a Customer Lockbox request is created for a resource scoped to subscription `X`, Bob receives the email notification, but he can't approve or reject the Customer Lockbox request because he doesn't have the required privileges (subscription owner role).

## Prerequisites

To use the Customer Lockbox for Microsoft Azure alternate email feature, you must have:

- A Microsoft Entra ID tenant that has Customer Lockbox for Microsoft Azure enabled.
- A Developer or higher Azure support plan.
- Role assignments:
    - A user account with the Global Administrator, Privileged Authentication Administrator, or User Administrator role to update user settings.
    - Optional: Owner or Azure Customer Lockbox Approver for Subscription role if you want to approve or reject Customer Lockbox requests.

## Set up Customer Lockbox for Microsoft Azure alternate email notifications

To set up the Customer Lockbox for Microsoft Azure alternate email feature, follow these steps.

1. Go to the [Azure portal](https://portal.azure.com/).
1. Sign in with a user account that has Global Administrator, Privileged Authentication Administrator, or User Administrator role privileges.
1. Search for **Users** on the home page:
    :::image type="content" source="./media/customer-lockbox-overview/customer-lockbox-alternative-email-home.png" lightbox="./media/customer-lockbox-overview/customer-lockbox-alternative-email-home.png" alt-text="Screenshot of the Azure portal home page with Users selected in the search results.":::
1. Search for the user to add an alternate email address.

    > [!NOTE]
    > The user must have Global Administrator, Owner, or Azure Customer Lockbox Approver for Subscription role privileges to act on Lockbox requests.

    :::image type="content" source="./media/customer-lockbox-overview/customer-lockbox-alternative-email-user-search.png" lightbox="./media/customer-lockbox-overview/customer-lockbox-alternative-email-user-search.png" alt-text="Screenshot of the Azure portal Users page showing the user search field.":::
1. Select the user, then select **Edit properties**.
    :::image type="content" source="./media/customer-lockbox-overview/customer-lockbox-alternative-email-edit-properties.png" lightbox="./media/customer-lockbox-overview/customer-lockbox-alternative-email-edit-properties.png" alt-text="Screenshot of the Azure portal user profile page with Edit properties selected.":::
1. Go to the **Contact information** tab.
    :::image type="content" source="./media/customer-lockbox-overview/customer-lockbox-alternative-email-contact-information.png" lightbox="./media/customer-lockbox-overview/customer-lockbox-alternative-email-contact-information.png" alt-text="Screenshot of the Azure portal Edit properties pane showing the Contact information tab.":::
1. Select **Add email** under **Other emails**, then select **Add**.
    :::image type="content" source="./media/customer-lockbox-overview/customer-lockbox-alternative-email-add-email.png" lightbox="./media/customer-lockbox-overview/customer-lockbox-alternative-email-add-email.png" alt-text="Screenshot of the Azure portal Contact information tab showing Add email under Other emails.":::
1. Enter the alternate email address in the text field, then select **Save**.
    :::image type="content" source="./media/customer-lockbox-overview/customer-lockbox-alternative-email-other-email.png" lightbox="./media/customer-lockbox-overview/customer-lockbox-alternative-email-other-email.png" alt-text="Screenshot of the Azure portal Contact information tab showing the alternate email address field.":::
1. Select **Save** on the **Contact information** tab.
    :::image type="content" source="./media/customer-lockbox-overview/customer-lockbox-alternative-email-save.png" lightbox="./media/customer-lockbox-overview/customer-lockbox-alternative-email-save.png" alt-text="Screenshot of the Azure portal Contact information tab with the Save button selected.":::
1. The **Contact information** tab shows the updated information with the alternate email:
    :::image type="content" source="./media/customer-lockbox-overview/customer-lockbox-alternative-email-contact-information-updated.png" lightbox="./media/customer-lockbox-overview/customer-lockbox-alternative-email-contact-information-updated.png" alt-text="Screenshot of the Azure portal Contact information tab showing the added alternate email address.":::
1. If the primary **Email** field has a value, emails are sent only to that address. To send Lockbox email notifications to **Other emails**, clear the primary **Email** field.
    :::image type="content" source="./media/customer-lockbox-overview/customer-lockbox-alternative-email-contact-information-updated-no-primary.png" lightbox="./media/customer-lockbox-overview/customer-lockbox-alternative-email-contact-information-updated-no-primary.png" alt-text="Screenshot of the Azure portal Contact information tab showing an alternate email address and no primary email address.":::
1. When a Lockbox request is triggered and the user is identified as a Lockbox approver, the email notification is sent to the primary email if it has a value. If the primary email is empty, the notification is sent to other email addresses. These notifications tell the approver that Microsoft Support is trying to access a resource in their tenant, and the approver needs to sign in to the Azure portal to approve or reject the request. The following screenshot shows an example:

    :::image type="content" source="./media/customer-lockbox-overview/customer-lockbox-alternative-email-notification.png" lightbox="./media/customer-lockbox-overview/customer-lockbox-alternative-email-notification.png" alt-text="Screenshot of a Customer Lockbox email notification for a pending Microsoft support access request.":::

## Known limitations

These limitations apply to this feature:

- The system sends duplicate emails if the primary email and other email values are the same.
- The system sends notifications to only the first email address in **Other emails** even if you configure multiple email addresses in the **Other emails** field.
- If you set the other email but don't set the primary email, the system sends two emails to the alternate email address.

## Next steps

- [Customer Lockbox for Microsoft Azure](customer-lockbox-overview.md)
- [Customer Lockbox for Microsoft Azure frequently asked questions](customer-lockbox-faq.yml)
