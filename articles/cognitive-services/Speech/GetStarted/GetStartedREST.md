---
title: Get Started with Microsoft Speech Recognition API Using REST | Microsoft Docs
description: Using REST to access speech recognition API in Microsoft Cognitive Services to convert spoken audio to text.
services: cognitive-services
author: zhouwangzw
manager: wolfma

ms.service: cognitive-services
ms.technology: speech
ms.topic: article
ms.date: 15/09/2017
ms.author: zhouwang
---
# Get started with speech recognition using REST API

With the cloud-based Microsoft Speech Service, you can develop applications using REST API to convert spoken audio to text.

To use speech recognition REST API, the steps are as follows:

1. Get a subscription key for using Speech API.
2. Set the proper request header and send the request to the appropriate REST end points.
3. Parse the response to get your transcribed text.

## Prerequisites

### Subscribe to Speech API and get a free trial subscription key

Microsoft Speech API is part of Microsoft Cognitive Services on Azure(previously Project Oxford). You can get free trial subscription keys from the [Cognitive Services Subscription](https://azure.microsoft.com/try/cognitive-services/) page. After you select the Speech API, click Get API Key to get the key. It returns a primary and secondary key. Both keys are tied to the same quota, so you may use either key.

> [!IMPORTANT]
> **Get a subscription key**
>
> You must have a [subscription key](https://azure.microsoft.com/try/cognitive-services/) before accessing Speech REST API.
>
> **Use your subscription key**
>
> With the provided REST samples below, you need to replace `YOUR_SUBSCRIPTION_KEY` with your own subscription key.

### Precorded audio file

In this example, we use a recorded audio file to illustrate the usage of the REST API. Record a short audio file of you saying something short (for example: *"What is the weather like today?"* or *"Find funny movies to watch."*). The Microsoft speech recognition API also supports external microphone input.

> [!NOTE]
> The example requires that audio is recorded as wav file with **PCM single channel (mono), 16 KHz**.

## Build recognition request and send it to the speech service

The next step for speech recognition is to send a POST request to the Microsoft Speech HTTP end points with proper request header and body.

### Service URI

The speech service URI is defined based on [recognition mode](../concepts.md#recognition-modes) and [recognition language](../concepts.md#recognition-languages):

```HTTP
https://speech.platform.bing.com/speech/recognition/<RECOGNITION_MODE>/cognitiveservices/v1?language=<LANGUAGE_TAG>&format=<OUTPUT_FORMAT>
```

`<RECOGNITION_MODE>` specifies the recognition mode, and must be of the following values: `interactive`, `conversation`, or `dictation`. It is a required resource path in the URI. For more information, see [recognition modes](../concepts.md#recognition-modes).

`<LANGUAGE_TAG>` is a required parameter in the query string. It defines the target language for audio conversion. For example, `en-US` for English (United States). For more information, see [recognition languages](../concepts.md#recognition-languages).

`<OUTPUT_FOMAT>` is an optional parameter in the query string. Its allowed values are `simple` and `detailed`. By default the service returns results in `simple` format. See [output format](../concepts.md#output-format) for details.

Some examples of service URI are as follows.
| Recognition mode  | Language | Output format | Service URI |
|---|---|---|---|
| `interactive` | pt-BR | default | https://speech.platform.bing.com/speech/recognition/interactive/cognitiveservices/v1?language=pt-BR |
| `conversation` | en-US | detailed |https://speech.platform.bing.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US&format=detailed |
| `dictation` | fr-FR | simple | https://speech.platform.bing.com/speech/recognition/dictation/cognitiveservices/v1?language=fr-FR&format=simple |

> [!NOTE]
> The service URI is only needed when your application uses REST APIs to call the speech service. If you use one of the [client libraries](GetStartedClientLibraries.md), you usually do not need to know which URI is being used. The client libraries might use different service URIs, which are only applicable for the specific client library. For more information, see the client library of your choice.

### Request headers

The follow fields must be set in the request header.

- `Ocp-Apim-Subscription-Key`: Each time that you call the service, you must pass your subscription key in the `Ocp-Apim-Subscription-Key` header. The Microsoft Speech Service also supports passing authorization token instead of subscription key. See the [Authentication](../How-to/how-to-authentication.md) page for details.
- `Content-type`: The Content-type field describes the format and codec of the audio stream. Currently only wav file and PCM Mono 16000 encoding is supported, and the Content-type value for this format is `audio/wav; codec=audio/pcm; samplerate=16000`.

The field `Transfer-Encoding` is optional. Setting this field to `chunked` allows you to chop the audio into small chunks. For more information, see the page [Chunked Transfer](../How-to/how-to-chunked-transfer.md).

The follow is a sample request header.

```HTTP
POST https://speech.platform.bing.com/speech/recognition/interactive/cognitiveservices/v1?language=en-US&format=detailed HTTP/1.1
Accept: application/json;text/xml
Content-Type: audio/wav; codec=audio/pcm; samplerate=16000
Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY
Host: speech.platform.bing.com
Transfer-Encoding: chunked
Expect: 100-continue
```

### Send request to the service

The following example shows how to send a speech recognition request to Microsoft speech REST end points. It uses `interactive` recognition mode.

> [!NOTE]
> Replace `YOUR_AUDIO_FILE` with the path to your prerecorded audio file, and `YOUR_SUBSCRIPTION_KEY` with your own subscription key.

# [Powershell](#tab/Powershell)

```Powershell

$SpeechServiceURI =
'https://speech.platform.bing.com/speech/recognition/interactive/cognitiveservices/v1?language=en-us&format=detailed'

# $OAuthToken is the authrization token returned by the token service.
$RecoRequestHeader = @{
  'Ocp-Apim-Subscription-Key' = 'YOUR_SUBSCRIPTION_KEY';
  'Transfer-Encoding' = 'chunked'
  'Content-type' = 'audio/wav; codec=audio/pcm; samplerate=16000'
}

# Read audio into byte array
$audioBytes = [System.IO.File]::ReadAllBytes("YOUR_AUDIO_FILE")

$RecoResponse = Invoke-RestMethod -Method POST -Uri $SpeechServiceURI -Headers $RecoRequestHeader -Body $audioBytes

# Show the result
$RecoResponse

```

# [curl](#tab/curl)

The example uses curl on Linux with bash. If it is not available on your platform, you may need to install curl. The example should also work on Cygwin on Windows, Git Bash, zsh, and other shells.

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
using (fs = new FileStream(YOUR_AUDIO_FILE, FileMode.Open, FileAccess.Read))
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

## Process speech recognition response

After processing the request, Microsoft Speech Service returns the results in a response as JSON format.

> [!NOTE]
> If the code above returns error, see [Troubleshooting](../troubleshooting.md) to locate the possible cause.

The following code snippet shows an example of how you can read the response from the stream.

# [Powershell](#tab/Powershell)

```Powershell
# show the response in JSON format
ConvertTo-Json $RecoResponse
```

# [curl](#tab/curl)

curl directly returns the response message in string. If you want to show it in JSON format, you can use additional tools, for example, jq.

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

The following is a sample JSON response:

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

The Speech REST API has some limitations:

- It only supports audio stream up to 15 seconds.
- REST API does not support intermediate results during recognition. Users receive only the final recognition result.

To remove these limitations, you can use Microsoft speech [client libraries](GetStartedClientLibraries.md) or directly work with [Speech WebSocket Protocol](../API-Reference-REST/websocketprotocol.md).

## What's next

- Check out [sample applications](../samples.md) to see how to use REST API in C#, Java and etc.
- In case of errors, see [Troubleshooting](../troubleshooting.md) to locate and fix errors.
- To use more advanced features, get started to use Microsoft Speech [Client Libraries](GetStartedClientLibraries.md).

### License

All Microsoft Cognitive Services SDKs and samples are licensed with the MIT License. For more information, see [LICENSE](https://github.com/Microsoft/Cognitive-Speech-STT-JavaScript/blob/master/LICENSE.md).
