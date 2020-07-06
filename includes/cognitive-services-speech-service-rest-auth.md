---
author: erhopf
ms.service: cognitive-services
ms.topic: include
ms.date: 03/29/2019
ms.author: erhopf
---

## Authentication

Each request requires an authorization header. This table illustrates which headers are supported for each service:

| Supported authorization headers | Speech-to-text | Text-to-speech |
|------------------------|----------------|----------------|
| Ocp-Apim-Subscription-Key | Yes | No |
| Authorization: Bearer | Yes | Yes |

When using the `Ocp-Apim-Subscription-Key` header, you're only required to provide your subscription key. For example:

```http
'Ocp-Apim-Subscription-Key': 'YOUR_SUBSCRIPTION_KEY'
```

When using the `Authorization: Bearer` header, you're required to make a request to the `issueToken` endpoint. In this request, you exchange your subscription key for an access token that's valid for 10 minutes. In the next few sections you'll learn how to get a token, and use a token.

### How to get an access token

To get an access token, you'll need to make a request to the `issueToken` endpoint using the `Ocp-Apim-Subscription-Key` and your subscription key.

The `issueToken` endpoint has this format:

```http
https://<REGION_IDENTIFIER>.api.cognitive.microsoft.com/sts/v1.0/issueToken
```

Replace `<REGION_IDENTIFIER>` with the identifier matching the region of your subscription from this table:

[!INCLUDE [](cognitive-services-speech-service-region-identifier.md)]

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

The body of the response contains the access token in JSON Web Token (JWT) format.

#### PowerShell sample

This example is a simple PowerShell script to get an access token. Replace `YOUR_SUBSCRIPTION_KEY` with your Speech Service subscription key. Make sure to use the correct endpoint for the region that matches your subscription. This example is currently set to West US.

```powershell
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

```console
curl -v -X POST
 "https://westus.api.cognitive.microsoft.com/sts/v1.0/issueToken" \
 -H "Content-type: application/x-www-form-urlencoded" \
 -H "Content-Length: 0" \
 -H "Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY"
```

#### C# sample

This C# class illustrates how to get an access token. Pass your Speech Service subscription key when you instantiate the class. If your subscription isn't in the West US region, change the value of `FetchTokenUri` to match the region for your subscription.

```csharp
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

#### Python sample

```python
# Request module must be installed.
# Run pip install requests if necessary.
import requests

subscription_key = 'REPLACE_WITH_YOUR_KEY'


def get_token(subscription_key):
    fetch_token_url = 'https://westus.api.cognitive.microsoft.com/sts/v1.0/issueToken'
    headers = {
        'Ocp-Apim-Subscription-Key': subscription_key
    }
    response = requests.post(fetch_token_url, headers=headers)
    access_token = str(response.text)
    print(access_token)
```

### How to use an access token

The access token should be sent to the service as the `Authorization: Bearer <TOKEN>` header. Each access token is valid for 10 minutes. You can get a new token at any time, however, to minimize network traffic and latency, we recommend using the same token for nine minutes.

Here's a sample HTTP request to the text-to-speech REST API:

```http
POST /cognitiveservices/v1 HTTP/1.1
Authorization: Bearer YOUR_ACCESS_TOKEN
Host: westus.stt.speech.microsoft.com
Content-type: application/ssml+xml
Content-Length: 199
Connection: Keep-Alive

// Message body here...
```
