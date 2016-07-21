<properties
   pageTitle="Add a next generation firewall in Azure Security Center | Microsoft Azure"
   description="This document shows you how to implement the Azure Security Center recommendation **Add a Next Generation Firewall**."
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

# Add a Next Generation Firewall in Azure Security Center

Azure Security Center may recommend that you add a next generation firewall (NGFW) from a Microsoft partner in order to increase your security protections. This document walks you through an example of how to do this.

> [AZURE.NOTE] This document introduces the service by using an example deployment.  This is not a step-by-step guide.

## Implement the recommendation

1. In the **Recommendations** blade, select **Add a Next Generation Firewall**.
![Add a Next Generation Firewall][1]

2. In the **Add a Next Generation Firewall** blade, select an endpoint.
![Select an endpoint][2]

3. A second **Add a Next Generation Firewall** blade opens. You can choose to use an existing solution if available or you can create a new one. In this example there are no existing solutions available so we'll create a new NGFW.
![Create new Next Generation Firewall][3]

4. To create a new NGFW, select a solution from the list of integrated partners. In this example we will select **Check Point**.
![Select Next Generation Firewall solution][4]

5. The **Check Point** blade opens providing you information about the partner solution. Select **Create** in the information blade.
![Firewall information blade][5]

6. The **Create virtual machine** blade opens. Here you can enter information required to spin up a virtual machine that will run the NGFW. Follow the steps and provide the NGFW information required. Select OK to apply.
![Create virtual machine to run NGFW][6]

## See also

This document showed you how to implement the Security Center recommendation "Add a Next Generation Firewall." To learn more about NGFWs and the Check Point partner solution, see the following:

- [Next-Generation Firewall](https://en.wikipedia.org/wiki/Next-Generation_Firewall)
- [Check Point vSEC](https://azure.microsoft.com/marketplace/partners/checkpoint/check-point-r77-10/)

To learn more about Security Center, see the following:

- [Setting security policies in Azure Security Center](security-center-policies.md) -- Learn how to configure security policies.
- [Managing security recommendations in Azure Security Center](security-center-recommendations.md) -- Learn how recommendations help you protect your Azure resources.
- [Security health monitoring in Azure Security Center](security-center-monitoring.md) -- Learn how to monitor the health of your Azure resources.
- [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md) -- Learn how to manage and respond to security alerts.
- [Monitoring partner solutions with Azure Security Center](security-center-partner-solutions.md) -- Learn how to monitor the health status of your partner solutions.
- [Azure Security Center FAQ](security-center-faq.md) -- Find frequently asked questions about using the service.
- [Azure Security blog](http://blogs.msdn.com/b/azuresecurity/) -- Find blog posts about Azure security and compliance.

<!--Image references-->
[1]: ./media/security-center-add-next-gen-firewall/add-next-gen-firewall.png
[2]: ./media/security-center-add-next-gen-firewall/select-an-endpoint.png
[3]: ./media/security-center-add-next-gen-firewall/create-new-next-gen-firewall.png
[4]: ./media/security-center-add-next-gen-firewall/select-next-gen-firewall.png
[5]: ./media/security-center-add-next-gen-firewall/firewall-solution-info-blade.png
[6]: ./media/security-center-add-next-gen-firewall/create-virtual-machine.png
