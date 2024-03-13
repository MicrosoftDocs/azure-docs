---
title: Enable Profiler for ASP.NET Core web apps hosted in Linux
description: Learn how to enable Profiler on your ASP.NET Core web application hosted in Linux on Azure App Service.
ms.topic: how-to
ms.devlang: csharp
ms.custom: devx-track-csharp
ms.date: 09/22/2023
ms.reviewer: charles.weininger
# Customer Intent: As a .NET developer, I'd like to enable Application Insights Profiler for my .NET web application hosted in Linux
---

# Enable Profiler for ASP.NET Core web apps hosted in Linux

By using Profiler, you can track how much time is spent in each method of your live ASP.NET Core web apps that are hosted in Linux on Azure App Service. This article focuses on web apps hosted in Linux. You can also experiment by using Linux, Windows, and Mac development environments.

In this article, you:

- Set up and deploy an ASP.NET Core web application hosted on Linux.
- Add Application Insights Profiler to the ASP.NET Core web application.

## Prerequisites

- Install the [latest .NET Core SDK](https://dotnet.microsoft.com/download/dotnet).
- Install Git by following the instructions at [Getting started: Installing Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).
- Review the following samples for context:
  - [Enable Service Profiler for containerized ASP.NET Core Application (.NET 6)](https://github.com/microsoft/ApplicationInsights-Profiler-AspNetCore/tree/main/examples/EnableServiceProfilerForContainerAppNet6)
  - [Application Insights Profiler for Worker Service example](https://github.com/microsoft/ApplicationInsights-Profiler-AspNetCore/tree/main/examples/ServiceProfilerInWorkerNet6)

## Set up the project locally

1. Open a command prompt window on your machine.

1. Create an ASP.NET Core MVC web application:

   ```console
   dotnet new mvc -n LinuxProfilerTest
   ```

1. Change the working directory to the root folder for the project.

1. Add the NuGet package to collect the Profiler traces:

   ```console
   dotnet add package Microsoft.ApplicationInsights.Profiler.AspNetCore
   ```

1. In your preferred code editor, enable Application Insights and Profiler in `Program.cs`. [Add custom Profiler settings, if applicable](https://github.com/microsoft/ApplicationInsights-Profiler-AspNetCore/blob/main/Configurations.md).

   For `WebAPI`:

    ```csharp
    // Add services to the container.
    builder.Services.AddApplicationInsightsTelemetry();
    builder.Services.AddServiceProfiler();
    ```

   For `Worker`:

    ```csharp
    IHost host = Host.CreateDefaultBuilder(args)
        .ConfigureServices(services =>
        {
            services.AddApplicationInsightsTelemetryWorkerService();
            services.AddServiceProfiler();
            
            // Assuming Worker is your background service class.
            services.AddHostedService<Worker>();
        })
        .Build();
    
    await host.RunAsync();
    ```

1. Save and commit your changes to the local repository:

    ```console
    git init
    git add .
    git commit -m "first commit"
    ```

## Create the Linux web app to host your project

1. In the Azure portal, create a web app environment by using App Service on Linux.

   :::image type="content" source="./media/profiler-aspnetcore-linux/create-web-app.png" alt-text="Screenshot that shows creating the Linux web app.":::

1. Go to your new web app resource and select **Deployment Center** > **FTPS credentials** to create the deployment credentials. Make a note of your credentials to use later.

   :::image type="content" source="./media/profiler-aspnetcore-linux/credentials.png" alt-text="Screenshot that shows creating the deployment credentials.":::    

1. Select **Save**.
1. Select the **Settings** tab.
1. In the dropdown, select **Local Git** to set up a local Git repository in the web app.

   :::image type="content" source="./media/profiler-aspnetcore-linux/deployment-options.png" alt-text="Screenshot that shows view deployment options in a dropdown.":::    

1. Select **Save** to create a Git repository with a Git clone URI.

   :::image type="content" source="./media/profiler-aspnetcore-linux/local-git-repo.png" alt-text="Screenshot that shows setting up the local Git repository.":::    

   For more deployment options, see the [App Service documentation](../../app-service/deploy-best-practices.md).

## Deploy your project

1. In your command prompt window, browse to the root folder for your project. Add a Git remote repository to point to the repository on App Service:

    ```console
    git remote add azure https://<username>@<app_name>.scm.azurewebsites.net:443/<app_name>.git
    ```

    - Use the **username** that you used to create the deployment credentials.
    - Use the **app name** that you used to create the web app by using App Service on Linux.

1. Deploy the project by pushing the changes to Azure:

    ```console
    git push azure main
    ```

    You should see output similar to the following example:

    ```output
    Counting objects: 9, done.
    Delta compression using up to 8 threads.
    Compressing objects: 100% (8/8), done.
    Writing objects: 100% (9/9), 1.78 KiB | 911.00 KiB/s, done.
    Total 9 (delta 3), reused 0 (delta 0)
    remote: Updating branch 'main'.
    remote: Updating submodules.
    remote: Preparing deployment for commit id 'd7369a99d7'.
    remote: Generating deployment script.
    remote: Running deployment command...
    remote: Handling ASP.NET Core Web Application deployment.
    remote: ......
    remote:   Restoring packages for /home/site/repository/EventPipeExampleLinux.csproj...
    remote: .
    remote:   Installing Newtonsoft.Json 10.0.3.
    remote:   Installing Microsoft.ApplicationInsights.Profiler.Core 1.1.0-LKG
    ...
    ```

## Add Application Insights to monitor your web app

You have three options to add Application Insights to your web app:

- By using the **Application Insights** pane in the Azure portal.
- By using the **Configuration** pane in the Azure portal.
- By manually adding to your web app settings.

# [Application Insights pane](#tab/enablement)

1. In your web app on the Azure portal, select **Application Insights** on the left pane. 
1. Select **Turn on Application Insights**.

   :::image type="content" source="./media/profiler-aspnetcore-linux/turn-on-app-insights.png" alt-text="Screenshot that shows turning on Application Insights.":::    

1. Under **Application Insights**, select **Enable**.

   :::image type="content" source="./media/profiler-aspnetcore-linux/enable-app-insights.png" alt-text="Screenshot that shows enabling Application Insights.":::    

1. Under **Link to an Application Insights resource**, either create a new resource or select an existing resource. For this example, we create a new resource.

   :::image type="content" source="./media/profiler-aspnetcore-linux/link-app-insights.png" alt-text="Screenshot that shows linking Application Insights to a new or existing resource.":::    

1. Select **Apply** > **Yes** to apply and confirm.

# [Configuration pane](#tab/config)

1. [Create an Application Insights resource](../app/create-workspace-resource.md) in the same Azure subscription as your App Service instance.
1. Go to the Application Insights resource.
1. Copy the **Instrumentation Key** (iKey).
1. In your web app in the Azure portal, select **Configuration** on the left pane.
1. Select **New application setting**.

   :::image type="content" source="./media/profiler-aspnetcore-linux/new-setting-configuration.png" alt-text="Screenshot that shows adding a new application setting in the Configuration pane.":::    

1. Add the following settings in the **Add/Edit application setting** pane by using your saved iKey:

   | Name | Value |
   | ---- | ----- |
   | APPINSIGHTS_INSTRUMENTATIONKEY | [YOUR_APPINSIGHTS_KEY] |

   :::image type="content" source="./media/profiler-aspnetcore-linux/add-ikey-settings.png" alt-text="Screenshot that shows adding the iKey to the Settings pane.":::    

1. Select **OK**.

   :::image type="content" source="./media/profiler-aspnetcore-linux/save-app-insights-key.png" alt-text="Screenshot that shows saving the Application Insights key settings.":::    

1. Select **Save**.

# [Web app settings](#tab/appsettings)

1. [Create an Application Insights resource](../app/create-workspace-resource.md) in the same Azure subscription as your App Service instance.
1. Go to the Application Insights resource.
1. Copy the **Instrumentation Key** (iKey).
1. In your preferred code editor, go to your ASP.NET Core project's `appsettings.json` file.
1. Add the following code and insert your copied iKey:

   ```json
   "ApplicationInsights":
   {
     "InstrumentationKey": "<your-instrumentation-key>"
   }
   ```

1. Save `appsettings.json` to apply the settings change.

---

## Next steps

> [!div class="nextstepaction"]
> [Generate load and view Profiler traces](./profiler-data.md)