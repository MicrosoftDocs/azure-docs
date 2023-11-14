---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 08/24/2023
ms.author: eur
---

[!INCLUDE [Header](../../common/python.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

## Set up the environment

The Speech SDK for Python is available as a [Python Package Index (PyPI) module](https://pypi.org/project/azure-cognitiveservices-speech/). The Speech SDK for Python is compatible with Windows, Linux, and macOS.

- For Windows, install the [Microsoft Visual C++ Redistributable for Visual Studio 2015, 2017, 2019, and 2022](/cpp/windows/latest-supported-vc-redist?view=msvc-170&preserve-view=true) for your platform. Installing this package for the first time might require a restart.
- On Linux, you must use the x64 target architecture.

Install a version of [Python from 3.7 or later](https://www.python.org/downloads/). For other requirements, see [Install the Speech SDK](../../../quickstarts/setup-platform.md?pivots=programming-language-python).

### Set environment variables

[!INCLUDE [Environment variables](../../common/environment-variables.md)]

## Recognize speech from a microphone

Follow these steps to create a console application.

1. Open a command prompt where you want the new project, and create a new file named *speech_recognition.py*.
1. Run this command to install the Speech SDK:  

   ```console
   pip install azure-cognitiveservices-speech
   ```

1. Copy the following code into *speech_recognition.py*:

   ```Python
   import os
   import azure.cognitiveservices.speech as speechsdk

   def recognize_from_microphone():
       # This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
       speech_config = speechsdk.SpeechConfig(subscription=os.environ.get('SPEECH_KEY'), region=os.environ.get('SPEECH_REGION'))
       speech_config.speech_recognition_language="en-US"

       audio_config = speechsdk.audio.AudioConfig(use_default_microphone=True)
       speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)

       print("Speak into your microphone.")
       speech_recognition_result = speech_recognizer.recognize_once_async().get()

       if speech_recognition_result.reason == speechsdk.ResultReason.RecognizedSpeech:
           print("Recognized: {}".format(speech_recognition_result.text))
       elif speech_recognition_result.reason == speechsdk.ResultReason.NoMatch:
           print("No speech could be recognized: {}".format(speech_recognition_result.no_match_details))
       elif speech_recognition_result.reason == speechsdk.ResultReason.Canceled:
           cancellation_details = speech_recognition_result.cancellation_details
           print("Speech Recognition canceled: {}".format(cancellation_details.reason))
           if cancellation_details.reason == speechsdk.CancellationReason.Error:
               print("Error details: {}".format(cancellation_details.error_details))
               print("Did you set the speech resource key and region values?")

   recognize_from_microphone()
   ```

1. To change the speech recognition language, replace `en-US` with another [supported language](~/articles/ai-services/speech-service/language-support.md). For example, use `es-ES` for Spanish (Spain). If you don't specify a language, the default is `en-US`. For details about how to identify one of multiple languages that might be spoken, see [language identification](~/articles/ai-services/speech-service/language-identification.md). 

1. Run your new console application to start speech recognition from a microphone:

   ```console
   python speech_recognition.py
   ```

   > [!IMPORTANT]
   > Make sure that you set the `SPEECH_KEY` and `SPEECH_REGION` environment variables as described in [Set environment variables](#set-environment-variables). If you don't set these variables, the sample fails with an error message.

1. Speak into your microphone when prompted. What you speak should appear as text:

   ```output
   Speak into your microphone.
   RECOGNIZED: Text=I'm excited to try speech to text.
   ```

## Remarks

Here are some other considerations:

- This example uses the `recognize_once_async` operation to transcribe utterances of up to 30 seconds, or until silence is detected. For information about continuous recognition for longer audio, including multi-lingual conversations, see [How to recognize speech](~/articles/ai-services/speech-service/how-to-recognize-speech.md).
- To recognize speech from an audio file, use `filename` instead of `use_default_microphone`:

   ```python
   audio_config = speechsdk.audio.AudioConfig(filename="YourAudioFile.wav")
   ```

- For compressed audio files such as MP4, install GStreamer and use `PullAudioInputStream` or `PushAudioInputStream`. For more information, see [How to use compressed input audio](~/articles/ai-services/speech-service/how-to-use-codec-compressed-audio-input-streams.md).

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]
