---
title: Azure built-in roles for Management and governance - Azure RBAC
description: This article lists the Azure built-in roles for Azure role-based access control (Azure RBAC) in the Management and governance category. It lists Actions, NotActions, DataActions, and NotDataActions.
ms.service: role-based-access-control
ms.topic: reference
ms.workload: identity
author: rolyon
manager: amycolannino
ms.author: rolyon
ms.date: 01/25/2025
ms.custom: generated
---

# Azure built-in roles for Management and governance

This article lists the Azure built-in roles in the Management and governance category.


## Advisor Recommendations Contributor (Assessments and Reviews)

View assessment recommendations, accepted review recommendations, and manage the recommendations lifecycle (mark recommendations as completed, postponed or dismissed, in progress, or not started).

[Learn more](/azure/advisor/permissions)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Advisor](../permissions/management-and-governance.md#microsoftadvisor)/recommendations/read | Reads recommendations |
> | [Microsoft.Advisor](../permissions/management-and-governance.md#microsoftadvisor)/recommendations/write | Writes recommendations |
> | [Microsoft.Advisor](../permissions/management-and-governance.md#microsoftadvisor)/recommendations/available/action | New recommendation is available in Microsoft Advisor |
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
  "description": "View assessment recommendations, accepted review recommendations, and manage the recommendations lifecycle (mark recommendations as completed, postponed or dismissed, in progress, or not started).",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/6b534d80-e337-47c4-864f-140f5c7f593d",
  "name": "6b534d80-e337-47c4-864f-140f5c7f593d",
  "permissions": [
    {
      "actions": [
        "Microsoft.Advisor/recommendations/read",
        "Microsoft.Advisor/recommendations/write",
        "Microsoft.Advisor/recommendations/available/action"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Advisor Recommendations Contributor (Assessments and Reviews)",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Advisor Reviews Contributor

View reviews for a workload and triage recommendations linked to them.

[Learn more](/azure/advisor/permissions)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Advisor](../permissions/management-and-governance.md#microsoftadvisor)/resiliencyReviews/read | Read resiliencyReviews |
> | [Microsoft.Advisor](../permissions/management-and-governance.md#microsoftadvisor)/triageRecommendations/read | Read triageRecommendations |
> | [Microsoft.Advisor](../permissions/management-and-governance.md#microsoftadvisor)/triageRecommendations/approve/action | Approve triageRecommendations |
> | [Microsoft.Advisor](../permissions/management-and-governance.md#microsoftadvisor)/triageRecommendations/reject/action | Reject triageRecommendations |
> | [Microsoft.Advisor](../permissions/management-and-governance.md#microsoftadvisor)/triageRecommendations/reset/action | Reset triageRecommendations |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
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
  "description": "View reviews for a workload and triage recommendations linked to them.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/8aac15f0-d885-4138-8afa-bfb5872f7d13",
  "name": "8aac15f0-d885-4138-8afa-bfb5872f7d13",
  "permissions": [
    {
      "actions": [
        "Microsoft.Advisor/resiliencyReviews/read",
        "Microsoft.Advisor/triageRecommendations/read",
        "Microsoft.Advisor/triageRecommendations/approve/action",
        "Microsoft.Advisor/triageRecommendations/reject/action",
        "Microsoft.Advisor/triageRecommendations/reset/action",
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Advisor Reviews Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Advisor Reviews Reader

View reviews for a workload and recommendations linked to them.

[Learn more](/azure/advisor/permissions)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Advisor](../permissions/management-and-governance.md#microsoftadvisor)/resiliencyReviews/read | Read resiliencyReviews |
> | [Microsoft.Advisor](../permissions/management-and-governance.md#microsoftadvisor)/triageRecommendations/read | Read triageRecommendations |
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
  "description": "View reviews for a workload and recommendations linked to them.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/c64499e0-74c3-47ad-921c-13865957895c",
  "name": "c64499e0-74c3-47ad-921c-13865957895c",
  "permissions": [
    {
      "actions": [
        "Microsoft.Advisor/resiliencyReviews/read",
        "Microsoft.Advisor/triageRecommendations/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Advisor Reviews Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Automation Contributor

Manage Azure Automation resources and other resources using Azure Automation.

[Learn more](/azure/automation/automation-role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Automation](../permissions/management-and-governance.md#microsoftautomation)/automationAccounts/* |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/ActionGroups/* |  |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/ActivityLogAlerts/* |  |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/MetricAlerts/* |  |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/ScheduledQueryRules/* |  |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/diagnosticSettings/* | Creates, updates, or reads the diagnostic setting for Analysis Server |
> | [Microsoft.OperationalInsights](../permissions/monitor.md#microsoftoperationalinsights)/workspaces/sharedKeys/action | Retrieves the shared keys for the workspace. These keys are used to connect Microsoft Operational Insights agents to the workspace. |
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
  "description": "Manage azure automation resources and other resources using azure automation.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/f353d9bd-d4a6-484e-a77a-8050b599b867",
  "name": "f353d9bd-d4a6-484e-a77a-8050b599b867",
  "permissions": [
    {
      "actions": [
        "Microsoft.Automation/automationAccounts/*",
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*",
        "Microsoft.Insights/ActionGroups/*",
        "Microsoft.Insights/ActivityLogAlerts/*",
        "Microsoft.Insights/MetricAlerts/*",
        "Microsoft.Insights/ScheduledQueryRules/*",
        "Microsoft.Insights/diagnosticSettings/*",
        "Microsoft.OperationalInsights/workspaces/sharedKeys/action"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Automation Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Automation Job Operator

Create and Manage Jobs using Automation Runbooks.

[Learn more](/azure/automation/automation-role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Automation](../permissions/management-and-governance.md#microsoftautomation)/automationAccounts/hybridRunbookWorkerGroups/read | Reads a Hybrid Runbook Worker Group |
> | [Microsoft.Automation](../permissions/management-and-governance.md#microsoftautomation)/automationAccounts/jobs/read | Gets an Azure Automation job |
> | [Microsoft.Automation](../permissions/management-and-governance.md#microsoftautomation)/automationAccounts/jobs/resume/action | Resumes an Azure Automation job |
> | [Microsoft.Automation](../permissions/management-and-governance.md#microsoftautomation)/automationAccounts/jobs/stop/action | Stops an Azure Automation job |
> | [Microsoft.Automation](../permissions/management-and-governance.md#microsoftautomation)/automationAccounts/jobs/streams/read | Gets an Azure Automation job stream |
> | [Microsoft.Automation](../permissions/management-and-governance.md#microsoftautomation)/automationAccounts/jobs/suspend/action | Suspends an Azure Automation job |
> | [Microsoft.Automation](../permissions/management-and-governance.md#microsoftautomation)/automationAccounts/jobs/write | Creates an Azure Automation job |
> | [Microsoft.Automation](../permissions/management-and-governance.md#microsoftautomation)/automationAccounts/jobs/output/read | Gets the output of a job |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
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
  "description": "Create and Manage Jobs using Automation Runbooks.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/4fe576fe-1146-4730-92eb-48519fa6bf9f",
  "name": "4fe576fe-1146-4730-92eb-48519fa6bf9f",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Automation/automationAccounts/hybridRunbookWorkerGroups/read",
        "Microsoft.Automation/automationAccounts/jobs/read",
        "Microsoft.Automation/automationAccounts/jobs/resume/action",
        "Microsoft.Automation/automationAccounts/jobs/stop/action",
        "Microsoft.Automation/automationAccounts/jobs/streams/read",
        "Microsoft.Automation/automationAccounts/jobs/suspend/action",
        "Microsoft.Automation/automationAccounts/jobs/write",
        "Microsoft.Automation/automationAccounts/jobs/output/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Automation Job Operator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Automation Operator

Automation Operators are able to start, stop, suspend, and resume jobs

[Learn more](/azure/automation/automation-role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Automation](../permissions/management-and-governance.md#microsoftautomation)/automationAccounts/hybridRunbookWorkerGroups/read | Reads a Hybrid Runbook Worker Group |
> | [Microsoft.Automation](../permissions/management-and-governance.md#microsoftautomation)/automationAccounts/jobs/read | Gets an Azure Automation job |
> | [Microsoft.Automation](../permissions/management-and-governance.md#microsoftautomation)/automationAccounts/jobs/resume/action | Resumes an Azure Automation job |
> | [Microsoft.Automation](../permissions/management-and-governance.md#microsoftautomation)/automationAccounts/jobs/stop/action | Stops an Azure Automation job |
> | [Microsoft.Automation](../permissions/management-and-governance.md#microsoftautomation)/automationAccounts/jobs/streams/read | Gets an Azure Automation job stream |
> | [Microsoft.Automation](../permissions/management-and-governance.md#microsoftautomation)/automationAccounts/jobs/suspend/action | Suspends an Azure Automation job |
> | [Microsoft.Automation](../permissions/management-and-governance.md#microsoftautomation)/automationAccounts/jobs/write | Creates an Azure Automation job |
> | [Microsoft.Automation](../permissions/management-and-governance.md#microsoftautomation)/automationAccounts/jobSchedules/read | Gets an Azure Automation job schedule |
> | [Microsoft.Automation](../permissions/management-and-governance.md#microsoftautomation)/automationAccounts/jobSchedules/write | Creates an Azure Automation job schedule |
> | [Microsoft.Automation](../permissions/management-and-governance.md#microsoftautomation)/automationAccounts/linkedWorkspace/read | Gets the workspace linked to the automation account |
> | [Microsoft.Automation](../permissions/management-and-governance.md#microsoftautomation)/automationAccounts/read | Gets an Azure Automation account |
> | [Microsoft.Automation](../permissions/management-and-governance.md#microsoftautomation)/automationAccounts/runbooks/read | Gets an Azure Automation runbook |
> | [Microsoft.Automation](../permissions/management-and-governance.md#microsoftautomation)/automationAccounts/schedules/read | Gets an Azure Automation schedule asset |
> | [Microsoft.Automation](../permissions/management-and-governance.md#microsoftautomation)/automationAccounts/schedules/write | Creates or updates an Azure Automation schedule asset |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.ResourceHealth](../permissions/management-and-governance.md#microsoftresourcehealth)/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Automation](../permissions/management-and-governance.md#microsoftautomation)/automationAccounts/jobs/output/read | Gets the output of a job |
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
  "description": "Automation Operators are able to start, stop, suspend, and resume jobs",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/d3881f73-407a-4167-8283-e981cbba0404",
  "name": "d3881f73-407a-4167-8283-e981cbba0404",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Automation/automationAccounts/hybridRunbookWorkerGroups/read",
        "Microsoft.Automation/automationAccounts/jobs/read",
        "Microsoft.Automation/automationAccounts/jobs/resume/action",
        "Microsoft.Automation/automationAccounts/jobs/stop/action",
        "Microsoft.Automation/automationAccounts/jobs/streams/read",
        "Microsoft.Automation/automationAccounts/jobs/suspend/action",
        "Microsoft.Automation/automationAccounts/jobs/write",
        "Microsoft.Automation/automationAccounts/jobSchedules/read",
        "Microsoft.Automation/automationAccounts/jobSchedules/write",
        "Microsoft.Automation/automationAccounts/linkedWorkspace/read",
        "Microsoft.Automation/automationAccounts/read",
        "Microsoft.Automation/automationAccounts/runbooks/read",
        "Microsoft.Automation/automationAccounts/schedules/read",
        "Microsoft.Automation/automationAccounts/schedules/write",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Automation/automationAccounts/jobs/output/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Automation Operator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Automation Runbook Operator

Read Runbook properties - to be able to create Jobs of the runbook.

[Learn more](/azure/automation/automation-role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Automation](../permissions/management-and-governance.md#microsoftautomation)/automationAccounts/runbooks/read | Gets an Azure Automation runbook |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
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
  "description": "Read Runbook properties - to be able to create Jobs of the runbook.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/5fb5aef8-1081-4b8e-bb16-9d5d0385bab5",
  "name": "5fb5aef8-1081-4b8e-bb16-9d5d0385bab5",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Automation/automationAccounts/runbooks/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Automation Runbook Operator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Center for SAP solutions administrator

This role provides read and write access to all capabilities of Azure Center for SAP solutions.

[Learn more](/azure/sap/center-sap-solutions/manage-with-azure-rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Advisor](../permissions/management-and-governance.md#microsoftadvisor)/configurations/read | Get configurations |
> | [Microsoft.Advisor](../permissions/management-and-governance.md#microsoftadvisor)/recommendations/read | Reads recommendations |
> | [Microsoft.Workloads](../permissions/management-and-governance.md#microsoftworkloads)/sapvirtualInstances/*/read |  |
> | [Microsoft.Workloads](../permissions/management-and-governance.md#microsoftworkloads)/sapVirtualInstances/*/write |  |
> | [Microsoft.Workloads](../permissions/management-and-governance.md#microsoftworkloads)/sapVirtualInstances/*/delete |  |
> | [Microsoft.Workloads](../permissions/management-and-governance.md#microsoftworkloads)/Locations/*/action |  |
> | [Microsoft.Workloads](../permissions/management-and-governance.md#microsoftworkloads)/Locations/*/read |  |
> | [Microsoft.Workloads](../permissions/management-and-governance.md#microsoftworkloads)/sapVirtualInstances/*/start/action |  |
> | [Microsoft.Workloads](../permissions/management-and-governance.md#microsoftworkloads)/sapVirtualInstances/*/stop/action |  |
> | [Microsoft.Workloads](../permissions/management-and-governance.md#microsoftworkloads)/connectors/*/read |  |
> | [Microsoft.Workloads](../permissions/management-and-governance.md#microsoftworkloads)/connectors/*/write |  |
> | [Microsoft.Workloads](../permissions/management-and-governance.md#microsoftworkloads)/connectors/*/delete |  |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/metrics/read | Read metrics |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/metricDefinitions/read | Read metric definitions |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/read | Gets the list of subscriptions. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/write | Creates or updates a resource group. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourcegroups/deployments/* |  |
> | [Microsoft.ResourceHealth](../permissions/management-and-governance.md#microsoftresourcehealth)/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/read | Get the virtual network definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/providers/Microsoft.Insights/metricDefinitions/read | Gets available metrics for the PingMesh |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/subnets/read | Gets a virtual network subnet definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/subnets/write | Creates a virtual network subnet or updates an existing virtual network subnet |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/subnets/virtualMachines/read | Gets references to all the virtual machines in a virtual network subnet |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkInterfaces/read | Gets a network interface definition.  |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkInterfaces/ipconfigurations/read | Gets a network interface ip configuration definition.  |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkInterfaces/loadBalancers/read | Gets all the load balancers that the network interface is part of |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkInterfaces/providers/Microsoft.Insights/metricDefinitions/read | Gets available metrics for the Network Interface |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/read | Gets a load balancer definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/backendAddressPools/read | Gets a load balancer backend address pool definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/frontendIPConfigurations/read | Gets a load balancer frontend IP configuration definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/loadBalancingRules/read | Gets a load balancer load balancing rule definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/inboundNatRules/read | Gets a load balancer inbound nat rule definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/providers/Microsoft.Insights/logDefinitions/read | Gets the events for Load Balancer |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/networkInterfaces/read | Gets references to all the network interfaces under a load balancer |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/outboundRules/read | Gets a load balancer outbound rule definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/virtualMachines/read | Gets references to all the virtual machines under a load balancer |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for Load Balancer |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/privateEndpoints/read | Gets an private endpoint resource. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkSecurityGroups/join/action | Joins a network security group. Not Alertable. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/routeTables/join/action | Joins a route table. Not Alertable. |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/read | Returns the list of storage accounts or gets the properties for the specified storage account. |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/blobServices/read | Returns blob service properties or statistics |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/blobServices/containers/read | Returns list of containers |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/fileServices/read | Get file service properties |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/fileServices/shares/read | List file shares |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachines/read | Get the properties of a virtual machine |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/availabilitySets/read | Get the properties of an availability set |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/sshPublicKeys/read | Get the properties of an SSH public key |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/sshPublicKeys/write | Creates a new SSH public key or updates an existing SSH public key |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/sshPublicKeys/*/generateKeyPair/action |  |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachines/extensions/read | Get the properties of a virtual machine extension |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachines/extensions/delete | Deletes the virtual machine extension |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/disks/read | Get the properties of a Disk |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/blobServices/containers/blobs/read | Returns a blob or a list of blobs |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "This role provides read and write access to all capabilities of Azure Center for SAP solutions.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/7b0c7e81-271f-4c71-90bf-e30bdfdbc2f7",
  "name": "7b0c7e81-271f-4c71-90bf-e30bdfdbc2f7",
  "permissions": [
    {
      "actions": [
        "Microsoft.Advisor/configurations/read",
        "Microsoft.Advisor/recommendations/read",
        "Microsoft.Workloads/sapvirtualInstances/*/read",
        "Microsoft.Workloads/sapVirtualInstances/*/write",
        "Microsoft.Workloads/sapVirtualInstances/*/delete",
        "Microsoft.Workloads/Locations/*/action",
        "Microsoft.Workloads/Locations/*/read",
        "Microsoft.Workloads/sapVirtualInstances/*/start/action",
        "Microsoft.Workloads/sapVirtualInstances/*/stop/action",
        "Microsoft.Workloads/connectors/*/read",
        "Microsoft.Workloads/connectors/*/write",
        "Microsoft.Workloads/connectors/*/delete",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Insights/metrics/read",
        "Microsoft.Insights/metricDefinitions/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.Resources/subscriptions/resourceGroups/write",
        "Microsoft.Resources/subscriptions/resourcegroups/deployments/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Network/virtualNetworks/read",
        "Microsoft.Network/virtualNetworks/providers/Microsoft.Insights/metricDefinitions/read",
        "Microsoft.Network/virtualNetworks/subnets/read",
        "Microsoft.Network/virtualNetworks/subnets/write",
        "Microsoft.Network/virtualNetworks/subnets/virtualMachines/read",
        "Microsoft.Network/networkInterfaces/read",
        "Microsoft.Network/networkInterfaces/ipconfigurations/read",
        "Microsoft.Network/networkInterfaces/loadBalancers/read",
        "Microsoft.Network/networkInterfaces/providers/Microsoft.Insights/metricDefinitions/read",
        "Microsoft.Network/loadBalancers/read",
        "Microsoft.Network/loadBalancers/backendAddressPools/read",
        "Microsoft.Network/loadBalancers/frontendIPConfigurations/read",
        "Microsoft.Network/loadBalancers/loadBalancingRules/read",
        "Microsoft.Network/loadBalancers/inboundNatRules/read",
        "Microsoft.Network/loadBalancers/providers/Microsoft.Insights/logDefinitions/read",
        "Microsoft.Network/loadBalancers/networkInterfaces/read",
        "Microsoft.Network/loadBalancers/outboundRules/read",
        "Microsoft.Network/loadBalancers/virtualMachines/read",
        "Microsoft.Network/loadBalancers/providers/Microsoft.Insights/metricDefinitions/read",
        "Microsoft.Network/privateEndpoints/read",
        "Microsoft.Network/networkSecurityGroups/join/action",
        "Microsoft.Network/routeTables/join/action",
        "Microsoft.Storage/storageAccounts/read",
        "Microsoft.Storage/storageAccounts/blobServices/read",
        "Microsoft.Storage/storageAccounts/blobServices/containers/read",
        "Microsoft.Storage/storageAccounts/fileServices/read",
        "Microsoft.Storage/storageAccounts/fileServices/shares/read",
        "Microsoft.Compute/virtualMachines/read",
        "Microsoft.Compute/availabilitySets/read",
        "Microsoft.Compute/sshPublicKeys/read",
        "Microsoft.Compute/sshPublicKeys/write",
        "Microsoft.Compute/sshPublicKeys/*/generateKeyPair/action",
        "Microsoft.Compute/virtualMachines/extensions/read",
        "Microsoft.Compute/virtualMachines/extensions/delete",
        "Microsoft.Compute/disks/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Center for SAP solutions administrator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Center for SAP solutions reader

This role provides read access to all capabilities of Azure Center for SAP solutions.

[Learn more](/azure/sap/center-sap-solutions/manage-with-azure-rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Advisor](../permissions/management-and-governance.md#microsoftadvisor)/configurations/read | Get configurations |
> | [Microsoft.Advisor](../permissions/management-and-governance.md#microsoftadvisor)/recommendations/read | Reads recommendations |
> | [Microsoft.Workloads](../permissions/management-and-governance.md#microsoftworkloads)/sapvirtualInstances/*/read |  |
> | [Microsoft.Workloads](../permissions/management-and-governance.md#microsoftworkloads)/Locations/*/read |  |
> | [Microsoft.Workloads](../permissions/management-and-governance.md#microsoftworkloads)/Operations/read | read Operations |
> | [Microsoft.Workloads](../permissions/management-and-governance.md#microsoftworkloads)/Locations/OperationStatuses/read | read OperationStatuses |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/read | Read a classic metric alert |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/metrics/read | Read metrics |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/metricDefinitions/read | Read metric definitions |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/read | Gets or lists deployments. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/read | Gets the list of subscriptions. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourcegroups/deployments/read | Gets or lists deployments. |
> | [Microsoft.ResourceHealth](../permissions/management-and-governance.md#microsoftresourcehealth)/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/read | Get the virtual network definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/providers/Microsoft.Insights/metricDefinitions/read | Gets available metrics for the PingMesh |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/subnets/read | Gets a virtual network subnet definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/subnets/virtualMachines/read | Gets references to all the virtual machines in a virtual network subnet |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkInterfaces/read | Gets a network interface definition.  |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkInterfaces/ipconfigurations/read | Gets a network interface ip configuration definition.  |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkInterfaces/loadBalancers/read | Gets all the load balancers that the network interface is part of |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkInterfaces/providers/Microsoft.Insights/metricDefinitions/read | Gets available metrics for the Network Interface |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/read | Gets a load balancer definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/backendAddressPools/read | Gets a load balancer backend address pool definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/frontendIPConfigurations/read | Gets a load balancer frontend IP configuration definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/loadBalancingRules/read | Gets a load balancer load balancing rule definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/inboundNatRules/read | Gets a load balancer inbound nat rule definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/providers/Microsoft.Insights/logDefinitions/read | Gets the events for Load Balancer |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/networkInterfaces/read | Gets references to all the network interfaces under a load balancer |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/outboundRules/read | Gets a load balancer outbound rule definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/virtualMachines/read | Gets references to all the virtual machines under a load balancer |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for Load Balancer |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/privateEndpoints/read | Gets an private endpoint resource. |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/read | Returns the list of storage accounts or gets the properties for the specified storage account. |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/blobServices/read | Returns blob service properties or statistics |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/blobServices/containers/read | Returns list of containers |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/fileServices/read | Get file service properties |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/fileServices/shares/read | List file shares |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachines/read | Get the properties of a virtual machine |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/availabilitySets/read | Get the properties of an availability set |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachines/extensions/read | Get the properties of a virtual machine extension |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/disks/read | Get the properties of a Disk |
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
  "description": "This role provides read access to all capabilities of Azure Center for SAP solutions.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/05352d14-a920-4328-a0de-4cbe7430e26b",
  "name": "05352d14-a920-4328-a0de-4cbe7430e26b",
  "permissions": [
    {
      "actions": [
        "Microsoft.Advisor/configurations/read",
        "Microsoft.Advisor/recommendations/read",
        "Microsoft.Workloads/sapvirtualInstances/*/read",
        "Microsoft.Workloads/Locations/*/read",
        "Microsoft.Workloads/Operations/read",
        "Microsoft.Workloads/Locations/OperationStatuses/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Insights/alertRules/read",
        "Microsoft.Insights/metrics/read",
        "Microsoft.Insights/metricDefinitions/read",
        "Microsoft.Resources/deployments/read",
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.Resources/subscriptions/resourcegroups/deployments/read",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Network/virtualNetworks/read",
        "Microsoft.Network/virtualNetworks/providers/Microsoft.Insights/metricDefinitions/read",
        "Microsoft.Network/virtualNetworks/subnets/read",
        "Microsoft.Network/virtualNetworks/subnets/virtualMachines/read",
        "Microsoft.Network/networkInterfaces/read",
        "Microsoft.Network/networkInterfaces/ipconfigurations/read",
        "Microsoft.Network/networkInterfaces/loadBalancers/read",
        "Microsoft.Network/networkInterfaces/providers/Microsoft.Insights/metricDefinitions/read",
        "Microsoft.Network/loadBalancers/read",
        "Microsoft.Network/loadBalancers/backendAddressPools/read",
        "Microsoft.Network/loadBalancers/frontendIPConfigurations/read",
        "Microsoft.Network/loadBalancers/loadBalancingRules/read",
        "Microsoft.Network/loadBalancers/inboundNatRules/read",
        "Microsoft.Network/loadBalancers/providers/Microsoft.Insights/logDefinitions/read",
        "Microsoft.Network/loadBalancers/networkInterfaces/read",
        "Microsoft.Network/loadBalancers/outboundRules/read",
        "Microsoft.Network/loadBalancers/virtualMachines/read",
        "Microsoft.Network/loadBalancers/providers/Microsoft.Insights/metricDefinitions/read",
        "Microsoft.Network/privateEndpoints/read",
        "Microsoft.Storage/storageAccounts/read",
        "Microsoft.Storage/storageAccounts/blobServices/read",
        "Microsoft.Storage/storageAccounts/blobServices/containers/read",
        "Microsoft.Storage/storageAccounts/fileServices/read",
        "Microsoft.Storage/storageAccounts/fileServices/shares/read",
        "Microsoft.Compute/virtualMachines/read",
        "Microsoft.Compute/availabilitySets/read",
        "Microsoft.Compute/virtualMachines/extensions/read",
        "Microsoft.Compute/disks/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Center for SAP solutions reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Center for SAP solutions service role

Azure Center for SAP solutions service role - This role is intended to be used for providing the permissions to user assigned managed identity. Azure Center for SAP solutions will use this identity to deploy and manage SAP systems.

[Learn more](/azure/sap/center-sap-solutions/manage-with-azure-rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/write | Creates or updates a resource group. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/read | Gets the list of subscriptions. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourcegroups/deployments/* |  |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/read | Gets a load balancer definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/write | Creates a load balancer or updates an existing load balancer |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/backendAddressPools/read | Gets a load balancer backend address pool definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/backendAddressPools/write | Creates a load balancer backend address pool or updates an existing load balancer backend address pool |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/frontendIPConfigurations/read | Gets a load balancer frontend IP configuration definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/loadBalancingRules/read | Gets a load balancer load balancing rule definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/inboundNatRules/read | Gets a load balancer inbound nat rule definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/providers/Microsoft.Insights/logDefinitions/read | Gets the events for Load Balancer |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/networkInterfaces/read | Gets references to all the network interfaces under a load balancer |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/outboundRules/read | Gets a load balancer outbound rule definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/virtualMachines/read | Gets references to all the virtual machines under a load balancer |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for Load Balancer |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkInterfaces/read | Gets a network interface definition.  |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkInterfaces/write | Creates a network interface or updates an existing network interface.  |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkInterfaces/ipconfigurations/read | Gets a network interface ip configuration definition.  |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkInterfaces/loadBalancers/read | Gets all the load balancers that the network interface is part of |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/read | Get the virtual network definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/checkIpAddressAvailability/read | Check if IP Address is available at the specified virtual network |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/subnets/read | Gets a virtual network subnet definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/subnets/virtualMachines/read | Gets references to all the virtual machines in a virtual network subnet |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/virtualMachines/read | Gets references to all the virtual machines in a virtual network |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkInterfaces/ipconfigurations/join/action | Joins a Network Interface IP Configuration. Not alertable. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/privateEndpoints/read | Gets an private endpoint resource. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/privateEndpoints/write | Creates a new private endpoint, or updates an existing private endpoint. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkInterfaces/join/action | Joins a Virtual Machine to a network interface. Not Alertable. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/backendAddressPools/join/action | Joins a load balancer backend address pool. Not Alertable. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/frontendIPConfigurations/join/action | Joins a Load Balancer Frontend IP Configuration. Not alertable. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/subnets/join/action | Joins a virtual network. Not Alertable. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/subnets/joinLoadBalancer/action | Joins a load balancer to virtual network subnets |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/read | Returns the list of storage accounts or gets the properties for the specified storage account. |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/write | Creates a storage account with the specified parameters or update the properties or tags or adds custom domain for the specified storage account. |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/PrivateEndpointConnectionsApproval/action | Approve Private Endpoint Connections |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/blobServices/read | Returns blob service properties or statistics |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/blobServices/containers/read | Returns list of containers |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/fileServices/read | Get file service properties |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/fileServices/write | Put file service properties |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/fileServices/shares/read | List file shares |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/fileServices/shares/write | Create or update file share |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachines/read | Get the properties of a virtual machine |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachines/write | Creates a new virtual machine or updates an existing virtual machine |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachines/instanceView/read | Gets the detailed runtime status of the virtual machine and its resources |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/availabilitySets/read | Get the properties of an availability set |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/availabilitySets/write | Creates a new availability set or updates an existing one |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/skus/read | Gets the list of Microsoft.Compute SKUs available for your Subscription |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/sshPublicKeys/read | Get the properties of an SSH public key |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachines/extensions/read | Get the properties of a virtual machine extension |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachines/extensions/write | Creates a new virtual machine extension or updates an existing one |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachines/extensions/delete | Deletes the virtual machine extension |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/disks/read | Get the properties of a Disk |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/disks/write | Creates a new Disk or updates an existing one |
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
  "description": "Azure Center for SAP solutions service role - This role is intended to be used for providing the permissions to user assigned managed identity. Azure Center for SAP solutions will use this identity to deploy and manage SAP systems.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/aabbc5dd-1af0-458b-a942-81af88f9c138",
  "name": "aabbc5dd-1af0-458b-a942-81af88f9c138",
  "permissions": [
    {
      "actions": [
        "Microsoft.Resources/subscriptions/resourceGroups/write",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.Resources/subscriptions/resourcegroups/deployments/*",
        "Microsoft.Network/loadBalancers/read",
        "Microsoft.Network/loadBalancers/write",
        "Microsoft.Network/loadBalancers/backendAddressPools/read",
        "Microsoft.Network/loadBalancers/backendAddressPools/write",
        "Microsoft.Network/loadBalancers/frontendIPConfigurations/read",
        "Microsoft.Network/loadBalancers/loadBalancingRules/read",
        "Microsoft.Network/loadBalancers/inboundNatRules/read",
        "Microsoft.Network/loadBalancers/providers/Microsoft.Insights/logDefinitions/read",
        "Microsoft.Network/loadBalancers/networkInterfaces/read",
        "Microsoft.Network/loadBalancers/outboundRules/read",
        "Microsoft.Network/loadBalancers/virtualMachines/read",
        "Microsoft.Network/loadBalancers/providers/Microsoft.Insights/metricDefinitions/read",
        "Microsoft.Network/networkInterfaces/read",
        "Microsoft.Network/networkInterfaces/write",
        "Microsoft.Network/networkInterfaces/ipconfigurations/read",
        "Microsoft.Network/networkInterfaces/loadBalancers/read",
        "Microsoft.Network/virtualNetworks/read",
        "Microsoft.Network/virtualNetworks/checkIpAddressAvailability/read",
        "Microsoft.Network/virtualNetworks/subnets/read",
        "Microsoft.Network/virtualNetworks/subnets/virtualMachines/read",
        "Microsoft.Network/virtualNetworks/virtualMachines/read",
        "Microsoft.Network/networkInterfaces/ipconfigurations/join/action",
        "Microsoft.Network/privateEndpoints/read",
        "Microsoft.Network/privateEndpoints/write",
        "Microsoft.Network/networkInterfaces/join/action",
        "Microsoft.Network/loadBalancers/backendAddressPools/join/action",
        "Microsoft.Network/loadBalancers/frontendIPConfigurations/join/action",
        "Microsoft.Network/virtualNetworks/subnets/join/action",
        "Microsoft.Network/virtualNetworks/subnets/joinLoadBalancer/action",
        "Microsoft.Storage/storageAccounts/read",
        "Microsoft.Storage/storageAccounts/write",
        "Microsoft.Storage/storageAccounts/PrivateEndpointConnectionsApproval/action",
        "Microsoft.Storage/storageAccounts/blobServices/read",
        "Microsoft.Storage/storageAccounts/blobServices/containers/read",
        "Microsoft.Storage/storageAccounts/fileServices/read",
        "Microsoft.Storage/storageAccounts/fileServices/write",
        "Microsoft.Storage/storageAccounts/fileServices/shares/read",
        "Microsoft.Storage/storageAccounts/fileServices/shares/write",
        "Microsoft.Compute/virtualMachines/read",
        "Microsoft.Compute/virtualMachines/write",
        "Microsoft.Compute/virtualMachines/instanceView/read",
        "Microsoft.Compute/availabilitySets/read",
        "Microsoft.Compute/availabilitySets/write",
        "Microsoft.Compute/skus/read",
        "Microsoft.Compute/sshPublicKeys/read",
        "Microsoft.Compute/virtualMachines/extensions/read",
        "Microsoft.Compute/virtualMachines/extensions/write",
        "Microsoft.Compute/virtualMachines/extensions/delete",
        "Microsoft.Compute/disks/read",
        "Microsoft.Compute/disks/write"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Center for SAP solutions service role",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Connected Machine Onboarding

Can onboard Azure Connected Machines.

[Learn more](/azure/azure-arc/servers/onboard-service-principal)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/read | Read any Azure Arc machines |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/write | Writes an Azure Arc machines |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/privateLinkScopes/read | Read any Azure Arc privateLinkScopes |
> | [Microsoft.GuestConfiguration](../permissions/management-and-governance.md#microsoftguestconfiguration)/guestConfigurationAssignments/read | Get guest configuration assignment. |
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
  "description": "Can onboard Azure Connected Machines.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/b64e21ea-ac4e-4cdf-9dc9-5b892992bee7",
  "name": "b64e21ea-ac4e-4cdf-9dc9-5b892992bee7",
  "permissions": [
    {
      "actions": [
        "Microsoft.HybridCompute/machines/read",
        "Microsoft.HybridCompute/machines/write",
        "Microsoft.HybridCompute/privateLinkScopes/read",
        "Microsoft.GuestConfiguration/guestConfigurationAssignments/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Connected Machine Onboarding",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Connected Machine Resource Administrator

Can read, write, delete and re-onboard Azure Connected Machines.

[Learn more](/azure/azure-arc/servers/security-overview)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/* |  |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/extensions/* |  |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/licenseProfiles/* |  |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/runCommands/* |  |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/UpgradeExtensions/action | Upgrades Extensions on Azure Arc machines |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/privateLinkScopes/* |  |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/licenses/* |  |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/locations/* |  |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/*/read |  |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
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
  "description": "Can read, write, delete and re-onboard Azure Connected Machines.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/cd570a14-e51a-42ad-bac8-bafd67325302",
  "name": "cd570a14-e51a-42ad-bac8-bafd67325302",
  "permissions": [
    {
      "actions": [
        "Microsoft.HybridCompute/machines/*",
        "Microsoft.HybridCompute/machines/extensions/*",
        "Microsoft.HybridCompute/machines/licenseProfiles/*",
        "Microsoft.HybridCompute/machines/runCommands/*",
        "Microsoft.HybridCompute/machines/UpgradeExtensions/action",
        "Microsoft.HybridCompute/privateLinkScopes/*",
        "Microsoft.HybridCompute/licenses/*",
        "Microsoft.HybridCompute/locations/*",
        "Microsoft.HybridCompute/*/read",
        "Microsoft.Resources/deployments/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Connected Machine Resource Administrator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Connected Machine Resource Manager

Custom role for Azure Local resource provider (Microsoft.AzureStackHCI Resource Provider) to manage hybrid compute machines and hybrid connectivity endpoints in a resource group

[Learn more](/azure-stack/hci/deploy/deployment-azure-resource-manager-template)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.GuestConfiguration](../permissions/management-and-governance.md#microsoftguestconfiguration)/guestConfigurationAssignments/*/read |  |
> | [Microsoft.GuestConfiguration](../permissions/management-and-governance.md#microsoftguestconfiguration)/guestConfigurationAssignments/read | Get guest configuration assignment. |
> | [Microsoft.GuestConfiguration](../permissions/management-and-governance.md#microsoftguestconfiguration)/guestConfigurationAssignments/write | Create new guest configuration assignment. |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/read | Read any Azure Arc machines |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/extensions/read | Reads any Azure Arc extensions |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/*/read |  |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/delete | Deletes an Azure Arc machines |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/extensions/delete | Deletes an Azure Arc extensions |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/extensions/write | Installs or Updates an Azure Arc extensions |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/licenseProfiles/delete | Deletes an Azure Arc licenseProfiles |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/licenseProfiles/read | Reads any Azure Arc licenseProfiles |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/licenseProfiles/write | Installs or Updates an Azure Arc licenseProfiles |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/UpgradeExtensions/action | Upgrades Extensions on Azure Arc machines |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/write | Writes an Azure Arc machines |
> | [Microsoft.HybridConnectivity](../permissions/hybrid-multicloud.md#microsofthybridconnectivity)/endpoints/read | Get or list of endpoints to the target resource. |
> | [Microsoft.HybridConnectivity](../permissions/hybrid-multicloud.md#microsofthybridconnectivity)/endpoints/serviceConfigurations/read | Get or list of serviceConfigurations to the endpoints resource. |
> | [Microsoft.HybridConnectivity](../permissions/hybrid-multicloud.md#microsofthybridconnectivity)/endpoints/serviceConfigurations/write | Create or update the serviceConfigurations to the endpoints resource. |
> | [Microsoft.HybridConnectivity](../permissions/hybrid-multicloud.md#microsofthybridconnectivity)/endpoints/write | Create or update the endpoint to the target resource. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.EdgeMarketplace/locations/operationStatuses/read | read operationStatuses |
> | Microsoft.EdgeMarketPlace/offers/getAccessToken/action | get access token. |
> | Microsoft.EdgeMarketPlace/offers/generateAccessToken/action | A long-running resource action. |
> | Microsoft.EdgeMarketplace/publishers/read | Get a Publisher |
> | Microsoft.EdgeMarketplace/offers/read | Get a Offer |
> | [Microsoft.ExtendedLocation](../permissions/hybrid-multicloud.md#microsoftextendedlocation)/customLocations/read | Gets an Custom Location resource |
> | Microsoft.Attestation/attestationProviders/write | Adds attestation service. |
> | Microsoft.Attestation/attestationProviders/read | Gets the attestation service status. |
> | Microsoft.Attestation/attestationProviders/delete | Removes attestation service. |
> | Microsoft.Attestation/attestationProviders/attestation/read | Gets the attestation service status. |
> | Microsoft.Attestation/attestationProviders/attestation/write | Adds attestation service. |
> | Microsoft.Attestation/attestationProviders/attestation/delete | Removes attestation service. |
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
  "description": "Custom Role for AzureStackHCI RP to manage hybrid compute machines and hybrid connectivity endpoints in a resource group",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/f5819b54-e033-4d82-ac66-4fec3cbf3f4c",
  "name": "f5819b54-e033-4d82-ac66-4fec3cbf3f4c",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.GuestConfiguration/guestConfigurationAssignments/*/read",
        "Microsoft.GuestConfiguration/guestConfigurationAssignments/read",
        "Microsoft.GuestConfiguration/guestConfigurationAssignments/write",
        "Microsoft.HybridCompute/machines/read",
        "Microsoft.HybridCompute/machines/extensions/read",
        "Microsoft.HybridCompute/*/read",
        "Microsoft.HybridCompute/machines/delete",
        "Microsoft.HybridCompute/machines/extensions/delete",
        "Microsoft.HybridCompute/machines/extensions/write",
        "Microsoft.HybridCompute/machines/licenseProfiles/delete",
        "Microsoft.HybridCompute/machines/licenseProfiles/read",
        "Microsoft.HybridCompute/machines/licenseProfiles/write",
        "Microsoft.HybridCompute/machines/UpgradeExtensions/action",
        "Microsoft.HybridCompute/machines/write",
        "Microsoft.HybridConnectivity/endpoints/read",
        "Microsoft.HybridConnectivity/endpoints/serviceConfigurations/read",
        "Microsoft.HybridConnectivity/endpoints/serviceConfigurations/write",
        "Microsoft.HybridConnectivity/endpoints/write",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.EdgeMarketplace/locations/operationStatuses/read",
        "Microsoft.EdgeMarketPlace/offers/getAccessToken/action",
        "Microsoft.EdgeMarketPlace/offers/generateAccessToken/action",
        "Microsoft.EdgeMarketplace/publishers/read",
        "Microsoft.EdgeMarketplace/offers/read",
        "Microsoft.ExtendedLocation/customLocations/read",
        "Microsoft.Attestation/attestationProviders/write",
        "Microsoft.Attestation/attestationProviders/read",
        "Microsoft.Attestation/attestationProviders/delete",
        "Microsoft.Attestation/attestationProviders/attestation/read",
        "Microsoft.Attestation/attestationProviders/attestation/write",
        "Microsoft.Attestation/attestationProviders/attestation/delete"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Connected Machine Resource Manager",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Customer Lockbox Approver for Subscription

Can approve Microsoft support requests to access specific resources contained within a subscription, or the subscription itself, when Customer Lockbox for Microsoft Azure is enabled on the tenant where the subscription resides.

[Learn more](/azure/security/fundamentals/customer-lockbox-overview)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/read | Gets the list of subscriptions. |
> | [Microsoft.CustomerLockbox](../permissions/management-and-governance.md#microsoftcustomerlockbox)/requests/UpdateApproval/action | Update Approval Microsoft.CustomerLockbox |
> | [Microsoft.CustomerLockbox](../permissions/management-and-governance.md#microsoftcustomerlockbox)/requests/read | Read Lockbox Request |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/eventtypes/values/read | Read Activity Log events |
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
  "description": "Can approve Microsoft support requests to access specific resources contained within a subscription, or the subscription itself, when Customer Lockbox for Microsoft Azure is enabled on the tenant where the subscription resides.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/4dae6930-7baf-46f5-909e-0383bc931c46",
  "name": "4dae6930-7baf-46f5-909e-0383bc931c46",
  "permissions": [
    {
      "actions": [
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.CustomerLockbox/requests/UpdateApproval/action",
        "Microsoft.CustomerLockbox/requests/read",
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Insights/eventtypes/values/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Customer Lockbox Approver for Subscription",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Billing Reader

Allows read access to billing data

[Learn more](/azure/cost-management-billing/manage/manage-billing-access)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Billing](../permissions/management-and-governance.md#microsoftbilling)/*/read | Read Billing information |
> | [Microsoft.Commerce](../permissions/general.md#microsoftcommerce)/*/read |  |
> | [Microsoft.Consumption](../permissions/management-and-governance.md#microsoftconsumption)/*/read |  |
> | [Microsoft.Management](../permissions/management-and-governance.md#microsoftmanagement)/managementGroups/read | List management groups for the authenticated user. |
> | [Microsoft.CostManagement](../permissions/management-and-governance.md#microsoftcostmanagement)/*/read |  |
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
  "description": "Allows read access to billing data",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/fa23ad8b-c56e-40d8-ac0c-ce449e1d2c64",
  "name": "fa23ad8b-c56e-40d8-ac0c-ce449e1d2c64",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Billing/*/read",
        "Microsoft.Commerce/*/read",
        "Microsoft.Consumption/*/read",
        "Microsoft.Management/managementGroups/read",
        "Microsoft.CostManagement/*/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Billing Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Blueprint Contributor

Can manage blueprint definitions, but not assign them.

[Learn more](/azure/governance/blueprints/overview)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Blueprint](../permissions/management-and-governance.md#microsoftblueprint)/blueprints/* | Create and manage blueprint definitions or blueprint artifacts. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
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
  "description": "Can manage blueprint definitions, but not assign them.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/41077137-e803-4205-871c-5a86e6a753b4",
  "name": "41077137-e803-4205-871c-5a86e6a753b4",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Blueprint/blueprints/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Blueprint Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Blueprint Operator

Can assign existing published blueprints, but cannot create new blueprints. Note that this only works if the assignment is done with a user-assigned managed identity.

[Learn more](/azure/governance/blueprints/overview)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Blueprint](../permissions/management-and-governance.md#microsoftblueprint)/blueprintAssignments/* | Create and manage blueprint assignments. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
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
  "description": "Can assign existing published blueprints, but cannot create new blueprints. NOTE: this only works if the assignment is done with a user-assigned managed identity.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/437d2ced-4a38-4302-8479-ed2bcb43d090",
  "name": "437d2ced-4a38-4302-8479-ed2bcb43d090",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Blueprint/blueprintAssignments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Blueprint Operator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Carbon Optimization Reader

Allow read access to Azure Carbon Optimization data

[Learn more](/azure/carbon-optimization/permissions)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Carbon](../permissions/management-and-governance.md#microsoftcarbon)/carbonEmissionReports/action | API for Carbon Emissions Reports |
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
  "description": "Allow read access to Azure Carbon Optimization data",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/fa0d39e6-28e5-40cf-8521-1eb320653a4c",
  "name": "fa0d39e6-28e5-40cf-8521-1eb320653a4c",
  "permissions": [
    {
      "actions": [
        "Microsoft.Carbon/carbonEmissionReports/action"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Carbon Optimization Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cost Management Contributor

Can view costs and manage cost configuration (e.g. budgets, exports)

[Learn more](/azure/cost-management-billing/costs/understand-work-scopes)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Consumption](../permissions/management-and-governance.md#microsoftconsumption)/* |  |
> | [Microsoft.CostManagement](../permissions/management-and-governance.md#microsoftcostmanagement)/* |  |
> | [Microsoft.Billing](../permissions/management-and-governance.md#microsoftbilling)/billingPeriods/read |  |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/read | Gets the list of subscriptions. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | [Microsoft.Advisor](../permissions/management-and-governance.md#microsoftadvisor)/configurations/read | Get configurations |
> | [Microsoft.Advisor](../permissions/management-and-governance.md#microsoftadvisor)/recommendations/read | Reads recommendations |
> | [Microsoft.Management](../permissions/management-and-governance.md#microsoftmanagement)/managementGroups/read | List management groups for the authenticated user. |
> | [Microsoft.Billing](../permissions/management-and-governance.md#microsoftbilling)/billingProperty/read | Gets the billing properties for a subscription |
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
  "description": "Can view costs and manage cost configuration (e.g. budgets, exports)",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/434105ed-43f6-45c7-a02f-909b2ba83430",
  "name": "434105ed-43f6-45c7-a02f-909b2ba83430",
  "permissions": [
    {
      "actions": [
        "Microsoft.Consumption/*",
        "Microsoft.CostManagement/*",
        "Microsoft.Billing/billingPeriods/read",
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*",
        "Microsoft.Advisor/configurations/read",
        "Microsoft.Advisor/recommendations/read",
        "Microsoft.Management/managementGroups/read",
        "Microsoft.Billing/billingProperty/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Cost Management Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cost Management Reader

Can view cost data and configuration (e.g. budgets, exports)

[Learn more](/azure/cost-management-billing/costs/understand-work-scopes)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Consumption](../permissions/management-and-governance.md#microsoftconsumption)/*/read |  |
> | [Microsoft.CostManagement](../permissions/management-and-governance.md#microsoftcostmanagement)/*/read |  |
> | [Microsoft.Billing](../permissions/management-and-governance.md#microsoftbilling)/billingPeriods/read |  |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/read | Gets the list of subscriptions. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | [Microsoft.Advisor](../permissions/management-and-governance.md#microsoftadvisor)/configurations/read | Get configurations |
> | [Microsoft.Advisor](../permissions/management-and-governance.md#microsoftadvisor)/recommendations/read | Reads recommendations |
> | [Microsoft.Management](../permissions/management-and-governance.md#microsoftmanagement)/managementGroups/read | List management groups for the authenticated user. |
> | [Microsoft.Billing](../permissions/management-and-governance.md#microsoftbilling)/billingProperty/read | Gets the billing properties for a subscription |
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
  "description": "Can view cost data and configuration (e.g. budgets, exports)",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/72fafb9e-0641-4937-9268-a91bfd8191a3",
  "name": "72fafb9e-0641-4937-9268-a91bfd8191a3",
  "permissions": [
    {
      "actions": [
        "Microsoft.Consumption/*/read",
        "Microsoft.CostManagement/*/read",
        "Microsoft.Billing/billingPeriods/read",
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*",
        "Microsoft.Advisor/configurations/read",
        "Microsoft.Advisor/recommendations/read",
        "Microsoft.Management/managementGroups/read",
        "Microsoft.Billing/billingProperty/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Cost Management Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Hierarchy Settings Administrator

Allows users to edit and delete Hierarchy Settings

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Management](../permissions/management-and-governance.md#microsoftmanagement)/managementGroups/settings/write | Creates or updates management group hierarchy settings. |
> | [Microsoft.Management](../permissions/management-and-governance.md#microsoftmanagement)/managementGroups/settings/delete | Deletes management group hierarchy settings. |
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
  "description": "Allows users to edit and delete Hierarchy Settings",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/350f8d15-c687-4448-8ae1-157740a3936d",
  "name": "350f8d15-c687-4448-8ae1-157740a3936d",
  "permissions": [
    {
      "actions": [
        "Microsoft.Management/managementGroups/settings/write",
        "Microsoft.Management/managementGroups/settings/delete"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Hierarchy Settings Administrator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Managed Application Contributor Role

Allows for creating managed application resources.

[!INCLUDE [role-read-permissions.md](../includes/role-read-permissions.md)]

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | */read | Read control plane information for all Azure resources. |
> | [Microsoft.Solutions](../permissions/management-and-governance.md#microsoftsolutions)/applications/* |  |
> | [Microsoft.Solutions](../permissions/management-and-governance.md#microsoftsolutions)/register/action | Register the subscription for Microsoft.Solutions |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/* |  |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
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
  "description": "Allows for creating managed application resources.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/641177b8-a67a-45b9-a033-47bc880bb21e",
  "name": "641177b8-a67a-45b9-a033-47bc880bb21e",
  "permissions": [
    {
      "actions": [
        "*/read",
        "Microsoft.Solutions/applications/*",
        "Microsoft.Solutions/register/action",
        "Microsoft.Resources/subscriptions/resourceGroups/*",
        "Microsoft.Resources/deployments/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Managed Application Contributor Role",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Managed Application Operator Role

Lets you read and perform actions on Managed Application resources

[!INCLUDE [role-read-permissions.md](../includes/role-read-permissions.md)]

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | */read | Read control plane information for all Azure resources. |
> | [Microsoft.Solutions](../permissions/management-and-governance.md#microsoftsolutions)/applications/read | Lists all the applications within a subscription. |
> | [Microsoft.Solutions](../permissions/management-and-governance.md#microsoftsolutions)/*/action |  |
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
  "description": "Lets you read and perform actions on Managed Application resources",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/c7393b34-138c-406f-901b-d8cf2b17e6ae",
  "name": "c7393b34-138c-406f-901b-d8cf2b17e6ae",
  "permissions": [
    {
      "actions": [
        "*/read",
        "Microsoft.Solutions/applications/read",
        "Microsoft.Solutions/*/action"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Managed Application Operator Role",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Managed Applications Reader

Lets you read resources in a managed app and request JIT access.

[!INCLUDE [role-read-permissions.md](../includes/role-read-permissions.md)]

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | */read | Read control plane information for all Azure resources. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Solutions](../permissions/management-and-governance.md#microsoftsolutions)/jitRequests/* |  |
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
  "description": "Lets you read resources in a managed app and request JIT access.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/b9331d33-8a36-4f8c-b097-4f54124fdb44",
  "name": "b9331d33-8a36-4f8c-b097-4f54124fdb44",
  "permissions": [
    {
      "actions": [
        "*/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Solutions/jitRequests/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Managed Applications Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Managed Services Registration assignment Delete Role

Managed Services Registration Assignment Delete Role allows the managing tenant users to delete the registration assignment assigned to their tenant.

[Learn more](/azure/lighthouse/how-to/remove-delegation)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.ManagedServices](../permissions/management-and-governance.md#microsoftmanagedservices)/registrationAssignments/read | Retrieves a list of Managed Services registration assignments. |
> | [Microsoft.ManagedServices](../permissions/management-and-governance.md#microsoftmanagedservices)/registrationAssignments/delete | Removes Managed Services registration assignment. |
> | [Microsoft.ManagedServices](../permissions/management-and-governance.md#microsoftmanagedservices)/operationStatuses/read | Reads the operation status for the resource. |
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
  "description": "Managed Services Registration Assignment Delete Role allows the managing tenant users to delete the registration assignment assigned to their tenant.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/91c1777a-f3dc-4fae-b103-61d183457e46",
  "name": "91c1777a-f3dc-4fae-b103-61d183457e46",
  "permissions": [
    {
      "actions": [
        "Microsoft.ManagedServices/registrationAssignments/read",
        "Microsoft.ManagedServices/registrationAssignments/delete",
        "Microsoft.ManagedServices/operationStatuses/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Managed Services Registration assignment Delete Role",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Management Group Contributor

Management Group Contributor Role

[Learn more](/azure/governance/management-groups/overview)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Management](../permissions/management-and-governance.md#microsoftmanagement)/managementGroups/delete | Delete management group. |
> | [Microsoft.Management](../permissions/management-and-governance.md#microsoftmanagement)/managementGroups/read | List management groups for the authenticated user. |
> | [Microsoft.Management](../permissions/management-and-governance.md#microsoftmanagement)/managementGroups/subscriptions/delete | De-associates subscription from the management group. |
> | [Microsoft.Management](../permissions/management-and-governance.md#microsoftmanagement)/managementGroups/subscriptions/write | Associates existing subscription with the management group. |
> | [Microsoft.Management](../permissions/management-and-governance.md#microsoftmanagement)/managementGroups/write | Create or update a management group. |
> | [Microsoft.Management](../permissions/management-and-governance.md#microsoftmanagement)/managementGroups/subscriptions/read | Lists subscription under the given management group. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
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
  "description": "Management Group Contributor Role",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/5d58bcaf-24a5-4b20-bdb6-eed9f69fbe4c",
  "name": "5d58bcaf-24a5-4b20-bdb6-eed9f69fbe4c",
  "permissions": [
    {
      "actions": [
        "Microsoft.Management/managementGroups/delete",
        "Microsoft.Management/managementGroups/read",
        "Microsoft.Management/managementGroups/subscriptions/delete",
        "Microsoft.Management/managementGroups/subscriptions/write",
        "Microsoft.Management/managementGroups/write",
        "Microsoft.Management/managementGroups/subscriptions/read",
        "Microsoft.Authorization/*/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Management Group Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Management Group Reader

Management Group Reader Role

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Management](../permissions/management-and-governance.md#microsoftmanagement)/managementGroups/read | List management groups for the authenticated user. |
> | [Microsoft.Management](../permissions/management-and-governance.md#microsoftmanagement)/managementGroups/subscriptions/read | Lists subscription under the given management group. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
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
  "description": "Management Group Reader Role",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/ac63b705-f282-497d-ac71-919bf39d939d",
  "name": "ac63b705-f282-497d-ac71-919bf39d939d",
  "permissions": [
    {
      "actions": [
        "Microsoft.Management/managementGroups/read",
        "Microsoft.Management/managementGroups/subscriptions/read",
        "Microsoft.Authorization/*/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Management Group Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## New Relic APM Account Contributor

Lets you manage New Relic Application Performance Management accounts and applications, but not access to them.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.ResourceHealth](../permissions/management-and-governance.md#microsoftresourcehealth)/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | NewRelic.APM/accounts/* |  |
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
  "description": "Lets you manage New Relic Application Performance Management accounts and applications, but not access to them.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/5d28c62d-5b37-4476-8438-e587778df237",
  "name": "5d28c62d-5b37-4476-8438-e587778df237",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*",
        "NewRelic.APM/accounts/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "New Relic APM Account Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Policy Insights Data Writer (Preview)

Allows read access to resource policies and write access to resource component policy events.

[Learn more](/azure/governance/policy/concepts/policy-for-kubernetes)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/policyassignments/read | Get information about a policy assignment. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/policydefinitions/read | Get information about a policy definition. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/policyexemptions/read | Get information about a policy exemption. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/policysetdefinitions/read | Get information about a policy set definition. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.PolicyInsights](../permissions/management-and-governance.md#microsoftpolicyinsights)/checkDataPolicyCompliance/action | Check the compliance status of a given component against data policies. |
> | [Microsoft.PolicyInsights](../permissions/management-and-governance.md#microsoftpolicyinsights)/policyEvents/logDataEvents/action | Log the resource component policy events. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows read access to resource policies and write access to resource component policy events.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/66bb4e9e-b016-4a94-8249-4c0511c2be84",
  "name": "66bb4e9e-b016-4a94-8249-4c0511c2be84",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/policyassignments/read",
        "Microsoft.Authorization/policydefinitions/read",
        "Microsoft.Authorization/policyexemptions/read",
        "Microsoft.Authorization/policysetdefinitions/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.PolicyInsights/checkDataPolicyCompliance/action",
        "Microsoft.PolicyInsights/policyEvents/logDataEvents/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Policy Insights Data Writer (Preview)",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Quota Request Operator

Read and create quota requests, get quota request status, and create support tickets.

[Learn more](/rest/api/reserved-vm-instances/quotaapi)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Capacity](../permissions/general.md#microsoftcapacity)/resourceProviders/locations/serviceLimits/read | Get the current service limit or quota of the specified resource and location |
> | [Microsoft.Capacity](../permissions/general.md#microsoftcapacity)/resourceProviders/locations/serviceLimits/write | Create service limit or quota for the specified resource and location |
> | [Microsoft.Capacity](../permissions/general.md#microsoftcapacity)/resourceProviders/locations/serviceLimitsRequests/read | Get any service limit request for the specified resource and location |
> | [Microsoft.Capacity](../permissions/general.md#microsoftcapacity)/register/action | Registers the Capacity resource provider and enables the creation of Capacity resources. |
> | [Microsoft.Quota](../permissions/general.md#microsoftquota)/usages/read | Get the usages for resource providers |
> | [Microsoft.Quota](../permissions/general.md#microsoftquota)/quotas/read | Get the current Service limit or quota of the specified resource |
> | [Microsoft.Quota](../permissions/general.md#microsoftquota)/quotas/write | Creates the service limit or quota request for the specified resource |
> | [Microsoft.Quota](../permissions/general.md#microsoftquota)/quotaRequests/read | Get any service limit request for the specified resource |
> | [Microsoft.Quota](../permissions/general.md#microsoftquota)/register/action | Register the subscription with Microsoft.Quota Resource Provider |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
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
  "description": "Read and create quota requests, get quota request status, and create support tickets.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/0e5f05e5-9ab9-446b-b98d-1e2157c94125",
  "name": "0e5f05e5-9ab9-446b-b98d-1e2157c94125",
  "permissions": [
    {
      "actions": [
        "Microsoft.Capacity/resourceProviders/locations/serviceLimits/read",
        "Microsoft.Capacity/resourceProviders/locations/serviceLimits/write",
        "Microsoft.Capacity/resourceProviders/locations/serviceLimitsRequests/read",
        "Microsoft.Capacity/register/action",
        "Microsoft.Quota/usages/read",
        "Microsoft.Quota/quotas/read",
        "Microsoft.Quota/quotas/write",
        "Microsoft.Quota/quotaRequests/read",
        "Microsoft.Quota/register/action",
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Quota Request Operator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Reservation Purchaser

Lets you purchase reservations

[Learn more](/azure/cost-management-billing/reservations/prepare-buy-reservation)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleAssignments/read | Get information about a role assignment. |
> | [Microsoft.Capacity](../permissions/general.md#microsoftcapacity)/catalogs/read | Read catalog of Reservation |
> | [Microsoft.Capacity](../permissions/general.md#microsoftcapacity)/register/action | Registers the Capacity resource provider and enables the creation of Capacity resources. |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/register/action | Registers Subscription with Microsoft.Compute resource provider |
> | [Microsoft.Consumption](../permissions/management-and-governance.md#microsoftconsumption)/register/action | Register to Consumption RP |
> | [Microsoft.Consumption](../permissions/management-and-governance.md#microsoftconsumption)/reservationRecommendationDetails/read | List Reservation Recommendation Details |
> | [Microsoft.Consumption](../permissions/management-and-governance.md#microsoftconsumption)/reservationRecommendations/read | List single or shared recommendations for Reserved instances for a subscription. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/read | Gets the list of subscriptions. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.SQL](../permissions/databases.md#microsoftsql)/register/action | Registers the subscription for the Microsoft SQL Database resource provider and enables the creation of Microsoft SQL Databases. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/supporttickets/write | Allows creating and updating a support ticket |
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
  "description": "Lets you purchase reservations",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/f7b75c60-3036-4b75-91c3-6b41c27c1689",
  "name": "f7b75c60-3036-4b75-91c3-6b41c27c1689",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/roleAssignments/read",
        "Microsoft.Capacity/catalogs/read",
        "Microsoft.Capacity/register/action",
        "Microsoft.Compute/register/action",
        "Microsoft.Consumption/register/action",
        "Microsoft.Consumption/reservationRecommendationDetails/read",
        "Microsoft.Consumption/reservationRecommendations/read",
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.SQL/register/action",
        "Microsoft.Support/supporttickets/write"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Reservation Purchaser",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Reservations Reader

Lets one read all the reservations in a tenant

[Learn more](/azure/cost-management-billing/reservations/view-reservations)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Capacity](../permissions/general.md#microsoftcapacity)/*/read |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleAssignments/read | Get information about a role assignment. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/providers/Microsoft.Capacity"
  ],
  "description": "Lets one read all the reservations in a tenant",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/582fc458-8989-419f-a480-75249bc5db7e",
  "name": "582fc458-8989-419f-a480-75249bc5db7e",
  "permissions": [
    {
      "actions": [
        "Microsoft.Capacity/*/read",
        "Microsoft.Authorization/roleAssignments/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Reservations Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Resource Policy Contributor

Users with rights to create/modify resource policy, create support ticket and read resources/hierarchy.

[!INCLUDE [role-read-permissions.md](../includes/role-read-permissions.md)]

[Learn more](/azure/governance/policy/overview)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | */read | Read control plane information for all Azure resources. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/policyassignments/* | Create and manage policy assignments |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/policydefinitions/* | Create and manage policy definitions |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/policyexemptions/* | Create and manage policy exemptions |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/policysetdefinitions/* | Create and manage policy sets |
> | [Microsoft.PolicyInsights](../permissions/management-and-governance.md#microsoftpolicyinsights)/* |  |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
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
  "description": "Users with rights to create/modify resource policy, create support ticket and read resources/hierarchy.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/36243c78-bf99-498c-9df9-86d9f8d28608",
  "name": "36243c78-bf99-498c-9df9-86d9f8d28608",
  "permissions": [
    {
      "actions": [
        "*/read",
        "Microsoft.Authorization/policyassignments/*",
        "Microsoft.Authorization/policydefinitions/*",
        "Microsoft.Authorization/policyexemptions/*",
        "Microsoft.Authorization/policysetdefinitions/*",
        "Microsoft.PolicyInsights/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Resource Policy Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Savings plan Purchaser

Lets you purchase savings plans

[Learn more](/azure/cost-management-billing/savings-plan/permission-view-manage)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/read | Gets the list of subscriptions. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Capacity](../permissions/general.md#microsoftcapacity)/register/action | Registers the Capacity resource provider and enables the creation of Capacity resources. |
> | [Microsoft.Capacity](../permissions/general.md#microsoftcapacity)/catalogs/read | Read catalog of Reservation |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleAssignments/read | Get information about a role assignment. |
> | [Microsoft.BillingBenefits](../permissions/management-and-governance.md#microsoftbillingbenefits)/savingsPlanOrders/write | Create a savings plan orders |
> | [Microsoft.BIllingBenefits](../permissions/management-and-governance.md#microsoftbillingbenefits)/register/action | Registers the BillingBenefits resource provider and enables the creation of BillingBenefits resources. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/supporttickets/write | Allows creating and updating a support ticket |
> | [Microsoft.Billing](../permissions/management-and-governance.md#microsoftbilling)/billingProperty/read | Gets the billing properties for a subscription |
> | [Microsoft.CostManagement](../permissions/management-and-governance.md#microsoftcostmanagement)/benefitRecommendations/read | List  single or shared recommendations for Microsoft benefits. |
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
  "description": "Lets you purchase savings plans",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/3d24a3a0-c154-4f6f-a5ed-adc8e01ddb74",
  "name": "3d24a3a0-c154-4f6f-a5ed-adc8e01ddb74",
  "permissions": [
    {
      "actions": [
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Capacity/register/action",
        "Microsoft.Capacity/catalogs/read",
        "Microsoft.Authorization/roleAssignments/read",
        "Microsoft.BillingBenefits/savingsPlanOrders/write",
        "Microsoft.BIllingBenefits/register/action",
        "Microsoft.Support/supporttickets/write",
        "Microsoft.Billing/billingProperty/read",
        "Microsoft.CostManagement/benefitRecommendations/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Savings plan Purchaser",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Scheduled Patching Contributor

Provides access to manage maintenance configurations with maintenance scope InGuestPatch and corresponding configuration assignments

[Learn more](/azure/update-manager/scheduled-patching)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Maintenance](../permissions/management-and-governance.md#microsoftmaintenance)/maintenanceConfigurations/read | Read maintenance configuration. |
> | [Microsoft.Maintenance](../permissions/management-and-governance.md#microsoftmaintenance)/maintenanceConfigurations/write | Create or update maintenance configuration. |
> | [Microsoft.Maintenance](../permissions/management-and-governance.md#microsoftmaintenance)/maintenanceConfigurations/delete | Delete maintenance configuration. |
> | [Microsoft.Maintenance](../permissions/management-and-governance.md#microsoftmaintenance)/configurationAssignments/read | Read maintenance configuration assignment. |
> | [Microsoft.Maintenance](../permissions/management-and-governance.md#microsoftmaintenance)/configurationAssignments/write | Create or update maintenance configuration assignment. |
> | [Microsoft.Maintenance](../permissions/management-and-governance.md#microsoftmaintenance)/configurationAssignments/delete | Delete maintenance configuration assignment. |
> | [Microsoft.Maintenance](../permissions/management-and-governance.md#microsoftmaintenance)/configurationAssignments/maintenanceScope/InGuestPatch/read | Read maintenance configuration assignment for InGuestPatch maintenance scope. |
> | [Microsoft.Maintenance](../permissions/management-and-governance.md#microsoftmaintenance)/configurationAssignments/maintenanceScope/InGuestPatch/write | Create or update a maintenance configuration assignment for InGuestPatch maintenance scope. |
> | [Microsoft.Maintenance](../permissions/management-and-governance.md#microsoftmaintenance)/configurationAssignments/maintenanceScope/InGuestPatch/delete | Delete maintenance configuration assignment for InGuestPatch maintenance scope. |
> | [Microsoft.Maintenance](../permissions/management-and-governance.md#microsoftmaintenance)/maintenanceConfigurations/maintenanceScope/InGuestPatch/read | Read maintenance configuration for InGuestPatch maintenance scope. |
> | [Microsoft.Maintenance](../permissions/management-and-governance.md#microsoftmaintenance)/maintenanceConfigurations/maintenanceScope/InGuestPatch/write | Create or update a maintenance configuration for InGuestPatch maintenance scope. |
> | [Microsoft.Maintenance](../permissions/management-and-governance.md#microsoftmaintenance)/maintenanceConfigurations/maintenanceScope/InGuestPatch/delete | Delete maintenance configuration for InGuestPatch maintenance scope. |
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
  "description": "Provides access to manage maintenance configurations with maintenance scope InGuestPatch and corresponding configuration assignments",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/cd08ab90-6b14-449c-ad9a-8f8e549482c6",
  "name": "cd08ab90-6b14-449c-ad9a-8f8e549482c6",
  "permissions": [
    {
      "actions": [
        "Microsoft.Maintenance/maintenanceConfigurations/read",
        "Microsoft.Maintenance/maintenanceConfigurations/write",
        "Microsoft.Maintenance/maintenanceConfigurations/delete",
        "Microsoft.Maintenance/configurationAssignments/read",
        "Microsoft.Maintenance/configurationAssignments/write",
        "Microsoft.Maintenance/configurationAssignments/delete",
        "Microsoft.Maintenance/configurationAssignments/maintenanceScope/InGuestPatch/read",
        "Microsoft.Maintenance/configurationAssignments/maintenanceScope/InGuestPatch/write",
        "Microsoft.Maintenance/configurationAssignments/maintenanceScope/InGuestPatch/delete",
        "Microsoft.Maintenance/maintenanceConfigurations/maintenanceScope/InGuestPatch/read",
        "Microsoft.Maintenance/maintenanceConfigurations/maintenanceScope/InGuestPatch/write",
        "Microsoft.Maintenance/maintenanceConfigurations/maintenanceScope/InGuestPatch/delete"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Scheduled Patching Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Site Recovery Contributor

Lets you manage Site Recovery service except vault creation and role assignment

[Learn more](/azure/site-recovery/site-recovery-role-based-linked-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/read | Get the virtual network definition |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/locations/allocatedStamp/read | GetAllocatedStamp is internal operation used by service |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/locations/allocateStamp/action | AllocateStamp is internal operation used by service |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/Vaults/certificates/write | The Update Resource Certificate operation updates the resource/vault credential certificate. |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/Vaults/extendedInformation/* | Create and manage extended info related to vault |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/Vaults/read | The Get Vault operation gets an object representing the Azure resource of type 'vault' |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/Vaults/refreshContainers/read |  |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/Vaults/registeredIdentities/* | Create and manage registered identities |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationAlertSettings/* | Create or Update replication alert settings |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationEvents/read | Read any Events |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationFabrics/* | Create and manage replication fabrics |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationJobs/* | Create and manage replication jobs |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationPolicies/* | Create and manage replication policies |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationRecoveryPlans/* | Create and manage recovery plans |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationVaultSettings/* |  |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/Vaults/storageConfig/* | Create and manage storage configuration of Recovery Services vault |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/Vaults/tokenInfo/read |  |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/Vaults/usages/read | Returns usage details for a Recovery Services Vault. |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/Vaults/vaultTokens/read | The Vault Token operation can be used to get Vault Token for vault level backend operations. |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/Vaults/monitoringAlerts/* | Read alerts for the Recovery services vault |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/Vaults/monitoringConfigurations/notificationConfiguration/read |  |
> | [Microsoft.ResourceHealth](../permissions/management-and-governance.md#microsoftresourcehealth)/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/read | Returns the list of storage accounts or gets the properties for the specified storage account. |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationOperationStatus/read | Read any Vault Replication Operation Status |
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
  "description": "Lets you manage Site Recovery service except vault creation and role assignment",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/6670b86e-a3f7-4917-ac9b-5d6ab1be4567",
  "name": "6670b86e-a3f7-4917-ac9b-5d6ab1be4567",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Network/virtualNetworks/read",
        "Microsoft.RecoveryServices/locations/allocatedStamp/read",
        "Microsoft.RecoveryServices/locations/allocateStamp/action",
        "Microsoft.RecoveryServices/Vaults/certificates/write",
        "Microsoft.RecoveryServices/Vaults/extendedInformation/*",
        "Microsoft.RecoveryServices/Vaults/read",
        "Microsoft.RecoveryServices/Vaults/refreshContainers/read",
        "Microsoft.RecoveryServices/Vaults/registeredIdentities/*",
        "Microsoft.RecoveryServices/vaults/replicationAlertSettings/*",
        "Microsoft.RecoveryServices/vaults/replicationEvents/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/*",
        "Microsoft.RecoveryServices/vaults/replicationJobs/*",
        "Microsoft.RecoveryServices/vaults/replicationPolicies/*",
        "Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/*",
        "Microsoft.RecoveryServices/vaults/replicationVaultSettings/*",
        "Microsoft.RecoveryServices/Vaults/storageConfig/*",
        "Microsoft.RecoveryServices/Vaults/tokenInfo/read",
        "Microsoft.RecoveryServices/Vaults/usages/read",
        "Microsoft.RecoveryServices/Vaults/vaultTokens/read",
        "Microsoft.RecoveryServices/Vaults/monitoringAlerts/*",
        "Microsoft.RecoveryServices/Vaults/monitoringConfigurations/notificationConfiguration/read",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Storage/storageAccounts/read",
        "Microsoft.RecoveryServices/vaults/replicationOperationStatus/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Site Recovery Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Site Recovery Operator

Lets you failover and failback but not perform other Site Recovery management operations

[Learn more](/azure/site-recovery/site-recovery-role-based-linked-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/read | Get the virtual network definition |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/locations/allocatedStamp/read | GetAllocatedStamp is internal operation used by service |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/locations/allocateStamp/action | AllocateStamp is internal operation used by service |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/Vaults/extendedInformation/read | The Get Extended Info operation gets an object's Extended Info representing the Azure resource of type ?vault? |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/Vaults/read | The Get Vault operation gets an object representing the Azure resource of type 'vault' |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/Vaults/refreshContainers/read |  |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/Vaults/registeredIdentities/operationResults/read | The Get Operation Results operation can be used get the operation status and result for the asynchronously submitted operation |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/Vaults/registeredIdentities/read | The Get Containers operation can be used get the containers registered for a resource. |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationAlertSettings/read | Read any Alerts Settings |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationEvents/read | Read any Events |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationFabrics/checkConsistency/action | Checks Consistency of the Fabric |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationFabrics/read | Read any Fabrics |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationFabrics/reassociateGateway/action | Reassociate Gateway |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationFabrics/renewcertificate/action | Renew Certificate for Fabric |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationFabrics/replicationNetworks/read | Read any Networks |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationFabrics/replicationNetworks/replicationNetworkMappings/read | Read any Network Mappings |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationFabrics/replicationProtectionContainers/read | Read any Protection Containers |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectableItems/read | Read any Protectable Items |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/applyRecoveryPoint/action | Apply Recovery Point |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/failoverCommit/action | Failover Commit |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/plannedFailover/action | Planned Failover |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/read | Read any Protected Items |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/recoveryPoints/read | Read any Replication Recovery Points |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/repairReplication/action | Repair replication |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/reProtect/action | ReProtect Protected Item |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationFabrics/replicationProtectionContainers/switchprotection/action | Switch Protection Container |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/testFailover/action | Test Failover |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/testFailoverCleanup/action | Test Failover Cleanup |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/unplannedFailover/action | Failover |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/updateMobilityService/action | Update Mobility Service |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionContainerMappings/read | Read any Protection Container Mappings |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationFabrics/replicationRecoveryServicesProviders/read | Read any Recovery Services Providers |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationFabrics/replicationRecoveryServicesProviders/refreshProvider/action | Refresh Provider |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationFabrics/replicationStorageClassifications/read | Read any Storage Classifications |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationFabrics/replicationStorageClassifications/replicationStorageClassificationMappings/read | Read any Storage Classification Mappings |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationFabrics/replicationvCenters/read | Read any vCenters |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationJobs/* | Create and manage replication jobs |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationPolicies/read | Read any Policies |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationRecoveryPlans/failoverCommit/action | Failover Commit Recovery Plan |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationRecoveryPlans/plannedFailover/action | Planned Failover Recovery Plan |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationRecoveryPlans/read | Read any Recovery Plans |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationRecoveryPlans/reProtect/action | ReProtect Recovery Plan |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationRecoveryPlans/testFailover/action | Test Failover Recovery Plan |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationRecoveryPlans/testFailoverCleanup/action | Test Failover Cleanup Recovery Plan |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationRecoveryPlans/unplannedFailover/action | Failover Recovery Plan |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationVaultSettings/read | Read any  |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/Vaults/monitoringAlerts/* | Read alerts for the Recovery services vault |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/Vaults/monitoringConfigurations/notificationConfiguration/read |  |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/Vaults/storageConfig/read |  |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/Vaults/tokenInfo/read |  |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/Vaults/usages/read | Returns usage details for a Recovery Services Vault. |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/Vaults/vaultTokens/read | The Vault Token operation can be used to get Vault Token for vault level backend operations. |
> | [Microsoft.ResourceHealth](../permissions/management-and-governance.md#microsoftresourcehealth)/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/read | Returns the list of storage accounts or gets the properties for the specified storage account. |
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
  "description": "Lets you failover and failback but not perform other Site Recovery management operations",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/494ae006-db33-4328-bf46-533a6560a3ca",
  "name": "494ae006-db33-4328-bf46-533a6560a3ca",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Network/virtualNetworks/read",
        "Microsoft.RecoveryServices/locations/allocatedStamp/read",
        "Microsoft.RecoveryServices/locations/allocateStamp/action",
        "Microsoft.RecoveryServices/Vaults/extendedInformation/read",
        "Microsoft.RecoveryServices/Vaults/read",
        "Microsoft.RecoveryServices/Vaults/refreshContainers/read",
        "Microsoft.RecoveryServices/Vaults/registeredIdentities/operationResults/read",
        "Microsoft.RecoveryServices/Vaults/registeredIdentities/read",
        "Microsoft.RecoveryServices/vaults/replicationAlertSettings/read",
        "Microsoft.RecoveryServices/vaults/replicationEvents/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/checkConsistency/action",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/reassociateGateway/action",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/renewcertificate/action",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationNetworks/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationNetworks/replicationNetworkMappings/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectableItems/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/applyRecoveryPoint/action",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/failoverCommit/action",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/plannedFailover/action",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/recoveryPoints/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/repairReplication/action",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/reProtect/action",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/switchprotection/action",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/testFailover/action",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/testFailoverCleanup/action",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/unplannedFailover/action",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/updateMobilityService/action",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionContainerMappings/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationRecoveryServicesProviders/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationRecoveryServicesProviders/refreshProvider/action",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationStorageClassifications/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationStorageClassifications/replicationStorageClassificationMappings/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationvCenters/read",
        "Microsoft.RecoveryServices/vaults/replicationJobs/*",
        "Microsoft.RecoveryServices/vaults/replicationPolicies/read",
        "Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/failoverCommit/action",
        "Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/plannedFailover/action",
        "Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/read",
        "Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/reProtect/action",
        "Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/testFailover/action",
        "Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/testFailoverCleanup/action",
        "Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/unplannedFailover/action",
        "Microsoft.RecoveryServices/vaults/replicationVaultSettings/read",
        "Microsoft.RecoveryServices/Vaults/monitoringAlerts/*",
        "Microsoft.RecoveryServices/Vaults/monitoringConfigurations/notificationConfiguration/read",
        "Microsoft.RecoveryServices/Vaults/storageConfig/read",
        "Microsoft.RecoveryServices/Vaults/tokenInfo/read",
        "Microsoft.RecoveryServices/Vaults/usages/read",
        "Microsoft.RecoveryServices/Vaults/vaultTokens/read",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Storage/storageAccounts/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Site Recovery Operator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Site Recovery Reader

Lets you view Site Recovery status but not perform other management operations

[Learn more](/azure/site-recovery/site-recovery-role-based-linked-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/locations/allocatedStamp/read | GetAllocatedStamp is internal operation used by service |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/Vaults/extendedInformation/read | The Get Extended Info operation gets an object's Extended Info representing the Azure resource of type ?vault? |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/Vaults/monitoringAlerts/read | Gets the alerts for the Recovery services vault. |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/Vaults/monitoringConfigurations/notificationConfiguration/read |  |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/Vaults/read | The Get Vault operation gets an object representing the Azure resource of type 'vault' |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/Vaults/refreshContainers/read |  |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/Vaults/registeredIdentities/operationResults/read | The Get Operation Results operation can be used get the operation status and result for the asynchronously submitted operation |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/Vaults/registeredIdentities/read | The Get Containers operation can be used get the containers registered for a resource. |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationAlertSettings/read | Read any Alerts Settings |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationEvents/read | Read any Events |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationFabrics/read | Read any Fabrics |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationFabrics/replicationNetworks/read | Read any Networks |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationFabrics/replicationNetworks/replicationNetworkMappings/read | Read any Network Mappings |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationFabrics/replicationProtectionContainers/read | Read any Protection Containers |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectableItems/read | Read any Protectable Items |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/read | Read any Protected Items |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/recoveryPoints/read | Read any Replication Recovery Points |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionContainerMappings/read | Read any Protection Container Mappings |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationFabrics/replicationRecoveryServicesProviders/read | Read any Recovery Services Providers |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationFabrics/replicationStorageClassifications/read | Read any Storage Classifications |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationFabrics/replicationStorageClassifications/replicationStorageClassificationMappings/read | Read any Storage Classification Mappings |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationFabrics/replicationvCenters/read | Read any vCenters |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationJobs/read | Read any Jobs |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationPolicies/read | Read any Policies |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationRecoveryPlans/read | Read any Recovery Plans |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationVaultSettings/read | Read any  |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/Vaults/storageConfig/read |  |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/Vaults/tokenInfo/read |  |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/Vaults/usages/read | Returns usage details for a Recovery Services Vault. |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/Vaults/vaultTokens/read | The Vault Token operation can be used to get Vault Token for vault level backend operations. |
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
  "description": "Lets you view Site Recovery status but not perform other management operations",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/dbaa88c4-0c30-4179-9fb3-46319faa6149",
  "name": "dbaa88c4-0c30-4179-9fb3-46319faa6149",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.RecoveryServices/locations/allocatedStamp/read",
        "Microsoft.RecoveryServices/Vaults/extendedInformation/read",
        "Microsoft.RecoveryServices/Vaults/monitoringAlerts/read",
        "Microsoft.RecoveryServices/Vaults/monitoringConfigurations/notificationConfiguration/read",
        "Microsoft.RecoveryServices/Vaults/read",
        "Microsoft.RecoveryServices/Vaults/refreshContainers/read",
        "Microsoft.RecoveryServices/Vaults/registeredIdentities/operationResults/read",
        "Microsoft.RecoveryServices/Vaults/registeredIdentities/read",
        "Microsoft.RecoveryServices/vaults/replicationAlertSettings/read",
        "Microsoft.RecoveryServices/vaults/replicationEvents/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationNetworks/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationNetworks/replicationNetworkMappings/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectableItems/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/recoveryPoints/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionContainerMappings/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationRecoveryServicesProviders/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationStorageClassifications/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationStorageClassifications/replicationStorageClassificationMappings/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationvCenters/read",
        "Microsoft.RecoveryServices/vaults/replicationJobs/read",
        "Microsoft.RecoveryServices/vaults/replicationPolicies/read",
        "Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/read",
        "Microsoft.RecoveryServices/vaults/replicationVaultSettings/read",
        "Microsoft.RecoveryServices/Vaults/storageConfig/read",
        "Microsoft.RecoveryServices/Vaults/tokenInfo/read",
        "Microsoft.RecoveryServices/Vaults/usages/read",
        "Microsoft.RecoveryServices/Vaults/vaultTokens/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Site Recovery Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Support Request Contributor

Lets you create and manage Support requests

[Learn more](/azure/azure-portal/supportability/how-to-create-azure-support-request)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
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
  "description": "Lets you create and manage Support requests",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/cfd33db0-3dd1-45e3-aa9d-cdbdf3b6f24e",
  "name": "cfd33db0-3dd1-45e3-aa9d-cdbdf3b6f24e",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Support Request Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Tag Contributor

Lets you manage tags on entities, without providing access to the entities themselves.

[Learn more](/azure/azure-resource-manager/management/tag-resources)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/resources/read | Gets the resources for the resource group. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resources/read | Gets resources of a subscription. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/tags/* |  |
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
  "description": "Lets you manage tags on entities, without providing access to the entities themselves.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/4a9ae827-6dc8-4573-8ac7-8239d42aa03f",
  "name": "4a9ae827-6dc8-4573-8ac7-8239d42aa03f",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Resources/subscriptions/resourceGroups/resources/read",
        "Microsoft.Resources/subscriptions/resources/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Support/*",
        "Microsoft.Resources/tags/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Tag Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Template Spec Contributor

Allows full access to Template Spec operations at the assigned scope.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/templateSpecs/* | Create and manage template specs and template spec versions |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
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
  "description": "Allows full access to Template Spec operations at the assigned scope.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/1c9b6475-caf0-4164-b5a1-2142a7116f4b",
  "name": "1c9b6475-caf0-4164-b5a1-2142a7116f4b",
  "permissions": [
    {
      "actions": [
        "Microsoft.Resources/templateSpecs/*",
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Template Spec Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Template Spec Reader

Allows read access to Template Specs at the assigned scope.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/templateSpecs/*/read | Get or list template specs and template spec versions |
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
  "description": "Allows read access to Template Specs at the assigned scope.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/392ae280-861d-42bd-9ea5-08ee6d83b80e",
  "name": "392ae280-861d-42bd-9ea5-08ee6d83b80e",
  "permissions": [
    {
      "actions": [
        "Microsoft.Resources/templateSpecs/*/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Template Spec Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Next steps

- [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal)