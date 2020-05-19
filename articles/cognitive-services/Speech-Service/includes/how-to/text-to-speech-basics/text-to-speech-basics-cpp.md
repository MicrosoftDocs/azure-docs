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

Before you can do anything, you'll need to install the Speech SDK. Depending on your platform, use the following instructions:

* <a href="https://docs.microsoft.com/azure/cognitive-services/speech-service/quickstarts/setup-platform?tabs=linux&pivots=programming-language-cpp" target="_blank">Linux <span class="docon docon-navigate-external x-hidden-focus"></span></a>
* <a href="https://docs.microsoft.com/azure/cognitive-services/speech-service/quickstarts/setup-platform?tabs=macos&pivots=programming-language-cpp" target="_blank">macOS <span class="docon docon-navigate-external x-hidden-focus"></span></a>
* <a href="https://docs.microsoft.com/azure/cognitive-services/speech-service/quickstarts/setup-platform?tabs=windows&pivots=programming-language-cpp" target="_blank">Windows <span class="docon docon-navigate-external x-hidden-focus"></span></a>

## Import dependencies

To run the examples in this article, include the following import and `using` statements at the top of your script.

```cpp
#include <iostream>
#include <fstream>
#include <string>
#include <speechapi_cxx.h>

using namespace std;
using namespace Microsoft::CognitiveServices::Speech;
using namespace Microsoft::CognitiveServices::Speech::Audio;
```

## Create a speech configuration

To call the Speech service using the Speech SDK, you need to create a [`SpeechConfig`](https://docs.microsoft.com/cpp/cognitive-services/speech/speechconfig). This class includes information about your subscription, like your key and associated region, endpoint, host, or authorization token.

> [!NOTE]
> Regardless of whether you're performing speech recognition, speech synthesis, translation, or intent recognition, you'll always create a configuration.

There are a few ways that you can initialize a [`SpeechConfig`](https://docs.microsoft.com/cpp/cognitive-services/speech/speechconfig):

* With a subscription: pass in a key and the associated region.
* With an endpoint: pass in a Speech service endpoint. A key or authorization token is optional.
* With a host: pass in a host address. A key or authorization token is optional.
* With an authorization token: pass in an authorization token and the associated region.

In this example, you create a [`SpeechConfig`](https://docs.microsoft.com/cpp/cognitive-services/speech/speechconfig) using a subscription key and region. See the [region support](https://docs.microsoft.com/azure/cognitive-services/speech-service/regions#speech-sdk) page to find your region identifier. You also create some basic boilerplate code to use for the rest of this article, which you modify for different customizations.

```cpp
int wmain()
{
    try
    {
        synthesizeSpeech();
    }
    catch (exception e)
    {
        cout << e.what();
    }
    return 0;
}
    
void synthesizeSpeech() 
{
    auto config = SpeechConfig::FromSubscription("YourSubscriptionKey", "YourServiceRegion");
}
```

## Synthesize speech to a file

Next, you create a [`SpeechSynthesizer`](https://docs.microsoft.com/cpp/cognitive-services/speech/speechsynthesizer) object, which executes text-to-speech conversions and outputs to speakers, files, or other output streams. The [`SpeechSynthesizer`](https://docs.microsoft.com/cpp/cognitive-services/speech/speechsynthesizer) accepts as params the [`SpeechConfig`](https://docs.microsoft.com/cpp/cognitive-services/speech/speechconfig) object created in the previous step, and an [`AudioConfig`](https://docs.microsoft.com/cpp/cognitive-services/speech/audio-audioconfig) object that specifies how output results should be handled.

To start, create an `AudioConfig` to automatically write the output to a `.wav` file, using the `FromWavFileOutput()` function.

```cpp
void synthesizeSpeech() 
{
    auto config = SpeechConfig::FromSubscription("YourSubscriptionKey", "YourServiceRegion");
    auto audioConfig = AudioConfig::FromWavFileOutput("path/to/write/file.wav");
}
```

Next, instantiate a `SpeechSynthesizer`, passing your `config` object and the `audioConfig` object as params. Then, executing speech synthesis and writing to a file is as simple as running `SpeakTextAsync()` with a string of text.

```cpp
void synthesizeSpeech() 
{
    auto config = SpeechConfig::FromSubscription("YourSubscriptionKey", "YourServiceRegion");
    auto audioConfig = AudioConfig::FromWavFileOutput("path/to/write/file.wav");
    auto synthesizer = SpeechSynthesizer::FromConfig(config, audioConfig);
    auto result = synthesizer->SpeakTextAsync("A simple test to write to a file.").get();
}
```

Run the program, and a synthesized `.wav` file is written to the location you specified. This is a good example of the most basic usage, but next you look at customizing output and handling the output response as an in-memory stream for working with custom scenarios.

## Synthesize to speaker output

In some cases, you may want to directly output synthesized speech directly to a speaker. To do this, simply omit the `AudioConfig` param when creating the `SpeechSynthesizer` in the example above. This outputs to the current active output device.

```cpp
void synthesizeSpeech() 
{
    auto config = SpeechConfig::FromSubscription("YourSubscriptionKey", "YourServiceRegion");
    auto synthesizer = SpeechSynthesizer::FromConfig(config);
    auto result = synthesizer->SpeakTextAsync("Synthesizing directly to speaker output.").get();
}
```

## Get result as an in-memory stream

For many scenarios in speech application development, you likely need the resulting audio data as an in-memory stream rather than directly writing to a file. This will allow you to build custom behavior including:

* Abstract the resulting byte array as a seek-able stream for custom downstream services.
* Integrate the result with other API's or services.
* Modify the audio data, write custom `.wav` headers, etc.

It's simple to make this change from the previous example. First, remove the `AudioConfig`, as you will manage the output behavior manually from this point onward for increased control. Then pass `NULL` for the `AudioConfig` in the `SpeechSynthesizer` constructor. 

> [!NOTE]
> Passing `NULL` for the `AudioConfig`, rather than omitting it like in the speaker output example above, will not play the audio by default on the current active output device.

This time, you save the result to a [`SpeechSynthesisResult`](https://docs.microsoft.com/cpp/cognitive-services/speech/speechsynthesisresult) variable. The `GetAudioData` getter returns a `byte []` of the output data. You can work with this `byte []` manually, or you can use the [`AudioDataStream`](https://docs.microsoft.com/cpp/cognitive-services/speech/audiodatastream) class to manage the in-memory stream. In this example you use the `AudioDataStream.FromResult()` static function to get a stream from the result.

```cpp
void synthesizeSpeech() 
{
    auto config = SpeechConfig::FromSubscription("YourSubscriptionKey", "YourServiceRegion");
    auto synthesizer = SpeechSynthesizer::FromConfig(config, NULL);
    
    auto result = synthesizer->SpeakTextAsync("Getting the response as an in-memory stream.").get();
    auto stream = AudioDataStream::FromResult(result);
}
```

From here you can implement any custom behavior using the resulting `stream` object.

## Customize audio format

The following section shows how to customize audio output attributes including:

* Audio file type
* Sample-rate
* Bit-depth

To change the audio format, you use the `SetSpeechSynthesisOutputFormat()` function on the `SpeechConfig` object. This function expects an `enum` of type [`SpeechSynthesisOutputFormat`](https://docs.microsoft.com/cpp/cognitive-services/speech/microsoft-cognitiveservices-speech-namespace#speechsynthesisoutputformat), which you use to select the output format. See the reference docs for a [list of audio formats](https://docs.microsoft.com/cpp/cognitive-services/speech/microsoft-cognitiveservices-speech-namespace#speechsynthesisoutputformat) that are available.

There are various options for different file types depending on your requirements. Note that by definition, raw formats like `Raw24Khz16BitMonoPcm` do not include audio headers. Use raw formats only when you know your downstream implementation can decode a raw bitstream, or if you plan on manually building headers based on bit-depth, sample-rate, number of channels, etc.

In this example, you specify a high-fidelity RIFF format `Riff24Khz16BitMonoPcm` by setting the `SpeechSynthesisOutputFormat` on the `SpeechConfig` object. Similar to the example in the previous section, you use [`AudioDataStream`](https://docs.microsoft.com/cpp/cognitive-services/speech/audiodatastream) to get an in-memory stream of the result, and then write it to a file.

```cpp
void synthesizeSpeech() 
{
    auto config = SpeechConfig::FromSubscription("YourSubscriptionKey", "YourServiceRegion");
    config->SetSpeechSynthesisOutputFormat(SpeechSynthesisOutputFormat::Riff24Khz16BitMonoPcm);

    auto synthesizer = SpeechSynthesizer::FromConfig(config, NULL);
    auto result = synthesizer->SpeakTextAsync("A simple test to write to a file.").get();
    
    auto stream = AudioDataStream::FromResult(result);
    stream->SaveToWavFileAsync("path/to/write/file.wav").get();
}
```

Running your program again will write a `.wav` file to the specified path.

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

Next, you need to change the speech synthesis request to reference your XML file. The request is mostly the same, but instead of using the `SpeakTextAsync()` function, you use `SpeakSsmlAsync()`. This function expects an XML string, so you first load your SSML config as a string. From here, the result object is exactly the same as previous examples.

```cpp
void synthesizeSpeech() 
{
    auto config = SpeechConfig::FromSubscription("YourSubscriptionKey", "YourServiceRegion");
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
