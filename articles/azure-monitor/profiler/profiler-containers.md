---
title: Profile Azure Containers with Application Insights Profiler
description: Enable Application Insights Profiler for Azure Containers.
ms.contributor: charles.weininger
ms.topic: conceptual
ms.date: 07/15/2022
ms.reviewer: jogrima
---

# Profile live Azure containers with Application Insights

You can enable the Application Insights Profiler for ASP.NET Core application running in your container almost without code. To enable the Application Insights Profiler on your container instance, you'll need to:

* Add the reference to the `Microsoft.ApplicationInsights.Profiler.AspNetCore` NuGet package.
* Set the environment variables to enable it.

In this article, you'll learn the various ways you can:
- Install the NuGet package in the project. 
- Set the environment variable via the orchestrator (like Kubernetes). 
- Learn security considerations around production deployment, like protecting your Application Insights Instrumentation key.

## Pre-requisites

- [An Application Insights resource](../app/create-new-resource.md). Make note of the instrumentation key.
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) to build docker images.
- [.NET 6 SDK](https://dotnet.microsoft.com/download/dotnet/6.0) installed.

## Set up the environment

1. Clone and use the following [sample project](https://github.com/microsoft/ApplicationInsights-Profiler-AspNetCore/tree/main/examples/EnableServiceProfilerForContainerAppNet6):
      
      ```bash
      git clone https://github.com/microsoft/ApplicationInsights-Profiler-AspNetCore.git
      ```

1. Navigate to the Container App example: 

   ```bash
   cd examples/EnableServiceProfilerForContainerAppNet6
   ```

1. This example is a bare bone project created by calling the following CLI command:

   ```powershell
   dotnet new mvc -n EnableServiceProfilerForContainerApp
   ```

   We've added delay in the `Controllers/WeatherForecastController.cs` project to simulate the bottleneck.

   ```CSharp
   [HttpGet(Name = "GetWeatherForecast")]
   public IEnumerable<WeatherForecast> Get()
   {
       SimulateDelay();
       ...
       // Other existing code.
   }
   private void SimulateDelay()
   {
       // Delay for 500ms to 2s to simulate a bottleneck.
       Thread.Sleep((new Random()).Next(500, 2000));
   }
   ```

1. Add the NuGet package to collect the Profiler traces:

   ```console
   dotnet add package Microsoft.ApplicationInsights.Profiler.AspNetCore
   ```

1. Enable Application Insights and Profiler in `Startup.cs`:

    ```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddApplicationInsightsTelemetry(); // Add this line of code to enable Application Insights.
        services.AddServiceProfiler(); // Add this line of code to Enable Profiler
        services.AddControllersWithViews();
    }
    ```

## Pull the latest ASP.NET Core build/runtime images

1. Navigate to the .NET Core 6.0 example directory.

   ```bash
   cd examples/EnableServiceProfilerForContainerAppNet6
   ```

1. Pull the latest ASP.NET Core images

   ```shell
   docker pull mcr.microsoft.com/dotnet/sdk:6.0
   docker pull mcr.microsoft.com/dotnet/aspnet:6.0
   ```

> [!TIP]
> Find the official images for Docker [SDK](https://hub.docker.com/_/microsoft-dotnet-sdk) and [runtime](https://hub.docker.com/_/microsoft-dotnet-aspnet).

## Add your Application Insights key

1. Via your Application Insights resource in the Azure portal, take note of your Application Insights instrumentation key.

   :::image type="content" source="./media/profiler-containerinstances/application-insights-key.png" alt-text="Screenshot of finding instrumentation key in Azure portal.":::

1. Open `appsettings.json` and add your Application Insights instrumentation key to this code section:

   ```json
   {
       "ApplicationInsights":
       {
           "InstrumentationKey": "Your instrumentation key"
       }
   }
   ```

## Build and run the Docker image

1. Review the `Dockerfile`.

1. Build the example image:

   ```bash
   docker build -t profilerapp .
   ```

1. Run the container:

   ```bash
   docker run -d -p 8080:80 --name testapp profilerapp
   ```

## View the container via your browser

To hit the endpoint, either:

- Visit `http://localhost:8080/weatherforecast` in your browser, or
- Use curl:
   
  ```terraform
  curl http://localhost:8080/weatherforecast
  ```


## Inspect the logs

Optionally, inspect the local log to see if a session of profiling finished:

```bash
docker logs testapp
```

In the local logs, note the following events:
   
```output
Starting application insights profiler with instrumentation key: your-instrumentation key # Double check the instrumentation key
Service Profiler session started.               # Profiler started.
Finished calling trace uploader. Exit code: 0   # Uploader is called with exit code 0.
Service Profiler session finished.              # A profiling session is completed.
```

## View the Service Profiler traces

1. Wait for 2-5 minutes so the events can be aggregated to Application Insights.
1. Open the **Performance** blade in your Application Insights resource. 
1. Once the trace process is complete, you'll see the Profiler Traces button like it below:

      :::image type="content" source="./media/profiler-containerinstances/profiler-traces.png" alt-text="Screenshot of Profile traces in the performance blade.":::



## Clean up resources

Run the following command to stop the example project:

```bash
docker rm -f testapp
```

## Next Steps
Learn how to...
> [!div class="nextstepaction"]
> [Generate load and view Profiler traces](./profiler-data.md)
