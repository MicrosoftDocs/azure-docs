---
author: erhopf
ms.service: azure-ai-speech
ms.topic: include
ms.date: 07/01/2021
ms.author: erhopf
---

Each request requires an authorization header. This table illustrates which headers are supported for each feature:

| Supported authorization header | Speech to text | Text to speech |
|------------------------|----------------|----------------|
| `Ocp-Apim-Subscription-Key` | Yes | Yes |
| `Authorization: Bearer` | Yes | Yes |

When you're using the `Ocp-Apim-Subscription-Key` header, only your resource key must be provided. For example:

```http
'Ocp-Apim-Subscription-Key': 'YOUR_SUBSCRIPTION_KEY'
```

When you're using the `Authorization: Bearer` header, you need to make a request to the `issueToken` endpoint. In this request, you exchange your resource key for an access token that's valid for 10 minutes.

Another option is to use Microsoft Entra authentication that also uses the `Authorization: Bearer` header, but with a token issued via Microsoft Entra ID. See [Use Microsoft Entra authentication](#use-microsoft-entra-authentication).

### How to get an access token

To get an access token, you need to make a request to the `issueToken` endpoint by using `Ocp-Apim-Subscription-Key` and your resource key.

The `issueToken` endpoint has this format:

```http
https://<REGION_IDENTIFIER>.api.cognitive.microsoft.com/sts/v1.0/issueToken
```

Replace `<REGION_IDENTIFIER>` with the identifier that matches the [region](../regions.md) of your subscription.

Use the following samples to create your access token request.

#### HTTP sample

This example is a simple HTTP request to get a token. Replace `YOUR_SUBSCRIPTION_KEY` with your resource key for the Speech service. If your subscription isn't in the West US region, replace the `Host` header with your region's host name.

```http
POST /sts/v1.0/issueToken HTTP/1.1
Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY
Host: eastus.api.cognitive.microsoft.com
Content-type: application/x-www-form-urlencoded
Content-Length: 0
```

The body of the response contains the access token in JSON Web Token (JWT) format.

#### PowerShell sample

This example is a simple PowerShell script to get an access token. Replace `YOUR_SUBSCRIPTION_KEY` with your resource key for the Speech service. Make sure to use the correct endpoint for the region that matches your subscription. This example is currently set to West US.

```powershell
$FetchTokenHeader = @{
  'Content-type'='application/x-www-form-urlencoded';
  'Content-Length'= '0';
  'Ocp-Apim-Subscription-Key' = 'YOUR_SUBSCRIPTION_KEY'
}

$OAuthToken = Invoke-RestMethod -Method POST -Uri https://eastus.api.cognitive.microsoft.com/sts/v1.0/issueToken
 -Headers $FetchTokenHeader

# show the token received
$OAuthToken

```

#### cURL sample

cURL is a command-line tool available in Linux (and in the Windows Subsystem for Linux). This cURL command illustrates how to get an access token. Replace `YOUR_SUBSCRIPTION_KEY` with your resource key for the Speech service. Make sure to use the correct endpoint for the region that matches your subscription. This example is currently set to West US.

```console
curl -v -X POST \
 "https://eastus.api.cognitive.microsoft.com/sts/v1.0/issueToken" \
 -H "Content-type: application/x-www-form-urlencoded" \
 -H "Content-Length: 0" \
 -H "Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY"
```

#### C# sample

This C# class illustrates how to get an access token. Pass your resource key for the Speech service when you instantiate the class. If your subscription isn't in the West US region, change the value of `FetchTokenUri` to match the region for your subscription.

```csharp
public class Authentication
{
    public static readonly string FetchTokenUri =
        "https://eastus.api.cognitive.microsoft.com/sts/v1.0/issueToken";
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
    fetch_token_url = 'https://eastus.api.cognitive.microsoft.com/sts/v1.0/issueToken'
    headers = {
        'Ocp-Apim-Subscription-Key': subscription_key
    }
    response = requests.post(fetch_token_url, headers=headers)
    access_token = str(response.text)
    print(access_token)
```

### How to use an access token

The access token should be sent to the service as the `Authorization: Bearer <TOKEN>` header. Each access token is valid for 10 minutes. You can get a new token at any time, but to minimize network traffic and latency, we recommend using the same token for nine minutes.

Here's a sample HTTP request to the Speech to text REST API for short audio:

```http
POST /cognitiveservices/v1 HTTP/1.1
Authorization: Bearer YOUR_ACCESS_TOKEN
Host: westus.stt.speech.microsoft.com
Content-type: application/ssml+xml
Content-Length: 199
Connection: Keep-Alive

// Message body here...
```

### Use Microsoft Entra authentication

To use Microsoft Entra authentication with the Speech to text REST API for short audio, you need to create an access token.
The steps to obtain the access token consisting of Resource ID and  Microsoft Entra access token are the same as when using the Speech SDK.
Follow the steps here [Use Microsoft Entra authentication](../how-to-configure-azure-ad-auth.md)

> [!div class="checklist"]
>
> - Create a Speech resource
> - Configure the Speech resource for Microsoft Entra authentication
> - Get a Microsoft Entra access token
> - Get the Speech resource ID

After the resource ID and the Microsoft Entra access token were obtained, the actual access token can be constructed following this format:
```http
aad#YOUR_RESOURCE_ID#YOUR_MICROSOFT_ENTRA_ACCESS_TOKEN
```
You need to include the "aad#" prefix and the "#" (hash) separator between resource ID and the access token.

Here's a sample HTTP request to the Speech to text REST API for short audio:

```http
POST /cognitiveservices/v1 HTTP/1.1
Authorization: Bearer YOUR_ACCESS_TOKEN
Host: westus.stt.speech.microsoft.com
Content-type: application/ssml+xml
Content-Length: 199
Connection: Keep-Alive

// Message body here...
```

To learn more about Microsoft Entra access tokens, including token lifetime, visit [Access tokens in the Microsoft identity platform](/azure/active-directory/develop/access-tokens).





