---
title: Include file
description: include file
services: azure-communication-services
author: dbasantes

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 12/06/2024
ms.topic: include
ms.custom: Include file
ms.author: dbasantes
---

Get started with Azure Communication Services SMS Opt-out API by applying the following C# sample code.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- The .NET Core SDK version must be higher than v6 for your operating system.
- An active Communication Services resource and connection string. See [Create a Communication Services resource](../../create-communication-resource.md).
- An SMS-enabled telephone number. See [Get a phone number](../../telephony/get-phone-number.md).

## Sample code to use Opt-Out API

This sample demonstrates how to use the Opt-Out Management API in C# to programmatically add, remove, or check opt-out entries.

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

