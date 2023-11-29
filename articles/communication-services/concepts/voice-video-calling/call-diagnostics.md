---
title: Azure Communication Services Call Diagnostics
titleSuffix: An Azure Communication Services concept document
description: Use Call Diagnostics to diagnose call issues with Azure Communication Services
author: amagginetti
ms.author: amagginetti
manager: chpalm

services: azure-communication-services
ms.date: 11/21/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---



# Call Diagnostics

# Call Diagnostics – Private Preview

Understanding your call quality and reliability is foundational to
delivering a great customer calling experience. There are a variety of
issues that can affect the quality of your calls, such as poor internet
connectivity, software compatibility issues, and technical difficulties
with devices. These issues can be frustrating for all call participants,
whether they are a patient checking in for a doctor’s call, or a student
taking a lesson with their teacher. As a developer, diagnosing and
fixing these issues can be time-consuming and frustrating.

Call Diagnostics acts as a detective for your calls. It helps developers
using Azure Communication Services investigate events during a call to
identify likely causes of poor call quality and reliability. Just like a
real conversation, many things happen simultaneously in a call that may
or may not affect your communication. Call Diagnostics’ timeline makes
it easier to visualize what happened in a call by showing you rich data
visualizations of call events and providing insights into issues that
commonly impact calls.

**How to enable Call Diagnostics**

Azure Communication Services collects call data in the form of metrics
and events. You must enable a Diagnostic Setting in Azure Monitor to
send these data to a Log Analytics workspace for Call Diagnostics to
analyze new call data. [End of call survey logs - An Azure Communication
Services concept document \| Microsoft
Learn](https://learn.microsoft.com/en-us/azure/communication-services/concepts/analytics/logs/end-of-call-survey-logs)

NOTE

As a note, Call Diagnostics can’t query data from data that wasn’t
previously send to a Log Analytics workspace. Diagnostic Settings will
only begin collect data by single Azure Communications Services Resource
ID once enabled. If you have multiple Azure Communications Services
Resource IDs you must enable these settings for each resource ID and
query call details for participants within their respective Azure
Communications Services Resource ID. Your data volume, retention, and
CDC query usage in Log Analytics is billed through existing Azure data
meters, monitor your data usage and retention policies for [cost
considerations as
needed](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/cost-logs).

Since Call Diagnostics is an application layer on top of data for your
Azure Communications Service Resource. You can query these call data and
[build workbook reports on top of your
data](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/data-platform-logs#what-can-you-do-with-azure-monitor-logs).

Call Diagnostics has three main sections:

1.  Call Search

2.  Call Overview

3.  Call Issues

4.  Call Timeline

You can access Call Diagnostics from any Azure Communication Services
Resource in your Azure Portal. When you open your Azure Communications
Services Resource, just look for the “Monitoring” section on the left
side of the screen and click on Call Diagnostics.

Once you have setup Call Diagnostics for your Azure Communication
Services Resource \<**<u>link to section</u>**\> you can search for
calls using valid callIDs that took place in that resource.

# Call Search

The search field allows you to search by callID (**see how to locate
callID**). Clicking on a call will take you to a detail screen where you
see three sections, **Overview**, **Issues**, and **Timeline** for the
selected call. (**insert image)**

Note!

You can click on the information icons on each page within Call
Diagnostics to learn functionality, definitions, and helpful tips.
(**insert image)**


# Call Overview

Once you select a call from the Call Search page your call details will
display in the Call Overview tab. You’ll see a call summary highlighting
the participants in the call and key metrics for their call quality. You
can select a participant to drill into their call timeline details
directly, or navigate to the Call Issues tab for further analysis.

(**<u>TODO insert image)</u>**

Note!

You can click on the information icons on each page within Call
Diagnostics to learn functionality, definitions, and helpful tips.
(**insert image)**

# Call Issues

The Call Issues tab give you a high-level analysis of any media quality
and reliability issues that were detected during the call.

Key Events highlights detected issues known to affect user’s call
quality such as poor network conditions, speaking while muted, or device
failures during a call. If you want to explore a detected issue, select
the highlighted item and you will see a pre-populated view of the
related events in the Timeline tab.

Note!

You can click on the information icons on each page within Call
Diagnostics to learn functionality, definitions, and helpful tips.
(**insert image)**

(**<u>TODO insert image)</u>**

# Call Timeline

When call issues are difficult to troubleshoot you can explore the
timeline tab to see a detailed sequence of events that occurred during
the call.

The timeline view is complex and designed for developers who need
explore details of a call and interpret detailed debugging data. In
large calls the timeline view can present an overwhelming amount of
information, we recommend relying on filtering to narrow your search
results and reduce complexity.

You can view detailed call logs for each participant within a call. If
information is not present it can be due to various reasons such as
telemetry limitations or privacy constraints between different calling
resources \<**link to FAQ**\>.

(**<u>TODO insert image)</u>**

Note!

You can click on the information icons on each page within Call
Diagnostics to learn functionality, definitions, and helpful tips.
(**insert image)**

# Common issues

Issue categories can include:

- Azure Communication Services issue

- Calling deployment issue

- Network issue

- User actions or inactions (e.g. not allowing device permissions),
  driving through a tunnel.

To help you get started, you will find below the steps to triage common
issues using Call Diagnostics.

***“Other participants couldn’t hear me on the call”***

Dive into the audio section for the participant to see if there are any
issues detected. In the case below, we see that the microphone was muted
unexpectedly. In other cases, we might see errors with the device’s set
up and permissions.

(**<u>TODO insert image)</u>**

***“My video was choppy and pixelated”***  
Explore the video section for the participant to see if a poor network
connection in a call may have caused the issue.

(**<u>TODO insert image)</u>**

***“My call unexpectedly dropped”***  
**<u>TODO -</u>** Show how you might drill down to show the end-user
lost connection.

(**<u>TODO insert image)</u>**

***“Other participants couldn’t see me on the call”***  
Show how you might drill down to show the status of the camera in the
call and any detected failures.

(**<u>TODO insert image)</u>**

## Call quality resources

Ensuring good call quality starts with your calling setup, please
explore our documentation to learn how you can use the UI Library to
benefit from our quality and reliability tools \<[link to manage call
quality](https://learn.microsoft.com/en-us/azure/communication-services/concepts/voice-video-calling/manage-call-quality)\>.

# Frequently Asked Questions:

1.  How do I setup Call Diagnostics?

    1.  Link

2.  How do I find a Call ID?

    1.  Link

3.  My call ID should be here?

    1.  It could no longer be stored by your Log Analytics workspace,
        you need to ensure you retain your call data in diagnostics
        settings \<link?

    2.  Maybe it’s not the ACS call ID, check “how do I find a callID?”
        to learn more.

4.  My call had issues, but Call Diagnostics doesn’t show any issues.

    1.  Call Diagnostics relies on several common call issues to help
        diagnose calls. Issues can still occur outside of the existing
        telemetry or can be caused by unlisted call participants you
        aren’t allowed to view due to privacy restrictions.

5.  What types of calls are visible in Call Diagnostics?

    1.  Call types included.

        1.  Includes call data for Web JS SDK, Native SKD, PSTN, Call
            Automation.

        2.  Includes some Call Automation Bot data edges

    2.  Partial data.

        1.  Different SDKs, privacy considerations may prevent you from
            receiving those data.

        2.  ?

        3.  

    3.  Not Included.

        1.  Zoom, PSTN outside of ACS data.

        2.  What are limits of what our data reaches.

        3.  Privacy restrictions may prevent you from seeing the full
            call roster.

6.  What are bots?

    1.  

7.  What capabilities does Search have?

8.  What capabilities does Overview have?

9.  What capabilities does Issues have?

10. What capabilities does Timeline have?

    1.  You can zoom within the timeline by using SHIFT+mouse-scroll
        wheel and pan left and right by clicking and dragging within the
        timeline itself.

11. What types of issues might I find?

    1.  Participant’s call issues generally fall into these categories: 

        1.  They can’t join a call. 

        2.  They can’t do something in a call (mute, start video,
            etc.). 

        3.  They get dropped from a call. 

        4.  They have a poor call experience (audio/video quality). 

12. If Azure Communication Services participants join from different
    Azure Communication Services Resources, how will they display in
    Call Diagnostics?

    1.  If all the participants are from the same Azure subscription,
        they will appear as "remote participants". However, Call
        Diagnostics won’t show any participant details for Azure
        Communication Services participants from another resource. To
        see the call details for that participant you need to review
        that same call ID from the specific Azure Communication Services
        Resource they belong to.

    2.  If that ACS resource is not part of **<u>your Azure subscription
        and / or hasn't enabled Diagnostics Settings to store call logs,
        there will not be any data available</u>** for Call Diagnostics.

13. If Teams participants join a call, how will they display in Call
    Diagnostics?

    1.  If a Teams participant organized the call through Microsoft
        Teams, that participant will appear as a participant in Call
        Diagnostics with fewer call details populated.

    2.  If there were other Teams participants besides the Teams meeting
        organizer, those participants will not appear in Call
        Diagnostics.

14. 

# Appendix NOTES below

[Call Diagnostic - Q4 Customer Feedback.pptx
(sharepoint-df.com)](https://microsoft.sharepoint-df.com/:p:/t/IC3SDK/EebHDOhIKvZMhY-jfopQ85cB3GAWaJw-bbZydyGKHd2StQ?ovuser=72f988bf-86f1-41af-91ab-2d7cd011db47%2Cjoelcdp%40microsoft.com&clickparams=eyJBcHBOYW1lIjoiVGVhbXMtRGVza3RvcCIsIkFwcFZlcnNpb24iOiI0OS8yMzEwMTAwNTMwMCIsIkhhc0ZlZGVyYXRlZFVzZXIiOmZhbHNlfQ%3D%3D)

- Who: All ACS Calling SDK customers ​

- Where: Located in an ACS Resource blade in Azure portal​

- Scope: Only allows calls for single ACS Resource ​

- ​

- Supports non-EU and EU call data ​

- Supports limited Teams participant data ​

- A full call flow can be: ​

- Headset of the customer \<–\> Device of the customer \<–\> Third-party
  > carrier \<–\> Carrier Session Border Controller (SBC) \<–\> ACS
  > Infra \<–\> ACS JS SDK \<–\> Headset of the agent/supervisor.​

- There can be several data edge connections. ​

- Call Diagnostics will capture: ACS Infra \<\> ACS_SDK traffic. ​

- Does not capture: Customer phone \<-\> Carrier (SBC) etc..  ​

- All\* operations are available from ​

- ACS client SDK point of view – log contains standard fields like –
  > name, type, start/duration of operation, result, correlation ids
  > (call/participant/operation
  > id/acs resource id), sdk version, UA, and dynamic payload​

- ACS Call automation - [<u>Azure Communication Services Call Automation
  > logs</u>](https://learn.microsoft.com/en-us/azure/communication-services/concepts/analytics/logs/call-automation-logs)​

- All\* metrics are measured from ACS client point of view (granular
  > timeseries) and ACS Infra (summaries/average) - log contains
  > standard fields like – name, type, start/duration of operation,
  > result, correlation ids (call/participant/operation id/acs resource
  > id, stream id), sdk version, UA, and media statistics for
  > audio/video/screen share, for
  > both directions, with avg,min,max etc..​

NOTES

[End of call survey logs - An Azure Communication Services concept
document \| Microsoft
Learn](https://learn.microsoft.com/en-us/azure/communication-services/concepts/analytics/logs/end-of-call-survey-logs)

** Important**

You must enable a Diagnostic Setting in Azure Monitor to send the log
data of your surveys to a Log Analytics workspace, Event Hubs, or an
Azure storage account to receive and analyze your survey data. If you do
not send survey data to one of these options your survey data will not
be stored and will be lost. To enable these logs for your Communications
Services, see: [**End of Call Survey
Logs**](https://learn.microsoft.com/en-us/azure/communication-services/concepts/analytics/logs/end-of-call-survey-logs)

###  View survey data with a Log Analytics workspace

You need to enable a Log Analytics Workspace to both store the log data
of your surveys and access survey results. To enable these logs for your
Communications Service, see: [End of Call Survey
Logs](https://learn.microsoft.com/en-us/azure/communication-services/concepts/analytics/logs/end-of-call-survey-logs).

**<u>Show links to all logs that CDC queries currently.</u>**

- **Log 1 – CallSummary**

- **Log 2 – CallDiagnostics**

- **Log 3 – CallClientOperations**

- **Log 4 – CallClientMediaStatsTimeSeries**

CallClientOperations​

| **ColumnName ​**                 | **ColumnType ​**     | **Description​**                      |
|---------------------------------|---------------------|--------------------------------------|
| StableResourceId​                | string ​             | ACS Resource Id​                      |
| OperationName ​                  | string ​             | Eg Mute, StartVideo​                  |
| Category ​                       | string ​             | Eg ClientAPI, ClientEvent, ClientUFD​ |
| OperationType ​                  | string ​             | Eg event, request​                    |
| OperationId ​                    | string ​             | Id of operation​                      |
| TimeGenerated ​                  | datetime ​           | When It started​                      |
| DurationMs ​                     | datetime long ​      | How long it took​                     |
| ResultType ​                     | string ​             | result​                               |
| ResultSignature ​                | string ​             | Eg 200 (aka code)​                    |
| **OperationPayload as dynamic**​ | **String/dynamic** ​ | Various depends on the event​         |
| SdkVersion ​                     | string ​             | Sdk version​                          |
| UserAgent ​                      | string ​             | Full UA​                              |
| ClientInstanceId ​               | string ​             | Instance id of sdk​                   |
| CorrelationId ​                  | string ​             | Call id​                              |
| ParticipantId ​                  | string ​             | Participant id​                       |
| EndpointId ​                     | string ​             | Endpoint id\*(in future)​             |
| ResultCategories ​               | String/dynamic ​     | Eg. Success, ExpectedError...​        |

CallClientMediaStatsTimeSeries​

| **ColumnName ​**            | **ColumnType ​** | **Description​**                      |
|----------------------------|-----------------|--------------------------------------|
| StableResourceId​           | string ​         | ACS Resource Id​                      |
| MetricName​                 | string ​         | Eg Bitrate, PacketLoss​               |
| Count​                      | string ​         | Eg ClientAPI, ClientEvent, ClientUFD​ |
| Sum​                        | ​                | ​                                     |
| Average​                    | ​                | ​                                     |
| Min​                        | ​                | ​                                     |
| Max​                        | ​                | ​                                     |
| MediaStreamDirection​       | ​                | ​                                     |
| MediaStreamType​            | string ​         | Eg event, request​                    |
| MediaStreamCodec​           | string ​         | Id of operation​                      |
| AggregationIntervalSeconds​ | datetime ​       | When It started​                      |
| MediaStreamId ​             | datetime long ​  | How long it took​                     |
| ResultType ​                | string ​         | result​                               |
| RemoteParticipantId​        | string ​         | Eg 200 (aka code)​                    |
| SdkVersion ​                | string ​         | Sdk version​                          |
| UserAgent ​                 | string ​         | Full UA​                              |
| ClientInstanceId ​          | string ​         | Instance id of sdk​                   |
| CorrelationId ​             | string ​         | Call id​                              |
| ParticipantId ​             | string ​         | Participant id​                       |
| EndpointId ​                | string ​         | Endpoint id\*(in future)​             |

# Going Deeper

Call Diagnostics includes a large set of metrics that can be accessed,
fileted and overlayed together. These include:

- **<u>TODO COMING -</u>** Media Quality Statistics: Raw data for key
  quality indicators like RTT, jitter, bandwidth, package loss, etc. For
  more information on the full set of metrics for audio and video, see
  our
  [documentation](https://learn.microsoft.com/en-us/azure/communication-services/concepts/voice-video-calling/media-quality-sdk).

- User Facing Diagnostics: Client-side flags that correlate to common
  issues like muted microphones, network drops, camera freezes and
  unexpected device failures. For more information on the full set of
  flags, see our
  [documentation](https://learn.microsoft.com/en-us/azure/communication-services/concepts/voice-video-calling/user-facing-diagnostics).

Notes:

~~NOTE – I want to show ppl. That the columns can order top to bottom~~

~~You can apply filter within these columns:~~

- ~~Time~~

- ~~Call Type – (Group / Peer to Peer (P2P))~~

- ~~Client Type – (VoIP / PSTN / Bot / Anonymous)~~

- ~~Quality – (Call quality values are Good / Poor) Sensitive to any
  issue.~~

- ~~Rating – (Good / Average / Poor) – When you enable the **<u>End of
  Call Survey</u>** your survey results will be included in Call
  Diagnostics.~~

- ~~Issues – (The total number of issues detected in the call)~~

<!-- -->

- **~~Sections: TBD~~**

  - **~~Quality – This data will be available in a future release and
    will analyze in call media statistics such as Jitter, Latency,
    Packet Loss, and bitrate.~~**

  - **~~Events -~~**

  - **~~Key Events –~~**

- NOTES:

- can see issues in the call highlighted. The view can be filtered to
  focus on specific events or issues and includes call statistics for
  further diagnosis.

- Goal is to triangulate / triage possible culprits of a call.

- ~~(TO include later)Details including device and SDK version, as well
  as network and audio/video metrics like jitter, RTT and bandwidth.~~

- Quality issues will be supported in future releases and will analyze
  in call media statistics such as Jitter, Latency, Packet Loss, and
  Bitrate.


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
