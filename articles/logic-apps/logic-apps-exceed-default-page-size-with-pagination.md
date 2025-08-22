---
title: Get More Items or Records with Pagination
description: Learn how to set pagination to exceed the default page size limit for connector actions in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 08/25/2025
#Customer intent: As an integration developer working with Azure Logic Apps workflows, I need to know how to use pagination to manage large data results.
---

# Get more data, items, or records by using pagination in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption](~/reusable-content/ce-skilling/azure/includes/logic-apps-sku-consumption.md)]

When you get data, items, or records by using a connector action in Azure Logic Apps, you might get result sets so large that the action doesn't return all the results at the same time. For example, the default page size for the SQL Server connector's **Get rows** action is 2048, but might vary based on other settings.

For some actions, the number of results might exceed the connector's default page size. In this case, the action returns only the first page of results. 

Some actions let you turn on a *pagination* setting so that your logic app can retrieve more results up to the pagination limit. The action returns those results as a single message when the action finishes.

When you use pagination, you must specify a *threshold* value, which is the number of results you want the action to return. The action gets results until reaching your specified threshold. When your total number of items is less than the specified threshold, the action gets all the results.

Turning on the pagination setting retrieves pages of results based on a connector's page size. This behavior means that sometimes, you might get more results than your specified threshold. For example, when using the SQL Server **Get rows** action, which supports pagination setting:

- The action's default page size is 2048 records per page.
- Suppose you have 10,000 records and specify 5000 records as the minimum.
- Pagination gets pages of records, so to get at least the specified minimum, the action returns 6144 records (3 pages x 2048 records), not 5000 records.

Here's a list of some of the connectors where you can exceed the default page size for some actions:

- [Azure Blob Storage](/connectors/azureblob/)
- [Dynamics 365](/connectors/dynamicscrmonline/)
- [Excel](/connectors/excel/)
- [HTTP](../connectors/connectors-native-http.md)
- [IBM DB2](/connectors/db2/)
- [Microsoft Teams](/connectors/teams/)
- [Oracle Database](/connectors/oracle/)
- [Salesforce](/connectors/salesforce/)
- [SharePoint](/connectors/sharepointonline/)
- [SQL Server](/connectors/sql/)

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription yet, [sign up for a free Azure account](https://azure.microsoft.com/free/).
- The logic app and the action where you want to turn on pagination. For more information, see [Create a Consumption logic app workflow](quickstart-create-example-consumption-workflow.md).

## Turn on pagination

To determine whether an action supports pagination in the workflow designer, check the action's settings for the **Pagination** setting.

1. In the [Azure portal](https://portal.azure.com), open your logic app.

1. On the resource menu, under **Development Tools**, select the designer to open the workflow.

1. Select the action to open its parameters, then select **Settings**.

   If the action supports pagination, the action shows the **Pagination** setting.

1. Change the **Pagination** setting from **Off** to **On**.

   :::image type="content" source="./media/logic-apps-exceed-default-page-size-with-pagination/sql-action-settings-pagination.png" alt-text="Screenshot shows the Settings tab of an action with Pagination set to On and a value for Thresholds.":::

1. In the **Threshold** property, specify an integer value for the target number of results that you want the action to return.

1. From the workflow designer menu, select **Save**.

## Workflow definition - pagination

When you turn on pagination for an action that supports this capability, your logic app's workflow definition includes the `"paginationPolicy"` property along with the `"minimumItemCount"` property in that action's `"runtimeConfiguration"` property, for example:

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

In this case, the response returns an array that contains JSON objects.

## Get support

- [Azure Logic Apps Q & A](/answers/topics/azure-logic-apps.html).
