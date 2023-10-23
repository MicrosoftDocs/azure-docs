---
title: include file
description: Python play audio how-to guide
services: azure-communication-services
author: Kunaal Punjabi
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 08/10/2023
ms.topic: include
ms.topic: include file
ms.author: kpunjabi
---

## Prerequisites

- Azure account with an active subscription, for details see [Create an account for free.](https://azure.microsoft.com/free/)
- Azure Communication Services resource. See [Create an Azure Communication Services resource](../../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp). Save the connection string for this resource. 
- Create a new web service application using the [Call Automation SDK](../../../quickstarts/call-automation/callflows-for-customer-interactions.md).
- Have Python installed, you can install from the [official site](https://www.python.org/).

### For AI features (Public preview)
- Create and connect [Azure AI services to your Azure Communication Services resource](../../../concepts/call-automation/azure-communication-services-azure-cognitive-services-integration.md).
- Create a [custom subdomain](../../../../ai-services/cognitive-services-custom-subdomains.md) for your Azure AI services resource. 


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

Run your application using Python with the following command to execute code. 

``` console
python app.py
```

## (Optional) Prepare your audio file if you wish to use audio files for playing prompts

Create an audio file, if you don't already have one, to use for playing prompts and messages to participants. The audio file must be hosted in a location that is accessible to ACS with support for authentication. Keep a copy of the URL available for you to use when requesting to play the audio file. The audio file that ACS supports needs to be **WAV, mono and 16 KHz sample rate**. 

You can test creating your own audio file using our [Speech synthesis with Audio Content Creation tool](../../../../ai-services/Speech-Service/how-to-audio-content-creation.md).

## (Optional) Connect your Azure Cognitive Service to your Azure Communication Service (Public Preview)

If you would like to use Text-To-Speech capabilities, then it's required for you to connect your [Azure Cognitive Service to your Azure Communication Service](../../../concepts/call-automation/azure-communication-services-azure-cognitive-services-integration.md).

## Establish a call

By this point you should be familiar with starting calls, if you need to learn more about making a call, follow our [quickstart](../../../quickstarts/call-automation/quickstart-make-an-outbound-call.md). You can also use the code snippet provided here to understand how to answer a call.

```python
call_automation_client.answer_call(
    incoming_call_context="<Incoming call context>",
    callback_url="<https://sample-callback-uri>",
    cognitive_services_endpoint=COGNITIVE_SERVICE_ENDPOINT,
)
```

## Play audio

Once the call has been established, there are multiple options for how you may wish to play the audio. You can play audio to the participant that has joined the call or play audio to all the participants in the call.

### Play source - Audio file

To play audio to participants using audio files, you need to make sure the audio file is a WAV file, mono and 16 KHz. To play audio files, you need to make sure you provide ACS with a uri to a file you host in a location where ACS can access it. The FileSource type in our SDK can be used to specify audio files for the play action.

``` python
play_source = FileSource(url=audioUri)
```

### Play source - Text-To-Speech (Public Preview)

To play audio using Text-To-Speech through Azure AI services, you need to provide the text you wish to play, as well either the SourceLocale, and VoiceKind or the VoiceName you wish to use. We support all voice names supported by Azure AI services, full list [here](../../../../ai-services/Speech-Service/language-support.md?tabs=tts).

``` python
text_to_play = "Welcome to Contoso"

# Provide SourceLocale and VoiceKind to select an appropriate voice. 
play_source = TextSource(
    text=text_to_play, source_locale="en-US", voice_kind=VoiceKind.FEMALE
)
play_to = [target_participant]
call_automation_client.get_call_connection(call_connection_id).play_media(
    play_source=play_source, play_to=play_to
) 
```

``` python
text_to_play = "Welcome to Contoso"

# Provide VoiceName to select a specific voice. 
play_source = TextSource(text=text_to_play, voice_name="en-US-ElizabethNeural")
play_to = [target_participant]
call_automation_client.get_call_connection(call_connection_id).play_media(
    play_source=play_source, play_to=play_to
)
```

### Play source - Text-To-Speech with SSML (Public Preview)

If you want to customize your Text-To-Speech output even more with Azure AI services you can use [Speech Synthesis Markup Language SSML](../../../../ai-services/Speech-Service/speech-synthesis-markup.md) when invoking your play action through Call Automation. With SSML you can fine-tune the pitch, pause, improve pronunciation, change speaking rate, adjust volume and attribute multiple voices.

``` python
ssmlToPlay = '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US"><voice name="en-US-JennyNeural">Hello World!</voice></speak>'

play_source = SsmlSource(ssml_text=ssmlToPlay)

play_to = [target_participant]

call_automation_client.get_call_connection(call_connection_id).play_media(
    play_source=play_source, play_to=play_to
)
```

### Custom voice models
If you wish to enhance your prompts more and include custom voice models, the play action Text-To-Speech now supports these custom voices. These are a great option if you are trying to give customers a more local, personalized experience or have situations where the default models may not cover the words and accents you're trying to pronounce. To learn more about creating and deploying custom models you can read this [guide](../../../../ai-services/speech-service/how-to-custom-voice.md).

**Custom voice names regular text exmaple**
``` python
text_to_play = "Welcome to Contoso"

# Provide VoiceName to select a specific voice. 
play_source = TextSource(text=text_to_play, voice_name="YourCustomVoiceName", custom_voice_endpoint_id = "YourCustomEndpointId")
play_to = [target_participant]
call_automation_client.get_call_connection(call_connection_id).play_media(
    play_source=play_source, play_to=play_to
)
```
**Custom voice names SSML example**
``` python
ssmlToPlay = '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US"><voice name="YourCustomVoiceName">Hello World!</voice></speak>'

play_source = SsmlSource(ssml_text=ssmlToPlay, custom_voice_endpoint_id="YourCustomEndpointId")

play_to = [target_participant]

call_automation_client.get_call_connection(call_connection_id).play_media(
    play_source=play_source, play_to=play_to
)
```

Once you've decided on which playSource you wish to use for playing audio, you can then choose whether you want to play it to a specific participant or to all participants.

## Play audio - All participants

Play a prerecorded audio file to all participants in the call.

``` python 
text_to_play = "Welcome to Contoso"

play_source = TextSource(text=text_to_play, voice_name="en-US-ElizabethNeural")

call_automation_client.get_call_connection(call_connection_id).play_media(
    play_source=play_source
)
```

## Play audio - Specific participant

Play a prerecorded audio file to a specific participant in the call.

``` python 
play_to = [target_participant]

call_automation_client.get_call_connection(call_connection_id).play_media(
    play_source=play_source, play_to=play_to
)
```

## Play audio on loop

You can use the loop option to play hold music that loops until your application is ready to accept the caller. Or progress the caller to the next logical step based on your applications business logic.

``` python
text_to_play = "Welcome to Contoso"

play_source = TextSource(text=text_to_play, voice_name="en-US-ElizabethNeural")

call_automation_client.get_call_connection(call_connection_id).play_media(
    play_source=play_source, loop=True
)
```

## Enhance play with audio file caching

If you're playing the same audio file multiple times, your application can provide ACS with the sourceID for the audio file. ACS caches this audio file for 1 hour. 
> [!Note]
> Caching audio files isn't suitable for dynamic prompts. If you change the URL provided to ACS, it does not update the cached URL straight away. The update will occur after the existing cache expires.

``` python
play_source = FileSource(url=audioUri, play_source_cache_id="<playSourceId>")

play_to = [target_participant]

call_automation_client.get_call_connection(call_connection_id).play_media(
    play_source=play_source, play_to=play_to
)
```

## Handle play action event updates 

Your application receives action lifecycle event updates on the callback URL that was provided to Call Automation service at the time of answering the call. 

### Example of how you can deserialize the *PlayCompleted* event:

```python 
if event.type == "Microsoft.Communication.PlayCompleted":

    app.logger.info("Play completed, context=%s", event.data.get("operationContext"))
```

### Example of how you can deserialize the *PlayFailed* event:

```python
if event.type == "Microsoft.Communication.PlayFailed":

    app.logger.info("Play failed: data=%s", event.data)
```

To learn more about other supported events, visit the [Call Automation overview document](../../../concepts/call-automation/call-automation.md#call-automation-webhook-events).

## Cancel play action

Cancel all media operations, all pending media operations are canceled. This action also cancels other queued play actions.

```python
call_automation_client.get_call_connection(
    call_connection_id
).cancel_all_media_operations()
```

### Example of how you can deserialize the *PlayCanceled* event:

```python
if event.type == "Microsoft.Communication.PlayCanceled":

    app.logger.info("Play canceled, context=%s", event.data.get("operationContext"))
```
