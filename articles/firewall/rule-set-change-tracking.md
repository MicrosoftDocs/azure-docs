---
title: Track Azure Firewall rule set changes
description: Learn how to monitor and track changes to Azure Firewall rule collection groups using Azure Resource Graph queries for compliance and auditing.
ms.date: 10/13/2025
ms.topic: how-to
author: duongau
ms.author: duau
ms.service: azure-firewall
ai-usage: ai-assisted
# Customer intent: As a network administrator, I want to track changes to Azure Firewall rule sets so that I can maintain compliance, audit configuration changes, and troubleshoot issues effectively.
---

# Track Azure Firewall rule set changes

This article shows you how to monitor and track changes to Azure Firewall rule collection groups using Azure Resource Graph. Change tracking helps you maintain security compliance, audit configuration modifications, and troubleshoot issues by providing a detailed history of rule set modifications.

Azure Resource Graph provides change analysis data that helps you track when changes were detected on Azure Firewall rule collection groups. You can view property change details and query changes at scale across your subscription, management group, or tenant.

Change tracking for Azure Firewall rule collection groups enables you to:

- **Monitor configuration changes**: Track all modifications to firewall rules and policies
- **Maintain compliance**: Generate audit trails for security and compliance requirements  
- **Troubleshoot issues**: Identify when changes were made that might affect connectivity
- **Analyze trends**: Understand patterns in rule modifications over time

## Prerequisites

Before you can track rule set changes, verify that you meet the following requirements:

- You have an Azure Firewall with configured rule collection groups
- You have appropriate permissions to access Azure Resource Graph
- Your Azure Firewall is using Azure Firewall Policy (not classic rules)

## Access Azure Resource Graph Explorer

To run change tracking queries, you need to access Azure Resource Graph Explorer:

1. Sign in to the [Azure portal](https://portal.azure.com)
2. Search for and select **Resource Graph Explorer**
3. In the query window, you can run the change tracking queries described in the following sections

## Basic change tracking query

Use this query to get a comprehensive view of all changes to Azure Firewall rule collection groups:

```kusto
networkresourcechanges
| where properties contains "microsoft.network/firewallpolicies/rulecollectiongroups"
| extend parsedProperties = parse_json(properties)
| extend TargetResource = tostring(parsedProperties.targetResourceId),
         Timestamp = todatetime(parsedProperties.changeAttributes.timestamp),
         Changes = todynamic(parsedProperties.changes),
         ChangeType = tostring(parsedProperties.changeType),
         PreviousSnapshotId = tostring(parsedProperties.changeAttributes.previousResourceSnapshotId),
         NewSnapshotId = tostring(parsedProperties.changeAttributes.newResourceSnapshotId),
         CorrelationId = tostring(parsedProperties.changeAttributes.correlationId),
         ChangesCount = toint(parsedProperties.changeAttributes.changesCount),
         TenantId = tostring(tenantId),
         Location = tostring(location),
         SubscriptionId = tostring(subscriptionId),
         ResourceGroup = tostring(resourceGroup),
         FirewallPolicyName = extract('/firewallPolicies/([^/]+)/', 1, tostring(id))
| mv-expand ChangeKey = bag_keys(Changes)
| extend ChangeDetails = todynamic(Changes[tostring(ChangeKey)])
| extend RuleCollectionName = extract('properties\\.ruleCollections\\["([^"]+)"\\]', 1, tostring(ChangeKey))
| where isnotempty(RuleCollectionName)
| summarize Changes = make_list(pack("ChangeKey", ChangeKey, "PreviousValue", tostring(ChangeDetails.previousValue), "NewValue", tostring(ChangeDetails.newValue)))
    by Timestamp = format_datetime(Timestamp, 'yyyy-MM-dd HH:mm:ss'),
       TenantId,
       SubscriptionId,
       ResourceGroup,
       Location,
       TargetResource,
       FirewallPolicyName,
       RuleCollectionName,
       ChangeType,
       PreviousSnapshotId,
       NewSnapshotId,
       CorrelationId,
       ChangesCount
| project Timestamp,
          TenantId,
          SubscriptionId,
          ResourceGroup,
          Location,
          TargetResource,
          FirewallPolicyName,
          RuleCollectionName,
          ChangeType,
          PreviousSnapshotId,
          NewSnapshotId,
          CorrelationId,
          ChangesCount,
          Changes
| order by Timestamp desc
```

## Understanding the query results

The change tracking query returns the following information for each detected change:

| Field | Description |
|-------|-------------|
| **Timestamp** | When the change occurred |
| **SubscriptionId** | Azure subscription containing the firewall |
| **ResourceGroup** | Resource group containing the firewall policy |
| **FirewallPolicyName** | Name of the affected firewall policy |
| **RuleCollectionName** | Name of the affected rule collection |
| **ChangeType** | Type of change (Create, Update, Delete) |
| **ChangesCount** | Number of properties changed |
| **Changes** | Detailed list of what changed, including previous and new values |
| **CorrelationId** | Unique identifier linking related changes |

## Filter changes by time period

To focus on recent changes, you can add a time filter to your query:

```kusto
networkresourcechanges
| where properties contains "microsoft.network/firewallpolicies/rulecollectiongroups"
| where todatetime(properties.changeAttributes.timestamp) >= ago(7d)  // Last 7 days
// ... rest of query
```

## Filter by specific firewall policy

To track changes for a specific firewall policy:

```kusto
networkresourcechanges
| where properties contains "microsoft.network/firewallpolicies/rulecollectiongroups"
| where id contains "/firewallPolicies/your-policy-name"
// ... rest of query
```

## Set up automated monitoring

For continuous monitoring, consider setting up:

- **Scheduled queries**: Use Azure Logic Apps or Azure Automation to run queries on a schedule
- **Alerts**: Create Azure Monitor alerts based on change patterns
- **Reports**: Export results to storage or visualization tools for reporting

## Best practices

When implementing rule set change tracking:

- **Regular monitoring**: Set up regular query execution to catch changes promptly
- **Retention policies**: Plan for long-term storage of change data for compliance
- **Access control**: Limit access to change tracking data based on security requirements
- **Integration**: Consider integrating with your existing SIEM or monitoring tools

## Troubleshooting

If you don't see expected changes in your results:

- Verify that you're using Azure Firewall Policy (not classic rules)
- Check that the time period in your query covers when changes occurred
- Ensure you have the necessary permissions to access Azure Resource Graph
- Confirm that the resource names in your filters are correct

## Related content

- [Monitor Azure Firewall](monitor-firewall.md)
- [Azure Firewall Workbooks](firewall-workbook.md)
- [Azure Firewall monitoring data reference](monitor-firewall-reference.md)
- [Azure Resource Graph overview](/azure/governance/resource-graph/overview)