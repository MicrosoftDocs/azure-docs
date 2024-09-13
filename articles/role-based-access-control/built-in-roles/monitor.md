---
title: Azure built-in roles for Monitor - Azure RBAC
description: This article lists the Azure built-in roles for Azure role-based access control (Azure RBAC) in the Monitor category. It lists Actions, NotActions, DataActions, and NotDataActions.
ms.service: role-based-access-control
ms.topic: reference
ms.workload: identity
author: rolyon
manager: amycolannino
ms.author: rolyon
ms.date: 04/25/2024
ms.custom: generated
---

# Azure built-in roles for Monitor

This article lists the Azure built-in roles in the Monitor category.


## Application Insights Component Contributor

Can manage Application Insights components

[Learn more](/azure/azure-monitor/app/resources-roles-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage classic alert rules |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/generateLiveToken/read | Live Metrics get token |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/metricAlerts/* | Create and manage new alert rules |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/components/* | Create and manage Insights components |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/scheduledqueryrules/* |  |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/topology/read | Read Topology |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/transactions/read | Read Transactions |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/webtests/* | Create and manage Insights web tests |
> | [Microsoft.ResourceHealth](../permissions/management-and-governance.md#microsoftresourcehealth)/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can manage Application Insights components",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/ae349356-3a1b-4a5e-921d-050484c6347e",
  "name": "ae349356-3a1b-4a5e-921d-050484c6347e",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Insights/generateLiveToken/read",
        "Microsoft.Insights/metricAlerts/*",
        "Microsoft.Insights/components/*",
        "Microsoft.Insights/scheduledqueryrules/*",
        "Microsoft.Insights/topology/read",
        "Microsoft.Insights/transactions/read",
        "Microsoft.Insights/webtests/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Application Insights Component Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Application Insights Snapshot Debugger

Gives user permission to view and download debug snapshots collected with the Application Insights Snapshot Debugger. Note that these permissions are not included in the [Owner](/azure/role-based-access-control/built-in-roles#owner) or [Contributor](/azure/role-based-access-control/built-in-roles#contributor) roles. When giving users the Application Insights Snapshot Debugger role, you must grant the role directly to the user. The role is not recognized when it is added to a custom role.

[Learn more](/azure/azure-monitor/app/snapshot-debugger)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/components/*/read |  |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Gives user permission to use Application Insights Snapshot Debugger features",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/08954f03-6346-4c2e-81c0-ec3a5cfae23b",
  "name": "08954f03-6346-4c2e-81c0-ec3a5cfae23b",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Insights/components/*/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Application Insights Snapshot Debugger",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Grafana Admin

Perform all Grafana operations, including the ability to manage data sources, create dashboards, and manage role assignments within Grafana.

[Learn more](/azure/managed-grafana/how-to-share-grafana-workspace)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.Dashboard](../permissions/monitor.md#microsoftdashboard)/grafana/ActAsGrafanaAdmin/action | Act as Grafana Admin role |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Built-in Grafana admin role",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/22926164-76b3-42b3-bc55-97df8dab3e41",
  "name": "22926164-76b3-42b3-bc55-97df8dab3e41",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.Dashboard/grafana/ActAsGrafanaAdmin/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Grafana Admin",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Grafana Editor

View and edit a Grafana instance, including its dashboards and alerts.

[Learn more](/azure/managed-grafana/how-to-share-grafana-workspace)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.Dashboard](../permissions/monitor.md#microsoftdashboard)/grafana/ActAsGrafanaEditor/action | Act as Grafana Editor role |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Built-in Grafana Editor role",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/a79a5197-3a5c-4973-a920-486035ffd60f",
  "name": "a79a5197-3a5c-4973-a920-486035ffd60f",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.Dashboard/grafana/ActAsGrafanaEditor/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Grafana Editor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Grafana Viewer

View a Grafana instance, including its dashboards and alerts.

[Learn more](/azure/managed-grafana/how-to-share-grafana-workspace)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.Dashboard](../permissions/monitor.md#microsoftdashboard)/grafana/ActAsGrafanaViewer/action | Act as Grafana Viewer role |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Built-in Grafana Viewer role",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/60921a7e-fef1-4a43-9b16-a26c52ad4769",
  "name": "60921a7e-fef1-4a43-9b16-a26c52ad4769",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.Dashboard/grafana/ActAsGrafanaViewer/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Grafana Viewer",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Monitoring Contributor

Can read all monitoring data and edit monitoring settings. See also [Get started with roles, permissions, and security with Azure Monitor](/azure/azure-monitor/roles-permissions-security#built-in-monitoring-roles).

[Learn more](/azure/azure-monitor/roles-permissions-security)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | */read | Read resources of all types, except secrets. |
> | [Microsoft.AlertsManagement](../permissions/monitor.md#microsoftalertsmanagement)/alerts/* |  |
> | [Microsoft.AlertsManagement](../permissions/monitor.md#microsoftalertsmanagement)/alertsSummary/* |  |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/actiongroups/* |  |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/activityLogAlerts/* |  |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/AlertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/components/* | Create and manage Insights components |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/createNotifications/* |  |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/dataCollectionEndpoints/* |  |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/dataCollectionRules/* |  |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/dataCollectionRuleAssociations/* |  |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/DiagnosticSettings/* | Creates, updates, or reads the diagnostic setting for Analysis Server |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/eventtypes/* | List Activity Log events (management events) in a subscription. This permission is applicable to both programmatic and portal access to the Activity Log. |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/LogDefinitions/* | This permission is necessary for users who need access to Activity Logs via the portal. List log categories in Activity Log. |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/metricalerts/* |  |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/MetricDefinitions/* | Read metric definitions (list of available metric types for a resource). |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/Metrics/* | Read metrics for a resource. |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/notificationStatus/* |  |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/Register/Action | Register the Microsoft Insights provider |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/scheduledqueryrules/* |  |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/webtests/* | Create and manage Insights web tests |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/workbooks/* |  |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/workbooktemplates/* |  |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/privateLinkScopes/* |  |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/privateLinkScopeOperationStatuses/* |  |
> | [Microsoft.OperationalInsights](../permissions/monitor.md#microsoftoperationalinsights)/workspaces/write | Creates a new workspace or links to an existing workspace by providing the customer id from the existing workspace. |
> | [Microsoft.OperationalInsights](../permissions/monitor.md#microsoftoperationalinsights)/workspaces/intelligencepacks/* | Read/write/delete log analytics solution packs. |
> | [Microsoft.OperationalInsights](../permissions/monitor.md#microsoftoperationalinsights)/workspaces/savedSearches/* | Read/write/delete log analytics saved searches. |
> | [Microsoft.OperationalInsights](../permissions/monitor.md#microsoftoperationalinsights)/workspaces/search/action | Executes a search query |
> | [Microsoft.OperationalInsights](../permissions/monitor.md#microsoftoperationalinsights)/workspaces/sharedKeys/action | Retrieves the shared keys for the workspace. These keys are used to connect Microsoft Operational Insights agents to the workspace. |
> | [Microsoft.OperationalInsights](../permissions/monitor.md#microsoftoperationalinsights)/workspaces/storageinsightconfigs/* | Read/write/delete log analytics storage insight configurations. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | [Microsoft.AlertsManagement](../permissions/monitor.md#microsoftalertsmanagement)/smartDetectorAlertRules/* |  |
> | [Microsoft.AlertsManagement](../permissions/monitor.md#microsoftalertsmanagement)/actionRules/* |  |
> | [Microsoft.AlertsManagement](../permissions/monitor.md#microsoftalertsmanagement)/smartGroups/* |  |
> | [Microsoft.AlertsManagement](../permissions/monitor.md#microsoftalertsmanagement)/migrateFromSmartDetection/* |  |
> | [Microsoft.AlertsManagement](../permissions/monitor.md#microsoftalertsmanagement)/investigations/* |  |
> | [Microsoft.Monitor](../permissions/monitor.md#microsoftmonitor)/investigations/* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can read all monitoring data and update monitoring settings.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/749f88d5-cbae-40b8-bcfc-e573ddc772fa",
  "name": "749f88d5-cbae-40b8-bcfc-e573ddc772fa",
  "permissions": [
    {
      "actions": [
        "*/read",
        "Microsoft.AlertsManagement/alerts/*",
        "Microsoft.AlertsManagement/alertsSummary/*",
        "Microsoft.Insights/actiongroups/*",
        "Microsoft.Insights/activityLogAlerts/*",
        "Microsoft.Insights/AlertRules/*",
        "Microsoft.Insights/components/*",
        "Microsoft.Insights/createNotifications/*",
        "Microsoft.Insights/dataCollectionEndpoints/*",
        "Microsoft.Insights/dataCollectionRules/*",
        "Microsoft.Insights/dataCollectionRuleAssociations/*",
        "Microsoft.Insights/DiagnosticSettings/*",
        "Microsoft.Insights/eventtypes/*",
        "Microsoft.Insights/LogDefinitions/*",
        "Microsoft.Insights/metricalerts/*",
        "Microsoft.Insights/MetricDefinitions/*",
        "Microsoft.Insights/Metrics/*",
        "Microsoft.Insights/notificationStatus/*",
        "Microsoft.Insights/Register/Action",
        "Microsoft.Insights/scheduledqueryrules/*",
        "Microsoft.Insights/webtests/*",
        "Microsoft.Insights/workbooks/*",
        "Microsoft.Insights/workbooktemplates/*",
        "Microsoft.Insights/privateLinkScopes/*",
        "Microsoft.Insights/privateLinkScopeOperationStatuses/*",
        "Microsoft.OperationalInsights/workspaces/write",
        "Microsoft.OperationalInsights/workspaces/intelligencepacks/*",
        "Microsoft.OperationalInsights/workspaces/savedSearches/*",
        "Microsoft.OperationalInsights/workspaces/search/action",
        "Microsoft.OperationalInsights/workspaces/sharedKeys/action",
        "Microsoft.OperationalInsights/workspaces/storageinsightconfigs/*",
        "Microsoft.Support/*",
        "Microsoft.AlertsManagement/smartDetectorAlertRules/*",
        "Microsoft.AlertsManagement/actionRules/*",
        "Microsoft.AlertsManagement/smartGroups/*",
        "Microsoft.AlertsManagement/migrateFromSmartDetection/*",
        "Microsoft.AlertsManagement/investigations/*",
        "Microsoft.Monitor/investigations/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Monitoring Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Monitoring Metrics Publisher

Enables publishing metrics against Azure resources

[Learn more](/azure/azure-monitor/insights/container-insights-update-metrics)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/Register/Action | Register the Microsoft Insights provider |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/Metrics/Write | Write metrics |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/Telemetry/Write | Write telemetry |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Enables publishing metrics against Azure resources",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/3913510d-42f4-4e42-8a64-420c390055eb",
  "name": "3913510d-42f4-4e42-8a64-420c390055eb",
  "permissions": [
    {
      "actions": [
        "Microsoft.Insights/Register/Action",
        "Microsoft.Support/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.Insights/Metrics/Write",
        "Microsoft.Insights/Telemetry/Write"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Monitoring Metrics Publisher",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Monitoring Reader

Can read all monitoring data (metrics, logs, etc.). See also [Get started with roles, permissions, and security with Azure Monitor](/azure/azure-monitor/roles-permissions-security#built-in-monitoring-roles).

[Learn more](/azure/azure-monitor/roles-permissions-security)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | */read | Read resources of all types, except secrets. |
> | [Microsoft.OperationalInsights](../permissions/monitor.md#microsoftoperationalinsights)/workspaces/search/action | Executes a search query |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can read all monitoring data.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/43d0d8ad-25c7-4714-9337-8ba259a9fe05",
  "name": "43d0d8ad-25c7-4714-9337-8ba259a9fe05",
  "permissions": [
    {
      "actions": [
        "*/read",
        "Microsoft.OperationalInsights/workspaces/search/action",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Monitoring Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Workbook Contributor

Can save shared workbooks.

[Learn more](/azure/sentinel/tutorial-monitor-your-data)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/workbooks/write | Create or update a workbook |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/workbooks/delete | Delete a workbook |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/workbooks/read | Read a workbook |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/workbooks/revisions/read | Get the workbook revisions |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/workbooktemplates/write | Create or update a workbook template |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/workbooktemplates/delete | Delete a workbook template |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/workbooktemplates/read | Read a workbook template |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can save shared workbooks.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/e8ddcd69-c73f-4f9f-9844-4100522f16ad",
  "name": "e8ddcd69-c73f-4f9f-9844-4100522f16ad",
  "permissions": [
    {
      "actions": [
        "Microsoft.Insights/workbooks/write",
        "Microsoft.Insights/workbooks/delete",
        "Microsoft.Insights/workbooks/read",
        "Microsoft.Insights/workbooks/revisions/read",
        "Microsoft.Insights/workbooktemplates/write",
        "Microsoft.Insights/workbooktemplates/delete",
        "Microsoft.Insights/workbooktemplates/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Workbook Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Workbook Reader

Can read workbooks.

[Learn more](/azure/sentinel/tutorial-monitor-your-data)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [microsoft.insights](../permissions/monitor.md#microsoftinsights)/workbooks/read | Read a workbook |
> | [microsoft.insights](../permissions/monitor.md#microsoftinsights)/workbooks/revisions/read | Get the workbook revisions |
> | [microsoft.insights](../permissions/monitor.md#microsoftinsights)/workbooktemplates/read | Read a workbook template |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can read workbooks.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/b279062a-9be3-42a0-92ae-8b3cf002ec4d",
  "name": "b279062a-9be3-42a0-92ae-8b3cf002ec4d",
  "permissions": [
    {
      "actions": [
        "microsoft.insights/workbooks/read",
        "microsoft.insights/workbooks/revisions/read",
        "microsoft.insights/workbooktemplates/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Workbook Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Next steps

- [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal)