---
title: Speech service REST APIs | Microsoft Docs
description: Reference for REST APIs for the Speech service.
titleSuffix: "Microsoft Cognitive Services"
services: cognitive-services
author: v-jerkin
manager: noellelacharite

ms.service: cognitive-services
ms.component: speech-service
ms.topic: article
ms.date: 04/28/2018
ms.author: v-jerkin
---
# Speech service REST APIs

The REST APIs for the unified Speech service are similar to the APIs provided by the [Speech service](https://docs.microsoft.com/azure/cognitive-services/Speech) (formerly known as the Bing Speech Service) and the [Translator Speech service](https://docs.microsoft.com/azure/cognitive-services/translator-speech/). In general, only the endpoints differ between the two.

<a name="speech-to-text"></a>
## Speech to Text API

In the **Speech to Text** API, only the endpoints used differ from the previous Speech service Speech Recognition API. Use the one that is appropriate to your subscription. The new endpoints are shown in the table below.

Region|	Endpoint
-|-
West US|	`https://westus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1
`
East Asia|	`https://eastasia.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1`
North Europe|	`https://northeurope.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1`

> [!NOTE]
> If you customized the acoustic or language model, or the pronunciation, use your custom endpoint instead.

Keep these differences in mind as you read the [REST API documentation](https://docs.microsoft.com/azure/cognitive-services/speech/getstarted/getstartedrest) for the Bing Speech service. The Speech to Text API supports REST only for short (< 15 seconds) utterances.

<a name="text-to-speech"></a>
## Text to Speech API

The following are the REST endpoints for the unified Speech service Text to Speech API. Use the one that is appropriate to your subscription.

Region|	Endpoint
-|-
West US|	https://westus.tts.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1
East Asia|	https://eastasia.tts.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1
North Europe|	https://northeurope.tts.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1

> [!NOTE]
> If you created a custom voice font, use your custom endpoint instead.

In the **Text to Speech** API, the `X-Microsoft-OutputFormat` header now takes the following values.

|||
|-|-|
`raw-16khz-16bit-mono-pcm`         | `audio-16khz-16kbps-mono-siren `
`riff-16khz-16kbps-mono-siren`     | `riff-16khz-16bit-mono-pcm`
`audio-16khz-128kbitrate-mono-mp3` | `audio-16khz-64kbitrate-mono-mp3`
`audio-16khz-32kbitrate-mono-mp3`  | `raw-24khz-16bit-mono-pcm`
`riff-24khz-16bit-mono-pcm`        | `audio-24khz-160kbitrate-mono-mp3`
`audio-24khz-96kbitrate-mono-mp3`  | `audio-24khz-48kbitrate-mono-mp3`

The service includes two additional voices:

Locale | Language | Gender  | Service name mapping
-------|-----------|--------|------------
en-US | US English | Male   | "Microsoft Server Speech Text to Speech Voice (en-US, Jessa24kRUS)" 
en-US | US English | Female | "Microsoft Server Speech Text to Speech Voice (en-US, Guy24kRUS)"


Keep these differences in mind as you refer to the [REST API documentation](https://docs.microsoft.com/azure/cognitive-services/speech/api-reference-rest/bingvoiceoutput) for the Speech service.

# Authenticate to the Speech service

The Speech service supports authentication by either a subscription key or an authorization token. For most applications, it is easier to use a subscription key, since obtaining an authorization token requires a subscription key anyway. This article provides instructions for both approaches.

You can get free trial subscription keys from the [Cognitive Services subscription](https://azure.microsoft.com/try/cognitive-services/) page. After you select the Speech service, choose **Get API Key** to get two keys (primary and secondary). You may use either key. Both keys are tied to the same quota.

> [!NOTE]
> Paid subscription keys are available through your Azure dashboard.

## Using subscription key

### Using REST API

Pass the subscription key in the `Ocp-Apim-Subscription-Key` field in the HTTP request header.

Name| Format| Description
----|-------|------------
Ocp-Apim-Subscription-Key | ASCII | YOUR_SUBSCRIPTION_KEY

Below is an example of a request header. The example request uses the `westus` endpoint for **Text to Speech**. If your subscription is in another region, adjust the URL accordingly.

```HTTP
POST https://westus.tts.speech.microsoft.com/cognitiveservicesspeech/recognition/conversation/cognitiveservices/v1?language=en-us&format=detailed HTTP/1.1
Accept: application/json;text/xml
Content-Type: audio/wav; codec=audio/pcm; samplerate=16000
Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY
Host: speech.platform.bing.com
Transfer-Encoding: chunked
Expect: 100-continue
```

### Using Client SDKs

If you use the [client SDK](speech-sdk.md) in your application, you provide your subscription key to the SDK, and the SDK handles authentication with the Speech service. You do not need to manage the key yourself.

> [!TIP]
> If you are having trouble authenticating, verify that you can get an authorization token with your subscription key as described in the next section.

## Using authorization token

You can use an authorization token obtained from the Cognitive Services authorization service for authentication. 

After you have a valid subscription key, send a POST request to the authorization service. The response contains the authorization token in the form of a JSON Web Token (JWT).

> [!NOTE]
> Tokens have a lifetime of 10 minutes. Keep track of when you last obtained a token and request a new one before the old one expires, rather than obtaining a new token when a request fails.

The token service endpoint is relative to function you are using and the region. Choose the appropriate URI from the table below.

|Function|Regional endpoints|
|-|-|
`https://westus.api.cognitive.microsoft.com/sts/v1.0/issueToken`<br>`https://eastasia.api.cognitive.microsoft.com/sts/v1.0/issueToken`<br>`https://northeurope.api.cognitive.microsoft.com/sts/v1.0/issueToken`|

### Obtain a token

The following code samples illustrate how to get an access token using Windows PowerShell, the `curl` utility available in most Linux distributions, or the C# programming language. A sample HTTP request is also shown. Replace `YOUR_SUBSCRIPTION_KEY` in the samples with your own subscription key and `TOKEN_SERVICE_ENDPOINT` with the appropriate URL from the table above.

* PowerShell
    ```Powershell
    $FetchTokenHeader = @{
      'Content-type'='application/x-www-form-urlencoded';
      'Content-Length'= '0';
      'Ocp-Apim-Subscription-Key' = 'YOUR_SUBSCRIPTION_KEY'
    }
    
    $OAuthToken = Invoke-RestMethod -Method POST -Uri TOKEN_SERVICE_ENDPOINT -Headers $FetchTokenHeader
    
    # show the token received
    $OAuthToken
    
    ```
* cURL

    ```curl
    curl -v -X POST "TOKEN_SERVICE_ENDPOINT" -H "Content-type: application/x-www-form-urlencoded" -H "Content-Length: 0" -H "Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY"
    ```

* C#

    ```cs
        /*
         * This class demonstrates how to get a valid access token.
         */
        public class Authentication
        {
            public static readonly string FetchTokenUri = "TOKEN_SERVICE_ENDPOINT";
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
    
                    var result = await client.PostAsync(FetchTokenUri, null);
                    Console.WriteLine("Token Uri: {0}", uriBuilder.Uri.AbsoluteUri);
                    return await result.Content.ReadAsStringAsync();
                }
            }
        }
    ```

The following is how a token request looks in raw HTTP.

```http
POST TOKEN_SERVICE_ENDPOINT HTTP/1.1
Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY
Host: api.cognitive.microsoft.com
Content-type: application/x-www-form-urlencoded
Content-Length: 0
Connection: Keep-Alive
```

If you cannot obtain an authorization token from the token service, make sure your subscription key is still valid and that you have not exceeded its quotas. If you are using a free trial key, go to the [Cognitive Services subscription](https://azure.microsoft.com/try/cognitive-services/) page and log in using the account that you used for applying the free trial key to see the status of your subscription. For a paid subscription, consult your Azure dashboard.

### Use a token in a request

Each time you call the Speech API, pass the authorization token in the `Authorization` header. The header must contain the word `Bearer` followed by the token.

The following examples show how to use an authorization token when you call the Speech REST API for **Text to Speech**. The requests use the `westus` endpoint; if your subscription is in another region, adjust the URL accordingly.

> [!NOTE]
> Replace `YOUR_AUDIO_FILE` with the path to your prerecorded audio file. Replace `YOUR_ACCESS_TOKEN` with the authorization token you got in the previous step [Get an authorization token](#obtain-a-token).

* PowerShell

    ```Powershell
    
    $SpeechServiceURI =
    'https://westus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1
/?language=en-us&format=detailed'
    
    # $OAuthToken is the authrization token returned by the token service.
    $RecoRequestHeader = @{
      'Authorization' = 'Bearer '+ $OAuthToken;
      'Transfer-Encoding' = 'chunked'
      'Content-type' = 'audio/wav; codec=audio/pcm; samplerate=16000'
    }
    
    # Read audio into byte array
    $audioBytes = [System.IO.File]::ReadAllBytes("YOUR_AUDIO_FILE")
    
    $RecoResponse = Invoke-RestMethod -Method POST -Uri $SpeechServiceURI -Headers $RecoRequestHeader -Body $audioBytes
    
    # Show the result
    $RecoResponse
    
    ```

* cURL

    ```
    curl -v -X POST "https://westus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1
/?language=en-us&format=detailed" -H "Transfer-Encoding: chunked" -H "Authorization: Bearer YOUR_ACCESS_TOKEN" -H "Content-type: audio/wav; codec=audio/pcm; samplerate=16000" --data-binary @YOUR_AUDIO_FILE
    ```

* C#

    ```cs
    HttpWebRequest request = null;
    request = (HttpWebRequest)HttpWebRequest.Create("https://westus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1
?language=en-us&format=detailed");
    request.SendChunked = true;
    request.Accept = "application/json;text/xml";
    request.Method = "POST";
    request.ProtocolVersion = HttpVersion.Version11;
    request.Host = "westus.tts.speech.microsoft.com";
    request.ContentType = @"audio/wav; codec=audio/pcm; samplerate=16000";
    request.Headers["Authorization"] = "Bearer " + token;
    
    // Send an audio file by 1024 byte chunks
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

### Renew a token

The authorization token expires after a certain time period (currently 10 minutes). You must renew the authorization token before it expires. The following code is an example implementation in C# of how to renew the authorization token. The token is cached until it is close to expiring. As before, use the appropriate token service endpoint for the Speech function you are using and the region your subscription is in.

```cs
    /*
     * This class demonstrates how to get a valid O-auth token.
     */
    public class Authentication
    {
        public static readonly string FetchTokenUri = "https://westus.api.cognitive.microsoft.com/sts/v1.0";
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
                uriBuilder.Path += "/issueToken";

                var result = await client.PostAsync(uriBuilder.Uri.AbsoluteUri, null);
                Console.WriteLine("Token Uri: {0}", uriBuilder.Uri.AbsoluteUri);
                return await result.Content.ReadAsStringAsync();
            }
        }
    }
```

## Next steps

* [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)
* [See how to recognize speech in C#](quickstart-csharp-windows.md)
