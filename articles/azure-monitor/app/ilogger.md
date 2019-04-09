---
title: Explore .NET trace logs in Azure Application Insights with ILogger
description: Samples of using the Azure Application Insights ILogger implementation with ASP.NET Core and Console applications.
services: application-insights
author: cijothomas
manager: carmonm
ms.service: application-insights
ms.topic: conceptual
ms.date: 02/19/2019
ms.reviewer: mbullwin
ms.author: cithomas
---

# ILogger

ASP.NET Core supports a logging API that works with a variety of built-in and third-party logging providers. This article shows how to handle logging with the Application Insights ILogger implementation in both console and ASP.NET Core applications. To learn more about ILogger based logging, see [this article](https://docs.microsoft.com/aspnet/core/fundamentals/logging).

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
    }
}
```

## ASP.NET Core application

Following shows a sample ASP.NET Core Application configured to send ILogger traces to application insights. This example can be
followed to send ILogger traces from Program.cs, Startup.cs, or any other Contoller/Application Logic.

```csharp
public class Program
{
    public static void Main(string[] args)
    {
        var host = BuildWebHost(args);
        var logger = host.Services.GetRequiredService<ILogger<Program>>();
        logger.LogInformation("From Program. Running the host now.."); // This will be picked up up by AI
        host.Run();
    }

    public static IWebHost BuildWebHost(string[] args) =>
        WebHost.CreateDefaultBuilder(args)
        .UseStartup<Startup>()                
        .ConfigureLogging(logging =>
        {                
	    logging.AddApplicationInsights("ikeyhere");
				
	    // Optional: Apply filters to configure LogLevel Trace or above is sent to
	    // ApplicationInsights for all categories.
            logging.AddFilter<ApplicationInsightsLoggerProvider>("", LogLevel.Trace);
				
            // Additional filtering For category starting in "Microsoft",
	    // only Warning or above will be sent to Application Insights.
	    logging.AddFilter<ApplicationInsightsLoggerProvider>("Microsoft", LogLevel.Warning);
        })
        .Build();
}
```

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
	
	// The following be picked up up by Application Insights.
        _logger.LogInformation("From ConfigureServices. Services.AddMVC invoked"); 
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IHostingEnvironment env)
    {
        if (env.IsDevelopment())
        {
	    // The following be picked up up by Application Insights.	
            _logger.LogInformation("Configuring for Development environment");
            app.UseDeveloperExceptionPage();
        }
        else
        {
            // The following be picked up up by Application Insights.
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
        // All the following logs will be picked upby Application Insights.
	// and all have ("MyKey", "MyValue") in Properties.
	using (_logger.BeginScope(new Dictionary<string, object> { { "MyKey", "MyValue" } }))
        {			
	    _logger.LogInformation("An example of a Information trace..");
	    _logger.LogWarning("An example of a Warning trace..");
	    _logger.LogTrace("An example of a Trace level message");
        }

        return new string[] { "value1", "value2" };
    }
}
```

In both the examples above, the standalone package Microsoft.Extensions.Logging.ApplicationInsights is used. By default, this configuration uses the bare minimum `TelemetryConfiguration` for sending data to
Application Insights. Bare minimum means the channel used will be `InMemoryChannel`, no sampling, and no standard TelemetryInitializers. This behavior can be overridden for a console application
as shown in example below.

Install this additional package:

```xml
<PackageReference Include="Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel" Version="2.9.1" />
```

The following section shows how to override the default `TelemetryConfiguration`. This example configures `ServerTelemetryChannel`, sampling, and a custom `ITelemetryInitializer`.

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
```

While the above approach can be used in an ASP.NET Core application, a more common approach would be to combine regular application monitoring (Requests, Dependencies etc.) with ILogger capture as shown below.

Install this additional package:

```xml
<PackageReference Include="Microsoft.ApplicationInsights.AspNetCore" Version="2.6.1" />
```

Add the following to the `ConfigureServices` method. This code will enable regular application monitoring with default configuration (ServerTelemetryChannel, LiveMetrics, Request/Dependencies, Correlation etc.)

```csharp
services.AddApplicationInsightsTelemetry("ikeyhere");
```

In this example, the configuration used by `ApplicationInsightsLoggerProvider` is the same as used by regular application monitoring. Therefore both `ILogger` traces and other telemetry (Requests, Dependencies etc.) will be running the same set of `TelemetryInitializers`, `TelemetryProcessors`, and `TelemetryChannel`. They will be correlated and sampled/not sampled in the same way.

However, there is an exception to this behavior. The default `TelemetryConfiguration` is not fully set up when logging something from `Program.cs` or `Startup.cs` itself, so those logs will not have the default configuration. However, every other log (for example, logs from Controllers, Models etc.) would share the configuration.

## Control logging level

Apart from filtering logs on code as in the examples above, it is also possible to control the level of logging Application Insights captures, by modifying the `appsettings.json`. The [ASP.NET logging fundamentals documentation](https://docs.microsoft.com/aspnet/core/fundamentals/logging/?view=aspnetcore-2.2#log-filtering) shows how to achieve this. Specifically for Application Insights, the name of the provider alias is `ApplicationInsights`, as shown in the below example which configures `ApplicationInsights` to capture only logs of `Warning` and above from all categories.

```json
{
  "Logging": {
    "ApplicationInsights": {
      "LogLevel": {
        "Default": "Warning"
      }
    },
    "LogLevel": {
      "Default": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

## Next steps

Learn more about:

- [ILogger based logging](https://docs.microsoft.com/aspnet/core/fundamentals/logging)
- [.NET trace logs](../../azure-monitor/app/asp-net-trace-logs.md)
