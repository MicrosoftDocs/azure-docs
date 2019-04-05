---
title: Get bulk data, items, or records by using pagination - Azure Logic Apps
description: Set up pagination so you can exceed the default page size limit and control paging for specific connector actions in Azure Logic Apps
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
ms.reviewer: klam, LADocs
ms.topic: article
ms.date: 04/04/2019
---

# Get bulk data, items, or records with pagination in Azure Logic Apps

When you get data, items, or records by using a connector action in 
[Azure Logic Apps](../logic-apps/logic-apps-overview.md), you might get 
result sets so large that the action doesn't return all the results at 
the same time. With some actions, the number of results might exceed the 
connector's default page size. In this case, the action returns only the 
first page of results. For example, the default page size for the SQL Server 
connector's **Get rows** action is 2048, but might vary based on other settings.

Some actions, such as the SQL Server **Get rows** action, support *pagination* 
so that your logic app can ask for the remaining results, but return all those 
results as a single message when the action finishes. When you use pagination, 
you also specify a limit for the *minimum number* of results that the action returns. The action retrieves results until you get *at least* the specified minimum or 
the maximum number of results, whichever number is smaller. This behavior means 
that you sometimes get more than the minimum because the setting gets pages of results. For example, using the SQL Server **Get rows** action:

* The action's default page size limit is 2048 records per page.
* Suppose you have 10,000 records and specify 5000 records as the minimum.
* Pagination gets pages of records, so to meet at least the specified minimum, 
the action returns 6136 records (3 pages x 2048 records), not 5000 records.

Here's a list with just some of the connectors where 
you can turn on pagination for specific actions:

* <a href="https://docs.microsoft.com/connectors/azureblob/" target="_blank">Azure Blob Storage</a>
* <a href="https://docs.microsoft.com/connectors/dynamicscrmonline/" target="_blank">Dynamics 365</a>
* <a href="https://docs.microsoft.com/connectors/excel/" target="_blank">Excel</a>
* <a href="https://docs.microsoft.com/azure/connectors/connectors-native-http" target="_blank">HTTP</a>
* <a href="https://docs.microsoft.com/connectors/db2/" target="_blank">IBM DB2</a>
* <a href="https://docs.microsoft.com/en-us/connectors/teams/" target="_blank">Microsoft Teams</a>
* <a href="https://docs.microsoft.com/connectors/oracle/" target="_blank">Oracle Database</a>
* <a href="https://docs.microsoft.com/connectors/salesforce/" target="_blank">Salesforce</a>
* <a href="https://docs.microsoft.com/connectors/sharepointonline/" target="_blank">SharePoint</a>
* <a href="https://docs.microsoft.com/connectors/sql/" target="_blank">SQL Server</a>

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription yet, 
<a href="https://azure.microsoft.com/free/" target="_blank">sign up for a free Azure account</a>.

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
In the **Limit** property, specify the *minimum number* of 
results that you want the action to return.

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
