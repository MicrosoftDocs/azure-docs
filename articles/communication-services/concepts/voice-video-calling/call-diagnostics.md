---
title: Azure Communication Services Call Diagnostics
titleSuffix: An Azure Communication Services concept article
description: Learn how to use Call Diagnostics to diagnose call problems with Azure Communication Services.
author: amagginetti
ms.author: amagginetti
manager: chpalm

services: azure-communication-services
ms.date: 06/20/2024
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---

# Call Diagnostics

Azure Communication Services offers call quality analytics and visualizations in Call Diagnostics. You can use Call Diagnostics to investigate call metrics and events, and understand detected quality problems in your Communication Services calling solution.

It's important to understand call quality and reliability in order to deliver a great customer experience. Various problems can affect the quality of calls, such as poor internet connectivity, software incompatibilities, and technical difficulties with devices. These problems can be frustrating for all call participants, whether they're a patient checking in for a doctor's call or a student taking a lesson with a teacher. For a developer, diagnosing and fixing these problems can be time-consuming.

Call Diagnostics acts as a detective for calls. It helps developers who use Azure Communication Services to investigate events that happened in a call. The goal of the investigation is to identify likely causes of poor call quality and reliability.

Just like a real conversation, many things happen simultaneously in a call that might or might not affect communication. The timeline in Call Diagnostics makes it easier to visualize what happened in a call. It shows you rich data visualizations of call events and provides insights into problems that commonly affect calls.

## Enable Call Diagnostics

Azure Communication Services generates call data in the form of metrics and events as you make calls. You must store these data in a Log Analytics workspace in order for Call Diagnostics to work. To store these data, you must enable a diagnostic setting in Azure Monitor that directs these call data to be stored in a Log Analytics workspace as they're created. These call data aren't retroactively available from Azure Communication Services, but once you set up your diagnostic setting you control the data retention periods for your Log Analytics resource.  

> [!IMPORTANT]
> To enable Call Diagnostics in your calling resource see: [**How do I set up Call Diagnostics?**](#how-do-i-set-up-call-diagnostics) 
>
>You need to start collecting the log data for Call Diagnostics to visualize. Call Diagnostics can only query data after you setup a diagnostic setting in Azure Monitor to send your call data to a Log Analytics workspace. Keep in mind, call data isn't stored anywhere until you set up a Diagnostic Setting to store it in a Log Analytics workspace. You need to enable a Diagonstic Setting for each Azure Communications Services resource ID you want to monitor. 

Since Call Diagnostics is an application layer on top of data for your Azure Communications Services resource, you can query the call data and [build workbook reports on top of your data](/azure/azure-monitor/logs/data-platform-logs#built-in-insights-and-custom-dashboards-workbooks-and-reports).

You can access Call Diagnostics from any Azure Communication Services resource in the Azure portal. After you open your Azure Communications Services resource, look for the **Monitoring** section on the service menu and select **Call Diagnostics**.

After you set up Call Diagnostics for your Azure Communication Services resource, you can search for calls by using valid IDs for calls that took place in that resource. Data can take several hours after call completion to appear in your resource and populate in Call Diagnostics.

The following sections describe the main areas of the **Call Diagnostics** pane in the portal.

## Call search

The portal lists all calls by default. The search box lets you find individual calls, or filter calls to explore calls that have problems. Selecting a call takes you to a detail pane that has three tabs: **Overview**, **Issues**, and **Timeline**.

You can search by call ID in the search box. To find a call ID, see [Access your client call ID](../troubleshooting-info.md#access-your-client-call-id).

:::image type="content" source="./media/call-diagnostics-all-calls-3.png" alt-text="Screenshot of a Call Diagnostics search that shows recent calls for an Azure Communications Services resource."  lightbox="./media/call-diagnostics-all-calls-3.png":::

> [!NOTE]
> You can explore information icons and links within Call Diagnostics to learn functions, definitions, and helpful tips.

## Call overview

After you select a call, its details appear on the **Overview** tab. This tab shows a call summary that highlights the participants and key metrics for call quality. You can select a participant to drill into their call timeline details directly, or you can go to the **Issues** tab for further analysis.

:::image type="content" source="./media/call-diagnostics-call-overview-2.png" alt-text="Screenshot of the Call Diagnostics Overview tab for a selected call."  lightbox="./media/call-diagnostics-call-overview-2.png":::

## Call issues

The **Issues** tab gives you a high-level analysis of any media quality and reliability problems that Call Diagnostics detected during the call.

This tab highlights detected problems commonly known to affect a user's call quality, such as poor network conditions, speaking while muted, or device failures. If you want to explore a detected problem, select the highlighted item. A prepopulated view of the related events appears on the **Timeline** tab.

:::image type="content" source="./media/call-diagnostics-call-issues-2.png" alt-text="Screenshot of the Call Diagnostics Issues tab that shows the top problems detected in a selected call."  lightbox="./media/call-diagnostics-call-issues-2.png":::

## Call timeline

When call problems are difficult to troubleshoot, you can explore the **Timeline** tab to see a detailed sequence of events that occurred during the call.

The timeline view is complex. The timeline view is intended to help developers who need to explore details of a call and interpret complex debugging data. In large calls, the timeline view can present an overwhelming amount of information. We recommend that you use filtering to narrow your search results and reduce complexity.

You can view detailed call logs for each participant within a call. Call information might not be present for various reasons, such as privacy constraints between calling resources.

:::image type="content" source="./media/call-diagnostics-call-timeline-2.png" alt-text="Screenshot of the Call Diagnostics Timeline tab that shows detailed events in a timeline view for a selected call."  lightbox="./media/call-diagnostics-call-timeline-2.png":::

## Copilot in Azure for Call Diagnostics

AI can help app developers across every step of the development lifecycle: designing, building, and operating. Developers can use [Microsoft Copilot in Azure (preview)](/azure/copilot/overview) within Call Diagnostics to understand and resolve various calling problems. For example, developers can ask Copilot in Azure these questions:

- How to run network diagnostics in Azure Communication Services VoIP calls.
- How to optimize your calls for poor network conditions.
- How to determine common causes of poor media streams in Azure Communication Services calls.
- How to fix subcode 41048 if the video on a call didn't work.

:::image type="content" source="./media/call-diagnostics-all-calls-copilot.png" alt-text="Screenshot of a Call Diagnostics search that shows recent calls for an Azure Communications Services resource and a response from Copilot in Azure."  lightbox="./media/call-diagnostics-all-calls-copilot.png":::

## Frequently asked questions

### How do I set up Call Diagnostics?

Follow instructions to add diagnostic settings for your resource in [Enable logs via Diagnostic Settings in Azure Monitor](../analytics/enable-logging.md). We recommend that you **collect all logs**. After you understand the capabilities in Azure Monitor, determine which logs you want to retain and for how long. When you add a Diagnostic Setting, you will be prompted to [select logs](../analytics/enable-logging.md#adding-a-diagnostic-setting). To collect **all logs**, select **allLogs**.

Your data volume, retention, and Call Diagnostics query usage in Log Analytics within Azure Monitor is billed through existing Azure data meters. We recommend that you monitor your data usage and retention policies for cost considerations as needed. For more information, see [Controlling costs](/azure/azure-monitor/essentials/diagnostic-settings#controlling-costs).

If you have multiple Azure Communications Services resource IDs, you must enable these settings for each resource ID. Then you can query call details for participants within their respective resource IDs.

Participants who join from other Azure Communication Services resources will show limited information in your view of Call Diagnostics. The participants who belong to your resource when you open Call Diagnostics have all available insights shown.

### What are the common call problems  and how to fix them?

Resources for common call problems:

- For an overview of troubleshooting strategies and for more information on isolating call problems, see [Overview of general troubleshooting strategies](../../resources/troubleshooting/voice-video-calling/general-troubleshooting-strategies/overview.md).

- For descriptions of common error messages, see [Understanding error messages and codes](../../resources/troubleshooting/voice-video-calling/general-troubleshooting-strategies/understanding-error-codes.md).

- If users can't join calls, see [Overview of call setup issues](../../resources/troubleshooting/voice-video-calling/call-setup-issues/overview.md).

- If users have camera or microphone problems (for example, they can't hear someone), see [Overview of device and permission issues](../../resources/troubleshooting/voice-video-calling/device-issues/overview.md).

- If call participants have audio problems (for example, they sound like a robot or hear an echo), see [Overview of audio issues](../../resources/troubleshooting/voice-video-calling/audio-issues/overview.md).

- If call participants have video problems (for example, their video looks fuzzy or cuts in and out), see [Overview of video issues](../../resources/troubleshooting/voice-video-calling/video-issues/overview.md).

### How do I enable Copilot in Azure (preview) in Call Diagnostics

Your organization manages access to [Microsoft Copilot in Azure (preview)](/azure/copilot/overview). After your organization has access to Copilot in Azure, the Call Diagnostics interface includes the **Diagnose with Copilot** option in the search area, on the **Overview** tab, and on the **Issues** tab.

Use Copilot in Azure for Call Diagnostics to improve call quality by detailing problems faced during Azure Communication Services calls. Giving Copilot in Azure detailed information from Call Diagnostics helps Copilot enhance analysis, identify problems, and identify fixes. Copilot in Azure currently lacks programmatic access to your call details.

### How can I use `DiagnosticOptions` to view tagged calls in Call Diagnostics

You can use your tags from `DiagnosticOptions` in three places on the Call Diagnostics interface:

* Main **calls search** page: You can search, apply a filter, and view by specific `DiagnosticOptions` attributes.
   :::image type="content" source="./media/ui-hint-call-search.png" alt-text="Screenshot of the Call Diagnostics Search view that shows the DiagnosticOptions column."  lightbox="./media/ui-hint-call-search.png":::

* Participants table in **Call Overview** section: You can view and sort by `DiagnosticOptions`
   :::image type="content" source="./media/ui-hint-participants-table.png" alt-text="Screenshot of the Call Diagnostics Call Overview section that shows the DiagnosticOptions column."  lightbox="./media/ui-hint-participants-table.png":::

* **Timeline section**:  You can search by a specific `DiagnosticOptions` attribute and view the `DiagnosticOptions` in the participants information side panel
   :::image type="content" source="./media/ui-hint-timeline.png" alt-text="Screenshot of the Call Diagnostics timeline section that shows the DiagnosticOptions values when exploring a participants side pane details."  lightbox="./media/ui-hint-timeline.png":::

#### View `DiagnosticOptions` information column in the tables

If you can't see the `DiagnosticOptions` information column in the tables, here's how to view the information:

To view the `DiagnosticOptions` columns in Call Diagnostics, you need to enable them using the **Edit Columns** button located in the Call Search and Call Overview sections:

:::image type="content" source="./media/ui-hint-edit-columns-button.png" alt-text="Screenshot of the Call Diagnostics search view with a red rectangle around the Edit Columns icon."  lightbox="./media/ui-hint-edit-columns-button.png":::

After clicking the **Edit Columns** button, choose the **DiagnosticOptions** option and select **Done**:

:::image type="content" source="./media/ui-hint-choose-columns-sidepane.png" alt-text="Screenshot of the Call Diagnostics search view with the column editor opened on the right side. There are red rectangles around the DiagnosticOptions option and the Done button."  lightbox="./media/ui-hint-choose-columns-sidepane.png":::

You can now see the `DiagnosticOptions` column.

#### More information about adding tags for your Calls in Call Diagnostics

For more information about adding `DiagnosticOptions` tags, see [Add custom tags to your client telemetry](../../tutorials/voice-video-calling/diagnostic-options-tag.md).

## Related content

- Learn how to manage call quality: [Improve and manage call quality](manage-call-quality.md).
- Explore troubleshooting guidance: [Overview of audio issues](../../resources/troubleshooting/voice-video-calling/audio-issues/overview.md).
- Learn about other quality best practices: [Best practices: Azure Communication Services calling SDKs](../best-practices.md).
- Learn how to use the Log Analytics workspace: [Log Analytics tutorial](/azure/azure-monitor/logs/log-analytics-tutorial).
- Create your own queries in Log Analytics: [Get started with log queries in Azure Monitor](/azure/azure-monitor/logs/get-started-queries).
- Explore known call issues: [Known issues in the SDKs and APIs](../known-issues.md).
