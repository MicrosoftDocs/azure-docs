---
title: Explore .NET trace logs in Azure Application Insights with ILogger
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

# ApplicationInsightsLoggerProvider for .NET Core ILogger logs

ASP.NET Core supports a logging API that works with different kinds of built-in and third-party logging providers. Logging is done by calling Log() or a variant of it on `ILogger` instances. This article shows how to use `ApplicationInsightsLoggerProvider` to capture `ILogger` logs in both console and ASP.NET Core applications. This article also describes how `ApplicationInsightsLoggerProvider` is integrated with other Application Insights telemetry.
To learn more logging in Asp.Net Core, see [this article](https://docs.microsoft.com/aspnet/core/fundamentals/logging).

## ASP.NET Core applications

Starting with [Microsoft.ApplicationInsights.AspNet SDK](https://www.nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore) version 2.7.0-beta3 onwards, `ApplicationInsightsLoggerProvider` is enabled by default when enabling regular Application Insights monitoring using either of the standard methods - by calling `UseApplicationInsights` extension method on IWebHostBuilder or `AddApplicationInsightsTelemetry` extension method on IServiceCollection. `ILogger` logs captured by `ApplicationInsightsLoggerProvider` are subject to same configuration as any other telemetry collected. i.e they have the same set of `TelemetryInitializer`s, `TelemetryProcessor`s, uses the same `TelemetryChannel`, and will be correlated and sampled in the same way as every other telemetry.  If you are on this version of SDK or higher, then no action is required to capture `ILogger` logs.

By default, only `ILogger` logs of `Warning` or above (from all categories) are sent to Application Insights. This behavior can be changed by applying Filters as shown [here](#control-logging-level). Also additional steps are required if `ILogger` logs from `Program.cs` or `Startup.cs` are to be captured as shown [here](#capturing-ilogger-logs-from-startupcs-programcs-in-aspnet-core-applications).

If you use an earlier version of Microsoft.ApplicationInsights.AspNet SDK, or you want to just use ApplicationInsightsLoggerProvider, without any other Application Insights monitoring, follow the steps below.

1.Install the nuget package.

```xml
    <ItemGroup>
      <PackageReference Include="Microsoft.Extensions.Logging.ApplicationInsights" Version="2.9.1" />  
    </ItemGroup>
```

2.Modify `Program.cs` as below

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
                // Providing an instrumentation key here is required if you are using
                // standalone package Microsoft.Extensions.Logging.ApplicationInsights
                // or if you want to capture logs from early in the application startup
                // pipeline from Startup.cs or Program.cs itself.
                builder.AddApplicationInsights("ikey");

                // Optional: Apply filters to control what logs are sent to Application Insights.
                // The following configures LogLevel Information or above to be sent to
                // Application Insights for all categories.
                builder.AddFilter<Microsoft.Extensions.Logging.ApplicationInsights.ApplicationInsightsLoggerProvider>
                                 ("", LogLevel.Information);
            }
        );
}
```

The above code will configure `ApplicationInsightsLoggerProvider`. Following shows an example Controller class, which uses `ILogger` to send logs, which are captured by ApplicationInsights.

```csharp
public class ValuesController : ControllerBase
{
    private readonly `ILogger` _logger;

    public ValuesController(ILogger<ValuesController> logger)
    {
        _logger = logger;
    }

    // GET api/values
    [HttpGet]
    public ActionResult<IEnumerable<string>> Get()
    {
        // All the following logs will be picked up by Application Insights.
        // and all of them will have ("MyKey", "MyValue") in Properties.
        using (_logger.BeginScope(new Dictionary<string, object> { { "MyKey", "MyValue" } }))
            {
                _logger.LogWarning("An example of a Warning trace..");
                _logger.LogError("An example of an Error level message");
            }
        return new string[] { "value1", "value2" };
    }
}
```

### Capturing ILogger logs from Startup.cs, Program.cs in Asp.Net Core Applications

With the new ApplicationInsightsLoggerProvider, it is possible to capture logs from early in the application startup pipeline. Even though ApplicationInsightsLoggerProvider is automatically enabled  Application Insights (from 2.7.0-beta3 onwards), it do not have instrumentation key setup until later in the pipeline, so only logs from Controller/other classes will be captured. To capture every logs starting with `Program.cs` and `Startup.cs` itself, one need to explicitly enable ApplicationInsightsLoggerProvider with an instrumentation key. It is also important to note that `TelemetryConfiguration` is not fully set up when logging something from `Program.cs` or `Startup.cs` itself, so those logs will use a bare minimum configuration, which uses InMemoryChannel, no sampling, and no standard telemetry initializers or processors.

Following shows examples of `Program.cs` and `Startup.cs` using this capability.

#### Example Program.cs

```csharp
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;

public class Program
{
    public static void Main(string[] args)
    {
        var host = CreateWebHostBuilder(args).Build();
        var logger = host.Services.GetRequiredService<ILogger<Program>>();
        // This will be picked up by AI
        logger.LogInformation("From Program. Running the host now..");
        host.Run();
    }

    public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
    WebHost.CreateDefaultBuilder(args)
        .UseStartup<Startup>()
        .ConfigureLogging(
        builder =>
            {
            // providing an instrumentation key here is required if you are using
            // standalone package Microsoft.Extensions.Logging.ApplicationInsights
            // or if you want to capture logs from early in the application startup 
            // pipeline from Startup.cs or Program.cs itself.
            builder.AddApplicationInsights("ikey");

            // Adding the filter below to ensure logs of all severity from Program.cs
            // is sent to ApplicationInsights.
            // Replace YourAppName with the namespace of your application's Program.cs
            builder.AddFilter<Microsoft.Extensions.Logging.ApplicationInsights.ApplicationInsightsLoggerProvider>
                             ("YourAppName.Program", LogLevel.Trace);
            // Adding the filter below to ensure logs of all severity from Startup.cs
            // is sent to ApplicationInsights.
            // Replace YourAppName with the namespace of your application's Startup.cs
            builder.AddFilter<Microsoft.Extensions.Logging.ApplicationInsights.ApplicationInsightsLoggerProvider>
                             ("YourAppName.Startup", LogLevel.Trace);
            }
        );
}
```

#### Example Startup.cs

```csharp
public class Startup
{
    private readonly `ILogger` _logger;

    public Startup(IConfiguration configuration, ILogger<Startup> logger)
    {
        Configuration = configuration;
        _logger = logger;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddApplicationInsightsTelemetry();

        // The following will be picked up by Application Insights.
        _logger.LogInformation("Logging from ConfigureServices.");
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

## Migrating from old ApplicationInsightsLoggerProvider

Microsoft.ApplicationInsights.AspNet SDK versions before 2.7.0-beta2, supported a logging provider that is now obsolete. This provider was enabled with `AddApplicationInsights()` extension method of `ILoggerFactory`. This provider is now obsolete, and users are suggested to migrate to the new provider. Migration involves two steps.

1. Remove ILoggerFactory.AddApplicationInsights() call from `Startup.Configure()` method to avoid double logging.
2. Reapply any filtering rules in code as they will not be respected by the new provider. Overloads of ILoggerFactory.AddApplicationInsights() took minimum LogLevel or filter functions. With the new provider, filtering is part of the logging framework itself, and not done by Application Insights provider. So any filters provided via `ILoggerFactory.AddApplicationInsights()` overloads should be removed, and filtering rules should be provided following [these](#control-logging-level) instructions. If you use `appsettings.json` to filter logging, it will continue to work with new provider as both use the same Provider Alias - **ApplicationInsights**.

While old provider can still be used (it is obsolete now and will be removed only in major version change to 3.xx), migrating to newer provider is highly recommended because of the following reasons.

1. Previous provider lacked support of [Scopes](https://docs.microsoft.com/aspnet/core/fundamentals/logging/?view=aspnetcore-2.2#log-scopes). In the new provider, properties from scope are automatically added as custom properties to the collected telemetry.
2. Logs can now be captured much earlier in the application startup pipeline. i.e Logs from Program and Startup classes can now be captured.
3. With new provider, the filtering is done at the framework level itself. Filtering of logs to Application Insights provider can be done in exact same way as for other providers, including built-in providers like Console, Debug, and so on. It is also possible to apply same filters to multiple providers.
4. The [recommended](https://github.com/aspnet/Announcements/issues/255) way in ASP.NET Core (2.0 onwards) to enable logging providers is by using extension methods on ILoggingBuilder in `Program.cs` itself.

> [!Note]
> The new Provider is available for applications targeting `NETSTANDARD2.0` or higher. If your application is targeting older .NET Core versions like .NET Core 1.1 or if targeting the .NET Framework, continue to use the old provider.

## Console application

The following code shows a sample Console application configured to send `ILogger` traces to Application Insights.

Packages installed:

```xml
<ItemGroup>
  <PackageReference Include="Microsoft.Extensions.DependencyInjection" Version="2.1.0" />  
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
        services.AddLogging(builder =>
        {
            // Optional: Apply filters to configure LogLevel Trace or above is sent to
            // Application Insights for all categories.
            builder.AddFilter<Microsoft.Extensions.Logging.ApplicationInsights.ApplicationInsightsLoggerProvider>
                             ("", LogLevel.Trace);
            builder.AddApplicationInsights("--YourAIKeyHere--");
        });

        // Build ServiceProvider.
        IServiceProvider serviceProvider = services.BuildServiceProvider();

        ILogger<Program> logger = serviceProvider.GetRequiredService<ILogger<Program>>();

        // Begin a new scope. This is optional.
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

In the above example, the standalone package `Microsoft.Extensions.Logging.ApplicationInsights` is used. By default, this configuration uses the bare minimum `TelemetryConfiguration` for sending data to
Application Insights. Bare minimum means the channel used will be `InMemoryChannel`, no sampling, and no standard TelemetryInitializers. This behavior can be overridden for a console application
as shown in example below.

Install this additional package:

```xml
<PackageReference Include="Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel" Version="2.9.1" />
```

The following section shows how to override the default `TelemetryConfiguration` by using `services.Configure<TelemetryConfiguration>()` method. This example sets up `ServerTelemetryChannel`, sampling, and adds a custom `ITelemetryInitializer` to the `TelemetryConfiguration`.

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

    // Add the logging pipelines to use. We are adding Application Insights only.
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

The Asp.Net Core `ILogger` infra has built-in mechanism to apply [filtering](https://docs.microsoft.com/aspnet/core/fundamentals/logging/?view=aspnetcore-2.2#log-filtering) of logs, which allows users to control the logs sent to each registered providers, including Application Insights provider. This filtering can be done either in configuration (typically using `appsettings.json` file) or in code. This facility is provided by the framework itself, and is not specific to Application Insights provider.

Examples of applying the filter rules to ApplicationInsightsLoggerProvider is given below.

### Create filter rules in Configuration with appsettings.json

For ApplicationInsightsLoggerProvider, the provider alias is `ApplicationInsights`. The below shown section in `appsettings.json` configures logs `Warning` and above from all categories, `Error` and above from categories starting with "Microsoft" to be sent to `ApplicationInsightsLoggerProvider`.

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

### Create filter rules in code

The below code snippet configures logs `Warning` and above from all categories, `Error` and above from categories starting with 'Microsoft' to be sent to `ApplicationInsightsLoggerProvider`. This config is the same as the above config done in `appsettings.json`.

```csharp
    WebHost.CreateDefaultBuilder(args)
    .UseStartup<Startup>()
    .ConfigureLogging(logging =>
      logging.AddFilter<Microsoft.Extensions.Logging.ApplicationInsights.ApplicationInsightsLoggerProvider>
                        ("", LogLevel.Warning)
             .AddFilter<Microsoft.Extensions.Logging.ApplicationInsights.ApplicationInsightsLoggerProvider>
                        ("Microsoft", LogLevel.Error);
```

## Frequently Asked Questions

*1. What is the old and new ApplicationInsightsLoggerProvider?*

* [Microsoft.ApplicationInsights.AspNet SDK](https://www.nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore) shipped with a built-in ApplicationInsightsLoggerProvider (Microsoft.ApplicationInsights.AspNetCore.Logging.ApplicationInsightsLoggerProvider), which was enabled using ILoggerFactory extension methods. This provider is marked obsolete from 2.7.0-beta2 onwards and will be removed completely in the next major version change. [This](https://www.nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore) package itself not obsolete and is required to enable monitoring of Requests, Dependencies etc.

* The suggested alternative is the new standalone package [Microsoft.Extensions.Logging.ApplicationInsights](https://www.nuget.org/packages/Microsoft.Extensions.Logging.ApplicationInsights), containing an improved ApplicationInsightsLoggerProvider (Microsoft.Extensions.Logging.ApplicationInsights.ApplicationInsightsLoggerProvider), and extensions methods on ILoggerBuilder for enabling it.

* [Microsoft.ApplicationInsights.AspNet SDK](https://www.nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore) version 2.7.0-beta3 onwards will take a dependency on the above package, and enables `ILogger` capture automatically.

*2. I'm seeing some `ILogger` logs are shown twice in Application Insights?*

* This duplication is possible if you have the older (now obsolete) version of `ApplicationInsightsLoggerProvider` enabled by calling `AddApplicationInsights` on `ILoggerFactory`. Check if your `Configure` method has
  the following, and remove it.

   ```csharp
    public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
    {
        loggerFactory.AddApplicationInsights(app.ApplicationServices, LogLevel.Warning);
        // ..other code.
    }
   ```

* If you're experiencing double logging when debugging from Visual Studio, then modify the code used to enable Application Insights as follows, by setting `EnableDebugLogger` to be false. This duplication issue and fix is only relevant when debugging the application.

   ```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        ApplicationInsightsServiceOptions options = new ApplicationInsightsServiceOptions();
        options.EnableDebugLogger = false;
        services.AddApplicationInsightsTelemetry(options);
        // ..other code.
    }
   ```

*3. I updated to [Microsoft.ApplicationInsights.AspNet SDK](https://www.nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore) version 2.7.0-beta3, and I am now seeing that logs from `ILogger` are captured automatically. How can I turn off this feature completely?*

* See [this](../../azure-monitor/app/ilogger.md#control-logging-level) section to know how to filter logs in general. To turn-off ApplicationInsightsLoggerProvider use `LogLevel.None` for it.

  In code

    ```csharp
        builder.AddFilter<Microsoft.Extensions.Logging.ApplicationInsights.ApplicationInsightsLoggerProvider>
                          ("", LogLevel.None);
    ```

  In config

    ```json
    {
      "Logging": {
        "ApplicationInsights": {
          "LogLevel": {
            "Default": "None"
          }
    }
    ```

*4. I'm seeing some `ILogger` logs aren't having same properties as others?*

* Application Insights captures and sends `ILogger` logs using the same `TelemetryConfiguration` used for every other telemetry. There is an exception to this rule. The default `TelemetryConfiguration` is not fully set up when logging something from `Program.cs` or `Startup.cs` itself, so logs from these places will not have the default configuration, and hence will not be running all the `TelemetryInitializer`s and `TelemetryProcessor`s.

*5. I'm using the standalone package Microsoft.Extensions.Logging.ApplicationInsights, and I want to log some additional custom telemetry manually. How should I do that?*

* When using the standalone package, `TelemetryClient` is not injected to DI container, so users are expected to create a new instance of `TelemetryClient` by using the same configuration as used by the logger provider, as shown below. This ensures the same configuration is used for all the custom telemetry, as well as those captured from ILogger.

```csharp
public class MyController : ApiController
{
   // This telemtryclient can be used to track additional telemetry using TrackXXX() api.
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
> Please note that, if the package Microsoft.ApplicationInsights.AspNetCore package is used to enable Application Insights, then the above example should be modified to get `TelemetryClient` directly in the constructor. See [this](https://docs.microsoft.com/azure/azure-monitor/app/asp-net-core-no-visualstudio#frequently-asked-questions) for full example.


*6. What Application Insights telemetry type is produced from `ILogger` logs? or Where can I see `ILogger` logs in Application Insights?*

* ApplicationInsightsLoggerProvider captures `ILogger` logs and creates `TraceTelemetry` from it. If an Exception object is passed to the Log() method on ILogger, then instead of `TraceTelemetry`, an `ExceptionTelemetry` is created. These telemetry items can be found in same places as any other `TraceTelemetry` or `ExceptionTelemetry` for Application Insights, including portal, analytics, or Visual Studio local debugger.
If you prefer to always send `TraceTelemetry`, then use the snippet ```builder.AddApplicationInsights((opt) => opt.TrackExceptionsAsExceptionTelemetry = false);```.

*7. I don't have SDK installed, and I use Azure Web App Extension to enable Application Insights for my Asp.Net Core applications. How do I use the new provider?*

* Application Insights extension in Azure Web App uses the old provider. Filtering rules can be modified in `appsettings.json` for your application. If you want to take advantage of the new provider, use build-time instrumentation by taking nuget dependency on the SDK. This document will be updated when extension switches to use the new provider.

*8. I am using the standalone package Microsoft.Extensions.Logging.ApplicationInsights, and enabling Application Insights provider by calling builder.AddApplicationInsights("ikey"). Is there an option to get instrumentation key from configuration?*


* Modify `Program.cs` and `appsettings.json` as shown below.

```csharp
public class Program
{
    public static void Main(string[] args)
    {
        CreateWebHostBuilder(args).Build().Run();
    }

    public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
        WebHost.CreateDefaultBuilder(args)
            .UseStartup<Startup>()
            .ConfigureLogging((hostingContext, logging) =>
            {
                // hostingContext.HostingEnvironment can be used to determine environments as well.
                var appInsightKey = hostingContext.Configuration["myikeyfromconfig"];
                logging.AddApplicationInsights(appInsightKey);
            });
}
```

Relevant section from `appsettings.json`

```json
{
  "myikeyfromconfig": "putrealikeyhere"
}
```

The above code is required only when using standalone logging provider. For regular Application Insights monitoring, instrumentation key is loaded automatically from the configuration path `ApplicationInsights:Instrumentationkey` and `appsettings.json` should look like below.

```json
{
  "ApplicationInsights":
    {
        "Instrumentationkey":"putrealikeyhere"
    }
}
```

## Next steps

Learn more about:

* [Logging in Asp.Net Core](https://docs.microsoft.com/aspnet/core/fundamentals/logging)
* [.NET trace logs in Application Insights](../../azure-monitor/app/asp-net-trace-logs.md)
