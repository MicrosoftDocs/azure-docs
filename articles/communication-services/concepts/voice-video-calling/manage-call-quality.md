---
title: Azure Communication Services Manage Call Quality
titleSuffix: An Azure Communication Services concept article
description: Learn how to improve and manage call quality with Azure Communication Services.
author: amagginetti
ms.author: amagginetti
manager: mvivion

services: azure-communication-services
ms.date: 7/10/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---

# Improve and manage call quality

This article introduces key tools that you can use to monitor, troubleshoot, and improve call quality in Azure Communication Services. The following materials help you plan for the best user experience.

Before you read this article, become familiar with overview information about calling:

- Voice and video calling: [Azure Communication Services Calling SDK overview](calling-sdk-features.md)
- Phone calling: [Public Switched Telephone Network (PSTN) integration concepts](../telephony/telephony-concept.md)

## Prepare your network and prioritize important network traffic by using QoS

As your users start using Azure Communication Services for calls and meetings, they might experience a caller's voice breaking up or cutting in and out of a call or meeting. Shared video might freeze, or pixelate, or fail altogether. This problem is due to the IP packets that represent voice and video traffic encountering network congestion and arriving out of sequence or not at all. If it happens (or to prevent it from happening in the first place), use Quality of Service (QoS) by following the [network recommendations](network-requirements.md).

With QoS, you prioritize delay-sensitive network traffic (for example, voice or video streams). You allow that traffic to "cut in line" in front of traffic that's less sensitive. An example of lower-priority traffic is downloading a new app. In that case, an extra second to download isn't a significant problem.

QoS identifies and marks all packets in real-time streams by using Windows Group Policy objects and a routing feature called Port-based Access Control Lists. That feature instructs your network to give voice, video, and screen sharing their own dedicated network bandwidth.

Ideally, you implement QoS on your internal network while getting ready to roll out your Azure Communication Services solution. But you can do it anytime. If your network is small enough, you might not need QoS.

For detailed guidance, see [Network optimization](network-requirements.md#network-optimization).

## Prepare your deployment for quality and reliability investigations

Quality has different definitions, depending on the real-time communication use case and the perspective of the users. Many variables affect the perceived quality of a real-time calling experience. An improvement in one variable might cause a negative change in another variable. For example, increasing the frame rate and resolution of a video call increases network bandwidth utilization and processing power.

Determine your customer's use cases and requirements before you start your development. For example, a customer who needs to monitor dozens of security camera feeds simultaneously might not need the maximum resolution and frame rate that each video stream can provide. In this scenario, you could use the [Video Constraints API](video-constraints.md) capability to limit the amount of bandwidth that each video stream uses.

## Implement logging on native platforms

Implementing logging as described in the [tutorial about retrieving log files](../../tutorials/log-file-retrieval-tutorial.md) is critical to gathering details for native development. Detailed logs help in diagnosing problems specific to device models or OS versions. We encourage developers who start configuring the Logs API to get details about the call lifetime.

## Implement existing quality and reliability capabilities before deployment

We recommend that you use [these easy-to-implement calling samples](../../overview.md#samples), because they're already optimized to give your users the best call quality.

If the samples don't meet your needs and you decide to customize your Azure Communication Services calling solution, implement the following capabilities to support a high-quality calling experience. The tools for these capabilities help prevent common quality and reliability problems from happening and diagnose problems if they occur. Keep in mind that some call data isn't created or stored unless you implement these capabilities.

The following sections detail the tools to implement at the phases of a call:

- **Before a call**: Pre-call readiness.
- **During a call**: In-call communication.
- **After a call**: Monitoring and troubleshooting call quality and reliability.

### Before a call

By using the pre-call checks that Azure Communication Services provides, you can learn a user's connection status before the call and take proactive action on their behalf. For example, if you learn that a user's connection is poor, you can suggest that they turn off their video before joining the call to have a better audio connection.

#### Network Diagnostic tool

The Network Diagnostic tool provides a hosted experience for developers to validate call readiness during development. You can check if a user's device and network conditions are optimal for connecting to the service, to help ensure a great call experience. The tool performs diagnostics on the network, devices, and call quality.

By using the Network Diagnostic tool, you can encourage users to resolve reliability problems and improve their network connection before they join a call.

For more information, see [Network Diagnostic tool](../developer-tools/network-diagnostic.md).

##### Pre-Call API for diagnostics

Maybe you want to build your own diagnostic tool or perform a deeper integration of the Network Diagnostic tool into your application. If so, you can use the Pre-Call API to run the diagnostic tool for the Calling SDK.

The Pre-Call API lets you customize the experience in your user interface. You can then run the same series of tests that the Network Diagnostic tool uses to ensure compatibility, connectivity, and device permissions with a test call. You can decide the best way to tell users how to correct problems before calls begin. You can also perform specific checks when troubleshooting quality and reliability problems.

For example, if a user's hardware test has a problem, you can notify the user to manage expectations and changes for future calls.

For more information, see [Pre-Call diagnostic](pre-call-diagnostics.md).

#### Conflicting call clients

Because Azure Communication Services voice and video calls run on web and mobile browsers, your users might have multiple browser tabs running separate instances of the Azure Communication Services Calling SDK. This situation can happen for various reasons, like these examples:

- The user forgot to close a previous tab.
- The user couldn't join a call without a meeting organizer present. The user reattempts to select the link for joining the meeting, which opens a separate mobile browser tab.

Having multiple call browser tabs at the same time causes disruptions to audio and video behavior on the call that the user is trying to join (that is, the *target call*). You should make sure that multiple browser tabs aren't open before a call starts and (through monitoring) during the whole life cycle of the call. You can proactively notify customers to close their excess tabs, or help them join a call correctly with useful messaging if they initially can't join a call.

To check if user has multiple instances of Azure Communication Services running in a browser, see [How to detect if an application using the Azure Communication Services SDK is active in multiple tabs of a browser](../../how-tos/calling-sdk/is-sdk-active-in-multiple-tabs.md).

### During a call

During a call, a user's network conditions can worsen, or they might run into reliability and compatibility problems. Those situations can result in a poor calling experience. The following sections help you apply capabilities to manage problems in a call and communicate with your users.

#### User Facing Diagnostics

When a user is in a call, it's important to notify them in real time about problems on their call. The User Facing Diagnostics feature provides real-time flags for problems that affect the user, such as having their microphone muted while talking or having a poor network quality.

You can tailor your user interface messages to best suit your scenarios. For example:

- If a flag identifies a network problem, you can prompt users to turn off their video, change networks, or move to a location that has a better network condition or connection.
- If a flag identifies a device problem, you can nudge the user to switch devices.

In addition to messaging, you can act on users' behalf and consider proactive approaches to protect the limited bandwidth that a user has. If you find that users don't consistently turn off their video after receiving a notification from you, you can proactively turn off a user's video to prioritize their audio connection. You can even hide video capability from customers in your user interface before they join a call.

For more information, see [User Facing Diagnostics](user-facing-diagnostics.md).

#### Video constraints

Video streams consume large amounts of network bandwidth. If you know that your users have limited network bandwidth or poor network conditions, you can control the network usage of a user's video connection by using video constraints. When you limit the amount of bandwidth that a user's video stream can consume, you can protect the bandwidth needed for good audio quality in poor network environments.

To learn more, see [Video constraints](video-constraints.md).

#### Volume indicator

Sometimes users can't hear each other. Maybe the speaker is too quiet, the listener's device doesn't receive the audio packets, or an audio device problem is blocking the sound. Users don't know when the other person can't hear them. You can use the input and output indicator to:

1. Indicate if a user's volume is low or absent.
1. Prompt the user to speak louder or investigate an audio device problem through your user interface.

For more information, see the [quickstart about adding a volume indicator to web calling](../../quickstarts/voice-video-calling/get-started-volume-indicator.md).

#### Media quality statistics

Because network conditions can change during a call, users can report poor audio and video quality even if they started the call without any problems. The *media quality statistics* feature gives you detailed quality metrics on each inbound and outbound audio, video, and screen-share stream. These detailed insights help you monitor calls in progress, show users their network quality status throughout a call, and debug individual calls.  

The metrics in this feature help indicate problems on the Azure Communication Services Client SDK media streams for sending and receiving. As an example, you can actively monitor the outgoing video stream's `availableBitrate` value, notice a persistent drop below the recommended 1.5 Mbps, and notify the user that the video quality is degraded.

Server log data gives you only a general summary of the call after it ends. The detailed media statistics provide low-level metrics throughout the call duration and afterward for deeper analysis.  

To learn more, see [Media quality statistics](media-quality-sdk.md).

#### Optimal Video Count API

During a group call with two or more participants, a user's video quality can fluctuate due to changes in network conditions and their specific hardware limitations. By using the Optimal Video Count API, you can improve a user's call quality by understanding how many video streams their local endpoint can render at a time without worsening quality.

By implementing this feature, you can preserve the call quality and bandwidth of local endpoints that would otherwise attempt to render video poorly. The API exposes the property `optimalVideoCount`, which dynamically changes in response to the network and hardware capabilities of a local endpoint. This information is available at runtime and gets updates throughout the call, so you can adjust a user's visual experience as network and hardware conditions change.

To implement this feature, see the web platform guidance [Manage video during calls](/azure/communication-services/how-tos/calling-sdk/manage-video?pivots=platform-web#remote-video-quality).

### After a call

Before you release and scale your Azure Communication Services calling solution, implement the following monitoring capabilities for quality and reliability to ensure that you're collecting available logs and metrics. The call data isn't stored until you implement the capabilities, so you can't monitor and debug your call quality and reliability without them.

For more information, see [Azure Communication Services Voice Calling and Video Calling logs](../analytics/logs/voice-and-video-logs.md).

#### Start collecting call logs

Review this documentation to start collecting call logs: [Enable logs via Diagnostic Settings in Azure Monitor.](../analytics/enable-logging.md)

To view and analyze the data in Azure Monitor, we recommend that you choose the category group **allLogs** and choose the destination detail of **Send to Log Analytics workspace**. If you don't have a Log Analytics workspace to send your data to, [create one](/azure/azure-monitor/logs/quick-create-workspace).

We recommend that you monitor your data usage and retention policies for cost considerations as needed. For more information, see [Controlling costs](/azure/azure-monitor/essentials/diagnostic-settings#controlling-costs).

#### Diagnose calls by using Call Diagnostics

Call Diagnostics is an Azure Monitor experience that delivers tailored insights through specialized telemetry and diagnostic pages in the Azure portal.

After you begin storing log data in your Log Analytics workspace, you can visualize your search for individual calls and visualize the data in Call Diagnostics. In your Azure Monitor account, go to your Azure Communication Services resource and locate **Call Diagnostics** on the service menu. To learn how to best use this capability, see [Call Diagnostics](call-diagnostics.md).

#### Examine call quality by using voice and video insights

After you enable logs, you can view call insights in your Azure resource by using the visualization examples in [Voice and video insights](../analytics/insights/voice-and-video-insights.md).

You can modify the existing workbooks or even create your own. For more information, see [Azure Workbooks](/azure/azure-monitor/visualize/workbooks-overview).

For examples of deeper suggested analysis, see [Query call logs](../analytics/query-call-logs.md).

#### Analyze user sentiment by using the End of Call Survey

Customer feedback is invaluable. The End of Call Survey helps you understand how your users perceive the overall quality and reliability of your JavaScript or Web SDK calling solution.

You can modify the survey to various formats if you already have a survey solution in place. After you publish survey data, you can view the results in Azure Monitor for analysis and improvements. Azure Communication Services also uses the Survey API results to monitor and improve call quality and reliability.  

To implement the feature, see [Tutorial: Use the End of Call Survey to collect user feedback](../../tutorials/end-of-call-survey-tutorial.md). After you enable diagnostic settings to capture your survey data, you can use [sample call log queries](../analytics/query-call-logs.md) in Azure Log Analytics to analyze your user's perceived quality experience. User feedback can show you call problems you didn't know you had and help you prioritize your quality improvements.

To learn more, see [End of Call Survey overview](end-of-call-survey-concept.md).

#### Analyze your call data directly from the client

By collecting call data such as media statistics, User Facing Diagnostics, and Pre-Call API information, you can review poor-quality calls to conduct root-cause analysis when you're troubleshooting problems.

For example, a user might have an hour-long call and report poor audio at one point in the call. The call might have fired a User Facing Diagnostic flag that indicated a severe problem with the quality of an incoming or outgoing media stream.

By storing the [detailed media statistics](media-quality-sdk.md) from the call, you can review when the User Facing Diagnostics flag occurred to see if high levels of packet loss, jitter, or latency around this time indicate a poor network condition. For example, you can explore whether the network was affected by an external client's unmanaged network, unnecessary network traffic due to improper QoS network prioritization policies, or an unnecessary virtual private network (VPN).

> [!NOTE]
> As a rule, we recommend prioritizing the bandwidth of a user's audio connection before their video connection. We recommend prioritizing both audio and video before other network traffic. When a network can't support both audio and video, you can proactively disable a user's video or nudge a user to disable their video.

#### Request support

If you encounter quality or reliability problems that you can't resolve, you can submit a request for technical support. The more information you can provide in your request, the better. (Native logs are crucial to optimize the response time.) However, you can still submit requests with partial information to start your inquiry. For more information, see [Create an Azure support request](/azure/azure-portal/supportability/how-to-create-azure-support-request).

If you're notified of license requirements while you're trying to request technical support, you might need to choose a paid Azure support plan that best aligns to your needs. See [Compare support plans](https://azure.microsoft.com/support/plans).

If you prefer not to purchase support, you can take advantage of community support. See [Azure Community Support](https://azure.microsoft.com/support/community/).

#### Other considerations

If you don't have access to your customer's Azure portal to view data tied to their Azure resource ID, you can request to query their workspaces to improve quality on their behalf. For more information, see [Query data across Log Analytics workspaces, applications, and resources in Azure Monitor](/azure/azure-monitor/logs/cross-workspace-query).

## Related content

- Learn other best practices: [Best practices: Azure Communication Services calling SDKs](../best-practices.md).
- Explore known issues: [Known issues in the SDKs and APIs](../known-issues.md).
- Learn how to debug calls: [Call Diagnostics](call-diagnostics.md).
- Learn how to use the Log Analytics workspace: [Log Analytics tutorial](/azure/azure-monitor/logs/log-analytics-tutorial).
- Create your own queries: [Get started with log queries in Azure Monitor](/azure/azure-monitor/logs/get-started-queries).
