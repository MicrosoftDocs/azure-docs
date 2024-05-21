---
title: "Tutorial: Monitor and diagnose ASP.NET Core services"
description: In this tutorial, learn how to to configure monitoring and diagnostics for an Azure Service Fabric ASP.NET Core application.
ms.topic: tutorial
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 05/17/2024
---

# Tutorial: Monitor and diagnose a Service Fabric application by using Application Insights

This tutorial is *part five* in a series. It walks through the steps to configure monitoring and diagnostics for an ASP.NET Core application running on an Azure Service Fabric cluster by using Application Insights. You collect telemetry from the application that's developed in [part one of the tutorial series](service-fabric-tutorial-create-dotnet-app.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Set up an Application Insights resource
> * Add Application Insights to the application's services
> * View telemetry and Application Map in Application Insights
> * Add custom instrumentation to your application

The tutorial series shows you how to:

* [Build a .NET Service Fabric application](service-fabric-tutorial-create-dotnet-app.md)
* [Deploy the application to a remote cluster](service-fabric-tutorial-deploy-app.md)
* [Add an HTTPS endpoint to an ASP.NET Core front-end service](service-fabric-tutorial-dotnet-app-enable-https-endpoint.md)
* [Configure CI/CD by using Azure Pipelines](service-fabric-tutorial-deploy-app-with-cicd-vsts.md)
* Set up monitoring and diagnostics for the application (*this tutorial*)

## Prerequisites

Before you begin this tutorial:

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* [Install Visual Studio 2019](https://www.visualstudio.com/), including the Azure development workload and the ASP.NET and web development workload.
* [Install the Service Fabric SDK](service-fabric-get-started.md).

## Download the Voting sample application

If you didn't build the Voting sample application in [part one of this tutorial series](service-fabric-tutorial-create-dotnet-app.md), you can download it. In a command window or terminal, run the following command to clone the sample app repository to your local computer:

```git
git clone https://github.com/Azure-Samples/service-fabric-dotnet-quickstart
```

## Set up an Application Insights resource

Application Insights is the Azure application performance management platform. We recommend that you use Application Insights for application monitoring and diagnostics in Service Fabric.

To create an Application Insights resource, go to the [Azure portal](https://portal.azure.com). Select **Create a resource**. On the portal menu, select **Monitoring + Diagnostics**. In the **Popular Azure services** column, under **Application Insights**, select **Create**.

:::image type="content" source="media/service-fabric-tutorial-monitoring-aspnet/new-ai-resource.png" alt-text="Screenshot that shows you how to create a new Application Insights resource.":::

Enter or select values for **Subscription**, **Resource group**, and **Name**. For **Region**, choose where to deploy your Service Fabric cluster in the future. In this tutorial, we deploy the app to a local cluster, so the Azure region is irrelevant. For **Application type**, leave as **ASP.NET web application**.

:::image type="content" source="media/service-fabric-tutorial-monitoring-aspnet/new-ai-resource-attrib.png" alt-text="Screenshot that shows Application Insights resource attributes.":::

When you've entered or selected the required information, select **Create** to provision the resource. The resource is deployed in about one minute.

<!-- When it's finished, go to the newly deployed resource and find the value for **Instrumentation Key** (in the **Essentials** dropdown). Copy it to the clipboard because you use it in the next step. -->

## Add Application Insights to the application's services

Open Visual Studio 2019 by using the **Run as administrator** option (right-click the Visual Studio icon in the **Start** menu). Select **File** > **Open** > **Project/Solution** and go to the Voting application (either created in part one of the tutorial or cloned from GitHub). Open *Voting.sln*. If you're prompted to restore the application's NuGet packages, select **Yes**.

To configure Application Insights for the VotingWeb and VotingData services:

1. Right-click the name of the service, and select **Add** > **Connected Services** > **Monitoring with Application Insights**.

   :::image type="content" source="media/service-fabric-tutorial-monitoring-aspnet/configure-ai.png" alt-text="Screenshot that shows configuring Application Insights services.":::

   > [!NOTE]
   > Depending on the project type, when you right-click the name of the service, you might need to select **Add** and then select **Application Insights Telemetry**.

1. Select **Get started**.
1. Sign in to the account that you use for your Azure subscription and select the subscription where you created the Application Insights resource. To find the resource, in **Resource**, go to **Existing Application Insights resource**. Select **Register** to add Application Insights to your service.

   :::image type="content" source="media/service-fabric-tutorial-monitoring-aspnet/register-ai.png" alt-text="Screenshot that shows how to register Application Insights.":::

1. Select **Finish**.

> [!NOTE]
> Make sure to do these steps for *both* of the services in the application to finish configuring Application Insights for the application.
> The same Application Insights resource is used for both of the services in order to see incoming and outgoing requests and communication between the services.

## Add the Microsoft.ApplicationInsights.ServiceFabric.Native NuGet to the services

Application Insights has two Service Fabric-specific NuGet packages that you can use depending on the scenario. One is used with Service Fabric native services, and the other with containers and guest executables. In this case, we use the Microsoft.ApplicationInsights.ServiceFabric.Native NuGet package to learn about service context. For more information about the Application Insights SDK and the Service Fabric-specific NuGet packages, see [Microsoft Application Insights for Service Fabric](https://github.com/Microsoft/ApplicationInsights-ServiceFabric/blob/master/README.md).

To set up the NuGet package:

1. In Solution Explorer, right-click **Solution 'Voting'** and select **Manage NuGet Packages for Solution**.
1. In the **NuGet - Solution** dialog, select **Browse**. Select the **Include prerelease** checkbox.

   > [!NOTE]
   > You might need to install the Microsoft.ServiceFabric.Diagnostics.Internal package in the same way if it wasn't preinstalled before you installed the Application Insights package.

1. Search for **Microsoft.ApplicationInsights.ServiceFabric.Native**, and then select the NuGet package.
1. On the right pane, select the **VotingWeb** checkbox and the **VotingData** checkbox. Select **Install**.

    :::image type="content" source="media/service-fabric-tutorial-monitoring-aspnet/ai-sdk-nuget-new.png" alt-text="Screenshot that shows the Application Insights SDK in NuGet.":::
1. In the **Preview Changes** dialog, select **OK** to accept the license. The NuGet packages are added to the services.
1. Next, set up the telemetry initializer in the two services. Open *VotingWeb.cs* and *VotingData.cs*. Complete the following steps in both code files:

   1. Add these two `using` statements at the top of each file, after the existing `using` statements:

      ```csharp
      using Microsoft.ApplicationInsights.Extensibility;
      using Microsoft.ApplicationInsights.ServiceFabric;
      ```

   1. In both files, in the nested `return` statement of `CreateServiceInstanceListeners()` or `CreateServiceReplicaListeners()`, under `ConfigureServices` > `services`, with the other singleton services declared, add:

      ```csharp
      .AddSingleton<ITelemetryInitializer>((serviceProvider) => FabricTelemetryInitializerExtension.CreateFabricTelemetryInitializer(serviceContext))
      ```

      This code adds `Service Context` to your telemetry, so you can better understand the source of your telemetry in Application Insights. Your nested `return` statement in *VotingWeb.cs* now looks similar to this example:

      ```csharp
      return new WebHostBuilder()
          .UseKestrel()
          .ConfigureServices(
              services => services
                  .AddSingleton<HttpClient>(new HttpClient())
                  .AddSingleton<FabricClient>(new FabricClient())
                  .AddSingleton<StatelessServiceContext>(serviceContext)
                  .AddSingleton<ITelemetryInitializer>((serviceProvider) => FabricTelemetryInitializerExtension.CreateFabricTelemetryInitializer(serviceContext)))
          .UseContentRoot(Directory.GetCurrentDirectory())
          .UseStartup<Startup>()
          .UseApplicationInsights()
          .UseServiceFabricIntegration(listener, ServiceFabricIntegrationOptions.None)
          .UseUrls(url)
          .Build();
      ```

In *VotingData.cs*, your code now looks similar to this example:

```csharp
return new WebHostBuilder()
    .UseKestrel()
    .ConfigureServices(
        services => services
            .AddSingleton<StatefulServiceContext>(serviceContext)
            .AddSingleton<IReliableStateManager>(this.StateManager)
            .AddSingleton<ITelemetryInitializer>((serviceProvider) => FabricTelemetryInitializerExtension.CreateFabricTelemetryInitializer(serviceContext)))
    .UseContentRoot(Directory.GetCurrentDirectory())
    .UseStartup<Startup>()
    .UseApplicationInsights()
    .UseServiceFabricIntegration(listener, ServiceFabricIntegrationOptions.UseUniqueServiceUrl)
    .UseUrls(url)
    .Build();
```

Double-check that the `UseApplicationInsights()` method is called in both *VotingWeb.cs* and *VotingData.cs* as shown in the examples.

> [!NOTE]
> This sample app uses HTTP for the services to communicate. If you develop an app by using Service Fabric Service Remoting V2, also add the following lines in the same location in the code:

```csharp
ConfigureServices(services => services
    ...
    .AddSingleton<ITelemetryModule>(new ServiceRemotingDependencyTrackingTelemetryModule())
    .AddSingleton<ITelemetryModule>(new ServiceRemotingRequestTrackingTelemetryModule())
)
```

At this point, you're ready to deploy the application. Select **Start** (or select F5). Visual Studio builds and packages the application, sets up your local cluster, and deploys the application to the cluster.

> [!NOTE]
> You might get a build error if you don't have an up-to-date version of the .NET Core SDK installed.

When the application is deployed, go to `localhost:8080`, where the Voting Sample single-page application is running. Vote for a few different items of your choice to create some sample data and telemetry. For example, desserts!

:::image type="content" source="media/service-fabric-tutorial-monitoring-aspnet/vote-sample.png" alt-text="Screenshot that shows an example of voting for types of dessert.":::

You also can *remove* some of the voting options when you're done adding a few votes.

## View telemetry and Application Map in Application Insights

In the Azure portal, go to your Application Insights resource.

Select **Overview** to go back to the overview pane of your resource. Select **Search** to see the traces coming in. It takes a few minutes for traces to appear in Application Insights. If you don't see any traces, wait a minute, and then select the **Refresh** button.

:::image type="content" source="media/service-fabric-tutorial-monitoring-aspnet/ai-search.png" alt-text="Screenshot that shows the Application Insights see traces view.":::

Scroll down in the search window to view all the incoming telemetry that comes with Application Insights. For each action that you took in the Voting application, there should be an outgoing PUT request from *VotingWeb* (PUT Votes/Put [name]), an incoming PUT request from *VotingData* (PUT VoteData/Put [name]), followed by a pair of GET requests for refreshing the data that's displayed. There will also be a dependency trace for HTTP on `localhost` because these requests are HTTP requests. Here's an example of what you see for how one vote is added:

:::image type="content" source="media/service-fabric-tutorial-monitoring-aspnet/sample-request.png" alt-text="Screenshot that shows a sample request trace in Application Insights.":::

You can select a trace to see more details about it. Application Insights includes useful information about the request, including values for **Response time** and **Request URL**. Because you added the Service Fabric-specific NuGet, you also get data about your application in the context of a Service Fabric cluster in the **Custom Data** section. The data includes the service context, so you can see the **PartitionID** and **ReplicaId** values of the source of the request and better isolate issues when you diagnose errors in your application.

:::image type="content" source="media/service-fabric-tutorial-monitoring-aspnet/trace-details.png" alt-text="Screenshot that shows Application Insights trace details.":::

To go to Application Map, select **Application map** on the resource menu on the **Overview** pane, or select the **App map** icon. The map shows your two services connected.

:::image type="content" source="media/service-fabric-tutorial-monitoring-aspnet/app-map-new.png" alt-text="Screenshot that highlights Application map on the resource menu.":::

Application Map can help you understand your application topology better, especially as you start to add services that work together. It also gives you basic data about request success rates, and it can help you diagnose failed request to understand where things went wrong. To learn more, see [Application Map in Application Insights](../azure-monitor/app/app-map.md).

## Add custom instrumentation to your application

Although Application Insights provides telemetry out of the box, you might want to add custom instrumentation. Maybe you have business needs for custom instrumentation or you want to improve diagnostics when things go wrong in your application. You can ingest custom events and metrics by using the [Application Insights API](../azure-monitor/app/api-custom-events-metrics.md).

Next, add some custom events to *VoteDataController.cs* (in `VotingData` > `Controllers`) to track when votes are being added and deleted from the underlying `votesDictionary`:

1. Add `using Microsoft.ApplicationInsights;` at the end of the other `using` statements.
1. Declare a new value for `TelemetryClient` at the start of the class, under the creation of `IReliableStateManager`: `private TelemetryClient telemetry = new TelemetryClient();`.
1. In the `Put()` function, add an event that confirms that a vote is added. Add `telemetry.TrackEvent($"Added a vote for {name}");` after the transaction is completed, right before the return `OkResult` statement.
1. In `Delete()`, there's an "if/else" based on the condition that `votesDictionary` contains votes for a specific voting option.

    1. Add an event that confirms the deletion of a vote in the `if` statement, after `await tx.CommitAsync()`:
     `telemetry.TrackEvent($"Deleted votes for {name}");`
    1. Add an event to show that the deletion didn't take place in the `else` statement, before the `return` statement:
    `telemetry.TrackEvent($"Unable to delete votes for {name}, voting option not found");`

Here's an example of what your `Put()` and `Delete()` functions might look like after you add the events:

```csharp
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

    telemetry.TrackEvent($"Added a vote for {name}");
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
            telemetry.TrackEvent($"Deleted votes for {name}");
            return new OkResult();
        }
        else
        {
            telemetry.TrackEvent($"Unable to delete votes for {name}, voting option not found");
            return new NotFoundResult();
        }
    }
}
```

When you finish making these changes, select **Start** in the application so that it builds and deploys the latest version. When the application is finished deploying, go to `localhost:8080`. Add and delete some voting options. Then, go back to your Application Insights resource to see the traces for the latest run (traces take from 1 to 2 minutes to appear in Application Insights). For all the votes that you added and deleted, you should now see an entry for **Custom Event** with associated response telemetry.

:::image type="content" source="media/service-fabric-tutorial-monitoring-aspnet/custom-events.png" alt-text="Screenshot that shows custom events.":::

## Related content

* Learn more about [monitoring and diagnostics in Service Fabric](service-fabric-diagnostics-overview.md).
* Review [Service Fabric event analysis by using Application Insights](service-fabric-diagnostics-event-analysis-appinsights.md).
* Learn more about [Application Insights](/azure/application-insights/).
