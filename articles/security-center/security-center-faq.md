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
   ms.date="12/10/2015"
   ms.author="terrylan"/>

# Azure Security Center frequently asked questions

This FAQ (frequently asked questions) article answers questions about Azure Security Center.

> [AZURE.NOTE] The information in this document applies to the preview release of Azure Security Center.

## General questions

### What is Security Center?
 Security Center helps you prevent, detect, and respond to threats with increased visibility into and control over the security of your Azure resources. It provides integrated security monitoring and policy management across your subscriptions, helps detect threats that might otherwise go unnoticed, and works with a broad ecosystem of security solutions.

### How do I get Security Center?
 Security Center is enabled with your Microsoft Azure subscription and accessed  from the [Azure portal](https://azure.microsoft.com/features/azure-portal/). ([Sign in to the portal](https://portal.azure.com), select **Browse**, and then scroll to **Security Center**). You may see some security recommendations in the dashboard right away. That is because the service can assess the security state of some controls based on their configuration in Azure. In order to access the full set of security monitoring, recommendations, and alerting capabilities, you will need to [enable data collection](#data-collection).  

## Billing

### How does billing work for Security Center?
See [Security Center Pricing](https://azure.microsoft.com/pricing/details/security-center/) for information.

## Data collection

### How do I enable data collection?<a name=data-collection></a>
You can enable data collection for your Azure subscriptions in the security policy. To enable data collection, [sign in to the Azure portal](https://portal.azure.com), select **Browse**, select **Security Center**, and then select **Security policy**. Set **Data collection** to **On** and configure the storage accounts where you want data to be collected (see the question “[Where is my data stored?](#where-is-my-data-stored)”). When **Data collection** is enabled, it automatically collects security configuration and event information from all supported virtual machines in the subscription.

### What happens when I enable data collection?
Data collection is enabled via the Azure Monitoring Agent and the Azure Security Monitoring extension. The Azure Security Monitoring extension scans for various relevant security configurations and events them into [Event Tracing for Windows](https://msdn.microsoft.com/library/windows/desktop/bb968803.aspx) (ETW) traces.

In addition, the operating system raises event log events on all activities.  The Azure Security Monitoring Agent reads event log entries and ETW traces, and then copies them to your storage account for analysis.  This is the storage account that you configured in the security policy. For more information about the storage account, see the question “[Where is my data stored?](#where-is-my-data-stored)”

### Does the Monitoring Agent or Security Monitoring extension impact the performance of my servers?
The agent and extension consume a nominal amount of system resources and should have little impact on performance.

### How do I roll back if I no longer want data collection to be enabled?
You can disable data collection for a subscription in the security policy. ([Sign in to the Azure portal](https://portal.azure.com), select **Browse**, select **Security Center**, and then select **Security policy**.)  When you click on a subscription, a new blade opens and gives you the option to turn off data collection. Select the **Delete agents** option in the top ribbon to remove agents from existing virtual machines.

### Where is my data stored?<a name=where-is-my-data-stored></a>
For each region in which you have virtual machines running, you choose the storage account where data collected from those virtual machines is stored. This makes it easy for you to keep data in the same geographic area for privacy and data sovereignty purposes.

You choose the storage account for a subscription in the security policy. ([Sign in to the Azure portal](https://portal.azure.com), select **Browse**, select **Security Center**, and then select **Security policy**.) When you click on a subscription, a new blade opens. Click **Choose storage accounts** to select a region.  Data that's collected is logically isolated from other customers’ data for security reasons.

To learn more about Azure Storage and storage accounts, see [Storage Documentation](https://azure.microsoft.com/documentation/services/storage/) and [About Azure storage accounts](../storage/storage-create-storage-account.md).

## Using Security Center

### What is a security policy?
A security policy defines the set of controls that are recommended for resources within the specified subscription. In Security Center, you define policies for your Azure subscriptions according to your company's security requirements, the type of applications used, and the sensitivity of the data in each subscription.

For example, resources used for development or testing may have different security requirements than those used for production applications. Likewise, applications with regulated data like PII (personally identifiable information) may require a higher level of security. The security policies enabled in Security Center will drive security recommendations and monitoring. To learn more about security policies, see [Security health monitoring in Azure Security Center](security-center-monitoring.md).

### Who can modify a security policy?
Security policies are configured for each subscription. To modify a security policy, you must be either the owner of that subscription or a contributor to it.

To learn how to configure a security policy, see [Setting security policies in Azure Security Center](security-center-policies.md).

### What is a security recommendation?
 Security Center analyzes the security state of your Azure resources. When potential security vulnerabilities are identified, Security Center creates recommendations. The recommendations guide you through the process of configuring the needed control. Examples are:

- Provisioning antimalware programs to help identify and remove malicious software
- Configuring [network security groups](../virtual-network/virtual-networks-nsg.md) and rules to control traffic to virtual machines
- Provisioning web application firewalls to help defend against attacks targeting your web applications
- Deploying missing system updates
- Addressing OS configurations that do not match the recommended baselines

Only recommendations that are enabled in security policies are shown here.

### How can I see the current security state of my Azure resources?
The **Resources health** tile on the **Security Center** blade shows the overall security posture of your environment broken down by virtual machines, web applications, and other resources. Each resource has an indicator that shows if any potential security vulnerabilities have been identified. Clicking the **Resources health** tile displays your resources and identifies where attention is required or issues may exist.

### What triggers a security alert?
 Security Center automatically collects, analyzes, and fuses log data from your Azure resources, the network, and partner solutions like antimalware programs and firewalls. When Security Center detects threats, a security alert is created. Examples include detection of:

- Compromised virtual machines communicating with known malicious IP addresses.
- Advanced malware detected by using Windows error reporting.
- Brute force attacks against virtual machines.
- Security alerts from integrated partner security solutions such as antimalware programs or web application firewalls.

### How are permissions handled in Security Center?
 Security Center supports role-based access. To learn more about role-based access control (RBAC) in Azure, see [Azure Active Directory role-based access control](../active-directory/role-based-access-control-configure.md).

When users open Security Center, the only recommendations and alerts that they'll see are related to resources that they have access to. This means that users will only see items that are related to resources for which they are an owner, contributor, or reader for the subscription or resource group that a resource belongs to.

To edit a security policy, you must be either the owner of the subscription or a contributor to it.

### What types of virtual machines are supported?
Both [classic and Resource Manager](../azure-classic-rm.md) virtual machines are supported, including virtual machines that are part of Azure Service Fabric clusters.

Access control list recommendations currently apply to classic virtual machines. Network security group rules, along with recommendations for the installation of web application firewalls, currently apply only to Resource Manager virtual machines.

### Are Linux virtual machines supported?
Azure Security Center offers baseline monitoring for Linux virtual machines (Ubuntu versions 12.04, 14.04, 14.10, and 15.04 only). In the future, additional security health monitoring and data collection/analysis will be available, as well as support for additional Linux distros.
