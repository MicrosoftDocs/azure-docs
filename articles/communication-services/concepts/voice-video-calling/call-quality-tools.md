---
title: Azure Communication Services Call Quality Tools
titleSuffix: An Azure Communication Services concept document
description: Learn how to develop a high quality calling experience with Azure Communication Services
author: amagginetti
ms.author: amagginetti
manager: mvivion

services: azure-communication-services
ms.date: 7/10/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---



# Call Quality Tools: Developing a High Quality Calling experience with Azure Communication Services

This article introduces key tools you can use to monitor, troubleshoot,
and improve call quality in Azure Communication Services. The following materials help you plan for the best end-user experience. Ensure you read our calling overview materials first familiarize yourself.

- Voice and Video Calling - [Azure Communication Services Calling SDK
  overview](calling-sdk-features.md)

- Phone Calling - [Public Switched Telephone Network (PSTN) integration
  concepts](../telephony/telephony-concept.md)

## Monitoring and troubleshooting call quality

Before you release and scale your Azure Communication Services calling
solution, implement these quality and reliability monitoring capabilities
to ensure you're collecting available logs and metrics.


You need to set up these capabilities to find and troubleshoot call-quality issues that come up during your normal operations. Keep in mind, these call data aren't created or stored unless you implement them.

### Call Summary and Call Diagnostics Logs

Call logs show you important insights on individual calls and your
overall quality. For more information, see: [Azure Communication Services Voice Calling and Video Calling logs](../analytics/logs/voice-and-video-logs.md). 

The following fields provide useful insight on each call's quality and reliability. 

<!-- #### sdkVersion 

- Allows you to monitor the deployment of client versions. See our guidance <u>on **Client Versions**</u> to learn how old client versions can impact quality -->

#### Call errors

- The `participantEndReason` is the reason a participant ends a connection. This data helps you identify common trends leading to unplanned call ends (when relevant). See our guidance on [Calling SDK error codes](../troubleshooting-info.md#calling-sdk-error-codes) 


<!-- #### transportType 

- A UDP connection is better than a TCP connection. See our guidance on **<u>UDP vs. TCP</u>** to learn how TCP connections can result in poor quality. -->

<!-- #### <span class="mark">DRAFT UIHint later – what is added quality value with Device, skd, custom tag?</span> -->

#### Summarized Media Quality logs

- These three logs provide an overview of the quality during the call.
  <!-- See our guidance on **<u>Media Quality</u>** to learn more. -->

  - `roundTripTimeAvg`

  - `jitterAvg`

  - `packetLossRateAvg`

#### Start collecting Call logs

Review this documentation to start collecting call logs: [Enable logs via Diagnostic Settings in Azure Monitor](../analytics/enable-logging.md)


- Choose the category group "allLogs" and choose the destination detail of “sSnd to Log Analytics workspace" in order to view and analyze the data in Azure Monitor.

<!-- To enable call logs review this documentation
 [Enable and Access Call Summary and Call Diagnostic Logs](../call-logs-azure-monitor-access.md). Then follow these steps: [Enable logs via Diagnostic Settings in Azure Monitor](../analytics/enable-logging.md) -->

#### Examine call quality with Voice and Video Insights Preview

Once you have enabled logs, you can view call insights in your Azure Resource using visualization examples: [Voice and video Insights](../analytics/insights/voice-and-video-insights.md)

- You can modify the existing workbooks or even create your own: [Azure Workbooks](../../../azure-monitor/visualize/workbooks-overview.md)

- For examples of deeper suggested analysis see our [Query call logs](../analytics/query-call-logs.md)
### Detailed Media Statistics

While our Server log data give you a summary of the call, our Client Media Quality metrics provide low level metrics. These metrics help indicate issues on the ACS client SDK send and receive. To learn more, read: [Media quality statistics](media-quality-sdk.md)

### End of Call Survey 

The End of Call Survey provides you with a tool to understand how your end users perceive the overall quality and reliability of your JavaScript / Web SDK calling solution. The survey can be modified to various survey formats if already have a survey solution in place. Customer feedback is invaluable, after publishing survey data, you can view the survey results in Azure Monitor for analysis and improvements. Azure Communication Services also uses the survey API results to monitor and improve your quality and reliability.  

- To learn more, see: [End of Call Survey overview](end-of-call-survey-concept.md)
- To implement, see: [Tutorial: Use End of Call Survey to collect user feedback](../../tutorials/end-of-call-survey-tutorial.md)

### Other considerations
<!-- - Considerations for Teams user data:
    - [Azure logs and metrics for Teams external users](../interop/guest/monitor-logs-metrics.md) -->

- What if I don’t have access to my customer’s Azure portal to view
  these data? 
    - [Create a log query across multiple workspaces and apps in Azure Monitor](../../../azure-monitor/logs/cross-workspace-query.md)

## Prepare your network and prioritize important network traffic using QoS 

As your users start using Azure Communication Services for calls and meetings, they may experience a caller's voice breaking up or cutting in and out of a call or meeting. Shared video may freeze, or pixelate, or fail altogether. This is due to the IP packets that represent voice and video traffic encountering network congestion and arriving out of sequence or not at all. If this happens (or to prevent it from happening in the first place), use Quality of Service (QoS) by following our
[network recommendations](network-requirements.md).

With QoS, you prioritize delay-sensitive network traffic (for example, voice or video streams), allowing it to "cut in line" in front of
traffic that is less sensitive (like downloading a new app, where an extra second to download isn't a big deal). QoS identifies and marks all packets in real-time streams using Windows Group Policy Objects and a routing feature called Port-based Access Control Lists, which instructs your network to give voice, video, and screen sharing their own dedicated network bandwidth.

Ideally, you implement QoS on your internal network while getting ready to roll out your Azure Communication Services solution, but you can do it anytime. If you're small enough, you might not need QoS.

For detailed guidance, read: see [Network optimization](network-requirements.md#network-optimization).

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

## Important tools and resources to implement before deployment.

### User Facing Diagnostics (UFDs)

- Provides real-time flags for issues to the user such as having their
  microphone muted while talking or having a poor network quality. Our
  user facing diagnostics provides real-time flags for issues to the
  user such as having their microphone muted while talking or having a
  poor network quality. You can nudge or act on their behalf. For
  example, if there's a network issue identified you can nudge the user
  to change networks or move to a location with a better connection. If
  there's a device issue identified, you can nudge the user to switch
  devices.

- For more information, please see: [User Facing Diagnostics](user-facing-diagnostics.md).

### Volume Indicator API

- The input and output indicator indicate if a user’s volume is
  low, you can prompt the user to speak louder.

- For more information, please see: [Add volume indicator to your web calling](../../quickstarts/voice-video-calling/get-started-volume-indicator.md)

### Pre-Call Diagnostics API

- You can run a series of tests to ensure compatibility, connectivity,
  and device permissions with a test call and give users an opportunity
  to correct issues before calls begin.

  - You can encourage users to use the best network connection they can
    find.

  <!-- - ~~If a user has a poor network connection, you can instruct them to
    join their audio from [PSTN (Public Switched Telephone Network)
    voice
    calling](https://learn.microsoft.com/en-us/azure/communication-services/concepts/telephony/telephony-concept)
    before they join.~~ -->

  - If their hardware test has an issue, you can notify the users
    involved to manage expectations and change for future calls.

- For more information, please see: [Pre-Call diagnostic](pre-call-diagnostics.md).

### Network Diagnostic Tool 

- The Network Diagnostics Tool Provides a hosted experience for
  developers to validate call readiness during development. You can
  check if a user’s device and network conditions are optimal for
  connecting to the service to ensure a great call experience. The tool
  performs diagnostics on the network, devices, and call quality.

- For more information, please see: [Network Diagnostics Tool](../developer-tools/network-diagnostic.md).
  <!-- - <span class="mark">Visual</span> - [ACS Network Diagnostic
    Tool](https://azurecommdiagnostics.net/) -->

### Browser support

- You can check if an application is running a supported browser to
  ensure they can properly support audio and video calling.

- To learn more, see: [How to verify if your application is running in a web browser supported by Azure Communication Services](../../how-tos/calling-sdk/browser-support.md).

### Video Constraints

- You can improve audio quality in poor network environments by reducing
  the amount of bandwidth user’s video streams consume. Freeing up
  bandwidth can improve audio quality in poor network environments.

- To learn more, see: [Video constraints](video-constraints.md).

### Simulcast

- Supporting Simulcast improves video quality and reduces overall
  bandwidth consumption by letting users on poor networks receive
  specialized low fidelity video streams.

- To learn more, see: [Simulcast](simulcast.md).

### Conflicting call clients

- Sometimes users may have multiple browser tabs with instances of Azure
  Communication Services running that can cause disruptions to audio and video
  behavior on the target call. 

    - To check if user has multiple instances
  of ACS running in a browser, see: [How to detect if an application using Azure Communication Services' SDK is active in multiple tabs of a browser](../../how-tos/calling-sdk/is-sdk-active-in-multiple-tabs.md).

## How to use quality tools

- **Pre-call readiness** – By using the pre-call checks ACS provides,
  you can learn a user’s connection status before the call and take
  proactive action on their behalf. For example, if you learn a user’s
  connection is poor you suggest they turn off their video before
  joining the call to have a better audio connection. 

<!-- ~~You could also
  have callers with poor network conditions join from [PSTN (Public
  Switched Telephone Network) voice
  calling](https://learn.microsoft.com/en-us/azure/communication-services/concepts/telephony/telephony-concept).~~ -->

- **In-call communication** – During a call, a user’s network conditions
  can worsen. You can use User Facing Diagnostics to proactively notify
  the user that their network connection is poor and prompt them to
  turn off their video or improve their network connection. You can
  tailor your user message to best address your scenarios. In addition
  to messaging, you can consider proactive approaches to protect the
  limited bandwidth a user has. For example, if you find that users
  don’t consistently turn off their video upon receiving a notification
  prompt from you, then you can proactively turn a user’s video off to
  prioritize their audio connection, or even hide video capability from
  customer in your User Interface before they join.

- **Analyze call data** – By collecting Media Statistics, User Facing
  Diagnostics, and pre-call API information you can review calls with
  poor quality to conduct root cause analysis. For example, media
  quality statistics showing high levels of packet loss and jitter
  without any user facing diagnostics could indicate poor network
  conditions. You can examine your Quality of Service network policy
  to see if there was an unnecessary Virtual Private Network (VPN) that
  added more network overhead to certain calls, or if an external clients
  unmanaged network caused poor quality.

  - **Note:** As a rule, we recommend prioritizing a user’s Audio
  connection bandwidth before their video connection and both audio and video before
  other network traffic. If a network is unable to support both audio
  and video, you can proactively disable a user’s video or nudge a user
  to disable their video.


## Next Steps

- Continue to learn other best practices, see: [Best practices: Azure Communication Services calling SDKs](../best-practices.md)


-	Learn how to use the Log Analytics workspace, see: [Log Analytics Tutorial](../../../../articles/azure-monitor/logs/log-analytics-tutorial.md)

-	Create your own queries in Log Analytics, see: [Get Started Queries](../../../../articles/azure-monitor/logs/get-started-queries.md)


<!-- Comment this out - add to the toc.yml file at row 583.

    - name: Quality and Reliability
      items:
      - name: Call Quality Tools
        href: concepts/voice-video-calling/call-quality-tools.md
      - name: End of Call Survey
        href: concepts/voice-video-calling/end-of-call-survey-concept.md
 -->
