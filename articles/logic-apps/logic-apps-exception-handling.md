---
title: Error and exception handling for Logic Apps in Azure | Microsoft Docs
description: Patterns for error and exception handling in Logic Apps.
services: logic-apps
documentationcenter: 
author: dereklee
manager: anneta
editor: ''

ms.assetid: e50ab2f2-1fdc-4d2a-be40-995a6cc5a0d4
ms.service: logic-apps
ms.devlang: 
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: logic-apps
ms.date: 01/31/2018
ms.author: deli; LADocs

---
# Handle errors and exceptions in Logic Apps

Appropriately handling downtime or issues from dependent systems can 
pose a challenge for any integration architecture. 
To create robust integrations that are resilient against problems and failures, 
Logic Apps offers a first-class experience for handling errors and exceptions. 

## Retry policies

For the most basic exception and error handling, you can use the retry policy. 
If an initial request timed out or failed, 
which is any request that results in a 429 or 5xx response, 
this policy defines whether and how the action retries the request. 

There are four types of retry policies: default, none, fixed interval, and exponential interval. 
If your workflow definition doesn't have a retry policy, the default policy, 
as defined by the service, is used instead.

To set up retry policies, if applicable, open the Logic App Designer for your logic app, 
and go to **Settings** for a specific action in your logic app. Or, 
you can define retry policies in the **inputs** section for a specific action or trigger, 
if retryable, in your workflow definition. Here's the general syntax:

```json
"retryPolicy": {
    "type": "<retry-policy-type>",
    "interval": <retry-interval>,
    "count": <number-of-retry-attempts>
}
```

For more information about syntax and the **inputs** section, 
see the [retry-policy section in Workflow Actions and Triggers][retryPolicyMSDN]. 
For information about retry policy limitations, 
see [Logic Apps limits and configuration](../logic-apps/logic-apps-limits-and-config.md). 

### Default

When you don't define a retry policy in the **retryPolicy** section, 
your logic app uses the default policy, which is an [exponential interval policy](#exponential-interval) 
that sends up to four retries at exponentially increasing intervals that are scaled by 7.5 seconds. 
The interval is capped between 5 and 45 seconds. This policy is equivalent 
to the policy in this example HTTP workflow definition:

```json
"HTTP": {
    "type": "Http",
    "inputs": {
        "method": "GET",
        "uri": "http://myAPIendpoint/api/action",
        "retryPolicy" : {
            "type": "exponential",
            "count": 4,
            "interval": "PT7S",
            "minimumInterval": "PT5S",
            "maximumInterval": "PT1H"
        }
    },
    "runAfter": {}
}
```

### None

If you set **retryPolicy** to **none**, this policy does not retry failed requests.

| Element name | Required | Type | Description | 
| ------------ | -------- | ---- | ----------- | 
| type | Yes | String | **none** | 
||||| 

### Fixed interval

If you set **retryPolicy** to **fixed**, this policy retries a failed request 
by waiting the specified interval of time before sending the next request.

| Element name | Required | Type | Description |
| ------------ | -------- | ---- | ----------- |
| type | Yes | String | **fixed** |
| count | Yes | Integer | The number of retry attempts, which must be between 1 and 90 | 
| interval | Yes | String | The retry interval in [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations), which must be between PT5S and PT1D | 
||||| 

<a name="exponential-interval"></a>

### Exponential interval

If you set **retryPolicy** to **exponential**, this policy retries a failed 
request after a random time interval from an exponentially growing range. 
The policy also guarantees to send each retry attempt at a random interval 
that is greater than **minimumInterval** and less than **maximumInterval**. 
Exponential policies require **count** and **interval**, 
while values for **minimumInterval** and **maximumInterval** are optional. 
If you want to override the PT5S and PT1D default values respectively, 
you can add these values.

| Element name | Required | Type | Description |
| ------------ | -------- | ---- | ----------- |
| type | Yes | String | **exponential** |
| count | Yes | Integer | The number of retry attempts, which must be between 1 and 90  |
| interval | Yes | String | The retry interval in [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations), which must be between PT5S and PT1D. |
| minimumInterval | No | String | The retry minimum interval in [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations), which must be between PT5S and **interval** |
| maximumInterval | No | String | The retry minimum interval in [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations), which must be between **interval** and PT1D | 
||||| 

This table shows how a uniform random variable in the indicated range 
is generated for each retry up to and including **count**:

**Random variable range**

| Retry number | Minimum interval | Maximum interval |
| ------------ | ---------------- | ---------------- |
| 1 | Max(0, **minimumInterval**) | Min(interval, **maximumInterval**) |
| 2 | Max(interval, **minimumInterval**) | Min(2 * interval, **maximumInterval**) |
| 3 | Max(2 * interval, **minimumInterval**) | Min(4 * interval, **maximumInterval**) |
| 4 | Max(4 * interval, **minimumInterval**) | Min(8 * interval, **maximumInterval**) |
| .... | | | 
|||| 

## Catch and handle failures with the RunAfter property

Each logic app action declares the actions 
that must finish before that action starts, 
similar to how you specify the order of steps in your workflow. 
In an action definition, the **runAfter** property defines this 
ordering and is an object that describes which actions and 
action statuses execute the action.

By default, all actions that you add in the Logic App Designer are set to 
run after the previous step when the previous step's result is **Succeeded**. 
However, you can customize the **runAfter** value so that actions fire 
when the previous actions result as **Failed**, **Skipped**, 
or some combination of these values. For example, 
to add an item to a specific Service Bus 
topic after a specific **Insert_Row** action fails, 
you could use this example **runAfter** definition:

```json
"Send_message": {
    "inputs": {
        "body": {
            "ContentData": "@{encodeBase64(body('Insert_Row'))}",
            "ContentType": "{ \"content-type\" : \"application/json\" }"
        },
        "host": {
            "api": {
                "runtimeUrl": "https://logic-apis-westus.azure-apim.net/apim/servicebus"
            },
            "connection": {
                "name": "@parameters('$connections')['servicebus']['connectionId']"
            }
        },
        "method": "post",
        "path": "/@{encodeURIComponent('failures')}/messages"
    },
    "runAfter": {
        "Insert_Row": [
            "Failed"
        ]
    }
}
```

The **runAfter** property is set to run when the **Insert_Row** action status is **Failed**. 
To run the action if the action status is **Succeeded**, **Failed**, or **Skipped**, use this syntax:

```json
"runAfter": {
        "Insert_Row": [
            "Failed", "Succeeded", "Skipped"
        ]
    }
```

> [!TIP]
> Actions that run and finish successfully after a preceding action has failed, 
> are marked as **Succeeded**. This behavior means that if you successfully catch 
> all failures in a workflow, the run itself is marked as **Succeeded**.

<a name="scopes"></a>

## Evaluate actions with scopes and their results

Similar to running steps after individual actions with the **runAfter** property, 
you can group actions together inside a 
[scope](../logic-apps/logic-apps-control-flow-run-steps-group-scopes.md). 
You can use scopes when you want to logically group actions together, 
assess the scope's aggregate status, and perform actions based on that status. 
After all the actions in a scope finish running, the scope itself gets its own status. 

To check a scope's status, you can use the same 
criteria that you use to check a logic app's run status, 
such as **Succeeded**, **Failed**, and so on. 

By default, when all the scope's actions succeed, 
the scope's status is marked **Succeeded**. 
If the final action in a scope results as **Failed** or **Aborted**, 
the scope's status is marked **Failed**. 

To catch exceptions in a **Failed** scope and 
run actions that handle those errors, 
you can use the **runAfter** property for that **Failed** scope. 
That way, if *any* actions in the scope fail, 
and you use the **runAfter** property for that scope, 
you can create a single action to catch failures.

For limits on scopes, see [Limits and config](../logic-apps/logic-apps-limits-and-config.md).

### Get context and results for failures

Although catching failures from a scope is useful, 
you might also want context to help you understand 
exactly which actions failed plus any errors or status codes that were returned. 
The **@result()** workflow function provides context about the result of all actions in a scope.

The **@result()** function accepts a single parameter (the scope's name) 
and returns an array of all the action results from within that scope. 
These action objects include the same attributes as the **@actions()** object, 
such as the action's start time, end time, status, inputs, correlation IDs, and outputs. 
To send context for any actions that failed within a scope, 
you can easily pair an **@result()** function with a **runAfter** property.

To run an action *for each* action in a scope that has a **Failed** result, 
and to filter the array of results down to the failed actions, 
you can pair **@result()** with a **[Filter Array](../connectors/connectors-native-query.md)** action 
and a **[ForEach](../logic-apps/logic-apps-control-flow-loops.md)** loop. 
You can take the filtered result array and perform an action for each failure using the **ForEach** loop. 

Here's an example, followed by a detailed explanation, that sends an HTTP POST request 
with the response body of any actions that failed within the scope "My_Scope":

```json
"Filter_array": {
    "inputs": {
        "from": "@result('My_Scope')",
        "where": "@equals(item()['status'], 'Failed')"
    },
    "runAfter": {
        "My_Scope": [
            "Failed"
        ]
    },
    "type": "Query"
},
"For_each": {
    "actions": {
        "Log_Exception": {
            "inputs": {
                "body": "@item()['outputs']['body']",
                "method": "POST",
                "headers": {
                    "x-failed-action-name": "@item()['name']",
                    "x-failed-tracking-id": "@item()['clientTrackingId']"
                },
                "uri": "http://requestb.in/"
            },
            "runAfter": {},
            "type": "Http"
        }
    },
    "foreach": "@body('Filter_array')",
    "runAfter": {
        "Filter_array": [
            "Succeeded"
        ]
    },
    "type": "Foreach"
}
```

Here's a detailed walkthrough that describes what happens in this example:

1. To get the result of all actions within "My_Scope", 
the **Filter Array** action filters **@result('My_Scope')**.

2. The condition for **Filter Array** is any **@result()** item that has a status equal to **Failed**. 
This condition filters the array of all the action results from "My_Scope" down to an array with 
only failed action results.

3. Perform a **For Each** loop action on the *filtered array* outputs. 
This step performs an action *for each* failed action result that was previously filtered.

   If a single action in the scope failed, 
   the actions in the **foreach** run only once. 
   Multiple failed actions cause one action per failure.

4. Send an HTTP POST on the **foreach** item response body, which is **@item()['outputs']['body']**. 
The **@result()** item shape is the same as the **@actions()** shape and can be parsed the same way.

5. Include two custom headers with the failed action name **@item()['name']** 
and the failed run client tracking ID **@item()['clientTrackingId']**.

For reference, here's an example of a single **@result()** item, 
showing the **name**, **body**, and **clientTrackingId** properties that are parsed in the previous example. 
Outside of a **foreach** action, **@result()** returns an array of these objects.

```json
{
    "name": "Example_Action_That_Failed",
    "inputs": {
        "uri": "https://myfailedaction.azurewebsites.net",
        "method": "POST"
    },
    "outputs": {
        "statusCode": 404,
        "headers": {
            "Date": "Thu, 11 Aug 2016 03:18:18 GMT",
            "Server": "Microsoft-IIS/8.0",
            "X-Powered-By": "ASP.NET",
            "Content-Length": "68",
            "Content-Type": "application/json"
        },
        "body": {
            "code": "ResourceNotFound",
            "message": "/docs/folder-name/resource-name does not exist"
        }
    },
    "startTime": "2016-08-11T03:18:19.7755341Z",
    "endTime": "2016-08-11T03:18:20.2598835Z",
    "trackingId": "bdd82e28-ba2c-4160-a700-e3a8f1a38e22",
    "clientTrackingId": "08587307213861835591296330354",
    "code": "NotFound",
    "status": "Failed"
}
```

To perform different exception handling patterns, 
you can use the expressions previously described in this article. 
You might choose to execute a single exception handling action outside the scope 
that accepts the entire filtered array of failures, and remove the **foreach** action. 
You can also include other useful properties from the **@result()** response as previously described.

## Azure Diagnostics and telemetry

The previous patterns are great way to handle errors and exceptions within a run, 
but you can also identify and respond to errors independent of the run itself. 
[Azure Diagnostics](../logic-apps/logic-apps-monitor-your-logic-apps.md) provides 
a simple way to send all workflow events, including all run and action statuses, 
to an Azure Storage account or an event hub created with Azure Event Hubs. 

To evaluate run statuses, you can monitor the logs and metrics, 
or publish them into any monitoring tool that you prefer. 
One potential option is to stream all the events through Event Hubs into 
[Azure Stream Analytics](https://azure.microsoft.com/services/stream-analytics/). 
In Stream Analytics, you can write live queries based on any anomalies, 
averages, or failures from the diagnostic logs. You can use Stream Analytics to send 
information to other data sources, such as queues, topics, SQL, Azure Cosmos DB, or Power BI.

## Next steps

* [See how a customer builds error handling with Azure Logic Apps](../logic-apps/logic-apps-scenario-error-and-exception-handling.md)
* [Find more Logic Apps examples and scenarios](../logic-apps/logic-apps-examples-and-scenarios.md)

<!-- References -->
[retryPolicyMSDN]: https://docs.microsoft.com/rest/api/logic/actions-and-triggers#Anchor_9