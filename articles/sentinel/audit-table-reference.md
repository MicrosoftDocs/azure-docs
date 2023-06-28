---
title: Microsoft Sentinel audit tables reference
description: Learn about the fields in the SentinelAudit tables, used for audit monitoring and analysis.
author: limwainstein
ms.author: lwainstein
ms.topic: reference
ms.date: 01/17/2023
ms.service: microsoft-sentinel
---

# Microsoft Sentinel audit tables reference

This article describes the fields in the SentinelAudit tables, which are used for auditing user activity in Microsoft Sentinel resources. With the Microsoft Sentinel audit feature, you can keep tabs on the actions taken in your SIEM and get information on any changes made to your environment and the users that made those changes. 

Learn how to [query and use the audit table](monitor-analytics-rule-integrity.md) for deeper monitoring and visibility of actions in your environment.

> [!IMPORTANT]
>
> The *SentinelAudit* data table is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

Microsoft Sentinel's audit feature currently covers only the analytics rule resource type, though other types may be added later. Many of the data fields in the following tables will apply across resource types, but some have specific applications for each type. The descriptions below will indicate one way or the other.

## SentinelAudit table columns schema

The following table describes the columns and data generated in the SentinelAudit data table:

| ColumnName               | ColumnType     | Description                                                    |
| ------------------------ | -------------- | -------------------------------------------------------------- |
| **TenantId**             | String         | The tenant ID for your Microsoft Sentinel workspace.           |
| **TimeGenerated**        | Datetime       | The time (UTC) at which the audited activity occurred.              |
| <a name="operationname_audit"></a>**OperationName** | String   | The Azure operation being recorded. For example:<br>- `Microsoft.SecurityInsights/alertRules/Write`<br>- `Microsoft.SecurityInsights/alertRules/Delete` |
| <a name="sentinelresourceid_audit"></a>**SentinelResourceId** | String         | The unique identifier of the Microsoft Sentinel workspace and the associated resource on which the audited activity occurred. |
| **SentinelResourceName** | String         | The resource name. For analytics rules, this is the rule name. |
| <a name="status_audit"></a>**Status**     | String         | Indicates `Success` or `Failure` for the [OperationName](#operationname_audit). |
| **Description**          | String         | Describes the operation, including extended data as needed. For example, for failures, this column might indicate the failure reason. |
| **WorkspaceId**          | String         | The workspace GUID on which the audited activity occurred. The full Azure Resource Identifier is available in the [SentinelResourceID](#sentinelresourceid_audit) column. |
| **SentinelResourceType** | String         | The Microsoft Sentinel resource type being monitored.          |
| **SentinelResourceKind** | String         | The specific type of resource being monitored. For example, for analytics rules: `NRT`. |
| **CorrelationId**        | String         | The event correlation ID in GUID format.                       |
| **ExtendedProperties**   | Dynamic (json) | A JSON bag that varies by the [OperationName](#operationname_audit) value and the [Status](#status_audit) of the event.<br>See [Extended properties](#extended-properties) for details. |
| **Type** | String | `SentinelAudit` |

## Operation names for different resource types

| Resource types       | Operation names | Statuses |
| -------------------- | --------------- | -------- |
| **[Analytics rules](monitor-analytics-rule-integrity.md)** | - `Microsoft.SecurityInsights/alertRules/Write`<br>- `Microsoft.SecurityInsights/alertRules/Delete` | Success<br>Failure |

## Extended properties

### Analytics rules

Extended properties for analytics rules reflect certain [rule settings](detect-threats-custom.md).

| ColumnName               | ColumnType     | Description                                                     |
| ------------------------ | -------------- | --------------------------------------------------------------- |
| **CallerIpAddress**      | String         | The IP address from which the action was initiated.             |
| **CallerName**           | String         | The user or application that initiated the action.              |
| **OriginalResourceState** | Dynamic (json) | A JSON bag that describes the rule before the change.          |
| **Reason**               | String     | The reason why the operation failed. For example: `No permissions`. |
| **ResourceDiffMemberNames** | Array\[String\] | An array of the properties of the rule that were changed by the audited activity. For example: `['custom_details','look_back']`. |
| **ResourceDisplayName**  | String         | Name of the analytics rule on which the audited activity occurred.   |
| **ResourceGroupName**    | String      | Resource group of the workspace on which the audited activity occurred. |
| **ResourceId**      | String     | The resource ID of the analytics rule on which the audited activity occurred. |
| **SubscriptionId**  | String      | The subscription ID of the workspace on which the audited activity occurred. |
| **UpdatedResourceState** | Dynamic (json) | A JSON bag that describes the rule after the change.            |
| **Uri**                  | String         | The full-path resource ID of the analytics rule.                |
| **WorkspaceId**        | String       | The resource ID of the workspace on which the audited activity occurred. |
| **WorkspaceName**        | String         | The name of the workspace on which the audited activity occurred.    |


## Next steps

- Learn about [auditing and health monitoring in Microsoft Sentinel](health-audit.md).
- [Turn on auditing and health monitoring](enable-monitoring.md) in Microsoft Sentinel.
- [Monitor the health of your automation rules and playbooks](monitor-automation-health.md).
- [Monitor the health of your data connectors](monitor-data-connector-health.md).
- [Monitor the health and integrity of your analytics rules](monitor-analytics-rule-integrity.md).
- [SentinelHealth tables reference](health-table-reference.md)
