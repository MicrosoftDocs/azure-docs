---
title: Troubleshoot Code Optimizations (Preview)
description: Learn how to use Application Insights Code Optimizations on Azure. View a checklist of troubleshooting steps.
author: rkahng 
ms.author: ryankahng
editor: v-jsitser
ms.reviewer: hannahhunter, v-leedennis
ms.service: azure-monitor
ms.topic: troubleshooting
ms.date: 06/25/2024
ms.custom: sap:Availability Tests
---

# Troubleshoot Code Optimizations (Preview)

This article provides troubleshooting steps and information to use Application Insights Code Optimizations for Microsoft Azure.

## Troubleshooting checklist

### Step 1: View a video about Code Optimizations setup

View the following demonstration video to learn how to set up Code Optimizations correctly.

> [!VIDEO https://www.youtube-nocookie.com/embed/vbi9YQgIgC8]

### Step 2: Make sure that your app is connected to an Application Insights resource

[Create an Application Insights resource](/azure/azure-monitor/app/create-workspace-resource) and verify that it's connected to the correct app.

### Step 3: Verify that Application Insights Profiler is enabled

[Enable Application Insights Profiler](/azure/azure-monitor/profiler/profiler-overview).

### Step 4: Verify that Application Insights Profiler is collecting profiles

To make sure that profiles are uploaded to your Application Insights resource, follow these steps：

1. In the [Azure portal](https://portal.azure.com), search for and select **Application Insights**.
1. In the list of Application Insights resources, select the name of your resource.
1. In the navigation pane of your Application Insights resource, locate the **Investigate** heading, and then select **Performance**.
1. On the **Performance** page of your Application Insights resource, select **Profiler**:

   :::image type="content" source="./media/code-optimizations-troubleshoot/performance-page.png" alt-text="Azure portal screenshot that shows how to navigate to the Application Insights Profiler.":::

1. On the **Application Insights Profiler** page, view the **Recent profiling sessions** section.

   :::image type="content" source="./media/code-optimizations-troubleshoot/profiling-sessions.png" alt-text="Azure portal screenshot of the Application Insights Profiler page." lightbox="./media/code-optimizations-troubleshoot/profiling-sessions.png":::

   > [!NOTE]  
   > If you don't see any profiling sessions, see [Troubleshoot Application Insights Profiler](../profiler/profiler-troubleshooting.md).

### Step 5: Regularly check the Profiler

After you successfully complete the previous steps, keep checking the Profiler for insights. Meanwhile, the service continues to analyze your profiles and provide insights as soon as it detects any issues in your code. After you enable the Application Insights Profiler, several hours might be required for you to generate profiles and for the service to analyze them. If the service detects no issues in your code, a message appears that confirms that no insights were found.

## Contact us for help

If you have questions or need help, [create a support request](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview?DMC=troubleshoot), or ask [Azure community support](https://azure.microsoft.com/support/community). You can also submit product feedback to [Azure feedback community](https://feedback.azure.com/d365community).