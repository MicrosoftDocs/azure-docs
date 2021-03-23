---
title: Security alerts and incidents in Azure Security Center
description: Learn how Azure Security Center generates security alerts and correlates them into incidents.
author: memildin
manager: rkarlin
ms.service: security-center
ms.topic: conceptual
ms.date: 02/25/2021
ms.author: memildin
---
# Security alerts and incidents in Azure Security Center

Security Center generates alerts for resources deployed on your Azure, on-premises, and hybrid cloud environments.

Security alerts are triggered by advanced detections and are available only with Azure Defender. You can upgrade from the **Pricing & settings** page, as described in [Quickstart: Enable Azure Defender](enable-azure-defender.md). A free 30-day trial is available. For pricing details in your currency of choice and according to your region, see [Security Center pricing](https://azure.microsoft.com/pricing/details/security-center/).

## What are security alerts and security incidents? 

**Alerts** are the notifications that Security Center generates when it detects threats on your resources. Security Center prioritizes and lists the alerts, along with the information needed for you to quickly investigate the problem. Security Center also provides recommendations for how you can remediate an attack.

**A security incident** is a collection of related alerts, instead of listing each alert individually. Security Center uses [Cloud smart alert correlation](#cloud-smart-alert-correlation-in-azure-security-center-incidents) to correlate different alerts and low fidelity signals into security incidents.

Using incidents, Security Center provides you with a single view of an attack campaign and all of the related alerts. This view enables you to quickly understand what actions the attacker took, and what resources were affected.

## Respond to today's threats

There have been significant changes in the threat landscape over the last 20 years. In the past, companies typically only had to worry about web site defacement by individual attackers who were mostly interested in seeing "what they could do". Today's attackers are much more sophisticated and organized. They often have specific financial and strategic goals. They also have more resources available to them, as they might be funded by nation states or organized crime.

These changing realities have led to an unprecedented level of professionalism in the attacker ranks. No longer are they interested in web defacement. They are now interested in stealing information, financial accounts, and private data – all of which they can use to generate cash on the open market or to leverage a particular business, political, or military position. Even more concerning than those attackers with a financial objective are the attackers who breach networks to do harm to infrastructure and people.

In response, organizations often deploy various point solutions, which focus on defending either the enterprise perimeter or endpoints by looking for known attack signatures. These solutions tend to generate a high volume of low fidelity alerts, which require a security analyst to triage and investigate. Most organizations lack the time and expertise required to respond to these alerts – so many go unaddressed.  

In addition, attackers have evolved their methods to subvert many signature-based defenses and [adapt to cloud environments](https://azure.microsoft.com/blog/detecting-threats-with-azure-security-center/). New approaches are required to more quickly identify emerging threats and expedite detection and response.


## Continuous monitoring and assessments

Azure Security Center benefits from having security research and data science teams throughout Microsoft who continuously monitor for changes in the threat landscape. This includes the following initiatives:

* **Threat intelligence monitoring**: Threat intelligence includes mechanisms, indicators, implications, and actionable advice about existing or emerging threats. This information is shared in the security community and Microsoft continuously monitors threat intelligence feeds from internal and external sources.
* **Signal sharing**: Insights from security teams across Microsoft's broad portfolio of cloud and on-premises services, servers, and client endpoint devices are shared and analyzed.
* **Microsoft security specialists**: Ongoing engagement with teams across Microsoft that work in specialized security fields, like forensics and web attack detection.
* **Detection tuning**: Algorithms are run against real customer data sets and security researchers work with customers to validate the results. True and false positives are used to refine machine learning algorithms.

These combined efforts culminate in new and improved detections, which you can benefit from instantly – there's no action for you to take.

## How does Security Center detect threats? <a name="detect-threats"> </a>

Microsoft security researchers are constantly on the lookout for threats. Because of our global presence in the cloud and on-premises, we have access to an expansive set of telemetry. The wide-reaching and diverse collection of datasets enables us to discover new attack patterns and trends across our on-premises consumer and enterprise products, as well as our online services. As a result, Security Center can rapidly update its detection algorithms as attackers release new and increasingly sophisticated exploits. This approach helps you keep pace with a fast moving threat environment.

To detect real threats and reduce false positives, Security Center collects, analyzes, and integrates log data from your Azure resources and the network. It also works with connected partner solutions, like firewall and endpoint protection solutions. Security Center analyzes this information, often correlating information from multiple sources, to identify threats.

![Security Center Data collection and presentation](./media/security-center-alerts-overview/security-center-detection-capabilities.png)

Security Center employs advanced security analytics, which go far beyond signature-based approaches. Breakthroughs in big data and [machine learning](https://azure.microsoft.com/blog/machine-learning-in-azure-security-center/) technologies are leveraged to evaluate events across the entire cloud fabric – detecting threats that would be impossible to identify using manual approaches and predicting the evolution of attacks. These security analytics include:

- **Integrated threat intelligence**: Microsoft has an immense amount of global threat intelligence. Telemetry flows in from multiple sources, such as Azure, Microsoft 365, Microsoft CRM online, Microsoft Dynamics AX, outlook.com, MSN.com, the Microsoft Digital Crimes Unit (DCU), and Microsoft Security Response Center (MSRC). Researchers also receive threat intelligence information that is shared among major cloud service providers and feeds from other third parties. Azure Security Center can use this information to alert you to threats from known bad actors.

- **Behavioral analytics**: Behavioral analytics is a technique that analyzes and compares data to a collection of known patterns. However, these patterns are not simple signatures. They are determined through complex machine learning algorithms that are applied to massive datasets. They are also determined through careful analysis of malicious behaviors by expert analysts. Azure Security Center can use behavioral analytics to identify compromised resources based on analysis of virtual machine logs, virtual network device logs, fabric logs, and other sources.

- **Anomaly detection**: Azure Security Center also uses anomaly detection to identify threats. In contrast to behavioral analytics (which depends on known patterns derived from large data sets), anomaly detection is more "personalized" and focuses on baselines that are specific to your deployments. Machine learning is applied to determine normal activity for your deployments and then rules are generated to define outlier conditions that could represent a security event.

## How are alerts classified?

Security Center assigns a severity to alerts, to help you prioritize the order in which you attend to each alert, so that when a resource is compromised, you can get to it right away. 
The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

> [!NOTE]
> Alert severity is displayed differently in the portal and versions of the REST API that predate 01-01-2019. If you're using an older version of the API, upgrade for the consistent experience described below.

| Severity          | Recommended response                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **High**          | There is a high probability that your resource is compromised. You should look into it right away. Security Center has high confidence in both the malicious intent and in the findings used to issue the alert. For example, an alert that detects the execution of a known malicious tool such as Mimikatz, a common tool used for credential theft.                                                                                                               |
| **Medium**        | This is probably a suspicious activity might indicate that a resource is compromised. Security Center's confidence in the analytic or finding is medium and the confidence of the malicious intent is medium to high. These would usually be machine learning or anomaly-based detections. For example, a sign-in attempt from an anomalous location.                                                                                                                |
| **Low**           | This might be a benign positive or a blocked attack. Security Center isn't confident enough that the intent is malicious and the activity might be innocent. For example, log clear is an action that might happen when an attacker tries to hide their tracks, but in many cases is a routine operation performed by admins. Security Center doesn't usually tell you when attacks were blocked, unless it's an interesting case that we suggest you look into. |
| **Informational** | You will only see informational alerts when you drill down into a security incident, or if you use the REST API with a specific alert ID. An incident is typically made up of a number of alerts, some of which might appear on their own to be only informational, but in the context of the other alerts might be worthy of a closer look.                                                                                                                         |  |
|                   |                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |

## Export alerts

You have a range of options for viewing your alerts outside of Security Center, including:

- **Download CSV report** on the alerts dashboard provides a one-time export to CSV.
- **Continuous export** from pricing & settings allows you to configure streams of security alerts and recommendations to Log Analytics workspaces and Event Hubs. [Learn more about continuous export](continuous-export.md)
- **Azure Sentinel connector** streams security alerts from Azure Security Center into Azure Sentinel. [Learn more about connecting Azure Security Center with Azure Sentinel](../sentinel/connect-azure-security-center.md)

## Cloud smart alert correlation in Azure Security Center (incidents)

Azure Security Center continuously analyzes hybrid cloud workloads by using advanced analytics and threat intelligence to alert you about malicious activity.

The breadth of threat coverage is growing. The need to detect even the slightest compromise is important, and it can be challenging for security analysts to triage the different alerts and identify an actual attack. Security Center helps analysts cope with this alert fatigue. It helps diagnose attacks as they occur, by correlating different alerts and low fidelity signals into security incidents.

Fusion analytics is the technology and analytic back end that powers Security Center incidents, enabling it to correlate different alerts and contextual signals together. Fusion looks at the different signals reported on a subscription across the resources. Fusion finds patterns that reveal attack progression or signals with shared contextual information, indicating that you should use a unified response procedure for them.

Fusion analytics combines security domain knowledge with AI to analyze alerts, discovering new attack patterns as they occur. 

Security Center leverages MITRE Attack Matrix to associate alerts with their perceived intent, helping formalize security domain knowledge. In addition, by using the information gathered for each step of an attack, Security Center can rule out activity that appears to be steps of an attack, but actually isn't.

Because attacks often occur across different tenants, Security Center can combine AI algorithms to analyze attack sequences that are reported on each subscription. This technique identifies the attack sequences as prevalent alert patterns, instead of just being incidentally associated with each other.

During an investigation of an incident, analysts often need extra context to reach a verdict about the nature of the threat and how to mitigate it. For example, even when a network anomaly is detected, without understanding what else is happening on the network or with regard to the targeted resource, it's difficult to understand what actions to take next. To help, a security incident can include artifacts, related events, and information. The additional information available for security incidents varies, depending on the type of threat detected and the configuration of your environment. 

> [!TIP]
> For a list of security incident alerts that can be produced by the fusion analytics, see the [Reference table of alerts](alerts-reference.md#alerts-fusion).

:::image type="content" source="./media/security-center-alerts-cloud-smart/security-incident.png" alt-text="Screenshot of security incident detected report":::

To manage your security incidents, see [How to manage security incidents in Azure Security Center](security-center-incident.md).

## Next steps

In this article, you learned about the different types of alerts available in Security Center. For more information, see:

- [Security Alerts in Azure Activity log](https://go.microsoft.com/fwlink/?linkid=2114113) - In addition to being available in the Azure portal or programmatically, Security alerts and incidents are audited as events in Azure Activity Log
- [Reference table of Azure Defender alerts](alerts-reference.md)
- [Respond to security alerts](security-center-managing-and-responding-alerts.md#respond-to-security-alerts)