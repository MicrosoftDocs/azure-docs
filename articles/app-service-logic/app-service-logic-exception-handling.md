<properties
   pageTitle="Logic Apps Exception Handling | Microsoft Azure"
   description="Learn patterns for error and exception handling with Azure Logic Apps"
   services="logic-apps"
   documentationCenter=".net,nodejs,java"
   authors="jeffhollan"
   manager="erikre"
   editor=""/>

<tags
   ms.service="logic-apps"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration"
   ms.date="08/10/2016"
   ms.author="jehollan"/>

# Logic Apps Error and Exception Handling

Logic Apps provides a rich set of tools and patterns to help ensure your integrations are robust and resilient against failures.  One of the challenges with any architecture hosted in the cloud is ensuring that downtime or issues are appropriately handled to preserve downstream systems and processes.  Logic Apps makes these a first class experience so you can better act and react on exceptions and errors within your workflows.

## Retry policies

The most basic type of exception and error handling is a retry-policy.  This is a configurable policy per action on if the engine should retry an action that timed out or failed (any request that resulted in a 429 or 5xx response).  By default, all actions retry 3 additional times over 20 second increments.  So if the first request received a `500 Internal Server Error` response, the workflow engine pauses for 20 seconds, and attempt the request again (up to 3xs).  If after all retries the response is still an exception or failure, the workflow will continue and mark the action status as `Failed`.

You can configure retry policies in the definition of your workflow in the **inputs** of a particular action.  Full details on the input properties can be [found on MSDN][retryPolicyMSDN].

```json
"retryPolicy" : {
      "type": "<type-of-retry-policy>",
      "interval": <retry-interval>,
      "count": <number-of-retry-attempts>
    }
```
For example if you wanted your HTTP action to retry 4 times and wait 10 minutes between each attempt you would have the following definition:

```json
"HTTP": 
{
    "inputs": {
        "method": "GET",
        "uri": "http://myAPIendpoint/api/action",
        "retryPolicy" : {
            "type": "fixed",
            "interval": "PT10M",
            "count": 4
        }
    },
    "runAfter": {},
    "type": "Http"
}
```

For more details on supported syntax, view the [retry-policy section on MSDN][retryPolicyMSDN].

## RunAfter property to catch failures

Each logic app action has an indicator on what actions it should run after.  This is known as the `runAfter` property in the action definition.  It is an object that lists the different actions and the possible action statuses that would execute the action.  By default all actions add in the designer are set to `runAfter` the previous step if the previous step was `Succeeded`.  However you can customize this value to fire actions to fire if previous actions are `Failed`, `Skipped`, or a possible set of these values.  So if you want to make sure you add an item to a designated Service Bus topic after a specific action `Insert_Row` fails, you could use the following `runAfter` configuration:

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

Notice the `runAfter` property is set to if the `Insert_Row` action is `Failed`.  You could make this an array of acceptable values.  To run the action if the action status is `Succeeded`, `Failed`, or `Skipped` the syntax would be:

```json
"runAfter": {
        "Insert_Row": [
            "Failed", "Succeeded", "Skipped"
        ]
    }
```

>[AZURE.TIP] Actions that run after a preceding action have failed, and complete successfully, will be marked as `Succeeded`.  This means if you successfully catch any failures in a workflow the run itself will still be marked as `Succeeded`.

## Scopes and results to evaluate actions

Similar to how you can run after individual actions, you can also group actions together inside of a [scope](app-service-logic-loops-and-scopes.md) - which act as a logical grouping of actions.  This can be useful both for organizing your logic app actions, but also for performing aggregate evaluations on the status of a scope.  The scope itself will receive a status after all the actions within a scope have completed.  The scope status will be determined using the same status as a run -- if the final action in an execution branch is `Failed` or `Aborted` the status will be `Failed`.

You can use the `runAfter` a scope has been marked `Failed` to fire specific actions for any failures.  This allows you to create a single action to catch failures if *any* actions fail.

### Getting the context of failures with resulted

Catching failures from a scope is very useful, but the one item that is missing is the context to understand exactly which action failed and any errors or status codes returned.  The `@result()` workflow function can bring that context into an action after a scope.

`@result()` takes a single parameter, scope name, and returns an array of all the action objects from within that scope.  These action objects include the same attributes as any `@actions()` object, including action start time, action end time, action status, action inputs, and action outputs.  You can then easily pair an `@result()` function with a `runAfter` failures to send any context on which actions failed.

If you only wanted to perform actions for each action in a scope that `Failed`, you can pair `@result()` with a **[Filter Array](../connectors/connectors-native-query.md)** action and a **[ForEach](app-service-logic-loops-and-scopes.md)** loop.  This would allow you to filter the array of all action results down to only actions that failed, and then perform an action for each failure.  Here's an example of a that pattern below, followed by a detailed explanation.  This example will send an HTTP POST request with the response body of any actions that failed within the scope `My_Scope`.

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
                }
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

Here's a detailed walkthrough of what's happening:

1. **Filter Array** action to filter the `@result('My_Scope')` to get the result of all actions within `My_Scope`
1. Condition of the **Filter Array** is any `@result()` item with the status equal to `Failed`.  This will filter the array of all action results from `My_Scope` to only an array of failed action results.
1. Perform a **For Each** action on the **Filtered Array** outputs.  This will perform an action *for each* failed action result we filtered above.
    - If there was a single action in the scope that failed, the actions in the `foreach` would only run once.  Many failed actions would cause one action per failure.
1. Send an HTTP POST on the `foreach` item response body, or `@item()['outputs']['body']`.  The `@result()` item shape is the same as the `@actions()` shape, and can be parsed the same way.
1. Also included two custom headers with the failed action name `@item()['name']` and the failed run client tracking ID `@item()['clientTrackingId']`.

For reference, here is an example of a single `@result()` item.  You can see the `name`, `body`, and `clientTrackingId` properties parsed in the example above.  It should be noted that outside of a `foreach`, `@result()` returns an array of these objects.

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
            "message": "/docs/foo/bar does not exist"
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

You could use the expressions above to perform different exception handling patterns.  You may choose to just have one failure action outside the scope that accepts the entire filtered array of failures and remove the `foreach`.  You could also include other useful properties from the `@result()` response above.

## Azure Diagnostics and telemetry

The patterns above are great way to handle errors and exceptions within a run, but you can also identify and respond to errors independent of the run itself.  [Azure Diagnostics](app-service-logic-monitor-your-logic-apps.md) provides a simple way to send all workflow events (including all run and action statuses) to an Azure Storage account or Azure Event Hub.  You can then monitor the logs, or publish them into any monitoring tool you prefer, to evaluate run statuses.  One potential option is to stream all the events through Azure Event Hub into [Stream Analytics](https://azure.microsoft.com/en-us/services/stream-analytics/) and there could write live queries off of any anomalies, averages, or failures.  Stream Analytics can easily be outputted to other data sources like queues, topics, SQL, DocumentDB, and Power BI.

## Next Steps
- [See how one customer built robust error handling with Logic Apps](app-service-logic-scenario-error-and-exception-handling.md)
- [Find more Logic Apps examples and scenarios](app-service-logic-examples-and-scenraios.md)
- [Learn how to create automated deployments of logic apps](app-service-logic-create-deploy-template.md)
- [Design and deploy logic apps from Visual Studio](app-service-logic-deploy-from-vs.md)


<!-- References -->
[retryPolicyMSDN]: https://msdn.microsoft.com/library/azure/mt643939.aspx#Anchor_9