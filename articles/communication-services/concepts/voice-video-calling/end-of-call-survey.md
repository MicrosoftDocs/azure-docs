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



# End of Call Survey overview


[!INCLUDE [Public Preview](../../includes/public-preview-include-document.md)]


> [!NOTE] 
> End of Call Survey is currently supported only for our JavaScript / Web SDK.


The End of Call Survey provides you with a tool to understand how your end users perceive the overall quality and reliability of your JavaScript / Web SDK calling solution. 

## Purpose of the End of Call Survey
It’s difficult to determine a customer’s perceived calling experience and determine how well your calling solution is performing without gathering subjective feedback from customers.

You can use the End of Call Survey to collect and analyze customers **subjective** opinions on their calling experience as opposed to relying only on **objective** measurements such as audio and video bitrate, jitter, and latency, which may not indicate if a customer had a poor calling experience. After publishing survey data, you can view the survey results through Azure for analysis and improvements. Azure Communication Services uses these survey results to monitor and improve quality and reliability.


## Survey Structure

The survey is designed to answer two questions from a user’s point of view. 

-	**Question 1:** How did the users perceive their overall call quality experience?

-	**Question 2:** Did the user perceive any Audio, Video, or Screen Share issues in the call?

The API allows applications to gather data points that describe user perceived ratings of their Overall Call, Audio, Video, and Screen Share experiences. Microsoft analyzes survey API results according to the following goals.

### End of Call Survey API Goals


| API Rating Categories | Question Goal |
| ----------- | ----------- |
|  Overall Call  |   Responses indicate how a call participant perceived their overall call quality.    |
| Audio   |    Responses indicate if the user perceived any Audio issues.   |
|   Video |   Responses indicate if the user perceived any Video issues.   |
| ScreenShare   |    Responses indicate if the user perceived any Screen Share issues.   |



## Survey Capabilities



### Default survey API configuration

| API Rating Categories | Cutoff Value* | Input Range | Comments |
| ----------- | ----------- | -------- | -------- | 
| Overall Call | 2 | 1 - 5 | Surveys a calling participant’s overall quality experience on a scale of 1-5 where 1 indicates an imperfect call experience and 5 indicates a perfect call. The cutoff value of 2 means that a customer response of 1 or 2 indicates a less than perfect call experience.  |
| Audio |   2 | 1 - 5  | A response of 1 indicates an imperfect audio experience and 5 indicates no audio issues were experienced.  |
| Video |   2 | 1 - 5 |  A response of 1 indicates an imperfect video experience and 5 indicates no video issues were experienced. |
| Screenshare | 2 | 1 - 5   |  A response of 1 indicates an imperfect screen share experience and 5 indicates no screen share issues were experienced. |


second conversion

| **API Rating Categories** | **Cutoff Value\*** | **Input Range** | Comments
|---------------------------|--------------------|-----------------|------------|
| Overall Call              | 2                  | 1 - 5           | Survey’s a calling participant’s overall quality experience on a scale of 1-5 where 1 indicates an imperfect call experience and 5 indicates a perfect call. The cutoff value of 2 means that a customer response of 1 or 2 indicates a less than perfect call experience. |
| Audio                     | 2                  | 1 – 5           | A response of 1 indicates an imperfect audio experience and 5 indicates no audio issues were experienced.                                                                                                                                                                  |
| Video                     | 2                  | 1 – 5           | A response of 1 indicates an imperfect video experience and 5 indicates no video issues were experienced.                                                                                                                                                                  |
| Screenshare               | 2                  | 1 – 5           | A response of 1 indicates an imperfect screen share experience and 5 indicates no screen share issues were experienced.                                                                                                                                                    |



-	***Note:** A question’s indicated cutoff value in the API is the threshold that Microsoft uses when analyzing your survey data. When you customize the cutoff value or Input Range, Microsoft analyzes your survey data according to your customization.

### Additional survey tags
| Rating Categories | Optional Tags |
| ----------- | ----------- |
|  Overall Call  |    `CallCannotJoin` `CallCannotInvite` `HadToRejoin` `CallEndedUnexpectedly`  `OtherIssues`    |
| Audio   |  `NoLocalAudio` `NoRemoteAudio` `Echo` `AudioNoise`  `LowVolume`  `AudioStoppedUnexpectedly` `DistortedSpeech` `AudioInterruption`  `OtherIssues`   |
|   Video |    `NoVideoReceived` `NoVideoSent` `LowQuality` `Freezes` `StoppedUnexpectedly` `DarkVideoReceived` `AudioVideoOutOfSync` `OtherIssues`   |
| Screenshare   |  `NoContentLocal` `NoContentRemote` `CannotPresent` `LowQuality` `Freezes` `StoppedUnexpectedly` `LargeDelay` `OtherIssues`     |



### End of Call Survey Customization
You can choose to collect each of the four API values or only the ones you find most important. For example, you can choose to only ask customers about their overall call experience instead of asking them about their audio, video, and screen share experience. You can also customize input ranges to suit your needs. The default input range is 1 to 5 for Overall Call, and 0 to 1 for Audio, Video, and Screenshare. However, each API value can be customized from a minimum of 0 to maximum of 100.

You can choose to collect each of the four API values or only the ones
you find most important. For example, you can choose to only ask
customers about their overall call experience instead of asking them
about their audio, video, and screen share experience. You can also
customize input ranges to suit your needs. The default input range is 1
to 5 for Overall Call, <span class="mark">Audio</span>, Video, and
Screenshare. However, each API value can be customized from a minimum of
0 to maximum of 100. 

### Customization options


| API Rating Categories | Cutoff Value* | Input Range |
| ----------- | ----------- | -------- |  
| Overall Call   |   0 - 100    |  0 - 100     |     
|  Audio  |   0 - 100    |   0 - 100    |     
|  Video  |    0 - 100   |   0 - 100    |     
|  Screenshare  |   0 - 100    |   0 - 100    |     

-	***Note**: A question’s indicated cutoff value in the API is the threshold that Microsoft uses when analyzing your survey data. When you customize the cutoff value or Input Range, Microsoft analyzes your survey data according to your customization.

## Store and view survey data:

> [!IMPORTANT]
> You must enable a Diagnostic Setting in Azure Monitor to send the log data of your surveys to a Log Analytics workspace, Event Hubs, or an Azure storage account to receive and analyze your survey data. If you do not send survey data to one of these options your survey data will not be stored and will be lost. To enable these logs for your Communications Services, see: **[Enable logging in Diagnostic Settings](../analytics/enable-logging.md)**

You can only view your survey data if you have enabled a Diagnostic Setting to capture your survey data. 

## Next Steps

-	Learn how to use the Log Analytics workspace, see: [Log Analytics Tutorial](../../../../articles/azure-monitor/logs/log-analytics-tutorial.md)

-	Create your own queries in Log Analytics, see: [Get Started Queries](../../../../articles/azure-monitor/logs/get-started-queries.md)



markdown github-flavored markdown


Functionality described in this document is currently in public preview.
This preview version is provided without a service-level agreement, and
we don't recommend it for production workloads. Certain features might
not be supported or might have constrained capabilities. For more
information, see [**Supplemental Terms of Use for Microsoft Azure
Previews**](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

** Note**

End of Call Survey is currently supported only for our JavaScript / Web
SDK.

The End of Call Survey provides you with a tool to understand how your
end users perceive the overall quality and reliability of your
JavaScript / Web SDK calling solution.

## **Purpose of the End of Call Survey**

It’s difficult to determine a customer’s perceived calling experience
and determine how well your calling solution is performing without
gathering subjective feedback from customers.

You can use the End of Call Survey to collect and analyze customers
**subjective** opinions on their calling experience as opposed to
relying only on **objective** measurements such as audio and video
bitrate, jitter, and latency, which may not indicate if a customer had a
poor calling experience. After publishing survey data, you can view the
survey results through Azure for analysis and improvements. Azure
Communication Services uses these survey results to monitor and improve
quality and reliability.

## **Survey Structure**

The survey is designed to answer two questions from a user’s point of
view.

- **Question 1:** How did the users perceive their overall call quality
  experience?

- **Question 2:** Did the user perceive any Audio, Video, or Screen
  Share issues in the call?

The API allows applications to gather data points that describe user
perceived ratings of their Overall Call, Audio, Video, and Screen Share
experiences. Microsoft analyzes survey API results according to the
following goals.

### **End of Call Survey API Goals**

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
<tr class="even">
<td><ol start="2" type="1">
<li><p>Audio</p></li>
</ol></td>
<td>Responses indicate if the user perceived any <strong>Audio</strong>
issues.</td>
</tr>
<tr class="odd">
<td><ol start="3" type="1">
<li><p>Video</p></li>
</ol></td>
<td>Responses indicate if the user perceived any <strong>Video</strong>
issues.</td>
</tr>
<tr class="even">
<td><ol start="4" type="1">
<li><p>Screen Share</p></li>
</ol></td>
<td>Responses indicate if the user perceived any <strong>Screen
Share</strong> issues.</td>
</tr>
</tbody>
</table>

## 

## **Survey Capabilities**

### **Default survey API configuration**

| **API Rating Categories** | **Cutoff Value\*** | **Input Range** | **Comments**                                                                                                                                                                                                                                                               |
|---------------------------|--------------------|-----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Overall Call              | 2                  | 1 - 5           | Survey’s a calling participant’s overall quality experience on a scale of 1-5 where 1 indicates an imperfect call experience and 5 indicates a perfect call. The cutoff value of 2 means that a customer response of 1 or 2 indicates a less than perfect call experience. |
| Audio                     | 2                  | 1 – 5           | A response of 1 indicates an imperfect audio experience and 5 indicates no audio issues were experienced.                                                                                                                                                                  |
| Video                     | 2                  | 1 – 5           | A response of 1 indicates an imperfect video experience and 5 indicates no video issues were experienced.                                                                                                                                                                  |
| Screenshare               | 2                  | 1 – 5           | A response of 1 indicates an imperfect screen share experience and 5 indicates no screen share issues were experienced.                                                                                                                                                    |

- \***Note:** A question’s indicated cutoff value in the API is the
  threshold that Microsoft uses when analyzing your survey data. When
  you customize the cutoff value or Input Range, Microsoft analyzes your
  survey data according to your customization.

### **Additional survey tags**

| **Rating Categories** | **Optional Tags**                                                                                                                                                     |
|-----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Overall Call          | 'CallCannotJoin' \| 'CallCannotInvite' \| 'HadToRejoin' \| 'CallEndedUnexpectedly' \| 'OtherIssues'                                                                   |
| Audio                 | 'NoLocalAudio' \| 'NoRemoteAudio' \| 'Echo' \| 'AudioNoise' \| 'LowVolume' \| 'AudioStoppedUnexpectedly' \| 'DistortedSpeech' \| 'AudioInterruption' \| 'OtherIssues' |
| Video                 | 'NoVideoReceived' \| 'NoVideoSent' \| 'LowQuality' \| 'Freezes' \| 'StoppedUnexpectedly' \| 'DarkVideoReceived' \| 'AudioVideoOutOfSync' \| 'OtherIssues'             |
| Screenshare           | 'NoContentLocal' \| 'NoContentRemote' \| 'CannotPresent' \| 'LowQuality' \| 'Freezes' \| 'StoppedUnexpectedly' \| 'LargeDelay' \| 'OtherIssues'                       |

### **End of Call Survey Customization**

You can choose to collect each of the four API values or only the ones
you find most important. For example, you can choose to only ask
customers about their overall call experience instead of asking them
about their audio, video, and screen share experience. You can also
customize input ranges to suit your needs. The default input range is 1
to 5 for Overall Call, <span class="mark">Audio</span>, Video, and
Screenshare. However, each API value can be customized from a minimum of
0 to maximum of 100.

### **Customization options**

| **API Rating Categories** | **Cutoff Value\*** | **Input Range** |
|---------------------------|--------------------|-----------------|
| Overall Call              | 0 - 100            | 0 – 100         |
| Audio                     | 0 - 100            | 0 – 100         |
| Video                     | 0 - 100            | 0 – 100         |
| Screenshare               | 0 - 100            | 0 - 100         |

- \***Note**: A question’s indicated cutoff value in the API is the
  threshold that Microsoft uses when analyzing your survey data. When
  you customize the cutoff value or Input Range, Microsoft analyzes your
  survey data according to your customization.

## **Store and view survey data:**

**Important**

You must enable a Diagnostic Setting in Azure Monitor to send the log
data of your surveys to a Log Analytics workspace, Event Hubs, or an
Azure storage account to receive and analyze your survey data. If you do
not send survey data to one of these options your survey data will not
be stored and will be lost. To enable these logs for your Communications
Services, see: **Enable logging in Diagnostic Settings**

You can only view your survey data if you have enabled a Diagnostic
Setting to capture your survey data. <span class="mark">To learn how to
use the End of Call Survey and view your survey data, see: **<u>Tutorial
Link</u>**</span>

## **Next Steps**

- Create your own queries in Log Analytics, see: [Get Started
  Queries](https://review.learn.microsoft.com/en-us/azure/azure-monitor/logs/get-started-queries)




markdown - strict



** Important**

Functionality described in this document is currently in public preview.
This preview version is provided without a service-level agreement, and
we don't recommend it for production workloads. Certain features might
not be supported or might have constrained capabilities. For more
information, see [**Supplemental Terms of Use for Microsoft Azure
Previews**](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

** Note**

End of Call Survey is currently supported only for our JavaScript / Web
SDK.

The End of Call Survey provides you with a tool to understand how your
end users perceive the overall quality and reliability of your
JavaScript / Web SDK calling solution.

## **Purpose of the End of Call Survey**

It’s difficult to determine a customer’s perceived calling experience
and determine how well your calling solution is performing without
gathering subjective feedback from customers.

You can use the End of Call Survey to collect and analyze customers
**subjective** opinions on their calling experience as opposed to
relying only on **objective** measurements such as audio and video
bitrate, jitter, and latency, which may not indicate if a customer had a
poor calling experience. After publishing survey data, you can view the
survey results through Azure for analysis and improvements. Azure
Communication Services uses these survey results to monitor and improve
quality and reliability.

## **Survey Structure**

The survey is designed to answer two questions from a user’s point of
view.

-   **Question 1:** How did the users perceive their overall call
    quality experience?

-   **Question 2:** Did the user perceive any Audio, Video, or Screen
    Share issues in the call?

The API allows applications to gather data points that describe user
perceived ratings of their Overall Call, Audio, Video, and Screen Share
experiences. Microsoft analyzes survey API results according to the
following goals.

### **End of Call Survey API Goals**

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
<tr class="even">
<td><ol start="2" type="1">
<li><p>Audio</p></li>
</ol></td>
<td>Responses indicate if the user perceived any <strong>Audio</strong>
issues.</td>
</tr>
<tr class="odd">
<td><ol start="3" type="1">
<li><p>Video</p></li>
</ol></td>
<td>Responses indicate if the user perceived any <strong>Video</strong>
issues.</td>
</tr>
<tr class="even">
<td><ol start="4" type="1">
<li><p>Screen Share</p></li>
</ol></td>
<td>Responses indicate if the user perceived any <strong>Screen
Share</strong> issues.</td>
</tr>
</tbody>
</table>

## 

## **Survey Capabilities**

### **Default survey API configuration**

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
<tr class="even">
<td>Audio</td>
<td>2</td>
<td>1 – 5</td>
<td>A response of 1 indicates an imperfect audio experience and 5
indicates no audio issues were experienced.</td>
</tr>
<tr class="odd">
<td>Video</td>
<td>2</td>
<td>1 – 5</td>
<td>A response of 1 indicates an imperfect video experience and 5
indicates no video issues were experienced.</td>
</tr>
<tr class="even">
<td>Screenshare</td>
<td>2</td>
<td>1 – 5</td>
<td>A response of 1 indicates an imperfect screen share experience and 5
indicates no screen share issues were experienced.</td>
</tr>
</tbody>
</table>

-   \***Note:** A question’s indicated cutoff value in the API is the
    threshold that Microsoft uses when analyzing your survey data. When
    you customize the cutoff value or Input Range, Microsoft analyzes
    your survey data according to your customization.

### **Additional survey tags**

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
<tr class="even">
<td>Audio</td>
<td>'NoLocalAudio' | 'NoRemoteAudio' | 'Echo' | 'AudioNoise' |
'LowVolume' | 'AudioStoppedUnexpectedly' | 'DistortedSpeech' |
'AudioInterruption' | 'OtherIssues'</td>
</tr>
<tr class="odd">
<td>Video</td>
<td>'NoVideoReceived' | 'NoVideoSent' | 'LowQuality' | 'Freezes' |
'StoppedUnexpectedly' | 'DarkVideoReceived' | 'AudioVideoOutOfSync' |
'OtherIssues'</td>
</tr>
<tr class="even">
<td>Screenshare</td>
<td>'NoContentLocal' | 'NoContentRemote' | 'CannotPresent' |
'LowQuality' | 'Freezes' | 'StoppedUnexpectedly' | 'LargeDelay' |
'OtherIssues'</td>
</tr>
</tbody>
</table>

### **End of Call Survey Customization**

You can choose to collect each of the four API values or only the ones
you find most important. For example, you can choose to only ask
customers about their overall call experience instead of asking them
about their audio, video, and screen share experience. You can also
customize input ranges to suit your needs. The default input range is 1
to 5 for Overall Call, <span class="mark">Audio</span>, Video, and
Screenshare. However, each API value can be customized from a minimum of
0 to maximum of 100.

### **Customization options**

<table>
<colgroup>
<col style="width: 53%" />
<col style="width: 20%" />
<col style="width: 26%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>API Rating Categories</strong></th>
<th><strong>Cutoff Value*</strong></th>
<th><strong>Input Range</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>Overall Call</td>
<td>0 - 100</td>
<td>0 – 100</td>
</tr>
<tr class="even">
<td>Audio</td>
<td>0 - 100</td>
<td>0 – 100</td>
</tr>
<tr class="odd">
<td>Video</td>
<td>0 - 100</td>
<td>0 – 100</td>
</tr>
<tr class="even">
<td>Screenshare</td>
<td>0 - 100</td>
<td>0 - 100</td>
</tr>
</tbody>
</table>

-   \***Note**: A question’s indicated cutoff value in the API is the
    threshold that Microsoft uses when analyzing your survey data. When
    you customize the cutoff value or Input Range, Microsoft analyzes
    your survey data according to your customization.

## **Store and view survey data:**

**Important**

You must enable a Diagnostic Setting in Azure Monitor to send the log
data of your surveys to a Log Analytics workspace, Event Hubs, or an
Azure storage account to receive and analyze your survey data. If you do
not send survey data to one of these options your survey data will not
be stored and will be lost. To enable these logs for your Communications
Services, see: **Enable logging in Diagnostic Settings**

You can only view your survey data if you have enabled a Diagnostic
Setting to capture your survey data. <span class="mark">To learn how to
use the End of Call Survey and view your survey data, see: **<u>Tutorial
Link</u>**</span>

## **Next Steps**

-   Create your own queries in Log Analytics, see: [Get Started
    Queries](https://review.learn.microsoft.com/en-us/azure/azure-monitor/logs/get-started-queries)
