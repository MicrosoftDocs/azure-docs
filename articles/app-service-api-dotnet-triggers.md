<properties 
	pageTitle="Azure App Service API App Triggers" 
	description="This article demonstrates how to implement triggers in an API App" 
	services="app-service\api" 
	documentationCenter=".net" 
	authors="guangyang"
	manager="wpickett" 
	editor="jimbe"/>

<tags 
	ms.service="app-service-api" 
	ms.workload="web" 
	ms.tgt_pltfrm="dotnet" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/31/2015" 
	ms.author="guayan;tarcher"/>

# Azure App Service API App Triggers

## Overview

This article explains the concept of triggers in API app, demonstrates how to implement triggers and consume them from Logic apps.

Some articles to go through before this to help you get started.

1. In [Create an API App](app-service-dotnet-create-api-app.md), you created an API App project.
2. In [Deploy an API App](app-service-dotnet-deploy-api-app.md), you deploy the API app to your Azure subscription.
3. In [Debug an API App](app-service-dotnet-remotely-debug-api-app.md), you use Visual Studio to remotely debug the code while it runs in Azure.

You can also find the sample FileWatcher API App source code at [here](https://code.msdn.microsoft.com/windowsazure/FileWatcher-Azure-API-App-313c5cb3).

## What are API app triggers

It's a common scenario for an API app to fire some event and notify the clients of the API app to take some actions. API app trigger is the mechanism for implementing such event scenario. For example, when using the TwitterConnector API app, when there are some new tweets with a certain keyword:

- If it's used from logic app, you may want it to notify the logic app to run.
- If it's used from your own code, you many want it to notify your code to take some action.

Triggers are implemented as regular REST APIs with some simple conventions.

## Poll trigger V.S. Push trigger

There are two kinds of triggers: poll trigger and push trigger.

### Poll trigger

A poll trigger is a regular REST API. It expects the clients (like Logic app) to poll it to get notification. A poll trigger itself should be stateless. Any state should be flowed in from the clients.

Following is the poll trigger contract:

- Request
    - HTTP method: GET
    - Parameters
        - triggerState: optional. Clients can use this parameter to follow in state. Then the poll trigger can decide whether to return notification or not based on the state.
        - Any other parameters needed for the REST API.
- Response
    - Status code **200**: the request is valid and there is a notification from the trigger. The content of the notification will be the response body. If there is a "Retry-After" header in the response, it means there is more data of the notification that the clients should send a request again.
    - Status code **202**: the request is valid and there is no notification from the trigger. Clients should keep polling.
    - Status code **4xx**: the request is invalid. Clients shouldn't retry.
    - Status code **5xx**: the request hits some internal server error or temporary issue. Clients should retry.

Following is an example of how to implement a poll trigger

    // Implement a poll trigger
    [HttpGet]
    [Route("api/files/poll/TouchedFiles")]
    public HttpResponseMessage TouchedFilesPollTrigger(
        // triggerState is a UTC timestamp
        string triggerState,
        // Additional parameters
        string searchPattern = "*")
    {
        // Check to see whether there is any file touched after the timestamp.
        var lastTriggerTimeUtc = DateTime.Parse(triggerState).ToUniversalTime();
        var touchedFiles = Directory.EnumerateFiles(rootPath, searchPattern, SearchOption.AllDirectories)
            .Select(f => FileInfoWrapper.FromFileInfo(new FileInfo(f)))
            .Where(fi => fi.LastAccessTimeUtc > lastTriggerTimeUtc);

        // If there are files touched after the timestamp, return their information.
        if (touchedFiles != null && touchedFiles.Count() != 0)
        {
            // Extension method provided by the AppService service SDK.
            return this.Request.EventTriggered(new { files = touchedFiles });
        }
        // If there is no file touched after the timestamp, tell the caller to poll again after 1 mintue.
        else
        {
            // Extension method provided by the AppService service SDK.
            return this.Request.EventWaitPoll(new TimeSpan(0, 1, 0));
        }
    }

To try this poll trigger

1. Deploy the API App as public anonymous.
2. Call the **touch** operation to touch a file. Below is a sample request via Postman.
   ![Call Touch Operation via Postman](./media/app-service-api-dotnet-triggers/calltouchfilefrompostman.PNG)
3. Call the poll trigger with triggerState set to a time stamp prior to step 2 to see the result. Below is a sample request via Postman.
   ![Call Poll Trigger via Postman](./media/app-service-api-dotnet-triggers/callpolltriggerfrompostman.PNG)

### Push trigger

A push trigger is a regular REST API. Instead of expecting the clients to poll, it will send push notifications to all the clients registered with it.

Following is the push trigger contract:

- Request
    - HTTP method: PUT
    - Parameters
        - triggerId: required. An opaque string (such as a GUID) to represent the registration of a push trigger.
        - callbackUrl: required. A full URL of the callback to invoke when the push trigger notifies. The invocation is a simple POST HTTP call.
        - Any other parameters needed for the REST API.
- Response
    - Status code **200**: the request to register a client is processed successfully.
    - Status code **4xx**: the request is invalid. Clients shouldn't retry.
    - Status code **5xx**: the request hits some internal server error or temporary issue. Clients should retry.
- Callback
    - HTTP method: POST
    - Request body: the content of the notification.

Following is an example of how to implement a push trigger

    // Implement a push trigger
    [HttpPut]
    [Route("api/files/push/TouchedFiles/{triggerId}")]
    public HttpResponseMessage TouchedFilesPushTrigger(
        // triggerId is an opaque string
        string triggerId,
        // A helper class provided by the AppService service SDK.
        // Here it defines the input of the push trigger is a string and the output to the callback is a FileInfoWrapper object.
        [FromBody]TriggerInput<string, FileInfoWrapper> triggerInput)
    {
        // Register the trigger to some trigger store.
        triggerStore.RegisterTrigger(triggerId, rootPath, triggerInput);

        // Extension method provided by the AppService service SDK indicating the registration is completed.
        return this.Request.PushTriggerRegistered(triggerInput.GetCallback());
    }

    // A simple in-memory trigger store.
    public class InMemoryTriggerStore
    {
        private static InMemoryTriggerStore instance;

        private IDictionary<string, FileSystemWatcher> _store;

        private InMemoryTriggerStore()
        {
            _store = new Dictionary<string, FileSystemWatcher>();
        }

        public static InMemoryTriggerStore Instance
        {
            get
            {
                if (instance == null)
                {
                    instance = new InMemoryTriggerStore();
                }
                return instance;
            }
        }

        // Register a push trigger.
        public void RegisterTrigger(string triggerId, string rootPath,
            TriggerInput<string, FileInfoWrapper> triggerInput)
        {
            // Use FileSystemWatcher to listen to file change event.
            var filter = string.IsNullOrEmpty(triggerInput.inputs) ? "*" : triggerInput.inputs;
            var watcher = new FileSystemWatcher(rootPath, filter);
            watcher.IncludeSubdirectories = true;
            watcher.EnableRaisingEvents = true;
            watcher.NotifyFilter = NotifyFilters.LastAccess;

            // When some file is changed, fire the push trigger.
            watcher.Changed +=
                (sender, e) => watcher_Changed(sender, e,
                    Runtime.FromAppSettings(),
                    triggerInput.GetCallback());

            // Assoicate the FileSystemWatcher object with the triggerId.
            _store[triggerId] = watcher;

        }

        // Fire the assoicated push trigger when some file is changed.
        void watcher_Changed(object sender, FileSystemEventArgs e,
            // AppService runtime object needed to invoke the callback.
            Runtime runtime,
            // The callback to invoke.
            ClientTriggerCallback<FileInfoWrapper> callback)
        {
            // Helper method provided by AppService service SDK to invoke a push trigger callback.
            callback.InvokeAsync(runtime, FileInfoWrapper.FromFileInfo(new FileInfo(e.FullPath)));
        }
    }

To try this push trigger

1. Deploy the API App as public anonymous.
2. Go to http://requestb.in/ to create a RequestBin which will serve as your callback URL.
3. Call the push trigger with a GUID as **triggerId** and the RequestBin URL as **callbackUrl**.
   ![Call Push Trigger via Postman](./media/app-service-api-dotnet-triggers/callpushtriggerfrompostman.PNG)
4. Call the **touch** operation to touch a file. Below is a sample request via Postman.
   ![Call Touch Operation via Postman](./media/app-service-api-dotnet-triggers/calltouchfilefrompostman.PNG)
5. Check your RequestBin to see that the push trigger callback is invoked with property output.
   ![Call Poll Trigger via Postman](./media/app-service-api-dotnet-triggers/pushtriggercallbackinrequestbin.PNG)

### Describe triggers in API Definition

After implementing the triggers and deploy your API App to Azure, navigate to the **API Definition** blade in Azure portal and you'll see that triggers are automatically recognized in the UI, which is driven by the Swagger 2.0 API definition of the API App.

![API Definition Blade](./media/app-service-api-dotnet-triggers/apidefinitionblade.PNG)

If you click the **Download Swagger** button and open the JSON file, you'll see something like this.

    "/api/files/poll/TouchedFiles": {
      "get": {
        "operationId": "Files_TouchedFilesPollTrigger",
        ...
        "x-ms-scheduler-trigger": "poll"
      }
    },
    "/api/files/push/TouchedFiles/{triggerId}": {
      "put": {
        "operationId": "Files_TouchedFilesPushTrigger",
        ...
        "x-ms-scheduler-trigger": "push"
      }
    }

The extension property **x-ms-schedular-trigger** is how triggers are described in API definition. In the case of this example, this extension property is added by the API App gateway automatically based on some convention when you request the API definition via the gateway. You can always add this by yourself.

Following is the convention used by API App gateway:

- Poll trigger
    - If the HTTP method is **GET**.
    - If the **operationId** property has string **trigger** in it.
    - If the **parameters** property includes a parameter with **name** property set to **triggerState**.
- Push trigger
    - If the HTTP method is **PUT**.
    - If the **operationId** property has string **trigger** in it.
    - If the **parameters** property includes a parameter with **name** property set to **triggerId**.

## Use API app triggers in Logic apps

### List and Configure API app triggers in Logic apps designer

Now if you create an Logic App in the same resource group, you will be able to see this API App show up on the right side list. Click it to add it to the designer canvas. Then you should see something like this.

![Triggers in Logic App Designer](./media/app-service-api-dotnet-triggers/triggersinlogicappdesigner.PNG)

![Configure Poll Trigger in Logic App Designer](./media/app-service-api-dotnet-triggers/configurepolltriggerinlogicappdesigner.PNG)

![Configure Push Trigger in Logic App Designer](./media/app-service-api-dotnet-triggers/configurepushtriggerinlogicappdesigner.PNG)

### Optimize API app triggers for Logic apps

