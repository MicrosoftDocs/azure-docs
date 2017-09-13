---
title: Workflow triggers and actions - Azure Logic Apps | Microsoft Docs
description: Learn more about the kinds of triggers and actions that you can use for creating and automating workflows and processes with Azure Logic Apps
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
ms.author: LADocs; mandia
---

# Triggers and actions for logic app workflows

All logic apps start with a trigger followed by actions. 
This topic describes the kinds of triggers and actions 
that you can use for creating system integrations and 
automating business workflows or processes by building logic apps. 
  
## Triggers overview 

All logic apps start with a trigger, 
which specifies the calls that can start a logic app run. 
Here are the two ways that you can start  initiate a run of your workflow:  

* A polling trigger  
* A push trigger, which calls the 
[Workflow Service REST API](https://docs.microsoft.com/rest/api/logic/workflows)  
  
All triggers contain these top-level elements:  
  
```json
"<trigger-name>" : {
    "type": "<trigger-type>",
    "inputs": { <call-settings> },
    "recurrence": {  
        "frequency": "Second|Minute|Hour|Day|Week|Month",
        "interval": "<recurrence-interval-based-on-frequency>"
    },
    "conditions": [ <array-of-required-conditions > ],
    "splitOn" : "<property-used-for-creating-separate-workflows>",
    "operationOptions": "<operation-options-for-trigger>"
}
```

### Trigger types and inputs  

Each trigger type has a different interface and 
different *inputs* that defines its behavior. 

| Trigger type | Description | 
| ------------ | ----------- | 
| **Recurrence** | Fires based on a defined schedule. You can set a future date and time for firing this trigger. Based on the frequency, you can also specify times and days for running the workflow. | 
| **Request**  | Makes your logic app into an endpoint that you can call, also known as a "manual" trigger. | 
| **HTTP** | Checks, or *polls*, an HTTP web endpoint. The HTTP endpoint must conform to a specific triggering contract either by using a "202" asynchronous pattern or by returning an array. | 
| **ApiConnection** | Polls like an HTTP trigger, but uses [Microsoft-managed APIs](../connectors/apis-list.md). | 
| **HTTPWebhook** | Makes your logic app into a callable endpoint, like the Request trigger, but calls a specified URL for registering and unregistering. |
| **ApiConnectionWebhook** | Works like the **HTTPWebhook** trigger, but uses Microsoft-managed APIs. | 
||| 

For information about other details, see 
[Workflow Definition Language](../logic-apps/logic-apps-workflow-definition-language.md). 
  
## Recurrence trigger  

This trigger runs based on a defined schedule 
and provides an easy way for running a workflow. 
Here's a basic recurrence trigger example that runs daily:

```json
"<trigger-name>" : {
    "type": "Recurrence",
    "recurrence": {
        "frequency": "Day",
        "interval": 1
    }
}
```
You can also schedule a future date and time for firing the trigger. 
For example, to start a weekly report every Monday, 
you can schedule the logic app to start on a specific Monday 
like this example: 

```json
"<trigger-name" : {
    "type": "Recurrence",
    "recurrence": {
        "frequency": "Week",
        "interval": "1",
        "startTime" : "2017-09-18T00:00:00Z"
    }
}
```

Here's the definition for this trigger: 

```json
"<trigger-name>" : {
    "type": "Recurrence",
    "recurrence": {
        "frequency": "Second|Minute|Hour|Day|Week|Month",
        "interval": <recurrence-interval-based-on-frequency>,
        "schedule": {
            "hours": [ <one-or-more-hour-marks> ], // Applies only when frequency is "Day" or "Week". Separate values with commas. 
            "minutes": [ <one-or-more-minute-marks> ], // Applies only when frequency is "Day" or "Week". Separate values with commas. 
            "weekDays": [ "Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday" ] // Applies only when frequency is "Week". Separate values with commas. 
        },
        "startTime": "<start-date-time-with-format-YYYY-MM-DDThh:mm:ss>",
        "timeZone": "<time-zone>"
    }
}
```

| Element name | Required | Type | Description | 
| ------------ | -------- | ---- | ----------- | 
| frequency | Yes | String | The unit of time for how often the trigger fires - use only one of these values: "second", "minute", "hour", "day", "week", or "month" | 
| interval | Yes | Integer | A positive integer that describes how often the workflow runs based on the frequency. <p>Here are the minimum and maximum intervals: <p>- Month: 1-16 months </br>- Day: 1-500 days </br>- Hour: 1-12,000 hours </br>- Minute: 1-72,000 minutes </br>- Second: 1-9,999,999 seconds<p>For example, if the interval is 6, and the frequency is "Month", then the recurrence is every 6 months. | 
| timeZone | No | String | Applies only when you specify a start time because this trigger doesn't accept [UTC offset](https://en.wikipedia.org/wiki/UTC_offset). Specify the time zone that you want to apply. | 
| startTime | No | String | Specify the start date and time in this format: <p>YYYY-MM-DDThh:mm:ss if you specify a time zone <p>-or- <p>YYYY-MM-DDThh:mm:ssZ if you don't specify a time zone <p>So for example, if you want September 18, 2017 at 2:00 PM, then specify "2017-09-18T14:00:00" and specify a time zone such as "Pacific Standard Time". Or, specify "2017-09-18T14:00:00Z" without a time zone. <p>**Note:** This start time must follow the [ISO 8601 date time specification](https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations) in [UTC date time format](https://en.wikipedia.org/wiki/Coordinated_Universal_Time), but without a [UTC offset](https://en.wikipedia.org/wiki/UTC_offset). If you don't specify a time zone, you must add the letter "Z" at the end without any spaces. This "Z" refers to the equivalent [nautical time](https://en.wikipedia.org/wiki/Nautical_time). <p>For simple schedules, the start time is the first occurrence, while for complex schedules, the trigger doesn't fire any sooner than the start time. For more information about start dates and times, see [Create and schedule regularly running workflows](../connectors/connectors-native-recurrence.md). | 
| weekDays | No | String or string array | If you specify "Week" for `frequency`, you can specify one or more days, separated by commas, when you want to run the workflow: "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", and "Sunday" | 
| hours | No | Integer or integer array | If you specify "Day" or "Week" for `frequency`, you can specify one or more integers, separated by commas, from 0 to 23 as the hour marks for the times when you want to run the workflow. <p>For example, if you specify "10", "12" and "14", you get 10 AM, 12 PM, and 2 PM. | 
| minutes | No | Integer or integer array | If you specify "Day" or "Week" for `frequency`, you can specify one or more integers from 0 to 59, separated by commas, as the minute marks for the times when you want to run the workflow. <p>For example, "30" is the half-hour mark. With the previous example for hours, you get 10:30 AM, 12:30 PM, and 2:30 PM. | 
|||||| 

For example: 

``` json
{
    "triggers": {
        "Recurrence": {
            "recurrence": {
                "frequency": "Week",
                "interval": 1,
                "schedule": {
                    "hours": [
                        10,
                        12,
                        14
                    ],
                    "minutes": [
                        30
                    ],
                    "weekDays": [
                        "Monday"
                    ]
                },
               "startTime": "2017-09-07T14:00:00",
               "timeZone": "Pacific Standard Time"
            },
            "type": "Recurrence"
        }
    }
}
```

For more information and examples about this trigger, 
see [Create and schedule regularly running workflows](../connectors/connectors-native-recurrence.md).

## Request trigger

This trigger serves as an endpoint that you can use for 
calling your logic app through an HTTP request. 
A request trigger looks like this example:  
  
```json
"<trigger-name>" : {
    "type" : "Request",
    "kind": "Http",
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

This trigger has an optional property called *schema*:
  
| Element name | Required | Type | Description |
| ------------ | -------- | ---- | ----------- |
| schema | No | Object | A JSON schema that validates the incoming request. Useful for helping subsequent workflow steps know which properties to reference. | 
||||| 

To invoke this endpoint, you need to call the *listCallbackUrl* API. See 
[Workflow Service REST API](https://docs.microsoft.com/rest/api/logic/workflows).

## HTTP trigger  

HTTP triggers poll a specified endpoint and check the 
response to determine whether the workflow should run. 
Here, the `inputs` object takes these parameters 
required for constructing an HTTP call:  

| Element name | Required | Type | Description | 
| ------------ | -------- | ---- | ----------- | 
| method | Yes | String | Uses one of these HTTP methods: "GET", "POST", "PUT", "DELETE", "PATCH", or "HEAD" | 
| uri | Yes| String | The HTTP or HTTPs endpoint that the trigger checks. Maximum string size: 2 KB | 
| queries | No | Object | Represents any query parameters that you want to include in the URL. <p>For example, `"queries": { "api-version": "2015-02-01" }` adds `?api-version=2015-02-01` to the URL. | 
| headers | No | Object | Represents each header that's sent in the request. <p>For example, to set the language and type on a request: <p>`"headers": { "Accept-Language": "en-us", "Content-Type": "application/json" }` | 
| body | No | Object | Represents the payload that's sent to the endpoint. | 
| retryPolicy | No | Object | Use this object for customizing the retry behavior for 4xx or 5xx errors. | 
| authentication | No | Object | Represents the method that the request should use for authentication. For more information, see [Scheduler Outbound Authentication](../scheduler/scheduler-outbound-authentication.md). <p>Beyond Scheduler, there is one more supported property: `authority`. By default, this value is `https://login.windows.net` when not specified, but you can use a different value, such as`https://login.windows\-ppe.net`. | 
||||| 

A *retry policy* applies to intermittent failures, 
characterized as HTTP status codes 408, 429, and 5xx, 
in addition to any connectivity exceptions. 
You can define this policy with the `retryPolicy` object as shown here:
  
```json
"retryPolicy": {
    "type": "<type-of-retry-policy>",
    "interval": <retry-interval>,
    "count": <number-of-retry-attempts>
}
```
 
To work well with your logic app, the HTTP trigger requires the HTTP API 
to conform with a specific pattern. The trigger recognizes these properties:  
  
| Response | Required | Description | 
| -------- | -------- | ----------- |  
| Status code | Yes | The status code 200 ("OK") causes a run. Any other status code doesn't cause a run. | 
| Retry-after header | No | The number of seconds until the logic app polls the endpoint again. | 
| Location header | No | The URL to call at the next polling interval. If not specified, the original URL is used. | 
|||| 

Here are some example behaviors for different types of requests:
  
| Response code | Retry after | Behavior | 
| ------------- | ----------- | -------- | 
| 200 | {none} | Run the workflow, then check again for more data after the defined recurrence. | 
| 200 | 10 seconds | Run the workflow, then check again for more data after 10 seconds. |  
| 202 | 60 seconds | Don't trigger the workflow. The next attempt happens in one minute, subject to the defined recurrence. If the defined recurrence is less than one minute, the retry-after header takes precedence. Otherwise, the defined recurrence is used. | 
| 400 | {none} | Bad request, don't run the workflow. If no `retryPolicy` is defined, then the default policy is used. After the number of retries has been reached, the trigger checks again for data after the defined recurrence. | 
| 500 | {none}| Server error, don't run the workflow. If no `retryPolicy` is defined, then the default policy is used. After the number of retries has been reached, the trigger checks again for data after the defined recurrence. | 
|||| 

Here are the HTTP trigger outputs: 
  
| Element name | Type | Description |
| ------------ | ---- | ----------- |
| headers | Object | The headers of the HTTP response | 
| body | Object | The body of the HTTP response | 
|||| 

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
            }
        },
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

| Element name | Required | Type | Description | 
| ------------ | -------- | ---- | ----------- | 
| host | Yes | Object | The hosted gateway and ID for the API App | 
| method | Yes | String | Uses one of these HTTP methods: "GET", "POST", "PUT", "DELETE", "PATCH", or "HEAD" | 
| queries | No | Object | Represents any query parameters that you want to include in the URL. <p>For example, `"queries": { "api-version": "2015-02-01" }` adds `?api-version=2015-02-01` to the URL. | 
| headers | No | Object | Represents each header that's sent in the request. <p>For example, to set the language and type on a request: <p>`"headers": { "Accept-Language": "en-us", "Content-Type": "application/json" }` | 
| body | No | Object | Represents the payload that's sent to the endpoint. | 
| retryPolicy | No | Object | Use this object for customizing the retry behavior for 4xx or 5xx errors. | 
| authentication | No | Object | Represents the method that the request should use for authentication. For more information, see [Scheduler Outbound Authentication](../scheduler/scheduler-outbound-authentication.md). | 
||||| 

For the `host` object, here are the properties:  
  
| Element name | Required | Description | 
| ------------ | -------- | ----------- | 
| api runtimeUrl | Yes | The endpoint for the managed API | 
| connection name |  | The name of the managed API connection that the workflow uses. Must reference a parameter named `$connection`. |
|||| 

A *retry policy* applies to intermittent failures, 
characterized as HTTP status codes 408, 429, and 5xx, 
in addition to any connectivity exceptions. 
You can define this policy with the `retryPolicy` object as shown here:
  
```json
"retryPolicy": {
    "type": "<type-of-retry-policy>",
    "interval": <retry-interval>,
    "count": <number-of-retry-attempts>
}
```

Here are the outputs for an API Connection trigger:
  
| Element name | Type | Description |
| ------------ | ---- | ----------- |
| headers | Object | The headers of the HTTP response | 
| body | Object | The body of the HTTP response | 
|||| 
  
## HTTPWebhook trigger  

The HTTPWebhook trigger provides an endpoint, similar to the Request trigger, 
but the HTTPWebhook trigger also calls a specified URL for registering and unregistering. 
Here's an example of what an HTTPWebhook trigger might look like:  

```json
"myappspottrigger": {
    "type": "HttpWebhook",
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

Many of these sections are optional, and the HTTPWebhook trigger 
behavior depends on the sections that you provide or omit. 
Here are the properties for the HTTPWebhook trigger:
  
| Element name | Required | Description | 
| ------------ | -------- | ----------- |  
| subscribe | No | Specifies the outgoing request to call when the trigger is created and performs the initial registration. | 
| unsubscribe | No | Specifies the outgoing request to call when the trigger is deleted. | 
|||| 

You can specify limits on a webhook action in the same way as 
[HTTP Asynchronous Limits](#asynchronous-limits). 
Here is more information about the `subscribe` and `unsubscribe` actions:

* `subscribe` is called so that the trigger can start listening to events. 
This outgoing call starts with the same parameters as standard HTTP actions. 
This call happens when the workflow changes in any way, 
for example, when the credentials are rolled, or the trigger's input parameters change. 
  
  To support this call, the `@listCallbackUrl()` function returns a unique URL 
  for this specific trigger in the workflow. This URL represents the unique 
  identifier for the endpoints that use the service's REST API.
  
* `unsubscribe` is automatically called when an operation renders this trigger invalid, 
including these operations:

  * Deleting or disabling the trigger. 
  * Deleting or disabling the workflow. 
  * Deleting or disabling the subscription. 
  
  The parameters for this function are the same as the HTTP trigger.

Here are the outputs from the HTTPWebhook trigger and are the contents of the incoming request:
  
| Element name | Type | Description |
| ------------ | ---- | ----------- |
| headers | Object | The headers of the HTTP response | 
| body | Object | The body of the HTTP response | 
|||| 

## Conditions  

For any trigger, you can use one or more conditions 
to determine whether the workflow should run or not. 
For example:  

```json
"dailyReport": {
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
Finally, conditions can reference the status code of the trigger. For example, 
you can start a workflow only when your website returns a status code 500, for example:
  
``` json
"conditions": [ 
    {  
      "expression": "@equals(triggers().code, 'InternalServerError')"  
    }  
]  
```  
  
> [!NOTE]  
> When any expression references a trigger's status code in any way, 
> the default behavior, which is trigger only on 200 "OK", is replaced. 
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
    "status": "Succeeded",
    "rows": [
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
  
Your logic app only needs the `rows` content, 
so you can construct your trigger like this example:  

```json
"mysplitter": {
    "type": "Http",
    "recurrence": {
        "frequency": "Minute",
        "interval": 1
    },
    "intputs": {
        "uri": "https://mydomain.com/myAPI",
        "method": "GET"
    },
    "splitOn": "@triggerBody()?.Rows"
}
```
  
Then, in the workflow definition, `@triggerBody().name` returns `mycoolrow` for the first run, 
and `another row` for the second run. The trigger outputs look like this example:  
  
```json
{
    "body": {
        "id": 938109381,
        "name": "another row"
    }
}
```

So if you use `SplitOn`, you can't get the properties that are outside the array, 
in this case, the `Status` field.  
  
> [!NOTE]  
> In this example, we use the `?` operator so we can 
> avoid a failure if the `Rows` property is not present. 
  
## Single run instance

You can configure recurrence triggers so that they fire only when all active runs have completed. 
If a scheduled recurrence happens while workflow instance is running, 
the trigger skips and waits until the next scheduled recurrence interval to check again.
To configure this setting, set the `operationOptions` property to `singleInstance`:

```json
"triggers": {
    "mytrigger": {
        "type": "Http",
        "inputs": { ... },
        "recurrence": { ... },
        "operationOptions": "singleInstance"
    }
}
```

## Actions overview

There are many types of actions, each with unique behavior. 
Each action type has different inputs that define an action's behavior. 
Collection actions can contain many other actions within themselves. 

### Standard actions  

| Action type | Description | 
| ----------- | ----------- | 
| **HTTP** | Calls an HTTP web endpoint. | 
| **ApiConnection**  | Works like the HTTP action, but uses [Microsoft-managed APIs](https://docs.microsoft.com/azure/connectors/apis-list). | 
| **ApiConnectionWebhook** | Works like HTTPWebhook, but uses Microsoft-managed APIs. | 
| **Response** | Defines the response for an incoming call. | 
| **Function** | Represents an Azure function. | 
| **Wait** | Waits a fixed amount of time or until a specific time. | 
| **Workflow** | Represents a nested workflow. | 
| **Compose** | Constructs an arbitary object from the action's inputs. | 
| **Query** | Filters an array based on a condition. | 
| **Select** | Projects each element of an array into a new value. For example, you can convert an array of numbers into an array of objects. | 
| **Table** | Converts an array of items into a CSV or HTML table. | 
| **Terminate** | Stops running a workflow. | 
||| 

### Collection actions

| Action type | Description | 
| ----------- | ----------- | 
| **Condition** | Evaluates an expression and based on the result, runs the corresponding branch. | 
| **Scope** | Use for logically grouping other actions. | 
| **ForEach** | This looping action iterates through an array and performs inner actions on each array item. | 
| **Until** | This looping action performs inner actions until a condition results to true. | 
||| 

## HTTP action  

HTTP actions call a specified endpoint and check the 
response to determine whether the workflow should run. 
For example:
  
```json
"latestNews": {
    "type": "Http",
    "inputs": {
        "method": "GET",
        "uri": "https://mynews.example.com/latest",
    }
}
```

Here, the `inputs` object takes these parameters 
required for constructing an HTTP call: 

| Element name | Required | Type | Description | 
| ------------ | -------- | ---- | ----------- | 
| method | Yes | String | Uses one of these HTTP methods: "GET", "POST", "PUT", "DELETE", "PATCH", or "HEAD" | 
| uri | Yes| String | The HTTP or HTTPs endpoint that the trigger checks. Maximum string size: 2 KB | 
| queries | No | Object | Represents any query parameters that you want to include in the URL. <p>For example, `"queries": { "api-version": "2015-02-01" }` adds `?api-version=2015-02-01` to the URL. | 
| headers | No | Object | Represents each header that's sent in the request. <p>For example, to set the language and type on a request: <p>`"headers": { "Accept-Language": "en-us", "Content-Type": "application/json" }` | 
| body | No | Object | Represents the payload that's sent to the endpoint. | 
| retryPolicy | No | Object | Use this object for customizing the retry behavior for 4xx or 5xx errors. | 
| operationsOptions | No | String | Defines the set of special behaviors to override. | 
| authentication | No | Object | Represents the method that the request should use for authentication. For more information, see [Scheduler Outbound Authentication](../scheduler/scheduler-outbound-authentication.md). <p>Beyond Scheduler, there is one more supported property: `authority`. By default, this value is `https://login.windows.net` when not specified, but you can use a different value, such as`https://login.windows\-ppe.net`. | 
||||| 

HTTP actions and APIConnection actions support *retry policies*. 
A retry policy applies to intermittent failures, 
characterized as HTTP status codes 408, 429, and 5xx, 
in addition to any connectivity exceptions. 
You can define this policy with the `retryPolicy` object as shown here:
  
```json
"retryPolicy": {
    "type": "<type-of-retry-policy>",
    "interval": <retry-interval>,
    "count": <number-of-retry-attempts>
}
```
This example HTTP action retries fetching the latest news two times 
if there are intermittent failures for a total of three executions and 
a 30-second delay between each attempt:
  
```json
"latestNews": {
    "type": "Http",
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

The retry interval is specified in [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601). 
This interval has a default and minimum value of 20 seconds, while the maximum value is one hour. 
The default and maximum retry count is four hours. 
If the you don't specify the retry policy definition, 
a `fixed` strategy is used with default retry count and interval values. 
To disable the retry policy, set its type to `None`.

### Asynchronous patterns

By default, all HTTP-based actions support the standard asynchronous operation pattern. 
So if the remote server indicates that the request is accepted for processing 
with a "202 ACCEPTED" response, the Logic Apps engine keeps polling the URL specified 
in the response's location header until reaching a terminal state, which is a non-202 response.
  
To disable the asynchronous behavior previously described, 
set `operationOptions` to `DisableAsyncPattern` in the action inputs. 
In this case, the action's output is based on the initial 202 response from the server. 
For example:
  
```json
"invokeLongRunningOperation": {
    "type": "Http",
    "inputs": {
        "method": "POST",
        "uri": "https://host.example.com/resources"
    },
    "operationOptions": "DisableAsyncPattern"
}
```
<a name="asynchronous-limits"></a>

#### Asynchronous limits

You can limit the duration for an asynchronous pattern to a specific time interval. 
If the time interval elapses without reaching a terminal state, 
the action's status is marked `Cancelled` with an `ActionTimedOut` code. 
The limit timeout is specified in ISO 8601 format. 
You can specify limits as shown here:

``` json
"<action-name>": {
    "type": "workflow|webhook|http|apiconnectionwebhook|apiconnection",
    "inputs": { },
    "limit": {
        "timeout": "PT10S"
    }
}
```
  
## APIConnection action

The APIConnection action references a Microsoft-managed connector. 
This action requires a reference to a valid connection and information about the API and parameters.
Here is an example APIConnection action:

```json
"Send_Email": {
    "type": "ApiConnection",
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

| Element name | Required | Type | Description | 
| ------------ | -------- | ---- | ----------- | 
| host | Yes | Object | Represents the connector information such as the `runtimeUrl` and reference to the connection object. | 
| method | Yes | String | Uses one of these HTTP methods: "GET", "POST", "PUT", "DELETE", "PATCH", or "HEAD" | 
| path | Yes | String | The path for the API operation | 
| queries | No | Object | Represents any query parameters that you want to include in the URL. <p>For example, `"queries": { "api-version": "2015-02-01" }` adds `?api-version=2015-02-01` to the URL. | 
| headers | No | Object | Represents each header that's sent in the request. <p>For example, to set the language and type on a request: <p>`"headers": { "Accept-Language": "en-us", "Content-Type": "application/json" }` | 
| body | No | Object | Represents the payload that's sent to the endpoint. | 
| retryPolicy | No | Object | Use this object for customizing the retry behavior for 4xx or 5xx errors. | 
| operationsOptions | No | String | Defines the set of special behaviors to override. | 
| authentication | No | Object | Represents the method that the request should use for authentication. For more information, see [Scheduler Outbound Authentication](../scheduler/scheduler-outbound-authentication.md). |
||||| 

A retry policy applies to intermittent failures, 
characterized as HTTP status codes 408, 429, and 5xx, 
in addition to any connectivity exceptions. 
You can define this policy with the `retryPolicy` object as shown here:
  
```json
"retryPolicy": {
    "type": "<type-of-retry-policy>",
    "interval": <retry-interval>,
    "count": <number-of-retry-attempts>
}
```

## APIConnection webhook action

The APIConnectionWebhook action references a Microsoft-managed connector. 
This action requires a reference to a valid connection and information 
about the API and parameters. You can specify limits on a webhook 
action in the same way as [HTTP Asynchronous Limits](#asynchronous-limits).

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

| Element name | Required | Type | Description | 
| ------------ | -------- | ---- | ----------- | 
| host | Yes | Object | Represents the connector information such as the `runtimeUrl` and reference to the connection object. | 
| path | Yes | String | The path for the API operation | 
| queries | No | Object | Represents any query parameters that you want to include in the URL. <p>For example, `"queries": { "api-version": "2015-02-01" }` adds `?api-version=2015-02-01` to the URL. | 
| headers | No | Object | Represents each header that's sent in the request. <p>For example, to set the language and type on a request: <p>`"headers": { "Accept-Language": "en-us", "Content-Type": "application/json" }` | 
| body | No | Object | Represents the payload that's sent to the endpoint. | 
| retryPolicy | No | Object | Use this object for customizing the retry behavior for 4xx or 5xx errors. | 
| operationsOptions | No | String | Defines the set of special behaviors to override. | 
| authentication | No | Object | Represents the method that the request should use for authentication. For more information, see [Scheduler Outbound Authentication](../scheduler/scheduler-outbound-authentication.md). |
||||| 

## Response action  

This action contains the entire response payload from an HTTP request 
and includes a `statusCode`, `body`, and `headers`:
  
```json
"myresponse": {
    "type": "response",
    "inputs": {
        "statusCode" : 200,
        "body": {
            "contentFieldOne": "value100",
            "anotherField": 10.001
        },
        "headers": {
            "x-ms-date": "@utcnow()",
            "Content-type": "application/json"
        }
    },
    "runAfter": {}
}
```

The response action has special restrictions that don't apply to other actions, specifically:  
  
* You can't have response actions in parallel branches within a logic 
app definition because the incoming request requires a deterministic response.
  
* If the workflow reaches a response action after the 
incoming request already received a response, 
the response action is considered failed or in conflict. 
As a result, the logic app run is marked `Failed`.
  
* A workflow with response actions can't use the `splitOn` command 
in the trigger definition because the call creates multiple runs. 
As a result, check for this case when the workflow operation is PUT, 
and return a "bad request" response.

## Function action   

This action lets you represent and call an [Azure function](../azure-functions/functions-overview.md), 
for example:

```json
"<your-Azure-Function-name": {
   "type": "Function",
    "inputs": {
        "function": {
            "id": "/subscriptions/{Azure-subscription-ID}/resourceGroups/{Azure-resource-group}/providers/Microsoft.Web/sites/{your-Azure-function-app-name}/functions/{your-Azure-function-name}"
        },
        "queries": {
            "extrafield": "specialValue"
        },  
        "headers": {
            "x-ms-date" : "@utcnow()"
        },
        "method": "POST",
    	"body": {
            "contentFieldOne": "value100",
            "anotherField": 10.001
        }
    },
    "runAfter": {}
}
```
| Element name | Required | Type | Description | 
| ------------ | -------- | ---- | ----------- |  
| function id | Yes | String | The resource ID for the Azure function that you want to call. | 
| method | No | String | The HTTP method used to call the function. If not specified, "POST" is the default method. | 
| queries | No | Object | Represents any query parameters that you want to include in the URL. <p>For example, `"queries": { "api-version": "2015-02-01" }` adds `?api-version=2015-02-01` to the URL. | 
| headers | No | Object | Represents each header that's sent in the request. <p>For example, to set the language and type on a request: <p>`"headers": { "Accept-Language": "en-us", "Content-Type": "application/json" }` | 
| body | No | Object | Represents the payload that's sent to the endpoint. | 
|||||

When you save your logic app, Azure Logic Apps performs checks on the referenced function:

* You must have access to the function.
* You can use only standard HTTP triggers or generic JSON webhook triggers.
* The function shouldn't have any route defined.
* Only "function" and "anonymous" authorization level is allowed.

The trigger URL is retrieved, cached, and used at runtime. 
So if any operation invalidates the cached URL, the action fails at runtime. 
To work around this problem, save the logic app again, 
which causes the logic app to retrieve and cache the trigger URL again.

## Wait action  

This action suspends workflow execution for the specified interval. 
This example causes the workflow to wait 15 minutes:
  
```json
"waitForFifteenMinutes": {
    "type": "Wait",
    "inputs": {
        "interval": {
            "unit" : "minute",
            "count" : 15
        }
    }
}
```
  
Alternatively, to wait until a specific moment in time, 
you can use this example:
  
```json
"waitUntilOctober": {
    "type": "Wait",
    "inputs": {
        "until": {
            "timestamp" : "2017-10-01T00:00:00Z"
        }
    }
}
```
  
> [!NOTE]  
> The wait duration can be either specified 
> with the `until` object or `interval` object, but not both.
  
| Element name | Required | Type | Description | 
| ------------ | -------- | ---- | ----------- | 
| until | No | Object | The wait duration based on a point in time |
| until timestamp | Yes | String | The point in time in [UTC date time format](https://en.wikipedia.org/wiki/Coordinated_Universal_Time) when the wait expires | 
| interval | No | Object | The wait duration based on the interval unit and count |
| interval unit | Yes | String | The unit of time - use only one of these values: "second", "minute", "hour", "day", "week", or "month" |  
| interval count | Yes | Integer | A positive integer representing the number of interval units used for the wait duration | 
||||| 

## Workflow action   

This action represents another workflow. 
Logic Apps performs an access check on the workflow, or more specifically, the trigger, 
which means you must have access to the workflow.

This action's outputs are based on what you define in the `response` action for the child workflow. 
If you haven't defined a `response` action, then the outputs are empty.

```json
"myNestedWorkflow": {
    "type": "Workflow",
    "inputs": {
        "host": {
            "id": "/subscriptions/xxxxyyyyzzz/resourceGroups/rg001/providers/Microsoft.Logic/mywf001",
            "triggerName": "mytrigger001"
        },
        "queries": {
            "extrafield": "specialValue"
        },  
        "headers": {
            "x-ms-date": "@utcnow()",
            "Content-type": "application/json"
        },
        "body": {
            "contentFieldOne": "value100",
            "anotherField": 10.001
        }
    },
    "runAfter": {}
}
```

| Element name | Required | Type | Description | 
| ------------ | -------- | ---- | ----------- |  
| host id | Yes | String| The resource ID for the workflow that you want to call | 
| host triggerName | Yes | String | The name of the trigger that you want to invoke | 
| queries | No | Object | Represents any query parameters that you want to include in the URL. <p>For example, `"queries": { "api-version": "2015-02-01" }` adds `?api-version=2015-02-01` to the URL. | 
| headers | No | Object | Represents each header that's sent in the request. <p>For example, to set the language and type on a request: <p>`"headers": { "Accept-Language": "en-us", "Content-Type": "application/json" }` | 
| body | No | Object | Represents the payload that's sent to the endpoint. | 
|||||   

## Compose action

This action lets you construct an arbitrary object, 
and the output is the result from evaluating the action's inputs. 

> [!NOTE]
> You can use the `Compose` action for constructing any output, 
> including objects, arrays, and any other type natively 
> supported by logic apps like XML and binary.

For example, you can use the compose action 
for merging outputs from multiple actions:

```json
"composeUserRecord": {
    "type": "Compose",
    "inputs": {
        "firstName": "@actions('getUser').firstName",
        "alias": "@actions('getUser').alias",
        "thumbnailLink": "@actions('lookupThumbnail').url"
    }
}
```

## Select action

This action lets you project each element of an array into a new value.
For example, to convert an array of numbers into an array of objects, you can use:

```json
"SelectNumbers" : {
    "type": "Select",
    "inputs": {
        "from": [ 1, 3, 0, 5, 4, 2 ],
        "select": { "number": "@item()" }
    }
}
```

| Name | Required | Type | Description | 
| ---- | -------- | ---- | ----------- | 
| from | Yes | Array | The source array |
| select | Yes | Any | The projection applied to each element in the source array |
||||| 

The output from the `select` action is an array that has the same cardinality as the input array. 
Each element is transformed as defined by the `select` property. 
If the input is an empty array, the output is also an empty array.

## Query action

This action lets you filter an array based on a condition. 
This example selects numbers greater than two:

```json
"FilterNumbers": {
    "type": "query",
    "inputs": {
        "from": [ 1, 3, 0, 5, 4, 2 ],
        "where": "@greater(item(), 2)"
    }
}
```

The output from the `query` action is an array that 
has elements from the input array that satisfy the condition.

> [!NOTE]
> If no values satisfy the `where` condition, 
> the result is an empty array.

| Name | Required | Type | Description | 
| ---- | -------- | ---- | ----------- | 
| from | Yes | Array | The source array |
| where | Yes | String | The condition that's applied to each element from the source array |
||||| 

## Table action

This action lets you convert an array of items into a **CSV** or **HTML** table. 
For example, suppose that you have a `@triggerBody()` with this array:

```json
[ 
    {
      "id": 0,
      "name": "apples"
    },
    {
      "id": 1, 
      "name": "oranges"
    }
]
```

And you define a table action like this example:

```json
"ConvertToTable": {
    "type": "Table",
    "inputs": {
        "from": "@triggerBody()",
        "format": "html"
    }
}
```

The result from this example looks like this HTML table: 

<table><thead><tr><th>id</th><th>name</th></tr></thead><tbody><tr><td>0</td><td>apples</td></tr><tr><td>1</td><td>oranges</td></tr></tbody></table>

To customize this table, you can specify the columns explicitly, for example:

```json
"ConvertToTable": {
    "type": "Table",
    "inputs": {
        "from": "@triggerBody()",
        "format": "html",
        "columns": [ 
            {
                "header": "Produce ID",
                "value": "@item().id"
            },
            {
              "header": "Description",
              "value": "@concat('fresh ', item().name)"
            }
        ]
    }
}
```

The result from this example looks like this HTML table: 

<table><thead><tr><th>Produce ID</th><th>Description</th></tr></thead><tbody><tr><td>0</td><td>fresh apples</td></tr><tr><td>1</td><td>fresh oranges</td></tr></tbody></table>

| Name | Required | Type | Description | 
| ---- | -------- | ---- | ----------- | 
| from | Yes | Array | The source array. If the `from` property value is an empty array, the output is an empty table. | 
| format | Yes | String | The table format that you want, either **CSV** or **HTML** | 
| columns | No | Array | The table columns that you want. Use to override the default table shape. | 
| column header | No | String | The column header | 
| column value | Yes | String | The column value | 
||||| 

## Terminate action

This action stops the workflow run, cancels any in-flight actions, and skips any remaining actions. 
The terminate action doesn't affect any finished actions.

For example, to stop a run that has "Failed" status, you can use this example:

```json
"HandleUnexpectedResponse": {
    "type": "Terminate",
    "inputs": {
        "runStatus": "Failed",
        "runError": {
            "code": "UnexpectedResponse",
            "message": "Received an unexpected response"
        }
    }
}
```

| Name | Required | Type | Description | 
| ---- | -------- | ---- | ----------- | 
| runStatus | Yes | String | The target run's status, which is either `Failed` or `Cancelled` |
| runError | No | Object | The error details. Supported only when `runStatus` is set to `Failed`. |
| runError code | No | String | The run's error code |
| runError message | No | String | The run's error message |
||||| 

## Collection actions overview

Some actions can include actions within themselves. 
Reference actions in a collection can be referenced directly outside of the collection. 
For example, if you define `Http` in a `scope`, 
then `@body('http')` is still valid anywhere in the workflow. 
You can have actions in a collection `runAfter` only with other actions in the same collection.

## Condition: If action

This action lets you evaluate a condition and execute a branch 
based on whether the expression evaluates to `true`. 
  
```json
"myCondition": {
    "type": "If",
    "actions": {
        "if_true": {
            "type": "Http",
            "inputs": {
                "method": "GET",
                "uri": "http://myurl"
            },
            "runAfter": {}
        }
    },
    "else": {
        "actions": {
            "if_false": {
                "type": "Http",
                "inputs": {
                    "method": "GET",
                    "uri": "http://myurl"
                },
                "runAfter": {}
            }
        }
    },
    "expression": "@equals(triggerBody(), json(true))",
    "runAfter": {}
}
``` 

| Name | Required | Type | Description | 
| ---- | -------- | ---- | ----------- | 
| actions | Yes | Object | The inner actions to run when `expression` evaluates to `true` | 
| expression | Yes | String | The expression to evaluate |
| else | No | Object | The inner actions to run when `expression` evaluates to `false` |
||||| 

If the condition evaluates successfully, the condition is marked as `Succeeded`. 
Actions in either the `actions` or `else` objects evaluate to: 

* `Succeeded` when they run and succeed
* `Failed` when they run and fail
* `Skipped` when the respective branch doesn't run

Here are examples that show how conditions can use expressions in an action:
  
| JSON value | Result | 
| ---------- | -------| 
| `"expression": "@parameters('hasSpecialAction')"` | Any value that evaluates to true causes this condition to pass. Supports only Boolean expressions. To convert other types to Boolean, use these functions: `empty` and `equals` | 
| `"expression": "@greater(actions('act1').output.value, parameters('threshold'))"` | Supports comparison functions. For this example, the action only runs when the output of `act1` is greater than the threshold. | 
| `"expression": "@or(greater(actions('act1').output.value, parameters('threshold')), less(actions('act1').output.value, 100))"` | Supports logic functions for creating nested Boolean expressions. For this example, the action runs when the output of `act1` is above the threshold or below 100. | 
| `"expression": "@equals(length(actions('act1').outputs.errors), 0))"` | To check whether an array has any items, you can use array functions. For this example, the action runs when the `errors` array is empty. | 
| `"expression": "parameters('hasSpecialAction')"` | Error, not a valid condition because @ is required for conditions. |  
|||

## Scope action

This action lets you logically group actions in a workflow.

```json
"myScope": {
    "type": "scope",
    "actions": {
        "call_bing": {
            "type": "Http",
             "inputs": {
                "url": "http://www.bing.com"
            }
        }
    }
}
```

| Name | Required | Type | Description | 
| ---- | -------- | ---- | ----------- |  
| actions | Yes | Object | The inner actions to run inside the scope |
||||| 

## ForEach action

This looping action iterates through an array and performs inner actions on each array item. 
By default, the `foreach` loop runs in parallel and can run 20 executions in parallel at the same time. 
To set execution rules, use the `operationOptions` parameter.

```json
"forEach_email": {
    "type": "Foreach",
    "foreach": "@body('email_filter')",
    "actions": {
        "Send_email": {
            "type": "ApiConnection",
            "inputs": {
                "body": {
                    "to": "@item()",
                    "from": "me@contoso.com",
                    "message": "Hello, thank you for ordering"
                },
                "host": {
                    "connection": {
                        "id": "@parameters('$connections')['office365']['connection']['id']"
                    }
                }
            }
        }
    },
    "runAfter": {
        "email_filter": [ "Succeeded" ]
    }
}
```

| Name | Required | Type | Description | 
| ---- | -------- | ---- | ----------- | 
| actions | Yes | Object | The inner actions to run inside the loop | 
| foreach | Yes | String | The array to iterate through | 
| operationOptions | No | String | Specifies any operation options for customizing behavior. Currently supports only `Sequential` for sequentially running iterations where the default behavior is parallel. |
||||| 

## Until action

This looping action runs inner actions until a condition results to true.

```json
 "RunUntilSucceeded": {
    "type": "Until"
    "actions": {
        "Http": {
            "type": "Http",
            "inputs": {
                "method": "GET",
                "uri": "http://myurl"
            },
            "runAfter": {}
        }
    },
    "expression": "@equals(outputs('Http')['statusCode', 200)",
    "limit": {
        "count": 1000,
        "timeout": "PT1H"
    },
    "runAfter": {}
}
```

| Name | Required | Type | Description | 
| ---- | -------- | ---- | ----------- | 
| actions | Yes | Object | The inner actions to run inside the loop | 
| expression | Yes | String | The expression to evaluate after each iteration | 
| limit | Yes | Object | The limits for the loop. Must define at least one limit. | 
| count | No | Integer | The limit on the number of iterations to perform | 
| timeout | No | String | The timeout limit in [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601) that specifies how long the loop should run |
||||| 

## Next steps

* [Workflow Definition Language](../logic-apps/logic-apps-workflow-definition-language.md)
* [Workflow REST API](https://docs.microsoft.com/rest/api/logic/workflows)
