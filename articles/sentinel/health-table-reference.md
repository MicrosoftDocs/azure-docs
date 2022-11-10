---
title: SentinelHealth tables reference 
description: Learn about the fields in the SentinelHealth tables, used for health monitoring and analysis.
author: limwainstein
ms.author: lwainstein
ms.topic: reference
ms.date: 11/08/2022
ms.service: microsoft-sentinel
---

# SentinelHealth tables reference 

This article describes the fields in the *SentinelHealth* table used for monitoring the health of Microsoft Sentinel resources. With the Microsoft Sentinel [health monitoring feature](health-audit.md), you can keep tabs on the proper functioning of your SIEM and get information on any health drifts in your environment. 

Learn how to query and use the health table for deeper monitoring and visibility of actions in your environment:
- For [data connectors](monitor-data-connector-health.md)
- For [automation rules and playbooks](monitor-automation-health.md)

> [!IMPORTANT]
>
> The *SentinelHealth* data table is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

Microsoft Sentinel's health monitoring feature covers different kinds of resources, such as [data connectors](monitor-data-connector-health.md) and [automation rules](monitor-automation-health.md). Many of the data fields in the following tables apply across resource types, but some have specific applications for each type. The descriptions below will indicate one way or the other.

## SentinelHealth table columns schema

The following table describes the columns and data generated in the SentinelHealth data table:

| ColumnName               | ColumnType     | Description                                                   |
| ------------------------ | -------------- | ------------------------------------------------------------- |
| **TenantId**             | String         | The tenant ID for your Microsoft Sentinel workspace.          |
| **TimeGenerated**        | Datetime       | The time at which the health event occurred.                  |
| <a name="operationname_health"></a>**OperationName** | String      | The health operation. Possible values depend on the resource type.<br>See [Operation names for different resource types](#operation-names-for-different-resource-types) for details. |
| <a name="sentinelresourceid_health"></a>**SentinelResourceId**     | String         | The unique identifier of the resource on which the health event occurred, and its associated Microsoft Sentinel workspace.  |
| **SentinelResourceName** | String         | The resource name.                                            |
| <a name="status_health"></a>**Status**    | String         | Indicates the overall result of the operation. Possible values depend on the operation name.<br>See [Operation names for different resource types](#operation-names-for-different-resource-types) for details.                  |
| **Description**          | String         | Describes the operation, including extended data as needed. For failures, this can include details of the failure reason. |
| **Reason**               | Enum           | Shows the reason for the failure of the resource. Possible values depend on the resource type.<br>See [Failure reasons](#failure-reasons) for details.               |
| **WorkspaceId**          | String         | The workspace GUID on which the health issue occurred. The full Azure Resource Identifier is available in the [SentinelResourceID](#sentinelresourceid_health) column. |
| **SentinelResourceType** | String         | The Microsoft Sentinel resource type being monitored.<br>Possible values: `Data connector`, `Automation rule`, `Playbook` |
| **SentinelResourceKind** | String         | A resource classification within the resource type.<br>- For data connectors, this is the type of connected data source. |
| **RecordId**             | String         | A unique identifier for the record that can be shared with the support team for better correlation as needed.  |
| **ExtendedProperties**   | Dynamic (json) | A JSON bag that varies by the [OperationName](#operationname_health) value and the [Status](#status_health) of the event.<br>See [Extended properties](#extended-properties) for details.                                                      |
| **Type**                 | String         | `SentinelHealth`                                              |

## Operation names for different resource types

| Resource types       | Operation names | Statuses |
| -------------------- | --------------- | -------- |
| **[Data collectors](monitor-data-connector-health.md)**  | Data fetch status change<br><br>__________________<br>Data fetch failure summary | Success<br>Failure<br>_____________<br>Informational |
| **[Automation rules](monitor-automation-health.md)** | Automation rule run | Success<br>Partial success<br>Failure |
| **[Playbooks](monitor-automation-health.md)**        | Playbook was triggered | Success<br>Failure |


## Failure reasons

These are the possible values that can appear in the **Reason** field above. The set of possible values depends on the resource type.

### Data collector failure reasons

These are the possible **Reason** values for the **Data collector** resource type.

| Failure reason                        | Description                                                      |
| ------------------------------------- | ---------------------------------------------------------------- |


### Automation rule failure reasons

| Failure description               | Remedy                                    |
| --------------------------------- | ----------------------------------------- |
| Playbook could not be triggered because it contains an unsupported trigger type. | Make sure your playbook starts with the [correct Logic Apps trigger](playbook-triggers-actions.md#microsoft-sentinel-triggers-summary): Microsoft Sentinel Incident or Microsoft Sentinel Alert. |
| Playbook could not be triggered because the subscription is disabled and marked as read-only. Playbooks in this subscription cannot be run until the subscription is re-enabled. | Re-enable the Azure subscription in which the playbook is located. |
| Playbook could not be triggered because it was disabled. | Enable your playbook: In Microsoft Sentinel, in the Active Playbooks tab under Automation, or in the Logic Apps resource page. |
| Could not run playbook because playbook was not found or because Microsoft Sentinel was missing permissions on it. | Edit the automation rule, find and select the playbook in its new location, and save. Make sure Microsoft Sentinel has [permission to run this playbook](tutorial-respond-threats-playbook.md?tabs=LAC#respond-to-incidents). |
| Playbook could not be triggered because of invalid template definition. | There is an error in the playbook definition. Go to the Logic Apps designer to fix the issues and save the playbook. |
| Playbook could not be triggered because access control configuration restricts Microsoft Sentinel. | Logic Apps configurations allow restricting access to trigger the playbook. This restriction is in effect for this playbook. Remove this restriction so Microsoft Sentinel is not blocked. [Learn more](../logic-apps/logic-apps-securing-a-logic-app.md?tabs=azure-portal#restrict-access-by-ip-address-range) |
| Playbook could not be triggered because Microsoft Sentinel is missing permissions to run it. | Microsoft Sentinel requires [permissions to run playbooks](tutorial-respond-threats-playbook.md?tabs=LAC#respond-to-incidents). |
| Playbook could not be triggered because it wasn’t migrated to new permissions model. Grant Microsoft Sentinel permissions to run this playbook and resave the rule. | Grant Microsoft Sentinel [permissions to run this playbook](tutorial-respond-threats-playbook.md?tabs=LAC#respond-to-incidents) and resave the rule. |
| Action could not run due to too many requests exceeding workflow throttling limits. | The number of waiting workflow runs has exceeded the maximum allowed limit. Try increasing the value of `'maximumWaitingRuns'` in [trigger concurrency configuration](../logic-apps/logic-apps-workflow-actions-triggers.md#change-waiting-runs-limit). |
| Action could not run due to too many requests exceeding throttling limits. | Learn more about [subscription and tenant limits](../azure-resource-manager/management/request-limits-and-throttling.md#subscription-and-tenant-limits). |
| Playbook could not be triggered because access was forbidden. Managed identity is missing configuration or Logic Apps network restriction has been set. | If the playbook uses managed identity, make sure the managed identity was assigned with permissions. The playbook may have network restriction rules preventing it from being triggered as they block Microsoft Sentinel service. |
| Playbook could not be triggered because the subscription or resource group was locked. | Remove the lock to allow Microsoft Sentinel trigger playbooks in the locked scope. Learn more about [locked resources](../azure-resource-manager/management/lock-resources.md?tabs=json). |
| Caller is missing required playbook-triggering permissions on playbook or Microsoft Sentinel is missing permissions on it. | The user trying to trigger the playbook on demand is missing Logic Apps Contributor role on the playbook or to trigger the playbook. [Learn more](../logic-apps/logic-apps-securing-a-logic-app.md?tabs=azure-portal#restrict-access-by-ip-address-range) |
| Incident/alert was not found. | If the error occurred when trying to trigger a playbook on demand, make sure the incident/alert exists and try again. |
| Playbooks could not be triggered because playbook ARM ID is not valid. |  |


### Analytics rule failure reasons

These are the possible **Reason** values for the **Analytics rule** resource type.

| Failure reason                        | Description                                                      |
| ------------------------------------- | ---------------------------------------------------------------- |
| **GENERAL_ERROR**                     | An internal server error occurred while running the query.       |
| **QUERY_TIMEOUT**                     | The query execution timed out.                                   |
| **TABLE_NOT_EXISTS**                  | A table referenced in the query was not found. Verify that the relevant data source is connected. |
| **SEMANTIC_ERROR**                    | A semantic error occurred while running the query. Try resetting the alert rule by editing and saving it (without changing any settings). |
| **FUNCTION_RESERVED_FUNCTION**        | A function called by the query is named with a reserved word. Remove or rename the function. |
| **SYNTAX_ERROR**                      | A syntax error occurred while running the query. Try resetting the alert rule by editing and saving it (without changing any settings). |
| **WORKSPACE_NOT_EXIST**               | The workspace does not exist.                                    |
| **QUERY_CONSUMES_TOO_MANY_RESOURCES** | This query was found to use too many system resources and was prevented from running. |
| **UNKNOWN_FUNCTION**                  | A function called by the query was not found. Verify the existence in your workspace of all functions called by the query. |
| **FAILED_TO_RESOLVE_RESOURCE**        | The workspace used in the query was not found. Verify that all workspaces in the query exist. |
| **INSUFFICIENT_ACCESS_TO_QUERY**      | You don't have permissions to run this query. Try resetting the alert rule by editing and saving it (without changing any settings). |
| **INSUFFICIENT_ACCESS_TO_RESOURCE**   | You don't have access permissions to one or more of the resources in the query. |
| **PERSISTENT_STORAGE_PATH_NOT_EXIST** | The query referred to a storage path that was not found.         |
| **PERSISTENT_STORAGE_ACCESS_DENIED**  | The query was denied access to a storage path.                   |
| **MULTIPLE_FUNCTIONS_WITH_SAME_NAME** | Multiple functions with the same name are defined in this workspace. Remove or rename the redundant function and reset the rule by editing and saving it. |
| **QUERT_RESULT_MISSING**              | This query did not return any result.                            |
| **MULTIPLE_RESULT_SET_NOT_ALLOWED**   | Multiple result sets in this query are not allowed.              |
| **WRONG_NUMBER_OF_FIELDS**            | Query results contain inconsistent number of fields per row.     |
| **INGESTION_DELAY**                   | The rule's running was delayed due to long data ingestion times. |
| **TEMPORARY_ISSUE_DELAY**             | The rule's running was delayed due to temporary issues.          |
| **ENRICHMENT_ABORTED_DUE_TO_TEMPRARY_ISSUES** | The alert was not enriched due to temporary issues.      |
| **ENRICHMENT_ABORTED_DUE_TO_PERMENANT_ISSUES** | The alert was not enriched due to entity mapping issues. |
| **ENTITIES_DROPPED_DUE_TO_SIZE_LIMIT** | X entities were dropped in alert Y due to the 32 KB alert size limit. |
| **ENTITIES_DROPPED_DUE_TO_MAPPING_ISSUES** | X entities were dropped in alert Y due to entity mapping issues. |

#### Automation rule failure reasons

These are the possible **Reason** values for the **Automation rule** resource type.

| Failure reason                        | Description                                                      |
| ------------------------------------- | ---------------------------------------------------------------- |

## Extended properties

- For `Data fetch status change` events with a success indicator, the bag contains a ‘DestinationTable’ property to indicate where data from this resource is expected to land. For failures, the contents vary depending on the failure type. 

### Automation rules

| ColumnName               | ColumnType     | Description                                                   |
| ------------------------ | -------------- | ------------------------------------------------------------- |
| **ActionsTriggeredSuccessfuly** | Integer | Number of actions the automation rule successfully triggered. |
| **IncidentName**         | String         | The resource ID of the Microsoft Sentinel incident on which the rule was triggered.  |
| **IncidentNumber**       | String         | The sequential number of the Microsoft Sentinel incident as shown in the portal. |
| **TotalActions**         | Integer        | Number of actions configured in this automation rule.         |
| **TriggeredOn**          | String         | `Alert` or `Incident`. The object on which the rule was triggered. |
| **Triggered playbooks**  | Dynamic (json) | A list of playbooks this automation rule triggered successfully.<br><br>Each playbook record in the list contains:<br>- **RunId:** The run ID for this triggering of the Logic Apps workflow<br>- **WorkflowId:** The unique identifier (full ARM resource ID) of the Logic Apps workflow resource. |
| **TriggeredWhen**        | String         | `Created` or `Updated`. Indicates whether the rule was triggered due to the creation or updating of an incident or alert. |

### Playbooks

| ColumnName               | ColumnType     | Description                                                   |
| ------------------------ | -------------- | ------------------------------------------------------------- |
| **IncidentName**         | String         | The resource ID of the Microsoft Sentinel incident on which the rule was triggered.  |
| **IncidentNumber**       | String         | The sequential number of the Microsoft Sentinel incident as shown in the portal. |
| **RunId**                | String         | The run ID for this triggering of the Logic Apps workflow.    |
| **TriggeredByName**      | Dynamic (json) | Information on the identity (user or application) that triggered the playbook. |
| **TriggeredOn**          | String         | `Alert` or `Incident`. The object on which the playbook was triggered. |

### Analytics rules

## Next steps
