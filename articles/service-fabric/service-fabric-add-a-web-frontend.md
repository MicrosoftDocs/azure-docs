<properties
   pageTitle="Create a web front end for your application using ASP.NET Core | Microsoft Azure"
   description="Expose your Service Fabric application to the web by using an ASP.NET Core Web API project and inter-service communication via ServiceProxy."
   services="service-fabric"
   documentationCenter=".net"
   authors="seanmck"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotNet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="08/11/2016"
   ms.author="seanmck"/>


# Build a web service front end for your application using ASP.NET Core

By default, Azure Service Fabric services do not provide a public interface to the web. To expose your application's functionality to HTTP clients, you will need to create a web project to act as an entry point and then communicate from there to your individual services.

In this tutorial, we will pick up where we left off in the [Creating your first application in Visual Studio](service-fabric-create-your-first-application-in-visual-studio.md) tutorial and add a web service in front of the stateful counter service. If you have not already done so, you should go back and step through that tutorial first.

## Add an ASP.NET Core service to your application

ASP.NET Core is a lightweight, cross-platform web development framework that you can use to create modern web UI and web APIs. Let's add an ASP.NET Web API project to our existing application.

>[AZURE.NOTE] To complete this tutorial, you will need to [install .NET Core 1.0][dotnetcore-install].

1. In Solution Explorer, right-click **Services** within the application project and choose **Add > New Service Fabric Service**.

	![Adding a new service to an existing application][vs-add-new-service]

2. On the **Create a Service** page, choose **ASP.NET Core** and give it a name.

	![Choosing ASP.NET web service in the new service dialog][vs-new-service-dialog]

3. The next page provides a set of ASP.NET Core project templates. Note that these are the same templates that you would see if you created an ASP.NET Core project outside of a Service Fabric application. For this tutorial, we will choose **Web API**. However, you can apply the same concepts to building a full web application.

	![Choosing ASP.NET project type][vs-new-aspnet-project-dialog]

    Once your Web API project is created, you will have two services in your application. As you continue to build your application, you will add more services in exactly the same way. Each can be independently versioned and upgraded.

>[AZURE.TIP] To learn more about building ASP.NET Core services, see the [ASP.NET Core Documentation](https://docs.asp.net).

## Run the application

To get a sense of what we've done, let's deploy the new application and take a look at the default behavior that the ASP.NET Core Web API template provides.

1. Press F5 in Visual Studio to debug the app.

2. When deployment is complete, Visual Studio will launch the browser to the root of the ASP.NET Web API service--something like http://localhost:33003. The port number is randomly assigned and may be different on your machine. The ASP.NET Core Web API template doesn't provide default behavior for the root, so you will get an error in the browser.

3. Add `/api/values` to the location in the browser. This will invoke the `Get` method on the ValuesController in the Web API template. It will return the default response that is provided by the template--a JSON array that contains two strings:

    ![Default values returned from ASP.NET Core Web API template][browser-aspnet-template-values]

    By the end of the tutorial, we will have replaced these default values with the most recent counter value from our stateful service.


## Connect the services

Service Fabric provides complete flexibility in how you communicate with reliable services. Within a single application, you might have services that are accessible via TCP, other services that are accessible via an HTTP REST API, and still other services that are accessible via web sockets. For background on the options available and the tradeoffs involved, see [Communicating with services](service-fabric-connect-and-communicate-with-services.md). In this tutorial, we will follow one of the simpler approaches and use the `ServiceProxy`/`ServiceRemotingListener` classes that are provided in the SDK.

In the `ServiceProxy` approach (modeled on remote procedure calls or RPCs), you define an interface to act as the public contract for the service. Then, you use that interface to generate a proxy class for interacting with the service.


### Create the interface

We will start by creating the interface to act as the contract between the stateful service and its clients, including the ASP.NET Core project.

1. In Solution Explorer, right-click your solution and choose **Add** > **New Project**.

2. Choose the **Visual C#** entry in the left navigation pane and then select the **Class Library** template. Ensure that the .NET Framework version is set to **4.5.2**.

    ![Creating an interface project for your stateful service][vs-add-class-library-project]

3. In order for an interface to be usable by `ServiceProxy`, it must derive from the IService interface. This interface is included in one of the Service Fabric NuGet packages. To add the package, right-click your new class library project and choose **Manage NuGet Packages**.

4. Search for the **Microsoft.ServiceFabric.Services** package and install it.

    ![Adding the Services NuGet package][vs-services-nuget-package]

5. In the class library, create an interface with a single method, `GetCountAsync`, and extend the interface from IService.

    ```c#
    namespace MyStatefulService.Interfaces
    {
        using Microsoft.ServiceFabric.Services.Remoting;

        public interface ICounter: IService
        {
            Task<long> GetCountAsync();
        }
    }
    ```


### Implement the interface in your stateful service

Now that we have defined the interface, we need to implement it in the stateful service.

1. In your stateful service, add a reference to the class library project that contains the interface.

    ![Adding a reference to the class library project in the stateful service][vs-add-class-library-reference]

2. Locate the class that inherits from `StatefulService`, such as `MyStatefulService`, and extend it to implement the `ICounter` interface.

    ```c#
    using MyStatefulService.Interfaces;

    ...

    public class MyStatefulService : StatefulService, ICounter
    {        
          // ...
    }
    ```

3. Now implement the single method that is defined in the `ICounter` interface, `GetCountAsync`.

    ```c#
    public async Task<long> GetCountAsync()
    {
      var myDictionary =
        await this.StateManager.GetOrAddAsync<IReliableDictionary<string, long>>("myDictionary");

        using (var tx = this.StateManager.CreateTransaction())
        {          
            var result = await myDictionary.TryGetValueAsync(tx, "Counter");
            return result.HasValue ? result.Value : 0;
        }
    }
    ```


### Expose the stateful service using a service remoting listener

With the `ICounter` interface implemented, the final step in enabling the stateful service to be callable from other services is to open a communication channel. For stateful services, Service Fabric provides an overridable method called `CreateServiceReplicaListeners`. With this method, you can specify one or more communication listeners, based on the type of communication that you want to enable to your service.

>[AZURE.NOTE] The equivalent method for opening a communication channel to stateless services is called `CreateServiceInstanceListeners`.

In this case, we will replace the existing `CreateServiceReplicaListeners` method and provide an instance of `ServiceRemotingListener`, which creates an RPC endpoint that is callable from clients through `ServiceProxy`.  

```c#
using Microsoft.ServiceFabric.Services.Remoting.Runtime;

...

protected override IEnumerable<ServiceReplicaListener> CreateServiceReplicaListeners()
{
    return new List<ServiceReplicaListener>()
    {
        new ServiceReplicaListener(
            (context) =>
                this.CreateServiceRemotingListener(context))
    };
}
```


### Use the ServiceProxy class to interact with the service

Our stateful service is now ready to receive traffic from other services. So all that remains is adding the code to communicate with it from the ASP.NET web service.

1. In your ASP.NET project, add a reference to the class library that contains the `ICounter` interface.

2. From the **Build** menu, open the **Configuration Manager**. You should see something like this:

    ![Configuration manager showing class library as AnyCPU][vs-configuration-manager]

    Note that the class library project, **MyStatefulService.Interface**, is configured to build for Any CPU. To work correctly with Service Fabric, it must be explicitly targeted at x64. Click the Platform dropdown and choose **New**, then create an x64 platform configuration.

    ![Creating new platform for class library][vs-create-platform]

3. Add the Microsoft.ServiceFabric.Services package to the ASP.NET project, just as you did for the class library project earlier. This will provide the `ServiceProxy` class.

4. In the **Controllers** folder, open the `ValuesController` class. Note that the `Get` method currently just returns a hard-coded string array of "value1" and "value2"--which matches what we saw earlier in the browser. Replace this implementation with the following code:

    ```c#
    using MyStatefulService.Interfaces;
    using Microsoft.ServiceFabric.Services.Remoting.Client;

    ...

    public async Task<IEnumerable<string>> Get()
    {
        ICounter counter =
            ServiceProxy.Create<ICounter>(new Uri("fabric:/MyApplication/MyStatefulService"), new ServicePartitionKey(0));

        long count = await counter.GetCountAsync();

        return new string[] { count.ToString() };
    }
    ```

    The first line of code is the key one. To create the ICounter proxy to the stateful service, you need to provide two pieces of information: a partition ID and the name of the service.

    You can use partitioning to scale stateful services by breaking up their state into different buckets, based on a key that you define, such as a customer ID or postal code. In our trivial application, the stateful service only has one partition, so the key doesn't matter. Any key that you provide will lead to the same partition. To learn more about partitioning services, see [How to partition Service Fabric Reliable Services](service-fabric-concepts-partitioning.md).

    The service name is a URI of the form fabric:/&lt;application_name&gt;/&lt;service_name&gt;.

    With these two pieces of information, Service Fabric can uniquely identify the machine that requests should be sent to. The `ServiceProxy` class also seamlessly handles the case where the machine that hosts the stateful service partition fails and another machine must be promoted to take its place. This abstraction makes writing the client code to deal with other services significantly simpler.

    Once we have the proxy, we simply invoke the `GetCountAsync` method and return its result.

5. Press F5 again to run the modified application. As before, Visual Studio will automatically launch the browser to the root of the web project. Add the "api/values" path, and you should see the current counter value returned.

    ![The stateful counter value displayed in the browser][browser-aspnet-counter-value]

    Refresh the browser periodically to see the counter value update.


>[AZURE.WARNING] The ASP.NET Core web server provided in the template, known as Kestrel, is [not currently supported for handling direct internet traffic](https://docs.asp.net/en/latest/fundamentals/servers.html#kestrel). For production scenarios, consider hosting your ASP.NET Core endpoints behind [API Management][api-management-landing-page] or another internet-facing gateway. Note that Service Fabric is not supported for deployment within IIS.


## What about actors?

This tutorial focused on adding a web front end that communicated with a stateful service. However, you can follow a very similar model to talk to actors. In fact, it is somewhat simpler.

When you create an actor project, Visual Studio automatically generates an interface project for you. You can use that interface to generate an actor proxy in the web project to communicate with the actor. The communication channel is provided automatically. So you do not need to do anything that is equivalent to establishing a `ServiceRemotingListener` like you did for the stateful service in this tutorial.

## How web services work on your local cluster

In general, you can deploy exactly the same Service Fabric application to a multi-machine cluster that you deployed on your local cluster and be highly confident that it will work as you expect. This is because your local cluster is simply a five-node configuration that is collapsed to a single machine.

When it comes to web services, however, there is one key nuance. When your cluster sits behind a load balancer, as it does in Azure, you must ensure that your web services are deployed on every machine since the load balancer will simply round-robin traffic across the machines. You can do this by setting the `InstanceCount` for the service to the special value of "-1".

By contrast, when you run a web service locally, you need to ensure that only one instance of the service is running. Otherwise, you will run into conflicts from multiple processes that are listening on the same path and port. As a result, the web service instance count should be set to "1" for local deployments.

To learn how to configure different values for different environment, see [Managing application parameters for multiple environments](service-fabric-manage-multiple-environment-app-configuration.md).

## Next steps

- [Create a cluster in Azure for deploying your application to the cloud](service-fabric-cluster-creation-via-portal.md)
- [Learn more about communicating with services](service-fabric-connect-and-communicate-with-services.md)
- [Learn more about partitioning stateful services](service-fabric-concepts-partitioning.md)

<!-- Image References -->

[vs-add-new-service]: ./media/service-fabric-add-a-web-frontend/vs-add-new-service.png
[vs-new-service-dialog]: ./media/service-fabric-add-a-web-frontend/vs-new-service-dialog.png
[vs-new-aspnet-project-dialog]: ./media/service-fabric-add-a-web-frontend/vs-new-aspnet-project-dialog.png
[browser-aspnet-template-values]: ./media/service-fabric-add-a-web-frontend/browser-aspnet-template-values.png
[vs-add-class-library-project]: ./media/service-fabric-add-a-web-frontend/vs-add-class-library-project.png
[vs-add-class-library-reference]: ./media/service-fabric-add-a-web-frontend/vs-add-class-library-reference.png
[vs-services-nuget-package]: ./media/service-fabric-add-a-web-frontend/vs-services-nuget-package.png
[browser-aspnet-counter-value]: ./media/service-fabric-add-a-web-frontend/browser-aspnet-counter-value.png
[vs-configuration-manager]: ./media/service-fabric-add-a-web-frontend/vs-configuration-manager.png
[vs-create-platform]: ./media/service-fabric-add-a-web-frontend/vs-create-platform.png


<!-- external links -->
[dotnetcore-install]: https://www.microsoft.com/net/core#windows
[api-management-landing-page]: https://azure.microsoft.com/en-us/services/api-management/
