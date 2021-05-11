---
title: Explore .NET trace logs with ILogger - Azure Application Insights
description: Samples of using the Azure Application Insights ILogger provider with ASP.NET Core and Console applications.
ms.topic: conceptual
ms.date: 02/19/2019

ms.reviewer: mbullwin
---

# ApplicationInsightsLoggerProvider for Microsoft.Extension.Logging

This article demonstrates how to use `ApplicationInsightsLoggerProvider` to capture `ILogger` logs in console and ASP.NET Core applications.
To learn more logging, see [Logging in ASP.NET Core](/aspnet/core/fundamentals/logging).

## ASP.NET Core applications

`ApplicationInsightsLoggerProvider` is enabled by default for ASP.NET Core applications when ApplicationInsights is configured using [Code](./asp-net-core.md) or [Code-less](./azure-web-apps.md?tabs=netcore#enable-agent-based-monitoring) approach.

Only *Warning* and above `ILogger` logs (from all [categories](/aspnet/core/fundamentals/logging/#log-category)) are sent to Application Insights by default. But you can [customize this behavior](./asp-net-core.md#how-do-i-customize-ilogger-logs-collection). Additional steps are required to capture ILogger logs from **Program.cs** or **Startup.cs**. (See [Capturing ILogger logs from Startup.cs and Program.cs in ASP.NET Core applications](#capture-ilogger-logs-from-startupcs-and-programcs-in-aspnet-core-apps).)

If you want to just use `ApplicationInsightsLoggerProvider` without any other Application Insights monitoring, use the following steps.

1. Install the NuGet package:

   ```xml
    <ItemGroup>
        <PackageReference Include="Microsoft.Extensions.Logging.ApplicationInsights" Version="2.15.0" />  
    </ItemGroup>
   ```

1. Modify `Program.cs` as shown here:

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
                   // Providing an instrumentation key here is required if you're using
                   // standalone package Microsoft.Extensions.Logging.ApplicationInsights
                   // or if you want to capture logs from early in the application startup
                   // pipeline from Startup.cs or Program.cs itself.
                   builder.AddApplicationInsights("put-actual-ikey-here");

                   // Optional: Apply filters to control what logs are sent to Application Insights.
                   // The following configures LogLevel Information or above to be sent to
                   // Application Insights for all categories.
                   builder.AddFilter<Microsoft.Extensions.Logging.ApplicationInsights.ApplicationInsightsLoggerProvider>
                                    ("", LogLevel.Information);
               }
           );
   }
   ```

The code in step 2 configures `ApplicationInsightsLoggerProvider`. The following code shows an example Controller class, which uses `ILogger` to send logs. The logs are captured by Application Insights.

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
        _logger.LogWarning("An example of a Warning trace..");
        _logger.LogError("An example of an Error level message");
        return new string[] { "value1", "value2" };
    }
}
```

### Capture ILogger logs from Startup.cs and Program.cs in ASP.NET Core apps

> [!NOTE]
> In ASP.NET Core 3.0 and later, it is no longer possible to inject `ILogger` in Startup.cs and Program.cs. See https://github.com/aspnet/Announcements/issues/353 for more details.

`ApplicationInsightsLoggerProvider` can capture logs from early in the application startup. Although ApplicationInsightsLoggerProvider is automatically enabled in  Application Insights (starting with version 2.7.1), it doesn't have an instrumentation key set up until later in the pipeline. So, only logs from **Controller**/other classes will be captured. To capture every log starting with **Program.cs** and **Startup.cs** itself, you must explicitly enable an instrumentation key for ApplicationInsightsLoggerProvider. Also, *TelemetryConfiguration* is not fully set up when you log from **Program.cs** or **Startup.cs** itself. So those logs will have a minimum configuration that uses [InMemoryChannel](./telemetry-channels.md), no [sampling](./sampling.md), and no standard [telemetry initializers or processors](./api-filtering-sampling.md).

The following examples demonstrate this capability with **Program.cs** and **Startup.cs**.

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
        logger.LogInformation("From Program. Running the host now..");
        host.Run();
    }

    public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
    WebHost.CreateDefaultBuilder(args)
        .UseStartup<Startup>()
        .ConfigureLogging(
        builder =>
            {
            // Providing an instrumentation key here is required if you're using
            // standalone package Microsoft.Extensions.Logging.ApplicationInsights
            // or if you want to capture logs from early in the application startup 
            // pipeline from Startup.cs or Program.cs itself.
            builder.AddApplicationInsights("ikey");

            // Adding the filter below to ensure logs of all severity from Program.cs
            // is sent to ApplicationInsights.
            builder.AddFilter<Microsoft.Extensions.Logging.ApplicationInsights.ApplicationInsightsLoggerProvider>
                             (typeof(Program).FullName, LogLevel.Trace);

            // Adding the filter below to ensure logs of all severity from Startup.cs
            // is sent to ApplicationInsights.
            builder.AddFilter<Microsoft.Extensions.Logging.ApplicationInsights.ApplicationInsightsLoggerProvider>
                             (typeof(Startup).FullName, LogLevel.Trace);
            }
        );
}
```

#### Example Startup.cs

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

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddApplicationInsightsTelemetry();

        // The following will be picked up by Application Insights.
        _logger.LogInformation("Logging from ConfigureServices.");
    }

    public void Configure(IApplicationBuilder app, IHostingEnvironment env)
    {
        if (env.IsDevelopment())
        {
            _logger.LogInformation("Configuring for Development environment");
            app.UseDeveloperExceptionPage();
        }
        else
        {
            _logger.LogInformation("Configuring for Production environment");
        }

        app.UseMvc();
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

If you want to just use ApplicationInsightsLoggerProvider without any other Application Insights monitoring, use the following steps.

Packages installed:

```xml
<ItemGroup>
  <PackageReference Include="Microsoft.Extensions.DependencyInjection" Version="2.1.0" />  
  <PackageReference Include="Microsoft.Extensions.Logging.ApplicationInsights" Version="2.15.0" />  
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

For ApplicationInsightsLoggerProvider, the provider alias is `ApplicationInsights`. The following section of *appsettings.json* instructs logging providers generally to log at level *Warning* and above. It then overrides the `ApplicationInsightsLoggerProvider` to log categories that start with "Microsoft" at level *Error* and above.

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

The following code snippet configures logs for *Warning* and above from all categories and for *Error* and above from categories that start with "Microsoft" to be sent to `ApplicationInsightsLoggerProvider`. This configuration is the same as in the previous section in *appsettings.json*.

```csharp
    WebHost.CreateDefaultBuilder(args)
    .UseStartup<Startup>()
    .ConfigureLogging(logging =>
      logging.AddFilter<Microsoft.Extensions.Logging.ApplicationInsights.ApplicationInsightsLoggerProvider>
                        ("", LogLevel.Warning)
             .AddFilter<Microsoft.Extensions.Logging.ApplicationInsights.ApplicationInsightsLoggerProvider>
                        ("Microsoft", LogLevel.Error);
```

## Logging Scopes

`ApplicationInsightsLoggingProvider` supports [Log Scopes](/aspnet/core/fundamentals/logging#log-scopes) and scopes are enabled by default.

If the scope is of type `IReadOnlyCollection<KeyValuePair<string,object>>`, then each key-value pair in the collection is added to the application insights telemetry as custom properties. In the example below, logs will be captured as `TraceTelemetry` and will have ("MyKey", "MyValue") in properties.

```csharp
    using (_logger.BeginScope(new Dictionary<string, object> { { "MyKey", "MyValue" } }))
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
    builder.AddFilter<Microsoft.Extensions.Logging.ApplicationInsights.ApplicationInsightsLoggerProvider>
                      ("", LogLevel.None);
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
   // This telemetryclient can be used to track additional telemetry using TrackXXX() api.
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


Modify Program.cs and appsettings.json as follows:

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

   Relevant section from `appsettings.json`:

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
> New Azure regions **require** the use of connection strings instead of instrumentation keys. [Connection string](./sdk-connection-string.md?tabs=net) identifies the resource that you want to associate your telemetry data with. It also allows you to modify the endpoints your resource will use as a destination for your telemetry. You will need to copy the connection string and add it to your application's code or to an environment variable.

## Next steps

Learn more about:

* [Logging in ASP.NET Core](/aspnet/core/fundamentals/logging)
* [.NET trace logs in Application Insights](./asp-net-trace-logs.md)

