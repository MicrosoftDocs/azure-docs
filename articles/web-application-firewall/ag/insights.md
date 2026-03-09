---
title: Azure Application Gateway WAF Insights (Preview)
description: Learn how to use Azure Application Gateway WAF insights dashboards to monitor, investigate, and report on web application firewall activity.
author: halkazwini
ms.author: halkazwini
ms.service: azure-web-application-firewall
ms.topic: concept-article
ms.date: 02/20/2026
---

# Azure Application Gateway Web Application Firewall (WAF) Insights (preview)

> [!IMPORTANT]
> The WAF Insights for Azure Application Gateway is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

The WAF Insights dashboards for Azure Application Gateway provide a unified experience for monitoring, investigation, and reporting of WAF activity. They help security and operations teams detect attack patterns, validate WAF policy effectiveness, identify misconfigurations, and accelerate incident response through deep drill-down analysis. By combining high-level visibility with detailed request-level insights, the dashboards support both strategic monitoring and hands-on troubleshooting.

The solution includes two main dashboards:

**Monitor tab** - designed for continuous visibility. It surfaces high-level metrics and trends such as total request volumes, managed rule matches, custom rule matches, and JavaScript challenge activity. The Monitor tab helps operators detect anomalies, track the effectiveness of WAF protections, and understand overall application security posture at a glance.

**Triage tab** - designed for investigation. It provides drill-down views to identify affected hosts, URLs, requests, and rules involved in a specific security event. This supports root cause analysis and faster incident response.


## Prerequisites

To view WAF data in the dashboards, **Diagnostic Settings** must be enabled for the Application Gateway associations you want to monitor. Without diagnostic logs, no WAF data will be available in the dashboards. To learn more about how to enable diagnostic settings, see [Monitor logs for Azure Web Application Firewall](/azure/web-application-firewall/ag/web-application-firewall-logs?tabs=AppGW) and [Diagnostic logs - Azure Application Gateway](/azure/application-gateway/application-gateway-diagnostics)

## Azure workbooks

Both dashboards are implemented as Azure Monitor workbooks, allowing customization, exploration, and extension of visualizations based on operational and security needs.

## Data sources and architecture

The dashboards combine **Metrics** and **Logs**, which complement each other:

| Source | Description | Retention | Best for |
|----|----|----|----|
| **Metrics** | Aggregated counters collected at minute intervals. Optimized for trend analysis. | Controlled by Azure Monitor metrics retention settings. | Near real-time anomaly detection, activity trends. |
| **Logs (Azure diagnostics)** | Full per-request event data from WAF diagnostic logging. | Controlled by Log Analytics Workspace retention policy. | Deep forensic investigation, compliance, and auditing. |

> [!IMPORTANT]
> - Metrics are ideal for fast anomaly detection but don't contain full request details.
> - Logs contain full forensic information but may take longer to query for large datasets.

## Dashboard structure

The WAF Insights experience is divided into two main tabs:

- **Monitor** - High-level reporting and trend tracking.

- **Triage** - Drill-down investigations of events.

Each tab offers a different perspective and is often used together: monitor overall health in the **Monitor tab**, then use the **Triage tab** to investigate anomalies.

### Monitor tab

The Monitor tab provides visibility and reporting through two main views – **WAF logs** and **WAF metrics**.

The **WAF logs** view gives a detailed request-level perspective sourced from the AzureDiagnostics table in LAW. It includes visualizations such as total WAF requests by rule group, WAF actions by type (for example, Blocked), top blocked URIs, top triggered rules, rules over time, and details of triggered rule events with timestamps, hosts, AppGW instances, and client IPs. Analysts can also correlate data by tracking ID, review top offending IPs, and inspect related requests to detect targeted attacks, validate rule effectiveness, and support audits or compliance reviews.

:::image type="content" source="../media/insights/insights-dashboard-monitor-tab.png" alt-text="Screenshot of the monitor tab of the WAF insights dashboard." lightbox="../media/insights/insights-dashboard-monitor-tab.png":::

The **WAF metrics** view provides near real-time visibility into WAF activity using Azure Monitor metrics. It includes visualizations showing total WAF requests, managed rule matches by association (both blocked and non-blocked), JS challenge request counts, and custom rule matches. This data helps detect sudden traffic surges, monitor rule behavior, evaluate JS challenge enforcement, and verify correct policy configuration. Metrics offer an operational perspective that complements the detailed forensic insights provided by logs.

:::image type="content" source="../media/insights/insights-dashboard-waf-metrics.png" alt-text="Screenshot of the Azure WAF metrics tab of the WAF insights dashboard." lightbox="../media/insights/insights-dashboard-waf-metrics.png":::

### Triage tab

The Triage tab is built for investigation and troubleshooting of WAF events. It uses data from AzureDiagnostics within the Log Analytics Workspace (LAW) and supports two investigation modes: **Triage by Rule** and **Triage by URL**.
Except for the first visualization, each component dynamically filters based on selections from the previous step, allowing a natural drill-down flow that narrows from a broad scope to specific impacted requests.

#### Triage by rule

In **Triage by Rule**, investigation starts from a triggered rule. The flow begins with selecting the WAF policy scope (Listener, URI Path, or Global). Next, you can view an overview of triggered rules, including rule ID, action, ruleset version, scope, and the number of impacted requests. From there, the investigation drills down to the affected hosts, URLs, and individual transactions. This approach helps identify which rules are responsible for most of the blocked traffic, detect false positives, and understand which hosts and URLs are most affected.

:::image type="content" source="../media/insights/insights-dashboard-triage-tab.png" alt-text="Screenshot of the triage tab of the WAF insights dashboard." lightbox="../media/insights/insights-dashboard-triage-tab.png":::

#### Triage by URL

In **Triage by URL**, investigation begins with a URL path. Analysts select the relevant Application Gateway and policy scope, identify the hosts or IPs targeting specific URLs, and view the rules triggered for those impacted requests. This approach is useful for investigating suspicious activity on sensitive endpoints such as login pages, verifying whether blocked requests are legitimate or malicious, and mapping attack patterns across URLs.

## Summary of dashboards

| **Dashboard** | **Purpose** | **Investigation flow** | **Example use cases** |
|----|----|----|----|
| **Monitor - WAF logs** | Log-based monitoring | Pulls structured data from LAW | Validate policy effectiveness, perform audits, investigate requests |
| **Monitor - WAF metrics** | Metric-based monitoring | Uses Azure Monitor metrics | Near real-time monitoring, detect anomalies, track trends |
| **Triage by rule** | Investigate by rule ID | Scope → Rule → Hosts → URLs → Requests | Identify noisy rules, analyze blocks, fine-tune rules |
| **Triage by URL** | Investigate by URL path | Scope → URL → Hosts → Rules → Requests | Investigate attacks on sensitive endpoints, validate rule effectiveness |

## Glossary

**Association**: The binding between a WAF policy and an Application Gateway listener or path.

**Scope**: The level at which a WAF policy applies (Listener, URI Path, Global).

**Rule ID**: Identifier of a managed rule triggered by the WAF.

**LAW (Log Analytics workspace)**: Repository where logs are stored and queried.

**Metrics**: Aggregated counters optimized for fast monitoring.

## Limitations and considerations

- **Latency:** Metrics are near real-time, but Logs may have ingestion delay (typically 1-5 minutes).

- **Retention:** Ensure Log Analytics retention is configured to match compliance/audit needs.

- **Scale:** Large volumes of diagnostic logs can increase query latency and storage costs.

- **Resource-specific mode:** Resource-specific tables are currently not supported. The solution relies on Diagnostic settings streaming to Log Analytics in Azure Diagnostics mode only.

## Best practices

- Always enable **both metrics and logs** to balance visibility and detail.

- Use the **Monitor tab daily** for operational awareness, and the **Triage tab on demand** during incidents.

- Periodically review *noisy rules* in the **Triage by rule** view to fine-tune WAF configuration.

- Configure alerts on **sudden spikes** in WAF metrics (for example, challenge requests or blocked requests).

- Align dashboard use with **incident response workflows**, ensuring security and networking teams collaborate using the same views.

## Related content

- [Monitor Azure Application Gateway](/azure/application-gateway/monitor-application-gateway)

- [Examining logs using Azure Log Analytics - Azure Application Gateway](/azure/application-gateway/log-analytics)

- [Diagnostic logs - Azure Application Gateway](/azure/application-gateway/application-gateway-diagnostics)

- [Azure Monitor metrics for Application Gateway](/azure/application-gateway/application-gateway-metrics)

- [Azure Workbooks overview - Azure Monitor](/azure/azure-monitor/visualize/workbooks-overview)

- [Monitoring metrics for Azure Application Gateway Web Application Firewall](/azure/web-application-firewall/ag/application-gateway-waf-metrics)

- [Monitor logs for Azure Web Application Firewall](/azure/web-application-firewall/ag/web-application-firewall-logs?tabs=AppGW)

