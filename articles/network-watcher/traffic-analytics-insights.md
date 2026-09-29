---
title: Get Security Insights from Azure Traffic Analytics Using Natural Language
description: Learn how to use natural language prompts with Azure Traffic Analytics to investigate public exposure, risky ports, denied traffic trends, and cross-virtual network communication without writing KQL queries.
author: srijanch
ms.author: srijanch
ms.reviewer: mbender
reviewer: mbender-ms
ms.service: azure-network-watcher
ms.topic: how-to
ms.date: 09/15/2026

# Customer intent: As a network security engineer, I want to investigate network security risks using natural language prompts with Traffic Analytics, so that I can identify exposure, unusual denied traffic, and unexpected cross-network communication.
---
# Get security insights from Azure Traffic Analytics by using natural language
 
This article describes a set of security investigations that you can perform by using [Traffic Analytics](traffic-analytics.md) prompts in Network Watcher. For each investigation, it explains the scenario you're analyzing, the insights that are returned, how to interpret the results, and recommended follow-up actions.
Traffic Analytics already captures network flow telemetry such as direction, status, source and destination, ports, Network Security Groups, virtual networks, virtual machines, and flow counts. The following insights turn those signals into focused security review areas that help you understand exposure, suspicious access patterns, denied activity, and segmentation behavior.

## Implemented security insights covered in this article

| Insight | What it identifies | Why it is useful |
|---|---|---|
| Management Port Exposure | Allowed inbound public SSH and RDP reachability to Azure virtual machines and services, including single-port and dual-port exposure. | Prioritize administrative exposure by using production context, exposed virtual machines breadth, public sources, and flow volume. |
| Risky Port Exposure | Allowed inbound public reachability on a customizable set of non-management ports, grouped into practical risk categories. | Review consequential port exposure without assuming the associated application or responsible rule. |
| Virtual Machine Public IP Exposure | Allowed inbound public traffic recorded for virtual machines across ports and protocols, including possible frontend-mediated reachability. | Prioritize reachable resources and identify where public IP or frontend configuration evidence is required. |
| Denied Flow Trends | Changes in denied flow starts over time compared with a historical baseline for a selected direction. | Explain spikes and sustained increases by their largest workload, endpoint, port, and rule contributors. |
| Cross-Virtual network Traffic | InterVirtual network paths across Virtual networks, subnets, workloads, boundaries, ports, protocols, status, and connection type. | Validate topology and expected relationships while keeping unexpected and unresolved paths visible for review. |

## Using these prompts

Run these investigations by using an MCP-compatible AI agent and model of your choice. Connect the agent to the Azure MCP Server, which provides tools for interacting with Azure resources, including Azure Monitor and Log Analytics.

1. Set up an MCP-compatible AI agent and connect it to the Azure MCP Server.
2. Ensure the signed-in identity has the required permissions to access the target subscription and Log Analytics workspace.
3. Choose the investigation prompt that matches the scenario you want to analyze.
4. Replace the placeholders in the prompt, such as `[SUBSCRIPTION_ID]`, `[RESOURCE_GROUP]`, `[WORKSPACE_NAME_OR_ID]`, and the investigation time window.
5. Submit the completed prompt to the agent for analysis.

The agent uses the supplied context to generate and run queries, validate the results, and return investigation findings with recommended next steps.

## Management port exposure prompt

> **Insight summary**
> Investigates Azure virtual machines and services receiving allowed inbound public traffic on SSH (22) or RDP (3389), with resource-level and service-level prioritization.

### How this investigation can help
- Identify Azure virtual machines that you can reach from the internet through SSH (22) or RDP (3389).
- Prioritize the most important exposures based on factors such as production environment, traffic volume, and number of exposed virtual machines.
- Identify resources receiving connections from public IP addresses and high levels of management traffic.
- Detect newly exposed resources or unexpected management ports that you might need to investigate.
- Recommend next steps to validate access patterns and reduce unnecessary internet exposure.

> [!NOTE]
> Allowed traffic shows that a network path was reachable. It doesn't confirm that a connection or authentication succeeded, or that a resource was compromised.

Use the following prompt to investigate Azure resources receiving inbound internet traffic on SSH or RDP. Replace the placeholder values with details from your Azure environment, and then submit the prompt to the agent.

```text
Help me investigate internet exposure of Azure management ports using Traffic Analytics data in my Log Analytics workspace.

**Environment**

- Subscription: `[SUBSCRIPTION_ID]`
- Resource group: `[RESOURCE_GROUP]`
- Workspace: `[WORKSPACE_NAME_OR_ID]`
- Table: `NTANetAnalytics`
- Investigation window: `[START_UTC]` to `[END_UTC]`

Generate KQL to identify Azure virtual machiness and services receiving allowed inbound traffic from public IP addresses on SSH (port 22) or RDP (port 3389). Provide a resource-level view and a service-level summary that highlight production resources, the number of exposed virtual machiness, single-port versus dual-port exposure, unique public source IPs, and observed flow volume.

Use the V3 FlowLog schema and the traffic-time window. Account for the fact that inbound public source IPs and their counters are packed in `SrcPublicIps`; parse and aggregate them correctly rather than counting table rows. Include useful destination context such as virtual machines, subscription, service, environment, tenant, and cloud when available.

Before writing the final queries, verify access to the specified workspace and inspect the available table schema. Optimize the queries for the requested scope by filtering early and retaining only required fields. Execute both queries against the workspace, correct any syntax or schema errors, and sanity-check the returned data. Do not claim execution if workspace access is unavailable.

## Insights to Provide

- Rank the most important exposed services and virtual machiness, prioritizing production systems, dual SSH/RDP exposure, broad virtual machines impact, unique public sources, and flow volume.
- Compare SSH and RDP exposure and identify whether risk is concentrated in a few services or distributed across the environment.
- Highlight unusually persistent or high-volume activity as an observation, without labeling it brute force or a targeted attack unless corroborating evidence exists.
- Identify data-quality gaps and unresolved resources that affect confidence.
- Recommend specific containment and verification steps for the highest-priority resources.

Return the exact queries that successfully executed, the execution time window, the query results, and a customer-ready analysis of the important findings, confidence, caveats, and prioritized next steps. Clearly separate direct observations from assumptions. Allowed flow traffic indicates network reachability, but does not prove a successful connection, authentication, exploitation, or compromise. Recommend the additional network, authentication, and host telemetry needed to confirm risk. If execution fails or results are truncated, state that clearly and provide the query as unvalidated rather than inventing results.
```

## Risky port exposure prompt

> **Insight summary**  
> Investigates Azure virtual machines and services receiving inbound internet traffic on ports other than SSH (22) and RDP (3389). Helps identify workloads exposed to the internet through database ports, file-sharing ports, web management ports, and other commonly reviewed ports.

### How this investigation can help
- Identify workloads that are reachable from the internet through non-management ports.
- Find resources exposed on multiple ports that might require extra review.
- Understand which types of services are exposed, such as databases, file-sharing services, or management interfaces.
- Prioritize resources receiving connections from many public IP addresses or high volumes of traffic.
- Identify internet-exposed ports that might be unnecessary and require remediation.

Investigate internet-exposed ports by using Traffic Analytics data in a Log Analytics workspace. Replace the placeholder values with details from your Azure environment and submit the prompt to the agent.

```text
Help me investigate potentially dangerous services exposed to the internet using Traffic Analytics data in my Log Analytics workspace.

**Environment**

- Subscription: `[SUBSCRIPTION_ID]`
- Resource group: `[RESOURCE_GROUP]`
- Workspace: `[WORKSPACE_NAME_OR_ID]`
- Table: `NTANetAnalytics`
- Investigation window: `[START_UTC]` to `[END_UTC]`

Generate KQL to identify Azure virtual machiness and services receiving allowed inbound traffic from public IP addresses on potentially risky non-management ports. Exclude SSH (22) and RDP (3389). Propose a reviewable, customizable port list covering areas such as legacy remote access, file sharing, directory services, databases, administrative APIs, and commonly abused ports.

Provide a resource-level view and a service-level summary that highlight production resources, affected virtual machiness, exposed ports, unique public source IPs, and observed flow volume. Group the findings into practical exposure categories, but do not assume that the application normally associated with a port is actually running.

Use the V3 FlowLog schema and the traffic-time window. Account for the fact that inbound public source IPs and their counters are packed in `SrcPublicIps`; parse and aggregate them correctly rather than counting table rows. Include useful destination context such as virtual machines, subscription, service, environment, tenant, and cloud when available.

Before writing the final queries, verify access to the specified workspace and inspect the available table schema. Optimize the queries for the requested scope by filtering early and retaining only required fields. Execute both queries against the workspace, correct any syntax or schema errors, and sanity-check the returned data. Do not claim execution if workspace access is unavailable.

## Insights to Provide

- Rank exposed services and virtual machiness by production impact, port risk category, affected virtual machines count, unique public sources, and flow volume.
- Identify services exposed on multiple risky ports and explain the resulting breadth of exposure without inferring the underlying network rule.
- Highlight outlier ports, services, and traffic concentrations, and distinguish observed reachability from the conventional risk associated with each port.
- Call out sensitive workload categories, unresolved identities, and data limitations that affect confidence.
- Recommend port- and resource-specific containment and verification steps, prioritizing the most consequential exposures.

Return the exact queries that successfully executed, the execution time window, the query results, and a customer-ready analysis of the important findings, confidence, caveats, and prioritized next steps. Clearly separate direct observations from assumptions. Allowed flow traffic indicates network reachability, but does not prove that a service is vulnerable, unauthenticated, exploited, or compromised, and it does not prove a particular NSG rule caused the exposure. Recommend the additional configuration, application, authentication, host, and threat-intelligence checks needed to confirm risk. If execution fails or results are truncated, state that clearly and provide the query as unvalidated rather than inventing results.
```
Use the results to understand internet exposure across your environment and identify resources that require follow-up action.

## Virtual machine public IP exposure prompt

> **Insight summary**
> Investigates Azure virtual machines receiving inbound traffic from public IP addresses. Helps identify workloads that are reachable from the internet and might require further review.

> [!NOTE]
> This traffic might reach the virtual machines directly or through services such as a Load Balancer, Application Gateway, or other frontend resource.

### How this investigation can help
- Identify Azure virtual machines receiving inbound traffic from public IP addresses.
- Understand how internet traffic reaches workloads, including the ports and protocols being used.
- Prioritize internet-facing workloads based on exposure, traffic volume, and business importance.
- Detect newly exposed virtual machines or changes in internet reachability that might require review.
- Determine whether observed internet traffic is expected and identify resources that require further investigation.

Use this prompt to identify Azure virtual machines receiving inbound traffic from public IP addresses and review workloads that might be reachable from the internet. Replace the placeholder values with details from your Azure environment and submit the prompt to the agent.

```text
Help me investigate Azure virtual machines exposed to inbound internet traffic using Traffic Analytics data in my Log Analytics workspace.

**Environment**

- Subscription: `[SUBSCRIPTION_ID]`
- Resource group: `[RESOURCE_GROUP]`
- Workspace: `[WORKSPACE_NAME_OR_ID]`
- Table: `NTANetAnalytics`
- Investigation window: `[START_UTC]` to `[END_UTC]`

Generate KQL to identify Azure virtual machiness receiving allowed inbound traffic from public IP addresses. Show the affected virtual machiness, destination ports and protocols, services, environments, unique public source IPs, and observed flow volume. Provide both a resource-level view and a summary that helps prioritize production resources, broad port exposure, large numbers of public sources, and newly observed exposure where sufficient historical data is available.

Use the V3 FlowLog schema and the traffic-time window. Account for the fact that inbound public source IPs and their counters are packed in `SrcPublicIps`; parse and aggregate them correctly rather than counting table rows. Include useful destination context such as virtual machines, IP, subscription, service, environment, tenant, cloud, and matched network rule when available.

Before writing the final queries, verify access to the specified workspace and inspect the available table schema. Optimize the queries for the requested scope by filtering early and retaining only required fields. Execute both queries against the workspace, correct any syntax or schema errors, and sanity-check the returned data. Do not claim execution if workspace access is unavailable.

## Insights to Provide

- Summarize the number of reachable virtual machiness and services, split by production status, subscription, and cloud where available.
- Rank resources by exposed port breadth, unique public sources, and flow volume, and identify which ports account for most of the exposure.
- Highlight resources with repeated or newly observed exposure when the available time window supports that conclusion.
- Distinguish direct virtual machines public-IP association from reachability through a load balancer or other frontend, and identify where configuration evidence is needed.
- Recommend specific network-control and resource-owner follow-up for the highest-priority exposures.

Return the exact queries that successfully executed, the execution time window, the query results, and a customer-ready analysis of the important findings, confidence, caveats, and prioritized next steps. Clearly separate direct observations from assumptions. Observed inbound traffic establishes network reachability to the recorded destination, but does not by itself prove that the virtual machines has a directly assigned public IP, that a service accepted the connection, or that the workload was compromised. Recommend checks of effective network controls, public IP and load-balancer associations, application listeners, authentication logs, and host telemetry to confirm the exposure and its risk. If execution fails or results are truncated, state that clearly and provide the query as unvalidated rather than inventing results.
```
> [!NOTE]
> Traffic Analytics shows network reachability. It doesn't confirm that a connection was successful, a user authenticated, or a workload was compromised.

## Denied flow trends prompt

> **Insight summary**
> Investigates changes in denied network traffic over time to help identify unusual spikes, recurring patterns, or sudden increases in blocked connections.

### How this investigation can help
- Detect unusual spikes or sustained increases in denied network traffic.
- Compare current denied traffic with historical patterns to identify unexpected changes.
- Identify the sources, destinations, ports, protocols, services, or network rules driving denied traffic.
- Correlate traffic changes with deployments, configuration updates, routing changes, or policy modifications.
- Prioritize denied-traffic patterns that require further investigation.

Use this prompt to investigate changes in denied network traffic, identify unusual spikes, and understand which workloads, endpoints, ports, or network rules are contributing to blocked connections.

```text
Help me investigate unusual trends in denied network traffic using Traffic Analytics data in my Log Analytics workspace.

**Environment**

- Subscription: `[SUBSCRIPTION_ID]`
- Resource group: `[RESOURCE_GROUP]`
- Workspace: `[WORKSPACE_NAME_OR_ID]`
- Table: `NTANetAnalytics`
- Investigation window: `[START_UTC]` to `[END_UTC]`
- Comparison period: `[BASELINE_WINDOW]`
- Flow direction: `[INBOUND_OR_OUTBOUND]`

Generate KQL to chart denied flow starts over time and identify significant increases compared with an appropriate historical baseline. Break down notable changes by direction, source and destination, port, protocol, service, environment, subscription, and matched network rule where those fields are available. Include a detailed view for investigating the largest contributors to each spike.

Use the V3 FlowLog schema, an explicit flow direction, and traffic time rather than ingestion time. Treat rows as aggregates and calculate denied flow starts from the appropriate counters rather than counting rows. When analyzing unique public endpoints, correctly parse the packed public-IP field for the relevant side of the traffic. Use scalable time buckets and note when the requested baseline requires a pre-aggregated summary because the raw dataset is too large.

Before writing the final queries, verify access to the specified workspace and inspect the available table schema. Optimize the queries for the requested scope by filtering early, using scalable time buckets, and retaining only required fields. Execute the trend and detail queries against the workspace, correct any syntax, schema, or resource-limit errors, and sanity-check the baseline and returned data. Do not claim execution if workspace access is unavailable.

## Insights to Provide

- Quantify the overall change from the baseline and identify peak periods, sustained increases, and isolated spikes.
- Rank the source, destination, port, protocol, service, environment, and matched-rule contributors responsible for the change.
- Distinguish broad distributed activity from repeated activity involving a smaller set of endpoints where the data supports that comparison.
- Identify whether the trend is localized to a workload or rule, or visible across subscriptions and environments.
- Explain plausible operational and security causes, assign confidence, and recommend checks that can distinguish scanning from deployment, routing, or policy changes.

Return the exact queries that successfully executed, the execution and baseline windows, the query results, and a customer-ready analysis of the important trends, contributors, confidence, caveats, and prioritized next steps. Clearly separate direct observations from assumptions. An increase in denied flows may indicate scanning, a deployment change, routing changes, or misconfiguration; it does not by itself prove malicious intent or compromise. Recommend the configuration, change-management, firewall, authentication, and threat-intelligence checks needed to explain the trend. If execution fails, results are partial, or the baseline is insufficient, state that clearly and provide the query as unvalidated rather than inventing results.
```

## Cross-virtual network traffic prompt

> **Insight summary**
> Investigates traffic between Azure virtual networks to help you understand communication patterns, validate network segmentation, and identify unexpected connectivity.

### How this investigation can help
- Validate whether communication between virtual networks matches the expected network architecture.
- Understand how workloads communicate across virtual network boundaries.
- Review communication that crosses environment, subscription, or workload boundaries.
- Identify newly observed or unexpected communication paths that might require investigation.
- Prioritize analysis of the most significant communication paths and highest-volume traffic flows.

Use this prompt to investigate traffic between Azure virtual networks, validate network segmentation, and identify unexpected communication paths between workloads.

```text
Help me investigate communication between Azure virtual networks using Traffic Analytics data in my Log Analytics workspace.

**Environment**

- Subscription: `[SUBSCRIPTION_ID]`
- Resource group: `[RESOURCE_GROUP]`
- Workspace: `[WORKSPACE_NAME_OR_ID]`
- Table: `NTANetAnalytics`
- Investigation window: `[START_UTC]` to `[END_UTC]`
- Expected VNet relationships or allowlist: `[OPTIONAL_EXPECTED_PATHS]`

Generate KQL to identify and summarize cross-VNet traffic, including source and destination VNets, subnets, VMs, services, environments, subscriptions, ports, protocols, flow status, and connection type where available. Highlight unexpected VNet pairs, sensitive management or data-service ports, communication crossing environment or subscription boundaries, and high-volume or newly observed paths where sufficient historical data is available.

Use the V3 FlowLog schema, `InterVNet` traffic, the traffic-time window, and an explicit flow direction to avoid double-counting. Treat rows as aggregates and use the appropriate flow, packet, and byte counters rather than counting rows. Preserve the recorded source and destination semantics and exclude unresolved placeholder resources before claiming that an endpoint has been identified.

Before writing the final queries, verify access to the specified workspace and inspect the available table schema. Optimize the queries for the requested scope by filtering early and retaining only required fields. Execute the summary and detail queries against the workspace, correct any syntax or schema errors, and sanity-check the returned topology and traffic data. Do not claim execution if workspace access is unavailable.

## Insights to Provide

- Rank the busiest and broadest source-to-destination VNet paths using flow, packet, byte, port, and resource counts as appropriate.
- Highlight paths crossing production boundaries, subscriptions, services, or environments, especially on management and data-service ports.
- Compare observed paths with the supplied allowlist and identify new, unexpected, or unresolved relationships without automatically labeling them unauthorized.
- Identify concentration around particular source VMs, destination VMs, ports, connection types, or network rules that warrants investigation.
- Recommend specific architecture, ownership, peering, routing, network-control, and application checks for the highest-priority paths.

Return the exact queries that successfully executed, the execution time window, the query results, and a customer-ready analysis of the important paths, confidence, caveats, and prioritized next steps. If an allowlist is supplied, compare observed paths with it while keeping unmatched and incomplete topology data visible for review. Clearly separate direct observations from assumptions. Cross-VNet connectivity does not by itself prove unauthorized access, lateral movement, or compromise. Recommend checks of peering and gateway configuration, effective network rules, application and authentication logs, asset ownership, and approved architecture to determine whether the communication is expected. If execution fails or results are truncated, state that clearly and provide the query as unvalidated rather than inventing results.
```

> [!IMPORTANT]
> Use these insights as a starting point for investigation. Traffic Analytics can reveal communication patterns, connectivity, and traffic volume, but flow data alone doesn't confirm compromise, malicious activity, or the intent behind a connection.

## Related content

- [Traffic analytics overview](traffic-analytics.md)
- [Traffic analytics schema and data aggregation](traffic-analytics-schema.md)
- [Traffic analytics usage scenarios](traffic-analytics-usage-scenarios.md)
