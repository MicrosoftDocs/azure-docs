---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 01/16/2022
ms.author: eur
---

[!INCLUDE [Header](../../common/python.md)]

[!INCLUDE [Introduction](intro.md)]

## Select synthesis language and voice

The text to speech feature in the Speech service supports more than 270 voices and more than 110 languages and variants. You can get the [full list](../../../language-support.md?tabs=tts) or try them in the [Voice Gallery](https://speech.microsoft.com/portal/voicegallery).

Specify the language or voice of `SpeechConfig` to match your input text and use the wanted voice:

```python
# Set either the `SpeechSynthesisVoiceName` or `SpeechSynthesisLanguage`.
speech_config.speech_synthesis_language = "en-US" 
speech_config.speech_synthesis_voice_name ="en-US-JennyNeural"
```

All neural voices are multilingual and fluent in their own language and English. For example, if the input text in English is "I'm excited to try text to speech" and you set `es-ES-ElviraNeural`, the text is spoken in English with a Spanish accent. If the voice does not speak the language of the input text, the Speech service won't output synthesized audio. See the [full list](../../../language-support.md?tabs=tts) of supported neural voices.

> [!NOTE]
> The default voice is the first voice returned per locale via the [Voice List API](../../../rest-text-to-speech.md#get-a-list-of-voices).

The voice that speaks is determined in order of priority as follows:
- If you don't set `SpeechSynthesisVoiceName` or `SpeechSynthesisLanguage`, the default voice for `en-US` will speak. 
- If you only set `SpeechSynthesisLanguage`, the default voice for the specified locale will speak. 
- If both `SpeechSynthesisVoiceName` and `SpeechSynthesisLanguage` are set, the `SpeechSynthesisLanguage` setting is ignored. The voice that you specified via `SpeechSynthesisVoiceName` will speak.
- If the voice element is set via [Speech Synthesis Markup Language (SSML)](../../../speech-synthesis-markup.md), the `SpeechSynthesisVoiceName` and `SpeechSynthesisLanguage` settings are ignored.

## Synthesize speech to a file

Next, you create a [`SpeechSynthesizer`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechsynthesizer) object. This object executes text to speech conversions and outputs to speakers, files, or other output streams. `SpeechSynthesizer` accepts as parameters:

- The [`SpeechConfig`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechconfig) object that you created in the previous step
- An [`AudioOutputConfig`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.audio.audiooutputconfig) object that specifies how output results should be handled

To start, create an `AudioOutputConfig` instance to automatically write the output to a .wav file by using the `filename` constructor parameter:

```python
audio_config = speechsdk.audio.AudioOutputConfig(filename="path/to/write/file.wav")
```

Next, instantiate `SpeechSynthesizer` by passing your `speech_config` object and the `audio_config` object as parameters. Then, executing speech synthesis and writing to a file is as simple as running `speak_text_async()` with a string of text.

```python
speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)
speech_synthesizer.speak_text_async("I'm excited to try text to speech")
```

Run the program. A synthesized .wav file is written to the location that you specified. This is a good example of the most basic usage. Next, you look at customizing output and handling the output response as an in-memory stream for working with custom scenarios.

## Synthesize to speaker output

To output synthesized speech to the current active output device such as a speaker, set the `use_default_speaker` parameter when you're creating the `AudioOutputConfig` instance. Here's an example:

```python
audio_config = speechsdk.audio.AudioOutputConfig(use_default_speaker=True)
```

## Get a result as an in-memory stream

You can use the resulting audio data as an in-memory stream rather than directly writing to a file. With in-memory stream, you can build custom behavior, including:

* Abstract the resulting byte array as a seekable stream for custom downstream services.
* Integrate the result with other APIs or services.
* Modify the audio data, write custom .wav headers, and do related tasks.

It's simple to make this change from the previous example. First, remove `AudioConfig`, because you'll manage the output behavior manually from this point onward for increased control. Then pass `None` for `AudioConfig` in the `SpeechSynthesizer` constructor.

> [!NOTE]
> Passing `None` for `AudioConfig`, rather than omitting it as you did in the previous speaker output example, will not play the audio by default on the current active output device.

This time, you save the result to a [`SpeechSynthesisResult`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechsynthesisresult) variable. The `audio_data` property contains a `bytes` object of the output data. You can work with this object manually, or you can use the [`AudioDataStream`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.audiodatastream) class to manage the in-memory stream. In this example, you use the `AudioDataStream` constructor to get a stream from the result:

```python
speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=None)
result = speech_synthesizer.speak_text_async("I'm excited to try text to speech").get()
stream = AudioDataStream(result)
```

From here, you can implement any custom behavior by using the resulting `stream` object.

## Customize audio format

You can customize audio output attributes, including:

* Audio file type
* Sample rate
* Bit depth

To change the audio format, you use the `set_speech_synthesis_output_format()` function on the `SpeechConfig` object. This function expects an `enum` instance of type [`SpeechSynthesisOutputFormat`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechsynthesisoutputformat), which you use to select the output format. See the [list of audio formats](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechsynthesisoutputformat) that are available.

There are various options for different file types, depending on your requirements. By definition, raw formats like `Raw24Khz16BitMonoPcm` don't include audio headers. Use raw formats only in one of these situations: 

- You know that your downstream implementation can decode a raw bitstream.
- You plan to manually build headers based on factors like bit depth, sample rate, and number of channels.

In this example, you specify the high-fidelity RIFF format `Riff24Khz16BitMonoPcm` by setting `SpeechSynthesisOutputFormat` on the `SpeechConfig` object. Similar to the example in the previous section, you use [`AudioDataStream`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.audiodatastream) to get an in-memory stream of the result, and then write it to a file.


```python
speech_config.set_speech_synthesis_output_format(speechsdk.SpeechSynthesisOutputFormat.Riff24Khz16BitMonoPcm)
speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=None)

result = speech_synthesizer.speak_text_async("I'm excited to try text to speech").get()
stream = speechsdk.AudioDataStream(result)
stream.save_to_wav_file("path/to/write/file.wav")
```

Running your program again will write a customized .wav file to the specified path.

## Use SSML to customize speech characteristics

You can use SSML to fine-tune the pitch, pronunciation, speaking rate, volume, and more in the text to speech output by submitting your requests from an XML schema. This section shows an example of changing the voice. For a more detailed guide, see the [SSML how-to article](../../../speech-synthesis-markup.md).

To start using SSML for customization, you make a simple change that switches the voice.

First, create a new XML file for the SSML configuration in your root project directory. In this example, it's `ssml.xml`. The root element is always `<speak>`. Wrapping the text in a `<voice>` element allows you to change the voice by using the `name` parameter. See the [full list](../../../language-support.md?tabs=tts) of supported *neural* voices.

```xml
<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US">
  <voice name="en-US-JennyNeural">
    When you're on the freeway, it's a good idea to use a GPS.
  </voice>
</speak>
```

Next, you need to change the speech synthesis request to reference your XML file. The request is mostly the same, but instead of using the `speak_text_async()` function, you use `speak_ssml_async()`. This function expects an XML string, so you first read your SSML configuration as a string. From here, the result object is exactly the same as previous examples.

> [!NOTE]
> If your `ssml_string` contains `ï»¿` at the beginning of the string, you need to strip off the BOM format or the service will return an error. You do this by setting the `encoding` parameter as follows: `open("ssml.xml", "r", encoding="utf-8-sig")`.

```python
speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=None)

ssml_string = open("ssml.xml", "r").read()
result = speech_synthesizer.speak_ssml_async(ssml_string).get()

stream = speechsdk.AudioDataStream(result)
stream.save_to_wav_file("path/to/write/file.wav")
```

> [!NOTE]
> To change the voice without using SSML, you can set the property on `SpeechConfig` by using `speech_config.speech_synthesis_voice_name = "en-US-JennyNeural"`.

## Subscribe to synthesizer events

You might want more insights about the text to speech processing and results. For example, you might want to know when the synthesizer starts and stops, or you might want to know about other events encountered during synthesis. 

While using the [SpeechSynthesizer](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechsynthesizer) for text to speech, you can subscribe to the events in this table:

[!INCLUDE [Event types](events.md)]

Here's an example that shows how to subscribe to events for speech synthesis. You can follow the instructions in the [quickstart](../../../get-started-text-to-speech.md?pivots=python), but replace the contents of that `speech-synthesis.py` file with the following Python code. 

```python
import os
import azure.cognitiveservices.speech as speechsdk

def speech_synthesizer_bookmark_reached_cb(evt: speechsdk.SessionEventArgs):
    print('BookmarkReached event:')
    print('\tAudioOffset: {}ms'.format((evt.audio_offset + 5000) / 10000))
    print('\tText: {}'.format(evt.text))

def speech_synthesizer_synthesis_canceled_cb(evt: speechsdk.SessionEventArgs):
    print('SynthesisCanceled event')

def speech_synthesizer_synthesis_completed_cb(evt: speechsdk.SessionEventArgs):
    print('SynthesisCompleted event:')
    print('\tAudioData: {} bytes'.format(len(evt.result.audio_data)))
    print('\tAudioDuration: {}'.format(evt.result.audio_duration))

def speech_synthesizer_synthesis_started_cb(evt: speechsdk.SessionEventArgs):
    print('SynthesisStarted event')

def speech_synthesizer_synthesizing_cb(evt: speechsdk.SessionEventArgs):
    print('Synthesizing event:')
    print('\tAudioData: {} bytes'.format(len(evt.result.audio_data)))

def speech_synthesizer_viseme_received_cb(evt: speechsdk.SessionEventArgs):
    print('VisemeReceived event:')
    print('\tAudioOffset: {}ms'.format((evt.audio_offset + 5000) / 10000))
    print('\tVisemeId: {}'.format(evt.viseme_id))

def speech_synthesizer_word_boundary_cb(evt: speechsdk.SessionEventArgs):
    print('WordBoundary event:')
    print('\tBoundaryType: {}'.format(evt.boundary_type))
    print('\tAudioOffset: {}ms'.format((evt.audio_offset + 5000) / 10000))
    print('\tDuration: {}'.format(evt.duration))
    print('\tText: {}'.format(evt.text))
    print('\tTextOffset: {}'.format(evt.text_offset))
    print('\tWordLength: {}'.format(evt.word_length))

# This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
speech_config = speechsdk.SpeechConfig(subscription=os.environ.get('SPEECH_KEY'), region=os.environ.get('SPEECH_REGION'))

# Required for WordBoundary event sentences.
speech_config.set_property(property_id=speechsdk.PropertyId.SpeechServiceResponse_RequestSentenceBoundary, value='true')

audio_config = speechsdk.audio.AudioOutputConfig(use_default_speaker=True)
speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)

# Subscribe to events
speech_synthesizer.bookmark_reached.connect(speech_synthesizer_bookmark_reached_cb)
speech_synthesizer.synthesis_canceled.connect(speech_synthesizer_synthesis_canceled_cb)
speech_synthesizer.synthesis_completed.connect(speech_synthesizer_synthesis_completed_cb)
speech_synthesizer.synthesis_started.connect(speech_synthesizer_synthesis_started_cb)
speech_synthesizer.synthesizing.connect(speech_synthesizer_synthesizing_cb)
speech_synthesizer.viseme_received.connect(speech_synthesizer_viseme_received_cb)
speech_synthesizer.synthesis_word_boundary.connect(speech_synthesizer_word_boundary_cb)

# The language of the voice that speaks.
speech_synthesis_voice_name='en-US-JennyNeural'

ssml = """<speak version='1.0' xml:lang='en-US' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='http://www.w3.org/2001/mstts'>
    <voice name='{}'>
        <mstts:viseme type='redlips_front'/>
        The rainbow has seven colors: <bookmark mark='colors_list_begin'/>Red, orange, yellow, green, blue, indigo, and violet.<bookmark mark='colors_list_end'/>.
    </voice>
</speak>""".format(speech_synthesis_voice_name)

# Synthesize the SSML
print("SSML to synthesize: \r\n{}".format(ssml))
speech_synthesis_result = speech_synthesizer.speak_ssml_async(ssml).get()

if speech_synthesis_result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
    print("SynthesizingAudioCompleted result")
elif speech_synthesis_result.reason == speechsdk.ResultReason.Canceled:
    cancellation_details = speech_synthesis_result.cancellation_details
    print("Speech synthesis canceled: {}".format(cancellation_details.reason))
    if cancellation_details.reason == speechsdk.CancellationReason.Error:
        if cancellation_details.error_details:
            print("Error details: {}".format(cancellation_details.error_details))
            print("Did you set the speech resource key and region values?")
```

You can find more text to speech samples at [GitHub](https://aka.ms/csspeech/samples).

## Run and use a container

Speech containers provide websocket-based query endpoint APIs that are accessed through the Speech SDK and Speech CLI. By default, the Speech SDK and Speech CLI use the public Speech service. To use the container, you need to change the initialization method. Use a container host URL instead of key and region.

For more information about containers, see the [speech containers](../../../speech-container-howto.md#host-urls) how-to guide.

