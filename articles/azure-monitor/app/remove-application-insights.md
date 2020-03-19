---
title: Remove Application Insights in Visual Studio - Azure Monitor 
description: How to remove Application Insights SDK for ASP.NET and .NET Core in Visual Studio. 
ms.topic: conceptual
ms.date: 03/16/2020

---

# How to remove Application Insights in Visual Studio

This article will show you how to remove the ASP.NET and .NET Core Application Insights SDK in Visual Studio.

## Option 1: Using the Package Management Console

1. To open the Package Management Console, in the top menu select Tools > NuGet Package Manager > Package Manager Console.
    > [!div class="mx-imgBorder"]
    >![In the top menu click Tools > NuGet Package Manager > Package Manager Console](./media/remove-application-insights/package-manager.png)

1. Enter the following command: `Uninstall-Package Microsoft.ApplicationInsights.Web -RemoveDependencies`

    After entering the command, the Application Insights package and all of its dependencies will be uninstalled from the project.
    > [!div class="mx-imgBorder"]
    >![Enter command in console](./media/remove-application-insights/package-management-console.png)

## Option 2: Using the Visual Studio NuGet UI

1. In the *Solution Explore* on the right, right click on **Solution** and select **Manage NuGet Packages for Solution**

     You'll then see a screen that allows you to edit all the NuGet packages that are part of the project.
    > [!div class="mx-imgBorder"]
    >![Right click Solution, in the Solution Explore, then select Manage NuGet Packages for Solution](./media/remove-application-insights/manage-nuget1.png)

1. Click on the "Microsoft.ApplicationInsights.Web" package. On the right, check the checkbox next to **Project** to select all projects.
    > [!div class="mx-imgBorder"]
    >![Select the Microsoft.ApplicationInsights.Web package and project on the right.](./media/remove-application-insights/manage-nuget2.png)

1. To remove all dependencies when uninstalling, select the **Options** dropdown button below the section where you selected project.
    a. Under *Uninstall Options*, select the checkbox next to *Remove dependencies*.

    > [!div class="mx-imgBorder"]
    >![Select remove dependencies](./media/remove-application-insights/remove-dependencies.png)

1.  Select **Uninstall**.

     > [!div class="mx-imgBorder"]
    >![Select Uninstall under the project box](./media/remove-application-insights/uninstall.png)

    a.  A dialog box will display that shows all of the unnecessary dependencies to be removed from the application. Select **approve** to remove them.

1. After everything is uninstalled, you may still see  "ApplicationInsights.config" and "ErrorHandler" folders in the *Solution Explore*. You can delete the two folders manually.
