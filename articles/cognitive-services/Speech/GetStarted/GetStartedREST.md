---
title: Get Started with the Speech API using REST in C# | Microsoft Docs
description: Use the Bing Speech API in Microsoft Cognitive Services to develop basic REST applications that convert spoken audio to text.
services: cognitive-services
author: v-ducvo
manager: rstand

ms.service: cognitive-services
ms.technology: speech
ms.topic: article
ms.date: 04/28/201
ms.author: v-ducvo
---

# Get Started with Speech Recognition using REST API

With Bing Speech API you can develop applications using REST API to convert spoken audio to text. This article will help you to do speech recognition via REST end point. 

## Prerequisites

#### Subscribe to Speech API and get a free trial subscription key
To access the REST end point, you must subscribe to Speech API which is part of Microsoft Cognitive Services (previously Project Oxford). After subscribing, you will have the necessary subscription keys to execute this operation. Both the primary and secondary keys can be used. For subscription and key management details, see [Subscriptions](https://azure.microsoft.com/en-us/try/cognitive-services/). 

#### Precorded audio file
Record a short audio file of you saying something short (e.g.: *"What is the weather like today?"* or *"Find funny movies to watch."*) You will pass this audio to the Bing Speech API via the REST end point to have it transcribe into text. Or, you can use the microphone at the time of the request.

> [!NOTE]
> The Speech Recognition API supports audio/wav using the following codecs: 
> * PCM single channel


# Getting started
To use Speech API REST end point, the process is as follows:
1. Authenticate and get a JSON Web Token (JWT) from the token service.
2. Set the proper request header and send the request to Bing Speech API REST end point.
3. Parse the response to get your transcribed text.

The sections following will provide more details.

## Authentication
To access the REST endpoint, you need a valid OAuth token. To get this token, you must have a subscription key from the Speech API. When you request for a token, the token service will send the access token back as a JSON Web Token (JWT). The JWT access token is passed through in the Speech request header. The token has an expiry of 10 minutes. The recommendation is to look into the JWT token and check
the expiry time instead of hard-coding it to 10 minutes using the Expiration JwtSecurityToken property.

The token service URI is located here:

```
https://api.cognitive.microsoft.com/sts/v1.0/issueToken
```

The code below is an example implementation in C# for how to handle authentication:

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

The `FetchToken` method sends the request and the authentication payload is as follows:

```
POST https://api.cognitive.microsoft.com/sts/v1.0/issueToken HTTP/1.1
Ocp-Apim-Subscription-Key: <GUID>
Host: api.cognitive.microsoft.com
Content-Length: 0
Connection: Keep-Alive
```

## REST end point
The URL hostname for all requests is ```speech.platform.bing.com```. 
For example,
```
https://speech.platform.bing.com/speech/recognition/interactive/cognitiveservices/v1?language=it-IT
```
## Recognition Mode  
You specify the *recognition mode* as part of the URL path for the Microsoft Speech Service. The following recognition modes are supported.  

| Mode | Path | URL Example |
|---- | ---- | ---- |
| Interactive/Command | /speech/recognition/interactive/cognitiveservices/v1 | https://speech.platform.bing.com/speech/recognition/interactive/cognitiveservices/v1?language=pt-BR |
| Conversation | /speech/recognition/conversation/cognitiveservices/v1 | https://speech.platform.bing.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US |
| Dictation | /speech/recognition/dictation/cognitiveservices/v1 | https://speech.platform.bing.com/speech/recognition/dictation/cognitiveservices/v1?language=fr-FR | 


## Request headers
To send the request to the REST end point, create a **HttpWebRequest** object and set the request headers. For example, set `Method="POST"`, set `Host=@"speech.platform.bing.com"`, and set the access token as follows `Headers["Authorization"] = "Bearer " + token;`. The code snippet below shows a sample of a request header.

```cs
HttpWebRequest request = null;
request = (HttpWebRequest)HttpWebRequest.Create(requestUri);
request.SendChunked = true;
request.Accept = @"application/json;text/xml";
request.Method = "POST";
request.ProtocolVersion = HttpVersion.Version11;
request.Host = @"speech.platform.bing.com";
request.ContentType = @"audio/wav; codec=""audio/pcm""; samplerate=16000";
request.Headers["Authorization"] = "Bearer " + token;
```

The follow is a sample request payload:

```
POST https://speech.platform.bing.com/speech/recognition/interactive/cognitiveservices/v1?language=en-US&format=detailed&requestid=39530efe-5677-416a-98b0-93e13ec93c2b HTTP/1.1
Accept: application/json;text/xml
Content-Type: audio/wav; codec="audio/pcm"; samplerate=16000
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzY29wZSI6Imh0dHBzOi8vc3BlZWNoLnBsYXRmb3JtLmJpbmcuY29tIiwic3Vic2NyaXB0aW9uLWlkIjoiMWRjYWQxZTQzZWZlNDM2MmIzMjg2ZWY2OTIzYTA5MjYiLCJwcm9kdWN0LWlkIjoiQmluZy5TcGVlY2guRjAiLCJjb2duaXRpdmUtc2VydmljZXMtZW5kcG9pbnQiOiJodHRwczovL2FwaS5jb2duaXRpdmUubWljcm9zb2Z0LmNvbS9pbnRlcm5hbC92MS4wLyIsImF6dXJlLXJlc291cmNlLWlkIjoiL3N1YnNjcmlwdGlvbnMvYTM0Y2FkYmYtNTU5My00ZWYxLWI0MjItMDJhMDMyNmQ2NmZkL3Jlc291cmNlR3JvdXBzL1Rlc3QvcHJvdmlkZXJzL01pY3Jvc29mdC5Db2duaXRpdmVTZXJ2aWNlcy9hY2NvdW50cy9UZXN0U1BlZWNoIiwiaXNzIjoidXJuOm1zLmNvZ25pdGl2ZXNlcnZpY2VzIiwiYXVkIjoidXJuOm1zLnNwZWVjaCIsImV4cCI6MTQ5MzQyOTE2OX0._Bhx7nneMto2gjAAwmIO6eiSejQ2Nqhd8xFl0odjk40
Host: speech.platform.bing.com
Transfer-Encoding: chunked
Expect: 100-continue
```

## Chunked transfer encoding
Bing Speech API supports chuncked transfer encoding for efficient audio streaming. To transcribe speech to text, you can send the audio as one whole chunk or you can chop the audio into small chunks. For efficient audio transcription it is recommended that you use [chunked transfer encoding](https://en.wikipedia.org/wiki/Chunked_transfer_encoding) to stream the audio to the service. Other implementations may result in higher user-perceived latency. 

> [!NOTE]
> You may not upload more than 10 seconds of audio in any one request and the total request duration cannot exceed 14 seconds. 

The code snippet below shows an example of an audio file being chunked into 1024 byte chunks.

```cs
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

## Speech recognition response
After processing the request, Bing Speech API returns the results in a response as JSON format. The code snippet below shows an example of how you can read the response from the stream:

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
