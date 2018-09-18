---
title: Monitor logic app runs with Log Analytics - Azure Logic Apps | Microsoft Docs
description: Get insights and debugging data about your logic app runs with Log Analytics for troubleshooting and diagnostics
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewer: jonfan, estfan, LADocs
ms.topic: article
ms.date: 06/19/2018
---

# Monitor and get insights about logic app runs with Log Analytics

For monitoring and richer debugging information, 
you can turn on Log Analytics at the same time 
when you create a logic app. Log Analytics provides 
diagnostics logging and monitoring for your 
logic app runs through the Azure portal. 
When you add the Logic Apps Management solution, 
you get aggregated status for your logic app runs and 
specific details like status, execution time, 
resubmission status, and correlation IDs.

This article shows how to turn on Log Analytics so you can 
view runtime events and data for your logic app run.

 > [!TIP]
 > To monitor your existing logic apps, follow these steps to 
 > [turn on diagnostic logging and send logic app runtime data to Log Analytics](../logic-apps/logic-apps-monitor-your-logic-apps.md#azure-diagnostics).

## Requirements

Before you start, you need to have a Log Analytics workspace. 
Learn [how to create a Log Analytics workspace](../log-analytics/log-analytics-quick-create-workspace.md). 

## Turn on diagnostics logging when creating logic apps

1. In [Azure portal](https://portal.azure.com), create a logic app. 
Choose **Create a resource** > **Enterprise Integration** > **Logic App**.

   ![Create a logic app](media/logic-apps-monitor-your-logic-apps-oms/find-logic-apps-azure.png)

2. In the **Create logic app** page, perform these tasks as shown:

   1. Provide a name for your logic app and select your Azure subscription. 
   2. Create or select an Azure resource group.
   3. Set **Log Analytics** to **On**. 
   Select the Log Analytics workspace where you want to 
   send data for your logic app runs. 
   4. When you're ready, choose **Pin to dashboard** > **Create**.

      ![Create logic app](./media/logic-apps-monitor-your-logic-apps-oms/create-logic-app.png)

      After you finish this step, Azure creates your logic app, 
      which is now associated with your Log Analytics workspace. 
      Also, this step also automatically installs the 
      Logic Apps Management solution in your workspace.

3. To view your logic app runs, 
[continue with these steps](#view-logic-app-runs-oms).

## Install the Logic Apps Management solution

If you already turned on Log Analytics when you created your logic app, 
skip this step. You already have the Logic Apps Management 
solution installed.

1. In the [Azure portal](https://portal.azure.com), choose **More Services**. 
Search for "log analytics" as your filter, 
and choose **Log Analytics** as shown:

   ![Choose "Log Analytics"](media/logic-apps-monitor-your-logic-apps-oms/find-log-analytics.png)

2. Under **Log Analytics**, find and select your Log Analytics workspace. 

   ![Select your Log Analytics workspace](media/logic-apps-monitor-your-logic-apps-oms/select-logic-app.png)

3. Under **Management**, choose **Overview**.

   ![Choose "OMS Portal"](media/logic-apps-monitor-your-logic-apps-oms/ibiza-portal-page.png)

4. On the Overview page, choose **Add** to open the Management Solutions tile. 

   ![Choose "Logic Apps Management"](media/logic-apps-monitor-your-logic-apps-oms/add-logic-apps-management-solution.png)

5. Scroll through the list of **Management Solutions**, choose **Logic Apps Management** solution, and choose **Create** to install it to the Overview page.

   ![Choose "Add" for "Logic Apps Management"](media/logic-apps-monitor-your-logic-apps-oms/create-logic-apps-management-solution.png)

<a name="view-logic-app-runs-oms"></a>

## View your logic app runs in your Log Analytics workspace

1. To view the count and status for your logic app runs, 
go to the overview page for your Log Analytics workspace. 
Review the details on the **Logic Apps Management** tile.

   ![Overview tile showing logic app run count and status](media/logic-apps-monitor-your-logic-apps-oms/overview.png)

2. To view a summary with more details about your logic app runs, 
choose the **Logic Apps Management** tile.

   Here, your logic app runs are grouped by name or by execution status. You can also see details about the failures in actions or triggers for the logic app runs.

   ![Status summary for your logic app runs](media/logic-apps-monitor-your-logic-apps-oms/logic-apps-runs-summary.png)
   
3. To view all the runs for a specific logic app or status, 
select the row for a logic app or a status.

   Here is an example that shows all the runs for a specific logic app:

   ![View runs for a logic app or a status](media/logic-apps-monitor-your-logic-apps-oms/logic-app-run-details.png)

   There are two advanced options on this page:
   * **Tracked properties:**
     This column shows tracked properties, which are grouped by actions, for the logic app. To view the tracked properties, choose **View**. You can search the tracked properties by using the column filter.
   
     ![View tracked properties for a logic app](media/logic-apps-monitor-your-logic-apps-oms/logic-app-tracked-properties.png)

     Any newly added tracked properties might take 10-15 minutes before they appear first time. Learn [how to add tracked properties to your logic app](logic-apps-monitor-your-logic-apps.md#azure-diagnostics-event-settings-and-details).

   * **Resubmit:** You can resubmit one or more logic app runs that failed, succeeded, or are still running. Select the checkboxes for the runs that you want to resubmit, and choose **Resubmit**. 

     ![Resubmit logic app runs](media/logic-apps-monitor-your-logic-apps-oms/logic-app-resubmit.png)

4. To filter these results, you can perform both client-side and server-side filtering.

   * Client-side filter: For each column, 
   choose the filters that you want. 
   Here are some examples:

     ![Example column filters](media/logic-apps-monitor-your-logic-apps-oms/filters.png)

   * Server-side filter: To choose a specific time window 
   or to limit the number of runs that appear, 
   use the scope control at the top of the page. 
   By default, only 1,000 records appear at a time. 
   
     ![Change the time window](media/logic-apps-monitor-your-logic-apps-oms/change-interval.png)
 
5. To view all the actions and their details for a specific run, 
select a row for a logic app run.

   Here is an example that shows all the actions for a specific logic app run:

   ![View actions for a logic app run](media/logic-apps-monitor-your-logic-apps-oms/logic-app-action-details.png)
   
6. On any results page, to view the query behind the results or to see all results, choose **See All**, which opens the Log Search page.
   
   ![See All on Results pages](media/logic-apps-monitor-your-logic-apps-oms/logic-app-seeall.png)
   
   On the Log Search page,
   * To view the query results in a table, choose **Table**.
   * To change the query, you can edit the query string in the search bar. 
   For a better experience, choose **Advanced Analytics**.

     ![View actions and details for a logic app run](media/logic-apps-monitor-your-logic-apps-oms/log-search-page.png)
     
     Here on the Azure Log Analytics page, 
     you can update queries and view the results from the table. 
     This query uses [Kusto query language](https://aka.ms/LogAnalyticsLanguageReference), 
     which you can edit if you want to view different results. 

     ![Azure Log Analytics - query view](media/logic-apps-monitor-your-logic-apps-oms/query.png)

## Next steps

* [Monitor B2B messages](../logic-apps/logic-apps-monitor-b2b-message.md)

