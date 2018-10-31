---
title: Get started with the Bing Speech Recognition API by using REST | Microsoft Docs
titlesuffix: Azure Cognitive Services
description: Use REST to access the Speech Recognition API in Microsoft Cognitive Services to convert spoken audio to text.
services: cognitive-services
author: zhouwangzw
manager: wolfma
ms.service: cognitive-services
ms.component: bing-speech
ms.topic: article
ms.date: 09/18/2018
ms.author: zhouwang
---

# Quickstart: Use the Bing Speech recognition REST API

[!INCLUDE [Deprecation note](../../../../includes/cognitive-services-bing-speech-api-deprecation-note.md)]

With the cloud-based Bing Speech Service, you can develop applications by using the REST API to convert spoken audio to text.

## Prerequisites

### Subscribe to the Speech API, and get a free trial subscription key

The Speech API is part of Cognitive Services (previously Project Oxford). You can get free trial subscription keys from the [Cognitive Services subscription](https://azure.microsoft.com/try/cognitive-services/) page. After you select the Speech API, select **Get API Key** to get the key. It returns a primary and secondary key. Both keys are tied to the same quota, so you can use either key.

> [!IMPORTANT]
>* Get a subscription key. Before you can access the REST API, you must have a [subscription key](https://azure.microsoft.com/try/cognitive-services/).
>
>* Use your subscription key. In the following REST samples, replace YOUR_SUBSCRIPTION_KEY with your own subscription key. 
>
>* Refer to the [authentication](../how-to/how-to-authentication.md) page for how to get a subscription key.

### Prerecorded audio file

In this example, we use a recorded audio file to illustrate how to use the REST API. Record an audio file of yourself saying a short phrase. For example, say "What is the weather like today?" or "Find funny movies to watch." The speech recognition API also supports external microphone input.

> [!NOTE]
> The example requires that audio is recorded as a WAV file with **PCM single channel (mono), 16 KHz**.

## Build a recognition request, and send it to the speech recognition service

The next step for speech recognition is to send a POST request to the Speech HTTP endpoints with the proper request header and body.

### Service URI

The speech recognition service URI is defined based on [recognition modes](../concepts.md#recognition-modes) and [recognition languages](../concepts.md#recognition-languages):

```HTTP
https://speech.platform.bing.com/speech/recognition/<RECOGNITION_MODE>/cognitiveservices/v1?language=<LANGUAGE_TAG>&format=<OUTPUT_FORMAT>
```

`<RECOGNITION_MODE>` specifies the recognition mode and must be one of the following values: `interactive`, `conversation`, or `dictation`. It's a required resource path in the URI. For more information, see [Recognition modes](../concepts.md#recognition-modes).

`<LANGUAGE_TAG>` is a required parameter in the query string. It defines the target language for audio conversion: for example, `en-US` for English (United States). For more information, see [Recognition languages](../concepts.md#recognition-languages).

`<OUTPUT_FORMAT>` is an optional parameter in the query string. Its allowed values are `simple` and `detailed`. By default, the service returns results in `simple` format. For more information, see [Output format](../concepts.md#output-format).

Some examples of service URIs are listed in the following table.

| Recognition mode  | Language | Output format | Service URI |
|---|---|---|---|
| `interactive` | pt-BR | Default | https://speech.platform.bing.com/speech/recognition/interactive/cognitiveservices/v1?language=pt-BR |
| `conversation` | en-US | Detailed |https://speech.platform.bing.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US&format=detailed |
| `dictation` | fr-FR | Simple | https://speech.platform.bing.com/speech/recognition/dictation/cognitiveservices/v1?language=fr-FR&format=simple |

> [!NOTE]
> The service URI is needed only when your application uses REST APIs to call the speech recognition service. If you use one of the [client libraries](GetStartedClientLibraries.md), you usually don't need to know which URI is used. The client libraries might use different service URIs, which are applicable only for a specific client library. For more information, see the client library of your choice.

### Request headers

The following fields must be set in the request header:

- `Ocp-Apim-Subscription-Key`: Each time that you call the service, you must pass your subscription key in the `Ocp-Apim-Subscription-Key` header. Speech Service also supports passing authorization tokens instead of subscription keys. For more information, see [Authentication](../How-to/how-to-authentication.md).
- `Content-type`: The `Content-type` field describes the format and codec of the audio stream. Currently, only WAV file and PCM Mono 16000 encoding is supported. The Content-type value for this format is `audio/wav; codec=audio/pcm; samplerate=16000`.

The `Transfer-Encoding` field is optional. If you set this field to `chunked`, you can chop the audio into small chunks. For more information, see [Chunked transfer](../How-to/how-to-chunked-transfer.md).

The following is a sample request header:

```HTTP
POST https://speech.platform.bing.com/speech/recognition/interactive/cognitiveservices/v1?language=en-US&format=detailed HTTP/1.1
Accept: application/json;text/xml
Content-Type: audio/wav; codec=audio/pcm; samplerate=16000
Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY
Host: speech.platform.bing.com
Transfer-Encoding: chunked
Expect: 100-continue
```

### Send a request to the service

The following example shows how to send a speech recognition request to Speech REST endpoints. It uses the `interactive` recognition mode.

> [!NOTE]
> Replace `YOUR_AUDIO_FILE` with the path to your prerecorded audio file. Replace `YOUR_SUBSCRIPTION_KEY` with your own subscription key.

# [PowerShell](#tab/Powershell)

```Powershell

$SpeechServiceURI =
'https://speech.platform.bing.com/speech/recognition/interactive/cognitiveservices/v1?language=en-us&format=detailed'

# $OAuthToken is the authorization token returned by the token service.
$RecoRequestHeader = @{
  'Ocp-Apim-Subscription-Key' = 'YOUR_SUBSCRIPTION_KEY';
  'Transfer-Encoding' = 'chunked';
  'Content-type' = 'audio/wav; codec=audio/pcm; samplerate=16000'
}

# Read audio into byte array
$audioBytes = [System.IO.File]::ReadAllBytes("YOUR_AUDIO_FILE")

$RecoResponse = Invoke-RestMethod -Method POST -Uri $SpeechServiceURI -Headers $RecoRequestHeader -Body $audioBytes

# Show the result
$RecoResponse

```

# [curl](#tab/curl)

The example uses curl on Linux with bash. If it's not available on your platform, you might need to install curl. The example also works on Cygwin on Windows, Git Bash, zsh, and other shells.

> [!NOTE]
> Keep the `@` before the audio file name when replacing `YOUR_AUDIO_FILE` with the path to your prerecorded audio file, as it indicates that the value of `--data-binary` is a file name instead of data.

```
curl -v -X POST "https://speech.platform.bing.com/speech/recognition/interactive/cognitiveservices/v1?language=en-us&format=detailed" -H "Transfer-Encoding: chunked" -H "Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY" -H "Content-type: audio/wav; codec=audio/pcm; samplerate=16000" --data-binary @YOUR_AUDIO_FILE
```

# [C#](#tab/CSharp)

```cs
HttpWebRequest request = null;
request = (HttpWebRequest)HttpWebRequest.Create(requestUri);
request.SendChunked = true;
request.Accept = @"application/json;text/xml";
request.Method = "POST";
request.ProtocolVersion = HttpVersion.Version11;
request.ContentType = @"audio/wav; codec=audio/pcm; samplerate=16000";
request.Headers["Ocp-Apim-Subscription-Key"] = "YOUR_SUBSCRIPTION_KEY";

// Send an audio file by 1024 byte chunks
using (FileStream fs = new FileStream(YOUR_AUDIO_FILE, FileMode.Open, FileAccess.Read))
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

---

## Process the speech recognition response

After processing the request, Speech Service returns the results in a response as JSON format.

> [!NOTE]
> If the previous code returns an error, see [Troubleshooting](../troubleshooting.md) to locate the possible cause.

The following code snippet shows an example of how you can read the response from the stream.

# [PowerShell](#tab/Powershell)

```Powershell
# show the response in JSON format
ConvertTo-Json $RecoResponse
```

# [curl](#tab/curl)

In this example, curl directly returns the response message in a string. If you want to show it in JSON format, you can use additional tools, for example, jq.

```
curl -X POST "https://speech.platform.bing.com/speech/recognition/interactive/cognitiveservices/v1?language=en-us&format=detailed" -H "Transfer-Encoding: chunked" -H "Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY" -H "Content-type: audio/wav; codec=audio/pcm; samplerate=16000" --data-binary @YOUR_AUDIO_FILE | jq
```

# [C#](#tab/CSharp)

```cs
/*
* Get the response from the service.
*/
Console.WriteLine("Response:");
using (WebResponse response = request.GetResponse())
{
    Console.WriteLine(((HttpWebResponse)response).StatusCode);

    using (StreamReader sr = new StreamReader(response.GetResponseStream()))
    {
        responseString = sr.ReadToEnd();
    }

    Console.WriteLine(responseString);
    Console.ReadLine();
}
```

---

The following sample is a JSON response:

```json
OK
{
  "RecognitionStatus": "Success",
  "Offset": 22500000,
  "Duration": 21000000,
  "NBest": [{
    "Confidence": 0.941552162,
    "Lexical": "find a funny movie to watch",
    "ITN": "find a funny movie to watch",
    "MaskedITN": "find a funny movie to watch",
    "Display": "Find a funny movie to watch."
  }]
}
```

## Limitations

The REST API has some limitations:

- It supports audio stream only up to 15 seconds.
- It doesn't support intermediate results during recognition. Users receive only the final recognition result.

To remove these limitations, use Speech [client libraries](GetStartedClientLibraries.md). Or you can work directly with the [Speech WebSocket protocol](../API-Reference-REST/websocketprotocol.md).

## What's next

- To see how to use the REST API in C#, Java, etc., see these [sample applications](../samples.md).
- To locate and fix errors, see [Troubleshooting](../troubleshooting.md).
- To use more advanced features, see how to get started by using Speech [client libraries](GetStartedClientLibraries.md).

### License

All Cognitive Services SDKs and samples are licensed with the MIT License. For more information, see [License](https://github.com/Microsoft/Cognitive-Speech-STT-JavaScript/blob/master/LICENSE.md).
