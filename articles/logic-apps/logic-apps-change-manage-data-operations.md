---
# required metadata
title: Change or manage data outputs and formats - Azure Logic Apps | Microsoft Docs
description: Convert, transform, or manage data outputs and formats in Azure Logic Apps
services: logic-apps
author: ecfan
manager: cfowler
ms.author: estfan
ms.topic: article
ms.date: 06/03/2018
ms.service: logic-apps

# optional metadata
ms.reviewer: klam, LADocs
ms.suite: integration
---

# Change or manage data, outputs, and formats in Azure Logic Apps

This article shows how you can work with the data 
outputs from triggers and actions in your logic apps 
by using these built-in data operations:

| Action | Description | 
|--------|-------------| 
| [**Compose**](#compose) | Create a JavaScript Object Notation (JSON) object from any output. | 
| [**Create CSV table**](#create-csv-table) | Create a comma-separated value (CSV) table from any output. | 
| [**Create HTML table**](#create-html-table) | Create an HTML table from any output. | 
| [**Filter array**](#filter-array-items) | Get items from an array based on a specified filter or condition. | 
| [**Join**](#join-array-items) | Create a string from an array by joining all the array items but separating each item with a delimiter character. | 
| [**Parse JSON**](#parse-json) | Create user-friendly data tokens that you can use in your logic apps from JSON content by providing or generating a JSON schema.  | 
| [**Select**](#select-array-properties) | Create an array that includes the specified properties for the all the items in another array. | 
||| 

If you don't have an Azure subscription yet, 
<a href="https://azure.microsoft.com/free/" target="_blank">sign up for a free Azure account</a>.

## Prerequisites

To follow this article, you need these items:

* The logic app where you need the operation for working with data 

  If you're new to logic apps, review 
  [What is Azure Logic Apps](../logic-apps/logic-apps-overview.md) 
  and [Quickstart: Create your first logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md).

* A [trigger](../logic-apps/logic-apps-overview.md#logic-app-concepts) 
as the first step in your logic app 

  Data operations are currently available only as actions. 
  Before you can use these actions, your logic app 
  must start with a trigger and include any other actions 
  required for creating the outputs you're working on.

<a name="create-csv-table"></a>

## Create CSV table from array

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

3. In the search box, enter "create CSV table" as your filter. 
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

### Create HTML table from output

## Transform JSON

These built-in operations help you handle and manage 
data using JavaScript Object Notation (JSON). 
To create more complex JSON transformations, see 
[Perform advanced JSON transformations with Liquid templates](../logic-apps/logic-apps-enterprise).

<a name="compose"></a>

### Create JSON objects from data

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

### Create data fields from JSON

When your logic app needs to work with data in JSON format, 
For services that work with data and produce output in JSON format, 
such as Azure Service Bus, Azure Cosmos DB, and others, 

When you want to use elements from JSON content in your logic app, 
you can create data fields or tokens for those elements. That way, 
you can select those fields from the dynamic content list while 
building your logic app. In this action, you can either 
provide a JSON schema or generate 
a JSON schema from sample JSON content. 


## Manage array items

<a name="filter-array-items"></a>

### Get filtered array items

<a name="join-array-items"></a>

### Create string from array

<a name="select"></a>

### Select array item properties



## Get support

* For questions, visit the [Azure Logic Apps forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurelogicapps).
* To submit or vote on feature ideas, visit the [Logic Apps user feedback site](http://aka.ms/logicapps-wish).

## Next steps

* Learn about [Logic Apps connectors](../connectors/apis-list.md)