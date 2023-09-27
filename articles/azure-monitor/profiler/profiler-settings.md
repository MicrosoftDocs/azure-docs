---
title: Configure Application Insights Profiler | Microsoft Docs
description: Use the Application Insights Profiler settings pane to see Profiler status and start profiling sessions
ms.contributor: Charles.Weininger
ms.topic: conceptual
ms.date: 09/22/2023
---

# Configure Application Insights Profiler

After you enable Application Insights Profiler, you can:

- Start a new profiling session.
- Configure Profiler triggers.
- View recent profiling sessions.

To open the Application Insights Profiler settings pane, select **Performance** on the left pane on your Application Insights page.

:::image type="content" source="./media/profiler-settings/performance-blade-inline.png" alt-text="Screenshot that shows the link to open the Performance pane." lightbox="media/profiler-settings/performance-blade.png":::

You can view Profiler traces across your Azure resources via two methods:

- The **Profiler** button:

   Select **Profiler**.

  :::image type="content" source="./media/profiler-overview/profiler-button-inline.png" alt-text="Screenshot that shows the Profiler button on the Performance pane." lightbox="media/profiler-settings/profiler-button.png":::

- Operations:

   1. Select an operation from the **Operation name** list. **Overall** is highlighted by default.
   1. Select **Profiler traces**.
   
      :::image type="content" source="./media/profiler-settings/operation-entry-inline.png" alt-text="Screenshot that shows selecting operation and Profiler traces to view all Profiler traces." lightbox="media/profiler-settings/operation-entry.png":::

   1. Select one of the requests from the list on the left.
   1. Select **Configure Profiler**.

      :::image type="content" source="./media/profiler-settings/configure-profiler-inline.png" alt-text="Screenshot that shows the overall selection and clicking Profiler traces to view all profiler traces." lightbox="media/profiler-settings/configure-profiler.png":::

Within Profiler, you can configure and view Profiler. The **Application Insights Profiler** page has the following features.

:::image type="content" source="./media/profiler-settings/configure-blade-inline.png" alt-text="Screenshot that shows Profiler page features and settings." lightbox="media/profiler-settings/configure-blade.png":::

| Feature | Description |
|-|-|
**Profile now** | Starts profiling sessions for all apps that are linked to this instance of Application Insights.
**Triggers** | Allows you to configure triggers that cause Profiler to run.
**Recent profiling sessions** | Displays information about past profiling sessions, which you can sort by using the filters at the top of the page.

## Profile now

Select **Profile now** to start a profiling session on demand. When you select this link, all Profiler agents that are sending data to this Application Insights instance start to capture a profile. After 5 to 10 minutes, the profile session is shown in the list.

To manually trigger a Profiler session, you need, at minimum, *write* access on your role for the Application Insights component. In most cases, you get write access automatically. If you're having issues, you need the **Application Insights Component Contributor** subscription scope role added. For more information, see [Resources, roles, and access control in Application Insights](../app/resources-roles-access-control.md).

## Trigger settings

Select **Triggers** to open the **Trigger Settings** pane that has the **CPU**, **Memory**, and **Sampling** trigger tabs.

### CPU or Memory triggers

You can set up a trigger to start profiling when the percentage of CPU or memory use hits the level you set.

:::image type="content" source="./media/profiler-settings/cpu-memory-trigger-settings.png" alt-text="Screenshot that shows the Trigger Settings pane for C P U and Memory triggers.":::

| Setting | Description |
|-|-|
On/Off button | On: Starts Profiler. Off: Doesn't start Profiler.
Memory threshold | When this percentage of memory is in use, Profiler is started.
Duration | Sets the length of time Profiler runs when triggered.
Cooldown | Sets the length of time Profiler waits before checking for the memory or CPU usage again after it's triggered.

### Sampling trigger

Unlike CPU or Memory triggers, an event doesn't trigger the Sampling trigger. Instead, it's triggered randomly to get a truly random sample of your application's performance.
You can:
- Turn this trigger off to disable random sampling.
- Set how often profiling occurs and the duration of the profiling session.

:::image type="content" source="./media/profiler-settings/sampling-trigger-settings.png" alt-text="Screenshot that shows the Trigger Settings pane for Sampling trigger.":::

| Setting | Description |
|-|-|
On/Off button | On: Starts Profiler. Off: Doesn't start Profiler.
Sample rate | The rate at which Profiler can occur. </br> <ul><li>The **Normal** setting collects data 5% of the time, which is about 2 minutes per hour.</li><li>The **High** setting profiles 50% of the time.</li><li>The **Maximum** setting profiles 75% of the time.</li></ul> </br> We recommend the **Normal** setting for production environments.
Duration | Sets the length of time Profiler runs when triggered.

## Recent profiling sessions
This section of the **Profiler** page displays recent profiling session information. A profiling session represents the time taken by the Profiler agent while profiling one of the machines that hosts your application. Open the profiles from a session by selecting one of the rows. For each session, we show the following settings.

| Setting | Description |
|-|-|
Triggered by | How the session was started, either by a trigger, Profile now, or default sampling.
App Name | Name of the application that was profiled.
Machine Instance | Name of the machine the Profiler agent ran on.
Timestamp | Time when the profile was captured.
CPU % | Percentage of CPU used while Profiler was running.
Memory % | Percentage of memory used while Profiler was running.

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
