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
> End of Call Survey is available starting on the version [1.8.0](https://www.nuget.org/packages/Azure.Communication.Calling.WindowsClient/1.8.0) of the Windows Calling SDK. Make sure to use that version or later when trying the instructions.

## Sample of API usage

The End of Call Survey feature should be used after the call ends. Users can rate any kind of VoIP call, 1:1, group, meeting, outgoing and incoming. Once a user's call ends, your application can show a UI to the end user allowing them to choose a rating score, and if needed, pick issues they’ve encountered during the call from our predefined list.

The following code snips show an example of one-to-one call. After the end of the call, your application can show a survey UI and once the user chooses a rating, your application should call the feature API to submit the survey with the user choices.

We encourage you to use the default rating scale, which is the five star rating (between 1-5). However, you can submit a survey with custom rating scale.

### Start a survey

You create a `CallSurvey` object by starting a survey. This records a survey intent. In case this particular `CallSurvey` object isn't submitted afterwards, it means that the survey was skipped or ignored by the end customer.

```csharp
var surveyCallFeature = call.Features.Survey;
var survey = await surveyCallFeature.StartSurveyAsync();
```

### General usage

When rating calls, you must respect values defined on the scale field. The lowerBound value denotes the worst experience possible, while the upperBound value means the perfect experience. Both values are inclusive. 

OverallRating is a required category for all surveys.

For more information on suggested survey use, see [Survey Concepts](../../concepts/voice-video-calling/end-of-call-survey-concept.md)

> [!NOTE]
>A question’s indicated cutoff value in the API is the threshold that Microsoft uses when analyzing your survey data. When you customize the cutoff value or Input Range, Microsoft analyzes your survey data according to your customization.

### Rate call only - no custom scale

```csharp
survey.OverallScore = new CallSurveyScore() { Score = 5 };
```

### Rate call only - with custom scale and issues

```csharp
// configuring scale and score
survey.OverallScore = new CallSurveyScore() { 
    Scale = new CallSurveyRatingScale() { 
                LowerBound = 0,
                UpperBound = 1,
                LowScoreThreshold = 1,
            }, 
            Score = 1 
};

// reporting one or more issues
survey.OverallIssues = CallIssues.HadToRejoin;
```

### Rate overall, audio, and video with a sample issue

```csharp
survey.OverallScore = new CallSurveyScore() { 
    Score = 5 
};
survey.AudioScore = new CallSurveyScore() { 
    Score = 4
};
survey.VideoScore = new CallSurveyScore() { 
    Score = 3
};

survey.videoIssues = VideoIssues.Freezes;
```

### Submit Survey and handle errors the SDK can send

```csharp 
try
{
    CallSurveyResult result = await surveyCallFeature.SubmitSurveyAsync(survey);
    Console.WriteLine("Survey submitted" + result.SurveyId);
} catch (Exception ex)
{
   Console.WriteLine(ex.Message);
}
```

## Find different types of errors

### Failures while submitting survey:

The submitSurvey API can return an error in the following scenarios:

- Overall survey rating is required.

- `CallSurveyRatingScale` bounds must be within 0 and 100. LowerBound should be less than UpperBound. LowScoreThreshold should be within bounds.

- Any of the scores must respect the bounds defined by the `CallSurveyRatingScale`. All values in the `CallSurveyRatingScale` object are inclusive. Using the default scale, the score value should be between 1 and 5.

- Survey can't be submitted because of network/service error.

### Available Survey tags

### Overall Call

| Tag | Description |
| ----------- | ----------- |
|  `CannotJoin` | Customer wasn't able to join a call |
| `CannotInvite` | Customer wasn't able to add a new participant on call | 
| `HadToRejoin` | Customer left and joined again the call as a workaround for an issue |
|  `EndedUnexpectedly`  | Customer's call ended with no apparent reason | 
| `OtherIssues` | Any issue that doesn't fit previous descriptions | 

### Audio Issues

|  Tag   | Description |
| ----------- | ----------- |
| `NoLocalAudio` | No Audio on the customer machine from the call, inability to hear anyone in the call| 
| `NoRemoteAudio` | Missing audio from a specific participant| 
| `Echo` | Echo being perceived in the call| 
| `AudioNoise` | Audio received with unintended noise| 
| `LowVolume`  | Audio too low | 
| `AudioStoppedUnexpectedly` | Audio stopped with no clear reason (e.g. no one is muted)| 
| `DistortedSpeech` | A participant's voice is distorted, different from their expected voice | 
| `AudioInterruption`  | Customer experiences audio interruptions, voice cuts, etc.| 
| `OtherIssues`   | Any issue that doesn't fit previous descriptions | 

###  Video Issues    

| Tag | Description | 
| ----------- | ----------- |
| `NoVideoReceived` |Customer doesn't receive video from a participant| 
| `NoVideoSent` | Customer starts video but no one in the call is able to see it | 
| `LowQuality` | Low quality video| 
| `Freezes` | Video Freezes| 
| `StoppedUnexpectedly` | Screen Share stops with no clear reason (e.g camera is on and video calling is on) |  
| `DarkVideoReceived` | Video is being sent but participant sees only a dark box (or another single color) | 
| `AudioVideoOutOfSync` | Video and Audio do not seem to be in sync| 
| `OtherIssues`   |Any issue that doesn't fit previous descriptions |

### Screen share Issues    

| Tag | Description | 
| ----------- | ----------- |
| `NoContentLocal` | Customer doesn't receive screen share from a participant that is sharing | 
| `NoContentRemote` | Customer is sharing screen, but other one or more participants are unable to see it  | 
| `CannotPresent` | Unable to start screen share| 
| `LowQuality` | Low quality on screen share video, e.g unable to read | 
| `Freezes` | Screen Share freezes during presentation | 
| `StoppedUnexpectedly` | Screen Share stops with no clear reason (e.g screen share wasn't stopped by customer) | 
| `LargeDelay` |Perceived delay between what is being shown and what is seen | 
| `OtherIssues`     |Any issue that doesn't fit previous descriptions| 

### Customization options

You can choose to collect each of the four API values or only the ones
you find most important. For example, you can choose to only ask
customers about their overall call experience instead of asking them
about their audio, video, and screen share experience. You can also
customize input ranges to suit your needs. The default input range is 1
to 5 for Overall Call, Audio, Video, and
Screen share. However, each API value can be customized from a minimum of
0 to maximum of 100.

   > [!NOTE]
   > A question’s indicated cutoff value in the API is the threshold that Microsoft uses when analyzing your survey data. When you customize the cutoff value or Input Range, Microsoft analyzes your survey data according to your customization.

## Custom questions

In addition to using the End of Call Survey API, you can create your own survey questions and incorporate them with the End of Call Survey results. 

However, the result payload of `SubmitSurvey` operation provides data that you can use to correlate ACS Survey data with your own custom data and storage. `CallSurveyResult` class have the `SurveyId` field that denotes a unique identifier for the survey and `CallId` denotes an identifier for the call where the survey was generated. Saving these identifiers along with your customized data allow data to be associated uniquely.
