---
title: Provide security contact details in Azure Security Center | Microsoft Docs
description: This document shows you how to provide security contact details in Azure Security Center.
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.assetid: 26b5dcb4-ce3f-4f22-8d56-d2bf743cfc90
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/01/2020
ms.author: memildin

---
# Provide security contact details in Azure Security Center

To ensure the right people in your organization are notified about security alerts in your environment, enter their email addresses in the **Email notifications** settings page.

When setting up your notifications, you can configure the emails to be sent to specific individuals or to anyone with a specific RBAC role for a subscription. You can also choose the severity levels for the alerts to be emailed.

By default, if no security contacts are defined, Azure Security Center sends notifications about high-severity alerts to the resource owner.  

To avoid alert fatigue, Security Center restricts the volume of outgoing mails. For each subscription, Security Center sends:

- **For high-severity alerts**, a maximum of **four** emails are sent per day
- **For medium-severity alerts**, a maximum of **two** emails are sent per day
- **For low-severity alerts**, a maximum of **one** emails are sent per day



## Availability

- Release state: **Generally Available**
- Required roles: **Security Admin** or **Subscription Owner** 
- Clouds: 
    - ✔ Commercial clouds
    - ✘ National/Sovereign (US Gov, Chinese Gov, Other Gov)




## Set up email notifications for alerts <a name="email"></a>

1. From Security Center's **Pricing & settings** area, select the relevant subscription, and select **Email notifications**.

1. Enter the security contact email address or addresses separated by commas. 
There is no limit to the number of email addresses that you can enter.

1. To receive emails about high severity alerts, turn on the option **Send me emails about alerts**. For other severity levels use a Logic App as explained in [workflow automation](workflow-automation.md).

1. You can send email notifications to subscription owners (classic Service Administrator and Co-Administrators, plus RBAC Owner role at the subscription scope).

1. To apply the security contact information to your subscription, select **Save**.




## See also
To learn more about Security Center, see the following:

* [Setting security policies in Azure Security Center](tutorial-security-policy.md) -- Learn how to configure security policies for your Azure subscriptions and resource groups.
* [Managing security recommendations in Azure Security Center](security-center-recommendations.md) -- Learn how recommendations help you protect your Azure resources.
* [Security health monitoring in Azure Security Center](security-center-monitoring.md) -- Learn how to monitor the health of your Azure resources.
* [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md) -- Learn how to manage and respond to security alerts.
