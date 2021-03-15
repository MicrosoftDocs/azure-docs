---
title: Built-in triggers and actions for Azure Logic Apps
description: Use built-in triggers, and actions in Azure Logic Apps to create schedule-based workflows, communicate with other apps and services, control workflows, and manage data.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, logicappspm, azla
ms.topic: article
ms.date: 04/05/2021
---

# Built-in triggers and actions for Logic Apps

Built-in triggers and actions for [Logic Apps connectors](connectors-overview.md) run natively, and you don't need to create a connection to use them. You can use these built-in triggers and actions to [run code from logic apps](#run-code-from-logic-apps), [control logic app workflows](#control-workflow), and [manage or manipulate data](#manage-or-manipulate-data).

You can [use built-in triggers and actions](#understand-triggers-and-actions) to perform tasks like:

- Run logic apps on custom and advanced schedules. For more information about scheduling, see the [overview of recurrence behaviors in Logic Apps connectors](apis-list.md#recurrence-behavior).
- Organize and control your logic app's workflow; for example, loops and conditions.
- Work with variables and data operations.
- Communicate with other endpoints.
- Receive and respond to requests.
- Call Azure functions, Azure API Apps (Web Apps), your own APIs managed and published with Azure API Management, and nested logic apps that can receive requests.

> [!NOTE]
> Some connectors for Logic Apps have versions for both [managed connectors](managed.md) and built-in connectors.
> The version you use depends on whether you create a multi-tenant logic app, or a new single-tenant logic app.

## Understand triggers and actions

Logic Apps provides built-in triggers and actions in the following connectors:

:::row:::
    :::column:::
        [![Schedule icon in Logic Apps][schedule-icon]][schedule-doc]
        \
        \
        [**Schedule**][schedule-doc]
        \
        \
        Run a logic app on a specified recurrence, ranging from basic to advanced schedules with the [**Recurrence** trigger][schedule-recurrence-doc].
        \
        \
        Run a logic app that needs to handle data in continuous chunks with the [**Sliding Window** trigger][schedule-sliding-window-doc]. 
        \
        \
        Pause your logic app for a specified duration with the [**Delay** action][schedule-delay-doc]. 
        \
        \
        Pause your logic app until the specified date and time with the [**Delay until** action][schedule-delay-until-doc].
    :::column-end:::
    :::column:::
        [![Batch icon in Logic Apps][batch-icon]][batch-doc]
        \
        \
        [**Batch**][batch-doc]
        \
        \
        Process messages in batches with the **Batch messages** trigger. 
        \
        \
        Call logic apps that have existing batch triggers with the **Send messages to batch** action. 
    :::column-end:::
    :::column:::
        [![HTTP icon in Logic Apps][http-icon]][http-doc]
        \
        \
        [**HTTP**][http-doc]
        \
        \
        Call HTTP or HTTPS endpoints with triggers and actions for HTTP. 
        \
        \
        Other HTTP built-in triggers and actions include [HTTP + Swagger built-in connector][http-swagger-doc] and [HTTP + Webhook][http-webhook-doc].
    :::column-end:::
    :::column:::
        [![Request icon][http-request-icon]][http-request-doc]
        \
        \
        [**Request**][http-request-doc]
        \
        \
        Make your logic app callable from other apps or services, trigger on Event Grid resource events, or trigger on responses to Azure Security Center alerts with the **Request** trigger.
        \
        \
        Send responses to an app or service with the **Response** action.
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        [![Azure API Management icon in Logic Apps][azure-api-management-icon]][azure-api-management-doc]
        \
        \
        [**Azure API Management**][azure-api-management-doc]
        \
        \
        Call triggers and actions defined by your own APIs that you manage and publish with Azure API Management.
    :::column-end:::
    :::column:::
        [![Azure App Services icon in Logic Apps][azure-app-services-icon]][azure-app-services-doc]
        \
        \
        [**Azure App Services**][azure-app-services-doc]
        \
        \
        Call Azure API Apps, or Web Apps, hosted on Azure App Service. 
        \
        \
        The triggers and actions defined by these apps appear like any other first-class triggers and actions when Swagger is included.
    :::column-end:::
    :::column:::
        [![Azure Logic Apps icon in Logic Apps][azure-logic-apps-icon]][nested-logic-app-doc]
        \
        \
        [**Azure Logic Apps**][nested-logic-app-doc]
        \
        \
        Call other logic apps that start with the **Request** trigger.
    :::column-end:::
    :::column:::
    :::column-end:::
:::row-end:::

## Run code from logic apps

Logic Apps provides built-in actions for running your own code in your logic app's workflow:

:::row:::
    :::column:::
        [![Azure Functions icon in Logic Apps][azure-functions-icon]][azure-functions-doc]
        \
        \
        [**Azure functions**][azure-functions-doc]
        \
        \
        Call Azure functions from your logic app that run custom code *snippets* (C# or Node.js)
    :::column-end:::
    :::column:::
        [![Inline Code icon in Logic Apps][inline-code-icon]][inline-code-doc]
        \
        \
        [**Inline Code**][inline-code-doc]
        \
        \
        Add and run JavaScript code snippets from your logic apps.
    :::column-end:::
    :::column:::
    :::column-end:::
    :::column:::
    :::column-end:::
:::row-end:::

## Control workflow

Logic Apps provides built-in actions for structuring and controlling the actions in your logic app's workflow:

:::row:::
    :::column:::
        [![Condition action icon in Logic Apps][condition-icon]][condition-doc]
        \
        \
        [**Condition**][condition-doc]
        \
        \
        Evaluate a condition and run different actions based on whether the condition is true or false.
    :::column-end:::
    :::column:::
        [![For Each action icon in Logic Apps][for-each-icon]][for-each-doc]
        \
        \
        [**For Each**][for-each-doc]
        \
        \
        Perform the same actions on every item in an array.
    :::column-end:::
    :::column:::
        [![Scope action icon in Logic Apps][scope-icon]][scope-doc]
        \
        \
        [**Name**][scope-doc]
        \
        \
        Group actions into *scopes*, which get their own status after the actions in the scope finish running.
    :::column-end:::
    :::column:::
        [![Switch action icon in Logic Apps][switch-icon]][switch-doc]
        \
        \
        [**Switch**][switch-doc]
        \
        \
        Group actions into *cases*, which are assigned unique values except for the default case. Run only that case whose assigned value matches the result from an expression, object, or token. If no matches exist, run the default case.
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        [![Terminate action icon in Logic Apps][terminate-icon]][terminate-doc]
        \
        \
        [**Terminate**][terminate-doc]
        \
        \
        Stop an actively running logic app workflow. 
    :::column-end:::
    :::column:::
        [![Until action icon in Logic Apps][until-icon]][until-doc]
        \
        \
        [**Until**][until-doc]
        \
        \
        Repeat actions until the specified condition is true or some state has changed.
    :::column-end:::
    :::column:::
    :::column-end:::
    :::column:::
    :::column-end:::
:::row-end:::

## Manage or manipulate data

Logic Apps provides built-in actions for working with data outputs and their formats:

:::row:::
    :::column:::
        [![Data Operations action icon in Logic Apps][data-operations-icon]][data-operations-doc]
        \
        \
        [**Data Operations**][data-operations-doc]
        \
        \
        Perform operations with data. 
        \
        \
        **Compose**: Create a single output from multiple inputs with various types. 
        \
        \
        **Create CSV table**: Create a comma-separated-value (CSV) table from an array with JSON objects. 
        \
        \
        **Create HTML table**: Create an HTML table from an array with JSON objects. 
        \
        \
        **Filter array**: Create an array from items in another array that meet your criteria. 
        \
        \
        **Join**: Create a string from all items in an array and separate those items with the specified delimiter. 
        \
        \
        **Parse JSON**: Create user-friendly tokens from properties and their values in JSON content so that you can use those properties in your workflow. 
        \
        \
        **Select**: Create an array with JSON objects by transforming items or values in another array and mapping those items to specified properties.
    :::column-end:::
    :::column:::
        ![Date Time action icon in Logic Apps][date-time-icon]
        \
        \
        **Date Time**
        \
        \
        Perform operations with timestamps.
        \
        \
        **Add to time**: Add the specified number of units to a timestamp. 
        \
        \
        **Convert time zone**: Convert a timestamp from the source time zone to the target time zone. 
        \
        \
        **Current time**: Return the current timestamp as a string. 
        \
        \
        **Get future time**: Return the current timestamp plus the specified time units. 
        \
        \
        **Get past time**: Return the current timestamp minus the specified time units. 
        \
        \
        **Subtract from time**: Subtract a number of time units from a timestamp..
    :::column-end:::
    :::column:::
        [![Variables action icon in Logic Apps][variables-icon]][variables-doc]
        \
        \
        [**Variables**][variables-doc]
        \
        \
        Perform operations with variables.
        \
        \
        **Append to array variable**: Insert a value as the last item in an array stored by a variable. 
        \
        \
        **Append to string variable**: Insert a value as the last character in a string stored by a variable.
        \
        \
        **Decrement variable**: Decrease a variable by a constant value.
        \
        \
        **Increment variable**: Increase a variable by a constant value. 
        \
        \
        **Initialize variable**: Create a variable and declare its data type and initial value. 
        \
        \
        **Set variable**: Assign a different value to an existing variable. 
    :::column-end:::
    :::column:::
    :::column-end:::
:::row-end:::

## Next steps

> [!div class="nextstepaction"]
> [Create custom APIs you can call from Logic Apps](/logic-apps/logic-apps-create-api-app)

<!-- Built-ins icons -->
[azure-api-management-icon]: ./media/apis-list/azure-api-management.png
[azure-app-services-icon]: ./media/apis-list/azure-app-services.png
[azure-functions-icon]: ./media/apis-list/azure-functions.png
[azure-logic-apps-icon]: ./media/apis-list/azure-logic-apps.png
[batch-icon]: ./media/apis-list/batch.png
[condition-icon]: ./media/apis-list/condition.png
[data-operations-icon]: ./media/apis-list/data-operations.png
[date-time-icon]: ./media/apis-list/date-time.png
[for-each-icon]: ./media/apis-list/for-each-loop.png
[http-icon]: ./media/apis-list/http.png
[http-request-icon]: ./media/apis-list/request.png
[http-response-icon]: ./media/apis-list/response.png
[http-swagger-icon]: ./media/apis-list/http-swagger.png
[http-webhook-icon]: ./media/apis-list/http-webhook.png
[inline-code-icon]: ./media/apis-list/inline-code.png
[schedule-icon]: ./media/apis-list/recurrence.png
[scope-icon]: ./media/apis-list/scope.png
[switch-icon]: ./media/apis-list/switch.png
[terminate-icon]: ./media/apis-list/terminate.png
[until-icon]: ./media/apis-list/until.png
[variables-icon]: ./media/apis-list/variables.png


<!--Built-in doc links-->
[azure-api-management-doc]: ../api-management/get-started-create-service-instance.md "Create an Azure API Management service instance for managing and publishing your APIs"
[azure-app-services-doc]: ../logic-apps/logic-apps-custom-api-host-deploy-call.md "Integrate logic apps with App Service API Apps"
[azure-functions-doc]: ../logic-apps/logic-apps-azure-functions.md "Integrate logic apps with Azure Functions"
[batch-doc]: ../logic-apps/logic-apps-batch-process-send-receive-messages.md "Process messages in groups, or as batches"
[condition-doc]: ../logic-apps/logic-apps-control-flow-conditional-statement.md "Evaluate a condition and run different actions based on whether the condition is true or false"
[for-each-doc]: ../logic-apps/logic-apps-control-flow-loops.md#foreach-loop "Perform the same actions on every item in an array"
[http-doc]: ./connectors-native-http.md "Call HTTP or HTTPS endpoints from your logic apps"
[http-request-doc]: ./connectors-native-reqres.md "Receive HTTP requests in your logic apps"
[http-response-doc]: ./connectors-native-reqres.md "Respond to HTTP requests from your logic apps"
[http-swagger-doc]: ./connectors-native-http-swagger.md "Call REST endpoints from your logic apps"
[http-webhook-doc]: ./connectors-native-webhook.md "Wait for specific events from HTTP or HTTPS endpoints"
[inline-code-doc]: ../logic-apps/logic-apps-add-run-inline-code.md "Add and run JavaScript code snippets from your logic apps"
[nested-logic-app-doc]: ../logic-apps/logic-apps-http-endpoint.md "Integrate logic apps with nested workflows"
[query-doc]: ../logic-apps/logic-apps-perform-data-operations.md#filter-array-action "Select and filter arrays with the Query action"
[schedule-doc]: ../logic-apps/concepts-schedule-automated-recurring-tasks-workflows.md "Run logic apps based a schedule"
[schedule-delay-doc]: ./connectors-native-delay.md "Delay running the next action"
[schedule-delay-until-doc]: ./connectors-native-delay.md "Delay running the next action"
[schedule-recurrence-doc]:  ./connectors-native-recurrence.md "Run logic apps on a recurring schedule"
[schedule-sliding-window-doc]: ./connectors-native-sliding-window.md "Run logic apps that need to handle data in contiguous chunks"
[scope-doc]: ../logic-apps/logic-apps-control-flow-run-steps-group-scopes.md "Organize actions into groups, which get their own status after the actions in group finish running"
[switch-doc]: ../logic-apps/logic-apps-control-flow-switch-statement.md "Organize actions into cases, which are assigned unique values. Run only the case whose value matches the result from an expression, object, or token. If no matches exist, run the default case"
[terminate-doc]: ../logic-apps/logic-apps-workflow-actions-triggers.md#terminate-action "Stop or cancel an actively running workflow for your logic app"
[until-doc]: ../logic-apps/logic-apps-control-flow-loops.md#until-loop "Repeat actions until the specified condition is true or some state has changed"
[data-operations-doc]: ../logic-apps/logic-apps-perform-data-operations.md "Perform data operations such as filtering arrays or creating CSV and HTML tables"
[variables-doc]: ../logic-apps/logic-apps-create-variables-store-values.md "Perform operations with variables, such as initialize, set, increment, decrement, and append to string or array variable"
