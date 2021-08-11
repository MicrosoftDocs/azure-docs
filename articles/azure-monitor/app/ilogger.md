---
title: Application Insights logging with .NET
description: Learn how to use Application Insights with the ILogger interface in .NET.
ms.topic: conceptual
ms.date: 05/20/2021
ms.reviewer: mbullwin
---

# Application Insights logging with .NET

In this article, you'll learn how to capture logs with Application Insights in .NET apps by using several NuGet packages:

- **Core package:**
  - [`Microsoft.Extensions.Logging.ApplicationInsights`][nuget-ai]
- **Workload packages:**
  - [`Microsoft.ApplicationInsights.AspNetCore`][nuget-ai-anc]
  - [`Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel`][nuget-ai-ws-tc]

[nuget-ai]: https://www.nuget.org/packages/Microsoft.Extensions.Logging.ApplicationInsights
[nuget-ai-anc]: https://www.nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore
[nuget-ai-ws]: https://www.nuget.org/packages/Microsoft.ApplicationInsights.WorkerService
[nuget-ai-ws-tc]: https://www.nuget.org/packages/Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel

> [!TIP]
> The [`Microsoft.ApplicationInsights.WorkerService`][nuget-ai-ws] NuGet package is beyond the scope of this article. It can be used to enable Application Insights for background services. For more information, see [Application Insights for Worker Service apps](./worker-service.md).

Depending on the Application Insights logging package that you use, there will be various ways to register `ApplicationInsightsLoggerProvider`. `ApplicationInsightsLoggerProvider` is an implementation of <xref:Microsoft.Extensions.Logging.ILoggerProvider>, which is responsible for providing <xref:Microsoft.Extensions.Logging.ILogger> and <xref:Microsoft.Extensions.Logging.ILogger%601> implementations.

## ASP.NET Core applications

To add Application Insights telemetry to ASP.NET Core applications, use the `Microsoft.ApplicationInsights.AspNetCore` NuGet package. You can configure this through [Visual Studio as a connected service](/visualstudio/azure/azure-app-insights-add-connected-service), or manually.

By default, ASP.NET Core applications have an Application Insights logging provider registered when they're configured through the [code](./asp-net-core.md) or [codeless](./azure-web-apps.md?tabs=netcore#enable-agent-based-monitoring) approach. The registered provider is configured to automatically capture log events with a severity of <xref:Microsoft.Extensions.Logging.LogLevel.Warning?displayProperty=nameWithType> or greater. You can customize severity and categories. For more information, see [Logging level](#logging-level).

1. Ensure that the NuGet package is installed:

   ```xml
    <ItemGroup>
        <PackageReference Include="Microsoft.ApplicationInsights.AspNetCore" Version="2.17.0" />
    </ItemGroup>
   ```

1. Ensure that the `Startup.ConfigureServices` method calls `services.AddApplicationInsightsTelemetry`:

    ```csharp
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Http;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Hosting;
    using Microsoft.Extensions.Configuration;
    
    namespace WebApplication
    {
        public class Startup
        {
            public Startup(IConfiguration configuration)
            {
                Configuration = configuration;
            }

            public IConfiguration Configuration { get; }

            public void ConfigureServices(IServiceCollection services)
            {
                services.AddApplicationInsightsTelemetry(
                    Configuration["APPINSIGHTS_CONNECTIONSTRING"]);

                // An alternative overload, when not using appsettings.json or user secrets.
                // services.AddApplicationInsightsTelemetry();
            }

            public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
            {
                // omitted for brevity
            }
        }
    }
    ```

With the NuGet package installed, and the provider being registered with dependency injection, the app is ready to log. With constructor injection, either <xref:Microsoft.Extensions.Logging.ILogger> or the generic-type alternative <xref:Microsoft.Extensions.Logging.ILogger%601> is required. When these implementations are resolved, `ApplicationInsightsLoggerProvider` will provide them. Logged messages or exceptions will be sent to Application Insights. 

Consider the following example controller:

```csharp
public class ValuesController : ControllerBase
{
    private readonly ILogger _logger;

    public ValuesController(ILogger<ValuesController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public ActionResult<IEnumerable<string>> Get()
    {
        _logger.LogWarning("An example of a Warning trace..");
        _logger.LogError("An example of an Error level message");

        return new string[] { "value1", "value2" };
    }
}
```

For more information, see [Logging in ASP.NET Core](/aspnet/core/fundamentals/logging).

### Capture logs within ASP.NET Core startup code

Some scenarios require capturing logs as part of the app startup routine, before the request-response pipeline is ready to accept requests. However, `ILogger` implementations aren't easily available from dependency injection in *Program.cs* and *Startup.cs*. For more information, see [Logging in .NET: Create logs in Main](/dotnet/core/extensions/logging?tabs=command-line#create-logs-in-main).

There are several limitations when you're logging from *Program.cs* and *Startup.cs*:

* Telemetry is sent through the [InMemoryChannel](./telemetry-channels.md) telemetry channel.
* No [sampling](./sampling.md) is applied to telemetry.
* Standard [telemetry initializers or processors](./api-filtering-sampling.md) are not available.

The following examples demonstrate this by explicitly instantiating and configuring *Program.cs* and *Startup.cs*.

#### Example Program.cs

```csharp
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.ApplicationInsights;

namespace WebApplication
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();

            var logger = host.Services.GetRequiredService<ILogger<Program>>();
            logger.LogInformation("From Program, running the host now.");

            host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                })
                .ConfigureLogging((context, builder) =>
                {
                    // Providing an instrumentation key is required if you're using the
                    // standalone Microsoft.Extensions.Logging.ApplicationInsights package,
                    // or when you need to capture logs during application startup, such as
                    // in Program.cs or Startup.cs itself.
                    builder.AddApplicationInsights(
                        context.Configuration["APPINSIGHTS_CONNECTIONSTRING"]);

                    // Capture all log-level entries from Program
                    builder.AddFilter<ApplicationInsightsLoggerProvider>(
                        typeof(Program).FullName, LogLevel.Trace);

                    // Capture all log-level entries from Startup
                    builder.AddFilter<ApplicationInsightsLoggerProvider>(
                        typeof(Startup).FullName, LogLevel.Trace);
                });
    }
}
```

In the preceding code, `ApplicationInsightsLoggerProvider` is configured with your `"APPINSIGHTS_CONNECTIONSTRING"` connection string. Filters are applied, setting the log level to <xref:Microsoft.Extensions.Logging.LogLevel.Trace?displayProperty=nameWithType>.

> [!IMPORTANT]
> We recommend [connection strings](./sdk-connection-string.md?tabs=net) over instrumentation keys. New Azure regions *require* the use of connection strings instead of instrumentation keys. 
>
> A connection string identifies the resource that you want to associate with your telemetry data. It also allows you to modify the endpoints that your resource will use as a destination for your telemetry. You'll need to copy the connection string and add it to your application's code or to an environment variable.

#### Example Startup.cs

```csharp
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace WebApplication
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddApplicationInsightsTelemetry(
                Configuration["APPINSIGHTS_CONNECTIONSTRING"]);
        }

        // The ILogger<Startup> is resolved by dependency injection
        // and available in Startup.Configure.
        public void Configure(
            IApplicationBuilder app, IWebHostEnvironment env, ILogger<Startup> logger)
        {
            logger.LogInformation(
                "Configuring for {Environment} environment",
                env.EnvironmentName);

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGet("/", async context =>
                {
                    await context.Response.WriteAsync("Hello World!");
                });
            });
        }
    }
}
```

## Console application

Here are the installed packages:

```xml
<ItemGroup>
  <PackageReference Include="Microsoft.Extensions.DependencyInjection" Version="5.0.0" />
  <PackageReference Include="Microsoft.Extensions.Logging.ApplicationInsights" Version="2.17.0"/>
</ItemGroup>
```

```csharp
using Microsoft.ApplicationInsights.Channel;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.ApplicationInsights;
using System;
using System.Threading.Tasks;

namespace ConsoleApp
{
    class Program
    {
        static async Task Main(string[] args)
        {
            using var channel = new InMemoryChannel();

            try
            {
                IServiceCollection services = new ServiceCollection();
                services.Configure<TelemetryConfiguration>(config => config.TelemetryChannel = channel);
                services.AddLogging(builder =>
                {
                    // Only Application Insights is registered as a logger provider
                    builder.AddApplicationInsights("<YourInstrumentationKey>");
                });

                IServiceProvider serviceProvider = services.BuildServiceProvider();
                ILogger<Program> logger = serviceProvider.GetRequiredService<ILogger<Program>>();

                logger.LogInformation("Logger is working...");
            }
            finally
            {
                // Explicitly call Flush() followed by Delay, as required in console apps.
                // This ensures that even if the application terminates, telemetry is sent to the back end.
                channel.Flush();

                await Task.Delay(TimeSpan.FromMilliseconds(1000));
            }
        }
    }
}

```

The preceding example uses the `Microsoft.Extensions.Logging.ApplicationInsights` package. By default, this configuration uses the "bare minimum" `TelemetryConfiguration` setup for sending data to Application Insights: the `InMemoryChannel` channel. There's no sampling and no standard `TelemetryInitializer` instance. You can override this behavior for a console application, as the following example shows.

Install this additional package:

```xml
<PackageReference Include="Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel" Version="2.17.0" />
```

The following section shows how to override the default `TelemetryConfiguration` setup by using the <xref:Microsoft.Extensions.Options.ConfigureOptions%601.Configure(%600)> method. This example sets up `ServerTelemetryChannel` and sampling. It adds a custom `TelemetryInitializer` instance to `TelemetryConfiguration`.

```csharp
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.ApplicationInsights;
using System;
using System.Threading.Tasks;

namespace ConsoleApp
{
    class Program
    {
        static async Task Main(string[] args)
        {
            using var channel = new ServerTelemetryChannel();

            try
            {
                IServiceCollection services = new ServiceCollection();
                services.Configure<TelemetryConfiguration>(
                    config =>
                    {
                        config.TelemetryChannel = channel;

                        // Optional: implement your own TelemetryInitializer instance and configure it here
                        // config.TelemetryInitializers.Add(new MyTelemetryInitializer());

                        config.DefaultTelemetrySink.TelemetryProcessorChainBuilder.UseSampling(5);
                        channel.Initialize(config);
                    });

                services.AddLogging(builder =>
                {
                    // Only Application Insights is registered as a logger provider
                    builder.AddApplicationInsights("<YourInstrumentationKey>");
                });

                IServiceProvider serviceProvider = services.BuildServiceProvider();
                ILogger<Program> logger = serviceProvider.GetRequiredService<ILogger<Program>>();

                logger.LogInformation("Logger is working...");
            }
            finally
            {
                // Explicitly call Flush() followed by Delay, as required in console apps.
                // This ensures that even if the application terminates, telemetry is sent to the back end.
                channel.Flush();

                await Task.Delay(TimeSpan.FromMilliseconds(1000));
            }
        }
    }
}
```

## Logging level

`ILogger` implementations have a built-in mechanism to apply [log filtering](/dotnet/core/extensions/logging#how-filtering-rules-are-applied). This filtering lets you control the logs that are sent to each registered provider, including the Application Insights provider. You can use the filtering either in configuration (for example, by using an *appsettings.json* file) or in code.

The following examples show how to apply filter rules to `ApplicationInsightsLoggerProvider`.

### Create filter rules in configuration with appsettings.json

`ApplicationInsightsLoggerProvider` is aliased as "ApplicationInsights." The following section of *appsettings.json* overrides the default <xref:Microsoft.Extensions.Logging.LogLevel.Warning?displayProperty=nameWithType> log level of Application Insights to log categories that start with "Microsoft" at level <xref:Microsoft.Extensions.Logging.LogLevel.Error?displayProperty=nameWithType> and higher.

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Warning"
    },
    "ApplicationInsights": {
      "LogLevel": {
        "Microsoft": "Error"
      }
    }
  }
}
```

### Create filter rules in code

The following code snippet configures logs to be sent to `ApplicationInsightsLoggerProvider` for these items:

- <xref:Microsoft.Extensions.Logging.LogLevel.Warning?displayProperty=nameWithType> and higher from all categories
- <xref:Microsoft.Extensions.Logging.LogLevel.Error?displayProperty=nameWithType> and higher from categories that start with "Microsoft"

```csharp
Host.CreateDefaultBuilder(args)
    .UseStartup<Startup>()
    .ConfigureLogging(builder =>
    {
        builder.AddFilter<ApplicationInsightsLoggerProvider>("", LogLevel.Warning);
        builder.AddFilter<ApplicationInsightsLoggerProvider>("Microsoft", LogLevel.Error);
    });
```

This preceding code is functionally equivalent to the previous section in *appsettings.json*. For more information, see [Configuration in .NET](/dotnet/core/extensions/configuration).

## Logging scopes

`ApplicationInsightsLoggingProvider` supports [log scopes](/dotnet/core/extensions/logging#log-scopes). Scopes are enabled by default. 

If the scope is of type `IReadOnlyCollection<KeyValuePair<string,object>>`, then each key/value pair in the collection is added to the Application Insights telemetry as custom properties. In the following example, logs will be captured as `TraceTelemetry` and will have `("MyKey", "MyValue")` in properties.

```csharp
using (_logger.BeginScope(new Dictionary<string, object> { ["MyKey"] = "MyValue" }))
{
    _logger.LogError("An example of an Error level message");
}
```

If any other type is used as a scope, it will be stored under the property `Scope` in Application Insights telemetry. In the following example, `TraceTelemetry` will have a property called `Scope` that contains the scope.

```csharp
    using (_logger.BeginScope("hello scope"))
    {
        _logger.LogError("An example of an Error level message");
    }
```

## Frequently asked questions

### What are the old and new versions of ApplicationInsightsLoggerProvider?

The [Microsoft.ApplicationInsights.AspNet SDK](https://www.nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore) included a built-in `ApplicationInsightsLoggerProvider` (`Microsoft.ApplicationInsights.AspNetCore.Logging.ApplicationInsightsLoggerProvider`) instance, which was enabled through `ILoggerFactory` extension methods. This provider is marked obsolete from version 2.7.1. It's slated to be removed completely in the next major version change. 

The [Microsoft.ApplicationInsights.AspNetCore 2.6.1](https://www.nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore) package itself isn't obsolete. It's required to enable monitoring of items like requests and dependencies.

The suggested alternative is the new standalone package [Microsoft.Extensions.Logging.ApplicationInsights](https://www.nuget.org/packages/Microsoft.Extensions.Logging.ApplicationInsights), which contains an improved `ApplicationInsightsLoggerProvider` instance (`Microsoft.Extensions.Logging.ApplicationInsights.ApplicationInsightsLoggerProvider`) and extension methods on `ILoggerBuilder` for enabling it.

[Microsoft.ApplicationInsights.AspNet SDK](https://www.nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore) version 2.7.1 takes a dependency on the new package and enables `ILogger` capture automatically.

### Why are some ILogger logs shown twice in Application Insights?

Duplication can occur if you have the older (now obsolete) version of `ApplicationInsightsLoggerProvider` enabled by calling `AddApplicationInsights` on `ILoggerFactory`. Check if your `Configure` method has the following code, and remove it:

```csharp
 public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
 {
     loggerFactory.AddApplicationInsights(app.ApplicationServices, LogLevel.Warning);
     // ..other code.
 }
```

If you experience double logging when you debug from Visual Studio, set `EnableDebugLogger` to `false` in the code that enables Application Insights, as follows. This duplication and fix are relevant only when you're debugging the application.

```csharp
public void ConfigureServices(IServiceCollection services)
{
    var options = new ApplicationInsightsServiceOptions
    {
        EnableDebugLogger = false
    }
    services.AddApplicationInsightsTelemetry(options);
    // ...
}
```

### I updated to Microsoft.ApplicationInsights.AspNet SDK version 2.7.1, and logs from ILogger are captured automatically. How do I turn off this feature completely?

See the [Logging level](#logging-level) section to see how to filter logs in general. To turn off `ApplicationInsightsLoggerProvider`, use `LogLevel.None` in your call for configuring logging. In the following command, `builder` is <xref:Microsoft.Extensions.Logging.ILoggingBuilder>.

```csharp
builder.AddFilter<ApplicationInsightsLoggerProvider>("", LogLevel.None);
```

Here's the change in the *appsettings.json* file:

```json
{
    "Logging": {
        "ApplicationInsights": {
            "LogLevel": {
                "Default": "None"
            }
        }
    }
}
```

### Why do some ILogger logs not have the same properties as others?

Application Insights captures and sends `ILogger` logs by using the same `TelemetryConfiguration` information that's used for every other telemetry. But there's an exception. By default, `TelemetryConfiguration` is not fully set up when you log from *Program.cs* or *Startup.cs*. Logs from these places won't have the default configuration, so they won't be running all `TelemetryInitializer` instances and `TelemetryProcessor` instances.

### I'm using the standalone package Microsoft.Extensions.Logging.ApplicationInsights, and I want to log some additional custom telemetry manually. How should I do that?

When you use the standalone package, `TelemetryClient` is not injected to the dependency injection (DI) container. You need to create a new instance of `TelemetryClient` and use the same configuration that the logger provider uses, as the following code shows. This ensures that the same configuration is used for all custom telemetry and telemetry from `ILogger`.

```csharp
public class MyController : ApiController
{
   // This TelemetryClient instance can be used to track additional telemetry through the TrackXXX() API.
   private readonly TelemetryClient _telemetryClient;
   private readonly ILogger _logger;

   public MyController(IOptions<TelemetryConfiguration> options, ILogger<MyController> logger)
   {
        _telemetryClient = new TelemetryClient(options.Value);
        _logger = logger;
   }  
}
```

> [!NOTE]
> If you use the `Microsoft.ApplicationInsights.AspNetCore` package to enable Application Insights, modify this code to get `TelemetryClient` directly in the constructor. For an example, see [this FAQ](./asp-net-core.md#frequently-asked-questions).

### What Application Insights telemetry type is produced from ILogger logs? Where can I see ILogger logs in Application Insights?

`ApplicationInsightsLoggerProvider` captures `ILogger` logs and creates `TraceTelemetry` from them. If an `Exception` object is passed to the `Log` method on `ILogger`, `ExceptionTelemetry` is created instead of `TraceTelemetry`. 

These telemetry items can be found in the same places as any other `TraceTelemetry` or `ExceptionTelemetry` items for Application Insights, including the Azure portal, analytics, or the Visual Studio local debugger.

If you prefer to always send `TraceTelemetry`, use this snippet:

```csharp
builder.AddApplicationInsights(
    options => options.TrackExceptionsAsExceptionTelemetry = false);
```

### I don't have the SDK installed, and I use the Azure Web Apps extension to enable Application Insights for my ASP.NET Core applications. How do I use the new provider? 

The Application Insights extension in Azure Web Apps uses the new provider. You can modify the filtering rules in the *appsettings.json* file for your application.

## Next steps

* [Logging in .NET](/dotnet/core/extensions/logging)
* [Logging in ASP.NET Core](/aspnet/core/fundamentals/logging)
* [.NET trace logs in Application Insights](./asp-net-trace-logs.md)
