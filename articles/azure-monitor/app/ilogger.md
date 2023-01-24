---
title: Application Insights logging with .NET
description: Learn how to use Application Insights with the ILogger interface in .NET.
ms.topic: conceptual
ms.date: 05/20/2021
ms.devlang: csharp
ms.reviewer: casocha
---

# Application Insights logging with .NET

In this article, you'll learn how to capture logs with Application Insights in .NET apps by using the [`Microsoft.Extensions.Logging.ApplicationInsights`][nuget-ai] provider package. If you use this provider, you can query and analyze your logs by using the Application Insights tools.

[nuget-ai]: https://www.nuget.org/packages/Microsoft.Extensions.Logging.ApplicationInsights
[nuget-ai-ws]: https://www.nuget.org/packages/Microsoft.ApplicationInsights.WorkerService

> [!NOTE]
> If you want to implement the full range of Application Insights telemetry along with logging, see [Configure Application Insights for your ASP.NET website](./asp-net.md) or [Application Insights for ASP.NET Core applications](./asp-net-core.md).

> [!TIP]
> The [`Microsoft.ApplicationInsights.WorkerService`][nuget-ai-ws] NuGet package, used to enable Application Insights for background services, is out of scope. For more information, see [Application Insights for Worker Service apps](./worker-service.md).

## ASP.NET Core applications

To add Application Insights logging to ASP.NET Core applications, use the `Microsoft.Extensions.Logging.ApplicationInsights` NuGet provider package.

1. Install the [`Microsoft.Extensions.Logging.ApplicationInsights`][nuget-ai] NuGet package.

1. Add `ApplicationInsightsLoggerProvider`:

    ### [ASP.NET Core 6 and later](#tab/netcorenew)

    <!--DEV: The code in the "ASP.NET Core 6 and later" tab is copied from the "Example Program.cs" section in the published article. If I understand correctly from our meeting, it needs to be updated to not talk about startup anymore - correct? If so, can you please make this update? -->

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
                        // Providing a connection string is required if you're using the
                        // standalone Microsoft.Extensions.Logging.ApplicationInsights package,
                        // or when you need to capture logs during application startup, such as
                        // in Program.cs or Startup.cs itself.
                        builder.AddApplicationInsights(
                            configureTelemetryConfiguration: (config) => config.ConnectionString = context.Configuration["APPLICATIONINSIGHTS_CONNECTION_STRING"],
                            configureApplicationInsightsLoggerOptions: (options) => { }
                        );
    
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

   ### [ASP.NET Core 5 and earlier](#tab/netcoreold)

    <!--DEV: Can you add this code or send it to me to add it myself?-->

    ```csharp
    ```

---

<!--DEV: To confirm, should we keep the rest of this section below (i.e., the text below, up to "## Console application")? I kept it because the code sample appears to resemble a code sample included in the first version of ilogger.md: https://github.com/MicrosoftDocs/azure-docs/commit/281667034c026531ab1cd4ae8ec3fc877da8a35f#diff-b8c9ab08fca62150132618d2c4043098a6c82c9309c68903069e12761078f7a2 -->

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

## Console application

<!--DEV: Do we need to add a link to the install page for the Microsoft.Extensions.DependencyInjection package (https://www.nuget.org/packages/Microsoft.Extensions.DependencyInjection)? -->

To add Application Insights logging to console applications, first install the [`Microsoft.Extensions.Logging.ApplicationInsights`][nuget-ai] NuGet provider package.

The following example uses the Microsoft.Extensions.Logging.ApplicationInsights package and demonstrates the default behavior for a console application. The Microsoft.Extensions.Logging.ApplicationInsights package should be used in a console application or whenever you want a bare minimum implementation of Application Insights without the full feature set such as metrics, distributed tracing, sampling, and telemetry initializers.

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
                    builder.AddApplicationInsights(
                        configureTelemetryConfiguration: (config) => config.ConnectionString = "<YourConnectionString>",
                        configureApplicationInsightsLoggerOptions: (options) => { }
                    );
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

<!-- DEV: Do any more FAQs need to be removed (to align with only talking about ILogger aspects in this article)? -->
## Frequently asked questions

<!-- DEV: I deleted the FAQ "What are the old and new versions of ApplicationInsightsLoggerProvider?" (https://learn.microsoft.com/en-gb/azure/azure-monitor/app/ilogger#what-are-the-old-and-new-versions-of-applicationinsightsloggerprovider). Do you agree with deleting it or should we instead move it to asp-net-core.md? -->

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

<!-- DEV: I deleted the FAQ "I updated to Microsoft.ApplicationInsights.AspNet SDK version 2.7.1, and logs from ILogger are captured automatically. How do I turn off this feature completely?" (https://learn.microsoft.com/en-us/azure/azure-monitor/app/ilogger#i-updated-to-microsoftapplicationinsightsaspnet-sdk-version-271-and-logs-from-ilogger-are-captured-automatically-how-do-i-turn-off-this-feature-completely). Do you agree with deleting it or should we instead move it to asp-net-core.md? -->

### Why do some ILogger logs not have the same properties as others?

Application Insights captures and sends `ILogger` logs by using the same `TelemetryConfiguration` information that's used for every other telemetry. But there's an exception. By default, `TelemetryConfiguration` isn't fully set up when you log from *Program.cs* or *Startup.cs*. Logs from these places won't have the default configuration, so they won't be running all `TelemetryInitializer` instances and `TelemetryProcessor` instances.

### I'm using the standalone package Microsoft.Extensions.Logging.ApplicationInsights, and I want to log more custom telemetry manually. How should I do that?

When you use the standalone package, `TelemetryClient` isn't injected to the dependency injection (DI) container. You need to create a new instance of `TelemetryClient` and use the same configuration that the logger provider uses, as the following code shows. This requirement ensures that the same configuration is used for all custom telemetry and telemetry from `ILogger`.

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
> If you use the `Microsoft.ApplicationInsights.AspNetCore` package to enable Application Insights, modify this code to get `TelemetryClient` directly in the constructor. For an example, see [this FAQ](../faq.yml).

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

<!-- DEV: I deleted the FAQ "I can't see some of the logs from my application in the workspace." (https://learn.microsoft.com/en-us/azure/azure-monitor/app/ilogger#i-cant-see-some-of-the-logs-from-my-application-in-the-workspace). Do you agree with deleting it or should we instead move it to asp-net-core.md? -->

## Next steps

* [Logging in .NET](/dotnet/core/extensions/logging)
* [Logging in ASP.NET Core](/aspnet/core/fundamentals/logging)
* [.NET trace logs in Application Insights](./asp-net-trace-logs.md)