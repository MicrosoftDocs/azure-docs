---
title: Application Insights logging with .NET
description: Learn how to use Application Insights with the ILogger interface in .NET.
ms.topic: conceptual
ms.date: 05/20/2021
ms.reviewer: mbullwin
---

# Application Insights logging with .NET

In this article you'll learn how to capture logs with Application Insights in .NET apps using several NuGet packages:

- **Core package:**
  - [`Microsoft.Extensions.Logging.ApplicationInsights`][nuget-ai]
- **Workload packages:**
  - [`Microsoft.ApplicationInsights.AspNetCore`][nuget-ai-anc]
  - [`Microsoft.ApplicationInsights.WorkerService`][nuget-ai-ws]
  - [`Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel`][nuget-ai-ws-tc]

[nuget-ai]: https://www.nuget.org/packages/Microsoft.Extensions.Logging.ApplicationInsights
[nuget-ai-anc]: https://www.nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore
[nuget-ai-ws]: https://www.nuget.org/packages/Microsoft.ApplicationInsights.WorkerService
[nuget-ai-ws-tc]: https://www.nuget.org/packages/Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel

Depending on the Application Insights logging package you use, there will be various ways to register the `ApplicationInsightsLoggerProvider`. The `ApplicationInsightsLoggerProvider` is an implementation of <xref:Microsoft.Extensions.Logging.ILoggerProvider>, which is responsible for providing <xref:Microsoft.Extensions.Logging.ILogger> and <xref:Microsoft.Extensions.Logging.ILogger%601> implementations.

## ASP.NET Core applications

To add Application Insights telemetry to to ASP.NET Core applications, use the `Microsoft.ApplicationInsights.AspNetCore` NuGet package. This can be configured from with [Visual Studio as a Connected service](/visualstudio/azure/azure-app-insights-add-connected-service), or manually.

By default, ASP.NET Core applications have Application Insights registered when configured using the [Code](./asp-net-core.md) or [Code-less](./azure-web-apps.md?tabs=netcore#enable-agent-based-monitoring) approach. The registered provider is configured to automatically capture log events with a severity of <xref:Microsoft.Extensions.Logging.LogLevel.Warning?displayProperty=nameWithType> or greater. Severity and categories may be customized. For more information, see [Control logging level](#control-logging-level).

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
                services.AddApplicationInsightsTelemetry(Configuration["APPINSIGHTS_CONNECTIONSTRING"]);

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

With the NuGet package installed, and the provider being registered with dependency injection, the app is ready to log. With constructor injection, require either <xref:Microsoft.Extensions.Logging.ILogger> or the generic-type alternative <xref:Microsoft.Extensions.Logging.ILogger%601>. When these implementations are resolved, the `ApplicationInsightsLoggerProvider` will be providing them. Messages or exceptions logged will be sent to Application Insights. Consider the following example controller:

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

Some scenarios require capturing logs as part of the app startup routine, prior to the request-response pipeline being ready. However, `ILogger` implementations aren't easily available from dependency injection in *Program.cs* and *Startup.cs*. For more information, see [Logging in .NET: Create logs in `Main`](/dotnet/core/extensions/logging?tabs=command-line#create-logs-in-main).

The are several applicable limitations when logging from *Program.cs* and *Startup.cs*:

* Telemetry is sent using the [InMemoryChannel](./telemetry-channels.md) telemetry channel.
* No [sampling](./sampling.md) is applied to telemetry.
* Standard [telemetry initializers or processors](./api-filtering-sampling.md) are not available.

The following examples demonstrate this by explicitly instantiating and configuring  *Program.cs* and *Startup.cs*:

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
                    // or when you need to capture logs during application startup, for example
                    // in the Program.cs or Startup.cs itself.
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

In the preceding code, the `ApplicationInsightsLoggerProvider` is configured with your `"<YourInstrumentationKey>"` instrumentation key, and a filters are applied setting the log level to <xref:Microsoft.Extensions.Logging.LogLevel.Trace?displayProperty=nameWithType>.

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

## Migrate from the old ApplicationInsightsLoggerProvider

Microsoft.ApplicationInsights.AspNet SDK versions before 2.7.1 supported a logging provider that's now obsolete. This provider was enabled through the **AddApplicationInsights()** extension method of ILoggerFactory. We recommend that you migrate to the new provider, which involves two steps:

1. Remove the *ILoggerFactory.AddApplicationInsights()* call from the **Startup.Configure()** method to avoid double logging.
2. Reapply any filtering rules in code, because they will not be respected by the new provider. Overloads of *ILoggerFactory.AddApplicationInsights()* took minimum LogLevel or filter functions. With the new provider, filtering is part of the logging framework itself. It's not done by the Application Insights provider. So any filters that are provided via *ILoggerFactory.AddApplicationInsights()* overloads should be removed. And filtering rules should be provided by following the [Control logging level](#control-logging-level) instructions. If you use *appsettings.json* to filter logging, it will continue to work with the new provider, because both use the same provider alias, *ApplicationInsights*.

You can still use the old provider. (It will be removed only in a major version change to 3.*xx*.) But we recommend that you migrate to the new provider for the following reasons:

- The previous provider lacks support for [log scopes](/aspnet/core/fundamentals/logging#log-scopes). In the new provider, properties from scope are automatically added as custom properties to the collected telemetry.
- Logs can now be captured much earlier in the application startup pipeline. Logs from the **Program** and **Startup** classes can now be captured.
- With the new provider, filtering is done at the framework level itself. You can filter logs to the Application Insights provider in the same way as for other providers, including built-in providers like Console, Debug, and so on. You can also apply the same filters to multiple providers.
- In ASP.NET Core (2.0 and later), the recommended way to  [enable logging providers](https://github.com/aspnet/Announcements/issues/255) is by using extension methods on ILoggingBuilder in **Program.cs** itself.

> [!Note]
> The new provider is available for applications that target NETSTANDARD2.0 or later. From [Microsoft.ApplicationInsights.AspNet SDK](https://www.nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore) version 2.14.0 onwards, new provider is also available for applications that target .NET Framework NET461 or later. If your application targets older .NET Core versions, such as .NET Core 1.1, or if it targets the .NET Framework less than NET46, continue to use the old provider.

## Console application

> [!NOTE]
> There is a new Application Insights SDK called [Microsoft.ApplicationInsights.WorkerService](https://www.nuget.org/packages/Microsoft.ApplicationInsights.WorkerService) which can used to enable Application Insights (ILogger and other Application Insights telemetry) for any Console Applications. It is recommended to use this package and associated instructions from [here](./worker-service.md).

Packages installed:

```xml
<ItemGroup>
  <PackageReference Include="Microsoft.Extensions.DependencyInjection" Version="5.0.0" />
  <PackageReference Include="Microsoft.Extensions.Logging.ApplicationInsights" Version="2.17.0"/>
</ItemGroup>
```

```csharp
class Program
{
    static void Main(string[] args)
    {
        // Create the DI container.
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

        logger.LogInformation("Logger is working");

        // Explicitly call Flush() followed by sleep is required in Console Apps.
        // This is to ensure that even if application terminates, telemetry is sent to the back-end.
        channel.Flush();
        Thread.Sleep(1000);
    }
}
```

This example uses the standalone package `Microsoft.Extensions.Logging.ApplicationInsights`. By default, this configuration uses the "bare minimum" TelemetryConfiguration for sending data to
Application Insights. Bare minimum means that InMemoryChannel is the channel that's used. There's no sampling and no standard TelemetryInitializers. This behavior can be overridden for a console application, as the following example shows.

Install this additional package:

```xml
<PackageReference Include="Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel" Version="2.9.1" />
```

The following section shows how to override the default TelemetryConfiguration by using the **services.Configure\<TelemetryConfiguration>()** method. This example sets up `ServerTelemetryChannel` and sampling. It adds a custom ITelemetryInitializer to the TelemetryConfiguration.

```csharp
    // Create the DI container.
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
    
    services.AddLogging(loggingBuilder =>
    {
        loggingBuilder.AddApplicationInsights("--YourAIKeyHere--");
    });

    ........
    ........

    // Explicitly calling Flush() followed by sleep is required in Console Apps.
    // This is to ensure that even if the application terminates, telemetry is sent to the back end.
    serverChannel.Flush();
    Thread.Sleep(1000);
```

## Control logging level

`ILogger` has a built-in mechanism to apply [log filtering](/aspnet/core/fundamentals/logging#log-filtering). This lets you control the logs that are sent to each registered provider, including the Application Insights provider. The filtering can be done either in configuration (typically by using an *appsettings.json* file) or in code.

The following examples show how to apply filter rules to `ApplicationInsightsLoggerProvider`.

### Create filter rules in configuration with appsettings.json

The `ApplicationInsightsLoggerProvider` is aliased as "ApplicationInsights". The following section of *appsettings.json* overrides the default <xref:Microsoft.Extensions.Logging.LogLevel.Warning?displayProperty=nameWithType> log level of Application Insights to log categories that start with "Microsoft" at level <xref:Microsoft.Extensions.Logging.LogLevel.Error?displayProperty=nameWithType> and above.

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

The following code snippet configures logs to <xref:Microsoft.Extensions.Logging.LogLevel.Warning?displayProperty=nameWithType> and above from all categories and for <xref:Microsoft.Extensions.Logging.LogLevel.Error?displayProperty=nameWithType> and above from categories that start with "Microsoft" to be sent to `ApplicationInsightsLoggerProvider`.

```csharp
Host.CreateDefaultBuilder(args)
    .UseStartup<Startup>()
    .ConfigureLogging(builder =>
    {
        builder.AddFilter<ApplicationInsightsLoggerProvider>("", LogLevel.Warning);
        builder.AddFilter<ApplicationInsightsLoggerProvider>("Microsoft", LogLevel.Error);
    });
```

This preceding code is functionally equivalent as the previous section in *appsettings.json*.

## Logging scopes

The `ApplicationInsightsLoggingProvider` supports [Log scopes](/dotnet/core/extensions/logging#log-scopes), and scopes are enabled by default. If the scope is of type `IReadOnlyCollection<KeyValuePair<string,object>>`, then each key-value pair in the collection is added to the Application Insights telemetry as custom properties. In the example below, logs will be captured as `TraceTelemetry` and will have `("MyKey", "MyValue")` in properties.

```csharp
using (_logger.BeginScope(new Dictionary<string, object> { ["MyKey"] = "MyValue" }))
{
    _logger.LogError("An example of an Error level message");
}
```

If any other type is used as Scope, then they will be stored under the property "Scope" in application insights telemetry. In the example below, the `TraceTelemetry` will have a property called "Scope" containing the scope.

```csharp
    using (_logger.BeginScope("hello scope"))
    {
        _logger.LogError("An example of an Error level message");
    }
```

## Frequently asked questions

### What are the old and new versions of ApplicationInsightsLoggerProvider?

[Microsoft.ApplicationInsights.AspNet SDK](https://www.nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore) included a built-in ApplicationInsightsLoggerProvider (Microsoft.ApplicationInsights.AspNetCore.Logging.ApplicationInsightsLoggerProvider), which was enabled through **ILoggerFactory** extension methods. This provider is marked obsolete from version 2.7.1. It will be removed completely in the next major version change. The [Microsoft.ApplicationInsights.AspNetCore 2.6.1](https://www.nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore) package itself isn't obsolete. It's required to enable monitoring of requests, dependencies, and so on.

The suggested alternative is the new standalone package [Microsoft.Extensions.Logging.ApplicationInsights](https://www.nuget.org/packages/Microsoft.Extensions.Logging.ApplicationInsights), which contains an improved ApplicationInsightsLoggerProvider (Microsoft.Extensions.Logging.ApplicationInsights.ApplicationInsightsLoggerProvider) and extension methods on ILoggerBuilder for enabling it.

[Microsoft.ApplicationInsights.AspNet SDK](https://www.nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore) version 2.7.1 takes a dependency on the new package and enables ILogger capture automatically.

### Why are some ILogger logs shown twice in Application Insights?

Duplication can occur if you have the older (now obsolete) version of ApplicationInsightsLoggerProvider enabled by calling `AddApplicationInsights` on `ILoggerFactory`. Check if your **Configure** method has
  the following, and remove it:

```csharp
 public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
 {
     loggerFactory.AddApplicationInsights(app.ApplicationServices, LogLevel.Warning);
     // ..other code.
 }
```

If you experience double logging when you debug from Visual Studio, set `EnableDebugLogger` to  *false* in the code that enables Application Insights, as follows. This duplication and fix is only relevant when you're debugging the application.

```csharp
 public void ConfigureServices(IServiceCollection services)
 {
     ApplicationInsightsServiceOptions options = new ApplicationInsightsServiceOptions();
     options.EnableDebugLogger = false;
     services.AddApplicationInsightsTelemetry(options);
     // ..other code.
 }
```

### I updated to [Microsoft.ApplicationInsights.AspNet SDK](https://www.nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore) version 2.7.1, and logs from ILogger are captured automatically. How do I turn off this feature completely?

See the [Control logging level](#control-logging-level) section to see how to filter logs in general. To turn-off ApplicationInsightsLoggerProvider, use `LogLevel.None`:

**In code:**

```csharp
builder.AddFilter<ApplicationInsightsLoggerProvider>("", LogLevel.None);
```

**In config:**

```json
{
  "Logging": {
    "ApplicationInsights": {
      "LogLevel": {
        "Default": "None"
      }
}
```

### Why do some ILogger logs not have the same properties as others?

Application Insights captures and sends ILogger logs by using the same TelemetryConfiguration that's used for every other telemetry. But there's an exception. By default, TelemetryConfiguration is not fully set up when you log from **Program.cs** or **Startup.cs**. Logs from these places won't have the default configuration, so they won't be running all TelemetryInitializers and TelemetryProcessors.

### I'm using the standalone package Microsoft.Extensions.Logging.ApplicationInsights, and I want to log some additional custom telemetry manually. How should I do that?

When you use the standalone package, `TelemetryClient` is not injected to the DI container, so you need to create a new instance of `TelemetryClient` and use the same configuration as the logger provider uses, as the following code shows. This ensures that the same configuration is used for all custom telemetry as well as telemetry from ILogger.

```csharp
public class MyController : ApiController
{
   // This TelemetryClient can be used to track additional telemetry using TrackXXX() api.
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
> If you use the Microsoft.ApplicationInsights.AspNetCore package to enable Application Insights, modify this code to get `TelemetryClient` directly in the constructor. For an example, see [this FAQ](./asp-net-core.md#frequently-asked-questions).

### What Application Insights telemetry type is produced from ILogger logs? Or where can I see ILogger logs in Application Insights?

ApplicationInsightsLoggerProvider captures ILogger logs and creates TraceTelemetry from them. If an Exception object is passed to the `Log` method on `ILogger`, *ExceptionTelemetry* is created instead of TraceTelemetry. These telemetry items can be found in same places as any other TraceTelemetry or ExceptionTelemetry for Application Insights, including portal, analytics, or Visual Studio local debugger.

If you prefer to always send TraceTelemetry, use this snippet: ```builder.AddApplicationInsights((opt) => opt.TrackExceptionsAsExceptionTelemetry = false);```

### I don't have the SDK installed, and I use the Azure Web Apps extension to enable Application Insights for my ASP.NET Core applications. How do I use the new provider? 

The Application Insights extension in Azure Web Apps uses the new provider. You can modify the filtering rules in the *appsettings.json* file for your application.

### I'm using the standalone package Microsoft.Extensions.Logging.ApplicationInsights and enabling Application Insights provider by calling **builder.AddApplicationInsights("ikey")**. Is there an option to get an instrumentation key from configuration?


Modify *Program.cs* and *appsettings.json* as follows:

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

   Relevant section from *appsettings.json*:

   ```json
   {
     "myikeyfromconfig": "putrealikeyhere"
   }
   ```

This code is required only when you use a standalone logging provider. For regular Application Insights monitoring, the instrumentation key is loaded automatically from the configuration path *ApplicationInsights: InstrumentationKey*. Appsettings.json should look like this:

   ```json
   {
     "ApplicationInsights":
       {
           "InstrumentationKey":"putrealikeyhere"
       }
   }
   ```

> [!IMPORTANT]
> [Connection Strings](./sdk-connection-string.md?tabs=net) are recommended over instrumentation keys. New Azure regions **require** the use of connection strings instead of instrumentation keys. Connection string identifies the resource that you want to associate your telemetry data with. It also allows you to modify the endpoints your resource will use as a destination for your telemetry. You will need to copy the connection string and add it to your application's code or to an environment variable.

## Next steps

* [Logging in ASP.NET Core](/aspnet/core/fundamentals/logging)
* [.NET trace logs in Application Insights](./asp-net-trace-logs.md)

