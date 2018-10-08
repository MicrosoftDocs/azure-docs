---
title: How to Chunked Transfer Audio Stream | Microsoft Docs
titlesuffix: Azure Cognitive Services
description: How to use chunked trasfer to send audio stream to the Bing Speech service
services: cognitive-services
author: zhouwangzw
manager: wolfma
ms.service: cognitive-services
ms.component: bing-speech
ms.topic: article
ms.date: 09/18/2018
ms.author: zhouwang
---
# Chunked transfer encoding

[!INCLUDE [Deprecation note](../../../../includes/cognitive-services-bing-speech-api-deprecation-note.md)]

To transcribe speech to text, Microsoft speech recognition API allows you to send the audio as one whole chunk or to chop the audio into small chunks. For efficient audio streaming and reducing transcription latency, it is recommended that you use [chunked transfer encoding](https://en.wikipedia.org/wiki/Chunked_transfer_encoding) to stream the audio to the service. Other implementations may result in higher user-perceived latency. For more information, see the [Audio Streams](../concepts.md#audio-streams) page.

> [!NOTE]
> You may not upload more than 10 seconds of audio in any one request and the total request duration cannot exceed 14 seconds.
> [!NOTE]
> You need to specify the chunked transfer encoding only if you use the [REST APIs](../GetStarted/GetStartedREST.md) to call the speech service. Applications that use [client libraries](../GetStarted/GetStartedClientLibraries.md) do not need to configure the chunked transfer encoding.

The following code shows how to set the chunked transfer encoding and to send an audio file being chunked into 1024-byte chunks.

```cs

HttpWebRequest request = null;
request = (HttpWebRequest)HttpWebRequest.Create(requestUri);
request.SendChunked = true;
request.Accept = @"application/json;text/xml";
request.Method = "POST";
request.ProtocolVersion = HttpVersion.Version11;
request.Host = @"speech.platform.bing.com";
request.ContentType = @"audio/wav; codec=audio/pcm; samplerate=16000";
request.Headers["Ocp-Apim-Subscription-Key"] = "YOUR_SUBSCRIPTION_KEY";

using (fs = new FileStream(audioFile, FileMode.Open, FileAccess.Read))
{

    /*
    * Open a request stream and write 1024 byte chunks in the stream one at a time.
    */
    byte[] buffer = null;
    int bytesRead = 0;
    using (Stream requestStream = request.GetRequestStream())
    {
        /*
        * Read 1024 raw bytes from the input audio file.
        */
        buffer = new Byte[checked((uint)Math.Min(1024, (int)fs.Length))];
        while ((bytesRead = fs.Read(buffer, 0, buffer.Length)) != 0)
        {
            requestStream.Write(buffer, 0, bytesRead);
        }

        // Flush
        requestStream.Flush();
    }
}
```
