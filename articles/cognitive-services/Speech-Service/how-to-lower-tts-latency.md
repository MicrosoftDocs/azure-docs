---
title: How to lower speech synthesis latency using Speech SDK
titleSuffix: Azure Cognitive Services
description: How to lower speech synthesis latency using Speech SDK, including streaming, pre-connection, and so on.
services: cognitive-services
author: yulin-li
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 04/29/2021
ms.author: yulili
ms.custom: references_regions
---

# How to lower speech synthesis latency using Speech SDK

> [!NOTE]
> Speech SDK 1.17.0 is required as the minimum version for this instruction.

The synthesis latency is critical to your applications.
In this article, we will introduce the best practices to lower the latency and bring the best performance to you and your end users.
Normally, we measure the latency by _`first byte latency`_ and _`finish latency`_, as follows:

| Latency | Description | Property in the property bag of `SpeechSynthesizer` |
|-----------|-------------|------------|
| `first byte latency` | Indicates the time delay between the synthesis starts and the first audio chunk is received. | `SpeechServiceResponse_SynthesisFirstByteLatencyMs` |
| `finish latency` | Indicates the time delay between the synthesis starts and the whole synthesized audio is received. | .SpeechServiceResponse_SynthesisFinishLatencyMs |

The Speech SDK measured the latencies and puts them in the property bag of [`SpeechSynthesisResult`](https://docs.microsoft.com/dotnet/api/microsoft.cognitiveservices.speech.speechsynthesisresult). Refer following codes to get them.

```cpp
auto result = synthesizer->SpeakTextAsync(text);
std::cout << "fist byte latency: \t" << std::stoi(result->Properties.GetProperty(PropertyId::SpeechServiceResponse_SynthesisFirstByteLatencyMs)) << " ms" << std::endl;
std::cout << "finish latency: \t" << std::stoi(result->Properties.GetProperty(PropertyId::SpeechServiceResponse_SynthesisFinishLatencyMs)) << " ms" << std::endl;
```

The `first byte latency` is much lower than `finish latency` in most cases.
And the `first byte latency` is almost independent with the text length, while `finish latency` increases with the text length.

Ideally, we want to minimum the user-experienced latency (the latency before user hears the sound) to one network route trip time plus the first audio chunk latency of the speech synthesis service.

## Streaming

Streaming is critical to lower the latency,
In client side, the playback could be started when the first audio chunk is received.
In service scenario, you can forward the audio chunks immediately to your clients instead of waiting for the whole audio.

You can use the [`PullAudioOutputStream`](https://docs.microsoft.com/dotnet/api/microsoft.cognitiveservices.speech.audio.pullaudiooutputstream), [`PushAudioOutputStream`](https://docs.microsoft.com/dotnet/api/microsoft.cognitiveservices.speech.audio.pushaudiooutputstream), [`Synthesizing` event](https://docs.microsoft.com/dotnet/api/microsoft.cognitiveservices.speech.speechsynthesizer.synthesizing), and [`AudioDateStream`](https://docs.microsoft.com/dotnet/api/microsoft.cognitiveservices.speech.audiodatastream) of the Speech SDK to enable streaming.

Taking `AudioDateStream` as an example:

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

## Pre-connect and reuse SpeechSynthesizer

The Speech SDK uses websocket to commutate with the service.
Ideally, the network latency should be one route trip time (RTT).
If the connection is newly established, the network latency will contains extra connection establishment time.
The establishment of websocket connection needs the TCP handshake, SSL handshake, HTTP connection, and protocol upgrade, which introduce time delay.
To avoid the connection latency, we recommend pre-connection and reusing the `SpeechSynthesizer`.

### Pre-connect

For example, if you are building a speech bot in client, you can per-connect to the speech synthesis service when the user starts to talk, and call `SpeakTextAsync` when the bot reply text is ready.

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

> [!NOTE]
> If the synthesize text is available, just call `SpeakTextAsync` to synthesize the audio, the SDK will handle the connection.

### Reuse SpeechSynthesizer

Another way to reduce the connection latency is to reuse the `SpeechSynthesizer` so you don't need to create a new `SpeechSynthesizer` every synthesis.
We recommend using object pool in service scenario, see our [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/csharp/sharedcontent/console/speech_synthesis_server_scenario_sample.cs).


## Transmit compressed audio over the network

When the network is unstable or with limited bandwidth, the payload size will also impact latency.
Meanwhile, compressed audio format helps to save the users' precious network bandwidth especially for mobile users.

For example, the bitrate of `Riff24Khz16BitMonoPcm` format is 384 kbps, while `Audio24Khz48KBitRateMonoMp3` only costs 48 kbps.
Our Speech SDK will automatically use a compressed format for transmission when a `pcm` output format is set and `GStreamer` is properly installed.
Refer [this instruction](how-to-use-codec-compressed-audio-input-streams.md) to install and configure `GStreamer` for Speech SDK.

## Others tips

### Caching CRL files

The Speech SDK uses CRL files to check the certification.
Caching the CRL files until expired help you avoid download `CRL` files every time.
See [How to configure OpenSSL for Linux](how-to-configure-openssl-linux.md#certificate-revocation-checks) for details.

### Use latest Speech SDK

We are keeping improve the Speech SDK's performance, ensure to use the latest Speech SDK in your application.
For example, we fix a `TCP_NODELAY` setting issue in [1.16.0](releasenotes.md#speech-sdk-1160-2021-march-release), which help to reduce extra one route trip time.
