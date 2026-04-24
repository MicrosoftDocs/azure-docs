---
title: Integrate Microsoft Sentinel with Traffic Analytics
description: Discover how you can integrate Azure Traffic Analytics with Microsoft Sentinel to detect network threats and anomalies.
author: halkazwini
ms.author: halkazwini
ms.service: azure-network-watcher
ms.topic: how-to
ms.date: 03/16/2026

#customer intent: As a security analyst, I want to detect anomalies in network traffic so that I can assess potential risks and respond to unusual behavior.
---

# Integrate Microsoft Sentinel with Traffic Analytics

Traffic Analytics in Azure Network Watcher processes and aggregates virtual network flow logs to provide visibility into network flows, traffic patterns, and potential security risks. It enriches flow data with threat intelligence, geolocation attributes, and topology context to help identify anomalies and evaluate exposure across your environment.

Traffic Analytics supports integration with Microsoft Sentinel. Microsoft Sentinel is a scalable, cloud-native Security Information and Event Management (SIEM) solution that provides cost-efficient security monitoring across multicloud and multiplatform environments. Microsoft Sentinel uses [ASIM-based parsers](/azure/sentinel/normalization-about-schemas) to normalize incoming data, allowing Traffic Analytics flow data to be transformed into the required schema for correlation, investigation, and threat detection.

Together, Traffic Analytics and Microsoft Sentinel enable both proactive monitoring and reactive investigation. Flow-level telemetry highlights unexpected communication paths, unusual traffic volumes, and indicators of compromise, allowing you to detect deviations from baseline behavior and investigate events with reliable and structured insights.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- Traffic Analytics enabled for your flow logs. For more information, see [Enable or disable traffic analytics](/azure/network-watcher/vnet-flow-logs-manage?tabs=portal#enable-or-disable-traffic-analytics).

- **Contributor** or **Security Admin** access on the workspace.

- [Microsoft Sentinel Contributor](/azure/role-based-access-control/built-in-roles/security#microsoft-sentinel-contributor) role on the resource group that the workspace belongs to.

## Integrate Microsoft Sentinel with Traffic Analytics using the Azure portal

You can easily integrate Microsoft Sentinel with Traffic Analytics directly from the Azure portal.

### Enable Microsoft Sentinel on the workspace

Start by enabling Microsoft Sentinel on the same Log Analytics workspace used by Traffic Analytics. This allows Sentinel to access and analyze Traffic Analytics data without requiring additional configuration or data movement.

1. In the search box at the top of the portal, search for **Microsoft Sentinel**.

1. Select **Create**, then choose the Log Analytics workspace used by Traffic Analytics.

1. Select **Add** to enable Microsoft Sentinel on the workspace.

### Install Network analytics content

Install the required network solution from the Microsoft Sentinel content hub. This provides prebuilt workbooks, analytics rules, and hunting queries designed to analyze normalized network traffic data.

1. Under **Content management** in Microsoft Sentinel, select **Content hub**.

1. Search for **Network Session Essentials**.

1. Select **Network Session Essentials** and then select **Install with dependencies**.

1. Select **Install** to confirm and install the solution.

    :::image type="content" source="media/traffic-analytics-sentinel/network-session-essentials.png" alt-text="Screenshot that shows how to install the Network Session Essentials in Microsoft Sentinel." lightbox="media/traffic-analytics-sentinel/network-session-essentials.png":::

### Enable analytics rules

Enable the relevant network analytics rules to start generating security alerts and incidents. These rules continuously evaluate Traffic Analytics data to detect suspicious or anomalous network behavior.

1. In the **Content hub**, filter by **Content type: Analytics rule**.

1. Search for **Network** to view all available network-related detection rules that can be enabled in your workspace.

1. To enable an Analytics rule, select the rule from the list and then select **Create rule** to create the rule in your workspace and start generating alerts based on matching network activity. This opens the **Analytics rule wizard**

    :::image type="content" source="media/traffic-analytics-sentinel/create-rule.png" alt-text="Screenshot that shows how to create a rule in the workspace." lightbox="media/traffic-analytics-sentinel/create-rule.png":::

1. In the **Set rule logic** tab of **Analytics rule wizard**, review the default rule configuration, including query logic, scheduling frequency, and lookback period. Adjust these settings if required.

    :::image type="content" source="media/traffic-analytics-sentinel/set-rule-logic.png" alt-text="Screenshot that shows the Set rule logic tab in the Analytics rule wizard." lightbox="media/traffic-analytics-sentinel/set-rule-logic.png":::

1. In the **Incident settings** tab, configure how alerts are grouped into incidents.

1. Select **Review + create**, then select **Save** to enable the rule.

    Once enabled, the rule runs automatically on Traffic Analytics data and generates alerts and incidents when matching network activity is detected.

## Detect threats and use AI-assisted investigation capabilities

Microsoft Sentinel uses analytics rules and built-in intelligence to analyze Traffic Analytics data and detect suspicious or malicious network activity. Microsoft Sentinel evaluates normalized network flow data to identify common threat patterns such as reconnaissance, lateral movement, abnormal traffic spikes, and communication with unexpected or high-risk endpoints.

Microsoft Sentinel correlates Traffic Analytics signals with other data sources and threat intelligence to provide high-fidelity detections. By combining network traffic context with MITRE ATT&CK techniques, geolocation, and behavioral analysis, Microsoft Sentinel reduces alert fatigue and surfaces actionable incidents for security teams.

When an incident is generated, Microsoft Sentinel provides AI-assisted investigation experience that helps analysts understand the scope and impact of the activity. Incidents are enriched with entities such as IP addresses, ports, protocols, and network locations derived from Traffic Analytics. Investigation graphs and timelines highlight relationships between network entities and related events.

By integrating Traffic Analytics with Microsoft Sentinel, you enable end-to-end network threat detection and investigation, combining large-scale network visibility with intelligent correlation and automated insights to accelerate response.

| Detection rule | What does it do? | What does it indicate? |
|----|----|----|
| Port scan | Identifies a source IP attempting to connect to multiple destination ports across one or more virtual networks based on Traffic Analytics flow data. | Malicious reconnaissance activity where an attacker is probing for open ports that can be exploited for initial access. |
| Port sweep | Identifies a source IP scanning the same destination port across multiple destination IPs using network flow logs. | Targeted scanning for specific vulnerable services exposed on multiple hosts within the environment. |

## Related content

- [Traffic Analytics Overview](traffic-analytics.md)
- [Traffic Analytics usage scenarios](traffic-analytics-usage-scenarios.md)
- [Traffic Analytics schema and data aggregation](traffic-analytics-schema.md)

