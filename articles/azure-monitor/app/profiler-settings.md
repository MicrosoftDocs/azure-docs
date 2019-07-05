---
title: Use the Azure Application Insights Profiler settings pane | Microsoft Docs
description: See Profiler status and start profiling sessions
services: application-insights
documentationcenter: ''
author: cweining
manager: carmonm
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.reviewer: mbullwin
ms.date: 08/06/2018
ms.author: cweining
---

# Configure Application Insights Profiler

## Profiler settings pane

To open the Azure Application Insights Profiler settings pane, go to the Application Insights Performance pane, and then select the **Profiler** button.

![Configure the Profiler pane][configure-profiler-entry]

The **Configure Application Insights Profiler** pane contains four features: 
* **Profile Now**: Starts profiling sessions for all apps that are linked to this instance of Application Insights.
* **Linked apps**: Lists applications that send profiling data to this Application Insights resource.
* **Sessions in Progress**: Displays the status of the session when you select **Profile Now**. 
* **Recent profiling sessions**: Displays information about past profiling sessions.

![Profiler on-demand][profiler-on-demand]

## App Service Environment
Depending on how your Azure App Service Environment is configured, the call to check on the agent status might be blocked. The pane might display a message that the agent isn't running even when it is running. To make sure that it is, check the webjob on your application. If all the app settings values are correct and the Application Insights site extension is installed on your application, Profiler is running. If your application is receiving enough traffic, recent profiling sessions should be displayed in a list.

## <a id="profileondemand"></a> Manually trigger Profiler

### Minimum Requirements 
For a user to manually trigger a profiler session they require at minimum "write" access on their role for the Application Insights component. In most cases you get this access automatically and no additional work is needed. If you are having issues, the subscription scope role to add would be the "Application Insights Component Contributor" role. [See more about role access control with Azure Monitoring](https://docs.microsoft.com/azure/azure-monitor/app/resources-roles-access-control).

You can trigger Profiler manually with a single click. Suppose you're running a web performance test. You'll need traces to help you understand how your web app is performing under load. Having control over when traces are captured is crucial, because you know when the load test will be running. But the random sampling interval might miss it.

The next sections illustrate how this scenario works:

### Step 1: (Optional) Generate traffic to your web app by starting a web performance test

If your web app already has incoming traffic or if you just want to manually generate traffic, skip this section and continue to Step 2.

1. In the Application Insights portal, select **Configure** > **Performance Testing**. 

1. To start a new performance test, select the **New** button.

   ![create new performance test][create-performance-test]

1. In the **New performance test** pane, configure the test target URL. Accept all default settings, and then select **Run test** to start running the load test.

    ![Configure load test][configure-performance-test]

    The new test is queued first, followed by a status of *in progress*.

    ![Load test is submitted and queued][load-test-queued]

    ![Load test is running in progress][load-test-in-progress]

### Step 2: Start a Profiler on-demand session

1. When the load test is running, start Profiler to capture traces on the web app while it's receiving load.

1. Go to the **Configure Profiler** pane.


### Step 3: View traces

After Profiler finishes running, follow the instructions on notification to go to Performance pane and view traces.

## Troubleshoot the Profiler on-demand session

After an on-demand session, you might receive a Profiler timeout error message:

![Profiler timeout error][profiler-timeout]

You might receive this error for either of the following reasons:

* The on-demand Profiler session was successful, but Application Insights took a longer time than expected to process the collected data.  

  If the data isn't processed within 15 minutes, the portal displays a timeout message. After a while, however, Profiler traces will show up. If you receive an error message, ignore it for now. We are actively working on a fix.

* Your web app has an older version of Profiler agent that doesn't have the on-demand feature.  

  If you enabled Application Insights Profiler previously, you might need to update your Profiler agent to start using the on-demand feature.
  
Go to the App Services **App Settings** pane and check for the following settings:
* **APPINSIGHTS_INSTRUMENTATIONKEY**: Replace with the proper instrumentation key for Application Insights.
* **APPINSIGHTS_PORTALINFO**: ASP.NET
* **APPINSIGHTS_PROFILERFEATURE_VERSION**: 1.0.0

If any of the preceding values aren't set, install the latest site extension by doing the following:

1. Go to the **Application Insights** pane in the App Services portal.

    ![Enable Application Insights from the App Services portal][enable-app-insights]

1. If the **Application Insights** pane displays an **Update** button, select it to update the Application Insights site extension that will install the latest Profiler agent.

    ![Update site extension][update-site-extension]

1. To ensure that Profiler is turned on, select **Change**, and then select **OK** to save the changes.

    ![Change and save app insights][change-and-save-appinsights]

1. Go back to **App Settings** pane for the App Service to ensure that the following values are set:
   * **APPINSIGHTS_INSTRUMENTATIONKEY**: Replace with the proper instrumentation key for application insights.
   * **APPINSIGHTS_PORTALINFO**: ASP.NET 
   * **APPINSIGHTS_PROFILERFEATURE_VERSION**: 1.0.0

     ![App settings for Profiler][app-settings-for-profiler]

1. Optionally, select **Extensions**, and then check the extension version and determine whether an update is available.

    ![Check for extension update][check-for-extension-update]

## Next steps
[Enable Profiler and view traces](profiler-overview.md?toc=/azure/azure-monitor/toc.json)

[profiler-on-demand]: ./media/profiler-settings/Profiler-on-demand.png
[configure-profiler-entry]: ./media/profiler-settings/configure-profiler-entry.png
[create-performance-test]: ./media/profiler-settings/new-performance-test.png
[configure-performance-test]: ./media/profiler-settings/configure-performance-test.png
[load-test-queued]: ./media/profiler-settings/load-test-queued.png
[load-test-in-progress]: ./media/profiler-settings/load-test-inprogress.png
[enable-app-insights]: ./media/profiler-settings/enable-app-insights-blade-01.png
[update-site-extension]: ./media/profiler-settings/update-site-extension-01.png
[change-and-save-appinsights]: ./media/profiler-settings/change-and-save-appinsights-01.png
[app-settings-for-profiler]: ./media/profiler-settings/appsettings-for-profiler-01.png
[check-for-extension-update]: ./media/profiler-settings/check-extension-update-01.png
[profiler-timeout]: ./media/profiler-settings/profiler-timeout.png
