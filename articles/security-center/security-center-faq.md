<properties
   pageTitle="Azure Security Center frequently asked questions (FAQ) | Microsoft Azure"
   description="This FAQ answers questions about Azure Security Center."
   services="security-center"
   documentationCenter="na"
   authors="TerryLanfear"
   manager="StevenPo"
   editor=""/>

<tags
   ms.service="security-center"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="03/02/2016"
   ms.author="terrylan"/>

# Azure Security Center frequently asked questions (FAQ)

This FAQ answers questions about Azure Security Center, a service that helps you prevent, detect and respond to threats with increased visibility into and control over the security of your Microsoft Azure resources.

> [AZURE.NOTE] The information in this document applies to the preview release of Azure Security Center.

## General questions

### What is Azure Security Center?
Azure Security Center helps you prevent, detect, and respond to threats with increased visibility into and control over the security of your Azure resources. It provides integrated security monitoring and policy management across your subscriptions, helps detect threats that might otherwise go unnoticed, and works with a broad ecosystem of security solutions.

### How do I get Azure Security Center?
Azure Security Center is enabled with your Microsoft Azure subscription and accessed from the [Azure portal](https://azure.microsoft.com/features/azure-portal/). ([Sign in to the portal](https://portal.azure.com), select **Browse**, and scroll to **Security Center**). You may see some security recommendations in the dashboard right away. That is because the service can assess the security state of some controls based on their configuration in Azure. In order to light up the full set of security monitoring, recommendations and alerting capabilities, you will need to [enable Data Collection](#data-collection).  

## Billing

### How does billing work for Azure Security Center?
See [Security Center Pricing](https://azure.microsoft.com/pricing/details/security-center/) for information.

## Data collection

### How do I enable data collection?<a name=data-collection></a>
You can enable data collection for your Azure subscription(s) in the Security policy. To enable data collection, [sign in to the Azure portal](https://portal.azure.com), select **Browse**, select **Security Center**, and select **Security policy**. Set **Data collection** to **On** and configure the storage accounts where you want data to be collected to (see question “[Where is my data stored?](#where-is-my-data-stored)”). When **Data collection** is enabled, it automatically collects security configuration and event information from all supported virtual machines in the subscription.

> [AZURE.NOTE] Security policies can be set at the Azure subscription level and resource group level but configuration of data collection occurs at the subscription level only.

### What happens when I enable data collection?
Data collection is enabled via the Azure Monitoring Agent and the Azure Security Monitoring extension. The Azure Security Monitoring extension scans for various security relevant configuration and sends it into [Event Tracing for Windows](https://msdn.microsoft.com/library/windows/desktop/bb968803.aspx) (ETW) traces. In addition, the operating system creates event log entries.  The Azure Monitoring Agent reads event log entries and ETW traces and copies them to your storage account for analysis.  This is the storage account you configured in the security policy. For more information about the storage account, see question “[Where is my data stored?](#where-is-my-data-stored)”

### Does the Monitoring Agent or Security Monitoring extension impact the performance of my server(s)?
The agent and extension consumes a nominal amount of system resources and should have little impact on the performance.

### How do I roll back if I no longer want Data Collection to be enabled?
You can disable **Data collection** for a subscription in the Security policy. ([Sign in to the Azure portal](https://portal.azure.com), select **Browse**, select **Security Center**, and select **Security policy**.)  When you select a subscription, a new blade opens and provides you the option to turn Data collection off. Select the **Delete agents** option in the top ribbon to remove agents from existing virtual machines.

> [AZURE.NOTE] Security policies can be set at the Azure subscription level and resource group level but you must select a subscription to turn Data collection off.

### Where is my data stored?<a name=where-is-my-data-stored></a>
For each region in which you have virtual machines running, you choose the storage account where data collected from those virtual machines is stored. This makes it easy for you to keep data in the same geographic area for privacy and data sovereignty purposes. You choose the storage account for a subscription in the Security policy. ([Sign in to the Azure portal](https://portal.azure.com), select **Browse**, select **Security Center**, and select **Security policy**.) When you click on a subscription, a new blade opens. Select **Choose storage accounts** to select a region.  Data collected is logically isolated from other customers’ data for security reasons.

> [AZURE.NOTE] Security policies can be set at the Azure subscription level and resource group level but selecting a region for your storage account occurs at the subscription level only.

To learn more about Azure storage and storage accounts, see [Storage Documentation](https://azure.microsoft.com/documentation/services/storage/) and [About Azure storage accounts](../storage/storage-create-storage-account.md).

## Using Azure Security Center

### What is a security policy?
A security policy defines the set of controls which are recommended for resources within the specified subscription or resource group. In Azure Security Center, you define policies for your Azure subscriptions and resource groups according to your company's security requirements and the type of applications or sensitivity of the data in each subscription.

For example, resources used for development or test may have different security requirements than those used for production applications. Likewise, applications with regulated data like PII (Personally Identifiable Information) may require a higher level of security. The security policies enabled in Azure Security Center will drive security recommendations and monitoring. To learn more about security policies, see [Security health monitoring in Azure Security Center](security-center-monitoring.md).

> [AZURE.NOTE] In case of a conflict between subscription level policy and resource group level policy, the resource group level policy takes precedence.

### Who can modify a security policy?
Security policies are configured for each subscription or resource group. To modify a security policy at the subscription level or resource group level, you must be an Owner or Contributor of that subscription.

To learn how to configure a security policy, see [Setting security policies in Azure Security Center](security-center-policies.md).

### What is a security recommendation?
Azure Security Center analyzes the security state of your Azure resources. When potential security vulnerabilities are identified, recommendations are created. The recommendations guide you through the process of configuring the needed control. Examples are:

- Provisioning of antimalware to help identify and remove malicious software
- Configuring [Network Security Groups](../virtual-network/virtual-networks-nsg.md) and rules to control traffic to virtual machines
- Provisioning of a web application firewall to help defend against attacks targeting your web applications
- Deploying missing system updates
- Addressing OS configurations that do not match the recommended baselines

Only recommendations that are enabled in Security Policies are shown here.

### How can I see the current security state of my Azure resources?
A **Resources health** tile on the **Security Center** blade shows the overall security posture of your environment broken down by virtual machines, web applications, and other resources. Each resource has an indicator showing if any potential security vulnerabilities have been identified. Clicking the Resources health tile displays your resources and identifies where attention is required or issues may exist.

### What triggers a security alert?
Azure Security Center automatically collects, analyzes and fuses log data from your Azure resources, the network, and partner solutions like antimalware and firewalls. When threats are detected, a security alert is created. Examples include detection of:

- Compromised virtual machines communicating with known malicious IP addresses
- Advanced malware detected using Windows error reporting
- Brute force attacks against virtual machines
- Security alerts from integrated partner security solutions such as Anti-Malware or Web Application Firewalls

### How are permissions handled in Azure Security Center?
Azure Security Center supports role based access. To learn more about role-based access control (RBAC) in Azure, see [Azure Active Directory Role-based Access Control](../active-directory/role-based-access-control-configure.md).

When a user opens Azure Security Center, only recommendations and alerts that are related to resources the user has access to will be seen.  This means that users will only see items related to resources where the user is assigned the role of Owner, Contributor, or Reader to the subscription or resource group that a resource belongs to.

To edit a security policy, you must be an Owner or Contributor of the subscription.

### What types of virtual machines will be supported?
Virtual machines created using both the [classic and Resource Manager deployment models](../azure-classic-rm.md) are supported, including virtual machines that are part of Azure Service Fabric clusters.

Access Control List recommendations currently apply to virtual machines (classic). Network Security Groups currently only apply to virtual machines (Resource Manager).

### Are Linux virtual machines supported?
Azure Security Center offers baseline monitoring for Linux virtual machines (Ubuntu versions 12.04, 14.04, 14.10, and 15.04 only). In the future, additional security health monitoring and data collection/analysis will be available, as well as support for additional Linux distros.
