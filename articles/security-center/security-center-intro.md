---
title: What is Azure Security Center?| Microsoft Docs
description: Learn about Azure Security Center, its key capabilities, and how it works.
services: security-center
documentationcenter: na
author: TerryLanfear
manager: MBaldwin
editor: ''

ms.assetid: 45b9756b-6449-49ec-950b-5ed1e7c56daa
ms.service: security-center
ms.devlang: na
ms.topic: overview
ms.custom: mvc
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/15/2018
ms.author: terrylan

---
# What is Azure Security Center?
Azure Security Center provides unified security management and advanced threat protection across hybrid cloud workloads. With Security Center, you can apply security policies across your workloads, limit your exposure to threats, and detect and respond to attacks.

Why use Security Center?

- **Centralized policy management** – Ensure compliance with company or regulatory security requirements by centrally managing security policies across all your hybrid cloud workloads.
- **Continuous security assessment** – Monitor the security of machines, networks, storage and data services, and applications to discover potential security issues.
- **Actionable recommendations** – Remediate security vulnerabilities before they can be exploited by attackers with prioritized and actionable security recommendations.
- **Advanced cloud defenses** – Reduce threats with just in time access to management ports and whitelisting to control applications running on your VMs.
- **Prioritized alerts and incidents** - Focus on the most critical threats first with prioritized security alerts and incidents.
- **Integrated security solutions** - Collect, search, and analyze security data from a variety of sources, including connected partner solutions.

The **Security Center - Overview** provides a quick view into the security posture of your Azure and non-Azure workloads, enabling you to discover and assess the security of your workloads and to identify and mitigate risk. The built-in dashboard provides instant insights into security alerts and vulnerabilities that require attention.

![Overview][1]

## Centralized policy management
A security policy defines the desired configuration of your workloads and helps ensure compliance with company or regulatory security requirements. In Security Center, you define policies and tailor them to your type of workload or the sensitivity of your data.

Security Center policies contain the following components:

- **Data collection**: Determines agent provisioning and security [data collection](security-center-enable-data-collection.md) settings.
- **Security policy**: Determine which controls Security Center monitors and recommends by editing the [security policy](security-center-policies.md).
- **Email notifications**: Determines security contacts and [e-mail notification](security-center-provide-security-contact-details.md) settings.
- **Pricing tier**: Defines Free or Standard [pricing selection](security-center-pricing.md). The tier you choose determines which Security Center features are available for resources in scope.

![Security policy][2]

See [Security policies overview](security-center-policies-overview.md) for more information.

## Continuous security assessment
Security Center analyzes the security state of your compute resources, virtual networks, storage and data services, and applications. Continuous assessment helps you to discover potential security issues, such as systems with missing security updates or exposed network ports. Select a tile in the Prevention section to view more information, including a list of resources and any vulnerabilities that have been identified.

![Security health monitoring][3]

See [Security health monitoring](security-center-monitoring.md) for more information.

## Actionable recommendations
Security Center analyzes the security state of your Azure and non-Azure resources to identify potential security vulnerabilities. A list of prioritized security recommendations guides you through the process of addressing security issues.

![Recommendations][4]

See [Managing security recommendations](security-center-recommendations.md) for more information.

## Just in time VM access
Reduce the network attack surface with just in time, controlled access to management ports on Azure VMs, drastically reducing exposure to brute force and other network attacks.

![Just in time VM access][5]

Specify rules for how users can connect to virtual machines. When needed, access can be requested from Security Center or via PowerShell. As long as the request complies with the rules, access is automatically granted for the requested time.

See [Manage virtual machine access using just in time](security-center-just-in-time.md) for more information.

## Adaptive application controls
Block malware and other unwanted applications by applying whitelisting recommendations adapted to your specific Azure workloads and powered by machine learning.

![Adaptive application controls][6]

Review and click to apply the recommended application whitelisting rules generated by Security Center or edit rules already configured.

See [Adaptive application controls](security-center-adaptive-application.md) for more information.

## Prioritized alerts and incidents
Security Center uses advanced analytics and global threat intelligence to detect incoming attacks and post-breach activity. Alerts are prioritized and grouped into incidents, helping you focus on the most critical threats first. You can create your own custom security alerts as well.

![Prioritized alerts and incidents][7]

You can quickly assess the scope and impact of an attack with a visual, interactive investigation experience, and use predefined or ad hoc queries for deeper exploration of security data.

See [Managing and responding to security alerts](security-center-managing-and-responding-alerts.md) for more information.

## Integrate your security solutions
You can collect, search, and analyze security data from a variety of sources, including connected partner solutions like network firewalls and other Microsoft services, in Security Center.

![Integrate security solutions][8]

See [Integrate security solutions](security-center-partner-integration.md) for more information.

## Next steps

- To get started with Security Center, you need a subscription to Microsoft Azure. If you do not have a subscription, you can sign up for a [free trial](https://azure.microsoft.com/free/).
- Security Center’s Free pricing tier is enabled with your Azure subscription. To take advantage of advanced security management and threat detection capabilities, you must upgrade to the Standard pricing tier. The Standard tier is free for the first 60 days. See the [Security Center pricing page](https://azure.microsoft.com/pricing/details/security-center/) for more information.
- If you’re ready to enable Security Center Standard now, the [Quickstart: Onboard your Azure subscription to Security Center Standard](security-center-get-started.md) walks you through the steps.


<!--Image references-->
[1]: ./media/security-center-intro/overview.png
[2]: ./media/security-center-intro/security-policy.png
[3]: ./media/security-center-intro/compute.png
[4]: ./media/security-center-intro/recommendations.png
[5]: ./media/security-center-intro/just-in-time-vm-access.png
[6]: ./media/security-center-intro/adaptive-app-controls.png
[7]: ./media/security-center-intro/security-alerts.png
[8]: ./media/security-center-intro/security-solutions.png
