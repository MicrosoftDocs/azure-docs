---
title: Add a next generation firewall in Azure Security Center | Microsoft Docs
description: This document shows you how to implement the Azure Security Center recommendations **Add a Next Generation Firewall** and **Route traffic through NGFW only**.
services: security-center
documentationcenter: na
author: rkarlin
manager: barbkess
editor: ''

ms.assetid: 48b99015-4db8-4ce8-85e4-b544c0fa203e
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/28/2018
ms.author: rkarlin

---
# Add a Next Generation Firewall in Azure Security Center
Azure Security Center may recommend that you add a next generation firewall (NGFW) from a Microsoft partner to increase your security protections. This document walks you through an example of how to do this.

> [!NOTE]
> This document introduces the service by using an example deployment.  This is not a step-by-step guide.
>
>

## Implement the recommendation
1. In the **Recommendations** blade, select **Add a Next Generation Firewall**.
   ![Add a Next Generation Firewall][1]
2. In the **Add a Next Generation Firewall** blade, select an endpoint.
   ![Select an endpoint][2]
3. A second **Add a Next Generation Firewall** blade opens. You can choose to use an existing solution if available or you can create a new one. In this example, there are no existing solutions available so we create an NGFW.
   ![Create Next Generation Firewall][3]
4. To create an NGFW, select a solution from the list of integrated partners. In this example, we select **Check Point**.
   ![Select Next Generation Firewall solution][4]
5. The **Check Point** blade opens providing you information about the partner solution. Select **Create** in the information blade.
   ![Firewall information blade][5]
6. The **Create virtual machine** blade opens. Here you can enter information required to spin up a virtual machine (VM) that runs the NGFW. Follow the steps and provide the NGFW information required. Select OK to apply.
   ![Create virtual machine to run NGFW][6]

## Route traffic through NGFW only
Return to the **Recommendations** blade. A new entry was generated after you added an NGFW via Security Center, called **Route traffic through NGFW only**. This recommendation is created only if you installed your NGFW through Security Center. If you have Internet-facing endpoints, Security Center recommends that you configure Network Security Group rules that force inbound traffic to your VM through your NGFW.

1. In the **Recommendations blade**, select **Route traffic through NGFW only**.
   ![Route traffic through NGFW only][7]
2. This opens the blade **Route traffic through NGFW only**, which lists VMs that you can route traffic to. Select a VM from the list.
   ![Select a VM][8]
3. A blade for the selected VM opens, displaying related inbound rules. A description provides you with more information on possible next steps. Select **Edit inbound rules** to proceed with editing an inbound rule. The expectation is that **Source** is not set to **Any** for the Internet-facing endpoints linked with the NGFW. To learn more about the properties of the inbound rule, see [security rules](../virtual-network/security-overview.md#security-rules).
   ![Configure rules to limit access][9]
   ![Edit inbound rule][10]

## See also
This document showed you how to implement the Security Center recommendation "Add a Next Generation Firewall." To learn more about NGFWs and the Check Point partner solution, see the following:

* [Next-Generation Firewall](https://en.wikipedia.org/wiki/Next-Generation_Firewall)
* [Check Point vSEC](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/checkpoint.vsec)

To learn more about Security Center, see the following:

* [Setting security policies in Azure Security Center](tutorial-security-policy.md) -- Learn how to configure security policies.
* [Managing security recommendations in Azure Security Center](security-center-recommendations.md) -- Learn how recommendations help you protect your Azure resources.
* [Security health monitoring in Azure Security Center](security-center-monitoring.md) -- Learn how to monitor the health of your Azure resources.
* [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md) -- Learn how to manage and respond to security alerts.
* [Monitoring partner solutions with Azure Security Center](security-center-partner-solutions.md) -- Learn how to monitor the health status of your partner solutions.
* [Azure Security Center FAQ](security-center-faq.md) -- Find frequently asked questions about using the service.
* [Azure Security blog](https://blogs.msdn.com/b/azuresecurity/) -- Find blog posts about Azure security and compliance.

<!--Image references-->
[1]: ./media/security-center-add-next-gen-firewall/add-next-gen-firewall.png
[2]: ./media/security-center-add-next-gen-firewall/select-an-endpoint.png
[3]: ./media/security-center-add-next-gen-firewall/create-new-next-gen-firewall.png
[4]: ./media/security-center-add-next-gen-firewall/select-next-gen-firewall.png
[5]: ./media/security-center-add-next-gen-firewall/firewall-solution-info-blade.png
[6]: ./media/security-center-add-next-gen-firewall/create-virtual-machine.png
[7]: ./media/security-center-add-next-gen-firewall/route-traffic-through-ngfw.png
[8]: ./media/security-center-add-next-gen-firewall/select-vm.png
[9]: ./media/security-center-add-next-gen-firewall/configure-rules-to-limit-access.png
[10]: ./media/security-center-add-next-gen-firewall/edit-inbound-rule.png
