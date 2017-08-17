---
title: Azure Security Center frequently asked questions (FAQ) | Microsoft Docs
description: This FAQ answers questions about Azure Security Center.
services: security-center
documentationcenter: na
author: TerryLanfear
manager: MBaldwin
editor: ''

ms.assetid: be2ab6d5-72a8-411f-878e-98dac21bc5cb
ms.service: security-center
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/16/2017
ms.author: terrylan

---
# Azure Security Center frequently asked questions (FAQ)
This FAQ answers questions about Azure Security Center, a service that helps you prevent, detect, and respond to threats with increased visibility into and control over the security of your Microsoft Azure resources.

> [!NOTE]
> Beginning in early June 2017, Security Center will use the Microsoft Monitoring Agent to collect and store data. To learn more, see [Azure Security Center Platform Migration](security-center-platform-migration.md). The information in this article represents Security Center functionality after transition to the Microsoft Monitoring Agent.
>
>

## General questions
### What is Azure Security Center?
Azure Security Center helps you prevent, detect, and respond to threats with increased visibility into and control over the security of your Azure resources. It provides integrated security monitoring and policy management across your subscriptions, helps detect threats that might otherwise go unnoticed, and works with a broad ecosystem of security solutions.

### How do I get Azure Security Center?
Azure Security Center is enabled with your Microsoft Azure subscription and accessed from the [Azure portal](https://azure.microsoft.com/features/azure-portal/). ([Sign in to the portal](https://portal.azure.com), select **Browse**, and scroll to **Security Center**).  

## Billing
### How does billing work for Azure Security Center?
Security Center is offered in two tiers:

The **Free tier** provides visibility into the security state of your Azure resources, basic security policy, security recommendations, and integration with security products and services from partners.

The **Standard tier** adds advanced threat detection capabilities, including threat intelligence, behavioral analysis, anomaly detection, security incidents, and threat attribution reports. The Standard tier is free for the first 60 days. Should you choose to continue to use the service beyond 60 days, we automatically start to charge for the service.  To upgrade, select Pricing Tier in the [security policy](security-center-policies.md#set-security-policies). To learn more, see [Security Center pricing](security-center-pricing.md).

## Permissions
Azure Security Center uses [Role-Based Access Control (RBAC)](../active-directory/role-based-access-control-configure.md), which provides [built-in roles](../active-directory/role-based-access-built-in-roles.md) that can be assigned to users, groups, and services in Azure.

Security Center assesses the configuration of your resources to identify security issues and vulnerabilities. In Security Center, you only see information related to a resource when you are assigned the role of Owner, Contributor, or Reader for the subscription or resource group that a resource belongs to.

See [Permissions in Azure Security Center](security-center-permissions.md) to learn more about roles and allowed actions in Security Center.

## Data collection
Security Center collects data from your virtual machines to assess their security state, provide security recommendations, and alert you to threats. When you first access Security Center, data collection is enabled on all virtual machines in your subscription. You can also enable data collection in the Security Center policy.

### How do I disable data collection?
If you are using the Azure Security Center Free tier, you can disable data collection from virtual machines at any time. Data collection is required for subscriptions on the Standard tier. You can disable data collection for a subscription in the Security policy. ([Sign in to the Azure portal](https://portal.azure.com), select **Browse**, select **Security Center**, and select **Policy**.)  When you select a subscription, a new blade opens and provides you the option to turn off **Data collection**.

### How do I enable data collection?
You can enable data collection for your Azure subscription in the Security policy. To enable data collection. [Sign in to the Azure portal](https://portal.azure.com), select **Browse**, select **Security Center**, and select **Policy**. Set **Data collection** to **On**.

### What happens when data collection is enabled?
When data collection is enabled, the Microsoft Monitoring Agent is automatically provisioned on all existing and any new supported virtual machines that are deployed in the subscription.

### Does the Monitoring Agent impact the performance of my servers?
The agent consumes a nominal amount of system resources and should have little impact on the performance. For more information on performance impact and the agent and extension, see the [planning and operations guide](security-center-planning-and-operations-guide.md#data-collection-and-storage).

### Where is my data stored?
Data collected from this agent is stored in either an existing Log Analytics workspace associated with your subscription or a new workspace. For more information, see [Data Security](security-center-data-security.md).

## Using Azure Security Center
### What is a security policy?
A security policy defines the set of controls that are recommended for resources within the specified subscription. In Azure Security Center, you define policies for your Azure subscriptions according to your company's security requirements and the type of applications or sensitivity of the data in each subscription.

The security policies enabled in Azure Security Center drive security recommendations and monitoring. To learn more about security policies, see [Security health monitoring in Azure Security Center](security-center-monitoring.md).

### Who can modify a security policy?
To modify a security policy, you must be a Security Administrator or an Owner or Contributor of that subscription.

To learn how to configure a security policy, see [Setting security policies in Azure Security Center](security-center-policies.md).

### What is a security recommendation?
Azure Security Center analyzes the security state of your Azure resources. When potential security vulnerabilities are identified, recommendations are created. The recommendations guide you through the process of configuring the needed control. Examples are:

* Provisioning of antimalware to help identify and remove malicious software
* Configuring [Network Security Groups](../virtual-network/virtual-networks-nsg.md) and rules to control traffic to virtual machines
* Provisioning of a web application firewall to help defend against attacks targeting your web applications
* Deploying missing system updates
* Addressing OS configurations that do not match the recommended baselines

Only recommendations that are enabled in Security Policies are shown here.

### How can I see the current security state of my Azure resources?
The **Security Center Overview** blade shows the overall security posture of your environment broken down by Compute, Networking, Storage & data, and Applications. Each resource type has an indicator showing if any potential security vulnerabilities have been identified. Clicking each tile displays a list of security issues identified by Security Center, along with an inventory of the resources in your subscription.

### What triggers a security alert?
Azure Security Center automatically collects, analyzes, and fuses log data from your Azure resources, the network, and partner solutions like antimalware and firewalls. When threats are detected, a security alert is created. Examples include detection of:

* Compromised virtual machines communicating with known malicious IP addresses
* Advanced malware detected using Windows error reporting
* Brute force attacks against virtual machines
* Security alerts from integrated partner security solutions such as Anti-Malware or Web Application Firewalls

### What's the difference between threats detected and alerted on by Microsoft Security Response Center versus Azure Security Center?
The Microsoft Security Response Center (MSRC) performs select security monitoring of the Azure network and infrastructure and receives threat intelligence and abuse complaints from third parties. When MSRC becomes aware that customer data has been accessed by an unlawful or unauthorized party or that the customer’s use of Azure does not comply with the terms for Acceptable Use, a security incident manager notifies the customer. Notification typically occurs by sending an email to the security contacts specified in Azure Security Center or the Azure subscription owner if a security contact is not specified.

Security Center is an Azure service that continuously monitors the customer’s Azure environment and applies analytics to automatically detect a wide range of potentially malicious activity. These detections are surfaced as security alerts in the Security Center dashboard.

### Which Azure resources are monitored by Azure Security Center?
Azure Security Center monitors the following Azure resources:

* Virtual machines (VMs) (including [Cloud Services](../cloud-services/cloud-services-choose-me.md))
* Azure Virtual Networks
* Azure SQL service
* Azure Storage account
* Azure Web Apps (in [App Service Environment](../app-service/app-service-app-service-environments-readme.md))
* Partner solutions integrated with your Azure subscription such as a web application firewall on VMs and on [App Service Environment](../app-service/app-service-app-service-environments-readme.md)

## Virtual Machines
### What types of virtual machines are supported?
Monitoring and recommendations are available for virtual machines (VMs) created using both the [classic and Resource Manager deployment models](../azure-classic-rm.md).

See [Supported platforms in Azure Security Center](security-center-os-coverage.md) for a list of supported platforms.

### Why doesn't Azure Security Center recognize the antimalware solution running on my Azure VM?
Azure Security Center has visibility into antimalware installed through Azure extensions. For example, Security Center is not able to detect antimalware that was pre-installed on an image you provided or if you installed antimalware on your virtual machines using your own processes (such as configuration management systems).

### Why do I get the message "Missing Scan Data" for my VM?
This message appears when there is no scan data for a VM. It can take some time (less than an hour) for scan data to populate after Data Collection is enabled in Azure Security Center. After the initial population of scan data, you may receive this message because there is no scan data at all or there is no recent scan data. Scans do not populate for a VM in a stopped state. This message could also appear if scan data has not populated recently (in accordance with the retention policy for the Windows agent, which has a default value of 30 days).

### Why do I get the message "VM Agent is Missing?"
The VM Agent must be installed on VMs to enable Data Collection. The VM Agent is installed by default for VMs that are deployed from the Azure Marketplace. For information on how to install the VM Agent on other VMs, see the blog post [VM Agent and Extensions](https://azure.microsoft.com/blog/vm-agent-and-extensions-part-2/).
