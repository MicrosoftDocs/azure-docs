---
title: Service communication with the ASP.NET Core 
description: Learn how to use ASP.NET Core in stateless and stateful Azure Service Fabric Reliable Services applications.
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/11/2022
---

# ASP.NET Core in Azure Service Fabric Reliable Services

ASP.NET Core is an open-source and cross-platform framework. This framework is designed for building cloud-based, internet-connected applications, such as web apps, IoT apps, and mobile back ends.

This article is an in-depth guide to hosting ASP.NET Core services in Service Fabric Reliable Services by using the **Microsoft.ServiceFabric.AspNetCore.** set of NuGet packages.

For an introductory tutorial on ASP.NET Core in Service Fabric and instructions on getting your development environment set up, see [Tutorial: Create and deploy an application with an ASP.NET Core Web API front-end service and a stateful back-end service](service-fabric-tutorial-create-dotnet-app.md).

The rest of this article assumes you're already familiar with ASP.NET Core. If not, please read through the [ASP.NET Core fundamentals](/aspnet/core/fundamentals/index).

## ASP.NET Core in the Service Fabric environment

Both ASP.NET Core and Service Fabric apps can run on .NET Core or full .NET Framework. You can use ASP.NET Core in two different ways in Service Fabric:
 - **Hosted as a guest executable**. This way is primarily used to run existing ASP.NET Core applications on Service Fabric with no code changes.
 - **Run inside a reliable service**. This way allows better integration with the Service Fabric runtime and allows stateful ASP.NET Core services.

The rest of this article explains how to use ASP.NET Core inside a reliable service, through the ASP.NET Core integration components that ship with the Service Fabric SDK.

## Service Fabric service hosting

In Service Fabric, one or more instances and/or replicas of your service run in a *service host process*: an executable file that runs your service code. You, as a service author, own the service host process, and Service Fabric activates and monitors it for you.

Traditional ASP.NET (up to MVC 5) is tightly coupled to IIS through System.Web.dll. ASP.NET Core provides a separation between the web server and your web application. This separation allows web applications to be portable between different web servers. It also allows web servers to be *self-hosted*. This means you can start a web server in your own process, as opposed to a process that's owned by dedicated web server software, such as IIS.

To combine a Service Fabric service and ASP.NET, either as a guest executable or in a reliable service, you must be able to start ASP.NET inside your service host process. ASP.NET Core self-hosting allows you to do this.

## Hosting ASP.NET Core in a reliable service
Typically, self-hosted ASP.NET Core applications create a WebHost in an application's entry point, such as the `static void Main()` method in `Program.cs`. In this case, the life cycle of the WebHost is bound to the life cycle of the process.

![Hosting ASP.NET Core in a process][0]

But the application entry point isn't the right place to create a WebHost in a reliable service. That's because the application entry point is only used to register a service type with the Service Fabric runtime, so that it can create instances of that service type. The WebHost should be created in a reliable service itself. Within the service host process, service instances and/or replicas can go through multiple life cycles. 

A Reliable Service instance is represented by your service class deriving from `StatelessService` or `StatefulService`. The communication stack for a service is contained in an `ICommunicationListener` implementation in your service class. The `Microsoft.ServiceFabric.AspNetCore.*` NuGet packages contain implementations of `ICommunicationListener` that start and manage the ASP.NET Core WebHost for either Kestrel or HTTP.sys in a reliable service.

![Diagram for hosting ASP.NET Core in a reliable service][1]

## ASP.NET Core ICommunicationListeners
The `ICommunicationListener` implementations for Kestrel and HTTP.sys in the  `Microsoft.ServiceFabric.AspNetCore.*` NuGet packages have similar use patterns. But they perform slightly different actions specific to each web server. 

Both communication listeners provide a constructor that takes the following arguments:
 - **`ServiceContext serviceContext`**: This is the `ServiceContext` object that contains information about the running service.
 - **`string endpointName`**: This is the name of an `Endpoint` configuration in ServiceManifest.xml. It's primarily where the two communication listeners differ. HTTP.sys *requires* an `Endpoint` configuration, while Kestrel doesn't.
 - **`Func<string, AspNetCoreCommunicationListener, IWebHost> build`**: This is a lambda that you implement, in which you create and return an `IWebHost`. It allows you to configure `IWebHost` the way you normally would in an ASP.NET Core application. The lambda provides a URL that's generated for you, depending on the Service Fabric integration options you use and the `Endpoint` configuration you provide. You can then modify or use that URL to start the web server.

## Service Fabric integration middleware
The `Microsoft.ServiceFabric.AspNetCore` NuGet package includes the `UseServiceFabricIntegration` extension method on `IWebHostBuilder` that adds Service Fabric–aware middleware. This middleware configures the Kestrel or HTTP.sys `ICommunicationListener` to register a unique service URL with the Service Fabric Naming Service. It then validates client requests to ensure clients are connecting to the right service. 

This step is necessary to prevent clients from mistakenly connecting to the wrong service. That's because, in a shared-host environment such as Service Fabric,  multiple web applications can run on the same physical or virtual machine but don't use unique host names. This scenario is described in more detail in the next section.

### A case of mistaken identity
Service replicas, regardless of protocol, listen on a unique IP:port combination. Once a service replica has started listening on an IP:port endpoint, it reports that endpoint address to the Service Fabric Naming Service. There, clients or other services can discover it. If services use dynamically assigned application ports, a service replica might coincidentally use the same IP:port endpoint of another service previously on the same physical or virtual machine. This can cause a client to mistakenly connect to the wrong service. This scenario can result if the following sequence of events occurs:

 1. Service A listens on 10.0.0.1:30000 over HTTP. 
 2. Client resolves Service A and gets address 10.0.0.1:30000.
 3. Service A moves to a different node.
 4. Service B is placed on 10.0.0.1 and coincidentally uses the same port 30000.
 5. Client attempts to connect to service A with cached address 10.0.0.1:30000.
 6. Client is now successfully connected to service B, not realizing it's connected to the wrong service.

This can cause bugs at random times that can be difficult to diagnose.

### Using unique service URLs
To prevent these bugs, services can post an endpoint to the Naming Service with a unique identifier, and then validate that unique identifier during client requests. This is a cooperative action between services in a non-hostile-tenant trusted environment. It doesn't provide secure service authentication in a hostile-tenant environment.

In a trusted environment, the middleware that's added by the `UseServiceFabricIntegration` method automatically appends a unique identifier to the address posted to the Naming Service. It validates that identifier on each request. If the identifier doesn't match, the middleware immediately returns an HTTP 410 Gone response.

Services that use a dynamically assigned port should make use of this middleware.

Services that use a fixed unique port don't have this problem in a cooperative environment. A fixed unique port is typically used for externally facing services that need a well-known port for client applications to connect to. For example, most internet-facing web applications will use port 80 or 443 for web browser connections. In this case, the unique identifier shouldn't be enabled.

The following diagram shows the request flow with the middleware enabled:

![Service Fabric ASP.NET Core integration][2]

Both Kestrel and HTTP.sys `ICommunicationListener` implementations use this mechanism in exactly the same way. Although HTTP.sys can internally differentiate requests based on unique URL paths by using the underlying **HTTP.sys** port sharing feature, that functionality is *not* used by the HTTP.sys `ICommunicationListener` implementation. That's because it results in HTTP 503 and HTTP 404 error status codes in the scenario described earlier. That in turn makes it difficult for clients to determine the intent of the error, as HTTP 503 and HTTP 404 are commonly used to indicate other errors. 

Thus, both Kestrel and HTTP.sys `ICommunicationListener` implementations standardize on middleware provided by the `UseServiceFabricIntegration` extension method. Therefore, clients only need to perform a service endpoint re-resolve action on HTTP 410 responses.

## HTTP.sys in Reliable Services
You can use HTTP.sys in Reliable Services by importing the **Microsoft.ServiceFabric.AspNetCore.HttpSys** NuGet package. This package contains `HttpSysCommunicationListener`, an implementation of `ICommunicationListener`. `HttpSysCommunicationListener` allows you to create an ASP.NET Core WebHost inside a reliable service by using HTTP.sys as the web server.

HTTP.sys is built on the [Windows HTTP Server API](/windows/win32/http/http-api-start-page). This API uses the **HTTP.sys** kernel driver to process HTTP requests and route them to processes that run web applications. This allows multiple processes on the same physical or virtual machine to host web applications on the same port, disambiguated by either a unique URL path or host name. These features are useful in Service Fabric for hosting multiple websites in the same cluster.

>[!NOTE]
>HTTP.sys implementation works only on the Windows platform.

The following diagram illustrates how HTTP.sys uses the **HTTP.sys** kernel driver on Windows for port sharing:

![HTTP.sys diagram][3]

### HTTP.sys in a stateless service
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

### HTTP.sys in a stateful service

`HttpSysCommunicationListener` isn't currently designed for use in stateful services due to complications with the underlying **HTTP.sys** port sharing feature. For more information, see the following section on dynamic port allocation with HTTP.sys. For stateful services, Kestrel is the suggested web server.

### Endpoint configuration

An `Endpoint` configuration is required for web servers that use the Windows HTTP Server API, including HTTP.sys. Web servers that use the Windows HTTP Server API must first reserve their URL with HTTP.sys (this is normally accomplished with the [netsh](/windows/win32/http/netsh-commands-for-http) tool). 

This action requires elevated privileges that your services don't have by default. The "http" or "https" options for the `Protocol` property of the `Endpoint` configuration in ServiceManifest.xml are used specifically to instruct the Service Fabric runtime to register a URL with HTTP.sys on your behalf. It does this by using the [*strong wildcard*](/windows/win32/http/urlprefix-strings) URL prefix.

For example, to reserve `http://+:80` for a service, use the following configuration in ServiceManifest.xml:

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

#### Use HTTP.sys with a static port
To use a static port with HTTP.sys, provide the port number in the `Endpoint` configuration:

```xml
  <Resources>
    <Endpoints>
      <Endpoint Protocol="http" Name="ServiceEndpoint" Port="80" />
    </Endpoints>
  </Resources>
```

#### Use HTTP.sys with a dynamic port
To use a dynamically assigned port with HTTP.sys, omit the `Port` property in the `Endpoint` configuration:

```xml
  <Resources>
    <Endpoints>
      <Endpoint Protocol="http" Name="ServiceEndpoint" />
    </Endpoints>
  </Resources>
```

A dynamic port allocated by an `Endpoint` configuration provides only one port *per host process*. The current Service Fabric hosting model allows multiple service instances and/or replicas to be hosted in the same process. This means each one will share the same port when allocated through the `Endpoint` configuration. Multiple **HTTP.sys** instances can share a port by using the underlying **HTTP.sys** port sharing feature. But it's not supported by `HttpSysCommunicationListener` due to the complications it introduces for client requests. For dynamic port usage, Kestrel is the suggested web server.

## Kestrel in Reliable Services
You can use Kestrel in Reliable Services by importing the **Microsoft.ServiceFabric.AspNetCore.Kestrel** NuGet package. This package contains `KestrelCommunicationListener`, an implementation of `ICommunicationListener`. `KestrelCommunicationListener` allows you to create an ASP.NET Core WebHost inside a reliable service by using Kestrel as the web server.

Kestrel is a cross-platform web server for ASP.NET Core. Unlike HTTP.sys, Kestrel doesn't use a centralized endpoint manager. Also unlike HTTP.sys, Kestrel doesn't support port sharing between multiple processes. Each instance of Kestrel must use a unique port. For more on Kestrel, see the [Implementation Details](/aspnet/core/fundamentals/servers/kestrel).

![Kestrel diagram][4]

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

In this example, a singleton instance of `IReliableStateManager` is provided to the WebHost dependency injection container. This isn't strictly necessary, but it allows you to use `IReliableStateManager` and Reliable Collections in your MVC controller action methods.

An `Endpoint` configuration name is *not* provided to `KestrelCommunicationListener` in a stateful service. This is explained in more detail in the following section.

### Configure Kestrel to use HTTPS
When enabling HTTPS with Kestrel in your service, you'll need to set several listening options. Update the `ServiceInstanceListener` to use an *EndpointHttps* endpoint and listen on a specific port (such as port 443). When configuring the web host to use the Kestrel web server, you must configure Kestrel to listen for IPv6 addresses on all network interfaces: 

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

For a full example in a tutorial, see [Configure Kestrel to use HTTPS](service-fabric-tutorial-dotnet-app-enable-https-endpoint.md#configure-kestrel-to-use-https).


### Endpoint configuration
An `Endpoint` configuration isn't required to use Kestrel. 

Kestrel is a simple standalone web server. Unlike HTTP.sys (or HttpListener), it doesn't need an `Endpoint` configuration in ServiceManifest.xml because it doesn't require URL registration before starting. 

#### Use Kestrel with a static port
You can configure a static port in the `Endpoint` configuration of ServiceManifest.xml for use with Kestrel. Although this isn't strictly necessary, it offers two potential benefits:
 - If the port doesn't fall in the application port range, it's opened through the OS firewall by Service Fabric.
 - The URL provided to you through `KestrelCommunicationListener` will use this port.

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

If ServiceManifest.xml doesn't use an `Endpoint` configuration, omit the name in the `KestrelCommunicationListener` constructor. In this case, it will use a dynamic port. See the next section for more information about this.

#### Use Kestrel with a dynamic port
Kestrel can't use the automatic port assignment from the `Endpoint` configuration in ServiceManifest.xml. That's because automatic port assignment from an `Endpoint` configuration assigns a unique port per *host process*, and a single host process can contain multiple Kestrel instances. This doesn't work with Kestrel because it doesn't support port sharing. Therefore, each Kestrel instance must be opened on a unique port.

To use dynamic port assignment with Kestrel, omit the `Endpoint` configuration in ServiceManifest.xml entirely, and don't pass an endpoint name to the `KestrelCommunicationListener` constructor, as follows:

```csharp
new KestrelCommunicationListener(serviceContext, (url, listener) => ...
```

In this configuration, `KestrelCommunicationListener` will automatically select an unused port from the application port range.

For HTTPS, it should have the Endpoint configured with HTTPS protocol without a port specified in ServiceManifest.xml and pass the endpoint name to KestrelCommunicationListener constructor.


## IHost and Minimal Hosting integration
In addition to IWebHost/IWebHostBuilder, `KestrelCommunicationListener` and `HttpSysCommunicationListener` support building ASP.NET Core services using IHost/IHostBuilder.
This is available starting v5.2.1363 of `Microsoft.ServiceFabric.AspNetCore.Kestrel` and `Microsoft.ServiceFabric.AspNetCore.HttpSys` packages.

```csharp
// Stateless Service
protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
{
    return new ServiceInstanceListener[]
    {
        new ServiceInstanceListener(serviceContext =>
            new KestrelCommunicationListener(serviceContext, "ServiceEndpoint", (url, listener) =>
            {
                return Host.CreateDefaultBuilder()
                        .ConfigureWebHostDefaults(webBuilder =>
                        {
                            webBuilder.UseKestrel()
                                .UseStartup<Startup>()
                                .UseServiceFabricIntegration(listener, ServiceFabricIntegrationOptions.None)
                                .UseContentRoot(Directory.GetCurrentDirectory())
                                .UseUrls(url);
                        })
                        .ConfigureServices(services => services.AddSingleton<StatelessServiceContext>(serviceContext))
                        .Build();
            }))
    };
}

```

```csharp
// Stateful Service
protected override IEnumerable<ServiceReplicaListener> CreateServiceReplicaListeners()
{
    return new ServiceReplicaListener[]
    {
        new ServiceReplicaListener(serviceContext =>
            new KestrelCommunicationListener(serviceContext, "ServiceEndpoint", (url, listener) =>
            {
                return Host.CreateDefaultBuilder()
                        .ConfigureWebHostDefaults(webBuilder =>
                        {
                            webBuilder.UseKestrel()
                                .UseStartup<Startup>()
                                .UseServiceFabricIntegration(listener, ServiceFabricIntegrationOptions.UseUniqueServiceUrl)
                                .UseContentRoot(Directory.GetCurrentDirectory())
                                .UseUrls(url);
                        })
                        .ConfigureServices(services =>
                        {
                            services.AddSingleton<StatefulServiceContext>(serviceContext);
                            services.AddSingleton<IReliableStateManager>(this.StateManager);
                        })
                        .Build();
            }))
    };
}
```


>[!NOTE]
> As KestrelCommunicationListener and HttpSysCommunicationListener are meant for web services, it is required to register/configure a web server (using [ConfigureWebHostDefaults](/dotnet/api/microsoft.extensions.hosting.generichostbuilderextensions.configurewebhostdefaults) or [ConfigureWebHost](/dotnet/api/microsoft.extensions.hosting.generichostwebhostbuilderextensions.configurewebhost) method) over the IHost


ASP.NET 6 introduced the Minimal Hosting model which is a more simplified and streamlined way of creating web applications. Minimal hosting model can also be used with KestrelCommunicationListener and HttpSysCommunicationListener.

```csharp
// Stateless Service
protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
{
    return new ServiceInstanceListener[]
    {
        new ServiceInstanceListener(serviceContext =>
            new KestrelCommunicationListener(serviceContext, "ServiceEndpoint", (url, listener) =>
            {
                var builder = WebApplication.CreateBuilder();

                builder.Services.AddSingleton<StatelessServiceContext>(serviceContext);
                builder.WebHost
                            .UseKestrel()
                            .UseContentRoot(Directory.GetCurrentDirectory())
                            .UseServiceFabricIntegration(listener, ServiceFabricIntegrationOptions.None)
                            .UseUrls(url);

                builder.Services.AddControllersWithViews();

                var app = builder.Build();

                if (!app.Environment.IsDevelopment())
                {
                    app.UseExceptionHandler("/Home/Error");
                }

                app.UseHttpsRedirection();
                app.UseStaticFiles();
                app.UseRouting();
                app.UseAuthorization();
                app.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");

                return app;
            }))
    };
}
```

```csharp
// Stateful Service
protected override IEnumerable<ServiceReplicaListener> CreateServiceReplicaListeners()
{
    return new ServiceReplicaListener[]
    {
        new ServiceReplicaListener(serviceContext =>
            new KestrelCommunicationListener(serviceContext, "ServiceEndpoint", (url, listener) =>
            {
                var builder = WebApplication.CreateBuilder();

                builder.Services
                            .AddSingleton<StatefulServiceContext>(serviceContext)
                            .AddSingleton<IReliableStateManager>(this.StateManager);
                builder.WebHost
                            .UseKestrel()
                            .UseContentRoot(Directory.GetCurrentDirectory())
                            .UseServiceFabricIntegration(listener, ServiceFabricIntegrationOptions.UseUniqueServiceUrl)
                            .UseUrls(url);

                builder.Services.AddControllersWithViews();

                var app = builder.Build();

                if (!app.Environment.IsDevelopment())
                {
                    app.UseExceptionHandler("/Home/Error");
                }
                app.UseStaticFiles();
                app.UseRouting();
                app.UseAuthorization();
                app.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");

                return app;
            }))
    };
}
```


## Service Fabric configuration provider
App configuration in ASP.NET Core is based on key-value pairs established by the configuration provider. Read [Configuration in ASP.NET Core](/aspnet/core/fundamentals/configuration/) to understand more on general ASP.NET Core configuration support.

This section describes how the Service Fabric configuration provider integrates with ASP.NET Core configuration by importing the `Microsoft.ServiceFabric.AspNetCore.Configuration` NuGet package.

### AddServiceFabricConfiguration startup extensions
After you import the `Microsoft.ServiceFabric.AspNetCore.Configuration` NuGet package, you need to register the Service Fabric Configuration source with ASP.NET Core configuration API. You do this by checking **AddServiceFabricConfiguration** extensions in the `Microsoft.ServiceFabric.AspNetCore.Configuration` namespace against `IConfigurationBuilder`.

```csharp
using Microsoft.ServiceFabric.AspNetCore.Configuration;

public Startup(IHostingEnvironment env)
{
    var builder = new ConfigurationBuilder()
        .SetBasePath(env.ContentRootPath)
        .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
        .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
        .AddServiceFabricConfiguration() // Add Service Fabric configuration settings.
        .AddEnvironmentVariables();
    Configuration = builder.Build();
}

public IConfigurationRoot Configuration { get; }
```

Now the ASP.NET Core service can access the Service Fabric configuration settings, just like any other application settings. For example, you can use the options pattern to load settings into strongly typed objects.

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.Configure<MyOptions>(Configuration);  // Strongly typed configuration object.
    services.AddMvc();
}
```
### Default key mapping
By default, the Service Fabric configuration provider includes the package name, section name, and property name. Together, these form the ASP.NET Core configuration key, as follows:
```csharp
$"{this.PackageName}{ConfigurationPath.KeyDelimiter}{section.Name}{ConfigurationPath.KeyDelimiter}{property.Name}"
```

For example, if you have a configuration package named `MyConfigPackage` with the following content, then the configuration value will be available on ASP.NET Core `IConfiguration` through *MyConfigPackage:MyConfigSection:MyParameter*.
```xml
<?xml version="1.0" encoding="utf-8" ?>
<Settings xmlns:xsd="https://www.w3.org/2001/XMLSchema" xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.microsoft.com/2011/01/fabric">  
  <Section Name="MyConfigSection">
    <Parameter Name="MyParameter" Value="Value1" />
  </Section>  
</Settings>
```
### Service Fabric configuration options
The Service Fabric configuration provider also supports `ServiceFabricConfigurationOptions` to change the default behavior of key mapping.

#### Encrypted settings
Service Fabric supports encrypted settings, as does the Service Fabric configuration provider. The encrypted settings aren't decrypted to ASP.NET Core `IConfiguration` by default. The encrypted values are stored there instead. But if you want to decrypt the value to store in ASP.NET Core IConfiguration, you can set the *DecryptValue* flag to false in the `AddServiceFabricConfiguration` extension, as follows:

```csharp
public Startup()
{
    ICodePackageActivationContext activationContext = FabricRuntime.GetActivationContext();
    var builder = new ConfigurationBuilder()        
        .AddServiceFabricConfiguration(activationContext, (options) => options.DecryptValue = false); // set flag to decrypt the value
    Configuration = builder.Build();
}
```
#### Multiple configuration packages
Service Fabric supports multiple configuration packages. By default, the package name is included in the configuration key. But you can set the `IncludePackageName` flag to false, as follows:
```csharp
public Startup()
{
    ICodePackageActivationContext activationContext = FabricRuntime.GetActivationContext();
    var builder = new ConfigurationBuilder()        
        // exclude package name from key.
        .AddServiceFabricConfiguration(activationContext, (options) => options.IncludePackageName = false); 
    Configuration = builder.Build();
}
```
#### Custom key mapping, value extraction, and data population
The Service Fabric configuration provider also supports more advanced scenarios to customize the key mapping with `ExtractKeyFunc` and custom-extract the values with `ExtractValueFunc`. You can even change the whole process of populating data from Service Fabric configuration to ASP.NET Core configuration by using `ConfigAction`.

The following examples illustrate how to use `ConfigAction` to customize data population:
```csharp
public Startup()
{
    ICodePackageActivationContext activationContext = FabricRuntime.GetActivationContext();
    
    this.valueCount = 0;
    this.sectionCount = 0;
    var builder = new ConfigurationBuilder();
    builder.AddServiceFabricConfiguration(activationContext, (options) =>
        {
            options.ConfigAction = (package, configData) =>
            {
                ILogger logger = new ConsoleLogger("Test", null, false);
                logger.LogInformation($"Config Update for package {package.Path} started");

                foreach (var section in package.Settings.Sections)
                {
                    this.sectionCount++;

                    foreach (var param in section.Parameters)
                    {
                        configData[options.ExtractKeyFunc(section, param)] = options.ExtractValueFunc(section, param);
                        this.valueCount++;
                    }
                }

                logger.LogInformation($"Config Update for package {package.Path} finished");
            };
        });
  Configuration = builder.Build();
}
```

### Configuration updates
The Service Fabric configuration provider also supports configuration updates. You can use ASP.NET Core `IOptionsMonitor` to receive change notifications, and then use `IOptionsSnapshot` to reload configuration data. For more information, see [ASP.NET Core options](/aspnet/core/fundamentals/configuration/options).

These options are supported by default. No further coding is needed to enable configuration updates.

## Scenarios and configurations
This section provides the combination of web server, port configuration, Service Fabric integration options, and miscellaneous settings we recommend to troubleshoot the following scenarios:
 - Externally exposed ASP.NET Core stateless services
 - Internal-only ASP.NET Core stateless services
 - Internal-only ASP.NET Core stateful services

An **externally exposed service** is one that exposes an endpoint that's called from outside the cluster, usually through a load balancer.

An **internal-only** service is one whose endpoint is only called from within the cluster.

> [!NOTE]
> Stateful service endpoints generally shouldn't be exposed to the internet. Clusters behind load balancers that are unaware of Service Fabric service resolution, such as Azure Load Balancer, will be unable to expose stateful services. That's because the load balancer won't be able to locate and route traffic to the appropriate stateful service replica. 

### Externally exposed ASP.NET Core stateless services
Kestrel is the suggested web server for front-end services that expose external, internet-facing HTTP endpoints. On Windows, HTTP.sys can provide port sharing capability, which allows you to host multiple web services on the same set of nodes using the same port. In this scenario, the web services are differentiated by host name or path, without relying on a front-end proxy or gateway to provide HTTP routing.
 
When exposed to the internet, a stateless service should use a well-known and stable endpoint that's reachable through a load balancer. You'll provide this URL to your application's users. We recommend the following configuration:

| Type | Recommendation | Notes |
| ---- | -------------- | ----- |
| Web server | Kestrel | Kestrel is the preferred web server, as it's supported across Windows and Linux. |
| Port configuration | static | A well-known static port should be configured in the `Endpoints` configuration of ServiceManifest.xml, such as 80 for HTTP or 443 for HTTPS. |
| ServiceFabricIntegrationOptions | None | Use the `ServiceFabricIntegrationOptions.None` option when configuring Service Fabric integration middleware, so that the service doesn't attempt to validate incoming requests for a unique identifier. External users of your application won't know the unique identifying information that the middleware uses. |
| Instance Count | -1 | In typical use cases, the instance count setting should be set to *-1*. This is done so that an instance is available on all nodes that receive traffic from a load balancer. |

If multiple externally exposed services share the same set of nodes, you can use HTTP.sys with a unique but stable URL path. You can accomplish this by modifying the URL provided when configuring IWebHost. Note that this applies to HTTP.sys only.

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
Stateless services that are only called from within the cluster should use unique URLs and dynamically assigned ports to ensure cooperation between multiple services. We recommend the following configuration:

| Type | Recommendation | Notes |
| ---- | -------------- | ----- |
| Web server | Kestrel | Although you can use HTTP.sys for internal stateless services, Kestrel is the best server to allow multiple service instances to share a host.  |
| Port configuration | dynamically assigned | Multiple replicas of a stateful service might share a host process or host operating system and thus will need unique ports. |
| ServiceFabricIntegrationOptions | UseUniqueServiceUrl | With dynamic port assignment, this setting prevents the mistaken identity issue described earlier. |
| InstanceCount | any | The instance count setting can be set to any value necessary to operate the service. |

### Internal-only stateful ASP.NET Core service
Stateful services that are only called from within the cluster should use dynamically assigned ports to ensure cooperation between multiple services. We recommend the following configuration:

| Type | Recommendation | Notes |
| ---- | -------------- | ----- |
| Web server | Kestrel | The `HttpSysCommunicationListener` isn't designed for use by stateful services in which replicas share a host process. |
| Port configuration | dynamically assigned | Multiple replicas of a stateful service might share a host process or host operating system and thus will need unique ports. |
| ServiceFabricIntegrationOptions | UseUniqueServiceUrl | With dynamic port assignment, this setting prevents the mistaken identity issue described earlier. |

## Next steps
[Debug your Service Fabric application by using Visual Studio](service-fabric-debugging-your-application.md)


<!--Image references-->
[0]:./media/service-fabric-reliable-services-communication-aspnetcore/webhost-standalone.png
[1]:./media/service-fabric-reliable-services-communication-aspnetcore/webhost-servicefabric.png
[2]:./media/service-fabric-reliable-services-communication-aspnetcore/integration.png
[3]:./media/service-fabric-reliable-services-communication-aspnetcore/httpsys.png
[4]:./media/service-fabric-reliable-services-communication-aspnetcore/kestrel.png
