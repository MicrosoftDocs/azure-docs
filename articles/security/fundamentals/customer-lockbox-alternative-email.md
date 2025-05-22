---
title: Customer Lockbox for Microsoft Azure alternate email feature
description: Customer Lockbox for Microsoft Azure alternate email feature
author: msmbaldwin
ms.service: information-protection
ms.topic: article
ms.author: mbaldwin
ms.date: 04/16/2025
---

# Customer Lockbox for Microsoft Azure alternate email notifications

> [!NOTE]
> To use this feature, your organization must have an [Azure support plan](https://azure.microsoft.com/support/plans/) with a minimal level of **Developer**.

Alternate email notification feature enables customers to use alternate email IDs for getting Customer Lockbox notifications. This feature lets Customer Lockbox for Microsoft Azure customers receive notifications when their Azure account isn't email enabled or when a service principal is defined as the tenant admin or subscription owner.

> [!IMPORTANT]
> This feature only enables Customer Lockbox notifications to be sent to alternate email IDs. It does not enable alternate users to act as approvers for Customer Lockbox requests.
>
> For example, Alice has the subscription owner role for subscription X, and she adds Bob's email address as an alternate email in her user profile. Bob has a reader role. When a Customer Lockbox request is created for a resource scoped to subscription 'X', Bob receives the email notification, but he can't approve or reject the Customer Lockbox request because he doesn't have the required privileges (subscription owner role).

## Prerequisites

To take advantage of the Customer Lockbox for Microsoft Azure alternate email feature, you must have:

- A Microsoft Entra ID tenant that has Customer Lockbox for Microsoft Azure enabled on it.
- A Developer or above Azure support plan.
- Role assignments:
    - A user account with the Tenant admin, privileged authentication administrator, or User administrator role to update user settings.
    - [Optional] Subscription owner or the new Azure Customer Lockbox Approver for Subscription role if you want to approve or reject Customer Lockbox requests.

## Set up customer Lockbox for Microsoft Azure alternate email feature

Here are the steps to set up the Customer Lockbox for Microsoft Azure alternate email feature.

1. Access the [Azure portal](https://portal.azure.com/).
1. Sign in with the user account with tenant/privileged authentication administrator/User administrator role privileges.
1. Search for Users at the home page:
    :::image type="content" source="./media/customer-lockbox-overview/customer-lockbox-alternative-email-home.png" lightbox="./media/customer-lockbox-overview/customer-lockbox-alternative-email-home.png" alt-text="A screenshot of the home screen.":::
1. Search for the user to add an alternate email address.
  
    > [!NOTE]
    > The user must have tenant admin/subscription owner/Azure Customer Lockbox Approver for Subscription role privileges to act on Lockbox requests.

    :::image type="content" source="./media/customer-lockbox-overview/customer-lockbox-alternative-email-user-search.png" lightbox="./media/customer-lockbox-overview/customer-lockbox-alternative-email-user-search.png" alt-text="A screenshot of the search for users interface.":::
1. Select the user, then select **Edit properties**.
    :::image type="content" source="./media/customer-lockbox-overview/customer-lockbox-alternative-email-edit-properties.png" lightbox="./media/customer-lockbox-overview/customer-lockbox-alternative-email-edit-properties.png" alt-text="A screenshot of the edit properties interface.":::
1. Navigate to Contact Information tab.
    :::image type="content" source="./media/customer-lockbox-overview/customer-lockbox-alternative-email-contact-information.png" lightbox="./media/customer-lockbox-overview/customer-lockbox-alternative-email-contact-information.png" alt-text="A screenshot of the Contact Information tab.":::
1. Select **Add email** under the 'Other emails' category, then select **Add**.
    :::image type="content" source="./media/customer-lockbox-overview/customer-lockbox-alternative-email-add-email.png" lightbox="./media/customer-lockbox-overview/customer-lockbox-alternative-email-add-email.png" alt-text="A screenshot of the Other emails add interface.":::
1. Enter the alternate email address in the text field, then select **Save**.
    :::image type="content" source="./media/customer-lockbox-overview/customer-lockbox-alternative-email-other-email.png" lightbox="./media/customer-lockbox-overview/customer-lockbox-alternative-email-other-email.png" alt-text="A screenshot of the alternative email input interface.":::
1. Select the "Save" button in the Contact Information tab to save the updates.
    :::image type="content" source="./media/customer-lockbox-overview/customer-lockbox-alternative-email-save.png" lightbox="./media/customer-lockbox-overview/customer-lockbox-alternative-email-save.png" alt-text="A screenshot of the Contact Information table, emphasizing the 'Save' interface.":::
1. The **Contact information** tab now shows the updated information with the alternate email:
    :::image type="content" source="./media/customer-lockbox-overview/customer-lockbox-alternative-email-contact-information-updated.png" lightbox="./media/customer-lockbox-overview/customer-lockbox-alternative-email-contact-information-updated.png" alt-text="A screenshot of the updated information.":::
1. If the primary 'Email' field has a value, emails are sent only to that address. To send Lockbox email notifications to 'Other emails', clear the primary 'Email' field.
    :::image type="content" source="./media/customer-lockbox-overview/customer-lockbox-alternative-email-contact-information-updated-no-primary.png" lightbox="./media/customer-lockbox-overview/customer-lockbox-alternative-email-contact-information-updated-no-primary.png" alt-text="A screenshot of the updated information with no primary mail.":::
1. When a Lockbox request is triggered and the user is identified as a Lockbox approver, the email notification is sent to the primary email if it has a value. If the primary email is empty, the notification is sent to other email addresses. These emails notify the approver that Microsoft Support is trying to access a resource in their tenant, and they need to sign in to the Azure portal to approve or reject the request. Here is an example screenshot:

    :::image type="content" source="./media/customer-lockbox-overview/customer-lockbox-alternative-email-notification.png" lightbox="./media/customer-lockbox-overview/customer-lockbox-alternative-email-notification.png" alt-text="A screenshot of the email notification.":::

## Known Issues

These are the known issues with this feature:

- Duplicate emails are sent if the value for the primary email and other email is the same.
- Notifications are sent to only the first email address in 'other emails' despite multiple email IDs configured in other email field.
- If the primary email is not set, and the other email is set, two emails are sent to the alternate email address.

## Next steps

- [Customer Lockbox for Microsoft Azure](customer-lockbox-overview.md)
- [Customer Lockbox for Microsoft Azure frequently asked questions](customer-lockbox-faq.yml)
