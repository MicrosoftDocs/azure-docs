---
title: Profile ASP.NET core Azure Linux web apps  with Application Insights Profiler | Microsoft Docs
description: Concept overview and step-by-step tutorial on how to enable it
services: application-insights
documentationcenter: ''
author: mrbullwinkle
manager: carmonm

ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: article
ms.date: 02/23/2018
ms.author: mbullwin

---

# Profiler ASP.NET Core Azure Linux Web Apps with Application Insights Profiler

*This feature is currently in preview

Find out how much time is spent in each method of your live web application when using [Application Insights](app-insights-overview.md). Profiler is now available for ASP.NET core web apps hosted in Linux on App Services. This guide provides step-by-step instruction on how profiler traces can be collected when the app runs locally and on Azure.

## Pre-requisites

* Make sure you have a Linux development environment. [Create a Linux virtual machine with the Azure portal](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/quick-create-portal)
* Install .NET core SDK 2.1.2 or later following instruction at [Get started with .NET in 10 minutes](https://www.microsoft.com/net/learn/get-started/linuxubuntu)
* Install Git in your Linux development machines

    ```
    sudo apt-get install git
    ```

## Setup development environment and run the app locally for collecting profiler traces

1. Clone the following project repository that contains an ASP.NET core 2.0 MVC web app with Application Insights enabled

    ```
    TODO: give link
    ```

2. Create an Application Insights resource in Azure. [Create an Application Insights resource](./app-insights-create-new-resource.md)

3. Replace the iKey in appsettings.json

    ```
    TODO: line of code
    ```

4. Add Profiler Nuget package in the project
    * Navigate to the project folder that contains the project file. ```.csproj```
    * Add package by the following command:

        ```
        TODO: command to add NuGet package
        ```

5. To enable service profiler, set the following environment variables in your command prompt. This setting will make the project to run for 2 minutes after the first request is hit.

    ```
    export ASPNETCORE_HOSTINGSTARTUPASSEMBLIES=ServiceProfiler.EventPipe.AspNetCore
    ```

Alternatively, you can change the profiling running time interval by using the following code in IServiceCollection:

    ```csharp
    services.AddServiceProfiler(TimeSpan.FromSeconds(45), TimeSpan.FromMinutes(30), TimeSpan.FromSeconds(10));
    ```

6. Run the app using the following command:

    ```
    dotnet run
    ```

7. Access the website from your browser to generate some requests. To view traces, navigate to your Application Insights resource, Performance Blade, click on the "Profiler traces" button at the bottom right corner.

    TODO: screenshot

## Deploy your app to a container hosted on Azure App Services

1. Stop running your site locally

2. Create a ```.dockerfile``` to build your image

    ```
    FROM microsoft/aspnetcore-build:2.0.5-2.1.4 AS build-env
    WORKDIR /app

    # Copy csproj and restore as distinct layers
    COPY *.csproj ./
    COPY Nuget.Config ./
    RUN dotnet restore --configfile ./Nuget.Config

    # Copy everything else and build
    COPY . ./
    RUN dotnet publish -c Release -o out

    # Build runtime image
    FROM microsoft/aspnetcore:2.0.5
    WORKDIR /app
    COPY --from=build-env /app/out .

    # Inject ServiceProfiler
    ENV ASPNETCORE_HOSTINGSTARTUPASSEMBLIES=ServiceProfiler.EventPipe.AspNetCore

    # Start the service
    ENTRYPOINT ["dotnet", "ServiceProfilerE2EBase.dll"]
    ```

3. Create a ```.dockerignore``` file to exclude the following folders
    ```
    bin\
    obj\
    ```
4. Test the docker image locally:
    ```
    docker run -p 80:8080 saars/netcore-sp-docker:0.2.0
    ```
5. Publish the docker container to Azure app services by following instructions at [Use a custom Docker image for Web App for Containers](../app-service/containers/tutorial-custom-docker-image.md)

6. Access your site in a browser to generate some traffic

7. Navigate to your Application Insights resource and view your Profiler traces
