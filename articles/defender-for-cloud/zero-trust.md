---
title: Zero Trust integration for Infrastructure overview
description: Independent software vendors (ISVs) can integrate their solutions with Microsoft Defender for Cloud to help customers adopt a Zero Trust model and keep their organizations secure.
ms.date: 02/22/2023
ms.topic: conceptual
---

# Infrastructure integrations

Infrastructure comprises the hardware, software, micro-services, networking infrastructure, and facilities required to support IT services for an organization. Zero Trust infrastructure solutions assess, monitor, and prevent security threats to these services.

Zero Trust infrastructure solutions support the principles of Zero Trust by ensuring that access to infrastructure resources is verified explicitly, access is granted using principles of least privilege access, and mechanisms are in place that assume breach and look for and remediate security threats in infrastructure.

This guidance is for software providers and technology partners who want to enhance their infrastructure security solutions by integrating with Microsoft products.

## Zero Trust integration for Infrastructure guide

This integration guide includes strategy and instructions for integrating with [Microsoft Defender for Cloud](defender-for-cloud-introduction.md) and its integrated cloud workload protection platform (CWPP), Microsoft Defender for Cloud.

The guidance includes integrations with the most popular Security Information and Event Management (SIEM), Security Orchestration Automated Response (SOAR), Endpoint Detection and Response (EDR), and IT Service Management (ITSM) solutions.

### Zero Trust and Defender for Cloud

Our [Zero Trust infrastructure deployment guidance](/security/zero-trust/deploy/infrastructure) provides key stages of the Zero Trust strategy for infrastructure. These are:

1. [Assess compliance with chosen standards and policies](update-regulatory-compliance-packages.md)
1. Harden configuration wherever gaps are found
1. Employ other hardening tools such as [just-in-time (JIT)](just-in-time-access-usage.md) VM access
1. Set up [threat detection and protections](/azure/azure-sql/database/threat-detection-configure?toc=%2Fazure%2Fdefender-for-cloud%2Ftoc.json&view=azuresql)
1. Automatically block and flag risky behavior and take protective actions

There's a clear mapping from the goals we've described in the [infrastructure deployment guidance](/security/zero-trust/deploy/infrastructure) to the core aspects of Defender for Cloud.

|Zero Trust goal  | Defender for Cloud feature  |
|---------|---------|
|Assess compliance | In Defender for Cloud, every subscription automatically has the [Microsoft cloud security benchmark security initiative assigned](security-policy-concept.md).<br>Using the [secure score tools](secure-score-security-controls.md) and the [regulatory compliance dashboard](/azure/security-center/update-regulatory-compliance-packages) you can get a deep understanding of your customer's security posture. |
|Harden configuration | Assigning security initiatives to subscriptions, and reviewing the secure score, leads you to the [hardening recommendations](/azure/security-center/recommendations-reference) built into Defender for Cloud. Defender for Cloud periodically analyzes the compliance status of resources to identify potential security misconfigurations and weaknesses. It then provides recommendations on how to remediate those issues.    |
|Employ hardening mechanisms | As well as one-time fixes to security misconfigurations, Defender for Cloud offers tools to ensure continued hardening such as:<br>[Just-in-time (JIT) virtual machine (VM) access](/azure/security-center/just-in-time-explained)<br>[Adaptive network hardening](/azure/security-center/security-center-adaptive-network-hardening)<br>[Adaptive application controls](/azure/security-center/security-center-adaptive-application). |
|Set up threat detection  | Defender for Cloud offers an integrated cloud workload protection platform (CWPP), Microsoft Defender for Cloud.<br>Microsoft Defender for Cloud provides advanced, intelligent, protection of Azure and hybrid resources and workloads.<br>One of the Microsoft Defender plans, Microsoft Defender for servers, includes a native integration with [Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/).<br>Learn more in [Introduction to Microsoft Defender for Cloud](/azure/security-center/azure-defender). |
|Automatically block suspicious behavior | Many of the hardening recommendations in Defender for Cloud offer a *deny* option. This feature lets you prevent the creation of resources that don't satisfy defined hardening criteria. Learn more in [Prevent misconfigurations with Enforce/Deny recommendations](/azure/defender-for-cloud/prevent-misconfigurations).  |
|Automatically flag suspicious behavior | Microsoft Defender for Cloud's security alerts are triggered by advanced detections. Defender for Cloud prioritizes and lists the alerts, along with the information needed for you to quickly investigate the problem. Defender for Cloud also provides detailed steps to help you remediate attacks. For a full list of the available alerts, see [Security alerts - a reference guide](/azure/security-center/alerts-reference).|
|||

### Protect your  Azure PaaS services with Defender for Cloud
With Defender for Cloud enabled on your subscription, and Microsoft Defender for Cloud enabled for all available resource types, you'll have a layer of intelligent threat protection - powered by [Microsoft Threat Intelligence](https://go.microsoft.com/fwlink/?linkid=2128684) - protecting  resources in Azure Key Vault, Azure Storage, Azure DNS, and other Azure PaaS services. For a full list, see [What resource types can Microsoft Defender for Cloud secure?](/azure/security-center/azure-defender#what-resource-types-can-azure-defender-secure).

### Azure Logic Apps
Use [Azure Logic Apps](/azure/logic-apps/) to build automated scalable workflows, business processes, and enterprise orchestrations to integrate your apps and data across cloud services and on-premises systems.

Defender for Cloud's [workflow automation](/azure/security-center/workflow-automation) feature lets you automate responses to Defender for Cloud triggers. 

This is great way to define and respond in an automated, consistent manner when threats are discovered. For example, to notify relevant stakeholders, launch a change management process, and apply specific remediation steps when a threat is detected.

### Integrate Defender for Cloud with your SIEM, SOAR, and ITSM solutions

Microsoft Defender for Cloud can stream your security alerts into the most popular Security Information and Event Management (SIEM), Security Orchestration Automated Response (SOAR), and IT Service Management (ITSM) solutions.

There are Azure-native tools for ensuring you can view your alert data in all of the most popular solutions in use today, including:

- Microsoft Sentinel
- Splunk Enterprise and Splunk Cloud
- IBM's QRadar
- ServiceNow
- ArcSight
- Power BI
- Palo Alto Networks

#### Microsoft Sentinel

Defender for Cloud natively integrates with [Microsoft Sentinel](/azure/sentinel/overview), Microsoft's cloud-native, security information event management (SIEM) and security orchestration automated response (SOAR) solution.

There are two approaches to ensuring your Defender for Cloud data is represented in Microsoft Sentinel:

- **Sentinel connectors** - Microsoft Sentinel includes built-in connectors for Microsoft Defender for Cloud at the subscription and tenant levels:

  - [Stream alerts to Microsoft Sentinel at the subscription level](/azure/sentinel/connect-azure-security-center)
  - [Connect all subscriptions in your tenant to Microsoft Sentinel](https://techcommunity.microsoft.com/t5/azure-sentinel/azure-security-center-auto-connect-to-sentinel/ba-p/1387539)

  > [!TIP]
  > Learn more in [Connect security alerts from Microsoft Defender for Cloud](/azure/sentinel/connect-azure-security-center).

- **Stream your audit logs** - An alternative way to investigate Defender for Cloud alerts in Microsoft Sentinel is to stream your audit logs into Microsoft Sentinel:

  - [Connect Windows security events](/azure/sentinel/connect-windows-security-events)
  - [Collect data from Linux-based sources using Syslog](/azure/sentinel/connect-syslog)
  - [Connect data from Azure Activity log](/azure/sentinel/connect-azure-activity)

#### Stream alerts with Microsoft Graph Security API

Defender for Cloud has out-of-the-box integration with Microsoft Graph Security API. No configuration is required and there are no additional costs.

You can use this API to stream alerts from the **entire tenant** (and data from many other Microsoft Security products) into third-party SIEMs and other popular platforms:

- **Splunk Enterprise and Splunk Cloud** - [Use the Microsoft Graph Security API Add-On for Splunk](https://splunkbase.splunk.com/app/4564/) 
- **Power BI** - [Connect to the Microsoft Graph Security API in Power BI Desktop](/power-bi/connect-data/desktop-connect-graph-security)
- **ServiceNow** - [Follow the instructions to install and configure the Microsoft Graph Security API application from the ServiceNow Store](https://docs.servicenow.com/bundle/orlando-security-management/page/product/secops-integration-sir/secops-integration-ms-graph/task/ms-graph-install.html)
- **QRadar** - [IBM's Device Support Module for Microsoft Defender for Cloud via Microsoft Graph API](https://www.ibm.com/support/knowledgecenter/SS42VS_DSM/com.ibm.dsm.doc/c_dsm_guide_ms_azure_security_center_overview.html)
- **Palo Alto Networks**, **Anomali**, **Lookout**, **InSpark**, and more - [Microsoft Graph Security API](https://www.microsoft.com/security/business/graph-security-api#office-MultiFeatureCarousel-09jr2ji)

[Learn more about Microsoft Graph Security API](https://www.microsoft.com/security/business/graph-security-api).

#### Stream alerts with Azure Monitor

Use Defender for Cloud's [continuous export](/azure/security-center/continuous-export) feature to connect Defender for Cloud with Azure monitor via Azure Event Hubs and stream alerts into **ArcSight**, **SumoLogic**, Syslog servers, **LogRhythm**, **Logz.io Cloud Observability Platform**, and other monitoring solutions.

Learn more in [Stream alerts with Azure Monitor](/azure/security-center/export-to-siem#stream-alerts-with-azure-monitor).

This can also be done at the Management Group level using Azure Policy, see [Create continuous export automation configurations at scale](/azure/security-center/continuous-export?tabs=azure-policy#configure-continuous-export-at-scale-using-the-supplied-policies).

> [!TIP]
> To view the event schemas of the exported data types, visit the [Event Hub event schemas](https://aka.ms/ASCAutomationSchemas).

### Integrate Defender for Cloud with an Endpoint Detection and Response (EDR) solution

#### Microsoft Defender for Endpoint

[Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/) is a holistic, cloud-delivered endpoint security solution.

Defender for Cloud's integrated CWPP for machines, [Microsoft Defender for servers](/azure/security-center/defender-for-servers-introduction), includes an integrated license for [Microsoft Defender for Endpoint](https://www.microsoft.com/microsoft-365/security/endpoint-defender). Together, they provide comprehensive endpoint detection and response (EDR) capabilities. For more information, see [Protect your endpoints](/azure/security-center/security-center-wdatp?tabs=linux).

When Defender for Endpoint detects a threat, it triggers an alert. The alert is shown in Defender for Cloud. From Defender for Cloud, you can also pivot to the Defender for Endpoint console and perform a detailed investigation to uncover the scope of the attack. Learn more about [Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/microsoft-defender-endpoint).

#### Other EDR solutions

Defender for Cloud provides hardening recommendations to ensure you're securing your organization's resources according to the guidance of [Azure Security Benchmark](/security/benchmark/azure/introduction). One of the controls in the benchmark relates to endpoint security: [ES-1: Use Endpoint Detection and Response (EDR)](/security/benchmark/azure/security-controls-v2-endpoint-security).

There are two recommendations in Defender for Cloud to ensure you've enabled endpoint protection and it's running well. These recommendations are checking for the presence and operational health of EDR solutions from:

- Trend Micro
- Symantec
- McAfee
- Sophos

Learn more in [Endpoint protection assessment and recommendations in Microsoft Defender for Cloud](/azure/security-center/security-center-endpoint-protection).

### Apply your Zero Trust strategy to hybrid and multi cloud scenarios

With cloud workloads commonly spanning multiple cloud platforms, cloud security services must do the same.

Microsoft Defender for Cloud protects workloads wherever they're running: in Azure, on-premises, Amazon Web Services (AWS), or Google Cloud Platform (GCP).

#### Integrate Defender for Cloud with on-premises machines

To secure hybrid cloud workloads, you can extend Defender for Cloud's protections by connecting  on-premises machines to [Azure Arc enabled servers](/azure/azure-arc/servers/overview).

Learn about how to connect machines in [Connect your non-Azure machines to Defender for Cloud](/azure/security-center/quickstart-onboard-machines?pivots=azure-arc).

#### Integrate Defender for Cloud with other cloud environments

To view the security posture of **Amazon Web Services** machines in Defender for Cloud, onboard  AWS accounts into Defender for Cloud. This will integrate AWS Security Hub and Microsoft Defender for Cloud for a unified view of Defender for Cloud recommendations and AWS Security Hub findings and provide a range of benefits as described in  [Connect your AWS accounts to Microsoft Defender for Cloud](/azure/security-center/quickstart-onboard-aws).

To view the security posture of **Google Cloud Platform** machines in Defender for Cloud, onboard GCP accounts into Defender for Cloud. This will integrate GCP Security Command and Microsoft Defender for Cloud for a unified view of Defender for Cloud recommendations and GCP Security Command Center findings and provide a range of benefits as described in [Connect your GCP accounts to Microsoft Defender for Cloud](/azure/security-center/quickstart-onboard-gcp).

## Next steps

To learn more about Microsoft Defender for Cloud and Microsoft Defender for Cloud, see the complete [Defender for Cloud documentation](/azure/security-center/).
