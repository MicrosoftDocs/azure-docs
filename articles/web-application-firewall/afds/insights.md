---
title: Azure Front Door WAF Insights
description: Learn how to use Azure Front Door WAF Insights to monitor, investigate, and report on web application firewall activity.
author: YaakobiEden
ms.author: edenyaakobi
ms.service: azure-web-application-firewall
ms.topic: concept-article
ms.date: 11/02/2026
---

# Azure Front Door Web Application Firewall (WAF) Insights

WAF Insights for Azure Front Door gives you one place to monitor, investigate, and report on WAF activity. Security and operations teams can use it to detect attack patterns, validate WAF policy effectiveness, find false positives and misconfigurations, and respond to incidents faster.

WAF Insights combines high-level trends with request-level evidence. It has two main tabs:

- **Monitor** - built for continuous visibility. It shows request volume, managed and custom rule matches, WAF actions, and JavaScript challenge and CAPTCHA activity, so operators can spot anomalies and track how well WAF protections are working.
- **Investigate** - built for drill-down analysis. Starting from a rule or from a URL, it narrows down to the affected hosts, URLs, individual requests, and the rules that matched them.

WAF Insights is also available under **Workbooks**, so you can customize and extend it.

To open WAF Insights, go to your Azure Front Door WAF policy in the Azure portal and select **Insights**.

## Prerequisites

- A WAF policy associated with an Azure Front Door Standard or Premium profile. Managed rule sets are available only on the Premium tier, so on the Standard tier WAF Insights shows custom rule activity only.

  Azure Front Door (classic) profiles are also supported in the log-based views. The platform-metric charts in the **Azure WAF Metrics** view show data for Standard and Premium profiles only. Azure Front Door (classic) retires on March 31, 2027.
- Diagnostic settings on the Front Door profile that send logs to a Log Analytics workspace. Without diagnostic logs, WAF Insights shows no data. For more information, see [Azure Web Application Firewall monitoring and logging](waf-front-door-monitor.md).
- Permission to read the WAF policy, the Front Door profile, and the Log Analytics workspace.

| Log category | Required for | Table |
|---|---|---|
| Front Door Web Application Firewall Log | All Monitor and Investigate views | `AzureDiagnostics` (`Category == "FrontDoorWebApplicationFirewallLog"`) |
| Front Door Access Log | URL, HTTP method, and status correlation in **Investigate** | `AzureDiagnostics` (`Category == "FrontDoorAccessLog"`) |

> [!TIP]
> Send the access log to the same workspace as the WAF log. The URL-based investigation joins WAF events with access log records by tracking reference to show the request URI, HTTP method, and status code.

## Azure workbooks

WAF Insights is built on Azure Monitor workbooks. You can customize, explore, and extend the visualizations to fit your operational and security needs.

## Data sources and architecture

WAF Insights combines Azure Monitor platform metrics with WAF and access logs in your Log Analytics workspace. It also uses Azure Resource Graph to find the Front Door profiles associated with the WAF policy:

| Source | Description | Retention | Best for |
|---|---|---|---|
| Metrics | Aggregated WAF counters, collected automatically without diagnostic settings. | Azure Monitor metrics retention. | Near real-time activity trends. |
| WAF log | One record per rule match, including the rule, action, policy, host, client IP, and tracking reference. | Log Analytics workspace retention. | Trends, rule analysis, forensic investigation, and auditing. |
| Access log | One record per request, including the request URI, HTTP method, and status code. | Log Analytics workspace retention. | Correlating WAF matches with the full request context. |
| Azure Resource Graph | WAF policy links to Front Door profiles. | Current resource configuration. | Finding associated profiles and selecting the policy scope. |

> [!IMPORTANT]
> Metrics are ideal for fast anomaly detection but don't contain request details. Logs contain full forensic information but can take longer to query for large time ranges.

## Monitor tab

The Monitor tab has two views: **Azure WAF Logs** and **Azure WAF Metrics**. Start by selecting the time range and the Front Door profiles you want to include. In the Logs view, you can select a rule set, rule group, outcome, blocked URI, rule, tracking ID, or source IP to filter the views below it.

WAF Insights shows only the requests that the WAF policy you opened it from processed. If other WAF policies are attached to the same Front Door profile, for example for other domains, their requests aren't included. Charts based on platform metrics are the exception: they include all WAF traffic on the selected profiles. If this WAF policy didn't process any requests in the selected time range, but other WAF policies on the same profiles did, WAF Insights shows a notice that names those policies.

### Azure WAF Logs view

:::image type="content" source="../media/insights/afd-monitor-logs-summary.png" alt-text="Screenshot of the Azure WAF Logs view in WAF Insights for Azure Front Door, showing the summary tiles and the charts of requests by rule set, rule group, and WAF outcome." lightbox="../media/insights/afd-monitor-logs-summary.png":::

| Visualization | What it shows |
|---|---|
| Summary | Requests with WAF matches, blocked, challenged (JavaScript challenge or CAPTCHA), and logged requests, plus the number of source IPs and rules triggered. The summary covers the selected time range and associations, and doesn't change when you select a segment below it. |
| Requests by Rule Set / Custom Rule | Distinct requests per managed rule set (and version) and custom rules. A request that matches rules in several rule sets is counted in each of them. Select a segment to filter. |
| Requests by Rule Group | Distinct requests per rule group. A request can be counted in more than one group. Select a segment to filter. |
| Requests by WAF Outcome | One final outcome per request, so the segments add up to the number of requests. Select an outcome to filter. |
| Top Blocked Request URIs | The 10 request URIs (path and query string) with the most blocked requests. Select a URI to filter the views below it. |
| Top Rules by Requests Matching | Up to 50 rules, ranked by the number of requests they matched, with the rule message. Select a rule to filter the views below it. |
| Requests Matching Each Rule Over Time | Distinct requests per rule, in one-hour intervals, to correlate spikes with deployments, campaigns, or incidents. |
| Rule Match Details for Current Filters | Time, tracking reference, rule ID, WAF outcome category, action as logged, rule set, rule group, rule message, matched data, host, URI, and client IP for the active filters. |
| Tracking IDs for Selected Rule / Rule Matches for Selected Tracking ID | The requests that matched the selected rule, and every rule that matched one selected request. |
| Source IPs for Selected Rule / Requests for Selected Rule and Source IP | The top 10 source IPs by request count, and the requests from a selected source IP. |

> [!NOTE]
> **Requests by WAF Outcome** counts each request once, based on the highest-priority action observed for it: Blocked > Redirect > JSChallenge/CAPTCHA > Allowed > Logged. Log and AnomalyScoring actions are shown as **Logged**, JavaScript challenge actions (such as JSChallengeIssued or JSChallengeValid) as **JSChallenge**, and a failed challenge (JSChallengeBlock) as **Blocked**. When you select an outcome, the views below it show requests whose final outcome matches your selection.
>
> The detail tables in this view show two action columns: **WAF Outcome Category**, the normalized value that the outcome chart uses, and **Action (as logged)**, the exact value from the WAF log, such as AnomalyScoring.
>
> In every table, on both the Monitor and Investigate tabs, Bot Manager rules are shown with a **Bot** prefix, for example **Bot 100100**.
>
> Front Door logs record the full request URL, including the scheme, host, and port. WAF Insights shows the URI as a path and query string, and shows the host in a separate column.

Below the charts, the tables show the top blocked URIs and the top rules, and a chart shows how often each rule matched over time:

:::image type="content" source="../media/insights/afd-monitor-logs-top-rules.png" alt-text="Screenshot of the Top Blocked Request URIs table, the Top Rules by Requests Matching table, and the Requests Matching Each Rule Over Time chart in WAF Insights for Azure Front Door." lightbox="../media/insights/afd-monitor-logs-top-rules.png":::

The detail tables show every rule match for the active filters. Select a rule or a tracking reference to drill down to individual requests:

:::image type="content" source="../media/insights/afd-monitor-logs-rule-details.png" alt-text="Screenshot of the Rule Match Details for Current Filters table, with the Tracking IDs for Selected Rule and Rule Matches for Selected Tracking ID tables below it." lightbox="../media/insights/afd-monitor-logs-rule-details.png":::

### Azure WAF Metrics view

The metrics view combines Azure Monitor platform metrics with two charts calculated from the WAF log:

| Chart | Source |
|---|---|
| WAF Total Requests | `WebApplicationFirewallRequestCount` metric |
| WAF Blocked Requests | `WebApplicationFirewallRequestCount` metric, filtered to Action = Block |
| WAF Managed Rule Matches by Rule Set (from WAF logs) | WAF log, rule matches per rule set in five-minute intervals |
| WAF Custom Rule Matches (from WAF logs) | WAF log, custom rule matches in five-minute intervals |
| WAF Total JS Challenge Requests | `WebApplicationFirewallJsRequestCount` metric |
| WAF Total CAPTCHA Requests | `WebApplicationFirewallCaptchaRequestCount` metric |

> [!NOTE]
> The `WebApplicationFirewallRequestCount` metric doesn't count non-terminating Log actions, to avoid counting the same request more than once. For more information, see [Azure Web Application Firewall monitoring and logging](waf-front-door-monitor.md).

Use these charts to detect sudden surges or changes in rule behavior, then move to the Logs view or the Investigate tab for request-level evidence.

## Investigate tab

The Investigate tab is built for troubleshooting WAF events. It supports two investigation modes: **Investigate by Rule** and **Investigate by URL**. Except for the first selection, each step is filtered by the selection you made in the previous step.

### Investigate by Rule

Use this mode when a rule ID, rule set, or a noisy rule is your starting point.

1. Select the WAF policy scope. The table shows each Front Door profile and WAF policy with its number of requests, broken down by final WAF outcome (Blocked, Redirect, JSChallenge, CAPTCHA, Allowed, or Logged). Each request is counted once, the same way as in **Requests by WAF Outcome**. The table includes only the scopes of this WAF policy.
1. Select a triggered rule. The table shows the rule ID (or custom rule name), the action as logged, rule set version, rule group, Front Door profile, WAF policy, the number of rule matches, and a trend over the selected time range.
1. Select an impacted host. The list shows the hosts where the selected rule matched with the selected action, and the number of requests for each.
1. Select an impacted URL. The table shows the host, URI, HTTP method, and tracking reference for each matching request.
1. Select an example request to see every rule that matched it, with the action, rule set, rule group, rule ID, message, and matched data. A selection summary shows the rule ID, host, URL, and tracking reference.

This flow helps you find which rules drive most of the blocked traffic, detect false positives, and see which hosts and URLs are most affected.

### Investigate by URL

Use this mode when a host, path, API, or a user-reported request is your starting point.

1. Select the WAF policy scope.
1. Select an impacted host.
1. Select an impacted URL. WAF Insights correlates WAF and access logs to show the request URI, HTTP method, status code, and tracking reference.

   > [!TIP]
   > The tracking reference is also returned to the client in the `X-Azure-Ref` response header. If a user reports a blocked request, ask for this value to find the exact request.
1. Review all the rules that matched the selected request, in time order, including the action, rule set, rule group, rule ID, message, and matched data.

This flow is useful for investigating suspicious activity on sensitive endpoints, such as sign-in pages, and for checking whether blocked requests are legitimate or malicious.

> [!TIP]
> Before you create an exclusion, reproduce the legitimate request, identify the exact request attribute that matched, and scope the exclusion as narrowly as possible. For more information, see [Tuning Web Application Firewall for Azure Front Door](waf-front-door-tuning.md).

## Summary of dashboards

| Dashboard | Purpose | Investigation flow | Example use cases |
|---|---|---|---|
| Monitor - WAF logs | Log-based monitoring | Filter by rule set, rule group, outcome, blocked URI, rule, tracking ID, or source IP | Validate policy effectiveness, audits, request review |
| Monitor - WAF metrics | Metric-based monitoring | Azure Monitor metrics and WAF log trends | Detect anomalies, track challenge and block activity |
| Investigate by Rule | Investigate by rule ID | Scope → Rule → Host → URL → Request | Identify noisy rules, analyze blocks, tune rules |
| Investigate by URL | Investigate by URL path | Scope → Host → URL → Rules | Investigate attacks on sensitive endpoints, validate rule effectiveness |

## Glossary

- **WAF policy scope**: The Front Door profile and WAF policy combination that you investigate.
- **Tracking reference**: The Azure Front Door request identifier used to correlate WAF and access log records. It's returned to clients in the `X-Azure-Ref` response header.
- **Rule ID**: The identifier of a managed or Bot Manager rule, taken from the rule name in the WAF log. Bot Manager rules are shown with a **Bot** prefix (for example, Bot 100100). Custom rules appear by name.
- **LAW (Log Analytics workspace)**: Where logs are stored and queried.

## Limitations and considerations

- **Latency**: Logs have a short ingestion delay before they can be queried. For more information, see [Log data ingestion time in Azure Monitor](/azure/azure-monitor/logs/data-ingestion-time).
- **Retention**: Configure Log Analytics retention to match your compliance and audit needs.
- **Scale**: Large volumes of diagnostic logs can increase query latency and storage costs. Narrow the time range or filters for large environments.
- **Log schema**: WAF Insights for Azure Front Door uses the `AzureDiagnostics` table.
- **Logging scope**: The WAF log contains only requests that matched a WAF rule. Requests with no match don't appear in WAF Insights.
- **Sensitive data**: Matched values can be logged in plain text. Limit access and exports accordingly.
- **Policy matching**: Front Door WAF logs record the policy name, not its resource ID, so WAF Insights matches requests to the policy by name. If two WAF policies with the same name, from different resource groups, are attached to the same profile, requests from both are included.

## Best practices

- Enable both the WAF log and the access log in the same Log Analytics workspace.
- Use the **Monitor** tab daily for operational awareness, and the **Investigate** tab during incidents.
- Periodically review noisy rules in **Investigate by Rule** to tune your WAF configuration.
- Use Azure Monitor platform metrics and alerts alongside WAF Insights, for example on sudden spikes in blocked or challenged requests.
- Share the same tracking reference and time range across security and networking teams so findings are reproducible.

## Related content

- [Azure Application Gateway WAF Insights](../ag/insights.md)
- [Azure Web Application Firewall monitoring and logging](waf-front-door-monitor.md)
- [Tuning Web Application Firewall for Azure Front Door](waf-front-door-tuning.md)
- [Configure Azure Front Door logs](../../frontdoor/standard-premium/how-to-logs.md)
- [Monitor Azure Front Door](../../frontdoor/monitor-front-door.md)
- [Azure Front Door monitoring data reference](../../frontdoor/monitor-front-door-reference.md)
- [Azure Workbooks overview](/azure/azure-monitor/visualize/workbooks-overview)
