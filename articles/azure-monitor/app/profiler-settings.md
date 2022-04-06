---
title: Use the Azure Application Insights Profiler settings pane | Microsoft Docs
description: See Profiler status and start profiling sessions
ms.author: hannahhunter
author: hhunter-ms
ms.contributor: Charles.Weininger
ms.topic: conceptual
ms.date: 04/05/2022
ms.reviewer: mbullwin
---

# Configure Application Insights Profiler

## Updated Profiler Agent
The trigger features only work with version 2.6 or newer of the profiler agent. If you are running the profiler an Azure App Service, your agent will be updated automatically. See which profiler agent version you're running via the Kudu URL for your website and append `/DiagnosticServices` to the end. For example:  
> `https://yourwebsite.scm.azurewebsites.net/diagnosticservices`

The Application Insights Profiler Webjob should be version 2.6 or newer. You can force an upgrade by restarting your web app. 

If you are running the profiler on a VM or Cloud Service, verify you have Windows Azure Diagnostics (WAD) extension version 16.0.4 or newer installed. Check the WAD version by logging onto your VM and looking this directory:  
> `C:\Packages\Plugins\Microsoft.Azure.Diagnostics.IaaSDiagnostics\1.16.0.4`

The directory name shows the installed version of WAD. The Azure VM agent will update WAD automatically once new versions are available.

## Profiler settings page

To open the Azure Application Insights Profiler settings pane, go to the Application Insights Performance pane, and then select the **Configure Profiler** button.

![Link to open Profiler settings page][configure-profiler-entry]

That opens a page that looks like this:

![Profiler settings page][configure-profiler-page]

The **Configure Application Insights Profiler** page has these features:

| Feature | Description |
|-|-|
Profile Now | Starts profiling sessions for all apps that are linked to this instance of Application Insights.
Triggers | Allows you to configure triggers that cause the profiler to run. 
Recent profiling sessions | Displays information about past profiling sessions.

## Profile Now
Select **Profile Now** to start a profiling session on demand. When you click this link, all profiler agents that are sending data to this Application Insights instance will start to capture a profile. After 5 to 10 minutes, the profile session will show in the list below.

To manually trigger a profiler session, you'll need, at minimum, *write* access on your role for the Application Insights component. In most cases, you get write access automatically. If you're having issues, you'll need the "Application Insights Component Contributor" subscription scope role added. [See more about role access control with Azure Monitoring](./resources-roles-access-control.md).

## Trigger Settings

Select the Triggers button on the menu bar to open the CPU, Memory, and Sampling trigger settings pane. 

**CPU or Memory triggers**

You can set up a trigger to start profiling when the percentage of CPU or Memory use hits the level you set.

:::image type="content" source="./media/profiler-settings/cpu-memory-trigger-settings.png" alt-text="Screenshot of trigger settings pane for CPU and Memory triggers":::

| Setting | Description |
|-|-|
On / Off Button | On: profiler can be started by this trigger; Off: profiler won't be started by this trigger.
Memory threshold | When this percentage of memory is in use, the profiler will be started.
Duration | Sets the length of time the profiler will run when triggered.
Cooldown | Sets the length of time the profiler will wait before checking for the memory or CPU usage again after it's triggered.

**Sampling trigger**

For the Sampling trigger, you can set up how often profiling can occur and the duration of a profiling session.

:::image type="content" source="./media/profiler-settings/sampling-trigger-settings.png" alt-text="Screenshot of trigger settings pane for Sampling trigger":::

| Setting | Description |
|-|-|
On / Off Button | On: profiler can be started by this trigger; Off: profiler won't be started by this trigger.
Sample rate | The rate at which the profiler can occur. Normal is recommended for production environments.
Duration | Sets the length of time the profiler will run when triggered.

## Recent Profiling Sessions
This section of the Profiler page displays recent profiling session information. A profiling session represents the time taken by the profiler agent while profiling one of the machines hosting your application. Open the profiles from a session by clicking on one of the rows. For each session, we show:

| Setting | Description |
|-|-|
Triggered by | How the session was started, either by a trigger, Profile Now, or default sampling. 
App Name | Name of the application that was profiled.
Machine Instance | Name of the machine the profiler agent ran on.
Timestamp | Time when the profile was captured.
Tracee | Number of traces that were attached to individual requests.
CPU % | Percentage of CPU that was being used while the profiler was running.
Memory % | Percentage of memory that was being used while the profiler was running.

## <a id="profileondemand"></a> Use web performance tests to generate traffic to your application

You can trigger Profiler manually with a single click. Suppose you're running a web performance test. You'll need traces to help you understand how your web app is running under load. Controlling when traces are captured is crucial, because you know when the load test will be running, while the random sampling interval might miss it.

The next sections illustrate to manually trigger the profiler:

### Step 1: Generate traffic to your web app by starting a web performance test

> [!NOTE]
> If your web app already has incoming traffic or if you just want to manually generate traffic, skip this section and continue to Step 2.

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

## Next steps
[Enable Profiler and view traces](profiler-overview.md?toc=/azure/azure-monitor/toc.json)

[profiler-on-demand]: ./media/profiler-settings/Profiler-on-demand.png
[configure-profiler-entry]: ./media/profiler-settings/configure-profiler-entry.png
[configure-profiler-page]: ./media/profiler-settings/configureBlade.png
[trigger-settings-flyout]: ./media/profiler-settings/CPUTrigger.png
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
