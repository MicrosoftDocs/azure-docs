---
author: trevorbye
ms.service: cognitive-services
ms.topic: include
ms.date: 07/02/2021
ms.author: trbye
---

In this quickstart, you learn common design patterns for doing text-to-speech synthesis using the Speech SDK. You start by doing basic configuration and synthesis, and move on to more advanced examples for custom application development including:

* Getting responses as in-memory streams
* Customizing output sample rate and bit rate
* Submitting synthesis requests using SSML (speech synthesis markup language)
* Using neural voices

## Skip to samples on GitHub

If you want to skip straight to sample code, see the [Python quickstart samples](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/python/text-to-speech) on GitHub.

## Prerequisites

This article assumes that you have an Azure account and Speech service subscription. If you don't have an account and subscription, [try the Speech service for free](../../../overview.md#try-the-speech-service-for-free).

## Install the Speech SDK

Before you can do anything, you'll need to install the Speech SDK.

```Python
pip install azure-cognitiveservices-speech
```

If you're on macOS and run into install issues, you may need to run this command first.

```Python
python3 -m pip install --upgrade pip
```

After the Speech SDK is installed, include the following import statements at the top of your script.

```Python
from azure.cognitiveservices.speech import AudioDataStream, SpeechConfig, SpeechSynthesizer, SpeechSynthesisOutputFormat
from azure.cognitiveservices.speech.audio import AudioOutputConfig
```

## Create a speech configuration

To call the Speech service using the Speech SDK, you need to create a [`SpeechConfig`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechconfig). This class includes information about your subscription, like your speech key and associated location/region, endpoint, host, or authorization token.

> [!NOTE]
> Regardless of whether you're performing speech recognition, speech synthesis, translation, or intent
> recognition, you'll always create a configuration.

There are a few ways that you can initialize a [`SpeechConfig`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechconfig):

* With a subscription: pass in a speech key and the associated location/region.
* With an endpoint: pass in a Speech service endpoint. A speech key or authorization token is optional.
* With a host: pass in a host address. A speech key or authorization token is optional.
* With an authorization token: pass in an authorization token and the associated location/region.

In this example, you create a [`SpeechConfig`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechconfig) using a speech key and location/region. Get these credentials by following steps in [Try the Speech service for free](../../../overview.md#try-the-speech-service-for-free).

```python
speech_config = SpeechConfig(subscription="<paste-your-speech-key-here>", region="<paste-your-speech-location/region-here>")
```

## Synthesize speech to a file

Next, you create a [`SpeechSynthesizer`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechsynthesizer) object, which executes text-to-speech conversions and outputs to speakers, files, or other output streams. The [`SpeechSynthesizer`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechsynthesizer) accepts as params the [`SpeechConfig`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechconfig) object created in the previous step, and an [`AudioOutputConfig`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.audio.audiooutputconfig) object that specifies how output results should be handled.

To start, create an `AudioOutputConfig` to automatically write the output to a `.wav` file, using the `filename` constructor param.

```python
audio_config = AudioOutputConfig(filename="path/to/write/file.wav")
```

Next, instantiate a `SpeechSynthesizer` by passing your `speech_config` object and the `audio_config` object as params. Then, executing speech synthesis and writing to a file is as simple as running `speak_text_async()` with a string of text.

```python
synthesizer = SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)
synthesizer.speak_text_async("A simple test to write to a file.")
```

Run the program, and a synthesized `.wav` file is written to the location you specified. This is a good example of the most basic usage, but next you look at customizing output and handling the output response as an in-memory stream for working with custom scenarios.

## Synthesize to speaker output

In some cases, you may want to directly output synthesized speech directly to a speaker. To do this, use the example in the previous section, but change the `AudioOutputConfig` by removing the `filename` param, and set `use_default_speaker=True`. This outputs to the current active output device.

```python
audio_config = AudioOutputConfig(use_default_speaker=True)
```

## Get result as an in-memory stream

For many scenarios in speech application development, you likely need the resulting audio data as an in-memory stream rather than directly writing to a file. This will allow you to build custom behavior including:

* Abstract the resulting byte array as a seek-able stream for custom downstream services.
* Integrate the result with other API's or services.
* Modify the audio data, write custom `.wav` headers, etc.

It's simple to make this change from the previous example. First, remove the `AudioConfig`, as you will manage the output behavior manually from this point onward for increased control. Then pass `None` for the `AudioConfig` in the `SpeechSynthesizer` constructor.

> [!NOTE]
> Passing `None` for the `AudioConfig`, rather than omitting it like in the speaker output example above, will not play the audio by default on the current active output device.

This time, you save the result to a [`SpeechSynthesisResult`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechsynthesisresult) variable. The `audio_data` property contains a `bytes` object of the output data. You can work with this object manually, or you can use the [`AudioDataStream`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.audiodatastream) class to manage the in-memory stream. In this example you use the `AudioDataStream` constructor to get a stream from the result.

```python
synthesizer = SpeechSynthesizer(speech_config=speech_config, audio_config=None)
result = synthesizer.speak_text_async("Getting the response as an in-memory stream.").get()
stream = AudioDataStream(result)
```

From here you can implement any custom behavior using the resulting `stream` object.

## Customize audio format

The following section shows how to customize audio output attributes including:

* Audio file type
* Sample-rate
* Bit-depth

To change the audio format, you use the `set_speech_synthesis_output_format()` function on the `SpeechConfig` object. This function expects an `enum` of type [`SpeechSynthesisOutputFormat`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechsynthesisoutputformat), which you use to select the output format. See the reference docs for a [list of audio formats](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechsynthesisoutputformat) that are available.

There are various options for different file types depending on your requirements. Note that by definition, raw formats like `Raw24Khz16BitMonoPcm` do not include audio headers. Use raw formats only when you know your downstream implementation can decode a raw bitstream, or if you plan on manually building headers based on bit-depth, sample-rate, number of channels, etc.

In this example, you specify a high-fidelity RIFF format `Riff24Khz16BitMonoPcm` by setting the `SpeechSynthesisOutputFormat` on the `SpeechConfig` object. Similar to the example in the previous section, you use [`AudioDataStream`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.audiodatastream) to get an in-memory stream of the result, and then write it to a file.


```python
speech_config.set_speech_synthesis_output_format(SpeechSynthesisOutputFormat["Riff24Khz16BitMonoPcm"])
synthesizer = SpeechSynthesizer(speech_config=speech_config, audio_config=None)

result = synthesizer.speak_text_async("Customizing audio output format.").get()
stream = AudioDataStream(result)
stream.save_to_wav_file("path/to/write/file.wav")
```

Running your program again will write a customized `.wav` file to the specified path.

## Use SSML to customize speech characteristics

Speech Synthesis Markup Language (SSML) allows you to fine-tune the pitch, pronunciation, speaking rate, volume, and more of the text-to-speech output by submitting your requests from an XML schema. This section shows an example of changing the voice, but for a more detailed guide, see the [SSML how-to article](../../../speech-synthesis-markup.md).

To start using SSML for customization, you make a simple change that switches the voice.
First, create a new XML file for the SSML config in your root project directory, in this example `ssml.xml`. The root element is always `<speak>`, and wrapping the text in a `<voice>` element allows you to change the voice using the `name` param. See the [full list](../../../language-support.md#neural-voices) of supported **neural** voices.

```xml
<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US">
  <voice name="en-US-AriaNeural">
    When you're on the freeway, it's a good idea to use a GPS.
  </voice>
</speak>
```

Next, you need to change the speech synthesis request to reference your XML file. The request is mostly the same, but instead of using the `speak_text_async()` function, you use `speak_ssml_async()`. This function expects an XML string, so you first read your SSML config as a string. From here, the result object is exactly the same as previous examples.

> [!NOTE]
> If your `ssml_string` contains `ï»¿` at the beginning of the string, you need to strip off the BOM format or the service will return an error. You do this by setting the
> `encoding` parameter as follows: `open("ssml.xml", "r", encoding="utf-8-sig")`.

```python
synthesizer = SpeechSynthesizer(speech_config=speech_config, audio_config=None)

ssml_string = open("ssml.xml", "r").read()
result = synthesizer.speak_ssml_async(ssml_string).get()

stream = AudioDataStream(result)
stream.save_to_wav_file("path/to/write/file.wav")
```

> [!NOTE]
> To change the voice without using SSML, you can set the property on the `SpeechConfig` by using `SpeechConfig.speech_synthesis_voice_name = "en-US-AriaNeural"`

## Get facial pose events

Speech can be a good way to drive the animation of facial expressions.
Often [visemes](../../../how-to-speech-synthesis-viseme.md) are used to represent the key poses in observed speech, such as the position of the lips, jaw and tongue when producing a particular phoneme.
You can subscribe the viseme event in Speech SDK.
Then, you can apply viseme events to animate the face of a character as speech audio plays.
Learn [how to get viseme events](../../../how-to-speech-synthesis-viseme.md#get-viseme-events-with-the-speech-sdk).
