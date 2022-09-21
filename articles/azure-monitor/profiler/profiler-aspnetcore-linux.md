---
title: Enable Profiler for ASP.NET Core web applications hosted in Linux on App Services | Microsoft Docs
description: Learn how to enable Profiler on your ASP.NET Core web application hosted in Linux on App Services.
ms.topic: conceptual
ms.devlang: csharp
ms.custom: devx-track-csharp
ms.date: 07/18/2022
ms.reviewer: charles.weininger
---

# Enable Profiler for ASP.NET Core web applications hosted in Linux on App Services

Using Profiler, you can track how much time is spent in each method of your live ASP.NET Core web apps that are hosted in Linux on Azure App Service. While this guide focuses on web apps hosted in Linux, you can experiment using Linux, Windows, and Mac development environments.

In this guide, you'll:

> [!div class="checklist"]
> - Set up and deploy an ASP.NET Core web application hosted on Linux.
> - Add Application Insights Profiler to the ASP.NET Core web application.
 
## Prerequisites

- Install the [latest and greatest .NET Core SDK](https://dotnet.microsoft.com/download/dotnet).
- Install Git by following the instructions at [Getting Started - Installing Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

## Set up the project locally

1. Open a Command Prompt window on your machine.

1. Create an ASP.NET Core MVC web application:

   ```console
   dotnet new mvc -n LinuxProfilerTest
   ```

1. Change the working directory to the root folder for the project.

1. Add the NuGet package to collect the Profiler traces:

   ```console
   dotnet add package Microsoft.ApplicationInsights.Profiler.AspNetCore
   ```

1. In your preferred code editor, enable Application Insights and Profiler in `Program.cs`:

    ```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddApplicationInsightsTelemetry(); // Add this line of code to enable Application Insights.
        services.AddServiceProfiler(); // Add this line of code to Enable Profiler
        services.AddControllersWithViews();
    }
    ```

1. Add a line of code in the **HomeController.cs** section to randomly delay a few seconds:

    ```csharp
    using System.Threading;
    ...

    public IActionResult About()
        {
            Random r = new Random();
            int delay = r.Next(5000, 10000);
            Thread.Sleep(delay);
            return View();
        }
    ```

1. Save and commit your changes to the local repository:

    ```console
    git init
    git add .
    git commit -m "first commit"
    ```

## Create the Linux web app to host your project

1. In the Azure portal, create a web app environment by using App Service on Linux:

   :::image type="content" source="./media/profiler-aspnetcore-linux/create-web-app.png" alt-text="Screenshot of creating the Linux web app.":::

1. Go to your new web app resource and select **Deployment Center** > **FTPS credentials** to create the deployment credentials. Make note of your credentials to use later.

   :::image type="content" source="./media/profiler-aspnetcore-linux/credentials.png" alt-text="Screenshot of creating the deployment credentials.":::    

1. Click **Save**.
1. Select the **Settings** tab. 
1. In the drop-down, select **Local Git** to set up a local Git repository in the web app.

   :::image type="content" source="./media/profiler-aspnetcore-linux/deployment-options.png" alt-text="Screenshot of view deployment options in a drop-down.":::    

1. Click **Save** to create a Git repository with a Git Clone Uri. 

   :::image type="content" source="./media/profiler-aspnetcore-linux/local-git-repo.png" alt-text="Screenshot of setting up the local Git repository.":::    

   For more deployment options, see [App Service documentation](../../app-service/deploy-best-practices.md).

## Deploy your project

1. In your Command Prompt window, browse to the root folder for your project. Add a Git remote repository to point to the repository on App Service:

    ```console
    git remote add azure https://<username>@<app_name>.scm.azurewebsites.net:443/<app_name>.git
    ```

    * Use the **username** that you used to create the deployment credentials.
    * Use the **app name** that you used to create the web app by using App Service on Linux.

2. Deploy the project by pushing the changes to Azure:

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

You can add Application Insights to your web app either via:

- The Enablement blade in the Azure portal,
- The Configuration blade in the Azure portal, or 
- Manually adding to your web app settings.

# [Enablement blade](#tab/enablement)

1. In your web app on the Azure portal, select **Application Insights** in the left side menu. 
1. Click **Turn on Application Insights**. 

   :::image type="content" source="./media/profiler-aspnetcore-linux/turn-on-app-insights.png" alt-text="Screenshot of turning on Application Insights.":::    

1. Under **Application Insights**, select **Enable**.

   :::image type="content" source="./media/profiler-aspnetcore-linux/enable-app-insights.png" alt-text="Screenshot of enabling Application Insights.":::    

1. Under **Link to an Application Insights resource**, either create a new resource or select an existing resource. For this example, we'll create a new resource.

   :::image type="content" source="./media/profiler-aspnetcore-linux/link-app-insights.png" alt-text="Screenshot of linking your Application Insights to a new or existing resource.":::    

1. Click **Apply** > **Yes** to apply and confirm.

# [Configuration blade](#tab/config)

1. [Create an Application Insights resource](../app/create-workspace-resource.md) in the same Azure subscription as your App Service.
1. Navigate to the Application Insights resource.
1. Copy the **Instrumentation Key** (iKey).
1. In your web app on the Azure portal, select **Configuration** in the left side menu. 
1. Click **New application setting**.

   :::image type="content" source="./media/profiler-aspnetcore-linux/new-setting-configuration.png" alt-text="Screenshot of adding new application setting in the configuration blade.":::    

1. Add the following settings in the **Add/Edit application setting** pane, using your saved iKey:

   | Name | Value |
   | ---- | ----- |
   | APPINSIGHTS_INSTRUMENTATIONKEY | [YOUR_APPINSIGHTS_KEY] |

   :::image type="content" source="./media/profiler-aspnetcore-linux/add-ikey-settings.png" alt-text="Screenshot of adding iKey to the settings pane.":::    

1. Click **OK**.

   :::image type="content" source="./media/profiler-aspnetcore-linux/save-app-insights-key.png" alt-text="Screenshot of saving the application insights key settings.":::    

1. Click **Save**.

# [Web app settings](#tab/appsettings)

1. [Create an Application Insights resource](../app/create-workspace-resource.md) in the same Azure subscription as your App Service.
1. Navigate to the Application Insights resource.
1. Copy the **Instrumentation Key** (iKey).
1. In your preferred code editor, navigate to your ASP.NET Core project's `appsettings.json` file.
1. Add the following and insert your copied iKey:

   ```json
   "ApplicationInsights":
   {
     "InstrumentationKey": "<your-instrumentation-key>"
   }
   ```

1. Save `appsettings.json` to apply the settings change.

---

## Next steps
Learn how to...
> [!div class="nextstepaction"]
> [Generate load and view Profiler traces](./profiler-data.md)