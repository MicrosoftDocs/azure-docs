---
title: Configure Application Insights Profiler | Microsoft Docs
description: Use the Azure Application Insights Profiler settings pane to see Profiler status and start profiling sessions
ms.contributor: Charles.Weininger
ms.topic: conceptual
ms.date: 08/09/2022
---

# Configure Application Insights Profiler

Once you've enabled the Application Insights Profiler, you can:

- Start a new profiling session
- Configure Profiler triggers
- View recent profiling sessions

To open the Azure Application Insights Profiler settings pane, select **Performance** from the left menu within your Application Insights page.

:::image type="content" source="./media/profiler-settings/performance-blade-inline.png" alt-text="Screenshot of the link to open performance blade." lightbox="media/profiler-settings/performance-blade.png":::

View profiler traces across your Azure resources via two methods: 

**Profiler button** 

Select the **Profiler** button from the top menu.

:::image type="content" source="./media/profiler-overview/profiler-button-inline.png" alt-text="Screenshot of the Profiler button from the Performance blade." lightbox="media/profiler-settings/profiler-button.png":::

**By operation**

1. Select an operation from the **Operation name** list ("Overall" is highlighted by default).
1. Select the **Profiler traces** button.
   
   :::image type="content" source="./media/profiler-settings/operation-entry-inline.png" alt-text="Screenshot of selecting operation and Profiler traces to view all profiler traces." lightbox="media/profiler-settings/operation-entry.png":::

1. Select one of the requests from the list to the left.
1. Select **Configure Profiler**.

   :::image type="content" source="./media/profiler-settings/configure-profiler-inline.png" alt-text="Screenshot of the overall selection and clicking Profiler traces to view all profiler traces." lightbox="media/profiler-settings/configure-profiler.png":::

Once within the Profiler, you can configure and view the Profiler. The **Application Insights Profiler** page has these features:

:::image type="content" source="./media/profiler-settings/configure-blade-inline.png" alt-text="Screenshot of profiler page features and settings." lightbox="media/profiler-settings/configure-blade.png":::

| Feature | Description |
|-|-|
Profile Now | Starts profiling sessions for all apps that are linked to this instance of Application Insights.
Triggers | Allows you to configure triggers that cause the profiler to run. 
Recent profiling sessions | Displays information about past profiling sessions, which you can sort using the filters at the top of the page.

## Profile Now
Select **Profile Now** to start a profiling session on demand. When you click this link, all profiler agents that are sending data to this Application Insights instance will start to capture a profile. After 5 to 10 minutes, the profile session will show in the list below.

To manually trigger a profiler session, you'll need, at minimum, *write* access on your role for the Application Insights component. In most cases, you get write access automatically. If you're having issues, you'll need the "Application Insights Component Contributor" subscription scope role added. [See more about role access control with Azure Monitoring](../app/resources-roles-access-control.md).

## Trigger Settings

Select the Triggers button on the menu bar to open the CPU, Memory, and Sampling trigger settings pane. 

**CPU or Memory triggers**

You can set up a trigger to start profiling when the percentage of CPU or Memory use hits the level you set.

:::image type="content" source="./media/profiler-settings/cpu-memory-trigger-settings.png" alt-text="Screenshot of trigger settings pane for C P U and Memory triggers.":::

| Setting | Description |
|-|-|
On / Off Button | On: profiler can be started by this trigger; Off: profiler won't be started by this trigger.
Memory threshold | When this percentage of memory is in use, the profiler will be started.
Duration | Sets the length of time the profiler will run when triggered.
Cooldown | Sets the length of time the profiler will wait before checking for the memory or CPU usage again after it's triggered.

**Sampling trigger**

Unlike CPU or memory triggers, the Sampling trigger isn't triggered by an event. Instead, it's triggered randomly to get a truly random sample of your application's performance. You can:
- Turn this trigger off to disable random sampling.
- Set how often profiling will occur and the duration of the profiling session. 

:::image type="content" source="./media/profiler-settings/sampling-trigger-settings.png" alt-text="Screenshot of trigger settings pane for Sampling trigger.":::

| Setting | Description |
|-|-|
On / Off Button | On: profiler can be started by this trigger; Off: profiler won't be started by this trigger.
Sample rate | The rate at which the profiler can occur. </br> <ul><li>The **Normal** setting collects data 5% of the time, which is about 2 minutes per hour.</li><li>The **High** setting profiles 50% of the time.</li><li>The **Maximum** setting profiles 75% of the time.</li></ul> </br> Normal is recommended for production environments.
Duration | Sets the length of time the profiler will run when triggered.

## Recent Profiling Sessions
This section of the Profiler page displays recent profiling session information. A profiling session represents the time taken by the profiler agent while profiling one of the machines hosting your application. Open the profiles from a session by clicking on one of the rows. For each session, we show:

| Setting | Description |
|-|-|
Triggered by | How the session was started, either by a trigger, Profile Now, or default sampling. 
App Name | Name of the application that was profiled.
Machine Instance | Name of the machine the profiler agent ran on.
Timestamp | Time when the profile was captured.
CPU % | Percentage of CPU that was being used while the profiler was running.
Memory % | Percentage of memory that was being used while the profiler was running.

## Next steps
[Enable Profiler and view traces](profiler-overview.md?toc=/azure/azure-monitor/toc.json)

[profiler-on-demand]: ./media/profiler-settings/profiler-on-demand.png
[performance-blade]: ./media/profiler-settings/performance-blade.png
[configure-profiler-page]: ./media/profiler-settings/configureBlade.png
[trigger-settings-flyout]: ./media/profiler-settings/trigger-central-p-u.png
[create-performance-test]: ./media/profiler-settings/new-performance-test.png
[configure-performance-test]: ./media/profiler-settings/configure-performance-test.png
[load-test-queued]: ./media/profiler-settings/load-test-queued.png
[load-test-in-progress]: ./media/profiler-settings/load-test-in-progress.png
[enable-app-insights]: ./media/profiler-settings/enable-app-insights-blade-01.png
[update-site-extension]: ./media/profiler-settings/update-site-extension-01.png
[change-and-save-appinsights]: ./media/profiler-settings/change-and-save-app-insights-01.png
[app-settings-for-profiler]: ./media/profiler-settings/app-settings-for-profiler-01.png
[check-for-extension-update]: ./media/profiler-settings/check-extension-update-01.png
[profiler-timeout]: ./media/profiler-settings/profiler-time-out.png
