---
# required metadata
title: Workflow trigger and action types reference - Azure Logic Apps | Microsoft Docs
description: Learn about trigger and action types in Azure Logic Apps as described by the Workflow Definition Language schema
services: logic-apps
ms.service: logic-apps
author: kevinlam1
ms.author: klam 
manager: cfowler 
ms.topic: reference
ms.date: 05/01/2018

# optional metadata
ms.reviewer: klam, LADocs
ms.suite: integration
---

# Workflow Definition Language trigger and action types in Azure Logic Apps

In [Azure Logic Apps](../logic-apps/logic-apps-overview.md), 
all logic app workflows start with triggers followed by actions. 
This article describes the trigger and action types you can use 
when creating logic apps for automating tasks, processes, and workflows. 
You can visually create logic app workflows with the Logic Apps Designer, 
or by directly authoring the underlying workflow definitions with the 
[Workflow Definition Language](../logic-apps/logic-apps-workflow-definition-language.md). 
You can create logic apps either in the Azure portal or Visual Studio. 

<a name="triggers-overview"></a>

## Triggers overview

All logic apps start with a trigger, which defines the calls 
that can instantiate and start a logic app workflow. 
Here are the types of triggers you can use:

* A *polling* trigger, which checks a service's HTTP endpoint at regular intervals

* A *push* trigger, which calls the 
[Workflow Service REST API](https://docs.microsoft.com/rest/api/logic/workflows)
 
All triggers have these top-level elements, although some are optional:  
  
```json
"<triggerName>": {
   "type": "<triggerType>",
   "inputs": { "<trigger-behavior-settings>" },
   "recurrence": { 
      "frequency": "Second | Minute | Hour | Day | Week | Month | Year",
      "interval": "<recurrence-interval-based-on-frequency>"
   },
   "conditions": [ <array-with-required-conditions> ],
   "splitOn": "<property-used-for-creating-runs>",
   "operationOptions": "<optional-trigger-operations>"
}
```

*Required*

| Element | Type | Description | 
|---------|------|-------------| 
| <*triggerName*> | JSON Object | The name for the trigger, which is an object described in Javascript Object Notation (JSON) format  | 
| type | String | The trigger type, for example: "Http" or "ApiConnection" | 
| inputs | JSON Object | The trigger's inputs that define the trigger's behavior | 
| recurrence | JSON Object | The frequency and interval that describes how often the trigger fires |  
| frequency | String | The unit of time that describes how often the trigger fires: "Second", "Minute", "Hour", "Day", "Week", or "Month" | 
| interval | Integer | A positive integer that describes how often the trigger fires based on the frequency. <p>Here are the minimum and maximum intervals: <p>- Month: 1-16 months </br>- Day: 1-500 days </br>- Hour: 1-12,000 hours </br>- Minute: 1-72,000 minutes </br>- Second: 1-9,999,999 seconds<p>For example, if the interval is 6, and the frequency is "month", then the recurrence is every 6 months. | 
|||| 

*Optional*

| Element | Type | Description | 
|---------|------|-------------| 
| [conditions](#trigger-conditions) | Array | One or more conditions that determine whether to run the workflow | 
| [splitOn](#split-on-debatch) | String | An expression that splits up, or *debatches*, array items into multiple workflow instances for processing. This option is available for triggers that return an array and only when working directly in code view. | 
| [operationOptions](#trigger-operation-options) | String | Some triggers provide additional options that let you change the default trigger behavior | 
||||| 

## Trigger types

Each trigger type has a different interface and inputs that define the trigger's behavior. 

| Trigger type | Description | 
| ------------ | ----------- | 
| [**Recurrence**](#recurrence-trigger) | Fires based on a defined schedule. You can set a future date and time for firing this trigger. Based on the frequency, you can also specify times and days for running the workflow. | 
| [**Request**](#request-trigger)  | Makes your logic app into a callable endpoint, also known as a "manual" trigger. For example, see [Call, trigger, or nest workflows with HTTP endpoints](../logic-apps/logic-apps-http-endpoint.md). | 
| [**HTTP**](#http-trigger) | Checks, or *polls*, an HTTP web endpoint. The HTTP endpoint must conform to a specific trigger contract either by using a "202" asynchronous pattern or by returning an array. | 
| [**ApiConnection**](#apiconnection-trigger) | Works like the HTTP trigger, but uses [Microsoft-managed APIs](../connectors/apis-list.md). | 
| [**HTTPWebhook**](#httpwebhook-trigger) | Works like the Request trigger, but calls a specified URL for registering and unregistering. |
| [**ApiConnectionWebhook**](#apiconnectionwebhook-trigger) | Works like the HTTPWebhook trigger, but uses [Microsoft-managed APIs](../connectors/apis-list.md). | 
||| 

<a name="recurrence-trigger"></a>

## Recurrence trigger  

This trigger runs based on your specified recurrence and schedule 
and provides an easy way for regularly running a workflow. 

Here is the trigger definition:

```json
"Recurrence": {
   "type": "Recurrence",
   "recurrence": {
      "frequency": "Second | Minute | Hour | Day | Week | Month",
      "interval": <recurrence-interval-based-on-frequency>,
      "startTime": "<start-date-time-with-format-YYYY-MM-DDThh:mm:ss>",
      "timeZone": "<time-zone>",
      "schedule": {
         // Applies only when frequency is Day or Week. Separate values with commas.
         "hours": [ <one-or-more-hour-marks> ], 
         // Applies only when frequency is Day or Week. Separate values with commas.
         "minutes": [ <one-or-more-minute-marks> ], 
         // Applies only when frequency is Week. Separate values with commas.
         "weekDays": [ "Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday" ] 
      }
   },
   "runtimeConfiguration": {
      "concurrency": {
         "runs": <maximum-number-for-concurrently-running-workflow-instances>
      }
   },
   "operationOptions": "singleInstance"
}
```

*Required*

| Element | Type | Description | 
|---------|------|-------------| 
| Recurrence | JSON Object | The name for the trigger, which is an object described in Javascript Object Notation (JSON) format  | 
| type | String | The trigger type, which is "Recurrence" | 
| inputs | JSON Object | The trigger's inputs that define the trigger's behavior | 
| recurrence | JSON Object | The frequency and interval that describes how often the trigger fires |  
| frequency | String | The unit of time that describes how often the trigger fires: "Second", "Minute", "Hour", "Day", "Week", or "Month" | 
| interval | Integer | A positive integer that describes how often the trigger fires based on the frequency. <p>Here are the minimum and maximum intervals: <p>- Month: 1-16 months </br>- Day: 1-500 days </br>- Hour: 1-12,000 hours </br>- Minute: 1-72,000 minutes </br>- Second: 1-9,999,999 seconds<p>For example, if the interval is 6, and the frequency is "month", then the recurrence is every 6 months. | 
|||| 

*Optional*

| Element | Type | Description | 
|---------|------|-------------| 
| startTime | String | The start date and time in this format: <p>YYYY-MM-DDThh:mm:ss if you specify a time zone <p>-or- <p>YYYY-MM-DDThh:mm:ssZ if you don't specify a time zone <p>So for example, if you want September 18, 2017 at 2:00 PM, then specify "2017-09-18T14:00:00" and specify a time zone such as "Pacific Standard Time", or specify "2017-09-18T14:00:00Z" without a time zone. <p>**Note:** This start time must follow the [ISO 8601 date time specification](https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations) in [UTC date time format](https://en.wikipedia.org/wiki/Coordinated_Universal_Time), but without a [UTC offset](https://en.wikipedia.org/wiki/UTC_offset). If you don't specify a time zone, you must add the letter "Z" at the end without any spaces. This "Z" refers to the equivalent [nautical time](https://en.wikipedia.org/wiki/Nautical_time). <p>For simple schedules, the start time is the first occurrence, while for complex schedules, the trigger doesn't fire any sooner than the start time. For more information about start dates and times, see [Create and schedule regularly running tasks](../connectors/connectors-native-recurrence.md). | 
| timeZone | String | Applies only when you specify a start time because this trigger doesn't accept [UTC offset](https://en.wikipedia.org/wiki/UTC_offset). Specify the time zone that you want to apply. | 
| hours | Integer or integer array | If you specify "Day" or "Week" for `frequency`, you can specify one or more integers from 0 to 23, separated by commas, as the hours of the day when you want to run the workflow. <p>For example, if you specify "10", "12" and "14", you get 10 AM, 12 PM, and 2 PM as the hour marks. | 
| minutes | Integer or integer array | If you specify "Day" or "Week" for `frequency`, you can specify one or more integers from 0 to 59, separated by commas, as the minutes of the hour when you want to run the workflow. <p>For example, you can specify "30" as the minute mark and using the previous example for hours of the day, you get 10:30 AM, 12:30 PM, and 2:30 PM. | 
| weekDays | String or string array | If you specify "Week" for `frequency`, you can specify one or more days, separated by commas, when you want to run the workflow: "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", and "Sunday" | 
| concurrency | JSON Object | For recurring and polling triggers, this object specifies the maximum number of workflow instances that can run at the same time. Use this value to limit the requests that backend systems receive. <p>For example, this value sets the concurrency limit to 10 instances: `"concurrency": { "runs": 10 }` | 
| operationOptions | String | The `singleInstance` option specifies that the trigger fires only after all active runs are finished. See [Triggers: Fire only after active runs finish](#single-instance). | 
|||| 

*Example 1*

This basic recurrence trigger runs daily:

```json
"recurrenceTriggerName": {
   "type": "Recurrence",
   "recurrence": {
      "frequency": "Day",
      "interval": 1
   }
}
```

*Example 2*

You can specify a start date and time for firing the trigger. 
This recurrence trigger starts on the specified date and then fires daily:

```json
"recurrenceTriggerName": {
   "type": "Recurrence",
   "recurrence": {
      "frequency": "Day",
      "interval": 1,
      "startTime": "2017-09-18T00:00:00Z"
   }
}
```

*Example 3*

This recurrence trigger starts on September 9, 2017 at 2:00 PM, 
and fires weekly every Monday at 10:30 AM, 12:30 PM, 
and 2:30 PM Pacific Standard Time:

``` json
"myRecurrenceTrigger": {
   "type": "Recurrence",
   "recurrence": {
      "frequency": "Week",
      "interval": 1,
      "schedule": {
         "hours": [ 10, 12, 14 ],
         "minutes": [ 30 ],
         "weekDays": [ "Monday" ]
      },
      "startTime": "2017-09-07T14:00:00",
      "timeZone": "Pacific Standard Time"
   }
}
```

For more information plus examples for this trigger, 
see [Create and schedule regularly running tasks](../connectors/connectors-native-recurrence.md).

<a name="request-trigger"></a>

## Request trigger

This trigger makes your logic app callable by creating 
an endpoint that can accept incoming HTTP requests. 
To call this trigger, you must use the `listCallbackUrl` API in the 
[Workflow Service REST API](https://docs.microsoft.com/rest/api/logic/workflows). 
To learn how to use this trigger as an HTTP endpoint, see 
[Call, trigger, or nest workflows with HTTP endpoints](../logic-apps/logic-apps-http-endpoint.md).

```json
"manual": {
   "type": "Request",
   "kind": "Http",
   "inputs": {
      "method": "GET | POST | PUT | PATCH | DELETE | HEAD",
      "relativePath": "<relative-path-for-accepted-parameter>",
      "schema": {
         "type": "object",
         "properties": { 
            "<propertyName>": {
               "type": "<property-type>"
            }
         },
         "required": [ "<required-properties>" ]
      }
   }
}
```

*Required*

| Element | Type | Description | 
|---------|------|-------------| 
| manual | JSON Object | The name for the trigger, which is an object described in Javascript Object Notation (JSON) format  | 
| type | String | The trigger type, which is "Request" | 
| kind | String | The type of request, which is "Http" | 
| inputs | JSON Object | The trigger's inputs that define the trigger's behavior | 
|||| 

*Optional*

| Element | Type | Description | 
|---------|------|-------------| 
| method | String | The method that requests must use to call the trigger: "GET", "PUT", "POST", "PATCH", "DELETE", or "HEAD" |
| relativePath | String | The relative path for the parameter that your HTTP endpoint's URL accepts | 
| schema | JSON Object | The JSON schema that describes and validates the payload, or inputs, that the trigger receives from the incoming request. This schema helps subsequent workflow actions know the properties to reference. | 
| properties | JSON Object | One or more properties in the JSON schema that describes the payload | 
| required | Array | One or more properties that require values | 
|||| 

*Example*

This request trigger specifies that an incoming request 
use the HTTP POST method to call the trigger and a 
schema that validates input from the incoming request: 

```json
"myRequestTrigger": {
   "type": "Request",
   "kind": "Http",
   "inputs": {
      "method": "POST",
      "schema": {
         "type": "Object",
         "properties": {
            "customerName": {
               "type": "String"
            },
            "customerAddress": { 
               "type": "Object",
               "properties": {
                  "streetAddress": {
                     "type": "String"
                  },
                  "city": {
                     "type": "String"
                  }
               }
            }
         }
      }
   }
} 
```

<a name="http-trigger"></a>

## HTTP trigger  

This trigger polls a specified endpoint and checks the response. 
The response determines whether the workflow should run or not. 
The `inputs` JSON object includes and requires the `method` 
and `uri` parameters required for constructing the HTTP call:

```json
"HTTP": {
   "type": "Http",
   "inputs": {
      "method": "GET | PUT | POST | PATCH | DELETE | HEAD",
      "uri": "<HTTP-or-HTTPS-endpoint-to-poll>",
      "queries": "<query-parameters>",
      "headers": { "<headers-for-request>" },
      "body": { "<payload-to-send>" },
      "authentication": { "<authentication-method>" },
      "retryPolicy": {
          "type": "<retry-policy-type>",
          "interval": "<retry-interval>",
          "count": <number-retry-attempts>
      }
   },
   "recurrence": {
      "frequency": "Second | Minute | Hour | Day | Week | Month | Year",
      "interval": <recurrence-interval-based-on-frequency>
   },
   "runtimeConfiguration": {
      "concurrency": {
         "runs": <maximum-number-for-concurrently-running-workflow-instances>
      }
   },
   "operationOptions": "singleInstance"
}
```

*Required*

| Element | Type | Description | 
|---------|------|-------------| 
| HTTP | JSON Object | The name for the trigger, which is an object described in Javascript Object Notation (JSON) format  | 
| type | String | The trigger type, which is "Http" | 
| inputs | JSON Object | The trigger's inputs that define the trigger's behavior | 
| method | Yes | String | The HTTP method for polling the specified endpoint: "GET", "PUT", "POST", "PATCH", "DELETE", or "HEAD" | 
| uri | Yes| String | The HTTP or HTTPS endpoint URL that the trigger checks or polls <p>Maximum string size: 2 KB | 
| recurrence | JSON Object | The frequency and interval that describes how often the trigger fires |  
| frequency | String | The unit of time that describes how often the trigger fires: "Second", "Minute", "Hour", "Day", "Week", or "Month" | 
| interval | Integer | A positive integer that describes how often the trigger fires based on the frequency. <p>Here are the minimum and maximum intervals: <p>- Month: 1-16 months </br>- Day: 1-500 days </br>- Hour: 1-12,000 hours </br>- Minute: 1-72,000 minutes </br>- Second: 1-9,999,999 seconds<p>For example, if the interval is 6, and the frequency is "month", then the recurrence is every 6 months. | 
|||| 

*Optional*

| Element | Type | Description | 
|---------|------|-------------| 
| queries | JSON Object | Any query parameters that you want to include with the URL <p>For example, this element adds the `?api-version=2015-02-01` query string to the URL: <p>`"queries": { "api-version": "2015-02-01" }` <p>Result: `https://contoso.com?api-version=2015-02-01` | 
| headers | JSON Object | One or more headers to send with the request <p>For example, to set the language and type for a request: <p>`"headers": { "Accept-Language": "en-us", "Content-Type": "application/json" }` | 
| body | JSON Object | The payload (data) to send to the endpoint | 
| authentication | JSON Object | The method that the incoming request should use for authentication. For more information, see [Scheduler Outbound Authentication](../scheduler/scheduler-outbound-authentication.md). Beyond Scheduler, the `authority` property is supported. When not specified, the default value is `https://login.windows.net`, but you can use a different value, such as`https://login.windows\-ppe.net`. | 
| retryPolicy | JSON Object | This object customizes the retry behavior for intermittent errors that have 4xx or 5xx status codes. For more information, see [Retry policies](../logic-apps/logic-apps-exception-handling.md). | 
| concurrency | JSON Object | For recurring and polling triggers, this object specifies the maximum number of workflow instances that can run at the same time. Use this value to limit the requests that backend systems receive. <p>For example, this value sets the concurrency limit to 10 instances: <p>`"concurrency": { "runs": 10 }` | 
| operationOptions | String | The `singleInstance` option specifies that the trigger fires only after all active runs are finished. See [Triggers: Fire only after active runs finish](#single-instance). | 
|||| 

To work well with your logic app, the HTTP trigger requires that the HTTP API 
conform to a specific pattern. The HTTP trigger recognizes these properties:  
  
| Response | Required | Description | 
|----------|----------|-------------|  
| Status code | Yes | The "200 OK" status code starts a run. Any other status code doesn't start a run. | 
| Retry-after header | No | The number of seconds until the logic app polls the endpoint again | 
| Location header | No | The URL to call at the next polling interval. If not specified, the original URL is used. | 
|||| 

*Example behaviors for different requests*

| Status code | Retry after | Behavior | 
|-------------|-------------|----------|
| 200 | {none} | Run the workflow, then check again for more data after the defined recurrence. | 
| 200 | 10 seconds | Run the workflow, then check again for more data after 10 seconds. |  
| 202 | 60 seconds | Don't trigger the workflow. The next attempt happens in one minute, subject to the defined recurrence. If the defined recurrence is less than one minute, the retry-after header takes precedence. Otherwise, the defined recurrence is used. | 
| 400 | {none} | Bad request, don't run the workflow. If no `retryPolicy` is defined, then the default policy is used. After the number of retries has been reached, the trigger checks again for data after the defined recurrence. | 
| 500 | {none}| Server error, don't run the workflow. If no `retryPolicy` is defined, then the default policy is used. After the number of retries has been reached, the trigger checks again for data after the defined recurrence. | 
|||| 

### HTTP trigger outputs

| Element | Type | Description |
|---------|------|-------------|
| headers | JSON Object | The headers from the HTTP response | 
| body | JSON Object | The body from the HTTP response | 
|||| 

<a name="apiconnection-trigger"></a>

## APIConnection trigger  

This trigger works like the [HTTP trigger](#http-trigger), 
but uses [Microsoft-managed APIs](../connectors/apis-list.md) 
so the parameters for this trigger differ. 

Here is the trigger definition, although many sections are optional, 
so the trigger's behavior depends on whether or not sections are included:

```json
"<APIConnectionTriggerName>": {
   "type": "ApiConnection",
   "inputs": {
      "host": {
         "api": {
            "runtimeUrl": "<managed-API-endpoint-URL>"
         },
         "connection": {
            "name": "@parameters('$connections')['<connection-name>'].name"
         },
      },
      "method": "GET | PUT | POST | PATCH | DELETE | HEAD",
      "queries": "<query-parameters>",
      "headers": { "<headers-for-request>" },
      "body": { "<payload-to-send>" },
      "authentication": { "<authentication-method>" },
      "retryPolicy": {
          "type": "<retry-policy-type>",
          "interval": "<retry-interval>",
          "count": <number-retry-attempts>
      }
   },
   "recurrence": {
      "frequency": "Second | Minute | Hour | Day | Week | Month | Year",
      "interval": "<recurrence-interval-based-on-frequency>"
   },
   "runtimeConfiguration": {
      "concurrency": {
         "runs": <maximum-number-for-concurrently-running-workflow-instances>
      }
   },
   "operationOptions": "singleInstance"
}
```

*Required*

| Element | Type | Description | 
|---------|------|-------------| 
| *APIConnectionTriggerName* | JSON Object | The name for the trigger, which is an object described in Javascript Object Notation (JSON) format  | 
| type | String | The trigger type, which is "ApiConnection" | 
| inputs | JSON Object | The trigger's inputs that define the trigger's behavior | 
| host | JSON Object | The JSON object that describes the host gateway and ID for the managed API <p>The `host` JSON object has these elements: `api` and `connection` | 
| api | JSON Object | The endpoint URL for the managed API: <p>`"runtimeUrl": "<managed-API-endpoint-URL>"` | 
| connection | JSON Object | The name for the managed API connection that the workflow uses, which must include a reference to a parameter named `$connection`: <p>`"name": "@parameters('$connections')['<connection-name>'].name"` | 
| method | String | The HTTP method for communicating with the managed API: "GET", "PUT", "POST", "PATCH", "DELETE", or "HEAD" | 
| recurrence | JSON Object | The frequency and interval that describes how often the trigger fires |  
| frequency | String | The unit of time that describes how often the trigger fires: "Second", "Minute", "Hour", "Day", "Week", or "Month" | 
| interval | Integer | A positive integer that describes how often the trigger fires based on the frequency. <p>Here are the minimum and maximum intervals: <p>- Month: 1-16 months </br>- Day: 1-500 days </br>- Hour: 1-12,000 hours </br>- Minute: 1-72,000 minutes </br>- Second: 1-9,999,999 seconds<p>For example, if the interval is 6, and the frequency is "month", then the recurrence is every 6 months. | 
|||| 

*Optional*

| Element | Type | Description | 
|---------|------|-------------| 
| queries | JSON Object | Any query parameters that you want to include with the URL <p>For example, this element adds the `?api-version=2015-02-01` query string to the URL: <p>`"queries": { "api-version": "2015-02-01" }` <p>Result: `https://contoso.com?api-version=2015-02-01` | 
| headers | JSON Object | One or more headers to send with the request <p>For example, to set the language and type for a request: <p>`"headers": { "Accept-Language": "en-us", "Content-Type": "application/json" }` | 
| body | JSON Object | The JSON object that describes the payload (data) to send to the managed API | 
| authentication | JSON Object | The method that an incoming request should use for authentication. For more information, see [Scheduler Outbound Authentication](../scheduler/scheduler-outbound-authentication.md). |
| retryPolicy | JSON Object | This object customizes the retry behavior for intermittent errors that have 4xx or 5xx status codes: <p>`"retryPolicy": { "type": "<retry-policy-type>", "interval": "<retry-interval>", "count": <number-retry-attempts> }` <p>For more information, see [Retry policies](../logic-apps/logic-apps-exception-handling.md). | 
| concurrency | JSON Object | For recurring and polling triggers, this object specifies the maximum number of workflow instances that can run at the same time. Use this value to limit the requests that backend systems receive. <p>For example, this value sets the concurrency limit to 10 instances: `"concurrency": { "runs": 10 }` | 
| operationOptions | String | The `singleInstance` option specifies that the trigger fires only after all active runs are finished. See [Triggers: Fire only after active runs finish](#single-instance). | 
||||

*Example*

```json
"Create_daily_report": {
   "type": "ApiConnection",
   "inputs": {
      "host": {
         "api": {
            "runtimeUrl": "https://myReportsRepo.example.com/"
         },
         "connection": {
            "name": "@parameters('$connections')['<connection-name>'].name"
         }     
      },
      "method": "POST",
      "body": {
         "category": "statusReports"
      }  
   },
   "recurrence": {
      "frequency": "Day",
      "interval": 1
   }
}
```

### APIConnection trigger outputs
 
| Element | Type | Description |
|---------|------|-------------| 
| headers | JSON Object | The headers from the HTTP response | 
| body | JSON Object | The body from the HTTP response | 
|||| 

<a name="httpwebhook-trigger"></a>

## HTTPWebhook trigger  

This trigger works like the [Request trigger](#request-trigger) by 
creating a callable endpoint for your logic app. However, 
this trigger also calls a specified endpoint URL for registering 
or unregistering a subscription. You can specify limits on a 
webhook trigger in the same way as [HTTP Asynchronous Limits](#asynchronous-limits). 

Here is the trigger definition, though many sections are optional, 
and the trigger's behavior depends on the sections that you use or omit:

```json
"HTTP_Webhook": {
    "type": "HttpWebhook",
    "inputs": {
        "subscribe": {
            "method": "POST",
            "uri": "<subscribe-to-endpoint-URL>",
            "headers": { "<headers-for-request>" },
            "body": {
                "hub.callback": "@{listCallbackUrl()}",
                "hub.mode": "subscribe",
                "hub.topic": "<subscription-topic>"
            },
            "authentication": {},
            "retryPolicy": {}
        },
        "unsubscribe": {
            "method": "POST",
            "url": "<unsubscribe-from-endpoint-URL>",
            "body": {
                "hub.callback": "@{workflow().endpoint}@{listCallbackUrl()}",
                "hub.mode": "unsubscribe",
                "hub.topic": "<subscription-topic>"
            },
            "authentication": {}
        }
    },
}
```

*Required*

| Element | Type | Description | 
|---------|------|-------------| 
| HTTP_Webhook | JSON Object | The name for the trigger, which is an object described in Javascript Object Notation (JSON) format  | 
| type | String | The trigger type, which is "HttpWebhook" | 
| inputs | JSON Object | The trigger's inputs that define the trigger's behavior | 
| subscribe | JSON Object| The outgoing request to call and perform the initial registration when the trigger is created. This call happens so that the trigger can start listening to events at the endpoint. For more information, see [subscribe and unsubscribe](#subscribe-unsubscribe). | 
| method | String | The HTTP method used for the subscription request: "GET", "PUT", "POST", "PATCH", "DELETE", or "HEAD" | 
| uri | String | The endpoint URL for where to send the subscription request | 
|||| 

*Optional*

| Element | Type | Description | 
|---------|------|-------------| 
| unsubscribe | JSON Object | The outgoing request to automatically call and cancel the subscription when an operation makes the trigger invalid. For more information, see [subscribe and unsubscribe](#subscribe-unsubscribe). | 
| method | String | The HTTP method to use for the cancellation request: "GET", "PUT", "POST", "PATCH", "DELETE", or "HEAD" | 
| uri | String | The endpoint URL for where to send the cancellation request | 
| body | JSON Object | The JSON object that describes the payload (data) for the subscription or cancellation request | 
| authentication | JSON Object | The method that an incoming request should use for authentication. For more information, see [Scheduler Outbound Authentication](../scheduler/scheduler-outbound-authentication.md). |
| retryPolicy | JSON Object | This object customizes the retry behavior for intermittent errors that have 4xx or 5xx status codes: <p>`"retryPolicy": { "type": "<retry-policy-type>", "interval": "<retry-interval>", "count": <number-retry-attempts> }` <p>For more information, see [Retry policies](../logic-apps/logic-apps-exception-handling.md). | 
|||| 

*Example*

```json
"myAppSpotTrigger": {
   "type": "HttpWebhook",
   "inputs": {
      "subscribe": {
         "method": "POST",
         "uri": "https://pubsubhubbub.appspot.com/subscribe",
         "headers": {},
         "body": {
            "hub.callback": "@{listCallbackUrl()}",
            "hub.mode": "subscribe",
            "hub.topic": "https://pubsubhubbub.appspot.com/articleCategories/technology"
         },
      },
      "unsubscribe": {
         "method": "POST",
         "url": "https://pubsubhubbub.appspot.com/subscribe",
         "body": {
            "hub.callback": "@{workflow().endpoint}@{listCallbackUrl()}",
            "hub.mode": "unsubscribe",
            "hub.topic": "https://pubsubhubbub.appspot.com/articleCategories/technology"
         },
      }
   },
}
```

<a name="subscribe-unsubscribe"></a>

### `subscribe` and `unsubscribe`

The `subscribe` call happens when the workflow changes in any way, 
for example, when credentials are renewed, or the trigger's input parameters change. 
The call uses the same parameters as standard HTTP actions. 
 
The `unsubscribe` call automatically happens when an operation 
makes the HTTPWebhook trigger invalid, for example:

* Deleting or disabling the trigger. 
* Deleting or disabling the workflow. 
* Deleting or disabling the subscription. 

To support these calls, the `@listCallbackUrl()` function returns a 
unique "callback URL" for this trigger. This URL represents a unique 
identifier for the endpoints that use the service's REST API. 
The parameters for this function are the same as the HTTP trigger.

### HTTPWebhook trigger outputs

| Element | Type | Description |
|---------|------|-------------| 
| headers | JSON Object | The headers from the HTTP response | 
| body | JSON Object | The body from the HTTP response | 
|||| 

<a name="apiconnectionwebhook-trigger"></a>

## ApiConnectionWebhook trigger

This trigger works like the [HTTPWebhook trigger](#httpwebhook-trigger), 
but uses [Microsoft-managed APIs](../connectors/apis-list.md). 

Here is the trigger definition:

```json
"<ApiConnectionWebhookTriggerName>": {
   "type": "ApiConnectionWebhook",
   "inputs": {
      "host": {
         "connection": {
            "name": "@parameters('$connections')['<connection-name>']['connectionId']"
         }
      },        
      "body": {
          "NotificationUrl": "@{listCallbackUrl()}"
      },
      "queries": "<query-parameters>"
   }
}
```

*Required*

| Element | Type | Description | 
|---------|------|-------------| 
| <*ApiConnectionWebhookTriggerName*> | JSON Object | The name for the trigger, which is an object described in Javascript Object Notation (JSON) format  | 
| type | String | The trigger type, which is "ApiConnectionWebhook" | 
| inputs | JSON Object | The trigger's inputs that define the trigger's behavior | 
| host | JSON Object | The JSON object that describes the host gateway and ID for the managed API <p>The `host` JSON object has these elements: `api` and `connection` | 
| connection | JSON Object | The name for the managed API connection that the workflow uses, which must include a reference to a parameter named `$connection`: <p>`"name": "@parameters('$connections')['<connection-name>']['connectionId']"` | 
| body | JSON Object | The JSON object that describes the payload (data) to send to the managed API | 
| NotificationUrl | String | Returns a unique "callback URL" for this trigger that the managed API can use | 
|||| 

*Optional*

| Element | Type | Description | 
|---------|------|-------------| 
| queries | JSON Object | Any query parameters that you want to include with the URL <p>For example, this element adds the `?folderPath=Inbox` query string to the URL: <p>`"queries": { "folderPath": "Inbox" }` <p>Result: `https://<managed-API-URL>?folderPath=Inbox` | 
|||| 

<a name="trigger-conditions"></a>

## Triggers: Conditions

For any trigger, you can include an array with one or more 
conditions that determine whether the workflow should run or not. 
In this example, the report trigger fires only while 
the workflow's `sendReports` parameter is set to true. 

```json
"myDailyReportTrigger": {
   "type": "Recurrence",
   "conditions": [ {
      "expression": "@parameters('sendReports')"
   } ],
   "recurrence": {
      "frequency": "Day",
      "interval": 1
   }
}
```

Also, conditions can reference the trigger's status code. 
For example, suppose you want to start a workflow only 
when your website returns a "500" status code:

``` json
"conditions": [ {
   "expression": "@equals(triggers().code, 'InternalServerError')"  
} ]  
```  

> [!NOTE]
> By default, a trigger fires only on receiving a "200 OK" response. 
> When an expression references a trigger's status code in any way, 
> the trigger's default behavior is replaced. So, if you want the 
> trigger to fire for multiple status codes, for example, 
> status code 200 and status code 201, 
> you must include this statement as your condition: 
>
> `@or(equals(triggers().code, 200),equals(triggers().code, 201))` 

<a name="split-on-debatch"></a>

## Triggers: Split an array into multiple runs

If your trigger returns an array for your logic app to process, 
sometimes a "for each" loop might take too long to process each array item. 
Instead, you can use the **SplitOn** property in your trigger to *debatch* the array. 

Debatching splits up the array items and starts a new logic app instance 
that runs for each array item. This approach is useful, for example, 
when you want to poll an endpoint that might return multiple new items between polling intervals.
For the maximum number of array items that **SplitOn** can process in a single logic app run, 
see [Limits and configuration](../logic-apps/logic-apps-limits-and-config.md). 

> [!NOTE]
> You can add **SplitOn** only to triggers by manually defining or overriding 
> in code view for your logic app's JSON definition. You can't use **SplitOn** 
> when you want to implement a synchronous response pattern. 
> Any workflow that uses **SplitOn** and includes a response action 
> runs asynchronously and immediately sends a `202 ACCEPTED` response.

If your trigger's Swagger file describes a payload that is an array, 
the **SplitOn** property is automatically added to your trigger. 
Otherwise, add this property inside the response payload that has the array 
you want to debatch. 

For example, suppose you have an API that returns this response: 
  
```json
{
    "Status": "Succeeded",
    "Rows": [ 
        { 
            "id": 938109380,
            "name": "customer-name-one"
        },
        {
            "id": 938109381,
            "name": "customer-name-two"
        }
    ]
}
```
  
Your logic app only needs the content from `Rows`, 
so you can create a trigger like this example.

``` json
"myDebatchTrigger": {
    "type": "Http",
    "recurrence": {
        "frequency": "Second",
        "interval": 1
    },
    "inputs": {
        "uri": "https://mydomain.com/myAPI",
        "method": "GET"
    },
    "splitOn": "@triggerBody()?.Rows"
}
```

> [!NOTE]
> If you use the `SplitOn` command, you can't get the properties that are outside the array. 
> So for this example, you can't get the `status` property in the response returned from the API.
> 
> To avoid a failure if the `Rows` property doesn't exist, 
> this example uses the `?` operator.

Your workflow definition can now use `@triggerBody().name` 
to get `customer-name-one` from the first run 
and `customer-name-two` from the second run. 
So, your trigger outputs look like these examples:

```json
{
    "body": {
        "id": 938109380,
        "name": "customer-name-one"
    }
}
```

```json
{
    "body": {
        "id": 938109381,
        "name": "customer-name-two"
    }
}
```

<a name="trigger-operation-options"></a>

## Triggers: Operation options

These triggers provide more options that let you change the default behavior.

| Trigger | Operation option | Description |
|---------|------------------|-------------|
| [Recurrence](#recurrence-trigger), <br>[HTTP](#http-trigger), <br>[ApiConnection](#apiconnection-trigger) | singleInstance | Fire the trigger only after all active runs have finished. |
||||

<a name="single-instance"></a>

### Triggers: Fire only after active runs finish

For triggers where you can set the recurrence, 
you can specify that the trigger fire only after all active runs have finished. 
If a scheduled recurrence happens while a workflow instance is running, 
the trigger skips and waits until the next scheduled recurrence before checking again. 
For example:

```json
"myRecurringTrigger": {
    "type": "Recurrence",
    "recurrence": {
        "frequency": "Hour",
        "interval": 1,
    },
    "operationOptions": "singleInstance"
}
```

<a name="actions-overview"></a>

## Actions overview

Azure Logic Apps provides various action types - each with 
different inputs that define an action's unique behavior. 
For example, here are some commonly used action types: 

* **HTTP** and **ApiConnection**, which call HTTP endpoints
* **Function**, which calls an Azure Function
* **Join**, **Query**, **Compose**, **Table**, and **Select**, 
which create or transform data from various inputs
* **If**, **ForEach**, and **Until**, which control 
workflow execution and contain other actions

## Built-in action types

| Action type | Description | 
|-------------|-------------|  
| [**Compose**](#compose-action) | Creates a single output from inputs, which can have various types. | 
| [**Function**](#function-action) | Calls an Azure Function. | 
| [**HTTP**](#http-action) | Calls an HTTP endpoint. | 
| [**Join**](#join-action) | Creates a string from all the items in an array and separates those items with a specified delimiter character. | 
| [**Parse JSON**](#parse-json-action) | Creates user-friendly tokens from properties in JSON content. You can then reference those properties by including the tokens in your logic app. | 
| [**Query**](#query-action) | Creates an array from items in another array based on a condition or filter. | 
| [**Response**](#response-action) | Creates a response to an incoming call or request. | 
| [**Select**](#select-action) | Creates an array with JSON objects by transforming items from another array based on the specified map. | 
| [**Table**](#table-action) | Creates a CSV or HTML table from an array. | 
| [**Terminate**](#terminate-action) | Stops an actively running workflow. | 
| [**Wait**](#wait-action) | Pauses your workflow for a specified duration or until the specified date and time. | 
| [**Workflow**](#workflow-action) | Nests a workflow inside another workflow. | 
||| 

## Control workflow action types

| Action type | Description | 
|-------------|-------------| 
| [**ForEach**](#foreach-action) | Run the same actions in a loop for every item in an array. | 
| [**If**](#if-action) | Run actions based on whether the specified condition is true or false. | 
| [**Scope**](#scope-action) | Run actions based on the group status from a set of actions. | 
| [**Switch**](#switch-action) | Run actions organized into cases when values from expressions, objects, or tokens match the values specified by each case. | 
| [**Until**](#until-action) | Run actions in a loop until the specified condition is true. | 
|||  

## Standard action types

| Action type | Description | 
|-------------|-------------|  
| [**ApiConnection**](#apiconnection-action) | Calls an HTTP endpoint by using a [Microsoft-managed API](../connectors/apis-list.md). | 
| [**ApiConnectionWebhook**](#apiconnectionwebhook-action) | Works like HTTPWebhook but uses a [Microsoft-managed API](../connectors/apis-list.md). | 
||| 

<a name="apiconnection-action"></a>

### APIConnection action

This action sends an HTTP request to a 
[Microsoft-managed API](../connectors/apis-list.md) 
and requires information about the API and parameters 
plus a reference to a valid connection. 

``` json
"<action-name>": {
   "type": "ApiConnection",
   "inputs": {
      "host": {
         "connection": {
            "name": "@parameters('$connections')['<api-name>']['connectionId']"
         },
         "<other-action-specific-input-properties>"        
      },
      "method": "<method-type>",
      "path": "/<api-operation>",
      "retryPolicy": "<retry-behavior>",
      "queries": { "<query-parameters>" },
      "<other-action-specific-properties>"
    },
    "runAfter": {}
}
```

*Required*

| Value | Type | Description | 
|-------|------|-------------| 
| <*action-name*> | String | The name of the action provided by the connector | 
| <*api-name*> | String | The name of the Microsoft-managed API that is used for the connection | 
| <*method-type*> | String | The HTTP method for calling the API: "GET", "PUT", "POST", "PATCH", or "DELETE" | 
| <*api-operation*> | String | The API operation to call | 
|||| 

*Optional*

| Value | Type | Description | 
|-------|------|-------------| 
| <*other-action-specific-input-properties*> | JSON Object | Any other input properties that apply to this specific action | 
| <*retry-behavior*> | JSON Object | Customizes the retry behavior for intermittent failures, which have the 408, 429, and 5XX status code, and any connectivity exceptions. For more information, see [Retry policies](../logic-apps/logic-apps-exception-handling.md). | 
| <*query-parameters*> | JSON Object | Any query parameters to include with the API call. <p>For example, the `"queries": { "api-version": "2018-01-01" }` object adds `?api-version=2018-01-01` to the call. | 
| <*other-action-specific-properties*> | JSON Object | Any other properties that apply to this specific action | 
|||| 

*Example*

This definition describes the **Send an email** action for 
Office 365 Outlook connector, which is a Microsoft-managed API: 

```json
"Send_an_email": {
   "type": "ApiConnection",
   "inputs": {
      "body": {
         "Body": "Thank you for your membership!",
         "Subject": "Hello and welcome!",
         "To": "Sophie.Owen@contoso.com"
      },
      "host": {
         "connection": {
            "name": "@parameters('$connections')['office365']['connectionId']"
         }
      },
      "method": "POST",
      "path": "/Mail"
    },
    "runAfter": {}
}
```

<a name="apiconnectionwebhook-action"></a>

## APIConnectionWebhook action

This action sends a subscription request over HTTP to an endpoint 
by using a [Microsoft-managed API](../connectors/apis-list.md), 
provides a *callback URL* to where the endpoint can send a response, 
and waits for the endpoint to respond. 

```json
"<action-name>": {
   "type": "ApiConnectionWebhook",
   "inputs": {
      "subscribe": {
         "method": "<method-type>",
         "uri": "<api-subscription-URL>",
         "headers": { "<header-content>" },
         "body": "<body-content>",
         "authentication": { "<authentication-method>" },
         "retryPolicy": "<retry-behavior>",
         "queries": { "<query-parameters>" },
         "<other-action-specific-input-properties>"
      },
      "unsubscribe": {
         "method": "<method-type>",
         "uri": "<api-subscription-URL>",
         "headers": { "<header-content>" },
         "body": "<body-content>",
         "authentication": { "<authentication-method>" },
         "<other-action-specific-properties>"
      },
   },
   "runAfter": {}
}
```

Some values, such as <*method-type*>, are available for 
both the `"subscribe"` and `"unsubscribe"` objects.

*Required*

| Value | Type | Description | 
|-------|------|-------------| 
| <*action-name*> | String | The name of the action provided by the connector | 
| <*method-type*> | String | The HTTP method to use for subscribing or unsubscribing from an endpoint: "GET", "PUT", "POST", "PATCH", or "DELETE" | 
| <*api-subscription-URL*> | String | The URI to use for subscribing or unsubscripting from an endpoint | 
|||| 

*Optional*

| Value | Type | Description | 
|-------|------|-------------| 
| <*header-content*> | JSON Object | Any headers to send in the request <p>For example, to set the language and type on a request: <p>`"headers": { "Accept-Language": "en-us", "Content-Type": "application/json" }` |
| <*body-content*> | JSON Object | Any message content to send in the request | 
| <*authentication-method*> | JSON Object | The method the request uses for authentication. For more information, see [Scheduler Outbound Authentication](../scheduler/scheduler-outbound-authentication.md). |
| <*retry-behavior*> | JSON Object | Customizes the retry behavior for intermittent failures, which have the 408, 429, and 5XX status code, and any connectivity exceptions. For more information, see [Retry policies](../logic-apps/logic-apps-exception-handling.md). | 
| <*query-parameters*> | JSON Object | Any query parameters to include with the API call <p>For example, the `"queries": { "api-version": "2018-01-01" }` object adds `?api-version=2018-01-01` to the call. | 
| <*other-action-specific-input-properties*> | JSON Object | Any other input properties that apply to this specific action | 
| <*other-action-specific-properties*> | JSON Object | Any other properties that apply to this specific action | 
|||| 

You can also specify limits on an **ApiConnectionWebhook** action 
in the same way as [HTTP asynchronous limits](#asynchronous-limits).

<a name="compose-action"></a>

## Compose action

This action creates a single output from multiple inputs, 
including expressions. Both the output and inputs can 
have any type that Azure Logic Apps natively supports, 
such as arrays, JSON objects, XML, and binary.
You can then use the action's output in other actions. 

```json
"Compose": {
   "type": "Compose",
   "inputs": "<inputs-to-compose>",
   "runAfter": {}
},
```

*Required* 

| Value | Type | Description | 
|-------|------|-------------| 
| <*inputs-to-compose*> | Any | The inputs for creating a single output | 
|||| 

*Example 1*

This action definition merges `abcdefg ` 
with a trailing space and the value `1234`:

```json
"Compose": {
   "type": "Compose",
   "inputs": "abcdefg 1234",
   "runAfter": {}
},
```

Here is the output that this action creates:

`abcdefg 1234`

*Example 2*

This action definition merges a string variable that contains 
`abcdefg` and an integer variable that contains `1234`:

```json
"Compose": {
   "type": "Compose",
   "inputs": "@{variables('myString')}@{variables('myInteger')}",
   "runAfter": {}
},
```

Here is the output that this action creates:

`"abcdefg1234"`

<a name="function-action"></a>

## Function action

This action calls a previously created 
[Azure function](../azure-functions/functions-create-first-azure-function.md).

```json
"<Azure-function-name>": {
   "type": "Function",
   "inputs": {
     "function": {
        "id": "<Azure-function-ID>"
      },
      "method": "<method-type>",
      "headers": { "<header-content>" },
      "body": { "<body-content>" },
      "queries": { "<query-parameters>" } 
   },
   "runAfter": {}
}
```

*Required*

| Value | Type | Description | 
|-------|------|-------------|  
| <*Azure-function-ID*> | String | The resource ID for the Azure function you want to call. Here is the format for this value:<p>"/subscriptions/<*Azure-subscription-ID*>/resourceGroups/<*Azure-resource-group*>/providers/Microsoft.Web/sites/<*Azure-function-app-name*>/functions/<*Azure-function-name*>" | 
| <*method-type*> | String | The HTTP method to use for calling the function: "GET", "PUT", "POST", "PATCH", or "DELETE" <p>If not specified, the default is the "POST" method. | 
||||

*Optional*

| Value | Type | Description | 
|-------|------|-------------|  
| <*header-content*> | JSON Object | Any headers to send with the call <p>For example, to set the language and type on a request: <p>`"headers": { "Accept-Language": "en-us", "Content-Type": "application/json" }` |
| <*body-content*> | JSON Object | Any message content to send in the request | 
| <*query-parameters*> | JSON Object | Any query parameters to include with the API call <p>For example, the `"queries": { "api-version": "2018-01-01" }` object adds `?api-version=2018-01-01` to the call. | 
| <*other-action-specific-input-properties*> | JSON Object | Any other input properties that apply to this specific action | 
| <*other-action-specific-properties*> | JSON Object | Any other properties that apply to this specific action | 
||||

When you save your logic app, the Logic Apps engine 
performs these checks on the referenced function:

* Your workflow must have access to the function.

* Your workflow can use only a standard HTTP trigger or generic JSON webhook trigger. 

  The Logic Apps engine gets and caches the trigger's URL, 
  which is used at runtime. However, if any operation 
  invalidates the cached URL, the **Function** action 
  fails at runtime. To fix this issue, save the logic app again
  so that the logic app gets and caches the trigger URL again.

* The function can't have any route defined.

* Only "function" and "anonymous" authorization levels are allowed. 

*Example*

This action definition calls an Azure function named "GetProductIDFunction":

```json
"GetProductIDFunction": {
   "type": "Function",
   "inputs": {
     "function": {
        "id": "/subscriptions/<XXXXXXXXXXXXXXXXXXXX>/resourceGroups/myLogicAppResourceGroup/providers/Microsoft.Web/sites/InventoryChecker/functions/GetProductIDFunction"
      },
      "method": "POST",
      "headers": { 
          "x-ms-date": "@utcnow()"
       },
      "body": { 
          "Product_ID": "@variables('ProductID')"
      }
   },
   "runAfter": {}
}
```

<a name="http-action"></a>

## HTTP action  

An HTTP action calls a specified endpoint and checks the 
response to determine whether the workflow should run or not. 
For example:
  
```json
"myLatestNewsAction": {
    "type": "Http",
    "inputs": {
        "method": "GET",
        "uri": "https://mynews.example.com/latest"
    }
}
```

Here, the `inputs` object takes these parameters 
required for constructing an HTTP call: 

| Element | Required | Type | Description | 
|---------|----------|------|-------------| 
| method | Yes | String | Uses one of these HTTP methods: "GET", "POST", "PUT", "DELETE", "PATCH", or "HEAD" | 
| uri | Yes| String | The HTTP or HTTPs endpoint that the trigger checks. Maximum string size: 2 KB | 
| queries | No | JSON Object | Represents any query parameters that you want to include in the URL. <p>For example, `"queries": { "api-version": "2015-02-01" }` adds `?api-version=2015-02-01` to the URL. | 
| headers | No | JSON Object | Represents each header that's sent in the request. <p>For example, to set the language and type on a request: <p>`"headers": { "Accept-Language": "en-us", "Content-Type": "application/json" }` | 
| body | No | JSON Object | Represents the payload that's sent to the endpoint. | 
| retryPolicy | No | JSON Object | Use this object for customizing the retry behavior for 4xx or 5xx errors. For more information, see [Retry policies](../logic-apps/logic-apps-exception-handling.md). | 
| operationsOptions | No | String | Defines the set of special behaviors to override. | 
| authentication | No | JSON Object | Represents the method that the request should use for authentication. For more information, see [Scheduler Outbound Authentication](../scheduler/scheduler-outbound-authentication.md). <p>Beyond Scheduler, there is one more supported property: `authority`. By default, this value is `https://login.windows.net` when not specified, but you can use a different value, such as`https://login.windows\-ppe.net`. | 
||||| 

HTTP actions and APIConnection actions support *retry policies*. 
A retry policy applies to intermittent failures, 
characterized as HTTP status codes 408, 429, and 5xx, 
in addition to any connectivity exceptions. 
You can define this policy with the `retryPolicy` object as shown here:
  
```json
"retryPolicy": {
    "type": "<retry-policy-type>",
    "interval": <retry-interval>,
    "count": <number-of-retry-attempts>
}
```

This example HTTP action retries fetching the latest news two times 
if there are intermittent failures for a total of three executions and 
a 30-second delay between each attempt:
  
```json
"myLatestNewsAction": {
    "type": "Http",
    "inputs": {
        "method": "GET",
        "uri": "https://mynews.example.com/latest",
        "retryPolicy": {
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
If you don't specify a retry policy definition, 
a `fixed` strategy is used with default retry count and interval values. 
To disable the retry policy, set its type to `None`.

<a name="asynchronous-patterns"></a>

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
"invokeLongRunningOperationAction": {
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
This example shows how you can specify limits:

``` json
"<action-name>": {
    "type": "Workflow|Webhook|Http|ApiConnectionWebhook|ApiConnection",
    "inputs": { },
    "limit": {
        "timeout": "PT10S"
    }
}
```

<a name="join-action"></a>

## Join action

This action creates a string from all the items in an array 
and separates those items with the specified delimiter character. 

```json
"Join": {
   "type": "Join",
   "inputs": {
      "from": <array>,
      "joinWith": "<delimiter>"
   },
   "runAfter": {}
}
```

*Required*

| Value | Type | Description | 
|-------|------|-------------| 
| <*array*> | Array | The array or expression that provides the source items. If you specify an expression, enclose that expression with double quotes. | 
| <*delimiter*> | Single character string | The character that separates each item in the string | 
|||| 

*Example*

Suppose you have an array variable named "myIntegerArray" that contains integers, 
for example: 

`[1,2,3,4]` 

This action definition gets the values from the variable by using the `variables()` 
function in an expression and creates this string with those values, 
which are separated by a comma: `"1,2,3,4"`

```json
"Join": {
   "type": "Join",
   "inputs": {
      "from": "@variables('myIntegerArray')",
      "joinWith": ","
   },
   "runAfter": {}
}
```

<a name="parse-json-action"></a>

## Parse JSON action

This action creates user-friendly fields or *tokens* from the properties in JSON content. 
You can then access those properties in your logic app by using the tokens instead. 
For example, when you want to use JSON output from services such as Azure Service Bus 
and Azure Cosmos DB, you can include this action in your logic app so that you can more 
easily reference the data in that output. 

```json
"Parse_JSON": {
   "type": "ParseJson",
   "inputs": {
      "content": "<JSON-source>",
         "schema": { "<JSON-schema>" }
      },
      "runAfter": {}
},
```

*Required*

| Value | Type | Description | 
|-------|------|-------------| 
| <*JSON-source*> | JSON Object | The JSON content you want to parse | 
| <*JSON-schema*> | JSON Object | The JSON schema that describes the underlying the JSON content, which the action uses for parsing the source JSON content. <p>**Tip**: In Logic Apps Designer, you can either provide the schema or provide a sample payload so that the action can generate the schema. | 
|||| 

*Example*

This action definition creates these tokens, 
which you can use at design time in your logic app workflow 
but only in actions that run following the **Parse JSON** action. 

Here are the tokens that this action creates: "FirstName", "LastName", "Email"

```json
"Parse_JSON": {
   "type": "ParseJson",
   "inputs": {
      "content": {
         "Member": {
            "Email": "Sophie.Owen@contoso.com",
            "FirstName": "Sophie",
            "LastName": "Owen"
         }
      },
      "schema": {
         "type": "object",
         "properties": {
            "Member": {
               "type": "object",
               "properties": {
                  "Email": {
                     "type": "string"
                  },
                  "FirstName": {
                     "type": "string"
                  },
                  "LastName": {
                     "type": "string"
                  }
               }
            }
         }
      }
   },
   "runAfter": { }
},
```

In this example, the "content" property specifies the JSON content for the action to parse. 
You can also provide this JSON content as the sample payload for generating the schema.

```json
"content": {
   "Member": { 
      "FirstName": "Sophie",
      "LastName": "Owen",
      "Email": "Sophie.Owen@contoso.com"
   }
},
```

The "schema" property specifies the JSON schema used for describing the JSON content:

```json
"schema": {
   "type": "object",
   "properties": {
      "Member": {
         "type": "object",
         "properties": {
            "FirstName": {
               "type": "string"
            },
            "LastName": {
               "type": "string"
            },
            "Email": {
               "type": "string"
            }
         }
      }
   }
}
```

<a name="query-action"></a>

## Query action

This action creates an array from items in another array
based on a specified condition or filter.

```json
"Filter_array": {
   "type": "Query",
   "inputs": {
      "from": <array>,
      "where": "<condition-or-filter>"
   },
   "runAfter": {}
}
```

*Required*

| Value | Type | Description | 
|-------|------|-------------| 
| <*array*> | Array | The array or expression that provides the source items. If you specify an expression, enclose that expression with double quotes. |
| <*condition-or-filter*> | String | The condition used for filtering items in the source array <p>**Note**: If no values satisfy the condition, the action creates an empty array. |
|||| 

*Example*

This action definition creates an array that has 
values greater than the specified value, which is two:

```json
"Filter_array": {
   "type": "Query",
   "inputs": {
      "from": [ 1, 3, 0, 5, 4, 2 ],
      "where": "@greater(item(), 2)"
   }
}
```

<a name="response-action"></a>

## Response action  

This action creates the payload for the response to an HTTP request. 

```json
"Response" {
    "type": "Response",
    "kind": "http",
    "inputs": {
        "statusCode": 200,
        "headers": { <response-headers> },
        "body": { <response-body> }
    },
    "runAfter": {}
},
```

*Required*

| Value | Type | Description | 
|-------|------|-------------| 
| <*response-status-code*> | Integer | The HTTP status code that is sent to the incoming request. The default code is "200 OK", but the code can be any valid status code that starts with 2xx, 4xx, or 5xx, but not with 3xxx. | 
|||| 

*Optional*

| Value | Type | Description | 
|-------|------|-------------| 
| <*response-headers*> | JSON Object | One or more headers to include with the response | 
| <*response-body*> | Various | The response body, which can be a string, JSON object, or even binary content from a previous action | 
|||| 

*Example*

This action definition creates a response to an HTTP request with the 
specified status code, message body, and message headers:

```json
"Response": {
   "type": "Response",
   "inputs": {
      "statusCode": 200,
      "body": {
         "ProductID": 0,
         "Description": "Organic Apples"
      },
      "headers": {
         "x-ms-date": "@utcnow()",
         "content-type": "application/json"
      }
   },
   "runAfter": {}
}
```

*Restrictions*

Unlike other actions, the **Response** action has special restrictions: 

* Your workflow can use the **Response** action only when the 
workflow starts with an HTTP request trigger, 
meaning your workflow must be triggered by an HTTP request.

* Your workflow can use the **Response** action anywhere *except* 
inside **Foreach** loops, **Until** loops, including sequential loops, 
and parallel branches. 

* The original HTTP request gets your workflow's response only when all 
actions required by the **Response** action are finished within the 
[HTTP request timeout limit](../logic-apps/logic-apps-limits-and-config.md#request-limits).

  However, if your workflow calls another logic app as a nested workflow, 
  the parent workflow waits until the nested workflow finishes, no matter 
  how much time passes before the nested workflow finishes.

* When your workflow uses the **Response** action and a synchronous response pattern, 
the workflow can't also use the **splitOn** command in the trigger definition because 
that command creates multiple runs. Check for this case when the PUT method is used, 
and if true, return a "bad request" response.

  Otherwise, if your workflow uses the **splitOn** command and a **Response** action, 
  the workflow runs asynchronously and immediately returns a "202 ACCEPTED" response.

* When your workflow's execution reaches the **Response** action, 
but the incoming request has already received a response, 
the **Response** action is marked as "Failed" due to the conflict. 
And as a result, your logic app run is also marked with "Failed" status.

<a name="select-action"></a>

## Select action

This action creates an array with JSON objects by transforming 
items from another array based on the specified map. 
The output array and source array always have the same number of items. 
Although you can't change the number of objects in the output array, 
you can add or remove properties and their values across those objects. 
The `select` property specifies at least one key-value pair that 
define the map for transforming items in the source array. 
A key-value pair represents a property and its value across 
all the objects in the output array. 

```json
"Select": {
   "type": "Select",
   "inputs": {
      "from": <array>,
      "select": { 
          "<key-name>": "<expression>",
          "<key-name>": "<expression>"        
      }
   },
   "runAfter": {}
},
```

*Required* 

| Value | Type | Description | 
|-------|------|-------------| 
| <*array*> | Array | The array or expression that provides the source items. Make sure you enclose an expression with double quotes. <p>**Note**: If the source array is empty, the action creates an empty array. | 
| <*key-name*> | String | The property name assigned to the result from <*expression*> <p>To add a new property across all objects in the output array, provide a <*key-name*> for that property and an <*expression*> for the property value. <p>To remove a property from all objects in the array, omit the <*key-name*> for that property. | 
| <*expression*> | String | The expression that transforms the item in the source array and assigns the result to <*key-name*> | 
|||| 

The **Select** action creates an array as output, 
so any action that wants to use this output must either accept an array, 
or you must convert the array into the type that the consumer action accepts. 
For example, to convert the output array to a string, 
you can pass that array to the **Compose** action, 
and then reference the output from the **Compose** 
action in your other actions.

*Example*

This action definition creates a JSON object array from an integer array. 
The action iterates through the source array, 
gets each integer value by using the `@item()` expression, 
and assigns each value to the "`number`" property in each JSON object: 

```json
"Select": {
   "type": "Select",
   "inputs": {
      "from": [ 1, 2, 3 ],
      "select": { 
         "number": "@item()" 
      }
   },
   "runAfter": {}
},
```

Here is the array that this action creates:

`[ { "number": 1 }, { "number": 2 }, { "number": 3 } ]`

To use this array output in other actions, 
pass this output into a **Compose** action:

```json
"Compose": {
   "type": "Compose",
   "inputs": "@body('Select')",
   "runAfter": {
      "Select": [ "Succeeded" ]
   }
},
```

You can then use the output from the **Compose** 
action in your other actions, for example, 
the **Office 365 Outlook - Send an email** action:

```json
"Send_an_email": {
   "type": "ApiConnection",
   "inputs": {
      "body": {
         "Body": "@{outputs('Compose')}",
         "Subject": "Output array from Select and Compose actions",
         "To": "<your-email@domain>"
      },
      "host": {
         "connection": {
            "name": "@parameters('$connections')['office365']['connectionId']"
         }
      },
      "method": "post",
      "path": "/Mail"
   },
   "runAfter": {
      "Compose": [ "Succeeded" ]
   }
},
```

<a name="table-action"></a>

## Table action

This action creates a CSV or HTML table from an array. 
For arrays with JSON objects, this action automatically creates 
the column headers from the objects' property names. 
For arrays with other data types, you must specify the 
column headers and values. For example, this array 
includes the "ID" and "Product_Name" properties that 
this action can use for the column header names:

`[ {"ID": 0, "Product_Name": "Apples"}, {"ID": 1, "Product_Name": "Oranges"} ]` 

```json
"Create_<CSV | HTML>_table": {
   "type": "Table",
   "inputs": {
      "format": "<CSV | HTML>",
      "from": <array>,
      "columns": [ 
         {
            "header": "<column-name>",
            "value": "<column-value>"
         },
         {
            "header": "<column-name>",
            "value": "<column-value>"
         } 
      ]
   },
   "runAfter": {}
}
```

*Required* 

| Value | Type | Description | 
|-------|------|-------------| 
| <CSV *or* HTML>| String | The format for the table you want to create | 
| <*array*> | Array | The array or expression that provides the source items for the table <p>**Note**: If the source array is empty, the action creates an empty table. | 
|||| 

*Optional*

To specify or customize column headers and values, use the `columns` array. 
When `header-value` pairs have the same header name, 
their values appear in the same column under that header name. 
Otherwise, each unique header defines a unique column.

| Value | Type | Description | 
|-------|------|-------------| 
| <*column-name*> | String | The header name for a column | 
| <*column-value*> | Any | The value in that column | 
|||| 

*Example 1*

Suppose you have an array variable named "myItemArray" that currently contains this array: 

`[ {"ID": 0, "Product_Name": "Apples"}, {"ID": 1, "Product_Name": "Oranges"} ]`

This action definition creates a CSV table from the "myItemArray" variable. 
The expression used by the `from` property gets the array from 
"myItemArray" by using the `variables()` function: 

```json
"Create_CSV_table": {
   "type": "Table",
   "inputs": {
      "format": "CSV",
      "from": "@variables('myItemArray')"
   },
   "runAfter": {}
}
```

Here is the CSV table that this action creates: 

```
ID,Product_Name 
0,Apples 
1,Oranges 
```

*Example 2*

This action definition creates an HTML table from the "myItemArray" variable. 
The expression used by the `from` property gets the array from 
"myItemArray" by using the `variables()` function: 

```json
"Create_HTML_table": {
   "type": "Table",
   "inputs": {
      "format": "HTML",
      "from": "@variables('myItemArray')"
   },
   "runAfter": {}
}
```

Here is the HTML table that this action creates: 

<table><thead><tr><th>ID</th><th>Product_Name</th></tr></thead><tbody><tr><td>0</td><td>Apples</td></tr><tr><td>1</td><td>Oranges</td></tr></tbody></table>

*Example 3*

This action definition creates an HTML table from the "myItemArray" variable. 
However, this example overrides the default column header names with "Stock_ID" 
and "Description", and adds the word "Organic" to the values in the "Description" column.

```json
"Create_HTML_table": {
   "type": "Table",
   "inputs": {
      "format": "HTML",
      "from": "@variables('myItemArray')",
      "columns": [ 
         {
            "header": "Stock_ID",
            "value": "@item().ID"
         },
         {
            "header": "Description",
            "value": "@concat('Organic ', item().Product_Name)"
         }
      ]
    },
   "runAfter": {}
},
```

Here is the HTML table that this action creates: 

<table><thead><tr><th>Stock_ID</th><th>Description</th></tr></thead><tbody><tr><td>0</td><td>Organic Apples</td></tr><tr><td>1</td><td>Organic Oranges</td></tr></tbody></table>

<a name="terminate-action"></a>

## Terminate action

This action stops the run for logic app workflow instance, 
cancels any actions in progress, skips any remaining actions, 
and returns the specified status. For example, you can use the 
**Terminate** action when your logic app must exit completely 
from an error state. This action doesn't affect already completed 
actions and can't appear inside **Foreach** and **Until** loops, 
including sequential loops. 

```json
"Terminate": {
   "type": "Terminate",
   "inputs": {
       "runStatus": "<status>",
       "runError": {
            "code": "<error-code-or-name>",
            "message": "<error-message>"
       }
   },
   "runAfter": {}
}
```

*Required*

| Value | Type | Description | 
|-------|------|-------------| 
| <*status*> | String | The status to return for the run: "Failed", "Cancelled", or "Succeeded" |
|||| 

*Optional*

The properties for the "runStatus" object apply 
only when the "runStatus" property value is "Failed".

| Value | Type | Description | 
|-------|------|-------------| 
| <*error-code-or-name*> | String | The code or name for the error |
| <*error-message*> | String | The message or text that describes the error and any actions the app user can take | 
|||| 

*Example*

This action definition stops a workflow run, sets the run status to "Failed", 
and returns the status, an error code, and an error message:

```json
"Terminate": {
    "type": "Terminate",
    "inputs": {
        "runStatus": "Failed",
        "runError": {
            "code": "Unexpected response",
            "message": "The service received an unexpected response. Please try again."
        }
   },
   "runAfter": {}
}
```

<a name="wait-action"></a>

## Wait action  

This action pauses workflow execution for the 
specified interval or until the specified time, 
but not both. 

*Specified interval*

```json
"Delay": {
   "type": "Wait",
   "inputs": {
      "interval": {
         "count": <number-of-units>,
         "unit": "<interval>"
      }
   },
   "runAfter": {}
},
```

*Specified time*

```json
"Delay_until": {
   "type": "Wait",
   "inputs": {
      "until": {
         "timestamp": "<date-time-stamp>"
      }
   },
   "runAfter": {}
},
```

*Required*

| Value | Type | Description | 
|-------|------|-------------| 
| <*number-of-units*> | Integer | For the **Delay** action, the number of units to wait | 
| <*interval*> | String | For the **Delay** action, the interval to wait: "Second", "Minute", "Hour", "Day", "Week", "Month" | 
| <*date-time-stamp*> | String | For the **Delay Until** action, the date and time to resume execution. This value must use the [UTC date time format](https://en.wikipedia.org/wiki/Coordinated_Universal_Time). | 
|||| 

*Example 1*

This action definition pauses the workflow for 15 minutes:

```json
"Delay": {
   "type": "Wait",
   "inputs": {
      "interval": {
         "count": 15,
         "unit": "Minute"
      }
   },
   "runAfter": {}
},
```

*Example 2*

This action definition pauses the workflow until the specified time:

```json
"Delay_until": {
   "type": "Wait",
   "inputs": {
      "until": {
         "timestamp": "2017-10-01T00:00:00Z"
      }
   },
   "runAfter": {}
},
```

<a name="workflow-action"></a>

## Workflow action

This action lets you nest a workflow. The Logic Apps engine performs 
an access check on the child workflow, more specifically, the trigger, 
so you must have access to the child workflow. For example:

```json
"<my-nested-workflow-action-name>": {
    "type": "Workflow",
    "inputs": {
        "host": {
            "id": "/subscriptions/<my-subscription-ID>/resourceGroups/<my-resource-group-name>/providers/Microsoft.Logic/<my-nested-workflow-action-name>",
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

| Element | Required | Type | Description | 
|---------|----------|------|-------------|  
| host id | Yes | String| The resource ID for the workflow that you want to call | 
| host triggerName | Yes | String | The name of the trigger that you want to invoke | 
| queries | No | JSON Object | Represents any query parameters that you want to include in the URL. <p>For example, `"queries": { "api-version": "2015-02-01" }` adds `?api-version=2015-02-01` to the URL. | 
| headers | No | JSON Object | Represents each header that's sent in the request. <p>For example, to set the language and type on a request: <p>`"headers": { "Accept-Language": "en-us", "Content-Type": "application/json" }` | 
| body | No | JSON Object | Represents the payload that is sent to the endpoint. | 
||||| 

This action's outputs are based on what you define 
in the `Response` action for the child workflow. 
If the child workflow doesn't define a `Response` action, 
the outputs are empty.

## Control workflow actions overview

These actions help you control workflow execution and often include other actions. 
From outside a control workflow action, you can directly reference actions 
inside that control workflow action. For example, if you have an `Http` action inside a scope, 
you can reference the `@body('Http')` expression from anywhere in the workflow. 
However, actions that exist inside a control workflow action can only "run after" 
other actions that are in the same control workflow structure.

<a name="foreach-action"></a>

## Foreach action

This looping action iterates through an array and performs inner actions on each array item. 
By default, the Foreach loop runs in parallel. For the maximum number of parallel cycles that 
"for each" loops can run, see [Limits and config](../logic-apps/logic-apps-limits-and-config.md). 
To run each cycle sequentially, set the `operationOptions` parameter to `Sequential`. 
Learn more about [Foreach loops in logic apps](../logic-apps/logic-apps-control-flow-loops.md#foreach-loop).

```json
"<my-forEach-loop-name>": {
    "type": "Foreach",
    "actions": {
        "myInnerAction1": {
            "type": "<action-type>",
            "inputs": {}
        },
        "myInnerAction2": {
            "type": "<action-type>",
            "inputs": {}
        }
    },
    "foreach": "<array>",
    "runAfter": {}
}
```

| Element | Required | Type | Description | 
|---------|----------|------|-------------| 
| actions | Yes | JSON Object | The inner actions to run inside the loop | 
| foreach | Yes | String | The array to iterate through | 
| operationOptions | No | String | Specifies any operation options for customizing behavior. Currently supports only `Sequential` for sequentially running iterations where the default behavior is parallel. |
||||| 

For example:

```json
"forEach_EmailAction": {
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
    "foreach": "@body('email_filter')",
    "runAfter": {
        "email_filter": [ "Succeeded" ]
    }
}
```

<a name="if-action"></a>

## If action

This action, which is a conditional statement, lets you evaluate a condition 
and execute a branch based on whether the expression evaluates as true. 
If the condition evaluates successfully as true, the condition is marked with "Succeeded" status. 
Actions that are in the `actions` or `else` objects evaluate to these values:

* "Succeeded" when they run and succeed
* "Failed" when they run and fail
* "Skipped" when the respective branch doesn't run

Learn more about [conditional statements in logic apps](../logic-apps/logic-apps-control-flow-conditional-statement.md).

``` json
"<my-condition-name>": {
  "type": "If",
  "expression": "<condition>",
  "actions": {
    "if-true-run-this-action": {
      "type": <action-type>,
      "inputs": {},
      "runAfter": {}
    }
  },
  "else": {
    "actions": {
        "if-false-run-this-action": {
            "type": <action-type>,
            "inputs": {},
            "runAfter": {}
        }
    }
  },
  "runAfter": {}
}
```

| Element | Required | Type | Description | 
|---------|----------|------|-------------| 
| actions | Yes | JSON Object | The inner actions to run when `expression` evaluates to `true` | 
| expression | Yes | String | The expression to evaluate |
| else | No | JSON Object | The inner actions to run when `expression` evaluates to `false` |
||||| 

For example:

```json
"myCondition": {
    "type": "If",
    "actions": {
        "if-true-check-this-website": {
            "type": "Http",
            "inputs": {
                "method": "GET",
                "uri": "http://this-url"
            },
            "runAfter": {}
        }
    },
    "else": {
        "actions": {
            "if-false-check-this-other-website": {
                "type": "Http",
                "inputs": {
                    "method": "GET",
                    "uri": "http://this-other-url"
                },
                "runAfter": {}
            }
        }
    }
}
```  

### How conditions can use expressions in actions

Here are some examples that show how you can use expressions in conditions:
  
| JSON expression | Result | 
| --------------- | ------ | 
| `"expression": "@parameters('hasSpecialAction')"` | Any value that evaluates as true causes this condition to pass. Supports only Boolean expressions. To convert other types to Boolean, use these functions: `empty` or `equals` | 
| `"expression": "@greater(actions('action1').output.value, parameters('threshold'))"` | Supports comparison functions. For this example, the action runs only when the output of action1 is greater than the threshold value. | 
| `"expression": "@or(greater(actions('action1').output.value, parameters('threshold')), less(actions('action1').output.value, 100))"` | Supports logic functions for creating nested Boolean expressions. In this example, the action runs when the output of action1 is more than the threshold or under 100. | 
| `"expression": "@equals(length(actions('action1').outputs.errors), 0))"` | To check whether an array has any items, you can use array functions. In this example, the action runs when the errors array is empty. | 
| `"expression": "parameters('hasSpecialAction')"` | This expression causes an error and isn't a valid condition. Conditions must use the "@" symbol. | 
||| 

<a name="scope-action"></a>

## Scope action

This action lets you logically group actions in a workflow. 
The scope gets its own status after the actions in that scope finish running. 
Learn more about [scopes](../logic-apps/logic-apps-control-flow-run-steps-group-scopes.md).

```json
"<my-scope-action-name>": {
    "type": "Scope",
    "actions": {
        "myInnerAction1": {
            "type": "<action-type>",
            "inputs": {}
        },
        "myInnerAction2": {
            "type": "<action-type>",
            "inputs": {}
        }
    }
}
```

| Element | Required | Type | Description | 
|---------|----------|------|-------------|  
| actions | Yes | JSON Object | The inner actions to run inside the scope |
||||| 

<a name="switch-action"></a>

## Switch action

This action, also known as a *switch statement*, 
organizes other actions into *cases*, and assigns 
a value to each case, except for the default case 
if that exists. When your workflow runs, the **Switch** 
action compares the value from an expression, object, 
or token against the values specified for each case. 

If the **Switch** action finds a matching case, 
your workflow runs only the actions in that case. 
Each time the **Switch** action runs, either only 
one matching case exists or no matches exist. 
If no matches exist, the **Switch** action 
runs the default actions. Learn 
[how to create switch statements](../logic-apps/logic-apps-control-flow-switch-statement.md).

``` json
"Switch": {
   "type": "Switch",
   "expression": "<expression-object-or-token>",
   "cases": {
      "Case": {
         "actions": {
           "<action-name>": { "<action-definition>" }
         },
         "case": "<matching-value>"
      },
      "Case_2": {
         "actions": {
           "<action-name>": { "<action-definition>" }
         },
         "case": "<matching-value>"
      }
   },
   "default": {
      "actions": {
         "<default-action-name>": { "<default-action-definition>" }
      }
   },
   "runAfter": {}
}
```

*Required*

| Value | Type | Description | 
|-------|------|-------------| 
| <*expression-object-or-token*> | Varies | The expression, JSON object, or token to evaluate | 
| <*action-name*> | String | The name of the action to run for the matching case | 
| <*action-definition*> | JSON Object | The definition for the action to run for the matching case | 
| <*matching-value*> | Varies | The value to compare with the evaluated result | 
|||| 

*Optional*

| Value | Type | Description | 
|-------|------|-------------| 
| <*default-action-name*> | String | The name of the default action to run when no matching case exists | 
| <*default-action-definition*> | JSON Object | The definition for the action to run when no matching case exists | 
|||| 

*Example*

This action definition evaluates whether the person responding 
to the approval request email chose the "Approve" option 
or the "Reject" option. Based on this choice, the **Switch** 
action runs the actions for the matching case, which is 
to send another email to the responder but with different 
wording in each case. 

``` json
"Switch": {
   "type": "Switch",
   "expression": "@body('Send_approval_email')?['SelectedOption']",
   "cases": {
      "Case": {
         "actions": {
            "Send_an_email": { 
               "type": "ApiConnection",
               "inputs": {
                  "Body": "Thank you for your approval.",
                  "Subject": "Response received", 
                  "To": "Sophie.Owen@contoso.com"
               },
               "host": {
                  "connection": {
                     "name": "@parameters('$connections')['office365']['connectionId']"
                  }
               },
               "method": "post",
               "path": "/Mail"
            },
            "runAfter": {}
         },
         "case": "Approve"
      },
      "Case_2": {
         "actions": {
            "Send_an_email_2": { 
               "type": "ApiConnection",
               "inputs": {
                  "Body": "Thank you for your response.",
                  "Subject": "Response received", 
                  "To": "Sophie.Owen@contoso.com"
               },
               "host": {
                  "connection": {
                     "name": "@parameters('$connections')['office365']['connectionId']"
                  }
               },
               "method": "post",
               "path": "/Mail"
            },
            "runAfter": {}     
         },
         "case": "Reject"
      }
   },
   "default": {
      "actions": { 
         "Send_an_email_3": { 
            "type": "ApiConnection",
            "inputs": {
               "Body": "Please respond with either 'Approve' or 'Reject'.",
               "Subject": "Please respond", 
               "To": "Sophie.Owen@contoso.com"
            },
            "host": {
               "connection": {
                  "name": "@parameters('$connections')['office365']['connectionId']"
               }
            },
            "method": "post",
            "path": "/Mail"
         },
         "runAfter": {} 
      }
   },
   "runAfter": {
      "Send_approval_email": [ 
         "Succeeded"
      ]
   }
}
```

<a name="until-action"></a>

## Until action

This loop action contains actions that run until the specified condition is true. 
The loop checks the condition as the last step after all other actions have run. 
You can include more than one action in the `"actions"` object, 
and the action must define at least one limit. Learn 
[how to create "until" loops](../logic-apps/logic-apps-control-flow-loops.md#until-loop). 

```json
 "Until": {
   "type": "Until",
   "actions": {
      "<action-name>": {
         "type": "<action-type>",
         "inputs": { "<action-inputs>" },
         "runAfter": {}
      },
      "<action-name>": {
         "type": "<action-type>",
         "inputs": { "<action-inputs>" },
         "runAfter": {}
      }
   },
   "expression": "<condition>",
   "limit": {
      "count": <loop-count>,
      "timeout": "<loop-timeout>"
   },
   "runAfter": {}
}
```

| Value | Type | Description | 
|-------|------|-------------| 
| <*action-name*> | String | The name for the action you want to run inside the loop | 
| <*action-type*> | String | The action type you want to run | 
| <*action-inputs*> | Various | The inputs for the action to run | 
| <*condition*> | String | The condition or expression to evaluate after all the actions in the loop finish running | 
| <*loop-count*> | Integer | The limit on the most number of loops that the action can run. The default `count` value is 60. | 
| <*loop-timeout*> | String | The limit on the longest time that the loop can run. The default `timeout` value is `PT1H`, which is the required [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601). |
|||| 

*Example*

This loop action definition sends an HTTP request to 
the specified URL until one of these conditions is met: 

* The request gets a response with the "200 OK" status code.
* The loop has run 60 times.
* The loop has run for one hour.

```json
 "Run_until_loop_succeeds_or_expires": {
    "type": "Until",
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
        "count": 60,
        "timeout": "PT1H"
    },
    "runAfter": {}
}
```

## Next steps

* Learn more about [Workflow Definition Language](../logic-apps/logic-apps-workflow-definition-language.md)
