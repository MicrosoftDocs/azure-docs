---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 08/30/2023
ms.author: eur
ms.custom: devx-track-csharp
---

[!INCLUDE [Header](../../common/csharp.md)]

[!INCLUDE [Introduction](intro.md)]

## Select synthesis language and voice

The text to speech feature in the Speech service supports more than 400 voices and more than 140 languages and variants. You can get the [full list](../../../language-support.md?tabs=tts) or try them in the [Voice Gallery](https://speech.microsoft.com/portal/voicegallery).

Specify the language or voice of `SpeechConfig` to match your input text and use the specified voice. The following code snippet shows how this technique works:

```csharp
static async Task SynthesizeAudioAsync()
{
    var speechConfig = SpeechConfig.FromSubscription("YourSpeechKey", "YourSpeechRegion");
    // Set either the `SpeechSynthesisVoiceName` or `SpeechSynthesisLanguage`.
    speechConfig.SpeechSynthesisLanguage = "en-US"; 
    speechConfig.SpeechSynthesisVoiceName = "en-US-JennyNeural";
}
```

All neural voices are multilingual and fluent in their own language and English. For example, if the input text in English, is "I'm excited to try text to speech," and you select `es-ES-ElviraNeural`, the text is spoken in English with a Spanish accent.

If the voice doesn't speak the language of the input text, the Speech service doesn't create synthesized audio. For a full list of supported neural voices, see [Language and voice support for the Speech service](../../../language-support.md?tabs=tts).

> [!NOTE]
> The default voice is the first voice returned per locale from the [Voice List API](../../../rest-text-to-speech.md#get-a-list-of-voices).

The voice that speaks is determined in order of priority as follows:

- If you don't set `SpeechSynthesisVoiceName` or `SpeechSynthesisLanguage`, the default voice for `en-US` speaks.
- If you only set `SpeechSynthesisLanguage`, the default voice for the specified locale speaks.
- If both `SpeechSynthesisVoiceName` and `SpeechSynthesisLanguage` are set, the `SpeechSynthesisLanguage` setting is ignored. The voice that you specify by using `SpeechSynthesisVoiceName` speaks.
- If the voice element is set by using [Speech Synthesis Markup Language (SSML)](../../../speech-synthesis-markup.md), the `SpeechSynthesisVoiceName` and `SpeechSynthesisLanguage` settings are ignored.

## Synthesize speech to a file

Create a [SpeechSynthesizer](/dotnet/api/microsoft.cognitiveservices.speech.speechsynthesizer) object. This object shown in the following snippets runs text to speech conversions and outputs to speakers, files, or other output streams. `SpeechSynthesizer` accepts as parameters:

- The [SpeechConfig](/dotnet/api/microsoft.cognitiveservices.speech.speechconfig) object that you created in the previous step.
- An [AudioConfig](/dotnet/api/microsoft.cognitiveservices.speech.audio.audioconfig) object that specifies how output results should be handled.

1. Create an `AudioConfig` instance to automatically write the output to a *.wav* file by using the `FromWavFileOutput()` function. Instantiate it with a `using` statement.

   ```csharp
   static async Task SynthesizeAudioAsync()
   {
       var speechConfig = SpeechConfig.FromSubscription("YourSpeechKey", "YourSpeechRegion");
       using var audioConfig = AudioConfig.FromWavFileOutput("path/to/write/file.wav");
   }
   ```

   A `using` statement in this context automatically disposes of unmanaged resources and causes the object to go out of scope after disposal.

1. Instantiate a `SpeechSynthesizer` instance with another `using` statement. Pass your `speechConfig` object and the `audioConfig` object as parameters. To synthesize speech and write to a file, run `SpeakTextAsync()` with a string of text.

```csharp
static async Task SynthesizeAudioAsync()
{
    var speechConfig = SpeechConfig.FromSubscription("YourSpeechKey", "YourSpeechRegion");
    using var audioConfig = AudioConfig.FromWavFileOutput("path/to/write/file.wav");
    using var speechSynthesizer = new SpeechSynthesizer(speechConfig, audioConfig);
    await speechSynthesizer.SpeakTextAsync("I'm excited to try text to speech");
}
```

When you run the program, it creates a synthesized *.wav* file, which is written to the location that you specify. This result is a good example of the most basic usage. Next, you can customize output and handle the output response as an in-memory stream for working with custom scenarios.

## Synthesize to speaker output

To output synthesized speech to the current active output device such as a speaker, omit the `AudioConfig` parameter when you're creating the `SpeechSynthesizer` instance. Here's an example:

```csharp
static async Task SynthesizeAudioAsync()
{
    var speechConfig = SpeechConfig.FromSubscription("YourSpeechKey", "YourSpeechRegion");
    using var speechSynthesizer = new SpeechSynthesizer(speechConfig);
    await speechSynthesizer.SpeakTextAsync("I'm excited to try text to speech");
}
```

## Get a result as an in-memory stream

You can use the resulting audio data as an in-memory stream rather than directly writing to a file. With in-memory stream, you can build custom behavior:

- Abstract the resulting byte array as a seekable stream for custom downstream services.
- Integrate the result with other APIs or services.
- Modify the audio data, write custom .wav headers, and do related tasks.

You can make this change to the previous example. First, remove the `AudioConfig` block, because you manage the output behavior manually from this point onward for increased control. Pass `null` for `AudioConfig` in the `SpeechSynthesizer` constructor.

> [!NOTE]
> Passing `null` for `AudioConfig`, rather than omitting it as in the previous speaker output example, doesn't play the audio by default on the current active output device.

Save the result to a [SpeechSynthesisResult](/dotnet/api/microsoft.cognitiveservices.speech.speechsynthesisresult) variable. The `AudioData` property contains a `byte []` instance for the output data. You can work with this `byte []` instance manually, or you can use the [AudioDataStream](/dotnet/api/microsoft.cognitiveservices.speech.audiodatastream) class to manage the in-memory stream.

In this example, you use the `AudioDataStream.FromResult()` static function to get a stream from the result:

```csharp
static async Task SynthesizeAudioAsync()
{
    var speechConfig = SpeechConfig.FromSubscription("YourSpeechKey", "YourSpeechRegion");
    using var speechSynthesizer = new SpeechSynthesizer(speechConfig, null);

    var result = await speechSynthesizer.SpeakTextAsync("I'm excited to try text to speech");
    using var stream = AudioDataStream.FromResult(result);
}
```

At this point, you can implement any custom behavior by using the resulting `stream` object.

## Customize audio format

You can customize audio output attributes, including:

- Audio file type
- Sample rate
- Bit depth

To change the audio format, you use the `SetSpeechSynthesisOutputFormat()` function on the `SpeechConfig` object. This function expects an `enum` instance of type [SpeechSynthesisOutputFormat](/dotnet/api/microsoft.cognitiveservices.speech.speechsynthesisoutputformat).  Use the `enum` to select the output format. For available formats, see the [list of audio formats](/dotnet/api/microsoft.cognitiveservices.speech.speechsynthesisoutputformat).

There are various options for different file types, depending on your requirements. By definition, raw formats like `Raw24Khz16BitMonoPcm` don't include audio headers. Use raw formats only in one of these situations:

- You know that your downstream implementation can decode a raw bitstream.
- You plan to manually build headers based on factors like bit depth, sample rate, and number of channels.

This example specifies the high-fidelity RIFF format `Riff24Khz16BitMonoPcm` by setting `SpeechSynthesisOutputFormat` on the `SpeechConfig` object. Similar to the example in the previous section, you use [AudioDataStream](/dotnet/api/microsoft.cognitiveservices.speech.audiodatastream) to get an in-memory stream of the result, and then write it to a file.

```csharp
static async Task SynthesizeAudioAsync()
{
    var speechConfig = SpeechConfig.FromSubscription("YourSpeechKey", "YourSpeechRegion");
    speechConfig.SetSpeechSynthesisOutputFormat(SpeechSynthesisOutputFormat.Riff24Khz16BitMonoPcm);

    using var speechSynthesizer = new SpeechSynthesizer(speechConfig, null);
    var result = await speechSynthesizer.SpeakTextAsync("I'm excited to try text to speech");

    using var stream = AudioDataStream.FromResult(result);
    await stream.SaveToWaveFileAsync("path/to/write/file.wav");
}
```

When you run the program, it writes a *.wav* file to the specified path.

## Use SSML to customize speech characteristics

You can use SSML to fine-tune the pitch, pronunciation, speaking rate, volume,  and other aspects in the text to speech output by submitting your requests from an XML schema. This section shows an example of changing the voice. For more information, see [Speech Synthesis Markup Language overview](../../../speech-synthesis-markup.md).

To start using SSML for customization, you make a minor change that switches the voice.

1. Create a new XML file for the SSML configuration in your root project directory.

   ```xml
   <speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US">
     <voice name="en-US-JennyNeural">
       When you're on the freeway, it's a good idea to use a GPS.
     </voice>
   </speak>
   ```

   In this example, the file is *ssml.xml*. The root element is always `<speak>`. Wrapping the text in a `<voice>` element allows you to change the voice by using the `name` parameter. For the full list of supported neural voices, see [Supported languages](../../../language-support.md?tabs=tts).

1. Change the speech synthesis request to reference your XML file. The request is mostly the same, but instead of using the `SpeakTextAsync()` function, you use `SpeakSsmlAsync()`. This function expects an XML string. First, load your SSML configuration as a string by using `File.ReadAllText()`. From this point, the result object is exactly the same as previous examples.

   > [!NOTE]
   > If you're using Visual Studio, your build configuration likely won't find your XML file by default. Right-click the XML file and select **Properties**. Change **Build Action** to **Content**. Change **Copy to Output Directory** to **Copy always**.

   ```csharp
   public static async Task SynthesizeAudioAsync()
   {
       var speechConfig = SpeechConfig.FromSubscription("YourSpeechKey", "YourSpeechRegion");
       using var speechSynthesizer = new SpeechSynthesizer(speechConfig, null);

       var ssml = File.ReadAllText("./ssml.xml");
       var result = await speechSynthesizer.SpeakSsmlAsync(ssml);

       using var stream = AudioDataStream.FromResult(result);
       await stream.SaveToWaveFileAsync("path/to/write/file.wav");
   }
   ```

> [!NOTE]
> To change the voice without using SSML, you can set the property on `SpeechConfig` by using `SpeechConfig.SpeechSynthesisVoiceName = "en-US-JennyNeural";`.

## Subscribe to synthesizer events

You might want more insights about the text to speech processing and results. For example, you might want to know when the synthesizer starts and stops, or you might want to know about other events encountered during synthesis.

While using the [SpeechSynthesizer](/dotnet/api/microsoft.cognitiveservices.speech.speechsynthesizer) for text to speech, you can subscribe to the events in this table:

[!INCLUDE [Event types](events.md)]

Here's an example that shows how to subscribe to events for speech synthesis. You can follow the instructions in the [quickstart](../../../get-started-text-to-speech.md?pivots=csharp), but replace the contents of that *Program.cs* file with the following C# code:

```csharp
using Microsoft.CognitiveServices.Speech;

class Program 
{
    // This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
    static string speechKey = Environment.GetEnvironmentVariable("SPEECH_KEY");
    static string speechRegion = Environment.GetEnvironmentVariable("SPEECH_REGION");

    async static Task Main(string[] args)
    {
        var speechConfig = SpeechConfig.FromSubscription(speechKey, speechRegion);
         
        var speechSynthesisVoiceName  = "en-US-JennyNeural";  
        var ssml = @$"<speak version='1.0' xml:lang='en-US' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='http://www.w3.org/2001/mstts'>
            <voice name='{speechSynthesisVoiceName}'>
                <mstts:viseme type='redlips_front'/>
                The rainbow has seven colors: <bookmark mark='colors_list_begin'/>Red, orange, yellow, green, blue, indigo, and violet.<bookmark mark='colors_list_end'/>.
            </voice>
        </speak>";

        // Required for sentence-level WordBoundary events
        speechConfig.SetProperty(PropertyId.SpeechServiceResponse_RequestSentenceBoundary, "true");

        using (var speechSynthesizer = new SpeechSynthesizer(speechConfig))
        {
            // Subscribe to events

            speechSynthesizer.BookmarkReached += (s, e) =>
            {
                Console.WriteLine($"BookmarkReached event:" +
                    $"\r\n\tAudioOffset: {(e.AudioOffset + 5000) / 10000}ms" +
                    $"\r\n\tText: \"{e.Text}\".");
            };

            speechSynthesizer.SynthesisCanceled += (s, e) =>
            {
                Console.WriteLine("SynthesisCanceled event");
            };

            speechSynthesizer.SynthesisCompleted += (s, e) =>
            {                
                Console.WriteLine($"SynthesisCompleted event:" +
                    $"\r\n\tAudioData: {e.Result.AudioData.Length} bytes" +
                    $"\r\n\tAudioDuration: {e.Result.AudioDuration}");
            };

            speechSynthesizer.SynthesisStarted += (s, e) =>
            {
                Console.WriteLine("SynthesisStarted event");
            };

            speechSynthesizer.Synthesizing += (s, e) =>
            {
                Console.WriteLine($"Synthesizing event:" +
                    $"\r\n\tAudioData: {e.Result.AudioData.Length} bytes");
            };

            speechSynthesizer.VisemeReceived += (s, e) =>
            {
                Console.WriteLine($"VisemeReceived event:" +
                    $"\r\n\tAudioOffset: {(e.AudioOffset + 5000) / 10000}ms" +
                    $"\r\n\tVisemeId: {e.VisemeId}");
            };

            speechSynthesizer.WordBoundary += (s, e) =>
            {
                Console.WriteLine($"WordBoundary event:" +
                    // Word, Punctuation, or Sentence
                    $"\r\n\tBoundaryType: {e.BoundaryType}" +
                    $"\r\n\tAudioOffset: {(e.AudioOffset + 5000) / 10000}ms" +
                    $"\r\n\tDuration: {e.Duration}" +
                    $"\r\n\tText: \"{e.Text}\"" +
                    $"\r\n\tTextOffset: {e.TextOffset}" +
                    $"\r\n\tWordLength: {e.WordLength}");
            };

            // Synthesize the SSML
            Console.WriteLine($"SSML to synthesize: \r\n{ssml}");
            var speechSynthesisResult = await speechSynthesizer.SpeakSsmlAsync(ssml);

            // Output the results
            switch (speechSynthesisResult.Reason)
            {
                case ResultReason.SynthesizingAudioCompleted:
                    Console.WriteLine("SynthesizingAudioCompleted result");
                    break;
                case ResultReason.Canceled:
                    var cancellation = SpeechSynthesisCancellationDetails.FromResult(speechSynthesisResult);
                    Console.WriteLine($"CANCELED: Reason={cancellation.Reason}");

                    if (cancellation.Reason == CancellationReason.Error)
                    {
                        Console.WriteLine($"CANCELED: ErrorCode={cancellation.ErrorCode}");
                        Console.WriteLine($"CANCELED: ErrorDetails=[{cancellation.ErrorDetails}]");
                        Console.WriteLine($"CANCELED: Did you set the speech resource key and region values?");
                    }
                    break;
                default:
                    break;
            }
        }

        Console.WriteLine("Press any key to exit...");
        Console.ReadKey();
    }
}
```

You can find more text to speech samples at [GitHub](https://aka.ms/csspeech/samples).

## Run and use a container

Speech containers provide websocket-based query endpoint APIs that are accessed through the Speech SDK and Speech CLI. By default, the Speech SDK and Speech CLI use the public Speech service. To use the container, you need to change the initialization method. Use a container host URL instead of key and region.

For more information about containers, see [Install and run Speech containers with Docker](../../../speech-container-howto.md).
