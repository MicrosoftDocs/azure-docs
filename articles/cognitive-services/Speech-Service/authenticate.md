---
title: Authenticate to the Speech service | Microsoft Docs
description: How to obtain authentication to use the Speech service
services: cognitive-services
author: zhouwangzw
manager: wolfma

ms.service: cognitive-services
ms.technology: speech
ms.topic: article
ms.date: 09/15/2017
ms.author: zhouwang
---
# Authenticate to the Speech API

The Speech service supports authentication by with either a subscription key or an authorization token. For most applications, it is easier to use a subscription key, since obtaining an authorization token requires a subscription key anyway.

You can get free trial subscription keys from the [Cognitive Services subscription](https://azure.microsoft.com/try/cognitive-services/) page. After you select the Speech service, choose **Get API Key** to get two keys (primary and secondary). You may use use either key. Both keys are tied to the same quota.

Paid subscription keys are available through your Azure dashboard.

## Subscription key

### REST API

Pass the subscription key in the `Ocp-Apim-Subscription-Key` field in the HTTP request header.

Name| Format| Description
----|-------|------------
Ocp-Apim-Subscription-Key | ASCII | YOUR_SUBSCRIPTION_KEY

The following is an example of a request header. The request uses the `westus` endpoint for Text to Speech; if your subscription is in another region, adjust the URL accordingly.

TODO update service endpoint

```HTTP
POST https://speech.platform.bing.com/speech/recognition/interactive/cognitiveservices/v1?language=en-US&format=detailed HTTP/1.1
Accept: application/json;text/xml
Content-Type: audio/wav; codec=audio/pcm; samplerate=16000
Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY
Host: speech.platform.bing.com
Transfer-Encoding: chunked
Expect: 100-continue
```

### Client SDKs

If you use [client SDK](speech-sdk.md) in your application, you provide your subscription key when initializing the SDK. 

> [!TIP]
> If you are having trouble authenticating, verify that you can get an authorization token with your subscription key as described in the next section.

## Authorization token

You can use an authorization token obtained from the Cognitive Services authorization service for authentication.

After you have a valid subscription key, send a POST request to the authorization service. The response contains the authorization token in the form of a JSON Web Token (JWT).

> [!NOTE]
> Tokens have an expiration of 10 minutes. You should keep track of when you last obtained a token and request a new one before the old one expires, rather than obtaining a new token when a request fails.

The token service endpoint is relative to function you are using and the region. Choose the appropriate endpoint from the table below.

|Function|Regional endpoints|
|-|-|
|Speech to Text|`https://westus.stt.speech.microsoft.com`<br>`https://eastasia.stt.speech.microsoft.com`<br>`https://northeurope.stt.speech.microsoft.com`|
|Text to Speech|`https://westus.api.cognitive.microsoft.com/sts/v1.0/issueToken`<br>`https://eastasia.api.cognitive.microsoft.com/sts/v1.0/issueToken`<br>`https://northeurope.api.cognitive.microsoft.com/sts/v1.0/issueToken`|
|Speech Translation|TODO|

### Obtain a token

The following code samples illustrate how to get an access token using Windows PowerShell, the `curl` utility available in most Linux distributions (or Windows Subsystem for Linux), or the C# programming language. A sample HTTP request is also shown. Replace `YOUR_SUBSCRIPTION_KEY` in the samples with your own subscription key and `TOKEN_SERVICE_ENDPOINT` with the appropriate URL from the table above.

# [PowerShell](#tab/Powershell)

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

# [curl](#tab/curl)

```
curl -v -X POST "TOKEN_SERVICE_ENDPOINT" -H "Content-type: application/x-www-form-urlencoded" -H "Content-Length: 0" -H "Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY"
```

# [C#](#tab/CSharp)

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

# HTTP(#tab/HTTP)

```
POST TOKEN_SERVICE_ENDPOINT HTTP/1.1
Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY
Host: api.cognitive.microsoft.com
Content-type: application/x-www-form-urlencoded
Content-Length: 0
Connection: Keep-Alive
```

If you cannot obtain an authorization token from the token service, make sure your subscription key is still valid and that you have not exceeded its quotas. If you are using a free trial key, go to the [Cognitive Services subscription](https://azure.microsoft.com/try/cognitive-services/) page and log in using the account that you used for applying the free trial key to see the status of your subscription. For a paid subscription, consult your Azure dashboard.

### Use a token in a request

TODO update endpoint in sample request

Each time you call the Speech API, pass the authorization token in the `Authorization` header. The `Authorization` header must contain a JWT access token.

The following examples show how to use an authorization token when you call the Speech REST API.  The requests use the `westus` endpoint for Text to Speech; if your subscription is in another region, adjust the URL accordingly.

> [!NOTE]
> Replace `YOUR_AUDIO_FILE` with the path to your prerecorded audio file. Replace `YOUR_ACCESS_TOKEN` with the authorization token you got in the previous step [Get an authorization token](#get-an-authorization-token).

# [PowerShell](#tab/Powershell)

```Powershell

$SpeechServiceURI =
'https://westus.tts.speech.microsoft.com/cognitiveservices/v1?language=en-us&format=detailed'

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

# [curl](#tab/curl)

```
curl -v -X POST "https://westus.tts.speech.microsoft.com/cognitiveservices/v1?language=en-us&format=detailed" -H "Transfer-Encoding: chunked" -H "Authorization: Bearer YOUR_ACCESS_TOKEN" -H "Content-type: audio/wav; codec=audio/pcm; samplerate=16000" --data-binary @YOUR_AUDIO_FILE
```

# [C#](#tab/CSharp)

```cs
HttpWebRequest request = null;
request = (HttpWebRequest)HttpWebRequest.Create("TODO - need STT endpoint here");
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

---

### Renew a token

The authorization token expires after a certain time period (currently 10 minutes). You need to renew the authorization token before it expires. The following code is an example implementation in C# of how to renew the authorization token. As before, use the appropriate token service endpoint for the Speech function you are using and the region your subscription is in.

```cs
    /*
     * This class demonstrates how to get a valid O-auth token.
     */
    public class Authentication
    {
        public static readonly string FetchTokenUri = "https://api.cognitive.microsoft.com/sts/v1.0";
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
