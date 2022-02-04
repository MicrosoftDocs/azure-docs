---
title: OT threat monitoring in enterprise SOCs
description: Learn about how integration with Microsoft Sentinel can help SOC teams bridge the gap between IT and OT security sectors
ms.date: 01/02/2022
ms.topic: article
---

# OT threat monitoring in enterprise SOCs

This article describes how integration with Microsoft Sentinel can help SOC teams bridge the gap between IT and OT security sectors.

## About the digital transformation in business-critical industries

As the digital transformation in business-critical industries connects OT systems with IT infrastructures, the OT/IT convergence puts data, systems, and safety at risk.  

As a result, CISOs and Security Operations Center (SOC) teams are becoming increasingly responsible for threats from OT network segments that they traditionally did not handle.

This means SOC teams must deal with various new challenges, including:

**People**

- Lack of OT expertise and knowledge within current SOC teams regarding OT alerts, industrial equipment, protocols, and network behavior. This often translates into vague or minimized understanding of OT incidents and their business impact.

**Processes** 

- Siloed or inefficient communication and processes between OT and SOC organizations.

**Technology and Tools** 

- Lack of visibility and insight into OT networks.

- Limited insight about events across enterprise IT/OT networks, including tools that don't allow SOC teams to evaluate and link information across data sources in IT/OT environments.  

- Low level of automated security remediation for OT networks.

- Costly and time-consuming effort needed to integrate OT security solutions into existing SOC solutions.  

Without OT telemetry, context and integration with existing SOC tools and workflows, OT security and operational threats may be handled incorrectly, or even go unnoticed.  

## About Microsoft Sentinel

Microsoft Sentinel is a scalable, cloud-native, security information event management (SIEM) and, security orchestration automated response (SOAR) solution that lets users:

- Collect data at cloud scale across all users, devices, applications, and infrastructure, both on-premises and in multiple clouds.

- Detect previously undetected threats and minimize false positives using Microsoft's analytics and unparalleled threat intelligence.

- Investigate threats with artificial intelligence, and hunt for suspicious activities at scale, tapping into years of cyber security work at Microsoft.

- Respond to incidents rapidly with built-in orchestration and automation of common tasks.

## About the Defender for IoT and Microsoft Sentinel Integration

By bringing rich telemetry into Microsoft Sentinel from Microsoft Defender for IoT, SOC teams can bridge the gap between IT and OT security sectors. This allows SOC teams to detect and respond faster during the entire attack timeline—enhancing communication, processes, and response time for both security analysts and OT personnel. 

:::image type="content" source="media/concept-sentinel-integration/chart-small.png" alt-text="Screenshot of a chart showing alert flow." lightbox="media/concept-sentinel-integration/chart-large.png":::

To set up the integration, see [Integrate Microsoft Defender for IoT and Microsoft Sentinel](../../sentinel/iot-solution.md?tabs=use-out-of-the-box-analytics-rules-recommended).

## OT Security

This section describes how the integration helps you handled OT threats.

**OT Security Alerts**

The Defender for IoT and Microsoft Sentinel integration delivers out-of-the-box capabilities to SOC teams to help them efficiently and effectively view, analyze, and respond to OT security alerts, and the incidents they generate in a broader organizational threat context.

Once ingested into Sentinel, security experts can work with IoT/OT-specific analytics rules, workbooks, and SOAR playbooks, as well as incident mappings to MITRE ATT&CK for ICS.

**MITRE ATT&CK for ICS**

MITRE ATT&CK® for ICS is a knowledge base used for describing the actions an adversary may take while operating within an ICS network. The knowledge base can be used to better characterize and describe post-compromise adversary behavior.  

The Microsoft Defender for IoT integration delivers a library of mappings that link Microsoft Sentinel incidents to MITRE ATT&CK for ICS tactics.

:::image type="content" source="media/concept-sentinel-integration/alert-incident.png" alt-text="Screenshot of a MITRE ATT&CK in Sentinel.":::

## Workbooks, analytics rules, and SOAR playbooks

This section describes how Microsoft Sentinel workbooks, analytics rules, and SOAR playbooks help you monitor and respond to OT threats.

### Workbooks

To visualize and monitor your Defender for IoT data, use the workbooks deployed to your Microsoft Sentinel workspace as part of the IoT OT Threat Monitoring with Defender for IoT solution.

Defenders for IoT workbooks provide guided investigations for OT entities based on open incidents, alert notifications, and activities for OT assets. They also provide a hunting experience across the MITRE ATT&CK® framework for ICS, and are designed to enable analysts, security engineers, and MSSPs to gain situational awareness of OT security posture.

For example:  

**Alert workbooks** 

Microsoft Sentinel Alert Workbooks show alerts by:
- Type (policy violation, protocol violation, malware, etc.)
- Severity
- OT device type (PLC, HMI, engineering workstation, etc.)
- OT equipment vendor
- Alerts over time

**MITRE ATT&CK for ICS Workbook** 

Microsoft Sentinel MITRE ATT&CK for ICS workbooks show the result of mapping alerts to MITRE ATT&CK for ICS tactics, plus the distribution of tactics by count and time period.

:::image type="content" source="media/concept-sentinel-integration/mitre-attack.png" alt-text="Image of Mitre attack graph":::

The Workbooks are described in the [Visualize and monitor Defender for IoT data](../../sentinel/iot-solution.md?tabs=use-out-of-the-box-analytics-rules-recommended)
section of the integration tutorial. Workbooks are deployed to your Microsoft Sentinel workspace as part of the IoT OT Threat Monitoring with Defender for IoT solution.

### Analytics rules

Create Microsoft Sentinel incidents for relevant alerts generated by Defender for IoT, either by using out-of-the-box analytics rules provided in the IoT OT Threat Monitoring with Defender for IoT solution, configuring analytics rules manually, or by configuring your data connector to automatically create incidents for all alerts generated by Defender for IoT.

The Analytics rules are described in the [Detect threats out-of-the-box with Defender for IoT data](../../sentinel/iot-solution.md?tabs=use-out-of-the-box-analytics-rules-recommended) section of the integration tutorial. The rules are deployed to your Microsoft Sentinel workspace as part of the IoT OT Threat Monitoring with Defender for IoT solution.

### SOAR playbooks

Playbooks are collections of automated remediation actions that can be run from Microsoft Sentinel as a routine. A playbook can help automate and orchestrate your threat response. It can be run manually or set to run automatically in response to specific alerts or incidents, when triggered by an analytics rule or an automation rule, respectively.

Use SOAR playbooks, for example to:  

- Open an asset ticket in ServiceNow when a new asset is detected, such as a new engineering workstation. This can either be an unauthorized device that can be used by adversaries to reprogram PLCs.

- Send an email to relevant stakeholders when suspicious activity is detected, for example unplanned PLC reprogramming. The mail may be sent to OT personnel, such as a control engineer responsible on the related production line.

The playbooks are described in the [Automate response to Defender for IoT alerts](../../sentinel/iot-solution.md?tabs=use-out-of-the-box-analytics-rules-recommended) section of the integration tutorial. 

Playbooks are deployed to your Microsoft Sentinel workspace as part of the IoT OT Threat Monitoring with Defender for IoT solution.

## Next steps

- [Integrate Microsoft Defender for IoT and Microsoft Sentinel](../../sentinel/iot-solution.md?tabs=use-out-of-the-box-analytics-rules-recommended)

- [Detect threats out-of-the-box with Defender for IoT data](../../sentinel/detect-threats-custom.md)

- [Tutorial Use playbooks with automation rules in Microsoft Sentinel](../../sentinel/tutorial-respond-threats-playbook.md)