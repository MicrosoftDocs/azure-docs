---
title: Call a function from Microsoft Flow | Microsoft Docs
description: Create a custom connector then call a function using that connector.
services: functions
keywords: cloud apps, cloud services, Microsoft Flow, business processes, business application
documentationcenter: ''
author: mgblythe
manager: cfowler
editor: ''

ms.assetid: ''
ms.service: functions
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/14/2017
ms.author: mblythe
ms.custom: ''
---

# Call a function from Microsoft Flow

[Microsoft Flow](https://flow.microsoft.com/) makes it easy to automate workflows and business processes between your favorite apps and services. Professional developers can use Azure Functions to extend the capabilities of Microsoft FLow, while shielding flow builders from the technical details.

You build a flow in this topic based on a maintenance scenario for wind turbines. This topic shows you how to call the function that you defined in [Create an OpenAPI definition for a function](functions-openapi-definition.md). The function determines if an emergency repair on a wind turbine is cost-effective.

In this topic, you learn how to: [TODO: update]

> [!div class="checklist"]
> * Prepare sample data in SharePoint.
> * Export an API definition.
> * Add a connection to the API.
> * Create a flow and add data sources.
> * Add controls to view data in the app.
> * Add controls to call the function and display data.
> * Run the app to determine whether a repair is cost-effective.

## Prerequisites [TODO: update for Excel, SPO]

+ An active [Microsoft Flow account](https://flow.microsoft.com/documentation/sign-up-sign-in/) with the same sign in credentials as your Azure account. 
+ Excel, because you will use Excel as a data source for your app.
+ Complete the tutorial [Create an OpenAPI definition for a function](functions-openapi-definition.md).


## Prepare sample data in SharePoint [TODO: update for Excel, SPO]
You start off by preparing sample data that you use in the flow. Copy the following table into Excel. 

| Title      | Latitude  | Longtitude  | LastServiceDate | MaxOutput | ServiceRequired | EstimatedEffort | InspectionNotes                            | Inspector |
|------------|-----------|-------------|-----------------|-----------|-----------------|-----------------|--------------------------------------------| mblythe@microsoft.com |
| Turbine 1  | 47.438401 | -121.383767 | 2/23/2017       | 2850      | Yes             | 6               | This is the second issue this month.       | mblythe@microsoft.com |
| Turbine 4  | 47.433385 | -121.383767 | 5/8/2017        | 5400      | Yes             | 6               |                                            | mblythe@microsoft.com |
| Turbine 33 | 47.428229 | -121.404641 | 6/20/2017       | 2800      |                 |                 |                                            | mblythe@microsoft.com |
| Turbine 34 | 47.463637 | -121.358824 | 2/19/2017       | 2800      | Yes             | 7               |                                            | mblythe@microsoft.com |
| Turbine 46 | 47.471993 | -121.298949 | 3/2/2017        | 1200      |                 |                 |                                            | mblythe@microsoft.com |
| Turbine 47 | 47.484059 | -121.311171 | 8/2/2016        | 3350      |                 |                 |                                            | mblythe@microsoft.com |
| Turbine 55 | 47.438403 | -121.383767 | 10/2/2016       | 2400      | Yes             | 40               | We have some parts coming in for this one. | mblythe@microsoft.com |

1. In Excel, select the data, and on the **Home** tab, click **Format as table**.

    ![Format as table](media/functions-flow-scenario/format-table.png)

1. Select any style, and click **OK**.

1. With the table selected, on the **Design** tab, enter `Turbines` for **Table Name**.

    ![Table name](media/functions-flow-scenario/table-name.png)

1. Save the Excel workbook.

[!INCLUDE [Export an API definition](../../includes/functions-export-api-definition.md)]

## Add a connection to the API
The custom API (also known as a custom connector) is available in Microsoft Flow, but you must make a connection to the API before you can use it in a flow.

1. In [flow.microsoft.com](https://flow.microsoft.com), click the gear icon (in the upper right), then click **Connections**.

    ![Flow connections](media/functions-flow-scenario/flow-connections.png)

1. Click **Create Connection**, scroll down to the **Turbine Repair** connector, and click it.

    ![Create connection](media/functions-flow-scenario/create-connection.png)

1. Enter the API Key, and click **Create connection**.

    ![Enter API key and create](media/functions-flow-scenario/api-key.png)

> [!NOTE]
> If you share your flow with others, each person who works on or uses the flow must also enter the API key to connect to the API. This behavior might change in the future, and we will update this topic to reflect that.


## Build your flow [TODO: you need SPO connection first]

Now you're ready to create an *approval flow*. [TODO: flesh this out]

### Add a trigger and specify a condition

You first create a flow from blank (without a template), then add a *trigger* that fires when an item is added to the SharePoint list. You then add a *condition* to determine what happens next.

1. Click **My Flows**, then **Create from blank**.

    ![Create from blank](media/functions-flow-scenario/create-from-blank.png)

2. Click the SharePoint trigger **When an item is created**.

    ![Choose a trigger](media/functions-flow-scenario/choose-trigger.png)

3. For **Site Address**, enter your SharePoint site name, and for **List Name**, enter the list that contains the turbine data.

    ![Choose a trigger](media/functions-flow-scenario/site-list.png)

4. Click **New step**, then **Add a condition**.

    ![Add a condition](media/functions-flow-scenario/add-condition.png)

    Microsoft Flow adds two branches to the flow: **If yes** and **If no**. You add steps to one or both branches after you define the condition to match.

    ![Condition branches](media/functions-flow-scenario/condition-branches.png)

5. On the **Condition** card, click the first box, then select **ServiceRequired** from the **Dynamic content** dialog box.

    ![Select field for condition](media/functions-flow-scenario/condition1-field.png)

6. Enter a value of `Yes` for the condition.

    ![Enter yes for condition](media/functions-flow-scenario/condition1-yes.png)

For any items added to the list, the flow checks if the **ServiceRequired** field is set to `Yes`, then goes to the **If yes** branch or the **If no** branch as appropriate. 

To save time, in this flow, you will only specify actions for the **If yes** branch.

### Add the custom connector

You now add the custom connector...

1. In the **If yes** branch, click **Add an action**.

    ![Add an action](media/functions-flow-scenario/condition1-yes-add-action.png)

2. In the **Choose an action** dialog box, search for `Turbine Repair`, then select the action **Turbine Repair - Calculates costs**.

    ![Choose an action](media/functions-flow-scenario/choose-turbine-repair.png)

    You can now use the custom connector in the flow just like you use a standard connector. The following image shows the card that is added to the flow. The fields and descriptions come from the OpenAPI definition for the connector.

    ![Calculates costs defaults](media/functions-flow-scenario/calculates-costs-default.png)

3. On the **Calculates costs** card, use the **Dynamic content** dialog box to select inputs for the function. Microsoft Flow shows only numeric fields because the OpenAPI definition specifies that **Hours** and **Capacity** are numeric.

    For **Hours**, select **EstimatedEffort**, and for **Capacity**, select **MaxOutput**.

    ![Choose an action](media/functions-flow-scenario/calculates-costs-fields.png)

     Now you add another condition based on the output of the function.

4. At the bottom of the **If yes** branch, click **More** then **Add a condition**.

    ![Add a condition](media/functions-flow-scenario/condition2-add.png)

5. On the **Condition 2** card, click the first box, then select **Message** from the **Dynamic content** dialog box.

    ![Select field for condition](media/functions-flow-scenario/condition2-field.png)

6. Enter a value of `Yes`, like you did for the earlier condition. The flow goes to the next **If yes** branch or **If no** branch based on whether the message returned by the function is yes (make the repair) or no (don't make the repair). 

    ![Enter yes for condition](media/functions-flow-scenario/condition2-yes.png)

The flow should now look like the following image.

![Enter yes for condition](media/functions-flow-scenario/flow-checkpoint1.png)

### Start an approval process

7. asas
8. asas
9. 
 

## Next steps
In this topic, you learned how to:

> [!div class="checklist"]
> * Prepare sample data in Excel.
> * Export an API definition.
> * Add a connection to the API.
> * Create an app and add data sources.
> * Add controls to view data in the app.
> * Add controls to call the function and display data
> * Run the app to determine whether a repair is cost-effective.

To learn more about PowerApps, see [Introduction to PowerApps](https://powerapps.microsoft.com/tutorials/getting-started/).

To learn about another interesting scenario that uses Azure Functions, see [Create a function that integrates with Azure Logic Apps](functions-twitter-email.md).

| Capability | Details | Required or Recommended |
|------------|---------|-------------------------|
| Software-as-a-Service (SaaS) app | Meets a user scenario that fits well with Logic Apps, Flow, and PowerApps. | Required |
| Authentication Type | Your API must support OAuth2, API Key, or Basic Authentication. | Required | 
| Support | You must provide a support contact so that customers can get help. | Required | 
| Availability and uptime | Your app has at least 99.9% uptime. | Recommended | 
|||| 

| Name | Required or optional | Description | 
| ---- | -------------------- | ----------- | 
| **operationID** | Required | The operation to call for populating the list | 
| **value-path** | Required | A path string in the object inside `value-collection` that refers to the parameter value. If `value-collection` isn't specified, the response is evaluated as an array. | 
| **value-title** | Optional | A path string in the object inside `value-collection` that refers to the value's description. If `value-collection` isn't specified, the response is evaluated as an array. | 
| **value-collection** | Optional | A path string that evaluates to an array of objects in the response payload | 
| **parameters** | Optional | An object whose properties specify the input parameters required to invoke a dynamic-values operation | 