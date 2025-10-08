---
title: include file
description: Python Recognize action how-to guide
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
- Azure account with an active subscription, for details see [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- Azure Communication Services resource. See [Create an Azure Communication Services resource](../../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp). Note the connection string for this resource. 
- Create a new web service application using the [Call Automation SDK](../../../quickstarts/call-automation/callflows-for-customer-interactions.md).
- Install Python from [Python.org](https://www.python.org/).

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

## Create a new Python application

### Set up a Python virtual environment for your project

``` console
python -m venv play-audio-app
```

### Activate your virtual environment

On Windows, use the following command:

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

Create your application file in your project directory, for example, name it `app.py`. Write your Python code in this file.  

Run your application using Python with the following command.

``` console
python app.py
```

## Establish a call

By this point you should be familiar with starting calls. For more information about making a call, see [Quickstart: Make and outbound call](../../../quickstarts/call-automation/quickstart-make-an-outbound-call.md).

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

For speech-to-text flows, the Call Automation Recognize action also supports the use of [custom speech models](/azure/machine-learning/tutorial-train-model). Features like custom speech models can be useful when you're building an application that needs to listen for complex words that the default speech-to-text models may not understand. One example is when you're building an application for the telemedical industry and your virtual agent needs to be able to recognize medical terms. You can learn more in [Create a custom speech project](/azure/ai-services/speech-service/speech-services-quotas-and-limits).

### Speech-to-Text Choices 
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

### Speech-to-Text 

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

### Speech-to-Text or DTMF 

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

### Real-time language identification (Preview)

With the additional of real-time language identification, developers can automatically detect spoken languages to enable natural, human-like communications and eliminate manual language selection by the end users. 

``` python
text_to_play = "Hi, how can I help you today?"
play_source = TextSource(text=text_to_play, voice_name="en-US-ElizabethNeural")

connection_client = call_automation_client.get_call_connection(call_connection_id)

recognize_result = await connection_client.start_recognizing_media(
    input_type=RecognizeInputType.SPEECH,
    target_participant=PhoneNumberIdentifier(caller_id),
    end_silence_timeout=15,
    play_prompt=play_source,
    operation_context="OpenQuestionSpeech",

    # Enable language identification
    speech_language=["en-US", "es-ES", "hi-IN"],

    # Only add the speech_recognition_model_endpoint_id if you have a custom speech model you would like to use
    speech_recognition_model_endpoint_id="YourCustomSpeechModelEndpointId"
)
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

``` python
text_to_play = "Hi, how can I help you today?"
play_source = TextSource(text=text_to_play, voice_name="en-US-ElizabethNeural")

connection_client = call_automation_client.get_call_connection(call_connection_id)

recognize_result = await connection_client.start_recognizing_media(
    input_type=RecognizeInputType.SPEECH,
    target_participant=PhoneNumberIdentifier(caller_id),
    end_silence_timeout=15,
    play_prompt=play_source,
    operation_context="OpenQuestionSpeech",
    
    # Enable sentiment analysis
    IsSentimentAnalysisEnabled = true,

    # Only add the speech_recognition_model_endpoint_id if you have a custom speech model you would like to use
    speech_recognition_model_endpoint_id="YourCustomSpeechModelEndpointId"
)
```

## Receiving recognize event updates

Developers can subscribe to `RecognizeCompleted` and `RecognizeFailed` events on the registered webhook callback. Use this callback with business logic in your application to determine next steps when one of the events occurs. 

### Example of how you can deserialize the *RecognizeCompleted* event:

``` python
if event.type == "Microsoft.Communication.RecognizeCompleted":
    print(f"Received RecognizeCompleted event for connection id: {call_connection_id}")

    recognition_type = event.data.get("recognitionType")

    if recognition_type == "dtmf":
        tones = event.data["dtmfResult"]["tones"]
        context = event.data["operationContext"]
        print(f"Recognition completed, tones={tones}, context={context}")

    elif recognition_type == "choices":
        choice_result = event.data["choiceResult"]
        label_detected = choice_result["label"]
        phrase_detected = choice_result["recognizedPhrase"]
        language_identified = choice_result.get("languageIdentified")
        sentiment = choice_result.get("sentimentAnalysisResult", {}).get("sentiment")

        print(f"Recognition completed, labelDetected={label_detected}, phraseDetected={phrase_detected}, context={event.data['operationContext']}")
        print(f"Language Identified: {language_identified}")
        print(f"Sentiment: {sentiment}")

    elif recognition_type == "speech":
        speech_result = event.data["speechResult"]
        text = speech_result["speech"]
        language_identified = speech_result.get("languageIdentified")
        sentiment = speech_result.get("sentimentAnalysisResult", {}).get("sentiment")

        print(f"Recognition completed, text={text}, context={event.data['operationContext']}")
        print(f"Language Identified: {language_identified}")
        print(f"Sentiment: {sentiment}")

    else:
        print(f"Recognition completed: data={event.data}")
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
