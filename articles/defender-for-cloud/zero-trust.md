---
title: Zero trust and Microsoft Defender for Cloud
description: Understand how to implement zero trust principles to secure an enterprise infrastructure that includes Microsoft Defender for Cloud
ms.date: 07/17/2024
ms.topic: concept-article
ms.collection:
  -       zerotrust-services
---

# Zero trust and Defender for Cloud

This article provides strategy and instructions for integrating zero trust infrastructure solutions with [Microsoft Defender for Cloud](defender-for-cloud-introduction.md). The guidance includes integrations with other solutions, including  security information and event management (SIEM), security orchestration automated response (SOAR), endpoint detection and response (EDR), and IT service management (ITSM) solutions.

Infrastructure comprises the hardware, software, micro-services, networking infrastructure, and facilities required to support IT services for an organization. Whether on-premises or multicloud, infrastructure represents a critical threat vector.

Zero Trust infrastructure solutions assess, monitor, and prevent security threats to your infrastructure. Solutions support the principles of zero trust by ensuring that access to infrastructure resources is verified explicitly, and granted using principles of least privilege access. Mechanisms assume breach, and look for and remediate security threats in infrastructure.

## What is zero trust?

[!INCLUDE [zero-trust-principles](~/reusable-content/ce-skilling/azure/includes/security/zero-trust-principles.md)]



## Zero Trust and Defender for Cloud

[Zero Trust infrastructure deployment guidance](/security/zero-trust/deploy/infrastructure) provides key stages of zero trust infrastructure strategy:

1. [Assess compliance](update-regulatory-compliance-packages.yml) with chosen standards and policies.
1. [Harden configuration](recommendations-reference.md) wherever gaps are found.
1. Employ other hardening tools such as [just-in-time (JIT)](just-in-time-access-usage.yml) VM access.
1. Set up [threat protection](/azure/azure-sql/database/threat-detection-configure).
1. Automatically block and flag risky behavior and take protective actions.

Here's how these stages map to Defender for Cloud.

|Goal  | Defender for Cloud |
|---------|---------|
|Assess compliance | In Defender for Cloud, every subscription automatically has the [Microsoft cloud security benchmark (MCSB) security initiative assigned](security-policy-concept.md).<br>Using the [secure score tools](secure-score-security-controls.md) and the [regulatory compliance dashboard](update-regulatory-compliance-packages.yml) you can get a deep understanding of security posture. |
| Harden configuration | Infrastructure and environment settings are assessed against compliance standard, and recommendations are issued based on those assessments. You can [review and remediate security recommendations](review-security-recommendations.md) and [track secure score improvements] (secure-score-access-and-track.md) over time. You can prioritize which recommendations to remediate based on potential [attack paths](how-to-manage-attack-path.md). |
|Employ hardening mechanisms | Least privilege access is a zero trust principle. Defender for Cloud can help you to harden VMs and network settings using this principle with features such as:<br>[Just-in-time (JIT) VM access](just-in-time-access-overview.md), [adaptive network hardening](adaptive-network-hardening.md), and [adaptive application controls](adaptive-application-controls.md). |
|Set up threat protection  | Defender for Cloud is a cloud workload protection platform (CWPP), providing advanced, intelligent protection of Azure and hybrid resources and workloads. [Learn more](defender-for-cloud-introduction.md). |
|Automatically block risky behavior | Many of the hardening recommendations in Defender for Cloud offer a *deny* option, to prevent the creation of resources that don't satisfy defined hardening criteria. [Learn more](./prevent-misconfigurations.md).  |
|Automatically flag suspicious behavior | Defenders for Cloud security alerts are triggered by threat detections. Defender for Cloud prioritizes and lists alerts, with information to help you investigate. It also provides detailed steps to help you remediate attacks. Review a [full list of security alerts](alerts-reference.md).|


### Apply zero trust to hybrid and multicloud scenarios

With cloud workloads commonly spanning multiple cloud platforms, cloud security services must do the same.Defender for Cloud protects workloads wherever they're running. In Azure, on-premises, AWS, or GCP.

- **AWS**: To protect AWS machines, you onboard AWS accounts into Defender for Cloud.  This integration provides a unified view of Defender for Cloud recommendations and AWS Security Hub findings. Learn more about [connecting AWS accounts to Microsoft Defender for Cloud](quickstart-onboard-aws.md).
- **GCP**: To protect GCP machines, you onboard GCP accounts into Defender for Cloud. This integration provides a unified view of Defender for Cloud recommendations and GCP Security Command Center findings. Learn more about [connecting GCP accounts to Microsoft Defender for Cloud](quickstart-onboard-gcp.md).
- **On-premises machines**. You can extend Defender for Cloud protection by connecting  on-premises machines to [Azure Arc enabled servers](../azure-arc/servers/overview.md). Learn more about [connecting on-premises machines to Defender for Cloud](quickstart-onboard-machines.md).


## Protect Azure PaaS services 

When Defender for Cloud is available in an Azure subscription, and Defender for Cloud plans enabled for all available resource types, a layer of intelligent threat protection, powered by [Microsoft Threat Intelligence](https://go.microsoft.com/fwlink/?linkid=2128684) protects resources in Azure PaaS services, including Azure Key Vault, Azure Storage, Azure DNS, and others. Learn more about the [resource types that Defender for Cloud can secure](defender-for-cloud-introduction.md).

## Automate responses with Azure Logic Apps

Use [Azure Logic Apps](../logic-apps/index.yml) to build automated scalable workflows, business processes, and enterprise orchestrations to integrate your apps and data across cloud services and on-premises systems.

Defender for Cloud's [workflow automation](workflow-automation.yml) feature lets you automate responses to Defender for Cloud triggers.

This is great way to define and respond in an automated, consistent manner when threats are discovered. For example, to notify relevant stakeholders, launch a change management process, and apply specific remediation steps when a threat is detected.

## Integrate with SIEM, SOAR, and ITSM solutions

Defender for Cloud can stream your security alerts into the most popular SIEM, SOAR, and ITSM solutions. There are Azure-native tools to ensure you can view your alert data in all of the most popular solutions in use today, including:

- Microsoft Sentinel
- Splunk Enterprise and Splunk Cloud
- IBM's QRadar
- ServiceNow
- ArcSight
- Power BI
- Palo Alto Networks

### Integrate with Microsoft Sentinel

Defender for Cloud natively integrates with [Microsoft Sentinel](../sentinel/overview.md), Microsoft's SIEM/SOAR solution.

There are two approaches to ensuring that Defender for Cloud data is represented in Microsoft Sentinel:

- **Sentinel connectors** - Microsoft Sentinel includes built-in connectors for Microsoft Defender for Cloud at the subscription and tenant levels:

  - [Stream alerts to Microsoft Sentinel at the subscription level](../sentinel/connect-azure-security-center.md)
  - [Connect all subscriptions in your tenant to Microsoft Sentinel](https://techcommunity.microsoft.com/t5/azure-sentinel/azure-security-center-auto-connect-to-sentinel/ba-p/1387539)

  > [!TIP]
  > Learn more in [Connect security alerts from Microsoft Defender for Cloud](../sentinel/connect-defender-for-cloud.md).

- **Audit logs streaming** - An alternative way to investigate Defender for Cloud alerts in Microsoft Sentinel is to stream your audit logs into Microsoft Sentinel:

  - [Connect Windows security events](../sentinel/connect-windows-security-events.md)
  - [Collect data from Linux-based sources using Syslog](../sentinel/connect-syslog.md)
  - [Connect data from Azure Activity log](../sentinel/data-connectors/azure-activity.md)

### Stream alerts with Microsoft Graph Security API

Defender for Cloud has out-of-the-box integration with Microsoft Graph Security API. No configuration is required and there are no extra costs.

You can use this API to stream alerts from the entire tenant, and data from many other Microsoft Security products into third-party SIEMs and other popular platforms:

- **Splunk Enterprise and Splunk Cloud** - Use the [Microsoft Graph Security API Add-On for Splunk](https://splunkbase.splunk.com/app/4564/)
- **Power BI** - Connect to the [Microsoft Graph Security API in Power BI Desktop](/power-bi/connect-data/desktop-connect-graph-security)
- **ServiceNow** - Follow the instructions to [install and configure the Microsoft Graph Security API application from the ServiceNow Store](https://docs.servicenow.com/bundle/orlando-security-management/page/product/secops-integration-sir/secops-integration-ms-graph/task/ms-graph-install.html)
- **QRadar** - Use [IBM's Device Support Module for Defender for Cloud via Microsoft Graph API](https://www.ibm.com/support/knowledgecenter/SS42VS_DSM/com.ibm.dsm.doc/c_dsm_guide_ms_azure_security_center_overview.html)
- **Palo Alto Networks**, **Anomali**, **Lookout**, **InSpark**, and more. Learn more about [Microsoft Graph Security API](https://www.microsoft.com/security/business/graph-security-api). 



### Stream alerts with Azure Monitor

Use Defender for Cloud's [continuous export](continuous-export.md) feature to connect to Azure monitor via Azure Event Hubs, and stream alerts into **ArcSight**, **SumoLogic**, Syslog servers, **LogRhythm**, **Logz.io Cloud Observability Platform**, and other monitoring solutions.

- This can also be done at the Management Group level using Azure Policy. Learn about [creating continuous export automation configurations at scale](continuous-export.md).
- To view the event schemas of the exported data types, review the [Event Hubs event schemas](https://aka.ms/ASCAutomationSchemas).

Learn more about [streaming alerts to monitoring solutions](export-to-siem.md).



### Integrate with EDR solutions

#### Microsoft Defender for Endpoint

[Defender for Endpoint](/microsoft-365/security/defender-endpoint/) is a holistic, cloud-delivered endpoint security solution. The Defender for Cloud servers workload plan, [Defender for Servers](plan-defender-for-servers.md), includes an integrated license for [Defender for Endpoint](https://www.microsoft.com/security/business/endpoint-security/microsoft-defender-endpoint). Together, they provide comprehensive EDR capabilities. Learn more about [protecting endpoints](integration-defender-for-endpoint.md?tabs=linux).

When Defender for Endpoint detects a threat, it triggers an alert. The alert is shown in Defender for Cloud. From Defender for Cloud, you can pivot to the Defender for Endpoint console and perform a detailed investigation to uncover the scope of the attack. 

#### Other EDR solutions

Defender for Cloud provides health assessment of supported versions of EDR solutions. 

Defender for Cloud provides recommendations based on the [Microsoft security benchmark](/security/benchmark/azure/introduction). One of the controls in the benchmark relates to endpoint security: [ES-1: Use Endpoint Detection and Response (EDR)](/security/benchmark/azure/security-controls-v2-endpoint-security). There are two recommendations to ensure you've enabled endpoint protection and it's running well. Learn more about [assessment for supported EDR solutions](endpoint-protection-recommendations-technical.md) in Defender for Cloud.


## Next steps

Start planning [multicloud protection](plan-multicloud-security-get-started.md).
