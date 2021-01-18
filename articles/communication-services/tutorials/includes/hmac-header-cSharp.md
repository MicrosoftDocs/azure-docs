---
title: Sign an HTTP request C#
description: This is the C# version of singing an HTTP request for Communication Services.
author: apistrak
manager: soricos
services: azure-communication-services

ms.author: apistrak
ms.date: 01/15/2021
ms.topic: include
ms.service: azure-communication-services
---
## Prerequisites

Before you get started, make sure to:
- Create an Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- Install [Visual Studio](https://visualstudio.microsoft.com/downloads/) 
- Create an Azure Communication Services resource. For details, see [Create an Azure Communication Resource](../../create-communication-resource.md). You'll need to record your **resourceEndpoint** and  **resourceAccessKey** for this tutorial.
 


## Overview
Access key authentication uses a shared secret key to generate an HMAC for each HTTP request computed by using the SHA256 algorithm, and sends it in the `Authorization` header using the `HMAC-SHA256` scheme.

```
Authorization: "HMAC-SHA256 SignedHeaders=date;host;x-ms-content-sha256&Signature=<hmac-sha256-signature>"
```

hmac-sha256-signature consists of : 
1. HTTP Verb (e.g. `GET` or `PUT`)
2. HTTP request path
3. Date
4. Host
5. x-ms-content-sha256

## Setting up
The following steps describe how to construct the Authorization header:
### Create a new C# application

In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `SignHmacTutorial`. This command creates a simple "Hello World" C# project with a single source file: **Program.cs**.

```console
dotnet new console -o SignHmacTutorial
```

Change your directory to the newly created app folder and use the `dotnet build` command to compile your application.

```console
cd SignHmacTutorial
dotnet build
```

## Install the package

Install the  package Newtonsoft.Json, used for body serialization.

```console
dotnet add package Newtonsoft.Json --version 12.0.3
```

Update the Main method declaration to support async code
Use the following code to begin:

```csharp
using System;
using System.Globalization;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace SignHmacTutorial
{
    class Program
    {
        static async Task Main(string[] args)
        {
            Console.WriteLine("Azure Communication Services - Sign an HTTP request Tutorial");

            // Tutorial code goes here
        }
    }
}
```
## Create a request message
For this specific example we will try to sign request to create new identity calling Api of version 2020-07-20-preview2
Add following code into Main method:

```csharp
string resourceEndpoint = "resourceEndpoint";
//Create an uri you are going to call
var requestUri = new Uri($"{resourceEndpoint}/identities?api-version=2020-07-20-preview2");

//Endpoint identities?api-version=2020-07-20-preview2 accepts list of scopes as a body
var body = new[] { "chat" };

//Create your requestMessage
var requestMessage = new HttpRequestMessage(HttpMethod.Post, requestUri)
{
    Content = new StringContent(JsonConvert.SerializeObject(body), Encoding.UTF8)
};
```
replace "resourceEndpoint" with your real resource endpoint value.

## Create content hash
Content hash is a part of signature. 
Use following code to create a method to hash a content and add it into Progma.cs under Main method.
```csharp
async static Task<string> ComputeContentHash(HttpRequestMessage requestMessage)
{
    string content = "";
    if (requestMessage?.Content != null)
    {
        content = await requestMessage.Content.ReadAsStringAsync();
    }

    using var sha256 = SHA256.Create();
    byte[] hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(content));
    return Convert.ToBase64String(hashedBytes);
}
```

## Compute a signature
Prepare a method to compute your signature.
Use following code to create a method for computing a signature.

```csharp
static string ComputeSignature(string stringToSign)
{
    string secret = "resourceAccessKey";

    using (var hmacsha256 = new HMACSHA256(Convert.FromBase64String(secret)))
    {
        var bytes = Encoding.ASCII.GetBytes(stringToSign);
        var hashedBytes = hmacsha256.ComputeHash(bytes);
        return Convert.ToBase64String(hashedBytes);
    }
} 
```
replace "resourceAccessKey" with access key of your real Azure Communication Services resource.

## Create an authorization header string
Prepare a string will be used in authorization header.
steps:
1. Compute a content hash
2. Specify the Coordinated Universal Time (UTC) timestamp
3. Prepare a string to sign
4. Compute the signature
5. Concatenate the string, which will be used in authorization header
 Add following code into Main method:
```csharp
//Compute a content hash
var contentHash = await ComputeContentHash(requestMessage);
//Specify the Coordinated Universal Time (UTC) timestamp
var date = DateTimeOffset.UtcNow.ToString("r", CultureInfo.InvariantCulture);
//Prepare a string to sign
var stringToSign = $"{requestMessage.Method}\n{requestMessage.RequestUri.PathAndQuery}\n{date};{requestMessage.RequestUri.Authority};{contentHash}";
//Compute the signature
var signature = ComputeSignature(stringToSign);
//Concatenate the string, which will be used in authorization header
var authorizationHeader = $"HMAC-SHA256 SignedHeaders=date;host;x-ms-content-sha256&Signature={signature}";
```

## Add headers to requestMessage
In previous steps we prepared value for authorization part.
Add following code into Main method to add headers to requestMessage
```csharp
//Add content hash header
requestMessage.Headers.Add("x-ms-content-sha256", contentHash);
//add date header
requestMessage.Headers.Add("Date", date);
//add Authorization header
requestMessage.Headers.Add("Authorization", authorizationHeader);
//add host header
requestMessage.Headers.Add("Host", requestMessage.RequestUri.Authority);
```

## Test the client
Call the endpoint using HttpClient and check the response.
```csharp
HttpClient httpClient = new HttpClient();
httpClient.BaseAddress = requestUri; 

var response = await httpClient.SendAsync(requestMessage);
var responseString = await response.Content.ReadAsStringAsync();

Console.WriteLine(responseString);
```


