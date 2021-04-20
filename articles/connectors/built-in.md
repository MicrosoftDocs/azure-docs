---
title: Built-in triggers and actions for Azure Logic Apps
description: Use built-in triggers and actions to create automated workflows that integrate apps, data, services, and systems, to control workflows, and to manage data using Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, logicappspm, azla
ms.topic: conceptual
ms.date: 04/20/2021
---

# Built-in triggers and actions for Logic Apps


[Built-in triggers and actions](apis-list.md) provide ways for you to [control your workflow's schedule and structure](#control-workflow), [run your own code](#run-code-from-workflows), [manage or manipulate data](#manage-or-manipulate-data), and complete other tasks in your workflows. Different from [managed connectors](managed.md), many built-in operations aren't tied to a specific service, system, or protocol. For example, you can start almost any workflow on a schedule by using the Recurrence trigger. Or, you can have your workflow wait until called by using the Request trigger. All built-in operations run natively in the Logic Apps service, and most don't require that you create a connection before you use them. 

Logic Apps also provides built-in operations for a smaller number of services, systems, and protocols, such as Azure Service Bus, Azure Functions, SQL, AS2, and so on. The number and range varies based on whether you create a multi-tenant logic app or single-tenant logic app. In a few cases, both a built-in version and a managed connector version are available. In most cases, the built-in version provides better performance, capabilities, pricing, and so on. For example, to [exchange B2B messages using the AS2 protocol](../logic-apps/logic-apps-enterprise-integration-as2.md), select the built-in version unless you need tracking capabilities, which are available only in the (deprecated) managed connector version.

The following list describes only some of the tasks that you can accomplish with [built-in triggers and actions](#understand-triggers-and-actions):

- Run workflows using custom and advanced schedules. For more information about scheduling, review the [recurrence behavior section in the Logic Apps connector overview](apis-list.md#recurrence-behavior).
- Organize and control your workflow's structure, for example, using loops and conditions.
- Work with variables, dates, data operations, content transformations, and batch operations.
- Communicate with other endpoints using HTTP triggers and actions.
- Receive and respond to requests.
- Call your own functions (Azure Functions), web apps (Azure App Services), APIs (Azure API Management), other Logic Apps workflows that can receive requests, and so on.

## Understand triggers and actions

Logic Apps provides the following built-in triggers and actions:

:::row:::
    :::column:::
        [![Schedule icon in Logic Apps][schedule-icon]][schedule-doc]
        \
        \
        [**Schedule**][schedule-doc]
        \
        \
        [**Recurrence**][schedule-recurrence-doc]: Trigger a workflow based on the specified recurrence.
        \
        \
        [**Sliding Window**][schedule-sliding-window-doc]: Trigger a workflow that needs to handle data in continuous chunks.
        \
        \
        [**Delay**][schedule-delay-doc]: Pause your workflow for the specified duration.
        \
        \
        [**Delay until**][schedule-delay-until-doc]: Pause your workflow until the specified date and time.
    :::column-end:::
    :::column:::
        [![Batch icon in Logic Apps][batch-icon]][batch-doc]
        \
        \
        [**Batch**][batch-doc]
        \
        \
        [**Batch messages**][batch-doc]: Trigger a workflow that processes messages in batches.
        \
        \
        [**Send messages to batch**][batch-doc]: Call an existing workflow that currently starts with a **Batch messages** trigger.
    :::column-end:::
    :::column:::
        [![HTTP icon in Logic Apps][http-icon]][http-doc]
        \
        \
        [**HTTP**][http-doc]
        \
        \
        Call an HTTP or HTTPS endpoint by using either the HTTP trigger or action. 
        \
        \
        You can also use these other built-in HTTP triggers and actions: 
        - [HTTP + Swagger][http-swagger-doc]
        - [HTTP + Webhook][http-webhook-doc]
    :::column-end:::
    :::column:::
        [![Request icon][http-request-icon]][http-request-doc]
        \
        \
        [**Request**][http-request-doc]
        \
        \
        [**When a HTTP request is received**][http-request-doc]: Wait for a request from another workflow, app, or service. This trigger makes your workflow callable without having to be checked or polled on a schedule.
        \
        \
        [**Response**][http-request-doc]: Respond to a request received by the **When a HTTP request is received** trigger in the same workflow.
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
        Call your own triggers and actions in APIs that you define, manage, and publish using [Azure API Management](../api-management/api-management-key-concepts.md). <p><p>**Note**: Not supported when using [Consumption tier for API Management](../api-management/api-management-features.md).
    :::column-end:::
    :::column:::
        [![Azure App Services icon in Logic Apps][azure-app-services-icon]][azure-app-services-doc]
        \
        \
        [**Azure App Services**][azure-app-services-doc]
        \
        \
        Call apps that you create and host on [Azure App Service](../app-service/overview.md), for example, API Apps and Web Apps.
        \
        \
        When Swagger is included, the triggers and actions defined by these apps appear like any other first-class triggers and actions in Azure Logic Apps.
    :::column-end:::
    :::column:::
        [![Azure Logic Apps icon in Logic Apps][azure-logic-apps-icon]][nested-logic-app-doc]
        \
        \
        [**Azure Logic Apps**][nested-logic-app-doc]
        \
        \
        Call other workflows that start with the Request trigger named **When a HTTP request is received**.
    :::column-end:::
    :::column:::
    :::column-end:::
:::row-end:::

## Run code from workflows

Logic Apps provides built-in actions for running your own code in your workflow:

:::row:::
    :::column:::
        [![Azure Functions icon in Logic Apps][azure-functions-icon]][azure-functions-doc]
        \
        \
        [**Azure functions**][azure-functions-doc]
        \
        \
        Call [Azure-hosted functions](../azure-functions/functions-overview.md) to run your own *code snippets* (C# or Node.js) within your workflow.
    :::column-end:::
    :::column:::
        [![Inline Code icon in Logic Apps][inline-code-icon]][inline-code-doc]
        \
        \
        [**Inline Code**][inline-code-doc]
        \
        \
        [**Execute JavaScript Code**][inline-code-doc]: Add and run your own inline JavaScript *code snippets* within your workflow.
    :::column-end:::
    :::column:::
    :::column-end:::
    :::column:::
    :::column-end:::
:::row-end:::

## Control workflow

Logic Apps provides built-in actions for structuring and controlling the actions in your workflow:

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
