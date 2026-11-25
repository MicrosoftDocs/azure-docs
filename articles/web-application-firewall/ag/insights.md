---
title: Azure Application Gateway WAF Insights
description: Learn how to use Azure Application Gateway WAF Insights to monitor, investigate, and report on web application firewall activity, using Azure Diagnostics or resource-specific logs.
author: YaakobiEden
ms.author: edenyaakobi
ms.service: azure-web-application-firewall
ms.topic: concept-article
ms.date: 11/18/2026
---

# Azure Application Gateway Web Application Firewall (WAF) Insights

WAF Insights for Azure Application Gateway gives you one place to monitor, investigate, and report on WAF activity. Security and operations teams can use it to detect attack patterns, validate WAF policy effectiveness, find false positives and misconfigurations, and respond to incidents faster.

WAF Insights combines high-level trends with request-level evidence. It has two main tabs:

- **Monitor** - built for continuous visibility. It shows total request volume, managed rule matches, custom rule matches, WAF outcomes, and JavaScript challenge and CAPTCHA activity, so operators can spot anomalies and track how well WAF protections are working.
- **Investigate** - built for drill-down analysis. Starting from a rule or from a URL, it narrows down to the affected hosts, URLs, individual requests, and the rules that matched them.

WAF Insights is also available under **Workbooks**, so you can customize and extend it.

> [!NOTE]
> The **Investigate** tab was previously called **Triage**.

To open WAF Insights, go to your Application Gateway WAF policy in the Azure portal and select **Insights**.

## Prerequisites

- A WAF policy associated with an Application Gateway WAF v2 (global, listener, or URI path association).
- Diagnostic settings that send Application Gateway logs to a Log Analytics workspace. Without diagnostic logs, the log-based views show no data. For more information, see [Monitor logs for Azure Web Application Firewall](web-application-firewall-logs.md) and [Diagnostic logs for Application Gateway](../../application-gateway/application-gateway-diagnostics.md).
- Permission to read the WAF policy, the Application Gateway, its metrics, and the Log Analytics workspace.

WAF Insights supports both diagnostic settings collection modes:

| Log category | Required for | Azure Diagnostics mode table | Resource-specific mode table |
|---|---|---|---|
| Application Gateway Firewall Log | All log-based Monitor and Investigate views | `AzureDiagnostics` (`Category == "ApplicationGatewayFirewallLog"`) | `AGWFirewallLogs` |
| Application Gateway Access Log | URL, HTTP method, and status correlation in **Investigate** | `AzureDiagnostics` (`Category == "ApplicationGatewayAccessLog"`) | `AGWAccessLogs` |

Azure Monitor platform metrics are collected automatically and don't require diagnostic settings.

> [!TIP]
> Enable the access log in the same workspace as the firewall log. The URL-based investigation joins WAF events with access log records by transaction ID to show the request URI, HTTP method, and status code.

## Azure workbooks

WAF Insights is built on Azure Monitor workbooks. You can customize, explore, and extend the visualizations to fit your operational and security needs.

## Data sources and architecture

WAF Insights combines metrics and logs, which complement each other:

| Source | Description | Retention | Best for |
|---|---|---|---|
| Metrics | Aggregated WAF counters collected at one-minute intervals. | Azure Monitor metrics retention. | Near real-time anomaly detection and activity trends. |
| Logs - Azure Diagnostics mode | Full per-request WAF and access events in the shared `AzureDiagnostics` table. | Log Analytics workspace retention. | Forensic investigation, compliance, and auditing. |
| Logs - Resource-specific mode | Full per-request WAF and access events in the dedicated `AGWFirewallLogs` and `AGWAccessLogs` tables. | Log Analytics workspace retention. | Same as above, with predictable schemas, simpler queries, and table-level access control. |

> [!IMPORTANT]
> Metrics are ideal for fast anomaly detection but don't contain request details. Logs contain full forensic information but can take longer to query for large time ranges.

### How WAF Insights chooses a log schema

WAF Insights reads both `AzureDiagnostics` and the resource-specific tables, so it works with either collection mode and across a migration from one mode to the other. When the same WAF event was collected in both modes, for example while you run both diagnostic settings in parallel during a migration, WAF Insights counts it only once.

## Monitor tab

The Monitor tab has two views: **Azure WAF Logs** and **Azure WAF Metrics**. Start by selecting the time range and the associations you want to include. In the Logs view, you can select a rule set, rule group, outcome, blocked URI, rule, tracking ID, or source IP to filter the views below it.

WAF Insights shows only the requests that the WAF policy you opened it from processed. If other WAF policies apply to the same Application Gateway, such as a policy on a specific listener or path, their requests aren't included. Charts based on platform metrics are the exception: they include all WAF traffic on the selected Application Gateways. If this WAF policy didn't process any requests in the selected time range, but other WAF policies on the same Application Gateways did, WAF Insights shows a notice that names those policies.

### Azure WAF Logs view

:::image type="content" source="../media/insights/appgw-monitor-logs-summary.png" alt-text="Screenshot of the Azure WAF Logs view in WAF Insights for Application Gateway, showing the summary tiles and the charts of requests by rule set, rule group, and WAF outcome." lightbox="../media/insights/appgw-monitor-logs-summary.png":::

| Visualization | What it shows |
|---|---|
| Summary | Requests with WAF matches, blocked, challenged (JavaScript challenge or CAPTCHA), and logged requests, plus the number of source IPs and rules triggered. The summary covers the selected time range and associations, and doesn't change when you select a segment below it. |
| Requests by Rule Set / Custom Rule | Distinct requests per managed rule set (and version) and custom rules. A request that matches rules in several rule sets is counted in each of them. Select a segment to filter. |
| Requests by Rule Group | Distinct requests per rule group. A request can be counted in more than one group. Select a segment to filter. |
| Requests by WAF Outcome | One final outcome per request, so the segments add up to the number of requests. Select an outcome to filter. |
| Top Blocked Request URIs | The 10 request URIs (path and query string) with the most blocked requests. Select a URI to filter the views below it. |
| Top Rules by Requests Matching | Up to 50 rules, ranked by the number of requests they matched, with the rule description. Select a rule to filter the views below it. |
| Requests Matching Each Rule Over Time | Distinct requests per rule, in one-hour intervals, to correlate spikes with deployments, campaigns, or incidents. |
| Rule Match Details for Current Filters | Time, tracking ID, rule ID, WAF outcome category, action as logged, rule set, rule group, rule description, details, matched data, host, URI, client IP, and log schema for the active filters. |
| Tracking IDs for Selected Rule / Rule Matches for Selected Tracking ID | The requests that matched the selected rule, and every rule that matched one selected request. |
| Source IPs for Selected Rule / Requests for Selected Rule and Source IP | The top 10 source IPs by request count, and the requests from a selected source IP. |

> [!NOTE]
> **Requests by WAF Outcome** counts each request once, based on the highest-priority action observed for it: Blocked > JSChallenge/CAPTCHA > Allowed > Logged. Detected and Matched actions are shown as **Logged**, JavaScript challenge actions (such as JSChallengeIssued or JSChallengeValid) as **JSChallenge**, and a failed challenge (JSChallengeBlock) as **Blocked**. When you select an outcome, the views below it show requests whose final outcome matches your selection.
>
> The detail tables in this view show two action columns: **WAF Outcome Category**, the normalized value that the outcome chart uses, and **Action (as logged)**, the exact value from the WAF log, such as Matched or Detected.
>
> In every table, on both the Monitor and Investigate tabs, Bot Manager rules are shown with a **Bot** prefix, for example **Bot 100100**.

Below the charts, the tables show the top blocked URIs and the top rules, and a chart shows how often each rule matched over time:

:::image type="content" source="../media/insights/appgw-monitor-logs-top-rules.png" alt-text="Screenshot of the Top Blocked Request URIs table, the Top Rules by Requests Matching table, and the Requests Matching Each Rule Over Time chart in WAF Insights for Application Gateway." lightbox="../media/insights/appgw-monitor-logs-top-rules.png":::

The detail tables show every rule match for the active filters. Select a rule or a tracking ID to drill down to individual requests:

:::image type="content" source="../media/insights/appgw-monitor-logs-rule-details.png" alt-text="Screenshot of the Rule Match Details for Current Filters table, with the Tracking IDs for Selected Rule and Rule Matches for Selected Tracking ID tables below it." lightbox="../media/insights/appgw-monitor-logs-rule-details.png":::

To see where the requests that matched a rule came from, select the rule, and then select a source IP:

:::image type="content" source="../media/insights/appgw-monitor-logs-source-ips.png" alt-text="Screenshot of the Source IPs for Selected Rule table and the Requests for Selected Rule and Source IP table." lightbox="../media/insights/appgw-monitor-logs-source-ips.png":::

### Azure WAF Metrics view

The metrics view uses Azure Monitor platform metrics for near real-time visibility:

| Chart | Metric |
|---|---|
| WAF Total Requests | `AzwafTotalRequests` |
| WAF Blocked Requests by Association | `AzwafTotalRequests`, filtered to Action = Block |
| WAF Total Managed Rule Matches | `AzwafSecRule` |
| WAF Managed Rule Matches - Blocked / Non-Blocked | `AzwafSecRule`, filtered to Action = Block / Action ≠ Block |
| WAF Total JS Challenge Request by Association | `AzWAFJSChallengeRequestCount` |
| WAF Total CAPTCHA Requests by Association | `AzWAFCaptchaChallengeRequestCount` |
| WAF Total Custom Rules Matches | `AzwafCustomRule` |

Use metrics to detect sudden traffic surges or changes in rule behavior, then move to the Logs view or the Investigate tab for request-level evidence. For more information, see [Monitoring metrics for Application Gateway WAF](application-gateway-waf-metrics.md).

## Investigate tab

The Investigate tab is built for troubleshooting WAF events. It supports two investigation modes: **Investigate by Rule** and **Investigate by URL**. Except for the first selection, each step is filtered by the selection you made in the previous step.

### Investigate by Rule

Use this mode when a rule ID, rule set, or a noisy rule is your starting point.

1. Select the WAF policy scope (global, listener, or URI path). The table shows each Application Gateway and policy scope with its number of requests, broken down by final WAF outcome (Blocked, JSChallenge, CAPTCHA, Allowed, or Logged). Each request is counted once, the same way as in **Requests by WAF Outcome**. The table includes only the scopes of this WAF policy.
1. Select a triggered rule. The table shows the rule ID, the action as logged, rule set version, rule group, Application Gateway, scope, the number of rule matches, and a trend over the selected time range.
1. Select an impacted host. The list shows the hosts where the selected rule matched with the selected action, and the number of requests for each.
1. Select an impacted URL. The table shows the host, URI, HTTP method, and transaction ID for each matching request.
1. Select an example request to see every rule that matched it, with the action, rule set, rule group, rule ID, message, details, and matched data. A selection summary shows the rule ID, host, URL, and transaction ID.

This flow helps you find which rules drive most of the blocked traffic, detect false positives, and see which hosts and URLs are most affected.

### Investigate by URL

Use this mode when a host, path, API, or a user-reported request is your starting point.

1. Select the WAF policy scope.
1. Select an impacted host.
1. Select an impacted URL. WAF Insights correlates WAF and access logs to show the request URI, original URI, HTTP method, status code, and transaction ID.
1. Review all the rules that matched the selected request, in time order, including the action, rule set, rule group, rule ID, message, details, and matched data.

This flow is useful for investigating suspicious activity on sensitive endpoints, such as sign-in pages, and for checking whether blocked requests are legitimate or malicious.

> [!TIP]
> Before you create an exclusion, reproduce the legitimate request, identify the exact request attribute that matched, and scope the exclusion as narrowly as possible. For more information, see [Troubleshoot Web Application Firewall for Application Gateway](/troubleshoot/azure/web-application-firewall/web-application-firewall-troubleshoot).

## Summary of dashboards

| Dashboard | Purpose | Investigation flow | Example use cases |
|---|---|---|---|
| Monitor - WAF logs | Log-based monitoring | Filter by rule set, rule group, outcome, blocked URI, rule, tracking ID, or source IP | Validate policy effectiveness, audits, request review |
| Monitor - WAF metrics | Metric-based monitoring | Azure Monitor metrics by association | Near real-time monitoring, anomaly detection, trends |
| Investigate by Rule | Investigate by rule ID | Scope → Rule → Host → URL → Request | Identify noisy rules, analyze blocks, tune rules |
| Investigate by URL | Investigate by URL path | Scope → Host → URL → Rules | Investigate attacks on sensitive endpoints, validate rule effectiveness |

## Glossary

- **Association**: The binding between a WAF policy and an Application Gateway (global), listener, or URI path.
- **Scope**: The level at which a WAF policy applies (global, listener, or URI path). In the firewall log, the scope appears as `Global`, `Listener`, or `Location`.
- **Transaction ID**: The Application Gateway request identifier used to correlate WAF and access log records.
- **Rule ID**: The identifier of a managed or Bot Manager rule, as it appears in the WAF log. Bot Manager rules are shown with a **Bot** prefix (for example, Bot 100100).
- **Azure Diagnostics mode**: Diagnostic settings mode that stores logs in the shared `AzureDiagnostics` table.
- **Resource-specific mode**: Diagnostic settings mode that stores Application Gateway logs in dedicated tables such as `AGWFirewallLogs` and `AGWAccessLogs`.
- **LAW (Log Analytics workspace)**: Where logs are stored and queried.
- **Metrics**: Aggregated counters optimized for fast monitoring.

## Limitations and considerations

- **Latency**: Metrics are collected every minute. Logs have a short ingestion delay before they can be queried. For more information, see [Log data ingestion time in Azure Monitor](/azure/azure-monitor/logs/data-ingestion-time).
- **Retention**: Configure Log Analytics retention to match your compliance and audit needs.
- **Scale**: Large volumes of diagnostic logs can increase query latency and storage costs. Narrow the time range or filters for large environments.
- **Mixed collection modes**: WAF Insights counts an event collected in both modes once. To avoid paying for duplicate ingestion, remove the Azure Diagnostics setting after you validate the resource-specific data.
- **Sensitive data**: Matched data and request details can contain sensitive information. Limit access and exports accordingly.

## Best practices

- Enable both metrics and logs, including the access log, to balance visibility and detail.
- Prefer resource-specific mode for new deployments.
- Use the **Monitor** tab daily for operational awareness, and the **Investigate** tab during incidents.
- Periodically review noisy rules in **Investigate by Rule** to tune your WAF configuration.
- Configure alerts on sudden spikes in WAF metrics, such as blocked or challenged requests.
- Share the same transaction ID and time range across security and networking teams so findings are reproducible.

## Related content

- [Azure Front Door WAF Insights](../afds/insights.md)
- [Monitor Azure Application Gateway](../../application-gateway/monitor-application-gateway.md)
- [Diagnostic logs for Application Gateway](../../application-gateway/application-gateway-diagnostics.md)
- [Examining logs using Azure Log Analytics](../../application-gateway/log-analytics.md)
- [Azure Monitor metrics for Application Gateway](../../application-gateway/application-gateway-metrics.md)
- [Monitoring metrics for Application Gateway WAF](application-gateway-waf-metrics.md)
- [Monitor logs for Azure Web Application Firewall](web-application-firewall-logs.md)
- [Azure Workbooks overview](/azure/azure-monitor/visualize/workbooks-overview)
