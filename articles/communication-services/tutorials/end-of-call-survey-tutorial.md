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

This tutorial will show you how to use the Azure Communication Services End of Call Survey for JavaScript / Web SDK.


## Prerequisites

-	An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

-	[Node.js](https://nodejs.org/) active Long Term Support(LTS) versions are recommended.

-	An active Communication Services resource. [Create a Communication Services resource](../quickstarts/create-communication-resource.md). Survey results are tied to single Communication Services resources.
-	An active Log Analytics Workspace, also known as Azure Monitor Logs, to analyze your survey results. [Enable logging in Diagnostic Settings](../concepts/analytics/enable-logging.md).


## To store survey results

> [!IMPORTANT]
> End of Call Survey is available starting on the version [1.9.1-beta.1](https://www.npmjs.com/package/@azure/communication-calling/v/1.9.1-beta.1) of the Calling SDK. Make sure to use that version or later when trying the instructions.

### Sample of API usage




#### Rate call only - no custom data

```javascript
call.feature(Features.CallSurvey).submitSurvey({
                overallRating: { score: 3 }
            }).then(() => console.log('survey submitted successfully'))
```




#### Rate call only - with custom scale
``` javascript
call.feature(Features.CallSurvey).submitSurvey({
                overallRating: {
                    score: 1, // my score
                    scale: { // my custom scale
                        lowerBound: 0,
                        upperBound: 2,
                        lowScoreThreshold: 1
                    },
                    issues: ['HadToRejoin'] // my issues
                }
            }).then(() => console.log('survey submitted successfully'))
```

#### Rate audio / video call with sample issue
``` javascript
call.feature(Features.CallSurvey).submitSurvey({
                overallRating: { score: 3 },
                audioRating: { score : 4 },
                videoRating: { score : 3, issues: ['Freezes'] }
            }).then(() => console.log('survey submitted successfully'))
```
#### Handle errors that the SDK can throw
```javascript
call.feature(Features.CallSurvey).submitSurvey({
                overallRating: { score: 3 }
            }).catch((e) => console.log('error when submitting survey: ' + e ))
```

### Check for different types of errors below
-	At least one survey rating is required.
-	In default scale X should be 1 to 5. - where X is either of
    - overallRating.score
    - audioRating.score
    - videoRating.score
    - screenshareRating.score
-	${propertyName}: ${rating.score} should be between ${rating.scale?.lowerBound} and ${rating.scale?.upperBound}. ;
-	${propertyName}: ${rating.scale?.lowScoreThreshold} should be between ${rating.scale?.lowerBound} and ${rating.scale?.upperBound}. ;
-	${propertyName} lowerBound: ${rating.scale?.lowerBound} and upperBound: ${rating.scale?.upperBound} should be between 0 and 100. ;
-	event discarded ACS failed to submit survey



## Collect survey data

> [!IMPORTANT]
> You must enable a Diagnostic Setting in Azure Monitor to send the log data of your surveys to a Log Analytics workspace, Event Hubs, or an Azure storage account to receive and analyze your survey data. If you do not send survey data to one of these options your survey data will not be stored and will be lost. To enable these logs for your Communications Services, see: [Enable logging in Diagnostic Settings](../concepts/analytics/enable-logging.md)
	

### View survey data with a Log Analytics workspace

You need to enable a Log Analytics Workspace to both store the log data of your surveys and access survey results. To enable these logs for your Communications Services, see: [Enable logging in Diagnostic Settings](../concepts/analytics/enable-logging.md). Follow the steps to add a diagnostic setting. Select the “CALL DIAGNOSTICS???” data source when choosing category details. Also, choose “Send to Log Analytics workspace” as your destination detail.

-	You can also integrate your Log Analytics workspace with Power BI, see: [Integrate Log Analytics with Power BI](../../../articles/azure-monitor/logs/log-powerbi.md)


### Default survey analytics queries

You can use the following sample query in your Log Analytics workspace or Power BI.


### Export survey data

If you want to export your survey data, you can instead choose to send the log data of your surveys to Event Hubs, see: [Enable logging in Diagnostic Settings](../concepts/analytics/enable-logging.md). Follow the steps to add a diagnostic setting. Again, select the “CALL DIAGNOSTICS???” data source when choosing category details. Then, choose “Stream to an event hub” as your destination detail.

You can only view your survey data if you have enabled a Diagnostic Setting to capture your survey data. To learn how to use the End of Call Survey and view your survey data, see: **Tutorial Link**

### Survey data format

Survey data will be in the following table format in the ranges and values that were submitted.



## Debug support?


## Best Practices
Here are our recommended survey flows and suggested question prompts for consideration. Your development can use our recommendation or use customized question prompts and flows for your visual interface.

**Question 1:** How did the users perceive their overall call quality experience?
We recommend you start the survey by only asking about the participants’ overall quality. If you separate the first and second questions, it helps to only collect responses to Audio, Video, and Screen Share issues if a survey participant indicates they experienced call quality issues. 


-	Suggested prompt: “How was the call quality?” 
-	API Question Values: Overall Call

**Question 2:** Did the user perceive any Audio, Video, or Screen Sharing issues in the call?
If a survey participant responded to Question 1 with a score at or below the cutoff value for the overall call, then present the second question.

-	Suggested prompt: “What could have been better?” 
-	API Question Values: Audio, Video, and ScreenShare 

Surveying Guidelines
-	Avoid survey burnout, don’t survey all call participants.
-	The order of your questions matters. We recommend you randomize the sequence of optional tags in Question 2 in case respondents focus most of their feedback on the first prompt they visually see.
-	Consider using surveys for separate ACS Resources in controlled experiments to identify release impacts.  

## Frequently Asked Questions (FAQs)
-	When can I use the API?
- How long will it take for survey data to be available in Azure?

## Next Steps
-	Learn more about the End of Call Survey, see: 

-	Learn how to use the Log Analytics workspace, see: [Log Analytics Tutorial](../../../articles/azure-monitor/logs/log-analytics-tutorial.md)

-	Create your own queries in Log Analytics, see: [Get Started Queries](../../../articles/azure-monitor/logs/get-started-queries.md)


