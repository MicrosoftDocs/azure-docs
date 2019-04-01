---
title: Configure ApplicationInsights Provider for .NET Core ILogger logs
description: Samples of using the Azure Application Insights ILogger provider with ASP.NET Core and Console applications.
services: application-insights
author: cijothomas
manager: carmonm
ms.service: application-insights
ms.topic: conceptual
ms.date: 02/19/2019
ms.reviewer: mbullwin
ms.author: cithomas
---

# ApplicationInsightsLoggerProvider for .NET Core ILogger logs.

ASP.NET Core supports a logging API that works with a variety of built-in and third-party logging providers. This article shows how to use ApplicationInsightsLoggerProvider to capture logs logged via ILogger in both console and ASP.NET Core applications. This article also talks about how ApplicationInsightsLoggerProvider is integrated with other telemetry collection (Requests, Dependencies etc.) features provided by Application Insights SDK. 
To learn more about ILogger based logging, see [this article](https://docs.microsoft.com/aspnet/core/fundamentals/logging).

## ASP.NET Core applications
Starting with Microsoft.ApplicationInsights.AspNet SDK version 2.7.0-beta3 onwards, ApplicationInsightsLoggerProvider is enabled by default when enabling regular ApplicationInsights monitoring using either of the standard methods - by calling `UseApplicationInsights` extension method on IWebHostBuilder or `AddApplicationInsightsTelemetry` extension method on IServiceCollection. All ILoggers logs of severity Warning or above is sent as `TraceTelemetry` to ApplicationInsights, and they are subject to same configuration as any other telemetry collected. i.e they will be running the same set of `TelemetryInitializers`, `TelemetryProcessors`, uses the same `TelemetryChannel` and will be correlated, sampled/not sampled in the same way as every other telemetry.  If you are on this version of SDK or higher, then no action is required to capture ILoggers logs. 
By default, only ILogger logs of Warning level or above (from all categories) are sent to ApplicationInsightsLoggerProvider. This behavior can be changed by applying Filters as shown [here](../../azure-monitor/app/ilogger.md#control-logging-level).


If you are using an earlier version of Microsoft.ApplicationInsights.AspNet SDK, or you want to just use ApplicationInsightsLoggerProvider, without any other ApplicationInsights monitoring, continue to the steps below.

1. Install the nuget packages below. 

```xml
<ItemGroup>
  <PackageReference Include="Microsoft.Extensions.DependencyInjection" Version="2.1.0" />
  <PackageReference Include="Microsoft.Extensions.Logging" Version="2.1.0" />
  <PackageReference Include="Microsoft.Extensions.Logging.ApplicationInsights" Version="2.9.1" />  
</ItemGroup>
```

2. Modify Program.cs as below

```csharp
    using Microsoft.AspNetCore;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.Logging;

    public class Program
    {
        public static void Main(string[] args)
        {
            CreateWebHostBuilder(args).Build().Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .ConfigureLogging(
                    builder =>
                        {
                            // providing an ikey here is required if you are using standalone package Microsoft.Extensions.Logging.ApplicationInsights.                            
                            builder.AddApplicationInsights("ikey");                           

                            // Optional: Apply filters to control what logs are sent to ApplicationInsights.
                            // The following configures LogLevel Information or above to be sent to ApplicationInsights for all categories.
                            builder.AddFilter<ApplicationInsightsLoggerProvider>("", LogLevel.Information);
                        }
                    );
    }
```

The above code will configure ApplicationInsightsProvider. Following shows example Startup and Controller classes which uses ILogger to send logs, which are captured by ApplicationInsights.

```csharp
public class Startup
{
    private readonly ILogger _logger;

    public Startup(IConfiguration configuration, ILogger<Startup> logger)
    {
        Configuration = configuration;
        _logger = logger;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

        // The following will be picked up by Application Insights.
        _logger.LogInformation("From ConfigureServices. Services.AddMVC invoked"); 
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IHostingEnvironment env)
    {
        if (env.IsDevelopment())
        {
        // The following will be picked up by Application Insights.
            _logger.LogInformation("Configuring for Development environment");
            app.UseDeveloperExceptionPage();
        }
        else
        {
            // The following will be picked up by Application Insights.
            _logger.LogInformation("Configuring for Production environment");
        }

        app.UseMvc();
    }
}
```

```csharp
public class ValuesController : ControllerBase
{
    private readonly ILogger _logger;

    public ValuesController(ILogger<ValuesController> logger)
    {
        _logger = logger;
    }

    // GET api/values
    [HttpGet]
    public ActionResult<IEnumerable<string>> Get()
    {
        // All the following logs will be picked up by Application Insights.
        // and all have ("MyKey", "MyValue") in Properties.
        using (_logger.BeginScope(new Dictionary<string, object> { { "MyKey", "MyValue" } }))
            {            
            _logger.LogWarning("An example of a Warning trace..");
            _logger.LogError("An example of an Error level message");
            }
        return new string[] { "value1", "value2" };
    }
}
```

## Migrating from old ApplicationInsightsLoggerProvider
Microsoft.ApplicationInsights.AspNet SDK versions before 2.7.0-beta2, supported a logging provider which is now obsolete. This provider was enabled with AddApplicationInsights() extension method of ILoggerFactory. This provider is now obsolete, and users are suggested to migrate to the new provider. Migration involves two steps.
1. Remove ILoggerFactory.AddApplicationInsights() call from Startup.Configure method to avoid double logging.
2. Re-apply any filtering rules as old filtering will not be respected by the new provider. Overloads of ILoggerFactory.AddApplicationInsights() took minimum LogLevel or filter functions. With the new provider, filtering is part of the logging framework itself, and not done by ApplicationInsights provider. So any filter functions provided should be removed, and filtering should be done outside of Application Insights. Please see [this](../../azure-monitor/app/ilogger.md#control-logging-level) section for details on how to do filtering.

## Console application

The following shows a sample Console application configured to send ILogger traces to Application Insights.

Packages installed:

```xml
<ItemGroup>
  <PackageReference Include="Microsoft.Extensions.DependencyInjection" Version="2.1.0" />
  <PackageReference Include="Microsoft.Extensions.Logging" Version="2.1.0" />
  <PackageReference Include="Microsoft.Extensions.Logging.ApplicationInsights" Version="2.9.1" />
  <PackageReference Include="Microsoft.Extensions.Logging.Console" Version="2.1.0" />
</ItemGroup>
```

```csharp
class Program
{
    static void Main(string[] args)
    {
        // Create DI container.
        IServiceCollection services = new ServiceCollection();

        // Channel is explicitly configured to do flush on it later.
        var channel = new InMemoryChannel();
        services.Configure<TelemetryConfiguration>(
            (config) =>
            {
                config.TelemetryChannel = channel;
            }
        );

        // Add the logging pipelines to use. We are using Application Insights only here.
        services.AddLogging(loggingBuilder =>
        {
            // Optional: Apply filters to configure LogLevel Trace or above is sent to ApplicationInsights for all
            // categories.
            loggingBuilder.AddFilter<ApplicationInsightsLoggerProvider>("", LogLevel.Trace);
            loggingBuilder.AddApplicationInsights("--YourAIKeyHere--");                
        });

        // Build ServiceProvider.
        IServiceProvider serviceProvider = services.BuildServiceProvider();

        ILogger<Program> logger = serviceProvider.GetRequiredService<ILogger<Program>>();

        // Begin a new scope. This is optional. Epecially in case of AspNetCore request info is already
        // present in scope.
        using (logger.BeginScope(new Dictionary<string, object> { { "Method", nameof(Main) } }))
        {
            logger.LogInformation("Logger is working"); // this will be captured by Application Insights.
        }

        // Explicitly call Flush() followed by sleep is required in Console Apps.
        // This is to ensure that even if application terminates, telemetry is sent to the back-end.
        channel.Flush();
        Thread.Sleep(1000);
    }
}
```

In the above example, the standalone package Microsoft.Extensions.Logging.ApplicationInsights is used. By default, this configuration uses the bare minimum `TelemetryConfiguration` for sending data to
Application Insights. Bare minimum means the channel used will be `InMemoryChannel`, no sampling, and no standard TelemetryInitializers. This behavior can be overridden for a console application
as shown in example below.

Install this additional package:

```xml
<PackageReference Include="Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel" Version="2.9.1" />
```

The following section shows how to override the default `TelemetryConfiguration`. `TelemetryConfiguration` can be configured using services.Configure<TelemetryConfiguration>() method as shown in the following example. This example sets up `ServerTelemetryChannel`, sampling, and adds a custom `ITelemetryInitializer` to the `TelemetryConfiguration`.

```csharp
    // Create DI container.
    IServiceCollection services = new ServiceCollection();
    var serverChannel = new ServerTelemetryChannel();
    services.Configure<TelemetryConfiguration>(
        (config) =>
        {
            config.TelemetryChannel = serverChannel;
            config.TelemetryInitializers.Add(new MyTelemetryInitalizer());
            config.DefaultTelemetrySink.TelemetryProcessorChainBuilder.UseSampling(5);
            serverChannel.Initialize(config);
        }
    );

    // Add the logging pipelines to use. We are adding ApplicationInsights only.
    services.AddLogging(loggingBuilder =>
    {
        loggingBuilder.AddApplicationInsights();
    });

    ........
    ........

    // Explicitly call Flush() followed by sleep is required in Console Apps.
    // This is to ensure that even if application terminates, telemetry is sent to the back-end.
    serverChannel.Flush();
    Thread.Sleep(1000);
```


## Control logging level

The Asp.Net Core ILogger infra has built-in mechanism to apply [filtering](https://docs.microsoft.com/aspnet/core/fundamentals/logging/?view=aspnetcore-2.2#log-filtering) of logs, which allows users to control the logs sent to each registered providers, including ApplicationInsights provider. This can be done either in configuration(typically using appsettings.json file) or in code. This facility is provided by the framework itself, and is not specific to Application Insights provider.

Examples of applying the filter rules to ApplicationInsightsLoggerProvider is given below.

# Filtering Using Configuration in appsettings.json

For ApplicationInsightsLoggerProvider, the provider alias is `ApplicationInsights`. The below shown section in appsettings.json configures `ApplicationInsights` to capture only logs of `Warning` and above from all categories, `Error` of above from categories starting with 'Microsoft'.

```json
{
  "Logging": {
    "ApplicationInsights": {
      "LogLevel": {
        "Default": "Warning",
        "Microsoft": "Error"
      }
    },
    "LogLevel": {
      "Default": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

# Filtering in code.

The below code configures `ApplicationInsights` to capture only logs of `Warning` and above from all categories, `Error` of above from categories starting with 'Microsoft'.
```csharp
    WebHost.CreateDefaultBuilder(args)
    .UseStartup<Startup>()
    .ConfigureLogging(logging =>
        logging.AddFilter<Microsoft.Extensions.Logging.ApplicationInsights.ApplicationInsightsLoggerProvider>("", LogLevel.Warning)
               .AddFilter<Microsoft.Extensions.Logging.ApplicationInsights.ApplicationInsightsLoggerProvider>("Microsoft", LogLevel.Error);
```


## Frequently Asked Questions

*I am seeing some ILogger logs are shown twice in Application Insights?*

* This is possible if you have the older (now obsolete) version of `ApplicationInsightsLoggerProvider` enabled by calling `AddApplicationInsights` on `ILoggerFactory`. Check if your `Configure` method has
  the following, and remove it.

   ```csharp
    public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
    {
        loggerFactory.AddApplicationInsights(app.ApplicationServices, LogLevel.Warning);
        // ..other code.
    }
   ```

* If you are experiencing double logging when debugging from Visual Studio, then modify the code used to enable ApplicationInsights as follows, by setting `EnableDebugLogger` to be false. This is only relevant when debugging the application.

   ```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        ApplicationInsightsServiceOptions options = new ApplicationInsightsServiceOptions();
        options.EnableDebugLogger = false;
        services.AddApplicationInsightsTelemetry(options);
        // ..other code.
    }
   ```

*I am seeing some ILogger logs are not having same properties as others?*

* ApplicationInsights captures ILogger logs and sends them as `TraceTelemetry` using the same `TelemetryConfiguration` used for every other telemetry. There is an exception to this rule. The default `TelemetryConfiguration` is not fully set up when logging something from `Program.cs` or `Startup.cs` itself, so those logs will not have the default configuration, and hence will not be running all the TelemetryInitializers,Telemetry


## Next steps

Learn more about:

- [ILogger based logging](https://docs.microsoft.com/aspnet/core/fundamentals/logging)
- [.NET trace logs](../../azure-monitor/app/asp-net-trace-logs.md)
