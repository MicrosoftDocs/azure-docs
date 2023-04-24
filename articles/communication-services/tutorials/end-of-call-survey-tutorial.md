---
title: Azure Communication Services End of Call Survey
titleSuffix: An Azure Communication Services tutorial document
description: Learn how to use the End of Call Survey to collect user feedback.
author: amagginetti
ms.author: amagginetti
manager: mvivion

services: azure-communication-services
ms.date: 4/03/2023
ms.topic: tutorial
ms.service: azure-communication-services
ms.subservice: calling
---



# Tutorial: Use End of Call Survey to collect user feedback


[!INCLUDE [Public Preview](../includes/public-preview-include-document.md)]



> [!NOTE] 
> End of Call Survey is currently supported only for our JavaScript / Web SDK.

This tutorial shows you how to use the Azure Communication Services End of Call Survey for JavaScript / Web SDK.


## Prerequisites

-	An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

-	[Node.js](https://nodejs.org/) active Long Term Support(LTS) versions are recommended.

-	An active Communication Services resource. [Create a Communication Services resource](../quickstarts/create-communication-resource.md). Survey results are tied to single Communication Services resources.
-	An active Log Analytics Workspace, also known as Azure Monitor Logs, to ensure you do not lose your survey results. [Enable logging in Diagnostic Settings](../concepts/analytics/enable-logging.md).


> [!IMPORTANT]
> End of Call Survey is available starting on the version [1.13.0-beta.4](https://www.npmjs.com/package/@azure/communication-calling/v/1.13.0-beta.4) of the Calling SDK. Make sure to use that version or later when trying the instructions.

## Sample of API usage

Call Survey feature should be used after the call ends. Users can rate any kind of call, 1:1, group, meeting, outgoing and incoming. Once the call ends the application can present a UI to a user, where they can choose a rating score and if needed, pick issues they’ve encountered during the call from pre-defined list.

The code snip below shows an example of one-to-one call. After the end of the call, application can show a survey UI and once user choose rating, application should call feature API to submit survey with the input based on the user choices. Show the survey option.
We encourage you to use the default rating scale. However, you have the option to submit a survey with custom rating scale. You can check out the sample application for the sample API usage.  



We encourage you to use the default rating scale. However, you have the option to submit a survey with custom rating scale. You can check out the [sample application](https://github.com/Azure-Samples/communication-services-web-calling-tutorial/blob/main/Project/src/MakeCall/CallSurvey.js) for the complete API usage.  You will need the call object to submit the call survey. You will have the call object when you start or receive a call. The code snip below shows an example of one-to-one call. After the end of the call, show the survey option.




When the participant submits the survey, then call the submit survey API with survey data.

### Rate call only - no custom scale

```javascript
call.feature(Features.CallSurvey).submitSurvey({
    overallRating: { score: 5 }, // issues are optional
}).then(() => console.log('survey submitted successfully'));
```

OverallRating is a required category for all surveys.


### Rate call only - with custom scale and issues

```javascript
call.feature(Features.CallSurvey).submitSurvey({
    overallRating: {
        score: 1, // my score
        scale: { // my custom scale
            lowerBound: 0,
            upperBound: 1,
            lowScoreThreshold: 0
        },
        issues: ['HadToRejoin'] // my issues, check the table below for all available issues
    }
}).then(() => console.log('survey submitted successfully'));
```

### Rate overall, audio / video call with sample issue

``` javascript
call.feature(Features.CallSurvey).submitSurvey({
    overallRating: { score: 3 },
    audioRating: { score: 4 },
    videoRating: { score: 3, issues: ['Freezes'] }
}).then(() => console.log('survey submitted successfully'))
```

### Handle Errors that SDK can throw
 ``` javascript 
call.feature(Features.CallSurvey).submitSurvey({
    overallRating: { score: 3 }
}).catch((e) => console.log('error when submitting survey: ' + e))
```



<!-- ## Find different types of errors

### Failures while submitting survey:

API will return the error messages when data validation failed or unable to submit the survey.
-	At least one survey rating is required.
-	In default scale X should be 1 to 5. - where X is either of
- overallRating.score
- 	audioRating.score
- videoRating.score
- screenshareRating.score
-	${propertyName}: ${rating.score} should be between ${rating.scale?.lowerBound} and ${rating.scale?.upperBound}. ;
-	${propertyName}: ${rating.scale?.lowScoreThreshold} should be between ${rating.scale?.lowerBound} and ${rating.scale?.upperBound}. ;
-	${propertyName} lowerBound: ${rating.scale?.lowerBound} and upperBound: ${rating.scale?.upperBound} should be between 0 and 100. ;
-	event discarded [ACS failed to submit survey, due to network or other error] -->

## All possible values

### Default survey API configuration

| API Rating Categories | Cutoff Value* | Input Range | Comments |
| ----------- | ----------- | -------- | -------- | 
| Overall Call | 2 | 1 - 5 | Surveys a calling participant’s overall quality experience on a scale of 1-5 where 1 indicates an imperfect call experience and 5 indicates a perfect call. The cutoff value of 2 means that a customer response of 1 or 2 indicates a less than perfect call experience.  |
| Audio |   2 | 1 - 5  | A response of 1 indicates an imperfect audio experience and 5 indicates no audio issues were experienced.  |
| Video |   2 | 1 - 5 |  A response of 1 indicates an imperfect video experience and 5 indicates no video issues were experienced. |
| Screenshare | 2 | 1 - 5   |  A response of 1 indicates an imperfect screen share experience and 5 indicates no screen share issues were experienced. |


### Additional survey tags
| Rating Categories | Optional Tags |
| ----------- | ----------- |
|  Overall Call  |    `CallCannotJoin` `CallCannotInvite` `HadToRejoin` `CallEndedUnexpectedly`  `OtherIssues`    |
| Audio   |  `NoLocalAudio` `NoRemoteAudio` `Echo` `AudioNoise`  `LowVolume`  `AudioStoppedUnexpectedly` `DistortedSpeech` `AudioInterruption`  `OtherIssues`   |
|   Video |    `NoVideoReceived` `NoVideoSent` `LowQuality` `Freezes` `StoppedUnexpectedly` `DarkVideoReceived` `AudioVideoOutOfSync` `OtherIssues`   |
| Screenshare   |  `NoContentLocal` `NoContentRemote` `CannotPresent` `LowQuality` `Freezes` `StoppedUnexpectedly` `LargeDelay` `OtherIssues`     |


### Customization options


| API Rating Categories | Cutoff Value* | Input Range |
| ----------- | ----------- | -------- |  
| Overall Call   |   0 - 100    |  0 - 100     |     
|  Audio  |   0 - 100    |   0 - 100    |     
|  Video  |    0 - 100   |   0 - 100    |     
|  Screenshare  |   0 - 100    |   0 - 100    |     

-	***Note**: A question’s indicated cutoff value in the API is the threshold that Microsoft uses when analyzing your survey data. When you customize the cutoff value or Input Range, Microsoft analyzes your survey data according to your customization.

<!-- 
## Collect survey data

> [!IMPORTANT]
> You must enable a Diagnostic Setting in Azure Monitor to send the log data of your surveys to a Log Analytics workspace, Event Hubs, or an Azure storage account to receive and analyze your survey data. If you do not send survey data to one of these options your survey data will not be stored and will be lost. To enable these logs for your Communications Services, see: [Enable logging in Diagnostic Settings](../concepts/analytics/enable-logging.md)
	

### View survey data with a Log Analytics workspace

You need to enable a Log Analytics Workspace to both store the log data of your surveys and access survey results. To enable these logs for your Communications Services, see: [Enable logging in Diagnostic Settings](../concepts/analytics/enable-logging.md). Follow the steps to add a diagnostic setting. Select the “ACSCallSurvey” data source when choosing category details. Also, choose “Send to Log Analytics workspace” as your destination detail.

-	You can also integrate your Log Analytics workspace with Power BI, see: [Integrate Log Analytics with Power BI](../../../articles/azure-monitor/logs/log-powerbi.md)
 -->

## Best Practices
Here are our recommended survey flows and suggested question prompts for consideration. Your development can use our recommendation or use customized question prompts and flows for your visual interface.

**Question 1:** How did the users perceive their overall call quality experience?
We recommend you start the survey by only asking about the participants’ overall quality. If you separate the first and second questions, it helps to only collect responses to Audio, Video, and Screen Share issues if a survey participant indicates they experienced call quality issues. 


-	Suggested prompt: “How was the call quality?” 
-	API Question Values: Overall Call

**Question 2:** Did the user perceive any Audio, Video, or Screen Sharing issues in the call?
If a survey participant responded to Question 1 with a score at or below the cutoff value for the overall call, then present the second question.

-	Suggested prompt: “What could have been better?” 
-	API Question Values: Audio, Video, and Screenshare 

Surveying Guidelines
-	Avoid survey burnout, don’t survey all call participants.
-	The order of your questions matters. We recommend you randomize the sequence of optional tags in Question 2 in case respondents focus most of their feedback on the first prompt they visually see.
-	Consider using surveys for separate ACS Resources in controlled experiments to identify release impacts.  


<!-- ## Next Steps

-	Learn how to use the Log Analytics workspace, see: [Log Analytics Tutorial](../../../articles/azure-monitor/logs/log-analytics-tutorial.md)

-	Create your own queries in Log Analytics, see: [Get Started Queries](../../../articles/azure-monitor/logs/get-started-queries.md) -->


