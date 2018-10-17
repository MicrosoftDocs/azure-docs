---
title: Speech service REST APIs
description: Reference for REST APIs for the Speech service.
services: cognitive-services
author: erhopf

ms.service: cognitive-services
ms.component: speech
ms.topic: article
ms.date: 05/09/2018
ms.author: erhopf
---
# Speech service REST APIs

The REST APIs of the Azure Cognitive Services Speech service are similar to the APIs provided by the [Bing Speech API](https://docs.microsoft.com/azure/cognitive-services/Speech). The endpoints differ from the endpoints used by the Bing Speech service. Regional endpoints are available, and you must use a subscription key that corresponds to the endpoint you're using.

## Speech to Text

The endpoints for the Speech to Text REST API are shown in the following table. Use the one that matches your subscription region. 

[!INCLUDE [](../../../includes/cognitive-services-speech-service-endpoints-speech-to-text.md)]

> [!NOTE]
> If you customized the acoustic model or language model, or pronunciation, use your custom endpoint instead.

This API supports only short utterances. Requests may contain up to 10 seconds of audio and last a maximum of 14 seconds overall. The REST API returns only final results, not partial or interim results. The Speech service also has a [batch transcription](batch-transcription.md) API that can transcribe longer audio.


### Query parameters

The following parameters may be included in the query string of the REST request.

|Parameter name|Required/optional|Meaning|
|-|-|-|
|`language`|Required|The identifier of the language to be recognized. See [Supported languages](language-support.md#speech-to-text).|
|`format`|Optional<br>default: `simple`|Result format, `simple` or `detailed`. Simple results include `RecognitionStatus`, `DisplayText`, `Offset`, and duration. Detailed results include multiple candidates with confidence values and four different representations.|
|`profanity`|Optional<br>default: `masked`|How to handle profanity in recognition results. May be `masked` (replaces profanity with asterisks), `removed` (removes all profanity), or `raw` (includes profanity).

### Request headers

The following fields are sent in the HTTP request header.

|Header|Meaning|
|------|-------|
|`Ocp-Apim-Subscription-Key`|Your Speech service subscription key. Either this header or `Authorization` must be provided.|
|`Authorization`|An authorization token preceded by the word `Bearer`. Either this header or `Ocp-Apim-Subscription-Key` must be provided. See [Authentication](#authentication).|
|`Content-type`|Describes the format and codec of the audio data. Currently, this value must be `audio/wav; codec=audio/pcm; samplerate=16000`.|
|`Transfer-Encoding`|Optional. If given, must be `chunked` to allow audio data to be sent in multiple small chunks instead of a single file.|
|`Expect`|If using chunked transfer, send `Expect: 100-continue`. The Speech service acknowledges the initial request and awaits additional data.|
|`Accept`|Optional. If provided, must include `application/json`, as the Speech service provides results in JSON format. (Some Web request frameworks provide an incompatible default value if you do not specify one, so it is good practice to always include `Accept`.)|

### Audio format

The audio is sent in the body of the HTTP `PUT` request. It should be in 16-bit WAV format with PCM single channel (mono) at 16 KHz of the following formats/encoding.

* WAV format with PCM codec
* Ogg format with OPUS codec

>[!NOTE]
>The above formats are supported through REST API and WebSocket in the Speech Service. The [Speech SDK](/index.yml) currently only supports the WAV format with PCM codec. 

### Chunked transfer

Chunked transfer (`Transfer-Encoding: chunked`) can help reduce recognition latency because it allows the Speech service to begin processing the audio file while it's being transmitted. The REST API does not provide partial or interim results. This option is intended solely to improve responsiveness.

The following code illustrates how to send audio in chunks. Only the first chunk should contain the audio file's header. `request` is an HTTPWebRequest object connected to the appropriate REST endpoint. `audioFile` is the path to an audio file on disk.

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

### Example request

The following is a typical request.

```HTTP
POST speech/recognition/conversation/cognitiveservices/v1?language=en-US&format=detailed HTTP/1.1
Accept: application/json;text/xml
Content-Type: audio/wav; codec=audio/pcm; samplerate=16000
Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY
Host: westus.stt.speech.microsoft.com
Transfer-Encoding: chunked
Expect: 100-continue
```

### HTTP status

The HTTP status of the response indicates success or common error conditions.

HTTP code|Meaning|Possible reason
-|-|-|
100|Continue|The initial request has been accepted. Proceed with sending the rest of the data. (Used with chunked transfer.)
200|OK|The request was successful; the response body is a JSON object.
400|Bad request|Language code not provided or is not a supported language; invalid audio file.
401|Unauthorized|Subscription key or authorization token is invalid in the specified region, or invalid endpoint.
403|Forbidden|Missing subscription key or authorization token.

### JSON response

Results are returned in JSON format. The `simple` format includes only the following top-level fields.

|Field name|Content|
|-|-|
|`RecognitionStatus`|Status, such as `Success` for successful recognition. See next table.|
|`DisplayText`|The recognized text after capitalization, punctuation, inverse text normalization (conversion of spoken text to shorter forms, such as 200 for "two hundred" or "Dr. Smith" for "doctor smith"), and profanity masking. Present only on success.|
|`Offset`|The time (in 100-nanosecond units) at which the recognized speech begins in the audio stream.|
|`Duration`|The duration (in 100-nanosecond units) of the recognized speech in the audio stream.|

The `RecognitionStatus` field might contain the following values.

|Status value|Description
|-|-|
| `Success` | The recognition was successful and the DisplayText field is present. |
| `NoMatch` | Speech was detected in the audio stream, but no words from the target language were matched. Usually means the recognition language is a different language from the one the user is speaking. |
| `InitialSilenceTimeout` | The start of the audio stream contained only silence, and the service timed out waiting for speech. |
| `BabbleTimeout` | The start of the audio stream contained only noise, and the service timed out waiting for speech. |
| `Error` | The recognition service encountered an internal error and could not continue. Try again if possible. |

> [!NOTE]
> If the audio consists only of profanity, and the `profanity` query parameter is set to `remove`, the service does not return a speech result. 


The `detailed` format includes the same fields as the `simple` format, along with an `NBest` field. The `NBest` field is a list of alternative interpretations of the same speech, ranked from most likely to least likely. The first entry is the same as the main recognition result. Each entry contains the following fields:

|Field name|Content|
|-|-|
|`Confidence`|The confidence score of the entry from 0.0 (no confidence) to 1.0 (full confidence)
|`Lexical`|The lexical form of the recognized text: the actual words recognized.
|`ITN`|The inverse-text-normalized ("canonical") form of the recognized text, with phone numbers, numbers, abbreviations ("doctor smith" to "dr smith"), and other transformations applied.
|`MaskedITN`| The ITN form with profanity masking applied, if requested.
|`Display`| The display form of the recognized text, with punctuation and capitalization added. Same as `DisplayText` in the top-level result.

### Sample responses

The following is a typical response for `simple` recognition.

```json
{
  "RecognitionStatus": "Success",
  "DisplayText": "Remind me to buy 5 pencils.",
  "Offset": "1236645672289",
  "Duration": "1236645672289"
}
```

The following is a typical response for `detailed` recognition.

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

## Text to Speech

The following are the REST endpoints for the Speech service's Text to Speech API. Use the endpoint that matches your subscription region.

[!INCLUDE [](../../../includes/cognitive-services-speech-service-endpoints-text-to-speech.md)]

The Speech service supports 24-KHz audio output in addition to the 16-Khz output supported by Bing Speech. Four 24-KHz output formats are available for use in the `X-Microsoft-OutputFormat` HTTP header, as are two 24-KHz voices, `Jessa24kRUS` and `Guy24kRUS`.

Locale | Language   | Gender | Service name mapping
-------|------------|--------|------------
en-US  | US English | Female | "Microsoft Server Speech Text to Speech Voice (en-US, Jessa24kRUS)" 
en-US  | US English | Male   | "Microsoft Server Speech Text to Speech Voice (en-US, Guy24kRUS)"

A full list of available voices is available in [Supported languages](language-support.md#text-to-speech).

### Request headers

The following fields are sent in the HTTP request header.

|Header|Meaning|
|------|-------|
|`Authorization`|An authorization token preceded by the word `Bearer`. Required. See [Authentication](#authentication).|
|`Content-Type`|The input content type: `application/ssml+xml`.|
|`X-Microsoft-OutputFormat`|The output audio format. See next table.|
|`User-Agent`|Application name. Required; must contain fewer than 255 characters.|

The available audio output formats (`X-Microsoft-OutputFormat`) incorporate both a bit rate and an encoding.

|||
|-|-|
`raw-16khz-16bit-mono-pcm`         | `raw-8khz-8bit-mono-mulaw`
`riff-8khz-8bit-mono-mulaw`     | `riff-16khz-16bit-mono-pcm`
`audio-16khz-128kbitrate-mono-mp3` | `audio-16khz-64kbitrate-mono-mp3`
`audio-16khz-32kbitrate-mono-mp3`  | `raw-24khz-16bit-mono-pcm`
`riff-24khz-16bit-mono-pcm`        | `audio-24khz-160kbitrate-mono-mp3`
`audio-24khz-96kbitrate-mono-mp3`  | `audio-24khz-48kbitrate-mono-mp3`

> [!NOTE]
> If your selected voice and output format have different bit rates, the audio is resampled as necessary. However, 24khz voices do not support `audio-16khz-16kbps-mono-siren` and `riff-16khz-16kbps-mono-siren` output formats. 

### Request body

The text to be converted to speech is sent as the body of an HTTP `POST` request in either plain text (ASCII or UTF-8) or [Speech Synthesis Markup Language](speech-synthesis-markup.md) (SSML) format (UTF-8). Plain text requests use the service's default voice and language. Send SSML to use a different voice.

### Sample request

The following HTTP request uses an SSML body to choose the voice. The body must be no longer than 1,000 characters.

```xml
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

### HTTP response

The HTTP status of the response indicates success or common error conditions.

HTTP code|Meaning|Possible reason
-|-|-|
200|OK|The request was successful; the response body is an audio file.
400 |Bad Request |A required parameter is missing, empty, or null. Or, the value passed to either a required or optional parameter is invalid. A common issue is a header that is too long.
401|Unauthorized |The request is not authorized. Check to make sure your subscription key or token is valid and in the correct region.
413|Request Entity Too Large|The SSML input is longer than 1024 characters.
429|Too Many Requests|You have exceeded the quota or rate of requests allowed for your subscription.
502|Bad Gateway	| Network or server-side issue. May also indicate invalid headers.

If the HTTP status is `200 OK`, the body of the response contains an audio file in the requested format. This file can be played as it's transferred or saved to a buffer or file for later playback or other use.

## Authentication

Sending a request to the Speech service's REST API requires either a subscription key or an access token. In general, it's easiest to send the subscription key directly. The Speech service then obtains the access token for you. To minimize response time, you might want to use an access token instead.

To obtain a token, present your subscription key to a regional Speech service `issueToken` endpoint, as shown in the following table. Use the endpoint that matches your subscription region.

[!INCLUDE [](../../../includes/cognitive-services-speech-service-endpoints-token-service.md)]

Each access token is valid for 10 minutes. You can obtain a new token at any time. If you like, you can obtain a token just before every Speech REST API request. To minimize network traffic and latency, we recommend using the same token for nine minutes.

The following sections show how to get a token and how to use it in a request.

### Get a token: HTTP

The following example is a sample HTTP request for obtaining a token. Replace `YOUR_SUBSCRIPTION_KEY` with your Speech service subscription key. If your subscription isn't in the West US region, replace the `Host` header with your region's host name.

```
POST /sts/v1.0/issueToken HTTP/1.1
Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY
Host: westus.api.cognitive.microsoft.com
Content-type: application/x-www-form-urlencoded
Content-Length: 0
```

The body of the response to this request is the access token in Java Web Token (JWT) format.

### Get a token: PowerShell

The following Windows PowerShell script illustrates how to obtain an access token. Replace `YOUR_SUBSCRIPTION_KEY` with your Speech service subscription key. If your subscription isn't in the West US region, change the host name of the given URI accordingly.

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

### Get a token: cURL

cURL is a command-line tool available in Linux (and in the Windows Subsystem for Linux). The following cURL command illustrates how to obtain an access token. Replace `YOUR_SUBSCRIPTION_KEY` with your Speech service subscription key. If your subscription isn't in the West US region, change the host name of the given URI accordingly.

> [!NOTE]
> The command is shown on multiple lines for readability, but enter it on a single line at a shell prompt.

```
curl -v -X POST 
 "https://westus.api.cognitive.microsoft.com/sts/v1.0/issueToken" 
 -H "Content-type: application/x-www-form-urlencoded" 
 -H "Content-Length: 0" 
 -H "Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY"
```

### Get a token: C#

The following C# class illustrates how to obtain an access token. Pass your Speech service subscription key when you instantiate the class. If your subscription isn't in the West US region, change the host name of `FetchTokenUri` appropriately.

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

### Use a token

To use a token in a REST API request, provide it in the `Authorization` header, following the word `Bearer`. Here is a sample Text to Speech REST request that contains a token. Substitute your actual token for `YOUR_ACCESS_TOKEN`. Use the correct host name in the `Host` header.

```xml
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

### Renew authorization

The authorization token expires after 10 minutes. Renew your authorization by obtaining a new token before it expires. As an example, you can obtain a new token after nine minutes.

The following C# code is a drop-in replacement for the class presented earlier. The `Authentication` class automatically obtains a new access token every nine minutes by using a timer. This approach ensures that a valid token is always available while your program is running.

> [!NOTE]
> Instead of using a timer, you can store a timestamp of when the last token was obtained. Then you can request a new one only if it's close to expiring. This approach avoids requesting new tokens unnecessarily and might be more suitable for programs that make infrequent Speech requests.

As before, make sure the `FetchTokenUri` value matches your subscription region. Pass your subscription key when you instantiate the class.

```cs
/*
    * This class demonstrates how to maintain a valid access token.
    */
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

## Next steps

- [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)
- [Customize acoustic models](how-to-customize-acoustic-models.md)
- [Customize language models](how-to-customize-language-model.md)

