---
title: Create alerts with SQL insights (preview)
description: Create alerts with SQL insights in Azure Monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 03/12/2021
---

# Create alerts with SQL insights (preview)
SQL insights includes a set of alert rule templates you can use to create [alert rules in Azure Monitor](../alert/../alerts/alerts-overview.md) for common SQL issues. The alert rules in SQL insights are log alert rules based on performance data stored in the *InsightsMetrics* table in Azure Monitor Logs.  

> [!NOTE]
> To create an alert for SQL insights using a resource manager template, see [Resource Manager template samples for SQL insights](resource-manager-sql-insights.md#create-an-alert-rule-for-sql-insights).


> [!NOTE]
> If you have requests for more SQL insights alert rule templates, please send feedback using the link at the bottom of this page or using the SQL insights feedback link in the Azure portal.

## Enable alert rules 
Use the following steps to enable the alerts in Azure Monitor from the Azure portal. The alert rules that are created will be scoped to all of the SQL resources monitored under the selected monitoring profile.  When an alert rule is triggered, it will trigger on the specific SQL instance or database.

> [!NOTE]
> You can also create custom [log alert rules](../alerts/alerts-log.md) by running queries on the data sets in the *InsightsMetrics* table and then saving those queries as an alert rule. 

Select **SQL (preview)** from the **Insights** section of the Azure Monitor menu in the Azure portal. Click **Alerts**

:::image type="content" source="media/sql-insights-alerts/alerts-button.png" alt-text="Alerts button":::

The **Alerts** pane opens on the right side of the page. By default, it will display fired alerts for SQL resources in the selected monitoring profile based on the alert rules you've already created. Select **Alert templates**, which will display the list of available templates you can use to create an alert rule.

:::image type="content" source="media/sql-insights-alerts/alert-templates.png" alt-text="Alert templates":::

On the **Create Alert rule** page, review the default settings for the rule and edit them as needed. You can also select an [action group](../alerts/action-groups.md) to create notifications and actions when the alert rule is triggered. Click **Enable alert rule** to create the alert rule once you've verified all of its properties.


:::image type="content" source="media/sql-insights-alerts/alert-rule.png" alt-text="Alert rules page":::

To deploy the alert rule immediately, click **Deploy alert rule**. Click **View Template** if you want to view the rule template before actually deploying it.

:::image type="content" source="media/sql-insights-alerts/alert-rule-deploy.png" alt-text="Deploy alert rule":::

If you choose to view the templates, select **Deploy** from the template page to create the alert rule.

:::image type="content" source="media/sql-insights-alerts/view-template-deploy.png" alt-text="Deploy from view template":::


## Next steps

Learn more about [alerts in Azure Monitor](../alerts/alerts-overview.md).

