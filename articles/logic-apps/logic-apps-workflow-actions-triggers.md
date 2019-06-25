---
title: Reference for trigger and action types in Workflow Definition Language - Azure Logic Apps
description: Reference guide for trigger and action types in Workflow Definition Language for Azure Logic Apps
services: logic-apps
ms.service: logic-apps
author: ecfan
ms.author: estfan
ms.reviewer: klam, LADocs
ms.suite: integration
ms.topic: reference
ms.date: 06/19/2019
---

# Reference for trigger and action types in Workflow Definition Language for Azure Logic Apps

This reference describes the general types used for identifying triggers and actions 
in your logic app's underlying workflow definition, which is described and validated by the 
[Workflow Definition Language](../logic-apps/logic-apps-workflow-definition-language.md).
To find specific connector triggers and actions that you can use in your logic apps, 
see the list under the [Connectors overview](https://docs.microsoft.com/connectors/).

<a name="triggers-overview"></a>

## Triggers overview

Every workflow includes a trigger, which defines the 
calls that instantiate and start the workflow. 
Here are the general trigger categories:

* A *polling* trigger, which checks a service's endpoint at regular intervals

* A *push* trigger, which creates a subscription to an endpoint 
and provides a *callback URL* so the endpoint can notify the 
trigger when the specified event happens or data is available. 
The trigger then waits for the endpoint's response before firing. 

Triggers have these top-level elements, although some are optional:  
  
```json
"<trigger-name>": {
   "type": "<trigger-type>",
   "inputs": { "<trigger-inputs>" },
   "recurrence": { 
      "frequency": "<time-unit>",
      "interval": <number-of-time-units>
   },
   "conditions": [ "<array-with-conditions>" ],
   "runtimeConfiguration": { "<runtime-config-options>" },
   "splitOn": "<splitOn-expression>",
   "operationOptions": "<operation-option>"
},
```

*Required*

| Value | Type | Description | 
|-------|------|-------------| 
| <*trigger-name*> | String | The name for the trigger | 
| <*trigger-type*> | String | The trigger type such as "Http" or "ApiConnection" | 
| <*trigger-inputs*> | JSON Object | The inputs that define the trigger's behavior | 
| <*time-unit*> | String | The unit of time that describes how often the trigger fires: "Second", "Minute", "Hour", "Day", "Week", "Month" | 
| <*number-of-time-units*> | Integer | A value that specifies how often the trigger fires based on the frequency, which is the number of time units to wait until the trigger fires again <p>Here are the minimum and maximum intervals: <p>- Month: 1-16 months </br>- Day: 1-500 days </br>- Hour: 1-12,000 hours </br>- Minute: 1-72,000 minutes </br>- Second: 1-9,999,999 seconds<p>For example, if the interval is 6, and the frequency is "Month", the recurrence is every 6 months. | 
|||| 

*Optional*

| Value | Type | Description | 
|-------|------|-------------| 
| <*array-with-conditions*> | Array | An array that contains one or more [conditions](#trigger-conditions) that determine whether to run the workflow. Available only for triggers. | 
| <*runtime-config-options*> | JSON Object | You can change trigger runtime behavior by setting `runtimeConfiguration` properties. For more information, see [Runtime configuration settings](#runtime-config-options). | 
| <*splitOn-expression*> | String | For triggers that return an array, you can specify an expression that [splits or *debatches*](#split-on-debatch) array items into multiple workflow instances for processing. | 
| <*operation-option*> | String | You can change the default behavior by setting the `operationOptions` property. For more information, see [Operation options](#operation-options). | 
|||| 

## Trigger types list

Each trigger type has a different interface and inputs that define the trigger's behavior. 

### Built-in triggers

| Trigger type | Description | 
|--------------|-------------| 
| [**HTTP**](#http-trigger) | Checks or *polls* any endpoint. This endpoint must conform to a specific trigger contract either by using a "202" asynchronous pattern or by returning an array. | 
| [**HTTPWebhook**](#http-webhook-trigger) | Creates a callable endpoint for your logic app but calls the specified URL to register or unregister. |
| [**Recurrence**](#recurrence-trigger) | Fires based on a defined schedule. You can set a future date and time for firing this trigger. Based on the frequency, you can also specify times and days for running your workflow. | 
| [**Request**](#request-trigger)  | Creates a callable endpoint for your logic app and is also known as a "manual" trigger. For example, see [Call, trigger, or nest workflows with HTTP endpoints](../logic-apps/logic-apps-http-endpoint.md). | 
||| 

### Managed API triggers

| Trigger type | Description | 
|--------------|-------------| 
| [**ApiConnection**](#apiconnection-trigger) | Checks or *polls* an endpoint by using [Microsoft-managed APIs](../connectors/apis-list.md). | 
| [**ApiConnectionWebhook**](#apiconnectionwebhook-trigger) | Creates a callable endpoint for your logic app by calling [Microsoft-managed APIs](../connectors/apis-list.md) to subscribe and unsubscribe. | 
||| 

## Triggers - Detailed reference

<a name="apiconnection-trigger"></a>

### APIConnection trigger  

This trigger checks or *polls* an endpoint by using 
[Microsoft-managed APIs](../connectors/apis-list.md) 
so the parameters for this trigger can differ based on the endpoint. 
Many sections in this trigger definition are optional. The trigger's 
behavior depends on whether or not sections are included.

```json
"<APIConnection_trigger_name>": {
   "type": "ApiConnection",
   "inputs": {
      "host": {
         "connection": {
            "name": "@parameters('$connections')['<connection-name>']['connectionId']"
         }
      },
      "method": "<method-type>",
      "path": "/<api-operation>",
      "retryPolicy": { "<retry-behavior>" },
      "queries": { "<query-parameters>" }
   },
   "recurrence": { 
      "frequency": "<time-unit>",
      "interval": <number-of-time-units>
   },
   "runtimeConfiguration": {
      "concurrency": {
         "runs": <max-runs>,
         "maximumWaitingRuns": <max-runs-queue>
      }
   },
   "splitOn": "<splitOn-expression>",
   "operationOptions": "<operation-option>"
}
```

*Required*

| Value | Type | Description | 
|-------|------|-------------| 
| <*APIConnection_trigger_name*> | String | The name for the trigger | 
| <*connection-name*> | String | The name for the connection to the managed API that the workflow uses | 
| <*method-type*> | String | The HTTP method for communicating with the managed API: "GET", "PUT", "POST", "PATCH", "DELETE" | 
| <*api-operation*> | String | The API operation to call | 
| <*time-unit*> | String | The unit of time that describes how often the trigger fires: "Second", "Minute", "Hour", "Day", "Week", "Month" | 
| <*number-of-time-units*> | Integer | A value that specifies how often the trigger fires based on the frequency, which is the number of time units to wait until the trigger fires again <p>Here are the minimum and maximum intervals: <p>- Month: 1-16 months </br>- Day: 1-500 days </br>- Hour: 1-12,000 hours </br>- Minute: 1-72,000 minutes </br>- Second: 1-9,999,999 seconds<p>For example, if the interval is 6, and the frequency is "Month", the recurrence is every 6 months. | 
|||| 

*Optional*

| Value | Type | Description | 
|-------|------|-------------| 
| <*retry-behavior*> | JSON Object | Customizes the retry behavior for intermittent failures, which have the 408, 429, and 5XX status code, and any connectivity exceptions. For more information, see [Retry policies](../logic-apps/logic-apps-exception-handling.md#retry-policies). | 
| <*query-parameters*> | JSON Object | Any query parameters to include with the API call. For example, the `"queries": { "api-version": "2018-01-01" }` object adds `?api-version=2018-01-01` to the call. | 
| <*max-runs*> | Integer | By default, workflow instances run at the same time, or in parallel up to the [default limit](../logic-apps/logic-apps-limits-and-config.md#looping-debatching-limits). To change this limit by setting a new <*count*> value, see [Change trigger concurrency](#change-trigger-concurrency). | 
| <*max-runs-queue*> | Integer | When your workflow is already running the maximum number of instances, which you can change based on the `runtimeConfiguration.concurrency.runs` property, any new runs are put into this queue up to the [default limit](../logic-apps/logic-apps-limits-and-config.md#looping-debatching-limits). To change the default limit, see [Change waiting runs limit](#change-waiting-runs). | 
| <*splitOn-expression*> | String | For triggers that return arrays, this expression references the array to use so that you can create and run a workflow instance for each array item, rather than use a "for each" loop. <p>For example, this expression represents an item in the array returned within the trigger's body content: `@triggerbody()?['value']` |
| <*operation-option*> | String | You can change the default behavior by setting the `operationOptions` property. For more information, see [Operation options](#operation-options). |
||||

*Outputs*
 
| Element | Type | Description |
|---------|------|-------------|
| headers | JSON Object | The headers from the response |
| body | JSON Object | The body from the response |
| status code | Integer | The status code from the response |
|||| 

*Example*

This trigger definition checks for email every day 
inside the inbox for an Office 365 Outlook account: 

```json
"When_a_new_email_arrives": {
   "type": "ApiConnection",
   "inputs": {
      "host": {
         "connection": {
            "name": "@parameters('$connections')['office365']['connectionId']"
         }
      },
      "method": "get",
      "path": "/Mail/OnNewEmail",
      "queries": {
          "fetchOnlyWithAttachment": false,
          "folderPath": "Inbox",
          "importance": "Any",
          "includeAttachments": false
      }
   },
   "recurrence": {
      "frequency": "Day",
      "interval": 1
   }
}
```

<a name="apiconnectionwebhook-trigger"></a>

### ApiConnectionWebhook trigger

This trigger sends a subscription request to an endpoint 
by using a [Microsoft-managed API](../connectors/apis-list.md), 
provides a *callback URL* to where the endpoint can send a response, 
and waits for the endpoint to respond. For more information, see 
[Endpoint subscriptions](#subscribe-unsubscribe).

```json
"<ApiConnectionWebhook_trigger_name>": {
   "type": "ApiConnectionWebhook",
   "inputs": {
      "body": {
          "NotificationUrl": "@{listCallbackUrl()}"
      },
      "host": {
         "connection": {
            "name": "@parameters('$connections')['<connection-name>']['connectionId']"
         }
      },
      "retryPolicy": { "<retry-behavior>" },
      "queries": "<query-parameters>"
   },
   "runTimeConfiguration": {
      "concurrency": {
         "runs": <max-runs>,
         "maximumWaitingRuns": <max-run-queue>
      }
   },
   "splitOn": "<splitOn-expression>",
   "operationOptions": "<operation-option>"
}
```

*Required*

| Value | Type | Description | 
|-------|------|-------------| 
| <*connection-name*> | String | The name for the connection to the managed API that the workflow uses | 
| <*body-content*> | JSON Object | Any message content to send as payload to the managed API | 
|||| 

*Optional*

| Value | Type | Description | 
|-------|------|-------------| 
| <*retry-behavior*> | JSON Object | Customizes the retry behavior for intermittent failures, which have the 408, 429, and 5XX status code, and any connectivity exceptions. For more information, see [Retry policies](../logic-apps/logic-apps-exception-handling.md#retry-policies). | 
| <*query-parameters*> | JSON Object | Any query parameters to include with the API call <p>For example, the `"queries": { "api-version": "2018-01-01" }` object adds `?api-version=2018-01-01` to the call. | 
| <*max-runs*> | Integer | By default, workflow instances run at the same time, or in parallel up to the [default limit](../logic-apps/logic-apps-limits-and-config.md#looping-debatching-limits). To change this limit by setting a new <*count*> value, see [Change trigger concurrency](#change-trigger-concurrency). | 
| <*max-runs-queue*> | Integer | When your workflow is already running the maximum number of instances, which you can change based on the `runtimeConfiguration.concurrency.runs` property, any new runs are put into this queue up to the [default limit](../logic-apps/logic-apps-limits-and-config.md#looping-debatching-limits). To change the default limit, see [Change waiting runs limit](#change-waiting-runs). | 
| <*splitOn-expression*> | String | For triggers that return arrays, this expression references the array to use so that you can create and run a workflow instance for each array item, rather than use a "for each" loop. <p>For example, this expression represents an item in the array returned within the trigger's body content: `@triggerbody()?['value']` |
| <*operation-option*> | String | You can change the default behavior by setting the `operationOptions` property. For more information, see [Operation options](#operation-options). | 
|||| 

*Example*

This trigger definition subscribes to the Office 365 Outlook API, 
provides a callback URL to the API endpoint, and waits for the 
endpoint to respond when a new email arrives.

```json
"When_a_new_email_arrives_(webhook)": {
   "type": "ApiConnectionWebhook",
   "inputs": {
      "body": {
         "NotificationUrl": "@{listCallbackUrl()}" 
      },
      "host": {
         "connection": {
            "name": "@parameters('$connections')['office365']['connectionId']"
         }
      },
      "path": "/MailSubscription/$subscriptions",
      "queries": {
          "folderPath": "Inbox",
          "hasAttachment": "Any",
          "importance": "Any"
      }
   },
   "splitOn": "@triggerBody()?['value']"
}
```

<a name="http-trigger"></a>

### HTTP trigger

This trigger checks or polls the specified endpoint 
based on the specified recurrence schedule. 
The endpoint's response determines whether the workflow runs.

```json
"HTTP": {
   "type": "Http",
   "inputs": {
      "method": "<method-type>",
      "uri": "<endpoint-URL>",
      "headers": { "<header-content>" },
      "body": "<body-content>",
      "authentication": { "<authentication-method>" },
      "retryPolicy": { "<retry-behavior>" },
      "queries": "<query-parameters>"
   },
   "recurrence": {
      "frequency": "<time-unit>",
      "interval": <number-of-time-units>
   },
   "runtimeConfiguration": {
      "concurrency": {
         "runs": <max-runs>,
         "maximumWaitingRuns": <max-runs-queue>
      }
   },
   "operationOptions": "<operation-option>"
}
```

*Required*

| Value | Type | Description | 
|-------|------|-------------| 
| <*method-type*> | String | The HTTP method to use for polling the specified endpoint: "GET", "PUT", "POST", "PATCH", "DELETE" | 
| <*endpoint-URL*> | String | The HTTP or HTTPS URL for the endpoint to poll <p>Maximum string size: 2 KB | 
| <*time-unit*> | String | The unit of time that describes how often the trigger fires: "Second", "Minute", "Hour", "Day", "Week", "Month" | 
| <*number-of-time-units*> | Integer | A value that specifies how often the trigger fires based on the frequency, which is the number of time units to wait until the trigger fires again <p>Here are the minimum and maximum intervals: <p>- Month: 1-16 months </br>- Day: 1-500 days </br>- Hour: 1-12,000 hours </br>- Minute: 1-72,000 minutes </br>- Second: 1-9,999,999 seconds<p>For example, if the interval is 6, and the frequency is "Month", the recurrence is every 6 months. | 
|||| 

*Optional*

| Value | Type | Description | 
|-------|------|-------------| 
| <*header-content*> | JSON Object | The headers to send with the request <p>For example, to set the language and type for a request: <p>`"headers": { "Accept-Language": "en-us", "Content-Type": "application/json" }` |
| <*body-content*> | String | The message content to send as payload with the request | 
| <*authentication-method*> | JSON Object | The method the request uses for authentication. For more information, see [Scheduler Outbound Authentication](../scheduler/scheduler-outbound-authentication.md). Beyond Scheduler, the `authority` property is supported. When not specified, the default value is `https://login.windows.net`, but you can use a different value, such as`https://login.windows\-ppe.net`. |
| <*retry-behavior*> | JSON Object | Customizes the retry behavior for intermittent failures, which have the 408, 429, and 5XX status code, and any connectivity exceptions. For more information, see [Retry policies](../logic-apps/logic-apps-exception-handling.md#retry-policies). |  
 <*query-parameters*> | JSON Object | Any query parameters to include with the request <p>For example, the `"queries": { "api-version": "2018-01-01" }` object adds `?api-version=2018-01-01` to the request. | 
| <*max-runs*> | Integer | By default, workflow instances run at the same time, or in parallel up to the [default limit](../logic-apps/logic-apps-limits-and-config.md#looping-debatching-limits). To change this limit by setting a new <*count*> value, see [Change trigger concurrency](#change-trigger-concurrency). | 
| <*max-runs-queue*> | Integer | When your workflow is already running the maximum number of instances, which you can change based on the `runtimeConfiguration.concurrency.runs` property, any new runs are put into this queue up to the [default limit](../logic-apps/logic-apps-limits-and-config.md#looping-debatching-limits). To change the default limit, see [Change waiting runs limit](#change-waiting-runs). | 
| <*operation-option*> | String | You can change the default behavior by setting the `operationOptions` property. For more information, see [Operation options](#operation-options). | 
|||| 

*Outputs*

| Element | Type | Description |
|---------|------|-------------| 
| headers | JSON Object | The headers from the response | 
| body | JSON Object | The body from the response | 
| status code | Integer | The status code from the response | 
|||| 

*Requirements for incoming requests*

To work well with your logic app, the endpoint must 
conform to a specific trigger pattern or contract, 
and recognize these properties:  
  
| Response | Required | Description | 
|----------|----------|-------------| 
| Status code | Yes | The "200 OK" status code starts a run. Any other status code doesn't start a run. | 
| Retry-after header | No | The number of seconds until your logic app polls the endpoint again | 
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

<a name="http-webhook-trigger"></a>

### HTTPWebhook trigger  

This trigger makes your logic app callable by creating an endpoint 
that can register a subscription by calling the specified endpoint URL. 
When you create this trigger in your workflow, an outgoing request 
makes the call to register the subscription. That way, the trigger 
can start listening for events. When an operation makes this trigger invalid, 
an outgoing request automatically makes the call to cancel the subscription. 
For more information, see [Endpoint subscriptions](#subscribe-unsubscribe).

You can also specify [asynchronous limits](#asynchronous-limits) on an **HTTPWebhook** trigger.
The trigger's behavior depends on the sections that you use or omit. 

```json
"HTTP_Webhook": {
   "type": "HttpWebhook",
   "inputs": {
      "subscribe": {
         "method": "<method-type>",
         "uri": "<endpoint-subscribe-URL>",
         "headers": { "<header-content>" },
         "body": "<body-content>",
         "authentication": { "<authentication-method>" },
         "retryPolicy": { "<retry-behavior>" }
         },
      },
      "unsubscribe": {
         "method": "<method-type>",
         "url": "<endpoint-unsubscribe-URL>",
         "headers": { "<header-content>" },
         "body": "<body-content>",
         "authentication": { "<authentication-method>" }
      }
   },
   "runTimeConfiguration": {
      "concurrency": {
         "runs": <max-runs>,
         "maximumWaitingRuns": <max-runs-queue>
      }
   },
   "operationOptions": "<operation-option>"
}
```

Some values, such as <*method-type*>, are available for 
both the `"subscribe"` and `"unsubscribe"` objects.

*Required*

| Value | Type | Description | 
|-------|------|-------------| 
| <*method-type*> | String | The HTTP method to use for the subscription request: "GET", "PUT", "POST", "PATCH", or "DELETE" | 
| <*endpoint-subscribe-URL*> | String | The endpoint URL where to send the subscription request | 
|||| 

*Optional*

| Value | Type | Description | 
|-------|------|-------------| 
| <*method-type*> | String | The HTTP method to use for the cancellation request: "GET", "PUT", "POST", "PATCH", or "DELETE" | 
| <*endpoint-unsubscribe-URL*> | String | The endpoint URL where to send the cancellation request | 
| <*body-content*> | String | Any message content to send in the subscription or cancellation request | 
| <*authentication-method*> | JSON Object | The method the request uses for authentication. For more information, see [Scheduler Outbound Authentication](../scheduler/scheduler-outbound-authentication.md). |
| <*retry-behavior*> | JSON Object | Customizes the retry behavior for intermittent failures, which have the 408, 429, and 5XX status code, and any connectivity exceptions. For more information, see [Retry policies](../logic-apps/logic-apps-exception-handling.md#retry-policies). | 
| <*max-runs*> | Integer | By default, workflow instances all run at the same time, or in parallel up to the [default limit](../logic-apps/logic-apps-limits-and-config.md#looping-debatching-limits). To change this limit by setting a new <*count*> value, see [Change trigger concurrency](#change-trigger-concurrency). | 
| <*max-runs-queue*> | Integer | When your workflow is already running the maximum number of instances, which you can change based on the `runtimeConfiguration.concurrency.runs` property, any new runs are put into this queue up to the [default limit](../logic-apps/logic-apps-limits-and-config.md#looping-debatching-limits). To change the default limit, see [Change waiting runs limit](#change-waiting-runs). | 
| <*operation-option*> | String | You can change the default behavior by setting the `operationOptions` property. For more information, see [Operation options](#operation-options). | 
|||| 

*Outputs* 

| Element | Type | Description |
|---------|------|-------------| 
| headers | JSON Object | The headers from the response | 
| body | JSON Object | The body from the response | 
| status code | Integer | The status code from the response | 
|||| 

*Example*

This trigger creates a subscription to the specified endpoint, 
provides a unique callback URL, and waits for newly published 
technology articles.

```json
"HTTP_Webhook": {
   "type": "HttpWebhook",
   "inputs": {
      "subscribe": {
         "method": "POST",
         "uri": "https://pubsubhubbub.appspot.com/subscribe",
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
         }
      }
   }
}
```

<a name="recurrence-trigger"></a>

### Recurrence trigger  

This trigger runs based on the specified recurrence schedule 
and provides an easy way for creating a regularly running workflow. 

```json
"Recurrence": {
   "type": "Recurrence",
   "recurrence": {
      "frequency": "<time-unit>",
      "interval": <number-of-time-units>,
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
         "runs": <max-runs>,
         "maximumWaitingRuns": <max-runs-queue>
      }
   },
   "operationOptions": "<operation-option>"
}
```

*Required*

| Value | Type | Description | 
|-------|------|-------------| 
| <*time-unit*> | String | The unit of time that describes how often the trigger fires: "Second", "Minute", "Hour", "Day", "Week", "Month" | 
| <*number-of-time-units*> | Integer | A value that specifies how often the trigger fires based on the frequency, which is the number of time units to wait until the trigger fires again <p>Here are the minimum and maximum intervals: <p>- Month: 1-16 months </br>- Day: 1-500 days </br>- Hour: 1-12,000 hours </br>- Minute: 1-72,000 minutes </br>- Second: 1-9,999,999 seconds<p>For example, if the interval is 6, and the frequency is "Month", the recurrence is every 6 months. | 
|||| 

*Optional*

| Value | Type | Description | 
|-------|------|-------------| 
| <*start-date-time-with-format-YYYY-MM-DDThh:mm:ss*> | String | The start date and time in this format: <p>YYYY-MM-DDThh:mm:ss if you specify a time zone <p>-or- <p>YYYY-MM-DDThh:mm:ssZ if you don't specify a time zone <p>So for example, if you want September 18, 2017 at 2:00 PM, then specify "2017-09-18T14:00:00" and specify a time zone such as "Pacific Standard Time", or specify "2017-09-18T14:00:00Z" without a time zone. <p>**Note:** This start time must follow the [ISO 8601 date time specification](https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations) in [UTC date time format](https://en.wikipedia.org/wiki/Coordinated_Universal_Time), but without a [UTC offset](https://en.wikipedia.org/wiki/UTC_offset). If you don't specify a time zone, you must add the letter "Z" at the end without any spaces. This "Z" refers to the equivalent [nautical time](https://en.wikipedia.org/wiki/Nautical_time). <p>For simple schedules, the start time is the first occurrence, while for complex schedules, the trigger doesn't fire any sooner than the start time. For more information about start dates and times, see [Create and schedule regularly running tasks](../connectors/connectors-native-recurrence.md). | 
| <*time-zone*> | String | Applies only when you specify a start time because this trigger doesn't accept [UTC offset](https://en.wikipedia.org/wiki/UTC_offset). Specify the time zone that you want to apply. | 
| <*one-or-more-hour-marks*> | Integer or integer array | If you specify "Day" or "Week" for `frequency`, you can specify one or more integers from 0 to 23, separated by commas, as the hours of the day when you want to run the workflow. <p>For example, if you specify "10", "12" and "14", you get 10 AM, 12 PM, and 2 PM as the hour marks. | 
| <*one-or-more-minute-marks*> | Integer or integer array | If you specify "Day" or "Week" for `frequency`, you can specify one or more integers from 0 to 59, separated by commas, as the minutes of the hour when you want to run the workflow. <p>For example, you can specify "30" as the minute mark and using the previous example for hours of the day, you get 10:30 AM, 12:30 PM, and 2:30 PM. | 
| weekDays | String or string array | If you specify "Week" for `frequency`, you can specify one or more days, separated by commas, when you want to run the workflow: "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", and "Sunday" | 
| <*max-runs*> | Integer | By default, workflow instances all run at the same time, or in parallel up to the [default limit](../logic-apps/logic-apps-limits-and-config.md#looping-debatching-limits). To change this limit by setting a new <*count*> value, see [Change trigger concurrency](#change-trigger-concurrency). | 
| <*max-runs-queue*> | Integer | When your workflow is already running the maximum number of instances, which you can change based on the `runtimeConfiguration.concurrency.runs` property, any new runs are put into this queue up to the [default limit](../logic-apps/logic-apps-limits-and-config.md#looping-debatching-limits). To change the default limit, see [Change waiting runs limit](#change-waiting-runs). | 
| <*operation-option*> | String | You can change the default behavior by setting the `operationOptions` property. For more information, see [Operation options](#operation-options). | 
|||| 

*Example 1*

This basic recurrence trigger runs daily:

```json
"Recurrence": {
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
"Recurrence": {
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
"Recurrence": {
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

### Request trigger

This trigger makes your logic app callable by creating an endpoint that can accept incoming requests. 
For this trigger, provide a JSON schema that describes and validates the payload or inputs 
that the trigger receives from the incoming request. The schema also makes trigger properties 
easier to reference from later actions in the workflow. 

To call this trigger, you must use the `listCallbackUrl` API, which is described in the 
[Workflow Service REST API](https://docs.microsoft.com/rest/api/logic/workflows). 
To learn how to use this trigger as an HTTP endpoint, see 
[Call, trigger, or nest workflows with HTTP endpoints](../logic-apps/logic-apps-http-endpoint.md).

```json
"manual": {
   "type": "Request",
   "kind": "Http",
   "inputs": {
      "method": "<method-type>",
      "relativePath": "<relative-path-for-accepted-parameter>",
      "schema": {
         "type": "object",
         "properties": { 
            "<property-name>": {
               "type": "<property-type>"
            }
         },
         "required": [ "<required-properties>" ]
      }
   },
   "runTimeConfiguration": {
      "concurrency": {
         "runs": <max-runs>,
         "maximumWaitingRuns": <max-run-queue>
      },
   },
   "operationOptions": "<operation-option>"
}
```

*Required*

| Value | Type | Description | 
|-------|------|-------------| 
| <*property-name*> | String | The name of a property in the JSON schema, which describes the payload | 
| <*property-type*> | String | The property's type | 
|||| 

*Optional*

| Value | Type | Description | 
|-------|------|-------------| 
| <*method-type*> | String | The method that incoming requests must use to call your logic app: "GET", "PUT", "POST", "PATCH", "DELETE" |
| <*relative-path-for-accepted-parameter*> | String | The relative path for the parameter that your endpoint's URL can accept | 
| <*required-properties*> | Array | One or more properties that require values | 
| <*max-runs*> | Integer | By default, workflow instances all run at the same time, or in parallel up to the [default limit](../logic-apps/logic-apps-limits-and-config.md#looping-debatching-limits). To change this limit by setting a new <*count*> value, see [Change trigger concurrency](#change-trigger-concurrency). | 
| <*max-runs-queue*> | Integer | When your workflow is already running the maximum number of instances, which you can change based on the `runtimeConfiguration.concurrency.runs` property, any new runs are put into this queue up to the [default limit](../logic-apps/logic-apps-limits-and-config.md#looping-debatching-limits). To change the default limit, see [Change waiting runs limit](#change-waiting-runs). | 
| <*operation-option*> | String | You can change the default behavior by setting the `operationOptions` property. For more information, see [Operation options](#operation-options). | 
|||| 

*Example*

This trigger specifies that an incoming request must 
use the HTTP POST method to call the trigger and includes 
a schema that validates input from the incoming request: 

```json
"manual": {
   "type": "Request",
   "kind": "Http",
   "inputs": {
      "method": "POST",
      "schema": {
         "type": "object",
         "properties": {
            "customerName": {
               "type": "String"
            },
            "customerAddress": { 
               "type": "Object",
               "properties": {
                  "streetAddress": {
                     "type": "string"
                  },
                  "city": {
                     "type": "string"
                  }
               }
            }
         }
      }
   }
}
```

<a name="trigger-conditions"></a>

## Trigger conditions

For any trigger, and only triggers, you can include an array that contains one 
or more expressions for conditions that determine whether the workflow should run. 
To add the `conditions` property to a trigger in your workflow, 
open your logic app in the code view editor.

For example, you can specify that a trigger fires only when 
a website returns an internal server error by referencing the 
trigger's status code in the `conditions` property:

```json
"Recurrence": {
   "type": "Recurrence",
   "recurrence": {
      "frequency": "Hour",
      "interval": 1
   },
   "conditions": [ {
      "expression": "@equals(triggers().code, 'InternalServerError')"
   } ]
}
```

By default, a trigger fires only after getting a "200 OK" response. 
When an expression references a trigger's status code, 
the trigger's default behavior is replaced. So, if you 
want the trigger to fire for more than one status code, 
such as the "200" and "201" status code, you must include 
this expression as your condition: 

`@or(equals(triggers().code, 200),equals(triggers().code, 201))` 

<a name="split-on-debatch"></a>

## Trigger multiple runs

If your trigger returns an array for your logic app to process, 
sometimes a "for each" loop might take too long to process each array item. 
Instead, you can use the **SplitOn** property in your trigger to *debatch* the array. 
Debatching splits up the array items and starts a new workflow instance 
that runs for each array item. This approach is useful, for example, 
when you want to poll an endpoint that might return multiple new items between polling intervals.
For the maximum number of array items that **SplitOn** can process in a single logic app run, 
see [Limits and configuration](../logic-apps/logic-apps-limits-and-config.md#looping-debatching-limits). 

> [!NOTE]
> You can't use **SplitOn** with a synchronous response pattern. 
> Any workflow that uses **SplitOn** and includes a response action 
> runs asynchronously and immediately sends a `202 ACCEPTED` response.

If your trigger's Swagger file describes a payload that is an array, 
the **SplitOn** property is automatically added to your trigger. 
Otherwise, add this property inside the response payload that has 
the array you want to debatch. 

*Example*

Suppose you have an API that returns this response: 
  
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
 
Your logic app only needs the content from the array in `Rows`, 
so you can create a trigger like this example:

``` json
"HTTP_Debatch": {
   "type": "Http",
    "inputs": {
        "uri": "https://mydomain.com/myAPI",
        "method": "GET"
    },
   "recurrence": {
      "frequency": "Second",
      "interval": 1
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

Your workflow definition can now use `@triggerBody().name` to get the `name` values, 
which are `"customer-name-one"` from the first run and `"customer-name-two"` from the second run. 
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

<a name="actions-overview"></a>

## Actions overview

Azure Logic Apps provides various action types - each with 
different inputs that define an action's unique behavior. 

Actions have these high-level elements, though some are optional:

```json
"<action-name>": {
   "type": "<action-type>",
   "inputs": { 
      "<input-name>": { "<input-value>" },
      "retryPolicy": "<retry-behavior>" 
   },
   "runAfter": { "<previous-trigger-or-action-status>" },
   "runtimeConfiguration": { "<runtime-config-options>" },
   "operationOptions": "<operation-option>"
},
```

*Required*

| Value | Type | Description | 
|-------|------|-------------|
| <*action-name*> | String | The name for the action | 
| <*action-type*> | String | The action type, for example, "Http" or "ApiConnection"| 
| <*input-name*> | String | The name for an input that defines the action's behavior | 
| <*input-value*> | Various | The input value, which can be a string, integer, JSON object, and so on | 
| <*previous-trigger-or-action-status*> | JSON Object | The name and resulting status for the trigger or action that must run immediately before this current action can run | 
|||| 

*Optional*

| Value | Type | Description | 
|-------|------|-------------|
| <*retry-behavior*> | JSON Object | Customizes the retry behavior for intermittent failures, which have the 408, 429, and 5XX status code, and any connectivity exceptions. For more information, see Retry policies. | 
| <*runtime-config-options*> | JSON Object | For some actions, you can change the action's behavior at run time by setting `runtimeConfiguration` properties. For more information, see [Runtime configuration settings](#runtime-config-options). | 
| <*operation-option*> | String | For some actions, you can change the default behavior by setting the `operationOptions` property. For more information, see [Operation options](#operation-options). | 
|||| 

## Action types list

Here are some commonly used action types: 

* [Built-in action types](#built-in-actions) such as these examples and more: 

  * [**HTTP**](#http-action) for calling endpoints over HTTP or HTTPS

  * [**Response**](#response-action) for responding to requests

  * [**Execute JavaScript Code**](#run-javascript-code) for running JavaScript code snippets

  * [**Function**](#function-action) for calling Azure Functions

  * Data operation actions such as [**Join**](#join-action), [**Compose**](#compose-action), 
  [**Table**](#table-action), [**Select**](#select-action), and others that create 
  or transform data from various inputs

  * [**Workflow**](#workflow-action) for calling another logic app workflow

* [Managed API action types](#managed-api-actions) such as 
[**ApiConnection**](#apiconnection-action) and [**ApiConnectionWebHook**](#apiconnectionwebhook-action) 
that call various connectors and APIs managed by Microsoft, for example, 
Azure Service Bus, Office 365 Outlook, Power BI, 
Azure Blob Storage, OneDrive, GitHub, and more

* [Control workflow action types](#control-workflow-actions) 
such as [**If**](#if-action), [**Foreach**](#foreach-action), 
[**Switch**](#switch-action), [**Scope**](#scope-action), 
and [**Until**](#until-action), which contain other actions 
and help you organize workflow execution

<a name="built-in-actions"></a>

### Built-in actions

| Action type | Description | 
|-------------|-------------| 
| [**Compose**](#compose-action) | Creates a single output from inputs, which can have various types. | 
| [**Execute JavaScript Code**](#run-javascript-code) | Run JavaScript code snippets that fit within specific criteria. For code requirements and more information, see [Add and run code snippets with inline code](../logic-apps/logic-apps-add-run-inline-code.md). |
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

<a name="managed-api-actions"></a>

### Managed API actions

| Action type | Description | 
|-------------|-------------|  
| [**ApiConnection**](#apiconnection-action) | Calls an HTTP endpoint by using a [Microsoft-managed API](../connectors/apis-list.md). | 
| [**ApiConnectionWebhook**](#apiconnectionwebhook-action) | Works like HTTP Webhook but uses a [Microsoft-managed API](../connectors/apis-list.md). | 
||| 

<a name="control-workflow-actions"></a>

### Control workflow actions

These actions help you control workflow execution and include other actions. 
From outside a control workflow action, you can directly reference actions 
inside that control workflow action. For example, if you have an `Http` action inside a scope, 
you can reference the `@body('Http')` expression from anywhere in the workflow. 
However, actions that exist inside a control workflow action can only "run after" 
other actions that are in the same control workflow structure.

| Action type | Description | 
|-------------|-------------| 
| [**ForEach**](#foreach-action) | Run the same actions in a loop for every item in an array. | 
| [**If**](#if-action) | Run actions based on whether the specified condition is true or false. | 
| [**Scope**](#scope-action) | Run actions based on the group status from a set of actions. | 
| [**Switch**](#switch-action) | Run actions organized into cases when values from expressions, objects, or tokens match the values specified by each case. | 
| [**Until**](#until-action) | Run actions in a loop until the specified condition is true. | 
|||  

## Actions - Detailed reference

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
| <*retry-behavior*> | JSON Object | Customizes the retry behavior for intermittent failures, which have the 408, 429, and 5XX status code, and any connectivity exceptions. For more information, see [Retry policies](../logic-apps/logic-apps-exception-handling.md#retry-policies). | 
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

<a name="apiconnection-webhook-action"></a>

### APIConnectionWebhook action

This action sends a subscription request over HTTP to an endpoint 
by using a [Microsoft-managed API](../connectors/apis-list.md), 
provides a *callback URL* to where the endpoint can send a response, 
and waits for the endpoint to respond. For more information, see 
[Endpoint subscriptions](#subscribe-unsubscribe).

```json
"<action-name>": {
   "type": "ApiConnectionWebhook",
   "inputs": {
      "subscribe": {
         "method": "<method-type>",
         "uri": "<api-subscribe-URL>",
         "headers": { "<header-content>" },
         "body": "<body-content>",
         "authentication": { "<authentication-method>" },
         "retryPolicy": "<retry-behavior>",
         "queries": { "<query-parameters>" },
         "<other-action-specific-input-properties>"
      },
      "unsubscribe": {
         "method": "<method-type>",
         "uri": "<api-unsubscribe-URL>",
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
| <*api-subscribe-URL*> | String | The URI to use for subscribing to the API | 
|||| 

*Optional*

| Value | Type | Description | 
|-------|------|-------------| 
| <*api-unsubscribe-URL*> | String | The URI to use for unsubscribing from the API | 
| <*header-content*> | JSON Object | Any headers to send in the request <p>For example, to set the language and type on a request: <p>`"headers": { "Accept-Language": "en-us", "Content-Type": "application/json" }` |
| <*body-content*> | JSON Object | Any message content to send in the request | 
| <*authentication-method*> | JSON Object | The method the request uses for authentication. For more information, see [Scheduler Outbound Authentication](../scheduler/scheduler-outbound-authentication.md). |
| <*retry-behavior*> | JSON Object | Customizes the retry behavior for intermittent failures, which have the 408, 429, and 5XX status code, and any connectivity exceptions. For more information, see [Retry policies](../logic-apps/logic-apps-exception-handling.md#retry-policies). | 
| <*query-parameters*> | JSON Object | Any query parameters to include with the API call <p>For example, the `"queries": { "api-version": "2018-01-01" }` object adds `?api-version=2018-01-01` to the call. | 
| <*other-action-specific-input-properties*> | JSON Object | Any other input properties that apply to this specific action | 
| <*other-action-specific-properties*> | JSON Object | Any other properties that apply to this specific action | 
|||| 

You can also specify limits on an **ApiConnectionWebhook** action 
in the same way as [HTTP asynchronous limits](#asynchronous-limits).

<a name="compose-action"></a>

### Compose action

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

<!-- markdownlint-disable MD038 -->
This action definition merges `abcdefg ` 
with a trailing space and the value `1234`:
<!-- markdownlint-enable MD038 -->

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

<a name="run-javascript-code"></a>

### Execute JavaScript Code action

This action runs a JavaScript code snippet and returns the results 
through a `Result` token that later actions can reference.

```json
"Execute_JavaScript_Code": {
   "type": "JavaScriptCode",
   "inputs": {
      "code": "<JavaScript-code-snippet>",
      "explicitDependencies": {
         "actions": [ <previous-actions> ],
         "includeTrigger": true
      }
   },
   "runAfter": {}
}
```

*Required*

| Value | Type | Description |
|-------|------|-------------|
| <*JavaScript-code-snippet*> | Varies | The JavaScript code that you want to run. For code requirements and more information, see [Add and run code snippets with inline code](../logic-apps/logic-apps-add-run-inline-code.md). <p>In the `code` attribute, your code snippet can use the read-only `workflowContext` object as input. This object has subproperties that give your code access to the results from the trigger and previous actions in your workflow. For more information about the `workflowContext` object, see [Reference trigger and action results in your code](../logic-apps/logic-apps-add-run-inline-code.md#workflowcontext). |
||||

*Required in some cases*

The `explicitDependencies` attribute specifies that you want to explicitly 
include results from the trigger, previous actions, or both as dependencies 
for your code snippet. For more information about adding these dependencies, see 
[Add parameters for inline code](../logic-apps/logic-apps-add-run-inline-code.md#add-parameters). 

For the `includeTrigger` attribute, you can specify `true` or `false` values.

| Value | Type | Description |
|-------|------|-------------|
| <*previous-actions*> | String array | An array with your specified action names. Use the action names that appear in your workflow definition where action names use underscores (_), not spaces (" "). |
||||

*Example 1*

This action runs code that gets your logic app's name and returns 
the text "Hello world from <logic-app-name>" as the result. 
In this example, the code references the workflow's name by 
accessing the `workflowContext.workflow.name` property through 
the read-only `workflowContext` object. For more information about 
using the `workflowContext` object, see 
[Reference trigger and action results in your code](../logic-apps/logic-apps-add-run-inline-code.md#workflowcontext).

```json
"Execute_JavaScript_Code": {
   "type": "JavaScriptCode",
   "inputs": {
      "code": "var text = \"Hello world from \" + workflowContext.workflow.name;\r\n\r\nreturn text;"
   },
   "runAfter": {}
}
```

*Example 2*

This action runs code in a logic app that triggers when 
a new email arrives in an Office 365 Outlook account. 
The logic app also uses a send approval email action that 
forwards the content from the received email along with a 
request for approval. 

The code extracts email addresses from the trigger's `Body` 
property and returns those email addresses along with the 
`SelectedOption` property value from the approval action. 
The action explicitly includes the send approval email action 
as a dependency in the `explicitDependencies` > `actions` attribute.

```json
"Execute_JavaScript_Code": {
   "type": "JavaScriptCode",
   "inputs": {
      "code": "var re = /(([^<>()\\[\\]\\\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))/g;\r\n\r\nvar email = workflowContext.trigger.outputs.body.Body;\r\n\r\nvar reply = workflowContext.actions.Send_approval_email_.outputs.body.SelectedOption;\r\n\r\nreturn email.match(re) + \" - \" + reply;\r\n;",
      "explicitDependencies": {
         "actions": [
            "Send_approval_email_"
         ]
      }
   },
   "runAfter": {}
}
```



<a name="function-action"></a>

### Function action

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

This action definition calls the previously 
created "GetProductID" function:

```json
"GetProductID": {
   "type": "Function",
   "inputs": {
     "function": {
        "id": "/subscriptions/<XXXXXXXXXXXXXXXXXXXX>/resourceGroups/myLogicAppResourceGroup/providers/Microsoft.Web/sites/InventoryChecker/functions/GetProductID"
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

### HTTP action

This action sends a request to the specified endpoint and 
checks the response to determine whether the workflow should run. 

```json
"HTTP": {
   "type": "Http",
   "inputs": {
      "method": "<method-type>",
      "uri": "<HTTP-or-HTTPS-endpoint-URL>"
   },
   "runAfter": {}
}
```

*Required*

| Value | Type | Description | 
|-------|------|-------------| 
| <*method-type*> | String | The method to use for sending the request: "GET", "PUT", "POST", "PATCH", or "DELETE" | 
| <*HTTP-or-HTTPS-endpoint-URL*> | String | The HTTP or HTTPS endpoint to call. Maximum string size: 2 KB | 
|||| 

*Optional*

| Value | Type | Description | 
|-------|------|-------------| 
| <*header-content*> | JSON Object | Any headers to send with the request <p>For example, to set the language and type: <p>`"headers": { "Accept-Language": "en-us", "Content-Type": "application/json" }` |
| <*body-content*> | JSON Object | Any message content to send in the request | 
| <*retry-behavior*> | JSON Object | Customizes the retry behavior for intermittent failures, which have the 408, 429, and 5XX status code, and any connectivity exceptions. For more information, see [Retry policies](../logic-apps/logic-apps-exception-handling.md#retry-policies). | 
| <*query-parameters*> | JSON Object | Any query parameters to include with the request <p>For example, the `"queries": { "api-version": "2018-01-01" }` object adds `?api-version=2018-01-01` to the call. | 
| <*other-action-specific-input-properties*> | JSON Object | Any other input properties that apply to this specific action | 
| <*other-action-specific-properties*> | JSON Object | Any other properties that apply to this specific action | 
|||| 

*Example*

This action definition gets the latest news 
by sending a request to the specified endpoint:

```json
"HTTP": {
   "type": "Http",
   "inputs": {
      "method": "GET",
      "uri": "https://mynews.example.com/latest"
   }
}
```

<a name="join-action"></a>

### Join action

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

Suppose you have a previously created "myIntegerArray" 
variable that contains this integer array: 

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

### Parse JSON action

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

This action definition creates these tokens that you can use in your 
workflow but only in actions that run following the **Parse JSON** action: 

`FirstName`, `LastName`, and `Email`

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

### Query action

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
| <*condition-or-filter*> | String | The condition used for filtering items in the source array <p>**Note**: If no values satisfy the condition, then the action creates an empty array. |
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

### Response action  

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

### Select action

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

### Table action

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

Suppose you have a previously created "myItemArray" 
variable that currently contains this array: 

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

### Terminate action

This action stops the run for a workflow instance, 
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

The properties for the "runStatus" object apply only 
when the "runStatus" property is set to "Failed" status.

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

### Wait action  

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

### Workflow action

This action calls another previously created logic app, 
which means you can include and reuse other logic app workflows. 
You can also use the outputs from the child or *nested* logic app 
in actions that follow the nested logic app, provided that the 
child logic app returns a response.

The Logic Apps engine checks access to the trigger 
you want to call, so make sure you can access that trigger. 
Also, the nested logic app must meet these criteria:

* A trigger makes the nested logic app callable, 
such as a [Request](#request-trigger) or [HTTP](#http-trigger) trigger

* The same Azure subscription as your parent logic app

* To use the outputs from the nested logic app in your 
parent logic app, the nested logic app must have a 
[Response](#response-action) action 

```json
"<nested-logic-app-name>": {
   "type": "Workflow",
   "inputs": {
      "body": { "<body-content" },
      "headers": { "<header-content>" },
      "host": {
         "triggerName": "<trigger-name>",
         "workflow": {
            "id": "/subscriptions/<Azure-subscription-ID>/resourceGroups/<Azure-resource-group>/providers/Microsoft.Logic/<nested-logic-app-name>"
         }
      }
   },
   "runAfter": {}
}
```

*Required*

| Value | Type | Description | 
|-------|------|-------------| 
| <*nested-logic-app-name*> | String | The name for the logic app you want to call | 
| <*trigger-name*> | String | The name for the trigger in the nested logic app you want to call | 
| <*Azure-subscription-ID*> | String | The Azure subscription ID for the nested logic app |
| <*Azure-resource-group*> | String | The Azure resource group name for the nested logic app |
| <*nested-logic-app-name*> | String | The name for the logic app you want to call |
||||

*Optional*

| Value | Type | Description | 
|-------|------|-------------|  
| <*header-content*> | JSON Object | Any headers to send with the call | 
| <*body-content*> | JSON Object | Any message content to send with the call | 
||||

*Outputs*

This action's outputs vary based on the nested logic app's Response action. 
If the nested logic app doesn't include a Response action, the outputs are empty.

*Example*

After the "Start_search" action finishes successfully, 
this workflow action definition calls another logic app 
named "Get_product_information", which passes in the specified inputs: 

```json
"actions": {
   "Start_search": { <action-definition> },
   "Get_product_information": {
      "type": "Workflow",
      "inputs": {
         "body": {
            "ProductID": "24601",
         },
         "host": {
            "id": "/subscriptions/XXXXXXXXXXXXXXXXXXXXXXXXXX/resourceGroups/InventoryManager-RG/providers/Microsoft.Logic/Get_product_information",
            "triggerName": "Find_product"
         },
         "headers": {
            "content-type": "application/json"
         }
      },
      "runAfter": { 
         "Start_search": [ "Succeeded" ]
      }
   }
},
```

## Control workflow action details

<a name="foreach-action"></a>

### Foreach action

This looping action iterates through an array 
and performs actions on each array item. 
By default, the "for each" loop runs in parallel 
up to a maximum number of loops. For this maximum, see 
[Limits and config](../logic-apps/logic-apps-limits-and-config.md#looping-debatching-limits). 
Learn [how to create "for each" loops](../logic-apps/logic-apps-control-flow-loops.md#foreach-loop).

```json
"For_each": {
   "type": "Foreach",
   "actions": { 
      "<action-1>": { "<action-definition-1>" },
      "<action-2>": { "<action-definition-2>" }
   },
   "foreach": "<for-each-expression>",
   "runAfter": {},
   "runtimeConfiguration": {
      "concurrency": {
         "repetitions": <count>
      }
    },
    "operationOptions": "<operation-option>"
}
```

*Required* 

| Value | Type | Description | 
|-------|------|-------------| 
| <*action-1...n*> | String | The names of the actions that run on each array item | 
| <*action-definition-1...n*> | JSON Object | The definitions of the actions that run | 
| <*for-each-expression*> | String | The expression that references each item in the specified array | 
|||| 

*Optional*

| Value | Type | Description | 
|-------|------|-------------| 
| <*count*> | Integer | By default, the "for each" loop iterations run at the same time, or in parallel up to the [default limit](../logic-apps/logic-apps-limits-and-config.md#looping-debatching-limits). To change this limit by setting a new <*count*> value, see [Change "for each" loop concurrency](#change-for-each-concurrency). | 
| <*operation-option*> | String | To run a "for each" loop sequentially, rather than in parallel, set either <*operation-option*> to `Sequential` or <*count*> to `1`, but not both. For more information, see [Run "for each" loops sequentially](#sequential-for-each). | 
|||| 

*Example*

This "for each" loop sends an email for each item in the array, 
which contains attachments from an incoming email. 
The loop sends an email, including the attachment, 
to a person who reviews the attachment.

```json
"For_each": {
   "type": "Foreach",
   "actions": {
      "Send_an_email": {
         "type": "ApiConnection",
         "inputs": {
            "body": {
               "Body": "@base64ToString(items('For_each')?['Content'])",
               "Subject": "Review attachment",
               "To": "Sophie.Owen@contoso.com"
                },
            "host": {
               "connection": {
                  "id": "@parameters('$connections')['office365']['connectionId']"
               }
            },
            "method": "post",
            "path": "/Mail"
         },
         "runAfter": {}
      }
   },
   "foreach": "@triggerBody()?['Attachments']",
   "runAfter": {}
}
```

To specify only an array that is passed as output from the trigger, 
this expression gets the <*array-name*> array from the trigger body. 
To avoid a failure if the array doesn't exist, the expression uses the `?` operator:

`@triggerBody()?['<array-name>']` 

<a name="if-action"></a>

### If action

This action, which is a *conditional statement*, evaluates 
an expression that represents a condition and runs a different 
branch based on whether the condition is true or false. 
If the condition is true, the condition is marked with "Succeeded" status. 
Learn [how to create conditional statements](../logic-apps/logic-apps-control-flow-conditional-statement.md).

``` json
"Condition": {
   "type": "If",
   "expression": { "<condition>" },
   "actions": {
      "<action-1>": { "<action-definition>" }
   },
   "else": {
      "actions": {
        "<action-2>": { "<action-definition" }
      }
   },
   "runAfter": {}
}
```

| Value | Type | Description | 
|-------|------|-------------| 
| <*condition*> | JSON Object | The condition, which can be an expression, to evaluate | 
| <*action-1*> | JSON Object | The action to run when <*condition*> evaluates to true | 
| <*action-definition*> | JSON Object | The definition for the action | 
| <*action-2*> | JSON Object | The action to run when <*condition*> evaluates to false | 
|||| 

The actions in the `actions` or `else` objects get these statuses:

* "Succeeded" when they run and succeed
* "Failed" when they run and fail
* "Skipped" when the respective branch doesn't run

*Example*

This condition specifies that when the integer variable has a value greater than zero, 
the workflow checks a website. If the variable is zero or less, the workflow checks a different website.

```json
"Condition": {
   "type": "If",
   "expression": {
      "and": [ {
         "greater": [ "@variables('myIntegerVariable')", 0 ] 
      } ]
   },
   "actions": { 
      "HTTP - Check this website": {
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
         "HTTP - Check this other website": {
            "type": "Http",
            "inputs": {
               "method": "GET",
               "uri": "http://this-other-url"
            },
            "runAfter": {}
         }
      }
   },
   "runAfter": {}
}
```  

#### How conditions use expressions

Here are some examples that show how you can use expressions in conditions:
  
| JSON | Result | 
|------|--------| 
| "expression": "@parameters('<*hasSpecialAction*>')" | For Boolean expressions only, the condition passes for any value that evaluates to true. <p>To convert other types to Boolean, use these functions: `empty()` or `equals()`. | 
| "expression": "@greater(actions('<*action*>').output.value, parameters('<*threshold*>'))" | For comparison functions, the action runs only when the output from <*action*> is more than the <*threshold*> value. | 
| "expression": "@or(greater(actions('<*action*>').output.value, parameters('<*threshold*>')), less(actions('<*same-action*>').output.value, 100))" | For logic functions and creating nested Boolean expressions, the action runs when the output from <*action*> is more than the <*threshold*> value or under 100. | 
| "expression": "@equals(length(actions('<*action*>').outputs.errors), 0))" | You can use array functions for checking whether the array has any items. The action runs when the `errors` array is empty. | 
||| 

<a name="scope-action"></a>

### Scope action

This action logically groups actions into *scopes*, which get their own status 
after the actions in that scope finish running. You can then use the scope's 
status to determine whether other actions run. Learn [how to create scopes](../logic-apps/logic-apps-control-flow-run-steps-group-scopes.md).

```json
"Scope": {
   "type": "Scope",
   "actions": {
      "<inner-action-1>": {
         "type": "<action-type>",
         "inputs": { "<action-inputs>" },
         "runAfter": {}
      },
      "<inner-action-2>": {
         "type": "<action-type>",
         "inputs": { "<action-inputs>" },
         "runAfter": {}
      }
   }
}
```

*Required*

| Value | Type | Description | 
|-------|------|-------------|  
| <*inner-action-1...n*> | JSON Object | One or more actions that run inside the scope |
| <*action-inputs*> | JSON Object | The inputs for each action |
|||| 

<a name="switch-action"></a>

### Switch action

This action, also known as a *switch statement*, 
organizes other actions into *cases*, and assigns 
a value to each case, except for the default case 
if one exists. When your workflow runs, the **Switch** 
action compares the value from an expression, object, 
or token against the values specified for each case. 
If the **Switch** action finds a matching case, 
your workflow runs only the actions for that case. 
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
to the approval request email selected the "Approve" option 
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

### Until action

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
    "expression": "@equals(outputs('Http')['statusCode', 200])",
    "limit": {
        "count": 60,
        "timeout": "PT1H"
    },
    "runAfter": {}
}
```

<a name="subscribe-unsubscribe"></a>

## Webhooks and subscriptions

Webhook-based triggers and actions don't regularly check endpoints, 
but wait for specific events or data at those endpoints instead. 
These triggers and actions *subscribe* to the endpoints by 
providing a *callback URL* where the endpoint can send responses.

The `subscribe` call happens when the workflow changes in any way, 
for example, when credentials are renewed, or when the input 
parameters change for  a trigger or action. This call uses 
the same parameters as standard HTTP actions. 

The `unsubscribe` call automatically happens when an operation 
makes the trigger or action invalid, for example:

* Deleting or disabling the trigger. 
* Deleting or disabling the workflow. 
* Deleting or disabling the subscription. 

To support these calls, the `@listCallbackUrl()` expression returns a 
unique "callback URL" for the trigger or action. This URL represents 
a unique identifier for the endpoints that use the service's REST API. 
The parameters for this function are the same as the webhook trigger or action.

<a name="asynchronous-limits"></a>

## Change asynchronous duration

For both triggers and actions, you can limit the duration for the asynchronous 
pattern to a specific time interval by adding the `limit.timeout` property. 
That way, if the action hasn't finished when the interval lapses, 
the action's status is marked as `Cancelled` with the `ActionTimedOut` code. 
The `timeout` property uses [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations). 

``` json
"<trigger-or-action-name>": {
   "type": "Workflow | Webhook | Http | ApiConnectionWebhook | ApiConnection",
   "inputs": {},
   "limit": {
      "timeout": "PT10S"
   },
   "runAfter": {}
}
```

<a name="runtime-config-options"></a>

## Runtime configuration settings

You can change the default runtime behavior for 
triggers and actions with these `runtimeConfiguration` 
properties in the trigger or action definition.

| Property | Type | Description | Trigger or action | 
|----------|------|-------------|-------------------| 
| `runtimeConfiguration.concurrency.runs` | Integer | Change the [*default limit*](../logic-apps/logic-apps-limits-and-config.md#looping-debatching-limits) on the number of workflow instances that can run at the same time, or in parallel. This value can help limit the number of requests that backend systems receive. <p>Setting the `runs` property to `1` works the same way as setting the `operationOptions` property to `SingleInstance`. You can set either property, but not both. <p>To change the default limit, see [Change trigger concurrency](#change-trigger-concurrency) or [Trigger instances sequentially](#sequential-trigger). | All triggers | 
| `runtimeConfiguration.concurrency.maximumWaitingRuns` | Integer | Change the [*default limit*](../logic-apps/logic-apps-limits-and-config.md#looping-debatching-limits) on the number of workflow instances that can wait to run when your workflow is already running the maximum concurrent instances. You can change the concurrency limit in the `concurrency.runs` property. <p>To change the default limit, see [Change waiting runs limit](#change-waiting-runs). | All triggers | 
| `runtimeConfiguration.concurrency.repetitions` | Integer | Change the [*default limit*](../logic-apps/logic-apps-limits-and-config.md#looping-debatching-limits) on the number of "for each" loop iterations that can run at the same time, or in parallel. <p>Setting the `repetitions` property to `1` works the same way as setting the `operationOptions` property to `SingleInstance`. You can set either property, but not both. <p>To change the default limit, see [Change "for each" concurrency](#change-for-each-concurrency) or [Run "for each" loops sequentially](#sequential-for-each). | Action: <p>[Foreach](#foreach-action) | 
| `runtimeConfiguration.paginationPolicy.minimumItemCount` | Integer | For specific actions that support and have pagination turned on, this value specifies the *minimum* number of results to retrieve. <p>To turn on pagination, see [Get bulk data, items, or results by using pagination](../logic-apps/logic-apps-exceed-default-page-size-with-pagination.md) | Action: Varied |
| `runtimeConfiguration.staticResult` | JSON Object | For actions that support and have the [static result](../logic-apps/test-logic-apps-mock-data-static-results.md) setting turned on, the `staticResult` object has these attributes: <p>- `name`, which references the current action's static result definition name, which appears inside the `staticResults` attribute in your logic app workflow's `definition` attribute. For more information, see [Static results - Schema reference for Workflow Definition Language](../logic-apps/logic-apps-workflow-definition-language.md#static-results). <p> - `staticResultOptions`, which specifies whether static results are `Enabled` or not for the current action. <p>To turn on static results, see [Test logic apps with mock data by setting up static results](../logic-apps/test-logic-apps-mock-data-static-results.md) | Action: Varied |
||||| 

<a name="operation-options"></a>

## Operation options

You can change the default behavior for triggers 
and actions with the `operationOptions` property 
in trigger or action definition.

| Operation option | Type | Description | Trigger or action | 
|------------------|------|-------------|-------------------| 
| `DisableAsyncPattern` | String | Run HTTP-based actions synchronously, rather than asynchronously. <p><p>To set this option, see [Run actions synchronously](#asynchronous-patterns). | Actions: <p>[ApiConnection](#apiconnection-action), <br>[HTTP](#http-action), <br>[Response](#response-action) | 
| `OptimizedForHighThroughput` | String | Change the [default limit](../logic-apps/logic-apps-limits-and-config.md#throughput-limits) on the number of action executions per 5 minutes to the [maximum limit](../logic-apps/logic-apps-limits-and-config.md#throughput-limits). <p><p>To set this option, see [Run in high throughput mode](#run-high-throughput-mode). | All actions | 
| `Sequential` | String | Run "for each" loop iterations one at a time, rather than all at the same time in parallel. <p>This option works the same way as setting the `runtimeConfiguration.concurrency.repetitions` property to `1`. You can set either property, but not both. <p><p>To set this option, see [Run "for each" loops sequentially](#sequential-for-each).| Action: <p>[Foreach](#foreach-action) | 
| `SingleInstance` | String | Run the trigger for each logic app instance sequentially and wait for the previously active run to finish before triggering the next logic app instance. <p><p>This option works the same way as setting the `runtimeConfiguration.concurrency.runs` property to `1`. You can set either property, but not both. <p>To set this option, see [Trigger instances sequentially](#sequential-trigger). | All triggers | 
||||

<a name="change-trigger-concurrency"></a>

### Change trigger concurrency

By default, logic app instances run at the same time, concurrently, or in parallel up to the 
[default limit](../logic-apps/logic-apps-limits-and-config.md#looping-debatching-limits). 
So, each trigger instance fires before the preceding workflow instance finishes running. 
This limit helps control the number of requests that backend systems receive. 

To change the default limit, you can use either the code view editor or Logic Apps Designer 
because changing the concurrency setting through the designer adds or updates the 
`runtimeConfiguration.concurrency.runs` property in the underlying trigger definition 
and vice versa. This property controls the maximum number of workflow instances that can run in parallel. 

> [!NOTE] 
> If you set the trigger to run sequentially 
> either by using the designer or the code view editor,
> don't set the trigger's `operationOptions` property 
> to `SingleInstance` in the code view editor. 
> Otherwise, you get a validation error. 
> For more information, see [Trigger instances sequentially](#sequential-trigger).

#### Edit in code view 

In the underlying trigger definition, add or update the 
`runtimeConfiguration.concurrency.runs` property to a 
value between `1` and `50` inclusively.

Here is an example that limits concurrent runs to 10 instances:

```json
"<trigger-name>": {
   "type": "<trigger-name>",
   "recurrence": {
      "frequency": "<time-unit>",
      "interval": <number-of-time-units>,
   },
   "runtimeConfiguration": {
      "concurrency": {
         "runs": 10
      }
   }
}
```

#### Edit in Logic Apps Designer

1. In the trigger's upper-right corner, 
choose the ellipses (...) button, and then choose **Settings**.

2. Under **Concurrency Control**, set **Limit** to **On**. 

3. Drag the **Degree of Parallelism** slider to the value you want. 
To run your logic app sequentially, drag the slider value to **1**.

<a name="change-for-each-concurrency"></a>

### Change "for each" concurrency

By default, "for each" loop iterations run at the same time, or in parallel, up to the 
[default limit](../logic-apps/logic-apps-limits-and-config.md#looping-debatching-limits). 
To change the default limit, you can use either the code view editor or Logic Apps Designer 
because changing the concurrency setting through the designer adds or updates the 
`runtimeConfiguration.concurrency.repetitions` property in the underlying "for each" 
action definition and vice versa. This property controls the maximum number of iterations that can run in parallel.

> [!NOTE] 
> If you set the "for each" action to run sequentially 
> either by using the designer or the code view editor,
> don't set the action's `operationOptions` property 
> to `Sequential` in the code view editor. 
> Otherwise, you get a validation error. 
> For more information, see [Run "for each" loops sequentially](#sequential-for-each).

#### Edit in code view 

In the underlying "for each" definition, add or update the 
`runtimeConfiguration.concurrency.repetitions` property to a 
value between `1` and `50` inclusively. 

Here is an example that limits concurrent runs to 10 iterations:

```json
"For_each" {
   "type": "Foreach",
   "actions": { "<actions-to-run>" },
   "foreach": "<for-each-expression>",
   "runAfter": {},
   "runtimeConfiguration": {
      "concurrency": {
         "repetitions": 10
      }
   }
}
```

#### Edit in Logic Apps Designer

1. In the **For each** action, from the upper-right corner, 
choose the ellipses (...) button, and then choose **Settings**.

2. Under **Concurrency Control**, set **Concurrency Control** to **On**. 

3. Drag the **Degree of Parallelism** slider to the value you want. 
To run your logic app sequentially, drag the slider value to **1**.

<a name="change-waiting-runs"></a>

### Change waiting runs limit

By default, logic app workflow instances all run at the same time, concurrently, or in parallel 
up to the [default limit](../logic-apps/logic-apps-limits-and-config.md#looping-debatching-limits). 
Each trigger instance fires before the previously active workflow instance finishes running. 
Although you can [change this default limit](#change-trigger-concurrency), 
when the number of workflow instances reaches the new concurrency limit, 
any other new instances must wait to run. 

The number of runs that can wait also has a 
[default limit](../logic-apps/logic-apps-limits-and-config.md#looping-debatching-limits), 
which you can change. However, after your logic app reaches the limit on waiting runs, 
the Logic Apps engine no longer accepts new runs. Request and webhook triggers return 429 errors, 
and recurring triggers start skipping polling attempts.

To change the default limit on waiting runs, in the underlying trigger definition, 
add the `runtimeConfiguration.concurency.maximumWaitingRuns` property with 
a value between `0` and `100`. 

```json
"<trigger-name>": {
   "type": "<trigger-name>",
   "recurrence": {
      "frequency": "<time-unit>",
      "interval": <number-of-time-units>,
   },
   "runtimeConfiguration": {
      "concurrency": {
         "maximumWaitingRuns": 50
      }
   }
}
```

<a name="sequential-trigger"></a>

### Trigger instances sequentially

To run each logic app workflow instance only after the previous instance finishes running, 
set the trigger to run sequentially. You can use either the code view editor 
or Logic Apps Designer because changing the concurrency setting through designer 
also adds or updates the `runtimeConfiguration.concurrency.runs` 
property in the underlying trigger definition and vice versa. 

> [!NOTE] 
> When you set a trigger to run sequentially 
> either by using the designer or the code view editor, 
> don't set the trigger's `operationOptions` property 
> to `Sequential` in the code view editor. 
> Otherwise, you get a validation error. 

#### Edit in code view

In the trigger definition, set either of these properties, but not both. 

Set the `runtimeConfiguration.concurrency.runs` property to `1`:

```json
"<trigger-name>": {
   "type": "<trigger-name>",
   "recurrence": {
      "frequency": "<time-unit>",
      "interval": <number-of-time-units>,
   },
   "runtimeConfiguration": {
      "concurrency": {
         "runs": 1
      }
   }
}
```

*-or-*

Set the `operationOptions` property to `SingleInstance`:

```json
"<trigger-name>": {
   "type": "<trigger-name>",
   "recurrence": {
      "frequency": "<time-unit>",
      "interval": <number-of-time-units>,
   },
   "operationOptions": "SingleInstance"
}
```

#### Edit in Logic Apps Designer

1. In the trigger's upper-right corner, 
choose the ellipses (...) button, and then choose **Settings**.

2. Under **Concurrency Control**, set **Limit** to **On**. 

3. Drag the **Degree of Parallelism** slider to the number `1`. 

<a name="sequential-for-each"></a>

### Run "for each" loops sequentially

To run a "for each" loop iteration only after the previous iteration finishes running, 
set the "for each" action to run sequentially. You can use either the code view editor 
or Logic Apps Designer because changing the action's concurrency through designer 
also adds or updates the `runtimeConfiguration.concurrency.repetitions` 
property in the underlying action definition and vice versa. 

> [!NOTE] 
> When you set a "for each" action to run sequentially 
> either by using the designer or code view editor,
> don't set the action's `operationOptions` property 
> to `Sequential` in the code view editor. 
> Otherwise, you get a validation error. 

#### Edit in code view

In the action definition, set either of these properties, but not both. 

Set the `runtimeConfiguration.concurrency.repetitions` property to `1`:

```json
"For_each" {
   "type": "Foreach",
   "actions": { "<actions-to-run>" },
   "foreach": "<for-each-expression>",
   "runAfter": {},
   "runtimeConfiguration": {
      "concurrency": {
         "repetitions": 1
      }
   }
}
```

*-or-*

Set the `operationOptions` property to `Sequential`:

```json
"For_each" {
   "type": "Foreach",
   "actions": { "<actions-to-run>" },
   "foreach": "<for-each-expression>",
   "runAfter": {},
   "operationOptions": "Sequential"
}
```

#### Edit in Logic Apps Designer

1. In the **For each** action's upper-right corner, 
choose the ellipses (...) button, and then choose **Settings**.

2. Under **Concurrency Control**, set **Concurrency Control** to **On**. 

3. Drag the **Degree of Parallelism** slider to the number `1`. 

<a name="asynchronous-patterns"></a>

### Run actions synchronously

By default, all HTTP-based actions follow 
the standard asynchronous operation pattern. 
This pattern specifies that when an HTTP-based 
action sends a request to the specified endpoint, 
the remote server sends back a "202 ACCEPTED" response. 
This reply means the server accepted the request for processing. 
The Logic Apps engine keeps checking the URL specified by the 
response's location header until processing stops, which is any non-202 response.

However, requests have a timeout limit, so for long-running actions, 
you can disable the asynchronous behavior by adding and setting 
the `operationOptions` property to `DisableAsyncPattern` under 
the action's inputs.
  
```json
"<some-long-running-action>": {
   "type": "Http",
   "inputs": { "<action-inputs>" },
   "operationOptions": "DisableAsyncPattern",
   "runAfter": {}
}
```

<a name="run-high-throughput-mode"></a>

### Run in high throughput mode

For a single logic app definition, the number of actions that execute every 5 minutes has a 
[default limit](../logic-apps/logic-apps-limits-and-config.md#throughput-limits). 
To raise this limit to the [maximum](../logic-apps/logic-apps-limits-and-config.md#throughput-limits) 
possible, set the `operationOptions` property to `OptimizedForHighThroughput`. 
This setting puts your logic app into "high throughput" mode. 

> [!NOTE]
> High throughput mode is in preview. 
> You can also distribute a workload 
> across more than one logic app as necessary.

```json
"<action-name>": {
   "type": "<action-type>",
   "inputs": { "<action-inputs>" },
   "operationOptions": "OptimizedForHighThroughput",
   "runAfter": {}
}
```

<a name="connector-authentication"></a>

## Authenticate HTTP triggers and actions

HTTP endpoints support different kinds of authentication. 
You can set up authentication for these HTTP triggers and actions:

* [HTTP](../connectors/connectors-native-http.md)
* [HTTP + Swagger](../connectors/connectors-native-http-swagger.md)
* [HTTP Webhook](../connectors/connectors-native-webhook.md)

Here are the kinds of authentication you can set up:

* [Basic authentication](#basic-authentication)
* [Client certificate authentication](#client-certificate-authentication)
* [Azure Active Directory (Azure AD) OAuth authentication](#azure-active-directory-oauth-authentication)

> [!IMPORTANT]
> Make sure you protect any sensitive information 
> that your logic app workflow definition handles. 
> Use secured parameters and encode data as necessary. 
> For more information about using and securing parameters, 
> see [Secure your logic app](../logic-apps/logic-apps-securing-a-logic-app.md#secure-action-parameters).

<a name="basic-authentication"></a>

### Basic authentication

For [basic authentication](../active-directory-b2c/active-directory-b2c-custom-rest-api-netfw-secure-basic.md) 
by using Azure Active Directory, your trigger or action definition can 
include an `authentication` JSON object, which has the properties 
specified by the following table. To access parameter values at runtime, 
you can use the `@parameters('parameterName')` expression, which is 
provided by the [Workflow Definition Language](https://aka.ms/logicappsdocs). 

| Property | Required | Value | Description | 
|----------|----------|-------|-------------| 
| **type** | Yes | "Basic" | The authentication type to use, which is "Basic" here | 
| **username** | Yes | "@parameters('userNameParam')" | The user name for authenticating access to the target service endpoint |
| **password** | Yes | "@parameters('passwordParam')" | The password for authenticating access to the target service endpoint |
||||| 

In this example HTTP action definition, the `authentication` 
section specifies `Basic` authentication. For more 
information about using and securing parameters, see 
[Secure your logic app](../logic-apps/logic-apps-securing-a-logic-app.md#secure-action-parameters).

```json
"HTTP": {
   "type": "Http",
   "inputs": {
      "method": "GET",
      "uri": "https://www.microsoft.com",
      "authentication": {
         "type": "Basic",
         "username": "@parameters('userNameParam')",
         "password": "@parameters('passwordParam')"
      }
  },
  "runAfter": {}
}
```

> [!IMPORTANT]
> Make sure you protect any sensitive information 
> that your logic app workflow definition handles. 
> Use secured parameters and encode data as necessary. 
> For more information about securing parameters, 
> see [Secure your logic app](../logic-apps/logic-apps-securing-a-logic-app.md#secure-action-parameters).

<a name="client-certificate-authentication"></a>

### Client Certificate authentication

For [certificate-based authentication](../active-directory/authentication/active-directory-certificate-based-authentication-get-started.md) 
using Azure Active Directory, your trigger or action 
definition can include an `authentication` JSON object, 
which has the properties specified by the following table. 
To access parameter values at runtime, you can use the 
`@parameters('parameterName')` expression, which is provided 
by the [Workflow Definition Language](https://aka.ms/logicappsdocs). 
For limits on the number of client certificates you can use, see 
[Limits and configuration for Azure Logic Apps](../logic-apps/logic-apps-limits-and-config.md).

| Property | Required | Value | Description |
|----------|----------|-------|-------------|
| **type** | Yes | "ClientCertificate" | The authentication type to use for Secure Sockets Layer (SSL) client certificates. While self-signed certificates are supported, self-signed certificates for SSL aren't supported. |
| **pfx** | Yes | "@parameters('pfxParam') | The base64-encoded content from a Personal Information Exchange (PFX) file |
| **password** | Yes | "@parameters('passwordParam')" | The password for accessing the PFX file |
||||| 

In this example HTTP action definition, the `authentication` 
section specifies `ClientCertificate` authentication. 
For more information about using and securing parameters, see 
[Secure your logic app](../logic-apps/logic-apps-securing-a-logic-app.md#secure-action-parameters).

```json
"HTTP": {
   "type": "Http",
   "inputs": {
      "method": "GET",
      "uri": "https://www.microsoft.com",
      "authentication": {
         "type": "ClientCertificate",
         "pfx": "@parameters('pfxParam')",
         "password": "@parameters('passwordParam')"
      }
   },
   "runAfter": {}
}
```

> [!IMPORTANT]
> Make sure you protect any sensitive information 
> that your logic app workflow definition handles. 
> Use secured parameters and encode data as necessary. 
> For more information about securing parameters, 
> see [Secure your logic app](../logic-apps/logic-apps-securing-a-logic-app.md#secure-action-parameters).

<a name="azure-active-directory-oauth-authentication"></a>

### Azure Active Directory (AD) OAuth authentication

For [Azure AD OAuth authentication](../active-directory/develop/authentication-scenarios.md), 
your trigger or action definition can include an `authentication` JSON object, 
which has the properties specified by the following table. To access parameter values at runtime, 
you can use the `@parameters('parameterName')` expression, which is 
provided by the [Workflow Definition Language](https://aka.ms/logicappsdocs).

| Property | Required | Value | Description |
|----------|----------|-------|-------------|
| **type** | Yes | `ActiveDirectoryOAuth` | The authentication type to use, which is "ActiveDirectoryOAuth" for Azure AD OAuth |
| **authority** | No | <*URL-for-authority-token-issuer*> | The URL for the authority that provides the authentication token |
| **tenant** | Yes | <*tenant-ID*> | The tenant ID for the Azure AD tenant |
| **audience** | Yes | <*resource-to-authorize*> | The resource that you want to use for authorization, for example, `https://management.core.windows.net/` |
| **clientId** | Yes | <*client-ID*> | The client ID for the app requesting authorization |
| **credentialType** | Yes | "Certificate" or "Secret" | The credential type the client uses for requesting authorization. This property and value don't appear in your underlying definition, but determines the required parameters for the credential type. |
| **pfx** | Yes, only for "Certificate" credential type | "@parameters('pfxParam') | The base64-encoded content from a Personal Information Exchange (PFX) file |
| **password** | Yes, only for "Certificate" credential type | "@parameters('passwordParam')" | The password for accessing the PFX file |
| **secret** | Yes, only for "Secret" credential type | "@parameters('secretParam')" | The client secret for requesting authorization |
|||||

In this example HTTP action definition, the `authentication` section specifies 
`ActiveDirectoryOAuth` authentication and the "Secret" credential type. 
For more information about using and securing parameters, see 
[Secure your logic app](../logic-apps/logic-apps-securing-a-logic-app.md#secure-action-parameters).

```json
"HTTP": {
   "type": "Http",
   "inputs": {
      "method": "GET",
      "uri": "https://www.microsoft.com",
      "authentication": {
         "type": "ActiveDirectoryOAuth",
         "tenant": "72f988bf-86f1-41af-91ab-2d7cd011db47",
         "audience": "https://management.core.windows.net/",
         "clientId": "34750e0b-72d1-4e4f-bbbe-664f6d04d411",
         "secret": "@parameters('secretParam')"
     }
   },
   "runAfter": {}
}
```

> [!IMPORTANT]
> Make sure you protect any sensitive information 
> that your logic app workflow definition handles. 
> Use secured parameters and encode data as necessary. 
> For more information about securing parameters, 
> see [Secure your logic app](../logic-apps/logic-apps-securing-a-logic-app.md#secure-action-parameters).

## Next steps

* Learn more about [Workflow Definition Language](../logic-apps/logic-apps-workflow-definition-language.md)
