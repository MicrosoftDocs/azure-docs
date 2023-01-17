---
title: SentinelAudit tables reference 
description: Learn about the fields in the SentinelAudit tables, used for audit monitoring and analysis.
author: limwainstein
ms.author: lwainstein
ms.topic: reference
ms.date: 01/17/2023
ms.service: microsoft-sentinel
---

# SentinelAudit tables reference 

This article describes the fields in the SentinelAudit tables, which are used for auditing user activity in Microsoft Sentinel resources. With the Microsoft Sentinel audit feature, you can keep tabs on the actions taken in your SIEM and get information on any changes made to your environment and the users that made those changes. 

Learn how to [query and use the audit table](audit-analytics-rules.md) for deeper monitoring and visibility of actions in your environment.

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
| **TimeGenerated**        | Datetime       | The time (UTC) at which the audit event occurred.              |
| <a name="operationname_audit"></a>**OperationName** | String   | The Azure operation being recorded. For example:<br>- `Microsoft.SecurityInsights/alertRules/Write`<br>- `Microsoft.SecurityInsights/alertRules/Delete` |
| <a name="sentinelresourceid_audit"></a>**SentinelResourceId** | String         | The unique identifier of the Microsoft Sentinel workspace and the associated resource on which the audit event occurred. |
| **SentinelResourceName** | String         | The resource name. For analytics rules, this is the rule name. |
| <a name="status_audit"></a>**Status**     | String         | Indicates `Success` or `Failure` for the [OperationName](#operationname_audit). |
| **Description**          | String         | Describes the operation, including extended data as needed. For example, for failures, this column might indicate the failure reason. |
| **WorkspaceId**          | String         | The workspace GUID on which the audit issue occurred. The full Azure Resource Identifier is available in the [SentinelResourceID](#sentinelresourceid_audit) column. |
| **SentinelResourceType** | String         | The Microsoft Sentinel resource type being monitored.          |
| **SentinelResourceKind** | String         | The specific type of resource being monitored. For example, for analytics rules: `NRT`. |
| **CorrelationId**        | GUID           | The event correlation ID. For example, `f509674e-257a-4ec2-9834-940ded9ac587`. |
| **ExtendedProperties**   | Dynamic (json) | A JSON bag that varies by the [OperationName](#operationname_audit) value and the [Status](#status_audit) of the event. |

### Extended properties

| ColumnName               | ColumnType     | Description |
| ------------------------ | -------------- | ----------------------------------------------------------------------- |
| **Status reason**        | String         | The reason why the operation failed. For example: `No permissions`.     |
| **SubscriptionId**       | GUID           | The subscription ID of the workspace on which the audit issue occurred. |
| **ResourceGroupName**    | String         | Resource group of the workspace on which the audit issue occurred.      |
| **WorkspaceName**        | String         | Resource group of the workspace on which the audit issue occurred.      |
| **CallerName**           | String         | The user or application that initiated the action.                      |
| **Property diff**        | Array\[String\] | An array of the properties that changed on the relevant resource. For example: `['custom_details','look_back']`. |
| **Resource Pre change**  | Dynamic (json) | The JSON bag that includes the rule, before the change.                 |
| **Resource post change** | Dynamic (json) | The JSON bag that includes the rule, after the change.                  |
| **OperationType**        | Enum           | The type of operation that the user performed. Possible values are `Read`, `Write`, or `Run` - relevant for playbooks. |
