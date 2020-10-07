---
title: Set up email notifications for Azure Security Center alerts
description: Learn how to fine-tune the types of emails sent out by Azure Security Center for security alerts. 
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.assetid: 26b5dcb4-ce3f-4f22-8d56-d2bf743cfc90
ms.service: security-center
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/07/2020
ms.author: memildin

---
# Set up email notifications for security alerts 

To ensure the right people in your organization are notified about security alerts in your environment, Azure Security Center lets you define *who* should be notified, and what *alerts* they should receive.

By default, Security Center emails subscription owners about any high-severity alerts on their subscription. To change this behavior, add other recipients, or modify the severity levels for which Security Center should send out notifications, use the **Email notifications** settings page.

When setting up your notifications, you can configure the emails to be sent to specific individuals or to anyone with a specific Azure role for a subscription. 

To avoid alert fatigue, Security Center limits the volume of outgoing mails. For each subscription, Security Center sends:

- a maximum of **four** emails per day for **high-severity** alerts
- a maximum of **two** emails per day for **medium-severity** alerts
- a maximum of **one** email per day for **low-severity** alerts


:::image type="content" source="./media/security-center-provide-security-contacts/email-notification-settings.png" alt-text="Configuring the details of the contact who will receive emails about security alerts." :::
 
## Availability

|Aspect|Details|
|----|:----|
|Release state:|Generally available (GA)|
|Pricing:|Free|
|Required roles and permissions:|**Security Admin**<br>**Subscription Owner** |
|Clouds:|![Yes](./media/icons/yes-icon.png) Commercial clouds<br>![Yes](./media/icons/yes-icon.png) National/Sovereign (US Gov, China Gov, Other Gov)|
|||


## Set up email notifications for alerts <a name="email"></a>

You can send email notifications to individuals or to all users with specific Azure roles.

1. From Security Center's **Pricing & settings** area, select the relevant subscription, and select **Email notifications**.

1. Define the recipients for your notifications with one or both of these options:

    - From the dropdown list, select from the available roles.
    - Enter specific email addresses separated by commas. There is no limit to the number of email addresses that you can enter.

1. To apply the security contact information to your subscription, select **Save**.


## See also
To learn more about security alerts, see the following:

- [Security alerts - a reference guide](alerts-reference.md) -- Learn about the security alerts you might see in Azure Security Center's Threat Protection module
- [Manage and respond to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md) -- Learn how to manage and respond to security alerts
- [Workflow automation](workflow-automation.md) -- Automate responses to alerts with custom notification logic