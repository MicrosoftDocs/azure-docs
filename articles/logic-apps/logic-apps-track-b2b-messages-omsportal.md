---
title: Track B2B messages in OMS portal | Microsoft Docs
description: How to track B2B messages in OMS portal
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
ms.date: 11/13/2016
ms.author: padmavc

---
# Tracking B2B messages in OMS portal
B2B communication involves message exchanges between two running business processes or applications. Tracking B2B messages in OMS portal provides a rich, web-based tracking capabilities that allow to view whether messages processed correctly.  You can track

* Count and status of messages
* Acknowledgments status
* Correlating messages with acknowledgments
* Detailed error description for failures
* Search capabilities

## Prerequisites
* An Azure account; you can create a [free account](https://azure.microsoft.com/free)
* An Integration Account; you can create an [Integration Account](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md) and enable logging; you can find steps [here](logic-apps-monitor-b2b-message.md)
* A Logic App; you can create a [Logic App](../logic-apps/logic-apps-create-a-logic-app.md) and enable logging; you can find steps [here](../logic-apps/logic-apps-monitor-your-logic-apps.md#azure-diagnostics-and-alerts)

## Adding Logic Apps B2B solution to OMS portal

1. Select **More Services** in portal, search **log analytics** and select **log analytics**
![Search log analytics](media/logic-apps-track-b2b-messages-omsportal/browseloganalytics.png)  

2. Select your **Log Analytics**
![Select log analytics](media/logic-apps-track-b2b-messages-omsportal/selectla.png)

3. Select **OMS Portal**, opens OMS portal home page
![Browse OMS portal](media/logic-apps-track-b2b-messages-omsportal/omsportalpage.png)

4. Select **Solutions Gallery**    
![Select Solutions Gallery](media/logic-apps-track-b2b-messages-omsportal/omshomepage1.png)

5. Select **Logic Apps B2B**
![Select Logic Apps B2B](media/logic-apps-track-b2b-messages-omsportal/omshomepage2.png)

6. Click **Add** to add **Logic Apps B2B Messages** to home page
![Select Add](media/logic-apps-track-b2b-messages-omsportal/omshomepage3.png)

7. Browse home page to view **Logic Apps B2B Messages**
![Select home page](media/logic-apps-track-b2b-messages-omsportal/omshomepage4.png)

## Tracking data in OMS portal

1. Post message process; the home page updates with message count
![Select home page](media/logic-apps-track-b2b-messages-omsportal/omshomepage6.png)

2. Selecting **Logic Apps B2B Messages** on home page leads to AS2 and X12 message status.  The data is based on last one day.
![Select Logic Apps B2B Messages](media/logic-apps-track-b2b-messages-omsportal/omshomepage5.png)

3. Selecting AS2 or X12 messages by status takes you to the message list
![Select AS2 message status](media/logic-apps-track-b2b-messages-omsportal/as2messagelist.png)

    ![Select X12 message status](media/logic-apps-track-b2b-messages-omsportal/x12messagelist.png)

4. Select a row in AS2 or X12 message list takes you to log search.  Log search lists all the actions that have same **Run ID**
![Select message status](media/logic-apps-track-b2b-messages-omsportal/logsearch.png)

## Queries in OMS portal

On the search page, you can create a query, and then when you search, you can filter the results by using facet controls.

### How to create a query

1. In the log search, write a query and select **Save**.  [Here](logic-apps-track-b2b-messages-omsportal-query-filter-control-number.md) are the steps to write a query 
![Select home page](media/logic-apps-track-b2b-messages-omsportal/logsearchaddquery.png)

2. **Save Search** opens.  Give a **name**, **category**, and click **Save**   
![Select home page](media/logic-apps-track-b2b-messages-omsportal/logsearchaddquery1.png)

3. To view the query, select **favorites**    
![Select home page](media/logic-apps-track-b2b-messages-omsportal/logsearchaddquery3.png)

    ![Select home page](media/logic-apps-track-b2b-messages-omsportal/logsearchaddquery4.png)

### How to use a saved query

1. In the log search, select **favorites** to view saved queries.  Selecting one of the gives query results
![Select home page](media/logic-apps-track-b2b-messages-omsportal/logsearchaddquery5.png)


## Next steps
[Custom Tracking Schema](logic-apps-track-integration-account-custom-tracking-schema.md "Learn about Custom Tracking Schema")   
[AS2 Tracking Schema](logic-apps-track-integration-account-as2-tracking-schemas.md "Learn about AS2 Tracking Schema")    
[X12 Tracking Schema](logic-apps-track-integration-account-x12-tracking-schema.md "Learn about X12 Tracking Schema")  
[Learn more about the Enterprise Integration Pack](../logic-apps/logic-apps-enterprise-integration-overview.md "Learn about Enterprise Integration Pack") 