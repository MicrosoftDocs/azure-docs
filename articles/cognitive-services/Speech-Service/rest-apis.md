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

The REST APIs of the unified Speech service are similar to the APIs provided by the [Speech API](https://docs.microsoft.com/azure/cognitive-services/Speech) (formerly known as the Bing Speech Service). The endpoints differ from the endpoints used by the previous Speech service.

## Speech to Text

In the Speech to Text API, only the endpoints used differ from the previous Speech service Speech Recognition API. The new endpoints are shown in the table below. Use the one that matches your subscription region.

[!INCLUDE [](../../../includes/cognitive-services-speech-service-endpoints-speech-to-text.md)]

The Speech to Text API is otherwise similar to the [REST API](https://docs.microsoft.com/azure/cognitive-services/speech/getstarted/getstartedrest) for the previous Speech API.

The Speech to Text REST API supports only short utterances. Requests may contain up to 10 seconds of audio and last a maximum of 14 seconds overall. The REST API only returns final results, not partial or interim results.

> [!NOTE]
> If you customized the acoustic model or language model, or pronunciation, use your custom endpoint instead.

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

