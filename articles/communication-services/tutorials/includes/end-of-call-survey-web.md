---
title: Azure Communication Services End of Call Survey
titleSuffix: An Azure Communication Services tutorial document
description: Learn how to use the End of Call Survey to collect user feedback.
author: viniciusl-msft
ms.author: viniciusl
manager: gaobob
services: azure-communication-services
ms.date: 7/30/2024
ms.topic: tutorial
ms.service: azure-communication-services
ms.subservice: calling
---

> [!IMPORTANT]
> End of Call Survey is available starting on the version [1.13.1](https://www.npmjs.com/package/@azure/communication-calling/v/1.13.1) of the Calling SDK. Make sure to use that version or later when trying the instructions.

- [Node.js](https://nodejs.org/) active Long Term Support(LTS) versions are recommended.

## Sample of API usage

The End of Call Survey feature should be used after the call ends. Users can rate any kind of VoIP call, 1:1, group, meeting, outgoing and incoming. Once a user's call ends, your application can show a UI to the end user allowing them to choose a rating score, and if needed, pick issues they’ve encountered during the call from our predefined list.

The following code snips show an example of one-to-one call. After the end of the call, your application can show a survey UI and once the user chooses a rating, your application should call the feature API to submit the survey with the user choices.

We encourage you to use the default rating scale. However, you can submit a survey with custom rating scale. You can check out the [sample application](https://github.com/Azure-Samples/communication-services-web-calling-tutorial/blob/main/Project/src/MakeCall/CallSurvey.js) for the sample API usage.


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

### Rate overall, audio, and video with a sample issue

```javascript
call.feature(Features.CallSurvey).submitSurvey({
    overallRating: { score: 3 },
    audioRating: { score: 4 },
    videoRating: { score: 3, issues: ['Freezes'] }
}).then(() => console.log('survey submitted successfully'))
```

### Handle errors the SDK can send

```javascript
call.feature(Features.CallSurvey).submitSurvey({
    overallRating: { score: 3 }
}).catch((e) => console.log('error when submitting survey: ' + e))
```

## Find different types of errors

### Failures while submitting survey

The API returns the following error messages if data validation fails or the survey can't be submitted.

- At least one survey rating is required.

- In default scale X should be 1 to 5. - where X is either of:
  - overallRating.score
  - audioRating.score
  - videoRating.score
  - ScreenshareRating.score

- \{propertyName\}: \{rating.score\} should be between \{rating.scale?.lowerBound\} and \{rating.scale?.upperBound\}.

- \{propertyName\}: \{rating.scale?.lowScoreThreshold\} should be between \{rating.scale?.lowerBound\} and \{rating.scale?.upperBound\}.

- \{propertyName\} lowerBound: \{rating.scale?.lowerBound\} and upperBound: \{rating.scale?.upperBound\} should be between 0 and 100.

- Please try again [ACS failed to submit survey, due to network or other error].

### We'll return any error codes with a message.

- Error code 400 (bad request) for all the error messages except one.

```
{ message: validationErrorMessage, code: 400 }
```

- One 408 (timeout) when event discarded:

```
{ message: "Please try again.", code: 408 }
```


## All possible values

### Default survey API configuration

| API Rating Categories | Cutoff Value* | Input Range | Comments |
| ----------- | ----------- | -------- | -------- |
| Overall Call | 2 | 1 - 5 | Surveys a calling participant’s overall quality experience on a scale of 1-5. A response of 1 indicates an imperfect call experience and 5 indicates a perfect call. The cutoff value of 2 means that a customer response of 1 or 2 indicates a less than perfect call experience.  |
| Audio |   2 | 1 - 5  | A response of 1 indicates an imperfect audio experience and 5 indicates no audio issues were experienced.  |
| Video |   2 | 1 - 5 |  A response of 1 indicates an imperfect video experience and 5 indicates no video issues were experienced. |
| Screenshare | 2 | 1 - 5   |  A response of 1 indicates an imperfect screen share experience and 5 indicates no screen share issues were experienced. |



> [!NOTE]
>A question’s indicated cutoff value in the API is the threshold that Microsoft uses when analyzing your survey data. When you customize the cutoff value or Input Range, Microsoft analyzes your survey data according to your customization.


### More survey tags

| Rating Categories | Optional Tags |
| ----------- | ----------- |
|  Overall Call  |    `CallCannotJoin` `CallCannotInvite` `HadToRejoin` `CallEndedUnexpectedly`  `OtherIssues`    |
| Audio   |  `NoLocalAudio` `NoRemoteAudio` `Echo` `AudioNoise`  `LowVolume`  `AudioStoppedUnexpectedly` `DistortedSpeech` `AudioInterruption`  `OtherIssues`   |
|   Video |    `NoVideoReceived` `NoVideoSent` `LowQuality` `Freezes` `StoppedUnexpectedly` `DarkVideoReceived` `AudioVideoOutOfSync` `OtherIssues`   |
| Screenshare   |  `NoContentLocal` `NoContentRemote` `CannotPresent` `LowQuality` `Freezes` `StoppedUnexpectedly` `LargeDelay` `OtherIssues`     |


### Customization options

You can choose to collect each of the four API values or only the ones
you find most important. For example, you can choose to only ask
customers about their overall call experience instead of asking them
about their audio, video, and screen share experience. You can also
customize input ranges to suit your needs. The default input range is 1
to 5 for Overall Call, Audio, Video, and
Screenshare. However, each API value can be customized from a minimum of
0 to maximum of 100.

### Customization examples

| API Rating Categories | Cutoff Value* | Input Range |
| ----------- | ----------- | -------- |
| Overall Call   |   0 - 100    |  0 - 100     |
|  Audio  |   0 - 100    |   0 - 100    |
|  Video  |    0 - 100   |   0 - 100    |
|  Screenshare  |   0 - 100    |   0 - 100    |

   > [!NOTE]
   > A question’s indicated cutoff value in the API is the threshold that Microsoft uses when analyzing your survey data. When you customize the cutoff value or Input Range, Microsoft analyzes your survey data according to your customization.

## Custom questions
In addition to using the End of Call Survey API, you can create your own survey questions and incorporate them with the End of Call Survey results. Below you find steps to incorporate your own customer questions into a survey and query the results of the End of Call Survey API and your own survey questions.
-  [Create App Insight resource](/azure/azure-monitor/app/create-workspace-resource#create-a-workspace-based-resource).
-  Embed Azure AppInsights into your application [Click here to know more about App Insight initialization using plain JavaScript](/azure/azure-monitor/app/javascript-sdk). Alternatively, you can use NPM to get the App Insights dependencies. [Click here to know more about App Insight initialization using NPM](/azure/azure-monitor/app/javascript-sdk-configuration).
-  Build a UI in your application that serves custom questions to the user and gather their input, lets assume that your application gathered responses as a string in the `improvementSuggestion` variable

-  Submit survey results to ACS and send user response using App Insights:
    ``` javascript
    currentCall.feature(SDK.Features.CallSurvey).submitSurvey(survey).then(res => {
    // `improvementSuggestion` contains custom, user response
        if (improvementSuggestion !== '') {
            appInsights.trackEvent({
                    name: "CallSurvey", properties: {
                        // Survey ID to correlate the survey
                        id: res.id,
                        // Other custom properties as key value pair
                        improvementSuggestion: improvementSuggestion
                    }
                });
         }
    });
    appInsights.flush();
    ```
User responses that were sent using AppInsights are available under your App Insights workspace. You can use [Workbooks](../../../update-center/workbooks.md) to query between multiple resources, correlate call ratings and custom survey data. Steps to correlate the call ratings and custom survey data:
-  Create new [Workbooks](../../../update-center/workbooks.md) (Your ACS Resource -> Monitoring -> Workbooks -> New) and query Call Survey data from your ACS resource.
-  Add new query (+Add -> Add query)
-  Make sure `Data source` is `Logs` and `Resource type` is `Communication`
-  You can rename the query (Advanced Settings -> Step name [example: call-survey])
-  Be aware that it could require a maximum of **2 hours** before the survey data becomes visible in the Azure portal. Query the call rating data-
   ```KQL
   ACSCallSurvey
   | where TimeGenerated > now(-24h)
   ```
-  Add another query to get data from App Insights (+Add -> Add query)
-  Make sure `Data source` is `Logs` and `Resource type` is `Application Insights`
-  Query the custom events-
   ```KQL
   customEvents
   | where timestamp > now(-24h)
   | where name == 'CallSurvey'
   | extend d=parse_json(customDimensions)
   | project SurveyId = d.id, ImprovementSuggestion = d.improvementSuggestion
   ```
-  You can rename the query (Advanced Settings -> Step name [example: custom-call-survey])
-  Finally merge these two queries by surveyId. Create new query (+Add -> Add query).
-  Make sure the `Data source` is Merge and select `Merge type` as needed
