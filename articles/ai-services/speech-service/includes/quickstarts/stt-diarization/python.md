---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 7/27/2023
ms.author: eur
---

[!INCLUDE [Header](../../common/python.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

## Set up the environment

The Speech SDK for Python is available as a [Python Package Index (PyPI) module](https://pypi.org/project/azure-cognitiveservices-speech/). The Speech SDK for Python is compatible with Windows, Linux, and macOS. 
- You must install the [Microsoft Visual C++ Redistributable for Visual Studio 2015, 2017, 2019, and 2022](/cpp/windows/latest-supported-vc-redist?view=msvc-170&preserve-view=true) for your platform. Installing this package for the first time might require a restart.
- On Linux, you must use the x64 target architecture.

Install a version of [Python from 3.7 or later](https://www.python.org/downloads/). First check the [SDK installation guide](../../../quickstarts/setup-platform.md?pivots=programming-language-python) for any more requirements. 

### Set environment variables

[!INCLUDE [Environment variables](../../common/environment-variables.md)]

## Diarization from file with conversation transcription

Follow these steps to create a new console application.

1. Open a command prompt where you want the new project, and create a new file named `conversation_transcription.py`.
1. Run this command to install the Speech SDK:  
    ```console
    pip install azure-cognitiveservices-speech
    ```
1. Copy the following code into `conversation_transcription.py`: 

    ```Python
        import os
        import time
        import azure.cognitiveservices.speech as speechsdk

        def conversation_transcriber_recognition_canceled_cb(evt: speechsdk.SessionEventArgs):
        print('Canceled event')

        def conversation_transcriber_session_stopped_cb(evt: speechsdk.SessionEventArgs):
        print('SessionStopped event')

        def conversation_transcriber_transcribed_cb(evt: speechsdk.SpeechRecognitionEventArgs):
        print('TRANSCRIBED:')
        if evt.result.reason == speechsdk.ResultReason.RecognizedSpeech:
                print('\tText={}'.format(evt.result.text))
                print('\tSpeaker ID={}'.format(evt.result.speaker_id))
        elif evt.result.reason == speechsdk.ResultReason.NoMatch:
                print('\tNOMATCH: Speech could not be TRANSCRIBED: {}'.format(evt.result.no_match_details))

        def conversation_transcriber_session_started_cb(evt: speechsdk.SessionEventArgs):
        print('SessionStarted event')

        def recognize_from_file():
        # This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
        speech_config = speechsdk.SpeechConfig(subscription=os.environ.get('SPEECH_KEY'), region=os.environ.get('SPEECH_REGION'))
        speech_config.speech_recognition_language="en-US"

        audio_config = speechsdk.audio.AudioConfig(filename="katiesteve.wav")
        conversation_transcriber = speechsdk.transcription.ConversationTranscriber(speech_config=speech_config, audio_config=audio_config)

        transcribing_stop = False
        def stop_cb(evt: speechsdk.SessionEventArgs):
                #"""callback that signals to stop continuous recognition upon receiving an event `evt`"""
                print('CLOSING on {}'.format(evt))
                nonlocal transcribing_stop
                transcribing_stop = True

        # Connect callbacks to the events fired by the convesation transcriber
        conversation_transcriber.transcribed.connect(conversation_transcriber_transcribed_cb)
        conversation_transcriber.session_started.connect(conversation_transcriber_session_started_cb)
        conversation_transcriber.session_stopped.connect(conversation_transcriber_session_stopped_cb)
        conversation_transcriber.canceled.connect(conversation_transcriber_recognition_canceled_cb)
        # stop transcribing on either session stopped or canceled events
        conversation_transcriber.session_stopped.connect(stop_cb)
        conversation_transcriber.canceled.connect(stop_cb)
        
        conversation_transcriber.start_transcribing_async()

        # Waits for completion.
        while not transcribing_stop:
                time.sleep(.5)

        conversation_transcriber.stop_transcribing_async()

        # Main

        try:
        recognize_from_file()
        except Exception as err:
        print("Encountered exception. {}".format(err))
    ```

1. Replace `katiesteve.wav` with the filepath and filename of your `.wav` file. The intent of this quickstart is to recognize speech from multiple participants in the conversation. Your audio file should contain multiple speakers. For example, you can use the [sample audio file](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/quickstart/csharp/dotnet/conversation-transcription/helloworld/katiesteve.wav) provided in the Speech SDK samples repository on GitHub.
    > [!NOTE]
    > The service performs best with at least 7 seconds of continuous audio from a single speaker. This allows the system to differentiate the speakers properly. Otherwise the Speaker ID is returned as `Unknown`.
1. To change the speech recognition language, replace `en-US` with another [supported language](~/articles/cognitive-services/speech-service/supported-languages.md). For example, `es-ES` for Spanish (Spain). The default language is `en-US` if you don't specify a language. For details about how to identify one of multiple languages that might be spoken, see [language identification](~/articles/cognitive-services/speech-service/language-identification.md). 

Run your new console application to start conversation transcription:

```console
python conversation_transcription.py
```

> [!IMPORTANT]
> Make sure that you set the `SPEECH__KEY` and `SPEECH__REGION` environment variables as described [above](#set-environment-variables). If you don't set these variables, the sample will fail with an error message.

The transcribed conversation should be output as text: 

```console
SessionStarted event
TRANSCRIBED:
        Text=Good morning, Steve.
        Speaker ID=Unknown
TRANSCRIBED:
        Text=Good morning, Katie.
        Speaker ID=Unknown
TRANSCRIBED:
        Text=Have you tried the latest real time diarization in Microsoft Speech Service which can tell you who said what in real time?
        Speaker ID=Guest-1
TRANSCRIBED:
        Text=Not yet. I've been using the batch transcription with diarization functionality, but it produces diarization result until whole audio get processed.
        Speaker ID=Guest-2
TRANSCRIBED:
        Text=Is the new feature can diarize in real time?
        Speaker ID=Guest-2
TRANSCRIBED:
        Text=Absolutely.
        Speaker ID=Guest-1
TRANSCRIBED:
        Text=That's exciting. Let me try it right now.
        Speaker ID=Guest-2
Canceled event
CLOSING on ConversationTranscriptionCanceledEventArgs(session_id=606e8b5e65b94419b824d224127d9f92, result=ConversationTranscriptionResult(result_id=21d17c5738b442f8a7d428d0d5363fa8, speaker_id=, text=, reason=ResultReason.Canceled))  
SessionStopped event
CLOSING on SessionEventArgs(session_id=606e8b5e65b94419b824d224127d9f92)
```

Speakers are identified as Guest-1, Guest-2, and so on, depending on the number of speakers in the conversation.

> [!NOTE]
> The service performs best with at least 7 seconds of continuous audio from a single speaker. This allows the system to differentiate the speakers properly. Otherwise the Speaker ID is returned as `Unknown`.

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]
