---
title: OT threat monitoring in enterprise security operation center (SOC) teams - Microsoft Defender for IoT
description: Learn about how integration with Microsoft Sentinel can help security operation center teams bridge the gap between IT and OT security.
ms.date: 03/24/2022
ms.topic: integration
---

# OT threat monitoring in enterprise SOCs

As more business-critical industries transform their OT systems to digital IT infrastructures, security operation center (SOC) teams and chief information security officers (CISOs) are increasingly responsible for threats from OT networks.

Together with the new responsibilities, SOC teams deal with new challenges, including:

- **Lack of OT expertise and knowledge** within current SOC teams regarding OT alerts, industrial equipment, protocols, and network behavior. This often translates into vague or minimized understanding of OT incidents and their business impact.

- **Siloed or inefficient communication and processes** between OT and SOC organizations.

- **Limited technology and tools**, such as lack of visibility or automated security remediation for OT networks. You'll need to evaluate and link information across data sources for OT networks, and integrations with existing SOC solutions may be costly.

However, without OT telemetry, context and integration with existing SOC tools and workflows, OT security and operational threats may be handled incorrectly, or even go unnoticed.

## Integrate Defender for IoT and Microsoft Sentinel

Microsoft Sentinel is a scalable cloud service for security information event management (SIEM) security orchestration automated response (SOAR).  SOC teams can use the integration between Microsoft Defender for Iot and Microsoft Sentinel to collect data across networks, detect and investigate threats, and respond to incidents.

In Microsoft Sentinel, the Defender for IoT data connector and solution brings out-of-the-box security content to SOC teams, helping them to view, analyze and respond to OT security alerts, and understand the generated incidents in the broader organizational threat contents.

Install the Defender for IoT data connector alone to stream your OT network alerts to Microsoft Sentinel. Then, also install the **Microsoft Defender for IoT** solution the extra value of IoT/OT-specific analytics rules, workbooks, and SOAR playbooks, as well as incident mappings to [MITRE ATT&CK for ICS techniques](https://attack.mitre.org/techniques/ics/).

### Integrated detection and response

The following table shows how both the OT team, on the Defender for IoT side, and the SOC team, on the Microsoft Sentinel side, can detect and respond to threats fast across the entire attack timeline.

|Microsoft Sentinel  |Step  |Defender for IoT  |
|---------|---------|---------|
|     |      **OT alert triggered**   |  High confidence OT alerts, powered by Defender for IoT's *Section 52* security research group, are triggered based on data ingested to Defender for IoT.      |
|Analytics rules automatically open incidents *only* for relevant use cases, avoiding OT alert fatigue     |  **OT incident created**       |         |
|SOC teams map business impact, including data about the site, line, compromised assets, and OT owners     |   **OT incident business impact mapping**      |         |
|SOC teams move the incident to *Active* and start investigating, using network connections and events, workbooks, and the OT device entity page     |  **OT incident investigation**       |    Alerts are moved to *Active*, and OT teams investigate using PCAP data, detailed reports, and other device details     |
|SOC teams respond with OT playbooks and notebooks     |  **OT incident response**       |  OT teams either suppress the alert or learn it for next time, as needed       |
|After the threat is mitigated, SOC teams close the incident     |  **OT incident closure**       | After the threat is mitigated, OT teams close the alert        |

### Alert status synchronizations

Alert status changes are synchronized from Microsoft Sentinel to Defender for IoT only, and not from Defender for IoT to Microsoft Sentinel.

If you integrate Defender for IoT with Microsoft Sentinel, we recommend that you manage your alert statuses together with the related incidents in Microsoft Sentinel.

## Microsoft Sentinel incidents for Defender for IoT

After you've configured the Defender for IoT data connector and have IoT/OT alert data streaming to Microsoft Sentinel, use one of the following methods to create incidents based on those alerts:

|Method  |Description  |
|---------|---------|
|**Use the default data connector rule**     | Use the default, **Create incidents based on all alerts generated in Microsoft Defender for IOT** analytics rule provided with the data connector. This rule creates a separate incident in Microsoft Sentinel for each alert streamed from Defender for IoT.        |
|**Use out-of-the-box solution rules**     |  Enable some or all of the [out-of-the-box analytics rules](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-unifiedmicrosoftsocforot?tab=Overview) provided with the **Microsoft Defender for IoT** solution.<br><br>    These analytics rules help to reduce alert fatigue by creating incidents only in specific situations. For example, you might choose to create incidents for excessive login attempts, but for multiple scans detected in the network.       |
|**Create custom rules**     | Create custom analytics rules to create incidents based only on your specific needs. You can use the out-of-the-box analytics rules as a starting point, or create rules from scratch.   <br><br>Add the following filter to prevent duplicate incidents for the same alert ID: `| where TimeGenerated <= ProcessingEndTime + 60m`     |

Regardless of the method you choose to create alerts, only one incident should be created for each Defender for IoT alert ID.

## Microsoft Sentinel workbooks for Defender for IoT

To visualize and monitor your Defender for IoT data, use the workbooks deployed to your Microsoft Sentinel workspace as part of the **Microsoft Defender for IoT** solution.

Defender for IoT workbooks provide guided investigations for OT entities based on open incidents, alert notifications, and activities for OT assets. They also provide a hunting experience across the MITRE ATT&CK® framework for ICS, and are designed to enable analysts, security engineers, and MSSPs to gain situational awareness of OT security posture.

Workbooks can display alerts by type, severity, OT device type or vendor, or alerts over time. Workbooks also show the result of mapping alerts to MITRE ATT&CK for ICS tactics, plus the distribution of tactics by count and time period. For example:

:::image type="content" source="media/concept-sentinel-integration/mitre-attack.png" alt-text="Image of MITRE ATT&CK graph":::

## SOAR playbooks for Defender for IoT

Playbooks are collections of automated remediation actions that can be run from Microsoft Sentinel as a routine. A playbook can help automate and orchestrate your threat response. It can be run manually or set to run automatically in response to specific alerts or incidents, when triggered by an analytics rule or an automation rule, respectively.

For example, use SOAR playbooks to:

- Open an asset ticket in ServiceNow when a new asset is detected, such as a new engineering workstation. This alert can be an unauthorized device that can be used by adversaries to reprogram PLCs.

- Send an email to relevant stakeholders when suspicious activity is detected, for example unplanned PLC reprogramming. The mail may be sent to OT personnel, such as a control engineer responsible on the related production line.

## Comparing Defender for IoT events, alerts, and incidents

This section clarifies the differences between Defender for IoT events, alerts, and incidents in Microsoft Sentinel. Use the listed queries to view a full list of the current events, alerts, and incidents for your OT networks.

You'll typically see more Defender for IoT *events* in Microsoft Sentinel than *alerts*, and more Defender for IoT *alerts* than *incidents*.

### Defender for IoT events in Microsoft Sentinel

Each alert log that streams to Microsoft Sentinel from Defender for IoT is an *event*. If the alert log reflects a new or updated alert in Defender for IoT, a new record is added to the **SecurityAlert** table.

To view all Defender for IoT events in Microsoft Sentinel, run the following query on the **SecurityAlert** table:

```kql
SecurityAlert
| where ProviderName == 'IoTSecurity' or ProviderName == 'CustomAlertRule'
Instead
```

### Defender for IoT alerts in Microsoft Sentinel

Microsoft Sentinel creates alerts based on your current analytics rules and the alert logs listed in the **SecurityAlert** table. If you don't have any active analytics rules for Defender for IoT, Microsoft Sentinel considers each alert log as an *event*.

To view alerts in Microsoft Sentinel, run the following query on the**SecurityAlert** table:
```kql
SecurityAlert
| where ProviderName == 'ASI Scheduled Alerts' or ProviderName =='CustomAlertRule'
```

After you've installed the Microsoft Defender for IoT solution and deployed the [AD4IoT-AutoAlertStatusSync](iot-advanced-threat-monitoring.md#update-alert-statuses-in-defender-for-iot) playbook, alert status changes are synchronized from Microsoft Sentinel to Defender for IoT. Alert status changes are *not* synchronized from Defender for IoT to Microsoft Sentinel.

> [!IMPORTANT]
> We recommend that you manage your alert statuses together with the related incidents in Microsoft Sentinel. For more information, see [Work with incident tasks in Microsoft Sentinel](../../sentinel/work-with-tasks.md).
>

### Defender for IoT incidents in Microsoft Sentinel

Microsoft Sentinel creates incidents based on your analytics rules. You might have several alerts grouped in the same incident, or you may have analytics rules configured to *not* create incidents for specific alert types.

To view incidents in Microsoft Sentinel, run the following query:
```kql
SecurityIncident
```

## Next steps

For more information, see:

- [Tutorial: Connect Microsoft Defender for IoT with Microsoft Sentinel](../../sentinel/iot-solution.md)
- [Detect threats out-of-the-box with Defender for IoT data](../../sentinel/iot-advanced-threat-monitoring.md#detect-threats-out-of-the-box-with-defender-for-iot-data)
- [Create custom analytics rules to detect threats](../../sentinel/detect-threats-custom.md)
- [Tutorial Use playbooks with automation rules in Microsoft Sentinel](../../sentinel/tutorial-respond-threats-playbook.md)