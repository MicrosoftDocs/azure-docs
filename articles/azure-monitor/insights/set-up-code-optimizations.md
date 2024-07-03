---
title: Set up Code Optimizations (Preview)
description: Learn how to enable and set up Azure Monitor's Code Optimizations feature.
ms.topic: conceptual
ms.service: azure-monitor
ms.subservice: optimization-insights
author: hhunter-ms
ms.author: hannahhunter
ms.date: 03/08/2024
ms.reviewer: ryankahng
---

# Set up Code Optimizations (Preview)

Setting up Code Optimizations to identify and analyze CPU and memory bottlenecks in your web applications is a simple process in the Azure portal. In this guide, you learn how to:

- Connect your web app to Application Insights.
- Enable the Profiler on your web app.

## Demo video

> [!VIDEO https://www.youtube-nocookie.com/embed/vbi9YQgIgC8]

## Connect your web app to Application Insights

Before setting up Code Optimizations for your web app, ensure that your app is connected to an Application Insights resource.

1. In the Azure portal, navigate to your web application.
1. From the left menu, select **Settings** > **Application Insights**.
1. In the Application Insights blade for your web application, determine the following options:

   - **If your web app is already connected to an Application Insights resource:** 
      - A banner at the top of the blade reads: **Your app is connected to Application Insights resource: {NAME-OF-RESOURCE}**.
        
        :::image type="content" source="media/set-up-code-optimizations/already-enabled-app-insights.png" alt-text="Screenshot of the banner explaining that your app is already connected to App Insights.":::

   - **If your web app still needs to be connected to an Application Insights resource:**
      - A banner at the top of the blade reads: **Your app will be connected to an auto-created Application Insights resource: {NAME-OF-RESOURCE}**. 

        :::image type="content" source="media/set-up-code-optimizations/need-to-enable-app-insights.png" alt-text="Screenshot of the banner telling you to enable App Insights and the name of the App Insights resource.":::

1. Click **Apply** at the bottom of the Application Insights pane.

## Enable Profiler on your web app

Profiler collects traces on your web app for Code Optimizations to analyze. In a few hours, if Code Optimization notices any performance bottlenecks in your application, you can see and review Code Optimizations insights. 

1. Still in the Application Insights blade, under **Instrument your application**, select the **.NET** tab.
1. Under **Profiler**, select the toggle to turn on Profiler for your web app.

   :::image type="content" source="media/set-up-code-optimizations/enable-profiler.png" alt-text="Screenshot of how to enable Profiler for your web app.":::

1. Verify the Profiler is collecting traces.
   1. Navigate to your Application Insights resource.
   1. From the left menu, select **Investigate** > **Performance**. 
   1. In the Performance blade, select **Profiler** from the top menu.
   1. Review the profiler traces collected from your web app. [If you don't see any traces, see the troubleshooting guide](../profiler/profiler-troubleshooting.md).

## Next steps

> [!div class="nextstepaction"]
> [View Code Optimizations results](view-code-optimizations.md)
