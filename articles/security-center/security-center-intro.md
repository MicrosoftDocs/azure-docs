---
title: What is Azure Security Center?| Microsoft Docs
description: Learn about Azure Security Center, its key capabilities, and how it works.
services: security-center
documentationcenter: na
author: rkarlin
manager: MBaldwin
editor: ''

ms.assetid: 45b9756b-6449-49ec-950b-5ed1e7c56daa
ms.service: security-center
ms.devlang: na
ms.topic: overview
ms.custom: mvc
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/10/2018
ms.author: rkarlin

---
# What is Azure Security Center?
Azure Security Center provides unified security management and advanced threat protection across hybrid cloud workloads. With Security Center, you can apply security policies across your workloads, limit your exposure to threats, and detect and respond to attacks.

Why use Security Center?

- **Centralized policy management** – Ensure compliance with company or regulatory security requirements by centrally managing security policies across all your hybrid cloud workloads.
- **Continuous security assessment** – Monitor the security posture of machines, networks, storage and data services, and applications to discover potential security issues.
- **Actionable recommendations** – Remediate security vulnerabilities before they can be exploited by attackers with prioritized and actionable security recommendations.
- **Prioritized alerts and incidents** - Focus on the most critical threats first with prioritized security alerts and incidents.
- **Advanced cloud defenses** – Reduce threats with just in time access to management ports and adaptive application controls running on your VMs.
- **Integrated security solutions** - Collect, search, and analyze security data from a variety of sources, including connected partner solutions.

The **Security Center - Overview** provides a quick view into the security posture of your Azure and non-Azure workloads, enabling you to discover and assess the security of your workloads and to identify and mitigate risk. The built-in dashboard provides instant insights into security alerts and vulnerabilities that require attention.

![Overview][1]

## Centralized policy management
The **Policy & compliance** section (shown above) provides quick information on your subscription coverage, policy compliance, and security posture.

### Subscription coverage
This section displays the total number of subscriptions you have access to (read or write) and the Security Center coverage level (Standard or Free) a subscription is running under:

- **Covered (Standard)** – Covered subscriptions are running under the maximum level of protection offered by Security Center
- **Covered (Free)** – Covered subscriptions are running under the limited, free level of protection offered by Security Center
- **Not covered** – Subscriptions in this status are not monitored by Security Center

Selecting the chart opens the **Coverage** window. Selecting a tab (**Not covered**, **Basic coverage**, or **Standard coverage**) provides a list of subscriptions in each status. Selecting a subscription under one of the tabs, provides additional information about a subscription. This information allows you to identify the owner of a subscription and contact them in order to enable Security Center or increase the subscription’s coverage.

![Security Center coverage][9]

### Policy compliance
Policy compliance is determined by the compliance factors of all policies assigned. The overall compliance score for a management group, subscription, or workspace is the weighted average of the assignments. The weighted average factors in the number of policies in a single assignment and the number of resources the assignment applies to.

For example, if your subscription has two VMs and an initiative with five policies assigned to it, then you have ten assessments in your subscription. If one of the VMs does not comply to two of the policies, then the overall compliance score of your subscription’s assignment is 80%.

This section displays your overall compliance ratio and your least compliant subscriptions. Selecting **Show policy compliance of your environment** opens the **Policy Management** window. **Policy Management** displays the hierarchical structure of management groups, subscriptions, and workspaces. Here you manage your security policies by choosing a subscription or management group.

![Policy management][10]

A security policy defines the desired configuration of your workloads and helps ensure compliance with company or regulatory security requirements. In Security Center, you define policies and tailor them to your type of workload or the sensitivity of your data, determining which controls Security Center monitors and recommends. You can edit the security policy in Security Center by clicking on a management group or subscription. You can also use Azure Policy to create new definitions, define additional policies, and assign policies across management groups.

Select **Edit settings >** to edit the following Security Center settings at the subscription, management group, resource group, or work space level:

- **Data collection**: Determines agent provisioning and security [data collection](security-center-enable-data-collection.md) settings.
- **Email notifications**: Determines security contacts and [e-mail notification](security-center-provide-security-contact-details.md) settings.
- **Pricing tier**: Defines Free or Standard [pricing selection](security-center-pricing.md). The tier you choose determines which Security Center features are available for resources in scope.
- **Edit security configurations**: Lets you view and modify the OS configurations that are assessed by Security Center to identify potential security vulnerabilities.

For more information, see [Integrate Security Center security policies with Azure Policy](security-center-azure-policy.md).

### Manage and govern your security posture
The right-hand side of the dashboard under **Policy & compliance** provides you with insights that you can act on immediately to improve your overall security posture. Examples are:

- Define and assign Security Center policies in order to review and track compliance to security standards
- Make Security Center security alerts available to a SIEM connector
- Policy compliance over time

## Continuous security assessment
The Resource security hygiene section under **Security Center - Overview** provides a quick view of your resources’ security hygiene, displaying the number of issues identified and the security state for each resource type. Continuous assessment helps you to discover potential security issues, such as systems with missing security updates or exposed network ports.

### Secure score
The Azure Security Center secure score reviews your security recommendations and prioritizes them for you, so you know which recommendations to perform first, helping you find the most serious security vulnerabilities so you can prioritize investigation. Secure score is a measurement tool that helps you harden your security to achieve a secure workload. For more information, see [Secure score in Azure Security Center](security-center-secure-score.md).

### Health monitoring
Selecting a resource type under **Resource health monitoring** provides a list of resources and any vulnerabilities that have been identified. Resource types are compute & applications, networking, data & storage, and identity & access.

We selected **Compute & apps**. Under **Compute**, there are four tabs:

- **Overview**: monitoring and recommendations identified by Security Center.
- **VMs and computers**: list of your VMs, computers, and current security state of each.
- **Cloud Services**: list of your web and worker roles monitored by Security Center.
- **App services (Preview)**: list of your web applications and App service environments and current security state of each.

![Security health monitoring][3]

For more information, see [Security health monitoring](security-center-monitoring.md).

## Actionable recommendations
Security Center analyzes the security state of your Azure and non-Azure resources to identify potential security vulnerabilities. Selecting **Recommendations** under **Resources** provides a list of prioritized security recommendations that guides you through the process of addressing security issues.

![Recommendations][4]

For more information, see [Managing security recommendations](security-center-recommendations.md).

### Most prevalent recommendations
The right-hand side of the dashboard under **Resources** provides you with a list of the most prevalent recommendations that exist for the largest number of resources. The most prevalent recommendations highlight where you should focus your attention. Selecting the right arrow provides the highest impact recommendation.

![Most prevalent recommendations][11]

This is the single most impactful recommendation that you have in your environment. Resolving this recommendation will improve your compliance the most. In this example, the recommendation is “apply disk encryption.” Selecting **Improve your compliance** provides a description of the recommendation and a list of impacted resources.

![Apply disk encryption][12]

## Threat protection
This area provides visibility into the security alerts detected on your resources and the severity level for those alerts.

### Prioritized alerts and incidents
Security Center uses advanced analytics and global threat intelligence to detect incoming attacks and post-breach activity. Alerts are prioritized and grouped into incidents, helping you focus on the most critical threats first. You can create your own custom security alerts as well.

Selecting **Security alerts by severity** or **Security alerts over time** provides detailed information about the alerts.

![Prioritized alerts and incidents][7]

You can quickly assess the scope and impact of an attack with a visual, interactive investigation experience, and use predefined or ad hoc queries for deeper exploration of security data.

For more information, see [Managing and responding to security alerts](security-center-managing-and-responding-alerts.md).

The right-hand side of the dashboard provides information to help you prioritize which alerts to address first and understand where your common vulnerabilities are:

- **Most attacked resources**: Specific resources that have the highest number of alerts
- **Most prevalent alerts**: Alert types that affect the largest number of resources

## Just in time VM access
Reduce the network attack surface with just in time, controlled access to management ports on Azure VMs, drastically reducing exposure to brute force and other network attacks.

![Just in time VM access][5]

Specify rules for how users can connect to virtual machines. When needed, access can be requested from Security Center or via PowerShell. As long as the request complies with the rules, access is automatically granted for the requested time.

For more information, see [Manage virtual machine access using just in time](security-center-just-in-time.md).

## Adaptive application controls
Block malware and other unwanted applications by applying whitelisting recommendations adapted to your specific Azure workloads and powered by machine learning.

![Adaptive application controls][6]

Review and click to apply the recommended application whitelisting rules generated by Security Center or edit rules already configured.

For more information, see [Adaptive application controls](security-center-adaptive-application.md).

## Integrate your security solutions
You can collect, search, and analyze security data from a variety of sources, including connected partner solutions like network firewalls and other Microsoft services, in Security Center.

![Integrate security solutions][8]

For more information, see [Integrate security solutions](security-center-partner-integration.md).

## Next steps

- To get started with Security Center, you need a subscription to Microsoft Azure. If you do not have a subscription, you can sign up for a [free trial](https://azure.microsoft.com/free/).
- Security Center’s Free pricing tier is enabled with your Azure subscription. To take advantage of advanced security management and threat detection capabilities, you must upgrade to the Standard pricing tier. The Standard tier is free for the first 60 days. See the [Security Center pricing page](https://azure.microsoft.com/pricing/details/security-center/) for more information.
- If you’re ready to enable Security Center Standard now, the [Quickstart: Onboard your Azure subscription to Security Center Standard](security-center-get-started.md) walks you through the steps.


<!--Image references-->
[1]: ./media/security-center-intro/overview.png
[3]: ./media/security-center-intro/compute.png
[4]: ./media/security-center-intro/recommendations.png
[5]: ./media/security-center-intro/just-in-time-vm-access.png
[6]: ./media/security-center-intro/adaptive-app-controls.png
[7]: ./media/security-center-intro/security-alerts.png
[8]: ./media/security-center-intro/security-solutions.png
[9]: ./media/security-center-intro/coverage.png
[10]: ./media/security-center-intro/policy-management.png
[11]: ./media/security-center-intro/highest-impact.png
[12]: ./media/security-center-intro/apply-disk-encryption.png
