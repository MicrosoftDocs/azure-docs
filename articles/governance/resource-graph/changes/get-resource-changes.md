---
title: Get resource changes
description: Get resource changes at scale using Change Analysis and Azure Resource Graph queries.
author: iancarter-msft
ms.author: iancarter
ms.date: 06/14/2024
ms.topic: how-to
---

# Get resource changes

Resources change through the course of daily use, reconfiguration, and even redeployment. Most change is by design, but sometimes it isn't. You can:

- Find when changes were detected on an Azure Resource Manager property.
- View property change details.
- Query changes at scale across your subscriptions, management group, or tenant.

In this article, you learn:
- What the payload JSON looks like.
- How to query resource changes through Resource Graph using either the CLI, PowerShell, or the Azure portal.
- Query examples and best practices for querying resource changes.
- Change analysis uses _Change Actor_ functionality:
  - `changedBy`: Who initiated a change in your resource, like an app ID or authorized person's email address.
  - `clientType`: Which client made the change, like _Azure portal_.
  - `operation`: Which [operation](../../../role-based-access-control/resource-provider-operations.md) was called, like `Microsoft.Compute/virtualmachines/write`.

## Prerequisites

- To enable Azure PowerShell to query Azure Resource Graph, [add the module](../first-query-powershell.md#install-the-module).
- To enable Azure CLI to query Azure Resource Graph, [add the extension](../first-query-azurecli.md#install-the-extension).

## Understand change event properties

When a resource is created, updated, or deleted, a new change resource (`Microsoft.Resources/changes`) is created to extend the modified resource and represent the changed properties. Change records should be available in less than five minutes. The following example JSON payload demonstrates the change resource properties:

```json
{
  "targetResourceId": "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/myResourceGroup/providers/microsoft.compute/virtualmachines/myVM",
  "targetResourceType": "microsoft.compute/virtualmachines",
  "changeType": "Update",
  "changeAttributes": {
    "previousResourceSnapshotId": "11111111111111111111_22222222-3333-aaaa-bbbb-444444444444_5555555555_6666666666",
    "newResourceSnapshotId": "33333333333333333333_44444444-5555-ffff-gggg-666666666666_7777777777_8888888888",
    "correlationId": "11111111-1111-1111-1111-111111111111",
    "changedByType": "User",
    "changesCount": 2,
    "clientType": "Azure Portal",
    "changedBy": "john@contoso.com",
    "operation": "microsoft.compute/virtualmachines/write",
    "timestamp": "2024-06-12T13:26:17.347+00:00"
  },
  "changes": {
    "properties.provisioningState": {
      "newValue": "Succeeded",
      "previousValue": "Updating",
      "changeCategory": "System",
      "propertyChangeType": "Update",
      "isTruncated": "true"
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

[See the full reference guide for change resource properties.](/rest/api/resources/changes)

## Run a query

Try out a tenant-based Resource Graph query of the `resourcechanges` table. The query returns the first five most recent Azure resource changes with the change time, change type, target resource ID, target resource type, and change details of each change record.

# [Azure CLI](#tab/azure-cli)
  ```azurecli-interactive
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
  1. Open the [Azure portal](https://portal.azure.com).

  1. Select **All services** in the left pane. Search for and select **Resource Graph Explorer**.

     :::image type="content" source="./media/get-resource-changes/resource-graph-explorer.png" alt-text="Screenshot of the search for the Resource Graph Explorer in All Services.":::


  1. In the **Query 1** portion of the window, enter the following query.
     ```kusto
     resourcechanges
     | project properties.changeAttributes.timestamp, properties.changeType, properties.targetResourceId, properties.targetResourceType, properties.changes
     | limit 5
     ```

  1. Select **Run query**.

     :::image type="content" source="./media/get-resource-changes/change-query-resource-explorer.png" alt-text="Screenshot of how to run the query in Resource Graph Explorer and then view results.":::

  1. Review the query response in the **Results** tab.

  1. Select the **Messages** tab to see details about the query, including the count of results and duration of the query. Any errors are displayed under this tab.

     :::image type="content" source="./media/get-resource-changes/messages-tab-query.png" alt-text="Screenshot of the search results for Change Analysis in the Azure portal.":::

---

You can update this query to specify a more user-friendly column name for the **timestamp** property.

# [Azure CLI](#tab/azure-cli)
   ```azurecli-interactive
   # Run Azure Resource Graph query with 'extend'
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

   Then select **Run query**.

---

To limit query results to the most recent changes, update the query to `order by` the user-defined `changeTime` property.

# [Azure CLI](#tab/azure-cli)
   ```azurecli-interactive
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

   Then select **Run query**.

---

You can also query by [management group](../../management-groups/overview.md) or subscription with the `-ManagementGroup` or `-Subscription` parameters, respectively.

> [!NOTE]
> If the query does not return results from a subscription you already have access to, then the `Search-AzGraph` PowerShell cmdlet defaults to subscriptions in the default context.

Resource Graph Explorer also provides a clean interface for converting the results of some queries into a chart that can be pinned to an Azure dashboard.

## Query resource changes

With Resource Graph, you can query either the `resourcechanges`, `resourcecontainerchanges`, or `healthresourcechanges` tables to filter or sort by any of the change resource properties. The following examples query the `resourcechanges` table, but can also be applied to the `resourcecontainerchanges` or `healthresourcechanges` table.

> [!NOTE]
> Learn more about the `healthresourcechanges` data in [the Project Flash documentation.](/azure/virtual-machines/flash-azure-resource-graph#azure-resource-graph---healthresources)

### Examples

Before querying and analyzing changes in your resources, review the following best practices.

- Query for change events during a specific window of time and evaluate the change details.
   - This query works best during incident management to understand _potentially_ related changes.
- Keep an up-to-date Configuration Management Database (CMDB).
   - Instead of refreshing all resources and their full property sets on a scheduled frequency, you only receive their changes.
- Understand which other properties were changed when a resource changes _compliance state_.
   - Evaluation of these extra properties can provide insights into other properties that might need to be managed via an Azure Policy definition.
- The order of query commands is important. In the following examples, the `order by` must come before the `limit` command.
   - The `order by` command orders the query results by the change time.
   - The `limit` command then limits the ordered results to ensure that you get the five most recent results.
- What does **Unknown** mean? 
   -  Unknown is displayed when the change happened on a client that's unrecognized. Clients are recognized based on the user agent and client application ID associated with the original change request.
- What does **System** mean?
  - System is displayed as a `changedBy` value when a background change occurred that wasn't correlated with any direct user action.

#### All changes in the past 24-hour period

```kusto
resourcechanges
| extend changeTime = todatetime(properties.changeAttributes.timestamp), targetResourceId = tostring(properties.targetResourceId),
changeType = tostring(properties.changeType), correlationId = properties.changeAttributes.correlationId, 
changedProperties = properties.changes, changeCount = properties.changeAttributes.changesCount
| where changeTime > ago(1d)
| order by changeTime desc
| project changeTime, targetResourceId, changeType, correlationId, changeCount, changedProperties
```

#### Resources deleted in a specific resource group

```kusto
resourcechanges
| where resourceGroup == "myResourceGroup"
| extend changeTime = todatetime(properties.changeAttributes.timestamp), targetResourceId = tostring(properties.targetResourceId),
  changeType = tostring(properties.changeType), correlationId = properties.changeAttributes.correlationId
| where changeType == "Delete"
| order by changeTime desc
| project changeTime, resourceGroup, targetResourceId, changeType, correlationId
```

#### Changes to a specific property value

```kusto
resourcechanges
| extend provisioningStateChange = properties.changes["properties.provisioningState"], changeTime = todatetime(properties.changeAttributes.timestamp), targetResourceId = tostring(properties.targetResourceId), changeType = tostring(properties.changeType)
| where isnotempty(provisioningStateChange)and provisioningStateChange.newValue == "Succeeded"
| order by changeTime desc
| project changeTime, targetResourceId, changeType, provisioningStateChange.previousValue, provisioningStateChange.newValue
```

#### Changes in past seven days by who and which client and ordered by count

```kusto
resourcechanges 
| extend changeTime = todatetime(properties.changeAttributes.timestamp), 
  targetResourceId = tostring(properties.targetResourceId), 
  changeType = tostring(properties.changeType), changedBy = tostring(properties.changeAttributes.changedBy), 
  changedByType = properties.changeAttributes.changedByType, 
  clientType = tostring(properties.changeAttributes.clientType) 
| where changeTime > ago(7d) 
| project changeType, changedBy, changedByType, clientType 
| summarize count() by changedBy, changeType, clientType 
| order by count_ desc 
```

#### Changes in virtual machine size 

```kusto
resourcechanges
| extend vmSize = properties.changes["properties.hardwareProfile.vmSize"], changeTime = todatetime(properties.changeAttributes.timestamp), targetResourceId = tostring(properties.targetResourceId), changeType = tostring(properties.changeType) 
| where isnotempty(vmSize) 
| order by changeTime desc 
| project changeTime, targetResourceId, changeType, properties.changes, previousSize = vmSize.previousValue, newSize = vmSize.newValue
```

#### Count of changes by change type and subscription name

```kusto
resourcechanges  
| extend changeType = tostring(properties.changeType), changeTime = todatetime(properties.changeAttributes.timestamp), targetResourceType=tostring(properties.targetResourceType)  
| summarize count() by changeType, subscriptionId 
| join (resourcecontainers | where type=='microsoft.resources/subscriptions' | project SubscriptionName=name, subscriptionId) on subscriptionId 
| project-away subscriptionId, subscriptionId1
| order by count_ desc  
```

#### Latest resource changes for resources created with a certain tag

```kusto
resourcechanges 
|extend targetResourceId = tostring(properties.targetResourceId), changeType = tostring(properties.changeType), createTime = todatetime(properties.changeAttributes.timestamp) 
| where createTime > ago(7d) and changeType == "Create" or changeType == "Update" or changeType == "Delete"
| project  targetResourceId, changeType, createTime 
| join ( resources | extend targetResourceId=id) on targetResourceId
| where tags ['Environment'] =~ 'prod' 
| order by createTime desc 
| project createTime, id, resourceGroup, type
```

## Next steps

> [!div class="nextstepaction"]
> [View resource changes in the portal](../changes/view-resource-changes.md)

## Related links

- [Starter Resource Graph query samples](../samples/starter.md)
- [Guidance for throttled requests](../concepts/guidance-for-throttled-requests.md)
- [Azure Automation's change tracking](../../../automation/change-tracking/overview.md)
- [Azure Policy's machine configuration for VMs](../../machine-configuration/overview.md)
- [Azure Resource Graph queries by category](../samples/samples-by-category.md)
