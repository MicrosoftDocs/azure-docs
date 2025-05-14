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

The alternate email notification feature lets customers use alternate email IDs to receive Customer Lockbox notifications. This feature lets Customer Lockbox for Microsoft Azure customers receive notifications when their Azure account isn't email enabled or when a service principal is defined as the tenant admin or subscription owner.

> [!IMPORTANT]
> This feature only lets Customer Lockbox notifications be sent to alternate email IDs. It doesn't let alternate users act as approvers for Customer Lockbox requests.
>
> For example, Alice has the subscription owner role for subscription X, and she adds Bob's email address as an alternate email in her user profile. Bob has a reader role. When a Customer Lockbox request is created for a resource scoped to subscription 'X', Bob receives the email notification, but he can't approve or reject the Customer Lockbox request because he doesn't have the required privileges (subscription owner role).

## Prerequisites

To use the Customer Lockbox for Microsoft Azure alternate email feature, you need:

- A Microsoft Entra ID tenant with Customer Lockbox for Microsoft Azure enabled.
- A Developer or higher Azure support plan.
- Role assignments:
    - A user account with the tenant admin, privileged authentication administrator, or user administrator role to update user settings.
    - [Optional] Subscription owner or the Azure Customer Lockbox Approver for Subscription role to approve or reject Customer Lockbox requests.

## Set up

Here are the steps to set up the Customer Lockbox for Microsoft Azure alternate email feature.

1. Access the [Azure portal](https://portal.azure.com/).
1. Sign in with a user account that has tenant, privileged authentication administrator, or User administrator role privileges.
1. Search for **Users** on the home page.
1. Search for the user for whom you want to add alternate email address.
  
    > [!NOTE]
    > The user must have tenant admin/subscription owner/Azure Customer Lockbox Approver for Subscription role privileges to act on Lockbox requests.

    :::image type="content" source="./media/customer-lockbox-overview/customer-lockbox-alternative-email-user-search.png" lightbox="./media/customer-lockbox-overview/customer-lockbox-alternative-email-user-search.png" alt-text="A screenshot of the search for users interface.":::
1. Select the user, and then select **Edit properties**.
1. Go to the **Contact information** tab.
1. Select **Add email** under the 'Other emails' category, and then select **Add**.
1. Enter the alternate email address in the text field, and then select **Save**.
1. Select **Save** in the **Contact information** tab to save the updates.
1. The **Contact information** tab for this user now shows the updated information with the alternate email:
1. If a value is set in the primary 'Email' field, mail is sent only to that address.
1. When a Lockbox request is triggered, and the user is identified as a Lockbox approver, the Lockbox email notification is sent to the primary email if a value is set. If no primary email value is set, the notification is sent to other email addresses.

    :::image type="content" source="./media/customer-lockbox-overview/customer-lockbox-alternative-email-notification.png" lightbox="./media/customer-lockbox-overview/customer-lockbox-alternative-email-notification.png" alt-text="A screenshot of the email notification.":::

## Known Issues

The following are the known issues with this feature:

- Duplicate emails are sent if the value for the primary email and the other email is the same.
- Notifications are sent only to the first email address in 'other emails', even if multiple email IDs are configured in the other email field.
- If the primary email isn't set and the other email is set, two emails are sent to the alternate email address.

## Next steps

- [Customer Lockbox for Microsoft Azure](customer-lockbox-overview.md)
- [Customer Lockbox for Microsoft Azure frequently asked questions](customer-lockbox-faq.yml)
