---
title: Get resource changes
description: Understand how to find when a resource was changed and query the list of resource configuration changes at scale
ms.date: 12/07/2021
ms.topic: how-to
---
# Get resource changes

Resources get changed through the course of daily use, reconfiguration, and even redeployment.
Change can come from an individual or by an automated process. Most change is by design, but
sometimes it isn't. With the last 14 days of changes, Resource configuration changes enables you to:

- Find when changes were detected on an Azure Resource Manager property
- For each resource change, see property change details
- Query changes at scale across your subscriptions, Management group, or tenant

Change detection and details are valuable for the following example scenarios:

- During incident management to understand _potentially_ related changes. Query for change events
  during a specific window of time and evaluate the change details.
- Keeping a Configuration Management Database, known as a CMDB, up-to-date. Instead of refreshing
  all resources and their full property sets on a scheduled frequency, only get what changed.
- Understanding what other properties may have been changed when a resource changed compliance
  state. Evaluation of these additional properties can provide insights into other properties that
  may need to be managed via an Azure Policy definition.

This article shows how to query Resource configuration changes through Resource Graph. To see this
information in the Azure portal, see [Azure Resource Graph Explorer](../first-query-portal.md), Azure Policy's
[Change history](../../policy/how-to/determine-non-compliance.md#change-history), or Azure Activity
Log [Change history](../../../azure-monitor/essentials/activity-log.md#view-the-activity-log). For
details about changes to your applications from the infrastructure layer all the way to application
deployment, see
[Use Application Change Analysis (preview)](../../../azure-monitor/app/change-analysis.md) in Azure
Monitor.

> [!NOTE]
> Resource configuration changes is for Azure Resource Manager properties. For tracking changes inside
> a virtual machine, see Azure Automation's
> [Change tracking](../../../automation/change-tracking/overview.md) or Azure Policy's
> [Guest Configuration for VMs](../../policy/concepts/guest-configuration.md).

> [!IMPORTANT]
> Resource configuration changes is in Public Preview.

## Find detected change events and view change details

When a resource is created, updated, or deleted, a new change resource (Microsoft.Resources/changes) is created to extend the modified resource and represent the changed properties.

Example change resource property bag:

```json
{
  "targetResourceId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myResourceGroup/providers/microsoft.compute/virtualmachines/myVM",
  "targetResourceType": "microsoft.compute/virtualmachines",
  "changeType": "Update",
  "changeAttributes": {
    "changesCount": 2,
    "correlationId": "88420d5d-8d0e-471f-9115-10d34750c617",
    "timestamp": "2021-12-07T09:25:41.756Z",
    "previousResourceSnapshotId": "ed90e35a-1661-42cc-a44c-e27f508005be",
    "newResourceSnapshotId": "6eac9d0f-63b4-4e7f-97a5-740c73757efb"
  },
  "changes": {
    "properties.provisioningState": {
      "newValue": "Succeeded",
      "previousValue": "Updating",
      "changeCategory": "System",
      "propertyChangeType": "Update"
    },
    "tags.key1": {
      "newValue": "NewTagValue",
      "previousValue": "null",
      "changeCategory": "User",
      "propertyChangeType": "Insert"
    }
  }
}
```

Each change resource has the following properties:

- **targetResourceId** - The resourceID of the resource on which the change occurred.
 - **targetResourceType** - The resource type of the resource on which the change occurred.
- **changeType** - Describes the type of change detected for the entire change record. Values are: _Create_, _Update_, and _Delete_. The
  **changes** property dictionary is only included when **changeType** is _Update_.


- **changes** - Dictionary of the resource properties (with property name as the key) that were updated as part of the change:
  - **propertyChangeType** - Describes the type of change detected for the individual resource property.
    Values are: _Insert_, _Update_, _Remove_.
  - **previousValue** - The value of the resource property in the previous snapshot. Value is _null_ when **changeType** is _Insert_.
  - **newValue** - The value of the resource property in the new snapshot. Value is _null_ when **changeType** is _Remove_.
  - **changeCategory** - Describes what made the change. Values are: _System_ and _User_.

- **changeAttributes** - Array of metadata related to the change:
  - **changesCount** - The number of properties changed as part of this change record.
  - **correlationId** - Contains the ID for tracking related events. Each deployment has a correlation ID, and all actions in a single template will share the same correlation ID.
  - **timestamp** - The datetime of when the change was detected.
  - **previousResourceSnapshotId** - Contains the ID of the resource snapshot that was used as the previous state of the resource.
  - **newResourceSnapshotId** - Contains the ID of the resource snapshot that was used as the new state of the resource.

## Resource Graph Query samples

With Resource Graph, you can query the **ResourceChanges** table to filter or sort by any of the change resource properties:

### All changes in the past 1 day
```kusto
ResourceChanges
| extend changeTime = todatetime(properties.changeAttributes.timestamp), targetResourceId = tostring(properties.targetResourceId),
changeType = tostring(properties.changeType), correlationId = properties.changeAttributes.correlationId, 
changedProperties = properties.changes, changeCount = properties.changeAttributes.changesCount
| where changeTime > ago(1d)
| order by changeTime desc
| project changeTime, targetResourceId, changeType, correlationId, changeCount, changedProperties
```

### All created resources
```kusto
ResourceChanges
| extend changeTime = todatetime(properties.changeAttributes.timestamp), targetResourceId = tostring(properties.targetResourceId),
changeType = tostring(properties.changeType), correlationId = properties.changeAttributes.correlationId
| where changeType == "Create"
| order by changeTime desc
| project changeTime, targetResourceId, changeType, correlationId
```

### Resources deleted in a specific resource group
```kusto
ResourceChanges
| where resourceGroup == "myResourceGroup"
| extend changeTime = todatetime(properties.changeAttributes.timestamp), targetResourceId = tostring(properties.targetResourceId),
changeType = tostring(properties.changeType), correlationId = properties.changeAttributes.correlationId
| where changeType == "Delete"
| order by changeTime desc
| project changeTime, resourceGroup, targetResourceId, changeType, correlationId
```

## Changes to a specific property
```kusto
ResourceChanges
| extend provisioningStateChange = properties.changes["properties.provisioningState"], changeTime = todatetime(properties.changeAttributes.timestamp), targetResourceId = tostring(properties.targetResourceId), changeType = tostring(properties.changeType)
| where isnotempty(provisioningStateChange)
| extend newValue = provisioningStateChange.newValue, previousValue = provisioningStateChange.previousValue
| order by changeTime desc
| project changeTime, targetResourceId, changeType, previousValue, newValue, properties
```

## Next steps

- See the language in use in [Starter queries](../samples/starter.md).
- See advanced uses in [Advanced queries](../samples/advanced.md).
- Learn more about how to [explore resources](../concepts/explore-resources.md).
- For guidance on working with queries at a high frequency, see
  [Guidance for throttled requests](../concepts/guidance-for-throttled-requests.md).
