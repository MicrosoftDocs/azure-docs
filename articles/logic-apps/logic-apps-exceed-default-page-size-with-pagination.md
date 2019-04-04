---
title: Get bulk data, records, and items by using pagination - Azure Logic Apps
description: To exceed default page size for some connector actions, set up pagination so you can customize paging in Azure Logic Apps
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
ms.reviewer: klam, LADocs
ms.topic: article
ms.date: 04/03/2019
---

# Get bulk data, records, and items by setting up pagination in Azure Logic Apps

When you get data, records, or items by using a connector action in Azure Logic Apps, 
your results might exceed the connector's default page size. In this scenario, 
the action returns only the first page of results. For example, the default page size 
for the SQL Server connector's **Get rows** action is 2048. This limit might also vary 
based on other settings. In another scenario, you might be working with results so large 
that you want better control over the size and structure for your result sets.

Some actions, such as the SQL Server **Get rows** action, support the pagination capability, 
which makes an action get the remaining results, but returns all those results in 
a single message when the action finishes. You must also specify a limit that sets the 
*minimum* number of results that the action returns. The action continues getting results 
until the action has at least the specified minimum or the default maximum number of results, 
whichever number is smaller. However, if the final result set exceeds your specified minimum, 
the action returns those results. For example, suppose you set the limit to 5000 items. 
If the final set has 5100 results, you get that number of results.

> [!NOTE]
> If the initial response or a subsequent response 
> doesn't link to the next page of results, your logic 
> app doesn't call for the next page of results.

This list shows just some of the connectors where you 
can turn on pagination for specific actions:

* <a href="https://docs.microsoft.com/connectors/dynamicscrmonline/" target="_blank">Dynamics 365 CRM Online</a>

* <a href="https://docs.microsoft.com/connectors/excel/" target="_blank">Excel</a>

* <a href="https://docs.microsoft.com/azure/connectors/connectors-native-http" target="_blank">HTTP</a>

* <a href="https://docs.microsoft.com/connectors/db2/" target="_blank">IBM DB2</a>

* <a href="https://docs.microsoft.com/connectors/oracle/" target="_blank">Oracle Database</a>

* <a href="https://docs.microsoft.com/connectors/sharepointonline/" target="_blank">SharePoint</a>

* <a href="https://docs.microsoft.com/connectors/sql/" target="_blank">SQL Server</a>

## Set up pagination

To determine whether an action supports pagination, 
check the action's settings for the **Pagination** setting.
This example shows how to turn on pagination in the SQL 
Server's **Get rows** action.

1. In the action's upper-right corner, choose the 
ellipses (**...**) button, and select **Settings**.

   ![On the action, open "Settings"](./media/logic-apps-exceed-default-page-size-with-pagination/sql-action-settings.png)

   If the action supports pagination, 
   the action displays the **Pagination** setting.

1. Change the **Pagination** setting from **Off** to **On**. 
In the **Limit** property, specify the minimum number of 
results that you want the action to return.

   ![Specify that the action return a minimum number of results](./media/logic-apps-exceed-default-page-size-with-pagination/sql-action-settings-pagination.png)

1. When you're ready, choose **Done**.

### Pagination setting in workflow definition

In your logic app's workflow definition, when you turn on pagination for an action, 
the `"paginationPolicy"` property along with the `"minimumItemCount"` property 
appears in the action's `"runtimeConfiguration"` property, for example:

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