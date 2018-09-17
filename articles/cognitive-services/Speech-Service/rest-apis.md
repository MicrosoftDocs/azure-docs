---
title: Speech service REST APIs
description: Reference for REST APIs for the Speech service.
services: cognitive-services
author: v-jerkin

ms.service: cognitive-services
ms.technology: speech
ms.topic: article
ms.date: 05/09/2018
ms.author: v-jerkin
---
# Speech service REST APIs

The REST APIs of the unified Speech service are similar to the APIs provided by the [Bing Speech API](https://docs.microsoft.com/azure/cognitive-services/Speech). The endpoints differ from the endpoints used by the previous Speech service.

## Speech to Text

The endpoints for the Speech to Text REST API are shown in the table below. Use the one that matches your subscription region.

[!INCLUDE [](../../../includes/cognitive-services-speech-service-endpoints-speech-to-text.md)]

> [!NOTE]
> If you customized the acoustic model or language model, or pronunciation, use your custom endpoint instead.

The Speech to Text REST API supports only short utterances. Requests may contain up to 10 seconds of audio and last a maximum of 14 seconds overall. The REST API only returns final results, not partial or interim results.

### Recognition mode

The recognition mode optimizes recognition for specific scenarios. The URIs above incorporate the `conversation` recognition mode in the URI. Use one of the following values in this position to declare the recognition mode.

|Recognition mode|Intended scenario|
|----------------|-----|
| `interactive` | User makes short (2-3 seconds) requests and expects the application to perform an action in response.|
| `conversation` | Users are engaged in a machine-mediated human-to-human conversation where both users can see the recognized text.|
| `dictation` | Users speak full sentences (5-8 seconds) which are transcribed for further processing.|

### Query parameters

The following parameters may be included in the query string of the REST request.

|Parameter name|Required/optional|Meaning|
|-|-|-|
|`language`|Required|The identifier of the language to be recognized. See [Supported languages](supported-languages.md).|
|`format`|Optional<br>default: `simple`|Result format, `simple` or `detailed`. Detailed results include N-best values,`RecognitionStatus`, `Offset`, and duration.|
|`profanity`|Optional<br>default: `masked`|Include profanity in recognition results. May be `masked` (replaces profanity with asterisks), `removed` (removes all profanity), or `raw` (includes profanity)

### Request headers

The following fields must be sent in the request header.

|Header|Meaning|
|------|-------|
|`Ocp-Apim-Subscription-Key`|Your Speech service subscription key. Either this header or `Authorization` must be provided.|
|`Authorization`|An authorization token preceded by the word `Bearer`. Either this header or `Ocp-Apim-Subscription-Key` must be provided. See [Authentication](#authentication).|
|`Content-type`|Describes the format and codec of the audio data. Currently, this must be `audio/wav; codec=audio/pcm; samplerate=16000`.|
|`Transfer-Encoding`|Optional. If given, must be `chunked` to allow audio data to be sent in multiple small chunks instead of a single file.|
|`Expect`|If using chunked transfer, send `Expect: 100-continue`. The Speech service will acknolwedge the initial request and awaits additional data.|
|`Accept`|Optional. If provided, must include `application/json`, as the Speech service provides results in JSON format. (Some Web request frameworks provide a default value if you do not specify one, so it is good practice to always include `Accept`)|

### Audio format

The audio is sent in the body of the HTTP `PUT` request and should be in 16-bit WAV format with PCM single channel (mono) at 16 KHz.

### Chunked transfer

Chunked transfer (`Transfer-Encoding: chunked`) can help reduce recognition latency because it allows the Speech service to begin processing the audio file to before it has been completely transmitted. Note that the REST API does not provide partial or interim results; this feature is intended solely to improve responsiveness.

The following code illustrates how to send audio in chunks. `request` is an HTTPWebRequest object connected to the appropriate REST endpoint. `audioFile` is the path to an audio file on disk.

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

The HTTP status of the response indicates common error conditions.

HTTP code|Meaning|Possible reason
-|-|-|
100|Continue|The initial request has been accepted. Proceed with sending the rest of the data. (Used with chunked transfer.)
200|OK|The request was successful; the response body is a JSON object.
400|Bad request|Language code not provided or is not a supported language.
401|Unauthorized|Subscription key or authorization token is invalid in the specified region
403|Forbidden|Bad enpdoint URI.



### JSON response

Results are returned in JSON format. The `simple` format includes only the following top-level fields.

|Field name|Content|
|-|-|
|`RecognitionStatus`|Status, such as `Success` for successful recognition. See next table.|
|`DisplayText`|The recognized text after capitalization, punctuation, inverse text normalization (conversion of spoken text to shorter forms, such as 200 for "two hundred" or "Dr. Smith" for "doctor smith"), and profanity masking. Present only on success.|
|`Offset`|The time (in 100-nanosecond units) at which the recognized speech begins in the audio stream.|
|`Duration`|The duration (in 100-nanosecond units) of the recognized speech in the audio stream.|

The `RecognitionStatus` field may contain the following values.

|Status value|Description
|-|-|
| `Success` | The recognition was successful and the DisplayText field is present. |
| `NoMatch` | Speech was detected in the audio stream, but no words from the target language were matched. Usually means the recognition language is a different language from the one the user is speaking. |
| `InitialSilenceTimeout` | The start of the audio stream contained only silence, and the service timed out waiting for speech. |
| `BabbleTimeout` | The start of the audio stream contained only noise, and the service timed out waiting for speech. |
| `Error` | The recognition service encountered an internal error and could not continue. Try again if possible. |

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

Below is a typical response for `detailed` recognition.

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

The new Text to Speech API supports 24-KHz audio output. The `X-Microsoft-OutputFormat` header may now contain the following values.

|||
|-|-|
`raw-16khz-16bit-mono-pcm`         | `audio-16khz-16kbps-mono-siren`
`riff-16khz-16kbps-mono-siren`     | `riff-16khz-16bit-mono-pcm`
`audio-16khz-128kbitrate-mono-mp3` | `audio-16khz-64kbitrate-mono-mp3`
`audio-16khz-32kbitrate-mono-mp3`  | `raw-24khz-16bit-mono-pcm`
`riff-24khz-16bit-mono-pcm`        | `audio-24khz-160kbitrate-mono-mp3`
`audio-24khz-96kbitrate-mono-mp3`  | `audio-24khz-48kbitrate-mono-mp3`

The Speech service now provides two 24-KHz voices:

Locale | Language   | Gender | Service name mapping
-------|------------|--------|------------
en-US  | US English | Female | "Microsoft Server Speech Text to Speech Voice (en-US, Jessa24kRUS)" 
en-US  | US English | Male   | "Microsoft Server Speech Text to Speech Voice (en-US, Guy24kRUS)"

The following are the REST endpoints for the unified Speech service Text to Speech API. Use the endpoint that matches your subscription region.

[!INCLUDE [](../../../includes/cognitive-services-speech-service-endpoints-text-to-speech.md)]

Keep these differences in mind as you refer to the [REST API documentation](https://docs.microsoft.com/azure/cognitive-services/speech/api-reference-rest/bingvoiceoutput) for the previous Speech API.

## Authentication

Sending a request to the Speech service's REST API requires an access token. You obtain a token by providing your subscription key to a regional Speech service `issueToken` endpoint, shown in the table below. Use the endpoint that matches your subscription region.

[!INCLUDE [](../../../includes/cognitive-services-speech-service-endpoints-token-service.md)]

Each access token is valid for 10 minutes. You may obtain a new token at any time—including, if you like, just before every Speech REST API request. To minimize network traffic and latency, however, we recommend using the same token for nine minutes.

The following sections show how to get a token and how to use it in a request.

### Getting a token: HTTP

Below is a sample HTTP request for obtaining a token. Replace `YOUR_SUBSCRIPTION_KEY` with your Speech service subscription key. If your subscription is not in the West US region, replace the `Host` header with your region's hostname.

```
POST /sts/v1.0/issueToken HTTP/1.1
Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY
Host: westus.api.cognitive.microsoft.com
Content-type: application/x-www-form-urlencoded
Content-Length: 0
```

The body of the response to this request is the access token in Java Web Token (JWT) format.

### Getting a token: PowerShell

The Windows PowerShell script below illustrates how to obtain an access token. Replace `YOUR_SUBSCRIPTION_KEY` with your Speech service subscription key. If your subscription is not in the West US region, change the hostname of the given URI accordingly.

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

### Getting a token: cURL

cURL is a command-line tool available in Linux (and in the Windows Subsystem for Linux). The cURL command below illustrates how to obtain an access token. Replace `YOUR_SUBSCRIPTION_KEY` with your Speech service subscription key. If your subscription is not in the West US region, change the hostname of the given URI accordingly.

> [!NOTE]
> The command is shown on multiple lines for readability, but should entered on a single line at a shell prompt.

```
curl -v -X POST 
 "https://westus.api.cognitive.microsoft.com/sts/v1.0/issueToken" 
 -H "Content-type: application/x-www-form-urlencoded" 
 -H "Content-Length: 0" 
 -H "Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY"
```

### Getting a token: C#

The C# class below illustrates how to obtain an access token. Pass your Speech service subscription key when instantiating the class. If your subscription is not in the West US region, change the hostname of `FetchTokenUri` appropriately.

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

### Using a token

To use a token in a REST API request, provide it in the `Authorization` header, following the word `Bearer`. Here, for example, is a sample Text to Speech REST request containing a token. Substitute your actual token for `YOUR_ACCESS_TOKEN` and use the correct hostname in the `Host` header.

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

### Renewing authorization

The authorization token expires after 10 minutes. Renew your authorization by obtaining a new token before it expires—for example, after nine minutes. 

The following C# code is a drop-in replacement for the class presented earlier. The `Authentication` class automatically obtains a new access token every nine minutes using a timer. This approach ensures that a valid token is always available while your program is running.

> [!NOTE]
> Instead of using a timer, you could store a timestamp of when the current token was obtained, then request a new one only if the current token is close to expiring. This approach avoids requesting new tokens unnecessarily and may be more suitable for programs that make infrequent Speech requests.

As before, make sure the `FetchTokenUri` value matches your subscription region. Pass your subscription key when instantiating the class.

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

