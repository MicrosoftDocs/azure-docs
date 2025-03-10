---
title: Microsoft Sentinel solution for SAP applications overview
description: This article provides an overview of the Microsoft Sentinel solution for SAP applications and available support.
author: batamig
ms.author: bagol
ms.topic: conceptual
ms.date: 11/05/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security

#Customer intent: As a security operations team member, I want to monitor and protect SAP systems using Microsoft Sentinel so that I can detect, analyze, and respond to threats effectively across all layers of the SAP environment.

---

# Microsoft Sentinel solutions for SAP applications

SAP systems pose a unique security challenge, as they handle sensitive information, are a prime target for attackers, and traditionally provide little visibility for security operations teams.

An SAP system breach could result in stolen files, exposed data, or a disrupted supply chain. Once an attacker is in the system, there are few controls to detect exfiltration or other bad acts. SAP activity needs to be correlated with other data across the organization for effective threat detection.

To help close this gap, Microsoft Sentinel offers Microsoft Sentinel [solutions](../sentinel-solutions-deploy.md) for SAP applications, which use components at every level of Microsoft Sentinel to offer end-to-end detection, analysis, investigation, and response to threats in your SAP environment.

## SIEM and SOAR features and sample architecture

The Microsoft Sentinel solution for SAP applications continuously monitor SAP systems for threats at all layers - business logic, application, database, and OS. It allows you to:

- **Security information and event management (SIEM)**: Correlate SAP monitoring with other signals across your organization. Use out-of-the-box and custom detections to monitor sensitive transactions and other business risks, such as privilege escalation, unapproved changes, and unauthorized access.

- **Security orchestration, automation and response (SOAR)**: Build automated response processes that interact with your SAP systems to stop active security threats.

For example, the following image shows a sample environment where the Microsoft Sentinel solution for SAP applications is deployed. This sample architecture uses a multi-SID SAP landscape with a split between productive and nonproductive systems. All of the systems in this image are onboarded to Microsoft Sentinel for the SAP solution.

:::image type="content" source="media/deployment-overview/sap-sentinel-multi-sid-overview.png" alt-text="Diagram of a multi-SID SAP landscape with Microsoft Sentinel." lightbox="media/deployment-overview/sap-sentinel-multi-sid-overview.png" border="false":::

Microsoft Sentinel also offers solutions for the following SAP environment configurations:

- (Limited preview) The [Microsoft Sentinel SAP Agentless solution](deployment-overview.md#data-connector) offers threat monitoring and detection for the SAP Audit Log only, with an agentless data connector for simpler deployment.
- The [Microsoft Sentinel solution for SAP BTP](sap-btp-solution-overview.md) offers threat monitoring and detection for SAP Business Technology Platform (BTP).

## Threat detection coverage

The Microsoft Sentinel solution for SAP applications supports threat detections such as the following, and more:

- **Suspicious privileges operations**, such as privileged user creation or usage of break-glass users
- **Attempts to bypass SAP security mechanisms**, such as disabling audit logging, or execution of sensitive function modules
- **Backdoor creation (persistency)**, such as creation of new internet facing interfaces (ICF) or directly accessing sensitive tables by remote-function-call
- **Data exfiltration**, such as multiple file downloads or spool takeovers
- **Initial Access**, such as brute force or multiple sign-ins from the same IP

For more information, see [Built-in analytics rules](sap-solution-security-content.md#built-in-analytics-rules).

## Investigation support

Investigate SAP incidents just as you would any other incidents in Microsoft Sentinel and Microsoft Defender. For more information, see:

- [Navigate and investigate incidents in Microsoft Sentinel](../investigate-incidents.md)
- [Investigate and respond with Microsoft Defender XDR](/defender-xdr/incident-response-overview)

## Certification

The Microsoft Sentinel **SAP applications** solution is certified for SAP S/4HANA Cloud, Private Edition RISE with SAP, and SAP S/4 on-premises. It's also certified for ECC/Netweaver.

- The integration scenarios include S/4-BC-XAL 1.0/S/4 EXTERNAL ALERT AND MONITORING 1.0 (for S/4).
- Our certification includes S/4 and SAP Rise S/4 HANA Cloud Private Edition running in any cloud and on-premises.
- We support hybrid deployments that can cover the entire customer estate.

For more information, see the certification on the [SAP Certified Solutions Directory](https://www.sap.com/dmc/exp/2013_09_adpd/enEN/#/solutions?id=s:33db1376-91ae-4f36-a435-aafa892a88d8).

## Solution pricing

While the Microsoft Sentinel **SAP applications** solution is free to install, there's an extra hourly charge for activating and using the solution on production systems.

- The extra hourly charge applies to connected, active  production systems only. Inactive systems aren't subject to charges. If a system's status is unknown to Microsoft Sentinel, such as because of permission issues, it's counted as a production system.
- Microsoft Sentinel identifies a production system by looking at the configuration on the SAP system. 

Microsoft Sentinel ingestion costs might vary and are influenced by the volume of SAP logs ingested. For more information, see:

- [Plan costs and understand Microsoft Sentinel pricing and billing](../billing.md)
- [Reduce costs for Microsoft Sentinel](../billing-reduce-costs.md)
- [Manage and monitor costs for Microsoft Sentinel](../billing-monitor-costs.md)
- [Microsoft Sentinel solution for SAP applications](https://azure.microsoft.com/pricing/offers/microsoft-sentinel-sap-promo/).

## Related content

For more information, see:

- [Deploy Microsoft Sentinel solution for SAP applications](deployment-overview.md)
- [Enable SAP detections and threat protection](deployment-solution-configuration.md)
- [Microsoft Sentinel solution for SAP applications: security content reference](sap-solution-security-content.md)
