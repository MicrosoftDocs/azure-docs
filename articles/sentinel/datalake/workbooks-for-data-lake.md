---  
title: Workbooks for Microsoft Sentinel Data Lake
titleSuffix: Microsoft Security  
description: Learn how to create and use Microsoft Sentinel workbooks with data from the Microsoft Sentinel data lake to visualize and monitor security data.
author: EdB-MSFT  
ms.service: microsoft-sentinel  
ms.topic: how-to
ms.subservice: sentinel-platform
ms.date: 03/11/2026
ms.author: edbaynash  

ms.collection: ms-security  
---  

# Visualize data in Microsoft Sentinel data lake using workbooks
 
Running Microsoft Sentinel workbooks on top of Microsoft Sentinel data lake data allows SOC teams to visualize and monitor security data directly from the lake using KQL (Kusto Query Language), without duplicating or transforming data. By selecting Sentinel data lake as the data source in a workbook, analysts can run the same analytical queries used for investigations and hunting. They can render them as interactive charts and tables for operational monitoring and reporting. Using Sentinel data lake as a workbook data source enables consistent analytics across queries, supports longer data retention, and scales with high-volume historical data. This makes workbooks ideal for advanced threat hunting, trend analysis, and executive dashboards.
 
This article walks you through the process of creating workbooks for using Microsoft Sentinel data lake as the data source. For more information on using workbooks with Sentinel, see [Visualize and monitor your data by using workbooks in Microsoft Sentinel](/azure/sentinel/monitor-your-data?tabs=defender-portal).

When using Sentinel data lake as the data source for your workbooks, keep in mind the importance of query performance as workbook visualization can autorefresh and execute repeatedly. Queries should be scoped with appropriate time filters, summarization, and projections to avoid scanning excessive historical data in the lake. Appropriately scoped queries ensure dashboards remain responsive while still using long-term, high-volume data for analysis.

## Create a workbook with Microsoft Sentinel data lake as the data source

1. In the Defender portal, go to **Microsoft Sentinel** > **Threat management** > **Workbooks**.

1. Select the cube icon in the top right corner to select the workspaces you want to store your workbooks.

1. Select **Add workbook**.

    :::image type="content" source="./media/workbooks-for-data-lake/add-workbook.png" alt-text="Screenshot of a workbook in edit mode with the query editor open." lightbox="./media/workbooks-for-data-lake/add-workbook.png":::
   
    A new workbook opens with a basic query and a par chart visual.

1. Select the **Edit**.

    :::image type="content" source="./media/workbooks-for-data-lake/edit-new-workbook.png" alt-text="Screenshot of a new workbook with basic query and chart visual." lightbox="./media/workbooks-for-data-lake/edit-new-workbook.png":::

1. Under the chart, select **Add**, and then select **Add data source and visualization**.

    :::image type="content" source="./media/workbooks-for-data-lake/add-data-source-and-visualization.png" alt-text="Screenshot of the Add data source and visualization button in a Microsoft Sentinel workbook." lightbox="./media/workbooks-for-data-lake/add-data-source-and-visualization.png":::    

1. Select **Sentinel data lake** as the data source.

1. Select the workspace containing your SignInLogs table in the data lake.

1. Paste the following KQL into the query editor:
    ```kql
    AWSCloudTrail
    | where isnotempty(ErrorCode)
    | summarize FailedEvents = count()
        by bin(TimeGenerated, 1h), SourceIpAddress, UserIdentityPrincipalid
    | where FailedEvents > 3
    | summarize FailedEvents = sum(FailedEvents) by UserIdentityPrincipalid
    | top 10 by FailedEvents
    ```
1. Under **Visualization** select **Bar chart**.

1. Select **Run query** to visualize the results.

1. Select **Done editing** to exit edit mode and view your visual.

 
    :::image type="content" source="./media/workbooks-for-data-lake/edit-new-query.png" alt-text="Screenshot showing the editing of a new query and visualization." lightbox="./media/workbooks-for-data-lake/edit-new-query.png":::

    This visual shows the top 10 AWS principal identities generating the highest number of failed API calls in AWSCloudTrail logs. Failed events are aggregated and filtered to highlight identities with repeated errors. The chart helps analysts quickly identify potentially suspicious or misconfigured identities producing abnormal failure patterns.
    
    > [!NOTE]
    > The **Visualization** type **Set by query** isn't supported. 
    >
    > Relative time ranges such as `> ago(10d) ` are supported up to 90 days. Absolute time ranges are supported according to your data retention policy. 


1.  On the workbook page, select **Done editing**.

1. Select **Save** to save the workbook to your library, giving your workbook a name and location.

1. You can view your saved workbook in the list of workbooks, and select it to view the visualizations you created. You can also edit the workbook at any time to update the queries or visuals.

:::image type="content" source="./media/workbooks-for-data-lake/saved-workbooks.png" lightbox="./media/workbooks-for-data-lake/saved-workbooks.png" alt-text="Screenshot showing the list of saved workbooks in Microsoft Sentinel.":::

## Related content

- [KQL queries in the Microsoft Sentinel data lake](kql-queries.md)
- [Visualize and monitor your data by using workbooks in Microsoft Sentinel](/azure/sentinel/monitor-your-data?tabs=defender-portal)
