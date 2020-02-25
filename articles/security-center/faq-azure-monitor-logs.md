---
title: Azure Security Center FAQ - questions about existing MMAs
description: This FAQ answers questions for customers already using the Microsoft Monitoring Agent and considering Azure Security Center, a product that helps you prevent, detect, and respond to threats.
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.assetid: be2ab6d5-72a8-411f-878e-98dac21bc5cb
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/25/2020
ms.author: memildin

---

## FAQ for customers already using Azure Monitor logs<a name="existingloganalyticscust"></a>

### Does Security Center override any existing connections between VMs and workspaces?

If a VM already has the Microsoft Monitoring Agent installed as an Azure extension, Security Center does not override the existing workspace connection. Instead, Security Center uses the existing workspace. The VM will be protected provided that the "Security" or "SecurityCenterFree" solution has been installed on the workspace to which it is reporting. 

A Security Center solution is installed on the workspace selected in the Data Collection screen if not present already, and the solution is applied only to the relevant VMs. When you add a solution, it's automatically deployed by default to all Windows and Linux agents connected to your Log Analytics workspace. [Solution Targeting](../operations-management-suite/operations-management-suite-solution-targeting.md) allows you to apply a scope to your solutions.

If the Microsoft Monitoring Agent is installed directly on the VM (not as an Azure extension), Security Center does not install the Microsoft Monitoring Agent and security monitoring is limited.

### Does Security Center install solutions on my existing Log Analytics workspaces? What are the billing implications?
When Security Center identifies that a VM is already connected to a workspace you created, Security Center enables solutions on this workspace according to your pricing tier. The solutions are applied only to the relevant Azure VMs, via [solution targeting](../operations-management-suite/operations-management-suite-solution-targeting.md), so the billing remains the same.

- **Free tier** – Security Center installs the 'SecurityCenterFree' solution on the workspace. You won't be billed for the Free tier.
- **Standard tier** – Security Center installs the 'Security' solution on the workspace.

   ![Solutions on default workspace][1]

### I already have workspaces in my environment, can I use them to collect security data?
If a VM already has the Microsoft Monitoring Agent installed as an Azure extension, Security Center uses the existing connected workspace. A Security Center solution is installed on the workspace if not present already, and the solution is applied only to the relevant VMs via [solution targeting](../operations-management-suite/operations-management-suite-solution-targeting.md).

When Security Center installs the Microsoft Monitoring Agent on VMs, it uses the default workspace(s) created by Security Center.

### I already have security solution on my workspaces. What are the billing implications?
The Security & Audit solution is used to enable Security Center Standard tier features for Azure VMs. If the Security & Audit solution is already installed on a workspace, Security Center uses the existing solution. There is no change in billing.

## Using Azure Security Center
### What is a security policy?
A security policy defines the set of controls that are recommended for resources within the specified subscription. In Azure Security Center, you define policies for your Azure subscriptions according to your company's security requirements and the type of applications or sensitivity of the data in each subscription.

The security policies enabled in Azure Security Center drive security recommendations and monitoring. To learn more about security policies, see [Security health monitoring in Azure Security Center](security-center-monitoring.md).

### Who can modify a security policy?
To modify a security policy, you must be a Security Administrator or an Owner or Contributor of that subscription.

To learn how to configure a security policy, see [Setting security policies in Azure Security Center](tutorial-security-policy.md).

### What is a security recommendation?
Azure Security Center analyzes the security state of your Azure resources. When potential security vulnerabilities are identified, recommendations are created. The recommendations guide you through the process of configuring the needed control. Examples are:

* Provisioning of anti-malware to help identify and remove malicious software
* [Network security groups](../virtual-network/security-overview.md) and rules to control traffic to virtual machines
* Provisioning of a web application firewall to help defend against attacks targeting your web applications
* Deploying missing system updates
* Addressing OS configurations that do not match the recommended baselines

Only recommendations that are enabled in Security Policies are shown here.

### How can I see the current security state of my Azure resources?
The **Security Center Overview** page shows the overall security posture of your environment broken down by Compute, Networking, Storage & data, and Applications. Each resource type has an indicator showing if any potential security vulnerabilities have been identified. Clicking each tile displays a list of security issues identified by Security Center, along with an inventory of the resources in your subscription.

### What triggers a security alert?
Azure Security Center automatically collects, analyzes, and fuses log data from your Azure resources, the network, and partner solutions like antimalware and firewalls. When threats are detected, a security alert is created. Examples include detection of:

* Compromised virtual machines communicating with known malicious IP addresses
* Advanced malware detected using Windows error reporting
* Brute force attacks against virtual machines
* Security alerts from integrated partner security solutions such as Anti-Malware or Web Application Firewalls

### Why did secure scores values change? <a name="secure-score-faq"></a>
As of February 2019, Security Center adjusted the score of a few recommendations, in order to better fit their severity. As a result of this adjustment, there may be changes in overall secure score values. For more information about secure score, see [Secure score calculation](security-center-secure-score.md).

### What's the difference between threats detected and alerted on by Microsoft Security Response Center versus Azure Security Center?
The Microsoft Security Response Center (MSRC) performs select security monitoring of the Azure network and infrastructure and receives threat intelligence and abuse complaints from third parties. When MSRC becomes aware that customer data has been accessed by an unlawful or unauthorized party or that the customer’s use of Azure does not comply with the terms for Acceptable Use, a security incident manager notifies the customer. Notification typically occurs by sending an email to the security contacts specified in Azure Security Center or the Azure subscription owner if a security contact is not specified.

Security Center is an Azure service that continuously monitors the customer’s Azure environment and applies analytics to automatically detect a wide range of potentially malicious activity. These detections are surfaced as security alerts in the Security Center dashboard.

### Which Azure resources are monitored by Azure Security Center?
Azure Security Center monitors the following Azure resources:

* Virtual machines (VMs) (including [Cloud Services](../cloud-services/cloud-services-choose-me.md))
* Virtual machine scale sets
* Azure Virtual Networks
* Azure SQL service
* Azure Storage account
* Azure Web Apps (in [App Service Environment](../app-service/environment/intro.md))
* Partner solutions integrated with your Azure subscription such as a web application firewall on VMs and on App Service Environment

In addition, non-Azure (including on-premises) computers can also be monitored by Azure Security Center (Both [Windows computers](./quick-onboard-windows-computer.md) and [Linux computers](./quick-onboard-linux-computer.md) are supported)


<!--Image references-->
[1]: ./media/security-center-platform-migration-faq/solutions.png