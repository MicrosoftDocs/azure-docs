<properties
   pageTitle="Route traffic through Next Generation Firewall only in Azure Security Center | Microsoft Azure"
   description="This document shows you how to implement the Azure Security Center recommendation **Route traffic through NGFW only**."
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

# Route traffic through Next Generation Firewall only in Azure Security Center

Azure Security Center can detect when you have deployed a Next Generation Firewall (NGFW). If you have Internet-facing endpoints, Azure Security Center will recommend that you configure Network Security Group rules that force inbound traffic to your virtual machine (VM) through your NGFW.

> [AZURE.NOTE] This document introduces the service by using an example deployment. This is not a step-by-step guide.

## Implement the recommendation

1. In the **Recommendations blade**, select **Route traffic through NGFW only**.
![Route traffic through NGFW only][1]

2. This opens the blade **Route traffic through NGFW only** which lists VMs that you can route traffic. Select a VM from the list.
![Select a VM][2]

3. A blade for the selected VM opens, displaying related inbound rules. A description provides you with more information on possible next steps. Select **Edit inbound rules** to proceed with editing an inbound rule.
![Configure rules to limit access][3]
![Edit inbound rule][4]

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
[1]: ./media/security-center-route-traffic-through-ngfw/route-traffic-through-ngfw.png
[2]: ./media/security-center-route-traffic-through-ngfw/select-vm.png
[3]: ./media/security-center-route-traffic-through-ngfw/configure-rules-to-limit-access.png
[4]: ./media/security-center-route-traffic-through-ngfw/edit-inbound-rule.png
