---
title: Deploy Microsoft Sentinel side-by-side to an existing SIEM.
description: Learn how to deploy Microsoft Sentinel side-by-side to an existing SIEM.
author: limwainstein
ms.topic: conceptual
ms.date: 05/30/2022
ms.author: lwainstein
---

# Deploy Microsoft Sentinel side-by-side to an existing SIEM

Your security operations center (SOC) team uses centralized security information and event management (SIEM) and security orchestration, automation, and response (SOAR) solutions to protect your increasingly decentralized digital estate.

This article describes how to deploy Microsoft Sentinel in a side-by-side configuration together with your existing SIEM.

## Select a side-by-side approach and method

Use a side-by-side architecture either as a short-term, transitional phase that leads to a completely cloud-hosted SIEM, or as a medium- to long-term operational model, depending on the SIEM needs of your organization.

For example, while the recommended architecture is to use a side-by-side architecture just long enough to complete a migration to Microsoft Sentinel, your organization may want to stay with your side-by-side configuration for longer, such as if you aren't ready to move away from your legacy SIEM. Typically, organizations who use a long-term, side-by-side configuration use Microsoft Sentinel to analyze only their cloud data.

Consider the pros and cons for each approach when deciding which one to use.

> [!NOTE]
> Many organizations avoid running multiple on-premises analytics solutions because of cost and complexity.
>
> Microsoft Sentinel provides [pay-as-you-go pricing](billing.md) and flexible infrastructure, giving SOC teams time to adapt to the change. Deploy and test your content at a pace that works best for your organization, and learn about how to [fully migrate to Microsoft Sentinel](migration.md).
>
### Short-term approach

|**Pros**  |**Cons**  |
|---------|---------|
|• Gives SOC staff time to adapt to new processes as you deploy workloads and analytics.<br><br>• Gains deep correlation across all data sources for hunting scenarios.<br><br>• Eliminates having to do analytics between SIEMs, create forwarding rules, and close investigations in two places.<br><br>• Enables your SOC team to quickly downgrade legacy SIEM solutions, eliminating infrastructure and licensing costs.     |• Can require a steep learning curve for SOC staff.         |

### Medium- to long-term approach

|**Pros**  |**Cons**  |
|---------|---------|
|• Lets you use key Microsoft Sentinel benefits, like AI, ML, and investigation capabilities, without moving completely away from your legacy SIEM.<br><br>• Saves money compared to your legacy SIEM, by analyzing cloud or Microsoft data in Microsoft Sentinel. |• Increases complexity by separating analytics across different databases.<br><br>• Splits case management and investigations for multi-environment incidents.<br><br>• Incurs greater staff and infrastructure costs.<br><br>• Requires SOC staff to be knowledgeable about two different SIEM solutions.         |

### Send alerts from a legacy SIEM to Microsoft Sentinel (Recommended)

Send alerts, or indicators of anomalous activity, from your legacy SIEM to Microsoft Sentinel.

- Ingest and analyze cloud data in Microsoft Sentinel
- Use your legacy SIEM to analyze on-premises data and generate alerts.
- Forward the alerts from your on-premises SIEM into Microsoft Sentinel to establish a single interface.

For example, forward alerts using [Logstash](connect-logstash.md), [APIs](/rest/api/securityinsights/), or [Syslog](connect-syslog.md), and store them in [JSON](https://techcommunity.microsoft.com/t5/azure-sentinel/tip-easily-use-json-fields-in-sentinel/ba-p/768747) format in your Microsoft Sentinel [Log Analytics workspace](../azure-monitor/logs/quick-create-workspace.md).

By sending alerts from your legacy SIEM to Microsoft Sentinel, your team can cross-correlate and investigate those alerts in Microsoft Sentinel. The team can still access the legacy SIEM for deeper investigation if needed. Meanwhile, you can continue deploying data sources over an extended transition period.

This recommended, side-by-side deployment method provides you with full value from Microsoft Sentinel and the ability to deploy data sources at the pace that's right for your organization. This approach avoids duplicating costs for data storage and ingestion while you move your data sources over.

For more information, see:

- [Migrate QRadar offenses to Microsoft Sentinel](https://techcommunity.microsoft.com/t5/azure-sentinel/migrating-qradar-offenses-to-azure-sentinel/ba-p/2102043)
- [Export data from Splunk to Microsoft Sentinel](https://techcommunity.microsoft.com/t5/azure-sentinel/how-to-export-data-from-splunk-to-azure-sentinel/ba-p/1891237).

If you want to fully migrate to Microsoft Sentinel, review the full [migration guide](migration.md).

### Send alerts and enriched incidents from Microsoft Sentinel to a legacy SIEM

Analyze some data in Microsoft Sentinel, such as cloud data, and then send the generated alerts to a legacy SIEM. Use the *legacy* SIEM as your single interface to do cross-correlation with the alerts that Microsoft Sentinel generated. You can still use Microsoft Sentinel for deeper investigation of the Microsoft Sentinel-generated alerts.

This configuration is cost effective, as you can move your cloud data analysis to Microsoft Sentinel without duplicating costs or paying for data twice. You still have the freedom to migrate at your own pace. As you continue to shift data sources and detections over to Microsoft Sentinel, it becomes easier to migrate to Microsoft Sentinel as your primary interface. However, simply forwarding enriched incidents to a legacy SIEM limits the value you get from Microsoft Sentinel's investigation, hunting, and automation capabilities.

For more information, see:

- [Send enriched Microsoft Sentinel alerts to your legacy SIEM](https://techcommunity.microsoft.com/t5/azure-sentinel/sending-enriched-azure-sentinel-alerts-to-3rd-party-siem-and/ba-p/1456976)
- [Send enriched Microsoft Sentinel alerts to IBM QRadar](https://techcommunity.microsoft.com/t5/azure-sentinel/azure-sentinel-side-by-side-with-qradar/ba-p/1488333)
- [Ingest Microsoft Sentinel alerts into Splunk](https://techcommunity.microsoft.com/t5/azure-sentinel/azure-sentinel-side-by-side-with-splunk/ba-p/1211266)

### Other methods

The following table describes side-by-side configurations that are *not* recommended, with details as to why:

|Method  |Description  |
|---------|---------|
|**Send Microsoft Sentinel logs to your legacy SIEM**     |  With this method, you'll continue to experience the cost and scale challenges of your on-premises SIEM. <br><br>You'll pay for data ingestion in Microsoft Sentinel, along with storage costs in your legacy SIEM, and you can't take advantage of Microsoft Sentinel's SIEM and SOAR detections, analytics, User Entity Behavior Analytics (UEBA), AI, or investigation and automation tools.       |
|**Send logs from a legacy SIEM to Microsoft Sentinel**     |   While this method provides you with the full functionality of Microsoft Sentinel, your organization still pays for two different data ingestion sources. Besides adding architectural complexity, this model can result in higher costs.     |
|**Use Microsoft Sentinel and your legacy SIEM as two fully separate solutions**     |  You could use Microsoft Sentinel to analyze some data sources, like your cloud data, and continue to use your on-premises SIEM for other sources. This setup allows for clear boundaries for when to use each solution, and avoids duplication of costs. <br><br>However, cross-correlation becomes difficult, and you can't fully diagnose attacks that cross both sets of data sources. In today's landscape, where threats often move laterally across an organization, such visibility gaps can pose significant security risks.       |

## Use automation to streamline processes

Use automated workflows to group and prioritize alerts into a common incident, and modify its priority.

For more information, see:

- [Security Orchestration, Automation, and Response (SOAR) in Microsoft Sentinel](automation.md).
- [Automate threat response with playbooks in Microsoft Sentinel](automate-responses-with-playbooks.md)
- [Automate incident handling in Microsoft Sentinel with automation rules](automate-incident-handling-with-automation-rules.md)

## Next steps

Explore Microsoft's Microsoft Sentinel resources to expand your skills and get the most out of Microsoft Sentinel.

Also consider increasing your threat protection by using Microsoft Sentinel alongside [Microsoft 365 Defender](./microsoft-365-defender-sentinel-integration.md) and [Microsoft Defender for Cloud](../security-center/azure-defender.md) for [integrated threat protection](https://www.microsoft.com/security/business/threat-protection). Benefit from the breadth of visibility that Microsoft Sentinel delivers, while diving deeper into detailed threat analysis.

For more information, see:

- [Rule migration best practices](https://techcommunity.microsoft.com/t5/azure-sentinel/best-practices-for-migrating-detection-rules-from-arcsight/ba-p/2216417)
- [Webinar: Best Practices for Converting Detection Rules](https://www.youtube.com/watch?v=njXK1h9lfR4)
- [Security Orchestration, Automation, and Response (SOAR) in Microsoft Sentinel](automation.md)
- [Manage your SOC better with incident metrics](manage-soc-with-incident-metrics.md)
- [Microsoft Sentinel learning path](/training/paths/security-ops-sentinel/)
- [SC-200 Microsoft Security Operations Analyst certification](/certifications/exams/sc-200)
- [Microsoft Sentinel Ninja training](https://techcommunity.microsoft.com/t5/azure-sentinel/become-an-azure-sentinel-ninja-the-complete-level-400-training/ba-p/1246310)
- [Investigate an attack on a hybrid environment with Microsoft Sentinel](https://mslearn.cloudguides.com/guides/Investigate%20an%20attack%20on%20a%20hybrid%20environment%20with%20Azure%20Sentinel)
