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
ms.date: 08/09/2019
ms.author: memildin

---
# Provide security contact details in Azure Security Center
Azure Security Center will recommend that you provide security contact details for your Azure subscription if you haven’t already. This information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your customer data has been accessed by an unlawful or unauthorized party. MSRC performs select security monitoring of the Azure network and infrastructure and receives threat intelligence and abuse complaints from third parties.

An email notification is sent on the first daily occurrence of an alert and only for high severity alerts. Email preferences can only be configured for subscription policies. Resource groups within a subscription will inherit these settings. Alerts are available only in the Standard tier of Azure Security Center.

Alert email notifications are sent:
- Only for high severity alerts
- To a single email recipient per alert type per day  
- No more than 3 email messages are sent to a single recipient in a single day
- Each email message contains a single alert, not an aggregation of alerts
 
For example, if an email message was already sent to alert you about an RDP attack, you will not receive another email message about an RDP attack on the same day, even if another alert is triggered. 

> [!NOTE]
> This document introduces the service by using an example deployment.  This is not a step-by-step guide.

## Set up email notifications for alerts <a name="email"></a>

1. From the portal, select **Pricing & settings**.
1. Click on the subscription.
1. Click **Email notifications**.

> [!NOTE]
> If you are implementing a recommendation, then Under **Recommendations**, select **Provide security contact details**, select the Azure subscription to provide contact information on. This opens **Email notifications**.

   ![Provide security contact details][2]

   * Enter the security contact email address or addresses separated by commas. There is not a limit to the number of email addresses that you can enter.
   * Enter one security contact international phone number.
   * To receive emails about high severity alerts, turn on the option **Send me emails about alerts**.
   * You have the option to send email notifications to subscription owners (classic Service Administrator and Co-Administrators, plus RBAC Owner role at the subscription scope).
   * Select **Save** to apply the security contact information to your subscription.

## See also
To learn more about Security Center, see the following:

* [Setting security policies in Azure Security Center](tutorial-security-policy.md) -- Learn how to configure security policies for your Azure subscriptions and resource groups.
* [Managing security recommendations in Azure Security Center](security-center-recommendations.md) -- Learn how recommendations help you protect your Azure resources.
* [Security health monitoring in Azure Security Center](security-center-monitoring.md) -- Learn how to monitor the health of your Azure resources.
* [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md) -- Learn how to manage and respond to security alerts.
* [Monitoring partner solutions with Azure Security Center](security-center-partner-solutions.md) -- Learn how to monitor the health status of your partner solutions.
* [Azure Security Center FAQ](security-center-faq.md) -- Find frequently asked questions about using the service.
* [Azure Security blog](https://blogs.msdn.com/b/azuresecurity/) -- Get the latest Azure security news and information.

<!--Image references-->
[1]: ./media/security-center-provide-security-contacts/provide-contacts.png
[2]:./media/security-center-provide-security-contacts/provide-contact-details.png
