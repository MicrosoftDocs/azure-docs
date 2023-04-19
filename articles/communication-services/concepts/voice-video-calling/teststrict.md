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

-   Phone - [Public
    concepts](https://learn.microsoft.com/en-us/azure/communication-services/concepts/telephony/telephony-concept)

## Monitoring 

Before you

-   ***“Quoted bold italic”***

Call logs will show you important insights on individual calls and your
overall quality. For more details refer to the [Call
Logs](https://learn.microsoft.com/en-us/azure/communication-services/concepts/analytics/call-logs-azure-monitor).

-   **participant<span class="mark">EndReason</span>**

    -   You can identify trends leading to unplanned call ends. See our
        > guidance on [error
        > codes](https://learn.microsoft.com/en-us/azure/communication-services/concepts/troubleshooting-info?tabs=csharp%2Cios%2Cdotnet#calling-sdk-error-codes).

## table 1 

**table**

<table>
<colgroup>
<col style="width: 60%" />
<col style="width: 39%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Call Setup Failures reason</strong></th>
<th><strong>Typical cause</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>Missing FW Deep Packet Inspection Exemption Rule</td>
<td>Indicates that network equipment</td>
</tr>
<tr class="even">
<td>Missing FW IP Block Exception Rule</td>
<td>Indicates that network equ</td>
</tr>
</tbody>
</table>

table

<table>
<colgroup>
<col style="width: 38%" />
<col style="width: 14%" />
<col style="width: 22%" />
<col style="width: 24%" />
</colgroup>
<thead>
<tr class="header">
<th>Type</th>
<th>Area</th>
<th>Owner name</th>
<th>Sign-off</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>PM</td>
<td>Business</td>
<td>Alex Magginetti</td>
<td></td>
</tr>
</tbody>
</table>

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

            }).then(() =&gt; console.log('survey submitted
successfully'))

\`\`\`

\`\`\`typescript

    const call: Call = callAgent.startCall(\['{target participant /
callee MRI / number}'\]);

call.on('stateChanged', callStateChangedHandler);

const callStateChangedHandler = () =&gt; {

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

<table>
<colgroup>
<col style="width: 43%" />
<col style="width: 10%" />
<col style="width: 46%" />
</colgroup>
<thead>
<tr class="header">
<th>JSON Field Name</th>
<th>Data Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>acsResourceId</td>
<td>String</td>
<td>The ACS resource ID uniquely identifies the ACS resource used to
make the call</td>
</tr>
</tbody>
</table>

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

<table>
<colgroup>
<col style="width: 31%" />
<col style="width: 35%" />
<col style="width: 33%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Metric average</strong></th>
<th><strong>Description</strong></th>
<th><strong>User experience</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>Jitter &gt;</td>
<td>This is the average</td>
<td>The packe</td>
</tr>
</tbody>
</table>

Picture 1 and 2

<img src="media/image1.png" style="width:6.5in;height:1.12986in"
alt="picture 1" /><img src="media/image2.png" style="width:6.5in;height:0.64236in"
alt="picture 2" />

Picture 3

<img src="media/image3.png" style="width:5.35673in;height:2.91472in"
alt="picture 3" />

Video – link to embedded Microsoft video:
<https://www.microsoft.com/en-us/videoplayer/embed/RWGTqQ>

Video – “Insert &gt; online videos” in word. Same vide as above

Won’t work since not supported – needs to manually be added later.

Video – link to youtube:

[Join your calling app to a Microsoft Teams meeting with Azure
Communication Services -
YouTube](https://www.youtube.com/embed/FF1LS516Bjw)

Video – “Insert &gt; online videos” in word. Same vide as above

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

<table>
<colgroup>
<col style="width: 20%" />
<col style="width: 11%" />
<col style="width: 12%" />
<col style="width: 55%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>API Rating Categories</strong></th>
<th><strong>Cutoff Value*</strong></th>
<th><strong>Input Range</strong></th>
<th><strong>Comments</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>Overall Call</td>
<td>2</td>
<td>1 - 5</td>
<td>Survey’s a calling participant’s overall quality experience on a
scale of 1-5 where 1 indicates an imperfect call experience and 5
indicates a perfect call. The cutoff value of 2 means that a customer
response of 1 or 2 indicates a less than perfect call experience.</td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 15%" />
<col style="width: 84%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Rating Categories</strong></th>
<th><strong>Optional Tags</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>Overall Call</td>
<td>'CallCannotJoin' | 'CallCannotInvite' | 'HadToRejoin' |
'CallEndedUnexpectedly' | 'OtherIssues'</td>
</tr>
</tbody>
</table>
