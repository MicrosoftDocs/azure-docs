---
title: OT threat monitoring in enterprise security operation center (SOC) teams - Microsoft Defender for IoT
description: Learn about how integration with Microsoft Sentinel can help security operation center teams bridge the gap between IT and OT security.
ms.date: 03/24/2022
ms.topic: conceptual
---

# OT threat monitoring in enterprise SOCs

As more business-critical industries transform their OT systems to digital IT infrastructures, security operation center (SOC) teams and chief information security officers (CISOs) are increasingly responsible for threats from OT networks.

Together with the new responsibilities, SOC teams deal with new challenges, including:

- **Lack of OT expertise and knowledge** within current SOC teams regarding OT alerts, industrial equipment, protocols, and network behavior. This often translates into vague or minimized understanding of OT incidents and their business impact.

- **Siloed or inefficient communication and processes** between OT and SOC organizations.

- **Limited technology and tools**, including:

    - Lack of visibility and insight into OT networks.

    - Limited insight about events across enterprise IT/OT networks, including tools that don't allow SOC teams to evaluate and link information across data sources in IT/OT environments.

    - Low level of automated security remediation for OT networks.

    - Costly and time-consuming effort needed to integrate OT security solutions into existing SOC solutions.

Without OT telemetry, context and integration with existing SOC tools and workflows, OT security and operational threats may be handled incorrectly, or even go unnoticed.

## Integrate Defender for IoT and Microsoft Sentinel

Microsoft Sentinel is a scalable cloud solution for security information event management (SIEM) security orchestration automated response (SOAR).  SOC teams can use Microsoft Sentinel to collect data across networks, detect and investigate threats, and respond to incidents.

The Defender for IoT and Microsoft Sentinel integration delivers out-of-the-box capabilities to SOC teams. This helps them to efficiently and effectively view, analyze, and respond to OT security alerts, and the incidents they generate in a broader organizational threat context.

Bring Defender for IoT's rich telemetry into Microsoft Sentinel to bridge the gap between OT and SOC teams with the Microsoft Sentinel data connector for Defender for IoT and the **Microsoft Defender for IoT** solution.

The **Microsoft Defender for IoT** solution installs out-of-the-box security content to your Microsoft Sentinel, including analytics rules to automatically open incidents, workbooks to visualize and monitor data, and playbooks to automate response actions.

Once Defender for IoT data is ingested into Microsoft Sentinel, security experts can work with IoT/OT-specific analytics rules, workbooks, and SOAR playbooks, as well as incident mappings to [MITRE ATT&CK for ICS](https://collaborate.mitre.org/attackics/index.php/Overview).

### Workbooks

To visualize and monitor your Defender for IoT data, use the workbooks deployed to your Microsoft Sentinel workspace as part of the **Microsoft Defender for IoT** solution.

Defender for IoT workbooks provide guided investigations for OT entities based on open incidents, alert notifications, and activities for OT assets. They also provide a hunting experience across the MITRE ATT&CK® framework for ICS, and are designed to enable analysts, security engineers, and MSSPs to gain situational awareness of OT security posture.

For example, workbooks can display alerts by any of the following dimensions:

- Type, such as policy violation, protocol violation, malware, and so on
- Severity
- OT device type, such as PLC, HMI, engineering workstation, and so on
- OT equipment vendor
- Alerts over time

Workbooks also show the result of mapping alerts to MITRE ATT&CK for ICS tactics, plus the distribution of tactics by count and time period. For example:

:::image type="content" source="media/concept-sentinel-integration/mitre-attack.png" alt-text="Image of MITRE ATT&CK graph":::

### SOAR playbooks

Playbooks are collections of automated remediation actions that can be run from Microsoft Sentinel as a routine. A playbook can help automate and orchestrate your threat response. It can be run manually or set to run automatically in response to specific alerts or incidents, when triggered by an analytics rule or an automation rule, respectively.

For example, use SOAR playbooks to:

- Open an asset ticket in ServiceNow when a new asset is detected, such as a new engineering workstation. This alert can be an unauthorized device that can be used by adversaries to reprogram PLCs.

- Send an email to relevant stakeholders when suspicious activity is detected, for example unplanned PLC reprogramming. The mail may be sent to OT personnel, such as a control engineer responsible on the related production line.

## Integrated incident timeline

The following table shows how both the OT team, on the Defender for IoT side, and the SOC team, on the Microsoft Sentinel side, can detect and respond to threats fast across the entire attack timeline.

|Microsoft Sentinel  |Step  |Defender for IoT  |
|---------|---------|---------|
|     |      **OT alert triggered**   |  High confidence OT alerts, powered by Defender for IoT's *Section 52* security research group, are triggered based on data ingested to Defender for IoT.      |
|Analytics rules automatically open incidents *only* for relevant use cases, avoiding OT alert fatigue     |  **OT incident created**       |         |
|SOC teams map business impact, including data about the site, line, compromised assets, and OT owners     |   **OT incident business impact mapping**      |         |
|SOC teams move the incident to *Active* and start investigating, using network connections and events, workbooks, and the OT device entity page     |  **OT incident investigation**       |    Alerts are moved to *Active*, and OT teams investigate using PCAP data, detailed reports, and other device details     |
|SOC teams respond with OT playbooks and notebooks     |  **OT incident response**       |  OT teams either suppress the alert or learn it for next time, as needed       |
|After the threat is mitigated, SOC teams close the incident     |  **OT incident closure**       | After the threat is mitigated, OT teams close the alert        |


## Next steps

For more information, see:

- [Tutorial: Connect Microsoft Defender for IoT with Microsoft Sentinel](../../sentinel/iot-solution.md)
- [Detect threats out-of-the-box with Defender for IoT data](../../sentinel/iot-advanced-threat-monitoring.md#detect-threats-out-of-the-box-with-defender-for-iot-data)
- [Create custom analytics rules to detect threats](../../sentinel/detect-threats-custom.md)
- [Tutorial Use playbooks with automation rules in Microsoft Sentinel](../../sentinel/tutorial-respond-threats-playbook.md)