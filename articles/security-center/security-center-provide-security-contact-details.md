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

OPENER SHOULD COVER THE FOLLOWING:

    the customer can configure security contact in order to get notifications from Azure Security center on new security alerts in his environments – and that by default (if no security contact defined) we will send notifications on high severity alerts to the resource owner 
    email notifications could be send to specific email addresses or to users with specific RBAC roles on the subscription, and the user can choose to get notifications only on alerts from specific severities



To avoid alert fatigue, Security Center restricts the volume of outgoing mails. For each subscription, Security Center sends:

- **For high-severity alerts**, a maximum of **four** emails are sent per day
- **For medium-severity alerts**, a maximum of **two** emails are sent per day
- **For low-severity alerts**, a maximum of **one** emails are sent per day



> [!IMPORTANT]
> This document introduces the service by using an example deployment.  This is not a step-by-step guide.

## Set up email notifications for alerts <a name="email"></a>

1. As a user with the role Security Admin or Subscription Owner, open the **Email notifications** page:

    - For alerts, open **Pricing & settings**, select the relevant subscription, and select **Email notifications**.

    - If you are implementing a recommendation, then Under **Recommendations**, select **Provide security contact details**, select the Azure subscription to provide contact information on. This opens **Email notifications**.

   ![Provide security contact details][2]

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
* [Monitoring partner solutions with Azure Security Center](security-center-partner-solutions.md) -- Learn how to monitor the health status of your partner solutions.

<!--Image references-->
[1]: ./media/security-center-provide-security-contacts/provide-contacts.png
[2]:./media/security-center-provide-security-contacts/provide-contact-details.png
