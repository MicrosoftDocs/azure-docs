---
title: include file
description: C# recognize action quickstart
services: azure-communication-services
author: Kunaal
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 08/10/2023
ms.topic: include
ms.topic: include file
ms.author: kpunjabi
---

## Prerequisites
- Azure account with an active subscription, for details see [Create an account for free.](https://azure.microsoft.com/free/)
- Azure Communication Services resource. See [Create an Azure Communication Services resource](../../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp). Note the connection string for this resource. 
- Create a new web service application using the [Call Automation SDK](../../../quickstarts/call-automation/callflows-for-customer-interactions.md).
- The latest [.NET library](https://dotnet.microsoft.com/download/dotnet-core) for your operating system.
- Obtain the latest [NuGet package](https://www.nuget.org/packages/Azure.Communication.CallAutomation/).

### For AI features (Public preview)
- Obtain the NuGet package from the [Azure SDK Dev Feed](https://github.com/Azure/azure-sdk-for-net/blob/main/CONTRIBUTING.md#nuget-package-dev-feed).
- Create and connect [Azure AI services to your Azure Communication Services resource](../../../concepts/call-automation/azure-communication-services-azure-cognitive-services-integration.md).
- Create a [custom subdomain](../../../../ai-services/cognitive-services-custom-subdomains.md) for your Azure AI services resource. 


## Technical specifications

The following parameters are available to customize the Recognize function:

| Parameter | Type|Default (if not specified) | Description | Required or Optional |
| ------- |--| ------------------------ | --------- | ------------------ |
| Prompt <br/><br/> *(for details on Play action, refer to [this how-to guide](../play-ai-action.md))* | FileSource, TextSource | Not set |This is the message you wish to play before recognizing input. | Optional |
| InterToneTimeout | TimeSpan | 2 seconds <br/><br/>**Min:** 1 second <br/>**Max:** 60 seconds | Limit in seconds that ACS waits for the caller to press another digit (inter-digit timeout). | Optional |
| InitialSegmentationSilenceTimeoutInSeconds | Integer | 0.5 second | How long recognize action waits for input before considering it a timeout. [Read more here](../../../../../articles/cognitive-services/Speech-Service/how-to-recognize-speech.md). | Optional |
| RecognizeInputsType | Enum | dtmf | Type of input that is recognized. Options are dtmf, choices, speech and speechordtmf. | Required |
| InitialSilenceTimeout | TimeSpan | 5 seconds<br/><br/>**Min:** 0 seconds <br/>**Max:** 300 seconds (DTMF) <br/>**Max:** 20 seconds (Choices) <br/>**Max:** 20 seconds (Speech)| Initial silence timeout adjusts how much nonspeech audio is allowed before a phrase before the recognition attempt ends in a "no match" result. [Read more here](../../../../../articles/cognitive-services/Speech-Service/how-to-recognize-speech.md). | Optional |
| MaxTonesToCollect | Integer | No default<br/><br/>**Min:** 1|Number of digits a developer expects as input from the participant.| Required |
| StopTones |IEnumeration\<DtmfTone\> | Not set | The digit participants can press to escape out of a batch DTMF event. | Optional |
| InterruptPrompt | Bool | True | If the participant has the ability to interrupt the playMessage by pressing a digit. | Optional |
| InterruptCallMediaOperation | Bool | True | If this flag is set it interrupts the current call media operation. For example if any audio is being played it interrupts that operation and initiates recognize. | Optional |
| OperationContext | String | Not set | String that developers can pass mid action, useful for allowing developers to store context about the events they receive. | Optional |
| Phrases | String | Not set | List of phrases that associate to the label, if any of these are heard it is considered a successful recognition. | Required | 
| Tone | String | Not set | The tone to recognize if user decides to press a number instead of using speech. | Optional |
| Label | String | Not set | The key value for recognition. | Required |
| Language | String | En-us | The language that is used for recognizing speech. | Optional |
| EndSilenceTimeout| TimeSpan | 0.5 second | The final pause of the speaker used to detect the final result that gets generated as speech. | Optional |

>[!NOTE] 
>In situations where both dtmf and speech are in the recognizeInputsType, the recognize action will act on the first input type received, i.e. if the user presses a keypad number first then the recognize action will consider it a dtmf event and continue listening for dtmf tones. If the user speaks first then the recognize action will consider it a speech recognition and listen for voice input. 


## Create a new C# application

In the console window of your operating system, use the `dotnet` command to create a new web application.

```console
dotnet new web -n MyApplication
```

## Install the NuGet package

The NuGet package can be obtained from [here](https://www.nuget.org/packages/Azure.Communication.CallAutomation/), if you haven't already done so. 

For access to AI features in public preview, you need to obtain the NuGet package from the Dev Feed. You can do this by configuring your package manager to use the Azure SDK Dev Feed from [here](https://github.com/Azure/azure-sdk-for-net/blob/main/CONTRIBUTING.md#nuget-package-dev-feed) and locate **Azure.Communication.CallAutomation** package.

## Establish a call

By this point you should be familiar with starting calls, if you need to learn more about making a call, follow our [quickstart](../../../quickstarts/call-automation/quickstart-make-an-outbound-call.md). You can also use the code snippet provided here to understand how to answer a call.

``` csharp
var callAutomationClient = new CallAutomationClient("<Azure Communication Services connection string>");

var answerCallOptions = new AnswerCallOptions("<Incoming call context once call is connected>", new Uri("<https://sample-callback-uri>")) 
{ 
    CognitiveServicesEndpoint = new Uri("<Azure Cognitive Services Endpoint>") 
}; 
var answerCallResult = await callAutomationClient.AnswerCallAsync(answerCallOptions);
```

## Call the recognize action

When your application answers the call, you can provide information about recognizing participant input and playing a prompt.

### DTMF
``` csharp
var maxTonesToCollect = 3;
String textToPlay = "Welcome to Contoso, please enter 3 DTMF.";
var playSource = new TextSource(textToPlay, "en-US-ElizabethNeural");
var recognizeOptions = new CallMediaRecognizeDtmfOptions(targetParticipant, maxTonesToCollect) {
  InitialSilenceTimeout = TimeSpan.FromSeconds(30),
    Prompt = playSource,
    InterToneTimeout = TimeSpan.FromSeconds(5),
    InterruptPrompt = true,
    StopTones = new DtmfTone[] {
      DtmfTone.Pound
    },
};
var recognizeResult = await callAutomationClient.GetCallConnection(callConnectionId)
  .GetCallMedia()
  .StartRecognizingAsync(recognizeOptions);
```

### Speech-to-Text Choices (Public Preview)
``` csharp
var choices = new List < RecognitionChoice > {
  new RecognitionChoice("Confirm", new List < string > {
    "Confirm",
    "First",
    "One"
  }) {
    Tone = DtmfTone.One
  },
  new RecognitionChoice("Cancel", new List < string > {
    "Cancel",
    "Second",
    "Two"
  }) {
    Tone = DtmfTone.Two
  }
};
String textToPlay = "Hello, This is a reminder for your appointment at 2 PM, Say Confirm to confirm your appointment or Cancel to cancel the appointment. Thank you!";

var playSource = new TextSource(textToPlay, "en-US-ElizabethNeural");
var recognizeOptions = new CallMediaRecognizeChoiceOptions(targetParticipant, choices) {
  InterruptPrompt = true,
    InitialSilenceTimeout = TimeSpan.FromSeconds(30),
    Prompt = playSource,
    OperationContext = "AppointmentReminderMenu"
};
var recognizeResult = await callAutomationClient.GetCallConnection(callConnectionId)
  .GetCallMedia()
  .StartRecognizingAsync(recognizeOptions);
```

### Speech-to-Text (Public Preview)

``` csharp
String textToPlay = "Hi, how can I help you today?";
var playSource = new TextSource(textToPlay, "en-US-ElizabethNeural");
var recognizeOptions = new CallMediaRecognizeSpeechOptions(targetParticipant) {
  Prompt = playSource,
    EndSilenceTimeout = TimeSpan.FromMilliseconds(1000),
    OperationContext = "OpenQuestionSpeech"
};
var recognizeResult = await callAutomationClient.GetCallConnection(callConnectionId)
  .GetCallMedia()
  .StartRecognizingAsync(recognizeOptions);
```

### Speech-to-Text or DTMF (Public Preview)

``` csharp
var maxTonesToCollect = 1; 
String textToPlay = "Hi, how can I help you today, you can press 0 to speak to an agent?"; 
var playSource = new TextSource(textToPlay, "en-US-ElizabethNeural"); 
var recognizeOptions = new CallMediaRecognizeSpeechOrDtmfOptions(targetParticipant, maxTonesToCollect) 
{ 
    Prompt = playSource, 
    EndSilenceTimeout = TimeSpan.FromMilliseconds(1000), 
    InitialSilenceTimeout = TimeSpan.FromSeconds(30), 
    InterruptPrompt = true, 
    OperationContext = "OpenQuestionSpeechOrDtmf" 
}; 
var recognizeResult = await callAutomationClient.GetCallConnection(callConnectionId) 
    .GetCallMedia() 
    .StartRecognizingAsync(recognizeOptions); 
```
> [!Note]
> If parameters aren't set, the defaults are applied where possible.

## Receiving recognize event updates

Developers can subscribe to the *RecognizeCompleted* and *RecognizeFailed* events on the webhook callback they registered for the call to create business logic in their application for determining next steps when one of the previously mentioned events occurs. 

### Example of how you can deserialize the *RecognizeCompleted* event:
``` csharp
if (acsEvent is RecognizeCompleted recognizeCompleted) 
{ 
    switch (recognizeCompleted.RecognizeResult) 
    { 
        case DtmfResult dtmfResult: 
            //Take action for Recognition through DTMF 
            var tones = dtmfResult.Tones; 
            logger.LogInformation("Recognize completed succesfully, tones={tones}", tones); 
            break; 
        case ChoiceResult choiceResult: 
            // Take action for Recognition through Choices 
            var labelDetected = choiceResult.Label; 
            var phraseDetected = choiceResult.RecognizedPhrase; 
            // If choice is detected by phrase, choiceResult.RecognizedPhrase will have the phrase detected, 
            // If choice is detected using dtmf tone, phrase will be null 
            logger.LogInformation("Recognize completed succesfully, labelDetected={labelDetected}, phraseDetected={phraseDetected}", labelDetected, phraseDetected);
            break; 
        case SpeechResult speechResult: 
            // Take action for Recognition through Choices 
            var text = speechResult.Speech; 
            logger.LogInformation("Recognize completed succesfully, text={text}", text); 
            break; 
        default: 
            logger.LogInformation("Recognize completed succesfully, recognizeResult={recognizeResult}", recognizeCompleted.RecognizeResult); 
            break; 
    } 
} 
```

### Example of how you can deserialize the *RecognizeFailed* event:

``` csharp
if (acsEvent is RecognizeFailed recognizeFailed) 
{ 
    if (MediaEventReasonCode.RecognizeInitialSilenceTimedOut.Equals(recognizeFailed.ReasonCode)) 
    { 
        // Take action for time out 
        logger.LogInformation("Recognition failed: initial silencev time out"); 
    } 
    else if (MediaEventReasonCode.RecognizeSpeechOptionNotMatched.Equals(recognizeFailed.ReasonCode)) 
    { 
        // Take action for option not matched 
        logger.LogInformation("Recognition failed: speech option not matched"); 
    } 
    else if (MediaEventReasonCode.RecognizeIncorrectToneDetected.Equals(recognizeFailed.ReasonCode)) 
    { 
        // Take action for incorrect tone 
        logger.LogInformation("Recognition failed: incorrect tone detected"); 
    } 
    else 
    { 
        logger.LogInformation("Recognition failed, result={result}, context={context}", recognizeFailed.ResultInformation?.Message, recognizeFailed.OperationContext); 
    } 
} 
```

### Example of how you can deserialize the *RecognizeCanceled* event:
``` csharp
if (acsEvent is RecognizeCanceled { OperationContext: "AppointmentReminderMenu" })
        {
            logger.LogInformation($"RecognizeCanceled event received for call connection id: {@event.CallConnectionId}");
            //Take action on recognize canceled operation
           await callConnection.HangUpAsync(forEveryone: true);
        }
```
