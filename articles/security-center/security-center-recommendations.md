---
title: Managing security recommendations in Azure Security Center  | Microsoft Docs
description: This document walks you through how recommendations in Azure Security Center help you protect your Azure resources and stay in compliance with security policies.
services: security-center
documentationcenter: na
author: rkarlin
manager: barbkess
editor: ''

ms.assetid: 86c50c9f-eb6b-4d97-acb3-6d599c06133e
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/13/2018
ms.author: rkarlin

---
# Managing security recommendations in Azure Security Center
This document walks you through how to use recommendations in Azure Security Center to help you protect your Azure resources.

> [!NOTE]
> This document introduces the service by using an example deployment.  This document is not a step-by-step guide.
>
>

## What are security recommendations?
Security Center periodically analyzes the security state of your Azure resources. When Security Center identifies potential security vulnerabilities, it creates recommendations. The recommendations guide you through the process of configuring the needed controls.

## Implementing security recommendations
### Set recommendations
In [Setting security policies in Azure Security Center](tutorial-security-policy.md), you learn to:

* Configure security policies.
* Turn on data collection.
* Choose which recommendations to see as part of your security policy.

Current policy recommendations center around system updates, baseline rules, anti-malware programs, [network security groups](../virtual-network/security-overview.md) on subnets and network interfaces, SQL database auditing, SQL database transparent data encryption, and web application firewalls.  [Setting security policies](tutorial-security-policy.md) provides a description of each recommendation option.

### Monitor recommendations
After setting a security policy, Security Center analyzes the security state of your resources to identify potential vulnerabilities. The **Recommendations** tile under **Overview** lets you know the total number of recommendations identified by Security Center.

![Recommendations tile][1]

To see the details of each recommendation, select the **Recommendations tile** under **Overview**. **Recommendations** opens.

![Filter recommendations][2]

You can filter recommendations. To filter the recommendations, select **Filter** on the **Recommendations** blade. The **Filter** blade opens and you select the severity and state values you wish to see.


* **RECOMMENDATIONS**: The recommendation.
* **SECURE SCORE IMPACT**:
* **RESOURCE**: Lists the resources to which this recommendation applies.
* **STATUS BARS**:  Describes the severity of that particular recommendation:
   * **High (Red)**: A vulnerability exists with a meaningful resource (such as an application, a VM, or a network security group) and requires attention.
   * **Medium (Orange)**: A vulnerability exists and non-critical or additional steps are required to eliminate it or to complete a process.
   * **Low (Blue)**: A vulnerability exists that should be addressed but does not require immediate attention. (By default, low recommendations aren't presented, but you can filter on low recommendations if you want to see them.) 
   * **Healthy (Green)**:
   * **Not Available (Grey)**:
 


> [!NOTE]
> You will want to understand the [classic and Resource Manager deployment models](../azure-classic-rm.md) for Azure resources.
> 
> 
> ### Apply recommendations
> After reviewing all recommendations, decide which one you should apply first. We recommend that you use the severity rating as the main parameter to evaluate which recommendations should be applied first.



## Next steps
In this document, you were introduced to security recommendations in Security Center. To learn more about Security Center, see the following:

* [Setting security policies in Azure Security Center](tutorial-security-policy.md) — Learn how to configure security policies for your Azure subscriptions and resource groups.
* [Security health monitoring in Azure Security Center](security-center-monitoring.md) — Learn how to monitor the health of your Azure resources.
* [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md) — Learn how to manage and respond to security alerts.
* [Monitoring partner solutions with Azure Security Center](security-center-partner-solutions.md) — Learn how to monitor the health status of your partner solutions.
* [Azure Security Center FAQ](security-center-faq.md) — Find frequently asked questions about using the service.
* [Azure Security blog](https://blogs.msdn.com/b/azuresecurity/) — Find blog posts about Azure security and compliance.

<!--Image references-->
[1]: ./media/security-center-recommendations/recommendations-tile.png
[2]: ./media/security-center-recommendations/filter-recommendations.png
