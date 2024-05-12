---
title: Configure email notifications for alerts
description: Learn how to fine-tune the Microsoft Defender for Cloud security alert emails to ensure the right people receive timely notifications.
ms.topic: quickstart
ms.author: dacurwin
author: dcurwin
ms.date: 05/12/2024
ms.custom: mode-other
#customer intent: As a user, I want to learn how to customize email notifications for security alerts in Microsoft Defender for Cloud.
---

# Configure email notifications for security alerts

In this quickstart you will learn how to configure security alert emails in Microsoft Defender for Cloud to ensure that security alerts reach the right people in your organization. By default, Microsoft Defender for Cloud emails subscription owners whenever a high-severity alert is triggered for their subscription. This page explains how to customize these notifications.

Defender for Cloud's **Email notifications** settings page allows you to define preferences for notification emails including:

- ***who* should be notified** - Emails can be sent to select individuals or to anyone with a specified Azure role for a subscription.
- ***what* they should be notified about** - Modify the severity levels for which Defender for Cloud should send out notifications.

To avoid alert fatigue, Defender for Cloud limits the volume of outgoing emails. For each email address, Defender for Cloud sends:

- approximately **four emails per day** for **high-severity** alerts
- approximately **two emails per day** for **medium-severity** alerts
- approximately **one email per day** for **low-severity** alerts

:::image type="content" source="./media/configure-email-notifications/email-notification-settings.png" alt-text="Configuring the details of the contact who is to receive emails about security alerts." lightbox="media/configure-email-notifications/email-notification-settings.png":::

## Availability

Required roles and permissions: Security Admin, Subscription Owner or Contributor.

## Customize the security alerts email notifications via the portal<a name="email"></a>

You can send email notifications to individuals or to all users with specific Azure roles.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**.

1. Select the relevant subscription.

1. Select **email notifications**.

1. Define the recipients for your notifications with one or both of these options:

    - From the dropdown list, select from the available roles.
    - Enter specific email addresses separated by commas. There's no limit to the number of email addresses that you can enter.

1. Select the notification types:

    - **Notify about alerts with the following severity (or higher)** and select a severity level.
    - **Notify about attack paths with the following risk level (or higher)** and select a risk level.

1. Select **Save**.

## Customize the alerts email notifications through the API

You can also manage your email notifications through the supplied REST API. For full details, see the [SecurityContacts API documentation](/rest/api/defenderforcloud/security-contacts).

This is an example request body for the PUT request when creating a security contact configuration:

URI: `https://management.azure.com/subscriptions/<SubscriptionId>/providers/Microsoft.Security/securityContacts/default?api-version=2020-01-01-preview`

```json
{
    "properties": {
        "emails": "admin@contoso.com;admin2@contoso.com",
        "notificationsByRole": {
            "state": "On",
            "roles": ["AccountAdmin", "Owner"]
        },
        "alertNotifications": {
            "state": "On",
            "minimalSeverity": "Medium"
        },
        "phone": ""
    }
}
```

## Next steps

To learn more about security alerts, see the following pages:

- [Security alerts - a reference guide](alerts-reference.md) - Learn about the security alerts you might see in Microsoft Defender for Cloud's Threat Protection module.
- [Manage and respond to security alerts in Microsoft Defender for Cloud](managing-and-responding-alerts.yml) - Learn how to manage and respond to security alerts.
- [Workflow automation](workflow-automation.yml) - Automate responses to alerts with custom notification logic.
