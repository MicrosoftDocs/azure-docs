---
# required metadata
title: Change or manage data, outputs, and formats - Azure Logic Apps | Microsoft Docs
description: Convert, transform, or manage data, outputs, and formats in Azure Logic Apps
services: logic-apps
author: ecfan
manager: cfowler
ms.author: estfan
ms.topic: article
ms.date: 06/05/2018
ms.service: logic-apps

# optional metadata
ms.reviewer: klam, LADocs
ms.suite: integration
---

# Change or manage data, outputs, and formats in Azure Logic Apps

This article shows how you can work with the outputs and formats for 
the data that is handled by triggers and actions in your logic apps. 
Azure Logic Apps provides these data operations as built-in actions 
that you can use in your logic apps.

**Array actions** 

| Action | Description | 
|--------|-------------| 
| [**Filter array**](#filter-array-items) | Get the items from an array based on the specified filter or condition. | 
| [**Join**](#join-array-items) | Create a string from all the items in an array and separate each item with the specified character. | 
| [**Select**](#select-array-properties) | Create an array from the specified properties for all the items in a different array. | 
||| 

**Table actions**

| Action | Description | 
|--------|-------------| 
| [**Create CSV table**](#create-csv-table) | Create a comma-separated value (CSV) table with output from an array or expression. | 
| [**Create HTML table**](#create-html-table) | Create an HTML table with output from an array or expression. | 
||| 

**JSON actions**

These built-in operations help you handle and manage 
data using JavaScript Object Notation (JSON). 

| Action | Description | 
|--------|-------------| 
| [**Compose**](#compose) | Create a JavaScript Object Notation (JSON) object and properties from any output. | 
| [**Parse JSON**](#parse-json) | Create user-friendly data tokens, which you can use in logic apps, from JSON content by providing or generating a JSON schema.  | 
||| 

To create more complex JSON transformations, see 
[Perform advanced JSON transformations with Liquid templates](../logic-apps/logic-apps-enterprise).

## Prerequisites

To follow this article, you need these items:

* An Azure subscription. If you don't have an Azure subscription yet, 
<a href="https://azure.microsoft.com/free/" target="_blank">sign up for a free Azure account</a>.

* The logic app where you need the operation for working with data 

  If you're new to logic apps, review 
  [What is Azure Logic Apps](../logic-apps/logic-apps-overview.md) 
  and [Quickstart: Create your first logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md).

* A [trigger](../logic-apps/logic-apps-overview.md#logic-app-concepts) 
as the first step in your logic app 

  Data operations are currently available only as actions. 
  Before you can use these actions, your logic app 
  must start with a trigger and include any other actions 
  required for creating the outputs you want.


<a name="filter-array-items"></a>

## Filter array action

To get items from an array based on a specified filter or condition, 
follow these steps:

1. In the <a href="https://portal.azure.com" target="_blank">Azure portal</a> 
or Visual Studio, open your logic app in Logic App Designer. 

   This example uses the Azure portal and a 
   logic app that already has a trigger.

2. In your logic app where you want to get the array items, 
follow one of these steps: 

   * To add an action under the last step, 
   choose **New step** > **Add an action**.

     ![Add action](./media/logic-apps-change-manage-data-operations/add-action.png)

   * To add an action between steps, move your mouse 
   over the connecting arrow so the plus sign (+) appears. 
   Choose the plus sign, and then choose **Add an action**.

3. In the search box, enter "filter array" as your filter. 
From the actions list, select **Data Operations - Filter array**.

4. In the **Filter array** action, click inside the **From** box. 
When the dynamic content list opens, select the item to use as the 
source for the CSV table.


<a name="join-array-items"></a>

## Join action

To create a string that includes all the items from an array and separates 
those items by specifying a delimiter character, follow these steps:

1. In the <a href="https://portal.azure.com" target="_blank">Azure portal</a> 
or Visual Studio, open your logic app in Logic App Designer. 

   This example uses the Azure portal and a 
   logic app that uses a **Recurrence** trigger. 
   However, you can run this example manually 
   without waiting for the trigger to fire.

2. In your logic app where you want to create a string from array items, 
follow one of these steps: 

   * To add an action under the last step, 
   choose **New step** > **Add an action**.

     ![Add action](./media/logic-apps-change-manage-data-operations/add-action.png)

   * To add an action between steps, move your mouse 
   over the connecting arrow so the plus sign (+) appears. 
   Choose the plus sign, and then choose **Add an action**.

3. In the search box, enter "join" as your filter. 
From the actions list, select **Data Operations - Join**.

4. In the **Filter array** action, click inside the **From** box. 
When the dynamic content list opens, select the item to use as the 
source for the CSV table.

<a name="select"></a>

## Select action

<a name="create-csv-table"></a>

## Create CSV table action

To create a CSV table that has output from an array or expression, 
follow these steps.

1. In the <a href="https://portal.azure.com" target="_blank">Azure portal</a> 
or Visual Studio, open your logic app in Logic App Designer. 

   This example uses the Azure portal and a 
   logic app that already has a trigger.

2. In your logic app where you want to create the CSV table, 
follow one of these steps: 

   * To add an action under the last step, 
   choose **New step** > **Add an action**.

     ![Add action](./media/logic-apps-change-manage-data-operations/add-action.png)

   * To add an action between steps, move your mouse 
   over the connecting arrow so the plus sign (+) appears. 
   Choose the plus sign, and then choose **Add an action**.

3. In the search box, enter "create csv table" as your filter. 
From the actions list, select **Data Operations - Create CSV table**.

4. In the **Create CSV table** action, click inside the **From** box. 
When the dynamic content list opens, select the item to use as the 
source for the CSV table.

   To manually create columns and column headers from the properties 
   in the JSON content, choose **Show advanced options**.

If you switch from the designer to the code view editor, 
this example shows the way this action appears in your logic app definition. 
Here, the action passes in the **Attachments** array and 
creates columns for each attachment. Each column contains 
the values for each attachment's properties.

```json
{
   "Create_CSV_table": {
      "type": "Table",
      "inputs": {
         "from": "@triggerBody()?['Attachments']",
         "format": "CSV",
         "columns": [ {
            "value": "@item()['ContentBytes']"
         },
         {
            "value": "@item()['ContentId']"
         },
         {
            "value": "@item()['ContentType']"
         },
         {
            "value": "@item()['Name']"
         },
         {
            "value": "@item()['Size']"
         } ],
      },
      "runAfter": {}
   }
}
```

<a name="create-html-table"></a>

## Create HTML table action

To create an HTML table that has output from an array or expression, 
follow these steps.

1. In the <a href="https://portal.azure.com" target="_blank">Azure portal</a> 
or Visual Studio, open your logic app in Logic App Designer. 

   This example uses the Azure portal and a 
   logic app that already has a trigger.

2. In your logic app where you want to create an HTML table, 
follow one of these steps: 

   * To add an action under the last step, 
   choose **New step** > **Add an action**.

     ![Add action](./media/logic-apps-change-manage-data-operations/add-action.png)

   * To add an action between steps, move your mouse 
   over the connecting arrow so the plus sign (+) appears. 
   Choose the plus sign, and then choose **Add an action**.

3. In the search box, enter "create html table" as your filter. 
From the actions list, select **Data Operations - Create HTML table**.

4. In the **Create HTML table** action, click inside the **From** box. 
When the dynamic content list opens, select the item to use as the 
source for the HTML table. 



   To manually create columns and column headers from the properties 
   in the JSON content, choose **Show advanced options**.

If you switch from the designer to the code view editor, 
this example shows the way this action appears in your logic app definition. 
Here, the action passes in the **Attachments** array and 
creates columns for each attachment. Each column contains 
the values for each attachment's properties.

```json
{
   "Create_HTML_table": {
      "type": "Table",
      "inputs": {
         "from": "@triggerBody()?['Attachments']",
         "format": "HTML",
         "columns": [ {
            "value": "@item()['ContentBytes']"
         },
         {
            "value": "@item()['ContentId']"
         },
         {
            "value": "@item()['ContentType']"
         },
         {
            "value": "@item()['Name']"
         },
         {
            "value": "@item()['Size']"
         } ],
      },
      "runAfter": {}
   }
}
```

<a name="compose"></a>

## Compose action

1. In the Azure portal or Visual Studio, 
open your logic app in Logic App Designer. 

   This example uses the Azure portal 
   and a logic app with an existing trigger.

2. In your logic app where you want to create the JSON object, 
follow one of these steps: 

   * To add an action under the last step, 
   choose **New step** > **Add an action**.

     ![Add action](./media/logic-apps-create-variables-store-values/add-action.png)

   * To add an action between steps, move your mouse 
   over the connecting arrow so the plus sign (+) appears. 
   Choose the plus sign, and then choose **Add an action**.

3. In the search box, enter "compose" as your filter. 
From the actions list, select **Data Operations - Compose**.

4. Now select the inputs to use for creating the JSON object.

<a name="parse-json"></a>

## Parse JSON action

When your logic app needs to work with data in JSON format, 
For services that work with data and produce output in JSON format, 
such as Azure Service Bus, Azure Cosmos DB, and others, 

When you want to use elements from JSON content in your logic app, 
you can create data fields or tokens for those elements. That way, 
you can select those fields from the dynamic content list while 
building your logic app. In this action, you can either 
provide a JSON schema or generate 
a JSON schema from sample JSON content. 






## Get support

* For questions, visit the [Azure Logic Apps forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurelogicapps).
* To submit or vote on feature ideas, visit the [Logic Apps user feedback site](http://aka.ms/logicapps-wish).

## Next steps

* Learn about [Logic Apps connectors](../connectors/apis-list.md)