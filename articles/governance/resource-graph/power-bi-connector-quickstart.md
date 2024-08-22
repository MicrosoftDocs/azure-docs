---
title: Run queries with Azure Resource Graph Power BI connector
description: In this quickstart, you learn how to run queries with the Azure Resource Graph Power BI connector.
ms.date: 05/08/2024
ms.topic: quickstart
---

# Quickstart: Run queries with the Azure Resource Graph Power BI connector

In this quickstart, you learn how to run queries with the Azure Resource Graph Power BI connector. By default the Power BI connector runs queries at the tenant level but you can change the scope to subscription or management group. Azure Resource Graph by default returns a maximum of 1,000 records but the Power BI connector has an optional setting to return all records if your query results have more than 1,000 records.

> [!TIP]
> If you participated in the private preview, delete your _AzureResourceGraph.mez_ preview file. If the file isn't deleted, your custom connector might be used by Power Query instead of the certified connector.

## Prerequisites

- If you don't have an Azure account with an active subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- [Power BI Desktop](https://powerbi.microsoft.com/desktop/) or a [Power BI service](https://app.powerbi.com/) workspace in your organization's tenant.
- Azure role-based access control rights with at least _Reader_ role assignment to resources. To learn more about role assignments, go to [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.yml).

## Connect Azure Resource Graph with Power BI connector

You can run queries with Power BI Desktop or Power BI service. Don't use comments when you enter a query.

If you don't have a query, you can use the following sample that queries for storage accounts:

```kusto
resources
| where type == 'microsoft.storage/storageaccounts'
```

# [Power BI Desktop](#tab/power-bi-desktop)

After Power BI Desktop is installed, you can connect Azure Resource Graph with Power BI connector so that you can run a query.

The following example runs a query with the default settings.

1. Open the Power BI Desktop app on your computer and close any dialog boxes that are displayed.
1. Select **Home** > **Options and settings** > **Data source settings**.
1. Go to **Home** > **Get data** > **More** > **Azure** > **Azure Resource Graph** and select **Connect**.

   :::image type="content" source="./media/power-bi-connector-quickstart/power-bi-get-data.png" alt-text="Screenshot of the get data dialog box in Power BI Desktop to select the Azure Resource Graph connector.":::

1. On the **Azure Resource Graph** dialog box, enter your query into the **Query** box.

   :::image type="content" source="./media/power-bi-connector-quickstart/query-dialog-box.png" alt-text="Screenshot of the Azure Resource Graph dialog box to enter a query and use the default settings.":::

1. Select **OK**. If prompted, enter your credentials and select **Connect** to run the query.
1. Select **Load** or **Transform Data**.

   - **Load** imports the query results into Power BI Desktop.
   - **Transform Data** opens the Power Query Editor with your query results.

# [Power BI service](#tab/power-bi-service)

You need a workspace with _Dataflow_ so you can connect Azure Resource Graph with Power BI connector and run a query.

1. Go to your organization's [Power BI service](https://app.powerbi.com/).
1. Open a workspace and select **New** > **Dataflow**.
1. Select **Add new tables** from **Define new tables**.
1. In **Choose data source** type _azure resource graph_ to search for the connector.

   :::image type="content" source="./media/power-bi-connector-quickstart/power-bi-service-get-data.png" alt-text="Screenshot of the get data dialog box in Power BI service to select the Azure Resource Graph connector.":::

1. Select **Azure Resource Graph**.
1. Enter a query into the **Query** box. You can copy and paste the query.

   :::image type="content" source="./media/power-bi-connector-quickstart/power-bi-service-query-dialog-box.png" alt-text="Screenshot of the Power BI service Azure Resource Graph dialog box to enter a query and use the default settings.":::

1. Select **Sign in** to authenticate with your Organizational account.
1. Select **Next** to run the query.

The results are displayed in Power Query. You can select to save or cancel.

---

## Use optional settings

You can select optional values to change the Azure subscription or management group that the query runs against or to get query results of more than 1,000 records.

| Option | Description |
| ---- | ---- |
| Scope | You can select subscription or management group. Tenant is the default scope when no selection is made. |
| Subscription ID | Required if you select subscription scope. Specify the Azure subscription ID. Use a comma-separated list to query multiple subscriptions. |
| Management group ID | Required if you select management group scope. Specify the Azure management group ID. Use a comma-separated list to query multiple management groups. |
| Advanced options | To get more than 1,000 records change `$resultTruncated` to `FALSE`. By default Azure Resource Graph returns a maximum of 1,000 records. |

For example, to run a query for a subscription that returns more than 1,000 records:

- Set the scope to subscription.
- Enter a subscription ID.
- Set `$resultTruncated` to `FALSE`.

# [Power BI Desktop](#tab/power-bi-desktop)

:::image type="content" source="./media/power-bi-connector-quickstart/query-dialog-box-options.png" alt-text="Screenshot of the Power BI Desktop Azure Resource Graph dialog box for a query using optional settings for scope, subscription ID, and $resultTruncated.":::

# [Power BI service](#tab/power-bi-service)

:::image type="content" source="./media/power-bi-connector-quickstart/power-bi-service-dialog-box-options.png" alt-text="Screenshot of the Power BI service Azure Resource Graph dialog box for a query using optional settings for scope, subscription ID, and $resultTruncated.":::

---

## Clean up resources

When you're finished, close any Power BI Desktop or Power Query windows and save or discard your queries.

## Next steps

For more information about the query language or how to explore resources, go to the following articles.

- [Power BI connector troubleshooting guide](./troubleshoot/power-bi-connector.md).
- [Understanding the Azure Resource Graph query language](./concepts/query-language.md).
- [Explore your Azure resources with Resource Graph](./concepts/explore-resources.md).
- Sample queries listed by [table](./samples/samples-by-table.md) or [category](./samples/samples-by-category.md).
