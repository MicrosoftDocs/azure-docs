---
author: trevorbye
ms.service: cognitive-services
ms.topic: include
ms.date: 03/25/2020
ms.author: trbye
---

## Prerequisites

This article assumes that you have an Azure account and Speech service subscription. If you don't have an account and subscription, [try the Speech service for free](../../../get-started.md).

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

To call the Speech service using the Speech SDK, you need to create a [`SpeechConfig`](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechconfig?view=azure-python). This class includes information about your subscription, like your key and associated region, endpoint, host, or authorization token.

> [!NOTE]
> Regardless of whether you're performing speech recognition, speech synthesis, translation, or intent
> recognition, you'll always create a configuration.

There are a few ways that you can initialize a [`SpeechConfig`](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechconfig?view=azure-python):

* With a subscription: pass in a key and the associated region.
* With an endpoint: pass in a Speech service endpoint. A key or authorization token is optional.
* With a host: pass in a host address. A key or authorization token is optional.
* With an authorization token: pass in an authorization token and the associated region.

In this example, you create a [`SpeechConfig`](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechconfig?view=azure-python) using a subscription key and region. See the [region support](https://docs.microsoft.com/azure/cognitive-services/speech-service/regions#speech-sdk) page to find your region identifier.

```python
speech_config = SpeechConfig(subscription="YourSubscriptionKey", region="YourServiceRegion")
```

## Synthesize speech to a file

Next, you create a [`SpeechSynthesizer`](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechsynthesizer?view=azure-python) object, which executes text-to-speech conversions and outputs to speakers, files, or other output streams. The [`SpeechSynthesizer`](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechsynthesizer?view=azure-python) accepts as params the [`SpeechConfig`](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechconfig?view=azure-python) object created in the previous step, and an [`AudioOutputConfig`](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.audio.audiooutputconfig?view=azure-python) object that specifies how output results should be handled.

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

This time, you save the result to a [`SpeechSynthesisResult`](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechsynthesisresult?view=azure-python) variable. The `audio_data` property contains a `bytes` object of the output data. You can work with this object manually, or you can use the [`AudioDataStream`](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.audiodatastream?view=azure-python) class to manage the in-memory stream. In this example you use the `AudioDataStream` constructor to get a stream from the result.

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

To change the audio format, you use the `set_speech_synthesis_output_format()` function on the `SpeechConfig` object. This function expects an `enum` of type [`SpeechSynthesisOutputFormat`](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechsynthesisoutputformat?view=azure-python), which you use to select the output format. See the reference docs for a [list of audio formats](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechsynthesisoutputformat?view=azure-python) that are available.

There are various options for different file types depending on your requirements. Note that by definition, raw formats like `Raw24Khz16BitMonoPcm` do not include audio headers. Use raw formats only when you know your downstream implementation can decode a raw bitstream, or if you plan on manually building headers based on bit-depth, sample-rate, number of channels, etc.

In this example, you specify a high-fidelity RIFF format `Riff24Khz16BitMonoPcm` by setting the `SpeechSynthesisOutputFormat` on the `SpeechConfig` object. Similar to the example in the previous section, you use [`AudioDataStream`](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.audiodatastream?view=azure-python) to get an in-memory stream of the result, and then write it to a file.


```python
speech_config.set_speech_synthesis_output_format(SpeechSynthesisOutputFormat["Riff24Khz16BitMonoPcm"])
synthesizer = SpeechSynthesizer(speech_config=speech_config, audio_config=None)

result = synthesizer.speak_text_async("Customizing audio output format.").get()
stream = AudioDataStream(result)
stream.save_to_wav_file("path/to/write/file.wav")
```

Running your program again will write a customized `.wav` file to the specified path.

## Use SSML to customize speech characteristics

Speech Synthesis Markup Language (SSML) allows you to fine-tune the pitch, pronunciation, speaking rate, volume, and more of the text-to-speech output by submitting your requests from an XML schema. This section shows a few practical usage examples, but for a more detailed guide, see the [SSML how-to article](../../../speech-synthesis-markup.md).

To start using SSML for customization, you make a simple change that switches the voice.
First, create a new XML file for the SSML config in your root project directory, in this example `ssml.xml`. The root element is always `<speak>`, and wrapping the text in a `<voice>` element allows you to change the voice using the `name` param. This example changes the voice to a male English (UK) voice. Note that this voice is a **standard** voice, which has different pricing and availability than **neural** voices. See the [full list](https://docs.microsoft.com/azure/cognitive-services/speech-service/language-support#standard-voices) of supported **standard** voices.

```xml
<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US">
  <voice name="en-GB-George-Apollo">
    When you're on the motorway, it's a good idea to use a sat-nav.
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

The output works, but there a few simple additional changes you can make to help it sound more natural. The overall speaking speed is a little too fast, so we'll add a `<prosody>` tag and reduce the speed to **90%** of the default rate. Additionally, the pause after the comma in the sentence is a little too short and unnatural sounding. To fix this issue, add a `<break>` tag to delay the speech, and set the time param to **200ms**. Re-run the synthesis to see how these customizations affected the output.

```xml
<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US">
  <voice name="en-GB-George-Apollo">
    <prosody rate="0.9">
      When you're on the motorway,<break time="200ms"/> it's a good idea to use a sat-nav.
    </prosody>
  </voice>
</speak>
```

## Neural voices

Neural voices are speech synthesis algorithms powered by deep neural networks. When using a neural voice, synthesized speech is nearly indistinguishable from the human recordings. With the human-like natural prosody and clear articulation of words, neural voices significantly reduce listening fatigue when users interact with AI systems.

To switch to a neural voice, change the `name` to one of the [neural voice options](https://docs.microsoft.com/azure/cognitive-services/speech-service/language-support#neural-voices). Then, add an XML namespace for `mstts`, and wrap your text in the `<mstts:express-as>` tag. Use the `style` param to customize the speaking style. This example uses `cheerful`, but try setting it to `customerservice` or `chat` to see the difference in speaking style.

> [!IMPORTANT]
> Neural voices are **only** supported for Speech resources created in *East US*, *South East Asia*, and *West Europe* regions.

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="en-US">
  <voice name="en-US-AriaNeural">
    <mstts:express-as style="cheerful">
      This is awesome!
    </mstts:express-as>
  </voice>
</speak>
```
