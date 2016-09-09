<properties 
	pageTitle="Create an API for Logic Apps" 
	description="Creating a custom API to use with Logic Apps" 
	authors="jeffhollan" 
	manager="dwrede" 
	editor="" 
	services="logic-apps" 
	documentationCenter=""/>

<tags
	ms.service="logic-apps"
	ms.workload="integration"
	ms.tgt_pltfrm="na"
	ms.devlang="na"	
	ms.topic="article"
	ms.date="07/25/2016"
	ms.author="jehollan"/>
    
# Creating a custom API to use with Logic Apps

If you want to extend the Logic Apps platform, there are many ways you can call into APIs or systems that aren't available as one of our many out-of-the-box connectors.  One of those ways to create an API App you can call from within a Logic App workflow.

## Helpful Tools

For APIs to work best with Logic Apps, we recommend generating a [swagger](http://swagger.io) doc detailing the supported operations and parameters for your API.  There are many libraries (like [Swashbuckle](https://github.com/domaindrivendev/Swashbuckle)) that will automatically generate the swagger for you.  You can also use [TRex](https://github.com/nihaue/TRex) to help annotate the swagger to work well with Logic Apps (display names, property types, etc.).  For some samples of API Apps built for Logic Apps, be sure to check out our [GitHub repository](http://github.com/logicappsio) or [blog](http://aka.ms/logicappsblog).

## Actions

The basic action for a Logic App is a controller that will accept an HTTP Request and return a response (usually 200).  However there are different patterns you can follow to extend actions based on your needs.

By default the Logic App engine will timeout a request after 1 minute.  However, you can have your API execute on actions that take longer, and have the engine wait for completion, by following either an async or webhook pattern detailed below.

For standard actions, simply write an HTTP request method in your API which is exposed via swagger.  You can see samples of API apps that work with Logic Apps in our [GitHub repository](https://github.com/logicappsio).  Below are ways to accomplish common patterns with a custom connector.

### Long Running Actions - Async Pattern

When running a long step or task, the first thing you need to do is make sure the engine knows you haven’t timed out. You also need to communicate with the engine how it will know when you are finished with the task, and finally, you need to return relevant data to the engine so it can continue with the workflow. You can complete that via an API by following the flow below. These steps are from the point-of-view of the custom API:

1. When a request is received, immediately return a response (before work is done). This response will be a `202 ACCEPTED` response, letting the engine know you got the data, accepted the payload, and are now processing. The 202 response should contain the following headers: 
 * `location` header (required): This is an absolute path to the URL Logic Apps can use to check the status of the job.
 * `retry-after` (optional, will default to 20 for actions). This is the number of seconds the engine should wait before polling the location header URL to check status.

2. When a job status is checked, perform the following checks: 
 * If the job is done: return a `200 OK` response, with the response payload.
 * If the job is still processing: return another `202 ACCEPTED` response, with the same headers as the initial response

This pattern allows you to run extremely long tasks within a thread of your custom API, but keep an active connection alive with the Logic Apps engine so it doesn’t timeout or continue before work is completed. When adding this into your Logic App, it’s important to note you do not need do anything in your definition for the Logic App to continue to poll and check the status. As soon as the engine sees a 202 ACCEPTED response with a valid location header, it will honor the async pattern and continue to poll the location header until a non-202 is returned.

You can see a sample of this pattern in GitHub [here](https://github.com/jeffhollan/LogicAppsAsyncResponseSample)

### Webhook Actions

During your workflow, you can have the Logic App pause and wait for a "callback" to continue.  This callback comes in the form of an HTTP POST.  To implement this pattern, you need to provide two endpoints on your controller: subscribe and unsubscribe.

On 'subscribe', the Logic App will create and register a callback URL which your API can store and callback with ready as an HTTP POST.  Any content/headers will be passed into the Logic App and can be used within the remainder of the workflow.  The Logic App engine will call the subscribe point on execution as soon as it hits that step.

If the run was cancelled, the Logic App engine will make a call to the 'unsubscribe' endpoint.  Your API can then unregister the callback URL as needed.

Currently the Logic App Designer doesn't support discovering a webhook endpoint through swagger, so to use this type of action you must add the "Webhook" action and specify the URL, headers, and body of your request.  You can use the `@listCallbackUrl()` workflow function in any of those fields as needed to pass in the callback URL.

You can see a sample of a webhook pattern in GitHub [here](https://github.com/jeffhollan/LogicAppTriggersExample/blob/master/LogicAppTriggers/Controllers/WebhookTriggerController.cs)

## Triggers

In addition to actions, you can have your custom API act as a trigger to a Logic App.  There are two patterns you can follow below to trigger a Logic App:

### Polling Triggers

Polling triggers act much like the Long Running Async actions above.  The Logic App engine will call the trigger endpoint after a certain period of time elapsed (dependent on SKU, 15 seconds for Premium, 1 minute for Standard, and 1 hour for Free).

If there is no data available, the trigger returns a `202 ACCEPTED` response, with a `location` and `retry-after` header.  However, for triggers it is recommended the `location` header contains a query parameter of `triggerState`.  This is some identifier for your API to know when the last time the Logic App fired.  If there is data available, the trigger returns a `200 OK` response with the content payload.  This will fire the Logic App.

For example if I was polling to see if a file was available, you could build a polling trigger that would do the following:

* If a request was received with no triggerState the API would return a `202 ACCEPTED` with a `location` header that has a triggerState of the current time and a `retry-after` of 15.
* If a request was received with a triggerState:
 * Check to see if any files were added after the triggerState DateTime. 
  * If there is 1 file, return a `200 OK` response with the content payload, increment the triggerState to the DateTime of the file I returned, and set the `retry-after` to 15.
  * If there are multiple files, I can return 1 at a time with a `200 OK`, increment my triggerState in the `location` header, and set `retry-after` to 0.  This will let the engine know there is more data available and it will immediately request it at the `location` header specified.
  * If there are no files available, return a `202 ACCEPTED` response, and leave the `location` triggerState the same.  Set `retry-after` to 15.

You can see a sample of a polling trigger in GitHub [here](https://github.com/jeffhollan/LogicAppTriggersExample/tree/master/LogicAppTriggers)

### Webhook Triggers

Webhook triggers act much like Webhook Actions above.  The Logic App engine will call the 'subscribe' endpoint whenever a webhook trigger is added and saved.  Your API can register the webhook URL and call it via HTTP POST whenever data is available.  The content payload and headers will be passed into the Logic App run.

If a webhook trigger is ever deleted (either the Logic App entirely, or just the webhook trigger), the engine will make a call to the 'unsubscribe' URL where your API can unregister the callback URL and stop any processes as needed.

Currently the Logic App Designer doesn't support discovering a webhook trigger through swagger, so to use this type of action you must add the "Webhook" trigger and specify the URL, headers, and body of your request.  You can use the `@listCallbackUrl()` workflow function in any of those fields as needed to pass in the callback URL.

You can see a sample of a webhook trigger in GitHub [here](https://github.com/jeffhollan/LogicAppTriggersExample/tree/master/LogicAppTriggers)