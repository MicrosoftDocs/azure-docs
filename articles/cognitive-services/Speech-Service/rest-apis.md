---
title: Speech Services REST APIs - Speech Services
titleSuffix: Azure Cognitive Services
description: Learn how to use the speech-to-text and text-to-speech REST APIs. In this article, you'll learn about authorization options, query options, how to structure a request and receive a response.
services: cognitive-services
author: erhopf
manager: cgronlun
ms.service: cognitive-services
ms.component: speech-service
ms.topic: conceptual
ms.date: 12/06/2018
ms.author: erhopf
ms.custom: seodec18
---

# Speech Service REST APIs

As an alternative to the [Speech SDK](speech-sdk.md), the Speech Service enables you to convert speech-to-text and text-to-speech with a set of REST APIs. Each accessible endpoint is associated with a region. Your application requires a subscription key for the endpoint you plan to use.

Before using the REST APIs, understand:
* The speech-to-text requests using the REST API can only contain 10 seconds of recorded audio.
* The speech-to-text REST API only returns final results. Partial results are not provided.
* The text-to-speech REST API requires an Authorization header. This means that you need to complete a token exchange to access the service. For more information, see [Authentication](#authentication).

## Authentication

Each request to either the speech-to-text or text-to-speech REST API requires an authorization header. This table illustrates which headers are supported for each service:

| Supported authorization headers | Speech-to-text | Text-to-speech |
|------------------------|----------------|----------------|
| Ocp-Apim-Subscription-Key | Yes | No |
| Authorization: Bearer | Yes | Yes |

When using the `Ocp-Apim-Subscription-Key` header, you're only required to provide your subscription key. For example:

```
'Ocp-Apim-Subscription-Key': 'YOUR_SUBSCRIPTION_KEY'
```

When using the `Authorization: Bearer` header, you're required to make a request to the `issueToken` endpoint. In this request, you exchange your subscription key for an access token that's valid for 10 minutes. In the next few sections you'll learn how to get a token, use a token, and refresh a token.

### How to get an access token

To get an access token, you'll need to make a request to the `issueToken` endpoint using the `Ocp-Apim-Subscription-Key` and your subscription key.

These regions and endpoints are supported:

[!INCLUDE [](../../../includes/cognitive-services-speech-service-endpoints-token-service.md)]

Use these samples to create your access token request.

#### HTTP sample

This example is a simple HTTP request to get a token. Replace `YOUR_SUBSCRIPTION_KEY` with your Speech Service subscription key. If your subscription isn't in the West US region, replace the `Host` header with your region's host name.

```http
POST /sts/v1.0/issueToken HTTP/1.1
Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY
Host: westus.api.cognitive.microsoft.com
Content-type: application/x-www-form-urlencoded
Content-Length: 0
```

The body of the response contains the access token in Java Web Token (JWT) format.

#### PowerShell sample

This example is a simple PowerShell script to get an access token. Replace `YOUR_SUBSCRIPTION_KEY` with your Speech Service subscription key. Make sure to use the correct endpoint for the region that matches your subscription. This example is currently set to West US.

```Powershell
$FetchTokenHeader = @{
  'Content-type'='application/x-www-form-urlencoded';
  'Content-Length'= '0';
  'Ocp-Apim-Subscription-Key' = 'YOUR_SUBSCRIPTION_KEY'
}

$OAuthToken = Invoke-RestMethod -Method POST -Uri https://westus.api.cognitive.microsoft.com/sts/v1.0/issueToken
 -Headers $FetchTokenHeader

# show the token received
$OAuthToken

```

#### cURL sample

cURL is a command-line tool available in Linux (and in the Windows Subsystem for Linux). This cURL command illustrates how to get an access token. Replace `YOUR_SUBSCRIPTION_KEY` with your Speech Service subscription key. Make sure to use the correct endpoint for the region that matches your subscription. This example is currently set to West US.

```cli
curl -v -X POST
 "https://westus.api.cognitive.microsoft.com/sts/v1.0/issueToken" \
 -H "Content-type: application/x-www-form-urlencoded" \
 -H "Content-Length: 0" \
 -H "Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY"
```

#### C# sample

This C# class illustrates how to get an access token. Pass your Speech Service subscription key when you instantiate the class. If your subscription isn't in the West US region, change the value of `FetchTokenUri` to match the region for your subscription.

```cs
/*
    * This class demonstrates how to get a valid access token.
    */
public class Authentication
{
    public static readonly string FetchTokenUri =
        "https://westus.api.cognitive.microsoft.com/sts/v1.0/issueToken";
    private string subscriptionKey;
    private string token;

    public Authentication(string subscriptionKey)
    {
        this.subscriptionKey = subscriptionKey;
        this.token = FetchTokenAsync(FetchTokenUri, subscriptionKey).Result;
    }

    public string GetAccessToken()
    {
        return this.token;
    }

    private async Task<string> FetchTokenAsync(string fetchUri, string subscriptionKey)
    {
        using (var client = new HttpClient())
        {
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", subscriptionKey);
            UriBuilder uriBuilder = new UriBuilder(fetchUri);

            var result = await client.PostAsync(uriBuilder.Uri.AbsoluteUri, null);
            Console.WriteLine("Token Uri: {0}", uriBuilder.Uri.AbsoluteUri);
            return await result.Content.ReadAsStringAsync();
        }
    }
}
```

### How to use an access token

The access token should be sent to the service as the `Authorization: Bearer <TOKEN>` header. Each access token is valid for 10 minutes. You can get a new token at any time, however, to minimize network traffic and latency, we recommend using the same token for nine minutes.

Here's a sample HTTP request to the text-to-speech REST API:

```http
POST /cognitiveservices/v1 HTTP/1.1
Authorization: Bearer YOUR_ACCESS_TOKEN
Host: westus.tts.speech.microsoft.com
Content-type: application/ssml+xml
Content-Length: 199
Connection: Keep-Alive

<speak version='1.0' xmlns="http://www.w3.org/2001/10/synthesis" xml:lang='en-US'>
<voice name='Microsoft Server Speech Text to Speech Voice (en-US, Jessa24kRUS)'>
    Hello, world!
</voice></speak>
```

### How to renew an access token using C#

This C# code is a drop-in replacement for the class presented earlier. The `Authentication` class automatically gets a new access token every nine minutes by using a timer. This approach ensures that a valid token is always available while your program is running.

> [!NOTE]
> Instead of using a timer, you can store a timestamp of when the last token was obtained. Then you can request a new one only if it's close to expiring. This approach avoids requesting new tokens unnecessarily and might be more suitable for programs that make infrequent Speech requests.

As before, make sure the `FetchTokenUri` value matches your subscription region. Pass your subscription key when you instantiate the class.

```cs
public class Authentication
{
    public static readonly string FetchTokenUri =
        "https://westus.api.cognitive.microsoft.com/sts/v1.0/issueToken";
    private string subscriptionKey;
    private string token;
    private Timer accessTokenRenewer;

    //Access token expires every 10 minutes. Renew it every 9 minutes.
    private const int RefreshTokenDuration = 9;

    public Authentication(string subscriptionKey)
    {
        this.subscriptionKey = subscriptionKey;
        this.token = FetchToken(FetchTokenUri, subscriptionKey).Result;

        // renew the token on set duration.
        accessTokenRenewer = new Timer(new TimerCallback(OnTokenExpiredCallback),
                                        this,
                                        TimeSpan.FromMinutes(RefreshTokenDuration),
                                        TimeSpan.FromMilliseconds(-1));
    }

    public string GetAccessToken()
    {
        return this.token;
    }

    private void RenewAccessToken()
    {
        this.token = FetchToken(FetchTokenUri, this.subscriptionKey).Result;
        Console.WriteLine("Renewed token.");
    }

    private void OnTokenExpiredCallback(object stateInfo)
    {
        try
        {
            RenewAccessToken();
        }
        catch (Exception ex)
        {
            Console.WriteLine(string.Format("Failed renewing access token. Details: {0}", ex.Message));
        }
        finally
        {
            try
            {
                accessTokenRenewer.Change(TimeSpan.FromMinutes(RefreshTokenDuration), TimeSpan.FromMilliseconds(-1));
            }
            catch (Exception ex)
            {
                Console.WriteLine(string.Format("Failed to reschedule the timer to renew access token. Details: {0}", ex.Message));
            }
        }
    }

    private async Task<string> FetchToken(string fetchUri, string subscriptionKey)
    {
        using (var client = new HttpClient())
        {
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", subscriptionKey);
            UriBuilder uriBuilder = new UriBuilder(fetchUri);

            var result = await client.PostAsync(uriBuilder.Uri.AbsoluteUri, null);
            Console.WriteLine("Token Uri: {0}", uriBuilder.Uri.AbsoluteUri);
            return await result.Content.ReadAsStringAsync();
        }
    }
}
```

## Speech-to-text API

The speech-to-text REST API only supports short utterances. Requests may contain up to 10 seconds of audio with a total duration of 14 seconds. The REST API only returns the final results, not partial or interim results.

If sending longer audio is a requirement for your application, consider using the [Speech SDK](speech-sdk.md) or [batch transcription](batch-transcription.md).

### Regions and endpoints

These regions are supported for speech-to-text transcription using the REST API. Make sure that you select the endpoint that matches your subscription region.

[!INCLUDE [](../../../includes/cognitive-services-speech-service-endpoints-speech-to-text.md)]

### Query parameters

These parameters may be included in the query string of the REST request.

| Parameter | Description | Required / Optional |
|-----------|-------------|---------------------|
| `language` | Identifies the spoken language that is being recognized. See [Supported languages](language-support.md#speech-to-text). | Required |
| `format` | Specifies the result format. Accepted values are `simple` and `detailed`. Simple results include `RecognitionStatus`, `DisplayText`, `Offset`, and `Duration`. Detailed responses include multiple results with confidence values and four different representations. The default setting is `simple`. | Optional |
| `profanity` | Specifies how to handle profanity in recognition results. Accepted values are `masked`, which replaces profanity with asterisks, `removed`, which remove all profanity from the result, or `raw`, which includes the profanity in the result. The default setting is `masked`. | Optional |

### Request headers

This table lists required and optional headers for speech-to-text requests.

|Header| Description | Required / Optional |
|------|-------------|---------------------|
| `Ocp-Apim-Subscription-Key` | Your Speech Service subscription key. | Either this header or `Authorization` is required. |
| `Authorization` | An authorization token preceded by the word `Bearer`. For more information, see [Authentication](#authentication). | Either this header or `Ocp-Apim-Subscription-Key` is required. |
| `Content-type` | Describes the format and codec of the provided audio data. Accepted values are `audio/wav; codec=audio/pcm; samplerate=16000` and `audio/ogg; codec=audio/pcm; samplerate=16000`. | Required |
| `Transfer-Encoding` | Specifies that chunked audio data is being sent, rather than a single file. Only use this header if chunking audio data. | Optional |
| `Expect` | If using chunked transfer, send `Expect: 100-continue`. The Speech Service acknowledges the initial request and awaits additional data.| Required if sending chunked audio data. |
| `Accept` | If provided, it must be `application/json`. The Speech Service provides results in JSON. Some Web request frameworks provide an incompatible default value if you do not specify one, so it is good practice to always include `Accept`. | Optional, but recommended. |

### Audio formats

Audio is sent in the body of the HTTP `POST` request. It must be in one of the formats in this table:

| Format | Codec | Bitrate | Sample Rate |
|--------|-------|---------|-------------|
| WAV | PCM | 16-bit | 16 kHz, mono |
| OGG | OPUS | 16-bit | 16 kHz, mono |

>[!NOTE]
>The above formats are supported through REST API and WebSocket in the Speech Service. The [Speech SDK](speech-sdk.md) currently only supports the WAV format with PCM codec.

### Sample request

This is a typical HTTP request. The sample below includes the hostname and required headers. It's important to note that the service also expects audio data, which is not included in this sample. As mentioned earlier, chunking is recommended, however, not required.

```HTTP
POST speech/recognition/conversation/cognitiveservices/v1?language=en-US&format=detailed HTTP/1.1
Accept: application/json;text/xml
Content-Type: audio/wav; codec=audio/pcm; samplerate=16000
Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY
Host: westus.stt.speech.microsoft.com
Transfer-Encoding: chunked
Expect: 100-continue
```

### HTTP status codes

The HTTP status code for each response indicates success or common errors.

| HTTP status code | Description | Possible reason |
|------------------|-------------|-----------------|
| 100 | Continue | The initial request has been accepted. Proceed with sending the rest of the data. (Used with chunked transfer.) |
| 200 | OK | The request was successful; the response body is a JSON object. |
| 400 | Bad request | Language code not provided or is not a supported language; invalid audio file. |
| 401 | Unauthorized | Subscription key or authorization token is invalid in the specified region, or invalid endpoint. |
| 403 | Forbidden | Missing subscription key or authorization token. |

### Chunked transfer

Chunked transfer (`Transfer-Encoding: chunked`) can help reduce recognition latency because it allows the Speech Service to begin processing the audio file while it's being transmitted. The REST API does not provide partial or interim results. This option is intended solely to improve responsiveness.

This code sample shows how to send audio in chunks. Only the first chunk should contain the audio file's header. `request` is an HTTPWebRequest object connected to the appropriate REST endpoint. `audioFile` is the path to an audio file on disk.

```csharp
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

### Response parameters

Results are provided as JSON. The `simple` format includes these top-level fields.

| Parameter | Description  |
|-----------|--------------|
|`RecognitionStatus`|Status, such as `Success` for successful recognition. See next table.|
|`DisplayText`|The recognized text after capitalization, punctuation, inverse text normalization (conversion of spoken text to shorter forms, such as 200 for "two hundred" or "Dr. Smith" for "doctor smith"), and profanity masking. Present only on success.|
|`Offset`|The time (in 100-nanosecond units) at which the recognized speech begins in the audio stream.|
|`Duration`|The duration (in 100-nanosecond units) of the recognized speech in the audio stream.|

The `RecognitionStatus` field may contain these values:

| Status | Description |
|--------|-------------|
| `Success` | The recognition was successful and the `DisplayText` field is present. |
| `NoMatch` | Speech was detected in the audio stream, but no words from the target language were matched. Usually means the recognition language is a different language from the one the user is speaking. |
| `InitialSilenceTimeout` | The start of the audio stream contained only silence, and the service timed out waiting for speech. |
| `BabbleTimeout` | The start of the audio stream contained only noise, and the service timed out waiting for speech. |
| `Error` | The recognition service encountered an internal error and could not continue. Try again if possible. |

> [!NOTE]
> If the audio consists only of profanity, and the `profanity` query parameter is set to `remove`, the service does not return a speech result.

The `detailed` format includes the same data as the `simple` format, along with `NBest`, a list of alternative interpretations of the same speech recognition result. These results are ranked from most likely to least likely The first entry is the same as the main recognition result.  When using the `detailed` format, `DisplayText` is provided as `Display` for each result in the `NBest` list.

Each object in the `NBest` list includes:

| Parameter | Description |
|-----------|-------------|
| `Confidence` | The confidence score of the entry from 0.0 (no confidence) to 1.0 (full confidence) |
| `Lexical` | The lexical form of the recognized text: the actual words recognized. |
| `ITN` | The inverse-text-normalized ("canonical") form of the recognized text, with phone numbers, numbers, abbreviations ("doctor smith" to "dr smith"), and other transformations applied. |
| `MaskedITN` | The ITN form with profanity masking applied, if requested. |
| `Display` | The display form of the recognized text, with punctuation and capitalization added. This parameter is the same as `DisplayText` provided when format is set to `simple`. |

### Sample responses

This is a typical response for `simple` recognition.

```json
{
  "RecognitionStatus": "Success",
  "DisplayText": "Remind me to buy 5 pencils.",
  "Offset": "1236645672289",
  "Duration": "1236645672289"
}
```

This is a typical response for `detailed` recognition.

```json
{
  "RecognitionStatus": "Success",
  "Offset": "1236645672289",
  "Duration": "1236645672289",
  "NBest": [
      {
        "Confidence" : "0.87",
        "Lexical" : "remind me to buy five pencils",
        "ITN" : "remind me to buy 5 pencils",
        "MaskedITN" : "remind me to buy 5 pencils",
        "Display" : "Remind me to buy 5 pencils.",
      },
      {
        "Confidence" : "0.54",
        "Lexical" : "rewind me to buy five pencils",
        "ITN" : "rewind me to buy 5 pencils",
        "MaskedITN" : "rewind me to buy 5 pencils",
        "Display" : "Rewind me to buy 5 pencils.",
      }
  ]
}
```

## Text-to-speech API

These regions are supported for text-to-speech using the REST API. Make sure that you select the endpoint that matches your subscription region.

[!INCLUDE [](../../../includes/cognitive-services-speech-service-endpoints-text-to-speech.md)]

The Speech Service supports 24-KHz audio output, along with the 16-Khz outputs that were supported by Bing Speech. Four 24-KHz output formats and two 24-KHz voices are supported.

### Voices

| Locale | Language   | Gender | Mapping |
|--------|------------|--------|---------|
| en-US  | US English | Female | "Microsoft Server Speech Text to Speech Voice (en-US, Jessa24kRUS)" |
| en-US  | US English | Male   | "Microsoft Server Speech Text to Speech Voice (en-US, Guy24kRUS)" |

A full list of available voices, see [supported languages](language-support.md#text-to-speech).

### Request headers

This table lists required and optional headers for speech-to-text requests.

| Header | Description | Required / Optional |
|--------|-------------|---------------------|
| `Authorization` | An authorization token preceded by the word `Bearer`. For additional information, see [Authentication](#authentication). | Required |
| `Content-Type` | Specifies the content type for the provided text. Accepted value: `application/ssml+xml`. | Required |
| `X-Microsoft-OutputFormat` | Specifies the audio output format. For a complete list of accepted values, see [audio outputs](#audio-outputs). | Required |
| `User-Agent` | The application name. It must be less than 255 characters. | Required |

### Audio outputs

This is a list of supported audio formats that are sent in each request as the `X-Microsoft-OutputFormat` header. Each incorporates a bitrate and encoding type.

|||
|-|-|
| `raw-16khz-16bit-mono-pcm` | `raw-8khz-8bit-mono-mulaw` |
| `riff-8khz-8bit-mono-mulaw` | `riff-16khz-16bit-mono-pcm` |
| `audio-16khz-128kbitrate-mono-mp3` | `audio-16khz-64kbitrate-mono-mp3` |
| `audio-16khz-32kbitrate-mono-mp3`  | `raw-24khz-16bit-mono-pcm` |
| `riff-24khz-16bit-mono-pcm`        | `audio-24khz-160kbitrate-mono-mp3` |
| `audio-24khz-96kbitrate-mono-mp3`  | `audio-24khz-48kbitrate-mono-mp3` |

> [!NOTE]
> If your selected voice and output format have different bit rates, the audio is resampled as necessary. However, 24khz voices do not support `audio-16khz-16kbps-mono-siren` and `riff-16khz-16kbps-mono-siren` output formats.

### Request body

Text is sent as the body of an HTTP `POST` request. It can be plain text (ASCII or UTF-8) or [Speech Synthesis Markup Language](speech-synthesis-markup.md) (SSML) format (UTF-8). Plain text requests use the Speech Service's default voice and language. With SSML you can specify the voice and language.

### Sample request

This HTTP request uses SSML to specify the voice and language. The body cannot exceed 1,000 characters.

```http
POST /cognitiveservices/v1 HTTP/1.1

X-Microsoft-OutputFormat: raw-16khz-16bit-mono-pcm
Content-Type: application/ssml+xml
Host: westus.tts.speech.microsoft.com
Content-Length: 225
Authorization: Bearer [Base64 access_token]

<speak version='1.0' xml:lang='en-US'><voice xml:lang='en-US' xml:gender='Female'
    name='Microsoft Server Speech Text to Speech Voice (en-US, ZiraRUS)'>
        Microsoft Speech Service Text-to-Speech API
</voice></speak>
```

### HTTP status codes

The HTTP status code for each response indicates success or common errors.

| HTTP status code | Description | Possible reason |
|------------------|-------------|-----------------|
| 200 | OK | The request was successful; the response body is an audio file. |
| 400 | Bad Request | A required parameter is missing, empty, or null. Or, the value passed to either a required or optional parameter is invalid. A common issue is a header that is too long. |
| 401 | Unauthorized | The request is not authorized. Check to make sure your subscription key or token is valid and in the correct region. |
| 413 | Request Entity Too Large | The SSML input is longer than 1024 characters. |
| 429 | Too Many Requests | You have exceeded the quota or rate of requests allowed for your subscription. |
| 502 | Bad Gateway	| Network or server-side issue. May also indicate invalid headers. |

If the HTTP status is `200 OK`, the body of the response contains an audio file in the requested format. This file can be played as it's transferred, saved to a buffer, or saved to a file.

## Next steps

- [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)
- [Customize acoustic models](how-to-customize-acoustic-models.md)
- [Customize language models](how-to-customize-language-model.md)
