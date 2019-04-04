---
title: Get bulk data, records, and items by using pagination - Azure Logic Apps
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

# Get bulk data, records, and items with pagination in Azure Logic Apps

When you get data, records, or items by using a connector action in 
[Azure Logic Apps](../logic-apps/logic-apps-overview.md), your results 
might exceed the connector's default page size. For example, the default 
page size limit for the SQL Server connector's **Get rows** action is 2048, 
but this limit might vary based on other settings. In this scenario, 
the action returns only the first page of results. In other scenarios, 
you might be working with results so large that you want better control 
over the size and structure for your result sets.

Specific actions, such as the SQL Server **Get rows** action, support *pagination* 
so that the action can get the remaining results, but returns all those results in 
a single message when the action finishes. When you use pagination, you also specify 
a limit that sets the *minimum* number of results that the action returns. The action 
continues retrieving results until the action gets *at least* the specified minimum or 
the default limit, whichever number is smaller. If your final set of results exceeds your 
specified minimum, the action returns those results. For example, suppose you set the limit 
to at least 5000 items. If the final set returns 5100 items, you get that number of items.

Here's a list with just some of the connectors where you can turn on pagination for specific actions:

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
