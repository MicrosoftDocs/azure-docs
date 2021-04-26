---
title: Best practices to lower speech synthesis latency using Speech SDK
titleSuffix: Azure Cognitive Services
description: Best practices to lower speech synthesis latency using Speech SDK, including streaming, pre-connection, and so on.
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

# Best practices to lower speech synthesis latency using Speech SDK

The synthesis latency is critical to your applications.
In this article, we will introduce the best practices to lower the latency and bring the best performance to you and your end users.
Normally, we measure the latency by `first audio chunk latency` and `all audio latency`, as follows:

| Latency | Description |
|-----------|-------------|
| `first audio chunk latency` | Indicates the time delay between the synthesis starts and the first audio chunk is received. |
| `all audio latency` | Indicates the time delay between the synthesis starts and the whole synthesized audio is received. |

The `first audio chunk latency` is much lower than `all audio latency` in most cases.
And the `first audio chunk latency` is almost independent with the text length, while `all audio latency` increases with the text length.

## Streaming

Streaming is critical to lower the latency,
In client side, you need to start the playback when the first audio chunk is received.
In service scenario, you need to ensure you forward the audio chunks immediately to your clients instead of waiting for the whole audio.

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

## Pre-connection and reuse SpeechSynthesizer

The latency comes from the network latency and service processing latency.


The Speech SDK uses websocket to commutate with the service.
The establishment of websocket connection needs the TCP handshake, SSL handshake, HTTP connection, and protocol upgrade, which takes a longer time.
To avoid the connection latency, we recommend pre-connection and reusing the `SpeechSynthesizer`.

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

Another way to reduce the connection latency is to reuse the `SpeechSynthesizer` so you don't need to create a new `SpeechSynthesizer` every synthesis.
We recommend using object pool in service scenario, see our [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/csharp/sharedcontent/console/speech_synthesis_server_scenario_sample.cs).


## Using compressed audio format for transmission on wire

When the network bandwidth is limited or unstable, the payload size will also impact latency.
Meanwhile, compressed audio format helps to save the users' precious network bandwidth especially for mobile.

For example, the bitrate of `Riff24Khz16BitMonoPcm` format is 384 kbps while `Audio24Khz48KBitRateMonoMp3` only costs 48 kbps.
Our Speech SDK will automatically use a compressed format for transmission when a `pcm` output format is set and `GStreamer` is properly installed.
Refer [this instruction](how-to-use-codec-compressed-audio-input-streams.md) to install and configure `GStreamer` for Speech SDK.

## Others

### Caching CRL files

The Speech SDK uses CRL files to check the certification.
Caching the CRL files until expired help you avoid download `CRL` files every time.
See [How to configure OpenSSL for Linux](how-to-configure-openssl-linux.md#certificate-revocation-checks) for details.

