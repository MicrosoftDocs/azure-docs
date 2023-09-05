---
title: How to lower speech synthesis latency using Speech SDK
titleSuffix: Azure AI services
description: How to lower speech synthesis latency using Speech SDK, including streaming, pre-connection, and so on.
services: cognitive-services
author: yulin-li
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 04/29/2021
ms.author: yulili
ms.custom: references_regions, devx-track-extended-java, devx-track-python
zone_pivot_groups: programming-languages-set-nineteen
---

# Lower speech synthesis latency using Speech SDK

The synthesis latency is critical to your applications.
In this article, we will introduce the best practices to lower the latency and bring the best performance to your end users.

Normally, we measure the latency by `first byte latency` and `finish latency`, as follows:

::: zone pivot="programming-language-csharp"

| Latency | Description | [SpeechSynthesisResult](/dotnet/api/microsoft.cognitiveservices.speech.speechsynthesisresult) property key |
|-----------|-------------|------------|
| first byte latency | Indicates the time delay between the start of the synthesis task and receipt of the first chunk of audio data. | SpeechServiceResponse_SynthesisFirstByteLatencyMs |
| finish latency | Indicates the time delay between the start of the synthesis task and the receipt of the whole synthesized audio data. | SpeechServiceResponse_SynthesisFinishLatencyMs |

The Speech SDK puts the latency durations in the Properties collection of [`SpeechSynthesisResult`](/dotnet/api/microsoft.cognitiveservices.speech.speechsynthesisresult). The following sample code shows these values.

```csharp
var result = await synthesizer.SpeakTextAsync(text);
Console.WriteLine($"first byte latency: \t{result.Properties.GetProperty(PropertyId.SpeechServiceResponse_SynthesisFirstByteLatencyMs)} ms");
Console.WriteLine($"finish latency: \t{result.Properties.GetProperty(PropertyId.SpeechServiceResponse_SynthesisFinishLatencyMs)} ms");
// you can also get the result id, and send to us when you need help for diagnosis
var resultId = result.ResultId;
```

::: zone-end

::: zone pivot="programming-language-cpp"

| Latency | Description | [SpeechSynthesisResult](/cpp/cognitive-services/speech/speechsynthesisresult) property key |
|-----------|-------------|------------|
| `first byte latency` | Indicates the time delay between the synthesis starts and the first audio chunk is received. | `SpeechServiceResponse_SynthesisFirstByteLatencyMs` |
| `finish latency` | Indicates the time delay between the synthesis starts and the whole synthesized audio is received. | `SpeechServiceResponse_SynthesisFinishLatencyMs` |

The Speech SDK measured the latencies and puts them in the property bag of [`SpeechSynthesisResult`](/cpp/cognitive-services/speech/speechsynthesisresult). Refer following codes to get them.

```cpp
auto result = synthesizer->SpeakTextAsync(text).get();
auto firstByteLatency = std::stoi(result->Properties.GetProperty(PropertyId::SpeechServiceResponse_SynthesisFirstByteLatencyMs));
auto finishedLatency = std::stoi(result->Properties.GetProperty(PropertyId::SpeechServiceResponse_SynthesisFinishLatencyMs));
// you can also get the result id, and send to us when you need help for diagnosis
auto resultId = result->ResultId;
```

::: zone-end

::: zone pivot="programming-language-java"

| Latency | Description | [SpeechSynthesisResult](/java/api/com.microsoft.cognitiveservices.speech.speechsynthesisresult) property key |
|-----------|-------------|------------|
| `first byte latency` | Indicates the time delay between the synthesis starts and the first audio chunk is received. | `SpeechServiceResponse_SynthesisFirstByteLatencyMs` |
| `finish latency` | Indicates the time delay between the synthesis starts and the whole synthesized audio is received. | `SpeechServiceResponse_SynthesisFinishLatencyMs` |

The Speech SDK measured the latencies and puts them in the property bag of [`SpeechSynthesisResult`](/java/api/com.microsoft.cognitiveservices.speech.speechsynthesisresult). Refer following codes to get them.

```java
SpeechSynthesisResult result = synthesizer.SpeakTextAsync(text).get();
System.out.println("first byte latency: \t" + result.getProperties().getProperty(PropertyId.SpeechServiceResponse_SynthesisFirstByteLatencyMs) + " ms.");
System.out.println("finish latency: \t" + result.getProperties().getProperty(PropertyId.SpeechServiceResponse_SynthesisFinishLatencyMs) + " ms.");
// you can also get the result id, and send to us when you need help for diagnosis
String resultId = result.getResultId();
```

::: zone-end


::: zone pivot="programming-language-python"

| Latency | Description | [SpeechSynthesisResult](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechsynthesisresult) property key |
|-----------|-------------|------------|
| `first byte latency` | Indicates the time delay between the synthesis starts and the first audio chunk is received. | `SpeechServiceResponse_SynthesisFirstByteLatencyMs` |
| `finish latency` | Indicates the time delay between the synthesis starts and the whole synthesized audio is received. | `SpeechServiceResponse_SynthesisFinishLatencyMs` |

The Speech SDK measured the latencies and puts them in the property bag of [`SpeechSynthesisResult`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechsynthesisresult). Refer following codes to get them.

```python
result = synthesizer.speak_text_async(text).get()
first_byte_latency = int(result.properties.get_property(speechsdk.PropertyId.SpeechServiceResponse_SynthesisFirstByteLatencyMs))
finished_latency = int(result.properties.get_property(speechsdk.PropertyId.SpeechServiceResponse_SynthesisFinishLatencyMs))
# you can also get the result id, and send to us when you need help for diagnosis
result_id = result.result_id
```

::: zone-end

::: zone pivot="programming-language-objectivec"

| Latency | Description | [SPXSpeechSynthesisResult](/objectivec/cognitive-services/speech/spxspeechsynthesisresult) property key |
|-----------|-------------|------------|
| `first byte latency` | Indicates the time delay between the synthesis starts and the first audio chunk is received. | `SPXSpeechServiceResponseSynthesisFirstByteLatencyMs` |
| `finish latency` | Indicates the time delay between the synthesis starts and the whole synthesized audio is received. | `SPXSpeechServiceResponseSynthesisFinishLatencyMs` |

The Speech SDK measured the latencies and puts them in the property bag of [`SPXSpeechSynthesisResult`](/objectivec/cognitive-services/speech/spxspeechsynthesisresult). Refer following codes to get them.

```Objective-C
SPXSpeechSynthesisResult *speechResult = [speechSynthesizer speakText:text];
int firstByteLatency = [intString [speechResult.properties getPropertyById:SPXSpeechServiceResponseSynthesisFirstByteLatencyMs]];
int finishedLatency = [intString [speechResult.properties getPropertyById:SPXSpeechServiceResponseSynthesisFinishLatencyMs]];
// you can also get the result id, and send to us when you need help for diagnosis
NSString *resultId = result.resultId;
```

::: zone-end

The first byte latency is much lower than finish latency in most cases.
The first byte latency is independent from text length, while finish latency increases with text length.

Ideally, we want to minimize the user-experienced latency (the latency before user hears the sound) to one network route trip time plus the first audio chunk latency of the speech synthesis service.

## Streaming

Streaming is critical to lowering latency.
Client code can start playback when the first audio chunk is received.
In a service scenario, you can forward the audio chunks immediately to your clients instead of waiting for the whole audio.

::: zone pivot="programming-language-csharp"

You can use the [`PullAudioOutputStream`](/dotnet/api/microsoft.cognitiveservices.speech.audio.pullaudiooutputstream), [`PushAudioOutputStream`](/dotnet/api/microsoft.cognitiveservices.speech.audio.pushaudiooutputstream), [`Synthesizing` event](/dotnet/api/microsoft.cognitiveservices.speech.speechsynthesizer.synthesizing), and [`AudioDataStream`](/dotnet/api/microsoft.cognitiveservices.speech.audiodatastream) of the Speech SDK to enable streaming.

Taking `AudioDataStream` as an example:

```csharp
using (var synthesizer = new SpeechSynthesizer(config, null as AudioConfig))
{
    using (var result = await synthesizer.StartSpeakingTextAsync(text))
    {
        using (var audioDataStream = AudioDataStream.FromResult(result))
        {
            byte[] buffer = new byte[16000];
            uint filledSize = 0;
            while ((filledSize = audioDataStream.ReadData(buffer)) > 0)
            {
                Console.WriteLine($"{filledSize} bytes received.");
            }
        }
    }
}
```

::: zone-end

::: zone pivot="programming-language-cpp"

You can use the [`PullAudioOutputStream`](/cpp/cognitive-services/speech/audio-pullaudiooutputstream), [`PushAudioOutputStream`](/cpp/cognitive-services/speech/audio-pushaudiooutputstream), the [`Synthesizing` event](/cpp/cognitive-services/speech/speechsynthesizer#synthesizing), and [`AudioDataStream`](/cpp/cognitive-services/speech/audiodatastream) of the Speech SDK to enable streaming.

Taking `AudioDataStream` as an example:

```cpp
auto synthesizer = SpeechSynthesizer::FromConfig(config, nullptr);
auto result = synthesizer->SpeakTextAsync(text).get();
auto audioDataStream = AudioDataStream::FromResult(result);
uint8_t buffer[16000];
uint32_t filledSize = 0;
while ((filledSize = audioDataStream->ReadData(buffer, sizeof(buffer))) > 0)
{
    cout << filledSize << " bytes received." << endl;
}
```

::: zone-end

::: zone pivot="programming-language-java"

You can use the [`PullAudioOutputStream`](/java/api/com.microsoft.cognitiveservices.speech.audio.pullaudiooutputstream), [`PushAudioOutputStream`](/java/api/com.microsoft.cognitiveservices.speech.audio.pushaudiooutputstream), the [`Synthesizing` event](/java/api/com.microsoft.cognitiveservices.speech.speechsynthesizer.synthesizing#com_microsoft_cognitiveservices_speech_SpeechSynthesizer_Synthesizing), and [`AudioDataStream`](/java/api/com.microsoft.cognitiveservices.speech.audiodatastream) of the Speech SDK to enable streaming.

Taking `AudioDataStream` as an example:

```java
SpeechSynthesizer synthesizer = new SpeechSynthesizer(config, null);
SpeechSynthesisResult result = synthesizer.StartSpeakingTextAsync(text).get();
AudioDataStream audioDataStream = AudioDataStream.fromResult(result);
byte[] buffer = new byte[16000];
long filledSize = audioDataStream.readData(buffer);
while (filledSize > 0) {
    System.out.println(filledSize + " bytes received.");
    filledSize = audioDataStream.readData(buffer);
}
```

::: zone-end

::: zone pivot="programming-language-python"

You can use the [`PullAudioOutputStream`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.audio.pullaudiooutputstream), [`PushAudioOutputStream`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.audio.pushaudiooutputstream), the [`Synthesizing` event](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechsynthesizer#synthesizing), and [`AudioDataStream`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.audiodatastream) of the Speech SDK to enable streaming.

Taking `AudioDataStream` as an example:

```python
speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=None)
result = speech_synthesizer.start_speaking_text_async(text).get()
audio_data_stream = speechsdk.AudioDataStream(result)
audio_buffer = bytes(16000)
filled_size = audio_data_stream.read_data(audio_buffer)
while filled_size > 0:
    print("{} bytes received.".format(filled_size))
    filled_size = audio_data_stream.read_data(audio_buffer)
```

::: zone-end

::: zone pivot="programming-language-objectivec"

You can use the [`SPXPullAudioOutputStream`](/objectivec/cognitive-services/speech/spxpullaudiooutputstream), [`SPXPushAudioOutputStream`](/objectivec/cognitive-services/speech/spxpushaudiooutputstream), the [`Synthesizing` event](/objectivec/cognitive-services/speech/spxspeechsynthesizer#addsynthesizingeventhandler), and [`SPXAudioDataStream`](/objectivec/cognitive-services/speech/spxaudiodatastream) of the Speech SDK to enable streaming.

Taking `AudioDataStream` as an example:

```Objective-C
SPXSpeechSynthesizer *synthesizer = [[SPXSpeechSynthesizer alloc] initWithSpeechConfiguration:speechConfig audioConfiguration:nil];
SPXSpeechSynthesisResult *speechResult = [synthesizer startSpeakingText:inputText];
SPXAudioDataStream *stream = [[SPXAudioDataStream alloc] initFromSynthesisResult:speechResult];
NSMutableData* data = [[NSMutableData alloc]initWithCapacity:16000];
while ([stream readData:data length:16000] > 0) {
    // Read data here
}
```

::: zone-end

## Pre-connect and reuse SpeechSynthesizer

The Speech SDK uses a websocket to communicate with the service.
Ideally, the network latency should be one route trip time (RTT).
If the connection is newly established, the network latency will include extra time to establish the connection.
The establishment of a websocket connection needs the TCP handshake, SSL handshake, HTTP connection, and protocol upgrade, which introduces time delay.
To avoid the connection latency, we recommend pre-connecting and reusing the `SpeechSynthesizer`.

### Pre-connect

To pre-connect, establish a connection to the Speech service when you know the connection will be needed soon. For example, if you are building a speech bot in client, you can pre-connect to the speech synthesis service when the user starts to talk, and call `SpeakTextAsync` when the bot reply text is ready.

::: zone pivot="programming-language-csharp"

```csharp
using (var synthesizer = new SpeechSynthesizer(uspConfig, null as AudioConfig))
{
    using (var connection = Connection.FromSpeechSynthesizer(synthesizer))
    {
        connection.Open(true);
    }
    await synthesizer.SpeakTextAsync(text);
}
```

::: zone-end

::: zone pivot="programming-language-cpp"

```cpp
auto synthesizer = SpeechSynthesizer::FromConfig(config, nullptr);
auto connection = Connection::FromSpeechSynthesizer(synthesizer);
connection->Open(true);
```

::: zone-end

::: zone pivot="programming-language-java"

```java
SpeechSynthesizer synthesizer = new SpeechSynthesizer(speechConfig, (AudioConfig) null);
Connection connection = Connection.fromSpeechSynthesizer(synthesizer);
connection.openConnection(true);
```

::: zone-end

::: zone pivot="programming-language-python"

```python
synthesizer = speechsdk.SpeechSynthesizer(config, None)
connection = speechsdk.Connection.from_speech_synthesizer(synthesizer)
connection.open(True)
```

::: zone-end

::: zone pivot="programming-language-objectivec"

```Objective-C
SPXSpeechSynthesizer* synthesizer = [[SPXSpeechSynthesizer alloc]initWithSpeechConfiguration:self.speechConfig audioConfiguration:nil];
SPXConnection* connection = [[SPXConnection alloc]initFromSpeechSynthesizer:synthesizer];
[connection open:true];
```

::: zone-end

> [!NOTE]
> If the synthesize text is available, just call `SpeakTextAsync` to synthesize the audio. The SDK will handle the connection.

### Reuse SpeechSynthesizer

Another way to reduce the connection latency is to reuse the `SpeechSynthesizer` so you don't need to create a new `SpeechSynthesizer` for each synthesis.
We recommend using object pool in service scenario, see our sample code for [C#](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/csharp/sharedcontent/console/speech_synthesis_server_scenario_sample.cs) and [Java](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/java/jre/console/src/com/microsoft/cognitiveservices/speech/samples/console/SpeechSynthesisScenarioSamples.java).


## Transmit compressed audio over the network

When the network is unstable or with limited bandwidth, the payload size will also impact latency.
Meanwhile, a compressed audio format helps to save the users' network bandwidth, which is especially valuable for mobile users.

We support many compressed formats including `opus`, `webm`, `mp3`, `silk`, and so on, see the full list in [SpeechSynthesisOutputFormat](/cpp/cognitive-services/speech/microsoft-cognitiveservices-speech-namespace#speechsynthesisoutputformat).
For example, the bitrate of `Riff24Khz16BitMonoPcm` format is 384 kbps, while `Audio24Khz48KBitRateMonoMp3` only costs 48 kbps.
Our Speech SDK will automatically use a compressed format for transmission when a `pcm` output format is set.
For Linux and Windows, `GStreamer` is required to enable this feature.
Refer [this instruction](how-to-use-codec-compressed-audio-input-streams.md) to install and configure `GStreamer` for Speech SDK.
For Android, iOS and macOS, no extra configuration is needed starting version 1.20.

## Others tips

### Cache CRL files

The Speech SDK uses CRL files to check the certification.
Caching the CRL files until expired helps you avoid downloading CRL files every time.
See [How to configure OpenSSL for Linux](how-to-configure-openssl-linux.md#certificate-revocation-checks) for details.

### Use latest Speech SDK

We keep improving the Speech SDK's performance, so try to use the latest Speech SDK in your application.

## Load test guideline

You may use load test to test the speech synthesis service capacity and latency.
Here are some guidelines.

 - The speech synthesis service has the ability to autoscale, but takes time to scale out. If the concurrency is increased in a short time, the client may get long latency or `429` error code (too many requests). So, we recommend you increase your concurrency step by step in load test. [See this article](speech-services-quotas-and-limits.md#general-best-practices-to-mitigate-throttling-during-autoscaling) for more details, especially [this example of workload patterns](speech-services-quotas-and-limits.md#example-of-a-workload-pattern-best-practice).
 - You can leverage our sample using object pool ([C#](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/csharp/sharedcontent/console/speech_synthesis_server_scenario_sample.cs) and [Java](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/java/jre/console/src/com/microsoft/cognitiveservices/speech/samples/console/SpeechSynthesisScenarioSamples.java)) for load test and getting the latency numbers. You can modify the test turns and concurrency in the sample to meet your target concurrency.
 - The service has quota limitation based on the real traffic, therefore, if you want to perform load test with the concurrency much higher than your real traffic, connect before your test.

## Next steps

* [See the samples](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master) on GitHub
