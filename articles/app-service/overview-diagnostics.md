---
title: Azure App Service Diagnostics Overview | Microsoft Docs
description: Learn how you can troubleshoot issues with your web app with App Service Diagnostics. 
keywords: app service, azure app service, diagnostics, support, web app, troubleshooting, self-help
services: app-service
documentationcenter: ''
author: jen7714
manager: cfowler
editor: ''

ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/10/2017
ms.author: jennile
ms.custom: seodec18

---
# Azure App Service diagnostics overview

When you’re running a web application, you want to be prepared for any issues that may arise, from 500 errors to your users telling you that your site is down. App Service diagnostics is an intelligent and interactive experience to help you troubleshoot your web app with no configuration required. When you do run into issues with your web app, App Service diagnostics will point out what’s wrong to guide you to the right information to more easily and quickly troubleshoot and resolve the issue.

Although this experience is most helpful when you’re having issues with your web app within the last 24 hours, all the diagnostic graphs will always be available for you to analyze.

App Service diagnostics works for not only your app on Windows, but also apps on [Linux/containers](https://docs.microsoft.com/en-us/azure/app-service/containers/app-service-linux-intro), [App Service Environment](https://docs.microsoft.com/en-us/azure/app-service/environment/intro), and [Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/functions-overview).

## Opening App Service diagnostics

To access App Service diagnostics, navigate to your App Service web app or App Service Environment in the [Azure portal](https://portal.azure.com). In the left navigation, click on **Diagnose and solve problems**.

For Azure Functions, navigate to your function app, and in the top navigation, click on **Platform features**, and select **Diagnose and solve problems** from the **Resource management** section

In the App Service diagnostics homepage, you can choose the category that best describes the issue with your app by using the keywords in each homepage tile. Also, this page is where you will find **Diagnostic Tools** for Windows apps. [See more details below](##diagnostic-tools-only-for-windows-app)

![Homepage](./media/app-service-diagnostics/appservicediagnosticshomepage1.png)

## Interactive Interface

Once you select a homepage category that best aligns with your app's problem, App Service diagnostics' interactive interface, Genie, will guide you through diagnosing and solving problem with your app. You can use the tile shortcuts provided by Genie to view the full diagnostic report of the problem category that you are interested. The tile shortcuts provide you a direct way of accessing your diagnostic metrics.

![Tile shortcuts](./media/app-service-diagnostics/tileshortcuts2.png)

After clicking on these tiles, you will see a list of topics related to the issue described in the tile. These topics provide snippets of notable information from the full report. You can click on any of these topics to investigate the issues further. Also, you can click on **View Full Report** to explore all the topics on a single page.

![Topics](./media/app-service-diagnostics/applicationlogsinsights3.png)

![View Full Report](./media/app-service-diagnostics/viewfullreport4.png)

## Diagnostic report

After you choose to investigate the issue further by clicking on a topic, you can view more details about the topic often supplemented with graphs and markdowns. Diagnostic report can be a powerful tool for pinpointing the problem with your app.

![Diagnostic report](./media/app-service-diagnostics/fulldiagnosticreport5.png)

## Health checkup

If you don't know what’s wrong with your web app or don’t know where to start troubleshooting your issues, the health checkup is a good place to start. The health checkup will analyze your web applications to give you a quick, interactive overview that points out what’s healthy and what’s wrong, telling you where to look to investigate the issue. Its intelligent and interactive interface provides you with guidance through the troubleshooting process. Health checkup is integrated with the Genie experience for Windows apps and web app down diagnostic report for Linux apps.

### Health checkup graphs

- **Requests and Errors:** A graph that shows the number of requests made over the last 24 hours along with HTTP server errors.
- **App Performance:** A graph that shows response time over the last 24 hours for various percentile groups.
- **CPU Usage:** A graph that shows the overall percent CPU usage per instance over the last 24 hours.  
- **Memory Usage:** A graph that shows the overall percent physical memory usage per instance over the last 24 hours.

![Health checkup](./media/app-service-diagnostics/healthcheckup6.png)

### Investigating application code issues (Only for Windows app)

Because many app issues are related to issues in your application code, App Service diagnostics integrates with [Application Insights](https://docs.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview) to highlight exceptions and dependency issues to correlate with the selected downtime. Application Insights has to be enabled separately.

To view Application Insights exceptions and dependencies, select the **Web App Down** or **Web App Slow** tile shortcuts.

### Troubleshooting steps (Only for Windows app)

If an issue is detected with a specific problem category within the last 24 hours, you can view the full diagnostic report, and App Service diagnostics may prompt you to view more troubleshooting advice and next steps for a more guided experience.

![Application Insights and Troubleshooting and Next Steps](./media/app-service-diagnostics/applicationinsightsandhealthchecknextsteps7.png)

## Diagnostic Tools (Only for Windows app)

Diagnostics Tools include more advanced diagnostic tools that will help you investigate application code issues, slowness, connection strings, and more. and proactive tools that will help you mitigate issues with CPU usage, requests, and memory.

### Proactive CPU Monitoring

Proactive CPU Monitoring provides you an easy, proactive way to take an action when your app or child process for your app is consuming high CPU resources. You can set your own CPU threshold rules to temporarily mitigate a high CPU issue until the real cause for the unexpected issue is found.

![Proactive CPU Monitoring](./media/app-service-diagnostics/proactivecpumonitoring8.png)

### Proactive Auto-Healing

Like Proactive CPU monitoring, Proactive Auto-Healing offers an easy, proactive approach to mitigating unexpected behavior of your app. You can set your own rules based on request count, slow request, memory limit, and HTTP status code to trigger mitigation actions. This tool can be used to temporarily mitigate an unexpected behavior until the real cause for the issue is found. For more information on Proactive Auto-Healing, click [here](https://azure.github.io/AppService/2018/09/10/Announcing-the-New-Auto-Healing-Experience-in-App-Service-Diagnostics.html)

![Proactive Auto-Healing](./media/app-service-diagnostics/proactiveautohealing9.png)

## Change Analysis

In a fast-paced development environment, sometimes it may be difficult to keep track of all the changes made to your app and let alone pinpoint on a change that caused an unhealthy behavior. Change Analysis can help you narrow down on the changes made to your app to facilitate trouble-shooting experience. Change Analysis is embedded in diagnostic report such as **Application Crashes** so you can use it concurrently with other metrics.

![Change Analysis default page](./media/app-service-diagnostics/changeanalysisdefaultpage10.png)

![Diff view](./media/app-service-diagnostics/diffview11.png)

Change Analysis has to be enabled before using the feature.
