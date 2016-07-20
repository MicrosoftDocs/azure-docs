<properties
   pageTitle="Provide security contact details in Azure Security Center | Microsoft Azure"
   description="This document shows you how to provide security contact details in Azure Security Center."
   services="security-center"
   documentationCenter="na"
   authors="TerryLanfear"
   manager="MBaldwin"
   editor=""/>

<tags
   ms.service="security-center"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="07/21/2016"
   ms.author="terrylan"/>

# Provide security contact details in Azure Security Center

Azure Security Center will recommend that you provide security contact details for your Azure subscription if you haven’t already. This information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your customer data has been accessed by an unlawful or unauthorized party. MSRC performs select security monitoring of the Azure network and infrastructure and receives threat intelligence and abuse complaints from third parties.

An email notification is sent on the first daily occurrence of an alert and only for high severity alerts. Email preferences can only be configured for subscription policies. Resource groups within a subscription will inherit these settings.

> [AZURE.NOTE] This document introduces the service by using an example deployment.  This is not a step-by-step guide.

## Implement the recommendation

1. In the **Recommendations** blade, select **Provide security contact details**.
![Provide security contact][1]

2. This opens the blade **Provide security contact details**. Select the Azure subscription to provide contact information on.
![Provide security contact details][2]

3. A second **Provide security contact details** blade opens. Enter the security contact email address or addresses separated by commas. There is not a limit to the number of email addresses that you can enter.  Enter one security contact international phone number.

To receive emails about high severity alerts, turn on the option **Send me emails about alerts**. In the future, you will have the option to send email notifications to subscription owners. This option is currently grayed out.

4. Select **OK** to apply the security contact information to your subscription.

## See also

To learn more about Security Center, see the following:

- [Setting security policies in Azure Security Center](security-center-policies.md) -- Learn how to configure security policies for your Azure subscriptions and resource groups.
- [Managing security recommendations in Azure Security Center](security-center-recommendations.md) -- Learn how recommendations help you protect your Azure resources.
- [Security health monitoring in Azure Security Center](security-center-monitoring.md) -- Learn how to monitor the health of your Azure resources.
- [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md) -- Learn how to manage and respond to security alerts.
- [Monitoring partner solutions with Azure Security Center](security-center-partner-solutions.md) -- Learn how to monitor the health status of your partner solutions.
- [Azure Security Center FAQ](security-center-faq.md) -- Find frequently asked questions about using the service.
- [Azure Security blog](http://blogs.msdn.com/b/azuresecurity/) -- Get the latest Azure security news and information.

<!--Image references-->
[1]: ./media/security-center-provide-security-contacts/provide-contacts.png
[2]:./media/security-center-provide-security-contacts/provide-contact-details.png
