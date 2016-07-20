<properties
   pageTitle="Resolve endpoint protection health alerts in Azure Security Center| Microsoft Azure"
   description="This document shows you how to implement the Azure Security Center recommendation **Resolve Endpoint Protection health alerts**."
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
   ms.date="07/20/2016"
   ms.author="terrylan"/>

# Resolve endpoint protection health alerts in Azure Security Center

Azure Security Center will recommend that you resolve detected endpoint protection health alerts.  Security Center enables you to see which virtual machines (VMs) have endpoint protection failures and how many failures.

> [AZURE.NOTE] This document introduces the service by using an example deployment. This is not a step-by-step guide.

## Implement the recommendation

1. In the **Recommendations blade**, select **Resolve Endpoint Protection health alerts**.
![Resolve endpoint protection health alerts][1]

2. This opens the blade **Endpoint Protection failure** which lists VMs with failures and the number of failures for each VM. Select a VM from the list.
![Endpoint protection failure][2]

3. A **Failures List** blade opens for the selected VM, displaying a list of failures. Select a failure from the list to learn more. This opens a blade with information about the selected failure.
![Failures list][3]

  ![Failure event][4]

## See also

To learn more about Security Center, see the following:

- [Setting security policies in Azure Security Center](security-center-policies.md)--Learn how to configure security policies for your Azure subscriptions and resource groups.
- [Managing security recommendations in Azure Security Center](security-center-recommendations.md)--Learn how recommendations help you protect your Azure resources.
- [Security health monitoring in Azure Security Center](security-center-monitoring.md)--Learn how to monitor the health of your Azure resources.
- [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md)--Learn how to manage and respond to security alerts.
- [Monitoring partner solutions with Azure Security Center](security-center-partner-solutions.md) -- Learn how to monitor the health status of your partner solutions.
- [Azure Security Center FAQ](security-center-faq.md)--Find frequently asked questions about using the service.
- [Azure Security blog](http://blogs.msdn.com/b/azuresecurity/)--Get the latest Azure security news and information.

<!--Image references-->
[1]: ./media/security-center-resolve-endpoint-protection/resolve-endpoint-protection.png
[2]: ./media/security-center-resolve-endpoint-protection/endpoint-protection-failure.png
[3]: ./media/security-center-resolve-endpoint-protection/failure-list.png
[4]: ./media/security-center-resolve-endpoint-protection/failure-event.png
