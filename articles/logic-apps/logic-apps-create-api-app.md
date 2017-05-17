---
title: Create web APIs & REST APIs as connectors - Azure Logic Apps | Microsoft Docs
description: Create web APIs & REST APIs to call your APIs, systems, and services in workflows for system integrations with Azure Logic Apps
keywords: web APIs, REST APIs, connectors, workflows, system integrations
services: logic-apps
author: jeffhollan
manager: anneta
editor: ''
documentationcenter: ''

ms.assetid: bd229179-7199-4aab-bae0-1baf072c7659
ms.service: logic-apps
ms.workload: integration
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 5/12/2017
ms.author: LADocs; jehollan
---

# Create custom APIs as connectors for logic apps

Although Azure Logic Apps offers [100+ built-in connectors](../connectors/apis-list.md) 
you can use in logic app workflows, you might want to call APIs, systems, and services 
that aren't available as connectors. You can create your own web APIs and REST APIs 
that provide actions and triggers to use in logic apps.

Other reasons for creating custom APIs to use as connectors:

* Extend your current system integration and data integration workflows.
* Help customers manage their professional or personal tasks around your service.
* Expand the reach, discoverability, and use for your service.

Connectors are basically web APIs that use REST for their interfaces, 
[Swagger metadata](http://swagger.io/specification/) for documentation, 
and JSON format for exchanging data between services. 
Because connectors are REST APIs that communicate through HTTP endpoints, 
you can use any language, like .NET, Java, or Node.js, for building connectors.
You can host your APIs on [Azure App Service](../app-service/app-service-value-prop-what-is.md), 
a platform-as-a-service (PaaS) offering that provides one of the best, easiest, 
and most scalable ways for API hosting. 

Although you can deploy your APIs as [web apps](../app-service-web/app-service-web-overview.md), 
consider deploying your APIs as [API apps](../app-service-api/app-service-api-apps-why-best-platform.md), 
which make your job easier when you build, host, and consume APIs 
in the cloud and on premises. You don't have to change any code in your 
APIs -- just deploy your code to an API app. Learn how to 
[build API apps created with ASP.NET](../app-service-api/app-service-api-dotnet-get-started.md), 
[Java](../app-service-api/app-service-api-java-api-app.md), 
or [Node.js](../app-service-api/app-service-api-nodejs-api-app.md). 

For custom APIs to work with logic apps, your API can provide 
[*actions*](./logic-apps-what-are-logic-apps.md#logic-app-concepts) 
that perform specific tasks in logic app workflows. Your API can also work as a 
[*trigger*](./logic-apps-what-are-logic-apps.md#logic-app-concepts) 
that starts a logic app when new data or an event at an endpoint meets a specified condition. 
To build actions and triggers in your API, follow the common patterns in this topic, 
based on the behavior that you want your API to provide.

For API App samples built for logic apps, visit the Azure Logic Apps 
[GitHub repository](http://github.com/logicappsio) or [blog](http://aka.ms/logicappsblog).

## Helpful tools

Your custom API works best with logic apps when your API also has a 
[Swagger document](http://swagger.io/specification/) 
that describes your API's operations and parameters.
Many libraries, like [Swashbuckle](https://github.com/domaindrivendev/Swashbuckle), 
can automatically generate the Swagger file for you. 
To annotate the Swagger file for display names, property types, and so on, 
you can also use [TRex](https://github.com/nihaue/TRex) 
so that your Swagger file also works well with logic apps.

<a name="actions"></a>
## Actions

Your custom API can provide [*actions*](./logic-apps-what-are-logic-apps.md#logic-app-concepts) 
that logic apps use to perform tasks. Each action maps to an operation in your API. 
The basic action is a controller that accepts HTTP requests and returns HTTP responses, 
like `200 OK`. The logic app workflow sends an HTTP request to your web app or API app, 
which then returns an HTTP response, along with content that the workflow can process.

For a standard action, you can write an HTTP request method in your API, 
expose that method through Swagger, and call your API directly with an 
[HTTP action](../connectors/connectors-native-http.md). 
By default, all the steps required for responding to the original request must finish within the 
[request timeout limit](./logic-apps-limits-and-config.md). 

To make a logic app wait while your API finishes longer-running tasks, 
you can use the [asynchronous pattern](#async-pattern) 
or the [webhook pattern](#webhook-actions) described in this topic. 
For samples, visit the [Logic Apps GitHub repository](https://github.com/logicappsio). 

<a name="async-pattern"></a>
### Handle long-running actions with the asynchronous pattern

To have your API perform tasks that could take longer than the 
[request timeout limit](./logic-apps-limits-and-config.md), 
you can use the asynchronous pattern. This approach has 
your API do work in a separate thread, 
but keep an active connection to the Logic Apps engine. 
That way, the logic app doesn't time out or continue 
workflow before your API finishes its job.

Here's the general pattern:

1. Make sure that the engine knows that your API hasn't timed out.
2. Let the engine know when your API finishes the task.
3. Return relevant data to the engine so that the logic app workflow can continue.

Here are the specific steps for your API to follow, 
as described from the API's perspective:

1. When your API gets an HTTP request to start work, 
immediately return an HTTP `202 ACCEPTED` response with the 
`location` header described later in this step. 
This response lets the engine know that your API got the request, 
accepted the request payload (data input), and is now processing. 
   
   The `202 ACCEPTED` response should include these headers:
   
   * `location` header (required): Specifies the absolute path to the URL 
   where the engine can check your API's job status.

   * `retry-after` header (optional): Specifies the number of seconds that 
   the engine should wait before polling the `location` URL for job status. 
   By default, the engine checks every 20 seconds. 
   To specify a different interval, include the `retry-after` header 
   and the number of seconds until the next poll.

2. After the specified time passes, the engine polls the `location` URL for job status. 
Your API should perform these checks and return these responses:
   
   * If the job is done, return an HTTP `200 OK` response, 
   along with the response payload (data output).

   * If the job is still processing, return another HTTP `202 ACCEPTED` response, 
   but with the same headers as the original response.

When you use this pattern for your API, you don't have to do anything in the 
logic app workflow definition to continue polling and checking job status. 
When the Logic Apps engine gets an HTTP `202 ACCEPTED` response and a 
valid `location` header, the engine honors the asynchronous pattern and 
continues polling the `location` header until a non-202 response is returned.

For an example that shows this pattern, review this 
[asynchronous controller response sample in GitHub](https://github.com/logicappsio/LogicAppsAsyncResponseSample), 
or review the sample code here:

```csharp
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;

namespace AsyncResponse.Controllers
{
    public class AsyncController : ApiController
    {
        // State dictionary to store the state for the working thread
        private static Dictionary<Guid, bool> runningTasks = new Dictionary<Guid, bool>();

        /// <summary>
        /// This method starts the task, creates a thread to do work, and returns an ID that can be passed in for checking job status.  
        /// In a real world scenario, your dictionary might contain the object that you want to return when the work is done.
        /// </summary>
        /// <returns>HTTP Response with required headers</returns>
        [HttpPost]
        [Route("api/startwork")]
        public async Task<HttpResponseMessage> longrunningtask()
        {
            Guid id = Guid.NewGuid();  // Generate tracking ID
            runningTasks[id] = false;  // Job not done yet
            new Thread(() => doWork(id)).Start();   // Start the thread to do work, but continue on before work completes
            HttpResponseMessage responseMessage = Request.CreateResponse(HttpStatusCode.Accepted);   
            responseMessage.Headers.Add("location", String.Format("{0}://{1}/api/status/{2}", Request.RequestUri.Scheme, Request.RequestUri.Host, id));  // URL to poll for job status
            responseMessage.Headers.Add("retry-after", "20");   // Number of seconds to wait before polling again (default is 20 when not included)
            return responseMessage;
        }

        /// <summary>
        /// This method performs the actual work
        /// </summary>
        /// <param name="id"></param>
        private void doWork(Guid id)
        {
            Debug.WriteLine("Starting work");
            Task.Delay(120000).Wait(); // Do work for 120 seconds
            Debug.WriteLine("Work completed");
            runningTasks[id] = true;  // Set flag to true - work done
        }

        /// <summary>
        /// This method checks job status and provides the redirect for the location header
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("api/status/{id}")]
        [Swashbuckle.Swagger.Annotations.SwaggerResponse(HttpStatusCode.BadRequest, "No job exists with the specified ID")]
        [Swashbuckle.Swagger.Annotations.SwaggerResponse(HttpStatusCode.Accepted, "The job is still running")]
        [Swashbuckle.Swagger.Annotations.SwaggerResponse(HttpStatusCode.OK, "The job has finished")]
        public HttpResponseMessage checkStatus([FromUri] Guid id)
        {
            // If the job is done
            if(runningTasks.ContainsKey(id) && runningTasks[id])
            {
                runningTasks.Remove(id);
                return Request.CreateResponse(HttpStatusCode.OK, "Returned some data here");
            }
            // If the job is still running
            else if(runningTasks.ContainsKey(id))
            {
                HttpResponseMessage responseMessage = Request.CreateResponse(HttpStatusCode.Accepted);
                responseMessage.Headers.Add("location", String.Format("{0}://{1}/api/status/{2}", Request.RequestUri.Scheme, Request.RequestUri.Host, id));  // The URL to poll for job status
                responseMessage.Headers.Add("retry-after", "20");
                return responseMessage;
            }
            // No matching job found
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "No job exists with the specified ID");
            }
        }
    }
}
```

<a name="webhook-actions"></a>
### Pause and wait with the webhook pattern

To make a logic app pause and wait for your API to finish processing 
before workflow continues, you can use the webhook pattern. 
A webhook is an HTTP "callback", which is an HTTP POST that sends 
a message to a URL when an event happens. For this pattern, set up 
two endpoints on your controller: `subscribe` and `unsubscribe`

*  `subscribe` endpoint: When execution reaches your API's action in the workflow, 
the Logic Apps engine calls the `subscribe` endpoint. 
The logic app creates and registers a callback URL, 
which your API stores, and waits for the callback from your API. 
When work is complete, your API calls back with an HTTP POST to the logic app. 
Any returned content and headers are passed to the logic app 
for use in the workflow.

* `unsubscribe` endpoint: If the logic app run is canceled, 
the Logic Apps engine calls the `unsubscribe` endpoint. 
Your API can then unregister the callback URL and stop any processes as necessary.

Currently, the Logic App Designer doesn't support discovering webhook endpoints through Swagger. 
So for this pattern, you have to add a **Webhook** action and specify the URL, headers, and body for your request. 
To pass in the callback URL, you can use the `@listCallbackUrl()` workflow 
function in any of those fields as necessary.

For an example that shows the webhook pattern, review this 
[webhook sample in GitHub](https://github.com/logicappsio/LogicAppTriggersExample/blob/master/LogicAppTriggers/Controllers/WebhookTriggerController.cs).

<a name="triggers"></a>
## Triggers

Your custom API can also act as a [*trigger*](./logic-apps-what-are-logic-apps.md#logic-app-concepts) 
that starts a logic app when new data or an event meets a specified condition. 
A trigger can either check periodically, or wait and listen, for new data or events at an endpoint. 
If new data or an event meets the specified condition, the trigger fires and starts the 
logic app, which is also listening to that trigger. To start logic apps this way, 
have your API follow the *polling trigger* or *webhook trigger* pattern.

<a name="polling-triggers"></a>
### Polling trigger: check for new data or events

A *polling trigger* periodically checks an endpoint for new data or events at a specified frequency and interval. 
If the trigger finds new data or an event that meets the specified condition, 
the trigger fires and creates a logic app instance, which then processes the data as input. 
To prevent processing the same data multiple times, 
the trigger should clean up data that was already read and passed to the logic app. 

Polling triggers act much like the [long-running asynchronous actions](#async-pattern) 
previously described in this topic. The Logic Apps engine calls the trigger 
after a specified period of time. Based on your App Service plan, 
this interval is 15 seconds for Premium plans, 1 minute for Standard plans, and 1 hour for Free plans. 
Each polling request counts as an action execution, even when no logic app instance is created.

*  If the trigger doesn't find new data, 
the trigger returns an HTTP `202 ACCEPTED` response to the engine, 
along with a `location` header and `retry-after` header. 

   For triggers, the `location` header should also
   contain a `triggerState` query parameter, 
   which is usually a "timestamp." Your API can use this identifier 
   to track the last time that the logic app was triggered. 

*  If the trigger finds new data, the trigger returns 
an HTTP `200 OK` response with the content payload, 
which creates the logic app instance and starts the workflow.

For example, to periodically check your service for new files, 
you might build a polling trigger that has these behaviors:

* If the trigger gets a request with no `triggerState` from the engine, 
your API returns an HTTP `202 ACCEPTED` response, a `location` header 
with `triggerState` set to the current time, and a `retry-after` of 15.

* If the trigger gets a request with a `triggerState` from the engine, 
your API checks your service for files added after the `DateTime` for `triggerState`.

  * If the trigger finds a single file, 
  your API returns an HTTP `200 OK` response and the content payload, 
  updates `triggerState` to the `DateTime` for the returned file, 
  and sets `retry-after` to 15.

  * If the trigger finds multiple files, 
  your API returns one file at a time and an HTTP `200 OK` response, 
  updates `triggerState`, and sets `retry-after` to 0. 

    These steps let the engine know that more data is available, 
    and that the engine should immediately request that data 
    from the URL in the `location` header.

  * If the trigger finds no files, your API returns an HTTP `202 ACCEPTED` response, 
  doesn't change `triggerState`, and sets `retry-after` to 15.

For an example that shows a poll trigger, review this 
[poll trigger controller sample in GitHub](https://github.com/logicappsio/LogicAppTriggersExample/blob/master/LogicAppTriggers/Controllers/PollTriggerController.cs).

<a name="webhook-triggers"></a>
### Webhook trigger: wait for new data or events

A webhook trigger is a *push trigger* that waits and listens for new data or 
events at an endpoint. If new data or an event meets the specified condition, 
the trigger fires and creates a logic app instance, which then processes the data as input.
To prevent processing the same data multiple times, 
the trigger should clean up data that was already read and passed to the logic app.

Webhook triggers act much like the [webhook actions](#webhook-actions) previously 
described in this topic, and are set up with `subscribe` and `unsubscribe` endpoints. 

* `subscribe` endpoint: When you add and save a webhook trigger in your logic app, 
the Logic Apps engine calls the `subscribe` endpoint, and your API registers the callback URL. 
When there's new data or an event that meets the specified condition, 
your API calls back with an HTTP POST to the URL. 
The content payload and headers are passed to the logic app for use in the workflow.

* `unsubscribe` endpoint: If the webhook trigger or entire logic app is deleted, 
the Logic Apps engine calls the `unsubscribe` endpoint. 
Your API can then unregister the callback URL and stop any processes as necessary.

Currently, the Logic App Designer doesn't support discovering webhook endpoints through Swagger. 
So for this pattern, you have to add the **Webhook** trigger and specify the URL, headers, 
and body for your request. To pass in the callback URL, you can use the 
`@listCallbackUrl()` workflow function in any of those fields as necessary.

For an example that shows a webhook trigger, review this 
[webhook trigger controller sample in GitHub](https://github.com/logicappsio/LogicAppTriggersExample/blob/master/LogicAppTriggers/Controllers/WebhookTriggerController.cs).

## Deploy, call, and secure custom APIs

After creating your custom APIs, set up your APIs for deployment so you can call them securely. 
Learn how to [deploy, call, and secure custom APIs for logic apps](./logic-apps-custom-hosted-api.md).

## Publish custom APIs to Azure

To make your custom APIs available for public use in Azure, submit your nominations to the 
[Microsoft Azure Certified program](https://azure.microsoft.com/marketplace/programs/certified/logic-apps/).

## Get help

For specific help with custom APIs, contact [customapishelp@microsoft.com](mailto:customapishelp@microsoft.com).

To ask questions, answer questions, and see what other Azure Logic Apps users are doing, visit the 
[Azure Logic Apps forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurelogicapps).

To help improve Logic Apps and connectors, vote on or submit ideas at the 
[Logic Apps user feedback site](http://aka.ms/logicapps-wish). 

## Next steps

* [Handle content types](./logic-apps-content-type.md)
* [Handle errors and exceptions](./logic-apps-exception-handling.md)
* [Secure access to your logic apps](./logic-apps-securing-a-logic-app.md)
* [Call, trigger, or nest logic apps with HTTP endpoints](./logic-apps-http-endpoint.md)