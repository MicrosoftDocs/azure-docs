---
title: Event Grid trigger for Azure Functions
description: Understand how to handle Event Grid events in Azure Functions.
services: functions
documentationcenter: na
author: ggailey777
manager: jeconnoc
keywords:

ms.service: azure-functions
ms.devlang: multiple
ms.topic: reference
ms.date: 09/04/2018
ms.author: glenga
---

# Event Grid trigger for Azure Functions

This article explains how to handle [Event Grid](../event-grid/overview.md) events in Azure Functions.

Event Grid is an Azure service that sends HTTP requests to notify you about events that happen in *publishers*. A publisher is the service or resource that originates the event. For example, an Azure blob storage account is a publisher, and [a blob upload or deletion is an event](../storage/blobs/storage-blob-event-overview.md). Some [Azure services have built-in support for publishing events to Event Grid](../event-grid/overview.md#event-sources). 

Event *handlers* receive and process events. Azure Functions is one of several [Azure services that have built-in support for handling Event Grid events](../event-grid/overview.md#event-handlers). In this article, you learn how to use an Event Grid trigger to invoke a function when an event is received from Event Grid.

If you prefer, you can use an HTTP trigger to handle Event Grid Events; see [Use an HTTP trigger as an Event Grid trigger](#use-an-http-trigger-as-an-event-grid-trigger) later in this article. Currently, you can't use an Event Grid trigger for an Azure Functions app when the event is delivered in the [CloudEvents schema](../event-grid/cloudevents-schema.md). Instead, use an HTTP trigger.

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]

## Packages - Functions 1.x

The Event Grid trigger is provided in the [Microsoft.Azure.WebJobs.Extensions.EventGrid](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.EventGrid) NuGet package, version 1.x. Source code for the package is in the [azure-functions-eventgrid-extension](https://github.com/Azure/azure-functions-eventgrid-extension/tree/master) GitHub repository.

[!INCLUDE [functions-package](../../includes/functions-package.md)]

## Packages - Functions 2.x

The Event Grid trigger is provided in the [Microsoft.Azure.WebJobs.Extensions.EventGrid](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.EventGrid) NuGet package, version 2.x. Source code for the package is in the [azure-functions-eventgrid-extension](https://github.com/Azure/azure-functions-eventgrid-extension/tree/v2.x) GitHub repository.

[!INCLUDE [functions-package-v2](../../includes/functions-package-v2.md)]

## Example

See the language-specific example for an Event Grid trigger:

* [C#](#c-example)
* [C# script (.csx)](#c-script-example)
* [JavaScript](#javascript-example)
* [Java](#trigger---java-example)

For an HTTP trigger example, see [How to use HTTP trigger](#use-an-http-trigger-as-an-event-grid-trigger) later in this article.

### C# example

The following example shows a Functions 1.x [C# function](functions-dotnet-class-library.md) that binds to `JObject`:

```cs
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.EventGrid;
using Microsoft.Azure.WebJobs.Host;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Company.Function
{
    public static class EventGridTriggerCSharp
    {
        [FunctionName("EventGridTriggerCSharp")]
        public static void Run([EventGridTrigger]JObject eventGridEvent, TraceWriter log)
        {
            log.Info(eventGridEvent.ToString(Formatting.Indented));
        }
    }
}
```

The following example shows a Functions 2.x [C# function](functions-dotnet-class-library.md) that binds to `EventGridEvent`:

```cs
using Microsoft.Azure.EventGrid.Models;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.EventGrid;
using Microsoft.Azure.WebJobs.Host;

namespace Company.Function
{
    public static class EventGridTriggerCSharp
    {
        [FunctionName("EventGridTest")]
        public static void EventGridTest([EventGridTrigger]EventGridEvent eventGridEvent, TraceWriter log)
        {
            log.Info(eventGridEvent.Data.ToString());
        }
    }
}
```

For more information, see [Packages](#packages), [Attributes](#attributes), [Configuration](#configuration), and [Usage](#usage).

### C# script example

The following example shows a trigger binding in a *function.json* file and a [C# script function](functions-reference-csharp.md) that uses the binding.

Here's the binding data in the *function.json* file:

```json
{
  "bindings": [
    {
      "type": "eventGridTrigger",
      "name": "eventGridEvent",
      "direction": "in"
    }
  ],
  "disabled": false
}
```

Here's Functions 1.x C# script code that binds to `JObject`:

```cs
#r "Newtonsoft.Json"

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public static void Run(JObject eventGridEvent, TraceWriter log)
{
    log.Info(eventGridEvent.ToString(Formatting.Indented));
}
```

Here's Functions 2.x C# script code that binds to `EventGridEvent`:

```csharp
#r "Microsoft.Azure.EventGrid"
using Microsoft.Azure.EventGrid.Models;

public static void Run(EventGridEvent eventGridEvent, TraceWriter log)
{
    log.Info(eventGridEvent.Data.ToString());
}
```

For more information, see [Packages](#packages), [Attributes](#attributes), [Configuration](#configuration), and [Usage](#usage).

### JavaScript example

The following example shows a trigger binding in a *function.json* file and a [JavaScript function](functions-reference-node.md) that uses the binding.

Here's the binding data in the *function.json* file:

```json
{
  "bindings": [
    {
      "type": "eventGridTrigger",
      "name": "eventGridEvent",
      "direction": "in"
    }
  ],
  "disabled": false
}
```

Here's the JavaScript code:

```javascript
module.exports = function (context, eventGridEvent) {
    context.log("JavaScript Event Grid function processed a request.");
    context.log("Subject: " + eventGridEvent.subject);
    context.log("Time: " + eventGridEvent.eventTime);
    context.log("Data: " + JSON.stringify(eventGridEvent.data));
    context.done();
};
```

### Trigger - Java example

The following example shows a trigger binding in a *function.json* file and a [Java function](functions-reference-java.md) that uses the binding and prints out an event.

```json
{
  "bindings": [
    {
      "type": "eventGridTrigger",
      "name": "eventGridEvent",
      "direction": "in"
    }
  ]
}
```

Here's the Java code:

```java
@FunctionName("eventGridMonitor")
  public void logEvent(
     @EventGridTrigger(name = "event") String content,
      final ExecutionContext context
  ) { 
      context.getLogger().info(content);
    }
```

In the [Java functions runtime library](/java/api/overview/azure/functions/runtime), use the `EventGridTrigger` annotation on parameters whose value would come from EventGrid. Parameters with these annotations cause the function to run when an event arrives.  This annotation can be used with native Java types, POJOs, or nullable values using `Optional<T>`. 
     
## Attributes

In [C# class libraries](functions-dotnet-class-library.md), use the [EventGridTrigger](https://github.com/Azure/azure-functions-eventgrid-extension/blob/master/src/EventGridExtension/EventGridTriggerAttribute.cs) attribute.

Here's an `EventGridTrigger` attribute in a method signature:

```csharp
[FunctionName("EventGridTest")]
public static void EventGridTest([EventGridTrigger] JObject eventGridEvent, TraceWriter log)
{
    ...
}
 ```

For a complete example, see [C# example](#c-example).

## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file. There are no constructor parameters or properties to set in the `EventGridTrigger` attribute.

|function.json property |Description|
|---------|---------|----------------------|
| **type** | Required - must be set to `eventGridTrigger`. |
| **direction** | Required - must be set to `in`. |
| **name** | Required - the variable name used in function code for the parameter that receives the event data. |

## Usage

For C# and F# functions in Azure Functions 1.x, you can use the following parameter types for the Event Grid trigger:

* `JObject`
* `string`

For C# and F# functions in Azure Functions 2.x, you also have the option to use the following parameter type for the Event Grid trigger:

* `Microsoft.Azure.EventGrid.Models.EventGridEvent`- Defines properties for the fields common to all event types.

> [!NOTE]
> In Functions v1 if you try to bind to `Microsoft.Azure.WebJobs.Extensions.EventGrid.EventGridEvent`, the compiler will display a "deprecated" message and advise you to use `Microsoft.Azure.EventGrid.Models.EventGridEvent` instead. To use the newer type, reference the [Microsoft.Azure.EventGrid](https://www.nuget.org/packages/Microsoft.Azure.EventGrid) NuGet package and fully qualify the `EventGridEvent` type name by prefixing it with `Microsoft.Azure.EventGrid.Models`. For information about how to reference NuGet packages in a C# script function, see [Using NuGet packages](functions-reference-csharp.md#using-nuget-packages)

For JavaScript functions, the parameter named by the *function.json* `name` property has a reference to the event object.

## Event schema

Data for an Event Grid event is received as a JSON object in the body of an HTTP request. The JSON looks similar to the following example:

```json
[{
  "topic": "/subscriptions/{subscriptionid}/resourceGroups/eg0122/providers/Microsoft.Storage/storageAccounts/egblobstore",
  "subject": "/blobServices/default/containers/{containername}/blobs/blobname.jpg",
  "eventType": "Microsoft.Storage.BlobCreated",
  "eventTime": "2018-01-23T17:02:19.6069787Z",
  "id": "{guid}",
  "data": {
    "api": "PutBlockList",
    "clientRequestId": "{guid}",
    "requestId": "{guid}",
    "eTag": "0x8D562831044DDD0",
    "contentType": "application/octet-stream",
    "contentLength": 2248,
    "blobType": "BlockBlob",
    "url": "https://egblobstore.blob.core.windows.net/{containername}/blobname.jpg",
    "sequencer": "000000000000272D000000000003D60F",
    "storageDiagnostics": {
      "batchId": "{guid}"
    }
  },
  "dataVersion": "",
  "metadataVersion": "1"
}]
```

The example shown is an array of one element. Event Grid always sends an array and may send more than one event in the array. The runtime invokes your function once for each array element.

The top-level properties in the event JSON data are the same among all event types, while the contents of the `data` property are specific to each event type. The example shown is for a blob storage event.

For explanations of the common and event-specific properties, see [Event properties](../event-grid/event-schema.md#event-properties) in the Event Grid documentation.

The `EventGridEvent` type defines only the top-level properties; the `Data` property is a `JObject`. 

## Create a subscription

To start receiving Event Grid HTTP requests, create an Event Grid subscription that specifies the endpoint URL that invokes the function.

### Azure portal

For functions that you develop in the Azure portal with the Event Grid trigger, select **Add Event Grid subscription**.

![Create subscription in portal](media/functions-bindings-event-grid/portal-sub-create.png)

When you select this link, the portal opens the **Create Event Subscription** page with the endpoint URL prefilled.

![Endpoint URL prefilled](media/functions-bindings-event-grid/endpoint-url.png)

For more information about how to create subscriptions by using the Azure portal, see [Create custom event - Azure portal](../event-grid/custom-event-quickstart-portal.md) in the Event Grid documentation.

### Azure CLI

To create a subscription by using [the Azure CLI](https://docs.microsoft.com/cli/azure/get-started-with-azure-cli?view=azure-cli-latest), use the [az eventgrid event-subscription create](https://docs.microsoft.com/cli/azure/eventgrid/event-subscription?view=azure-cli-latest#az-eventgrid-event-subscription-create) command.

The command requires the endpoint URL that invokes the function. The following example shows the version-specific URL pattern:

#### Version 2.x runtime

    https://{functionappname}.azurewebsites.net/runtime/webhooks/eventgrid?functionName={functionname}&code={systemkey}

#### Version 1.x runtime

    https://{functionappname}.azurewebsites.net/admin/extensions/EventGridExtensionConfig?functionName={functionname}&code={systemkey}

The system key is an authorization key that has to be included in the endpoint URL for an Event Grid trigger. The following section explains how to get the system key.

Here's an example that subscribes to a blob storage account (with a placeholder for the system key):

#### Version 2.x runtime

```azurecli
az eventgrid resource event-subscription create -g myResourceGroup \
--provider-namespace Microsoft.Storage --resource-type storageAccounts \
--resource-name myblobstorage12345 --name myFuncSub  \
--included-event-types Microsoft.Storage.BlobCreated \
--subject-begins-with /blobServices/default/containers/images/blobs/ \
--endpoint https://mystoragetriggeredfunction.azurewebsites.net/runtime/webhooks/eventgrid?functionName=imageresizefunc&code=<key>
```

#### Version 1.x runtime

```azurecli
az eventgrid resource event-subscription create -g myResourceGroup \
--provider-namespace Microsoft.Storage --resource-type storageAccounts \
--resource-name myblobstorage12345 --name myFuncSub  \
--included-event-types Microsoft.Storage.BlobCreated \
--subject-begins-with /blobServices/default/containers/images/blobs/ \
--endpoint https://mystoragetriggeredfunction.azurewebsites.net/admin/extensions/EventGridExtensionConfig?functionName=imageresizefunc&code=<key>
```

For more information about how to create a subscription, see [the blob storage quickstart](../storage/blobs/storage-blob-event-quickstart.md#subscribe-to-your-storage-account) or the other Event Grid quickstarts.

### Get the system key

You can get the system key by using the following API (HTTP GET):

```
http://{functionappname}.azurewebsites.net/admin/host/systemkeys/eventgridextensionconfig_extension?code={masterkey}
```

This is an admin API, so it requires your function app [master key](functions-bindings-http-webhook.md#authorization-keys). Don't confuse the system key (for invoking an Event Grid trigger function) with the master key (for performing administrative tasks on the function app). When you subscribe to an Event Grid topic, be sure to use the system key.

Here's an example of the response that provides the system key:

```
{
  "name": "eventgridextensionconfig_extension",
  "value": "{the system key for the function}",
  "links": [
    {
      "rel": "self",
      "href": "{the URL for the function, without the system key}"
    }
  ]
}
```

You can get the master key for your function app from the **Function app settings** tab in the portal.

> [!IMPORTANT]
> The master key provides administrator access to your function app. Don't share this key with third parties or distribute it in native client applications.

For more information, see [Authorization keys](functions-bindings-http-webhook.md#authorization-keys) in the HTTP trigger reference article.

Alternatively, you can send an HTTP PUT to specify the key value yourself.

## Local testing with viewer web app

To test an Event Grid trigger locally, you have to get Event Grid HTTP requests delivered from their origin in the cloud to your local machine. One way to do that is by capturing requests online and manually resending them on your local machine:

2. [Create a viewer web app](#create-a-viewer-web-app) that captures event messages.
3. [Create an Event Grid subscription](#create-an-event-grid-subscription) that sends events to the viewer app.
4. [Generate a request](#generate-a-request) and copy the request body from the viewer app.
5. [Manually post the request](#manually-post-the-request) to the localhost URL of your Event Grid trigger function.

When you're done testing, you can use the same subscription for production by updating the endpoint. Use the [az eventgrid event-subscription update](https://docs.microsoft.com/cli/azure/eventgrid/event-subscription?view=azure-cli-latest#az-eventgrid-event-subscription-update) Azure CLI command.

### Create a viewer web app

To simplify capturing event messages, you can deploy a [pre-built web app](https://github.com/Azure-Samples/azure-event-grid-viewer) that displays the event messages. The deployed solution includes an App Service plan, an App Service web app, and source code from GitHub.

Select **Deploy to Azure** to deploy the solution to your subscription. In the Azure portal, provide values for the parameters.

<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fazure-event-grid-viewer%2Fmaster%2Fazuredeploy.json" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a>

The deployment may take a few minutes to complete. After the deployment has succeeded, view your web app to make sure it's running. In a web browser, navigate to: 
`https://<your-site-name>.azurewebsites.net`

You see the site but no events have been posted to it yet.

![View new site](media/functions-bindings-event-grid/view-site.png)

### Create an Event Grid subscription

Create an Event Grid subscription of the type you want to test, and give it the URL from your web app as the endpoint for event notification. The endpoint for your web app must include the suffix `/api/updates/`. So, the full URL is `https://<your-site-name>.azurewebsites.net/api/updates`

For information about how to create subscriptions by using the Azure portal, see [Create custom event - Azure portal](../event-grid/custom-event-quickstart-portal.md) in the Event Grid documentation.

### Generate a request

Trigger an event that will generate HTTP traffic to your web app endpoint.  For example, if you created a blob storage subscription, upload or delete a blob. When a request shows up in your web app, copy the request body.

The subscription validation request will be received first; ignore any validation requests, and copy the event request.

![Copy request body from web app](media/functions-bindings-event-grid/view-results.png)

### Manually post the request

Run your Event Grid function locally.

Use a tool such as [Postman](https://www.getpostman.com/) or [curl](https://curl.haxx.se/docs/httpscripting.html) to create an HTTP POST request:

* Set a `Content-Type: application/json` header.
* Set an `aeg-event-type: Notification` header.
* Paste the RequestBin data into the request body. 
* Post to the URL of your Event Grid trigger function, using the following pattern:

```
http://localhost:7071/admin/extensions/EventGridExtensionConfig?functionName={functionname}
``` 

The `functionName` parameter must be the name specified in the `FunctionName` attribute.

The following screenshots show the headers and request body in Postman:

![Headers in Postman](media/functions-bindings-event-grid/postman2.png)

![Request body in Postman](media/functions-bindings-event-grid/postman.png)

The Event Grid trigger function executes and shows logs similar to the following example:

![Sample Event Grid trigger function logs](media/functions-bindings-event-grid/eg-output.png)

## Local testing with ngrok

Another way to test an Event Grid trigger locally is to automate the HTTP connection between the Internet and your development computer. You can do that with an open-source tool named [ngrok](https://ngrok.com/):

3. [Create an ngrok endpoint](#create-an-ngrok-endpoint).
4. [Run the Event Grid trigger function](#run-the-event-grid-trigger-function).
5. [Create an Event Grid subscription](#create-a-subscription) that sends events to the ngrok endpoint.
6. [Trigger an event](#trigger-an-event).

When you're done testing, you can use the same subscription for production by updating the endpoint. Use the [az eventgrid event-subscription update](https://docs.microsoft.com/cli/azure/eventgrid/event-subscription?view=azure-cli-latest#az-eventgrid-event-subscription-update) Azure CLI command.

### Create an ngrok endpoint

Download *ngrok.exe* from [ngrok](https://ngrok.com/), and run with the following command:

```
ngrok http -host-header=localhost 7071
```

The -host-header parameter is needed because the functions runtime expects requests from localhost when it runs on localhost. 7071 is the default port number when the runtime runs locally.

The command creates output like the following:

```
Session Status                online
Version                       2.2.8
Region                        United States (us)
Web Interface                 http://127.0.0.1:4040
Forwarding                    http://263db807.ngrok.io -> localhost:7071
Forwarding                    https://263db807.ngrok.io -> localhost:7071

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

You'll use the `https://{subdomain}.ngrok.io` URL for your Event Grid subscription.

### Run the Event Grid trigger function

The ngrok URL doesn't get special handling by Event Grid, so your function must be running locally when the subscription is created. If it isn't, the validation response doesn't get sent and the subscription creation fails.

### Create a subscription

Create an Event Grid subscription of the type you want to test, and give it your ngrok endpoint.

Use this endpoint pattern for Functions 1.x:
```
https://{subdomain}.ngrok.io/admin/extensions/EventGridExtensionConfig?functionName={functionname}
``` 
Use this endpoint pattern for Functions 2.x:
```
https://{subdomain}.ngrok.io/runtime/webhooks/eventgrid?functionName={functionName}
``` 
The `functionName` parameter must be the name specified in the `FunctionName` attribute.

Here's an example using the Azure CLI:

```
az eventgrid event-subscription create --resource-id /subscriptions/aeb4b7cb-b7cb-b7cb-b7cb-b7cbb6607f30/resourceGroups/eg0122/providers/Microsoft.Storage/storageAccounts/egblobstor0122 --name egblobsub0126 --endpoint https://263db807.ngrok.io/admin/extensions/EventGridExtensionConfig?functionName=EventGridTrigger
```

For information about how to create a subscription, see [Create a subscription](#create-a-subscription) earlier in this article.

### Trigger an event

Trigger an event that will generate HTTP traffic to your ngrok endpoint.  For example, if you created a blob storage subscription, upload or delete a blob.

The Event Grid trigger function executes and shows logs similar to the following example:

![Sample Event Grid trigger function logs](media/functions-bindings-event-grid/eg-output.png)

## Use an HTTP trigger as an Event Grid trigger

Event Grid events are received as HTTP requests, so you can handle events by using an HTTP trigger instead of an Event Grid trigger. One possible reason for doing that is to get more control over the endpoint URL that invokes the function. Another reason is when you need to receive events in the [CloudEvents schema](../event-grid/cloudevents-schema.md). Currently, the Event Grid trigger doesn't support the CloudEvents schema. The examples in this section show solutions for both Event Grid schema and CloudEvents schema.

If you use an HTTP trigger, you have to write code for what the Event Grid trigger does automatically:

* Sends a validation response to a [subscription validation request](../event-grid/security-authentication.md#webhook-event-delivery).
* Invokes the function once per element of the event array contained in the request body.

For information about the URL to use for invoking the function locally or when it runs in Azure, see the [HTTP trigger binding reference documentation](functions-bindings-http-webhook.md)

### Event Grid schema

The following sample C# code for an HTTP trigger simulates Event Grid trigger behavior. Use this example for events delivered in the Event Grid schema.

```csharp
[FunctionName("HttpTrigger")]
public static async Task<HttpResponseMessage> Run(
    [HttpTrigger(AuthorizationLevel.Anonymous, "post")]HttpRequestMessage req,
    TraceWriter log)
{
    log.Info("C# HTTP trigger function processed a request.");

    var messages = await req.Content.ReadAsAsync<JArray>();

    // If the request is for subscription validation, send back the validation code.
    if (messages.Count > 0 && string.Equals((string)messages[0]["eventType"], 
        "Microsoft.EventGrid.SubscriptionValidationEvent", 
        System.StringComparison.OrdinalIgnoreCase))
    {
        log.Info("Validate request received");
        return req.CreateResponse<object>(new
        {
            validationResponse = messages[0]["data"]["validationCode"]
        });
    }

    // The request is not for subscription validation, so it's for one or more events.
    foreach (JObject message in messages)
    {
        // Handle one event.
        EventGridEvent eventGridEvent = message.ToObject<EventGridEvent>();
        log.Info($"Subject: {eventGridEvent.Subject}");
        log.Info($"Time: {eventGridEvent.EventTime}");
        log.Info($"Event data: {eventGridEvent.Data.ToString()}");
    }

    return req.CreateResponse(HttpStatusCode.OK);
}
```

The following sample JavaScript code for an HTTP trigger simulates Event Grid trigger behavior. Use this example for events delivered in the Event Grid schema.

```javascript
module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    var messages = req.body;
    // If the request is for subscription validation, send back the validation code.
    if (messages.length > 0 && messages[0].eventType == "Microsoft.EventGrid.SubscriptionValidationEvent") {
        context.log('Validate request received');
        var code = messages[0].data.validationCode;
        context.res = { status: 200, body: { "ValidationResponse": code } };
    }
    else {
        // The request is not for subscription validation, so it's for one or more events.
        // Event Grid schema delivers events in an array.
        for (var i = 0; i < messages.length; i++) {
            // Handle one event.
            var message = messages[i];
            context.log('Subject: ' + message.subject);
            context.log('Time: ' + message.eventTime);
            context.log('Data: ' + JSON.stringify(message.data));
        }
    }
    context.done();
};
```

Your event-handling code goes inside the loop through the `messages` array.

### CloudEvents schema

The following sample C# code for an HTTP trigger simulates Event Grid trigger behavior.  Use this example for events delivered in the CloudEvents schema.

```csharp
[FunctionName("HttpTrigger")]
public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]HttpRequestMessage req, TraceWriter log)
{
    log.Info("C# HTTP trigger function processed a request.");

    var requestmessage = await req.Content.ReadAsStringAsync();
    var message = JToken.Parse(requestmessage);

    if (message.Type == JTokenType.Array)
    {
        // If the request is for subscription validation, send back the validation code.
        if (string.Equals((string)message[0]["eventType"],
        "Microsoft.EventGrid.SubscriptionValidationEvent",
        System.StringComparison.OrdinalIgnoreCase))
        {
            log.Info("Validate request received");
            return req.CreateResponse<object>(new
            {
                validationResponse = message[0]["data"]["validationCode"]
            });
        }
    }
    else
    {
        // The request is not for subscription validation, so it's for an event.
        // CloudEvents schema delivers one event at a time.
        log.Info($"Source: {message["source"]}");
        log.Info($"Time: {message["eventTime"]}");
        log.Info($"Event data: {message["data"].ToString()}");
    }

    return req.CreateResponse(HttpStatusCode.OK);
}
```

The following sample JavaScript code for an HTTP trigger simulates Event Grid trigger behavior. Use this example for events delivered in the CloudEvents schema.

```javascript
module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    var message = req.body;
    // If the request is for subscription validation, send back the validation code.
    if (message.length > 0 && message[0].eventType == "Microsoft.EventGrid.SubscriptionValidationEvent") {
        context.log('Validate request received');
        var code = message[0].data.validationCode;
        context.res = { status: 200, body: { "ValidationResponse": code } };
    }
    else {
        // The request is not for subscription validation, so it's for an event.
        // CloudEvents schema delivers one event at a time.
        var event = JSON.parse(message);
        context.log('Source: ' + event.source);
        context.log('Time: ' + event.eventTime);
        context.log('Data: ' + JSON.stringify(event.data));
    }
    context.done();
};
```

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Azure functions triggers and bindings](functions-triggers-bindings.md)

> [!div class="nextstepaction"]
> [Learn more about Event Grid](../event-grid/overview.md)
