---
title: Select a table plan based on data usage in a Log Analytics workspace
description: Use the Auxiliary, Basic, and Analytics Logs plans to reduce costs and take advantage of advanced analytics capabilities in Azure Monitor Logs.
author: guywi-ms
ms.author: guywild
ms.reviewer: adi.biran
ms.topic: how-to
ms.date: 07/04/2024

# Customer intent: As a Log Analytics workspace administrator, I want to manage configure the plans of tables in my Log Analytics workspace so that I pay less for data I use less frequently.
---

# Select a table plan based on data usage in a Log Analytics workspace

You can use one Log Analytics workspace to store any type of log required for any purpose. For example:

- High-volume, verbose data that requires **cheap long-term storage for audit and compliance**
- App and resource data for **troubleshooting** by developers
- Key event and performance data for scaling and alerting to ensure ongoing **operational excellence and security**
- Aggregated long-term data trends for **advanced analytics and machine learning** 

Table plans let you manage data costs based on how often you use the data in a table and the type of analysis you need the data for. This article explains and how to set a table's plan.

For information about what each table plan offers and which use cases it's optimal for, see [Table plans](data-platform-logs.md#table-plans).

## Permissions required

| Action | Permissions required |
|:-------|:---------------------|
| View table plan | `Microsoft.OperationalInsights/workspaces/tables/read` permissions to the Log Analytics workspace, as provided by the [Log Analytics Reader built-in role](./manage-access.md#log-analytics-reader), for example |
| Set table plan | `Microsoft.OperationalInsights/workspaces/write` and `microsoft.operationalinsights/workspaces/tables/write` permissions to the Log Analytics workspace, as provided by the [Log Analytics Contributor built-in role](./manage-access.md#log-analytics-contributor), for example |
  
## Set the table plan

You can set the table plan to Auxiliary only when you [create a custom table](../logs/create-custom-table.md#create-a-custom-table) by using the API. Built-in Azure tables don't currently support the Auxiliary plan. After you create a table with an Auxiliary plan, you can't switch the table's plan. 

All tables support the Analytics plan and all DCR-based custom tables and [some Azure tables support the Basic log plan](basic-logs-azure-tables.md). You can switch between the Analytics and Basic plans, the change takes effect on existing data in the table immediately. 

When you change a table's plan from Analytics to Basic, Azure monitor treats any data that's older than 30 days as long-term retention data based on the total retention period set for the table. In other words, the total retention period of the table remains unchanged, unless you explicitly [modify the long-term retention period](../logs/data-retention-configure.md). 

> [!NOTE]
> You can switch a table's plan once a week. 
# [Portal](#tab/portal-1)

Analytics is the default table plan of all tables you create in the portal. You can switch between the Analytics and Basic plans, as described in this section. 

To switch a table's plan in the Azure portal:

1. From the **Log Analytics workspaces** menu, select **Tables**.

    The **Tables** screen lists all the tables in the workspace.

1. Select the context menu for the table you want to configure and select **Manage table**.

    :::image type="content" source="media/basic-logs-configure/log-analytics-table-configuration.png" lightbox="media/basic-logs-configure/log-analytics-table-configuration.png" alt-text="Screenshot that shows the Manage table button for one of the tables in a workspace.":::

1. From the **Table plan** dropdown on the table configuration screen, select **Basic** or **Analytics**.

    The **Table plan** dropdown is enabled only for [tables that support Basic logs](basic-logs-azure-tables.md).

    :::image type="content" source="media/data-retention-configure/log-analytics-configure-table-retention-auxiliary.png" lightbox="media/data-retention-configure/log-analytics-configure-table-retention-auxiliary.png" alt-text="Screenshot that shows the data retention settings on the table configuration screen.":::

1. Select **Save**.

# [API](#tab/api-1)

To configure a table for Basic logs or Analytics logs, call the [Tables - Update API](/rest/api/loganalytics/tables/create-or-update):

```http
PATCH https://management.azure.com/subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/Microsoft.OperationalInsights/workspaces/<workspaceName>/tables/<tableName>?api-version=2021-12-01-preview
```

> [!IMPORTANT]
> Use the bearer token for authentication. Learn more about [using bearer tokens](https://social.technet.microsoft.com/wiki/contents/articles/51140.azure-rest-management-api-the-quickest-way-to-get-your-bearer-token.aspx).

**Request body**

|Name | Type | Description |
| --- | --- | --- |
|properties.plan | string  | The table plan. Possible values are `Analytics` and `Basic`.|

**Example**

This example configures the `ContainerLogV2` table for Basic logs.

Container Insights uses `ContainerLog` by default. To switch to using `ContainerLogV2` for Container insights, [enable the ContainerLogV2 schema](../containers/container-insights-logging-v2.md) before you convert the table to Basic logs.

**Sample request**

```http
PATCH https://management.azure.com/subscriptions/ContosoSID/resourcegroups/ContosoRG/providers/Microsoft.OperationalInsights/workspaces/ContosoWorkspace/tables/ContainerLogV2?api-version=2021-12-01-preview
```

Use this request body to change to Basic logs:

```http
{
    "properties": {
        "plan": "Basic"
    }
}
```

Use this request body to change to Analytics Logs:

```http
{
    "properties": {
        "plan": "Analytics"
    }
}
```

**Sample response**

This sample is the response for a table changed to Basic logs:

Status code: 200

```http
{
    "properties": {
        "retentionInDays": 30,
        "totalRetentionInDays": 30,
        "archiveRetentionInDays": 22,
        "plan": "Basic",
        "lastPlanModifiedDate": "2022-01-01T14:34:04.37",
        "schema": {...}        
    },
    "id": "subscriptions/ContosoSID/resourcegroups/ContosoRG/providers/Microsoft.OperationalInsights/workspaces/ContosoWorkspace",
    "name": "ContainerLogV2"
}
```

# [CLI](#tab/cli-1)

To configure a table for Basic logs or Analytics logs, run the [az monitor log-analytics workspace table update](/cli/azure/monitor/log-analytics/workspace/table#az-monitor-log-analytics-workspace-table-update) command and set the `--plan` parameter to `Basic` or `Analytics`.

For example:

- To set Basic logs:

    ```azurecli
    az monitor log-analytics workspace table update --subscription ContosoSID --resource-group ContosoRG  --workspace-name ContosoWorkspace --name ContainerLogV2  --plan Basic
    ```

- To set Analytics Logs:

    ```azurecli
    az monitor log-analytics workspace table update --subscription ContosoSID --resource-group ContosoRG  --workspace-name ContosoWorkspace --name ContainerLogV2  --plan Analytics
    ```

# [PowerShell](#tab/azure-powershell)

To configure a table's plan, use the [Update-AzOperationalInsightsTable](/powershell/module/az.operationalinsights/Update-AzOperationalInsightsTable) cmdlet:

```powershell
Update-AzOperationalInsightsTable  -ResourceGroupName RG-NAME -WorkspaceName WORKSPACE-NAME -Plan Basic|Analytics
```

---

## Related content

- [Manage data retention](../logs/data-retention-configure.md).
- [Tables that support the Basic table plan in Azure Monitor Logs](basic-logs-azure-tables.md).

