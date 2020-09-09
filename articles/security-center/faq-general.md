---
title: Azure Security Center FAQ - General questions
description: Frequently asked general questions about Azure Security Center, a product that helps you prevent, detect, and respond to threats
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

# FAQ - General questions about Azure Security Center

## What is Azure Security Center?
Azure Security Center helps you prevent, detect, and respond to threats with increased visibility into and control over the security of your resources. It provides integrated security monitoring and policy management across your subscriptions, helps detect threats that might otherwise go unnoticed, and works with a broad ecosystem of security solutions.

Security Center uses the Log Analytics agent to collect and store data. For in-depth details, see [Data collection in Azure Security Center](security-center-enable-data-collection.md).


## How do I get Azure Security Center?
Azure Security Center is enabled with your Microsoft Azure subscription and accessed from the [Azure portal](https://azure.microsoft.com/features/azure-portal/). To access it, [sign in to the portal](https://portal.azure.com), select **Browse**, and scroll to **Security Center**.


## Which Azure resources are monitored by Azure Security Center?
Azure Security Center monitors the following Azure resources:

* Virtual machines (VMs) (including [Cloud Services](../cloud-services/cloud-services-choose-me.md))
* Virtual machine scale sets
* Partner solutions integrated with your Azure subscription such as a web application firewall on VMs and on App Service Environment
* [The many Azure PaaS services listed in the product overview](features-paas.md)


## How can I see the current security state of my Azure resources?
The **Security Center Overview** page shows the overall security posture of your environment broken down by Compute, Networking, Storage & data, and Applications. Each resource type has an indicator showing identified security vulnerabilities. Clicking each tile displays a list of security issues identified by Security Center, along with an inventory of the resources in your subscription.



## What is a security policy?
A security policy defines the set of controls that are recommended for resources within the specified subscription. In Azure Security Center, you define policies for your Azure subscriptions according to your company's security requirements and the type of applications or sensitivity of the data in each subscription.

The security policies enabled in Azure Security Center drive security recommendations and monitoring. To learn more about security policies, see [Security health monitoring in Azure Security Center](security-center-monitoring.md).


## Who can modify a security policy?
To modify a security policy, you must be a **Security Administrator** or an **Owner** of that subscription.

To learn how to configure a security policy, see [Setting security policies in Azure Security Center](tutorial-security-policy.md).


## What is a security recommendation?
Azure Security Center analyzes the security state of your Azure resources. When potential security vulnerabilities are identified, recommendations are created. The recommendations guide you through the process of configuring the needed control. Examples are:

* Provisioning of anti-malware to help identify and remove malicious software
* [Network security groups](../virtual-network/security-overview.md) and rules to control traffic to virtual machines
* Provisioning of a web application firewall to help defend against attacks targeting your web applications
* Deploying missing system updates
* Addressing OS configurations that do not match the recommended baselines

Only recommendations that are enabled in Security Policies are shown here.



## What triggers a security alert?
Azure Security Center automatically collects, analyzes, and fuses log data from your Azure resources, the network, and partner solutions like antimalware and firewalls. When threats are detected, a security alert is created. Examples include detection of:

* Compromised virtual machines communicating with known malicious IP addresses
* Advanced malware detected using Windows error reporting
* Brute force attacks against virtual machines
* Security alerts from integrated partner security solutions such as Anti-Malware or Web Application Firewalls


## Why did Secure Score values change? <a name="secure-score-faq"></a>
As of February 2019, Security Center adjusted the score of a few recommendations, in order to better fit their severity. As a result of this adjustment, there may be changes in overall Secure Score values.  For more information about secure score, see [Enhanced secure score in Azure Security Center](secure-score-security-controls.md).


## What's the difference between threats detected and alerted on by Microsoft Security Response Center versus Azure Security Center?
The Microsoft Security Response Center (MSRC) performs select security monitoring of the Azure network and infrastructure and receives threat intelligence and abuse complaints from third parties. When MSRC becomes aware that customer data has been accessed by an unlawful or unauthorized party or that the customer’s use of Azure does not comply with the terms for Acceptable Use, a security incident manager notifies the customer. Notification typically occurs by sending an email to the security contacts specified in Azure Security Center or the Azure subscription owner if a security contact is not specified.

Security Center is an Azure service that continuously monitors the customer’s Azure environment and applies analytics to automatically detect a wide range of potentially malicious activity. These detections are surfaced as security alerts in the Security Center dashboard.