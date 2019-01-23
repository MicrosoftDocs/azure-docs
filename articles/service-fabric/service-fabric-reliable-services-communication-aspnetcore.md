---
title: Service communication with the ASP.NET Core | Microsoft Docs
description: Learn how to use ASP.NET Core in stateless and stateful Reliable Services.
services: service-fabric
documentationcenter: .net
author: vturecek
manager: timlt
editor: ''

ms.assetid: 8aa4668d-cbb6-4225-bd2d-ab5925a868f2
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: required
ms.date: 10/12/2018
ms.author: vturecek
---

# ASP.NET Core in Service Fabric Reliable Services

ASP.NET Core is a new open-source and cross-platform framework for building modern cloud-based Internet-connected applications, such as web apps, IoT apps, and mobile backends. 

This article is an in-depth guide to hosting ASP.NET Core services in Service Fabric Reliable Services using the **Microsoft.ServiceFabric.AspNetCore.*** set of NuGet packages.

For an introductory tutorial on ASP.NET Core in Service Fabric and instructions on getting your development environment setup, see [Create a .NET application](service-fabric-tutorial-create-dotnet-app.md).

The rest of this article assumes you are already familiar with ASP.NET Core. If not, we recommend reading through the [ASP.NET Core fundamentals](https://docs.microsoft.com/aspnet/core/fundamentals/index).

## ASP.NET Core in the Service Fabric environment

Both ASP.NET Core and Service Fabric apps can run on .NET Core as well as full .NET Framework. ASP.NET Core can be used in two different ways in Service Fabric:
 - **Hosted as a guest executable**. This is primarily used to run existing ASP.NET Core applications on Service Fabric with no code changes.
 - **Run inside a Reliable Service**. This allows better integration with the Service Fabric runtime and allows stateful ASP.NET Core services.

The rest of this article explains how to use ASP.NET Core inside a Reliable Service using the ASP.NET Core integration components that ship with the Service Fabric SDK. 

## Service Fabric service hosting

In Service Fabric, one or more instances and/or replicas of your service run in a *service host process*, an executable file that runs your service code. You, as a service author, own the service host process and Service Fabric activates and monitors it for you.

Traditional ASP.NET (up to MVC 5) is tightly coupled to IIS through System.Web.dll. ASP.NET Core provides a separation between the web server and your web application. This allows web applications to be portable between different web servers and also allows web servers to be *self-hosted*, which means you can start a web server in your own process, as opposed to a process that is owned by dedicated web server software such as IIS. 

In order to combine a Service Fabric service and ASP.NET, either as a guest executable or in a Reliable Service, you must be able to start ASP.NET inside your service host process. ASP.NET Core self-hosting allows you to do this.

## Hosting ASP.NET Core in a Reliable Service
Typically, self-hosted ASP.NET Core applications create a WebHost in an application's entry point, such as the `static void Main()` method in `Program.cs`. In this case, the lifecycle of the WebHost is bound to the lifecycle of the process.

![Hosting ASP.NET Core in a process][0]

However, the application entry point is not the right place to create a WebHost in a Reliable Service, because the application entry point is only used to register a service type with the Service Fabric runtime, so that it may create instances of that service type. The WebHost should be created in a Reliable Service itself. Within the service host process, service instances and/or replicas can go through multiple lifecycles. 

A Reliable Service instance is represented by your service class deriving from `StatelessService` or `StatefulService`. The communication stack for a service is contained in an `ICommunicationListener` implementation in your service class. The `Microsoft.ServiceFabric.AspNetCore.*` NuGet packages contain implementations of `ICommunicationListener` that start and manage the ASP.NET Core WebHost for either Kestrel or HttpSys in a Reliable Service.

![Hosting ASP.NET Core in a Reliable Service][1]

## ASP.NET Core ICommunicationListeners
The `ICommunicationListener` implementations for Kestrel and HttpSys in the  `Microsoft.ServiceFabric.AspNetCore.*` NuGet packages have similar use patterns but perform slightly different actions specific to each web server. 

Both communication listeners provide a constructor that takes the following arguments:
 - **`ServiceContext serviceContext`**: The `ServiceContext` object that contains information about the running service.
 - **`string endpointName`**: the name of an `Endpoint` configuration in ServiceManifest.xml. This is primarily where the two communication listeners differ: HttpSys **requires** an `Endpoint` configuration, while Kestrel does not.
 - **`Func<string, AspNetCoreCommunicationListener, IWebHost> build`**: a lambda that you implement in which you create and return an `IWebHost`. This allows you to configure `IWebHost` the way you normally would in an ASP.NET Core application. The lambda provides a URL which is generated for you depending on the Service Fabric integration options you use and the `Endpoint` configuration you provide. That URL can then be modified or used as-is to start the web server.

## Service Fabric integration middleware
The `Microsoft.ServiceFabric.AspNetCore` NuGet package includes the `UseServiceFabricIntegration` extension method on `IWebHostBuilder` that adds Service Fabric-aware middleware. This middleware configures the Kestrel or HttpSys `ICommunicationListener` to register a unique service URL with the Service Fabric Naming Service and then validates client requests to ensure clients are connecting to the right service. This is necessary in a shared-host environment such as Service Fabric, where multiple web applications can run on the same physical or virtual machine but do not use unique host names, to prevent clients from mistakenly connecting to the wrong service. This scenario is described in more detail in the next section.

### A case of mistaken identity
Service replicas, regardless of protocol, listen on a unique IP:port combination. Once a service replica has started listening on an IP:port endpoint, it reports that endpoint address to the Service Fabric Naming Service where it can be discovered by clients or other services. If services use dynamically-assigned application ports, a service replica may coincidentally use the same IP:port endpoint of another service that was previously on the same physical or virtual machine. This can cause a client to mistakely connect to the wrong service. This can happen if the following sequence of events occurs:

 1. Service A listens on 10.0.0.1:30000 over HTTP. 
 2. Client resolves Service A and gets address 10.0.0.1:30000
 3. Service A moves to a different node.
 4. Service B is placed on 10.0.0.1 and coincidentally uses the same port 30000.
 5. Client attempts to connect to service A with cached address 10.0.0.1:30000.
 6. Client is now successfully connected to service B not realizing it is connected to the wrong service.

This can cause bugs at random times that can be difficult to diagnose. 

### Using unique service URLs
To prevent this, services can post an endpoint to the Naming Service with a unique identifier, and then validate that unique identifier during client requests. This is a cooperative action between services in a non-hostile-tenant trusted environment. This does not provide secure service authentication in a hostile-tenant environment.

In a trusted environment, the middleware that's added by the `UseServiceFabricIntegration` method automatically appends a unique identifier to the address that is posted to the Naming Service and validates that identifier on each request. If the identifier does not match, the middleware immediately returns an HTTP 410 Gone response.

Services that use a dynamically assigned port should make use of this middleware.

Services that use a fixed unique port do not have this problem in a cooperative environment. A fixed unique port is typically used for externally facing services that need a well-known port for client applications to connect to. For example, most Internet-facing web applications will use port 80 or 443 for web browser connections. In this case, the unique identifier should not be enabled.

The following diagram shows the request flow with the middleware enabled:

![Service Fabric ASP.NET Core integration][2]

Both Kestrel and HttpSys `ICommunicationListener` implementations use this mechanism in exactly the same way. Although HttpSys can internally differentiate requests based on unique URL paths using the underlying *http.sys* port sharing feature, that functionality is *not* used by the HttpSys `ICommunicationListener` implementation because that will result in HTTP 503 and HTTP 404 error status codes in the scenario described earlier. That in turn makes it difficult for clients to determine the intent of the error, as HTTP 503 and HTTP 404 are already commonly used to indicate other errors. Thus, both Kestrel and HttpSys `ICommunicationListener` implementations standardize on the middleware provided by the `UseServiceFabricIntegration` extension method so that clients only need to perform a service endpoint re-resolve action on HTTP 410 responses.

## HttpSys in Reliable Services
HttpSys can be used in a Reliable Service by importing the **Microsoft.ServiceFabric.AspNetCore.HttpSys** NuGet package. This package contains `HttpSysCommunicationListener`, an implementation of `ICommunicationListener`, that allows you to create an ASP.NET Core WebHost inside a Reliable Service using HttpSys as the web server.

HttpSys is built on the [Windows HTTP Server API](https://msdn.microsoft.com/library/windows/desktop/aa364510(v=vs.85).aspx). This uses the *http.sys* kernel driver used by IIS to process HTTP requests and route them to processes running web applications. This allows multiple processes on the same physical or virtual machine to host web applications on the same port, disambiguated by either a unique URL path or hostname. These features are useful in Service Fabric for hosting multiple websites in the same cluster.

>[!NOTE]
>HttpSys implementation works only on Windows platform.

The following diagram illustrates how HttpSys uses the *http.sys* kernel driver on Windows for port sharing:

![http.sys][3]

### HttpSys in a stateless service
To use `HttpSys` in a stateless service, override the `CreateServiceInstanceListeners` method and return a `HttpSysCommunicationListener` instance:

```csharp
protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
{
    return new ServiceInstanceListener[]
    {
        new ServiceInstanceListener(serviceContext =>
            new HttpSysCommunicationListener(serviceContext, "ServiceEndpoint", (url, listener) =>
                new WebHostBuilder()
                    .UseHttpSys()
                    .ConfigureServices(
                        services => services
                            .AddSingleton<StatelessServiceContext>(serviceContext))
                    .UseContentRoot(Directory.GetCurrentDirectory())
                    .UseServiceFabricIntegration(listener, ServiceFabricIntegrationOptions.None)
                    .UseStartup<Startup>()
                    .UseUrls(url)
                    .Build()))
    };
}
```

### HttpSys in a stateful service

`HttpSysCommunicationListener` is currently not designed for use in stateful services due to complications with the underlying *http.sys* port sharing feature. For more information, see the following section on dynamic port allocation with HttpSys. For stateful services, Kestrel is the recommended web server.

### Endpoint configuration

An `Endpoint` configuration is required for web servers that use the Windows HTTP Server API, including HttpSys. Web servers that use the Windows HTTP Server API must first reserve their URL with *http.sys* (this is normally accomplished with the [netsh](https://msdn.microsoft.com/library/windows/desktop/cc307236(v=vs.85).aspx) tool). This action requires elevated privileges that your services by default do not have. The "http" or "https" options for the `Protocol` property of the `Endpoint` configuration in *ServiceManifest.xml* are used specifically to instruct the Service Fabric runtime to register a URL with *http.sys* on your behalf using the [*strong wildcard*](https://msdn.microsoft.com/library/windows/desktop/aa364698(v=vs.85).aspx) URL prefix.

For example, to reserve `http://+:80` for a service, the following configuration should be used in ServiceManifest.xml:

```xml
<ServiceManifest ... >
    ...
    <Resources>
        <Endpoints>
            <Endpoint Name="ServiceEndpoint" Protocol="http" Port="80" />
        </Endpoints>
    </Resources>

</ServiceManifest>
```

And the endpoint name must be passed to the `HttpSysCommunicationListener` constructor:

```csharp
 new HttpSysCommunicationListener(serviceContext, "ServiceEndpoint", (url, listener) =>
 {
     return new WebHostBuilder()
         .UseHttpSys()
         .UseServiceFabricIntegration(listener, ServiceFabricIntegrationOptions.None)
         .UseUrls(url)
         .Build();
 })
```

#### Use HttpSys with a static port
To use a static port with HttpSys, provide the port number in the `Endpoint` configuration:

```xml
  <Resources>
    <Endpoints>
      <Endpoint Protocol="http" Name="ServiceEndpoint" Port="80" />
    </Endpoints>
  </Resources>
```

#### Use HttpSys with a dynamic port
To use a dynamically assigned port with HttpSys, omit the `Port` property in the `Endpoint` configuration:

```xml
  <Resources>
    <Endpoints>
      <Endpoint Protocol="http" Name="ServiceEndpoint" />
    </Endpoints>
  </Resources>
```

A dynamic port allocated by an `Endpoint` configuration only provides one port *per host process*. The current Service Fabric hosting model allows multiple service instances and/or replicas to be hosted in the same process, meaning that each one will share the same port when allocated through the `Endpoint` configuration. Multiple HttpSys instances can share a port using the underlying *http.sys* port sharing feature, but that is not supported by `HttpSysCommunicationListener` due to the complications it introduces for client requests. For dynamic port usage, Kestrel is the recommended web server.

## Kestrel in Reliable Services
Kestrel can be used in a Reliable Service by importing the **Microsoft.ServiceFabric.AspNetCore.Kestrel** NuGet package. This package contains `KestrelCommunicationListener`, an implementation of `ICommunicationListener`, that allows you to create an ASP.NET Core WebHost inside a Reliable Service using Kestrel as the web server.

Kestrel is a cross-platform web server for ASP.NET Core based on libuv, a cross-platform asynchronous I/O library. Unlike HttpSys, Kestrel does not use a centralized endpoint manager such as *http.sys*. And unlike HttpSys, Kestrel does not support port sharing between multiple processes. Each instance of Kestrel must use a unique port.

![kestrel][4]

### Kestrel in a stateless service
To use `Kestrel` in a stateless service, override the `CreateServiceInstanceListeners` method and return a `KestrelCommunicationListener` instance:

```csharp
protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
{
    return new ServiceInstanceListener[]
    {
        new ServiceInstanceListener(serviceContext =>
            new KestrelCommunicationListener(serviceContext, "ServiceEndpoint", (url, listener) =>
                new WebHostBuilder()
                    .UseKestrel()
                    .ConfigureServices(
                        services => services
                            .AddSingleton<StatelessServiceContext>(serviceContext))
                    .UseContentRoot(Directory.GetCurrentDirectory())
                    .UseServiceFabricIntegration(listener, ServiceFabricIntegrationOptions.UseUniqueServiceUrl)
                    .UseStartup<Startup>()
                    .UseUrls(url)
                    .Build();
            ))
    };
}
```

### Kestrel in a stateful service
To use `Kestrel` in a stateful service, override the `CreateServiceReplicaListeners` method and return a `KestrelCommunicationListener` instance:

```csharp
protected override IEnumerable<ServiceReplicaListener> CreateServiceReplicaListeners()
{
    return new ServiceReplicaListener[]
    {
        new ServiceReplicaListener(serviceContext =>
            new KestrelCommunicationListener(serviceContext, (url, listener) =>
                new WebHostBuilder()
                    .UseKestrel()
                    .ConfigureServices(
                         services => services
                             .AddSingleton<StatefulServiceContext>(serviceContext)
                             .AddSingleton<IReliableStateManager>(this.StateManager))
                    .UseContentRoot(Directory.GetCurrentDirectory())
                    .UseServiceFabricIntegration(listener, ServiceFabricIntegrationOptions.UseUniqueServiceUrl)
                    .UseStartup<Startup>()
                    .UseUrls(url)
                    .Build();
            ))
    };
}
```

In this example, a singleton instance of `IReliableStateManager` is provided to the WebHost dependency injection container. This is not strictly necessary, but it allows you to use `IReliableStateManager` and Reliable Collections in your MVC controller action methods.

An `Endpoint` configuration name is **not** provided to `KestrelCommunicationListener` in a stateful service. This is explained in more detail in the following section.

### Configure Kestrel to use HTTPS
When enabling HTTPS with Kestrel in your service, you will need to set several listening options.  Update the `ServiceInstanceListener` to use an EndpointHttps endpoint and listen on a specific port (such as port 443). When configuring the web host to use Kestrel server, you must configure Kestrel to listen for IPv6 addresses on all network interfaces: 

```csharp
new ServiceInstanceListener(
serviceContext =>
    new KestrelCommunicationListener(
        serviceContext,
        "EndpointHttps",
        (url, listener) =>
        {
            ServiceEventSource.Current.ServiceMessage(serviceContext, $"Starting Kestrel on {url}");

            return new WebHostBuilder()
                .UseKestrel(opt =>
                {
                    int port = serviceContext.CodePackageActivationContext.GetEndpoint("EndpointHttps").Port;
                    opt.Listen(IPAddress.IPv6Any, port, listenOptions =>
                    {
                        listenOptions.UseHttps(GetCertificateFromStore());
                        listenOptions.NoDelay = true;
                    });
                })
                .ConfigureAppConfiguration((builderContext, config) =>
                {
                    config.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
                })

                .ConfigureServices(
                    services => services
                        .AddSingleton<HttpClient>(new HttpClient())
                        .AddSingleton<FabricClient>(new FabricClient())
                        .AddSingleton<StatelessServiceContext>(serviceContext))
                .UseContentRoot(Directory.GetCurrentDirectory())
                .UseStartup<Startup>()
                .UseServiceFabricIntegration(listener, ServiceFabricIntegrationOptions.None)
                .UseUrls(url)
                .Build();
        }))
```

For a full example used in a tutorial, see [Configure Kestrel to use HTTPS](service-fabric-tutorial-dotnet-app-enable-https-endpoint.md#configure-kestrel-to-use-https).


### Endpoint configuration
An `Endpoint` configuration is not required to use Kestrel. 

Kestrel is a simple stand-alone web server; unlike HttpSys (or HttpListener), it does not need an `Endpoint` configuration in *ServiceManifest.xml* because it does not require URL registration prior to starting. 

#### Use Kestrel with a static port
A static port can be configured in the `Endpoint` configuration of ServiceManifest.xml for use with Kestrel. Although this is not strictly necessary, it provides two potential benefits:
 1. If the port does not fall in the application port range, it is opened through the OS firewall by Service Fabric.
 2. The URL provided to you through `KestrelCommunicationListener` will use this port.

```xml
  <Resources>
    <Endpoints>
      <Endpoint Protocol="http" Name="ServiceEndpoint" Port="80" />
    </Endpoints>
  </Resources>
```

If an `Endpoint` is configured, its name must be passed into the `KestrelCommunicationListener` constructor: 

```csharp
new KestrelCommunicationListener(serviceContext, "ServiceEndpoint", (url, listener) => ...
```

If an `Endpoint` configuration is not used, omit the name in the `KestrelCommunicationListener` constructor. In this case, a dynamic port will be used. See the next section for more information.

#### Use Kestrel with a dynamic port
Kestrel cannot use the automatic port assignment from the `Endpoint` configuration in ServiceManifest.xml, because automatic port assignment from an `Endpoint` configuration assigns a unique port per *host process*, and a single host process can contain multiple Kestrel instances. Since Kestrel does not support port sharing, this does not work as each Kestrel instance must be opened on a unique port.

To use dynamic port assignment with Kestrel, omit the `Endpoint` configuration in ServiceManifest.xml entirely, and do not pass an endpoint name to the `KestrelCommunicationListener` constructor:

```csharp
new KestrelCommunicationListener(serviceContext, (url, listener) => ...
```

In this configuration, `KestrelCommunicationListener` will automatically select an unused port from the application port range.

## Scenarios and configurations
This section describes the following scenarios and provides the recommended combination of web server, port configuration, Service Fabric integration options, and miscellaneous settings to achieve a properly functioning service:
 - Externally exposed ASP.NET Core stateless service
 - Internal-only ASP.NET Core stateless service
 - Internal-only ASP.NET Core stateful service

An **externally exposed** service is one that exposes an endpoint reachable from outside the cluster, usually through a load balancer.

An **internal-only** service is one whose endpoint is only reachable from within the cluster.

> [!NOTE]
> Stateful service endpoints generally should not be exposed to the Internet. Clusters that are behind load balancers that are unaware of Service Fabric service resolution, such as the Azure Load Balancer, will be unable to expose stateful services because the load balancer will not be able to locate and route traffic to the appropriate stateful service replica. 

### Externally exposed ASP.NET Core stateless services
Kestrel is the recommended web server for front-end services that expose external, Internet-facing HTTP endpoints. On Windows, HttpSys may be used to provide port sharing capability which allows you to host multiple web services on the same set of nodes using the same port, differentiated by hostname or path, without relying on a front-end proxy or gateway to provide HTTP routing.
 
When exposed to the Internet, a stateless service should use a well-known and stable endpoint that is reachable through a load balancer. This is the URL you will provide to users of your application. The following configuration is recommended:

|  |  | **Notes** |
| --- | --- | --- |
| Web server | Kestrel | Kestrel is the preferred web server as it is supported across Windows and Linux. |
| Port configuration | static | A well-known static port should be configured in the `Endpoints` configuration of ServiceManifest.xml, such as 80 for HTTP or 443 for HTTPS. |
| ServiceFabricIntegrationOptions | None | The `ServiceFabricIntegrationOptions.None` option should be used when configuring Service Fabric integration middleware so that the service does not attempt to validate incoming requests for a unique identifier. External users of your application will not know the unique identifying information used by the middleware. |
| Instance Count | -1 | In typical use cases, the instance count setting should be set to "-1" so that an instance is available on all nodes that receive traffic from a load balancer. |

If multiple externally exposed services share the same set of nodes, HttpSys can be used with a unique but stable URL path. This can be accomplished by modifying the URL provided when configuring IWebHost. Note this applies to HttpSys only.

 ```csharp
 new HttpSysCommunicationListener(serviceContext, "ServiceEndpoint", (url, listener) =>
 {
     url += "/MyUniqueServicePath";
 
     return new WebHostBuilder()
         .UseHttpSys()
         ...
         .UseUrls(url)
         .Build();
 })
 ```

### Internal-only stateless ASP.NET Core service
Stateless services that are only called from within the cluster should use unique URLs and dynamically assigned ports to ensure cooperation between multiple services. The following configuration is recommended:

|  |  | **Notes** |
| --- | --- | --- |
| Web server | Kestrel | Although HttpSys may be used for internal stateless services, Kestrel is the recommended server to allow multiple service instances to share a host.  |
| Port configuration | dynamically assigned | Multiple replicas of a stateful service may share a host process or host operating system and thus will need unique ports. |
| ServiceFabricIntegrationOptions | UseUniqueServiceUrl | With dynamic port assignment, this setting prevents the mistaken identity issue described earlier. |
| InstanceCount | any | The instance count setting can be set to any value necessary to operate the service. |

### Internal-only stateful ASP.NET Core service
Stateful services that are only called from within the cluster should use dynamically assigned ports to ensure cooperation between multiple services. The following configuration is recommended:

|  |  | **Notes** |
| --- | --- | --- |
| Web server | Kestrel | The `HttpSysCommunicationListener` is not designed for use by stateful services in which replicas share a host process. |
| Port configuration | dynamically assigned | Multiple replicas of a stateful service may share a host process or host operating system and thus will need unique ports. |
| ServiceFabricIntegrationOptions | UseUniqueServiceUrl | With dynamic port assignment, this setting prevents the mistaken identity issue described earlier. |

## Next steps
[Debug your Service Fabric application by using Visual Studio](service-fabric-debugging-your-application.md)

<!--Image references-->
[0]:./media/service-fabric-reliable-services-communication-aspnetcore/webhost-standalone.png
[1]:./media/service-fabric-reliable-services-communication-aspnetcore/webhost-servicefabric.png
[2]:./media/service-fabric-reliable-services-communication-aspnetcore/integration.png
[3]:./media/service-fabric-reliable-services-communication-aspnetcore/httpsys.png
[4]:./media/service-fabric-reliable-services-communication-aspnetcore/kestrel.png
