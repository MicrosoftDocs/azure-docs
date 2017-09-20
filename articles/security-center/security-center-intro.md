---
title: Introduction to Azure Security Center | Microsoft Docs
description: Learn about Azure Security Center, its key capabilities, and how to get started.
services: security-center
documentationcenter: na
author: TerryLanfear
manager: MBaldwin
editor: ''

ms.assetid: 45b9756b-6449-49ec-950b-5ed1e7c56daa
ms.service: security-center
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/13/2017
ms.author: terrylan

---
# Introduction to Azure Security Center
Learn about Azure Security Center, its key capabilities, and how to get started.

## What is Azure Security Center?
Azure Security Center provides unified security management and advanced threat protection for workloads running in Azure, on-premises, and in other clouds. It delivers visibility and control over hybrid cloud workloads, active defenses that reduce your exposure to threats, and intelligent detection to help you keep pace with rapidly evolving cyber attacks.

The Security Center **Overview** provides a quick view into the security posture of your Azure and non-Azure workloads, enabling you to discover and assess the security of your workloads and to identify and mitigate risk.

![Security Center Overview][1]

## Why use Security Center?

**Unified security management**

- **Reduced management complexity**. Manage security across all your hybrid cloud workloads – on-premises, Azure, and other cloud platforms – in one console. Built-in dashboards provide instant insights into security issues that require attention.
- **Centralized policy management**. Ensure compliance with company or regulatory security requirements by centrally managing security policies across all your hybrid cloud workloads.
- **Security data from many sources**. Collect, search, and analyze security data from a variety of sources, including connected partner solutions like network firewalls and other Microsoft services.
- **Integration with existing security workflows**. Access, integrate, and analyze security information using REST APIs to connect existing tools and processes.
- **Compliance reporting**. Use security data and insights to demonstrate compliance and easily generate evidence for auditors.

**Multi-layer cyber defense**

- **Continuous security assessment**. Monitor the security of machines, networks, and Azure services using hundreds of built-in security assessments or create your own. Identify software and configurations that are vulnerable to attack.
- **Actionable recommendations**. Remediate security vulnerabilities before they can be exploited by attackers with prioritized, actionable security recommendations and built-in automation playbooks.
- **Adaptive application controls**. Block malware and other unwanted applications by applying whitelisting recommendations adapted to your specific Azure workloads and powered by machine learning.
- **Network access security**. Reduce the network attack surface with just-in-time, controlled access to management ports on Azure VMs, drastically reducing exposure to brute force and other network attacks.

**Intelligent threat detection and response**

- **Industry’s most extensive threat intelligence**. Tap into the Microsoft Intelligent Security Graph, which uses trillions of signals from Microsoft services and systems around the globe to identify new and evolving threats.
- **Advanced threat detection**. Use built-in behavioral analytics and machine learning to identify attacks and zero-day exploits. Monitor networks, machines, and cloud services for incoming attacks and post-breach activity.
- **Alerts and Incidents**. Focus on the most critical threats first with prioritized security alerts and incidents that map alerts of different types into a single attack campaign. Create your own custom security alerts as well.
- **Streamlined investigation**. Quickly assess the scope and impact of an attack with a visual, interactive experience. Use predefined or ad hoc queries for deeper exploration of security data.
- **Contextual threat intelligence**. Visualize the source of attacks on an interactive world map. Use built-in threat intelligence reports to gain valuable insight into the techniques and objectives of known malicious actors.

## Get started
To get started with Security Center, you need a subscription to Microsoft Azure. Security Center is enabled with your Azure subscription. If you do not have a subscription, you can sign up for a [free trial](https://azure.microsoft.com/pricing/free-trial/).

 You access Security Center from the [Azure portal](https://azure.microsoft.com/features/azure-portal/). See the [portal documentation](https://azure.microsoft.com/documentation/services/azure-portal/) to learn more.

[Getting started with Azure Security Center](security-center-get-started.md) quickly guides you through the security-monitoring and policy-management components of Security Center.

## Next steps
In this document, you were introduced to Security Center, its key capabilities, and how to get started. To learn more, see the following resources:

* [Planning and operations guide](security-center-planning-and-operations-guide.md) - Learn how to optimize your use of Security Center based on your organization's security requirements and cloud management model.
* [Setting security policies](security-center-policies.md) — Learn how to configure security policies for your Azure subscriptions and resource groups.
* [Managing security recommendations](security-center-recommendations.md) — Learn how recommendations help you protect your Azure resources.
* [Security health monitoring](security-center-monitoring.md) — Learn how to monitor the health of your Azure resources.
* [Managing and responding to security alerts](security-center-managing-and-responding-alerts.md) — Learn how to manage and respond to security alerts.
* [Monitoring and processing security events](security-center-events-dashboard.md) - Learn how to monitor and process security events collected over time.
* [Monitoring partner solutions](security-center-partner-solutions.md) — Learn how to monitor the health status of your partner solutions.
* [Azure Security Center FAQ](security-center-faq.md) — Find frequently asked questions about using the service.
* [Azure Security blog](http://blogs.msdn.com/b/azuresecurity/) — Get the latest Azure security news and information.

<!--Image references-->
[1]: ./media/security-center-intro/overview.png
