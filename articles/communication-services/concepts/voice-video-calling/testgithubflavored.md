---
title: Azure Communication Services End of Call Survey overview
titleSuffix: An Azure Communication Services concept document
description: Learn about the End of Call Survey.
author: amagginetti
ms.author: amagginetti
manager: mvivion

services: azure-communication-services
ms.date: 4/03/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---

# Contents

[1 Developing [1](#developing)](#developing)

[1.1 Monitoring [1](#monitoring)](#monitoring)

[1.2 table 1 [1](#table-1)](#table-1)

[1.3 table 2 [1](#table-2)](#table-2)

[1.3.1 3 sections in [2](#sections-in)](#sections-in)

[Heading no number [2](#heading-no-number)](#heading-no-number)

[Heading no number 2 levels
[2](#heading-no-number-2-levels)](#heading-no-number-2-levels)

# Developing

This article

- Phone - [Public
  concepts](https://learn.microsoft.com/en-us/azure/communication-services/concepts/telephony/telephony-concept)

## Monitoring 

Before you

- ***“Quoted bold italic”***

Call logs will show you important insights on individual calls and your
overall quality. For more details refer to the [Call
Logs](https://learn.microsoft.com/en-us/azure/communication-services/concepts/analytics/call-logs-azure-monitor).

- **participant<span class="mark">EndReason</span>**

  - You can identify trends leading to unplanned call ends. See our
    > guidance on [error
    > codes](https://learn.microsoft.com/en-us/azure/communication-services/concepts/troubleshooting-info?tabs=csharp%2Cios%2Cdotnet#calling-sdk-error-codes).

## table 1 

**table**

| **Call Setup Failures reason**                   | **Typical cause**                |
|--------------------------------------------------|----------------------------------|
| Missing FW Deep Packet Inspection Exemption Rule | Indicates that network equipment |
| Missing FW IP Block Exception Rule               | Indicates that network equ       |

table

| Type | Area     | Owner name      | Sign-off |
|------|----------|-----------------|----------|
| PM   | Business | Alex Magginetti |          |

Code

/\*\*

 \* Feature for ACS Live Streaming

 \* @beta

 \*/

export interface CallSurveyFeature extends CallFeature {

    /\*\*

     \* Send the end of call survey

     \* @param survey - survey data

     \*/

    submitSurvey(survey?: CallSurvey): void;

}

\`\`\`javascript

call.feature(Features.CallSurvey).submitSurvey({

                overallRating: { score: 3 }

            }).then(() =\> console.log('survey submitted successfully'))

\`\`\`

\`\`\`typescript

    const call: Call = callAgent.startCall(\['{target participant /
callee MRI / number}'\]);

call.on('stateChanged', callStateChangedHandler);

const callStateChangedHandler = () =\> {

    if (call.state === 'Disconnected') {

        console.log('call end reason', call.callEndReason);

            // TODO: Show the UI to collect the survey data

       }

};

\`\`\`

Code

Sample JSON Object-

{

"acsResourceId": "d71d19e6-f4e1-4abe-967a-e2a474a27582",

}

Table black highlight on first row

| JSON Field Name | Data Type | Description                                                                    |
|-----------------|-----------|--------------------------------------------------------------------------------|
| acsResourceId   | String    | The ACS resource ID uniquely identifies the ACS resource used to make the call |

## table 2

**table**

<table>
<colgroup>
<col style="width: 12%" />
<col style="width: 87%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Remediation</strong></th>
<th><strong>Guidance</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Network/internet</strong></td>
<td><p><strong>Congestion</strong>: Work included <a
href="https://learn.microsoft.com/en-us/microsoftteams/quality-of-experience-review-guide#quality-investigations">Quality
Poor Stream summary reports</a> to<br />
<br />
<strong>QoS</strong>: If increasing bandwidth is impractical or
cost-prohibitive, consider implementing QoS. This tool is very effective
at managing congested traffic and can guarantee that media packets on
the managed network are prioritized above non-media traffic.
Alternatively, if there's no clear evidence that bandwidth is the
culprit, consider these solutions:</p>
<ul>
<li><p><a
href="https://learn.microsoft.com/en-us/microsoftteams/qos-in-teams">Microsoft
Teams QoS guidance</a></p></li>
</ul>
<p><strong>Perform a network readiness assessment</strong>: A network
assessment provides details about expected bandwidth usage, how to cope
with bandwidth and network changes, and recommended networking practices
for Teams and Skype for Business. Using the preceding table as your
source, you have a list of buildings or subnets that are excellent
candidates for an assessment.</p>
<ul>
<li><p><a
href="https://learn.microsoft.com/en-us/microsoftteams/prepare-network">Prepare
your organization's network for Teams</a></p></li>
</ul></td>
</tr>
</tbody>
</table>

### 3 sections in

text

#### 4 sections in

text

##### 5 sections in

# Heading no number

text

## Heading no number 2 levels

Text

table

| **Metric average** | **Description**     | **User experience** |
|--------------------|---------------------|---------------------|
| Jitter \>          | This is the average | The packe           |

Picture 1 and 2

<img src="media/image1.png" style="width:6.5in;height:1.12986in"
alt="picture 1" /><img src="media/image2.png" style="width:6.5in;height:0.64236in"
alt="picture 2" />

Picture 3

<img src="media/image3.png" style="width:5.35673in;height:2.91472in"
alt="picture 3" />

Video – link to embedded Microsoft video:
<https://www.microsoft.com/en-us/videoplayer/embed/RWGTqQ>

Video – “Insert \> online videos” in word. Same vide as above

Won’t work since not supported – needs to manually be added later.

Video – link to youtube:

[Join your calling app to a Microsoft Teams meeting with Azure
Communication Services -
YouTube](https://www.youtube.com/embed/FF1LS516Bjw)

Video – “Insert \> online videos” in word. Same vide as above

<img src="media/image4.jpg" style="width:5in;height:3.75in"
alt="Video 1: Join your calling app to a Microsoft Teams meeting with Azure Communication Services" />

<table>
<colgroup>
<col style="width: 64%" />
<col style="width: 35%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>API Rating Categories</strong></th>
<th><strong>Question Goal</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><ol type="1">
<li><p>Overall Call</p></li>
</ol></td>
<td>Responses indicate how a call participant perceived their
<strong>overall</strong> call quality.</td>
</tr>
</tbody>
</table>

| **API Rating Categories** | **Cutoff Value\*** | **Input Range** | **Comments**                                                                                                                                                                                                                                                               |
|---------------------------|--------------------|-----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Overall Call              | 2                  | 1 - 5           | Survey’s a calling participant’s overall quality experience on a scale of 1-5 where 1 indicates an imperfect call experience and 5 indicates a perfect call. The cutoff value of 2 means that a customer response of 1 or 2 indicates a less than perfect call experience. |

| **Rating Categories** | **Optional Tags**                                                                                   |
|-----------------------|-----------------------------------------------------------------------------------------------------|
| Overall Call          | 'CallCannotJoin' \| 'CallCannotInvite' \| 'HadToRejoin' \| 'CallEndedUnexpectedly' \| 'OtherIssues' |
