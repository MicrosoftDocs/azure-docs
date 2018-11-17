---
title: Azure Application Insights Profiler Settings Blade | Microsoft Docs
description: See profiler status and start profiling sessions
services: application-insights
documentationcenter: ''
author: mrbullwinkle
manager: carmonm

ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: conceptual
ms.reviewer: cawa
ms.date: 08/06/2018
ms.author: mbullwin

---

# Configure Application Insights Profiler

## Profiler Settings Page

The profiler settings page can be opened from the Application Insights Performance page by pressing the **Profiler** button.

![configure profiler pane entry][configure-profiler-entry]

The Configure Application Insights Profiler page contains four features: 
1. **Profile Now** - clicking this button will cause profiling sessions to start for all apps that are linked to this instance of Application Insights
1. **Linked apps** - List of applications sending profiler to this Application Insights resource
1. **Sessions in Progress** - When you press **Profile Now**, the status of the session will display here)
1. **Recent profiling sessions** - Shows information about past profiling sessions.

![Profiler on-demand][profiler-on-demand]

## App Service Environments (ASE)
Depending on how your ASE is configured, the call to check on the agent status may be blocked. This page will say that the agent isn't running when in fact it is. You can check the webjob on your application to be sure. But if all the app settings are set correctly and the App Insights site extension is installed on your application, the profiler will be running and you should see recent profiling sessions in the list if there's adequate traffic to your application.

## <a id="profileondemand"></a> Manually trigger Profiler

Profiler can be triggered manually with one button click. Suppose you are running a web performance test. You will need traces to help you understand how your web app is performing under load. Having control over when traces are captured is crucial since you know when load test will be running, but the random sampling interval might miss it.
The following steps illustrate how this scenario works:

### (Optional) Step 1: Generate traffic to your web app by starting a web performance test

If your web app already has incoming traffic or if you just want to manually generate traffic, skip this section and continue to Step 2.

Navigate to Application Insights portal, **Configure > Performance Testing**. Click on New button to start a new performance test.

![create new performance test][create-performance-test]

In the **New performance test** pane, configure the test target URL. Accept all default settings and start running the load test.

![Configure load test][configure-performance-test]

You will see the new test is queued first, followed by a status of 'in progress'.

![load test is submitted and queued][load-test-queued]

![load test is running in progress][load-test-in-progress]

### Step 2: Start profiler on-demand

Once the load test is running, we can start profiler to capture traces on the web app while it's receiving load.
Navigate to Configure Profiler pane:


### Step 3: View traces

Once the profiler finishes running, follow the instructions on notification to go to Performance page and view traces.

## Troubleshooting on-demand profiler

Sometimes you might see Profiler timeout error message after an on-demand session:

![Profiler timeout error][profiler-timeout]

There could be two reasons why you see this error:

1. The on-demand profiler session was successful, but Application Insights took a longer time to process the collected data. If data didn't finish being processed in 15 minutes, the portal will display a timeout message. Though after a while, Profiler traces will show up. If this happens, just ignore the error message for now. We are actively working on a fix.

1. Your web app has an older version of Profiler agent that does not have the on-demand feature. If you enabled Application Insights Profile previously, chances are you need to update your Profiler agent to start using the on-demand feature.
  
Follow these steps to check and install the latest Profiler:

1. Go to App Services App Settings and check if the following settings are set:
    * **APPINSIGHTS_INSTRUMENTATIONKEY**: Replace with the proper instrumentation key for Application Insights.
    * **APPINSIGHTS_PORTALINFO**: ASP.NET
    * **APPINSIGHTS_PROFILERFEATURE_VERSION**: 1.0.0
If any of these settings aren't set, go to the Application Insights enablement pane to install the latest site extension.

1. Go to Application Insights pane in App Services portal.

    ![Enable Application Insights from App Services portal][enable-app-insights]

1. If you see an ‘Update’ button in the following page, click it to update Application Insights site extension that will install the latest Profiler agent.

    ![Update site extension][update-site-extension]

1. Then click **change** to making sure the Profiler is turned on and select **OK** to save the changes.

    ![Change and save app insights][change-and-save-appinsights]

1. Go back to **App Settings** tab for the App Service to double-check the following app settings items are set:
    * **APPINSIGHTS_INSTRUMENTATIONKEY**: Replace with the proper instrumentation key for application insights.
    * **APPINSIGHTS_PORTALINFO**: ASP.NET
    * **APPINSIGHTS_PROFILERFEATURE_VERSION**: 1.0.0

    ![app settings for profiler][app-settings-for-profiler]

1. Optionally, check the extension version and making sure there’s no update available.

    ![check for extension update][check-for-extension-update]

## Next Steps
[Enable Profiler and View traces](app-insights-profiler-overview.md?toc=/azure/azure-monitor/toc.json)

[profiler-on-demand]: ./media/app-insights-profiler/Profiler-on-demand.png
[configure-profiler-entry]: ./media/app-insights-profiler/configure-profiler-entry.png
[create-performance-test]: ./media/app-insights-profiler/new-performance-test.png
[configure-performance-test]: ./media/app-insights-profiler/configure-performance-test.png
[load-test-queued]: ./media/app-insights-profiler/load-test-queued.png
[load-test-in-progress]: ./media/app-insights-profiler/load-test-inprogress.png
[enable-app-insights]: ./media/app-insights-profiler/enable-app-insights-blade-01.png
[update-site-extension]: ./media/app-insights-profiler/update-site-extension-01.png
[change-and-save-appinsights]: ./media/app-insights-profiler/change-and-save-appinsights-01.png
[app-settings-for-profiler]: ./media/app-insights-profiler/appsettings-for-profiler-01.png
[check-for-extension-update]: ./media/app-insights-profiler/check-extension-update-01.png
[profiler-timeout]: ./media/app-insights-profiler/profiler-timeout.png