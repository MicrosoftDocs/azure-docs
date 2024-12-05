---
title: Send OptOut API requests with API (HMAC)
description: Learn how to send OptOut API requests with API (HMAC).
services: azure-communication-services
author: besh2014
product manager: dbasantes
ms.service: azure-communication-services
ms.author: dbasantes
ms.subservice: sms
ms.date: 12/04/2024
ms.topic: quickstart
---

# Send OptOut API requests with API (HMAC)

This article describes how to enable opt-out management for your Azure Communication Services resource using hash message authentication code (HMAC) based authentication.

## Global Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active Communication Services resource and connection string. See [Create a Communication Services resource](../create-communication-resource.md).
- To enable Opt-out management on your Azure Communication Services resource, contact [acs_telco_messaging@microsoft.com](mailto:acs_telco_messaging@microsoft.com) to allowlist your `Immutable resource Id` (as listed on the **Properties** page in the Azure portal), and associated SMS-enabled toll-free numbers. 

## Quickstart: Send OptOut API requests with API (HMAC)
Sending an Opt-out API request is similar to SMS as described in the [Azure Communication Services Postman Tutorial](https://learn.microsoft.com/azure/communication-services/tutorials/postman-tutorial) with the difference of endpoints for OptOut Actions (Add, Remove, or Check) and body. The request body has the same structure for all actions, while the response content slightly differs.

### Endpoints

| Action | Endpoint |
|--------|----------|
| Add    | `{{endpoint}}/sms/optouts:add?api-version=2024-12-10-preview` |
| Remove | `{{endpoint}}/sms/optouts:remove?api-version=2024-12-10-preview` |
| Check  | `{{endpoint}}/sms/optouts:check?api-version=2024-12-10-preview` |

Here are some examples in different languages.

### Sample Request

#### Request Headers

| Header                | Value                                                           |
|-----------------------|-----------------------------------------------------------------|
| Content-Type          | application/json                                                |
| x-ms-date             | Thu, 10 Aug 2023 12:39:55 GMT                                   |
| x-ms-content-sha256   | JKUqoPANwVA55u/NOCsS0Awa4cYrKKNtBwUqoaqrob0=                    |
| Authorization         | HMAC-SHA256 SignedHeaders=x-ms-date;host;x-ms-content-sha256&Signature=IMbd3tE3nOgEkeUQGng6oQew5aEcrZJQqHkyq8qsbLg= |

#### Request Body

```json
{
    "from": "+15551234567",
    "recipients": [
        {
            "to": "+15550112233"
        },
        {
            "to": "+15550112234"
        }
    ]
}
```

### Sample Response
In general, response contents are the same for all actions and contain the success or failure `HttpStatusCode` per recipient. The only difference is that the `Check` action, which also returns the `isOptedOut` flag.

#### Response Status
- 200 Ok

#### Add OptOut action response body

```json
{
    "value": [
        {
            "to": "+15550112233",
            "httpStatusCode": 200
        },
        {
            "to": "+15550112234",
            "httpStatusCode": 200
        }
    ]
}
```

#### Remove OptOut Action Response Body
```json
{
    "value": [
        {
            "to": "+15550112233",
            "httpStatusCode": 200
        },
        {
            "to": "+15550112234",
            "httpStatusCode": 200
        }
    ]
}
```

#### Check OptOut Action Response Body
```json
{
    "value": [
        {
            "to": "+15550112233",
            "httpStatusCode": 200,
            "isOptedOut": true
        },
        {
            "to": "+15550112234",
            "httpStatusCode": 200,
            "isOptedOut": false
        }
    ]
}
```
## Sample Code to Use API

### C#

#### Prerequisites

- The .NET Core SDK version mush be higher than v6 for your operating system.
- An active Communication Services resource and connection string. [Create a Communication Services resource](https://learn.microsoft.com/azure/communication-services/quickstarts/create-communication-resource).
- An SMS-enabled telephone number. See [Get a phone number](https://learn.microsoft.com/azure/communication-services/quickstarts/telephony/get-phone-number) and `allowlisted` as described in the beginning of the article.

```cs
using System.Globalization;
using System.Security.Cryptography;
using System.Text;

// Sample for Add action. Replace with Check or Remove as necessary.
async Task SendOptOutAdd(string acsResourceConnectionString, string payload)
{
    const string ApiPrivatePreviewVersion = "2024-12-10-preview";

    const string dateHeader = "x-ms-date";

    string accesskey = GetConnectionStringPart(acsResourceConnectionString, "accesskey");
    var endpointUri = new Uri(GetConnectionStringPart(acsResourceConnectionString, "endpoint"));

    using var httpClient = new HttpClient();
    httpClient.BaseAddress = endpointUri;

    string method = "POST";
    string baseAddress = httpClient.BaseAddress.ToString().TrimEnd('/');
    var requestUri = new Uri($"{baseAddress}/sms/optouts:add?api-version={ApiPrivatePreviewVersion }", UriKind.RelativeOrAbsolute);
    string hashedBody = ComputeSha256Hash(payload);
    string utcNowString = DateTimeOffset.UtcNow.ToString("r", CultureInfo.InvariantCulture);
    string stringToSign = $"{method}\n{requestUri.PathAndQuery}\n{utcNowString};{requestUri.Host};{hashedBody}";
    string signature = ComputeHmacSha256Hash(accesskey, stringToSign);
    string authHeader = $"HMAC-SHA256 SignedHeaders={dateHeader};host;x-ms-content-sha256&Signature={signature}";

    using HttpRequestMessage request = new();
    request.Headers.TryAddWithoutValidation(dateHeader, utcNowString);
    request.Headers.TryAddWithoutValidation("x-ms-content-sha256", hashedBody);
    request.Headers.TryAddWithoutValidation("Authorization", authHeader);
    request.RequestUri = requestUri;
    request.Method = new HttpMethod(method);
    request.Content = new StringContent(payload, Encoding.UTF8, "application/json");

    HttpResponseMessage response = await httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead);

    Console.WriteLine(response.StatusCode);
    Console.WriteLine(await response.Content.ReadAsStringAsync());
    Console.WriteLine(response.Headers.ToString());
}

string ComputeSha256Hash(string rawData)
{
    using SHA256 sha256Hash = SHA256.Create();
    byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));
    return Convert.ToBase64String(bytes);
}

string ComputeHmacSha256Hash(string key, string rawData)
{
    using HMACSHA256 hmacSha256 = new HMACSHA256(Convert.FromBase64String(key));
    byte[] bytes = hmacSha256.ComputeHash(Encoding.ASCII.GetBytes(rawData));
    return Convert.ToBase64String(bytes);
}

string GetConnectionStringPart(string acsResourceConnectionString, string key)
{
    return acsResourceConnectionString.Split($"{key}=").Last().Split(';').First();
}

// Usage

const string ConnectionString = "endpoint=https://[CONTOSO].communication.azure.com/;accesskey=******";
var payload = System.Text.Json.JsonSerializer.Serialize(new
{
    from = "+15551234567", //replace with your allowed sender number
    recipients = new[] {
        new { to = "+15550112233" } //replace with your recipient
    },
});

await SendOptOutAdd(ConnectionString, payload);

```
### JavaScript

#### Prerequisites

- Browser or Node.js Active LTS and Maintenance LTS versions (8.11.1 and 10.14.1 are recommended).
- An active Communication Services resource and connection string. See [Create a Communication Services resource](https://learn.microsoft.com/azure/communication-services/quickstarts/create-communication-resource).
- An SMS-enabled telephone number. See [Get a phone number](https://learn.microsoft.com/azure/communication-services/quickstarts/telephony/get-phone-number).
- [CryptoJS](https://storage.googleapis.com/google-code-archive-downloads/v2/code.google.com/crypto-js/CryptoJS%20v3.1.2.zip) is JavaScript implementations of standard and secure cryptographic algorithms.


```html
<script src="Scripts/CryptoJS/sha256-min.js" type="text/javascript"></script>
<script src="Scripts/CryptoJS/hmac-sha256.js" type="text/javascript"></script>
<script src="Scripts/CryptoJS/enc-base64-min.js" type="text/javascript"></script>

```

```js
const ConnectionString = "endpoint=https://[CONTOSO].communication.azure.com/;accesskey=******";

// Sample for Add action. Replace with Check or Remove as necessary.
function sendOptOutAdd(acsResourceConnectionString, payload, apiVersion = "2024-12-10-preview")
{
    try
    {
        var acsRCS = acsResourceConnectionString
            .split(";")
            .map(i =>
            {
                var p = i.indexOf("=");
                return [i.substr(0, p), i.substr(p + 1)];
            })
            .reduce((a, i) => ({ ...a, [i[0]]: i[1] }), {});
        var uri = `${trimEnd(acsRCS.endpoint, "/")}/sms/optouts:add?api-version=${apiVersion}`;
        var url = new URL(uri);
        var method = "POST";
        var utcNow = new Date().toUTCString();
        var bodyJson = JSON.stringify(payload);
        var hashedBody = CryptoJS.SHA256(bodyJson).toString(CryptoJS.enc.Base64);
        var stringToSign = `${method}\n${url.pathname}${url.search}\n${utcNow};${url.host};${hashedBody}`;
        var signature = CryptoJS.HmacSHA256(stringToSign, CryptoJS.enc.Base64.parse(acsRCS.accesskey)).toString(CryptoJS.enc.Base64);

        fetch(uri, {
            method: method,
            headers: {
                "content-type": "application/json",
                "x-ms-date": utcNow,
                "x-ms-content-sha256": hashedBody,
                Authorization: `HMAC-SHA256 SignedHeaders=x-ms-date;host;x-ms-content-sha256&Signature=${signature}`
            },
            body: bodyJson
        })
        .then(response => response.json())
        .then(console.warn)
        .catch(console.error);
    }
    catch (ex)
    {
        console.error(ex);
    }
}

function trimEnd(s, c)
{
    while (s.slice(-1) == c)
        s = s.slice(0, -1);
    return s;
}

// Usage

var payload = {
    from: "+15551234567",
    recipients: [
        { to: "+15550112233" }
    ],
};

sendOptOutAdd(ConnectionString, payload);

```
### Java

#### Prerequisites

- Java Development Kit (JDK) version 8 or above.
- An active Communication Services resource and connection string. See [Create a Communication Services resource](https://learn.microsoft.com/azure/communication-services/quickstarts/create-communication-resource).
- An SMS-enabled telephone number. See [Get a phone number](https://learn.microsoft.com/azure/communication-services/quickstarts/telephony/get-phone-number).


```java
// Sample for Add action. Replace with Check or Remove as necessary.
public class App
{
    public static void main(String[] args) throws Exception
    {
        String connectionString = "endpoint=https://[CONTOSO].communication.azure.com/;accesskey=******";

        OptOutRequest payload = new OptOutRequest();
        payload.from = "+15551234567";
        payload.recipients = new ArrayList<Recipient>();
        payload.recipients.add(new Recipient("+15550112233"));

        SendOptOut(connectionString, payload);
    }

    public static void SendOptOutAdd(String connectionString, OptOutRequest payload) throws Exception
    {
        String apiVersion = "2024-12-10-preview";

        String[] arrOfStr = connectionString.split(";");
        String endpoint = arrOfStr[0].split("=")[1];
        String accessKey = arrOfStr[1].split("=")[1];
        String body = new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT).writeValueAsString(payload);
        String dateHeaderName = "x-ms-date";
        DateTimeFormatter headerDateFormat = DateTimeFormatter.ofPattern("EEE, dd MMM yyyy HH:mm:ss z", Locale.ENGLISH).withZone(ZoneId.of("GMT"));
        String dateHeader = headerDateFormat.format(Instant.now());
        String verb = "POST";
        URI uri = URI.create(endpoint + "sms/optouts:add?api-version==" + apiVersion);
        String hostName = uri.getHost();
        String pathAndQuery = uri.getPath() + "?" + uri.getQuery();
        String encodedHash = Base64.getEncoder().encodeToString(MessageDigest.getInstance("SHA-256").digest(body.getBytes(StandardCharsets.UTF_8)));
        String stringToSign = verb + '\n' + pathAndQuery + '\n' + dateHeader + ';' + hostName + ';' + encodedHash;
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(Base64.getDecoder().decode(accessKey.getBytes()), "HmacSHA256"); 
        mac.init(secretKeySpec);
        String signature = Base64.getEncoder().encodeToString(mac.doFinal(stringToSign.getBytes()));
        String authHeader = "HMAC-SHA256 SignedHeaders=" + dateHeaderName + ";host;x-ms-content-sha256&Signature=" + signature;

        HttpClient client = HttpClients.custom().build();
        HttpUriRequest request = RequestBuilder
            .post(uri)
            .setHeader(HttpHeaders.CONTENT_TYPE, "application/json")
            .setHeader(dateHeaderName, dateHeader)
            .setHeader("x-ms-content-sha256", encodedHash)
            .setHeader("Authorization", authHeader)
            .setEntity(new StringEntity(body, "UTF-8"))
            .build();
        HttpResponse r = client.execute(request);
        HttpEntity entity = r.getEntity();
    }
}

public class OptOutRequest
{
    public String from;
    public ArrayList<Recipient> recipients;
}

public class Recipient
{
    public String to;
}
```
