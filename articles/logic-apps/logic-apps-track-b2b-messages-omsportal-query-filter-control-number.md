---
title: Query for B2B messages in OMS - Azure Logic Apps  | Microsoft Docs
description: Create queries to track AS2, X12, EDIFACT messages in the Operations Management Suite 
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

* A logic app that's set up with monitoring and logging. 
Learn [how to create a logic app](../logic-apps/logic-apps-create-a-logic-app.md) 
and [how to set up monitoring and logging for that logic app](../logic-apps/logic-apps-monitor-your-logic-apps.md#azure-diagnostics-and-alerts).

* An integration account that's set up with monitoring and logging. 
Learn [how to create an integration account](logic-apps-enterprise-integration-create-integration-account.md) 
and [how to set up monitoring and logging for that account](logic-apps-monitor-b2b-message.md).

* If you haven't already, [publish diagnostic data to Log Analytics](logic-apps-track-b2b-messages-omsportal.md) 
and [set up tracking for your messages in OMS](logic-apps-track-b2b-messages-omsportal). 

After you've met these requirements, you should also have an OMS workspace for Log Analytics.

## Create queries with filters in the Operations Management Suite portal

This example shows how you can find messages based on their interchange control number.

1. Open your OMS workspace home page (`https://{your-workspace-name}.portal.mms.microsoft.com`), 
and choose **Log Search**.

   ![On your OMS home page, choose "Log Search"](media/logic-apps-track-b2b-messages-omsportal-query-filter-control-number/logsearch.png)

   -or-

   ![On the OMS menu, choose "Log Search"](media/logic-apps-track-b2b-messages-omsportal-query-filter-control-number/logsearch-2.png)

2. In the search box, enter a field that you want to find, and press **ENTER**. 
When you start typing, OMS shows you possible matches.

   This example searches for the **Type=AzureDiagnostics** field.

   ![Start typing query string](media/logic-apps-track-b2b-messages-omsportal-query-filter-control-number/oms-start-query.png)

3. To add a filter to your query, choose **+Add**.

   The example's **Type=AzureDiagnostics** filter returns 213 results.

   ![Add filter to query](media/logic-apps-track-b2b-messages-omsportal-query-filter-control-number/query1.png)

4. Under **Add Filters**, enter the filter name so you can find the filter you want. 
Select the filter, and choose **+Add**.

   This example uses the word "interchange" to find the interchange control number. We then select **event_record_messageProperties_interchangeControlNumber_s** 
   as our filter.

   ![Select filter event ](media/logic-apps-track-b2b-messages-omsportal-query-filter-control-number/oms-query-add-filter.png)

5. Select the filter value that you want to use. Choose **Apply**.

   For this example, we select the interchange control number that we want.

   ![Select filter value](media/logic-apps-track-b2b-messages-omsportal-query-filter-control-number/oms-query-select-filter-value.png)

6. Now return to the query that you're building. 
Your query has been updated with your selected filter event and value. 
Your previous results are now filtered too.

   ![Return to your query](media/logic-apps-track-b2b-messages-omsportal-query-filter-control-number/oms-query-filtered-results.png)

   Learn more about [how to find data with log searches in Log Analytics](../log-analytics/log-analytics-log-searches.md).

7. To reuse your query later, 
save your query to your **Favorites**.

## Save your query as a favorite

1. From your query, choose **Save**. 
Give your query a name, and select a category. 

   ![Give your query a name and category](media/logic-apps-track-b2b-messages-omsportal-query-filter-control-number/oms-query-save.png)

2. To view your query, 
choose **Favorites**.

   ![Choose "Favorites"](media/logic-apps-track-b2b-messages-omsportal-query-filter-control-number/oms-query-favorites.png)

3. Under **Saved Searches** list, 
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

3. Under **Saved Searches** list, 
select your query so that you can view the results. 
To update the query so you can find different results, edit the query.

   ![Select your query](media/logic-apps-track-b2b-messages-omsportal-query-filter-control-number/oms-log-search-find-favorites.png)

## Next steps

* [Custom tracking schemas](logic-apps-track-integration-account-custom-tracking-schema.md)   
* [AS2 tracking schemas](logic-apps-track-integration-account-as2-tracking-schemas.md)
* [X12 tracking schemas](logic-apps-track-integration-account-x12-tracking-schema.md)
* [Enterprise Integration Pack](../logic-apps/logic-apps-enterprise-integration-overview.md)
