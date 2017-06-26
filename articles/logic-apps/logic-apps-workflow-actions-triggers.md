---
title: Workflow actions and triggers - Azure Logic Apps | Microsoft Docs
description: 
services: logic-apps
author: MandiOhlinger
manager: anneta
editor: ''
documentationcenter: ''

ms.assetid: 86a53bb3-01ba-4e83-89b7-c9a7074cb159
ms.service: logic-apps
ms.workload: integration
ms.tgt_pltfrm: na
ms.devlang: multiple
ms.topic: article
ms.date: 11/17/2016
ms.author: mandia
---

# Workflow actions and triggers for Azure Logic Apps

Logic apps consist of triggers and actions. There are six types of triggers. 
Each type has different interface and different behavior. 
You can also learn about other details by looking at the details of the 
[Workflow Definition Language](logic-apps-workflow-definition-language.md).  
  
Read on to learn more about triggers and actions and how you might use them 
to build logic apps to improve your business processes and workflows.  
  
### Triggers  

A trigger specifies the calls that can initiate a run of your logic app workflow. 
Here are the two different ways to initiate a run of your workflow:  
  
-   A polling trigger  

-   A push trigger - by calling the 
[Workflow Service REST API](https://docs.microsoft.com/rest/api/logic/workflows)  
  
All triggers contain these top-level elements:  
  
```json
"<name-of-the-trigger>" : {
    "type": "<type-of-trigger>",
    "inputs": { <settings-for-the-call> },
    "recurrence": {  
        "frequency": "Second|Minute|Hour|Week|Month|Year",
        "interval": "<recurrence interval in units of frequency>"
    },
    "conditions": [ <array-of-required-conditions > ],
    "splitOn" : "<property to create runs for>",
    "operationOptions": "<operation options on the trigger>"
}
```

### Trigger types and their inputs  

You can use these types of triggers:
  
-   **Request** \- Makes the logic app an endpoint for you to call  
  
-   **Recurrence** \- Fires based on a defined schedule  
  
-   **HTTP** \- Polls an HTTP web endpoint. The HTTP endpoint must conform to a specific triggering contract \- either by using a 202\-async pattern, or by returning an array  
  
-   **ApiConnection** \- Polls like the HTTP trigger, however, it takes advantage of the [Microsoft-managed APIs](https://docs.microsoft.com/azure/connectors/apis-list)  
  
-   **HTTPWebhook** \- Opens an endpoint, similar to the Manual trigger, however, it also calls out to a specified URL to register and unregister  
  
-   **ApiConnectionWebhook** \- Operates like the HTTPWebhook trigger by taking advantage of the Microsoft-managed APIs       
    Each trigger type has a different set of **inputs** that defines its behavior.  
  
## Request trigger  

This trigger serves as an endpoint that you call via an HTTP Request to invoke your logic app. 
A request trigger looks like this example:  
  
```json
"<name-of-the-trigger>" : {
    "type" : "request",
    "kind": "http",
    "inputs" : {
        "schema" : {
            "properties" : {
                "myInputProperty1" : { "type" : "string" },
                "myInputProperty2" : { "type" : "number" }
            },
        "required" : [ "myInputProperty1" ],
        "type" : "object"
        }
    }
} 
```

There is also an optional property called **schema**:  
  
|Element name|Required|Description|  
|----------------|------------|---------------|  
|schema|No|A JSON schema that validates the incoming request. Useful for helping subsequent workflow steps know which properties to reference.|

To invoke this endpoint, you need to call the *listCallbackUrl* API. See 
[Workflow Service REST API](https://docs.microsoft.com/rest/api/logic/workflows).  
  
## Recurrence trigger  

A Recurrence trigger is one that runs based on a defined schedule. Such a trigger might look like this example:  

```json
"dailyReport" : {
    "type": "recurrence",
    "recurrence": {
        "frequency": "Day",
        "interval": "1"
    }
}
```

As you can see, it is a simple way to run a workflow.  
  
|Element name|Required|Description|  
|----------------|------------|---------------|  
|frequency|Yes|How often the trigger executes. Use only one of these possible values: second, minute, hour, day, week, month, or year|  
|interval|Yes|Interval of the given frequency for the recurrence|  
|startTime|No|If a startTime is provided without a UTC offset, this timeZone is used.|  
|timeZone|no|If a startTime is provided without a UTC offset, this timeZone is used.|  
  
You can also schedule a trigger to start executing at some point in the future. 
For example, if you want to start a weekly report every Monday you can schedule 
the logic app to start every Monday by creating the following trigger:  

```json
"dailyReport" : {
    "type": "recurrence",
    "recurrence": {
        "frequency": "Week",
        "interval": "1",
        "startTime" : "2015-06-22T00:00:00Z"
    }
}
```

## HTTP trigger  

HTTP triggers poll a specified endpoint and check the response to determine whether the workflow should be executed. 
The inputs object takes the set of parameters required to construct an HTTP call:  
  
|Element name|Required|Description|Type|  
|----------------|------------|---------------|--------|  
|method|yes|Can be one of the following HTTP methods: GET, POST, PUT, DELETE, PATCH, or HEAD|String|  
|uri|yes|The http or https endpoint that is called. Maximum of 2 kilobytes.|String|  
|queries|No|An object representing the query parameters to add to the URL. For example, `"queries" : { "api-version": "2015-02-01" }` adds `?api-version=2015-02-01` to the URL.|Object|  
|headers|No|An object representing each of the headers that is sent to the request. For example, to set the language and type on a request: `"headers" : { "Accept-Language": "en-us",  "Content-Type": "application/json" }`|Object|  
|body|No|An object representing the payload that is sent to the endpoint.|Object|  
|retryPolicy|No|An object that lets you customize the retry behavior for 4xx or 5xx errors.|Object|  
|authentication|No|Represents the method that the request should be authenticated. For details on this object, see [Scheduler Outbound Authentication](https://docs.microsoft.com/azure/scheduler/scheduler-outbound-authentication). Beyond scheduler, there is one more supported property: `authority` By default, this value is `https://login.windows.net` when not specified, but you can use a different audience like `https://login.windows\-ppe.net`|Object|  
  
The HTTP trigger requires the HTTP API to conform with a specific pattern to work well with your logic app. 
It requires the following fields:  
  
|Response|Description|  
|------------|---------------|  
|Status code|Status code 200 \(OK\) to cause a run. Any other status code doesn't cause a run.|  
|Retry\-after header|Number of seconds until the logic app polls the endpoint again.|  
|Location header|The URL to call on the next polling interval. If not specified, the original URL is used.|  
  
Here are some examples of different behaviors for different types of requests:  
  
|Response code|Retry\-After|Behavior|  
|-----------------|----------------|------------|  
|200|\(none\)|Not a valid trigger, Retry\-After is required, or else the engine never polls for the next request.|  
|202|60|Do not trigger the workflow. The next attempt happens in one minute.|  
|200|10|Run the workflow, and check again for more content in 10 seconds.|  
|400|\(none\)|Bad request, do not run the workflow. If there is no **Retry Policy** defined, then the default policy is used. After the number of retries has been reached, the trigger is no longer valid.|  
|500|\(none\)|Server error, do not run the workflow.  If there is no **Retry Policy** defined, then the default policy is used. After the number of retries has been reached, the trigger is no longer valid.|  
  
The outputs of an HTTP trigger look like this example:  
  
|Element name|Description|Type|  
|----------------|---------------|--------|  
|headers|The headers of the http response.|Object|  
|body|The body of the http response.|Object|  
  
## API Connection trigger  

The API connection trigger is similar to the HTTP trigger in its basic functionality. 
However, the parameters for identifying the action are different. Here is an example:  
  
```json
"dailyReport" : {
    "type": "ApiConnection",
    "inputs": {
        "host": {
            "api": {
                "runtimeUrl": "https://myarticles.example.com/"
            },
        }
        "connection": {
            "name": "@parameters('$connections')['myconnection'].name"
        }
    },  
    "method": "POST",
    "body": {
        "category": "awesomest"
    }
}
```

|Element name|Required|Type|Description|  
|----------------|------------|--------|---------------|  
|host|Yes||The ApiApp hosted gateway and id.|  
|method|Yes|String|Can be one of the following HTTP methods: **GET**, **POST**, **PUT**, **DELETE**, **PATCH**, or **HEAD**|  
|queries|No|Object|Represents the query parameters to be added to the URL. For example, `"queries" : { "api-version": "2015-02-01" }` adds `?api-version=2015-02-01` to the URL.|  
|headers|No|Object|Represents each of the headers that is sent to the request. For example, to set the language and type on a request: `"headers" : { "Accept-Language": "en-us",  "Content-Type": "application/json" }`|  
|body|No|Object|Represents the payload that is sent to the endpoint.|  
|retryPolicy|No|Object|Allows you to customize the retry behavior for 4xx or 5xx errors.|  
|authentication|No|Object|Represents the method that the request should be authenticated. For details on this object, see [Scheduler Outbound Authentication](https://docs.microsoft.com/azure/scheduler/scheduler-outbound-authentication)|  
  
The properties for host are:  
  
|Element name|Required|Description|  
|----------------|------------|---------------|  
|api runtimeUrl|Yes|The endpoint of the managed API.|  
|connection name||Must be a reference to a parameter called `$connection` and is the name of the managed API connection that the workflow uses.|
  
The outputs of an API connection trigger are:
  
|Element name|Type|Description|  
|----------------|--------|---------------|  
|headers|Object|The headers of the http response.|  
|body|Object|The body of the http response.|  
  
## HTTPWebhook trigger  

The HTTPWebhook trigger opens an endpoint, similar to the manual trigger, 
but the HTTPWebhook trigger also calls out to a specified URL to register and unregister. 
Here's an example of what an HTTPWebhook trigger might look like:  

```json
"myappspottrigger": {
    "type": "httpWebhook",
    "inputs": {
        "subscribe": {
            "method": "POST",
            "uri": "https://pubsubhubbub.appspot.com/subscribe",
            "headers": { },
            "body": {
                "hub.callback": "@{listCallbackUrl()}",
                "hub.mode": "subscribe",
                "hub.topic": "https://pubsubhubbub.appspot.com/articleCategories/technology"
            },
            "authentication": { },
            "retryPolicy": { }
        },
        "unsubscribe": {
            "url": "https://pubsubhubbub.appspot.com/subscribe",
            "body": {
                "hub.callback": "@{workflow().endpoint}@{listCallbackUrl()}",
                "hub.mode": "unsubscribe",
                "hub.topic": "https://pubsubhubbub.appspot.com/articleCategories/technology"
            },
            "method": "POST",
            "authentication": { }
        }
    },
    "conditions": [ ]
    }
```

Many of these sections are optional, and the behavior of the Webhook depends on which sections are provided or omitted.  
The properties of a Webhook are as follows:  
  
|Element name|Required|Description|  
|----------------|------------|---------------|  
|subscribe|No|The outgoing request that is called when the trigger is created and performs the initial registration.|  
|unsubscribe|No|The outgoing request when the trigger is deleted.|  
  
-   **Subscribe** is the outgoing call that's made to start listening to events. This call starts with the same set of parameters that the normal HTTP actions do. This outgoing call is made any time the workflow changes in any way, for example, whenever the credentials are rolled, or the trigger's input parameters change.
  
    To support this call, there is a new function: `@listCallbackUrl()`. This function returns a unique URL for this specific trigger in this workflow. It represents the unique identifier for the endpoints that use the Service REST.  
  
-   **Unsubscribe** is called when an operation renders this trigger invalid, including:  
  
    -   Deleting or disabling the trigger  
  
    -   Deleting or disabling the workflow  
  
    -   Deleting or disabling the subscription  
  
    The logic app automatically calls the unsubscribe action. The parameters to this function are the same as the HTTP trigger.  
  
    The outputs of the HTTPWebhook trigger are the contents of the incoming request:  
  
|Element name|Type|Description|  
|-----------------|--------|---------------|  
|headers|Object|The headers of the http request.|  
|body|Object|The body of the http request.|  

Limits on a webhook action can be specified in the same manner as [HTTP Asynchronous Limits](#asynchronous-limits).
  

## Conditions  

For any trigger, you can use one or more conditions to determine whether the workflow should run or not. For example:  

```json
"dailyReport" : {
    "type": "recurrence",
    "conditions": [ {
        "expression": "@parameters('sendReports')"
    } ],
    "recurrence": {
        "frequency": "Day",
        "interval": "1"
    }
}
```

In this case, the report only triggers while the workflow's `sendReports` parameter is set to true. 
Finally, conditions may reference the status code of the trigger. For example, 
you could kick off a workflow only when your website returns a status code 500, as follows:
  
```  
"conditions": [  
        {  
          "expression": "@equals(triggers().code, 'InternalServerError')"  
        }  
      ]  
```  
  
> [!NOTE]  
> When any expression references the status code of the trigger \(in any way\), 
> the default behavior \(trigger only on 200 \(OK\)\) is replaced. 
> For example, if you want to trigger on both status code 200 and status code 201, 
> you have to include: `@or(equals(triggers().code, 200),equals(triggers().code,201))` as your condition.  
  
## Start multiple runs for a request

To kick off multiple runs for a single request, `splitOn` is useful, for example, 
when you want to poll an endpoint that can have multiple new items between polling intervals.
  
With `splitOn`, you specify the property inside the response payload that contains the array of items, 
each of which you want to use to start a run of the trigger. For example, 
imagine you have an API that returns the following response:  
  
```json
{
    "Status" : "success",
    "Rows" : [
        {  
            "id" : 938109380,
            "name" : "mycoolrow"
        },
        {
            "id" : 938109381,
            "name" : "another row"
        }
    ]
}
```
  
Your logic app only needs the Rows content, so you can construct your trigger like this example:  
  
```json
"mysplitter" : {
    "type" : "http",
    "recurrence": {
        "frequency": "Minute",
        "interval": "1"
    },
    "intputs" : {
        "uri" : "https://mydomain.com/myAPI",
        "method" : "GET"
    },
    "splitOn" : "@triggerBody()?.Rows"
}
```
  
Then, in the workflow definition, `@triggerBody().name` returns `mycoolrow` for the first run, 
and `another row` for the second run. The trigger outputs look like this example:  
  
```json
{
    "body" : {
        "id" : 938109381,
        "name" : "another row"
    }
}
```

So if you use `SplitOn`, you can't get the properties that are outside the array, 
in this case, the `Status` field.  
  
> [!NOTE]  
> In this example, we use the `?` operator to be able to avoid a failure if the `Rows` property is not present. 
  
## Single run instance

You can configure triggers that have a recurrence property to only fire if all active runs have completed. 
If a scheduled recurrence occurs while there is an in-progress run, 
the trigger skips and waits until the next scheduled recurrence interval to check again.

You can configure this setting through the operation options:

```json
"triggers": {
    "mytrigger": {
        "type": "http",
        "inputs": { ... },
        "recurrence": { ... },
        "operationOptions": "singleInstance"
    }
}
```

## Types and inputs  

There are many types of actions, each with unique behavior. 
Collection actions may contain many other actions within itself.

### Standard actions  

-   **HTTP** This action calls an HTTP web endpoint.  
  
-   **ApiConnection** \- This action behaves like the HTTP action, but uses the Microsoft-managed APIs.  
  
-   **ApiConnectionWebhook** \- Like HTTPWebhook, but uses the Microsoft-managed APIs.  
  
-   **Response** \- This action defines a response for an incoming call.  
  
-   **Wait** \- This simple action waits a fixed amount of time or until a specific time.  
  
-   **Workflow** \- This action represents a nested workflow.  

-   **Function** \- This action represents an Azure Function.

### Collection actions

-   **Scope** \- This action is a logical grouping of other actions.

-   **Condition** \- This action evaluates an expression and executes the corresponding result branch.

-   **ForEach** \- This looping action iterates through an array and performs inner actions for each item.

-   **Until** \- This looping action executes inner actions until a condition results to true.
  
Each type of action has a different set of **inputs** that define an action's behavior.  
  
## HTTP action  

HTTP actions call a specified endpoint and check the response to determine whether the workflow should run. 
The **inputs** object takes the set of parameters required to construct the HTTP call:  
  
|Element name|Required|Type|Description|  
|----------------|------------|--------|---------------|  
|method|Yes|String|Can be one of the following HTTP methods: **GET**, **POST**, **PUT**, **DELETE**, **PATCH**, or **HEAD**|  
|uri|Yes|String|The http or https endpoint that is called. Maximum length is 2 kilobytes.|  
|queries|No|Object|Represents the query parameters to add to the URL. For example, `"queries" : { "api-version": "2015-02-01" }` adds `?api-version=2015-02-01` to the URL.|  
|headers|No|Object|Represents each of the headers that is sent to the request. For example, to set the language and type on a request: `"headers" : { "Accept-Language": "en-us",  "Content-Type": "application/json" }`|  
|body|No|Object|Represents the payload that is sent to the endpoint.|  
|retryPolicy|No|Object|Lets you customize the retry behavior for 4xx or 5xx errors.|  
|operationsOptions|No|String|Defines the set of special behaviors to override.|  
|authentication|No|Object|Represents the method that the request should be authenticated. For details on this object, see [Scheduler Outbound Authentication](https://docs.microsoft.com/azure/scheduler/scheduler-outbound-authentication). Beyond scheduler, there is one more supported property: `authority`. By default, this is `https://login.windows.net` when not specified, but you can use a different audience like `https://login.windows\-ppe.net`|  
  
HTTP actions \(and API Connection\) actions support retry policies. 
A retry policy applies to intermittent failures, characterized as HTTP status codes 408, 429, and 5xx, 
in addition to any connectivity exceptions. 
This policy is described using the *retryPolicy* object defined as shown here:
  
```json
"retryPolicy" : {
    "type": "<type-of-retry-policy>",
    "interval": <retry-interval>,
    "count": <number-of-retry-attempts>
}
```
  
The retry interval is specified in the ISO 8601 format. 
This interval has a default and minimum value of 20 seconds, 
while the maximum value is one hour. The default and maximum retry count is four hours. 
If the retry policy definition is not specified, a `fixed` strategy 
is used with default retry count and interval values. 
To disable the retry policy, set its type to `None`.  
  
For example, the following action retries fetching the latest news two times, 
if there are intermittent failures, for a total of three executions, with a 30-second delay between each attempt:  
  
```json
"latestNews" : {
    "type": "http",
    "inputs": {
        "method": "GET",
        "uri": "https://mynews.example.com/latest",
        "retryPolicy" : {
            "type": "fixed",
            "interval": "PT30S",
            "count": 2
        }
    }
}
```
### Asynchronous patterns

By default, all HTTP-based actions support the standard asynchronous operation pattern. 
So if the remote server indicates that the request is accepted for processing 
with a 202 \(Accepted\) response, the Logic Apps engine keeps polling the URL specified 
in the response's location header until reaching a terminal state \(a non\-202 response\).  
  
To disable the asynchronous behavior previously described, 
set a `DisableAsyncPattern` option in the action inputs. In this case, 
the output of the action is based on the initial 202 response from the server.  
  
```json
"invokeLongRunningOperation" : {
    "type": "http",
    "inputs": {
        "method": "POST",
        "uri": "https://host.example.com/resources"
    },
    "operationOptions": "DisableAsyncPattern"
}
```

#### Asynchronous Limits

An asynchronous pattern can be limited in its duration to a specific time interval.  If the time interval elapses without reaching a terminal state, the status of the action will be marked `Cancelled` with a code of `ActionTimedOut`.  The limit timeout is specified in ISO 8601 format.  Limits can be specified with the following syntax:

``` json
"<action-name>": {
    "type": "workflow|webhook|http|apiconnectionwebhook|apiconnection",
    "inputs": { },
    "limit": {
        "timeout": "PT10S"
    }
}
```
  
## API Connection  

API Connection is an action that references a Microsoft-managed connector.
This action requires a reference to a valid connection, and information on the API and parameters required.

|Element name|Required|Type|Description|  
|----------------|------------|--------|---------------|  
|host|Yes|Object|Represents the connector information such as the runtimeUrl and reference to the connection object|
|method|Yes|String|Can be one of the following HTTP methods: **GET**, **POST**, **PUT**, **DELETE**, **PATCH**, or **HEAD**|  
|path|Yes|String|The path of the API operation.|  
|queries|No|Object|Represents the query parameters to add to the URL. For example, `"queries" : { "api-version": "2015-02-01" }` adds `?api-version=2015-02-01` to the URL.|  
|headers|No|Object|Represents each of the headers that is sent to the request. For example, to set the language and type on a request: `"headers" : { "Accept-Language": "en-us",  "Content-Type": "application/json" }`|  
|body|No|Object|Represents the payload that is sent to the endpoint.|  
|retryPolicy|No|Object|Lets you customize the retry behavior for 4xx or 5xx errors.|  
|operationsOptions|No|String|Defines the set of special behaviors to override.|  

```json
"Send_Email": {
    "type": "apiconnection",
    "inputs": {
        "host": {
            "api": {
                "runtimeUrl": "https://logic-apis-df.azure-apim.net/apim/office365"
            },
            "connection": {
                "name": "@parameters('$connections')['office365']['connectionId']"
            }
        },
        "method": "post",
        "body": {
            "Subject": "New Tweet from @{triggerBody()['TweetedBy']}",
            "Body": "@{triggerBody()['TweetText']}",
            "To": "me@example.com"
        },
        "path": "/Mail"
    },
    "runAfter": {}
    }
```

## API Connection webhook action

```json
"Send_approval_email": {
    "type": "apiconnectionwebhook",
    "inputs": {
        "host": {
            "api": {
                "runtimeUrl": "https://logic-apis-df.azure-apim.net/apim/office365"
            },
            "connection": {
                "name": "@parameters('$connections')['office365']['connectionId']"
            }
        },
        "body": {
            "Message": {
                "Subject": "Approval Request",
                "Options": "Approve, Reject",
                "Importance": "Normal",
                "To": "me@email.com"
            }
        },
        "path": "/approvalmail",
        "authentication": "@parameters('$authentication')"
    },
    "runAfter": {}
}
```

Limits on a webhook action can be specified in the same manner as [HTTP Asynchronous Limits](#asynchronous-limits).
  
## Response action  

This action type contains the entire response payload from an HTTP request 
and includes a statusCode, body, and headers:  
  
```json
"myresponse" : {
    "type" : "response",
    "inputs" : {
        "statusCode" : 200,
        "body" : {
            "contentFieldOne" : "value100",
            "anotherField" : 10.001
        },
        "headers" : {
            "x-ms-date" : "@utcnow()",
            "Content-type" : "application/json"
        }
    },
    "runAfter": {}
}
```
  
The response action has special restrictions that don't apply to other actions. Specifically:  
  
-   Response actions cannot be parallel in a definition because a deterministic 
response to the incoming request is required.  
  
-   If a response action is reached after the incoming request has received a response, 
the action is considered failed \(conflict\), and as a result, the run is `Failed`.  
  
-   A workflow with Response actions cannot have `splitOn` in its trigger because one call causes many runs. 
As a result, this should be validated when the flow is PUT and cause a Bad Request.  
  
## Wait action  

The `wait` action suspends workflow execution for the specified interval. 
For example, to wait 15 minutes, you can use this snippet:  
  
```json
"waitForFifteenMinutes" : {
    "type": "wait",
    "inputs": {
        "interval": {
            "unit" : "minute",
            "count" : 15
        }
    }
}
```  
  
Alternatively, to wait until a specific moment in time, you can use this example:  
  
```json
"waitUntilOctober" : {
    "type": "wait",
    "inputs": {
        "until": {
            "timestamp" : "2016-10-01T00:00:00Z"
        }
    }
}
```
  
> [!NOTE]  
> The wait duration can be either specified using the **interval** object or the **until** object, but not both.  
  
|Name|Required|Type|Description|  
|--------|------------|--------|---------------|  
|interval|No|Object|The wait duration based on amount of time.|  
|interval unit|Yes|String|One of these intervals: second, minute, hour, day, week, month, year.|  
|interval count|Yes|String|Duration based on the given internal unit.|  
|until|No|Object|The wait duration based on a point in time.|  
|until timestamp|Yes|String|String&#124;The point in time in UTC when the wait expires.|  

## Query action

The `query` action lets you filter an array based on a condition. 
For example, to select numbers greater than 2, you can use:

```json
"FilterNumbers" : {
    "type": "query",
    "inputs": {
        "from": [ 1, 3, 0, 5, 4, 2 ],
        "where": "@greater(item(), 2)"
    }
}
```

The output from the `query` action is an array that has elements from the input array that satisfy the condition.

> [!NOTE]
> If no values satisfy the `where` condition, 
> the result is an empty array.

|Name|Required|Type|Description|
|--------|------------|--------|---------------|
|from|Yes|Array|The source array.|
|where|Yes|String|The condition to apply to each element of the source array.|

## Select action

The `select` action lets you project each element of an array into a new value.
For example, to convert an array of numbers into an array of objects, you can use:

```json
"SelectNumbers" : {
    "type": "select",
    "inputs": {
        "from": [ 1, 3, 0, 5, 4, 2 ],
        "select": { "number": "@item()" }
    }
}
```

The output of the `select` action is an array that has the same cardinality as the input array, with each element transformed as defined by the `select` property. If the input is an empty array, the output is also an empty array.

|Name|Required|Type|Description|
|--------|------------|--------|---------------|
|from|Yes|Array|The source array.|
|select|Yes|Any|The projection to apply to each element of the source array.|

## Terminate action

The Terminate action stops execution of the workflow run, aborting any in-flight actions, 
and skipping any remaining actions. For example, to terminate a run with status **Failed**, 
you can use the following snippet:

```json
"HandleUnexpectedResponse" : {
    "type": "terminate",
    "inputs": {
        "runStatus" : "failed",
        "runError": {
            "code": "UnexpectedResponse",
            "message": "Received an unexpected response.",
        }
    }
}
```

> [!NOTE]
> Actions already completed are not affected by the terminate action.

|Name|Required|Type|Description|
|--------|------------|--------|---------------|
|runStatus|Yes|String|The target run status. Either **Failed** or **Cancelled**.|
|runError|No|Object|The error details. Only supported when **runStatus** is set to **Failed**.|
|runError code|No|String|The run error code.|
|runError message|No|String|The run error message.|

## Compose action

The Compose action lets you construct an arbitrary object. 
The output of the compose action is the result of evaluating its inputs. 
For example, you can use the compose action to merge outputs of multiple actions:

```json
"composeUserRecord" : {
    "type": "compose",
    "inputs": {
        "firstName": "@actions('getUser').firstName",
        "alias": "@actions('getUser').alias",
        "thumbnailLink": "@actions('lookupThumbnail').url"
        }
    }
}
```

> [!NOTE]
> The **Compose** action can be used to construct any output, 
> including objects, arrays, and any other type natively supported by logic apps like XML and binary.

## Table action

The `table` allows you to convert an array of items into a **CVS** or **HTML** table.

Suppose @triggerBody() is

```json
[{
  "id": 0,
  "name": "apples"
},{
  "id": 1, 
  "name": "oranges"
}]
```

And let the action be defined as

```json
"ConvertToTable" : {
    "type": "table",
    "inputs": {
        "from": "@triggerBody()",
        "format": "html"
    }
}
```

The above would produce

<table><thead><tr><th>id</th><th>name</th></tr></thead><tbody><tr><td>0</td><td>apples</td></tr><tr><td>1</td><td>oranges</td></tr></tbody></table>"

In order to cusomize the table, you can specify the columns explicitly. For example:

```json
"ConvertToTable" : {
    "type": "table",
    "inputs": {
        "from": "@triggerBody()",
        "format": "html",
        "columns": [{
          "header": "produce id",
          "value": "@item().id"
        },{
          "header": "description",
          "value": "@concat('fresh ', item().name)"
        }]
    }
}
```

The above would produce

<table><thead><tr><th>produce id</th><th>description</th></tr></thead><tbody><tr><td>0</td><td>fresh apples</td></tr><tr><td>1</td><td>fresh oranges</td></tr></tbody></table>"

If the `from` property value is an empty array, the output is an empty table.

|Name|Required|Type|Description|
|--------|------------|--------|---------------|
|from|Yes|Array|The source array.|
|format|Yes|String|The format, either **CVS** or **HTML**.|
|columns|No|Array|The columns. Allows to override the default shape of the table.|
|column header|No|String|The header of the column.|
|column value|Yes|String|The value of the column.|

## Workflow action   

|Name|Required|Type|Description|  
|--------|------------|--------|---------------|  
|host id|Yes|String|The resource ID of the workflow that you want to call.|  
|host triggerName|Yes|String|The name of the trigger that you want to invoke.|  
|queries|No|Object|Represents the query parameters to add to the URL. For example, `"queries" : { "api-version": "2015-02-01" }` adds `?api-version=2015-02-01` to the URL.|  
|headers|No|Object|Represents each of the headers that is sent to the request. For example, to set the language and type on a request: `"headers" : { "Accept-Language": "en-us",  "Content-Type": "application/json" }`|  
|body|No|Object|Represents the payload sent to the endpoint.|  
  
```json
"mynestedwf" : {
    "type" : "workflow",
    "inputs" : {
        "host" : {
            "id" : "/subscriptions/xxxxyyyyzzz/resourceGroups/rg001/providers/Microsoft.Logic/mywf001",
            "triggerName " : "mytrigger001"
        },
        "queries" : {
            "extrafield" : "specialValue"
        },  
        "headers" : {
            "x-ms-date" : "@utcnow()",
            "Content-type" : "application/json"
        },
        "body" : {
            "contentFieldOne" : "value100",
            "anotherField" : 10.001
        }
    },
    "runAfter": {}
    }
```
  
An access check is made on the workflow \(more specifically, the trigger\), 
meaning you need access to the workflow.  
  
The outputs from the `workflow` action are based on what you 
defined in the `response` action in the child workflow. 
If you have not defined any `response` action, then the outputs are empty.  

## Function action   

|Name|Required|Type|Description|  
|--------|------------|--------|---------------|  
|function id|Yes|String|The resource ID of the function that you want to invoke.|  
|method|No|String|The HTTP method used to invoke the function. By default, it is `POST` when not specified.|  
|queries|No|Object|Represents the query parameters to add to the URL. For example, `"queries" : { "api-version": "2015-02-01" }` adds `?api-version=2015-02-01` to the URL.|  
|headers|No|Object|Represents each of the headers that is sent to the request. For example, to set the language and type on a request: `"headers" : { "Accept-Language": "en-us" }`.|  
|body|No|Object|Represents the payload sent to the endpoint.|  

```json
"myfunc" : {
    "type" : "Function",
    "inputs" : {
        "function" : {
            "id" : "/subscriptions/xxxxyyyyzzz/resourceGroups/rg001/providers/Microsoft.Web/sites/myfuncapp/functions/myfunc"
        },
        "queries" : {
            "extrafield" : "specialValue"
        },  
        "headers" : {
            "x-ms-date" : "@utcnow()"
        },
        "method" : "POST",
	"body" : {
            "contentFieldOne" : "value100",
            "anotherField" : 10.001
        }
    },
    "runAfter": {}
}
```

When you save the logic app, we perform some checks on the referenced function:
-   You need to have access to the function.
-   Only standard HTTP trigger or generic JSON webhook trigger is allowed.
-   It should not have any route defined.
-   Only "function" and "anonymous" authorization level is allowed.

The trigger URL is retrieved, cached, and used at runtime. So if any operation invalidates the cached URL, the action fails at runtime. To work around this, save the logic app again, which will cause logic app to retrieve and cache the trigger URL again.

## Collection actions (scopes and loops)

Some action types can contain actions within themselves. 
Reference actions within a collection can be referenced directly outside of the collection. 
If you defined `http` in a scope, `@body('http')` is still valid anywhere in a workflow. 
Actions within a collection can `runAfter` only other actions within the same collection.

## Scope action

The `scope` action lets you logically group actions in a workflow.

|Name|Required|Type|Description|  
|--------|------------|--------|---------------|  
|actions|Yes|Object|Inner actions to execute within the scope|

```json
{
    "myScope": {
        "type": "scope",
        "actions": {
            "call_bing": {
                "type": "http",
                "inputs": {
                    "url": "http://www.bing.com"
                }
            }
        }
    }
}
```

## ForEach action

This looping action iterates through an array and performs inner actions for each item. 
By default, the foreach loop executes in parallel (20 executions in parallel at a time). 
You can set execution rules using the `operationOptions` parameter.

|Name|Required|Type|Description|  
|--------|------------|--------|---------------|  
|actions|Yes|Object|Inner actions to execute within the loop|
|foreach|Yes|string|The array to iterate over|
|operationOptions|no|string|Any operation options for behavior. Currently only supports `sequential` to execute iterations sequentially (default behavior is parallel)|

```json
"forEach_email": {
    "type": "foreach",
    "foreach": "@body('email_filter')",
    "actions": {
        "send_email": {
            "type": "ApiConnection",
            "inputs": {
                "body": {
                    "to": "@item()",
                    "from": "me@contoso.com",
                    "message": "Hello, thank you for ordering"
                }
                "host": {
                    "connection": {
                        "id": "@parameters('$connections')['office365']['connection']['id']"
                    }
                }
            }
        }
    },
    "runAfter":{
        "email_filter": [ "Succeeded" ]
    }
}
```

## Until action

This looping action executes inner actions until a condition results to true.

|Name|Required|Type|Description|  
|--------|------------|--------|---------------|  
|actions|Yes|Object|Inner actions to execute within the loop|
|expression|Yes|string|The expression to evaluate after each iteration|
|limit|yes|Object|The limits for the loop - at least one limit must be defined|
|count|no|int|The limit to the number of iterations that can be performed|
|timeout|no|string|The timeout for how long it should loop.  ISO 8601 format|


```json
 "Until_succeeded": {
    "actions": {
        "Http": {
            "inputs": {
                "method": "GET",
                "uri": "http://myurl"
            },
            "runAfter": {},
            "type": "Http"
        }
    },
    "expression": "@equals(outputs('Http')['statusCode', 200)",
    "limit": {
        "count": 1000,
        "timeout": "PT1H"
    },
    "runAfter": {},
    "type": "Until"
}
```

## Conditions - If Action

The `If` action lets you evaluate a condition and execute a branch 
based on whether the expression evaluates to `true`.

|Name|Required|Type|Description|  
|--------|------------|--------|---------------|  
|actions|Yes|Object|Inner actions to execute when expression evaluates to `true`|
|expression|Yes|string|The expression to evaluate|
|else|no|Object|Inner actions to execute when expression evaluates to `false`|
  
```json
"My_condition": {
    "actions": {
        "If_true": {
            "inputs": {
                "method": "GET",
                "uri": "http://myurl"
            },
            "runAfter": {},
            "type": "Http"
        }
    },
    "else": {
        "actions": {
            "if_false": {
                "inputs": {
                    "method": "GET",
                    "uri": "http://myurl"
                },
                "runAfter": {},
                "type": "Http"
            }
        }
    },
    "expression": "@equals(triggerBody(), json(true))",
    "runAfter": {},
    "type": "If"
}
```  
  
The following table shows examples of how conditions can use expressions in an action:  
  
|JSON value|Result|  
|--------------|----------|  
|`"expression": "@parameters('hasSpecialAction')"`|Any value that would evaluate to true causes this condition to pass. Only Boolean expressions are supported. To convert other types to Boolean, use functions `empty`, `equals`.|  
|`"expression": "@greater(actions('act1').output.value, parameters('threshold'))"`|Comparison functions are supported. For the example here, the action only executes when the output of act1 is greater than the threshold.|  
|`"expression": "@or(greater(actions('act1').output.value, parameters('threshold')), less(actions('act1').output.value, 100))"`|Logic functions are also supported to create nested Boolean expressions. In this case, the action executes when the output of act1 is above the threshold or below 100.|  
|`"expression": "@equals(length(actions('act1').outputs.errors), 0))"`|You can use array functions to check if an array has any items. In this case, the action executes when the errors array is empty.| 
|`"expression": "parameters('hasSpecialAction')"`|Error - not a valid condition because @ is required for conditions.|  
  
If a condition evaluates successfully, the condition is marked as `Succeeded`. 
Actions within either the `actions` or `else` objects evaluate to `Succeeded` 
when executed and succeeded, `Failed` when executed and failed, or `Skipped` when that branch is not executed.

## Next steps

[Workflow Service REST API](https://docs.microsoft.com/rest/api/logic/workflows)
