<properties
   pageTitle="Introduction to Azure Security Center | Microsoft Azure"
   description="Learn about Azure Security Center, its key capabilities, and how it works."
   services="security-center"
   documentationCenter="na"
   authors="TerryLanfear"
   manager="stevenpo"
   editor=""/>

<tags
   ms.service="security-center"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="12/02/2015"
   ms.author="terrylan"/>

# Introduction to Azure Security Center

Learn about Azure Security Center, its key capabilities, and how it works.

> [AZURE.NOTE] The information in this document applies to the preview release of Azure Security Center. This is an introduction to the service using an example deployment.

## What is Azure Security Center?
Azure Security Center helps you prevent, detect, and respond to threats with increased visibility into and control over the security of your Azure resources. It provides integrated security monitoring and policy management across your Azure subscriptions, helps detect threats that might otherwise go unnoticed, and works with a broad ecosystem of security solutions.

##	Key capabilities
Azure Security Center delivers easy and effective threat prevention, detection, and response capabilities that are built-in to Azure. Key capabilities are:

| | |
|----- |-----|
| Prevent | Monitors the security state of your Azure resources |
| | Defines policies for your Azure subscriptions based on your company’s security requirements and the type of applications or sensitivity of your data |
| | Uses policy-driven security recommendations to guide service owners through the process of implementing needed controls |
| | Rapidly deploys security services and appliances from Microsoft and partners |
| Detect | Automatically collects and analyses security data from your Azure resources, the network, and partner solutions like antimalware and firewalls |
| | Leverages global threat intelligence from Microsoft products and services, Digital Crime and Incident Response Centers, and external feeds |
| | Applies advanced analytics, including machine learning and behavioral analysis |
| Respond | Provides prioritized security incidents/alerts |
| | Offers insights into the source of the attack and impacted resources |
| | Suggests ways to stop the current attack and help prevent future attacks |

## Introductory walkthrough
Azure Security Center is accessed from the [Microsoft Azure preview portal](http://azure.microsoft.com/features/azure-portal/). To access, [sign in to the Azure preview portal](https://ms.portal.azure.com/), select **Browse**, and scroll to the **Security Center** option or select the **Security Center** tile you previously pinned to the Azure preview portal dashboard.

![][1]

From Azure Security Center, you can set security policies, monitor security configurations, and view security alerts.

### Security policies

You can define policies for your Azure subscriptions according to your company's security requirements and tailored to the type of applications or sensitivity of the data in each subscription. For example, resources used for development or test may have different security requirements than those used for production applications. Likewise, applications with regulated data like PII may require a higher level of security.

> [AZURE.NOTE] To edit a security policy, you must be an Owner or Contributor of the subscription.

Click the **Security policy** tile for a list of your subscriptions and choose a subscription to view the policy details.  

![][2]

**Data collection** (see above) enables data collection for a security policy. Enabling provides:
- Daily scanning of all supported virtual machines for security monitoring and recommendations
- Collection of security events for analysis and threat detection

**Show recommendations for:** (see above) lets you choose the security controls that you want to monitor and recommend based on the security needs of the resources within the subscription.

### Security recommendations

Azure Security Center analyzes the security state of your Azure resources to identify potential security vulnerabilities. A list of recommendations guides you through the process of configuring needed controls. Examples include:

- Provisioning of antimalware to help identify and remove malicious software
- Configuring Network Security Groups and rules to control traffic to virtual machines
- Provisioning of a web application firewall to help defend against attacks targeting your web applications
- Deploying missing system updates
- Addressing OS configurations that do not match the recommended baselines

Click the **Recommendations** tile for a list of recommendations. Click on each recommendation to view additional information or to take action to resolve it.

![][3]

### Resources health

The **Resources health** tile shows the overall security posture of the environment by resource type - virtual machines, web applications and other resources.   

Select a resource type on the **Resources health** tile to view more information (Virtual Machines in the example below), including a list of any potential security vulnerabilities that have been identified.

![][4]

### Security alerts

Azure Security Center automatically collects, analyzes and integrates log data from your Azure resources, the network, and partner solutions like antimalware and firewalls. When threats are detected, a Security alert is created. Examples include detection of:

- Compromised virtual machines communicating with known malicious IP addresses
- Advanced malware detected using Windows error reporting
- Brute Force attacks against virtual machines
- Security alerts from integrated antimalware and firewalls

Clicking the **Security alerts** tile displays a list of prioritized alerts.

![][5]

Selecting an alert shows more information about the attack and suggestions on how to remediate it.

![][6]

## Get started
To get started with Azure Security Center you must have a subscription to Microsoft Azure. Azure Security Center is enabled with your Azure subscription. If you do not have a subscription, you can sign up for a [free trial](https://azure.microsoft.com/pricing/free-trial).

Azure Security Center is accessed from the [Microsoft Azure preview portal](http://azure.microsoft.com/features/azure-portal/). See [Azure preview portal documentation](https://azure.microsoft.com/documentation/services/azure-portal/) to learn more.

[Getting started with Azure Security Center](security-center-get-started.md) quickly guides you through the security monitoring and policy management components of Azure Security Center.

## Next steps
In this document you were introduced to Azure Security Center, its key capabilities and how to get started. To learn more, see the following:

- [Setting security policies in Azure Security Center](security-center-policies.md) – Learn how to configure security policies
- [Implementing security recommendations in Azure Security Center](security-center-recommendations.md) – Learn how recommendations help you protect your Azure resources
- [Security health monitoring in Azure Security Center](security-center-monitoring.md) – Learn how to monitor the health of your Azure resources
- [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md) - Learn how to manage and respond to security alerts
- [Azure Security Center FAQ](security-center-faq.md) – Find frequently asked questions about using the service
- [Azure Security Blog](http://blogs.msdn.com/b/azuresecurity/) – Get the latest Azure security news and information

<!--Image references-->
[1]: ./media/security-center-intro/security-tile.PNG
[2]: ./media/security-center-intro/security-policy.png
[3]: ./media/security-center-intro/recommendations.png
[4]: ./media/security-center-intro/resources-health.png
[5]: ./media/security-center-intro/security-alert.png
[6]: ./media/security-center-intro/security-alert-detail.png
