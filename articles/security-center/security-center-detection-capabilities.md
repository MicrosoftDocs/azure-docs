---
title: Detection capabilities in Azure Security Center | Microsoft Docs
description: This document helps you to understand how Azure Security Center detection capabilities work.
services: security-center
documentationcenter: na
author: rkarlin
manager: barbkess
editor: ''

ms.assetid: 4c5599cc-99a1-430f-895f-601615ef12a0
ms.service: security-center
ms.topic: conceptual
ms.devlang: na
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/2/2018
ms.author: rkarlin

---
# Azure Security Center detection capabilities
This document discusses Azure Security Center’s advanced detection capabilities, which helps identify active threats targeting your Microsoft Azure resources - both Windows and Linux - and provides you with the insights needed to respond quickly.

Advanced detections are available in the Standard Tier of Azure Security Center. A free trial is available. You can upgrade from the Pricing Tier selection in the [Security Policy](tutorial-security-policy.md). Visit [Security Center page](https://azure.microsoft.com/pricing/details/security-center/) to learn more about pricing.


## Responding to today’s threats
There have been significant changes in the threat landscape over the last 20 years. In the past, companies typically only had to worry about web site defacement by individual attackers who were mostly interested in seeing “what they could do". Today’s attackers are much more sophisticated and organized. They often have specific financial and strategic goals. They also have more resources available to them, as they may be funded by nation states or organized crime.

This approach has led to an unprecedented level of professionalism in the attacker ranks. No longer are they interested in web defacement. They are now interested in stealing information, financial accounts, and private data – all of which they can use to generate cash on the open market or to leverage a particular business, political or military position. Even more concerning than those attackers with a financial objective are the attackers who breach networks to do harm to infrastructure and people.

In response, organizations often deploy various point solutions, which focus on defending either the enterprise perimeter or endpoints by looking for known attack signatures. These solutions tend to generate a high volume of low fidelity alerts, which require a security analyst to triage and investigate. Most organizations lack the time and expertise required to respond to these alerts – so many go unaddressed.  Meanwhile, attackers have evolved their methods to subvert many signature-based defenses and [adapt to cloud environments](https://azure.microsoft.com/blog/detecting-threats-with-azure-security-center/). New approaches are required to more quickly identify emerging threats and expedite detection and response.

## How Azure Security Center detects and responds to threats <a name="asc-detects"></a>
Microsoft security researchers are constantly on the lookout for threats. They have access to an expansive set of telemetry gained from Microsoft’s global presence in the cloud and on-premises. This wide-reaching and diverse collection of datasets enables Microsoft to discover new attack patterns and trends across its on-premises consumer and enterprise products, as well as its online services. As a result, Security Center can rapidly update its detection algorithms as attackers release new and increasingly sophisticated exploits. This approach helps you keep pace with a fast moving threat environment.

Security Center threat detection works by automatically collecting security information from your Azure resources, the network, and connected partner solutions. It analyzes this information, often correlating information from multiple sources, to identify threats. Security alerts are prioritized in Security Center along with recommendations on how to remediate the threat.

![Security Center Data collection and presentation](./media/security-center-detection-capabilities/security-center-detection-capabilities-fig1.png)

Security Center employs advanced security analytics, which go far beyond signature-based approaches. Breakthroughs in big data and [machine learning](https://azure.microsoft.com/blog/machine-learning-in-azure-security-center/) technologies are leveraged to evaluate events across the entire cloud fabric – detecting threats that would be impossible to identify using manual approaches and predicting the evolution of attacks. These security analytics include:

* **Integrated threat intelligence**: looks for known bad actors by leveraging global threat intelligence from Microsoft products and services, the Microsoft Digital Crimes Unit (DCU), the Microsoft Security Response Center (MSRC), and external feeds.
* **Behavioral analytics**: applies known patterns to discover malicious behavior.
* **Anomaly detection**: uses statistical profiling to build a historical baseline. It alerts on deviations from established baselines that conform to a potential attack vector.

### Threat intelligence
Microsoft has an immense amount of global threat intelligence. Telemetry flows in from multiple sources, such as Azure, Office 365, Microsoft CRM online, Microsoft Dynamics AX, outlook.com, MSN.com, the Microsoft Digital Crimes Unit (DCU) and Microsoft Security Response Center (MSRC). Researchers also receive threat intelligence information that is shared among major cloud service providers and subscribes to threat intelligence feeds from third parties. Azure Security Center can use this information to alert you to threats from known bad actors. Some examples include:

* **Outbound communication to a malicious IP address**: outbound traffic to a known botnet or darknet likely indicates that your resource has been compromised and an attacker is attempting to execute commands on that system or exfiltrate data. Azure Security Center compares network traffic to Microsoft’s global threat database and alerts you if it detects communication to a malicious IP address.

## Behavioral analytics
Behavioral analytics is a technique that analyzes and compares data to a collection of known patterns. However, these patterns are not simple signatures. They are determined through complex machine learning algorithms that are applied to massive datasets. They are also determined through careful analysis of malicious behaviors by expert analysts. Azure Security Center can use behavioral analytics to identify compromised resources based on analysis of virtual machine logs, virtual network device logs, fabric logs, crash dumps and other sources.

In addition, there is correlation with other signals to check for supporting evidence of a widespread campaign. This correlation helps to identify events that are consistent with established indicators of compromise. Some examples include:

* **Suspicious process execution**: Attackers employ several techniques to execute malicious software without detection. For example, an attacker might give malware the same names as legitimate system files but place these files in an alternate location, use a name that is very similar to a benign file, or mask the file’s true extension. Security Center models processes behaviors and monitors process executions to detect outliers such as these.  
* **Hidden malware and exploitation attempts**: Sophisticated malware is able to evade traditional antimalware products by either never writing to disk or encrypting software components stored on disk.  However, such malware can be detected using memory analysis, as the malware must leave traces in memory in order to function. When software crashes, a crash dump captures a portion of memory at the time of the crash.  By analyzing the memory in the crash dump, Azure Security Center can detect techniques used to exploit vulnerabilities in software, access confidential data, and surreptitiously persist with-in a compromised machine without impacting the performance of your machine.
* **Lateral movement and internal reconnaissance**: To persist in a compromised network and locate/harvest valuable data, attackers often attempt to move laterally from the compromised machine to others within the same network. Security Center monitors process and login activities in order to discover attempts to expand an attacker’s foothold within the network, such as remote command execution network probing, and account enumeration.
* **Malicious PowerShell Scripts**: PowerShell is being used by attackers to execute malicious code on target virtual machines for a variety of purposes. Security Center inspects PowerShell activity for evidence of suspicious activity.
* **Outgoing attacks**: Attackers often target cloud resources with the goal of using those resources to mount additional attacks. Compromised virtual machines, for example, might be used to launch brute force attacks against other virtual machines, send SPAM, or scan open ports and other devices on the internet. By applying machine learning to network traffic, Security Center can detect when outbound network communications exceed the norm. In the case of SPAM, Security Center also correlates unusual email traffic with intelligence from Office 365 to determine whether the mail is likely nefarious or the result of a legitimate email campaign.  

### Anomaly detection
Azure Security Center also uses anomaly detection to identify threats. In contrast to behavioral analytics (which depends on known patterns derived from large data sets), anomaly detection is more “personalized” and focuses on baselines that are specific to your deployments. Machine learning is applied to determine normal activity for your deployments and then rules are generated to define outlier conditions that could represent a security event. Here’s an example:

* **Inbound RDP/SSH brute force attacks**: Your deployments may have busy virtual machines with a lot of logins each day and other virtual machines that have very few or any logins. Azure Security Center can determine baseline login activity for these virtual machines and use machine learning to define what is outside of normal login activity. If the number of logins, or the time of day of the logins, or the location from which the logins are requested, or other login-related characteristics are significantly different from the baseline, then an alert may be generated. Again, machine learning determines what is significant.

## Continuous threat intelligence monitoring
Azure Security Center operates security research and data science teams that continuously monitor for changes in the threat landscape. This includes the following initiatives:

* **Threat intelligence monitoring**: Threat intelligence includes mechanisms, indicators, implications and actionable advice about existing or emerging threats. This information is shared in the security community and Microsoft continuously monitors threat intelligence feeds from internal and external sources.
* **Signal sharing**: Insights from security teams across Microsoft’s broad portfolio of cloud and on-premises services, servers, and client endpoint devices are shared and analyzed.
* **Microsoft security specialists**: Ongoing engagement with teams across Microsoft that work in specialized security fields, like forensics and web attack detection.
* **Detection tuning**: Algorithms are run against real customer data sets and security researchers work with customers to validate the results. True and false positives are used to refine machine learning algorithms.

These combined efforts culminate in new and improved detections, which you can benefit from instantly – there’s no action for you to take.

## See also
In this document, you learned how to Azure Security Center detection capabilities work. To learn more about Security Center, see the following:

* [Azure Security Center Planning and Operations Guide](security-center-planning-and-operations-guide.md)
* [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md)
* [Security Alerts by Type in Azure Security Center](security-center-alerts-type.md)
* [Security health monitoring in Azure Security Center](security-center-monitoring.md) — Learn how to monitor the health of your Azure resources.
* [Monitoring partner solutions with Azure Security Center](security-center-partner-solutions.md) — Learn how to monitor the health status of your partner solutions.
* [Azure Security Center FAQ](security-center-faq.md) — Find frequently asked questions about using the service.
* [Azure Security blog](https://blogs.msdn.com/b/azuresecurity/) — Find blog posts about Azure security and compliance.
