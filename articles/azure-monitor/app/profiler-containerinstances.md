---
title: Profile Linux container in Azure with Application Insights Profiler
description: Enable Application Insights Profiler for Azure Container Instances.
ms.author: hannahhunter
author: hhunter-ms
ms.contributor: charles.weininger
ms.topic: conceptual
ms.date: 03/28/2022
---

# Profile a Linux container in Azure with Application Insights Profiler

You can enable the Application Insights Profiler for ASP.NET Core application running in Linux container almost without code. To enable the Application Insights Profiler on your container instance, you'll need to:

* Add the reference to the NuGet package.
* Set the environment variables to enable it.

In this article, you'll learn the various ways you can:
- Install the NuGet package in the project. 
- Set the environment variable via the orchestrator (like Kubernetes). 
- Learn security considerations around production deployment, like protecting your Application Insights Instrumentation key.

## Pre-requisites

[An Application Insights resource](https://docs.microsoft.com/en-us/azure/application-insights/app-insights-create-new-resource). Make note of the instrumentation key.

## Set up the environment

1. Clone and use the following sample project:
      
      ```bash
      git clone https://github.com/microsoft/ApplicationInsights-Profiler-AspNetCore.git
      ```

1. Navigate to the Container Instances example:

   ```bash
   cd examples/EnableServiceProfilerForContainerApp
   ```

1. This example is a bare bone project created by calling the following CLI command:

   ```powershell
   dotnet new mvc -n EnableServiceProfilerForContainerApp
   ```

   Note that we've added delay in the `Controllers/HomeController.cs` to simulate the bottleneck.

   ```CSharp
   private void SimulateDelay()
   {
       // Delay for 500ms to 2s to simulate a bottleneck.
       Thread.Sleep((new Random()).Next(500, 2000));
   }
   ```

## Pull the latest ASP.NET Core build/runtime images

1. Navigate to the example directory.

   ```bash
   cd ~/EnableServiceProfilerForContainerApp
   ```

1. Pull the latest ASP.NET Core images

   ```shell
   docker pull mcr.microsoft.com/dotnet/sdk:3.1
   docker pull mcr.microsoft.com/dotnet/aspnet:3.1
   ```

> [!TIP]
> Find the official images for Docker [SDK](https://hub.docker.com/_/microsoft-dotnet-sdk) and [runtime](https://hub.docker.com/_/microsoft-dotnet-aspnet).

## Create a Dockerfile for the application

To enable the Profiler, you'll need:
- NuGet package to be installed.
- Proper environment variables need to be set. 

In the sample project, you'll accomplish this with the following lines in the Dockerfile.

1. Navigate to the Dockerfile in your `EnableServiceProfilerForContainerApp` sample project.

   ```bash
   cd Dockerfile .
   ```

1. Verify the Dockerfile contains the following lines:

   ```dockerfile
   # Adding a reference to hosting startup package
   RUN dotnet add package Microsoft.ApplicationInsights.Profiler.AspNetCore -v 2.*
   
   # Create an argument to allow docker builder to passing in application insights key.
   # For example: docker build . --build-arg APPINSIGHTS_KEY=YOUR_APPLICATIONINSIGHTS_INSTRUMENTATION_KEY
   ARG APPINSIGHTS_KEY
   # Making sure the argument is set. Fail the build of the container otherwise.
   RUN test -n "$APPINSIGHTS_KEY"
   
   # Light up Application Insights and Service Profiler
   ENV APPINSIGHTS_INSTRUMENTATIONKEY $APPINSIGHTS_KEY
   ENV ASPNETCORE_HOSTINGSTARTUPASSEMBLIES Microsoft.ApplicationInsights.Profiler.AspNetCore
   ```

To make your build context as small as possible, the sample includes a [.dockerignore](./.dockerignore) file.

## Review your Application Insights key

Verify you've saved your Application Insights instrumentation key.

## Set the Profiler log level to "Information" (optional)

The following settings have been added to the application's `appsettings.json` file to reveal some Profiler logs:

```json
    "LogLevel": {
      "Default": "Warning",
      "ServiceProfiler":"Information"
    }
```

## Build and run the Docker image

Run the following command, replacing `<YOUR_APPLICATION_INSIGHTS_KEY>` with the real instrumentation key you saved [from the previous step](#create-an-application-insights-resource).

```powershell
docker build -t enable-sp-example --build-arg APPINSIGHTS_KEY=<YOUR_APPLICATION_INSIGHTS_KEY> .
docker run -p 8080:80 --name enable-sp enable-sp-example
```

Once the container starts to run, the Profiler will kick in for two minutes.

## View the web page running from a container

Go to [localhost:8080](http://localhost:8080) to:
- Access your app in a web browser. 
- Generate some web traffic for the Profiler to catch the traces.

## Inspect the logs

If you have set up the Profiler log level to "Information" and you run the container attached, you will see the info logs similar to:

```powershell
info: ServiceProfiler.EventPipe.Client.Schedules.TraceSchedule[0]
      Service Profiler session started.
info: ServiceProfiler.EventPipe.Client.Schedules.TraceSchedule[0]
      Service Profiler session finished. Samples: 8
info: ServiceProfiler.EventPipe.Client.TraceUploader.TraceUploaderProxy[0]
      Finished calling trace uploader. Exit code: 0
```

Samples larger than `0` mean the trace has been gathered.

You can also run the following command to check the container logs:

```powershell
docker container logs myapp
```

## View the Service Profiler traces

1. Wait for 2-5 minutes so the events can be aggregated to Application Insights.
1. Open the **Performance** blade in your Application Insights resource. 
1. Once the trace process is complete, you will see the Profiler Traces button like it below:

![Profiler Traces](../../media/performance-blade.png)

## Next Steps

- Learn more about [Application Insights Profiler](./profiler-overview.md).
- Learn how to enable Profiler in your [ASP.NET Core applications run on Linux](./profiler-aspnetcore-linux.md).