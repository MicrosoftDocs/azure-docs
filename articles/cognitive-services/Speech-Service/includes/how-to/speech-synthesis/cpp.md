---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 07/02/2021
ms.author: eur
---

[!INCLUDE [Header](../../common/cpp.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

### Install the Speech SDK

Before you can do anything, you need to install the Speech SDK. Depending on your platform, use the following instructions:

* <a href="/azure/cognitive-services/speech-service/quickstarts/setup-platform?pivots=programming-language-cpp&tabs=linux" target="_blank">Linux </a>
* <a href="/azure/cognitive-services/speech-service/quickstarts/setup-platform?pivots=programming-language-cpp&tabs=macos" target="_blank">macOS </a>
* <a href="/azure/cognitive-services/speech-service/quickstarts/setup-platform?pivots=programming-language-cpp&tabs=windows" target="_blank">Windows </a>

## Select synthesis language and voice

The text-to-speech feature in the Azure Speech service supports more than 270 voices and more than 110 languages and variants.
You can get the [full list](../../../language-support.md#prebuilt-neural-voices) or try them in a [text-to-speech demo](https://azure.microsoft.com/services/cognitive-services/text-to-speech/#features).

Specify the language or voice of [`SpeechConfig`](/cpp/cognitive-services/speech/speechconfig) to match your input text and use the wanted voice:

```cpp
void synthesizeSpeech()
{
    auto config = SpeechConfig::FromSubscription("<paste-your-speech-key-here>", "<paste-your-speech-location/region-here>");
    // Set either the `SpeechSynthesisVoiceName` or `SpeechSynthesisLanguage`.
    config->SetSpeechSynthesisLanguage("en-US"); 
    config->SetSpeechSynthesisVoiceName("en-US-JennyNeural");
}
```

If you don't set `SpeechSynthesisVoiceName` or `SpeechSynthesisLanguage`, the default `en-US` voice will speak. If both are set, the language of the `SpeechSynthesisVoiceName` will overwrite the `SpeechSynthesisLanguage`.  For example, if you set `SpeechSynthesisVoiceName` to `es-ES-ElviraNeural` and `SpeechSynthesisLanguage` to `en-US`, the `es-ES-ElviraNeural` voice will speak. If the voice element is set via SSML, the `SpeechSynthesisVoiceName` and `SpeechSynthesisLanguage` are ignored.

The input text is not translated for speech. The voice language implies accent. For example, if the input text in English is "Good morning" and the `SpeechSynthesisLanguage` is `es-ES`, the text is spoken in English with a Spanish accent. 

## Synthesize speech to a file

Next, you create a [`SpeechSynthesizer`](/cpp/cognitive-services/speech/speechsynthesizer) object. This object executes text-to-speech conversions and outputs to speakers, files, or other output streams. `SpeechSynthesizer` accepts as parameters:

- The [`SpeechConfig`](/cpp/cognitive-services/speech/speechconfig) object that you created in the previous step
- An [`AudioConfig`](/cpp/cognitive-services/speech/audio-audioconfig) object that specifies how output results should be handled

To start, create an `AudioConfig` instance to automatically write the output to a .wav file by using the `FromWavFileOutput()` function:

```cpp
void synthesizeSpeech()
{
    auto config = SpeechConfig::FromSubscription("<paste-your-speech-key-here>", "<paste-your-speech-location/region-here>");
    auto audioConfig = AudioConfig::FromWavFileOutput("path/to/write/file.wav");
}
```

Next, instantiate a `SpeechSynthesizer` instance. Pass your `config` object and the `audioConfig` object as parameters. Then, the process of executing speech synthesis and writing to a file is as simple as running `SpeakTextAsync()` with a string of text.

```cpp
void synthesizeSpeech()
{
    auto config = SpeechConfig::FromSubscription("<paste-your-speech-key-here>", "<paste-your-speech-location/region-here>");
    auto audioConfig = AudioConfig::FromWavFileOutput("path/to/write/file.wav");
    auto synthesizer = SpeechSynthesizer::FromConfig(config, audioConfig);
    auto result = synthesizer->SpeakTextAsync("A simple test to write to a file.").get();
}
```

Run the program. A synthesized .wav file is written to the location that you specified. This is a good example of the most basic usage. Next, you look at customizing output and handling the output response as an in-memory stream for working with custom scenarios.

## Synthesize to speaker output

In some cases, you might want to output synthesized speech directly to a speaker. To do this, omit the `AudioConfig` parameter when you're creating the `SpeechSynthesizer` instance in the previous example. This change synthesizes to the current active output device.

```cpp
void synthesizeSpeech()
{
    auto config = SpeechConfig::FromSubscription("<paste-your-speech-key-here>", "<paste-your-speech-location/region-here>");
    auto synthesizer = SpeechSynthesizer::FromConfig(config);
    auto result = synthesizer->SpeakTextAsync("Synthesizing directly to speaker output.").get();
}
```

## Get a result as an in-memory stream

For many scenarios in speech application development, you likely need the resulting audio data as an in-memory stream rather than directly writing to a file. This will allow you to build custom behavior, including:

* Abstract the resulting byte array as a seekable stream for custom downstream services.
* Integrate the result with other APIs or services.
* Modify the audio data, write custom .wav headers, and do related tasks.

It's simple to make this change from the previous example. First, remove the `AudioConfig` block, because you'll manage the output behavior manually from this point onward for increased control. Then pass `NULL` for `AudioConfig` in the `SpeechSynthesizer` constructor.

> [!NOTE]
> Passing `NULL` for `AudioConfig`, rather than omitting it as you did in the previous speaker output example, will not play the audio by default on the current active output device.

This time, save the result to a [`SpeechSynthesisResult`](/cpp/cognitive-services/speech/speechsynthesisresult) variable. The `GetAudioData` getter returns a `byte []` instance for the output data. You can work with this `byte []` instance manually, or you can use the [`AudioDataStream`](/cpp/cognitive-services/speech/audiodatastream) class to manage the in-memory stream. In this example, you use the `AudioDataStream.FromResult()` static function to get a stream from the result:

```cpp
void synthesizeSpeech()
{
    auto config = SpeechConfig::FromSubscription("<paste-your-speech-key-here>", "<paste-your-speech-location/region-here>");
    auto synthesizer = SpeechSynthesizer::FromConfig(config, NULL);

    auto result = synthesizer->SpeakTextAsync("Getting the response as an in-memory stream.").get();
    auto stream = AudioDataStream::FromResult(result);
}
```

From here, you can implement any custom behavior by using the resulting `stream` object.

## Customize audio format

You can customize audio output attributes, including:

* Audio file type
* Sample rate
* Bit depth

To change the audio format, you use the `SetSpeechSynthesisOutputFormat()` function on the `SpeechConfig` object. This function expects an `enum` instance of type [`SpeechSynthesisOutputFormat`](/cpp/cognitive-services/speech/microsoft-cognitiveservices-speech-namespace#speechsynthesisoutputformat), which you use to select the output format. See the [list of audio formats](/cpp/cognitive-services/speech/microsoft-cognitiveservices-speech-namespace#speechsynthesisoutputformat) that are available.

There are various options for different file types, depending on your requirements. By definition, raw formats like `Raw24Khz16BitMonoPcm` don't include audio headers. Use raw formats only in one of these situations:

- You know that your downstream implementation can decode a raw bitstream.
- You plan to manually build headers based on factors like bit depth, sample rate, and number of channels.

In this example, you specify the high-fidelity RIFF format `Riff24Khz16BitMonoPcm` by setting `SpeechSynthesisOutputFormat` on the `SpeechConfig` object. Similar to the example in the previous section, you use [`AudioDataStream`](/cpp/cognitive-services/speech/audiodatastream) to get an in-memory stream of the result, and then write it to a file.

```cpp
void synthesizeSpeech()
{
    auto config = SpeechConfig::FromSubscription("<paste-your-speech-key-here>", "<paste-your-speech-location/region-here>");
    config->SetSpeechSynthesisOutputFormat(SpeechSynthesisOutputFormat::Riff24Khz16BitMonoPcm);

    auto synthesizer = SpeechSynthesizer::FromConfig(config, NULL);
    auto result = synthesizer->SpeakTextAsync("A simple test to write to a file.").get();

    auto stream = AudioDataStream::FromResult(result);
    stream->SaveToWavFileAsync("path/to/write/file.wav").get();
}
```

Running your program again will write a .wav file to the specified path.

## Use SSML to customize speech characteristics

You can use SSML to fine-tune the pitch, pronunciation, speaking rate, volume, and more in the text-to-speech output by submitting your requests from an XML schema. This section shows an example of changing the voice. For a more detailed guide, see the [SSML how-to article](../../../speech-synthesis-markup.md).

To start using SSML for customization, you make a simple change that switches the voice.

First, create a new XML file for the SSML configuration in your root project directory. In this example, it's `ssml.xml`. The root element is always `<speak>`. Wrapping the text in a `<voice>` element allows you to change the voice by using the `name` parameter. See the [full list](../../../language-support.md#prebuilt-neural-voices) of supported *neural* voices.

```xml
<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US">
  <voice name="en-US-JennyNeural">
    When you're on the freeway, it's a good idea to use a GPS.
  </voice>
</speak>
```

Next, you need to change the speech synthesis request to reference your XML file. The request is mostly the same, but instead of using the `SpeakTextAsync()` function, you use `SpeakSsmlAsync()`. This function expects an XML string, so you first load your SSML configuration as a string. From here, the result object is exactly the same as previous examples.

```cpp
void synthesizeSpeech()
{
    auto config = SpeechConfig::FromSubscription("<paste-your-speech-key-here>", "<paste-your-speech-location/region-here>");
    auto synthesizer = SpeechSynthesizer::FromConfig(config, NULL);

    std::ifstream file("./ssml.xml");
    std::string ssml, line;
    while (std::getline(file, line))
    {
        ssml += line;
        ssml.push_back('\n');
    }
    auto result = synthesizer->SpeakSsmlAsync(ssml).get();

    auto stream = AudioDataStream::FromResult(result);
    stream->SaveToWavFileAsync("path/to/write/file.wav").get();
}
```

> [!NOTE]
> To change the voice without using SSML, you can set the property on `SpeechConfig` by using `SpeechConfig.SetSpeechSynthesisVoiceName("en-US-ChristopherNeural")`.

## Get facial pose events

Speech can be a good way to drive the animation of facial expressions.
[Visemes](../../../how-to-speech-synthesis-viseme.md) are often used to represent the key poses in observed speech. Key poses include the position of the lips, jaw, and tongue in producing a particular phoneme.

You can subscribe to viseme events in the Speech SDK. Then, you can apply viseme events to animate the face of a character as speech audio plays.
Learn [how to get viseme events](../../../how-to-speech-synthesis-viseme.md#get-viseme-events-with-the-speech-sdk).

## Get position information

Your project might need to know when a word is spoken by text-to-speech so that it can take specific action based on that timing. For example, if you want to highlight words as they're spoken, you need to know what to highlight, when to highlight it, and for how long to highlight it.

You can accomplish this by using the `WordBoundary` event within `SpeechSynthesizer`. This event is raised at the beginning of each new spoken word. It provides a time offset within the spoken stream and a text offset within the input prompt:

* `AudioOffset` reports the output audio's elapsed time between the beginning of synthesis and the start of the next word. This is measured in hundred-nanosecond units (HNS), with 10,000 HNS equivalent to 1 millisecond.
* `WordOffset` reports the character position in the input string (original text or [SSML](../../../speech-synthesis-markup.md)) immediately before the word that's about to be spoken.

> [!NOTE]
> `WordBoundary` events are raised as the output audio data becomes available, which will be faster than playback to an output device. The caller must appropriately synchronize streaming and real time.

You can find examples of using `WordBoundary` in the [text-to-speech samples](https://aka.ms/csspeech/samples) on GitHub.