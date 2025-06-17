---
title: Troubleshoot with Diagnostics
description: Learn how to troubleshoot problems with your app in Azure App Service by using the diagnostics tool in the Azure portal. 
keywords: app service, azure app service, diagnostics, support, web app, troubleshooting, self-help
ms.topic: conceptual
ms.date: 04/23/2025
ms.author: msangapu
author: msangapu-msft
ms.custom: UpdateFrequency3
#customer intent: As an app developer, I want to understand the diagnostic tools that I can use with Azure App Service.
---
# Diagnostics in Azure App Service

This article explains how to troubleshoot issues with your app in Azure App Service. When you're running a web application, you want to be prepared for any problems that might arise. Such problems can range from HTTP 500 errors to your users telling you that your site is down.

Azure App Service diagnostics is an interactive experience to help you troubleshoot your app with no configuration required. App Service diagnostics points out what's wrong and guides you to the right information to more easily and quickly troubleshoot and resolve the problem.

Although this experience is most helpful for problems that occurred within the last 24 hours, all the diagnostic graphs are always available for you to analyze.

App Service diagnostics works for not only apps on Windows, but also for apps on built-in or custom containers, [App Service Environments](./environment/intro.md), and [Azure Functions](../azure-functions/functions-overview.md).

## Steps for opening App Service diagnostics

To access App Service diagnostics:

1. In the [Azure portal](https://portal.azure.com), go to your App Service web app or your App Service Environment.

1. On the sidebar menu, select **Diagnose and solve problems**.

    :::image type="content" source="./media/app-service-diagnostics/app-service-diagnostics-homepage.png" alt-text="Screenshot that shows the App Service diagnostics page for a selected resource in the portal." lightbox="./media/app-service-diagnostics/app-service-diagnostics-homepage.png":::

The App Service diagnostics page provides many tools to diagnose app problems. For more information, see [Diagnostic tools](#diagnostic-tools) later in this article.

> [!NOTE]
> If your app is down or performing slowly, you can [collect a profiling trace](https://azure.github.io/AppService/2018/06/06/App-Service-Diagnostics-Profiling-an-ASP.NET-Web-App-on-Azure-App-Service.html) to identify the root cause of the problem. Profiling is lightweight and is designed for production scenarios.

## Diagnostic interface

The page for App Service diagnostics offers streamlined diagnostic access in multiple sections.

### Search box

The search box is a quick way to find a diagnostic. You can find the same diagnostic through [troubleshooting categories](#troubleshooting-categories).

:::image type="content" source="./media/app-service-diagnostics/app-service-diagnostics-alerts-search.png" alt-text="Screenshot that shows search results related to availability in the search box in the portal.":::

### Risk alerts

The App Service diagnostics page performs a series of configuration checks and offers recommendations based on your application's unique configuration.

:::image type="content" source="./media/app-service-diagnostics/app-service-diagnostics-risk-alerts.png" alt-text="Screenshot that shows availability risk alerts with a count of problems found and a link to view more details.":::

To review recommendations and performed checks, select the **View more details** link. The information appears in a panel on the right side of the window.

:::image type="content" source="./media/app-service-diagnostics/app-service-diagnostics-risk-alerts-details.png" alt-text="Screenshot that shows detailed information for availability risk alerts." lightbox="./media/app-service-diagnostics/app-service-diagnostics-risk-alerts-details.png":::

### Troubleshooting categories

Diagnostics are grouped into troubleshooting categories for ease of discovery. The following categories are available:

- **Availability and Performance**
- **Configuration and Management**
- **SSL and Domains**
- **Risk Assessments**
- **Deployment**
- **Networking**
- **Navigator**
- **Diagnostic Tools**
- **Load Test your App**

The tiles show the available diagnostics for each category. If you select **Availability and Performance**, the following diagnostics are available on the sidebar menu:

- **Overview**
- **App Down Workflow**
- **Web App Down**
- **Application Logs**
- **CPU Usage**
- **Memory Usage**
- **Web App Troubleshooter**
- **Application Changes**
- **Linux - Number of Running Containers**
- **Linux Swap Space Low**
- **Process Fill List**
- **Process List**
- **SNAT Port Exhaustion**
- **TCP Connections**
- **Testing in Production**

## Diagnostic report

To investigate the problem further, you can select a topic and view more details in a diagnostic report. These details are often supplemented with graphs.

The diagnostic report can be a powerful tool for pinpointing the problem with your app. The following example is the **Web App Down** report in **Availability and Performance**.

:::image type="content" source="./media/app-service-diagnostics/full-diagnostic-report.png" alt-text="Screenshot that shows the Web App Down diagnostic report in the portal." lightbox="./media/app-service-diagnostics/full-diagnostic-report.png":::

## Investigation of application code problems (Windows apps only)

Because many app problems are related to application code, App Service diagnostics integrates with [Application Insights](/azure/azure-monitor/app/app-insights-overview) to highlight exceptions and dependency issues to correlate with the selected downtime. You enable Application Insights separately.

To view Application Insights exceptions and dependencies, select the **Web App Down** or **Web App Slow** tile shortcut.

## Troubleshooting steps

If a problem is detected in a specific category within the last 24 hours, you can view the full diagnostic report. App Service diagnostics might prompt you to view more troubleshooting advice and next steps for a more guided experience.

:::image type="content" source="./media/app-service-diagnostics/troubleshooting-and-next-steps.png" alt-text="Screenshot that shows troubleshooting options for HTTP server errors in the portal." lightbox="./media/app-service-diagnostics/troubleshooting-and-next-steps.png":::

## Diagnostic tools

App Service includes advanced diagnostic tools that help you investigate application code issues, slowness, connection strings, and more. It also includes proactive tools that help you mitigate problems with CPU usage, requests, and memory.

### Proactive CPU monitoring (Windows apps only)

Proactive CPU monitoring helps you take action when your app or a child process for your app is consuming high CPU resources. You can set your own CPU threshold rules to temporarily mitigate unexpectedly high CPU until the real cause is found. For more information, see the blog post [Mitigate your CPU problems before they happen](https://azure.github.io/AppService/2019/10/07/Mitigate-your-CPU-problems-before-they-even-happen.html).

### Auto-healing

Auto-healing is a mitigation action that you can take when your app has unexpected behavior. You can set your own rules based on request count, slow request, memory limit, and HTTP status code to trigger mitigation actions. Use the tool to temporarily mitigate an unexpected behavior until you find the root cause.

The tool is currently available for Windows web apps, Linux web apps, and Linux custom containers. Supported conditions and mitigation vary, depending on the type of web app. For more information, see the blog posts [Announcing the New Auto Healing Experience in App Service Diagnostics](https://azure.github.io/AppService/2018/09/10/Announcing-the-New-Auto-Healing-Experience-in-App-Service-Diagnostics.html) and [Announcing Auto Heal for Linux](https://azure.github.io/AppService/2021/04/21/Announcing-Autoheal-for-Azure-App-Service-Linux.html).

### Proactive auto-healing (Windows apps only)

Like proactive CPU monitoring, proactive auto-healing is a turnkey solution for mitigating unexpected behavior in your app. Proactive auto-healing restarts your app when App Service determines that your app is in an unrecoverable state. For more information, see the blog post [Introducing Proactive Auto Heal](https://azure.github.io/AppService/2017/08/17/Introducing-Proactive-Auto-Heal.html).

## Navigator (Windows apps only)

In a large team with continuous integration and many app dependencies, it can be difficult to pinpoint the specific change that causes an unhealthy behavior. Navigator helps get visibility on your app's topology by automatically rendering a dependency map of your app and all the resources in the same subscription.

Navigator lets you view a consolidated list of changes that your app and its dependencies made. You can then narrow down on a change that's causing unhealthy behavior. You access the feature through the **Navigator** tile on the page for App Service diagnostics. Before you can use the feature, you need to enable it. For more information, see the blog post [Get visibility into your app's dependencies with Navigator](https://azure.github.io/AppService/2019/08/06/Bring-visibility-to-your-app-and-its-dependencies-with-Navigator.html).

## Change analysis

You can access change analysis for app changes through the tile shortcuts **Application Changes** and **Application Crashes** in **Availability and Performance**. You can use change analysis concurrently with other metrics. Before you use the feature, you must enable it. For more information, see the blog post [Announcing the new change analysis experience in App Service Diagnostics](https://azure.github.io/AppService/2019/05/07/Announcing-the-new-change-analysis-experience-in-App-Service-Diagnostics-Analysis.html).

## Questions or feedback

Post your questions or feedback at [Share your ideas](https://feedback.azure.com/d365community/​) by adding **[Diag]** in the title.

## Related content

- [Tutorial: Run a load test to identify performance bottlenecks in a web app](../load-testing/tutorial-identify-bottlenecks-azure-portal.md)
