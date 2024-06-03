---
title: Azure Communication Services troubleshooting VoIP call quality
titleSuffix: An Azure Communication Services concept document
description: Learn how to troubleshoot web VoIP call quality with Azure Communication Services.
author: Cardiohater1
ms.author: drohmetra
manager: dacarte

services: azure-communication-services
ms.date: 3/6/2024
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---


# Troubleshooting VoIP call quality 

This article describes how to troubleshoot and improve web VoIP call quality in Azure Communication Services.

Voice and video calling experiences are an essential communication tool for businesses, organizations, and individuals in today's world. However, customers can experience quality issues. Quality in calls can be impacted based on four network parameters: bandwidth available, round-trip time (RTT), packet loss, and jitter. 

VoIP calling using Azure Communication Services is an efficient and reliable way to communicate. If quality issues arise, follow the troubleshooting steps in this article to ensure the best possible user experience. 

## Pre call check-up 

When using the internet at various locations, you experience different internet speeds. At home, internet speed and reliability can differ due to factors such as the type of internet connection, the quality of the router, and the number of devices connected to the network. In the office, internet speed and reliability are impacted by the number of users on the network, the quality of the network infrastructure, and the type of internet connection. When you are using cellular data, internet speed and reliability are affected by factors such as the strength of the cellular signal, the distance from the cell tower, and the number of users on the network. Additionally, some cellular plans have data caps or throttling, which can affect internet speed and reliability.  

Overall, internet connections can vary depending on the location and the factors that affect the quality of the connection. It's important to test network ability. 

Run a network diagnostic check at [Azure Communication Services Network Diagnostic Tool](https://azurecommdiagnostics.net/) to learn more about the network connection and settings of your machine. This tool checks all the essential parameters to help you determine if the network connection at your local machine is compatible with Azure Communication Services. You can also run this test this on mobile devices. For more information about network quality, bandwidth, configuration, and optimization, see [Network recommendations](network-requirements.md).

Enable logging via diagnostic settings in Azure monitor. For more information, see [Enable logs via Diagnostic Settings in Azure Monitor](../analytics/enable-logging.md).

Once the logs are enabled, you can view call insights in your Azure resource. For more information, see [Voice an video Insights Preview](../analytics/insights/voice-and-video-insights.md). 

You can improve audio quality in poor network environments by using video constraints to reduce the number of bandwidth users video streams consume. For more information, see [Video constraints](video-constraints.md). 

You can programmatically validate a client’s readiness to join an Azure Communication Services Call using the Pre-Call API. Access this API through the Calling SDK. The Pre-Call API provides multiple diagnostics including device, connection, and call quality. Pre-Call APIs are available only for Web (JavaScript). We welcome your feedback about other platforms you would like to see prioritized. For more information, see [Pre-Call diagnostic](pre-call-diagnostics.md). 

## Network issues that can cause quality problems 

### Choppy or robotic sounding call audio 

When call audio has robotic-sounds or choppy cuts in and out, it can be caused by packet loss due to excessive jitter on the line. Jitter is the term used when packets are received out-of-order and can be caused by several factors including network traffic, or the technologies used in the call. 

### One-way or missing call audio 

When a caller can hear the other party, but the other party can't hear the caller, we refer to this as one-way audio. Missing audio streams can be caused by several factors including errors in the connection/handshake, problems during a network handoff, or issues at the source or destination. 

### Delayed call audio 

When caller or callee reports excessive delays in the call audio. It can be caused by excessive latency on the line. Call audio latency can be caused by several factors including delayed packet transmission or delivery somewhere along the line, or the technologies used in the call. 

### Call audio echoing 

When a caller or callee reports that they hear their own delayed audio being transmitted back to them, we refer to this as call audio echo. Echo can be caused by positioning and volume levels of the speaker and microphone at one end of the line, or by crosstalk on copper wire (landline) networks. 

### Volume indicator API

When a caller or callee reports that the volume of a call is either too loud or too quiet, we typically classify this as a call audio volume issue. These call volume issues are often caused by the hardware used, including the positioning and levels of the speaker and/or microphone at one end of the line. If the input and output indicator show that the user’s volume is low, you can prompt the user to speak louder. 

For more information, see [Accessing call volume level](../../quickstarts/voice-video-calling/get-started-volume-indicator.md). 

### Call static 

When a caller or callee reports audio interference or background noise on a call, we typically classify this as a call audio static issue. These audio quality issues can be caused by the hardware in use, including the placement, positioning, and levels of the speaker and/or microphone at one end of the line. 

Also, make sure that the application you're using for web calling is hosted on the latest SDK. For more information, see [Azure Communication Services Calling Web (JavaScript) SDK - Release History](https://github.com/Azure/Communication/blob/master/releasenotes/acs-javascript-calling-library-release-notes.md).

## Mid call check-ups

Developers can enable user facing diagnostics (UFD) in web calling applications. UFDs help the end customers see what is wrong with the call, such as an unreliable network connection or the microphone isn't responding. For more information about UFDs, see [User Facing Diagnostics](user-facing-diagnostics.md). 

You can enable media statistics on the web calling application to help debug and troubleshoot quality related issues on Azure Communication Services Web calling. Media statistics includes, round-trip time (RTT), bitrates, packet loss, jitter, and so on. Media statistics help engineers better understand the problem and the exact timing. For more information, see [Media quality statistics](media-quality-sdk.md). 

Sometimes users have multiple browsers tabs with instances of Azure Communication Services running that can disrupt audio and video behavior on the target call. You can detect if a user has multiple instances running in a browser. For more information, see [How to detect if an application using Azure Communication Services' SDK is active in multiple tabs of a browser](../../how-tos/calling-sdk/is-sdk-active-in-multiple-tabs.md). 

## Post call check-ups 

You can check the log insights from the Azure portal for calling to determine the exact issue during the call. For more information, see [Query call logs](../analytics/query-call-logs.md). 

If you tried all the previous steps and still face quality issues, [Create an Azure support request](../../../azure-portal/supportability/how-to-create-azure-support-request.md). If necessary, Microsoft can run a network check for your tenant to ensure call quality.

## End of call survey 

Enable End of Call surveys to give Azure Communication Services users the option to submit qualitative feedback about their call experience. 

For more information, see [End of Call Survey overview](end-of-call-survey-concept.md) and related tutorial [Use the End of Call Survey to collect user feedback](../../tutorials/end-of-call-survey-tutorial.md). 

## Next steps

For more information about using Call Quality Dashboard (CQD) to view interop call logs, see [Use CQD to manage call and meeting quality in Microsoft Teams](/microsoftteams/quality-of-experience-review-guide).

For more information about Calling SDK error codes, see [Troubleshooting in Azure Communication Services](../troubleshooting-info.md#calling-sdk-error-codes). You can use these codes to help determine why a call ended with disruptions.

To ensure smooth functioning of the application and provide better user experience, app developers should follow a checklist. For more information, see the [Checklist for advanced calling experiences in web browsers - Microsoft Community Hub](https://techcommunity.microsoft.com/t5/azure-communication-services/checklist-for-advanced-calling-experiences-in-web-browsers/ba-p/3266312). 

For more information about preparing your network or your customers’ network, see [Network recommendations](network-requirements.md).
 
For best practices regarding Azure Communication Services web calling, see [Best practices: Azure Communication Services calling SDKs](../best-practices.md). 

