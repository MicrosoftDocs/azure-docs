---
title: Query for B2B messages in Operations Management Suite - Azure Logic Apps  | Microsoft Docs
description: Create queries to track AS2, X12, and EDIFACT messages in the Operations Management Suite 
author: padmavc
manager: anneta
editor: ''
services: logic-apps
documentationcenter: ''

ms.assetid: bb7d9432-b697-44db-aa88-bd16ddfad23f
ms.service: logic-apps
ms.workload: integration
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/23/2017
ms.author: LADocs; padmavc
---

# Query for AS2, X12, and EDIFACT messages in the Operations Management Suite

To find the B2B messages that you're tracking with 
[Azure Log Analytics](../log-analytics/log-analytics-overview.md) 
in the [Operations Management Suite (OMS)](../operations-management-suite/operations-management-suite-overview.md), 
you can create queries that filter actions based on specific criteria, 
for example, the interchange control number for the messages that you want to find.

## Requirements

* A logic app that's set up with diagnostics logging. 
Learn [how to create a logic app](../logic-apps/logic-apps-create-a-logic-app.md) 
and [how to set up logging for that logic app](../logic-apps/logic-apps-monitor-your-logic-apps.md#azure-diagnostics).

* An integration account that's set up with monitoring and logging. 
Learn [how to create an integration account](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md) 
and [how to set up monitoring and logging for that account](../logic-apps/logic-apps-monitor-b2b-message.md).

* An OMS workspace for [Azure Log Analytics](../log-analytics/log-analytics-overview.md). 
After you've met the previous requirements, you should already have an OMS workspace. 
Otherwise, learn more about [how to create this workspace](../log-analytics/log-analytics-get-started.md).

* If you haven't already, [publish diagnostic data to Log Analytics](../logic-apps/logic-apps-track-b2b-messages-omsportal.md) 
and [set up message tracking in OMS](../logic-apps/logic-apps-track-b2b-messages-omsportal.md).

## Create message queries with filters in the Operations Management Suite portal

This example shows how you can find messages based on their interchange control number.

> [!TIP] 
> If you know your OMS workspace name, go to your workspace home page 
(`https://{your-workspace-name}.portal.mms.microsoft.com`), 
> and start at Step 4. Otherwise, start at Step 1.

1. In the [Azure portal](https://portal.azure.com), choose **More Services**. 
Search for "log analytics", and then choose **Log Analytics** as shown here:

   ![Find Log Analytics](media/logic-apps-track-b2b-messages-omsportal-query-filter-control-number/browseloganalytics.png)

2. Under **Log Analytics**, find and select your OMS workspace.

   ![Select your OMS workspace](media/logic-apps-track-b2b-messages-omsportal-query-filter-control-number/selectla.png)

3. Under **Management**, choose **OMS Portal**.

   ![Choose OMS portal](media/logic-apps-track-b2b-messages-omsportal-query-filter-control-number/omsportalpage.png)

4. On your OMS home page, choose **Log Search**.

   ![On your OMS home page, choose "Log Search"](media/logic-apps-track-b2b-messages-omsportal-query-filter-control-number/logsearch.png)

   -or-

   ![On the OMS menu, choose "Log Search"](media/logic-apps-track-b2b-messages-omsportal-query-filter-control-number/logsearch-2.png)

5. In the search box, enter a field that you want to find, and press **Enter**. 
When you start typing, OMS shows you possible matches and operations that you can use. 
Learn more about [how to find data in Log Analytics](../log-analytics/log-analytics-log-searches.md).

   This example searches for events with **Type=AzureDiagnostics**.

   ![Start typing query string](media/logic-apps-track-b2b-messages-omsportal-query-filter-control-number/oms-start-query.png)

6. In the left bar, choose the timeframe that you want to view. 
To add a filter to your query, choose **+Add**.

   ![Add filter to query](media/logic-apps-track-b2b-messages-omsportal-query-filter-control-number/query1.png)

7. Under **Add Filters**, enter the filter name so you can find the filter you want. 
Select the filter, and choose **+Add**.

   To find the interchange control number, this example searches for the word "interchange", 
   and selects **event_record_messageProperties_interchangeControlNumber_s** as the filter.

   ![Select filter](media/logic-apps-track-b2b-messages-omsportal-query-filter-control-number/oms-query-add-filter.png)

9. In the left bar, select the filter value that you want to use, and choose **Apply**.

   This example selects the interchange control number for the messages we want.

   ![Select filter value](media/logic-apps-track-b2b-messages-omsportal-query-filter-control-number/oms-query-select-filter-value.png)

10. Now return to the query that you're building. 
Your query has been updated with your selected filter event and value. 
Your previous results are now filtered too.

    ![Return to your query with filtered results](media/logic-apps-track-b2b-messages-omsportal-query-filter-control-number/oms-query-filtered-results.png)

<a name="save-oms-query"></a>

## Save your query for future use

1. From your query on the **Log Search** page, choose **Save**. 
Give your query a name, select a category, and choose **Save**.

   ![Give your query a name and category](media/logic-apps-track-b2b-messages-omsportal-query-filter-control-number/oms-query-save.png)

2. To view your query, choose **Favorites**.

   ![Choose "Favorites"](media/logic-apps-track-b2b-messages-omsportal-query-filter-control-number/oms-query-favorites.png)

3. Under **Saved Searches**, 
select your query so that you can view the results. 
To update the query so you can find different results, edit the query.

   ![Select your query](media/logic-apps-track-b2b-messages-omsportal-query-filter-control-number/oms-log-search-find-favorites.png)

## Find and run saved queries in the Operations Management Suite portal

1. Open your OMS workspace home page (`https://{your-workspace-name}.portal.mms.microsoft.com`), 
and choose **Log Search**.

   ![On your OMS home page, choose "Log Search"](media/logic-apps-track-b2b-messages-omsportal-query-filter-control-number/logsearch.png)

   -or-

   ![On the OMS menu, choose "Log Search"](media/logic-apps-track-b2b-messages-omsportal-query-filter-control-number/logsearch-2.png)

2. On the **Log Search** home page, choose **Favorites**.

   ![Choose "Favorites"](media/logic-apps-track-b2b-messages-omsportal-query-filter-control-number/oms-log-search-favorites.png)

3. Under **Saved Searches**, 
select your query so that you can view the results. 
To update the query so you can find different results, edit the query.

   ![Select your query](media/logic-apps-track-b2b-messages-omsportal-query-filter-control-number/oms-log-search-find-favorites.png)

## Next steps

* [AS2 tracking schemas](../logic-apps/logic-apps-track-integration-account-as2-tracking-schemas.md)
* [X12 tracking schemas](../logic-apps/logic-apps-track-integration-account-x12-tracking-schema.md)
* [Custom tracking schemas](../logic-apps/logic-apps-track-integration-account-custom-tracking-schema.md)