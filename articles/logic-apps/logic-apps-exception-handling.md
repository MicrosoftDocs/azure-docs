---
title: Error and exception handling for Logic Apps in Azure | Microsoft Docs
description: Patterns for error and exception handling in the Logic Apps feature of Azure App Service.
services: logic-apps
documentationcenter: .net,nodejs,java
author: jeffhollan
manager: anneta
editor: ''

ms.assetid: e50ab2f2-1fdc-4d2a-be40-995a6cc5a0d4
ms.service: logic-apps
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: integration
ms.date: 10/18/2016
ms.author: LADocs; jehollan

---
# Handle errors and exceptions in Logic Apps

The Logic Apps feature of Azure App Service provides rich tools and patterns to help you ensure that your integrations are robust and resilient against failures. Any integration architecture poses the challenge of appropriately handling downtime or issues from dependent systems. Logic Apps makes handling errors a first-class experience. It gives you the tools you need to act on exceptions and errors in your workflows.

## Retry policies

A retry policy is the most basic type of exception and error handling. If an initial request times out or fails (any request that results in a 429 or 5xx response), a retry policy defines if and how the action should retry. 

There are three types of retry policies: exponential, fixed, and none. If a retry policy is not provided in the workflow definition, the default policy is used. 

You can configure retry policies in the *inputs* for a particular action or trigger if it is retryable. Similarly, you can configure retry policies (if applicable) in Logic App Designer. To set up a retry policy, in Logic App Designer, go to **Settings** for a specific block.

For information about the limitations of retry policies, see [Logic Apps limits and configuration](../logic-apps/logic-apps-limits-and-config.md). For more information about supported syntax, see the [retry policy section in Workflow Actions and Triggers][retryPolicyMSDN].

### Exponential interval
The exponential policy type retries a failed request after a random time interval from an exponentially growing range. Each retry attempt is guaranteed to be sent at a random interval that is greater than **minimumInterval** and less than **maximumInterval**. A uniform random variable in the range indicated in the following table is generated for each retry up to and including **count**:

**Random variable range**

| Retry number | Minimum interval | Maximum interval |
| ------------ |  ------------ |  ------------ |
| 1 | Max(0, **minimumInterval**) | Min(interval, **maximumInterval**) |
| 2 | Max(interval, **minimumInterval**) | Min(2 * interval, **maximumInterval**) |
| 3 | Max(2 * interval, **minimumInterval**) | Min(4 * interval, **maximumInterval**) |
| 4 | Max(4 * interval, **minimumInterval**) | Min(8 * interval, **maximumInterval**) |
| ... |

For exponential type policies, **count** and **interval** are required. Values for **minimumInterval** and **maximumInterval** are optional. You can add them to override the default values of PT5S and PT1D, respectively.

| Element name | Required | Type | Description |
| ------------ | -------- | ---- | ----------- |
| type | Yes | String | **exponential** |
| count | Yes | Integer | Number of retry attempts. Must be between 1 and 90.  |
| interval | Yes | String | Retry interval in [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations). Must be between PT5S and PT1D. |
| minimumInterval | No | String | Retry minimum interval in [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations). Must be between PT5S and **interval**. |
| maximumInterval | No | String | Retry minimum interval in [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations). Must be between **interval** and PT1D. |

### Fixed interval

The fixed retry policy type retries a failed request by waiting the specified interval of time before sending the next request.

| Element name | Required | Type | Description |
| ------------ | -------- | ---- | ----------- |
| type | Yes | String | **fixed** |
| count | Yes | Integer | Number of retry attempts. Must be between 1 and 90. |
| interval | Yes | String | Retry interval in [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations). Must be between PT5S and PT1D. |

### None
If the retry policy is set to **none**, a failed request is not retried.

| Element name | Required | Type | Description |
| ------------ | -------- | ---- | ----------- |
| type | Yes | String | **none** |

### Default
If you don't define a retry policy, the default policy is used. The default policy is an exponential interval policy that sends up to four retries, at exponentially increasing intervals scaled by 7.5 seconds. The interval is capped at between 5 and 45 seconds. This default policy (used when **retryPolicy** is undefined) is equivalent to the policy in this example HTTP workflow definition:

```json
"HTTP":
{
    "inputs": {
        "method": "GET",
        "uri": "http://myAPIendpoint/api/action",
        "retryPolicy" : {
            "type": "exponential",
            "count": 4,
            "interval": "PT7.5S",
            "minimumInterval": "PT5S",
            "maximumInterval": "PT45S"
        }
    },
    "runAfter": {},
    "type": "Http"
}
```

## Catch failures with the runAfter property

Each logic app action declares which actions must finish before the action starts. It's similar to ordering the steps in your workflow. In the action definition, this ordering is known as the **runAfter** property. 

The **runAfter** property is an object that describes which actions and action statuses execute the action. By default, all actions that you added by using Logic App Designer are set to run after the preceding step, if the preceding step result is **Succeeded**. 

However, you can customize the **runAfter** value to fire actions when preceding actions have a result of **Failed**, **Skipped**, or a possible set of these values. If you want to add an item to a designated Azure Service Bus topic after a specific action **Insert_Row** fails, you could use the following **runAfter** configuration:

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

Note that **runAfter** is set to fire if the **Insert_Row** action result is **Failed**. To run the action if the action status is **Succeeded**, **Failed**, or **Skipped**, use this syntax:

```json
"runAfter": {
        "Insert_Row": [
            "Failed", "Succeeded", "Skipped"
        ]
    }
```

> [!TIP]
> Actions that run and finish successfully after a preceding action has failed are marked as **Succeeded**. This means that if you successfully catch all failures in a workflow, the run itself is marked as **Succeeded**.

## Scopes and results to evaluate actions

You can group actions together inside a [scope](../logic-apps/logic-apps-loops-and-scopes.md), similar to the way you run after individual actions. A scope acts a logical grouping of actions. 

Scopes are useful, both for organizing your Logic App actions, and for performing aggregate evaluations on the status of a scope. The scope itself receives a status after all actions in a scope have finished. The scope status is determined with the same criteria as a run. If the final action in an execution branch is **Failed** or **Aborted**, the status is **Failed**.

To fire specific actions for any failures that occurred within the scope, you can use **runAfter** with a scope that is marked **Failed**. If *any* actions in the scope fail, if you use **runAfter** for a scope, you can create a single action to catch failures.

### Get the context of failures with results

Although catching failures from a scope is useful, you might also want context to help you understand exactly which actions failed, and to understand any errors or status codes that were returned. The **@result()** workflow function provides context about the result of all actions in a scope.

The **@result()** function takes a single parameter (scope name) and returns an array of all the action results from within that scope. These action objects include the same attributes as the **@actions()** object, including action start time, action end time, action status, action inputs, action correlation IDs, and action outputs. 

To send context of any actions that failed within a scope, you can easily pair an **@result()** function with a **runAfter** property.

To execute an action *for each* action in a scope that has a **Failed** result, and to filter the array of results to actions that failed, you can pair **@result()** with a [Filter_array](../connectors/connectors-native-query.md) action and a [foreach](../logic-apps/logic-apps-loops-and-scopes.md) loop. With the filtered result array, you can perform an action for each failure by using the **foreach** loop. 

Here's an example that sends an HTTP POST request with the response body of any actions that failed in the scope My_Scope:

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

Here's a detailed walkthrough to describe what happens in the preceding example:

1. To get the result of all actions within My_Scope, the **Filter_array** action filters **@result('My_Scope')**.

2. The condition for **Filter_array** is any **@result()** item that has a status equal to **Failed**. This condition filters the array from all action results from My_Scope, to an array with only failed action results.

3. Perform a **foreach** action on the *filtered array* outputs. This step performs an action *for each* failed action result that was previously filtered.

	If a single action in the scope failed, the actions in the **foreach** run only once. Multiple failed actions cause one action per failure.

4. Send an HTTP POST on the **foreach** item response body, or **@item()['outputs']['body']**. The **@result()** item shape is the same as the **@actions()** shape. It can be parsed the same way.

5. Include two custom headers with the failed action name **@item()['name']** and the failed run client tracking ID **@item()['clientTrackingId']**.

For reference, here's an example of a single **@result()** item. It shows the **name**, **body**, and **clientTrackingId** properties that are parsed in the preceding example. Outside a **foreach** action, **@result()** returns an array of these objects.

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

For different exception handling patterns, you can use the expressions described earlier in the article. You might choose to execute a single exception handling action outside the scope that accepts the entire filtered array of failures, and remove the **foreach**. You can also include other useful properties from the **@result()** response, as described earlier.

## Azure Diagnostics and telemetry

The patterns described in this article provide great ways to handle errors and exceptions inside a run, but you can also identify and respond to errors independent of the run itself. [Azure Diagnostics](../logic-apps/logic-apps-monitor-your-logic-apps.md) provides a simple way to send all workflow events (including all run and action statuses) to an Azure storage account or to an event hub in Azure Event Hubs. 

To evaluate run statuses, you can monitor logs and metrics, or publish them to any monitoring tool that you prefer. A potential option is to stream all the events through Event Hubs to [Azure Stream Analytics](https://azure.microsoft.com/services/stream-analytics/). In Stream Analytics, you can write live queries based on any anomalies, averages, or failures from the diagnostic logs. You can use Stream Analytics to send information to other data sources, like to queues, topics, SQL, Azure Cosmos DB, or Power BI.

## Next steps

* See how a customer [builds error handling with Logic Apps in Azure](../logic-apps/logic-apps-scenario-error-and-exception-handling.md).
* Find more [Logic Apps examples and scenarios](../logic-apps/logic-apps-examples-and-scenarios.md).
* Learn how to create [automated deployments for logic apps](../logic-apps/logic-apps-create-deploy-template.md).
* Learn how to [build and deploy logic apps with Visual Studio](logic-apps-deploy-from-vs.md).

<!-- References -->
[retryPolicyMSDN]: https://docs.microsoft.com/rest/api/logic/actions-and-triggers#Anchor_9
