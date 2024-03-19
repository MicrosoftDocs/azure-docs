---
title: Customer Lockbox for Microsoft Azure alternate email feature
description: Customer Lockbox for Microsoft Azure alternate email feature
author: msmbaldwin
ms.service: information-protection
ms.topic: article
ms.author: mbaldwin
ms.date: 03/15/2024
---

# Customer Lockbox for Microsoft Azure alternate email notifications (public preview)

> [!NOTE]
> To use this feature, your organization must have an [Azure support plan](https://azure.microsoft.com/support/plans/) with a minimal level of **Developer**.

Customer Lockbox for Microsoft Azure is launching a new feature that enables customers to use alternate email IDs for getting Customer Lockbox notifications. This enables Customer Lockbox for Microsoft Azure customers to receive notifications in scenarios where their Azure account is not email enabled or if they have a service principal defined as the tenant admin or subscription owner.

> [!IMPORTANT]
> This feature only enables Customer Lockbox notifications to be sent to alternate email IDs. It does not enable alternate users to act as approvers for Customer Lockbox requests.
>
> For example, Alice has the subscription owner role for subscription X and she adds Bob's email address as alternate email/other email in her user profile who has a reader role. When a Customer Lockbox request is created for a resource scoped to subscription 'X', Bob will receive the email notification, but he'll not be able to approve/reject the Customer Lockbox request as he does not have the required privileges for it (subscription owner role).

## Prerequisites

To take advantage of the Customer Lockbox for Microsoft Azure alternate email feature, you must have:

- A Microsoft Entra ID tenant that has Customer Lockbox for Microsoft Azure enabled on it.
- A Developer or above Azure support plan.
- Role Assignments:
    - A user account with Tenant admin/privileged authentication administrator/User administrator role to update user settings.
    - [Optional] Subscription owner or the new Azure Customer Lockbox Approver for Subscription role if you’d like to approve/reject Customer Lockbox requests.

## Set up

Here are the steps to set up the Customer Lockbox for Microsoft Azure alternate email feature.

1. Access the [Azure portal](https://portal.azure.com/).
1. Sign in with the user account with tenant/privileged authentication administrator/User administrator role privileges.
1. Search for Users at the home page:
    :::image type="content" source="./media/customer-lockbox-overview/customer-lockbox-alternative-email-home.png" lightbox="./media/customer-lockbox-overview/customer-lockbox-alternative-email-home.png" alt-text="A screenshot of the home screen.":::
1. Search for the user for whom you want to add alternate email address.
  
    > [!NOTE]
    > The user must have tenant admin/subscription owner/Azure Customer Lockbox Approver for Subscription role privileges to act on Lockbox requests.

    :::image type="content" source="./media/customer-lockbox-overview/customer-lockbox-alternative-email-user-search.png" lightbox="./media/customer-lockbox-overview/customer-lockbox-alternative-email-user-search.png" alt-text="A screenshot of the search for users interface.":::
1. Select the user and select on edit properties.
    :::image type="content" source="./media/customer-lockbox-overview/customer-lockbox-alternative-email-edit-properties.png" lightbox="./media/customer-lockbox-overview/customer-lockbox-alternative-email-edit-properties.png" alt-text="A screenshot of the edit properties interface.":::
1. Navigate to Contact Information tab.
    :::image type="content" source="./media/customer-lockbox-overview/customer-lockbox-alternative-email-contact-information.png" lightbox="./media/customer-lockbox-overview/customer-lockbox-alternative-email-contact-information.png" alt-text="A screenshot of the Contact Information tab.":::
1. Select Add email under 'Other emails' category and then select Add.
    :::image type="content" source="./media/customer-lockbox-overview/customer-lockbox-alternative-email-add-email.png" lightbox="./media/customer-lockbox-overview/customer-lockbox-alternative-email-add-email.png" alt-text="A screenshot of the Other emails add interface.":::
1. Add alternate email address in the text field and select save.
    :::image type="content" source="./media/customer-lockbox-overview/customer-lockbox-alternative-email-other-email.png" lightbox="./media/customer-lockbox-overview/customer-lockbox-alternative-email-other-email.png" alt-text="A screenshot of the alternative email input interface.":::
1. Select the save button in the Contact Information tab to save the updates.
    :::image type="content" source="./media/customer-lockbox-overview/customer-lockbox-alternative-email-save.png" lightbox="./media/customer-lockbox-overview/customer-lockbox-alternative-email-save.png" alt-text="A screenshot of the Contact Information table, emphasizing the save interface.":::
1. The contact information tab for this user should now show updated information with alternate email:
    :::image type="content" source="./media/customer-lockbox-overview/customer-lockbox-alternative-email-contact-information-updated.png" lightbox="./media/customer-lockbox-overview/customer-lockbox-alternative-email-contact-information-updated.png" alt-text="A screenshot of the updated information.":::
1. Anytime a lockbox request is triggered and if the above user is identified as a Lockbox approver, the Lockbox email notification is sent to both primary and other email addresses, notifying that the Microsoft Support is trying to access a resource within their tenant, and they should take an action by logging into Azure portal to approve/reject the request. Here is an example screenshot:
    :::image type="content" source="./media/customer-lockbox-overview/customer-lockbox-alternative-email-notification.png" lightbox="./media/customer-lockbox-overview/customer-lockbox-alternative-email-notification.png" alt-text="A screenshot of the email notification.":::

## Known Issues

Here are the known issues with this feature:

- Duplicate emails are sent if the value for primary and other email is same.
- Notifications are sent to only the first email address in 'other emails' despite multiple email IDs configured in other email field.
- If the primary email is not set, and the other email is set, two emails are sent to the alternate email address.

## Next steps

- [Customer Lockbox for Microsoft Azure](customer-lockbox-overview.md)
- [Customer Lockbox for Microsoft Azure frequently asked questions](customer-lockbox-faq.yml)