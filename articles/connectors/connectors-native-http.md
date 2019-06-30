---
title: Connect to HTTP or HTTPS endpoints by using Azure Logic Apps
description: Automate tasks, processes, and workflows that communicate with HTTP or HTTPS endpoints by using Azure Logic Apps
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
ms.reviewer: klam, LADocs
ms.topic: article
ms.date: 08/25/2018
tags: connectors
---

# Call HTTP or HTTPS endpoints with Azure Logic Apps

With [Azure Logic Apps](../logic-apps/logic-apps-overview.md) and the Hypertext Transfer Protocol (HTTP) connector, you can automate workflows that communicate with any HTTP or HTTPS endpoint by building logic apps. For example, you can monitor the service endpoint for your website. When an event happens at that endpoint, such as your website going down, the event triggers your logic app's workflow and runs the specified actions.

You can use the HTTP trigger as the first step in your workflow for checking or *polling* an endpoint on a regular schedule. On each check, the trigger sends a call or *request* to the endpoint. The endpoint's response determines whether your logic app's workflow runs. The trigger passes along any content from the response to the actions in your logic app.

You can use the HTTP action as any other step in your workflow for calling the endpoint when you want. The endpoint's response determines how your workflow's remaining actions run.

Based the target endpoint's capability, this connector supports Transport Layer Security (TLS) versions 1.0, 1.1, and 1.2. Logic Apps negotiates with the endpoint over using the highest supported version possible. So, for example, if the endpoint supports 1.2, the connector uses 1.2 first. Otherwise, the connector uses the next highest supported version.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/).

* The URL for the target endpoint you want to call

* Basic knowledge about 
[how to create logic apps](../logic-apps/quickstart-create-first-logic-app-workflow.md). If you're new to logic apps, review [What is Azure Logic Apps?](../logic-apps/logic-apps-overview.md)

* The logic app from where you want to call the target endpoint To start with the HTTP trigger, [create a blank logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md). To use the HTTP action, start your logic app with a trigger.

## Add the HTTP trigger

1. Sign in to the [Azure portal](https://portal.azure.com). Open your blank logic app in Logic App Designer.

1. In the search box, enter "http" as your filter. From the **Triggers** list, select the **HTTP** trigger.

   ![Select HTTP trigger](./media/connectors-native-http/select-http-trigger.png)

1. Provide the [HTTP trigger's parameter values](../logic-apps/logic-apps-workflow-actions-triggers.md##http-trigger) that you want to include in the call to the target endpoint. Set up the recurrence for how often you want the trigger to check the target endpoint.

   ![Enter HTTP trigger parameters](./media/connectors-native-http/http-trigger-parameters.png)

   | Parameter | Required | Description |
   |-----------|----------|-------------|
   | **Method** | Yes | The HTTP method to use for polling the target endpoint, for example: **GET**, **PUT**, **POST**, **PATCH**, **DELETE** |
   | **URI** | Yes | The URL for the HTTP or HTTPS endpoint to poll <p>Maximum string size: 2 KB |
   | **Headers** | No | |
   | **Queries** | No | |
   | **Body** | No | The body for the request when required by the selected method |
   | **Authentication** | Yes | |
   | **Interval** | Yes | |
   | **Frequency** | Yes | |
   ||||

1. To add other available parmeters, open the **Add new parameter** list, and select the parameters that you want.

   | Parameter | Required | Description |
   |-----------|----------|-------------|
   | **Cookie** | No | |
   | **Time zone** | No | |
   | **Start time** | No | |
   ||||

   For more information about the HTTP trigger, parameters, and values, see [Trigger and action types reference](../logic-apps/logic-apps-workflow-actions-triggers.md##http-trigger).

1. Continue building your logic app's workflow with actions that run when the trigger fires.

## Add HTTP action

[!INCLUDE [Create connection general intro](../../includes/connectors-create-connection-general-intro.md)]

1. Sign in to the [Azure portal](https://portal.azure.com), 
and open your logic app in Logic App Designer, if not open already.

1. Under the last step where you want to add the HTTP action, 
choose **New step**. 

   In this example, the logic app starts with the HTTP trigger as the first step.

1. In the search box, enter "http" as your filter. 
Under the actions list, select the **HTTP** action.

   ![Select HTTP action](./media/connectors-native-http/select-http-action.png)

   To add an action between steps, 
   move your pointer over the arrow between steps. 
   Choose the plus sign (**+**) that appears, 
   and then select **Add an action**.

1. Provide the [HTTP action's parameters and values](../logic-apps/logic-apps-workflow-actions-triggers.md##http-action) 
you want to include in the call to the target endpoint. 

   ![Enter HTTP action parameters](./media/connectors-native-http/http-action-parameters.png)

1. When you're done, make sure you save your logic app. 
On the designer toolbar, choose **Save**. 

## Authentication

To set authentication, choose **Show advanced options** inside the action or trigger. 
For more information about available authentication types for HTTP triggers and actions, 
see [Trigger and action types reference](../logic-apps/logic-apps-workflow-actions-triggers.md#connector-authentication).

## Get support

* For questions, visit the [Azure Logic Apps forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurelogicapps).
* To submit or vote on feature ideas, visit the [Logic Apps user feedback site](https://aka.ms/logicapps-wish).

## Next steps

* Learn about other [Logic Apps connectors](../connectors/apis-list.md)
