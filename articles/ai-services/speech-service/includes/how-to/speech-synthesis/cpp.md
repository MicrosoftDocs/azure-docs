---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 08/30/2023
ms.author: eur
---

[!INCLUDE [Header](../../common/cpp.md)]

[!INCLUDE [Introduction](intro.md)]

## Select synthesis language and voice

The text to speech feature in the Speech service supports more than 400 voices and more than 140 languages and variants. Refer to the full [list of supported text to speech locales](../../../language-support.md?tabs=tts) or try them in the [Voice Gallery](https://speech.microsoft.com/portal/voicegallery).

Specify the language or voice of the [SpeechConfig](/cpp/cognitive-services/speech/speechconfig) class to match your input text and use the specified voice. The following code snippet shows how this technique works:

```cpp
void synthesizeSpeech()
{
    auto speechConfig = SpeechConfig::FromSubscription("YourSpeechKey", "YourSpeechRegion");
    // Set either the `SpeechSynthesisVoiceName` or `SpeechSynthesisLanguage`.
    speechConfig->SetSpeechSynthesisLanguage("en-US"); 
    speechConfig->SetSpeechSynthesisVoiceName("en-US-AvaMultilingualNeural");
}
```

All neural voices are multilingual and fluent in their own language and English. For example, if the input text in English is, "I'm excited to try text to speech," and you select `es-ES-ElviraNeural`, the text is spoken in English with a Spanish accent.

If the voice doesn't speak the language of the input text, the Speech service doesn't create synthesized audio. For a full list of supported neural voices, see [Language and voice support for the Speech service](../../../language-support.md?tabs=tts).

> [!NOTE]
> The default voice is the first voice returned per locale from the [Voice List API](../../../rest-text-to-speech.md#get-a-list-of-voices).

The voice that speaks is determined in order of priority as follows:

- If you don't set `SpeechSynthesisVoiceName` or `SpeechSynthesisLanguage`, the default voice for `en-US` speaks.
- If you only set `SpeechSynthesisLanguage`, the default voice for the specified locale speaks.
- If both `SpeechSynthesisVoiceName` and `SpeechSynthesisLanguage` are set, the `SpeechSynthesisLanguage` setting is ignored. The voice that you specify by using `SpeechSynthesisVoiceName` speaks.
- If the voice element is set by using [Speech Synthesis Markup Language (SSML)](../../../speech-synthesis-markup.md), the `SpeechSynthesisVoiceName` and `SpeechSynthesisLanguage` settings are ignored.

## Synthesize speech to a file

Create a [SpeechSynthesizer](/cpp/cognitive-services/speech/speechsynthesizer) object. This object shown in the following snippets runs text to speech conversions and outputs to speakers, files, or other output streams. `SpeechSynthesizer` accepts as parameters:

- The [SpeechConfig](/cpp/cognitive-services/speech/speechconfig) object that you created in the previous step.
- An [AudioConfig](/cpp/cognitive-services/speech/audio-audioconfig) object that specifies how output results should be handled.

1. Create an `AudioConfig` instance to automatically write the output to a *.wav* file by using the `FromWavFileOutput()` function:

   ```cpp
   void synthesizeSpeech()
   {
       auto speechConfig = SpeechConfig::FromSubscription("YourSpeechKey", "YourSpeechRegion");
       auto audioConfig = AudioConfig::FromWavFileOutput("path/to/write/file.wav");
   }
   ```

1. Instantiate a `SpeechSynthesizer` instance. Pass your `speechConfig` object and the `audioConfig` object as parameters. To synthesize speech and write to a file, run `SpeakTextAsync()` with a string of text.

   ```cpp
   void synthesizeSpeech()
   {
       auto speechConfig = SpeechConfig::FromSubscription("YourSpeechKey", "YourSpeechRegion");
       auto audioConfig = AudioConfig::FromWavFileOutput("path/to/write/file.wav");
       auto speechSynthesizer = SpeechSynthesizer::FromConfig(speechConfig, audioConfig);
       auto result = speechSynthesizer->SpeakTextAsync("A simple test to write to a file.").get();
   }
   ```

When you run the program, it creates a synthesized *.wav* file, which is written to the location that you specify. This result is a good example of the most basic usage. Next, you can customize output and handle the output response as an in-memory stream for working with custom scenarios.

## Synthesize to speaker output

To output synthesized speech to the current active output device such as a speaker, omit the `AudioConfig` parameter when you create the `SpeechSynthesizer` instance. Here's an example:

```cpp
void synthesizeSpeech()
{
    auto speechConfig = SpeechConfig::FromSubscription("YourSpeechKey", "YourSpeechRegion");
    auto speechSynthesizer = SpeechSynthesizer::FromConfig(speechConfig);
    auto result = speechSynthesizer->SpeakTextAsync("I'm excited to try text to speech").get();
}
```

## Get a result as an in-memory stream

You can use the resulting audio data as an in-memory stream rather than directly writing to a file. With in-memory stream, you can build custom behavior:

- Abstract the resulting byte array as a seekable stream for custom downstream services.
- Integrate the result with other APIs or services.
- Modify the audio data, write custom .wav headers, and do related tasks.

You can make this change to the previous example. First, remove the `AudioConfig` block, because you manage the output behavior manually from this point onward for increased control. Pass `NULL` for `AudioConfig` in the `SpeechSynthesizer` constructor.

> [!NOTE]
> Passing `NULL` for `AudioConfig`, rather than omitting it as in the previous speaker output example, doesn't play the audio by default on the current active output device.

Save the result to a [SpeechSynthesisResult](/cpp/cognitive-services/speech/speechsynthesisresult) variable. The `GetAudioData` getter returns a `byte []` instance for the output data. You can work with this `byte []` instance manually, or you can use the [AudioDataStream](/cpp/cognitive-services/speech/audiodatastream) class to manage the in-memory stream.

In this example, use the `AudioDataStream.FromResult()` static function to get a stream from the result:

```cpp
void synthesizeSpeech()
{
    auto speechConfig = SpeechConfig::FromSubscription("YourSpeechKey", "YourSpeechRegion");
    auto speechSynthesizer = SpeechSynthesizer::FromConfig(speechConfig);

    auto result = speechSynthesizer->SpeakTextAsync("Getting the response as an in-memory stream.").get();
    auto stream = AudioDataStream::FromResult(result);
}
```

At this point, you can implement any custom behavior by using the resulting `stream` object.

## Customize audio format

You can customize audio output attributes, including:

- Audio file type
- Sample rate
- Bit depth

To change the audio format, use the `SetSpeechSynthesisOutputFormat()` function on the `SpeechConfig` object. This function expects an `enum` instance of type [SpeechSynthesisOutputFormat](/cpp/cognitive-services/speech/microsoft-cognitiveservices-speech-namespace#speechsynthesisoutputformat). Use the `enum` to select the output format. For available formats, see the [list of audio formats](/cpp/cognitive-services/speech/microsoft-cognitiveservices-speech-namespace#speechsynthesisoutputformat).

There are various options for different file types, depending on your requirements. By definition, raw formats like `Raw24Khz16BitMonoPcm` don't include audio headers. Use raw formats only in one of these situations:

- You know that your downstream implementation can decode a raw bitstream.
- You plan to manually build headers based on factors like bit depth, sample rate, and number of channels.

This example specifies the high-fidelity RIFF format `Riff24Khz16BitMonoPcm` by setting `SpeechSynthesisOutputFormat` on the `SpeechConfig` object. Similar to the example in the previous section, you use [`AudioDataStream`](/cpp/cognitive-services/speech/audiodatastream) to get an in-memory stream of the result, and then write it to a file.

```cpp
void synthesizeSpeech()
{
    auto speechConfig = SpeechConfig::FromSubscription("YourSpeechKey", "YourSpeechRegion");
    speechConfig->SetSpeechSynthesisOutputFormat(SpeechSynthesisOutputFormat::Riff24Khz16BitMonoPcm);

    auto speechSynthesizer = SpeechSynthesizer::FromConfig(speechConfig);
    auto result = speechSynthesizer->SpeakTextAsync("A simple test to write to a file.").get();

    auto stream = AudioDataStream::FromResult(result);
    stream->SaveToWavFileAsync("path/to/write/file.wav").get();
}
```

When you run the program, it writes a *.wav* file to the specified path.

## Use SSML to customize speech characteristics

You can use SSML to fine-tune the pitch, pronunciation, speaking rate, volume, and other aspects in the text to speech output by submitting your requests from an XML schema. This section shows an example of changing the voice. For more information, see [Speech Synthesis Markup Language overview](../../../speech-synthesis-markup.md).

To start using SSML for customization, make a minor change that switches the voice.

1. Create a new XML file for the SSML configuration in your root project directory.

   ```xml
   <speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US">
     <voice name="en-US-AvaMultilingualNeural">
       When you're on the freeway, it's a good idea to use a GPS.
     </voice>
   </speak>
   ```

   In this example, the file is *ssml.xml*. The root element is always `<speak>`. Wrapping the text in a `<voice>` element allows you to change the voice by using the `name` parameter. For the full list of supported neural voices, see [Supported languages](../../../language-support.md?tabs=tts).

1. Change the speech synthesis request to reference your XML file. The request is mostly the same. Instead of using the `SpeakTextAsync()` function, you use `SpeakSsmlAsync()`. This function expects an XML string. First, load your SSML configuration as a string. From this point, the result object is exactly the same as previous examples.

   ```cpp
   void synthesizeSpeech()
   {
       auto speechConfig = SpeechConfig::FromSubscription("YourSpeechKey", "YourSpeechRegion");
       auto speechSynthesizer = SpeechSynthesizer::FromConfig(speechConfig);

       std::ifstream file("./ssml.xml");
       std::string ssml, line;
       while (std::getline(file, line))
       {
           ssml += line;
           ssml.push_back('\n');
       }
       auto result = speechSynthesizer->SpeakSsmlAsync(ssml).get();

       auto stream = AudioDataStream::FromResult(result);
       stream->SaveToWavFileAsync("path/to/write/file.wav").get();
   }
   ```

> [!NOTE]
> To change the voice without using SSML, you can set the property on `SpeechConfig` by using `SpeechConfig.SetSpeechSynthesisVoiceName("en-US-AndrewMultilingualNeural")`.

## Subscribe to synthesizer events

You might want more insights about the text to speech processing and results. For example, you might want to know when the synthesizer starts and stops, or you might want to know about other events encountered during synthesis.

While using the [SpeechSynthesizer](/cpp/cognitive-services/speech/speechsynthesizer) for text to speech, you can subscribe to the events in this table:

[!INCLUDE [Event types](events.md)]

Here's an example that shows how to subscribe to events for speech synthesis. You can follow the instructions in the [quickstart](../../../get-started-text-to-speech.md?pivots=cpp), but replace the contents of that *main.cpp* file with the following code:

```cpp
#include <iostream> 
#include <stdlib.h>
#include <speechapi_cxx.h>

using namespace Microsoft::CognitiveServices::Speech;
using namespace Microsoft::CognitiveServices::Speech::Audio;

std::string getEnvironmentVariable(const char* name);

int main()
{
    // This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
    auto speechKey = getEnvironmentVariable("SPEECH_KEY");
    auto speechRegion = getEnvironmentVariable("SPEECH_REGION");

    if ((size(speechKey) == 0) || (size(speechRegion) == 0)) {
        std::cout << "Please set both SPEECH_KEY and SPEECH_REGION environment variables." << std::endl;
        return -1;
    }

    auto speechConfig = SpeechConfig::FromSubscription(speechKey, speechRegion);

    // Required for WordBoundary event sentences.
    speechConfig->SetProperty(PropertyId::SpeechServiceResponse_RequestSentenceBoundary, "true");

    const auto ssml = R"(<speak version='1.0' xml:lang='en-US' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='http://www.w3.org/2001/mstts'>
        <voice name = 'en-US-AvaMultilingualNeural'>
            <mstts:viseme type = 'redlips_front' />
            The rainbow has seven colors : <bookmark mark = 'colors_list_begin' />Red, orange, yellow, green, blue, indigo, and violet.<bookmark mark = 'colors_list_end' />.
        </voice>
        </speak>)";

    auto speechSynthesizer = SpeechSynthesizer::FromConfig(speechConfig);

    // Subscribe to events

    speechSynthesizer->BookmarkReached += [](const SpeechSynthesisBookmarkEventArgs& e)
    {
        std::cout << "Bookmark reached. "
            << "\r\n\tAudioOffset: " << round(e.AudioOffset / 10000) << "ms"
            << "\r\n\tText: " << e.Text << std::endl;
    };

    speechSynthesizer->SynthesisCanceled += [](const SpeechSynthesisEventArgs& e)
    {
        std::cout << "SynthesisCanceled event" << std::endl;
    };

    speechSynthesizer->SynthesisCompleted += [](const SpeechSynthesisEventArgs& e)
    {
        auto audioDuration = std::chrono::duration_cast<std::chrono::milliseconds>(e.Result->AudioDuration).count();

        std::cout << "SynthesisCompleted event:"
            << "\r\n\tAudioData: " << e.Result->GetAudioData()->size() << "bytes"
            << "\r\n\tAudioDuration: " << audioDuration << std::endl;
    };

    speechSynthesizer->SynthesisStarted += [](const SpeechSynthesisEventArgs& e)
    {
        std::cout << "SynthesisStarted event" << std::endl;
    };

    speechSynthesizer->Synthesizing += [](const SpeechSynthesisEventArgs& e)
    {
        std::cout << "Synthesizing event:"
            << "\r\n\tAudioData: " << e.Result->GetAudioData()->size() << "bytes" << std::endl;
    };

    speechSynthesizer->VisemeReceived += [](const SpeechSynthesisVisemeEventArgs& e)
    {
        std::cout << "VisemeReceived event:"
            << "\r\n\tAudioOffset: " << round(e.AudioOffset / 10000) << "ms"
            << "\r\n\tVisemeId: " << e.VisemeId << std::endl;
    };

    speechSynthesizer->WordBoundary += [](const SpeechSynthesisWordBoundaryEventArgs& e)
    {
        auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(e.Duration).count();
        
        auto boundaryType = "";
        switch (e.BoundaryType) {
        case SpeechSynthesisBoundaryType::Punctuation:
            boundaryType = "Punctuation";
            break;
        case SpeechSynthesisBoundaryType::Sentence:
            boundaryType = "Sentence";
            break;
        case SpeechSynthesisBoundaryType::Word:
            boundaryType = "Word";
            break;
        }

        std::cout << "WordBoundary event:"
            // Word, Punctuation, or Sentence
            << "\r\n\tBoundaryType: " << boundaryType
            << "\r\n\tAudioOffset: " << round(e.AudioOffset / 10000) << "ms"
            << "\r\n\tDuration: " << duration
            << "\r\n\tText: \"" << e.Text << "\""
            << "\r\n\tTextOffset: " << e.TextOffset
            << "\r\n\tWordLength: " << e.WordLength << std::endl;
    };

    auto result = speechSynthesizer->SpeakSsmlAsync(ssml).get();

    // Checks result.
    if (result->Reason == ResultReason::SynthesizingAudioCompleted)
    {
        std::cout << "SynthesizingAudioCompleted result" << std::endl;
    }
    else if (result->Reason == ResultReason::Canceled)
    {
        auto cancellation = SpeechSynthesisCancellationDetails::FromResult(result);
        std::cout << "CANCELED: Reason=" << (int)cancellation->Reason << std::endl;

        if (cancellation->Reason == CancellationReason::Error)
        {
            std::cout << "CANCELED: ErrorCode=" << (int)cancellation->ErrorCode << std::endl;
            std::cout << "CANCELED: ErrorDetails=[" << cancellation->ErrorDetails << "]" << std::endl;
            std::cout << "CANCELED: Did you set the speech resource key and region values?" << std::endl;
        }
    }

    std::cout << "Press enter to exit..." << std::endl;
    std::cin.get();
}

std::string getEnvironmentVariable(const char* name)
{
#if defined(_MSC_VER)
    size_t requiredSize = 0;
    (void)getenv_s(&requiredSize, nullptr, 0, name);
    if (requiredSize == 0)
    {
        return "";
    }
    auto buffer = std::make_unique<char[]>(requiredSize);
    (void)getenv_s(&requiredSize, buffer.get(), requiredSize, name);
    return buffer.get();
#else
    auto value = getenv(name);
    return value ? value : "";
#endif
}
```

You can find more text to speech samples at [GitHub](https://aka.ms/csspeech/samples).

## Use a custom endpoint

The custom endpoint is functionally identical to the standard endpoint that's used for text to speech requests. 

One difference is that the `EndpointId` must be specified to use your custom voice via the Speech SDK. You can start with the [text to speech quickstart](../../../get-started-text-to-speech.md) and then update the code with the `EndpointId` and `SpeechSynthesisVoiceName`.

```cpp
auto speechConfig = SpeechConfig::FromSubscription(speechKey, speechRegion);
speechConfig->SetSpeechSynthesisVoiceName("YourCustomVoiceName");
speechConfig->SetEndpointId("YourEndpointId");
```

To use a custom voice via [Speech Synthesis Markup Language (SSML)](../../../speech-synthesis-markup-voice.md#use-voice-elements), specify the model name as the voice name. This example uses the `YourCustomVoiceName` voice. 

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice name="YourCustomVoiceName">
        This is the text that is spoken. 
    </voice>
</speak>
```

## Run and use a container

Speech containers provide websocket-based query endpoint APIs that are accessed through the Speech SDK and Speech CLI. By default, the Speech SDK and Speech CLI use the public Speech service. To use the container, you need to change the initialization method. Use a container host URL instead of key and region.

For more information about containers, see [Install and run Speech containers with Docker](../../../speech-container-howto.md).
