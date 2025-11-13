---
title: include file
description: C# Recognize action quickstart
services: azure-communication-services
author: Kunaal
ms.service: azure-communication-services
ms.subservice: call-automation
ms.date: 11/20/2023
ms.topic: include
ms.topic: include file
ms.author: kpunjabi
---

## Prerequisites
- Azure account with an active subscription, for details see [Create an account for free.](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- Azure Communication Services resource. See [Create an Azure Communication Services resource](../../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp). Note the connection string for this resource. 
- Create a new web service application using the [Call Automation SDK](../../../quickstarts/call-automation/callflows-for-customer-interactions.md).
- The latest [.NET library](https://dotnet.microsoft.com/download/dotnet-core) for your operating system.
- The latest [NuGet package](https://www.nuget.org/packages/Azure.Communication.CallAutomation/).

### For AI features 
- Create and connect [Azure AI services to your Azure Communication Services resource](../../../concepts/call-automation/azure-communication-services-azure-cognitive-services-integration.md).
- Create a [custom subdomain](/azure/ai-services/cognitive-services-custom-subdomains) for your Azure AI services resource. 


## Technical specifications

The following parameters are available to customize the Recognize function:

| Parameter | Type | Default (if not specified) | Description | Required or Optional |
| ------- | --- | ------------------------ | --------- | ------------------ |
| `Prompt` <br/><br/> *(For details, see [Customize voice prompts to users with Play action](../play-ai-action.md))* | FileSource, TextSource | Not set | The message to play before recognizing input. | Optional |
| `InterToneTimeout` | TimeSpan | 2 seconds <br/><br/>**Min:** 1 second <br/>**Max:** 60 seconds | Limit in seconds that Azure Communication Services waits for the caller to press another digit (inter-digit timeout). | Optional |
| `InitialSegmentationSilenceTimeoutInSeconds` | Integer | 0.5 second | How long recognize action waits for input before considering it a timeout. See [How to recognize speech](/azure/ai-services/speech-service/how-to-recognize-speech). | Optional |
| `RecognizeInputsType` | Enum | dtmf | Type of input that is recognized. Options are `dtmf`, `choices`, `speech`, and `speechordtmf`. | Required |
| `InitialSilenceTimeout` | TimeSpan | 5 seconds<br/><br/>**Min:** 0 seconds <br/>**Max:** 300 seconds (DTMF) <br/>**Max:** 20 seconds (Choices) <br/>**Max:** 20 seconds (Speech)| Initial silence timeout adjusts how much nonspeech audio is allowed before a phrase before the recognition attempt ends in a "no match" result. See [How to recognize speech](/azure/ai-services/speech-service/how-to-recognize-speech). | Optional |
| `MaxTonesToCollect` | Integer | No default<br/><br/>**Min:** 1|Number of digits a developer expects as input from the participant.| Required |
| `StopTones` | IEnumeration\<DtmfTone\> | Not set | The digit participants can press to escape out of a batch DTMF event. | Optional |
|    `InterruptPrompt` | Bool | True | If the participant has the ability to interrupt the playMessage by pressing a digit. | Optional |
| `InterruptCallMediaOperation` | Bool | True | If this flag is set, it interrupts the current call media operation. For example if any audio is being played it interrupts that operation and initiates recognize. | Optional |
| `OperationContext` | String | Not set | String that developers can pass mid action, useful for allowing developers to store context about the events they receive. | Optional |
| `Phrases` | String | Not set | List of phrases that associate to the label. Hearing any of these phrases results in a successful recognition. | Required | 
| `Tone` | String | Not set | The tone to recognize if user decides to press a number instead of using speech. | Optional |
| `Label` | String | Not set | The key value for recognition. | Required |
| `Language` | String | En-us | The language that is used for recognizing speech. | Optional |
| `EndSilenceTimeout` | TimeSpan | 0.5 second | The final pause of the speaker used to detect the final result that gets generated as speech. | Optional |

>[!NOTE] 
>In situations where both DTMF and speech are in the `recognizeInputsType`, the recognize action acts on the first input type received. For example, if the user presses a keypad number first then the recognize action considers it a DTMF event and continues listening for DTMF tones. If the user speaks first then the recognize action considers it a speech recognition event and listens for voice input.  


## Create a new C# application

In the console window of your operating system, use the `dotnet` command to create a new web application.

```console
dotnet new web -n MyApplication
```

## Install the NuGet package

Get the NuGet package from [NuGet Gallery | Azure.Communication.CallAutomation](https://www.nuget.org/packages/Azure.Communication.CallAutomation/). Follow the instructions to install the package.

## Establish a call

By this point you should be familiar with starting calls. For more information about making a call, see [Quickstart: Make and outbound call](../../../quickstarts/call-automation/quickstart-make-an-outbound-call.md). You can also use the code snippet provided here to understand how to answer a call.

``` csharp
var callAutomationClient = new CallAutomationClient("<Azure Communication Services connection string>");

var answerCallOptions = new AnswerCallOptions("<Incoming call context once call is connected>", new Uri("<https://sample-callback-uri>"))  
{  
    CallIntelligenceOptions = new CallIntelligenceOptions() { CognitiveServicesEndpoint = new Uri("<Azure Cognitive Services Endpoint>") } 
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

For speech-to-text flows, the Call Automation Recognize action also supports the use of [custom speech models](/azure/machine-learning/tutorial-train-model). Features like custom speech models can be useful when you're building an application that needs to listen for complex words that the default speech-to-text models may not understand. One example is when you're building an application for the telemedical industry and your virtual agent needs to be able to recognize medical terms. You can learn more in [Create a custom speech project](/azure/ai-services/speech-service/speech-services-quotas-and-limits).

### Speech-to-Text Choices 
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
    OperationContext = "AppointmentReminderMenu",
    SpeechLanguages = new List<string> { "en-US", "hi-IN", "fr-FR" },
    //Only add the SpeechModelEndpointId if you have a custom speech model you would like to use
    SpeechModelEndpointId = "YourCustomSpeechModelEndpointId"
};
var recognizeResult = await callAutomationClient.GetCallConnection(callConnectionId)
  .GetCallMedia()
  .StartRecognizingAsync(recognizeOptions);
```

### Speech-to-Text

``` csharp
String textToPlay = "Hi, how can I help you today?";
var playSource = new TextSource(textToPlay, "en-US-ElizabethNeural");
var recognizeOptions = new CallMediaRecognizeSpeechOptions(targetParticipant) {
  Prompt = playSource,
    EndSilenceTimeout = TimeSpan.FromMilliseconds(1000),
    OperationContext = "OpenQuestionSpeech",
    //Only add the SpeechModelEndpointId if you have a custom speech model you would like to use
    SpeechModelEndpointId = "YourCustomSpeechModelEndpointId"
};
var recognizeResult = await callAutomationClient.GetCallConnection(callConnectionId)
  .GetCallMedia()
  .StartRecognizingAsync(recognizeOptions);
```

### Speech-to-Text or DTMF 

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
    OperationContext = "OpenQuestionSpeechOrDtmf",
    SpeechLanguages = new List<string> { "en-US", "hi-IN", "fr-FR" },
    //Only add the SpeechModelEndpointId if you have a custom speech model you would like to use
    SpeechModelEndpointId = "YourCustomSpeechModelEndpointId" 
}; 
var recognizeResult = await callAutomationClient.GetCallConnection(callConnectionId) 
    .GetCallMedia() 
    .StartRecognizingAsync(recognizeOptions); 
```
> [!Note]
> If parameters aren't set, the defaults are applied where possible.

### Real-time language identification (Preview)

With the additional of real-time language identification, developers can automatically detect spoken languages to enable natural, human-like communications and eliminate manual language selection by the end users. 

``` csharp
string textToPlay = "Hi, how can I help you today?";
var playSource = new TextSource(textToPlay, "en-US-ElizabethNeural");
var recognizeOptions = new CallMediaRecognizeSpeechOptions(targetParticipant: new PhoneNumberIdentifier(targetParticipant))
{
    Prompt = playSource,
    InterruptCallMediaOperation = false,
    InterruptPrompt = false,
    InitialSilenceTimeout = TimeSpan.FromSeconds(10),
    OperationContext = "OpenQuestionSpeech",
    // Enable Language Identification
    SpeechLanguages = new List<string> { "en-US", "hi-IN", "fr-FR" },
    // Only add the SpeechModelEndpointId if you have a custom speech model you would like to use
    SpeechModelEndpointId = "YourCustomSpeechModelEndpointId"
};
var recognizeResult = await callAutomationClient.GetCallConnection(callConnectionId)
    .GetCallMedia()
    .StartRecognizingAsync(recognizeOptions);
```

>[!Note]
> **Language support limits**
>
> When using the `Recognize` API with Speech as the input type:
> - You can specify **up to 10 languages** using `setSpeechLanguages(...)`.
> - Be aware that using more languages may **increase the time** it takes to receive the `RecognizeCompleted` event due to additional processing.
>
> When using the `Recognize` API with **choices**:
> - Only **up to 4 languages** are supported.
> - Specifying more than 4 languages in choices mode may result in errors or degraded performance.

### Sentiment Analysis (Preview)
The Recognize API supports sentiment analysis when using speech input. Track the emotional tone of conversations in real time to support customer and agent interactions, and enable supervisors to intervene when necessary. It can also be useful for routing, personalization or analytics. 

``` csharp
string textToPlay = "Hi, how can I help you today?";
var playSource = new TextSource(textToPlay, "en-US-ElizabethNeural");
var recognizeOptions = new CallMediaRecognizeSpeechOptions(targetParticipant: new PhoneNumberIdentifier(targetParticipant))
{
    Prompt = playSource,
    InterruptCallMediaOperation = false,
    InterruptPrompt = false,
    InitialSilenceTimeout = TimeSpan.FromSeconds(10),
    OperationContext = "OpenQuestionSpeech",
    // Enable Sentiment Analysis
    IsSentimentAnalysisEnabled = true
};
var recognizeResult = await callAutomationClient.GetCallConnection(callConnectionId)
    .GetCallMedia()
    .StartRecognizingAsync(recognizeOptions);
```


## Receiving recognize event updates

Developers can subscribe to `RecognizeCompleted` and `RecognizeFailed` events on the registered webhook callback. Use this callback with business logic in your application to determine next steps when one of the events occurs. 

### Example of how you can deserialize the *RecognizeCompleted* event:
``` csharp
if (parsedEvent is RecognizeCompleted recognizeCompleted)
{
    logger.LogInformation($"Received call event: {recognizeCompleted.GetType()}");

    callConnectionId = recognizeCompleted.CallConnectionId;

    switch (recognizeCompleted.RecognizeResult)
    {
        case DtmfResult dtmfResult:
            var tones = dtmfResult.Tones;
            logger.LogInformation("Recognize completed successfully, tones={tones}", tones);
            break;

        case ChoiceResult choiceResult:
            var labelDetected = choiceResult.Label;
            var phraseDetected = choiceResult.RecognizedPhrase;
            var sentimentAnalysis = choiceResult.SentimentAnalysisResult;

            logger.LogInformation("Recognize completed successfully, labelDetected={labelDetected}, phraseDetected={phraseDetected}", labelDetected, phraseDetected);
            logger.LogInformation("Language Identified: {language}", choiceResult.LanguageIdentified);

            if (sentimentAnalysis != null)
            {
                logger.LogInformation("Sentiment: {sentiment}", sentimentAnalysis.Sentiment);
            }
            break;

        case SpeechResult speechResult:
            var text = speechResult.Speech;
            var speechSentiment = speechResult.SentimentAnalysisResult;

            logger.LogInformation("Recognize completed successfully, text={text}", text);
            logger.LogInformation("Language Identified: {language}", speechResult.LanguageIdentified);

            if (speechSentiment != null)
            {
                logger.LogInformation("Sentiment: {sentiment}", speechSentiment.Sentiment);
            }
            break;

        default:
            logger.LogInformation("Recognize completed successfully, recognizeResult={recognizeResult}", recognizeCompleted.RecognizeResult);
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
        logger.LogInformation("Recognition failed: initial silence time out"); 
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
