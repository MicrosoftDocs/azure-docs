<properties
   pageTitle="Service communication with the ASP.NET Web API | Microsoft Azure"
   description="Learn how to implement service communication step-by-step by using the ASP.NET Web API with OWIN self-hosting in the Reliable Services API."
   services="service-fabric"
   documentationCenter=".net"
   authors="vturecek"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="required"
   ms.date="11/13/2015"
   ms.author="vturecek"/>

# Get started: Service Fabric Web API services with OWIN self-hosting

Azure Service Fabric puts the power in your hands when you decide how you want your services to communicate with users and with each other. This tutorial focuses on how service communication can be implemented by using the ASP.NET Web API with Open Web Interface for .NET (OWIN) self-hosting in Service Fabric's Reliable Services API. We'll delve deeply into the Reliable Services pluggable communication API. We'll also use a Web API in a step-by-step example to show you how to set up a custom communication listener. For a complete example of a Web API communication listener, see the [Service Fabric WebApplication sample on GitHub](https://github.com/Azure/servicefabric-samples/tree/master/samples/Services/VS2015/WebApplication).


## Introduction to Web APIs in Service Fabric

The ASP.NET Web API is a popular and powerful framework for building HTTP APIs on top of the .NET framework. If you're not already familiar with the framework , see [Getting started with ASP.NET Web API 2](http://www.asp.net/web-api/overview/getting-started-with-aspnet-web-api/tutorial-your-first-web-api) to learn more.

A Web API in Service Fabric is the same ASP.NET Web API you know and love. The difference is in how you *host* a Web API application (you won't be using Microsoft Internet Information Services). To better understand the difference, let's break it into two parts:

 1. The Web API application (including controllers and models)
 2. The host (the web server, usually IIS)

The Web API application itself doesn't change. It's no different from Web API applications you may have written in the past, and you should be able to simply move over most of your application code. But if you're used to hosting on IIS, where you host the application may be a little different from what you're used to. Before we get to the hosting part, let's start with something more familiar: a Web API application.


### Create the application

Start by creating a new Service Fabric application with a single stateless service in Visual Studio 2015:

![Create a new Service Fabric application](media/service-fabric-reliable-services-communication-webapi/webapi-newproject.png)

![Create a single stateless service](media/service-fabric-reliable-services-communication-webapi/webapi-newproject2.png)

This gives us an empty stateless service that will host the Web API application. We're going to set up the application from scratch to see how it's put together.

The first step is to pull in some NuGet packages for the Web API. The package we want to use is Microsoft.AspNet.WebApi.OwinSelfHost. This package includes all the necessary Web API packages and the *host* packages. This will be important later.

![Create a Web API by using the NuGet Package Manager](media/service-fabric-reliable-services-communication-webapi/webapi-nuget.png)

After the packages have been installed, you can begin building out the basic Web API project structure. If you've used a Web API, the project structure should look very familiar. Start by creating the basic Web API directories:

 + App_Start
 + Controllers
 + Models

Add the basic Web API configuration classes in the App_Start directory. For now, we'll just add an empty media type formatter config:

**FormatterConfig.cs**

```csharp

namespace WebApiService
{
    using System.Net.Http.Formatting;

    public static class FormatterConfig
    {
        public static void ConfigureFormatters(MediaTypeFormatterCollection formatters)
        {
        }
    }
}

```

Add a default controller in the Controllers directory:

**DefaultController.cs**

```csharp

namespace WebApiService.Controllers
{
    using System.Collections.Generic;
    using System.Web.Http;

    [RoutePrefix("api")]
    public class DefaultController : ApiController
    {
        // GET api/values
        [Route("values")]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        [Route("values/{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        [Route("values")]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        [Route("values/{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [Route("values/{id}")]
        public void Delete(int id)
        {
        }
    }
}

```

Finally, add a startup class at the project root to register the routing, formatters, and any other configuration setup. This is also where the Web API plugs in to the *host*, which will be revisited again later. When you set up the startup class, create an interface called IOwinAppBuilder for the startup class that defines the configuration method. Although this is not technically required for the Web API to work, it will allow for more flexible use of the startup class later.

**Startup.cs**

```csharp

namespace WebApiService
{
    using Owin;
    using System.Web.Http;

    public class Startup : IOwinAppBuilder
    {
        public void Configuration(IAppBuilder appBuilder)
        {
            HttpConfiguration config = new HttpConfiguration();

            config.MapHttpAttributeRoutes();
            FormatterConfig.ConfigureFormatters(config.Formatters);

            appBuilder.UseWebApi(config);
        }
    }
}

```

**IOwinAppBuilder.cs**

```csharp

namespace WebApiService
{
    using Owin;

    public interface IOwinAppBuilder
    {
        void Configuration(IAppBuilder appBuilder);
    }
}

```

That's it for the application part. At this point, we've set up just the basic Web API project layout. So far, it shouldn't look much different from Web API projects you may have written in the past or from the basic Web API template. Your business logic goes in the controllers and models as usual.

Now what do we do about hosting so that we can actually run it?


### Host the service

In Service Fabric, your service runs in a *service host process*, an executable file that runs your service code. When you write a service by using the Reliable Services API, your service project just compiles to an executable file that registers your service type and runs your code. This is true in most cases when you write a service on Service Fabric in .NET. When you open Program.cs in the stateless service project, you should see:

```csharp

public class Program
{
    public static void Main(string[] args)
    {
        try
        {
            using (FabricRuntime fabricRuntime = FabricRuntime.Create())
            {
                fabricRuntime.RegisterServiceType("WebApiServiceType", typeof(Service));

                Thread.Sleep(Timeout.Infinite);
            }
        }
        catch (Exception e)
        {
            ServiceEventSource.Current.ServiceHostInitializationFailed(e);
            throw;
        }
    }
}

```

If that looks suspiciously like the entry point to a console application, that's because it is.

Further details about the service host process and service registration are beyond the scope of this article. But it's important to know for now that *your service code is running in its own process*.

### Self-host a Web API with an OWIN host

Given that your Web API application code is hosted in its own process, how do you hook it up to a web server? Enter [OWIN](http://owin.org/). OWIN is simply a contract between .NET web applications and web servers. Traditionally when ASP.NET (up to MVC 5) is used, the web application is tightly coupled to IIS through System.Web. However, the Web API implements OWIN, so you can write a web application that is decoupled from the web server that hosts it. Because of this, you can use a *self-host* OWIN web server that you can start in your own process. This fits perfectly with the Service Fabric hosting model we just described.

In this article, we'll use Katana as the OWIN host for the Web API application. Katana is an open-source OWIN host implementation.

> [AZURE.NOTE] To learn more about Katana, go to the [Katana site](http://www.asp.net/aspnet/overview/owin-and-katana/an-overview-of-project-katana). For a quick overview of how to use Katana to self-host a Web API, see [Use OWIN to Self-Host ASP.NET Web API 2](http://www.asp.net/web-api/overview/hosting-aspnet-web-api/use-owin-to-self-host-web-api).


### Set up the web server

The Reliable Services API provides a communication entry point where you can plug in communication stacks that allow users and clients to connect to the service:

```csharp

protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
{
    ...
}

```

The web server (and any other communication stack you use in the future, such as WebSockets) should use the ICommunicationListener interface to integrate with the system correctly. The reasons for this will become more apparent in the following steps.

First, create a class called OwinCommunicationListener that implements ICommunicationListener:

**OwinCommunicationListener.cs**

```csharp

namespace WebApi
{
    using System;
    using System.Fabric;
    using System.Fabric.Description;
    using System.Globalization;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.Owin.Hosting;
    using Microsoft.ServiceFabric.Services.Communication.Runtime;

    public class OwinCommunicationListener : ICommunicationListener
    {
        public void Abort()
        {
        }

        public Task CloseAsync(CancellationToken cancellationToken)
        {
        }

        public Task<string> OpenAsync(CancellationToken cancellationToken)
        {
        }
    }
}

```

The ICommunicationListener interface provides three methods to manage a communication listener for your service:

 - *OpenAsync*. Start listening for requests.
 - **CloseAsync*. Stop listening for requests, finish any in-flight requests, and shut down gracefully.
 - *Abort*. Cancel everything and stop immediately.

To get started, add private class members for a URL path prefix and the startup class that was created earlier. These will be initialized through the constructor and used later when you set up the listening URL. Also, add private class members to save the listening address that is created during initialization and to save the server handle that is created when the server is started.

```csharp

public class OwinCommunicationListener : ICommunicationListener
{
    private readonly IOwinAppBuilder startup;
    private readonly string appRoot;
    private IDisposable serverHandle;
    private string listeningAddress;
    private readonly ServiceInitializationParameters serviceInitializationParameters;

    public OwinCommunicationListener(string appRoot, IOwinAppBuilder startup, ServiceInitializationParameters serviceInitializationParameters)
    {
        this.startup = startup;
        this.appRoot = appRoot;
        this.serviceInitializationParameters = serviceInitializationParameters;
    }        

    ...

```

### Implement OpenAsync

To set up the web server, you need two pieces of information:

 - *A URL path prefix*. Although this is optional, it's good for you to set this up now so that you can safely host multiple web services in your application.
 - *A port*.

Before you grab a port for the web server, it's important that you understand that Service Fabric provides an application layer that acts as a buffer between your application and the underlying operating system that it runs on. As such, Service Fabric provides a way to configure *endpoints* for your services. Service Fabric ensures that endpoints are available for your service to use. This way, you don't have to configure them yourself in the underlying OS environment. You can easily host your Service Fabric application in different environments without having to make any changes to your application. (For example, you can host the same application in Azure or in your own data center.)

Configure an HTTP endpoint in PackageRoot\ServiceManifest.xml:

```xml

<Resources>
    <Endpoints>
        <Endpoint Name="ServiceEndpoint" Type="Input" Protocol="http" Port="80" />
    </Endpoints>
</Resources>

```

This step is important because the service host process runs under restricted credentials (Network Service on Windows). This means that your service won't have access to set up an HTTP endpoint on its own. By using the endpoint configuration, Service Fabric knows to set up the proper access control list (ACL) for the URL that the service will listen on. Service Fabric also provides a standard place to configure endpoints.


Back in OwinCommunicationListener.cs, you can start implementing OpenAsync. This is where you start the web server. First, get the endpoint information and create the URL that the service will listen on.

```csharp

public Task<string> OpenAsync(CancellationToken cancellationToken)
{
    EndpointResourceDescription serviceEndpoint = serviceInitializationParameters.CodePackageActivationContext.GetEndpoint("ServiceEndpoint");
    int port = serviceEndpoint.Port;

    this.listeningAddress = String.Format(
        CultureInfo.InvariantCulture,
        "http://+:{0}/{1}",
        port,
        String.IsNullOrWhiteSpace(this.appRoot)
            ? String.Empty
            : this.appRoot.TrimEnd('/') + '/');
    ...

```

Note that `http://+` is used here. This is to make sure that the web server is listening on all available addresses, including localhost, FQDN, and the machine IP.

The OpenAsync implementation is one of the most important reasons why the web server (or any communication stack) is implemented as an ICommunicationListener, rather than just by opening it directly from `RunAsync()` in the service. The return value from OpenAsync is the address that the web server is listening on. When this address is returned to the system, it registers the address with the service. Service Fabric provides an API that allows clients and other services to then ask for this address by service name. This is important because the service address is not static. Services are moved around in the cluster for resource balancing and availability purposes. This is the mechanism that allows clients to resolve the listening address for a service.

With that in mind, OpenAsync starts the web server and returns the address it's listening on. Note that it listens on `http://+`, but before OpenAsync returns the address, the "+" is replaced with the IP or FQDN of the node it is currently on. The address that is returned by using this method is what's registered with the system. It's also what clients and other service see when they ask for a service's address. For clients to correctly connect to it, they need an actual IP or FQDN in the address.

```csharp

    ...

    this.serverHandle = WebApp.Start(this.listeningAddress, appBuilder => this.startup.Configuration(appBuilder));
    string publishAddress = this.listeningAddress.Replace("+", FabricRuntime.GetNodeContext().IPAddressOrFQDN);

    ServiceEventSource.Current.Message("Listening on {0}", publishAddress);

    return Task.FromResult(publishAddress);
}

```

Note that this references the startup class that was passed in to the OwinCommunicationListener in the constructor. This startup instance is used by the web server to bootstrap the Web API application.

The `ServiceEventSource.Current.Message()` line will appear in the diagnostic events window later, when you run the application to confirm that the web server has started successfully.

### Implement CloseAsync and Abort

Finally, implement both CloseAsync and Abort to stop the web server. The web server can be stopped by disposing the server handle that was created during OpenAsync.

```csharp

public Task CloseAsync(CancellationToken cancellationToken)
{
    this.StopWebServer();

    return Task.FromResult(true);
}

public void Abort()
{
    this.StopWebServer();
}

private void StopWebServer()
{
    if (this.serverHandle != null)
    {
        try
        {
            this.serverHandle.Dispose();
        }
        catch (ObjectDisposedException)
        {
            // no-op
        }
    }
}

```

In this implementation example, both CloseAsync and Abort simply stop the web server. You may opt to perform a more gracefully coordinated shutdown of the web server in CloseAsync. For example, the shutdown could wait for in-flight requests to complete.

### Start the web server

You're now ready to create and return an instance of OwinCommunicationListener to start the web server. Back in the service class (Service.cs), override the `CreateServiceInstanceListeners()` method:

```csharp

protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
{
    return new[]
    {
        new ServiceInstanceListener(initParams => new OwinCommunicationListener("webapp", new Startup(), initParams))
    };
}

```

This is where the Web API *application* and the OWIN *host* finally meet. The host (OwinCommunicationListener) is given an instance of the *application* (the Web API via startup). Service Fabric then manages its lifecycle. This same pattern can typically be followed with any communication stack.

### Put it all together

In this example, you don't need to do anything in the `RunAsync()` method, so that override can simply be removed.

The final service implementation should be very simple. It only needs to create the communication listener:

```csharp

namespace WebApiService
{
    using System.Collections.Generic;
    using Microsoft.ServiceFabric.Services.Communication.Runtime;
    using Microsoft.ServiceFabric.Services.Runtime;

    public class WebApiService : StatelessService
    {
        protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
        {
            return new[]
            {
                new ServiceInstanceListener(initParams => new OwinCommunicationListener("webapp", new Startup(), initParams))
            };
        }
    }
}

```

The complete `OwinCommunicationListener` class:

```csharp

namespace WebApiService
{
    using System;
    using System.Fabric;
    using System.Fabric.Description;
    using System.Globalization;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.Owin.Hosting;
    using Microsoft.ServiceFabric.Services.Communication.Runtime;

    public class OwinCommunicationListener : ICommunicationListener
    {
        private readonly IOwinAppBuilder startup;
        private readonly string appRoot;
        private readonly ServiceInitializationParameters serviceInitializationParameters;
        private IDisposable serverHandle;
        private string listeningAddress;

        public OwinCommunicationListener(string appRoot, IOwinAppBuilder startup, ServiceInitializationParameters serviceInitializationParameters)
        {
            this.startup = startup;
            this.appRoot = appRoot;
            this.serviceInitializationParameters = serviceInitializationParameters;
        }

        public Task<string> OpenAsync(CancellationToken cancellationToken)
        {
            EndpointResourceDescription serviceEndpoint = serviceInitializationParameters.CodePackageActivationContext.GetEndpoint("ServiceEndpoint");
            int port = serviceEndpoint.Port;

            this.listeningAddress = String.Format(
                CultureInfo.InvariantCulture,
                "http://+:{0}/{1}",
                port,
                String.IsNullOrWhiteSpace(this.appRoot)
                    ? String.Empty
                    : this.appRoot.TrimEnd('/') + '/');

            this.serverHandle = WebApp.Start(this.listeningAddress, appBuilder => this.startup.Configuration(appBuilder));
            string publishAddress = this.listeningAddress.Replace("+", FabricRuntime.GetNodeContext().IPAddressOrFQDN);

            ServiceEventSource.Current.Message("Listening on {0}", publishAddress);

            return Task.FromResult(publishAddress);
        }

        public Task CloseAsync(CancellationToken cancellationToken)
        {
            ServiceEventSource.Current.Message("Close");

            this.StopWebServer();

            return Task.FromResult(true);
        }

        public void Abort()
        {
            ServiceEventSource.Current.Message("Abort");

            this.StopWebServer();
        }

        private void StopWebServer()
        {
            if (this.serverHandle != null)
            {
                try
                {
                    this.serverHandle.Dispose();
                }
                catch (ObjectDisposedException)
                {
                    // no-op
                }
            }
        }
    }
}

```

Now that you have put all the pieces in place, your project should look like a typical Web API application with Reliable Services API entry points and an OWIN host:


![Web API with Reliable Services API entry points and OWIN host](media/service-fabric-reliable-services-communication-webapi/webapi-projectstructure.png)

### Run and connect through a web browser

If you haven't done so yet, [set up your development environment](service-fabric-get-started.md).


You can now build and deploy your service. Press **F5** in Visual Studio to build and deploy the application. In the diagnostic events window, you should see a message that indicates that the web server opened on http://localhost:80/webapp/api.


![Visual Studio diagnostic events](media/service-fabric-reliable-services-communication-webapi/webapi-diagnostics.png)

> [AZURE.NOTE] If the port has already be opened by another process on your machine, you may see an error here. This indicates that the listener couldn't be opened. If that's the case, try using a different port for the endpoint configuration in ServiceManifest.xml.


After the service has begun running, open a browser and navigate to [http://localhost/webapp/api/values](http://localhost/webapp/api/values) to test it out.

### Scale it out

Scaling out stateless web apps typically means adding more machines and spinning up the web apps on them. Service Fabric's orchestration engine can do this for you whenever new nodes are added to a cluster. When you create instances of a stateless service, you can specify the number of instances you want to create. Service Fabric places that number of instances on nodes in the cluster. And it makes sure not to create more than one instance on any one node. You can also instruct Service Fabric to always create an instance on every node by specifying **-1** for the instance count. This guarantees that whenever you add nodes to scale out your cluster, an instance of your stateless service will be created on the new nodes. This value is a property of the service instance, so it is set when you create a service instance. You can do this through PowerShell:

```powershell

New-ServiceFabricService -ApplicationName "fabric:/WebServiceApplication" -ServiceName "fabric:/WebServiceApplication/WebService" -ServiceTypeName "WebServiceType" -Stateless -PartitionSchemeSingleton -InstanceCount -1

```

You can also do this when you define a default service in a Visual Studio stateless service project:

```xml

<DefaultServices>
  <Service Name="WebService">
    <StatelessService ServiceTypeName="WebServiceType" InstanceCount="-1">
      <SingletonPartition />
    </StatelessService>
  </Service>
</DefaultServices>

```

For more information on how to create application and service instances, see [Deploy an application](service-fabric-deploy-remove-applications.md).

## ASP.NET 5

In ASP.NET 5, the concept and programming model of separating the *application* from the *host* in web applications remains the same. It can also be applied to other forms of communication. In addition, although the *host* may differ in ASP.NET 5, the Web API *application* layer remains the same. This is where the bulk of the application logic actually lives.

## Next steps

[Debug your Service Fabric application by using Visual Studio](service-fabric-debugging-your-application.md)
