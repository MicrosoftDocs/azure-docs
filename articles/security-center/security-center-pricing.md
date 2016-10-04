<properties
   pageTitle="Security Center pricing | Microsoft Azure"
   description="This article provides information on pricing for Azure Security Center."
   services="security-center"
   documentationCenter="na"
   authors="TerryLanfear"
   manager="MBaldwin"
   editor=""/>

<tags
   ms.service="security-center"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="10/01/2016"
   ms.author="terrylan"/>

# Azure Security Center pricing

Azure Security Center helps you prevent, detect, and respond to threats with increased visibility into and control over the security of your Azure resources. It provides integrated security monitoring and policy management across your Azure subscriptions, helps detect threats that might otherwise go unnoticed, and works with a broad ecosystem of security solutions.

## Pricing tiers

Azure Security Center is offered in two tiers: free and standard. The free tier is automatically enabled on all Azure subscriptions. A 90 day free trial is available for the standard tier. At the end of 90 days, should you choose to continue using the service, you will automatically be charged for usage at the standard tier rate.

> [AZURE.NOTE] Security Center uses Azure storage to save security data generated from your protected nodes. Costs associated with this storage are not included in the price of the service and will be charged separately at regular [Azure storage rates](https://azure.microsoft.com/pricing/details/storage/blobs/). Storage charges apply even during the trial.

The following table summarizes the features available in each tier.  Click the link in the table for more information about the feature and to see screen shots of what you gain with that feature.

| **Features:** | Free | Standard |
|-----|-----|-----|
| [Security policy, assessment, and recommendations](#security-policy-assessment-and-recommendations) | X | X |
| [Connected partner solutions](#connected-partner-solutions) | X | X |
| [Basic security alerting](#security-alerting) | X | X |
| **Advanced threat detection:** | -- | X |
|     [Threat intelligence](#threat-intelligence) | -- | X |
|     [Behavioral analysis](#behavioral-analysis) | -- | X |
|     [Crash analysis](#crash-analysis) | -- | X |
|     [Anomaly detection](#anomaly-detection) | -- | X |
| **Data and Price:** | | |
| Daily data allocation | Not applicable | 500 MB per day |
| Price | Free | $15/node/month |

### Details on how nodes are counted

A node is any Azure resource that is monitored by the service. Currently, only virtual machines are counted (each Azure VM counts as one node), but as additional security monitoring capabilities are enabled for other types of services, like Azure Cloud Services or SQL databases, we may begin counting these resources as well.

Nodes are counted and prorated daily.

## Free tier

Security Center is available at the free tier on all Azure subscriptions. You do not need to take steps to enable the free tier.

### Security policy, assessment, and recommendations

Security Center lets you define policies for your Azure subscriptions and resource groups based on your company’s security requirements, the types of applications that you use, and the sensitivity of your data.

You can monitor the security health of your Azure resources.

You can collect and analyze security data from your Azure resources, the network, and partner solutions integrated with Azure.

Security center provides you with policy-driven security recommendations to guide you through the process of implementing needed controls.

### Connected partner solutions

Security Center enables you to deploy security services and appliances from Microsoft and partners.

### Security alerting

Security Center automatically collects, analyzes, and integrates log data from your Azure resources, the network, and connected partner solutions, like firewall and endpoint protection solutions, to detect real threats and reduce false positives. Select the Security alerts tile to see prioritized security incidents and alerts with insights into the source of the attack and impacted resources.

## Standard tier

The Standard tier of Security Center provides all features of the Free tier plus advanced threat detection. Advanced threat detection helps identify active threats targeting your Azure resources and provides you with the insights needed to respond quickly.

Security Center employs advanced security analytics, which go far beyond signature-based approaches. Breakthroughs in big data and machine learning technologies are leveraged to evaluate events across the entire cloud fabric – detecting threats that would be impossible to identify using manual approaches and predicting the evolution of attacks.

Let’s look at the security analytics that come with the Stier.

### Threat intelligence

Threat intelligence looks for known bad actors by leveraging global threat intelligence from Microsoft products and services, the Microsoft Digital Crimes Unit (DCU), the Microsoft Security Response Center (MSRC), and external feeds.

### Behavioral analysis

Behavioral analysis applies known patterns to discover malicious behavior.

### Crash analysis

### Anomaly detection

Anomaly detection uses statistical profiling to build a historical baseline. It alerts on deviations from established baselines that conform to a potential attack vector.

## See also

To learn more about Security Center, see the following:

- [Setting security policies in Azure Security Center](security-center-policies.md) -- Learn how to configure security policies.
- [Managing security recommendations in Azure Security Center](security-center-recommendations.md) -- Learn how recommendations help you protect your Azure resources.
- [Security health monitoring in Azure Security Center](security-center-monitoring.md) -- Learn how to monitor the health of your Azure resources.
- [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md) -- Learn how to manage and respond to security alerts.
- [Monitoring partner solutions with Azure Security Center](security-center-partner-solutions.md) -- Learn how to monitor the health status of your partner solutions.
- [Azure Security Center FAQ](security-center-faq.md) -- Find frequently asked questions about using the service.
- [Azure Security blog](http://blogs.msdn.com/b/azuresecurity/) -- Find blog posts about Azure security and compliance.
