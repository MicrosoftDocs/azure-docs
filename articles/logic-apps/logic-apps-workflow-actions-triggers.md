---
title: Workflow triggers and actions - Azure Logic Apps | Microsoft Docs
description: Learn about triggers and actions in workflow definitions for Azure Logic Apps
services: logic-apps
author: kevinlam1
manager: jeconnoc
editor: 
documentationcenter: 

ms.assetid: 86a53bb3-01ba-4e83-89b7-c9a7074cb159
ms.service: logic-apps
ms.workload: logic-apps
ms.tgt_pltfrm: 
ms.devlang: 
ms.topic: reference
ms.date: 5/8/2018
ms.author: klam; LADocs
---

# Triggers and actions for workflow definitions in Azure Logic Apps

In [Azure Logic Apps](../logic-apps/logic-apps-overview.md), 
all logic app workflows start with triggers followed by actions. 
This article describes the triggers and actions that you can 
use to build logic apps for automating business workflows or 
processes in your integration solutions. You can build logic 
apps either visually with the Logic Apps Designer, 
or by directly authoring the underlying workflow definitions with the 
[Workflow Definition Language](../logic-apps/logic-apps-workflow-definition-language.md). 
You can use either the Azure portal or Visual Studio. 
Learn how [pricing works for triggers and actions](../logic-apps/logic-apps-pricing.md).

<a name="triggers-overview"></a>

## Triggers overview

All logic apps start with a trigger, which defines the calls 
that can instantiate and start a logic app workflow. 
Here are the types of triggers that you can use:

* A *polling* trigger, which checks a service's HTTP endpoint at regular intervals
* A *push* trigger, which calls the 
[Workflow Service REST API](https://docs.microsoft.com/rest/api/logic/workflows)
 
All triggers have these top-level elements, 
although some are optional:  
  
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

| Element name | Type | Description | 
| ------------ | ---- | ----------- | 
| <*triggerName*> | JSON Object | The name for the trigger, which is an object described in Javascript Object Notation (JSON) format  | 
| type | String | The trigger type, for example: "Http" or "ApiConnection" | 
| inputs | JSON Object | The trigger's inputs that define the trigger's behavior | 
| recurrence | JSON Object | The frequency and interval that describes how often the trigger fires |  
| frequency | String | The unit of time that describes how often the trigger fires: "Second", "Minute", "Hour", "Day", "Week", or "Month" | 
| interval | Integer | A positive integer that describes how often the trigger fires based on the frequency. <p>Here are the minimum and maximum intervals: <p>- Month: 1-16 months </br>- Day: 1-500 days </br>- Hour: 1-12,000 hours </br>- Minute: 1-72,000 minutes </br>- Second: 1-9,999,999 seconds<p>For example, if the interval is 6, and the frequency is "month", then the recurrence is every 6 months. | 
|||| 

*Optional*

| Element name | Type | Description | 
| ------------ | ---- | ----------- | 
| [conditions](#trigger-conditions) | Array | One or more conditions that determine whether or not to run the workflow | 
| [splitOn](#split-on-debatch) | String | An expression that splits up, or *debatches*, array items into multiple workflow instances for processing. This option is available for triggers that return an array and only when working directly in code view. | 
| [operationOptions](#trigger-operation-options) | String | Some triggers provide additional options that let you change the default trigger behavior | 
||||| 

## Trigger types and details  

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

| Element name | Type | Description | 
| ------------ | ---- | ----------- | 
| Recurrence | JSON Object | The name for the trigger, which is an object described in Javascript Object Notation (JSON) format  | 
| type | String | The trigger type, which is "Recurrence" | 
| inputs | JSON Object | The trigger's inputs that define the trigger's behavior | 
| recurrence | JSON Object | The frequency and interval that describes how often the trigger fires |  
| frequency | String | The unit of time that describes how often the trigger fires: "Second", "Minute", "Hour", "Day", "Week", or "Month" | 
| interval | Integer | A positive integer that describes how often the trigger fires based on the frequency. <p>Here are the minimum and maximum intervals: <p>- Month: 1-16 months </br>- Day: 1-500 days </br>- Hour: 1-12,000 hours </br>- Minute: 1-72,000 minutes </br>- Second: 1-9,999,999 seconds<p>For example, if the interval is 6, and the frequency is "month", then the recurrence is every 6 months. | 
|||| 

*Optional*

| Element name | Type | Description | 
| ------------ | ---- | ----------- | 
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

| Element name | Type | Description | 
| ------------ | ---- | ----------- | 
| manual | JSON Object | The name for the trigger, which is an object described in Javascript Object Notation (JSON) format  | 
| type | String | The trigger type, which is "Request" | 
| kind | String | The type of request, which is "Http" | 
| inputs | JSON Object | The trigger's inputs that define the trigger's behavior | 
|||| 

*Optional*

| Element name | Type | Description | 
| ------------ | ---- | ----------- | 
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

| Element name | Type | Description | 
| ------------ | ---- | ----------- | 
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

| Element name | Type | Description | 
| ------------ | ---- | ----------- | 
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
| -------- | -------- | ----------- |  
| Status code | Yes | The "200 OK" status code starts a run. Any other status code doesn't start a run. | 
| Retry-after header | No | The number of seconds until the logic app polls the endpoint again | 
| Location header | No | The URL to call at the next polling interval. If not specified, the original URL is used. | 
|||| 

*Example behaviors for different requests*

| Status code | Retry after | Behavior | 
| ----------- | ----------- | -------- | 
| 200 | {none} | Run the workflow, then check again for more data after the defined recurrence. | 
| 200 | 10 seconds | Run the workflow, then check again for more data after 10 seconds. |  
| 202 | 60 seconds | Don't trigger the workflow. The next attempt happens in one minute, subject to the defined recurrence. If the defined recurrence is less than one minute, the retry-after header takes precedence. Otherwise, the defined recurrence is used. | 
| 400 | {none} | Bad request, don't run the workflow. If no `retryPolicy` is defined, then the default policy is used. After the number of retries has been reached, the trigger checks again for data after the defined recurrence. | 
| 500 | {none}| Server error, don't run the workflow. If no `retryPolicy` is defined, then the default policy is used. After the number of retries has been reached, the trigger checks again for data after the defined recurrence. | 
|||| 

### HTTP trigger outputs

| Element name | Type | Description |
| ------------ | ---- | ----------- |
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

| Element name | Type | Description | 
| ------------ | ---- | ----------- | 
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

| Element name | Type | Description | 
| ------------ | ---- | ----------- | 
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
 
| Element name | Type | Description |
| ------------ | ---- | ----------- |
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

| Element name | Type | Description | 
| ------------ | ---- | ----------- | 
| HTTP_Webhook | JSON Object | The name for the trigger, which is an object described in Javascript Object Notation (JSON) format  | 
| type | String | The trigger type, which is "HttpWebhook" | 
| inputs | JSON Object | The trigger's inputs that define the trigger's behavior | 
| subscribe | JSON Object| The outgoing request to call and perform the initial registration when the trigger is created. This call happens so that the trigger can start listening to events at the endpoint. For more information, see [subscribe and unsubscribe](#subscribe-unsubscribe). | 
| method | String | The HTTP method used for the subscription request: "GET", "PUT", "POST", "PATCH", "DELETE", or "HEAD" | 
| uri | String | The endpoint URL for where to send the subscription request | 
|||| 

*Optional*

| Element name | Type | Description | 
| ------------ | ---- | ----------- | 
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

| Element name | Type | Description |
| ------------ | ---- | ----------- |
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

| Element name | Type | Description | 
| ------------ | ---- | ----------- | 
| <*ApiConnectionWebhookTriggerName*> | JSON Object | The name for the trigger, which is an object described in Javascript Object Notation (JSON) format  | 
| type | String | The trigger type, which is "ApiConnectionWebhook" | 
| inputs | JSON Object | The trigger's inputs that define the trigger's behavior | 
| host | JSON Object | The JSON object that describes the host gateway and ID for the managed API <p>The `host` JSON object has these elements: `api` and `connection` | 
| connection | JSON Object | The name for the managed API connection that the workflow uses, which must include a reference to a parameter named `$connection`: <p>`"name": "@parameters('$connections')['<connection-name>']['connectionId']"` | 
| body | JSON Object | The JSON object that describes the payload (data) to send to the managed API | 
| NotificationUrl | String | Returns a unique "callback URL" for this trigger that the managed API can use | 
|||| 

*Optional*

| Element name | Type | Description | 
| ------------ | ---- | ----------- | 
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
| **Compose** | Constructs an arbitrary object from the action's inputs. | 
| **Function** | Represents an Azure function. | 
| **Wait** | Waits a fixed amount of time or until a specific time. | 
| **Workflow** | Represents a nested workflow. | 
| **Compose** | Constructs an arbitrary object from the action's inputs. | 
| **Query** | Filters an array based on a condition. | 
| **Select** | Projects each element of an array into a new value. For example, you can convert an array of numbers into an array of objects. | 
| **Table** | Converts an array of items into a CSV or HTML table. | 
| **Terminate** | Stops running a workflow. | 
| **Wait** | Waits a fixed amount of time or until a specific time. | 
| **Workflow** | Represents a nested workflow. | 
||| 

### Collection actions

| Action type | Description | 
| ----------- | ----------- | 
| **If** | Evaluate an expression and based on the result, runs the corresponding branch. | 
| **Switch** | Perform different actions based on specific values of an object. | 
| **ForEach** | This looping action iterates through an array and performs inner actions on each array item. | 
| **Until** | This looping action performs inner actions until a condition results to true. | 
| **Scope** | Use for logically grouping other actions. | 
|||  

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

| Element name | Required | Type | Description | 
| ------------ | -------- | ---- | ----------- | 
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
  
## APIConnection action

This action references a Microsoft-managed connector, 
requiring a reference to a valid connection and information about the API and parameters. 
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
        "method": "POST",
        "body": {
            "Subject": "New tweet from @{triggerBody()['TweetedBy']}",
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
| host | Yes | JSON Object | Represents the connector information such as the `runtimeUrl` and reference to the connection object. | 
| method | Yes | String | Uses one of these HTTP methods: "GET", "POST", "PUT", "DELETE", "PATCH", or "HEAD" | 
| path | Yes | String | The path for the API operation | 
| queries | No | JSON Object | Represents any query parameters that you want to include in the URL. <p>For example, `"queries": { "api-version": "2015-02-01" }` adds `?api-version=2015-02-01` to the URL. | 
| headers | No | JSON Object | Represents each header that's sent in the request. <p>For example, to set the language and type on a request: <p>`"headers": { "Accept-Language": "en-us", "Content-Type": "application/json" }` | 
| body | No | JSON Object | Represents the payload that's sent to the endpoint. | 
| retryPolicy | No | JSON Object | Use this object for customizing the retry behavior for 4xx or 5xx errors. For more information, see [Retry policies](../logic-apps/logic-apps-exception-handling.md). | 
| operationsOptions | No | String | Defines the set of special behaviors to override. | 
| authentication | No | JSON Object | Represents the method that the request should use for authentication. For more information, see [Scheduler Outbound Authentication](../scheduler/scheduler-outbound-authentication.md). |
||||| 

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

## APIConnection webhook action

The APIConnectionWebhook action references a Microsoft-managed connector. 
This action requires a reference to a valid connection and information 
about the API and parameters. You can specify limits on a webhook 
action in the same way as [HTTP Asynchronous Limits](#asynchronous-limits).

```json
"Send_approval_email": {
    "type": "ApiConnectionWebhook",
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
| host | Yes | JSON Object | Represents the connector information such as the `runtimeUrl` and reference to the connection object. | 
| path | Yes | String | The path for the API operation | 
| queries | No | JSON Object | Represents any query parameters that you want to include in the URL. <p>For example, `"queries": { "api-version": "2015-02-01" }` adds `?api-version=2015-02-01` to the URL. | 
| headers | No | JSON Object | Represents each header that's sent in the request. <p>For example, to set the language and type on a request: <p>`"headers": { "Accept-Language": "en-us", "Content-Type": "application/json" }` | 
| body | No | JSON Object | Represents the payload that's sent to the endpoint. | 
| retryPolicy | No | JSON Object | Use this object for customizing the retry behavior for 4xx or 5xx errors. For more information, see [Retry policies](../logic-apps/logic-apps-exception-handling.md). | 
| operationsOptions | No | String | Defines the set of special behaviors to override. | 
| authentication | No | JSON Object | Represents the method that the request should use for authentication. For more information, see [Scheduler Outbound Authentication](../scheduler/scheduler-outbound-authentication.md). |
||||| 

## Response action  

This action contains the entire response payload from an HTTP request 
and includes a `statusCode`, `body`, and `headers`:
  
```json
"myResponseAction": {
    "type": "Response",
    "inputs": {
        "statusCode": 200,
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

## Compose action

This action lets you construct an arbitrary object, 
and the output is the result from evaluating the action's inputs. 

> [!NOTE]
> You can use the `Compose` action for constructing any output, 
> including objects, arrays, and any other type natively 
> supported by logic apps like XML and binary.

For example, you can use the `Compose` action 
for merging outputs from multiple actions:

```json
"composeUserRecordAction": {
    "type": "Compose",
    "inputs": {
        "firstName": "@actions('getUser').firstName",
        "alias": "@actions('getUser').alias",
        "thumbnailLink": "@actions('lookupThumbnail').url"
    }
}
```

## Function action

This action lets you represent and call an 
[Azure function](../azure-functions/functions-overview.md), 
for example:

```json
"<my-Azure-Function-name>": {
   "type": "Function",
    "inputs": {
        "function": {
            "id": "/subscriptions/<Azure-subscription-ID>/resourceGroups/<Azure-resource-group-name>/providers/Microsoft.Web/sites/<your-Azure-function-app-name>/functions/<your-Azure-function-name>"
        },
        "queries": {
            "extrafield": "specialValue"
        },  
        "headers": {
            "x-ms-date": "@utcnow()"
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
| queries | No | JSON Object | Represents any query parameters that you want to include in the URL. <p>For example, `"queries": { "api-version": "2015-02-01" }` adds `?api-version=2015-02-01` to the URL. | 
| headers | No | JSON Object | Represents each header that's sent in the request. <p>For example, to set the language and type on a request: <p>`"headers": { "Accept-Language": "en-us", "Content-Type": "application/json" }` | 
| body | No | JSON Object | Represents the payload that's sent to the endpoint. | 
|||||

When you save your logic app, the Logic Apps engine performs some checks on the referenced function:

* You must have access to the function.
* You can use only a standard HTTP trigger or generic JSON Webhook trigger.
* The function shouldn't have any route defined.
* Only "function" and "anonymous" authorization levels are allowed.

> [!NOTE]
> The Logic Apps engine retrieves and caches the trigger URL, which is used at runtime. 
> So if any operation invalidates the cached URL, the action fails at runtime. 
> To work around this issue, save the logic app again, 
> which causes the logic app to retrieve and cache the trigger URL again.

## Select action

This action lets you project each element of an array into a new value. 
This example converts an array of numbers into an array of objects:

```json
"selectNumbersAction": {
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

## Terminate action

This action stops a workflow run, canceling any actions in progress, 
and skipping any remaining actions. The terminate action doesn't 
affect already completed actions.

For example, to stop a run that has `Failed` status:

```json
"HandleUnexpectedResponse": {
    "type": "Terminate",
    "inputs": {
        "runStatus": "Failed",
        "runError": {
            "code": "UnexpectedResponse",
            "message": "Received an unexpected response",
        }
    }
}
```

| Name | Required | Type | Description | 
| ---- | -------- | ---- | ----------- | 
| runStatus | Yes | String | The target run's status, which is either `Failed` or `Cancelled` |
| runError | No | JSON Object | The error details. Supported only when `runStatus` is set to `Failed`. |
| runError code | No | String | The run's error code |
| runError message | No | String | The run's error message | 
||||| 

## Query action

This action lets you filter an array based on a condition. 

> [!NOTE]
> You can't use the Compose action to construct any output, 
> including objects, arrays, and any other type natively 
> supported by logic apps like XML and binary.

For example, to select numbers greater than two:

```json
"filterNumbersAction": {
    "type": "Query",
    "inputs": {
        "from": [ 1, 3, 0, 5, 4, 2 ],
        "where": "@greater(item(), 2)"
    }
}
```

| Name | Required | Type | Description | 
| ---- | -------- | ---- | ----------- | 
| from | Yes | Array | The source array |
| where | Yes | String | The condition that's applied to each element from the source array. If no values satisfy the `where` condition, the result is an empty array. |
||||| 

The output from the `query` action is an array that 
has elements from the input array that satisfy the condition.

## Table action

This action lets you convert an array into a CSV or HTML table. 

```json
"ConvertToTable": {
    "type": "Table",
    "inputs": {
        "from": "<source-array>",
        "format": "CSV | HTML"
    }
}
```

| Name | Required | Type | Description | 
| ---- | -------- | ---- | ----------- | 
| from | Yes | Array | The source array. If the `from` property value is an empty array, the output is an empty table. | 
| format | Yes | String | The table format that you want, either "CSV" or "HTML" | 
| columns | No | Array | The table columns that you want. Use to override the default table shape. | 
| column header | No | String | The column header | 
| column value | Yes | String | The column value | 
||||| 

Suppose you define a table action like this example:

```json
"convertToTableAction": {
    "type": "Table",
    "inputs": {
        "from": "@triggerBody()",
        "format": "HTML"
    }
}
```

And use this array for `@triggerBody()`:

```json
[ {"ID": 0, "Name": "apples"},{"ID": 1, "Name": "oranges"} ]
```

Here is the output from this example:

<table><thead><tr><th>ID</th><th>Name</th></tr></thead><tbody><tr><td>0</td><td>apples</td></tr><tr><td>1</td><td>oranges</td></tr></tbody></table>

To customize this table, you can specify the columns explicitly, for example:

```json
"ConvertToTableAction": {
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

Here is the output from this example:

<table><thead><tr><th>Produce ID</th><th>Description</th></tr></thead><tbody><tr><td>0</td><td>fresh apples</td></tr><tr><td>1</td><td>fresh oranges</td></tr></tbody></table>

## Wait action  

This action suspends workflow execution for the specified interval. 
This example causes the workflow to wait 15 minutes:
  
```json
"waitForFifteenMinutesAction": {
    "type": "Wait",
    "inputs": {
        "interval": {
            "unit": "minute",
            "count": 15
        }
    }
}
```
  
Alternatively, to wait until a specific moment in time, 
you can use this example:
  
```json
"waitUntilOctoberAction": {
    "type": "Wait",
    "inputs": {
        "until": {
            "timestamp": "2017-10-01T00:00:00Z"
        }
    }
}
```
  
> [!NOTE]  
> You can specify the wait duration with either the `interval` object 
> or the `until` object, but not both.

| Element name | Required | Type | Description | 
| ------------ | -------- | ---- | ----------- | 
| until | No | JSON Object | The wait duration based on a point in time | 
| until timestamp | Yes | String | The point in time in [UTC date time format](https://en.wikipedia.org/wiki/Coordinated_Universal_Time) when the wait expires | 
| interval | No | JSON Object | The wait duration based on the interval unit and count | 
| interval unit | Yes | String | The unit of time. Use only one of these values: "second", "minute", "hour", "day", "week", or "month" | 
| interval count | Yes | Integer | A positive integer representing the number of interval units used for the wait duration | 
||||| 

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

| Element name | Required | Type | Description | 
| ------------ | -------- | ---- | ----------- |  
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

## Collection actions overview

To help you control workflow execution, collection actions can include other actions. 
You can directly refer to referencing actions in a collection outside of the collection. 
For example, if you define an `Http` action in a scope, then `@body('http')` is still valid anywhere in a workflow. 
Also, actions in a collection can only "run after" other actions in the same collection.

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

| Name | Required | Type | Description | 
| ---- | -------- | ---- | ----------- | 
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

## Switch action

This action, which is a switch statement, performs different actions based on specific values of an object, 
expression, or token. This action evaluates the object, expression, or token, 
chooses the case that matches the result, and runs actions for only that case. 
When no case matches the result, the default action runs. 
When the switch statement runs, only one case should match the result. 
Learn more about [switch statements in logic apps](../logic-apps/logic-apps-control-flow-switch-statement.md).

``` json
"<my-switch-statement-name>": {
   "type": "Switch",
   "expression": "<evaluate-this-object-expression-token>",
   "cases": {
      "myCase1": {
         "actions": {
           "myAction1": {}
         },
         "case": "<result1>"
      },
      "myCase2": {
         "actions": {
           "myAction2": {}
         },
         "case": "<result2>"
      }
   },
   "default": {
      "actions": {
          "myDefaultAction": {}
      }
   },
   "runAfter": {}
}
```

| Name | Required | Type | Description | 
| ---- | -------- | ---- | ----------- | 
| expression | Yes | String | The object, expression, or token to evaluate | 
| cases | Yes | JSON Object | Contains the sets of inner actions that run based on the expression result. | 
| case | Yes | String | The value to match with the result | 
| actions | Yes | JSON Object | The inner actions that run for the case matching the expression result | 
| default | No | JSON Object | The inner actions that run when no cases match the result | 
||||| 

For example:

``` json
"myApprovalEmailAction": {
   "type": "Switch",
   "expression": "@body('Send_approval_email')?['SelectedOption']",
   "cases": {
      "Case": {
         "actions": {
           "Send_an_email": {...}
         },
         "case": "Approve"
      },
      "Case_2": {
         "actions": {
           "Send_an_email_2": {...}
         },
         "case": "Reject"
      }
   },
   "default": {
      "actions": {}
   },
   "runAfter": {
      "Send_approval_email": [
         "Succeeded"
      ]
   }
}
```

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

| Name | Required | Type | Description | 
| ---- | -------- | ---- | ----------- | 
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

## Until action

This looping action runs inner actions until a condition evaluates as true. 
Learn more about ["until" loops in logic apps](../logic-apps/logic-apps-control-flow-loops.md#until-loop).

```json
 "<my-Until-loop-name>": {
    "type": "Until",
    "actions": {
        "myActionName": {
            "type": "<action-type>",
            "inputs": {},
            "runAfter": {}
        }
    },
    "expression": "<myCondition>",
    "limit": {
        "count": 1000,
        "timeout": "PT1H"
    },
    "runAfter": {}
}
```

| Name | Required | Type | Description | 
| ---- | -------- | ---- | ----------- | 
| actions | Yes | JSON Object | The inner actions to run inside the loop | 
| expression | Yes | String | The expression to evaluate after each iteration | 
| limit | Yes | JSON Object | The limits for the loop. Must define at least one limit. | 
| count | No | Integer | The limit on the number of iterations to perform | 
| timeout | No | String | The timeout limit in [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601) that specifies how long the loop should run |
||||| 

For example:

```json
 "runUntilSucceededAction": {
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
        "count": 100,
        "timeout": "PT1H"
    },
    "runAfter": {}
}
```

## Scope action

This action lets you logically group actions in a workflow. 
The scope also gets its own status after all the actions in that scope finish running. 
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

| Name | Required | Type | Description | 
| ---- | -------- | ---- | ----------- |  
| actions | Yes | JSON Object | The inner actions to run inside the scope |
||||| 

## Next steps

* Learn more about [Workflow Definition Language](../logic-apps/logic-apps-workflow-definition-language.md)
* Learn more about [Workflow REST API](https://docs.microsoft.com/rest/api/logic/workflows)