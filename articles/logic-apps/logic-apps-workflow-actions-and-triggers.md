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
translation.priority.mt: 
  - "de-de"
  - "es-es"
  - "fr-fr"
  - "it-it"
  - "ja-jp"
  - "ko-kr"
  - "pt-br"
  - "ru-ru"
  - "zh-cn"
  - "zh-tw"
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

The **6** types of triggers are:  
  
-   **Request** \- Makes the logic app an endpoint for you to call  
  
-   **Recurrence** \- Fires based on a defined schedule  
  
-   **HTTP** \- Polls an HTTP web endpoint. The HTTP endpoint must conform to a specific  triggering contract \- either by using a 202\-async pattern, or by returning an array  
  
-   **ApiConnection** \- Polls like the HTTP trigger, however, it takes advantage of the [Microsoft managed APIs](https://docs.microsoft.com/azure/connectors/apis-list)  
  
-   **HTTPWebhook** \- Opens an endpoint, similar to the Manual trigger, however, it also calls out to a specified URL to register and unregister  
  
-   **ApiConnectionWebhook** \- Operates like the HTTPWebhook trigger by taking advantage of the Microsoft managed APIs       
    Each trigger type has a different set of **inputs** that defines its behavior.  
  
## Request trigger  

This trigger serves as an endpoint that you call via an HTTP Request to invoke your logic app. 
A request trigger looks like this:  
  
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
|schema|No|A JSON schema that validates the incoming request. This is useful so that the subsequent steps in the workflow can be aware of which properties to reference|  
  
You'll need to call the *listCallbackUrl* API to invoke this endpoint. See 
[Workflow Service REST API](https://docs.microsoft.com/rest/api/logic/workflows).  
  
## Recurrence trigger  

A Recurrence trigger is one that runs based on a defined schedule. Such a trigger might look like this:  

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
|frequency|Yes|How often the trigger will execute. Use only one of these possible values: second, minute, hour, day, week, month or year|  
|interval|Yes|Interval of the given frequency for the recurrence|  
|startTime|No|If a startTime is provided without a UTC offset, this timeZone will be used.|  
|timeZone|no|If a startTime is provided without a UTC offset, this timeZone will be used.|  
  
You can also schedule a trigger to start executing at some point in the future. 
For example, if you want to start a weekly report every Monday you can schedule 
the the logic app to start every Monday by creating the following trigger:  

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

HTTP triggers poll a specified endpoint and check the response to determine if the workflow should be executed. 
The inputs object takes the set of parameters required to construct an HTTP call:  
  
|Element name|Required|Description|Type|  
|----------------|------------|---------------|--------|  
|method|yes|Can be one of the following HTTP methods: GET, POST, PUT, DELETE, PATCH, or HEAD|String|  
|uri|yes|The http or https endpoint that will be called. Maximum of 2 kilobytes.|String|  
|queries|No|An object representing the query parameters to be added to the URL. For example, `"queries" : { "api-version": "2015-02-01" }` will add `?api-version=2015-02-01` to the URL.|Object|  
|headers|No|An object representing each of the headers that will be sent to the request. For example, to set the language and type on a request: `"headers" : { "Accept-Language": "en-us",  "Content-Type": "application/json" }`|Object|  
|body|No|An object representing the payload that will be sent to the endpoint.|Object|  
|retryPolicy|No|An object allowing you to customize the retry behavior for 4xx or 5xx errors.|Object|  
|authentication|No|Represents the method that the request should be authenticated. For details on this object, see [Scheduler Outbound Authentication](https://docs.microsoft.com/azure/scheduler/scheduler-outbound-authentication). There is one additional property supported beyond scheduler: **authority**. By default it is **https:\/\/login.windows.net\/** if not specified, but you can use a different audience like **https:\/\/login.windows\-ppe.net\/**.|Object|  
  
The HTTP trigger requires the HTTP API to conform to a specific pattern to work well with your logic app. 
It requires the following fields:  
  
|Response|Description|  
|------------|---------------|  
|Status code|Status code 200 \(OK\) to cause a run. Any other status code will not cause a run.|  
|Retry\-after header|Number of seconds until the logic app polls the endpoint again.|  
|Location header|The URL to call on the next polling interval. If not specified the original URL will be used.|  
  
Here are some examples of different behaviors for different types of requests:  
  
|Response code|Retry\-After|Behavior|  
|-----------------|----------------|------------|  
|200|\(none\)|Not a valid trigger, Retry\-After is required or else the engine will never poll for the next request.|  
|202|60|Do not trigger the workflow, the next attempt will happen in 1 minute.|  
|200|10|Run the workflow, and check again for more content in 10 seconds.|  
|400|\(none\)|Bad request, do not run the workflow. If there is no **Retry Policy** defined, then the default policy will be used. Once the number of retries have been reached the trigger will no longer be valid.|  
|500|\(none\)|Server error, do not run the workflow.  If there is no **Retry Policy** defined, then the default policy will be used. Once the number of retries have been reached the trigger will no longer be valid.|  
  
The outputs of an HTTP trigger look like this:  
  
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
|queries|No|Object|Represents the query parameters to be added to the URL. For example, `"queries" : { "api-version": "2015-02-01" }` will add `?api-version=2015-02-01` to the URL.|  
|headers|No|Object|Represents each of the headers that will be sent to the request. For example, to set the language and type on a request: `"headers" : { "Accept-Language": "en-us",  "Content-Type": "application/json" }`|  
|body|No|Object|Represents the payload that will be sent to the endpoint.|  
|retryPolicy|No|Object|Allows you to customize the retry behavior for 4xx or 5xx errors.|  
|authentication|No|Object|Represents the method that the request should be authenticated. For details on this object, see [Scheduler Outbound Authentication](https://docs.microsoft.com/azure/scheduler/scheduler-outbound-authentication)|  
  
The properties for host are:  
  
|Element name|Required|Description|  
|----------------|------------|---------------|  
|api runtimeUrl|Yes|The endpoint of the managed API.|  
|connection name||Must be a reference to a parameter called `$connection`. This is the name of the managed API connection that the workflow will use.|  
  
The outputs of an API connection trigger look like this:  
  
|Element name|Type|Description|  
|----------------|--------|---------------|  
|headers|Object|The headers of the http response.|  
|body|Object|The body of the http response.|  
  
## HTTPWebhook trigger  

The HTTPWebhook trigger opens an endpoint, similar to the manual trigger, 
but the HTTPWebhook trigger also calls out to a specified URL to register and unregister. 
Here's an example of what an HTTPWebhook trigger may look like:  

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
  
|Element Name|Required|Description|  
|----------------|------------|---------------|  
|subscribe|No|The outgoing request that is called when the  the trigger is created. This performs the initial registration.|  
|unsubscribe|No|The outgoing request when the trigger is deleted.|  
  
-   **Subscribe** is the outgoing call that's made to start listening to events. It starts with the same set of parameters that the normal http actions do. It is an outgoing call that will be made any time the workflow changes in any way, for example, whenever the credentials are rolled, or the trigger's input parameters change.  
  
    To support this there is a new function: `@listCallbackUrl()`. This function returns a unique URL for this specific trigger in this workflow. It represents the unique identifier for the endpoints that use the Service REST.  
  
-   **Unsubscribe** is called when the user performs an operation that renders this trigger invalid, including:  
  
    -   Deleting\/Disabling the trigger  
  
    -   Deleting\/Disabling the workflow  
  
    -   Deleting\/Disabling the subscription  
  
    The logic app automatically calls the unsubscribe action. The parameters to this function are the same as the HTTP trigger.  
  
    The outputs of the HTTPWebhook trigger are the contents of the incoming request:  
  
|Element  name|Type|Description|  
|-----------------|--------|---------------|  
|headers|Object|The headers of the http request.|  
|body|Object|The body of the http request.|  
  

## Conditions  

For any trigger you can use one or more conditions to determine if the workflow should be run or not. For example:  

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

In this case, the report will only trigger while the sendReports parameter of the workflow is set to true. 
Finally, conditions may reference the status code of the trigger. For example, 
you could kick off a workflow only when your website returns a status code 500, by doing this:  
  
```  
"conditions": [  
        {  
          "expression": "@equals(triggers().code, 'InternalServerError')"  
        }  
      ]  
```  
  
> [!NOTE]  
> When any expression references the status code of the trigger \(in any way\), the default behavior \(trigger only on 200 \(OK\)\) is completely replaced. For example, that if you want to trigger on both status code 200 and status code 201, you have to include: `@or(equals(triggers().code, 200),equals(triggers().code,201))` as your condition.  
  
## Split\-on  

Split\-on allows you to kick\-off multiple runs for a single request. 
This is very useful when you want to poll an endpoint that can have multiple new items between polling intervals.  
  
With Split\-on, you specify the property inside the response payload that contains the array of items, 
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
  
Your logic app only needs the Rows content, so you can construct your trigger like this:  
  
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
  
Then, in the workflow definition, `@triggerBody().name` will return `mycoolrow` for the first run, and  
`another row` for the second run. This means the trigger outputs look like:  
  
```json
{
    "body" : {
        "id" : 938109381,
        "name" : "another row"
    }
}
```

As you can see, if you use split\-on, you will not be able to get the properties that are outside of the array, 
in this case the `Status` field.  
  
> [!NOTE]  
> In this example, we use the `?` operator to be able to avoid a failure if the `Rows` property is not present. 
  
## Single run instance

You can configure triggers that have a recurrence property to only fire if all active runs have completed. 
If a scheduled recurrence occurs while there is an in-progress run, 
the trigger will skip and wait until the next scheduled recurrence interval to check again.

This setting can be configured via the operation options:

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

### Standard Actions  

-   **HTTP** This action calls an HTTP web endpoint.  
  
-   **ApiConnection** \- This action has behavior similar the HTTP action, however, it takes advantage of the Microsoft managed APIs.  
  
-   **ApiConnectionWebhook** \- like HTTPWebhook, but taking advantage of the Microsoft managed APIs.  
  
-   **Response** \- This action defines a response for an incoming call.  
  
-   **Wait** \- This is a simple action that waits a fixed amount of time or until a specific time.  
  
-   **Workflow** \- This action represents a nested workflow.  

### Collection Actions

-   **Scope** \- This action is a logical grouping of other actions.

-   **Condition** \- This is an action that evaluates an expression and executes the corresponding result branch.

-   **ForEach** \- This is a looping action that will iterate over an array and perform inner actions for each item.

-   **Until** \- This is a looping action that will execute inner actions until a condition results to true.
  
Each type of action has a different set of **inputs** which defines action's behavior.  
  
## HTTP action  

HTTP actions call a specified endpoint and checks the response in order to determine if the workflow should run. 
The **inputs** object takes the set of parameters required to construct the HTTP call:  
  
|Element name|Required|Type|Description|  
|----------------|------------|--------|---------------|  
|method|Yes|String|Can be one of the following HTTP methods: **GET**, **POST**, **PUT**, **DELETE**, **PATCH**, or **HEAD**|  
|uri|Yes|String|The http or https endpoint that will be called. Maximum length is 2 kilobytes.|  
|queries|No|Object|Represents the query parameters to be added to the URL. For example, `"queries" : { "api-version": "2015-02-01" }` will add `?api-version=2015-02-01` to the URL.|  
|headers|No|Object|Represents each of the headers that will be sent to the request. For example, to set the language and type on a request: `"headers" : { "Accept-Language": "en-us",  "Content-Type": "application/json" }`|  
|body|No|Object|Represents the payload that will be sent to the endpoint.|  
|retryPolicy|No|Object|Allows you to customize the retry behavior for 4xx or 5xx errors.|  
|operationsOptions|No|String|Defines the set of special behaviors to override.|  
|authentication|No|Object|Represents the method that the request should be authenticated. For details on this object, see [Scheduler Outbound Authentication](https://docs.microsoft.com/azure/scheduler/scheduler-outbound-authentication). There is one additional property supported beyond scheduler: **authority**. By default it is **https:\/\/login.windows.net\/** if not specified, but you can use a different audience like **https:\/\/login.windows\-ppe.net\/**.|  
  
HTTP actions \(and API Connection\) actions support retry policies. A retry policy applies to intermittent failures \(characterized as HTTP status codes 408, 429, and 5xx as well as any connectivity exceptions\) and is described using the *retryPolicy* object defined as follows:  
  
```json
"retryPolicy" : {
    "type": "<type-of-retry-policy>",
    "interval": <retry-interval>,
    "count": <number-of-retry-attempts>
}
```
  
The retry interval is specified in the ISO 8601 format. Its default value is 20 seconds, 
which is also the minimum value. The maximum value is 1 hour. 
The default retry count is 4, 4 is also the maximum retry count. 
If the retry policy definition is not specified, a **fixed** strategy 
is used with default retry count and interval values. 
To disable the retry policy, set its type to **None**.  
  
For example, the following action will retry fetching the latest news 2 times in case of intermittent failures, 
for a total of 3 executions, with a 30 second delay between each attempt:  
  
```json
"latestNews" : {
    "type": "http",
    "inputs": {
        "method": "GET",
        "uri": "uri": "https://mynews.example.com/latest",
        "retryPolicy" : {
            "type": "fixed",
            "interval": "PT30S",
            "count": 2
        }
    }
}
```
  
By default, all HTTP\-based actions support the standard asynchronous operation pattern. 
That is, if the remote server indicates that the request has been accepted for processing 
with a 202 \(Accepted\) response, the Logic Apps engine keeps polling the URL specified 
in the location header of the response until a terminal state is reached \(a non\-202 response\).  
  
In order to disable the asynchronous behavior described above, 
set a 'DisableAsyncPattern' option in the action inputs. In this case, 
the output of the action will be based on the initial 202 response from the server.  
  
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
  
## API Connection  

API Connection is the type of action that references one of the Microsoft managed connectors. 
It requires a reference to a valid connection, and information on the api and parameters required.

|Element name|Required|Type|Description|  
|----------------|------------|--------|---------------|  
|host|Yes|Object|Represents the connector information such as the runtimeUrl and reference to the connection object|
|method|Yes|String|Can be one of the following HTTP methods: **GET**, **POST**, **PUT**, **DELETE**, **PATCH**, or **HEAD**|  
|path|Yes|String|The path of the API operation.|  
|queries|No|Object|Represents the query parameters to be added to the URL. For example, `"queries" : { "api-version": "2015-02-01" }` will add `?api-version=2015-02-01` to the URL.|  
|headers|No|Object|Represents each of the headers that will be sent to the request. For example, to set the language and type on a request: `"headers" : { "Accept-Language": "en-us",  "Content-Type": "application/json" }`|  
|body|No|Object|Represents the payload that will be sent to the endpoint.|  
|retryPolicy|No|Object|Allows you to customize the retry behavior for 4xx or 5xx errors.|  
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
  
## Response action  

This action type contains the entire response payload from an HTTP request. 
This includes a statusCode, body and headers:  
  
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
  
-   If a response action is reached after the incoming request has already been responded to, 
this is considered a failed action \(conflict\) and as a result the run will be Failed.  
  
-   A workflow with Response actions cannot have splitOn in its trigger because one call causes many runs. 
As a result, this should be validated when the flow is PUT and cause a Bad Request.  
  
## Wait action  

Wait action will suspend execution of the workflow for the specified interval. 
For example, to wait for 15 minutes you can use the following:  
  
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
  
Alternatively, to wait until a specific moment in time, you can use the following:  
  
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
|interval unit|Yes|String|One of the following: second, minute, hour, day, week, month, year.|  
|interval count|Yes|String|Duration based on the given internal unit.|  
|until|No|Object|The wait duration based on a point in time.|  
|until timestamp|Yes|String|String&#124;The point in time in UTC when the wait expires.|  

## Query action

Query action allows you to filter an array based on a condition. 
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

The output of **Query** action is an array that contains elements from the input array that satisfy the condition.

> [!NOTE]
> If no values satisfy the **where** condition, the result is an empty array.

|Name|Required|Type|Description|
|--------|------------|--------|---------------|
|from|Yes|Array|The source array.|
|where|Yes|String|The condition to apply to each element of the source array.|

## Terminate action

The Terminate action stops execution of the workflow run, aborting any in-flight actions, 
and skipping any remaining actions. For example, to terminate a run with status **Failed**, 
you can use the following:

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
> The **Compose** action can be used to constuct any output, 
> inluding objects, arrays, and any other type natively supported by logic apps, 
> such as xml and binary.

## Workflow action   

|Name|Required|Type|Description|  
|--------|------------|--------|---------------|  
|host id|Yes|String|The resource ID of the workflow that you want to call.|  
|host triggerName|Yes|String|The name of the trigger that you want to invoke.|  
|queries|No|Object|Represents the query parameters to be added to the URL. For example, `"queries" : { "api-version": "2015-02-01" }` will add `?api-version=2015-02-01` to the URL.|  
|headers|No|Object|Represents each of the headers that will be sent to the request. For example, to set the language and type on a request: `"headers" : { "Accept-Language": "en-us",  "Content-Type": "application/json" }`|  
|body|No|Object|Represents the payload that will be sent to the endpoint.|  
  
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
  
An access check will be made on the workflow \(more specifically, the trigger\), 
meaning you need access to the workflow.  
  
The outputs of the workflow action are based on what you 
defined in the **Response** action in the child workflow. 
If you have not defined any **Response**, then the outputs are empty.  

## Collection actions (scopes and loops)

Some action types can contain actions within themselves. 
Actions within a collection can be referenced directly outside of the collection 
(if `http` was defined in a scope, `@body('http')` is still valid anywhere in a workflow. 
Actions within a collection can only `runAfter` other actions within the same collection.

## Scope action

Scope allows for a logic grouping of actions within a workflow.

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

This is a looping action that will iterate over an array and perform inner actions for each item. 
By default the foreach loop will execute in parallel (20 executions in parallel at a time). 
Execution rules can be set using the `operationOptions` parameter.

|Name|Required|Type|Description|  
|--------|------------|--------|---------------|  
|actions|Yes|Object|Inner actions to execute within the loop|
|foreach|Yes|string|The array to interate over|
|operationOptions|no|string|Any operation options for behavior.  Currently only supports `sequential` to execute iterations sequentially (default behavior is parallel)|

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

This is a looping action that will execute inner actions until a condition results to true.

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

## Conditions /- If Action

The If action allows you to evaluate a condition and execute a branch 
based on if the expression evaluates to `true`.

|Name|Required|Type|Description|  
|--------|------------|--------|---------------|  
|actions|Yes|Object|Inner actions to execute if expression evaluates to `true`|
|expression|Yes|string|The expression to evaluate|
|else|no|Object|Inner actions to execute if expression evaluates to `false`|
  
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
|`"expression": "@parameters('hasSpecialAction')"`|Any value that would evaluate to true will cause this condition to pass. Only boolean expression are supported. Please use functions `empty`, `equals` to convert other types to booleans.|  
|`"expression": "@greater(actions('act1').output.value, parameters('threshold'))"`|Comparison functions are supported. For the example here, the action will only execute if the output of act1 was greater than the threshold.|  
|`"expression": "@or(greater(actions('act1').output.value, parameters('threshold')), less(actions('act1').output.value, 100))"`|Logic functions are also supported to create nested Boolean expressions. In this case the action will execute if the output of act1 was above the threshold, or, below 100.|  
|`"expression": "@equals(length(actions('act1').outputs.errors), 0))"`|You can use array functions to check if an array has any items in it, in this case the action will execute if the errors array is empty|  
|`"expression": "parameters('hasSpecialAction')"`|Error. This is not a valid condition because @ is required for conditions.|  
  
If a condition evaluates successfully, it is marked as `Succeeded`. 
Actions within either the `actions` or `else` objects will evaluate to either `Succeeded` 
if executed and succeeded, `Failed` if executed and failed, or `Skipped` if that branch was not executed.

## Next steps

[Workflow Service REST API](https://docs.microsoft.com/rest/api/logic/workflows)