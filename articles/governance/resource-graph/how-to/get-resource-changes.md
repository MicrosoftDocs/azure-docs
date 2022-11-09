---
title: Get resource changes
description: Understand how to find when a resource was changed and query the list of resource configuration changes at scale
ms.date: 06/16/2022
ms.topic: how-to
---
# Get resource changes

Resources get changed through the course of daily use, reconfiguration, and even redeployment.
Change can come from an individual or by an automated process. Most change is by design, but
sometimes it isn't. With the **last fourteen days** of changes, Resource configuration changes enables you to:

- Find when changes were detected on an Azure Resource Manager property
- For each resource change, see property change details
- Query changes at scale across your subscriptions, Management group, or tenant

Change detection and details are valuable for the following example scenarios:

- During incident management to understand _potentially_ related changes. Query for change events
  during a specific window of time and evaluate the change details.
- Keeping a Configuration Management Database, known as a CMDB, up-to-date. Instead of refreshing
  all resources and their full property sets on a scheduled frequency, only get what changed.
- Understanding what other properties may have been changed when a resource changed compliance
  state. Evaluation of these extra properties can provide insights into other properties that
  may need to be managed via an Azure Policy definition.

This article shows how to query Resource configuration changes through Resource Graph. To see this
information in the Azure portal, see [Azure Resource Graph Explorer](../first-query-portal.md), Azure Policy's
[Change history](../../policy/how-to/determine-non-compliance.md#change-history), or Azure Activity
Log [Change history](../../../azure-monitor/essentials/activity-log.md#view-the-activity-log). For
details about changes to your applications from the infrastructure layer all the way to application
deployment, see
[Use Application Change Analysis (preview)](../../../azure-monitor/app/change-analysis.md) in Azure
Monitor.

> [!WARNING]
> There has been a temporary reduction in lookback retention to 7 days.

> [!NOTE]
> Resource configuration changes is for Azure Resource Manager properties. For tracking changes inside
> a virtual machine, see Azure Automation's
> [Change tracking](../../../automation/change-tracking/overview.md) or Azure Policy's
> [Machine Configuration for VMs](../../machine-configuration/overview.md). To view examples of how to query guest configuration resources in Resource Graph, view [Azure Resource Graph queries by category - Azure Policy Machine Configuration](../samples/samples-by-category.md#azure-policy-guest-configuration).

> [!IMPORTANT]
> Resource configuration changes only supports changes to resource types from the [Resources table](..//reference/supported-tables-resources.md#resources) in Resource Graph. This does not yet include changes to the resource container resources, such as Subscriptions and Resource groups. Changes are queryable for fourteen days. For longer retention, you can [integrate your Resource Graph query with Azure Logic Apps](../tutorials/logic-app-calling-arg.md) and export query result to any of the Azure data stores (e.g., Log Analytics) for your desired retention.

## Find detected change events and view change details

When a resource is created, updated, or deleted, a new change resource (Microsoft.Resources/changes) is created to extend the modified resource and represent the changed properties. Change records should be available in under five minutes.

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
  **changes** property dictionary is only included when **changeType** is _Update_. For the _Delete_ case, the change resource will still be maintained as an extension of the deleted resource for fourteen days, even if the entire Resource group has been deleted. The change resource will not block deletions or impact any existing delete behavior.


- **changes** - Dictionary of the resource properties (with property name as the key) that were updated as part of the change:
  - **propertyChangeType** - Describes the type of change detected for the individual resource property.
    Values are: _Insert_, _Update_, _Remove_.
  - **previousValue** - The value of the resource property in the previous snapshot. Value is _null_ when **changeType** is _Insert_.
  - **newValue** - The value of the resource property in the new snapshot. Value is _null_ when **changeType** is _Remove_.
  - **changeCategory** - Describes if the property change was the result of a change in value (_User_) or a difference in referenced API versions (_System_). Values are: _System_ and _User_.

- **changeAttributes** - Array of metadata related to the change:
  - **changesCount** - The number of properties changed as part of this change record.
  - **correlationId** - Contains the ID for tracking related events. Each deployment has a correlation ID, and all actions in a single template will share the same correlation ID.
  - **timestamp** - The datetime of when the change was detected.
  - **previousResourceSnapshotId** - Contains the ID of the resource snapshot that was used as the previous state of the resource.
  - **newResourceSnapshotId** - Contains the ID of the resource snapshot that was used as the new state of the resource.

## How to query changes using Resource Graph
### Prerequisites
- To enable Azure PowerShell to query Azure Resource Graph, the [module must be added](../first-query-powershell.md#add-the-resource-graph-module).
- To enable Azure CLI to query Azure Resource Graph, the [extension must be added](../first-query-azurecli.md#add-the-resource-graph-extension).

### Run your Resource Graph query
It's time to try out a tenant-based Resource Graph query of the **resourcechanges** table. The query returns the first five most recent Azure resource changes with the change time, change type, target resource ID, target resource type, and change details of each change record. To query by
[management group](../../management-groups/overview.md) or subscription, use the `-ManagementGroup`
or `-Subscription` parameters.

1. Run your first Azure Resource Graph query:

# [Azure CLI](#tab/azure-cli)
  ```azurecli
  # Login first with az login if not using Cloud Shell

  # Run Azure Resource Graph query
  az graph query -q 'resourcechanges | project properties.changeAttributes.timestamp, properties.changeType, properties.targetResourceId, properties.targetResourceType, properties.changes | limit 5'
  ```

# [PowerShell](#tab/azure-powershell)
  ```azurepowershell-interactive
  # Login first with Connect-AzAccount if not using Cloud Shell

  # Run Azure Resource Graph query
  Search-AzGraph -Query 'resourcechanges | project properties.changeAttributes.timestamp, properties.changeType, properties.targetResourceId, properties.targetResourceType, properties.changes | limit 5'
  ```

# [Portal](#tab/azure-portal)
  Open the [Azure portal](https://portal.azure.com) to find and use the Resource Graph Explorer
  following these steps to run your first Resource Graph query:

  1. Select **All services** in the left pane. Search for and select **Resource Graph Explorer**.

  1. In the **Query 1** portion of the window, enter the query
     ```kusto
     resourcechanges
     | project properties.changeAttributes.timestamp, properties.changeType, properties.targetResourceId, properties.targetResourceType, properties.changes
     | limit 5
     ```
     and select **Run query**.

  1. Review the query response in the **Results** tab. Select the **Messages** tab to see details
   about the query, including the count of results and duration of the query. Errors, if any, are
   displayed under this tab.

---

   > [!NOTE]
   > As this query example doesn't provide a sort modifier such as `order by`, running this query
   > multiple times is likely to yield a different set of resources per request.


2. Update the query to specify a more user-friendly column name for the **timestamp** property:

# [Azure CLI](#tab/azure-cli)
   ```azurecli
   # Run Azure Resource Graph query with 'extend' to define a user-friendly name for properties.changeAttributes.timestamp
   az graph query -q 'resourcechanges | extend changeTime=todatetime(properties.changeAttributes.timestamp) | project changeTime, properties.changeType, properties.targetResourceId, properties.targetResourceType, properties.changes | limit 5'
   ```

# [PowerShell](#tab/azure-powershell)
   ```azurepowershell-interactive
   # Run Azure Resource Graph query with 'extend' to define a user-friendly name for properties.changeAttributes.timestamp
   Search-AzGraph -Query 'resourcechanges | extend changeTime=todatetime(properties.changeAttributes.timestamp) | project changeTime, properties.changeType, properties.targetResourceId, properties.targetResourceType, properties.changes | limit 5'
   ```

# [Portal](#tab/azure-portal)
   ```kusto
   resourcechanges
   | extend changeTime=todatetime(properties.changeAttributes.timestamp)
   | project changeTime, properties.changeType, properties.targetResourceId, properties.targetResourceType, properties.changes
   | limit 5
   ```
   Then, select **Run query**.

---


3. To get the most recent changes, update the query to `order by` the user-defined **changeTime** property:

# [Azure CLI](#tab/azure-cli)
   ```azurecli
   # Run Azure Resource Graph query with 'order by'
   az graph query -q 'resourcechanges | extend changeTime=todatetime(properties.changeAttributes.timestamp) | project changeTime, properties.changeType, properties.targetResourceId, properties.targetResourceType, properties.changes | order by changeTime desc | limit 5'
   ```

# [PowerShell](#tab/azure-powershell)
   ```azurepowershell-interactive
   # Run Azure Resource Graph query with 'order by'
   Search-AzGraph -Query 'resourcechanges | extend changeTime=todatetime(properties.changeAttributes.timestamp) | project changeTime, properties.changeType, properties.targetResourceId, properties.targetResourceType, properties.changes | order by changeTime desc | limit 5'
   ```

# [Portal](#tab/azure-portal)
   ```kusto
   resourcechanges
   | extend changeTime=todatetime(properties.changeAttributes.timestamp)
   | project changeTime, properties.changeType, properties.targetResourceId, properties.targetResourceType, properties.changes
   | order by changeTime desc
   | limit 5
   ```
   Then, select **Run query**.

---

   > [!NOTE]
   > The order of the query commands is important. In this example,
   > the `order by` must come before the `limit` command. This command order first orders the query results by the change time and
   > then limits them to ensure that you get the five *most recent* results.


When the final query is run several times, assuming that nothing in your environment is changing,
the results returned are consistent and ordered by the **properties.changeAttributes.timestamp** (or your user-defined name of **changeTime**) property, but still limited to the
top five results.


> [!NOTE]
> If the query does not return results from a subscription you already have access to, then note
> that the `Search-AzGraph` PowerShell cmdlet defaults to subscriptions in the default context. To see the list of
> subscription IDs which are part of the default context run this
> `(Get-AzContext).Account.ExtendedProperties.Subscriptions` If you wish to search across all the
> subscriptions you have access to, one can set the PSDefaultParameterValues for `Search-AzGraph`
> cmdlet by running
> `$PSDefaultParameterValues=@{"Search-AzGraph:Subscription"= $(Get-AzSubscription).ID}`

Resource Graph Explorer also provides a clean interface for converting the results of some queries into a chart that can be pinned to an Azure dashboard.
- [Create a chart from the Resource Graph query](../first-query-portal.md#create-a-chart-from-the-resource-graph-query)
- [Pin the query visualization to a dashboard](../first-query-portal.md#pin-the-query-visualization-to-a-dashboard)

## Resource Graph query samples

With Resource Graph, you can query the **resourcechanges** table to filter or sort by any of the change resource properties:

### All changes in the past one day
```kusto
resourcechanges
| extend changeTime = todatetime(properties.changeAttributes.timestamp), targetResourceId = tostring(properties.targetResourceId),
changeType = tostring(properties.changeType), correlationId = properties.changeAttributes.correlationId, 
changedProperties = properties.changes, changeCount = properties.changeAttributes.changesCount
| where changeTime > ago(1d)
| order by changeTime desc
| project changeTime, targetResourceId, changeType, correlationId, changeCount, changedProperties
```

### Resources deleted in a specific resource group
```kusto
resourcechanges
| where resourceGroup == "myResourceGroup"
| extend changeTime = todatetime(properties.changeAttributes.timestamp), targetResourceId = tostring(properties.targetResourceId),
changeType = tostring(properties.changeType), correlationId = properties.changeAttributes.correlationId
| where changeType == "Delete"
| order by changeTime desc
| project changeTime, resourceGroup, targetResourceId, changeType, correlationId
```

### Changes to a specific property value
```kusto
resourcechanges
| extend provisioningStateChange = properties.changes["properties.provisioningState"], changeTime = todatetime(properties.changeAttributes.timestamp), targetResourceId = tostring(properties.targetResourceId), changeType = tostring(properties.changeType)
| where isnotempty(provisioningStateChange)and provisioningStateChange.newValue == "Succeeded"
| order by changeTime desc
| project changeTime, targetResourceId, changeType, provisioningStateChange.previousValue, provisioningStateChange.newValue
```

### Query the latest resource configuration for resources created in the last seven days
```kusto
resourcechanges
| extend targetResourceId = tostring(properties.targetResourceId), changeType = tostring(properties.changeType), changeTime = todatetime(properties.changeAttributes.timestamp)
| where changeTime > ago(7d) and changeType == "Create"
| project  targetResourceId, changeType, changeTime
| join ( Resources | extend targetResourceId=id) on targetResourceId
| order by changeTime desc
| project changeTime, changeType, id, resourceGroup, type, properties
```

### Changes in virtual machine size 
```kusto
resourcechanges
|extend vmSize = properties.changes["properties.hardwareProfile.vmSize"], changeTime = todatetime(properties.changeAttributes.timestamp), targetResourceId = tostring(properties.targetResourceId), changeType = tostring(properties.changeType) 
| where isnotempty(vmSize) 
| order by changeTime desc 
| project changeTime, targetResourceId, changeType, properties.changes, previousSize = vmSize.previousValue, newSize = vmSize.newValue
```

### Count of changes by change type and subscription name
```kusto
resourcechanges  
|extend changeType = tostring(properties.changeType), changeTime = todatetime(properties.changeAttributes.timestamp), targetResourceType=tostring(properties.targetResourceType)  
| summarize count() by changeType, subscriptionId 
| join (resourcecontainers | where type=='microsoft.resources/subscriptions' | project SubscriptionName=name, subscriptionId) on subscriptionId 
| project-away subscriptionId, subscriptionId1
| order by count_ desc  
```


### Query the latest resource configuration for resources created with a certain tag
```kusto
resourcechanges 
|extend targetResourceId = tostring(properties.targetResourceId), changeType = tostring(properties.changeType), createTime = todatetime(properties.changeAttributes.timestamp) 
| where createTime > ago(7d) and changeType == "Create" 
| project  targetResourceId, changeType, createTime 
| join ( resources | extend targetResourceId=id) on targetResourceId 
| where tags[“Environment”] =~ “prod” 
| order by createTime desc 
| project createTime, id, resourceGroup, type
```

## Next steps

- See the language in use in [Starter queries](../samples/starter.md).
- See advanced uses in [Advanced queries](../samples/advanced.md).
- Learn more about how to [explore resources](../concepts/explore-resources.md).
- For guidance on working with queries at a high frequency, see
  [Guidance for throttled requests](../concepts/guidance-for-throttled-requests.md).
