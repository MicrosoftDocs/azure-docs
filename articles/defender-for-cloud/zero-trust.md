---
title: Zero trust infrastructure and integrations
description: Independent software vendors (ISVs) can integrate their solutions with Microsoft Defender for Cloud to help customers adopt a Zero Trust model and keep their organizations secure.
ms.date: 02/26/2023
ms.topic: conceptual
ms.collection:
  -       zerotrust-services
---

# Zero Trust infrastructure and integrations

[!INCLUDE [zero-trust-principles](../../includes/security/zero-trust-principles.md)]

Infrastructure comprises the hardware, software, micro-services, networking infrastructure, and facilities required to support IT services for an organization. Zero Trust infrastructure solutions assess, monitor, and prevent security threats to these services.

Zero Trust infrastructure solutions support the principles of Zero Trust by ensuring that access to infrastructure resources is verified explicitly, access is granted using principles of least privilege access, and mechanisms are in place that assumes breach and look for and remediate security threats in infrastructure.

This guidance is for software providers and technology partners who want to enhance their infrastructure security solutions by integrating with Microsoft products.

## Zero Trust integration for Infrastructure guide

This integration guide includes strategy and instructions for integrating with [Microsoft Defender for Cloud](defender-for-cloud-introduction.md) and its integrated cloud workload protection platform (CWPP), Microsoft Defender for Cloud.

The guidance includes integrations with the most popular Security Information and Event Management (SIEM), Security Orchestration Automated Response (SOAR), Endpoint Detection and Response (EDR), and IT Service Management (ITSM) solutions.

### Zero Trust and Defender for Cloud

Our [Zero Trust infrastructure deployment guidance](/security/zero-trust/deploy/infrastructure) provides key stages of the Zero Trust strategy for infrastructure. Which are:

1. [Assess compliance with chosen standards and policies](update-regulatory-compliance-packages.md)
1. [Harden configuration](recommendations-reference.md) wherever gaps are found
1. Employ other hardening tools such as [just-in-time (JIT)](just-in-time-access-usage.md) VM access
1. Set up [threat detection and protections](/azure/azure-sql/database/threat-detection-configure)
1. Automatically block and flag risky behavior and take protective actions

There's a clear mapping from the goals we've described in the [infrastructure deployment guidance](/security/zero-trust/deploy/infrastructure) to the core aspects of Defender for Cloud.

|Zero Trust goal  | Defender for Cloud feature  |
|---------|---------|
|Assess compliance | In Defender for Cloud, every subscription automatically has the [Microsoft cloud security benchmark (MCSB) security initiative assigned](security-policy-concept.md).<br>Using the [secure score tools](secure-score-security-controls.md) and the [regulatory compliance dashboard](update-regulatory-compliance-packages.md) you can get a deep understanding of your customer's security posture. |
| Harden configuration | [Review your security recommendations](review-security-recommendations.md) and [track your secure score improvement overtime](secure-score-access-and-track.md). You can also prioritize which recommendations to remediate based on potential attack paths, by leveraging the [attack path](how-to-manage-attack-path.md) feature. |
|Employ hardening mechanisms | Least privilege access is one of the three principles of Zero Trust. Defender for Cloud can assist you to harden VMs and network using this principle by leveraging features such as:<br>[Just-in-time (JIT) virtual machine (VM) access](just-in-time-access-overview.md)<br>[Adaptive network hardening](adaptive-network-hardening.md)<br>[Adaptive application controls](adaptive-application-controls.md). |
|Set up threat detection  | Defender for Cloud offers an integrated cloud workload protection platform (CWPP), Microsoft Defender for Cloud.<br>Microsoft Defender for Cloud provides advanced, intelligent, protection of Azure and hybrid resources and workloads.<br>One of the Microsoft Defender plans, Microsoft Defender for servers, includes a native integration with [Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/).<br>Learn more in [Introduction to Microsoft Defender for Cloud](/azure/security-center/azure-defender). |
|Automatically block suspicious behavior | Many of the hardening recommendations in Defender for Cloud offer a *deny* option. This feature lets you prevent the creation of resources that don't satisfy defined hardening criteria. Learn more in [Prevent misconfigurations with Enforce/Deny recommendations](./prevent-misconfigurations.md).  |
|Automatically flag suspicious behavior | Microsoft Defenders for Cloud's security alerts are triggered by advanced detections. Defender for Cloud prioritizes and lists the alerts, along with the information needed for you to quickly investigate the problem. Defender for Cloud also provides detailed steps to help you remediate attacks. For a full list of the available alerts, see [Security alerts - a reference guide](alerts-reference.md).|

### Protect your  Azure PaaS services with Defender for Cloud

With Defender for Cloud enabled on your subscription, and Microsoft Defender for Cloud enabled for all available resource types, you'll have a layer of intelligent threat protection - powered by [Microsoft Threat Intelligence](https://go.microsoft.com/fwlink/?linkid=2128684) - protecting  resources in Azure Key Vault, Azure Storage, Azure DNS, and other Azure PaaS services. For a full list, see [What resource types can Microsoft Defender for Cloud secure?](defender-for-cloud-introduction.md).

### Azure Logic Apps

Use [Azure Logic Apps](../logic-apps/index.yml) to build automated scalable workflows, business processes, and enterprise orchestrations to integrate your apps and data across cloud services and on-premises systems.

Defender for Cloud's [workflow automation](workflow-automation.md) feature lets you automate responses to Defender for Cloud triggers. 

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

Defender for Cloud natively integrates with [Microsoft Sentinel](../sentinel/overview.md), Microsoft's cloud-native, security information event management (SIEM) and security orchestration automated response (SOAR) solution.

There are two approaches to ensuring your Defender for Cloud data is represented in Microsoft Sentinel:

- **Sentinel connectors** - Microsoft Sentinel includes built-in connectors for Microsoft Defender for Cloud at the subscription and tenant levels:

  - [Stream alerts to Microsoft Sentinel at the subscription level](/azure/sentinel/connect-azure-security-center)
  - [Connect all subscriptions in your tenant to Microsoft Sentinel](https://techcommunity.microsoft.com/t5/azure-sentinel/azure-security-center-auto-connect-to-sentinel/ba-p/1387539)

  > [!TIP]
  > Learn more in [Connect security alerts from Microsoft Defender for Cloud](../sentinel/connect-defender-for-cloud.md).

- **Stream your audit logs** - An alternative way to investigate Defender for Cloud alerts in Microsoft Sentinel is to stream your audit logs into Microsoft Sentinel:

  - [Connect Windows security events](/azure/sentinel/connect-windows-security-events)
  - [Collect data from Linux-based sources using Syslog](../sentinel/connect-syslog.md)
  - [Connect data from Azure Activity log](/azure/sentinel/connect-azure-activity)

#### Stream alerts with Microsoft Graph Security API

Defender for Cloud has out-of-the-box integration with Microsoft Graph Security API. No configuration is required and there are no extra costs.

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

This can also be done at the Management Group level using Azure Policy, see [Create continuous export automation configurations at scale](continuous-export.md#configure-continuous-export-from-the-defender-for-cloud-pages-in-azure-portal).

> [!TIP]
> To view the event schemas of the exported data types, visit the [Event Hub event schemas](https://aka.ms/ASCAutomationSchemas).

### Integrate Defender for Cloud with an Endpoint Detection and Response (EDR) solution

#### Microsoft Defender for Endpoint

[Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/) is a holistic, cloud-delivered endpoint security solution.

Defender for Cloud's integrated CWPP for machines, [Microsoft Defender for servers](plan-defender-for-servers.md), includes an integrated license for [Microsoft Defender for Endpoint](https://www.microsoft.com/microsoft-365/security/endpoint-defender). Together, they provide comprehensive endpoint detection and response (EDR) capabilities. For more information, see [Protect your endpoints](/azure/security-center/security-center-wdatp?tabs=linux).

When Defender for Endpoint detects a threat, it triggers an alert. The alert is shown in Defender for Cloud. From Defender for Cloud, you can also pivot to the Defender for Endpoint console and perform a detailed investigation to uncover the scope of the attack. Learn more about [Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/microsoft-defender-endpoint).

#### Other EDR solutions

Defender for Cloud provides hardening recommendations to ensure you're securing your organization's resources according to the guidance of [Azure Security Benchmark](/security/benchmark/azure/introduction). One of the controls in the benchmark relates to endpoint security: [ES-1: Use Endpoint Detection and Response (EDR)](/security/benchmark/azure/security-controls-v2-endpoint-security).

There are two recommendations in Defender for Cloud to ensure you've enabled endpoint protection and it's running well. These recommendations are checking for the presence and operational health of EDR solutions from:

- Trend Micro
- Symantec
- McAfee
- Sophos

Learn more in [Endpoint protection assessment and recommendations in Microsoft Defender for Cloud](endpoint-protection-recommendations-technical.md).

### Apply your Zero Trust strategy to hybrid and multicloud scenarios

With cloud workloads commonly spanning multiple cloud platforms, cloud security services must do the same.

Microsoft Defender for Cloud protects workloads wherever they're running: in Azure, on-premises, Amazon Web Services (AWS), or Google Cloud Platform (GCP).

#### Integrate Defender for Cloud with on-premises machines

To secure hybrid cloud workloads, you can extend Defender for Cloud's protections by connecting  on-premises machines to [Azure Arc enabled servers](../azure-arc/servers/overview.md).

Learn about how to connect machines in [Connect your non-Azure machines to Defender for Cloud](quickstart-onboard-machines.md).

#### Integrate Defender for Cloud with other cloud environments

To view the security posture of **Amazon Web Services** machines in Defender for Cloud, onboard  AWS accounts into Defender for Cloud. This integrates AWS Security Hub and Microsoft Defender for Cloud for a unified view of Defender for Cloud recommendations and AWS Security Hub findings and provides a range of benefits as described in  [Connect your AWS accounts to Microsoft Defender for Cloud](quickstart-onboard-aws.md).

To view the security posture of **Google Cloud Platform** machines in Defender for Cloud, onboard GCP accounts into Defender for Cloud. This integrates GCP Security Command and Microsoft Defender for Cloud for a unified view of Defender for Cloud recommendations and GCP Security Command Center findings and provides a range of benefits as described in [Connect your GCP accounts to Microsoft Defender for Cloud](quickstart-onboard-gcp.md).

## Next steps

To learn more about Microsoft Defender for Cloud and Microsoft Defender for Cloud, see the complete [Defender for Cloud documentation](index.yml).
