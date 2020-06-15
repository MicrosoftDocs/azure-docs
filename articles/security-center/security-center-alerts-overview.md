---
title: Security alerts in Azure Security Center | Microsoft Docs
description: This topic explains what security alerts are, and the different types available in Azure Security Center.
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.assetid: 1b71e8ad-3bd8-4475-b735-79ca9963b823
ms.service: security-center
ms.topic: conceptual
ms.date: 03/15/2020
ms.author: memildin
---
# Security alerts in Azure Security Center

In Azure Security Center, there are a variety of alerts for many different resource types. Security Center generates alerts for resources deployed on Azure, and also for resources deployed on on-premises and hybrid cloud environments.

Security alerts are triggered by advanced detections and are available only in the Standard Tier of Azure Security Center. A free trial is available. You can upgrade from the Pricing Tier selection in the [Security Policy](security-center-pricing.md). Visit [Security Center page](https://azure.microsoft.com/pricing/details/security-center/) to learn more about pricing.

## Responding to today's threats <a name="respond-threats"> </a>

There have been significant changes in the threat landscape over the last 20 years. In the past, companies typically only had to worry about web site defacement by individual attackers who were mostly interested in seeing "what they could do". Today's attackers are much more sophisticated and organized. They often have specific financial and strategic goals. They also have more resources available to them, as they may be funded by nation states or organized crime.

These changing realities have led to an unprecedented level of professionalism in the attacker ranks. No longer are they interested in web defacement. They are now interested in stealing information, financial accounts, and private data – all of which they can use to generate cash on the open market or to leverage a particular business, political, or military position. Even more concerning than those attackers with a financial objective are the attackers who breach networks to do harm to infrastructure and people.

In response, organizations often deploy various point solutions, which focus on defending either the enterprise perimeter or endpoints by looking for known attack signatures. These solutions tend to generate a high volume of low fidelity alerts, which require a security analyst to triage and investigate. Most organizations lack the time and expertise required to respond to these alerts – so many go unaddressed.  

In addition, attackers have evolved their methods to subvert many signature-based defenses and [adapt to cloud environments](https://azure.microsoft.com/blog/detecting-threats-with-azure-security-center/). New approaches are required to more quickly identify emerging threats and expedite detection and response.

## What are security alerts and security incidents? 

**Alerts** are the notifications that Security Center generates when it detects threats on your resources. Security Center prioritizes and lists the alerts, along with the information needed for you to quickly investigate the problem. Security Center also provides recommendations for how you can remediate an attack.

**A security incident** is a collection of related alerts, instead of listing each alert individually. Security Center uses [Cloud Smart Alert Correlation](security-center-alerts-cloud-smart.md) to correlate different alerts and low fidelity signals into security incidents.

Using incidents, Security Center provides you with a single view of an attack campaign and all of the related alerts. This view enables you to quickly understand what actions the attacker took, and what resources were affected. For more information, see [Cloud smart alert correlation](security-center-alerts-cloud-smart.md).



## How does Security Center detect threats? <a name="detect-threats"> </a>

Microsoft security researchers are constantly on the lookout for threats. Because of Microsoft's global presence in the cloud and on-premises, they have access to an expansive set of telemetry. The wide-reaching and diverse collection of datasets enables the discovering of new attack patterns and trends across its on-premises consumer and enterprise products, as well as its online services. As a result, Security Center can rapidly update its detection algorithms as attackers release new and increasingly sophisticated exploits. This approach helps you keep pace with a fast moving threat environment.

To detect real threats and reduce false positives, Security Center collects, analyzes, and integrates log data from your Azure resources and the network. It also works with connected partner solutions, like firewall and endpoint protection solutions. Security Center analyzes this information, often correlating information from multiple sources, to identify threats.

![Security Center Data collection and presentation](./media/security-center-alerts-overview/security-center-detection-capabilities.png)

Security Center employs advanced security analytics, which go far beyond signature-based approaches. Breakthroughs in big data and [machine learning](https://azure.microsoft.com/blog/machine-learning-in-azure-security-center/) technologies are leveraged to evaluate events across the entire cloud fabric – detecting threats that would be impossible to identify using manual approaches and predicting the evolution of attacks. These security analytics include:

* **Integrated threat intelligence**: Microsoft has an immense amount of global threat intelligence. Telemetry flows in from multiple sources, such as Azure, Office 365, Microsoft CRM online, Microsoft Dynamics AX, outlook.com, MSN.com, the Microsoft Digital Crimes Unit (DCU), and Microsoft Security Response Center (MSRC). Researchers also receive threat intelligence information that is shared among major cloud service providers and feeds from other third parties. Azure Security Center can use this information to alert you to threats from known bad actors.

* **Behavioral analytics**: Behavioral analytics is a technique that analyzes and compares data to a collection of known patterns. However, these patterns are not simple signatures. They are determined through complex machine learning algorithms that are applied to massive datasets. They are also determined through careful analysis of malicious behaviors by expert analysts. Azure Security Center can use behavioral analytics to identify compromised resources based on analysis of virtual machine logs, virtual network device logs, fabric logs, and other sources.

* **Anomaly detection**: Azure Security Center also uses anomaly detection to identify threats. In contrast to behavioral analytics (which depends on known patterns derived from large data sets), anomaly detection is more "personalized" and focuses on baselines that are specific to your deployments. Machine learning is applied to determine normal activity for your deployments and then rules are generated to define outlier conditions that could represent a security event.

## How are alerts classified?

Security Center assigns a severity to alerts, to help you prioritize the order in which you attend to each alert, so that when a resource is compromised, you can get to it right away. 
The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

> [!NOTE]
> Alert severity is displayed differently in the portal and versions of the REST API that predate 01-01-2019. If you're using an older version of the API, upgrade for the consistent experience described below.

- **High:** There is a high probability that your resource is compromised. 
You should look into it right away. Security Center has high confidence in both the malicious intent and in the findings used to issue the alert. For example, an alert that detects the execution of a known malicious tool such as Mimikatz, a common tool used for credential theft.
- **Medium:** This is probably a suspicious activity may indicate that a resource is compromised.
Security Center's confidence in the analytic or finding is medium and the confidence of the malicious intent is medium to high. These would usually be machine learning or anomaly-based detections. For example, a sign-in attempt from an anomalous location.
- **Low:** This might be a benign positive or a blocked attack.
   * Security Center is not confident enough that the intent is malicious and the activity may be innocent. For example, log clear is an action that may happen when an attacker tries to hide their tracks, but in many cases is a routine operation performed by admins.
   * Security Center doesn't usually tell you when attacks were blocked, unless it's an interesting case that we suggest you look into. 
- **Informational:** You will only see informational alerts when you drill down into a security incident, or if you use the REST API with a specific alert ID. An incident is typically made up of a number of alerts, some of which may appear on their own to be only informational, but in the context of the other alerts may be worthy of a closer look. 

## Continuous monitoring and assessments

Azure Security Center benefits from having security research and data science teams throughout Microsoft who continuously monitor for changes in the threat landscape. This includes the following initiatives:

* **Threat intelligence monitoring**: Threat intelligence includes mechanisms, indicators, implications, and actionable advice about existing or emerging threats. This information is shared in the security community and Microsoft continuously monitors threat intelligence feeds from internal and external sources.
* **Signal sharing**: Insights from security teams across Microsoft's broad portfolio of cloud and on-premises services, servers, and client endpoint devices are shared and analyzed.
* **Microsoft security specialists**: Ongoing engagement with teams across Microsoft that work in specialized security fields, like forensics and web attack detection.
* **Detection tuning**: Algorithms are run against real customer data sets and security researchers work with customers to validate the results. True and false positives are used to refine machine learning algorithms.

These combined efforts culminate in new and improved detections, which you can benefit from instantly – there's no action for you to take.


## Next steps

In this article, you learned about the different types of alerts available in Security Center. For more information, see:

* [Threat protection in Azure Security Center](threat-protection.md) - For a brief description of the sources of the security alerts displayed by Azure Security Center 
* **Security alerts in Azure Activity Log** - In addition to being available in the Azure portal or programmatically, Security alerts and incidents are audited as events in [Azure Activity Log](https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-view). For more information on the event schema, see [Security Alerts in Azure Activity log](https://go.microsoft.com/fwlink/?linkid=2114113)

