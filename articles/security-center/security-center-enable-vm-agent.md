---
title: Enable VM Agent in Azure Security Center | Microsoft Docs
description: This document shows you how to implement the Azure Security Center recommendation **Enable VM Agent**.
services: security-center
documentationcenter: na
author: TerryLanfear
manager: MBaldwin
editor: ''

ms.assetid: 5b431c25-4241-45b7-9556-cf2a1956f3da
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/02/2017
ms.author: terrylan

---
# Enable VM Agent in Azure Security Center
The VM Agent must be installed on virtual machines (VMs) in order to [enable data collection](security-center-enable-data-collection.md).  Azure Security Center enables you to see which VMs require the VM Agent and will recommend that you enable the VM Agent on those VMs.

The VM Agent is installed by default for VMs that are deployed from the Azure Marketplace. The article [VM Agent and Extensions – Part 2](https://azure.microsoft.com/blog/vm-agent-and-extensions-part-2/) provides information on how to install the VM Agent.

> [!NOTE]
> This document introduces the service by using an example deployment. This is not a step-by-step guide.
>
>

## Implement the recommendation
1. In the **Recommendations blade**, select **Enable VM Agent**.
   ![Enable VM Agent][1]
2. This opens the blade **VM Agent Is Missing Or Not Responding**. This blade lists the VMs that require the VM Agent. Follow the instructions on the blade to install the VM agent.
   ![VM Agent is missing][2]

## See also
To learn more about Security Center, see the following:

* [Setting security policies in Azure Security Center](security-center-policies.md)--Learn how to configure security policies for your Azure subscriptions and resource groups.
* [Managing security recommendations in Azure Security Center](security-center-recommendations.md)--Learn how recommendations help you protect your Azure resources.
* [Security health monitoring in Azure Security Center](security-center-monitoring.md)--Learn how to monitor the health of your Azure resources.
* [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md)--Learn how to manage and respond to security alerts.
* [Monitoring partner solutions with Azure Security Center](security-center-partner-solutions.md) -- Learn how to monitor the health status of your partner solutions.
* [Azure Security Center FAQ](security-center-faq.md)--Find frequently asked questions about using the service.
* [Azure Security blog](http://blogs.msdn.com/b/azuresecurity/)--Get the latest Azure security news and information.

<!--Image references-->
[1]: ./media/security-center-enable-vm-agent/enable-vm-agent.png
[2]: ./media/security-center-enable-vm-agent/vm-agent-is-missing.png
