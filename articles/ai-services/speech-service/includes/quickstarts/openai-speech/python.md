---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 03/07/2023
ms.author: eur
---

[!INCLUDE [Header](../../common/python.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites-openai.md)]

## Set up the environment

The Speech SDK for Python is available as a [Python Package Index (PyPI) module](https://pypi.org/project/azure-cognitiveservices-speech/). The Speech SDK for Python is compatible with Windows, Linux, and macOS. 
- You must install the [Microsoft Visual C++ Redistributable for Visual Studio 2015, 2017, 2019, and 2022](/cpp/windows/latest-supported-vc-redist?view=msvc-170&preserve-view=true) for your platform. Installing this package for the first time might require a restart.
- On Linux, you must use the x64 target architecture.

Install a version of [Python from 3.7 or later](https://www.python.org/downloads/). First check the [SDK installation guide](../../../quickstarts/setup-platform.md?pivots=programming-language-python) for any more requirements. 

Install the following Python libraries: `os`, `requests`, `json`

### Set environment variables

This example requires environment variables named `OPEN_AI_KEY`, `OPEN_AI_ENDPOINT`, `SPEECH_KEY`, and `SPEECH_REGION`.

[!INCLUDE [Environment variables](../../common/environment-variables-openai.md)]

## Recognize speech from a microphone

Follow these steps to create a new console application.

1. Open a command prompt where you want the new project, and create a new file named `openai-speech.py`.
1. Run this command to install the Speech SDK:  
    ```console
    pip install azure-cognitiveservices-speech
    ```
1. Run this command to install the OpenAI SDK:  
    ```console
    pip install openai
    ```
    > [!NOTE]
    > This library is maintained by OpenAI (not Microsoft Azure). Refer to the [release history](https://github.com/openai/openai-python/releases) or the [version.py commit history](https://github.com/openai/openai-python/commits/main/openai/version.py) to track the latest updates to the library.

1. Copy the following code into `openai-speech.py`: 

    ```Python
    import os
    import azure.cognitiveservices.speech as speechsdk
    import openai
    
    # This example requires environment variables named "OPEN_AI_KEY" and "OPEN_AI_ENDPOINT"
    # Your endpoint should look like the following https://YOUR_OPEN_AI_RESOURCE_NAME.openai.azure.com/
    openai.api_key = os.environ.get('OPEN_AI_KEY')
    openai.api_base =  os.environ.get('OPEN_AI_ENDPOINT')
    openai.api_type = 'azure'
    openai.api_version = '2022-12-01'
    
    # This will correspond to the custom name you chose for your deployment when you deployed a model.
    deployment_id='text-davinci-003' 
    
    # This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
    speech_config = speechsdk.SpeechConfig(subscription=os.environ.get('SPEECH_KEY'), region=os.environ.get('SPEECH_REGION'))
    audio_output_config = speechsdk.audio.AudioOutputConfig(use_default_speaker=True)
    audio_config = speechsdk.audio.AudioConfig(use_default_microphone=True)
    
    # Should be the locale for the speaker's language.
    speech_config.speech_recognition_language="en-US"
    speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)
    
    # The language of the voice that responds on behalf of Azure OpenAI.
    speech_config.speech_synthesis_voice_name='en-US-JennyMultilingualNeural'
    speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_output_config)
    
    # Prompts Azure OpenAI with a request and synthesizes the response.
    def ask_openai(prompt):
    
        # Ask Azure OpenAI
        response = openai.Completion.create(engine=deployment_id, prompt=prompt, max_tokens=100)
        text = response['choices'][0]['text'].replace('\n', ' ').replace(' .', '.').strip()
        print('Azure OpenAI response:' + text)
        
        # Azure text to speech output
        speech_synthesis_result = speech_synthesizer.speak_text_async(text).get()
    
        # Check result
        if speech_synthesis_result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
            print("Speech synthesized to speaker for text [{}]".format(text))
        elif speech_synthesis_result.reason == speechsdk.ResultReason.Canceled:
            cancellation_details = speech_synthesis_result.cancellation_details
            print("Speech synthesis canceled: {}".format(cancellation_details.reason))
            if cancellation_details.reason == speechsdk.CancellationReason.Error:
                print("Error details: {}".format(cancellation_details.error_details))
    
    # Continuously listens for speech input to recognize and send as text to Azure OpenAI
    def chat_with_open_ai():
        while True:
            print("Azure OpenAI is listening. Say 'Stop' or press Ctrl-Z to end the conversation.")
            try:
                # Get audio from the microphone and then send it to the TTS service.
                speech_recognition_result = speech_recognizer.recognize_once_async().get()
    
                # If speech is recognized, send it to Azure OpenAI and listen for the response.
                if speech_recognition_result.reason == speechsdk.ResultReason.RecognizedSpeech:
                    if speech_recognition_result.text == "Stop.": 
                        print("Conversation ended.")
                        break
                    print("Recognized speech: {}".format(speech_recognition_result.text))
                    ask_openai(speech_recognition_result.text)
                elif speech_recognition_result.reason == speechsdk.ResultReason.NoMatch:
                    print("No speech could be recognized: {}".format(speech_recognition_result.no_match_details))
                    break
                elif speech_recognition_result.reason == speechsdk.ResultReason.Canceled:
                    cancellation_details = speech_recognition_result.cancellation_details
                    print("Speech Recognition canceled: {}".format(cancellation_details.reason))
                    if cancellation_details.reason == speechsdk.CancellationReason.Error:
                        print("Error details: {}".format(cancellation_details.error_details))
            except EOFError:
                break
    
    # Main
    
    try:
        chat_with_open_ai()
    except Exception as err:
        print("Encountered exception. {}".format(err))
    ```
1. To increase or decrease the number of tokens returned by Azure OpenAI, change the `max_tokens` parameter. For more information tokens and cost implications, see [Azure OpenAI tokens](/azure/ai-services/openai/overview#tokens) and [Azure OpenAI pricing](https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/).

Run your new console application to start speech recognition from a microphone:

```console
python openai-speech.py
```

> [!IMPORTANT]
> Make sure that you set the `OPEN_AI_KEY`, `OPEN_AI_ENDPOINT`, `SPEECH_KEY` and `SPEECH_REGION` environment variables as described [previously](#set-environment-variables). If you don't set these variables, the sample will fail with an error message.

Speak into your microphone when prompted. The console output includes the prompt for you to begin speaking, then your request as text, and then the response from Azure OpenAI as text. The response from Azure OpenAI should be converted from text to speech and then output to the default speaker.

```console
PS C:\dev\openai\python> python.exe .\openai-speech.py
Azure OpenAI is listening. Say 'Stop' or press Ctrl-Z to end the conversation.
Recognized speech:Make a comma separated list of all continents.
Azure OpenAI response:Africa, Antarctica, Asia, Australia, Europe, North America, South America
Speech synthesized to speaker for text [Africa, Antarctica, Asia, Australia, Europe, North America, South America]
Azure OpenAI is listening. Say 'Stop' or press Ctrl-Z to end the conversation.
Recognized speech: Make a comma separated list of 1 Astronomical observatory for each continent. A list should include each continent name in parentheses.
Azure OpenAI response:Mauna Kea Observatories (North America), La Silla Observatory (South America), Tenerife Observatory (Europe), Siding Spring Observatory (Australia), Beijing Xinglong Observatory (Asia), Naukluft Plateau Observatory (Africa), Rutherford Appleton Laboratory (Antarctica)
Speech synthesized to speaker for text [Mauna Kea Observatories (North America), La Silla Observatory (South America), Tenerife Observatory (Europe), Siding Spring Observatory (Australia), Beijing Xinglong Observatory (Asia), Naukluft Plateau Observatory (Africa), Rutherford Appleton Laboratory (Antarctica)]
Azure OpenAI is listening. Say 'Stop' or press Ctrl-Z to end the conversation.
Conversation ended.
PS C:\dev\openai\python> 
```

## Remarks
Now that you've completed the quickstart, here are some more considerations:

- To change the speech recognition language, replace `en-US` with another [supported language](~/articles/ai-services/speech-service/language-support.md). For example, `es-ES` for Spanish (Spain). The default language is `en-US` if you don't specify a language. For details about how to identify one of multiple languages that might be spoken, see [language identification](~/articles/ai-services/speech-service/language-identification.md). 
- To change the voice that you hear, replace `en-US-JennyMultilingualNeural` with another [supported voice](~/articles/ai-services/speech-service/language-support.md#prebuilt-neural-voices). If the voice doesn't speak the language of the text returned from Azure OpenAI, the Speech service doesn't output synthesized audio.
- To use a different [model](/azure/ai-services/openai/concepts/models#model-summary-table-and-region-availability), replace `text-davinci-003` with the ID of another [deployment](/azure/ai-services/openai/how-to/create-resource#deploy-a-model). Keep in mind that the deployment ID isn't necessarily the same as the model name. You named your deployment when you created it in [Azure OpenAI Studio](https://oai.azure.com/).
- Azure OpenAI also performs content moderation on the prompt inputs and generated outputs. The prompts or responses may be filtered if harmful content is detected. For more information, see the [content filtering](/azure/ai-services/openai/concepts/content-filter) article.

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]
