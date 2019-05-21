---
title: Get more data, items, or records with pagination - Azure Logic Apps
description: Set up pagination to exceed the default page size limit for connector actions in Azure Logic Apps
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
ms.reviewer: klam, LADocs
ms.topic: article
ms.date: 04/11/2019
---

# Get more data, items, or records by using pagination in Azure Logic Apps

When you retrieve data, items, or records by using a connector action in 
[Azure Logic Apps](../logic-apps/logic-apps-overview.md), you might get 
result sets so large that the action doesn't return all the results at 
the same time. With some actions, the number of results might exceed the 
connector's default page size. In this case, the action returns only the 
first page of results. For example, the default page size for the SQL Server 
connector's **Get rows** action is 2048, but might vary based on other settings.

Some actions let you turn on a *pagination* setting so that your logic 
app can retrieve more results up to the pagination limit, but return those 
results as a single message when the action finishes. When you use pagination, 
you must specify a *threshold* value, which is the target number of results you 
want the action to return. The action retrieves results until reaching your 
specified threshold. When your total number of items is less than the specified 
threshold, the action retrieves all the results.

Turning on the pagination setting retrieves pages of results based on a connector's page size. 
This behavior means that sometimes, you might get more results than your specified threshold. 
For example, when using the SQL Server **Get rows** action, which supports pagination setting:

* The action's default page size is 2048 records per page.
* Suppose you have 10,000 records and specify 5000 records as the minimum.
* Pagination gets pages of records, so to get at least the specified minimum, 
the action returns 6144 records (3 pages x 2048 records), not 5000 records.

Here's a list with just some of the connectors where you 
can exceed the default page size for specific actions:

* [Azure Blob Storage](https://docs.microsoft.com/connectors/azureblob/)
* [Dynamics 365](https://docs.microsoft.com/connectors/dynamicscrmonline/)
* [Excel](https://docs.microsoft.com/connectors/excel/)
* [HTTP](https://docs.microsoft.com/azure/connectors/connectors-native-http)
* [IBM DB2](https://docs.microsoft.com/connectors/db2/)
* [Microsoft Teams](https://docs.microsoft.com/connectors/teams/)
* [Oracle Database](https://docs.microsoft.com/connectors/oracle/)
* [Salesforce](https://docs.microsoft.com/connectors/salesforce/)
* [SharePoint](https://docs.microsoft.com/connectors/sharepointonline/)
* [SQL Server](https://docs.microsoft.com/connectors/sql/)

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription yet, 
[sign up for a free Azure account](https://azure.microsoft.com/free/).

* The logic app and the action where you want to turn on pagination. 
If you don't have a logic app, see 
[Quickstart: Create your first logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md).

## Turn on pagination

To determine whether an action supports pagination in the Logic App Designer, 
check the action's settings for the **Pagination** setting. This example shows 
how to turn on pagination in the SQL Server's **Get rows** action.

1. In the action's upper-right corner, choose the 
ellipses (**...**) button, and select **Settings**.

   ![Open the action's settings](./media/logic-apps-exceed-default-page-size-with-pagination/sql-action-settings.png)

   If the action supports pagination, 
   the action shows the **Pagination** setting.

1. Change the **Pagination** setting from **Off** to **On**. 
In the **Threshold** property, specify an integer value for 
the target number of results that you want the action to return.

   ![Specify minimum number of results to return](./media/logic-apps-exceed-default-page-size-with-pagination/sql-action-settings-pagination.png)

1. When you're ready, choose **Done**.

## Workflow definition - pagination

When you turn on pagination for an action that supports this capability, 
your logic app's workflow definition includes the `"paginationPolicy"` 
property along with the `"minimumItemCount"` property in that action's 
`"runtimeConfiguration"` property, for example:

```json
"actions": {
   "HTTP": {
      "inputs": {
         "method": "GET",
         "uri": "https://www.testuri.com"
      },
      "runAfter": {},
      "runtimeConfiguration": {
         "paginationPolicy": {
            "minimumItemCount": 1000
         }
      },
      "type": "Http"
   }
},
```

## Get support

For questions, visit the 
[Azure Logic Apps forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurelogicapps).
