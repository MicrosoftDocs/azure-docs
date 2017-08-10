---
title: Create a .NET application for Service Fabric | Microsoft Docs
description: Learn how to create an application with an ASP.NET Core front-end and a reliable service stateful back-end and deploy the application to a cluster.
services: service-fabric
documentationcenter: .net
author: rwike77
manager: timlt
editor: ''

ms.assetid: 
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 08/09/2017
ms.author: ryanwi, mikhegn

---

# Create and Deploy an application with an ASP.NET Core Web API front-end service and a stateful back-end service
This tutorial is part one of a series and shows you how to create an Azure Service Fabric application with an ASP.NET Core Web API front end and a stateful back-end service to store your data. When you're finished, you have a voting application with an ASP.NET Core web front-end that saves voting results in a stateful back-end service in the cluster. You can download the source code for the completed [voting sample application](https://github.com/Azure-Samples/service-fabric-dotnet-quickstart/).

![Application Diagram](./media/service-fabric-tutorial-create-dotnet-app/application-diagram.png)

In part one of the series, you learn how to:

> [!div class="checklist"]
> * Create an ASP.NET Core Web API service as a reliable service
> * Create a stateful reliable service
> * Implement service remoting and using a service proxy

In this tutorial series you learn how to:
> [!div class="checklist"]
> * Build a .NET Service Fabric application
> * [Deploy the application to a remote cluster](service-fabric-tutorial-deploy-app-to-party-cluster.md)
> * [Configure CI/CD using Visual Studio Team Services](service-fabric-tutorial-deploy-app-with-cicd-vsts.md)

## Prerequisites
Before you begin this tutorial:
- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- [Install Visual Studio 2017](https://www.visualstudio.com/) and install the **Azure development** and **ASP.NET and web development** workloads.
- [Install the Service Fabric SDK](service-fabric-get-started.md)

## Create an ASP.NET Web API service as a reliable service
ASP.NET Core is a lightweight, cross-platform web development framework that you can use to create modern web UI and web APIs. 
To get a complete understanding of how ASP.NET Core integrates with Service Fabric, we strongly recommend reading through the [ASP.NET Core in Service Fabric Reliable Services](service-fabric-reliable-services-communication-aspnetcore.md) article. For now you can follow this tutorial to get started quickly. To learn more about ASP.NET Core, see the [ASP.NET Core Documentation](https://docs.microsoft.com/aspnet/core/).

> [!NOTE]
> This tutorial is based on the [ASP.NET Core tools for Visual Studio 2017](https://docs.microsoft.com/aspnet/core/tutorials/first-mvc-app/start-mvc). The .NET Core tools for Visual Studio 2015 are no longer being updated.

1. Launch Visual Studio as an **administrator**.

2. Create a project with **File**->**New**->**Project**

3. In the **New Project** dialog, choose **Cloud > Service Fabric Application**.

4. Name the application **Voting** and press **OK**.

   ![New project dialog in Visual Studio](./media/service-fabric-tutorial-create-dotnet-app/new-project-dialog.png)

5. On the **New Service Fabric Service** page, choose **Stateless ASP.NET Core**, and name your service **VotingWeb**.
   
   ![Choosing ASP.NET web service in the new service dialog](./media/service-fabric-tutorial-create-dotnet-app/new-project-dialog-2.png) 

6. The next page provides a set of ASP.NET Core project templates. For this tutorial, choose **Web Application**. 
   
   ![Choose ASP.NET project type](./media/service-fabric-tutorial-create-dotnet-app/vs-new-aspnet-project-dialog.png)

   Visual Studio creates an application and a service project and displays them in Solution Explorer.

   ![Solution Explorer following creation of application with ASP.NET core Web API service]( ./media/service-fabric-tutorial-create-dotnet-app/solution-explorer-aspnetcore-service.png)

### Add AngularJS to the VotingWeb service
Add AngularJS to your service using the built-in [Bower support](/aspnet/core/client-side/bower). Open *bower.json* and add entries for angular and angular-bootstrap, then save your changes.

```json
{
  "name": "asp.net",
  "private": true,
  "dependencies": {
    "bootstrap": "3.3.7",
    "jquery": "2.2.0",
    "jquery-validation": "1.14.0",
    "jquery-validation-unobtrusive": "3.2.6",
    "angular": "v1.6.5",
    "angular-bootstrap": "v1.1.0"
  }
}
```
Upon saving the *bower.json* file, Angular will be installed in your project's *wwwroot/lib* folder. Additionally, it will be listed within the *Dependencies/Bower* folder.

### Update the site.js file
Open the *wwwroot/js/site.js* file and replace it's contents with the following:

```javascript
var app = angular.module('VotingApp', ['ui.bootstrap']);
app.run(function () { });

app.controller('VotingAppController', ['$rootScope', '$scope', '$http', '$timeout', function ($rootScope, $scope, $http, $timeout) {

    $scope.refresh = function () {
        $http.get('api/Votes?c=' + new Date().getTime())
            .then(function (data, status) {
                $scope.votes = data;
            }, function (data, status) {
                $scope.votes = undefined;
            });
    };

    $scope.remove = function (item) {
        $http.delete('api/Votes/' + item)
            .then(function (data, status) {
                $scope.refresh();
            })
    };

    $scope.add = function (item) {
        var fd = new FormData();
        fd.append('item', item);
        $http.put('api/Votes/' + item, fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        })
            .then(function (data, status) {
                $scope.refresh();
                $scope.item = undefined;
            })
    };
}]);
```

### Update the Index.cshtml file
Open the *Views/Home/Index.cshtml* file.  Replace it's contents with the following, then save your changes.

```html
@{
    ViewData["Title"] = "Service Fabric Voting Sample";
}

<div ng-controller="VotingAppController" ng-init="refresh()">
    <div class="container-fluid">
        <div class="row">
            <div class="col-xs-8 col-xs-offset-2 text-center">
                <h2>Service Fabric Voting Sample</h2>
            </div>
        </div>

        <div class="row">
            <div class="col-xs-8 col-xs-offset-2">
                <form class="col-xs-12 center-block">
                    <div class="col-xs-6 form-group">
                        <input id="txtAdd" type="text" class="form-control" placeholder="Add voting option" ng-model="item" />
                    </div>
                    <button id="btnAdd" class="btn btn-default" ng-click="add(item)">
                        <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
                        Add
                    </button>
                </form>
            </div>
        </div>

        <hr />

        <div class="row">
            <div class="col-xs-8 col-xs-offset-2">
                <div class="row">
                    <div class="col-xs-4">
                        Click to vote
                    </div>
                </div>
                <div class="row top-buffer" ng-repeat="vote in votes.data">
                    <div class="col-xs-8">
                        <button class="btn btn-success text-left btn-block" ng-click="add(vote.key)">
                            <span class="pull-left">
                                {{vote.key}}
                            </span>
                            <span class="badge pull-right">
                                {{vote.value}} Votes
                            </span>
                        </button>
                    </div>
                    <div class="col-xs-4">
                        <button class="btn btn-danger pull-right btn-block" ng-click="remove(vote.key)">
                            <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
```

### Update the _Layout.cshtml file
Open the *Views/Shared/_Layout.cshtml* file.  Replace it's contents with the following, then save your changes.

```html
<!DOCTYPE html>
<html ng-app="VotingApp" xmlns:ng="http://angularjs.org">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>@ViewData["Title"]</title>

    <link href="~/lib/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link href="~/css/site.css" rel="stylesheet" />

</head>
<body>
    <div class="container body-content">
        @RenderBody()
    </div>

    <script src="~/lib/jquery/dist/jquery.js"></script>
    <script src="~/lib/bootstrap/dist/js/bootstrap.js"></script>
    <script src="~/lib/angular/angular.js"></script>
    <script src="~/lib/angular-bootstrap/ui-bootstrap-tpls.js"></script>
    <script src="~/js/site.js"></script>

    @RenderSection("Scripts", required: false)
</body>
</html>
```

### Update the VotingWeb.cs file
Open the *VotingWeb.cs* file.  Add the `using System.Net.Http;` directive to the top of the file.  Replace the `CreateServiceInstanceListeners()` function with the following, then save your changes.

```csharp
protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
{
    return new ServiceInstanceListener[]
    {
        new ServiceInstanceListener(serviceContext =>
            new WebListenerCommunicationListener(serviceContext, "ServiceEndpoint", (url, listener) =>
            {
                ServiceEventSource.Current.ServiceMessage(serviceContext, $"Starting WebListener on {url}");

                return new WebHostBuilder().UseWebListener()
                            .ConfigureServices(
                                services => services
                                    .AddSingleton<StatelessServiceContext>(serviceContext)
                                    .AddSingleton<HttpClient>())
                            .UseContentRoot(Directory.GetCurrentDirectory())
                            .UseStartup<Startup>()
                            .UseApplicationInsights()
                            .UseServiceFabricIntegration(listener, ServiceFabricIntegrationOptions.None)
                            .UseUrls(url)
                            .Build();
            }))
    };
}
```

### Add the VotesController.cs file
Right-click on the **Controllers** folder, then select **Add->New item->Class**.  Name the file "VotesController.cs" and click **Add**.  Replace the file contents with the following, then save your changes.

```csharp
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.Text;
using System.Net.Http;
using System.Net.Http.Headers;

namespace VotingWeb.Controllers
{
    [Produces("application/json")]
    [Route("api/Votes")]
    public class VotesController : Controller
    {
        private readonly HttpClient httpClient;

        public VotesController(HttpClient httpClient)
        {
            this.httpClient = httpClient;
        }

        // GET: api/Votes
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            List<KeyValuePair<string, int>> votes= new List<KeyValuePair<string, int>>();
            votes.Add(new KeyValuePair<string, int>("Pizza", 3));
            votes.Add(new KeyValuePair<string, int>("Ice cream", 4));

            return Json(votes);
        }
     }
}
```

### Update the port


### Deploy and run the application locally
You can now go ahead and run the application. In Visual Studio, press `F5` to deploy the application for debugging. `F5` fails if you didn't previously open Visual Studio as **administrator**.

> [!NOTE]
> The first time you run and deploy the application locally, Visual Studio creates a local cluster for debugging, which may take some time. The cluster creation status is displayed in the Visual Studio output window.

At this point, your web app should look like this:

![ASP.NET Core front-end](./media/service-fabric-tutorial-create-dotnet-app/debug-front-end.png)

To stop debugging the application, go back to Visual Studio and press **Shift+F5**.

## Add a stateful back-end service to your application
Now that we have an ASP.NET Web API service running in our application, let's go ahead and add a stateful reliable service to store some data in our application.

Service Fabric allows you to consistently and reliably store your data right inside your service by using reliable collections. Reliable collections are a simple set of highly available and reliable collection classes that is familiar to anyone who has used C# collections.

In this tutorial you create a service, which stores a counter value in a reliable collection.

1. In Solution Explorer, right-click **Services** within the application project and choose **Add > New Service Fabric Service**.
   
    ![Adding a new service to an existing application](./media/service-fabric-tutorial-create-dotnet-app/vs-add-new-service.png)

2. In the **New Service Fabric Service** dialog, choose **Stateful ASP.NET Core**, and name the service **VotingData** and press **OK**.

    ![New service dialog in Visual Studio](./media/service-fabric-tutorial-create-dotnet-app/add-stateful-service.png)

    Once your service project is created, you have two services in your application. As you continue to build your application, you can add more services in the same way. Each can be independently versioned and upgraded.

3. The next page provides a set of ASP.NET Core project templates. For this tutorial, choose **Web API**.

    ![Choose ASP.NET project type](./media/service-fabric-tutorial-create-dotnet-app/vs-new-aspnet-project-dialog2.png)

    Visual Studio creates a service project and displays them in Solution Explorer.

    ![Solution Explorer](./media/service-fabric-tutorial-create-dotnet-app/solution-explorer-aspnetcore-service.png)

### Add the VoteDataController.cs file

In the **VotingData** project right-click on the **Controllers** folder, then select **Add->New item->Class**. Name the file "VoteDataController.cs" and click **Add**. Replace the file contents with the following, then save your changes.

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.ServiceFabric.Data;
using System.Threading;
using Microsoft.ServiceFabric.Data.Collections;

namespace VotingData.Controllers
{
    [Route("api/[controller]")]
    public class VoteDataController : Controller
    {
        private readonly IReliableStateManager stateManager;

        public VoteDataController(IReliableStateManager stateManager)
        {
            this.stateManager = stateManager;
        }

        // GET api/VoteData
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var ct = new CancellationToken();

            var votesDictionary = await this.stateManager.GetOrAddAsync<IReliableDictionary<string, int>>("counts");

            using (ITransaction tx = this.stateManager.CreateTransaction())
            {
                var list = await votesDictionary.CreateEnumerableAsync(tx);

                var enumerator = list.GetAsyncEnumerator();

                var result = new List<KeyValuePair<string, int>>();

                while (await enumerator.MoveNextAsync(ct))
                {
                    result.Add(enumerator.Current);
                }

                return Json(result);
            }
        }

        // PUT api/VoteData/name
        [HttpPut("{name}")]
        public async Task<IActionResult> Put(string name)
        {
            var votesDictionary = await this.stateManager.GetOrAddAsync<IReliableDictionary<string, int>>("counts");

            using (ITransaction tx = this.stateManager.CreateTransaction())
            {
                await votesDictionary.AddOrUpdateAsync(tx, name, 1, (key, oldvalue) => oldvalue + 1);
                await tx.CommitAsync();
            }

            return new OkResult();
        }

        // DELETE api/VoteData/name
        [HttpDelete("{name}")]
        public async Task<IActionResult> Delete(string name)
        {
            var votesDictionary = await this.stateManager.GetOrAddAsync<IReliableDictionary<string, int>>("counts");

            using (ITransaction tx = this.stateManager.CreateTransaction())
            {
                if (await votesDictionary.ContainsKeyAsync(tx, name))
                {
                    await votesDictionary.TryRemoveAsync(tx, name);
                    await tx.CommitAsync();
                    return new OkResult();
                }
                else
                {
                    return new NotFoundResult();
                }
            }
        }
    }
}
```


## Connect the services
In this next step we will connect the two services and make the front-end Web application get and set voting information from the back-end service's reliable dictionary.

Service Fabric provides complete flexibility in how you communicate with reliable services. Within a single application, you might have services that are accessible via TCP. Other services that might be accessible via an HTTP REST API and still other services could be accessible via web sockets. For background on the options available and the tradeoffs involved, see [Communicating with services](service-fabric-connect-and-communicate-with-services.md).

In this tutorial, we are using [ASP.NET Core Web API](service-fabric-reliable-services-communication-aspnetcore.md).


### Update the VotesController.cs file
In the **VotingWeb** project, open the *Controllers/VotesController.cs* file.  Replace the `VotesController` class definition contents with the following, then save your changes.

```csharp
    public class VotesController : Controller
    {
        private readonly HttpClient httpClient;
        string serviceProxyUrl = "http://localhost:19081/Voting/VotingData/api/VoteData";
        string partitionKind = "Int64Range";
        string partitionKey = "0";

        public VotesController(HttpClient httpClient)
        {
            this.httpClient = httpClient;
        }

        // GET: api/Votes
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            IEnumerable<KeyValuePair<string, int>> votes;

            HttpResponseMessage response = await this.httpClient.GetAsync($"{serviceProxyUrl}?PartitionKind={partitionKind}&PartitionKey={partitionKey}");

            if (response.StatusCode != System.Net.HttpStatusCode.OK)
            {
                return this.StatusCode((int)response.StatusCode);
            }

            votes = JsonConvert.DeserializeObject<List<KeyValuePair<string, int>>>(await response.Content.ReadAsStringAsync());

            return Json(votes);
        }

        // PUT: api/Votes/name
        [HttpPut("{name}")]
        public async Task<IActionResult> Put(string name)
        {
            string payload = $"{{ 'name' : '{name}' }}";
            StringContent putContent = new StringContent(payload, Encoding.UTF8, "application/json");
            putContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            string proxyUrl = $"{serviceProxyUrl}/{name}?PartitionKind={partitionKind}&PartitionKey={partitionKey}";

            HttpResponseMessage response = await this.httpClient.PutAsync(proxyUrl, putContent);

            return new ContentResult()
            {
                StatusCode = (int)response.StatusCode,
                Content = await response.Content.ReadAsStringAsync()
            };
        }

        // DELETE: api/Votes/name
        [HttpDelete("{name}")]
        public async Task<IActionResult> Delete(string name)
        {
            HttpResponseMessage response = await this.httpClient.DeleteAsync($"{serviceProxyUrl}/{name}?PartitionKind={partitionKind}&PartitionKey={partitionKey}");

            if (response.StatusCode != System.Net.HttpStatusCode.OK)
            {
                return this.StatusCode((int)response.StatusCode);
            }

            return new OkResult();

        }
    }
```

## Deploy and debug the application locally
With the new service added to the application, let us debug the full application and look at the default behavior of the new service.

To debug the application, press F5 in Visual Studio.

> [!NOTE]
> If you choose to use **Refresh Application** as the Application Debug Mode, you are prompted to grant the local Service Fabric cluster access to the build output folder of your application.
> 

Both services in your application are build, deployed and stated in your local Service Fabric cluster. Once the services start, Visual Studio still launches your browser, but also automatically brings up the **Diagnostics Event viewer**, where you can see trace-output from your services.
   
![Diagnostic events viewer](./media/service-fabric-tutorial-create-dotnet-app/diagnostic-events-viewer.png)

The Diagnostics Events viewer shows you trace messages from all services that are part of the Visual Studio solution being debugged. By pausing the Diagnostics Event viewer, you are able to expand one of the service massages, to inspect its properties. By doing so, you can see which service in the cluster emitted the message, which node that service instance is currently running on and other information.

![Diagnostic events viewer](./media/service-fabric-tutorial-create-dotnet-app/expanded-diagnostics-viewer.png)

You see that the service messages are coming from the stateful service we created, as the **serviceTypeName** is **MyStatefulServiceType**. You can also see that it is sending messages with the text "Current counter is...". This message is being emitted by this highlighted line of code in the `RunAsync` method of the **MyStatefulService.cs**, that you see in the following screenshot.

![Service Message Code](./media/service-fabric-tutorial-create-dotnet-app/service-message-code.png)

For more information about emitting diagnostics information from your services and applications, see [Monitoring and diagnostics for Azure Service Fabric](service-fabric-diagnostics-overview.md).

To stop debugging the application, go back to Visual Studio and press **Shift+F5**.

## Understanding the Service Fabric application and service
Your Visual Studio solution now contains two projects.
1. The Service Fabric application project - **MyApplication**
    - This project does not contain any code directly. Instead, it references a set of service projects. In addition, it contains other types of content to specify how your application is composed and deployed.
2. The service project - **MyWebAPIFrontEnd**
    - This project is your ASP.NET Core Web API project, containing the code and configuration for your service. Looking at the ValuesController.cs code file in the Controllers folder, you notice it is a regular ASP.NET Core Web API controller. There are no specific requirements to the code you write as part of your controllers, when running an ASP.NET Core Web API as a reliable service in Service Fabric.

For more information about the application model in Service Fabric, see [Model an application in Service Fabric](service-fabric-application-model.md).

For more information about the contents of the service project, see [Getting started with reliable services](service-fabric-reliable-services-quick-start.md).


To understand how it's using a reliable dictionary to store the data in the cluster, let's spend a little time looking at the code in the **MyStatefulService** service.

The are five lines of code in the service that are related to creating, updating, and reading from the reliable dictionary.

![Reliable Dictionary Code](./media/service-fabric-tutorial-create-dotnet-app/reliable-dictionary-code.png)

1. Whenever the `RunAsync` method of the service is being run (which happens when the service starts), this line of code gets or adds a reliable dictionary with the name `myDictionary` to the service.
2. All interaction with values in a reliable dictionary requires a transaction, this using statement being entered in this line of code creates that transaction.
3. This line of code gets the value associated with the key specified in the method call for example, `Counter`.
4. This line of code updates the value associated with the key `Counter`, by incrementing the value.
5. This method call commits the transaction, and returns once the updated value is stored across a quorum of nodes in your cluster.

For more detailed information about reliable dictionaries and reliable collections, see [Introduction to Reliable Collections in Azure Service Fabric stateful services](service-fabric-reliable-services-reliable-collections.md).


## Next steps
In this part of the tutorial, you learned how to:

> [!div class="checklist"]
> * Create an ASP.NET Core Web API service as a reliable service
> * Create a stateful reliable service
> * Implement service remoting and using a service proxy

Advance to the next tutorial:
> [!div class="nextstepaction"]
> [Deploy the application to Azure](service-fabric-tutorial-deploy-app-to-party-cluster.md)