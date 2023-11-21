---
title: Azure Communication Services Manage Calling Quality
titleSuffix: An Azure Communication Services concept document
description: Learn how to improve and manage calling quality with Azure Communication Services
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

This article introduces key tools you can use to monitor, troubleshoot,
and improve call quality in Azure Communication Services. The following materials help you plan for the best end-user experience. Ensure you read our calling overview materials first to familiarize yourself.

- Voice and Video Calling - [Azure Communication Services Calling SDK
  overview](calling-sdk-features.md)

- Phone Calling - [Public Switched Telephone Network (PSTN) integration
  concepts](../telephony/telephony-concept.md)

## Prepare your network and prioritize important network traffic using QoS 

As your users start using Azure Communication Services for calls and meetings, they may experience a caller's voice breaking up or cutting in and out of a call or meeting. Shared video may freeze, or pixelate, or fail altogether. This is due to the IP packets that represent voice and video traffic encountering network congestion and arriving out of sequence or not at all. If this happens (or to prevent it from happening in the first place), use Quality of Service (QoS) by following our
[network recommendations](network-requirements.md).

With QoS, you prioritize delay-sensitive network traffic (for example, voice or video streams), allowing it to "cut in line" in front of
traffic that is less sensitive (like downloading a new app, where an extra second to download isn't a big deal). QoS identifies and marks all packets in real-time streams using Windows Group Policy Objects and a routing feature called Port-based Access Control Lists, which instructs your network to give voice, video, and screen sharing their own dedicated network bandwidth.

Ideally, you implement QoS on your internal network while getting ready to roll out your Azure Communication Services solution, but you can do it anytime. If you're small enough, you might not need QoS.

For detailed guidance, see: [Network optimization](network-requirements.md#network-optimization).

## Prepare your deployment for quality and reliability investigations

Quality has different definitions depending on the real-time
communication use case and perspective of the end users. There are many
variables that affect the perceived quality of a real-time calling
experience, an improvement in one variable may cause a negative changes
in another variable. For example, increasing the frame rate and
resolution of a video call increases network bandwidth utilization
and processing power.

Therefore, you need to determine your customer’s use cases and
requirements before starting your development. For example, a customer
who needs to monitor dozens of security cameras feeds simultaneously may
not need the maximum resolution and frame rate that each video stream
can provide. In this scenario, you could utilize our [Video constraints](video-constraints.md) capability to limit the amount of bandwidth used by each video stream.

## Implement existing quality and reliability capabilities before deployment

> [!Note]
> We recommend you use our easy to implement samples since they are already optimized to give your users the best call quality. Please see: [Samples](../../overview.md#samples)

If our calling samples don't meet your needs or you decide to customize your solution please ensure you understand and implement the following capabilities in your custom calling scenarios. 

Before you launch and scale your customized Azure Communication Services calling
solution, implement the following capabilities to support a high quality calling experience. These tools help prevent common quality and reliability calling issues from happening and diagnose issues if they occur. Keep in mind, some of these call data aren't created or stored unless you implement them.

The following sections detail the tools to implement at different phases of a call: 
- **Before a call**
- **During a call**
- **After a call**

## Before a call
**Pre-call readiness** – By using the pre-call checks Azure Communication Services provides,
  you can learn a user’s connection status before the call and take
  proactive action on their behalf. For example, if you learn a user’s
  connection is poor you can suggest they turn off their video before
  joining the call to have a better audio connection. 

<!-- This is not possible yet ... ~~You could also
  have callers with poor network conditions join from [PSTN (Public
  Switched Telephone Network) voice
  calling](/en-us/azure/communication-services/concepts/telephony/telephony-concept).~~ -->


<!-- TODO need to add a Permissions section. - filippos for input

- needs OS level permissions.

- needs device permission.

- needs to return true for both Audio and Video. If false then know issues. review the Blog post on this best practice . . .  -->


### Network Diagnostic Tool 

The Network Diagnostic Tool provides a hosted experience for
  developers to validate call readiness during development. You can
  check if a user’s device and network conditions are optimal for
  connecting to the service to ensure a great call experience. The tool
  performs diagnostics on the network, devices, and call quality.

  - By using the network diagnostic tool, you can encourage users to resolve reliability issues and improve their network connection before joining a call. 



- For more information, please see: [Network Diagnostics Tool](../developer-tools/network-diagnostic.md).
  <!-- - <span class="mark">Visual</span> - [ACS Network Diagnostic
    Tool](https://azurecommdiagnostics.net/) -->



#### Pre-Call Diagnostics API

Maybe you want to build your own Network Diagnostic Tool or to perform a deeper integration of this tool into your application. If so, you can use the Pre-Call diagnostic APIs that run the Network Diagnostic Tool for the calling SDK. The Pre-Call Diagnostics API lets you customize the experience in your user interface. You can then run the same series of tests that the Network Diagnostic Tool uses to ensure compatibility, connectivity, and device permissions with a test call. You can decide the best way to tell users how to correct issues before calls begin. You can also perform specific checks when troubleshooting quality and reliability issues.

  <!-- - ~~If a user has a poor network connection, you can instruct them to
    join their audio from [PSTN (Public Switched Telephone Network)
    voice
    calling](/en-us/azure/communication-services/concepts/telephony/telephony-concept)
    before they join.~~ -->

  - For example, if a user's hardware test has an issue, you can notify the users
    involved to manage expectations and change for future calls. 

- For more information, please see: [Pre-Call diagnostic](pre-call-diagnostics.md).

<!-- NOTE - developers can run a separate browser test now, but there's no use case specific to just doing that check we should highlight here.

### Browser support

When user's use unsupported browsers it can be difficult to diagnose call issues after they occur. To optimize call quality check if an application is running a supported browser before user's join to
  ensure they can properly support audio and video calling.

- To learn more, see: [How to verify if your application is running in a web browser supported by Azure Communication Services](../../how-tos/calling-sdk/browser-support.md). -->


### Conflicting call clients

Because Azure Communication Services Voice and Video calls run on web and mobile browsers your users may have multiple browser tabs running separate instances of the Azure
  Communication Services calling SDK. This can happen for various reasons. Maybe the user forget to close their previous tab. Maybe the user couldn't join a call without a meeting organizer present and they re-attempt to open the meeting join url link, which opens a separate mobile browser tab. No matter how a user ends up with multiple call browser tabs at the same time, it causes disruptions to audio and video
  behavior on the call they're trying to participate in, referred to as the target call. You should make sure there aren't multiple browser tabs open before a call starts, and also monitor during the whole call lifecycle. You can pro-actively notify customers to close their excess tabs, or help them join a call correctly with useful messaging if they're unable to join a call initially.

 - To check if user has multiple instances
  of Azure Communication Services running in a browser, see: [How to detect if an application using Azure Communication Services' SDK is active in multiple tabs of a browser](../../how-tos/calling-sdk/is-sdk-active-in-multiple-tabs.md).

## During a call

**In-call communication** – During a call, a user’s network conditions
  can worsen or they may run into reliability and compatibility issues, all of which can result in a poor calling experience. This section helps you apply capabilities to manage issues in a call and communicate with your users. 

### User Facing Diagnostics (UFDs)

When a user is in a call, it's important to proactively notify them in real-time about issues on their call. User Facing Diagnostics (UFDs) provide real-time flags for issues to the user such as having their
  microphone muted while talking or having a poor network quality. You can nudge or act on their behalf. In addition to messaging, you can consider proactive approaches to protect the limited bandwidth a user has. You can tailor your user interface messages to best suite your scenarios. If you find users
  don’t consistently turn off their video upon receiving a notification
 from you, then you can proactively turn a user’s video off to
  prioritize their audio connection, or even hide video capability from
  customer in your User Interface before they join a call. 

**For example:**

- If there's a network issue identified you can prompt users to
  turn off their video, change networks, or move to a location with a better network condition or connection. 
- If there's a device issue identified, you can nudge the user to switch
  devices.


- For more information, please see: [User Facing Diagnostics](user-facing-diagnostics.md).


### Video constraints

Video streams consume large amounts of network bandwidth, if you know your users have limited network bandwidth or poor network conditions you can reduce control the network usage of a user's video connection with video constraints. When you limit the amount of bandwidth a user's video stream can consume you can protect the bandwidth needed for good audio quality in poor network environments.

- To learn more, see: [Video constraints](video-constraints.md).


### Volume indicator

Sometimes users can't hear each other, maybe the speaker is too quiet, the listener's device doesn't receive the audio packets, or there's an audio device issue blocking the sound. Users don't know when they're speaking too quietly, or when the other person can't hear them. You can use the input and output indicator to indicate if a user’s volume is low or absent and prompt a user to speak louder or investigate an audio device issue through your user interface.

- For more information, please see: [Add volume indicator to your web calling](../../quickstarts/voice-video-calling/get-started-volume-indicator.md)


### Detailed media statistics


Since network conditions can change during a call, users can report poor audio and video quality even if they started the call without issue. Our Media statistics give you detailed quality metrics on each inbound and outbound audio, video, and screen share stream. These detailed insights help you monitor calls in progress, show users their network quality status throughout a call, and debug individual calls.  

- These metrics help indicate issues on the Azure Communication Services client SDK send and receive media streams. As an example, you can actively monitor the outgoing video stream's `availableBitrate`, notice a persistent drop below the recommended 1.5 Mbps and notify the user their video quality is degraded. 

- It's important to note that our Server Log data only give you an overall summary of the call after it ends. Our detailed Media Statistics provide low level metrics throughout the call duration for use in during the call and afterwards for deeper analysis.  
- To learn more, see: [Media quality statistics](media-quality-sdk.md)


### Optimal video count
During a group call with 2 or more participants a user's video quality can fluctuate due to changes in network conditions and their specific hardware limitations. By using the Optimal Video Count API, you can improve user call quality by understanding how many video streams their local endpoint can render at a time without worsening quality. By implementing this feature, you can preserve the call quality and bandwidth of local endpoints that would otherwise attempt to render video poorly. The API exposes the property, optimalVideoCount, which dynamically changes in response to the network and hardware capabilities of a local endpoint. This information is available at runtime and updates throughout the call letting you adjust a user’s visual experience as network and hardware conditions change.

- To implement, visit web platform guidance [Manage Video](/azure/communication-services/how-tos/calling-sdk/manage-video?pivots=platform-web) and review the section titled Remote Video Quality. 

<!-- NOTE - cannot link the URL to a sub-header within a pivoted document -->
### End of Call Survey 

Customer feedback is invaluable, the End of Call Survey provides you with a tool to understand how your end users perceive the overall quality and reliability of your JavaScript / Web SDK calling solution. The survey can be modified to various survey formats if already have a survey solution in place. After publishing survey data, you can view the survey results in Azure Monitor for analysis and improvements. Azure Communication Services also uses the survey API results to monitor and improve your quality and reliability.  

- To learn more, see: [End of Call Survey overview](end-of-call-survey-concept.md)
- To implement, see: [Tutorial: Use End of Call Survey to collect user feedback](../../tutorials/end-of-call-survey-tutorial.md)



## After a call
**Monitor and troubleshoot call quality and reliability** - Before you release and scale your Azure Communication Services calling
solution, implement these quality and reliability monitoring capabilities
to ensure you collecting available logs and metrics. These call data aren't stored unless you implement them.
### Call Summary and Call Diagnostics Logs

After a call ends, call logs are created to help you investigate individual calls and monitor your overall call quality and reliability. The following fields provide useful insight on user's call quality and reliability. 


- For more information, see: [Azure Communication Services Voice Calling and Video Calling logs](../analytics/logs/voice-and-video-logs.md). 


<!-- #### sdkVersion 

- Allows you to monitor the deployment of client versions. See our guidance <u>on **Client Versions**</u> to learn how old client versions can impact quality -->

#### Call errors

- The `participantEndReason` is the reason a participant ends a connection. This data helps you identify common trends leading to unplanned call ends (when relevant). See our guidance on [Calling SDK error codes](../troubleshooting-info.md#calling-sdk-error-codes) 


<!-- #### transportType 

- A UDP connection is better than a TCP connection. See our guidance on **<u>UDP vs. TCP</u>** to learn how TCP connections can result in poor quality. -->

<!-- #### <span class="mark">DRAFT UIHint later – what is added quality value with Device, skd, custom tag?</span> -->

#### Summarized Media Quality logs

- These three logs give you insight on the average media quality during the call.
  <!-- See our guidance on **<u>Media Quality</u>** to learn more. -->

  - `roundTripTimeAvg`

  - `jitterAvg`

  - `packetLossRateAvg`


### Start collecting call logs

Review this documentation to start collecting call logs: [Enable logs via Diagnostic Settings in Azure Monitor](../analytics/enable-logging.md)

- Choose the category group "allLogs" and choose the destination detail of “Send to Log Analytics workspace" in order to view and analyze the data in Azure Monitor.

<!-- To enable call logs review this documentation
 [Enable and Access Call Summary and Call Diagnostic Logs](../call-logs-azure-monitor-access.md). Then follow these steps: [Enable logs via Diagnostic Settings in Azure Monitor](../analytics/enable-logging.md) -->

### Examine call quality with Voice and Video Insights Preview

Once you have enabled logs, you can view call insights in your Azure Resource using visualization examples: [Voice and video Insights](../analytics/insights/voice-and-video-insights.md)

- You can modify the existing workbooks or even create your own: [Azure Workbooks](../../../azure-monitor/visualize/workbooks-overview.md)

- For examples of deeper suggested analysis see our [Query call logs](../analytics/query-call-logs.md)

<!-- #### Detailed Media Statistics -->


#### End of Call Survey
Once you enable diagnostic settings to capture your survey data you can use our sample [call log queries](../analytics/query-call-logs.md) in Azure Log Analytics to analyze your user's perceived quality experience. User feedback can show you call issues you didn't know you had and help you prioritize your quality improvements. 

### Analyze your call data
By collecting call data such as Media Statistics, User Facing Diagnostics, and pre-call API information you can review calls with
  poor quality to conduct root cause analysis when troubleshooting issues. For example, a user may have an hour long call and report poor audio at one point in the call. 

The call may have fired a User Facing Diagnostic indicating a severe problem with the incoming or outgoing media steam quality. By storing the [detailed media statistics](media-quality-sdk.md) from the call you can review when the UFD occurred to see if there were high levels of packet loss, jitter, or latency around this time indicating a poor network condition. You explore whether the network was impacted by an external client's unmanaged network, unnecessary network traffic due to improper Quality of Service (QoS) network prioritization policies, or an unnecessary Virtual Private Network (VPN) for example.

> [!NOTE] 
> As a rule, we recommend prioritizing a user’s Audio connection bandwidth before their video connection and both audio and video before other network traffic. When a network is unable to support both audio and video, you can proactively disable a user’s video or nudge a user to disable their video.

### Other considerations
<!-- - Considerations for Teams user data:
    - [Azure logs and metrics for Teams external users](../interop/guest/monitor-logs-metrics.md) -->

- If you don't have access to your customer’s Azure portal to view data tied to their Azure Resource ID you can query their workspaces to improve quality on their behalf? 
    - [Create a log query across multiple workspaces and apps in Azure Monitor](../../../azure-monitor/logs/cross-workspace-query.md)


## Next steps

- Continue to learn other best practices, see: [Best practices: Azure Communication Services calling SDKs](../best-practices.md)

-	Learn how to use the Log Analytics workspace, see: [Log Analytics Tutorial](../../../../articles/azure-monitor/logs/log-analytics-tutorial.md)

-	Create your own queries in Log Analytics, see: [Get Started Queries](../../../../articles/azure-monitor/logs/get-started-queries.md)


<!-- Comment this out - add to the toc.yml file at row 583.

    - name: Monitor and manage call quality
      items:
      - name: Manage call quality
        href: concepts/voice-video-calling/manage-call-quality.md
        displayName: diagnostics, Survey, feedback, quality, reliability, users, end, call, quick
      - name: End of Call Survey
        href: concepts/voice-video-calling/end-of-call-survey-concept.md
        displayName: diagnostics, Survey, feedback, quality, reliability, users, end, call, quick
 -->
