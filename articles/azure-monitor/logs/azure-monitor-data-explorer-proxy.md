---
title: Query data in Azure Data Explorer and Azure Resource Graph from Azure Monitor
description: Query data in Azure Data Explorer and Azure Resource Graph from Azure Monitor.
author: guywi-ms
ms.author: guywild
ms.topic: conceptual
ms.date: 08/22/2023
ms.reviewer: osalzberg
---

# Query data in Azure Data Explorer and Azure Resource Graph from Azure Monitor
Azure Monitor lets you query data in [Azure Data Explorer](/azure/data-explorer/data-explorer-overview) and [Azure Resource Graph](../../governance/resource-graph/overview.md) from your Log Analytics workspace and Application Insights resources. This article explains how to query data in Azure Resource Graph and Azure Data Explorer from Azure Monitor.

You can run cross-service queries by using any client tools that support Kusto Query Language (KQL) queries, including the Log Analytics web UI, workbooks, PowerShell, and the REST API.

## Permissions required

To run a cross-service query, you need:

- `Microsoft.OperationalInsights/workspaces/query/*/read` permissions to the Log Analytics workspaces you query, as provided by the [Log Analytics Reader built-in role](../logs/manage-access.md#log-analytics-reader), for example.
- Reader permissions to the resources you query in Azure Resource Graph.
- Viewer permissions to the tables you query in Azure Data Explorer.

## Function supportability

Azure Monitor cross-service queries support **only ".show"** functions for Application Insights, Log Analytics, Azure Data Explorer, and Azure Resource Graph.
This capability enables cross-cluster queries to reference an Azure Monitor, Azure Data Explorer, or Azure Resource Graph tabular function directly.
The following commands are supported with the cross-service query:

* `.show functions`
* `.show function {FunctionName}`
* `.show database {DatabaseName} schema as json`

## Query data in Azure Data Explorer

Enter the identifier for an Azure Data Explorer cluster in a query within the `adx` pattern, followed by the database name and table.

```kusto
adx('https://help.kusto.windows.net/Samples').StormEvents
```
### Combine Azure Data Explorer cluster tables with a Log Analytics workspace

Use the `union` command to combine cluster tables with a Log Analytics workspace.

For example:

```kusto
union customEvents, adx('https://help.kusto.windows.net/Samples').StormEvents
| take 10
```

```kusto
let CL1 = adx('https://help.kusto.windows.net/Samples').StormEvents;
union customEvents, CL1 | take 10
```

> [!TIP]
> Shorthand format is allowed: *ClusterName*/*InitialCatalog*. For example, `adx('help/Samples')` is translated to `adx('help.kusto.windows.net/Samples')`.

When you use the [`join` operator](/azure/data-explorer/kusto/query/joinoperator) instead of union, you're required to use a [`hint`](/azure/data-explorer/kusto/query/joinoperator#join-hints) to combine the data in the Azure Data Explorer cluster with the Log Analytics workspace. Use `Hint.remote={Direction of the Log Analytics Workspace}`. 

For example:

```kusto
AzureDiagnostics
| join hint.remote=left adx("cluster=ClusterURI").AzureDiagnostics on (ColumnName)
```

### Join data from an Azure Data Explorer cluster in one tenant with an Azure Monitor resource in another

Cross-tenant queries between the services aren't supported. You're signed in to a single tenant for running the query that spans both resources.

If the Azure Data Explorer resource is in Tenant A and the Log Analytics workspace is in Tenant B, use one of the following methods:

* Use Azure Data Explorer to add roles for principals in different tenants. Add your user ID in Tenant B as an authorized user on the Azure Data Explorer cluster. Validate that the [TrustedExternalTenant](/powershell/module/az.kusto/update-azkustocluster) property on the Azure Data Explorer cluster contains Tenant B. Run the cross query fully in Tenant B.
* Use [Lighthouse](../../lighthouse/index.yml) to project the Azure Monitor resource into Tenant A.

### Connect to Azure Data Explorer clusters from different tenants

Kusto Explorer automatically signs you in to the tenant to which the user account originally belongs. To access resources in other tenants with the same user account, you must explicitly specify `TenantId` in the connection string:

`Data Source=https://ade.applicationinsights.io/subscriptions/SubscriptionId/resourcegroups/ResourceGroupName;Initial Catalog=NetDefaultDB;AAD Federated Security=True;Authority ID=TenantId`

## Query data in Azure Resource Graph (Preview)

Enter the `arg("")` pattern, followed by the Azure Resource Graph table name.

For example:

```kusto
arg("").<Azure-Resource-Graph-table-name>
```

Here are some sample Azure Log Analytics queries that use the new Azure Resource Graph cross-service query capabilities:

- Filter a Log Analytics query based on the results of an Azure Resource Graph query:

    ```kusto
    arg("").Resources 
    | where type == "microsoft.compute/virtualmachines" and properties.hardwareProfile.vmSize startswith "Standard_D"
    | join (
        Heartbeat
        | where TimeGenerated > ago(1d)
        | distinct Computer
        )
        on $left.name == $right.Computer
    ```

- Create an alert rule that applies only to certain resources taken from an ARG query:
   - Exclude resources based on tags – for example, not to trigger alerts for VMs with a “Test” tag.

       ```kusto
       arg("").Resources
       | where tags.environment=~'Test'
       | project name 
       ```

   - Retrieve performance data related to CPU utilization and filter to resources with the “prod” tag.
    
       ```kusto
       InsightsMetrics
       | where Name == "UtilizationPercentage"
       | lookup (
           arg("").Resources 
           | where type == 'microsoft.compute/virtualmachines' 
           | project _ResourceId=tolower(id), tags
           )
           on _ResourceId
       | where tostring(tags.Env) == "Prod"
       ```

More use cases:
-	Use a tag to determine whether VMs should be running 24x7 or should be shut down at night.
-	Show alerts on any server that contains a certain number of cores.

### Combine Azure Resource Graph tables with a Log Analytics workspace

Use the `union` command to combine cluster tables with a Log Analytics workspace.

For example:

```kusto
union AzureActivity, arg("").Resources
| take 10
```
```kusto
let CL1 = arg("").Resources ;
union AzureActivity, CL1 | take 10
```

When you use the [`join` operator](/azure/data-explorer/kusto/query/joinoperator) instead of union, you need to use a [`hint`](/azure/data-explorer/kusto/query/joinoperator#join-hints) to combine the data in Azure Resource Graph with data in the Log Analytics workspace. Use `Hint.remote={Direction of the Log Analytics Workspace}`. For example:

```kusto
Perf | where ObjectName == "Memory" and (CounterName == "Available MBytes Memory")
| extend _ResourceId = replace_string(replace_string(replace_string(_ResourceId, 'microsoft.compute', 'Microsoft.Compute'), 'virtualmachines','virtualMachines'),"resourcegroups","resourceGroups")
| join hint.remote=left (arg("").Resources | where type =~ 'Microsoft.Compute/virtualMachines' | project _ResourceId=id, tags) on _ResourceId | project-away _ResourceId1 | where tostring(tags.env) == "prod"
```

## Create an alert based on a cross-service query

To create a new alert rule based on a cross-service query, follow the steps in [Create a new alert rule](../alerts/alerts-create-new-alert-rule.md), selecting your Log Analytics workspace on the Scope tab.

## Limitations

* Database names are case sensitive.
* Identifying the Timestamp column in the cluster isn't supported. The Log Analytics Query API won't pass the time filter.
* Cross-service queries support data retrieval only. 
* [Private Link](../logs/private-link-security.md) (private endpoints) and [IP restrictions](/azure/data-explorer/security-network-restrict-public-access) do not support cross-service queries.
* `mv-expand` is limited to 2000 records.
* Azure Resource Graph cross-queries do not support these operators: `smv-apply()`, `rand()`, `arg_max()`, `arg_min()`, `avg()`, `avg_if()`, `countif()`, `sumif()`, `percentile()`, `percentiles()`, `percentilew()`, `percentilesw()`, `stdev()`, `stdevif()`, `stdevp()`, `variance()`, `variancep()`, `varianceif()`.

## Next steps
* [Write queries](/azure/data-explorer/write-queries)
* [Perform cross-resource log queries in Azure Monitor](../logs/cross-workspace-query.md)


