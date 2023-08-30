---
author: jyotsna-ravi
ms.service: cognitive-services
ms.topic: include
ms.date: 11/11/2022
ms.author: jyravi
---

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

## Set up the environment

Before you can do anything, install the Speech SDK for Python. You can [install the Speech SDK](../../../quickstarts/setup-platform.md?pivots=programming-language-python) from PyPI by running `pip install azure-cognitiveservices-speech`.
 

## Create voice signatures

If you want to enroll user profiles, the first step is to create voice signatures for the meeting participants so that they can be identified as unique speakers. This isn't required if you don't want to use pre-enrolled user profiles to identify specific participants.

The input `.wav` audio file for creating voice signatures must be 16-bit, 16-kHz sample rate, in single channel (mono) format. The recommended length for each audio sample is between 30 seconds and two minutes. An audio sample that is too short results in reduced accuracy when recognizing the speaker. The `.wav` file should be a sample of one person's voice so that a unique voice profile is created.

The following example shows how to create a voice signature by [using the REST API](https://aka.ms/cts/signaturegenservice) in Python. You must insert your `subscriptionKey`, `region`, and the path to a sample `.wav` file.

```python
import requests
from scipy.io.wavfile import read
import json

speech_key, service_region = "your-subscription-key", "your-region"
endpoint = f"https://signature.{service_region}.cts.speech.microsoft.com/api/v1/Signature/GenerateVoiceSignatureFromByteArray"

#Enrollment audio for each speaker. In this example, two speaker enrollment audio files are added.
enrollment_audio_speaker1 = "enrollment-audio-speaker1.wav"
enrollment_audio_speaker2 = "enrollment-audio-speaker2.wav"

def voice_data_converter(enrollment_audio):
  with open(enrollment_audio, "rb") as wav_file:
    input_wav = wav_file.read()
  return input_wav
  
def voice_signature_creator(endpoint, speech_key, enrollment_audio):
  data = voice_data_converter(enrollment_audio)
  headers = {"Ocp-Apim-Subscription-Key":speech_key}
  r = requests.post(url = endpoint,headers = headers, data = data)
  voice_signature_string = json.dumps(r.json()['Signature'])
  return voice_signature_string

voice_signature_user1 = voice_signature_creator(endpoint, speech_key, enrollment_audio_speaker1)
voice_signature_user2 = voice_signature_creator(endpoint, speech_key, enrollment_audio_speaker2)
```

You can use these two voice_signature_string as input to the variables `voice_signature_user1` and `voice_signature_user2` later in the sample code.

> [!NOTE]
> Voice signatures can **only** be created using the REST API.

## Transcribe meetings

The following sample code demonstrates how to transcribe meetings in real-time for two speakers. It assumes you've already created voice signature strings for each speaker as shown previously. Substitute real information for `subscriptionKey`, `region`, and the path `filepath` for the audio you want to transcribe.

If you don't use pre-enrolled user profiles, it takes a few more seconds to complete the first recognition of unknown users as speaker1, speaker2, etc.

> [!NOTE]
> Make sure the same `subscriptionKey` is used across your application for signature creation, or you will encounter errors. 

Here's what the sample does:

* Creates speech configuration with subscription information.
* Create audio configuration using the push stream.
* Creates a `MeetingTranscriber` and Subscribe to the events fired by the meeting transcriber.
* Meeting identifier for creating meeting.
* Adds participants to the meeting. The strings `voiceSignatureStringUser1` and `voiceSignatureStringUser2` should come as output from the previous steps.
* Read the whole wave files at once and stream it to SDK and begins transcription.
* If you want to differentiate speakers without providing voice samples, you enable the `DifferentiateGuestSpeakers` feature as in [Meeting Transcription Overview](../../../meeting-transcription.md). 

If speaker identification or differentiate is enabled, then even if you have already received `transcribed` results, the service is still evaluating them by accumulated audio information. If the service finds that any previous result was assigned an incorrect `speakerId`, then a nearly identical `Transcribed` result is sent again, where only the `speakerId` and `UtteranceId` are different. Since the `UtteranceId` format is `{index}_{speakerId}_{Offset}`, when you receive a `transcribed` result, you could use `UtteranceId` to determine if the current `transcribed` result is going to correct a previous one. Your client or UI logic could decide behaviors, like overwriting previous output, or to ignore the latest result.

```python
import azure.cognitiveservices.speech as speechsdk
import time
import uuid
from scipy.io import wavfile

speech_key, service_region="your-subscription-key","your-region"
meetingfilename= "audio-file-to-transcribe.wav" # 8 channel, 16 bits, 16kHz audio

def meeting_transcription():
    
    speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=service_region)
    speech_config.set_property_by_name("ConversationTranscriptionInRoomAndOnline", "true")
    # If you want to differentiate speakers without providing voice samples, uncomment the following line.
    # speech_config.set_property_by_name("DifferentiateGuestSpeakers", "true")

    channels = 8
    bits_per_sample = 16
    samples_per_second = 16000
    
    wave_format = speechsdk.audio.AudioStreamFormat(samples_per_second, bits_per_sample, channels)
    stream = speechsdk.audio.PushAudioInputStream(stream_format=wave_format)
    audio_config = speechsdk.audio.AudioConfig(stream=stream)

    transcriber = speechsdk.transcription.MeetingTranscriber(audio_config)

    meeting_id = str(uuid.uuid4())
    meeting = speechsdk.transcription.Meeting(speech_config, meeting_id)
    done = False

    def stop_cb(evt: speechsdk.SessionEventArgs):
        """callback that signals to stop continuous transcription upon receiving an event `evt`"""
        print('CLOSING {}'.format(evt))
        nonlocal done
        done = True
        
    transcriber.transcribed.connect(lambda evt: print('TRANSCRIBED: {}'.format(evt)))
    transcriber.session_started.connect(lambda evt: print('SESSION STARTED: {}'.format(evt)))
    transcriber.session_stopped.connect(lambda evt: print('SESSION STOPPED {}'.format(evt)))
    transcriber.canceled.connect(lambda evt: print('CANCELED {}'.format(evt)))
    # stop continuous transcription on either session stopped or canceled events
    transcriber.session_stopped.connect(stop_cb)
    transcriber.canceled.connect(stop_cb)

    # Note user voice signatures are not required for speaker differentiation.
    # Use voice signatures when adding participants when more enhanced speaker identification is required.
    user1 = speechsdk.transcription.Participant("user1@example.com", "en-us", voice_signature_user1)
    user2 = speechsdk.transcription.Participant("user2@example.com", "en-us", voice_signature_user2)

    meeting.add_participant_async(user1).get()
    meeting.add_participant_async(user2).get()
    transcriber.join_meeting_async(meeting).get()
    transcriber.start_transcribing_async()
    
    sample_rate, wav_data = wavfile.read(meetingfilename)
    stream.write(wav_data.tobytes())
    stream.close()
    while not done:
        time.sleep(.5)

    transcriber.stop_transcribing_async()
```


