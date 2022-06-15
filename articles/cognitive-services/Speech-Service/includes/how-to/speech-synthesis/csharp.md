---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 03/25/2020
ms.author: eur
ms.custom: devx-track-csharp
---

[!INCLUDE [Header](../../common/csharp.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

### Install the Speech SDK

Before you can do anything, you need to install the Speech SDK. Depending on your platform, use the following instructions:

* <a href="/azure/cognitive-services/speech-service/quickstarts/setup-platform?pivots=programming-language-csharp&tabs=dotnet" target="_blank">.NET Framework </a>
* <a href="/azure/cognitive-services/speech-service/quickstarts/setup-platform?pivots=programming-language-csharp&tabs=dotnetcore" target="_blank">.NET Core </a>
* <a href="/azure/cognitive-services/speech-service/quickstarts/setup-platform?pivots=programming-language-csharp&tabs=unity" target="_blank">Unity </a>
* <a href="/azure/cognitive-services/speech-service/quickstarts/setup-platform?pivots=programming-language-csharp&tabs=uwps" target="_blank">UWP </a>
* <a href="/azure/cognitive-services/speech-service/quickstarts/setup-platform?pivots=programming-language-csharp&tabs=xaml" target="_blank">Xamarin </a>

## Select synthesis language and voice

The text-to-speech feature in the Azure Speech service supports more than 270 voices and more than 110 languages and variants. You can get the [full list](../../../language-support.md#prebuilt-neural-voices) or try them in a [text-to-speech demo](https://azure.microsoft.com/services/cognitive-services/text-to-speech/#features).

Specify the language or voice of `SpeechConfig` to match your input text and use the wanted voice:

```csharp
static async Task SynthesizeAudioAsync()
{
    var config = SpeechConfig.FromSubscription("<paste-your-speech-key-here>", "<paste-your-speech-location/region-here>");
    // Set either the `SpeechSynthesisVoiceName` or `SpeechSynthesisLanguage`.
    config.SpeechSynthesisLanguage = "en-US"; 
    config.SpeechSynthesisVoiceName = "en-US-JennyNeural";
}
```

All neural voices are multilingual and fluent in their own language and English. For example, if the input text in English is "I'm excited to try text to speech" and you set `es-ES-ElviraNeural`, the text is spoken in English with a Spanish accent. If the voice does not speak the language of the input text, the Speech service won't output synthesized audio. See the [full list](../../../language-support.md#prebuilt-neural-voices) of supported neural voices.

> [!NOTE]
> The default voice is the first voice returned per locale via the [Voice List API](../../../rest-text-to-speech.md#get-a-list-of-voices).

The voice that speaks is determined in order of priority as follows:
- If you don't set `SpeechSynthesisVoiceName` or `SpeechSynthesisLanguage`, the default voice for `en-US` will speak. 
- If you only set `SpeechSynthesisLanguage`, the default voice for the specified locale will speak. 
- If both `SpeechSynthesisVoiceName` and `SpeechSynthesisLanguage` are set, the `SpeechSynthesisLanguage` setting is ignored. The voice that you specified via `SpeechSynthesisVoiceName` will speak.
- If the voice element is set via [Speech Synthesis Markup Language (SSML)](../../../speech-synthesis-markup.md), the `SpeechSynthesisVoiceName` and `SpeechSynthesisLanguage` settings are ignored.

## Synthesize speech to a file

Next, you create a [`SpeechSynthesizer`](/dotnet/api/microsoft.cognitiveservices.speech.speechsynthesizer) object. This object executes text-to-speech conversions and outputs to speakers, files, or other output streams. `SpeechSynthesizer` accepts as parameters:

- The [`SpeechConfig`](/dotnet/api/microsoft.cognitiveservices.speech.speechconfig) object that you created in the previous step
- An [`AudioConfig`](/dotnet/api/microsoft.cognitiveservices.speech.audio.audioconfig) object that specifies how output results should be handled

To start, create an `AudioConfig` instance to automatically write the output to a .wav file by using the `FromWavFileOutput()` function. Instantiate it with a `using` statement. A `using` statement in this context automatically disposes of unmanaged resources and causes the object to go out of scope after disposal.

```csharp
static async Task SynthesizeAudioAsync()
{
    var config = SpeechConfig.FromSubscription("<paste-your-speech-key-here>", "<paste-your-speech-location/region-here>");
    using var audioConfig = AudioConfig.FromWavFileOutput("path/to/write/file.wav");
}
```

Next, instantiate a `SpeechSynthesizer` instance with another `using` statement. Pass your `config` object and the `audioConfig` object as parameters. Then, the process of executing speech synthesis and writing to a file is as simple as running `SpeakTextAsync()` with a string of text.

```csharp
static async Task SynthesizeAudioAsync()
{
    var config = SpeechConfig.FromSubscription("<paste-your-speech-key-here>", "<paste-your-speech-location/region-here>");
    using var audioConfig = AudioConfig.FromWavFileOutput("path/to/write/file.wav");
    using var synthesizer = new SpeechSynthesizer(config, audioConfig);
    await synthesizer.SpeakTextAsync("A simple test to write to a file.");
}
```

Run the program. A synthesized .wav file is written to the location that you specified. This is a good example of the most basic usage. Next, you look at customizing output and handling the output response as an in-memory stream for working with custom scenarios.

## Synthesize to speaker output

In some cases, you might want to output synthesized speech directly to a speaker. To do this, omit the `AudioConfig` parameter when you're creating the `SpeechSynthesizer` instance in the previous example. This change synthesizes to the current active output device.

```csharp
static async Task SynthesizeAudioAsync()
{
    var config = SpeechConfig.FromSubscription("<paste-your-speech-key-here>", "<paste-your-speech-location/region-here>");
    using var synthesizer = new SpeechSynthesizer(config);
    await synthesizer.SpeakTextAsync("Synthesizing directly to speaker output.");
}
```

## Get a result as an in-memory stream

For many scenarios in speech application development, you likely need the resulting audio data as an in-memory stream rather than directly writing to a file. This will allow you to build custom behavior, including:

* Abstract the resulting byte array as a seekable stream for custom downstream services.
* Integrate the result with other APIs or services.
* Modify the audio data, write custom .wav headers, and do related tasks.

It's simple to make this change from the previous example. First, remove the `AudioConfig` block, because you'll manage the output behavior manually from this point onward for increased control. Then pass `null` for `AudioConfig` in the `SpeechSynthesizer` constructor.

> [!NOTE]
> Passing `null` for `AudioConfig`, rather than omitting it as you did in the previous speaker output example, will not play the audio by default on the current active output device.

This time, save the result to a [`SpeechSynthesisResult`](/dotnet/api/microsoft.cognitiveservices.speech.speechsynthesisresult) variable. The `AudioData` property contains a `byte []` instance for the output data. You can work with this `byte []` instance manually, or you can use the [`AudioDataStream`](/dotnet/api/microsoft.cognitiveservices.speech.audiodatastream) class to manage the in-memory stream. In this example, you use the `AudioDataStream.FromResult()` static function to get a stream from the result:

```csharp
static async Task SynthesizeAudioAsync()
{
    var config = SpeechConfig.FromSubscription("<paste-your-speech-key-here>", "<paste-your-speech-location/region-here>");
    using var synthesizer = new SpeechSynthesizer(config, null);

    var result = await synthesizer.SpeakTextAsync("Getting the response as an in-memory stream.");
    using var stream = AudioDataStream.FromResult(result);
}
```

From here, you can implement any custom behavior by using the resulting `stream` object.

## Customize audio format

You can customize audio output attributes, including:

* Audio file type
* Sample rate
* Bit depth

To change the audio format, you use the `SetSpeechSynthesisOutputFormat()` function on the `SpeechConfig` object. This function expects an `enum` instance of type [`SpeechSynthesisOutputFormat`](/dotnet/api/microsoft.cognitiveservices.speech.speechsynthesisoutputformat), which you use to select the output format. See the [list of audio formats](/dotnet/api/microsoft.cognitiveservices.speech.speechsynthesisoutputformat) that are available.

There are various options for different file types, depending on your requirements. By definition, raw formats like `Raw24Khz16BitMonoPcm` don't include audio headers. Use raw formats only in one of these situations:

- You know that your downstream implementation can decode a raw bitstream.
- You plan to manually build headers based on factors like bit depth, sample rate, and number of channels.

In this example, you specify the high-fidelity RIFF format `Riff24Khz16BitMonoPcm` by setting `SpeechSynthesisOutputFormat` on the `SpeechConfig` object. Similar to the example in the previous section, you use [`AudioDataStream`](/dotnet/api/microsoft.cognitiveservices.speech.audiodatastream) to get an in-memory stream of the result, and then write it to a file.

```csharp
static async Task SynthesizeAudioAsync()
{
    var config = SpeechConfig.FromSubscription("<paste-your-speech-key-here>", "<paste-your-speech-location/region-here>");
    config.SetSpeechSynthesisOutputFormat(SpeechSynthesisOutputFormat.Riff24Khz16BitMonoPcm);

    using var synthesizer = new SpeechSynthesizer(config, null);
    var result = await synthesizer.SpeakTextAsync("Customizing audio output format.");

    using var stream = AudioDataStream.FromResult(result);
    await stream.SaveToWaveFileAsync("path/to/write/file.wav");
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

Next, you need to change the speech synthesis request to reference your XML file. The request is mostly the same, but instead of using the `SpeakTextAsync()` function, you use `SpeakSsmlAsync()`. This function expects an XML string, so you first load your SSML configuration as a string by using `File.ReadAllText()`. From here, the result object is exactly the same as previous examples.

> [!NOTE]
> If you're using Visual Studio, your build configuration likely won't find your XML file by default. To fix this, right-click the XML file and select **Properties**. Change **Build Action** to **Content**, and change **Copy to Output Directory** to **Copy always**.

```csharp
public static async Task SynthesizeAudioAsync()
{
    var config = SpeechConfig.FromSubscription("<paste-your-speech-key-here>", "<paste-your-speech-location/region-here>");
    using var synthesizer = new SpeechSynthesizer(config, null);

    var ssml = File.ReadAllText("./ssml.xml");
    var result = await synthesizer.SpeakSsmlAsync(ssml);

    using var stream = AudioDataStream.FromResult(result);
    await stream.SaveToWaveFileAsync("path/to/write/file.wav");
}
```

> [!NOTE]
> To change the voice without using SSML, you can set the property on `SpeechConfig` by using `SpeechConfig.SpeechSynthesisVoiceName = "en-US-JennyNeural";`.

