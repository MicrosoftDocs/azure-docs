---
title: include file
description: Python recognize action how-to guide
services: azure-communication-services
author: Kunaal
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 05/28/2023
ms.topic: include
ms.topic: include file
ms.author: kpunjabi
---

## Prerequisites
- Azure account with an active subscription, for details see [Create an account for free.](https://azure.microsoft.com/free/)
- Azure Communication Services resource. See [Create an Azure Communication Services resource](../../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp). Note the connection string for this resource. 
- Create a new web service application using the [Call Automation SDK](../../../quickstarts/call-automation/callflows-for-customer-interactions.md).
- Have Python installed, you can install from the [official site](https://www.python.org/).

### For AI features (Public preview)
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

## Create a new Python application

### Set up a Python virtual environment for your project
``` console
python -m venv play-audio-app
```

### Activate your virtual environment
On windows, use the following command:
``` console
.\ play-audio-quickstart \Scripts\activate
```
On Unix, use the following command:
``` console
source play-audio-quickstart /bin/activate
```

### Install the Azure Communication Services Call Automation package 

``` console
pip install azure-communication-callautomation
```
Create your application file in your project directory, for example, name it app.py. You write your Python code in this file.  

Run your application using Python with the following command. This executes the Python code you have written.  

``` console
python app.py
```

## Establish a call

By this point you should be familiar with starting calls, if you need to learn more about making a call, follow our [quickstart](../../../quickstarts/call-automation/quickstart-make-an-outbound-call.md). In this quickstart, we create an outbound call.

## Call the recognize action

When your application answers the call, you can provide information about recognizing participant input and playing a prompt.

### DTMF
``` python
max_tones_to_collect = 3 
text_to_play = "Welcome to Contoso, please enter 3 DTMF." 
play_source = TextSource(text=text_to_play, voice_name="en-US-ElizabethNeural") 
call_automation_client.get_call_connection(call_connection_id).start_recognizing_media( 
    dtmf_max_tones_to_collect=max_tones_to_collect, 
    input_type=RecognizeInputType.DTMF, 
    target_participant=target_participant, 
    initial_silence_timeout=30, 
    play_prompt=play_source, 
    dtmf_inter_tone_timeout=5, 
    interrupt_prompt=True, 
    dtmf_stop_tones=[ DtmfTone.Pound ]) 
```
For speech-to-text flows, Call Automation recognize action also supports the use of custom speech models. Features like custom speech models can be useful when you're building an application that needs to listen for complex words which the default speech-to-text models may not be capable of understanding, a good example of this can be when you're building an application for the telemedical industry and your virtual agent needs to be able to recognize medical terms. You can learn more about creating and deploying custom speech models [here](../../../../ai-services/speech-service/how-to-custom-speech-create-project.md).

### Speech-to-Text Choices (Public Preview)
``` python
choices = [ 
    RecognitionChoice( 
        label="Confirm", 
        phrases=[ "Confirm", "First", "One" ], 
        tone=DtmfTone.ONE 
    ), 
    RecognitionChoice( 
        label="Cancel", 
        phrases=[ "Cancel", "Second", "Two" ], 
        tone=DtmfTone.TWO 
    ) 
] 
text_to_play = "Hello, This is a reminder for your appointment at 2 PM, Say Confirm to confirm your appointment or Cancel to cancel the appointment. Thank you!" 
play_source = TextSource(text=text_to_play, voice_name="en-US-ElizabethNeural") 
call_automation_client.get_call_connection(call_connection_id).start_recognizing_media( 
    input_type=RecognizeInputType.CHOICES, 
    target_participant=target_participant, 
    choices=choices, 
    interrupt_prompt=True, 
    initial_silence_timeout=30, 
    play_prompt=play_source, 
    operation_context="AppointmentReminderMenu",
    # Only add the speech_recognition_model_endpoint_id if you have a custom speech model you would like to use
    speech_recognition_model_endpoint_id="YourCustomSpeechModelEndpointId")  
```

### Speech-to-Text (Public Preview)

``` python
text_to_play = "Hi, how can I help you today?" 
play_source = TextSource(text=text_to_play, voice_name="en-US-ElizabethNeural") 
call_automation_client.get_call_connection(call_connection_id).start_recognizing_media( 
    input_type=RecognizeInputType.SPEECH, 
    target_participant=target_participant, 
    end_silence_timeout=1, 
    play_prompt=play_source, 
    operation_context="OpenQuestionSpeech",
    # Only add the speech_recognition_model_endpoint_id if you have a custom speech model you would like to use
    speech_recognition_model_endpoint_id="YourCustomSpeechModelEndpointId") 
```

### Speech-to-Text or DTMF (Public Preview)

``` python
max_tones_to_collect = 1 
text_to_play = "Hi, how can I help you today, you can also press 0 to speak to an agent." 
play_source = TextSource(text=text_to_play, voice_name="en-US-ElizabethNeural") 
call_automation_client.get_call_connection(call_connection_id).start_recognizing_media( 
    dtmf_max_tones_to_collect=max_tones_to_collect, 
    input_type=RecognizeInputType.SPEECH_OR_DTMF, 
    target_participant=target_participant, 
    end_silence_timeout=1, 
    play_prompt=play_source, 
    initial_silence_timeout=30, 
    interrupt_prompt=True, 
    operation_context="OpenQuestionSpeechOrDtmf",
    # Only add the speech_recognition_model_endpoint_id if you have a custom speech model you would like to use
    speech_recognition_model_endpoint_id="YourCustomSpeechModelEndpointId")  
app.logger.info("Start recognizing") 
```
> [!Note]
> If parameters aren't set, the defaults are applied where possible.

## Receiving recognize event updates

Developers can subscribe to the *RecognizeCompleted* and *RecognizeFailed* events on the webhook callback they registered for the call to create business logic in their application for determining next steps when one of the previously mentioned events occurs. 

### Example of how you can deserialize the *RecognizeCompleted* event:

``` python
if event.type == "Microsoft.Communication.RecognizeCompleted": 
    app.logger.info("Recognize completed: data=%s", event.data) 
    if event.data['recognitionType'] == "dtmf": 
        tones = event.data['dtmfResult']['tones'] 
        app.logger.info("Recognition completed, tones=%s, context=%s", tones, event.data.get('operationContext')) 
    elif event.data['recognitionType'] == "choices": 
        labelDetected = event.data['choiceResult']['label']; 
        phraseDetected = event.data['choiceResult']['recognizedPhrase']; 
        app.logger.info("Recognition completed, labelDetected=%s, phraseDetected=%s, context=%s", labelDetected, phraseDetected, event.data.get('operationContext')); 
    elif event.data['recognitionType'] == "speech": 
        text = event.data['speechResult']['speech']; 
        app.logger.info("Recognition completed, text=%s, context=%s", text, event.data.get('operationContext')); 
    else: 
        app.logger.info("Recognition completed: data=%s", event.data); 
```

### Example of how you can deserialize the *RecognizeFailed* event:

``` python
if event.type == "Microsoft.Communication.RecognizeFailed": 
    app.logger.info("Recognize failed: data=%s", event.data); 
```

### Example of how you can deserialize the *RecognizeCanceled* event:

```python
if event.type == "Microsoft.Communication.RecognizeCanceled":
    # Handle the RecognizeCanceled event according to your application logic
```
