---
title: include file
description: JavaScript Recognize action how-to guide
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
- Azure account with an active subscription, for details see [Create an account for free](https://azure.microsoft.com/free/).
- Azure Communication Services resource. See [Create an Azure Communication Services resource](../../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp). Note the connection string for this resource. 
- Create a new web service application using the [Call Automation SDK](../../../quickstarts/call-automation/callflows-for-customer-interactions.md).
- Have Node.js installed, you can install it from their [official website](https://nodejs.org).

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

## Create a new JavaScript application

Create a new JavaScript application in your project directory. Initialize a new Node.js project with the following command. This creates a package.json file for your project, which manages your project's dependencies. 

``` console
npm init -y
```

### Install the Azure Communication Services Call Automation package

``` console
npm install @azure/communication-call-automation
```

Create a new JavaScript file in your project directory, for example, name it `app.js`. Write your JavaScript code in this file.

Run your application using Node.js with the following command. 

``` console
node app.js
```

## Establish a call

By this point you should be familiar with starting calls. For more information about making a call, see [Quickstart: Make and outbound call](../../../quickstarts/call-automation/quickstart-make-an-outbound-call.md).

## Call the recognize action

When your application answers the call, you can provide information about recognizing participant input and playing a prompt.

### DTMF
``` javascript
const maxTonesToCollect = 3; 
const textToPlay = "Welcome to Contoso, please enter 3 DTMF."; 
const playSource: TextSource = { text: textToPlay, voiceName: "en-US-ElizabethNeural", kind: "textSource" }; 
const recognizeOptions: CallMediaRecognizeDtmfOptions = { 
    maxTonesToCollect: maxTonesToCollect, 
    initialSilenceTimeoutInSeconds: 30, 
    playPrompt: playSource, 
    interToneTimeoutInSeconds: 5, 
    interruptPrompt: true, 
    stopDtmfTones: [ DtmfTone.Pound ], 
    kind: "callMediaRecognizeDtmfOptions" 
}; 

await callAutomationClient.getCallConnection(callConnectionId) 
    .getCallMedia() 
    .startRecognizing(targetParticipant, recognizeOptions); 
```

For speech-to-text flows, the Call Automation Recognize action also supports the use of [custom speech models](/azure/machine-learning/tutorial-train-model). Features like custom speech models can be useful when you're building an application that needs to listen for complex words that the default speech-to-text models may not understand. One example is when you're building an application for the telemedical industry and your virtual agent needs to be able to recognize medical terms. You can learn more in [Create a custom speech project](/azure/ai-services/speech-service/speech-services-quotas-and-limits).

### Speech-to-Text Choices 
``` javascript
const choices = [ 
    {  
        label: "Confirm", 
        phrases: [ "Confirm", "First", "One" ], 
        tone: DtmfTone.One 
    }, 
    { 
        label: "Cancel", 
        phrases: [ "Cancel", "Second", "Two" ], 
        tone: DtmfTone.Two 
    } 
]; 

const textToPlay = "Hello, This is a reminder for your appointment at 2 PM, Say Confirm to confirm your appointment or Cancel to cancel the appointment. Thank you!"; 
const playSource: TextSource = { text: textToPlay, voiceName: "en-US-ElizabethNeural", kind: "textSource" }; 
const recognizeOptions: CallMediaRecognizeChoiceOptions = { 
    choices: choices, 
    interruptPrompt: true, 
    initialSilenceTimeoutInSeconds: 30, 
    playPrompt: playSource, 
    operationContext: "AppointmentReminderMenu", 
    kind: "callMediaRecognizeChoiceOptions",
    //Only add the speechRecognitionModelEndpointId if you have a custom speech model you would like to use
    speechRecognitionModelEndpointId: "YourCustomSpeechEndpointId"
}; 

await callAutomationClient.getCallConnection(callConnectionId) 
    .getCallMedia() 
    .startRecognizing(targetParticipant, recognizeOptions); 
```

### Speech-to-Text 

``` javascript
const textToPlay = "Hi, how can I help you today?"; 
const playSource: TextSource = { text: textToPlay, voiceName: "en-US-ElizabethNeural", kind: "textSource" }; 
const recognizeOptions: CallMediaRecognizeSpeechOptions = { 
    endSilenceTimeoutInSeconds: 1, 
    playPrompt: playSource, 
    operationContext: "OpenQuestionSpeech", 
    kind: "callMediaRecognizeSpeechOptions",
    //Only add the speechRecognitionModelEndpointId if you have a custom speech model you would like to use
    speechRecognitionModelEndpointId: "YourCustomSpeechEndpointId"
}; 

await callAutomationClient.getCallConnection(callConnectionId) 
    .getCallMedia() 
    .startRecognizing(targetParticipant, recognizeOptions); 
```

### Speech-to-Text or DTMF 

``` javascript
const maxTonesToCollect = 1; 
const textToPlay = "Hi, how can I help you today, you can press 0 to speak to an agent?"; 
const playSource: TextSource = { text: textToPlay, voiceName: "en-US-ElizabethNeural", kind: "textSource" }; 
const recognizeOptions: CallMediaRecognizeSpeechOrDtmfOptions = { 
    maxTonesToCollect: maxTonesToCollect, 
    endSilenceTimeoutInSeconds: 1, 
    playPrompt: playSource, 
    initialSilenceTimeoutInSeconds: 30, 
    interruptPrompt: true, 
    operationContext: "OpenQuestionSpeechOrDtmf", 
    kind: "callMediaRecognizeSpeechOrDtmfOptions",
    //Only add the speechRecognitionModelEndpointId if you have a custom speech model you would like to use
    speechRecognitionModelEndpointId: "YourCustomSpeechEndpointId"
}; 

await callAutomationClient.getCallConnection(callConnectionId) 
    .getCallMedia() 
    .startRecognizing(targetParticipant, recognizeOptions); 
```
> [!Note]
> If parameters aren't set, the defaults are applied where possible.

## Receiving recognize event updates

Developers can subscribe to `RecognizeCompleted` and `RecognizeFailed` events on the registered webhook callback. Use this callback with business logic in your application to determine next steps when one of the events occurs. 

### Example of how you can deserialize the *RecognizeCompleted* event:

``` javascript
if (event.type === "Microsoft.Communication.RecognizeCompleted") { 
    if (eventData.recognitionType === "dtmf") { 
        const tones = eventData.dtmfResult.tones; 
        console.log("Recognition completed, tones=%s, context=%s", tones, eventData.operationContext); 
    } else if (eventData.recognitionType === "choices") { 
        const labelDetected = eventData.choiceResult.label; 
        const phraseDetected = eventData.choiceResult.recognizedPhrase; 
        console.log("Recognition completed, labelDetected=%s, phraseDetected=%s, context=%s", labelDetected, phraseDetected, eventData.operationContext); 
    } else if (eventData.recognitionType === "speech") { 
        const text = eventData.speechResult.speech; 
        console.log("Recognition completed, text=%s, context=%s", text, eventData.operationContext); 
    } else { 
        console.log("Recognition completed: data=%s", JSON.stringify(eventData, null, 2)); 
    } 
} 
```

### Example of how you can deserialize the *RecognizeFailed* event:

``` javascript
if (event.type === "Microsoft.Communication.RecognizeFailed") {
    console.log("Recognize failed: data=%s", JSON.stringify(eventData, null, 2));
}
```

### Example of how you can deserialize the *RecognizeCanceled* event:

``` javascript
if (event.type === "Microsoft.Communication.RecognizeCanceled") {
    console.log("Recognize canceled, context=%s", eventData.operationContext);
}
```
