---
title: include file
description: Python play audio how-to guide
services: azure-communication-services
author: Kunaal Punjabi
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 05/28/2023
ms.topic: include
ms.topic: include file
ms.author: kpunjabi
---

## Prerequisites

- Azure account with an active subscription, for details see [Create an account for free.](https://azure.microsoft.com/free/)
- Azure Communication Services resource. See [Create an Azure Communication Services resource](../../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp). Save the connection string for this resource. 
- Create a new web service application using the [Call Automation SDK](../../../quickstarts/call-automation/callflows-for-customer-interactions.md).
- Have Python installed, you can install from the [official site](https://www.python.org/).

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

## Prepare your audio file

If you don't already have an audio file, you can create a new one to use for playing prompts and messages to participants. The audio file must be hosted in a location that is accessible to ACS with support for authentication. Keep a copy of the URL available for you to use when requesting to play the audio file. The audio file that ACS supports needs to be **WAV, mono and 16 KHz sample rate**. 

You can test creating your own audio file using our [Speech synthesis with Audio Content Creation tool](../../../../ai-services/Speech-Service/how-to-audio-content-creation.md).

## Establish a call

By this point you should be familiar with starting calls, if you need to learn more about making a call, follow our [quickstart](../../../quickstarts/call-automation/quickstart-make-an-outbound-call.md). In this quickstart, we'll create an outbound call.

## Play audio

Once the call has been established, there are multiple options for how you may wish to play the audio. You can play audio to the participant that has joined the call or play audio to all the participants in the call.

## Play source - Audio file

To play audio to participants using audio files, you need to make sure the audio file is a WAV file, mono and 16 KHz. You need to make sure you provide ACS with a uri to a file you host in a location where ACS can access it. The FileSource type in our SDK can be used to specify audio files for the play action.

```python
file_source = FileSource(url= "https://example.com/audio/test.wav")
```

## Play audio - All participants

Play a pre-recorded audio file to all participants in the call.

``` python 
call_connection.play_media_to_all(file_source)
```

## Play audio - Specific participant

Play a pre-recorded audio file to a specific participant in the call.

``` python 
call_connection.play_media(
    play_source=file_source,
    play_to=[target_participant]
)
```

## Play audio on loop

You can use the loop option to play hold music that loops until your application is ready to accept the caller. Or progress the caller to the next logical step based on your applications business logic.

``` python
call_connection.play_media(
    play_source=file_source,
    play_to=[ target_participant ],
    loop=True
)
```

## Enhance play with audio file caching

If you're playing the same audio file multiple times, your application can provide ACS with the sourceID for the audio file. ACS caches this audio file for 1 hour. **Note:** Caching audio files isn't suitable for dynamic prompts. If you change the URL provided to ACS, it will not update the cached URL straight away. The update will occur after the existing cache expires.

``` python
call_connection.play_media(
    play_source=FileSource(url= https://example.com/audio/test.wav,
        play_source_cache_id='example_source'
    ),
    play_to=[ PhoneNumberIdentifier(target_phone_number) ],
    loop=True
)
```

## Handle play action event updates 

Your application receives action lifecycle event updates on the callback URL that was provided to Call Automation service at the time of answering the call. 

### Example of how you can deserialize the *PlayCompleted* event:

```python 
if event['type'] == "Microsoft.Communication.PlayCompleted":
    # Handle the PlayCompleted event according to your application logic
```

### Example of how you can deserialize the *PlayFailed* event:

```python
if event['type'] == "Microsoft.Communication.PlayFailed":
    play_failed_event_message = (event['data']['resultInformation']['message'])
    # Handle the PlayFailed event according to your application logic
```

To learn more about other supported events, visit the [Call Automation overview document](../../../concepts/call-automation/call-automation.md#call-automation-webhook-events).

## Cancel play action

Cancel all media operations, all pending media operations are canceled. This action also cancels other queued play actions.

```python
call_connection.cancel_all_media_operations()
```

### Example of how you can deserialize the *PlayCanceled* event:

```python
if event['type'] == "Microsoft.Communication.PlayCanceled":
    # Handle the PlayCanceled event according to your application logic
```
