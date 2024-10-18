---
title: Azure Communication Services troubleshooting VoIP call quality
titleSuffix: An Azure Communication Services concept article
description: Learn how to troubleshoot web VoIP call quality with Azure Communication Services.
author: sloanster
ms.author: micahvivion

services: azure-communication-services
ms.date: 10/17/2024
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---

# Troubleshoot VoIP call quality 

This article describes how to troubleshoot and improve web Voice over Internet Protocol (VoIP) call quality in Azure Communication Services. Voice and video calling experiences are an essential communication tool for businesses, organizations, and individuals in today's world. However, customers can experience quality problems. Four network parameters can affect quality in calls: available bandwidth, round-trip time (RTT), packet loss, and jitter.

If quality problems arise with VoIP calling in Azure Communication Services, follow the troubleshooting guidance in this article to ensure the best-possible user experience.

## Network conditions that can cause quality problems

The following conditions can happen with audio during a call.

### Choppy or robotic-sounding audio

When call audio sounds choppy, sounds robotic, or cuts in and out, the reason might be by packet loss due to excessive jitter on the line. *Jitter* means that packets are received out of order. Several factors can cause it, including network traffic or the technologies used in the call.

### One-way or missing audio

When a caller can hear the other party, but the other party can't hear the caller, we refer to this condition as *one-way audio*. Several factors can cause missing audio streams, including errors in the connection or handshake, problems during a network handoff, or problems at the source or destination.

### Delayed audio

When caller or callee reports excessive delays in the call audio, the reason can be excessive latency on the line. Several factors can cause audio latency, including delayed packet transmission or delivery somewhere along the line, or the technologies used in the call.

### Audio echo

When a caller or callee reports that they hear their own delayed audio being transmitted back to them, we refer to this condition as *audio echo*. The causes of echo can be positioning and volume levels of the speaker and/or microphone at one end of the line, or crosstalk on copper wire (landline) networks.

### Audio volume problem

When a caller or callee reports that the volume of a call is either too loud or too quiet, we typically classify this condition as an audio volume problem. The cause is often the hardware, including the positioning and volume levels of the speaker and/or microphone at one end of the line. If the input and output indicator shows that the user's volume is low, you can prompt the user to speak louder.

For more information, see [Access call volume level in your calling app](../../quickstarts/voice-video-calling/get-started-volume-indicator.md).

### Static

When a caller or callee reports audio interference or background noise on a call, we typically classify this condition as an audio static problem. The cause can be the hardware in use, including the placement, positioning, and levels of the speaker and/or microphone at one end of the line.

Also, make sure that the application you're using for web calling is hosted on the latest SDK. For more information, see [Azure Communication Services Calling Web (JavaScript) SDK - Release History](https://github.com/Azure/Communication/blob/master/releasenotes/acs-javascript-calling-library-release-notes.md).

## Precall checkups

When you're using the internet at various locations, you experience different internet speeds. Factors like the following examples can affect internet speed and reliability:

- At home: the type of internet connection, the quality of the router, and the number of devices connected to the network.
- In the office: the number of users on the network, the quality of the network infrastructure, and the type of internet connection.
- When you're using cellular data: the strength of the cellular signal, the distance from the cell tower, and the number of users on the network. Additionally, some cellular plans have data caps or throttling.

Because of this variability, it's important to test the network connection and settings of your machine. You can run a network diagnostic check by using the [Azure Communication Services Network Diagnostic tool](https://azurecommdiagnostics.net/). This tool checks all the essential parameters to help you determine if the network connection at your local machine is compatible with Azure Communication Services. You can also run this tool on mobile devices. For more information about network quality, bandwidth, configuration, and optimization, see [Network recommendations](network-requirements.md).

You can also take advantage of these features in Azure Communication Services:

- Enable logging via [diagnostic settings in Azure Monitor](../analytics/enable-logging.md). You can then view [call insights in your Azure resource](../analytics/insights/voice-and-video-insights.md).

- Improve audio quality in poor network environments by using [video constraints](video-constraints.md) to reduce the bandwidth that users of video streams consume.

- Programmatically validate a client's readiness to join an Azure Communication Services call by using the [Pre-Call API](pre-call-diagnostics.md). You access this API through the Calling SDK. It provides multiple diagnostics, including device, connection, and call quality. This feature is currently available only for the web (JavaScript).

## Mid-call checkups

You can enable these Azure Communication Services features in web calling applications:

- [User Facing Diagnostics](user-facing-diagnostics.md): This feature helps users see what's wrong with a call, such as an unreliable network connection or a microphone that isn't responding.

- [Media quality statistics](media-quality-sdk.md): You can use this feature to debug and troubleshoot quality-related problems with Azure Communication Services calls. Media statistics include factors like RTT, bitrates, packet loss, and jitter. Media statistics help engineers better understand the problem and the exact timing.

Sometimes users have instances of Azure Communication Services running on multiple browser tabs. This situation can disrupt audio and video behavior on the target call. You can detect if a user has multiple instances running in a browser. For more information, see [How to detect if an application using the Azure Communication Services SDK is active in multiple tabs of a browser](../../how-tos/calling-sdk/is-sdk-active-in-multiple-tabs.md).

## Post-call checkups

You can check the log insights from the Azure portal to determine the exact problem during the call. For more information, see [Query call logs](../analytics/query-call-logs.md).

If you tried all the previous actions and still face quality problems, [create an Azure support request](/azure/azure-portal/supportability/how-to-create-azure-support-request). If necessary, Microsoft can run a network check for your tenant to help ensure call quality.

## End of Call Survey

Enable the End of Call Survey feature to give Azure Communication Services users the option to submit qualitative feedback about their call experience. By enabling end of call survey you can learn more about end users calling experience and get insight of how you might improve that experience.

For more information, see [End of Call Survey overview](end-of-call-survey-concept.md) and the related tutorial [Use the End of Call Survey to collect user feedback](../../tutorials/end-of-call-survey-tutorial.md).

## Related content
- For detailed deep dive inspection on how to trouble shoot call quality and reliability see [here](../../resources/troubleshooting/voice-video-calling/general-troubleshooting-strategies/overview.md).
- For information about Calling SDK error codes, see [Troubleshooting in Azure Communication Services](../../resources/troubleshooting/voice-video-calling/troubleshooting-codes.md). Use these codes to help determine why a call ended and how to mitigate the issue.
- For information about using Call Quality Dashboard (CQD) to view interoperability call logs, see [Use CQD to manage call and meeting quality in Microsoft Teams](/microsoftteams/quality-of-experience-review-guide).
- To ensure smooth functioning of the application and provide better user experience, app developers should follow a checklist. For more information, see the blog post [Checklist for advanced calling experiences in web browsers](https://techcommunity.microsoft.com/t5/azure-communication-services/checklist-for-advanced-calling-experiences-in-web-browsers/ba-p/3266312).
- For more information about preparing your network or your customer's network, see [Network recommendations](network-requirements.md).
- For best practices regarding Azure Communication Services web calling, see [Best practices: Azure Communication Services calling SDKs](../best-practices.md).
