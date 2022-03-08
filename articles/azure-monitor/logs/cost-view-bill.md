---
title: Viewing Azure Monitor Logs usage on your Azure bill
description: Learn how to view and interpret your bill for Log Analytics workspace usage in Azure Monitor Logs
ms.topic: conceptual
ms.date: 02/18/2022
---
 
# Viewing Azure Monitor Logs usage on your Azure bill
The easiest way to view your billed usage for a particular Log Analytics workspace is to go to the **Overview** page of the workspace and click **View Cost** in the upper right corner of the **Essentials** section at the top of the page. This will launch the Cost Analysis from Azure Cost Management + Billing already scoped to this workspace.  You might need additional access to Cost Management data ([learn more](../../cost-management-billing/costs/assign-access-acm-data.md))

:::image type="content" source="media/view-bill/view-cost-option.png" lightbox="media/view-bill/view-cost-option.png" alt-text="Screenshot of option to view cost for Log ANalytics workspace.":::

Alternatively, you can start in the [Azure Cost Management + Billing](../../cost-management-billing/costs/quick-acm-cost-analysis.md?toc=%2fazure%2fbilling%2fTOC.json) hub. here you can use the **Cost analysis** functionality to view your Azure resource expenses. Add a filter by **Resource type** using *microsoft.operationalinsights/workspace* for a Log Analytics workspace or *microsoft.operationalinsights/cluster* for dedicated clusters. For **Group by**, select **Meter category** or **Meter**. Other services, like Microsoft Defender for Cloud and Microsoft Sentinel, also bill their usage against Log Analytics workspace resources. To see the mapping to the service name, you can select the Table view instead of a chart.

## Download usage
To gain more understanding of your usage, you can [download your usage from the Azure portal](../../cost-management-billing/understand/download-azure-daily-usage.md). For step-by-step instructions, review this [tutorial](../../cost-management-billing/costs/tutorial-export-acm-data.md). In the downloaded spreadsheet, you can see usage per Azure resource (for example, Log Analytics workspace) per day. In this Excel spreadsheet, usage from your Log Analytics workspaces can be found by first filtering on the **Meter Category** column to show **Log Analytics**, **Insight and Analytics** (used by some of the legacy pricing tiers), and **Azure Monitor** (used by commitment tier pricing tiers). Then add a filter on the **Instance ID** column of *contains workspace* or *contains cluster* (the latter to include Log Analytics Cluster usage). The usage is shown in the **Consumed Quantity** column and the unit for each entry in the *Unit of Measure* column. For more information, see [Review your individual Azure subscription bill](../../cost-management-billing/understand/review-individual-bill.md). 

## Understand your usage and optimizing your pricing tier
To learn about your usage trends and choose the most cost-effective log Analytics pricing tier, use **Log Analytics Usage and Estimated Costs**. This shows how much data is collected by each solution, how much data is being retained, and an estimate of your costs for each pricing tier based on recent data ingestion patterns. 

:::image type="content" source="media/manage-cost-storage/usage-estimated-cost-dashboard-01.png" alt-text="Usage and estimated costs":::

To explore your data in more detail, select on the icon in the upper-right corner of either chart on the **Usage and Estimated Costs** page. Now you can work with this query to explore more details of your usage.  

:::image type="content" source="media/manage-cost-storage/logs.png" alt-text="Logs view":::

From the **Usage and Estimated Costs** page, you can review your data volume for the month. This includes all the billable data received and retained in your Log Analytics workspace.  
 
Log Analytics charges are added to your Azure bill. You can see details of your Azure bill under the **Billing** section of the Azure portal or in the [Azure Billing Portal](https://account.windowsazure.com/Subscriptions).  





## Next steps

- See [Log searches in Azure Monitor Logs](../logs/log-query-overview.md) to learn how to use the search language. You can use search queries to perform additional analysis on the usage data.
- Use the steps described in [create a new log alert](../alerts/alerts-metric.md) to be notified when a search criteria is met.
- Use [solution targeting](../insights/solution-targeting.md) to collect data from only required groups of computers.
- To configure an effective event collection policy, review [Microsoft Defender for Cloud filtering policy](../../security-center/security-center-enable-data-collection.md).
- Change [performance counter configuration](../agents/data-sources-performance-counters.md).
- To modify your event collection settings, review [event log configuration](../agents/data-sources-windows-events.md).
- To modify your syslog collection settings, review [syslog configuration](../agents/data-sources-syslog.md).
- To modify your syslog collection settings, review [syslog configuration](../agents/data-sources-syslog.md).
